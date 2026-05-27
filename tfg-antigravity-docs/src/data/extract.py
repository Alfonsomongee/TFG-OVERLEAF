import re
import json

with open(r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\src\data\forensicCharts.js', 'r', encoding='utf-8') as f:
    content = f.read()

strings = []
for m in re.finditer(r"(?:title|fullTitle|subtitle|name|label|question):\s*'([^']+)'", content):
    strings.append(m.group(1))

for m in re.finditer(r'(?:title|fullTitle|subtitle|name|label|question):\s*"([^"]+)"', content):
    strings.append(m.group(1))

for m in re.finditer(r"(?:title|fullTitle|subtitle|name|label|question):\s*`([^`]+)`", content):
    strings.append(m.group(1))

with open(r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\src\data\strings.json', 'w', encoding='utf-8') as f:
    json.dump(list(set(strings)), f, indent=2, ensure_ascii=False)
