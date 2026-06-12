import json
import glob
import os

target_files = set([
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
])

found_files = {}

# Check the specific transcripts found
transcripts = [
    'C:/Users/aphmo/.gemini/antigravity/brain/5289fd51-d2f8-4007-bb8c-b68c61de574e/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/361bde28-611e-45b8-ab2f-4a89720e255a/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/02b51fb8-446e-485d-9eea-f8c3c21dc660/.system_generated/logs/transcript.jsonl'
]

import re

for p in transcripts:
    try:
        text = open(p, 'r', encoding='utf-8', errors='ignore').read()
        matches = re.findall(r'"TargetFile":\s*"([^"]+anexo-[^"]+\.mdx)".*?"CodeContent":\s*"(.*?)"', text, flags=re.DOTALL)
        for target, content in matches:
            filename = os.path.basename(target)
            if filename in target_files:
                found_files[filename] = content
    except Exception as e:
        print(e)

print(f"Recovered {len(found_files)} files from write_to_file")

# Because the regex parses JSON encoded string, we need to decode it to get the raw string.
# We can do this by wrapping it in a json array and loading it.
for filename, content in found_files.items():
    try:
        # Try to parse it properly
        decoded = json.loads(f'["{content}"]')[0]
        # Ensure we write it directly to docs/
        out_path = f"c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/docs/{filename}"
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(decoded)
        print(f"Restored {filename}")
    except Exception as e:
        print(f"Error decoding {filename}: {e}")
