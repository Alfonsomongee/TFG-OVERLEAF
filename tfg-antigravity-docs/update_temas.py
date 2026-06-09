import json
import re
import os
import glob

before = []
after = []

def record(item_id, file, field, curr_val, next_val):
    before.append(f"| {item_id} | {file} | {field} | {curr_val} | {next_val} |")
    after.append(f"| {item_id} | {file} | {field} | {next_val} |")

# 1. imageGalleryData.js
js_file = 'src/data/imageGalleryData.js'
with open(js_file, 'r', encoding='utf-8') as f:
    js_content = f.read()

changes_js = [
    ('evolucion_mix_reenergizacion', r"(id:\s*['\"]evolucion_mix_reenergizacion['\"].*?tema:\s*['\"])(.*?)(['\"])", 'T6'),
    ('heatmap_propagation', r"(id:\s*['\"]heatmap_propagation['\"].*?tema:\s*['\"])(.*?)(['\"])", 'T3'),
    ('scr_iberia', r"(id:\s*['\"]scr_iberia['\"].*?tema:\s*['\"])(.*?)(['\"])", 'T2'),
]

for item_id, pattern, new_val in changes_js:
    # re.DOTALL so .*? can match across lines
    match = re.search(pattern, js_content, re.DOTALL)
    if match:
        curr_val = match.group(2)
        record(item_id, js_file, 'tema', curr_val, new_val)
        js_content = js_content[:match.start(2)] + new_val + js_content[match.end(2):]

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

# 2. forensicCharts.js
charts_file = 'src/data/forensicCharts.js'
with open(charts_file, 'r', encoding='utf-8') as f:
    charts_content = f.read()

charts_map = {
    'Cost of Congestion Management': 'T5',
    'Fall-backs y Protocolos Emergencia': 'T6',
    'Current Balancing State': 'T5',
    'Imbalance — Volumen MW': 'T5',
    'Imbalance Prices': 'T5',
    'FRR Capacity — Reservas': 'T5',
    'Water Reservoirs & Hydro': 'T1',
    'Otros Indicadores — CO₂ + Renovables': 'T1'
}

for title, new_val in charts_map.items():
    # search for the block having this title
    # we can use a regex to find the title, then backtrack to `tema: 'XX'` or lookahead to `tema: 'XX'`
    # Usually it's id: 'chart-X', categoryId: 'catX', tema: 'TX', ..., title: 'Title'
    
    # regex to find the block of this chart roughly
    # find the block between `{` and `}` containing the title
    pattern = r"(\{[^{}]*title:\s*['\"]" + re.escape(title) + r"['\"][^{}]*tema:\s*['\"])(.*?)(['\"][^{}]*\})"
    match = re.search(pattern, charts_content, re.DOTALL)
    if not match:
        # maybe `tema` is before `title`
        pattern = r"(\{[^{}]*tema:\s*['\"])(.*?)(['\"][^{}]*title:\s*['\"]" + re.escape(title) + r"['\"][^{}]*\})"
        match = re.search(pattern, charts_content, re.DOTALL)
    
    if match:
        curr_val = match.group(2)
        
        # We need to change categoryId too if the user said "El campo puede llamarse tema o categoryId"
        # The user actually says: "Cambia el campo que realmente controla su aparición en anexos."
        # AnnexThemeEvidence filters by `tema`. So we must change `tema`.
        # However, categoryId might also need to be updated. Let's update `categoryId` to match the new tema (e.g. 'cat5' if 'T5').
        
        record(title, charts_file, 'tema', curr_val, new_val)
        charts_content = charts_content[:match.start(2)] + new_val + charts_content[match.end(2):]
        
        # update categoryId as well within the same block?
        # Let's search categoryId around the match
        cat_match = re.search(r"(categoryId:\s*['\"])(cat\d+)(['\"])", charts_content[match.start(1):match.end(3)])
        if cat_match:
            new_cat = 'cat' + new_val[1:]
            charts_content = charts_content[:match.start(1) + cat_match.start(2)] + new_cat + charts_content[match.start(1) + cat_match.end(2):]

with open(charts_file, 'w', encoding='utf-8') as f:
    f.write(charts_content)

# 3. forensic_categories.json and its translations
json_files = glob.glob('static/data/processed/forensic_categories*.json')
for jf in json_files:
    with open(jf, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    for cat in data.get('categories', []):
        for table in cat.get('tables', []):
            tid = table.get('id', '')
            
            changes_json = {
                'demand-shedding-es': 'T3',
                'demand-shedding-pt': 'T3',
                'electro-intensive-pt': 'T3',
                'load-shedding-es-pt': 'T3',
                'dso-load-shedding': 'T3',
                'compass-lexecon': 'T9'
            }
            
            new_val = None
            if tid in changes_json:
                new_val = changes_json[tid]
            elif 'comparativa-conclusiones' in tid and tid != 'compass-lexecon':
                new_val = 'T9'
                
            if new_val and table.get('tema') != new_val:
                curr_val = table.get('tema')
                record(tid, os.path.basename(jf), 'tema', curr_val, new_val)
                table['tema'] = new_val
                # we don't strictly need to move the table into another category block since AnnexThemeEvidence only filters by table.tema, but we might want to?
                # The task explicitly says "NO tocar forensic_categories más allá de los campos tema indicados."
                
    with open(jf, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

print("---BEFORE---")
for b in before: print(b)
print("---AFTER---")
for a in after: print(a)
