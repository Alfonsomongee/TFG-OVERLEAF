import React, { useState, useMemo, useCallback } from 'react';
import styles from './SIRDisinformationDelayFigure.module.css';

export default function SIRDisinformationDelayFigure() {
  const [activeCurve, setActiveCurve] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const activate = useCallback((c) => setActiveCurve(c), []);
  const deactivate = useCallback(() => setActiveCurve(null), []);

  const margin = { top: 28, right: 24, bottom: 48, left: 50 };
  const W = 760, H = 320;
  const pw = W - margin.left - margin.right;
  const ph = H - margin.top - margin.bottom;

  /* ── SIR curves (conceptual, Euler integration) ── */
  const sirData = useMemo(() => {
    const pts = [];
    let S = 0.95, I = 0.05, R = 0.0;
    const beta = 3.2;
    const dt = 0.005;
    const steps = 200;
    const gammaStart = 0.35; // after press conference
    const pressStep = 80; // ~40% into timeline

    for (let n = 0; n <= steps; n++) {
      const t = n / steps;
      pts.push({ t, S, I, R });
      const gamma = n >= pressStep ? gammaStart + 0.4 * ((n - pressStep) / (steps - pressStep)) : 0.04;
      const dS = -beta * S * I * dt;
      const dI = (beta * S * I - gamma * I) * dt;
      const dR = gamma * I * dt;
      S = Math.max(0, S + dS);
      I = Math.max(0, I + dI);
      R = Math.max(0, R + dR);
    }
    return pts;
  }, []);

  const xS = (v) => margin.left + v * pw;
  const yS = (v) => margin.top + ph - v * ph;

  const curvePath = (key) =>
    sirData.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.t).toFixed(1)},${yS(d[key]).toFixed(1)}`).join(' ');

  /* ── Key positions ── */
  const pressX = xS(0.4);
  const vacuumEnd = xS(0.4);

  /* ── Peak of I ── */
  const peakI = sirData.reduce((max, d) => d.I > max.I ? d : max, sirData[0]);

  const isHighlighted = (key) => activeCurve === null || activeCurve === key;

  const curveInfo = {
    S: 'S — Susceptibles: población sin marco informativo fiable. Desciende conforme la narrativa falsa o la información verificada alcanzan a más personas.',
    I: 'I — Bulo activo: personas expuestas a la narrativa falsa. Crece rápidamente durante el vacío informativo y alcanza su pico antes de que la corrección sea efectiva.',
    R: 'R — Información verificada: personas que han recibido la explicación técnica oficial. Crece con retraso respecto al pico del bulo.',
    vacuum: 'Vacío informativo: período sin explicación oficial. Durante este tiempo, la tasa de corrección γ es muy baja y el bulo se propaga casi sin oposición.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Comunicación de crisis · Modelo SIR</p>
        <h3 className={styles.title}>El coste temporal del vacío informativo</h3>
        <p className={styles.subtitle}>
          La desinformación se propaga más rápido cuando la explicación oficial llega después de que la narrativa falsa haya alcanzado masa crítica.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>dS/dt = −βSI</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eq}>dI/dt = βSI − γI</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eq}>dR/dt = γI</span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="sir-title sir-desc"
        >
          <title id="sir-title">Modelo SIR adaptado a la propagación de desinformación durante una crisis técnica</title>
          <desc id="sir-desc">
            Tres curvas S, I y R representan susceptibles, bulo activo e información verificada.
            Una banda de vacío informativo muestra el período sin comparecencia oficial.
            La curva I alcanza su pico antes de que la corrección empiece a ser efectiva.
          </desc>

          {/* ── Vacuum band ── */}
          <rect
            x={margin.left} y={margin.top}
            width={vacuumEnd - margin.left} height={ph}
            className={`${styles.vacuumBand} ${hoveredZone === 'vacuum' ? styles.vacuumBandActive : ''}`}
            onMouseEnter={() => { setHoveredZone('vacuum'); activate('vacuum'); }}
            onMouseLeave={() => { setHoveredZone(null); deactivate(); }}
            onFocus={() => { setHoveredZone('vacuum'); activate('vacuum'); }}
            onBlur={() => { setHoveredZone(null); deactivate(); }}
            tabIndex={0}
            role="button"
            aria-label="Banda de vacío informativo"
          />
          <text x={margin.left + 10} y={margin.top + 16} className={styles.vacuumLabel}>vacío informativo</text>

          {/* ── Press conference line ── */}
          <line x1={pressX} y1={margin.top} x2={pressX} y2={margin.top + ph}
            className={styles.pressLine} />
          <text x={pressX + 5} y={margin.top + 14} className={styles.pressLabel}>
            primera comparecencia oficial
          </text>

          {/* ── Curves ── */}
          <path d={curvePath('S')}
            className={`${styles.curveS} ${isHighlighted('S') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('S')} onMouseLeave={deactivate}
            onFocus={() => activate('S')} onBlur={deactivate}
            tabIndex={0} role="button" aria-label="Curva S, susceptibles"
          />
          <path d={curvePath('I')}
            className={`${styles.curveI} ${isHighlighted('I') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('I')} onMouseLeave={deactivate}
            onFocus={() => activate('I')} onBlur={deactivate}
            tabIndex={0} role="button" aria-label="Curva I, bulo activo"
          />
          <path d={curvePath('R')}
            className={`${styles.curveR} ${isHighlighted('R') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('R')} onMouseLeave={deactivate}
            onFocus={() => activate('R')} onBlur={deactivate}
            tabIndex={0} role="button" aria-label="Curva R, información verificada"
          />

          {/* ── Peak annotation ── */}
          <circle cx={xS(peakI.t)} cy={yS(peakI.I)} r="4" className={styles.peakDot} />
          {(activeCurve === 'I' || activeCurve === null) && (
            <text x={xS(peakI.t) + 8} y={yS(peakI.I) - 8} className={styles.peakLabel}>
              masa crítica del bulo
            </text>
          )}

          {/* ── Axes ── */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + ph} className={styles.axis} />
          <line x1={margin.left} y1={margin.top + ph} x2={margin.left + pw} y2={margin.top + ph} className={styles.axis} />

          {/* ── X ticks ── */}
          {[{ l: '0 h', t: 0 }, { l: 'vacío', t: 0.2 }, { l: 'comparecencia', t: 0.4 }, { l: 'corrección tardía', t: 0.75 }].map(({ l, t }) => (
            <text key={l} x={xS(t)} y={margin.top + ph + 20} className={styles.tickLabel} textAnchor="middle">{l}</text>
          ))}

          <text x={margin.left + pw / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">
            tiempo desde el apagón
          </text>
          <text x={14} y={margin.top + ph / 2} className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 14, ${margin.top + ph / 2})`}>
            proporción narrativa
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeCurve && curveInfo[activeCurve] ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeCurve && curveInfo[activeCurve] ? curveInfo[activeCurve] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        {[
          { key: 'S', label: 'S · susceptibles', cls: styles.dotS },
          { key: 'I', label: 'I · bulo activo', cls: styles.dotI },
          { key: 'R', label: 'R · información verificada', cls: styles.dotR },
        ].map(({ key, label, cls }) => (
          <span key={key}
            className={`${styles.legendItem} ${activeCurve === key ? styles.legendItemActive : ''}`}
            onMouseEnter={() => activate(key)} onMouseLeave={deactivate}
            onFocus={() => activate(key)} onBlur={deactivate}
            tabIndex={0} role="button" aria-label={`Resaltar ${label}`}>
            <i className={cls} /> {label}
          </span>
        ))}
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> Cuando γ, la tasa de corrección oficial, llega tarde, la curva I puede alcanzar su máximo antes de que la información verificada empiece a recuperar el espacio narrativo.
      </div>
    </figure>
  );
}
