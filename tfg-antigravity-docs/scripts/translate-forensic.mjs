// scripts/translate-forensic.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'static/data/processed/forensic_categories.json');

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
  const numbered = strings.map((s, i) => `${i + 1}. ${s}`).join('\n');
  
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
          content: `You are a technical translator specializing in electrical engineering and power systems. 
Translate the following numbered strings from Spanish to ${targetLang}.
Rules:
- Keep the same numbering format (1. 2. 3. etc.)
- Preserve technical acronyms as-is: MW, GW, Hz, kV, IBR, TSO, REE, ENTSO-E, REN, ICAI, SCR, GFM, GFL, UFLS, PMU, EAS, DSO, CCGT, P.O., etc.
- Preserve units: MW, GW, Hz, kV, s, %
- Preserve proper nouns: España, Portugal, Francia, REE, REN, ENTSO-E, Iberia, Iberdrola, Endesa, etc.
- Return ONLY the numbered translations, nothing else.`,
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

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || '';
  
  // Parse numbered responses back to array
  const lines = result.split('\n').filter(l => l.trim());
  const translated = [];
  
  for (const line of lines) {
    const match = line.match(/^\d+\.\s+(.+)$/);
    if (match) {
      translated.push(match[1].trim());
    }
  }
  
  if (translated.length !== strings.length) {
    console.warn(`  ⚠️  Expected ${strings.length} translations, got ${translated.length}`);
    // Pad with originals if something went wrong
    while (translated.length < strings.length) {
      translated.push(strings[translated.length]);
    }
  }
  
  return translated;
}

async function translateForensicCategories(targetLang, langCode, apiKey) {
  console.log(`\n🌍 Translating forensic_categories to ${targetLang}...`);
  
  const original = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const translated = JSON.parse(JSON.stringify(original)); // deep clone
  
  // Extract all translatable strings
  const toTranslate = [];
  const locations = []; // track where each string lives
  
  original.categories.forEach((cat, ci) => {
    // Category name
    toTranslate.push(cat.name);
    locations.push({ type: 'catName', ci });
    
    cat.tables.forEach((table, ti) => {
      // Table name
      toTranslate.push(table.name);
      locations.push({ type: 'tableName', ci, ti });
      
      // Column labels
      if (table.columns) {
        table.columns.forEach((col, coli) => {
          toTranslate.push(col.label);
          locations.push({ type: 'colLabel', ci, ti, coli });
        });
      }
      
      // Note
      if (table.note) {
        toTranslate.push(table.note);
        locations.push({ type: 'note', ci, ti });
      }
    });
  });
  
  console.log(`  📊 Strings to translate: ${toTranslate.length}`);
  
  // Translate in batches of 40 to avoid token limits
  const BATCH = 40;
  const allTranslated = [];
  
  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    const batchNum = Math.floor(i / BATCH) + 1;
    const totalBatches = Math.ceil(toTranslate.length / BATCH);
    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} strings)...`);
    
    const result = await translateBatch(batch, targetLang, apiKey);
    allTranslated.push(...result);
    
    await new Promise(r => setTimeout(r, 800));
  }
  
  // Reinjection
  locations.forEach((loc, idx) => {
    const t = allTranslated[idx];
    if (!t) return;
    
    if (loc.type === 'catName') {
      translated.categories[loc.ci].name = t;
    } else if (loc.type === 'tableName') {
      translated.categories[loc.ci].tables[loc.ti].name = t;
    } else if (loc.type === 'colLabel') {
      translated.categories[loc.ci].tables[loc.ti].columns[loc.coli].label = t;
    } else if (loc.type === 'note') {
      translated.categories[loc.ci].tables[loc.ti].note = t;
    }
  });
  
  // Save
  const outPath = path.join(ROOT, `static/data/processed/forensic_categories_${langCode}.json`);
  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf8');
  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`  ✅ Saved: forensic_categories_${langCode}.json (${sizeKB} KB)`);
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }
  
  await translateForensicCategories('English', 'en', apiKey);
  await translateForensicCategories('German', 'de', apiKey);
  
  console.log('\n🎉 Done! Now update ForensicGallery.jsx to load the correct JSON per locale.');
  console.log('🔨 Then run: npm run build');
}

main().catch(console.error);
