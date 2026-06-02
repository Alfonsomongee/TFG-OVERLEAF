// slides/Slide96.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide96.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide96({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="REPOSICIÓN" color="#10b981" />
        <DigitalClock fixedTime="12:33:27 – 07:00 29-A" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>LA REPOSICIÓN: 18 HORAS DESDE EL CERO</h1>
        <h2 className={styles.subtitle}>LA OPERACIÓN DE BLACK-START MÁS COMPLEJA EN EUROPA</h2>

        <div style={{ opacity, width: '100%' }}>
          <div className={styles.timelineRepos}>
            <div className={styles.eventRepos}><span>12:43–12:44</span> PRIMERA ARTERIA DESDE FRANCIA – HERNANI, 31 MW</div>
            <div className={styles.eventRepos}><span>12:45</span> CASTELO DO BODE (PORTUGAL) – ARRANQUE AUTÓNOMO, PRIMERA ISLA ELÉCTRICA</div>
            <div className={styles.eventRepos}><span>13:35</span> SEGUNDA ARTERIA DESDE FRANCIA – BAIXÀS–VIC, LITORAL MEDITERRÁNEO</div>
            <div className={styles.eventRepos}><span>18:36</span> SINCRONIZACIÓN ALDEADÁVILA–POCINHO – ESPAÑA–PORTUGAL CONECTADOS</div>
            <div className={styles.eventRepos}><span>23:00</span> 51% DE DEMANDA RECUPERADA (12.847 MW) – 70% SUBESTACIONES ENERGIZADAS</div>
            <div className={styles.eventRepos}><span>00:22 (29-A)</span> RED DE TRANSPORTE PORTUGUESA 100% RESTAURADA</div>
            <div className={styles.eventRepos}><span>04:00 (29-A)</span> RED DE TRANSPORTE ESPAÑOLA 100% RESTAURADA</div>
            <div className={styles.eventRepos}><span>07:00 (29-A)</span> 99,95% DE DEMANDA RECUPERADA – FIN OPERATIVO DEL INCIDENTE</div>
          </div>
          <div className={styles.insightBox}>
            <strong>PLANTAS CLAVE DE BLACK-START:</strong> CASTELO DO BODE (PORTUGAL, 138 MW, ARRANQUE EN 10 MIN) · ALDEADÁVILA (ESPAÑA, ~1.100 MW, ESQUEMA BS-DUERO)
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REE · REN · ENTSO-E · COMITÉ DE ANÁLISIS DEL GOBIERNO</div>
    </div>
  );
}