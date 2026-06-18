import React from 'react';
import styles from './TechnicalSurface.module.css';

export default function TechnicalSurface({
  children,
  className = '',
  withNoise = true,
  withGrid = true,
  withScanlines = false,
  ...rest
}) {
  return (
    <div className={`${styles.surface} ${className}`} {...rest}>
      {withNoise && <div className={styles.noise} aria-hidden="true" />}
      {withGrid && <div className={styles.grid} aria-hidden="true" />}
      {withScanlines && <div className={styles.scanlines} aria-hidden="true" />}
      
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
