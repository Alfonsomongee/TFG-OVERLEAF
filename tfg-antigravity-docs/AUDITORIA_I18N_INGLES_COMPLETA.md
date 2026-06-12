# Auditoría i18n — Versión Inglesa Completa (TFG Apagón Ibérico 28A)

Este documento presenta la auditoría completa de internacionalización (i18n) para la versión en inglés del sitio web del TFG, asegurando que sea 100% equivalente a la versión en castellano y que no quede texto en español visible para el usuario en la versión inglesa.

---

## 1. Configuración del Proyecto y Estado Actual

* **Idioma Base**: Español (`es`).
* **Locales Configurados**: `es`, `en`, `de`, `zh-Hans` en [docusaurus.config.js](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/docusaurus.config.js).
* **Directorio de Internacionalización**: `i18n/` existe y contiene subcarpetas para cada uno de los idiomas adicionales (`en`, `de`, `zh-Hans`).
* **Estructura de Ficheros**:
  * Los documentos de la versión en español se encuentran en `docs/`.
  * Los documentos traducidos en inglés se encuentran en `i18n/en/docusaurus-plugin-content-docs/current/`.

---

## 2. Análisis Comparativo de Ficheros MDX (es vs en)

### A. Ficheros del Root de Docs
Todos los 28 ficheros MDX activos en castellano tienen su equivalente en la carpeta `i18n/en/docusaurus-plugin-content-docs/current/`. La estructura del contenido está sincronizada.

### B. Ficheros Redundantes / Huérfanos detectados en Inglés (`i18n/en`)
Se han encontrado ficheros y carpetas obsoletas en la versión inglesa que fueron eliminados o reorganizados en la versión española. Para evitar fallos de mantenimiento y garantizar que la versión inglesa sea un reflejo fiel, se eliminarán:
1. **Ficheros extra en `datos-tiempo-real/`**:
   * `costes-ajuste.mdx` (eliminado en español, integrado en anexos)
   * `emisiones-renovable.mdx` (eliminado en español, integrado en anexos)
   * `indisponibilidad.mdx` (eliminado en español, integrado en anexos)
   * `resiliencia-sectorial.mdx` (eliminado en español, integrado en anexos)
   * `waterfall-financiero.mdx` (eliminado en español, integrado en anexos)
2. **Directorios duplicados obsoletos** en `i18n/en/docusaurus-plugin-content-docs/current/`:
   * Carpetas `01-introduccion/`, `02-contexto/`, `04-reaccion-reposicion/`, `05-analisis-informes/`, `06-impacto-comunicativo/`, `07-resiliencia-futuro/`, `08-uso-ia/`, `09-conclusiones/` (que contienen ficheros duplicados como `index.mdx` o `_category_.json` ya inexistentes en español).

---

## 3. Auditoría de Componentes y Páginas React (Textos Hardcodeados)

Se han identificado los siguientes elementos de la interfaz de usuario con textos visibles en castellano que requieren internacionalización dinámica:

### A. Páginas y Componentes de la Homepage
* **`src/pages/index.js`**: Título y descripción SEO en el tag `<Layout>` están en español.
* **`src/components/HomeHero.jsx`**:
  * Eyebrow: "Análisis forense · Apagón ibérico del 28 de abril de 2025"
  * Title: "El colapso del sistema eléctrico peninsular"
  * Subtitle: "Reconstrucción técnica, económica y social..."
  * CTAs: "Leer la introducción", "Análisis técnico", "Glosario técnico"
  * Array `CHAIN` (causal chain): "Condición previa", "Disparo raíz", "Cascada IBR", "Separación Francia", "Cero de tensión" y sus correspondientes detalles.
  * Array `NUMBERS`: labels "personas afectadas", "MW perdidos", "de colapso total", "de reposición", "coste Op. Reforzada".
* **`src/components/HomeArgument.jsx`**:
  * Eyebrow: "Sobre esta web"
  * Heading: "Un análisis forense en diez anexos"
  * Párrafos narrativos sobre la naturaleza de la web y la tesis central del colapso.
