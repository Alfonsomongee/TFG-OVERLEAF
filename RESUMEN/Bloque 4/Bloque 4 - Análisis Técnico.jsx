/**
 * BLOQUE 4: CURVA DE FRECUENCIA INTERACTIVA
 * Análisis técnico y JSX de arquitectura
 * 
 * Apagón Ibérico del 28 de abril de 2025
 * Sistema ibérico peninsular · 12:32:55 a 12:33:30 CEST
 */

// ============================================================================
// 1. ESTRUCTURA DE DATOS
// ============================================================================

const FREQUENCY_DATA = {
  // 15 puntos de medición PMU (Phasor Measurement Units)
  frequencies: [
    { t: -2.0, f: 50.00 },    // Línea base pre-incidente
    { t: 0.0, f: 50.02 },     // t=0: G-1 Granada dispara
    { t: 2.0, f: 49.95 },
    { t: 5.0, f: 49.87 },
    { t: 10.0, f: 49.75 },
    { t: 15.0, f: 49.62 },
    { t: 19.34, f: 49.45 },   // t=19.34s: G-2 Badajoz desconecta
    { t: 20.0, f: 49.20 },
    { t: 20.56, f: 48.95 },   // t=20.56s: G-3 Cascada SW
    { t: 22.0, f: 48.70 },
    { t: 23.53, f: 48.46 },   // t=23.53s: Trip FR AC tie-line
    { t: 25.0, f: 48.15 },
    { t: 25.88, f: 47.79 },   // t=25.88s: NADIR (mínimo)
    { t: 27.0, f: 47.50 },
    { t: 33.0, f: 47.50 }     // Sistema colapsado
  ],

  // 5 eventos críticos marcados con scatter points
  events: [
    {
      t: 0.0,
      f: 50.02,
      label: 'G-1 · Granada',
      desc: 'Disparo transformador 400/220 kV (−355 MW)',
      color: '#EF9F27'
    },
    {
      t: 19.34,
      f: 49.45,
      label: 'G-2 · Badajoz',
      desc: 'Desconexión CSP + FV (−727 MW)',
      color: '#E24B4A'
    },
    {
      t: 20.56,
      f: 48.95,
      label: 'G-3 · SW',
      desc: 'Cascada 5 provincias (−1.150 MW)',
      color: '#E24B4A'
    },
    {
      t: 23.53,
      f: 48.46,
      label: 'Trip FR',
      desc: 'Aislamiento de Iberia (pérdida importación)',
      color: '#378ADD'
    },
    {
      t: 25.88,
      f: 47.79,
      label: 'Nadir',
      desc: 'Mínimo de frecuencia (47,79 Hz)',
      color: '#9F3EFF'
    }
  ],

  // 5 umbrales UFLS (Under-Frequency Load Shedding)
  thresholds: [
    { value: 49.5, label: 'UFLS Stage 1', color: '#EF9F27' },
    { value: 49.0, label: 'UFLS Stage 2', color: '#EF9F27' },
    { value: 48.5, label: 'UFLS Stage 3', color: '#E24B4A' },
    { value: 48.0, label: 'UFLS Stage 4', color: '#E24B4A' },
    { value: 47.5, label: 'Collapse', color: '#E24B4A' }
  ],

  timeRange: { min: -2, max: 33 }
};

// ============================================================================
// 2. INTERPOLACIÓN LINEAL
// ============================================================================

/**
 * Interpola frecuencia entre dos puntos PMU
 * 
 * Dado: t ∈ [t₀, t₁], f(t₀) = f₀, f(t₁) = f₁
 * Retorna: f(t) = f₀ + (f₁ − f₀) × (t − t₀) / (t₁ − t₀)
 * 
 * Resolución: 0.1s (10 puntos por segundo)
 * Rango: −2 a 33 segundos (35 segundos totales)
 */
function interpolateFrequency(t) {
  const freqs = FREQUENCY_DATA.frequencies;
  const idx = freqs.findIndex(d => d.t >= t);

  if (idx === 0) return freqs[0].f;
  if (idx === -1) return freqs[freqs.length - 1].f;

  const p0 = freqs[idx - 1];
  const p1 = freqs[idx];
  const alpha = (t - p0.t) / (p1.t - p0.t);

  return p0.f + (p1.f - p0.f) * alpha;
}

// ============================================================================
// 3. PROGRESIÓN DE COLOR BLANCO → ROJO
// ============================================================================

/**
 * Mapea progreso [0, 1] a transición de color RGB
 * 
 * Inicio (0%):   RGB(255, 255, 255) = Blanco
 * Final (100%):  RGB(226, 75, 74)   = Rojo (#E24B4A)
 * 
 * Fórmula: c(p) = c_inicio + (c_final − c_inicio) × p
 */
