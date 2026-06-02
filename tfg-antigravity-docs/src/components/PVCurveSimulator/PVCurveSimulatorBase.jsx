/**
 * PVCurveSimulator/index.jsx
 * Simulador interactivo de la curva P-V (nariz) para el apagón ibérico del 28-A.
 *
 * CAMBIOS respecto a la versión anterior:
 *   1. Usa `opV` devuelto directamente por computePVCurve (no recalcular en el componente).
 *   2. Añade <Legend /> para que las dos ramas sean identificables sin hover.
 *   3. aria-valuetext en todos los sliders con unidades físicas.
 *   4. Etiqueta del nose point visible directamente en el gráfico.
 *   5. El preset 28-A carga SCR=1.8 / cosPhi=0.95 / P_op=0.91 → margen negativo (rojo).
 */
import React, { useState, useEffect } from 'react';
import { useDocLang } from '@site/src/hooks/useDocLang';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  ReferenceArea,
  CartesianGrid,
  Label,
} from 'recharts';
import { computePVCurve } from './utils/computePVCurve';
import styles from './styles.module.css';

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className={styles.tooltipCustom}>
      <p className={styles.tooltipLabel}>{payload[0].payload.isEs ? 'Curva P-V' : 'P-V Curve'}</p>
      <p>P: <span className={styles.tooltipValue}>{d.P} p.u.</span></p>
      <p>V: <span className={styles.tooltipValue}>{d.V} p.u.</span></p>
    </div>
  );
}

// ─── Etiqueta personalizada para el nose point ────────────────────────────────
function NoseLabel({ viewBox, noseP, noseV }) {
  if (!viewBox) return null;
  const { x, y } = viewBox;
  const alignLeft = noseP > 1.5;
  return (
    <g>
      <text x={alignLeft ? x - 10 : x + 8} y={y - 10} fill="#ef4444" fontSize={11} fontFamily="monospace" textAnchor={alignLeft ? 'end' : 'start'}>
        Nose point ({noseP.toFixed(2)}, {noseV.toFixed(3)})
      </text>
    </g>
  );
}

