// scripts/build-index.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MiniSearch = require('minisearch');

process.stdout.setEncoding('utf-8');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_DIR = path.join(__dirname, '..', 'static');

const TARGET_CHARS = 1600;
const MAX_CHARS = 2400;
const OVERLAP_CHARS = 250;

const KEYWORDS_DICT = [
  'IBR', 'GFM', 'GFL', 'UFLS', 'OLTC', 'Tap-Lag', 'RoCoF', 'Q-V', 'MVAr', 'MW',
  'inercia', 'SCADA', 'PMU', 'ENTSO-E', 'REE', 'ICAI', 'AELEC', 'P.O. 7.4',
  'NC RfG', 'BESS', 'Black Start', 'Operación Reforzada', 'Gobierno', 'cascada',
  'colapso', 'sobretensión', 'inversor', 'frecuencia', 'tensión', 'isla',
  'reposición', 'blackout', 'apagón', '28-A', 'coste', 'capex', 'opex'
];

const miniSearch = new MiniSearch({
  fields: ['title', 'heading', 'subheading', 'text', 'keywordsText'],
  storeFields: ['title', 'heading', 'subheading', 'text', 'slug', 'anchor', 'chunkType', 'keywords', 'keywordsText', 'chapterOrder', 'sourceFile', 'artifact'],
  searchOptions: {
    boost: { title: 3, heading: 2.5, subheading: 2, keywordsText: 1.5, text: 1 },
    prefix: true,
    fuzzy: 0.2,
  },
});

let docId = 0;
const allChunks = [];

