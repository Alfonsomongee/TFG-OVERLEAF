# Código Fuente del Chatbot de IA (RAG) — Versión en Español

Este documento contiene el código fuente completo, exacto y sin truncar del sistema de chatbot basado en Recuperación Aumentada por Generación (RAG) para el TFG. Esta versión ha sido simplificada para incluir únicamente las cadenas de interfaz y lógica en español.

## Componentes del Sistema

1. **API del Servidor (Buscador RAG)**: [api/chat.js](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/api/chat.js) — Motor de búsqueda semántica (MiniSearch), clasificación de intención, pesos por palabra clave, selección MMR de fragmentos y orquestación con los modelos de lenguaje (Groq/DeepSeek).
2. **API del Servidor (Contexto de Figuras)**: [api/figure-context.js](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/api/figure-context.js) — Generación dinámica mediante LLM del texto "¿Por qué es relevante esta figura?" en función de la pregunta del usuario.
3. **Componente de Interfaz (Widget Flotante)**: [src/components/ChatWidget.jsx](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/components/ChatWidget.jsx) — Botón flotante animado de acceso al chat con historial y control del estado del chat.
4. **Componente de Interfaz (Pantalla Completa)**: [src/components/ChatFullscreen.jsx](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/components/ChatFullscreen.jsx) — Interfaz dividida (Split-Pane) que muestra los mensajes de la IA a la izquierda y renderiza dinámicamente las gráficas reales (ENTSO-E/ESIOS) y los simuladores interactivos a la derecha.

---

### 1. api/chat.js
Ruta del archivo: `api/chat.js`

