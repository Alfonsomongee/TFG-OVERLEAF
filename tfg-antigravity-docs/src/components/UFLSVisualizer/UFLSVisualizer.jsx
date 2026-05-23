import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './UFLSVisualizer.module.css';

const UFLSVisualizer = () => {
  const [data, setData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/ufls_scheme_iberia.json');

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        const formattedData = json.stages.map(stage => ({
          name: `Stage ${stage.stage}`,
          freq: stage.frequency_hz,
          shed_es: stage.load_shed_mw_spain,
          shed_pt: stage.load_shed_mw_portugal,
          total_shed: stage.load_shed_mw_spain + stage.load_shed_mw_portugal,
          zones: stage.zones_affected.join(', ')
        }));
        setData(formattedData);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading UFLS data:', err);
        setHasError(true);
      });
  }, [dataUrl]);

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.errorBox}>
          <h3>CRITICAL ERROR: UFLS DATA OFFLINE</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>UFLS ACTIVATION CASCADING SCHEME</h3>
      <p className={styles.subtitle}>Load Shedding Stages vs Frequency Decline</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 170, 0, 0.1)" horizontal={false} />
          <XAxis type="number" stroke="rgba(255, 170, 0, 0.4)" tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }} />
          <YAxis dataKey="name" type="category" stroke="rgba(255, 170, 0, 0.4)" tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#050403', border: '1px solid rgba(255, 170, 0, 0.4)', borderRadius: '2px', fontFamily: 'monospace' }}
            labelStyle={{ color: 'rgba(255, 210, 150, 0.8)' }}
            itemStyle={{ color: '#ffaa00' }}
            cursor={{fill: 'rgba(255, 170, 0, 0.05)'}}
          />
          <Bar dataKey="total_shed" name="MW Shed" fill="#ffaa00" barSize={20}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.freq <= 49.0 && entry.freq > 48.8 ? '#cc1100' : 'rgba(255, 170, 0, 0.3)'} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: '#cc1100' }}></span>
          <span>Stage 1 (Activated at 49.0 Hz - Triggered Overvoltage Cascade)</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: 'rgba(255, 170, 0, 0.3)' }}></span>
          <span>Stages 2-6 (Did not activate before collapse)</span>
        </div>
      </div>
    </div>
  );
};

export default UFLSVisualizer;
