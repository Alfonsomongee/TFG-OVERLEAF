import os
import re

# Files in correct narrative order:
files_in_order = [
    r"01-introduccion.mdx",
    r"06-impacto-comunicativo.mdx",
    r"05-analisis-informes.mdx",
    r"dimension-europea/01-francia-portugal.mdx",
    r"dimension-europea/02-coordinacion-continental.mdx",
    r"dimension-europea/03-dia-despues.mdx",
    r"04-reaccion-reposicion.mdx",
    r"07b-consecuencias-financieras.mdx",
    r"07-resiliencia-futuro.mdx",
    r"08-uso-ia.mdx",
    r"09-conclusiones.mdx"
]

# Dir mapping
dir_prefixes = {
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs": "TABLA",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n\en\docusaurus-plugin-content-docs\current": "TABLE",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n\fr\docusaurus-plugin-content-docs\current": "TABLEAU",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n\de\docusaurus-plugin-content-docs\current": "TABELLE",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n\it\docusaurus-plugin-content-docs\current": "TABELLA",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n\pt\docusaurus-plugin-content-docs\current": "TABELA"
}

# Tag regex to find `<ForensicTable ...>` tag
FORENSIC_TAG_RE = re.compile(r'(<ForensicTable\s+[^>]*>)')

def get_title_attr(tag):
    # Match title="..."
    title_match = re.search(r'title="([^"]*)"', tag)
    if title_match:
        return title_match.group(1)
    return None

def clean_title(title):
    if not title:
        return ""
    # Split by | and get the last part
    parts = title.split('|')
    clean_name = parts[-1].strip()
    return clean_name

# We will run for each directory separately to make sure numbering is independent but perfectly aligned.
for directory, prefix in dir_prefixes.items():
    print(f"\nProcessing directory: {directory} (Prefix: {prefix})")
    global_table_counter = 1
    
    for rel_path in files_in_order:
        filepath = os.path.join(directory, rel_path)
        if not os.path.exists(filepath):
            print(f"  File not found: {rel_path} (skipping)")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # We need to find all <ForensicTable ...> tags in the file and replace them one by one
        tags = FORENSIC_TAG_RE.findall(content)
        if not tags:
            continue
            
        modified_content = content
        for tag in tags:
            orig_title = get_title_attr(tag)
            if orig_title is not None:
                clean_name = clean_title(orig_title)
                new_title = f"{prefix} {global_table_counter} | {clean_name}"
                
                # Replace the title attribute in the tag
                new_tag = re.sub(r'title="[^"]*"', f'title="{new_title}"', tag)
                modified_content = modified_content.replace(tag, new_tag)
                print(f"  [{rel_path}] Table {global_table_counter}: '{orig_title}' -> '{new_title}'")
            
            global_table_counter += 1
            
        if modified_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            print(f"  Updated: {rel_path}")

print("\nTable titles and numbering fixed successfully.")
