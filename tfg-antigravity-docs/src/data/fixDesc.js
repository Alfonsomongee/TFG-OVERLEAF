const fs = require('fs');
let content = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts_fr.js', 'utf8');

let parts = content.split("id: 'chart-");

for (let i = 1; i < parts.length; i++) {
  let part = parts[i];
  
  let descFrMatch = part.match(/desc_fr:\s*(`[\s\S]*?`),\s*rel_fr/);
  let relFrMatch = part.match(/rel_fr:\s*(`[\s\S]*?`),\s*desc_it/);
  
  if (descFrMatch && relFrMatch) {
    let descFr = descFrMatch[1];
    let relFr = relFrMatch[1];
    
    part = part.replace(/desc:\s*`[\s\S]*?`,\s*rel:/, 'desc: ' + descFr + ',\n    rel:');
    part = part.replace(/rel:\s*`[\s\S]*?`,\s*desc_en:/, 'rel: ' + relFr + ',\n    desc_en:');
    
    parts[i] = part;
  }
}

content = parts.join("id: 'chart-");
fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts_fr.js', content);
console.log('Done!');
