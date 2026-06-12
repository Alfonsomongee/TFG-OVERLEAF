# Auditoría de Limpieza del Repositorio (Versión Segura y Conservadora)

## 0. Resumen de Rama y Origen

- **Rama actual**: `limpieza-repositorio`
- **¿Nació desde main?**: Sí, la rama `limpieza-repositorio` apunta actualmente al mismo commit que `main` (`7ddf960a`).
- **¿Contiene cambios de redeseno-anexos?**: Sí, la rama `redeseno-anexos` ya está completamente mergeada en `main`. Por lo tanto, `limpieza-repositorio` ya hereda todo el trabajo del rediseño de anexos.
- **¿Conviene recrear la rama antes de limpiar?**: No es necesario, ya que `limpieza-repositorio` está perfectamente alineada con el `main` actualizado.

---

## 1. Clasificación Conservadora de Archivos

### Grupo A — Archivos trackeados por Git y claramente eliminables
*Solo se incluyen archivos trackeados en Git que no tienen ningún uso, referencia o importación en el proyecto de Docusaurus activo (`tfg-antigravity-docs/`).*

| Archivo | Motivo | Evidencia de no uso | Riesgo |
| --- | --- | --- | --- |
| [`anexo_cap2.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap2.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`anexo_cap3.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap3.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`anexo_cap4.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap4.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`anexo_cap5.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap5.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`anexo_cap6.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap6.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`anexo_cap7.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap7.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`prompts.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Prompts/prompts.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAMBIOS PROPUESTOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAMBIOS PROPUESTOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAMBIOSDEFINITIVOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAMBIOSDEFINITIVOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAP 08.5.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAP 08.5.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAP 08.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAP 08.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAP 6,7,7b.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAP 6,7,7b.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAP 9.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CAP 9.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`introduccion.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap1_Introduccion/introduccion.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`contexto_sector.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap2_Contexto/contexto_sector.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`sistema_espanol.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap3_Sistema_Espanol/sistema_espanol.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`reaccion_reposicion.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap4_Reaccion_Reposicion/reaccion_reposicion.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`analisis_informes.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap5_Analisis_Informes/analisis_informes.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`impacto_comunicativo.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap6_Impacto_Comunicativo/impacto_comunicativo.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`resiliencia_futuro.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap7_Resiliencia_Futuro/resiliencia_futuro.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`uso_ia.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap8_Uso_IA/uso_ia.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`conclusiones.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap9_Conclusiones/conclusiones.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CONTEXTO_CLAUDE.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CONTEXTO_CLAUDE.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CONTEXTO_MAESTRO_RAG.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CONTEXTO_MAESTRO_RAG.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CONTEXTO_Y_CODIGO_DASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CONTEXTO_Y_CODIGO_DASHBOARD.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CORRECIONES MDX CAP1-CAP5.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CORRECIONES MDX CAP1-CAP5.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/extractor.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extract_dashboard_code.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/extract_dashboard_code.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/temp_claude/extractor.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/extractor.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/extractor.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD_TEMP/dashboard_electrico/extractor.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`deduplicate_links.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/deduplicate_links.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`01-introduccion.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/01-introduccion.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`03-sistema-espanol.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/03-sistema-espanol.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`04-reaccion-reposicion.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/04-reaccion-reposicion.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`05-analisis-informes.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/05-analisis-informes.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`06-impacto-comunicativo.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/06-impacto-comunicativo.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`08-uso-ia.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/08-uso-ia.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`09-conclusiones.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/09-conclusiones.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`intro.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docs/intro.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`DOCUMENTO FINAL.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DOCUMENTO FINAL.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`dtsc-creafig.sty`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dtsc-creafig.sty) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`dump_script.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dump_script.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`edicionPFC.sty`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/edicionPFC.sty) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ESTRUCTURA_COMPLETA_WEB_TFG.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/ESTRUCTURA_COMPLETA_WEB_TFG.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ESTRUCTURA_JSONS_28A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/ESTRUCTURA_JSONS_28A.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extract_chapters.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/extract_chapters.py) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`extract_mdx.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/extract_mdx.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`deepseek_javascript_20260525_36d410.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/GALERIAFORENSE/raw/deepseek_javascript_20260525_36d410.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`TABLAS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/GALERIAFORENSE/TABLAS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GLOSARIO TECNICO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/GLOSARIO TECNICO.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`INVENTARIO_GRAFICAS_TABLAS_COMPONENTES.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/INVENTARIO_GRAFICAS_TABLAS_COMPONENTES.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`kbordermatrix.sty`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/kbordermatrix.sty) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`libroETSI.sty`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/libroETSI.sty) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`main.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/main.tex/main.tex) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`MEJORA IA.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/MEJORA IA.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`MEJORA WEB VISUAL.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/MEJORA WEB VISUAL.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`MEJORAS GRAFICOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/MEJORAS GRAFICOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`notacion.sty`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/notacion.sty) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ORGANIZACION WEB.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/ORGANIZACION WEB.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`PROYECTO DASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/PROYECTO DASHBOARD.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`PROYECTO MEJORA DOCUSAURUS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/PROYECTO MEJORA DOCUSAURUS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`replace_03.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/replace_03.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`replace_03_v2.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/replace_03_v2.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CAPITULO_RESUMEN_DE_CIFRAS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/RESUMEN/CAPITULO_RESUMEN_DE_CIFRAS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`S13.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/S13.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`optimize-images.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/scripts/optimize-images.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`search_files.ps1`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/search_files.ps1) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`SEMANA 3.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/SEMANA 3.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`SEMANA2.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/SEMANA2.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CINEIMPROVED.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/components/CineMode/CINEIMPROVED.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GalleryForensic.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/components/GalleryForensic/GalleryForensic.jsx) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GalleryForensic.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/components/GalleryForensic/GalleryForensic.module.css) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`28A_demand.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/28A_demand.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`28A_ics_violations.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/28A_ics_violations.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`28A_inertia.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/28A_inertia.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`28A_topology_manoeuvres.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/28A_topology_manoeuvres.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`28A_voltage_manoeuvres.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/28A_voltage_manoeuvres.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`gallery-index.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/src/data/processed/gallery-index.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`53.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/53.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`brattle_mapa_blackout.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/brattle_mapa_blackout.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`cabeceras.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/cabeceras.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`collage_conservador.jpg`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/collage_conservador.jpg) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`conclusiones_capacidad_tension.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/conclusiones_capacidad_tension.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`cronograma_fases_gobierno.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/cronograma_fases_gobierno.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`disparo_raiz_oscilografia.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/disparo_raiz_oscilografia.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`edificio01.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/edificio01.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`edificio02.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/edificio02.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`entsoe_carmona_colapso.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/entsoe_carmona_colapso.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`esios_emisiones_historico.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/esios_emisiones_historico.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`etsi.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/etsi.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`frecuencia_1203_oscilacion.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/frecuencia_1203_oscilacion.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`gfl_vs_gfm_circuit.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/gfl_vs_gfm_circuit.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ics_violations_iberia.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/ics_violations_iberia.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`imagenLibro.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/imagenLibro.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`image_98fd49.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/image_98fd49.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`logoETSI.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/logoETSI.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`LogoTSC.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/LogoTSC.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`LogoUS.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/LogoUS.pdf) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`mdpi_inertia_constants.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/mdpi_inertia_constants.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`miteco_volumetria_datos.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/miteco_volumetria_datos.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`mit_interconnection_levels.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/mit_interconnection_levels.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`mix_energetico_pniec.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/mix_energetico_pniec.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`nadir_frecuencia_2025.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/nadir_frecuencia_2025.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`oscilacion_hernani_icai.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/oscilacion_hernani_icai.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`pmu_locations_europe.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/pmu_locations_europe.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`pool_precio_historico_2007_2025_limpio.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/pool_precio_historico_2007_2025_limpio.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`portada_informe_csn.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/portada_informe_csn.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ree_emisiones_renovables_2024.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/ree_emisiones_renovables_2024.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`respuesta_inercia.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/respuesta_inercia.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`serPubETSIUS.gif`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/serPubETSIUS.gif) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`serPubETSIUS.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/serPubETSIUS.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`three_phase_syncronous.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/three_phase_syncronous.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ufls_steps.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/ufls_steps.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`validaciones_rcc_coreso.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/figuras/validaciones_rcc_coreso.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`iberia-dark.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/img/iberia-dark.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`iberia-light.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/img/iberia-light.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`logo.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/img/logo.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`logo.webp`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/img/logo.webp) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`logo.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/static/img/originals/logo.png) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`TABLAS POR CAPITULOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/TABLAS POR CAPITULOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`AJUSTES_ChartViewer_y_Componentes.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/AJUSTES_ChartViewer_y_Componentes.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ANALISIS_COMPLETO_ForensicGallery2.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/ANALISIS_COMPLETO_ForensicGallery2.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`COMPARATIVA_VISUAL_CSS_Grid.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/COMPARATIVA_VISUAL_CSS_Grid.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ForensicGallery2.module.css.FIXED`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/ForensicGallery2.module.css.FIXED) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GUIA_RAPIDA_IMPLEMENTACION.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/GUIA_RAPIDA_IMPLEMENTACION.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`RESUMEN_EJECUTIVO.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files/RESUMEN_EJECUTIVO.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`COMPARATIVA_CENTRADO_vs_FULLWIDTH.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files_5/COMPARATIVA_CENTRADO_vs_FULLWIDTH.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ForensicGallery2.module.css.FULLWIDTH`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files_5/ForensicGallery2.module.css.FULLWIDTH) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GUIA_FULLWIDTH_FORENSIC_GALLERY.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files_5/GUIA_FULLWIDTH_FORENSIC_GALLERY.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`RESUMEN_FINAL_QUE_HACER.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/temp_extracted_files_5/RESUMEN_FINAL_QUE_HACER.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`AUDITORIA_ARCHIVOS_OBSOLETOS_ESTRUCTURALES.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/AUDITORIA_ARCHIVOS_OBSOLETOS_ESTRUCTURALES.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`AUDITORIA_BUSCADOR_GLOSARIO_TOOLTIPS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/AUDITORIA_BUSCADOR_GLOSARIO_TOOLTIPS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`AUDITORIA_ESTRUCTURA_ANEXOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/AUDITORIA_ESTRUCTURA_ANEXOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CONFIGURACION_ESTRUCTURAL_DOCUSAURUS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/CONFIGURACION_ESTRUCTURAL_DOCUSAURUS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`INVENTARIO_CONCEPTUAL_ANEXOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/INVENTARIO_CONCEPTUAL_ANEXOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`INVENTARIO_CONCEPTUAL_ANEXOS_DETALLADO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/INVENTARIO_CONCEPTUAL_ANEXOS_DETALLADO.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`INVENTARIO_ELEMENTOS_NO_TEXTUALES_WEB.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/INVENTARIO_ELEMENTOS_NO_TEXTUALES_WEB.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`PAQUETE_ESTRUCTURAL_OPUS_README.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/PAQUETE_ESTRUCTURAL_OPUS_README.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`TABLAS POR CAPITULOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/TABLAS POR CAPITULOS.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`TFG_TEXTO_COMPLETO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/TFG_TEXTO_COMPLETO.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`tfg_antigravity.zip`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg_antigravity.zip) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`TFG_TEXTO_COMPLETO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/TFG_TEXTO_COMPLETO.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/audit-deps.mjs) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`CHECKLIST_APLICACION.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/CHECKLIST_APLICACION.md) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`custom.PATCH.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/custom.PATCH.css) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`docusaurus.config.PATCH.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/docusaurus.config.PATCH.js) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`GlossaryLink.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/GlossaryLink.module.css) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/ResumenEjecutivo.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`vercel.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/unzipped_files/vercel.json) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`volcado_completo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/volcado_completo.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`volcado_mdx_completo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/volcado_mdx_completo.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`VOLCADO_PROYECTO_COMPLETO_HOY.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/VOLCADO_PROYECTO_COMPLETO_HOY.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |
| [`xd2.0.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/xd2.0.txt) | Tracked temporary dump/script/tex/legacy in root | 0 references in active Docusaurus folder | Muy bajo (no referenciado en el sitio activo) |


---

### Grupo B — Archivos no trackeados que conviene borrar localmente
*Archivos locales que no están bajo control de versiones y solo ensucian el directorio de trabajo local.*

| Archivo | Ruta | Motivo |
| --- | --- | --- |
| `auditoria_figuras.md` | [`auditoria_figuras.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/auditoria_figuras.md) | Untracked local log/test output |
| `audit_figures.js` | [`audit_figures.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/audit_figures.js) | Untracked local log/test output |
| `build_out17.log` | [`build_out17.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/build_out17.log) | Untracked local log/test output |
| `dashboard.log` | [`DASHBOARD/dashboard.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/dashboard.log) | Untracked local log/test output |
| `nuevo código dahsboard.txt` | [`DASHBOARD/nuevo código dahsboard.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/nuevo código dahsboard.txt) | Untracked local log/test output |
| `dashboard.log` | [`dashboard_backup/dashboard.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/dashboard.log) | Untracked local log/test output |
| `🔧 1. ACTUALIZAR inercia_calculator.txt` | [`DASHBOARD_TEMP/2INTENTODASHBOARD/🔧 1. ACTUALIZAR inercia_calculator.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD_TEMP/2INTENTODASHBOARD/🔧 1. ACTUALIZAR inercia_calculator.txt) | Untracked local log/test output |
| `ROADMAP MAESTRO — TFG Apagón Ibér.txt` | [`ROADMAP MAESTRO — TFG Apagón Ibér.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/ROADMAP MAESTRO — TFG Apagón Ibér.txt) | Untracked local log/test output |
| `api-ree.txt` | [`tfg-antigravity-design-v2/api-ree.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/api-ree.txt) | Untracked local log/test output |
| `BOT2.0_CONSOLIDADO.txt` | [`tfg-antigravity-design-v2/BOT2.0/BOT2.0_CONSOLIDADO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/BOT2.0/BOT2.0_CONSOLIDADO.txt) | Untracked local log/test output |
| `BOT2.0.txt` | [`tfg-antigravity-design-v2/BOT2.0.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/BOT2.0.txt) | Untracked local log/test output |
| `CAMBIOS PROPUESTOS.txt` | [`tfg-antigravity-design-v2/CAMBIOS PROPUESTOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAMBIOS PROPUESTOS.txt) | Untracked local log/test output |
| `CAMBIOSDEFINITIVOS.txt` | [`tfg-antigravity-design-v2/CAMBIOSDEFINITIVOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAMBIOSDEFINITIVOS.txt) | Untracked local log/test output |
| `CAP 08.5.txt` | [`tfg-antigravity-design-v2/CAP 08.5.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAP 08.5.txt) | Untracked local log/test output |
| `CAP 08.txt` | [`tfg-antigravity-design-v2/CAP 08.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAP 08.txt) | Untracked local log/test output |
| `CAP 6,7,7b.txt` | [`tfg-antigravity-design-v2/CAP 6,7,7b.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAP 6,7,7b.txt) | Untracked local log/test output |
| `CAP 9.txt` | [`tfg-antigravity-design-v2/CAP 9.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CAP 9.txt) | Untracked local log/test output |
| `checks.txt` | [`tfg-antigravity-design-v2/checks.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/checks.txt) | Untracked local log/test output |
| `commit_exitoso.txt` | [`tfg-antigravity-design-v2/commit_exitoso.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/commit_exitoso.txt) | Untracked local log/test output |
| `CONTEXTO_CLAUDE.txt` | [`tfg-antigravity-design-v2/CONTEXTO_CLAUDE.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CONTEXTO_CLAUDE.txt) | Untracked local log/test output |
| `CONTEXTO_MAESTRO_RAG.txt` | [`tfg-antigravity-design-v2/CONTEXTO_MAESTRO_RAG.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CONTEXTO_MAESTRO_RAG.txt) | Untracked local log/test output |
| `CONTEXTO_Y_CODIGO_DASHBOARD.txt` | [`tfg-antigravity-design-v2/CONTEXTO_Y_CODIGO_DASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CONTEXTO_Y_CODIGO_DASHBOARD.txt) | Untracked local log/test output |
| `CORRECIONES MDX CAP1-CAP5.txt` | [`tfg-antigravity-design-v2/CORRECIONES MDX CAP1-CAP5.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/CORRECIONES MDX CAP1-CAP5.txt) | Untracked local log/test output |
| `ERROR DASHBOARD.txt` | [`tfg-antigravity-design-v2/DASHBOARD/ERROR DASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD/ERROR DASHBOARD.txt) | Untracked local log/test output |
| `ESTETICADASHBOARD.txt` | [`tfg-antigravity-design-v2/DASHBOARD/ESTETICADASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD/ESTETICADASHBOARD.txt) | Untracked local log/test output |
| `nuevo código dahsboard.txt` | [`tfg-antigravity-design-v2/DASHBOARD/nuevo código dahsboard.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD/nuevo código dahsboard.txt) | Untracked local log/test output |
| `requirements.txt` | [`tfg-antigravity-design-v2/DASHBOARD/requirements.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD/requirements.txt) | Untracked local log/test output |
| `requirements.txt` | [`tfg-antigravity-design-v2/DASHBOARD/temp_claude/requirements.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD/temp_claude/requirements.txt) | Untracked local log/test output |
| `requirements.txt` | [`tfg-antigravity-design-v2/dashboard_backup/requirements.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/dashboard_backup/requirements.txt) | Untracked local log/test output |
| `requirements.txt` | [`tfg-antigravity-design-v2/dashboard_backup/temp_claude/requirements.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/dashboard_backup/temp_claude/requirements.txt) | Untracked local log/test output |
| `🔧 1. ACTUALIZAR inercia_calculator.txt` | [`tfg-antigravity-design-v2/DASHBOARD_TEMP/2INTENTODASHBOARD/🔧 1. ACTUALIZAR inercia_calculator.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD_TEMP/2INTENTODASHBOARD/🔧 1. ACTUALIZAR inercia_calculator.txt) | Untracked local log/test output |
| `requirements.txt` | [`tfg-antigravity-design-v2/DASHBOARD_TEMP/dashboard_electrico/requirements.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DASHBOARD_TEMP/dashboard_electrico/requirements.txt) | Untracked local log/test output |
| `DATOS_FORENSES_28A.txt` | [`tfg-antigravity-design-v2/DATOS_FORENSES_28A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DATOS_FORENSES_28A.txt) | Untracked local log/test output |
| `deep_research_prompt.txt` | [`tfg-antigravity-design-v2/deep_research_prompt.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/deep_research_prompt.txt) | Untracked local log/test output |
| `DOCUMENTO FINAL.txt` | [`tfg-antigravity-design-v2/DOCUMENTO FINAL.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/DOCUMENTO FINAL.txt) | Untracked local log/test output |
| `esios.txt` | [`tfg-antigravity-design-v2/esios.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/esios.txt) | Untracked local log/test output |
| `ESTRUCTURA_COMPLETA_WEB_TFG.txt` | [`tfg-antigravity-design-v2/ESTRUCTURA_COMPLETA_WEB_TFG.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/ESTRUCTURA_COMPLETA_WEB_TFG.txt) | Untracked local log/test output |
| `ESTRUCTURA_JSONS_28A.txt` | [`tfg-antigravity-design-v2/ESTRUCTURA_JSONS_28A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/ESTRUCTURA_JSONS_28A.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/files_extracted/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted/audit-deps.mjs) | Untracked local log/test output |
| `ResumenEjecutivo.txt` | [`tfg-antigravity-design-v2/files_extracted/ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted/ResumenEjecutivo.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/files_extracted_batch_A/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_A/audit-deps.mjs) | Untracked local log/test output |
| `IMPLEMENTACION BATCH A.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_A/IMPLEMENTACION BATCH A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_A/IMPLEMENTACION BATCH A.txt) | Untracked local log/test output |
| `ResumenEjecutivo.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_A/ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_A/ResumenEjecutivo.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/files_extracted_batch_B/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_B/audit-deps.mjs) | Untracked local log/test output |
| `IMPLEMENTACION BATCH A.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_B/IMPLEMENTACION BATCH A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_B/IMPLEMENTACION BATCH A.txt) | Untracked local log/test output |
| `IMPLEMENTACION BATCH B.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_B/IMPLEMENTACION BATCH B.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_B/IMPLEMENTACION BATCH B.txt) | Untracked local log/test output |
| `ResumenEjecutivo.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_B/ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_B/ResumenEjecutivo.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/files_extracted_batch_C/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_C/audit-deps.mjs) | Untracked local log/test output |
| `IMPLEMENTACION BATCH A.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH A.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH A.txt) | Untracked local log/test output |
| `IMPLEMENTACION BATCH B.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH B.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH B.txt) | Untracked local log/test output |
| `IMPLEMENTACION BATCH C.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH C.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_C/IMPLEMENTACION BATCH C.txt) | Untracked local log/test output |
| `ResumenEjecutivo.txt` | [`tfg-antigravity-design-v2/files_extracted_batch_C/ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/files_extracted_batch_C/ResumenEjecutivo.txt) | Untracked local log/test output |
| `CHECKLIST_IMPLEMENTACION.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/components/CHECKLIST_IMPLEMENTACION.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/components/CHECKLIST_IMPLEMENTACION.txt) | Untracked local log/test output |
| `ENTREGA_FINAL.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/components/ENTREGA_FINAL.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/components/ENTREGA_FINAL.txt) | Untracked local log/test output |
| `DESCRIPCION GRAFICAS.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/DESCRIPCION GRAFICAS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/DESCRIPCION GRAFICAS.txt) | Untracked local log/test output |
| `DESCRIPCIONGRAPHICS.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/DESCRIPCIONGRAPHICS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/DESCRIPCIONGRAPHICS.txt) | Untracked local log/test output |
| `GRAFICAS EXTRA.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/GRAFICAS EXTRA.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/GRAFICAS EXTRA.txt) | Untracked local log/test output |
| `GUIA_INTEGRACION.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/GUIA_INTEGRACION.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/GUIA_INTEGRACION.txt) | Untracked local log/test output |
| `lista_todas_graficas.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/lista_todas_graficas.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/lista_todas_graficas.txt) | Untracked local log/test output |
| `raw_f_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_f_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_f_section.txt) | Untracked local log/test output |
| `raw_g_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_g_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_g_section.txt) | Untracked local log/test output |
| `raw_j_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_j_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_j_section.txt) | Untracked local log/test output |
| `raw_m_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_m_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_m_section.txt) | Untracked local log/test output |
| `raw_n_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_n_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_n_section.txt) | Untracked local log/test output |
| `raw_o_prices_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_o_prices_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_o_prices_section.txt) | Untracked local log/test output |
| `raw_o_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_o_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_o_section.txt) | Untracked local log/test output |
| `raw_p_section.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/raw_p_section.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/raw_p_section.txt) | Untracked local log/test output |
| `README.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/README.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/README.txt) | Untracked local log/test output |
| `resumen_todas_las_graficas.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/resumen_todas_las_graficas.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/resumen_todas_las_graficas.txt) | Untracked local log/test output |
| `TABLAS.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/TABLAS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/TABLAS.txt) | Untracked local log/test output |
| `TLDR.txt` | [`tfg-antigravity-design-v2/GALERIAFORENSE/TLDR.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GALERIAFORENSE/TLDR.txt) | Untracked local log/test output |
| `GLOSARIO TECNICO.txt` | [`tfg-antigravity-design-v2/GLOSARIO TECNICO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/GLOSARIO TECNICO.txt) | Untracked local log/test output |
| `INDICE_DOCUMENTACION_CLAUDE.txt` | [`tfg-antigravity-design-v2/INDICE_DOCUMENTACION_CLAUDE.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/INDICE_DOCUMENTACION_CLAUDE.txt) | Untracked local log/test output |
| `informe_revision.txt` | [`tfg-antigravity-design-v2/informe_revision.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/informe_revision.txt) | Untracked local log/test output |
| `lighthouse-final.json` | [`tfg-antigravity-design-v2/lighthouse-final.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/lighthouse-final.json) | Untracked local log/test output |
| `lighthouse-report-sprint13-final.json` | [`tfg-antigravity-design-v2/lighthouse-report-sprint13-final.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/lighthouse-report-sprint13-final.json) | Untracked local log/test output |
| `lighthouse-report-sprint13.json` | [`tfg-antigravity-design-v2/lighthouse-report-sprint13.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/lighthouse-report-sprint13.json) | Untracked local log/test output |
| `lighthouse-report.json` | [`tfg-antigravity-design-v2/lighthouse-report.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/lighthouse-report.json) | Untracked local log/test output |
| `MEJORA IA.txt` | [`tfg-antigravity-design-v2/MEJORA IA.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/MEJORA IA.txt) | Untracked local log/test output |
| `MEJORA WEB VISUAL.txt` | [`tfg-antigravity-design-v2/MEJORA WEB VISUAL.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/MEJORA WEB VISUAL.txt) | Untracked local log/test output |
| `MEJORAS GRAFICOS.txt` | [`tfg-antigravity-design-v2/MEJORAS GRAFICOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/MEJORAS GRAFICOS.txt) | Untracked local log/test output |
| `modes.txt` | [`tfg-antigravity-design-v2/modes.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/modes.txt) | Untracked local log/test output |
| `MODO CINE.txt` | [`tfg-antigravity-design-v2/MODOCINE2.0/MODO CINE.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/MODOCINE2.0/MODO CINE.txt) | Untracked local log/test output |
| `README.txt` | [`tfg-antigravity-design-v2/MODOCINE2.0/README.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/MODOCINE2.0/README.txt) | Untracked local log/test output |
| `ORGANIZACION WEB.txt` | [`tfg-antigravity-design-v2/ORGANIZACION WEB.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/ORGANIZACION WEB.txt) | Untracked local log/test output |
| `portada.txt` | [`tfg-antigravity-design-v2/portada.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/portada.txt) | Untracked local log/test output |
| `PROYECTO DASHBOARD.txt` | [`tfg-antigravity-design-v2/PROYECTO DASHBOARD.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/PROYECTO DASHBOARD.txt) | Untracked local log/test output |
| `PROYECTO MEJORA DOCUSAURUS.txt` | [`tfg-antigravity-design-v2/PROYECTO MEJORA DOCUSAURUS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/PROYECTO MEJORA DOCUSAURUS.txt) | Untracked local log/test output |
| `ree.txt` | [`tfg-antigravity-design-v2/ree.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/ree.txt) | Untracked local log/test output |
| `registro_mejoras_implementadas.txt` | [`tfg-antigravity-design-v2/registro_mejoras_implementadas.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/registro_mejoras_implementadas.txt) | Untracked local log/test output |
| `reorganizaciongalerias.txt` | [`tfg-antigravity-design-v2/reorganizaciongalerias.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/reorganizaciongalerias.txt) | Untracked local log/test output |
| `reporteclaude.txt` | [`tfg-antigravity-design-v2/reporteclaude.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/reporteclaude.txt) | Untracked local log/test output |
| `CAPITULO_RESUMEN_DE_CIFRAS.txt` | [`tfg-antigravity-design-v2/RESUMEN/CAPITULO_RESUMEN_DE_CIFRAS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/RESUMEN/CAPITULO_RESUMEN_DE_CIFRAS.txt) | Untracked local log/test output |
| `ROADMAP MAESTRO — TFG Apagón Ibér.txt` | [`tfg-antigravity-design-v2/ROADMAP MAESTRO — TFG Apagón Ibér.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/ROADMAP MAESTRO — TFG Apagón Ibér.txt) | Untracked local log/test output |
| `run_queries_output.txt` | [`tfg-antigravity-design-v2/run_queries_output.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/run_queries_output.txt) | Untracked local log/test output |
| `S13.txt` | [`tfg-antigravity-design-v2/S13.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/S13.txt) | Untracked local log/test output |
| `SEMANA 3.txt` | [`tfg-antigravity-design-v2/SEMANA 3.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/SEMANA 3.txt) | Untracked local log/test output |
| `SEMANA2.txt` | [`tfg-antigravity-design-v2/SEMANA2.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/SEMANA2.txt) | Untracked local log/test output |
| `CINEIMPROVED.txt` | [`tfg-antigravity-design-v2/src/components/CineMode/CINEIMPROVED.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/src/components/CineMode/CINEIMPROVED.txt) | Untracked local log/test output |
| `TABLAS POR CAPITULOS.txt` | [`tfg-antigravity-design-v2/TABLAS POR CAPITULOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/TABLAS POR CAPITULOS.txt) | Untracked local log/test output |
| `all_ctas.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/all_ctas.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/all_ctas.txt) | Untracked local log/test output |
| `annex_d_list.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/annex_d_list.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/annex_d_list.txt) | Untracked local log/test output |
| `audit-colores.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/audit-colores.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/audit-colores.txt) | Untracked local log/test output |
| `audit_output.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/audit_output.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/audit_output.txt) | Untracked local log/test output |
| `build-log.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/build-log.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/build-log.txt) | Untracked local log/test output |
| `dump_anexos1.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/dump_anexos1.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/dump_anexos1.txt) | Untracked local log/test output |
| `dump_anexos2.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/dump_anexos2.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/dump_anexos2.txt) | Untracked local log/test output |
| `forensic_charts_list.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/forensic_charts_list.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/forensic_charts_list.txt) | Untracked local log/test output |
| `raw_terms_defs.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/raw_terms_defs.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/raw_terms_defs.txt) | Untracked local log/test output |
| `registro_mejoras_implementadas.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/registro_mejoras_implementadas.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/registro_mejoras_implementadas.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/scripts/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/scripts/audit-deps.mjs) | Untracked local log/test output |
| `Colapsodefrecuencia.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/src/components/FrequencyTimeline/Colapsodefrecuencia.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/src/components/FrequencyTimeline/Colapsodefrecuencia.txt) | Untracked local log/test output |
| `resumen_graficas_claude.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/static/data/esios/resumen_graficas_claude.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/static/data/esios/resumen_graficas_claude.txt) | Untracked local log/test output |
| `TABLAS POR CAPITULOS.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/TABLAS POR CAPITULOS.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/TABLAS POR CAPITULOS.txt) | Untracked local log/test output |
| `TFG_COMPLETO.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/TFG_COMPLETO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/TFG_COMPLETO.txt) | Untracked local log/test output |
| `TFG_TEXTO_COMPLETO.txt` | [`tfg-antigravity-design-v2/tfg-antigravity-docs/TFG_TEXTO_COMPLETO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/TFG_TEXTO_COMPLETO.txt) | Untracked local log/test output |
| `TFG_TEXTO_COMPLETO.txt` | [`tfg-antigravity-design-v2/TFG_TEXTO_COMPLETO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/TFG_TEXTO_COMPLETO.txt) | Untracked local log/test output |
| `README.txt` | [`tfg-antigravity-design-v2/tokens/README.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tokens/README.txt) | Untracked local log/test output |
| `SISMOGRAFO.txt` | [`tfg-antigravity-design-v2/tokens/sismografofrecuencia/SISMOGRAFO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tokens/sismografofrecuencia/SISMOGRAFO.txt) | Untracked local log/test output |
| `tokens.txt` | [`tfg-antigravity-design-v2/tokens/tokens.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tokens/tokens.txt) | Untracked local log/test output |
| `audit-deps.mjs` | [`tfg-antigravity-design-v2/unzipped_files/audit-deps.mjs`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/unzipped_files/audit-deps.mjs) | Untracked local log/test output |
| `ResumenEjecutivo.txt` | [`tfg-antigravity-design-v2/unzipped_files/ResumenEjecutivo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/unzipped_files/ResumenEjecutivo.txt) | Untracked local log/test output |
| `volcado_auditoria_graficas.md` | [`tfg-antigravity-design-v2/volcado_auditoria_graficas.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/volcado_auditoria_graficas.md) | Untracked local log/test output |
| `volcado_completo.txt` | [`tfg-antigravity-design-v2/volcado_completo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/volcado_completo.txt) | Untracked local log/test output |
| `volcado_mdx_completo.txt` | [`tfg-antigravity-design-v2/volcado_mdx_completo.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/volcado_mdx_completo.txt) | Untracked local log/test output |
| `VOLCADO_PROYECTO_COMPLETO_HOY.txt` | [`tfg-antigravity-design-v2/VOLCADO_PROYECTO_COMPLETO_HOY.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/VOLCADO_PROYECTO_COMPLETO_HOY.txt) | Untracked local log/test output |
| `xd2.0.txt` | [`tfg-antigravity-design-v2/xd2.0.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/xd2.0.txt) | Untracked local log/test output |
| `build_out.log` | [`tfg-antigravity-docs/build_out.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out.log) | Untracked local log/test output |
| `build_out10.log` | [`tfg-antigravity-docs/build_out10.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out10.log) | Untracked local log/test output |
| `build_out11.log` | [`tfg-antigravity-docs/build_out11.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out11.log) | Untracked local log/test output |
| `build_out12.log` | [`tfg-antigravity-docs/build_out12.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out12.log) | Untracked local log/test output |
| `build_out13.log` | [`tfg-antigravity-docs/build_out13.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out13.log) | Untracked local log/test output |
| `build_out14.log` | [`tfg-antigravity-docs/build_out14.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out14.log) | Untracked local log/test output |
| `build_out15.log` | [`tfg-antigravity-docs/build_out15.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out15.log) | Untracked local log/test output |
| `build_out16.log` | [`tfg-antigravity-docs/build_out16.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out16.log) | Untracked local log/test output |
| `build_out18.log` | [`tfg-antigravity-docs/build_out18.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out18.log) | Untracked local log/test output |
| `build_out19.log` | [`tfg-antigravity-docs/build_out19.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out19.log) | Untracked local log/test output |
| `build_out2.log` | [`tfg-antigravity-docs/build_out2.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out2.log) | Untracked local log/test output |
| `build_out20.log` | [`tfg-antigravity-docs/build_out20.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out20.log) | Untracked local log/test output |
| `build_out3.log` | [`tfg-antigravity-docs/build_out3.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out3.log) | Untracked local log/test output |
| `build_out4.log` | [`tfg-antigravity-docs/build_out4.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out4.log) | Untracked local log/test output |
| `build_out5.log` | [`tfg-antigravity-docs/build_out5.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out5.log) | Untracked local log/test output |
| `build_out6.log` | [`tfg-antigravity-docs/build_out6.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out6.log) | Untracked local log/test output |
| `build_out7.log` | [`tfg-antigravity-docs/build_out7.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out7.log) | Untracked local log/test output |
| `build_out8.log` | [`tfg-antigravity-docs/build_out8.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out8.log) | Untracked local log/test output |
| `build_out9.log` | [`tfg-antigravity-docs/build_out9.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_out9.log) | Untracked local log/test output |
| `build_test.log` | [`tfg-antigravity-docs/build_test.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/build_test.log) | Untracked local log/test output |
| `deploy.log` | [`tfg-antigravity-docs/deploy.log`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/deploy.log) | Untracked local log/test output |
| `volcado_analisis_bm25.txt` | [`volcado_analisis_bm25.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/volcado_analisis_bm25.txt) | Untracked local log/test output |
| `VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt` | [`VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/VOLCADO_COMPLETO_ANEXOS_FIGURAS_TABLAS_SERIES.txt) | Untracked local log/test output |


