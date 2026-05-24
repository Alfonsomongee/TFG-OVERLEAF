/* ════════════════════════════════════════════════════════════════════════
   SIMULADOR — LÓGICA DE ECUACIÓN DEL SWING
   ════════════════════════════════════════════════════════════════════════ */

const sim = {
  // Estado
  H: 2.45,
  deltaP_percent: 8.8,
  D: 1.5,
  syntheticInertia: 0,
  weakGrid: false,

  // Simulación
  isRunning: false,
  simulationTime: 0,
  frequency: 50.0,
  deltaF: 0,
  rocof: 0,
  
  historyFreq: [],
  historyRocof: [],
  previousFreq: 50.0,
  maxUflsStage: 0,
  cumulativeShed: 0,

  // Constantes
  F0: 50.0,
  DT_MS: 10,
  DT_S: 0.01,
  MAX_HISTORY: 300,

  // UFLS thresholds
  uflsThresholds: [
    { freq: 49.0, shed: 15, stage: 1 },
    { freq: 48.7, shed: 15, stage: 2 },
    { freq: 48.4, shed: 10, stage: 3 },
    { freq: 48.0, shed: 10, stage: 4 },
  ],

  // Métodos
  step(time) {
    const deltaP_pu = -this.deltaP_percent / 100;
    const currentFreq = this.F0 * (1 + this.deltaF);

    // UFLS: latching load shed
    let newMaxStage = this.maxUflsStage;
    let totalShed = this.cumulativeShed;

    for (let i = 0; i < this.uflsThresholds.length; i++) {
      if (currentFreq <= this.uflsThresholds[i].freq && this.uflsThresholds[i].stage > newMaxStage) {
        newMaxStage = this.uflsThresholds[i].stage;
        totalShed = this.uflsThresholds.slice(0, i + 1).reduce((sum, u) => sum + u.shed, 0);
      }
    }

    this.maxUflsStage = newMaxStage;
    this.cumulativeShed = totalShed;

    // Effective power balance with load shedding
    const loadShed_pu = totalShed / 100;
    let effectiveDeltaP = deltaP_pu + loadShed_pu;

    // Synthetic inertia feedback
    const dDeltaF_dt_raw = (effectiveDeltaP - this.D * this.deltaF) / (2 * this.H);

    if (this.syntheticInertia > 0) {
      effectiveDeltaP -= this.syntheticInertia * dDeltaF_dt_raw;

      // Weak grid oscillation (subsynchronous)
      if (this.weakGrid && this.syntheticInertia > 2.0) {
        const oscillationAmplitude = 0.5 * this.syntheticInertia;
        const oscillationFreq = 0.63; // Hz
        const phaseShift = 2 * Math.PI * oscillationFreq * time;
        effectiveDeltaP += oscillationAmplitude * Math.sin(phaseShift);
      }
    }

    // Final derivative
    const dDeltaF_dt = (effectiveDeltaP - this.D * this.deltaF) / (2 * this.H);

    // Euler integration
    const newDeltaF = this.deltaF + dDeltaF_dt * this.DT_S;
    const newFreq = this.F0 * (1 + newDeltaF);
    const newRocof = (newFreq - this.previousFreq) / this.DT_S;

    this.previousFreq = newFreq;
    this.deltaF = newDeltaF;
    this.frequency = newFreq;
    this.rocof = newRocof;

    // Store history
    this.historyFreq.push({ time, value: parseFloat(newFreq.toFixed(3)) });
    this.historyRocof.push({ time, value: parseFloat(newRocof.toFixed(3)) });

    if (this.historyFreq.length > this.MAX_HISTORY) {
      this.historyFreq.shift();
      this.historyRocof.shift();
    }
  },

  reset() {
    this.isRunning = false;
    this.simulationTime = 0;
    this.frequency = 50.0;
    this.deltaF = 0;
    this.rocof = 0;
    this.previousFreq = 50.0;
    this.maxUflsStage = 0;
    this.cumulativeShed = 0;
    this.historyFreq = [];
    this.historyRocof = [];
  },
};

