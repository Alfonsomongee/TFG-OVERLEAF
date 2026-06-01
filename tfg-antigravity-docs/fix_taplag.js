const fs = require('fs');

let content = fs.readFileSync('src/components/TapLagSequence.jsx', 'utf8');

// 1. Duración de la animación ANSI 59
content = content.replace(/dur="0\.35s"/g, 'dur="0.75s"');

// 2. Alturas de las barras (escala 90 para que 1.13 encaje en 110px)
content = content.replace(/const bar400H = Math.round\(step\.v400 \* 110\);/g, 'const bar400H = Math.round(step.v400 * 90);');
content = content.replace(/const bar220H = Math.round\(step\.v220 \* 110\);/g, 'const bar220H = Math.round(step.v220 * 90);');

// 3. Etiquetas de los gauges (evitar overlap)
content = content.replace(/\[0\.9, 1\.0, 1\.05, 1\.1\]/g, '[0.9, 1.1]');

// 4. Escala de los gauges y línea ANSI
content = content.replace(/Math\.round\(v \* 100\)/g, 'Math.round(v * 90)');
content = content.replace(/Math\.round\(1\.10 \* 100\)/g, 'Math.round(1.10 * 90)');

// 5. Ajustar un poco el font size a 11 para que sea más elegante
content = content.replace(/fontSize="13" fontFamily="monospace">\{v\.toFixed\(2\)\}/g, 'fontSize="11" fontFamily="monospace">{v.toFixed(2)}');
content = content.replace(/fontSize="13" fontFamily="monospace" textAnchor="end">\s*\{v\.toFixed\(2\)\}/g, 'fontSize="11" fontFamily="monospace" textAnchor="end">\n              {v.toFixed(2)}');

fs.writeFileSync('src/components/TapLagSequence.jsx', content);
console.log("TapLagSequence.jsx corregido.");
