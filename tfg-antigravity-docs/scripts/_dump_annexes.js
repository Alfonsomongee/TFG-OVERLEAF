// Volcado completo de los 9 anexos: figuras, tablas, interactivos y series por tema
const fs = require('fs');

// ── 1. Cargar galería de figuras ─────────────────────────────────────────────
const galeria = JSON.parse(fs.readFileSync('src/data/galeriaforensedefinitiva.json', 'utf8'));
const allImages = [];
(galeria.chapters || []).forEach(ch => {
  (ch.images || []).forEach(img => allImages.push({ ...img, chapterTitle: ch.title }));
});

// ── 2. Cargar tablas ─────────────────────────────────────────────────────────
const cats = JSON.parse(fs.readFileSync('static/data/processed/forensic_categories.json', 'utf8'));
const allTables = [];
(cats.categories || []).forEach(cat => {
  (cat.tables || []).forEach(t => allTables.push({ ...t, catTitle: cat.title }));
});

// ── 3. Cargar interactivos (graphicsData) ────────────────────────────────────
// Extraer desde el JS de forma manual leyendo el array GRAPHICS_DATA
let graphicsRaw = fs.readFileSync('src/components/InteractiveGraphicsGalleryBase.jsx', 'utf8');
// Buscar el array graphicsData exportado
const graphicsMatch = graphicsRaw.match(/export const graphicsData\s*=\s*(\[[\s\S]*?\]);/);
let graphicsData = [];
if (graphicsMatch) {
  try { graphicsData = eval(graphicsMatch[1]); } catch(e) { graphicsData = []; }
}

// ── 4. Cargar charts (ENTSO-E) ───────────────────────────────────────────────
let chartsRaw = fs.readFileSync('src/data/forensicCharts.js', 'utf8');
const chartsMatch = chartsRaw.match(/export const CHARTS\s*=\s*(\[[\s\S]*?\]);/);
let CHARTS = [];
if (chartsMatch) {
  try { CHARTS = eval(chartsMatch[1]); } catch(e) { CHARTS = []; }
}

// ── 5. Temas mapeados ────────────────────────────────────────────────────────
const TEMAS = {
  T1: 'Anexo I — Demanda, generación y balance',
  T2: 'Anexo II — Estabilidad, frecuencia y tensión',
  T3: 'Anexo III — Protecciones y desconexiones',
  T4: 'Anexo IV — Interconexiones y flujos',
  T5: 'Anexo V — Mercado, precios y costes',
  T6: 'Anexo VI — Reposición y emergencia',
  T7: 'Anexo VII — Impacto y resiliencia',
  T8: 'Anexo VIII — Comunicación y fuentes',
  T9: 'Anexo IX — Metodología y modelos',
};

// ── 6. Figuras por tema (de galería) ─────────────────────────────────────────
const figsByTheme = {};
allImages.forEach(img => {
  const t = img.tema;
  if (!t) return;
  if (!figsByTheme[t]) figsByTheme[t] = [];
  figsByTheme[t].push(img);
});

// ── 7. Tablas por tema ────────────────────────────────────────────────────────
const tablesByTheme = {};
allTables.forEach(tbl => {
  const t = tbl.tema;
  if (!t) return;
  if (!tablesByTheme[t]) tablesByTheme[t] = [];
  tablesByTheme[t].push(tbl);
});

// ── 8. Interactivos por tema ──────────────────────────────────────────────────
const interByTheme = {};
graphicsData.forEach(g => {
  const t = g.tema;
  if (!t) return;
  if (!interByTheme[t]) interByTheme[t] = [];
  interByTheme[t].push(g);
});

// ── 9. Charts por tema ────────────────────────────────────────────────────────
const chartsByTheme = {};
CHARTS.forEach(c => {
  const t = c.tema;
  if (!t) return;
  if (!chartsByTheme[t]) chartsByTheme[t] = [];
  chartsByTheme[t].push(c);
});

