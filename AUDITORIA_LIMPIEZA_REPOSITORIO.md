# Auditoría de limpieza del repositorio

## 0. Resumen ejecutivo

- **Estado general del repositorio**: El repositorio contiene la estructura estándar de un proyecto Docusaurus (`tfg-antigravity-docs/`) rodeado de numerosos archivos de trabajo, volcados de texto del TFG en formato `.txt`, copias de seguridad de capítulos, PDF de informes oficiales de referencia, scripts de automatización de traducciones y carpetas temporales de extracción.
- **Riesgo principal**: Borrar archivos de configuración del chatbot (`api/chat.js`, `static/search-index.json`, `static/chunks.json`) o componentes registrados en `MDXComponents.js` que son invocados dinámicamente en archivos MDX.
- **Archivos claramente temporales**: Todos los volcados `.txt` de capítulos y anexos en la raíz, carpetas de descompresión como `unzipped_files`, y copias de seguridad como `tfg-antigravity-docs/homepage-completa.md`.
- **Archivos peligrosos de borrar**: Archivos del chatbot (`api/chat.js`, `static/search-index.json`), el PDF del libro final del TFG (`tfg-antigravity-docs/static/tfg_antigravity(1).pdf`) y PDF de anexos referenciados desde la navbar.
- **Recomendación general**: Mantener la carpeta `tfg-antigravity-docs/` como el núcleo del repositorio, limpiando de ella los scripts auxiliares de traducción y auditoría (mover a una carpeta interna `tools/`), y eliminar todos los directorios y archivos basura en la raíz del repositorio de Git.
- **Nivel de seguridad de la limpieza**: **ALTO**. Todos los componentes esenciales e indispensables han sido cruzados y referenciados para asegurar que la web compila perfectamente.

## 1. Archivos esenciales para producción

| Archivo/carpeta | Motivo | Evidencia de uso |
| --- | --- | --- |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/chat.js) | Endpoint del chatbot | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`chat.js.bak`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/chat.js.bak) | Endpoint del chatbot | Configuración estructural del framework |
| [`figure-context.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/api/figure-context.js) | Endpoint del chatbot | Importado por src/components/ChatFullscreen.jsx |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/chat.js) | Componente React esencial | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/api/chat.js) | Endpoint del chatbot | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/BOT2.0/chat.js) | Componente React esencial | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/api/chat.js) | Documento MDX de contenido | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`build-index.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/scripts/build-index.js) | Documento MDX de contenido | Configuración estructural del framework |
| [`chunks.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/static/chunks.json) | Documento MDX de contenido | Configuración estructural del framework |
| [`search-index.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-design-v2/tfg-antigravity-docs/static/search-index.json) | Documento MDX de contenido | Configuración estructural del framework |
| [`chat.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/chat.js) | Documento MDX de contenido | Importado por i18n/de/docusaurus-plugin-content-docs/current/07-resiliencia-futuro.mdx |
| [`entsoe-frequency.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/entsoe-frequency.js) | Documento MDX de contenido | Configuración estructural del framework |
| [`entsoe.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/entsoe.js) | Documento MDX de contenido | Importado por docs/anexo-interconexiones-flujos.mdx |
| [`esios-snapshot.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/esios/esios-snapshot.js) | Documento MDX de contenido | Importado por src/components/TermometroRiesgo.jsx |
| [`esios-analysis.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/esios-analysis.js) | Documento MDX de contenido | Importado por src/components/BalanceIntercambios.jsx |
| [`esios-multi.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/esios-multi.js) | Documento MDX de contenido | Importado por docs/datos-tiempo-real/index.mdx |
| [`esios-proxy.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/esios-proxy.js) | Documento MDX de contenido | Configuración estructural del framework |
| [`figure-context.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/figure-context.js) | Documento MDX de contenido | Importado por src/components/ChatFullscreen.jsx |
| [`redata-proxy.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/api/redata-proxy.js) | Documento MDX de contenido | Importado por src/components/EmissionsVsRenewablesChart.jsx |
| [`01-introduccion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/01-introduccion.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`02-contexto.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/02-contexto.mdx) | Documento MDX de contenido | Importado por docs/08.5-actualizacion-2026.mdx |
| [`03-analisis-incidente.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/03-analisis-incidente.mdx) | Documento MDX de contenido | Importado por docs/04-reaccion-reposicion.mdx |
| [`04-reaccion-reposicion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/04-reaccion-reposicion.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`05-analisis-informes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/05-analisis-informes.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`06-impacto-comunicativo.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/06-impacto-comunicativo.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`07-resiliencia-futuro.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07-resiliencia-futuro.mdx) | Documento MDX de contenido | Importado por docs/02-contexto.mdx |
| [`07b-consecuencias-financieras.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07b-consecuencias-financieras.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`08-uso-ia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08-uso-ia.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`08.5-actualizacion-2026.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08.5-actualizacion-2026.mdx) | Documento MDX de contenido | Configuración estructural del framework |
| [`09-conclusiones.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/09-conclusiones.mdx) | Documento MDX de contenido | Configuración estructural del framework |


