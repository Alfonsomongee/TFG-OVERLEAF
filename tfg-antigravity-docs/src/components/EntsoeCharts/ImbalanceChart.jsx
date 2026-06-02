import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

export default function ImbalanceChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/imbalance_spain_28_29_april_2025.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.datetime.slice(11, 16); // "10:30"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;

              // Separamos por deficit y superavit para las áreas
              const deficit = d.situation === 'Deficit' ? d.imbalance_mwh : 0;
              const surplus = d.situation === 'Surplus' ? d.imbalance_mwh : 0;

              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                imbalance_mwh: d.imbalance_mwh,
                situation: d.situation,
                deficit: deficit,
                surplus: surplus
              };
            });
          };

          const day28 = processDay(json.data['2025-04-28'], 0);
          const day29 = processDay(json.data['2025-04-29'], 24);
          setData([...day28, ...day29]);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading imbalance data:", err);
        }
      });

    return () => controller.abort();
  }, []);

  if (data.length === 0) {
    return <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{isEs ? 'Cargando datos...' : 'Loading data...'}</div>;
  }

  const formatTime = (decimalTime) => {
    const hours = Math.floor(decimalTime) % 24;
    const mins = Math.round((decimalTime % 1) * 60);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };
  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  const customTooltipFormatter = (value, name, props) => {
    if (value === 0) return null; // Hide 0 values in tooltip
    const valStr = value.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' MWh';
    return [valStr, name];
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="timeNum" type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} tick={tickStyle} tickCount={12} label={{ value: isEs ? 'Hora (UTC)' : 'Time (UTC)', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tick={tickStyle} width={60} domain={[0, 1800]} label={{ value: isEs ? 'Imbalance (MWh)' : 'Imbalance (MWh)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={customTooltipFormatter}
              labelFormatter={(t) => `Hora UTC: ${formatTime(t)}`} 
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <ReferenceLine x={10.55} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
              <Label value="⚡ Colapso (12:33 CEST)" position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
            </ReferenceLine>

            {/* We map deficit to red and surplus to green */}
            <Area type="step" dataKey="deficit" name={isEs ? "Déficit (Falta Generación)" : "Deficit (Lack of Generation)"} fill="#ef4444" stroke="#dc2626" fillOpacity={0.6} />
            <Area type="step" dataKey="surplus" name={isEs ? "Superávit (Exceso Generación)" : "Surplus (Excess Generation)"} fill="#10b981" stroke="#059669" fillOpacity={0.6} />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Imbalance (TR 17.1.G&H). Valores representan magnitud del desequilibrio horario en MWh.
      </div>
    </div>
  );
}
