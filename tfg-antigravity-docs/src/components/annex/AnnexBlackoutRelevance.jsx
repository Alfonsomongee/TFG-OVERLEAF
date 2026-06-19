import React from 'react';
import styles from './AnnexBlackoutRelevance.module.css';

export default function AnnexBlackoutRelevance({ children }) {
  return (
    <div className={styles.container}>
      <span className={styles.title}>Relevancia con el 28-A</span>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