export default function PVCurveSimulator() {
  const lang = useDocLang();
  const isEs = lang === 'es';

  const [isMounted, setIsMounted] = useState(false);
  const [SCR,     setSCR]     = useState(3.0);
  const [cosPhi,  setCosPhi]  = useState(0.95);
  const [P_op,    setPop]     = useState(0.82);

  useEffect(() => { setIsMounted(true); }, []);

  const { upper: _upper, lower: _lower, opV, margin, noseP, noseV } = computePVCurve({
    E: 1.0, X_base: 0.5, R_base: 0.05,
    cosPhi, SCR, P_op, step: 0.002,
  });

  // ── Construir curvas superiores/inferiores para tooltip (añadiendo isEs)
  const upper = React.useMemo(() => _upper.map(d => ({ ...d, isEs })), [_upper, isEs]);
  const lower = React.useMemo(() => _lower.map(d => ({ ...d, isEs })), [_lower, isEs]);

  const isCollapsed = P_op > noseP;
  let marginLabel, marginColor;
  if (isCollapsed || margin <= 0) {
    marginLabel = isEs ? '💥 COLAPSO DE TENSIÓN — Sistema sin solución estable' : '💥 VOLTAGE COLLAPSE — System without stable solution';
    marginColor = 'red';
  } else if (margin <= 0.1) {
    marginLabel = isEs ? '🛑 RIESGO CRÍTICO — Margen insuficiente' : '🛑 CRITICAL RISK — Insufficient margin';
    marginColor = 'red';
  } else if (margin <= 0.3) {
    marginLabel = isEs ? '⚠️ ALERTA — Margen reducido' : '⚠️ WARNING — Reduced margin';
    marginColor = 'amber';
  } else {
    marginLabel = isEs ? '✅ SISTEMA ESTABLE — Operación segura' : '✅ STABLE SYSTEM — Safe operation';
    marginColor = 'green';
  }

  // ── Preset 28-A Zona Sur ──────────────────────────────────────────────────
  const handlePreset28A = () => {
    setSCR(1.8);
    setCosPhi(0.95);
    setPop(0.91);
    // Con estos valores, noseP ≈ 0.87–0.89 < P_op = 0.91 → margen negativo
  };

  const handlePresetNormal = () => {
    setSCR(3.0);
    setCosPhi(0.95);
    setPop(0.70);
  };

  // ── Nombre de clases para el margen semafórico ────────────────────────────
  const cardClass = [
    styles.metricCard,
    marginColor === 'red'   ? styles.red   :
    marginColor === 'amber' ? styles.amber :
                              styles.green,
  ].join(' ');

  return (
    <div className={styles.wrapper}>

      {/* ── GRÁFICO ──────────────────────────────────────────────────────── */}
      <div className={styles.chartContainer}>
        {isMounted ? (
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart margin={{ top: 24, right: 120, left: 16, bottom: 32 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />

              <XAxis
                type="number"
                dataKey="P"
                domain={[0, Math.max(1.8, noseP + 0.3)]}
                allowDataOverflow
                stroke='var(--text-1, #64748b)'
                tick={{ fill: 'var(--text-1, #64748b)', fontSize: 11 }}
              >
                <Label value={isEs ? 'Potencia activa P (p.u.)' : 'Active power P (p.u.)'} position="bottom" offset={16}
                       fill="#94a3b8" fontSize={12} />
              </XAxis>

              <YAxis
                type="number"
                domain={[0, 1.2]}
                stroke='var(--text-1, #64748b)'
                tick={{ fill: 'var(--text-1, #64748b)', fontSize: 11 }}
              >
                <Label value={isEs ? 'Tensión V (p.u.)' : 'Voltage V (p.u.)'} angle={-90} position="insideLeft"
                       offset={8} fill="#94a3b8" fontSize={12} />
              </YAxis>

              <Tooltip content={<CustomTooltip />} allowEscapeViewBox={{ x: true, y: false }} />

              {/* Leyenda: imprescindible para que el tribunal identifique las ramas */}
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
                formatter={(value) => (
                  <span style={{ color: '#94a3b8' }}>{value}</span>
                )}
              />

              {/* Área de margen al colapso */}
              {!isCollapsed && noseP > P_op && (
                <ReferenceArea
                  x1={P_op} x2={noseP}
                  y1={0}    y2={1.2}
                  fill="rgba(239, 68, 68, 0.10)"
                  stroke="none"
                />
              )}

              {/* Límite operativo V=0.95 p.u. */}
              <ReferenceLine
                y={0.95}
                stroke="rgba(239,68,68,0.45)"
                strokeDasharray="4 4"
                label={{ value: isEs ? 'Mínimo operativo (0.95 p.u.)' : 'Operating minimum (0.95 p.u.)',
                         fill: '#f87171', position: 'insideTopRight', fontSize: 10 }}
              />

              {/* Línea vertical en el punto de operación */}
              {!isCollapsed && (
                <ReferenceLine
                  x={P_op}
                  stroke="rgba(255,255,255,0.18)"
                  strokeDasharray="3 3"
                />
              )}

              {/* Rama estable (superior) */}
              <Line
                data={upper}
                type="monotone"
                dataKey="V"
                stroke="#00d9ff"
                strokeWidth={2.5}
                dot={false}
                activeDot={false}
                name={isEs ? 'Rama estable (operación normal)' : 'Stable branch (normal operation)'}
                legendType="line"
              />

              {/* Rama inestable (inferior) */}
              <Line
                data={lower}
                type="monotone"
                dataKey="V"
                stroke="#ffb000"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={false}
                name={isEs ? 'Rama inestable (post-colapso)' : 'Unstable branch (post-collapse)'}
                legendType="line"
              />

              {/* Nose point con etiqueta */}
              <ReferenceDot
                x={noseP}
                y={noseV}
                r={7}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
                label={<NoseLabel noseP={noseP} noseV={noseV} />}
              />

              {/* Punto de operación actual */}
              {!isCollapsed && (
                <ReferenceDot
                  x={P_op}
                  y={opV}
                  r={5}
                  fill="#ffffff"
                  stroke="#00d9ff"
                  strokeWidth={2}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.loadingPlaceholder}>
            {isEs ? 'Inicializando simulador P-V…' : 'Initializing P-V simulator…'}
          </div>
        )}
      </div>

      {/* ── CONTROLES ─────────────────────────────────────────────────────── */}
      <div className={styles.controls}>

        {/* Métrica semafórica */}
        <div className={cardClass} role="status" aria-live="polite">
          <span className={styles.metricLabel}>{isEs ? 'Margen al Colapso' : 'Margin to Collapse'}</span>
          <span className={styles.metricValue}>
            {isCollapsed ? '−∞' : margin.toFixed(3)} p.u.
          </span>
          <span className={styles.metricStatus}>{marginLabel}</span>
        </div>

        {/* Sliders */}
        <div className={styles.slidersSection}>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Short Circuit Ratio (SCR)</span>
              <span className={styles.sliderValue}>{SCR.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0.5" max="6.0" step="0.1"
              value={SCR}
              onChange={e => setSCR(parseFloat(e.target.value))}
              className={styles.rangeInput}
              aria-label="Short Circuit Ratio SCR"
              aria-valuetext={`SCR ${SCR.toFixed(1)} — ${SCR < 2 ? 'red débil, alta vulnerabilidad' : SCR < 3 ? 'red marginal' : 'red robusta'}`}
              aria-valuemin={0.5} aria-valuemax={6.0} aria-valuenow={SCR}
            />
            <div className={styles.sliderHint}>
              {SCR < 2
                ? (isEs ? '⚠ Red débil — alta vulnerabilidad de tensión (condición 28-A)' : '⚠ Weak grid — high voltage vulnerability (28-A condition)')
                : SCR < 3
                  ? (isEs ? '— Red marginal' : '— Marginal grid')
                  : (isEs ? '✓ Red robusta' : '✓ Strong grid')}
            </div>
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>{isEs ? 'Factor de Potencia (cos φ)' : 'Power Factor (cos φ)'}</span>
              <span className={styles.sliderValue}>{cosPhi.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0.80" max="1.00" step="0.01"
              value={cosPhi}
              onChange={e => setCosPhi(parseFloat(e.target.value))}
              className={styles.rangeInput}
              aria-label="Factor de potencia cos phi"
              aria-valuetext={`cos φ = ${cosPhi.toFixed(2)} — demanda reactiva ${cosPhi < 0.90 ? 'alta' : 'normal'}`}
              aria-valuemin={0.80} aria-valuemax={1.00} aria-valuenow={cosPhi}
            />
          </div>

          <div className={styles.sliderRow}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>{isEs ? 'Carga Activa P_op' : 'Active Load P_op'}</span>
              <span className={styles.sliderValue}>{P_op.toFixed(2)} p.u.</span>
            </div>
            <input
              type="range" min="0.0" max="1.20" step="0.02"
              value={P_op}
              onChange={e => setPop(parseFloat(e.target.value))}
              className={styles.rangeInput}
              aria-label="Carga activa del sistema en por unidad"
              aria-valuetext={`P_op = ${P_op.toFixed(2)} p.u. — ${isCollapsed ? 'supera el nose point: colapso' : `margen ${margin.toFixed(3)} p.u.`}`}
              aria-valuemin={0.0} aria-valuemax={1.20} aria-valuenow={P_op}
            />
          </div>
        </div>

        {/* Presets */}
        <div className={styles.presetsSection}>
          <span className={styles.presetsLabel}>{isEs ? 'Escenarios' : 'Scenarios'}</span>
          <div className={styles.presets}>
            <button
              className={`${styles.presetBtn} ${styles.presetDanger}`}
              onClick={handlePreset28A}
              title="SCR=1.8 · cos φ=0.95 · P_op=0.91 → margen negativo"
            >
              ⚠️ {isEs ? '28-A Zona Sur' : '28-A South Zone'}
            </button>
            <button
              className={styles.presetBtn}
              onClick={handlePresetNormal}
              title="SCR=3.0 · cos φ=0.95 · P_op=0.70 → sistema estable"
            >
              ✅ {isEs ? 'Sistema Normal' : 'Normal System'}
            </button>
          </div>
        </div>

      </div>

      {/* ── EXPLICACIÓN TÉCNICA ───────────────────────────────────────────── */}
      <div className={styles.footer}>
        <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: isEs 
          ? `<b>Mecanismo de colapso de tensión (curva nariz P-V):</b> La rama estable (azul) representa la operación normal del sistema. El <em>nose point</em> (punto rojo) es la máxima cargabilidad: más allá, no existe solución estable para la ecuación de flujo de potencia reactiva. El 28-A, la zona sur peninsular operó con SCR ≈ 1,8 y una carga equivalente al 91% de la capacidad máxima del corredor reactivo, dejando un margen negativo antes del primer disparo.<br/><small style="color:var(--text-1, #64748b)">Modelo: sistema de 2 nudos (Van Cutsem & Vournas, 1998). Parámetros anclados a ENTSO-E Factual Report, Tabla 2-4, p. 36.</small>`
          : `<b>Voltage collapse mechanism (P-V nose curve):</b> The stable branch (blue) represents the normal operation of the system. The <em>nose point</em> (red dot) is the maximum loadability: beyond this, there is no stable solution for the reactive power flow equation. On April 28, the southern peninsular zone operated with an SCR ≈ 1.8 and a load equivalent to 91% of the maximum capacity of the reactive corridor, leaving a negative margin before the first trip.<br/><small style="color:var(--text-1, #64748b)">Model: 2-bus system (Van Cutsem & Vournas, 1998). Parameters anchored to ENTSO-E Factual Report, Table 2-4, p. 36.</small>`
        }} />
      </div>

    </div>
  );
}
