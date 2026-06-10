// scripts/audit-old-vs-new-annexes.js
const fs = require('fs');
const path = require('path');

const DOCS_DIR = 'docs';
const SRC_DIR = 'src';
const STATIC_DIR = 'static';

// ── 1. Inventario de archivos MDX en docs/ ──────────────────
console.log('=== MDX EN docs/ ===');
const mdxFiles = fs.readdirSync(DOCS_DIR)
  .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
  .sort();
mdxFiles.forEach(f => console.log(' ', f));

// ── 2. Detectar imports desde anexos viejos ─────────────────
// Patrones de rutas antiguas conocidas
const OLD_PATTERNS = [
  'anexo-a', 'anexo-b', 'anexo-c', 'anexo-d',
  'anexo-tablas', 'anexo-figuras', 'anexo-interactivos',
  'anexo-entsoe', 'annex-a', 'annex-b', 'annex-c', 'annex-d'
];

console.log('\n=== REFERENCIAS A ANEXOS VIEJOS EN MDX NUEVOS ===');
const newAnnexes = mdxFiles.filter(f => f.startsWith('anexo-'));
newAnnexes.forEach(f => {
  const content = fs.readFileSync(path.join(DOCS_DIR, f), 'utf8');
  OLD_PATTERNS.forEach(pat => {
    if (content.toLowerCase().includes(pat)) {
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        if (line.toLowerCase().includes(pat)) {
          console.log(`  [${f}] línea ${i+1}: ${line.trim().substring(0, 120)}`);
        }
      });
    }
  });
});

// ── 3. Detectar imports en src/components/ y src/data/ ──────
console.log('\n=== REFERENCIAS A ANEXOS VIEJOS EN src/ ===');
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, {withFileTypes: true}).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.includes('node_modules')) {
      scanDir(full);
    } else if (entry.isFile() && /\.(jsx?|tsx?|json)$/.test(entry.name)) {
      try {
        const content = fs.readFileSync(full, 'utf8');
        OLD_PATTERNS.forEach(pat => {
          if (content.toLowerCase().includes(pat)) {
            const lines = content.split('\n');
            lines.forEach((line, i) => {
              if (line.toLowerCase().includes(pat)) {
                console.log(`  [${full}] línea ${i+1}: ${line.trim().substring(0, 120)}`);
              }
            });
          }
        });
      } catch(e) {}
    }
  });
}
scanDir(path.join(SRC_DIR, 'data'));
scanDir(path.join(SRC_DIR, 'components'));

// ── 4. Buscar archivos MDX viejos que aún existan ───────────
console.log('\n=== ARCHIVOS MDX VIEJOS QUE AÚN EXISTEN EN docs/ ===');
const OLD_MDX = [
  'anexo-a.mdx', 'anexo-b.mdx', 'anexo-c.mdx', 'anexo-d.mdx',
  'anexo-tablas.mdx', 'anexo-figuras.mdx', 'anexo-interactivos.mdx', 'anexo-entsoe.mdx',
  'annex-a.mdx', 'annex-b.mdx', 'annex-c.mdx', 'annex-d.mdx',
];
OLD_MDX.forEach(f => {
  const exists = fs.existsSync(path.join(DOCS_DIR, f));
  if (exists) console.log('  EXISTE (debería eliminarse):', f);
});

// ── 5. Buscar carpetas /static con recursos de anexos viejos ─
console.log('\n=== CARPETAS ESTÁTICAS CON POSIBLES RECURSOS VIEJOS ===');
['figuras', 'images', 'img', 'assets'].forEach(dir => {
  const full = path.join(STATIC_DIR, dir);
  if (fs.existsSync(full)) {
    console.log(`  /static/${dir}/ existe:`, fs.readdirSync(full).length, 'archivos');
  }
});

// ── 6. Verificar chunks.json por slugs de anexos viejos ─────
console.log('\n=== CHUNKS DEL ÍNDICE CON SLUGS DE ANEXOS VIEJOS ===');
const chunksPath = fs.existsSync('static/chunks.json') 
  ? 'static/chunks.json' 
  : 'static/data/chunks.json';
if (fs.existsSync(chunksPath)) {
  const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
  const oldChunks = chunks.filter(c => {
    const slug = (c.slug || '').toLowerCase();
    const url = (c.artifact?.url || '').toLowerCase();
    return OLD_PATTERNS.some(p => slug.includes(p) || url.includes(p));
  });
  console.log(`  Total chunks con rutas viejas: ${oldChunks.length}`);
  const bySlug = {};
  oldChunks.forEach(c => {
    const key = c.slug || 'sin-slug';
    bySlug[key] = (bySlug[key] || 0) + 1;
  });
  Object.entries(bySlug).sort().forEach(([slug, count]) => {
    console.log(`    ${count} chunks → ${slug}`);
  });
} else {
  console.log('  chunks.json no encontrado en rutas esperadas');
}

console.log('\n=== FIN AUDITORÍA ===');
