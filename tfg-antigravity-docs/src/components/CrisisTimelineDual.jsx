import React, { useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './CrisisTimelineDual.module.css';

/* ─── Paleta ─────────────────────────────────────────────────────────────── */
function getPalette(isDark) {
  return {
    bg:           isDark ? 'rgba(14,26,50,0.97)'    : 'rgba(255,252,245,0.97)',
    surface:      isDark ? 'rgba(20,36,64,0.92)'    : 'rgba(248,244,236,0.96)',
    surface2:     isDark ? 'rgba(10,20,42,0.80)'    : 'rgba(242,237,226,0.90)',
    border:       isDark ? 'rgba(190,209,230,0.18)' : 'rgba(58,49,35,0.14)',
    borderStrong: isDark ? 'rgba(190,209,230,0.32)' : 'rgba(58,49,35,0.26)',
    text1:        isDark ? '#f4f7fb'  : '#191814',
    text2:        isDark ? '#d6e0ee'  : '#3a3428',
    text3:        isDark ? '#aab9cc'  : '#6a5f52',
    spine:        isDark ? 'rgba(190,209,230,0.22)' : 'rgba(58,49,35,0.18)',
    main:         isDark ? '#83bdc2'  : '#145c63',
    mainSoft:     isDark ? 'rgba(131,189,194,0.15)' : 'rgba(20,92,99,0.09)',
    amber:        isDark ? '#d4a84e'  : '#8a6030',
    amberSoft:    isDark ? 'rgba(212,168,78,0.15)'  : 'rgba(138,96,48,0.09)',
    red:          isDark ? '#d86a64'  : '#8c2e2a',
    redSoft:      isDark ? 'rgba(216,106,100,0.15)' : 'rgba(140,46,42,0.08)',
    gap:          isDark ? 'rgba(216,106,100,0.08)' : 'rgba(140,46,42,0.05)',
  };
}

/* ─── Datos ──────────────────────────────────────────────────────────────── */
// side: 'infra' (izquierdo, colapso físico) | 'inst' (derecho, respuesta)
// minutesFromZero: minutos desde las 12:33 CEST (puede ser negativo para
//   eventos previos, aunque aquí todos son 0+)
// severity: 'critical' | 'high' | 'medium'
// linkedTo: id de evento del carril contrario con relación causal (opcional)

const EVENTS = [
  // ── CARRIL IZQUIERDO: colapso físico ─────────────────────────────────
  {
    id: 'cero',
    side: 'infra',
    time: '12:33',
    minutesFromZero: 0,
    severity: 'critical',
    label: 'Cero eléctrico',
    short: '15.000 MW perdidos en 5 s',
    detail: 'A las 12:33:21 CEST la red ibérica se separa de Francia. En menos de 5 segundos se pierden 15.000 MW. España, Portugal y Andorra quedan sin suministro.',
    fuente: 'REE / ENTSO-E',
    linkedTo: 'reunion_ccon',
  },
  {
    id: 'trenes',
    side: 'infra',
    time: '~12:33',
    minutesFromZero: 1,
    severity: 'critical',
    label: 'Red ferroviaria paralizada',
    short: '116 trenes detenidos · 35.000 pasajeros',
    detail: '116 trenes de Renfe, Ouigo e Iryo quedan inmovilizados en vía abierta. Sin catenaria, sin señalización ERTMS, sin comunicaciones. ~35.000 pasajeros atrapados.',
    fuente: 'Adif / Ministerio de Transportes',
    linkedTo: null,
  },
  {
    id: 'aeropuerto',
    side: 'infra',
    time: '~13:00',
    minutesFromZero: 27,
    severity: 'high',
    label: 'Lisboa: cierre perimetral',
    short: 'Terminal 2 cerrado · PSP desplegada',
    detail: 'Aeropuerto Humberto Delgado cierra el Terminal 2 y restringe el perímetro del T1. La PSP despliega cordones. 348 vuelos cancelados, ~66.000 pasajeros afectados en Lisboa.',
    fuente: 'ANA Aeroportos / ANAC Portugal',
    linkedTo: null,
  },
  {
    id: 'baterias_caida',
    side: 'infra',
    time: '14:30–16:30',
    minutesFromZero: 117,
    severity: 'critical',
    label: 'Colapso de telecomunicaciones',
    short: 'Baterías agotadas · >60% sin cobertura',
    detail: 'Las estaciones base móviles agotan sus baterías de respaldo (autonomía típica 2–4 h). Más del 60% de usuarios en zonas afectadas de Portugal pierden cobertura. El sistema de alertas queda paralizado.',
    fuente: 'ANACOM / Informes sectoriales',
    linkedTo: 'sms_tardio',
  },
  {
    id: 'victima_cacen',
    side: 'infra',
    time: '15:17',
    minutesFromZero: 164,
    severity: 'critical',
    label: 'Primera muerte verificada',
    short: 'Respirador agotado · Cacém, Portugal',
    detail: 'Una mujer de 77 años con ventilación mecánica domiciliaria fallece cuando la batería del respirador llega al 0%. El INEM no puede llegar a tiempo por colapso vial y telecomunicaciones.',
    fuente: 'IGAS / Auditoría parlamentaria Portugal',
    linkedTo: null,
  },
  {
    id: 'recuperacion_inicio',
    side: 'infra',
    time: '17:00',
    minutesFromZero: 267,
    severity: 'medium',
    label: 'Inicio de reposición',
    short: 'Primeras bolsas de carga en el norte',
    detail: 'Red Eléctrica inicia la reposición progresiva. Primeras zonas recuperadas: Cataluña, Aragón, País Vasco. A las 19:00 el 35% de la demanda nacional tiene suministro.',
    fuente: 'REE / Wikipedia apagón 2025',
    linkedTo: 'cese_emergencia',
  },

  // ── CARRIL DERECHO: respuesta institucional ───────────────────────────
  {
    id: 'prioridades_pt',
    side: 'inst',
    time: '13:15',
    minutesFromZero: 42,
    severity: 'medium',
    label: 'Portugal: prioridades ANEPC',
    short: 'Combustible hospitales · diálisis · respiratorios',
    detail: 'La ANEPC establece las prioridades: asegurar combustible para hospitales, centros de diálisis y pacientes respiratorios domiciliarios. Primera acción coordinada.',
    fuente: 'ANEPC / Documentos parlamentarios Portugal',
    linkedTo: null,
  },
  {
    id: 'reunion_ccon',
    side: 'inst',
    time: '13:30',
    minutesFromZero: 57,
    severity: 'medium',
    label: 'Reunión CCON · 29 entidades',
    short: 'Energía, telecom, agua, sanidad, FFAA',
    detail: 'El Centro de Coordenação Operacional Nacional convoca una reunión multidisciplinar con 29 entidades. La principal limitación detectada: falta de comunicaciones fiables para coordinar la respuesta.',
    fuente: 'ANEPC / Informe parlamentario',
    linkedTo: 'cero',
  },
  {
    id: 'orden_399',
    side: 'inst',
    time: 'Tarde',
    minutesFromZero: 210,
    severity: 'high',
    label: 'España: Emergencia Nacional',
    short: 'Orden INT/399/2025 — 5 CCAA',
    detail: 'El Ministerio del Interior declara la Emergencia de Interés Nacional en Andalucía, Extremadura, La Rioja, Madrid y Murcia (Orden INT/399/2025). La UME atiende a más de 7.000 personas.',
    fuente: 'BOE-A-2025-8486',
    linkedTo: null,
  },
  {
    id: 'orden_400',
    side: 'inst',
    time: 'Tarde',
    minutesFromZero: 240,
    severity: 'high',
    label: 'Ampliación a 8 CCAA',
    short: 'Orden INT/400/2025 — C.La Mancha, Galicia, C.V.',
    detail: 'Orden INT/400/2025 amplía la emergencia de interés nacional a Castilla-La Mancha, Galicia y la Comunitat Valenciana. El Gobierno central asume la dirección operativa integral.',
    fuente: 'BOE-A-2025-8487',
    linkedTo: null,
  },
  {
    id: 'sms_tardio',
    side: 'inst',
    time: '17:15',
    minutesFromZero: 282,
    severity: 'critical',
    label: '⚠ SMS de alerta — tarde',
    short: '~5 h de retraso · antenas ya agotadas',
    detail: 'Portugal inicia el envío de alertas SMS a ~11 millones de ciudadanos a las 17:15 — casi 5 horas después del cero eléctrico. Para entonces, gran parte de las estaciones base ya habían agotado sus baterías y los mensajes no llegaron.',
    fuente: 'ANEPC / Informe parlamentario',
    linkedTo: 'baterias_caida',
  },
  {
    id: 'crisis_energetica',
    side: 'inst',
    time: '20:30',
    minutesFromZero: 477,
    severity: 'high',
    label: 'Portugal: crisis energética',
    short: 'Declaración formal en Consejo de Ministros',
    detail: 'El Consejo de Ministros de Portugal declara formalmente la situación de crisis energética. Activación de la Red de Emergencia (REPA).',
    fuente: 'Documentos parlamentarios Portugal',
    linkedTo: null,
  },
  {
    id: 'cese_emergencia',
    side: 'inst',
    time: '29 abr',
    minutesFromZero: 1112,
    severity: 'medium',
    label: 'Cese de emergencia',
    short: 'Orden INT/409/2025 — 6 CCAA',
    detail: 'El Ministerio del Interior decreta el cese de la emergencia en 6 comunidades (Orden INT/409/2025). Madrid y Extremadura permanecen en emergencia hasta el 30 de abril.',
    fuente: 'BOE / Ministerio del Interior',
    linkedTo: 'recuperacion_inicio',
  },
];

/* ─── Escala temporal ────────────────────────────────────────────────────── */
// Mapea minutesFromZero a posición Y en porcentaje (0% = arriba, 100% = abajo)
const MIN_MIN = 0;
const MAX_MIN = 1200; // hasta 29 de abril ~18h después

function toPercent(minutes) {
  return Math.min(((minutes - MIN_MIN) / (MAX_MIN - MIN_MIN)) * 100, 100);
}

/* ─── Marcas de tiempo en la espina central ──────────────────────────────── */
const TIME_TICKS = [
  { label: '12:33', minutes: 0 },
  { label: '14:00', minutes: 87 },
  { label: '16:00', minutes: 207 },
  { label: '18:00', minutes: 327 },
  { label: '20:00', minutes: 447 },
  { label: '00:00', minutes: 687 },
  { label: '05:00', minutes: 987 },
  { label: '29 abr', minutes: 1110 },
];

/* ─── Sub-componente: evento ─────────────────────────────────────────────── */
function EventNode({ event, p, isActive, onClick }) {
  const isLeft = event.side === 'infra';
  const colorMap = {
    critical: event.side === 'infra' ? p.red   : p.amber,
    high:     event.side === 'infra' ? p.amber : p.main,
    medium:   p.main,
  };
  const softMap = {
    critical: event.side === 'infra' ? p.redSoft   : p.amberSoft,
    high:     event.side === 'infra' ? p.amberSoft : p.mainSoft,
    medium:   p.mainSoft,
  };
  const color = colorMap[event.severity];
  const soft  = softMap[event.severity];
  const top   = toPercent(event.minutesFromZero);

  return (
    <button
      className={`${styles.event} ${isLeft ? styles.eventLeft : styles.eventRight} ${isActive ? styles.eventActive : ''}`}
      style={{
        top: `${top}%`,
        borderColor: isActive ? color : p.border,
        background: isActive ? soft : p.surface,
        '--evt-color': color,
        '--evt-soft': soft,
      }}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={`${event.time}: ${event.label}`}
    >
      {/* Conector hacia la espina */}
      <span
        className={styles.connector}
        style={{ background: isActive ? color : p.spine }}
      />
      {/* Dot en la espina */}
      <span
        className={styles.dot}
        style={{
          background: isActive ? color : p.surface,
          borderColor: color,
          boxShadow: isActive ? `0 0 0 3px ${soft}` : 'none',
        }}
      />

      {/* Contenido */}
      <div className={styles.eventContent}>
        <span className={styles.eventTime} style={{ color }}>
          {event.time}
        </span>
        <span className={styles.eventLabel} style={{ color: p.text1 }}>
          {event.label}
        </span>
        <span className={styles.eventShort} style={{ color: p.text3 }}>
          {event.short}
        </span>
      </div>
    </button>
  );
}

/* ─── Panel de detalle ───────────────────────────────────────────────────── */
function DetailPanel({ event, p, allEvents }) {
  if (!event) {
    return (
      <div className={styles.detailEmpty}
        style={{ background: p.surface2, borderColor: p.border, color: p.text3 }}>
        <span className={styles.detailEmptyHint}>↑</span>
        Selecciona un evento para ver el detalle
      </div>
    );
  }

  const isLeft = event.side === 'infra';
  const colorMap = {
    critical: isLeft ? p.red   : p.amber,
    high:     isLeft ? p.amber : p.main,
    medium:   p.main,
  };
  const softMap = {
    critical: isLeft ? p.redSoft   : p.amberSoft,
    high:     isLeft ? p.amberSoft : p.mainSoft,
    medium:   p.mainSoft,
  };
  const color = colorMap[event.severity];
  const soft  = softMap[event.severity];

  // Evento vinculado
  const linked = event.linkedTo ? allEvents.find(e => e.id === event.linkedTo) : null;

  return (
    <div className={styles.detailPanel}
      style={{ background: p.surface, borderColor: color }}
      role="region" aria-label={`Detalle: ${event.label}`}
    >
      <div className={styles.detailHeader}>
        <span className={styles.detailTrack}
          style={{ background: soft, color }}>
          {isLeft ? 'COLAPSO FÍSICO' : 'RESPUESTA INSTITUCIONAL'}
        </span>
        <span className={styles.detailTime} style={{ color }}>
          {event.time}
        </span>
      </div>
      <div className={styles.detailTitle} style={{ color: p.text1 }}>
        {event.label}
      </div>
      <p className={styles.detailText} style={{ color: p.text2 }}>
        {event.detail}
      </p>
      {linked && (
        <div className={styles.detailLink}
          style={{ background: p.surface2, borderColor: p.border }}>
          <span className={styles.detailLinkIcon} style={{ color: p.amber }}>⇄</span>
          <span style={{ color: p.text3 }}>
            Relacionado con:{' '}
            <strong style={{ color: p.text2 }}>{linked.time} — {linked.label}</strong>
          </span>
        </div>
      )}
      <div className={styles.detailFuente} style={{ color: p.text3, borderTopColor: p.border }}>
        Fuente: {event.fuente}
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function CrisisTimelineDual() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const p = getPalette(isDark);
  const [activeId, setActiveId] = useState('sms_tardio'); // pre-seleccionar el más elocuente

  const activeEvent = EVENTS.find(e => e.id === activeId) || null;
  const toggle = id => setActiveId(prev => prev === id ? null : id);

  const infraEvents = EVENTS.filter(e => e.side === 'infra');
  const instEvents  = EVENTS.filter(e => e.side === 'inst');

  return (
    <figure className={styles.figure} style={{ background: p.bg, borderColor: p.border }}>

      {/* Header */}
      <div className={styles.header}>
        <span className={styles.kicker} style={{ color: p.main }}>
          Impacto social · Cronología operativa
        </span>
        <h3 className={styles.title} style={{ color: p.text1 }}>
          Fricción de la emergencia: colapso físico vs. respuesta institucional
        </h3>
        <p className={styles.subtitle} style={{ color: p.text3 }}>
          El carril izquierdo registra los fallos de infraestructura;
          el derecho, las respuestas institucionales. La brecha temporal entre ambos
          define la ventana de máxima vulnerabilidad.
        </p>
      </div>

      {/* Leyenda de carriles */}
      <div className={styles.trackLegend}>
        <div className={styles.trackBadge} style={{ background: p.redSoft, color: p.red }}>
          ← Colapso físico
        </div>
        <div className={styles.trackNote} style={{ color: p.text3 }}>
          Pulsa cualquier evento para ver detalle
        </div>
        <div className={styles.trackBadge} style={{ background: p.mainSoft, color: p.main }}>
          Respuesta institucional →
        </div>
      </div>

      {/* Cuerpo principal: timeline + detalle */}
      <div className={styles.body}>

        {/* Timeline dual */}
        <div className={styles.timelineWrapper}>
          <div
            className={styles.timeline}
            style={{ '--spine-color': p.spine }}
            aria-label="Línea temporal dual del apagón del 28-A"
          >
            {/* Espina central */}
            <div className={styles.spine} style={{ background: p.spine }} />

            {/* Marcas de tiempo */}
            {TIME_TICKS.map(({ label, minutes }) => (
              <div
                key={label}
                className={styles.tick}
                style={{ top: `${toPercent(minutes)}%`, color: p.text3 }}
              >
                <span className={styles.tickLine} style={{ background: p.spine }} />
                <span className={styles.tickLabel}>{label}</span>
              </div>
            ))}

            {/* Banda de gap — zona de brecha */}
            <div
              className={styles.gapBand}
              style={{
                top: `${toPercent(0)}%`,
                height: `${toPercent(282) - toPercent(0)}%`,
                background: p.gap,
              }}
              aria-label="Banda de brecha temporal entre colapso y alertas SMS"
            />

            {/* Eventos izquierda */}
            {infraEvents.map(ev => (
              <EventNode
                key={ev.id}
                event={ev}
                p={p}
                isActive={activeId === ev.id}
                onClick={() => toggle(ev.id)}
              />
            ))}

            {/* Eventos derecha */}
            {instEvents.map(ev => (
              <EventNode
                key={ev.id}
                event={ev}
                p={p}
                isActive={activeId === ev.id}
                onClick={() => toggle(ev.id)}
              />
            ))}
          </div>
        </div>

        {/* Panel de detalle */}
        <div className={styles.detailCol}>
          <DetailPanel event={activeEvent} p={p} allEvents={EVENTS} />

          {/* Callout de brecha */}
          <div className={styles.gapCallout}
            style={{ background: p.redSoft, borderColor: `rgba(140,46,42,0.22)` }}>
            <span className={styles.gapCalloutIcon} style={{ color: p.red }}>⚠</span>
            <p className={styles.gapCalloutText} style={{ color: p.text2 }}>
              <strong style={{ color: p.red }}>Brecha de ~5 horas.</strong>{' '}
              Las alertas SMS de Portugal se enviaron a las 17:15,
              cuando las baterías de las antenas ya estaban agotadas.
              La ventana de máxima vulnerabilidad fue entre las 12:33 y las 17:00.
            </p>
          </div>
        </div>
      </div>

      {/* Nota metodológica */}
      <p className={styles.methodNote} style={{ color: p.text3, borderTopColor: p.border }}>
        <strong style={{ color: p.amber }}>Nota:</strong>{' '}
        Escala temporal aproximada. Las órdenes ministeriales INT/399 y INT/400
        constan en el BOE con fecha 28 de abril sin hora exacta de firma —
        se ubican en franja vespertina. El agotamiento de baterías de telecomunicaciones
        es una inferencia técnica basada en autonomía nominal de 2–4 horas.
      </p>

    </figure>
  );
}
