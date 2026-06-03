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

function isTextCell(val) {
  return typeof val === 'string' &&
    val.length > 2 &&
    isNaN(val) &&
    !val.match(/^\d{4}-\d{2}-\d{2}/) &&
    !val.match(/^#/) &&
    !val.match(/^https?:/) &&
    !val.match(/^≈/) === false || 
    (typeof val === 'string' && val.length > 2 && isNaN(val.replace('≈','').replace('%','').trim()));
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
          content: `Technical translator for electrical engineering.
Translate from Spanish to ${targetLang}.
Preserve: MW, GW, Hz, kV, IBR, REE, ENTSO-E, ICAI, REN, SCR.
Preserve numbers, units, percentages, dates.
Return ONLY numbered translations.`,
        },
        { role: 'user', content: `Translate to ${targetLang}:\n\n${numbered}` },
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

async function fixForensicForLocale(targetLang, langCode, apiKey) {
  console.log(`\n🌍 Fixing forensic_categories data[] for ${targetLang}...`);

  const srcPath = path.join(ROOT, 'static/data/processed/forensic_categories.json');
  const outPath = path.join(ROOT, `static/data/processed/forensic_categories_${langCode}.json`);

  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

  // Cargar traducción existente (tiene name/columns/note ya traducidos)
  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    console.log(`  📂 Loaded existing (has metadata translated)`);
  }

  // Deep clone del original completo
  const result = JSON.parse(JSON.stringify(original));

  // Copiar metadata ya traducida del existing
  if (existing.categories) {
    existing.categories.forEach((existCat, ci) => {
      if (result.categories[ci]) {
        result.categories[ci].name = existCat.name || result.categories[ci].name;
        if (existCat.tables) {
          existCat.tables.forEach((existTable, ti) => {
            if (result.categories[ci].tables[ti]) {
              const t = result.categories[ci].tables[ti];
              t.name = existTable.name || t.name;
              t.note = existTable.note || t.note;
              if (existTable.columns && t.columns) {
                existTable.columns.forEach((col, coli) => {
                  if (t.columns[coli]) t.columns[coli].label = col.label;
                });
              }
            }
          });
        }
      }
    });
  }

  // Extraer celdas de texto de data[]
  const toTranslate = [];
  const locations = [];

  result.categories.forEach((cat, ci) => {
    cat.tables.forEach((table, ti) => {
      if (!table.data) return;
      table.data.forEach((row, ri) => {
        Object.entries(row).forEach(([key, val]) => {
          if (typeof val === 'string' && val.length > 2 && isNaN(val)) {
            toTranslate.push(val);
            locations.push({ ci, ti, ri, key });
          }
        });
      });
    });
  });

  console.log(`  📊 Text cells in data[]: ${toTranslate.length}`);

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

  locations.forEach((loc, idx) => {
    const t = allTranslated[idx];
    if (t) result.categories[loc.ci].tables[loc.ti].data[loc.ri][loc.key] = t;
  });

  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  const sizeKB = (fs.statSync(outPath).size/1024).toFixed(1);
  console.log(`  ✅ Saved forensic_categories_${langCode}.json (${sizeKB} KB)`);
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) { console.error('❌ No API key'); process.exit(1); }

  console.log('🔧 Fixing forensic_categories data[] for all locales...');
  await fixForensicForLocale('English', 'en', apiKey);
  await fixForensicForLocale('German', 'de', apiKey);
  await fixForensicForLocale('Simplified Chinese', 'zh-Hans', apiKey);

  console.log('\n🎉 Done! Run npm run build when ready.');
}

main().catch(console.error);
