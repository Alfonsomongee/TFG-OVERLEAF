import React, { useMemo, useState } from 'react';

import styles from './CrisisTimelineDual.module.css';

const EVENTS = [
  {
    id: 'cero',
    lane: 'infra',
    phase: '12:33',
    time: '12:33',
    severity: 'critical',
    label: 'Cero eléctrico',
    short: '15.000 MW perdidos en segundos',
    detail:
      'La red ibérica se separa de Francia y el sistema entra en cero de tensión. La pérdida súbita de generación y demanda marca el inicio de la emergencia multisectorial.',
    source: 'REE / ENTSO-E',
    linkedTo: 'reunion_ccon',
  },
  {
    id: 'trenes',
    lane: 'infra',
    phase: '12:33',
    time: '~12:33',
    severity: 'critical',
    label: 'Red ferroviaria paralizada',
    short: '116 trenes · 35.000 pasajeros',
    detail:
      'La pérdida de alimentación deja sin catenaria, señalización y comunicaciones a múltiples corredores. La paralización ferroviaria se convierte en uno de los primeros impactos visibles.',
    source: 'Adif / Ministerio de Transportes',
  },
  {
    id: 'aeropuerto',
    lane: 'infra',
    phase: '13:00',
    time: '~13:00',
    severity: 'high',
    label: 'Lisboa restringe operaciones',
    short: 'Terminal 2 cerrado',
    detail:
      'El aeropuerto Humberto Delgado restringe accesos y operaciones. El impacto aeroportuario refleja la dependencia simultánea de energía, control de accesos, información y seguridad.',
    source: 'ANA Aeroportos / ANAC Portugal',
  },
  {
    id: 'baterias_caida',
    lane: 'infra',
    phase: '14:30–16:30',
    time: '14:30–16:30',
    severity: 'critical',
    label: 'Colapso de telecomunicaciones',
    short: 'Baterías agotadas',
    detail:
      'Las estaciones base móviles agotan sus baterías de respaldo. La pérdida de cobertura limita la coordinación institucional y deja sin canales de aviso a parte de la población.',
    source: 'ANACOM / Informes sectoriales',
    linkedTo: 'sms_tardio',
  },
  {
    id: 'victima_cacen',
    lane: 'infra',
    phase: '15:17',
    time: '15:17',
    severity: 'critical',
    label: 'Primera muerte verificada',
    short: 'Respirador agotado',
    detail:
      'Una paciente con ventilación mecánica domiciliaria fallece tras agotarse la batería del respirador, en un contexto de colapso vial y degradación de comunicaciones.',
    source: 'IGAS / Auditoría parlamentaria Portugal',
  },
  {
    id: 'recuperacion_inicio',
    lane: 'infra',
    phase: '17:00',
    time: '17:00',
    severity: 'medium',
    label: 'Inicio de reposición',
    short: 'Primeras bolsas de carga',
    detail:
      'Comienzan a consolidarse las primeras zonas con suministro recuperado. La restauración avanza por islas eléctricas y no como una vuelta continua del sistema completo.',
    source: 'REE / ENTSO-E',
    linkedTo: 'cese_emergencia',
  },
  {
    id: 'prioridades_pt',
    lane: 'inst',
    phase: '13:15',
    time: '13:15',
    severity: 'medium',
    label: 'Portugal fija prioridades',
    short: 'Hospitales · diálisis · respiratorios',
    detail:
      'La ANEPC prioriza combustible para hospitales, centros de diálisis y pacientes respiratorios. Es una de las primeras respuestas coordinadas documentadas.',
    source: 'ANEPC / Documentos parlamentarios Portugal',
  },
  {
    id: 'reunion_ccon',
    lane: 'inst',
    phase: '13:30',
    time: '13:30',
    severity: 'medium',
    label: 'Reunión CCON',
    short: '29 entidades coordinadas',
    detail:
      'El Centro de Coordenação Operacional Nacional reúne a 29 entidades. La falta de comunicaciones fiables aparece como limitación transversal de la respuesta.',
    source: 'ANEPC / Informe parlamentario',
    linkedTo: 'cero',
  },
  {
    id: 'orden_399',
    lane: 'inst',
    phase: 'Tarde',
    time: 'Tarde',
    severity: 'high',
    label: 'Emergencia Nacional',
    short: 'Orden INT/399/2025',
    detail:
      'El Ministerio del Interior declara la Emergencia de Interés Nacional en cinco comunidades autónomas. La UME y los servicios territoriales asumen tareas críticas.',
    source: 'BOE-A-2025-8486',
  },
  {
    id: 'orden_400',
    lane: 'inst',
    phase: 'Tarde',
    time: 'Tarde',
    severity: 'high',
    label: 'Ampliación a 8 CCAA',
    short: 'Orden INT/400/2025',
    detail:
      'La declaración se amplía a Castilla-La Mancha, Galicia y Comunitat Valenciana. La respuesta institucional escala conforme se confirma la extensión territorial del impacto.',
    source: 'BOE-A-2025-8487',
  },
  {
    id: 'sms_tardio',
    lane: 'inst',
    phase: '17:15',
    time: '17:15',
    severity: 'critical',
    label: 'SMS de alerta tardío',
    short: '~5 h de retraso',
    detail:
      'Portugal inicia el envío de alertas SMS a unos 11 millones de ciudadanos cuando muchas estaciones base ya habían agotado sus baterías. La alerta llega tarde respecto a la ventana de vulnerabilidad.',
    source: 'ANEPC / Informe parlamentario',
    linkedTo: 'baterias_caida',
  },
  {
    id: 'crisis_energetica',
    lane: 'inst',
    phase: '20:30',
    time: '20:30',
    severity: 'high',
    label: 'Crisis energética',
    short: 'Declaración formal',
    detail:
      'El Consejo de Ministros portugués declara formalmente la situación de crisis energética y activa mecanismos de emergencia para sostener servicios esenciales.',
    source: 'Documentos parlamentarios Portugal',
  },
  {
    id: 'cese_emergencia',
    lane: 'inst',
    phase: '29 abr',
    time: '29 abr',
    severity: 'medium',
    label: 'Cese parcial de emergencia',
    short: 'Orden INT/409/2025',
    detail:
      'Interior decreta el cese de la emergencia en seis comunidades autónomas. Madrid y Extremadura permanecen más tiempo bajo régimen extraordinario.',
    source: 'BOE / Ministerio del Interior',
    linkedTo: 'recuperacion_inicio',
  },
];

