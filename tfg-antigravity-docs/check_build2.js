const fs = require('fs');
const code = fs.readFileSync('./scripts/build-index.js','utf8');
// Buscar donde se procesan los artifacts/annexos
const markers = [
  'annex_b', 'annex_c', 'annex_d', 'artifact',
  'ANNEX', 'forensic', 'addDoc', 'miniSearch.add'
];
markers.forEach(m => {
  const idx = code.indexOf(m);
  if (idx > 0) console.log(m + ': línea ~' + code.substring(0,idx).split('\n').length);
});
// Mostrar desde línea 80 hasta el final
const lines = code.split('\n');
console.log('\n=== LÍNEAS 80 AL FINAL ===');
console.log(lines.slice(80).join('\n'));
