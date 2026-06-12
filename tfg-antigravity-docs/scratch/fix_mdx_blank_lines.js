const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');

const files = fs.readdirSync(docsDir)
  .filter(file => file.startsWith('anexo-') && file.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to match <AnnexSection ...> ... </AnnexSection> and remove blank lines inside it.
  // We can use a regex with a replacer function.
  const regex = /(<AnnexSection[\s\S]*?>)([\s\S]*?)(<\/AnnexSection>)/g;

  const newContent = content.replace(regex, (match, openTag, body, closeTag) => {
    // Process the body: split by lines, filter out empty lines, join back.
    const processedBody = body
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
    return `${openTag}\n${processedBody}\n${closeTag}`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}: removed blank lines inside <AnnexSection>`);
  }
});
