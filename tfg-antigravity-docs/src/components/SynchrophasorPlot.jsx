import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PolarComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import styles from './InteractiveGraphicsGallery.module.css';

echarts.use([PolarComponent, TooltipComponent, TitleComponent, CustomChart, CanvasRenderer]);

const NUM_VECTORS = 15;

// Generate realistic simulated PMU data for 100 frames (2 seconds at 50Hz, scaled for animation)
const generatePhasorData = (progress) => {
  // progress goes from 0 to 100
  const data = [];
  
  // Phase 1 (0-30): Stable Operation
  // Phase 2 (30-60): Fault triggers, chaotic bursting oscillations
  // Phase 3 (60-100): Voltage collapse, magnitudes approach zero
  
  for (let i = 0; i < NUM_VECTORS; i++) {
    let angle, mag, color;
    
    // Group vectors into regions: North (stable), South (unstable)
    const isSouth = i % 2 !== 0; 
    
    if (progress < 30) {
      // Stable
      const baseAngle = isSouth ? 25 : 15;
      angle = baseAngle + (Math.random() * 4 - 2);
      mag = 1.0 + (Math.random() * 0.02 - 0.01);
      color = isSouth ? '#f59e0b' : '#3b82f6';
    } else if (progress < 60) {
      // Bursting Oscillations
      const instability = (progress - 30) / 30; // 0 to 1
      if (isSouth) {
        angle = 25 + Math.sin(progress * i * 0.5) * 180 * instability;
        mag = 1.0 - (instability * 0.3) + (Math.random() * 0.2 - 0.1);
        color = '#ef4444'; // Turns red
      } else {
        angle = 15 + Math.sin(progress * i * 0.2) * 45 * instability;
        mag = 1.0 - (instability * 0.1);
        color = '#3b82f6';
      }
    } else {
      // Collapse
      const collapse = (progress - 60) / 40; // 0 to 1
      if (isSouth) {
        angle = (Math.random() * 360);
        mag = Math.max(0, 0.7 - collapse * 0.7);
        color = '#ef4444';
      } else {
        angle = 15 + Math.sin(progress * 10) * 10;
        mag = Math.max(0.5, 0.9 - collapse * 0.4);
        color = '#3b82f6';
      }
    }
    
    data.push({
      value: [mag, angle],
      itemStyle: { color }
    });
  }
  
  return data;
};

