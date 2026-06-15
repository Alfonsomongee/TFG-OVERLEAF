/**
 * AnnexSectionSummary.jsx
 * 
 * BUG CORREGIDO: El componente original solo acepta {children}.
 * Todos los anexos reescritos pasan demonstrates, doesNotDemonstrate y connection como props.
 * Esas props se IGNORAN silenciosamente → la síntesis interpretativa aparece vacía.
 *
 * SOLUCIÓN: Aceptar ambos modos (children O props estructuradas).
 */
import React from 'react';
import styles from './AnnexSectionSummary.module.css';

export default function AnnexSectionSummary({ 
  demonstrates, 
  doesNotDemonstrate, 
  connection, 
  children 
}) {
  /* Si se pasan props estructuradas, renderizar con formato */
  const hasStructuredProps = demonstrates || doesNotDemonstrate || connection;

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Síntesis Interpretativa</h4>

      {hasStructuredProps ? (
        <div className={styles.content}>
          {demonstrates && (
            <div className="annex-summary-block annex-summary-demonstrates">
              <h5 className="annex-summary-subtitle">✓ Lo que demuestra este anexo</h5>
              <p>{demonstrates}</p>
            </div>
          )}
          {doesNotDemonstrate && (
            <div className="annex-summary-block annex-summary-limits">
              <h5 className="annex-summary-subtitle">✗ Lo que no demuestra</h5>
              <p>{doesNotDemonstrate}</p>
            </div>
          )}
          {connection && (
            <div className="annex-summary-block annex-summary-connection">
              <h5 className="annex-summary-subtitle">↔ Conexión con otros anexos y capítulos</h5>
              <p>{connection}</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
}
