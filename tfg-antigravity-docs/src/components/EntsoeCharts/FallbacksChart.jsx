import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function FallbacksChart() {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  useEffect(() => {
    fetch('/data/entsoe/fallbacks.json')
      .then(res => res.json())
      .then(json => {
        // Ordenar por fecha reciente
        const sorted = [...json].sort((a, b) => {
          const dateA = a.time_period.split(' ')[0].split('/').reverse().join('-');
          const dateB = b.time_period.split(' ')[0].split('/').reverse().join('-');
          return dateB.localeCompare(dateA);
        });
        setData(sorted);

        // Agrupar por event_type para el gráfico de torta
        const counts = {};
        json.forEach(item => {
          counts[item.event_type] = (counts[item.event_type] || 0) + 1;
        });
        const summary = Object.keys(counts).map(key => ({
          name: key,
          value: counts[key]
        }));
        setSummaryData(summary);
      })
      .catch(err => console.error("Error loading fallbacks:", err));
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Gráfico de Resumen */}
      <div style={{ height: '300px', width: '100%' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Distribución de Tipos de Contingencia (Fallbacks)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summaryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {summaryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de Eventos */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-200)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
            <tr>
              <th style={{ padding: '12px' }}>Periodo (UTC)</th>
              <th style={{ padding: '12px' }}>Área</th>
              <th style={{ padding: '12px' }}>Proceso</th>
              <th style={{ padding: '12px' }}>Tipo de Evento</th>
              <th style={{ padding: '12px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 15).map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)', backgroundColor: row.status === 'Cancelled' ? 'var(--ifm-color-danger-contrast-background)' : 'transparent' }}>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{row.time_period}</td>
                <td style={{ padding: '10px 12px' }}><strong>{row.area}</strong></td>
                <td style={{ padding: '10px 12px' }}>{row.process_type}</td>
                <td style={{ padding: '10px 12px' }}>
                  {row.event_type.includes('disconnected') || row.event_type.includes('Failure') ? (
                    <span style={{ color: 'var(--ifm-color-danger)', fontWeight: 'bold' }}>{row.event_type}</span>
                  ) : (
                    row.event_type
                  )}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem',
                    backgroundColor: row.status === 'Final' ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-warning-contrast-background)',
                    color: row.status === 'Final' ? 'var(--ifm-color-success-contrast-foreground)' : 'var(--ifm-color-warning-contrast-foreground)'
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
        * Mostrando los últimos 15 eventos registrados en el sistema.
      </div>
    </div>
  );
}
