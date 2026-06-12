import React from 'react';
import styles from './AnnexBlackoutRelevance.module.css';

export default function AnnexBlackoutRelevance({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.dotContainer}>
        <div className={styles.dot} />
      </div>
      <div>
        <h5 className={styles.title}>Relevancia con el 28-A</h5>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
