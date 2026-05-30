import os
import re

doc_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

found = []

for root, dirs, files in os.walk(doc_dir):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build']]
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Let's search for a word preceded by > or similar that is not an HTML tag
                # A blockquote starts with >
                # Let's find any line starting with optional spaces and >
                lines = content.split('\n')
                for idx, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('>'):
                        # Skip HTML/JSX tags closing or opening
                        if stripped.endswith('>') and ('<' in stripped or '/' in stripped):
                            continue
                        if stripped == '>' or stripped == '/>':
                            continue
                        # Potential blockquote
                        found.append({
                            'file': os.path.relpath(filepath, doc_dir),
                            'line_num': idx + 1,
                            'content': stripped
                        })
            except Exception as e:
                pass

print(f"DEBUG: Found {len(found)} blockquotes:")
for item in found:
    print(f"{item['file']}:L{item['line_num']}: {item['content']}")
