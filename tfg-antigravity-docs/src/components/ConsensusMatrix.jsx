// %% AGENT_INSTRUCTION: Insertar en "Conclusiones" → "Matriz de consenso y discrepancia entre informes", sustituyendo la tabla markdown de afirmaciones × informes.
// %% LEGEND_PROPOSAL: "Grado de acuerdo entre los principales informes periciales y oficiales sobre diez afirmaciones clave del 28‑A. Verde: acuerdo expreso. Ámbar: matiz o mención parcial. Rojo: disputa. Gris: no evaluado. La columna final indica el consenso técnico global."

import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './ConsensusMatrix.module.css';

const CLAIMS = [
  {
    id: 'c1',
    text: 'Mecanismo dominante: sobretensión, no déficit de frecuencia',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'acuerdo',
    iit: 'acuerdo',
    aelec: 'acuerdo',
    entsoe: 'acuerdo',
    consenso: 'muy_alto',
    detalle: 'Todos los informes coinciden en que la secuencia final fue de sobretensión y desconexión en cascada.',
  },
  {
    id: 'c2',
    text: 'Evento multifactorial, no monocausal',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'acuerdo',
    iit: 'acuerdo',
    aelec: 'acuerdo',
    entsoe: 'acuerdo',
    consenso: 'muy_alto',
    detalle: 'Gobierno, REE, IIT, AELEC y ENTSO-E coinciden en que confluyeron múltiples factores.',
  },
  {
    id: 'c3',
    text: 'La frecuencia no fue el disparador raíz',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'acuerdo',
    iit: 'acuerdo',
    aelec: 'acuerdo',
    entsoe: 'acuerdo',
    consenso: 'alto',
    detalle: 'La sobretensión habría causado desconexiones independientemente de la frecuencia.',
  },
  {
    id: 'c4',
    text: 'Inercia media peninsular ≈ 2,3 s',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'no_evaluado',
    iit: 'acuerdo',
    aelec: 'no_evaluado',
    entsoe: 'no_evaluado',
    consenso: 'medio_alto',
    detalle: 'Gobierno e IIT confirman ~2,3 s; REE, AELEC y ENTSO-E no la destacan.',
  },
  {
    id: 'c5',
    text: 'Inercia zonal sur ≈ 1,3 s',
    axis: 'tecnico',
    gobierno: 'no_evaluado',
    ree: 'no_evaluado',
    iit: 'acuerdo',
    aelec: 'matiz',
    entsoe: 'no_evaluado',
    consenso: 'medio',
    detalle: 'Solo IIT calcula 1,30 s; AELEC converge cualitativamente; resto no lo publica.',
  },
  {
    id: 'c6',
    text: 'Penetración instantánea 82 % renovable',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'no_evaluado',
    iit: 'no_evaluado',
    aelec: 'matiz',
    entsoe: 'no_evaluado',
    consenso: 'parcial',
    detalle: 'Cifra oficial de generación renovable, no equivalente a 82 % IBR.',
  },
  {
    id: 'c7',
    text: 'Insuficiente absorción de reactiva según P.O. 7.4',
    axis: 'responsabilidad',
    gobierno: 'acuerdo',
    ree: 'acuerdo',
    iit: 'no_evaluado',
    aelec: 'disputa',
    entsoe: 'matiz',
    consenso: 'medio_bajo',
    detalle: 'Gobierno y REE señalan incumplimiento; AELEC discrepa; IIT no lo aborda centralmente.',
  },
  {
    id: 'c8',
    text: 'Maniobras de mallado de REE agravaron el margen de tensión',
    axis: 'responsabilidad',
    gobierno: 'matiz',
    ree: 'disputa',
    iit: 'acuerdo',
    aelec: 'acuerdo',
    entsoe: 'no_evaluado',
    consenso: 'bajo',
    detalle: 'IIT y AELEC afirman que redujeron el margen; REE defiende su necesidad.',
  },
  {
    id: 'c9',
    text: 'Tap‑Lag / OLTC y sobretensión no observable desde transporte',
    axis: 'tecnico',
    gobierno: 'matiz',
    ree: 'matiz',
    iit: 'no_evaluado',
    aelec: 'matiz',
    entsoe: 'no_evaluado',
    consenso: 'medio',
    detalle: 'Varios informes sugieren relación, pero sin confirmación robusta común.',
  },
  {
    id: 'c10',
    text: 'El perímetro de estabilidad de tensión fue zonal, no global',
    axis: 'tecnico',
    gobierno: 'acuerdo',
    ree: 'acuerdo',
    iit: 'acuerdo',
    aelec: 'acuerdo',
    entsoe: 'acuerdo',
    consenso: 'alto',
    detalle: 'Todos coinciden en que la fragilidad estaba concentrada en el sur peninsular.',
  },
];

const REPORTS = [
  { key: 'gobierno', label: 'Gob.' },
  { key: 'ree', label: 'REE' },
  { key: 'iit', label: 'IIT' },
  { key: 'aelec', label: 'AELEC' },
  { key: 'entsoe', label: 'ENTSO-E' },
];

