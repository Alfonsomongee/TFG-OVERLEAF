import React from 'react';
import styles from './AnnexEvidenceGrid.module.css';

export default function AnnexEvidenceGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}
