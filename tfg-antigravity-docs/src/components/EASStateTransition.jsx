// EASStateTransition.jsx
import React, { useState } from 'react';
import styles from './EASStateTransition.module.css';

const EAS_EVENTS = [
  {
    time: '12:32',
    tso: 'REE',
    physical: 95,
    easState: 'Normal',
    label: 'Estable. Inicio de oscilaciones locales subsíncronas controladas.',
    evidence: 'Tensiones de 400 kV por debajo de los límites admisibles de 420 kV.',
  },
  {
    time: '12:33:21',
    tso: 'REE',
    physical: 30,
    easState: 'Normal',
    label: 'Disparo físico de interconexiones por pérdida de sincronismo.',
  },
  {
    time: '12:40',
    tso: 'REE',
    physical: 0,
    easState: 'Blackout',
    label: 'Transición abrupta. Omisión absoluta de los estados de Alerta y Emergencia.',
    evidence: 'Colapso. Desconexión de 2.500 MW de generación e interconexiones Pirenaicas.',
  },
  {
    time: '12:40',
    tso: 'REN',
    physical: 0,
    easState: 'Blackout',
    label: 'Caída instantánea del bloque síncrono portugués.',
  },
  {
    time: '12:49',
    tso: 'Swissgrid',
    physical: 0,
    easState: 'Emergency',
    label: 'Activación del protocolo de control de frecuencia en modo dividido.',
    evidence: 'Operando en modo síncrono dividido respecto a Iberia.',
  },
  {
    time: '12:49',
    tso: 'Amprion',
    physical: 0,
    easState: 'Emergency',
    label: 'Coordinación de seguridad del bloque síncrono continental.',
  },
  {
    time: '12:50',
    tso: 'RTE',
    physical: 0,
    easState: 'Emergency',
    label: 'Desconexión física de interconexiones y aislamiento seguro del sistema francés.',
    evidence: 'Fluctuaciones de tensión transitorias mitigadas en subestaciones limítrofes.',
  },
  {
    time: '14:35',
    tso: 'RTE',
    physical: 30,
    easState: 'Alert',
    label: 'Normalización de tensiones en el sur de Francia.',
  },
  {
    time: '17:05',
    tso: 'REN',
    physical: 50,
    easState: 'Restoration',
    label: 'Inicio del plan de restauración física del sistema portugués.',
    evidence: 'Construcción de islas de levantamiento locales con unidades black-start.',
  },
  {
    time: '22:50',
    tso: 'RTE',
    physical: 70,
    easState: 'Restoration',
    label: 'Reporte de operatividad del LFC de REE. Rampa de intercambio de 0 a 1.400 MW.',
  },
  {
    time: '00:11',
    tso: 'RTE',
    physical: 90,
    easState: 'Normal',
    label: 'Cierre de lazo y estabilización del AGC de REE.',
    evidence: 'El sistema español recupera el control automático y la compensación de desvíos.',
  },
];

const STATE_VALUES = {
  Normal: 4,
  Alert: 3,
  Emergency: 2,
  Blackout: 1,
  Restoration: 2.5,
};

