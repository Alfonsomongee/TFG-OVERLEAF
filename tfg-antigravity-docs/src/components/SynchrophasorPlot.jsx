/**
 * SynchrophasorPlot.jsx
 * Diagrama fasorial PMU animado — visualización del colapso angular del 28-A.
 *
 * MEJORAS respecto a la versión anterior (que ya tenía LCG determinista):
 *
 * 1. MODO PRESENTACIÓN — auto-pausa en hitos clave:
 *    Cuando progress alcanza 30 (inicio cascada) y 60 (pérdida sincronismo),
 *    la animación pausa automáticamente durante PAUSE_DURATION ms para que el
 *    ponente pueda explicar lo que está ocurriendo sin necesidad de interactuar.
 *    Activar con prop `presentationMode={true}`.
 *
 * 2. VELOCIDAD VARIABLE:
 *    Selector de velocidad 0.5× / 1× / 2× para adaptar a la ponencia.
 *
 * 3. ANOTACIONES EN HITOS:
 *    Cuando progress cruza 30 y 60, aparece un banner de texto superpuesto
 *    con la hora verificada del evento (12:32:57 / 12:33:21 CEST).
 *
 * 4. EXPORTACIÓN DE FRAME:
 *    Botón "Capturar" que descarga el canvas actual como PNG.
 *    Útil para incluir en slides de la ponencia.
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PolarComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([PolarComponent, TooltipComponent, TitleComponent, CustomChart, CanvasRenderer]);

const NUM_VECTORS   = 15;
const PAUSE_DURATION = 2500; // ms de pausa automática en hitos

// ─── LCG determinista ─────────────────────────────────────────────────────────
function lcg(seed) {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Datos fasoriales ─────────────────────────────────────────────────────────
function generatePhasorData(progress) {
  const rand = lcg(Math.floor(progress * 100));
  const data = [];

  for (let i = 0; i < NUM_VECTORS; i++) {
    const isSouth = i % 2 !== 0;
    let angle, mag, color;

    if (progress < 30) {
      angle = (isSouth ? 25 : 15) + (rand() * 4 - 2);
      mag   = 1.0 + (rand() * 0.02 - 0.01);
      color = isSouth ? '#f59e0b' : '#3b82f6';
    } else if (progress < 60) {
      const inst = (progress - 30) / 30;
      if (isSouth) {
        angle = 25 + Math.sin(progress * i * 0.5) * 180 * inst;
        mag   = Math.max(0.3, 1.0 - inst * 0.3 + rand() * 0.15 - 0.075);
        color = '#ef4444';
      } else {
        angle = 15 + Math.sin(progress * i * 0.2) * 45 * inst;
        mag   = Math.max(0.6, 1.0 - inst * 0.1);
        color = '#3b82f6';
      }
    } else {
      const collapse = (progress - 60) / 40;
      if (isSouth) {
        angle = rand() * 360;
        mag   = Math.max(0, 0.7 - collapse * 0.7);
        color = '#ef4444';
      } else {
        angle = 15 + Math.sin(progress * 10) * 10;
        mag   = Math.max(0, 0.9 - collapse * 0.9);
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

// ─── Hitos con anotaciones ────────────────────────────────────────────────────
const MILESTONES = [
  { threshold: 30, es: '12:32:57 CEST — Disparo raíz en Granada. Inicio de la cascada de sobretensiones.', en: '12:32:57 CEST — Root trip in Granada. Overvoltage cascade begins.' },
  { threshold: 60, es: '12:33:21 CEST — Pérdida de sincronismo ES-FR. Sistema ibérico aislado.', en: '12:33:21 CEST — Loss of synchronism ES-FR. Iberian system isolated.' },
];

function getPhaseLabel(progress, lang) {
  if (progress < 30)  return lang === 'es' ? 'Fase 1: Operación estable' : 'Phase 1: Stable operation';
  if (progress < 60)  return lang === 'es' ? 'Fase 2: Cascada de sobretensiones' : 'Phase 2: Overvoltage cascade';
  return lang === 'es' ? 'Fase 3: Pérdida de sincronismo y colapso' : 'Phase 3: Loss of synchronism and collapse';
}

// ─── Componente interno ───────────────────────────────────────────────────────
function SynchrophasorPlotInner({ lang = 'es', presentationMode = false }) {
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [progress,  setProgress]      = useState(0);
  const [speed,     setSpeed]         = useState(1);
  const [milestone, setMilestone]     = useState(null); // banner de hito activo
  const pauseTimerRef = useRef(null);
  const lastMilestone = useRef(-1);

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Loop de animación con detección de hitos
  useEffect(() => {
    if (!isPlaying || prefersReduced) return;

    const interval = setInterval(() => {
      setProgress(p => {
        const next = parseFloat((p + 0.5 * speed).toFixed(1));

        // Detectar cruce de hito en modo presentación
        if (presentationMode) {
          for (const m of MILESTONES) {
            if (p < m.threshold && next >= m.threshold && lastMilestone.current < m.threshold) {
              lastMilestone.current = m.threshold;
              setIsPlaying(false);
              setMilestone(m);
              if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
              pauseTimerRef.current = setTimeout(() => {
                setMilestone(null);
                setIsPlaying(true);
              }, PAUSE_DURATION);
              return m.threshold;
            }
          }
        }

        if (next >= 100) { setIsPlaying(false); return 100; }
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isPlaying, prefersReduced, speed, presentationMode]);

  // Actualizar ECharts
  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.getEchartsInstance()
      .setOption({ series: [{ data: generatePhasorData(progress) }] });
  }, [progress]);

  const handleReset = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsPlaying(false);
    setProgress(0);
    setMilestone(null);
    lastMilestone.current = -1;
  }, []);

  // Exportar frame como PNG
  const handleCapture = useCallback(() => {
    if (!chartRef.current) return;
    const url = chartRef.current.getEchartsInstance().getDataURL({ type: 'png', pixelRatio: 2 });
    const a = document.createElement('a');
    a.href = url;
    a.download = `synchrophasor-${progress.toFixed(0)}pct.png`;
    a.click();
  }, [progress]);

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
      left: 'center', top: '3%',
      textStyle: { color: '#fff', fontSize: 17, fontWeight: '700',
        textShadowBlur: 10, textShadowColor: 'rgba(255,255,255,0.3)' },
      subtextStyle: { color: '#94a3b8', fontSize: 12 },
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
      formatter: (p) => {
        const [mag, ang] = p.value;
        return `<b style="color:#94a3b8">PMU</b><br/>
          ${lang === 'es' ? 'Tensión' : 'Voltage'}: <b style="color:#38bdf8">${mag.toFixed(3)} p.u.</b><br/>
          ${lang === 'es' ? 'Ángulo' : 'Angle'}: <b style="color:#f472b6">${ang.toFixed(1)}°</b>`;
      },
    },
    series: [{
      type: 'custom',
      coordinateSystem: 'polar',
      renderItem(params, api) {
        const val   = [api.value(0), api.value(1)];
        const start = api.coord([0, val[1]]);
        const end   = api.coord([val[0], val[1]]);
        const color = api.visual('color');
        return {
          type: 'group',
          children: [
            { type: 'line', shape: { x1: start[0], y1: start[1], x2: end[0], y2: end[1] },
              style: api.style({ stroke: color, lineWidth: 3, shadowBlur: 8, shadowColor: color }) },
            { type: 'circle', shape: { cx: end[0], cy: end[1], r: 6 },
              style: api.style({ fill: color, shadowBlur: 12, shadowColor: color }) },
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

      {/* Banner de hito (modo presentación) */}
      {milestone && (
        <div style={{
          marginBottom: '0.5rem',
          padding: '0.75rem 1rem',
          background: 'rgba(239,68,68,0.12)',
          border: '2px solid #ef4444',
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#fca5a5',
          textAlign: 'center',
          fontWeight: 'bold',
        }} aria-live="assertive" role="alert">
          ⚡ {milestone[lang] || milestone.es}
        </div>
      )}

      {/* Gráfico */}
      <div
        role="img"
        aria-label={isEs
          ? `Diagrama fasorial PMU. ${phaseLabel}. ${timeLabel}`
          : `PMU phasor diagram. ${phaseLabel}. ${timeLabel}`}
        style={{
          flex: 1, minHeight: 600,
          backgroundColor: '#0a0f1c',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          position: 'relative',
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

      {/* Barra de fase */}
      <div style={{
        marginTop: '0.5rem',
        height: 4,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: progress < 30 ? '#3b82f6' : progress < 60 ? '#f59e0b' : '#ef4444',
          transition: 'width 0.1s linear, background 0.3s ease',
        }} />
      </div>

      {/* Controles */}
      <div style={{
        marginTop: '0.5rem',
        padding: '0.75rem 1rem',
        background: 'rgba(15,23,42,0.5)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setIsPlaying(p => !p)}
          aria-pressed={isPlaying}
          aria-label={isPlaying
            ? (isEs ? 'Pausar' : 'Pause')
            : (isEs ? 'Reproducir' : 'Play')}
          style={{
            background: 'var(--ifm-color-primary)', color: '#fff',
            border: 'none', borderRadius: 4, padding: '0.45rem 1rem',
            cursor: 'pointer', fontWeight: 'bold', minWidth: 72, fontFamily: 'monospace',
          }}
        >
          {isPlaying ? (isEs ? 'PAUSA' : 'PAUSE') : 'PLAY'}
        </button>

        <button
          onClick={handleReset}
          aria-label={isEs ? 'Reiniciar' : 'Reset'}
          style={{
            background: 'transparent', color: 'var(--ifm-color-primary)',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: 4, padding: '0.45rem 0.8rem',
            cursor: 'pointer', fontWeight: 'bold', fontFamily: 'monospace',
          }}
        >
          ↺
        </button>

        {/* Velocidad */}
        <div style={{ display: 'flex', gap: '0.25rem' }}
             role="group" aria-label={isEs ? 'Velocidad' : 'Speed'}>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              style={{
                padding: '0.25rem 0.6rem',
                borderRadius: 4,
                border: `1px solid ${speed === s ? 'var(--ifm-color-primary)' : 'rgba(255,255,255,0.12)'}`,
                background: speed === s ? 'rgba(0,217,255,0.12)' : 'transparent',
                color: speed === s ? 'var(--ifm-color-primary)' : 'var(--text-1, #64748b)',
                cursor: 'pointer', fontSize: 11, fontFamily: 'monospace',
              }}
            >
              {s}×
            </button>
          ))}
        </div>

        <input
          type="range"
          min="0" max="100" step="0.5"
          value={progress}
          onChange={e => {
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
            setIsPlaying(false);
            setMilestone(null);
            setProgress(parseFloat(e.target.value));
          }}
          aria-label={isEs ? 'Control temporal' : 'Timeline'}
          aria-valuetext={`${phaseLabel} — ${timeLabel}`}
          style={{ flex: 1, cursor: 'pointer', minWidth: 100 }}
        />

        <div style={{ fontFamily: 'monospace', color: '#94a3b8', minWidth: 120, textAlign: 'right', fontSize: 12 }}>
          {timeLabel}
        </div>

        {/* Capturar frame */}
        <button
          onClick={handleCapture}
          title={isEs ? 'Descargar frame actual como PNG' : 'Download current frame as PNG'}
          aria-label={isEs ? 'Capturar frame actual' : 'Capture current frame'}
          style={{
            background: 'transparent', color: 'var(--text-1, #64748b)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4, padding: '0.45rem 0.6rem',
            cursor: 'pointer', fontSize: 14,
          }}
        >
          📷
        </button>
      </div>

      {/* Fase activa */}
      <div
        aria-live="polite"
        style={{
          marginTop: '0.5rem',
          padding: '0.4rem 0.9rem',
          background: progress < 30
            ? 'rgba(59,130,246,0.08)'
            : progress < 60
              ? 'rgba(245,158,11,0.08)'
              : 'rgba(239,68,68,0.08)',
          borderRadius: 6,
          borderLeft: `3px solid ${progress < 30 ? '#3b82f6' : progress < 60 ? '#f59e0b' : '#ef4444'}`,
          fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0',
        }}
      >
        {phaseLabel}
        {presentationMode && (
          <span style={{ marginLeft: '0.75rem', fontSize: 11, color: 'var(--text-1, #64748b)' }}>
            {isEs ? '(modo presentación — pausa automática en hitos)' : '(presentation mode — auto-pause at milestones)'}
          </span>
        )}
      </div>

      {/* Explicación */}
      <div style={{
        marginTop: '0.75rem',
        padding: '1.25rem',
        background: 'rgba(15,23,42,0.5)',
        borderRadius: 8,
        border: '1px solid rgba(56,189,248,0.2)',
        color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.65,
      }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.6rem' }}>
          {isEs ? '¿Qué muestra este diagrama?' : 'What does this diagram show?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem' }}>
          {isEs
            ? 'Cada vector representa la tensión (longitud = magnitud en p.u.) y el ángulo de fase en un nudo de la red de transporte, tal como lo mediría una PMU. El centro (0 p.u.) es la ausencia total de tensión.'
            : 'Each vector represents voltage (length = magnitude in p.u.) and phase angle at a transmission node, as measured by a PMU. The center (0 p.u.) is complete voltage absence.'}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#3b82f6' }}>{isEs ? 'Azul (Norte):' : 'Blue (North):'}</strong>
            {' '}{isEs ? 'Nudos del centro/norte. Más estables (mayor masa síncrona).' : 'Center/north nodes. More stable (greater synchronous mass).'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#f59e0b' }}>{isEs ? 'Ámbar (Sur, estable):' : 'Amber (South, stable):'}</strong>
            {' '}{isEs ? 'Nudos del sur antes del fallo. Alta penetración FV.' : 'Southern nodes before fault. High PV penetration.'}
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>{isEs ? 'Rojo (colapso):' : 'Red (collapse):'}</strong>
            {' '}{isEs ? 'Vectores sin control = pérdida de sincronismo. Encogimiento → 0 V.' : 'Uncontrolled vectors = loss of synchronism. Shrinking → 0 V.'}
          </li>
        </ul>
        {prefersReduced && (
          <p style={{ marginTop: '0.6rem', color: '#f59e0b', fontSize: '0.8rem' }}>
            {isEs ? 'Animación desactivada. Use el slider.' : 'Animation disabled. Use the slider.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SynchrophasorPlot({ lang = 'es', presentationMode = false }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 650, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-1, #64748b)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Inicializando diagrama fasorial…' : 'Initializing phasor diagram…'}
      </div>
    }>
      {() => <SynchrophasorPlotInner lang={lang} presentationMode={presentationMode} />}
    </BrowserOnly>
  );
}
