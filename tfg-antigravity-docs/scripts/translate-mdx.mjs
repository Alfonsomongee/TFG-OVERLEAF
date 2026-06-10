import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function loadApiKey() {
  const envPath = path.join(ROOT, '.env.local');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    const match = env.match(/DEEPSEEK_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }
  return process.env.DEEPSEEK_API_KEY;
}

async function translateMdx(content, targetLang, apiKey) {
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
          content: `You are a technical translator for electrical engineering and power systems. Translate the following Docusaurus MDX file from Spanish to ${targetLang}. 
          IMPORTANT RULES:
          1. DO NOT translate any component names, props, code blocks, frontmatter keys, or import statements.
          2. Translate only the text content (frontmatter values like title and description, normal markdown text, and string values in the items array).
          3. For the frontmatter, only translate the values (e.g., 'title: Datos en Tiempo Real' -> 'title: Real-Time Data').
          4. For the export const items = [...], translate the 'title' and 'description' values inside the objects, but KEEP the exact same 'href' values and variable names.
          5. Keep all markdown formatting, React components (like <DatosTiempoRealGrid items={items1} />), HTML tags, and styles EXACTLY as they are.
          6. Return ONLY the translated MDX text without any markdown wrappers (like \`\`\`mdx).`,
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) throw new Error(`DeepSeek ${response.status}: ${await response.text()}`);
  const data = await response.json();
  let result = data.choices?.[0]?.message?.content || '';
  if (result.startsWith('```mdx')) {
    result = result.replace(/^```mdx\n/, '').replace(/\n```$/, '');
  } else if (result.startsWith('```markdown')) {
    result = result.replace(/^```markdown\n/, '').replace(/\n```$/, '');
  } else if (result.startsWith('```')) {
    result = result.replace(/^```\n/, '').replace(/\n```$/, '');
  }
  return result;
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found');
    process.exit(1);
  }

  const srcPath = path.join(ROOT, 'docs/datos-tiempo-real/index.mdx');
  const content = fs.readFileSync(srcPath, 'utf8');

  const targets = [
    { lang: 'English', code: 'en' },
    { lang: 'German', code: 'de' },
    { lang: 'Simplified Chinese', code: 'zh-Hans' }
  ];

  for (const target of targets) {
    console.log(`Translating to ${target.lang} (${target.code})...`);
    try {
      const translated = await translateMdx(content, target.lang, apiKey);
      const outDir = path.join(ROOT, `i18n/${target.code}/docusaurus-plugin-content-docs/current/datos-tiempo-real`);
      fs.mkdirSync(outDir, { recursive: true });
      const outPath = path.join(outDir, 'index.mdx');
      fs.writeFileSync(outPath, translated, 'utf8');
      console.log(`✅ Saved ${outPath}`);
    } catch (e) {
      console.error(`❌ Error translating to ${target.lang}:`, e.message);
    }
  }

  console.log('\n🎉 All done!');
}

main().catch(console.error);
