// SwingEquationSimulator.jsx



import React, { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, BarChart, Bar } from 'recharts';

import { useBaseUrl } from '@docusaurus/useBaseUrl';

import GlitchTitle from '../GlitchTitle/GlitchTitle';

import styles from './SwingEquationSimulator.module.css';



const SwingEquationSimulator = () => {

&#x20; // ============ State: Slider Parameters ============

&#x20; const [H, setH] = useState(2.45); // Inertia constant (seconds)

&#x20; const [deltaP, setDeltaP] = useState(8.8); // Power imbalance (% of load)

&#x20; const [D, setD] = useState(1.5); // Damping factor (pu)

&#x20; const [syntheticInertia, setSyntheticInertia] = useState(0); // FFR gain

&#x20; const [weakGrid, setWeakGrid] = useState(false); // SCR < 2.0 simulation

&#x20; const [uflsStages, setUflsStages] = useState(6); // Number of active UFLS stages



&#x20; // ============ State: Simulation Control ============

&#x20; const [isRunning, setIsRunning] = useState(false);

&#x20; const [simulationTime, setSimulationTime] = useState(0); // seconds

&#x20; const [frequency, setFrequency] = useState(50.0); // Hz

&#x20; const [deltaF, setDeltaF] = useState(0); // Per-unit frequency deviation

&#x20; const [rocof, setRocof] = useState(0); // dF/dt (Hz/s)

&#x20; const [historyData, setHistoryData] = useState([]); // For chart

&#x20; const [currentUflsStage, setCurrentUflsStage] = useState(0); // Which UFLS stage is active

&#x20; const [systemStatus, setSystemStatus] = useState('NORMAL');



&#x20; // ============ Refs ============

&#x20; const simulationIntervalRef = useRef(null);

&#x20; const freqHistoryRef = useRef([]);

&#x20; const rocofHistoryRef = useRef([]);

&#x20; const previousFreqRef = useRef(50.0);



&#x20; // ============ Load configuration JSON ============

&#x20; const [params, setParams] = useState(null);



&#x20; useEffect(() => {

&#x20;   fetch(useBaseUrl('/data/swing_equation_params.json'))

&#x20;     .then((res) => res.json())

&#x20;     .then((data) => setParams(data))

&#x20;     .catch((err) => console.error('Error loading swing equation params:', err));

&#x20; }, []);



&#x20; // ============ Simulation Engine: Euler Integration ============

&#x20; const runSimulationStep = (currentH, currentDeltaP, currentD, currentSynth, currentWeakGrid, time) => {

&#x20;   const DT_MS = 10; // 10ms step

&#x20;   const DT_S = DT_MS / 1000;

&#x20;   const F0 = 50.0;

&#x20;   const OMEGA_S = 314.159; // 2π * 50 Hz



&#x20;   // Get current frequency from refs (for derivative)

&#x20;   const prevFreq = previousFreqRef.current;



&#x20;   // Euler update: 2H * d(Δf)/dt + D*Δf = ΔP

&#x20;   // => d(Δf)/dt = (ΔP - D*Δf) / (2*H)

&#x20;   const dDeltaF_dt = (currentDeltaP - D * deltaF) / (2 * currentH);



&#x20;   // Add synthetic inertia response (proportional to df/dt)

&#x20;   // Synthetic inertia injects power = -FFR_gain * df/dt

&#x20;   // This reduces ΔP

&#x20;   let effectiveDeltaP = currentDeltaP;

&#x20;   if (syntheticInertia > 0) {

&#x20;     effectiveDeltaP -= syntheticInertia * dDeltaF_dt;



&#x20;     // Weak grid oscillation: if weak_grid is TRUE and synthetic inertia is high,

&#x20;     // introduce subsynchronous feedback (0.63 Hz oscillation)

&#x20;     if (currentWeakGrid \&\& syntheticInertia > 2.0) {

&#x20;       const oscillationAmplitude = 0.5 * syntheticInertia; // Grows with FFR gain

&#x20;       const oscillationFreq = 0.63; // Hz, matching Granada pre-blackout oscillation

&#x20;       const phaseShift = 2 * Math.PI * oscillationFreq * time;

&#x20;       effectiveDeltaP += oscillationAmplitude * Math.sin(phaseShift);

&#x20;     }

&#x20;   }



&#x20;   // Recalculate with effective ΔP

&#x20;   const dDeltaF_dt_effective = (effectiveDeltaP - D * deltaF) / (2 * currentH);



&#x20;   // Euler step

&#x20;   const newDeltaF = deltaF + dDeltaF_dt_effective * DT_S;

&#x20;   const newFreq = F0 * (1 + newDeltaF);

&#x20;   const newRocof = (newFreq - prevFreq) / DT_S;



&#x20;   previousFreqRef.current = newFreq;



&#x20;   // ============ UFLS Logic ============

&#x20;   // Check UFLS thresholds and update effectiveDeltaP accordingly

&#x20;   let cumulativeLoadShed = 0;

&#x20;   const uflsThresholds = [

&#x20;     { freq: 49.0, shed: 15, stage: 1 },

&#x20;     { freq: 48.7, shed: 15, stage: 2 },

&#x20;     { freq: 48.4, shed: 10, stage: 3 },

&#x20;     { freq: 48.0, shed: 10, stage: 4 },

&#x20;   ];



&#x20;   let activeStage = 0;

&#x20;   for (let i = 0; i < Math.min(uflsStages, uflsThresholds.length); i++) {

&#x20;     if (newFreq <= uflsThresholds[i].freq) {

&#x20;       activeStage = i + 1;

&#x20;       cumulativeLoadShed = uflsThresholds.slice(0, i + 1).reduce((sum, u) => sum + u.shed, 0);

&#x20;     }

&#x20;   }



&#x20;   setCurrentUflsStage(activeStage);



&#x20;   // Update status badge

&#x20;   let status = 'NORMAL';

&#x20;   if (newFreq > 49.8) status = 'NORMAL';

&#x20;   else if (newFreq > 49.0) status = 'UFLS ACTIVE';

&#x20;   else if (newFreq > 48.0) status = 'CRITICAL';

&#x20;   else status = 'COLLAPSE';



&#x20;   setSystemStatus(status);



&#x20;   // Update state

&#x20;   setDeltaF(newDeltaF);

&#x20;   setFrequency(newFreq);

&#x20;   setRocof(newRocof);



&#x20;   // Append to history for charting

&#x20;   const dataPoint = {

&#x20;     time: time.toFixed(2),

&#x20;     t: time,

&#x20;     frequency: parseFloat(newFreq.toFixed(2)),

&#x20;     rocof: parseFloat(newRocof.toFixed(3)),

&#x20;     deltaF: parseFloat(newDeltaF.toFixed(4)),

&#x20;     loadShed: cumulativeLoadShed,

&#x20;   };



&#x20;   freqHistoryRef.current.push(dataPoint);



&#x20;   // Keep only last 300 points for performance

&#x20;   if (freqHistoryRef.current.length > 300) {

&#x20;     freqHistoryRef.current.shift();

&#x20;   }



&#x20;   setHistoryData([...freqHistoryRef.current]);

&#x20; };



&#x20; // ============ Simulation Loop ============

&#x20; useEffect(() => {

&#x20;   if (!isRunning) return;



&#x20;   simulationIntervalRef.current = setInterval(() => {

&#x20;     setSimulationTime((prevTime) => {

&#x20;       const newTime = prevTime + 0.01; // 10ms step



&#x20;       // Stop at 120 seconds

&#x20;       if (newTime > 120) {

&#x20;         setIsRunning(false);

&#x20;         return prevTime;

&#x20;       }



&#x20;       runSimulationStep(H, deltaP, D, syntheticInertia, weakGrid, newTime);

&#x20;       return newTime;

&#x20;     });

&#x20;   }, 10); // Run every 10ms (browser frame rate compatible)



&#x20;   return () => clearInterval(simulationIntervalRef.current);

&#x20; }, [isRunning, H, deltaP, D, syntheticInertia, weakGrid, uflsStages]);



&#x20; // ============ Control Handlers ============

&#x20; const handleReset = () => {

&#x20;   setIsRunning(false);

&#x20;   setSimulationTime(0);

&#x20;   setFrequency(50.0);

&#x20;   setDeltaF(0);

&#x20;   setRocof(0);

&#x20;   setCurrentUflsStage(0);

&#x20;   setSystemStatus('NORMAL');

&#x20;   freqHistoryRef.current = [];

&#x20;   rocofHistoryRef.current = [];

&#x20;   previousFreqRef.current = 50.0;

&#x20;   setHistoryData([]);

&#x20; };



&#x20; const loadPreset = (presetId) => {

&#x20;   // Find preset in params

&#x20;   if (!params || !params.swing_equation) return;



&#x20;   const presets = {

&#x20;     normal_operation: { H: 5.0, deltaP: 0, D: 1.5, synthetic: 0, weak: false, ufls: 6 },

&#x20;     iberian_28A: { H: 2.45, deltaP: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },

&#x20;     more_inertia: { H: 4.5, deltaP: 8.8, D: 1.5, synthetic: 0, weak: true, ufls: 6 },

&#x20;     synthetic_inertia: { H: 2.45, deltaP: 8.8, D: 1.5, synthetic: 3.0, weak: true, ufls: 6 },

&#x20;   };



&#x20;   const preset = presets[presetId];

&#x20;   if (preset) {

&#x20;     handleReset();

&#x20;     setH(preset.H);

&#x20;     setDeltaP(preset.deltaP);

&#x20;     setD(preset.D);

&#x20;     setSyntheticInertia(preset.synthetic);

&#x20;     setWeakGrid(preset.weak);

&#x20;     setUflsStages(preset.ufls);

&#x20;   }

&#x20; };



&#x20; if (!params) return <div>Loading simulator configuration...</div>;



&#x20; return (

&#x20;   <div className={styles.container}>

&#x20;     <GlitchTitle text="SIMULADOR DE ECUACIÓN DEL SWING" />

&#x20;     <p className={styles.subtitle}>

&#x20;       Control interactivo de parámetros físicos. Observa cómo baja inercia + penetración renovable = colapso

&#x20;     </p>



&#x20;     {/* ============ CONTROL PANEL ============ */}

&#x20;     <motion.div 

&#x20;       className={styles.controlPanel}

&#x20;       initial={{ opacity: 0 }}

&#x20;       animate={{ opacity: 1 }}

&#x20;       transition={{ delay: 0.2 }}

&#x20;     >

&#x20;       {/* Sliders */}

&#x20;       <div className={styles.sliderGroup}>

&#x20;         <div className={styles.slider}>

&#x20;           <label>Inercia del Sistema (H): <strong>{H.toFixed(2)}s</strong></label>

&#x20;           <input 

&#x20;             type="range" 

&#x20;             min="1.0" 

&#x20;             max="8.0" 

&#x20;             step="0.1"

&#x20;             value={H}

&#x20;             onChange={(e) => setH(parseFloat(e.target.value))}

&#x20;             disabled={isRunning}

&#x20;             className={styles.sliderInput}

&#x20;           />

&#x20;           <span className={styles.hint}>1s (muy baja) ← → 8s (legacy grid)</span>

&#x20;         </div>



&#x20;         <div className={styles.slider}>

&#x20;           <label>Pérdida de Potencia (ΔP): <strong>{deltaP.toFixed(1)}%</strong></label>

&#x20;           <input 

&#x20;             type="range" 

&#x20;             min="0" 

&#x20;             max="50" 

&#x20;             step="0.5"

&#x20;             value={deltaP}

&#x20;             onChange={(e) => setDeltaP(parseFloat(e.target.value))}

&#x20;             disabled={isRunning}

&#x20;             className={styles.sliderInput}

&#x20;           />

&#x20;           <span className={styles.hint}>0% (normal) ← → 50% (total failure)</span>

&#x20;         </div>



&#x20;         <div className={styles.slider}>

&#x20;           <label>Amortiguamiento (D): <strong>{D.toFixed(2)}pu</strong></label>

&#x20;           <input 

&#x20;             type="range" 

&#x20;             min="0.5" 

&#x20;             max="3.0" 

&#x20;             step="0.1"

&#x20;             value={D}

&#x20;             onChange={(e) => setD(parseFloat(e.target.value))}

&#x20;             disabled={isRunning}

&#x20;             className={styles.sliderInput}

&#x20;           />

&#x20;           <span className={styles.hint}>Bajo ← → Alto</span>

&#x20;         </div>



&#x20;         <div className={styles.slider}>

&#x20;           <label>Inercia Sintética (FFR): <strong>{syntheticInertia.toFixed(2)}pu</strong></label>

&#x20;           <input 

&#x20;             type="range" 

&#x20;             min="0" 

&#x20;             max="5.0" 

&#x20;             step="0.1"

&#x20;             value={syntheticInertia}

&#x20;             onChange={(e) => setSyntheticInertia(parseFloat(e.target.value))}

&#x20;             disabled={isRunning}

&#x20;             className={styles.sliderInput}

&#x20;           />

&#x20;           <span className={styles.hint}>OFF ← → Aggressive FFR (atención: en grid débil causa inestabilidad)</span>

&#x20;         </div>

&#x20;       </div>



&#x20;       {/* Toggles */}

&#x20;       <div className={styles.toggleGroup}>

&#x20;         <label className={styles.toggle}>

&#x20;           <input 

&#x20;             type="checkbox"

&#x20;             checked={weakGrid}

&#x20;             onChange={(e) => setWeakGrid(e.target.checked)}

&#x20;             disabled={isRunning}

&#x20;           />

&#x20;           <span className={styles.toggleLabel}>Red Débil (SCR < 2.0)</span>

&#x20;         </label>



&#x20;         <label className={styles.toggle}>

&#x20;           <input 

&#x20;             type="checkbox"

&#x20;             defaultChecked

&#x20;             disabled // Always on for now

&#x20;           />

&#x20;           <span className={styles.toggleLabel}>UFLS Habilitado ({uflsStages} etapas)</span>

&#x20;         </label>

&#x20;       </div>



&#x20;       {/* Preset Buttons */}

&#x20;       <div className={styles.presetButtons}>

&#x20;         <button onClick={() => loadPreset('normal_operation')} disabled={isRunning}>

&#x20;           Operación Normal

&#x20;         </button>

&#x20;         <button onClick={() => loadPreset('iberian_28A')} disabled={isRunning} className={styles.preset28A}>

&#x20;           Condiciones 28A

&#x20;         </button>

&#x20;         <button onClick={() => loadPreset('more_inertia')} disabled={isRunning}>

&#x20;           + Inercia

&#x20;         </button>

&#x20;         <button onClick={() => loadPreset('synthetic_inertia')} disabled={isRunning}>

&#x20;           FFR Sintética

&#x20;         </button>

&#x20;       </div>



&#x20;       {/* Play Controls */}

&#x20;       <div className={styles.playControls}>

&#x20;         <button 

&#x20;           onClick={() => setIsRunning(!isRunning)}

&#x20;           className={styles.playButton}

&#x20;         >

&#x20;           {isRunning ? '⏹ DETENER' : '▶ SIMULAR'}

&#x20;         </button>

&#x20;         <button 

&#x20;           onClick={handleReset}

&#x20;           disabled={isRunning}

&#x20;           className={styles.resetButton}

&#x20;         >

&#x20;           ⟲ RESET

&#x20;         </button>

&#x20;         <span className={styles.timeDisplay}>Tiempo: {simulationTime.toFixed(2)}s</span>

&#x20;       </div>

&#x20;     </motion.div>



&#x20;     {/* ============ LIVE READOUT ============ */}

&#x20;     <motion.div 

&#x20;       className={styles.readoutPanel}

&#x20;       initial={{ opacity: 0 }}

&#x20;       animate={{ opacity: 1 }}

&#x20;       transition={{ delay: 0.3 }}

&#x20;     >

&#x20;       <div className={styles.readoutGrid}>

&#x20;         <div className={styles.readoutItem}>

&#x20;           <span className={styles.label}>Frecuencia:</span>

&#x20;           <span className={`${styles.value} ${styles.freq}`}>{frequency.toFixed(2)} Hz</span>

&#x20;         </div>

&#x20;         <div className={styles.readoutItem}>

&#x20;           <span className={styles.label}>ROCOF:</span>

&#x20;           <span className={`${styles.value} ${rocof > 1.0 ? styles.danger : ''}`}>

&#x20;             {rocof.toFixed(3)} Hz/s

&#x20;           </span>

&#x20;         </div>

&#x20;         <div className={styles.readoutItem}>

&#x20;           <span className={styles.label}>ΔF (pu):</span>

&#x20;           <span className={styles.value}>{deltaF.toFixed(4)}</span>

&#x20;         </div>

&#x20;         <div className={styles.readoutItem}>

&#x20;           <span className={styles.label}>Estado:</span>

&#x20;           <span className={`${styles.badge} ${styles[`badge-${systemStatus.replace(' ', '-')}`]}`}>

&#x20;             {systemStatus}

&#x20;           </span>

&#x20;         </div>

&#x20;       </div>



&#x20;       {currentUflsStage > 0 \&\& (

&#x20;         <div className={styles.uflsAlert}>

&#x20;           ⚠️ UFLS Etapa {currentUflsStage} Activa (Freq: {frequency.toFixed(2)} Hz)

&#x20;         </div>

&#x20;       )}



&#x20;       {rocof > 1.0 \&\& (

&#x20;         <div className={styles.rocofAlert}>

&#x20;           🚨 ROCOF > 1.0 Hz/s: PUNTO DE NO RETORNO. Máquinas síncronas se desenganchan.

&#x20;         </div>

&#x20;       )}

&#x20;     </motion.div>



&#x20;     {/* ============ CHARTS ============ */}

&#x20;     <div className={styles.chartSection}>

&#x20;       <h3>Frecuencia del Sistema (t)</h3>

&#x20;       <ResponsiveContainer width="100%" height={350}>

&#x20;         <ComposedChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>

&#x20;           <defs>

&#x20;             <linearGradient id="freqGradient" x1="0" y1="0" x2="0" y2="1">

&#x20;               <stop offset="0%" stopColor="#00ff88" />

&#x20;               <stop offset="50%" stopColor="#FFD700" />

&#x20;               <stop offset="75%" stopColor="#ff6644" />

&#x20;               <stop offset="100%" stopColor="#cc0000" />

&#x20;             </linearGradient>

&#x20;           </defs>



&#x20;           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

&#x20;           <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />

&#x20;           <YAxis domain={[45, 50.5]} stroke="rgba(255,255,255,0.5)" />



&#x20;           <ReferenceLine y={50.0} stroke="white" strokeDasharray="5 5" opacity={0.3} label="Nominal" />

&#x20;           <ReferenceLine y={49.8} stroke="#FFD700" strokeDasharray="5 5" label="UFLS" />

&#x20;           <ReferenceLine y={49.0} stroke="#ff6644" strokeDasharray="5 5" label="Stage 1" />

&#x20;           <ReferenceLine y={48.0} stroke="#cc0000" strokeDasharray="5 5" label="Collapse" />



&#x20;           <Line 

&#x20;             type="monotone" 

&#x20;             dataKey="frequency" 

&#x20;             stroke="url(#freqGradient)"

&#x20;             dot={false}

&#x20;             strokeWidth={2}

&#x20;             isAnimationActive={false}

&#x20;             name="Frequency"

&#x20;           />



&#x20;           <Tooltip 

&#x20;             contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}

&#x20;             formatter={(value) => value.toFixed(2) + ' Hz'}

&#x20;           />

&#x20;         </ComposedChart>

&#x20;       </ResponsiveContainer>

&#x20;     </div>



&#x20;     <div className={styles.chartSection}>

&#x20;       <h3>ROCOF (dF/dt) — Hz/s</h3>

&#x20;       <ResponsiveContainer width="100%" height={280}>

&#x20;         <BarChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>

&#x20;           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />

&#x20;           <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />

&#x20;           <YAxis stroke="rgba(255,255,255,0.5)" />



&#x20;           <ReferenceLine y={0.5} stroke="#FFD700" strokeDasharray="5 5" label="Threshold" />

&#x20;           <ReferenceLine y={1.0} stroke="#cc0000" strokeDasharray="5 5" label="POLE-SLIP" />



&#x20;           <Bar 

&#x20;             dataKey="rocof"

&#x20;             fill={(entry) => entry.rocof > 1.0 ? '#cc0000' : entry.rocof > 0.5 ? '#FFD700' : '#00ff88'}

&#x20;             name="ROCOF"

&#x20;           />



&#x20;           <Tooltip 

&#x20;             contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.2)' }}

&#x20;             formatter={(value) => value.toFixed(3) + ' Hz/s'}

&#x20;           />

&#x20;         </BarChart>

&#x20;       </ResponsiveContainer>

&#x20;     </div>



&#x20;     {/* ============ EDUCATIONAL NOTES ============ */}

&#x20;     <motion.div 

&#x20;       className={styles.educationalPanel}

&#x20;       initial={{ opacity: 0 }}

&#x20;       animate={{ opacity: 1 }}

&#x20;       transition={{ delay: 0.5 }}

&#x20;     >

&#x20;       <h3>💡 Lecciones Pedagógicas</h3>



&#x20;       <div className={styles.lessonCard}>

&#x20;         <h4>Interacción 1: El Retraso de la Inercia</h4>

&#x20;         <p>

&#x20;           Carga "Condiciones 28A" y anota la rapidez del colapso (ROCOF ≈ 0.9 Hz/s).

&#x20;           Ahora carga "+ Inercia" (H=4.5s). Verás que la frecuencia cae más lentamente,

&#x20;           pero alcanza aproximadamente el mismo valor mínimo. La inercia NO previene el colapso;

&#x20;           solo lo retrasa y da más tiempo a los sistemas de protección.

&#x20;         </p>

&#x20;       </div>



&#x20;       <div className={styles.lessonCard}>

&#x20;         <h4>Interacción 2: La Trampa de la Inercia Sintética</h4>

&#x20;         <p>

&#x20;           Carga "FFR Sintética" con "Red Débil" habilitada. Verás que en lugar de estabilizar,

&#x20;           la alta ganancia FFR (3.0 pu) en una red débil (SCR < 2.0) causa oscilaciones

&#x20;           subsincrónicas (\~0.63 Hz) que empeoran la situación. Esto replica exactamente

&#x20;           la inestabilidad del PLL observada en Granada antes del colapso.

&#x20;         </p>

&#x20;       </div>



&#x20;       <div className={styles.lessonCard}>

&#x20;         <h4>Interacción 3: Límites del UFLS</h4>

&#x20;         <p>

&#x20;           Actualmente, el UFLS está siempre habilitado. Intenta ajustar manualmente

&#x20;           los parámetros (especialmente D y H muy bajos) para ver cuándo el UFLS puede

&#x20;           detener el colapso versus cuándo llega demasiado tarde. ROCOF > 1.0 Hz/s

&#x20;           significa que el sistema ha cruzado el "punto de no retorno" físico.

&#x20;         </p>

&#x20;       </div>

&#x20;     </motion.div>

&#x20;   </div>

&#x20; );

};



export default SwingEquationSimulator;
