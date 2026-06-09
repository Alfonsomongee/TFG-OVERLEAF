// %% AGENT_INSTRUCTION: Insertar en "Conclusiones" → "Del N−1 estático al estado dinámico de red", sustituyendo la tabla markdown de modelo antiguo vs métrica propuesta.
// %% LEGEND_PROPOSAL: "Transición del modelo clásico de seguridad (izquierda) a las nuevas métricas dinámicas (derecha) exigidas por la red con alta penetración de electrónica de potencia. Cada fila conecta una variable insuficiente el 28‑A con su reemplazo dinámico."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './DynamicSecurityShift.module.css';

const SHIFT_DATA = [
  {
    old: 'N−1 estático y rangos nominales',
    limitation: 'El sistema parecía dentro de límites, pero perdió margen dinámico.',
    new: 'Dynamic Security Assessment (DSA) online',
    metric: 'Estabilidad de tensión, oscilaciones y margen dinámico',
    confidence: 'Alta',
  },
  {
    old: 'Inercia agregada peninsular (H media)',
    limitation: 'La media 2,3 s no describe la fragilidad regional.',
    new: 'Inercia zonal (H sur = 1,3 s)',
    metric: 'Inercia por zonas de control',
    confidence: 'Alta',
  },
  {
    old: 'SCR simple (fortaleza de red)',
    limitation: 'SCR no basta con múltiples IBR cercanos.',
    new: 'SCR + MRSCR (Multi-Infeed SCR)',
    metric: 'Fortaleza nodal con acoplamiento mutuo',
    confidence: 'Media‑alta',
  },
  {
    old: 'SCADA convencional',
    limitation: 'Alertas basadas en magnitudes absolutas no detectaron inestabilidad.',
    new: 'PMU / WAMS + dV/dt',
    metric: 'Monitorización de derivada de tensión, amortiguamiento y margen Q‑V',
    confidence: 'Alta',
  },
  {
    old: 'Defensa orientada solo a frecuencia',
    limitation: 'El deslastre subfrecuencia no evitó el colapso.',
    new: 'Planes de defensa frente a sobretensión',
    metric: 'Protección coordinada contra cascadas de tensión',
    confidence: 'Alta',
  },
  {
    old: 'Observación limitada a red de transporte',
    limitation: 'Falta de visibilidad sobre tomas OLTC y deslastres en distribución.',
    new: 'Telemedida frontera T‑D + PMU',
    metric: 'Modelado OLTC, evacuación 220 kV y protecciones secundarias',
    confidence: 'Media‑alta',
  },
];

export default function DynamicSecurityShift() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selectedIdx, setSelectedIdx] = useState(null);

  const toggle = (i) => setSelectedIdx((prev) => (prev === i ? null : i));
  const selected = selectedIdx !== null ? SHIFT_DATA[selectedIdx] : null;

  const oldAccent = isDark ? '#8a99ab' : '#6a7a8a';
  const newAccent = isDark ? '#6aad52' : '#4a7c3a';

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Evolución de la seguridad</span>
        <h3 className={styles.title}>Del N−1 estático al estado dinámico de red</h3>
        <p className={styles.subtitle}>
          Cada fila muestra la variable del modelo clásico que falló el 28‑A y la
          métrica dinámica que debe reemplazarla.
        </p>
      </header>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: oldAccent }} aria-hidden="true" />
          Modelo clásico (insuficiente)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ backgroundColor: newAccent }} aria-hidden="true" />
          Nueva métrica dinámica
        </span>
      </div>

      {/* Column headers */}
      <div className={styles.colHeaders} aria-hidden="true">
        <span className={styles.colOld}>Modelo clásico</span>
        <span className={styles.colArrow} />
        <span className={styles.colNew}>Métrica dinámica</span>
      </div>

      <div className={styles.rows} role="list">
        {SHIFT_DATA.map((item, i) => {
          const isSelected = i === selectedIdx;
          return (
            <button
              key={i}
              type="button"
              className={`${styles.row} ${isSelected ? styles.rowActive : ''}`}
              onClick={() => toggle(i)}
              aria-expanded={isSelected}
              aria-label={`${item.old} → ${item.new}`}
              role="listitem"
            >
              <span className={styles.cellOld}>
                <span className={styles.cellAccent} style={{ backgroundColor: oldAccent }} aria-hidden="true" />
                {item.old}
              </span>

              <span className={styles.arrow} aria-hidden="true">→</span>

              <span className={styles.cellNew}>
                <span className={styles.cellAccent} style={{ backgroundColor: newAccent }} aria-hidden="true" />
                {item.new}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className={styles.detail} role="region" aria-label={`Detalle: ${selected.old} → ${selected.new}`}>
          <h4 className={styles.detailTitle}>
            {selected.old} → {selected.new}
          </h4>
          <div className={styles.detailGrid}>
            <span className={styles.detailLabel}>Limitación 28‑A</span>
            <span>{selected.limitation}</span>
            <span className={styles.detailLabel}>Métrica propuesta</span>
            <span>{selected.metric}</span>
            <span className={styles.detailLabel}>Confianza</span>
            <span>{selected.confidence}</span>
          </div>
        </div>
      )}
    </div>
  );
}
