/**
 * AnnexOpening.jsx
 *
 * Bloque de apertura conceptual del anexo.
 * Fusiona en un único componente de 2 columnas lo que antes eran
 * 4 bloques consecutivos: AnnexKeyQuestion, AnnexThesisBox,
 * AnnexBlackoutRelevance y AnnexMethodNote.
 *
 * Props:
 *   question   (string)    — pregunta técnica clave
 *   thesis     (string)    — tesis del anexo
 *   relevance  (ReactNode) — relevancia con el 28-A (acepta JSX con links)
 *   sources    (string)    — fuentes primarias en texto plano
 */

import React from 'react';
import styles from './AnnexOpening.module.css';

export default function AnnexOpening({ question, thesis, relevance, sources }) {
  return (
    <div className={styles.opening}>

      {/* Columna izquierda: pregunta + tesis */}
      <div className={styles.left}>
        {question && (
          <div className={styles.block}>
            <span className={styles.label}>Pregunta clave</span>
            <p className={styles.question}>{question}</p>
          </div>
        )}
        {thesis && (
          <div className={styles.block}>
            <span className={styles.label}>Tesis del anexo</span>
            <p className={styles.thesis}>{thesis}</p>
          </div>
        )}
      </div>

      {/* Columna derecha: relevancia + fuentes */}
      <div className={styles.right}>
        {relevance && (
          <div className={styles.block}>
            <span className={styles.label}>Relevancia con el 28-A</span>
            <div className={styles.relevance}>{relevance}</div>
          </div>
        )}
        {sources && (
          <div className={styles.block}>
            <span className={styles.label}>Fuentes</span>
            <p className={styles.sources}>{sources}</p>
          </div>
        )}
      </div>

    </div>
  );
}
