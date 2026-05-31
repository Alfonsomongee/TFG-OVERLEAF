/**
 * Bloque5Interconexiones.jsx
 * Estado de las interconexiones peninsulares a las 12:30 CEST del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATO CRÍTICO — "4.609 MVAr" marcado como Cuestión Abierta:
 *    El valor de reactiva en frontera AC no está verificado en fuente
 *    primaria. Lo que ENTSO-E Factual documenta (pp.108-109) es el pico
 *    de POTENCIA ACTIVA: ~3.800 MW @ 12:33:19 CEST.
 *    El dato de 4.609 MVAr aparece en el informe del Comité de Análisis
 *    pero con base de cálculo no aclarada. Se mantiene con etiqueta
 *    explícita de estimación.
 *
 * 2. DATOS — flujo Francia AC corregido:
 *    El flujo real previo al incidente era ~870 MW de exportación ES→FR
 *    (no importación). Se añade claridad sobre dirección del flujo.
 *
 * 3. ACCESIBILIDAD — tooltip personalizado accesible.
 */
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import styles from './Bloque5Interconexiones.module.css';

// Fuente: ENTSO-E Factual Report (oct. 2025) / REE Informe Incidente
// Los flujos son valores a las 12:30 CEST (exportación = positivo = salida de Iberia)
const INTERCONNECTIONS_DATA = [
  {
    id:          'france-ac',
    name:        'Francia AC',
    flowReal:    870,
    capacityMax: 2700,
    direction:   'exportación',
    observation: '32% utiliz. · ratio interconexión 3–5% del mix peninsular',
    source:      'ENTSO-E Factual, p.12',
  },
  {
    id:          'hvdc-inelfe',
    name:        'HVDC INELFE-1',
    flowReal:    1000,
    capacityMax: 2000,
    direction:   'exportación',
    observation: '50% utiliz. · modo PMODE1 "potencia constante" desde ~12:08 CEST',
    source:      'ENTSO-E Factual, p.12 / REE',
  },
  {
    id:          'portugal',
    name:        'Portugal (exp.)',
    flowReal:    2600,
    capacityMax: 3900,
    direction:   'exportación',
    observation: '67% utiliz. · mayor flujo de las interconexiones',
    source:      'ENTSO-E 9 may 2025',
  },
  {
    id:          'morocco',
    name:        'Marruecos',
    flowReal:    800,
    capacityMax: 900,
    direction:   'exportación',
    observation: '89% utiliz. · primera interconexión en desconectarse (~49 Hz)',
    source:      'REE Informe Incidente',
  },
];

const getUtilizationColor = (pct) =>
  pct < 50 ? '#1D9E75' : pct < 75 ? '#EF9F27' : '#E24B4A';

const fmt = (n) => n.toLocaleString('es-ES');

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: 'var(--ifm-background-surface-color, #0a0f1c)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 4, padding: '8px 12px',
      fontSize: 11, fontFamily: 'monospace',
    }}>
      <p style={{ fontWeight: 'bold', marginBottom: 4, color: '#e2e8f0' }}>{d.name}</p>
      <p style={{ color: '#378ADD', marginBottom: 2 }}>Flujo: {fmt(d.flowReal)} MW</p>
      <p style={{ color: '#64748b' }}>Capacidad: {fmt(d.capacityMax)} MW</p>
    </div>
  );
}

// ─── Tarjeta de utilización ───────────────────────────────────────────────────
function UtilizationCard({ ic }) {
  const pct   = (ic.flowReal / ic.capacityMax) * 100;
  const color = getUtilizationColor(pct);
  return (
    <div className={styles.utilizationCard}>
      <h3 className={styles.cardTitle}>{ic.name}</h3>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}
             style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className={styles.percentage}>{pct.toFixed(0)}%</div>
      <p className={styles.observation}>{ic.observation}</p>
      <p className={styles.details}>
        {fmt(ic.flowReal)} / {fmt(ic.capacityMax)} MW
        <span style={{ marginLeft: 6, fontSize: 10, color: '#475569' }}>
          ({ic.direction})
        </span>
      </p>
      <p style={{ fontSize: 9, color: '#374151', fontFamily: 'monospace', margin: 0 }}>
        📋 {ic.source}
      </p>
    </div>
  );
}

export default function Bloque5Interconexiones() {
  const chartData = useMemo(() =>
    INTERCONNECTIONS_DATA.map(ic => ({
      name:        ic.name,
      flowReal:    ic.flowReal,
      capacityMax: ic.capacityMax,
    })), []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Estado de interconexiones</h1>
        <p className={styles.subtitle}>
          Península Ibérica · 28 de abril de 2025 · 12:30 CEST
          (valores de exportación ES→exterior)
        </p>
      </div>

      {/* Leyenda */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColorBlue} />
          <span>Flujo real de exportación (MW)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColorGray} />
          <span>Capacidad máxima (MW)</span>
        </div>
      </div>

      {/* Gráfico */}
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#808080', fontSize: 11, fontFamily: 'monospace' }}
              angle={-45} textAnchor="end" height={100}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={v => `${fmt(v)} MW`}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="capacityMax" fill="rgba(100,116,139,0.4)"
                 radius={[3,3,0,0]} name="Capacidad máxima" />
            <Bar dataKey="flowReal" fill="#378ADD"
                 radius={[3,3,0,0]} name="Flujo real" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tarjetas */}
      <div className={styles.grid}>
        {INTERCONNECTIONS_DATA.map(ic => (
          <UtilizationCard key={ic.id} ic={ic} />
        ))}
      </div>

      {/* Alerta de la cascada — dato verificado vs estimación */}
      <div className={styles.alertBox}>
        <div className={styles.alertIcon}>⚡</div>
        <div>
          <h3 className={styles.alertTitle}>Dato clave de la cascada</h3>
          <p className={styles.alertText}>
            Durante la cascada (12:33:19 CEST), el pico transitorio de importación
            desde Francia alcanzó <strong>~3.800 MW de potencia activa</strong> por
            las líneas AC transpirenaicas (ENTSO-E Factual, pp.108-109 —{' '}
            <strong>dato verificado</strong>). Antes de que las protecciones ANSI 78
            abrieran las interconexiones a las 12:33:21 CEST (frecuencia: 48,46 Hz).
          </p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 4,
            fontSize: 11, color: '#f59e0b', fontFamily: 'monospace',
          }}>
            ⚠ Cuestión abierta: Algunos textos citan 4.609 MVAr de reactiva en
            frontera AC. Este valor no está verificado en fuente primaria disponible
            (ENTSO-E Factual documenta potencia activa, no reactiva en ese punto).
            Tratar como estimación hasta confirmación regulatoria.
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          Fuente: ENTSO-E Factual Report (oct. 2025) · ENTSO-E Final Report (mar. 2026) ·
          REE Informe de Incidente (jun. 2025)
        </p>
      </div>
    </div>
  );
}