```javascript
// api/chat.js
const MiniSearch = require('minisearch');
const fs = require('fs');
const path = require('path');

let chunks = null;
let miniSearch = null;
let searchInitPromise = null;

const FORENSIC_TABLES = {};
try {
  const cats = JSON.parse(fs.readFileSync(
    path.join(process.cwd(), 'static/data/processed/forensic_categories.json'), 'utf8'
  ));
  cats.categories.forEach(cat => {
    (cat.tables || []).forEach(t => { FORENSIC_TABLES[t.id] = t; });
  });
} catch(e) {}

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

  // Si hay una carga en curso, esperar a la misma promesa (evita doble carga concurrente)
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
      console.log(`[api/chat] MiniSearch cargado en ${Date.now() - t0}ms, ${Object.keys(chunks).length} fragmentos`);
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
      const error = new Error(`Tiempo de espera agotado del LLM tras ${timeoutMs}ms`);
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
    12000
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
    18000
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

  console.log('[api/chat] Configuración LLM:', {
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
      ? `Todos los proveedores fallaron: ${errors.map(e => `${e.provider}:${e.status}`).join(', ')}`
      : 'No hay proveedor de LLM configurado'
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

  // Línea temporal (Timeline)
  match(['evolucion', 'evoluciono', 'durante', '27 segundos',
         'segundos criticos', 'cronologia', 'secuencia', 'minuto a minuto',
         'sequence', 'timeline', 'chronology', 'step by step',
         'what happened', '27 seconds', 'critical seconds',
         'order of events'],
        'timeline', 3);

  // Cuantitativa (Quantitative)
  match(['cuanta', 'cuanto', 'cifra', 'porcentaje', 'demanda',
         'mw', 'hz', 'mvar', 'kv', 'solar', 'mix',
         'how much', 'how many', 'percentage', 'value',
         'magnitude', 'figure', 'number'],
        'quantitative', 2);

  // Causal
  match(['reactiva', 'potencia reactiva', 'mvar', 'q-v', 'sobretension',
         'reactive power', 'overvoltage', 'voltage collapse'],
        'causal', 2);

  match(['por que', 'como amplifico', 'como actuo', 'mecanismo',
         'detonante', 'causa', 'agravo', 'tap-lag', 'ufls',
         'colapso en vez de',
         'why', 'how did', 'mechanism', 'trigger', 'cause',
         'root cause', 'what caused', 'reason'],
        'causal', 3);

  // Comparación
  match(['compara', 'comparar', 'vs', 'frente a', 'diferencia entre',
         'discrepan', 'ree', 'icai', 'entso-e',
         'compare', 'versus', 'difference', 'disagree', 'discrepancy',
         'contrast'],
        'comparison', 3);

  // Glosario
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

// Boosts por intención × tipo de fragmento (chunkType)
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

// Reglas de boost por coincidencia de palabras clave
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

// Reglas de penalización por páginas irrelevantes en la búsqueda
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

    // 1. Boost por combinación intención × tipo de fragmento
    const tableKey = `${intent}:${ct}`;
    if (INTENT_BOOST_TABLE[tableKey]) score *= INTENT_BOOST_TABLE[tableKey];

    // Caso especial: causal + figura de datos
    if (intent === 'causal' && ct === 'data_figure' && chunk.artifact) {
      if (!normQ.includes(normalizeText(chunk.artifact.id))) score /= 1.25;
    }

    // 2. Boost por coincidencia de palabras clave en el fragmento
    if (kws.some(kw => normQ.includes(normalizeText(kw)))) score *= 1.2;

    // 3. Boost por coincidencia en títulos
    if (qTerms.some(t => title.includes(t) || heading.includes(t))) score *= 1.15;

    // 4. Boosts mediante reglas declarativas de palabras clave
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

    // Boost especial para el glosario
    if (ct === 'glossary' && (intent === 'glossary' || intent === 'general')) {
      score *= 1.4;
    }

    // Penalización por fragmentos excesivamente cortos
    if (!chunk.text || chunk.text.length < 100) score *= 0.7;

    // 6. Penalizaciones por contexto irrelevante
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

  const chunksMap = chunksData instanceof Map
    ? chunksData
    : new Map(Object.entries(chunksData));

  // Filtrado inicial de candidatos por relevancia mínima
  const candidates = rerankedResults.filter(r => {
    const chunk = chunksMap.get(String(r.id));
    if (!chunk) return false;
    const ct = chunk.chunkType || 'normal';
    if (ct === 'master_data' || ct === 'glossary') return true;
    return r.adjustedScore >= bestScore * 0.12;
  });

  // Asegurar que el fragmento maestro de datos nominales esté en el pool
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

  // Algoritmo de reordenamiento y selección MMR (Maximal Marginal Relevance)
  while (candidates.length > 0 && picked.length < maxChunks) {
    let bestCand = null;
    let bestMMR = -Infinity;

    for (const cand of candidates) {
      if (picked.some(p => p.result.id === cand.id)) continue;

      const chunk = chunksMap.get(String(cand.id));
      if (!chunk) continue;

      const ct = chunk.chunkType || 'normal';
      const slug = chunk.slug || 'unknown';

      // Control de diversidad por sección de procedencia
      const slugUsed = slugCount[slug] || 0;
      if (slugUsed >= 2 && ct !== 'master_data' && ct !== 'glossary') continue;

      const relevance = cand.adjustedScore || 0;

      // Penalización por redundancia semántica
      const redundancy = picked.length > 0
        ? Math.max(...picked.map(p =>
            textSimilarity(chunk.text || '', p.chunk.text || '')
          ))
        : 0;

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
    console.error("[api/chat] Error cargando catálogo de figuras", e);
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
    if (artifact.type === 'interactive')      score *= 1.8;
    if (artifact.type === 'table')            score *= 0.8;
  }
  if (intent === 'timeline') {
    if (artifact.source === 'annex_d')        score *= 2.2;
    if (artifact.source === 'annex_entsoe')   score *= 2.5;
    if (artifact.type === 'interactive')      score *= 2.0;
    if (artifact.type === 'table')            score *= 1.6;
  }
  if (intent === 'causal') {
    if (artifact.source === 'annex_d')        score *= 2.0;
    if (artifact.type === 'interactive')      score *= 1.6;
    if (artifact.type === 'table')            score *= 1.3;
  }
  if (intent === 'glossary') {
    if (artifact.type === 'interactive')      score *= 2.0;
    if (artifact.source === 'annex_d')        score *= 1.5;
    if (artifact.type === 'table')            score *= 1.1;
  }
  if (intent === 'general') {
    if (artifact.source === 'annex_d')        score *= 1.6;
    if (artifact.source === 'annex_entsoe')   score *= 1.6;
    if (artifact.type === 'interactive')      score *= 1.3;
  }

  if (artifact.source === 'annex_c')          score *= 1.35;

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
    'chart-2':  ['demanda total iberica', 'carga total es pt', 'demanda ibérica', 'carga ibérica'],
    'chart-8':  ['renovable', 'co2', 'ibr', 'penetracion', 'porcentaje'],
    'chart-9':  ['precio', 'spot', 'omie', 'negativo', 'mercado'],
    'chart-11': ['precio', 'europa', 'mercado', 'day-ahead', 'mibel'],
    'chart-13': ['intercambio', 'frontera', 'p48', 'exportacion', 'saldo'],
    'chart-14': ['flujo', 'fisico', 'frontera', 'francia', 'marruecos'],
    'chart-18': ['desequilibrio', 'balance', 'generacion', 'demanda'],
    'chart-19': ['imbalance', 'desvio', 'mw', 'deficit'],
    'chart-20': ['precio', 'desvio', 'maximo', '9999', 'infarto'],
    'chart-21': ['reserva', 'frr', 'afrr', 'mfrr', 'frecuencia'],
    'chart-23': ['fallback entso-e', 'protocolo emergencia europeo', 'separacion continental'],
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
    boostIds(['load-shedding-es-pt', 'demand-shedding-es', 'demand-shedding-pt', 'dso-load-shedding'], 3.0);
    if (['chart-9','chart-11','chart-2','chart-19'].includes(artifact.id)) score *= 0.15;
  }

  const SEQUENCE_KEYWORDS = ['secuencia', 'cronologia', '27 segundos', 'segundos criticos', 'paso a paso', 'timeline', 'que paso'];
  if (SEQUENCE_KEYWORDS.some(k => q.includes(k))) {
    if (artifact.id === 'timeline') score *= 4.0;
    if (artifact.id === 'sismograph') score *= 3.5;
    if (artifact.id === 'sticky-collapse') score *= 3.0;
    if (artifact.id === 'map') score *= 2.0;
    if (['chart-23','chart-14','chart-13'].includes(artifact.id)) score *= 0.2;
  }

  const RESILIENCE_KEYWORDS = ['reforma', 'regulacion', 'propone', 'evitar', 'resiliencia', 'futuro', 'gfm', 'bess', 'ers'];
  if (RESILIENCE_KEYWORDS.some(k => q.includes(k))) {
    if (artifact.id === 'matrix') score *= 4.0;
    if (artifact.id === 'radar-vulnerabilidad') score *= 3.5;
    if (artifact.id === 'comparador-28a') score *= 3.0;
    if (artifact.id === 'waterfall') score *= 2.5;
    if (['coste_optimo_ers', 'ers_revenue_stacking', 'gfl_vs_gfm_circuit1', 'po74_banda_muerta'].includes(artifact.id)) {
      score *= 2.5;
    }
    if (['recuperacion_demanda_peninsular', 'estrategia_reenergizacion_dual', 'black_start_hidroelectrico'].includes(artifact.id)) score *= 0.2;
  }

  const CASCADE_MW_KEYWORDS = ['mw perdidos', 'cascada ibr', 'desconexiones ibr', 'generacion perdida'];
  if (CASCADE_MW_KEYWORDS.some(k => q.includes(k))) {
    if (['chart-8','chart-9','chart-10','chart-11', 'chart-20','chart-22'].includes(artifact.id)) score *= 0.1;
    boostIds(['secuencia-desconexion-suroeste', 'cascada_desconexiones', 'heatmap_propagation'], 3.5);
    if (artifact.id === 'map') score *= 3.0;
    if (artifact.id === 'ansi59') score *= 2.5;
  }

  const ECONOMIC_KEYWORDS = ['coste', 'precio', 'economico', 'mercado', 'euro'];
  const TENSION_ARTIFACT_IDS = ['precursor_overvoltage_22april', 'hvdc_control_transition', 'entsoe_flow_deviation', 'nunez_balboa_precursores', 'wams_oscilaciones_carmona'];
  if (ECONOMIC_KEYWORDS.some(k => q.includes(k)) && TENSION_ARTIFACT_IDS.includes(artifact.id)) {
    score *= 0.2;
  }

  const PRICE_KEYWORDS = ['precio', 'spot', 'omie', 'tarifa'];
  const RECOVERY_ARTIFACT_IDS = ['estrategia_reenergizacion_dual', 'black_start_hidroelectrico', 'islas_reposicion_entsoe', 'evolucion_carga_repuesta_francia'];
  if (PRICE_KEYWORDS.some(k => q.includes(k)) && RECOVERY_ARTIFACT_IDS.includes(artifact.id)) {
    score *= 0.25;
  }

  const OMNIPRESENT_ARTIFACTS = {
    'precursor_overvoltage_22april': ['precursor', 'abril', '22 de abril'],
    'entsoe_flow_deviation': ['ntc', 'desvio', 'intercambio programado'],
    'hvdc_control_transition': ['hvdc', 'santa llogaia', 'pmode'],
    'chart-23': ['fallback', 'separacion continental'],
    'chart-2': ['demanda total iberica', 'carga iberica total'],
  };
  if (OMNIPRESENT_ARTIFACTS[artifact.id]) {
    const isExplicit = OMNIPRESENT_ARTIFACTS[artifact.id].some(k => q.includes(k));
    if (!isExplicit) score *= 0.3;
  }

  const LOAD_SHEDDING_KEYWORDS = ['carga desconectada', 'demanda desconectada', 'desconexion de carga'];
  if (LOAD_SHEDDING_KEYWORDS.some(k => q.includes(k))) {
    if (['load-shedding-es-pt', 'demand-shedding-es', 'demand-shedding-pt', 'dso-load-shedding', 'pump-storage-es', 'pump-storage-pt'].includes(artifact.id)) {
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

function buildFollowUps(question, selectedPairs, intent, maxItems = 3) {
  const q = normalizeText(question);
  const suggestions = [];
  
  const isRepetitive = (text) => {
    const nText = normalizeText(text);
    if (nText === q) return true;
    const qWords = new Set(q.split(/\s+/).filter(w => w.length > 3));
    const nWords = nText.split(/\s+/).filter(w => w.length > 3);
    if (nWords.length === 0) return false;
    const common = nWords.filter(w => qWords.has(w)).length;
    return (common / nWords.length) > 0.6;
  };

  const add = (text) => { 
    if (text && !suggestions.includes(text) && !isRepetitive(text)) {
      suggestions.push(text);
    } 
  };

  if (q.includes('como empezo') || q.includes('como inicio') || q.includes('por que se fue la luz') || q.includes('explicame de forma sencilla')) {
    add('¿Cuál fue la causa física principal frente a los factores agravantes?');
    add('¿Cómo se conectan Tap-Lag, potencia reactiva y pérdida de generación?');
    add('¿Por qué no fue simplemente un problema de baja inercia?');
  } else if (q.includes('coste') || q.includes('opex') || q.includes('capex') || q.includes('operacion reforzada')) {
    add('¿Por qué la Operación Reforzada es más cara que invertir en resiliencia?');
    add('¿Qué parte del coste corresponde a OPEX recurrente y cuál a CAPEX preventivo?');
    add('¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?');
  } else if (q.includes('francia') || q.includes('rte') || q.includes('interconexion')) {
    add('¿Qué papel jugó la interconexión con Francia en el punto de no retorno?');
    add('¿Por qué la condición de isla energética agravó el apagón ibérico?');
    add('¿Cómo se combinó el soporte de Francia con el Black Start hidroeléctrico?');
  } else if (q.includes('black start') || q.includes('reposicion') || q.includes('arranque')) {
    add('¿Por qué el Black Start hidroeléctrico fue crucial en la recuperación?');
    add('¿Qué limitaciones tenían los inversores grid-following durante la reposición?');
    add('¿Cuánto tardó en restaurarse el servicio a la península completa?');
  } else if (q.includes('eas') || q.includes('alerta europea') || q.includes('entso-e')) {
    add('¿Por qué falló la coordinación entre el EAS de ENTSO-E y REE?');
    add('¿Qué información le faltó a REE para anticipar el apagón?');
    add('¿Cómo impactó la ceguera del sistema en la propagación del evento?');
  } else if (q.includes('reforma') || q.includes('ers') || q.includes('mercado') || q.includes('solucion')) {
    add('¿Qué servicios de estabilidad debería remunerar el mercado ERS?');
    add('¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?');
    add('¿Por qué la Operación Reforzada es más cara que invertir en resiliencia?');
  } else if (q.includes('figura') || q.includes('simulador') || q.includes('grafica')) {
    add('¿Qué simulador muestra mejor la secuencia completa del colapso?');
    add('¿Qué figura ayuda a distinguir frecuencia, tensión y potencia reactiva?');
    add('¿Dónde se ve mejor la caída de frecuencia durante los 27 segundos críticos?');
  } else if (q.includes('gfm') || q.includes('grid forming') || q.includes('bess')) {
    add('¿En qué se diferencia un inversor grid-forming de uno grid-following?');
    add('¿Por qué los BESS-GFM podrían sustituir parte de la inercia síncrona?');
    add('¿Qué servicios de estabilidad debería remunerar el mercado ERS?');
  } else if (q.includes('tap-lag') || q.includes('oltc')) {
    add('¿Qué relación tiene el Tap-Lag con la inyección de reactiva capacitiva?');
    add('¿Qué recomiendan los informes periciales para mitigar el Tap-Lag?');
  } else if (q.includes('ufls') || q.includes('deslastre')) {
    add('¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?');
    add('¿Se podría haber diseñado un relé de sobretensión (OVS) que evitase el colapso?');
  } else if (q.includes('mallado') || q.includes('scr')) {
    add('¿Por qué REE decidió mallar la red a pesar de la baja potencia de cortocorticuito?');
    add('¿Cómo afectó el mallado a la saturación de reactiva capacitiva?');
  } else if (q.includes('responsable') || q.includes('culpa') || q.includes('cnmc')) {
    add('¿Qué dice la normativa sobre la responsabilidad en un overvoltage-driven blackout?');
    add('¿En qué discrepan exactamente REE, ICAI y ENTSO-E sobre la causa del apagón?');
  } else {
    const textContext = [
      ...selectedPairs.map(p => `${p.chunk.title || ''} ${p.chunk.heading || ''} ${p.chunk.text || ''}`)
    ].join(' ').toLowerCase();

    if (textContext.includes('tap-lag')) add('¿Cómo amplificó el Tap-Lag la sobretensión en la red de 220 kV?');
    if (textContext.includes('ufls')) add('¿Por qué el UFLS agravó el colapso de tensión en vez de frenarlo?');
    if (textContext.includes('inercia')) add('¿La baja inercia fue causa raíz o solo un factor agravante?');
    if (textContext.includes('ree')) add('¿En qué discrepan exactamente REE, ICAI y ENTSO-E sobre la causa del apagón?');
    if (textContext.includes('francia')) add('¿Por qué la condición de isla energética agravó el apagón ibérico?');
    if (textContext.includes('reactiva')) add('¿Qué es el margen Q-V y por qué se agotó el 28-A?');
    if (textContext.includes('black start')) add('¿Qué limitaciones tenían los inversores grid-following durante la reposición?');
    if (textContext.includes('coste')) add('¿Qué tecnologías reducirían estructuralmente el riesgo de otro apagón?');
  }

  if (suggestions.length < 2) {
    add('¿Cuál fue la causa física principal del apagón del 28-A?');
    add('¿Qué diferencia hay entre la explicación de REE y la del informe ICAI?');
    add('¿Por qué el exceso de reactiva capacitiva fue tan letal el 28-A?');
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

  const { question, mode = 'normal' } = req.body || {};
  const trimmedQ = question?.trim() || '';
  if (!trimmedQ || typeof question !== 'string') {
    return errResponse(400, 'No he podido procesar tu solicitud.', 'Pregunta vacía.');
  }

  const VALID_SHORT_TERMS = new Set([
    'ibr', 'gfm', 'gfl', 'ufls', 'hvdc', 'pmu', 'wams', 'ree', 'ren', 'rte', 'q-v', 'pcc',
    'scr', 'ers', 'nhv', 'mhv', 'oltc', 'sssc', 'bess', 'ffr', 'afrr', 'mfrr', 'fcr',
    'ntc', 'atc', 'ptc', '28-a', '28a', 'tap', 'mw', 'hz', 'kv', 'mvar', 'gw', 'gvar',
    'rocof', 'p.o. 7.4', 'po 7.4', 'po 74', 'ansi 59', 'ansi59', 'n-1', 'n-k', 'mrscr', 'pll', 'vsc'
  ]);

  const isShortButValid =
    trimmedQ.length < 10 &&
    VALID_SHORT_TERMS.has(trimmedQ.toLowerCase().replace(/[¿?.]/g, ''));

  if (trimmedQ.length < 10 && !isShortButValid) {
    return errResponse(400,
      'La pregunta es demasiado corta. Prueba a formularla con más detalle. ' +
      'Por ejemplo: "¿Qué es el Tap-Lag?" o "¿Cuánta demanda se perdió?"',
      'Pregunta demasiado corta (mínimo 10 caracteres).');
  }

  const intent = classifyIntent(question, mode);

  try {
    let searcher;
    try {
      searcher = await getSearch();
    } catch (e) {
      return errResponse(500, 'Error al buscar en el TFG.', 'Falta el archivo de índice.', intent);
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

    const STOP_WORDS = new Set([
      'que', 'es', 'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'y', 'o', 'a',
      'por', 'para', 'con', 'se', 'su', 'sus', 'como', 'si', 'no', 'lo', 'le', 'me', 'te',
      'nos', 'al', 'hay', 'fue', 'son', 'era', 'ser', 'fue', 'han', 'has', 'cuál', 'cual', 'qué'
    ]);

    const keyTerms = normalizeText(baseQuery)
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOP_WORDS.has(t));

    if (keyTerms.length > 0 && keyTerms.length < normalizeText(baseQuery).split(/\s+/).length) {
      const keyQuery = keyTerms.join(' ');
      const keyResults = searcher.search(keyQuery, { prefix: true, fuzzy: t => t.length > 3 ? 1 : 0 });
      const existingIds = new Set(results.map(r => r.id));
      keyResults.forEach(r => {
        if (!existingIds.has(r.id)) results.push({ ...r, score: r.score * 0.85 });
      });
    }

    if (intent === 'glossary') {
      const normQ = normalizeText(baseQuery);
      for (const [id, chunk] of Object.entries(chunks)) {
        if (chunk.chunkType !== 'glossary') continue;
        const normHeading = normalizeText(chunk.heading || '');
        if (normHeading.length > 2 && normQ.includes(normHeading)) {
          const alreadyIn = results.some(r => String(r.id) === String(id));
          if (!alreadyIn) {
            results.push({ id: isNaN(id) ? id : Number(id), score: 80, terms: [], match: {} });
          } else {
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
        answer: 'No he encontrado información relevante en el TFG para responder a tu pregunta. Prueba a reformularla o consulta el glosario.',
        sources: [], confidence: 'sin_evidencia', confidence_reason: 'No se recuperaron fragmentos útiles.',
        relatedChapters: [], suggestedFigures: [], visualArtifacts: [],
        followUps: ['¿Cuál fue la causa principal del apagón del 28-A?', '¿Dónde aparece explicado el Tap-Lag en el TFG?'],
        intent
      });
    }

    const sources = buildSources(selectedPairs, 5);
    const relatedChapters = buildRelatedChapters(selectedPairs, 5);
    const { confidence, confidence_reason } = computeConfidence(selectedPairs, usedExpandedSearch);
    const followUps = buildFollowUps(question, selectedPairs, intent, 3);
    const visualArtifacts = buildVisualArtifacts(selectedPairs, chunks, intent, question, 2);

    const context = selectedPairs
      .map(({ chunk }) => `${chunk.text}\n[URL interna a citar: ${buildChunkUrl(chunk)}]`)
      .join('\n\n---\n\n');
      
    const figureCandidates = getFigureCandidates(question, context, 6);
    const intentInstruction = getIntentInstruction(intent);

    const prompt = `INSTRUCCIÓN DE RESPUESTA:
