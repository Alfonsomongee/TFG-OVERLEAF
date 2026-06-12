import React, { useState, useMemo, useCallback } from 'react';
import styles from './FerrantiCapacitiveLineSimulator.module.css';

export default function FerrantiCapacitiveLineSimulator() {
  const [lengthKm, setLengthKm] = useState(280);
  const [loadPercent, setLoadPercent] = useState(25);
  const [compensationPercent, setCompensationPercent] = useState(35);
  const [lines, setLines] = useState(3);
  const [hoveredElement, setHoveredElement] = useState(null);

  const hover = useCallback((el) => setHoveredElement(el), []);
  const unhover = useCallback(() => setHoveredElement(null), []);

  const derived = useMemo(() => {
    const capacitiveDrive = (lengthKm / 300) * (lines / 3);
    const loadAbsorption = loadPercent / 100;
    const inductiveCompensation = compensationPercent / 100;

    const effectiveCapacitive = capacitiveDrive * (1 - 0.55 * loadAbsorption);
    const compensationTerm = 0.85 * inductiveCompensation;
    const qExcess = effectiveCapacitive - compensationTerm;

    const vr = Math.max(0.96, Math.min(1.12, 1 + 0.07 * qExcess));

    let stateKey = 'normal';
    if (vr >= 1.09) stateKey = 'risk';
    else if (vr >= 1.05) stateKey = 'overvoltage';

    return { effectiveCapacitive, compensationTerm, qExcess, vr, stateKey };
  }, [lengthKm, loadPercent, compensationPercent, lines]);

  const { effectiveCapacitive, compensationTerm, qExcess, vr, stateKey } = derived;

  const stateLabels = {
    normal: 'Régimen normal',
    overvoltage: 'Sobretensión',
    risk: 'Riesgo ANSI 59',
  };

  const pericialText = useMemo(() => {
    const km = lengthKm, load = loadPercent, comp = compensationPercent;
    if (stateKey === 'normal')
      return `Con ${km} km de línea, carga del ${load} % y compensación del ${comp} %, la tensión receptora se mantiene dentro de límites normales. Sin excedente capacitivo significativo.`;
    if (stateKey === 'overvoltage')
      return `Línea de ${km} km, baja carga (${load} %) y compensación insuficiente (${comp} %) generan excedente capacitivo que eleva Vr por encima de 1,05 p.u., entrando en zona de sobretensión.`;
    return `Con ${km} km, carga reducida al ${load} % y solo ${comp} % de compensación, la capacitancia distribuida inyecta reactiva neta. Vr supera 1,09 p.u., aproximándose al disparo por ANSI 59.`;
  }, [stateKey, lengthKm, loadPercent, compensationPercent]);

  const tooltips = {
    gauge: `Tensión receptora: ${vr.toFixed(3)} p.u. — ${stateLabels[stateKey]}`,
    capacitor: 'Capacitancia distribuida de la línea: genera potencia reactiva capacitiva proporcional a V² y a la longitud.',
    compensator: 'Compensación inductiva shunt: reactores que absorben reactiva para contrarrestar el excedente capacitivo.',
    excess: qExcess >= 0
      ? 'Excedente capacitivo positivo: la inyección de reactiva supera la absorción, elevando la tensión receptora.'
      : 'Balance reactivo negativo: la absorción supera la generación capacitiva, sin riesgo de sobretensión.',
  };

  /* ── SVG layout ── */
  const gaugeH = 130, voltageMin = 0.96, voltageMax = 1.12;
  const voltToY = (v) => gaugeH - ((v - voltageMin) / (voltageMax - voltageMin)) * gaugeH;
  const markerY = voltToY(vr);
  const y105 = voltToY(1.05), y109 = voltToY(1.09);

  const numCaps = Math.max(1, Math.min(6, Math.round(lengthKm / 75)));
  const capXs = useMemo(() => {
    if (numCaps === 1) return [390];
    return Array.from({ length: numCaps }, (_, i) => 200 + (i / (numCaps - 1)) * 380);
  }, [numCaps]);

  const showArrow = qExcess > 0;
  const arrowOpacity = showArrow ? Math.min(1, 0.4 + qExcess * 0.8) : 0;
  const arrowWidth = showArrow ? Math.min(4, 1.5 + qExcess * 2) : 1;

  const maxReactive = Math.max(effectiveCapacitive, compensationTerm, Math.abs(qExcess), 1.0);

  const parallelOffsets = { 1: [], 2: [-5], 3: [-5, 5], 4: [-7, -3, 5], 5: [-8, -4, 4, 8] };
  const offsets = parallelOffsets[lines] ?? [];

  return (
    <figure className={styles.figure} aria-labelledby="ferranti-title">
      <header className={styles.header}>
        <p className={styles.kicker}>Simulador didáctico · Red de transporte 400 kV</p>
        <h3 id="ferranti-title" className={styles.title}>
          La red que genera tensión: efecto Ferranti y saturación capacitiva
        </h3>
        <p className={styles.subtitle}>
          En líneas largas y poco cargadas, la capacitancia distribuida puede elevar la tensión y generar excedente de reactiva.
        </p>
      </header>

      <div className={styles.equationBlock}>
        <span className={styles.eq}>Q<sub>c</sub> = ω · C · V²</span>
        <span className={styles.eqSep}>·</span>
        <span className={styles.eq}>V<sub>r</sub> {'>'} V<sub>s</sub> si Q<sub>c</sub> {'>'} Q<sub>absorbido</sub></span>
      </div>

      <div className={styles.visualWrap}>
        <svg
          className={styles.svg}
          viewBox="0 0 820 280"
          role="img"
          aria-labelledby="ferranti-svg-title ferranti-svg-desc"
        >
          <title id="ferranti-svg-title">Simulador del efecto Ferranti</title>
          <desc id="ferranti-svg-desc">
            Línea de transporte de 400 kV con capacitancia distribuida, compensación inductiva shunt
            y gauge de tensión en el extremo receptor. El número de capacitancias varía con la longitud
            y la flecha capacitiva indica el empuje hacia sobretensión.
          </desc>

          <rect x="0" y="0" width="820" height="280" fill="var(--fig-bg)" rx="8" />

          {/* ── Main line ── */}
          <line x1="100" y1="150" x2="680" y2="150" stroke="var(--fig-teal)" strokeWidth="3" />
          {offsets.map((o) => (
            <line key={o} x1="100" y1={150 + o} x2="680" y2={150 + o}
              stroke="var(--fig-teal)" strokeWidth="0.8" opacity="0.3" />
          ))}

          {/* ── Vs node ── */}
          <rect x="70" y="125" width="28" height="38" rx="4"
            fill="var(--fig-surface)" stroke="var(--fig-text)" strokeWidth="1.5" />
          <text x="84" y="144" textAnchor="middle" dominantBaseline="middle"
            fontSize="12" fill="var(--fig-text)" fontWeight="600">Vs</text>
          <text x="84" y="158" textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="var(--fig-muted)">1.0 p.u.</text>

          {/* ── Vr node ── */}
          <rect x="660" y="125" width="28" height="38" rx="4"
            fill="var(--fig-surface)" stroke="var(--fig-text)" strokeWidth="1.5" />
          <text x="674" y="144" textAnchor="middle" dominantBaseline="middle"
            fontSize="12" fill="var(--fig-text)" fontWeight="600">Vr</text>
          <text x="674" y="158" textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="var(--fig-text)">{vr.toFixed(3)}</text>

          {/* ── Distributed capacitances ── */}
          {capXs.map((cx) => (
            <g key={cx}
              onMouseEnter={() => hover('capacitor')}
              onMouseLeave={unhover}
              className={styles.capGroup}
            >
              <line x1={cx} y1="150" x2={cx} y2="180" stroke="var(--fig-text)" strokeWidth="1" />
              <line x1={cx - 8} y1="180" x2={cx + 8} y2="180" stroke="var(--fig-teal)" strokeWidth="2" />
              <line x1={cx - 8} y1="185" x2={cx + 8} y2="185" stroke="var(--fig-teal)" strokeWidth="2" />
              <line x1={cx} y1="185" x2={cx} y2="195" stroke="var(--fig-text)" strokeWidth="1" />
              <line x1={cx - 5} y1="195" x2={cx + 5} y2="195" stroke="var(--fig-text)" strokeWidth="1.5" />
              <text x={cx} y="210" textAnchor="middle" fontSize="7" fill="var(--fig-teal)">C</text>
            </g>
          ))}

          {/* ── Length label ── */}
          <text x="390" y="120" textAnchor="middle" fontSize="9" fill="var(--fig-muted)" opacity="0.7">
            {lengthKm} km eq.
          </text>
          <text x="390" y="134" textAnchor="middle" fontSize="9.5" fill="var(--fig-text)" opacity="0.85" fontWeight="500">
            {vr > 1.01 ? 'Vr > Vs' : 'Vr ≈ Vs'}
          </text>

          {/* ── Capacitive push arrow ── */}
          {showArrow && (
            <g opacity={arrowOpacity}>
              <line x1="330" y1="125" x2="530" y2="115"
                stroke="var(--fig-amber)" strokeWidth={arrowWidth} strokeDasharray="4 2" />
              <polygon points="530,115 536,111 534,118" fill="var(--fig-amber)" />
              <text x="430" y="108" textAnchor="middle" fontSize="7.5"
                fill="var(--fig-amber)" fontWeight="500">excedente capacitivo</text>
            </g>
          )}

          {/* ── Inductive compensator ── */}
          <g transform="translate(655, 150)"
            onMouseEnter={() => hover('compensator')}
            onMouseLeave={unhover}
            className={styles.compGroup}
          >
            <line x1="0" y1="0" x2="0" y2="12" stroke="var(--fig-text)" strokeWidth="1.5" />
            <path d="M -8 12 L 8 18 L -8 24 L 8 30 L -8 36" fill="none"
              stroke="var(--fig-amber)" strokeWidth="1.8" />
            <line x1="0" y1="36" x2="0" y2="44" stroke="var(--fig-text)" strokeWidth="1" />
            <line x1="-4" y1="44" x2="4" y2="44" stroke="var(--fig-text)" strokeWidth="1.5" />
            <text x="14" y="24" fontSize="7" fill="var(--fig-amber)">comp. inductiva</text>
          </g>

          {/* ── Voltage gauge ── */}
          <g transform="translate(700, 40)"
            onMouseEnter={() => hover('gauge')}
            onMouseLeave={unhover}
          >
            <rect x="0" y="0" width="14" height={gaugeH} rx="3"
              fill="var(--fig-surface)" stroke="var(--fig-text)" strokeWidth="1" />
            <rect x="1" y={y105} width="12" height={gaugeH - y105} fill="var(--fig-teal)" opacity="0.7" />
            <rect x="1" y={y109} width="12" height={y105 - y109} fill="var(--fig-amber)" opacity="0.7" />
            <rect x="1" y="0" width="12" height={y109} fill="var(--fig-burgundy)" opacity="0.7" />

            <line x1="-6" y1={markerY} x2="14" y2={markerY} stroke="var(--fig-text)" strokeWidth="2" />
            <polygon points={`14,${markerY - 3} 19,${markerY} 14,${markerY + 3}`} fill="var(--fig-text)" />
            <text x="24" y={markerY + 3} fontSize="8" fill="var(--fig-text)" fontWeight="600">
              {vr.toFixed(3)}
            </text>

            <text x="18" y="8" fontSize="7" fill="var(--fig-burgundy)" fontWeight="500">ANSI 59</text>
            <text x="18" y={y109 + (y105 - y109) / 2 + 2} fontSize="7" fill="var(--fig-amber)" fontWeight="500">sobretensión</text>
            <text x="18" y={gaugeH - 4} fontSize="7" fill="var(--fig-teal)" fontWeight="500">normal</text>

            <line x1="14" y1={y105} x2="18" y2={y105} stroke="var(--fig-text)" strokeWidth="1" />
            <text x="21" y={y105 + 2} fontSize="6" fill="var(--fig-text)">1.05</text>
            <line x1="14" y1={y109} x2="18" y2={y109} stroke="var(--fig-text)" strokeWidth="1" />
            <text x="21" y={y109 + 2} fontSize="6" fill="var(--fig-text)">1.09</text>
            <text x="7" y={gaugeH + 12} textAnchor="middle" fontSize="8" fill="var(--fig-text)">p.u.</text>
          </g>
        </svg>
      </div>

      {hoveredElement && (
        <div className={styles.tooltip} role="status" aria-live="polite">
          <p>{tooltips[hoveredElement]}</p>
        </div>
      )}

      {/* ── Reactive balance band ── */}
      <div className={styles.balanceBand}>
        <p className={styles.balanceHeading}>Balance reactivo normalizado</p>
        <div className={styles.reactiveBand}>
          {[
            { label: 'Qc efectivo', val: effectiveCapacitive, color: 'var(--fig-teal)', key: 'capacitor' },
            { label: 'Q absorbido', val: compensationTerm, color: 'var(--fig-amber)', key: 'compensator' },
            { label: 'Q excedente', val: Math.abs(qExcess), color: qExcess > 0.35 ? 'var(--fig-burgundy)' : qExcess > 0 ? 'var(--fig-amber)' : 'var(--fig-teal)', key: 'excess' },
          ].map(({ label, val, color, key }) => (
            <div key={key} className={styles.bandItem}
              onMouseEnter={() => hover(key)} onMouseLeave={unhover}>
              <span className={styles.bandLabel}>{label}</span>
              <div className={styles.barWrapper}>
                <div className={styles.barFill}
                  style={{ width: `${(val / maxReactive) * 100}%`, backgroundColor: color }} />
              </div>
              <span className={styles.bandValue}>
                {key === 'excess' ? (qExcess >= 0 ? '+' : '') : ''}{key === 'excess' ? qExcess.toFixed(2) : val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <p className={styles.balanceEquation}>
          Qc efectivo − Q absorbido = {qExcess >= 0 ? '+' : ''}{qExcess.toFixed(2)} p.u.
        </p>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {[
          { id: 'ferranti-length', label: 'Longitud equivalente de línea', min: 50, max: 450, value: lengthKm, set: setLengthKm, unit: 'km' },
          { id: 'ferranti-load', label: 'Nivel de carga activa relativa', min: 5, max: 100, value: loadPercent, set: setLoadPercent, unit: '%' },
          { id: 'ferranti-comp', label: 'Compensación inductiva disponible', min: 0, max: 100, value: compensationPercent, set: setCompensationPercent, unit: '%' },
          { id: 'ferranti-lines', label: 'N.º de líneas energizadas', min: 1, max: 5, value: lines, set: setLines, unit: '', step: 1 },
        ].map(({ id, label, min, max, value, set, unit, step }) => (
          <div key={id} className={styles.controlGroup}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <div className={styles.sliderRow}>
              <input id={id} type="range" min={min} max={max} step={step || 1}
                value={value} onChange={(e) => set(Number(e.target.value))}
                className={styles.slider} />
              <span className={styles.value}>{value}{unit ? ` ${unit}` : ''}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── State badge ── */}
      <div className={`${styles.stateBadge} ${styles[stateKey]}`}>
        <span className={styles.stateLabel}>{stateLabels[stateKey]}</span>
        <span className={styles.stateValues}>
          Vr = {vr.toFixed(3)} p.u. · Q excedente = {qExcess >= 0 ? '+' : ''}{qExcess.toFixed(2)} p.u.
        </span>
      </div>

      {/* ── Expert text ── */}
      <div className={styles.pericial}>
        <p>{pericialText}</p>
      </div>

      <div className={styles.reading}>
        <strong>Lectura técnica.</strong> El efecto Ferranti no implica que una línea «genere energía activa», sino que su capacitancia distribuida puede inyectar potencia reactiva capacitiva cuando opera poco cargada. En una red débil, ese excedente eleva la tensión y reduce el margen frente a disparos por sobretensión.
      </div>
    </figure>
  );
}
