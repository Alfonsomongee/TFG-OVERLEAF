// Simular lo que hace buildVisualArtifacts
const fs = require('fs');
const path = require('path');
const MiniSearch = require('minisearch');

const indexRaw = fs.readFileSync('./static/search-index.json','utf8');
const chunks = JSON.parse(fs.readFileSync('./static/chunks.json','utf8'));
const searcher = MiniSearch.loadJSON(indexRaw, {
  fields: ['title','heading','subheading','text','keywordsText'],
  storeFields: ['title','heading','subheading','text','slug','anchor','chunkType','keywords','keywordsText','chapterOrder','sourceFile','artifact']
});

const results = searcher.search('inercia 28A', {prefix:true, fuzzy: t => t.length>4?1:0});
const withArtifact = results.filter(r => chunks[r.id]?.artifact).slice(0,8);

console.log('=== ARTIFACTS EN selectedPairs ===');
withArtifact.forEach(r => {
  const a = chunks[r.id].artifact;
  console.log(a.type + ':' + a.id + ' | score=' + r.score.toFixed(2) + ' | ' + (a.title ? a.title.substring(0,60) : ''));
});

// Ver si hay IDs duplicados
const ids = withArtifact.map(r => chunks[r.id].artifact.id);
const dupes = ids.filter((id,i) => ids.indexOf(id) !== i);
console.log('=== IDs DUPLICADOS ===', dupes.length ? dupes : 'ninguno');
