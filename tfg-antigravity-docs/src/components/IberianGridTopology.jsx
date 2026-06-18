/**
 * IberianGridTopology.jsx
 *
 * Simulador de la cascada de sobretensión del apagón ibérico del 28-A.
 * Representa los 33 segundos del colapso (12:32:57 → 12:33:30 CEST).
 *
 * CORRECCIONES DE DATOS (ver IberianGridTopologyData.js para fuentes):
 *   1. Orden BAD/SEV corregido: Badajoz (12:33:16) activa ANTES que zona Sur (12:33:17)
 *   2. Oscilación inter-área: '0.8 Hz' → '0,21 Hz' (verificado ENTSO-E)
 *   3. Referencia Núñez de Balboa eliminada (atribución litigada, no establecida)
 *   4. Almaraz: eliminado 'inercia base' — REE confirma incidente por tensión, no inercia
 *   5. Separación Francia: AC (12:33:21) ANTES que HVDC (12:33:23)
 *   6. Log: pérdida sincronismo (t=9) ANTES de apertura AC (t=11)
 *   7. Bug `e.time || e.t` corregido a solo `e.t`
 *
 * MEJORAS DE CÓDIGO:
 *   - Datos estáticos en IberianGridTopologyData.js
 *   - Simulador en useTopologySimulator.js — interval limpio
 *   - Sub-componentes: TopologyLink, TopologyNode, NodeTooltip
 *   - Accesibilidad: role+tabIndex+aria-label+onKeyDown en todos los nodos SVG
 *   - Tooltip: overflow vertical corregido (original solo manejaba desbordamiento derecho)
 *   - Panel inferior: CSS module con breakpoint responsive mobile (≤640px)
 *   - useDocLang eliminado (dead code en TopologyContent Y en IberianGridTopology)
 *   - palette memoizado con useMemo([isDark]) (original: objeto nuevo en cada render)
 *   - visibleLogs memoizado
 *   - MAX_TIME a constante de módulo
 *   - lostAtTime: nuevo campo en links — reemplaza el hack `link.target === 'FR'`
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import {
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
} from '../data/cartography/naturalEarthIberiaPaths';

import {
  NODES_DATA,
  LINKS_DATA,
  SIM_TIMESTAMPS,
  geoToSvg,
  getGroupColors,
} from './IberianGridTopologyData';
import { useTopologySimulator, MAX_TIME } from './useTopologySimulator';
import styles from './IberianGridTopology.module.css';

// ── Paths geográficos ──────────────────────────────────────────────────────

const SPAIN_PATHS    = COUNTRY_PATHS.ESP?.paths ?? [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths ?? [];
const ANDORRA_PATHS  = COUNTRY_PATHS.AND?.paths ?? [];

// ── Sub-componente: TopologyLink ──────────────────────────────────────────

/**
 * Renderiza una línea de transmisión con su label.
 * Maneja tres estados: idle, active/critical, lost (desconectada).
 * El campo `lostAtTime` reemplaza el hack `link.target === 'FR'` del original.
 */
function TopologyLink({ link, srcNode, tgtNode, simTime, palette }) {
  if (!srcNode || !tgtNode) return null;

  // Retrasar el dibujado de los enlaces de Francia (RTE) y Aragón-Cataluña hasta t=5
  if ((link.target === 'FR' || (link.source === 'ZAR' && link.target === 'BAR')) && simTime < 5) {
    return null;
  }

  const isActive = simTime >= link.activationTime;
  const isLost   = link.lostAtTime !== null && simTime >= link.lostAtTime;

  let stroke      = palette.linkIdle;
  let strokeWidth = 1;
  let dashArray   = '4 4';

  if (isActive && !isLost) {
    stroke      = link.isCritical ? palette.linkCritical : palette.linkActive;
    strokeWidth = link.isCritical ? 2.5 : 1.5;
    dashArray   = link.isCritical ? 'none' : '4 3';
  }

  const mx = (srcNode.x + tgtNode.x) / 2;
  const my = (srcNode.y + tgtNode.y) / 2;

  return (
    <g aria-hidden="true">
      <line
        x1={srcNode.x} y1={srcNode.y}
        x2={tgtNode.x} y2={tgtNode.y}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        opacity={isLost ? 0.12 : 1}
      />
      {/* Label activo */}
      {link.label && isActive && !isLost && (
        <text
          x={mx} y={my - 7}
          fill={link.isCritical ? palette.warning : palette.accent}
          fontSize="9"
          fontFamily="var(--font-mono, monospace)"
          textAnchor="middle"
          pointerEvents="none"
        >
          {link.label}
        </text>
      )}
      {/* Label de enlace perdido */}
      {link.label && isLost && (
        <text
          x={mx} y={my - 7}
          fill={palette.danger}
          fontSize="8"
          fontFamily="var(--font-mono, monospace)"
          textAnchor="middle"
          opacity="0.55"
          pointerEvents="none"
        >
          ✕ {link.label}
        </text>
      )}
    </g>
  );
}

