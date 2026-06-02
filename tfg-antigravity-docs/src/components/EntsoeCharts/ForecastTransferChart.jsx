import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

export default function ForecastTransferChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [data, setData] = useState(null);
  const [activeDay, setActiveDay] = useState('dataset_1'); // dataset_1 = 28 Abril, dataset_2 = 29 Abril
  const [activeBorder, setActiveBorder] = useState('FR'); // FR or PT

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/forecast_transfer_capacities.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          setData(json);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading forecast capacities:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (!data) return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{isEs ? 'Cargando datos...' : 'Loading data...'}</div>;

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
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--ifm-color-emphasis-100)', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'dataset_1', label: '28 de Abril' },
            { id: 'dataset_2', label: '29 de Abril' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setActiveDay(opt.id)}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeDay === opt.id ? 'var(--ifm-color-primary)' : 'transparent', color: activeDay === opt.id ? '#fff' : 'var(--ifm-color-emphasis-700)', fontWeight: activeDay === opt.id ? 'bold' : 'normal', transition: 'all 0.2s', fontSize: '0.85rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'var(--ifm-color-emphasis-100)', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'FR', label: 'España - Francia' },
            { id: 'PT', label: 'España - Portugal' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setActiveBorder(opt.id)}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: activeBorder === opt.id ? 'var(--ifm-color-primary)' : 'transparent', color: activeBorder === opt.id ? '#fff' : 'var(--ifm-color-emphasis-700)', fontWeight: activeBorder === opt.id ? 'bold' : 'normal', transition: 'all 0.2s', fontSize: '0.85rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="hour" tick={{fill: 'var(--ifm-font-color-base)'}} />
            <YAxis tick={{fill: 'var(--ifm-font-color-base)'}} label={{ value: isEs ? 'Capacidad (MW)' : 'Capacity (MW)', angle: -90, position: 'insideLeft', dx: -30, fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-300)', color: 'var(--ifm-font-color-base)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {activeBorder === 'FR' ? (
              <>
                <Line type="stepAfter" dataKey="es_to_fr" stroke="#ef4444" strokeWidth={3} dot={false} name={isEs ? "ES ➝ FR (Exportación)" : "ES ➝ FR (Export)"} />
                <Line type="stepAfter" dataKey="fr_to_es" stroke="#3b82f6" strokeWidth={3} dot={false} name={isEs ? "FR ➝ ES (Importación)" : "FR ➝ ES (Import)"} />
              </>
            ) : (
              <>
                <Line type="stepAfter" dataKey="es_to_pt" stroke="#ef4444" strokeWidth={3} dot={false} name={isEs ? "ES ➝ PT (Exportación)" : "ES ➝ PT (Export)"} />
                <Line type="stepAfter" dataKey="pt_to_es" stroke="#10b981" strokeWidth={3} dot={false} name={isEs ? "PT ➝ ES (Importación)" : "PT ➝ ES (Import)"} />
              </>
            )}

            {isDay1 && blackoutIndex !== -1 && (
              <ReferenceLine 
                x={chartData[blackoutIndex]?.hour} 
                stroke="#ef4444" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: isEs ? '⚡ Apagón' : '⚡ Blackout', fill: '#ef4444' }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
