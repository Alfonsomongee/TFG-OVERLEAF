# 🐛 Bug Report - Sesión Deployment Vercel

**Fecha:** 20 Mayo 2026  
**Status:** Issues Identificados - Requieren Fix

---

## Problema 1: Traducción Parcial (Solo Títulos)

### Síntomas:
- ✅ Títulos de capítulos traducen correctamente (ES → EN)
- ❌ Contenido de capítulos NO traduce (sigue en español)
- ❌ Solo la navbar y estructura se traducen

### Causa Probable:
- Los archivos de contenido en `i18n/en/docusaurus-plugin-content-docs/current/` pueden no estar siendo compilados correctamente
- O los archivos .mdx no fueron creados correctamente en la estructura i18n

### Archivo Afectados:
- `i18n/en/docusaurus-plugin-content-docs/current/01-introduccion/index.mdx`
- `i18n/en/docusaurus-plugin-content-docs/current/02-contexto.mdx` (y los demás)
- Todas las traducciones de capítulos en la carpeta i18n/en/

### Necesario:
- [ ] Verificar que los archivos .mdx en i18n/en/ existen y tienen contenido
- [ ] Verificar la configuración de i18n en docusaurus.config.js
- [ ] Posible rebuild local y redeploy

---

## Problema 2: GlossaryLink Terms No Son Clickeables

### Síntomas:
- ❌ Palabras envueltas en `<GlossaryLink>` en los capítulos no redirigen al glosario
- ❌ No hay visible link indicator o cursor de "pointer"
- ❌ Click no hace nada

### Causa Probable:
- El componente GlossaryLink.jsx está importado pero posiblemente:
  1. No está generando links correctamente
  2. Los links usan rutas incorrectas (/glosario vs /es/glosario)
  3. Los IDs del glosario no coinciden con los links generados
  3. Hay un problema con la ruta en i18n (podría ser /es/glosario en lugar de /glosario)

### Archivo Afectados:
- `src/components/GlossaryLink.jsx` - Necesita revisar cómo genera links
- Todos los archivos .mdx que usan `<GlossaryLink term="...">` 

### Link Esperado:
- En español: `/glosario#term-ibr`
- En inglés: `/en/glosario#term-ibr`

---

## Cambios Realizados en Esta Sesión

✅ **Completados correctamente:**
- GlosarioTecnico.jsx - Componente React para búsqueda de términos
- BiblioCard.jsx - Componente React para referencias
- docs/glosario.mdx - Página que integra GlosarioTecnico
- docs/referencias.mdx - Página que integra BiblioCard
- i18n/en/.../10-glosario.mdx - Versión inglés
- i18n/en/.../11-referencias.mdx - Versión inglés

❌ **Problemas Descubiertos:**
1. Traducción solo en UI, no en contenido
2. GlossaryLink terms no clickeables

---

## Próximos Pasos Necesarios

### Priority 1 (Alto - Fix GlossaryLink):
1. Revisar GlossaryLink.jsx generación de links
2. Verificar rutas considerando i18n (es / en)
3. Asegurar que los IDs en GlosarioTecnico.jsx coinciden con los generados por GlossaryLink

### Priority 2 (Alto - Fix Traducción):
1. Verificar que i18n/en/ contiene archivos .mdx con contenido
2. Revisar docusaurus.config.js i18n configuration
3. Hacer rebuild y test local
4. Redeploy a Vercel

### Priority 3 (Medio - Optimization):
1. Verificar que los componentes React importan correctamente
2. Optimize CSS para dark mode
3. Test en mobile

---

## Archivos para Investigar

```
CRÍTICOS:
├── src/components/GlossaryLink.jsx (revisar generación de links)
├── i18n/en/docusaurus-plugin-content-docs/current/ (verificar contenido)
├── docusaurus.config.js (revisar config i18n)

SECUNDARIOS:
├── src/components/GlosarioTecnico.jsx (IDs de términos)
├── docs/glosario.mdx (estructura)
└── docs/01-introduccion/index.mdx (ejemplo capítulo)
```

---

**Reporte generado automáticamente para debug**
