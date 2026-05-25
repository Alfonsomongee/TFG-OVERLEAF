# Bloque 1: KPI Dashboard — Apagón Ibérico 28-A

## Estructura

```
bloque-1-kpi-dashboard/
├── index.html       (Fragment HTML con estructura semántica)
├── styles.css       (Grid responsivo + transiciones)
├── script.js        (Eventos mouse/touch + tooltips dinámicos)
├── data.js          (Array KPI_DATA con 6 métricas)
└── README.md        (Esta documentación)
```

## Instalación

1. **Copia la carpeta** a tu proyecto Docusaurus o abre `index.html` directamente en el navegador.
2. **Asegúrate de incluir** `styles.css` en el HTML principal o importarla en tu bundler.
3. **Los scripts son módulos ES6**, así que requieren un bundler (Webpack, Vite, etc.) o un servidor local.

Para desarrollo rápido, usa un servidor HTTP local:
```bash
python3 -m http.server 8000
# Luego abre http://localhost:8000/bloque-1-kpi-dashboard/
```

## Datos

### Estructura de KPI_DATA

Cada objeto en `data.js` contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único (duration, load, population, etc.) |
| `label` | string | Etiqueta uppercase de la tarjeta |
| `value` | string | Valor numérico formateado (27 s, ~31 GW, ~55 M, etc.) |
| `context` | string | Línea de contexto/fuente secundaria |
| `source` | string | Fuente del dato (aparece en tooltip) |
| `color` | string | Clase CSS (red, amber, green) |

### Distribución de Colores

- **Rojo (#E24B4A)**: 3 tarjetas (Duración, Carga, Fallecidos) — Crítico
- **Ámbar (#EF9F27)**: 2 tarjetas (Población, Pérdidas) — Aviso
- **Verde (#1D9E75)**: 1 tarjeta (Reposición) — Recuperación

Proporción: 50% crítico, 33% aviso, 17% recuperación.

## Interactividad

### Desktop (con mouse)

- **mouseenter**: Tooltip aparece con transición (opacity 0→1, 120ms)
- **mouseleave**: Tooltip desaparece (opacity 1→0, 120ms)
- **Borde y fondo**: Suave transición al hover (180ms ease)

### Mobile (touch)

- **touchstart**: Toggle del tooltip (tap una vez para mostrar, tap otra para ocultar)
- **preventDefault()**: Evita delay de 300ms del navegador
- Comportamiento: sin hover disponible, así que los tooltips se controlan manualmente

### Transiciones

```css
--transition-fast: 120ms ease;    /* Tooltip opacity/visibility */
--transition-base: 180ms ease;    /* Borde/fondo de tarjeta */
```

## Personalización

### Cambiar Breakpoints

En `styles.css`, modifica los media queries:

```css
@media (min-width: 640px) { /* Cambia este valor */ }
@media (min-width: 960px) { /* Y este */ }
```

Actualmente:
- Mobile: < 640px (1 columna)
- Tablet: 640px–959px (2 columnas)
- Desktop: ≥ 960px (3 columnas)

### Cambiar Colores Semánticos

En `styles.css`, busca:

```css
.kpi-card.red { border-left-color: #E24B4A; }
.kpi-card.amber { border-left-color: #EF9F27; }
.kpi-card.green { border-left-color: #1D9E75; }
```

Actualiza los valores hex según necesites.

### Cambiar Datos

En `data.js`, edita el array `KPI_DATA`:

```javascript
export const KPI_DATA = [
  {
    id: 'my-metric',
    label: 'MI MÉTRICA',
    value: '123',
    context: 'Contexto aquí',
    source: 'Fuente aquí',
    color: 'red'  // red, amber, green
  },
  // ...
];
```

## Notas Técnicas

### Cálculo de Altura de Tarjeta

```
Padding top:      12px
Label (11px):     16.5px (line-height 1.5)
Gap:              8px
Value (24px):     28.8px (line-height 1.2)
Gap:              8px
Context (11px):   16.5px (line-height 1.5)
Padding bottom:   12px
─────────────────────
Total:            ~102px (establecido como min-height)
```

### Ratio Tipográfico

- Value / Label = 24px / 11px = **2.18×** (escala armónica)
- Label / Context = 11px / 11px = 1.0× (misma altura)

### Detección de Dispositivo

El script usa `matchMedia('(hover: none)')` para detectar si el dispositivo soporta hover:
- **Desktop**: `matchMedia` retorna false → usa mouseenter/mouseleave
- **Mobile**: `matchMedia` retorna true → usa touchstart con toggle

### Accesibilidad

- `aria-label` en cada tarjeta: `"DURACIÓN DEL COLAPSO: 27 s"`
- `role="tooltip"` en tooltips
- `title` en tooltips como fallback

### Performance

- **Event delegation**: No se usa (solo 6 tarjetas)
- **Transiciones GPU**: Usa `opacity` + `visibility` (no transform ni reflow)
- **No DOM mutations peligrosas**: Todas las operaciones son append seguro

## Integración en Docusaurus

Para usar este bloque en Docusaurus:

### Opción 1: Como Fragment HTML

```jsx
// En docs/my-doc.mdx
import KPIDashboard from '@site/static/bloque-1-kpi-dashboard/index.html';

<KPIDashboard />
```

### Opción 2: Como Componente React

Crea `KPIDashboardComponent.jsx`:

```jsx
import { useEffect, useRef } from 'react';
import { initKPIDashboard } from '@site/static/bloque-1-kpi-dashboard/script.js';
import KPI_DATA from '@site/static/bloque-1-kpi-dashboard/data.js';
import '@site/static/bloque-1-kpi-dashboard/styles.css';

export default function KPIDashboard() {
  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current) {
      initKPIDashboard(gridRef.current, KPI_DATA);
    }
  }, []);

  return (
    <div className="kpi-dashboard">
      <div className="kpi-grid" ref={gridRef}></div>
      <footer className="kpi-footer">
        <p>Fuentes: ENTSO-E Final Report (mar. 2026) · CEOE (abr. 2025) · Comité 28-A / MITECO (jun. 2025)</p>
      </footer>
    </div>
  );
}
```

## Troubleshooting

### Tooltips no aparecen

- Verifica que `styles.css` se importa correctamente
- Comprueba que el z-index es suficiente (10+)
- En mobile, toca la tarjeta primero para mostrar el tooltip

### Responsive no funciona

- Abre DevTools (F12) → Modo responsive
- Verifica que los media queries se aplican (usa Inspector de estilos)
- Recarga la página con Ctrl+Shift+R (hard refresh)

### Scripts no cargan (módulos ES6)

- Asegúrate de que usas `<script type="module">` en index.html
- Sirve la carpeta desde un servidor HTTP, no desde file://
- Si usas bundler (Webpack/Vite), importa como módulo ESM

## Próximos Bloques

Este patrón se repetirá en bloques 2–6:
- **Bloque 2**: Gráficas (donut + tabla)
- **Bloque 3**: Timeline del colapso
- **Bloque 4**: Curva de frecuencia interactiva
- **Bloque 5**: Interconexiones (bar chart)
- **Bloque 6**: Cronología de reposición

Cada uno tendrá la misma estructura modular: index.html + styles.css + script.js + data.js + README.md.

---

**Última actualización**: 25 de mayo de 2026  
**Versión**: 1.0  
**Licencia**: CC0 (Público)
