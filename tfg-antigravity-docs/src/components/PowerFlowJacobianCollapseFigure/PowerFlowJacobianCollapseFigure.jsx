import React, { useState, useCallback } from 'react';
import styles from './PowerFlowJacobianCollapseFigure.module.css';

export default function PowerFlowJacobianCollapseFigure() {
  const [activeZone, setActiveZone] = useState(null);
  const [hoveredPt, setHoveredPt] = useState(false);

  const activate = useCallback((z) => setActiveZone(z), []);
  const deactivate = useCallback(() => setActiveZone(null), []);

  const margin = { top: 28, right: 24, bottom: 48, left: 62 };
  const W = 760, H = 320;
  const pw = W - margin.left - margin.right;
  const ph = H - margin.top - margin.bottom;

  /* σmin(J) curve — conceptual hyperbolic decay */
  const curveData = [];
  for (let i = 0; i <= 120; i++) {
    const t = i / 120;
    const stress = t;
    const sigma = 0.95 * Math.exp(-3.2 * t * t) + 0.04 * (1 - t);
    curveData.push({ stress, sigma: Math.max(0.01, sigma) });
  }

  const xS = (v) => margin.left + v * pw;
  const yS = (v) => margin.top + ph - v * ph;

  const pathD = curveData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.stress).toFixed(1)},${yS(d.sigma).toFixed(1)}`)
    .join(' ');

  /* Zone boundary — around stress = 0.55 */
  const zoneBoundaryX = xS(0.55);
  const criticalBandY = yS(0.12);

  /* Sensitivity point — steep part of the curve */
  const sensIdx = curveData.findIndex((d) => d.sigma <= 0.35);
  const sensPt = curveData[sensIdx] || curveData[70];

  const zoneInfo = {
    safe: 'El sistema cumple N−1 en régimen permanente. Los valores singulares del Jacobiano mantienen margen, pero este margen puede ser engañoso si no se evalúa la dinámica rápida.',
    critical: 'σmin(J) se aproxima a cero. Pequeñas perturbaciones de P o Q producen grandes variaciones de θ y V. El análisis estático N−1 puede seguir dando resultado positivo mientras el margen dinámico real se agota.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Flujo de cargas · Jacobiano</p>
        <h3 className={styles.title}>El margen oculto antes del colapso de tensión</h3>
        <p className={styles.subtitle}>
          Cuando el Jacobiano se aproxima a singularidad, pequeñas perturbaciones de P/Q producen grandes desviaciones de tensión y ángulo.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>[ΔP, ΔQ]<sup>T</sup> = J · [Δθ, ΔV]<sup>T</sup></span>
        <span className={styles.eqSep}>→</span>
        <span className={styles.eq}>σ<sub>min</sub>(J) → 0</span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="jac-title jac-desc"
        >
          <title id="jac-title">Pérdida de margen del Jacobiano del flujo de cargas</title>
          <desc id="jac-desc">
            Curva descendente del menor valor singular del Jacobiano σmin(J) conforme aumenta el estrés de red.
            A la izquierda, zona donde N−1 parece cumplirse. A la derecha, zona de margen crítico donde σmin se aproxima a cero.
          </desc>

          {/* ── Background zones ── */}
          <rect
            x={margin.left} y={margin.top}
            width={zoneBoundaryX - margin.left} height={ph}
            className={`${styles.zoneFill} ${styles.zoneSafe} ${activeZone === 'safe' ? styles.zoneActive : ''}`}
            onMouseEnter={() => activate('safe')}
            onMouseLeave={deactivate}
            onFocus={() => activate('safe')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Zona N−1 aparentemente segura"
          />
          <rect
            x={zoneBoundaryX} y={margin.top}
            width={margin.left + pw - zoneBoundaryX} height={ph}
            className={`${styles.zoneFill} ${styles.zoneCritical} ${activeZone === 'critical' ? styles.zoneActive : ''}`}
            onMouseEnter={() => activate('critical')}
            onMouseLeave={deactivate}
            onFocus={() => activate('critical')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Zona de margen dinámico agotado"
          />

          {/* ── Zone labels ── */}
          <text x={margin.left + 12} y={margin.top + 18} className={styles.zoneLabel}>
            N−1 aparentemente OK
          </text>
          <text x={margin.left + pw - 8} y={margin.top + 18} className={styles.zoneLabel} textAnchor="end">
            margen dinámico agotado
          </text>

          {/* ── Critical band near zero ── */}
          <rect
            x={margin.left} y={criticalBandY}
            width={pw} height={margin.top + ph - criticalBandY}
            className={styles.criticalBand}
          />
          <text x={margin.left + pw - 8} y={margin.top + ph - 6} className={styles.criticalBandLabel} textAnchor="end">
            singularidad próxima
          </text>

          {/* ── Axes ── */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + ph} className={styles.axis} />
          <line x1={margin.left} y1={margin.top + ph} x2={margin.left + pw} y2={margin.top + ph} className={styles.axis} />

          {/* ── Y ticks ── */}
          {['≈ 0', 'medio', 'alto'].map((label, i) => {
            const yVal = yS(i * 0.45 + 0.05);
            return (
              <text key={label} x={margin.left - 10} y={yVal + 3} className={styles.tickLabel} textAnchor="end">
                {label}
              </text>
            );
          })}

          {/* ── X ticks ── */}
          {['bajo', 'medio', 'alto'].map((label, i) => {
            const xPos = xS((i + 1) / 4);
            return (
              <text key={label} x={xPos} y={margin.top + ph + 20} className={styles.tickLabel} textAnchor="middle">
                {label}
              </text>
            );
          })}

          {/* ── Axis labels ── */}
          <text x={margin.left + pw / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">
            estrés de red / carga reactiva
          </text>
          <text
            x={16} y={margin.top + ph / 2}
            className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 16, ${margin.top + ph / 2})`}
          >
            σmin(J)
          </text>

          {/* ── Zone boundary ── */}
          <line x1={zoneBoundaryX} y1={margin.top} x2={zoneBoundaryX} y2={margin.top + ph}
            className={styles.zoneBoundary} />

          {/* ── Main curve ── */}
          <path d={pathD} className={styles.mainCurve} />

          {/* ── Sensitivity point ── */}
          <circle
            cx={xS(sensPt.stress)} cy={yS(sensPt.sigma)} r="5.5"
            className={`${styles.sensDot} ${hoveredPt ? styles.sensDotActive : ''}`}
            onMouseEnter={() => setHoveredPt(true)}
            onMouseLeave={() => setHoveredPt(false)}
            onFocus={() => setHoveredPt(true)}
            onBlur={() => setHoveredPt(false)}
            tabIndex={0}
            role="button"
            aria-label="Punto de sensibilidad, inicio de caída pronunciada"
          />
          {hoveredPt && (
            <text x={xS(sensPt.stress) + 10} y={yS(sensPt.sigma) - 10} className={styles.sensLabel}>
              punto de sensibilidad
            </text>
          )}
        </svg>
      </div>

      {activeZone && (
        <div className={styles.tooltip} role="status" aria-live="polite">
          <p>{zoneInfo[activeZone]}</p>
        </div>
      )}

      <div className={styles.legend}>
        <span
          className={`${styles.legendItem} ${activeZone === 'safe' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('safe')}
          onMouseLeave={deactivate}
          tabIndex={0}
          role="button"
          aria-label="Resaltar zona N−1 aparente"
        >
          <i className={styles.dotSafe} /> N−1 aparente
        </span>
        <span
          className={`${styles.legendItem} ${activeZone === 'critical' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('critical')}
          onMouseLeave={deactivate}
          tabIndex={0}
          role="button"
          aria-label="Resaltar margen crítico"
        >
          <i className={styles.dotCritical} /> margen crítico
        </span>
        <span className={styles.legendItem}>
          <i className={styles.dotCurve} /> σ<sub>min</sub>(J)
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> El cumplimiento N−1 en régimen permanente no garantiza margen dinámico: cuando σ<sub>min</sub>(J) se aproxima a cero, la red se vuelve hipersensible a pequeñas perturbaciones de potencia reactiva.
      </div>
    </figure>
  );
}