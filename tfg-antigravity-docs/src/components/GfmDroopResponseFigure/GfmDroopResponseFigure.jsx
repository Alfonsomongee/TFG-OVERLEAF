import React, { useState, useMemo, useCallback } from 'react';
import styles from './GfmDroopResponseFigure.module.css';

export default function GfmDroopResponseFigure() {
  const [activeCurve, setActiveCurve] = useState(null);
  const activate = useCallback((c) => setActiveCurve(c), []);
  const deactivate = useCallback(() => setActiveCurve(null), []);

  const margin = { top: 28, right: 24, bottom: 48, left: 56 };
  const W = 760, H = 320;
  const pw = W - margin.left - margin.right;
  const ph = H - margin.top - margin.bottom;

  /* ── Time normalized 0..1, deviation normalized 0..-1 ── */
  const generateCurve = useCallback((type) => {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      let dev;
      if (t < 0.05) {
        dev = 0;
      } else {
        const tp = t - 0.05;
        if (type === 'gfl') {
          // Larger deviation, slower recovery
          dev = -0.92 * (1 - Math.exp(-tp / 0.06)) * Math.exp(-tp / 0.55)
                - 0.15 * Math.sin(tp * 18) * Math.exp(-tp / 0.3);
        } else if (type === 'gfm') {
          // Smaller deviation, faster recovery
          dev = -0.52 * (1 - Math.exp(-tp / 0.04)) * Math.exp(-tp / 0.22)
                - 0.05 * Math.sin(tp * 22) * Math.exp(-tp / 0.15);
        } else {
          // SynCon: inertial, intermediate, electromechanical oscillation
          dev = -0.68 * (1 - Math.exp(-tp / 0.12)) * Math.exp(-tp / 0.4)
                - 0.12 * Math.sin(tp * 10) * Math.exp(-tp / 0.35);
        }
      }
      pts.push({ t, dev });
    }
    return pts;
  }, []);

  const curves = useMemo(() => ({
    gfl: generateCurve('gfl'),
    gfm: generateCurve('gfm'),
    syncon: generateCurve('syncon'),
  }), [generateCurve]);

  const xS = (v) => margin.left + v * pw;
  const yS = (v) => margin.top + (0.15 - v) / 1.2 * ph; // map -1..0.15 to plot

  const curvePath = (data) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.t).toFixed(1)},${yS(d.dev).toFixed(1)}`).join(' ');

  const pertX = xS(0.05);
  const y0 = yS(0);

  const curveInfo = {
    gfl: 'Grid-following: el inversor sigue una referencia de frecuencia/tensión externa mediante PLL. En redes débiles, la excursión es mayor y la recuperación más lenta.',
    gfm: 'Grid-forming: el inversor sintetiza referencia interna de V/f. Responde más rápido mediante droop, conteniendo la perturbación con menor excursión.',
    syncon: 'SynCon / síncrono: aporta inercia electromecánica y cortocircuito físico. La respuesta es amortiguada con oscilación natural del rotor.',
  };

  const curveKeys = [
    { key: 'gfl', label: 'Grid-following', dotCls: styles.dotGfl },
    { key: 'gfm', label: 'Grid-forming', dotCls: styles.dotGfm },
    { key: 'syncon', label: 'SynCon / síncrono', dotCls: styles.dotSyncon },
  ];

  const isHighlighted = (key) => activeCurve === null || activeCurve === key;

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Control avanzado · Grid-forming</p>
        <h3 className={styles.title}>Respuesta droop ante una perturbación</h3>
        <p className={styles.subtitle}>
          El control grid-forming sintetiza tensión y frecuencia internas, reduciendo la excursión dinámica frente a inversores seguidores de red.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>Δf = −m<sub>P</sub> · ΔP</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eq}>ΔV = −m<sub>Q</sub> · ΔQ</span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="gfm-title gfm-desc"
        >
          <title id="gfm-title">Comparación de respuesta GFL, GFM y síncrona ante una perturbación</title>
          <desc id="gfm-desc">
            Tres curvas de desviación dinámica tras una perturbación en t=0. El grid-following presenta mayor excursión,
            el grid-forming menor excursión y recuperación rápida, y el compensador síncrono una respuesta inercial amortiguada.
            Las ecuaciones droop vinculan P-f y Q-V.
          </desc>

          {/* ── Reference line ── */}
          <line x1={margin.left} y1={y0} x2={margin.left + pw} y2={y0} className={styles.refLine} />
          <text x={margin.left + pw - 4} y={y0 - 6} className={styles.refLabel} textAnchor="end">régimen</text>

          {/* ── Perturbation mark ── */}
          <line x1={pertX} y1={margin.top} x2={pertX} y2={margin.top + ph} className={styles.pertLine} />
          <text x={pertX + 5} y={margin.top + 14} className={styles.pertLabel}>perturbación</text>

          {/* ── Curves ── */}
          <path
            d={curvePath(curves.gfl)}
            className={`${styles.curveGfl} ${isHighlighted('gfl') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('gfl')}
            onMouseLeave={deactivate}
            onFocus={() => activate('gfl')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Curva grid-following"
          />
          <path
            d={curvePath(curves.syncon)}
            className={`${styles.curveSyncon} ${isHighlighted('syncon') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('syncon')}
            onMouseLeave={deactivate}
            onFocus={() => activate('syncon')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Curva compensador síncrono"
          />
          <path
            d={curvePath(curves.gfm)}
            className={`${styles.curveGfm} ${isHighlighted('gfm') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('gfm')}
            onMouseLeave={deactivate}
            onFocus={() => activate('gfm')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Curva grid-forming"
          />

          {/* ── Inline annotations (only when active or none active) ── */}
          {(activeCurve === 'gfm' || activeCurve === null) && (
            <text x={xS(0.32)} y={yS(curves.gfm[80]?.dev || -0.15) - 8} className={styles.curveAnnotGfm}>
              referencia interna
            </text>
          )}
          {(activeCurve === 'gfl' || activeCurve === null) && (
            <text x={xS(0.28)} y={yS(curves.gfl[70]?.dev || -0.6) + 16} className={styles.curveAnnotGfl}>
              PLL / red externa
            </text>
          )}

          {/* ── Axes ── */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + ph} className={styles.axis} />
          <line x1={margin.left} y1={margin.top + ph} x2={margin.left + pw} y2={margin.top + ph} className={styles.axis} />

          {/* ── X ticks ── */}
          {[{ l: '0', t: 0.05 }, { l: '100 ms', t: 0.18 }, { l: '1 s', t: 0.55 }, { l: 'régimen', t: 0.9 }].map(({ l, t }) => (
            <text key={l} x={xS(t)} y={margin.top + ph + 20} className={styles.tickLabel} textAnchor="middle">{l}</text>
          ))}

          {/* ── Axis labels ── */}
          <text x={margin.left + pw / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">
            tiempo tras perturbación
          </text>
          <text
            x={16} y={margin.top + ph / 2}
            className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 16, ${margin.top + ph / 2})`}
          >
            desviación de f / V
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeCurve ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeCurve ? curveInfo[activeCurve] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        {curveKeys.map(({ key, label, dotCls }) => (
          <span
            key={key}
            className={`${styles.legendItem} ${activeCurve === key ? styles.legendItemActive : ''}`}
            onMouseEnter={() => activate(key)}
            onMouseLeave={deactivate}
            onFocus={() => activate(key)}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label={`Resaltar ${label}`}
          >
            <i className={dotCls} />
            {label}
          </span>
        ))}
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> El GFM actúa como fuente de tensión controlada: ante una perturbación ajusta P y Q mediante droop, reduciendo la excursión dinámica sin depender de una referencia externa fuerte.
      </div>
    </figure>
  );
}