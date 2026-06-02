// slides/Slide77.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide77.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide77({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const aegsOpacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="INDUSTRIA ELECTROINTENSIVA" color="#b91c1c" />
        <DigitalClock fixedTime="DESLASTRE AUTOMÁTICO" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>IMPACTO EN CONSUMIDORES ELECTROINTENSIVOS</h1>
        <h2 className={styles.subtitle}>AEGE · SIDERURGIA · METALURGIA · ELECTRÓLISIS</h2>

        <div style={{ opacity: aegsOpacity, width: '100%' }}>
          <div className={styles.alertBox}>
            ⚠️ PÉRDIDAS FINANCIERAS AUDITADAS SUPERIORES A <strong>25 MILLONES DE EUROS</strong>
          </div>

          <h3 className={styles.sectionTitle}>DESCOMPOSICIÓN DEL DAÑO</h3>
          <div className={styles.damageSplit}>
            <div className={styles.card}>
              <strong>DAÑOS OPERATIVOS DIRECTOS</strong>
              <span>+13 M€</span>
              <p>SOLIDIFICACIÓN DE METALES EN HORNOS DE ARCO · DESTRUCCIÓN DE REVESTIMIENTOS REFRACTARIOS · SUSTITUCIÓN DE EQUIPOS QUEMADOS POR TRANSITORIOS DE TENSIÓN</p>
            </div>
            <div className={styles.card}>
              <strong>LUCRO CESANTE Y COSTES DE OPORTUNIDAD</strong>
              <span>+12 M€</span>
              <p>4-14 HORAS DE PARADA · DÍAS DE REACTIVACIÓN POR INERCIA TERMODINÁMICA · PENALIZACIONES JUST-IN-TIME</p>
            </div>
          </div>

          <div className={styles.conclusionBox}>
            EL RIESGO OPERATIVO DE SUFRIR PARADAS NO PROGRAMADAS SUPERA FINANCIERAMENTE
            CUALQUIER DESCUENTO HORARIO EN EL MWH. LA SEGURIDAD DE SUMINISTRO ES EL
            PILAR INNEGOCIABLE DE LA POLÍTICA INDUSTRIAL.
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: AEGE · CEOE · INFORME DE AUDITORÍA</div>
    </div>
  );
}