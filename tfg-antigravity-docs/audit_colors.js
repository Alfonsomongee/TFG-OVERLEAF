const fs = require('fs');
const path = require('path');
function walkDir(dir, ext) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fpath = path.join(dir, file);
    const stat = fs.statSync(fpath);
    if (stat && stat.isDirectory()) {
      if(!fpath.includes('node_modules')) results = results.concat(walkDir(fpath, ext));
    } else {
      if(fpath.endsWith(ext)) results.push(fpath);
    }
  });
  return results;
}

const jsxs = walkDir('src/components', '.jsx');

console.log('=== 1. Todos los colores de texto hardcoded ===');
const colors = {};
jsxs.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /(?:color|fill|background|stroke)[\s=:]+['"]?(#[0-9a-fA-F]{3,6}|hsl\([^)]+\))['"]?/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if(!match[0].includes('//')) {
      const color = match[1].toLowerCase();
      colors[color] = (colors[color] || 0) + 1;
    }
  }
});
const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 60);
sorted.forEach(([k, v]) => console.log(v + ' ' + k));

console.log('\n=== 2. Colores hardcoded que NO usan variables CSS ===');
jsxs.forEach(f => {
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((l, i) => {
    if(l.match(/(?:color|fill|stroke|background)[\s=:]+['"]?#[0-9a-fA-F]{3,6}['"]?/i) && !l.includes('//')) {
      console.log(f + ':' + (i+1) + ': ' + l.trim());
    }
  });
});

console.log('\n=== 5. Colores hardcoded en componentes afectados ===');
['src/components/ForensicReveal.jsx', 'src/components/ForensicUI/Primitives.jsx', 'src/components/CuestionAbierta/index.jsx', 'src/components/GlossaryDefinitionPanel.jsx', 'src/components/CollapseSismograph.module.css'].forEach(f => {
  console.log('--- ' + f + ' ---');
  if(fs.existsSync(f)) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    let count = 0;
    lines.forEach((l, i) => {
      if(count < 25 && l.match(/(color|background|fill|stroke|#[0-9a-fA-F]{3,6})/i)) {
        console.log((i+1) + ': ' + l.trim());
        count++;
      }
    });
  } else {
    console.log('No existe.');
  }
});
