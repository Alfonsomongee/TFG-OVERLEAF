import os
import re

def deduplicate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    seen_terms = set()

    def replacer(match):
        term = match.group(1).strip()
        inner_text = match.group(2)
        
        term_clean = re.sub(r'^"|"$', '', term)
        
        if term_clean in seen_terms:
            return inner_text
        else:
            seen_terms.add(term_clean)
            return match.group(0)

    content = re.sub(
        r'<GlossaryLink\s+term=([^>]+)>(.*?)</GlossaryLink>',
        replacer,
        content,
        flags=re.DOTALL
    )

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Deduplicated links in {filepath}')

base_dir = r'c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs'
for root, dirs, files in os.walk(base_dir):
    if 'node_modules' in root or '.docusaurus' in root or 'build' in root:
        continue
    for file in files:
        if file.endswith('.mdx'):
            deduplicate_file(os.path.join(root, file))
print('Done.')
