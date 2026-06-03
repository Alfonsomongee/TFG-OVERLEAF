import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

function loadApiKey() {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const match = env.match(/DEEPSEEK_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }
  return process.env.DEEPSEEK_API_KEY;
}

async function translateBatch(strings, apiKey) {
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
Translate from Spanish to Simplified Chinese (zh-Hans).
Preserve technical acronyms exactly: MW, GW, Hz, kV, IBR, REE, ENTSO-E, ICAI, 
REN, SCR, GFM, GFL, UFLS, PMU, AELEC, RoCoF, HVDC, CCGT, TSO, DSO.
Preserve proper nouns: España, Portugal, Francia, Iberdrola, Endesa, REE.
Return ONLY numbered translations, nothing else.`,
        },
        {
          role: 'user',
          content: `Translate to Simplified Chinese:\n\n${numbered}`,
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

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) { console.error('❌ No API key'); process.exit(1); }

  console.log('🇨🇳 Translating glossary to Simplified Chinese...');

  // Leer glossary-terms.json si existe, si no parsear glossary.js
  let terms = [];
  const jsonPath = path.join(ROOT, 'src/data/glossary-terms.json');
  const jsPath = path.join(ROOT, 'src/data/glossary.js');

  if (fs.existsSync(jsonPath)) {
    terms = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`  📂 Loaded glossary-terms.json: ${terms.length} terms`);
  } else {
    // Parsear el array de glossary.js
    const code = fs.readFileSync(jsPath, 'utf8');
    const match = code.match(/export const GLOSSARY_TERMS\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) throw new Error('Cannot parse GLOSSARY_TERMS from glossary.js');
    terms = eval(match[1].replace(/slugify\([^)]+\)/g, '"term"'));
    console.log(`  📂 Parsed glossary.js: ${terms.length} terms`);
  }

  // Extraer términos y definiciones
  const termStrings = terms.map(t => t.term);
  const defStrings = terms.map(t => t.definition);

  console.log(`  📊 Terms to translate: ${terms.length}`);
  console.log(`  📊 Total strings: ${terms.length * 2}`);

  // Traducir términos en batches
  const BATCH = 40;
  const translatedTerms = [];
  const translatedDefs = [];

  console.log('\n  Translating term names...');
  for (let i = 0; i < termStrings.length; i += BATCH) {
    const batch = termStrings.slice(i, i + BATCH);
    const batchNum = Math.floor(i/BATCH) + 1;
    const total = Math.ceil(termStrings.length/BATCH);
    process.stdout.write(`  Batch ${batchNum}/${total}... `);
    const translated = await translateBatch(batch, apiKey);
    translatedTerms.push(...translated);
    console.log('done');
    await new Promise(r => setTimeout(r, 600));
  }

  console.log('\n  Translating definitions...');
  for (let i = 0; i < defStrings.length; i += BATCH) {
    const batch = defStrings.slice(i, i + BATCH);
    const batchNum = Math.floor(i/BATCH) + 1;
    const total = Math.ceil(defStrings.length/BATCH);
    process.stdout.write(`  Batch ${batchNum}/${total}... `);
    const translated = await translateBatch(batch, apiKey);
    translatedDefs.push(...translated);
    console.log('done');
    await new Promise(r => setTimeout(r, 600));
  }

  // Generar glossary_zh-Hans.js con misma estructura
  const entries = terms.map((t, i) => {
    const termZH = translatedTerms[i] || t.term;
    const defZH = translatedDefs[i] || t.definition;
    return `  {
    id: '${t.id}',
    letter: '${t.letter}',
    term: '${t.term}',
    termZH: ${JSON.stringify(termZH)},
    definition: ${JSON.stringify(defZH)},
  }`;
  }).join(',\n');

  const output = `// Auto-generated — Simplified Chinese glossary
// Generated: ${new Date().toISOString()}
export const GLOSSARY_TERMS = [\n${entries}\n];\n`;

  const outPath = path.join(ROOT, 'src/data/glossary_zh-Hans.js');
  fs.writeFileSync(outPath, output, 'utf8');
  const sizeKB = (fs.statSync(outPath).size/1024).toFixed(1);
  console.log(`\n  ✅ Saved glossary_zh-Hans.js (${sizeKB} KB)`);
  console.log('\n🎉 Done!');
}

main().catch(console.error);
