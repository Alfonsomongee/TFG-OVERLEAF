// ─────────────────────────────────────────────────────────────────────────────
// INSTRUCCIÓN PARA ANTIGRAVITY:
// En docusaurus.config.js, reemplazar el bloque `stylesheets: [...]` existente
// y añadir `headTags: [...]` justo debajo, dentro del objeto `config`.
// ─────────────────────────────────────────────────────────────────────────────

// ANTES (2 peticiones separadas a Google Fonts + import en ExecutiveHook.module.css):
//
//   stylesheets: [
//     {
//       href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css',
//       ...
//     },
//   ],
//
// DESPUÉS (1 petición unificada con TODAS las fuentes del proyecto):

stylesheets: [
  // KaTeX — mantener igual
  {
    href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css',
    type: 'text/css',
    integrity: 'sha384-SfHjyzed8eCsTSa4t2GoMc4WnsCLa6cQpFqPRCaizz0FlQUOyafw/AyIUCQU/KuM',
    crossorigin: 'anonymous',
  },
  // Google Fonts — UNA sola petición con TODAS las familias del proyecto.
  // Consolida: Space Grotesk + Inter + JetBrains Mono (custom.css)
  //          + Alfa Slab One + Playfair Display (ExecutiveHook splash)
  // Eliminar el @import de ExecutiveHook.module.css tras aplicar este cambio.
  {
    href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Alfa+Slab+One&family=Playfair+Display:wght@700;800;900&display=swap',
    type: 'text/css',
    rel: 'stylesheet',
  },
],

// Preconexiones tempranas — reducen la latencia DNS+TCP de Google Fonts
headTags: [
  {
    tagName: 'link',
    attributes: {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
  },
  {
    tagName: 'link',
    attributes: {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
  },
  // ELIMINAR cualquier <link rel="preload"> de europe-night-dark.jpg
  // que pudiera existir aquí — el informe detectó que no se usa en el
  // render inicial y genera un warning de "preloaded but not used".
],

// ─────────────────────────────────────────────────────────────────────────────
// ACCIÓN ADICIONAL REQUERIDA en ExecutiveHook.module.css:
// Eliminar la primera línea:
//   @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One...');
// Ya no hace falta — las fuentes se cargan desde docusaurus.config.js.
// ─────────────────────────────────────────────────────────────────────────────
