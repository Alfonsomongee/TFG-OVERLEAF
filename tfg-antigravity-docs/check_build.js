const fs = require('fs');
// Ver si existe scripts/build-index.js
if (fs.existsSync('./scripts/build-index.js')) {
  const code = fs.readFileSync('./scripts/build-index.js','utf8');
  // Mostrar las primeras 80 líneas para entender la estructura
  console.log(code.split('\n').slice(0,80).join('\n'));
} else {
  console.log('No encontrado en scripts/');
  // Buscar en otras ubicaciones
  const files = require('child_process')
    .execSync('dir /s /b build-index.js 2>nul', {cwd:'.'})
    .toString().trim();
  console.log('Ubicaciones:', files);
}
