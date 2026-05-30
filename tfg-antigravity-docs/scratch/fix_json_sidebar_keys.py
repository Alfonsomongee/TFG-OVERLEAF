import os
import json

base_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"
langs = ['es', 'en', 'de', 'fr', 'it', 'pt']

translations = {
    'es': 'Gráficas Interactivas',
    'en': 'Interactive Graphics',
    'de': 'Interaktive Grafiken',
    'fr': 'Graphiques Interactifs',
    'it': 'Grafici Interattivi',
    'pt': 'Gráficos Interativos'
}

for lang in langs:
    filepath = os.path.join(base_dir, lang, 'docusaurus-plugin-content-docs', 'current.json')
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            old_key = "sidebar.tutorialSidebar.doc.Galería de Gráficas"
            new_key = "sidebar.tutorialSidebar.doc.Gráficas Interactivas"
            
            if old_key in data:
                val = data[old_key]
                val['message'] = translations[lang]
                val['description'] = f"The label for the doc item Gráficas Interactivas in sidebar tutorialSidebar, linking to the doc galeria-graficas"
                
                # Delete old key and insert new key
                data[new_key] = val
                del data[old_key]
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f"Updated sidebar key in JSON for {lang}")
            else:
                print(f"Key not found in {lang}")
        except Exception as e:
            print(f"Error for {lang}: {e}")
