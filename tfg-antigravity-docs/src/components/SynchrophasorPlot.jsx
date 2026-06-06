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
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
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
function generatePhasorData(progress, palette) {
  const rand = lcg(Math.floor(progress * 100));
  const data = [];

  for (let i = 0; i < NUM_VECTORS; i++) {
    const isSouth = i % 2 !== 0;
    let angle, mag, color;

    if (progress < 30) {
      angle = (isSouth ? 25 : 15) + (rand() * 4 - 2);
      mag   = 1.0 + (rand() * 0.02 - 0.01);
      color = isSouth ? palette.south : palette.north;
    } else if (progress < 60) {
      const inst = (progress - 30) / 30;
      if (isSouth) {
        angle = 25 + Math.sin(progress * i * 0.5) * 180 * inst;
        mag   = Math.max(0.3, 1.0 - inst * 0.3 + rand() * 0.15 - 0.075);
        color = palette.collapse;
      } else {
        angle = 15 + Math.sin(progress * i * 0.2) * 45 * inst;
        mag   = Math.max(0.6, 1.0 - inst * 0.1);
        color = palette.north;
      }
    } else {
      const collapse = (progress - 60) / 40;
      if (isSouth) {
        angle = rand() * 360;
        mag   = Math.max(0, 0.7 - collapse * 0.7);
        color = palette.collapse;
      } else {
        angle = 15 + Math.sin(progress * 10) * 10;
        mag   = Math.max(0, 0.9 - collapse * 0.9);
        color = collapse > 0.7 ? palette.collapse : palette.north;
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

function getPhasorPalette(isDark) {
  return {
    bgPanel: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(255, 252, 245, 0.62)',
    bgChart: isDark ? '#071326' : '#FFFCF5',
    bgTooltip: isDark ? 'rgba(16, 29, 53, 0.97)' : 'rgba(255, 252, 245, 0.97)',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.12)' : 'rgba(25, 24, 20, 0.10)',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.24)' : 'rgba(25, 24, 20, 0.20)',

    north: isDark ? '#7DCDE3' : '#1F6F78',
    south: isDark ? '#E6B45C' : '#A96000',
    collapse: isDark ? '#D98798' : '#A13D36',

    northSoft: isDark ? 'rgba(125, 205, 227, 0.12)' : 'rgba(31, 111, 120, 0.10)',
    southSoft: isDark ? 'rgba(230, 180, 92, 0.11)' : 'rgba(169, 96, 0, 0.10)',
    collapseSoft: isDark ? 'rgba(217, 135, 152, 0.10)' : 'rgba(161, 61, 54, 0.10)',

    accent: isDark ? '#7DCDE3' : '#1F6F78',
    accentSoft: isDark ? 'rgba(125, 205, 227, 0.12)' : 'rgba(31, 111, 120, 0.10)',
    accentBorder: isDark ? 'rgba(125, 205, 227, 0.38)' : 'rgba(31, 111, 120, 0.34)',

    shadowInset: isDark
      ? 'inset 0 0 50px rgba(0, 0, 0, 0.42)'
      : 'inset 0 0 30px rgba(25, 24, 20, 0.045)',
  };
}

function getPhaseVisual(progress, palette) {
  if (progress < 30) {
    return {
      color: palette.north,
      soft: palette.northSoft,
    };
  }
  if (progress < 60) {
    return {
      color: palette.south,
      soft: palette.southSoft,
    };
  }
  return {
    color: palette.collapse,
    soft: palette.collapseSoft,
  };
}

function getPhaseLabel(progress, lang) {
  if (progress < 30)  return lang === 'es' ? 'Fase 1: Operación estable' : 'Phase 1: Stable operation';
  if (progress < 60)  return lang === 'es' ? 'Fase 2: Cascada de sobretensiones' : 'Phase 2: Overvoltage cascade';
  return lang === 'es' ? 'Fase 3: Pérdida de sincronismo y colapso' : 'Phase 3: Loss of synchronism and collapse';
}

// ─── Componente interno ───────────────────────────────────────────────────────
function SynchrophasorPlotInner({ presentationMode = false }) {
  const lang = useDocLang();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = useMemo(() => getPhasorPalette(isDark), [isDark]);
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [progress,  setProgress]      = useState(0);
  const [speed,     setSpeed]         = useState(1);
  const [milestone, setMilestone]     = useState(null); // banner de hito activo
  const phaseVisual = useMemo(() => getPhaseVisual(progress, palette), [progress, palette]);
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
      .setOption({ series: [{ data: generatePhasorData(progress, palette) }] });
  }, [progress, palette]);

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
      textStyle: {
        color: palette.textPrimary,
        fontSize: 17,
        fontWeight: '700',
        textShadowBlur: isDark ? 8 : 0,
        textShadowColor: isDark ? 'rgba(244, 247, 251, 0.22)' : 'transparent',
      },
      subtextStyle: { color: palette.textMuted, fontSize: 12 },
    },
    polar: { center: ['50%', '58%'], radius: '62%' },
    angleAxis: {
      type: 'value', min: 0, max: 360, boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: palette.grid, type: 'dashed' } },
      axisLabel: { formatter: '{value}°', color: palette.textMuted, fontSize: 12 },
      axisLine: { lineStyle: { color: palette.axisLine } },
    },
    radiusAxis: {
      type: 'value', min: 0, max: 1.2,
      splitLine: { show: true, lineStyle: { color: palette.grid } },
      axisLabel: { formatter: '{value} p.u.', color: palette.textMuted, fontSize: 11 },
      axisLine: { lineStyle: { color: palette.axisLine } },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: palette.bgTooltip,
      borderColor: palette.accentBorder,
      borderWidth: 1,
      textStyle: { color: palette.textPrimary, fontFamily: 'monospace', fontSize: 12 },
      formatter: (p) => {
        const [mag, ang] = p.value;
        return `<b style="color:${palette.textMuted}">PMU</b><br/>
          ${lang === 'es' ? 'Tensión' : 'Voltage'}: <b style="color:${palette.accent}">${mag.toFixed(3)} p.u.</b><br/>
          ${lang === 'es' ? 'Ángulo' : 'Angle'}: <b style="color:${palette.collapse}">${ang.toFixed(1)}°</b>`;
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
  }), [lang, palette, isDark]);

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
          background: palette.collapseSoft,
          border: `2px solid ${palette.collapse}`,
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 14,
          color: palette.collapse,
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
          backgroundColor: palette.bgChart,
          borderRadius: 12,
          border: `1px solid ${palette.border}`,
          boxShadow: palette.shadowInset,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ReactEChartsCore
          ref={chartRef}
          echarts={echarts}
          option={baseOption}
          style={{ height: '100%', minHeight: 600, width: '100%' }}
          theme={undefined}
          notMerge={false}
          lazyUpdate
        />
      </div>

      {/* Barra de fase */}
      <div style={{
        marginTop: '0.5rem',
        height: 4,
        background: palette.border,
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: phaseVisual.color,
          transition: 'width 0.1s linear, background 0.3s ease',
        }} />
      </div>

      {/* Controles */}
      <div style={{
        marginTop: '0.5rem',
        padding: '0.75rem 1rem',
        background: palette.bgPanel,
        borderRadius: 8,
        border: `1px solid ${palette.border}`,
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setIsPlaying(p => !p)}
          aria-pressed={isPlaying}
          aria-label={isPlaying
            ? (isEs ? 'Pausar' : 'Pause')
            : (isEs ? 'Reproducir' : 'Play')}
          style={{
            background: palette.accent, color: isDark ? '#071326' : '#FFFCF5',
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
            background: 'transparent', color: palette.accent,
            border: `1px solid ${palette.accentBorder}`,
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
                border: `1px solid ${speed === s ? palette.accentBorder : palette.border}`,
                background: speed === s ? palette.accentSoft : 'transparent',
                color: speed === s ? palette.accent : palette.textSecondary,
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

        <div style={{ fontFamily: 'monospace', color: palette.textMuted, minWidth: 120, textAlign: 'right', fontSize: 12 }}>
          {timeLabel}
        </div>

        {/* Capturar frame */}
        <button
          onClick={handleCapture}
          title={isEs ? 'Descargar frame actual como PNG' : 'Download current frame as PNG'}
          aria-label={isEs ? 'Capturar frame actual' : 'Capture current frame'}
          style={{
            background: 'transparent',
            color: palette.textSecondary,
            border: `1px solid ${palette.border}`,
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
          background: phaseVisual.soft,
          borderRadius: 6,
          borderLeft: `3px solid ${phaseVisual.color}`,
          fontFamily: 'monospace',
          fontSize: 13,
          color: palette.textPrimary,
        }}
      >
        {phaseLabel}
        {presentationMode && (
          <span style={{ marginLeft: '0.75rem', fontSize: 11, color: palette.textMuted }}>
            {isEs ? '(modo presentación — pausa automática en hitos)' : '(presentation mode — auto-pause at milestones)'}
          </span>
        )}
      </div>

      {/* Explicación */}
      <div style={{
        marginTop: '0.75rem',
        padding: '1.25rem',
        background: palette.bgPanel,
        borderRadius: 8,
        border: `1px solid ${palette.accentBorder}`,
        color: palette.textSecondary, fontSize: '0.9rem', lineHeight: 1.65,
      }}>
        <h4 style={{ color: palette.accent, margin: '0 0 0.6rem' }}>
          {isEs ? '¿Qué muestra este diagrama?' : 'What does this diagram show?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem' }}>
          {isEs
            ? 'Cada vector representa la tensión (longitud = magnitud en p.u.) y el ángulo de fase en un nudo de la red de transporte, tal como lo mediría una PMU. El centro (0 p.u.) es la ausencia total de tensión.'
            : 'Each vector represents voltage (length = magnitude in p.u.) and phase angle at a transmission node, as measured by a PMU. The center (0 p.u.) is complete voltage absence.'}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: palette.north }}>{isEs ? 'Azul (Norte):' : 'Blue (North):'}</strong>
            {' '}{isEs ? 'Nudos del centro/norte. Más estables (mayor masa síncrona).' : 'Center/north nodes. More stable (greater synchronous mass).'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: palette.south }}>{isEs ? 'Ámbar (Sur, estable):' : 'Amber (South, stable):'}</strong>
            {' '}{isEs ? 'Nudos del sur antes del fallo. Alta penetración FV.' : 'Southern nodes before fault. High PV penetration.'}
          </li>
          <li>
            <strong style={{ color: palette.collapse }}>{isEs ? 'Rojo (colapso):' : 'Red (collapse):'}</strong>
            {' '}{isEs ? 'Vectores sin control = pérdida de sincronismo. Encogimiento → 0 V.' : 'Uncontrolled vectors = loss of synchronism. Shrinking → 0 V.'}
          </li>
        </ul>
        {prefersReduced && (
          <p style={{ marginTop: '0.6rem', color: palette.south, fontSize: '0.8rem' }}>
            {isEs ? 'Animación desactivada. Use el slider.' : 'Animation disabled. Use the slider.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SynchrophasorPlot({ presentationMode = false }) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 650, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#7A7062',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Inicializando diagrama fasorial…' : 'Initializing phasor diagram…'}
      </div>
    }>
      {() => <SynchrophasorPlotInner presentationMode={presentationMode} />}
    </BrowserOnly>
  );
}
