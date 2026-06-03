const fs = require('fs');
const path = require('path');
const dir = './i18n/zh-Hans/docusaurus-plugin-content-docs/current';

function walk(d) {
  const results = [];
  fs.readdirSync(d, {withFileTypes: true}).forEach(f => {
    if (f.isDirectory()) results.push(...walk(path.join(d, f.name)));
    else if (f.name.endsWith('.mdx')) results.push(path.join(d, f.name));
  });
  return results;
}

const files = walk(dir);
let totalFixes = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let fileFixed = 0;
  
  const fixed = lines.map((line, i) => {
    if (/<\d/.test(line) && 
        !line.trim().startsWith('<') && 
        !line.includes('import') && 
        !line.includes('export')) {
      const newLine = line.replace(/<(\d)/g, '&lt;$1');
      if (newLine !== line) {
        fileFixed++;
        console.log('Fixed:', f.replace(dir,''), 'L'+(i+1));
      }
      return newLine;
    }
    return line;
  });
  
  if (fileFixed > 0) {
    fs.writeFileSync(f, fixed.join('\n'), 'utf8');
    totalFixes += fileFixed;
  }
});

console.log('Total fixes:', totalFixes);
