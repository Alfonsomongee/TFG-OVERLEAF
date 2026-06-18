/**
 * AnimatedRestorationMap.jsx
 *
 * Simulador interactivo de la reposición del sistema ibérico tras el apagón del 28-A.
 * TFG: Análisis del apagón ibérico (Universidad de Sevilla).
 *
 * Mejoras sobre la versión anterior:
 *  ─ Bug crítico resuelto: #arrowBlue no estaba definido en <defs> → flechas sin punta
 *  ─ Simulador extraído a useSimulator() — interval limpio, sin recreación en cada tick
 *  ─ Datos estáticos extraídos a data.js (ISLANDS_DATA, BLACK_START_POINTS, EVENT_LOG)
 *  ─ Sub-componentes: IslandZone, BlackStartMarker, DirectionalArrows, EventLog, DemandGauge
 *  ─ Accesibilidad: aria-live en log y demanda, aria-label dinámico en Play, role+tabIndex en islas
 *  ─ Dead code eliminado: useDocLang importado pero nunca usado
 *  ─ Dark mode: toda la paleta en objeto `th` — panel inferior usa th en lugar de rgba hardcodeados
 *  ─ Responsive: panel inferior colapsa a columna en < 640px via CSS module
 *  ─ Keys estables en <animate> para evitar remounts espurios al hacer hover
 *  ─ matchesAdmin1 movido a utility pura (sin cierre sobre el componente)
 *  ─ MAX_SIM_TIME a constante de módulo
 *  ─ visibleLogs memoizado
 *  ─ Paleta alineada al sistema del TFG: burdeos #6B1024 en controles, sin cian neón
 */

