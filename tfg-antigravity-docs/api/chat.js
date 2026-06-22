// api/chat.js
const MiniSearch = require('minisearch');
const fs = require('fs');
const path = require('path');

let chunks = null;
let miniSearch = null;
let searchInitPromise = null;

// ── Forensic tables (unchanged) ─────────────────────────────────────────────
const FORENSIC_TABLES = {};
try {
  const cats = JSON.parse(fs.readFileSync(
    path.join(process.cwd(), 'static/data/processed/forensic_categories.json'), 'utf8'
  ));
  cats.categories.forEach(cat => {
    (cat.tables || []).forEach(t => { FORENSIC_TABLES[t.id] = t; });
  });
} catch(e) {}

// ── Asset Registry (T1) ──────────────────────────────────────────────────────
// Loaded once at cold-start. Replaces the 400-line scoreArtifactForQuestion.
let ASSET_REGISTRY = [];
try {
  const regRaw = fs.readFileSync(
    path.join(__dirname, '..', 'static', 'asset_registry.json'), 'utf8'
  );
  ASSET_REGISTRY = JSON.parse(regRaw).assets || [];
  console.log(`[api/chat] Asset registry loaded: ${ASSET_REGISTRY.length} assets`);
} catch(e) {
  console.warn('[api/chat] asset_registry.json not found — visual asset selection degraded:', e.message);
}

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
  // Si ya está cargado, devolver inmediatamente
  if (miniSearch) return Promise.resolve(miniSearch);

  // Si hay una carga en curso, esperar a la misma promesa
  // (evita doble carga en cold starts concurrentes)
  if (searchInitPromise) return searchInitPromise;

  searchInitPromise = new Promise((resolve, reject) => {
    try {
      const t0 = Date.now();
      const indexRaw = fs.readFileSync(
        path.join(__dirname, '..', 'static', 'search-index.json'), 'utf8'
      );
      chunks = JSON.parse(
        fs.readFileSync(
          path.join(__dirname, '..', 'static', 'chunks.json'), 'utf8'
        )
      );
      miniSearch = MiniSearch.loadJSON(indexRaw, {
        fields: ['title', 'heading', 'subheading', 'text', 'keywordsText'],
        storeFields: [
          'title', 'heading', 'subheading', 'text', 'slug', 'anchor',
          'chunkType', 'keywords', 'keywordsText', 'chapterOrder',
          'sourceFile', 'artifact'
        ]
      });
      console.log(`[api/chat] MiniSearch loaded in ${Date.now() - t0}ms, ${Object.keys(chunks).length} chunks`);
      resolve(miniSearch);
    } catch (err) {
      searchInitPromise = null; // reset para permitir reintento
      console.error('Error cargando índice:', err);
      reject(new Error('IndexFilesMissing'));
    }
  });

  return searchInitPromise;
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
        response_format: { type: 'json_object' }, // T2: structured output
      }),
    },
    30000
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
        response_format: { type: 'json_object' }, // T2: structured output
      }),
    },
    45000
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

  // Visual
  match(['grafica', 'figura', 'simulador', 'mapa', 'tabla', 'imagen',
         'ensename', 'muestrame', 'mostrar', 'ver grafica', 'ver figura',
         'show me', 'chart', 'graph', 'figure', 'map', 'diagram',
         'visualize', 'display', 'plot'],
        'visual', 4);

  // Timeline
  match(['evolucion', 'evoluciono', 'durante', '27 segundos',
         'segundos criticos', 'cronologia', 'secuencia', 'minuto a minuto',
         'sequence', 'timeline', 'chronology', 'step by step',
         'what happened', '27 seconds', 'critical seconds',
         'order of events'],
        'timeline', 3);

  // Quantitative
  match(['cuanta', 'cuanto', 'cifra', 'porcentaje', 'demanda',
         'mw', 'hz', 'mvar', 'kv', 'solar', 'mix',
         'how much', 'how many', 'percentage', 'value',
         'magnitude', 'figure', 'number',
         'coste', 'costo', 'euros', 'millones', 'precio', 'cuanto costo'],
        'quantitative', 2);

  // Causal
  match(['reactiva', 'potencia reactiva', 'mvar', 'q-v', 'sobretension',
         'reactive power', 'overvoltage', 'voltage collapse'],
        'causal', 2);

  match(['por que', 'como amplifico', 'como actuo', 'mecanismo',
         'detonante', 'causa', 'agravo', 'tap-lag', 'ufls',
         'colapso en vez de', 'conectan', 'relacion entre', 'vinculo',
         'why', 'how did', 'mechanism', 'trigger', 'cause',
         'root cause', 'what caused', 'reason'],
        'causal', 3);

  // Comparison
  match(['compara', 'comparar', 'vs', 'frente a', 'diferencia entre',
         'discrepan', 'ree', 'icai', 'entso-e',
         'compare', 'versus', 'difference', 'disagree', 'discrepancy',
         'contrast'],
        'comparison', 3);

  // Glossary
  match(['que es', 'define', 'explicame el concepto', 'que significa',
         'what is', 'define', 'explain', 'meaning of', 'definition'],
        'glossary', 4);
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
    causal: `Estructura como cadena causal compacta: detonante → mecanismo físico → consecuencia medible.
Distingue causa raíz de factores agravantes. Una frase por eslabón.`,

    quantitative: `Prioriza cifras exactas con unidades. Para cada dato: valor, unidad, fuente y qué implica físicamente.
No redondees si el contexto da cifras precisas. Compara magnitudes cuando sea relevante.`,

    comparison: `Organiza por posición institucional en este orden: REE/Gobierno → ICAI/AELEC → ENTSO-E.
Para cada una: qué sostiene, en qué difiere de las otras, y si el TFG toma posición.`,

    timeline: `Ordena cronológicamente con timestamps exactos si el contexto los da.
Formato: HH:MM:SS CEST — evento — consecuencia inmediata. Sin narrativa entre hitos.`,

    glossary: `Primero: definición técnica rigurosa en 1-2 frases.
Segundo: papel concreto de ese concepto en el colapso del 28-A con dato numérico si existe.`,

    visual: `El usuario quiere ver algo. PRIMERO: describe en 1-2 frases qué muestra el simulador o figura
y qué elemento concreto debe buscar (curva, valor, zona, timestamp).
DESPUÉS: explica el concepto técnico que ilustra ese elemento.`,

    simple: `Explica el mecanismo físico con lenguaje claro, sin perder exactitud.
Una sola analogía técnica breve si ayuda. Ningún término sin definir. Máximo 3 párrafos cortos.`,

    general: `Técnico, directo y conversacional. Sin listas a menos que el usuario las pida.
Párrafos cortos, conectores causales ("por tanto", "el mecanismo fue", "esto implica").`,
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

    // Boost al glosario SOLO cuando la intención lo requiere
    if (ct === 'glossary' && (intent === 'glossary' || intent === 'general')) {
      score *= 1.4;
    }

    // Penalización por chunk corto
    if (!chunk.text || chunk.text.length < 100) score *= 0.7;

    // 6. Penalizaciones por slug
    score = applySlugPenalties(score, chunk, normQ);

    return { ...r, adjustedScore: score };
  }).sort((a, b) => b.adjustedScore - a.adjustedScore);
}


