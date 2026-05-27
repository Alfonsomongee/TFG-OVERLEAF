import React from 'react';
import styles from './styles/Shared.module.css';

export default function StatusIndicator({ status, color }) {
  return (
    <div className={styles.statusIndicator} style={{ color }}>
      <span className={styles.statusDot} style={{ backgroundColor: color }}></span>
      {status}
    </div>
  );
}
