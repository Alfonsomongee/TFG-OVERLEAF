const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const outputFile = path.join(__dirname, 'TFG_TEXTO_COMPLETO.txt');

// Order of files based on sidebars.js
const files = [
  '01-introduccion.mdx',
  '02-contexto.mdx',
  '03-analisis-incidente.mdx',
  '04-reaccion-reposicion.mdx',
  '06-impacto-comunicativo.mdx',
  '05-analisis-informes.mdx',
  '07-resiliencia-futuro.mdx',
  '07b-consecuencias-financieras.mdx',
  '08-uso-ia.mdx',
  '08.5-actualizacion-2026.mdx',
  '09-resumen-de-cifras.mdx',
  '09-conclusiones.mdx',
  'dimension-europea/francia-portugal.mdx',
  'dimension-europea/coordinacion-continental.mdx',
  'dimension-europea/dia-despues.mdx',
  'glosario.mdx',
  'referencias.mdx',
  '11-cronologia.mdx',
  '14-galeria-graficas.mdx',
  '10-galeria-imagenes.mdx',
  '13-sobre-el-autor.mdx'
];

let output = '';

// Helper to replace markdown and JSX with readable text
function processContent(content, filename) {
  // Remove frontmatter
  let text = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  
  // Remove imports
  text = text.replace(/^import\s+.*?;\s*$/gm, '');

  // Replace <GlitchTitle>Title</GlitchTitle> -> Title
  text = text.replace(/<GlitchTitle>(.*?)<\/GlitchTitle>/g, '$1');

  // Replace <GlossaryLink term="...">word</GlossaryLink> -> word
  text = text.replace(/<GlossaryLink[^>]*>(.*?)<\/GlossaryLink>/g, '$1');

  // Replace standard markdown images ![Alt](path) -> [FOTO: Alt]
  text = text.replace(/!\[([^\]]*)\]\((.*?)\)/g, (match, alt) => {
    return `\n\n[FOTO: ${alt || 'Ilustración del apartado'}]\n\n`;
  });

  // Replace <Image img={require('...')} alt="..." /> -> [FOTO: alt]
  text = text.replace(/<Image[^>]*alt=["'](.*?)["'][^>]*\/>/g, (match, alt) => {
    return `\n\n[FOTO: ${alt}]\n\n`;
  });

  // Replace <ImageCompare ... leftLabel="..." rightLabel="..." /> -> [FOTO COMPARATIVA]
  text = text.replace(/<ImageCompare[^>]*leftLabel=["'](.*?)["'][^>]*rightLabel=["'](.*?)["'][^>]*\/>/g, (match, left, right) => {
    return `\n\n[FOTO: Comparativa interactiva entre "${left}" y "${right}"]\n\n`;
  });

  // Remove generic HTML/JSX tags but keep their inner text if they wrap text
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/g, '$1');
  text = text.replace(/<em[^>]*>(.*?)<\/em>/g, '$1');
  text = text.replace(/<span[^>]*>(.*?)<\/span>/g, '$1');
  
  // Replace <ForensicTable ... title="..."> -> [TABLA: title]
  text = text.replace(/<ForensicTable[^>]*title=["'](.*?)["'][^>]*>/g, '\n[TABLA: $1]\n');
  text = text.replace(/<\/ForensicTable>/g, '');

  // Replace other components broadly
  text = text.replace(/<Bloque[0-9a-zA-Z]+ \/>/g, '\n[VISUALIZACIÓN INTERACTIVA DE DATOS DE ESTE APARTADO]\n');

  // Specific handling for galleries if needed (they use JSON data)
  if (filename === '10-galeria-imagenes.mdx') {
    text += '\n\n[NOTA: Esta sección contiene una galería de imágenes interactiva generada desde src/data/imageGalleryData.js]\n';
  }
  if (filename === '11-cronologia.mdx') {
    text += '\n\n[NOTA: Esta sección contiene una línea temporal interactiva generada desde src/data/timelineEvents.js]\n';
  }
  if (filename === '14-galeria-graficas.mdx') {
    text += '\n\n[NOTA: Esta sección contiene una galería de gráficas generada desde src/data/graphicsGalleryData.js]\n';
  }

  // Remove :::note, :::warning, etc but keep the text
  text = text.replace(/:::(note|warning|danger|info|tip)(.*)/g, '\n[NOTA/AVISO: $2]\n');
  text = text.replace(/:::/g, '');

  return text.trim();
}

files.forEach(file => {
  const filePath = path.join(docsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    output += `\n\n=================================================================\n`;
    output += `CAPÍTULO: ${file.toUpperCase()}\n`;
    output += `=================================================================\n\n`;
    output += processContent(content, file);
  }
});

// Extra: Read the glossary JSON to append the glossary terms properly
try {
  const glossaryPath = path.join(__dirname, 'src', 'data', 'glossary.js');
  if (fs.existsSync(glossaryPath)) {
    const glossaryContent = fs.readFileSync(glossaryPath, 'utf-8');
    output += `\n\n=================================================================\n`;
    output += `DATOS ADICIONALES: TÉRMINOS DEL GLOSARIO (src/data/glossary.js)\n`;
    output += `=================================================================\n\n`;
    output += glossaryContent;
  }
} catch(e) {}

// Extra: Read timeline events
try {
  const timelinePath = path.join(__dirname, 'src', 'data', 'timelineEvents.js');
  if (fs.existsSync(timelinePath)) {
    const content = fs.readFileSync(timelinePath, 'utf-8');
    output += `\n\n=================================================================\n`;
    output += `DATOS ADICIONALES: EVENTOS DE LA CRONOLOGÍA (src/data/timelineEvents.js)\n`;
    output += `=================================================================\n\n`;
    output += content;
  }
} catch(e) {}

// Extra: Read image gallery data
try {
  const galleryPath = path.join(__dirname, 'src', 'data', 'imageGalleryData.js');
  if (fs.existsSync(galleryPath)) {
    const content = fs.readFileSync(galleryPath, 'utf-8');
    output += `\n\n=================================================================\n`;
    output += `DATOS ADICIONALES: TEXTOS DE LA GALERÍA DE IMÁGENES (src/data/imageGalleryData.js)\n`;
    output += `=================================================================\n\n`;
    output += content;
  }
} catch(e) {}

fs.writeFileSync(outputFile, output);
console.log('File written to ' + outputFile);
