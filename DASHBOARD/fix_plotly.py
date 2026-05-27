import re

file_path = "C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\DASHBOARD\\visualizaciones_forenses.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make the replacements
content = content.replace("x=T_COLAPSO_DT,", "x=str(T_COLAPSO_DT),")
content = content.replace("x0=T_COLAPSO_DT,", "x0=str(T_COLAPSO_DT),")
content = content.replace("x0=T_COLAPSO_DT,", "x0=str(T_COLAPSO_DT),")
content = content.replace("x1=T_COLAPSO_DT + timedelta(minutes=37),", "x1=str(T_COLAPSO_DT + timedelta(minutes=37)),")
content = content.replace("x0=T_COLAPSO_DT + timedelta(minutes=37),", "x0=str(T_COLAPSO_DT + timedelta(minutes=37)),")
content = content.replace("x1=T_COLAPSO_DT + timedelta(hours=2),", "x1=str(T_COLAPSO_DT + timedelta(hours=2)),")
content = content.replace("x1=T_COLAPSO_DT + timedelta(hours=1),", "x1=str(T_COLAPSO_DT + timedelta(hours=1)),")
content = content.replace("x0=T_COLAPSO_DT, x1=T_COLAPSO_DT + timedelta(minutes=37),", "x0=str(T_COLAPSO_DT), x1=str(T_COLAPSO_DT + timedelta(minutes=37)),")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("visualizaciones_forenses.py fixed")
