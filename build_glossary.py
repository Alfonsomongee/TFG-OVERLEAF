#!/usr/bin/env python3
import sys, re, os, unicodedata
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

TXT = r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\GLOSARIO TECNICO.txt'
OUT = r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\src\data\glossary.js'

with open(TXT, 'r', encoding='utf-8') as f:
    content = f.read()

def clean_latex(text):
    """Remove LaTeX commands and clean text."""
    text = re.sub(r'\\textit\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\textbf\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\emph\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\label\{[^}]+\}', '', text)
    text = re.sub(r'\\[a-zA-Z]+\{([^}]+)\}', r'\1', text)
    text = re.sub(r'\\[a-zA-Z]+', '', text)
    text = text.replace('---', '—').replace('--', '–')
    text = text.replace('~', ' ')
    text = text.replace('\r\n', ' ').replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

# Use line-by-line parsing
lines = content.split('\n')
terms = []
current_title = None
current_body_lines = []

for line in lines:
    # Check for \section{...}
    m = re.match(r'^\\section\{(.+?)\}', line)
    if m:
        # Save previous term
        if current_title and current_body_lines:
            body = clean_latex(' '.join(current_body_lines))
            if body:
                terms.append((current_title, body))
        current_title = m.group(1).strip()
        # Remove latex from title too
        current_title = clean_latex(current_title)
        current_body_lines = []
    elif current_title:
        stripped = line.strip()
        # Skip label lines, chapter lines, comments, empty lines at start
        if (stripped.startswith(r'\label') or
            stripped.startswith(r'\chapter') or
            stripped.startswith('%') or
            stripped.startswith('% --')):
            continue
        current_body_lines.append(stripped)

# Save last term
if current_title and current_body_lines:
    body = clean_latex(' '.join(current_body_lines))
    if body:
        terms.append((current_title, body))

print(f'Parsed {len(terms)} terms from GLOSARIO TECNICO.txt')
for t, d in terms:
    print(f'  [{t}]')

def slugify(text):
    text = text.lower()
    text = ''.join(c for c in unicodedata.normalize('NFD', text)
                   if unicodedata.category(c) != 'Mn')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

def get_letter(term):
    t = term.strip().upper()
    for ch in t:
        if ch.isalpha():
            # Normalize accented chars
            ch_norm = ''.join(c for c in unicodedata.normalize('NFD', ch)
                              if unicodedata.category(c) != 'Mn')
            return ch_norm[0] if ch_norm else ch
    return 'Z'

# Read current glossary.js to get existing terms
with open(OUT, 'r', encoding='utf-8') as f:
    existing_js = f.read()

# Extract existing term names
existing_terms = re.findall(r"term:\s*'([^']+)'", existing_js)
print(f'\nExisting terms in glossary.js: {len(existing_terms)}')

# Build new entries for terms NOT already in the glossary
new_entries = []
for title, body in terms:
    # Check if term already exists (partial match)
    already = any(title.lower() in et.lower() or et.lower() in title.lower()
                  for et in existing_terms)
    if not already:
        new_entries.append((title, body))
        print(f'  NEW: [{title}]')

print(f'\nNew terms to add: {len(new_entries)}')

# Build JS entries for new terms
js_new = ''
for title, body in new_entries:
    body_esc = body.replace("'", "\\'")
    letter = get_letter(title)
    slug = slugify(title)
    js_new += f"""  {{
    id: slugify('{title}'),
    letter: '{letter}',
    term: '{title}',
    definition: '{body_esc}',
  }},\n"""

# Insert new entries into existing glossary.js before closing ]
if js_new:
    # Find the last };  in the file to insert before it
    insert_pos = existing_js.rfind('];')
    if insert_pos == -1:
        insert_pos = len(existing_js)
    updated = existing_js[:insert_pos] + js_new + existing_js[insert_pos:]
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(updated)
    print(f'\nUpdated {OUT} with {len(new_entries)} new terms.')
else:
    print('\nNo new terms to add (all already in glossary.js).')
