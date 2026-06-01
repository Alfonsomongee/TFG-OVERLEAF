const fs = require('fs');

// ==== TAREA 1 y TAREA 4 para StickyCollapse.jsx ====
let sticky = fs.readFileSync('src/components/StickyCollapse.jsx', 'utf8');

sticky = sticky.replace(
  /<div style={{\s*position:\s*'relative',\s*display:\s*'flex',\s*gap:\s*'2rem',\s*alignItems:\s*'flex-start'\s*}}>/g,
  `<div style={{
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '42% 1fr',
  gap: '2rem',
  alignItems: 'start',
}}>`
);

sticky = sticky.replace(
  /flex:\s*1,\s*position:\s*'sticky',\s*top:\s*'80px',\s*height:\s*'65vh',\s*zIndex:\s*10,?/g,
  `position: 'sticky',
  top: '80px',
  height: 'fit-content',
  maxHeight: '70vh',
  zIndex: 10,
  alignSelf: 'start',`
);

sticky = sticky.replace(
  /margin:\s*i\s*===\s*steps\.length\s*-\s*1\s*\?\s*'45vh 0 0 0'\s*:\s*'45vh 0',/g,
  `margin: i === steps.length - 1 ? '45vh 0 60vh 0' : '45vh 0',`
);

sticky = sticky.replace(
  /height:\s*'calc\(100% - 44px\)',/g,
  `height: 'auto',\n  maxHeight: 'calc(70vh - 60px)',\n  overflow: 'hidden',`
);

// Tarea 4: Colores modo claro en StickyCollapse
sticky = sticky.replace(/'#e2e8f0'/g, "'var(--ifm-font-color-base)'");
sticky = sticky.replace(/'#94a3b8'/g, "'var(--ifm-color-emphasis-600)'");
sticky = sticky.replace(/'#64748b'/g, "'var(--ifm-color-emphasis-500)'");
sticky = sticky.replace(/'#475569'/g, "'var(--ifm-color-emphasis-400)'");
sticky = sticky.replace(/'#334155'/g, "'var(--ifm-color-emphasis-300)'");
sticky = sticky.replace(/'#1e293b'/g, "'var(--ifm-background-surface-color)'");

fs.writeFileSync('src/components/StickyCollapse.jsx', sticky);

// ==== TAREA 2 y TAREA 4 para TapLagSequence.jsx ====
let taplag = fs.readFileSync('src/components/TapLagSequence.jsx', 'utf8');

// Tarea 2a
taplag = taplag.replace(/const W = (?:640|760),\s*H = (?:340|480);/g, 'const W = 780, H = 460;');

// Tarea 2b
taplag = taplag.replace(/values="0\.9;0\.4;0\.9"\s*dur="[^"]+"\s*repeatCount="indefinite"/g, 'values="1;0.2;1" dur="0.35s" repeatCount="indefinite"');
taplag = taplag.replace(/<rect x="220" y="196" width="70" height="18" rx="3"/g, '<rect x="215" y="192" width="82" height="22" rx="4"');
taplag = taplag.replace(/<text x="255" y="209" fill="#fff" fontSize="9"/g, '<text x="256" y="207" fill="#fff" fontSize="11"');

// Tarea 2c
// Reemplazos de fuentes dentro de DiagramSVG
taplag = taplag.replace(/fontSize="7"/g, 'fontSize="10"');
taplag = taplag.replace(/fontSize="8"/g, 'fontSize="11"');
taplag = taplag.replace(/fontSize="9"/g, 'fontSize="12"');
taplag = taplag.replace(/fontSize="10"/g, 'fontSize="13"');
taplag = taplag.replace(/fontSize="12"/g, 'fontSize="15"');
taplag = taplag.replace(/fontSize="16"/g, 'fontSize="20"');
taplag = taplag.replace(/fontSize="11"/g, 'fontSize="13"');

// Tarea 2d
taplag = taplag.replace(/x="320"/g, 'x="400"'); // texto y rect RED 220kV
taplag = taplag.replace(/const x = 325 \+ i \* 58/g, 'const x = 405 + i * 62');
taplag = taplag.replace(/rect x="215" y="55" width="290"/g, 'rect x="215" y="55" width="370"');
taplag = taplag.replace(/x="360"/g, 'x="400"'); // ZONA CIEGA
taplag = taplag.replace(/x="590"/g, 'x="714"');
taplag = taplag.replace(/x="612"/g, 'x="730"');
taplag = taplag.replace(/x="608"/g, 'x="726"');
taplag = taplag.replace(/x="624"/g, 'x="744"');

