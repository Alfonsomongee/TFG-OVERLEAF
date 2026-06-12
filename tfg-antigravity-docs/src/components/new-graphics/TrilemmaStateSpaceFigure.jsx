import React, { useState, useCallback } from 'react';
import styles from './TrilemmaStateSpaceFigure.module.css';

export default function TrilemmaStateSpaceFigure() {
  const [activeElement, setActiveElement] = useState(null);
  const activate = useCallback((e) => setActiveElement(e), []);
  const deactivate = useCallback(() => setActiveElement(null), []);

  const W = 760, H = 360;

  /* ── Triangle geometry ── */
  const cx = 330, topY = 50;
  const triH = 240, triW = 320;
  const A = { x: cx, y: topY };                    // Estabilidad alta
  const B = { x: cx - triW / 2, y: topY + triH };  // Coste bajo
  const C = { x: cx + triW / 2, y: topY + triH };  // Emisiones bajas

  const triPath = `M${A.x},${A.y} L${B.x},${B.y} L${C.x},${C.y} Z`;

  /* ── Feasible region (smaller inner area) ── */
  const fA = { x: cx, y: topY + 40 };
  const fB = { x: cx - triW / 2 + 40, y: topY + triH - 30 };
  const fC = { x: cx + triW / 2 - 40, y: topY + triH - 30 };
  const feasiblePath = `M${fA.x},${fA.y} L${fB.x},${fB.y} L${fC.x},${fC.y} Z`;

  /* ── Fragile zone (bottom portion, excluded by stability constraint) ── */
  const fragileY = topY + triH - 75;
  const fragPath = `M${cx - triW / 2 + 15},${topY + triH} L${cx + triW / 2 - 15},${topY + triH} L${cx + 80},${fragileY} L${cx - 80},${fragileY} Z`;

  /* ── Key points ── */
  const fragileOptimum = { x: cx + 60, y: topY + triH - 50 };
  const robustOptimum = { x: cx - 20, y: topY + 100 };

  /* ── Pareto frontier (conceptual curve) ── */
  const paretoPath = `M${cx - 100},${topY + triH - 60} Q${cx},${topY + 70} ${cx + 90},${topY + triH - 80}`;

  const isHighlighted = (key) => activeElement === null || activeElement === key;

  const elementInfo = {
    feasible: 'Región factible: configuraciones del sistema que cumplen simultáneamente restricciones de coste, emisiones y estabilidad mínima.',
    fragile: 'Zona frágil: soluciones que minimizan coste y emisiones pero no cumplen el umbral mínimo de estabilidad M_estabilidad ≥ M_min. Son óptimos aparentes pero operativamente inviables.',
    fragileOpt: 'Óptimo frágil: el punto de menor coste+emisiones que ignora la restricción de estabilidad. Barato y bajo en carbono, pero vulnerable a perturbaciones dinámicas.',
    robustOpt: 'Óptimo robusto: una configuración equilibrada que cumple el margen mínimo de estabilidad. Puede incluir BESS-GFM, SynCon, red reforzada y control avanzado.',
    arrow: 'Tecnologías como BESS grid-forming, compensadores síncronos y refuerzo de red desplazan el óptimo desde la zona frágil hacia la zona robusta.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Transición energética · Optimización multicriterio</p>
        <h3 className={styles.title}>Coste, emisiones y estabilidad como espacio de decisión</h3>
        <p className={styles.subtitle}>
          La estabilidad dinámica debe entrar como restricción explícita, no como consecuencia automática de una transición renovable.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>min J(x) = [Coste(x), Emisiones(x), −Estabilidad(x)]</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eqSmall}>M<sub>estabilidad</sub>(x) ≥ M<sub>min</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="trilemma-title trilemma-desc"
        >
          <title id="trilemma-title">Trilema energético como espacio de decisión multicriterio</title>
          <desc id="trilemma-desc">
            Triángulo con tres vértices (estabilidad alta, coste bajo, emisiones bajas). Dentro, una región factible
            y una zona frágil excluida por la restricción de estabilidad. Un óptimo frágil cerca del vértice
            coste-emisiones y un óptimo robusto más equilibrado, conectados por una flecha de servicios de estabilidad.
          </desc>

          {/* ── Triangle border ── */}
          <path d={triPath} className={styles.triBorder} />

          {/* ── Feasible region ── */}
          <path d={feasiblePath}
            className={`${styles.feasibleRegion} ${isHighlighted('feasible') ? '' : styles.dimmed}`}
            onMouseEnter={() => activate('feasible')}
            onMouseLeave={deactivate}
            onFocus={() => activate('feasible')}
            onBlur={deactivate}
            tabIndex={0} role="button"
            aria-label="Región factible de soluciones"
          />

          {/* ── Fragile zone ── */}
          <path d={fragPath}
            className={`${styles.fragileZone} ${isHighlighted('fragile') ? '' : styles.dimmed}`}
            onMouseEnter={() => activate('fragile')}
            onMouseLeave={deactivate}
            onFocus={() => activate('fragile')}
            onBlur={deactivate}
            tabIndex={0} role="button"
            aria-label="Zona frágil excluida por restricción de estabilidad"
          />
          <text x={cx} y={topY + triH - 20} className={styles.fragileLabel} textAnchor="middle">
            zona frágil
          </text>

          {/* ── Stability threshold line ── */}
          <line x1={cx - 100} y1={fragileY} x2={cx + 100} y2={fragileY}
            className={styles.thresholdLine} />
          <text x={cx + 105} y={fragileY + 4} className={styles.thresholdLabel}>
            M<tspan style={{ fontVariantPosition: 'sub' }}>min</tspan>
          </text>

          {/* ── Pareto frontier ── */}
          <path d={paretoPath} className={styles.paretoLine} />

          {/* ── Vertex labels ── */}
          <text x={A.x} y={A.y - 12} className={styles.vertexLabel} textAnchor="middle">Estabilidad alta</text>
          <text x={B.x - 8} y={B.y + 18} className={styles.vertexLabel} textAnchor="middle">Coste bajo</text>
          <text x={C.x + 8} y={C.y + 18} className={styles.vertexLabel} textAnchor="middle">Emisiones bajas</text>

          {/* ── Fragile optimum ── */}
          <circle cx={fragileOptimum.x} cy={fragileOptimum.y} r="6"
            className={`${styles.pointFragile} ${activeElement === 'fragileOpt' ? styles.pointActive : ''}`}
            onMouseEnter={() => activate('fragileOpt')}
            onMouseLeave={deactivate}
            onFocus={() => activate('fragileOpt')}
            onBlur={deactivate}
            tabIndex={0} role="button"
            aria-label="Óptimo frágil: bajo coste y emisiones, sin estabilidad suficiente"
          />
          <text x={fragileOptimum.x + 10} y={fragileOptimum.y + 4} className={styles.pointLabelFragile}>
            óptimo frágil
          </text>

          {/* ── Robust optimum ── */}
          <circle cx={robustOptimum.x} cy={robustOptimum.y} r="6"
            className={`${styles.pointRobust} ${activeElement === 'robustOpt' ? styles.pointActive : ''}`}
            onMouseEnter={() => activate('robustOpt')}
            onMouseLeave={deactivate}
            onFocus={() => activate('robustOpt')}
            onBlur={deactivate}
            tabIndex={0} role="button"
            aria-label="Óptimo robusto: equilibrio coste-emisiones-estabilidad"
          />
          <text x={robustOptimum.x - 10} y={robustOptimum.y - 14} className={styles.pointLabelRobust}>
            óptimo robusto
          </text>

          {/* ── Arrow from fragile to robust ── */}
          <line
            x1={fragileOptimum.x - 6} y1={fragileOptimum.y - 6}
            x2={robustOptimum.x + 8} y2={robustOptimum.y + 10}
            className={`${styles.arrowLine} ${activeElement === 'arrow' ? styles.arrowLineActive : ''}`}
            onMouseEnter={() => activate('arrow')}
            onMouseLeave={deactivate}
            onFocus={() => activate('arrow')}
            onBlur={deactivate}
            tabIndex={0} role="button"
            aria-label="Flecha de servicios de estabilidad"
          />
          <polygon
            points={`${robustOptimum.x + 8},${robustOptimum.y + 6} ${robustOptimum.x + 14},${robustOptimum.y + 14} ${robustOptimum.x + 4},${robustOptimum.y + 14}`}
            fill="var(--fig-amber)"
            opacity="0.8"
          />
          <text x={(fragileOptimum.x + robustOptimum.x) / 2 + 20} y={(fragileOptimum.y + robustOptimum.y) / 2}
            className={styles.arrowLabel}>
            servicios de estabilidad
          </text>
          <text x={(fragileOptimum.x + robustOptimum.x) / 2 + 20} y={(fragileOptimum.y + robustOptimum.y) / 2 + 13}
            className={styles.arrowLabelSmall}>
            BESS-GFM · SynCon · red
          </text>

          {/* ── Side panel: variable ── */}
          <text x={W - 20} y={50} className={styles.varNote} textAnchor="end">
            x = mix + red + control
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeElement && elementInfo[activeElement] ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeElement && elementInfo[activeElement] ? elementInfo[activeElement] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        <span className={`${styles.legendItem} ${activeElement === 'feasible' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('feasible')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotFeasible} /> región factible
        </span>
        <span className={`${styles.legendItem} ${activeElement === 'fragile' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('fragile')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotFragile} /> zona frágil
        </span>
        <span className={`${styles.legendItem} ${activeElement === 'robustOpt' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('robustOpt')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotRobust} /> óptimo robusto
        </span>
        <span className={`${styles.legendItem} ${activeElement === 'fragileOpt' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('fragileOpt')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotFragilePoint} /> óptimo frágil
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> Un mix bajo en coste y emisiones puede seguir siendo inviable si no cumple el margen mínimo de estabilidad; la red, el control y los servicios dinámicos desplazan el óptimo hacia una solución robusta.
      </div>
    </figure>
  );
}
