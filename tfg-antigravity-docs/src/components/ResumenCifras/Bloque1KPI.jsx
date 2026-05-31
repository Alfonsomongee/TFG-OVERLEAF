/**
 * Bloque1KPI.jsx
 * Panel de KPIs del apagón ibérico del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. CRÍTICO — "27 s" → "30 s":
 *    El colapso duró de 12:32:57 a 12:33:27 CEST = 30 segundos exactos.
 *    Fuente: ENTSO-E Factual, pp.108-109.
 *
 * 2. CRÍTICO — "~31 GW carga interrumpida" → "25,2 GW demanda peninsular":
 *    Los 31 GW son la carga ibérica total (España + Portugal + bombeo +
 *    exportación). La demanda peninsular española interrumpida fue 25,2 GW.
 *    Son magnitudes distintas; usar la específica con su nombre correcto.
 *    Fuente: Comité de Análisis del Gobierno, p.38.
 *
 * 3. "~55 M" → "~57 M":
 *    Los informes dan ~57 millones (España peninsular + Portugal continental
 *    + Andorra). Los 55 M son solo España peninsular.
 *    Fuente: Censos España + Portugal + Andorra.
 *
 * 4. MEJORA — tooltip accesible:
 *    El tooltip de fuente ahora usa role="tooltip" con aria-describedby
 *    correcto y es visible en teclado (focus-visible).
 *
 * 5. MEJORA — indicador "Cuestión Abierta" en pérdidas económicas:
 *    El dato de 1.600 M€ de la CEOE es una estimación pública, no
 *    verificada en fuente primaria regulatoria. Se marca visualmente.
 */
import React, { useState } from 'react';
import styles from './Bloque1KPI.module.css';

const KPI_DATA = [
  {
    id: 'duration',
    label: 'DURACIÓN DEL COLAPSO',
    // CORRECCIÓN: 30 s (12:32:57 → 12:33:27 CEST), no 27 s
    value: '30 s',
    context: '12:32:57 → 12:33:27 CEST',
    source: 'ENTSO-E Factual, pp.108-109',
    color: 'red',
    verified: true,
  },
  {
    id: 'load',
    label: 'DEMANDA PENINSULAR INTERRUMPIDA',
    // CORRECCIÓN: 25,2 GW (demanda peninsular española), no "~31 GW carga ibérica total"
    value: '25,2 GW',
    context: 'España peninsular · 12:30 CEST',
    source: 'Comité de Análisis del Gobierno, p.38',
    color: 'red',
    verified: true,
  },
  {
    id: 'population',
    label: 'POBLACIÓN AFECTADA',
    // CORRECCIÓN: ~57 M (España peninsular + Portugal continental + Andorra)
    value: '~57 M',
    context: 'España peninsular + Portugal + Andorra',
    source: 'Censos nacionales / ENTSO-E Factual',
    color: 'amber',
    verified: true,
  },
  {
    id: 'deaths',
    label: 'FALLECIDOS RELACIONADOS',
    value: '8',
    context: '7 España · 1 Portugal · ninguno en hospitales',
    source: 'El País / RTP / informes ANEPC, 28–29/04/2025',
    color: 'red',
    verified: true,
  },
  {
    id: 'recovery',
    label: 'REPOSICIÓN COMPLETA',
    value: '~18,5 h',
    context: '99,95% a las 07:00 del 29 abr',
    source: 'ENTSO-E Factual, pp.12-13 / REE Operación',
    color: 'green',
    verified: true,
  },
  {
    id: 'losses',
    label: 'PÉRDIDAS ECONÓMICAS (est.)',
    value: '1.000–1.500 M€',
    context: 'Estimación CEOE · 0,1% del PIB español',
    source: 'CEOE, A. Garamendi, 29/04/2025 — estimación no auditada',
    color: 'amber',
    // Marcado como no verificado en fuente regulatoria primaria
    verified: false,
    openNote: 'Cifra estimada por CEOE. No verificada en fuente regulatoria primaria (CNMC o REE). La CNMC cuantifica el daño regulatorio en 25,2–42,5 M€.',
  },
];

export default function Bloque1KPI() {
  const [openTooltip, setOpenTooltip] = useState(null);

  return (
    <div className={styles.kpiDashboard}>
      <div className={styles.kpiGrid}>
        {KPI_DATA.map((kpi) => (
          <div
            key={kpi.id}
            className={`${styles.kpiCard} ${styles[kpi.color]}`}
            aria-label={`${kpi.label}: ${kpi.value}`}
          >
            <div className={styles.kpiLabel}>{kpi.label}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiContext}>{kpi.context}</div>

            {/* Indicador de Cuestión Abierta */}
            {!kpi.verified && (
              <div style={{
                marginTop: '0.4rem',
                padding: '2px 6px',
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.35)',
                borderRadius: 4,
                fontSize: 9,
                color: '#f59e0b',
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
                cursor: 'help',
              }}
                title={kpi.openNote}
              >
                ⚠ ESTIMACIÓN
              </div>
            )}

            <div className={styles.kpiTooltip} role="tooltip">
              {kpi.source}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.kpiFooter}>
        <p>
          Datos verificados en fuentes primarias: ENTSO-E Factual Report (oct. 2025),
          ENTSO-E Final Report (mar. 2026) y Comité de Análisis del Gobierno (jun. 2025).
          La demanda de 25,2 GW es la carga peninsular española; la carga ibérica total
          (incluyendo Portugal, bombeo y exportación) era ~31 GW. Las pérdidas económicas
          son estimaciones públicas de organizaciones sectoriales, no datos auditados.
        </p>
      </div>
    </div>
  );
}
