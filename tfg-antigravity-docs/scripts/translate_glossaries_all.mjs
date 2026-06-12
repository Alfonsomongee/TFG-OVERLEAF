import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GLOSSARY_TERMS } from '../src/data/glossary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load API key from env files
function loadApiKey() {
  for (const file of ['.env.local', '.env']) {
    const envPath = path.join(ROOT, file);
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, 'utf8');
      const match = env.match(/DEEPSEEK_API_KEY\s*=\s*(.+)/);
      if (match) {
        return match[1].trim().replace(/['"]/g, '');
      }
    }
  }
  return process.env.DEEPSEEK_API_KEY;
}

// Compute starting letter for grouping
function getStartingLetter(term, lang, esLetter) {
  if (lang === 'zh-Hans') {
    return esLetter; // Keep Spanish letter for Chinese UI grouping
  }
  const cleanTerm = term.trim().replace(/^[^a-zA-Z0-9]+/, '');
  if (cleanTerm.length === 0) return esLetter;
  let firstChar = cleanTerm.charAt(0).toUpperCase();
  // Normalize accent (e.g. Ä -> A)
  firstChar = firstChar.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return firstChar;
}

// Translate a batch of glossary entries
async function translateBatch(batch, targetLangName, apiKey, retries = 3) {
  const systemPrompt = `You are a professional academic translator specializing in energy engineering, power systems, and interactive documentation.
Translate the given glossary entries (term names and definitions) from Spanish to ${targetLangName}.

CRITICAL RULES:
1. Translate both the "term" name and the "definition" accurately.
2. Keep the "id" exactly unchanged (it must be identical to the input).
3. Do NOT change technical abbreviations and acronyms: MW, GW, Hz, kV, IBR, REE, ENTSO-E, ICAI, REN, SCR, GFM, GFL, UFLS, PMU, AELEC, RoCoF, HVDC, CCGT, TSO, DSO, OLTC, AGC, FCR, PSS, POD, STATCOM, SCADA, WAMS, NTC, VoLL.
4. Keep proper nouns (e.g., España, Portugal, Francia, Iberdrola, Endesa, REE) unchanged or translated as appropriate for ${targetLangName}.
5. Keep LaTeX mathematical formulas (delimited by $...$, $$...$$, \\(...\\), or \\[...\\]) completely unchanged.
6. The output MUST be a valid JSON object matching this schema:
{
  "terms": [
    {
      "id": "original_id",
      "term": "translated_term_name",
      "definition": "translated_definition_text"
    }
  ]
}
7. Return ONLY the JSON object, no introductory or concluding remarks, and do NOT wrap it in markdown code blocks like \`\`\`json.`;

  const inputJson = JSON.stringify({ terms: batch }, null, 2);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Translate these glossary entries to ${targetLangName}:\n\n${inputJson}` }
          ],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      
      // Clean up markdown block wrappers if any
      let cleaned = rawContent.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
      }

      const parsed = JSON.parse(cleaned);
      if (!parsed.terms || !Array.isArray(parsed.terms)) {
        throw new Error('Invalid response format: missing "terms" array');
      }

      if (parsed.terms.length !== batch.length) {
        throw new Error(`Length mismatch: expected ${batch.length}, got ${parsed.terms.length}`);
      }

      // Verify that all IDs are preserved
      for (let i = 0; i < batch.length; i++) {
        if (parsed.terms[i].id !== batch[i].id) {
          throw new Error(`ID mismatch at index ${i}: expected ${batch[i].id}, got ${parsed.terms[i].id}`);
        }
      }

      return parsed.terms;
    } catch (e) {
      console.warn(`⚠️ Attempt ${attempt} failed: ${e.message}`);
      if (attempt === retries) throw e;
      const waitTime = attempt * 2000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY not found in .env.local or .env');
    process.exit(1);
  }

  console.log(`📚 Found ${GLOSSARY_TERMS.length} Spanish terms in glossary.js to translate.`);

  const targets = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'German' },
    { code: 'zh-Hans', name: 'Simplified Chinese' }
  ];

  const BATCH_SIZE = 15;

  for (const target of targets) {
    console.log(`\n🌍 Translating to ${target.name} (${target.code})...`);
    const translatedTerms = [];

    for (let i = 0; i < GLOSSARY_TERMS.length; i += BATCH_SIZE) {
      const batch = GLOSSARY_TERMS.slice(i, i + BATCH_SIZE).map(t => ({
        id: t.id,
        term: t.term,
        definition: t.definition
      }));

      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(GLOSSARY_TERMS.length / BATCH_SIZE);
      console.log(`  [Batch ${batchNum}/${totalBatches}] Processing terms ${i + 1} to ${Math.min(i + BATCH_SIZE, GLOSSARY_TERMS.length)}...`);

      try {
        const translatedBatch = await translateBatch(batch, target.name, apiKey);
        
        // Match with Spanish entries to compute the correct starting letter and structure
        for (let j = 0; j < translatedBatch.length; j++) {
          const esEntry = GLOSSARY_TERMS[i + j];
          const trEntry = translatedBatch[j];
          
          translatedTerms.push({
            id: esEntry.id,
            letter: getStartingLetter(trEntry.term, target.code, esEntry.letter),
            term: trEntry.term,
            definition: trEntry.definition
          });
        }

        // Slight delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) {
        console.error(`❌ Failed to translate batch starting at term ${i + 1} for ${target.name}:`, err.message);
        process.exit(1);
      }
    }

    // Write file to src/data/glossary_[lang].js
    const outPath = path.join(ROOT, `src/data/glossary_${target.code}.js`);
    const fileContent = `// Auto-generated — ${target.name} glossary
// Generated: ${new Date().toISOString()}

export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = ${JSON.stringify(translatedTerms, null, 2)};
`;

    fs.writeFileSync(outPath, fileContent, 'utf8');
    console.log(`✅ Saved ${translatedTerms.length} terms to ${outPath}`);
  }

  console.log('\n🎉 Glossary translation completed successfully for all languages!');
}

main().catch(console.error);
