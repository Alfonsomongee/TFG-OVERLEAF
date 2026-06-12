const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');
const outputFile = path.join(__dirname, 'VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt');

const files = fs.readdirSync(docsDir).filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));

let volcado = "=========================================================\n";
volcado += "VOLCADO DOCUMENTAL DE EVIDENCIAS EN ANEXOS (TFG APAGÓN)\n";
volcado += "=========================================================\n\n";

let totalEvidencias = 0;

for (const file of files) {
    const content = fs.readFileSync(path.join(docsDir, file), 'utf8');
    const titleMatch = content.match(/title:\s*"(.*?)"/);
    const title = titleMatch ? titleMatch[1] : file;

    volcado += `\n---------------------------------------------------------\n`;
    volcado += `ARCHIVO: ${file}\n`;
    volcado += `TÍTULO: ${title}\n`;
    volcado += `---------------------------------------------------------\n\n`;

    // Regex para buscar AnnexEvidence
    // Ejemplo: <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
    const regex = /<AnnexEvidence\s+([^>]+)\s*\/>/g;
    let match;
    let fileEvidencias = 0;

    while ((match = regex.exec(content)) !== null) {
        const propsRaw = match[1];
        
        // Extract props
        const typeMatch = propsRaw.match(/type="([^"]+)"/);
        const idMatch = propsRaw.match(/id="([^"]+)"/);
        const levelMatch = propsRaw.match(/level=\{([^}]+)\}/);

        const type = typeMatch ? typeMatch[1] : 'unknown';
        const id = idMatch ? idMatch[1] : 'unknown';
        const level = levelMatch ? levelMatch[1] : 'unknown';

        volcado += `- TIPO: ${type.toUpperCase().padEnd(12)} | ID: ${id.padEnd(40)} | NIVEL VISUAL: ${level}\n`;
        fileEvidencias++;
        totalEvidencias++;
    }

    if (fileEvidencias === 0) {
        volcado += `(No se encontraron componentes AnnexEvidence en este anexo)\n`;
    }
}

volcado += `\n=========================================================\n`;
volcado += `TOTAL DE EVIDENCIAS ENCONTRADAS: ${totalEvidencias}\n`;
volcado += `=========================================================\n`;

fs.writeFileSync(outputFile, volcado, 'utf8');
console.log('Volcado generado correctamente en:', outputFile);
