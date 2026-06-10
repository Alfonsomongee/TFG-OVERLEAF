const fs = require('fs');

// Ver los anchors reales que existen en los archivos afectados
const filesToCheck = [
  'docs/anexo-demanda-generacion-balance.mdx',
  'docs/anexo-estabilidad-dinamica-tension.mdx',
  'docs/anexo-cascada-protecciones-desconexiones.mdx',
];

filesToCheck.forEach(mdxPath => {
  console.log('\n=== ' + mdxPath + ' ===');
  try {
    const content = fs.readFileSync(mdxPath, 'utf8');
    const anchors = [];
    let m;
    const regexId = /id=["']([^"']+)["']/g;
    const regexHash = /\{#([^}]+)\}/g;
    while ((m = regexId.exec(content)) !== null) anchors.push('id: ' + m[1]);
    while ((m = regexHash.exec(content)) !== null) anchors.push('{#}: ' + m[1]);
    if (anchors.length === 0) console.log('  (sin anchors explícitos)');
    else anchors.forEach(a => console.log('  ' + a));
  } catch (e) {
    console.log('  ERROR: ' + e.message);
  }
});

// Mostrar lo que espera el metadata
const figures = JSON.parse(fs.readFileSync('static/data/annex-figures-metadata.json', 'utf8'));
console.log('\n=== IDs en annex-figures-metadata.json ===');
figures.forEach(f => console.log('  id: ' + f.id + '  url: ' + f.url));