const STATUS_META = {
  acuerdo: { symbol: '✓', label: 'Acuerdo' },
  matiz: { symbol: '~', label: 'Matiz' },
  disputa: { symbol: '✗', label: 'Disputa' },
  no_evaluado: { symbol: '—', label: 'No evaluado' },
};

const CONSENSO_LABELS = {
  muy_alto: 'Muy alto',
  alto: 'Alto',
  medio_alto: 'Medio‑alto',
  medio: 'Medio',
  parcial: 'Parcial',
  medio_bajo: 'Medio‑bajo',
  bajo: 'Bajo',
};

export default function ConsensusMatrix() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [selected, setSelected] = useState(null);

  const toggle = (claimId, reportKey) => {
    setSelected((prev) =>
      prev?.claimId === claimId && prev?.reportKey === reportKey
        ? null
        : { claimId, reportKey }
    );
  };

  const statusColor = (s) => {
    const map = {
      acuerdo: isDark ? '#5a9d42' : '#3a6b2e',
      matiz: isDark ? '#c49a4a' : '#9a6b2f',
      disputa: isDark ? '#d45a54' : '#a83832',
      no_evaluado: isDark ? '#4a5568' : '#b0b8c4',
    };
    return map[s] || map.no_evaluado;
  };

  const consensoColor = (c) => {
    const map = {
      muy_alto: isDark ? '#5a9d42' : '#3a6b2e',
      alto: isDark ? '#6aad52' : '#4a7c3a',
      medio_alto: isDark ? '#7aad42' : '#5a7c32',
      medio: isDark ? '#c49a4a' : '#9a6b2f',
      parcial: isDark ? '#ca8a3a' : '#a87020',
      medio_bajo: isDark ? '#d48a3a' : '#b35a1e',
      bajo: isDark ? '#d45a54' : '#a83832',
    };
    return map[c] || map.medio;
  };

  const selClaim = selected ? CLAIMS.find((c) => c.id === selected.claimId) : null;
  const selReport = selected ? REPORTS.find((r) => r.key === selected.reportKey) : null;

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Síntesis forense</span>
        <h3 className={styles.title}>Matriz de consenso entre informes</h3>
        <p className={styles.subtitle}>
          Grado de acuerdo entre los principales informes periciales sobre diez
          afirmaciones clave. La columna final indica el consenso técnico global.
        </p>
      </header>

      <div className={styles.legend}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <span key={key} className={styles.legendItem}>
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: statusColor(key) }}
              aria-hidden="true"
            />
            {meta.label}
          </span>
        ))}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.matrix} role="grid">
          <thead>
            <tr>
              <th className={styles.thClaim} scope="col">Afirmación</th>
              {REPORTS.map((r) => (
                <th key={r.key} className={styles.thReport} scope="col">{r.label}</th>
              ))}
              <th className={styles.thConsenso} scope="col">Cons.</th>
            </tr>
          </thead>
          <tbody>
            {CLAIMS.map((claim, ri) => (
              <tr key={claim.id} className={ri % 2 === 0 ? styles.rowEven : ''}>
                <td className={styles.tdClaim}>{claim.text}</td>
                {REPORTS.map((rep) => {
                  const status = claim[rep.key];
                  const meta = STATUS_META[status] || STATUS_META.no_evaluado;
                  const isActive =
                    selected?.claimId === claim.id && selected?.reportKey === rep.key;
                  return (
                    <td key={rep.key} className={styles.tdCell}>
                      <button
                        type="button"
                        className={`${styles.cell} ${isActive ? styles.cellActive : ''}`}
                        style={{ backgroundColor: statusColor(status) }}
                        onClick={() => toggle(claim.id, rep.key)}
                        aria-label={`${claim.text}: ${rep.label} — ${meta.label}`}
                        title={`${rep.label}: ${meta.label}`}
                      >
                        {meta.symbol}
                      </button>
                    </td>
                  );
                })}
                <td className={styles.tdConsenso}>
                  <span
                    className={styles.consensoBadge}
                    style={{ backgroundColor: consensoColor(claim.consenso) }}
                  >
                    {CONSENSO_LABELS[claim.consenso] || claim.consenso}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selClaim && selReport && (
        <div className={styles.detail} role="region" aria-label="Detalle de celda seleccionada">
          <h4 className={styles.detailTitle}>
            {selReport.label} — {selClaim.id.toUpperCase()}
          </h4>
          <p>
            <strong>Afirmación:</strong> {selClaim.text}
          </p>
          <p>
            <strong>Postura:</strong>{' '}
            {STATUS_META[selClaim[selReport.key]]?.label || selClaim[selReport.key]}
          </p>
          {selClaim.detalle && (
            <p className={styles.detailNote}>{selClaim.detalle}</p>
          )}
        </div>
      )}
    </div>
  );
}
