const fs = require('fs');

// --- TAREA 1: TapLagSequence.jsx ---
let file = 'src/components/TapLagSequence.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1a, 1b: W=760, H=480
content = content.replace('const W = 640, H = 340;', 'const W = 760, H = 480;');

// 1d: Ajustar barras
content = content.replace('const bar400H = Math.round(step.v400 * 80);', 'const bar400H = Math.round(step.v400 * 100);');
content = content.replace('const bar220H = Math.round(step.v220 * 80);', 'const bar220H = Math.round(step.v220 * 100);');
content = content.replace('const oltcY = 155 - Math.round(step.oltcPos * 30);', 'const oltcY = 170 - Math.round(step.oltcPos * 35);');

// Gauges logic
content = content.replace(/const y = 270 - Math\.round\(v \* 80\);/g, 'const y = 290 - Math.round(v * 100);');
content = content.replace(/270 - Math\.round\(1\.10 \* 80\)/g, '290 - Math.round(1.10 * 100)');

// 1c, 1e: Offsets and Fonts
content = content
  // RED 400kV (font)
  .replace(/<text x="20" y="22".*?fontSize="10"/s, match => match.replace('fontSize="10"', 'fontSize="11"'))
  // p.u. (400)
  .replace(/<text x="210" y="43".*?fontSize="12"/s, match => match.replace('fontSize="12"', 'fontSize="13"'))
  
  // Transformador OLTC (+50px)
  .replace(/<rect x="215" y="100" width="80"/g, '<rect x="265" y="100" width="90"')
  .replace(/<text x="255" y="120"/g, '<text x="310" y="120"')
  .replace(/<text x="255" y="133"/g, '<text x="310" y="133"')
  .replace(/<rect x="235" y="140"/g, '<rect x="285" y="140"')
  .replace(/<text x="255" y="153"/g, '<text x="310" y="153"')
  .replace(/<line x1="255" y1="185" x2="255"/g, '<line x1="310" y1="185" x2="310"')
  .replace(/<circle cx="255"/g, '<circle cx="310"')
  .replace(/<rect x="220" y="196" width="70"/g, '<rect x="270" y="196" width="80"')
  .replace(/<text x="255" y="209".*?fontSize="9"/s, match => match.replace('x="255"', 'x="310"'))
  
  // Brecha de observabilidad (+50px)
  .replace(/<rect x="215" y="55" width="290"/g, '<rect x="265" y="55" width="350"')
  .replace(/<text x="360" y="68"/g, '<text x="440" y="68"')
  .replace(/<text x="360" y="80"/g, '<text x="440" y="80"')

  // Sección derecha 220kV (+70px)
  .replace(/<text x="320" y="22".*?fontSize="10"/s, match => match.replace('x="320"', 'x="390"').replace('fontSize="10"', 'fontSize="11"'))
  .replace(/<rect x="320" y="35" width="180"/g, '<rect x="390" y="35" width="180"')
  .replace(/<rect x="320" y="35" width=/g, '<rect x="390" y="35" width=')
  .replace(/<text x="508" y="43".*?fontSize="12"/s, match => match.replace('x="508"', 'x="578"').replace('fontSize="12"', 'fontSize="13"'))
  
  // Plantas FV
  .replace(/const x = 325 \+ i \* 58;/g, 'const x = 400 + i * 60;')
  .replace(/fontSize="7"(.*?\{fallen \? 'TRIP' : 'FV'\})/g, 'fontSize="9"$1')
  .replace(/fontSize="7"(.*?\{fallen \? '0 MW' :)/g, 'fontSize="9"$1')
  
  // Gauges
  .replace(/<rect x="20" y="170" width="12" height="100"/g, '<rect x="20" y="180" width="14" height="110"')
  .replace(/<rect x="20" y=\{170 \+ 100 - bar400H\} width="12"/g, '<rect x="20" y={180 + 110 - bar400H} width="14"')
  
  .replace(/<text x="590"/g, '<text x="710"')
  .replace(/<rect x="612" y="170" width="12" height="100"/g, '<rect x="726" y="180" width="14" height="110"')
  .replace(/<rect x="612" y=\{isLast \? 270 : 170 \+ 100 - bar220H\} width="12"/g, '<rect x="726" y={isLast ? 290 : 180 + 110 - bar220H} width="14"')
  .replace(/<line x1="608"/g, '<line x1="722"')
  .replace(/x2="612"/g, 'x2="726"')
  .replace(/<text x="606"/g, '<text x="720"')
  .replace(/x2="624"/g, 'x2="738"')
  
  .replace(/fontSize="7"(.*?\{v\.toFixed\(2\)\})/g, 'fontSize="8"$1')
  .replace(/fontSize="7"(.*?>ANSI 59<\/text>)/g, 'fontSize="8"$1')

  // Cascada
  .replace(/<rect x="60" y="145" width="530" height="85"/g, '<rect x="40" y="145" width="680" height="95"')
  .replace(/<text x="325" y="175".*?fontSize="16"/s, match => match.replace('x="325"', 'x="380"').replace('y="175"', 'y="178"').replace('fontSize="16"', 'fontSize="18"'))
  .replace(/<text x="325" y="195".*?fontSize="11"/s, match => match.replace('x="325"', 'x="380"').replace('y="195"', 'y="200"').replace('fontSize="11"', 'fontSize="12"'))
  .replace(/<text x="325" y="213".*?fontSize="10"/s, match => match.replace('x="325"', 'x="380"').replace('y="213"', 'y="217"').replace('fontSize="10"', 'fontSize="11"'))

  // Nota inferior
  .replace(/<rect x="60" y="295" width="530" height="36"/g, '<rect x="20" y="360" width="720" height="44"')
  .replace(/<text x="75" y="311".*?fontSize="9"/s, match => match.replace('x="75"', 'x="36"').replace('y="311"', 'y="378"').replace('fontSize="9"', 'fontSize="10"'))
  .replace(/<text x="75" y="325".*?fontSize="8"/s, match => match.replace('x="75"', 'x="36"').replace('y="325"', 'y="394"').replace('fontSize="8"', 'fontSize="9"'));

fs.writeFileSync(file, content);


// --- TAREA 2: StickyCollapse.jsx ---
file = 'src/components/StickyCollapse.jsx';
content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /margin: i === steps\.length - 1 \? '45vh 0 0 0' : '45vh 0',/,
  "margin: i === steps.length - 1 ? '45vh 0 80vh 0' : '45vh 0',"
);

content = content.replace(
  /flex: 1,\s+position: 'sticky',\s+top: '80px',\s+height: '65vh',\s+zIndex: 10,/,
  "flex: 1,\n        position: 'sticky',\n        top: '80px',\n        height: '60vh',\n        maxHeight: '520px',\n        zIndex: 10,\n        alignSelf: 'flex-start',"
);

content = content.replace(
  /<div style=\{\{\s+position: 'relative',\s+display: 'flex',\s+gap: '2rem',\s+alignItems: 'flex-start'\s+\}\}>/,
  "<div style={{\n      position: 'relative',\n      display: 'flex',\n      gap: '2rem',\n      alignItems: 'flex-start',\n      paddingBottom: '2rem',\n    }}>"
);

fs.writeFileSync(file, content);
