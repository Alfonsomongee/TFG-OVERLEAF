import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Simulador de dinámica de fase
const generateFullPhaseData = (type, timeLimit) => {
  const dt = 0.01;
  let delta = 0; // Desviación del ángulo
  let omega = 0; // Desviación de frecuencia (d_delta/dt)
  
  const x = [];
  const y = [];
  
  // Condición inicial (perturbación)
  delta = 0.1;
  omega = 0.5;

  for (let t = 0; t <= timeLimit; t += dt) {
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

// Generamos los datos completos solo una vez fuera del componente
const FULL_TIME = 20;
const GFL_FULL = generateFullPhaseData('GFL', FULL_TIME);
const GFM_FULL = generateFullPhaseData('GFM', FULL_TIME);
const SG_FULL = generateFullPhaseData('SG', FULL_TIME);

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

  // dt es 0.01, por lo que cada 0.1s son 10 índices
  const currentIndex = Math.floor(currentTime * 100);
  
  const gflData = { x: GFL_FULL.x.slice(0, currentIndex), y: GFL_FULL.y.slice(0, currentIndex) };
  const gfmData = { x: GFM_FULL.x.slice(0, currentIndex), y: GFM_FULL.y.slice(0, currentIndex) };
  const sgData = { x: SG_FULL.x.slice(0, currentIndex), y: SG_FULL.y.slice(0, currentIndex) };

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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Contenedor con altura estricta para evitar que el gráfico empuje el texto al redibujarse */}
      <div style={{ height: '650px', width: '100%', position: 'relative', overflow: 'hidden' }}>
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
                  datarevision: currentTime // Evita que plotly redibuje y "rebote" calculando tamaños
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
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
      
      {/* Explicación del diagrama */}
      <div style={{
        marginTop: '1rem',
        padding: '1.5rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#e2e8f0',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        <h4 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '0.5rem' }}>
          {lang === 'es' ? '¿Qué significa este diagrama?' : 'What does this diagram mean?'}
        </h4>
        <p style={{ margin: 0 }}>
          {lang === 'es' 
            ? 'Este es un "Diagrama de Plano de Fase". Muestra cómo reacciona un generador cuando la red sufre una sacudida (una perturbación). El centro de la cruz (0, 0) es la estabilidad perfecta. Al darle a PLAY, ves cómo tres tecnologías intentan volver a la estabilidad:' 
            : 'This is a "Phase-Plane Diagram". It shows how a generator reacts when the grid suffers a shock. The center (0,0) represents perfect stability. Press PLAY to see how three technologies try to regain stability:'}
        </p>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#10b981' }}>Línea Verde (GFM - Grid Forming):</strong> {lang === 'es' ? 'Actúa como un amortiguador moderno. Va directo al centro (0,0) rápidamente y se estabiliza. Es la tecnología que salvaría la red.' : 'Acts as a modern shock absorber. It spirals directly to the center (0,0) quickly and stabilizes.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#f59e0b' }}>Línea Naranja (Generador Tradicional):</strong> {lang === 'es' ? 'Es un generador pesado que gira (turbina clásica). Tarda más en estabilizarse dando vueltas, pero poco a poco llega al centro.' : 'A heavy rotating generator. Takes longer to stabilize, spiraling slowly to the center.'}
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>Línea Roja (GFL - Grid Following):</strong> {lang === 'es' ? 'La tecnología actual de los inversores. Al intentar seguir una red inestable, se confunde, oscila cada vez más fuerte (espiral hacia afuera) y colapsa el sistema.' : 'Current inverter technology. When following an unstable grid, it gets confused, oscillates wildly outwards, and collapses.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
