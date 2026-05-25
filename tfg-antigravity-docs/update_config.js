const fs = require('fs');
let code = fs.readFileSync('docusaurus.config.js', 'utf8');

code = code.replace(/stylesheets:\s*\[[\s\S]*?\],/, 
`stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-SfHjyzed8eCsTSa4t2GoMc4WnsCLa6cQpFqPRCaizz0FlQUOyafw/AyIUCQU/KuM',
      crossorigin: 'anonymous',
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Alfa+Slab+One&family=Playfair+Display:wght@700;800;900&display=swap',
      type: 'text/css',
      rel: 'stylesheet',
    },
  ],`);

code = code.replace(/headTags:\s*\[[\s\S]*?\],/, '');

code = code.replace(/(stylesheets:\s*\[[\s\S]*?\],)/, 
`$1
  headTags: [
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
  ],`);

fs.writeFileSync('docusaurus.config.js', code);
console.log('Updated docusaurus.config.js');
