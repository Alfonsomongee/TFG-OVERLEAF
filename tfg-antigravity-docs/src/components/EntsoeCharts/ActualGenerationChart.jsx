import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

const FUEL_COLORS = {
  'Nuclear': '#ef4444',
  'Fossil Gas': '#f97316',
  'Hydro Water Reservoir': '#3b82f6',
  'Hydro Pumped Storage': '#0ea5e9',
  'Wind Onshore': '#10b981',
  'Solar': '#eab308',
  'Fossil Hard coal': '#71717a'
};
const SYNC_COLORS = ['#8b5cf6', '#f43f5e'];

export default function ActualGenerationChart() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const [activeUnits, setActiveUnits] = useState(null);
  const [expectedGen, setExpectedGen] = useState(null);
  const [genByFuel, setGenByFuel] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [syncVsIbr, setSyncVsIbr] = useState(null);
  const [view, setView] = useState('fuel');

  useEffect(() => {
    const controller = new AbortController();
    const opts = { signal: controller.signal };

    Promise.all([
      fetch('/data/entsoe/active_units_top20.json', opts).then(r => r.json()),
      fetch('/data/entsoe/generation_by_fuel_type_with_expected.json', opts).then(r => r.json()),
      fetch('/data/entsoe/generation_by_fuel_type.json', opts).then(r => r.json()),
      fetch('/data/entsoe/technology_status_summary.json', opts).then(r => r.json()),
      fetch('/data/entsoe/sync_vs_ibr.json', opts).then(r => r.json()),
    ])
      .then(([d1, d2, d3, d4, d5]) => {
        if (!controller.signal.aborted) {
          setActiveUnits(d1.data);
          setExpectedGen(d2.data);
          setGenByFuel(d3.data);
          setStatusSummary(d4.data);
          setSyncVsIbr(d5.data);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching generation data:', err);
        }
      });

    return () => controller.abort();
  }, []);

  const loaded = activeUnits && expectedGen && genByFuel && statusSummary && syncVsIbr;

  if (!loaded) {
    return (
      <div style={{ minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', opacity: 0.6 }}>
        Cargando datos...
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: 'var(--ifm-background-surface-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
    color: 'var(--ifm-font-color-base)'
  };

  const tickStyle = { fill: 'var(--ifm-font-color-base)' };

  const isTall = view === 'top20' || view === 'status';

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', background: 'var(--ifm-color-emphasis-100)', padding: '4px', borderRadius: '8px', maxWidth: '800px', justifyContent: 'center' }}>
          {[
            { id: 'fuel', label: '1. Mix Real' },
            { id: 'top20', label: '2. Top 20' },
            { id: 'status', label: '3. Estado' },
            { id: 'sync', label: '4. Inercia' },
            { id: 'expected', label: '5. Real vs Previsto' }
          ].map(opt => (
            <button 
              key={opt.id}
              onClick={() => setView(opt.id)}
              style={{ padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: view === opt.id ? 'var(--ifm-color-primary)' : 'transparent', color: view === opt.id ? '#fff' : 'var(--ifm-color-emphasis-700)', fontWeight: view === opt.id ? 'bold' : 'normal', transition: 'all 0.2s', fontSize: '0.85rem' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart: Mix de Generación Real */}
      {view === 'fuel' && (
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={genByFuel} margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 12 }} width={130} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="total_mw" name={isEs ? "Potencia Real Agregada (MW)" : "Aggregated Actual Power (MW)"}>
                {genByFuel.map((entry, i) => <Cell key={i} fill={FUEL_COLORS[entry.fuel_type] || '#8884d8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Top 20 */}
      {view === 'top20' && (
        <div style={{ height: 620 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={activeUnits} margin={{ top: 10, right: 30, left: 90, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="name" tick={{ ...tickStyle, fontSize: 11 }} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="power_mw" name={isEs ? "Potencia Real (MW)" : "Actual Power (MW)"}>
                {activeUnits.map((entry, i) => <Cell key={i} fill={FUEL_COLORS[entry.fuel_type] || '#8884d8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Estado de Unidades */}
      {view === 'status' && (
        <div style={{ height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={statusSummary} margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" tick={tickStyle} />
              <YAxis type="category" dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 12 }} width={130} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="active_units" stackId="a" name={isEs ? "Activas (>0 MW)" : "Active (>0 MW)"} fill="#10b981" />
              <Bar dataKey="zero_units" stackId="a" name={isEs ? "Caídas (0 MW)" : "Tripped (0 MW)"} fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Síncrona vs IBR */}
      {view === 'sync' && (
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={syncVsIbr}
                cx="50%" cy="45%"
                innerRadius={80} outerRadius={150}
                dataKey="total_mw" nameKey="type"
                label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
              >
                {syncVsIbr.map((entry, i) => <Cell key={i} fill={SYNC_COLORS[i % SYNC_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v => `${v.toLocaleString()} MW`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Chart: Real vs Previsto */}
      {view === 'expected' && (
        <div style={{ height: 420 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expectedGen} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="fuel_type" tick={{ ...tickStyle, fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={tickStyle} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="real_mw" name={isEs ? "Real (MW)" : "Actual (MW)"} fill="#ef4444" />
              <Bar dataKey="expected_mw" name={isEs ? "Previsto (MW)" : "Forecast (MW)"} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