export default function SynchrophasorPlot({ lang }) {
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return p + 0.5; // 50Hz update rate equivalent (200 frames total for 4 seconds)
      });
    }, 20); // 20ms = 50Hz
    return () => clearInterval(interval);
  }, [isPlaying]);

  const baseOption = useMemo(() => ({
    animation: false,
    title: {
      text: lang === 'es' ? 'Desviación Angular Fasorial (PMU)' : 'Phasor Angular Deviation (PMU)',
      subtext: lang === 'es' ? 'Falla del Transformador Granada 400/220kV' : 'Granada 400/220kV Transformer Fault',
      left: 'center',
      top: '5%',
      textStyle: { color: '#ffffff', fontSize: 22, fontWeight: '700', textShadowBlur: 10, textShadowColor: 'rgba(255,255,255,0.3)' },
      subtextStyle: { color: '#94a3b8', fontSize: 14 }
    },
    polar: { center: ['50%', '60%'], radius: '65%' },
    angleAxis: {
      type: 'value',
      min: 0,
      max: 360,
      boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.15)', type: 'dashed' } },
      axisLabel: { formatter: '{value}°', color: '#cbd5e1', fontSize: 13, margin: 15 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    radiusAxis: {
      type: 'value',
      min: 0,
      max: 1.2,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: { formatter: '{value} p.u.', color: '#cbd5e1', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(56, 189, 248, 0.5)',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const mag = params.value[0].toFixed(3);
        const ang = params.value[1].toFixed(2);
        return `<div style="font-family: monospace; padding: 5px;">
                <strong style="color: #cbd5e1">PMU Sensor</strong><br/>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 5px 0;" />
                Tensión RMS: <span style="color:#38bdf8; font-weight: bold;">${mag} p.u.</span><br/>
                Desviación Fase: <span style="color:#f472b6; font-weight: bold;">${ang}°</span>
                </div>`;
      }
    },
    series: [{
      type: 'custom',
      coordinateSystem: 'polar',
      renderItem: function (params, api) {
        const value = [api.value(0), api.value(1)];
        const startPoint = api.coord([0, value[1]]);
        const endPoint = api.coord([value[0], value[1]]);
        const color = api.visual('color');
        return {
          type: 'group',
          children: [{
            type: 'line',
            shape: { x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1] },
            style: api.style({ stroke: color, lineWidth: 4, shadowBlur: 10, shadowColor: color })
          }, {
            type: 'circle',
            shape: { cx: endPoint[0], cy: endPoint[1], r: 7 },
            style: api.style({ fill: color, shadowBlur: 15, shadowColor: color })
          }]
        };
      },
      data: []
    }]
  }), [lang]);

  useEffect(() => {
    if (!chartRef.current) return;
    const eChartsInstance = chartRef.current.getEchartsInstance();
    const newData = generatePhasorData(progress);
    eChartsInstance.setOption({
      series: [{ data: newData }]
    });
  }, [progress]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: '750px' }}>
      <div style={{ flex: 1, minHeight: '650px', backgroundColor: '#0a0f1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}>
        <ReactEChartsCore
          ref={chartRef}
          echarts={echarts}
          option={baseOption}
          style={{ height: '100%', width: '100%', minHeight: '650px' }}
          theme="dark"
          notMerge={false}
          lazyUpdate={true}
        />
      </div>
      
      {/* Controls Container */}
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
          max="100" 
          value={progress}
          onChange={(e) => setProgress(parseFloat(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
        />
        
        <div style={{ fontFamily: 'monospace', color: '#94a3b8', minWidth: '120px', textAlign: 'right' }}>
          T = {(progress * 0.04).toFixed(2)}s
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
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>
          {lang === 'es' ? '¿Qué muestra este gráfico?' : 'What does this graph show?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          {lang === 'es' 
            ? 'Este es un "Diagrama Fasorial" o Polar. Representa la tensión eléctrica en distintos puntos de la red de transporte en tiempo real:'
            : 'This is a "Phasor Diagram" (Polar). It represents the electrical voltage at different points of the transmission grid in real-time:'}
        </p>
        <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{lang === 'es' ? 'El Botón PLAY:' : 'The PLAY button:'}</strong> {lang === 'es' ? 'Simula los 4 segundos críticos del incidente, pasando de la estabilidad al colapso total.' : 'Simulates the 4 critical seconds of the incident, from stability to total collapse.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{lang === 'es' ? 'Las Líneas (Vectores):' : 'The Lines (Vectors):'}</strong> {lang === 'es' ? 'Cada línea es un nudo de la red. Su longitud marca la fuerza del voltaje, y su ángulo marca la sincronización.' : 'Each line is a grid node. Its length marks the voltage strength, and its angle marks synchronization.'}
          </li>
          <li>
            <strong>{lang === 'es' ? 'El círculo "p.u.":' : 'The "p.u." circle:'}</strong> {lang === 'es' ? 'Significa "Por Unidad" (Per Unit). 1.0 p.u. es el voltaje perfecto y normal al 100%. Verás que al final del colapso (cuando se vuelven rojos), los vectores se encogen hacia el centro (0 p.u.), lo que significa que la tensión eléctrica en la red cae a cero: el apagón absoluto.' : 'Stands for "Per Unit". 1.0 p.u. is the perfect 100% normal voltage. Notice how at the end of the collapse (when they turn red), the vectors shrink towards the center (0 p.u.), meaning the electrical voltage drops to zero: total blackout.'}
          </li>
        </ul>
      </div>
    </div>
  );
}
