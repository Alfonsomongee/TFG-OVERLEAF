import React, { useState, useMemo, useCallback } from 'react';
import styles from './HvdcControlModeResponseFigure.module.css';

export default function HvdcControlModeResponseFigure() {
  const [activeMode, setActiveMode] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);
  const activate = useCallback((m) => setActiveMode(m), []);
  const deactivate = useCallback(() => setActiveMode(null), []);

  const W = 760, H = 320;

  /* ── Layout split: left = HVDC diagram, right = temporal chart ── */
  const splitX = 310;

  /* ── Temporal chart margins ── */
  const cm = { top: 38, right: 20, bottom: 44, left: 46 };
  const chartW = W - splitX - cm.left - cm.right;
  const chartH = H - cm.top - cm.bottom;
  const chartOriginX = splitX + cm.left;
  const chartOriginY = cm.top;

  /* ── Power curves ── */
  const curves = useMemo(() => {
    const pmode1 = [], pmode3 = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160;
      // PMODE1: almost flat, tiny transient
      const p1 = t < 0.2 ? 0.7 : 0.7 + 0.015 * Math.sin((t - 0.2) * 12) * Math.exp(-(t - 0.2) * 8);
      // PMODE3: responds to frequency, ramps up
      let p3 = 0.7;
      if (t >= 0.2) {
        const tp = t - 0.2;
        p3 = 0.7 + 0.22 * (1 - Math.exp(-tp / 0.12)) - 0.03 * Math.sin(tp * 15) * Math.exp(-tp / 0.15);
      }
      pmode1.push({ t, p: p1 });
      pmode3.push({ t, p: p3 });
    }
    return { pmode1, pmode3 };
  }, []);

  const pMin = 0.5, pMax = 1.0;
  const xC = (v) => chartOriginX + v * chartW;
  const yC = (v) => chartOriginY + chartH - ((v - pMin) / (pMax - pMin)) * chartH;

  const curvePath = (data) =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xC(d.t).toFixed(1)},${yC(d.p).toFixed(1)}`).join(' ');

  const pertX = xC(0.2);
  const yP0 = yC(0.7);

  const isHighlighted = (mode) => activeMode === null || activeMode === mode;

  const modeInfo = {
    pmode1: 'PMODE1 — Potencia fija: el HVDC mantiene consigna casi constante independientemente de la frecuencia. No aporta soporte dinámico al sistema receptor.',
    pmode3: 'PMODE3 — Sensible a frecuencia: el HVDC modifica la potencia intercambiada ante desviaciones de frecuencia, comportándose como un recurso dinámico del sistema.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Interconexiones · Control HVDC</p>
        <h3 className={styles.title}>Potencia fija frente a soporte dinámico de frecuencia</h3>
        <p className={styles.subtitle}>
          El modo de control determina si el enlace HVDC mantiene consigna o modifica potencia ante una desviación de frecuencia.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>PMODE1 ≈ P constante</span>
        <span className={styles.eqSep}>|</span>
        <span className={styles.eq}>PMODE3: ΔP<sub>HVDC</sub> ∝ −Δf</span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="hvdc-title hvdc-desc"
        >
          <title id="hvdc-title">Comparación de modos de control HVDC: potencia fija frente a respuesta sensible a frecuencia</title>
          <desc id="hvdc-desc">
            A la izquierda, diagrama simplificado de un enlace HVDC VSC entre Francia/CE e Iberia con bloque de control
            que alterna entre PMODE1 y PMODE3. A la derecha, curvas temporales de potencia: PMODE1 casi plana y PMODE3
            con variación dinámica tras una caída de frecuencia en t=0.
          </desc>

          {/* ═══ LEFT: HVDC diagram ═══ */}
          {/* ── AC system bars ── */}
          <rect x="22" y="110" width="60" height="80" rx="6" className={styles.acBar}
            onMouseEnter={() => setHoveredElement('france')}
            onMouseLeave={() => setHoveredElement(null)}
          />
          <text x="52" y="146" className={styles.acLabel} textAnchor="middle">Francia</text>
          <text x="52" y="162" className={styles.acLabelSmall} textAnchor="middle">CE</text>

          <rect x="228" y="110" width="60" height="80" rx="6" className={styles.acBar}
            onMouseEnter={() => setHoveredElement('iberia')}
            onMouseLeave={() => setHoveredElement(null)}
          />
          <text x="258" y="146" className={styles.acLabel} textAnchor="middle">Iberia</text>

          {/* ── VSC converters ── */}
          <rect x="98" y="130" width="30" height="40" rx="3" className={styles.vscBox} />
          <text x="113" y="154" className={styles.vscLabel} textAnchor="middle">VSC</text>

          <rect x="182" y="130" width="30" height="40" rx="3" className={styles.vscBox} />
          <text x="197" y="154" className={styles.vscLabel} textAnchor="middle">VSC</text>

          {/* ── DC link ── */}
          <line x1="128" y1="150" x2="182" y2="150" className={styles.dcLink} />
          <text x="155" y="142" className={styles.dcLabel} textAnchor="middle">DC</text>

          {/* ── AC connections ── */}
          <line x1="82" y1="150" x2="98" y2="150" className={styles.acLine} />
          <line x1="212" y1="150" x2="228" y2="150" className={styles.acLine} />

          {/* ── Control block ── */}
          <rect x="118" y="200" width="74" height="52" rx="6" className={styles.controlBox} />
          <text x="155" y="216" className={styles.controlTitle} textAnchor="middle">modo de control</text>

          <g
            className={`${styles.modeBtn} ${activeMode === 'pmode1' ? styles.modeBtnActive : ''}`}
            onMouseEnter={() => activate('pmode1')}
            onMouseLeave={deactivate}
            onFocus={() => activate('pmode1')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar PMODE1, potencia fija"
          >
            <rect x="122" y="224" width="32" height="18" rx="3" />
            <text x="138" y="236" textAnchor="middle">PM1</text>
          </g>
          <g
            className={`${styles.modeBtn} ${activeMode === 'pmode3' ? styles.modeBtnActive : ''}`}
            onMouseEnter={() => activate('pmode3')}
            onMouseLeave={deactivate}
            onFocus={() => activate('pmode3')}
            onBlur={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Seleccionar PMODE3, sensible a frecuencia"
          >
            <rect x="158" y="224" width="32" height="18" rx="3" />
            <text x="174" y="236" textAnchor="middle">PM3</text>
          </g>

          {/* ── Connection from control to VSC ── */}
          <line x1="155" y1="200" x2="155" y2="170" className={styles.controlLine} />

          {/* ── HVDC label ── */}
          <text x="155" y="105" className={styles.hvdcLabel} textAnchor="middle">HVDC VSC</text>

          {/* ═══ DIVIDER ═══ */}
          <line x1={splitX - 4} y1="30" x2={splitX - 4} y2={H - 10} className={styles.divider} />

          {/* ═══ RIGHT: Temporal chart ═══ */}
          {/* ── P0 reference ── */}
          <line x1={chartOriginX} y1={yP0} x2={chartOriginX + chartW} y2={yP0}
            className={styles.refLine} />
          <text x={chartOriginX + chartW + 4} y={yP0 + 3} className={styles.refLabel}>P₀</text>

          {/* ── Perturbation ── */}
          <line x1={pertX} y1={chartOriginY} x2={pertX} y2={chartOriginY + chartH}
            className={styles.pertLine} />
          <text x={pertX + 4} y={chartOriginY + 12} className={styles.pertLabel}>caída de f</text>

          {/* ── PMODE1 curve ── */}
          <path
            d={curvePath(curves.pmode1)}
            className={`${styles.curvePm1} ${isHighlighted('pmode1') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('pmode1')}
            onMouseLeave={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Curva PMODE1"
          />

          {/* ── PMODE3 curve ── */}
          <path
            d={curvePath(curves.pmode3)}
            className={`${styles.curvePm3} ${isHighlighted('pmode3') ? '' : styles.curveDimmed}`}
            onMouseEnter={() => activate('pmode3')}
            onMouseLeave={deactivate}
            tabIndex={0}
            role="button"
            aria-label="Curva PMODE3"
          />

          {/* ── Dynamic response annotation ── */}
          {isHighlighted('pmode3') && (
            <text x={xC(0.65)} y={yC(0.88) - 10} className={styles.dynAnnotation}>
              respuesta dinámica
            </text>
          )}

          {/* ── Chart axes ── */}
          <line x1={chartOriginX} y1={chartOriginY} x2={chartOriginX} y2={chartOriginY + chartH} className={styles.axis} />
          <line x1={chartOriginX} y1={chartOriginY + chartH} x2={chartOriginX + chartW} y2={chartOriginY + chartH} className={styles.axis} />

          {/* ── Axis labels ── */}
          <text x={chartOriginX + chartW / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">tiempo</text>
          <text
            x={splitX + 14} y={chartOriginY + chartH / 2}
            className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, ${splitX + 14}, ${chartOriginY + chartH / 2})`}
          >
            P_HVDC
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${activeMode ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{activeMode ? modeInfo[activeMode] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        <span
          className={`${styles.legendItem} ${activeMode === 'pmode1' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('pmode1')}
          onMouseLeave={deactivate}
          tabIndex={0} role="button"
        >
          <i className={styles.dotPm1} /> PMODE1 · potencia fija
        </span>
        <span
          className={`${styles.legendItem} ${activeMode === 'pmode3' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => activate('pmode3')}
          onMouseLeave={deactivate}
          tabIndex={0} role="button"
        >
          <i className={styles.dotPm3} /> PMODE3 · sensible a frecuencia
        </span>
        <span className={styles.legendItem}>
          <i className={styles.dotPert} /> caída de frecuencia
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> En una perturbación rápida, el HVDC puede comportarse como una consigna casi pasiva o como un recurso dinámico: la diferencia está en el modo de control, no en el cable.
      </div>
    </figure>
  );
}