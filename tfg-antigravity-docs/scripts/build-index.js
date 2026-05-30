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

function buildIndex() {
  console.log('🔍 Construyendo índice de búsqueda para el chatbot...');
  walkDir(DOCS_DIR);

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
