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
                    content = re.sub(r'14-galeria-graficas\.mdx', 'galeria-graficas.mdx', content)
                        
                    if content != orig_content:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(content)
                        count_modifications += 1
                        print(f"Modificado: {os.path.relpath(path, ROOT)}")
                except Exception as e:
                    print(f"Error procesando {path}: {e}")

print(f"Total archivos modificados: {count_modifications}")
