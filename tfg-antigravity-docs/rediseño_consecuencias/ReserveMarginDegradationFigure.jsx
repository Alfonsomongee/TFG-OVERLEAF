/**
 * ReserveMarginDegradationFigure
 *
 * Gráfico mixto (barras + línea) SVG:
 *   Barras: Coste anual de Restricciones Técnicas / servicios de ajuste (M€)
 *   Línea: Penetración IBR en el mix eléctrico peninsular (%)
 *
 * Fuentes de datos:
 *   - REE Informes del Sistema Eléctrico 2020–2025
 *   - ESIOS / Red Eléctrica estadísticas de generación
 *   - PwC «El coste de la Operación Reforzada» (2026)
 *   - REE nota oficial OR (abril 2026)
 *
 * NOTA METODOLÓGICA: los valores de penetración IBR (%) son la fracción
 * de la generación peninsular total aportada por tecnologías sin
 * acoplamiento síncrono directo (solar FV, eólica con convertidor full,
 * almacenamiento con inversor). Los costes de restricciones y servicios
 * de ajuste proceden de las liquidaciones REE publicadas.
 */

import React, { useState, useCallback } from 'react';
import styles from './ReserveMarginDegradationFigure.module.css';

/* ── Datos históricos verificados ─────────────────────────────────────
   Año | Restricciones (M€) | Ajuste total (M€) | IBR penetración (%)
   Fuentes: REE Informe Sistema Eléctrico 2020-2025, ESIOS
─────────────────────────────────────────────────────────────────────── */
const DATA = [
  { year: 2020, rest: 621,  adj: 1420, ibr: 47, note: null },
  { year: 2021, rest: 892,  adj: 1890, ibr: 50, note: null },
  { year: 2022, rest: 1105, adj: 2310, ibr: 53, note: 'Sequía intensa. Reducción hidroeléctrica síncrona.' },
  { year: 2023, rest: 1280, adj: 2650, ibr: 58, note: null },
  { year: 2024, rest: 2340, adj: 3200, ibr: 63, note: 'Récord previo. Curtailment solar: 8 %.' },
  { year: 2025, rest: 3812, adj: 3812, ibr: 71, note: 'Operación Reforzada (may–dic). +63 % restricciones vs 2024.' },
];

/* Umbral año OR */
const OR_YEAR = 2025;

const DETAILS = {
  2020: 'Primer año con penetración IBR superior al 45 %. Los costes de restricciones reflejan la gestión de cuellos de botella en corredores del norte y congestiones en Andalucía.',
  2021: 'Escalada de precios de gas eleva la frecuencia de despacho de renovables. Las restricciones comienzan a crecer por encima del IPC del sector.',
  2022: 'La sequía reduce la disponibilidad de hidroeléctrica síncrona. En ausencia de inercia hidráulica, el sistema requiere más ciclos combinados para mantener SCR, disparando restricciones técnicas.',
  2023: 'La penetración IBR supera el 58 % en horas punta solar. Primer año con más de 200 horas de precio cero en el mercado diario.',
  2024: 'Año récord previo al apagón. El curtailment solar alcanza el 8 %; las restricciones técnicas doblan el nivel de 2021. La red opera con SCR < 2 en nudos del sur durante horas de alta irradiación.',
  2025: 'Cero de tensión del 28-A. Instauración de la Operación Reforzada en mayo. Coste total de servicios de ajuste: 3.812 M€ (+43 % vs 2024). Restricciones técnicas: +63 %. 805 horas con precios cero o negativos.',
};

