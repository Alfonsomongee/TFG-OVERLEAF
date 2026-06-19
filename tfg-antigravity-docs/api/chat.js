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

let figureCatalog = [];
function loadFigureCatalog() {
  if (figureCatalog.length > 0) return;
  try {
    const p1 = path.join(__dirname, '..', '..', 'galeriaforensedefinitiva.json');
    const p2 = path.join(__dirname, '..', 'galeriaforensedefinitiva.json');
    const p = fs.existsSync(p1) ? p1 : (fs.existsSync(p2) ? p2 : null);
    if (p) {
       const data = JSON.parse(fs.readFileSync(p, 'utf8'));
       data.categories.forEach(cat => {
         ['tables', 'graphics', 'interactives', 'figures', 'data_figures'].forEach(key => {
           if (cat[key]) {
             cat[key].forEach(item => {
               figureCatalog.push({ id: item.id, name: item.name, textMatch: normalizeText(item.name + ' ' + item.id) });
             });
           }
         });
       });
    }
  } catch(e) {
    console.error("[api/chat] Error loading figure catalog", e);
  }
}

function getFigureCandidates(question, contextText, maxItems = 6) {
  loadFigureCatalog();
  if (figureCatalog.length === 0) return [];
  const q = normalizeText(question);
  const ctx = normalizeText(contextText);
  const scored = figureCatalog.map(f => {
     let score = 0;
     const words = f.textMatch.split(/\s+/).filter(w => w.length > 3);
     words.forEach(w => {
        if (q.includes(w)) score += 3;
        if (ctx.includes(w)) score += 1;
     });
     if (q.includes(normalizeText(f.id))) score += 10;
     return { ...f, score };
  });
  return scored.filter(f => f.score > 0).sort((a,b) => b.score - a.score).slice(0, maxItems);
}

