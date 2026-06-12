const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF';
const docFolder = path.join(workspaceDir, 'tfg-antigravity-docs');
const envLocalPath = path.join(docFolder, '.env.local');

// Parse API keys
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const deepseekKey = envContent.match(/DEEPSEEK_API_KEY=["']?([^"'\r\n]+)/)?.[1];

if (!deepseekKey) {
  console.error('Error: DEEPSEEK_API_KEY not found in .env.local');
  process.exit(1);
}

// Target languages
const targets = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'zh-Hans', name: 'Simplified Chinese' }
];

// Helper to recursively walk directory
function walkDocs(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDocs(filePath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (((ext === '.md' || ext === '.mdx' || file === '_category_.json') && !file.endsWith('.bak'))) {
        results.push(filePath);
      }
    }
  });
  return results;
}

// Translate plain text/labels
async function translateText(text, langName) {
  const systemPrompt = `You are a professional academic translator. Translate the following short text from Spanish to ${langName}. Keep all punctuation and formatting unchanged. Return ONLY the translated string without any quotes or explanations.`;
  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim().replace(/^"(.*)"$/, '$1');
      }
    } catch (e) {
      console.warn(`    Text translation connection failed: ${e.message}`);
    }
    attempts--;
    await new Promise(r => setTimeout(r, 2000));
  }
  return text; // fallback to original
}

// Translate a single file content
async function translateMDX(content, langName) {
  const systemPrompt = `You are a professional academic translator specializing in energy engineering, power systems, and interactive documentation.
Translate the following Docusaurus markdown/MDX document from Spanish to ${langName}.

CRITICAL RULES:
1. Keep all React/JSX import statements exactly as they are. Do not translate them.
2. Keep all JSX tags (e.g. <EsiosChart ... />, <VerticalTimeline />, etc.) and HTML tags completely unchanged.
3. Keep all JSX component attributes unchanged (like 'id', 'className', 'locale', etc.) EXCEPT for attributes that contain visible text to translate (like 'title="Flujo"', 'description="..."', 'sidebar_label="..."'). Translate only the string values of those attributes.
4. Keep all LaTeX mathematical formulas delimited by $...$, $$...$$, \\(...\\), or \\[...\\] completely unchanged.
5. Keep all markdown links, image references, and file paths (e.g., ![collage](img/coll.png)) unchanged, unless the link text itself needs translation.
6. Translate Frontmatter YAML keys (like title, sidebar_label, description) values, but keep the keys unchanged. CRITICAL: Never translate or modify the 'id' key's value in the frontmatter; it must remain exactly as it is in the source text.
7. Return ONLY the translated document content. Do NOT wrap it in any markdown code block (like \`\`\`mdx or \`\`\`md) and do NOT add any introductory or concluding remarks.
8. If the text has no translatable content (only imports and a component), return the text exactly as it is.`;

  let attempts = 3;
  while (attempts > 0) {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: content }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        let result = data.choices[0].message.content.trim();
        // Remove markdown block if model added it
        if (result.startsWith('```')) {
          result = result.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
        }
        return result;
      } else {
        const errText = await response.text();
        console.warn(`    API Error (Status ${response.status}): ${errText}`);
      }
    } catch (e) {
      console.warn(`    Connection failed: ${e.message}`);
    }
    attempts--;
    if (attempts > 0) {
      const waitTime = (3 - attempts) * 10000; // 10s on first retry, 20s on second
      console.log(`    Retrying in ${waitTime / 1000} seconds... (${attempts} attempts left)`);
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
  throw new Error('Failed to translate after 3 attempts');
}

async function run() {
  const docsDir = path.join(docFolder, 'docs');
  const files = walkDocs(docsDir);
  console.log(`Found ${files.length} active documents/categories to translate.`);

  // Iterate by language first (English is priority)
  for (const target of targets) {
    console.log(`\n==========================================`);
    console.log(`Starting translations for: ${target.name} (${target.code})`);
    console.log(`==========================================`);

    for (let i = 0; i < files.length; i++) {
      const srcFile = files[i];
      const relPath = path.relative(docsDir, srcFile);
      const destFile = path.join(docFolder, 'i18n', target.code, 'docusaurus-plugin-content-docs', 'current', relPath);

      // Skip if destination is up-to-date
      if (fs.existsSync(destFile)) {
        const srcStat = fs.statSync(srcFile);
        const destStat = fs.statSync(destFile);
        if (destStat.mtimeMs > srcStat.mtimeMs) {
          console.log(`  Skipped (already up-to-date): ${relPath}`);
          continue;
        }
      }

      console.log(`[${target.code}] [${i + 1}/${files.length}] Translating ${relPath}...`);

      const content = fs.readFileSync(srcFile, 'utf8');
      
      // Create destination directory if not exists
      const destDir = path.dirname(destFile);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      try {
        if (path.basename(srcFile) === '_category_.json') {
          const jsonContent = JSON.parse(content);
          if (jsonContent.label) {
            jsonContent.label = await translateText(jsonContent.label, target.name);
          }
          if (jsonContent.link && jsonContent.link.description) {
            jsonContent.link.description = await translateText(jsonContent.link.description, target.name);
          }
          fs.writeFileSync(destFile, JSON.stringify(jsonContent, null, 2), 'utf8');
          console.log(`  Saved JSON to: ${path.relative(docFolder, destFile)}`);
        } else {
          const translatedContent = await translateMDX(content, target.name);
          fs.writeFileSync(destFile, translatedContent, 'utf8');
          console.log(`  Saved MDX to: ${path.relative(docFolder, destFile)}`);
        }
      } catch (e) {
        console.error(`  ERROR: Failed to translate ${relPath} to ${target.code}:`, e.message);
      }

      // Respect rate limits: 3 second pause between files
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log('\nAll translations complete!');
}

run();
