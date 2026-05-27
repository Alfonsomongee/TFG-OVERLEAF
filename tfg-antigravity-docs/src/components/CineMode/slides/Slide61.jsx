// slides/Slide61.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide61.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide61({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const vacuumOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const infodemiaOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const consequenceOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CRISIS COMUNICATIVA" color="#b91c1c" />
        <DigitalClock fixedTime="12:33 – 18:00" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>IMPACTO COMUNICATIVO DEL APAGÓN</h1>
        <h2 className={styles.subtitle}>UNA SEGUNDA CRISIS PARALELA A LA ELÉCTRICA</h2>

        {/* VACÍO INFORMATIVO */}
        <div style={{ opacity: vacuumOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>FALLO COMUNICATIVO INSTITUCIONAL</h3>
          <div className={styles.timelineHighlight}>
            <div><span>12:33 CEST</span> CERO DE TENSIÓN</div>
            <div><span>18:00 CEST</span> PRIMERA COMPARECENCIA DEL PRESIDENTE</div>
            <div className={styles.gap}>⏱️ INTERVALO DE 5 HORAS SIN COMUNICACIÓN OFICIAL</div>
          </div>
          <div className={styles.warningNote}>
            EL VACÍO FUE OCUPADO POR HIPÓTESIS NO VERIFICADAS
          </div>
        </div>

        {/* INFODEMIA */}
        {stage >= 2 && (
          <div style={{ opacity: infodemiaOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>INFODEMIA DURANTE LA VENTANA CRÍTICA</h3>
            <div className={styles.mythList}>
              <div>❌ SABOTAJE</div>
              <div>❌ CIBERATAQUE RUSO ("OPERACIÓN MATRIOSKA")</div>
              <div>❌ FENÓMENOS ATMOSFÉRICOS ANÓMALOS</div>
              <div>❌ EXPERIMENTOS GUBERNAMENTALES</div>
            </div>
            <div className={styles.complexityNote}>
              UN COLAPSO POR SOBRETENSIÓN REQUIERE CONOCIMIENTOS DE ESTABILIDAD DE TENSIÓN,
              COMPORTAMIENTO DE IBR Y DINÁMICA DE OLTC → INVERSAMENTE PROPORCIONAL EN ACCESIBILIDAD
            </div>
          </div>
        )}

        {/* CONSECUENCIA */}
        {stage >= 3 && (
          <div style={{ opacity: consequenceOpacity, width: '100%' }}>
            <div className={styles.conclusionBox}>
              ⚠️ EL DEBATE POLÍTICO SOBRE LA TRANSICIÓN ENERGÉTICA SE PRODUJO
              ANTES QUE EL DIAGNÓSTICO TÉCNICO VERIFICADO
            </div>
            <div className={styles.distanceNote}>
              DISTANCIA ENTRE CONSENSO TÉCNICO Y NARRATIVA MEDIÁTICA DOMINANTE
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ELABORACIÓN PROPIA A PARTIR DE INFORMES TÉCNICOS Y COBERTURA MEDIÁTICA</div>
    </div>
  );
}