/* ════════════════════════════════════════════════════════════════════════
   DOM ELEMENTS & EVENT LISTENERS
   ════════════════════════════════════════════════════════════════════════ */

const elements = {
  sliderH: document.getElementById('slider-h'),
  sliderDp: document.getElementById('slider-dp'),
  sliderFfr: document.getElementById('slider-ffr'),
  toggleWeakGrid: document.getElementById('toggle-weak-grid'),
  labelH: document.getElementById('label-h'),
  labelDp: document.getElementById('label-dp'),
  labelFfr: document.getElementById('label-ffr'),
  btnPlay: document.getElementById('btn-play'),
  btnReset: document.getElementById('btn-reset'),
  btnDemo: document.getElementById('btn-demo'),
  timeDisplay: document.getElementById('time-display'),
  readoutFreq: document.getElementById('readout-freq'),
  readoutRocof: document.getElementById('readout-rocof'),
  readoutDeltaF: document.getElementById('readout-deltaf'),
  statusBadge: document.getElementById('status-badge'),
  alertUfls: document.getElementById('alert-ufls'),
  alertRocof: document.getElementById('alert-rocof'),
  alertBlackout: document.getElementById('alert-blackout'),
  chartFreq: document.getElementById('chart-frequency'),
  chartRocof: document.getElementById('chart-rocof'),
};

// Slider listeners
elements.sliderH.addEventListener('input', (e) => {
  sim.H = parseFloat(e.target.value);
  elements.labelH.textContent = sim.H.toFixed(2) + ' s';
});

elements.sliderDp.addEventListener('input', (e) => {
  sim.deltaP_percent = parseFloat(e.target.value);
  elements.labelDp.textContent = sim.deltaP_percent.toFixed(1) + ' %';
});

elements.sliderFfr.addEventListener('input', (e) => {
  sim.syntheticInertia = parseFloat(e.target.value);
  elements.labelFfr.textContent = sim.syntheticInertia.toFixed(2) + ' pu';
});

elements.toggleWeakGrid.addEventListener('change', (e) => {
  sim.weakGrid = e.target.checked;
});

// Play/Reset buttons
elements.btnPlay.addEventListener('click', () => {
  if (!sim.isRunning) {
    sim.isRunning = true;
    elements.btnPlay.textContent = '⏹ Detener';
    elements.sliderH.disabled = true;
    elements.sliderDp.disabled = true;
    elements.sliderFfr.disabled = true;
    elements.toggleWeakGrid.disabled = true;
    elements.btnReset.disabled = true;
  } else {
    sim.isRunning = false;
    elements.btnPlay.textContent = '▶ Simular';
  }
});

elements.btnReset.addEventListener('click', () => {
  sim.reset();
  elements.btnPlay.textContent = '▶ Simular';
  elements.sliderH.disabled = false;
  elements.sliderDp.disabled = false;
  elements.sliderFfr.disabled = false;
  elements.toggleWeakGrid.disabled = false;
  elements.btnReset.disabled = false;
  elements.btnDemo.disabled = false;
  updateUI();
  redrawCharts();
});

elements.btnDemo.addEventListener('click', () => {
  // Load 28A preset and auto-run
  sim.reset();
  sim.H = 2.45;
  sim.deltaP_percent = 8.8;
  sim.D = 1.5;
  sim.syntheticInertia = 0;
  sim.weakGrid = true;

  elements.labelH.textContent = sim.H.toFixed(2) + ' s';
  elements.labelDp.textContent = sim.deltaP_percent.toFixed(1) + ' %';
  elements.labelFfr.textContent = sim.syntheticInertia.toFixed(2) + ' pu';
  elements.sliderH.value = sim.H;
  elements.sliderDp.value = sim.deltaP_percent;
  elements.sliderFfr.value = sim.syntheticInertia;
  elements.toggleWeakGrid.checked = sim.weakGrid;

  // Auto-start simulation after brief delay
  setTimeout(() => {
    sim.isRunning = true;
    elements.btnPlay.textContent = '⏹ Detener';
    elements.sliderH.disabled = true;
    elements.sliderDp.disabled = true;
    elements.sliderFfr.disabled = true;
    elements.toggleWeakGrid.disabled = true;
    elements.btnReset.disabled = true;
    elements.btnDemo.disabled = true;
  }, 100);
});

