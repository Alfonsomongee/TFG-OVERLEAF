import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './Bloque5Interconexiones.module.css';

const INTERCONNECTIONS_DATA = [
  { id: 'france-ac', name: 'Francia AC', flowReal: 870, capacityMax: 2700, observation: '32% utiliz. · ratio interconexión 3-5% del mix' },
  { id: 'hvdc-inelfe', name: 'HVDC INELFE', flowReal: 1000, capacityMax: 2000, observation: '50% utiliz. · modo PMODE1 "potencia constante"' },
  { id: 'portugal', name: 'Portugal (exp)', flowReal: 2600, capacityMax: 3900, observation: '67% utiliz. · mayor flujo de las interconexiones' },
  { id: 'morocco', name: 'Marruecos', flowReal: 800, capacityMax: 900, observation: '89% utiliz. · primera en desconectarse (~49 Hz)' }
];

const KEY_DATA = {
  title: 'Dato clave de la cascada',
  content: 'Durante la cascada (12:33:19 CEST), la importación desde Francia alcanzó un pico de 4.609 MW por AC, superando la capacidad nominal de 2.700 MW, antes de que las protecciones ANSI 78 (out-of-step) abrieran la interconexión a los 48,46 Hz.'
};

const getUtilizationColor = (percentage) => {
  if (percentage < 50) return '#1D9E75';
  if (percentage < 75) return '#EF9F27';
  return '#E24B4A';
};

const formatNumber = (num) => num.toLocaleString('es-ES');

const BulletChart = () => {
  const chartData = useMemo(() => INTERCONNECTIONS_DATA.map((item) => ({
    name: item.name,
    flowReal: item.flowReal,
    capacityMax: item.capacityMax,
  })), []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: '4px', padding: '8px 12px', fontSize: '11px', color: 'var(--color-text-primary)' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data.name}</p>
          <p style={{ color: '#378ADD', marginBottom: '2px' }}>Flujo: {formatNumber(data.flowReal)} MW</p>
          <p style={{ color: 'var(--color-text-secondary)' }}>Capacidad: {formatNumber(data.capacityMax)} MW</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#808080', fontSize: 11, fontFamily: 'monospace' }} angle={-45} textAnchor="end" height={100} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }} tickFormatter={(value) => `${formatNumber(value)} MW`} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          <Bar dataKey="capacityMax" fill="var(--color-border-tertiary)" radius={[3, 3, 0, 0]} name="Capacidad máxima" />
          <Bar dataKey="flowReal" fill="#378ADD" radius={[3, 3, 0, 0]} name="Flujo real" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const UtilizationCard = ({ interconnection }) => {
  const utilization = (interconnection.flowReal / interconnection.capacityMax) * 100;
  const barColor = getUtilizationColor(utilization);

  return (
    <div className={styles.utilizationCard}>
      <h3 className={styles.cardTitle}>{interconnection.name}</h3>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${utilization}%`, backgroundColor: barColor }} />
      </div>
      <div className={styles.percentage}>{utilization.toFixed(0)}%</div>
      <p className={styles.observation}>{interconnection.observation}</p>
      <p className={styles.details}>{formatNumber(interconnection.flowReal)} / {formatNumber(interconnection.capacityMax)} MW</p>
    </div>
  );
};

const CriticalAlert = ({ data }) => {
  return (
    <div className={styles.alertBox}>
      <div className={styles.alertIcon}>⚡</div>
      <div>
        <h3 className={styles.alertTitle}>{data.title}</h3>
        <p className={styles.alertText}>{data.content}</p>
      </div>
    </div>
  );
};

export default function Bloque5Interconexiones() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Estado de interconexiones</h1>
        <p className={styles.subtitle}>Península Ibérica · 28 de abril de 2025 · 12:30 CEST</p>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColorBlue} />
          <span>Flujo real (exportación, MW)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColorGray} />
          <span>Capacidad máxima (MW)</span>
        </div>
      </div>

      <BulletChart />

      <div className={styles.grid}>
        {INTERCONNECTIONS_DATA.map((interconnection) => (
          <UtilizationCard key={interconnection.id} interconnection={interconnection} />
        ))}
      </div>

      <CriticalAlert data={KEY_DATA} />

      <div className={styles.footer}>
        <p>Fuente: ENTSO-E Factual Report (oct. 2025) · REE Informe Incidente 18/06/2025 · ENTSO-E Final Report (mar. 2026)</p>
      </div>
    </div>
  );
}
