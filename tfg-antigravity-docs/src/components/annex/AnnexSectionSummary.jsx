import React from 'react';
import styles from './AnnexSectionSummary.module.css';

export default function AnnexSectionSummary({ children }) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Síntesis Interpretativa</h4>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
