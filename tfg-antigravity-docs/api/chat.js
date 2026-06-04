// api/chat.js
const MiniSearch = require('minisearch');
const fs = require('fs');
const path = require('path');

let chunks = null;
let miniSearch = null;

const rateLimiter = new Map();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 12;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimiter.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimiter.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

if (typeof global.rateLimitInterval === 'undefined') {
  global.rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimiter) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW * 2) rateLimiter.delete(ip);
    }
  }, 120_000);
}

function getSearch() {
  if (!miniSearch) {
    const t0 = Date.now();
    try {
      const indexRaw = fs.readFileSync(path.join(__dirname, '..', 'static', 'search-index.json'), 'utf8');
      chunks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'chunks.json'), 'utf8'));
      miniSearch = MiniSearch.loadJSON(indexRaw, {
        fields: ['title', 'heading', 'subheading', 'text', 'keywordsText'],
        storeFields: ['title', 'heading', 'subheading', 'text', 'slug', 'anchor', 'chunkType', 'keywords', 'keywordsText', 'chapterOrder', 'sourceFile', 'artifact']
      });
      console.log(`[api/chat] MiniSearch loaded in ${Date.now() - t0}ms, ${Object.keys(chunks).length} chunks`);
    } catch (err) {
      console.error('Error cargando los archivos estáticos del índice:', err);
      throw new Error('IndexFilesMissing');
    }
  }
  return miniSearch;
}

async function callWithTimeout(url, options, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      const error = new Error(`LLM timeout after ${timeoutMs}ms`);
      error.status = 504;
      throw error;
    }
    throw err;
  }
}

async function callGroq({ apiKey, prompt, systemPrompt, temperature = 0.2, maxTokens = 500 }) {
  const response = await callWithTimeout(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    },
    6000
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`Groq ${response.status}: ${errorText.slice(0, 200)}`);
    error.provider = 'groq';
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content?.trim() || '',
    provider: 'groq',
    model: data.model,
    tokens: data.usage?.total_tokens,
  };
}

async function callDeepSeek({ apiKey, prompt, systemPrompt, temperature = 0.2, maxTokens = 500 }) {
  const response = await callWithTimeout(
    'https://api.deepseek.com/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
        stream: false,
      }),
    },
    9000
  );

  if (!response.ok) {
    const errorText = await response.text();
    const error = new Error(`DeepSeek ${response.status}: ${errorText.slice(0, 200)}`);
    error.provider = 'deepseek';
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  return {
    text: data.choices?.[0]?.message?.content?.trim() || '',
    provider: 'deepseek',
    model: data.model,
    tokens: data.usage?.total_tokens,
  };
}

async function callLLM({ prompt, systemPrompt, temperature = 0.2, maxTokens = 500 }) {
  const groqKey = process.env.GROQ_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const errors = [];

  console.log('[api/chat] LLM config:', {
    groq: !!groqKey,
    deepseek: !!deepseekKey,
    promptLen: prompt.length,
  });

  if (groqKey) {
    try {
      const result = await callGroq({ apiKey: groqKey, prompt, systemPrompt, temperature, maxTokens });
      console.log(`[api/chat] ✓ ${result.provider}/${result.model} — ${result.tokens} tokens`);
      return result;
    } catch (error) {
      console.error(`[api/chat] ✗ Groq: ${error.message}`);
      errors.push({ provider: 'groq', message: error.message, status: error.status });
    }
  }

  if (deepseekKey) {
    try {
      const result = await callDeepSeek({ apiKey: deepseekKey, prompt, systemPrompt, temperature, maxTokens });
      console.log(`[api/chat] ✓ ${result.provider}/${result.model} — ${result.tokens} tokens`);
      return result;
    } catch (error) {
      console.error(`[api/chat] ✗ DeepSeek: ${error.message}`);
      errors.push({ provider: 'deepseek', message: error.message, status: error.status });
    }
  }

  const error = new Error(
    errors.length
      ? `All providers failed: ${errors.map(e => `${e.provider}:${e.status}`).join(', ')}`
      : 'No LLM provider configured'
  );
  error.provider = 'none';
  error.status = errors.some(e => e.status === 429) ? 429 : 502;
  error.details = errors;
  throw error;
}

