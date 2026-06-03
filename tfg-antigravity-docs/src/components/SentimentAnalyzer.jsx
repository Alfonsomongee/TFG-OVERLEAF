/**
 * SentimentAnalyzer.jsx
 * Evolución del sentimiento en X durante las primeras 24h del 28-A.
 * Usa Recharts (ya instalado) + BrowserOnly para SSR safety.
 */
import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const DATA = [
  { hora: '12:33', ansiedad: 20,  indignacion: 5,   correccion: 0  },
  { hora: '13:00', ansiedad: 85,  indignacion: 15,  correccion: 0  },
  { hora: '14:00', ansiedad: 70,  indignacion: 45,  correccion: 0  },
  { hora: '15:00', ansiedad: 50,  indignacion: 80,  correccion: 0  },
  { hora: '16:00', ansiedad: 35,  indignacion: 90,  correccion: 0  },
  { hora: '17:00', ansiedad: 25,  indignacion: 92,  correccion: 2  },
  { hora: '18:00', ansiedad: 20,  indignacion: 88,  correccion: 5  },
  { hora: '19:00', ansiedad: 15,  indignacion: 80,  correccion: 10 },
  { hora: '20:00', ansiedad: 12,  indignacion: 70,  correccion: 18 },
  { hora: '21:00', ansiedad: 10,  indignacion: 60,  correccion: 25 },
  { hora: '22:00', ansiedad: 8,   indignacion: 50,  correccion: 30 },
  { hora: '23:00', ansiedad: 6,   indignacion: 42,  correccion: 34 },
  { hora: '00:00', ansiedad: 5,   indignacion: 38,  correccion: 38 },
  { hora: '06:00', ansiedad: 3,   indignacion: 25,  correccion: 45 },
  { hora: '12:00+1', ansiedad: 2, indignacion: 15,  correccion: 52 },
];

const EVENTS = [
  { hora: '14:00', label: 'Matrioska', color: '#f59e0b' },
  { hora: '18:00', label: 'Comparecencia', color: '#3b82f6' },
  { hora: '20:00', label: 'REE descarta ciberataque', color: '#10b981' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const labels = {
    ansiedad:    { emoji: '😰', text: 'Ansiedad / incertidumbre' },
    indignacion: { emoji: '🤬', text: 'Indignación política'     },
    correccion:  { emoji: '📘', text: 'Análisis técnico'         },
  };
  return (
    <div style={{
      background: 'var(--chart-bg, rgba(10,15,30,0.97))',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8, padding: '8px 12px',
      fontFamily: 'monospace', fontSize: 12,
    }}>
      <div style={{ color: '#94a3b8', marginBottom: 6, fontSize: 11 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 3 }}>
          {labels[p.dataKey]?.emoji} {labels[p.dataKey]?.text}: <strong>{p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

function SentimentAnalyzerInner() {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '1.25rem',
    }}>
      <h4 style={{ margin: '0 0 0.25rem', color: '#e2e8f0', fontSize: 14 }}>
        Evolución del sentimiento en X — primeras 24 horas del 28-A
      </h4>
      <p style={{ margin: '0 0 1rem', fontSize: 11, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
        Volumen relativo estimado (%) · Basado en análisis cualitativo de hashtags virales y comunicados oficiales
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={DATA} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <defs>
            <linearGradient id="gradAnsiedad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradIndignacion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradCorreccion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="hora"
            tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--text-1, #64748b)' }}
            angle={-35}
            textAnchor="end"
            height={55}
          />
          <YAxis
            tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--text-1, #64748b)' }}
            tickFormatter={v => `${v}%`}
            domain={[0, 100]}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 8, color: '#94a3b8' }}
            formatter={(value) => {
              const m = { ansiedad: '😰 Ansiedad', indignacion: '🤬 Indignación', correccion: '📘 Corrección técnica' };
              return m[value] || value;
            }}
          />

          {/* Líneas de referencia de eventos clave */}
          {EVENTS.map(ev => (
            <ReferenceLine
              key={ev.hora}
              x={ev.hora}
              stroke={ev.color}
              strokeDasharray="4 3"
              label={{ value: ev.label, position: 'top', fontSize: 9,
                       fontFamily: 'monospace', fill: ev.color }}
            />
          ))}

          <Area
            type="monotone" dataKey="ansiedad"
            stroke="#8b5cf6" fill="url(#gradAnsiedad)"
            strokeWidth={2}
          />
          <Area
            type="monotone" dataKey="indignacion"
            stroke="#ef4444" fill="url(#gradIndignacion)"
            strokeWidth={2}
          />
          <Area
            type="monotone" dataKey="correccion"
            stroke="#10b981" fill="url(#gradCorreccion)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p style={{
        margin: '0.75rem 0 0', fontSize: 10, color: '#374151',
        fontFamily: 'monospace', fontStyle: 'italic', textAlign: 'center',
      }}>
        Simulación basada en análisis cualitativo de tuits virales, tendencias de hashtags y momentos
        de los comunicados oficiales. La curva de corrección técnica refleja la asimetría algorítmica:
        nunca alcanza el pico de la indignación.
      </p>
    </div>
  );
}

export default function SentimentAnalyzer() {
  return (
    <BrowserOnly fallback={
      <div style={{ height: 200, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--text-1, #64748b)',
                    fontFamily: 'monospace', fontSize: 13 }}>
        Cargando análisis de sentimiento…
      </div>
    }>
      {() => <SentimentAnalyzerInner />}
    </BrowserOnly>
  );
}
