// slides/Slide79.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide79.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide79({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const opexOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const retrofitOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const capexOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CAPEX ESTRUCTURAL" color="#3b82f6" />
        <DigitalClock fixedTime="RETROFITTING · SYNCONS · BESS" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>COSTE DE REFORMAS OBLIGATORIAS</h1>
        <h2 className={styles.subtitle}>DEL OPEX TÓXICO AL CAPEX RENTABLE</h2>

        <div style={{ opacity: opexOpacity, width: '100%' }}>
          <div className={styles.opexBox}>
            <strong>⚠️ "OPERACIÓN REFORZADA" (POST-APAGÓN)</strong>
            <div>FORZADO DE 25-30 CENTRALES DE CICLO COMBINADO QUEMANDO GAS PARA PROVEER INERCIA Y CORTOCIRCUITO</div>
            <div>COSTE DIRECTO (12 MESES): <strong className={styles.red}>711 MILLONES DE EUROS</strong></div>
            <div>AUDITORÍA PWC: SOBRECOSTE SUPERIOR A <strong className={styles.red}>1.000 MILLONES DE EUROS</strong> RESPECTO A 2024</div>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: retrofitOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>RETROFITTING P.O. 7.4 – PARQUE RENOVABLE</h3>
            <div className={styles.retroBox}>
              <div>EXIGENCIA: CONTROL DINÁMICO DE TENSIÓN (Q) PARA INVERSORES</div>
              <div>UNIDAD DE COSTE: 5.000 – 15.000 €/MW</div>
              <div>FACTURA AGREGADA NACIONAL: <strong className={styles.red}>400 – 1.000 MILLONES DE EUROS</strong></div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: capexOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>INVERSIÓN ESTRUCTURAL: SYNCONS + BESS</h3>
            <div className={styles.capexBox}>
              <div>CONDENSADORES SÍNCRONOS + BATERÍAS A GRAN ESCALA (ENGIE-ROLWIND, 278 MW / 1,1 GWH)</div>
              <div>COSTE PARAMÉTRICO: <strong>0,86 M€/MW</strong></div>
              <div>MÍNIMO OPERATIVO REQUERIDO: <strong>3.500 MW</strong></div>
              <div className={styles.capexTotal}>CAPEX ESTRUCTURAL NACIONAL: <strong>≈ 3.010 MILLONES DE EUROS</strong></div>
            </div>
            <div className={styles.payback}>
              PERIODO DE RETORNO (PAYBACK) DINÁMICO &lt; 5 AÑOS – VAN MASIVAMENTE POSITIVO
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: REE · PWC · ENGIE · ROLWIND · ELABORACIÓN PROPIA</div>
    </div>
  );
}