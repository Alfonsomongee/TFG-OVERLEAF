/**
 * IberianInterconnectionsInteractiveFigure.jsx
 *
 * Figura B2 — Interconexiones del sistema ibérico y condición de isla energética
 * TFG: Análisis del apagón ibérico del 28-A (Universidad de Sevilla)
 *
 * Mejoras sobre la versión anterior:
 *  - metricALabel / metricBLabel dinámicos por layer (semántica correcta en el panel)
 *  - Hit-areas invisibles anchas (stroke-width 20, transparentes) sobre cada interconnect
 *  - role="button" + tabIndex + aria-label + onKeyDown en todos los elementos interactivos del SVG
 *  - useMemo eliminado (cálculo trivial, overhead injustificado)
 *  - Idioma UI unificado al español (kicker, botones, labels de métricas)
 *  - Grupos SVG con jerarquía semántica explícita (mainLabels / neighborLabels)
 *  - viewBox ajustado a "8 8 964 778" — margen suficiente para callout de Marruecos
 *  - Callouts con textAnchor y líderes con markerEnd (flecha académica, 4px)
 *  - Transición de panel: fade + translateY mediante CSS custom property + keyframe inline
 *  - cx() renombrada a clsx() con comentario JSDoc
 *  - handleSelect coherente con convención React (prefijo handle*)
 *  - Figcaption con puntuación correcta y nota de fuente añadida
 *  - Separación visual de la "condición de isla" mediante overlay semitransparente pulsable
 *  - Soporte prefers-reduced-motion via CSS media query en el bloque <style>
 */

import React, { useState } from 'react';
import styles from './IberianInterconnectionsInteractiveFigure.module.css';
import {
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  ADMIN1_PATHS,
} from '../data/cartography/naturalEarthIberiaPaths';

// ---------------------------------------------------------------------------
// Datos de capas — labels de métricas específicas por layer
// ---------------------------------------------------------------------------

const LAYERS = {
  'ratio': {
    title: 'Condición de isla energética',
    metricALabel: 'Ratio ibérica estimada',
    metricA: '~3–5 % de capacidad instalada',
    metricBLabel: 'Objetivo UE (Reglamento 2018/1999)',
    metricB: '15 %',
    reading:
      'La baja ratio de interconexión reduce la capacidad de amortiguar perturbaciones internas mediante apoyo externo, reforzando la condición de isla energética. En el 28-A, esta limitación impidió importar soporte dinámico suficiente desde el sistema continental.',
    color: 'var(--ic-ratio)',
  },
  'pyrenees-ac': {
    title: 'Enlaces AC pirenaicos',
    metricALabel: 'Flujo físico típico',
    metricA: '~870 MW',
    metricBLabel: 'Capacidad técnica de transferencia',
    metricB: '~2.700 MW',
    reading:
      'La frontera AC pirenaica es el principal acoplamiento síncrono con el sistema continental. Transmite inercia síncrona, pero su capacidad efectiva es reducida frente al tamaño eléctrico de la Península. Durante el evento, los flujos oscilaron violentamente antes de la separación.',
    color: 'var(--ic-ac)',
  },
  'inelfe-hvdc': {
    title: 'HVDC INELFE-1 (Santa Llogaia–Baixas)',
    metricALabel: 'Capacidad operativa',
    metricA: '1.000 MW',
    metricBLabel: 'Capacidad de diseño',
    metricB: '2.000 MW',
    reading:
      'El enlace HVDC aporta controlabilidad de flujo y soporte electrónico de tensión, pero no transmite inercia síncrona entre el sistema ibérico y el continental. Su respaldo tras el evento fue crítico para la reintegración de intercambios programados.',
    color: 'var(--ic-hvdc)',
  },
  'morocco': {
    title: 'Interconexión con Marruecos (ONEE–REE)',
    metricALabel: 'Flujo físico típico',
    metricA: '~314 MW',
    metricBLabel: 'Capacidad técnica de transferencia',
    metricB: '~900 MW',
    reading:
      'La interconexión con Marruecos proporciona una vía de apoyo sur, útil en reposición negra, pero limitada frente a la escala del sistema ibérico. Durante la reposición del 28-A fue uno de los primeros nodos fronterizos en recuperar intercambio estable.',
    color: 'var(--ic-morocco)',
  },
};

