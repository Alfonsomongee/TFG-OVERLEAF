// slides/Slide85.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide85.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide85({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const faltaOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const hvdcOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const advertenciaOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="OPACIDAD OPERATIVA" color="#f59e0b" />
        <DigitalClock fixedTime="REE · HVDC INELFE" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>OPACIDAD OPERATIVA Y EL ROL DEL HVDC</h1>
        <h2 className={styles.subtitle}>CAMBIO DE MODO MINUTOS ANTES DEL APAGÓN</h2>

        <div style={{ opacity: faltaOpacity, width: '100%' }}>
          <div className={styles.faltaBox}>
            <strong>DENUNCIA DEL CONSORCIO INDEPENDIENTE (AELEC, INESC TEC, COMPASS LEXECON) – JULIO 2025</strong>
            <p>SEVERA FALTA DE TRANSPARENCIA EN LOS DATOS DE ESTIMADORES DE ESTADO Y UNIDADES DE MEDICIÓN FASORIAL (PMU)</p>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: hvdcOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>HALLAZGO CRÍTICO: CAMBIO DE MODO DEL HVDC INELFE</h3>
            <div className={styles.hvdcBox}>
              <div>⚠️ MINUTOS ANTES DEL APAGÓN, REE MODIFICÓ EL MODO DE OPERACIÓN DEL ENLACE</div>
              <div>❌ DE "EMULACIÓN DE CA" → A CONTROL DE POTENCIA EN CC CONSTANTE</div>
              <div>💀 NEUTRALIZÓ SU CAPACIDAD PARA AMORTIGUAR LA OSCILACIÓN LETAL DE <strong>0,6 HZ</strong></div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: advertenciaOpacity, width: '100%' }}>
            <div className={styles.warningBox}>
              ⚠️ EL ENLACE INELFE, DISEÑADO PARA AMORTIGUAR OSCILACIONES INTER-ÁREA,
              QUEDÓ FIJADO EN POTENCIA CONSTANTE – INCAPAZ DE RESPONDER DINÁMICAMENTE
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: AELEC · INESC TEC · COMPASS LEXECON · INVESTIGACIONES FORENSES</div>
    </div>
  );
}