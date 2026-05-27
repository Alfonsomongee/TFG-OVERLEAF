// slides/Slide64.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide64.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide64({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const asym1Opacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const asym2Opacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const conclusionOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="LECCIONES COMUNICATIVAS" color="#10b981" />
        <DigitalClock fixedTime="POST-EVENT" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>SÍNTESIS: TRES ASIMETRÍAS ESTRUCTURALES</h1>
        <h2 className={styles.subtitle}>LECCIONES PARA LA COMUNICACIÓN DE CRISIS</h2>

        <div style={{ opacity: asym1Opacity, width: '100%' }}>
          <div className={styles.asymCard}>
            <span>01</span>
            <strong>ASIMETRÍA TEMPORAL</strong>
            <p>VELOCIDAD DE PROPAGACIÓN VIRAL INCOMPATIBLE CON EL RITMO DE LA INVESTIGACIÓN FORENSE TÉCNICA</p>
          </div>
        </div>

        {stage >= 2 && (
          <div style={{ opacity: asym2Opacity, width: '100%' }}>
            <div className={styles.asymCard}>
              <span>02</span>
              <strong>ASIMETRÍA DE VACÍO</strong>
              <p>EL VACÍO INFORMATIVO INSTITUCIONAL NO ES NEUTRO – ES OCUPADO POR ATRIBUCIONES CAUSALES PREMATURAS</p>
            </div>
            <div className={styles.asymCard}>
              <span>03</span>
              <strong>ASIMETRÍA ALGORÍTMICA</strong>
              <p>LOS MENSAJES DE INDIGNACIÓN POLÍTICA TIENEN MAYOR CAPACIDAD DE DIFUSIÓN QUE LA DIVULGACIÓN TÉCNICA</p>
            </div>
          </div>
        )}

        {stage >= 3 && (
          <div style={{ opacity: conclusionOpacity, width: '100%' }}>
            <div className={styles.finalConclusion}>
              ⚠️ LA COMPRENSIÓN PÚBLICA QUEDA CONDICIONADA POR LOS MARCOS INTERPRETATIVOS PREVIOS
              DE CADA AGENTE COMUNICATIVO, CON INDEPENDENCIA DE LA EVIDENCIA TÉCNICA DISPONIBLE
            </div>
            <div className={styles.lesson}>
              LECCIÓN OPERATIVA: LOS PROTOCOLOS DE COMUNICACIÓN DE CRISIS DE LOS OPERADORES
              DE SISTEMAS CRÍTICOS DEBEN INCORPORAR ESTA REALIDAD ESTRUCTURAL
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ELABORACIÓN PROPIA A PARTIR DEL ANÁLISIS COMUNICATIVO DEL APAGÓN</div>
    </div>
  );
}