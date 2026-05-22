import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Simulador de dinámica de fase
const generatePhaseData = (type, timeLimit) => {
  const dt = 0.01;
  let delta = 0; // Desviación del ángulo
  let omega = 0; // Desviación de frecuencia (d_delta/dt)
  
  const x = [];
  const y = [];
  
  // Condición inicial (perturbación)
  delta = 0.1;
  omega = 0.5;

  for (let t = 0; t < timeLimit; t += dt) {
    if (type === 'GFL') {
      // Inversor Grid-Following en red débil (inestable, espiral divergente)
      const d_delta = omega;
      const d_omega = -0.5 * Math.sin(delta) - 0.2 * omega + 0.1 * delta;
      
      delta += d_delta * dt;
      omega += d_omega * dt;
      
      // Amplificamos la divergencia
      delta *= 1.002;
      omega *= 1.002;
    } else if (type === 'GFM') {
      // Inversor Grid-Forming (estable, converge al origen)
      const d_delta = omega;
      const d_omega = -2.0 * Math.sin(delta) - 1.5 * omega; // Fuerte amortiguamiento
      
      delta += d_delta * dt;
      omega += d_omega * dt;
    } else if (type === 'SG') {
      // Generador Síncrono Tradicional (lenta oscilación amortiguada)
      const d_delta = omega;
      const d_omega = -1.0 * Math.sin(delta) - 0.5 * omega;
      
      delta += d_delta * dt;
      omega += d_omega * dt;
    }
    
    x.push(delta);
    y.push(omega);
  }
  
  return { x, y };
};

export default function PhasePlanePlot({ lang }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Hasta 20 (segundos de simulación)

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(t => {
        if (t >= 20) {
          setIsPlaying(false);
          return 20;
        }
        return t + 0.1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const gflData = generatePhaseData('GFL', currentTime);
  const gfmData = generatePhaseData('GFM', currentTime);
  const sgData = generatePhaseData('SG', currentTime);

  const getTexts = () => {
    if (lang === 'en') return {
      title: 'Phase-Plane Diagram: Inverter Convergence',
      xaxis: 'Angle Deviation δ (rad)',
      yaxis: 'Frequency Deviation Δω (rad/s)',
      gfl: 'Grid-Following (GFL) - Divergent',
      gfm: 'Grid-Forming (GFM) - Stable',
      sg: 'Synchronous Generator (SG)'
    };
    return {
      title: 'Diagrama de Plano de Fase: Convergencia de Inversores',
      xaxis: 'Desviación Angular δ (rad)',
      yaxis: 'Desviación de Frecuencia Δω (rad/s)',
      gfl: 'Inversor Grid-Following (GFL) - Divergente',
      gfm: 'Inversor Grid-Forming (GFM) - Estable',
      sg: 'Generador Síncrono Clásico (SG)'
    };
  };

  const texts = getTexts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, minHeight: '400px', width: '100%' }}>
        <BrowserOnly fallback={<div>Cargando gráfico interactivo...</div>}>
          {() => {
            const Plot = require('react-plotly.js').default;
            return (
              <Plot
                data={[
                  {
                    x: gflData.x,
                    y: gflData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#ef4444', width: 3 },
                    name: texts.gfl
                  },
                  {
                    x: gfmData.x,
                    y: gfmData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#10b981', width: 3 },
                    name: texts.gfm
                  },
                  {
                    x: sgData.x,
                    y: sgData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#f59e0b', width: 2, dash: 'dot' },
                    name: texts.sg
                  }
                ]}
                layout={{
                  title: {
                    text: texts.title,
                    font: { color: '#ffffff', size: 16 }
                  },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { color: '#94a3b8' },
                  xaxis: { 
                    title: texts.xaxis, 
                    gridcolor: 'rgba(255,255,255,0.1)',
                    zerolinecolor: 'rgba(255,255,255,0.3)',
                    range: [-2, 2]
                  },
                  yaxis: { 
                    title: texts.yaxis, 
                    gridcolor: 'rgba(255,255,255,0.1)',
                    zerolinecolor: 'rgba(255,255,255,0.3)',
                    range: [-2, 2]
                  },
                  legend: {
                    orientation: 'h',
                    y: -0.2,
                    font: { color: '#e2e8f0' }
                  },
                  margin: { t: 60, r: 20, l: 60, b: 80 },
                  autosize: true
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true, displayModeBar: false }}
              />
            );
          }}
        </BrowserOnly>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '80px'
          }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button 
          onClick={handleReset}
          style={{
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          RESET
        </button>
        
        <input 
          type="range" 
          min="0" 
          max="20" 
          step="0.1"
          value={currentTime}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
        />
        
        <div style={{ fontFamily: 'monospace', color: '#94a3b8', minWidth: '120px', textAlign: 'right' }}>
          T = {currentTime.toFixed(2)}s
        </div>
      </div>
    </div>
  );
}
