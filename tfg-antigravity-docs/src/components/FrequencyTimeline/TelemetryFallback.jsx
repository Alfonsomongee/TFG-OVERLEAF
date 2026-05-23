import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './FrequencyTimeline.module.css';

const TelemetryFallback = () => {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  
  const T = {
    es: "CARGANDO DATOS DE TELEMETRÍA...",
    en: "LOADING TELEMETRY DATA...",
    pt: "CARREGANDO DADOS DE TELEMETRIA...",
    fr: "CHARGEMENT DES DONNÉES TÉLÉMÉTRIQUES...",
    it: "CARICAMENTO DATI DI TELEMETRIA...",
    de: "LADEN DER TELEMETRIEDATEN..."
  };
  
  const text = T[currentLocale] || T.en;
  return (
    <div className={styles.container} style={{ minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className={styles.skeletonPulse} style={{ width: '80%', height: '40px', background: 'var(--forensic-amber-muted)', marginBottom: '20px', borderRadius: 'var(--radius-sm)' }}></div>
      <div className={styles.skeletonPulse} style={{ width: '100%', height: '400px', background: 'var(--forensic-amber-bg-subtle)', marginBottom: '20px', borderRadius: 'var(--radius-sm)' }}></div>
      <div className={styles.skeletonPulse} style={{ width: '100%', height: '200px', background: 'var(--forensic-amber-bg-subtle)', borderRadius: 'var(--radius-sm)' }}></div>
      <div style={{ marginTop: '20px', color: 'var(--forensic-amber-primary)', fontFamily: 'var(--telemetry-font)', letterSpacing: '2px', opacity: 0.5 }}>
        {text}
      </div>
    </div>
  );
};

export default TelemetryFallback;
