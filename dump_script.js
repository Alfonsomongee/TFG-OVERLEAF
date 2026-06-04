const fs = require('fs');

let out = '';

// ANEXO B — Tablas forenses
const chunks = JSON.parse(fs.readFileSync('./tfg-antigravity-docs/static/chunks.json','utf8'));
const tables = Object.values(chunks).filter(c => c.artifact?.type === 'table');
out += '=== ANEXO B: TABLAS FORENSES (' + tables.length + ') ===\n';
tables.forEach(c => {
  out += 'ID: ' + c.artifact.id + '\n';
  out += 'TITLE: ' + c.artifact.title + '\n';
  out += 'DESC: ' + (c.artifact.description||'').substring(0,120) + '\n';
  out += '---\n';
});
out += '\n';

// ANEXO C — Simuladores interactivos
const interactives = Object.values(chunks).filter(c => c.artifact?.type === 'interactive');
out += '=== ANEXO C: SIMULADORES (' + interactives.length + ') ===\n';
interactives.forEach(c => {
  out += 'ID: ' + c.artifact.id + '\n';
  out += 'TITLE: ' + c.artifact.title + '\n';
  out += 'DESC: ' + (c.artifact.description||'').substring(0,120) + '\n';
  out += '---\n';
});
out += '\n';

// ANEXO D — Imágenes PNG estáticas
const images = Object.values(chunks).filter(c => c.artifact?.type === 'image');
out += '=== ANEXO D: GRÁFICAS PNG (' + images.length + ') ===\n';
images.forEach(c => {
  out += 'ID: ' + c.artifact.id + '\n';
  out += 'TITLE: ' + c.artifact.title + '\n';
  out += 'DESC: ' + (c.artifact.description||'').substring(0,120) + '\n';
  out += '---\n';
});
out += '\n';

// ANEXO ENTSO-E
const code = fs.readFileSync('./tfg-antigravity-docs/src/data/forensicCharts.js','utf8');
const idMatches = [...code.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
// Fix regex to strictly match "title: "
const titleMatches = [...code.matchAll(/^[ \t]*title:\s*['"]([^'"]+)['"]/gm)].map(m => m[1]);
const descMatches = [...code.matchAll(/desc:\s*`([\s\S]{0,120})/g)].map(m => m[1].replace(/\n/g, ' '));
out += '=== ANEXO ENTSO-E: GRÁFICAS INTERACTIVAS (' + idMatches.filter(id => id.startsWith('chart-')).length + ') ===\n';
const chartIds = idMatches.filter(id => id.startsWith('chart-'));
chartIds.forEach((id, i) => {
  out += 'ID: ' + id + '\n';
  out += 'TITLE: ' + (titleMatches[i]||'') + '\n';
  out += 'DESC: ' + (descMatches[i]||'').substring(0,120) + '\n';
  out += '---\n';
});
out += '\n';

fs.writeFileSync('C:/Users/aphmo/.gemini/antigravity/brain/6f7dcb74-ff90-4866-9ac4-f887ed913f22/anexos_dump.md', out);
console.log('Artifact updated!');
