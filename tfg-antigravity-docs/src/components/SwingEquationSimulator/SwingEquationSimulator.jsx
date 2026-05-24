import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, BarChart, Bar, Cell } from 'recharts';
import GlitchTitle from '../GlitchTitle';
import styles from './SwingEquationSimulator.module.css';
import params from '@site/static/data/swing_equation_params.json';

const SwingEquationSimulator = () => {
  // ============ State: Slider Parameters ============
  const [H, setH] = useState(2.45);          // Inertia constant (seconds)
  const [deltaP_percent, setDeltaP_percent] = useState(8.8); // Generation loss (%)
  const [D, setD] = useState(1.5);           // Damping factor (pu)
  const [syntheticInertia, setSyntheticInertia] = useState(0); // FFR gain
  const [weakGrid, setWeakGrid] = useState(false); // SCR < 2.0 simulation
  const [uflsStages, setUflsStages] = useState(6); // Number of active UFLS stages

  // ============ State: Simulation Control ============
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [frequency, setFrequency] = useState(50.0);
  const [deltaF, setDeltaF] = useState(0);
  const [rocof, setRocof] = useState(0);
  const [historyData, setHistoryData] = useState(() => {
    const initial = [];
    for (let i = -50; i <= 0; i++) {
      initial.push({ time: i / 10, frequency: 50.0, rocof: 0 });
    }
    return initial;
  });
  const [currentUflsStage, setCurrentUflsStage] = useState(0);
  const [systemStatus, setSystemStatus] = useState('NORMAL');
  const [loadShedAmount, setLoadShedAmount] = useState(0); // Total load shed (%) for display

  // ============ Refs ============
  const simulationIntervalRef = useRef(null);
  const freqHistoryRef = useRef([]);
  const previousFreqRef = useRef(50.0);
  const maxUflsStageRef = useRef(0);         // Latching UFLS stage
  const cumulativeShedRef = useRef(0);       // Latching load shed percentage

  // ============ Simulation Engine ============
  const runSimulationStep = (currentH, currentDeltaP_percent, currentD, currentSynth, currentWeakGrid, time) => {
    const DT_MS = 10;
    const DT_S = DT_MS / 1000;
    const F0 = 50.0;
    
    // Convert generation loss (%) to per-unit (negative for deficit)
    let deltaP_pu = -currentDeltaP_percent / 100;
    
    // Get current frequency deviation from state
    const currentDeltaF = deltaF;
    const prevFreq = previousFreqRef.current;
    
    // --- UFLS: determine latching load shed ---
    const uflsThresholds = [
      { freq: 49.0, shed: 15, stage: 1 },
      { freq: 48.7, shed: 15, stage: 2 },
      { freq: 48.4, shed: 10, stage: 3 },
      { freq: 48.0, shed: 10, stage: 4 },
    ];
    
    let newMaxStage = maxUflsStageRef.current;
    let totalShed = cumulativeShedRef.current;
    const currentFreq = F0 * (1 + currentDeltaF);
    
    // Check if any new stage should be activated (latching)
    for (let i = 0; i < Math.min(uflsStages, uflsThresholds.length); i++) {
      if (currentFreq <= uflsThresholds[i].freq && uflsThresholds[i].stage > newMaxStage) {
        newMaxStage = uflsThresholds[i].stage;
        totalShed = uflsThresholds.slice(0, i + 1).reduce((sum, u) => sum + u.shed, 0);
      }
    }
    
    // Update refs and UI state
    maxUflsStageRef.current = newMaxStage;
    cumulativeShedRef.current = totalShed;
    setCurrentUflsStage(newMaxStage);
    setLoadShedAmount(totalShed);
    
    // Add load shedding effect to deltaP (shedding load increases effective power surplus)
    const loadShed_pu = totalShed / 100;
    let effectiveDeltaP = deltaP_pu + loadShed_pu;
    
    // --- Synthetic inertia effect (adds power proportional to -df/dt) ---
    // First compute raw derivative without synth to get df/dt for feedback
    const dDeltaF_dt_raw = (effectiveDeltaP - currentD * currentDeltaF) / (2 * currentH);
    
    if (currentSynth > 0) {
      // Synthetic inertia injects power = -FFR_gain * df/dt
      effectiveDeltaP -= currentSynth * dDeltaF_dt_raw;
      
      // Weak grid oscillation: if weak_grid TRUE and synthetic inertia is high, add subsynchronous oscillation
      if (currentWeakGrid && currentSynth > 2.0) {
        const oscillationAmplitude = 0.5 * currentSynth;
        const oscillationFreq = 0.63; // Hz, matching Granada pre-blackout oscillation
        const phaseShift = 2 * Math.PI * oscillationFreq * time;
        effectiveDeltaP += oscillationAmplitude * Math.sin(phaseShift);
      }
    }
    
    // Recompute derivative with final effectiveDeltaP
    const dDeltaF_dt = (effectiveDeltaP - currentD * currentDeltaF) / (2 * currentH);
    
    // Euler integration
    const newDeltaF = currentDeltaF + dDeltaF_dt * DT_S;
    const newFreq = F0 * (1 + newDeltaF);
    const newRocof = (newFreq - prevFreq) / DT_S;
    
    // Update refs for next step
    previousFreqRef.current = newFreq;
    
    // --- System status badge logic ---
    let status = 'NORMAL';
    if (newFreq >= 49.8) status = 'NORMAL';
    else if (newFreq >= 49.0) status = 'UFLS ACTIVE';
    else if (newFreq >= 48.0) status = 'CRITICAL';
    else status = 'COLLAPSE';
    setSystemStatus(status);
    
    // Update React state
    setDeltaF(newDeltaF);
    setFrequency(newFreq);
    setRocof(newRocof);
    
    // Store data point for charts (time as number)
    const dataPoint = {
      time: time,
      frequency: parseFloat(newFreq.toFixed(3)),
      rocof: parseFloat(newRocof.toFixed(3)),
      deltaF: parseFloat(newDeltaF.toFixed(5)),
      loadShed: totalShed,
    };
    
    freqHistoryRef.current.push(dataPoint);
    if (freqHistoryRef.current.length > 300) freqHistoryRef.current.shift();
    setHistoryData([...freqHistoryRef.current]);
  };
  
  // ============ Simulation Loop ============
  useEffect(() => {
    if (!isRunning) return;
    
    simulationIntervalRef.current = setInterval(() => {
      setSimulationTime((prevTime) => {
        const newTime = prevTime + 0.01;
        if (newTime > 120) {
          setIsRunning(false);
          return prevTime;
        }
        runSimulationStep(H, deltaP_percent, D, syntheticInertia, weakGrid, newTime);
        return newTime;
      });
    }, 10);
    
    return () => clearInterval(simulationIntervalRef.current);
  }, [isRunning, H, deltaP_percent, D, syntheticInertia, weakGrid, uflsStages]);
  
  // ============ Control Handlers ============
  const handleReset = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setFrequency(50.0);
    setDeltaF(0);
    setRocof(0);
    setCurrentUflsStage(0);
    setSystemStatus('NORMAL');
    setLoadShedAmount(0);
    
    // Reset refs
    freqHistoryRef.current = [];
    previousFreqRef.current = 50.0;
    maxUflsStageRef.current = 0;
    cumulativeShedRef.current = 0;
    
    // Rebuild initial history
    const initial = [];
    for (let i = -50; i <= 0; i++) {
      initial.push({ time: i / 10, frequency: 50.0, rocof: 0 });
    }
    setHistoryData(initial);
  };
  
  const loadPreset = (presetId) => {
    const presets = {
      normal_operation: { H: 5.0, deltaP_percent: 0, D: 1.5, synthetic: 0, weak: false, ufls: 6 },
      iberian_28A: { H: 2.45, deltaP_percent: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },
      more_inertia: { H: 4.5, deltaP_percent: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },
      synthetic_inertia: { H: 2.45, deltaP_percent: 8.8, D: 1.5, synthetic: 3.0, weak: true, ufls: 6 },
    };
    
    const preset = presets[presetId];
    if (preset) {
      handleReset();
      setH(preset.H);
      setDeltaP_percent(preset.deltaP_percent);
      setD(preset.D);
      setSyntheticInertia(preset.synthetic);
      setWeakGrid(preset.weak);
      setUflsStages(preset.ufls);
    }
  };
  
  return (
    <div className={styles.container}>
      <GlitchTitle text="SIMULADOR DE ECUACIÓN DEL SWING" />
      <p className={styles.subtitle}>
        Control interactivo de parámetros físicos. Observa cómo baja inercia + penetración renovable = colapso
      </p>
      
      {/* CONTROL PANEL */}
      <motion.div 
        className={styles.controlPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.sliderGroup}>
          <div className={styles.slider}>
            <label>Inercia del Sistema (H): <strong>{H.toFixed(2)}s</strong></label>
            <input 
              type="range" min="1.0" max="8.0" step="0.1"
              value={H} onChange={(e) => setH(parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.sliderInput}
            />
            <span className={styles.hint}>1s (muy baja) ← → 8s (legacy grid)</span>
          </div>
          
          <div className={styles.slider}>
            <label>Pérdida de Generación (ΔP): <strong>{deltaP_percent.toFixed(1)}%</strong></label>
            <input 
              type="range" min="0" max="50" step="0.5"
              value={deltaP_percent} onChange={(e) => setDeltaP_percent(parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.sliderInput}
            />
            <span className={styles.hint}>0% (normal) ← → 50% (pérdida masiva)</span>
          </div>
          
          <div className={styles.slider}>
            <label>Amortiguamiento (D): <strong>{D.toFixed(2)}pu</strong></label>
            <input 
              type="range" min="0.5" max="3.0" step="0.1"
              value={D} onChange={(e) => setD(parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.sliderInput}
            />
            <span className={styles.hint}>Bajo ← → Alto</span>
          </div>
          
          <div className={styles.slider}>
            <label>Inercia Sintética (FFR): <strong>{syntheticInertia.toFixed(2)}pu</strong></label>
            <input 
              type="range" min="0" max="5.0" step="0.1"
              value={syntheticInertia} onChange={(e) => setSyntheticInertia(parseFloat(e.target.value))}
              disabled={isRunning}
              className={styles.sliderInput}
            />
            <span className={styles.hint}>OFF ← → FFR agresiva (en red débil causa oscilaciones)</span>
          </div>
        </div>
        
        <div className={styles.toggleGroup}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={weakGrid} onChange={(e) => setWeakGrid(e.target.checked)} disabled={isRunning} />
            <span className={styles.toggleLabel}>Red Débil (SCR &lt; 2.0)</span>
          </label>
          <label className={styles.toggle}>
            <input type="checkbox" defaultChecked disabled />
            <span className={styles.toggleLabel}>UFLS Habilitado ({uflsStages} etapas)</span>
          </label>
        </div>
        
        <div className={styles.presetButtons}>
          <button onClick={() => loadPreset('normal_operation')} disabled={isRunning}>Operación Normal</button>
          <button onClick={() => loadPreset('iberian_28A')} disabled={isRunning} className={styles.preset28A}>Condiciones 28A</button>
          <button onClick={() => loadPreset('more_inertia')} disabled={isRunning}>+ Inercia</button>
          <button onClick={() => loadPreset('synthetic_inertia')} disabled={isRunning}>FFR Sintética</button>
        </div>
        
        <div className={styles.playControls}>
          <button onClick={() => setIsRunning(!isRunning)} className={styles.playButton}>
            {isRunning ? '⏹ DETENER' : '▶ SIMULAR'}
          </button>
          <button onClick={handleReset} disabled={isRunning} className={styles.resetButton}>⟲ RESET</button>
          <span className={styles.timeDisplay}>Tiempo: {simulationTime.toFixed(2)}s</span>
        </div>
      </motion.div>
      
      {/* LIVE READOUT */}
      <motion.div 
        className={styles.readoutPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.readoutGrid}>
          <div className={styles.readoutItem}>
            <span className={styles.label}>Frecuencia:</span>
            <span className={`${styles.value} ${styles.freq}`}>{frequency.toFixed(3)} Hz</span>
          </div>
          <div className={styles.readoutItem}>
            <span className={styles.label}>ROCOF:</span>
            <span className={`${styles.value} ${rocof > 1.0 ? styles.danger : ''}`}>
              {rocof.toFixed(3)} Hz/s
            </span>
          </div>
          <div className={styles.readoutItem}>
            <span className={styles.label}>ΔF (pu):</span>
            <span className={styles.value}>{deltaF.toFixed(5)}</span>
          </div>
          <div className={styles.readoutItem}>
            <span className={styles.label}>Estado:</span>
            <span className={`${styles.badge} ${styles[`badge-${systemStatus.replace(' ', '-')}`]}`}>
              {systemStatus}
            </span>
          </div>
        </div>
        
        {currentUflsStage > 0 && (
          <div className={styles.uflsAlert}>
            ⚠️ UFLS Etapa {currentUflsStage} Activa | Deslastre: {loadShedAmount}%
          </div>
        )}
        
        {rocof > 1.0 && (
          <div className={styles.rocofAlert}>
            🚨 ROCOF > 1.0 Hz/s: PUNTO DE NO RETORNO. Máquinas síncronas se desenganchan.
          </div>
        )}
      </motion.div>
      
      {/* FREQUENCY CHART */}
      <div className={styles.chartSection}>
        <h3>Frecuencia del Sistema (Hz)</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <defs>
              <linearGradient id="freqGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ff88" />
                <stop offset="50%" stopColor="#FFD700" />
                <stop offset="75%" stopColor="#ff6644" />
                <stop offset="100%" stopColor="#cc0000" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={['dataMin', 'dataMax']} 
              tickCount={7} 
              stroke="rgba(255,255,255,0.5)"
              label={{ value: 'Tiempo (s)', position: 'bottom', offset: 10, fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis domain={[45, 50.5]} stroke="rgba(255,255,255,0.5)" label={{ value: 'Hz', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }} />
            <ReferenceLine y={50.0} stroke="white" strokeDasharray="5 5" opacity={0.3} label="Nominal" />
            <ReferenceLine y={49.8} stroke="#FFD700" strokeDasharray="5 5" label="UFLS inicio" />
            <ReferenceLine y={49.0} stroke="#ff6644" strokeDasharray="5 5" label="Etapa 1" />
            <ReferenceLine y={48.0} stroke="#cc0000" strokeDasharray="5 5" label="Colapso" />
            <Line 
              type="monotone" 
              dataKey="frequency" 
              stroke="url(#freqGradient)"
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              name="Frecuencia"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}
              formatter={(value) => value.toFixed(3) + ' Hz'}
              labelFormatter={(label) => `Tiempo: ${label.toFixed(2)} s`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* ROCOF CHART */}
      <div className={styles.chartSection}>
        <h3>ROCOF (dF/dt) — Hz/s</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              type="number" 
              domain={['dataMin', 'dataMax']} 
              tickCount={7} 
              stroke="rgba(255,255,255,0.5)"
              label={{ value: 'Tiempo (s)', position: 'bottom', offset: 10, fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis stroke="rgba(255,255,255,0.5)" label={{ value: 'Hz/s', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }} />
            <ReferenceLine y={0.5} stroke="#FFD700" strokeDasharray="5 5" label="Alarma" />
            <ReferenceLine y={1.0} stroke="#cc0000" strokeDasharray="5 5" label="Pérdida de sincronismo" />
            <Bar dataKey="rocof" name="ROCOF">
              {historyData.map((entry, index) => {
                let color = '#00ff88';
                if (entry.rocof > 1.0) color = '#cc0000';
                else if (entry.rocof > 0.5) color = '#FFD700';
                return <Cell key={`rocof-bar-${index}`} fill={color} />;
              })}
            </Bar>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}
              formatter={(value) => value.toFixed(3) + ' Hz/s'}
              labelFormatter={(label) => `Tiempo: ${label.toFixed(2)} s`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* EDUCATIONAL NOTES */}
      <motion.div 
        className={styles.educationalPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3>💡 Lecciones Pedagógicas</h3>
        <div className={styles.lessonCard}>
          <h4>Interacción 1: El Retraso de la Inercia</h4>
          <p>
            Carga "Condiciones 28A" y anota la rapidez del colapso (ROCOF ≈ 0.9 Hz/s).
            Ahora carga "+ Inercia" (H=4.5s). Verás que la frecuencia cae más lentamente,
            pero alcanza aproximadamente el mismo valor mínimo. La inercia NO previene el colapso;
            solo lo retrasa y da más tiempo a los sistemas de protección.
          </p>
        </div>
        <div className={styles.lessonCard}>
          <h4>Interacción 2: La Trampa de la Inercia Sintética</h4>
          <p>
            Carga "FFR Sintética" con "Red Débil" habilitada. Verás que en lugar de estabilizar,
            la alta ganancia FFR (3.0 pu) en una red débil (SCR &lt; 2.0) causa oscilaciones
            subsincrónicas (~0.63 Hz) que empeoran la situación. Esto replica exactamente
            la inestabilidad del PLL observada en Granada antes del colapso.
          </p>
        </div>
        <div className={styles.lessonCard}>
          <h4>Interacción 3: Límites del UFLS</h4>
          <p>
            El UFLS está siempre habilitado. Ajusta manualmente los parámetros (especialmente D y H muy bajos)
            para ver cuándo el UFLS puede detener el colapso versus cuándo llega demasiado tarde.
            ROCOF > 1.0 Hz/s significa que el sistema ha cruzado el "punto de no retorno" físico.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SwingEquationSimulator;
