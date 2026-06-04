const fs = require('fs');

// 1. Ver cuántas veces se llama buildVisualArtifacts y con qué maxItems
const code = fs.readFileSync('./api/chat.js','utf8');
const matches = [...code.matchAll(/buildVisualArtifacts\([^)]+\)/g)];
console.log('=== LLAMADAS buildVisualArtifacts ===');
matches.forEach(m => console.log(m[0]));

// 2. Ver el fix del caption en ChatFullscreen
const jsx = fs.readFileSync('./src/components/ChatFullscreen.jsx','utf8');
const capStart = jsx.indexOf('Leyenda / Fuente');
console.log('\n=== BLOQUE LEYENDA/FUENTE ===');
console.log(jsx.substring(capStart, capStart + 400));

// 3. Simular scoring para pregunta de inercia y ver qué sale
const MiniSearch = require('minisearch');
const indexRaw = fs.readFileSync('./static/search-index.json','utf8');
const chunks = JSON.parse(fs.readFileSync('./static/chunks.json','utf8'));
const searcher = MiniSearch.loadJSON(indexRaw, {
  fields: ['title','heading','subheading','text','keywordsText'],
  storeFields: ['title','heading','subheading','text','slug','anchor',
    'chunkType','keywords','keywordsText','chapterOrder','sourceFile','artifact']
});
const results = searcher.search('inercia 28A', {prefix:true, fuzzy: t=>t.length>4?1:0});
const withArtifact = results.filter(r => chunks[r.id]?.artifact);
console.log('\n=== TOP 6 ARTIFACTS (antes de scoring) ===');
withArtifact.slice(0,6).forEach(r => {
  const a = chunks[r.id].artifact;
  console.log(r.score.toFixed(2) + ' | ' + a.source + ' | ' + a.type + ':' + a.id);
});