function normalizeText(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function inferChunkType(text) {
  const norm = normalizeText(text);
  
  const comparisonTerms = ['gobierno', 'ree', 'icai', 'entso-e', 'aelec', 'cnmc'];
  const comparisonCount = comparisonTerms.filter(t => norm.includes(t)).length;
  
  const timeRegex = /\b([0-1]?[0-9]|2[0-3]):[0-5][0-9]\b/g;
  const timeMatches = norm.match(timeRegex);
  const timelineCount = timeMatches ? timeMatches.length : 0;

  const quantRegex = /\b(mw|mvar|hz|kv|m€|s|hz\/s|gw|gv|millones)\b/g;
  const quantMatches = norm.match(quantRegex);
  const quantCount = quantMatches ? quantMatches.length : 0;

  const causalTerms = ['causa', 'detonante', 'consecuencia', 'mecanismo', 'provoco', 'agravo', 'colapso', 'raiz', 'origen'];
  const causalCount = causalTerms.filter(t => norm.includes(t)).length;

  if (comparisonCount >= 2) return 'comparison';
  if (timelineCount >= 3) return 'timeline';
  if (quantCount >= 4) return 'quantitative';
  if (causalCount >= 2) return 'causal';

  return 'normal';
}

function extractKeywords(text) {
  const found = new Set();
  const lower = text.toLowerCase();
  KEYWORDS_DICT.forEach(kw => {
    if (lower.includes(kw.toLowerCase())) found.add(kw);
  });
  return Array.from(found);
}

function generateSlugify(text) {
  if (!text) return '';
  return normalizeText(text).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function splitLongParagraph(paragraph, maxChars = MAX_CHARS) {
  const sentences = paragraph
    .split(/(?<=[.!?;:])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  const parts = [];
  let current = '';

  const pushCurrent = () => {
    if (current.trim()) parts.push(current.trim());
    current = '';
  };

  const iterateOver = sentences.length ? sentences : [paragraph];

  for (const sentence of iterateOver) {
    if (sentence.length > maxChars) {
      pushCurrent();
      for (let i = 0; i < sentence.length; i += maxChars) {
        parts.push(sentence.slice(i, i + maxChars).trim());
      }
      continue;
    }

    if ((current.length + sentence.length + 1) > maxChars) {
      pushCurrent();
    }

    current = current ? `${current} ${sentence}` : sentence;
  }

  pushCurrent();
  return parts;
}

function getOverlapText(text, overlapChars = OVERLAP_CHARS) {
  if (!text || text.length <= overlapChars) return text || '';
  let overlap = text.slice(-overlapChars);
  const firstSpace = overlap.indexOf(' ');
  if (firstSpace > 0 && firstSpace < overlap.length - 1) {
    overlap = overlap.slice(firstSpace + 1);
  }
  return overlap.trim();
}

function splitTextWithOverlap(text) {
  if (text.length <= MAX_CHARS) return [text];
  
  const rawParagraphs = text.split(/\n\n+/);
  const paragraphs = [];
  
  for (const rp of rawParagraphs) {
    if (rp.length > MAX_CHARS) {
      paragraphs.push(...splitLongParagraph(rp, MAX_CHARS));
    } else {
      paragraphs.push(rp);
    }
  }
  
  const chunks = [];
  let currentChunk = '';

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (!p) continue;

    if ((currentChunk.length + p.length) > TARGET_CHARS && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      
      const overlapText = getOverlapText(currentChunk, OVERLAP_CHARS);
      currentChunk = overlapText ? `[continuación] ${overlapText}\n\n${p}` : p;
    } else {
      currentChunk = currentChunk ? `${currentChunk}\n\n${p}` : p;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}

function createChunk(metadata) {
  const chunkType = metadata.chunkType || inferChunkType(metadata.rawText);
  const keywords = metadata.keywords || extractKeywords(metadata.rawText);
  const keywordsText = keywords.join(' ');
  
  const contextualText = `Capítulo: ${metadata.title || 'General'}\nSección: ${metadata.heading || 'General'}\nSubsección: ${metadata.subheading || 'N/A'}\n\n${metadata.rawText}`;

  allChunks.push({
    id: docId++,
    title: metadata.title || '',
    heading: metadata.heading || '',
    subheading: metadata.subheading || '',
    text: contextualText,
    slug: metadata.slug || '',
    anchor: metadata.anchor || '',
    chunkType,
    keywords,
    keywordsText,
    chapterOrder: metadata.chapterOrder || 0,
    sourceFile: metadata.sourceFile || 'N/A',
    artifact: metadata.artifact || undefined
  });
}

function extractChunks(filePath, content) {
  const { data, content: body } = matter(content);

  let cleanBody = body
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]+\}\s+from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^<[A-Z][^>]*\/>\s*$/gm, '')
    .replace(/^<[A-Z][^>]*>\s*$/gm, '')
    .replace(/^<\/[A-Z][^>]*>\s*$/gm, '')
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/^:::[a-z]+.*$/gm, '')
    .replace(/^:::$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .normalize('NFC')
    .trim();

  const title = data.title || path.basename(filePath, '.mdx');
  const chapterOrder = data.sidebar_position || 0;
  
  const rawSlug = filePath
    .replace(DOCS_DIR, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '')
    .replace(/\\/g, '/');

  const slug = data.slug
    ? data.slug
    : rawSlug.split('/').map(segment => segment.replace(/^\d+-/, '')).join('/') || '/';

  const lines = cleanBody.split('\n');
  let currentHeading = title;
  let currentSubheading = '';
  let currentAnchor = '';
  let buffer = [];

  const flushBuffer = () => {
    if (buffer.length === 0) return;
    const textBlob = buffer.join('\n').trim();
    if (textBlob.length < 20) {
      buffer = [];
      return;
    }

    const splitChunks = splitTextWithOverlap(textBlob);
    splitChunks.forEach(textPortion => {
      createChunk({
        title,
        heading: currentHeading,
        subheading: currentSubheading,
        rawText: textPortion,
        slug,
        anchor: currentAnchor,
        chapterOrder,
        sourceFile: path.basename(filePath)
      });
    });
    buffer = [];
  };

  for (const line of lines) {
    const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (hMatch) {
      flushBuffer();
      const level = hMatch[1].length;
      let textLine = hMatch[2].trim();
      
      let newAnchor = '';
      const anchorMatch = textLine.match(/\{#([^}]+)\}$/);
      if (anchorMatch) {
        newAnchor = anchorMatch[1];
        textLine = textLine.replace(/\{#([^}]+)\}$/, '').trim();
      } else {
        newAnchor = generateSlugify(textLine);
      }

      const cleanTextLine = textLine.replace(/<[^>]+>/g, '').trim();

      if (level === 1) {
        currentHeading = cleanTextLine;
        currentSubheading = '';
        currentAnchor = newAnchor;
      } else if (level === 2) {
        currentHeading = cleanTextLine;
        currentSubheading = '';
        currentAnchor = newAnchor;
      } else if (level >= 3) {
        currentSubheading = cleanTextLine;
        currentAnchor = newAnchor;
      }
    } else {
      buffer.push(line);
    }
  }
  flushBuffer();
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      extractChunks(fullPath, raw);
    }
  }
}

function injectMasterData() {
  const masterDataPath = path.join(OUTPUT_DIR, 'data', 'datos28A.json');
  if (fs.existsSync(masterDataPath)) {
    const data = JSON.parse(fs.readFileSync(masterDataPath, 'utf8'));
    const rawText = `Datos críticos del colapso del 28-A:
- Demanda peninsular en el momento del apagón: ${data.demanda.peninsular_MW} MW (${data.demanda.descripcion || '56% del pico histórico'}).
- Mix renovable: ${data.mix_generacion.renovable_total_porcentaje}%, fotovoltaica: ${data.mix_generacion.fotovoltaica_porcentaje}%, nuclear: ${data.mix_generacion.nuclear_porcentaje}%, bombeo activo: ${data.mix_generacion.bombeo_activo_MW} MW.
- Intercambios internacionales: España exportaba ${data.intercambios_internacionales.exportacion_francia_MW} MW a Francia, ${data.intercambios_internacionales.exportacion_portugal_MW} MW a Portugal, ${data.intercambios_internacionales.exportacion_marruecos_MW} MW a Marruecos. ${data.intercambios_internacionales.descripcion || ''}
- Inercia ibérica H_tot: ${data.inercia_y_estabilidad.inercia_iberia_s} s. Energía cinética total: ${data.inercia_y_estabilidad.energia_cinetica_total_iberia_MWs} MWs.
- Frecuencia en pérdida de sincronismo con Francia: ${data.inercia_y_estabilidad.frecuencia_perdida_sincronismo_Hz} Hz a las ${data.colapso_y_reposicion.separacion_francia_hora || '12:33:21.535 CEST'}.
- Nadir frecuencial: ${data.colapso_y_reposicion.frecuencia_nadir_Hz || 47.79} Hz. RoCoF hasta separación: ${data.colapso_y_reposicion.rocof_hasta_separacion_Hz_s || 1.0} Hz/s.
- Tensión máxima en barras colectoras: >${data.colapso_y_reposicion.tension_maxima_barras_colectoras_kV} kV.
- Disparo raíz: ${data.colapso_y_reposicion.disparo_raiz_granada_MW || 355} MW en Granada a las ${data.colapso_y_reposicion.disparo_raiz_granada_hora || '12:32:56.993 CEST'}.
- Pérdida de generación en los primeros 20 s: ${data.colapso_y_reposicion.perdida_generacion_20s_MW || 2000} MW. Total cascada: ${data.colapso_y_reposicion.perdida_generacion_cascada_MW} MW.
- Demanda sin suministro: España ${data.colapso_y_reposicion.demanda_sin_suministro_espana_MW || 25184} MW (${data.colapso_y_reposicion.desconexion_espana_porcentaje || 33.8}% de su demanda). Portugal ${data.colapso_y_reposicion.demanda_sin_suministro_portugal_MW || 1955} MW (${data.colapso_y_reposicion.desconexion_portugal_porcentaje || 33.3}% de su demanda). Total ibérico: ${data.colapso_y_reposicion.carga_iberica_total_MW || 31000} MW.
- Reposición: Portugal completó el transporte a las ${data.colapso_y_reposicion.reposicion_portugal_transporte || '00:22 del 29 de abril'} (~${data.colapso_y_reposicion.duracion_reposicion_portugal_h || 12} horas). España completó el transporte a las ${data.colapso_y_reposicion.reposicion_espana_transporte || '04:00 del 29 de abril'} (~${data.colapso_y_reposicion.duracion_reposicion_espana_h || 16} horas). Recuperación del 99% de demanda: ${data.colapso_y_reposicion.recuperacion_demanda_99pct || '07:00 del 29 de abril'}.
- Coste de Operación Reforzada: ${data.colapso_y_reposicion.coste_operacion_reforzada_M_eur} M€/año.
- Electrodependientes sin suministro: ~70.000 personas.`;

    const keywords = extractKeywords(rawText);

    createChunk({
      title: 'Tabla Maestra de Cifras Consolidadas (28-A)',
      heading: 'Datos Oficiales, Exportaciones Netas y Mix de Generación',
      subheading: '',
      rawText: rawText,
      slug: '/anexo-tablas',
      anchor: 'cifras-maestras',
      chunkType: 'master_data',
      keywords: keywords,
      chapterOrder: 99,
      sourceFile: 'datos28A.json'
    });
  }
}

function injectGlossary() {
  try {
    const glossaryPath = path.join(__dirname, '..', 'src', 'data', 'glossary.js');
    if (!fs.existsSync(glossaryPath)) return;
    
    const raw = fs.readFileSync(glossaryPath, 'utf-8');
    const termRegex = /\{\s*id:\s*slugify\(['"]([^'"]+)['"]\)[\s\S]*?term:\s*['"]([^'"]+)['"][\s\S]*?definition:\s*['"]([\s\S]*?)['"]\s*,?\s*\}/g;
    let match;
    let count = 0;
    
    while ((match = termRegex.exec(raw)) !== null) {
      const term = match[2].trim();
      const definition = match[3].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      
      if (definition.length < 10) continue;
      
      const anchor = generateSlugify(term);
      const rawText = `${term}: ${definition}`.normalize('NFC');
      
      createChunk({
        title: 'Glosario Técnico',
        heading: term,
        subheading: '',
        rawText: rawText,
        slug: '/glosario',
        anchor: anchor,
        chunkType: 'glossary',
        keywords: extractKeywords(rawText),
        chapterOrder: 98,
        sourceFile: 'glossary.js'
      });
      count++;
    }
    console.log(`  → ${count} términos del glosario indexados.`);
  } catch (err) {
    console.warn('  ⚠ No se pudo indexar el glosario:', err.message);
  }
}

function injectGraphics() {
  const graphicsPath = path.join(__dirname, '..', 'static', 'data', 'graphics-metadata.json');
  if (!fs.existsSync(graphicsPath)) {
    console.warn('  ⚠ No se encontró graphics-metadata.json');
    return;
  }
  
  const graphics = JSON.parse(fs.readFileSync(graphicsPath, 'utf-8'));
  graphics.forEach(g => {
    const rawText = `${g.title}: ${g.description} Palabras clave: ${g.keywords.join(', ')}.`.normalize('NFC');
    
    createChunk({
      title: 'Herramientas Interactivas — Anexo C',
      heading: g.title,
      subheading: '',
      rawText: rawText,
      slug: g.slug,
      anchor: g.id || '',
      chunkType: 'graphic',
      keywords: g.keywords,
      chapterOrder: 97,
      sourceFile: 'graphics-metadata.json',
      artifact: {
        id: g.id,
        type: 'interactive',
        source: 'annex_c',
        title: g.title,
        description: g.description,
        slug: g.slug,
        url: g.slug,
        keywords: g.keywords || []
      }
    });
  });
  console.log(`  → ${graphics.length} gráficas interactivas indexadas.`);
}

function injectForensicTables() {
  const tablesPath = path.join(__dirname, '..', 'static', 'data', 'processed', 'forensic_categories.json');
  if (!fs.existsSync(tablesPath)) return;
  const raw = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
  let count = 0;
  raw.categories.forEach(category => {
    (category.tables || []).forEach(table => {
      const rawText = `Anexo B — Tabla forense\nCategoría: ${category.name || ''}\nID: ${table.id}\nNombre: ${table.name || table.id}\nOrigen: ${table.source || ''}\nNota: ${table.note || ''}\nColumnas: ${(table.columns || []).map(c => c.label || c.key).join(', ')}\nMuestra de datos: ${JSON.stringify(Array.isArray(table.data) ? table.data.slice(0, 3) : [])}`;
      createChunk({
        title: 'Anexo B — Tablas Forenses',
        heading: table.name || table.id,
        subheading: category.name || '',
        rawText,
        slug: '/anexo-tablas',
        anchor: table.id,
        chunkType: 'table',
        keywords: extractKeywords(rawText),
        chapterOrder: 96,
        sourceFile: 'forensic_categories.json',
        artifact: {
          id: table.id,
          type: 'table',
          source: 'annex_b',
          title: table.name || table.id,
          description: table.note || '',
          origin: table.source || '',
          url: `/anexo-tablas#${table.id}`,
          columns: table.columns || [],
          sampleRows: Array.isArray(table.data) ? table.data.slice(0, 3) : []
        }
      });
      count++;
    });
  });
  console.log(`  → ${count} tablas forenses indexadas.`);
}

function injectImageGalleryData() {
  const galleryPath = path.join(__dirname, '..', 'src', 'data', 'imageGalleryData.js');
  if (!fs.existsSync(galleryPath)) return;
  const raw = fs.readFileSync(galleryPath, 'utf8');
  let count = 0;
  const imgRegex = /\{\s*src:\s*['"]([^'"]+)['"],\s*caption_es:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = imgRegex.exec(raw)) !== null) {
    const src = match[1];
    const caption_es = match[2];
    const id = src.split('/').pop().replace(/\.[^/.]+$/, "");
    
    let title = caption_es;
    if (title.length > 120) {
      title = title.substring(0, 117) + '...';
    }
    const description = caption_es;
    const rawText = `ID: ${id}\nTítulo: ${title}\nDescripción: ${description}\nRuta: ${src}`;
    createChunk({
      title: 'Anexo D — Gráficas de Datos Reales',
      heading: title,
      subheading: 'Gráficas 28-A / ESIOS / REE / ENTSO-E',
      rawText,
      slug: '/anexo-figuras',
      anchor: id,
      chunkType: 'data_figure',
      keywords: extractKeywords(rawText),
      chapterOrder: 95,
      sourceFile: 'imageGalleryData.js',
      artifact: {
        id: id,
        type: 'image',
        source: 'annex_d',
        title: title,
        description: description,
        path: src,
        url: `/anexo-figuras#${id}`
      }
    });
    count++;
  }
  console.log(`  → ${count} gráficas de datos reales indexadas.`);
}

function injectEntsoeCharts() {
  const chartsPath = path.join(__dirname, '..', 'src', 'data', 'forensicCharts.js');
  if (!fs.existsSync(chartsPath)) {
    console.warn('  ⚠ No se encontró forensicCharts.js');
    return;
  }

  const raw = fs.readFileSync(chartsPath, 'utf8');

  // Extraer objetos de la lista: id, title, description
  const idMatches     = [...raw.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const titleMatches  = [...raw.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  const descMatches   = [...raw.matchAll(/description:\s*`([\s\S]*?)`/g)].map(m => m[1].trim());
  // Fallback si las descriptions usan comillas simples/dobles
  const descMatchesQ  = [...raw.matchAll(/description:\s*['"]([^'"]{20,})['"]/g)].map(m => m[1]);
  const descriptions  = descMatches.length >= idMatches.length ? descMatches : descMatchesQ;

  let count = 0;
  idMatches.forEach((id, i) => {
    const title       = titleMatches[i] || id;
    const description = (descriptions[i] || '').substring(0, 400).replace(/\n/g,' ').replace(/\s+/g,' ');
    if (!title) return;

    const rawText = [
      `Anexo ENTSO-E — Gráfica con datos reales de la API`,
      `ID: ${id}`,
      `Título: ${title}`,
      `Descripción: ${description}`,
      `Fuente: ESIOS / ENTSO-E / REE / OMIE — datos extraídos directamente de las APIs oficiales`
    ].join('\n').normalize('NFC');

    createChunk({
      title:        'Anexo ENTSO-E — Gráficas con Datos Reales de las APIs',
      heading:      title,
      subheading:   'Datos extraídos de ESIOS, ENTSO-E, OMIE y REE el 28-A',
      rawText,
      slug:         '/anexo-entsoe',
      anchor:       id,
      chunkType:    'data_figure',
      keywords:     extractKeywords(rawText),
      chapterOrder: 94,
      sourceFile:   'forensicCharts.js',
      artifact: {
        id,
        type:        'entsoe_chart',
        source:      'annex_entsoe',
        title,
        description,
        url:         `/anexo-entsoe#${id}`,
      }
    });
    count++;
  });
  console.log(`  → ${count} gráficas ENTSO-E indexadas.`);
}

function buildIndex() {
  console.log('🔍 Construyendo índice jerárquico de búsqueda para el chatbot...');
  walkDir(DOCS_DIR);
  injectMasterData();
  injectForensicTables();
  injectImageGalleryData();
  injectGlossary();
  injectGraphics();
  injectEntsoeCharts();

  miniSearch.addAll(allChunks);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'search-index.json'),
    JSON.stringify(miniSearch.toJSON())
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'chunks.json'),
    JSON.stringify(allChunks)
  );
  console.log(`✅ Índice completado: ${allChunks.length} fragmentos indexados.`);
}

buildIndex();
