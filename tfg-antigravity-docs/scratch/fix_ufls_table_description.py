import os

DOCS_DIR = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs"
I18N_DIR = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"

files_to_fix = {
    os.path.join(DOCS_DIR, "dimension-europea", "01-francia-portugal.mdx"): "Registros PMU de REN y REE",
    os.path.join(I18N_DIR, "en", "docusaurus-plugin-content-docs", "current", "dimension-europea", "01-francia-portugal.mdx"): "PMU records of REN and REE",
    os.path.join(I18N_DIR, "fr", "docusaurus-plugin-content-docs", "current", "dimension-europea", "01-francia-portugal.mdx"): "Registres PMU de REN et REE",
    os.path.join(I18N_DIR, "de", "docusaurus-plugin-content-docs", "current", "dimension-europea", "01-francia-portugal.mdx"): "PMU-Aufzeichnungen von REN und REE",
    os.path.join(I18N_DIR, "it", "docusaurus-plugin-content-docs", "current", "dimension-europea", "01-francia-portugal.mdx"): "Registrazioni PMU di REN e REE",
    os.path.join(I18N_DIR, "pt", "docusaurus-plugin-content-docs", "current", "dimension-europea", "01-francia-portugal.mdx"): "Registros PMU de REN e REE"
}

target_paragraph = "_Actuación combinada del UFLS de REE y REN por escalones de frecuencia. Fuente: registros PMU de REN y REE._"

for filepath, localized_source in files_to_fix.items():
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Remove the target paragraph
    modified = content.replace(target_paragraph, "")
    
    # Let's find the ForensicTable for UFLS and update its source
    # We can search for the ForensicTable that has the UFLS title, and replace `source="Elaboración propia"` with `source="{localized_source}"`
    # Let's search for the pattern
    # <ForensicTable\s+title="[^"]*UFLS[^"]*"\s+source="[^"]*"
    # and replace the source prop
    
    def replace_source(match):
        tag = match.group(0)
        # replace source="..." with source="{localized_source}"
        new_tag = re.sub(r'source="[^"]*"', f'source="{localized_source}"', tag)
        return new_tag
        
    import re
    modified = re.sub(r'<ForensicTable\s+[^>]*?UFLS[^>]*?>', replace_source, modified)
    
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Updated description and source in: {filepath}")

print("Description fix complete.")
