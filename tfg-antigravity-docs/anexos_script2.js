const fs = require('fs');
// Intentar leer forensicCharts.js como texto para extraer ids y títulos
const code = fs.readFileSync('./src/data/forensicCharts.js','utf8');
const idMatches = [...code.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const titleMatches = [...code.matchAll(/title:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const descMatches = [...code.matchAll(/desc:\s*`([\s\S]{0,120})/g)].map(m => m[1].replace(/\n/g, ' '));
console.log('=== ANEXO ENTSO-E: GRÁFICAS INTERACTIVAS (' + idMatches.length + ') ===');
// Solo printear los del tipo chart (no categorias)
const chartIds = idMatches.filter(id => id.startsWith('chart-'));
chartIds.forEach((id, i) => {
  console.log('ID: ' + id);
  console.log('TITLE: ' + (titleMatches[i+5]||'')); // Offset for category titles
  console.log('DESC: ' + (descMatches[i]||'').substring(0,120));
  console.log('---');
});

// Ver también si tienen URL o anchor propios
const urlMatches = [...code.matchAll(/url:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const anchorMatches = [...code.matchAll(/anchor:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
if(urlMatches.length) { console.log('URLS:', urlMatches.slice(0,3)); }
if(anchorMatches.length) { console.log('ANCHORS:', anchorMatches.slice(0,3)); }