${intentInstruction}

IDIOMA: Responde en español. Sin LaTeX. Sin listas salvo que el usuario las pida explícitamente.

EXTENSIÓN: Adapta la longitud a la complejidad de la pregunta.
- Pregunta factual simple (dato, cifra, definición): 3-5 frases, directo.
- Pregunta técnica o causal (mecanismo, por qué): desarrolla el argumento completo sin truncar. Prioriza la precisión causal.
- Pregunta comparativa (REE vs ICAI vs ENTSO-E): desarrolla cada posición con evidencia.

PROHIBIDO:
- Empezar con "Según el contexto", "Basado en", "En resumen".
- Repetir literalmente frases del CONTEXTO.
- Inventar URLs o citas no presentes en el CONTEXTO.
- Usar notación matemática ($H$, \\frac, etc.).

${visualArtifacts && visualArtifacts.length > 0 ? `RECURSO VISUAL EN EL PANEL DERECHO:
"${visualArtifacts[0].title}" — ${(visualArtifacts[0].description || '').substring(0, 150)}
→ Haz referencia a este recurso DENTRO de tu explicación (no al final).
   Indica QUÉ elemento concreto debe buscar el usuario (curva, columna, valor, timestamp) y QUÉ confirma de tu argumento.
` : ''}ENLACES EN EL TEXTO:
1. Cada fragmento del CONTEXTO termina con [URL interna a citar: /ruta#anchor]. Usa ESA URL exacta sin modificar.
2. Integra 2-3 enlaces en el flujo natural de tu respuesta.
3. OBLIGATORIO enlazar al glosario cuando menciones por primera vez un término técnico (IBR, GFM, UFLS, Tap-Lag, SCR, RoCoF, OLTC, HVDC, EAS) si el contexto contiene su URL.
4. OBLIGATORIO enlazar al capítulo o anexo que amplíe tu argumento principal.

CIERRE:
Termina con UNA frase que formule la pregunta técnica de continuación más natural, o con la implicación más importante del argumento. Sin rodeos de despedida.

CONTEXTO RECUPERADO DEL TFG:
${context}

PREGUNTA:
${question}

RESPUESTA:`;

    const systemPrompt = `Eres el asistente pericial del TFG "Análisis Forense del Apagón Ibérico del 28-A".

IDENTIDAD: Respondes como un ingeniero eléctrico forense que ha analizado los informes clave (Gobierno/REE, ICAI/AELEC, ENTSO-E, NREL). Tu voz es técnica, precisa y directa.

FUENTES: Respondes ÚNICAMENTE con información del CONTEXTO proporcionado. Si el contexto no cubre la pregunta, di: "Este aspecto no está cubierto en el TFG."

ESTILO:
- No uses LaTeX ni notación matemática.
- Usa unidades con rigor (MW, MVAr, Hz, kV, s, Hz/s, p.u.).
- Si el panel derecho muestra un recurso visual, refiérelo de forma natural en tu explicación.

CIFRAS MAESTRAS VERIFICADAS (úsalas si el contexto no especifica):
- Inicio cascada: 12:32:56.993 CEST
- Nadir frecuencial: 47,79 Hz
- RoCoF máximo: ~1,5 Hz/s (ventana 100 ms)
- Pérdida de generación en cascada: ~15.000 MW en <30 s
- H_eq ibérico ponderado: 2,21–2,71 s (zonal sur: 1,3 s)
- Separación Francia: 12:33:21,535 CEST
- Cero de tensión: 12:33:29,741 CEST
- Suministro total desconectado: ~25.200 MW (ES) + ~5.800 MW (PT)
- Personas afectadas: ~57 millones
- Reposición 99%: ~18,5 horas
- Coste Operación Reforzada: >666 M€ (primeros 10 meses, estimación REE feb-2026)`;

    let llmResult;
    try {
      llmResult = await callLLM({ prompt, systemPrompt, temperature: 0.18, maxTokens: 1200 });
    } catch (llmError) {
      console.error('[api/chat] Error del proveedor de LLM:', llmError?.message);

      return res.status(llmError?.status || 502).json({
        answer: 'El RAG ha recuperado contexto del TFG, pero el proveedor LLM no está disponible ahora mismo.',
        error: llmError?.message || 'Error del LLM',
        sources: typeof sources !== 'undefined' ? sources : [],
        confidence: typeof confidence !== 'undefined' ? confidence : 'sin_evidencia',
        confidence_reason: typeof confidence_reason !== 'undefined' ? confidence_reason : '',
        relatedChapters: typeof relatedChapters !== 'undefined' ? relatedChapters : [],
        suggestedFigures: [],
        visualArtifacts: typeof visualArtifacts !== 'undefined' ? visualArtifacts : [],
        followUps: typeof followUps !== 'undefined' ? followUps : [],
        intent: typeof intent !== 'undefined' ? intent : 'general',
      });
    }

    const provider = llmResult?.provider || 'unknown';
    const model = llmResult?.model || 'unknown';
    const finalAnswer = llmResult?.text || 'No answer provided by LLM.';

    return res.status(200).json({
      answer: finalAnswer, provider, model, sources, confidence, confidence_reason,
      relatedChapters, suggestedFigures: [], visualArtifacts, followUps, intent
    });

  } catch (error) {
    return errResponse(500, 'Error interno del servidor.', error.message, intent);
  }
}
```

---

### 2. api/figure-context.js
Ruta del archivo: `api/figure-context.js`

```javascript
// api/figure-context.js
// Genera el párrafo contextual "¿Por qué esto es relevante?" para el panel derecho del chatbot

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST únicamente' });

  const {
    question,
    answer,
    caption,
    figureTitle,
    figureId,
    figureDescription, // Descripción técnica ampliada de la figura
    keyElements,       // Array de elementos visuales concretos
  } = req.body;

  if (!question || !answer || !caption) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  const elementsBlock = keyElements && keyElements.length > 0
    ? `\nELEMENTOS VISUALES CONCRETOS EN ESTA FIGURA:\n${keyElements.map((e, i) => `${i + 1}. ${e}`).join('\n')}`
    : '';

  const descBlock = figureDescription
    ? `\nDescripción técnica ampliada: "${figureDescription.substring(0, 280)}"`
    : '';

  const prompt = `Eres el asistente pericial del TFG sobre el apagón ibérico del 28-A.

TAREA: Escribe UN párrafo de 40-60 palabras que explique al usuario
QUÉ debe buscar en esta figura y QUÉ elemento concreto confirma el fenómeno descrito.

DATOS:
- Pregunta del usuario: "${question}"
- Respuesta del asistente (extracto): "${answer.substring(0, 600)}"
- Título de la figura: "${figureTitle || caption}"
- Descripción técnica: "${caption.substring(0, 220)}"${descBlock}${elementsBlock}

REGLAS ABSOLUTAS:
1. Empieza con UNA de estas frases (elige la más adecuada):
   "Fíjate en..." / "Observa cómo..." / "El dato clave aquí es..." /
   "Busca en esta figura..." / "Esta evidencia muestra directamente..."
2. Si hay ELEMENTOS VISUALES CONCRETOS, menciona uno específico por nombre.
3. Conecta ese elemento con un concepto de la respuesta del asistente.
4. PROHIBIDO: descripciones genéricas ("esta figura muestra", "en la imagen se ve").
5. Máximo 60 palabras. Solo el párrafo. Sin comillas ni encabezados.

Ejemplo perfecto (52 palabras):
"Fíjate en el instante 12:33:21 CEST: la curva de frecuencia cae en picado
mientras la tensión lleva ya 24 segundos por encima de 1,10 p.u.
Ese desfase temporal es la prueba forense de que el colapso fue capacitivo,
no inercial — la tensión falló antes que la frecuencia."

Escribe el párrafo ahora:`;

  const providers = [
    {
      key: 'GROQ_API_KEY',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.3-70b-versatile',
    },
    {
      key: 'DEEPSEEK_API_KEY',
      url: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
    },
  ];

  for (const provider of providers) {
    const apiKey = process.env[provider.key];
    if (!apiKey) continue;

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: 'system',
              content: 'Eres un comunicador técnico de sistemas eléctricos de potencia. Respuestas ultra-concisas, máximo 60 palabras. Sin introducciones.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.12,
          max_tokens: 150,
          ...(provider.key === 'DEEPSEEK_API_KEY' ? { stream: false } : {}),
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);
      if (!response.ok) continue;

      const data = await response.json();
      const context = data.choices?.[0]?.message?.content?.trim();
      if (context && context.length > 20) {
        return res.status(200).json({ context });
      }
    } catch {
      continue;
    }
  }

  // Fallback si fallan las llamadas a las APIs
  const fallbackText = figureDescription
    ? (figureDescription.length > 180 ? figureDescription.substring(0, 177) + '...' : figureDescription)
    : (caption.length > 180 ? caption.substring(0, 177) + '...' : caption);

  return res.status(200).json({ context: fallbackText, fallback: true });
}
```

---

### 3. src/components/ChatWidget.jsx
Ruta del archivo: `src/components/ChatWidget.jsx`

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ChatFullscreen, { preloadAllSimulators } from './ChatFullscreen';

const UI_STRINGS = {
  greeting: '¡Hola! Soy el asistente del TFG sobre el apagón del 28-A. Pregúntame cualquier duda sobre el contenido del sitio.',
  header: 'Asistente del TFG – Apagón 28A',
  placeholder: 'Ej: ¿Cuál fue el papel de la inercia?',
  searching: 'Buscando en el TFG...',
  generating: 'Generando respuesta...',
  synthesizing: 'Elaborando respuesta...',
  errorConnection: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.',
  ariaOpen: 'Abrir chat con IA',
  ariaClose: 'Cerrar chat con IA',
  title: 'Pregunta al TFG',
  simplify: 'SIMPLIFICAR',
};

export default function ChatWidget() {
  const t = UI_STRINGS;

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t.greeting },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const [fullscreen, setFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const parseChatResponse = async (res) => {
    const raw = await res.text();
    try {
      return JSON.parse(raw);
    } catch {
      return {
        answer: raw
          ? `La API respondió con formato no JSON. Status ${res.status}. Inicio: ${raw.slice(0, 180)}`
          : `La API respondió sin cuerpo. Status ${res.status}.`
      };
    }
  };

  const makeAssistantMessage = (data, fallbackText = 'Error al obtener respuesta.') => ({
    role: 'assistant',
    text: data.answer || data.error || fallbackText,
    sources: data.sources || [],
    suggestedFigures: data.suggestedFigures || [],
    visualArtifacts: data.visualArtifacts || [],
    followUps: data.followUps || [],
    intent: data.intent || 'general',
  });

  const handleSend = async (overrideQuestion) => {
    const q = (typeof overrideQuestion === 'string' ? overrideQuestion : question).trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    if (typeof overrideQuestion !== 'string') setQuestion('');
    setLoading(true);
    setLoadingStage('searching');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, locale: 'es' }),
      });
      setLoadingStage('generating');
      await new Promise(r => setTimeout(r, 400));
      setLoadingStage('synthesizing');
      const data = await parseChatResponse(res);
      setMessages(prev => [
        ...prev,
        makeAssistantMessage(data, `Error del endpoint (${res.status})`),
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: t.errorConnection },
      ]);
    } finally {
      setLoading(false);
      setLoadingStage('idle');
    }
  };

  const handleSimplify = async (originalQuestion) => {
    setLoading(true);
    setLoadingStage('generating');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: originalQuestion, 
          locale: 'es',
          mode: 'simple'
        }),
      });
      const data = await parseChatResponse(res);
      setMessages(prev => [...prev, makeAssistantMessage(data, `Error del endpoint (${res.status})`)]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: t.errorConnection 
      }]);
    } finally {
      setLoading(false);
      setLoadingStage('idle');
    }
  };

  const renderText = (text) => {
    if (!text) return text;
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length <= 1) return parseInline(text);
    return paragraphs.map((p, pIdx) => (
      <span key={pIdx}>
        {pIdx > 0 && <><br/><br/></>}
        {parseInline(p)}
      </span>
    ));
  };

  const parseInline = (text) => {
    const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
    const parts = [];
    let last = 0, match, key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.substring(last, match.index));
      if (match[2]) {
        parts.push(<strong key={key++}>{match[2]}</strong>);
      } else {
        parts.push(
          <a
            key={key++}
            href={match[4]}
            style={{ color: 'var(--ifm-color-primary)', textDecoration: 'underline' }}
          >
            {match[3]}
          </a>
        );
      }
      last = regex.lastIndex;
    }
    if (last < text.length) parts.push(text.substring(last));
    return parts.length ? parts : text;
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? t.ariaClose : t.ariaOpen}
        title={t.title}
        onMouseEnter={() => preloadAllSimulators()}
      >
        {open ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="6" y1="6" x2="22" y2="22"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <span className="chat-fab__ring chat-fab__ring--1" aria-hidden="true"/>
            <span className="chat-fab__ring chat-fab__ring--2" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--1" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--2" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--3" aria-hidden="true"/>
            <svg
              className="chat-fab__icon"
              width="28" height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon
                points="15,4 9,15 14,15 11,26 21,13 15,13"
                fill="var(--fab-spark-color)"
                stroke="var(--fab-spark-stroke)"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="chat-fab__label" aria-hidden="true">PREGUNTAR</span>
          </>
        )}
      </button>

      {/* Estilos del panel */}
      <style>
        {`
          :root,
          html[data-theme='light'] {
            --chat-widget-bg: rgba(255, 252, 245, 0.96);
            --chat-widget-border: rgba(25, 24, 20, 0.16);
            --chat-widget-header: #191814;
            --chat-widget-text: #3C3830;
            --chat-widget-muted: #6B6255;

            --chat-widget-accent: #1F6F78;
            --chat-widget-accent-soft: rgba(31, 111, 120, 0.10);
            --chat-widget-accent-border: rgba(31, 111, 120, 0.36);
            --chat-widget-accent-text: #FFFCF5;

            --chat-widget-shadow: 0 14px 38px rgba(25, 24, 20, 0.14);
            --chat-widget-badge-shadow: 0 8px 24px rgba(25, 24, 20, 0.18);
          }

          html[data-theme='dark'] {
            --chat-widget-bg: rgba(16, 29, 53, 0.96);
            --chat-widget-border: rgba(226, 232, 240, 0.16);
            --chat-widget-header: #F4F7FB;
            --chat-widget-text: #C7D2E3;
            --chat-widget-muted: #91A4BC;

            --chat-widget-accent: #7DCDE3;
            --chat-widget-accent-soft: rgba(125, 205, 227, 0.12);
            --chat-widget-accent-border: rgba(125, 205, 227, 0.42);
            --chat-widget-accent-text: #071326;

            --chat-widget-shadow: 0 16px 44px rgba(0, 0, 0, 0.42);
            --chat-widget-badge-shadow: 0 10px 28px rgba(0, 0, 0, 0.38);
          }
        `}
      </style>
      
      {open && (
        <div style={{
          position: 'fixed', bottom: 160, right: 24, width: 380,
          maxHeight: 520, backgroundColor: 'var(--chat-widget-bg)',
          border: '1px solid var(--chat-widget-border)', borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          zIndex: 9999, boxShadow: 'var(--chat-widget-shadow)', backdropFilter: 'blur(14px)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {/* Cabecera */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--chat-widget-border)',
            fontWeight: 600, color: 'var(--chat-widget-header)', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.header}
            </span>
            <button
              onClick={() => setFullscreen(true)}
              title="Pantalla completa"
              aria-label="Abrir en pantalla completa"
              style={{
                background: 'transparent',
                border: '1px solid var(--chat-widget-accent-border)',
                borderRadius: 7,
                color: 'var(--chat-widget-accent)',
                cursor: 'pointer',
                padding: '3px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transition: 'all 0.2s ease',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
              onMouseEnter={e => {
                preloadAllSimulators();
                e.currentTarget.style.background = 'var(--chat-widget-accent)';
                e.currentTarget.style.color = 'var(--chat-widget-accent-text)';
                e.currentTarget.style.borderColor = 'var(--chat-widget-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--chat-widget-accent)';
                e.currentTarget.style.borderColor = 'var(--chat-widget-accent-border)';
              }}
            >
              EXPANDIR
            </button>
          </div>

          {/* Área de mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxWidth: '85%',
              }}>
                <div style={{
                  backgroundColor: m.role === 'user' ? 'var(--chat-user-msg-bg)' : 'var(--chat-assistant-msg-bg)',
                  color: m.role === 'user' ? 'var(--chat-user-msg-text)' : 'var(--chat-assistant-msg-text)',
                  padding: '10px 14px', borderRadius: 14,
                  fontSize: 14, lineHeight: 1.5,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {renderText(m.text)}
                </div>
                {m.role === 'assistant' && i > 0 && (
                  <button
                    onClick={() => {
                      const userMsg = messages[i - 1];
                      if (userMsg?.role === 'user') {
                        handleSimplify(userMsg.text);
                      }
                    }}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: '1px solid var(--chat-widget-accent-border)',
                      borderRadius: 6,
                      color: 'var(--chat-widget-accent)',
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'var(--chat-widget-accent)';
                      e.target.style.color = 'var(--chat-widget-accent-text)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'none';
                      e.target.style.color = 'var(--chat-widget-accent)';
                    }}
                  >
                    {t.simplify}
                  </button>
                )}
                {m.role === 'assistant' && i === messages.length - 1 && m.followUps && m.followUps.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {m.followUps.map((fu, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => handleSend(fu)}
                        style={{
                          alignSelf: 'flex-start',
                          background: 'rgba(31, 111, 120, 0.05)',
                          border: '1px solid var(--chat-widget-accent-border)',
                          borderRadius: 12,
                          color: 'var(--chat-widget-accent)',
                          fontSize: 12,
                          padding: '6px 12px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          lineHeight: 1.3,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = 'var(--chat-widget-accent)';
                          e.target.style.color = 'var(--chat-widget-accent-text)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'rgba(31, 111, 120, 0.05)';
                          e.target.style.color = 'var(--chat-widget-accent)';
                        }}
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '4px 0' }}>
                {loadingStage === 'searching'
                  ? t.searching
                  : loadingStage === 'synthesizing'
                  ? t.synthesizing
                  : t.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Entrada de texto */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--chat-widget-border)',
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.placeholder}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: '1px solid var(--chat-widget-border)', backgroundColor: 'var(--chat-input-bg)',
                color: 'var(--chat-input-text)', fontSize: 14, outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                padding: '10px 16px', borderRadius: 10,
                backgroundColor: loading || !question.trim() ? 'var(--chat-btn-bg-disabled)' : 'var(--chat-btn-bg)',
                color: 'var(--chat-btn-text)', border: 'none',
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 500, transition: 'background-color 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Invitación flotante a pantalla completa */}
      {open && messages.length >= 3 && !fullscreen && (
        <div
          onClick={() => setFullscreen(true)}
          style={{
            position: 'fixed',
            bottom: 170,
            right: 24,
            backgroundColor: 'var(--chat-widget-accent)',
            color: 'var(--chat-widget-accent-text)',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            zIndex: 10000,
            boxShadow: 'var(--chat-widget-badge-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            userSelect: 'none',
            border: '1px solid var(--chat-widget-accent-border)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--chat-widget-shadow)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--chat-widget-badge-shadow)';
          }}
        >
          EXPANDIR CHAT
        </div>
      )}

      {/* Panel de pantalla completa */}
      <ChatFullscreen
        isOpen={fullscreen}
        onClose={() => setFullscreen(false)}
        messages={messages}
        loading={loading}
        loadingStage={loadingStage}
        onSend={async (q) => {
          setMessages(prev => [...prev, { role: 'user', text: q }]);
          setLoading(true);
          setLoadingStage('searching');
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q, locale: 'es' }),
            });
            setLoadingStage('generating');
            await new Promise(r => setTimeout(r, 400));
            setLoadingStage('synthesizing');
            const data = await parseChatResponse(res);
            setMessages(prev => [...prev, makeAssistantMessage(data, `Error del endpoint (${res.status})`)]);
          } finally {
            setLoading(false);
            setLoadingStage('idle');
          }
        }}
        onSimplify={handleSimplify}
        t={t}
        renderText={renderText}
      />
    </>
  );
}
```

---

### 4. src/components/ChatFullscreen.jsx
Ruta del archivo: `src/components/ChatFullscreen.jsx`

```jsx
import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import { imageGalleryData } from '@site/src/data/imageGalleryData';

