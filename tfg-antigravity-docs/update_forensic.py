import re

charts_file = 'src/data/forensicCharts.js'
with open(charts_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

charts_map = {
    'Cost of Congestion Management': ('T1', 'T5'),
    'Fall-backs y Protocolos Emergencia': ('T1', 'T6'),
    'Current Balancing State': ('T4', 'T5'),
    'Imbalance — Volumen MW': ('T4', 'T5'),
    'Imbalance Prices': ('T4', 'T5'),
    'FRR Capacity — Reservas': ('T4', 'T5'),
    'Water Reservoirs & Hydro': ('T5', 'T1'),
    'Otros Indicadores — CO₂ + Renovables': ('T5', 'T1')
}

for title, (old_t, new_t) in charts_map.items():
    # Find the line with the title
    title_idx = -1
    for i, line in enumerate(lines):
        if f"title: '{title}'" in line or f'title: "{title}"' in line:
            title_idx = i
            break
            
    if title_idx != -1:
        # Backtrack to find tema
        for j in range(title_idx, max(-1, title_idx - 15), -1):
            if "tema: '" in lines[j] or 'tema: "' in lines[j]:
                lines[j] = re.sub(r"tema:\s*['\"].*?['\"]", f"tema: '{new_t}'", lines[j])
                break
                
        # Also change categoryId if it exists nearby
        # categoryId: 'catX' where X is the number in new_t
        new_cat = 'cat' + new_t[1:]
        for j in range(title_idx, max(-1, title_idx - 15), -1):
            if "categoryId: '" in lines[j] or 'categoryId: "' in lines[j]:
                lines[j] = re.sub(r"categoryId:\s*['\"]cat.*?['\"]", f"categoryId: '{new_cat}'", lines[j])
                break

with open(charts_file, 'w', encoding='utf-8') as f:
    f.writelines(lines)
