import React, { useMemo } from 'react';
import styles from './ICSViolationsGrid.module.css';

const FALLBACK_VIOLATIONS_DATA = {
  criteria: [
    { id: 'OB', scale: '3', description: 'Sobre-voltaje masivo' },
    { id: 'L', scale: '2', description: 'Pérdida estabilidad ángulo' },
    { id: 'L', scale: '1', description: 'Pérdida estabilidad ángulo (transient)' },
    { id: 'F', scale: '1', description: 'Estabilidad de frecuencia' },
    { id: 'T', scale: '2', description: 'Transitorios peligrosos' },
    { id: 'G', scale: '1', description: 'Control de generación' },
    { id: 'ON', scale: '2', description: 'Sobreintensidad de neutro' },
    { id: 'RS', scale: '1', description: 'Sincronismo entre zonas' },
  ],
  tsos: [
    { id: 'RE', name: 'Red Eléctrica', country: '🇪🇸' },
    { id: 'REN', name: 'REN', country: '🇵🇹' },
    { id: 'RTE', name: 'RTE', country: '🇫🇷' },
  ],
  violations: {
    'OB-3': { RE: true, REN: true, RTE: false },
    'L-2': { RE: true, REN: true, RTE: false },
    'L-1': { RE: false, REN: false, RTE: false },
    'F-1': { RE: true, REN: true, RTE: false },
    'T-2': { RE: true, REN: false, RTE: false },
    'G-1': { RE: true, REN: true, RTE: false },
    'ON-2': { RE: true, REN: false, RTE: false },
    'RS-1': { RE: true, REN: true, RTE: false },
  },
};

const ICSViolationsGrid = React.memo(() => {
  const { criteria, tsos, violations } = FALLBACK_VIOLATIONS_DATA;

  const violationCounts = useMemo(() => {
    const counts = {};
    tsos.forEach((tso) => {
      counts[tso.id] = 0;
      Object.values(violations).forEach((viol) => {
        if (viol[tso.id]) counts[tso.id]++;
      });
    });
    return counts;
  }, [tsos, violations]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Matriz de Violaciones de Criterios ICS</h2>
        <p className={styles.subtitle}>28-A Cascada de Fallos — Cual criterio fue violado por cual TSO</p>
      </div>

      <div className={styles.alertBox}>
        ⚠️ 7 criterios violados en la Península Ibérica. Fallo múltiple del sistema.
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {/* Header row */}
          <div className={styles.headerCell} style={{ gridColumn: '1 / 2' }}>
            Criterion (scale)
          </div>
          {tsos.map((tso) => (
            <div key={tso.id} className={styles.headerCell}>
              {tso.country} {tso.name}
            </div>
          ))}

          {/* Data rows */}
          {criteria.map((crit) => {
            const key = `${crit.id}-${crit.scale}`;
            return (
              <React.Fragment key={key}>
                <div
                  className={styles.cellLabel}
                  title={crit.description}
                >
                  {crit.id}({crit.scale})
                </div>
                {tsos.map((tso) => {
                  const isViolated = violations[key]?.[tso.id] ?? false;
                  return (
                    <div
                      key={`${key}-${tso.id}`}
                      className={isViolated ? styles.cellViolated : styles.cellOk}
                    >
                      {isViolated ? '✓' : '—'}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span style={{ color: 'hsl(0 75% 58%)' }}>✓</span> VIOLATED
        </div>
        <div className={styles.legendItem}>
          <span style={{ color: 'hsl(220 12% 48%)' }}>—</span> NOT VIOLATED
        </div>
      </div>

      <div className={styles.counters}>
        <div>
          <strong>Total Violations:</strong> {Object.values(violations).reduce((acc, v) => acc + Object.values(v).filter(Boolean).length, 0)} / {criteria.length * tsos.length}
        </div>
        {tsos.map((tso) => (
          <div key={tso.id}>
            <strong>{tso.name}:</strong> {violationCounts[tso.id]} violated
          </div>
        ))}
      </div>
    </div>
  );
});

ICSViolationsGrid.displayName = 'ICSViolationsGrid';

export default ICSViolationsGrid;
