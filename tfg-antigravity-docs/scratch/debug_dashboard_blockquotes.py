import os

doc_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\DASHBOARD\docs"
found = []

for root, dirs, files in os.walk(doc_dir):
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                for idx, line in enumerate(lines):
                    stripped = line.strip()
                    if stripped.startswith('>'):
                        if stripped == '>' or stripped == '/>':
                            continue
                        found.append({
                            'file': file,
                            'line_num': idx + 1,
                            'content': stripped
                        })
            except Exception as e:
                pass

print(f"Found {len(found)} blockquotes in DASHBOARD/docs:")
for item in found:
    print(f"{item['file']}:L{item['line_num']}: {item['content']}")
