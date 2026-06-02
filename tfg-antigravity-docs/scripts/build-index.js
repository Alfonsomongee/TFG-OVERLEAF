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

  // Eliminar imports de React/Docusaurus
  let cleanBody = body
    .replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/^import\s+\{[^}]+\}\s+from\s+['"].*?['"];?\s*$/gm, '')
    // Eliminar tags JSX de componentes (líneas que son solo <Componente ... />)
    .replace(/^<[A-Z][^>]*\/>\s*$/gm, '')
    .replace(/^<[A-Z][^>]*>\s*$/gm, '')
    .replace(/^<\/[A-Z][^>]*>\s*$/gm, '')
    // Eliminar bloques de frontmatter que se cuelen
    .replace(/^---[\s\S]*?---/m, '')
    // Eliminar directivas de admonition
    .replace(/^:::[a-z]+.*$/gm, '')
    .replace(/^:::$/gm, '')
    // Limpiar líneas vacías múltiples
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const title = data.title || path.basename(filePath, '.mdx');
  const slug = filePath
    .replace(DOCS_DIR, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '') || '/';

  // Divide el contenido por encabezados de nivel 2 (##)
  const sections = cleanBody.split(/^## /m).filter(Boolean);
  if (sections.length === 0) {
    // Si no hay encabezados, todo el contenido es un único fragmento
    allChunks.push({
      id: docId++,
      title,
      heading: title,
      text: cleanBody.replace(/\n/g, ' ').substring(0, 2000),
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
- Demanda peninsular: ${data.demanda.peninsular_MW} MW. ${data.demanda.descripcion}
- Mix renovable: ${data.mix_generacion.renovable_total_porcentaje}%, fotovoltaica: ${data.mix_generacion.fotovoltaica_porcentaje}%, nuclear: ${data.mix_generacion.nuclear_porcentaje}%, bombeo: ${data.mix_generacion.bombeo_activo_MW} MW.
- Intercambios internacionales (importaciones y exportaciones netas): España exportaba ${data.intercambios_internacionales.exportacion_francia_MW} MW a Francia, ${data.intercambios_internacionales.exportacion_portugal_MW} MW a Portugal y ${data.intercambios_internacionales.exportacion_marruecos_MW} MW a Marruecos. ${data.intercambios_internacionales.descripcion}
- Inercia Ibérica: entre ${data.inercia_y_estabilidad.inercia_iberia_s} segundos. Energía cinética: ${data.inercia_y_estabilidad.energia_cinetica_total_iberia_MWs} MWs.
- Frecuencia de pérdida de sincronismo: ${data.inercia_y_estabilidad.frecuencia_perdida_sincronismo_Hz} Hz. RoCoF pico: ${data.inercia_y_estabilidad.rocof_maximo_Hz_s} Hz/s.
- Tensión máxima en barras: >${data.colapso_y_reposicion.tension_maxima_barras_colectoras_kV} kV.
- Pérdida de generación en la cascada: ${data.colapso_y_reposicion.perdida_generacion_cascada_MW} MW.
- Desconexiones de demanda (SO): ${data.colapso_y_reposicion.desconexiones_SO_MW} MW.
- Coste de operación reforzada: ${data.colapso_y_reposicion.coste_operacion_reforzada_M_eur} millones de euros.`,
      slug: '/anexo-tablas', // Enlazamos a la galería de tablas
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
