const { GLOSSARY_TERMS } = require('../src/data/glossary.js');
const fs = require('fs');

const output = GLOSSARY_TERMS.map(t => ({
  term: t.term,
  definition: t.definition
}));

fs.writeFileSync(
  'src/data/glossary-terms.json',
  JSON.stringify(output, null, 2),
  'utf-8'
);

console.log(`✅ Sincronizados ${output.length} términos`);
