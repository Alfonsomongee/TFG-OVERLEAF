import os
import re

ROOT = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs"

# 1. First, we need to wrap the naked tables in dimension-europea
# dimension-europea\01-francia-portugal.mdx
f_francia = os.path.join(ROOT, "dimension-europea", "01-francia-portugal.mdx")
with open(f_francia, "r", encoding="utf-8") as f:
    francia_content = f.read()

if "<ForensicTable" not in francia_content:
    francia_content = re.sub(
        r'(\| Elemento cr.*?)(?=\n\n|$)',
        r'<ForensicTable \n  title="TABLA 10 | EVENTOS CRÍTICOS EN FRANCIA"\n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
        francia_content,
        flags=re.DOTALL
    )
    francia_content = re.sub(
        r'(\| Umbral de frecuencia.*?)(?=\n\n|$)',
        r'<ForensicTable \n  title="TABLA 11 | UFLS: CARGA DESLASTRADA EN LA PENÍNSULA"\n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
        francia_content,
        flags=re.DOTALL
    )
    with open(f_francia, "w", encoding="utf-8") as f:
        f.write(francia_content)


# dimension-europea\02-coordinacion-continental.mdx
f_coord = os.path.join(ROOT, "dimension-europea", "02-coordinacion-continental.mdx")
if os.path.exists(f_coord):
    with open(f_coord, "r", encoding="utf-8") as f:
        coord_content = f.read()
    if "<ForensicTable" not in coord_content:
        coord_content = re.sub(
            r'(\| Hora \(CEST\).*?)(?=\n\n|$)',
            r'<ForensicTable \n  title="TABLA 12 | ENTSO-E EAS: REGISTRO DE COMUNICACIONES"\n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
            coord_content,
            flags=re.DOTALL
        )
        with open(f_coord, "w", encoding="utf-8") as f:
            f.write(coord_content)

# dimension-europea\03-dia-despues.mdx
f_dia = os.path.join(ROOT, "dimension-europea", "03-dia-despues.mdx")
if os.path.exists(f_dia):
    with open(f_dia, "r", encoding="utf-8") as f:
        dia_content = f.read()
    if "<ForensicTable" not in dia_content:
        dia_content = re.sub(
            r'(\| Región Operativa.*?)(?=\n\n|$)',
            r'<ForensicTable \n  title="TABLA 13 | PRIMERA ENMIENDA: METODOLOGÍA DE RESERVAS"\n  source="Elaboración propia"\n>\n\n\1\n\n</ForensicTable>',
            dia_content,
            flags=re.DOTALL
        )
        with open(f_dia, "w", encoding="utf-8") as f:
            f.write(dia_content)

# 2. Now we re-number ALL <ForensicTable> titles sequentially
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

table_count = 1

for rel_path in files_in_order:
    path = os.path.join(ROOT, rel_path)
    if not os.path.exists(path):
        continue
        
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
        
    def replace_forensic_table(match):
        global table_count
        full_match = match.group(0)
        original_title = match.group(1)
        
        # Strip out any existing "TABLA X | " or "TABLA X: "
        clean_title = re.sub(r'^TABLA \d+[:|] ?', '', original_title, flags=re.IGNORECASE)
        new_title = f'TABLA {table_count} | {clean_title}'
        table_count += 1
        
        return full_match.replace(f'title="{original_title}"', f'title="{new_title}"')
        
    new_content = re.sub(r'<ForensicTable[^>]*title="([^"]*)"', replace_forensic_table, content)
    
    if new_content != content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Renumbered tables in {rel_path}")

print("Done! Total tables formatted and numbered:", table_count - 1)
