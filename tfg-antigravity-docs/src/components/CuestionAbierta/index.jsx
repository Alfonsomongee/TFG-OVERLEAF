import React, { useState } from 'react';
import datosForenses from '@site/src/data/datosForenses.json';
import styles from './styles.module.css';

const getNestedProperty = (obj, path) => {
  if (!path) return null;
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
};

export default function CuestionAbierta({ metricKey, children }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const metric = getNestedProperty(datosForenses, metricKey);

  if (!metric) return <span className={styles.wrapper}>{children}</span>;

  return (
    <span 
      className={styles.wrapper}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <span className={styles.content}>
        {children}
        <span className={styles.icon}>❓</span>
      </span>
      {showTooltip && (
        <span className={styles.tooltip}>
          <strong>Discrepancia / Cuestión Abierta:</strong> 
          <p className={styles.note}>{metric.notaDiscrepancia || metric.contexto}</p>
          {metric.valorAlternativo !== null && metric.valorAlternativo !== undefined && (
            <span className={styles.altValue}>
              Valor alternativo citado: {metric.valorAlternativo} {metric.unidad}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
