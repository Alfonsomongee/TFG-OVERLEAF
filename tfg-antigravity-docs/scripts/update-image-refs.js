// scripts/update-image-refs.js
const fs = require('fs');
const path = require('path');

// Mapa de conversiones: nombre base → extensión original
const CONVERSIONS = [
  { name: 'blackout-bg',        oldExt: '.png' },
  { name: 'chatbot_boton',      oldExt: '.jpg' },
  { name: 'cinematic_blackout', oldExt: '.png' },
  { name: 'diaapagon',          oldExt: '.png' },
  { name: 'dianormal',          oldExt: '.jpg' },
  { name: 'europe-night-dark',  oldExt: '.jpg' },
  { name: 'europe-night-lit',   oldExt: '.jpg' },
  { name: 'ia',                 oldExt: '.png' },
  { name: 'iberian-illuminated',oldExt: '.png' },
  { name: 'iberian_satellite',  oldExt: '.png' },
  { name: 'logo',               oldExt: '.png' },
  { name: 'social-card',        oldExt: '.jpg' },
];

// Archivos/carpetas a actualizar
const TARGET_DIRS = ['./src', './docs', './i18n'];

// Archivos a EXCLUIR (se regeneran con build)
const EXCLUDE = [
  'static/chunks.json',
  'static/search-index.json',
];

const EXTS = ['.js', '.jsx', '.ts', '.tsx', '.mdx', '.md', '.css'];

function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) walk(fp, results);
    else if (EXTS.includes(path.extname(f).toLowerCase())) results.push(fp);
  });
  return results;
}

const allFiles = TARGET_DIRS.flatMap(d => walk(d));
let totalReplacements = 0;
let totalFiles = 0;
const report = [];

allFiles.forEach(fp => {
  const normalized = fp.replace(/\\/g, '/');
  if (EXCLUDE.some(ex => normalized.includes(ex))) return;

  let content = fs.readFileSync(fp, 'utf8');
  let modified = false;
  let fileReplacements = 0;

  CONVERSIONS.forEach(({ name, oldExt }) => {
    const oldRef = 'img/' + name + oldExt;
    const newRef = 'img/' + name + '.webp';
    if (content.includes(oldRef)) {
      const count = (content.match(new RegExp(oldRef.replace('.', '\\.'), 'g')) || []).length;
      content = content.split(oldRef).join(newRef);
      fileReplacements += count;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fp, content, 'utf8');
    totalReplacements += fileReplacements;
    totalFiles++;
    report.push(`  OK  (${fileReplacements}x)  ${fp.replace(process.cwd(), '')}`);
  }
});

console.log('\n════════════════════════════════════════════════════');
console.log('  ACTUALIZACIÓN DE REFERENCIAS DE IMÁGENES');
console.log('════════════════════════════════════════════════════');
report.forEach(l => console.log(l));
console.log('────────────────────────────────────────────────────');
console.log(`  Archivos modificados  : ${totalFiles}`);
console.log(`  Referencias actualizadas: ${totalReplacements}`);
console.log('════════════════════════════════════════════════════\n');
