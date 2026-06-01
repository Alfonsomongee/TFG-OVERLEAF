import React, { useState, useEffect, useCallback, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Proyección geográfica simplificada ──────────────────────────────────────
// Convierte coordenadas lon/lat reales a píxeles en un viewBox 800×560
// Bounds ibéricos: lon [-9.5, 3.4], lat [35.9, 43.9]
// ============================================================
// CONTORNO DE LA PENÍNSULA IBÉRICA (ALTA RESOLUCIÓN)
// ============================================================
const IBERIA_PATH = 'M 120,90 C 125,82 135,75 148,72 C 162,68 178,66 192,65 C 210,63 230,62 250,62 C 272,62 290,60 308,56 C 326,52 342,48 356,45 C 370,42 380,40 388,40 C 396,42 402,46 406,52 C 408,58 408,64 406,70 C 404,74 400,78 396,80 C 392,78 388,76 384,78 C 380,82 378,88 378,94 C 380,102 384,112 390,120 C 396,128 400,136 402,144 C 400,152 396,158 390,162 C 384,166 378,172 372,178 C 366,186 360,194 356,202 C 352,212 348,222 342,232 C 336,242 330,250 324,256 C 318,260 310,262 302,264 C 294,266 286,264 280,260 C 274,256 268,250 264,244 C 260,238 256,234 250,232 C 244,232 238,234 232,238 C 226,242 220,244 214,244 C 208,244 202,242 198,238 C 192,234 186,230 180,226 C 174,220 168,214 162,208 C 156,202 150,196 144,190 C 138,182 132,174 126,166 C 120,158 114,150 108,142 C 102,134 96,126 92,118 C 88,110 84,102 80,94 C 88,88 98,84 108,86 C 112,88 116,90 120,90 Z';
const BALEARES_PATH = 'M 520,220 C 530,215 540,212 548,214 C 556,218 560,226 558,234 C 556,242 548,248 538,248 C 528,248 518,244 512,238 C 508,232 508,224 512,218 C 514,216 518,218 520,220 Z M 570,200 C 578,198 584,200 586,206 C 584,214 576,218 570,216 C 564,212 562,204 566,200 C 568,199 569,199 570,200 Z M 490,260 C 496,256 504,256 508,262 C 506,270 498,274 492,272 C 486,268 484,262 490,260 Z M 486,278 C 490,276 494,278 494,282 C 492,286 488,286 486,284 C 484,282 484,280 486,278 Z';

const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

// ─── Contorno simplificado de la Península Ibérica (SVG path) ─────────────────
// Path derivado de coordenadas geográficas reales, proyectadas al viewBox 800×560


// Portugal aproximado (parte oeste)


// ─── Nodos con coordenadas reales verificadas ────────────────────────────────
const NODES_ES = [
  {
    id: 'GRN', lon: -3.60, lat: 37.25,
    name: 'Granada\n(Caparacena)',
    desc: 'DISPARO RAÍZ\n−355 MW · −165 MVAr\n(ENTSO-E p.28)',
    activationTime: 0, group: 'collapse',
  },
  {
    id: 'SEV', lon: -5.95, lat: 37.40,
    name: 'Sevilla\n(Alcores)',
    desc: 'Efecto dominó sur\nSobrecarga masiva',
    activationTime: 3, group: 'collapse',
  },
  {
    id: 'BAD', lon: -6.97, lat: 38.88,
    name: 'Badajoz\n(Guillena)',
    desc: 'Colapso de tensión\nNúñez de Balboa',
    activationTime: 5, group: 'collapse',
  },
  {
    id: 'MAD', lon: -3.70, lat: 40.42,
    name: 'Madrid\n(Morata)',
    desc: 'Contención central\nÚltima resistencia',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'ALM', lon: -5.87, lat: 39.75,
    name: 'Almaraz\n(Nuclear)',
    desc: 'Inercia base\n2 × 1.066 MW',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'ZAR', lon: -0.88, lat: 41.65,
    name: 'Aragón\n(Puente)',
    desc: 'Corredor norte\nPuente transpirenaico',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'BAR', lon: 2.02, lat: 41.47,
    name: 'Cataluña\n(Rubí)',
    desc: 'Resistencia este\nConexión AC Francia',
    activationTime: 0, group: 'stable',
  },
  {
    id: 'LIS', lon: -9.14, lat: 38.72,
    name: 'Lisboa\n(Rele)',
    desc: 'Desequilibrio\nOscilaciones 0.21 Hz',
    activationTime: 6, group: 'portugal',
  },
  {
    id: 'POR', lon: -8.61, lat: 41.15,
    name: 'Porto\n(Norte)',
    desc: 'Compensación\nCorrector de tensión',
    activationTime: 0, group: 'portugal',
  },
  {
    id: 'FR', lon: 2.81, lat: 42.72,
    name: 'Francia\n(Baixas)',
    desc: 'Rescate externo\nInterconexión AC + HVDC',
    activationTime: 10, group: 'france',
  },
];

// ─── Links con coordenadas derivadas de los nodos ────────────────────────────
const LINKS = [
  { source: 'GRN', target: 'SEV', isCritical: true,  activationTime: 2,  label: 'Sobrecarga' },
  { source: 'SEV', target: 'BAD', isCritical: true,  activationTime: 4,  label: 'Cascada' },
  { source: 'BAD', target: 'LIS', isCritical: true,  activationTime: 6,  label: '0.8 Hz' },
  { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0,  label: '' },
  { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0,  label: '' },
  { source: 'ZAR', target: 'FR',  isCritical: true,  activationTime: 10, label: 'HVDC' },
  { source: 'BAR', target: 'FR',  isCritical: true,  activationTime: 10, label: 'AC' },
];

// ─── Log de eventos ───────────────────────────────────────────────────────────
const EVENT_LOG = [
  { t: 0,  msg: '12:32:57 — Sistema operativo. Penetración renovable ≈82%. H_eq ≈ 2,4 s.' },
  { t: 2,  msg: '12:32:57 — DISPARO RAÍZ: Trafo 400/220 kV Granada. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t: 4,  msg: '12:33:00-10 — Tensión >440 kV. Protecciones ANSI 59 disparan plantas FV en cascada.' },
  { t: 6,  msg: '12:33:10 — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). Isla ibérica se debilita.' },
  { t: 8,  msg: '12:33:18 — Frecuencia cae a 48,46 Hz. HVDC INELFE exporta 1.000 MW (PMODE1).' },
  { t: 10, msg: '12:33:21 — PÉRDIDA DE SINCRONISMO. Apertura enlaces AC transpirenaicos (ANSI 78).' },
  { t: 12, msg: '12:33:24 — CERO DE TENSIÓN SISTÉMICO. 15 GW perdidos en 30 segundos.' },
];

// ─── Colores por grupo ────────────────────────────────────────────────────────
const GROUP_COLORS = {
  collapse:  { fill: '#ef4444', stroke: '#fca5a5', pulse: true },
  stable:    { fill: '#10b981', stroke: '#6ee7b7', pulse: false },
  portugal:  { fill: '#f59e0b', stroke: '#fcd34d', pulse: false },
  france:    { fill: '#3b82f6', stroke: '#93c5fd', pulse: false },
};

// ─── Componente principal ─────────────────────────────────────────────────────
function TopologyContent({ lang = "es" }) {

  const isDark = true; // Topology is always dark-themed
  const palette = {
    landGradientStart: '#142c4a',
    landGradientEnd: '#0b1827',
    landStroke: 'rgba(56, 189, 248, 0.25)',
    gridLine: 'rgba(255, 255, 255, 0.03)',
    reliefLight: 'rgba(255, 255, 255, 0.04)',
    reliefDark: 'rgba(0, 0, 0, 0.2)',
  };

  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 14;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 900);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Nodos con coordenadas proyectadas precalculadas
  const nodes = useMemo(() => NODES_ES.map(n => {
    const {x, y} = geoToSvg(n.lat, n.lon);
    const isActive = simTime >= n.activationTime;
    const isCollapsing = n.group === 'collapse' && isActive;
    return { ...n, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime || e.t <= simTime).reverse().slice(0, 4);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'var(--bg-0, #050a14)',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body, sans-serif)',
    }}>

      {/* ── SVG MAPA ─────────────────────────────────────────────────── */}
      <svg viewBox="0 0 1000 800"
        style={{ width: '100%', display: 'block' }}
        aria-label="Mapa topológico de la red ibérica durante el colapso del 28-A"
      >
        
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowRed">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          
          <clipPath id="clip-iberia">
            <path d={IBERIA_PATH} />
            <path d={BALEARES_PATH} />
          </clipPath>
          <radialGradient id="landGrad" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </radialGradient>
          <filter id="relief" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor={palette.reliefDark} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Mar de fondo */}
        <rect width="1000" height="800" fill="var(--bg-0, #050a14)" />
        <rect width="1000" height="800" fill="rgba(0,40,80,0.15)" />

        <g filter="url(#relief)">
          <path d={IBERIA_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
          <path d={BALEARES_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity="0.5">
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`rel-${i}`} d={`M ${80 + i * 40} ${60 + i * 25} C ${400 + i * 15} ${100 + i * 10}, ${600 - i * 20} ${500 - i * 15}, ${200 + i * 30} ${600 - i * 20}`} fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6" />
          ))}
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`grid-h-${i}`} x1={0} y1={(VIEWBOX.height / 12) * i} x2={VIEWBOX.width} y2={(VIEWBOX.height / 12) * i} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`grid-v-${i}`} x1={(VIEWBOX.width / 14) * i} y1={0} x2={(VIEWBOX.width / 14) * i} y2={VIEWBOX.height} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
        </g>


        {/* ── LINKS ─────────────────────────────────────────────────── */}
        {LINKS.map((link, i) => {
          const src = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          if (!src || !tgt) return null;

          const isActive = simTime >= link.activationTime;
          const isCollapsing = link.isCritical && isActive && simTime < 12;
          const isLost = link.isCritical && simTime >= 10 && link.target === 'FR';

          let stroke = 'rgba(0,217,255,0.08)';
          let strokeWidth = 1;
          let dashArray = '4 4';

          if (isActive && !isLost) {
            stroke = link.isCritical
              ? (isCollapsing ? '#ef4444' : 'rgba(0,217,255,0.35)')
              : 'rgba(0,217,255,0.25)';
            strokeWidth = link.isCritical ? 2.5 : 1.5;
            dashArray = link.isCritical ? 'none' : '4 3';
          }

          // Flecha de dirección
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const len = Math.sqrt(dx*dx + dy*dy);
          const mx = src.x + dx * 0.5;
          const my = src.y + dy * 0.5;

          return (
            <g key={i}>
              <line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                opacity={isLost ? 0.15 : 1}
              />
              {/* Label de la línea si tiene */}
              {link.label && isActive && (
                <text
                  x={mx} y={my - 6}
                  fill={link.isCritical ? '#f59e0b' : 'rgba(0,217,255,0.5)'}
                  fontSize="9"
                  fontFamily="var(--font-mono, monospace)"
                  textAnchor="middle"
                >
                  {link.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── NODOS ─────────────────────────────────────────────────── */}
        {nodes.map(node => {
          const colors = GROUP_COLORS[node.group] || GROUP_COLORS.stable;
          const isHovered = hoveredNode === node.id;
          const r = node.group === 'france' ? 14 : (node.group === 'collapse' && node.isActive ? 13 : 10);

          return (
            <g
              key={node.id}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Halo pulsante para nodos en colapso */}
              {node.isCollapsing && (
                <circle
                  cx={node.x} cy={node.y} r={r + 8}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="1"
                  opacity="0.4"
                >
                  <animate attributeName="r" values={`${r+4};${r+14};${r+4}`}
                           dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5"
                           dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Nodo principal */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={node.isActive ? colors.fill : 'rgba(15,30,55,0.9)'}
                stroke={node.isActive ? colors.stroke : 'rgba(0,217,255,0.15)'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={node.isCollapsing ? 'url(#glowRed)' : (node.isActive ? 'url(#glow)' : 'none')}
              />

              {/* Icono de advertencia para nodos en colapso */}
              {node.isCollapsing && (
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle" fontSize="10"
                  fill="#fff" fontWeight="bold"
                >
                  !</text>
              )}

              {/* Etiqueta del nodo */}
              {node.name.split('\n').map((line, li) => (
                <text
                  key={li}
                  x={node.x}
                  y={node.y + r + 13 + li * 12}
                  textAnchor="middle"
                  fontSize={li === 0 ? 10 : 8.5}
                  fontFamily="var(--font-mono, monospace)"
                  fill={node.isActive ? '#e2e8f0' : '#475569'}
                  fontWeight={li === 0 ? '600' : '400'}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* ── TOOLTIP DE NODO ───────────────────────────────────────── */}
        {hoveredNode && (() => {
          const node = nodeMap[hoveredNode];
          if (!node) return null;
          const lines = node.desc.split('\n');
          const tw = 160;
          // Ajuste para no salir del viewBox
          let tx = node.x + 18;
          if (tx + tw > 990) tx = node.x - tw - 18;
          let ty = node.y - 20;

          return (
            <g>
              <rect
                x={tx - 6} y={ty - 14}
                width={tw + 12}
                height={lines.length * 15 + 18}
                rx="4"
                fill="rgba(5,10,20,0.95)"
                stroke="rgba(0,217,255,0.3)"
                strokeWidth="1"
              />
              {lines.map((line, li) => (
                <text
                  key={li}
                  x={tx} y={ty + li * 15}
                  fontSize={li === 0 ? 10 : 9}
                  fill={li === 0 ? '#00d9ff' : '#94a3b8'}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={li === 0 ? '700' : '400'}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })()}
      </svg>

      {/* ── PANEL DE CONTROL ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(5,10,20,0.92)',
        border: '1px solid rgba(0,217,255,0.2)',
        borderRadius: 8,
        padding: '12px 14px',
        width: 260,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 11, letterSpacing: '0.1em',
            color: '#00d9ff', fontWeight: 700,
          }}>
            TOPOLOGÍA RED IBÉRICA
          </span>
          <button
            onClick={handlePlayPause}
            style={{
              background: simTime >= MAX_TIME ? '#10b981' :
                          (isPlaying ? 'rgba(239,68,68,0.2)' : 'rgba(0,217,255,0.15)'),
              border: `1px solid ${simTime >= MAX_TIME ? '#10b981' :
                       (isPlaying ? '#ef4444' : '#00d9ff')}`,
              color: simTime >= MAX_TIME ? '#fff' :
                     (isPlaying ? '#ef4444' : '#00d9ff'),
              padding: '4px 12px', borderRadius: 4,
              cursor: 'pointer', fontSize: 11,
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700, letterSpacing: '0.05em',
            }}
          >
            {simTime >= MAX_TIME ? '↺ REPLAY' : (isPlaying ? '⏸ PAUSA' : '▶ PLAY')}
          </button>
        </div>

        {/* Barra de progreso temporal */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9, color: '#475569',
            fontFamily: 'var(--font-mono, monospace)', marginBottom: 4,
          }}>
            <span>12:32:57</span>
            <span>12:33:27 CEST</span>
          </div>
          <div style={{
            height: 4, background: 'rgba(0,217,255,0.1)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(simTime / MAX_TIME) * 100}%`,
              background: simTime >= 10
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : 'linear-gradient(90deg, #00d9ff, #10b981)',
              borderRadius: 2,
              transition: 'width 0.9s ease, background 0.3s ease',
            }} />
          </div>
        </div>

        {/* Leyenda */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '4px 8px', marginBottom: 10, fontSize: 9,
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {[
            { color: '#ef4444', label: 'Nodo en colapso' },
            { color: '#10b981', label: 'Nodo estable' },
            { color: '#f59e0b', label: 'Portugal' },
            { color: '#3b82f6', label: 'Francia' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%',
                            background: color, flexShrink: 0 }} />
              <span style={{ color: '#94a3b8' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Log de eventos */}
        <div style={{
          borderTop: '1px solid rgba(0,217,255,0.1)',
          paddingTop: 8, maxHeight: 150, overflowY: 'auto',
        }}>
          {visibleLogs.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 9,
                        fontFamily: 'var(--font-mono, monospace)', margin: 0 }}>
              Pulsa PLAY para iniciar la simulación
            </p>
          ) : (
            visibleLogs.map((log, i) => (
              <div key={i} style={{
                fontSize: 9.5,
                fontFamily: 'var(--font-mono, monospace)',
                color: i === 0 ? '#e2e8f0' : '#475569',
                borderLeft: `2px solid ${i === 0 ? '#00d9ff' : 'transparent'}`,
                paddingLeft: 6, marginBottom: 6,
                transition: 'all 0.3s ease',
              }}>
                {log.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function IberianGridTopology({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: '#050a14', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#00d9ff', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando topología de red ibérica…
      </div>
    }>
      {() => <TopologyContent lang={lang} />}
    </BrowserOnly>
  );
}