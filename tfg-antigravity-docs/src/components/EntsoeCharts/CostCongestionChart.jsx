import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

export default function CostCongestionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/cost_congestion_management.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          setData(json.data);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading cost congestion:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (!data || data.length === 0) return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando datos...</div>;

  // Format tooltip currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" tick={{fill: 'var(--ifm-font-color-base)'}} />
            <YAxis 
              tick={{fill: 'var(--ifm-font-color-base)'}} 
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M €`}
            />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              contentStyle={{ backgroundColor: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-300)', color: 'var(--ifm-font-color-base)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Bar dataKey="countertrading_costs_eur" name="Costes de Countertrading" stackId="a" fill="#3b82f6" />
            <Bar dataKey="redispatching_costs_eur" name="Costes de Redespacho" stackId="a" fill="#ef4444" />
            <Bar dataKey="other_costs_eur" name="Otros Costes" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
