# CHECKLIST DE APLICACIÓN — TFG 28A PREMIUM UPGRADE
# Orden estricto: A → B → C. Hacer commit entre batches para poder revertir.

## ═══ BATCH A — ESTABILIDAD Y RENDIMIENTO ═══
## Commit tras completar: "fix(perf): memory leaks, cursor a11y, fonts, security headers"

### A1 · Root.js — Lenis memory leak
- [ ] Reemplazar src/theme/Root.js con batch-a/src/theme/Root.js
- [ ] Verificar: abrir DevTools → Memory → Heap snapshot antes y después de navegar 5 páginas

### A2 · ForensicReveal — timers recursivos
- [ ] Reemplazar src/components/ForensicReveal/index.js con batch-a/...
- [ ] Verificar: en cualquier capítulo, hacer scroll rápido para activar varios ForensicReveal
      y comprobar en consola que no aparecen warnings de "setState on unmounted component"

### A3 · Layout — CustomCursor condicional
- [ ] Reemplazar src/theme/Layout/index.js con batch-a/...
- [ ] Verificar en móvil (o DevTools → touch emulation): el cursor NO debe montarse

### A4 · vercel.json — Security headers
- [ ] Crear/reemplazar vercel.json en la raíz del proyecto con batch-a/vercel.json
- [ ] Verificar tras deploy: https://securityheaders.com/?q=tfg-overleaf.vercel.app
      Objetivo: grade B o superior

### A5 · docusaurus.config.js — Google Fonts unificado
- [ ] Reemplazar el bloque stylesheets: [...] con el de batch-a/docusaurus.config.PATCH.js
- [ ] Añadir headTags: [...] del mismo archivo
- [ ] ELIMINAR la primera línea de ExecutiveHook.module.css:
      @import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One...');
- [ ] Verificar en Network tab: solo 1 petición a fonts.googleapis.com (no 2)

### A6 · Auditoría de dependencias muertas
- [ ] Copiar scripts/audit-deps.mjs al proyecto
- [ ] Ejecutar: node scripts/audit-deps.mjs
- [ ] Si gsap, echarts, plotly.js, reactflow o maplibre-gl aparecen SIN USO:
      npm uninstall <paquetes no usados>
      (Estimación: si todos sin uso → ahorro ~5.5 MB de bundle sin comprimir)

---

## ═══ BATCH B — ANIMACIONES REFINADAS ═══
## Commit tras completar: "refactor(anim): optimize transitions, scanlines, glitch"

### B1 · DocRoot/index.js — Exit animation
- [ ] Reemplazar src/theme/DocRoot/index.js con batch-b/...
- [ ] Verificar: navegar entre capítulos — la salida debe ser limpia (0.25s fade)
      sin el efecto de "glitch de salida" que competía con el contenido

### B2 · DocRoot/styles.module.css — Scanlines sin blend-mode
- [ ] Reemplazar src/theme/DocRoot/styles.module.css con batch-b/...
- [ ] Verificar en DevTools → Performance → Record scroll:
      Los "Composite Layers" deben reducirse notablemente
      (buscar la desaparición del layer extra del blend-mode)

### B3 · StickyScene.jsx — Solo opacidad
- [ ] Reemplazar src/components/StickyScene.jsx con batch-b/...
- [ ] Verificar: scroll lento hacia arriba en sección con StickyScene —
      los steps deben volver al estado dim (opacity 0.2) correctamente

### B4 · GlitchTitle.module.css — Una sola capa, 800ms
- [ ] Reemplazar src/components/GlitchTitle.module.css con batch-b/...
- [ ] Verificar: el efecto debe completarse en ~0.8s y no verse el conflicto
      cian/magenta simultáneo

### B5 · ChartCard.jsx — clipPath reveal
- [ ] Reemplazar src/components/ChartCard.jsx con batch-b/...
- [ ] Verificar: el reveal de la máscara debe ser suave y sin jank en DevTools
      (Performance → no debe haber "Layout" en los frames de la animación)

---

## ═══ BATCH C — SISTEMA VISUAL UNIFICADO ═══
## Commit tras completar: "refactor(design): unified token system, contrast fix, glossary"

### C1 · designTokens.css — Sistema unificado
- [ ] Reemplazar src/css/designTokens.css con batch-c/...
- [ ] IMPORTANTE: este archivo define aliases de compatibilidad para que los
      componentes que aún usan --forensic-bg-primary, --forensic-amber-primary, etc.
      sigan funcionando sin cambios. Verificar visualmente toda la app.

### C2 · custom.css — Parches
- [ ] Aplicar los 5 bloques de batch-c/src/css/custom.PATCH.css:
      · Bloque 1: reemplazar html[data-theme='light'] completo
      · Bloque 2: añadir max-width en prosa (.markdown > p)
      · Bloque 3: añadir variables --chart-*
      · Bloque 4: (ver C3)
      · Bloque 5: añadir override de h1 en documentos
- [ ] Verificar contraste en modo light: abrir la web en light mode y comprobar
      que los enlaces de navegación (sidebar, breadcrumb, paginación) son legibles

### C3 · GlossaryLink.module.css — Refinado
- [ ] Reemplazar src/components/GlossaryLink.module.css con batch-c/...
- [ ] Verificar en un capítulo con muchos GlossaryLinks (ej. capítulo de análisis):
      el texto debe sentirse más limpio, sin el forest de '⊙' ni negritas
- [ ] Verificar con teclado: Tab hasta un GlossaryLink → debe verse el focus ring

---

## POST-DEPLOY: MÉTRICAS A VALIDAR

### Rendimiento (WebPageTest o Lighthouse CI)
- [ ] Speed Index: objetivo < 3.000 ms (actual: 6.671 ms)
- [ ] Fully Loaded: objetivo < 5.000 ms (actual: 10.865 ms)
- [ ] Peso transferido: objetivo < 1.5 MB (actual: 4.9 MB)

### Accesibilidad
- [ ] Ratio de contraste en light mode: > 4.5:1 (actual: 1.37)
      Herramienta: https://webaim.org/resources/contrastchecker/
      Color foreground: hsl(190 100% 28%) = #008ea0
      Color background: hsl(220 20% 97%) = #f5f6f8
      Resultado esperado: ~5.2:1 ✓

### Seguridad
- [ ] https://securityheaders.com: objetivo grade A o B

---

## COMANDOS ÚTILES

# Ver qué dependencias realmente importan los archivos:
node scripts/audit-deps.mjs

# Build local para verificar antes de push:
npm run build && npm run serve

# Analizar bundle tras eliminar dependencias:
npx webpack-bundle-analyzer build/assets/js/*.js

# Lighthouse en local:
npx lhci autorun --collect.url=http://localhost:3000
