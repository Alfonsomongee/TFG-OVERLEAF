import os
import re

DOCS_DIR = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs"

# Files in correct narrative order:
files_in_order = [
    r"intro.mdx",
    r"01-introduccion.mdx",
    r"02-contexto.mdx",
    r"03-analisis-incidente.mdx",
    r"06-impacto-comunicativo.mdx",
    r"05-analisis-informes.mdx",
    r"dimension-europea/01-francia-portugal.mdx",
    r"dimension-europea/02-coordinacion-continental.mdx",
    r"dimension-europea/03-dia-despues.mdx",
    r"04-reaccion-reposicion.mdx",
    r"07b-consecuencias-financieras.mdx",
    r"07-resiliencia-futuro.mdx",
    r"08-uso-ia.mdx",
    r"08.5-actualizacion-2026.mdx",
    r"09-conclusiones.mdx",
    r"10-resumen-de-cifras.mdx",
]

FORENSIC_TAG_RE = re.compile(r'<ForensicTable\s+([^>]+)>')

def extract_attrs(tag_content):
    title = re.search(r'title="([^"]*)"', tag_content)
    source = re.search(r'source="([^"]*)"', tag_content)
    confidence = re.search(r'confidence="([^"]*)"', tag_content)
    return {
        "title": title.group(1) if title else "",
        "source": source.group(1) if source else "",
        "confidence": confidence.group(1) if confidence else ""
    }

for rel_path in files_in_order:
    path = os.path.join(DOCS_DIR, rel_path)
    if not os.path.exists(path):
        print(f"File not found: {rel_path}")
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    tags = FORENSIC_TAG_RE.findall(content)
    if tags:
        print(f"\n--- {rel_path} ---")
        for i, tag in enumerate(tags):
            attrs = extract_attrs(tag)
            print(f"Table {i+1}: title='{attrs['title']}', source='{attrs['source']}', confidence='{attrs['confidence']}'")
