import glob
import re
import os

files = glob.glob('docs/*.mdx') + glob.glob('i18n/*/docusaurus-plugin-content-docs/current/*.mdx')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Find the GlitchTitle text
    match = re.search(r'<GlitchTitle>(.*?)</GlitchTitle>', content)
    if not match:
        continue
    
    title_text = match.group(1).strip()
    
    # Escape quotes if necessary
    title_escaped = title_text.replace('"', '\\"')

    # Check if frontmatter already has a title
    # Frontmatter is between the first two '---'
    parts = content.split('---', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        
        if not re.search(r'^title\s*:', frontmatter, re.MULTILINE):
            # Add title to frontmatter
            new_frontmatter = frontmatter.rstrip() + f'\ntitle: "{title_escaped}"\n'
            new_content = '---' + new_frontmatter + '---' + parts[2]
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f'Added title to {f}: {title_escaped}')
