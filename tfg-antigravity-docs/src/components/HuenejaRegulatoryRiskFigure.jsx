import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './HuenejaRegulatoryRiskFigure.module.css';

/* ─── Paleta ─────────────────────────────────────────────────────────────── */
function getPalette(isDark) {
  return {
    bg:          isDark ? 'rgba(14,26,50,0.96)'    : 'rgba(255,252,245,0.97)',
    surface:     isDark ? 'rgba(18,32,58,0.90)'    : 'rgba(248,244,236,0.92)',
    surface2:    isDark ? 'rgba(10,20,42,0.80)'    : 'rgba(242,237,226,0.88)',
    border:      isDark ? 'rgba(190,209,230,0.18)' : 'rgba(58,49,35,0.16)',
    borderStrong:isDark ? 'rgba(190,209,230,0.32)' : 'rgba(58,49,35,0.28)',
    text1:       isDark ? '#f4f7fb'  : '#191814',
    text2:       isDark ? '#d6e0ee'  : '#3a3428',
    text3:       isDark ? '#aab9cc'  : '#6a5f52',
    main:        isDark ? '#83bdc2'  : '#145c63',
    mainGlow:    isDark ? 'rgba(131,189,194,0.22)' : 'rgba(20,92,99,0.12)',
    mainLine:    isDark ? 'rgba(131,189,194,0.50)' : 'rgba(20,92,99,0.45)',
    amber:       isDark ? '#d4a84e'  : '#8a6030',
    amberSoft:   isDark ? 'rgba(212,168,78,0.15)'  : 'rgba(138,96,48,0.10)',
    red:         isDark ? '#d86a64'  : '#8c2e2a',
    redSoft:     isDark ? 'rgba(216,106,100,0.15)' : 'rgba(140,46,42,0.09)',
    nodeFill:    isDark ? '#1a3a5c'  : '#e8f4f5',
    ibr:         isDark ? 'rgba(212,168,78,0.28)'  : 'rgba(138,96,48,0.18)',
    ibrStroke:   isDark ? '#d4a84e'  : '#8a6030',
  };
}