/* ════════════════════════════════════════════════════════════════════════
   SIMULATION LOOP
   ════════════════════════════════════════════════════════════════════════ */

let lastFrameTime = Date.now();

function simulationLoop() {
  if (sim.isRunning) {
    const now = Date.now();
    const elapsed = (now - lastFrameTime) / 1000; // segundos
    lastFrameTime = now;

    const steps = Math.ceil(elapsed / sim.DT_S);
    
    if (sim.simulationTime + elapsed > 30) {
      sim.isRunning = false;
      elements.btnPlay.textContent = '▶ Simular';
      elements.sliderH.disabled = false;
      elements.sliderDp.disabled = false;
      elements.sliderFfr.disabled = false;
      elements.toggleWeakGrid.disabled = false;
      elements.btnReset.disabled = false;
      elements.btnDemo.disabled = false;
    } else {
      // Run multiple substeps per frame with incremented time
      let t_local = sim.simulationTime;
      for (let i = 0; i < steps; i++) {
        sim.step(t_local);
        t_local += sim.DT_S;
      }
      sim.simulationTime = t_local;
    }
  }

  updateUI();
  redrawCharts();
  requestAnimationFrame(simulationLoop);
}

/* ════════════════════════════════════════════════════════════════════════
   UPDATE UI — READOUTS & STATUS
   ════════════════════════════════════════════════════════════════════════ */

function updateUI() {
  // Time
  elements.timeDisplay.textContent = sim.simulationTime.toFixed(2);

  // Readouts — ROCOF with sign
  elements.readoutFreq.textContent = sim.frequency.toFixed(3);
  elements.readoutRocof.textContent = sim.rocof.toFixed(3);  // Shows sign (negative when falling)
  elements.readoutDeltaF.textContent = sim.deltaF.toFixed(5);

  // Danger states based on ABSOLUTE value
  const rocofAbs = Math.abs(sim.rocof);
  if (rocofAbs > 1.0) {
    elements.readoutRocof.classList.add('danger');
  } else if (rocofAbs > 0.5) {
    elements.readoutRocof.classList.add('warning');
    elements.readoutRocof.classList.remove('danger');
  } else {
    elements.readoutRocof.classList.remove('danger', 'warning');
  }

  // Status badge
  let status = 'NORMAL';
  let statusClass = '';
  if (sim.frequency < 48.0) {
    status = 'BLACKOUT';
    statusClass = 'alarm';
  } else if (rocofAbs > 1.0 || sim.frequency < 48.4) {
    status = 'CRÍTICO';
    statusClass = 'alarm';
  } else if (sim.maxUflsStage > 0 || sim.frequency < 49.0) {
    status = 'UFLS ACTIVO';
    statusClass = 'warning';
  }

  elements.statusBadge.textContent = `● ${status}`;
  elements.statusBadge.className = 'status-badge ' + statusClass;

  // Alerts — based on ABSOLUTE ROCOF value
  elements.alertUfls.classList.toggle('active', sim.maxUflsStage > 0);
  elements.alertRocof.classList.toggle('active', rocofAbs > 1.0);
  elements.alertBlackout.classList.toggle('active', sim.frequency < 48.0);
}

/* ════════════════════════════════════════════════════════════════════════
   CHART RENDERING — CANVAS
   ════════════════════════════════════════════════════════════════════════ */

function redrawCharts() {
  drawFrequencyChart();
  drawRocofChart();
}

