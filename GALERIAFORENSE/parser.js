const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\GALERIAFORENSE\\DESCRIPCIONGRAPHICS.txt', 'utf8');

// Find all matches of ESIOS-XX or ENTSO-XX headers
const regex = /(ESIOS-\d+|ENTSO-\d+)\s*\|\s*([^\n\r]+)[\s\S]*?\[TÍTULO\]\s+([\s\S]*?)\[FUENTE\]\s+([\s\S]*?)\[DESCRIPCIÓN\]\s+([\s\S]*?)\[RELEVANCIA FORENSE\]\s+([\s\S]*?)(?=(?:────────────────────────────────────────────────────────────────|$))/g;

const parsed = [];
let match;
while ((match = regex.exec(content)) !== null) {
  parsed.push({
    id: match[1].trim(),
    header: match[0].split('\n')[0].trim(),
    title: match[3].trim(),
    source: match[4].trim(),
    desc: match[5].trim(),
    rel: match[6].trim()
  });
}

fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\GALERIAFORENSE\\parsed_desc.json', JSON.stringify(parsed, null, 2));
console.log('Parsed descriptions to parsed_desc.json. Found ' + parsed.length + ' sections.');
