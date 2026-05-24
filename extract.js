const fs = require('fs');
let text = fs.readFileSync('c:/Users/aphmo/Proyectos/TFG OVERLEAF/SEMANA2.txt', 'utf8');

// The text contains backslashes escaping underscores in markdown
text = text.replace(/\\_/g, '_');

const extractFile = (marker, extension, targetPath) => {
  const startIndex = text.indexOf(marker);
  if (startIndex === -1) { console.log('Marker not found:', marker); return; }
  
  const blockStart = text.indexOf('```' + extension, startIndex);
  if (blockStart === -1) { console.log('Code block start not found for:', marker); return; }
  
  const codeStart = text.indexOf('\n', blockStart) + 1;
  const codeEnd = text.indexOf('```', codeStart);
  
  let content = text.substring(codeStart, codeEnd);
  
  // also unescape any markdown characters in the code content
  content = content.replace(/\\_/g, '_').replace(/\\\*/g, '*').replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\\-/g, '-');
  // wait, \u0000? some characters like Ã© might be messed up if read wrongly, but utf8 should be fine.
  
  const dir = require('path').dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(targetPath, content.trim() + '\n', 'utf8');
  console.log('Extracted:', targetPath);
};

extractFile('1.1 Create: /static/data/swing_equation_params.json', 'json', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/static/data/swing_equation_params.json');
extractFile('1.2 Create: /static/data/swing_equation_scenarios.json', 'json', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/static/data/swing_equation_scenarios.json');
extractFile('2.1 Create: /src/components/SwingEquationSimulator/SwingEquationSimulator.jsx', 'jsx', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.jsx');
extractFile('2.2 Create: /src/components/SwingEquationSimulator/SwingEquationSimulator.module.css', 'css', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.module.css');
