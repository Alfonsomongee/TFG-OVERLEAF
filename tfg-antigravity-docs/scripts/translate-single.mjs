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
          3. For the frontmatter, only translate the values.
          4. KEEP the exact same 'href' and standard markdown link URLs (e.g. ./anexo-...). Only translate the link text.
          5. Keep all markdown formatting, React components, HTML tags, and styles EXACTLY as they are.
          6. Return ONLY the translated MDX text without any markdown wrappers.`,
        },
        {
          role: 'user',
          content: content,
        },
      ],
      temperature: 0.1,
      max_tokens: 8000,
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

  const file = process.argv[2];
  const langCode = process.argv[3];
  
  const langs = {
    'en': 'English',
    'de': 'German',
    'zh-Hans': 'Simplified Chinese'
  };
  const targetLang = langs[langCode];

  if (!file || !targetLang) {
    console.error('Usage: node translate-single.mjs <file> <langCode>');
    process.exit(1);
  }

  const srcPath = path.join(ROOT, 'docs', file);
  const content = fs.readFileSync(srcPath, 'utf8');

  console.log(`Translating ${file} to ${targetLang}...`);
  try {
    const translated = await translateMdx(content, targetLang, apiKey);
    const outDir = path.join(ROOT, `i18n/${langCode}/docusaurus-plugin-content-docs/current`);
    const outPath = path.join(outDir, file);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, translated, 'utf8');
    console.log(`✅ Saved ${outPath}`);
  } catch (e) {
    console.error(`❌ Error:`, e.message);
  }
}

main().catch(console.error);
