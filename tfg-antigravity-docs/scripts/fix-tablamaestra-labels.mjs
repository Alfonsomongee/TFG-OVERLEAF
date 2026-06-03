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

// Extraer todas las keys que tienen valor (las filas de la tabla)
function extractKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    if (key.startsWith('_')) continue;
    const val = obj[key];
    if (val && typeof val === 'object' && !Array.isArray(val) && val.valor !== undefined) {
      keys.push({ path: prefix + key, label: key.replace(/_/g, ' ') });
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      keys.push(...extractKeys(val, prefix + key + '.'));
    }
  }
  return keys;
}

// Inyectar label en el JSON por path
function injectLabel(obj, pathStr, label) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
    if (!current) return;
  }
  const lastKey = parts[parts.length - 1];
  if (current[lastKey] && typeof current[lastKey] === 'object') {
    current[lastKey].label = label;
  }
}

async function translateLabels(labels, targetLang, apiKey) {
  const numbered = labels.map((l, i) => `${i+1}. ${l}`).join('\n');
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
Translate these Spanish variable names/labels to ${targetLang}.
They describe electrical system measurements and data points.
Keep translations concise (2-5 words max).
Preserve: MW, GW, Hz, kV, IBR, REE, ENTSO-E.
Return ONLY numbered translations.`,
        },
        {
          role: 'user',
          content: `Translate to ${targetLang}:\n\n${numbered}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 2000,
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
  while (translated.length < labels.length) {
    translated.push(labels[translated.length]);
  }
  return translated;
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) { console.error('❌ No API key'); process.exit(1); }

  const srcPath = path.join(ROOT, 'src/data/datosForenses.json');
  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  
  // Extraer las 59 keys
  const keyEntries = extractKeys(original);
  const spanishLabels = keyEntries.map(k => k.label);
  
  console.log(`📊 Total keys to label: ${keyEntries.length}`);
  console.log('First 5:', spanishLabels.slice(0,5));

  const locales = [
    { file: 'datosForenses.json', lang: 'Spanish', labels: spanishLabels },
    { file: 'datosForenses_en.json', lang: 'English', labels: null },
    { file: 'datosForenses_de.json', lang: 'German', labels: null },
    { file: 'datosForenses_zh-Hans.json', lang: 'Simplified Chinese', labels: null },
  ];

  // Traducir labels para cada idioma
  for (const locale of locales) {
    console.log(`\n🌍 Processing ${locale.lang}...`);
    
    let labels = locale.labels;
    if (!labels) {
      process.stdout.write(`  Translating ${keyEntries.length} labels... `);
      labels = await translateLabels(spanishLabels, locale.lang, apiKey);
      console.log('done');
      await new Promise(r => setTimeout(r, 600));
    }

    // Cargar JSON e inyectar labels
    const filePath = path.join(ROOT, 'src/data', locale.file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    keyEntries.forEach((entry, idx) => {
      injectLabel(data, entry.path, labels[idx]);
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`  ✅ Saved ${locale.file}`);
  }

  // Actualizar flattenData en TablaMaestra28A para usar label
  console.log('\n📝 Updating TablaMaestra28A/index.jsx...');
  const componentPath = path.join(ROOT, 'src/components/TablaMaestra28A/index.jsx');
  let code = fs.readFileSync(componentPath, 'utf8');
  
  code = code.replace(
    "name: key.replace(/_/g, ' '),",
    "name: val.label || key.replace(/_/g, ' '),"
  );
  
  fs.writeFileSync(componentPath, code, 'utf8');
  console.log('  ✅ flattenData now uses val.label');

  console.log('\n🎉 Done! Run npm run build when ready.');
}

main().catch(console.error);
