import React from 'react';
import styles from './AnnexThesisBox.module.css';

export default function AnnexThesisBox({ children }) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Tesis del Anexo</h4>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
