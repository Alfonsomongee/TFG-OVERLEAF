import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, Label
} from 'recharts';

export default function CurrentBalancingStateChart() {
  const [data, setData] = useState([]);
  const [zoomIn, setZoomIn] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/current_balancing_state_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          // Formatear los datos: si es Deficit, lo hacemos negativo para que la barra vaya hacia abajo
          const formattedData = json.data['2025-04-28'].map(d => {
            const startTime = d.time_interval.split(' - ')[0]; // Ej: "00:00:00"
            const timeLabel = startTime.substring(0, 5); // Ej: "00:00"
            return {
              time: timeLabel,
              raw_time: startTime,
              situation: d.situation,
              error_mw: d.situation === 'Deficit' ? -Math.abs(d.error_mw) : Math.abs(d.error_mw)
            };
          });
          setData(formattedData);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading balancing state:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  // Filtrar los datos para mostrar solo las horas críticas (por ej. 08:00 a 10:30 UTC = 10:00 a 12:30 CEST)
  const displayData = zoomIn 
    ? data.filter(d => d.raw_time >= "08:00:00" && d.raw_time <= "10:30:00") 
    : data;

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
        <button 
          onClick={() => setZoomIn(true)}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--ifm-color-primary)', backgroundColor: zoomIn ? 'var(--ifm-color-primary)' : 'transparent', color: zoomIn ? 'white' : 'var(--ifm-color-primary)', cursor: 'pointer' }}
        >
          Ventana Pre-Colapso (08:00 - 10:30 UTC)
        </button>
        <button 
          onClick={() => setZoomIn(false)}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--ifm-color-primary)', backgroundColor: !zoomIn ? 'var(--ifm-color-primary)' : 'transparent', color: !zoomIn ? 'white' : 'var(--ifm-color-primary)', cursor: 'pointer' }}
        >
          Día Completo
        </button>
      </div>

      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
            <XAxis dataKey="time" tick={tickStyle} minTickGap={30} label={{ value: 'Hora (UTC)', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tick={tickStyle} label={{ value: 'Error de Balance (MW)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={(value, name, props) => [`${Math.abs(value).toLocaleString()} MW (${props.payload.situation})`, 'Imbalance']}
              labelFormatter={(t) => `Hora UTC: ${t}`} 
            />
            
            <ReferenceLine y={0} stroke="var(--ifm-font-color-base)" opacity={0.5} />
            
            {/* Si mostramos todo, marcamos el inicio de la escalada grave */}
            {zoomIn && (
              <ReferenceLine x="10:29" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
                <Label value="Fin datos (Pre-Colapso)" position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
              </ReferenceLine>
            )}

            <Bar dataKey="error_mw" name="Imbalance">
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.situation === 'Deficit' ? '#ef4444' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Nota: Datos en UTC. El apagón ibérico ocurrió a las 12:33 CEST (10:33 UTC). La telemetría en ENTSO-E se interrumpe a las 10:29 UTC.
      </div>
    </div>
  );
}