/* ─── SVG Nodo grande ────────────────────────────────────────────────────── */
function NodeSVG({ p }) {
  const cx = 140, cy = 140;

  const plants = [
    { angle: -100, dist: 88, type: 'FV', label: 'Fotovoltaica' },
    { angle:  -55, dist: 92, type: 'FV', label: 'Fotovoltaica' },
    { angle:   -8, dist: 88, type: 'TS', label: 'Termosolar'   },
    { angle:   42, dist: 90, type: 'EO', label: 'Eólica'       },
    { angle:   92, dist: 86, type: 'EO', label: 'Eólica'       },
    { angle:  145, dist: 88, type: 'FV', label: 'Fotovoltaica' },
    { angle:  195, dist: 84, type: 'FV', label: 'Fotovoltaica' },
    { angle:  248, dist: 88, type: 'TS', label: 'Termosolar'   },
  ];

  function pt(angle, dist) {
    const r = (angle * Math.PI) / 180;
    return { x: cx + dist * Math.cos(r), y: cy + dist * Math.sin(r) };
  }

  const troncalLeft  = pt(-130, 48);
  const troncalRight = pt(-50,  48);

  return (
    <svg
      viewBox="0 0 280 280"
      width="100%"
      height="auto"
      role="img"
      aria-label="Topología del nodo Huéneja: hub de evacuación renovable 400 kV conectado a plantas fotovoltaicas, eólicas y termosolares"
    >
      {/* Aura exterior */}
      <circle cx={cx} cy={cy} r={72} fill={p.mainGlow} />
      <circle cx={cx} cy={cy} r={52} fill={p.mainGlow} />

      {/* Líneas a plantas IBR */}
      {plants.map((pl, i) => {
        const ep = pt(pl.angle, pl.dist - 8);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={ep.x} y2={ep.y}
            stroke={p.mainLine}
            strokeWidth={1.8}
            strokeDasharray="5 3"
          />
        );
      })}

      {/* Nodos planta */}
      {plants.map((pl, i) => {
        const ep = pt(pl.angle, pl.dist);
        const lp = pt(pl.angle, pl.dist + 16);
        return (
          <g key={i}>
            <circle cx={ep.x} cy={ep.y} r={7} fill={p.ibr} stroke={p.ibrStroke} strokeWidth={1.4} />
            <text
              x={lp.x} y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={9}
              fontWeight={600}
              fill={p.amber}
              fontFamily="'IBM Plex Mono', monospace"
            >
              {pl.type}
            </text>
          </g>
        );
      })}

      {/* Líneas troncales 400 kV hacia arriba */}
      <line x1={cx} y1={cy - 28} x2={troncalLeft.x}  y2={troncalLeft.y}  stroke={p.main} strokeWidth={3} />
      <line x1={cx} y1={cy - 28} x2={troncalRight.x} y2={troncalRight.y} stroke={p.main} strokeWidth={3} />

      {/* Doble barra troncal */}
      <line x1={troncalLeft.x - 8} y1={troncalLeft.y - 4}  x2={troncalRight.x + 8} y2={troncalRight.y - 4}  stroke={p.main} strokeWidth={3} />
      <line x1={troncalLeft.x - 8} y1={troncalLeft.y + 2}  x2={troncalRight.x + 8} y2={troncalRight.y + 2}  stroke={p.main} strokeWidth={1.5} strokeOpacity={0.5} />

      {/* Etiqueta 400 kV */}
      <text
        x={cx} y={troncalLeft.y - 14}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill={p.main}
        fontFamily="'IBM Plex Mono', monospace"
        letterSpacing="0.05em"
      >
        400 kV
      </text>

      {/* Nodo central Huéneja */}
      <circle cx={cx} cy={cy} r={30} fill={p.nodeFill} stroke={p.main} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={22} fill={p.main} fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={10} fill={p.main} />

      {/* Texto central */}
      <text
        x={cx} y={cy + 42}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={p.main}
        fontFamily="'IBM Plex Mono', monospace"
        letterSpacing="-0.01em"
      >
        Huéneja
      </text>
      <text
        x={cx} y={cy + 57}
        textAnchor="middle"
        fontSize={10}
        fill={p.text3}
        fontFamily="'IBM Plex Mono', monospace"
      >
        ~668 MW evacuados
      </text>

      {/* Leyenda inferior */}
      <g transform="translate(16, 262)">
        <circle cx={5} cy={5} r={5} fill={p.ibr} stroke={p.ibrStroke} strokeWidth={1.2} />
        <text x={14} y={9} fontSize={8} fill={p.text3} fontFamily="'IBM Plex Mono', monospace">
          FV Fotovoltaica · EO Eólica · TS Termosolar
        </text>
      </g>
    </svg>
  );
}

