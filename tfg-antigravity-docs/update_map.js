const fs = require('fs');

let content = fs.readFileSync('src/components/BlackoutPropagationMapBase.jsx', 'utf8');

// The user coords:
const userCoords = {
  'GRN': {cx: 440, cy: 505},
  'BAD': {cx: 275, cy: 465},
  'SEV': {cx: 285, cy: 495},
  'SEG': {cx: 430, cy: 260}, // Estimated
  'ALM': {cx: 330, cy: 320},
  'MAD': {cx: 445, cy: 290},
  'ZAR': {cx: 605, cy: 175},
  'BAR': {cx: 730, cy: 155},
  'LIS': {cx: 120, cy: 375},
  'POR': {cx: 145, cy: 200},
  'FR':  {cx: 635, cy: 65},
};

// Replace lon, lat in STATIONS with cx, cy
for (const [id, coords] of Object.entries(userCoords)) {
  const regex = new RegExp(`(id:\\s*'${id}',\\s*)lon:\\s*[-0-9.]+,\\s*lat:\\s*[-0-9.]+`, 'g');
  content = content.replace(regex, `$1cx: ${coords.cx}, cy: ${coords.cy}`);
}

// Replace the projection logic
content = content.replace(
  /const \[x, y\] = project\(s\.lon, s\.lat\);/g,
  'const x = s.cx;\n      const y = s.cy;'
);

fs.writeFileSync('src/components/BlackoutPropagationMapBase.jsx', content);
console.log("Map coords updated.");
