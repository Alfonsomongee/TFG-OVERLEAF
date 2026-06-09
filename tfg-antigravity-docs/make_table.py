import re

with open('output_data.txt', 'r', encoding='utf-8') as f:
    full_data = f.readlines()

all_items = []
for line in full_data:
    line = line.strip()
    if not line: continue
    parts = line.split('|')
    if len(parts) == 5:
        all_items.append({
            'id': parts[0], 'tipo': parts[1], 'fuente': parts[2],
            'tema': parts[3], 'anexo_esperado': f"{parts[3]}"
        })

interactives = [
    ('frequency', 'T2', 'InteractiveGraphicsGalleryBase.jsx'),
    ('map', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('timeline', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('streamgraph', 'T1', 'InteractiveGraphicsGalleryBase.jsx'),
    ('waterfall', 'T7', 'InteractiveGraphicsGalleryBase.jsx'),
    ('topology', 'T4', 'InteractiveGraphicsGalleryBase.jsx'),
    ('sismograph', 'T2', 'InteractiveGraphicsGalleryBase.jsx'),
    ('phasor', 'T2', 'InteractiveGraphicsGalleryBase.jsx'),
    ('phaseplane', 'T9', 'InteractiveGraphicsGalleryBase.jsx'),
    ('interconnection', 'T4', 'InteractiveGraphicsGalleryBase.jsx'),
    ('swing', 'T9', 'InteractiveGraphicsGalleryBase.jsx'),
    ('matrix', 'T5', 'InteractiveGraphicsGalleryBase.jsx'),
    ('pvcurve', 'T9', 'InteractiveGraphicsGalleryBase.jsx'),
    ('ansi59', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('sticky-collapse', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('comparador-28a', 'T9', 'InteractiveGraphicsGalleryBase.jsx'),
    ('radar-vulnerabilidad', 'T9', 'InteractiveGraphicsGalleryBase.jsx'),
    ('tap-lag-sequence', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('grid-unavailability', 'T3', 'InteractiveGraphicsGalleryBase.jsx'),
    ('emissions-renewables', 'T1', 'InteractiveGraphicsGalleryBase.jsx'),
    ('sectorial-resilience', 'T7', 'InteractiveGraphicsGalleryBase.jsx')
]
for item_id, tema, src in interactives:
    if not any(x['id'] == item_id for x in all_items):
        all_items.append({'id': item_id, 'tipo': 'Interactive', 'fuente': src, 'tema': tema, 'anexo_esperado': tema})

with open('inventario_actual_anexos.txt', 'r', encoding='utf-8') as f:
    bad_inv = f.read()

missing = []
for item in all_items:
    search_str = item['id'].replace('.png', '')
    if search_str not in bad_inv:
        missing.append(item)

out_lines = ["| ID | Tipo | Fuente original | Tema actual | ¿Aparece en anexo conceptual? | Anexo esperado | Riesgo | Acción recomendada |", "|---|---|---|---|---|---|---|---|"]
for m in missing:
    id_val, tipo, tema, anexo = m['id'], m['tipo'], m['tema'], m['anexo_esperado']
    if tipo == 'Chart': fuente = 'forensicCharts.js'
    elif tipo == 'Image': fuente = 'imageGalleryData.js'
    elif tipo == 'Table': fuente = 'forensic_categories.json'
    else: fuente = m['fuente']
    
    riesgo, accion = "Alto", f"Actualizar inventario/MDX para reflejar que sí tiene etiqueta {tema}"
    if tipo == 'Image' or tipo == 'Interactive': riesgo = "Medio"
    
    if tema == 'T1' and ('chart-22' in id_val or 'chart-23' in id_val):
        riesgo = "Alto (Tema incorrecto)"
        accion = "Cambiar tema a T5 o T3 respectivamente"
    if 'chart-16' in id_val or 'chart-17' in id_val or 'intercambios' in id_val:
        riesgo = "Alto"
        accion = "Crucial: Vincular a T4 (Interconexiones)"
    
    out_lines.append(f"| `{id_val}` | {tipo} | `{fuente}` | `{tema}` | No | {anexo} | {riesgo} | {accion} |")

with open('missing_table_utf8.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out_lines))
