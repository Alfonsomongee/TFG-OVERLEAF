import React, { useState, useCallback } from 'react';
import styles from './LmpCongestionDecompositionFigure.module.css';

export default function LmpCongestionDecompositionFigure() {
  const [activeComponent, setActiveComponent] = useState(null);
  const activate = useCallback((c) => setActiveComponent(c), []);
  const deactivate = useCallback(() => setActiveComponent(null), []);

  const W = 760, H = 330;

  /* ── Node positions ── */
  const nodeA = { x: 100, y: 140, label: 'A', sub: 'gen. barata' };
  const nodeB = { x: 290, y: 80, label: 'B', sub: 'corredor' };
  const nodeC = { x: 290, y: 210, label: 'C', sub: 'demanda' };

  /* ── Stacked bar ── */
  const barX = 440, barY = 50, barW = 48, totalBarH = 220;
  const components = [
    { key: 'energy', label: 'energía', frac: 0.45, color: 'var(--fig-pistachio)' },
    { key: 'losses', label: 'pérdidas', frac: 0.18, color: 'var(--fig-amber)' },
    { key: 'congestion', label: 'congestión', frac: 0.37, color: 'var(--fig-burgundy)' },
  ];

  const componentInfo = {
    energy: 'MEC — Componente marginal de energía: coste de generar un MWh adicional en el nodo marginal del sistema.',
    losses: 'MLC — Componente marginal de pérdidas: coste adicional por disipación en la red al transportar energía hasta el nodo.',
    congestion: 'MCC — Componente marginal de congestión: sobreprecio por restricciones de flujo. Se activa cuando una línea alcanza su límite térmico (μ_l > 0).',
    line: 'Línea congestionada: el flujo alcanza el límite térmico. Esta restricción física se traduce en el componente de congestión del LMP.',
  };

  let cumY = barY;
  const barSegments = components.map((c) => {
    const h = c.frac * totalBarH;
    const seg = { ...c, y: cumY, h };
    cumY += h;
    return seg;
  });

  const isHighlighted = (key) => activeComponent === null || activeComponent === key;

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Mercado eléctrico · LMP</p>
        <h3 className={styles.title}>La congestión como componente del precio nodal</h3>
        <p className={styles.subtitle}>
          El precio marginal local suma energía, pérdidas y restricciones físicas de red cuando transportar un MWh adicional no es neutral.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>LMP<sub>i</sub> = MEC + MLC<sub>i</sub> + MCC<sub>i</sub></span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eqSmall}>MCC<sub>i</sub> ≈ Σ μ<sub>l</sub> · PTDF<sub>l,i</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="lmp-title lmp-desc"
        >
          <title id="lmp-title">Descomposición del precio marginal local en energía, pérdidas y congestión</title>
          <desc id="lmp-desc">
            Red simplificada de tres nodos (generación barata, corredor, demanda) con una línea congestionada.
            Junto a la red, una barra apilada del LMP del nodo C descompuesta en componente de energía, pérdidas y congestión.
          </desc>

          {/* ═══ Network ═══ */}
          {/* ── Lines ── */}
          {/* A → B (normal) */}
          <line x1={nodeA.x} y1={nodeA.y} x2={nodeB.x} y2={nodeB.y} className={styles.lineNormal} />
          {/* A → C (congested) */}
          <line
            x1={nodeA.x} y1={nodeA.y} x2={nodeC.x} y2={nodeC.y}
            className={`${styles.lineCongested} ${activeComponent === 'congestion' || activeComponent === 'line' ? styles.lineCongestedActive : ''}`}
            onMouseEnter={() => activate('line')}
            onMouseLeave={deactivate}
            onFocus={() => activate('line')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Línea congestionada entre nodo A y nodo C"
          />
          {/* B → C */}
          <line x1={nodeB.x} y1={nodeB.y} x2={nodeC.x} y2={nodeC.y} className={styles.lineNormal} />

          {/* ── Congestion label ── */}
          <text x={(nodeA.x + nodeC.x) / 2 - 30} y={(nodeA.y + nodeC.y) / 2 + 16}
            className={styles.congLabel}>flujo ≈ límite</text>

          {/* ── Flow arrow A→C ── */}
          <polygon points="195,178 205,172 200,183" fill="var(--fig-burgundy)" opacity="0.7" />

          {/* ── Nodes ── */}
          {[nodeA, nodeB, nodeC].map((n) => (
            <g key={n.label}>
              <circle cx={n.x} cy={n.y} r="22" className={styles.node} />
              <text x={n.x} y={n.y + 1} className={styles.nodeLabel} textAnchor="middle" dominantBaseline="middle">
                {n.label}
              </text>
              <text x={n.x} y={n.y + 34} className={styles.nodeSub} textAnchor="middle">
                {n.sub}
              </text>
            </g>
          ))}

          {/* ═══ Arrow from network to bar ═══ */}
          <line x1="340" y1="210" x2="420" y2="210" className={styles.connectLine} />
          <text x="380" y="200" className={styles.shadowLabel} textAnchor="middle">precio sombra</text>
          <polygon points="420,206 428,210 420,214" fill="var(--fig-muted)" opacity="0.5" />

          {/* ═══ Stacked bar ═══ */}
          <text x={barX + barW / 2} y={barY - 10} className={styles.barTitle} textAnchor="middle">
            LMP nodo C
          </text>

          {barSegments.map((seg) => (
            <g key={seg.key}>
              <rect
                x={barX} y={seg.y}
                width={barW} height={seg.h}
                rx="2"
                fill={seg.color}
                opacity={isHighlighted(seg.key) ? 0.85 : 0.25}
                className={styles.barSeg}
                onMouseEnter={() => activate(seg.key)}
                onMouseLeave={deactivate}
                onFocus={() => activate(seg.key)}
                onBlur={deactivate}
                tabIndex={0}
                role="button"
                aria-label={`Componente ${seg.label}: ${(seg.frac * 100).toFixed(0)}%`}
              />
              <text
                x={barX + barW + 10} y={seg.y + seg.h / 2 + 4}
                className={styles.barSegLabel}
                opacity={isHighlighted(seg.key) ? 1 : 0.4}
              >
                {seg.label}
              </text>
            </g>
          ))}

          {/* ── Bar border ── */}
          <rect x={barX} y={barY} width={barW} height={totalBarH} rx="2"
            fill="none" stroke="var(--fig-text)" strokeWidth="1" opacity="0.3" />

          {/* ═══ Nota mercado ibérico ═══ */}
          <text x={W - 16} y={H - 10} className={styles.noteSmall} textAnchor="end">
            Modelo conceptual · no mercado ibérico real
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeComponent ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeComponent ? componentInfo[activeComponent] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        <span className={`${styles.legendItem} ${activeComponent === 'energy' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('energy')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotEnergy} /> energía
        </span>
        <span className={`${styles.legendItem} ${activeComponent === 'losses' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('losses')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotLosses} /> pérdidas
        </span>
        <span className={`${styles.legendItem} ${activeComponent === 'congestion' || activeComponent === 'line' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('congestion')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotCongestion} /> congestión · MCC<sub>i</sub>
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> El LMP traduce una restricción física en una señal económica: cuando una línea alcanza su límite, el precio nodal incorpora un componente de congestión asociado al precio sombra de esa restricción.
        <span className={styles.readingNote}> En el mercado ibérico real predominan precios zonales y ajustes posteriores; aquí el LMP se usa como modelo conceptual.</span>
      </div>
    </figure>
  );
}