## 2. Archivos usados por MDX o navegación

| Archivo | Usado en | Tipo de referencia | Mantener sí/no |
| --- | --- | --- | --- |
| [`01-introduccion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/01-introduccion.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`02-contexto.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/02-contexto.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`03-analisis-incidente.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/03-analisis-incidente.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`04-reaccion-reposicion.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/04-reaccion-reposicion.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`05-analisis-informes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/05-analisis-informes.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`06-impacto-comunicativo.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/06-impacto-comunicativo.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`07-resiliencia-futuro.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07-resiliencia-futuro.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`07b-consecuencias-financieras.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/07b-consecuencias-financieras.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`08-uso-ia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08-uso-ia.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`08.5-actualizacion-2026.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/08.5-actualizacion-2026.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`09-conclusiones.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/09-conclusiones.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`10-resumen-de-cifras.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/10-resumen-de-cifras.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`11-cronologia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/11-cronologia.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`13-sobre-el-autor.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/13-sobre-el-autor.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-cascada-protecciones-desconexiones.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-cascada-protecciones-desconexiones.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-comunicacion-fuentes.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-comunicacion-fuentes.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-demanda-generacion-balance.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-demanda-generacion-balance.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-ecuaciones-matematicas.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-ecuaciones-matematicas.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-estabilidad-dinamica-tension.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-estabilidad-dinamica-tension.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |
| [`anexo-impacto-resiliencia.mdx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/docs/anexo-impacto-resiliencia.mdx) | Navegación / Rutas del sitio | Ruta MDX de capítulo/anexo | Sí |


## 3. Componentes React usados

| Componente | Ruta | Usado en | CSS asociado | Mantener |
| --- | --- | --- | --- | --- |
| `FinancialWaterfallChart` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/FinancialWaterfallChart.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/FinancialWaterfallChart.jsx) | docs/07b-consecuencias-financieras.mdx, i18n/de/docusaurus-plugin-content-docs/current/07b-consecuencias-financieras.mdx | Sí (.module.css) | Sí |
| `FinancialWaterfallChart.module` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/FinancialWaterfallChart.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/FinancialWaterfallChart.module.css) | src/components/07b-consecuencias-financieras/FinancialWaterfallChart.jsx, src/components/FinancialWaterfallChart.jsx | No | Sí |
| `MacroEconomicDamageFlowFigure` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.jsx) | docs/07b-consecuencias-financieras.mdx, src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.module.css | Sí (.module.css) | Sí |
| `MacroEconomicDamageFlowFigure.module` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.module.css) | src/components/07b-consecuencias-financieras/MacroEconomicDamageFlowFigure.jsx, src/components/MacroEconomicDamageFlowFigure.jsx | No | Sí |
| `MarketDistortionPvpcFigure` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.jsx) | docs/07b-consecuencias-financieras.mdx, src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.module.css | Sí (.module.css) | Sí |
| `MarketDistortionPvpcFigure.module` | [`tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.module.css) | src/components/07b-consecuencias-financieras/MarketDistortionPvpcFigure.jsx, src/components/MarketDistortionPvpcFigure.jsx | No | Sí |
| `AnimatedMap` | [`tfg-antigravity-docs/src/components/AnimatedMap.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/AnimatedMap.jsx) | i18n/en/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx, src/components/InteractiveGraphicsGalleryBase.jsx | Sí (.module.css) | Sí |
| `AnimatedMap.module` | [`tfg-antigravity-docs/src/components/AnimatedMap.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/AnimatedMap.module.css) | src/components/AnimatedMap.jsx | No | Sí |
| `AnimatedRestorationMap` | [`tfg-antigravity-docs/src/components/AnimatedRestorationMap.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/AnimatedRestorationMap.jsx) | docs/04-reaccion-reposicion.mdx, i18n/zh-Hans/docusaurus-plugin-content-docs/current/04-reaccion-reposicion.mdx | No | Sí |
| `Annex.module` | [`tfg-antigravity-docs/src/components/annex/Annex.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/Annex.module.css) | src/components/annex/AnnexLayout.jsx, src/components/annex/AnnexMethodNote.jsx | No | Sí |
| `AnnexBlackoutRelevance` | [`tfg-antigravity-docs/src/components/annex/AnnexBlackoutRelevance.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexBlackoutRelevance.jsx) | docs/anexo-cascada-protecciones-desconexiones.mdx, docs/anexo-comunicacion-fuentes.mdx | Sí (.module.css) | Sí |
| `AnnexBlackoutRelevance.module` | [`tfg-antigravity-docs/src/components/annex/AnnexBlackoutRelevance.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexBlackoutRelevance.module.css) | src/components/annex/AnnexBlackoutRelevance.jsx | No | Sí |
| `AnnexConceptIndex` | [`tfg-antigravity-docs/src/components/annex/AnnexConceptIndex.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexConceptIndex.jsx) | docs/anexo-indice-conceptual.mdx, i18n/de/docusaurus-plugin-content-docs/current/anexo-indice-conceptual.mdx | Sí (.module.css) | Sí |
| `AnnexConceptIndex.module` | [`tfg-antigravity-docs/src/components/annex/AnnexConceptIndex.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexConceptIndex.module.css) | src/components/annex/AnnexConceptIndex.jsx | No | Sí |
| `AnnexCrossLinks` | [`tfg-antigravity-docs/src/components/annex/AnnexCrossLinks.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexCrossLinks.jsx) | docs/anexo-cascada-protecciones-desconexiones.mdx, docs/anexo-comunicacion-fuentes.mdx | Sí (.module.css) | Sí |
| `AnnexCrossLinks.module` | [`tfg-antigravity-docs/src/components/annex/AnnexCrossLinks.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexCrossLinks.module.css) | src/components/annex/AnnexCrossLinks.jsx | No | Sí |
| `AnnexEvidence` | [`tfg-antigravity-docs/src/components/annex/AnnexEvidence.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexEvidence.jsx) | docs/anexo-cascada-protecciones-desconexiones.mdx, docs/anexo-comunicacion-fuentes.mdx | Sí (.module.css) | Sí |
| `AnnexEvidence.module` | [`tfg-antigravity-docs/src/components/annex/AnnexEvidence.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexEvidence.module.css) | src/components/annex/AnnexEvidence.jsx | No | Sí |
| `AnnexEvidenceGrid` | [`tfg-antigravity-docs/src/components/annex/AnnexEvidenceGrid.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexEvidenceGrid.jsx) | docs/anexo-cascada-protecciones-desconexiones.mdx, docs/anexo-comunicacion-fuentes.mdx | Sí (.module.css) | Sí |
| `AnnexEvidenceGrid.module` | [`tfg-antigravity-docs/src/components/annex/AnnexEvidenceGrid.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/annex/AnnexEvidenceGrid.module.css) | src/components/annex/AnnexEvidenceGrid.jsx | No | Sí |


## 4. Componentes React no usados o dudosos

| Componente | Ruta | Evidencia | Recomendación | Riesgo |
| --- | --- | --- | --- | --- |
| `AuthorProfile.module` | [`tfg-antigravity-docs/src/components/AuthorProfile.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/AuthorProfile.module.css) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `CineModeLauncher` | [`tfg-antigravity-docs/src/components/CineMode/CineModeLauncher.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/CineMode/CineModeLauncher.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `CollapseTimelineChart` | [`tfg-antigravity-docs/src/components/CollapseTimelineChart.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/CollapseTimelineChart.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `DocumentLibrary` | [`tfg-antigravity-docs/src/components/DocumentLibrary.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/DocumentLibrary.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `EconomicImpactTable` | [`tfg-antigravity-docs/src/components/EconomicImpactTable.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/EconomicImpactTable.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `ModalButton` | [`tfg-antigravity-docs/src/components/ENTSOEDashboard/ModalButton.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/ENTSOEDashboard/ModalButton.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `ResizeFix` | [`tfg-antigravity-docs/src/components/EsiosCharts/ResizeFix.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/EsiosCharts/ResizeFix.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `EvidencePointer` | [`tfg-antigravity-docs/src/components/EvidencePointer/EvidencePointer.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/EvidencePointer/EvidencePointer.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `ForensicTableViewer` | [`tfg-antigravity-docs/src/components/GaleriaForense/ForensicTableViewer.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/GaleriaForense/ForensicTableViewer.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `GlossaryLink.module` | [`tfg-antigravity-docs/src/components/GlossaryLink.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/GlossaryLink.module.css) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `IberianGridMap` | [`tfg-antigravity-docs/src/components/IberianGridMap.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/IberianGridMap.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `ImageGallery` | [`tfg-antigravity-docs/src/components/ImageGallery.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/ImageGallery.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `InterconexionMap` | [`tfg-antigravity-docs/src/components/InterconexionMap.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/InterconexionMap.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `MediaCoverageDashboard` | [`tfg-antigravity-docs/src/components/MediaCoverageDashboard.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/MediaCoverageDashboard.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `MetamorfosisIBR.module` | [`tfg-antigravity-docs/src/components/MetamorfosisIBR/MetamorfosisIBR.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/MetamorfosisIBR/MetamorfosisIBR.module.css) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `StickyScene` | [`tfg-antigravity-docs/src/components/StickyScene.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/StickyScene.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `StickyTimeline` | [`tfg-antigravity-docs/src/components/StickyTimeline.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/StickyTimeline.jsx) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |
| `SwingEquationSimulator.module` | [`tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.module.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/components/SwingEquationSimulator/SwingEquationSimulator.module.css) | 0 importaciones detectadas | Revisar / Mover a archivo si es legacy | Medio (podría invocarse dinámicamente) |


## 5. Assets e imágenes

| Asset | Ruta | Usado en | Recomendación | Riesgo |
| --- | --- | --- | --- | --- |
| `aege_arc_furnace_dark.png` | [`tfg-antigravity-docs/static/figuras/aege_arc_furnace_dark.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/aege_arc_furnace_dark.png) | Importado en docs/07b-consecuencias-financieras.mdx | Mantener | Muy alto (rompe la web) |
| `aege_arc_furnace_light.png` | [`tfg-antigravity-docs/static/figuras/aege_arc_furnace_light.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/aege_arc_furnace_light.png) | Importado en docs/07b-consecuencias-financieras.mdx | Mantener | Muy alto (rompe la web) |
| `albustami_ieee39_secuencia.png` | [`tfg-antigravity-docs/static/figuras/albustami_ieee39_secuencia.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/albustami_ieee39_secuencia.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/01-introduccion.mdx | Mantener | Muy alto (rompe la web) |
| `aluvion_alertas_sobretension_sur.png` | [`tfg-antigravity-docs/static/figuras/aluvion_alertas_sobretension_sur.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/aluvion_alertas_sobretension_sur.png) | Importado en docs/05-analisis-informes.mdx | Mantener | Muy alto (rompe la web) |
| `asimetria_balance_reactiva_sur.png` | [`tfg-antigravity-docs/static/figuras/asimetria_balance_reactiva_sur.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/asimetria_balance_reactiva_sur.png) | Importado en docs/05-analisis-informes.mdx | Mantener | Muy alto (rompe la web) |
| `black_start_hidroelectrico.png` | [`tfg-antigravity-docs/static/figuras/black_start_hidroelectrico.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/black_start_hidroelectrico.png) | Importado en docs/04-reaccion-reposicion.mdx | Mantener | Muy alto (rompe la web) |
| `capacidad_instalada_2025.png` | [`tfg-antigravity-docs/static/figuras/capacidad_instalada_2025.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/capacidad_instalada_2025.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/02-contexto.mdx | Mantener | Muy alto (rompe la web) |
| `cascada_desconexiones.png` | [`tfg-antigravity-docs/static/figuras/cascada_desconexiones.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/cascada_desconexiones.png) | Importado en i18n/en/docusaurus-plugin-content-docs/current/03-analisis-incidente.mdx | Mantener | Muy alto (rompe la web) |
| `collage_ciudadanos.png` | [`tfg-antigravity-docs/static/figuras/collage_ciudadanos.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/collage_ciudadanos.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/06-impacto-comunicativo.mdx | Mantener | Muy alto (rompe la web) |
| `collage_conservador.png` | [`tfg-antigravity-docs/static/figuras/collage_conservador.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/collage_conservador.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/06-impacto-comunicativo.mdx | Mantener | Muy alto (rompe la web) |
| `collage_internacional.png` | [`tfg-antigravity-docs/static/figuras/collage_internacional.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/collage_internacional.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/06-impacto-comunicativo.mdx | Mantener | Muy alto (rompe la web) |
| `collage_politicos.png` | [`tfg-antigravity-docs/static/figuras/collage_politicos.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/collage_politicos.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/06-impacto-comunicativo.mdx | Mantener | Muy alto (rompe la web) |
| `collage_progresista.png` | [`tfg-antigravity-docs/static/figuras/collage_progresista.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/collage_progresista.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/06-impacto-comunicativo.mdx | Mantener | Muy alto (rompe la web) |
| `conventionalunits.png` | [`tfg-antigravity-docs/static/figuras/conventionalunits.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/conventionalunits.png) | Importado en docs/07-resiliencia-futuro.mdx | Mantener | Muy alto (rompe la web) |
| `coste_optimo_ers.png` | [`tfg-antigravity-docs/static/figuras/coste_optimo_ers.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/coste_optimo_ers.png) | Importado en docs/07-resiliencia-futuro.mdx | Mantener | Muy alto (rompe la web) |
| `entsoe_flow_deviation.png` | [`tfg-antigravity-docs/static/figuras/entsoe_flow_deviation.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/entsoe_flow_deviation.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/02-contexto.mdx | Mantener | Muy alto (rompe la web) |
| `ers_revenue_stacking.png` | [`tfg-antigravity-docs/static/figuras/ers_revenue_stacking.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/ers_revenue_stacking.png) | Importado en docs/07-resiliencia-futuro.mdx | Mantener | Muy alto (rompe la web) |
| `estrategia_reenergizacion_dual.png` | [`tfg-antigravity-docs/static/figuras/estrategia_reenergizacion_dual.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/estrategia_reenergizacion_dual.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/04-reaccion-reposicion.mdx | Mantener | Muy alto (rompe la web) |
| `evolucion_carga_repuesta_francia.png` | [`tfg-antigravity-docs/static/figuras/evolucion_carga_repuesta_francia.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/evolucion_carga_repuesta_francia.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/04-reaccion-reposicion.mdx | Mantener | Muy alto (rompe la web) |
| `evolucion_mix_reenergizacion.png` | [`tfg-antigravity-docs/static/figuras/evolucion_mix_reenergizacion.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/evolucion_mix_reenergizacion.png) | Importado en docs/04-reaccion-reposicion.mdx | Mantener | Muy alto (rompe la web) |
| `figuraB3-dark.png` | [`tfg-antigravity-docs/static/figuras/figuraB3-dark.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/figuraB3-dark.png) | Importado en docs/02-contexto.mdx | Mantener | Muy alto (rompe la web) |
| `figuraB3-light.png` | [`tfg-antigravity-docs/static/figuras/figuraB3-light.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/figuraB3-light.png) | Importado en docs/02-contexto.mdx | Mantener | Muy alto (rompe la web) |
| `fluctuaciones_tension_previas.png` | [`tfg-antigravity-docs/static/figuras/fluctuaciones_tension_previas.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/fluctuaciones_tension_previas.png) | Importado en docs/05-analisis-informes.mdx | Mantener | Muy alto (rompe la web) |
| `frequency_voltage_carmona.png` | [`tfg-antigravity-docs/static/figuras/frequency_voltage_carmona.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/frequency_voltage_carmona.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/02-contexto.mdx | Mantener | Muy alto (rompe la web) |
| `futured_grid_evolution.png` | [`tfg-antigravity-docs/static/figuras/futured_grid_evolution.png`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/figuras/futured_grid_evolution.png) | Importado en i18n/de/docusaurus-plugin-content-docs/current/01-introduccion.mdx | Mantener | Muy alto (rompe la web) |


## 6. Datos, índices y JSON

| Archivo | Ruta | Usado por | Generado/manual | Recomendación |
| --- | --- | --- | --- | --- |
| `datosForenses.json` | [`tfg-antigravity-docs/src/data/datosForenses.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/datosForenses.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `datosForenses_de.json` | [`tfg-antigravity-docs/src/data/datosForenses_de.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/datosForenses_de.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `datosForenses_en.json` | [`tfg-antigravity-docs/src/data/datosForenses_en.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/datosForenses_en.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `datosForenses_zh-Hans.json` | [`tfg-antigravity-docs/src/data/datosForenses_zh-Hans.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/datosForenses_zh-Hans.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `galeriaforensedefinitiva.json` | [`tfg-antigravity-docs/src/data/galeriaforensedefinitiva.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/galeriaforensedefinitiva.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `glossary-terms.json` | [`tfg-antigravity-docs/src/data/glossary-terms.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/glossary-terms.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `media-factchecks.json` | [`tfg-antigravity-docs/src/data/media-factchecks.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/media-factchecks.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `28A_demand.json` | [`tfg-antigravity-docs/src/data/processed/28A_demand.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/28A_demand.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `28A_ics_violations.json` | [`tfg-antigravity-docs/src/data/processed/28A_ics_violations.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/28A_ics_violations.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `28A_inertia.json` | [`tfg-antigravity-docs/src/data/processed/28A_inertia.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/28A_inertia.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `28A_topology_manoeuvres.json` | [`tfg-antigravity-docs/src/data/processed/28A_topology_manoeuvres.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/28A_topology_manoeuvres.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `28A_voltage_manoeuvres.json` | [`tfg-antigravity-docs/src/data/processed/28A_voltage_manoeuvres.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/28A_voltage_manoeuvres.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `gallery-index.json` | [`tfg-antigravity-docs/src/data/processed/gallery-index.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/processed/gallery-index.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `strings.json` | [`tfg-antigravity-docs/src/data/strings.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/strings.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `to_translate.json` | [`tfg-antigravity-docs/src/data/to_translate.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/src/data/to_translate.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `annex-elements-metadata.json` | [`tfg-antigravity-docs/static/data/annex-elements-metadata.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/data/annex-elements-metadata.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `annex-figures-metadata.json` | [`tfg-antigravity-docs/static/data/annex-figures-metadata.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/data/annex-figures-metadata.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `blackout_snapshot_28A.json` | [`tfg-antigravity-docs/static/data/blackout_snapshot_28A.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/data/blackout_snapshot_28A.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `datos28A.json` | [`tfg-antigravity-docs/static/data/datos28A.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/data/datos28A.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |
| `active_units_top20.json` | [`tfg-antigravity-docs/static/data/entsoe/active_units_top20.json`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/tfg-antigravity-docs/static/data/entsoe/active_units_top20.json) | Visualizaciones de datos | Generado automáticamente | Conservar (necesario en producción) |


## 7. Scripts

| Script | Ruta | Función probable | Usado por package.json/build/chatbot | Recomendación |
| --- | --- | --- | --- | --- |
| `audit_figures.js` | [`audit_figures.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/audit_figures.js) | Automatización/Limpieza | No | Mover a /tools/ |
| `babel.config.js` | [`babel.config.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/babel.config.js) | Automatización/Limpieza | No | Mover a /tools/ |
| `build_glossary.py` | [`build_glossary.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/build_glossary.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `alertas.py` | [`dashboard_backup/alertas.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/alertas.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `app.py` | [`dashboard_backup/app.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/app.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `asistente_local.py` | [`dashboard_backup/asistente_local.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/asistente_local.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `auto_init.py` | [`dashboard_backup/auto_init.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/auto_init.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `extractor.py` | [`dashboard_backup/extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/extractor.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `indexar_tfg.py` | [`dashboard_backup/indexar_tfg.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/indexar_tfg.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `inercia.py` | [`dashboard_backup/inercia.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/inercia.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `rocof.py` | [`dashboard_backup/rocof.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/rocof.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `setup.py` | [`dashboard_backup/setup.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/setup.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `alertas.py` | [`dashboard_backup/temp_claude/alertas.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/alertas.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `app.py` | [`dashboard_backup/temp_claude/app.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/app.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `asistente_local.py` | [`dashboard_backup/temp_claude/asistente_local.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/asistente_local.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `cargador_28a.py` | [`dashboard_backup/temp_claude/cargador_28a.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/cargador_28a.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `extractor.py` | [`dashboard_backup/temp_claude/extractor.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/extractor.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `inercia.py` | [`dashboard_backup/temp_claude/inercia.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/inercia.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `metricas_avanzadas.py` | [`dashboard_backup/temp_claude/metricas_avanzadas.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/metricas_avanzadas.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `rocof.py` | [`dashboard_backup/temp_claude/rocof.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/rocof.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `tab_forense_28a.py` | [`dashboard_backup/temp_claude/tab_forense_28a.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/tab_forense_28a.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `visualizaciones_forenses.py` | [`dashboard_backup/temp_claude/visualizaciones_forenses.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dashboard_backup/temp_claude/visualizaciones_forenses.py) | Automatización/Limpieza | No | Mover a /tools/ |
| `deduplicate_links.js` | [`deduplicate_links.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/deduplicate_links.js) | Automatización/Limpieza | No | Mover a /tools/ |
| `docusaurus.config.js` | [`docusaurus.config.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/docusaurus.config.js) | Automatización/Limpieza | No | Mover a /tools/ |
| `dump_script.js` | [`dump_script.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/dump_script.js) | Automatización/Limpieza | No | Mover a /tools/ |


## 8. Archivos temporales, volcados o de trabajo

| Archivo | Ruta | Motivo de sospecha | Recomendación |
| --- | --- | --- | --- |
| `anexo_cap2.tex` | [`Anexos_Conceptos/anexo_cap2.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap2.tex) | Backup temporal o log de auditorías | Eliminar |
| `anexo_cap3.tex` | [`Anexos_Conceptos/anexo_cap3.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap3.tex) | Backup temporal o log de auditorías | Eliminar |
| `anexo_cap4.tex` | [`Anexos_Conceptos/anexo_cap4.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap4.tex) | Backup temporal o log de auditorías | Eliminar |
| `anexo_cap5.tex` | [`Anexos_Conceptos/anexo_cap5.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap5.tex) | Backup temporal o log de auditorías | Eliminar |
| `anexo_cap6.tex` | [`Anexos_Conceptos/anexo_cap6.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap6.tex) | Backup temporal o log de auditorías | Eliminar |
| `anexo_cap7.tex` | [`Anexos_Conceptos/anexo_cap7.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Conceptos/anexo_cap7.tex) | Backup temporal o log de auditorías | Eliminar |
| `prompts.tex` | [`Anexos_Prompts/prompts.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Anexos_Prompts/prompts.tex) | Backup temporal o log de auditorías | Eliminar |
| `LateralBar.jsx` | [`BARRA LATERAL/LateralBar.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/LateralBar.jsx) | Backup temporal o log de auditorías | Eliminar |
| `README.md` | [`BARRA LATERAL/README.md`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/README.md) | Backup temporal o log de auditorías | Eliminar |
| `sidebar.css` | [`BARRA LATERAL/sidebar.css`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/sidebar.css) | Backup temporal o log de auditorías | Eliminar |
| `SidebarCategory.jsx` | [`BARRA LATERAL/SidebarCategory.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/SidebarCategory.jsx) | Backup temporal o log de auditorías | Eliminar |
| `SidebarIcons.jsx` | [`BARRA LATERAL/SidebarIcons.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BARRA LATERAL/SidebarIcons.jsx) | Backup temporal o log de auditorías | Eliminar |
| `ChatFullscreen.jsx` | [`BOT2.0/ChatFullscreen.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/ChatFullscreen.jsx) | Backup temporal o log de auditorías | Eliminar |
| `ChatWidget.jsx` | [`BOT2.0/ChatWidget.jsx`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/ChatWidget.jsx) | Backup temporal o log de auditorías | Eliminar |
| `figure-context.js` | [`BOT2.0/figure-context.js`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/BOT2.0/figure-context.js) | Backup temporal o log de auditorías | Eliminar |
| `introduccion.tex` | [`Cap1_Introduccion/introduccion.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap1_Introduccion/introduccion.tex) | Backup temporal o log de auditorías | Eliminar |
| `contexto_sector.tex` | [`Cap2_Contexto/contexto_sector.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap2_Contexto/contexto_sector.tex) | Backup temporal o log de auditorías | Eliminar |
| `sistema_espanol.tex` | [`Cap3_Sistema_Espanol/sistema_espanol.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap3_Sistema_Espanol/sistema_espanol.tex) | Backup temporal o log de auditorías | Eliminar |
| `reaccion_reposicion.tex` | [`Cap4_Reaccion_Reposicion/reaccion_reposicion.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap4_Reaccion_Reposicion/reaccion_reposicion.tex) | Backup temporal o log de auditorías | Eliminar |
| `analisis_informes.tex` | [`Cap5_Analisis_Informes/analisis_informes.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap5_Analisis_Informes/analisis_informes.tex) | Backup temporal o log de auditorías | Eliminar |
| `impacto_comunicativo.tex` | [`Cap6_Impacto_Comunicativo/impacto_comunicativo.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap6_Impacto_Comunicativo/impacto_comunicativo.tex) | Backup temporal o log de auditorías | Eliminar |
| `resiliencia_futuro.tex` | [`Cap7_Resiliencia_Futuro/resiliencia_futuro.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap7_Resiliencia_Futuro/resiliencia_futuro.tex) | Backup temporal o log de auditorías | Eliminar |
| `uso_ia.tex` | [`Cap8_Uso_IA/uso_ia.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap8_Uso_IA/uso_ia.tex) | Backup temporal o log de auditorías | Eliminar |
| `conclusiones.tex` | [`Cap9_Conclusiones/conclusiones.tex`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/Cap9_Conclusiones/conclusiones.tex) | Backup temporal o log de auditorías | Eliminar |
| `.env` | [`DASHBOARD/.env`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/.env) | Backup temporal o log de auditorías | Eliminar |
| `config.toml` | [`DASHBOARD/.streamlit/config.toml`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/.streamlit/config.toml) | Backup temporal o log de auditorías | Eliminar |
| `alertas.py` | [`DASHBOARD/alertas.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/alertas.py) | Backup temporal o log de auditorías | Eliminar |
| `app.py` | [`DASHBOARD/app.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/app.py) | Backup temporal o log de auditorías | Eliminar |
| `asistente_local.py` | [`DASHBOARD/asistente_local.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/asistente_local.py) | Backup temporal o log de auditorías | Eliminar |
| `auto_init.py` | [`DASHBOARD/auto_init.py`](file:///c:\Users\aphmo\Proyectos\TFG OVERLEAF/DASHBOARD/auto_init.py) | Backup temporal o log de auditorías | Eliminar |


## 9. Archivos legacy o duplicados

| Archivo | Posible duplicado de | Evidencia | Recomendación |
| --- | --- | --- | --- |
| `tfg-antigravity-docs/static/tfg_antigravity(1).pdf` | `tfg_antigravity (1).pdf` | Mismo tamaño en bytes y nombre similar | Mantener solo el de `static/` y eliminar el de la raíz |
| `tfg-antigravity-docs/docs/anexo-figuras.mdx.bak` | `tfg-antigravity-docs/docs/anexo-figuras.mdx` | Copia de seguridad automática | Eliminar |
| `tfg-antigravity-docs/docs/anexo-tablas.mdx.bak` | `tfg-antigravity-docs/docs/anexo-tablas.mdx` | Copia de seguridad automática | Eliminar |

## 10. Candidatos claros a eliminar

| Archivo | Motivo | Evidencia de no uso | Riesgo |
| --- | --- | --- | --- |
| `anexo_cap2.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `anexo_cap3.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `anexo_cap4.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `anexo_cap5.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `anexo_cap6.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `anexo_cap7.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `prompts.tex` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `LateralBar.jsx` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `README.md` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `sidebar.css` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `SidebarCategory.jsx` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `SidebarIcons.jsx` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `ChatFullscreen.jsx` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `ChatWidget.jsx` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |
| `figure-context.js` | Archivo temporal, backup o volcado de texto | No está en sidebars, package.json ni importado en el código | Nulo |


## 11. Candidatos a mover fuera del repo o a carpeta interna

| Archivo | Destino sugerido | Motivo |
| --- | --- | --- |
| Scripts en `tfg-antigravity-docs/*` (ej. `apply_translations.js`, `fix_mdx.js`) | `tfg-antigravity-docs/tools/` o `tfg-antigravity-docs/scripts/archive/` | Organizar el código y mantener la carpeta principal limpia |
| Informes PDF en la raíz (ej. `95103.pdf`, `Informe ICAI (1).pdf`) | Mover fuera del repositorio | Son documentos de referencia académica externa que engordan el repo (`>30MB`) |

## 12. Candidatos a añadir a .gitignore

| Patrón | Motivo |
| --- | --- |
| `*.bak` | Evitar subir archivos de copia de seguridad generados por editores |
| `build-out*.log` | Logs de depuración de compilación locales |
| `*.zip` / `*.rar` | Comprimidos temporales |

## 13. Archivos que NO se deben borrar

| Archivo | Motivo |
| --- | --- |
| `tfg-antigravity-docs/static/tfg_antigravity(1).pdf` | El enlace de descarga en la barra de navegación del sitio apunta a este archivo |
| `tfg-antigravity-docs/api/chat.js` | Endpoint funcional en Vercel para responder preguntas en el Chatbot |
| `tfg-antigravity-docs/static/search-index.json` | Índice de búsqueda local lunr/chatbot |

## 14. Plan de limpieza propuesto

### Fase 1 — Eliminar temporales seguros
Eliminar carpetas de descompresión de la raíz (`unzipped_files`, `temp_*`), volcados de texto `.txt` y archivos duplicados de la raíz.

### Fase 2 — Mover herramientas internas
Crear una carpeta `tfg-antigravity-docs/tools/` y mover allí todos los scripts `.js` y `.py` sueltos de automatizaciones del sitio.

### Fase 3 — Actualizar .gitignore
Añadir extensiones temporales (`*.bak`, `*.log`, `*.zip`) al archivo `.gitignore`.

### Fase 4 — Validar build
Ejecutar `npm run build` para certificar que la limpieza no ha roto ninguna importación o ruta dinámica.

### Fase 5 — Commit de limpieza
Realizar un commit atómico con los cambios aplicados en la rama de limpieza.

## 15. Comandos sugeridos

```bash
# 1. Crear carpeta de herramientas y archivar
mkdir tfg-antigravity-docs/tools
mv tfg-antigravity-docs/*.js tfg-antigravity-docs/tools/
mv tfg-antigravity-docs/*.py tfg-antigravity-docs/tools/

# 2. Restaurar scripts esenciales que se usan en package.json
mv tfg-antigravity-docs/tools/build-index.js tfg-antigravity-docs/scripts/

# 3. Eliminar archivos temporales de la raíz del repositorio
git rm -f *.txt
git rm -rf unzipped_files/
git rm -rf temp_extracted_files/
git rm -rf Anexos_Conceptos/
git rm -rf BARRA\ LATERAL/
git rm -rf ENTSO/
git rm -rf INFORMES/
git rm -rf RESUMEN/

# 4. Validar compilación
npm run build --prefix tfg-antigravity-docs
```

## 16. Riesgos

| Riesgo | Causa | Mitigación |
| --- | --- | --- |
| Rotura del chatbot | Eliminar el script de prebuild de índices | Proteger `scripts/build-index.js` y mantenerlo en las exclusiones de borrado |
| Enlaces rotos de descarga | Eliminar el PDF oficial del libro | Garantizar que el PDF final del TFG permanezca en la carpeta `static/` |

## 17. Recomendación final

Se aconseja realizar primero la eliminación de todos los volcados de texto y carpetas obsoletas en la raíz (Fase 1), ya que representan más del 90% del desorden en el repositorio y no afectan en absoluto al proyecto de Docusaurus. A continuación, mover los scripts y archivos de traducción a una carpeta interna de herramientas (`tools/`) y, por último, verificar que el build de producción pasa correctamente sin errores de compilación ni enlaces rotos.
