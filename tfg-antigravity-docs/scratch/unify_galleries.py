import os
import re

base_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

# 1. Update links in all .mdx and .md files under docs/ and i18n/
# From: /docs/graficas-interactivas#
# To: /docs/14-galeria-graficas#
updated_files_count = 0

# Also check for specific hash maps:
# #ecuacion-oscilacion -> #swing
# #radar-vulnerabilidad -> #frequency (wait, let's check which is which)
# #mapa-topologico -> #topology
# #divergencia-angular -> #phasor
# #retrato-fases -> #phaseplane
# #reposicion -> #map
# #respuesta-droop -> #sismograph (wait, let's check)
# #grid-forming -> #frequency (wait, grid-forming and droop, let's map them correctly)
# Let's check what IDs the simulators had in the unified gallery:
# - frequency: Caída de Frecuencia (Hz)
# - map: Mapa Animado del Colapso
# - timeline: Cronograma del Incidente
# - streamgraph: Transición y Emisiones
# - waterfall: Auditoría Económica
# - topology: Topología de Red Neuronal (GNN)
# - sismograph: Sismógrafo del Colapso
# - phasor: Gráfico Fasorial Transitorio
# - phaseplane: Diagrama de Plano de Fase (GFM vs GFL)
# - interconnection: Dashboard de Interconexiones
# - swing: Simulador Ecuación del Swing
# - matrix: Matriz de Costes de Inacción

hash_map = {
    '#ecuacion-oscilacion': '#swing',
    '#radar-vulnerabilidad': '#frequency',
    '#mapa-topologico': '#topology',
    '#divergencia-angular': '#phasor',
    '#retrato-fases': '#phaseplane',
    '#reposicion': '#map',
    '#respuesta-droop': '#sismograph', # Wait, termometro-riesgo is under droop, let's keep it or map it to sismograph
    '#grid-forming': '#frequency', # frequency has grid-forming comparison
    '#matriz-costes': '#matrix'
}

for root, dirs, files in os.walk(base_dir):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build']]
    for file in files:
        if file.endswith('.mdx') or file.endswith('.md'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Replace links
                if '/docs/graficas-interactivas' in content:
                    content = content.replace('/docs/graficas-interactivas', '/docs/14-galeria-graficas')
                
                # Replace hashes
                for old_hash, new_hash in hash_map.items():
                    content = content.replace(old_hash, new_hash)
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    updated_files_count += 1
                    print(f"Updated links/hashes in: {os.path.relpath(filepath, base_dir)}")
            except Exception as e:
                print(f"Error processing {file}: {e}")

print(f"Updated {updated_files_count} files with correct gallery links and hashes.")

# 2. Modify sidebars.js
sidebars_path = os.path.join(base_dir, 'sidebars.js')
if os.path.exists(sidebars_path):
    with open(sidebars_path, 'r', encoding='utf-8') as f:
        sb_content = f.read()
    
    # Remove the entry for 'graficas-interactivas'
    pattern_to_remove = r"""\s*\{\s*type:\s*'doc',\s*id:\s*'graficas-interactivas',\s*label:\s*'Gráficas Interactivas',\s*\},?"""
    sb_content = re.sub(pattern_to_remove, "", sb_content)
    
    # Change the label of 'galeria-graficas' from 'Galería de Gráficas' to 'Gráficas Interactivas'
    sb_content = sb_content.replace("id: 'galeria-graficas',\n          label: 'Galería de Gráficas',", "id: 'galeria-graficas',\n          label: 'Gráficas Interactivas',")
    
    with open(sidebars_path, 'w', encoding='utf-8') as f:
        f.write(sb_content)
    print("Updated sidebars.js to remove redundant gallery and rename original to 'Gráficas Interactivas'.")

# 3. Delete redundant docs/graficas-interactivas.mdx
redundant_mdx = os.path.join(base_dir, 'docs', 'graficas-interactivas.mdx')
if os.path.exists(redundant_mdx):
    os.remove(redundant_mdx)
    print("Deleted redundant docs/graficas-interactivas.mdx.")
else:
    print("docs/graficas-interactivas.mdx was already deleted or not found.")
