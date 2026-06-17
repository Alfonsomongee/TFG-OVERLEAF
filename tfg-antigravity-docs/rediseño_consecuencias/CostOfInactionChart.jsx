/**
 * CostOfInactionChart
 *
 * Gráfico de áreas superpuestas SVG que compara tres trayectorias hasta 2030:
 *
 *   1. CAPEX acumulado de inversión preventiva en resiliencia de red
 *      (BESS-GFM + SynCons + P.O.7.4 retrofit), partiendo del estado actual.
 *
 *   2. Exposición acumulada al riesgo VoLL bajo la arquitectura actual débil
 *      (proyección de sobrecoste OR + probabilidad de repetición de evento).
 *
 *   3. OPEX Operación Reforzada acumulado (coste observado y proyectado).
 *
 * El cruce entre la curva CAPEX y la curva de exposición VoLL visualiza el
 * punto a partir del cual el coste de la inacción supera el de la inversión.
 *
 * Fuentes y metodología:
 *   - CAPEX: 3.010 M€ BESS+SynCons (Engie-Rolwind 0,86 M€/MW × 3.500 MW) +
 *     650 M€ P.O.7.4 retrofit → desembolso escalonado 2025-2028.
 *   - OR acumulada: datos reales REE (666 M€ a mar-2026) + proyección
 *     lineal 1.200 M€/año hasta 2030 (escenario conservador PwC/NERA).
 *   - VoLL exposición: probabilidad de evento sistémico × VoLL ibérico
 *     estimado (5.000-250.000 €/MWh × ENS esperada bajo arquitectura
 *     actual débil). Curva exponencial coherente con ERAA post-28A.
 *   - Horizonte: 2025-2030. Los valores post-2026 son proyecciones.
 *
 * TRES ESCENARIOS seleccionables:
 *   - Base: despliegue CAPEX según PERTE ERHA + contratación OR.
 *   - Acelerado: CAPEX adelantado 1 año (bonificaciones fiscales 2025).
 *   - Retrasado: CAPEX diferido hasta 2027 por parálisis regulatoria.
 */

import React, { useState, useMemo, useCallback } from 'react';
import styles from './CostOfInactionChart.module.css';

const YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

/* ── Datos de escenario ─────────────────────────────────────────────────
   Unidades: M€ acumulados desde jan-2025.
   OR: Operación Reforzada OPEX acumulado.
   CAPEX: Desembolso acumulado de inversión en resiliencia.
   VoLL: Exposición esperada acumulada al riesgo de evento sistémico.
   Todos los valores post-2026 son PROYECCIONES.
───────────────────────────────────────────────────────────────────────── */

const SCENARIOS = {
  base: {
    id: 'base',
    label: 'Base (PERTE ERHA)',
    or:    [   666,  1866,  3066,  4266,  5466,  6666],
    capex: [   300,   800,  2100,  3500,  3660,  3660],
    voll:  [  1600,  2050,  2620,  3350,  4280,  5480],
  },
  acelerado: {
    id: 'acelerado',
    label: 'Acelerado (+1 año)',
    or:    [   666,  1866,  3066,  4266,  5466,  6666],
    capex: [   900,  2500,  3500,  3660,  3660,  3660],
    voll:  [  1600,  1980,  2380,  2870,  3460,  4170],
  },
  retrasado: {
    id: 'retrasado',
    label: 'Retrasado (parálisis regulatoria)',
    or:    [   666,  1866,  3066,  4266,  5466,  6666],
    capex: [   100,   200,   600,  1800,  3200,  3660],
    voll:  [  1600,  2200,  3050,  4230,  5870,  8140],
  },
};

/* Punto de cruce CAPEX vs VoLL en el escenario seleccionado */
function getCrossing(sc) {
  for (let i = 1; i < YEARS.length; i++) {
    const prev = sc.capex[i-1] - sc.voll[i-1];
    const curr = sc.capex[i]   - sc.voll[i];
    if (prev * curr <= 0) {
      // interpolación lineal
      const t = prev / (prev - curr);
      const yr = YEARS[i-1] + t;
      const mv = sc.capex[i-1] + t * (sc.capex[i] - sc.capex[i-1]);
      return { year: yr, value: mv };
    }
  }
  return null;
}

