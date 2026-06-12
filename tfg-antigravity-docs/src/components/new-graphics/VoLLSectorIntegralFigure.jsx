import React, { useState, useMemo, useCallback } from 'react';
import styles from './VoLLSectorIntegralFigure.module.css';

export default function VoLLSectorIntegralFigure() {
  const [hoveredSector, setHoveredSector] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const hover = useCallback((el) => setHoveredElement(el), []);
  const unhover = useCallback(() => setHoveredElement(null), []);

  const W = 760, H = 340;

  /* ── Layout: left = ENS area, right = VoLL bars ── */
  const splitX = 460;
  const em = { top: 32, right: 16, bottom: 44, left: 52 };
  const ensW = splitX - em.left - em.right;
  const ensH = H - em.top - em.bottom;

  /* ── ENS curve (conceptual) ── */
  const ensCurve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      let demand;
      if (t < 0.05) demand = 0.05;
      else if (t < 0.12) demand = 0.05 + (t - 0.05) * 12; // sharp rise
      else if (t < 0.55) demand = 0.89 - (t - 0.12) * 0.3; // plateau with slight decline
      else demand = Math.max(0.02, 0.89 - 0.3 * 0.43 - (t - 0.55) * 1.1); // recovery drop
      pts.push({ t, d: Math.max(0.02, demand) });
    }
    return pts;
  }, []);

  const xE = (v) => em.left + v * ensW;
  const yE = (v) => em.top + ensH - v * ensH;

  const ensPath = ensCurve.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xE(d.t).toFixed(1)},${yE(d.d).toFixed(1)}`
  ).join(' ');

  const ensAreaPath = ensPath + ` L${xE(1)},${yE(0)} L${xE(0)},${yE(0)} Z`;

  /* ── VoLL sectors ── */
  const sectors = [
    { key: 'residential', label: 'residencial', voll: 0.35, color: 'var(--fig-pistachio)' },
    { key: 'services', label: 'servicios', voll: 0.55, color: 'var(--fig-teal)' },
    { key: 'industry', label: 'industria', voll: 0.75, color: 'var(--fig-amber)' },
    { key: 'electrointensive', label: 'electrointensivo', voll: 1.0, color: 'var(--fig-burgundy)' },
  ];

  const barArea = { x: splitX + 30, y: em.top + 20, w: W - splitX - 60, h: ensH - 30 };
  const barH = (barArea.h - (sectors.length - 1) * 14) / sectors.length;

  const sectorInfo = {
    residential: 'El sector residencial tiene un VoLL relativo menor, pero afecta al mayor número de personas.',
    services: 'Servicios (comercio, sanidad, telecomunicaciones) tiene un VoLL intermedio con impacto operativo significativo.',
    industry: 'La industria tiene un VoLL alto por procesos continuos que no pueden interrumpirse sin pérdidas materiales.',
    electrointensive: 'El sector electrointensivo tiene el mayor VoLL por unidad de ENS: cada MWh perdido genera un daño económico desproporcionado.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Economía del apagón · VoLL</p>
        <h3 className={styles.title}>De energía no suministrada a daño económico</h3>
        <p className={styles.subtitle}>
          El coste total combina la duración del corte, la demanda no servida y el valor económico de la carga perdida por sector.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>Daño total = ∫ ENS(t) · VoLL<sub>sector</sub>(t) dt</span>
        <span className={styles.eqSep}>≈</span>
        <span className={styles.eq}>Σ ENS<sub>sector</sub> · VoLL<sub>sector</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="voll-title voll-desc"
        >
          <title id="voll-title">Conversión de energía no suministrada en daño económico mediante VoLL sectorial</title>
          <desc id="voll-desc">
            A la izquierda, área temporal de ENS mostrando demanda no servida durante un apagón con caída brusca y recuperación progresiva.
            A la derecha, barras horizontales de VoLL relativo por sector: residencial, servicios, industria y electrointensivo.
          </desc>

          {/* ═══ LEFT: ENS area chart ═══ */}
          <path d={ensAreaPath} className={styles.ensArea}
            onMouseEnter={() => hover('ens')}
            onMouseLeave={unhover}
          />
          <path d={ensPath} className={styles.ensCurve} />

          {/* ── Integration annotation ── */}
          <text x={xE(0.35)} y={yE(0.38)} className={styles.integralLabel} textAnchor="middle">
            ∫ ENS(t) dt
          </text>

          {/* ── Axes ── */}
          <line x1={em.left} y1={em.top} x2={em.left} y2={em.top + ensH} className={styles.axis} />
          <line x1={em.left} y1={em.top + ensH} x2={em.left + ensW} y2={em.top + ensH} className={styles.axis} />

          <text x={em.left + ensW / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">tiempo</text>
          <text x={14} y={em.top + ensH / 2} className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 14, ${em.top + ensH / 2})`}>
            demanda no servida
          </text>

          {/* ── X ticks ── */}
          {['inicio', 'pico', 'recuperación'].map((l, i) => (
            <text key={l} x={xE([0.08, 0.35, 0.75][i])} y={em.top + ensH + 18} className={styles.tickLabel} textAnchor="middle">{l}</text>
          ))}

          {/* ═══ DIVIDER ═══ */}
          <line x1={splitX} y1="24" x2={splitX} y2={H - 16} className={styles.divider} />

          {/* ═══ RIGHT: VoLL bars ═══ */}
          <text x={barArea.x} y={barArea.y - 6} className={styles.vollTitle}>VoLL relativo</text>

          {sectors.map((s, i) => {
            const by = barArea.y + i * (barH + 14);
            const bw = s.voll * barArea.w;
            const isActive = hoveredSector === s.key;
            return (
              <g key={s.key}
                onMouseEnter={() => setHoveredSector(s.key)}
                onMouseLeave={() => setHoveredSector(null)}
                onFocus={() => setHoveredSector(s.key)}
                onBlur={() => setHoveredSector(null)}
                tabIndex={0}
                role="button"
                aria-label={`${s.label}: VoLL relativo ${(s.voll * 100).toFixed(0)}%`}
                className={styles.barGroup}
              >
                <text x={barArea.x} y={by + barH / 2 + 4} className={styles.barLabel}>{s.label}</text>
                <rect
                  x={barArea.x + 90} y={by}
                  width={bw - 90} height={barH}
                  rx="3"
                  fill={s.color}
                  opacity={isActive ? 0.95 : 0.65}
                  className={styles.barRect}
                />
                {isActive && (
                  <rect
                    x={barArea.x + 90} y={by}
                    width={bw - 90} height={barH}
                    rx="3"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}

          {/* ── Arrow from ENS to VoLL ── */}
          <line x1={splitX + 6} y1={em.top + ensH / 2} x2={splitX + 22} y2={em.top + ensH / 2}
            className={styles.connectArrow} />
          <polygon
            points={`${splitX + 22},${em.top + ensH / 2 - 4} ${splitX + 28},${em.top + ensH / 2} ${splitX + 22},${em.top + ensH / 2 + 4}`}
            fill="var(--fig-muted)"
            opacity="0.5"
          />

          {/* ── Result label ── */}
          <text x={barArea.x + barArea.w / 2 + 45} y={barArea.y + sectors.length * (barH + 14) + 8}
            className={styles.resultLabel} textAnchor="middle">
            → daño total ponderado
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${(hoveredSector || hoveredElement === 'ens') ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{hoveredSector ? sectorInfo[hoveredSector] : (hoveredElement === 'ens' ? 'El área sombreada representa la energía no suministrada acumulada durante el apagón. Su integral en el tiempo determina la magnitud base del daño.' : '\u00A0')}</p>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}><i className={styles.dotEns} /> ENS temporal</span>
        <span className={styles.legendItem}><i className={styles.dotVoll} /> VoLL sectorial</span>
        <span className={styles.legendItem}>Σ daño total</span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> La ENS mide la energía no servida; el VoLL traduce esa energía en pérdida económica sectorial, por eso una misma interrupción puede tener impactos muy distintos según la carga afectada.
      </div>
    </figure>
  );
}
