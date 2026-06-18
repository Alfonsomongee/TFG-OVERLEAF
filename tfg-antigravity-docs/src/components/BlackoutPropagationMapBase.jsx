/**
 * BlackoutPropagationMapBase.jsx
 *
 * Mapa interactivo de la cascada IBR del apagón ibérico del 28-A.
 * Muestra la propagación geográfica de la sobretensión en cascada
 * sobre el mapa de la Península Ibérica.
 *
 * NOTA: este componente es distinto de IberianGridTopology (Figura B4).
 *   IberianGridTopology — topología esquemática de red, líneas rectas.
 *   BlackoutPropagationMap — propagación GEOGRÁFICA, arcos Bezier curvos,
 *     retícula cartográfica real, fronteras CCAA, puntos de ciudad,
 *     contador GW, efecto fade + overlay "CERO ELÉCTRICO".
 *
 * FEATURES ÚNICAS PRESERVADAS:
 *   - Arcos Bezier cuadráticos con offset de curvatura proporcional a distancia
 *   - Retícula cartográfica real (°lat/°lon) con labels de grado
 *   - Capa ADMIN1 (fronteras CCAA España + distritos Portugal) si disponible
 *   - Puntos de ciudad de referencia (CITY_POINTS)
 *   - Contador GW perdidos con gradiente de color
 *   - mapOpacity: mapa se atenúa a 0.38 en colapso final (simTime ≥ 8)
 *   - Overlay "CERO ELÉCTRICO SISTÉMICO" con glow (simTime ≥ 10)
 *   - Portugal doble capa (fill + overlay diferenciador ptFill/ptStroke)
 *   - THEME + NODE_COLORS separados como paletas independientes
 *   - React.lazy en el wrapper — este archivo no cambia ese wrapper
 *
 * CORRECCIONES DE DATOS (ver BlackoutPropagationMapData.js):
 *   1. Almaraz: eliminado 'Inercia síncrona' (REE: problema fue reactiva, no inercia)
 *   2. Badajoz: desc corregido (terminología técnica verificada)
 *   3. ZAR→FR (AC, t=8) antes que BAR→FR (HVDC, t=9)
 *   4. EVENTS: sincronismo (t=7), AC (t=8), HVDC (t=9) — eventos separados
 *   5. EVENTS: Marruecos desconexión añadida (t=6, subfrecuencia 48,46 Hz)
 *
 * MEJORAS DE CÓDIGO:
 *   - Datos estáticos en BlackoutPropagationMapData.js
 *   - Simulador en usePropagationSimulator.js — interval limpio, dos effects
 *   - Sub-componentes: PropagationArc, PropagationNode, NodeTooltip
 *   - Accesibilidad: role+tabIndex+aria-label+aria-pressed+onKeyDown en nodos
 *   - Tooltip: overflow vertical corregido (original solo manejaba horizontal)
 *   - Panel inferior: CSS module con breakpoint responsive ≤640px
 *   - Imports muertos eliminados: MAP_VIEWBOX, LAND_PATHS
 *   - th y nc memoizados con useMemo([isDark])
 *   - figcaption académico añadido
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import {
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  CITY_POINTS,
  ADMIN1_PATHS,      // Puede ser undefined si la capa no está exportada — guardado
} from '../data/cartography/naturalEarthIberiaPaths';

import {
  gp,
  GRATICULE,
  STATIONS,
  ARCS,
  THEME,
  NODE_COLORS,
} from './BlackoutPropagationMapData';
import { usePropagationSimulator, MAX_TIME } from './usePropagationSimulator';
import styles from './BlackoutPropagationMapBase.module.css';

// ── Paths geográficos — extraídos una vez al importar ─────────────────────

const SPAIN_PATHS    = COUNTRY_PATHS.ESP?.paths   ?? [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths   ?? [];
const ANDORRA_PATHS  = COUNTRY_PATHS.AND?.paths   ?? [];
const FRANCE_PATHS   = COUNTRY_PATHS.FRA?.paths   ?? [];
const MOROCCO_PATHS  = COUNTRY_PATHS.MAR?.paths   ?? [];

// ADMIN1: fronteras CCAA (España) + distritos (Portugal).
// Puede estar ausente si naturalEarthIberiaPaths no exporta ADMIN1_PATHS.
// El guard maneja graciosamente ambos casos.
const ALL_ADMIN1_PATHS = (() => {
  if (!ADMIN1_PATHS) return [];
  const paths = [];
  for (const country of ['ESP', 'PRT']) {
    const regions = ADMIN1_PATHS[country];
    if (!regions) continue;
    for (const name of Object.keys(regions)) {
      const region = regions[name];
      if (region?.paths) paths.push(...region.paths);
    }
  }
  return paths;
})();

// ── Sub-componente: PropagationArc ────────────────────────────────────────

/**
 * Arco Bezier cuadrático entre dos nodos.
 * La altura de la curva es proporcional a la distancia (hasta 95px máx).
 * Único vs IberianGridTopology que usa líneas rectas.
 */
