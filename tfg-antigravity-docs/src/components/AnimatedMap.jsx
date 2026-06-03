import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useEffect } from 'react';
import styles from './AnimatedMap.module.css';

// Approximate relative positions on a 100x100 grid for the Iberian Peninsula
// Top Left: 0,0 (Galicia), Bottom Right: 100,100 (Almeria)
const getNodes = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { id: 'segovia', name: 'Segovia', x: 45, y: 35, time: 2, event: t('Oscilaciones precursoras', 'Precursor oscillations', 'Oscilações precursoras', 'Oscillations précurseurs', 'Oscillazioni precursori', 'Vorläufer-Oszillationen') + ' (12:32:00)' },
    { id: 'badajoz', name: 'Badajoz', x: 25, y: 65, time: 4, event: t('Alerta Tap-Lag', 'Tap-Lag Alert', 'Alerta Tap-Lag', 'Alerte Tap-Lag', 'Allarme Tap-Lag', 'Tap-Lag-Alarm') + ' (12:32:45)' },
    { id: 'granada', name: 'Granada', x: 60, y: 85, time: 6, event: t('Disparo Raíz', 'Root Trip', 'Disparo Raiz', 'Déclenchement Racine', 'Scatto Radice', 'Wurzel-Auslösung') + ' (12:32:56)' },
    { id: 'sevilla', name: 'Sevilla', x: 35, y: 80, time: 8, event: t('Propagación de Sobretensión', 'Overvoltage Propagation', 'Propagação de Sobretensão', 'Propagation de Surtension', 'Propagazione della Sovratensione', 'Überspannungsausbreitung') + ' (12:33:05)' },
    { id: 'huelva', name: 'Huelva', x: 25, y: 85, time: 9, event: t('Desconexión Fotovoltaica', 'PV Disconnection', 'Desconexão Fotovoltaica', 'Déconnexion Photovoltaïque', 'Disconnessione Fotovoltaica', 'PV-Trennung') + ' (12:33:10)' },
    { id: 'carmona', name: 'Carmona', x: 40, y: 82, time: 10, event: t('Pérdida de Reactiva', 'Reactive Power Loss', 'Perda de Reativa', 'Perte de Puissance Réactive', 'Perdita di Potenza Reattiva', 'Blindleistungsverlust') + ' (12:33:15)' },
    { id: 'francia', name: t('Interconexión FR', 'FR Interconnection', 'Interconexão FR', 'Interconnexion FR', 'Interconnessione FR', 'FR-Verbindungsleitung'), x: 80, y: 15, time: 12, event: t('Pérdida de Sincronismo', 'Loss of Synchronism', 'Perda de Sincronismo', 'Perte de Synchronisme', 'Perdita di Sincronismo', 'Synchronisationsverlust') + ' (12:33:21)' }
  ];
};

export default function AnimatedMap({}) {
  const lang = useDocLang();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const nodes = getNodes(lang);
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { sim: 'Simulating Collapse...', play: '▶ Play Cascade Sequence', time: 'Time: ', caption: 'Abstract topological map of the overvoltage propagation and disconnection cascade across the Iberian network.' };
      case 'pt': return { sim: 'Simulando Colapso...', play: '▶ Simular Cascata', time: 'Tempo: ', caption: 'Mapa topológico abstrato da propagação de sobretensão e cascata de desconexões na rede ibérica.' };
      case 'fr': return { sim: 'Simulation en cours...', play: '▶ Simuler la Cascade', time: 'Temps : ', caption: 'Carte topologique abstraite de la propagation des surtensions et de la cascade de déconnexions sur le réseau ibérique.' };
      case 'it': return { sim: 'Simulazione Collasso...', play: '▶ Simula Cascata', time: 'Tempo: ', caption: 'Mappa topologica astratta della propagazione delle sovratensioni e della cascata di disconnessioni nella rete iberica.' };
      case 'de': return { sim: 'Kollaps wird simuliert...', play: '▶ Kaskade Simulieren', time: 'Zeit: ', caption: 'Abstrakte topologische Karte der Überspannungsausbreitung und Kaskadenabschaltungen im iberischen Netz.' };
      default: return { sim: 'Simulando Colapso...', play: '▶ Simular Cascada', time: 'Tiempo: ', caption: 'Mapa topológico abstracto de la propagación de la sobretensión y cascata de desconexiones en la red ibérica.' };
    }
  };
  const strings = getStrings(lang);

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
          {isPlaying ? strings.sim : strings.play}
        </button>
        <span className={styles.timer}>
          {strings.time} T+ {currentTime}s
        </span>
      </div>

      <div 
        className={styles.mapArea}
        style={{ 
          backgroundImage: `url('/img/iberian_satellite.webp')`, 
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
        {strings.caption}
      </div>
    </div>
  );
}
