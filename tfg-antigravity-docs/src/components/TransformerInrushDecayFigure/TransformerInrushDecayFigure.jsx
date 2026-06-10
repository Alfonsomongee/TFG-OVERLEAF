import React, { useState, useMemo, useCallback } from 'react';
import styles from './TransformerInrushDecayFigure.module.css';

export default function TransformerInrushDecayFigure() {
  const [hoveredElement, setHoveredElement] = useState(null);
  const hover = useCallback((el) => setHoveredElement(el), []);
  const unhover = useCallback(() => setHoveredElement(null), []);

  const margin = { top: 28, right: 24, bottom: 48, left: 56 };
  const W = 760, H = 340;
  const pw = W - margin.left - margin.right;
  const ph = H - margin.top - margin.bottom;

  /* ── Generate inrush current waveform ── */
  const waveform = useMemo(() => {
    const pts = [];
    const cycles = 14;
    const samples = 600;
    const peakPU = 9.5;
    const tau = 3.2; // decay time constant in cycles
    const phi = -0.15; // phase offset for asymmetry

    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * cycles;
      const envelope = peakPU * Math.exp(-t / tau);
      const dcOffset = peakPU * 0.45 * Math.exp(-t / (tau * 0.7));
      const sine = Math.sin(2 * Math.PI * t + phi);
      let current = envelope * sine + dcOffset * Math.exp(-t / (tau * 0.5));
      // Clip negative values softly for first 2 cycles (asymmetric inrush)
      if (t < 2 && current < -1) {
        current = -1 + (current + 1) * 0.3;
      }
      pts.push({ t: t / cycles, i: current });
    }
    return pts;
  }, []);

  /* ── Envelope curve ── */
  const envelope = useMemo(() => {
    const pts = [];
    const cycles = 14;
    const peakPU = 9.5;
    const tau = 3.2;
    for (let i = 0; i <= 120; i++) {
      const t = (i / 120) * cycles;
      const env = peakPU * Math.exp(-t / tau) + peakPU * 0.45 * Math.exp(-t / (tau * 0.5));
      pts.push({ t: t / cycles, env });
    }
    return pts;
  }, []);

  const yMin = -3, yMax = 11;
  const xS = (v) => margin.left + v * pw;
  const yS = (v) => margin.top + ph - ((v - yMin) / (yMax - yMin)) * ph;

  const wavePath = waveform
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.t).toFixed(1)},${yS(d.i).toFixed(1)}`)
    .join(' ');

  const envPath = envelope
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xS(d.t).toFixed(1)},${yS(d.env).toFixed(1)}`)
    .join(' ');

  /* ── Reference lines ── */
  const y1pu = yS(1);
  const y0 = yS(0);

  /* ── Peak zone highlight ── */
  const peakZoneWidth = xS(0.15) - margin.left;

  const tooltips = {
    peak: 'El primer pico alcanza 8–10 pu. En una isla débil, esta corriente puede provocar caídas de tensión e interferir con protecciones.',
    envelope: 'La envolvente exponencial refleja la componente DC y la saturación del núcleo, que decrecen conforme el flujo magnético se estabiliza.',
    nominal: 'Corriente nominal de operación: referencia para evaluar la magnitud relativa del inrush.',
  };

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Reposición · Transitorios electromagnéticos</p>
        <h3 className={styles.title}>Corriente de inserción durante energización de transformadores</h3>
        <p className={styles.subtitle}>
          El inrush magnetizante combina pico inicial, offset asimétrico y decaimiento lento, especialmente crítico en islas eléctricas débiles.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>
          i(t) = (V<sub>max</sub>/Z) · [sin(ωt − φ) − e<sup>−Rt/L</sup> · sin(−φ)]
        </span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-labelledby="inrush-title inrush-desc"
        >
          <title id="inrush-title">Corriente de inserción magnetizante durante la energización de un transformador</title>
          <desc id="inrush-desc">
            Oscilograma de corriente transitoria con un primer pico de 8 a 10 pu,
            oscilación asimétrica amortiguada, envolvente de decaimiento exponencial
            y línea de referencia nominal a 1 pu. Relevante para islas eléctricas débiles.
          </desc>

          {/* ── Peak zone highlight ── */}
          <rect
            x={margin.left} y={margin.top}
            width={peakZoneWidth} height={ph}
            className={`${styles.peakZone} ${hoveredElement === 'peak' ? styles.peakZoneActive : ''}`}
            onMouseEnter={() => hover('peak')}
            onMouseLeave={unhover}
            onFocus={() => hover('peak')}
            onBlur={unhover}
            tabIndex={0}
            role="button"
            aria-label="Zona del primer pico de corriente, 8 a 10 pu"
          />

          {/* ── Grid lines ── */}
          <line x1={margin.left} y1={y0} x2={margin.left + pw} y2={y0} className={styles.gridLine} />

          {/* ── Nominal reference ── */}
          <line
            x1={margin.left} y1={y1pu}
            x2={margin.left + pw} y2={y1pu}
            className={`${styles.nominalLine} ${hoveredElement === 'nominal' ? styles.nominalLineActive : ''}`}
            onMouseEnter={() => hover('nominal')}
            onMouseLeave={unhover}
            onFocus={() => hover('nominal')}
            onBlur={unhover}
            tabIndex={0}
            role="button"
            aria-label="Línea de corriente nominal 1 pu"
          />
          <text x={margin.left + pw - 4} y={y1pu - 6} className={styles.nominalLabel} textAnchor="end">
            corriente nominal · 1 pu
          </text>

          {/* ── Envelope ── */}
          <path
            d={envPath}
            className={`${styles.envCurve} ${hoveredElement === 'envelope' ? styles.envCurveActive : ''}`}
            onMouseEnter={() => hover('envelope')}
            onMouseLeave={unhover}
            onFocus={() => hover('envelope')}
            onBlur={unhover}
            tabIndex={0}
            role="button"
            aria-label="Envolvente de decaimiento exponencial"
          />

          {/* ── Main waveform ── */}
          <path d={wavePath} className={styles.mainCurve} />

          {/* ── Axes ── */}
          <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + ph} className={styles.axis} />
          <line x1={margin.left} y1={margin.top + ph} x2={margin.left + pw} y2={margin.top + ph} className={styles.axis} />

          {/* ── Y ticks ── */}
          {[1, 5, 10].map((v) => (
            <g key={v}>
              <line x1={margin.left - 5} y1={yS(v)} x2={margin.left} y2={yS(v)} className={styles.axis} />
              <text x={margin.left - 10} y={yS(v) + 4} className={styles.tickLabel} textAnchor="end">
                {v}
              </text>
            </g>
          ))}

          {/* ── X labels ── */}
          <text x={xS(0.08)} y={margin.top + ph + 22} className={styles.tickLabel} textAnchor="middle">ciclos iniciales</text>
          <text x={xS(0.5)} y={margin.top + ph + 22} className={styles.tickLabel} textAnchor="middle">transición</text>
          <text x={xS(0.9)} y={margin.top + ph + 22} className={styles.tickLabel} textAnchor="middle">régimen</text>

          {/* ── Axis labels ── */}
          <text x={margin.left + pw / 2} y={H - 4} className={styles.axisLabel} textAnchor="middle">
            tiempo tras energización
          </text>
          <text
            x={16} y={margin.top + ph / 2}
            className={styles.axisLabel} textAnchor="middle"
            transform={`rotate(-90, 16, ${margin.top + ph / 2})`}
          >
            corriente (pu)
          </text>

          {/* ── Peak annotation ── */}
          <text x={xS(0.04)} y={yS(9.2) - 6} className={styles.peakAnnotation}>8–10 pu</text>

          {/* ── Decay annotation ── */}
          <text x={xS(0.45)} y={yS(envelope[55]?.env || 3) - 10} className={styles.decayAnnotation}>
            decaimiento
          </text>
        </svg>
      </div>

      <div className={`${styles.tooltip} ${hoveredElement ? '' : styles.tooltipHidden}`} role="status" aria-live="polite">
        <p>{hoveredElement ? tooltips[hoveredElement] : '\u00A0'}</p>
      </div>

      <div className={styles.legend}>
        <span
          className={`${styles.legendItem} ${hoveredElement === 'peak' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => hover('peak')}
          onMouseLeave={unhover}
          tabIndex={0}
          role="button"
        >
          <i className={styles.dotInrush} /> i(t) inrush
        </span>
        <span
          className={`${styles.legendItem} ${hoveredElement === 'envelope' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => hover('envelope')}
          onMouseLeave={unhover}
          tabIndex={0}
          role="button"
        >
          <i className={styles.dotEnvelope} /> envolvente
        </span>
        <span
          className={`${styles.legendItem} ${hoveredElement === 'nominal' ? styles.legendItemActive : ''}`}
          onMouseEnter={() => hover('nominal')}
          onMouseLeave={unhover}
          tabIndex={0}
          role="button"
        >
          <i className={styles.dotNominal} /> 1 pu nominal
        </span>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> En una isla débil, el inrush de un transformador puede absorber corriente varias veces superior a la nominal y provocar caídas de tensión antes de que el sistema alcance régimen estable.
      </div>
    </figure>
  );
}