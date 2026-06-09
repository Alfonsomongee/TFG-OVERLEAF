// %% AGENT_INSTRUCTION: Insertar en "Actualización 2026: Un Año Después", después de "El siguiente panel compara las métricas de vulnerabilidad sistémica actuales con las condiciones registradas el 28 de abril de 2025 a las 12:30 CEST." y antes de "Advertencia metodológica".
// %% LEGEND_PROPOSAL: "Cada fila enfrenta el valor de una métrica de seguridad del sistema en el instante previo al colapso (28‑A) con su equivalente en mayo de 2026. Las barras normalizadas facilitan la comparación visual; los valores exactos se indican a la derecha. Confianza: Alta / Media / Baja."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ThenVsNowPanel.module.css';

const METRICS = [
  {
    id: 'inertia_pen',
    label: 'Inercia media peninsular (H)',
    before: 3.2,
    after: 4.5,
    unit: 's',
    beforeDisplay: '~3,2',
    afterDisplay: '~4,5',
    max: 5.5,
    confidence: 'Media',
  },
  {
    id: 'inertia_sur',
    label: 'Inercia zonal sur (H)',
    before: 1.5,
    after: 3.5,
    unit: 's',
    beforeDisplay: '< 2,0',
    afterDisplay: '~3,5',
    max: 4.5,
    confidence: 'Baja (est.)',
  },
  {
    id: 'scc',
    label: 'Potencia de cortocircuito (Ssc) en nudos críticos',
    before: 7500,
    after: 10500,
    unit: 'MVA',
    beforeDisplay: '< 8.500',
    afterDisplay: '> 10.000',
    max: 13000,
    confidence: 'Media',
  },
  {
    id: 'ren_pen',
    label: 'Penetración renovable en valle solar',
    before: 53.3,
    after: 58.0,
    unit: '%',
    beforeDisplay: '53,3 %',
    afterDisplay: '~58,0 %',
    max: 70,
    confidence: 'Alta',
    neutral: true,
  },
  {
    id: 'bess',
    label: 'Capacidad BESS operativa',
    before: 100,
    after: 9590,
    unit: 'MW',
    beforeDisplay: '~100',
    afterDisplay: '> 9.590',
    max: 10000,
    confidence: 'Media',
  },
  {
    id: 'horas_cero',
    label: 'Horas de precio ≤ 0 €/MWh (anual)',
    before: 798,
    after: 607,
    unit: 'h',
    beforeDisplay: '798',
    afterDisplay: '607 (proy.)',
    max: 900,
    confidence: 'Alta',
    inverted: true,
  },
  {
    id: 'gen_sinc',
    label: 'Generación síncrona mínima acoplada',
    before: 1635,
    after: 3000,
    unit: 'MW',
    beforeDisplay: '1.635',
    afterDisplay: '> 3.000',
    max: 4000,
    confidence: 'Alta',
  },
  {
    id: 'ccgt',
    label: 'Nº de CCGT en servicio (valle solar)',
    before: 4,
    after: 8,
    unit: 'ud.',
    beforeDisplay: '~4',
    afterDisplay: '6‑10',
    max: 10,
    confidence: 'Media',
  },
];

export default function ThenVsNowPanel() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedId, setSelectedId] = useState(null);

  const toggle = (id) => setSelectedId((prev) => (prev === id ? null : id));

  const barBefore = isDark ? '#d45a54' : '#a83832';
  const barAfter = isDark ? '#6aad52' : '#4a7c3a';
  const barNeutral = isDark ? '#5a90c8' : '#2a5080';

  const getAfterColor = (m) => (m.neutral ? barNeutral : barAfter);

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Evolución de la resiliencia</span>
        <h3 className={styles.title}>Sistema ahora vs. 28‑A</h3>
        <p className={styles.subtitle}>
          Métricas de vulnerabilidad del sistema peninsular: escenario previo
          al colapso frente a la situación actual (mayo 2026).
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: barBefore }} aria-hidden="true" />
          28‑A (pre‑colapso)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: barAfter }} aria-hidden="true" />
          Mayo 2026
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: barNeutral }} aria-hidden="true" />
          Contextual
        </span>
      </div>

      <div
        className={styles.table}
        role="table"
        aria-label="Comparación de métricas de seguridad del sistema"
      >
        {/* Header row */}
        <div className={styles.tableHead} role="row" aria-hidden="true">
          <span className={styles.colLabel}>Métrica</span>
          <span className={styles.colBar}>Comparación</span>
          <span className={styles.colConf}>Conf.</span>
        </div>

        {METRICS.map((m) => {
          const beforePct = Math.min((m.before / m.max) * 100, 100);
          const afterPct = Math.min((m.after / m.max) * 100, 100);
          const isSelected = m.id === selectedId;
          const afterColor = getAfterColor(m);

          return (
            <button
              key={m.id}
              type="button"
              className={`${styles.metricRow} ${isSelected ? styles.rowActive : ''}`}
              onClick={() => toggle(m.id)}
              aria-expanded={isSelected}
              aria-label={`${m.label}: 28-A ${m.beforeDisplay} ${m.unit}, 2026 ${m.afterDisplay} ${m.unit}`}
            >
              <span className={styles.metricLabel}>{m.label}</span>

              <span className={styles.barBlock}>
                {/* Before bar */}
                <span className={styles.barLine}>
                  <span className={styles.barTag}>28‑A</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{ width: `${Math.max(beforePct, 1.5)}%`, backgroundColor: barBefore }}
                    />
                  </span>
                  <span className={styles.barVal} style={{ color: barBefore }}>
                    {m.beforeDisplay}
                  </span>
                </span>
                {/* After bar */}
                <span className={styles.barLine}>
                  <span className={styles.barTag}>2026</span>
                  <span className={styles.barTrack}>
                    <span
                      className={styles.barFill}
                      style={{ width: `${Math.max(afterPct, 1.5)}%`, backgroundColor: afterColor }}
                    />
                  </span>
                  <span className={styles.barVal} style={{ color: afterColor }}>
                    {m.afterDisplay}
                  </span>
                </span>
              </span>

              <span className={styles.confidence}>{m.confidence}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
