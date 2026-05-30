import os

doc_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF"
found = []

for root, dirs, files in os.walk(doc_dir):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build', '.claude']]
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            if file == 'coordination_log.md':
                continue
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('>'):
                        if stripped == '>' or stripped == '/>':
                            continue
                        # Skip components like <ForensicTable ... >
                        if stripped.endswith('>') and ('<' in stripped or '/' in stripped):
                            continue
                        found.append({
                            'file': os.path.relpath(filepath, doc_dir),
                            'line_num': idx + 1,
                            'content': stripped
                        })
            except Exception as e:
                pass

print(f"Found {len(found)} blockquotes in entire workspace (excluding coordination_log):")
for item in found:
    # Use ascii safe representation to prevent print errors
    safe_content = item['content'].encode('ascii', errors='replace').decode('ascii')
    print(f"{item['file']}:L{item['line_num']}: {safe_content}")
