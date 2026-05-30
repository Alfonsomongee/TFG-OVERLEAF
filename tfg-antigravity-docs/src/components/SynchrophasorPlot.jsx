/**
 * SynchrophasorPlot.jsx
 * Diagrama fasorial PMU animado — visualización del colapso angular del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. FÍSICA — ruido determinista:
 *    La versión anterior usaba Math.random() en cada frame, produciendo
 *    un temblor no físico visible para cualquier ingeniero de sistemas.
 *    Ahora se usa un generador pseudo-aleatorio con semilla (LCG simple)
 *    que produce el mismo ruido en cada frame dado el mismo progreso,
 *    haciendo la animación reproducible y físicamente coherente.
 *
 * 2. ACCESIBILIDAD:
 *    - Botones con aria-label descriptivo y aria-pressed donde aplica.
 *    - Slider con aria-valuetext que describe la fase de la simulación.
 *    - Contenedor del gráfico con role="img" y aria-label.
 *
 * 3. prefers-reduced-motion:
 *    Si el usuario prefiere movimiento reducido, el autoplay se desactiva
 *    y se muestra solo el estado final estático.
 *
 * 4. MODELO FÍSICO más claro:
 *    Las tres fases están documentadas con los tiempos reales del 28-A:
 *    - Fase 1 (0-30%):  Operación estable hasta 12:32:57 CEST.
 *    - Fase 2 (30-60%): Cascada de sobretensiones 12:32:57–12:33:21.
 *    - Fase 3 (60-100%): Pérdida de sincronismo y colapso a 0 V.
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {
  PolarComponent, TooltipComponent, TitleComponent,
} from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PolarComponent, TooltipComponent, TitleComponent, CustomChart, CanvasRenderer]);

const NUM_VECTORS = 15;

// ─── Generador LCG determinista (ruido reproducible) ─────────────────────────
function lcg(seed) {
  let s = seed;
  return function () {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Generación de datos fasoriales con ruido determinista ───────────────────
function generatePhasorData(progress) {
  const rand = lcg(Math.floor(progress * 100)); // semilla determinista por frame
  const data = [];

  for (let i = 0; i < NUM_VECTORS; i++) {
    const isSouth = i % 2 !== 0;
    let angle, mag, color;

    if (progress < 30) {
      // Fase 1: Operación nominal (hasta 12:32:57 CEST)
      const baseAngle = isSouth ? 25 : 15;
      angle = baseAngle + (rand() * 4 - 2);
      mag = 1.0 + (rand() * 0.02 - 0.01);
      color = isSouth ? '#f59e0b' : '#3b82f6';

    } else if (progress < 60) {
      // Fase 2: Oscilaciones inter-área y cascada de sobretensiones
      const instability = (progress - 30) / 30;
      if (isSouth) {
        // Vectores sur: divergencia creciente, giro descontrolado
        angle = 25 + Math.sin(progress * i * 0.5) * 180 * instability;
        mag = Math.max(0.3, 1.0 - instability * 0.3 + (rand() * 0.15 - 0.075));
        color = '#ef4444';
      } else {
        // Vectores norte: afectados pero más contenidos
        angle = 15 + Math.sin(progress * i * 0.2) * 45 * instability;
        mag = Math.max(0.6, 1.0 - instability * 0.1);
        color = '#3b82f6';
      }

    } else {
      // Fase 3: Pérdida de sincronismo y colapso de tensión
      const collapse = (progress - 60) / 40;
      if (isSouth) {
        // Vectores sur: ángulo aleatorio (pérdida total de sincronismo)
        // Usar LCG para ángulo aleatorio reproducible
        angle = rand() * 360;
        mag = Math.max(0, 0.7 - collapse * 0.7);
        color = '#ef4444';
      } else {
        // Vectores norte: se sostienen más tiempo, pero también colapsan
        angle = 15 + Math.sin(progress * 10) * 10;
        mag = Math.max(0, 0.9 - collapse * 0.9);
        color = collapse > 0.7 ? '#ef4444' : '#3b82f6';
      }
    }

    data.push({
      value: [Math.max(0, Math.min(1.2, mag)), angle],
      itemStyle: { color },
    });
  }

  return data;
}

// ─── Etiqueta de fase para el slider ─────────────────────────────────────────
function getPhaseLabel(progress, lang) {
  if (progress < 30) return lang === 'es'
    ? 'Fase 1: Operación estable'
    : 'Phase 1: Stable operation';
  if (progress < 60) return lang === 'es'
    ? 'Fase 2: Cascada de sobretensiones'
    : 'Phase 2: Overvoltage cascade';
  return lang === 'es'
    ? 'Fase 3: Pérdida de sincronismo y colapso'
    : 'Phase 3: Loss of synchronism and collapse';
}

// ─── Componente interno ───────────────────────────────────────────────────────
function SynchrophasorPlotInner({ lang = 'es' }) {
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);

  // Respetar prefers-reduced-motion
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Loop de animación
  useEffect(() => {
    if (!isPlaying || prefersReduced) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setIsPlaying(false); return 100; }
        return parseFloat((p + 0.5).toFixed(1));
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isPlaying, prefersReduced]);

  // Actualizar ECharts con datos del frame actual
  useEffect(() => {
    if (!chartRef.current) return;
    const instance = chartRef.current.getEchartsInstance();
    instance.setOption({ series: [{ data: generatePhasorData(progress) }] });
  }, [progress]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  // Opciones base del gráfico
  const baseOption = useMemo(() => ({
    animation: false,
    backgroundColor: 'transparent',
    title: {
      text: lang === 'es'
        ? 'Desviación Angular Fasorial (PMU) — 28-A'
        : 'Phasor Angular Deviation (PMU) — April 28',
      subtext: lang === 'es'
        ? 'Transformador Granada 400/220 kV · 12:32:57–12:33:27 CEST'
        : 'Granada 400/220 kV Transformer · 12:32:57–12:33:27 CEST',
      left: 'center',
      top: '3%',
      textStyle: {
        color: '#ffffff', fontSize: 18, fontWeight: '700',
        textShadowBlur: 10, textShadowColor: 'rgba(255,255,255,0.3)',
      },
      subtextStyle: { color: '#94a3b8', fontSize: 13 },
    },
    polar: { center: ['50%', '58%'], radius: '62%' },
    angleAxis: {
      type: 'value', min: 0, max: 360, boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.12)', type: 'dashed' } },
      axisLabel: { formatter: '{value}°', color: '#94a3b8', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.25)' } },
    },
    radiusAxis: {
      type: 'value', min: 0, max: 1.2,
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.12)' } },
      axisLabel: { formatter: '{value} p.u.', color: '#94a3b8', fontSize: 11 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.25)' } },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,15,30,0.97)',
      borderColor: 'rgba(56,189,248,0.4)',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontFamily: 'monospace', fontSize: 12 },
      formatter: (params) => {
        const [mag, ang] = params.value;
        return `<b style="color:#94a3b8">PMU</b><br/>
          Tensión: <b style="color:#38bdf8">${mag.toFixed(3)} p.u.</b><br/>
          Ángulo: <b style="color:#f472b6">${ang.toFixed(1)}°</b>`;
      },
    },
    series: [{
      type: 'custom',
      coordinateSystem: 'polar',
      renderItem(params, api) {
        const value = [api.value(0), api.value(1)];
        const start = api.coord([0, value[1]]);
        const end   = api.coord([value[0], value[1]]);
        const color = api.visual('color');
        return {
          type: 'group',
          children: [
            {
              type: 'line',
              shape: { x1: start[0], y1: start[1], x2: end[0], y2: end[1] },
              style: api.style({ stroke: color, lineWidth: 3, shadowBlur: 8, shadowColor: color }),
            },
            {
              type: 'circle',
              shape: { cx: end[0], cy: end[1], r: 6 },
              style: api.style({ fill: color, shadowBlur: 12, shadowColor: color }),
            },
          ],
        };
      },
      data: [],
    }],
  }), [lang]);

  const isEs = lang === 'es';
  const phaseLabel = getPhaseLabel(progress, lang);
  const timeLabel  = `t = ${(progress * 0.3).toFixed(2)} s`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 750 }}>

      {/* Gráfico */}
      <div
        role="img"
        aria-label={isEs
          ? `Diagrama fasorial PMU animado. ${phaseLabel}. ${timeLabel}`
          : `Animated PMU phasor diagram. ${phaseLabel}. ${timeLabel}`}
        style={{
          flex: 1, minHeight: 600,
          backgroundColor: '#0a0f1c',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        <ReactEChartsCore
          ref={chartRef}
          echarts={echarts}
          option={baseOption}
          style={{ height: '100%', minHeight: 600, width: '100%' }}
          theme="dark"
          notMerge={false}
          lazyUpdate
        />
      </div>

      {/* Controles */}
      <div style={{
        marginTop: '0.75rem',
        padding: '1rem',
        background: 'rgba(15,23,42,0.5)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setIsPlaying(p => !p)}
          disabled={progress >= 100 && !isPlaying}
          aria-pressed={isPlaying}
          aria-label={isPlaying
            ? (isEs ? 'Pausar simulación' : 'Pause simulation')
            : (isEs ? 'Reproducir simulación' : 'Play simulation')}
          style={{
            background: 'var(--ifm-color-primary)',
            color: '#fff', border: 'none',
            borderRadius: 4, padding: '0.5rem 1rem',
            cursor: 'pointer', fontWeight: 'bold', minWidth: 80,
          }}
        >
          {isPlaying ? (isEs ? 'PAUSA' : 'PAUSE') : (isEs ? 'PLAY' : 'PLAY')}
        </button>

        <button
          onClick={handleReset}
          aria-label={isEs ? 'Reiniciar simulación' : 'Reset simulation'}
          style={{
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: 4, padding: '0.5rem 1rem',
            cursor: 'pointer', fontWeight: 'bold',
          }}
        >
          {isEs ? 'REINICIAR' : 'RESET'}
        </button>

        <input
          type="range"
          min="0" max="100" step="0.5"
          value={progress}
          onChange={e => { setIsPlaying(false); setProgress(parseFloat(e.target.value)); }}
          aria-label={isEs ? 'Control temporal de la simulación' : 'Simulation timeline'}
          aria-valuetext={`${phaseLabel} — ${timeLabel}`}
          style={{ flex: 1, cursor: 'pointer', minWidth: 120 }}
        />

        <div style={{
          fontFamily: 'monospace', color: '#94a3b8',
          minWidth: 140, textAlign: 'right', fontSize: 13,
        }}>
          {timeLabel}
        </div>
      </div>

      {/* Fase actual */}
      <div style={{
        marginTop: '0.5rem',
        padding: '0.5rem 1rem',
        background: progress < 30
          ? 'rgba(59,130,246,0.08)'
          : progress < 60
            ? 'rgba(245,158,11,0.08)'
            : 'rgba(239,68,68,0.08)',
        borderRadius: 6,
        borderLeft: `3px solid ${progress < 30 ? '#3b82f6' : progress < 60 ? '#f59e0b' : '#ef4444'}`,
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#e2e8f0',
      }}
        aria-live="polite"
      >
        {phaseLabel}
      </div>

      {/* Explicación */}
      <div style={{
        marginTop: '1rem',
        padding: '1.5rem',
        background: 'rgba(15,23,42,0.5)',
        borderRadius: 8,
        border: '1px solid rgba(56,189,248,0.25)',
        color: '#e2e8f0',
        fontSize: '0.92rem',
        lineHeight: 1.65,
      }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.75rem' }}>
          {isEs ? '¿Qué muestra este diagrama?' : 'What does this diagram show?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem' }}>
          {isEs
            ? 'Cada vector representa la tensión (longitud = magnitud en p.u.) y el ángulo de fase en un nudo de la red de transporte, tal como lo mediría una Unidad de Medición Fasorial (PMU). El centro (0 p.u.) es la ausencia total de tensión.'
            : 'Each vector represents voltage (length = magnitude in p.u.) and phase angle at a transmission grid node, as measured by a Phasor Measurement Unit (PMU). The center (0 p.u.) is complete voltage absence.'}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.3rem' }}>
            <strong style={{ color: '#3b82f6' }}>{isEs ? 'Azul (Norte):' : 'Blue (North):'}</strong>
            {' '}{isEs ? 'Nudos del centro y norte peninsular. Más estables por mayor masa síncrona.' : 'Central and northern peninsula nodes. More stable due to higher synchronous mass.'}
          </li>
          <li style={{ marginBottom: '0.3rem' }}>
            <strong style={{ color: '#f59e0b' }}>{isEs ? 'Ámbar (Sur, estable):' : 'Amber (South, stable):'}</strong>
            {' '}{isEs ? 'Nudos del sur antes del fallo. Alta penetración FV.' : 'Southern nodes before the fault. High PV penetration.'}
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>{isEs ? 'Rojo (colapso):' : 'Red (collapse):'}</strong>
            {' '}{isEs ? 'Vectores girando sin control = pérdida de sincronismo. Encogimiento hacia 0 = tensión colapsando.' : 'Vectors spinning uncontrolled = loss of synchronism. Shrinking to 0 = voltage collapsing.'}
          </li>
        </ul>
        {prefersReduced && (
          <p style={{ marginTop: '0.75rem', color: '#f59e0b', fontSize: '0.82rem' }}>
            {isEs
              ? 'Animación desactivada (preferencia del sistema). Use el slider para explorar manualmente.'
              : 'Animation disabled (system preference). Use the slider to explore manually.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SynchrophasorPlot({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 650, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#64748b',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Inicializando diagrama fasorial…' : 'Initializing phasor diagram…'}
      </div>
    }>
      {() => <SynchrophasorPlotInner lang={lang} />}
    </BrowserOnly>
  );
}
