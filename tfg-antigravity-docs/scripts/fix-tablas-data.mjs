import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadApiKey() {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const match = env.match(/DEEPSEEK_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }
  return process.env.DEEPSEEK_API_KEY;
}

async function translateBatch(strings, targetLang, apiKey) {
  const numbered = strings.map((s, i) => `${i+1}. ${s}`).join('\n');
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `Technical translator for electrical engineering and power systems.
Translate the following numbered strings from Spanish to ${targetLang}.
Rules:
- Keep numbering format (1. 2. 3.)
- Preserve technical acronyms: MW, GW, Hz, kV, IBR, REE, ENTSO-E, UFLS, PMU, GFM, GFL
- Preserve proper nouns: España, Portugal, Francia, Iberdrola, Endesa
- Preserve numbers, units, and codes unchanged
- Return ONLY numbered translations, nothing else`,
        },
        {
          role: 'user',
          content: `Translate to ${targetLang}:\n\n${numbered}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek ${response.status}`);
  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || '';
  const lines = result.split('\n').filter(l => l.trim());
  const translated = [];
  for (const line of lines) {
    const m = line.match(/^\d+\.\s+(.+)$/);
    if (m) translated.push(m[1].trim());
  }
  while (translated.length < strings.length) {
    translated.push(strings[translated.length]);
  }
  return translated;
}

function isTextCell(val) {
  return typeof val === 'string' && 
         isNaN(val) && 
         val.length > 2 &&
         !val.match(/^\d{4}-\d{2}-\d{2}/) && // no fechas
         !val.match(/^#/) && // no colores
         !val.match(/^https?:/); // no URLs
}

async function fixTablasForLocale(targetLang, langCode, apiKey) {
  console.log(`\n🌍 Fixing tablasdefinitivas for ${targetLang} (${langCode})...`);
  
  const srcPath = path.join(ROOT, 'static/data/tablasdefinitivas.json');
  const outPath = path.join(ROOT, `static/data/tablasdefinitivas_${langCode}.json`);
  
  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  
  // Cargar traducción existente (tiene name/columns ya traducidos)
  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    console.log(`  📂 Loaded existing translation (has metadata)`);
  }
  
  // Deep clone del original completo como base
  const result = JSON.parse(JSON.stringify(original));
  
  // Copiar metadata ya traducida (name, columns, note) del existing
  if (existing.categories) {
    existing.categories.forEach((existCat, ci) => {
      if (result.categories[ci]) {
        result.categories[ci].name = existCat.name || result.categories[ci].name;
        if (existCat.tables) {
          existCat.tables.forEach((existTable, ti) => {
            if (result.categories[ci].tables[ti]) {
              result.categories[ci].tables[ti].name = existTable.name || result.categories[ci].tables[ti].name;
              result.categories[ci].tables[ti].note = existTable.note || result.categories[ci].tables[ti].note;
              if (existTable.columns && result.categories[ci].tables[ti].columns) {
                existTable.columns.forEach((col, coli) => {
                  if (result.categories[ci].tables[ti].columns[coli]) {
                    result.categories[ci].tables[ti].columns[coli].label = col.label;
                  }
                });
              }
            }
          });
        }
      }
    });
  }
  
  // Extraer celdas de texto de data[] para traducir
  const toTranslate = [];
  const locations = [];
  
  result.categories.forEach((cat, ci) => {
    cat.tables.forEach((table, ti) => {
      if (!table.data) return;
      table.data.forEach((row, ri) => {
        Object.entries(row).forEach(([key, val]) => {
          if (isTextCell(val)) {
            toTranslate.push(val);
            locations.push({ ci, ti, ri, key });
          }
        });
      });
    });
  });
  
  console.log(`  📊 Text cells to translate: ${toTranslate.length}`);
  
  // Traducir en batches de 40
  const BATCH = 40;
  const allTranslated = [];
  
  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    const batchNum = Math.floor(i/BATCH) + 1;
    const total = Math.ceil(toTranslate.length/BATCH);
    process.stdout.write(`  Batch ${batchNum}/${total}... `);
    const translated = await translateBatch(batch, targetLang, apiKey);
    allTranslated.push(...translated);
    console.log('done');
    await new Promise(r => setTimeout(r, 800));
  }
  
  // Reinyectar traducciones
  locations.forEach((loc, idx) => {
    const t = allTranslated[idx];
    if (t) result.categories[loc.ci].tables[loc.ti].data[loc.ri][loc.key] = t;
  });
  
  // Guardar
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  ✅ Saved ${path.basename(outPath)} (${sizeKB} KB)`);
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found');
    process.exit(1);
  }
  
  console.log('🔧 Fixing tablasdefinitivas data[] for all locales...');
  
  await fixTablasForLocale('English', 'en', apiKey);
  await fixTablasForLocale('German', 'de', apiKey);
  await fixTablasForLocale('Simplified Chinese', 'zh-Hans', apiKey);
  
  console.log('\n🎉 Done! Run npm run build when ready.');
}

main().catch(console.error);
