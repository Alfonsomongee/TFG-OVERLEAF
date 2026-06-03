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

function extractStrings(obj, path = '') {
  const results = [];
  if (typeof obj === 'string') {
    if (obj.length > 3 && isNaN(obj) && !obj.startsWith('#') && !obj.startsWith('http')) {
      results.push({ path, value: obj });
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      results.push(...extractStrings(item, `${path}[${i}]`));
    });
  } else if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, val]) => {
      results.push(...extractStrings(val, path ? `${path}.${key}` : key));
    });
  }
  return results;
}

function setByPath(obj, pathStr, value) {
  const parts = pathStr.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
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
Translate from Spanish to ${targetLang}.
Preserve: MW, GW, Hz, kV, IBR, REE, ENTSO-E, ICAI, REN, SCR, GFM, UFLS, PMU.
Preserve numbers, units, dates, and codes.
Return ONLY numbered translations, nothing else.`,
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

async function translateDatosForenses(targetLang, langCode, apiKey) {
  console.log(`\n🌍 Translating datosForenses to ${targetLang}...`);
  
  const srcPath = path.join(ROOT, 'src/data/datosForenses.json');
  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const result = JSON.parse(JSON.stringify(original));
  
  const strings = extractStrings(original);
  console.log(`  📊 Strings to translate: ${strings.length}`);
  
  const BATCH = 40;
  const allTranslated = [];
  
  for (let i = 0; i < strings.length; i += BATCH) {
    const batch = strings.slice(i, i + BATCH);
    const batchNum = Math.floor(i/BATCH) + 1;
    const total = Math.ceil(strings.length/BATCH);
    process.stdout.write(`  Batch ${batchNum}/${total}... `);
    const translated = await translateBatch(
      batch.map(s => s.value), 
      targetLang, 
      apiKey
    );
    allTranslated.push(...translated);
    console.log('done');
    await new Promise(r => setTimeout(r, 600));
  }
  
  strings.forEach((item, idx) => {
    if (allTranslated[idx]) {
      setByPath(result, item.path, allTranslated[idx]);
    }
  });
  
  const outPath = path.join(ROOT, `src/data/datosForenses_${langCode}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
  const sizeKB = (fs.statSync(outPath).size/1024).toFixed(1);
  console.log(`  ✅ Saved datosForenses_${langCode}.json (${sizeKB} KB)`);
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found');
    process.exit(1);
  }
  
  console.log('🔧 Translating datosForenses for DE and zh-Hans...');
  await translateDatosForenses('German', 'de', apiKey);
  await translateDatosForenses('Simplified Chinese', 'zh-Hans', apiKey);
  
  console.log('\n🎉 Done!');
}

main().catch(console.error);
