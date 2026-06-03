// api/chat.js
import MiniSearch from 'minisearch';
import fs from 'fs';
import path from 'path';

let searchIndexData = null;
let chunks = null;
let miniSearch = null;

function getSearch() {
  if (!miniSearch) {
    try {
      searchIndexData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'search-index.json'), 'utf8'));
      chunks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'static', 'chunks.json'), 'utf8'));
      miniSearch = MiniSearch.loadJSON(
        JSON.stringify(searchIndexData),
        {
          fields: ['title', 'heading', 'subheading', 'text', 'keywordsText'],
          storeFields: ['title', 'heading', 'subheading', 'text', 'slug', 'anchor', 'chunkType', 'keywords', 'keywordsText', 'chapterOrder', 'sourceFile']
        }
      );
    } catch (err) {
      console.error('Error cargando los archivos estáticos del índice:', err);
      throw new Error('IndexFilesMissing');
    }
  }
  return miniSearch;
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

  match(['por que', 'como amplifico', 'como actuo', 'mecanismo', 'detonante', 'causa', 'agravo', 'tap-lag', 'ufls', 'colapso en vez de'], 'causal', 3);
  match(['kv', 'mw', 'hz', 'mvar', 'gw', 'cuanto', 'cifra', 'coste', 'porcentaje', 'demanda', 'perdida', 'm€'], 'quantitative', 1);
  match(['compara', 'comparar', 'vs', 'frente a', 'diferencia entre', 'discrepan', 'ree', 'icai', 'entso-e'], 'comparison', 3);
  match(['cuando', 'cronologia', 'secuencia', 'hora', '12:33', 'antes', 'despues', 'minuto'], 'timeline', 1);
  match(['que es', 'define', 'explicame el concepto', 'que significa'], 'glossary', 4);
  match(['figura', 'simulador', 'grafica', 'mapa', 'tabla', 'ensename', 'mostrar'], 'visual', 4);
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

function applySlugPenalties(score, chunk, normalizedQuestion) {
  const slug = normalizeText(chunk?.slug || '');
  let adjusted = score;

  const asksAboutAI =
    normalizedQuestion.includes('ia') ||
    normalizedQuestion.includes('inteligencia artificial') ||
    normalizedQuestion.includes('llm') ||
    normalizedQuestion.includes('prompt') ||
    normalizedQuestion.includes('uso de ia');

  const asksAboutEurope =
    normalizedQuestion.includes('europa') ||
    normalizedQuestion.includes('europea') ||
    normalizedQuestion.includes('francia') ||
    normalizedQuestion.includes('portugal') ||
    normalizedQuestion.includes('entso-e') ||
    normalizedQuestion.includes('rte') ||
    normalizedQuestion.includes('interconexion');

  const asksHowItStarted =
    normalizedQuestion.includes('como empezo') ||
    normalizedQuestion.includes('como inicio') ||
    normalizedQuestion.includes('origen del apagon') ||
    normalizedQuestion.includes('empezo el apagon') ||
    normalizedQuestion.includes('inicio el apagon') ||
    normalizedQuestion.includes('por que se fue la luz');

  if (slug.includes('uso-ia') && !asksAboutAI) adjusted *= 0.35;
  if (slug.includes('dimension-europea') && !asksAboutEurope) adjusted *= 0.55;

  if (asksHowItStarted && slug.includes('impacto-comunicativo')) adjusted *= 0.45;
  if (asksHowItStarted && slug.includes('consecuencias-financieras')) adjusted *= 0.45;
  if (asksHowItStarted && slug.includes('dimension-europea')) adjusted *= 0.45;

  return adjusted;
}

