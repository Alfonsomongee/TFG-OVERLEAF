import fs from 'fs';

const fileContent = fs.readFileSync('src/data/glossary.js', 'utf8');

async function translateText(text, lang) {
  // Use MyMemory API
  // Free tier is 500 words/day, but let's try it.
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=es|${lang}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseData && data.responseData.translatedText) {
    return data.responseData.translatedText;
  }
  throw new Error("Translation failed");
}

async function run() {
  const lang = 'de';
  console.log(`Translating glossary to ${lang}...`);
  
  const regex = /(term|definition):\s*'([^']+)'/g;
  let match;
  const matches = [];
  
  while ((match = regex.exec(fileContent)) !== null) {
    matches.push({ full: match[0], type: match[1], text: match[2] });
  }
  
  let translatedContent = fileContent;
  
  for (let i = 0; i < matches.length; i++) {
    const item = matches[i];
    try {
      // Delay to respect API limits
      await new Promise(r => setTimeout(r, 1000));
      const translated = await translateText(item.text, lang);
      const safeTranslation = translated.replace(/'/g, "\\'");
      translatedContent = translatedContent.replace(
        item.full,
        `${item.type}: '${safeTranslation}'`
      );
      if (i % 5 === 0) console.log(`  Progress: ${i}/${matches.length}`);
    } catch (e) {
      console.error("Translation error at index", i, e.message);
    }
  }

  fs.writeFileSync(`src/data/glossary_${lang}.js`, translatedContent);
  console.log(`Saved src/data/glossary_${lang}.js`);
}

run();
