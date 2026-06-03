const fs = require('fs');
const glob = require('glob');

const files = glob.sync('i18n/{en,de}/docusaurus-plugin-content-docs/current/**/*.mdx');

let totalReplaced = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // Remove import
  content = content.replace(/import GlossaryLink from\s*['"]@site\/src\/components\/GlossaryLink['"];?\n?/g, '');

  // Replace <GlossaryLink term="...">Text</GlossaryLink> with Text
  content = content.replace(/<GlossaryLink[^>]*>([\s\S]*?)<\/GlossaryLink>/g, '$1');

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    totalReplaced++;
  }
});

console.log('Files updated:', totalReplaced);
