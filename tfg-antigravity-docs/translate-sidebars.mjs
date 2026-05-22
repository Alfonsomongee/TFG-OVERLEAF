import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const langs = ['pt', 'fr', 'it', 'de'];
const srcFile = 'i18n/es/docusaurus-plugin-content-docs/current.json';

async function run() {
  const data = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
  
  for (const lang of langs) {
    const targetFile = `i18n/${lang}/docusaurus-plugin-content-docs/current.json`;
    const translatedData = {};
    
    console.log(`Translating to ${lang}...`);
    for (const key in data) {
      translatedData[key] = { ...data[key] };
      const original = data[key].message;
      
      // Keep emojis if present by splitting
      let textToTranslate = original;
      let prefix = "";
      if (original.includes(" ")) {
         const firstWord = original.split(" ")[0];
         // Simple check for emoji
         if (/\p{Extended_Pictographic}/u.test(firstWord)) {
             prefix = firstWord + " ";
             textToTranslate = original.substring(firstWord.length + 1);
         }
      }
      
      if (textToTranslate === 'Next') {
         // Exception for version label
         translatedData[key].message = 'Next';
      } else {
         try {
           const res = await translate(textToTranslate, { to: lang });
           translatedData[key].message = prefix + res.text;
         } catch (e) {
           console.error("Translation error:", e);
           translatedData[key].message = original;
         }
      }
    }
    fs.writeFileSync(targetFile, JSON.stringify(translatedData, null, 2));
    console.log(`Saved ${targetFile}`);
  }
}

run();
