const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'tfg-antigravity-docs', 'docs');
const galeriaPath = path.join(__dirname, 'galeriaforensedefinitiva.json');

const galeria = JSON.parse(fs.readFileSync(galeriaPath, 'utf8'));
const cataloguedIds = new Set();
galeria.categories.forEach(cat => {
    cat.tables.forEach(table => cataloguedIds.add(table.id));
});

console.log(`\n================================`);
console.log(`Total IDs en galeria: ${cataloguedIds.size}`);
console.log(`================================\n`);

const mdxFiles = fs.readdirSync(docsDir).filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));

let uncataloguedCount = 0;
let output = '# Auditoria de Figuras no Catalogadas\n\n';

const reactCompRegex = /<([A-Z][a-zA-Z0-9]+)\s*[^>]*>/g;
const mdImageRegex = /!\[(.*?)\]\((.*?)\)/g;
const anchorRegex = /id=["'](.*?)["']/i;

for (const file of mdxFiles) {
    const filePath = path.join(docsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    let hasOutputForFile = false;
    let fileOutput = `## Anexo: ${file}\n\n`;

    // Buscar componentes React
    let match;
    while ((match = reactCompRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const compName = match[1];
        
        if (compName === 'BrowserOnly' || compName === 'Details' || compName === 'Summary' || compName === 'div' || compName === 'span' || compName === 'br' || compName === 'p' || compName === 'a') continue;
        
        let idMatch = anchorRegex.exec(fullTag);
        let id = idMatch ? idMatch[1] : null;
        
        if (!id || !cataloguedIds.has(id)) {
            hasOutputForFile = true;
            fileOutput += `- **React Component**: \`<${compName}>\`\n`;
            fileOutput += `  - ID/Anchor: ${id || 'N/A'}\n`;
            uncataloguedCount++;
        }
    }

    // Buscar imágenes markdown
    while ((match = mdImageRegex.exec(content)) !== null) {
        const alt = match[1];
        const src = match[2];
        const id = src.split('/').pop().replace(/\.[^/.]+$/, ""); // nombre archivo sin extensión
        
        if (!cataloguedIds.has(id)) {
            hasOutputForFile = true;
            fileOutput += `- **Markdown Image**\n`;
            fileOutput += `  - Caption: ${alt || 'N/A'}\n`;
            fileOutput += `  - Source: ${src}\n`;
            fileOutput += `  - Posible ID: ${id}\n`;
            uncataloguedCount++;
        }
    }

    if (hasOutputForFile) {
        output += fileOutput + '\n';
    }
}

console.log(`Se encontraron ${uncataloguedCount} elementos visuales no catalogados.`);
fs.writeFileSync('auditoria_figuras.md', output);