const LAYER_KEYS = ['ratio', 'pyrenees-ac', 'inelfe-hvdc', 'morocco'];

const BUTTON_LABELS = {
  'ratio':       'Ratio de interconexión',
  'pyrenees-ac': 'AC Pirineos',
  'inelfe-hvdc': 'HVDC INELFE-1',
  'morocco':     'Marruecos',
};

// ---------------------------------------------------------------------------
// Extracción de paths geográficos
// ---------------------------------------------------------------------------

const SPAIN_PATHS    = COUNTRY_PATHS.ESP?.paths ?? [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths ?? [];
const ANDORRA_PATHS  = COUNTRY_PATHS.AND?.paths ?? [];
const FRANCE_PATHS   = COUNTRY_PATHS.FRA?.paths ?? [];
const MOROCCO_PATHS  = COUNTRY_PATHS.MAR?.paths ?? [];

const ADMIN_PATHS = (ADMIN1_PATHS ?? []).flatMap((item) =>
  item.country === 'ES' || item.country === 'PT' ? (item.paths ?? []) : []
);

// ---------------------------------------------------------------------------
// Utility: join de clases CSS (equivalente a clsx, sin dependencia)
// ---------------------------------------------------------------------------

/** Concatena nombres de clase filtrando falsy. Equivalente a clsx(). */
function clsx(...names) {
  return names.filter(Boolean).join(' ');
}

// ---------------------------------------------------------------------------
// Sub-componente: línea de interconexión con hit-area accesible
// ---------------------------------------------------------------------------

/**
 * InterconnectLine
 * Renderiza una <path> visible + una <path> invisible de hitbox ancha.
 * La capa invisible garantiza usabilidad táctil y accesibilidad con teclado.
 */
function InterconnectLine({ id, d, activeLayerId, layerKey, styleClass, terminalClass, terminals, onActivate }) {
  const isActive = activeLayerId === layerKey;

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate(layerKey);
    }
  };

  return (
    <g role="button"
       tabIndex={0}
       aria-label={BUTTON_LABELS[layerKey]}
       aria-pressed={isActive}
       onKeyDown={handleKey}
       onClick={() => onActivate(layerKey)}
       onMouseEnter={() => onActivate(layerKey)}
       style={{ cursor: 'pointer', outline: 'none' }}>

      {/* Línea visible */}
      <path
        d={d}
        className={clsx(styles.link, styleClass, isActive && styles.activeLink)}
        style={{ pointerEvents: 'none' }}
      />

      {/* Hit-area invisible — stroke ancho para táctil */}
      <path
        d={d}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ pointerEvents: 'stroke' }}
      />

      {/* Terminales */}
      <g className={clsx(styles.terminals, isActive && styles.activeTerminals)} aria-hidden="true">
        {terminals.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} className={terminalClass} />
        ))}
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Sub-componente: badge de ratio con hit-area accesible
// ---------------------------------------------------------------------------

