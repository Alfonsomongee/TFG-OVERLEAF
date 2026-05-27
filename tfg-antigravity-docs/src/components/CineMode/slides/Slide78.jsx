// slides/Slide78.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide78.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide78({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.6) setStage(2);
  }, [slideProgress]);

  const cnmcOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.4));
  const litigiosOpacity = Math.min(1, Math.max(0, (slideProgress - 0.6) / 0.3));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="COSTE LEGAL" color="#f59e0b" />
        <DigitalClock fixedTime="CNMC · LITIGIOS" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>COSTE LEGAL Y REGULADOR</h1>
        <h2 className={styles.subtitle}>SANCIONES · EXPEDIENTES · GUERRA MERCANTIL</h2>

        <div style={{ opacity: cnmcOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>EXPEDIENTES SANCIONADORES CNMC</h3>
          <div className={styles.cnmcBox}>
            <div><strong>66 EXPEDIENTES SANCIONADORES</strong> INCOADOS</div>
            <div>AFECTADOS: IBERDROLA, ENDESA, NATURGY, REPSOL, REE</div>
            <div>CARGO PRINCIPAL: INCUMPLIMIENTO CONTROL DINÁMICO DE TENSIÓN Y POTENCIA REACTIVA</div>
          </div>
          <div className={styles.finesBox}>
            <div>🔴 INFRACCIONES GRAVES (ART. 64.15-17 LSE): HASTA <strong>6 M€</strong> POR EXPEDIENTE</div>
            <div>⚠️ INFRACCIONES MUY GRAVES (ART. 64.37 LSE): HASTA <strong>60 M€</strong> POR EXPEDIENTE</div>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: litigiosOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>GUERRA MERCANTIL: IBERDROLA VS REE</h3>
            <div className={styles.litigioBox}>
              <div>⚖️ DEMANDA DE IBERDROLA CONTRA REE Y REDEIA POR COMPETENCIA DESLEAL</div>
              <div>📢 REE DECLARÓ: "5.000 MANIOBRAS IM PECABLES" – RESPONSABILIDAD DESLIZADA A PLANTAS RENOVABLES</div>
              <div>🎯 IBERDROLA ARGUMENTA: DECLARACIONES INEXACTAS QUE DEVALUARON SU VALOR BURSÁTIL Y REPUTACIÓN</div>
              <div className={styles.note}>EL VACÍO DE RESPONSABILIDADES INSTITUCIONALES DESATÓ UNA AGRESIVA GUERRA JUDICIAL ENTRE CORPORACIONES</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: CNMC · LEY 24/2013 LSE · PODER JUDICIAL</div>
    </div>
  );
}