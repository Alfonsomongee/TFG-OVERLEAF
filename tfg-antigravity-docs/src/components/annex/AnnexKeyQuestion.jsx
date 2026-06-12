import React from 'react';
import styles from './AnnexKeyQuestion.module.css';

export default function AnnexKeyQuestion({ children }) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Pregunta Técnica Clave</h4>
      <p className={styles.content}>{children}</p>
    </div>
  );
}
