import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We will read glossary.js as text and extract terms to avoid import issues with slugify/ESM
const glossaryPath = path.join(__dirname, 'src/data/glossary.js');
const glossaryContent = fs.readFileSync(glossaryPath, 'utf8');

const terms = [];
const regex = /term:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(glossaryContent)) !== null) {
  terms.push(match[1]);
}

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const glossaryIds = terms.map(slugify);
const glossaryMap = new Map();
terms.forEach(t => glossaryMap.set(slugify(t), t));

console.log(`Found ${terms.length} terms in glossary.`);

const docsDir = path.join(__dirname, 'docs');
const files = fs.readdirSync(docsDir).filter(f => f.match(/^\d{2}.*\.mdx$/));

const results = {};

for (const file of files) {
  const filePath = path.join(docsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const markedRegex = /<GlossaryLink\s+term=["']([^"']+)["'].*?>(.*?)<\/GlossaryLink>/gs;
  
  const markedTerms = [];
  let m;
  while ((m = markedRegex.exec(content)) !== null) {
    markedTerms.push({ termAttr: m[1], text: m[2], index: m.index });
  }
  
  results[file] = {
    markedTerms,
    contentLength: content.length,
    content: content
  };
}

fs.writeFileSync('audit_results.json', JSON.stringify({ terms, glossaryIds, files: results }, null, 2));
console.log('audit_results.json generated.');
