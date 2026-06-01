const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fpath = path.join(dir, file);
    const stat = fs.statSync(fpath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fpath));
    } else if (fpath.endsWith('.mdx')) {
      results.push(fpath);
    }
  });
  return results;
}

const files = walkDir('docs');
let output = '';
let globalTable = [];
let noClosure = [];
let orphanComponents = [];
let staticImages = new Set();

function getSentences(text, num) {
  const clean = text.replace(/<[^>]+>/g, '').replace(/:::\w+/g, '').replace(/:::/g, '').replace(/!\[.*?\]\(.*?\)/g, '').trim();
  const sentences = clean.split(/(?<=[.!?])\s+/);
  return sentences.filter(s => s.length > 10).slice(0, num).join(' ').replace(/\n/g, ' ');
}

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const filename = path.basename(file);
  
  // Title
  let title = 'Sin título';
  const titleMatch = content.match(/^#\s+(.+)$/m) || content.match(/title:\s*['"]?(.+?)['"]?$/m);
  if (titleMatch) title = titleMatch[1];
  
  output += `---\n## ${filename} — ${title}\n\n**Secciones:**\n`;
  
  // Sections
  const lines = content.split('\n');
  let currentSection = '';
  let sectionContent = [];
  let inSection = false;
  let level = 2;

  const flushSection = () => {
    if (currentSection) {
      const summary = getSentences(sectionContent.join(' '), 3) || 'Sin contenido de texto.';
      const indent = level === 3 ? '  - ' : '- ';
      const prefix = level === 3 ? '###' : '##';
      output += `${indent}${prefix} ${currentSection}\n`;
      output += `${level === 3 ? '    ' : '  '}RESUMEN: ${summary}\n`;
    }
  };

  lines.forEach(line => {
    const headerMatch = line.match(/^(##|###)\s+(.+)$/);
    if (headerMatch) {
      flushSection();
      level = headerMatch[1].length;
      currentSection = headerMatch[2];
      sectionContent = [];
      inSection = true;
    } else if (inSection) {
      if (!line.trim().startsWith('import ') && !line.trim().startsWith('<') && !line.startsWith(':::')) {
        sectionContent.push(line.trim());
      }
    }
  });
  flushSection();

  // Componentes interactivos
  let components = [];
  let compMatches = content.matchAll(/<([A-Z][a-zA-Z0-9]+)/g);
  for (const match of compMatches) {
    if (match[1] !== 'ForensicReveal' && match[1] !== 'CuestionAbierta' && match[1] !== 'GlossaryLink' && match[1] !== 'ForensicTable' && match[1] !== 'Admonition') {
      components.push(match[1]);
    }
  }
  components = [...new Set(components)];
  output += `\n**Componentes interactivos:**\n`;
  if(components.length) {
    components.forEach(c => output += `- ${c} — Componente React renderizado en el cliente\n`);
  } else {
    output += `- Ninguno\n`;
  }

  // Imágenes
  let images = [];
  let imgMatches = content.matchAll(/!\[.*?\]\((.*?\.png)\)|<img.*?src=['"](.*?\.png)['"]/g);
  for (const match of imgMatches) {
    const src = match[1] || match[2];
    images.push(src);
    staticImages.add(src);
  }
  output += `\n**Imágenes PNG/estáticas:**\n`;
  if(images.length) {
    images.forEach(img => output += `- ${img} — Imagen estática incrustada\n`);
  } else {
    output += `- Ninguna\n`;
  }

  // ForensicReveal
  let reveals = [];
  let revealMatches = content.matchAll(/<ForensicReveal[^>]*>([\s\S]*?)<\/ForensicReveal>/g);
  for (const match of revealMatches) {
    reveals.push(getSentences(match[1], 1));
  }
  output += `\n**ForensicReveal (desplegables L1/L2/L3):**\n`;
  if(reveals.length) {
    reveals.forEach((r, i) => output += `- L${(i%3)+1}: "${r}"\n`);
  } else {
    output += `- Ninguno\n`;
  }

  // CuestionAbierta
  let questions = [];
  let qMatches = content.matchAll(/<CuestionAbierta.*?value=['"](.*?)['"].*?metricKey=['"](.*?)['"]/g);
  for (const match of qMatches) {
    questions.push(`"${match[1]}" (metricKey: ${match[2]})`);
  }
  output += `\n**CuestionAbierta (datos no verificados):**\n`;
  if(questions.length) {
    questions.forEach(q => output += `- ${q}\n`);
  } else {
    output += `- Ninguno\n`;
  }

  // GlossaryLink
  let terms = [];
  let termMatches = content.matchAll(/<GlossaryLink.*?term=['"](.*?)['"]/g);
  for (const match of termMatches) {
    terms.push(match[1]);
  }
  output += `\n**GlossaryLink (palabras interactivas):**\n`;
  if(terms.length) {
    output += `- ${[...new Set(terms)].join(', ')}\n`;
  } else {
    output += `- Ninguno\n`;
  }

  // ForensicTable
  let tables = [];
  let tMatches = content.matchAll(/<ForensicTable[^>]*title=['"](.*?)['"]/g);
  for (const match of tMatches) {
    tables.push(match[1]);
  }
  output += `\n**ForensicTable (tablas forenses):**\n`;
  if(tables.length) {
    tables.forEach((t, i) => output += `- [TABLA ${i+1} | ${t}] — Variante interactiva\n`);
  } else {
    output += `- Ninguna\n`;
  }

  // Admonitions
  let admonitions = [];
  let aMatches = content.matchAll(/:::(note|tip|info|warning|danger)\n(.*?)\n/g);
  for (const match of aMatches) {
    admonitions.push(`[${match[1]}]: "${match[2].substring(0, 50)}..."`);
  }
  output += `\n**Admonitions (:::note :::tip etc):**\n`;
  if(admonitions.length) {
    admonitions.forEach(a => output += `- ${a}\n`);
  } else {
    output += `- Ninguna\n`;
  }

  // Enlaces internos
  let links = [];
  let lMatches = content.matchAll(/\[([^\]]+)\]\((?!http|mailto)(.*?)\)/g);
  for (const match of lMatches) {
    if(!match[2].endsWith('.png')) links.push(`"${match[1]}" → ${match[2]}`);
  }
  output += `\n**Enlaces internos:**\n`;
  if(links.length) {
    links.forEach(l => output += `- ${l}\n`);
  } else {
    output += `- Ninguno\n`;
  }

  // Diagnóstico
  let diagScore = components.length + reveals.length;
  let val = diagScore > 4 ? 'SATURADO' : (diagScore > 1 ? 'EQUILIBRADO' : 'LIGERO');
  output += `\n**Diagnóstico:**\n`;
  output += `INTERACTIVOS: ${components.length + reveals.length + questions.length} | IMÁGENES: ${images.length} | GLOSARIO: ${terms.length} términos\n`;
  output += `VALORACIÓN: ${val}\n`;
  output += `MOTIVO: Posee ${diagScore} componentes interactivos principales.\n\n`;

  globalTable.push(`| ${filename} | ${components.length} | ${images.length} | ${terms.length} | ${val} |`);

  // Capítulos sin cierre narrativo
  let cleanLines = lines.filter(l => l.trim() !== '');
  if (cleanLines.length > 0) {
    const lastLine = cleanLines[cleanLines.length - 1];
    if (lastLine.match(/^<\/[A-Z]|^<[A-Z]/)) {
      noClosure.push(filename);
    }
  }

  // Componentes huérfanos (búsqueda rudimentaria)
  for(let i=1; i<cleanLines.length-1; i++) {
    if(cleanLines[i].match(/^<[A-Z][a-zA-Z0-9]+/) && !cleanLines[i].includes('/>')) {
      if(cleanLines[i-1].match(/^<\/[A-Z]/) && cleanLines[i+1].match(/^<[A-Z]/)) {
        orphanComponents.push(`${filename}: ${cleanLines[i].split(' ')[0]}`);
      }
    }
  }
});

output += `---\n\n## RESUMEN GLOBAL\n\n`;
output += `| Capítulo | Interactivos | Imágenes | Glosario | Valoración |\n`;
output += `|----------|-------------|----------|----------|------------|\n`;
output += globalTable.join('\n') + '\n\n';

output += `## CAPÍTULOS SIN CIERRE NARRATIVO\n`;
noClosure.forEach(c => output += `- ${c}\n`);
output += '\n';

output += `## COMPONENTES HUÉRFANOS\n`;
orphanComponents.forEach(c => output += `- ${c}\n`);
output += '\n';

output += `## IMÁGENES ESTÁTICAS SUSTITUIBLES\n`;
[...staticImages].forEach(img => {
  if (img.includes('mapa') || img.includes('termico') || img.includes('propagation')) {
    output += `- ${img} (Se recomienda usar BlackoutPropagationMap o MapsInteractive)\n`;
  } else {
    output += `- ${img}\n`;
  }
});

fs.writeFileSync('INVENTARIO_CONTENIDO.md', output);
console.log(output.split('\\n').slice(0, 60).join('\\n'));
