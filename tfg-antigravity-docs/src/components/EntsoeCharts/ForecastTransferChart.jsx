import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function ForecastTransferChart() {
  const [data, setData] = useState(null);
  const [activeDay, setActiveDay] = useState('dataset_1'); // dataset_1 = 28 Abril, dataset_2 = 29 Abril
  const [activeBorder, setActiveBorder] = useState('FR'); // FR or PT

  useEffect(() => {
    fetch('/data/entsoe/forecast_transfer_capacities.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Error loading forecast capacities:", err));
  }, []);

  if (!data) return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;

  const dataset = data.datasets.find(d => d.id === activeDay);
  if (!dataset) return null;

  // Process data to have hour labels instead of full strings
  const chartData = dataset.data.map(item => ({
    ...item,
    hour: item.mtu.split(' - ')[0]
  }));

  const isDay1 = activeDay === 'dataset_1';
  // Apagón fue a las 12:35 el 28 Abril, que cae en el MTU 12:00 - 13:00.
  const blackoutIndex = isDay1 ? chartData.findIndex(d => d.hour === '12:00') : -1;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <strong>Día: </strong>
          <select 
            value={activeDay} 
            onChange={e => setActiveDay(e.target.value)}
            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)' }}
          >
            <option value="dataset_1">28 de Abril</option>
            <option value="dataset_2">29 de Abril</option>
          </select>
        </div>
        <div>
          <strong>Frontera: </strong>
          <select 
            value={activeBorder} 
            onChange={e => setActiveBorder(e.target.value)}
            style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)', backgroundColor: 'var(--ifm-background-surface-color)', color: 'var(--ifm-font-color-base)' }}
          >
            <option value="FR">España - Francia</option>
            <option value="PT">España - Portugal</option>
          </select>
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="hour" tick={{fill: 'var(--ifm-font-color-base)'}} />
            <YAxis tick={{fill: 'var(--ifm-font-color-base)'}} label={{ value: 'Capacidad (MW)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-300)', color: 'var(--ifm-font-color-base)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {activeBorder === 'FR' ? (
              <>
                <Line type="stepAfter" dataKey="es_to_fr" stroke="#ef4444" strokeWidth={3} dot={false} name="ES → FR (Exportación)" />
                <Line type="stepAfter" dataKey="fr_to_es" stroke="#3b82f6" strokeWidth={3} dot={false} name="FR → ES (Importación)" />
              </>
            ) : (
              <>
                <Line type="stepAfter" dataKey="es_to_pt" stroke="#ef4444" strokeWidth={3} dot={false} name="ES → PT (Exportación)" />
                <Line type="stepAfter" dataKey="pt_to_es" stroke="#10b981" strokeWidth={3} dot={false} name="PT → ES (Importación)" />
              </>
            )}

            {isDay1 && blackoutIndex !== -1 && (
              <ReferenceLine 
                x={chartData[blackoutIndex]?.hour} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: '⚡ Apagón', fill: '#ef4444' }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
