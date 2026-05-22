import fs from 'fs';
import { translate } from '@vitalets/google-translate-api';

const langs = ['pt', 'fr', 'it', 'de'];
const srcFile = 'i18n/es/docusaurus-theme-classic/navbar.json';

async function run() {
  const data = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
  
  for (const lang of langs) {
    const targetFile = `i18n/${lang}/docusaurus-theme-classic/navbar.json`;
    const translatedData = {};
    
    console.log(`Translating navbar to ${lang}...`);
    for (const key in data) {
      translatedData[key] = { ...data[key] };
      const original = data[key].message;
      
      try {
         const res = await translate(original, { to: lang });
         translatedData[key].message = res.text;
      } catch (e) {
         console.error("Translation error:", e);
         translatedData[key].message = original;
      }
    }
    fs.writeFileSync(targetFile, JSON.stringify(translatedData, null, 2));
    console.log(`Saved ${targetFile}`);
  }
}

run();
