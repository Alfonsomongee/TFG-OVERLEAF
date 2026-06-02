// slides/Slide43.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide43.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide43({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const rccOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const commandOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const supportOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="COORDINACIÓN INTERNACIONAL" color="#3b82f6" />
        <DigitalClock fixedTime="12:36 – 13:04" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>COORDINACIÓN INTERNACIONAL Y RESINCRONIZACIÓN</h1>
        <h2 className={styles.subtitle}>RCC, SWISSGRID, RTE Y ONEE</h2>

        {/* LIMITACIONES RCC */}
        <div style={{ opacity: rccOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>CENTROS DE COORDINACIÓN REGIONAL (RCC)</h3>
          <div className={styles.warningNote}>⚠️ ANÁLISIS ESTÁTICOS – NO CAPTURAN DINÁMICA RÁPIDA. ESTADO "OK" HASTA EL APAGÓN.</div>
        </div>

        {/* JERARQUÍA DE MANDO */}
        {stage >= 2 && (
          <div style={{ opacity: commandOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>ESTRUCTURA DE MANDO (12:49–12:54 CEST)</h3>
            <div className={styles.commandGrid}>
              <div><span>REE</span> → LÍDER DE FRECUENCIA (ISLA IBÉRICA)</div>
              <div><span>SWISSGRID</span> → ESTABILIZACIÓN DEL RESTO DEL CONTINENTE</div>
              <div><span>RTE (FRANCIA)</span> → LÍDER DE RESINCRONIZACIÓN GENERAL</div>
            </div>
          </div>
        )}

        {/* SOPORTE TRANSFRONTERIZO */}
        {stage >= 3 && (
          <div style={{ opacity: supportOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>SOPORTE TRANSFRONTERIZO</h3>
            <div className={styles.supportGrid}>
              <div className={styles.franceCard}>
                <span>FRANCIA (RTE)</span>
                <p>ACTIVÓ OFERTAS DE BALANCE POR HASTA <strong>4.500 MW</strong> PARA EXPORTACIÓN A ESPAÑA</p>
              </div>
              <div className={styles.moroccoCard}>
                <span>MARRUECOS (ONEE)</span>
                <p>INYECCIÓN DE <strong>900 MW</strong> VÍA PUERTO DE LA CRUZ–MELLOUSA A LAS 13:04 CEST</p>
                <p className={styles.smallNote}>ANCLA ELECTROMECÁNICA DE ANDALUCÍA</p>
              </div>
            </div>
            <div className={styles.conclusion}>CASO DE COORDINACIÓN EFECTIVA ENTRE OPERADORES EUROPEOS (OB3)</div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ENTSO-E / REE / RTE / ONEE – INFORME FACTUAL</div>
    </div>
  );
}