function rerankResultsByIntent(results, chunksData, intent, question) {
  const normQuestion = normalizeText(question);
  const questionTerms = normQuestion.split(/\s+/).filter(t => t.length > 3);
  
  return results.map(r => {
    const chunk = chunksData[r.id];
    if (!chunk) return { ...r, adjustedScore: 0 };

    let adjustedScore = r.score || 0;
    const chunkType = chunk.chunkType || 'normal';
    const keywords = Array.isArray(chunk.keywords) ? chunk.keywords : [];
    
    const title = normalizeText(chunk.title || '');
    const heading = normalizeText(chunk.heading || '');
    const subheading = normalizeText(chunk.subheading || '');
    const text = normalizeText(chunk.text || '');
    const normSlug = normalizeText(chunk.slug || '');
    const combinedHead = `${heading} ${subheading} ${normSlug}`;

    if (intent === 'comparison' && chunkType === 'comparison') adjustedScore *= 1.45;
    if (intent === 'quantitative' && (chunkType === 'quantitative' || chunkType === 'master_data')) adjustedScore *= 1.45;
    if (intent === 'timeline' && chunkType === 'timeline') adjustedScore *= 1.45;
    if (intent === 'glossary' && chunkType === 'glossary') adjustedScore *= 1.50;
    if (intent === 'visual' && chunkType === 'graphic') adjustedScore *= 1.45;
    if (intent === 'causal' && chunkType === 'causal') adjustedScore *= 1.45;

    if (keywords.some(kw => normQuestion.includes(normalizeText(kw)))) {
      adjustedScore *= 1.2;
    }

    if (questionTerms.some(t => title.includes(t) || heading.includes(t))) {
      adjustedScore *= 1.15;
    }

    if (normQuestion.includes('tap-lag') || normQuestion.includes('tap lag')) {
      if (combinedHead.includes('tap-lag') || combinedHead.includes('taplag') || text.includes('tap-lag')) adjustedScore *= 1.8;
      if (normSlug.includes('analisis-incidente')) adjustedScore *= 1.35;
    }
    
    if (normQuestion.includes('ufls') || normQuestion.includes('deslastre')) {
      if (combinedHead.includes('ufls') || text.includes('ufls') || text.includes('deslastre')) adjustedScore *= 1.7;
    }
    
    if (normQuestion.includes('gfm') || normQuestion.includes('grid forming') || normQuestion.includes('grid-forming')) {
      if ((chunk.chunkType || '') === 'glossary') adjustedScore *= 1.8;
      if (text.includes('grid-forming') || text.includes('gfm')) adjustedScore *= 1.4;
    }
    
    if (intent === 'visual' && (normQuestion.includes('frecuencia') || normQuestion.includes('frequency') || normQuestion.includes('rocof') || normQuestion.includes('nadir'))) {
      if ((chunk.chunkType || '') === 'graphic') adjustedScore *= 2.0;
      if (text.includes('frecuencia') || text.includes('frequency') || text.includes('rocof') || text.includes('nadir')) adjustedScore *= 1.4;
    }
    
    if (normQuestion.includes('francia') || normQuestion.includes('reposición') || normQuestion.includes('reposicion') || normQuestion.includes('rte')) {
      if (text.includes('francia') || text.includes('rte') || text.includes('reposicion') || text.includes('reposición')) adjustedScore *= 1.45;
    }
    
    if (normQuestion.includes('coste') || normQuestion.includes('opex') || normQuestion.includes('capex') || normQuestion.includes('operacion reforzada')) {
      if (normSlug.includes('consecuencias-financieras') || text.includes('operacion reforzada') || text.includes('operación reforzada')) adjustedScore *= 1.6;
    }

    if (
      normQuestion.includes('como empezo') ||
      normQuestion.includes('como inicio') ||
      normQuestion.includes('origen del apagon') ||
      normQuestion.includes('empezo el apagon') ||
      normQuestion.includes('inicio el apagon') ||
      normQuestion.includes('por que se fue la luz')
    ) {
      if (normSlug.includes('analisis-incidente')) adjustedScore *= 1.8;
      if (normSlug.includes('contexto')) adjustedScore *= 1.45;
      if (normSlug.includes('resumen-de-cifras')) adjustedScore *= 1.35;
      if (text.includes('tap-lag') || text.includes('sobretension') || text.includes('colapso de tension')) adjustedScore *= 1.35;
    }

    if (normQuestion.includes('inercia') || normQuestion.includes('rocof')) {
      if (normSlug.includes('analisis-incidente') || normSlug.includes('resiliencia-futuro') || normSlug.includes('resumen-de-cifras')) adjustedScore *= 1.4;
      if (text.includes('inercia') || text.includes('rocof') || text.includes('h=')) adjustedScore *= 1.3;
    }

    if (!chunk.text || chunk.text.length < 100) adjustedScore *= 0.7;

    adjustedScore = applySlugPenalties(adjustedScore, chunk, normQuestion);

    return { ...r, adjustedScore };
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const errResponse = (status, answer, errorMsg, detectedIntent = 'general') => {
    return res.status(status).json({
      answer, error: errorMsg, sources: [], confidence: 'sin_evidencia', confidence_reason: errorMsg,
      relatedChapters: [], suggestedFigures: [], followUps: [], intent: detectedIntent
    });
  };

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
        relatedChapters: [], suggestedFigures: [],
        followUps: ['¿Cuál fue la causa principal del apagón del 28-A?', '¿Dónde aparece explicado el Tap-Lag en el TFG?'],
        intent
      });
    }

    const sources = buildSources(selectedPairs, 5);
    const relatedChapters = buildRelatedChapters(selectedPairs, 5);
    const suggestedFigures = buildSuggestedFigures(selectedPairs, 3);
    const { confidence, confidence_reason } = computeConfidence(selectedPairs, usedExpandedSearch);
    const followUps = buildFollowUps(question, selectedPairs, intent, 3);

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

SUGERENCIAS CONTEXTUALES POSIBLES (Usa una para el cierre):
${followUps.map(q => `- ${q}`).join('\n')}

CONTEXTO RECUPERADO:
${context}

PREGUNTA DEL USUARIO:
${question}

RESPUESTA DEL ASISTENTE:`;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) return errResponse(500, 'El servicio de IA no está configurado.', 'Falta GROQ_API_KEY.', intent);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'Eres un experto en sistemas eléctricos respondiendo dudas sobre un TFG.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    if (!response.ok) return errResponse(502, 'IA no disponible temporalmente.', 'Fallo API Groq.', intent);

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No pude generar la respuesta.';

    return res.status(200).json({
      answer, sources, confidence, confidence_reason, relatedChapters, suggestedFigures, followUps, intent
    });

  } catch (error) {
    return errResponse(500, 'Error interno del servidor.', error.message, intent);
  }
}
