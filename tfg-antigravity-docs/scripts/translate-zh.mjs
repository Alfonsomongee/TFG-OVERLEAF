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

async function translateText(text, apiKey) {
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
Translate the following Spanish MDX content to Simplified Chinese (zh-Hans).
Rules:
- Preserve ALL MDX syntax: import statements, JSX components, frontmatter (---)
- Preserve technical acronyms: MW, GW, Hz, kV, IBR, TSO, REE, ENTSO-E, REN, SCR, GFM, GFL, UFLS, PMU
- Preserve proper nouns: España, Portugal, Francia, REE, REN, ENTSO-E, Iberdrola, Endesa
- Preserve all URLs, file paths, and code blocks unchanged
- Translate only human-readable Spanish text
- Return ONLY the translated content, no explanations`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.1,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function translateMDXFiles(apiKey) {
  const srcDir = path.join(ROOT, 'docs');
  const outDir = path.join(
    ROOT, 
    'i18n/zh-Hans/docusaurus-plugin-content-docs/current'
  );

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(path.join(outDir, 'dimension-europea'), { recursive: true });

  function getMDXFiles(dir, base = '') {
    const files = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
      const rel = base ? `${base}/${f.name}` : f.name;
      if (f.isDirectory()) {
        files.push(...getMDXFiles(path.join(dir, f.name), rel));
      } else if (f.name.endsWith('.mdx') || f.name.endsWith('.md')) {
        files.push(rel);
      }
    });
    return files;
  }

  const files = getMDXFiles(srcDir);
  console.log(`\n📄 MDX files to translate: ${files.length}`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const outPath = path.join(outDir, file);

    if (fs.existsSync(outPath)) {
      console.log(`  ⏭️  Skip (exists): ${file}`);
      continue;
    }

    console.log(`  [${i+1}/${files.length}] Translating: ${file}...`);
    const content = fs.readFileSync(path.join(srcDir, file), 'utf8');

    try {
      const translated = await translateText(content, apiKey);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, translated, 'utf8');
      console.log(`  ✅ Done: ${file}`);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`  ❌ Error: ${file} — ${err.message}`);
    }
  }
}

async function translateCodeJson(apiKey) {
  console.log('\n🔤 Translating code.json...');
  const src = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'i18n/en/code.json'), 'utf8')
  );

  const keys = Object.keys(src);
  const values = keys.map(k => src[k].message);
  const BATCH = 50;
  const allTranslated = [];

  for (let i = 0; i < values.length; i += BATCH) {
    const batch = values.slice(i, i + BATCH);
    const numbered = batch.map((v, j) => `${j+1}. ${v}`).join('\n');

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
            content: `Translate UI strings from English to Simplified Chinese.
Keep: numbering, technical terms (MW, Hz, kV, IBR, REE), placeholders {0} {count}.
Return ONLY numbered translations.`,
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

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || '';
    const lines = result.split('\n').filter(l => l.trim());
    lines.forEach(line => {
      const match = line.match(/^\d+\.\s+(.+)$/);
      if (match) allTranslated.push(match[1].trim());
    });
    await new Promise(r => setTimeout(r, 800));
  }

  const translated = {};
  keys.forEach((k, i) => {
    translated[k] = { message: allTranslated[i] || src[k].message };
  });

  const outDir = path.join(ROOT, 'i18n/zh-Hans');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'code.json'),
    JSON.stringify(translated, null, 2),
    'utf8'
  );
  console.log(`  ✅ code.json: ${Object.keys(translated).length} strings`);
}

async function translateForensicJson(apiKey) {
  console.log('\n🗂️  Translating forensic_categories.json...');
  const srcPath = path.join(
    ROOT, 
    'static/data/processed/forensic_categories.json'
  );
  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const translated = JSON.parse(JSON.stringify(original));

  const toTranslate = [];
  const locations = [];

  original.categories.forEach((cat, ci) => {
    toTranslate.push(cat.name);
    locations.push({ type: 'catName', ci });
    cat.tables.forEach((table, ti) => {
      toTranslate.push(table.name);
      locations.push({ type: 'tableName', ci, ti });
      if (table.columns) {
        table.columns.forEach((col, coli) => {
          toTranslate.push(col.label);
          locations.push({ type: 'colLabel', ci, ti, coli });
        });
      }
      if (table.note) {
        toTranslate.push(table.note);
        locations.push({ type: 'note', ci, ti });
      }
    });
  });

  console.log(`  📊 Strings: ${toTranslate.length}`);
  const BATCH = 40;
  const allTranslated = [];

  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    const numbered = batch.map((s, j) => `${j+1}. ${s}`).join('\n');

    const resp = await fetch('https://api.deepseek.com/chat/completions', {
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
Translate Spanish to Simplified Chinese.
Preserve: MW, GW, Hz, kV, IBR, REE, ENTSO-E, España, Portugal.
Return ONLY numbered translations.`,
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

    const d = await resp.json();
    const r = d.choices?.[0]?.message?.content || '';
    const lines = r.split('\n').filter(l => l.trim());
    const batchResult = [];
    for (const line of lines) {
      const m = line.match(/^\d+\.\s+(.+)$/);
      if (m) batchResult.push(m[1].trim());
    }
    while (batchResult.length < batch.length) {
      batchResult.push(batch[batchResult.length]);
    }
    allTranslated.push(...batchResult);
    console.log(
      `  Batch ${Math.floor(i/BATCH)+1}/` +
      `${Math.ceil(toTranslate.length/BATCH)} done`
    );
    await new Promise(r => setTimeout(r, 800));
  }

  locations.forEach((loc, idx) => {
    const t = allTranslated[idx];
    if (!t) return;
    if (loc.type === 'catName') 
      translated.categories[loc.ci].name = t;
    else if (loc.type === 'tableName') 
      translated.categories[loc.ci].tables[loc.ti].name = t;
    else if (loc.type === 'colLabel') 
      translated.categories[loc.ci].tables[loc.ti].columns[loc.coli].label = t;
    else if (loc.type === 'note') 
      translated.categories[loc.ci].tables[loc.ti].note = t;
  });

  const outPath = path.join(
    ROOT, 
    'static/data/processed/forensic_categories_zh-Hans.json'
  );
  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf8');
  console.log('  ✅ Saved forensic_categories_zh-Hans.json');
}

