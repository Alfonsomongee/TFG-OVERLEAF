const fs = require('fs');

const code = fs.readFileSync('./src/data/forensicCharts.js', 'utf8');

// Match each chart object roughly by its id, title, and desc
const matches = [...code.matchAll(/id:\s*['"](chart-\d+)['"][\s\S]*?title:\s*['"]([^'"]+)['"][\s\S]*?desc:\s*`([\s\S]*?)`/g)];

let out = '=== LAS 23 GRÁFICAS DEL ANEXO D (ENTSO-E / ESIOS) ===\n\n';
matches.forEach((m, i) => {
  out += `${i+1}. ID: ${m[1]}\n`;
  out += `   TÍTULO: ${m[2]}\n`;
  // Tomamos solo el primer párrafo o primeros 200 caracteres de la descripción
  const desc = m[3].trim().split('\n')[0].substring(0, 300);
  out += `   DESCRIPCIÓN (resumen): ${desc}...\n\n`;
});
out += `Total: ${matches.length}\n`;

fs.writeFileSync('23_charts.txt', out);
console.log('Done');
