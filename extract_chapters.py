#!/usr/bin/env python3
"""
Extrae cada capítulo del PROYECTO MEJORA DOCUSAURUS.txt
y los escribe en los archivos .mdx correctos del proyecto Docusaurus.
"""
import os

BASE = r"C:\Users\aphmo\Proyectos\TFG OVERLEAF"
TXT  = os.path.join(BASE, "PROYECTO MEJORA DOCUSAURUS.txt")
DOCS = os.path.join(BASE, "tfg-antigravity-docs", "docs")
I18N = os.path.join(BASE, "tfg-antigravity-docs", "i18n", "en",
                    "docusaurus-plugin-content-docs", "current")

with open(TXT, "r", encoding="utf-8") as f:
    lines = f.readlines()

def get_section(start_line, end_line):
    """Extrae líneas [start_line, end_line) (1-indexed) y elimina líneas vacías iniciales."""
    chunk = lines[start_line:end_line]
    # Eliminar líneas vacías al principio y al final
    while chunk and chunk[0].strip() == '':
        chunk.pop(0)
    while chunk and chunk[-1].strip() == '':
        chunk.pop()
    return ''.join(chunk)

# Mapa de secciones: (start_line_1indexed, end_line_1indexed_exclusive)
# Nota: línea 1-indexed → índice 0-indexed = línea-1
# Los marcadores están en las líneas indicadas; el contenido empieza en la siguiente.
sections = {
    # ES chapters
    "cap1_es":  (4,    154),   # // CAP 1 en línea 3, VERSION INGLES en 154
    "cap2_es":  (309,  563),   # \\ CAP 2 en línea 308, version ingles en 563
    "cap3_es":  (811,  1051),  # \\ CAP 3 en línea 810, VERSION INGLES en 1051
    "cap4_es":  (1281, 1502),  # \\ CAP 4 en línea 1280, VERSION INGLES en 1502
    "cap5_es":  (1713, 2080),  # \\ CAP 5 en línea 1712, VERSION INGLES en 2080
    "cap6_es":  (2428, 2724),  # \\CAP 7 (mislabeled) en línea 2427, VERSION INGLES en 2724
    "cap7_es":  (3006, 3491),  # \\ CAP 7 en línea 3005, version ingles en 3491
    "cap8_es":  (3945, 4126),  # \\ CAP 8 en línea 3944, VERSION INGLES en 4126
    "cap9_es":  (4300, 4511),  # \\ CAP 9 en línea 4299, VERSION INGLES en 4511
    # EN chapters
    "cap1_en":  (155,  308),
    "cap2_en":  (564,  810),
    "cap3_en":  (1052, 1280),
    "cap4_en":  (1503, 1712),
    "cap5_en":  (2081, 2427),
    "cap6_en":  (2725, 3005),
    "cap7_en":  (3492, 3944),
    "cap8_en":  (4127, 4299),
    "cap9_en":  (4512, len(lines)+1),
}

# Mapeo a ficheros de destino
file_map = {
    "cap1_es":  os.path.join(DOCS, "01-introduccion.mdx"),
    "cap2_es":  os.path.join(DOCS, "02-contexto.mdx"),
    "cap3_es":  os.path.join(DOCS, "03-analisis-incidente.mdx"),
    "cap4_es":  os.path.join(DOCS, "04-reaccion-reposicion.mdx"),
    "cap5_es":  os.path.join(DOCS, "05-analisis-informes.mdx"),
    "cap6_es":  os.path.join(DOCS, "06-impacto-comunicativo.mdx"),
    "cap7_es":  os.path.join(DOCS, "07-resiliencia-futuro.mdx"),
    "cap8_es":  os.path.join(DOCS, "08-uso-ia.mdx"),
    "cap9_es":  os.path.join(DOCS, "09-conclusiones.mdx"),
    "cap1_en":  os.path.join(I18N, "01-introduccion.mdx"),
    "cap2_en":  os.path.join(I18N, "02-contexto.mdx"),
    "cap3_en":  os.path.join(I18N, "03-analisis-incidente.mdx"),
    "cap4_en":  os.path.join(I18N, "04-reaccion-reposicion.mdx"),
    "cap5_en":  os.path.join(I18N, "05-analisis-informes.mdx"),
    "cap6_en":  os.path.join(I18N, "06-impacto-comunicativo.mdx"),
    "cap7_en":  os.path.join(I18N, "07-resiliencia-futuro.mdx"),
    "cap8_en":  os.path.join(I18N, "08-uso-ia.mdx"),
    "cap9_en":  os.path.join(I18N, "09-conclusiones.mdx"),
}

os.makedirs(DOCS, exist_ok=True)
os.makedirs(I18N, exist_ok=True)

print("Extrayendo y escribiendo capítulos...\n")
for key, (start, end) in sections.items():
    content = get_section(start - 1, end - 1)  # convertir a 0-indexed
    dest = file_map[key]
    with open(dest, "w", encoding="utf-8") as f:
        f.write(content)
        f.write("\n")
    size = len(content)
    print(f"  ✅ {key:10s} → {os.path.basename(dest):35s}  ({size:6d} chars, lines {start}-{end-1})")

print("\nTodo escrito. Verificando primeras líneas de cada capítulo ES:")
for key in ["cap1_es","cap2_es","cap3_es","cap4_es","cap5_es","cap6_es","cap7_es","cap8_es","cap9_es"]:
    dest = file_map[key]
    with open(dest, "r", encoding="utf-8") as f:
        first = f.readline().rstrip()
    print(f"  {key}: {first!r}")
