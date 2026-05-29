import React, { useMemo, useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Lazy load Plotly para no bloquear el hilo principal
const Plot = React.lazy(() => import('react-plotly.js'));

// Datos constantes (fuera del componente para evitar recreaciones)
const timeSec = [0, 57, 57.12, 76.46, 78.56, 81, 84, 87];
const frequency = [50.0, 49.977, 49.95, 49.8, 49.8, 49.5, 48.0, 0];
const voltage = [418, 418, 417.9, 425, 428, 432, 435, 0];

const events = [
  { t: 57, label: 'Disparo GDR (317 MW)', color: '#f59e0b', yFreq: 49.98, yVolt: 418 },
  { t: 57.12, label: 'G-1 Granada (355 MW)', color: '#ef4444', yFreq: 49.95, yVolt: 417.9 },
  { t: 76.46, label: 'G-2 Badajoz (727 MW)', color: '#ef4444', yFreq: 49.8, yVolt: 425 },
  { t: 78.56, label: 'G-3 Cascada (1.150 MW)', color: '#ef4444', yFreq: 49.8, yVolt: 428 },
  { t: 81, label: '1er UFLS (49.5 Hz)', color: '#f59e0b', yFreq: 49.5, yVolt: 432 },
  { t: 84, label: 'Pérdida sincronismo Francia', color: '#d946ef', yFreq: 48.0, yVolt: 435 },
  { t: 87, label: 'CERO ELÉCTRICO', color: '#000000', yFreq: 0, yVolt: 0 },
];

// RoCoF calculado (derivada discreta) - calculado como constante pura de forma segura para SSR
const rocof = (() => {
  const vals = [];
  for (let i = 0; i < frequency.length - 1; i++) {
    const dt = timeSec[i + 1] - timeSec[i];
    const df = frequency[i + 1] - frequency[i];
    vals.push({ t: timeSec[i], value: df / dt });
  }
  vals.push({ t: timeSec[frequency.length - 1], value: null }); // último punto sin RoCoF
  return vals;
})();

function CollapseSismographInner({ showRoCoF = false }) {
  const plotData = useMemo(() => {
    const traces = [
      {
        x: timeSec,
        y: frequency,
        name: 'Frecuencia (Hz)',
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#06b6d4', width: 3 },
        marker: { size: 8, color: '#06b6d4' },
        yaxis: 'y',
        hovertemplate: '<b>t=%{x:.1f} s</b><br>Frecuencia: %{y:.2f} Hz<extra></extra>',
      },
      {
        x: timeSec,
        y: voltage,
        name: 'Tensión Carmona (kV)',
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#ef4444', width: 3, dash: 'dot' },
        marker: { size: 8, color: '#ef4444' },
        yaxis: 'y2',
        hovertemplate: '<b>t=%{x:.1f} s</b><br>Tensión: %{y:.0f} kV<extra></extra>',
      },
    ];

    if (showRoCoF) {
      traces.push({
        x: rocof.map(p => p.t),
        y: rocof.map(p => p.value),
        name: 'RoCoF (Hz/s)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#a78bfa', width: 2, dash: 'dashdot' },
        yaxis: 'y3',
        hovertemplate: '<b>t=%{x:.1f} s</b><br>RoCoF: %{y:.2f} Hz/s<extra></extra>',
      });
    }

    return traces;
  }, [showRoCoF]);

  const layout = useMemo(() => {
    const shapes = events.map(ev => ({
      type: 'line',
      x0: ev.t,
      x1: ev.t,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: ev.color, width: 1.5, dash: 'dash' },
    }));

    const annotations = events.map(ev => ({
      x: ev.t,
      y: ev.yFreq + 0.8,
      xref: 'x',
      yref: 'y',
      text: ev.label,
      showarrow: true,
      arrowhead: 2,
      arrowcolor: ev.color,
      ax: -40,
      ay: -30,
      font: { size: 10, color: ev.color },
      bgcolor: 'rgba(0,0,0,0.7)',
      borderpad: 4,
    }));

    const hlines = [
      { t0: 0, t1: 87, y: 49.5, label: 'UFLS 49.5 Hz', color: '#f59e0b' },
      { t0: 0, t1: 87, y: 49.0, label: 'UFLS 49.0 Hz', color: '#ef4444' },
      { t0: 0, t1: 87, y: 435, label: 'Límite 435 kV', color: '#ef4444', yref: 'y2' },
      { t0: 0, t1: 87, y: 420, label: 'Alerta 420 kV', color: '#f59e0b', yref: 'y2' },
    ].map(th => ({
      type: 'line',
      x0: th.t0,
      x1: th.t1,
      y0: th.y,
      y1: th.y,
      line: { color: th.color, width: 1, dash: 'dash' },
      label: { text: th.label, textposition: 'end', font: { size: 9, color: th.color } },
      yref: th.yref || 'y',
    }));

    const yaxes = {
      yaxis: {
        title: 'Frecuencia (Hz)',
        range: [45, 51],
        gridcolor: 'rgba(255,255,255,0.1)',
        color: '#06b6d4',
        tickformat: '.2f',
      },
      yaxis2: {
        title: 'Tensión (kV)',
        overlaying: 'y',
        side: 'right',
        range: [0, 500],
        gridcolor: 'rgba(0,0,0,0)',
        color: '#ef4444',
        tickformat: '.0f',
      },
    };

    if (showRoCoF) {
      yaxes.yaxis3 = {
        title: 'RoCoF (Hz/s)',
        overlaying: 'y',
        side: 'right',
        position: 0.9,
        range: [-2, 1],
        gridcolor: 'rgba(0,0,0,0)',
        color: '#a78bfa',
        tickformat: '.1f',
      };
    }

    return {
      title: {
        text: 'Sismógrafo del colapso: Frecuencia y Tensión (27 segundos)',
        font: { size: 16, color: '#e0ddd5' },
      },
      xaxis: {
        title: 'Tiempo (s) desde 12:32:00 CEST',
        range: [0, 90],
        gridcolor: 'rgba(255,255,255,0.1)',
        tick0: 0,
        dtick: 10,
      },
      ...yaxes,
      shapes: [...shapes, ...hlines],
      annotations,
      plot_bgcolor: 'rgba(0,0,0,0)',
      paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#a0a0b0', family: 'Inter, sans-serif' },
      height: 550,
      margin: { l: 80, r: showRoCoF ? 120 : 80, t: 80, b: 60 },
      legend: { orientation: 'h', y: -0.2 },
    };
  }, [showRoCoF]);

  return (
    <div style={{ width: '100%', minHeight: 500 }} role="img" aria-label="Sismógrafo interactivo">
      <React.Suspense fallback={<div style={{ color: '#a0a0b0', textAlign: 'center', paddingTop: 200 }}>Cargando sismógrafo...</div>}>
        <Plot
          data={plotData}
          layout={layout}
          config={{
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </React.Suspense>
    </div>
  );
}

export default function CollapseSismograph({ showRoCoF = false }) {
  return (
    <BrowserOnly fallback={<div style={{ color: '#a0a0b0' }}>Cargando componente...</div>}>
      {() => <CollapseSismographInner showRoCoF={showRoCoF} />}
    </BrowserOnly>
  );
}