async function fetchFigureContext(question, answer, caption, figureTitle, figureId, fig) {
  try {
    const res = await fetch('/api/figure-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        answer,
        caption,
        figureTitle,
        figureId,
        figureDescription: fig.artifact?.whyMatters || fig.artifact?.description || '',
        keyElements: fig.artifact?.keyElements || [],
      }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.context;
  } catch {
    return null;
  }
}

function lazyWithPreload(importFn) {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
}

// Lazy imports de simuladores interactivos (Anexo C)
const FrequencyChart      = lazyWithPreload(() => import('./FrequencyChart'));
const SwingEquationSimulator = lazyWithPreload(() => import('./SwingEquationSimulator'));
const TapLagSequence      = lazyWithPreload(() => import('./TapLagSequence'));
const BlackoutPropagationMap = lazyWithPreload(() => import('./BlackoutPropagationMap'));
const CollapseSismograph  = lazyWithPreload(() => import('./CollapseSismograph'));
const PVCurveSimulator    = lazyWithPreload(() => import('./PVCurveSimulator'));
const ANSI59Cascade       = lazyWithPreload(() => import('./ANSI59Cascade'));
const InterconnectionDashboard = lazyWithPreload(() => import('./InterconnectionDashboard'));
const IberianGridTopology = lazyWithPreload(() => import('./IberianGridTopology'));
const MixGeneracion       = lazyWithPreload(() => import('./MixGeneracion'));
const FinancialWaterfallChart = lazyWithPreload(() => import('./FinancialWaterfallChart'));
const EnergyTransitionStreamgraph = lazyWithPreload(() => import('./EnergyTransitionStreamgraph'));
const AnimatedRestorationMap = lazyWithPreload(() => import('./AnimatedRestorationMap'));
const VerticalTimeline    = lazyWithPreload(() => import('./VerticalTimeline'));
const ThermalAdjustmentCostMatrix = lazyWithPreload(() => import('./ThermalAdjustmentCostMatrix'));
const PhasePlanePlot           = lazyWithPreload(() => import('./PhasePlanePlot'));
const Comparador28A            = lazyWithPreload(() => import('./Comparador28A'));
const RadarVulnerabilidad      = lazyWithPreload(() => import('./RadarVulnerabilidad'));
const StickyCollapse           = lazyWithPreload(() => import('./StickyCollapse'));
const SynchrophasorPlot        = lazyWithPreload(() => import('./SynchrophasorPlot'));
const GridUnavailabilityGauge  = lazyWithPreload(() => import('./GridUnavailabilityGauge'));
const SectorialResilienceChart = lazyWithPreload(() => import('./SectorialResilienceChart'));
const EmissionsVsRenewablesChart = lazyWithPreload(() => import('./EmissionsVsRenewablesChart'));