// ── 10. También: figuras especiales hardcoded en los MDX ─────────────────────
const mdxFiguras = {
  T1: [
    { component: 'LOLEBarChart', figNum: 'A1.1', caption: 'Evolución de la LOLE por zona de oferta según la Decisión 06/2026 de ACER.', fuente: 'ACER', mdxFile: 'docs/anexo-demanda-generacion-balance.mdx' },
    { component: 'BESSBoomChart', figNum: 'A1.2', caption: 'Capacidad BESS acumulada en España (Q1 2024 – mayo 2026).', fuente: 'APPA, REE, MITECO', mdxFile: 'docs/anexo-demanda-generacion-balance.mdx' },
  ],
  T2: [
    { component: 'MRSCRComparator', figNum: 'A2.1', caption: 'Comparación de SCR y MRSCR en subestaciones ibéricas.', fuente: 'ENTSO-E', mdxFile: 'docs/anexo-estabilidad-dinamica-tension.mdx' },
    { component: 'DynamicSecurityShift', figNum: 'A2.2', caption: 'Transición del modelo de seguridad clásico a métricas dinámicas.', fuente: '', mdxFile: 'docs/anexo-estabilidad-dinamica-tension.mdx' },
    { component: 'ThenVsNowPanel', figNum: 'A2.3', caption: 'Comparación de métricas de vulnerabilidad entre el 28-A y mayo de 2026.', fuente: 'REE, ENTSO-E, ESIOS', mdxFile: 'docs/anexo-estabilidad-dinamica-tension.mdx' },
  ],
  T3: [
    { component: 'PO74Timeline', figNum: 'A3.1', caption: 'Cronograma de implementación del P.O. 7.4.', fuente: 'CNMC, BOE', mdxFile: 'docs/anexo-cascada-protecciones-desconexiones.mdx' },
    { component: 'OvervoltageTimeline', figNum: 'A3.2', caption: 'Cronología del colapso por sobretensión del 28-A.', fuente: 'ENTSO-E, REE, IIT-ICAI', mdxFile: 'docs/anexo-cascada-protecciones-desconexiones.mdx' },
  ],
  T4: [
    { component: 'CoordinationTimeline', figNum: 'A4.1', caption: 'Cronología de comunicaciones EAS/SAM durante la reposición ibérica.', fuente: 'ENTSO-E', mdxFile: 'docs/anexo-interconexiones-flujos.mdx' },
    { component: 'CommandArchitectureGraph', figNum: 'A4.2', caption: 'Arquitectura de mando durante el System Split.', fuente: 'ENTSO-E', mdxFile: 'docs/anexo-interconexiones-flujos.mdx' },
  ],
  T5: [
    { component: 'PicasoPriceChart', figNum: 'A5.1', caption: 'Incidentes de precios en PICASSO y efecto de la demanda elástica.', fuente: 'ACER', mdxFile: 'docs/anexo-mercado-costes.mdx' },
  ],
  T6: [],
  T7: [
    { component: 'TrilemmaTriangle', figNum: 'A7.1', caption: 'Trilema de la transición energética y su manifestación el 28-A.', fuente: '', mdxFile: 'docs/anexo-impacto-resiliencia.mdx' },
    { component: 'CNMCSanctionsChart', figNum: 'A7.2', caption: 'Expedientes sancionadores de la CNMC tras el 28-A.', fuente: 'CNMC / BOE', mdxFile: 'docs/anexo-impacto-resiliencia.mdx' },
  ],
  T8: [
    { component: 'EASStateTransition', figNum: 'A8.1', caption: 'Fallo del EAS: transición directa Normal → Blackout.', fuente: 'ENTSO-E', mdxFile: 'docs/anexo-comunicacion-fuentes.mdx' },
    { component: 'ConsensusMatrix', figNum: 'A8.2', caption: 'Matriz de consenso y discrepancia entre informes periciales.', fuente: '', mdxFile: 'docs/anexo-comunicacion-fuentes.mdx' },
  ],
  T9: [
    { component: 'ResolutionRoadmap', figNum: 'A9.2', caption: 'Hoja de ruta de soluciones técnicas, regulatorias y económicas post-28-A.', fuente: '', mdxFile: 'docs/anexo-metodologia-modelos-datos-vivos.mdx' },
    { component: 'ResearchAgendaScatter', figNum: 'A9.3', caption: 'Madurez técnica vs. regulatoria de las líneas de investigación futuras.', fuente: '', mdxFile: 'docs/anexo-metodologia-modelos-datos-vivos.mdx' },
  ],
};

// ── 11. Imprimir volcado ───────────────────────────────────────────────────────
Object.entries(TEMAS).forEach(([tema, label]) => {
  console.log('\n' + '='.repeat(80));
  console.log('  ' + tema + ' — ' + label);
  console.log('='.repeat(80));

  // Figuras galería (PNG/static)
  const figs = figsByTheme[tema] || [];
  console.log('\n── FIGURAS GALERÍA (imageGalleryData) ─ ' + figs.length + ' items');
  figs.forEach((f, i) => {
    console.log('  [' + (i+1) + '] ID: ' + f.id);
    console.log('       src: ' + f.src);
    console.log('       caption_es: ' + (f.caption_es || f.caption || '(sin caption)'));
    if (f.description_es) console.log('       description_es: ' + f.description_es.substring(0, 200));
  });

  // Figuras hardcoded en MDX (componentes React)
  const mdxFigs = mdxFiguras[tema] || [];
  console.log('\n── FIGURAS MDX (componentes React hardcoded) ─ ' + mdxFigs.length + ' items');
  mdxFigs.forEach((f, i) => {
    console.log('  [' + (i+1) + '] Figura ' + f.figNum + ' — ' + f.caption);
    console.log('       Componente: <' + f.component + ' />');
    console.log('       Fuente: ' + (f.fuente || 'no especificada'));
    console.log('       MDX: ' + f.mdxFile);
  });

  // Tablas
  const tables = tablesByTheme[tema] || [];
  console.log('\n── TABLAS (forensic_categories.json) ─ ' + tables.length + ' items');
  tables.forEach((t, i) => {
    console.log('  [' + (i+1) + '] ID: ' + t.id);
    console.log('       title_es: ' + (t.title_es || t.title || '(sin título)'));
    if (t.summary_es) console.log('       summary_es: ' + t.summary_es.substring(0, 200));
  });

  // Interactivos
  const inters = interByTheme[tema] || [];
  console.log('\n── INTERACTIVOS (graphicsData) ─ ' + inters.length + ' items');
  inters.forEach((g, i) => {
    console.log('  [' + (i+1) + '] id: ' + g.id);
    console.log('       anchor: ' + (g.anchor || ''));
  });

  // Charts ENTSO-E
  const chts = chartsByTheme[tema] || [];
  console.log('\n── SERIES / CHARTS ENTSO-E ─ ' + chts.length + ' items');
  chts.forEach((c, i) => {
    console.log('  [' + (i+1) + '] id: ' + c.id + ' | title: ' + c.title);
    if (c.desc) console.log('       desc: ' + c.desc.substring(0, 200));
  });
});
