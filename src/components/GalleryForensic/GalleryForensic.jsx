// src/components/GalleryForensic/GalleryForensic.jsx
/**
 * GALERÍA FORENSE — 28-A ABRIL 2025
 * 
 * Componente principal para navegación de tablas y gráficos del incidente.
 * Estructura: categorías → tablas dentro → expandible para ver datos/gráficos
 * 
 * Indicadores:
 * - Estabilidad de Frecuencia (⚡)
 * - Violaciones de Tensión (⚠️)
 * - Estructura de Red (🔗)
 * - Demanda y Carga (📊)
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './GalleryForensic.module.css';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOADER
// ═══════════════════════════════════════════════════════════════════════════════

function useGalleryData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // En producción, estos datos vivirían en /static/data/ o se cargarían desde API
        // Por ahora, creamos datos de demostración
        const demoData = {
          categories: [
            {
              id: 'frequency-stability',
              name: 'Estabilidad de Frecuencia',
              icon: '⚡',
              color: 'hsl(190 100% 60%)',
              tables: [
                {
                  id: 'inertia-distribution',
                  name: 'Distribución de Inercia a las 12:00 CEST',
                  source: 'Informe ICAI Tabla 4-1',
                  type: 'table',
                  data: [
                    { area: 'NOROESTE', nuclear: 0, combined: 3714, coal: 1746, hydro: 6652, total: 12111, inertia_s: 3.84 },
                    { area: 'NORTE', nuclear: 0, combined: 2995, coal: 0, hydro: 7843, total: 10837, inertia_s: 3.02 },
                    { area: 'ESTE', nuclear: 9642, combined: 0, coal: 0, hydro: 4105, total: 13747, inertia_s: 2.33 },
                    { area: 'CENTRO', nuclear: 2906, combined: 8875, coal: 0, hydro: 4204, total: 15984, inertia_s: 1.84 },
                    { area: 'SUR', nuclear: 0, combined: 2881, coal: 0, hydro: 1535, total: 4417, inertia_s: 1.30 },
                    { area: 'TOTAL', nuclear: 12547, combined: 18465, coal: 1746, hydro: 24339, total: 57097, inertia_s: 2.31 },
                  ],
                  columns: ['area', 'nuclear', 'combined', 'coal', 'hydro', 'total', 'inertia_s'],
                },
              ],
            },
            {
              id: 'voltage-violations',
              name: 'Violaciones de Tensión y Criterios ICS',
              icon: '⚠️',
              color: 'hsl(38 100% 56%)',
              tables: [
                {
                  id: 'ics-violations',
                  name: 'Criterios ICS Violados (Tabla 7-1)',
                  source: 'Informe ENTSO-E',
                  type: 'table',
                  data: [
                    { criterion: 'OB', scale: 3, re: '✓', ren: '✓', rte: '—' },
                    { criterion: 'L', scale: 2, re: '✓', ren: '✓', rte: '—' },
                    { criterion: 'T', scale: 2, re: '✓', ren: '—', rte: '—' },
                    { criterion: 'T', scale: 0, re: '✓', ren: '✓', rte: '✓' },
                    { criterion: 'G', scale: 2, re: '✓', ren: '✓', rte: '—' },
                    { criterion: 'RS', scale: 2, re: '✓', ren: '✓', rte: '—' },
                    { criterion: 'OV', scale: 1, re: '—', ren: '—', rte: '✓' },
                  ],
                  columns: ['criterion', 'scale', 're', 'ren', 'rte'],
                  note: '✓ = Violado | — = No violado',
                },
              ],
            },
            {
              id: 'demand-load',
              name: 'Demanda y Recuperación',
              icon: '📊',
              color: 'hsl(40 95% 50%)',
              tables: [
                {
                  id: 'demand-timeseries',
                  name: 'Demanda Real Peninsular (27-29 abril)',
                  source: 'ESIOS REE — 5 minutos de resolución',
                  type: 'chart',
                  dataUrl: '/data/28A_demand.json',
                  chartConfig: {
                    dataKey: 'demand_real',
                    stroke: 'hsl(190 100% 60%)',
                    fill: 'hsl(190 100% 60% / 0.1)',
                    referenceLines: [
                      { value: 25200, label: '28-A 12:30', stroke: 'hsl(38 100% 56%)' },
                      { value: 0, label: 'Blackout', stroke: 'hsl(0 75% 56%)' },
                    ],
                  },
                },
              ],
            },
          ],
        };
        setData(demoData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function TableView({ tableConfig }) {
  const [expanded, setExpanded] = useState(false);

  if (!tableConfig.data || tableConfig.data.length === 0) {
    return (
      <div className={styles.tableEmpty}>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const headers = tableConfig.columns;
  const rows = tableConfig.data;

  return (
    <div className={styles.tableContainer}>
      <button
        className={styles.tableToggle}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▼' : '▶'} {rows.length} filas
      </button>
      {expanded && (
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                {headers.map(h => (
                  <th key={h}>{formatHeaderName(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {headers.map(h => (
                    <td key={h} className={row[h] === '✓' ? styles.cellViolated : ''}>
                      {formatCellValue(row[h])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {tableConfig.note && (
            <p className={styles.tableNote}>{tableConfig.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

function ChartView({ tableConfig }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      try {
        if (tableConfig.chartData) {
          setChartData(tableConfig.chartData);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading chart data:', err);
        setLoading(false);
      }
    }
    loadChartData();
  }, [tableConfig]);

  if (loading) {
    return <div className={styles.chartLoading}>Cargando gráfico...</div>;
  }

  if (!chartData || chartData.length === 0) {
    return <div className={styles.chartEmpty}>No hay datos para graficar</div>;
  }

  const config = tableConfig.chartConfig || {};

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="datetime"
            tick={{ fontSize: 11, fill: 'hsl(220 12% 55%)' }}
            interval={Math.floor(chartData.length / 10)}
          />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(220 12% 55%)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220 40% 7%)',
              border: '1px solid hsl(190 100% 60% / 0.3)',
              borderRadius: '8px',
            }}
            formatter={(value) => [value.toLocaleString('es-ES'), 'MW']}
          />
          {config.referenceLines?.map((refLine, idx) => (
            <ReferenceLine
              key={idx}
              y={refLine.value}
              stroke={refLine.stroke}
              strokeDasharray="6 3"
              label={{ value: refLine.label, fill: refLine.stroke, fontSize: 10 }}
            />
          ))}
          <Line
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.stroke || 'hsl(190 100% 60%)'}
            fill={config.fill || 'hsl(190 100% 60% / 0.1)'}
            dot={false}
            name="Demanda"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className={styles.chartCaption}>
        Demanda peninsular real en MW. Resolución: 5 minutos. Línea ámbar: condición del 28-A a las 12:30 CEST.
      </p>
    </div>
  );
}

function CategorySection({ category }) {
  const [expandedTable, setExpandedTable] = useState(null);

  return (
    <div className={styles.categorySection}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryIcon}>{category.icon}</span>
        <h3 className={styles.categoryTitle}>{category.name}</h3>
      </div>
      <div className={styles.tablesList}>
        {category.tables.map(table => (
          <div key={table.id} className={styles.tableItem}>
            <button
              className={styles.tableHeader}
              onClick={() =>
                setExpandedTable(expandedTable === table.id ? null : table.id)
              }
            >
              <span className={styles.tableIcon}>
                {expandedTable === table.id ? '▼' : '▶'}
              </span>
              <div className={styles.tableInfo}>
                <h4 className={styles.tableName}>{table.name}</h4>
                <p className={styles.tableSource}>{table.source}</p>
              </div>
            </button>
            {expandedTable === table.id && (
              <div className={styles.tableContent}>
                {table.type === 'table' && <TableView tableConfig={table} />}
                {table.type === 'chart' && <ChartView tableConfig={table} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function GalleryForensicInner({ data }) {
  const [activeCategory, setActiveCategory] = useState(data.categories[0]?.id);

  const activeCategoryData = data.categories.find(c => c.id === activeCategory);

  return (
    <div className={styles.gallery}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>📊 Galería Forense — Apagón Ibérico 28-A</h2>
        <p className={styles.subtitle}>
          Tablas y gráficos con datos reales del incidente (ENTSO-E, ICAI, REE, ESIOS)
        </p>
      </div>

      {/* Category Tabs */}
      <div className={styles.tabs}>
        {data.categories.map(cat => (
          <button
            key={cat.id}
            className={`${styles.tab} ${activeCategory === cat.id ? styles.tabActive : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={
              activeCategory === cat.id
                ? { borderBottomColor: cat.color }
                : {}
            }
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Active Category Content */}
      {activeCategoryData && (
        <div className={styles.content}>
          <CategorySection category={activeCategoryData} />
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        Fuentes: Informe Factual ENTSO-E · Informe ICAI · Red Eléctrica de España · ESIOS
      </div>
    </div>
  );
}

export default function GalleryForensic() {
  return (
    <BrowserOnly
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', color: 'hsl(220 12% 55%)' }}>
          Cargando galería forense…
        </div>
      }
    >
      {() => {
        const { data, loading, error } = useGalleryData();

        if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando…</div>;
        if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error: {error}</div>;
        if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}>Sin datos</div>;

        return <GalleryForensicInner data={data} />;
      }}
    </BrowserOnly>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function formatHeaderName(h) {
  const names = {
    area: 'Área',
    nuclear: 'Nuclear (MW)',
    combined: 'Ciclo Combinado (MW)',
    coal: 'Carbón (MW)',
    hydro: 'Hidráulica (MW)',
    total: 'Total (MW)',
    inertia_s: 'Inercia (s)',
    criterion: 'Criterio',
    scale: 'Escala',
    re: 'Red Eléctrica',
    ren: 'REN',
    rte: 'RTE',
    datetime: 'Fecha/Hora',
    demand_real: 'Demanda Real (MW)',
  };
  return names[h] || h;
}

function formatCellValue(v) {
  if (typeof v === 'number') {
    if (Number.isInteger(v)) return v.toLocaleString('es-ES');
    return v.toFixed(2).replace('.', ',');
  }
  return v || '—';
}
