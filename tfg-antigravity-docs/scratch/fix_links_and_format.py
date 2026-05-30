import os
import re

ROOT = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"
TARGET_DIRS = [os.path.join(ROOT, "docs"), os.path.join(ROOT, "i18n")]

REPLACEMENTS = [
    # Broken links
    (r'/docs/14-galeria-graficas', r'/docs/galeria-graficas'),
    
    # Problematic italic words causing translation spaces
    (r'\*utilities\*', r'utilities'),
    (r'\*Payback\*', r'Payback'),
    (r'\*Stability Pathfinder\*', r'Stability Pathfinder'),
    (r'_Short Circuit Ratio_', r'Short Circuit Ratio'),
    (r'_Large Language Models_', r'Large Language Models'),
    (r'\(\*Blackout Studies\*\)', r'(Blackout Studies)'),
    (r'_Blackout Studies_', r'Blackout Studies')
]

count_modifications = 0

for target_dir in TARGET_DIRS:
    for root, _, files in os.walk(target_dir):
        for file in files:
            if file.endswith(".mdx") or file.endswith(".md") or file.endswith(".json"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                        
                    orig_content = content
                    for pattern, repl in REPLACEMENTS:
                        content = re.sub(pattern, repl, content)
                        
                    if content != orig_content:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(content)
                        count_modifications += 1
                        print(f"Modificado: {os.path.relpath(path, ROOT)}")
                except Exception as e:
                    print(f"Error procesando {path}: {e}")

print(f"Total archivos modificados: {count_modifications}")
