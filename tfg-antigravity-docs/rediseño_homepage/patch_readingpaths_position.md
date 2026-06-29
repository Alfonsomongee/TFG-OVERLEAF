# HomeReadingPaths.module.css — Patch position:relative en .card
# 1 str_replace

---

## CAMBIO · Añadir position: relative explícito al .card

BUSCAR dentro de .card (el bloque tiene muchas propiedades — buscar
la línea display:flex que es única en ese bloque):
```css
.card {
  padding: 1.75rem !important;
  border: 1px solid rgba(107, 16, 36, 0.10);
  border-radius: 8px !important;
  background: color-mix(in srgb, var(--ifm-background-color) 94%, #6B1024 6%) !important;
  display: flex;
```

REEMPLAZAR CON (añadir position: relative):
```css
.card {
  position: relative;
  padding: 1.75rem !important;
  border: 1px solid rgba(107, 16, 36, 0.10);
  border-radius: 8px !important;
  background: color-mix(in srgb, var(--ifm-background-color) 94%, #6B1024 6%) !important;
  display: flex;
```

RAZÓN: Los pseudo-elementos ::before y ::after de .card usan
position: absolute para los corner brackets decorativos.
Sin position: relative explícito en .card, dependen de que
SpotlightCard (componente externo) lo establezca internamente.
