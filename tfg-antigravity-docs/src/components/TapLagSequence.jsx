/**
 * TapLagSequence.jsx
 * Diagrama SVG animado del efecto Tap-Lag — mecanismo causal del 28-A.
 *
 * EL MECANISMO EN 5 PASOS (verificado en ENTSO-E Factual, p.28 / IIT-ICAI):
 *
 * PASO 1 — Estado nominal (antes de 12:30 CEST)
 *   Red colectora 220 kV en tensión normal (~220 kV).
 *   OLTC en posición neutra. SCADA de REE muestra 400 kV normal.
 *
 * PASO 2 — Crecimiento de tensión en el colector (12:30–12:32 CEST)
 *   La alta penetración FV genera exceso de reactiva capacitiva.
 *   La tensión sube en la red colectora 220 kV.
 *   El OLTC intenta compensar: cambia de toma mecánicamente (inercia ~30-90s).
 *   El SCADA de REE sigue viendo el lado 400 kV: todo parece normal.
 *
 * PASO 3 — Desacoplamiento Tap-Lag (12:32 CEST)
 *   El OLTC no puede seguir el ritmo: la tensión en 220 kV supera 1.05 p.u.
 *   El primario 400 kV está dentro de límites → SCADA no detecta el problema.
 *   Hay una "brecha de observabilidad": REE está ciego a la sobretensión real.
 *
 * PASO 4 — Umbral ANSI 59 superado (12:32:57 CEST)
 *   La tensión en el colector 220 kV alcanza ~242 kV (1.10 p.u.).
 *   El relé ANSI 59 del transformador de Granada dispara.
 *   Pérdida instantánea: −355 MW activos, −165 MVAr de absorción reactiva.
 *
 * PASO 5 — Cascada (12:32:57–12:33:27 CEST)
 *   La reactiva perdida eleva la tensión en nudos vecinos.
 *   Más plantas cruzan el umbral ANSI 59. Bucle de retroalimentación positiva.
 *   En 30 segundos: −15 GW, cero eléctrico sistémico.
 *
 * DISEÑO:
 *   - SVG puro con animaciones CSS: sin dependencias externas.
 *   - Estética "oscilloscope forense": fondo oscuro, trazos neón, tipografía monospace.
 *   - Navegación: botones paso anterior/siguiente + barra de progreso clicable.
 *   - prefers-reduced-motion: desactiva las animaciones de pulso/parpadeo.
 *   - role="img" + aria-label descriptivo por paso.
 *   - Prop `lang` para ES/EN.
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Paleta forense ───────────────────────────────────────────────────────────
const C = {
  bg:       'var(--chart-bg, #060d1a)',
  grid:     'rgba(0,217,255,0.06)',
  normal:   '#00d9ff',   // tensión normal
  warning:  '#f59e0b',   // tensión en alerta
  critical: '#ef4444',   // tensión crítica / disparo
  scada:    '#10b981',   // lo que ve el SCADA (400 kV)
  hidden:   '#a78bfa',   // lo que NO ve el SCADA (220 kV colector)
  text:     'var(--ifm-font-color-base)',
  dim:      'var(--ifm-color-emphasis-400)',
  border:   'rgba(0,217,255,0.15)',
};

// ─── Datos de cada paso ───────────────────────────────────────────────────────
function getSteps(lang) {
  const isEs = lang === 'es';
  return [
    {
      id: 1,
      time: isEs ? 'Antes de 12:30 CEST' : 'Before 12:30 CEST',
      title: isEs ? 'Estado nominal' : 'Nominal state',
      subtitle: isEs
        ? 'El sistema opera dentro de los límites del P.O. 1.1.'
        : 'System operates within P.O. 1.1 limits.',
      v400:   1.00,   // p.u. — lo que ve el SCADA
      v220:   1.00,   // p.u. — tensión real en colector
      oltcPos: 0,     // posición relativa OLTC (-1 a +1)
      ansi59:  false,
      cascade: false,
      scadaAlert: false,
      note: isEs
        ? 'SCADA REE: tensión 400 kV = 1,00 p.u. ✓'
        : 'REE SCADA: 400 kV voltage = 1.00 p.u. ✓',
    },
    {
      id: 2,
      time: isEs ? '12:30–12:32 CEST' : '12:30–12:32 CEST',
      title: isEs ? 'Tensión sube en el colector' : 'Voltage rises in collector',
      subtitle: isEs
        ? 'Alta penetración FV genera exceso de reactiva capacitiva. El OLTC intenta compensar.'
        : 'High PV penetration generates excess capacitive reactive. OLTC tries to compensate.',
      v400:   1.03,
      v220:   1.06,
      oltcPos: 0.4,
      ansi59:  false,
      cascade: false,
      scadaAlert: false,
      note: isEs
        ? 'SCADA REE: 400 kV = 1,03 p.u. — dentro de límites. OLTC ajustando…'
        : 'REE SCADA: 400 kV = 1.03 p.u. — within limits. OLTC adjusting…',
    },
    {
      id: 3,
      time: isEs ? '~12:32 CEST' : '~12:32 CEST',
      title: isEs ? 'Desacoplamiento Tap-Lag' : 'Tap-Lag decoupling',
      subtitle: isEs
        ? 'El OLTC no puede seguir el ritmo. La tensión en 220 kV supera 1,05 p.u. El SCADA sigue ciego.'
        : 'OLTC cannot keep up. Voltage in 220 kV exceeds 1.05 p.u. SCADA remains blind.',
      v400:   1.04,
      v220:   1.08,
      oltcPos: 0.8,
      ansi59:  false,
      cascade: false,
      scadaAlert: false,
      note: isEs
        ? '⚠ SCADA REE: 400 kV = 1,04 p.u. — tolerable. Red colectora: 1,08 p.u. — INVISIBLE para REE'
        : '⚠ REE SCADA: 400 kV = 1.04 p.u. — tolerable. Collector: 1.08 p.u. — INVISIBLE to REE',
    },
    {
      id: 4,
      time: '12:32:57 CEST',
      title: isEs ? 'Disparo ANSI 59 en Granada' : 'ANSI 59 trip in Granada',
      subtitle: isEs
        ? 'El colector 220 kV alcanza ~242 kV (1,10 p.u.). El relé ANSI 59 dispara. −355 MW, −165 MVAr.'
        : 'Collector 220 kV reaches ~242 kV (1.10 p.u.). ANSI 59 relay trips. −355 MW, −165 MVAr.',
      v400:   1.05,
      v220:   1.10,
      oltcPos: 1.0,
      ansi59:  true,
      cascade: false,
      scadaAlert: true,
      note: isEs
        ? '🔴 DISPARO: 242 kV en colector (>1,10 p.u.). ENTSO-E Factual, p.28'
        : '🔴 TRIP: 242 kV at collector (>1.10 p.u.). ENTSO-E Factual, p.28',
    },
    {
      id: 5,
      time: '12:32:57–12:33:27 CEST',
      title: isEs ? 'Cascada geométrica' : 'Geometric cascade',
      subtitle: isEs
        ? 'La reactiva perdida eleva la tensión en nudos vecinos. Badajoz −730 MW, Sevilla −550 MW. En 30 segundos: cero eléctrico.'
        : 'Lost reactive raises voltage at neighbouring nodes. Badajoz −730 MW, Seville −550 MW. In 30 seconds: electrical zero.',
      v400:   0.00,
      v220:   0.00,
      oltcPos: 0,
      ansi59:  true,
      cascade: true,
      scadaAlert: true,
      note: isEs
        ? '🔴 CASCADA: −1.635 MW en <30s → cero sistémico. Comité de Análisis, p.38'
        : '🔴 CASCADE: −1,635 MW in <30s → systemic zero. Analysis Committee, p.38',
    },
  ];
}

// ─── SVG principal ────────────────────────────────────────────────────────────
function DiagramSVG({ step, prefersReduced }) {
  const W = 780, H = 460;
  const isLast = step.cascade;

  // Tensiones normalizadas para la barra visual
  const bar400H = Math.round(step.v400 * 100);
  const bar220H = Math.round(step.v220 * 100);

  // Color de la barra según nivel
  const colorBar = (v) => {
    if (v === 0)   return C.dim;
    if (v >= 1.10) return C.critical;
    if (v >= 1.05) return C.warning;
    return C.normal;
  };

  // Posición OLTC visual (0=neutro, 1=máximo ajuste)
  const oltcY = 170 - Math.round(step.oltcPos * 35);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: W, display: 'block', margin: '0 auto' }}
      role="img"
      aria-label={`Paso ${step.id}: ${step.title}. ${step.subtitle}`}
    >
      <defs>
        {/* Grid de fondo */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d={`M 20 0 L 0 0 0 20`} fill="none" stroke={C.grid} strokeWidth="0.5" />
        </pattern>
        {/* Glow neón */}
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-red">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-amber">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Fondo */}
      <rect width={W} height={H} fill={C.bg} />
      <rect width={W} height={H} fill="url(#grid)" />

      {/* ── SECCIÓN IZQUIERDA: Red de Transporte 400 kV (lo que ve REE) ── */}
      <text x="20" y="22" fill={C.scada} fontSize="13" fontFamily="monospace"
            fontWeight="700" letterSpacing="0.1em">
        RED 400 kV — VISIBLE PARA SCADA REE
      </text>

      {/* Barra 400 kV */}
      <rect x="20" y="35" width="180" height="8" rx="2"
            fill="rgba(16,185,129,0.15)" stroke={C.scada} strokeWidth="1" />
      <rect x="20" y="35" width={Math.min(180, Math.round(step.v400 * 180))} height="8" rx="2"
            fill={colorBar(step.v400)} opacity="0.9">
        {!prefersReduced && (
          <animate attributeName="width"
            from="0" to={Math.min(180, Math.round(step.v400 * 180))}
            dur="1.2s" fill="freeze" />
        )}
      </rect>
      <text x="210" y="43" fill={colorBar(step.v400)} fontSize="13"
            fontFamily="monospace" fontWeight="bold">
        {step.v400 === 0 ? '0' : step.v400.toFixed(2)} p.u.
      </text>

      {/* Línea de transmisión */}
      <line x1="20" y1="60" x2="200" y2="60"
            stroke={step.scadaAlert ? C.warning : C.scada}
            strokeWidth="3" strokeDasharray={step.scadaAlert ? '8 4' : 'none'}
            filter={step.scadaAlert ? 'url(#glow-amber)' : 'url(#glow-cyan)'} />
      <text x="100" y="75" fill={C.dim} fontSize="15" fontFamily="monospace"
            textAnchor="middle">Línea 400 kV</text>

      {/* ── TRANSFORMADOR OLTC (centro) ── */}
      {/* Cuerpo del transformador */}
      <rect x="265" y="100" width="90" height="100" rx="4"
            fill="rgba(0,217,255,0.04)" stroke={step.ansi59 ? C.critical : C.border}
            strokeWidth={step.ansi59 ? 2 : 1}
            filter={step.ansi59 ? 'url(#glow-red)' : 'none'} />

      {/* Etiqueta TR */}
      <text x="310" y="120" fill={step.ansi59 ? C.critical : C.dim}
            fontSize="15" fontFamily="monospace" textAnchor="middle" fontWeight="700">
        TR 400/220kV
      </text>
      <text x="310" y="133" fill={step.ansi59 ? C.critical : C.dim}
            fontSize="13" fontFamily="monospace" textAnchor="middle">
        OLTC
      </text>

      {/* Indicador de posición OLTC */}
      <rect x="285" y="140" width="40" height="50" rx="2"
            fill="rgba(255,255,255,0.03)" stroke={C.border} strokeWidth="1" />
      <text x="310" y="153" fill={C.dim} fontSize="13" fontFamily="monospace"
            textAnchor="middle">Toma</text>
      {/* Aguja de posición */}
      <line x1="310" y1="185" x2="310" y2={oltcY + 30}
            stroke={step.oltcPos > 0.8 ? C.warning : C.dim}
            strokeWidth="2" />
      <circle cx="310" cy={oltcY + 30} r="3"
              fill={step.oltcPos > 0.8 ? C.warning : C.dim} />

      {/* Símbolo ANSI 59 si disparado */}
      {step.ansi59 && (
        <>
          <rect x="270" y="196" width="80" height="18" rx="3"
                fill={C.critical} opacity="0.9"
                filter="url(#glow-red)">
            {!prefersReduced && (
              <animate attributeName="opacity"
                values="1;0.2;1" dur="0.75s" repeatCount="indefinite" />
            )}
          </rect>
          <text x="310" y="209" fill="#fff" fontSize="15"
                fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            ⚡ ANSI 59
          </text>
        </>
      )}

      {/* ── SECCIÓN DERECHA: Red Colectora 220 kV (oculta para REE) ── */}
      <text x="390" y="22" fill={C.hidden} fontSize="13" fontFamily="monospace"
            fontWeight="700" letterSpacing="0.05em">
        RED 220 kV — INVISIBLE PARA SCADA
      </text>

      {/* Barra 220 kV colector */}
      <rect x="390" y="35" width="180" height="8" rx="2"
            fill="rgba(167,139,250,0.1)" stroke={C.hidden} strokeWidth="1" />
      <rect x="390" y="35" width={isLast ? 0 : Math.min(180, Math.round(step.v220 * 180))} height="8" rx="2"
            fill={colorBar(step.v220)} opacity="0.9">
        {!prefersReduced && (
          <animate attributeName="width"
            from="0" to={isLast ? 0 : Math.min(180, Math.round(step.v220 * 180))}
            dur="1.2s" fill="freeze" />
        )}
      </rect>
      <text x="578" y="43" fill={colorBar(step.v220)} fontSize="13"
            fontFamily="monospace" fontWeight="bold">
        {isLast ? '—' : `${step.v220.toFixed(2)} p.u.`}
      </text>

      {/* Plantas FV (colector) */}
      {[0, 1, 2].map(i => {
        const x = 400 + i * 60;
        const fallen = isLast || (step.ansi59 && i === 0);
        return (
          <g key={i}>
            <line x1={x + 12} y1="60" x2={x + 12} y2="90"
                  stroke={fallen ? C.dim : C.hidden}
                  strokeWidth="1.5" strokeDasharray={fallen ? '4 3' : 'none'} />
            {/* Panel FV */}
            <rect x={x} y="90" width="24" height="14" rx="1"
                  fill={fallen ? 'rgba(71,85,105,0.3)' : 'rgba(167,139,250,0.2)'}
                  stroke={fallen ? C.dim : C.hidden} strokeWidth="1" />
            {/* Líneas del panel */}
            {[4, 8, 12].map(lx => (
              <line key={lx} x1={x + lx} y1="90" x2={x + lx} y2="104"
                    stroke={fallen ? C.dim : C.hidden} strokeWidth="0.5" opacity="0.5" />
            ))}
            <text x={x + 12} y="118" fill={fallen ? C.dim : C.hidden}
                  fontSize="13" fontFamily="monospace" textAnchor="middle">
              {fallen ? 'TRIP' : 'FV'}
            </text>
            {/* Potencia */}
            <text x={x + 12} y="128" fill={fallen ? C.critical : C.hidden}
                  fontSize="13" fontFamily="monospace" textAnchor="middle">
              {fallen ? '0 MW' : (i === 0 ? '355MW' : i === 1 ? '730MW' : '550MW')}
            </text>
          </g>
        );
      })}

      {/* ── BRECHA DE OBSERVABILIDAD (el elemento clave del Tap-Lag) ── */}
      {step.id >= 3 && (
        <>
          {/* Zona ciega */}
          <rect x="265" y="55" width="350" height="35" rx="3"
                fill="rgba(245,158,11,0.07)"
                stroke={C.warning} strokeWidth="1" strokeDasharray="5 3"
                opacity={step.id >= 3 ? 1 : 0}>
            {!prefersReduced && (
              <animate attributeName="opacity"
                from="0" to="1" dur="1.2s" fill="freeze" />
            )}
          </rect>
          <text x="440" y="68" fill={C.warning} fontSize="13"
                fontFamily="monospace" textAnchor="middle" fontWeight="700">
            ZONA CIEGA SCADA
          </text>
          <text x="440" y="80" fill={C.warning} fontSize="13"
                fontFamily="monospace" textAnchor="middle" opacity="0.8">
            REE no observa la red colectora
          </text>
        </>
      )}

      {/* ── BARRA DE TENSIÓN VISUAL (gauge) ── */}
      {/* 400 kV gauge */}
      <text x="20" y="165" fill={C.dim} fontSize="13" fontFamily="monospace">
        V₄₀₀ (p.u.)
      </text>
      <rect x="20" y="180" width="14" height="110" rx="2"
            fill="rgba(255,255,255,0.04)" stroke={C.border} strokeWidth="1" />
      <rect x="20" y={180 + 110 - bar400H} width="14" height={bar400H} rx="2"
            fill={colorBar(step.v400)} />
      {/* Marcas */}
      {[0.9, 1.1].map(v => {
        const y = 290 - Math.round(v * 90);
        return (
          <g key={v}>
            <line x1="32" y1={y} x2="36" y2={y}
                  stroke={v >= 1.1 ? C.critical : v >= 1.05 ? C.warning : C.dim}
                  strokeWidth="1" />
            <text x="38" y={y + 3} fill={v >= 1.1 ? C.critical : C.dim}
                  fontSize="11" fontFamily="monospace">{v.toFixed(2)}</text>
          </g>
        );
      })}

      {/* 220 kV gauge */}
      <text x="710" y="165" fill={C.dim} fontSize="13" fontFamily="monospace"
            textAnchor="end">V₂₂₀ (p.u.)</text>
      <rect x="726" y="180" width="14" height="110" rx="2"
            fill="rgba(255,255,255,0.04)" stroke={C.border} strokeWidth="1" />
      <rect x="726" y={isLast ? 290 : 180 + 110 - bar220H} width="14"
            height={isLast ? 0 : bar220H} rx="2"
            fill={colorBar(step.v220)} />
      {[0.9, 1.1].map(v => {
        const y = 290 - Math.round(v * 90);
        return (
          <g key={v}>
            <line x1="722" y1={y} x2="726" y2={y}
                  stroke={v >= 1.1 ? C.critical : v >= 1.05 ? C.warning : C.dim}
                  strokeWidth="1" />
            <text x="720" y={y + 3} fill={v >= 1.1 ? C.critical : C.dim}
                  fontSize="11" fontFamily="monospace" textAnchor="end">
              {v.toFixed(2)}
            </text>
          </g>
        );
      })}

      {/* Umbral ANSI 59 (línea roja en ambos gauges) */}
      <line x1="20" y1={290 - Math.round(1.10 * 90)} x2="68" y2={290 - Math.round(1.10 * 90)}
            stroke={C.critical} strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
      <line x1="722" y1={290 - Math.round(1.10 * 90)} x2="738" y2={290 - Math.round(1.10 * 90)}
            stroke={C.critical} strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
      <text x="72" y={290 - Math.round(1.10 * 90) + 3} fill={C.critical}
            fontSize="13" fontFamily="monospace">ANSI 59</text>

      {/* ── CASCADA VISUAL (paso 5) ── */}
      {isLast && (
        <>
          <rect x="40" y="145" width="680" height="95" rx="4"
                fill="rgba(239,68,68,0.08)"
                stroke={C.critical} strokeWidth="1.5"
                filter="url(#glow-red)" />
          <text x="380" y="178" fill={C.critical} fontSize="18"
                fontFamily="monospace" textAnchor="middle" fontWeight="bold"
                filter="url(#glow-red)">
            CERO ELÉCTRICO SISTÉMICO
          </text>
          <text x="380" y="200" fill={C.critical} fontSize="15"
                fontFamily="monospace" textAnchor="middle">
            −15 GW en 30 segundos · 25.184 MW de demanda sin suministro
          </text>
          <text x="380" y="217" fill="#f87171" fontSize="13"
                fontFamily="monospace" textAnchor="middle" opacity="0.8">
            ~60 millones de personas · primer colapso por sobretensión en Europa Continental
          </text>
        </>
      )}

      {/* ── NOTA INFERIOR ── */}
      <rect x="20" y="360" width="720" height="44" rx="3"
            fill="rgba(255,255,255,0.02)" stroke={C.border} strokeWidth="1" />
      <text x="36" y="378" fill={step.ansi59 ? C.critical : C.dim}
            fontSize="13" fontFamily="monospace">
        {step.note}
      </text>
      <text x="36" y="394" fill={C.dim} fontSize="15" fontFamily="monospace">
        {step.time}
      </text>
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function TapLagSequenceInner({}) {
  const lang = useDocLang();
  const [activeStep, setActiveStep] = useState(0);
  const steps = useMemo(() => getSteps(lang), [lang]);
  const step  = steps[activeStep];
  const isEs  = lang === 'es';

  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const prev = useCallback(() => setActiveStep(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setActiveStep(s => Math.min(steps.length - 1, s + 1)), [steps.length]);

  const phaseColor = step.cascade ? C.critical : step.ansi59 ? C.critical : step.id >= 3 ? C.warning : C.normal;

  return (
    <div style={{ fontFamily: 'monospace' }}>

      {/* Título del paso */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div>
          <span style={{
            fontSize: 10, color: phaseColor, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {isEs ? `Paso ${step.id} de ${steps.length}` : `Step ${step.id} of ${steps.length}`}
            {' · '}{step.time}
          </span>
          <h4 style={{ margin: '4px 0 0', fontSize: 15, color: phaseColor }}>
            {step.title}
          </h4>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.5 }}>
            {step.subtitle}
          </p>
        </div>

        {/* Controles */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            onClick={prev}
            disabled={activeStep === 0}
            aria-label={isEs ? 'Paso anterior' : 'Previous step'}
            style={{
              padding: '0.35rem 0.75rem',
              background: 'transparent',
              border: `1px solid ${activeStep === 0 ? C.border : phaseColor}`,
              borderRadius: 4, color: activeStep === 0 ? C.dim : phaseColor,
              cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace', fontSize: 13,
              opacity: activeStep === 0 ? 0.4 : 1,
            }}
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={activeStep === steps.length - 1}
            aria-label={isEs ? 'Paso siguiente' : 'Next step'}
            style={{
              padding: '0.35rem 0.75rem',
              background: activeStep < steps.length - 1 ? `${phaseColor}22` : 'transparent',
              border: `1px solid ${activeStep === steps.length - 1 ? C.border : phaseColor}`,
              borderRadius: 4, color: activeStep === steps.length - 1 ? C.dim : phaseColor,
              cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'monospace', fontSize: 13,
              opacity: activeStep === steps.length - 1 ? 0.4 : 1,
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Barra de progreso clicable */}
      <div style={{
        display: 'flex', gap: '3px', marginBottom: '0.75rem',
      }}
        role="tablist"
        aria-label={isEs ? 'Pasos del mecanismo Tap-Lag' : 'Tap-Lag mechanism steps'}
      >
        {steps.map((s, i) => {
          const c = s.cascade ? C.critical : s.ansi59 ? C.critical : s.id >= 3 ? C.warning : C.normal;
          const isActive = i === activeStep;
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveStep(i)}
              title={s.title}
              style={{
                flex: isActive ? 2 : 1,
                height: 4,
                background: isActive ? c : i < activeStep ? `${c}66` : 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: 2,
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.25s ease',
              }}
            />
          );
        })}
      </div>

      {/* SVG */}
      <div style={{
        background: C.bg,
        borderRadius: 10,
        border: `1px solid ${phaseColor}30`,
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
      }}>
        <DiagramSVG step={step} prefersReduced={prefersReduced} />
      </div>

      {/* Leyenda */}
      <div style={{
        marginTop: '0.75rem',
        display: 'flex', flexWrap: 'wrap', gap: '1rem',
        fontSize: 11, color: C.dim,
      }}>
        {[
          { color: C.scada,    label: isEs ? 'Visible para SCADA REE (400 kV)' : 'Visible to REE SCADA (400 kV)' },
          { color: C.hidden,   label: isEs ? 'Invisible para REE (220 kV colector)' : 'Invisible to REE (220 kV collector)' },
          { color: C.warning,  label: isEs ? 'Tensión en alerta (>1,05 p.u.)' : 'Voltage alert (>1.05 p.u.)' },
          { color: C.critical, label: isEs ? 'Umbral ANSI 59 (>1,10 p.u.)' : 'ANSI 59 threshold (>1.10 p.u.)' },
        ].map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
            <span>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '0.75rem',
        fontSize: 11, color: '#374151',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '0.6rem',
      }}>
        {isEs
          ? 'Fuentes: ENTSO-E Factual Report (2025), p.28 · IIT-ICAI / Compass Lexecon · Comité de Análisis del Gobierno (2025), p.38'
          : 'Sources: ENTSO-E Factual Report (2025), p.28 · IIT-ICAI / Compass Lexecon · Government Analysis Committee (2025), p.38'}
      </div>
    </div>
  );
}

export default function TapLagSequence({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 380, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--ifm-color-emphasis-400)',
        fontFamily: 'monospace', fontSize: 13,
        background: 'var(--chart-bg, #060d1a)', borderRadius: 10,
      }}>
        {lang === 'es' ? 'Inicializando diagrama Tap-Lag…' : 'Initializing Tap-Lag diagram…'}
      </div>
    }>
      {() => <TapLagSequenceInner />}
    </BrowserOnly>
  );
}
