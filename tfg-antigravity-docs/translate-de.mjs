import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const fileContent = fs.readFileSync('src/data/glossary.js', 'utf8');

async function run() {
  const lang = 'de';
  console.log(`Translating glossary to ${lang}...`);
  
  // Find all term: '...' and definition: '...' lines
  const regex = /(term|definition):\s*'([^']+)'/g;
  let match;
  const matches = [];
  
  while ((match = regex.exec(fileContent)) !== null) {
    matches.push({ full: match[0], type: match[1], text: match[2] });
  }

  // To avoid rate limiting, we combine texts with a delimiter
  const DELIMITER = ' ||| ';
  
  // Create chunks of text
  const chunkSize = 20;
  for (let i = 0; i < matches.length; i += chunkSize) {
    const chunk = matches.slice(i, i + chunkSize);
    const combinedText = chunk.map(c => c.text).join(DELIMITER);
    
    try {
      console.log(`Translating chunk ${i / chunkSize + 1} of ${Math.ceil(matches.length / chunkSize)}...`);
      const res = await translate(combinedText, { to: lang });
      const translatedParts = res.text.split(DELIMITER).map(s => s.trim());
      
      if (translatedParts.length === chunk.length) {
        for (let j = 0; j < chunk.length; j++) {
          chunk[j].translatedText = translatedParts[j];
        }
      } else {
        console.error("Mismatch in parts length for chunk", i / chunkSize + 1);
        // Fallback to individual
        for (let j = 0; j < chunk.length; j++) {
          await new Promise(r => setTimeout(r, 1000));
          const singleRes = await translate(chunk[j].text, { to: lang });
          chunk[j].translatedText = singleRes.text;
        }
      }
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error("Translation error in chunk", i / chunkSize + 1, e.message);
    }
  }

  let translatedContent = fileContent;
  for (let i = 0; i < matches.length; i++) {
    const item = matches[i];
    if (item.translatedText) {
      const safeTranslation = item.translatedText.replace(/'/g, "\\'");
      translatedContent = translatedContent.replace(
        item.full,
        `${item.type}: '${safeTranslation}'`
      );
    }
  }

  fs.writeFileSync(`src/data/glossary_${lang}.js`, translatedContent);
  console.log(`Saved src/data/glossary_${lang}.js`);
}

run();
