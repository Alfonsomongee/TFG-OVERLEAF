const fs = require('fs');
const text = fs.readFileSync('c:/Users/aphmo/Proyectos/TFG OVERLEAF/SEMANA2.txt', 'utf8');

const extractFile = (marker, extension, targetPath) => {
  const startIndex = text.indexOf(marker);
  if (startIndex === -1) { console.log('Marker not found:', marker); return; }
  
  const blockStart = text.indexOf('\\\' + extension, startIndex);
  if (blockStart === -1) { console.log('Code block start not found for:', marker); return; }
  
  const codeStart = text.indexOf('\n', blockStart) + 1;
  const codeEnd = text.indexOf('\\\', codeStart);
  
  const content = text.substring(codeStart, codeEnd);
  
  const dir = require('path').dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(targetPath, content.trim() + '\n');
  console.log('Extracted:', targetPath);
};

extractFile('### 1.1 Create: /static/data/swing_equation_params.json', 'json', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/static/data/swing_equation_params.json');
extractFile('### 1.2 Create: /static/data/swing_equation_scenarios.json', 'json', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/static/data/swing_equation_scenarios.json');
extractFile('### 2.1 Create: /src/components/SwingEquationSimulator/SwingEquationSimulator.jsx', 'jsx', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.jsx');
extractFile('### 2.2 Create: /src/components/SwingEquationSimulator/SwingEquationSimulator.module.css', 'css', 'c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.module.css');

