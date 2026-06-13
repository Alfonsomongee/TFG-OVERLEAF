# Estado de Salud Técnica y Diagnóstico de Deuda — TFG Docusaurus/React

Este documento ofrece un diagnóstico objetivo de los riesgos técnicos, código duplicado, parches de enrutamiento y posibles inconsistencias presentes en la base de código para guiar al auditor externo.

## 1. Análisis de Enlaces y Anchors en la Homepage
Tras la última revisión y simplificación, se eliminaron los anchors internos y se sustituyeron los componentes `<Link>` de Docusaurus por la etiqueta nativa `<a>` de HTML para combatir el conflicto de restauración de scroll del navegador asíncrono y la regla CSS global `scroll-behavior: smooth`.
- **Enlaces con hashes remanentes detectados en los componentes de la homepage**:
  - Ninguno. Todos los hashes y anchors han sido completamente saneados en la homepage y sus subcomponentes.

## 2. Inconsistencias de i18n
- Faltan traducciones para múltiples archivos en alemán, inglés y chino (ver detalles en `AUDIT_I18N_CONTEXT.md`).
- Los datos de las gráficas de `forensicCharts_*.js` están duplicados por idioma completo (ej. `forensicCharts_de.js`, `forensicCharts_en.js`), en lugar de utilizar un sistema de claves de traducción, incrementando el bundle size de la app en ~720 KB de texto redundante.

## 3. Deuda Técnica y Buenas Prácticas
- **CSS Duplicado**: Muchos de los estilos visuales de los simuladores y componentes de mapas están declarados en sus correspondientes archivos `.module.css` de manera literal en lugar de heredar de variables globales de `custom.css`.
- **Backups y Archivos Huérfanos**:
  Existen ficheros `.bak` e índices viejos guardados en `static/` (como `chunks.json.bak` y `search-index.json.bak`) que consumen espacio del repositorio innecesariamente.
- **Scroll Hijack en CSS**:
  La presencia de `html { scroll-behavior: smooth; }` en `src/css/custom.css` (línea 2109) es la causa raíz de la incompatibilidad con la restauración automática del scroll en Docusaurus durante la navegación SPA.
