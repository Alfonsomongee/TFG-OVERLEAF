import os
import re
import json

base_dir = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"
annex_mapping = {
    "T1": "Demanda, Generación y Balance",
    "T2": "Estabilidad, frecuencia y tensión",
    "T3": "Cascada, Protecciones y Desconexiones",
    "T4": "Interconexiones y Flujos",
    "T5": "Mercados y Costes",
    "T6": "Reposición y Black Start",
    "T7": "Impacto y Resiliencia",
    "T8": "Comunicación y Fuentes",
    "T9": "Metodología, Modelos y Datos Vivos"
}

def parse_charts():
    res = []
    path = os.path.join(base_dir, "src", "data", "forensicCharts.js")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            # find all chart objects roughly
            blocks = re.findall(r'\{\s*id:\s*[\'"](chart-[^"\']+)[\'"](.*?)\n\s*\}', content, re.DOTALL)
            for c_id, rest in blocks:
                tema_match = re.search(r'tema:\s*[\'"]([^"\']+)[\'"]', rest)
                title_match = re.search(r'title:\s*[\'"]([^"\']+)[\'"]', rest)
                tema = tema_match.group(1) if tema_match else 'None'
                title = title_match.group(1) if title_match else ''
                res.append({'id': c_id, 'tipo': 'Chart', 'fuente': 'forensicCharts.js', 'tema': tema, 'title': title})
    return res

def parse_images():
    res = []
    path = os.path.join(base_dir, "src", "data", "imageGalleryData.js")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            blocks = re.findall(r'\{\s*src:\s*[\'"]([^"\']+)[\'"](.*?)\}', content, re.DOTALL)
            for src, rest in blocks:
                tema_match = re.search(r'tema:\s*[\'"]([^"\']+)[\'"]', rest)
                tema = tema_match.group(1) if tema_match else 'None'
                # Just use basename of src as id
                c_id = os.path.basename(src)
                res.append({'id': c_id, 'tipo': 'Image', 'fuente': 'imageGalleryData.js', 'tema': tema, 'title': c_id})
    return res

def parse_tables():
    res = []
    path = os.path.join(base_dir, "static", "data", "processed", "forensic_categories.json")
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for cat in data.get('categories', []):
                for tb in cat.get('tables', []):
                    c_id = tb.get('id', 'Unknown')
                    tema = tb.get('tema', 'None')
                    title = tb.get('name', '')
                    res.append({'id': c_id, 'tipo': 'Table', 'fuente': 'forensic_categories.json', 'tema': tema, 'title': title})
    return res

all_elements = parse_charts() + parse_images() + parse_tables()

with open(os.path.join(base_dir, 'output_data.txt'), 'w', encoding='utf-8') as f:
    for el in all_elements:
        anexo_actual = annex_mapping.get(el['tema'], 'No mapeado a anexo T1-T9')
        f.write(f"{el['id']}|{el['tipo']}|{el['title']}|{el['tema']}|{anexo_actual}\n")
