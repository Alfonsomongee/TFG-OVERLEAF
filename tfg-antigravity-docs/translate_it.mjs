import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const fileContent = fs.readFileSync('src/data/glossary.js', 'utf8');

async function run() {
  const lang = 'it';
  console.log(`Translating glossary to ${lang}...`);
  let translatedContent = fileContent;
  
  // Find all objects
  // The structure is roughly:
  // term: '...',
  // definition: '...',
  
  const termRegex = /term:\s*'([^']+)'/g;
  let termMatch;
  const termMatches = [];
  while ((termMatch = termRegex.exec(fileContent)) !== null) {
    termMatches.push({ full: termMatch[0], text: termMatch[1] });
  }

  for (let i = 0; i < termMatches.length; i++) {
    const item = termMatches[i];
    try {
      const res = await translate(item.text, { to: lang });
      const safeTranslation = res.text.replace(/'/g, "\\'");
      translatedContent = translatedContent.replace(
        item.full,
        `term: '${safeTranslation}'`
      );
    } catch (e) {
      console.error("Translation error at term index", i, e.message);
    }
  }

  const defRegex = /definition:\s*'([^']+)'/g;
  let defMatch;
  const defMatches = [];
  while ((defMatch = defRegex.exec(fileContent)) !== null) {
    defMatches.push({ full: defMatch[0], text: defMatch[1] });
  }

  for (let i = 0; i < defMatches.length; i++) {
    const item = defMatches[i];
    try {
      const res = await translate(item.text, { to: lang });
      const safeTranslation = res.text.replace(/'/g, "\\'");
      translatedContent = translatedContent.replace(
        item.full,
        `definition: '${safeTranslation}'`
      );
      if (i % 10 === 0) console.log(`  Progress: ${i}/${defMatches.length}`);
    } catch (e) {
      console.error("Translation error at def index", i, e.message);
    }
  }

  fs.writeFileSync(`src/data/glossary_${lang}.js`, translatedContent);
  console.log(`Saved src/data/glossary_${lang}.js`);
}

run();
