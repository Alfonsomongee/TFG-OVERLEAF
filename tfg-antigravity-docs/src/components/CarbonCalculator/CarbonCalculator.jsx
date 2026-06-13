import React, { useState, useMemo } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './CarbonCalculator.module.css';

// ─── Proyección geográfica simplificada (viewBox 1000x800) ───
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

const IBERIA_OUTLINE = [
  [43.78, -7.86],  [43.47, -8.45],  [42.88, -9.28],  [42.03, -8.87],  [41.87, -8.87],
  [41.38, -8.73],  [40.64, -8.75],  [39.36, -9.40],  [38.62, -9.50],  [37.01, -8.91],
  [36.97, -7.85],  [36.01, -5.61],  [36.17, -5.36],  [36.69, -4.41],  [36.72, -3.48],
  [37.20, -1.90],  [37.64, -0.69],  [38.68,  0.23],  [39.58,  0.34],  [40.72,  0.73],
  [41.29,  1.83],  [41.42,  2.22],  [42.43,  3.16],  [42.80,  1.72],  [43.37, -1.79],
  [43.49, -3.80],  [43.57, -5.66],  [43.78, -7.86]
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87],  [41.52, -6.92],  [39.67, -7.06],  [37.43, -7.44],  [36.97, -7.85],
  [37.01, -8.91],  [38.62, -9.50],  [39.36, -9.40],  [40.64, -8.75],  [41.38, -8.73],
  [41.87, -8.87]
];

