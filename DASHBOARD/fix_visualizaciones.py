import re

file_path = "C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\DASHBOARD\\visualizaciones_forenses.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Increase font sizes and chart heights
content = content.replace('size=8', 'size=12')
content = content.replace('size=9', 'size=13')
content = content.replace('size=10', 'size=14')
content = content.replace('size=11', 'size=14')
content = content.replace('size=12', 'size=15')
content = content.replace('size=14', 'size=18')
content = content.replace('height=400', 'height=500')
content = content.replace('height=440', 'height=500')
content = content.replace('height=550', 'height=800')

# Use proper datetime objects for Plotly now that annotation_text is removed
content = content.replace('T_COLAPSO_STR', 'T_COLAPSO_DT')
content = content.replace('str(T_COLAPSO_DT + timedelta(minutes=37))', '(T_COLAPSO_DT + timedelta(minutes=37))')
content = content.replace('str(T_COLAPSO_DT + timedelta(hours=1))', '(T_COLAPSO_DT + timedelta(hours=1))')
content = content.replace('str(T_COLAPSO_DT + timedelta(hours=2))', '(T_COLAPSO_DT + timedelta(hours=2))')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("visualizaciones_forenses.py updated for fonts and x-axis fixes.")
