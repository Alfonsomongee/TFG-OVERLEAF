import os
import re

I18N_DIR = r'c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n'
LANGS = ['en', 'de', 'fr', 'it', 'pt']

for lang in LANGS:
    filepath = os.path.join(I18N_DIR, lang, 'docusaurus-plugin-content-docs', 'current', '07b-consecuencias-financieras.mdx')
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Insert import if missing
        if 'EconomicImpactTable' not in content:
            content = content.replace('import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";', 'import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";\nimport EconomicImpactTable from "@site/src/components/EconomicImpactTable";')
        
        # Replace the manual table
        content = re.sub(r'<ForensicTable[^>]*title="TABLA 13[^>]*>.*?<\/ForensicTable>', '<EconomicImpactTable />', content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated 07b for {lang}')