---

### Grupo C — Archivos que parecen temporales pero NO borrar aún
*Archivos que podrían parecer temporales pero se conservan por precaución o valor de referencia académica.*

| Archivo | Ruta | Trackeado | Referencias en active code |
| --- | --- | --- | --- |
| `.vercelignore` | [`.vercelignore`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/.vercelignore) | Sí | No |
| `95103.pdf` | [`95103.pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/95103.pdf) | Sí | Sí (1 refs) |
| `chat.js` | [`api/chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/chat.js) | Sí | Sí (8 refs) |
| `chat.js.bak` | [`api/chat.js.bak`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/chat.js.bak) | No | No |
| `figure-context.js` | [`api/figure-context.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/figure-context.js) | Sí | Sí (1 refs) |
| `api-ree.txt` | [`api-ree.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api-ree.txt) | Sí | No |
| `AUDITORIA_LIMPIEZA_REPOSITORIO.md` | [`AUDITORIA_LIMPIEZA_REPOSITORIO.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/AUDITORIA_LIMPIEZA_REPOSITORIO.md) | No | No |
| `babel.config.js` | [`babel.config.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/babel.config.js) | Sí | No |
| `LateralBar.jsx` | [`BARRA LATERAL/LateralBar.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/LateralBar.jsx) | Sí | No |
| `README.md` | [`BARRA LATERAL/README.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/README.md) | Sí | No |
| `sidebar.css` | [`BARRA LATERAL/sidebar.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/sidebar.css) | Sí | No |
| `SidebarCategory.jsx` | [`BARRA LATERAL/SidebarCategory.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/SidebarCategory.jsx) | Sí | No |
| `SidebarIcons.jsx` | [`BARRA LATERAL/SidebarIcons.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/SidebarIcons.jsx) | Sí | No |
| `bibliografiaLibroETSI.bib` | [`bibliografiaLibroETSI.bib`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/bibliografiaLibroETSI.bib) | Sí | No |
| `BOT2.0_CONSOLIDADO.txt` | [`BOT2.0/BOT2.0_CONSOLIDADO.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/BOT2.0_CONSOLIDADO.txt) | Sí | No |
| `chat.js` | [`BOT2.0/chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/chat.js) | Sí | Sí (8 refs) |
| `ChatFullscreen.jsx` | [`BOT2.0/ChatFullscreen.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/ChatFullscreen.jsx) | Sí | Sí (2 refs) |
| `ChatWidget.jsx` | [`BOT2.0/ChatWidget.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/ChatWidget.jsx) | Sí | Sí (3 refs) |
| `figure-context.js` | [`BOT2.0/figure-context.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/figure-context.js) | Sí | Sí (1 refs) |
| `BOT2.0.txt` | [`BOT2.0.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0.txt) | Sí | No |
| `build_glossary.py` | [`build_glossary.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/build_glossary.py) | Sí | No |
| `chatbot.boton.jpg` | [`chatbot.boton.jpg`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/chatbot.boton.jpg) | Sí | No |
| `checks.txt` | [`checks.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/checks.txt) | Sí | No |
| `commit_exitoso.txt` | [`commit_exitoso.txt`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/commit_exitoso.txt) | Sí | No |
| `Compass Lexecon - INESC TEC (1).pdf` | [`Compass Lexecon - INESC TEC (1).pdf`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Compass Lexecon - INESC TEC (1).pdf) | Sí | Sí (1 refs) |
| `CONTEXTO_COMPONENTES_INTERACTIVOS.md` | [`CONTEXTO_COMPONENTES_INTERACTIVOS.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/CONTEXTO_COMPONENTES_INTERACTIVOS.md) | Sí | No |
| `coordination_log.md` | [`coordination_log.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/coordination_log.md) | Sí | No |
| `.env` | [`DASHBOARD/.env`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/.env) | Sí | Sí (3 refs) |
| `config.toml` | [`DASHBOARD/.streamlit/config.toml`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/.streamlit/config.toml) | Sí | No |
| `alertas.py` | [`DASHBOARD/alertas.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/alertas.py) | Sí | No |


