import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const fileContent = fs.readFileSync('src/data/glossary.js', 'utf8');
const langs = ['pt', 'fr', 'it', 'de'];

async function run() {
  for (const lang of langs) {
    console.log(`Translating glossary to ${lang}...`);
    let translatedContent = fileContent;
    
    // Find all definition: '...' lines
    const regex = /definition:\s*'([^']+)'/g;
    let match;
    const matches = [];
    
    while ((match = regex.exec(fileContent)) !== null) {
      matches.push({ full: match[0], text: match[1] });
    }
    
    // To avoid rate limiting, we can do them in batches or sequentially
    for (let i = 0; i < matches.length; i++) {
      const item = matches[i];
      try {
        const res = await translate(item.text, { to: lang });
        const safeTranslation = res.text.replace(/'/g, "\\'");
        translatedContent = translatedContent.replace(
          item.full,
          `definition: '${safeTranslation}'`
        );
        if (i % 10 === 0) console.log(`  Progress: ${i}/${matches.length}`);
      } catch (e) {
        console.error("Translation error at index", i, e.message);
      }
    }
    fs.writeFileSync(`src/data/glossary_${lang}.js`, translatedContent);
    console.log(`Saved src/data/glossary_${lang}.js`);
  }
}

run();
