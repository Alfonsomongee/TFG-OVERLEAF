const fs = require('fs');

function extractData() {
    let output = '';

    // 1. Extraer IDs de galeriaforensedefinitiva.json
    try {
        const galeriaRaw = fs.readFileSync('galeriaforensedefinitiva.json', 'utf8');
        const galeria = JSON.parse(galeriaRaw);
        output += '==================================================\n';
        output += '1. IDs Y NOMBRES DEL MAPA DE FIGURAS\n';
        output += '==================================================\n\n';
        
        galeria.categories.forEach(cat => {
            output += `--- CATEGORÍA: ${cat.name} (${cat.id}) ---\n`;
            if (cat.tables) {
                cat.tables.forEach(table => {
                    output += `ID: ${table.id}\nNAME: ${table.name}\n\n`;
                });
            }
        });
    } catch (e) {
        output += 'Error leyendo galeriaforensedefinitiva.json: ' + e.message + '\n\n';
    }

    // 2. Extraer 3-4 chunks de chunks.json
    try {
        const chunksRaw = fs.readFileSync('tfg-antigravity-docs/static/chunks.json', 'utf8');
        // fallback si no está en esa ruta:
        // probar en static/chunks.json
    } catch (e) {
        // ...
    }

    // Intentamos en múltiples rutas para chunks.json
    let chunks;
    const paths = ['static/chunks.json', 'tfg-antigravity-docs/static/chunks.json', 'tfg-antigravity-docs/build/chunks.json'];
    for (let p of paths) {
        try {
            if (fs.existsSync(p)) {
                chunks = JSON.parse(fs.readFileSync(p, 'utf8'));
                break;
            }
        } catch (e) {}
    }

    if (chunks) {
        output += '==================================================\n';
        output += '2. ESTRUCTURA DE LOS CHUNKS DEL ÍNDICE BM25 (EJEMPLOS)\n';
        output += '==================================================\n\n';
        const keys = Object.keys(chunks);
        const sampleKeys = keys.slice(0, 4); // primeros 4 chunks
        sampleKeys.forEach(k => {
            output += `Chunk ID: ${k}\n`;
            output += JSON.stringify(chunks[k], null, 2) + '\n\n';
        });

        output += '==================================================\n';
        output += '3. CONTENIDO FUENTE DEL ÍNDICE (CAPÍTULOS TÉCNICOS CENTRALES)\n';
        output += '==================================================\n\n';
        output += 'Mostrando algunos chunks correspondientes a palabras clave como inercia, frecuencia, cascada, protecciones, ibérico...\n\n';
        
        const keywords = ['inercia', 'frecuencia', 'cascad', 'ibr', 'colapso', 'consecuencias'];
        let count = 0;
        for (let k of keys) {
            const chunk = chunks[k];
            const textLower = (chunk.text || '').toLowerCase() + ' ' + (chunk.heading || '').toLowerCase();
            if (keywords.some(kw => textLower.includes(kw))) {
                output += `--- Chunk ID: ${k} (Sección: ${chunk.title} > ${chunk.heading}) ---\n`;
                output += chunk.text + '\n\n';
                count++;
            }
            if (count > 20) break; // Limitamos para que el txt no sea absurdamente inmenso
        }
    } else {
        output += 'No se encontró chunks.json en las rutas esperadas.\n';
    }

    fs.writeFileSync('volcado_analisis_bm25.txt', output);
    console.log('Archivo volcado_analisis_bm25.txt generado exitosamente.');
}

extractData();
