import os
import re

ROOT = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs"

files_in_order = [
    "intro.mdx",
    "01-introduccion.mdx",
    "02-contexto.mdx",
    "03-analisis-incidente.mdx",
    "06-impacto-comunicativo.mdx",
    "05-analisis-informes.mdx",
    r"dimension-europea\01-francia-portugal.mdx",
    r"dimension-europea\02-coordinacion-continental.mdx",
    r"dimension-europea\03-dia-despues.mdx",
    "04-reaccion-reposicion.mdx",
    "07b-consecuencias-financieras.mdx",
    "07-resiliencia-futuro.mdx",
    "08-uso-ia.mdx",
    "08.5-actualizacion-2026.mdx",
    "09-conclusiones.mdx",
    "10-resumen-de-cifras.mdx",
    "11-cronologia.mdx"
]

table_count = 1

for rel_path in files_in_order:
    path = os.path.join(ROOT, rel_path)
    if not os.path.exists(path):
        continue
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # We want to find ForensicTables and standard markdown tables.
    # To avoid double counting, we will find ForensicTables first.
    
    # regex for ForensicTable
    forensic_matches = re.finditer(r'<ForensicTable[^>]*title="([^"]*)"[^>]*>.*?</ForensicTable>', content, re.DOTALL)
    
    # We also want naked tables. We can just look for the typical header: `| --- | --- |`
    # Let's just find all `| --- ` occurrences, but it's tricky to map.
    # Actually, let's just use re.split on <ForensicTable and find naked tables in between.
    
    parts = re.split(r'(<ForensicTable.*?</ForensicTable>)', content, flags=re.DOTALL)
    
    for part in parts:
        if part.startswith('<ForensicTable'):
            title_match = re.search(r'title="([^"]*)"', part)
            title = title_match.group(1) if title_match else "Unknown Title"
            print(f"TABLA {table_count}: {title} (en {rel_path})")
            table_count += 1
        else:
            # check for naked markdown tables
            naked_matches = re.finditer(r'^\|.*\|\n\|[- :|]+\|\n(?:\|.*\|\n)+', part, re.MULTILINE)
            for match in naked_matches:
                header = match.group(0).split('\n')[0]
                print(f"TABLA {table_count}: NAKED TABLE -> {header} (en {rel_path})")
                table_count += 1