/* ─── Barra sancionadora ─────────────────────────────────────────────────── */
function SanctionRow({ grado, techo, pct, color, arts, detail, active, onToggle, id, p }) {
  const accent = color === 'red' ? p.red : p.amber;
  const accentSoft = color === 'red' ? p.redSoft : p.amberSoft;

  return (
    <button
      className={`${styles.sanctionRow} ${active ? styles.sanctionRowActive : ''}`}
      style={{ borderColor: active ? accent : p.border, background: active ? accentSoft : 'transparent' }}
      onClick={() => onToggle(id)}
      aria-expanded={active}
    >
      <div className={styles.sanctionTop}>
        <span className={styles.sanctionGrade} style={{ color: accent }}>{grado}</span>
        <span className={styles.sanctionAmount} style={{ color: accent }}>{techo}</span>
      </div>
      <div className={styles.sanctionTrack} style={{ background: p.border }}>
        <div className={styles.sanctionBar} style={{ width: `${pct}%`, background: accent }} />
      </div>
      {active && (
        <div className={styles.sanctionExpanded} style={{ color: p.text3, borderTopColor: p.border }}>
          <span className={styles.sanctionArts}>{arts}</span>
          <span className={styles.sanctionDetail}>{detail}</span>
        </div>
      )}
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function HuenejaRegulatoryRiskFigure() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const p = getPalette(isDark);
  const [active, setActive] = useState(null);
  const toggle = id => setActive(prev => prev === id ? null : id);

  return (
    <figure className={styles.figure} style={{ background: p.bg, borderColor: p.border }}>

      {/* Kicker */}
      <span className={styles.kicker} style={{ color: p.main }}>
        Capítulo 7b · Régimen sancionador
      </span>

      {/* Dos bloques principales */}
      <div className={styles.grid}>

        {/* ── Bloque izquierdo: nodo eléctrico ── */}
        <div className={styles.nodeBlock} style={{ background: p.surface, borderColor: p.border }}>
          <div className={styles.blockTitle} style={{ color: p.text2 }}>
            Nodo de evacuación renovable
          </div>

          <NodeSVG p={p} />

          {/* Cuatro datos clave */}
          <div className={styles.nodeData}>
            {[
              { k: 'Tensión',    v: '400 kV' },
              { k: 'Ubicación',  v: 'Marquesado del Zenete · Granada' },
              { k: 'Potencia',   v: '~668 MW evacuados' },
              { k: 'Tecnologías',v: 'FV · Eólica · Termosolar' },
            ].map(({ k, v }) => (
              <div key={k} className={styles.nodeDataRow}>
                <span className={styles.nodeDataKey} style={{ color: p.text3 }}>{k}</span>
                <span className={styles.nodeDataVal} style={{ color: p.text1 }}>{v}</span>
              </div>
            ))}
          </div>

          <p className={styles.nodeRol} style={{ color: p.text3, borderTopColor: p.border }}>
            Primera cascada de desconexiones IBR identificada en su área de influencia topológica.
          </p>
        </div>

        {/* ── Bloque derecho: marco sancionador ── */}
        <div className={styles.sanctionBlock}>

          <div className={styles.blockTitle} style={{ color: p.text2 }}>
            Marco sancionador · CNMC
          </div>

          {/* Contador 66 */}
          <div className={styles.counter} style={{ background: p.surface, borderColor: p.borderStrong }}>
            <span className={styles.counterNum} style={{ color: p.red }}>66</span>
            <div className={styles.counterText}>
              <span className={styles.counterLabel} style={{ color: p.text1 }}>expedientes incoados</span>
              <span className={styles.counterSub} style={{ color: p.text3 }}>
                Iberdrola · Endesa · Naturgy · Repsol · REE
              </span>
            </div>
          </div>

          {/* Escala sancionadora */}
          <div className={styles.scaleTitle} style={{ color: p.text3 }}>
            Escala sancionadora — pulsa para ampliar
          </div>

          <SanctionRow
            id="grave"
            grado="INFRACCIÓN GRAVE"
            techo="hasta 6 M€"
            pct={10}
            color="amber"
            arts="Arts. 64.15, 64.16 y 64.17 — Ley 24/2013"
            detail="Tipificación inicial del expediente Huéneja (mayo 2025). Incumplimiento de obligación de mantenimiento y operatividad conforme a consignas del operador."
            active={active === 'grave'}
            onToggle={toggle}
            p={p}
          />

          <SanctionRow
            id="muyGrave"
            grado="INFRACCIÓN MUY GRAVE"
            techo="hasta 60 M€"
            pct={100}
            color="red"
            arts="Arts. 64.37 y 61.a — Ley 24/2013"
            detail="Contingencia máxima. Aplicable si la instrucción determina que el incumplimiento contribuyó directamente a la perturbación sistémica."
            active={active === 'muyGrave'}
            onToggle={toggle}
            p={p}
          />

          <div className={styles.scaleNote} style={{ color: p.text3 }}>
            Barras proporcionales: 6 M€ = 10 % · 60 M€ = 100 %
          </div>

          {/* Plazo */}
          <div className={styles.plazo} style={{ background: p.surface, borderColor: p.border }}>
            <span className={styles.plazoKey} style={{ color: p.text3 }}>Plazo resolución</span>
            <span className={styles.plazoVal} style={{ color: p.text2 }}>Hasta 18 meses · MITECO</span>
          </div>

          {/* Nota metodológica */}
          <div className={styles.methodNote} style={{ background: p.amberSoft, borderColor: `rgba(138,96,48,0.22)` }}>
            <span className={styles.methodIcon} style={{ color: p.amber }}>⚠</span>
            <p className={styles.methodText} style={{ color: p.text2 }}>
              Expedientes abiertos, no sentencias. Huéneja es área de influencia topológica
              de la primera cascada —no causa única del colapso, que fue multifactorial.
              Los techos representan máximos legales, no sanciones firmes.
            </p>
          </div>

        </div>
      </div>

    </figure>
  );
}
