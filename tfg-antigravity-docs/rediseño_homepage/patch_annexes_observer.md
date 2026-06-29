# HomeAnnexes — Patch IntersectionObserver para animación de entrada
# Cambios en HomeAnnexes.jsx y HomeAnnexes.module.css

---

## CAMBIO 1 · HomeAnnexes.jsx — añadir useEffect con IntersectionObserver

BUSCAR el import actual:
```jsx
import React from 'react';
```

REEMPLAZAR CON:
```jsx
import React, { useRef, useEffect } from 'react';
```

BUSCAR dentro del componente, antes del return, la línea:
```jsx
  const handleLinkClick = () => {
```

AÑADIR ANTES de esa línea:
```jsx
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          grid.classList.add('annexGridVisible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

```

BUSCAR la línea del div grid:
```jsx
        <div className={styles.grid}>
```

REEMPLAZAR CON:
```jsx
        <div className={styles.grid} ref={gridRef}>
```

---

## CAMBIO 2 · HomeAnnexes.module.css — mover animación a clase activada por JS

BUSCAR y ELIMINAR estas reglas de animación estáticas:
```css
.card {
  ...
  opacity: 0;
  animation: annexCardIn 0.4s ease forwards;
}

.card:nth-child(1)  { animation-delay: 0s; }
.card:nth-child(2)  { animation-delay: 0.04s; }
.card:nth-child(3)  { animation-delay: 0.08s; }
.card:nth-child(4)  { animation-delay: 0.12s; }
.card:nth-child(5)  { animation-delay: 0.16s; }
.card:nth-child(6)  { animation-delay: 0.20s; }
.card:nth-child(7)  { animation-delay: 0.24s; }
.card:nth-child(8)  { animation-delay: 0.28s; }
.card:nth-child(9)  { animation-delay: 0.32s; }
.card:nth-child(10) { animation-delay: 0.36s; }
```

REEMPLAZAR .card (quitar opacity:0 y animation, mantener el resto):
La regla .card debe conservar todo lo que tenía EXCEPTO opacity:0 y animation.
Añadir en su lugar: opacity: 1 (valor por defecto, sin animación propia).

AÑADIR después del bloque .card estas nuevas reglas:
```css
:global(.annexGridVisible) .card {
  animation: annexCardIn 0.4s ease forwards;
}

:global(.annexGridVisible) .card:nth-child(1)  { animation-delay: 0s; }
:global(.annexGridVisible) .card:nth-child(2)  { animation-delay: 0.04s; }
:global(.annexGridVisible) .card:nth-child(3)  { animation-delay: 0.08s; }
:global(.annexGridVisible) .card:nth-child(4)  { animation-delay: 0.12s; }
:global(.annexGridVisible) .card:nth-child(5)  { animation-delay: 0.16s; }
:global(.annexGridVisible) .card:nth-child(6)  { animation-delay: 0.20s; }
:global(.annexGridVisible) .card:nth-child(7)  { animation-delay: 0.24s; }
:global(.annexGridVisible) .card:nth-child(8)  { animation-delay: 0.28s; }
:global(.annexGridVisible) .card:nth-child(9)  { animation-delay: 0.32s; }
:global(.annexGridVisible) .card:nth-child(10) { animation-delay: 0.36s; }
```

Y en el bloque prefers-reduced-motion, REEMPLAZAR:
```css
  .card,
  .card::before {
    transition: none;
    animation: none;
    opacity: 1;
  }
```
CON:
```css
  .card,
  .card::before {
    transition: none;
    animation: none !important;
    opacity: 1 !important;
  }
```

RAZÓN: Con :global(.annexGridVisible), la animación solo dispara cuando
el grid entra en el viewport. Sin el observer, las 10 tarjetas animaban
en el load inicial aunque estuvieran fuera de pantalla.
