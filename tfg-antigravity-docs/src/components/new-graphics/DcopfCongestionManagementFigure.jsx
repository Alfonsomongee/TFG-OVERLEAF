import React, { useState, useCallback } from 'react';
import styles from './DcopfCongestionManagementFigure.module.css';

export default function DcopfCongestionManagementFigure() {
  const [activeScenario, setActiveScenario] = useState(null);
  const activate = useCallback((s) => setActiveScenario(s), []);
  const deactivate = useCallback(() => setActiveScenario(null), []);

  const W = 760, H = 320;
  const midX = W / 2;

  /* ── Node geometry (per scenario) ── */
  const makeNodes = (offsetX) => ({
    genCheap: { x: offsetX + 50, y: 100, label: 'G barato' },
    corridor: { x: offsetX + 170, y: 70, label: 'corredor' },
    demand:   { x: offsetX + 170, y: 195, label: 'demanda' },
  });

  const nodesA = makeNodes(15);
  const nodesB = makeNodes(midX + 15);

  const isHighlighted = (s) => activeScenario === null || activeScenario === s;

  const scenarioInfo = {
    free: 'Sin congestión: el generador barato cubre toda la demanda. El flujo por las líneas está dentro de los límites. Coste mínimo.',
    congested: 'Restricción activa: la línea satura y el flujo alcanza su límite (|F_l| = F_l,max). Debe entrar generación local más cara para cubrir la demanda. Aparece un precio sombra μ_l > 0.',
  };

  const NodeCircle = ({ n, cls }) => (
    <g>
      <circle cx={n.x} cy={n.y} r="20" className={cls || styles.node} />
      <text x={n.x} y={n.y + 1} className={styles.nodeLabel} textAnchor="middle" dominantBaseline="middle">{n.label}</text>
    </g>
  );

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Operación del sistema · DC-OPF</p>
        <h3 className={styles.title}>Despacho económico bajo restricciones físicas</h3>
        <p className={styles.subtitle}>
          El óptimo de menor coste cambia cuando los límites de flujo obligan a redespachar generación.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>min Σ C<sub>g</sub>(P<sub>g</sub>)</span>
        <span className={styles.eqSep}>s.a.</span>
        <span className={styles.eqSmall}>ΣP<sub>g</sub> − ΣP<sub>d</sub> = 0</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eqSmall}>|F<sub>l</sub>| ≤ F<sub>l,max</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="dcopf-title dcopf-desc"
        >
          <title id="dcopf-title">Comparación de despacho económico sin congestión y con restricción activa de red</title>
          <desc id="dcopf-desc">
            Dos paneles lado a lado, cada uno con tres nodos. A la izquierda, despacho sin congestión donde la generación barata
            cubre toda la demanda. A la derecha, una línea satura y aparece generación local más cara, con precio sombra μ_l mayor que cero.
          </desc>

          {/* ═══ Panel A: sin congestión ═══ */}
          <g opacity={isHighlighted('free') ? 1 : 0.3}
            onMouseEnter={() => activate('free')}
            onMouseLeave={deactivate}
            onFocus={() => activate('free')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Escenario A: despacho sin congestión"
          >
            <rect x="5" y="20" width={midX - 20} height={H - 40} rx="8"
              className={styles.panelBg} />
            <text x={(midX - 20) / 2 + 5} y="42" className={styles.panelTitle} textAnchor="middle">
              A · sin congestión
            </text>

            {/* Lines */}
            <line x1={nodesA.genCheap.x} y1={nodesA.genCheap.y} x2={nodesA.corridor.x} y2={nodesA.corridor.y} className={styles.lineNormal} />
            <line x1={nodesA.genCheap.x} y1={nodesA.genCheap.y} x2={nodesA.demand.x} y2={nodesA.demand.y} className={styles.lineNormal} />
            <line x1={nodesA.corridor.x} y1={nodesA.corridor.y} x2={nodesA.demand.x} y2={nodesA.demand.y} className={styles.lineNormal} />

            {/* Flow arrows */}
            <polygon points={`${nodesA.genCheap.x + 55},${nodesA.genCheap.y + 45} ${nodesA.genCheap.x + 62},${nodesA.genCheap.y + 40} ${nodesA.genCheap.x + 58},${nodesA.genCheap.y + 50}`}
              fill="var(--fig-pistachio)" opacity="0.7" />

            {/* Nodes */}
            <NodeCircle n={nodesA.genCheap} cls={styles.nodeGen} />
            <NodeCircle n={nodesA.corridor} />
            <NodeCircle n={nodesA.demand} />

            <text x={(midX - 20) / 2 + 5} y={H - 48} className={styles.scenarioLabel} textAnchor="middle">
              coste mínimo
            </text>
            <text x={(midX - 20) / 2 + 5} y={H - 34} className={styles.scenarioNote} textAnchor="middle">
              flujo ≤ límite
            </text>
          </g>

          {/* ═══ Panel B: restricción activa ═══ */}
          <g opacity={isHighlighted('congested') ? 1 : 0.3}
            onMouseEnter={() => activate('congested')}
            onMouseLeave={deactivate}
            onFocus={() => activate('congested')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Escenario B: restricción activa de red"
          >
            <rect x={midX + 5} y="20" width={midX - 20} height={H - 40} rx="8"
              className={styles.panelBg} />
            <text x={midX + (midX - 20) / 2 + 5} y="42" className={styles.panelTitle} textAnchor="middle">
              B · restricción activa
            </text>

            {/* Lines — one congested */}
            <line x1={nodesB.genCheap.x} y1={nodesB.genCheap.y} x2={nodesB.corridor.x} y2={nodesB.corridor.y} className={styles.lineNormal} />
            <line x1={nodesB.genCheap.x} y1={nodesB.genCheap.y} x2={nodesB.demand.x} y2={nodesB.demand.y}
              className={styles.lineCongested} />
            <line x1={nodesB.corridor.x} y1={nodesB.corridor.y} x2={nodesB.demand.x} y2={nodesB.demand.y} className={styles.lineNormal} />

            {/* Congestion label */}
            <text x={(nodesB.genCheap.x + nodesB.demand.x) / 2 - 28} y={(nodesB.genCheap.y + nodesB.demand.y) / 2 + 16}
              className={styles.congLabel}>flujo = límite</text>

            {/* Small local gen arrow at demand node */}
            <line x1={nodesB.demand.x + 28} y1={nodesB.demand.y + 8}
              x2={nodesB.demand.x + 55} y2={nodesB.demand.y + 20}
              className={styles.reDispatchLine} />
            <text x={nodesB.demand.x + 58} y={nodesB.demand.y + 26}
              className={styles.reDispatchLabel}>G local caro</text>

            {/* Nodes */}
            <NodeCircle n={nodesB.genCheap} cls={styles.nodeGen} />
            <NodeCircle n={nodesB.corridor} />
            <NodeCircle n={nodesB.demand} />

            <text x={midX + (midX - 20) / 2 + 5} y={H - 48} className={styles.scenarioLabel} textAnchor="middle">
              redespacho
            </text>
            <text x={midX + (midX - 20) / 2 + 5} y={H - 34} className={styles.scenarioNote} textAnchor="middle">
              μ_l {'>'} 0
            </text>
          </g>

          {/* ═══ Central arrow ═══ */}
          <line x1={midX - 8} y1={H / 2} x2={midX + 8} y2={H / 2} className={styles.centralArrow} />
          <text x={midX} y={H / 2 - 10} className={styles.centralLabel} textAnchor="middle">restricción</text>
          <text x={midX} y={H / 2 + 20} className={styles.centralLabel} textAnchor="middle">de red</text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeScenario ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeScenario ? scenarioInfo[activeScenario] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        <span className={`${styles.legendItem} ${activeScenario === 'free' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('free')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotViable} /> flujo viable
        </span>
        <span className={`${styles.legendItem} ${activeScenario === 'congested' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('congested')} onMouseLeave={deactivate} tabIndex={0} role="button">
          <i className={styles.dotCongestion} /> congestión
        </span>
        <span className={styles.legendItem}>
          <i className={styles.dotRedispatch} /> redespacho
        </span>
        <span className={styles.legendItem}>
          μ<sub>l</sub> precio sombra
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> El DC-OPF convierte la red en restricciones explícitas: si una línea satura, el despacho barato deja de ser viable y aparece un redespacho con precio sombra de congestión.
      </div>
    </figure>
  );
}
