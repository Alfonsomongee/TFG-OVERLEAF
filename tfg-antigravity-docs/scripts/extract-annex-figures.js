const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const OUTPUT_FILE = path.join(__dirname, '..', 'static', 'data', 'annex-figures-metadata.json');

const annexMap = {
  'anexo-demanda-generacion-balance.mdx':         { id: 'annex-i', name: 'Demanda, Generación y Balance' },
  'anexo-estabilidad-dinamica-tension.mdx':       { id: 'annex-ii', name: 'Estabilidad, Frecuencia y Tensión' },
  'anexo-cascada-protecciones-desconexiones.mdx': { id: 'annex-iii', name: 'Cascada de Protecciones y Desconexiones' },
  'anexo-interconexiones-flujos.mdx':             { id: 'annex-iv', name: 'Interconexiones y Flujos de Potencia' },
  'anexo-mercado-costes.mdx':                     { id: 'annex-v', name: 'Mercado Eléctrico y Costes' },
  'anexo-reposicion-blackstart.mdx':              { id: 'annex-vi', name: 'Reposición y Blackstart' },
  'anexo-impacto-resiliencia.mdx':                { id: 'annex-vii', name: 'Impacto y Resiliencia' },
  'anexo-comunicacion-fuentes.mdx':               { id: 'annex-viii', name: 'Comunicación y Fuentes de Información' },
  'anexo-metodologia-modelos-datos-vivos.mdx':    { id: 'annex-ix', name: 'Metodología, Modelos y Datos Vivos' }
};

function extractKeywords(text) {
  if (!text) return [];
  const stopwords = new Set(['el','la','los','las','un','una','unos','unas','y','e','ni','o','u','pero','o','de','del','a','al','en','por','con','sin','para','se','su','sus','que','es','son','fue','ha','han','como','más','lo']);
  const words = text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
  return [...new Set(words)];
}

function extractFigures() {
  const figures = [];

  for (const [filename, annexInfo] of Object.entries(annexMap)) {
    const filePath = path.join(DOCS_DIR, filename);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, 'utf8');
    const slug = '/' + filename.replace('.mdx', '');

    // 1. Markdown Images: ![alt](path)
    const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let mdMatch;
    while ((mdMatch = mdRegex.exec(content)) !== null) {
      const alt = mdMatch[1].trim();
      const imgPath = mdMatch[2].trim();
      let id = imgPath.split('/').pop().split('.')[0].replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      if (!id) id = `fig-${figures.length + 1}`;
      
      figures.push({
        id,
        title: alt || 'Figura',
        description: alt || 'Figura en Anexo',
        source_file: filename,
        annex: annexInfo.id,
        annex_name: annexInfo.name,
        type: 'image',
        url: `${slug}#${id}`,
        path: imgPath,
        keywords: extractKeywords(alt)
      });
    }

    // 2. ThemedImage
    const themedRegex = /<ThemedImage\s+[^>]*alt=(["'])(.*?)\1[^>]*sources=\{[^}]*\}[^>]*\/>/g;
    let themedMatch;
    while ((themedMatch = themedRegex.exec(content)) !== null) {
      const alt = themedMatch[2].trim();
      const id = alt.replace(/[^a-z0-9-]/gi, '-').toLowerCase().substring(0, 40) || `themed-${figures.length + 1}`;
      figures.push({
        id,
        title: alt,
        description: alt,
        source_file: filename,
        annex: annexInfo.id,
        annex_name: annexInfo.name,
        type: 'image',
        url: `${slug}#${id}`,
        path: '',
        keywords: extractKeywords(alt)
      });
    }

    // 3. Any Custom React Component that is followed by a caption: *Figura X...*
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^<[A-Z][A-Za-z0-9]+\s*[^>]*\/?>$/)) {
        // It's a component tag. Let's see if next few lines have a caption
        for (let j = i + 1; j < i + 4 && j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine.startsWith('*Figura ') || nextLine.startsWith('_Figura ')) {
            const caption = nextLine.replace(/^[_*]+|[_*]+$/g, '').trim();
            const id = caption.replace(/[^a-z0-9-]/gi, '-').toLowerCase().substring(0, 40);
            figures.push({
              id,
              title: caption,
              description: caption,
              source_file: filename,
              annex: annexInfo.id,
              annex_name: annexInfo.name,
              type: 'interactive',
              url: `${slug}#${id}`,
              path: '',
              keywords: extractKeywords(caption)
            });
            break;
          }
        }
      }
    }
  }

  // Fallback: Read `galeriaforensedefinitiva.json` or `imageGalleryData.js` to check if I missed 100+?
  // Wait, the user said "los anexos I-IX tienen 120+ figuras. Haz un volcado de todos los elementos visuales que existen en los nueve anexos y que NO están en el JSON".
  // So the 120+ figures are ALREADY inside the files, just not in the `galeriaforensedefinitiva.json`.
  // Are they standard Markdown tables? Let's extract Markdown tables too!

  for (const [filename, annexInfo] of Object.entries(annexMap)) {
    const content = fs.readFileSync(path.join(DOCS_DIR, filename), 'utf8');
    const slug = '/' + filename.replace('.mdx', '');
    const lines = content.split('\n');

    let inTable = false;
    let tableLines = [];
    let tableCaption = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('*Tabla ') || line.startsWith('_Tabla ')) {
         tableCaption = line.replace(/^[_*]+|[_*]+$/g, '').trim();
      }

      if (line.startsWith('|') && line.endsWith('|')) {
        inTable = true;
        tableLines.push(line);
      } else if (inTable) {
        if (tableCaption) {
           const id = tableCaption.replace(/[^a-z0-9-]/gi, '-').toLowerCase().substring(0, 40);
           figures.push({
              id,
              title: tableCaption,
              description: tableCaption,
              source_file: filename,
              annex: annexInfo.id,
              annex_name: annexInfo.name,
              type: 'table',
              url: `${slug}#${id}`,
              path: '',
              keywords: extractKeywords(tableCaption)
           });
           tableCaption = '';
        }
        inTable = false;
        tableLines = [];
      }
    }
  }

  const uniqueFigures = [];
  const seenIds = new Set();
  figures.forEach(f => {
    let baseId = f.id;
    let c = 1;
    while (seenIds.has(f.id)) {
      f.id = `${baseId}-${c++}`;
    }
    seenIds.add(f.id);
    uniqueFigures.push(f);
  });

  const outDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueFigures, null, 2));
  console.log(`Extracted ${uniqueFigures.length} figures to ${OUTPUT_FILE}`);
}

extractFigures();