function normalizeText(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function classifyIntent(question, mode = 'normal') {
  if (mode === 'simple') return 'simple';

  const scores = { causal: 0, quantitative: 0, comparison: 0, timeline: 0, glossary: 0, visual: 0, simple: 0, general: 0 };
  const norm = normalizeText(question);

  const match = (terms, type, weight = 1) => {
    terms.forEach(t => { if (norm.includes(t)) scores[type] += weight; });
  };

  match(['grafica', 'figura', 'simulador', 'mapa', 'tabla', 'imagen', 'ensename', 'muestrame', 'mostrar', 'ver grafica', 'ver figura'], 'visual', 4);
  match(['evolucion', 'evoluciono', 'durante', '27 segundos', 'segundos criticos', 'cronologia', 'secuencia', 'minuto a minuto'], 'timeline', 3);
  match(['cuanta', 'cuanto', 'cifra', 'porcentaje', 'demanda', 'mw', 'hz', 'mvar', 'kv', 'solar', 'mix'], 'quantitative', 2);
  match(['reactiva', 'potencia reactiva', 'mvar', 'q-v', 'sobretension'], 'causal', 2);
  match(['por que', 'como amplifico', 'como actuo', 'mecanismo', 'detonante', 'causa', 'agravo', 'tap-lag', 'ufls', 'colapso en vez de'], 'causal', 3);
  match(['compara', 'comparar', 'vs', 'frente a', 'diferencia entre', 'discrepan', 'ree', 'icai', 'entso-e'], 'comparison', 3);
  match(['que es', 'define', 'explicame el concepto', 'que significa'], 'glossary', 4);
  match(['sencill', 'no sabe', 'como si fuera', 'facil', 'para tontos'], 'simple', 1);

  let maxScore = 0;
  let detectedIntent = 'general';
  const priorities = ['visual', 'comparison', 'glossary', 'causal', 'quantitative', 'timeline', 'simple', 'general'];

  Object.entries(scores).forEach(([intent, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    } else if (score === maxScore && score > 0) {
      if (priorities.indexOf(intent) < priorities.indexOf(detectedIntent)) {
        detectedIntent = intent;
      }
    }
  });

  return maxScore > 0 ? detectedIntent : 'general';
}

function getIntentInstruction(intent) {
  const map = {
    causal: "Estructura la respuesta como cadena causal: causa raíz → mecanismo → consecuencia. Distingue entre detonante principal, factor agravante y síntoma.",
    quantitative: "Prioriza cifras exactas, unidades y comparación entre magnitudes. Da número, unidad e interpretación. No redondees si el contexto da cifras precisas.",
    comparison: "Organiza por posiciones institucionales. Separa la versión del Gobierno/REE, ICAI/AELEC y ENTSO-E. Identifica de forma muy clara cuál es el consenso y cuál la discrepancia.",
    timeline: "Ordena cronológicamente. Usa timestamps si aparecen en el contexto.",
    glossary: "Define primero el concepto de forma rigurosa, luego explica inmediatamente su papel o utilidad concreta en el colapso del 28-A.",
    visual: "Relaciona activamente la respuesta con figuras, mapas, tablas o simuladores si aparecen en el contexto recuperado.",
    simple: "Explica con lenguaje sumamente claro, sin perder exactitud física. Usa una analogía técnica breve solo si ayuda sustancialmente. Evita jerga innecesaria.",
    general: "Responde de forma técnica, directa y conversacional."
  };
  return map[intent] || map.general;
}

// ── Tabla de boosts por intent × chunkType ─────────────────────
const INTENT_BOOST_TABLE = {
  'comparison:comparison':     1.45,
  'comparison:table':          1.8,
  'quantitative:quantitative': 1.45,
  'quantitative:master_data':  1.45,
  'quantitative:table':        1.8,
  'timeline:timeline':         1.45,
  'glossary:glossary':         1.5,
  'visual:graphic':            1.45,
  'visual:data_figure':        2.0,
  'causal:causal':             1.45,
  'causal:data_figure':        1.25,
};

// ── Reglas de boost por keyword en la pregunta ─────────────────
const KEYWORD_BOOST_RULES = [
  {
    keywords: ['tap-lag', 'tap lag', 'oltc'],
    textMatch: ['tap-lag', 'taplag', 'oltc'],
    boost: 1.8,
    slugMatch: ['analisis-incidente'],
    slugBoost: 1.35,
  },
  {
    keywords: ['ufls', 'deslastre', 'subfrecuencia'],
    textMatch: ['ufls', 'deslastre'],
    boost: 1.7,
  },
  {
    keywords: ['gfm', 'grid forming', 'grid-forming'],
    chunkTypeMatch: 'glossary',
    typeBoost: 1.8,
    textMatch: ['grid-forming', 'gfm'],
    boost: 1.4,
  },
  {
    keywords: ['frecuencia', 'frequency', 'rocof', 'nadir', '27 segundos'],
    intentFilter: 'visual',
    chunkTypeMatch: 'graphic',
    typeBoost: 2.0,
    textMatch: ['frecuencia', 'frequency', 'rocof', 'nadir'],
    boost: 1.4,
  },
  {
    keywords: ['francia', 'reposicion', 'reposición', 'rte', 'interconexion'],
    textMatch: ['francia', 'rte', 'reposicion', 'reposición'],
    boost: 1.45,
  },
  {
    keywords: ['coste', 'opex', 'capex', 'operacion reforzada'],
    slugMatch: ['consecuencias-financieras'],
    slugBoost: 1.6,
    textMatch: ['operacion reforzada', 'operación reforzada'],
    boost: 1.6,
  },
  {
    keywords: ['inercia', 'rocof'],
    slugMatch: ['analisis-incidente', 'resiliencia-futuro', 'resumen-de-cifras'],
    slugBoost: 1.4,
    textMatch: ['inercia', 'rocof', 'h='],
    boost: 1.3,
  },
  {
    keywords: ['como empezo', 'como inicio', 'origen del apagon',
               'empezo el apagon', 'inicio el apagon', 'por que se fue la luz'],
    slugMatch: ['analisis-incidente'],
    slugBoost: 1.8,
    textMatch: ['tap-lag', 'sobretension', 'colapso de tension'],
    boost: 1.35,
    extraSlugBoosts: [
      { slug: 'contexto',         factor: 1.45 },
      { slug: 'resumen-de-cifras', factor: 1.35 },
    ],
  },
];

// ── Tabla de penalizaciones por slug ───────────────────────────
const SLUG_PENALTY_RULES = [
  {
    slugContains: 'uso-ia',
    unless: ['ia', 'inteligencia artificial', 'llm', 'prompt', 'uso de ia'],
    factor: 0.35,
  },
  {
    slugContains: 'dimension-europea',
    unless: ['europa', 'europea', 'francia', 'portugal', 'entso-e', 'rte', 'interconexion'],
    factor: 0.55,
  },
  {
    slugContains: 'impacto-comunicativo',
    onlyWhen: ['como empezo', 'como inicio', 'origen del apagon',
               'empezo el apagon', 'inicio el apagon', 'por que se fue la luz'],
    factor: 0.45,
  },
  {
    slugContains: 'consecuencias-financieras',
    onlyWhen: ['como empezo', 'como inicio', 'origen del apagon',
               'empezo el apagon', 'inicio el apagon', 'por que se fue la luz'],
    factor: 0.45,
  },
];

function applySlugPenalties(score, chunk, normQ) {
  const slug = normalizeText(chunk?.slug || '');
  let adjusted = score;

  for (const rule of SLUG_PENALTY_RULES) {
    if (!slug.includes(rule.slugContains)) continue;

    if (rule.unless) {
      const matched = rule.unless.some(t => normQ.includes(t));
      if (!matched) adjusted *= rule.factor;
    }

    if (rule.onlyWhen) {
      const matched = rule.onlyWhen.some(t => normQ.includes(t));
      if (matched) adjusted *= rule.factor;
    }
  }

  return adjusted;
}

function rerankResultsByIntent(results, chunksData, intent, question) {
  const normQ = normalizeText(question);
  const qTerms = normQ.split(/\s+/).filter(t => t.length > 3);

  return results.map(r => {
    const chunk = chunksData[r.id];
    if (!chunk) return { ...r, adjustedScore: 0 };

    let score = r.score || 0;
    const ct = chunk.chunkType || 'normal';
    const text = normalizeText(chunk.text || '');
    const slug = normalizeText(chunk.slug || '');
    const head = `${normalizeText(chunk.heading || '')} ${normalizeText(chunk.subheading || '')} ${slug}`;
    const title = normalizeText(chunk.title || '');
    const heading = normalizeText(chunk.heading || '');
    const kws = Array.isArray(chunk.keywords) ? chunk.keywords : [];

    // 1. Boost por intent × chunkType
    const tableKey = `${intent}:${ct}`;
    if (INTENT_BOOST_TABLE[tableKey]) score *= INTENT_BOOST_TABLE[tableKey];

    // Caso especial: causal + data_figure solo si el artifact ID aparece en la pregunta
    if (intent === 'causal' && ct === 'data_figure' && chunk.artifact) {
      if (!normQ.includes(normalizeText(chunk.artifact.id))) score /= 1.25;
    }

    // 2. Boost por keywords del chunk
    if (kws.some(kw => normQ.includes(normalizeText(kw)))) score *= 1.2;

    // 3. Boost por coincidencia en título/heading
    if (qTerms.some(t => title.includes(t) || heading.includes(t))) score *= 1.15;

    // 4. Boosts por reglas de keyword (tabla declarativa)
    for (const rule of KEYWORD_BOOST_RULES) {
      if (!rule.keywords.some(kw => normQ.includes(kw))) continue;
      if (rule.intentFilter && intent !== rule.intentFilter) continue;

      if (rule.textMatch?.some(tm => text.includes(tm) || head.includes(tm))) {
        score *= rule.boost;
      }
      if (rule.slugMatch?.some(sm => slug.includes(sm))) {
        score *= (rule.slugBoost || 1);
      }
      if (rule.chunkTypeMatch && ct === rule.chunkTypeMatch) {
        score *= (rule.typeBoost || 1);
      }
      if (rule.extraSlugBoosts) {
        for (const extra of rule.extraSlugBoosts) {
          if (slug.includes(extra.slug)) score *= extra.factor;
        }
      }
    }

    // 5. Penalización por chunk corto
    if (!chunk.text || chunk.text.length < 100) score *= 0.7;

    // 6. Penalizaciones por slug
    score = applySlugPenalties(score, chunk, normQ);

    return { ...r, adjustedScore: score };
  }).sort((a, b) => b.adjustedScore - a.adjustedScore);
}


function selectContextChunks(rerankedResults, chunksData, maxChunks = 7) {
  if (rerankedResults.length === 0) return [];
  const bestScore = rerankedResults[0].adjustedScore;
  const selectedPairs = [];
  const slugCount = {};

  for (const r of rerankedResults) {
    const chunk = chunksData[r.id];
    if (!chunk) continue;
    
    const chunkType = chunk.chunkType || 'normal';

    if (r.adjustedScore < bestScore * 0.18 && chunkType !== 'master_data' && chunkType !== 'glossary') {
      if (selectedPairs.length >= 3) break;
    }

    const slug = chunk.slug || 'unknown';
    slugCount[slug] = (slugCount[slug] || 0) + 1;
    if (slugCount[slug] > 2 && selectedPairs.length >= 2 && chunkType !== 'master_data') continue;

    selectedPairs.push({ result: r, chunk });
    if (selectedPairs.length >= maxChunks) break;
  }
  return selectedPairs;
}

function buildChunkUrl(chunk) {
  const slug = chunk?.slug || '';
  const anchor = chunk?.anchor || '';
  return anchor ? `${slug}#${anchor}` : slug;
}

function makeExcerpt(text, maxLength = 220) {
  if (!text || typeof text !== 'string') return '';
  const clean = text.replace(/Capítulo:.*?\n\n/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

function buildSources(selectedPairs, maxItems = 5) {
  const sources = [];
  const seen = new Set();
  
  if (selectedPairs.length === 0) return sources;
  const maxScore = selectedPairs[0].result.adjustedScore || 1;

  for (const { result, chunk } of selectedPairs) {
    const title = chunk.title || 'Sección desconocida';
    const heading = chunk.heading || '';
    const slug = chunk.slug || '';
    const anchor = chunk.anchor || '';
    
    const url = buildChunkUrl(chunk);
    const key = url || title;
    
    if (!seen.has(key)) {
      seen.add(key);
      const relevance = parseFloat((result.adjustedScore / maxScore).toFixed(2));
      sources.push({
        title,
        heading,
        slug,
        anchor,
        url, chunkType: chunk.chunkType,
        relevance,
        excerpt: makeExcerpt(chunk.text, 220)
      });
      if (sources.length >= maxItems) break;
    }
  }
  return sources;
}

function extractFiguresFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const figures = [];
  const seen = new Set();
  const pushFigure = (label, path) => {
    if (!path || !path.startsWith('/figuras/')) return;
    const cleanPath = path.trim();
    const cleanLabel = (label || cleanPath.split('/').pop() || 'Figura').replace(/\s+/g, ' ').trim();
    if (seen.has(cleanPath)) return;
    seen.add(cleanPath);
    figures.push({ label: cleanLabel, path: cleanPath });
  };

  const mdRegex = /!\[([^\]]*)\]\((\/figuras\/[^)\s]+\.(?:png|jpg|jpeg|svg|webp))\)/gi;
  let match;
  while ((match = mdRegex.exec(text)) !== null) pushFigure(match[1], match[2]);
  
  const rawRegex = /(\/figuras\/[A-Za-z0-9_\-./]+\.(?:png|jpg|jpeg|svg|webp))/gi;
  while ((match = rawRegex.exec(text)) !== null) pushFigure(match[1].split('/').pop(), match[1]);

  return figures;
}

