import os
import re
import json

base_dir = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

# 1. Parse conceptual annexes
annex_files = [
    "anexo-estabilidad-dinamica-tension.mdx",
    "anexo-cascada-protecciones-desconexiones.mdx",
    "anexo-interconexiones-flujos.mdx",
    "anexo-demanda-generacion-balance.mdx",
    "anexo-reposicion-blackstart.mdx",
    "anexo-mercado-costes.mdx",
    "anexo-impacto-resiliencia.mdx",
    "anexo-comunicacion-fuentes.mdx",
    "anexo-metodologia-modelos-datos-vivos.mdx"
]

annex_mapping = {
    "anexo-estabilidad-dinamica-tension.mdx": "T1",
    "anexo-cascada-protecciones-desconexiones.mdx": "T2",
    "anexo-interconexiones-flujos.mdx": "T3",
    "anexo-demanda-generacion-balance.mdx": "T4",
    "anexo-reposicion-blackstart.mdx": "T5",
    "anexo-mercado-costes.mdx": "T6",
    "anexo-impacto-resiliencia.mdx": "T7",
    "anexo-comunicacion-fuentes.mdx": "T8",
    "anexo-metodologia-modelos-datos-vivos.mdx": "T9"
}

used_elements = set()

for f_name in annex_files:
    f_path = os.path.join(base_dir, "docs", f_name)
    if os.path.exists(f_path):
        with open(f_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract charts: chartId="chart-1"
            charts = re.findall(r'chartId=["\']([^"\']+)["\']', content)
            # Extract images (various formats might be used, let's look for src or id)
            # e.g., <Image id="img-1" /> or similar, or just searching for the string if they are directly included.
            # actually we can just find any 'chart-\d+' or 'img-\d+' or 'tab-\d+' or strings in imageGalleryData.
            for c in charts:
                used_elements.add(c)
            # Let's also just grab all `chart-XX` in the text just in case
            all_charts = re.findall(r'chart-\d+', content)
            for c in all_charts:
                used_elements.add(c)

# 2. Parse forensicCharts.js
forensic_charts_path = os.path.join(base_dir, "src", "data", "forensicCharts.js")
defined_charts = []
if os.path.exists(forensic_charts_path):
    with open(forensic_charts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        # Find objects like: { id: 'chart-1', categoryId: 'cat1', tema: 'T1', ... }
        # Let's use regex to extract id and tema
        blocks = re.findall(r'\{\s*id:\s*[\'"](chart-\d+)[\'"](.*?)\}', content, re.DOTALL)
        for chart_id, rest in blocks:
            tema_match = re.search(r'tema:\s*[\'"](T\d)[\'"]', rest)
            tema = tema_match.group(1) if tema_match else 'Desconocido'
            defined_charts.append({'id': chart_id, 'tipo': 'Chart', 'fuente': 'forensicCharts.js', 'tema_esperado': tema})

# 3. Parse imageGalleryData.js
image_gallery_path = os.path.join(base_dir, "src", "data", "imageGalleryData.js")
defined_images = []
if os.path.exists(image_gallery_path):
    with open(image_gallery_path, 'r', encoding='utf-8') as f:
        content = f.read()
        blocks = re.findall(r'\{\s*id:\s*[\'"](.*?)[\'"](.*?)\}', content, re.DOTALL)
        for img_id, rest in blocks:
            # check if it has tema
            tema_match = re.search(r'tema:\s*[\'"](T\d)[\'"]', rest)
            tema = tema_match.group(1) if tema_match else 'Desconocido'
            defined_images.append({'id': img_id, 'tipo': 'Image', 'fuente': 'imageGalleryData.js', 'tema_esperado': tema})

# 4. Parse forensic_categories.json
forensic_cat_path = os.path.join(base_dir, "static", "data", "processed", "forensic_categories.json")
defined_tables = []
if os.path.exists(forensic_cat_path):
    with open(forensic_cat_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            # data structure? Let's assume it's a list of categories or dict. We will just dump keys if needed.
            # or we can read as string and find table IDs.
            # Normally tables might have IDs. 
            pass
        except:
            pass

# Output findings
orphan_elements = []

for item in defined_charts:
    if item['id'] not in used_elements:
        orphan_elements.append(item)

# Let's print the orphans so I can put them in a table
import sys
for o in orphan_elements:
    print(f"{o['id']}|{o['tipo']}|{o['fuente']}|{o['tema_esperado']}|No|{o['tema_esperado']}|Alto|Mover a anexo {o['tema_esperado']}")

if not os.path.exists(forensic_charts_path):
    print("forensicCharts.js not found at", forensic_charts_path)
