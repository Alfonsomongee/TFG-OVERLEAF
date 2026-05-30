import React, { useState, useRef, useMemo } from 'react';
import styles from './styles.module.css';
import { computeMetrics, cartesianToBarycentric, barycentricToCartesian } from './trilemmaModel';

const PRESETS = [
  { label: 'España pre-28A', values: { a: 0.18, b: 0.32, c: 0.50 } },
  { label: 'Post-28A reforzado', values: { a: 0.34, b: 0.30, c: 0.36 } },
  { label: 'PNIEC 2030 BESS-GFM', values: { a: 0.31, b: 0.27, c: 0.42 } },
  { label: 'ERCOT actual', values: { a: 0.42, b: 0.36, c: 0.22 } },
  { label: 'Irlanda DS3', values: { a: 0.45, b: 0.20, c: 0.35 } },
];

const ZONE_COLORS = {
  'COLAPSO': { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#f87171' },
  'TENSIÓN': { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fbbf24' },
  'EQUILIBRIO': { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#34d399' }
};

// ── COMPONENTE SVG INTERACTIVO ───────────────────────────────────────────────

function TrilemmaTriangle({ coords, setCoords, pointColor }) {
  const W = 450;
  const H = 390;
  const L = 340;
  const h_tri = L * Math.sqrt(3) / 2;
  const cx = W / 2;
  const cy = 210;
  
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Vértices del triángulo
  const vTop = { x: cx, y: cy - h_tri * 2 / 3 };
  const vLeft = { x: cx - L / 2, y: cy + h_tri / 3 };
  const vRight = { x: cx + L / 2, y: cy + h_tri / 3 };

  // Posición del punto en el DOM
  const point = barycentricToCartesian(coords.a, coords.b, coords.c, cx, cy, L, h_tri);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
    updateFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updateFromEvent(e);
    }
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const updateFromEvent = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    const newCoords = cartesianToBarycentric(x, y, cx, cy, L, h_tri);
    setCoords(newCoords);
  };

  const handleKeyDown = (e) => {
    const step = 0.05;
    let { a, b, c } = coords;
    
    if (e.key === 'ArrowUp') { a += step; b -= step/2; c -= step/2; }
    else if (e.key === 'ArrowDown') { a -= step; b += step/2; c += step/2; }
    else if (e.key === 'ArrowLeft') { b += step; a -= step/2; c -= step/2; }
    else if (e.key === 'ArrowRight') { c += step; a -= step/2; b -= step/2; }
    else return; // Ignorar si no es una flecha
    
    e.preventDefault();
    
    // Normalización de seguridad tras modificar con teclado
    if (a < 0) { a = 0; const s = b+c; b = b/s; c = c/s; }
    else if (b < 0) { b = 0; const s = a+c; a = a/s; c = c/s; }
    else if (c < 0) { c = 0; const s = a+b; a = a/s; b = b/s; }
    
    const sum = a + b + c;
    setCoords({ a: a/sum, b: b/sum, c: c/sum });
  };

  const riesgo = Math.round(100 * (Math.sqrt(Math.pow(coords.a - 1/3, 2) + Math.pow(coords.b - 1/3, 2) + Math.pow(coords.c - 1/3, 2)) / 0.816496));

  return (
    <div className={styles.triangleContainer}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className={styles.svg}>
        
        {/* Halo del Centroide */}
        <circle cx={cx} cy={cy} r="45" fill="rgba(16, 185, 129, 0.12)" filter="blur(12px)" />
        <circle cx={cx} cy={cy} r="4" fill="rgba(16, 185, 129, 0.5)" />
        <text x={cx} y={cy - 12} textAnchor="middle" fill="rgba(16, 185, 129, 0.65)" fontSize="9" fontFamily="var(--font-mono)">
          EQUILIBRIO (1/3)
        </text>

        {/* Estructura del Triángulo */}
        <polygon
          points={`${vTop.x},${vTop.y} ${vLeft.x},${vLeft.y} ${vRight.x},${vRight.y}`}
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Guías Baricéntricas */}
        <line x1={vTop.x} y1={vTop.y} x2={cx} y2={vLeft.y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
        <line x1={vLeft.x} y1={vLeft.y} x2={cx + L/4} y2={cy - h_tri/4} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
        <line x1={vRight.x} y1={vRight.y} x2={cx - L/4} y2={cy - h_tri/4} stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

        {/* Etiquetas de Vértices */}
        <text x={vTop.x} y={vTop.y - 12} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">SEGURIDAD (S)</text>
        <text x={vLeft.x - 10} y={vLeft.y + 15} textAnchor="end" fill="#94a3b8" fontSize="12" fontWeight="bold">EQUIDAD (E)</text>
        <text x={vRight.x + 10} y={vRight.y + 15} textAnchor="start" fill="#94a3b8" fontSize="12" fontWeight="bold">SOSTENIBILIDAD (A)</text>

        {/* Área de Captura de Eventos (Invisible pero Clickable) */}
        <polygon
          points={`${vTop.x},${vTop.y} ${vLeft.x},${vLeft.y} ${vRight.x},${vRight.y}`}
          fill="transparent"
          cursor={isDragging ? 'grabbing' : 'grab'}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />

        {/* Animación de Peligro si hay alto riesgo (España pre-28A) */}
        {riesgo > 80 && (
          <circle cx={point.x} cy={point.y} r="20" fill="none" stroke={pointColor} strokeWidth="1" opacity="0.6">
            <animate attributeName="r" values="9;28;9" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        )}

        {/* Punto Móvil (Draggable Slider) */}
        <circle
          cx={point.x}
          cy={point.y}
          r="10"
          fill={pointColor}
          className={styles.draggablePoint}
          tabIndex={0}
          role="slider"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(coords.a * 100)}
          aria-valuetext={`Seguridad: ${Math.round(coords.a * 100)}%, Equidad: ${Math.round(coords.b * 100)}%, Sostenibilidad: ${Math.round(coords.c * 100)}%. Riesgo Blackout: ${riesgo}%`}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ pointerEvents: 'auto' }}
        />
      </svg>
    </div>
  );
}

