// slides/Slide86.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide86.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide86({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const cnmcOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const demandasOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const audiosOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="LITIGIOS" color="#b91c1c" />
        <DigitalClock fixedTime="AVALANCHA JUDICIAL" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>CONSECUENCIAS INSTITUCIONALES Y LITIGIOS MULTIMILLONARIOS</h1>
        <h2 className={styles.subtitle}>66 EXPEDIENTES · DEMANDAS CIVILES · AUDIOS CLASIFICADOS</h2>

        <div style={{ opacity: cnmcOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>EXPEDIENTES SANCIONADORES CNMC</h3>
          <div className={styles.cnmcBox}>
            <div>🔴 <strong>66 EXPEDIENTES</strong> INCOADOS DESDE ABRIL 2025</div>
            <div>⚠️ REE Y ALMARAZ: CARGOS "MUY GRAVES" (HASTA <strong>60 MILLONES DE EUROS</strong>)</div>
            <div>⚠️ 11 PRODUCTORAS (ENDESA, IBERDROLA, MERCURIA SOLAR): CARGOS "GRAVES" POR INCUMPLIMIENTO DE CÓDIGOS DE RED</div>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: demandasOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>DEMANDAS CIVILES MASIVAS</h3>
            <div className={styles.demandasBox}>
              <div>💰 <strong>REPSOL</strong> DEMANDA A REE POR <strong>125 MILLONES DE EUROS</strong> (LUCRO CESANTE + DAÑOS A COMPLEJOS PETROQUÍMICOS)</div>
              <div>💰 IRYO Y MOEVE HAN NOTIFICADO INTENCIÓN DE DEMANDAR</div>
              <div>📅 VENCIMIENTO DEL PLAZO DE PRESCRIPCIÓN: ABRIL 2026</div>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: audiosOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>AUDIOS CLASIFICADOS (COMISIÓN DE INVESTIGACIÓN DEL SENADO)</h3>
            <div className={styles.audiosBox}>
              <div>🎙️ OPERADORES DE REE ATRIBUYERON LAS OSCILACIONES DE TENSIÓN DE LAS 12:00 A:</div>
              <div><strong>"LA MALA GESTIÓN DE UNA PLANTA FOTOVOLTAICA DE GRAN POTENCIA EN BADAJOZ"</strong></div>
              <div>⚠️ EL RIESGO ERA INMINENTE MINUTOS ANTES DEL COLAPSO FINAL</div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: CNMC · PODER JUDICIAL · SENADO · COMISIÓN DE INVESTIGACIÓN</div>
    </div>
  );
}