import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { AlertTriangle } from 'lucide-react';
import styles from './Bloque2MixGeneracion.module.css';

const GENERATION_DATA = [
  { id: 'solar', name: 'Solar fotovoltaica', mw: 19155, percentage: 65, color: '#EF9F27' },
  { id: 'nuclear', name: 'Nuclear', mw: 3870, percentage: 13, color: '#378ADD' },
  { id: 'wind', name: 'Eólica', mw: 3540, percentage: 12, color: '#5DCAA5' },
  { id: 'hydro', name: 'Hidráulica', mw: 2000, percentage: 7, color: '#888780' },
  { id: 'ccgt', name: 'CCGT (gas)', mw: 990, percentage: 3, color: '#D85A30' }
];

export default function Bloque2MixGeneracion() {
  return (
    <div className={styles.generationMix}>
      <div className={styles.alertBox}>
        <AlertTriangle className={styles.alertIcon} />
        <div className={styles.alertText}>
          <strong>ALERTA DE SISTEMA:</strong> A las 12:30 CEST, el 82% de la generación activa provenía de inversores electrónicos de potencia (modo grid-following). Sólo el 18% (nuclear, hidráulica y CCGT) aportaba inercia mecánica genuina al sistema, resultando en una constante H crítica de ~2.3s.
        </div>
      </div>

      <div className={styles.generationContainer}>
        <div className={styles.generationLeft}>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GENERATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="mw"
                  stroke="none"
                >
                  {GENERATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => [`${value.toLocaleString('es-ES')} MW`, 'Potencia']}
                  contentStyle={{ backgroundColor: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)', borderRadius: '4px', color: 'var(--color-text-primary)' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.chartLegend}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                <span>{item.name} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.generationRight}>
          <div className={styles.tableHeader}>
            <div className={styles.tableColTech}>TECNOLOGÍA</div>
            <div className={styles.tableColBar}>DISTRIBUCIÓN</div>
            <div className={styles.tableColValue}>POTENCIA</div>
          </div>
          
          <div className={styles.tableRows}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.tableRowTech}>{item.name}</div>
                <div className={styles.tableRowBarContainer}>
                  <div 
                    className={styles.tableRowBar} 
                    style={{ backgroundColor: item.color, width: `${item.percentage}%` }}
                  />
                  <div className={styles.tableRowPercentage}>{item.percentage}%</div>
                </div>
                <div className={styles.tableRowValue}>{item.mw.toLocaleString('es-ES')} MW</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.generationFooter}>
        <p>Datos extraídos de REE ESIOS a las 12:30 CEST, 28/04/2025 (10 minutos antes del incidente).</p>
      </div>
    </div>
  );
}
