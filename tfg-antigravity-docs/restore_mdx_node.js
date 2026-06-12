const fs = require('fs');
const path = require('path');

const targetFiles = [
    'anexo-cascada-protecciones-desconexiones.mdx',
    'anexo-comunicacion-fuentes.mdx',
    'anexo-demanda-generacion-balance.mdx',
    'anexo-ecuaciones-matematicas.mdx',
    'anexo-estabilidad-dinamica-tension.mdx',
    'anexo-impacto-resiliencia.mdx',
    'anexo-indice-conceptual.mdx',
    'anexo-interconexiones-flujos.mdx',
    'anexo-mercado-costes.mdx',
    'anexo-metodologia-modelos-datos-vivos.mdx',
    'anexo-reposicion-blackstart.mdx'
];

const transcripts = [
    'C:/Users/aphmo/.gemini/antigravity/brain/5289fd51-d2f8-4007-bb8c-b68c61de574e/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/361bde28-611e-45b8-ab2f-4a89720e255a/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/02b51fb8-446e-485d-9eea-f8c3c21dc660/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/8db8cff9-803c-4399-b885-1ab9d29fdfb4/.system_generated/logs/transcript.jsonl'
];

const foundFiles = {};

for (const p of transcripts) {
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const obj = JSON.parse(line);
            if (obj.tool_calls) {
                for (const t of obj.tool_calls) {
                    if (t.function && ['write_to_file', 'replace_file_content', 'multi_replace_file_content'].includes(t.function.name)) {
                        const argsStr = t.function.arguments;
                        let args;
                        try {
                            args = JSON.parse(argsStr);
                        } catch (e) {
                            // manual extraction if json parsing fails due to truncation
                            const targetMatch = argsStr.match(/"TargetFile"\s*:\s*"([^"]+anexo-[^"]+\.mdx)"/);
                            if (targetMatch) {
                                const filename = path.basename(targetMatch[1]);
                                if (targetFiles.includes(filename)) {
                                    // Extract everything between "CodeContent": " and the end, unescaping carefully
                                    const contentMatch = argsStr.match(/"CodeContent"\s*:\s*"(.*)/s);
                                    if (contentMatch) {
                                        let raw = contentMatch[1];
                                        // Remove trailing quote if it exists
                                        if (raw.endsWith('"')) raw = raw.slice(0, -1);
                                        if (raw.endsWith('"}')) raw = raw.slice(0, -2);
                                        
                                        try {
                                            // Quick unescape
                                            raw = raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                                            foundFiles[filename] = raw;
                                        } catch (e) { }
                                    }
                                }
                            }
                            continue;
                        }

                        const target = args.TargetFile;
                        if (!target) continue;
                        const filename = path.basename(target);
                        if (targetFiles.includes(filename)) {
                            const content = args.CodeContent || args.ReplacementContent;
                            if (content) {
                                foundFiles[filename] = content;
                            }
                        }
                    }
                }
            }
        } catch (e) { }
    }
}

console.log(`Recovered ${Object.keys(foundFiles).length} files!`);

for (const [filename, content] of Object.entries(foundFiles)) {
    const outPath = path.join('C:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/docs', filename);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log(`Restored ${filename}`);
}
