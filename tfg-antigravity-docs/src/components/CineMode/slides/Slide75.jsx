// slides/Slide75.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide75.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide75({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.3) setStage(1);
  }, [slideProgress]);

  const conclusionOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="LECCIÓN FINAL" color="#10b981" />
        <DigitalClock fixedTime="CONCLUSIONES" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>SÍNTESIS: LECCIÓN ESTRUCTURAL Y FUTURO</h1>
        <h2 className={styles.subtitle}>EL AGOTAMIENTO DEL PARADIGMA CENTRALIZADO</h2>

        <div style={{ opacity: conclusionOpacity, width: '100%' }}>
          <div className={styles.quoteBox}>
            EL 28-A NO FUE UN CISNE NEGRO IMPREVISIBLE, SINO LA MANIFESTACIÓN TERMINAL DE UNA INCOMPATIBILIDAD DE FONDO ENTRE LA FÍSICA DE UN SISTEMA DOMINADO POR INVERSORES Y UN MARCO TÉCNICO-REGULATORIO DISEÑADO PARA REDES SÍNCRONAS
          </div>

          <div className={styles.lessons}>
            <div className={styles.lesson}>
              <strong>01 · FRACTURA OPERATIVA</strong><br/>
              LA ARQUITECTURA DE MONITORIZACIÓN (SCADA 400 KV) ES INSUFICIENTE PARA CAPTURAR LA DINÁMICA ULTRARRÁPIDA DE REDES DE 220 KV Y 132 KV
            </div>
            <div className={styles.lesson}>
              <strong>02 · FRACTURA REGULATORIA</strong><br/>
              LA PROPUESTA DE ACTUALIZACIÓN DEL P.O. 7.4 LLEVABA AÑOS EN PROCESO DE APROBACIÓN – EL APAGÓN ES EL COSTE MEDIBLE DE UNA DEMORA REGULATORIA
            </div>
            <div className={styles.lesson}>
              <strong>03 · FRACTURA SISTÉMICA</strong><br/>
              LOS ANÁLISIS DE SEGURIDAD BASADOS EN FLUJOS DE CARGA ESTÁTICOS Y CRITERIO N-1 SON ESTRUCTURALMENTE INSUFICIENTES PARA REDES CON ALTA PENETRACIÓN DE IBR
            </div>
            <div className={styles.lesson}>
              <strong>04 · FRACTURA ECONÓMICA</strong><br/>
              EL MODELO MARGINALISTA PURO DE ENERGÍA NO REMUNERA LOS ATRIBUTOS DE FIRMEZA – LOS ERS DEBEN SER DEFINIDOS, VERIFICADOS Y RETRIBUIDOS EXPLÍCITAMENTE
            </div>
          </div>

          <div className={styles.finalMessage}>
            LA TRANSICIÓN ENERGÉTICA REQUIERE UNA ARQUITECTURA DE CONTROL DISTRIBUIDO Y EN TIEMPO REAL – EL 28-A ES EL PUNTO DE PARTIDA OBLIGATORIO PARA LA RED EUROPEA DEL SIGLO XXI
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: SÍNTESIS DE INFORMES – ELABORACIÓN PROPIA</div>
    </div>
  );
}