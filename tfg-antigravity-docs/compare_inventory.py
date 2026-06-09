import re

# Read the full data from output_data.txt
with open('output_data.txt', 'r', encoding='utf-8') as f:
    full_data = f.readlines()

all_items = []
for line in full_data:
    line = line.strip()
    if not line:
        continue
    parts = line.split('|')
    if len(parts) == 5:
        # ID | Tipo | Fuente original | Tema actual | Anexo esperado
        # Wait, the column "Fuente original" in output_data.txt is actually title or something?
        # Let's check: chart-1|Chart|Demanda Peninsular|T1|Demanda, Generación y Balance
        # albustami_ieee39_secuencia.png|Image|albustami_ieee39_secuencia.png|T3|Cascada, Protecciones y Desconexiones
        # mix-generacion-12-30|Table|Mix de generación en el sistema...|T1|Demanda, Generación y Balance
        all_items.append({
            'id': parts[0],
            'tipo': parts[1],
            'fuente': parts[2],
            'tema': parts[3],
            'anexo_esperado': f"{parts[3]} ({parts[4]})"
        })

# Also parse InteractiveGraphicsGalleryBase.jsx manually here
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
    # Check if already in all_items
    if not any(x['id'] == item_id for x in all_items):
        all_items.append({
            'id': item_id,
            'tipo': 'Interactive',
            'fuente': src,
            'tema': tema,
            'anexo_esperado': tema
        })

# Read the bad inventory
with open('inventario_actual_anexos.txt', 'r', encoding='utf-8') as f:
    bad_inv = f.read()

# Extract all mentioned IDs from the bad inventory
# Matches like "- chart-1 (" or "- frequency (" or "- albustami..." 
# We'll just do a rough check if the ID string is present in the text
missing = []
for item in all_items:
    id_str = item['id']
    # if it's an image, the ID might be something like 'albustami_ieee39_secuencia.png'. 
    # Let's remove '.png' to search just the basename, just in case
    search_str = id_str.replace('.png', '')
    
    if search_str not in bad_inv:
        missing.append(item)

# Print markdown table
print("| ID | Tipo | Fuente original | Tema actual | ¿Aparece en anexo conceptual? | Anexo esperado | Riesgo | Acción recomendada |")
print("|---|---|---|---|---|---|---|---|")

for m in missing:
    id_val = m['id']
    tipo = m['tipo']
    if tipo == 'Chart':
        fuente = 'forensicCharts.js'
    elif tipo == 'Image':
        fuente = 'imageGalleryData.js'
    elif tipo == 'Table':
        fuente = 'forensic_categories.json'
    else:
        fuente = m['fuente']
        
    tema = m['tema']
    anexo = m['anexo_esperado']
    
    # Analyze Risk & Action
    riesgo = "Alto" if (tipo == 'Chart' or tipo == 'Table') else "Medio"
    accion = f"Actualizar inventario/MDX para reflejar que sí tiene etiqueta {tema}"
    
    if tema == 'T1' and 'chart-22' in id_val:
        riesgo = "Alto (Tema incorrecto)"
        accion = "Cambiar tema a T5 (Mercado/Costes)"
    
    print(f"| `{id_val}` | {tipo} | `{fuente}` | `{tema}` | No | {anexo} | {riesgo} | {accion} |")
