import React, { useState, useEffect } from 'react';
import styles from './AnimatedMap.module.css';

// Approximate relative positions on a 100x100 grid for the Iberian Peninsula
// Top Left: 0,0 (Galicia), Bottom Right: 100,100 (Almeria)
const nodes = [
  { id: 'segovia', name: 'Segovia', x: 45, y: 35, time: 2, event: 'Oscilaciones precursoras (12:32:00)' },
  { id: 'badajoz', name: 'Badajoz', x: 25, y: 65, time: 4, event: 'Alerta Tap-Lag (12:32:45)' },
  { id: 'granada', name: 'Granada', x: 60, y: 85, time: 6, event: 'Disparo Raíz (12:32:56)' },
  { id: 'sevilla', name: 'Sevilla', x: 35, y: 80, time: 8, event: 'Propagación de Sobretensión (12:33:05)' },
  { id: 'huelva', name: 'Huelva', x: 25, y: 85, time: 9, event: 'Desconexión Fotovoltaica (12:33:10)' },
  { id: 'carmona', name: 'Carmona', x: 40, y: 82, time: 10, event: 'Pérdida de Reactiva (12:33:15)' },
  { id: 'francia', name: 'Interconexión FR', x: 80, y: 15, time: 12, event: 'Pérdida de Sincronismo (12:33:21)' }
];

export default function AnimatedMap({ lang = 'es' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const isEn = lang === 'en';

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 14) {
            setIsPlaying(false);
            return 14;
          }
          return prev + 1;
        });
      }, 800); // 800ms per simulated "tick"
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.controls}>
        <button 
          className="button button--primary" 
          onClick={handlePlay} 
          disabled={isPlaying}
        >
          {isPlaying 
            ? (isEn ? 'Simulating Collapse...' : 'Simulando Colapso...') 
            : (isEn ? '▶ Play Cascade Sequence' : '▶ Simular Cascada')}
        </button>
        <span className={styles.timer}>
          {isEn ? 'Time: ' : 'Tiempo: '} T+ {currentTime}s
        </span>
      </div>

      <div 
        className={styles.mapArea}
        style={{ 
          backgroundImage: `url('/img/iberian_satellite.png')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundColor: '#050505'
        }}
      >

        {nodes.map(node => {
          const isActive = currentTime >= node.time;
          return (
            <div 
              key={node.id}
              className={`${styles.node} ${isActive ? styles.activeNode : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={styles.pulse}></div>
              <div className={styles.nodeLabel}>
                <strong>{node.name}</strong>
                {isActive && <span className={styles.nodeEvent}>{node.event}</span>}
              </div>
            </div>
          );
        })}

        {/* Draw connections when nodes are active */}
        <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none">
          {currentTime >= 8 && <line x1="60" y1="85" x2="35" y2="80" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 9 && <line x1="35" y1="80" x2="25" y2="85" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 10 && <line x1="35" y1="80" x2="40" y2="82" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 12 && <line x1="40" y1="82" x2="80" y2="15" stroke="red" strokeWidth="0.5" className={styles.animLine} strokeDasharray="1 1" />}
        </svg>
      </div>
      
      <div className={styles.caption}>
        {isEn 
          ? "Abstract topological map of the overvoltage propagation and disconnection cascade across the Iberian network."
          : "Mapa topológico abstracto de la propagación de la sobretensión y cascada de desconexiones en la red ibérica."}
      </div>
    </div>
  );
}