function buildSuggestedFigures(selectedPairs, maxItems = 3) {
  return []; // Ya no extraemos con regex, delegamos en el LLM.
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

// ── T2: Parse structured LLM response ────────────────────────────────────────

/**
 * Parses the JSON output from the LLM (response_format: json_object).
 * Validates citations against the actual retrieved chunk URLs.
 * Resolves recommended_asset_id to a full artifact object.
 *
 * Always returns a safe object — never throws.
 */
function parseStructuredResponse(rawText, selectedPairs) {
  // Build set of valid URLs from retrieved chunks
  const validUrls = new Set(
    selectedPairs
      .map(({ chunk }) => buildChunkUrl(chunk))
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
  const citations = rawCitations
    .filter(c => c && typeof c.source_url === 'string')
    .filter(c => {
      // Accept only URLs that exist in our retrieved context
      const url = c.source_url.split('#')[0]; // path without anchor
      const fullUrl = c.source_url;
      return (
        validUrls.has(fullUrl) ||
        [...validUrls].some(u => u.startsWith(url))
      );
    })
    .slice(0, 4) // max 4 citations
    .map(c => ({
      claim:      String(c.claim || '').slice(0, 200),
      source_url: String(c.source_url).slice(0, 300),
    }));

  return {
    answer:               typeof parsed.answer === 'string' ? parsed.answer : rawText,
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

// Placeholder — replaced by LLM-generated follow_ups
function _legacyBuildFollowUps_REMOVED() {}

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

// Stub kept to avoid breaking any remaining references during transition
function scoreArtifactForQuestion() { return 0; }

function buildVisualArtifacts_STUB() {
  // intentionally empty — use buildVisualArtifacts(recommended_asset_id, selectedPairs)
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

// ─────────────────────────────────────────────────────────────────────────────
// Stub so nothing breaks if old code paths reference it:
function buildVisualArtifacts_OLD(selectedPairs, chunksData, intent, question, maxItems = 4) {
  // Deprecated — use buildVisualArtifacts(recommended_asset_id, selectedPairs)
  return buildVisualArtifacts(null, selectedPairs);
}

function _scoreArtifactForQuestion_STUB() { return 0; }

function placeholder_legacy_start() {
  const q = normalizeText(question);
  const id = normalizeText(artifact?.id || '');
  const title = normalizeText(artifact?.title || '');
  const desc = normalizeText(artifact?.description || '');
  const origin = normalizeText(artifact?.origin || '');
  const text = normalizeText(chunk?.text || '');
  const haystack = `${id} ${title} ${desc} ${origin} ${text}`;

  let score = baseScore;

  if (source === 'selected') score *= 1.4;

  // ── Boosts por intent × tipo/source ───────────────────────────
  // annex_d = gráficas con datos reales ENTSO-E/ESIOS (máxima credibilidad)
  // annex_c = simuladores interactivos
  // annex_b = tablas forenses

  if (intent === 'quantitative') {
    if (artifact.type === 'table')            score *= 2.0;
    if (artifact.source === 'annex_d')        score *= 1.8;
    if (artifact.source === 'annex_entsoe')   score *= 2.2;
    if (artifact.type === 'interactive')      score *= 1.3;
  }
  if (intent === 'comparison') {
    if (artifact.type === 'table')            score *= 2.0;
    if (artifact.source === 'annex_d')        score *= 1.6;
    if (artifact.type === 'interactive')      score *= 1.2;
  }
  if (intent === 'visual') {
    if (artifact.source === 'annex_d')        score *= 2.8;
    if (artifact.source === 'annex_entsoe')   score *= 2.8;
    if (artifact.source === 'annex_figures')  score *= 2.2;
    if (artifact.source === 'annex_x')        score *= 3.5;
    if (artifact.type === 'interactive')      score *= 3.0;
    if (artifact.type === 'table')            score *= 0.8;

    // Override explícito: si la query menciona el nombre del simulador,
    // el simulador gana siempre sobre imágenes
    const SIMULATOR_KEYWORDS = {
      'ferranti':      ['ferranti', 'efecto ferranti', 'linea descargada', 'linea vacia'],
      'pvcurve':       ['curva p-v', 'pv curve', 'colapso de tension', 'punto de nariz', 'cargabilidad', 'colapso jacobiano', 'nariz'],
      'swing':         ['ecuacion del swing', 'swing equation', 'rocof', 'inercia', 'constante h'],
      'map':           ['mapa', 'propagacion', 'cascada geografica', 'animado', 'animated'],
      'sismograph':    ['sismografo', 'sismograph', '27 segundos', 'segundos criticos'],
      'timeline':      ['cronologia', 'timeline', 'linea de tiempo', 'cronograma'],
      'ansi59':        ['ansi 59', 'ansi59', 'proteccion sobretension', 'cascada ibr'],
      'phaseplane':    ['plano de fase', 'phase plane', 'trayectoria angular'],
      'frequency':     ['caida de frecuencia', 'nadir frecuencial', 'grafica de frecuencia'],
      'radar-vulnerabilidad': ['radar', 'vulnerabilidad', 'ejes'],
      'comparador-28a': ['comparador', 'comparacion escenarios'],
      'grid-strength-scr': ['scr', 'fortaleza de red', 'short circuit ratio', 'potencia de cortocircuito'],
      'mrscr-comparator':  ['mrscr', 'multi-maquina'],
      'dynamic-security-shift': ['frontera de seguridad', 'desplazamiento', 'seguridad dinamica'],
      'waterfall':     ['cascada financiera', 'waterfall', 'costes del apagon', 'coste total'],
      'matrix':        ['matriz de costes', 'opex capex', 'inaccion'],
    };
    if (artifact.type === 'interactive') {
      const simKws = SIMULATOR_KEYWORDS[artifact.id];
      if (simKws && simKws.some(kw => q.includes(kw))) {
        score *= 6.0;
      }
    }
  }
  if (intent === 'timeline') {
    if (artifact.source === 'annex_d')        score *= 2.2;  // gráficas temporales reales
    if (artifact.source === 'annex_entsoe')   score *= 2.5;
    if (artifact.type === 'interactive')      score *= 2.0;
    if (artifact.type === 'table')            score *= 1.6;
  }
  if (intent === 'causal') {
    if (artifact.source === 'annex_d')        score *= 2.0;  // diagramas causales reales
    if (artifact.type === 'interactive')      score *= 1.6;
    if (artifact.type === 'table')            score *= 1.3;
  }
  if (intent === 'glossary') {
    if (artifact.type === 'interactive')      score *= 2.0;  // simular > ver tabla
    if (artifact.source === 'annex_d')        score *= 1.5;
    if (artifact.type === 'table')            score *= 1.1;
  }
  if (intent === 'general') {
    if (artifact.source === 'annex_d')        score *= 1.6;  // siempre preferir datos reales
    if (artifact.source === 'annex_entsoe')   score *= 1.6;
    if (artifact.type === 'interactive')      score *= 1.3;
  }

  // Compensación por volumen: annex_c tiene solo 18 chunks vs 42 de annex_b
  if (artifact.source === 'annex_c')          score *= 1.35;

  // Boost adicional para annex_d con datos medidos directamente del 28-A
  // (identificados por IDs que contienen datos de WAMS, PMU o ENTSO-E)
  const ENTSOE_ESIOS_IDS = [
    'frequency_voltage_carmona', 'wams_oscilaciones_carmona',
    'entsoe_flow_deviation', 'heatmap_propagation', 'cascada_desconexiones',
    'tension_frecuencia_colapso', 'interconexion_francia_colapso',
    'asimetria_balance_reactiva_sur', 'fluctuaciones_tension_previas',
    'perdida_sincronismo_frontera', 'evolucion_carga_repuesta_francia',
    'recuperacion_demanda_peninsular', 'mapas_termicos_tension_ree',
    'aluvion_alertas_sobretension_sur', 'tap_lag_decoupling',
    'nunez_balboa_precursores', 'precursor_overvoltage_22april',
    'hvdc_control_transition', 'intercambio_marruecos_topdown',
    'evolucion_mix_reenergizacion', 'scr_iberia',
    'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
    'chart-6', 'chart-8', 'chart-9', 'chart-11', 'chart-12',
    'chart-13', 'chart-14', 'chart-18', 'chart-19', 'chart-20',
    'chart-21', 'chart-23',
  ];
  if (ENTSOE_ESIOS_IDS.includes(artifact.id)) score *= 1.5;

  const SEMANTIC_BOOSTS = {
    'chart-1':  ['demanda peninsular', 'caida de demanda', 'recuperacion demanda'],
    'chart-2':  ['demanda total iberica', 'carga total es pt',
                 'demanda ibérica', 'carga ibérica'],
    'chart-8':  ['renovable', 'co2', 'ibr', 'penetracion', 'porcentaje'],
    'chart-9':  ['precio', 'spot', 'omie', 'negativo', 'mercado'],
    'chart-11': ['precio', 'europa', 'mercado', 'day-ahead', 'mibel'],
    'chart-13': ['intercambio', 'frontera', 'p48', 'exportacion', 'saldo'],
    'chart-14': ['flujo', 'fisico', 'frontera', 'francia', 'marruecos'],
    'chart-18': ['desequilibrio', 'balance', 'generacion', 'demanda'],
    'chart-19': ['imbalance', 'desvio', 'mw', 'deficit'],
    'chart-20': ['precio', 'desvio', 'maximo', '9999', 'infarto'],
    'chart-21': ['reserva', 'frr', 'afrr', 'mfrr', 'frecuencia'],
    'chart-23': ['fallback entso-e', 'protocolo emergencia europeo',
                 'proceso in entso-e', 'desconexion continental'],
  };

  if (SEMANTIC_BOOSTS[artifact.id]) {
    if (SEMANTIC_BOOSTS[artifact.id].some(kw => q.includes(kw))) {
      score *= 3.0;
    }
  }

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

  // Simulador interactivo de frecuencia: boost extra cuando se pide
  // explícitamente una gráfica de frecuencia
  if ((q.includes('grafica') || q.includes('muestrame') || q.includes('ensename') ||
       q.includes('simulador') || q.includes('ver')) &&
      (q.includes('frecuencia') || q.includes('caida') || q.includes('hz'))) {
    if (artifact.id === 'frequency' && artifact.type === 'interactive') score *= 4.0;
  }

  if (q.includes('grafica') || q.includes('figura') || q.includes('ensename') || q.includes('muestrame')) {
    if (artifact.source === 'annex_d') score *= 2.0;
    if (artifact.type === 'interactive') score *= 1.2;
  }

  if (q.includes('ufls') || q.includes('deslastre') || q.includes('subfrecuencia')) {
    boostIds(['escalones-ufls', 'tension_frecuencia_colapso', 'evolucion-frecuencia-rocof'], 3.0);
  }

  if (q.includes('cascada') || q.includes('propagacion') || q.includes('efecto domino')) {
    boostIds(['map', 'heatmap_propagation', 'cascada_desconexiones'], 4.0);
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

  if (q.includes('demanda') || q.includes('perdio') || q.includes('perdida') ||
      q.includes('carga desconectada') || q.includes('mw desconect') ||
      q.includes('cuanta carga') || q.includes('desconecto')) {
    boostIds(['load-shedding-es-pt', 'demand-shedding-es',
              'demand-shedding-pt', 'dso-load-shedding'], 3.0);
    // Penalizar charts ENTSO-E de precios para esta pregunta
    if (['chart-9','chart-11','chart-2','chart-19'].includes(artifact.id)) score *= 0.15;
  }

  // Secuencia temporal de eventos → simuladores timeline y sismógrafo
  const SEQUENCE_KEYWORDS = [
    'secuencia', 'sequence', 'cronologia', 'chronology',
    '27 segundos', '27 seconds', 'critical seconds', 'segundos criticos',
    'paso a paso', 'step by step', 'timeline', 'linea de tiempo',
    'que paso', 'what happened', 'orden de eventos'
  ];
  if (SEQUENCE_KEYWORDS.some(k => q.includes(k))) {
    if (artifact.id === 'timeline') score *= 4.0;
    if (artifact.id === 'sismograph') score *= 3.5;
    if (artifact.id === 'sticky-collapse') score *= 3.0;
    if (artifact.id === 'map') score *= 2.0;
    // Penalizar charts ENTSO-E de intercambios para esta pregunta
    if (['chart-23','chart-14','chart-13'].includes(artifact.id)) score *= 0.2;
  }

  // Reformas, resiliencia, futuro → simuladores específicos
  const RESILIENCE_KEYWORDS = [
    'reforma', 'regulacion', 'propone', 'evitar', 'prevenir',
    'resiliencia', 'futuro', 'solucion', 'recomendacion',
    'gfm', 'bess', 'inversor formador', 'grid-forming',
    'ers', 'mercado capacidad', 'nc rfg'
  ];
  if (RESILIENCE_KEYWORDS.some(k => q.includes(k))) {
    if (artifact.id === 'matrix') score *= 4.0;
    if (artifact.id === 'radar-vulnerabilidad') score *= 3.5;
    if (artifact.id === 'comparador-28a') score *= 3.0;
    if (artifact.id === 'waterfall') score *= 2.5;
    if (['coste_optimo_ers', 'ers_revenue_stacking',
         'gfl_vs_gfm_circuit1', 'po74_banda_muerta'].includes(artifact.id)) {
      score *= 2.5;
    }
    // Penalizar artifacts de recuperación para preguntas de reforma
    if (['recuperacion_demanda_peninsular', 'estrategia_reenergizacion_dual',
         'black_start_hidroelectrico'].includes(artifact.id)) score *= 0.2;
  }

  // Preguntas sobre MW perdidos en cascada IBR no necesitan charts de precios
  const CASCADE_MW_KEYWORDS = [
    'mw perdidos', 'mw se perdieron', 'cascada ibr',
    'desconexiones ibr', 'generacion perdida', 'potencia perdida',
    'cuantos mw', 'perdida de generacion'
  ];
  if (CASCADE_MW_KEYWORDS.some(k => q.includes(k))) {
    if (['chart-8','chart-9','chart-10','chart-11',
         'chart-20','chart-22'].includes(artifact.id)) score *= 0.1;
    boostIds(['secuencia-desconexion-suroeste',
              'cascada_desconexiones', 'heatmap_propagation'], 3.5);
    if (artifact.id === 'map') score *= 3.0;
    if (artifact.id === 'ansi59') score *= 2.5;
  }

  // Penalizar artifacts de tensión/precursores para preguntas económicas
  const ECONOMIC_KEYWORDS = ['coste', 'precio', 'economico', 'financiero',
    'opex', 'capex', 'mercado', 'euro', 'impacto economico'];
  const TENSION_ARTIFACT_IDS = ['precursor_overvoltage_22april',
    'hvdc_control_transition', 'entsoe_flow_deviation',
    'nunez_balboa_precursores', 'wams_oscilaciones_carmona'];
  if (ECONOMIC_KEYWORDS.some(k => q.includes(k)) &&
      TENSION_ARTIFACT_IDS.includes(artifact.id)) {
    score *= 0.2;
  }

  // Penalizar artifacts de recuperación/reposición para preguntas de precio
  const PRICE_KEYWORDS = ['precio', 'spot', 'omie', 'tarifa', 'kwh', 'mwh'];
  const RECOVERY_ARTIFACT_IDS = ['estrategia_reenergizacion_dual',
    'black_start_hidroelectrico', 'islas_reposicion_entsoe',
    'evolucion_carga_repuesta_francia'];
  if (PRICE_KEYWORDS.some(k => q.includes(k)) &&
      RECOVERY_ARTIFACT_IDS.includes(artifact.id)) {
    score *= 0.25;
  }

  // Los tres artifacts más omnipresentes necesitan penalización base
  // salvo cuando la pregunta los pide explícitamente
  const OMNIPRESENT_ARTIFACTS = {
    'precursor_overvoltage_22april': ['precursor', 'abril', '22 de abril', 'nunez balboa', 'oscilacion previa', 'evento previo'],
    'entsoe_flow_deviation': ['ntc', 'desvio', 'programa intercambio', 'flujo comercial', 'intercambio programado'],
    'hvdc_control_transition': ['hvdc', 'santa llogaia', 'pmode', 'inelfe', 'enlace hvdc'],
    'chart-23': ['fallback', 'protocolo entso', 'proceso in',
                 'separacion continental', 'interconexion europea'],
    'chart-2': ['demanda total iberica', 'mwh semana',
                'carga iberica total', 'perdida total suministro'],
  };
  if (OMNIPRESENT_ARTIFACTS[artifact.id]) {
    const isExplicit = OMNIPRESENT_ARTIFACTS[artifact.id].some(k => q.includes(k));
    if (!isExplicit) score *= 0.3;
  }

  // Tablas de desconexión de carga — boost fuerte para que
  // lleguen al panel y el LLM tenga los datos exactos de PT
  const LOAD_SHEDDING_KEYWORDS = [
    'carga desconectada', 'carga se desconecto', 'cuanta carga',
    'demanda desconectada', 'mw desconect', 'suministro perdido',
    'demand shedding', 'load shedding', 'desconexion de carga',
    'cuanto se perdio', 'cuanta demanda'
  ];
  if (LOAD_SHEDDING_KEYWORDS.some(k => q.includes(k))) {
    if (['load-shedding-es-pt', 'demand-shedding-es',
         'demand-shedding-pt', 'dso-load-shedding',
         'pump-storage-es', 'pump-storage-pt'].includes(artifact.id)) {
      score *= 5.0;
    }
    if (['chart-2','chart-9','chart-11','chart-20'].includes(artifact.id)) {
      score *= 0.05;
    }
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
    .filter(item => item.source === 'selected' || item.score >= maxScore * 0.50)
    .slice(0, maxItems)
    .map(item => {
      const art = item.artifact;
      const extraProps = {};
      if (art.type === 'table') {
        extraProps.columns = FORENSIC_TABLES[art.id]?.columns || [];
        extraProps.data = FORENSIC_TABLES[art.id]?.data || [];
      }
      return {
        ...art,
        ...extraProps,
        relevance: parseFloat((item.score / maxScore).toFixed(2))
      };
    });
}

// buildFollowUps is now a fallback-only function.
// Primary follow_ups come from the LLM structured response.
// This is called only when parsed.follow_ups is empty.
// (Body moved above, inside the restructured section)

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

    const sources = buildSources(selectedPairs, 5);
    const relatedChapters = buildRelatedChapters(selectedPairs, 5);
    const { confidence, confidence_reason } = computeConfidence(selectedPairs, usedExpandedSearch);
    // followUps and visualArtifacts are now resolved AFTER LLM response (T2)
    // Pre-compute the asset catalogue string for the system prompt injection
    const assetCatalogueStr = buildAssetCatalogueString(intent, question, 25);

    const context = selectedPairs
      .map(({ chunk }) => `${chunk.text}\n[URL interna a citar: ${buildChunkUrl(chunk)}]`)
      .join('\n\n---\n\n');
      
    // figureCandidates retained for backward compat with getIntentInstruction
    const figureCandidates = getFigureCandidates(question, context, 6);
    const figureCandidatesStr = figureCandidates.map(f => `- ID: "${f.id}" | Nombre: "${f.name}"`).join('\n');

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

REGLAS PARA "citations":
- source_url DEBE ser una URL exacta del CONTEXTO ([URL interna a citar: /ruta#anchor]).
- Copia el anchor íntegro. NUNCA lo inventes ni lo modifiques.
- Si no hay URL en el contexto para un claim, omite esa citación.
- Máximo 4 citaciones.

REGLAS PARA "recommended_asset_id":
- Elige UN SOLO asset de la lista ASSETS VISUALES DISPONIBLES si es relevante.
- Si ninguno es relevante, usa null.
- Usa el ID exacto tal como aparece en la lista.

REGLAS PARA "follow_ups":
- Genera 2-3 preguntas de seguimiento naturales que el usuario podría querer hacer.
- Deben ser preguntas distintas a la pregunta actual.

ENLACES DENTRO DE "answer":
1. Usa las URLs exactas del CONTEXTO (campo [URL interna a citar: /ruta#anchor]).
2. Integra 2-3 en el flujo natural: "El fenómeno [Tap-Lag](/analisis-incidente#fase-2-taplag) creó..."
3. PROHIBIDO inventar URLs. Si no está en el CONTEXTO, no la pongas.

${assetCatalogueStr}

CONTEXTO RECUPERADO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA (JSON):`;

    const systemPrompt = `Eres el asistente pericial del TFG "Análisis Forense del Apagón Ibérico del 28-A".

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
    const structured = parseStructuredResponse(rawText, selectedPairs);

    if (structured._parse_error) {
      console.warn('[api/chat] Structured parse failed — degraded mode (plain text answer)');
    }

    // Resolve the LLM-chosen asset → full artifact object for the frontend
    const visualArtifacts = buildVisualArtifacts(
      structured.recommended_asset_id,
      selectedPairs
    );

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
