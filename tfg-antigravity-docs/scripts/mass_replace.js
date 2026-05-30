const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const replacements = [
  ['2,14', '2,17'],
  ['2.14', '2.17'],
  ['2,64', '2,67'],
  ['2.64', '2.67'],
  ['84,5%', '82%'],
  ['84.5%', '82%'],
  ['sympathetic inrush', 'magnetizing inrush en red de bajo SCR'],
  ['exigido por el P.O. 13.1', 'exigido por la literatura técnica (Kundur, 1994)'],
  ['2.690 MW', '2.050 MW'],
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.mdx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      for (const [oldVal, newVal] of replacements) {
        if (content.includes(oldVal)) {
          content = content.split(oldVal).join(newVal);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walk(docsDir);
console.log("Done.");