const PHASES = [
  {
    key: '12:33',
    label: '12:33',
    span: 'Cero de tensión',
  },
  {
    key: '13:00',
    label: '13:00',
    span: 'Primeros efectos',
  },
  {
    key: '13:15',
    label: '13:15',
    span: 'Prioridades',
  },
  {
    key: '13:30',
    label: '13:30',
    span: 'Coordinación',
  },
  {
    key: '14:30–16:30',
    label: '14:30–16:30',
    span: 'Telecom',
  },
  {
    key: '15:17',
    label: '15:17',
    span: 'Vulnerabilidad vital',
  },
  {
    key: 'Tarde',
    label: 'Tarde',
    span: 'Escalada legal',
  },
  {
    key: '17:00',
    label: '17:00',
    span: 'Reposición',
  },
  {
    key: '17:15',
    label: '17:15',
    span: 'Alerta tardía',
  },
  {
    key: '20:30',
    label: '20:30',
    span: 'Crisis energética',
  },
  {
    key: '29 abr',
    label: '29 abr',
    span: 'Cierre parcial',
  },
];

const DEFAULT_ACTIVE_ID = 'sms_tardio';

function getTone(event) {
  if (event.severity === 'critical') {
    return event.lane === 'infra' ? 'danger' : 'warning';
  }

  if (event.severity === 'high') {
    return event.lane === 'infra' ? 'warning' : 'info';
  }

  return 'neutral';
}

function EventChip({ event, active, linked, onSelect }) {
  const tone = getTone(event);

  return (
    <button
      type="button"
      className={[
        styles.event,
        styles[tone],
        active ? styles.active : '',
        linked ? styles.linked : '',
      ].join(' ')}
      onClick={() => onSelect(event.id)}
      onMouseEnter={() => onSelect(event.id)}
      aria-pressed={active}
    >
      <span className={styles.eventTime}>{event.time}</span>
      <span className={styles.eventLabel}>{event.label}</span>
      <span className={styles.eventShort}>{event.short}</span>
    </button>
  );
}