// Lazy imports de gráficas ENTSO-E
const EntsoeActualGeneration   = lazyWithPreload(() => import('./EntsoeCharts/ActualGenerationChart'));
const EntsoeCostCongestion     = lazyWithPreload(() => import('./EntsoeCharts/CostCongestionChart'));
const EntsoeCrossBorderFlows   = lazyWithPreload(() => import('./EntsoeCharts/CrossBorderFlowsChart'));
const EntsoeCurrentBalancing   = lazyWithPreload(() => import('./EntsoeCharts/CurrentBalancingStateChart'));
const EntsoeEnergyPrices       = lazyWithPreload(() => import('./EntsoeCharts/EnergyPricesChart'));
const EntsoeFallbacks          = lazyWithPreload(() => import('./EntsoeCharts/FallbacksChart'));
const EntsoeForecastTransfer   = lazyWithPreload(() => import('./EntsoeCharts/ForecastTransferChart'));
const EntsoeFrrCapacity        = lazyWithPreload(() => import('./EntsoeCharts/FrrCapacityChart'));
const EntsoeHydroReservoir     = lazyWithPreload(() => import('./EntsoeCharts/HydroReservoirChart'));
const EntsoeImbalance          = lazyWithPreload(() => import('./EntsoeCharts/ImbalanceChart'));
const EntsoeImbalancePrices    = lazyWithPreload(() => import('./EntsoeCharts/ImbalancePricesChart'));
const EntsoeInstalledCapacity  = lazyWithPreload(() => import('./EntsoeCharts/InstalledCapacityChart'));
const EntsoeScheduledExchanges = lazyWithPreload(() => import('./EntsoeCharts/ScheduledCommercialExchangesChart'));
const EntsoeTotalLoad          = lazyWithPreload(() => import('./EntsoeCharts/TotalLoadChart'));

// Mapa de anclas a componentes
const INTERACTIVE_MAP = {
  'swing':           SwingEquationSimulator,
  'tap-lag':         TapLagSequence,
  'tap-lag-sequence': TapLagSequence,
  'frequency':       FrequencyChart,
  'mix-generacion':  MixGeneracion,
  'blackout-map':    BlackoutPropagationMap,
  'blackout3d':      BlackoutPropagationMap,
  'map':             BlackoutPropagationMap,
  'pvcurve':         PVCurveSimulator,
  'pv-curve':        PVCurveSimulator,
  'ufls':            CollapseSismograph,
  'sismograph':      CollapseSismograph,
  'ansi59':          ANSI59Cascade,
  'interconnection': InterconnectionDashboard,
  'topology':        IberianGridTopology,
  'iberian-grid':    IberianGridTopology,
  'waterfall':       FinancialWaterfallChart,
  'streamgraph':     EnergyTransitionStreamgraph,
  'restoration':     AnimatedRestorationMap,
  'timeline':        VerticalTimeline,
  'matrix':          ThermalAdjustmentCostMatrix,
  'phaseplane':          PhasePlanePlot,
  'phase-plane':         PhasePlanePlot,
  'comparador-28a':      Comparador28A,
  'comparador28a':       Comparador28A,
  'radar-vulnerabilidad': RadarVulnerabilidad,
  'radar':               RadarVulnerabilidad,
  'sticky-collapse':     StickyCollapse,
  'phasor':              SynchrophasorPlot,
  'grid-unavailability': GridUnavailabilityGauge,
  'sectorial-resilience': SectorialResilienceChart,
  'emissions-renewables': EmissionsVsRenewablesChart,
};

// Mapa de IDs a gráficas ENTSO-E
const ENTSOE_CHART_MAP = {
  'chart-1':  EntsoeTotalLoad,
  'chart-2':  EntsoeTotalLoad,
  'chart-3':  EntsoeActualGeneration,
  'chart-4':  EntsoeActualGeneration,
  'chart-5':  EntsoeInstalledCapacity,
  'chart-6':  EntsoeActualGeneration,
  'chart-7':  EntsoeHydroReservoir,
  'chart-8':  EntsoeActualGeneration,
  'chart-9':  EntsoeEnergyPrices,
  'chart-10': EntsoeEnergyPrices,
  'chart-11': EntsoeEnergyPrices,
  'chart-12': EntsoeImbalancePrices,
  'chart-13': EntsoeCrossBorderFlows,
  'chart-14': EntsoeCrossBorderFlows,
  'chart-15': EntsoeScheduledExchanges,
  'chart-16': EntsoeScheduledExchanges,
  'chart-17': EntsoeForecastTransfer,
  'chart-18': EntsoeCurrentBalancing,
  'chart-19': EntsoeImbalance,
  'chart-20': EntsoeImbalancePrices,
  'chart-21': EntsoeFrrCapacity,
  'chart-22': EntsoeCostCongestion,
  'chart-23': EntsoeFallbacks,
};

const buildFigureIndex = () => {
  const index = [];
  imageGalleryData.chapters.forEach(ch => {
    ch.images.forEach(img => {
      index.push({
        src: img.src,
        caption: img,
        chapter: ch.id,
      });
    });
  });
  return index;
};
const FIGURE_INDEX = buildFigureIndex();

// Mapeo de palabras clave para buscar figuras relacionadas en el texto
const FIGURE_KEYWORDS = {
  'frecuencia': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'nadir': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'rocof': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'caída de frecuencia': ['frequency_voltage_carmona'],
  'hercios': ['frequency_voltage_carmona'],
  'hz': ['frequency_voltage_carmona'],
  'inercia síncrona': ['futured_grid_evolution', 'conventionalunits'],
  'constante h': ['futured_grid_evolution'],
  'masa rotacional': ['futured_grid_evolution'],
  'tap-lag': ['tap_lag_decoupling', 'nunez_balboa_precursores'],
  'tap lag': ['tap_lag_decoupling'],
  'oltc': ['tap_lag_decoupling'],
  'transformador': ['tap_lag_decoupling'],
  'cascada': ['cascada_desconexiones', 'heatmap_propagation'],
  'cascada de desconexiones': ['cascada_desconexiones'],
  'propagación': ['heatmap_propagation', 'cascada_desconexiones'],
  'colapso de tensión': ['tension_frecuencia_colapso', 'fluctuaciones_tension_previas'],
  'sobretensión': ['precursor_overvoltage_22april', 'aluvion_alertas_sobretension_sur'],
  'potencia reactiva': ['asimetria_balance_reactiva_sur'],
  'mvar': ['asimetria_balance_reactiva_sur'],
  'mix de generación': ['ree_generation_mix_28april', 'mix_comparativo_2010_2024'],
  'fotovoltaica': ['ree_generation_mix_28april'],
  'solar': ['ree_generation_mix_28april'],
  'renovable': ['ree_generation_mix_28april', 'mix_comparativo_2010_2024'],
  'recuperación': ['estrategia_reenergizacion_dual', 'black_start_hidroelectrico'],
  'black start': ['black_start_hidroelectrico'],
  'reposición': ['islas_reposicion_entsoe', 'estrategia_reenergizacion_dual'],
  're-energización': ['evolucion_mix_reenergizacion'],
  'interconexión': ['interconexion_francia_colapso'],
  'francia': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'sincronismo': ['perdida_sincronismo_frontera'],
  'importaciones': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'exportaciones': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'intercambios': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia', 'entsoe_flow_deviation'],
  'flujos': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia', 'entsoe_flow_deviation'],
  'marruecos': ['intercambio_marruecos_topdown'],
  'portugal': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'gfm': ['gfl_vs_gfm_circuit1'],
  'gfl': ['gfl_vs_gfm_circuit1'],
  'inversor': ['gfl_vs_gfm_circuit1'],
  'grid-forming': ['gfl_vs_gfm_circuit1'],
  'coste': ['coste_optimo_ers', 'ers_revenue_stacking'],
  'bess': ['hitachi_hybrid', 'ers_revenue_stacking'],
  'islas': ['islas_reposicion_entsoe'],
  'fragmentación': ['islas_reposicion_entsoe'],
};

function findRelevantFigures(text) {
  const lower = text.toLowerCase();
  const found = new Map();
  
  Object.entries(FIGURE_KEYWORDS).forEach(([keyword, files]) => {
    if (lower.includes(keyword.toLowerCase())) {
      const isExact = keyword.includes(' ');
      files.forEach(f => {
        const current = found.get(f) || 0;
        found.set(f, current + (isExact ? 2 : 1));
      });
    }
  });

  const sorted = [...found.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([filename]) => filename);

  return sorted
    .map(filename => FIGURE_INDEX.find(fig => fig.src.includes(filename)))
    .filter(Boolean);
}

function extractInteractiveAnchors(text) {
  const anchors = new Set();
  const regex = /\]\(([^)]+#([^)]+))\)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const raw = m[2].toLowerCase();
    const anchor = raw.startsWith('grafico-') ? raw.slice(8) : raw;
    if (INTERACTIVE_MAP[anchor]) anchors.add(anchor);
  }
  const lower = text.toLowerCase();
  Object.keys(INTERACTIVE_MAP).forEach(key => {
    if (lower.includes(key.replace(/-/g, ' '))) anchors.add(key);
  });
  return [...anchors].slice(0, 4);
}

// Textos e interfaz en español
const UI = {
  exit: 'Cerrar',
  noContent: 'Haz una pregunta para ver contenido relacionado aquí',
  loading: 'Cargando...',
  interactive: 'Interactivo',
  figure: 'Figura',
  simplify: 'SIMPLIFICAR',
  searching: 'Buscando...',
  generating: 'Generando...',
  synthesizing: 'Elaborando respuesta...',
};