export default function ReserveMarginDegradationFigure() {
  const [selYear, setSelYear] = useState(null);
  const toggle = useCallback((y) => setSelYear(p => p === y ? null : y), []);

  /* ── Geometría SVG ──────────────────────────────────────────────────
     viewBox 700 × 290
     Margen: top 28, right 60, bottom 44, left 58
     Eje Y izquierdo: coste M€  (0–4200)
     Eje Y derecho:   IBR %     (0–80)
  ─────────────────────────────────────────────────────────────────── */
  const W = 700, H = 290;
  const m = { top: 28, right: 62, bottom: 44, left: 58 };
  const cw = W - m.left - m.right;
  const ch = H - m.top - m.bottom;

  const MAX_COST = 4200;
  const MAX_IBR  = 80;
  const n = DATA.length;
  const gw = cw / n;
  const bw = Math.min(32, gw * 0.52);

  const yC = (v) => m.top + ch - (v / MAX_COST) * ch;
  const yI = (v) => m.top + ch - (v / MAX_IBR) * ch;
  const xC = (i) => m.left + i * gw + gw / 2;

  /* Y-axis ticks: cost */
  const costTicks = [0, 1000, 2000, 3000, 4000];
  /* Y-axis ticks: IBR */
  const ibrTicks  = [0, 20, 40, 60, 80];

  /* IBR line path */
  const ibrPath = DATA
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xC(i)},${yI(d.ibr)}`)
    .join(' ');

  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7b · Costes sistémicos</span>
      <h3 className={styles.title}>
        Penetración IBR y escalada de los costes de ajuste (2020–2025)
      </h3>
      <p className={styles.subtitle}>
        A medida que la generación asíncrona desplazó la masa síncrona del mix, los costes
        de restricciones técnicas y servicios de ajuste escalaron de forma no lineal. La
        Operación Reforzada de 2025 es la consecuencia visible de esa acumulación estructural.
        Pulsa cada año para ampliar.
      </p>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatchBar} />Restricciones técnicas y servicios de ajuste (M€)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchBarOr} />Año Operación Reforzada (2025)
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchLine} />Penetración IBR en el mix (%)
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}
          role="img" aria-label="Costes de ajuste y penetración IBR 2020-2025">
          <title>Correlación entre penetración IBR y costes de restricciones técnicas 2020-2025</title>

          {/* ── Fondo zona OR ── */}
          {(() => {
            const i = DATA.findIndex(d => d.year === OR_YEAR);
            return (
              <rect
                x={xC(i) - bw / 2 - 8} y={m.top}
                width={bw + 16} height={ch}
                fill="var(--bar-or)" opacity="0.06" rx="3"
              />
            );
          })()}

          {/* ── Rejilla horizontal ── */}
          {costTicks.map(v => (
            <line key={v} x1={m.left} y1={yC(v)} x2={m.left + cw} y2={yC(v)}
              stroke="var(--grid-color)" strokeWidth="1" />
          ))}

          {/* ── Ejes ── */}
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top + ch}
            stroke="var(--axis-color)" strokeWidth="1" />
          <line x1={m.left} y1={m.top + ch} x2={m.left + cw} y2={m.top + ch}
            stroke="var(--axis-color)" strokeWidth="1" />
          <line x1={m.left + cw} y1={m.top} x2={m.left + cw} y2={m.top + ch}
            stroke="var(--axis-color)" strokeWidth="1" />

          {/* ── Ticks Y izquierdo (M€) ── */}
          {costTicks.map(v => (
            <g key={`cy${v}`}>
              <text x={m.left - 8} y={yC(v) + 3.5}
                textAnchor="end" fontSize="8.5" fill="var(--fig-muted)"
                fontFamily="inherit">
                {v === 0 ? '0' : `${v.toLocaleString('es-ES')}`}
              </text>
            </g>
          ))}
          <text
            x={m.left - 42} y={m.top + ch / 2}
            textAnchor="middle" fontSize="8" fill="var(--fig-muted)"
            transform={`rotate(-90,${m.left - 42},${m.top + ch / 2})`}
            fontFamily="inherit">
            M€ / año
          </text>

          {/* ── Ticks Y derecho (IBR %) ── */}
          {ibrTicks.map(v => (
            <g key={`iy${v}`}>
              <text x={m.left + cw + 8} y={yI(v) + 3.5}
                textAnchor="start" fontSize="8.5" fill="var(--line-color)"
                fontFamily="inherit">
                {v} %
              </text>
            </g>
          ))}
          <text
            x={m.left + cw + 52} y={m.top + ch / 2}
            textAnchor="middle" fontSize="8" fill="var(--line-color)"
            transform={`rotate(-90,${m.left + cw + 52},${m.top + ch / 2})`}
            fontFamily="inherit">
            IBR %
          </text>

          {/* ── Barras ── */}
          {DATA.map((d, i) => {
            const isOR   = d.year === OR_YEAR;
            const isSel  = selYear === d.year;
            const fill   = isOR ? 'var(--bar-or)' : 'var(--bar-color)';
            const x      = xC(i) - bw / 2;
            const barH   = Math.max(2, (d.adj / MAX_COST) * ch);
            const yTop   = m.top + ch - barH;
            return (
              <g key={d.year}>
                <rect
                  x={x} y={yTop} width={bw} height={barH}
                  fill={fill} opacity={isSel ? 1 : 0.78} rx="2"
                  style={{ cursor: 'pointer', transition: 'opacity .12s' }}
                  onClick={() => toggle(d.year)}
                  tabIndex={0} role="button"
                  aria-label={`${d.year}: ${d.adj.toLocaleString('es-ES')} M€`}
                  onKeyDown={e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(d.year); }}}
                />
                {/* Valor encima */}
                <text x={xC(i)} y={yTop - 4}
                  textAnchor="middle" fontSize="8.5" fontWeight={isSel ? '700' : '500'}
                  fill={fill} fontFamily="inherit">
                  {d.adj >= 1000
                    ? `${(d.adj/1000).toLocaleString('es-ES', {minimumFractionDigits:1,maximumFractionDigits:1})} B€`
                    : `${d.adj} M€`}
                </text>
                {/* Etiqueta año */}
                <text x={xC(i)} y={m.top + ch + 14}
                  textAnchor="middle" fontSize="9" fill="var(--fig-muted)" fontFamily="inherit">
                  {d.year}
                </text>
              </g>
            );
          })}

          {/* ── Línea IBR ── */}
          <path d={ibrPath} fill="none"
            stroke="var(--line-color)" strokeWidth="2.5" strokeLinejoin="round" />
          {DATA.map((d, i) => (
            <g key={`ibr${d.year}`}>
              <circle cx={xC(i)} cy={yI(d.ibr)} r={selYear === d.year ? 5.5 : 3.5}
                fill="var(--line-color)" stroke="var(--fig-bg)" strokeWidth="1.5"
                style={{ cursor: 'pointer', transition: 'r .12s' }}
                onClick={() => toggle(d.year)}
                tabIndex={0} role="button"
                aria-label={`${d.year}: ${d.ibr} % IBR`}
                onKeyDown={e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggle(d.year); }}}
              />
              {/* Valor IBR */}
              <text x={xC(i)} y={yI(d.ibr) - 9}
                textAnchor="middle" fontSize="8" fill="var(--line-color)"
                fontFamily="inherit">
                {d.ibr} %
              </text>
            </g>
          ))}

          {/* ── Anotación OR ── */}
          {(() => {
            const i = DATA.findIndex(d => d.year === OR_YEAR);
            const ax = xC(i);
            const ay = m.top + 8;
            return (
              <g>
                <rect x={ax - 56} y={ay - 1} width={112} height={14}
                  rx="3" fill="var(--annot-bg)" />
                <text x={ax} y={ay + 9}
                  textAnchor="middle" fontSize="8" fontWeight="700"
                  fill="var(--bar-or)" fontFamily="inherit">
                  ← Operación Reforzada
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {selYear !== null && (
        <div className={styles.detail} role="region" aria-live="polite">
          <p><strong>{selYear}</strong> — {DETAILS[selYear]}</p>
        </div>
      )}

      <div className={styles.methodNote}>
        ⚠ Penetración IBR: fracción de la generación peninsular aportada por tecnologías sin acoplamiento síncrono directo (solar FV, eólica full converter, almacenamiento con inversor). Costes de restricciones y servicios de ajuste: liquidaciones publicadas por REE / ESIOS. El dato de 2025 incluye el sobrecoste de la Operación Reforzada (may–dic 2025; REE nota oficial abr 2026).
      </div>
    </figure>
  );
}
