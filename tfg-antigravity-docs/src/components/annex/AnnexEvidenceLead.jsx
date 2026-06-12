import React from 'react';
import styles from './AnnexEvidenceLead.module.css';

export default function AnnexEvidenceLead({ eyebrow, title, summary, insight, children }) {
  return (
    <div className={styles.lead}>
      <div className={styles.leadText}>
        {eyebrow && <span className={styles.leadEyebrow}>{eyebrow}</span>}
        {title   && <h4   className={styles.leadTitle}>{title}</h4>}
        {summary && <p    className={styles.leadSummary}>{summary}</p>}
        {insight && <div  className={styles.leadInsight}>{insight}</div>}
      </div>
      <div className={styles.leadFigure}>
        {children}
      </div>
    </div>
  );
}
