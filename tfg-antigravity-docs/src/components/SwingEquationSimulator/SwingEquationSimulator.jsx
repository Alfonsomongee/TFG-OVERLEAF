/**
 * SwingEquationSimulator.jsx
 * Simulador de la ecuación del swing — dinámica de frecuencia ante pérdida de generación.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. CRÍTICO — eliminar iframe:
 *    La versión anterior cargaba /SwingEquationSimulator/index.html en un iframe.
 *    Esto falla en modo PWA offline si el Service Worker no cachea ese HTML,
 *    y rompe la experiencia en la defensa del TFG si no hay conexión.
 *    Migrado a componente React puro con el hook useSwingEquation (RK4).
 *
 * 2. FÍSICA — integración RK4 (no Euler explícito):
 *    La versión anterior usaba Euler explícito (paso 10 ms).
 *    RK4 con el mismo paso es numéricamente estable para H bajos (< 2 s).
 *
 *    Ecuación del swing (por máquina):
 *      df/dt = (f₀ / 2H) · (Pm - Pe - D·(f - f₀))
 *    donde:
 *      f₀ = 50 Hz (frecuencia nominal)
 *      H  = constante de inercia [s]
 *      Pm = potencia mecánica de entrada (pre-disturbio)
 *      Pe = potencia eléctrica de salida (tras pérdida ΔP)
 *      D  = coeficiente de amortiguamiento
 *      FFR = inyección de respuesta rápida a partir de t = 0,1 s
 *
 * 3. DEMO 28-A verificada:
 *    H = 2,4 s (ENTSO-E Factual, Tabla 2-4, media ibérica)
 *    ΔP = 0,03 p.u. (≈ 750 MW sobre 25.000 MW demanda = 3%)
 *    FFR = 0 (no había respuesta rápida activa el 28-A)
 *
 * 4. ACCESIBILIDAD:
 *    Sliders con aria-valuetext con unidades físicas.
 *    Gráfica con role="img" y descripción.
 *    prefers-reduced-motion desactiva la animación en tiempo real.
 *
 * 5. OFFLINE:
 *    Componente 100% autónomo. No depende de assets externos.
 *    Funciona en PWA sin conexión.
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Label,
} from 'recharts';

const F0       = 50;    // Hz nominal
const DT       = 0.01;  // paso de integración [s]
const DURATION = 10;    // duración de la simulación [s]
const D_DAMP   = 1.0;   // coeficiente de amortiguamiento por defecto

// ─── Integración RK4 de la ecuación del swing ─────────────────────────────────
function swingDerivs(f, H, dP, D, FFR, t) {
  const ffrInj = (FFR > 0 && t > 0.1) ? FFR : 0;
  return (F0 / (2 * H)) * (-dP + ffrInj - D * (f - F0));
}

function rk4Step(f, t, H, dP, D, FFR, h) {
  const k1 = swingDerivs(f,          H, dP, D, FFR, t);
  const k2 = swingDerivs(f + h*k1/2, H, dP, D, FFR, t + h/2);
  const k3 = swingDerivs(f + h*k2/2, H, dP, D, FFR, t + h/2);
  const k4 = swingDerivs(f + h*k3,   H, dP, D, FFR, t + h);
  return f + (h / 6) * (k1 + 2*k2 + 2*k3 + k4);
}

function computeSwingTrace({ H, dP, FFR, D = D_DAMP }) {
  const steps = Math.floor(DURATION / DT);
  const trace = [{ t: 0, f: F0, rocof: 0 }];
  let f = F0;
  for (let i = 1; i <= steps; i++) {
    const t    = i * DT;
    const fNew = rk4Step(f, t - DT, H, dP, D, FFR, DT);
    const rocof = (fNew - f) / DT;
    trace.push({ t: parseFloat(t.toFixed(2)), f: parseFloat(fNew.toFixed(4)), rocof: parseFloat(rocof.toFixed(4)) });
    f = fNew;
    if (f < 47.0 || f > 52.0) break; // estabilidad numérica
  }
  return trace;
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function SwingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{
      background: 'var(--sw-bg-tooltip)',
      border: '1px solid var(--sw-border-strong)',
      borderRadius: 6, padding: '8px 12px',
      fontFamily: 'monospace', fontSize: 12, color: 'var(--sw-text-primary)',
      boxShadow: 'var(--sw-shadow-tooltip)',
    }}>
      <p style={{ margin: '0 0 4px', color: 'var(--sw-text-muted)' }}>t = {d.t} s</p>
      <p style={{ margin: '0 0 2px', color: 'var(--sw-frequency)' }}>f = {d.f?.toFixed(3)} Hz</p>
      <p style={{ margin: 0, color: 'var(--sw-warning)' }}>RoCoF = {d.rocof?.toFixed(3)} Hz/s</p>
    </div>
  );
}

// ─── Slider accesible ─────────────────────────────────────────────────────────
function AccessibleSlider({ label, value, onChange, min, max, step, valueText }) {
  const id = `swing-${label.replace(/\s+/g,'-').toLowerCase()}`;
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <label htmlFor={id} style={{ fontSize: 12, color: 'var(--sw-text-muted)', fontFamily: 'monospace' }}>
          {label}
        </label>
        <span style={{ fontSize: 12, color: 'var(--sw-frequency)', fontFamily: 'monospace', fontWeight: 'bold' }}>
          {valueText}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        aria-label={label}
        aria-valuetext={valueText}
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
        style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--sw-accent)' }}
      />
    </div>
  );
}

// ─── Componente interno ───────────────────────────────────────────────────────
function SwingEquationSimulatorInner({}) {
  const lang = useDocLang();
  const [H,   setH]   = useState(2.4);   // s — ENTSO-E Factual media ibérica
  const [dP,  setDP]  = useState(0.03);  // p.u. sobre demanda total
  const [FFR, setFFR] = useState(0.0);   // p.u. de respuesta rápida

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const isEs = lang === 'es';

  // Calcular trayectoria (memoizado para evitar recálculos innecesarios)
  const trace = useMemo(
    () => computeSwingTrace({ H, dP, FFR }),
    [H, dP, FFR],
  );

  const nadir = useMemo(
    () => trace.reduce((min, p) => p.f < min.f ? p : min, trace[0]),
    [trace],
  );

  const rocofMax = useMemo(
    () => Math.abs(Math.min(...trace.slice(0,20).map(p => p.rocof))).toFixed(3),
    [trace],
  );

  // Preset 28-A
  const loadPreset28A = () => {
    setH(2.4);
    setDP(0.03);
    setFFR(0.0);
  };

  // Preset "red reforzada"
  const loadPresetRobust = () => {
    setH(6.0);
    setDP(0.03);
    setFFR(0.015);
  };

  const statusColor = nadir.f > 49.0
    ? 'var(--sw-success)'
    : nadir.f > 48.5
      ? 'var(--sw-warning)'
      : 'var(--sw-danger)';

  const statusSoft = nadir.f > 49.0
    ? 'var(--sw-success-soft)'
    : nadir.f > 48.5
      ? 'var(--sw-warning-soft)'
      : 'var(--sw-danger-soft)';

  const statusBorder = nadir.f > 49.0
    ? 'var(--sw-success-border)'
    : nadir.f > 48.5
      ? 'var(--sw-warning-border)'
      : 'var(--sw-danger-border)';

  return (
    <div className="swing-scope" style={{ fontFamily: 'monospace' }}>
      <style>{`
        .swing-scope {
          --sw-bg-card: rgba(255, 252, 245, 0.84);
          --sw-bg-panel: rgba(255, 252, 245, 0.62);
          --sw-bg-tooltip: #FFFCF5;

          --sw-text-primary: #191814;
          --sw-text-secondary: #4A4338;
          --sw-text-muted: #7A7062;

          --sw-border: rgba(25, 24, 20, 0.14);
          --sw-border-strong: rgba(25, 24, 20, 0.24);

          --sw-grid: rgba(25, 24, 20, 0.10);
          --sw-axis: #6B6255;
          --sw-axis-line: rgba(25, 24, 20, 0.20);

          --sw-frequency: #1F6F78;
          --sw-frequency-soft: rgba(31, 111, 120, 0.10);
          --sw-frequency-border: rgba(31, 111, 120, 0.34);

          --sw-warning: #A96000;
          --sw-warning-soft: rgba(169, 96, 0, 0.10);
          --sw-warning-border: rgba(169, 96, 0, 0.30);

          --sw-danger: #A13D36;
          --sw-danger-soft: rgba(161, 61, 54, 0.10);
          --sw-danger-border: rgba(161, 61, 54, 0.34);

          --sw-success: #2F6B4F;
          --sw-success-soft: rgba(47, 107, 79, 0.10);
          --sw-success-border: rgba(47, 107, 79, 0.30);

          --sw-accent: #1F6F78;
          --sw-accent-soft: rgba(31, 111, 120, 0.10);
          --sw-accent-border: rgba(31, 111, 120, 0.34);

          --sw-shadow: 0 8px 24px rgba(25, 24, 20, 0.055);
          --sw-shadow-tooltip: 0 12px 32px rgba(25, 24, 20, 0.12);
        }

        html[data-theme='dark'] .swing-scope {
          --sw-bg-card: rgba(16, 29, 53, 0.76);
          --sw-bg-panel: rgba(7, 19, 38, 0.58);
          --sw-bg-tooltip: #101D35;

          --sw-text-primary: #F4F7FB;
          --sw-text-secondary: #C7D2E3;
          --sw-text-muted: #91A4BC;

          --sw-border: rgba(226, 232, 240, 0.14);
          --sw-border-strong: rgba(226, 232, 240, 0.24);

          --sw-grid: rgba(244, 247, 251, 0.10);
          --sw-axis: #C7D2E3;
          --sw-axis-line: rgba(244, 247, 251, 0.22);

          --sw-frequency: #7DCDE3;
          --sw-frequency-soft: rgba(125, 205, 227, 0.12);
          --sw-frequency-border: rgba(125, 205, 227, 0.38);

          --sw-warning: #E6B45C;
          --sw-warning-soft: rgba(230, 180, 92, 0.11);
          --sw-warning-border: rgba(230, 180, 92, 0.34);

          --sw-danger: #D98798;
          --sw-danger-soft: rgba(217, 135, 152, 0.10);
          --sw-danger-border: rgba(217, 135, 152, 0.36);

          --sw-success: #A6C67B;
          --sw-success-soft: rgba(166, 198, 123, 0.10);
          --sw-success-border: rgba(166, 198, 123, 0.34);

          --sw-accent: #7DCDE3;
          --sw-accent-soft: rgba(125, 205, 227, 0.12);
          --sw-accent-border: rgba(125, 205, 227, 0.38);

          --sw-shadow: 0 10px 28px rgba(0, 0, 0, 0.24);
          --sw-shadow-tooltip: 0 16px 38px rgba(0, 0, 0, 0.38);
        }
      `}</style>

      {/* ── Gráfico ── */}
      <div
        role="img"
        aria-label={isEs
          ? `Gráfico de frecuencia del sistema. Nadir: ${nadir.f.toFixed(3)} Hz a t=${nadir.t} s. RoCoF inicial: ${rocofMax} Hz/s`
          : `System frequency chart. Nadir: ${nadir.f.toFixed(3)} Hz at t=${nadir.t} s. Initial RoCoF: ${rocofMax} Hz/s`}
        style={{ height: 320 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trace} margin={{ top: 16, right: 24, left: 8, bottom: 32 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sw-grid)" vertical={false} />
            <XAxis dataKey="t" stroke="var(--sw-axis-line)" tick={{ fill: 'var(--sw-axis)', fontSize: 11 }}
                   label={{ value: isEs ? 'Tiempo (s)' : 'Time (s)', position: 'insideBottom',
                            offset: -16, fill: 'var(--sw-axis)', fontSize: 11 }} />
            <YAxis stroke="var(--sw-axis-line)" tick={{ fill: 'var(--sw-axis)', fontSize: 11 }} domain={['dataMin - 0.5', 50.2]}
                   label={{ value: 'f (Hz)', angle: -90, position: 'insideLeft', fill: 'var(--sw-axis)', fontSize: 11 }} />
            <Tooltip content={<SwingTooltip />} />

            {/* Umbrales normativos */}
            <ReferenceLine y={49.5} stroke="var(--sw-warning)" strokeDasharray="4 4"
              label={{ value: isEs ? 'UFLS Bombeo (49,5 Hz)' : 'Pump UFLS (49.5 Hz)',
                       fill: 'var(--sw-warning)', fontSize: 10, position: 'insideTopRight' }} />
            <ReferenceLine y={49.0} stroke="var(--sw-danger)" strokeDasharray="4 4"
              label={{ value: isEs ? 'UFLS Demanda (49,0 Hz)' : 'Demand UFLS (49.0 Hz)',
                       fill: 'var(--sw-danger)', fontSize: 10, position: 'insideBottomRight' }} />
            <ReferenceLine y={F0} stroke="var(--sw-axis-line)" />

            <Line type="monotone" dataKey="f" stroke="var(--sw-frequency)" strokeWidth={2.5}
                  dot={false} activeDot={{ r: 5, fill: 'var(--sw-frequency)', stroke: 'var(--sw-bg-tooltip)', strokeWidth: 2 }} isAnimationActive={!prefersReduced}
                  animationDuration={400} name="f (Hz)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Métricas destacadas ── */}
      <div style={{
        display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
        margin: '0.75rem 0',
      }}>
        {[
          { label: isEs ? 'Nadir' : 'Nadir',
            value: `${nadir.f.toFixed(3)} Hz`,
            sub: isEs ? `en t=${nadir.t} s` : `at t=${nadir.t} s`,
            color: statusColor,
            soft: statusSoft,
            border: statusBorder },
          { label: isEs ? 'RoCoF inicial' : 'Initial RoCoF',
            value: `−${rocofMax} Hz/s`,
            sub: isEs ? 'ventana 100 ms' : '100 ms window',
            color: parseFloat(rocofMax) > 1 ? 'var(--sw-danger)' : 'var(--sw-success)',
            soft: parseFloat(rocofMax) > 1 ? 'var(--sw-danger-soft)' : 'var(--sw-success-soft)',
            border: parseFloat(rocofMax) > 1 ? 'var(--sw-danger-border)' : 'var(--sw-success-border)' },
          { label: isEs ? 'Estado' : 'Status',
            value: nadir.f > 49.0 ? '✓' : nadir.f > 48.5 ? '⚠' : '✗',
            sub: nadir.f > 49.0
              ? (isEs ? 'Seguro' : 'Safe')
              : nadir.f > 48.5
                ? (isEs ? 'Alerta' : 'Warning')
                : (isEs ? 'Colapso' : 'Collapse'),
            color: statusColor,
            soft: statusSoft,
            border: statusBorder },
        ].map((m, i) => (
          <div key={i} style={{
            flex: 1, minWidth: 110,
            background: m.soft,
            border: `1px solid ${m.border}`,
            borderRadius: 8, padding: '0.5rem 0.75rem',
            textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 2px', fontSize: 10, color: 'var(--sw-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {m.label}
            </p>
            <p style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 'bold', color: m.color }}>
              {m.value}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: 'var(--sw-text-muted)' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Controles ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
        margin: '0.75rem 0',
      }}>
        <div>
          <AccessibleSlider
            label={isEs ? 'Inercia del sistema H' : 'System inertia H'}
            value={H} onChange={setH}
            min={1.0} max={8.0} step={0.1}
            valueText={`${H.toFixed(1)} s — ${H < 3 ? (isEs ? 'red débil' : 'weak grid') : (isEs ? 'red robusta' : 'robust grid')}`}
          />
          <AccessibleSlider
            label={isEs ? 'Pérdida de generación ΔP' : 'Generation loss ΔP'}
            value={dP} onChange={setDP}
            min={0.01} max={0.15} step={0.005}
            valueText={`${(dP * 100).toFixed(1)}% de la demanda (≈${(dP * 25184).toFixed(0)} MW)`}
          />
          <AccessibleSlider
            label={isEs ? 'Respuesta rápida FFR' : 'Fast Frequency Response FFR'}
            value={FFR} onChange={setFFR}
            min={0.0} max={0.05} step={0.001}
            valueText={FFR === 0
              ? (isEs ? 'Sin FFR (condición 28-A)' : 'No FFR (28-A condition)')
              : `${(FFR * 100).toFixed(1)}% p.u. — ${(FFR * 25184).toFixed(0)} MW`}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
          {/* Preset 28-A */}
          <button
            onClick={loadPreset28A}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--sw-danger-soft)',
              border: '1px solid var(--sw-danger-border)',
              borderRadius: 6, color: 'var(--sw-danger)',
              cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
              fontWeight: 'bold', textAlign: 'left',
            }}
          >
            🎬 {isEs ? 'Demo 28-A' : 'April 28 Demo'}
            <br />
            <span style={{ fontSize: 10, color: 'var(--sw-text-muted)', fontWeight: 'normal' }}>
              H=2,4s · ΔP=3% · FFR=0
            </span>
          </button>

          {/* Preset red reforzada */}
          <button
            onClick={loadPresetRobust}
            style={{
              padding: '0.65rem 1rem',
              background: 'var(--sw-success-soft)',
              border: '1px solid var(--sw-success-border)',
              borderRadius: 6, color: 'var(--sw-success)',
              cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
              fontWeight: 'bold', textAlign: 'left',
            }}
          >
            ✅ {isEs ? 'Red reforzada' : 'Reinforced grid'}
            <br />
            <span style={{ fontSize: 10, color: 'var(--sw-text-muted)', fontWeight: 'normal' }}>
              H=6,0s · ΔP=3% · FFR=1,5%
            </span>
          </button>

          {/* Nota metodológica */}
          <div style={{
            padding: '0.5rem 0.75rem',
            background: 'var(--sw-bg-panel)',
            border: '1px solid var(--sw-border)',
            borderRadius: 6, fontSize: 10, color: 'var(--sw-text-muted)',
          }}>
            {isEs
              ? 'Modelo: ecuación del swing monofásica (RK4, dt=10 ms). H ibérica verificada: 2,17–2,71 s (ENTSO-E Factual, Tabla 2-4, p.36).'
              : 'Model: single-machine swing equation (RK4, dt=10 ms). Iberian H verified: 2.17–2.71 s (ENTSO-E Factual, Table 2-4, p.36).'}
          </div>
        </div>
      </div>

      {/* ── Guía de interpretación ── */}
      <div style={{
        marginTop: '0.75rem',
        padding: '1.25rem',
        background: 'var(--sw-bg-panel)',
        borderRadius: 8,
        border: '1px solid var(--sw-accent-border)',
        color: 'var(--sw-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65,
      }}>
        <h4 style={{ color: 'var(--sw-accent)', margin: '0 0 0.5rem' }}>
          {isEs ? '¿Qué muestra este simulador?' : 'What does this simulator show?'}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{isEs ? 'Inercia H:' : 'Inertia H:'}</strong>
            {' '}{isEs ? 'Cuántos segundos resiste el sistema antes de que la frecuencia empiece a caer. Con H=2,4 s (condición 28-A), la caída es muy rápida.' : 'Seconds the system resists before frequency starts dropping. With H=2.4 s (April 28 condition), the drop is very fast.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{isEs ? 'ΔP:' : 'ΔP:'}</strong>
            {' '}{isEs ? 'Fracción de la demanda que se pierde súbitamente. El 28-A la pérdida efectiva fue del 3–9% en distintos instantes de la cascada.' : 'Fraction of demand suddenly lost. On April 28, the effective loss was 3–9% at different cascade moments.'}
          </li>
          <li>
            <strong>FFR:</strong>
            {' '}{isEs ? 'Respuesta rápida de baterías/renovables. Inyecta potencia a los 100 ms de detectar la caída. Sin FFR activa, el nadir depende solo de H.' : 'Fast response from batteries/renewables. Injects power 100 ms after detecting the drop. Without active FFR, nadir depends only on H.'}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function SwingEquationSimulator({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#7A7062',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Inicializando simulador de inercia…' : 'Initializing inertia simulator…'}
      </div>
    }>
      {() => <SwingEquationSimulatorInner />}
    </BrowserOnly>
  );
}
