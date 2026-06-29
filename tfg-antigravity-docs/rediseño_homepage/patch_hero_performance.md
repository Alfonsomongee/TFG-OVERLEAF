# HomeHero.module.css — Patch rendimiento
# Eliminar animaciones que disparan paint continuo (box-shadow + gradiente)
# 3 cambios en el mismo archivo

---

## CAMBIO 1 · Eliminar keyframe nodePulse y su uso

BUSCAR y ELIMINAR este bloque completo:
```css
@keyframes nodePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(107, 16, 36, 0.24); }
  50% { box-shadow: 0 0 0 7px rgba(107, 16, 36, 0); }
}
```

Y dentro de `.node::before`, ELIMINAR estas dos líneas:
```css
  box-shadow: 0 0 0 0 rgba(107, 16, 36, 0.28);
  animation: nodePulse 2.8s ease-in-out infinite;
  animation-delay: calc(var(--step-index) * 0.18s);
```

RAZÓN: box-shadow no puede ejecutarse en el compositor de la GPU.
Animar box-shadow en 5 elementos simultáneos dispara repaint en cada frame.
El punto de la cadena sigue siendo visible sin el pulso.

La regla .node::before queda así (sin box-shadow ni animation):
```css
.node::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6B1024;
  border: 2px solid var(--ifm-background-color);
}
```

---

## CAMBIO 2 · Eliminar metricSweep del stripItem

BUSCAR y ELIMINAR este bloque completo del .stripItem::before:
```css
.stripItem::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.42), transparent 70%);
  transform: translateX(-120%);
  opacity: 0;
}

.stripItem:hover::before {
  opacity: 1;
  animation: metricSweep 0.8s ease;
}
```

Y ELIMINAR el keyframe:
```css
@keyframes metricSweep {
  to { transform: translateX(120%); }
}
```

REEMPLAZAR el hover del strip por un cambio de opacidad simple:
```css
.stripItem:hover {
  background: rgba(107, 16, 36, 0.04);
}

html[data-theme='dark'] .stripItem:hover {
  background: rgba(192, 85, 110, 0.07);
}
```

RAZÓN: gradient animado en hover dispara composite layer promotion
involuntaria. El efecto shimmer no es necesario para la estética pericial.

---

## CAMBIO 3 · Actualizar prefers-reduced-motion tras los cambios

BUSCAR:
```css
@media (prefers-reduced-motion: reduce) {
  .chain::before,
  .node::before,
  .stripItem:hover::before {
    animation: none;
  }

  .node:hover {
    transform: none;
  }
}
```

REEMPLAZAR CON (ya no existe .node::before animation ni .stripItem::before):
```css
@media (prefers-reduced-motion: reduce) {
  .chain::before {
    animation: none;
  }

  .node:hover {
    transform: none;
  }
}
```