function PropagationArc({ arc, srcNode, tgtNode, simTime, th }) {
  if (!srcNode || !tgtNode) return null;

  const isActive = simTime >= arc.activationTime;
  if (!isActive && arc.type === 'stable') return null;

  const color = th.arcColors[arc.type] ?? th.arcColors.stable;
  const mx    = (srcNode.x + tgtNode.x) / 2;
  const dist  = Math.hypot(tgtNode.x - srcNode.x, tgtNode.y - srcNode.y);
  const my    = (srcNode.y + tgtNode.y) / 2 - Math.min(95, dist * 0.23);

  return (
    <g aria-hidden="true">
      <path
        d={`M${srcNode.x},${srcNode.y} Q${mx},${my} ${tgtNode.x},${tgtNode.y}`}
        fill="none"
        stroke={isActive ? color : th.arcInactive}
        strokeWidth={arc.type === 'stable' ? 1 : (isActive ? 2.5 : 0.8)}
        strokeDasharray={arc.type === 'stable' ? '5 3' : 'none'}
        opacity={isActive ? 1 : 0.25}
      />
      {arc.label && isActive && (
        <text
          x={mx} y={my - 7}
          fill={color}
          fontSize="9.5"
          fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
          textAnchor="middle"
          fontWeight="600"
          opacity="0.95"
          pointerEvents="none"
        >
          {arc.label}
        </text>
      )}
    </g>
  );
}

// ── Sub-componente: PropagationNode ───────────────────────────────────────

/**
 * Nodo eléctrico con halo pulsante, círculo, icono y etiqueta.
 * Accesible por teclado: role="button", tabIndex, onKeyDown.
 */
function PropagationNode({ node, isHovered, onHoverEnter, onHoverLeave, nc, th, filterId }) {
  const colors       = nc[node.type] ?? nc.stable;
  const r            = node.type === 'france' ? 13 : node.type === 'origin' ? 14 : 10;
  const activeFill   = node.isActive ? colors.fill   : th.nodeOff.fill;
  const activeStroke = node.isActive ? colors.stroke : th.nodeOff.stroke;
  const activeLabel  = node.isActive ? colors.label  : th.nodeOff.label;

  const ariaLabel = node.isCollapsing
    ? `Nodo ${node.name}: en colapso activo`
    : `Nodo ${node.name}`;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHoverEnter(node.id);
    }
    if (e.key === 'Escape') onHoverLeave();
  }, [node.id, onHoverEnter, onHoverLeave]);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isHovered}
      onMouseEnter={() => onHoverEnter(node.id)}
      onMouseLeave={onHoverLeave}
      onFocus={() => onHoverEnter(node.id)}
      onBlur={onHoverLeave}
      onKeyDown={handleKeyDown}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      {/* Halo pulsante — nodos en colapso activo */}
      {node.isCollapsing && (
        <circle cx={node.x} cy={node.y} r={r} fill={colors.fill} opacity="0" aria-hidden="true">
          <animate
            attributeName="r"
            values={`${r};${r + 18};${r}`}
            dur="1.4s" repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.55;0;0.55"
            dur="1.4s" repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Círculo principal */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={activeFill}
        stroke={activeStroke}
        strokeWidth={isHovered ? 3 : node.type === 'origin' ? 2.2 : 1.5}
        filter={node.isCollapsing ? `url(#${filterId})` : 'none'}
      />

      {/* Icono de advertencia */}
      {node.isCollapsing && (
        <text
          x={node.x} y={node.y + 4}
          textAnchor="middle" fontSize="10"
          fill="#fff" fontWeight="900"
          pointerEvents="none"
          aria-hidden="true"
        >!</text>
      )}

      {/* Etiqueta del nodo */}
      <text
        x={node.x} y={node.y + r + 14}
        textAnchor="middle" fontSize="9.5"
        fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
        fill={activeLabel} fontWeight="600"
        pointerEvents="none"
        aria-hidden="true"
      >
        {node.name.split('\n')[0]}
      </text>
    </g>
  );
}

