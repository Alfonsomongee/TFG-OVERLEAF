#!/usr/bin/env node
/**
 * audit-deps.mjs — Auditoría de dependencias potencialmente no usadas.
 * 
 * EJECUTAR ANTES de tocar package.json:
 *   node scripts/audit-deps.mjs
 * 
 * Busca en src/ y docs/ si las dependencias sospechosas están realmente importadas.
 * Candidatas a eliminar según análisis del contexto del proyecto:
 *   - gsap / @gsap/react     (Framer Motion ya cubre todas las animaciones)
 *   - echarts / echarts-for-react  (no aparece en ningún componente del contexto)
 *   - plotly.js / react-plotly.js  (confirmado en package.json pero sin componente activo)
 *   - reactflow               (no aparece en componentes auditados)
 *   - maplibre-gl / react-map-gl  (deck.gl ya maneja el mapa; comprobar si hay uso)
 */

import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';

const SUSPECTS = [
  'gsap',
  '@gsap/react',
  'echarts',
  'echarts-for-react',
  'plotly.js',
  'react-plotly.js',
  'reactflow',
  'maplibre-gl',
  'react-map-gl',
];

const SEARCH_DIRS = ['src', 'docs'];
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mdx', '.md'];

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...(await getFiles(fullPath)));
    } else if (entry.isFile() && EXTENSIONS.includes(extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = (await Promise.all(SEARCH_DIRS.map(getFiles))).flat();
const results = {};

for (const suspect of SUSPECTS) {
  results[suspect] = [];
  for (const file of files) {
    const content = await readFile(file, 'utf8').catch(() => '');
    if (content.includes(`from '${suspect}'`) || content.includes(`require('${suspect}')`)) {
      results[suspect].push(file);
    }
  }
}

console.log('\n═══ AUDITORÍA DE DEPENDENCIAS ═══\n');
let totalSavings = 0;
const APPROX_SIZES = {
  'gsap': 130, '@gsap/react': 5,
  'echarts': 1300, 'echarts-for-react': 30,
  'plotly.js': 3200, 'react-plotly.js': 20,
  'reactflow': 400,
  'maplibre-gl': 800, 'react-map-gl': 50,
};

for (const [dep, usages] of Object.entries(results)) {
  const status = usages.length === 0 ? '❌ SIN USO — ELIMINAR' : `✅ EN USO (${usages.length} archivo/s)`;
  const size = APPROX_SIZES[dep] ? ` (~${APPROX_SIZES[dep]} KB)` : '';
  console.log(`${status}  →  ${dep}${size}`);
  if (usages.length > 0) {
    usages.forEach(f => console.log(`     ${f}`));
  } else {
    totalSavings += APPROX_SIZES[dep] || 0;
  }
}

console.log(`\n💾 Ahorro estimado en bundle si se eliminan las no usadas: ~${totalSavings} KB`);
console.log('\n Para eliminar:  npm uninstall <paquete> <paquete> ...\n');
