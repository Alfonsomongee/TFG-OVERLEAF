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
    <div className={styles.container} style={{ 
      minHeight: '600px', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div className={styles.skeletonPulse} style={{ 
        width: '80%', 
        height: '40px', 
        background: 'var(--forensic-amber-muted, #3f3f46)', 
        marginBottom: '20px', 
        borderRadius: 'var(--radius-sm, 4px)' 
      }} />
      <div className={styles.skeletonPulse} style={{ 
        width: '100%', 
        height: '400px', 
        background: 'var(--forensic-amber-bg-subtle, #1f1f24)', 
        marginBottom: '20px', 
        borderRadius: 'var(--radius-sm, 4px)' 
      }} />
      <div className={styles.skeletonPulse} style={{ 
        width: '100%', 
        height: '200px', 
        background: 'var(--forensic-amber-bg-subtle, #1f1f24)', 
        borderRadius: 'var(--radius-sm, 4px)' 
      }} />
      <div style={{ 
        marginTop: '20px', 
        color: 'var(--forensic-amber-primary, #f5b042)', 
        fontFamily: 'var(--telemetry-font, monospace)', 
        letterSpacing: '2px', 
        opacity: 0.6,
        fontSize: '0.9rem'
      }}>
        {text}
      </div>
    </div>
  );
};

export default TelemetryFallback;
