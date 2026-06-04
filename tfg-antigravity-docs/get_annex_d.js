const fs = require('fs');
const chunks = JSON.parse(fs.readFileSync('./static/chunks.json','utf8'));
const all = Object.values(chunks);
const annexD = all.filter(c => c.artifact && c.artifact.source === 'annex_d');

// Remove duplicates based on artifact.id
const unique = [];
const seen = new Set();
annexD.forEach(c => {
  if (!seen.has(c.artifact.id)) {
    seen.add(c.artifact.id);
    unique.push(c);
  }
});

let out = '=== GRÁFICAS DEL ANEXO D (annex_d) ===\n\n';
unique.forEach((c, i) => {
  out += `${i + 1}. ID: ${c.artifact.id}\n`;
  out += `   TÍTULO: ${c.artifact.title}\n`;
  if (c.artifact.description) out += `   DESCRIPCIÓN: ${c.artifact.description}\n`;
  out += '\n';
});
out += `Total: ${unique.length}\n`;

fs.writeFileSync('annex_d_list.txt', out);
console.log('File written to annex_d_list.txt');
