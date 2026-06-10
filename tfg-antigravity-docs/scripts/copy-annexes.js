const fs = require('fs');
const path = require('path');

const srcDir = 'docs';
const langs = ['en', 'de', 'zh-Hans'];
const targetDirs = langs.map(l => `i18n/${l}/docusaurus-plugin-content-docs/current`);

const files = fs.readdirSync(srcDir).filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));

files.forEach(f => {
  const srcPath = path.join(srcDir, f);
  targetDirs.forEach(td => {
    if (fs.existsSync(td)) {
      const destPath = path.join(td, f);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${f} to ${td}`);
    }
  });
});