function drawFrequencyChart() {
  const canvas = elements.chartFreq;
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  canvas.width = w;
  canvas.height = h;

  // Background — gris carbón oscuro
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  // Determine dynamic Y-axis range
  let yMin = 45;
  let yMax = 50.5;
  
  if (sim.historyFreq.length > 0) {
    const freqs = sim.historyFreq.map(p => p.value);
    const minFreq = Math.min(...freqs);
    const maxFreq = Math.max(...freqs);
    yMin = Math.max(44, Math.floor(minFreq - 0.5));
    yMax = Math.min(51, Math.ceil(maxFreq + 0.5));
    if (yMax - yMin < 2) yMax = yMin + 2;
  }

  const yRange = yMax - yMin;
  const padding = 50;
  const bottomPadding = 60;

  // Draw Y-axis labels — gris claro apagado
  ctx.fillStyle = '#e4e4e7';
  ctx.font = '11px "Courier New"';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const tickSpacing = yRange > 3 ? 1 : 0.5;
  const startTick = Math.ceil(yMin / tickSpacing) * tickSpacing;
  
  for (let freq = startTick; freq <= yMax; freq += tickSpacing) {
    const y = h - bottomPadding - (freq - yMin) / yRange * (h - bottomPadding - padding);
    ctx.fillText(freq.toFixed(1) + ' Hz', w - padding / 2 + 5, y);
    
    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw reference lines — blanco translúcido
  const freqLines = [
    { freq: 50.0, color: 'rgba(255, 255, 255, 0.2)', width: 1 },
    { freq: 49.8, color: 'rgba(217, 119, 6, 0.4)', width: 1.5 },
    { freq: 49.0, color: 'rgba(217, 119, 6, 0.3)', width: 1 },
    { freq: 48.0, color: 'rgba(220, 38, 38, 0.4)', width: 1.5 },
  ];

  for (const line of freqLines) {
    if (line.freq >= yMin && line.freq <= yMax) {
      const y = h - bottomPadding - (line.freq - yMin) / yRange * (h - bottomPadding - padding);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw frequency curve with gradient (verde → rojo)
  if (sim.historyFreq.length > 1) {
    const timeMin = sim.historyFreq[0].time;
    const timeMax = sim.historyFreq[sim.historyFreq.length - 1].time;
    const timeRange = timeMax - timeMin || 1;

    ctx.lineWidth = 2;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'bevel';

    for (let i = 0; i < sim.historyFreq.length - 1; i++) {
      const point1 = sim.historyFreq[i];
      const point2 = sim.historyFreq[i + 1];

      // Interpolate color: verde (#00ff88) → ámbar (#D97706) → rojo (#DC2626)
      const freqForColor = point1.value;
      const colorPos = Math.max(0, Math.min(1, (50.5 - freqForColor) / (50.5 - 45)));
      let color;
      
      if (colorPos < 0.33) {
        // Verde a ámbar
        const t = colorPos / 0.33;
        const r = Math.round(0 + (217 - 0) * t);
        const g = Math.round(255 + (119 - 255) * t);
        const b = Math.round(136 + (6 - 136) * t);
        color = `rgb(${r},${g},${b})`;
      } else if (colorPos < 0.67) {
        // Ámbar a rojo
        const t = (colorPos - 0.33) / 0.34;
        const r = Math.round(217 + (220 - 217) * t);
        const g = Math.round(119 + (38 - 119) * t);
        const b = Math.round(6 + (38 - 6) * t);
        color = `rgb(${r},${g},${b})`;
      } else {
        // Rojo puro
        color = '#dc2626';
      }

      ctx.strokeStyle = color;
      ctx.beginPath();
      
      const x1 = padding + ((point1.time - timeMin) / timeRange) * (w - padding * 1.5);
      const y1 = h - bottomPadding - (point1.value - yMin) / yRange * (h - bottomPadding - padding);
      const x2 = padding + ((point2.time - timeMin) / timeRange) * (w - padding * 1.5);
      const y2 = h - bottomPadding - (point2.value - yMin) / yRange * (h - bottomPadding - padding);

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  // X-axis label
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '11px "Courier New"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Tiempo (s)', w / 2, h - 12);
}

function drawRocofChart() {
  const canvas = elements.chartRocof;
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  canvas.width = w;
  canvas.height = h;

  // Background — gris carbón oscuro
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  // Determine dynamic Y-axis range
  let yMin = 0;
  let yMax = 2.0;

  if (sim.historyRocof.length > 0) {
    const rocofs = sim.historyRocof.map(p => Math.abs(p.value));
    const maxRocof = Math.max(...rocofs);
    if (maxRocof > 2.0) {
      yMax = Math.ceil(maxRocof + 0.2);
    } else {
      yMax = 2.0;
    }
  }

  const yRange = yMax - yMin;
  const padding = 50;
  const bottomPadding = 60;

  // Draw Y-axis labels — gris claro apagado
  ctx.fillStyle = '#e4e4e7';
  ctx.font = '11px "Courier New"';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const tickSpacing = yRange > 2 ? 0.5 : (yRange > 1 ? 0.25 : 0.1);
  const startTick = Math.ceil(yMin / tickSpacing) * tickSpacing;

  for (let rocof = startTick; rocof <= yMax; rocof += tickSpacing) {
    const y = h - bottomPadding - (rocof - yMin) / yRange * (h - bottomPadding - padding);
    ctx.fillText(rocof.toFixed(2), w - padding / 2 + 5, y);
    
    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Reference lines — blanco translúcido
  const rocofLines = [
    { rocof: 0.5, color: 'rgba(217, 119, 6, 0.3)', width: 1 },
    { rocof: 1.0, color: 'rgba(220, 38, 38, 0.4)', width: 1.5 },
  ];

  for (const line of rocofLines) {
    if (line.rocof >= yMin && line.rocof <= yMax) {
      const y = h - bottomPadding - (line.rocof - yMin) / yRange * (h - bottomPadding - padding);
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Draw ROCOF bars (valor absoluto) con colores semánticos
  if (sim.historyRocof.length > 0) {
    const timeMin = sim.historyRocof[0].time;
    const timeMax = sim.historyRocof[sim.historyRocof.length - 1].time;
    const timeRange = timeMax - timeMin || 1;
    
    const sampleRate = Math.max(1, Math.floor(sim.historyRocof.length / 50));
    const displayedBars = Math.ceil(sim.historyRocof.length / sampleRate);
    const barWidth = Math.max(2, (w - padding * 1.5) / Math.max(displayedBars, 1) * 0.65);

    for (let i = 0; i < sim.historyRocof.length; i += sampleRate) {
      const point = sim.historyRocof[i];
      const rocofAbs = Math.abs(point.value);
      const x = padding + ((point.time - timeMin) / timeRange) * (w - padding * 1.5);
      const y = h - bottomPadding - (rocofAbs - yMin) / yRange * (h - bottomPadding - padding);

      // Código de colores semántico
      if (rocofAbs > 1.0) {
        ctx.fillStyle = '#dc2626';  // Rojo puro — crítico
      } else if (rocofAbs > 0.5) {
        ctx.fillStyle = '#d97706';  // Ámbar — advertencia
      } else {
        ctx.fillStyle = '#00ff88';  // Verde esmeralda — seguro
      }

      const barHeight = h - bottomPadding - y;
      ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
    }
  }

  // Zero line
  const zeroY = h - bottomPadding;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, zeroY);
  ctx.lineTo(w - padding, zeroY);
  ctx.stroke();

  // X-axis label
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '11px "Courier New"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Tiempo (s)', w / 2, h - 12);
}

/* ════════════════════════════════════════════════════════════════════════
   STARTUP
   ════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  redrawCharts();
  requestAnimationFrame(simulationLoop);
});
