import React from 'react';
import styles from './styles/Shared.module.css';

export default function DigitalClock({ fixedTime }) {
  return <div className={styles.clock}>{fixedTime} UTC+1</div>;
}
