import React from 'react';
import styles from './IberianInterconnectionsFigure.module.css';
import {
  COUNTRY_PATHS,
  BORDER_PATHS,
  COASTLINE_PATHS,
  CITY_POINTS,
  ADMIN1_PATHS,
} from '../data/cartography/naturalEarthIberiaPaths';

/* ═══════════════════════════════════════════════════════════════════════════
   PROYECCIÓN LINEAL (equirectangular → viewBox 1000×800)
   ═══════════════════════════════════════════════════════════════════════════ */
const GEO = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 };
const VB  = { w: 1000, h: 800 };

function gp(lat, lon) {
  return {
    x: Math.round(((lon - GEO.west)  / (GEO.east - GEO.west))  * VB.w),
    y: Math.round(((GEO.north - lat) / (GEO.north - GEO.south)) * VB.h),
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   RETÍCULA CARTOGRÁFICA
   ═══════════════════════════════════════════════════════════════════════════ */
const GRATICULE_LONS = [-10, -8, -6, -4, -2, 0, 2, 4];
const GRATICULE_LATS = [36, 38, 40, 42, 44];

function buildGraticulePaths() {
  const lines = [];
  // Meridianos
  for (const lon of GRATICULE_LONS) {
    const top = gp(GEO.north, lon);
    const bot = gp(GEO.south, lon);
    lines.push({
      d: `M${top.x},${top.y} L${bot.x},${bot.y}`,
      label: `${Math.abs(lon)}°${lon < 0 ? 'W' : lon > 0 ? 'E' : ''}`,
      lx: top.x,
      ly: 14,
      anchor: 'middle'
    });
  }
  // Paralelos
  for (const lat of GRATICULE_LATS) {
    const left  = gp(lat, GEO.west);
    const right = gp(lat, GEO.east);
    lines.push({
      d: `M${left.x},${left.y} L${right.x},${right.y}`,
      label: `${lat}°N`,
      lx: 18,
      ly: left.y - 4,
      anchor: 'start'
    });
  }
  return lines;
}
const GRATICULE = buildGraticulePaths();

/* ═══════════════════════════════════════════════════════════════════════════
   EXTRACCIÓN DE CAPAS GEOGRÁFICAS
   ═══════════════════════════════════════════════════════════════════════════ */
const SPAIN_PATHS    = COUNTRY_PATHS.ESP?.paths || [];
const PORTUGAL_PATHS = COUNTRY_PATHS.PRT?.paths || [];
const ANDORRA_PATHS  = COUNTRY_PATHS.AND?.paths || [];
const FRANCE_PATHS   = COUNTRY_PATHS.FRA?.paths || [];
const MOROCCO_PATHS  = COUNTRY_PATHS.MAR?.paths || [];

const ALL_ADMIN1_PATHS = (() => {
  if (!ADMIN1_PATHS) return [];
  const paths = [];
  for (const item of ADMIN1_PATHS) {
    if (item.country === 'ES' || item.country === 'PT') {
      if (item.paths) paths.push(...item.paths);
    }
  }
  return paths;
})();

export default function IberianInterconnectionsFigure() {
  return (
    <figure className={styles.figureContainer}>
      <div className={styles.card}>
        <div className={styles.mapWrapper}>
          <svg
            viewBox="0 0 1000 800"
            className={styles.svgMap}
            role="img"
            aria-labelledby="figure-title figure-desc"
          >
            <title id="figure-title">Interconexiones Eléctricas de la Península Ibérica</title>
            <desc id="figure-desc">
              Mapa técnico que ilustra el aislamiento eléctrico de la Península Ibérica ("isla energética"), 
              mostrando los enlaces AC pirenaicos, el enlace HVDC INELFE-1 y la interconexión con Marruecos, 
              con sus respectivas capacidades de transferencia técnica y ratios de interconexión.
            </desc>

            {/* Retícula Cartográfica */}
            <g>
              {GRATICULE.map((g, i) => (
                <g key={`graticule-${i}`}>
                  <path d={g.d} className={styles.gridPath} />
                  <text
                    x={g.lx}
                    y={g.ly}
                    textAnchor={g.anchor}
                    className={styles.gridText}
                  >
                    {g.label}
                  </text>
                </g>
              ))}
            </g>

            {/* Masas Terrestres */}
            <g>
              {/* Francia (País Vecino) */}
              {FRANCE_PATHS.map((d, i) => (
                <path key={`fra-${i}`} d={d} className={styles.landPathNeighbor} />
              ))}
              {/* Marruecos (País Vecino) */}
              {MOROCCO_PATHS.map((d, i) => (
                <path key={`mar-${i}`} d={d} className={styles.landPathNeighbor} />
              ))}
              {/* España (País Principal) */}
              {SPAIN_PATHS.map((d, i) => (
                <path key={`esp-${i}`} d={d} className={styles.landPathMain} />
              ))}
              {/* Portugal (País Principal - con overlay rayado sutil en CSS/SVG) */}
              {PORTUGAL_PATHS.map((d, i) => (
                <path key={`prt-${i}`} d={d} className={styles.landPathMain} />
              ))}
              {/* Andorra */}
              {ANDORRA_PATHS.map((d, i) => (
                <path key={`and-${i}`} d={d} className={styles.landPathMain} />
              ))}
            </g>

            {/* Capa de Provincias / CCAA (ADMIN_1) */}
            <g>
              {ALL_ADMIN1_PATHS.map((d, i) => (
                <path key={`admin1-${i}`} d={d} className={styles.adminBorderPath} />
              ))}
            </g>

            {/* Líneas de Fronteras Políticas */}
            <g>
              {BORDER_PATHS.map((d, i) => (
                <path key={`border-${i}`} d={d} className={styles.borderPath} />
              ))}
            </g>

            {/* Línea de Costa */}
            <g>
              {COASTLINE_PATHS.map((d, i) => (
                <path key={`coastline-${i}`} d={d} className={styles.coastlinePath} />
              ))}
            </g>

            {/* Ciudades de Referencia Geográfica */}
            <g opacity="0.45">
              {CITY_POINTS.filter(c => ['Madrid', 'Lisboa', 'Barcelona', 'Burdeos', 'Sevilla', 'Toulouse', 'Rabat'].includes(c.name)).map((c, i) => (
                <g key={`city-${i}`} transform={`translate(${c.x}, ${c.y})`}>
                  <circle r="2" fill="currentColor" style={{ fill: 'var(--fig-text-muted)' }} />
                  <text
                    x="5"
                    y="3"
                    fontFamily="var(--font-mono, monospace)"
                    fontSize="7.5"
                    style={{ fill: 'var(--fig-text-muted)' }}
                    opacity="0.8"
                  >
                    {c.name}
                  </text>
                </g>
              ))}
            </g>

            {/* Etiquetas Territoriales */}
            <g>
              <text x="740" y="80" className={styles.territoryLabel}>FRANCE · RTE</text>
              <text x="110" y="520" className={styles.territoryLabel}>PORTUGAL</text>
              <text x="430" y="415" className={styles.territoryLabel}>SPAIN</text>
              <text x="310" y="780" className={styles.territoryLabel}>MOROCCO · ONEE</text>
              <text x="290" y="340" className={styles.territoryLabelMajor}>IBERIAN PENINSULA</text>
            </g>

            {/* ─── INTERCONEXIONES ELÉCTRICAS ─── */}
            <g>
              {/* Enlaces AC Pirenaicos (Central, Oeste, Este) */}
              <g>
                <path d="M 485,210 L 505,188" className={styles.linkACLine} />
                <path d="M 595,225 L 610,195" className={styles.linkACLine} />
                <path d="M 710,234 L 720,210" className={styles.linkACLine} />
              </g>

              {/* Enlace HVDC INELFE-1 (Santa Llogaia - Baixas) */}
              <path d="M 775,236 Q 785,227 785,218" className={styles.linkDCLine} />

              {/* Submarine Morocco Interconnection (Tarifa - Melloussa) */}
              <path d="M 290,648 Q 285,662 290,675" className={styles.linkACLine} strokeDasharray="3 2" />
            </g>

            {/* ─── LÍNEAS INDICADORAS (LEADERS) ─── */}
            <g>
              {/* Leader AC Pirenaico */}
              <path d="M 540,165 L 595,212" className={styles.indicatorLine} />
              <circle cx="595" cy="212" r="3" className={styles.indicatorCircle} />

              {/* Leader INELFE-1 */}
              <path d="M 780,270 L 782,228" className={styles.indicatorLine} />
              <circle cx="782" cy="228" r="3" className={styles.indicatorCircle} />

              {/* Leader Marruecos */}
              <path d="M 370,710 L 290,660" className={styles.indicatorLine} />
              <circle cx="290" cy="660" r="3" className={styles.indicatorCircle} />
            </g>

            {/* ─── CAJAS DE DATOS (TEXT CALLOUTS) ─── */}
            
            {/* 1. Pyrenean AC Links Box */}
            <g transform="translate(370, 90)">
              <rect x="0" y="0" width="250" height="75" rx="5" fill="var(--fig-card-bg)" stroke="var(--fig-card-border)" strokeWidth="1" />
              <text x="12" y="20" className={styles.boxTitle}>PYRENEAN AC LINKS</text>
              
              <text x="12" y="40" className={styles.boxBodyTitle}>Typical Flow:</text>
              <text x="110" y="40" className={styles.boxBodyValue}>~870 MW (physical)</text>
              
              <text x="12" y="56" className={styles.boxBodyTitle}>TTC Capacity:</text>
              <text x="110" y="56" className={styles.boxBodyValue}>~2,700 MW (limit)</text>
            </g>

            {/* 2. HVDC INELFE-1 Box */}
            <g transform="translate(710, 270)">
              <rect x="0" y="0" width="250" height="75" rx="5" fill="var(--fig-card-bg)" stroke="var(--fig-card-border)" strokeWidth="1" />
              <text x="12" y="20" className={styles.boxTitle}>HVDC INELFE-1 (VSC-HVDC)</text>
              
              <text x="12" y="40" className={styles.boxBodyTitle}>Active Flow:</text>
              <text x="110" y="40" className={styles.boxBodyValue}>1,000 MW (operating)</text>
              
              <text x="12" y="56" className={styles.boxBodyTitle}>Design Cap:</text>
              <text x="110" y="56" className={styles.boxBodyValue}>2,000 MW (design)</text>
            </g>

            {/* 3. Morocco Interconnection Box */}
            <g transform="translate(350, 710)">
              <rect x="0" y="0" width="250" height="75" rx="5" fill="var(--fig-card-bg)" stroke="var(--fig-card-border)" strokeWidth="1" />
              <text x="12" y="20" className={styles.boxTitle}>MOROCCO INTERCONNECTION</text>
              
              <text x="12" y="40" className={styles.boxBodyTitle}>Typical Flow:</text>
              <text x="110" y="40" className={styles.boxBodyValue}>~314 MW (import/export)</text>
              
              <text x="12" y="56" className={styles.boxBodyTitle}>TTC Capacity:</text>
              <text x="110" y="56" className={styles.boxBodyValue}>~900 MW (limit)</text>
            </g>

            {/* 4. Interconnection Ratio Box (Caja Lateral) */}
            <g transform="translate(40, 80)">
              <rect x="0" y="0" width="270" height="110" rx="5" fill="var(--fig-card-bg)" stroke="var(--fig-card-border)" strokeWidth="1" />
              <text x="16" y="24" className={styles.boxTitle}>INTERCONNECTION RATIO</text>
              
              <text x="16" y="48" className={styles.boxBodyTitle}>Iberian Rate:</text>
              <text x="100" y="48" className={styles.boxBodyValue}>~3% - 5% (installed cap.)</text>
              
              <text x="16" y="66" className={styles.boxBodyTitle}>EU 2030 Target:</text>
              <text x="100" y="66" className={styles.boxBodyValue}>15% (European Goal)</text>
              
              <text x="16" y="86" className={styles.boxBodyTitle}>Status:</text>
              <text x="100" y="86" className={styles.boxBodyValue} style={{ fill: 'var(--fig-title-color)', fontWeight: 600 }}>Energy Island Condition</text>
            </g>

            {/* 5. Energy Island Capsule (Cápsula superior) */}
            <g transform="translate(40, 30)">
              <rect x="0" y="0" width="270" height="32" rx="4" fill="var(--fig-card-bg)" stroke="var(--fig-card-border)" strokeWidth="1" />
              <text x="135" y="20" className={styles.capsuleText}>IBERIAN "ENERGY ISLAND" STATUS</text>
            </g>

          </svg>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <strong className={styles.captionStrong}>Figura B2.</strong> Interconexiones funcionales del sistema ibérico y condición de isla energética.
        La capacidad de transferencia e interconexión neta con el continente europeo (vía Francia) representa apenas un 3–5% de la potencia instalada, lejos del objetivo comunitario del 15%.
      </figcaption>
    </figure>
  );
}
