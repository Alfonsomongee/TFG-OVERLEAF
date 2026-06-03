const fs = require('fs');

// Leer el glossary_zh-Hans.js actual
const code = fs.readFileSync('./src/data/glossary_zh-Hans.js', 'utf8');

// Leer el glossary_en.js para recuperar ids y letters
const enCode = fs.readFileSync('./src/data/glossary_en.js', 'utf8');

// Extraer arrays — parsear manualmente
function extractTerms(code) {
  const terms = [];
  const entries = code.split(/\},\s*\{/);
  entries.forEach(entry => {
    const id = entry.match(/id:\s*['\"](.*?)['\"]/) ?.[1];
    const letter = entry.match(/letter:\s*['\"](.*?)['\"]/) ?.[1];
    const term = entry.match(/term:\s*['\"](.*?)['\"]/) ?.[1];
    const termZH = entry.match(/termZH:\s*(.*?),/) ?.[1]?.replace(/[\"']/g,'').trim();
    const defMatch = entry.match(/definition:\s*([\s\S]*?)(?:,\s*\}|$)/);
    const definition = defMatch?.[1]?.trim();
    if(term) terms.push({ id, letter, term, termZH, definition });
  });
  return terms;
}

// Leer glossary base ES para recuperar ids/letters correctos
const esCode = fs.readFileSync('./src/data/glossary.js', 'utf8');
const esTerms = extractTerms(esCode);
const zhTerms = extractTerms(code);

console.log('ES terms:', esTerms.length);
console.log('ZH terms:', zhTerms.length);
console.log('First ES:', esTerms[0]);
console.log('First ZH:', zhTerms[0]);

if (esTerms.length > 0 && esTerms.length === zhTerms.length) {
  // Generar glossary_zh-Hans.js reparado
  // usando id y letter del ES, term=termZH, definition del ZH
  const repaired = zhTerms.map((zh, i) => {
    const es = esTerms[i] || {};
    return {
      id: es.id || zh.id,
      letter: es.letter || zh.letter,
      term: zh.termZH || zh.term, // usar traducción china como term
      definition: zh.definition,
    };
  });

  const entries = repaired.map(t => 
    '  {\n' +
    '    id: ' + JSON.stringify(t.id) + ',\n' +
    '    letter: ' + JSON.stringify(t.letter) + ',\n' +
    '    term: ' + JSON.stringify(t.term) + ',\n' +
    '    definition: ' + (t.definition.startsWith('"') || t.definition.startsWith('`') ? t.definition : JSON.stringify(t.definition)) + ',\n' +
    '  }'
  ).join(',\n');

  const output = 
  '// Auto-generated — Simplified Chinese glossary (repaired)\n' +
  'export const GLOSSARY_TERMS = [\n' + entries + '\n];\n';

  fs.writeFileSync('./src/data/glossary_zh-Hans.js', output, 'utf8');
  console.log('Saved glossary_zh-Hans.js — ' + repaired.length + ' terms');

  console.log(output.split('\n').slice(0,12).join('\n'));
} else {
  console.log('Lengths do not match or parsing failed!');
}