// ── Sub-componente: TopologyNode ──────────────────────────────────────────

/**
 * Renderiza un nodo de la topología: anillo pulsante, círculo, icono, etiquetas.
 * Accesible por teclado: role="button", tabIndex, onKeyDown.
 */
function TopologyNode({ node, isHovered, onHoverEnter, onHoverLeave, groupColors, palette, svgIds }) {
  const colors = groupColors[node.group] ?? groupColors.stable;
  const r      = node.group === 'france' ? 14 : (node.isCollapsing ? 13 : 10);

  const ariaLabel = node.isCollapsing
    ? `Nodo ${node.label[0]}: en colapso activo`
    : `Nodo ${node.label[0]}: ${node.group}`;

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
      {/* Anillo pulsante — solo nodos en colapso activo */}
      {node.isCollapsing && (
        <circle
          cx={node.x} cy={node.y} r={r + 8}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1"
          opacity="0.4"
          aria-hidden="true"
        >
          <animate
            attributeName="r"
            values={`${r + 4};${r + 14};${r + 4}`}
            dur="1.2s" repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="1.2s" repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Círculo principal */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={node.isActive ? colors.fill : palette.inactiveNodeFill}
        stroke={node.isActive ? colors.stroke : palette.inactiveNodeStroke}
        strokeWidth={isHovered ? 2.5 : 1.5}
        filter={
          node.isCollapsing ? `url(#${svgIds.glowRed})`
          : node.isActive   ? `url(#${svgIds.glow})`
          : 'none'
        }
      />

      {/* Icono de advertencia en nodos colapsando */}
      {node.isCollapsing && (
        <text
          x={node.x} y={node.y + 4}
          textAnchor="middle"
          fontSize="10"
          fill={palette.textOnNode}
          fontWeight="bold"
          pointerEvents="none"
          aria-hidden="true"
        >!</text>
      )}

      {/* Etiquetas bajo el nodo */}
      <g aria-hidden="true">
        {node.label.map((line, li) => (
          <text
            key={li}
            x={node.x}
            y={node.y + r + 13 + li * 12}
            textAnchor="middle"
            fontSize={li === 0 ? 10 : 8.5}
            fontFamily="var(--font-mono, monospace)"
            fill={node.isActive ? palette.textPrimary : palette.textMuted}
            fontWeight={li === 0 ? '600' : '400'}
            pointerEvents="none"
          >
            {line}
          </text>
        ))}
      </g>
    </g>
  );
}

// ── Sub-componente: NodeTooltip ───────────────────────────────────────────

/**
 * Tooltip de información detallada del nodo.
 * CORRECCIÓN: maneja overflow vertical además del horizontal (original solo horizontal).
 */
function NodeTooltip({ node, palette }) {
  if (!node) return null;

  const lines   = node.desc;
  const TW      = 188;
  const lineH   = 15;
  const padV    = 22;
  const TH      = lines.length * lineH + padV;

  // Overflow horizontal
  let tx = node.x + 18;
  if (tx + TW > 990) tx = node.x - TW - 18;

  // Overflow vertical — NUEVO: original no manejaba el desbordamiento inferior
  let ty = node.y - 20;
  if (ty + TH > 775) ty = node.y - TH - 8;
  if (ty < 12) ty = 12;

  return (
    <g aria-hidden="true" style={{ pointerEvents: 'none' }}>
      <rect
        x={tx - 6}      y={ty - 14}
        width={TW + 12} height={TH}
        rx="4"
        fill={palette.panelBg}
        stroke={palette.accentBorder}
        strokeWidth="1"
      />
      {lines.map((line, li) => (
        <text
          key={li}
          x={tx} y={ty + li * lineH}
          fontSize={li === 0 ? 10 : 9}
          fill={li === 0 ? palette.accent : palette.textMuted}
          fontFamily="var(--font-mono, monospace)"
          fontWeight={li === 0 ? '700' : '400'}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ── Componente principal: TopologyContent ─────────────────────────────────

function TopologyContent() {
  const { colorMode } = useColorMode();
  const isDark        = colorMode === 'dark';

  const { simTime, isPlaying, handlePlayPause, visibleLogs } = useTopologySimulator();
  const [hoveredNode, setHoveredNode] = useState(null);

  const handleHoverEnter = useCallback((id) => setHoveredNode(id), []);
  const handleHoverLeave = useCallback(() => setHoveredNode(null), []);

  // IDs únicos por instancia para filtros/clipPaths SVG.
  // useRef + Math.random() para compatibilidad con React 17 y evitar colisiones
  // entre múltiples instancias del componente en la misma página.
  const uid    = useRef(`topo-${Math.random().toString(36).slice(2, 7)}`).current;
  const svgIds = {
    landGrad:   `${uid}-landGrad`,
    relief:     `${uid}-relief`,
    glow:       `${uid}-glow`,
    glowRed:    `${uid}-glowRed`,
    clipIberia: `${uid}-clipIberia`,
  };

  // Paleta de colores — memoizada por isDark.
  // En el original se recalculaba en CADA render (sin useMemo).
  const palette = useMemo(() => ({
    bg:                 isDark ? '#0D1E38'                     : '#F3EFE7',
    bgOverlay:          isDark ? 'rgba(7,19,38,0.58)'          : 'rgba(255,252,245,0.54)',
    panelBg:            isDark ? 'rgba(16,29,53,0.92)'         : 'rgba(255,252,245,0.88)',
    logBg:              isDark ? 'rgba(7,19,38,0.58)'          : 'rgba(25,24,20,0.035)',

    landGradStart:      isDark ? '#162A46'                     : '#ECE6DB',
    landGradEnd:        isDark ? '#162A46'                     : '#ECE6DB',
    landStroke:         isDark ? '#29415F'                     : '#D6CEC0',
    landNeighbor:       isDark ? '#162A46'                     : '#ECE6DB',
    coastline:          isDark ? '#29415F'                     : '#D6CEC0',
    border:             isDark ? 'rgba(226,232,240,0.14)'      : 'rgba(25,24,20,0.14)',

    portugFill:         isDark ? 'rgba(230,180,92,0.10)'       : 'rgba(169,96,0,0.10)',
    portugStroke:       isDark ? 'rgba(230,180,92,0.38)'       : 'rgba(169,96,0,0.30)',

    gridLine:           isDark ? 'rgba(244,247,251,0.055)'     : 'rgba(25,24,20,0.045)',
    reliefLight:        isDark ? 'rgba(244,247,251,0.055)'     : 'rgba(255,252,245,0.62)',
    reliefDark:         isDark ? 'rgba(0,0,0,0.26)'            : 'rgba(25,24,20,0.10)',

    textPrimary:        isDark ? '#F4F7FB'                     : '#191814',
    textSecondary:      isDark ? '#C7D2E3'                     : '#4A4338',
    textMuted:          isDark ? '#91A4BC'                     : '#7A7062',
    textOnNode:         isDark ? '#071326'                     : '#FFFCF5',

    accent:             isDark ? '#7DCDE3'                     : '#1F6F78',
    accentSoft:         isDark ? 'rgba(125,205,227,0.12)'      : 'rgba(31,111,120,0.10)',
    accentBorder:       isDark ? 'rgba(125,205,227,0.38)'      : 'rgba(31,111,120,0.34)',

    warning:            isDark ? '#E6B45C'                     : '#A96000',
    danger:             isDark ? '#D98798'                     : '#A13D36',
    success:            isDark ? '#A6C67B'                     : '#2F6B4F',

    linkIdle:           isDark ? 'rgba(125,205,227,0.10)'      : 'rgba(31,111,120,0.14)',
    linkActive:         isDark ? 'rgba(125,205,227,0.34)'      : 'rgba(31,111,120,0.36)',
    linkCritical:       isDark ? '#D98798'                     : '#A13D36',

    inactiveNodeFill:   isDark ? 'rgba(16,29,53,0.90)'         : 'rgba(255,252,245,0.90)',
    inactiveNodeStroke: isDark ? 'rgba(226,232,240,0.16)'      : 'rgba(25,24,20,0.16)',
  }), [isDark]);

  const groupColors = useMemo(() => getGroupColors(isDark), [isDark]);

  // Nodos con coordenadas proyectadas y estado calculado para el simTime actual
  const nodes = useMemo(() =>
    NODES_DATA.map((n) => {
      const { x, y }    = geoToSvg(n.lat, n.lon);
      const isActive     = simTime >= n.activationTime;
      const isCollapsing = n.group === 'collapse' && isActive;
      return { ...n, x, y, isActive, isCollapsing };
    }),
    [simTime]
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const hoveredNodeData = hoveredNode ? (nodeMap[hoveredNode] ?? null) : null;

  // Estado del simulador para la UI del panel
  const atEnd            = simTime >= MAX_TIME;
  const isInCrisis       = simTime >= 9; // pérdida de sincronismo
  const progressPct      = (simTime / MAX_TIME) * 100;
  const currentTimestamp = SIM_TIMESTAMPS[Math.min(simTime, MAX_TIME)];
  const btnLabel         = atEnd ? 'Reiniciar simulación'
                         : isPlaying ? 'Pausar simulación' : 'Reproducir simulación';

  return (
    <figure
      className={styles.figure}
      data-dark={isDark ? 'true' : 'false'}
      style={{ background: palette.bg }}
    >
      {/* ── SVG de topología ───────────────────────────────────────── */}
      <div className={styles.mapWrapper}>
        <svg
          viewBox="0 0 1000 800"
          className={styles.map}
          role="img"
          aria-label="Simulador de la cascada de sobretensión del apagón ibérico del 28-A. Muestra la secuencia de disparos desde Granada hasta el cero eléctrico peninsular en 33 segundos."
        >
          <defs>
            {/* Filtros con filterUnits=userSpaceOnUse e IDs únicos por instancia */}
            <filter id={svgIds.glow}
              x="-50" y="-50" width="1100" height="900"
              filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id={svgIds.glowRed}
              x="-50" y="-50" width="1100" height="900"
              filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id={svgIds.relief}
              x="-50" y="-50" width="1100" height="900"
              filterUnits="userSpaceOnUse">
              <feDropShadow
                dx="1.5" dy="2" stdDeviation="2.5"
                floodColor={palette.reliefDark} floodOpacity="0.6"
              />
            </filter>

            {/* gradientUnits=userSpaceOnUse + coordenadas absolutas del viewBox */}
            <radialGradient id={svgIds.landGrad}
              cx="450" cy="360" r="520"
              gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor={palette.landGradStart} />
              <stop offset="100%" stopColor={palette.landGradEnd} />
            </radialGradient>

            {/* ClipPath para confinar elementos al territorio ibérico */}
            <clipPath id={svgIds.clipIberia}>
              {SPAIN_PATHS.map((d, i)    => <path key={`clip-es-${i}`} d={d} />)}
              {PORTUGAL_PATHS.map((d, i) => <path key={`clip-pt-${i}`} d={d} />)}
              {ANDORRA_PATHS.map((d, i)  => <path key={`clip-ad-${i}`} d={d} />)}
            </clipPath>
          </defs>

          {/* Fondos */}
          <rect width="1000" height="800" fill={palette.bg} />
          <rect width="1000" height="800" fill={palette.bgOverlay} />

          {/* Países vecinos */}
          <g fill={palette.landNeighbor} stroke={palette.border} strokeWidth="0.6" aria-hidden="true">
            {COUNTRY_PATHS.FRA?.paths?.map((d, i) => (
              <path key={`fr-${i}`} d={d} strokeLinejoin="round" />
            ))}
            {COUNTRY_PATHS.MAR?.paths?.map((d, i) => (
              <path key={`ma-${i}`} d={d} strokeLinejoin="round" />
            ))}
            {COUNTRY_PATHS.DZA?.paths?.map((d, i) => (
              <path key={`dz-${i}`} d={d} strokeLinejoin="round" />
            ))}
          </g>

          {/* Territorio ibérico con relieve */}
          <g filter={`url(#${svgIds.relief})`} aria-hidden="true">
            {SPAIN_PATHS.map((d, i) => (
              <path key={`es-${i}`} d={d}
                fill={`url(#${svgIds.landGrad})`}
                stroke={palette.landStroke}
                strokeWidth="1.2" strokeLinejoin="round"
              />
            ))}
            {PORTUGAL_PATHS.map((d, i) => (
              <path key={`pt-${i}`} d={d}
                fill={palette.portugFill}
                stroke={palette.portugStroke}
                strokeWidth="1.0" strokeDasharray="4 3" strokeLinejoin="round"
              />
            ))}
            {ANDORRA_PATHS.map((d, i) => (
              <path key={`ad-${i}`} d={d}
                fill={`url(#${svgIds.landGrad})`}
                stroke={palette.landStroke}
                strokeWidth="1.2" strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Costas y fronteras */}
          <g fill="none" stroke={palette.coastline} strokeWidth="1" aria-hidden="true">
            {COASTLINE_PATHS.map((d, i) => <path key={`coast-${i}`} d={d} />)}
          </g>
          <g fill="none" stroke={palette.border} strokeWidth="1" strokeDasharray="3 3" aria-hidden="true">
            {BORDER_PATHS.map((d, i) => <path key={`border-${i}`} d={d} />)}
          </g>

          {/* Líneas de relieve */}
          <g clipPath={`url(#${svgIds.clipIberia})`} opacity="0.5" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <path key={`rel-${i}`}
                d={`M ${80+i*40} ${60+i*25} C ${400+i*15} ${100+i*10}, ${600-i*20} ${500-i*15}, ${200+i*30} ${600-i*20}`}
                fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6"
              />
            ))}
          </g>

          {/* Rejilla de referencia cartográfica */}
          <g clipPath={`url(#${svgIds.clipIberia})`} opacity="0.6" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <line key={`gh-${i}`} x1={0} y1={(800/12)*i} x2={1000} y2={(800/12)*i}
                stroke={palette.gridLine} strokeWidth="0.8" />
            ))}
            {Array.from({ length: 14 }, (_, i) => (
              <line key={`gv-${i}`} x1={(1000/14)*i} y1={0} x2={(1000/14)*i} y2={800}
                stroke={palette.gridLine} strokeWidth="0.8" />
            ))}
          </g>

          {/* ── Links de transmisión ─────────────────────────────── */}
          {LINKS_DATA.map((link, i) => (
            <TopologyLink
              key={i}
              link={link}
              srcNode={nodeMap[link.source]}
              tgtNode={nodeMap[link.target]}
              simTime={simTime}
              palette={palette}
            />
          ))}

          {/* ── Nodos accesibles ─────────────────────────────────── */}
          {nodes.map((node) => (
            <TopologyNode
              key={node.id}
              node={node}
              isHovered={hoveredNode === node.id}
              onHoverEnter={handleHoverEnter}
              onHoverLeave={handleHoverLeave}
              groupColors={groupColors}
              palette={palette}
              svgIds={svgIds}
            />
          ))}

          {/* ── Tooltip con overflow vertical corregido ──────────── */}
          {hoveredNodeData && (
            <NodeTooltip node={hoveredNodeData} palette={palette} />
          )}
        </svg>
      </div>

      {/* ── Panel inferior ─────────────────────────────────────────── */}
      <div
        className={styles.controlPanel}
        style={{ background: palette.panelBg, borderTopColor: palette.border }}
      >
        {/* Columna izquierda: controles y leyenda */}
        <div className={styles.simControls}>

          <div className={styles.simHeader}>
            <span className={styles.simTitle} style={{ color: palette.accent }}>
              Topología red ibérica · 28-A
            </span>
            <button
              type="button"
              onClick={handlePlayPause}
              className={styles.playButton}
              aria-label={btnLabel}
              data-playing={isPlaying ? 'true' : 'false'}
              data-end={atEnd ? 'true' : 'false'}
              style={{
                '--btn-accent': atEnd    ? palette.success
                              : isPlaying ? palette.danger
                              : palette.accent,
              }}
            >
              {atEnd ? '↺ Reiniciar' : isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
            </button>
          </div>

          {/* Barra de progreso temporal con timestamp real */}
          <div className={styles.timeline}>
            <div className={styles.timelineLabels}>
              <span style={{ color: palette.textMuted }}>12:32:00</span>
              <span
                className={styles.timelineCurrent}
                style={{ color: isInCrisis ? palette.danger : palette.accent }}
              >
                {currentTimestamp} CEST
              </span>
              <span style={{ color: palette.textMuted }}>12:33:30</span>
            </div>
            <div
              className={styles.timelineTrack}
              style={{ background: palette.accentSoft }}
            >
              <div
                className={styles.timelineFill}
                style={{
                  width: `${progressPct}%`,
                  background: isInCrisis
                    ? `linear-gradient(90deg, ${palette.warning}, ${palette.danger})`
                    : `linear-gradient(90deg, ${palette.accent}, ${palette.success})`,
                }}
              />
            </div>
          </div>

          {/* Leyenda de grupos */}
          <div className={styles.legendGrid} aria-hidden="true">
            {[
              { color: groupColors.collapse.fill,  label: 'Nodo en colapso' },
              { color: groupColors.stable.fill,    label: 'Nodo estable'    },
              { color: groupColors.portugal.fill,  label: 'Portugal'        },
              { color: groupColors.france.fill,    label: 'Francia'         },
            ].map(({ color, label }) => (
              <div key={label} className={styles.legendItem}>
                <div className={styles.legendDot} style={{ background: color }} />
                <span style={{ color: palette.textMuted }}>{label}</span>
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
          aria-label="Registro de eventos de la cascada de sobretensión"
          style={{ background: palette.logBg, borderColor: palette.border }}
        >
          {visibleLogs.length === 0 ? (
            <p className={styles.eventLogEmpty} style={{ color: palette.textMuted }}>
              Pulsa ▶ para iniciar la simulación de cascada.
            </p>
          ) : (
            visibleLogs.map((log, i) => (
              <div
                key={log.t}
                className={styles.eventEntry}
                data-latest={i === 0 ? 'true' : 'false'}
                style={{
                  color: i === 0 ? palette.textPrimary : palette.textMuted,
                  borderLeftColor: i === 0 ? palette.accent : 'transparent',
                }}
              >
                {log.msg}
              </div>
            ))
          )}
        </div>
      </div>

    </figure>
  );
}

// ── Export con BrowserOnly (Docusaurus SSR) ───────────────────────────────

export default function IberianGridTopology() {
  return (
    <BrowserOnly
      fallback={
        <div
          className={styles.fallback}
          role="status"
          aria-label="Cargando topología de red ibérica"
        >
          Cargando simulador de topología…
        </div>
      }
    >
      {() => <TopologyContent />}
    </BrowserOnly>
  );
}
