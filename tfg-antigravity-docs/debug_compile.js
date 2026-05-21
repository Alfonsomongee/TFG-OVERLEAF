const mdx = require('@mdx-js/mdx');
const remarkMath = require('remark-math');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dimension-europea', '03-dia-despues.mdx');
const content = fs.readFileSync(filePath, 'utf8');

mdx(content, { remarkPlugins: [[remarkMath, {strict: false}]] }).then(result => {
  // Search for 'ac' in result
  const lines = result.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('ac') && !l.includes('// ac')) {
      console.log(i + ': ' + l.substring(0, 150));
    }
  });
}).catch(e => {
  console.error('COMPILE ERROR:', e.message);
  if (e.loc) console.error('at line', e.loc.line, 'col', e.loc.column);
});
