import React, { useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';

// ─── Proyección geográfica (lon/lat → píxeles en viewBox 800×560) ─────────────
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

// ─── Subestaciones con coordenadas reales verificadas ───────────────

const STATIONS = [
  { id: 'GRN', lat: 37.2661, lon: -3.658, name: 'Caparacena (Granada)', type: 'origin', activationTime: 0, desc: `DISPARO RAÍZ — 12:32:57 CEST\nTransformador 400/220 kV dispara por sobretensión\nen colector 220 kV (242 kV = 1,10 p.u.)\nPérdida: −355 MW, −165 MVAr\n(ENTSO-E Factual, p.28)` },
  { id: 'BAD', lat: 38.88, lon: -6.97, name: 'Badajoz', type: 'lost', activationTime: 3, desc: `12:33:16 CEST (t=19s)\nOleas de choque reactiva\nCaída por colapso de tensión\n−730 MW desconectados` },
  { id: 'SEV', lat: 37.3824, lon: -5.9126, name: 'Alcores (Sevilla)', type: 'lost', activationTime: 4, desc: `12:33:17 CEST (t=20s)\nCascada sur: Sevilla + Huelva\n−550 MW desconectados` },
  { id: 'SEG', lat: 40.95, lon: -4.12, name: 'Segovia', type: 'lost', activationTime: 4, desc: `12:33:17 CEST (t=20s)\nCascada norte-centro\nProtecciones ANSI 59 activas` },
  { id: 'ALM', lat: 39.8167, lon: -5.6833, name: 'C.N. Almaraz (Cáceres)', type: 'stable', activationTime: 0, desc: `Central nuclear — Inercia síncrona\n2 × 1.066 MW\nResistió hasta el colapso final` },
  { id: 'MAD', lat: 40.31, lon: -3.5, name: 'Madrid Sur / Morata', type: 'stable', activationTime: 0, desc: `Nudo central\nFrecuencia cayó a 48,7 Hz\nÚltimo punto de contención` },
  { id: 'ZAR', lat: 41.65, lon: -0.88, name: 'Nudo Aragón (Zaragoza)', type: 'stable', activationTime: 0, desc: `Puente transpirenaico\nIntentos de importación Francia` },
  { id: 'BAR', lat: 41.4833, lon: 2.0167, name: 'Rubí (Barcelona)', type: 'stable', activationTime: 0, desc: `Resistencia este\nConexión AC + HVDC con Francia\nEstable hasta pérdida de sincronismo` },
  { id: 'LIS', lat: 38.7223, lon: -9.1393, name: 'Lisboa (REN)', type: 'portugal', activationTime: 5, desc: `12:33:10 CEST\nOscilaciones inter-área 0,21 Hz\nPortugal totalmente afectado` },
  { id: 'POR', lat: 41.1579, lon: -8.6291, name: 'Porto (REN)', type: 'portugal', activationTime: 0, desc: `Red portuguesa\nSufrió el colapso completo\nBlack Start desde Castelo de Bode` },
  { id: 'FR', lat: 42.8, lon: 2.0, name: 'Interconexión Francia', type: 'france', activationTime: 8, desc: `12:33:21 CEST — Pérdida sincronismo\nHVDC INELFE: 1.000 MW PMODE1\nLineas AC: pico 3.800 MW\n(ENTSO-E Factual, pp.12,108)` },
];


// ─── Arcos de propagación ─────────────────────────────────────────────────────
const ARCS = [
  { from: 'GRN', to: 'SEV', activationTime: 2, type: 'cascade', label: 'Sobretensión' },
  { from: 'GRN', to: 'BAD', activationTime: 2, type: 'cascade', label: 'Cascada' },
  { from: 'BAD', to: 'LIS', activationTime: 5, type: 'oscillation', label: '0,21 Hz' },
  { from: 'GRN', to: 'SEG', activationTime: 3, type: 'cascade', label: 'Cascada' },
  { from: 'MAD', to: 'ZAR', activationTime: 0, type: 'stable', label: '' },
  { from: 'ZAR', to: 'BAR', activationTime: 0, type: 'stable', label: '' },
  { from: 'ZAR', to: 'FR',  activationTime: 8, type: 'sync',   label: 'ANSI 78' },
  { from: 'BAR', to: 'FR',  activationTime: 8, type: 'sync',   label: 'HVDC' },
];

// ─── Log de eventos ───────────────────────────────────────────────────────────
const EVENTS = [
  { t: 0, msg: '12:32:57 CEST — DISPARO RAÍZ: Caparacena (Granada). Trafo 400/220 kV. −355 MW, −165 MVAr. (ENTSO-E p.28)' },
  { t: 2, msg: '12:33:00 CEST — Cascada: plantas FV Badajoz y Sevilla cruzan umbral ANSI 59 (>435 kV).' },
  { t: 3, msg: '12:33:05 CEST — Segovia y zona norte-centro afectadas. Tensión >440 kV en barras colectoras.' },
  { t: 5, msg: '12:33:10 CEST — Oscilaciones inter-área alcanzan Portugal (0,21 Hz). REN alerta.' },
  { t: 6, msg: '12:33:18 CEST — Frecuencia cae a 48,46 Hz. HVDC INELFE mantiene 1.000 MW PMODE1.' },
  { t: 8, msg: '12:33:21 CEST — PÉRDIDA DE SINCRONISMO. ANSI 78 abre enlaces AC transpirenaicos.' },
  { t: 10, msg: '12:33:24 CEST — CERO ELÉCTRICO SISTÉMICO. −15 GW en 30 segundos.' },
];

// ─── Colores por tipo de nodo ─────────────────────────────────────────────────
const NODE_COLORS = {
  origin:    { fill: '#ef4444', stroke: '#fca5a5', label: '#fca5a5' },
  lost:      { fill: '#f97316', stroke: '#fdba74', label: '#fdba74' },
  stable:    { fill: '#10b981', stroke: '#6ee7b7', label: '#6ee7b7' },
  portugal:  { fill: '#f59e0b', stroke: '#fcd34d', label: '#fcd34d' },
  france:    { fill: '#3b82f6', stroke: '#93c5fd', label: '#93c5fd' },
};

const ARC_COLORS = {
  cascade:     '#ef4444',
  oscillation: '#f59e0b',
  sync:        '#3b82f6',
  stable:      'rgba(0,217,255,0.2)',
};

function BlackoutMapContent({ lang = 'es' }) {
  const { colorMode } = useColorMode();

  const isDark = colorMode === 'dark';
  const palette = {
    landGradientStart: isDark ? '#142c4a' : '#f0ece1',
    landGradientEnd: isDark ? '#0b1827' : '#d6cebc',
    landStroke: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(100, 116, 139, 0.3)',
    gridLine: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
    reliefLight: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
    reliefDark: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)',
  };

  
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const MAX_TIME = 12;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 800);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Nodos con coordenadas proyectadas
  const nodes = useMemo(() => STATIONS.map(s => {
    const {x, y} = geoToSvg(s.lat, s.lon);
    const isActive = simTime >= s.activationTime;
    const isCollapsing = (s.type === 'lost' || s.type === 'origin') && isActive;
    return { ...s, x, y, isActive, isCollapsing };
  }), [simTime]);

  const nodeMap = useMemo(() =>
    Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const visibleEvents = EVENTS.filter(e => e.t <= simTime).reverse().slice(0, 4);

  // Porcentaje de generación perdida
  const gwLost = useMemo(() => {
    if (simTime >= 10) return 15.0;
    if (simTime >= 8)  return 12.0;
    if (simTime >= 6)  return 8.0;
    if (simTime >= 4)  return 3.5;
    if (simTime >= 2)  return 1.2;
    return 0;
  }, [simTime]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      background: 'transparent',
      borderRadius: 12,
      fontFamily: 'var(--font-body, sans-serif)',
    }}>
      <svg viewBox="0 0 1000 800"
        style={{ width: '100%', display: 'block' }}
        aria-label="Mapa de cascada de desconexiones IBR durante el 28-A"
      >
        
        <defs>
          <filter id="bp-glow-red">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
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

        <g filter="url(#relief)" opacity={simTime >= 8 ? 0.4 : 1} style={{ transition: 'opacity 1s ease' }}>
          <path d={IBERIA_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
          <path d={BALEARES_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity={simTime >= 8 ? 0.2 : 0.5} style={{ transition: 'opacity 1s ease' }}>
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`rel-${i}`} d={`M ${80 + i * 40} ${60 + i * 25} C ${400 + i * 15} ${100 + i * 10}, ${600 - i * 20} ${500 - i * 15}, ${200 + i * 30} ${600 - i * 20}`} fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6" />
          ))}
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity={simTime >= 8 ? 0.2 : 0.6} style={{ transition: 'opacity 1s ease' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`grid-h-${i}`} x1={0} y1={(VIEWBOX.height / 12) * i} x2={VIEWBOX.width} y2={(VIEWBOX.height / 12) * i} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`grid-v-${i}`} x1={(VIEWBOX.width / 14) * i} y1={0} x2={(VIEWBOX.width / 14) * i} y2={VIEWBOX.height} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
        </g>


        {/* ── ARCOS ── */}
        {ARCS.map((arc, i) => {
          const src = nodeMap[arc.from];
          const tgt = nodeMap[arc.to];
          if (!src || !tgt) return null;
          const isActive = simTime >= arc.activationTime;
          if (!isActive && arc.type === 'stable') return null;

          const color = ARC_COLORS[arc.type] || 'rgba(0,217,255,0.2)';
          const mx = (src.x + tgt.x) / 2;
          const my = (src.y + tgt.y) / 2 - 30;

          return (
            <g key={i}>
              <path
                d={`M${src.x},${src.y} Q${mx},${my} ${tgt.x},${tgt.y}`}
                fill="none"
                stroke={isActive ? color : 'rgba(0,217,255,0.06)'}
                strokeWidth={arc.type === 'stable' ? 1 : (isActive ? 2.5 : 1)}
                strokeDasharray={arc.type === 'stable' ? '4 3' : 'none'}
                opacity={isActive ? 1 : 0.3}
              />
              {arc.label && isActive && (
                <text x={mx} y={my - 5}
                      fill={color} fontSize="9"
                      fontFamily="var(--font-mono,monospace)"
                      textAnchor="middle" opacity="0.9">
                  {arc.label}
                </text>
              )}
            </g>
          );
        })}

        {/* ── NODOS ── */}
        {nodes.map(node => {
          const colors = NODE_COLORS[node.type] || NODE_COLORS.stable;
          const isHovered = hoveredNode === node.id;
          const r = node.type === 'france' ? 13 : node.type === 'origin' ? 14 : 10;

          return (
            <g key={node.id}
               style={{ cursor: 'pointer' }}
               onMouseEnter={() => setHoveredNode(node.id)}
               onMouseLeave={() => setHoveredNode(null)}>

              {/* Pulso para nodos activos críticos */}
              {node.isCollapsing && (
                <circle cx={node.x} cy={node.y} r={r}>
                  <animate attributeName="r"
                           values={`${r};${r+12};${r}`}
                           dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="opacity"
                           values="0.6;0;0.6"
                           dur="1s" repeatCount="indefinite"/>
                  <animate attributeName="fill"
                           values={colors.stroke}/>
                </circle>
              )}

              {/* Nodo */}
              <circle
                cx={node.x} cy={node.y} r={r}
                fill={node.isActive ? colors.fill : 'rgba(15,30,55,0.8)'}
                stroke={node.isActive ? colors.stroke : 'rgba(0,217,255,0.1)'}
                strokeWidth={isHovered ? 2.5 : 1.5}
                filter={node.isCollapsing ? 'url(#bp-glow-red)' : 'none'}
              />

              {/* Signo de exclamación en nodos en colapso */}
              {node.isCollapsing && (
                <text x={node.x} y={node.y + 4}
                      textAnchor="middle" fontSize="10"
                      fill="#fff" fontWeight="900">!</text>
              )}

              {/* Etiqueta */}
              <text
                x={node.x} y={node.y + r + 13}
                textAnchor="middle" fontSize="9.5"
                fontFamily="var(--font-mono,monospace)"
                fill={node.isActive ? colors.label : '#374151'}
                fontWeight="600"
              >
                {node.name.split('\n')[0]}
              </text>
            </g>
          );
        })}

        {/* ── TOOLTIP ── */}
        {hoveredNode && (() => {
          const node = nodeMap[hoveredNode];
          if (!node) return null;
          const lines = node.desc.split('\n');
          const tw = 200;
          let tx = node.x + 18;
          if (tx + tw > 980) tx = node.x - tw - 18;
          let ty = node.y - 20;
          if (ty < 10) ty = 10;

          return (
            <g>
              <rect x={tx-6} y={ty-14}
                    width={tw+12} height={lines.length*14+18}
                    rx="4"
                    fill="rgba(5,10,20,0.96)"
                    stroke="rgba(0,217,255,0.3)" strokeWidth="1"/>
              {lines.map((line, li) => (
                <text key={li} x={tx} y={ty + li*14}
                      fontSize={li===0 ? 10 : 9}
                      fill={li===0 ? '#00d9ff' : '#94a3b8'}
                      fontFamily="var(--font-mono,monospace)"
                      fontWeight={li===0 ? '700' : '400'}>
                  {line}
                </text>
              ))}
            </g>
          );
        })()}

        {/* ── OVERLAY COLAPSO TOTAL (paso final) ── */}
        {simTime >= 10 && (
          <g>
            <rect width="1000" height="800" fill="rgba(239,68,68,0.06)"/>
            <text x="500" y="390" textAnchor="middle"
                  fontSize="22" fontFamily="var(--font-mono,monospace)"
                  fontWeight="900" fill="#ef4444"
                  filter="url(#bp-glow-red)" opacity="0.85">
              CERO ELÉCTRICO SISTÉMICO
            </text>
            <text x="500" y="415" textAnchor="middle"
                  fontSize="12" fontFamily="var(--font-mono,monospace)"
                  fill="#fca5a5" opacity="0.7">
              12:33:24 CEST · −15 GW · 60 millones de personas
            </text>
          </g>
        )}
      </svg>

      {/* ── PANEL DE CONTROL ── */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(5,10,20,0.93)',
        border: '1px solid rgba(0,217,255,0.2)',
        borderRadius: 8, padding: '12px 14px', width: 260,
        backdropFilter: 'blur(8px)',
      }}>
        {/* Header + play */}
        <div style={{ display:'flex', alignItems:'center',
                      justifyContent:'space-between', marginBottom: 10 }}>
          <span style={{
            fontFamily: 'var(--font-mono,monospace)', fontSize: 10,
            letterSpacing: '0.1em', color: '#ef4444', fontWeight: 700,
          }}>
            CASCADA IBR 28-A
          </span>
          <button onClick={handlePlayPause} style={{
            background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(0,217,255,0.12)',
            border: `1px solid ${isPlaying ? '#ef4444' : '#00d9ff'}`,
            color: isPlaying ? '#ef4444' : '#00d9ff',
            padding: '3px 10px', borderRadius: 4,
            cursor: 'pointer', fontSize: 11,
            fontFamily: 'var(--font-mono,monospace)', fontWeight: 700,
          }}>
            {simTime >= MAX_TIME ? '↺' : (isPlaying ? '⏸' : '▶')}
          </button>
        </div>

        {/* Barra temporal */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display:'flex', justifyContent:'space-between',
                        fontSize: 9, color: '#374151',
                        fontFamily: 'var(--font-mono,monospace)', marginBottom: 3 }}>
            <span>12:32:57</span><span>12:33:27 CEST</span>
          </div>
          <div style={{ height:3, background:'rgba(239,68,68,0.1)',
                        borderRadius:2, overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:2,
              width: `${(simTime/MAX_TIME)*100}%`,
              background: 'linear-gradient(90deg,#f59e0b,#ef4444)',
              transition: 'width 0.8s ease',
            }}/>
          </div>
        </div>

        {/* Contador GW perdidos */}
        <div style={{
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 6, padding: '6px 10px',
          marginBottom: 10, textAlign: 'center',
        }}>
          <div style={{
            fontSize: 26, fontWeight: 700, lineHeight: 1,
            color: gwLost >= 10 ? '#ef4444' : gwLost >= 5 ? '#f97316' : '#f59e0b',
            fontFamily: 'var(--font-mono,monospace)',
            transition: 'color 0.3s ease',
          }}>
            {gwLost.toFixed(1)}
            <span style={{ fontSize: '0.6rem', color: '#4b5563', marginLeft: 4 }}>GW perdidos</span>
          </div>
        </div>

        {/* Leyenda */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr',
                      gap:'3px 8px', marginBottom:8, fontSize:9,
                      fontFamily:'var(--font-mono,monospace)' }}>
          {[
            { color:'#ef4444', label:'Origen colapso' },
            { color:'#f97316', label:'Nodo perdido' },
            { color:'#10b981', label:'Nodo estable' },
            { color:'#3b82f6', label:'Francia (RTE)' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:8, height:8, borderRadius:'50%',
                            background:color, flexShrink:0 }}/>
              <span style={{ color:'#6b7280' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Log de eventos */}
        <div style={{ borderTop:'1px solid rgba(0,217,255,0.1)',
                      paddingTop:8, maxHeight:150, overflowY:'auto' }}>
          {visibleEvents.length === 0 ? (
            <p style={{ color:'#374151', fontSize:9,
                        fontFamily:'var(--font-mono,monospace)', margin:0 }}>
              Pulsa ▶ para iniciar la simulación
            </p>
          ) : visibleEvents.map((ev, i) => (
            <div key={i} style={{
              fontSize:9.5, fontFamily:'var(--font-mono,monospace)',
              color: i===0 ? '#e2e8f0' : '#374151',
              borderLeft: `2px solid ${i===0 ? '#ef4444' : 'transparent'}`,
              paddingLeft:5, marginBottom:5,
              transition:'all 0.3s ease',
            }}>
              {ev.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlackoutPropagationMapBase({ lang = 'es' }) {

  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background:'#050a14', borderRadius:12,
        display:'flex', alignItems:'center', justifyContent:'center',
        color:'#ef4444', fontFamily:'monospace', fontSize:12,
      }}>
        Cargando mapa de cascada IBR…
      </div>
    }>
      {() => <BlackoutMapContent lang={lang}/>}
    </BrowserOnly>
  );
}