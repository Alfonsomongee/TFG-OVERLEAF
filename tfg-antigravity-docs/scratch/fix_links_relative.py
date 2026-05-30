import os
import re

ROOT = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"
TARGET_DIRS = [os.path.join(ROOT, "docs"), os.path.join(ROOT, "i18n")]

count_modifications = 0

for target_dir in TARGET_DIRS:
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    orig_content = content
                    # We look for /docs/galeria-graficas or /docs/14-galeria-graficas
                    # If the file we are currently in is INSIDE a subdirectory (like datos-tiempo-real),
                    # we need to use ../14-galeria-graficas.mdx instead of ./
                    
                    rel_to_docs = os.path.relpath(root, target_dir)
                    if "i18n" in path:
                        # For i18n, the structure is i18n/lang/docusaurus-plugin-content-docs/current/
                        # So we need to calculate depth from 'current'
                        parts = path.split("docusaurus-plugin-content-docs\\current\\")
                        if len(parts) > 1:
                            subpath = parts[1]
                            depth = subpath.count("\\")
                        else:
                            depth = 0
                    else:
                        depth = rel_to_docs.count("\\") if rel_to_docs != "." else 0
                    
                    prefix = "../" * depth if depth > 0 else "./"
                    replacement = f"{prefix}14-galeria-graficas.mdx"
                    
                    content = re.sub(r'/docs/galeria-graficas', replacement, content)
                    content = re.sub(r'/docs/14-galeria-graficas', replacement, content)
                        
                    if content != orig_content:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(content)
                        count_modifications += 1
                        print(f"Modificado: {os.path.relpath(path, ROOT)}")
                except Exception as e:
                    print(f"Error procesando {path}: {e}")

print(f"Total archivos modificados: {count_modifications}")
