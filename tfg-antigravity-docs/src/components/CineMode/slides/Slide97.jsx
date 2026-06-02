// slides/Slide97.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide97.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide97({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="CONCLUSIÓN" color="#3b82f6" />
        <DigitalClock fixedTime="LECCIÓN FINAL" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>DE CIFRAS A ESTRUCTURA</h1>
        <h2 className={styles.subtitle}>LA LECCIÓN GRABADA EN 27 SEGUNDOS DE CASCADA</h2>

        <div style={{ opacity, width: '100%' }}>
          <div className={styles.quoteBox}>
            <p>EL APAGÓN DEL 28 DE ABRIL DE 2025 FUE INEVITABLE DADOS LOS PARÁMETROS DE ESE DÍA.</p>
            <p>PERO FUE EVITABLE CON POLÍTICAS DE LARGO PLAZO.</p>
          </div>
          <div className={styles.lessons}>
            <div>⚠️ MAYOR INERCIA SÍNCRONA (SISTEMAS DE ALMACENAMIENTO Y COMPENSADORES SÍNCRONOS)</div>
            <div>⚠️ MEJOR INTERCONEXIÓN CON EUROPA (OBJETIVO UE 15% VS 7,9% ACTUAL)</div>
            <div>⚠️ CONTROL DINÁMICO OBLIGATORIO EN RENOVABLES (GRID-FORMING VS GRID-FOLLOWING)</div>
            <div>⚠️ VELOCIDAD DE TRANSICIÓN ENERGÉTICA QUE RESPETE LOS LÍMITES DE INERCIA Y ESTABILIDAD DE LA RED</div>
          </div>
          <div className={styles.finalMessage}>
            EL 28 DE ABRIL DE 2025 FUE EL DÍA EN QUE LA INGENIERÍA ELÉCTRICA CONTINENTAL
            TUVO QUE ADMITIR QUE EL SIGLO XX HABÍA TERMINADO Y EL FUTURO REQUERÍA
            NUEVAS LEYES, NO SOLO NUEVAS MÁQUINAS.
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: SÍNTESIS DE TODOS LOS INFORMES – ELABORACIÓN PROPIA</div>
    </div>
  );
}