function getProgressColor(progress) {
  const p = Math.max(0, Math.min(1, progress));
  const r = Math.round(255 + (226 - 255) * p);
  const g = Math.round(255 + (75 - 255) * p);
  const b = Math.round(255 + (74 - 255) * p);

  return `rgb(${r}, ${g}, ${b})`;
}

// Ejemplos:
// progress = 0.0  → rgb(255, 255, 255) = Blanco puro
// progress = 0.5  → rgb(240, 165, 164) = Rosa/melocotón
// progress = 1.0  → rgb(226, 75, 74)   = Rojo brillante

// ============================================================================
// 4. CÁLCULO DE ROCOF (Rate of Change of Frequency)
// ============================================================================

/**
 * ROCOF = df/dt (Hz/segundo)
 * 
 * Derivada numérica central:
 * ROCOF(t) ≈ [f(t + Δt) − f(t − Δt)] / (2 × Δt)
 * 
 * Clasificación de severidad:
 * - Verde:    |ROCOF| < 0.05 Hz/s  (cambio gradual, normal)
 * - Ámbar:    0.05 ≤ |ROCOF| < 0.25 Hz/s (cambio moderado, alerta)
 * - Rojo:     |ROCOF| ≥ 0.25 Hz/s  (cambio rápido, crítico)
 * 
 * En el incidente del 28-A:
 * - ROCOF máximo: ~−0.45 Hz/s @ t=25.5s (caída libre)
 */
function getROCOFColor(rocof) {
  const absRocof = Math.abs(rocof);

  if (absRocof < 0.05) return '#1D9E75';       // Verde (estable)
  if (absRocof < 0.25) return '#EF9F27';       // Ámbar (alerta)
  return '#E24B4A';                             // Rojo (crítico)
}

// ============================================================================
// 5. PLUGINS DE CHART.JS
// ============================================================================

/**
 * PLUGIN 1: Línea progresiva interpolada
 * 
 * Dibuja la línea de frecuencia desde t_inicio hasta currentT
 * actualizando el color dinámicamente en cada frame
 */
