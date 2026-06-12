const fs = require('fs');
const path = require('path');
const docsDir = path.join(__dirname, 'docs');

const annexFiles = [
  'anexo-demanda-generacion-balance.mdx',
  'anexo-estabilidad-dinamica-tension.mdx',
  'anexo-cascada-protecciones-desconexiones.mdx',
  'anexo-interconexiones-flujos.mdx',
  'anexo-mercado-costes.mdx',
  'anexo-reposicion-blackstart.mdx',
  'anexo-impacto-resiliencia.mdx',
  'anexo-comunicacion-fuentes.mdx',
  'anexo-metodologia-modelos-datos-vivos.mdx',
  'anexo-ecuaciones-matematicas.mdx',
];

// Step 1: Remove all existing AnnexSection tags (both the tags and any wrapping whitespace)
for (const filename of annexFiles) {
  const filePath = path.join(docsDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove opening AnnexSection tags  
  content = content.replace(/<AnnexSection[^>]*>/g, '');
  // Remove closing AnnexSection tags
  content = content.replace(/<\/AnnexSection>/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned: ${filename}`);
}

console.log('\nAll AnnexSection tags removed. Ready for re-injection.');
