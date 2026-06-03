import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

// Mock slugify para poder importar los archivos JS
const slugify = (text) =>
  text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Leer glossary-terms.json como fuente de verdad para ids y letters
const termsJson = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src/data/glossary-terms.json'), 'utf8')
);

// Leer glossary_zh-Hans.js — extraer termZH y definition
const zhCode = fs.readFileSync(
  path.join(ROOT, 'src/data/glossary_zh-Hans.js'), 'utf8'
);

// Parser robusto basado en bloques
function parseGlossaryJS(code) {
  const results = [];
  // Dividir por objetos individuales
  const blockRegex = /\{([^{}]*)\}/gs;
  let match;
  while ((match = blockRegex.exec(code)) !== null) {
    const block = match[1];
    const get = (key) => {
      const r = new RegExp(key + `:\\s*(['"\`])(.*?)\\1`, 's');
      const m = block.match(r);
      return m ? m[2].trim() : null;
    };
    const id = get('id');
    const letter = get('letter');
    const term = get('term');
    const termZH = get('termZH');
    const definition = get('definition');
    if (term || termZH) {
      results.push({ id, letter, term, termZH, definition });
    }
  }
  return results;
}

const zhParsed = parseGlossaryJS(zhCode);
console.log('ZH parsed terms:', zhParsed.length);
console.log('JSON source terms:', termsJson.length);
console.log('First ZH entry:', zhParsed[0]);

// Reparar usando glossary-terms.json como fuente de ids/letters
// y zhParsed para las traducciones chinas
const repaired = termsJson.map((jsonTerm, i) => {
  const zh = zhParsed[i] || {};
  return {
    id: jsonTerm.id || slugify(jsonTerm.term),
    letter: (jsonTerm.term || '').charAt(0).toUpperCase(),
    term: zh.termZH || zh.term || jsonTerm.term,
    definition: zh.definition || jsonTerm.definition,
  };
});

console.log('\nFirst repaired entry:', repaired[0]);
console.log('Second repaired entry:', repaired[1]);

// Generar archivo JS reparado
const entries = repaired.map(t =>
  `  {\n` +
  `    id: ${JSON.stringify(t.id)},\n` +
  `    letter: ${JSON.stringify(t.letter)},\n` +
  `    term: ${JSON.stringify(t.term)},\n` +
  `    definition: ${JSON.stringify(t.definition)},\n` +
  `  }`
).join(',\n');

const output =
  `// Auto-generated — Simplified Chinese glossary (repaired)\n` +
  `// Generated: ${new Date().toISOString()}\n` +
  `export const GLOSSARY_TERMS = [\n${entries}\n];\n`;

const outPath = path.join(ROOT, 'src/data/glossary_zh-Hans.js');
fs.writeFileSync(outPath, output, 'utf8');
const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`\n✅ Saved glossary_zh-Hans.js (${sizeKB} KB)`);
console.log('Total terms:', repaired.length);
