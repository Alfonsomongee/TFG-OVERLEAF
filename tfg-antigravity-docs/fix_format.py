import os
import re

titles = {
    '01-introduccion.mdx': 'Introducción',
    '02-contexto.mdx': 'Contexto Técnico',
    '03-analisis-incidente.mdx': 'Análisis del Incidente',
    '04-reaccion-reposicion.mdx': 'Reacción y Reposición',
    '05-analisis-informes.mdx': 'Análisis de los Informes Oficiales',
    '06-impacto-comunicativo.mdx': 'Impacto Comunicativo',
    '07-resiliencia-futuro.mdx': 'Resiliencia y Futuro',
    '08-uso-ia.mdx': 'Uso de Inteligencia Artificial',
    '09-conclusiones.mdx': 'Conclusiones',
    '01-francia-portugal.md': 'El impacto en Francia y Portugal',
    '02-coordinacion-continental.md': 'Coordinación Continental',
    '03-dia-despues.md': 'El Día Después: Reformas Institucionales',
    'glosario.mdx': 'Glosario Técnico',
    'referencias.mdx': 'Referencias'
}

def process_file(filepath, filename):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. We know Prettier already wrapped/unwrapped things weirdly for 01-introduccion.mdx
    # but the problem the user noticed was the formatting of tags like <GlossaryLink> causing breaks.
    # To fix this, let's just make sure all <GlossaryLink> tags and the surrounding text are on the same line if they were split by newlines.
    
    # We will remove newlines that immediately precede or follow a <GlossaryLink or </GlossaryLink> tag, 
    # IF the next/previous line is not a blank line.
    
    # Actually, a simpler way is to replace '\n<GlossaryLink' with ' <GlossaryLink' 
    # and '</GlossaryLink>\n' with '</GlossaryLink> '
    # (provided they are not preceded/followed by another '\n')
    
    content = re.sub(r'(?<!\n)\n(<GlossaryLink)', r' \1', content)
    content = re.sub(r'(</GlossaryLink>)\n(?!\n)', r'\1 ', content)

    # 2. Add title
    if filename in titles:
        title = titles[filename]
        # Check if title already exists
        if not re.search(r'^#\s+' + re.escape(title), content, flags=re.MULTILINE):
            # Insert title after frontmatter and imports
            lines = content.split('\n')
            insert_idx = 0
            in_frontmatter = False
            for i, line in enumerate(lines):
                if i == 0 and line.startswith('---'):
                    in_frontmatter = True
                elif in_frontmatter and line.startswith('---'):
                    in_frontmatter = False
                    insert_idx = i + 1
                elif not in_frontmatter and line.startswith('import '):
                    insert_idx = i + 1
                elif not in_frontmatter and line.strip() and not line.startswith('import '):
                    break
            
            lines.insert(insert_idx, f'\n# {title}\n')
            content = '\n'.join(lines)
            content = re.sub(r'\n{3,}', '\n\n', content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    dirs_to_process = ['docs', 'i18n/en/docusaurus-plugin-content-docs/current']
    for d in dirs_to_process:
        if not os.path.exists(d): continue
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith('.md') or file.endswith('.mdx'):
                    process_file(os.path.join(root, file), file)
    print("Formatting applied successfully.")

if __name__ == '__main__':
    main()
