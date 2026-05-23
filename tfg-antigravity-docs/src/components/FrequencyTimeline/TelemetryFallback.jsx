import React from 'react';
import styles from './FrequencyTimeline.module.css';

const TelemetryFallback = () => {
  return (
    <div className={styles.container} style={{ minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className={styles.skeletonPulse} style={{ width: '80%', height: '40px', background: 'rgba(255, 170, 0, 0.1)', marginBottom: '20px', borderRadius: '4px' }}></div>
      <div className={styles.skeletonPulse} style={{ width: '100%', height: '400px', background: 'rgba(255, 170, 0, 0.05)', marginBottom: '20px', borderRadius: '4px' }}></div>
      <div className={styles.skeletonPulse} style={{ width: '100%', height: '200px', background: 'rgba(255, 170, 0, 0.05)', borderRadius: '4px' }}></div>
      <div style={{ marginTop: '20px', color: 'rgba(255, 170, 0, 0.5)', fontFamily: 'monospace', letterSpacing: '2px' }}>
        LOADING TELEMETRY DATA...
      </div>
    </div>
  );
};

export default TelemetryFallback;
