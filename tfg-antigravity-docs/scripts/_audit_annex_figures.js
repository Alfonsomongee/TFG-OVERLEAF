const fs = require('fs');

// 1. Cargar las figuras de anexos indexadas
const metadataPath = 'static/data/annex-figures-metadata.json';
if (!fs.existsSync(metadataPath)) {
  console.log('ERROR: annex-figures-metadata.json no existe. La Fase 3 no se completó.');
  process.exit(1);
}
const figures = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
console.log(`Total figuras indexadas: ${figures.length}`);

// 2. Para cada figura, verificar que el anchor existe en el .mdx real
const anchorsNotFound = [];
const fileCache = {};

figures.forEach(fig => {
  if (!fig.url) return;
  const [route, anchor] = fig.url.split('#');
  if (!anchor) return;

  const mdxName = route.replace(/^\//, '') + '.mdx';
  const mdxPath = 'docs/' + mdxName;

  if (!fileCache[mdxPath]) {
    try {
      fileCache[mdxPath] = fs.readFileSync(mdxPath, 'utf8');
    } catch (e) {
      fileCache[mdxPath] = null;
    }
  }

  const content = fileCache[mdxPath];
  if (!content) {
    anchorsNotFound.push({ id: fig.id, url: fig.url, reason: 'archivo no encontrado: ' + mdxPath });
    return;
  }

  const hasAnchor =
    content.includes(`id="${anchor}"`) ||
    content.includes(`{#${anchor}}`) ||
    content.includes(`id='${anchor}'`);

  if (!hasAnchor) {
    anchorsNotFound.push({ id: fig.id, url: fig.url, reason: 'anchor no encontrado en el .mdx' });
  }
});

console.log(`\nAnchors verificados OK: ${figures.length - anchorsNotFound.length}`);
console.log(`Anchors NO encontrados: ${anchorsNotFound.length}`);
if (anchorsNotFound.length > 0) {
  console.log('\n=== FIGURAS SIN ANCHOR REAL ===');
  anchorsNotFound.forEach(f => console.log(`  ${f.id} -> ${f.url} (${f.reason})`));
}

// 3. Verificar colisiones con galeriaforensedefinitiva.json
let galeriaPath = 'src/data/galeriaforensedefinitiva.json';
if (!fs.existsSync(galeriaPath)) galeriaPath = 'galeriaforensedefinitiva.json';

const galeria = JSON.parse(fs.readFileSync(galeriaPath, 'utf8'));
const existingIds = new Set();

if (galeria.categories) {
  galeria.categories.forEach(cat => {
    if (cat.tables) cat.tables.forEach(t => existingIds.add(t.id));
  });
}
if (galeria.chapters) {
  galeria.chapters.forEach(ch => {
    if (ch.images) ch.images.forEach(img => existingIds.add(img.id));
  });
}

const collisions = figures.filter(f => existingIds.has(f.id));
console.log(`\nColisiones de ID con galeria existente: ${collisions.length}`);
if (collisions.length > 0) {
  collisions.forEach(c => console.log(`  COLISION: ${c.id}`));
}
