import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

export default function ScheduledCommercialExchangesChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [data, setData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/data/entsoe/scheduled_commercial_exchanges_28A.json', { signal: controller.signal })
      .then(res => res.json())
      .then(json => {
        if (!controller.signal.aborted) {
          const processDay = (dayData, offsetHours) => {
            return dayData.map(d => {
              const timeStr = d.mtu.split(' - ')[0]; // "10:00"
              const [hours, mins] = timeStr.split(':').map(Number);
              const decimalTime = hours + mins / 60 + offsetHours;
              const net_fr = d.es_to_fr_mw - d.fr_to_es_mw;
              const net_pt = d.es_to_pt_mw - d.pt_to_es_mw;
              return {
                timeNum: decimalTime,
                timeLabel: timeStr + (offsetHours > 0 ? ' (29/04)' : ''),
                net_fr: net_fr,
                net_pt: net_pt
              };
            });
          };
          const day28 = processDay(json.data['2025-04-28'], 0);
          setData(day28);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Error loading commercial exchanges:", err);
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

  const customTooltipFormatter = (value, name) => {
    const valStr = Math.abs(value).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' MW';
    if (name === "Saldo Francia (ES -> FR)") {
      return [valStr, value >= 0 ? "Exportación Programada a FR" : "Importación Programada de FR"];
    }
    if (name === "Saldo Portugal (ES -> PT)") {
      return [valStr, value >= 0 ? "Exportación Programada a PT" : "Importación Programada de PT"];
    }
    return [valStr, name];
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="timeNum" type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTime} tick={tickStyle} tickCount={12} label={{ value: isEs ? 'Hora (UTC)' : 'Time (UTC)', position: 'insideBottom', offset: -10, fill: 'var(--ifm-font-color-base)' }} />
            <YAxis tick={tickStyle} width={80} label={{ value: isEs ? 'Intercambio Neto Programado (MW)' : 'Scheduled Net Exchange (MW)', angle: -90, position: 'insideLeft', fill: 'var(--ifm-font-color-base)' }} />
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={customTooltipFormatter}
              labelFormatter={(t) => `Hora UTC: ${formatTime(t)}`} 
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            
            <ReferenceLine y={0} stroke="var(--ifm-font-color-base)" opacity={0.5} />
            
            <ReferenceLine x={10.55} stroke="#ef4444" strokeWidth={2} strokeDasharray="6 6">
              <Label value={isEs ? "⚡ Apagón (12:33 CEST)" : "⚡ Blackout (12:33 CEST)"} position="insideTopLeft" fill="#ef4444" fontSize={12} fontWeight="bold" />
            </ReferenceLine>

            <Bar dataKey="net_fr" stackId="a" name={isEs ? "Saldo Francia (ES -> FR)" : "France Balance (ES -> FR)"} fill="#3b82f6" />
            <Bar dataKey="net_pt" stackId="a" name={isEs ? "Saldo Portugal (ES -> PT)" : "Portugal Balance (ES -> PT)"} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * Valores positivos = Exportación neta desde España. Valores negativos = Importación neta a España.
      </div>
    </div>
  );
}