function DetailPanel({ event, linkedEvent }) {
  if (!event) {
    return (
      <aside className={styles.detailPanel}>
        <span className={styles.detailKicker}>Detalle</span>
        <p className={styles.emptyText}>Pasa el cursor por un evento para ver la evidencia documentada.</p>
      </aside>
    );
  }

  const tone = getTone(event);
  const laneLabel = event.lane === 'infra' ? 'Colapso físico' : 'Respuesta institucional';

  return (
    <aside className={[styles.detailPanel, styles[`${tone}Panel`]].join(' ')}>
      <div className={styles.detailHeader}>
        <span className={styles.detailKicker}>{laneLabel}</span>
        <strong>{event.time}</strong>
      </div>

      <h3>{event.label}</h3>
      <p>{event.detail}</p>

      {linkedEvent && (
        <div className={styles.linkBox}>
          <span>Relación causal</span>
          <strong>
            {linkedEvent.time} · {linkedEvent.label}
          </strong>
        </div>
      )}

      <div className={styles.source}>Fuente: {event.source}</div>
    </aside>
  );
}

export default function CrisisTimelineDual() {
  const [activeId, setActiveId] = useState(DEFAULT_ACTIVE_ID);

  const activeEvent = EVENTS.find((event) => event.id === activeId) || EVENTS[0];

  const linkedEvent = useMemo(() => {
    if (!activeEvent?.linkedTo) return null;
    return EVENTS.find((event) => event.id === activeEvent.linkedTo) || null;
  }, [activeEvent]);

  const grouped = useMemo(() => {
    return PHASES.map((phase) => ({
      ...phase,
      infra: EVENTS.filter((event) => event.phase === phase.key && event.lane === 'infra'),
      inst: EVENTS.filter((event) => event.phase === phase.key && event.lane === 'inst'),
    }));
  }, []);

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <p className={styles.kicker}>Impacto social · Cronología operativa</p>
        <div className={styles.headerGrid}>
          <h2>Fricción de la emergencia: colapso físico y respuesta institucional</h2>
          <p>
            La línea superior resume daños e interrupciones de infraestructura; la inferior,
            decisiones administrativas. La separación entre ambas revela la ventana de máxima
            vulnerabilidad social.
          </p>
        </div>
      </header>

      <section className={styles.mainGrid}>
        <div className={styles.timelineCard} aria-label="Cronología dual del apagón">
          <div className={styles.laneLabels}>
            <span className={styles.infraLabel}>Colapso físico</span>
            <span className={styles.instLabel}>Respuesta institucional</span>
          </div>

          <div className={styles.timelineScroller}>
            <div className={styles.timeline}>
              {grouped.map((phase) => (
                <div key={phase.key} className={styles.phase}>
                  <div className={styles.phaseTop}>
                    {phase.infra.map((event) => (
                      <EventChip
                        key={event.id}
                        event={event}
                        active={activeId === event.id}
                        linked={linkedEvent?.id === event.id}
                        onSelect={setActiveId}
                      />
                    ))}
                  </div>

                  <div className={styles.axis}>
                    <span className={styles.axisDot} />
                    <strong>{phase.label}</strong>
                    <small>{phase.span}</small>
                  </div>

                  <div className={styles.phaseBottom}>
                    {phase.inst.map((event) => (
                      <EventChip
                        key={event.id}
                        event={event}
                        active={activeId === event.id}
                        linked={linkedEvent?.id === event.id}
                        onSelect={setActiveId}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.legend}>
            <span><i className={styles.legendDanger} /> daño crítico</span>
            <span><i className={styles.legendWarning} /> respuesta tardía / impacto alto</span>
            <span><i className={styles.legendInfo} /> coordinación institucional</span>
            <span><i className={styles.legendLinked} /> evento relacionado</span>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <DetailPanel event={activeEvent} linkedEvent={linkedEvent} />

          <div className={styles.gapCallout}>
            <span>Brecha crítica</span>
            <p>
              Las alertas SMS portuguesas llegaron hacia las 17:15, cuando parte de la
              infraestructura móvil ya había agotado baterías. La vulnerabilidad máxima se
              concentró entre el cero de tensión y la restauración parcial de comunicaciones.
            </p>
          </div>
        </div>
      </section>

      <p className={styles.methodNote}>
        Nota metodológica: escala temporal aproximada; las órdenes ministeriales con fecha 28-A
        se sitúan en franja vespertina cuando el documento no fija hora exacta.
      </p>

      <figcaption className={styles.caption}>
        Figura X. Cronología dual de fricción entre colapso físico y respuesta institucional.
        Elaboración propia a partir de REE, ENTSO-E, ANEPC, BOE, ANACOM y documentación parlamentaria portuguesa.
      </figcaption>
    </figure>
  );
}