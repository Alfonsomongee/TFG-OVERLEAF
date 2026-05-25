# Bloque 2: Mix de Generación — Apagón Ibérico 28-A

## Estructura

```
bloque-2-mix-generacion/
├── index.html       (Fragment HTML con gráfico donut + tabla)
├── styles.css       (Grid responsivo 2 cols → 1 col)
├── script.js        (Inicialización Chart.js + tabla dinámica)
├── data.js          (Array GENERATION_DATA con 5 tecnologías)
└── README.md        (Esta documentación)
```

## Instalación

1. **Asegúrate de que Chart.js está disponible:**
   - El script carga desde CDN: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
   - O instala localmente: `npm install chart.js`

2. **Copia la carpeta** a tu proyecto o sirve desde servidor HTTP local.

## Datos

### Estructura de GENERATION_DATA

Cada objeto contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador (solar, nuclear, wind, hydro, ccgt) |
| `name` | string | Nombre de la tecnología |
| `mw` | number | Megavatios generados |
| `percentage` | number | Porcentaje del total (0–100) |
| `color` | string | Color hex para gráfico y tabla |

### Valores Actuales

- **Solar fotovoltaica**: 19.155 MW (65%)
- **Nuclear**: 3.870 MW (13%)
- **Eólica**: 3.540 MW (12%)
- **Hidráulica**: ~2.000 MW (7%)
- **CCGT (gas)**: ~990 MW (3%)
- **Total**: ~29.555 MW

## Componentes

### Donut Chart (Chart.js)

- **Tipo**: Doughnut con cutout 65%
- **Centro**: Texto dual (GW grande + etiqueta pequeña)
- **Leyenda**: HTML personalizada encima (no la de Chart.js)
- **Tooltips**: Oscuros con bordes, muestran "Tecnología: MW"

### Tabla de Desglose

Grid con 3 columnas:
1. **Tecnología**: Nombre (12px bold)
2. **Barra horizontal**: Ancho proporcional al porcentaje
3. **Valor + %**: MW a la izquierda, % en negrita a la derecha

### Caja de Alerta

- Borde izquierdo 3px rojo (#E24B4A)
- Fondo semitransparente rojo
- Icono ⚠ + texto explicativo
- Resalta el 82% de generación con electrónica de potencia

## Responsive

- **Desktop (≥960px)**: Grid 2 cols (gráfico | tabla)
- **Tablet/Mobile (<960px)**: Stack vertical (gráfico encima)

## Personalización

### Cambiar Datos

En `data.js`, edita `GENERATION_DATA`:

```javascript
{
  id: 'my-tech',
  name: 'Mi tecnología',
  mw: 5000,
  percentage: 20,
  color: '#FF0000'
}
```

### Cambiar Colores

En `styles.css`, busca las clases `.solar`, `.nuclear`, etc.:

```css
.legend-item.solar .legend-color {
  background: #EF9F27;  /* Cambia este valor */
}
```

### Ajustar Breakpoint Responsivo

En `styles.css`, modifica:

```css
@media (max-width: 959px) {  /* Cambia este valor */
  .generation-container {
    grid-template-columns: 1fr;
  }
}
```

## Notas Técnicas

### Chart.js Plugin Customizado

El plugin `textCenter` dibuja texto en el centro del donut:

```javascript
plugins: [{
  id: 'textCenter',
  beforeDatasetsDraw(chart) {
    // Dibuja "~29,6 GW" y "generación" en el centro
  }
}]
```

### Cálculo de Ancho de Barra

Las barras horizontales escalan proporcionalmente:

```javascript
bar.style.width = `${(item.mw / total) * 100}%`;
```

Donde `total = 29.555 MW`.

### Ratio Tipográfico

- Donut: 18px (GW) + 11px (etiqueta)
- Tabla: 12px (tech) + 11px (valores)

### Accesibilidad

- Tooltips en Chart.js
- Canvas con contexto 2D accesible
- Colores de alto contraste en modo oscuro

## Integración en Docusaurus

### Opción 1: Fragment HTML

```jsx
// docs/my-doc.mdx
import GenerationMix from '@site/static/bloque-2-mix-generacion/index.html';

<GenerationMix />
```

### Opción 2: Componente React

```jsx
import { useEffect, useRef } from 'react';
import { initGenerationChart, initTableRows } from '@site/static/bloque-2-mix-generacion/script.js';
import GENERATION_DATA from '@site/static/bloque-2-mix-generacion/data.js';
import '@site/static/bloque-2-mix-generacion/styles.css';

export default function GenerationMix() {
  const canvasRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && tableRef.current) {
      initGenerationChart(canvasRef.current.id, GENERATION_DATA);
      initTableRows(tableRef.current, GENERATION_DATA);
    }
  }, []);

  return (
    <div className="generation-mix">
      {/* Contenido del bloque */}
    </div>
  );
}
```

## Troubleshooting

### Chart.js no carga

- Verifica que CDN está accesible (npm install como alternativa)
- Abre DevTools → Network, busca chart.min.js
- Espera a que se cargue antes de inicializar

### Barras no se ven

- Comprueba que `GENERATION_DATA` tiene valores válidos en `mw`
- Verifica que los porcentajes suman ~100%

### Texto en el centro del donut no aparece

- Asegúrate de que el plugin `textCenter` se inicializa
- Comprueba que `cutout: '65%'` deja espacio suficiente

---

**Última actualización**: 25 de mayo de 2026  
**Versión**: 1.0  
**Licencia**: CC0 (Público)