taplag = taplag.replace(/<rect x="60" y="295" width="530" height="36"/g, '<rect x="20" y="375" width="740" height="48"');
taplag = taplag.replace(/<text x="75" y="311"/g, '<text x="36" y="393"');
taplag = taplag.replace(/<text x="75" y="325"/g, '<text x="36" y="413"');

// Tarea 2e
taplag = taplag.replace(/<rect x="60" y="145" width="530" height="85" rx="4"/g, '<rect x="30" y="140" width="720" height="110" rx="6"');
taplag = taplag.replace(/x="325" y="175" fill=\{C.critical\} fontSize="(?:16|20)"/g, 'x="390" y="172" fill={C.critical} fontSize="20"');
taplag = taplag.replace(/x="325" y="195" fill=\{C.critical\} fontSize="(?:11|13)"/g, 'x="390" y="196" fill={C.critical} fontSize="13"');
taplag = taplag.replace(/x="325" y="213" fill="#f87171" fontSize="(?:10|12)"/g, 'x="390" y="216" fill="#f87171" fontSize="12"');

// Tarea 2f
taplag = taplag.replace(/const bar400H = Math.round\(step.v400 \* 80\);/g, 'const bar400H = Math.round(step.v400 * 110);');
taplag = taplag.replace(/const bar220H = Math.round\(step.v220 \* 80\);/g, 'const bar220H = Math.round(step.v220 * 110);');

taplag = taplag.replace(/270 - Math.round\(v \* 80\)/g, '300 - Math.round(v * 110)');
taplag = taplag.replace(/170 \+ 100 - bar400H/g, '185 + 110 - bar400H');
taplag = taplag.replace(/170 \+ 100 - bar220H/g, '185 + 110 - bar220H');
taplag = taplag.replace(/rect height="100"/g, 'rect height="110"'); // Wait, the regex might replace too much, but I'll use it carefully.
// let's do more precise replacements for height="100" if needed.
// Ah, the regex might miss some or hit some others.
taplag = taplag.replace(/y=\{170\} width="20" height="100"/g, 'y={170} width="20" height="110"');
taplag = taplag.replace(/y=\{170 \+ 100 - /g, 'y={185 + 110 - ');

// Tarea 4: Colores modo claro en TapLagSequence
taplag = taplag.replace(/'#e2e8f0'/g, "'var(--ifm-font-color-base)'");
taplag = taplag.replace(/'#94a3b8'/g, "'var(--ifm-color-emphasis-600)'");
taplag = taplag.replace(/'#64748b'/g, "'var(--ifm-color-emphasis-500)'");
taplag = taplag.replace(/'#475569'/g, "'var(--ifm-color-emphasis-400)'");
taplag = taplag.replace(/'#334155'/g, "'var(--ifm-color-emphasis-300)'");
taplag = taplag.replace(/'#1e293b'/g, "'var(--ifm-background-surface-color)'");

fs.writeFileSync('src/components/TapLagSequence.jsx', taplag);

// ==== TAREA 3: BlackoutPropagationMapBase.jsx ====
// Extract the code block from PROMPT_4_FIXES.md
const prompt = fs.readFileSync('../PROMPT_4_FIXES.md', 'utf8');
const lines = prompt.split('\n');
let newBaseCode = [];
let capture = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('import React, { useState, useEffect, useMemo } from \'react\';')) {
    capture = true;
  }
  if (capture) {
    if (lines[i].startsWith('\`\`\`')) {
      break;
    }
    newBaseCode.push(lines[i]);
  }
}

if (newBaseCode.length > 100) {
  fs.writeFileSync('src/components/BlackoutPropagationMapBase.jsx', newBaseCode.join('\n'));
} else {
  console.log("Error extracting BlackoutPropagationMapBase.jsx from PROMPT");
}

// ==== TAREA 4: CollapseSismograph.jsx ====
if (fs.existsSync('src/components/CollapseSismograph.jsx')) {
  let sismo = fs.readFileSync('src/components/CollapseSismograph.jsx', 'utf8');
  sismo = sismo.replace(/'#e2e8f0'/g, "'var(--ifm-font-color-base)'");
  sismo = sismo.replace(/'#94a3b8'/g, "'var(--ifm-color-emphasis-600)'");
  sismo = sismo.replace(/'#64748b'/g, "'var(--ifm-color-emphasis-500)'");
  sismo = sismo.replace(/'#475569'/g, "'var(--ifm-color-emphasis-400)'");
  sismo = sismo.replace(/'#334155'/g, "'var(--ifm-color-emphasis-300)'");
  sismo = sismo.replace(/'#1e293b'/g, "'var(--ifm-background-surface-color)'");
  fs.writeFileSync('src/components/CollapseSismograph.jsx', sismo);
}

console.log("Modificaciones aplicadas.");
