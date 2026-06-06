/**
 * PhasePlanePlot.jsx
 * Diagrama de plano de fase: convergencia de inversores GFM vs GFL vs SG.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. CRÍTICO — require() dentro del render:
 *    La versión anterior usaba require('react-plotly.js') dentro de BrowserOnly.
 *    Esto provoca re-renders en cada ciclo y es un anti-patrón de React.
 *    Migrado a Recharts ScatterChart con trayectorias renderizadas como series.
 *
 * 2. FÍSICA — modelo GFL corregido:
 *    La versión anterior usaba "delta *= 1.002" como amplificación artificial
 *    FUERA de la ecuación diferencial, lo que no corresponde a ningún modelo
 *    físico real. El comportamiento divergente del GFL en red débil emerge
 *    naturalmente de la ecuación del oscilador con amortiguamiento negativo
 *    cuando el SCR es bajo. Modelo corregido:
 *
 *    GFL en red débil (SCR < 2):
 *      d²δ/dt² + 2ζω_n · dδ/dt + ω_n² · sin(δ) = 0
 *    Con ζ < 0 (amortiguamiento negativo = red débil con PLL desestabilizante).
 *    Referencia: Rocabert et al. (2012) IEEE Transactions on Power Electronics.
 *
 *    GFM estable:
 *      d²δ/dt² + 2ζω_n · dδ/dt + ω_n² · sin(δ) = 0
 *    Con ζ > 0 (amortiguamiento positivo fuerte = control droop activo).
 *
 * 3. MIGRACIÓN Plotly → Recharts:
 *    Elimina ~600 KB gzip de la página donde aparece este componente.
 *
 * 4. ACCESIBILIDAD:
 *    Botones con aria-label y aria-pressed. Slider con aria-valuetext.
 *    prefers-reduced-motion respetado.
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ─── Integración RK4 de la ecuación del plano de fase ────────────────────────
/**
 * Ecuación de oscilador no lineal amortiguado:
 *   dδ/dt  = ω
 *   dω/dt  = -ω_n² · sin(δ) - 2ζ · ω_n · ω
 *
 * Para GFL en red débil: ζ = -0.15 (amortiguamiento negativo → divergencia)
 * Para GFM:              ζ = +0.85 (amortiguamiento fuerte → convergencia)
 * Para SG clásico:       ζ = +0.35 (amortiguamiento suave → espiral lenta)
 */
function integratePhase({ wn, zeta, delta0, omega0, tEnd, dt = 0.01 }) {
  const points = [];
  let delta = delta0;
  let omega  = omega0;
  const MAX_DELTA = 6.0; // Limitar divergencia para el gráfico

  for (let t = 0; t <= tEnd; t += dt) {
    points.push({ delta: parseFloat(delta.toFixed(4)), omega: parseFloat(omega.toFixed(4)) });

    // RK4
    const f1 = (d, w) => w;
    const g1 = (d, w) => -wn * wn * Math.sin(d) - 2 * zeta * wn * w;

    const k1d = f1(delta, omega),          k1w = g1(delta, omega);
    const k2d = f1(delta + dt/2 * k1d, omega + dt/2 * k1w);
    const k2w = g1(delta + dt/2 * k1d, omega + dt/2 * k1w);
    const k3d = f1(delta + dt/2 * k2d, omega + dt/2 * k2w);
    const k3w = g1(delta + dt/2 * k2d, omega + dt/2 * k2w);
    const k4d = f1(delta + dt * k3d, omega + dt * k3w);
    const k4w = g1(delta + dt * k3d, omega + dt * k3w);

    delta += (dt / 6) * (k1d + 2*k2d + 2*k3d + k4d);
    omega += (dt / 6) * (k1w + 2*k2w + 2*k3w + k4w);

    // Detener si la trayectoria diverge más allá del rango del gráfico
    if (Math.abs(delta) > MAX_DELTA || Math.abs(omega) > MAX_DELTA) break;
  }

  return points;
}

// Pre-computar trayectorias completas (fuera del componente = una sola vez)
const FULL_TIME = 15;
const INIT = { delta0: 0.3, omega0: 0.5 };

