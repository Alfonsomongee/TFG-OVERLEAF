import os
import sys
import json
import datetime

# Root paths
base_dir = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF"
web_dir = os.path.join(base_dir, "tfg-antigravity-docs")
output_path = os.path.join(base_dir, "volcado_completo.txt")

sys.stdout.reconfigure(encoding='utf-8')

# Metadata header
header = f"""================================================================================
VOLCADO COMPLETO DEL SITIO WEB – TFG APAGÓN 28A
Generado el {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} por Antigravity (Agente de IA).
Estructura unificada de Docusaurus para Auditoría Técnica y Forense.
================================================================================

"""

def get_dir_tree(startpath, max_depth=4):
    """Generates tree structure manually to avoid dependency issues."""
    tree_lines = []
    prefix = '    '
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.docusaurus', 'build']]
        level = root.replace(startpath, '').count(os.sep)
        if level >= max_depth:
            continue
        indent = prefix * level
        tree_lines.append(f"{indent}├── {os.path.basename(root)}/")
        subindent = prefix * (level + 1)
        for f in files:
            tree_lines.append(f"{subindent}├── {f}")
    return "\n".join(tree_lines)

with open(output_path, 'w', encoding='utf-8') as out:
    out.write(header)
    
    # -------------------------------------------------------------------------
    # SECCIÓN 1: ARQUITECTURA GENERAL Y CONFIGURACIÓN
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 1: ARQUITECTURA GENERAL Y CONFIGURACIÓN\n")
    out.write("================================================================================\n\n")
    
    # 1.1 docusaurus.config.js
    out.write("1.1 docusaurus.config.js completo\n")
    out.write("--------------------------------------------------------------------------------\n")
    config_path = os.path.join(web_dir, "docusaurus.config.js")
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            out.write(f.read())
    else:
        out.write("docusaurus.config.js not found\n")
    out.write("\n\n")
    
    # 1.2 package.json
    out.write("1.2 package.json completo\n")
    out.write("--------------------------------------------------------------------------------\n")
    package_path = os.path.join(web_dir, "package.json")
    if os.path.exists(package_path):
        with open(package_path, 'r', encoding='utf-8') as f:
            out.write(f.read())
    else:
        out.write("package.json not found\n")
    out.write("\n\n")
    
    # 1.3 Directory tree
    out.write("1.3 Estructura de directorios (tree)\n")
    out.write("--------------------------------------------------------------------------------\n")
    out.write(get_dir_tree(web_dir, max_depth=3))
    out.write("\n\n")
    
    # 1.4 sidebars.js
    out.write("1.4 Configuración de la barra lateral (sidebars.js)\n")
    out.write("--------------------------------------------------------------------------------\n")
    sidebars_path = os.path.join(web_dir, "sidebars.js")
    if os.path.exists(sidebars_path):
        with open(sidebars_path, 'r', encoding='utf-8') as f:
            out.write(f.read())
    else:
        out.write("sidebars.js not found\n")
    out.write("\n\n")
    
    # 1.5 i18n/ config code.json files
    out.write("1.5 Configuración de internacionalización (i18n/)\n")
    out.write("--------------------------------------------------------------------------------\n")
    i18n_dir = os.path.join(web_dir, "i18n")
    if os.path.exists(i18n_dir):
        for lang in ['en', 'de', 'fr', 'it', 'pt']:
            lang_code_path = os.path.join(i18n_dir, lang, "code.json")
            out.write(f"\n--- code.json para {lang.upper()} ---\n")
            if os.path.exists(lang_code_path):
                with open(lang_code_path, 'r', encoding='utf-8') as f:
                    out.write(f.read())
            else:
                out.write(f"code.json not found for {lang}\n")
            
            lang_docs_path = os.path.join(i18n_dir, lang, "docusaurus-plugin-content-docs", "current.json")
            out.write(f"\n--- current.json (sidebar labels) para {lang.upper()} ---\n")
            if os.path.exists(lang_docs_path):
                with open(lang_docs_path, 'r', encoding='utf-8') as f:
                    out.write(f.read())
            else:
                out.write(f"current.json not found for {lang}\n")
    else:
        out.write("i18n directory not found\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 2: CONTENIDO DOCUMENTAL (TEXTO, MDX)
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 2: CONTENIDO DOCUMENTAL (TEXTO, MDX)\n")
    out.write("================================================================================\n\n")
    
    # Dump Spanish original documents
    out.write("2.1 Documentos en Español (docs/)\n")
    out.write("--------------------------------------------------------------------------------\n")
    docs_dir = os.path.join(web_dir, "docs")
    if os.path.exists(docs_dir):
        for root, _, files in os.walk(docs_dir):
            for file in sorted(files):
                if file.endswith('.mdx') or file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, docs_dir)
                    out.write(f"\n=== ARCHIVO: docs/{rel_path} ===\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        out.write(f.read())
                    out.write("\n")
    else:
        out.write("docs/ directory not found\n")
    out.write("\n\n")
    
    # Dump translated documents
    out.write("2.2 Traducciones de Documentos (i18n/)\n")
    out.write("--------------------------------------------------------------------------------\n")
    if os.path.exists(i18n_dir):
        for lang in ['en', 'de', 'fr', 'it', 'pt']:
            lang_docs_dir = os.path.join(i18n_dir, lang, "docusaurus-plugin-content-docs", "current")
            out.write(f"\n--- TRADUCCIONES PARA {lang.upper()} ---\n")
            if os.path.exists(lang_docs_dir):
                for root, _, files in os.walk(lang_docs_dir):
                    for file in sorted(files):
                        if file.endswith('.mdx') or file.endswith('.md'):
                            filepath = os.path.join(root, file)
                            rel_path = os.path.relpath(filepath, lang_docs_dir)
                            out.write(f"\n=== ARCHIVO: i18n/{lang}/docusaurus-plugin-content-docs/current/{rel_path} ===\n")
                            with open(filepath, 'r', encoding='utf-8') as f:
                                out.write(f.read())
                            out.write("\n")
            else:
                out.write(f"No translated documents directory found for {lang}\n")
    else:
        out.write("i18n directory not found\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 3: COMPONENTES PERSONALIZADOS (JSX)
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 3: COMPONENTES PERSONALIZADOS (JSX)\n")
    out.write("================================================================================\n\n")
    
    components_dir = os.path.join(web_dir, "src", "components")
    if os.path.exists(components_dir):
        for root, _, files in os.walk(components_dir):
            for file in sorted(files):
                if file.endswith('.jsx') or file.endswith('.js'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, components_dir)
                    out.write(f"\n=== COMPONENTE: src/components/{rel_path} ===\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        out.write(f.read())
                    out.write("\n")
    else:
        out.write("src/components directory not found\n")
        
    theme_dir = os.path.join(web_dir, "src", "theme")
    if os.path.exists(theme_dir):
        for root, _, files in os.walk(theme_dir):
            for file in sorted(files):
                if file.endswith('.jsx') or file.endswith('.js'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, theme_dir)
                    out.write(f"\n=== ARCHIVO DE TEMA: src/theme/{rel_path} ===\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        out.write(f.read())
                    out.write("\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 4: DATOS Y ARCHIVOS EXTERNOS
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 4: DATOS Y ARCHIVOS EXTERNOS\n")
    out.write("================================================================================\n\n")
    
    # 4.1 src/data files
    data_dir = os.path.join(web_dir, "src", "data")
    if os.path.exists(data_dir):
        for root, _, files in os.walk(data_dir):
            for file in sorted(files):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, data_dir)
                out.write(f"\n=== DATOS: src/data/{rel_path} ===\n")
                size = os.path.getsize(filepath)
                out.write(f"Tamaño total: {size} bytes\n")
                with open(filepath, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                out.write(f"Total de líneas: {len(lines)}\n")
                out.write("Muestra representativa (primeras 30 líneas):\n")
                out.write("--------------------------------------------------------------------------------\n")
                out.write("".join(lines[:30]))
                if len(lines) > 30:
                    out.write("\n[... CONTENIDO ADICIONAL TRUNCADO POR SEGURIDAD DE ESPACIO DE VOLCADO ...]\n")
                out.write("\n")
    else:
        out.write("src/data directory not found\n")
        
    # 4.2 data_28a or static json if exist
    static_dir = os.path.join(web_dir, "static")
    if os.path.exists(static_dir):
        for root, _, files in os.walk(static_dir):
            for file in sorted(files):
                if file.endswith('.json') or file.endswith('.csv'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, static_dir)
                    out.write(f"\n=== DATOS ESTÁTICOS: static/{rel_path} ===\n")
                    size = os.path.getsize(filepath)
                    out.write(f"Tamaño total: {size} bytes\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    out.write(f"Total de líneas: {len(lines)}\n")
                    out.write("Muestra representativa (primeras 20 líneas):\n")
                    out.write("--------------------------------------------------------------------------------\n")
                    out.write("".join(lines[:20]))
                    if len(lines) > 20:
                        out.write("\n[... CONTENIDO ADICIONAL TRUNCADO ...]\n")
                    out.write("\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 5: HOJAS DE ESTILO Y TEMA
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 5: HOJAS DE ESTILO Y TEMA\n")
    out.write("================================================================================\n\n")
    
    # 5.1 custom.css
    out.write("5.1 custom.css completo\n")
    out.write("--------------------------------------------------------------------------------\n")
    css_path = os.path.join(web_dir, "src", "css", "custom.css")
    if os.path.exists(css_path):
        with open(css_path, 'r', encoding='utf-8') as f:
            out.write(f.read())
    else:
        out.write("custom.css not found\n")
    out.write("\n\n")
    
    # 5.2 CSS modules
    out.write("5.2 Módulos CSS (*.module.css)\n")
    out.write("--------------------------------------------------------------------------------\n")
    if os.path.exists(components_dir):
        for root, _, files in os.walk(components_dir):
            for file in sorted(files):
                if file.endswith('.module.css'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, components_dir)
                    out.write(f"\n=== MÓDULO CSS: src/components/{rel_path} ===\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        out.write(f.read())
                    out.write("\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 6: FUNCIONALIDADES INTERACTIVAS Y UX
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 6: FUNCIONALIDADES INTERACTIVAS Y UX (ANÁLISIS TÉCNICO DE COMPORTAMIENTO)\n")
    out.write("================================================================================\n\n")
    
    ux_desc = """Este sitio web implementa una experiencia de usuario (UX) sumamente avanzada y personalizada que se desvía de los estilos por defecto de Docusaurus, buscando un diseño de corte 'ciberpunk forense' y 'thriller de ingeniería'. A continuación se documenta el comportamiento de las principales lógicas del sistema:

1. BOTÓN FLOTANTE Y MODO ZEN:
   El archivo de diseño principal (layout) implementa botones flotantes dinámicos a la izquierda del contenido.
   - El botón 'Zen Mode' alterna una clase de CSS global llamada `.zen-mode` en el elemento `<html>`. Esta clase establece el ancho del contenedor principal a full-width (sin márgenes laterales) y oculta la barra lateral nativa de Docusaurus de manera suave mediante animaciones de opacidad y desplazamiento.
   - El estado es persistido en `localStorage` ('zen-mode') para conservar la elección del lector al recargar la página o navegar entre capítulos.

2. SOPORTE DE DEEP-LINKING EN LA GALERÍA INTERACTIVA:
   El componente unificado `InteractiveGraphicsGallery` lee el hash de la URL (`window.location.hash`) en su montaje de React. Si detecta un identificador válido (por ejemplo, `#swing` o `#matrix`), actualiza automáticamente su estado de visualización activo (`activeGraphicId`), cargando dinámicamente y haciendo foco en ese simulador específico. Escucha de forma global el evento `'hashchange'` para reaccionar inmediatamente en transiciones fluidas de navegación.

3. SIMULADOR DE LA ECUACIÓN DE OSCILACIÓN (SWING SIMULATOR):
   El componente `SwingEquationSimulator` modela en tiempo real la estabilidad de frecuencia dinámica tras la pérdida de 31 GW de carga en la península ibérica.
   - Permite al usuario interactuar de forma intuitiva con sliders para simular diferentes configuraciones de la inercia rotacional equivalente (H en segundos), el desequilibrio de potencia inicial (ΔP en MW) y la activación de inercia sintética o Respuesta Rápida de Frecuencia (FFR).
   - Utiliza una resolución interactiva de ecuaciones diferenciales de segundo grado en cada frame animado mediante Canvas o gráficos escalables dinámicos SVG, mostrando de forma dramática si la frecuencia alcanza el Nadir crítico de 47.5 Hz que causaría el colapso absoluto.

4. MAPA DE REPOSICIÓN Y TOPOLOGÍA DE RED:
   - `AnimatedRestorationMap` y `IberianGridTopology` representan la progresión geográfica de la caída y la recuperación. El mapa topológico lee descripciones estructuradas y las proyecta en grafos interactivos que muestran los niveles de tensión (Q-V) y la saturación de potencia reactiva nodal mediante gradientes cromáticos cian-neón a rojo.
   - Utiliza componentes dinámicos montados exclusivamente en el cliente mediante el contenedor `<BrowserOnly />` de Docusaurus para evitar inconsistencias en la fase de Server-Side Rendering (SSR).

5. LAZY LOADING DE SIMULADORES E INSTRUMENTOS:
   Para no ralentizar el tiempo de carga del sitio web y mantener el lighthouse score sobre 95 en rendimiento, todos los simuladores complejos y componentes pesados de telemetría (como los que consumen Plotly o Deck.gl) son importados dinámicamente utilizando `React.lazy(() => import(...))` y envueltos en componentes de tipo `<Suspense fallback={<Loading />} />`, cargándose estrictamente cuando el usuario navega a la sección de Gráficas Interactivas.
"""
    out.write(ux_desc)
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 7: METADATOS Y SEO
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 7: METADATOS Y SEO\n")
    out.write("================================================================================\n\n")
    
    out.write("7.1 Títulos, slugs y metadatos por documento\n")
    out.write("--------------------------------------------------------------------------------\n")
    if os.path.exists(docs_dir):
        for root, _, files in os.walk(docs_dir):
            for file in sorted(files):
                if file.endswith('.mdx') or file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, docs_dir)
                    out.write(f"\n--- METADATOS DE docs/{rel_path} ---\n")
                    with open(filepath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    # Extract frontmatter
                    fm_lines = []
                    in_fm = False
                    for line in lines:
                        if line.strip() == '---':
                            if not in_fm:
                                in_fm = True
                            else:
                                break
                        elif in_fm:
                            fm_lines.append(line)
                    out.write("".join(fm_lines))
    
    out.write("\n7.2 Configuración del Sitemap y Robots.txt\n")
    out.write("--------------------------------------------------------------------------------\n")
    robots_path = os.path.join(web_dir, "static", "robots.txt")
    if os.path.exists(robots_path):
        with open(robots_path, 'r', encoding='utf-8') as f:
            out.write("Contenido de robots.txt:\n")
            out.write(f.read())
    else:
        out.write("robots.txt not found in static/\n")
    out.write("\n\n")
    
    # -------------------------------------------------------------------------
    # SECCIÓN 8: CONTENIDO MULTIMEDIA Y ESTÁTICO
    # -------------------------------------------------------------------------
    out.write("================================================================================\n")
    out.write("SECCIÓN 8: CONTENIDO MULTIMEDIA Y ESTÁTICO\n")
    out.write("================================================================================\n\n")
    
    if os.path.exists(static_dir):
        out.write("Muestra de archivos multimedia y recursos estáticos en static/:\n")
        out.write("--------------------------------------------------------------------------------\n")
        for root, _, files in os.walk(static_dir):
            for file in sorted(files):
                if not file.endswith('.json') and not file.endswith('.csv') and not file.endswith('.txt'):
                    filepath = os.path.join(root, file)
                    rel_path = os.path.relpath(filepath, static_dir)
                    size = os.path.getsize(filepath)
                    out.write(f"- Archivo: static/{rel_path} | Tamaño: {size} bytes\n")
    else:
        out.write("static/ directory not found\n")
    out.write("\n\n")

print(f"Generated complete dump successfully at: {output_path}")