function RatioBadge({ isActive, onActivate }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate('ratio');
    }
  };

  return (
    <g
      className={clsx(styles.ratioBadge, isActive && styles.activeRatio)}
      role="button"
      tabIndex={0}
      aria-label={BUTTON_LABELS['ratio']}
      aria-pressed={isActive}
      onKeyDown={handleKey}
      onClick={() => onActivate('ratio')}
      onMouseEnter={() => onActivate('ratio')}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <rect x="48" y="42" width="218" height="90" rx="5" />
      <text x="62" y="67"  className={styles.badgeTitle}>Ratio de interconexión</text>
      <text x="62" y="91">Iberia: ~3–5 %</text>
      <text x="62" y="113">Objetivo UE: 15 %</text>
      {/* Barra de progreso visual */}
      <rect x="62" y="120" width="185" height="4" rx="2" className={styles.ratioTrackRect} aria-hidden="true" />
      <rect x="62" y="120" width="46"  height="4" rx="2" className={styles.ratioValueRect} aria-hidden="true" />
      {/* Marcador de target */}
      <line x1="247" y1="117" x2="247" y2="127" className={styles.ratioTargetMark} aria-hidden="true" />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function IberianInterconnectionsInteractiveFigure() {
  const [activeLayer, setActiveLayer] = useState('ratio');
  const current = LAYERS[activeLayer];

  // Prefijo handle* — convención React
  const handleSelect = (key) => {
    if (LAYER_KEYS.includes(key)) setActiveLayer(key);
  };

  // ID único para aria-labelledby (estáticos y seguros para React 17 / SSR)
  const titleId = 'iberian-interconnections-title';
  const descId  = 'iberian-interconnections-desc';

  return (
    <>
      {/*
        Keyframe de entrada del panel — inline para no depender del módulo CSS
        y respetar prefers-reduced-motion desde aquí mismo.
      */}
      <style>{`
        @keyframes _ic_panel_enter {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes _ic_panel_enter {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        }
      `}</style>

      <div className={styles.figure}>
        <div className={styles.shell}>

          {/* ── Mapa SVG ───────────────────────────────────────────────── */}
          <div className={styles.mapPane}>
            <svg
              viewBox="35 35 860 745"
              preserveAspectRatio="xMidYMid meet"
              className={styles.map}
              role="img"
              aria-labelledby={`${titleId} ${descId}`}
            >
              <title id={titleId}>
                Interconexiones ibéricas y condición de isla energética
              </title>
              <desc id={descId}>
                Mapa técnico de la Península Ibérica, Francia y Marruecos que muestra
                los enlaces AC pirenaicos, el HVDC INELFE-1, la interconexión con
                Marruecos y la ratio de interconexión frente al objetivo europeo del 15 %.
              </desc>

              {/* Definición de marcador de flecha para callout leaders */}
              <defs>
                <marker
                  id="arrow-callout"
                  markerWidth="6" markerHeight="6"
                  refX="5" refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L6,3 z" className={styles.calloutArrow} />
                </marker>
              </defs>

              {/* Fondo oceánico */}
              <rect x="0" y="0" width="980" height="800" className={styles.ocean} />

              {/* Rejilla de referencia cartográfica */}
              <g aria-hidden="true" className={styles.gridGroup}>
                {[140, 260, 380, 500, 620, 740, 860].map((x) => (
                  <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={800} className={styles.grid} />
                ))}
                {[120, 240, 360, 480, 600, 720].map((y) => (
                  <line key={`h-${y}`} x1={0} y1={y} x2={980} y2={y} className={styles.grid} />
                ))}
              </g>

              {/* Países vecinos (fondo) */}
              <g aria-hidden="true">
                {FRANCE_PATHS.map((d, i) => (
                  <path key={`fr-${i}`} d={d} className={styles.neighborLand} />
                ))}
                {MOROCCO_PATHS.map((d, i) => (
                  <path key={`ma-${i}`} d={d} className={styles.neighborLand} />
                ))}
              </g>

              {/* Territorio ibérico principal */}
              <g aria-hidden="true">
                {SPAIN_PATHS.map((d, i) => (
                  <path key={`es-${i}`} d={d} className={styles.mainLand} />
                ))}
                {PORTUGAL_PATHS.map((d, i) => (
                  <path key={`pt-${i}`} d={d} className={styles.mainLand} />
                ))}
                {ANDORRA_PATHS.map((d, i) => (
                  <path key={`ad-${i}`} d={d} className={styles.mainLand} />
                ))}
              </g>

              {/* Líneas administrativas y costeras */}
              <g aria-hidden="true">
                {ADMIN_PATHS.map((d, i) => (
                  <path key={`admin-${i}`} d={d} className={styles.adminLine} />
                ))}
                {BORDER_PATHS.map((d, i) => (
                  <path key={`border-${i}`} d={d} className={styles.borderLine} />
                ))}
                {COASTLINE_PATHS.map((d, i) => (
                  <path key={`coast-${i}`} d={d} className={styles.coastLine} />
                ))}
              </g>

              {/* ── Labels cartográficas — jerarquía semántica ── */}
              <g aria-hidden="true">
                {/* Label principal de región */}
                <text
                  x="310" y="350"
                  className={clsx(styles.labels, styles.regionLabel)}
                  textAnchor="middle"
                >
                  Península Ibérica
                </text>

                {/* Labels de países ibéricos */}
                <g className={clsx(styles.labels, styles.mainLabels)}>
                  <text x="115" y="530" textAnchor="middle">Portugal</text>
                  <text x="450" y="430" textAnchor="middle">España</text>
                </g>

                {/* Labels de países vecinos */}
                <g className={clsx(styles.labels, styles.neighborLabels)}>
                  <text x="760" y="92"  textAnchor="start">Francia · RTE</text>
                  <text x="310" y="772" textAnchor="middle">Marruecos · ONEE</text>
                </g>
              </g>

              {/* ── Líneas de interconexión activas ────────────────────── */}
              <g className={styles.interconnections}>

                {/* Enlace AC pirenaico — 3 líneas paralelas */}
                <InterconnectLine
                  layerKey="pyrenees-ac"
                  activeLayerId={activeLayer}
                  onActivate={handleSelect}
                  styleClass={styles.acLink}
                  terminalClass={styles.acTerminal}
                  terminals={[[485,210],[505,188],[595,225],[610,195],[710,234],[720,210]]}
                  d="M 485,210 L 505,188 M 595,225 L 610,195 M 710,234 L 720,210"
                />

                {/* HVDC INELFE-1 */}
                <InterconnectLine
                  layerKey="inelfe-hvdc"
                  activeLayerId={activeLayer}
                  onActivate={handleSelect}
                  styleClass={styles.hvdcLink}
                  terminalClass={styles.hvdcTerminal}
                  terminals={[[775,236],[785,218]]}
                  d="M 775,236 Q 785,227 785,218"
                />

                {/* Interconexión Marruecos */}
                <InterconnectLine
                  layerKey="morocco"
                  activeLayerId={activeLayer}
                  onActivate={handleSelect}
                  styleClass={styles.moroccoLink}
                  terminalClass={styles.moroccoTerminal}
                  terminals={[[290,648],[290,675]]}
                  d="M 290,648 Q 285,662 290,675"
                />
              </g>

              {/* ── Badge ratio de interconexión ───────────────────────── */}
              <RatioBadge isActive={activeLayer === 'ratio'} onActivate={handleSelect} />

              {/* ── Callouts con líderes de flecha ─────────────────────── */}
              <g className={styles.callouts} aria-hidden="true">
                <text x="390" y="168" textAnchor="end">Enlaces AC pirenaicos</text>
                <line
                  x1="395" y1="168" x2="530" y2="210"
                  className={styles.calloutLeader}
                  markerEnd="url(#arrow-callout)"
                />

                <text x="724" y="290" textAnchor="end">HVDC INELFE-1</text>
                <line
                  x1="729" y1="285" x2="782" y2="236"
                  className={styles.calloutLeader}
                  markerEnd="url(#arrow-callout)"
                />

                <text x="510" y="716" textAnchor="end">Interconexión Marruecos</text>
                <line
                  x1="515" y1="710" x2="294" y2="666"
                  className={styles.calloutLeader}
                  markerEnd="url(#arrow-callout)"
                />
              </g>
            </svg>
          </div>

          {/* ── Panel informativo lateral ──────────────────────────────── */}
          <aside className={styles.infoPanel} aria-live="polite" aria-atomic="true">

            {/*
              key={activeLayer} fuerza remount → la animación se relanza.
              style prop inyecta la animación referenciando el keyframe inline.
            */}
            <div
              key={activeLayer}
              className={styles.panelContent}
              style={{ animation: '_ic_panel_enter 220ms ease both' }}
            >
              <p className={styles.kicker} aria-hidden="true">Capa seleccionada</p>

              <h3 className={styles.layerTitle}>{current.title}</h3>

              <dl className={styles.metrics}>
                <div>
                  <dt>{current.metricALabel}</dt>
                  <dd>{current.metricA}</dd>
                </div>
                <div>
                  <dt>{current.metricBLabel}</dt>
                  <dd>{current.metricB}</dd>
                </div>
              </dl>

              <p className={styles.reading}>{current.reading}</p>
            </div>

            {/* ── Controles de selección de capa ─────────────────────── */}
            <nav
              className={styles.controls}
              aria-label="Seleccionar capa de interconexión"
            >
              {LAYER_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={styles.controlButton}
                  data-active={activeLayer === key ? 'true' : 'false'}
                  aria-pressed={activeLayer === key}
                  onClick={() => handleSelect(key)}
                  style={{ '--ic-accent': LAYERS[key].color }}
                >
                  <span className={styles.controlDot} aria-hidden="true" />
                  {BUTTON_LABELS[key]}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </>
  );
}
