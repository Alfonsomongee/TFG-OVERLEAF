const fs = require('fs');

// ANEXO B — Tablas forenses (chunks.json artifacts type=table)
const chunks = JSON.parse(fs.readFileSync('./static/chunks.json','utf8'));
const tables = Object.values(chunks).filter(c => c.artifact?.type === 'table');
console.log('=== ANEXO B: TABLAS FORENSES (' + tables.length + ') ===');
tables.forEach(c => {
  console.log('ID: ' + c.artifact.id);
  console.log('TITLE: ' + c.artifact.title);
  console.log('DESC: ' + (c.artifact.description||'').substring(0,120));
  console.log('---');
});

// ANEXO C — Simuladores interactivos (chunks.json artifacts type=interactive)
const interactives = Object.values(chunks).filter(c => c.artifact?.type === 'interactive');
console.log('=== ANEXO C: SIMULADORES (' + interactives.length + ') ===');
interactives.forEach(c => {
  console.log('ID: ' + c.artifact.id);
  console.log('TITLE: ' + c.artifact.title);
  console.log('DESC: ' + (c.artifact.description||'').substring(0,120));
  console.log('---');
});

// ANEXO D — Imágenes PNG estáticas (chunks.json artifacts type=image)
const images = Object.values(chunks).filter(c => c.artifact?.type === 'image');
console.log('=== ANEXO D: GRÁFICAS PNG (' + images.length + ') ===');
images.forEach(c => {
  console.log('ID: ' + c.artifact.id);
  console.log('TITLE: ' + c.artifact.title);
  console.log('DESC: ' + (c.artifact.description||'').substring(0,120));
  console.log('---');
});
