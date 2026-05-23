import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InterconnectionDashboard.module.css';
import { interconnectionData } from '../data/interconnectionData';

export default function InterconnectionDashboard({ lang }) {
  const isEs = lang === 'es' || !lang;

  // Custom tooltip compartido
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Encontrar el evento para este año
      const yearData = interconnectionData.find(d => d.anio === label);
      
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipTitle}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color, margin: '4px 0', fontSize: '0.9rem' }}>
              <strong>{p.name}:</strong> {p.value.toLocaleString()} {p.name.includes('%') ? '%' : (p.name.includes('MW') ? 'MW' : 'GWh')}
            </div>
          ))}
          {yearData && (yearData.evento || yearData.evento_en) && (
            <div className={styles.tooltipEvent}>
              {isEs ? yearData.evento : yearData.evento_en}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h3>{isEs ? 'Estrangulamiento de Interconexiones' : 'Interconnection Bottleneck'}</h3>
        <p>{isEs ? 'Evolución del sistema eléctrico ibérico (2015-2025)' : 'Evolution of the Iberian grid (2015-2025)'}</p>
      </div>

      <div className={styles.grid}>
        
        {/* Gráfico 1: Exportaciones vs Importaciones vs Saldo */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h4 className={styles.cardTitle}>{isEs ? 'Intercambios Internacionales (GWh)' : 'International Exchanges (GWh)'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Volumen anual de exportaciones, importaciones y saldo neto' : 'Annual volume of exports, imports, and net balance'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={interconnectionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="anio" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="exportacion_gwh" name={isEs ? 'Exportación' : 'Export'} fill="#00f0ff" barSize={20} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="importacion_gwh" name={isEs ? 'Importación' : 'Import'} fill="#f472b6" barSize={20} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="saldo_neto_gwh" name={isEs ? 'Saldo Neto' : 'Net Balance'} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

        {/* Gráfico 2: Fragilidad (Potencia Instalada vs Ratio de Interconexión) */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>{isEs ? 'Fragilidad Estructural' : 'Structural Fragility'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Crecimiento de potencia renovable frente a la caída del ratio de interconexión (Target UE: 15%)' : 'Renewable power growth vs dropping interconnection ratio (EU Target: 15%)'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={interconnectionData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="anio" stroke="#94a3b8" />
                      <YAxis yAxisId="left" stroke="#94a3b8" domain={['dataMin - 10000', 'dataMax + 10000']} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[0, 5]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="potencia_instalada_total_mw" name={isEs ? 'Potencia Total Instalada' : 'Total Installed Power'} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <Line yAxisId="right" type="stepAfter" dataKey="ratio_interconexion_pct" name={isEs ? 'Ratio Interconexión (%)' : 'Interconnection Ratio (%)'} stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

        {/* Gráfico 3: Capacidad Constante (Anillo estático temporal) */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>{isEs ? 'Capacidad Fronteriza Bloqueada' : 'Locked Border Capacity'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Capacidad máxima de importación física (estancada en 4,200 MW durante toda la década)' : 'Maximum physical import capacity (stagnant at 4,200 MW throughout the decade)'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                // Tomamos un año cualquiera ya que es estático
                const data2025 = [
                  { name: 'Francia', value: 2800 },
                  { name: 'Portugal', value: 1200 },
                  { name: 'Marruecos', value: 200 }
                ];
                const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data2025}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data2025.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#3b82f6', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

      </div>
    </div>
  );
}