---

### Grupo D — Archivos que deben conservarse aunque parezcan generados
*Archivos esenciales para el chatbot, el buscador, la configuración y el funcionamiento general.*

| Archivo | Ruta/Descripción | Uso principal |
| --- | --- | --- |
| `.gitignore` | [`tfg-antigravity-docs/.gitignore`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/.gitignore) | Core active structure / referenced asset |
| `chat.js` | [`tfg-antigravity-docs/api/chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/chat.js) | Core active structure / referenced asset |
| `01-introduccion.mdx` | [`tfg-antigravity-docs/docs/01-introduccion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/01-introduccion.mdx) | Core active structure / referenced asset |
| `02-contexto.mdx` | [`tfg-antigravity-docs/docs/02-contexto.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/02-contexto.mdx) | Core active structure / referenced asset |
| `03-analisis-incidente.mdx` | [`tfg-antigravity-docs/docs/03-analisis-incidente.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/03-analisis-incidente.mdx) | Core active structure / referenced asset |
| `04-reaccion-reposicion.mdx` | [`tfg-antigravity-docs/docs/04-reaccion-reposicion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/04-reaccion-reposicion.mdx) | Core active structure / referenced asset |
| `05-analisis-informes.mdx` | [`tfg-antigravity-docs/docs/05-analisis-informes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/05-analisis-informes.mdx) | Core active structure / referenced asset |
| `06-impacto-comunicativo.mdx` | [`tfg-antigravity-docs/docs/06-impacto-comunicativo.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/06-impacto-comunicativo.mdx) | Core active structure / referenced asset |
| `07-resiliencia-futuro.mdx` | [`tfg-antigravity-docs/docs/07-resiliencia-futuro.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07-resiliencia-futuro.mdx) | Core active structure / referenced asset |
| `07b-consecuencias-financieras.mdx` | [`tfg-antigravity-docs/docs/07b-consecuencias-financieras.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07b-consecuencias-financieras.mdx) | Core active structure / referenced asset |
| `08-uso-ia.mdx` | [`tfg-antigravity-docs/docs/08-uso-ia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08-uso-ia.mdx) | Core active structure / referenced asset |
| `08.5-actualizacion-2026.mdx` | [`tfg-antigravity-docs/docs/08.5-actualizacion-2026.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08.5-actualizacion-2026.mdx) | Core active structure / referenced asset |
| `09-conclusiones.mdx` | [`tfg-antigravity-docs/docs/09-conclusiones.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/09-conclusiones.mdx) | Core active structure / referenced asset |
| `10-resumen-de-cifras.mdx` | [`tfg-antigravity-docs/docs/10-resumen-de-cifras.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/10-resumen-de-cifras.mdx) | Core active structure / referenced asset |
| `11-cronologia.mdx` | [`tfg-antigravity-docs/docs/11-cronologia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/11-cronologia.mdx) | Core active structure / referenced asset |
| `13-sobre-el-autor.mdx` | [`tfg-antigravity-docs/docs/13-sobre-el-autor.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/13-sobre-el-autor.mdx) | Core active structure / referenced asset |
| `anexo-cascada-protecciones-desconexiones.mdx` | [`tfg-antigravity-docs/docs/anexo-cascada-protecciones-desconexiones.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-cascada-protecciones-desconexiones.mdx) | Core active structure / referenced asset |
| `anexo-comunicacion-fuentes.mdx` | [`tfg-antigravity-docs/docs/anexo-comunicacion-fuentes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-comunicacion-fuentes.mdx) | Core active structure / referenced asset |
| `anexo-demanda-generacion-balance.mdx` | [`tfg-antigravity-docs/docs/anexo-demanda-generacion-balance.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-demanda-generacion-balance.mdx) | Core active structure / referenced asset |
| `anexo-ecuaciones-matematicas.mdx` | [`tfg-antigravity-docs/docs/anexo-ecuaciones-matematicas.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-ecuaciones-matematicas.mdx) | Core active structure / referenced asset |
| `anexo-estabilidad-dinamica-tension.mdx` | [`tfg-antigravity-docs/docs/anexo-estabilidad-dinamica-tension.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-estabilidad-dinamica-tension.mdx) | Core active structure / referenced asset |
| `anexo-impacto-resiliencia.mdx` | [`tfg-antigravity-docs/docs/anexo-impacto-resiliencia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-impacto-resiliencia.mdx) | Core active structure / referenced asset |
| `anexo-indice-conceptual.mdx` | [`tfg-antigravity-docs/docs/anexo-indice-conceptual.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-indice-conceptual.mdx) | Core active structure / referenced asset |
| `anexo-interconexiones-flujos.mdx` | [`tfg-antigravity-docs/docs/anexo-interconexiones-flujos.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-interconexiones-flujos.mdx) | Core active structure / referenced asset |
| `anexo-mercado-costes.mdx` | [`tfg-antigravity-docs/docs/anexo-mercado-costes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-mercado-costes.mdx) | Core active structure / referenced asset |
| `anexo-metodologia-modelos-datos-vivos.mdx` | [`tfg-antigravity-docs/docs/anexo-metodologia-modelos-datos-vivos.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-metodologia-modelos-datos-vivos.mdx) | Core active structure / referenced asset |
| `anexo-reposicion-blackstart.mdx` | [`tfg-antigravity-docs/docs/anexo-reposicion-blackstart.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-reposicion-blackstart.mdx) | Core active structure / referenced asset |
| `balance-intercambios.mdx` | [`tfg-antigravity-docs/docs/datos-tiempo-real/balance-intercambios.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/datos-tiempo-real/balance-intercambios.mdx) | Core active structure / referenced asset |
| `demanda-renovable.mdx` | [`tfg-antigravity-docs/docs/datos-tiempo-real/demanda-renovable.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/datos-tiempo-real/demanda-renovable.mdx) | Core active structure / referenced asset |
| `index.mdx` | [`tfg-antigravity-docs/docs/datos-tiempo-real/index.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/datos-tiempo-real/index.mdx) | Core active structure / referenced asset |


---

### Grupo E — Patrones candidatos a .gitignore
*Patrones específicos para evitar subir archivos temporales de editores, logs de compilación locales o diagnósticos sin ocultar código real.*

| Patrón | Motivo |
| --- | --- |
| `*.bak` | Evitar subir copias de seguridad de editores de texto |
| `tfg-antigravity-docs/build_out*.log` | Logs de depuración de compilación locales |
| `tfg-antigravity-docs/stress-test-report.txt` | Reporte de pruebas locales de carga |
| `tfg-antigravity-docs/test-report.txt` | Reporte de tests locales |
| `tfg-antigravity-docs/chatbot-*-results.txt` | Resultados de pruebas de chatbot local |

---

## 2. Comandos Sugeridos (NO EJECUTAR TODAVÍA)

### Limpieza de archivos del Grupo A (Trackeados)
```bash
# Ejecutar desde la raíz del repositorio
git rm -f *.txt
git rm -rf unzipped_files/
git rm -rf temp_extracted_files/
git rm -rf temp_extracted_files_5/
git rm -rf Cap1_Introduccion/
git rm -rf Cap2_Contexto/
git rm -rf Cap3_Sistema_Espanol/
git rm -rf Cap4_Reaccion_Reposicion/
git rm -rf Cap5_Analisis_Informes/
git rm -rf Cap6_Impacto_Comunicativo/
git rm -rf Cap7_Resiliencia_Futuro/
git rm -rf Cap8_Uso_IA/
git rm -rf Cap9_Conclusiones/
git rm -rf Anexos_Conceptos/
git rm -rf Anexos_Prompts/
git rm -rf BARRA\ LATERAL/
git rm -rf BOT2.0/
git rm -rf DASHBOARD/
git rm -rf DASHBOARD_TEMP/
git rm -rf ENTSO/
git rm -rf GALERIAFORENSE/
git rm -rf INFORMES/
git rm -rf MODOCINE2.0/
git rm -rf RESUMEN/
git rm -rf S13-2.0/
git rm -rf tfg_antigravity/
git rm -rf tokens/
git rm -f *.js
git rm -f *.py
git rm -f *.ps1
git rm -f *.pdf
git rm -f *.zip
git rm -f *.rar
git rm -f *.md
# Excluir de la eliminación los archivos de configuración de git y de vercel en la raíz
git checkout HEAD -- .gitignore .vercelignore README.md
```

### Limpieza de archivos locales no trackeados (Grupo B)
```bash
# Eliminar manualmente logs locales
rm -f tfg-antigravity-docs/build_out*.log
rm -f tfg-antigravity-docs/stress-test-report.txt
rm -f tfg-antigravity-docs/test-report.txt
rm -f tfg-antigravity-docs/test-results.json
```

---

## 3. Recomendación Final

1. **Recomendación**: Limpiar en esta rama (`limpieza-repositorio`).
2. **Justificación**: La rama está perfectamente sincronizada con `main` y contiene todos los cambios del rediseño de anexos.
3. **Paso siguiente**: Una vez aprobada esta auditoría, ejecutar los comandos del Grupo A en la rama `limpieza-repositorio`, validar el build mediante `npm run build` dentro de `tfg-antigravity-docs/`, y hacer el commit de limpieza.
