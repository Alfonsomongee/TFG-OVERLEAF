const fs = require('fs');
const path = require('path');

function getMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMdxFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.mdx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const docsDir = path.join(__dirname, 'tfg-antigravity-docs/docs');
const i18nDir = path.join(__dirname, 'tfg-antigravity-docs/i18n');

let allMdxFiles = [];
if (fs.existsSync(docsDir)) allMdxFiles = allMdxFiles.concat(getMdxFiles(docsDir));
if (fs.existsSync(i18nDir)) allMdxFiles = allMdxFiles.concat(getMdxFiles(i18nDir));

const linkRegex = /<GlossaryLink\s+term="([^"]+)"\s*(?:>([^<]*)<\/GlossaryLink>|\/>)/g;

for (const filePath of allMdxFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let seenTerms = new Set();
  let modified = false;

  const newContent = content.replace(linkRegex, (match, term, innerText) => {
    const normalizedTerm = term.toLowerCase().trim();
    if (seenTerms.has(normalizedTerm)) {
      modified = true;
      return innerText ? innerText : term; // For self-closing tags, use the term text as plain text
    } else {
      seenTerms.add(normalizedTerm);
      return match;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Deduplicated links in: ${filePath}`);
  }
}

console.log('Deduplication complete.');
