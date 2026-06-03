// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const STATIC_IMG = path.join(__dirname, '..', 'static', 'img');
const ORIGINALS  = path.join(STATIC_IMG, 'originals');
const QUALITY    = 82;

// Archivos que NO se tocan nunca
const SKIP = new Set([
  'pwa-icon-192x192.png',
  'pwa-icon-512x512.png',
  'favicon.png',
  'favicon.ico',
]);

// Solo convertimos los que pesan más de 200 KB
const MIN_SIZE_KB = 200;

async function run() {
  if (!fs.existsSync(ORIGINALS)) fs.mkdirSync(ORIGINALS, { recursive: true });

  const files = fs.readdirSync(STATIC_IMG).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });

  let totalBefore = 0;
  let totalAfter  = 0;
  let converted   = 0;
  let skipped     = 0;
  const report    = [];

  for (const file of files) {
    const src     = path.join(STATIC_IMG, file);
    const stat    = fs.statSync(src);
    const sizeKB  = stat.size / 1024;
    const ext     = path.extname(file).toLowerCase();
    const base    = path.basename(file, ext);
    const webpOut = path.join(STATIC_IMG, base + '.webp');

    // Saltar archivos protegidos
    if (SKIP.has(file)) {
      report.push(`  SKIP (protegido)  ${file}`);
      skipped++;
      continue;
    }

    // Saltar archivos ligeros
    if (sizeKB < MIN_SIZE_KB) {
      report.push(`  SKIP (ligero)     ${file}  ${sizeKB.toFixed(0)} KB`);
      skipped++;
      continue;
    }

    // Saltar si ya existe el WebP y es más reciente
    if (fs.existsSync(webpOut)) {
      const webpStat = fs.statSync(webpOut);
      if (webpStat.mtimeMs > stat.mtimeMs) {
        report.push(`  SKIP (ya existe)  ${base}.webp`);
        skipped++;
        continue;
      }
    }

    try {
      // Backup del original
      fs.copyFileSync(src, path.join(ORIGINALS, file));

      // Convertir a WebP
      await sharp(src)
        .webp({ quality: QUALITY, effort: 4 })
        .toFile(webpOut);

      const afterStat = fs.statSync(webpOut);
      const afterKB   = afterStat.size / 1024;
      const saving    = ((1 - afterKB / sizeKB) * 100).toFixed(0);

      totalBefore += sizeKB;
      totalAfter  += afterKB;
      converted++;

      report.push(
        `  OK  ${file.padEnd(48)} ${sizeKB.toFixed(0).padStart(6)} KB  →  ${afterKB.toFixed(0).padStart(6)} KB  (-${saving}%)`
      );
    } catch (err) {
      report.push(`  ERR ${file}  ${err.message}`);
    }
  }

  console.log('\n════════════════════════════════════════════════════');
  console.log('  INFORME DE OPTIMIZACIÓN DE IMÁGENES');
  console.log('════════════════════════════════════════════════════');
  report.forEach(l => console.log(l));
  console.log('────────────────────────────────────────────────────');
  console.log(`  Convertidas : ${converted}`);
  console.log(`  Omitidas    : ${skipped}`);
  console.log(`  Antes       : ${(totalBefore / 1024).toFixed(2)} MB`);
  console.log(`  Después     : ${(totalAfter  / 1024).toFixed(2)} MB`);
  console.log(`  Ahorro      : ${((totalBefore - totalAfter) / 1024).toFixed(2)} MB`);
  console.log('════════════════════════════════════════════════════\n');
}

run().catch(console.error);