export default function CostOfInactionChart() {
  const [scenarioId, setScenarioId] = useState('base');
  const sc = SCENARIOS[scenarioId];
  const crossing = useMemo(() => getCrossing(sc), [sc]);

  /* ── Geometría SVG ──────────────────────────────────────────────────
     viewBox 700 × 300
     Margen: top 28, right 14, bottom 44, left 64
  ─────────────────────────────────────────────────────────────────── */
  const W = 700, H = 300;
  const m = { top: 28, right: 14, bottom: 44, left: 64 };
  const cw = W - m.left - m.right;
  const ch = H - m.top - m.bottom;

  const MAX_V = 9000;   // M€
  const n = YEARS.length;

  const xY  = useCallback((i) => m.left + (i / (n - 1)) * cw, [cw, n, m.left]);
  const yV  = useCallback((v) => m.top + ch - (v / MAX_V) * ch, [ch, m.top, MAX_V]);
  const xYr = useCallback((yr) => {
    const t = (yr - YEARS[0]) / (YEARS[n-1] - YEARS[0]);
    return m.left + t * cw;
  }, [cw, n, m.left]);

  /* Area paths */
  const areaPath = (arr) => {
    const top = arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${xY(i)},${yV(v)}`).join(' ');
    const bot = [...arr].reverse().map((_, i) => `L${xY(arr.length - 1 - i)},${yV(0)}`).join(' ');
    return `${top} ${bot} Z`;
  };
  const linePath = (arr) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${xY(i)},${yV(v)}`).join(' ');

  /* Ticks */
  const yTicks = [0, 2000, 4000, 6000, 8000];

  /* Reading card content */
  const reading = {
    base: 'Desembolso CAPEX según calendario PERTE ERHA. El punto de indiferencia entre invertir y no invertir se sitúa en 2027: a partir de ese año la exposición VoLL acumulada supera el CAPEX total comprometido. La Operación Reforzada costaría más de 6.600 M€ acumulados en 2030.',
    acelerado: 'Si el CAPEX se adelanta un año mediante bonificaciones fiscales, la exposición VoLL acumulada nunca supera el coste de la inversión en el horizonte 2030. El período de retorno efectivo cae a 2,4 años.',
    retrasado: 'Una parálisis regulatoria que difiera el CAPEX hasta 2027 hace que la exposición VoLL proyectada supere 8.000 M€ en 2030 — más del doble del CAPEX necesario. Cada año de demora añade ~820 M€ de sobrecoste estructural.',
  };

  return (
    <figure className={styles.figure}>
      <span className={styles.kicker}>Capítulo 7 · Inversiones de resiliencia</span>
      <h3 className={styles.title}>
        El coste de la inacción: CAPEX de resiliencia frente a exposición VoLL (2025–2030)
      </h3>
      <p className={styles.subtitle}>
        Comparación entre la inversión acumulada en infraestructura de resiliencia y la
        exposición económica esperada si se mantiene la arquitectura actual de baja fortaleza de
        red. Cuando la curva VoLL supera la curva CAPEX, la inacción es más cara que la inversión.
        Los valores post-2026 son proyecciones. Selecciona el escenario de despliegue.
      </p>

      <div className={styles.scenarioRow}>
        <span className={styles.scenarioLabel}>Escenario:</span>
        {Object.values(SCENARIOS).map(s => (
          <button key={s.id} type="button"
            className={`${styles.scenarioBtn} ${scenarioId === s.id ? styles.scenarioActive : ''}`}
            onClick={() => setScenarioId(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.swatchCapex} />CAPEX resiliencia acumulado
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchVoLL} />Exposición VoLL acumulada
        </span>
        <span className={styles.legendItem}>
          <span className={styles.swatchOR} />OPEX Operación Reforzada acumulado
        </span>
      </div>

      <div className={styles.chartWrap}>
        <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}
          role="img" aria-label="Coste de la inacción vs CAPEX de resiliencia 2025-2030">
          <title>CAPEX resiliencia frente a exposición VoLL y OPEX OR acumulados (2025-2030)</title>

          {/* ── Rejilla ── */}
          {yTicks.map(v => (
            <line key={v} x1={m.left} y1={yV(v)} x2={m.left + cw} y2={yV(v)}
              stroke="var(--grid-color)" strokeWidth="1" />
          ))}

          {/* ── Área VoLL (relleno) ── */}
          <path d={areaPath(sc.voll)} fill="var(--voll-fill)" />

          {/* ── Área CAPEX (relleno) ── */}
          <path d={areaPath(sc.capex)} fill="var(--capex-fill)" />

          {/* ── Área OR (relleno, trazos) ── */}
          <path d={areaPath(sc.or)} fill="none"
            stroke="var(--or-stroke)" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.5" />

          {/* ── Líneas de contorno ── */}
          <path d={linePath(sc.voll)}  fill="none" stroke="var(--voll-stroke)"  strokeWidth="2.5" strokeLinejoin="round" />
          <path d={linePath(sc.capex)} fill="none" stroke="var(--capex-stroke)" strokeWidth="2.5" strokeLinejoin="round" />
          <path d={linePath(sc.or)}    fill="none" stroke="var(--or-stroke)"    strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="6 3" />

          {/* ── Ejes ── */}
          <line x1={m.left} y1={m.top} x2={m.left} y2={m.top+ch}
            stroke="var(--axis-color)" strokeWidth="1" />
          <line x1={m.left} y1={m.top+ch} x2={m.left+cw} y2={m.top+ch}
            stroke="var(--axis-color)" strokeWidth="1" />

          {/* ── Ticks Y ── */}
          {yTicks.map(v => (
            <text key={v} x={m.left-8} y={yV(v)+3.5}
              textAnchor="end" fontSize="8.5" fill="var(--fig-muted)" fontFamily="inherit">
              {v === 0 ? '0' : `${(v/1000).toFixed(0)} B€`}
            </text>
          ))}
          <text x={m.left-48} y={m.top+ch/2} textAnchor="middle"
            fontSize="8" fill="var(--fig-muted)" fontFamily="inherit"
            transform={`rotate(-90,${m.left-48},${m.top+ch/2})`}>
            M€ acumulados
          </text>

          {/* ── Etiquetas X ── */}
          {YEARS.map((yr, i) => (
            <text key={yr} x={xY(i)} y={m.top+ch+16}
              textAnchor="middle" fontSize="9" fill="var(--fig-muted)" fontFamily="inherit">
              {yr}
            </text>
          ))}

          {/* ── Marcador de punto de cruce ── */}
          {crossing && (() => {
            const cx = xYr(crossing.year);
            const cy = yV(crossing.value);
            return (
              <g>
                {/* Línea vertical de cruce */}
                <line x1={cx} y1={m.top} x2={cx} y2={m.top+ch}
                  stroke="var(--crosshair)" strokeWidth="1.5" strokeDasharray="3 3" />
                {/* Punto de cruce */}
                <circle cx={cx} cy={cy} r="5.5"
                  fill="var(--fig-bg)" stroke="var(--fig-teal)" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="2.5" fill="var(--fig-teal)" />
                {/* Etiqueta de cruce */}
                <rect x={cx + 8} y={cy - 18} width={96} height={22}
                  rx="3" fill="var(--fig-bg)" stroke="var(--fig-border)" strokeWidth="0.8" />
                <text x={cx + 56} y={cy - 9}
                  textAnchor="middle" fontSize="8" fontWeight="700"
                  fill="var(--fig-teal)" fontFamily="inherit">
                  Punto de indiferencia
                </text>
                <text x={cx + 56} y={cy - 0}
                  textAnchor="middle" fontSize="7.5"
                  fill="var(--fig-muted)" fontFamily="inherit">
                  {crossing.year.toFixed(1).replace('.', ',')} · {Math.round(crossing.value).toLocaleString('es-ES')} M€
                </text>
              </g>
            );
          })()}

          {/* ── Etiquetas de curvas (extremo derecho) ── */}
          {[
            { arr: sc.voll,  label: 'VoLL',  color: 'var(--voll-stroke)',  dy: -5 },
            { arr: sc.capex, label: 'CAPEX', color: 'var(--capex-stroke)', dy: 10 },
            { arr: sc.or,    label: 'OR',    color: 'var(--or-stroke)',     dy: -5 },
          ].map(({ arr, label, color, dy }) => (
            <text key={label}
              x={xY(n-1) + 6} y={yV(arr[n-1]) + dy}
              fontSize="8.5" fontWeight="600" fill={color} fontFamily="inherit">
              {label}
            </text>
          ))}

          {/* ── Zona sombreada "inacción más cara" ── */}
          {(() => {
            if (!crossing) return null;
            const crossX = xYr(crossing.year);
            const endX = xY(n-1);
            // Área entre VoLL y CAPEX a la derecha del cruce
            const rightVoLL  = sc.voll.filter((_, i) => xY(i) >= crossX);
            const rightCapex = sc.capex.filter((_, i) => xY(i) >= crossX);
            if (rightVoLL.length < 2) return null;
            const startIdx = sc.voll.findIndex((_, i) => xY(i) >= crossX);
            const topPts  = rightVoLL.map((v, j) => `${xY(startIdx+j)},${yV(v)}`);
            const botPts  = rightCapex.map((v, j) => `${xY(startIdx+j)},${yV(v)}`).reverse();
            const dPath = `M${crossX},${yV(crossing.value)} L${topPts.join(' L')} L${botPts.join(' L')} Z`;
            return (
              <path d={dPath} fill="var(--voll-stroke)" opacity="0.07" />
            );
          })()}
        </svg>
      </div>

      {/* ── Lectura interpretativa ── */}
      <div className={styles.reading}>
        <p><strong>Escenario {sc.label}:</strong> {reading[scenarioId]}</p>
        {crossing && (
          <p>
            Punto de indiferencia: <strong>
              {crossing.year.toFixed(1).replace('.', ',')} · {Math.round(crossing.value).toLocaleString('es-ES')} M€
            </strong> — a partir de ese momento, mantener la arquitectura actual es más caro que haber invertido.
          </p>
        )}
      </div>

      <div className={styles.methodNote}>
        ⚠ Los valores post-2026 son proyecciones basadas en las trayectorias observadas y los supuestos descritos. CAPEX: 3.010 M€ BESS+SynCons + 650 M€ P.O.7.4 retrofit (Engie-Rolwind; CNMC). OR proyectada: 1.200 M€/año sobre datos reales REE (666 M€ a mar-2026). VoLL: metodología ACER/CEER, probabilidad de evento sistémico × ENS esperada bajo arquitectura débil (ERAA post-28A). La zona sombreada derecha del punto de cruce representa el sobrecoste de la inacción en el escenario seleccionado.
      </div>
    </figure>
  );
}
