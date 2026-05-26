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
  const [activeUnits, setActiveUnits] = useState(null);
  const [expectedGen, setExpectedGen] = useState(null);
  const [genByFuel, setGenByFuel] = useState(null);
  const [statusSummary, setStatusSummary] = useState(null);
  const [syncVsIbr, setSyncVsIbr] = useState(null);
  const [view, setView] = useState('fuel');

  useEffect(() => {
    fetch('/data/entsoe/active_units_top20.json').then(r => r.json()).then(j => setActiveUnits(j.data));
    fetch('/data/entsoe/generation_by_fuel_type_with_expected.json').then(r => r.json()).then(j => setExpectedGen(j.data));
    fetch('/data/entsoe/generation_by_fuel_type.json').then(r => r.json()).then(j => setGenByFuel(j.data));
    fetch('/data/entsoe/technology_status_summary.json').then(r => r.json()).then(j => setStatusSummary(j.data));
    fetch('/data/entsoe/sync_vs_ibr.json').then(r => r.json()).then(j => setSyncVsIbr(j.data));
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
      {/* Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div>
          <strong>Vista (TR 16.1.A):&nbsp;</strong>
          <select
            value={view}
            onChange={e => setView(e.target.value)}
            style={{
              padding: '6px 10px', borderRadius: '6px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              backgroundColor: 'var(--ifm-background-surface-color)',
              color: 'var(--ifm-font-color-base)', width: '320px'
            }}
          >
            <option value="fuel">1. Mix de Generación Real (Por Tipo)</option>
            <option value="top20">2. Top 20 Unidades Activas</option>
            <option value="status">3. Estado de Unidades (Activas vs Caídas)</option>
            <option value="sync">4. Inercia Síncrona vs Inversores (IBR)</option>
            <option value="expected">5. Comparativa Real vs Previsto</option>
          </select>
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
              <Bar dataKey="total_mw" name="Potencia Real Agregada (MW)">
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
              <Bar dataKey="power_mw" name="Potencia Real (MW)">
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
              <Bar dataKey="active_units" stackId="a" name="Activas (>0 MW)" fill="#10b981" />
              <Bar dataKey="zero_units" stackId="a" name="Caídas (0 MW)" fill="#ef4444" />
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
              <Bar dataKey="real_mw" name="Real (MW)" fill="#ef4444" />
              <Bar dataKey="expected_mw" name="Previsto (MW)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
