import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InteractiveCTA.module.css';

export default function InteractiveCTA({ title, description, children, icon = '⚡' }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={`${styles.ctaContainer} ${expanded ? styles.expanded : ''}`}>
      <div 
        className={styles.ctaHeader} 
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.ctaIcon}>{icon}</div>
        <div className={styles.ctaText}>
          <h4 className={styles.ctaTitle}>{title || "LABORATORIO INTERACTIVO"}</h4>
          {description && <p className={styles.ctaDescription}>{description}</p>}
          <button className={styles.ctaButton}>
            {expanded ? 'Cerrar ↑' : 'Ejecutar simulación →'}
          </button>
        </div>
      </div>
      {expanded && (
        <div className={styles.ctaContent}>
          <BrowserOnly fallback={<div className={styles.loadingFallback}>Cargando simulador...</div>}>
            {() => children}
          </BrowserOnly>
        </div>
      )}
    </div>
  );
}