const GFL_FULL = integratePhase({ wn: 1.0, zeta: -0.12, ...INIT, tEnd: FULL_TIME });
const GFM_FULL = integratePhase({ wn: 1.5, zeta:  0.85, ...INIT, tEnd: FULL_TIME });
const SG_FULL  = integratePhase({ wn: 1.0, zeta:  0.35, ...INIT, tEnd: FULL_TIME });

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function PhaseTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{
      background: 'var(--pp-bg-tooltip)',
      border: '1px solid var(--pp-border-strong)',
      borderRadius: 6,
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: 'var(--pp-text-primary)',
      boxShadow: 'var(--pp-shadow-tooltip)',
    }}>
      <p style={{ margin: '0 0 3px' }}>δ = {d.delta?.toFixed(3)} rad</p>
      <p style={{ margin: 0 }}>ω = {d.omega?.toFixed(3)} rad/s</p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function PhasePlanePlotInner({}) {
  const lang = useDocLang();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    if (!isPlaying || prefersReduced) return;
    const interval = setInterval(() => {
      setCurrentTime(t => {
        if (t >= FULL_TIME) { setIsPlaying(false); return FULL_TIME; }
        return parseFloat((t + 0.1).toFixed(1));
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, prefersReduced]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Datos visibles según el tiempo actual
  const maxIdx = Math.floor(currentTime * 100); // dt = 0.01 → 100 puntos por segundo
  const gflData = GFL_FULL.slice(0, maxIdx + 1);
  const gfmData = GFM_FULL.slice(0, maxIdx + 1);
  const sgData  = SG_FULL.slice(0,  maxIdx + 1);

  const isEs = lang === 'es';

  const texts = {
    title:  isEs ? 'Diagrama de Plano de Fase: Convergencia de Inversores' : 'Phase-Plane Diagram: Inverter Convergence',
    xaxis:  isEs ? 'Desviación Angular δ (rad)' : 'Angle Deviation δ (rad)',
    yaxis:  isEs ? 'Desviación de Frecuencia Δω (rad/s)' : 'Frequency Deviation Δω (rad/s)',
    gfl:    isEs ? 'Grid-Following (GFL) — Divergente (red débil)' : 'Grid-Following (GFL) — Divergent (weak grid)',
    gfm:    isEs ? 'Grid-Forming (GFM) — Estable' : 'Grid-Forming (GFM) — Stable',
    sg:     isEs ? 'Generador Síncrono Clásico (SG)' : 'Classic Synchronous Generator (SG)',
    play:   isEs ? 'Reproducir' : 'Play',
    pause:  isEs ? 'Pausar' : 'Pause',
    reset:  isEs ? 'Reiniciar' : 'Reset',
    sliderLabel: isEs ? 'Control temporal' : 'Timeline control',
  };

  const tLabel = `T = ${currentTime.toFixed(2)} s`;

  return (
    <div className="phase-plane-scope" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <style>{`
        .phase-plane-scope {
          --pp-bg-panel: rgba(255, 252, 245, 0.62);
          --pp-bg-tooltip: #FFFCF5;
          --pp-text-primary: #191814;
          --pp-text-secondary: #4A4338;
          --pp-text-muted: #7A7062;
          --pp-border: rgba(25, 24, 20, 0.14);
          --pp-border-strong: rgba(25, 24, 20, 0.24);
          --pp-grid: rgba(25, 24, 20, 0.10);
          --pp-axis: #6B6255;
          --pp-axis-line: rgba(25, 24, 20, 0.20);
          --pp-equilibrium: rgba(25, 24, 20, 0.22);

          --pp-gfm: #2F6B4F;
          --pp-gfm-soft: rgba(47, 107, 79, 0.10);
          --pp-sg: #A96000;
          --pp-sg-soft: rgba(169, 96, 0, 0.10);
          --pp-gfl: #A13D36;
          --pp-gfl-soft: rgba(161, 61, 54, 0.10);

          --pp-accent: #1F6F78;
          --pp-accent-soft: rgba(31, 111, 120, 0.10);
          --pp-accent-border: rgba(31, 111, 120, 0.34);

          --pp-shadow: 0 8px 24px rgba(25, 24, 20, 0.055);
          --pp-shadow-tooltip: 0 12px 32px rgba(25, 24, 20, 0.12);
        }

        html[data-theme='dark'] .phase-plane-scope {
          --pp-bg-panel: rgba(7, 19, 38, 0.58);
          --pp-bg-tooltip: #101D35;
          --pp-text-primary: #F4F7FB;
          --pp-text-secondary: #C7D2E3;
          --pp-text-muted: #91A4BC;
          --pp-border: rgba(226, 232, 240, 0.14);
          --pp-border-strong: rgba(226, 232, 240, 0.24);
          --pp-grid: rgba(244, 247, 251, 0.10);
          --pp-axis: #C7D2E3;
          --pp-axis-line: rgba(244, 247, 251, 0.22);
          --pp-equilibrium: rgba(244, 247, 251, 0.24);

          --pp-gfm: #A6C67B;
          --pp-gfm-soft: rgba(166, 198, 123, 0.10);
          --pp-sg: #E6B45C;
          --pp-sg-soft: rgba(230, 180, 92, 0.11);
          --pp-gfl: #D98798;
          --pp-gfl-soft: rgba(217, 135, 152, 0.10);

          --pp-accent: #7DCDE3;
          --pp-accent-soft: rgba(125, 205, 227, 0.12);
          --pp-accent-border: rgba(125, 205, 227, 0.38);

          --pp-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
          --pp-shadow-tooltip: 0 16px 38px rgba(0, 0, 0, 0.38);
        }
      `}</style>

      <p style={{
        margin: '0 0 8px',
        fontSize: 14, fontWeight: 600, color: 'var(--pp-text-primary)', textAlign: 'center',
      }}>
        {texts.title}
      </p>

      <div
        role="img"
        aria-label={isEs
          ? `Diagrama de plano de fase de inversores. Tiempo: ${tLabel}`
          : `Inverter phase-plane diagram. Time: ${tLabel}`}
        style={{ height: 420 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 40 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--pp-grid)"
            />
            <XAxis
              type="number"
              dataKey="delta"
              domain={[-4, 4]}
              name="δ"
              stroke="var(--pp-axis-line)"
              tick={{ fill: 'var(--pp-axis)', fontSize: 11 }}
              label={{ value: texts.xaxis, position: 'insideBottom', offset: -20, fill: 'var(--pp-axis)', fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="omega"
              domain={[-4, 4]}
              name="ω"
              stroke="var(--pp-axis-line)"
              tick={{ fill: 'var(--pp-axis)', fontSize: 11 }}
              label={{ value: texts.yaxis, angle: -90, position: 'insideLeft', fill: 'var(--pp-axis)', fontSize: 11 }}
            />
            <Tooltip content={<PhaseTooltip />} cursor={false} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
            />
            {/* Punto de equilibrio */}
            <ReferenceLine x={0} stroke="var(--pp-equilibrium)" />
            <ReferenceLine y={0} stroke="var(--pp-equilibrium)" />

            {/* GFL — divergente */}
            <Scatter
              name={texts.gfl}
              data={gflData}
              line={{ stroke: 'var(--pp-gfl)', strokeWidth: 2.5 }}
              lineType="joint"
              fill="var(--pp-gfl)"
              shape={() => null}
            />

            {/* GFM — estable */}
            <Scatter
              name={texts.gfm}
              data={gfmData}
              line={{ stroke: 'var(--pp-gfm)', strokeWidth: 2.5 }}
              lineType="joint"
              fill="var(--pp-gfm)"
              shape={() => null}
            />

            {/* SG — clásico */}
            <Scatter
              name={texts.sg}
              data={sgData}
              line={{ stroke: 'var(--pp-sg)', strokeWidth: 2, strokeDasharray: '5 3' }}
              lineType="joint"
              fill="var(--pp-sg)"
              shape={() => null}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Controles */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem 1rem',
        background: 'var(--pp-bg-panel)',
        borderRadius: 8,
        border: '1px solid var(--pp-border)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setIsPlaying(p => !p)}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? texts.pause : texts.play}
          style={{
            background: 'var(--pp-accent)',
            color: '#FFFCF5', border: 'none',
            borderRadius: 4, padding: '0.4rem 0.9rem',
            cursor: 'pointer', fontWeight: 'bold', minWidth: 80,
          }}
        >
          {isPlaying ? texts.pause : texts.play}
        </button>
        <button
          onClick={handleReset}
          aria-label={texts.reset}
          style={{
            background: 'transparent',
            color: 'var(--pp-accent)',
            border: '1px solid var(--pp-accent-border)',
            borderRadius: 4, padding: '0.4rem 0.9rem',
            cursor: 'pointer', fontWeight: 'bold',
          }}
        >
          {texts.reset}
        </button>
        <input
          type="range"
          min="0" max={FULL_TIME} step="0.1"
          value={currentTime}
          onChange={e => { setIsPlaying(false); setCurrentTime(parseFloat(e.target.value)); }}
          aria-label={texts.sliderLabel}
          aria-valuetext={tLabel}
          style={{ flex: 1, cursor: 'pointer', minWidth: 100 }}
        />
        <div style={{ fontFamily: 'monospace', color: 'var(--pp-text-muted)', minWidth: 100, textAlign: 'right', fontSize: 13 }}>
          {tLabel}
        </div>
      </div>

      {/* Explicación */}
      <div style={{
        marginTop: '0.75rem',
        padding: '1.25rem',
        background: 'var(--pp-bg-panel)',
        borderRadius: 8,
        border: '1px solid var(--pp-accent-border)',
        color: 'var(--pp-text-secondary)',
        fontSize: '0.9rem',
        lineHeight: 1.65,
      }}>
        <h4 style={{ color: 'var(--pp-accent)', margin: '0 0 0.5rem' }}>
          {isEs ? '¿Qué significa este diagrama?' : 'What does this diagram mean?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem' }}>
          {isEs
            ? 'El punto (0, 0) es la estabilidad perfecta. Cada curva muestra cómo una tecnología reacciona ante la misma perturbación (δ₀ = 0,3 rad, ω₀ = 0,5 rad/s).'
            : 'The point (0,0) is perfect stability. Each curve shows how a technology reacts to the same perturbation (δ₀ = 0.3 rad, ω₀ = 0.5 rad/s).'}
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: 'var(--pp-gfm)' }}>
              {isEs ? 'Verde (GFM):' : 'Green (GFM):'}
            </strong>
            {' '}{isEs
              ? 'Inversor Grid-Forming. Amortiguamiento activo por control droop — converge rápidamente al origen.'
              : 'Grid-Forming inverter. Active damping via droop control — converges quickly to the origin.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: 'var(--pp-sg)' }}>
              {isEs ? 'Ámbar (SG):' : 'Amber (SG):'}
            </strong>
            {' '}{isEs
              ? 'Generador síncrono clásico. Inercia mecánica natural — converge en espiral amortiguada.'
              : 'Classic synchronous generator. Natural mechanical inertia — converges in damped spiral.'}
          </li>
          <li>
            <strong style={{ color: 'var(--pp-gfl)' }}>
              {isEs ? 'Rojo (GFL):' : 'Red (GFL):'}
            </strong>
            {' '}{isEs
              ? 'Inversor Grid-Following en red débil (SCR < 2). El PLL pierde el seguimiento de fase — la trayectoria diverge. Es el mecanismo que causó el 28-A.'
              : 'Grid-Following inverter in weak grid (SCR < 2). PLL loses phase tracking — trajectory diverges. This is the mechanism behind April 28.'}
          </li>
        </ul>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.78rem', color: 'var(--pp-text-muted)' }}>
          {isEs
            ? 'Modelo: oscilador no lineal amortiguado (RK4, dt=10 ms). Referencia: Rocabert et al. (2012), IEEE Trans. Power Electron. ζ_GFL = -0.12 (red débil), ζ_GFM = +0.85, ζ_SG = +0.35.'
            : 'Model: nonlinear damped oscillator (RK4, dt=10 ms). Reference: Rocabert et al. (2012), IEEE Trans. Power Electron. ζ_GFL = -0.12 (weak grid), ζ_GFM = +0.85, ζ_SG = +0.35.'}
        </p>
      </div>
    </div>
  );
}

export default function PhasePlanePlot({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 500, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#7A7062',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Inicializando diagrama de fase…' : 'Initializing phase diagram…'}
      </div>
    }>
      {() => <PhasePlanePlotInner />}
    </BrowserOnly>
  );
}
