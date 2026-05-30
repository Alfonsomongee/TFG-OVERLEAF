import os
import re

ROOT = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

languages = ["docs"] + [f"i18n\\{lang}\\docusaurus-plugin-content-docs\\current" for lang in ["en", "fr", "pt", "it", "de"]]

files_in_order = [
    "01-introduccion.mdx",
    "06-impacto-comunicativo.mdx",
    "05-analisis-informes.mdx",
    r"dimension-europea\01-francia-portugal.mdx",
    r"dimension-europea\02-coordinacion-continental.mdx",
    r"dimension-europea\03-dia-despues.mdx",
    "04-reaccion-reposicion.mdx",
    "07b-consecuencias-financieras.mdx",
    "07-resiliencia-futuro.mdx",
    "08-uso-ia.mdx",
    "09-conclusiones.mdx"
]

for lang_dir in languages:
    table_count = 1
    base_dir = os.path.join(ROOT, lang_dir)
    
    for rel_path in files_in_order:
        path = os.path.join(base_dir, rel_path)
        if not os.path.exists(path):
            continue
            
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        orig_content = content
        
        # 1. Wrap Naked Tables (look for markdown tables that are not inside ForensicTable)
        # It's safer to just look for the specific tables in dimension-europea since we know those were naked.
        if "01-francia-portugal" in rel_path and "<ForensicTable" not in content:
            # Wrap the two tables
            content = re.sub(
                r'(\|.*?)(?=\n\n|$)',
                r'<ForensicTable \n  title="TABLA" \n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
                content, count=2, flags=re.DOTALL
            )
        elif "02-coordinacion-continental" in rel_path and "<ForensicTable" not in content:
            content = re.sub(
                r'(\|.*?)(?=\n\n|$)',
                r'<ForensicTable \n  title="TABLA" \n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
                content, count=1, flags=re.DOTALL
            )
        elif "03-dia-despues" in rel_path and "<ForensicTable" not in content:
            content = re.sub(
                r'(\|.*?)(?=\n\n|$)',
                r'<ForensicTable \n  title="TABLA" \n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
                content, count=1, flags=re.DOTALL
            )

        # 2. Renumber ALL ForensicTables
        def replace_forensic_table(match):
            global table_count
            full_match = match.group(0)
            original_title = match.group(1)
            
            clean_title = re.sub(r'^TABLA \d+[:|] ?', '', original_title, flags=re.IGNORECASE)
            clean_title = re.sub(r'^TABLE \d+[:|] ?', '', clean_title, flags=re.IGNORECASE)
            clean_title = re.sub(r'^TABELLE \d+[:|] ?', '', clean_title, flags=re.IGNORECASE)
            clean_title = re.sub(r'^TABELA \d+[:|] ?', '', clean_title, flags=re.IGNORECASE)
            clean_title = re.sub(r'^TABLEAU \d+[:|] ?', '', clean_title, flags=re.IGNORECASE)
            if clean_title == "TABLA":
                 clean_title = "EUROPEAN DIMENSION DATA"
            
            # Use appropriate prefix depending on language (naive approach, but unified look)
            prefix = "TABLA"
            if "en\\" in lang_dir: prefix = "TABLE"
            elif "fr\\" in lang_dir: prefix = "TABLEAU"
            elif "de\\" in lang_dir: prefix = "TABELLE"
            elif "pt\\" in lang_dir: prefix = "TABELA"
            elif "it\\" in lang_dir: prefix = "TABELLA"
            
            new_title = f'{prefix} {table_count} | {clean_title}'
            table_count += 1
            
            return full_match.replace(f'title="{original_title}"', f'title="{new_title}"')
            
        content = re.sub(r'<ForensicTable[^>]*title="([^"]*)"', replace_forensic_table, content)
        
        if content != orig_content:
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[{lang_dir}] Renumbered tables in {rel_path}")

print("Done with multilingual table sync!")
