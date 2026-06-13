import React, { useState, useMemo } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './CarbonCalculator.module.css';

// ─── Proyección geográfica simplificada (viewBox 1000×800) ───────────────────
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX    = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west)  / (GEO_BOUNDS.east  - GEO_BOUNDS.west))  * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

const IBERIA_OUTLINE = [
  [43.78, -7.86], [43.47, -8.45], [42.88, -9.28], [42.03, -8.87], [41.87, -8.87],
  [41.38, -8.73], [40.64, -8.75], [39.36, -9.40], [38.62, -9.50], [37.01, -8.91],
  [36.97, -7.85], [36.01, -5.61], [36.17, -5.36], [36.69, -4.41], [36.72, -3.48],
  [37.20, -1.90], [37.64, -0.69], [38.68,  0.23], [39.58,  0.34], [40.72,  0.73],
  [41.29,  1.83], [41.42,  2.22], [42.43,  3.16], [42.80,  1.72], [43.37, -1.79],
  [43.49, -3.80], [43.57, -5.66], [43.78, -7.86]
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87], [41.52, -6.92], [39.67, -7.06], [37.43, -7.44], [36.97, -7.85],
  [37.01, -8.91], [38.62, -9.50], [39.36, -9.40], [40.64, -8.75], [41.38, -8.73],
  [41.87, -8.87]
];

