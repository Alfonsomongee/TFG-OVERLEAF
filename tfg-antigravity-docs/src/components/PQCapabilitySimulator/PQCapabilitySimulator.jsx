import React, { useState, useCallback } from 'react';
import styles from './PQCapabilitySimulator.module.css';

export default function PQCapabilitySimulator() {
  const [pRatio, setPRatio] = useState(0.72);
  const [hoveredElement, setHoveredElement] = useState(null);
  const hover = useCallback((el) => setHoveredElement(el), []);
  const unhover = useCallback(() => setHoveredElement(null), []);

  const qRatio = Math.sqrt(1 - pRatio * pRatio);
  const qPercent = (qRatio * 100).toFixed(1);

  let marginLevel;
  if (qRatio >= 0.65) marginLevel = 'wide';
  else if (qRatio >= 0.35) marginLevel = 'compromised';
  else marginLevel = 'critical';

  const marginData = {
    wide: { label: 'Margen amplio', cls: styles.statusWide },
    compromised: { label: 'Margen comprometido', cls: styles.statusCompromised },
    critical: { label: 'Margen crítico', cls: styles.statusCritical },
  }[marginLevel];

  const pericialText = (() => {
    const pPct = (pRatio * 100).toFixed(0);
    if (qRatio >= 0.65)
      return `Con P ≈ ${pPct} % de Smax, el margen reactivo Qmax ≈ ${qPercent} % Smax. Capacidad apreciable para control de tensión.`;
    if (qRatio >= 0.35)
      return `Con P ≈ ${pPct} % de Smax, Qmax desciende a ≈ ${qPercent} % Smax. En redes débiles, la participación en control de tensión se ve limitada.`;
    return `Con P ≈ ${pPct} % de Smax, Qmax cae a niveles muy reducidos (≈ ${qPercent} % Smax). La absorción de reactiva queda operativamente comprometida.`;
  })();

  const tooltips = {
    smax: 'Frontera de capacidad aparente Smax: el límite térmico del semiconductor define un cuarto de circunferencia donde P² + Q² = S²max.',
    pLine: `Potencia activa: ${(pRatio * 100).toFixed(0)} % de Smax. A mayor irradiancia fotovoltaica, mayor P y menor margen Q disponible.`,
    qLine: `Margen reactivo: Qmax ≈ ${qPercent} % de Smax. Este es el margen disponible para participar en control de tensión.`,
    critical: 'Zona crítica: cuando Q disponible cae por debajo del 35 % de Smax, el inversor pierde capacidad efectiva de soporte de tensión en redes débiles.',
    opPoint: `Punto de operación actual: P = ${(pRatio * 100).toFixed(0)} %, Q disponible = ${qPercent} %. ${marginData.label}.`,
  };

  /* ── SVG layout ── */
  const originX = 50, originY = 230, radius = 180;
  const px = originX + pRatio * radius;
  const py = originY - qRatio * radius;

  const critP = Math.sqrt(1 - 0.35 * 0.35);
  const critX = originX + critP * radius;
  const critY = originY - 0.35 * radius;

  /* ── Build arcs ── */
  const smaxArc = `M ${originX} ${originY - radius} A ${radius} ${radius} 0 0 1 ${originX + radius} ${originY}`;
  const critArc = `M ${critX} ${critY} A ${radius} ${radius} 0 0 1 ${originX + radius} ${originY}`;

  return (
    <figure className={styles.figure} aria-labelledby="pq-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Simulador didáctico · Inversores IBR</p>
        <h3 id="pq-title" className={styles.title}>
          El límite del semiconductor: conflicto P–Q
        </h3>
        <p className={styles.subtitle}>
          A mayor potencia activa, menor margen reactivo disponible para controlar tensión.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>P² + Q² = S²<sub>max</sub></span>
        <span className={styles.eqSep}>→</span>
        <span className={styles.eq}>Q<sub>max</sub> = √(S²<sub>max</sub> − P²)</span>
      </div>

      <div className={styles.svgContainer}>
        <svg
          viewBox="0 0 290 280"
          role="img"
          aria-labelledby="pq-svg-title pq-svg-desc"
          className={styles.svg}
        >
          <title id="pq-svg-title">Relación entre potencia activa P y capacidad reactiva Q del inversor</title>
          <desc id="pq-svg-desc">
            Curva de capacidad aparente Smax mostrando el compromiso entre P y Q.
            Zona crítica marcada cuando Q cae por debajo del 35% de Smax.
            Punto de operación ajustable mediante deslizador.
          </desc>

          {/* ── Axes ── */}
          <line x1={originX} y1={originY} x2={originX + radius + 20} y2={originY}
            stroke="var(--fig-text)" strokeWidth="1.2" />
          <line x1={originX} y1={originY} x2={originX} y2={originY - radius - 20}
            stroke="var(--fig-text)" strokeWidth="1.2" />

          <text x={originX + radius + 24} y={originY + 5} fill="var(--fig-text)" fontSize="12" fontWeight="600">P</text>
          <text x={originX - 4} y={originY - radius - 24} fill="var(--fig-text)" fontSize="12" fontWeight="600" textAnchor="middle">Q</text>

          {/* ── Ticks ── */}
          <line x1={originX + radius} y1={originY - 3} x2={originX + radius} y2={originY + 3}
            stroke="var(--fig-text)" strokeWidth="1" />
          <line x1={originX - 3} y1={originY - radius} x2={originX + 3} y2={originY - radius}
            stroke="var(--fig-text)" strokeWidth="1" />

          {/* ── Smax arc ── */}
          <path d={smaxArc}
            fill="none" stroke="var(--fig-teal)" strokeWidth="2.8"
            className={`${styles.smaxArc} ${hoveredElement === 'smax' ? styles.smaxArcActive : ''}`}
            onMouseEnter={() => hover('smax')}
            onMouseLeave={unhover}
            onFocus={() => hover('smax')}
            onBlur={unhover}
            tabIndex={0} role="button"
            aria-label="Frontera de capacidad aparente Smax"
          />

          <text x={originX + radius * 0.62} y={originY - radius * 0.52}
            fill="var(--fig-muted)" fontSize="9" fontStyle="italic" opacity="0.7">Smax</text>

          {/* ── Critical zone arc ── */}
          <path d={critArc}
            fill="none" stroke="var(--fig-burgundy)" strokeWidth="2.5" strokeDasharray="5 3"
            opacity={hoveredElement === 'critical' ? 0.7 : 0.3}
            className={styles.critArc}
            onMouseEnter={() => hover('critical')}
            onMouseLeave={unhover}
            onFocus={() => hover('critical')}
            onBlur={unhover}
            tabIndex={0} role="button"
            aria-label="Zona crítica, bajo margen Q"
          />

          {/* ── P projection ── */}
          <line x1={originX} y1={originY} x2={px} y2={originY}
            stroke="var(--fig-amber)" strokeWidth="2.8"
            className={styles.projLine}
            onMouseEnter={() => hover('pLine')}
            onMouseLeave={unhover}
          />
          <text x={originX + (px - originX) / 2 - 4} y={originY + 17}
            fill="var(--fig-amber)" fontSize="9.5" fontWeight="600">P</text>

          {/* ── Q projection ── */}
          <line x1={px} y1={py} x2={px} y2={originY}
            stroke="var(--fig-pistachio)" strokeWidth="2.8"
            className={styles.projLine}
            onMouseEnter={() => hover('qLine')}
            onMouseLeave={unhover}
          />
          <text x={px + 8} y={py + (originY - py) / 2}
            fill="var(--fig-pistachio)" fontSize="9.5" fontWeight="600">Qmax</text>

          {/* ── Radius line (dashed) ── */}
          <line x1={originX} y1={originY} x2={px} y2={py}
            stroke="var(--fig-text)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" />

          {/* ── Operating point ── */}
          <circle cx={px} cy={py} r="6"
            className={`${styles.opPoint} ${hoveredElement === 'opPoint' ? styles.opPointActive : ''}`}
            onMouseEnter={() => hover('opPoint')}
            onMouseLeave={unhover}
            onFocus={() => hover('opPoint')}
            onBlur={unhover}
            tabIndex={0} role="button"
            aria-label={`Punto de operación: P=${(pRatio * 100).toFixed(0)}%, Qmax=${qPercent}%`}
          />
          <text x={px + 10} y={py - 8} fill="var(--fig-muted)" fontSize="8" opacity="0.7">op.</text>
        </svg>
      </div>

      {hoveredElement && tooltips[hoveredElement] && (
        <div className={styles.tooltip} role="status" aria-live="polite">
          <p>{tooltips[hoveredElement]}</p>
        </div>
      )}

      {/* ── Legend ── */}
      <div className={styles.legend}>
        {[
          { key: 'smax', label: 'Smax · capacidad aparente', cls: styles.dotSmax },
          { key: 'pLine', label: 'P · potencia activa', cls: styles.dotP },
          { key: 'qLine', label: 'Qmax · margen reactivo', cls: styles.dotQ },
          { key: 'critical', label: 'Zona crítica · bajo margen Q', cls: styles.dotCritical },
        ].map(({ key, label, cls }) => (
          <span key={key}
            className={`${styles.legendItem} ${hoveredElement === key ? styles.legendItemActive : ''}`}
            onMouseEnter={() => hover(key)} onMouseLeave={unhover}
            tabIndex={0} role="button" aria-label={`Resaltar ${label}`}>
            <i className={cls} /> {label}
          </span>
        ))}
      </div>

      {/* ── Slider ── */}
      <div className={styles.controls}>
        <label htmlFor="p-slider" className={styles.sliderLabel}>Potencia activa fotovoltaica</label>
        <div className={styles.sliderRow}>
          <input id="p-slider" type="range" min="0.2" max="0.98" step="0.01"
            value={pRatio} onChange={(e) => setPRatio(parseFloat(e.target.value))}
            className={styles.slider} />
          <span className={styles.sliderValue}>{(pRatio * 100).toFixed(0)}% S<sub>max</sub></span>
        </div>
      </div>

      {/* ── Status ── */}
      <div className={styles.status}>
        <span className={`${styles.statusBadge} ${marginData.cls}`}>{marginData.label}</span>
        <span className={styles.qValue}>Q<sub>max</sub> = {qPercent} % S<sub>max</sub></span>
      </div>

      {/* ── Expert text ── */}
      <p className={styles.pericial}>{pericialText}</p>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> La restricción P–Q expresa una limitación geométrica de operación. En alta irradiancia y baja fortaleza de red, maximizar P reduce la capacidad del parque IBR para el control dinámico de tensión.
      </div>
    </figure>
  );
}
