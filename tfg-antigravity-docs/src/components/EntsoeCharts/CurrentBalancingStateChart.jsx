import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell, Label
} from 'recharts';

function getBalancingPalette(isDark) {
  return {
    bgTabs: isDark ? 'rgba(7, 19, 38, 0.58)' : 'rgba(25, 24, 20, 0.045)',
    bgTooltip: isDark ? '#101D35' : '#FFFCF5',

    textPrimary: isDark ? '#F4F7FB' : '#191814',
    textSecondary: isDark ? '#C7D2E3' : '#4A4338',
    textMuted: isDark ? '#91A4BC' : '#7A7062',

    border: isDark ? 'rgba(226, 232, 240, 0.14)' : 'rgba(25, 24, 20, 0.14)',
    borderStrong: isDark ? 'rgba(226, 232, 240, 0.24)' : 'rgba(25, 24, 20, 0.24)',

    grid: isDark ? 'rgba(244, 247, 251, 0.10)' : 'rgba(25, 24, 20, 0.10)',
    axis: isDark ? '#C7D2E3' : '#6B6255',
    axisLine: isDark ? 'rgba(244, 247, 251, 0.22)' : 'rgba(25, 24, 20, 0.20)',
    zeroLine: isDark ? 'rgba(244, 247, 251, 0.34)' : 'rgba(25, 24, 20, 0.30)',

    accent: isDark ? '#7DCDE3' : '#1F6F78',
    accentText: isDark ? '#071326' : '#FFFCF5',

    deficit: isDark ? '#D98798' : '#A13D36',
    surplus: isDark ? '#7DCDE3' : '#1F6F78',

    endLine: isDark ? '#D98798' : '#A13D36',

    tooltipShadow: isDark
      ? '0 16px 38px rgba(0, 0, 0, 0.38)'
      : '0 12px 32px rgba(25, 24, 20, 0.12)',
  };
}

export default function CurrentBalancingStateChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const palette = getBalancingPalette(isDark);
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
    return (
      <div
        style={{
          minHeight: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: palette.textMuted,
          fontFamily: 'Space Mono, monospace',
        }}
      >
        {isEs ? 'Cargando datos...' : 'Loading data...'}
      </div>
    );
  }

  // Filtrar los datos para mostrar solo las horas críticas (por ej. 08:00 a 10:30 UTC = 10:00 a 12:30 CEST)
  const displayData = zoomIn 
    ? data.filter(d => d.raw_time >= "08:00:00" && d.raw_time <= "10:30:00") 
    : data;

  const tooltipStyle = {
    backgroundColor: palette.bgTooltip,
    border: `1px solid ${palette.borderStrong}`,
    color: palette.textPrimary,
    boxShadow: palette.tooltipShadow,
    borderRadius: 8,
  };

  const tickStyle = { fill: palette.axis };

  return (
    <div style={{ width: '100%', color: palette.textPrimary }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setZoomIn(true)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: `1px solid ${zoomIn ? palette.accent : palette.borderStrong}`,
            backgroundColor: zoomIn ? palette.accent : 'transparent',
            color: zoomIn ? palette.accentText : palette.accent,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Ventana Pre-Colapso (08:00 - 10:30 UTC)
        </button>
        <button
          onClick={() => setZoomIn(false)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: `1px solid ${!zoomIn ? palette.accent : palette.borderStrong}`,
            backgroundColor: !zoomIn ? palette.accent : 'transparent',
            color: !zoomIn ? palette.accentText : palette.accent,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Día Completo
        </button>
      </div>

      <div style={{ height: '450px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="time"
              tick={tickStyle}
              stroke={palette.axisLine}
              minTickGap={30}
              label={{
                value: isEs ? 'Hora (UTC)' : 'Time (UTC)',
                position: 'insideBottom',
                offset: -10,
                fill: palette.axis,
              }}
            />
            <YAxis
              tick={tickStyle}
              stroke={palette.axisLine}
              label={{
                value: isEs ? 'Error de Balance (MW)' : 'Balancing Error (MW)',
                angle: -90,
                position: 'insideLeft',
                fill: palette.axis,
              }}
            />
            
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{
                color: palette.textPrimary,
                fontWeight: 700,
              }}
              itemStyle={{
                color: palette.textSecondary,
              }}
              formatter={(value, name, props) => [
                `${Math.abs(value).toLocaleString()} MW (${props.payload.situation})`,
                'Imbalance',
              ]}
              labelFormatter={(t) => `Hora UTC: ${t}`}
            />
            
            <ReferenceLine y={0} stroke={palette.zeroLine} />
            
            {/* Si mostramos todo, marcamos el inicio de la escalada grave */}
            {zoomIn && (
              <ReferenceLine x="10:29" stroke={palette.endLine} strokeWidth={2} strokeDasharray="6 6">
                <Label
                  value="Fin datos (Pre-Colapso)"
                  position="insideTopLeft"
                  fill={palette.endLine}
                  fontSize={12}
                  fontWeight="bold"
                />
              </ReferenceLine>
            )}

            <Bar dataKey="error_mw" name="Imbalance">
              {displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.situation === 'Deficit' ? palette.deficit : palette.surplus}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: palette.textMuted,
          marginTop: '0.5rem',
        }}
      >
        * Nota: Datos en UTC. El apagón ibérico ocurrió a las 12:33 CEST (10:33 UTC). La telemetría en ENTSO-E se interrumpe a las 10:29 UTC.
      </div>
    </div>
  );
}