function textSimilarity(a, b) {
  const toks = (s) => new Set(
    s.toLowerCase().split(/\W+/).filter(t => t.length > 2)
  );
  const A = toks(a);
  const B = toks(b);
  const inter = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union;
}

function selectContextChunks(rerankedResults, chunksData, maxChunks = 9, lambda = 0.72) {
  if (rerankedResults.length === 0) return [];

  const bestScore = rerankedResults[0].adjustedScore || 1;
  const picked = [];
  const slugCount = {};

  // Construir mapa id→chunk para acceso O(1)
  const chunksMap = chunksData instanceof Map
    ? chunksData
    : new Map(Object.entries(chunksData));

  // Candidatos válidos (filtro básico de score mínimo)
  const candidates = rerankedResults.filter(r => {
    const chunk = chunksMap.get(String(r.id));
    if (!chunk) return false;
    const ct = chunk.chunkType || 'normal';
    // Siempre incluir master_data y glossary en el pool
    if (ct === 'master_data' || ct === 'glossary') return true;
    return r.adjustedScore >= bestScore * 0.12;
  });

  // Garantizar que master_data esté en el pool
  const hasMasterInPool = candidates.some(r => {
    const c = chunksMap.get(String(r.id));
    return c?.chunkType === 'master_data';
  });
  if (!hasMasterInPool) {
    for (const [id, chunk] of chunksMap) {
      if (chunk.chunkType === 'master_data') {
        candidates.push({ id: Number(id) || id, adjustedScore: bestScore * 0.5 });
        break;
      }
    }
  }

  // Selección MMR iterativa
  while (candidates.length > 0 && picked.length < maxChunks) {
    let bestCand = null;
    let bestMMR = -Infinity;

    for (const cand of candidates) {
      if (picked.some(p => p.result.id === cand.id)) continue;

      const chunk = chunksMap.get(String(cand.id));
      if (!chunk) continue;

      const ct = chunk.chunkType || 'normal';
      const slug = chunk.slug || 'unknown';

      // Límite de diversidad por slug (máx 2 del mismo slug,
      // salvo master_data o glossary)
      const slugUsed = slugCount[slug] || 0;
      if (slugUsed >= 2 && ct !== 'master_data' && ct !== 'glossary') continue;

      const relevance = cand.adjustedScore || 0;

      // Penalización por similitud con chunks ya seleccionados
      const redundancy = picked.length > 0
        ? Math.max(...picked.map(p =>
            textSimilarity(chunk.text || '', p.chunk.text || '')
          ))
        : 0;

      // Boost extra para master_data: siempre entra si no está
      const isMaster = ct === 'master_data';
      const masterBoost = isMaster && !picked.some(p => p.chunk.chunkType === 'master_data')
        ? 999
        : 0;

      const mmr = masterBoost + lambda * relevance - (1 - lambda) * redundancy;

      if (mmr > bestMMR) {
        bestMMR = mmr;
        bestCand = { cand, chunk };
      }
    }

    if (!bestCand) break;

    const slug = bestCand.chunk.slug || 'unknown';
    slugCount[slug] = (slugCount[slug] || 0) + 1;

    picked.push({
      result: bestCand.cand,
      chunk: bestCand.chunk,
    });

    // Eliminar el candidato seleccionado del pool
    const idx = candidates.findIndex(c => c.id === bestCand.cand.id);
    if (idx !== -1) candidates.splice(idx, 1);
  }

  return picked;
}

