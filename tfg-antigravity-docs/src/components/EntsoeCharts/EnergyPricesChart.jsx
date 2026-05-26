import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea
} from 'recharts';

export default function EnergyPricesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/entsoe/energy_prices_day_ahead_28A.json')
      .then(res => res.json())
      .then(json => {
        const day28 = json.data.Spain['2025-04-28'].map(d => ({
          time: d.hour.split(' - ')[0],
          raw_time: d.hour,
          price: d.price_eur_per_mwh,
          date: '28/04'
        }));
        const day29 = json.data.Spain['2025-04-29'].map(d => ({
          time: d.hour.split(' - ')[0] + ' (29/04)',
          raw_time: d.hour,
          price: d.price_eur_per_mwh,
          date: '29/04'
        }));
        setData([...day28, ...day29]);
      })
      .catch(err => console.error("Error loading energy prices data:", err));
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;
  }

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  // Calculate gradient offset so negative values are colored differently (red)
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const gradientOffset = () => {
    if (maxPrice <= 0) return 0;
    if (minPrice >= 0) return 1;
    return maxPrice / (maxPrice - minPrice);
  };
  const off = gradientOffset();

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#10b981" stopOpacity={1} />
                <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" tick={tickStyle} minTickGap={30} label={{ value: 'Hora', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tickFormatter={(val) => `${val} €`} tick={tickStyle} width={60} label={{ value: 'Precio Diario OMIE (€/MWh)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={(value) => [new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value), 'Precio OMIE']}
              labelFormatter={(t) => `Hora: ${t}`} 
            />
            
            <ReferenceLine y={0} stroke="var(--ifm-color-emphasis-600)" />
            
            <ReferenceLine x="12:00" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
              <Label value="⚡ Colapso (12:33 CEST)" position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
            </ReferenceLine>

            {/* Zonas sombreadas para destacar precios negativos */}
            <ReferenceArea y1={minPrice} y2={0} fill="#ef4444" fillOpacity={0.05} />

            <Line 
              type="monotone" 
              dataKey="price" 
              name="Precio Diario (€/MWh)" 
              stroke="url(#colorPrice)" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Precios casados 24 horas antes en el mercado diario ibérico (OMIE). Reflejan una señal económica previa de exceso de renovables, no las consecuencias del apagón.
      </div>
    </div>
  );
}
