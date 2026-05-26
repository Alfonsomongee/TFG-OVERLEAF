const fs = require('fs');
const file = 'C:\\\\Users\\\\aphmo\\\\Proyectos\\\\TFG OVERLEAF\\\\tfg-antigravity-docs\\\\docs\\\\16-graficas-esios.mdx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import Admonition')) {
  content = content.replace("import TabItem from '@theme/TabItem';", "import TabItem from '@theme/TabItem';\nimport Admonition from '@theme/Admonition';");
}

content = content.replace(/:::info ([^\n]+)\n([\s\S]*?):::/g, (match, title, text) => {
  return `<div style={{ marginTop: '40px', marginBottom: '20px' }}>\n<Admonition type="info" title="${title.trim()}">\n\n${text.trim()}\n\n</Admonition>\n</div>`;
});

fs.writeFileSync(file, content);
