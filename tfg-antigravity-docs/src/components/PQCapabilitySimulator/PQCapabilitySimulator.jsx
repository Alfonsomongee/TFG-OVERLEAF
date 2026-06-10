// PQCapabilitySimulator.jsx
import React, { useState } from 'react';
import styles from './PQCapabilitySimulator.module.css';

const PQCapabilitySimulator = () => {
  const [pRatio, setPRatio] = useState(0.72);
  const qRatio = Math.sqrt(1 - pRatio * pRatio);
  const qPercent = (qRatio * 100).toFixed(1);

  let marginLevel;
  if (qRatio >= 0.65) {
    marginLevel = 'wide';
  } else if (qRatio >= 0.35) {
    marginLevel = 'compromised';
  } else {
    marginLevel = 'critical';
  }

  const marginData = {
    wide: { label: 'Margen amplio', className: styles.statusWide },
    compromised: { label: 'Margen comprometido', className: styles.statusCompromised },
    critical: { label: 'Margen crítico', className: styles.statusCritical },
  }[marginLevel];

  const getPericialText = () => {
    const qStr = `${qPercent} % de Sₘₐₓ`;
    if (qRatio >= 0.65) {
      return `Con P ≈ ${(pRatio * 100).toFixed(0)} % de Sₘₐₓ, el margen reactivo disponible Qₘₐₓ ≈ ${qStr}. El inversor conserva capacidad apreciable para participar en control de tensión.`;
    } else if (qRatio >= 0.35) {
      return `Con P ≈ ${(pRatio * 100).toFixed(0)} % de Sₘₐₓ, Qₘₐₓ desciende a ≈ ${qStr}. En redes débiles, la participación en control de tensión comienza a verse limitada.`;
    } else {
      return `Con P ≈ ${(pRatio * 100).toFixed(0)} % de Sₘₐₓ, Qₘₐₓ cae a niveles muy reducidos (≈ ${qStr}). En una red con exceso capacitivo y baja fortaleza, la absorción de reactiva queda operativamente comprometida.`;
    }
  };

  // Coordenadas SVG con viewBox 280x280 y márgenes adecuados
  const originX = 45;
  const originY = 225;
  const radius = 185;
  const px = originX + pRatio * radius;
  const py = originY - qRatio * radius;

  // Zona crítica (umbral Q < 0.35 · Sₘₐₓ)
  const critP = Math.sqrt(1 - 0.35 * 0.35);
  const critX = originX + critP * radius;
  const critY = originY - 0.35 * radius;

  return (
    <div className={styles.figure} role="figure" aria-labelledby="pq-simulator-title">
      <div className={styles.header}>
        <p className={styles.kicker}>Simulador didáctico · Inversores IBR</p>
        <h3 id="pq-simulator-title" className={styles.title}>
          El límite del semiconductor: conflicto P–Q
        </h3>
        <p className={styles.subtitle}>
          A mayor potencia activa, menor margen reactivo disponible para controlar tensión.
        </p>
      </div>

      {/* Gráfico principal – más contenido */}
      <div className={styles.svgContainer}>
        <svg
          viewBox="0 0 280 280"
          role="img"
          aria-label="Diagrama de capacidad P‑Q del inversor"
          className={styles.svg}
        >
          <title>Relación entre potencia activa P y capacidad reactiva Q</title>
          <desc>
            Curva de capacidad aparente constante S = 1, mostrando el compromiso entre P y Q.
            Punto de operación ajustable mediante deslizador.
          </desc>

          {/* Ejes */}
          <line
            x1={originX}
            y1={originY}
            x2={originX + radius + 16}
            y2={originY}
            stroke="var(--pq-text)"
            strokeWidth="1.2"
          />
          <line
            x1={originX}
            y1={originY}
            x2={originX}
            y2={originY - radius - 16}
            stroke="var(--pq-text)"
            strokeWidth="1.2"
          />

          {/* Etiquetas de ejes */}
          <text x={originX + radius + 20} y={originY + 5} fill="var(--pq-text)" fontSize="11">P</text>
          <text x={originX - 12} y={originY - radius - 20} fill="var(--pq-text)" fontSize="11">Q</text>

          {/* Marcas en extremos */}
          <line x1={originX + radius} y1={originY - 3} x2={originX + radius} y2={originY + 3} stroke="var(--pq-text)" />
          <line x1={originX - 3} y1={originY - radius} x2={originX + 3} y2={originY - radius} stroke="var(--pq-text)" />

          {/* Curva de capacidad Sₘₐₓ */}
          <path
            d={`M ${originX} ${originY - radius} A ${radius} ${radius} 0 0 1 ${originX + radius} ${originY}`}
            fill="none"
            stroke="var(--pq-curve)"
            strokeWidth="2.8"
          />

          {/* Etiqueta Sₘₐₓ */}
          <text x={originX + 130} y={originY - 70} fill="var(--pq-text)" fontSize="9" fontStyle="italic" opacity="0.6">
            Sₘₐₓ
          </text>

          {/* Zona crítica (arco discontinuo) */}
          <path
            d={`M ${critX} ${critY} A ${radius} ${radius} 0 0 1 ${originX + radius} ${originY}`}
            fill="none"
            stroke="var(--pq-critical)"
            strokeWidth="2.8"
            strokeDasharray="5 3"
            opacity="0.35"
          />

          {/* Proyección P (horizontal) – cobre */}
          <line x1={originX} y1={originY} x2={px} y2={originY} stroke="var(--pq-p)" strokeWidth="2.8" />
          <text x={originX + (px - originX) / 2 - 8} y={originY + 17} fill="var(--pq-p)" fontSize="9">P</text>

          {/* Proyección Qₘₐₓ (vertical) – verde técnico */}
          <line x1={px} y1={py} x2={px} y2={originY} stroke="var(--pq-q)" strokeWidth="2.8" />
          <text x={px + 7} y={py + (originY - py) / 2} fill="var(--pq-q)" fontSize="9">Qₘₐₓ</text>

          {/* Línea de radio auxiliar */}
          <line x1={originX} y1={originY} x2={px} y2={py} stroke="var(--pq-text)" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

          {/* Punto de operación */}
          <circle cx={px} cy={py} r="5.5" fill="var(--pq-accent)" stroke="var(--pq-text)" strokeWidth="0.7" />
          <text x={px + 9} y={py - 6} fill="var(--pq-text)" fontSize="8" opacity="0.6">op.</text>
        </svg>
      </div>

      {/* Leyenda gráfica – compacta debajo */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: 'var(--pq-curve)' }} />
          <span>Sₘₐₓ · capacidad aparente</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: 'var(--pq-p)' }} />
          <span>P · potencia activa</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: 'var(--pq-q)' }} />
          <span>Qₘₐₓ · margen reactivo</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendSwatch} style={{ background: 'var(--pq-critical)', opacity: 0.7 }} />
          <span>Zona crítica · bajo margen Q</span>
        </div>
      </div>

      {/* Slider */}
      <div className={styles.controls}>
        <label htmlFor="p-slider" className={styles.sliderLabel}>
          Potencia activa fotovoltaica
        </label>
        <div className={styles.sliderRow}>
          <input
            id="p-slider"
            type="range"
            min="0.2"
            max="0.98"
            step="0.01"
            value={pRatio}
            onChange={(e) => setPRatio(parseFloat(e.target.value))}
            className={styles.slider}
          />
          <span className={styles.sliderValue}>
            {(pRatio * 100).toFixed(0)}% S<sub>max</sub>
          </span>
        </div>
      </div>

      {/* Estado operativo + valor Qmax */}
      <div className={styles.status}>
        <span className={`${styles.statusBadge} ${marginData.className}`}>
          {marginData.label}
        </span>
        <span className={styles.qValue}>
          Q<sub>max</sub> = {qPercent} % S<sub>max</sub>
        </span>
      </div>

      {/* Texto pericial dinámico */}
      <p className={styles.pericial}>{getPericialText()}</p>

      {/* Bloque conceptual fijo – más ligero */}
      <div className={styles.conceptual}>
        <p>
          La restricción P–Q no implica por sí sola un fallo individual del inversor:
          expresa una limitación geométrica de operación. En escenarios de alta
          irradiancia y baja fortaleza de red, maximizar <i>P</i> puede reducir la
          capacidad agregada del parque IBR para participar en el control dinámico de
          tensión.
        </p>
      </div>
    </div>
  );
};

export default PQCapabilitySimulator;