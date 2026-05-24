const fs = require('fs');
let text = fs.readFileSync('c:/Users/aphmo/Proyectos/TFG OVERLEAF/SEMANA2.txt', 'utf8');

// The text contains backslashes escaping underscores in markdown
text = text.replace(/\\_/g, '_');

const extractFile = (marker, targetPath, endsWithGitAdd) => {
  const startIndex = text.indexOf(marker);
  if (startIndex === -1) { console.log('Marker not found:', marker); return; }
  
  let blockStart;
  let codeStart;
  let codeEnd;
  
  if (!endsWithGitAdd) {
    blockStart = text.indexOf('```', startIndex);
    if (blockStart === -1) { console.log('Code block start not found for:', marker); return; }
    codeStart = text.indexOf('\n', blockStart) + 1;
    codeEnd = text.indexOf('```', codeStart);
  } else {
    codeStart = text.indexOf('\n', startIndex) + 1;
    codeEnd = text.indexOf('git add', codeStart);
  }
  
  let content = text.substring(codeStart, codeEnd);
  
  // also unescape any markdown characters in the code content
  content = content.replace(/\\_/g, '_').replace(/\\\*/g, '*').replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\\-/g, '-');
  
  const dir = require('path').dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(targetPath, content.trim() + '\n', 'utf8');
  console.log('Extracted:', targetPath);
};

extractFile('3.1 Create or edit: /docs/06-swing-equation-simulator.mdx', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/docs/06-swing-equation-simulator.mdx', true);
