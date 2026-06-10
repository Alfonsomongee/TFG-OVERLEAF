import React, { useState, useMemo } from 'react';
import styles from './FerrantiCapacitiveLineSimulator.module.css';

export default function FerrantiCapacitiveLineSimulator() {
  const [lengthKm, setLengthKm] = useState(280);
  const [loadPercent, setLoadPercent] = useState(25);
  const [compensationPercent, setCompensationPercent] = useState(35);
  const [lines, setLines] = useState(3);

  const derived = useMemo(() => {
    const voltageLevel = 1;
    const capacitiveDrive =
      (lengthKm / 300) * (lines / 3) * Math.pow(voltageLevel, 2);
    const loadAbsorption = loadPercent / 100;
    const inductiveCompensation = compensationPercent / 100;

    const effectiveCapacitive = capacitiveDrive * (1 - 0.55 * loadAbsorption);
    const compensationTerm = 0.85 * inductiveCompensation;
    const qExcess = effectiveCapacitive - compensationTerm;

    let vr = 1 + 0.07 * qExcess;
    const vrClamped = Math.max(0.96, Math.min(1.12, vr));

    let stateKey = 'normal';
    if (vrClamped >= 1.09) stateKey = 'risk';
    else if (vrClamped >= 1.05) stateKey = 'overvoltage';

    return {
      effectiveCapacitive,
      compensationTerm,
      qExcess,
      vrClamped,
      stateKey,
    };
  }, [lengthKm, loadPercent, compensationPercent, lines]);

  const { effectiveCapacitive, compensationTerm, qExcess, vrClamped, stateKey } = derived;

  const stateLabels = {
    normal: 'Régimen normal',
    overvoltage: 'Sobretensión',
    risk: 'Riesgo ANSI 59',
  };

  const pericialText = useMemo(() => {
    const km = lengthKm;
    const load = loadPercent;
    const comp = compensationPercent;
    if (stateKey === 'normal') {
      return `Con ${km} km de línea, una carga activa del ${load} % y compensación inductiva del ${comp} %, la tensión receptora se mantiene dentro de los límites normales. La red no presenta un excedente capacitivo significativo.`;
    }
    if (stateKey === 'overvoltage') {
      return `La combinación de una línea de ${km} km, baja carga (${load} %) y compensación insuficiente (${comp} %) genera un excedente de reactiva capacitiva que eleva la tensión receptora por encima de 1,05 p.u., entrando en zona de sobretensión.`;
    }
    return `Con ${km} km de línea, carga reducida al ${load} % y solo un ${comp} % de compensación inductiva, la capacitancia distribuida actúa como fuente neta de reactiva. La tensión receptora supera 1,09 p.u. y se aproxima a la zona de disparo por ANSI 59.`;
  }, [stateKey, lengthKm, loadPercent, compensationPercent]);

  // Gauge dimensions compactas
  const gaugeHeight = 130;
  const voltageMin = 0.96;
  const voltageMax = 1.12;

  const voltageToGaugeY = (v) =>
    gaugeHeight - ((v - voltageMin) / (voltageMax - voltageMin)) * gaugeHeight;

  const markerY = voltageToGaugeY(vrClamped);
  const yNormalTop = voltageToGaugeY(1.05);
  const yOvervoltageTop = voltageToGaugeY(1.09);
  const riskHeight = yOvervoltageTop;
  const overvoltageHeight = yNormalTop - yOvervoltageTop;
  const normalHeight = gaugeHeight - yNormalTop;

  // Capacitancias distribuidas según longitud
  const numCaps = Math.max(1, Math.min(6, Math.round(lengthKm / 75)));
  const capXStart = 200;
  const capXEnd = 580;
  const capXs = useMemo(() => {
    if (numCaps === 1) return [390];
    return Array.from({ length: numCaps }, (_, i) =>
      capXStart + (i / (numCaps - 1)) * (capXEnd - capXStart)
    );
  }, [numCaps]);

  const showPushArrow = qExcess > 0;
  const arrowOpacity = showPushArrow ? Math.min(1, 0.4 + qExcess * 0.8) : 0;
  const arrowStrokeWidth = showPushArrow ? Math.min(4, 1.5 + qExcess * 2) : 1;
  const qExcessColor =
    qExcess > 0.35
      ? 'var(--ferranti-danger)'
      : qExcess > 0
      ? 'var(--ferranti-warning)'
      : 'var(--ferranti-accent)';

  const maxReactive = Math.max(effectiveCapacitive, compensationTerm, Math.abs(qExcess), 1.0);

  const parallelLineOffsetsByCount = {
    1: [],
    2: [-5],
    3: [-5, 5],
    4: [-7, -3, 5],
    5: [-8, -4, 4, 8],
  };
  const parallelLineOffsets = parallelLineOffsetsByCount[lines] ?? [];

  return (
    <div className={styles.figure} role="figure" aria-labelledby="ferranti-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Simulador didáctico · Red de transporte 400 kV</p>
          <h3 id="ferranti-title" className={styles.title}>
            La red que genera tensión: efecto Ferranti y saturación capacitiva
          </h3>
          <p className={styles.subtitle}>
            En líneas largas y poco cargadas, la capacitancia distribuida puede elevar la tensión y generar excedente de reactiva.
          </p>
        </header>

        <svg
          className={styles.svgCanvas}
          viewBox="0 0 820 280"
          role="img"
          aria-label="Esquema del efecto Ferranti con indicadores visuales"
        >
          <title>Simulador del efecto Ferranti</title>
          <desc>
            Línea de transporte de 400 kV con capacitancia distribuida, compensación inductiva shunt y gauge de tensión en el extremo receptor. La flecha capacitiva ilustra el empuje hacia la sobretensión.
          </desc>

          <rect x="0" y="0" width="820" height="280" fill="var(--ferranti-bg)" rx="8" />

          {/* Línea principal central */}
          <line x1="100" y1="150" x2="680" y2="150" stroke="var(--ferranti-accent)" strokeWidth="3" />

          {/* Líneas paralelas si hay más de una línea energizada */}
          {parallelLineOffsets.map((offset) => (
            <line
              key={offset}
              x1="100"
              y1={150 + offset}
              x2="680"
              y2={150 + offset}
              stroke="var(--ferranti-accent)"
              strokeWidth="0.8"
              opacity="0.3"
            />
          ))}

          {/* Extremo emisor Vs */}
          <rect x="70" y="125" width="28" height="38" rx="4" fill="var(--ferranti-surface)" stroke="var(--ferranti-text)" strokeWidth="1.5" />
          <text x="84" y="144" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="var(--ferranti-text)" fontWeight="600">Vs</text>
          <text x="84" y="158" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--ferranti-text)">1.0 p.u.</text>

          {/* Extremo receptor Vr */}
          <rect x="660" y="125" width="28" height="38" rx="4" fill="var(--ferranti-surface)" stroke="var(--ferranti-text)" strokeWidth="1.5" />
          <text x="674" y="144" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="var(--ferranti-text)" fontWeight="600">Vr</text>
          <text x="674" y="158" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="var(--ferranti-text)">
            {vrClamped.toFixed(3)} p.u.
          </text>

          {/* Capacitancias distribuidas */}
          {capXs.map((cx) => (
            <g key={cx}>
              <line x1={cx} y1="150" x2={cx} y2="180" stroke="var(--ferranti-text)" strokeWidth="1" />
              <line x1={cx - 8} y1="180" x2={cx + 8} y2="180" stroke="var(--ferranti-accent)" strokeWidth="2" />
              <line x1={cx - 8} y1="185" x2={cx + 8} y2="185" stroke="var(--ferranti-accent)" strokeWidth="2" />
              <line x1={cx} y1="185" x2={cx} y2="195" stroke="var(--ferranti-text)" strokeWidth="1" />
              <line x1={cx - 5} y1="195" x2={cx + 5} y2="195" stroke="var(--ferranti-text)" strokeWidth="1.5" />
              <line x1={cx - 3} y1="198" x2={cx + 3} y2="198" stroke="var(--ferranti-text)" strokeWidth="1.5" />
              <text x={cx} y="192" textAnchor="middle" fontSize="7" fill="var(--ferranti-accent)">C</text>
            </g>
          ))}

          {/* Longitud */}
          <text x="390" y="120" textAnchor="middle" fontSize="8" fill="var(--ferranti-text)" opacity="0.6">
            {lengthKm} km eq.
          </text>

          {/* Comparativa Vr > Vs */}
          <text x="390" y="135" textAnchor="middle" fontSize="9" fill="var(--ferranti-text)" opacity="0.8">
            {vrClamped > 1.01 ? 'Vr > Vs' : 'Vr ≈ Vs'}
          </text>

          {/* Flecha de empuje capacitivo */}
          {showPushArrow && (
            <g opacity={arrowOpacity}>
              <line
                x1="330"
                y1="125"
                x2="530"
                y2="115"
                stroke="var(--ferranti-warning)"
                strokeWidth={arrowStrokeWidth}
                strokeDasharray="4 2"
              />
              <polygon
                points={`530,115 536,111 534,118`}
                fill="var(--ferranti-warning)"
              />
              <text x="430" y="108" textAnchor="middle" fontSize="7" fill="var(--ferranti-warning)" fontWeight="500">
                excedente capacitivo
              </text>
            </g>
          )}

          {/* Compensación inductiva compacta */}
          <g transform="translate(655, 150)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="var(--ferranti-text)" strokeWidth="1.5" />
            <path d="M -8 12 L 8 18 L -8 24 L 8 30 L -8 36" fill="none" stroke="var(--ferranti-warning)" strokeWidth="1.8" />
            <line x1="0" y1="36" x2="0" y2="44" stroke="var(--ferranti-text)" strokeWidth="1" />
            <line x1="-4" y1="44" x2="4" y2="44" stroke="var(--ferranti-text)" strokeWidth="1.5" />
            <text x="12" y="24" fontSize="7" fill="var(--ferranti-warning)">comp. inductiva</text>
          </g>

          {/* Gauge de tensión compacto */}
          <g transform="translate(700, 40)">
            <rect x="0" y="0" width="14" height={gaugeHeight} rx="3" fill="var(--ferranti-surface)" stroke="var(--ferranti-text)" strokeWidth="1" />

            <rect x="1" y={yNormalTop} width="12" height={normalHeight} fill="var(--ferranti-accent)" opacity="0.7" />
            <rect x="1" y={yOvervoltageTop} width="12" height={overvoltageHeight} fill="var(--ferranti-warning)" opacity="0.7" />
            <rect x="1" y="0" width="12" height={riskHeight} fill="var(--ferranti-danger)" opacity="0.7" />

            <line x1="-6" y1={markerY} x2="14" y2={markerY} stroke="var(--ferranti-text)" strokeWidth="2" />
            <polygon points={`14,${markerY - 3} 19,${markerY} 14,${markerY + 3}`} fill="var(--ferranti-text)" />
            <text x="24" y={markerY + 3} fontSize="8" fill="var(--ferranti-text)" fontWeight="600">
              {vrClamped.toFixed(3)}
            </text>

            <text x="18" y="8" fontSize="7" fill="var(--ferranti-danger)" fontWeight="500">ANSI 59</text>
            <text x="18" y={yOvervoltageTop + overvoltageHeight / 2 + 2} fontSize="7" fill="var(--ferranti-warning)" fontWeight="500">sobretensión</text>
            <text x="18" y={gaugeHeight - 4} fontSize="7" fill="var(--ferranti-accent)" fontWeight="500">normal</text>

            <line x1="14" y1={yNormalTop} x2="18" y2={yNormalTop} stroke="var(--ferranti-text)" strokeWidth="1" />
            <text x="21" y={yNormalTop + 2} fontSize="6" fill="var(--ferranti-text)">1.05</text>
            <line x1="14" y1={yOvervoltageTop} x2="18" y2={yOvervoltageTop} stroke="var(--ferranti-text)" strokeWidth="1" />
            <text x="21" y={yOvervoltageTop + 2} fontSize="6" fill="var(--ferranti-text)">1.09</text>

            <text x="7" y={gaugeHeight + 12} textAnchor="middle" fontSize="8" fill="var(--ferranti-text)">p.u.</text>
          </g>

          <text x="120" y="270" fontSize="9" fill="var(--ferranti-text)" fontStyle="italic" opacity="0.7">
            Qc = ω · C · V²
          </text>
        </svg>

        {/* Banda de balance reactivo compacta */}
        <div className={styles.balanceBand}>
          <p className={styles.balanceHeading}>Balance reactivo normalizado</p>
          <div className={styles.reactiveBand}>
            <div className={styles.bandItem}>
              <span className={styles.bandLabel}>Qc efectivo</span>
              <div className={styles.barWrapper}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(effectiveCapacitive / maxReactive) * 100}%`,
                    backgroundColor: 'var(--ferranti-accent)',
                  }}
                />
              </div>
              <span className={styles.bandValue}>{effectiveCapacitive.toFixed(2)}</span>
            </div>
            <div className={styles.bandItem}>
              <span className={styles.bandLabel}>Q absorbido</span>
              <div className={styles.barWrapper}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(compensationTerm / maxReactive) * 100}%`,
                    backgroundColor: 'var(--ferranti-warning)',
                  }}
                />
              </div>
              <span className={styles.bandValue}>{compensationTerm.toFixed(2)}</span>
            </div>
            <div className={styles.bandItem}>
              <span className={styles.bandLabel}>Q excedente</span>
              <div className={styles.barWrapper}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(Math.abs(qExcess) / maxReactive) * 100}%`,
                    backgroundColor: qExcessColor,
                  }}
                />
              </div>
              <span className={styles.bandValue}>
                {qExcess >= 0 ? '+' : ''}{qExcess.toFixed(2)}
              </span>
            </div>
          </div>
          <p className={styles.balanceEquation}>
            Qc efectivo − Q absorbido = {qExcess >= 0 ? '+' : ''}{qExcess.toFixed(2)} p.u.
          </p>
        </div>

        {/* Controles */}
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label htmlFor="ferranti-length" className={styles.label}>
              Longitud equivalente de línea
            </label>
            <div className={styles.sliderRow}>
              <input
                id="ferranti-length"
                type="range"
                min="50"
                max="450"
                value={lengthKm}
                onChange={(e) => setLengthKm(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.value}>{lengthKm} km</span>
            </div>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="ferranti-load" className={styles.label}>
              Nivel de carga activa relativa
            </label>
            <div className={styles.sliderRow}>
              <input
                id="ferranti-load"
                type="range"
                min="5"
                max="100"
                value={loadPercent}
                onChange={(e) => setLoadPercent(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.value}>{loadPercent} %</span>
            </div>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="ferranti-comp" className={styles.label}>
              Compensación inductiva disponible
            </label>
            <div className={styles.sliderRow}>
              <input
                id="ferranti-comp"
                type="range"
                min="0"
                max="100"
                value={compensationPercent}
                onChange={(e) => setCompensationPercent(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.value}>{compensationPercent} %</span>
            </div>
          </div>
          <div className={styles.controlGroup}>
            <label htmlFor="ferranti-lines" className={styles.label}>
              N.º de líneas energizadas equivalentes
            </label>
            <div className={styles.sliderRow}>
              <input
                id="ferranti-lines"
                type="range"
                min="1"
                max="5"
                step="1"
                value={lines}
                onChange={(e) => setLines(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.value}>{lines}</span>
            </div>
          </div>
        </div>

        {/* Estado operativo compacto */}
        <div className={`${styles.stateBadge} ${styles[stateKey]}`}>
          <span className={styles.stateLabel}>{stateLabels[stateKey]}</span>
          <span className={styles.stateValues}>
            Vr = {vrClamped.toFixed(3)} p.u. &nbsp;|&nbsp; Q excedente = {qExcess >= 0 ? '+' : ''}{qExcess.toFixed(2)} p.u.
          </span>
        </div>

        {/* Texto pericial dinámico */}
        <div className={styles.pericial}>
          <p>{pericialText}</p>
        </div>

        {/* Bloque conceptual compacto */}
        <div className={styles.conceptual}>
          <p>
            El efecto Ferranti no implica que una línea «genere energía activa», sino que su capacitancia distribuida puede inyectar potencia reactiva capacitiva cuando opera poco cargada. En una red débil y con absorción insuficiente, ese excedente de reactiva eleva la tensión y reduce el margen frente a disparos por sobretensión.
          </p>
        </div>
      </div>
    </div>
  );
}