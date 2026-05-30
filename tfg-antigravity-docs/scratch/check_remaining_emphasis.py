import os
import re

DOCS_DIRS = [
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"
]

# Match words inside *word* or _word_ where word is alphanumeric plus hyphens/spaces
EMPHASIS_RE = re.compile(r'(?:\*|_)([a-zA-Z0-9\s\-]+?)(?:\*|_)')

ignored_words = {"a", "b", "c", "x", "y", "i", "j", "n", "k", "t", "s", "p", "v", "q", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ver", "y", "o"}

results = []

for docs_dir in DOCS_DIRS:
    for root, _, files in os.walk(docs_dir):
        for file in files:
            if file.endswith('.mdx') or file.endswith('.md'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Find all emphasized words
                matches = EMPHASIS_RE.findall(content)
                for m in matches:
                    m_clean = m.strip()
                    if m_clean.lower() not in ignored_words and len(m_clean) > 1:
                        # Print only if it looks like an English technical term or other word
                        results.append((path, m_clean))

print(f"Found {len(results)} remaining emphasized words.")
# Let's count frequencies
from collections import Counter
counts = Counter([r[1] for r in results])
print("\nMost common remaining emphasized words:")
for word, count in counts.most_common(30):
    print(f"  {word}: {count}")
