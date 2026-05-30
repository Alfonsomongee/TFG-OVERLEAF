import os
import re

doc_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF"

found = []

for root, dirs, files in os.walk(doc_dir):
    # Skip the main Docusaurus directory to see others
    if 'tfg-antigravity-docs' in root:
        continue
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build']]
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('>'):
                        found.append({
                            'file': os.path.relpath(filepath, doc_dir),
                            'line_num': idx + 1,
                            'content': stripped
                        })
            except Exception as e:
                pass

print(f"DEBUG: Found {len(found)} blockquotes outside tfg-antigravity-docs:")
for item in found:
    print(f"{item['file']}:L{item['line_num']}: {item['content']}")