async function translateTablas(apiKey) {
  console.log('\n📋 Translating tablasdefinitivas.json...');
  const srcPath = path.join(ROOT, 'static/data/tablasdefinitivas.json');
  const original = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const translated = JSON.parse(JSON.stringify(original));

  const toTranslate = [];
  const locations = [];

  if (original.categories) {
    original.categories.forEach((cat, ci) => {
      toTranslate.push(cat.name || cat.title || '');
      locations.push({ type: 'catName', ci });
      if (cat.tables) {
        cat.tables.forEach((table, ti) => {
          if (table.name) {
            toTranslate.push(table.name);
            locations.push({ type: 'tableName', ci, ti });
          }
          if (table.columns) {
            table.columns.forEach((col, coli) => {
              toTranslate.push(col.label || col.name || '');
              locations.push({ type: 'colLabel', ci, ti, coli });
            });
          }
        });
      }
    });
  }

  if (toTranslate.length === 0) {
    console.log('  ⚠️  No translatable strings found, copying as-is');
    const outPath = path.join(
      ROOT, 
      'static/data/tablasdefinitivas_zh-Hans.json'
    );
    fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf8');
    return;
  }

  console.log(`  📊 Strings: ${toTranslate.length}`);
  const BATCH = 40;
  const allTranslated = [];

  for (let i = 0; i < toTranslate.length; i += BATCH) {
    const batch = toTranslate.slice(i, i + BATCH);
    const numbered = batch.map((s, j) => `${j+1}. ${s}`).join('\n');

    const resp = await fetch('https://api.deepseek.com/chat/completions', {
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
            content: `Technical translator. Translate Spanish to Simplified Chinese.
Preserve: MW, GW, Hz, kV, IBR, REE, ENTSO-E.
Return ONLY numbered translations.`,
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

    const d = await resp.json();
    const r = d.choices?.[0]?.message?.content || '';
    const lines = r.split('\n').filter(l => l.trim());
    const batchResult = [];
    for (const line of lines) {
      const m = line.match(/^\d+\.\s+(.+)$/);
      if (m) batchResult.push(m[1].trim());
    }
    while (batchResult.length < batch.length) {
      batchResult.push(batch[batchResult.length]);
    }
    allTranslated.push(...batchResult);
    await new Promise(r => setTimeout(r, 800));
  }

  locations.forEach((loc, idx) => {
    const t = allTranslated[idx];
    if (!t) return;
    if (loc.type === 'catName')
      translated.categories[loc.ci].name = t;
    else if (loc.type === 'tableName')
      translated.categories[loc.ci].tables[loc.ti].name = t;
    else if (loc.type === 'colLabel')
      translated.categories[loc.ci].tables[loc.ti].columns[loc.coli].label = t;
  });

  const outPath = path.join(
    ROOT, 
    'static/data/tablasdefinitivas_zh-Hans.json'
  );
  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2), 'utf8');
  console.log('  ✅ Saved tablasdefinitivas_zh-Hans.json');
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('🇨🇳 Starting Simplified Chinese (zh-Hans) translation...');
  console.log('================================================');

  await translateCodeJson(apiKey);
  await translateTablas(apiKey);
  await translateForensicJson(apiKey);
  await translateMDXFiles(apiKey);

  console.log('\n================================================');
  console.log('🎉 All done! Next steps:');
  console.log('  1. Update ForensicGallery.jsx for zh-Hans');
  console.log('  2. npm run build');
  console.log('  3. git push');
}

main().catch(console.error);
