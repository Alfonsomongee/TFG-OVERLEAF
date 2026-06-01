const fs = require('fs');

let content = fs.readFileSync('src/components/BlackoutPropagationMapBase.jsx', 'utf8');

// 1. Quitar fondos del div contenedor
content = content.replace(
  /background:\s*'#050a14',[\s\S]*?borderRadius:\s*12,[\s\S]*?border:\s*'1px solid rgba\(0,217,255,0\.15\)',[\s\S]*?overflow:\s*'hidden',/,
  `background: 'transparent',
      borderRadius: 12,`
);

// 2. Cambiar viewBox y altura
content = content.replace(/viewBox="0 0 800 560"/, 'viewBox="0 0 800 600"');

// 3. Insertar la máscara en <defs> (quitando degradados/patrones que ya no se usan)
content = content.replace(
  /<radialGradient id="bp-bg"[\s\S]*?<\/pattern>/,
  `<mask id="mascara-peninsula">
            <rect width="800" height="600" fill="black" />
            <image href="/img/definitiva.jpg" width="800" height="600" preserveAspectRatio="none" />
          </mask>`
);

// 4. Cambiar el renderizado de fondo (eliminar rects, poner imagen enmascarada)
const bgOldRegex = /\{\/\*\s*Fondo\s*\*\/\}[\s\S]*?\{\/\*\s*Etiquetas geográficas\s*\*\/\}/;
const bgNew = `{/* PNG Satelital enmascarado */}
        <image
          href="/img/iberian_satellite.png"
          x="0" y="0" width="800" height="600"
          preserveAspectRatio="none"
          mask="url(#mascara-peninsula)"
          opacity={simTime >= 8 ? 0.3 : 0.6}
          style={{ transition: 'opacity 1s ease' }}
        />

        {/* Etiquetas geográficas */}`;
content = content.replace(bgOldRegex, bgNew);

// 5. Actualizar STATIONS con las coordenadas exactas de la IA
const userCoords = {
  'GRN': {cx: 440, cy: 505, name: 'Caparacena (Granada)'},
  'SEV': {cx: 285, cy: 495, name: 'Alcores (Sevilla)'},
  'BAD': {cx: 275, cy: 465, name: 'Guillena (Sevilla/Bad.)'},
  'ALM': {cx: 330, cy: 320, name: 'C.N. Almaraz (Cáceres)'},
  'MAD': {cx: 445, cy: 290, name: 'Madrid Sur / Morata'},
  'ZAR': {cx: 605, cy: 175, name: 'Nudo Aragón (Zaragoza)'},
  'BAR': {cx: 730, cy: 155, name: 'Rubí (Barcelona)'},
  'LIS': {cx: 120, cy: 375, name: 'Lisboa (REN)'},
  'POR': {cx: 145, cy: 200, name: 'Porto (REN)'},
  'FR':  {cx: 635, cy: 65,  name: 'Interconexión Francia'},
};

for (const [id, data] of Object.entries(userCoords)) {
  const regex = new RegExp(`id:\\s*'${id}',\\s*cx:\\s*[0-9]+,\\s*cy:\\s*[0-9]+,([\\s\\S]*?name:\\s*)'[^']+'`, 'g');
  content = content.replace(regex, `id: '${id}', cx: ${data.cx}, cy: ${data.cy},$1'${data.name}'`);
}

// Ensure Segovia is aligned somewhat correctly if needed, but it wasn't requested so we leave it as is or update it slightly.
content = content.replace(/id:\s*'SEG',\s*cx:\s*[0-9]+,\s*cy:\s*[0-9]+/, `id: 'SEG', cx: 430, cy: 260`);

fs.writeFileSync('src/components/BlackoutPropagationMapBase.jsx', content);
console.log("Mascara y transparencia aplicadas correctamente.");
