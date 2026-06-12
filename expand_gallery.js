const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'tfg-antigravity-docs', 'docs');
const galeriaPath = path.join(__dirname, 'galeriaforensedefinitiva.json');

const galeria = JSON.parse(fs.readFileSync(galeriaPath, 'utf8'));
const cataloguedIds = new Set();
galeria.categories.forEach(cat => {
    (cat.tables || []).forEach(table => cataloguedIds.add(table.id));
});

const mdxFiles = fs.readdirSync(docsDir).filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));

const reactCompRegex = /<([A-Z][a-zA-Z0-9]+)\s*[^>]*>/g;
const mdImageRegex = /!\[(.*?)\]\((.*?)\)/g;
const anchorRegex = /id=["'](.*?)["']/i;

const titleRegex = /title:\s*['"](.*?)['"]/;
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (const file of mdxFiles) {
    const filePath = path.join(docsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find title
    let titleMatch = titleRegex.exec(content);
    let annexTitle = titleMatch ? titleMatch[1] : file.replace('.mdx', '');
    let categoryId = file.replace('.mdx', '');

    // check if category exists
    let category = galeria.categories.find(c => c.id === categoryId);
    if (!category) {
        category = {
            id: categoryId,
            name: annexTitle,
            description: `Figuras dinámicas extraídas de ${annexTitle}`,
            icon: 'Activity', // default icon
            color: 'var(--ifm-color-warning)', // default color
            tables: []
        };
        galeria.categories.push(category);
    }

    let match;
    // Buscar componentes React
    while ((match = reactCompRegex.exec(content)) !== null) {
        const fullTag = match[0];
        const compName = match[1];
        
        if (compName === 'BrowserOnly' || compName === 'Details' || compName === 'Summary' || compName === 'div' || compName === 'span' || compName === 'br' || compName === 'p' || compName === 'a') continue;
        
        let idMatch = anchorRegex.exec(fullTag);
        let id = idMatch ? idMatch[1] : null;
        
        if (id && !cataloguedIds.has(id)) {
            category.tables.push({
                id: id,
                name: `<${compName}> interactivo`,
                source: file,
                type: 'interactive'
            });
            cataloguedIds.add(id);
        }
    }

    // Buscar imágenes markdown
    while ((match = mdImageRegex.exec(content)) !== null) {
        const alt = match[1] || 'Imagen sin título';
        const src = match[2];
        let id = src.split('/').pop().replace(/\.[^/.]+$/, ""); // nombre archivo sin extensión
        if (!id) id = slugify(alt.substring(0, 30));
        
        if (id && !cataloguedIds.has(id)) {
            category.tables.push({
                id: id,
                name: alt,
                source: file,
                type: 'image',
                path: src
            });
            cataloguedIds.add(id);
        }
    }
}

fs.writeFileSync(galeriaPath, JSON.stringify(galeria, null, 2));
console.log('Galería actualizada con éxito.');