function buildChunkUrl(chunk) {
  const slug = chunk?.slug || '';
  const anchor = chunk?.anchor || '';
  const path = slug.startsWith('/') ? slug : `/${slug}`;
  return anchor ? `${path}#${anchor}` : path;
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

// loadFigureCatalog, getFigureCandidates, buildSuggestedFigures — REMOVED (T1/T2)
// Asset selection is now handled by ASSET_REGISTRY + LLM recommended_asset_id.

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

// ── T1: Asset Registry helpers ──────────────────────────────────────────────

/**
 * Selects up to `maxItems` assets from ASSET_REGISTRY that are most relevant
 * to the current intent + question. Uses overlap of normalized trigger_questions
 * against the query. Falls back to intent-type matching.
 *
 * This replaces the 400-line scoreArtifactForQuestion entirely.
 */
function selectRegistryAssets(intent, question, maxItems = 25) {
  const q = normalizeText(question);
  const qTokens = new Set(q.split(/\s+/).filter(t => t.length > 3));

  const scored = ASSET_REGISTRY.map(asset => {
    let score = 0;

    // Token overlap with trigger_questions
    for (const tq of (asset.trigger_questions || [])) {
      const tqNorm = normalizeText(tq);
      if (q.includes(tqNorm)) {
        score += 3; // exact substring match
      } else {
        const tqTokens = tqNorm.split(/\s+/).filter(t => t.length > 3);
        const overlap = tqTokens.filter(t => qTokens.has(t)).length;
        score += overlap * 0.5;
      }
    }

    // Intent-type affinity
    if (intent === 'visual') {
      if (asset.type === 'interactive') score += 2;
      if (asset.type === 'image')       score += 1;
    }
    if (intent === 'quantitative' || intent === 'comparison') {
      if (asset.type === 'table')       score += 2;
    }
    if (intent === 'timeline') {
      if (asset.type === 'interactive') score += 1.5;
      if (asset.type === 'table')       score += 1;
    }
    if (intent === 'causal') {
      if (asset.type === 'interactive') score += 1;
    }

    return { asset, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(({ asset }) => asset);
}

/**
 * Resolves a recommended_asset_id (returned by the LLM) to a full artifact
 * object suitable for the frontend VisualArtifactCard.
 * Falls back to chunk-embedded artifacts from selectedPairs if not found.
 */
function resolveAssetId(assetId, selectedPairs) {
  // 1. Look up in registry
  if (assetId) {
    const found = ASSET_REGISTRY.find(a => a.id === assetId);
    if (found) {
      const extra = {};
      if (found.type === 'table') {
        extra.columns = FORENSIC_TABLES[found.id]?.columns || [];
        extra.data    = FORENSIC_TABLES[found.id]?.data    || [];
      }
      return { ...found, ...extra, relevance: 1.0 };
    }
  }
  // 2. Fallback: first artifact embedded in selected chunks
  for (const { chunk } of selectedPairs) {
    if (chunk?.artifact) {
      const art = chunk.artifact;
      const extra = {};
      if (art.type === 'table') {
        extra.columns = FORENSIC_TABLES[art.id]?.columns || [];
        extra.data    = FORENSIC_TABLES[art.id]?.data    || [];
      }
      return { ...art, ...extra, relevance: 0.7 };
    }
  }
  return null;
}

// LEGACY: kept for reference only — replaced by resolveAssetId + LLM selection
function getAllArtifactChunks(chunksData) {
  return Object.values(chunksData || {}).filter(c => c && c.artifact);
}

// ─────────────────────────────────────────────────────────────────────────────
// scoreArtifactForQuestion has been REMOVED (was L770–L1073).
// Asset selection is now delegated to the LLM via recommended_asset_id.
// See: selectRegistryAssets() + resolveAssetId() above.
// ─────────────────────────────────────────────────────────────────────────────

function buildVisualArtifacts(recommendedAssetId, selectedPairs) {
  // T2: artifact is chosen by the LLM, resolved deterministically
  const resolved = resolveAssetId(recommendedAssetId, selectedPairs);
  return resolved ? [resolved] : [];
}

function normalizeInternalUrl(url) {
  const clean = String(url || '').trim();
  if (!clean.startsWith('/') || /[\s<>]/.test(clean)) return '';
  return clean.slice(0, 300);
}

function sanitizeCitationClaim(value) {
  let claim = String(value || '').replace(/\s+/g, ' ').trim();
  if (!claim) return '';
  if (claim.length <= 120) return claim;

  const sentenceMatch = claim.match(/^.{30,120}[.!?](?:\s|$)/);
  if (sentenceMatch) return sentenceMatch[0].trim();

  const slice = claim.slice(0, 121);
  const boundary = Math.max(
    slice.lastIndexOf(';'),
    slice.lastIndexOf(','),
    slice.lastIndexOf(' - '),
    slice.lastIndexOf(' ')
  );
  const end = boundary > 55 ? boundary : 117;
  return `${claim.slice(0, end).trim().replace(/[,:;\-]+$/, '')}.`;
}

function sanitizeAnswerLinks(answer, validUrls, citations) {
  if (typeof answer !== 'string') return '';
  const citationUrls = new Set(citations.map(c => c.source_url));

  return answer.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, rawUrl) => {
    const url = normalizeInternalUrl(rawUrl);
    if (!url || !validUrls.has(url)) return text;

    if (!citationUrls.has(url)) {
      if (citations.length >= 4) return text;
      citations.push({
        claim: sanitizeCitationClaim(`Referencia enlazada: ${text}`),
        source_url: url,
      });
      citationUrls.add(url);
    }

    return `[${text}](${url})`;
  });
}

function getAnswerScope(answer) {
  const text = normalizeText(answer || '');
  const isOutOfScope = /fuera del alcance|outside the scope|datos actuales|tiempo real|fuente externa/.test(text);
  const hasMissingExactData = /no especifica|no proporciona|no detalla|no se detalla|no se detallan|no incluye|no esta cubierto|no cubre|no disponible|no realiza ese calculo|aparece como n\/d|requiere datos mas detallados|necesitariamos|no permite calcular/.test(text);
  return { isOutOfScope, hasMissingExactData };
}

function isElectricityPriceLiveQuestion(question) {
  const q = normalizeText(question || '');
  const asksPrice = /precio|tarifa|pvpc|omie|esios/.test(q) && /luz|electricidad|electrica|mercado/.test(q);
  const asksLive = /manana|hoy|ahora|actual|tiempo real|proximo|siguiente/.test(q);
  return q.includes('precio de la luz') || (asksPrice && asksLive);
}

// ── T2: Parse structured LLM response ────────────────────────────────────────

/**
 * Parses the JSON output from the LLM (response_format: json_object).
 * Validates citations against the actual retrieved chunk URLs.
 * Resolves recommended_asset_id to a full artifact object.
 *
 * Always returns a safe object — never throws.
 */
function parseStructuredResponse(rawText, selectedPairs, sources = null) {
  // Build set of valid URLs from the exact source list returned to the client.
  const validUrls = new Set(
    (Array.isArray(sources) && sources.length > 0
      ? sources.map(source => source.url)
      : selectedPairs.map(({ chunk }) => buildChunkUrl(chunk)))
      .map(normalizeInternalUrl)
      .filter(Boolean)
  );

  let parsed;
  try {
    // Strip markdown code fences if LLM wraps JSON in ```json ... ```
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/, '')
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback: treat entire text as the answer (backward compat)
    console.warn('[api/chat] LLM did not return valid JSON — falling back to plain text');
    return {
      answer:               rawText,
      citations:            [],
      recommended_asset_id: null,
      glossary_terms_used:  [],
      follow_ups:           [],
      _parse_error:         true,
    };
  }

  // Validate and sanitize citations
  const rawCitations = Array.isArray(parsed.citations) ? parsed.citations : [];
  const citations = [];
  const seenCitations = new Set();

  for (const c of rawCitations) {
    if (!c || typeof c.source_url !== 'string') continue;
    const source_url = normalizeInternalUrl(c.source_url);
    if (!source_url || !validUrls.has(source_url)) continue;

    const claim = sanitizeCitationClaim(c.claim);
    if (!claim) continue;

    const key = `${source_url}::${claim}`;
    if (seenCitations.has(key)) continue;
    seenCitations.add(key);
    citations.push({ claim, source_url });
    if (citations.length >= 4) break;
  }

  const answer = sanitizeAnswerLinks(
    typeof parsed.answer === 'string' ? parsed.answer : rawText,
    validUrls,
    citations
  );

  return {
    answer,
    citations,
    recommended_asset_id: typeof parsed.recommended_asset_id === 'string'
                            ? parsed.recommended_asset_id
                            : null,
    glossary_terms_used:  Array.isArray(parsed.glossary_terms_used)
                            ? parsed.glossary_terms_used.slice(0, 10)
                            : [],
    follow_ups:           Array.isArray(parsed.follow_ups)
                            ? parsed.follow_ups.filter(f => typeof f === 'string').slice(0, 3)
                            : [],
    _parse_error:         false,
  };
}

function enforceAnswerContracts(structured, question, validUrls = null) {
  if (!structured || typeof structured.answer !== 'string') return structured;

  const q = normalizeText(question || '');
  const assetId = structured.recommended_asset_id || '';
  const canUseTapLagGlossary = !validUrls || validUrls.has('/glosario#tap-lag');

  if (assetId === 'escalones-ufls' && !/tabla del panel derecho/i.test(structured.answer)) {
    structured.answer = `${structured.answer.trim()} Los datos están en la tabla del panel derecho.`;
  }

  if (q.includes('interconexion') && (q.includes('ratio') || q.includes('objetivo europeo'))) {
    const introUrl = '/introduccion#contexto-estructural';
    const summaryUrl = '/resumen-de-cifras#5-las-interconexiones-el-factor-geografico-que-confino-la-crisis';
    const introLink = validUrls?.has(introUrl)
      ? `[contexto estructural](${introUrl})`
      : 'contexto estructural';
    const summaryLink = validUrls?.has(summaryUrl)
      ? `[resumen de cifras](${summaryUrl})`
      : 'resumen de cifras';

    structured.answer = `El TFG usa dos métricas complementarias para expresar el aislamiento ibérico. En el ${introLink}, la capacidad de interconexión transfronteriza se cifra en el 7,9 % sobre la demanda punta, frente al objetivo europeo del 15 % para 2030. En el ${summaryLink}, al medir capacidad de importación frente a demanda total instantánea, la ratio operativa aparece como aproximadamente 3-5 %. Ambas lecturas apuntan a la misma conclusión: la península tenía muy poco apoyo externo disponible para importar estabilidad dinámica durante el 28-A. Si "actual" significa el dato actualizado hoy, debe verificarse en REE, ESIOS o ENTSO-E.`;

    structured.citations = [
      ...(validUrls?.has(introUrl)
        ? [{ claim: 'La interconexión se cifra en 7,9 % sobre demanda punta.', source_url: introUrl }]
        : []),
      ...(validUrls?.has(summaryUrl)
        ? [{ claim: 'La ratio capacidad de importación/demanda total era de 3-5 %.', source_url: summaryUrl }]
        : []),
    ];
  }

  if (q.includes('ens') && q.includes('gwh')) {
    const blackoutTableUrl = '/anexo-impacto-resiliencia#tabla-comparativa-blackouts-historicos';
    const costsTableUrl = '/anexo-impacto-resiliencia#tabla-costes-economicos';
    const blackoutLink = validUrls?.has(blackoutTableUrl)
      ? `[tabla comparativa de blackouts](${blackoutTableUrl})`
      : 'tabla comparativa de blackouts';
    const costsLink = validUrls?.has(costsTableUrl)
      ? `[tabla de costes económicos](${costsTableUrl})`
      : 'tabla de costes económicos';

    structured.answer = `El TFG no proporciona un valor numérico de ENS en GWh para el 28-A: en la ${blackoutLink} aparece como "n/d". Por tanto, no debe derivarse una cifra multiplicando demanda sin suministro por duración media, porque eso no integra la curva real de reposición ni distingue territorios, cargas críticas o recuperación parcial. La ${costsLink} sí recoge bandas económicas del impacto, pero no un cálculo cerrado de Energía No Suministrada en GWh.`;

    structured.citations = [
      ...(validUrls?.has(blackoutTableUrl)
        ? [{ claim: 'La ENS estimada del 28-A aparece como n/d.', source_url: blackoutTableUrl }]
        : []),
      ...(validUrls?.has(costsTableUrl)
        ? [{ claim: 'La tabla de costes recoge impacto económico, no ENS en GWh.', source_url: costsTableUrl }]
        : []),
    ];
  }

  if ((q.includes('tap lag') || q.includes('tap-lag')) && canUseTapLagGlossary) {
    if (/\[glosario\]\(\/glosario#tap-lag\)/i.test(structured.answer)) {
      structured.answer = structured.answer.replace(/\[glosario\]\(\/glosario#tap-lag\)/gi, '[Tap-Lag](/glosario#tap-lag)');
    } else if (!/\[Tap-Lag\]\(\/glosario#tap-lag\)/.test(structured.answer)) {
      structured.answer = `${structured.answer.trim()} Ver también [Tap-Lag](/glosario#tap-lag).`;
    }
  }

  return structured;
}

/**
 * Builds the compact asset catalogue injected into the system prompt.
 * Limits to `maxItems` most-relevant assets to stay within token budget.
 */
function buildAssetCatalogueString(intent, question, maxItems = 25) {
  const relevant = selectRegistryAssets(intent, question, maxItems);
  if (relevant.length === 0) return '';
  const lines = relevant.map(a =>
    `- "${a.id}" (${a.type}): ${a.title}${a.description ? ' — ' + a.description.slice(0, 80) : ''}`
  );
  return [
    'ASSETS VISUALES DISPONIBLES (usa el campo "recommended_asset_id" con el ID exacto):',
    ...lines,
  ].join('\n');
}

// Real buildFollowUps: only used as fallback when LLM returns empty follow_ups
function buildFollowUps(question, selectedPairs, intent, maxItems = 3) {
  const q = normalizeText(question);

  const fallbacks = [
    '¿Cuál fue la causa física principal del apagón del 28-A?',
    '¿Qué diferencia hay entre la explicación de REE y la del informe ICAI?',
    '¿Por qué el exceso de reactiva capacitiva fue tan letal el 28-A?',
    '¿Qué reformas se han implementado tras el apagón?',
    '¿Cómo funcionó el Black Start en la reposición del sistema?',
  ];

  const isRepetitive = (text) => {
    const nText = normalizeText(text);
    if (nText === q) return true;
    const qWords = new Set(q.split(/\s+/).filter(w => w.length > 3));
    const nWords = nText.split(/\s+/).filter(w => w.length > 3);
    if (nWords.length === 0) return false;
    const common = nWords.filter(w => qWords.has(w)).length;
    return (common / nWords.length) > 0.6;
  };

  const suggestions = [];
  for (const fb of fallbacks) {
    if (!isRepetitive(fb)) suggestions.push(fb);
    if (suggestions.length >= maxItems) break;
  }
  return suggestions;
}


const API_ERRORS = {
  es: {
    rateLimit: 'Has enviado demasiadas preguntas en poco tiempo. Espera un momento.',
    methodNotAllowed: 'Método HTTP no válido. Usa POST.',
    emptyQuestion: 'No he podido procesar tu solicitud (pregunta vacía).',
    tooShort: 'La pregunta es demasiado corta. Prueba a formularla con más detalle. Por ejemplo: "¿Qué es el Tap-Lag?" o "¿Cuánta demanda se perdió?"',
    indexMissing: 'Error al buscar en el TFG (falta el archivo de índice).',
    internalError: 'Error interno del servidor. Por favor, inténtalo más tarde.',
    noEvidence: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
    noEvidenceReason: 'No se recuperaron fragmentos útiles.',
    defaultFollowUp1: '¿Cuál fue la causa principal del apagón del 28-A?',
    defaultFollowUp2: '¿Dónde aparece explicado el Tap-Lag en el TFG?',
    llmUnavailable: 'El RAG ha recuperado contexto del TFG, pero el proveedor LLM no está disponible ahora mismo.'
  },
  en: {
    rateLimit: 'You have sent too many questions in a short time. Please wait a moment.',
    methodNotAllowed: 'Invalid HTTP method. Use POST.',
    emptyQuestion: 'Could not process your request (empty question).',
    tooShort: 'The question is too short. Try asking with more detail. For example: "What is the Tap-Lag effect?" or "How much demand was lost?"',
    indexMissing: 'Error searching the thesis (missing index file).',
    internalError: 'Internal server error. Please try again later.',
    noEvidence: 'I could not find relevant information in the thesis to answer your question. Try rephrasing it or check the glossary.',
    noEvidenceReason: 'No useful fragments were retrieved.',
    defaultFollowUp1: 'What was the main cause of the April 28 blackout?',
    defaultFollowUp2: 'Where is the Tap-Lag explained in the thesis?',
    llmUnavailable: 'The RAG has retrieved context from the thesis, but the LLM provider is currently unavailable.'
  },
  de: {
    rateLimit: 'Sie haben in kurzer Zeit zu viele Fragen gesendet. Bitte warten Sie einen Moment.',
    methodNotAllowed: 'Ungültige HTTP-Methode. Verwenden Sie POST.',
    emptyQuestion: 'Ihre Anfrage konnte nicht verarbeitet werden (leere Frage).',
    tooShort: 'Die Frage ist zu kurz. Versuchen Sie, sie detaillierter zu formulieren. Zum Beispiel: "Was ist der Tap-Lag-Effekt?" oder "Wie viel Last wurde abgeworfen?"',
    indexMissing: 'Fehler bei der Suche in der Arbeit (Indexdatei fehlt).',
    internalError: 'Interner Serverfehler. Bitte versuchen Sie es später noch einmal.',
    noEvidence: 'Ich konnte keine relevanten Informationen in der Arbeit finden, um Ihre Frage zu beantworten. Versuchen Sie, sie anders zu formulieren, oder schlagen Sie im Glossar nach.',
    noEvidenceReason: 'Es wurden keine nützlichen Fragmente gefunden.',
    defaultFollowUp1: 'Was war die Hauptursache des Stromausfalls vom 28. April?',
    defaultFollowUp2: 'Wo wird der Tap-Lag in der Arbeit erklärt?',
    llmUnavailable: 'Das RAG hat Kontext aus der Arbeit geladen, aber der KI-Dienst ist derzeit nicht verfügbar.'
  },
  'zh-Hans': {
    rateLimit: '您在短时间内发送了太多问题。请稍等片刻。',
    methodNotAllowed: '无效的HTTP方法。请使用POST。',
    emptyQuestion: '无法处理您的请求（问题为空）。',
    tooShort: '问题太短了。请尝试提供更多细节。例如：“什么是Tap-Lag效应？”或“损失了多少负荷？”',
    indexMissing: '在论文中检索时出错（索引文件丢失）。',
    internalError: '服务器内部错误。请稍后再试。',
    noEvidence: '我未能在论文中找到相关信息来回答您的问题。请尝试重新表述或查看词汇表。',
    noEvidenceReason: '未检索到有用的内容。',
    defaultFollowUp1: '4月28日大停电的主要原因是什么？',
    defaultFollowUp2: '论文中在哪里解释了Tap-Lag？',
    llmUnavailable: 'RAG已从论文中检索到相关背景，但大语言模型服务目前不可用。'
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { question, locale = 'es', mode = 'normal' } = req.body || {};
  const t = API_ERRORS[locale] || API_ERRORS.es;

  const errResponse = (status, answer, errorMsg, detectedIntent = 'general') => {
    return res.status(status).json({
      answer, error: errorMsg, sources: [], confidence: 'sin_evidencia', confidence_reason: errorMsg,
      relatedChapters: [], suggestedFigures: [], visualArtifacts: [], followUps: [], intent: detectedIntent
    });
  };

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return errResponse(429, t.rateLimit, 'rate_limit_exceeded');
  }

  if (req.method !== 'POST') return errResponse(405, t.methodNotAllowed, 'Método no permitido. Usa POST.');

  const trimmedQ = question?.trim() || '';
  if (!trimmedQ || typeof question !== 'string') {
    return errResponse(400, t.emptyQuestion, 'Pregunta vacía.');
  }

  // Lista de acrónimos técnicos válidos aunque sean cortos
  const VALID_SHORT_TERMS = new Set([
    'ibr', 'gfm', 'gfl', 'ufls', 'hvdc', 'pmu', 'wams',
    'ree', 'ren', 'rte', 'q-v', 'pcc', 'scr', 'ers',
    'nhv', 'mhv', 'oltc', 'sssc', 'bess', 'ffr', 'afrr',
    'mfrr', 'fcr', 'ntc', 'atc', 'ptc', '28-a', '28a',
    'tap', 'mw', 'hz', 'kv', 'mvar', 'gw', 'gvar',
    'rocof', 'p.o. 7.4', 'po 7.4', 'po 74', 'ansi 59', 'ansi59',
    'n-1', 'n-k', 'mrscr', 'pll', 'vsc'
  ]);

  const isShortButValid =
    trimmedQ.length < 10 &&
    VALID_SHORT_TERMS.has(trimmedQ.toLowerCase().replace(/[¿?.]/g, ''));

  if (trimmedQ.length < 10 && !isShortButValid) {
    return errResponse(400, t.tooShort, 'Pregunta demasiado corta (mínimo 10 caracteres).');
  }

  const intent = classifyIntent(question, mode);

  if (isElectricityPriceLiveQuestion(question)) {
    return res.status(200).json({
      answer: 'Esta pregunta está fuera del alcance del TFG. Para precios horarios actuales o de mañana consulta OMIE, ESIOS o REE, porque el chatbot solo responde sobre el análisis documental del apagón del 28-A.',
      sources: [],
      confidence: 'fuera_de_ambito',
      confidence_reason: 'Pregunta de datos eléctricos actuales/en tiempo real, fuera del corpus del TFG.',
      relatedChapters: [],
      suggestedFigures: [],
      visualArtifacts: [],
      followUps: [],
      citations: [],
      glossaryTerms: [],
      recommended_asset_id: null,
      intent,
    });
  }

  try {
    let searcher;
    try {
      searcher = await getSearch();
    } catch (e) {
      return errResponse(500, t.indexMissing, 'Falta el archivo de índice.', intent);
    }

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

    // ── Búsqueda secundaria sin stop words ──────────────────────
    // Para preguntas tipo "¿qué es X?" el BM25 se satura con
    // stop words y los chunks técnicos relevantes no llegan.
    // Extraemos los términos técnicos y hacemos una búsqueda
    // adicional fusionando los resultados.
    const STOP_WORDS = new Set([
      'que', 'es', 'el', 'la', 'los', 'las', 'un', 'una', 'de',
      'del', 'en', 'y', 'o', 'a', 'por', 'para', 'con', 'se',
      'su', 'sus', 'como', 'si', 'no', 'lo', 'le', 'me', 'te',
      'nos', 'al', 'hay', 'fue', 'son', 'era', 'ser', 'fue',
      'han', 'has', 'fue', 'cuál', 'cual', 'qué', 'como',
      'what', 'is', 'the', 'how', 'does', 'why', 'when',
      'where', 'which', 'are', 'was', 'were', 'did', 'do',
      'an', 'of', 'in', 'to', 'and', 'or', 'for',
    ]);

    const keyTerms = normalizeText(baseQuery)
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

    if (keyTerms.length > 0 && keyTerms.length < normalizeText(baseQuery).split(/\s+/).length) {
      // Solo si hay stop words que eliminar (evita búsqueda duplicada)
      const keyQuery = keyTerms.join(' ');
      const keyResults = searcher.search(keyQuery, {
        prefix: true,
        fuzzy: t => t.length > 3 ? 1 : 0,
      });
      const existingIds = new Set(results.map(r => r.id));
      keyResults.forEach(r => {
        if (!existingIds.has(r.id)) {
          results.push({ ...r, score: r.score * 0.85 });
        }
      });
    }

    // ── Boost explícito para glosario cuando intent es glossary ─
    // Garantiza que el chunk del glosario del término técnico
    // siempre llega al pool de reranking
    if (intent === 'glossary') {
      const normQ = normalizeText(baseQuery);
      for (const [id, chunk] of Object.entries(chunks)) {
        if (chunk.chunkType !== 'glossary') continue;
        const normHeading = normalizeText(chunk.heading || '');
        // Si el heading del glosario aparece en la pregunta
        if (normHeading.length > 2 && normQ.includes(normHeading)) {
          const alreadyIn = results.some(r => String(r.id) === String(id));
          if (!alreadyIn) {
            results.push({
              id: isNaN(id) ? id : Number(id),
              score: 80, // score alto para que reranking lo vea
              terms: [],
              match: {},
            });
          } else {
            // Si ya está, subir su score
            const existing = results.find(r => String(r.id) === String(id));
            if (existing) existing.score = Math.max(existing.score, 80);
          }
        }
      }
    }

    const reranked = rerankResultsByIntent(results, chunks, intent, question);
    const selectedPairs = selectContextChunks(reranked, chunks, 9);

    if (selectedPairs.length === 0) {
      return res.status(200).json({
        answer: t.noEvidence,
        sources: [], confidence: 'sin_evidencia', confidence_reason: t.noEvidenceReason,
        relatedChapters: [], suggestedFigures: [], visualArtifacts: [],
        followUps: [t.defaultFollowUp1, t.defaultFollowUp2],
        intent
      });
    }

    const sources = buildSources(selectedPairs, 9);
    const relatedChapters = buildRelatedChapters(selectedPairs, 5);
    let { confidence, confidence_reason } = computeConfidence(selectedPairs, usedExpandedSearch);
    // followUps and visualArtifacts are now resolved AFTER LLM response (T2)
    // Pre-compute the asset catalogue string for the system prompt injection
    const assetCatalogueStr = buildAssetCatalogueString(intent, question, 25);

    const context = selectedPairs
      .map(({ chunk }) => `${chunk.text}\n[URL interna a citar: ${buildChunkUrl(chunk)}]`)
      .join('\n\n---\n\n');
      
    const intentInstruction = getIntentInstruction(intent);
    const langName = locale === 'en' ? 'inglés' : locale === 'de' ? 'alemán' : locale === 'zh-Hans' ? 'chino simplificado' : 'español';

    // ── T2: Prompt estructurado (response_format: json_object) ────────────────
    const prompt = `INSTRUCCIÓN DE RESPUESTA:
${intentInstruction}

IDIOMA: Responde en ${langName}. Sin LaTeX. Sin listas salvo que el usuario las pida explícitamente.

FORMATO DE RESPUESTA OBLIGATORIO:
Responde EXCLUSIVAMENTE con un objeto JSON válido con estas claves exactas:
{
  "answer": "<tu respuesta en markdown, en ${langName}>",
  "citations": [
    { "claim": "<frase o concepto que citas>", "source_url": "<URL exacta del CONTEXTO>" }
  ],
  "recommended_asset_id": "<ID exacto de un asset de la lista ASSETS o null>",
  "glossary_terms_used": ["<término técnico 1>", "<término técnico 2>"],
  "follow_ups": ["<pregunta de seguimiento 1>", "<pregunta de seguimiento 2>"]
}

EXTENSIÓN del campo "answer": Adapta la longitud a la complejidad de la pregunta.
- Pregunta factual simple (dato, cifra, definición): 3-5 frases, directo.
- Pregunta técnica o causal (mecanismo, por qué): desarrolla el argumento completo sin truncar.
- Pregunta comparativa (REE vs ICAI vs ENTSO-E): desarrolla cada posición con evidencia.

PROHIBIDO en "answer":
- Empezar con "Según el contexto", "Basado en", "Es importante destacar", "En resumen".
- Repetir literalmente frases del CONTEXTO.
- Usar notación matemática ($H$, \\frac, etc.).
- Truncar una explicación causal por límite de longitud.

CIFRAS: Cita números EXACTAMENTE como aparecen en el CONTEXTO. No calcules, no redondees, no derives cifras propias. Si la fuente dice "1.955 MW", escribe "1.955 MW".

REGLAS PARA "citations":
- source_url DEBE ser una URL exacta del CONTEXTO ([URL interna a citar: /ruta#anchor]).
- Copia el anchor íntegro. NUNCA lo inventes ni lo modifiques.
- Si no hay URL en el contexto para un claim, omite esa citación.
- Máximo 4 citaciones.
- Cada "claim" debe ser una frase completa y autocontenida de máximo 120 caracteres. Si es más larga, resúmela; nunca la trunces a mitad de frase.

ENLACES DENTRO DE "answer":
- Integra 2-3 enlaces markdown en el texto usando las URLs del CONTEXTO.
  Ejemplo: "El mecanismo [Tap-Lag](/analisis-incidente#fase-2-taplag) amplificó la sobretensión."
- Usa SOLO URLs que aparezcan en el CONTEXTO como [URL interna a citar: ...]. PROHIBIDO inventar.
- También incluye esas mismas URLs en "citations" — los enlaces inline y las citaciones se complementan.
- Para términos técnicos del glosario, enlaza a /glosario#termino cuando proceda.

REGLAS PARA "recommended_asset_id":
- Elige UN SOLO asset de la lista ASSETS VISUALES DISPONIBLES si es relevante.
- Si ninguno es relevante, usa null.
- Usa el ID exacto tal como aparece en la lista.
- Si recomiendas un asset que contiene datos tabulares o una gráfica relevante, menciónalo en "answer": "Los datos detallados están en la tabla/figura del panel derecho."
- NUNCA digas "el TFG no detalla" o "no se incluye" si estás recomendando un asset que contiene esa información.

REGLAS PARA "follow_ups":
- Genera 2-3 preguntas de seguimiento naturales que el usuario podría querer hacer.
- Deben ser preguntas distintas a la pregunta actual.

${assetCatalogueStr}

CONTEXTO RECUPERADO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA (JSON):`;

    const systemPrompt = `Eres el asistente pericial del TFG "Análisis Forense del Apagón Ibérico del 28-A".
Responde SIEMPRE en formato JSON válido con las claves: answer, citations, recommended_asset_id, glossary_terms_used, follow_ups.

FECHA DEL EVENTO: El apagón ocurrió el 28 de abril de 2025. Si ves "2021" en algún contexto, es un error tipográfico — el evento fue en 2025.

ÁMBITO: Responde ÚNICAMENTE sobre el contenido del TFG. Si la pregunta pide datos actuales, en tiempo real, o fuera del período analizado (28-A y su contexto), di claramente: "Esta pregunta está fuera del alcance del TFG" y sugiere una fuente externa (OMIE, ESIOS, REE). No elabores una respuesta larga sobre preguntas fuera de ámbito.

IDENTIDAD: Respondes como un ingeniero eléctrico forense que ha analizado los informes clave (Gobierno/REE, ICAI/AELEC, ENTSO-E, NREL). Tu voz es técnica, precisa y directa.

FUENTES: Respondes ÚNICAMENTE con información del CONTEXTO proporcionado. Si el contexto no cubre la pregunta, dilo explícitamente: "Este aspecto no está cubierto en el TFG."

ESTILO:
- No uses LaTeX ni notación matemática.
- Usa unidades con rigor (MW, MVAr, Hz, kV, s, Hz/s, p.u.).
- Cita fuentes cuando el contexto las menciona (REE, ENTSO-E, ICAI, NREL).
- Si el panel derecho muestra un recurso visual relacionado, refiérelo de forma natural en tu explicación indicando qué buscar exactamente en él.
- Párrafos cortos con conectores causales. Evita listas salvo que el usuario las pida.

CIFRAS MAESTRAS VERIFICADAS (úsalas si el contexto no especifica):
- Inicio cascada: 12:32:56.993 CEST
- Nadir frecuencial: 47,79 Hz
- RoCoF máximo: ~1,5 Hz/s (ventana 100 ms)
- Pérdida de generación en cascada: ~15.000 MW en <30 s
- H_eq ibérico ponderado: 2,21–2,71 s (zonal sur: 1,3 s)
- Separación Francia: 12:33:21,535 CEST
- Cero de tensión: 12:33:29,741 CEST
- Demanda sin suministro: ~25.200 MW (ES) + ~5.800 MW (PT)
- Personas afectadas: ~57 millones
- Reposición 99%: ~18,5 horas
- Coste Operación Reforzada: >666 M€ (primeros 10 meses, estimación REE feb-2026)`;

    let llmResult;
    try {
      llmResult = await callLLM({
        prompt,
        systemPrompt,
        temperature: 0.18,
        maxTokens: 1400, // slightly higher to fit JSON envelope
      });
    } catch (llmError) {
      console.error('[api/chat] LLM provider error:', llmError?.message);

      return res.status(llmError?.status || 502).json({
        answer: t.llmUnavailable,
        error: llmError?.message || 'LLM provider error',
        sources,
        confidence,
        confidence_reason,
        relatedChapters,
        suggestedFigures: [],
        visualArtifacts: [],
        followUps: buildFollowUps(question, selectedPairs, intent, 3),
        citations: [],
        glossaryTerms: [],
        intent,
      });
    }

    const provider = llmResult?.provider || 'unknown';
    const model    = llmResult?.model    || 'unknown';
    const rawText  = llmResult?.text     || '{}';

    // ── T2: Parse structured response ────────────────────────────────────────
    const validResponseUrls = new Set(
      sources.map(source => normalizeInternalUrl(source.url)).filter(Boolean)
    );
    const structured = enforceAnswerContracts(
      parseStructuredResponse(rawText, selectedPairs, sources),
      question,
      validResponseUrls
    );
    structured.answer = sanitizeAnswerLinks(structured.answer, validResponseUrls, structured.citations);

    if (structured._parse_error) {
      console.warn('[api/chat] Structured parse failed — degraded mode (plain text answer)');
    }

    // Detect out-of-scope responses → suppress artifacts and override confidence
    const { isOutOfScope, hasMissingExactData } = getAnswerScope(structured.answer);

    // Resolve the LLM-chosen asset → full artifact object for the frontend
    const visualArtifacts = isOutOfScope
      ? []
      : buildVisualArtifacts(structured.recommended_asset_id, selectedPairs);

    if (isOutOfScope) {
      confidence = 'fuera_de_ambito';
      confidence_reason = 'Pregunta fuera del alcance del TFG.';
    } else if (hasMissingExactData && confidence === 'alta') {
      confidence = 'media';
      confidence_reason = 'El TFG aporta contexto, pero la propia respuesta indica que el dato exacto no está cubierto o no está disponible.';
    }

    // follow_ups: LLM-generated preferred, fallback if empty
    const followUps = structured.follow_ups && structured.follow_ups.length > 0
      ? structured.follow_ups
      : buildFollowUps(question, selectedPairs, intent, 3);

    return res.status(200).json({
      answer:            structured.answer,
      provider,
      model,
      sources,
      confidence,
      confidence_reason,
      relatedChapters,
      suggestedFigures:  [],
      visualArtifacts,
      followUps,
      // ── new structured fields (T2) ──────────────────────
      citations:         structured.citations,
      glossaryTerms:     structured.glossary_terms_used,
      recommended_asset_id: structured.recommended_asset_id,
      _parse_error:      structured._parse_error || false,
      intent,
    });

  } catch (error) {
    return errResponse(500, t.internalError, error.message, intent);
  }
}
