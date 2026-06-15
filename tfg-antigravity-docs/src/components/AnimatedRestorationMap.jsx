import { useDocLang } from '@site/src/hooks/useDocLang';
import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  MAP_VIEWBOX,
  LAND_PATHS,
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  CITY_POINTS
} from '../data/cartography/naturalEarthIberiaPaths';
import { ADMIN1_FEATURES } from '../data/cartography/naturalEarthIberiaAdmin1Paths';

// ============================================================
// PROYECCIÓN GEOGRÁFICA Y PATHS VECTORIALES
// ============================================================
const GEO_BOUNDS = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
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

function matchesAdmin1(feature, zone) {
  if (zone.country && feature.iso_a2 !== zone.country) return false;
  if (zone.country === 'PT') return true;

  const region = feature.region || '';
  const name = feature.name || '';
  const postal = feature.postal || '';
  return zone.postals?.includes(postal) || zone.regions?.includes(region) || zone.names?.includes(name);
}

// ─── Áreas funcionales de reposición construidas con Admin 1 Natural Earth ────
const ISLANDS = [
  {
    id: 'SUR',
    name: 'Sur\nAndalucía',
    color: '#d97706',
    restoreTime: 5,
    blackStartTime: 5,
    blackStartType: 'bottom-up',
    anchor: { lon: -4.3, lat: 37.4 },
    restorePercent: 18,
    country: 'ES',
    postals: ['AN', 'EX'],
  },
  {
    id: 'CEN',
    name: 'Centro\nMadrid',
    color: '#0e7490',
    restoreTime: 6,
    blackStartType: 'top-down',
    anchor: { lon: -3.6, lat: 40.2 },
    restorePercent: 22,
    country: 'ES',
    postals: ['MD', 'CM'],
    regions: ['Madrid'],
  },
  {
    id: 'CAT',
    name: 'Cataluña\nNE',
    color: '#7c3aed',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: 1.4, lat: 41.6 },
    restorePercent: 12,
    country: 'ES',
    postals: ['CT', 'AR'],
  },
  {
    id: 'NOR',
    name: 'Norte\nEuskadi',
    color: '#be185d',
    restoreTime: 4,
    blackStartType: 'top-down',
    anchor: { lon: -2.5, lat: 43.0 },
    restorePercent: 8,
    country: 'ES',
    postals: ['PV', 'NA', 'CB', 'AS', 'LO'],
  },
  {
    id: 'GAL',
    name: 'Galicia\nLeón',
    color: '#15803d',
    restoreTime: 3,
    blackStartType: 'top-down',
    anchor: { lon: -7.3, lat: 42.6 },
    restorePercent: 8,
    country: 'ES',
    postals: ['GA', 'CL'],
  },
  {
    id: 'POR',
    name: 'Portugal',
    color: '#2563eb',
    restoreTime: 3,
    blackStartType: 'bottom-up',
    anchor: { lon: -8.0, lat: 39.5 },
    restorePercent: 12,
    country: 'PT',
  },
].map((zone) => ({
  ...zone,
  features: ADMIN1_FEATURES.filter((feature) => matchesAdmin1(feature, zone)),
}));

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
  { time: 0,  msg: '12:33 CEST — Blackout sistémico. 6 áreas funcionales desenergizadas.' },
  { time: 2,  msg: '~12:44 CEST — TOP-DOWN: Hernani recibe tensión de Francia (31 MW iniciales).' },
  { time: 3,  msg: '~12:45 CEST — BOTTOM-UP: Black Start Castelo de Bode (PT). Tapada do Outeiro activo.' },
  { time: 4,  msg: '~13:04 CEST — Interconexión Marruecos: +900 MW. Norte y Galicia se estabilizan.' },
  { time: 5,  msg: '~16:00 CEST — Aldeadávila (España) inicia Black Start. Isla Sur activa.' },
  { time: 6,  msg: '~14:30 CEST — Madrid Central recupera tensión. Corredor centro conectado.' },
  { time: 7,  msg: '~17:00 CEST — El corredor mediterráneo queda integrado en el esqueleto principal.' },
  { time: 8,  msg: '20:22 CEST — Portugal sincroniza frecuencia con continental europeo.' },
  { time: 11, msg: '07:05 (29-A) — 99,95% suministro restituido. Reposición certificada.' },
];