function pointsToPath(points) {
  return points.map((p, i) => {
    const { x, y } = geoToSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_PATH = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);

export default function CarbonCalculator() {
  const [months, setMonths] = useState(1);

  // Constantes del sector eléctrico español (2025/2026)
  const POWER_CCGT_MIN = 3000; // MW obligatorios
  const EMISSION_FACTOR = 0.356; // tCO2/MWh
  const PRICE_EUA = 74.95; // €/tCO2
  const DEMAND_AVERAGE = 25000; // MWh de consumo promedio
  const RESTRICTION_COST_MWh = 16.75; // €/MWh
  const CURTAILED_MW_H = 320; // Curtailment solar promedio
  const DAILY_SOLAR_HOURS = 10;

  // Cómputo matemático memoizado
  const metrics = useMemo(() => {
    const totalHours = months * 30 * 24; // 720 horas por mes
    const totalEmissionsCO2 = POWER_CCGT_MIN * totalHours * EMISSION_FACTOR;
    const totalCostCO2 = totalEmissionsCO2 * PRICE_EUA;
    const totalRestrictionCost = DEMAND_AVERAGE * totalHours * RESTRICTION_COST_MWh;
    const totalCurtailedEnergy = CURTAILED_MW_H * DAILY_SOLAR_HOURS * 30 * months;

    // Equivalencias psicológicas
    const equivCars = totalEmissionsCO2 / 4.6; // 4.6 tCO2/año por coche
    const equivForestHectares = totalEmissionsCO2 / 5; // 5 tCO2/año absorbida por hectárea
    const equivHouseholdCons = totalCurtailedEnergy / 3.3; // 3.3 MWh/año por hogar

    return {
      hours: totalHours,
      emissions: totalEmissionsCO2,
      costCO2: totalCostCO2,
      restrictionCost: totalRestrictionCost,
      curtailedEnergy: totalCurtailedEnergy,
      equivCars,
      equivForestHectares,
      equivHouseholdCons
    };
  }, [months]);

  // Interpolación de color para el mapa de Iberia (Verde Bosque -> Rojo Árido)
  const mapColor = useMemo(() => {
    const ratio = (months - 1) / 11; // 0 a 1
    // Bosque: rgb(76, 139, 107) -> Árido: rgb(184, 92, 55)
    const r = Math.round(76 + (184 - 76) * ratio);
    const g = Math.round(139 + (92 - 139) * ratio);
    const b = Math.round(107 + (55 - 107) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }, [months]);

  return (
    <div className={styles.calcContainer}>
      <div className={styles.header}>
        <span className={styles.badge}>
          <Translate id="carbon.badge">Auditoría Ambiental post-28A</Translate>
        </span>
        <h3 className={styles.title}>
          <Translate id="carbon.title">Calculadora de Costes de la "Operación Reforzada"</Translate>
        </h3>
        <p className={styles.subtitle}>
          <Translate id="carbon.subtitle">
            Evalúa el peaje ambiental y económico de sostener 3 GW constantes de gas (CCGT) fuera de mercado para inyectar inercia y potencia de cortocircuito artificial.
          </Translate>
        </p>
      </div>

      <div className={styles.layout}>
        {/* Panel de Entradas e Impacto */}
        <div className={styles.controlsPanel}>
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
              onChange={(e) => setMonths(parseInt(e.target.value, 10))}
              className={styles.slider}
            />
            <div className={styles.sliderTicks}>
              <span>1m</span>
              <span>3m</span>
              <span>6m</span>
              <span>9m</span>
              <span>12m</span>
            </div>
          </div>

          {/* Rejilla de Métricas en Euros y Emisiones */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>EMISIONES ADICIONALES CO₂</span>
              <strong className={styles.metricValue}>
                {Math.round(metrics.emissions).toLocaleString('es-ES')} <span className={styles.unit}>tCO₂</span>
              </strong>
              <span className={styles.metricSub}>Despacho forzado de CCGTs (3 GW base)</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>COSTE DERECHOS EMISIÓN (EUA)</span>
              <strong className={styles.metricValue} style={{ color: '#FFEA00' }}>
                {Math.round(metrics.costCO2).toLocaleString('es-ES')} <span className={styles.unit}>€</span>
              </strong>
              <span className={styles.metricSub}>Internalización de carbono a 74,95 €/t</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>SOBRECOSTE RESTRICCIONES</span>
              <strong className={styles.metricValue} style={{ color: '#FF3333' }}>
                {Math.round(metrics.restrictionCost).toLocaleString('es-ES')} <span className={styles.unit}>€</span>
              </strong>
              <span className={styles.metricSub}>Ajuste de mercado en tarifa PVPC</span>
            </div>

            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>VERTIDOS SOLARES (CURTAILMENT)</span>
              <strong className={styles.metricValue}>
                {Math.round(metrics.curtailedEnergy).toLocaleString('es-ES')} <span className={styles.unit}>MWh</span>
              </strong>
              <span className={styles.metricSub}>Generación limpia rechazada por congestión</span>
            </div>
          </div>
        </div>

        {/* Mapa SVG interactivo e Equivalencias forestales */}
        <div className={styles.visualPanel}>
          <div className={styles.card}>
            <h4 className={styles.visualTitle}>Impacto Ecológico Territorial</h4>
            <div className={styles.mapContainer}>
              <svg viewBox="0 0 1000 800" className={styles.mapSvg}>
                <path d={IBERIA_PATH} fill={mapColor} className={styles.landES} />
                <path d={PORTUGAL_PATH} fill={mapColor} className={styles.landPT} />
              </svg>
              <div className={styles.colorLegend}>
                <span className={styles.colorNode} style={{ backgroundColor: 'rgb(76, 139, 107)' }} />
                <span>Bosque</span>
                <span className={styles.arrow}>→</span>
                <span className={styles.colorNode} style={{ backgroundColor: 'rgb(184, 92, 55)' }} />
                <span>Erosión</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Equivalencias Psicológicas */}
      <div className={styles.equivalencesRow}>
        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🚗</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Equivalencia Vehicular</h5>
            <strong className={styles.equivValue}>{Math.round(metrics.equivCars).toLocaleString('es-ES')}</strong>
            <p className={styles.equivDesc}>
              Turismos de combustión adicionales circulando ininterrumpidamente durante 1 año.
            </p>
          </div>
        </div>

        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🌳</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Esfuerzo de Reforestación</h5>
            <strong className={styles.equivValue}>{Math.round(metrics.equivForestHectares).toLocaleString('es-ES')} ha</strong>
            <p className={styles.equivDesc}>
              Hectáreas de bosque maduro necesarias para absorber el exceso de dióxido de carbono.
            </p>
          </div>
        </div>

        <div className={styles.equivCard}>
          <div className={styles.equivIcon}>🏠</div>
          <div className={styles.equivContent}>
            <h5 className={styles.equivTitle}>Desperdicio Renovable</h5>
            <strong className={styles.equivValue}>{Math.round(metrics.equivHouseholdCons).toLocaleString('es-ES')}</strong>
            <p className={styles.equivDesc}>
              Hogares de consumo familiar que podrían haberse alimentado gratis con la energía solar recortada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
