import json
import os

langs = {
    'en': {
        'sidebar.tutorialSidebar.category.DATOS EN TIEMPO REAL': 'REAL-TIME DATA',
        'sidebar.tutorialSidebar.category.RESUMEN DE CIFRAS': 'FIGURES SUMMARY',
        'sidebar.tutorialSidebar.doc.Las Cifras que No Mienten': 'The Numbers That Don\'t Lie',
        'sidebar.tutorialSidebar.doc.Galería de Imágenes': 'Image Gallery',
        'sidebar.tutorialSidebar.doc.Galería de Tablas': 'Table Gallery',
        'sidebar.tutorialSidebar.doc.Galería de Gráficas': 'Chart Gallery',
        'sidebar.tutorialSidebar.doc.Galería Forense': 'Forensic Gallery'
    },
    'pt': {
        'sidebar.tutorialSidebar.category.DATOS EN TIEMPO REAL': 'DADOS EM TEMPO REAL',
        'sidebar.tutorialSidebar.category.RESUMEN DE CIFRAS': 'RESUMO DE NÚMEROS',
        'sidebar.tutorialSidebar.doc.Las Cifras que No Mienten': 'Os Números que Não Mentem',
        'sidebar.tutorialSidebar.doc.Galería de Imágenes': 'Galeria de Imagens',
        'sidebar.tutorialSidebar.doc.Galería de Tablas': 'Galeria de Tabelas',
        'sidebar.tutorialSidebar.doc.Galería de Gráficas': 'Galeria de Gráficos',
        'sidebar.tutorialSidebar.doc.Galería Forense': 'Galeria Forense'
    },
    'fr': {
        'sidebar.tutorialSidebar.category.DATOS EN TIEMPO REAL': 'DONNÉES EN TEMPS RÉEL',
        'sidebar.tutorialSidebar.category.RESUMEN DE CIFRAS': 'RÉSUMÉ DES CHIFFRES',
        'sidebar.tutorialSidebar.doc.Las Cifras que No Mienten': 'Les Chiffres qui Ne Mentent Pas',
        'sidebar.tutorialSidebar.doc.Galería de Imágenes': 'Galerie d\'Images',
        'sidebar.tutorialSidebar.doc.Galería de Tablas': 'Galerie de Tableaux',
        'sidebar.tutorialSidebar.doc.Galería de Gráficas': 'Galerie de Graphiques',
        'sidebar.tutorialSidebar.doc.Galería Forense': 'Galerie Légale'
    },
    'it': {
        'sidebar.tutorialSidebar.category.DATOS EN TIEMPO REAL': 'DATI IN TEMPO REALE',
        'sidebar.tutorialSidebar.category.RESUMEN DE CIFRAS': 'RIEPILOGO DELLE CIFRE',
        'sidebar.tutorialSidebar.doc.Las Cifras que No Mienten': 'Le Cifre che Non Mentono',
        'sidebar.tutorialSidebar.doc.Galería de Imágenes': 'Galleria di Immagini',
        'sidebar.tutorialSidebar.doc.Galería de Tablas': 'Galleria di Tabelle',
        'sidebar.tutorialSidebar.doc.Galería de Gráficas': 'Galleria di Grafici',
        'sidebar.tutorialSidebar.doc.Galería Forense': 'Galleria Forense'
    },
    'de': {
        'sidebar.tutorialSidebar.category.DATOS EN TIEMPO REAL': 'ECHTZEITDATEN',
        'sidebar.tutorialSidebar.category.RESUMEN DE CIFRAS': 'ZAHLENÜBERSICHT',
        'sidebar.tutorialSidebar.doc.Las Cifras que No Mienten': 'Die Zahlen, die Nicht Lügen',
        'sidebar.tutorialSidebar.doc.Galería de Imágenes': 'Bildergalerie',
        'sidebar.tutorialSidebar.doc.Galería de Tablas': 'Tabellengalerie',
        'sidebar.tutorialSidebar.doc.Galería de Gráficas': 'Diagrammgalerie',
        'sidebar.tutorialSidebar.doc.Galería Forense': 'Forensische Galerie'
    }
}

base_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"

for lang, mappings in langs.items():
    file_path = os.path.join(base_dir, lang, "docusaurus-plugin-content-docs", "current.json")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        updated = False
        for key in list(data.keys()):
            # Handle unicode normalization or exactly match strings
            # Some strings might have weird characters like "Galera" in the system due to encoding
            # We will just do a partial match for keys just in case
            for target_key, message in mappings.items():
                if target_key.replace("í", "i").lower() in key.replace("í", "i").replace("", "i").lower():
                    data[key]["message"] = message
                    updated = True
        
        # also apply to exact matches if they exist and we missed them
        for target_key, message in mappings.items():
            if target_key in data:
                data[target_key]["message"] = message
                updated = True
                
        if updated:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Updated translations for {lang}")
    else:
        print(f"File not found: {file_path}")