const generatePhysicalPath = (events, xScale, yScale) =>
  events
    .map((evt, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(evt.physical)}`)
    .join(' ');

export default function EASStateTransition() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const width = 900;
  const height = 400;
  const margin = { top: 40, right: 120, bottom: 50, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xScale = (i) => margin.left + (i / (EAS_EVENTS.length - 1)) * chartWidth;
  const yScalePhysical = (val) => margin.top + (1 - val / 100) * (chartHeight * 0.45);
  const yScaleState = (state) => {
    const v = STATE_VALUES[state] || 2;
    return margin.top + chartHeight * 0.55 + ((4 - v) / 3) * (chartHeight * 0.4);
  };

  const handlePointClick = (index) =>
    setSelectedIndex((prev) => (prev === index ? null : index));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>Monitorización paneuropea</span>
        <h2 className={styles.title}>Fallo estructural del EAS: del estado Normal al Blackout</h2>
        <p className={styles.subtitle}>
          Comparación entre la evolución física de la red ibérica y las declaraciones del ENTSO-E
          Awareness System.
        </p>
      </header>

      <div className={styles.legend} role="list" aria-label="Leyenda de estados EAS">
        {['Normal', 'Alert', 'Emergency', 'Blackout', 'Restoration'].map((state) => {
          const esNames = {
            Normal: 'Normal',
            Alert: 'Alerta',
            Emergency: 'Emergencia',
            Blackout: 'Blackout',
            Restoration: 'Restauración',
          };
          return (
          <div key={state} className={styles.legendItem} role="listitem">
            <span
              className={styles.legendSwatch}
              style={{ backgroundColor: `var(--eas-${state.toLowerCase()}-color)` }}
            />
            <span className={styles.legendLabel}>{esNames[state]}</span>
          </div>
          );
        })}
      </div>

      <div className={styles.chartContainer}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className={styles.svg}
          aria-label="Gráfico de estabilidad física vs notificaciones EAS"
          role="img"
        >
          <line
            x1={margin.left} y1={margin.top + chartHeight}
            x2={margin.left + chartWidth} y2={margin.top + chartHeight}
            stroke="var(--eas-axis-color)" strokeWidth="1"
          />
          <line
            x1={margin.left} y1={margin.top}
            x2={margin.left} y2={margin.top + chartHeight}
            stroke="var(--eas-axis-color)" strokeWidth="1"
          />
          {[100, 75, 50, 25, 0].map((val) => (
            <text key={val} x={margin.left - 10} y={yScalePhysical(val) + 4}
              textAnchor="end" fontSize="11" fill="var(--eas-text-color)">
              {val}%
            </text>
          ))}
          <text x={margin.left - 40} y={margin.top + chartHeight * 0.225}
            textAnchor="middle" fontSize="12" fill="var(--eas-text-color)"
            transform={`rotate(-90, ${margin.left - 40}, ${margin.top + chartHeight * 0.225})`}>
            Estabilidad física (%)
          </text>

          <line
            x1={margin.left + chartWidth} y1={margin.top}
            x2={margin.left + chartWidth} y2={margin.top + chartHeight}
            stroke="var(--eas-axis-color)" strokeWidth="1"
          />
          {Object.entries(STATE_VALUES).map(([state]) => {
            const esNames = {
              Normal: 'Normal',
              Alert: 'Alerta',
              Emergency: 'Emergencia',
              Blackout: 'Blackout',
              Restoration: 'Restauración',
            };
            return (
            <text key={state} x={margin.left + chartWidth + 10} y={yScaleState(state) + 4}
              textAnchor="start" fontSize="11" fill={`var(--eas-${state.toLowerCase()}-color)`}>
              {esNames[state]}
            </text>
            );
          })}
          <text x={margin.left + chartWidth + 70} y={margin.top + chartHeight * 0.775}
            textAnchor="middle" fontSize="12" fill="var(--eas-text-color)"
            transform={`rotate(-90, ${margin.left + chartWidth + 70}, ${margin.top + chartHeight * 0.775})`}>
            Estado EAS reportado
          </text>

          <path
            d={generatePhysicalPath(EAS_EVENTS, xScale, yScalePhysical)}
            fill="none" stroke="var(--eas-physical-line)" strokeWidth="3"
            strokeLinejoin="round" strokeLinecap="round"
          />
          {EAS_EVENTS.map((evt, i) => (
            <circle key={`phys-${i}`} cx={xScale(i)} cy={yScalePhysical(evt.physical)}
              r="4" fill="var(--eas-physical-line)" className={styles.point}
              onClick={() => handlePointClick(i)} tabIndex={0} role="button"
              aria-label={`${evt.time}: ${evt.label}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePointClick(i); } }}
            />
          ))}

          {EAS_EVENTS.map((evt, i) => {
            if (i === 0) return null;
            const prev = EAS_EVENTS[i - 1];
            const xPrev = xScale(i - 1);
            const xCurr = xScale(i);
            const yPrev = yScaleState(prev.easState);
            const yCurr = yScaleState(evt.easState);
            return (
              <g key={`eas-seg-${i}`}>
                <line x1={xPrev} y1={yPrev} x2={xCurr} y2={yPrev}
                  stroke={`var(--eas-${prev.easState.toLowerCase()}-color)`} strokeWidth="3" />
                <line x1={xCurr} y1={yPrev} x2={xCurr} y2={yCurr}
                  stroke={`var(--eas-${evt.easState.toLowerCase()}-color)`} strokeWidth="3" strokeDasharray="2 2" />
              </g>
            );
          })}
          {EAS_EVENTS.map((evt, i) => (
            <circle key={`eas-pt-${i}`} cx={xScale(i)} cy={yScaleState(evt.easState)}
              r="5" fill={`var(--eas-${evt.easState.toLowerCase()}-color)`}
              stroke="#fff" strokeWidth="1" className={styles.point}
              onClick={() => handlePointClick(i)} tabIndex={0} role="button"
              aria-label={`EAS: ${evt.easState} a las ${evt.time}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePointClick(i); } }}
            />
          ))}

          <text x={xScale(2)} y={yScalePhysical(0) - 12} textAnchor="middle" fontSize="10"
            fill="var(--eas-text-color)" fontStyle="italic">
            Salto directo Normal→Blackout
          </text>
          <line x1={xScale(2)} y1={yScalePhysical(0) - 4} x2={xScale(2)} y2={yScalePhysical(0)}
            stroke="var(--eas-text-color)" strokeWidth="0.5" strokeDasharray="2 2" />
        </svg>
      </div>

      {selectedIndex !== null && (
        <div className={styles.detailPanel} role="region" aria-label={`Detalle de evento a las ${EAS_EVENTS[selectedIndex].time}`}>
          <h4 className={styles.detailTitle}>{EAS_EVENTS[selectedIndex].tso} – {EAS_EVENTS[selectedIndex].time}</h4>
          <p><strong>Estado físico:</strong> {EAS_EVENTS[selectedIndex].physical}%</p>
          <p><strong>Estado EAS:</strong> {EAS_EVENTS[selectedIndex].easState}</p>
          <p>{EAS_EVENTS[selectedIndex].label}</p>
          {EAS_EVENTS[selectedIndex].evidence && (
            <p className={styles.evidence}>{EAS_EVENTS[selectedIndex].evidence}</p>
          )}
        </div>
      )}

      )}

    </div>
  );
}