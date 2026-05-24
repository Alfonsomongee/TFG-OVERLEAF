// SwingEquationSimulator.jsx



import React, { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, BarChart, Bar } from 'recharts';

import GlitchTitle from '../GlitchTitle';

import styles from './SwingEquationSimulator.module.css';
import params from '@site/static/data/swing_equation_params.json';



const SwingEquationSimulator = () => {

  // ============ State: Slider Parameters ============

  const [H, setH] = useState(2.45); // Inertia constant (seconds)

  const [deltaP, setDeltaP] = useState(8.8); // Power imbalance (% of load)

  const [D, setD] = useState(1.5); // Damping factor (pu)

  const [syntheticInertia, setSyntheticInertia] = useState(0); // FFR gain

  const [weakGrid, setWeakGrid] = useState(false); // SCR &lt; 2.0 simulation

  const [uflsStages, setUflsStages] = useState(6); // Number of active UFLS stages



  // ============ State: Simulation Control ============

  const [isRunning, setIsRunning] = useState(false);

  const [simulationTime, setSimulationTime] = useState(0); // seconds

  const [frequency, setFrequency] = useState(50.0); // Hz

  const [deltaF, setDeltaF] = useState(0); // Per-unit frequency deviation

  const [rocof, setRocof] = useState(0); // dF/dt (Hz/s)

  const [historyData, setHistoryData] = useState(() => {
    const initial = [];
    for(let i = -50; i <= 0; i++) {
      initial.push({ time: i/10, freq: 50.0, rocof: 0 });
    }
    return initial;
  }); // For chart

  const [currentUflsStage, setCurrentUflsStage] = useState(0); // Which UFLS stage is active

  const [systemStatus, setSystemStatus] = useState('NORMAL');



  // ============ Refs ============

  const simulationIntervalRef = useRef(null);

  const freqHistoryRef = useRef([]);

  const rocofHistoryRef = useRef([]);

  const previousFreqRef = useRef(50.0);



  // ============ Simulation Engine: Euler Integration ============

  const runSimulationStep = (currentH, currentDeltaP, currentD, currentSynth, currentWeakGrid, time) => {

    const DT_MS = 10; // 10ms step

    const DT_S = DT_MS / 1000;

    const F0 = 50.0;

    const OMEGA_S = 314.159; // 2π * 50 Hz



    // Get current frequency from refs (for derivative)

    const prevFreq = previousFreqRef.current;



    // Euler update: 2H * d(Δf)/dt + D*Δf = ΔP

    // => d(Δf)/dt = (ΔP - D*Δf) / (2*H)

    const dDeltaF_dt = (currentDeltaP - D * deltaF) / (2 * currentH);



    // Add synthetic inertia response (proportional to df/dt)

    // Synthetic inertia injects power = -FFR_gain * df/dt

    // This reduces ΔP

    let effectiveDeltaP = currentDeltaP;

    if (syntheticInertia > 0) {

      effectiveDeltaP -= syntheticInertia * dDeltaF_dt;



      // Weak grid oscillation: if weak_grid is TRUE and synthetic inertia is high,

      // introduce subsynchronous feedback (0.63 Hz oscillation)

      if (currentWeakGrid && syntheticInertia > 2.0) {

        const oscillationAmplitude = 0.5 * syntheticInertia; // Grows with FFR gain

        const oscillationFreq = 0.63; // Hz, matching Granada pre-blackout oscillation

        const phaseShift = 2 * Math.PI * oscillationFreq * time;

        effectiveDeltaP += oscillationAmplitude * Math.sin(phaseShift);

      }

    }



    // Recalculate with effective ΔP

    const dDeltaF_dt_effective = (effectiveDeltaP - D * deltaF) / (2 * currentH);



    // Euler step

    const newDeltaF = deltaF + dDeltaF_dt_effective * DT_S;

    const newFreq = F0 * (1 + newDeltaF);

    const newRocof = (newFreq - prevFreq) / DT_S;



    previousFreqRef.current = newFreq;



    // ============ UFLS Logic ============

    // Check UFLS thresholds and update effectiveDeltaP accordingly

    let cumulativeLoadShed = 0;

    const uflsThresholds = [

      { freq: 49.0, shed: 15, stage: 1 },

      { freq: 48.7, shed: 15, stage: 2 },

      { freq: 48.4, shed: 10, stage: 3 },

      { freq: 48.0, shed: 10, stage: 4 },

    ];



    let activeStage = 0;

    for (let i = 0; i < Math.min(uflsStages, uflsThresholds.length); i++) {

      if (newFreq <= uflsThresholds[i].freq) {

        activeStage = i + 1;

        cumulativeLoadShed = uflsThresholds.slice(0, i + 1).reduce((sum, u) => sum + u.shed, 0);

      }

    }



    setCurrentUflsStage(activeStage);



    // Update status badge

    let status = 'NORMAL';

    if (newFreq > 49.8) status = 'NORMAL';

    else if (newFreq > 49.0) status = 'UFLS ACTIVE';

    else if (newFreq > 48.0) status = 'CRITICAL';

    else status = 'COLLAPSE';



    setSystemStatus(status);



    // Update state

    setDeltaF(newDeltaF);

    setFrequency(newFreq);

    setRocof(newRocof);



    // Append to history for charting

    const dataPoint = {

      time: time.toFixed(2),

      t: time,

      frequency: parseFloat(newFreq.toFixed(2)),

      rocof: parseFloat(newRocof.toFixed(3)),

      deltaF: parseFloat(newDeltaF.toFixed(4)),

      loadShed: cumulativeLoadShed,

    };



    freqHistoryRef.current.push(dataPoint);



    // Keep only last 300 points for performance

    if (freqHistoryRef.current.length > 300) {

      freqHistoryRef.current.shift();

    }



    setHistoryData([...freqHistoryRef.current]);

  };



  // ============ Simulation Loop ============

  useEffect(() => {

    if (!isRunning) return;



    simulationIntervalRef.current = setInterval(() => {

      setSimulationTime((prevTime) => {

        const newTime = prevTime + 0.01; // 10ms step



        // Stop at 120 seconds

        if (newTime > 120) {

          setIsRunning(false);

          return prevTime;

        }



        runSimulationStep(H, deltaP, D, syntheticInertia, weakGrid, newTime);

        return newTime;

      });

    }, 10); // Run every 10ms (browser frame rate compatible)



    return () => clearInterval(simulationIntervalRef.current);

  }, [isRunning, H, deltaP, D, syntheticInertia, weakGrid, uflsStages]);



  // ============ Control Handlers ============

  const handleReset = () => {

    setIsRunning(false);

    setSimulationTime(0);

    setFrequency(50.0);

    setDeltaF(0);

    setRocof(0);

    setCurrentUflsStage(0);

    setSystemStatus('NORMAL');

    freqHistoryRef.current = [];

    rocofHistoryRef.current = [];

    previousFreqRef.current = 50.0;

    const initial = [];
    for(let i = -50; i <= 0; i++) {
      initial.push({ time: i/10, freq: 50.0, rocof: 0 });
    }
    setHistoryData(initial);

  };



  const loadPreset = (presetId) => {

    // Find preset in params

    if (!params || !params.swing_equation) return;



    const presets = {

      normal_operation: { H: 5.0, deltaP: 0, D: 1.5, synthetic: 0, weak: false, ufls: 6 },

      iberian_28A: { H: 2.45, deltaP: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },

      more_inertia: { H: 4.5, deltaP: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },

      synthetic_inertia: { H: 2.45, deltaP: 8.8, D: 1.5, synthetic: 3.0, weak: true, ufls: 6 },

    };



    const preset = presets[presetId];

    if (preset) {

      handleReset();

      setH(preset.H);

      setDeltaP(preset.deltaP);

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



      {/* ============ CONTROL PANEL ============ */}

      <motion.div 

        className={styles.controlPanel}

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ delay: 0.2 }}

      >

        {/* Sliders */}

        <div className={styles.sliderGroup}>

          <div className={styles.slider}>

            <label>Inercia del Sistema (H): <strong>{H.toFixed(2)}s</strong></label>

            <input 

              type="range" 

              min="1.0" 

              max="8.0" 

              step="0.1"

              value={H}

              onChange={(e) => setH(parseFloat(e.target.value))}

              disabled={isRunning}

              className={styles.sliderInput}

            />

            <span className={styles.hint}>1s (muy baja) ← → 8s (legacy grid)</span>

          </div>



          <div className={styles.slider}>

            <label>Pérdida de Potencia (ΔP): <strong>{deltaP.toFixed(1)}%</strong></label>

            <input 

              type="range" 

              min="0" 

              max="50" 

              step="0.5"

              value={deltaP}

              onChange={(e) => setDeltaP(parseFloat(e.target.value))}

              disabled={isRunning}

              className={styles.sliderInput}

            />

            <span className={styles.hint}>0% (normal) ← → 50% (total failure)</span>

          </div>



          <div className={styles.slider}>

            <label>Amortiguamiento (D): <strong>{D.toFixed(2)}pu</strong></label>

            <input 

              type="range" 

              min="0.5" 

              max="3.0" 

              step="0.1"

              value={D}

              onChange={(e) => setD(parseFloat(e.target.value))}

              disabled={isRunning}

              className={styles.sliderInput}

            />

            <span className={styles.hint}>Bajo ← → Alto</span>

          </div>



          <div className={styles.slider}>

            <label>Inercia Sintética (FFR): <strong>{syntheticInertia.toFixed(2)}pu</strong></label>

            <input 

              type="range" 

              min="0" 

              max="5.0" 

              step="0.1"

              value={syntheticInertia}

              onChange={(e) => setSyntheticInertia(parseFloat(e.target.value))}

              disabled={isRunning}

              className={styles.sliderInput}

            />

            <span className={styles.hint}>OFF ← → Aggressive FFR (atención: en grid débil causa inestabilidad)</span>

          </div>

        </div>



        {/* Toggles */}

        <div className={styles.toggleGroup}>

          <label className={styles.toggle}>

            <input 

              type="checkbox"

              checked={weakGrid}

              onChange={(e) => setWeakGrid(e.target.checked)}

              disabled={isRunning}

            />

            <span className={styles.toggleLabel}>Red Débil (SCR &lt; 2.0)</span>

          </label>



          <label className={styles.toggle}>

            <input 

              type="checkbox"

              defaultChecked

              disabled // Always on for now

            />

            <span className={styles.toggleLabel}>UFLS Habilitado ({uflsStages} etapas)</span>

          </label>

        </div>



        {/* Preset Buttons */}

        <div className={styles.presetButtons}>

          <button onClick={() => loadPreset('normal_operation')} disabled={isRunning}>

            Operación Normal

          </button>

          <button onClick={() => loadPreset('iberian_28A')} disabled={isRunning} className={styles.preset28A}>

            Condiciones 28A

          </button>

          <button onClick={() => loadPreset('more_inertia')} disabled={isRunning}>

            + Inercia

          </button>

          <button onClick={() => loadPreset('synthetic_inertia')} disabled={isRunning}>

            FFR Sintética

          </button>

        </div>



        {/* Play Controls */}

        <div className={styles.playControls}>

          <button 

            onClick={() => setIsRunning(!isRunning)}

            className={styles.playButton}

          >

            {isRunning ? '⏹ DETENER' : '▶ SIMULAR'}

          </button>

          <button 

            onClick={handleReset}

            disabled={isRunning}

            className={styles.resetButton}

          >

            ⟲ RESET

          </button>

          <span className={styles.timeDisplay}>Tiempo: {simulationTime.toFixed(2)}s</span>

        </div>

      </motion.div>



      {/* ============ LIVE READOUT ============ */}

      <motion.div 

        className={styles.readoutPanel}

        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ delay: 0.3 }}

      >

        <div className={styles.readoutGrid}>

          <div className={styles.readoutItem}>

            <span className={styles.label}>Frecuencia:</span>

            <span className={`${styles.value} ${styles.freq}`}>{frequency.toFixed(2)} Hz</span>

          </div>

          <div className={styles.readoutItem}>

            <span className={styles.label}>ROCOF:</span>

            <span className={`${styles.value} ${rocof > 1.0 ? styles.danger : ''}`}>

              {rocof.toFixed(3)} Hz/s

            </span>

          </div>

          <div className={styles.readoutItem}>

            <span className={styles.label}>ΔF (pu):</span>

            <span className={styles.value}>{deltaF.toFixed(4)}</span>

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

            ⚠️ UFLS Etapa {currentUflsStage} Activa (Freq: {frequency.toFixed(2)} Hz)

          </div>

        )}



        {rocof > 1.0 && (

          <div className={styles.rocofAlert}>

            🚨 ROCOF > 1.0 Hz/s: PUNTO DE NO RETORNO. Máquinas síncronas se desenganchan.

          </div>

        )}

      </motion.div>



      {/* ============ CHARTS ============ */}

      <div className={styles.chartSection}>

        <h3>Frecuencia del Sistema (t)</h3>

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

            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />

            <YAxis domain={[45, 50.5]} stroke="rgba(255,255,255,0.5)" />



            <ReferenceLine y={50.0} stroke="white" strokeDasharray="5 5" opacity={0.3} label="Nominal" />

            <ReferenceLine y={49.8} stroke="#FFD700" strokeDasharray="5 5" label="UFLS" />

            <ReferenceLine y={49.0} stroke="#ff6644" strokeDasharray="5 5" label="Stage 1" />

            <ReferenceLine y={48.0} stroke="#cc0000" strokeDasharray="5 5" label="Collapse" />



            <Line 

              type="monotone" 

              dataKey="frequency" 

              stroke="url(#freqGradient)"

              dot={false}

              strokeWidth={2}

              isAnimationActive={false}

              name="Frequency"

            />



            <Tooltip 

              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}

              formatter={(value) => value.toFixed(2) + ' Hz'}

            />

          </ComposedChart>

        </ResponsiveContainer>

      </div>



      <div className={styles.chartSection}>

        <h3>ROCOF (dF/dt) — Hz/s</h3>

        <ResponsiveContainer width="100%" height={280}>

          <BarChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

            <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />

            <YAxis stroke="rgba(255,255,255,0.5)" />



            <ReferenceLine y={0.5} stroke="#FFD700" strokeDasharray="5 5" label="Threshold" />

            <ReferenceLine y={1.0} stroke="#cc0000" strokeDasharray="5 5" label="POLE-SLIP" />



            <Bar 

              dataKey="rocof"

              fill={(entry) => entry.rocof > 1.0 ? '#cc0000' : entry.rocof > 0.5 ? '#FFD700' : '#00ff88'}

              name="ROCOF"

            />



            <Tooltip 

              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}

              formatter={(value) => value.toFixed(3) + ' Hz/s'}

            />

          </BarChart>

        </ResponsiveContainer>

      </div>



      {/* ============ EDUCATIONAL NOTES ============ */}

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

            subsincrónicas (\~0.63 Hz) que empeoran la situación. Esto replica exactamente

            la inestabilidad del PLL observada en Granada antes del colapso.

          </p>

        </div>



        <div className={styles.lessonCard}>

          <h4>Interacción 3: Límites del UFLS</h4>

          <p>

            Actualmente, el UFLS está siempre habilitado. Intenta ajustar manualmente

            los parámetros (especialmente D y H muy bajos) para ver cuándo el UFLS puede

            detener el colapso versus cuándo llega demasiado tarde. ROCOF > 1.0 Hz/s

            significa que el sistema ha cruzado el "punto de no retorno" físico.

          </p>

        </div>

      </motion.div>

    </div>

  );

};



export default SwingEquationSimulator;
