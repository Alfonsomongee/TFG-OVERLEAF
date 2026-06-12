const fs = require('fs');

const files = [
  'src/components/annex/AnnexEvidenceGrid.jsx',
  'src/components/annex/AnnexEvidenceGrid.module.css',
];
files.forEach(f => {
  console.log('\n=== ' + f + ' ===');
  try { console.log(fs.readFileSync(f, 'utf8')); }
  catch(e) { console.log('NO EXISTE'); }
});

console.log('\n=== anexo-demanda-generacion-balance.mdx COMPLETO ===');
console.log(fs.readFileSync('docs/anexo-demanda-generacion-balance.mdx', 'utf8'));

console.log('\n=== AnnexEvidenceViewer.jsx COMPLETO ===');
console.log(fs.readFileSync('src/components/annex/AnnexEvidenceViewer.jsx', 'utf8'));
