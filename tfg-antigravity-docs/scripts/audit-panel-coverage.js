const fs = require('fs');
const chunks = JSON.parse(fs.readFileSync('static/chunks.json', 'utf8'));

const byType = {};
const bySource = {};
Object.values(chunks).forEach(c => {
  if (!c.artifact) return;
  const t = c.artifact.type || 'unknown';
  const s = c.artifact.source || 'unknown';
  byType[t] = (byType[t] || 0) + 1;
  bySource[s] = (bySource[s] || 0) + 1;
});

console.log('=== ARTIFACTS POR TIPO ===');
Object.entries(byType).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(` ${v} → ${k}`));
console.log('\n=== ARTIFACTS POR FUENTE ===');
Object.entries(bySource).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(` ${v} → ${k}`));
console.log('\nTOTAL artifacts indexados:', Object.values(byType).reduce((a,b)=>a+b,0));