// ── COMPONENTE DE BARRA DE SALIDA ────────────────────────────────────────────

function OutputBar({ label, tooltip, value, color }) {
  return (
    <div className={styles.sliderRow}>
      <div className={styles.sliderHeader}>
        <span className={styles.sliderLabel}>{label}</span>
        <span className={styles.sliderValue} style={{ color }}>{value}%</span>
      </div>
      <div className={styles.outputTrack}>
        <div className={styles.outputFill} style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <p className={styles.sliderTooltip}>{tooltip}</p>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL EXPORTADO ───────────────────────────────────────────

export default function EnergyTrilemmaSimulator() {
  // Estado inicial: Presets[0] (España pre-28A)
  const [coords, setCoords] = useState(PRESETS[0].values);

  // Derivar métricas usando la cinemática del modelo
  const metrics = useMemo(() => computeMetrics(coords.a, coords.b, coords.c), [coords]);
  const zoneStyle = ZONE_COLORS[metrics.zone];

  return (
    <div className={styles.wrapper}>
      
      {/* Visualización Gráfica */}
      <TrilemmaTriangle 
        coords={coords} 
        setCoords={setCoords} 
        pointColor={zoneStyle.text} 
      />

      {/* Panel de Control y Outputs */}
      <div className={styles.controls}>
        
        {/* Presets Obligatorios */}
        <div className={styles.presetsSection}>
          <p className={styles.presetsLabel}>Estados de Red Clave</p>
          <div className={styles.presets}>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                className={styles.presetBtn}
                onClick={() => setCoords(p.values)}
                title={`Cargar calibración: ${p.label}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Monitores Baricéntricos (Salidas) */}
        <div className={styles.slidersSection}>
          <OutputBar
            label="Seguridad (α)"
            value={Math.round(coords.a * 100)}
            color="#3b82f6"
            tooltip="Robusteza física: inercia rotatoria y ratio de cortocircuito (SCR)."
          />
          <OutputBar
            label="Equidad (β)"
            value={Math.round(coords.b * 100)}
            color="#8b5cf6"
            tooltip="Asequibilidad: precios mayoristas y accesibilidad de la demanda."
          />
          <OutputBar
            label="Sostenibilidad (γ)"
            value={Math.round(coords.c * 100)}
            color="#10b981"
            tooltip="Descarbonización: penetración de renovables asíncronas y reducción de emisiones."
          />
        </div>

        {/* Zona de Riesgo y Euclidiana */}
        <div
          className={styles.zone}
          style={{ backgroundColor: zoneStyle.bg, borderColor: zoneStyle.border }}
        >
          <span className={styles.zoneLabel} style={{ color: zoneStyle.text }}>
            ZONA DE {metrics.zone}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: 'auto', fontWeight: 'bold' }}>
            Riesgo Blackout: {metrics.riesgo}%
          </span>
        </div>

        {/* Métricas Derivadas */}
        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>H Eq.</span>
            <span className={styles.metricValue} style={{ color: zoneStyle.text }}>
              {metrics.H_total} <span className={styles.metricUnit}>s</span>
            </span>
            <span className={styles.metricNote}>Inercia Equivalente</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>SCR min</span>
            <span className={styles.metricValue} style={{ color: zoneStyle.text }}>
              {metrics.SCR}
            </span>
            <span className={styles.metricNote}>Ratio de Cortocircuito</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Emisiones</span>
            <span className={styles.metricValue}>
              {metrics.emisiones} <span className={styles.metricUnit}>g/kWh</span>
            </span>
            <span className={styles.metricNote}>Intensidad de CO₂</span>
          </div>
          <p className={styles.methodNote}>
            Modelo Baricéntrico: Las métricas derivan de la distancia cartesiana al punto de equilibrio óptimo (Centroide). El riesgo Blackout escala con la distancia a los vértices asimétricos, tal y como detalla el WEC.
          </p>
        </div>
      </div>
    </div>
  );
}