const SUGGESTED_QUESTIONS = {
  swing: [
    '¿Qué RoCoF se registró el 28-A?',
    '¿Cómo afecta la constante H a la caída de frecuencia?',
    '¿Qué es la inercia sintética?'
  ],
  'tap-lag-sequence': [
    '¿Qué es el efecto Tap-Lag?',
    '¿Cómo afectaron los OLTC al colapso?',
    '¿Por qué el SCADA no detectó el problema?'
  ],
  frequency: [
    '¿Cuánto tardó en caer la frecuencia?',
    '¿Qué es el nadir frecuencial?',
    '¿Cuándo se activó el deslastre UFLS?'
  ],
  'mix-generacion': [
    '¿Cuánto solar había el día del apagón?',
    '¿Por qué el mix renovable aumentó el riesgo?',
    '¿Qué es la penetración IBR?'
  ],
  'blackout-map': [
    '¿Qué regiones se vieron más afectadas?',
    '¿Cuántos MW se perdieron en la cascada?',
    '¿En qué orden se desconectaron las centrales?'
  ],
  pvcurve: [
    '¿Qué es el colapso de tensión?',
    '¿Cuál era el margen reactivo antes del apagón?',
    '¿Qué es el punto de nariz de la curva P-V?'
  ],
  interconnection: [
    '¿Cuál es la capacidad de interconexión con Francia?',
    '¿Qué pasó con la interconexión durante el apagón?',
    '¿Por qué España está poco interconectada?'
  ],
};

