# Bloque 3: Cronología del Colapso — Apagón Ibérico 28-A

## Estructura

```
bloque-3-cronologia-colapso/
├── index.html       (Fragment HTML con timeline + panel de detalle)
├── styles.css       (Barra de progreso + eventos interactivos)
├── script.js        (Lógica de selección de eventos + navegación)
├── data.js          (Array TIMELINE_EVENTS con 6 eventos)
└── README.md        (Esta documentación)
```

## Instalación

1. **Copia la carpeta** a tu proyecto o sirve desde servidor HTTP local.
2. **Los scripts son módulos ES6**, así que requieren un bundler o servidor.

Para desarrollo rápido:
```bash
python3 -m http.server 8000
# Luego abre http://localhost:8000/bloque-3-cronologia-colapso/
```

## Datos

### Estructura de TIMELINE_EVENTS

Cada evento contiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | Identificador único (e1–e6) |
| `timestamp` | number | Tiempo en segundos (0–27) |
| `timeISO` | string | Timestamp en formato HH:MM:SS.mmm CEST |
| `color` | string | Color hex para marcador y panel |
| `title` | string | Título del evento |
| `detail` | string | Descripción técnica detallada |
| `mwLost` | number | Potencia perdida en este evento |
| `mwAccum` | number | Potencia acumulada hasta este evento |

### Los 6 Eventos

1. **t=0.0s** — G-1 Granada (transformador 400/220 kV) — **−355 MW**
2. **t=19.34s** — G-2 Badajoz (CSP + FV) — **−727 MW**
3. **t=20.56s** — G-3 Cascada Sevilla/Huelva/Cáceres/Segovia/Badajoz — **−1.150 MW**
4. **t=23.53s** — Aislamiento de Iberia (trip AC Francia) — **0 MW** (pérdida de importación)
5. **t=25.88s** — Nadir de frecuencia (47,79 Hz) — **0 MW** (colapso de nucleares)
6. **t=27.18s** — Cero eléctrico (colapso total) — **−31 GW**

**Pérdida total acumulada**: ~31 GW

## Componentes

### Timeline Bar (Barra de Progreso)

- **Ancho total**: 27 segundos
- **Marcadores**: Puntos circulares en cada evento
- **Colores semánticos**: Ámbar (e1), Rojo (e2, e3, e6), Azul (e4), Morado (e5)
- **Interactividad**: Click en marcador → selecciona evento
- **Animación activa**: Marcador activo se agranda (12px → 18px)

### Panel de Detalle

- **Borde izquierdo 3px**: Color del evento activo
- **Contenido**: Título + timestamp + descripción técnica + pérdida acumulada
- **Transición**: 180ms smooth al cambiar evento
- **Altura mínima**: 140px

### Contador de Potencia Perdida

- **Formato**: "−X.XXX MW" en 22px monospace rojo
- **Ubicación**: Dentro del panel de detalle
- **Actualización**: Dinámica al cambiar evento

### Botones de Navegación

- **Anterior / Siguiente**: Navegación entre eventos
- **Deshabilitados**: En primer/último evento
- **Transición**: Smooth en estados hover/disabled

### Teclado

- **← Flecha izquierda**: Evento anterior
- **→ Flecha derecha**: Evento siguiente

## Responsive

- **Desktop (≥640px)**: Barra completa + botones + panel detalle
- **Mobile (<640px)**: Marcadores más pequeños (10px → 14px active)

## Personalización

### Cambiar Eventos

En `data.js`, edita `TIMELINE_EVENTS`:

```javascript
{
  id: 'e7',
  timestamp: 15.5,
  timeISO: '12:33:12.500',
  color: '#FF6B00',
  title: 'Mi evento',
  detail: 'Descripción técnica...',
  mwLost: 500,
  mwAccum: 3500
}
```

### Cambiar Duración Total

En `data.js`, modifica `TIMELINE_CONFIG.totalDuration`:

```javascript
totalDuration: 35  // 35 segundos en lugar de 27
```

### Cambiar Colores

En `styles.css`, busca `.timeline-event-marker.e1`, etc.:

```css
.timeline-event-marker.e1 {
  background: #FF0000;  /* Nuevo color */
}
```

## Notas Técnicas

### Cálculo de Posición de Marcador

```javascript
const percentage = (event.timestamp / config.totalDuration) * 100;
marker.style.left = `${percentage}%`;
```

Ejemplo: evento en t=13.5s, duración total 27s:
- Posición = (13.5 / 27) × 100 = 50%

### Transiciones Suaves

- **Marcador active**: width/height en 120ms
- **Panel detalle**: all en 180ms
- **Botones nav**: all en 180ms

### Accesibilidad

- `title` en marcadores (tooltip nativo)
- Navegación con teclado (← / →)
- Alto contraste en modo oscuro

## Integración en Docusaurus

### Opción 1: Fragment HTML

```jsx
// docs/my-doc.mdx
import Timeline from '@site/static/bloque-3-cronologia-colapso/index.html';

<Timeline />
```

### Opción 2: Componente React

```jsx
import { useEffect } from 'react';
import { initTimeline } from '@site/static/bloque-3-cronologia-colapso/script.js';
import { TIMELINE_EVENTS, TIMELINE_CONFIG } from '@site/static/bloque-3-cronologia-colapso/data.js';
import '@site/static/bloque-3-cronologia-colapso/styles.css';

export default function Timeline() {
  useEffect(() => {
    initTimeline(TIMELINE_EVENTS, TIMELINE_CONFIG);
  }, []);

  return (
    <div className="timeline-container">
      {/* Contenido del bloque */}
    </div>
  );
}
```

## Troubleshooting

### Marcadores no se ven

- Verifica que `TIMELINE_EVENTS` tiene valores válidos en `timestamp`
- Abre DevTools → Elementos, busca `.timeline-event-marker`
- Comprueba que `styles.css` se importa correctamente

### Click en marcadores no funciona

- Asegúrate de que `script.js` se carga como módulo ES6
- Verifica que `initTimeline()` se llama en `DOMContentLoaded`
- Abre DevTools → Console, busca errores de importación

### Navegación con teclado no funciona

- Asegúrate de que el evento `keydown` se escucha en `document`
- Verifica que el foco está en la ventana del navegador

---

**Última actualización**: 25 de mayo de 2026  
**Versión**: 1.0  
**Licencia**: CC0 (Público)
