import glob
import re
import os

files = glob.glob('docs/*.mdx') + glob.glob('i18n/*/docusaurus-plugin-content-docs/current/*.mdx')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Only process if it has frontmatter and sidebar_position (means it's a chapter)
    if not re.search(r'^sidebar_position:', content, re.MULTILINE):
        continue

    new_content = content

    # Add hide_title: true if not present
    if 'hide_title: true' not in new_content:
        new_content = re.sub(r'(^sidebar_position:.*?)$', r'\1\nhide_title: true', new_content, flags=re.MULTILINE)

    # Check if GlitchTitle is imported
    if 'import GlitchTitle' not in new_content:
        # Insert import after the second '---'
        parts = new_content.split('---', 2)
        if len(parts) == 3:
            parts[2] = '\nimport GlitchTitle from "@site/src/components/GlitchTitle";\n' + parts[2].lstrip()
            new_content = '---'.join(parts)

    # Check if there's already a GlitchTitle block. If not, replace the first # Title
    if '<GlitchTitle>' not in new_content:
        def h1_replacer(match):
            title_text = match.group(1).strip()
            return f'<GlitchTitle>{title_text}</GlitchTitle>'
        
        new_content, num_subs = re.subn(r'^#\s+(.+)$', h1_replacer, new_content, count=1, flags=re.MULTILINE)

    # Write back if changed
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {f}')