import { useColorMode } from '@docusaurus/theme-common';
import React, { useState, useMemo, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import {
  COUNTRY_PATHS,
  LAND_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
} from '../data/cartography/naturalEarthIberiaPaths';
import { ADMIN1_FEATURES } from '../data/cartography/naturalEarthIberiaAdmin1Paths';

import {
  ISLANDS_DATA,
  BLACK_START_POINTS,
  BS_COLORS,
  project,
} from './data';
import { useSimulator, MAX_SIM_TIME } from './useSimulator';
import styles from './AnimatedRestorationMap.module.css';

// ── Utilidad Admin1 ────────────────────────────────────────────────────────

function matchesAdmin1(feature, zone) {
  if (zone.country && feature.iso_a2 !== zone.country) return false;
  if (zone.country === 'PT') return true;
  const postal = feature.postal ?? '';
  const region = feature.region ?? '';
  const name   = feature.name   ?? '';
  return (
    zone.postals?.includes(postal)  ||
    zone.regions?.includes(region)  ||
    zone.names?.includes(name)
  );
}

// ── Islas con features precalculadas (fuera del render) ───────────────────

const ISLANDS = ISLANDS_DATA.map((zone) => ({
  ...zone,
  features: ADMIN1_FEATURES.filter((f) => matchesAdmin1(f, zone)),
}));

// ── Sub-componente: IslandZone ─────────────────────────────────────────────

function IslandZone({ island, isRestored, isHovered, onHoverEnter, onHoverLeave }) {
  const anchorPx = project(island.anchor.lon, island.anchor.lat);

  const zoneOpacity       = isHovered ? 0.36 : isRestored ? 0.25 : 0.08;
  const zoneStrokeOpacity = isHovered ? 0.95 : isRestored ? 0.58 : 0.22;
  const zoneColor         = isRestored ? island.color : '#64748b';
  const strokeWidth       = isHovered  ? 1.8  : 0.45;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHoverEnter(island.id);
    }
    if (e.key === 'Escape') onHoverLeave();
  }, [island.id, onHoverEnter, onHoverLeave]);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${island.label.join(' ')} — ${isRestored ? `restituida al ${island.restorePercent}%` : 'sin reposición'}`}
      aria-pressed={isHovered}
      onMouseEnter={() => onHoverEnter(island.id)}
      onMouseLeave={onHoverLeave}
      onFocus={() => onHoverEnter(island.id)}
      onBlur={onHoverLeave}
      onKeyDown={handleKeyDown}
      className={styles.islandGroup}
      clipPath="url(#iberia-clip)"
    >
      {/* Relleno de zona */}
      <g filter={isHovered ? 'url(#zoneHalo)' : 'none'}>
        {island.features.map((feature) => (
          <path
            key={feature.id}
            className={styles.restorationZone}
            d={feature.path}
            fill={zoneColor}
            fillOpacity={zoneOpacity}
            stroke={zoneColor}
            strokeOpacity={isHovered ? zoneStrokeOpacity : 0.12}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Pulso de activación — key estable, no depende del estado hover */}
      {isRestored && island.features.map((feature) => (
        <path
          key={`pulse-${feature.id}`}
          d={feature.path}
          fill="none"
          stroke={island.color}
          strokeWidth="1.6"
          opacity="0"
          pointerEvents="none"
          aria-hidden="true"
        >
          <animate attributeName="opacity"   values="0.26;0" dur="1.2s" begin="0s" repeatCount="1" />
          <animate attributeName="stroke-width" values="1.6;3.2" dur="1.2s" begin="0s" repeatCount="1" />
        </path>
      ))}

      {/* Borde de hover — capa separada para no interferir con el pulso */}
      {isHovered && island.features.map((feature) => (
        <path
          key={`hover-${feature.id}`}
          d={feature.path}
          fill="none"
          stroke={island.color}
          strokeWidth="3"
          strokeOpacity="0.2"
          pointerEvents="none"
          aria-hidden="true"
        />
      ))}

      {/* Estado sin reposición — borde rojo tenue */}
      {!isRestored && island.features.map((feature) => (
        <path
          key={`offline-${feature.id}`}
          d={feature.path}
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.8"
          strokeOpacity="0.16"
          pointerEvents="none"
          aria-hidden="true"
        />
      ))}

      {/* Marcador de ancla */}
      {isRestored && (
        <circle
          cx={anchorPx[0]}
          cy={anchorPx[1] + 25}
          r={isHovered ? 4.2 : 3}
          fill={island.color}
          fillOpacity={isHovered ? 0.9 : 0.58}
          className={styles.anchorDot}
          aria-hidden="true"
        />
      )}

      {/* Etiquetas de isla */}
      <g aria-hidden="true">
        {island.label.map((line, li) => (
          <text
            key={li}
            x={anchorPx[0]}
            y={anchorPx[1] + (li - 0.5) * 13}
            textAnchor="middle"
            fontSize={li === 0 ? 10 : 8.5}
            className={styles.zoneLabel}
            fill={isRestored ? island.color : 'currentColor'}
            opacity={isHovered ? 1 : 0.82}
            fontWeight={li === 0 ? '700' : '400'}
          >
            {line}
          </text>
        ))}

        {/* Porcentaje restituido */}
        {isRestored && (
          <text
            x={anchorPx[0]}
            y={anchorPx[1] + 22}
            textAnchor="middle"
            fontSize={8}
            className={styles.zonePct}
            aria-hidden="true"
          >
            +{island.restorePercent}%
          </text>
        )}
      </g>
    </g>
  );
}

// ── Sub-componente: BlackStartMarker ──────────────────────────────────────

function BlackStartMarker({ point, simTime }) {
  const isActive = simTime >= point.time;
  if (!isActive) return null;

  const [px, py] = project(point.lon, point.lat);
  const color    = BS_COLORS[point.type] ?? '#f59e0b';

  return (
    <g aria-label={`Black Start: ${point.label.join(', ')}`} role="img">
      <circle cx={px} cy={py} r={5} fill={color} filter="url(#glow)" />
      <circle cx={px} cy={py} r={5} fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
        <animate attributeName="r"       values="5;14;5"     dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8"  dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

// ── Sub-componente: DirectionalArrows ─────────────────────────────────────
// Bug corregido: arrowBlue ahora está definido en los <defs> del SVG principal.
// Estas flechas usan ese marker.

function DirectionalArrows({ simTime }) {
  return (
    <>
      {simTime >= 2 && (
        <g opacity="0.65" aria-label="Flujo top-down desde Francia hacia Cataluña" role="img">
          <path
            d={`M ${project(2.81, 42.72).join(',')} L ${project(1.8, 41.8).join(',')}`}
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="6 3"
            fill="none"
            markerEnd="url(#arrowBlue)"
          />
        </g>
      )}
      {simTime >= 3 && (
        <g opacity="0.65" aria-label="Flujo bottom-up desde Portugal hacia el sur ibérico" role="img">
          <path
            d={`M ${project(-8.27, 39.48).join(',')} L ${project(-4.5, 37.5).join(',')}`}
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="6 3"
            fill="none"
            markerEnd="url(#arrowGreen)"
          />
        </g>
      )}
    </>
  );
}

// ── Sub-componente: DemandGauge ───────────────────────────────────────────

function DemandGauge({ demanda, isPlaying, simTime, onPlayPause }) {
  const atEnd   = simTime >= MAX_SIM_TIME;
  const btnLabel = atEnd ? 'Reiniciar simulación' : isPlaying ? 'Pausar simulación' : 'Reproducir simulación';

  const gaugeColor =
    demanda >= 90 ? '#10b981' :
    demanda >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className={styles.gaugePanel}>
      <div className={styles.gaugeHeader}>
        <span className={styles.gaugeTitle}>Reposición ibérica</span>
        <button
          type="button"
          onClick={onPlayPause}
          className={styles.playButton}
          data-playing={isPlaying ? 'true' : 'false'}
          aria-label={btnLabel}
        >
          {atEnd ? '↺ Reiniciar' : isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </button>
      </div>

      {/* Contador grande — aria-live para anunciar a lectores de pantalla */}
      <div
        className={styles.demandCounter}
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Demanda restituida: ${demanda} por ciento`}
      >
        <span className={styles.demandPct} style={{ color: gaugeColor }}>
          {demanda}%
        </span>
        <span className={styles.demandLabel}>demanda restituida</span>
        <div className={styles.demandBarTrack} aria-hidden="true">
          <div
            className={styles.demandBarFill}
            style={{ width: `${demanda}%`, background: gaugeColor }}
          />
        </div>
      </div>

      {/* Leyenda */}
      <div className={styles.legend} aria-hidden="true">
        <div className={styles.legendItem}>
          <div className={styles.legendLine} style={{ background: '#3b82f6' }} />
          <span>Top-Down (FR)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendLine} style={{ background: '#10b981' }} />
          <span>Bottom-Up (Black Start)</span>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componente: EventLog ───────────────────────────────────────────────