function pointsToPath(points) {
  return points
    .map((p, i) => {
      const { x, y } = geoToSvg(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ') + ' Z';
}

const IBERIA_PATH  = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);

// ─── Constantes sectoriales (sector eléctrico español, datos 2025/2026) ──────
const POWER_CCGT_MIN     = 3000;   // MW forzados fuera de mercado
const EMISSION_FACTOR    = 0.356;  // tCO₂/MWh (Factor de emisión CCGT gas natural)
const PRICE_EUA          = 74.95;  // €/tCO₂ (precio medio EUA EUETS Q1 2025)
const DEMAND_AVERAGE     = 25000;  // MWh/h de demanda media del sistema
const RESTRICTION_COST   = 16.75;  // €/MWh (sobrecoste de despacho en restricciones)
const CURTAILED_MW_H     = 320;    // MW curtailment solar promedio diario
const DAILY_SOLAR_HOURS  = 10;     // horas de sol aprovechables por día
const HOURS_PER_MONTH    = 30 * 24;

// Interpolación lineal: verde-bosque → rojo-árido, con un paso intermedio amarillo
function interpolateMapColor(ratio) {
  if (ratio <= 0.5) {
    // Verde → Ámbar
    const t = ratio * 2;
    const r = Math.round(76  + (200 - 76)  * t);
    const g = Math.round(139 + (140 - 139) * t);
    const b = Math.round(107 + (55  - 107) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    // Ámbar → Rojo-árido
    const t = (ratio - 0.5) * 2;
    const r = Math.round(200 + (184 - 200) * t);
    const g = Math.round(140 + (82  - 140) * t);
    const b = Math.round(55  + (45  - 55)  * t);
    return `rgb(${r},${g},${b})`;
  }
}

// Formateador compacto en español con decimales cuando procede
function fmt(n, decimals = 0) {
  return n.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export default function CarbonCalculator() {
  const [months, setMonths] = useState(1);

  // ─── Cómputo memoizado ────────────────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalHours          = months * HOURS_PER_MONTH;
    const emissionsCO2        = POWER_CCGT_MIN * totalHours * EMISSION_FACTOR;      // tCO₂
    const costCO2             = emissionsCO2   * PRICE_EUA;                          // €
    const restrictionCost     = DEMAND_AVERAGE * totalHours * RESTRICTION_COST;      // €
    const curtailedEnergy     = CURTAILED_MW_H * DAILY_SOLAR_HOURS * 30 * months;   // MWh

    // Coste total consolidado
    const totalCost = costCO2 + restrictionCost;

    // Equivalencias psicológicas
    const equivCars            = emissionsCO2 / 4.6;   // 4.6 tCO₂/año por turismo
    const equivForestHectares  = emissionsCO2 / 5;     // 5 tCO₂/año/ha bosque maduro
    const equivHouseholdCons   = curtailedEnergy / 3.3; // 3.3 MWh/año por hogar promedio

    return {
      hours: totalHours,
      emissions: emissionsCO2,
      costCO2,
      restrictionCost,
      curtailedEnergy,
      totalCost,
      equivCars,
      equivForestHectares,
      equivHouseholdCons
    };
  }, [months]);

  // Ratio para color del mapa (0 → 1 al pasar de mes 1 a mes 12)
  const mapColor = useMemo(
    () => interpolateMapColor((months - 1) / 11),
    [months]
  );

  // Ratios para mini-barras (normalizados sobre el valor máximo posible, 12 meses)
  const MAX = useMemo(() => {
    const h = 12 * HOURS_PER_MONTH;
    return {
      emissions:       POWER_CCGT_MIN * h * EMISSION_FACTOR,
      costCO2:         POWER_CCGT_MIN * h * EMISSION_FACTOR * PRICE_EUA,
      restrictionCost: DEMAND_AVERAGE * h * RESTRICTION_COST,
      curtailed:       CURTAILED_MW_H * DAILY_SOLAR_HOURS * 30 * 12
    };
  }, []);

  return (
    <div className={styles.calcContainer}>
      {/* ── Cabecera ── */}
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="carbon.badge">Auditoría Ambiental post-28A</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="carbon.title">Calculadora de Costes de la "Operación Reforzada"</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="carbon.subtitle">
            Evalúa el peaje ambiental y económico de sostener 3 GW constantes de gas (CCGT) fuera de mercado
            para inyectar inercia y potencia de cortocircuito artificial.
          </Translate>
        </p>
      </div>

      {/* ── Banner de Coste Total Consolidado ── */}
      <div className={styles.totalCostBanner}>
        <span className={styles.totalCostLabel}>
          Coste total consolidado · {months} {months === 1 ? 'mes' : 'meses'}:
        </span>
        <span className={styles.totalCostValue}>
          {fmt(metrics.totalCost)} €
        </span>
      </div>

      <div className={styles.layout}>
        {/* ── Panel de Entradas e Impacto ── */}
        <div className={styles.controlsPanel}>

          {/* Slider de periodo */}
          <div className={styles.card}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>PERIODO DE OPERACIÓN REFORZADA:</span>
              <strong className={styles.monthVal}>
                {months} {months === 1 ? 'MES' : 'MESES'}
              </strong>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={months}
              onChange={e => setMonths(parseInt(e.target.value, 10))}
              className={styles.slider}
              aria-label="Seleccionar periodo de operación reforzada en meses"
            />
            <div className={styles.sliderTicks}>
              <span>1m</span><span>3m</span><span>6m</span><span>9m</span><span>12m</span>
            </div>
          </div>

          {/* Rejilla de Métricas */}
          <div className={styles.metricsGrid}>
            {/* CO₂ */}
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>EMISIONES ADICIONALES CO₂</span>
              <strong className={styles.metricValue}>
                {fmt(metrics.emissions)} <span className={styles.unit}>tCO₂</span>
              </strong>
              <span className={styles.metricSub}>Despacho forzado CCGTs (3 GW base)</span>
              <div className={styles.metricBarTrack}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${(metrics.emissions / MAX.emissions) * 100}%`,
                    background: '#6db33f'
                  }}
                />
              </div>
            </div>

            {/* EUA */}
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>COSTE DERECHOS EMISIÓN (EUA)</span>
              <strong className={styles.metricValue} style={{ color: '#FFEA00' }}>
                {fmt(metrics.costCO2)} <span className={styles.unit}>€</span>
              </strong>
              <span className={styles.metricSub}>A 74,95 €/tCO₂ (EU-ETS)</span>
              <div className={styles.metricBarTrack}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${(metrics.costCO2 / MAX.costCO2) * 100}%`,
                    background: '#e6a817'
                  }}
                />
              </div>
            </div>

            {/* Restricciones */}
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>SOBRECOSTE RESTRICCIONES</span>
              <strong className={styles.metricValue} style={{ color: '#FF3333' }}>
                {fmt(metrics.restrictionCost)} <span className={styles.unit}>€</span>
              </strong>
              <span className={styles.metricSub}>Ajuste de mercado en tarifa PVPC</span>
              <div className={styles.metricBarTrack}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${(metrics.restrictionCost / MAX.restrictionCost) * 100}%`,
                    background: '#ff3333'
                  }}
                />
              </div>
            </div>

            {/* Curtailment */}
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>VERTIDOS SOLARES (CURTAILMENT)</span>
              <strong className={styles.metricValue}>
                {fmt(metrics.curtailedEnergy)} <span className={styles.unit}>MWh</span>
              </strong>
              <span className={styles.metricSub}>Generación limpia rechazada por congestión</span>
              <div className={styles.metricBarTrack}>
                <div
                  className={styles.metricBarFill}
                  style={{
                    width: `${(metrics.curtailedEnergy / MAX.curtailed) * 100}%`,
                    background: '#00b0ff'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mapa SVG ── */}
        <div className={styles.visualPanel}>
          <div className={styles.card}>
            <h4 className={styles.visualTitle}>Impacto Ecológico Territorial</h4>
            <div className={styles.mapContainer}>
              <svg viewBox="0 0 1000 800" className={styles.mapSvg}>
                <path d={IBERIA_PATH}   fill={mapColor} className={styles.landES} />
                <path d={PORTUGAL_PATH} fill={mapColor} className={styles.landPT} />
              </svg>
              <div className={styles.colorLegend}>
                <span className={styles.colorNode} style={{ backgroundColor: 'rgb(76,139,107)' }} />
                <span>Bosque nativo</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.colorNode} style={{ backgroundColor: 'rgb(184,82,45)' }} />
                <span>Erosión</span>
              </div>
              <p className={styles.mapImpactLabel}>
                {fmt(metrics.equivForestHectares)} ha de bosque maduro necesarias para compensar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Equivalencias Psicológicas ── */}
      <div className={styles.equivalencesRow}>
        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🚗</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Equivalencia Vehicular</h5>
            <strong className={styles.equivValue}>{fmt(metrics.equivCars)}</strong>
            <p className={styles.equivDesc}>
              Turismos de combustión circulando ininterrumpidamente durante un año completo.
            </p>
          </div>
        </div>

        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🌳</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Esfuerzo de Reforestación</h5>
            <strong className={styles.equivValue}>{fmt(metrics.equivForestHectares)} ha</strong>
            <p className={styles.equivDesc}>
              Hectáreas de bosque maduro necesarias para absorber el exceso de CO₂ generado.
            </p>
          </div>
        </div>

        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🏠</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Desperdicio Renovable</h5>
            <strong className={styles.equivValue}>{fmt(metrics.equivHouseholdCons)}</strong>
            <p className={styles.equivDesc}>
              Hogares que podrían abastecerse gratis con la energía solar recortada por congestión.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
