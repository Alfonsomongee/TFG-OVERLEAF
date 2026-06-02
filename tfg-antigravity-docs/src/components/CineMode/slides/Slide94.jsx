// slides/Slide94.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide94.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide94({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const opacity = Math.min(1, Math.max(0, (slideProgress - 0.3) / 0.5));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="FRECUENCIA" color="#3b82f6" />
        <DigitalClock fixedTime="VENTANA DE INESTABILIDAD" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>LA CAÍDA DE FRECUENCIA</h1>
        <h2 className={styles.subtitle}>VENTANA DE INESTABILIDAD – 27 SEGUNDOS</h2>

        <div style={{ opacity, width: '100%' }}>
          <svg viewBox="0 0 800 300" className={styles.freqSvg}>
            <rect x="0" y="0" width="800" height="300" fill="transparent" />
            {/* Ejes */}
            <line x1="60" y1="260" x2="760" y2="260" stroke="#5a6e8a" strokeWidth="1.5" />
            <line x1="60" y1="30" x2="60" y2="260" stroke="#5a6e8a" strokeWidth="1.5" />
            {/* Línea de frecuencia (simulación de caída) */}
            <polyline points="60,60 180,60 200,62 220,65 250,80 280,110 310,150 340,190 370,215 400,230 430,238 460,242 490,244 520,245 550,245 580,245" fill="none" stroke="#b91c1c" strokeWidth="3" />
            {/* Umbrales */}
            <line x1="60" y1="85" x2="760" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6" />
            <text x="620" y="90" fill="#f59e0b" fontSize="11" fontFamily="Fira Code">49,5 HZ – UMBRAL UFLS BOMBEO</text>
            <line x1="60" y1="110" x2="760" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6" />
            <text x="620" y="115" fill="#f59e0b" fontSize="11">49,0 HZ – UFLS CARGA INDUSTRIAL</text>
            <line x1="60" y1="160" x2="760" y2="160" stroke="#b91c1c" strokeWidth="2" strokeDasharray="6" />
            <text x="620" y="155" fill="#b91c1c" fontSize="12">48,46 HZ – TRIP AC FRANCIA</text>
            <line x1="60" y1="215" x2="760" y2="215" stroke="#b91c1c" strokeWidth="2" />
            <text x="620" y="210" fill="#b91c1c" fontSize="14" fontFamily="Fira Code" fontWeight="bold">47,79 HZ – NADIR (MÍNIMO)</text>
            {/* Etiquetas X */}
            <text x="60" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">0 S</text>
            <text x="200" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">5 S</text>
            <text x="340" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">10 S</text>
            <text x="480" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">15 S</text>
            <text x="620" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">20 S</text>
            <text x="760" y="280" fill="#cbd5e1" fontSize="10" textAnchor="middle">27 S</text>
            <text x="50" y="55" fill="#cbd5e1" fontSize="10" textAnchor="middle">50 HZ</text>
          </svg>
          <div className={styles.noteBox}>
            <div>📉 ROCOF MÁXIMO: <strong>1,0 – 1,2 HZ/S</strong> EN VENTANAS DE 100 MS (SUPERA LOS MÁRGENES DINÁMICOS DE LOS INVERSORES GFL)</div>
            <div>⚠️ LA VELOCIDAD DE CAÍDA FUE SUPERIOR A LA CAPACIDAD DE RESPUESTA DE LOS SISTEMAS DE PROTECCIÓN Y CONTROL</div>
          </div>
        </div>
      </div>
      <div className={styles.footer}>FUENTE: REGISTROS SCADA Y PMU – ENTSO-E OPEN DATA</div>
    </div>
  );
}