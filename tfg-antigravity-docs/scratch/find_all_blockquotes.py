import os

doc_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF"

found = []

for root, dirs, files in os.walk(doc_dir):
    # Exclude directories we don't care about
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build', '.claude']]
    
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('>') and not stripped.startswith('>>>'):
                        if stripped == '>' or stripped == '/>':
                            continue
                        found.append({
                            'file': os.path.relpath(filepath, doc_dir),
                            'line_num': idx + 1,
                            'content': stripped
                        })
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

print(f"Found {len(found)} potential blockquotes in workspace:")
for item in found:
    print(f"{item['file']}:L{item['line_num']}: {item['content']}")