function buildSuggestedFigures(selectedPairs, maxItems = 3) {
  const figures = [];
  const seen = new Set();
  for (const { chunk } of selectedPairs) {
    if (!chunk || !chunk.text) continue;
    const extracted = extractFiguresFromText(chunk.text);
    for (const f of extracted) {
      if (!seen.has(f.path)) {
        seen.add(f.path);
        figures.push(f);
        if (figures.length >= maxItems) return figures;
      }
    }
  }
  return figures;
}

function buildRelatedChapters(selectedPairs, maxItems = 5) {
  const chapters = new Set();
  for (const { chunk } of selectedPairs) {
    const name = (chunk.title && chunk.title.length > 3) ? chunk.title : chunk.heading;
    if (name) chapters.add(name);
    if (chapters.size >= maxItems) break;
  }
  return Array.from(chapters);
}

function computeConfidence(selectedPairs, usedExpandedSearch) {
  if (selectedPairs.length === 0) {
    return { confidence: 'sin_evidencia', confidence_reason: 'No se recuperaron fragmentos útiles.' };
  }
  const validScores = selectedPairs.map(p => p.result.adjustedScore || 0).filter(s => s > 0);
  const bestScore = validScores[0] || 0;
  const thirdScore = validScores[2] || 0;
  
  const uniqueUrls = new Set(selectedPairs.map(p => buildChunkUrl(p.chunk)).filter(Boolean));
  const hasSeveralSources = uniqueUrls.size >= 2;
  const hasThreeResults = selectedPairs.length >= 3;
  const scoreCoherence = bestScore > 0 && (thirdScore / bestScore) >= 0.35;

  if (hasThreeResults && hasSeveralSources && scoreCoherence && !usedExpandedSearch) {
    return { confidence: 'alta', confidence_reason: 'La respuesta se apoya en varios fragmentos convergentes y recuperados de forma directa.' };
  }
  if ((hasThreeResults && scoreCoherence) || (hasSeveralSources && !usedExpandedSearch)) {
    return { confidence: 'media', confidence_reason: 'Evidencia recuperada suficiente, aunque menos homogénea.' };
  }
  return { confidence: 'baja', confidence_reason: 'Evidencia parcial, escasa o con fuerte dependencia de expansión semántica.' };
}