function RestorationContent({}) {
  const lang = useDocLang();
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  const th = isDark ? {
    ocean:          '#07182D',
    landMain:       '#173149',
    landNeighbor:   '#10263B',
    coastline:      '#3E6176',
    border:         '#2D4E63',
    adminBorder:    'rgba(118, 151, 168, 0.18)',
    city:           '#8FA8B7',
    cityLabel:      'rgba(210, 224, 232, 0.50)',
  } : {
    ocean:          '#EEF3F2',
    landMain:       '#D9DED4',
    landNeighbor:   '#E7E9E1',
    coastline:      '#9EAA9C',
    border:         '#B7C0B2',
    adminBorder:    'rgba(104, 116, 98, 0.22)',
    city:           '#7D8577',
    cityLabel:      'rgba(60, 67, 58, 0.56)',
  };

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
      background: 'var(--bg-0, var(--chart-bg, #050a14))',
      borderRadius: 12,
      border: '1px solid rgba(0,217,255,0.15)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      <div style={{ position: 'relative', width: '100%' }}>
        <svg viewBox="0 0 1000 800" style={{ width: '100%', display: 'block' }}>
        <defs>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none"
                  stroke={isDark ? "rgba(0,217,255,0.04)" : "rgba(0,0,0,0.04)"} strokeWidth="0.5"/>
          </pattern>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="zoneHalo" x="-18%" y="-18%" width="136%" height="136%">
            <feGaussianBlur stdDeviation="5" result="softZoneBlur"/>
            <feMerge>
              <feMergeNode in="softZoneBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <style>{`
            .restoration-zone {
              transition: opacity 220ms ease, stroke-width 220ms ease, filter 220ms ease;
            }
            .restoration-zone-label {
              transition: fill 220ms ease, opacity 220ms ease;
              pointer-events: none;
            }
            @media (prefers-reduced-motion: reduce) {
              .restoration-zone,
              .restoration-zone-label {
                transition: none;
              }
            }
          `}</style>

          <clipPath id="iberia-clip">
            {COUNTRY_PATHS.ESP?.paths?.map((d, i) => <path key={`clip-esp-${i}`} d={d} />)}
            {COUNTRY_PATHS.PRT?.paths?.map((d, i) => <path key={`clip-prt-${i}`} d={d} />)}
            {COUNTRY_PATHS.AND?.paths?.map((d, i) => <path key={`clip-and-${i}`} d={d} />)}
          </clipPath>
        </defs>

        {/* 1. Fondo/Ocean */}
        <rect width="1000" height="800" fill={th.ocean} />
        <rect width="1000" height="800" fill="url(#grid2)" />

        {/* 2. Land (Tierra) */}
        <g fill={th.landMain}>
          {LAND_PATHS.map((d, i) => <path key={`land-${i}`} d={d} />)}
        </g>
        {/* 3. Países vecinos */}
        <g fill={th.landNeighbor} stroke={th.border} strokeWidth="0.5">
          {COUNTRY_PATHS.FRA?.paths?.map((d, i) => <path key={`fra-${i}`} d={d} />)}
          {COUNTRY_PATHS.MAR?.paths?.map((d, i) => <path key={`mar-${i}`} d={d} />)}
          {COUNTRY_PATHS.DZA?.paths?.map((d, i) => <path key={`dza-${i}`} d={d} />)}
        </g>

        {/* 4. Fronteras / Costas */}
        <g fill={th.landMain}>
          {/* España, Portugal, Andorra */}
          {COUNTRY_PATHS.ESP?.paths?.map((d, i) => <path key={`esp-${i}`} d={d} stroke={th.border} strokeWidth="1" />)}
          {COUNTRY_PATHS.PRT?.paths?.map((d, i) => <path key={`prt-${i}`} d={d} stroke={th.border} strokeWidth="1" />)}
          {COUNTRY_PATHS.AND?.paths?.map((d, i) => <path key={`and-${i}`} d={d} stroke={th.border} strokeWidth="1" />)}
        </g>
        <g fill="none" stroke={th.coastline} strokeWidth="1">
          {COASTLINE_PATHS.map((d, i) => <path key={`coast-${i}`} d={d} />)}
        </g>
        <g fill="none" stroke={th.border} strokeWidth="1" strokeDasharray="4 4">
          {BORDER_PATHS.map((d, i) => <path key={`border-${i}`} d={d} />)}
        </g>

        {/* ── ISLAS ELÉCTRICAS ─────────────────────────────────────── */}
        {ISLANDS.map(island => {
          const isRestored = simTime >= island.restoreTime;
          const isHovered  = hoveredIsland === island.id;
          const anchorPx = project(island.anchor.lon, island.anchor.lat);
          const zoneOpacity = isHovered
            ? 0.36
            : isRestored
              ? 0.25
              : 0.08;
          const zoneStrokeOpacity = isHovered
            ? 0.95
            : isRestored
              ? 0.58
              : 0.22;

          return (
            <g key={island.id}
               onMouseEnter={() => setHoveredIsland(island.id)}
               onMouseLeave={() => setHoveredIsland(null)}
               style={{ cursor: 'default' }}
               clipPath="url(#iberia-clip)">

              <g filter={isHovered ? 'url(#zoneHalo)' : 'none'}>
                {island.features.map((feature) => (
                  <path
                    key={feature.id}
                    className="restoration-zone"
                    d={feature.path}
                    fill={isRestored ? island.color : '#64748b'}
                    fillOpacity={zoneOpacity}
                    stroke={isRestored ? island.color : '#64748b'}
                    strokeOpacity={isHovered ? zoneStrokeOpacity : 0.12}
                    strokeWidth={isHovered ? 1.8 : 0.45}
                    strokeLinejoin="round"
                  />
                ))}
              </g>

              {/* Pulso breve al activarse un área funcional. */}
              {isRestored && (
                <g pointerEvents="none">
                  {island.features.map((feature) => (
                    <path
                      key={`${feature.id}-pulse`}
                      d={feature.path}
                      fill="none"
                      stroke={island.color}
                      strokeWidth="1.6"
                      opacity="0"
                    >
                      <animate attributeName="opacity"
                               values="0.26;0" dur="1.2s"
                               begin="0s" repeatCount="1" />
                      <animate attributeName="stroke-width"
                               values="1.6;3.2" dur="1.2s"
                               begin="0s" repeatCount="1" />
                    </path>
                  ))}
                </g>
              )}

              {isHovered && (
                <g pointerEvents="none">
                  {island.features.map((feature) => (
                    <path
                      key={`${feature.id}-hover`}
                      d={feature.path}
                      fill="none"
                      stroke={island.color}
                      strokeWidth="3"
                      strokeOpacity="0.2"
                    />
                  ))}
                </g>
              )}

              {isRestored && (
                <circle
                  cx={anchorPx[0]}
                  cy={anchorPx[1] + 25}
                  r={isHovered ? 4.2 : 3}
                  fill={island.color}
                  fillOpacity={isHovered ? 0.9 : 0.58}
                  style={{ transition: 'r 220ms ease, fill-opacity 220ms ease' }}
                />
              )}

              {!isRestored && (
                <g pointerEvents="none">
                  {island.features.map((feature) => (
                    <path
                      key={`${feature.id}-offline`}
                      d={feature.path}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="0.8"
                      strokeOpacity="0.16"
                    />
                  ))}
                </g>
              )}

              {/* Etiqueta de la isla */}
              {island.name.split('\n').map((line, li) => (
                <text
                  className="restoration-zone-label"
                  key={li}
                  x={anchorPx[0]} y={anchorPx[1] + (li - 0.5) * 13}
                  textAnchor="middle"
                  fontSize={li === 0 ? 10 : 8.5}
                  fontFamily="var(--font-mono, monospace)"
                  fill={isRestored ? island.color : (isDark ? '#9ca3af' : '#374151')}
                  opacity={isHovered ? 1 : 0.82}
                  fontWeight={li === 0 ? '700' : '400'}
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
                  fill={isDark ? 'rgba(255,255,255,0.58)' : 'rgba(45,55,72,0.58)'}
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
            <path d={`M ${project(2.81, 42.72).join(',')} L ${project(1.8, 41.8).join(',')}`} stroke="#3b82f6"
                  strokeWidth="2" strokeDasharray="6 3"
                  markerEnd="url(#arrowBlue)" />
          </g>
        )}
        {simTime >= 3 && (
          <g opacity="0.6">
            {/* Flecha Portugal black-start (bottom-up) */}
            <path d={`M ${project(-8.27, 39.48).join(',')} L ${project(-4.5, 37.5).join(',')}`} stroke="#10b981"
                  strokeWidth="2" strokeDasharray="6 3" />
          </g>
        )}

        {/* Etiquetas de mar */}
        <text x={project(-9, 41)[0]} y={project(-9, 41)[1]} fill="rgba(0,217,255,0.18)" fontSize="12"
              fontFamily="var(--font-mono, monospace)"
              transform={`rotate(-90, ${project(-9, 41).join(', ')})`} letterSpacing="2">
          OCÉANO ATLÁNTICO
        </text>
        <text x={project(3, 38)[0]} y={project(3, 38)[1]} fill="rgba(0,217,255,0.18)" fontSize="12"
              fontFamily="var(--font-mono, monospace)" letterSpacing="2"
              transform={`rotate(-5, ${project(3, 38).join(', ')})`}>
          MAR MEDITERRÁNEO
        </text>
        <text x={project(2, 44)[0]} y={project(2, 44)[1]} fill="rgba(59,130,246,0.45)" fontSize="14"
              fontFamily="var(--font-mono, monospace)" letterSpacing="3">
          FRANCE
        </text>
        <g>
          <rect
            x="610"
            y="720"
            width="352"
            height="48"
            rx="5"
            fill={isDark ? 'rgba(7,24,45,0.76)' : 'rgba(246,241,232,0.78)'}
            stroke={isDark ? 'rgba(118,151,168,0.22)' : 'rgba(104,116,98,0.24)'}
          />
          <text
            x="626"
            y="740"
            fontSize="9.5"
            fontFamily="var(--font-mono, monospace)"
            fill={isDark ? 'rgba(210,224,232,0.66)' : 'rgba(45,36,29,0.62)'}
          >
            <tspan x="626" dy="0">Áreas funcionales aproximadas sobre Admin 1 Natural Earth;</tspan>
            <tspan x="626" dy="14">no representan límites eléctricos exactos.</tspan>
          </text>
        </g>
      </svg>
      </div>

      {/* ── PANEL INFERIOR ─────────────────────────────────────── */}
      <div style={{
        background: 'var(--chart-bg, rgba(5,10,20,0.95))',
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

export default function AnimatedRestorationMap({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 480, background: 'var(--chart-bg, #050a14)', borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#10b981', fontFamily: 'monospace', fontSize: 12,
      }}>
        Cargando mapa de reposición…
      </div>
    }>
      {() => <RestorationContent />}
    </BrowserOnly>
  );
}
