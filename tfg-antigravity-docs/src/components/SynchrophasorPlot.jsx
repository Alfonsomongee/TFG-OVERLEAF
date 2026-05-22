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
      textStyle: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
      subtextStyle: { color: '#94a3b8' }
    },
    polar: { center: ['50%', '55%'], radius: '70%' },
    angleAxis: {
      type: 'value',
      min: 0,
      max: 360,
      boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.1)', type: 'dashed' } },
      axisLabel: { formatter: '{value}°', color: '#94a3b8' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } }
    },
    radiusAxis: {
      type: 'value',
      min: 0,
      max: 1.2,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      axisLabel: { formatter: '{value} p.u.', color: '#94a3b8' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const mag = params.value[0].toFixed(3);
        const ang = params.value[1].toFixed(2);
        return `<div style="font-family: monospace;">
                <strong>PMU Sensor</strong><br/>
                Tensión RMS: <span style="color:#38bdf8">${mag} p.u.</span><br/>
                Desviación Fase: <span style="color:#f472b6">${ang}°</span>
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
        return {
          type: 'group',
          children: [{
            type: 'line',
            shape: { x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1] },
            style: api.style({ stroke: api.visual('color'), lineWidth: 3 })
          }, {
            type: 'circle',
            shape: { cx: endPoint[0], cy: endPoint[1], r: 5 },
            style: api.style({ fill: api.visual('color') })
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
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, minHeight: '400px' }}>
        <ReactEChartsCore
          ref={chartRef}
          echarts={echarts}
          option={baseOption}
          style={{ height: '100%', width: '100%' }}
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
    </div>
  );
}
