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

transcripts = [
    'C:/Users/aphmo/.gemini/antigravity/brain/5289fd51-d2f8-4007-bb8c-b68c61de574e/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/361bde28-611e-45b8-ab2f-4a89720e255a/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/02b51fb8-446e-485d-9eea-f8c3c21dc660/.system_generated/logs/transcript.jsonl',
    'C:/Users/aphmo/.gemini/antigravity/brain/8db8cff9-803c-4399-b885-1ab9d29fdfb4/.system_generated/logs/transcript.jsonl'
]

for p in transcripts:
    try:
        lines = open(p, 'r', encoding='utf-8', errors='ignore').readlines()
        for line in lines:
            if not line.strip(): continue
            try:
                obj = json.loads(line)
                if obj.get('tool_calls'):
                    for t in obj['tool_calls']:
                        if t.get('function') and t['function']['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                            args = t['function'].get('arguments', '')
                            # Parse args string as JSON
                            try:
                                args_obj = json.loads(args)
                            except:
                                continue # truncated
                            
                            target = args_obj.get('TargetFile', '')
                            content = args_obj.get('CodeContent', args_obj.get('ReplacementContent', ''))
                            if not content and 'ReplacementChunks' in args_obj:
                                # Not handling multi_replace_file_content chunk by chunk here,
                                # hopefully the full rewrite was write_to_file or replace_file_content.
                                pass

                            filename = os.path.basename(target)
                            if filename in target_files and content:
                                found_files[filename] = content
            except Exception as e:
                pass
    except Exception as e:
        pass

print(f"Recovered {len(found_files)} files using proper JSON parsing")

for filename, content in found_files.items():
    try:
        out_path = f"c:/Users/aphmo/Proyectos/TFG OVERLEAF/tfg-antigravity-docs/docs/{filename}"
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Restored {filename}")
    except Exception as e:
        print(f"Error restoring {filename}: {e}")