function getAllArtifactChunks(chunksData) {
  return Object.values(chunksData || {}).filter(c => c && c.artifact);
}

function scoreArtifactForQuestion(artifact, chunk, intent, question, baseScore = 1, source = 'global') {
  const q = normalizeText(question);
  const id = normalizeText(artifact?.id || '');
  const title = normalizeText(artifact?.title || '');
  const desc = normalizeText(artifact?.description || '');
  const origin = normalizeText(artifact?.origin || '');
  const text = normalizeText(chunk?.text || '');
  const haystack = `${id} ${title} ${desc} ${origin} ${text}`;

  let score = baseScore;

  if (source === 'selected') score *= 1.4;

  if (intent === 'quantitative' && artifact.type === 'table') score *= 2.0;
  if (intent === 'comparison' && artifact.type === 'table') score *= 2.0;
  if (intent === 'visual' && artifact.source === 'annex_d') score *= 2.4;
  if (intent === 'visual' && artifact.type === 'interactive') score *= 1.5;
  if (intent === 'timeline' && artifact.type === 'table') score *= 1.6;

  const boostIds = (ids, factor) => {
    if (ids.some(target => id.includes(normalizeText(target)))) score *= factor;
  };

  if (q.includes('discrepan') || q.includes('ree') || q.includes('icai') || q.includes('entso-e') || q.includes('gobierno')) {
    boostIds(['comparativa-conclusiones-entidades', 'compass-lexecon', 'indisponibilidad-generacion-convencional'], 3.0);
  }

  if (q.includes('reactiva') || q.includes('mvar') || q.includes('q-v') || q.includes('sobretension')) {
    boostIds(['maniobras-compensacion-reactiva', 'inyeccion-reactiva-distribucion', 'asimetria_balance_reactiva_sur', 'fluctuaciones_tension_previas', 'tensiones-nudos-criticos'], 3.0);
  }

  if (q.includes('frecuencia') || q.includes('rocof') || q.includes('hz') || q.includes('nadir') || q.includes('27 segundos')) {
    boostIds(['evolucion-frecuencia-rocof', 'frequency_voltage_carmona', 'tension_frecuencia_colapso'], 3.0);
  }

  if (q.includes('grafica') || q.includes('figura') || q.includes('ensename') || q.includes('muestrame')) {
    if (artifact.source === 'annex_d') score *= 2.0;
    if (artifact.type === 'interactive') score *= 1.2;
  }

  if (q.includes('ufls') || q.includes('deslastre') || q.includes('subfrecuencia')) {
    boostIds(['escalones-ufls', 'tension_frecuencia_colapso', 'evolucion-frecuencia-rocof'], 3.0);
  }

  if (q.includes('francia') || q.includes('rte') || q.includes('reposicion') || q.includes('interconexion')) {
    boostIds(['interconexion_francia_colapso', 'perdida_sincronismo_frontera', 'evolucion_carga_repuesta_francia', 'intercambios-internacionales-minuto', 'recuperacion-demanda-espana', 'recuperacion-portugal'], 3.0);
  }

  if (q.includes('coste') || q.includes('opex') || q.includes('capex') || q.includes('operacion reforzada')) {
    boostIds(['costes-economicos', 'coste_optimo_ers', 'ers_revenue_stacking'], 3.0);
  }

  if (q.includes('solar') || q.includes('mix') || q.includes('generacion') || q.includes('renovable')) {
    boostIds(['mix-generacion-12-30', 'ree_generation_mix_28april', 'mix_comparativo_2010_2024'], 3.0);
  }

  if (q.includes('demanda') || q.includes('perdio') || q.includes('perdida')) {
    boostIds(['load-shedding-es-pt', 'demand-shedding-es', 'recuperacion_demanda_peninsular'], 2.2);
  }

  const qTerms = q.split(/\s+/).filter(t => t.length > 4);
  const matches = qTerms.filter(t => haystack.includes(t)).length;
  score *= 1 + Math.min(matches * 0.08, 0.5);

  return score;
}