* **`src/components/HomeReadingPaths.jsx`**:
  * Eyebrow: "Tres formas de recorrer la investigación"
  * Array `PATHS`: "Ruta rápida", "Ruta técnica", "Ruta documental" con sus tiempos, descripciones y enlaces asociados.
* **`src/components/HomeAnnexes.jsx`**:
  * Eyebrow: "Sistema de evidencias", Heading: "Diez anexos", Sub: "170 elementos documentales..."
  * Array `ANNEXES`: Títulos y resúmenes de los diez anexos conceptuales.
* **`src/components/HomeChatInvite.jsx`**:
  * Eyebrow: "Asistente pericial", Heading: "Pregunta directamente...", Desc: "El chatbot RAG...", Note: "Disponible en la esquina..."
  * Terminal UI: "Asistente del TFG — Apagón 28A", mensaje de bienvenida y las 4 sugerencias en español.

### B. Componentes del Visualizador de Evidencias (Anexos)
* **`src/components/annex/AnnexEvidence.jsx`**:
  * Array `CHIPS`: `'Evidencia nuclear'` y `'Evidencia de apoyo'`.
* **`src/components/annex/AnnexEvidenceViewer.jsx`**:
  * Objeto `TYPE_LABELS`: `'Figura'`, `'Tabla'`, `'Interactivo'`, `'Serie'`.
  * Acciones: `'Ampliar figura'`, `'Ver tabla completa'`, `'Ver gráfica'`, `'Abrir interactivo'`.
  * Fallbacks/Cargando: `'Cargando…'`, `'Cargando gráfica…'`, `'Iniciando…'`.
  * Col/Row info: `${rowCount} filas · ${colCount} col.`.
  * Empty message: `'Datos de tabla no disponibles.'`.
  * Prefijos de metadatos: `'Nota:'`, `'Fuente:'`.
* **`src/components/annex/AnnexEvidenceNav.jsx`**:
  * Label: `'Explorar evidencias'`.
  * Botones de navegación interna y sus aria-labels.
* **`src/components/annex/AnnexThemeEvidence.jsx`**:
  * Resúmenes cuantitativos: `'Figuras encontradas: '`, `'Tablas encontradas: '`, `'Interactivos encontrados: '`, `'Series encontradas: '`.
  * Estados vacíos: `'No hay evidencias de este tipo asociadas a este tema.'`.
* **`src/components/annex/AnnexMethodNote.jsx`**:
  * Objeto `typeConfig` (metadatos de procedencia): `'Dato histórico'`, `'Dato vivo'`, `'Estimación'`, `'Análisis forense'`, `'Modelo didáctico'`, `'Ilustración conceptual'`, `'Cuestión abierta'`.

---

## 4. Plan de Implementación y Estrategia i18n

### A. Limpieza de Archivos Redundantes en `i18n/en`
* Eliminar mediante git las carpetas y archivos obsoletos indicados en la sección 2.B.
* Asegurar que no queden referencias rotas.

### B. Refactorización i18n de Componentes y Páginas React
* En cada componente React identificado, se implementará un diccionario local multi-idioma (`TRANSLATIONS` o similar) que soporte las claves `es`, `en`, `de`, `zh-Hans`.
* Se usará el hook `useDocusaurusContext` (o el helper `useDocLang` ya existente) para obtener el locale activo y seleccionar dinámicamente las cadenas traducidas.
* Para Simplified Chinese (`zh-Hans`), se garantizará soporte correcto con caídas (*fallbacks*) a inglés en caso de que la clave `zh-Hans` no esté definida en los datos crudos, traduciendo `zh-Hans` a `zh` para consultas a `imageGalleryData` de forma transparente.

### C. Corrección del Warning `<FigCaption>`
* Se reemplazará la etiqueta personalizada `<FigCaption>` por el tag HTML estándar en minúsculas `<figcaption>` en los 4 ficheros `07-resiliencia-futuro.mdx` (`es`, `en`, `de`, `zh-Hans`).

### D. Verificación y Compilación
* Ejecutar la compilación en modo desarrollo y producción.
* Revisar remanentes con una auditoría final.
