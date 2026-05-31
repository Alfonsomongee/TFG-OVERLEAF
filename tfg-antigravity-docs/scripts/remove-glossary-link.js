/**
 * remove-glossary-link.js
 * Strips <GlossaryLink ...>CONTENT</GlossaryLink> from all MDX files,
 * leaving only the children (CONTENT) in place.
 * Also removes the import line.
 *
 * Run: node scripts/remove-glossary-link.js
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const docsDir = path.join(__dirname, '..', 'docs');

// Find all MDX files recursively
const files = glob.sync('**/*.mdx', { cwd: docsDir, absolute: true });

let totalFiles = 0;
let modifiedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // 1. Remove import line (both double and single quotes)
  content = content.replace(
    /^import GlossaryLink from ["']@site\/src\/components\/GlossaryLink["'];\r?\n/gm,
    ''
  );

  // 2. Replace <GlossaryLink ...>CONTENT</GlossaryLink> with CONTENT
  //    Uses non-greedy match; handles multiline content.
  //    The [\s\S]*? catches everything including newlines.
  content = content.replace(
    /<GlossaryLink(?:\s+[^>]*)?\s*>([\s\S]*?)<\/GlossaryLink>/g,
    '$1'
  );

  totalFiles++;
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('  Modified:', path.relative(docsDir, file));
    modifiedFiles++;
  }
}

console.log(`\nDone: ${modifiedFiles}/${totalFiles} files modified.`);
