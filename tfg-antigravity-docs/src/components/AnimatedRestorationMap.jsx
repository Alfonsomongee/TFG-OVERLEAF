import React, { useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ============================================================
// PROYECCIÓN GEOGRÁFICA Y PATHS VECTORIALES
// ============================================================
const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}

function project(lon, lat) {
  const { x, y } = geoToSvg(lat, lon);
  return [x, y];
}

const IBERIA_OUTLINE = [
  [43.78, -7.86],  [43.47, -8.45],  [42.88, -9.28],  [42.03, -8.87],  [41.87, -8.87],
  [41.38, -8.73],  [40.64, -8.75],  [39.36, -9.40],  [38.62, -9.50],  [37.01, -8.91],
  [36.97, -7.85],  [36.01, -5.61],  [36.17, -5.36],  [36.69, -4.41],  [36.72, -3.48],
  [37.20, -1.90],  [37.64, -0.69],  [38.68,  0.23],  [39.58,  0.34],  [40.72,  0.73],
  [41.29,  1.83],  [41.42,  2.22],  [42.43,  3.16],  [42.80,  1.72],  [43.37, -1.79],
  [43.49, -3.80],  [43.57, -5.66],  [43.78, -7.86]
];

const PORTUGAL_OUTLINE = [
  [41.87, -8.87],  [41.52, -6.92],  [39.67, -7.06],  [37.43, -7.44],  [36.97, -7.85],
  [37.01, -8.91],  [38.62, -9.50],  [39.36, -9.40],  [40.64, -8.75],  [41.38, -8.73],
  [41.87, -8.87]
];

const MALLORCA_OUTLINE = [
  [39.96, 3.22],   [39.89, 2.32],   [39.27, 2.84],   [39.25, 3.48],   [39.78, 3.47],
  [39.96, 3.22]
];

function pointsToPath(points) {
  return points.map((p, i) => {
    const { x, y } = geoToSvg(p[0], p[1]);
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ') + ' Z';
}

const IBERIA_PATH = pointsToPath(IBERIA_OUTLINE);
const PORTUGAL_PATH = pointsToPath(PORTUGAL_OUTLINE);
const BALEARES_PATH = pointsToPath(MALLORCA_OUTLINE);

// ─── Las 7 islas eléctricas como polígonos aproximados ───────────────────────
// Cada isla es un conjunto de puntos [lon, lat] que definen su contorno
const ISLANDS = [
  {
    id: 'SUR',
    name: 'Sur\n(Andalucía)',
    color: '#f59e0b',
    restoreTime: 5,
    blackStartTime: 5,
    blackStartType: 'bottom-up',
    anchor: { lon: -4.5, lat: 37.5 },
    restorePercent: 18,
    points: [[-9.5,36.0],[-5.5,35.9],[-1.8,36.8],[-1.5,38.5],[-3.0,39.5],[-5.5,39.0],[-7.5,38.5],[-9.5,37.5]],
  },
  {
    id: 'CEN',
    name: 'Centro\n(Madrid)',
    color: '#00d9ff',
    restoreTime: 6,
    blackStartType: 'top-down',
    anchor: { lon: -3.5, lat: 40.4 },
    restorePercent: 22,
    points: [[-5.5,39.0],[-3.0,39.5],[-1.5,38.5],[0.5,39.0],[1.0,41.0],[-0.5,42.0],[-2.5,42.5],[-5.0,42.0],[-6.0,41.0],[-5.5,39.0]],
  },
  {
    id: 'LEV',
    name: 'Levante\n(Valencia)',
    color: '#10b981',
    restoreTime: 7,
    blackStartType: 'bottom-up',
    anchor: { lon: 0.0, lat: 39.5 },
    restorePercent: 12,
    points: [[-1.5,38.5],[0.8,37.5],[3.4,39.5],[2.5,41.5],[1.0,41.0],[0.5,39.0],[-1.5,38.5]],
  },
  {
    id: 'CAT',
    name: 'Cataluña\n(NE)',
    color: '#a78bfa',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: 1.8, lat: 41.8 },
    restorePercent: 10,
    points: [[1.0,41.0],[2.5,41.5],[3.4,42.8],[1.5,43.5],[0.0,43.0],[-0.5,42.0],[1.0,41.0]],
  },
  {
    id: 'NOR',
    name: 'Norte\n(Euskadi)',
    color: '#f472b6',
    restoreTime: 4,
    blackStartType: 'top-down',
    anchor: { lon: -2.5, lat: 43.0 },
    restorePercent: 8,
    points: [[-5.0,42.0],[-2.5,42.5],[-0.5,42.0],[0.0,43.0],[-0.5,43.8],[-2.0,43.5],[-4.5,43.8],[-6.0,43.5],[-5.5,42.5],[-5.0,42.0]],
  },
  {
    id: 'GAL',
    name: 'Galicia\nLeón',
    color: '#34d399',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: -7.5, lat: 42.5 },
    restorePercent: 8,
    points: [[-9.5,42.0],[-6.0,41.0],[-5.0,42.0],[-5.5,42.5],[-6.0,43.5],[-7.5,43.8],[-9.0,43.8],[-9.5,43.0],[-9.5,42.0]],
  },
  {
    id: 'POR',
    name: 'Portugal',
    color: '#60a5fa',
    restoreTime: 3,
    blackStartType: 'bottom-up',
    anchor: { lon: -8.0, lat: 39.5 },
    restorePercent: 10,
    points: [[-9.5,37.5],[-7.5,38.5],[-6.0,41.0],[-9.5,42.0],[-9.5,37.5]],
  },
];

