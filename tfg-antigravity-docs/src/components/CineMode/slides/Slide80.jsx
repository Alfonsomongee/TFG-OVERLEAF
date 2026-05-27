// slides/Slide80.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide80.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide80({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.3) setStage(1);
  }, [slideProgress]);

  const finalOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CONCLUSIÓN" color="#10b981" />
        <DigitalClock fixedTime="RESILIENCIA RENTABLE" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>CONCLUSIONES: LA RESILIENCIA COMO INVERSIÓN RENTABLE</h1>
        <h2 className={styles.subtitle}>BALANCE CONTABLE AGREGADO DEL APAGÓN</h2>

        <div style={{ opacity: finalOpacity, width: '100%' }}>
          <div className={styles.summaryBox}>
            <div>💸 DESTRUCCIÓN DE VALOR MACROECONÓMICO (VOLL): <strong>1.000 – 1.500 M€</strong></div>
            <div>🏭 PÉRDIDAS SECTOR ELECTROINTENSIVO (AEGE): <strong>&gt;25 M€</strong></div>
            <div>⚖️ MULTAS CNMC Y LITIGIOS: EXPOSICIÓN DE HASTA <strong>60 M€ POR EXPEDIENTE</strong></div>
            <div>🔥 OPEX "OPERACIÓN REFORZADA" (ANUAL): <strong>&gt;711 M€</strong></div>
          </div>

          <div className={styles.investBox}>
            <strong>CAPEX REQUERIDO PARA RESILIENCIA ESTRUCTURAL:</strong>
            <div>RETROFITTING P.O. 7.4: <strong>400 – 1.000 M€</strong></div>
            <div>SYNCONS + BESS (3.500 MW): <strong>≈ 3.010 M€</strong></div>
            <div className={styles.total}>TOTAL CAPEX ESTRATÉGICO: <strong>≈ 3.500 – 4.000 M€</strong></div>
          </div>

          <div className={styles.finalMessage}>
            EL COSTE DEL CAPITAL DESTINADO A LA RESILIENCIA SISTÉMICA ES ÓRDENES DE MAGNITUD
            INFERIOR A LA MASIVA DESTRUCCIÓN DE VALOR (OPEX SOBREVENIDO, LUCRO CESANTE E INDEMNIZACIONES)
            GENERADA POR LA VULNERABILIDAD DE LA RED.
          </div>

          <div className={styles.tagline}>
            INVERTIR EN ROBUSTEZ FÍSICA Y ALGORÍTMICA DE LA RED NO ES UN PASIVO GUBERNAMENTAL,
            SINO UN ESCUDO FISCAL ESTRATÉGICO Y LA PRERROGATIVA ABSOLUTA PARA SALVAGUARDAR
            LA SOBERANÍA INDUSTRIAL Y ASEGURAR EL ÉXITO IRREVERSIBLE DE LA TRANSICIÓN ENERGÉTICA.
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: SÍNTESIS DE AUDITORÍA – ELABORACIÓN PROPIA</div>
    </div>
  );
}