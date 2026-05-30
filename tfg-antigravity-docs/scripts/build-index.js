// scripts/build-index.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const MiniSearch = require('minisearch');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_DIR = path.join(__dirname, '..', 'static');

// MiniSearch configurado para español e inglés
const miniSearch = new MiniSearch({
  fields: ['title', 'heading', 'text'],
  storeFields: ['title', 'heading', 'text', 'slug'],
  searchOptions: {
    boost: { title: 5, heading: 3, text: 1 },
    prefix: true,
    fuzzy: 0.2,
  },
});

let docId = 0;
const allChunks = [];

function extractChunks(filePath, content) {
  const { data, content: body } = matter(content);
  const title = data.title || path.basename(filePath, '.mdx');
  const slug = filePath
    .replace(DOCS_DIR, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '') || '/';

  // Divide el contenido por encabezados de nivel 2 (##)
  const sections = body.split(/^## /m).filter(Boolean);
  if (sections.length === 0) {
    // Si no hay encabezados, todo el contenido es un único fragmento
    allChunks.push({
      id: docId++,
      title,
      heading: title,
      text: body.replace(/\n/g, ' ').substring(0, 2000),
      slug,
    });
    return;
  }

  for (const section of sections) {
    const lines = section.split('\n');
    const heading = lines[0].trim();
    // Elimina la primera línea (el encabezado) y une el resto
    const text = lines
      .slice(1)
      .join(' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 2000);
    if (text.length < 20) continue; // ignora secciones muy cortas
    allChunks.push({
      id: docId++,
      title,
      heading,
      text,
      slug,
    });
  }
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
    allChunks.push({
      id: docId++,
      title: 'Tabla Maestra de Cifras Consolidadas (28-A)',
      heading: 'Datos Oficiales, Exportaciones Netas y Mix de Generación',
      text: `Datos críticos del colapso del 28-A:
- Demanda peninsular: ${data.sistema_operativo_1230.demanda_peninsular_espana.valor} MW. ${data.sistema_operativo_1230.demanda_peninsular_espana.contexto}
- Mix renovable: ${data.sistema_operativo_1230.mix_renovable_instantaneo.valor}%, fotovoltaica: ${data.sistema_operativo_1230.solar_fotovoltaica_pct.valor}%, nuclear: ${data.sistema_operativo_1230.nuclear_pct.valor}%, bombeo: ${data.sistema_operativo_1230.bombeo_activo.valor} MW.
- Intercambios internacionales (importaciones y exportaciones netas): España exportaba ${data.sistema_operativo_1230.exportacion_espana_francia.valor} MW a Francia, ${data.sistema_operativo_1230.exportacion_espana_portugal.valor} MW a Portugal y ${data.sistema_operativo_1230.exportacion_espana_marruecos.valor} MW a Marruecos.
- Inercia Ibérica: entre ${data.inercia.H_iberia_rango_min.valor} y ${data.inercia.H_iberia_rango_max.valor} segundos. Energía cinética total Iberia: ${data.inercia.Ek_iberia_total.valor} MWs.
- Pérdida de sincronismo: 12:33:21 CEST a ${data.cronologia_cascada.frecuencia_perdida_sincronismo.valor} Hz.
- HVDC INELFE: Mantuvo ${data.hvdc_inelfe.flujo_durante_cascada.valor} MW de exportación, operando en ${data.hvdc_inelfe.modo_operativo_durante_cascada.valor}.
- Tensión máxima en barras: >${data.potencias_cascada.tension_maxima_barras_colectoras.valor} kV.
- Pérdida de generación en la cascada: ${data.potencias_cascada.perdida_generacion_total_cascada.valor} MW.
- Desconexiones de demanda (SO): ${data.potencias_cascada.desconexiones_SO_total_comite.valor} MW.
- Coste de operación reforzada: ${data.impacto_economico.coste_operacion_reforzada_ree.valor} millones de euros.`,
      slug: '/docs/galeria-de-tablas', // Enlazamos a la galería de tablas
    });
  }
}

function buildIndex() {
  console.log('🔍 Construyendo índice de búsqueda para el chatbot...');
  walkDir(DOCS_DIR);
  injectMasterData();

  miniSearch.addAll(allChunks);

  // Guarda el índice serializado (MiniSearch) y los fragmentos
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