function EventLog({ logs }) {
  return (
    <div
      className={styles.eventLog}
      aria-live="polite"
      aria-atomic="false"
      aria-label="Registro de eventos de reposición"
      role="log"
    >
      {logs.length === 0 ? (
        <p className={styles.eventLogEmpty}>Simulación no iniciada. Pulsa Reproducir.</p>
      ) : (
        logs.map((log, i) => (
          <div
            key={log.time}
            className={styles.eventEntry}
            data-latest={i === 0 ? 'true' : 'false'}
          >
            {log.msg}
          </div>
        ))
      )}
    </div>
  );
}

// ── Componente principal: RestorationContent ──────────────────────────────

function RestorationContent() {
  const { colorMode }  = useColorMode();
  const isDark         = colorMode === 'dark';

  const { simTime, isPlaying, handlePlayPause, visibleLogs } = useSimulator();
  const [hoveredIsland, setHoveredIsland] = useState(null);

  const handleHoverEnter = useCallback((id) => setHoveredIsland(id), []);
  const handleHoverLeave = useCallback(() => setHoveredIsland(null), []);

  // Demanda restituida — memoizada
  const demandaRestituida = useMemo(
    () => ISLANDS.filter((i) => simTime >= i.restoreTime)
                 .reduce((sum, i) => sum + i.restorePercent, 0),
    [simTime]
  );

  // Paleta de mapa — toda en un solo objeto, dark/light
  const th = isDark ? {
    ocean:        '#051021',
    landMain:     '#1C3252',
    landNeighbor: '#162A46',
    coastline:    '#29415F',
    border:       '#29415F',
  } : {
    ocean:        '#F3EFE7',
    landMain:     '#ECE6DB',
    landNeighbor: '#ECE6DB',
    coastline:    '#D6CEC0',
    border:       '#D6CEC0',
  };

  return (
    <figure className={styles.figure}>

      {/* ── SVG del mapa ────────────────────────────────────────────── */}
      <div className={styles.mapWrapper}>
        <svg
          viewBox="0 0 1000 800"
          className={styles.map}
          role="img"
          aria-label="Mapa de reposición del sistema ibérico tras el apagón del 28-A. Muestra seis áreas eléctricas funcionales y el avance de su reposición."
        >
          <defs>
            {/* Rejilla de fondo */}
            <pattern id="rm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(100,160,200,0.05)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="0.5"
              />
            </pattern>

            {/* Glow para Black Start points */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Halo para zonas en hover */}
            <filter id="zoneHalo" x="-18%" y="-18%" width="136%" height="136%">
              <feGaussianBlur stdDeviation="5" result="softZoneBlur" />
              <feMerge>
                <feMergeNode in="softZoneBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* ── Marcadores de flecha ── */}
            {/* BUG CORREGIDO: #arrowBlue no estaba definido → las flechas no tenían punta */}
            <marker id="arrowBlue"  markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>

            {/* ClipPath para confinar zonas al territorio ibérico */}
            <clipPath id="iberia-clip">
              {COUNTRY_PATHS.ESP?.paths?.map((d, i) => <path key={`clip-esp-${i}`} d={d} />)}
              {COUNTRY_PATHS.PRT?.paths?.map((d, i) => <path key={`clip-prt-${i}`} d={d} />)}
              {COUNTRY_PATHS.AND?.paths?.map((d, i) => <path key={`clip-and-${i}`} d={d} />)}
            </clipPath>
          </defs>

          {/* Fondo y rejilla */}
          <rect width="1000" height="800" fill={th.ocean} />
          <rect width="1000" height="800" fill="url(#rm-grid)" aria-hidden="true" />

          {/* Tierra base */}
          <g fill={th.landMain} aria-hidden="true">
            {LAND_PATHS.map((d, i) => <path key={`land-${i}`} d={d} />)}
          </g>

          {/* Países vecinos */}
          <g fill={th.landNeighbor} stroke={th.border} strokeWidth="0.5" aria-hidden="true">
            {COUNTRY_PATHS.FRA?.paths?.map((d, i) => <path key={`fra-${i}`} d={d} />)}
            {COUNTRY_PATHS.MAR?.paths?.map((d, i) => <path key={`mar-${i}`} d={d} />)}
            {COUNTRY_PATHS.DZA?.paths?.map((d, i) => <path key={`dza-${i}`} d={d} />)}
          </g>

          {/* Territorio ibérico con bordes */}
          <g fill={th.landMain} aria-hidden="true">
            {COUNTRY_PATHS.ESP?.paths?.map((d, i) => (
              <path key={`esp-${i}`} d={d} stroke={th.border} strokeWidth="1" />
            ))}
            {COUNTRY_PATHS.PRT?.paths?.map((d, i) => (
              <path key={`prt-${i}`} d={d} stroke={th.border} strokeWidth="1" />
            ))}
            {COUNTRY_PATHS.AND?.paths?.map((d, i) => (
              <path key={`and-${i}`} d={d} stroke={th.border} strokeWidth="1" />
            ))}
          </g>

          {/* Costas y fronteras */}
          <g fill="none" stroke={th.coastline} strokeWidth="1" aria-hidden="true">
            {COASTLINE_PATHS.map((d, i) => <path key={`coast-${i}`} d={d} />)}
          </g>
          <g fill="none" stroke={th.border} strokeWidth="1" strokeDasharray="4 4" aria-hidden="true">
            {BORDER_PATHS.map((d, i) => <path key={`border-${i}`} d={d} />)}
          </g>

          {/* ── Islas eléctricas ──────────────────────────────────── */}
          {ISLANDS.map((island) => (
            <IslandZone
              key={island.id}
              island={island}
              isRestored={simTime >= island.restoreTime}
              isHovered={hoveredIsland === island.id}
              onHoverEnter={handleHoverEnter}
              onHoverLeave={handleHoverLeave}
            />
          ))}

          {/* ── Puntos de Black Start ─────────────────────────────── */}
          {BLACK_START_POINTS.map((pt) => (
            <BlackStartMarker key={pt.id} point={pt} simTime={simTime} />
          ))}

          {/* ── Flechas direccionales (bug de punta resuelto) ────── */}
          <DirectionalArrows simTime={simTime} />

          {/* ── Labels de masas de agua y países vecinos ─────────── */}
          <g aria-hidden="true" className={styles.mapLabels}>
            <text
              x={project(-9, 41)[0]}
              y={project(-9, 41)[1]}
              fontSize="12"
              transform={`rotate(-90, ${project(-9, 41).join(', ')})`}
              letterSpacing="2"
              className={styles.seaLabel}
            >
              OCÉANO ATLÁNTICO
            </text>
            <text
              x={project(3, 38)[0]}
              y={project(3, 38)[1]}
              fontSize="11"
              transform={`rotate(-5, ${project(3, 38).join(', ')})`}
              letterSpacing="2"
              className={styles.seaLabel}
            >
              MAR MEDITERRÁNEO
            </text>
            <text
              x={project(2, 44)[0]}
              y={project(2, 44)[1]}
              fontSize="13"
              letterSpacing="3"
              className={styles.neighborLabel}
            >
              FRANCE
            </text>
          </g>

          {/* ── Nota de disclaimer cartográfico ──────────────────── */}
          <g aria-hidden="true">
            <rect
              x="610" y="724" width="352" height="44" rx="4"
              className={styles.disclaimerRect}
            />
            <text fontSize="9" className={styles.disclaimerText}>
              <tspan x="626" y="740">Áreas funcionales aproximadas sobre Admin 1 Natural Earth;</tspan>
              <tspan x="626" dy="13">no representan límites eléctricos exactos.</tspan>
            </text>
          </g>
        </svg>
      </div>

      {/* ── Panel inferior ───────────────────────────────────────────── */}
      <div className={styles.controlPanel}>
        <DemandGauge
          demanda={demandaRestituida}
          isPlaying={isPlaying}
          simTime={simTime}
          onPlayPause={handlePlayPause}
        />
        <EventLog logs={visibleLogs} />
      </div>
    </figure>
  );
}

// ── Export con BrowserOnly (Docusaurus SSR) ───────────────────────────────

export default function AnimatedRestorationMap() {
  return (
    <BrowserOnly
      fallback={
        <div className={styles.fallback} role="status" aria-label="Cargando mapa de reposición">
          Cargando simulador de reposición…
        </div>
      }
    >
      {() => <RestorationContent />}
    </BrowserOnly>
  );
}
