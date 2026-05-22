import glob
import re

files = glob.glob('i18n/*/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx')

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Remove imports
    content = re.sub(r'import FrequencyChart from "@site/src/components/FrequencyChart";\n?', '', content)
    content = re.sub(r'import EnergyMixChart from "@site/src/components/EnergyMixChart";\n?', '', content)
    content = re.sub(r'import AnimatedMap from "@site/src/components/AnimatedMap";\n?', '', content)

    # Remove FrequencyChart and BrowserOnly
    freq_replacement = r'![Evolución de la frecuencia del sistema durante la Fase 1. Análisis NREL](/figuras/timeline_frecuencia_nrel.png)'
    content = re.sub(r'<BrowserOnly fallback=\{<div>.*?</div>\}>\s*\{\(\) => <FrequencyChart />\}\s*</BrowserOnly>', freq_replacement, content, flags=re.DOTALL)

    # Remove AnimatedMap and BrowserOnly
    content = re.sub(r'<BrowserOnly fallback=\{<div>.*?</div>\}>\s*\{\(\) => <AnimatedMap lang=".*?" />\}\s*</BrowserOnly>', '', content, flags=re.DOTALL)

    # Remove EnergyMixChart and BrowserOnly
    content = re.sub(r'<BrowserOnly fallback=\{<div>.*?</div>\}>\s*\{\(\) => <EnergyMixChart />\}\s*</BrowserOnly>', '', content, flags=re.DOTALL)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
    print(f'Cleaned {f}')
