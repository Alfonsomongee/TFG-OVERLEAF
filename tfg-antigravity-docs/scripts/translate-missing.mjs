// scripts/translate-missing.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const FILES_TO_TRANSLATE = [
  {
    src: 'i18n/en/docusaurus-plugin-content-docs/current/07b-consecuencias-financieras.mdx',
    language: 'English',
  },
  {
    src: 'i18n/en/docusaurus-plugin-content-docs/current/dimension-europea/01-francia-portugal.mdx',
    language: 'English',
  },
  {
    src: 'i18n/en/docusaurus-plugin-content-docs/current/dimension-europea/02-coordinacion-continental.mdx',
    language: 'English',
  },
  {
    src: 'i18n/en/docusaurus-plugin-content-docs/current/dimension-europea/03-dia-despues.mdx',
    language: 'English',
  },
  {
    src: 'i18n/de/docusaurus-plugin-content-docs/current/dimension-europea/01-francia-portugal.mdx',
    language: 'German',
  },
  {
    src: 'i18n/de/docusaurus-plugin-content-docs/current/dimension-europea/02-coordinacion-continental.mdx',
    language: 'German',
  },
  {
    src: 'i18n/de/docusaurus-plugin-content-docs/current/dimension-europea/03-dia-despues.mdx',
    language: 'German',
  },
];

const SYSTEM_PROMPT = `You are a professional technical translator specializing in electrical engineering and energy systems. You translate MDX documents (Markdown + React JSX) from Spanish into the target language.

CRITICAL RULES — follow these exactly:
1. Translate ONLY the natural language text (prose, headings text, table cell text, alt text).
2. NEVER translate or modify:
   - Import statements (import X from 'Y')
   - JSX component names (<GlitchTitle>, <ForensicTable>, etc.)
   - JSX attribute names (className, src, etc.)
   - Code blocks (content between triple backticks)
   - Math expressions (between $ or $$)
   - URLs, slugs, file paths
   - Variable names
3. For frontmatter: translate the VALUES of title, sidebar_label if they are human-readable text. Never touch the keys.
4. Preserve all blank lines, indentation, and formatting exactly.
5. Preserve all Markdown syntax (##, **, _, >, -, etc.)
6. Return ONLY the translated MDX content, no explanations, no markdown code fences around the output.`;

function loadApiKey() {
  const envPath = path.join(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DEEPSEEK_API_KEY=(.+)/);
    if (match) return match[1].trim();
  }
  return process.env.DEEPSEEK_API_KEY;
}

async function translateWithDeepSeek(content, language, apiKey) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `Translate the following MDX document from Spanish to ${language}. Return only the translated content, no explanations.\n\n${content}`,
        },
      ],
      temperature: 0.1,
      max_tokens: 8000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function translateFile(filePath, language, apiKey) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n📄 Translating to ${language}: ${path.basename(filePath)}`);
  console.log(`   Size: ${(content.length / 1024).toFixed(1)} KB`);

  const CHUNK_SIZE = 6000;
  let translated = '';

  if (content.length <= CHUNK_SIZE) {
    translated = await translateWithDeepSeek(content, language, apiKey);
  } else {
    const paragraphs = content.split('\n\n');
    let currentChunk = '';
    const chunks = [];

    for (const para of paragraphs) {
      if ((currentChunk + '\n\n' + para).length > CHUNK_SIZE && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = para;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    console.log(`   Splitting into ${chunks.length} chunks...`);
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`   Chunk ${i + 1}/${chunks.length}...`);
      const chunkTranslated = await translateWithDeepSeek(chunks[i], language, apiKey);
      translated += (i > 0 ? '\n\n' : '') + chunkTranslated;
      await new Promise(r => setTimeout(r, 800));
    }
  }

  const backupPath = filePath + '.bak';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   📦 Backup saved`);
  }

  fs.writeFileSync(filePath, translated, 'utf8');
  console.log(`   ✅ Done (${(translated.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const apiKey = loadApiKey();
  
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('🌍 Starting translation with DeepSeek...');
  console.log(`📋 Files to translate: ${FILES_TO_TRANSLATE.length}`);

  for (const file of FILES_TO_TRANSLATE) {
    const fullPath = path.join(ROOT, file.src);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  Not found, skipping: ${file.src}`);
      continue;
    }
    try {
      await translateFile(fullPath, file.language, apiKey);
      await new Promise(r => setTimeout(r, 1200));
    } catch (err) {
      console.error(`❌ Error: ${file.src}:`, err.message);
    }
  }

  console.log('\n🎉 Translation complete!');
  console.log('🔨 Now run: npm run build');
}

main();
