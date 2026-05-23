import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './GenerationMixWidget.module.css';

const GenerationMixWidget = () => {
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/generation_mix_28A.json');

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading generation mix data:', err);
        setHasError(true);
      });
  }, [dataUrl]);

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.errorBox}>
          <h3>CRITICAL ERROR: GENERATION MIX DATA OFFLINE</h3>
        </div>
      </div>
    );
  }

  if (!data) return <div className={styles.container}>Loading...</div>;

  const chartData = data.generation_mix.map(item => ({
    name: item.technology.split(' (')[0], // Simplify names
    value: item.capacity_mw,
    inertia: item.inertia_constant_h_seconds,
    type: item.grid_interaction_type.includes('inverters') ? 'ibr' : 'sync'
  }));

  // Forensic Amber Palette
  const COLORS = {
    ibr: ['#ff5500', '#ffaa00'],
    sync: ['#0077ff', '#0044aa', '#002255'] // Distinct color for synchronous
  };

  let ibrCount = 0;
  let syncCount = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>GENERATION MIX & INERTIA DEFICIT</h3>
        <p className={styles.subtitle}>12:30 CEST — Pre-Collapse State</p>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => {
                  const colorList = entry.type === 'ibr' ? COLORS.ibr : COLORS.sync;
                  const colorIndex = entry.type === 'ibr' ? ibrCount++ : syncCount++;
                  return <Cell key={`cell-${index}`} fill={colorList[colorIndex % colorList.length]} />;
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#050403', border: '1px solid rgba(255, 170, 0, 0.4)', borderRadius: '2px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#ffaa00' }}
                formatter={(value, name, props) => [`${value} MW (H=${props.payload.inertia}s)`, name]}
              />
              <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255, 210, 150, 0.8)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>RENEWABLE PENETRATION</div>
            <div className={styles.statValue}>{data.renewable_penetration_percent}%</div>
            <div className={styles.statSub}>Inverter-Based Resources (IBR)</div>
          </div>
          
          <div className={styles.statBox}>
            <div className={styles.statLabel}>SYSTEM INERTIA (H)</div>
            <div className={`${styles.statValue} ${styles.critical}`}>{data.equivalent_system_inertia_h_weighted}s</div>
            <div className={styles.statSub}>Critically Low (Safe > 4.5s)</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>INERTIA DEGRADATION</div>
            <div className={`${styles.statValue} ${styles.warning}`}>-{data.inertia_degradation_percent}%</div>
            <div className={styles.statSub}>Compared to historical spring avg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationMixWidget;