// ─── Puntos de Black Start verificados ───────────────────────────────────────
const BLACK_START_POINTS = [
  { id: 'CastBode',   lon: -8.27, lat: 39.48, name: 'Castelo de Bode\n(138 MW hidro)', time: 3, type: 'hydro' },
  { id: 'TapOuteiro', lon: -8.42, lat: 41.22, name: 'Tapada do Outeiro\n(CCGT REN)',    time: 3, type: 'ccgt'  },
  { id: 'Aldea',      lon: -6.49, lat: 41.20, name: 'Aldeadávila\n(1.100 MW hidro)',    time: 5, type: 'hydro' },
  { id: 'Hernani',    lon: -1.97, lat: 43.27, name: 'Hernani\n(Conexión Francia)',      time: 2, type: 'france'},
  { id: 'Baixas',     lon:  2.81, lat: 42.72, name: 'Baixas\n(Francia → Cataluña)',     time: 2, type: 'france'},
];

// ─── Log de eventos ────────────────────────────────────────────────────────────
const EVENT_LOG = [
  { time: 0,  msg: '12:33 CEST — Blackout sistémico. 7 islas desenergizadas.' },
  { time: 2,  msg: '~12:44 CEST — TOP-DOWN: Hernani recibe tensión de Francia (31 MW iniciales).' },
  { time: 3,  msg: '~12:45 CEST — BOTTOM-UP: Black Start Castelo de Bode (PT). Tapada do Outeiro activo.' },
  { time: 4,  msg: '~13:04 CEST — Interconexión Marruecos: +900 MW. Norte y Galicia se estabilizan.' },
  { time: 5,  msg: '~16:00 CEST — Aldeadávila (España) inicia Black Start. Isla Sur activa.' },
  { time: 6,  msg: '~14:30 CEST — Madrid Central recupera tensión. Corredor centro conectado.' },
  { time: 7,  msg: '~17:00 CEST — Levante sincroniza con el esqueleto principal.' },
  { time: 8,  msg: '20:22 CEST — Portugal sincroniza frecuencia con continental europeo.' },
  { time: 11, msg: '07:05 (29-A) — 99,95% suministro restituido. Reposición certificada.' },
];

