import React, { useState, useCallback } from 'react';
import styles from './GridStrengthScrFigure.module.css';

export default function GridStrengthScrFigure() {
  const [activeRegion, setActiveRegion] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const activate = useCallback((region) => setActiveRegion(region), []);
  const deactivate = useCallback(() => setActiveRegion(null), []);

  /* ── SVG layout ── */
  const margin = { top: 28, right: 30, bottom: 48, left: 56 };
  const W = 760, H = 320;
  const pw = W - margin.left - margin.right;
  const ph = H - margin.top - margin.bottom;

  /* ── Data: SCR curve (conceptual) ── */
  const scrData = [];
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const pIbr = t;
    const scr = 4.2 / (1 + 2.8 * t * t) + 0.15;
    scrData.push({ pIbr, scr });
  }

  const xScale = (v) => margin.left + v * pw;
  const yScale = (v) => margin.top + ph - ((v - 0.5) / 4) * ph;

  const pathD = scrData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(d.pIbr).toFixed(1)},${yScale(d.scr).toFixed(1)}`)
    .join(' ');

  /* ── SCR thresholds ── */
  const y3 = yScale(3);
  const y2 = yScale(2);

  /* ── Vulnerable point ── */
  const vulnIdx = scrData.findIndex((d) => d.scr <= 1.8);
  const vulnPt = scrData[vulnIdx] || scrData[scrData.length - 1];

  const regionInfo = {
    strong: 'SCR > 3 — Red con alta potencia de cortocircuito relativa. Los inversores grid-following operan con márgenes amplios de sincronización.',
    weak: '2 < SCR < 3 — La potencia de cortocircuito empieza a ser comparable a la potencia IBR. Aumenta la sensibilidad a transitorios de tensión.',
    critical: 'SCR < 2 — Nudo vulnerable. Los inversores pueden experimentar problemas de sincronización PLL, oscilaciones y pérdida de estabilidad.',
  };

  const legendItems = [
    { key: 'strong', label: 'Red fuerte', cls: styles.dotStrong },
    { key: 'weak', label: 'Red débil', cls: styles.dotWeak },
    { key: 'critical', label: 'Red crítica', cls: styles.dotCritical },
  ];

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Estabilidad de red · SCR</p>
        <h3 className={styles.title}>Fortaleza nodal frente a penetración IBR</h3>
        <p className={styles.subtitle}>
          El Short Circuit Ratio cae cuando la potencia conectada mediante inversores crece sobre una red con baja potencia de cortocircuito.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>SCR = S<sub>cc</sub> / P<sub>IBR</sub></span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eq}>S<sub>cc</sub> ≈ V² / Z<sub>th</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="scr-title scr-desc"
        >
          <title id="scr-title">Caída del SCR con el aumento de potencia IBR</title>
          <desc id="scr-desc">
            Curva descendente del Short Circuit Ratio desde valores superiores a 4 hasta valores inferiores a 2,
            cruzando tres regiones: red fuerte (SCR mayor que 3), red débil (SCR entre 2 y 3) y red crítica (SCR menor que 2).
            Un punto destacado marca la zona de nudo vulnerable.
          </desc>

          {/* ── Background regions ── */}
          <rect
            x={margin.left} y={margin.top}
            width={pw} height={y3 - margin.top}
            className={`${styles.regionFill} ${styles.regionStrong} ${activeRegion === 'strong' ? styles.regionActive : ''}`}
            onMouseEnter={() => activate('strong')}
            onMouseLeave={deactivate}
            onFocus={() => activate('strong')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Región red fuerte, SCR mayor que 3"
          />
          <rect
            x={margin.left} y={y3}
            width={pw} height={y2 - y3}
            className={`${styles.regionFill} ${styles.regionWeak} ${activeRegion === 'weak' ? styles.regionActive : ''}`}
            onMouseEnter={() => activate('weak')}
            onMouseLeave={deactivate}
            onFocus={() => activate('weak')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Región red débil, SCR entre 2 y 3"
          />
          <rect
            x={margin.left} y={y2}
            width={pw} height={margin.top + ph - y2}
            className={`${styles.regionFill} ${styles.regionCritical} ${activeRegion === 'critical' ? styles.regionActive : ''}`}
            onMouseEnter={() => activate('critical')}
            onMouseLeave={deactivate}
            onFocus={() => activate('critical')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Región red crítica, SCR menor que 2"
          />

          {/* ── Region labels ── */}
          <text x={margin.left + 8} y={y3 - 8} className={styles.regionLabel}>red fuerte</text>
          <text x={margin.left + 8} y={y2 - 8} className={styles.regionLabel}>red débil</text>
          <text x={margin.left + 8} y={margin.top + ph - 8} className={styles.regionLabel}>red crítica</text>

          {/* ── Threshold lines ── */}
          <line x1={margin.left} y1={y3} x2={margin.left + pw} y2={y3}
            className={styles.thresholdLine} />
          <line x1={margin.left} y1={y2} x2={margin.left + pw} y2={y2}
            className={styles.thresholdLine} />

          {/* ── Axes ── */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + ph}
            className={styles.axis} />
          <line x1={margin.left} y1={margin.top + ph} x2={margin.left + pw} y2={margin.top + ph}
            className={styles.axis} />

          {/* ── Y ticks ── */}
          {[1, 2, 3, 4].map((v) => (
            <g key={v}>
              <line x1={margin.left - 5} y1={yScale(v)} x2={margin.left} y2={yScale(v)} className={styles.axis} />
              <text x={margin.left - 10} y={yScale(v) + 4} className={styles.tickLabel} textAnchor="end">{v}</text>
            </g>
          ))}

          {/* ── X ticks ── */}
          {['baja', 'media', 'alta'].map((label, i) => {
            const xPos = xScale((i + 1) / 4);
            return (
              <text key={label} x={xPos} y={margin.top + ph + 20} className={styles.tickLabel} textAnchor="middle">{label}</text>
            );
          })}

          {/* ── Axis labels ── */}
          <text x={margin.left + pw / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">
            P_IBR conectada
          </text>
          <text
            x={14} y={margin.top + ph / 2}
            className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 14, ${margin.top + ph / 2})`}
          >
            SCR
          </text>

          {/* ── Main curve ── */}
          <path d={pathD} className={styles.mainCurve} />

          {/* ── Vulnerable point ── */}
          <circle
            cx={xScale(vulnPt.pIbr)} cy={yScale(vulnPt.scr)} r="6"
            className={`${styles.vulnDot} ${hoveredPoint === 'vuln' ? styles.vulnDotActive : ''}`}
            onMouseEnter={() => setHoveredPoint('vuln')}
            onMouseLeave={() => setHoveredPoint(null)}
            onFocus={() => setHoveredPoint('vuln')}
            onBlur={() => setHoveredPoint(null)}
            tabIndex={0}
            role="button"
            aria-label="Nudo vulnerable, SCR inferior a 2"
          />
          <text
            x={xScale(vulnPt.pIbr) - 10} y={yScale(vulnPt.scr) - 14}
            className={styles.vulnLabel}
          >
            nudo vulnerable
          </text>

          {/* ── Annotation arrow ── */}
          <text x={xScale(0.55)} y={yScale(3.6)} className={styles.annotation} textAnchor="middle">
            más IBR sin S_cc adicional →
          </text>

          {/* ── gSCR note ── */}
          <text x={margin.left + pw - 4} y={margin.top + 16} className={styles.noteSmall} textAnchor="end">
            Extensión multi-inversor: gSCR
          </text>
        </svg>
      </div>

      {/* ── Tooltip ── */}
      <div className={`${styles.tooltip} ${activeRegion ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeRegion ? regionInfo[activeRegion] : '\u00A0'}</p>
      </div>

      {/* ── Legend ── */}
      <div className={styles.legend}>
        {legendItems.map((item) => (
          <span
            key={item.key}
            className={`${styles.legendItem} ${activeRegion === item.key ? styles.legendItemActive : ''}`}
            onMouseEnter={() => activate(item.key)}
            onMouseLeave={deactivate}
            onFocus={() => activate(item.key)}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label={`Resaltar ${item.label}`}
          >
            <i className={item.cls} />
            {item.label}
          </span>
        ))}
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> A mayor potencia IBR conectada sobre una red con baja potencia de cortocircuito, menor fortaleza nodal y mayor exposición a transitorios de tensión.
      </div>
    </figure>
  );
}