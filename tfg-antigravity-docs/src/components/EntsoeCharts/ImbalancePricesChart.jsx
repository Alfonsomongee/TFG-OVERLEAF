import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, ReferenceArea
} from 'recharts';

export default function ImbalancePricesChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/imbalance_prices_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const formattedData = json.data['2025-04-28'].map(d => {
            const startTime = d.time_interval.split(' - ')[0]; // Ej: "10:15"
            return {
              time: startTime,
              raw_time: startTime,
              price_positive: d.positive_imbalance_price_eur_mwh,
              price_negative: d.negative_imbalance_price_eur_mwh,
              // Tomamos el mayor de los dos como el precio más representativo de la tensión del sistema
              price_eur_mwh: Math.max(d.positive_imbalance_price_eur_mwh, d.negative_imbalance_price_eur_mwh),
              situation: d.situation
            };
          });
          setData(formattedData);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading imbalance prices:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{isEs ? 'Cargando datos...' : 'Loading data...'}</div>;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="time" tick={tickStyle} minTickGap={30} label={{ value: isEs ? 'Hora (UTC)' : 'Time (UTC)', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tickFormatter={(val) => `${val} €`} tick={tickStyle} width={80} domain={['auto', 'auto']} allowDataOverflow label={{ value: isEs ? 'Precio Imbalance (€/MWh)' : 'Imbalance Price (€/MWh)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(t) => `Hora UTC: ${t}`} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            {/* Zonas de color para marcar el nivel de severidad */}
            <ReferenceArea y1={0} y2={100} fill="#10b981" fillOpacity={0.05} />
            <ReferenceArea y1={100} y2={500} fill="#f59e0b" fillOpacity={0.05} />
            <ReferenceArea y1={500} fill="#ef4444" fillOpacity={0.05} />

            <Line type="stepAfter" dataKey="price_eur_mwh" name={isEs ? "Precio Imbalance (Máx)" : "Imbalance Price (Max)"} stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            <Line type="stepAfter" dataKey="price_positive" name={isEs ? "Precio (+) Surplus" : "Price (+) Surplus"} stroke="#3b82f6" strokeWidth={1} dot={false} strokeDasharray="3 3" />
            <Line type="stepAfter" dataKey="price_negative" name={isEs ? "Precio (-) Deficit" : "Price (-) Deficit"} stroke="#f59e0b" strokeWidth={1} dot={false} strokeDasharray="3 3" />
            
            <ReferenceLine x="10:30" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
              <Label value="⚡ Colapso (12:33 CEST)" position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
            </ReferenceLine>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
