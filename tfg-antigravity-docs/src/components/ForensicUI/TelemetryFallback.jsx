import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function TelemetryFallback() {
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
    <div style={{ minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--forensic-bg)' }}>
      <div style={{ width: '80%', height: '40px', background: 'var(--telemetry-soft)', marginBottom: '20px', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ width: '100%', height: '400px', background: 'rgba(255,170,0,0.05)', marginBottom: '20px', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ width: '100%', height: '200px', background: 'rgba(255,170,0,0.05)', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ marginTop: '20px', color: 'var(--forensic-amber)', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.5 }}>
        {text}
      </div>
    </div>
  );
}
