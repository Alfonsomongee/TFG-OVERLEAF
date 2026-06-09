import React from 'react';
import styles from './TorraoSynchronousCompensatorFigure.module.css';

export default function TorraoSynchronousCompensatorFigure({ showCaption = false }) {
  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <div className={styles.kicker}>Portugal · reposición</div>
        <h3 className={styles.title}>Torrão como compensador síncrono</h3>
        <p className={styles.subtitle}>
          Comparación funcional entre el modo de generación normal y el modo de compensación síncrona durante la reposición del sistema.
        </p>
      </header>

      <section className={styles.svgContainer}>
        <svg viewBox="0 0 880 520" className={styles.svg} role="img" aria-labelledby="torrao-sync-title torrao-sync-desc">
          <title id="torrao-sync-title">Modos de Operación del Grupo de Torrão</title>
          <desc id="torrao-sync-desc">Esquema funcional que compara el modo de generación normal (agua y potencia activa) con el modo compensador síncrono (aire comprimido y soporte de potencia reactiva).</desc>

          {/* PANEL IZQUIERDO: MODO GENERACIÓN NORMAL */}
          <g transform="translate(0, 0)">
            <rect x="10" y="40" width="420" height="460" rx="16" className={styles.panelGen} />
            <text x="220" y="25" textAnchor="middle" className={styles.textTitle}>Modo generación normal</text>

            {/* Red Eléctrica */}
            <line x1="100" y1="70" x2="340" y2="70" className={styles.gridLine} />
            <text x="220" y="60" textAnchor="middle" className={styles.textPrimary}>Red</text>
            
            {/* Conexión */}
            <line x1="220" y1="70" x2="220" y2="130" className={styles.gridLine} />
            
            {/* P activa Saliente */}
            <g transform="translate(160, 100)">
              <line x1="0" y1="15" x2="0" y2="-15" className={styles.strokeP} />
              <polygon points="-6,-12 6,-12 0,-22" className={styles.fillP} />
              <text x="-12" y="5" textAnchor="end" className={styles.textP}>P activa a red</text>
            </g>

            {/* Cámara Hidráulica */}
            <rect x="110" y="300" width="220" height="140" rx="12" className={styles.waterArea} />
            <text x="290" y="415" className={styles.textSecondary}>Agua</text>

            {/* Eje de rotación */}
            <rect x="210" y="130" width="20" height="200" className={styles.machineShaft} />

            {/* Alternador (Estator y Rotor) */}
            <rect x="150" y="130" width="140" height="80" rx="4" className={styles.machineStator} />
            <rect x="170" y="140" width="100" height="60" rx="2" className={styles.machineRotor} />
            <text x="220" y="175" textAnchor="middle" className={styles.textMachine}>Alternador</text>

            {/* Rodete / Turbina */}
            <polygon points="170,330 270,330 250,380 190,380" className={styles.machineRotor} />
            <text x="220" y="360" textAnchor="middle" className={styles.textMachine}>Turbina</text>

            {/* Flujos de agua */}
            <line x1="50" y1="365" x2="95" y2="365" className={styles.waterArrow} />
            <polygon points="90,360 100,365 90,370" className={styles.waterArrowFill} />
            
            {/* Flecha inferior movida para evitar solapamiento */}
            <line x1="220" y1="430" x2="220" y2="460" className={styles.waterArrow} />
            <polygon points="215,455 220,465 225,455" className={styles.waterArrowFill} />

            <text x="220" y="490" textAnchor="middle" className={styles.textNote}>Genera P activa a partir de energía hidráulica</text>
          </g>


          {/* PANEL DERECHO: MODO COMPENSADOR SÍNCRONO */}
          <g transform="translate(440, 0)">
            <rect x="10" y="40" width="420" height="460" rx="16" className={styles.panelSync} />
            <text x="220" y="25" textAnchor="middle" className={styles.textTitle}>Modo compensador síncrono</text>

            {/* Red Eléctrica */}
            <line x1="100" y1="70" x2="340" y2="70" className={styles.gridLine} />
            <text x="220" y="60" textAnchor="middle" className={styles.textPrimary}>Red</text>
            
            {/* Conexión */}
            <line x1="220" y1="70" x2="220" y2="130" className={styles.gridLine} />

            {/* P mínima Entrante */}
            <g transform="translate(160, 100)">
              <line x1="0" y1="-15" x2="0" y2="15" className={styles.strokeP} />
              <polygon points="-6,12 6,12 0,22" className={styles.fillP} />
              <text x="-12" y="5" textAnchor="end" className={styles.textP}>P mínima desde red</text>
            </g>

            {/* Bloque Destacado: Q Reactiva */}
            <g transform="translate(250, 75)">
              <rect x="0" y="0" width="165" height="55" rx="6" className={styles.qHighlightBox} />
              <line x1="15" y1="5" x2="15" y2="45" className={styles.strokeQ} />
              <polygon points="9,10 21,10 15,0" className={styles.fillQ} />
              <polygon points="9,40 21,40 15,50" className={styles.fillQ} />
              <text x="28" y="22" textAnchor="start" className={styles.textQ}>Q reactiva regulable</text>
              <text x="28" y="40" textAnchor="start" className={styles.textQSmall}>Soporte de tensión</text>
            </g>

            {/* Cámara con Aire Comprimido y Agua residual */}
            <g transform="translate(110, 300)">
              <rect x="0" y="0" width="220" height="140" rx="12" className={styles.airArea} />
              <path d="M0,110 L220,110 L220,128 A12,12 0 0,1 208,140 L12,140 A12,12 0 0,1 0,128 Z" className={styles.waterArea} />
            </g>
            
            <text x="290" y="355" className={styles.textSecondary} textAnchor="middle">Aire</text>
            <text x="290" y="370" className={styles.textSecondary} textAnchor="middle">comprimido</text>
            <text x="280" y="425" className={styles.textResidual} textAnchor="middle">Agua residual</text>

            {/* Eje de rotación */}
            <rect x="210" y="130" width="20" height="200" className={styles.machineShaft} />

            {/* Alternador Síncrono */}
            <rect x="150" y="130" width="140" height="80" rx="4" className={styles.machineStator} />
            <rect x="170" y="140" width="100" height="60" rx="2" className={styles.machineRotor} />
            <text x="220" y="165" textAnchor="middle" className={styles.textMachine}>Alternador</text>
            <text x="220" y="182" textAnchor="middle" className={styles.textMachineSub}>síncrono</text>

            {/* Rodete en vacío */}
            <polygon points="170,330 270,330 250,380 190,380" className={styles.machineRotor} />
            <text x="220" y="350" textAnchor="middle" className={styles.textMachine}>Rodete</text>
            <text x="220" y="365" textAnchor="middle" className={styles.textMachineSub}>en vacío</text>

            {/* Flecha de giro en vacío */}
            <path d="M 180,365 A 40,12 0 1,1 255,365" className={styles.spinArrow} />
            <polygon points="250,360 260,365 250,370" className={styles.spinArrowFill} />

            <text x="220" y="490" textAnchor="middle" className={styles.textNote}>Aporta soporte de tensión mediante Q reactiva</text>
          </g>
        </svg>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <strong className={styles.cardTitle}>Principio hidráulico</strong>
          <p className={styles.cardText}>En generación normal, el flujo de agua impulsa la turbina y exporta P activa a la red.</p>
        </div>
        <div className={styles.card}>
          <strong className={styles.cardTitle}>Cambio funcional</strong>
          <p className={styles.cardText}>Como compensador, deja de producir potencia activa neta y consume P mínima para cubrir pérdidas mecánicas y eléctricas.</p>
        </div>
        <div className={styles.card}>
          <strong className={styles.cardTitle}>Valor en reposición</strong>
          <p className={styles.cardText}>Aporta regulación de tensión mediante Q reactiva, estabilizando la isla eléctrica.</p>
        </div>
      </section>

      {showCaption && (
        <figcaption className={styles.figcaption}>
          Comparación funcional entre el modo de generación y el modo de compensación síncrona del grupo de Torrão.
        </figcaption>
      )}
    </figure>
  );
}
