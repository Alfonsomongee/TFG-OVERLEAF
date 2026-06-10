// scripts/inspect-old-annexes.js
const fs = require('fs');

const OLD_FILES = [
  'docs/anexo-tablas.mdx',
  'docs/anexo-figuras.mdx', 
  'docs/anexo-interactivos.mdx',
  'docs/anexo-entsoe.mdx'
];

OLD_FILES.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log(`\n${'='.repeat(60)}`);
  console.log(`ARCHIVO: ${f} (${lines.length} líneas)`);
  console.log('PRIMERAS 40 LÍNEAS:');
  lines.slice(0, 40).forEach((l, i) => console.log(`  ${i+1}: ${l}`));
  
  // Qué componentes renderiza
  const components = [...new Set(
    lines.filter(l => l.match(/<[A-Z][A-Za-z]+/))
         .map(l => l.match(/<([A-Z][A-Za-z]+)/)?.[1])
         .filter(Boolean)
  )];
  console.log('\nCOMPONENTES QUE RENDERIZA:', components.join(', '));
  
  // Qué anchors tiene
  const anchors = lines
    .filter(l => l.includes('id='))
    .map(l => l.match(/id=["']([^"']+)["']/)?.[1])
    .filter(Boolean);
  console.log('ANCHORS DEFINIDOS:', anchors.join(', ') || 'ninguno');
});

console.log(`\n${'='.repeat(60)}`);
console.log('INTERACTIVOS EN AnnexConceptIndex.jsx:');
try {
  const content = fs.readFileSync('src/components/annex/AnnexConceptIndex.jsx', 'utf8');
  const lines = content.split('\n');
  const interactivos = lines.filter(l => l.includes("type: 'Interactivo'"));
  interactivos.forEach(l => console.log('  ' + l.trim().substring(0, 150)));
} catch (e) {
  console.log('  Error leyendo AnnexConceptIndex.jsx:', e.message);
}
