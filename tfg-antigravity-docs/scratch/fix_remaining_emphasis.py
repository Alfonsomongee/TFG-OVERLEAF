import os
import re

base_path = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

# Regex replacements definition
# We match optional underscores or asterisks around the terms.
regex_replacements = [
    # post mortem / post-mortem
    (re.compile(r'[_*](post[- ]mortem)[_*]', re.IGNORECASE), r'\1'),
    # Coreso
    (re.compile(r'[_*](Coreso)[_*]', re.IGNORECASE), r'\1'),
    # Deep Learning
    (re.compile(r'[_*](Deep Learning)[_*]', re.IGNORECASE), r'\1'),
    # N-1 / N−1 (supporting both hyphen and unicode minus)
    (re.compile(r'[_*](N[-−]1)[_*]', re.IGNORECASE), r'\1'),
    # N (with word boundaries or brackets, so we don't match random letters)
    (re.compile(r'[_*]\b(N)\b[_*]'), r'\1'),
]

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in regex_replacements:
        content = pattern.sub(replacement, content)
        
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {os.path.relpath(file_path, base_path)}")

def walk_and_fix():
    directories = [
        os.path.join(base_path, "docs"),
        os.path.join(base_path, "i18n")
    ]
    
    for directory in directories:
        if not os.path.exists(directory):
            continue
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(('.mdx', '.md')):
                    file_path = os.path.join(root, file)
                    process_file(file_path)

if __name__ == "__main__":
    walk_and_fix()
    print("Done cleaning remaining emphasis!")
