const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\GALERIAFORENSE\\DESCRIPCIONGRAPHICS.txt', 'utf8');
const sections = content.split(/────────────────────────────────────────────────────────────────\r?\n/).filter(s => s.trim().startsWith('ESIOS-') || s.trim().startsWith('ENTSO-'));
console.log(sections[0].substring(0, 300));
console.log('Regex test:', sections[0].match(/\[TÍTULO\]\s+([\s\S]*?)\s+\[FUENTE\]/));
