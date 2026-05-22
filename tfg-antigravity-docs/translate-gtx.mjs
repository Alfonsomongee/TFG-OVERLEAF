import fs from 'fs';
import https from 'https';

const fileContent = fs.readFileSync('src/data/glossary.js', 'utf8');

function fetchTranslation(text, lang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            // Google Translate array format
            let translatedText = '';
            for (let i = 0; i < parsed[0].length; i++) {
              translatedText += parsed[0][i][0];
            }
            resolve(translatedText);
          } else {
            reject(new Error(`Status ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const lang = 'de';
  console.log(`Translating glossary to ${lang} using GTX...`);
  
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
      const translated = await fetchTranslation(item.text, lang);
      const safeTranslation = translated.replace(/'/g, "\\'");
      translatedContent = translatedContent.replace(
        item.full,
        `${item.type}: '${safeTranslation}'`
      );
      if (i % 10 === 0) console.log(`  Progress: ${i}/${matches.length}`);
      // Minimal delay to prevent being blocked
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error("Translation error at index", i, e.message);
    }
  }

  fs.writeFileSync(`src/data/glossary_${lang}.js`, translatedContent);
  console.log(`Saved src/data/glossary_${lang}.js`);
}

run();