// ── Sub-componente: NodeTooltip ───────────────────────────────────────────

/**
 * Tooltip de información del nodo.
 * CORRECCIÓN: overflow vertical corregido — original solo manejaba horizontal.
 */
function NodeTooltip({ node, th }) {
  if (!node) return null;

  const lines = node.desc.split('\n');
  const TW    = 212;
  const TH    = lines.length * 14 + 20;

  // Overflow horizontal
  let tx = node.x + 20;
  if (tx + TW > 978) tx = node.x - TW - 20;

  // Overflow vertical — NUEVO (original no lo manejaba)
  let ty = node.y - 20;
  if (ty + TH > 775) ty = node.y - TH - 8;
  if (ty < 12) ty = 12;

  return (
    <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <rect
        x={tx - 8} y={ty - 14}
        width={TW + 16} height={TH}
        rx="5"
        fill={th.tooltip.bg}
        stroke={th.tooltip.border}
        strokeWidth="1"
      />
      {lines.map((line, li) => (
        <text
          key={li}
          x={tx} y={ty + li * 14}
          fontSize={li === 0 ? 10 : 9}
          fill={li === 0 ? th.tooltip.title : th.tooltip.body}
          fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
          fontWeight={li === 0 ? '700' : '400'}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ── Componente principal: BlackoutPropagationMapBase ──────────────────────

export default function BlackoutPropagationMapBase() {
  const { colorMode } = useColorMode();
  const isDark        = colorMode === 'dark';

  // Paletas memoizadas — solo recalculan cuando cambia el modo de color.
  // En el original eran lookups directos sin memoizar.
  const th = useMemo(() => THEME[isDark ? 'dark' : 'light'],       [isDark]);
  const nc = useMemo(() => NODE_COLORS[isDark ? 'dark' : 'light'], [isDark]);

  const { simTime, isPlaying, handlePlayPause, visibleEvents, gwLost } =
    usePropagationSimulator();

  const [hoveredNode, setHoveredNode] = useState(null);
  const handleHoverEnter = useCallback((id) => setHoveredNode(id), []);
  const handleHoverLeave = useCallback(() => setHoveredNode(null),  []);

  // IDs únicos por instancia para filtros SVG (React 17 compatible)
  const uid = useRef(`bpm-${Math.random().toString(36).slice(2, 7)}`).current;
  const ids = {
    glowRed:    `${uid}-gr`,
    clipIberia: `${uid}-ci`,
    relief:     `${uid}-rf`,
  };

  // Nodos con coordenadas proyectadas y estado calculado
  const nodes = useMemo(() =>
    STATIONS.map((s) => {
      const { x, y }    = gp(s.lat, s.lon);
      const isActive     = simTime >= s.activationTime;
      const isCollapsing = (s.type === 'lost' || s.type === 'origin') && isActive;
      return { ...s, x, y, isActive, isCollapsing };
    }),
    [simTime]
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const hoveredNodeData = hoveredNode ? (nodeMap[hoveredNode] ?? null) : null;

  // Efecto de atenuación del mapa durante el colapso final
  // (feature único de BPM — no existe en IberianGridTopology)
  const mapOpacity    = simTime >= 8 ? 0.38 : 1;
  const mapTransition = 'opacity 1.2s ease';

  // Color del contador GW según nivel de pérdida
  const gwColor = gwLost >= 10 ? th.textDanger
    : gwLost >= 5  ? (isDark ? '#f97316' : '#C2500A')
    : gwLost >= 1  ? (isDark ? '#f59e0b' : '#B45309')
    : th.textMuted;

  const atEnd    = simTime >= MAX_TIME;
  const btnStyle = isPlaying ? th.btnPause : th.btnPlay;
  const btnLabel = atEnd      ? 'Reiniciar simulación'
                 : isPlaying  ? 'Pausar simulación'
                 : 'Reproducir simulación';

  return (
    <figure
      className={styles.figure}
      style={{ background: th.wrapBg, borderColor: th.wrapBorder }}
    >
      {/* ── SVG del mapa ──────────────────────────────────────────── */}
      <div className={styles.mapWrapper}>
        <svg
          viewBox="0 0 1000 800"
          className={styles.map}
          role="img"
          aria-label="Mapa interactivo de la cascada de desconexiones IBR durante el apagón ibérico del 28-A. Muestra la propagación geográfica desde Granada hasta el cero eléctrico peninsular."
        >
          <defs>
            <filter id={ids.glowRed}
              x="-50" y="-50" width="1100" height="900"
              filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <clipPath id={ids.clipIberia}>
              {SPAIN_PATHS.map((d, i)    => <path key={`c-es-${i}`} d={d} />)}
              {PORTUGAL_PATHS.map((d, i) => <path key={`c-pt-${i}`} d={d} />)}
              {ANDORRA_PATHS.map((d, i)  => <path key={`c-ad-${i}`} d={d} />)}
            </clipPath>

            <filter id={ids.relief}
              x="-50" y="-50" width="1100" height="900"
              filterUnits="userSpaceOnUse">
              <feDropShadow
                dx="1.5" dy="2" stdDeviation="2.5"
                floodColor={th.shadow} floodOpacity="0.6"
              />
            </filter>
          </defs>

          {/* Fondo océano */}
          <rect width="1000" height="800" fill={th.ocean} />

          {/* ── Retícula cartográfica real (°lat/°lon) ────────────── */}
          {/* Feature único: líneas de grado con labels geográficos.   */}
          {/* Se atenúa durante el colapso final.                      */}
          <g
            opacity={simTime >= 8 ? 0.10 : 0.55}
            style={{ transition: mapTransition }}
            aria-hidden="true"
          >
            {GRATICULE.map((g, i) => (
              <g key={`grat-${i}`}>
                <path d={g.d} fill="none" stroke={th.gridLine} strokeWidth="0.6" />
                <text
                  x={g.lx} y={g.ly}
                  textAnchor={g.anchor}
                  fontSize="7"
                  fontFamily="var(--font-mono, monospace)"
                  fill={th.gridLabel}
                >
                  {g.label}
                </text>
              </g>
            ))}
          </g>

          {/* ── Masas terrestres con relieve ──────────────────────── */}
          {/* Se atenúan con mapOpacity durante el colapso.           */}
          <g
            filter={`url(#${ids.relief})`}
            opacity={mapOpacity}
            style={{ transition: mapTransition }}
            aria-hidden="true"
          >
            {SPAIN_PATHS.map((d, i) => (
              <path key={`es-${i}`} d={d}
                fill={th.landMain} stroke={th.border}
                strokeWidth="1.2" strokeLinejoin="round" />
            ))}
            {PORTUGAL_PATHS.map((d, i) => (
              /* Portugal: doble capa (fill base + overlay diferenciador) */
              <g key={`pt-g-${i}`}>
                <path d={d}
                  fill={th.landMain} stroke={th.border}
                  strokeWidth="1.2" strokeLinejoin="round" />
                <path d={d}
                  fill={th.ptFill} stroke={th.ptStroke}
                  strokeWidth="1" strokeDasharray="4 3" strokeLinejoin="round" />
              </g>
            ))}
            {ANDORRA_PATHS.map((d, i) => (
              <path key={`ad-${i}`} d={d}
                fill={th.landMain} stroke={th.border}
                strokeWidth="1.0" strokeLinejoin="round" />
            ))}
            {FRANCE_PATHS.map((d, i) => (
              <path key={`fr-${i}`} d={d}
                fill={th.landNeighbor} stroke={th.border}
                strokeWidth="0.8" strokeLinejoin="round" />
            ))}
            {MOROCCO_PATHS.map((d, i) => (
              <path key={`ma-${i}`} d={d}
                fill={th.landNeighbor} stroke={th.border}
                strokeWidth="0.8" strokeLinejoin="round" />
            ))}
          </g>

          {/* ── Capa ADMIN1: fronteras CCAA + distritos ───────────── */}
          {/* Ausente si naturalEarthIberiaPaths no exporta ADMIN1_PATHS */}
          {ALL_ADMIN1_PATHS.length > 0 && (
            <g
              opacity={simTime >= 8 ? 0.12 : 0.50}
              style={{ transition: mapTransition }}
              aria-hidden="true"
            >
              {ALL_ADMIN1_PATHS.map((d, i) => (
                <path key={`a1-${i}`} d={d}
                  fill="none"
                  stroke={th.adminBorder}
                  strokeWidth="0.7"
                  strokeLinejoin="round" />
              ))}
            </g>
          )}

          {/* ── Fronteras internacionales ─────────────────────────── */}
          <g opacity={mapOpacity} style={{ transition: mapTransition }} aria-hidden="true">
            {BORDER_PATHS.map((d, i) => (
              <path key={`brd-${i}`} d={d}
                fill="none" stroke={th.border}
                strokeWidth="1.0" strokeDasharray="3 3" />
            ))}
          </g>

          {/* ── Línea de costa ────────────────────────────────────── */}
          <g opacity={mapOpacity} style={{ transition: mapTransition }} aria-hidden="true">
            {COASTLINE_PATHS.map((d, i) => (
              <path key={`cst-${i}`} d={d}
                fill="none" stroke={th.coastline} strokeWidth="0.8" />
            ))}
          </g>

          {/* ── Ciudades de referencia ────────────────────────────── */}
          <g
            opacity={simTime >= 8 ? 0.25 : 0.60}
            style={{ transition: mapTransition }}
            aria-hidden="true"
          >
            {CITY_POINTS.map((c, i) => (
              <g key={`city-${i}`} transform={`translate(${c.x}, ${c.y})`}>
                <circle r="2" fill={th.city} />
                <text x="5" y="3"
                  fontFamily="var(--font-mono, monospace)"
                  fontSize="7.5"
                  fill={th.cityLabel}
                  opacity="0.8">
                  {c.name}
                </text>
              </g>
            ))}
          </g>

          {/* ── Arcos de propagación (Bezier cuadráticos) ─────────── */}
          {ARCS.map((arc, i) => (
            <PropagationArc
              key={`arc-${i}`}
              arc={arc}
              srcNode={nodeMap[arc.from]}
              tgtNode={nodeMap[arc.to]}
              simTime={simTime}
              th={th}
            />
          ))}

          {/* ── Nodos eléctricos accesibles ───────────────────────── */}
          {nodes.map((node) => (
            <PropagationNode
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              onHoverEnter={handleHoverEnter}
              onHoverLeave={handleHoverLeave}
              nc={nc}
              th={th}
              filterId={ids.glowRed}
            />
          ))}

          {/* ── Tooltip con overflow vertical corregido ───────────── */}
          {hoveredNodeData && (
            <NodeTooltip node={hoveredNodeData} th={th} />
          )}

          {/* ── Overlay CERO ELÉCTRICO (simTime ≥ 10) ────────────── */}
          {/* Feature único de BPM — no existe en IberianGridTopology  */}
          {simTime >= 10 && (
            <g aria-hidden="true">
              <rect width="1000" height="800" fill={th.collapso} />
              <text
                x="500" y="388"
                textAnchor="middle"
                fontSize="22"
                fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                fontWeight="900"
                fill={th.collapsoText}
                filter={`url(#${ids.glowRed})`}
                opacity="0.90"
              >
                CERO ELÉCTRICO SISTÉMICO
              </text>
              <text
                x="500" y="414"
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-mono, 'JetBrains Mono', monospace)"
                fill={th.collapsoSub}
                opacity="0.72"
              >
                12:33:30 CEST · −15 GW · &gt;50 millones de personas
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Panel inferior ─────────────────────────────────────────── */}
      <div
        className={styles.controlPanel}
        style={{ background: th.panelBg, borderTopColor: th.panelBorder }}
      >
        {/* Columna izquierda: controles, GW, leyenda */}
        <div className={styles.simControls}>

          <div className={styles.simHeader}>
            <span className={styles.simTitle} style={{ color: th.textDanger }}>
              CASCADA IBR 28-A
            </span>
            <button
              type="button"
              onClick={handlePlayPause}
              className={styles.playButton}
              aria-label={btnLabel}
              style={{
                '--btn-bg':     btnStyle.bg,
                '--btn-border': btnStyle.border,
                '--btn-color':  btnStyle.color,
              }}
            >
              {atEnd ? '↺ Reiniciar' : isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
            </button>
          </div>

          {/* Barra de tiempo */}
          <div className={styles.timeline}>
            <div className={styles.timelineLabels}>
              <span style={{ color: th.textMuted }}>12:32:57</span>
              <span style={{ color: th.textMuted }}>12:33:30 CEST</span>
            </div>
            <div className={styles.timelineTrack} style={{ background: th.timelineBg }}>
              <div
                className={styles.timelineFill}
                style={{
                  width:      `${(simTime / MAX_TIME) * 100}%`,
                  background: th.timelineGrad,
                }}
              />
            </div>
          </div>

          {/* Contador GW perdidos — feature único de BPM */}
          <div
            className={styles.gwWidget}
            style={{ background: th.gwBg, borderColor: th.gwBorder }}
          >
            <div
              className={styles.gwValue}
              style={{ color: gwColor }}
            >
              {gwLost.toFixed(1)}
              <span className={styles.gwUnit} style={{ color: th.gwUnit }}>
                GW perdidos
              </span>
            </div>
          </div>

          {/* Leyenda */}
          <div className={styles.legendGrid} aria-hidden="true">
            {[
              { color: nc.origin.fill,   label: 'Origen colapso' },
              { color: nc.lost.fill,     label: 'Nodo perdido'   },
              { color: nc.stable.fill,   label: 'Nodo estable'   },
              { color: nc.france.fill,   label: 'Francia (RTE)'  },
            ].map(({ color, label }) => (
              <div key={label} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: color }} />
                <span style={{ color: th.legendText }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Columna derecha: log de eventos */}
        <div
          className={styles.eventLog}
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Registro cronológico de la cascada de desconexiones"
          style={{ background: th.logBg, borderColor: th.logBorder }}
        >
          {visibleEvents.length === 0 ? (
            <p className={styles.eventLogEmpty} style={{ color: th.textMuted }}>
              Pulsa ▶ para iniciar la simulación
            </p>
          ) : (
            visibleEvents.map((ev, i) => (
              <div
                key={ev.t}
                className={styles.eventEntry}
                data-latest={i === 0 ? 'true' : 'false'}
                style={{
                  color:           i === 0 ? th.logActive : th.logPast,
                  borderLeftColor: i === 0 ? th.logBullet : 'transparent',
                }}
              >
                {ev.msg}
              </div>
            ))
          )}
        </div>
      </div>

    </figure>
  );
}