function VisualArtifactCard({ artifact }) {
  if (artifact.type === 'table') {
    const tableData = artifact.data || [];
    const columns = artifact.columns || [];
    
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: 'var(--cfs-amber)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Tabla Forense</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        {artifact.origin && <div style={{ fontSize: 11, color: 'var(--cfs-text-3)', marginBottom: 8 }}>{artifact.origin}</div>}
        <p style={{ fontSize: 13, color: 'var(--cfs-text-2)', lineHeight: 1.5 }}>{artifact.description}</p>
        
        {tableData.length === 0 ? (
          <a href={artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: 'var(--cfs-amber)', textDecoration: 'none', fontWeight: 600 }}>
            Ver tabla en el anexo ↗
          </a>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, color: 'var(--cfs-text-2)' }}>
              <thead>
                <tr>
                  {columns.map(c => (
                    <th key={c.key} style={{ padding: '6px 10px', textAlign: 'left', borderBottom: '1px solid var(--cfs-amber)', color: 'var(--cfs-amber)', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--cfs-border-soft)', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    {columns.map(c => (
                      <td key={c.key} style={{ padding: '6px 10px', fontSize: 11, lineHeight: 1.4 }}>
                        {row[c.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
  if (artifact.type === 'image') {
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: 'var(--accent-electric, hsl(200 100% 60%))', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Gráfica de Datos Reales</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        <div style={{ marginTop: 8 }}>
          <img src={artifact.path || artifact.url} alt={artifact.title} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--cfs-border-soft)' }} loading="lazy" />
          {artifact.description && (
            <p style={{ fontSize: 11, color: 'var(--cfs-text-2)', marginTop: 6, lineHeight: 1.5 }}>
              {artifact.description}
            </p>
          )}
        </div>
      </div>
    );
  }
  if (artifact.type === 'interactive') {
    const Component = INTERACTIVE_MAP[artifact.id];
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Interactivo</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        <p style={{ fontSize: 13, color: 'var(--cfs-text-2)', lineHeight: 1.5, marginBottom: 12 }}>{artifact.description}</p>
        
        {!Component ? (
          <a href={artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
            Abrir simulador ↗
          </a>
        ) : (
          <Suspense fallback={<div style={{ padding: 20, color: 'var(--cfs-text-2)' }}>⟳ Cargando interactivo...</div>}>
            <Component />
          </Suspense>
        )}
      </div>
    );
  }
  return null;
}

export default function ChatFullscreen({
  isOpen,
  onClose,
  messages,
  loading,
  loadingStage,
  onSend,
  onSimplify,
  t,
  renderText,
}) {
  const ui = UI;

  const [activeAnchors, setActiveAnchors]   = useState([]);
  const [activeFigures, setActiveFigures]   = useState([]);
  const [activeTables, setActiveTables]     = useState([]);
  const [activeTab, setActiveTab]           = useState(null);
  const [figureContexts, setFigureContexts] = useState({});
  const [figureFeedback, setFigureFeedback] = useState({});
  const [panelKey, setPanelKey]             = useState(0);
  const [panelVisible, setPanelVisible]     = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [chatWidth, setChatWidth] = useState(360);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(360);
  const [question, setQuestion]             = useState('');
  const messagesEndRef                      = useRef(null);
  const inputRef                            = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setQuestion(transcript);
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  useEffect(() => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) return;

    const backendArtifacts = last.visualArtifacts || [];
    const backendTables = backendArtifacts.filter(a => a.type === 'table');
    setActiveTables(backendTables);

    const backendInteractives = backendArtifacts
      .filter(a => a.type === 'interactive' && INTERACTIVE_MAP[a.id])
      .map(a => a.id);
    const textAnchors = backendInteractives.length > 0 ? backendInteractives : extractInteractiveAnchors(last.text);

    const backendFigures = backendArtifacts
      .filter(a => a.type === 'image' || a.type === 'entsoe_chart')
      .map(a => {
        const filename = (a.path || a.id || '').split('/').pop().replace(/\.\w+$/, '');
        const found = FIGURE_INDEX.find(f => f.src.includes(filename) || f.src.includes(a.id));
        if (!found && a.type === 'entsoe_chart') {
          return {
            src: a.url || '',
            caption: {
              caption_es: a.description || a.title,
            },
            chapter: 'entsoe',
            artifact: a,
            tabLabel: '★ ' + (a.title || 'Gráfica ENTSO-E').substring(0, 30),
          };
        }
        return found || null;
      })
      .filter(Boolean);
    const textFigures = backendFigures.length > 0 ? backendFigures : findRelevantFigures(last.text);

    setActiveAnchors(textAnchors);
    setActiveFigures(textFigures);

    const newTab = textAnchors.length > 0
      ? 'interactive-0'
      : textFigures.length > 0 ? 'figure-0'
      : backendTables.length > 0 ? 'table-0'
      : null;

    if (newTab !== activeTab) {
      setPanelVisible(false);
      setTimeout(() => {
        setActiveTab(newTab);
        setPanelKey(k => k + 1);
        setPanelVisible(true);
      }, 180);
    }
  }, [messages]);

  useEffect(() => {
    if (!activeTab || !activeTab.startsWith('figure-')) return;
    const idx = parseInt(activeTab.split('-')[1]);
    const fig = activeFigures[idx];
    if (!fig) return;

    const userMsgs = messages.filter(m => m.role === 'user');
    const questionMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : '';
    const asstMsgs = messages.filter(m => m.role === 'assistant');
    const answerMsg = asstMsgs.length > 0 ? asstMsgs[asstMsgs.length - 1].text : '';

    const figureId = fig.src;
    let qHash = 0;
    for (let i = 0; i < questionMsg.length; i++) qHash = Math.imul(31, qHash) + questionMsg.charCodeAt(i) | 0;
    const cacheKey = `fig_ctx_${qHash}_${figureId}`;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setFigureContexts(prev => ({ ...prev, [activeTab]: cached }));
        return;
      }
    } catch(e) {}

    const caption = fig.caption.caption_es || '';
    const figureTitle = fig.caption.caption_es || caption;

    setFigureContexts(prev => ({ ...prev, [activeTab]: 'loading' }));
    
    fetchFigureContext(questionMsg, answerMsg, caption, figureTitle, figureId, fig).then(ctx => {
      if (ctx) {
        setFigureContexts(prev => ({ ...prev, [activeTab]: ctx }));
        try { localStorage.setItem(cacheKey, ctx); } catch(e) {}
      } else {
        setFigureContexts(prev => ({ ...prev, [activeTab]: 'error' }));
      }
    });
  }, [activeTab, activeFigures, messages]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleDragStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    const newWidth = Math.min(Math.max(dragStartWidth.current + delta, 260), 640);
    setChatWidth(newWidth);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const allTabs = [
    ...activeAnchors.map((anchor, i) => ({
      id: 'interactive-' + i,
      label: anchor.replace(/-/g, ' '),
      type: 'interactive',
    })),
    ...activeFigures.map((fig, i) => {
      let label = fig.tabLabel;
      if (!label) {
        const caption = fig.caption.caption_es || '';
        label = caption.length > 37 ? caption.substring(0, 37) + '...' : caption;
      }
      return {
        id: 'figure-' + i,
        label: label || fig.src.split('/').pop().replace(/\.\w+$/, '').replace(/_/g,' '),
        type: fig.artifact?.type === 'entsoe_chart' ? 'entsoe' : 'figure',
      };
    }),
    ...activeTables.map((table, i) => ({
      id: 'table-' + i,
      label: table.title ? (table.title.substring(0, 37) + (table.title.length > 37 ? '...' : '')) : 'Tabla',
      type: 'table',
    })),
  ];

  // Atajos de teclado
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isListening) {
        onClose();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        if (allTabs.length > 1) {
          const currentIdx = allTabs.findIndex(t => t.id === activeTab);
          const nextIdx = (currentIdx + 1) % allTabs.length;
          setPanelVisible(false);
          setTimeout(() => {
            setActiveTab(allTabs[nextIdx].id);
            setPanelKey(k => k + 1);
            setPanelVisible(true);
          }, 180);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (allTabs.length > 1) {
          const currentIdx = allTabs.findIndex(t => t.id === activeTab);
          const prevIdx = (currentIdx - 1 + allTabs.length) % allTabs.length;
          setPanelVisible(false);
          setTimeout(() => {
            setActiveTab(allTabs[prevIdx].id);
            setPanelKey(k => k + 1);
            setPanelVisible(true);
          }, 180);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setPresentationMode(p => !p);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isListening) stopListening();
        else startListening();
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isListening, allTabs, activeTab, onClose, startListening, stopListening]);

  const handleSend = () => {
    if (!question.trim() || loading) return;
    onSend(question);
    setQuestion('');
  };

  if (!isOpen) return null;

  const renderPanelContent = () => {
    if (activeTab === null) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: 'var(--cfs-text-3)', textAlign: 'center' }}>
          <svg width="52" height="52" viewBox="0 0 28 28" fill="none" opacity="0.25">
            <polygon points="15,4 9,15 14,15 11,26 21,13 15,13" fill="currentColor"/>
          </svg>
          <p style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.7 }}>{ui.noContent}</p>
        </div>
      );
    }

    if (activeTab.startsWith('interactive-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const anchor = activeAnchors[idx];
      const Component = INTERACTIVE_MAP[anchor];
      if (!Component) return null;
      
      const interactiveLabels = {
        swing: 'La Ecuación del Swing es el modelo matemático fundamental que gobierna la dinámica de frecuencia. Permite cuantificar cómo la constante de inercia H (en segundos) determina la velocidad de caída de frecuencia ante un desequilibrio de potencia. El 28-A, con H≈2,3s y 82% de penetración IBR, el RoCoF superó 1,5 Hz/s — valor letal para las protecciones de las centrales nucleares.',
        'tap-lag-sequence': 'El mecanismo Tap-Lag fue el factor causal invisible del 28-A. Los transformadores OLTC de los parques solares, al regular automáticamente la tensión, absorbían potencia reactiva capacitiva masiva (≈1.050 MVAr en el sur) mientras el SCADA de REE mostraba tensiones aparentemente normales. Esta "ilusión de estabilidad" enmascaró el colapso Q-V que se gestaba.',
        frequency: 'La caída de frecuencia del 28-A se produjo en 27 segundos: de 50 Hz a 0 Hz. El nadir frecuencial alcanzó 47,79 Hz antes del disparo de las nucleares. El RoCoF medio durante la cascada superó 1,0 Hz/s, activando los 6 escalones de deslastre UFLS entre 12:33:20 y 12:33:22 CEST. La separación de la interconexión con Francia a las 12:33:21,535 CEST fue el punto de no retorno.',
        'mix-generacion': 'A las 12:30 CEST del 28-A, la solar fotovoltaica aportaba el 53-59% del mix peninsular (18.068 MW estimados). Esta penetración récord de IBR redujo la inercia síncrona del sistema al mínimo histórico. La demanda era de tan solo 25.184 MW — un 56% del pico histórico — creando un sistema eléctricamente "vacío" y extremadamente frágil ante cualquier perturbación.',
        'blackout-map': 'La cascada de desconexiones IBR se produjo en menos de 650 ms. Entre 12:32:57 y 12:33:24 CEST se perdieron 1.917 MW directos en una secuencia de 8 eventos, con pérdidas totales estimadas de 2.000-2.500 MW. La propagación geográfica siguió el gradiente de penetración solar: sur de España primero, luego Extremadura y Levante, finalmente la separación de Francia.',
        pvcurve: 'La curva P-V demuestra el mecanismo físico del colapso de tensión capacitivo que causó el 28-A. El sistema ibérico, operando con 1.050 MVAr de inyección capacitiva neta en el sur, se encontraba cerca del "punto de nariz" de la curva — el límite de cargabilidad máxima. Cualquier perturbación adicional en la potencia reactiva era suficiente para cruzar ese umbral y desencadenar el colapso.',
        sismograph: 'El sismógrafo del colapso reproduce la evolución transitoria de frecuencia y tensión en Carmona (400 kV) durante los 27 segundos críticos. Los datos muestran la correlación exacta entre la cascada de desconexiones IBR, la activación secuencial de los 6 escalones UFLS y el disparo final de las centrales nucleares a 47,79 Hz.',
        ansi59: 'El bucle de retroalimentación ANSI 59 explica por qué las desconexiones IBR se aceleraron en cascada. Cada IBR que disparaba por sobretensión liberaba potencia reactiva capacitiva al sistema, elevando aún más la tensión y provocando nuevos disparos. Este mecanismo de retroalimentación positiva convirtió una perturbación local en el sur en un colapso sistémico peninsular.',
        interconnection: 'Las interconexiones internacionales revelan la paradoja estructural del sistema ibérico: diseñadas para importar energía en déficit, resultaron insuficientes durante el 28-A. La capacidad de interconexión con Francia (2.800 MW nominales) representaba solo el 3,7% de la potencia instalada peninsular — muy por debajo del mínimo del 10% recomendado por la CE. La apertura de Hernani a las 12:33:21 CEST selló el aislamiento total.',
        topology: 'La topología de red ibérica muestra la distribución geográfica desigual entre generación (concentrada en el sur y el litoral) y demanda (centros urbanos del norte y centro). Esta asimetría estructural, combinada con la alta penetración solar en Extremadura y Andalucía, creó los flujos de potencia reactiva críticos que precipitaron el colapso.',
        waterfall: 'La cascada financiera cuantifica el coste real del apagón frente al coste de haberlo prevenido. Las estimaciones sitúan el impacto económico directo en 1.600-2.200 M€, mientras que el CAPEX total del retrofitting regulatorio (GFM, compensadores síncronos, BESS) se estima en 800-1.200 M€. La inacción fue 1,5-2x más cara que la inversión preventiva.',
        streamgraph: 'El streamgraph de transición energética muestra cómo España pasó en 15 años de un sistema dominado por generación síncrona (nuclear, gas, carbón) a un mix con 82% de penetración IBR. Esta transformación estructural es el contexto macroenergético que hizo posible el 28-A: sin esa transición, el sistema habría tenido suficiente inercia síncrona para absorber la perturbación.',
        restoration: 'La re-energización del sistema ibérico tardó 18,5 horas — un proceso técnicamente complejo que requirió la coordinación de estrategias Top-Down (soporte desde Francia y Marruecos) y Bottom-Up (arranque autónomo de centrales hidroeléctricas bajo el P.O. 1.6). La restricción de reconexión de IBRs durante las primeras horas fue determinante para garantizar la estabilidad de las islas eléctricas nacientes.',
        timeline: 'La cronología forense del 28-A documenta 47 eventos críticos en 18,5 horas. Los primeros 27 segundos (12:32:57 - 12:33:24 CEST) contienen los 8 disparos IBR en cascada, los 6 escalones UFLS, el disparo nuclear y el colapso total. Esta densidad de eventos en tiempo tan breve es inédita en la historia de los sistemas eléctricos europeos.',
        matrix: 'La matriz de costes de inacción compara el OPEX acumulado por no invertir en resiliencia frente al CAPEX del retrofitting regulatorio. Cada año de retraso en la implementación de GFM, compensadores síncronos y BESS añade aproximadamente 180-220 M€ en riesgo económico sistémico. El 28-A demostró empíricamente que el coste de la inacción supera ampliamente al de la prevención.',
      };
      
      const label = interactiveLabels[anchor] || '';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {label && (
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--cfs-border-soft)', backgroundColor: 'hsla(190,100%,60%,0.04)', flexShrink: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-electric, hsl(190 100% 60%))', marginBottom: 5, textTransform: 'uppercase' }}>
                ◈ SIMULADOR INTERACTIVO
              </div>
              <p style={{ fontSize: 13, color: 'var(--cfs-text-1)', lineHeight: 1.6, margin: 0 }}>{label}</p>
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <ColorModeProvider>
              <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: 'var(--cfs-text-2)' }}>⟳ {ui.loading}</div>}>
                <Component />
              </Suspense>
            </ColorModeProvider>
          </div>
        </div>
      );
    }

    if (activeTab.startsWith('figure-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const fig = activeFigures[idx];
      if (!fig) return null;
      const caption = fig.caption.caption_es || '';
      
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const questionMsg = lastUserMsg ? lastUserMsg.text : '';
      let qHash = 0;
      for (let i = 0; i < questionMsg.length; i++) qHash = Math.imul(31, qHash) + questionMsg.charCodeAt(i) | 0;
      const figureId = fig.src;
      const feedbackKey = `feedback_figure_${figureId}_${qHash}`;

      const handleFeedback = (isPositive) => {
        try { localStorage.setItem(feedbackKey, isPositive ? 'yes' : 'no'); } catch(e) {}
        setFigureFeedback(prev => ({ ...prev, [feedbackKey]: isPositive }));
      };
      
      let voted = null;
      try {
        const cached = localStorage.getItem(feedbackKey);
        if (cached === 'yes') voted = true;
        else if (cached === 'no') voted = false;
      } catch(e) {}
      if (figureFeedback[feedbackKey] !== undefined) voted = figureFeedback[feedbackKey];
      
      return (
        <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
          <div style={{ marginBottom: 20, padding: '14px 16px', borderLeft: '3px solid var(--accent-electric, hsl(190 100% 60%))', backgroundColor: 'hsla(190,100%,60%,0.05)', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-electric, hsl(190 100% 60%))', marginBottom: 6, textTransform: 'uppercase' }}>
              ◈ POR QUÉ ESTO ES RELEVANTE
            </div>
            <p style={{ fontSize: 13, color: 'var(--cfs-text-1)', lineHeight: 1.7, margin: 0 }}>
              {figureContexts[activeTab] === 'loading' ? (
                <span style={{ opacity: 0.6 }}>⟳ {ui.loading}</span>
              ) : figureContexts[activeTab] === 'error' || !figureContexts[activeTab] ? (
                fig.artifact?.whyMatters || caption
              ) : (
                figureContexts[activeTab]
              )}
            </p>
            {figureContexts[activeTab] && figureContexts[activeTab] !== 'loading' && figureContexts[activeTab] !== 'error' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => handleFeedback(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: voted === true ? 1 : 0.5 }} title="Explicación útil">👍</button>
                <button onClick={() => handleFeedback(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: voted === false ? 1 : 0.5 }} title="Explicación poco útil">👎</button>
              </div>
            )}
          </div>

          {fig.artifact?.type === 'entsoe_chart' ? (() => {
            const chartId = fig.artifact?.id;
            const ChartComponent = ENTSOE_CHART_MAP[chartId];
            if (ChartComponent) {
              return (
                <div style={{ marginTop: 16, overflow: 'hidden', borderRadius: 10, border: '1px solid var(--cfs-border-soft)' }}>
                  <div style={{ fontSize: 11, color: 'var(--cfs-text-2)', padding: '10px 16px', borderBottom: '1px solid var(--cfs-border-soft)', backgroundColor: 'hsla(220,40%,6%,0.4)', lineHeight: 1.6 }}>
                    Gráfica construida con datos reales extraídos de las APIs de ESIOS, ENTSO-E y OMIE el 28 de abril de 2025.
                  </div>
                  <div style={{ padding: '16px' }}>
                    <Suspense fallback={<div style={{ textAlign: 'center', padding: 40, color: 'var(--cfs-text-2)' }}>⟳ Cargando gráfica...</div>}>
                      <ChartComponent />
                    </Suspense>
                  </div>
                </div>
              );
            }
            return (
              <div style={{ marginTop: 16, padding: '20px 24px', border: '1px solid var(--cfs-border-soft)', borderRadius: 10, textAlign: 'center', backgroundColor: 'hsla(220,40%,6%,0.6)' }}>
                <div style={{ fontSize: 11, color: 'var(--cfs-text-2)', marginBottom: 12, lineHeight: 1.6 }}>
                  Gráfica construida con datos reales extraídos de las APIs de ESIOS, ENTSO-E y OMIE el 28 de abril de 2025.
                </div>
                <a href={fig.artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, backgroundColor: 'var(--cfs-accent)', color: 'var(--cfs-accent-text)', textDecoration: 'none', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em' }}>
                  VER GRÁFICA COMPLETA ↗
                </a>
              </div>
            );
          })() : (
            <img src={fig.src} alt={caption} style={{ width: '100%', maxWidth: 860, borderRadius: 8, border: '1px solid var(--cfs-border-soft)', display: 'block', margin: '0 auto', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }} />
          )}

          {caption && figureContexts[activeTab] !== caption && (
            <p style={{ marginTop: 12, fontSize: 11, color: 'var(--cfs-text-3)', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.5, padding: '0 16px' }}>
              {caption}
            </p>
          )}
        </div>
      );
    }

    if (activeTab.startsWith('table-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const table = activeTables[idx];
      if (!table) return null;
      return (
        <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
          <div style={{ marginBottom: 16, padding: '14px 16px', borderLeft: '3px solid var(--cfs-amber)', backgroundColor: 'hsla(38,100%,56%,0.05)', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--cfs-amber)', marginBottom: 6, textTransform: 'uppercase' }}>◈ TABLA FORENSE</div>
            <p style={{ fontSize: 13, color: 'var(--cfs-text-1)', lineHeight: 1.7, margin: 0 }}>{table.description || table.title}</p>
            {table.origin && <div style={{ fontSize: 11, color: 'var(--cfs-text-3)', marginTop: 6 }}>Fuente: {table.origin}</div>}
          </div>
          {table.sampleRows && table.columns && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {table.columns.map(col => (
                      <th key={col.key} style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--cfs-amber)', color: 'var(--cfs-amber)', fontWeight: 700, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.sampleRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--cfs-border-soft)', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                      {table.columns.map(col => (
                        <td key={col.key} style={{ padding: '7px 12px', fontSize: 12, lineHeight: 1.4 }}>
                          {row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {table.url && (
            <a href={table.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, fontSize: 12, color: 'var(--cfs-amber)', textDecoration: 'none', fontWeight: 600 }}>
              Ver tabla completa ↗
            </a>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'var(--cfs-accent-text)', display: 'flex', flexDirection: 'column', animation: 'fadeInUp 0.2s ease' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', borderBottom: '1px solid var(--cfs-border-soft)', backgroundColor: 'var(--cfs-bg)', flexShrink: 0, minHeight: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <polygon points="15,4 9,15 14,15 11,26 21,13 15,13" fill="var(--accent-electric, hsl(190 100% 60%))" strokeWidth="0.6" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '0.06em', color: 'var(--cfs-text-1)', textTransform: 'uppercase' }}>
            {t.header}
          </span>
          <span style={{ fontSize: 9, color: 'var(--cfs-text-3)', letterSpacing: '0.06em', display: 'flex', gap: 8, alignItems: 'center', marginLeft: 12 }}>
            <span style={{ border: '1px solid var(--cfs-border)', borderRadius: 4, padding: '1px 5px' }}>ESC</span>
            <span style={{ border: '1px solid var(--cfs-border)', borderRadius: 4, padding: '1px 5px' }}>Ctrl+M</span>
            <span style={{ border: '1px solid var(--cfs-border)', borderRadius: 4, padding: '1px 5px' }}>Ctrl+P</span>
            <span style={{ border: '1px solid var(--cfs-border)', borderRadius: 4, padding: '1px 5px' }}>Ctrl+→</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setPresentationMode(p => !p)}
            title={presentationMode ? 'Mostrar chat' : 'Modo presentación'}
            style={{ background: presentationMode ? 'var(--cfs-accent)' : 'none', border: '1px solid var(--cfs-accent)', borderRadius: 8, color: presentationMode ? 'var(--cfs-accent-text)' : 'var(--cfs-accent)', cursor: 'pointer', padding: '5px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', transition: 'all 0.2s ease', marginRight: 8 }}
            onMouseEnter={e => { if (!presentationMode) { e.currentTarget.style.background = 'var(--cfs-accent)'; e.currentTarget.style.color = 'var(--cfs-accent-text)'; } }}
            onMouseLeave={e => { if (!presentationMode) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--cfs-accent)'; } }}
          >
            {presentationMode ? 'CHAT' : 'PRESENTAR'}
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '1px solid var(--cfs-accent)', borderRadius: 8, color: 'var(--cfs-accent)', cursor: 'pointer', padding: '5px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', transition: 'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--cfs-accent)'; e.currentTarget.style.color = 'var(--cfs-accent-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--cfs-accent)'; }}
          >
            CERRAR ×
          </button>
        </div>
      </div>

      {/* REJILLA PRINCIPAL */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: presentationMode ? '0px 1fr' : `${chatWidth}px 8px 1fr`, transition: 'grid-template-columns 0.3s ease', overflow: 'hidden', minHeight: 0 }}>
        {/* PANEL DEL CHAT (IZQUIERDA) */}
        <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--cfs-border-soft)', overflow: 'hidden', opacity: presentationMode ? 0 : 1, transition: 'opacity 0.3s ease', pointerEvents: presentationMode ? 'none' : 'auto', backgroundColor: 'var(--cfs-bg)' }}>
          {/* Mensajes */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '92%' }}>
                <div style={{ backgroundColor: m.role === 'user' ? 'var(--cfs-user-msg-bg)' : 'var(--cfs-bot-msg-bg)', color: m.role === 'user' ? 'var(--cfs-user-msg-text)' : 'var(--cfs-bot-msg-text)', padding: '10px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {renderText(m.text)}
                </div>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {i > 0 && (
                      <button
                        onClick={() => { const prev = messages[i - 1]; if (prev?.role === 'user') onSimplify(prev.text); }}
                        style={{ background: 'none', border: '1px solid var(--cfs-border)', borderRadius: 8, color: 'var(--cfs-text-3)', fontSize: 11, padding: '3px 8px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                        onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-electric)'; e.target.style.color = 'var(--accent-electric)'; }}
                        onMouseLeave={e => { e.target.style.borderColor = 'var(--cfs-border)'; e.target.style.color = 'var(--cfs-text-3)'; }}
                      >
                        {ui.simplify}
                      </button>
                    )}
                    {(() => {
                      const lastAssistantIndex = [...messages].reverse().findIndex(msg => msg.role === 'assistant');
                      const actualLastAssistantIndex = lastAssistantIndex >= 0 ? messages.length - 1 - lastAssistantIndex : -1;
                      const isLastAssistant = i === actualLastAssistantIndex;
                      
                      if (isLastAssistant) return null;
                      
                      const anchors = extractInteractiveAnchors(m.text);
                      const figures = findRelevantFigures(m.text);
                      if (anchors.length === 0 && figures.length === 0) return null;

                      return (
                        <button
                          onClick={() => {
                            setActiveAnchors(anchors);
                            setActiveFigures(figures);
                            const newTab = anchors.length > 0 ? 'interactive-0' : 'figure-0';
                            setPanelVisible(false);
                            setTimeout(() => {
                              setActiveTab(newTab);
                              setPanelKey(k => k + 1);
                              setPanelVisible(true);
                            }, 180);
                          }}
                          style={{ background: 'none', border: '1px solid var(--cfs-border)', borderRadius: 8, color: 'var(--cfs-text-3)', fontSize: 11, padding: '3px 8px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-electric)'; e.target.style.color = 'var(--accent-electric)'; }}
                          onMouseLeave={e => { e.target.style.borderColor = 'var(--cfs-border)'; e.target.style.color = 'var(--cfs-text-3)'; }}
                        >
                          VER GRÁFICAS ASOCIADAS
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ color: 'var(--cfs-text-3)', fontSize: 12, fontStyle: 'italic' }}>
                {loadingStage === 'searching' ? ui.searching : loadingStage === 'synthesizing' ? ui.synthesizing : ui.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Escuchando voz */}
          {isListening && (
            <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--cfs-accent)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', borderTop: '1px solid var(--cfs-border-soft)', animation: 'fadeInUp 0.2s ease' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--cfs-accent)', flexShrink: 0 }}/>
              ESCUCHANDO...
            </div>
          )}

          {/* Sugerencias contextuales */}
          {(() => {
            if (activeAnchors.length === 0) return null;
            const anchor = activeAnchors[0];
            const suggestions = SUGGESTED_QUESTIONS[anchor];
            if (!suggestions) return null;
            return (
              <div style={{ padding: '8px 14px', borderTop: '1px solid var(--cfs-border-soft)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {suggestions.map((q, i) => (
                  <button key={i} onClick={() => onSend(q)} style={{ background: 'none', border: '1px solid var(--cfs-border-soft)', borderRadius: 8, color: 'var(--cfs-text-2)', cursor: 'pointer', padding: '5px 10px', fontSize: 11, textAlign: 'left', transition: 'all 0.15s ease', lineHeight: 1.4 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cfs-accent)'; e.currentTarget.style.color = 'var(--cfs-accent)'; e.currentTarget.style.background = 'rgba(139,38,53,0.04)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--cfs-border-soft)'; e.currentTarget.style.color = 'var(--cfs-text-2)'; e.currentTarget.style.background = 'none'; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* Entrada de texto e iconos */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--cfs-border)', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={t.placeholder}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--cfs-border)', backgroundColor: 'var(--cfs-surface-bg)', color: 'var(--cfs-text-1)', fontSize: 13, outline: 'none' }}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Parar' : 'Hablar'}
              style={{ padding: '10px 12px', borderRadius: 10, border: isListening ? '1px solid var(--cfs-accent)' : '1px solid var(--cfs-border)', backgroundColor: isListening ? 'var(--cfs-accent)' : 'transparent', color: isListening ? 'var(--cfs-accent-text)' : 'var(--cfs-text-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
              </svg>
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{ padding: '10px 16px', borderRadius: 10, backgroundColor: loading || !question.trim() ? 'var(--cfs-border)' : 'var(--cfs-accent)', color: 'var(--cfs-accent-text)', border: 'none', cursor: loading || !question.trim() ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 600, transition: 'background-color 0.2s' }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* DIVISOR ARRASTRABLE */}
        {!presentationMode && (
          <div
            onMouseDown={handleDragStart}
            style={{ width: 8, cursor: 'col-resize', backgroundColor: 'transparent', borderLeft: '1px solid var(--cfs-border-soft)', borderRight: '1px solid var(--cfs-border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background-color 0.15s ease', position: 'relative' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--cfs-accent)'; e.currentTarget.style.opacity = '0.3'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.opacity = '1'; }}
          >
            <div style={{ width: 2, height: 32, borderRadius: 2, backgroundColor: 'var(--cfs-text-3)', opacity: 0.4 }} />
          </div>
        )}

        {/* PANEL DE CONTENIDO (DERECHA) */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'var(--cfs-surface-bg)' }}>
          {/* Tabs */}
          {allTabs.length > 0 && (
            <div style={{ display: 'flex', gap: 6, padding: '8px 16px', borderBottom: '1px solid var(--cfs-border-soft)', flexShrink: 0, overflowX: 'auto', backgroundColor: 'var(--cfs-bg)', alignItems: 'center' }}>
              {allTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === activeTab) return;
                    setPanelVisible(false);
                    setTimeout(() => {
                      setActiveTab(tab.id);
                      setPanelKey(k => k + 1);
                      setPanelVisible(true);
                    }, 180);
                  }}
                  style={{
                    padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap',
                    border: `1px solid ${activeTab === tab.id ? (tab.type === 'interactive' ? 'var(--accent-electric)' : tab.type === 'entsoe' ? 'hsl(280 100% 70%)' : 'var(--cfs-amber)') : 'var(--cfs-border)'}`,
                    backgroundColor: activeTab === tab.id ? (tab.type === 'interactive' ? 'hsla(190,100%,60%,0.1)' : tab.type === 'entsoe' ? 'hsla(280,100%,70%,0.1)' : 'hsla(38,100%,56%,0.1)') : 'transparent',
                    color: activeTab === tab.id ? (tab.type === 'interactive' ? 'var(--accent-electric)' : tab.type === 'entsoe' ? 'hsl(280 100% 70%)' : 'var(--cfs-amber)') : 'var(--cfs-text-2)',
                    cursor: 'pointer', transition: 'all 0.15s ease', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Panel con animación */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative', transition: 'opacity 0.18s ease, transform 0.18s ease', opacity: panelVisible ? 1 : 0, transform: panelVisible ? 'translateX(0)' : 'translateX(8px)' }}>
            {renderPanelContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function preloadAllSimulators() {
  [
    FrequencyChart, SwingEquationSimulator, TapLagSequence,
    BlackoutPropagationMap, CollapseSismograph, PVCurveSimulator,
    ANSI59Cascade, InterconnectionDashboard, IberianGridTopology,
    MixGeneracion, FinancialWaterfallChart, EnergyTransitionStreamgraph,
    AnimatedRestorationMap, VerticalTimeline, ThermalAdjustmentCostMatrix,
  ].forEach(C => { if (C?.preload) C.preload().catch(() => {}); });
}
```
