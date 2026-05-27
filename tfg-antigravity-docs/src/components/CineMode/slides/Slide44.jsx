// slides/Slide44.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/Slide44.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide44({ slideProgress }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (slideProgress >= 0.2) setStage(1);
    if (slideProgress >= 0.5) setStage(2);
    if (slideProgress >= 0.8) setStage(3);
  }, [slideProgress]);

  const timelineOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const demandOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const conclusionOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ESTABILIZACIÓN FINAL" color="#10b981" />
        <DigitalClock fixedTime="13:07 – 07:05 (29-A)" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>EVOLUCIÓN DEL MIX Y ESTABILIZACIÓN FINAL</h1>
        <h2 className={styles.subtitle}>RECONEXIÓN ESCALONADA DE CARGA Y GENERACIÓN</h2>

        {/* HITOS TEMPORALES */}
        <div style={{ opacity: timelineOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>HITOS DE LA RECUPERACIÓN</h3>
          <div className={styles.timelineHitos}>
            <div><span>13:07</span> PRIMEROS 31 MW DESDE IRÚN</div>
            <div><span>23:32</span> 21 GRUPOS TÉRMICOS – 13.039 MW (~55% CARGA)</div>
            <div><span>00:06 (29-A)</span> REACTIVACIÓN DEL CONTROLADOR AFRR</div>
            <div><span>01:38</span> REINTEGRO DE PARQUES EÓLICOS Y COGENERACIÓN</div>
            <div><span>07:05</span> LIBERACIÓN TOTAL DEL RÉGIMEN RCR – 99,95% SUMINISTRO RESTITUIDO</div>
          </div>
        </div>

        {/* GRÁFICO DE RECUPERACIÓN DE DEMANDA */}
        {stage >= 2 && (
          <div style={{ opacity: demandOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>RECUPERACIÓN DE LA DEMANDA PENINSULAR</h3>
            <svg viewBox="0 0 600 200" className={styles.demandSvg}>
              <polyline points="50,160 150,150 250,120 350,70 450,40 550,35" fill="none" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="50" cy="160" r="4" fill="#b91c1c" />
              <text x="50" y="180" textAnchor="middle" fill="#cbd5e1" fontSize="10">0 MW</text>
              <circle cx="550" cy="35" r="4" fill="#10b981" />
              <text x="550" y="20" textAnchor="middle" fill="#cbd5e1" fontSize="10">~25.000 MW</text>
              <text x="300" y="120" textAnchor="middle" fill="#8892b0" fontSize="12">19 HORAS DE RECUPERACIÓN</text>
              <text x="300" y="140" textAnchor="middle" fill="#cbd5e1" fontSize="10">RECONEXIÓN ESCALONADA – EVITAR NUEVAS CAÍDAS DE FRECUENCIA</text>
            </svg>
          </div>
        )}

        {/* CONCLUSIÓN TÉCNICA */}
        {stage >= 3 && (
          <div style={{ opacity: conclusionOpacity, width: '100%' }}>
            <div className={styles.conclusionBox}>
              <p>⚠️ LA GENERACIÓN SÍNCRONA DEMOSTRÓ SER EL ÚNICO SUSTENTO ELECTROMECÁNICO CAPAZ DE SOSTENER LA RECUPERACIÓN</p>
              <p className={styles.smallConclusion}>LOS IBR EN MODO GRID-FOLLOWING NO PUEDEN REPLICAR ESTAS PROPIEDADES FÍSICAS FUNDAMENTALES</p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: REE / ENTSO-E – COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}