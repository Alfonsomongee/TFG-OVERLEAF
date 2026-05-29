import json
import os

base_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"

translations = {
    'en': {
        'theme.cine.open': {'message': 'Open Cinema Mode', 'description': ''},
        'theme.cine.button': {'message': 'Cinema Mode', 'description': ''},
        'theme.sidebar.open': {'message': 'Open sidebar', 'description': ''},
        'theme.sidebar.close': {'message': 'Close sidebar', 'description': ''},
        'theme.toc.hide': {'message': 'Hide table of contents', 'description': ''},
        'theme.toc.show': {'message': 'Show table of contents', 'description': ''}
    },
    'fr': {
        'theme.cine.open': {'message': 'Ouvrir le mode Cinéma', 'description': ''},
        'theme.cine.button': {'message': 'Mode Cinéma', 'description': ''},
        'theme.sidebar.open': {'message': 'Ouvrir la barre latérale', 'description': ''},
        'theme.sidebar.close': {'message': 'Fermer la barre latérale', 'description': ''},
        'theme.toc.hide': {'message': 'Masquer la table des matières', 'description': ''},
        'theme.toc.show': {'message': 'Afficher la table des matières', 'description': ''}
    },
    'it': {
        'theme.cine.open': {'message': 'Apri modalità Cinema', 'description': ''},
        'theme.cine.button': {'message': 'Modalità Cinema', 'description': ''},
        'theme.sidebar.open': {'message': 'Apri barra laterale', 'description': ''},
        'theme.sidebar.close': {'message': 'Chiudi barra laterale', 'description': ''},
        'theme.toc.hide': {'message': 'Nascondi indice', 'description': ''},
        'theme.toc.show': {'message': 'Mostra indice', 'description': ''}
    },
    'pt': {
        'theme.cine.open': {'message': 'Abrir modo Cinema', 'description': ''},
        'theme.cine.button': {'message': 'Modo Cinema', 'description': ''},
        'theme.sidebar.open': {'message': 'Abrir barra lateral', 'description': ''},
        'theme.sidebar.close': {'message': 'Fechar barra lateral', 'description': ''},
        'theme.toc.hide': {'message': 'Ocultar índice', 'description': ''},
        'theme.toc.show': {'message': 'Mostrar índice', 'description': ''}
    },
    'de': {
        'theme.cine.open': {'message': 'Kinomodus öffnen', 'description': ''},
        'theme.cine.button': {'message': 'Kinomodus', 'description': ''},
        'theme.sidebar.open': {'message': 'Seitenleiste öffnen', 'description': ''},
        'theme.sidebar.close': {'message': 'Seitenleiste schließen', 'description': ''},
        'theme.toc.hide': {'message': 'Inhaltsverzeichnis ausblenden', 'description': ''},
        'theme.toc.show': {'message': 'Inhaltsverzeichnis einblenden', 'description': ''}
    },
    'es': {
        'theme.cine.open': {'message': 'Abrir Modo Cine', 'description': ''},
        'theme.cine.button': {'message': 'Modo Cine', 'description': ''},
        'theme.sidebar.open': {'message': 'Abrir barra lateral', 'description': ''},
        'theme.sidebar.close': {'message': 'Cerrar barra lateral', 'description': ''},
        'theme.toc.hide': {'message': 'Ocultar índice', 'description': ''},
        'theme.toc.show': {'message': 'Mostrar índice', 'description': ''}
    }
}

for lang, data in translations.items():
    json_path = os.path.join(base_dir, lang, "code.json")
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            try:
                content = json.load(f)
            except:
                content = {}
    else:
        content = {}
        
    for k, v in data.items():
        content[k] = v
        
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang} code.json")
