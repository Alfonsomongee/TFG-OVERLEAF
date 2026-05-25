import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

const suspectPackages = ['gsap', 'echarts', 'plotly.js', 'reactflow', 'maplibre-gl'];

console.log('🔍 Analizando uso de dependencias sospechosas...\n');

suspectPackages.forEach(pkgName => {
  if (!deps[pkgName]) return;
  try {
    const result = execSync(`grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" "from ['\\"]${pkgName}['\\"]" src/`, { encoding: 'utf8' });
    if (result.trim()) {
      console.log(`✅ ${pkgName} → EN USO (encontrado)`);
    } else {
      console.log(`❌ ${pkgName} → SIN USO (puedes eliminarlo con npm uninstall ${pkgName})`);
    }
  } catch (e) {
    console.log(`⚠️ ${pkgName} → No se encontró referencia directa (probablemente sin uso)`);
  }
});