function buildVisualArtifacts(selectedPairs, chunksData, intent, question, maxItems = 4) {
  const candidates = [];

  for (const pair of selectedPairs) {
    if (pair.chunk?.artifact) {
      candidates.push({
        artifact: pair.chunk.artifact,
        chunk: pair.chunk,
        baseScore: 1,
        source: 'selected'
      });
    }
  }

  // Solo añadir globales que NO estén ya en selectedPairs
  const selectedArtifactIds = new Set(
    selectedPairs
      .filter(p => p.chunk?.artifact)
      .map(p => p.chunk.artifact.id)
  );

  for (const chunk of getAllArtifactChunks(chunksData)) {
    if (selectedArtifactIds.has(chunk.artifact.id)) continue;
    candidates.push({
      artifact: chunk.artifact,
      chunk,
      baseScore: 1,
      source: 'global'
    });
  }

  const scored = candidates.map(c => ({
    ...c,
    score: scoreArtifactForQuestion(c.artifact, c.chunk, intent, question, c.baseScore, c.source)
  }));

  const bestByKey = new Map();

  for (const item of scored) {
    const key = `${item.artifact.type}:${item.artifact.id}`;
    const prev = bestByKey.get(key);
    if (!prev || item.score > prev.score) bestByKey.set(key, item);
  }

  const sorted = [...bestByKey.values()].sort((a, b) => b.score - a.score);
  const maxScore = sorted[0]?.score || 1;

  return sorted
    .filter(item => item.source === 'selected' || item.score >= maxScore * 0.35)
    .slice(0, maxItems)
    .map(item => ({
      ...item.artifact,
      relevance: parseFloat((item.score / maxScore).toFixed(2))
    }));
}