function RestorationContent({ lang = 'es' }) {
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const MAX_TIME = 12;

  useEffect(() => {
    if (!isPlaying || simTime >= MAX_TIME) {
      if (simTime >= MAX_TIME) setIsPlaying(false);
      return;
    }
    const id = setInterval(() => setSimTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [isPlaying, simTime]);

  const handlePlayPause = () => {
    if (simTime >= MAX_TIME) { setSimTime(0); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };

  // Calcular demanda restituida total
  const demandaRestituida = useMemo(() => {
    return ISLANDS.filter(i => simTime >= i.restoreTime)
      .reduce((sum, i) => sum + i.restorePercent, 0);
  }, [simTime]);

  const visibleLogs = EVENT_LOG.filter(e => e.time <= simTime).reverse().slice(0, 4);

  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-0, #050a14)',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 1000 800" style={{ width: '100%', display: 'block' }}>
        <defs>
          <radialGradient id="bgGrad2" cx="50%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#0a1628" />
            <stop offset="100%" stopColor="#050a14" />
          </radialGradient>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke="rgba(0,217,255,0.04)" strokeWidth="0.5"/>
          </pattern>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="800" fill="url(#bgGrad2)" />
        <rect width="1000" height="800" fill="url(#grid2)" />

        {/* Contorno base siempre visible (apagado) */}
        <path d={IBERIA_PATH} fill="rgba(8,15,30,0.9)" stroke="rgba(0,217,255,0.1)" strokeWidth="1" />
        <path d={PORTUGAL_PATH} fill="rgba(8,15,30,0.9)" stroke="rgba(0,217,255,0.1)" strokeWidth="1" strokeDasharray="4 3" />
        <path d={BALEARES_PATH} fill="rgba(8,15,30,0.9)" stroke="rgba(0,217,255,0.1)" strokeWidth="1" />

        {/* ── ISLAS ELÉCTRICAS ─────────────────────────────────────── */}
        {ISLANDS.map(island => {
          const isRestored = simTime >= island.restoreTime;
          const isHovered  = hoveredIsland === island.id;
          const pts = island.points.map(([lon, lat]) => project(lon, lat).join(',')).join(' ');
          const anchorPx = project(island.anchor.lon, island.anchor.lat);

          return (
            <g key={island.id}
               onMouseEnter={() => setHoveredIsland(island.id)}
               onMouseLeave={() => setHoveredIsland(null)}
               style={{ cursor: 'default' }}>

              {/* Polígono de isla */}
              <polygon
                points={pts}
                fill={isRestored
                  ? `${island.color}28`
                  : 'rgba(239,68,68,0.04)'}
                stroke={isRestored
                  ? island.color
                  : 'rgba(239,68,68,0.2)'}
                strokeWidth={isHovered ? 2 : 1}
                strokeDasharray={isRestored ? 'none' : '4 3'}
                style={{ transition: 'all 0.6s ease' }}
              />

              {/* Pulso de activación */}
              {isRestored && (
                <polygon
                  points={pts}
                  fill="none"
                  stroke={island.color}
                  strokeWidth="2"
                  opacity="0"
                >
                  <animate attributeName="opacity"
                           values="0.6;0" dur="1.5s"
                           begin="0s" repeatCount="1" />
                </polygon>
              )}

              {/* Etiqueta de la isla */}
              {island.name.split('\n').map((line, li) => (
                <text
                  key={li}
                  x={anchorPx[0]} y={anchorPx[1] + (li - 0.5) * 13}
                  textAnchor="middle"
                  fontSize={li === 0 ? 10 : 8.5}
                  fontFamily="var(--font-mono, monospace)"
                  fill={isRestored ? island.color : '#374151'}
                  fontWeight={li === 0 ? '700' : '400'}
                  style={{ transition: 'fill 0.5s ease' }}
                >
                  {line}
                </text>
              ))}

              {/* Porcentaje restituido */}
              {isRestored && (
                <text
                  x={anchorPx[0]} y={anchorPx[1] + 22}
                  textAnchor="middle" fontSize={8}
                  fontFamily="var(--font-mono, monospace)"
                  fill="rgba(255,255,255,0.5)"
                >
                  +{island.restorePercent}%
                </text>
              )}
            </g>
          );
        })}

        {/* ── PUNTOS DE BLACK START ─────────────────────────────────── */}
        {BLACK_START_POINTS.map(pt => {
          const isActive = simTime >= pt.time;
          if (!isActive) return null;
          const [px, py] = project(pt.lon, pt.lat);
          const color = pt.type === 'france' ? '#3b82f6'
                      : pt.type === 'hydro'  ? '#10b981'
                      : '#f59e0b';
          return (
            <g key={pt.id}>
              {/* Punto con pulso */}
              <circle cx={px} cy={py} r={5}
                      fill={color} filter="url(#glow2)" />
              <circle cx={px} cy={py} r={5}
                      fill="none" stroke={color} strokeWidth="1.5">
                <animate attributeName="r" values="5;14;5"
                         dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8"
                         dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* ── FLECHAS TOP-DOWN / BOTTOM-UP ─────────────────────────── */}
        {simTime >= 2 && (
          <g opacity="0.6">
            {/* Flecha Francia → Cataluña (top-down) */}
            <path d="M 880,100 L 850,220" stroke="#3b82f6"
                  strokeWidth="2" strokeDasharray="6 3"
                  markerEnd="url(#arrowBlue)" />
          </g>
        )}
        {simTime >= 3 && (
          <g opacity="0.6">
            {/* Flecha Portugal black-start (bottom-up) */}
            <path d="M 120,490 L 150,420" stroke="#10b981"
                  strokeWidth="2" strokeDasharray="6 3" />
          </g>
        )}

        {/* Etiquetas de mar */}
        <text x="40" y="400" fill="rgba(0,217,255,0.18)" fontSize="12"
              fontFamily="var(--font-mono, monospace)"
              transform="rotate(-90, 40, 400)" letterSpacing="2">
          OCÉANO ATLÁNTICO
        </text>
        <text x="700" y="600" fill="rgba(0,217,255,0.18)" fontSize="12"
              fontFamily="var(--font-mono, monospace)" letterSpacing="2"
              transform="rotate(-5, 700, 600)">
          MAR MEDITERRÁNEO
        </text>
        <text x="800" y="100" fill="rgba(59,130,246,0.45)" fontSize="14"
              fontFamily="var(--font-mono, monospace)" letterSpacing="3">
          FRANCE
        </text>
      </svg>
      </div>

      {/* ── PANEL INFERIOR ─────────────────────────────────────── */}
      <div style={{
        background: 'rgba(5,10,20,0.95)',
        borderTop: '1px solid rgba(0,217,255,0.2)',
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        
        {/* COLUMNA IZQUIERDA: Controles y Métricas */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{
              fontFamily: 'var(--font-mono, monospace)', fontSize: 12,
              letterSpacing: '0.1em', color: '#10b981', fontWeight: 700,
            }}>
              REPOSICIÓN IBÉRICA
            </span>
            <button onClick={handlePlayPause} style={{
              background: isPlaying ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${isPlaying ? '#ef4444' : '#10b981'}`,
              color: isPlaying ? '#ef4444' : '#10b981',
              padding: '4px 12px', borderRadius: 4,
              cursor: 'pointer', fontSize: 12,
              fontFamily: 'var(--font-mono, monospace)', fontWeight: 700,
            }}>
              {simTime >= MAX_TIME ? '↺ REINICIAR' : (isPlaying ? '⏸ PAUSA' : '▶ REPRODUCIR')}
            </button>
          </div>

          {/* Contador de demanda restituida */}
          <div style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 6, padding: '10px 14px', marginBottom: 12,
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 32, fontWeight: 700,
              color: demandaRestituida >= 90 ? '#10b981'
                   : demandaRestituida >= 50 ? '#f59e0b' : '#ef4444',
              lineHeight: 1,
              transition: 'color 0.5s ease',
            }}>
              {demandaRestituida}%
            </div>
            <div style={{
              fontSize: 10, color: '#475569',
              fontFamily: 'var(--font-mono, monospace)',
              marginTop: 4,
            }}>
              demanda restituida
            </div>
            <div style={{
              height: 4, background: 'rgba(16,185,129,0.1)',
              borderRadius: 2, marginTop: 8, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${demandaRestituida}%`,
                background: 'linear-gradient(90deg, #10b981, #00d9ff)',
                transition: 'width 0.8s ease',
              }} />
            </div>
          </div>

          {/* Leyenda Top-Down / Bottom-Up */}
          <div style={{
            display: 'flex', gap: 12,
            fontSize: 10, fontFamily: 'var(--font-mono, monospace)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2, background: '#3b82f6',
                            borderRadius: 1 }} />
              <span style={{ color: '#6b7280' }}>Top-Down (FR)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 2, background: '#10b981',
                            borderRadius: 1 }} />
              <span style={{ color: '#6b7280' }}>Bottom-Up (Black Start)</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Log */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(0,217,255,0.05)',
          borderRadius: 6,
          padding: '10px 12px',
          height: '100%',
          minHeight: 140,
          maxHeight: 160,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
          {visibleLogs.map((log, i) => (
            <div key={i} style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono, monospace)',
              color: i === 0 ? '#e2e8f0' : '#4b5563',
              borderLeft: `2px solid ${i === 0 ? '#10b981' : 'transparent'}`,
              paddingLeft: 8, marginBottom: 8,
              transition: 'all 0.3s ease',
            }}>
              {log.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnimatedRestorationMap({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: '#050a14', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#10b981', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando mapa de reposición…
      </div>
    }>
      {() => <RestorationContent lang={lang} />}
    </BrowserOnly>
  );
}