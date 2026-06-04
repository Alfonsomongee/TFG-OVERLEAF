const fs = require('fs');

const code = fs.readFileSync('./src/data/forensicCharts.js', 'utf8');

// forensicCharts.js uses ES modules (export const forensicCharts = ...), so we parse it or eval it correctly.
// Let's just use regex to extract titles and descriptions
const matches = [...code.matchAll(/id:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"][\s\S]*?description:\s*['"]([^'"]+)['"]/g)];

let out = '';
matches.forEach((m, i) => {
  out += `${i+1}. ID: ${m[1]}\n`;
  out += `   TÍTULO: ${m[2]}\n`;
  out += `   DESCRIPCIÓN: ${m[3]}\n\n`;
});
out += `Total: ${matches.length}\n`;

fs.writeFileSync('forensic_charts_list.txt', out);
console.log('Total charts found:', matches.length);
