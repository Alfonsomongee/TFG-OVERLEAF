import os

base_path = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

files_to_fix = [
    "docs/01-introduccion.mdx",
    "i18n/de/docusaurus-plugin-content-docs/current/01-introduccion.mdx",
    "i18n/en/docusaurus-plugin-content-docs/current/01-introduccion.mdx",
    "i18n/en/docusaurus-plugin-content-docs/current/01-introduccion/index.mdx",
    "i18n/fr/docusaurus-plugin-content-docs/current/01-introduccion.mdx",
    "i18n/it/docusaurus-plugin-content-docs/current/01-introduccion.mdx",
    "i18n/pt/docusaurus-plugin-content-docs/current/01-introduccion.mdx",
]

def fix_image_references():
    for rel_path in files_to_fix:
        abs_path = os.path.join(base_path, rel_path)
        if not os.path.exists(abs_path):
            print(f"File not found: {abs_path}")
            continue
            
        print(f"Fixing reference in: {rel_path}")
        with open(abs_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        updated = content.replace("albustamiieee39secuencia.png", "albustami_ieee39_secuencia.png")
        updated = updated.replace("pmusensorseurope.png", "pmu_sensors_europe.png")
        
        with open(abs_path, 'w', encoding='utf-8') as f:
            f.write(updated)
        print(f"  Successfully fixed {rel_path}")

if __name__ == "__main__":
    fix_image_references()
    print("Done!")