const progressiveLinePlugin = {
  id: 'progressiveLine',
  afterDatasetsDraw(chart) {
    if (currentT < -2) return;

    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    const ctx = chart.ctx;

    // Generar puntos interpolados cada 0.1s
    const points = [];
    for (let t = -2; t <= Math.min(currentT, 33); t += 0.1) {
      const f = interpolateFrequency(t);
      points.push({ t, f });
    }

    if (points.length < 2) return;

    // Color progresivo blanco → rojo
    const progress = Math.max(0, Math.min(1, (currentT + 2) / 35));
    const color = getProgressColor(progress);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();

    for (let i = 0; i < points.length; i++) {
      const x = xScale.getPixelForValue(points[i].t);
      const y = yScale.getPixelForValue(points[i].f);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
};

/**
 * PLUGIN 2: Crosshair dinámico
 * 
 * - Línea horizontal blanca: sobre la que se desplaza el punto
 * - Línea vertical punteada gris: referencia temporal
 * - Punto amarillo: marca la intersección (t, f(t))
 */
const crosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw(chart) {
    if (currentT < -2 || currentT > 33) return;

    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    const f = interpolateFrequency(currentT);
    const xPos = xScale.getPixelForValue(currentT);
    const yPos = yScale.getPixelForValue(f);
    const ctx = chart.ctx;

    ctx.save();

    // Línea horizontal blanca
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(xScale.left, yPos);
    ctx.lineTo(xScale.right, yPos);
    ctx.stroke();

    // Línea vertical punteada
    ctx.strokeStyle = 'rgba(176, 176, 176, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xPos, yScale.top);
    ctx.lineTo(xPos, yScale.bottom);
    ctx.stroke();

    // Punto amarillo
    ctx.fillStyle = '#EF9F27';
    ctx.beginPath();
    ctx.arc(xPos, yPos, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
};

/**
 * PLUGIN 3: Zona de colapso
 * 
 * Fondo rojo semitransparente debajo de 47.5 Hz
 * Indica la región donde el sistema colapsa
 */
const collapseZonePlugin = {
  id: 'collapseZone',
  afterDatasetsDraw(chart) {
    const yScale = chart.scales.y;
    const collapsePixelY = yScale.getPixelForValue(47.5);
    const ctx = chart.ctx;

    ctx.save();
    ctx.fillStyle = 'rgba(226, 75, 74, 0.15)';
    ctx.fillRect(yScale.left, collapsePixelY, yScale.width, yScale.bottom - collapsePixelY);
    ctx.restore();
  }
};

// ============================================================================
// 6. CONFIGURACIÓN DE REPLAY
// ============================================================================

const REPLAY_CONFIG = {
  duration: 60000,  // 60 segundos (configurable)
  speeds: {
    '1x': 1,
    '2x': 2,
    '5x': 5
  }
};

/**
 * Animación de replay: mapea tiempo real a tiempo simulado
 * 
 * Dado: elapsed ∈ [0, duration] (tiempo real)
 * Retorna: t ∈ [−2, 33] (tiempo simulado)
 * 
 * Fórmula: t = t_min + progress × (t_max − t_min)
 * donde progress = elapsed / duration
 */
function startReplay(speedMultiplier = 1) {
  const startTime = performance.now();
  const actualDuration = REPLAY_CONFIG.duration / speedMultiplier;

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / actualDuration, 1);
    const t = -2 + progress * 35;

    updateChart(t);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// ============================================================================
// 7. DETECCIÓN DE EVENTOS
// ============================================================================

/**
 * Encuentra el evento más cercano a tiempo t
 * 
 * Tolerancia: ±0.8 segundos
 * Si hay coincidencia, muestra tarjeta de evento
 */
function findNearestEvent(t, tolerance = 0.8) {
  return FREQUENCY_DATA.events.find(e => Math.abs(e.t - t) <= tolerance);
}

/**
 * Detección de colapso del sistema
 * 
 * Condiciones:
 * - f(t) ≤ 47.5 Hz (frecuencia mínima de colapso)
 * - t ≥ 25.88s (después del nadir, cuando relés de desconexión se activan)
 */
function detectCollapse(t) {
  const f = interpolateFrequency(t);
  return f <= 47.5 && t >= 25.88;
}

// ============================================================================
// 8. INTERFAZ DE USUARIO
// ============================================================================

/**
 * Componentes dinámicos:
 * 
 * 1. Tooltip numérico (esquina inferior izquierda)
 *    - Tiempo: t (s) + HH:MM:SS CEST
 *    - Frecuencia: F (Hz)
 *    - ROCOF: df/dt (Hz/s) con color de severidad
 * 
 * 2. Tarjeta de evento (aparece/desaparece)
 *    - Título: ⚡ Nombre del evento
 *    - Descripción: Detalles técnicos
 *    - Borde coloreado según evento
 *    - Animación: slideUp 0.3s
 * 
 * 3. Popup de colapso (modal centrado)
 *    - Título grande: ⚡ COLAPSO DEL SISTEMA
 *    - Subtítulo: Frecuencia crítica alcanzada (47,5 Hz)
 *    - Fondo gradiente rojo
 *    - Animación: popup 0.4s cubic-bezier
 * 
 * 4. Slider de tiempo (mod-erno)
 *    - Barra: #404040 oscuro
 *    - Thumb: #378ADD azul + sombra
 *    - Tamaño: 16px
 *    - Responsive: 100% ancho
 * 
 * 5. Botones de replay
 *    - 1x: velocidad normal (60s)
 *    - 2x: doble velocidad (30s)
 *    - 5x: 5× velocidad (12s)
 */

// ============================================================================
// 9. RESUMEN TÉCNICO
// ============================================================================

/*
ESPECIFICACIONES DEL BLOQUE 4:

Rango temporal:         −2 a +33 segundos (t=0 = evento G-1)
Resolución PMU:         0.5–1.0 segundo (interpolado a 0.1s)
Rango de frecuencia:    46.5–50.5 Hz (zoom en zona crítica)
Interpolación:          Lineal entre 15 puntos de medición

Eventos críticos:       5 scatter points coloreados
                        - G-1 Granada (ámbar)
                        - G-2 Badajoz (rojo)
                        - G-3 Cascada SW (rojo)
                        - Trip FR AC tie-line (azul)
                        - Nadir (púrpura)

Umbrales UFLS:          5 líneas de referencia
                        - 49.5, 49.0, 48.5, 48.0, 47.5 Hz

Zona de colapso:        Rojo semitransparente < 47.5 Hz
Punto crítico (nadir):  47.79 Hz @ t=25.88s

Progresión visual:      Blanco (inicio) → Rojo (colapso)
                        Sincronizado con progreso temporal

ROCOF máximo:           −0.45 Hz/s @ t=25.5s
                        (caída libre, sin amortiguamiento)

Replay durations:       60s (1x) → 30s (2x) → 12s (5x)
*/