function buildFollowUps(question, selectedPairs, intent, maxItems = 3) {
  const q = normalizeText(question);
  const suggestions = [];
  const add = (text) => { if (text && !suggestions.includes(text)) suggestions.push(text); };

  if (q.includes('como empezo') || q.includes('como inicio') || q.includes('por que se fue la luz') || q.includes('explicame de forma sencilla') || q.includes('no se nada')) {
    add('¿Cuál fue la causa física principal frente a los factores agravantes?');
    add('¿Cómo se conectan Tap-Lag, potencia reactiva y pérdida de generación?');
    add('¿Por qué no fue simplemente un problema de baja inercia?');
  } else if (q.includes('coste') || q.includes('opex') || q.includes('capex') || q.includes('operacion reforzada')) {
    add('¿Por qué la Operación Reforzada es más cara que invertir en resiliencia?');
    add('¿Qué parte del coste corresponde a OPEX recurrente y cuál a CAPEX preventivo?');
    add('¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?');
  } else if (q.includes('francia') || q.includes('rte') || q.includes('interconexion') || q.includes('reposicion')) {
    add('¿Qué papel jugó la interconexión con Francia en el punto de no retorno?');
    add('¿Cómo se combinó el soporte de Francia con el Black Start hidroeléctrico?');
    add('¿Por qué la condición de isla energética agravó el apagón ibérico?');
  } else if (q.includes('figura') || q.includes('simulador') || q.includes('grafica') || q.includes('mapa') || q.includes('tabla')) {
    add('¿Qué simulador muestra mejor la secuencia completa del colapso?');
    add('¿Qué figura ayuda a distinguir frecuencia, tensión y potencia reactiva?');
    add('¿Dónde se ve mejor la caída de frecuencia durante los 27 segundos críticos?');
  } else if (q.includes('gfm') || q.includes('grid forming') || q.includes('bess')) {
    add('¿En qué se diferencia un inversor grid-forming de uno grid-following?');
    add('¿Por qué los BESS-GFM podrían sustituir parte de la inercia síncrona?');
    add('¿Qué servicios de estabilidad debería remunerar el mercado ERS?');
  } else if (q.includes('tap-lag') || q.includes('oltc')) {
    add('¿Cómo amplificó el Tap-Lag la sobretensión en la red de 220 kV?');
    add('¿Por qué el SCADA de REE no veía la tensión real de los secundarios?');
  } else if (q.includes('ufls') || q.includes('deslastre')) {
    add('¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?');
    add('¿Qué diferencia hay entre un colapso de frecuencia y uno de sobretensión?');
  } else {
    const textContext = [
      ...selectedPairs.map(p => `${p.chunk.title || ''} ${p.chunk.heading || ''} ${p.chunk.text || ''}`)
    ].join(' ').toLowerCase();

    if (textContext.includes('tap-lag') || textContext.includes('oltc')) {
      add('¿Cómo amplificó el Tap-Lag la sobretensión en la red de 220 kV?');
    }
    if (textContext.includes('ufls') || textContext.includes('deslastre')) {
      add('¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?');
    }
    if (textContext.includes('inercia') || textContext.includes('rocof')) {
      add('¿La baja inercia fue causa raíz o solo un factor agravante?');
    }
    if (textContext.includes('gobierno') || textContext.includes('ree') || textContext.includes('icai')) {
      add('¿En qué discrepan exactamente REE, ICAI y ENTSO-E sobre la causa del apagón?');
    }
    if (textContext.includes('interconexión') || textContext.includes('francia')) {
      add('¿Por qué la condición de isla energética agravó el apagón ibérico?');
    }
    if (textContext.includes('reactiva') || textContext.includes('mvar') || textContext.includes('q-v')) {
      add('¿Qué es el margen Q-V y por qué se agotó el 28-A?');
    }
    if (textContext.includes('black start') || textContext.includes('reposición')) {
      add('¿Qué limitaciones tenían los inversores grid-following durante la reposición?');
    }
    if (textContext.includes('coste') || textContext.includes('opex') || textContext.includes('bess')) {
      add('¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?');
    }
  }

  if (suggestions.length === 0) {
    add('¿Cuál fue la causa física principal del apagón del 28-A?');
    add('¿Qué diferencia hay entre la explicación de REE y la del informe ICAI?');
  }

  return suggestions.slice(0, maxItems);
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const errResponse = (status, answer, errorMsg, detectedIntent = 'general') => {
    return res.status(status).json({
      answer, error: errorMsg, sources: [], confidence: 'sin_evidencia', confidence_reason: errorMsg,
      relatedChapters: [], suggestedFigures: [], visualArtifacts: [], followUps: [], intent: detectedIntent
    });
  };

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return errResponse(429, 'Has enviado demasiadas preguntas en poco tiempo. Espera un momento.', 'rate_limit_exceeded');
  }

  if (req.method !== 'POST') return errResponse(405, 'Método HTTP no válido.', 'Método no permitido. Usa POST.');

  const { question, locale = 'es', mode = 'normal' } = req.body || {};
  if (!question || typeof question !== 'string' || question.trim().length < 3) {
    return errResponse(400, 'No he podido procesar tu solicitud.', 'La pregunta debe tener al menos 3 caracteres.');
  }

  const intent = classifyIntent(question, mode);

  try {
    let searcher;
    try { searcher = getSearch(); } catch (e) { return errResponse(500, 'Error al buscar en el TFG.', 'Falta el archivo de índice.', intent); }

    const SYNONYMS = {
      'prensa': ['media', 'medios', 'comunicación', 'periodistas', 'noticias', 'cobertura'],
      'medios': ['prensa', 'periódicos', 'televisión', 'radio', 'comunicación'],
      'internacional': ['europa', 'extranjero', 'global', 'mundial', 'europeo'],
      'inercia': ['inertia', 'H', 'masa', 'rotacional', 'síncrona'],
      'frecuencia': ['frequency', 'Hz', 'nadir', 'RoCoF', 'oscilación'],
      'colapso': ['collapse', 'apagón', 'blackout', 'fallo', 'caída'],
      'apagon': ['blackout', 'colapso', 'corte', 'fallo', '28-A', '28A'],
      'renovable': ['renewable', 'solar', 'eólica', 'fotovoltaica', 'IBR', 'inversor'],
      'tension': ['tensión', 'voltaje', 'voltage', 'kV', 'sobretensión', 'Q-V'],
      'reactiva': ['reactive', 'MVAr', 'Q', 'capacitiva', 'inductiva'],
      'interconexion': ['interconnection', 'Francia', 'frontera', 'importación'],
      'recuperacion': ['recovery', 'reposición', 'black start', 're-energización'],
      'economico': ['economic', 'coste', 'cost', 'pérdidas', 'impacto'],
      'redes sociales': ['twitter', 'X', 'social media', 'viral', 'desinformación'],
      'tap lag': ['tap-lag', 'oltc', 'secundario', '220 kv', 'scada'],
      'ufls': ['deslastre', 'subfrecuencia', 'carga inductiva'],
      'grid forming': ['grid-forming', 'gfm', 'bess', 'inversor formador de red'],
      'grid following': ['grid-following', 'gfl', 'pll', 'inversor seguidor de red']
    };

    const baseQuery = question.trim();
    const normalizedQuery = normalizeText(baseQuery);
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    const expandedTerms = new Set([baseQuery]);
    
    queryWords.forEach(word => {
      if (SYNONYMS[word]) SYNONYMS[word].forEach(s => expandedTerms.add(s));
    });
    
    for (let i = 0; i < queryWords.length - 1; i++) {
      const phrase = `${queryWords[i]} ${queryWords[i + 1]}`;
      if (SYNONYMS[phrase]) SYNONYMS[phrase].forEach(s => expandedTerms.add(s));
    }

    let usedExpandedSearch = false;
    const results = searcher.search(baseQuery, { prefix: true, fuzzy: t => t.length > 4 ? 1 : 0 });

    if (results.length < 3 && expandedTerms.size > 1) {
      usedExpandedSearch = true;
      const expandedQuery = [...expandedTerms].join(' ');
      const expandedResults = searcher.search(expandedQuery, { prefix: true, fuzzy: t => t.length > 5 ? 2 : 1 });
      const existingIds = new Set(results.map(r => r.id));
      expandedResults.forEach(r => { if (!existingIds.has(r.id)) results.push({ ...r, score: r.score * 0.8 }); });
    }

    const reranked = rerankResultsByIntent(results, chunks, intent, question);
    const selectedPairs = selectContextChunks(reranked, chunks, 7);

    if (selectedPairs.length === 0) {
      return res.status(200).json({
        answer: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
        sources: [], confidence: 'sin_evidencia', confidence_reason: 'No se recuperaron fragmentos útiles.',
        relatedChapters: [], suggestedFigures: [], visualArtifacts: [],
        followUps: ['¿Cuál fue la causa principal del apagón del 28-A?', '¿Dónde aparece explicado el Tap-Lag en el TFG?'],
        intent
      });
    }

    const sources = buildSources(selectedPairs, 5);
    const relatedChapters = buildRelatedChapters(selectedPairs, 5);
    const suggestedFigures = buildSuggestedFigures(selectedPairs, 3);
    const { confidence, confidence_reason } = computeConfidence(selectedPairs, usedExpandedSearch);
    const followUps = buildFollowUps(question, selectedPairs, intent, 3);
    const visualArtifacts = buildVisualArtifacts(selectedPairs, chunks, intent, question, 4);

    const context = selectedPairs
      .map(({ chunk }) => `${chunk.text}\n[URL interna a citar: ${buildChunkUrl(chunk)}]`)
      .join('\n\n---\n\n');

    const intentInstruction = getIntentInstruction(intent);
    const langName = locale === 'en' ? 'inglés' : locale === 'de' ? 'alemán' : locale === 'zh-Hans' ? 'chino simplificado' : 'español';

    const prompt = `Eres el asistente pericial-documental oficial del TFG sobre el apagón ibérico del 28 de abril de 2025.
Responde ÚNICAMENTE basándote en el CONTEXTO proporcionado.

REGLAS DE TONO Y ESTILO (OBLIGATORIAS):
1. Sé preciso, claro, técnico y natural. No seas pedante ni burocrático. No suenes robótico.
2. Evita las respuestas tipo lista, a menos que el usuario pida explícitamente comparar, listar cronología o cifras. Prefiere párrafos fluidos.
3. Usa conectores lógicos ("por tanto", "la clave física fue", "esto implica", "el mecanismo raíz es").
4. NUNCA empieces con frases como "Según el contexto", "Basado en la información". Tampoco uses la muletilla "es importante destacar". Ve directo al grano.
5. Si no hay información suficiente en el contexto o existen dudas, dilo abiertamente de forma directa.
6. Responde siempre en ${langName}. Máximo 250 palabras.

INSTRUCCIÓN ESPECÍFICA SEGÚN LA INTENCIÓN DEL USUARIO:
${intentInstruction}

CIERRE Y ANCLAJE DOCUMENTAL:
Cierra con naturalidad. La respuesta debe terminar con:
1. Una frase breve de anclaje documental con enlace Markdown a la sección más relevante usando la [URL interna a citar].
2. Una pregunta proactiva contextual, breve y concreta, extraída o inspirada en la lista de SUGERENCIAS.

No uses fórmulas genéricas como "¿quieres preguntar otra cosa?", "espero haberte ayudado" o "si tienes más dudas".
La pregunta proactiva debe sonar como una continuación lógica del razonamiento, no como una frase comercial.

SUGERENCIAS CONTEXTUALES POSIBLES (elige una para el cierre):
${followUps.map(q => `- ${q}`).join('\n')}

CONTEXTO RECUPERADO:
${context}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA DEL ASISTENTE:`;

    const systemPrompt = 'Eres un asistente técnico especializado en sistemas eléctricos de potencia.';

    let llmResult;
    try {
      llmResult = await callLLM({
        prompt,
        systemPrompt,
        temperature: 0.2,
        maxTokens: 500,
      });
    } catch (llmError) {
      console.error('[api/chat] LLM provider error:', llmError?.message);

      return res.status(llmError?.status || 502).json({
        answer: 'El RAG ha recuperado contexto del TFG, pero el proveedor LLM no está disponible ahora mismo. Revisa GROQ_API_KEY, DEEPSEEK_API_KEY, cuota o conectividad del proveedor.',
        error: llmError?.message || 'LLM provider error',
        sources: typeof sources !== 'undefined' ? sources : [],
        confidence: typeof confidence !== 'undefined' ? confidence : 'sin_evidencia',
        confidence_reason: typeof confidence_reason !== 'undefined' ? confidence_reason : 'El fallo ocurrió después de recuperar contexto, durante la generación del modelo.',
        relatedChapters: typeof relatedChapters !== 'undefined' ? relatedChapters : [],
        suggestedFigures: typeof suggestedFigures !== 'undefined' ? suggestedFigures : [],
        visualArtifacts: typeof visualArtifacts !== 'undefined' ? visualArtifacts : [],
        followUps: typeof followUps !== 'undefined' ? followUps : [],
        intent: typeof intent !== 'undefined' ? intent : 'general',
      });
    }

    const answer = llmResult?.text || 'He recuperado contexto del TFG, pero el modelo no ha devuelto una respuesta textual. Prueba a reformular la pregunta.';
    const provider = llmResult?.provider || 'unknown';
    const model = llmResult?.model || 'unknown';

    return res.status(200).json({
      answer, provider, model, sources, confidence, confidence_reason, relatedChapters, suggestedFigures, visualArtifacts, followUps, intent
    });

  } catch (error) {
    return errResponse(500, 'Error interno del servidor.', error.message, intent);
  }
}
