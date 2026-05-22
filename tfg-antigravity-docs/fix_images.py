import re
import os
import glob

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r'<ChartCard\s+(.*?)>(.*?)</ChartCard>', re.DOTALL)

    def replacer(match):
        props_str = match.group(1)
        inner_content = match.group(2).strip()

        if '<img' in inner_content and 'BrowserOnly' not in inner_content:
            title = re.search(r'title=\"([^\"]+)\"', props_str)
            title = title.group(1) if title else ''
            
            dek = re.search(r'dek=\"([^\"]+)\"', props_str)
            dek = dek.group(1) if dek else ''
            
            source = re.search(r'source=\"([^\"]+)\"', props_str)
            source = source.group(1) if source else ''
            
            caption = re.search(r'caption=\"([^\"]+)\"', props_str)
            caption = caption.group(1) if caption else ''
            
            src = re.search(r'src=\"([^\"]+)\"', inner_content)
            src = src.group(1) if src else ''

            desc = []
            if dek: desc.append(dek)
            if caption: desc.append(caption)
            if source: desc.append(f'Fuente: {source}.')
            
            desc_text = ' '.join(desc)
            if desc_text:
                return f'![{title}]({src}) _{desc_text}_'
            else:
                return f'![{title}]({src})'
                
        return match.group(0)

    new_content = pattern.sub(replacer, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

files = glob.glob('docs/03-analisis-incidente.mdx') + glob.glob('i18n/*/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx')
for f in files:
    process_file(f)
