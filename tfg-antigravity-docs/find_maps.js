const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fpath = path.join(dir, file);
    const stat = fs.statSync(fpath);
    if (stat && stat.isDirectory()) {
      if(!fpath.includes('node_modules') && !fpath.includes('.git') && !fpath.includes('.docusaurus')) {
        results = results.concat(walkDir(fpath));
      }
    } else {
      results.push(fpath);
    }
  });
  return results;
}

console.log('=== 1. BlackoutPropagationMap ===');
const components = walkDir('src/components');
components.filter(f => f.includes('BlackoutPropagationMap')).forEach(f => {
  console.log('--- ' + f + ' ---');
  console.log(fs.readFileSync(f, 'utf8'));
});

console.log('\n=== 2, 3 & 4. Map Images ===');
const allFiles = walkDir('.');
const images = allFiles.filter(f => f.endsWith('.png') || f.endsWith('.svg') || f.endsWith('.jpg') || f.endsWith('.webp'));
const mapImages = images.filter(f => {
  const lower = f.toLowerCase();
  return lower.includes('spain') || lower.includes('espana') || lower.includes('iberia') || lower.includes('peninsula') || lower.includes('map');
});

mapImages.slice(0, 30).forEach(f => console.log(f));
