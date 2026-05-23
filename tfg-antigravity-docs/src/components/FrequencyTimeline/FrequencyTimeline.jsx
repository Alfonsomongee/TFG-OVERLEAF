import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, ReferenceArea, ComposedChart, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GlitchTitle from '../GlitchTitle';
import styles from './FrequencyTimeline.module.css';

const FrequencyTimeline = () => {
  const [freqData, setFreqData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1800);
  const [filteredData, setFilteredData] = useState([]);
  const [showCriticalPhaseOnly, setShowCriticalPhaseOnly] = useState(false);
  const playbackIntervalRef = useRef(null);

  const dataUrl = useBaseUrl('/data/frequency_28A.json');

  // Load frequency data on mount
  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((data) => {
        // Normalize time display and compute ROCOF
        const processedData = data.map((point, idx) => ({
          ...point,
          rocof: idx > 0 ? Math.abs(data[idx].freq - data[idx - 1].freq) / (data[idx].t - data[idx - 1].t) : 0,
          status: point.freq > 49.8 ? 'NORMAL' : 
                  point.freq > 49.0 ? 'UFLS ACTIVE' :
                  point.freq > 48.0 ? 'CRITICAL' :
                  point.freq > 0 ? 'COLLAPSE' : 'BLACKOUT'
        }));
        setFreqData(processedData);
        setFilteredData(showCriticalPhaseOnly ? processedData.filter(d => d.t >= -27) : processedData);
      })
      .catch((err) => console.error('Error loading frequency data:', err));
  }, [showCriticalPhaseOnly]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    playbackIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 0) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1; // Advance 1 second per tick
      });
    }, 1000); // 1 second per iteration (real-time)

    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentTime >= 0) setCurrentTime(-1800); // Reset
    setIsPlaying(!isPlaying);
  };

  // Get current data point and interpolate if necessary
  const getCurrentValue = () => {
    const point = freqData.find(d => d.t === currentTime) || 
                  freqData.filter(d => d.t <= currentTime).pop();
    return point || { freq: 50, rocof: 0, status: 'NORMAL', event: '' };
  };

  const current = getCurrentValue();

  return (
    <div className={styles.container}>
      <GlitchTitle text="FRECUENCIA DEL SISTEMA — 28 ABRIL 2025" />
      <p className={styles.subtitle}>
        Reconstrucción basada en datos verificados ENTSO-E / PMU del colapso cascada en 27 segundos
      </p>

      {/* Live Readout Panel */}
      <motion.div 
        className={styles.readoutPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.readoutRow}>
          <span className={styles.label}>Frecuencia:</span>
          <span className={`${styles.value} ${styles.freq}`}>{current.freq.toFixed(2)} Hz</span>
        </div>
        <div className={styles.readoutRow}>
          <span className={styles.label}>ROCOF:</span>
          <span className={styles.value}>{current.rocof.toFixed(3)} Hz/s</span>
        </div>
        <div className={styles.readoutRow}>
          <span className={styles.label}>Estado:</span>
          <span className={`${styles.badge} ${styles[`badge-${current.status.replace(' ', '-')}` ]}`}>
            {current.status}
          </span>
        </div>
        <div className={styles.readoutRow} style={{ marginTop: '10px', fontSize: '0.9em' }}>
          <span className={styles.event}>{current.event}</span>
        </div>
      </motion.div>

      {/* Playback Controls */}
      <div className={styles.controls}>
        <button 
          onClick={handlePlayPause}
          className={styles.playButton}
        >
          {isPlaying ? '⏹ DETENER' : '▶ REPRODUCIR APAGÓN (27s)'}
        </button>
        <label className={styles.checkbox}>
          <input 
            type="checkbox" 
            checked={showCriticalPhaseOnly}
            onChange={(e) => setShowCriticalPhaseOnly(e.target.checked)}
          />
          Mostrar solo fase crítica
        </label>
      </div>

      {/* Main Frequency Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={filteredData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <defs>
            <linearGradient id="freqGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffaa00" />
              <stop offset="50%" stopColor="#ff8800" />
              <stop offset="75%" stopColor="#ff5500" />
              <stop offset="100%" stopColor="#cc1100" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255, 170, 0, 0.4)"
            tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[45, 50.5]}
            stroke="rgba(255, 170, 0, 0.4)"
            tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
            label={{ value: 'FREQUENCY (Hz)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
          />

          {/* Reference lines for thresholds */}
          <ReferenceLine y={50.0} stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="5 5" label={{ value: "NOMINAL", fill: "rgba(255, 255, 255, 0.3)" }} />
          <ReferenceLine y={49.8} stroke="#ffaa00" strokeDasharray="3 3" opacity={0.5} label={{ value: "UFLS THRESHOLD", fill: "#ffaa00" }} />
          <ReferenceLine y={48.0} stroke="#cc1100" strokeDasharray="3 3" opacity={0.5} label={{ value: "COLLAPSE ZONE", fill: "#cc1100" }} />

          {/* Reference zones */}
          <ReferenceArea y1={49.0} y2={49.8} fill="rgba(255, 170, 0, 0.05)" />
          <ReferenceArea y1={48.0} y2={49.0} fill="rgba(255, 85, 0, 0.05)" />
          <ReferenceArea y1={45} y2={48.0} fill="rgba(204, 17, 0, 0.1)" />

          {/* Main frequency line */}
          <Line 
            type="monotone" 
            dataKey="freq" 
            stroke="url(#freqGradient)" 
            dot={false}
            strokeWidth={3}
            isAnimationActive={false}
            name="System Frequency"
          />

          {/* Current time marker (vertical line) */}
          {isPlaying && <ReferenceLine x={getCurrentValue().time} stroke="#ffaa00" strokeWidth={1} opacity={0.8} />}

          <Tooltip 
            contentStyle={{ backgroundColor: '#050403', border: '1px solid rgba(255, 170, 0, 0.4)', borderRadius: '2px', fontFamily: 'monospace' }}
            labelStyle={{ color: 'rgba(255, 210, 150, 0.8)' }}
            itemStyle={{ color: '#ffaa00' }}
            formatter={(value, name) => {
              if (name === 'freq') return [value.toFixed(2) + ' Hz', 'FREQ'];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontFamily: 'monospace', color: 'rgba(255, 210, 150, 0.6)' }} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* ROCOF Secondary Chart */}
      <div className={styles.rocofSection}>
        <h3>Tasa de Cambio de Frecuencia (ROCOF)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 170, 0, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              label={{ value: 'ROCOF (Hz/s)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
            />
            <ReferenceLine y={0.5} stroke="rgba(255, 170, 0, 0.6)" strokeDasharray="3 3" />
            <ReferenceLine y={1.0} stroke="#cc1100" strokeDasharray="3 3" opacity={0.6} />
            <Bar 
              dataKey="rocof" 
              fill="#ffaa00"
              name="ROCOF"
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rocof > 1.0 ? '#cc1100' : entry.rocof > 0.5 ? '#ff5500' : 'rgba(255, 170, 0, 0.4)'} />
              ))}
            </Bar>
            <Tooltip 
              contentStyle={{ backgroundColor: '#050403', border: '1px solid rgba(255, 170, 0, 0.4)', borderRadius: '2px', fontFamily: 'monospace' }}
              labelStyle={{ color: 'rgba(255, 210, 150, 0.8)' }}
              itemStyle={{ color: '#ffaa00' }}
              formatter={(value) => [value.toFixed(3) + ' Hz/s', 'ROCOF']}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Event Annotations */}
      <div className={styles.eventsSection}>
        <h3>Eventos Principales</h3>
        <div className={styles.eventsList}>
          {freqData.filter(d => d.event_type && d.event_type !== 'normal').map((point, idx) => (
            <div key={idx} className={`${styles.eventCard} ${styles[`event-${point.event_type}`]}`}>
              <span className={styles.eventTime}>{point.time}</span>
              <span className={styles.eventDesc}>{point.event}</span>
              <span className={styles.eventFreq}>{point.freq.toFixed(2)} Hz</span>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Context */}
      <div className={styles.context}>
        <h3>Contexto Técnico</h3>
        <p>
          El apagón del 28 de abril fue un colapso <strong>impulsado por sobretensión</strong>, no por subfrecuencia.
          La pérdida de 2,200 MW de generación renovable en el sur de España eliminó una sumidero de potencia reactiva.
          Simultáneamente, el efecto Ferranti en las líneas de transmisión descargadas causó un pico de voltaje a 435+ kV.
        </p>
        <p>
          La <strong>paradoja del UFLS</strong>: la reducción de carga en el UFLS redujo las corrientes de línea, 
          intensificando el efecto Ferranti y empeorando el colapso de voltaje. La arquitectura de protección legada 
          no podía interpretar correctamente las firmas de falta distorsionadas de recursos basados en inversores.
        </p>
      </div>
    </div>
  );
};

export default FrequencyTimeline;
