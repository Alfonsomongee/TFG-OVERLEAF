/**
 * Bloque6Cronologia.jsx
 * Cronología de reposición del suministro (28-A → 29-A).
 */
import React, { useMemo } from 'react';
import styles from './Bloque6Cronologia.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

function ShieldIcon({ color = '#E24B4A' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function WarningIcon({ color = '#EF9F27' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CheckIcon({ color = '#1D9E75' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={color} strokeWidth="2" strokeLinecap="round"
         strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function StatusIcon({ color }) {
  if (color === '#E24B4A') return <ShieldIcon color={color} />;
  if (color === '#EF9F27') return <WarningIcon color={color} />;
  return <CheckIcon color={color} />;
}

const STRINGS = {
  es: {
    ariaLabel: 'Cronología de reposición del suministro eléctrico del 28-A',
    title: 'Cronología de reposición',
    subtitle: '28–29 de abril de 2025 · Desde cero eléctrico (12:33 CEST) hasta recuperación total (07:00 CEST, 29 abr)',
    statusBadge: 'Sistema Sincronizado',
    section1Title: 'Eventos de recuperación del suministro',
    demandLabel: 'Demanda recuperada',
    section2Title: 'Plantas de arranque autónomo (Black Start)',
    section2Sub: 'Centrales críticas que permitieron reconstruir el sistema desde cero. Sin estas dos plantas, la reposición habría requerido horas adicionales de importación sostenida desde Francia.',
    tech: 'TECNOLOGÍA',
    operator: 'OPERADOR',
    location: 'LOCALIZACIÓN',
    keyFact: 'Dato clave',
    footer: 'Fuente: ENTSO-E Factual Report (oct. 2025), pp.12-13 · ENTSO-E Final Report (mar. 2026) · REE Operación (29/04/2025) · REN Portugal · ANEPC (comisión parlamentaria)',
    timeline: [
      { date: '28 abr', title: 'Cero eléctrico confirmado', desc: 'Tensión 400 kV < 1 kV. ~25,2 GW de demanda peninsular española interrumpidos. ~57 millones de personas sin suministro.' },
      { date: '28 abr', title: 'Solicitud black-start a EDP Portugal', desc: 'Arranque autónomo en Castelo do Bode (hidroeléctrica, 138 MW, cuenca del Zêzere). REN cursó la orden en ~2 min.' },
      { date: '28 abr', title: 'Primera reenergización: Hernani (País Vasco)', desc: 'Arteria 400 kV desde Francia. Importación confirmada: ~31 MW en Irún. Primera isla eléctrica viable en España.' },
      { date: '28 abr', title: 'Castelo do Bode conectado a barra 220 kV REN', desc: 'Arranque exitoso en ~10 min. Primera isla eléctrica de Portugal creada. Coste del servicio de black-start: ~240.000 €/año.' },
      { date: '28 abr', title: 'Línea Baixàs–Vic (400 kV) sincronizada', desc: 'Segunda arteria desde Francia (litoral mediterráneo). Expansión hacia Cataluña y litoral este.' },
      { date: '28 abr', title: 'Primera sincronización España–Portugal (Aldeadávila–Pocinho)', desc: 'Línea 220 kV. Portugal se conecta a la frecuencia europea continental. Esquemas Black Start BS-Duero activados desde ~16:00 CEST.' },
      { date: '28 abr', title: '51% de la demanda peninsular recuperada', desc: '12.847 MW activos. 70% de subestaciones de transporte energizadas. Hospitales operando con normalidad.' },
      { date: '29 abr', title: 'Red de transporte de Portugal 100% restaurada', desc: 'REN confirma reposición total de la red de alta tensión. Duración total para Portugal: ~12 horas.' },
      { date: '29 abr', title: 'Red de transporte de España 100% restaurada', desc: 'REE confirma reposición total de la red de transporte española. Tiempo acumulado desde cero: ~15,5 horas.' },
      { date: '29 abr', title: 'Reposición prácticamente completa (99,95%)', desc: 'Solo pequeñas zonas rurales aisladas continúan sin cobertura. Sistema completamente estable. Fin operativo del incidente.' },
    ],
    blackstart: [
      { country: 'portugal', tech: 'Hidroeléctrica · 138 MW', loc: 'Cuenca del Zêzere, Portugal', detail: 'Arranque en ~10 min · Coste black-start: ~240.000 €/año · Capacidad extendida a 2030' },
      { country: 'spain', tech: 'Hidroeléctrica reversible · ~1.100 MW', loc: 'Cuenca del Duero, Salamanca', detail: 'Esquema BS-Duero 1 activado ~16:00 CEST · Turbina + modo bomba' },
    ]
  },
  en: {
    ariaLabel: 'Restoration timeline of electricity supply on April 28',
    title: 'Restoration Timeline',
    subtitle: 'April 28–29, 2025 · From electrical zero (12:33 CEST) to full recovery (07:00 CEST, Apr 29)',
    statusBadge: 'System Synchronized',
    section1Title: 'Supply recovery events',
    demandLabel: 'Recovered demand',
    section2Title: 'Autonomous startup plants (Black Start)',
    section2Sub: 'Critical plants that allowed rebuilding the system from scratch. Without these two plants, restoration would have required additional hours of sustained import from France.',
    tech: 'TECHNOLOGY',
    operator: 'OPERATOR',
    location: 'LOCATION',
    keyFact: 'Key fact',
    footer: 'Source: ENTSO-E Factual Report (Oct 2025), pp.12-13 · ENTSO-E Final Report (Mar 2026) · REE Operation (29/04/2025) · REN Portugal · ANEPC (parliamentary commission)',
    timeline: [
      { date: 'Apr 28', title: 'Electrical zero confirmed', desc: '400 kV voltage < 1 kV. ~25.2 GW of Spanish peninsular demand interrupted. ~57 million people without supply.' },
      { date: 'Apr 28', title: 'Black-start request to EDP Portugal', desc: 'Autonomous startup in Castelo do Bode (hydroelectric, 138 MW, Zêzere basin). REN issued the order in ~2 min.' },
      { date: 'Apr 28', title: 'First re-energization: Hernani (Basque Country)', desc: '400 kV artery from France. Import confirmed: ~31 MW in Irún. First viable electrical island in Spain.' },
      { date: 'Apr 28', title: 'Castelo do Bode connected to REN 220 kV busbar', desc: 'Successful startup in ~10 min. First electrical island in Portugal created. Black-start service cost: ~240,000 €/year.' },
      { date: 'Apr 28', title: 'Baixàs–Vic line (400 kV) synchronized', desc: 'Second artery from France (Mediterranean coast). Expansion towards Catalonia and eastern coast.' },
      { date: 'Apr 28', title: 'First Spain–Portugal synchronization (Aldeadávila–Pocinho)', desc: '220 kV line. Portugal connects to continental European frequency. Black Start BS-Duero schemes activated since ~16:00 CEST.' },
      { date: 'Apr 28', title: '51% of peninsular demand recovered', desc: '12,847 active MW. 70% of transmission substations energized. Hospitals operating normally.' },
      { date: 'Apr 29', title: 'Portugal transmission grid 100% restored', desc: 'REN confirms total restoration of the high voltage grid. Total duration for Portugal: ~12 hours.' },
      { date: 'Apr 29', title: 'Spain transmission grid 100% restored', desc: 'REE confirms total restoration of the Spanish transmission grid. Accumulated time from zero: ~15.5 hours.' },
      { date: 'Apr 29', title: 'Practically complete restoration (99.95%)', desc: 'Only small isolated rural areas remain without coverage. System completely stable. Operational end of incident.' },
    ],
    blackstart: [
      { country: 'portugal', tech: 'Hydroelectric · 138 MW', loc: 'Zêzere basin, Portugal', detail: 'Startup in ~10 min · Black-start cost: ~240,000 €/year · Capacity extended to 2030' },
      { country: 'spain', tech: 'Reversible hydroelectric · ~1,100 MW', loc: 'Duero basin, Salamanca', detail: 'BS-Duero 1 scheme activated ~16:00 CEST · Turbine + pump mode' },
    ]
  },
  de: {
    ariaLabel: 'Zeitplan der Wiederherstellung der Stromversorgung am 28. April',
    title: 'Wiederherstellungszeitplan',
    subtitle: '28.–29. April 2025 · Vom elektrischen Nullpunkt (12:33 CEST) bis zur vollständigen Wiederherstellung (07:00 CEST, 29. Apr)',
    statusBadge: 'System synchronisiert',
    section1Title: 'Ereignisse der Versorgungs-Wiederherstellung',
    demandLabel: 'Wiederhergestellte Nachfrage',
    section2Title: 'Schwarzstartfähige Anlagen (Black Start)',
    section2Sub: 'Kritische Anlagen, die den Wiederaufbau des Systems von Grund auf ermöglichten. Ohne diese beiden Anlagen hätte die Wiederherstellung zusätzliche Stunden dauerhaften Imports aus Frankreich erfordert.',
    tech: 'TECHNOLOGIE',
    operator: 'BETREIBER',
    location: 'STANDORT',
    keyFact: 'Fakt',
    footer: 'Quelle: ENTSO-E Factual Report (Okt 2025), S.12-13 · ENTSO-E Final Report (Mär 2026) · REE Operation (29/04/2025) · REN Portugal · ANEPC (Parlamentsausschuss)',
    timeline: [
      { date: '28 Apr', title: 'Elektrischer Nullpunkt bestätigt', desc: '400 kV Spannung < 1 kV. ~25,2 GW spanische Festlandnachfrage unterbrochen. ~57 Millionen Menschen ohne Versorgung.' },
      { date: '28 Apr', title: 'Schwarzstart-Anforderung an EDP Portugal', desc: 'Autonomer Start in Castelo do Bode (Wasserkraft, 138 MW, Zêzere-Becken). REN erteilte den Befehl in ~2 Min.' },
      { date: '28 Apr', title: 'Erste Re-Energetisierung: Hernani (Baskenland)', desc: '400-kV-Ader aus Frankreich. Import bestätigt: ~31 MW in Irún. Erste lebensfähige Strominsel in Spanien.' },
      { date: '28 Apr', title: 'Castelo do Bode an REN 220 kV-Sammelschiene angeschlossen', desc: 'Erfolgreicher Start in ~10 Min. Erste Strominsel in Portugal geschaffen. Kosten des Schwarzstartdienstes: ~240.000 €/Jahr.' },
      { date: '28 Apr', title: 'Leitung Baixàs–Vic (400 kV) synchronisiert', desc: 'Zweite Ader aus Frankreich (Mittelmeerküste). Ausweitung nach Katalonien und an die Ostküste.' },
      { date: '28 Apr', title: 'Erste Synchronisation Spanien–Portugal (Aldeadávila–Pocinho)', desc: '220-kV-Leitung. Portugal verbindet sich mit der kontinentaleuropäischen Frequenz. Black-Start-Schemata BS-Duero ab ~16:00 CEST aktiviert.' },
      { date: '28 Apr', title: '51% der Festlandnachfrage wiederhergestellt', desc: '12.847 aktive MW. 70% der Übertragungs-Umspannwerke unter Spannung. Krankenhäuser arbeiten normal.' },
      { date: '29 Apr', title: 'Übertragungsnetz von Portugal 100% wiederhergestellt', desc: 'REN bestätigt vollständige Wiederherstellung des Hochspannungsnetzes. Gesamtdauer für Portugal: ~12 Stunden.' },
      { date: '29 Apr', title: 'Übertragungsnetz von Spanien 100% wiederhergestellt', desc: 'REE bestätigt vollständige Wiederherstellung des spanischen Übertragungsnetzes. Kumulierte Zeit ab Nullpunkt: ~15,5 Stunden.' },
      { date: '29 Apr', title: 'Praktisch vollständige Wiederherstellung (99,95%)', desc: 'Nur kleine isolierte ländliche Gebiete bleiben unversorgt. System vollkommen stabil. Operatives Ende des Vorfalls.' },
    ],
    blackstart: [
      { country: 'portugal', tech: 'Wasserkraft · 138 MW', loc: 'Zêzere-Becken, Portugal', detail: 'Start in ~10 Min · Schwarzstart-Kosten: ~240.000 €/Jahr · Kapazität bis 2030 verlängert' },
      { country: 'spanien', tech: 'Pumpspeicherkraftwerk · ~1.100 MW', loc: 'Duero-Becken, Salamanca', detail: 'Schema BS-Duero 1 aktiviert ~16:00 CEST · Turbinen- + Pumpenmodus' },
    ]
  }
};

const BASE_TIMELINE = [
  { time: '12:33 CEST', color: '#E24B4A', demand: 0, source: 'Comité de Análisis, p.38 / ENTSO-E Final Report' },
  { time: '12:35 CEST', color: '#EF9F27', demand: 0, source: 'REN Portugal / ANEPC' },
  { time: '12:43 CEST', color: '#EF9F27', demand: 1, source: 'REE Operación / ENTSO-E Factual, p.12' },
  { time: '12:45 CEST', color: '#1D9E75', demand: 0.5, source: 'REN Portugal / ANEPC (comisión parlamentaria)' },
  { time: '13:35 CEST', color: '#EF9F27', demand: 4, source: 'REE Operación' },
  { time: '18:36 CEST', color: '#1D9E75', demand: 30, source: 'REE Operación / ENTSO-E Factual, p.13' },
  { time: '23:00 CEST', color: '#1D9E75', demand: 51, source: 'REE Operación' },
  { time: '00:22 CEST', color: '#1D9E75', demand: 65, source: 'ENTSO-E Factual, pp.12-13 / REN' },
  { time: '04:00 CEST', color: '#1D9E75', demand: 80, source: 'ENTSO-E Factual, pp.12-13 / REE' },
  { time: '07:00 CEST', color: '#1D9E75', demand: 99.95, source: 'ENTSO-E Factual, pp.12-13' },
];

const BASE_BLACKSTART = [
  { flagEmoji: '🇵🇹', name: 'Castelo do Bode', operator: 'EDP', color: '#1D9E75' },
  { flagEmoji: '🇪🇸', name: 'Aldeadávila', operator: 'Iberdrola', color: '#E24B4A' },
];

function getDemandGradient(demand) {
  if (demand === 0)   return 'linear-gradient(to right, #E24B4A, #F27170)';
  if (demand >= 99)   return 'linear-gradient(to right, #1D9E75, #32D8A7)';
  if (demand <= 50) {
    const r = demand / 50;
    return `linear-gradient(to right,
      rgb(${Math.round(226 + (239-226)*r)}, ${Math.round(75+(159-75)*r)}, ${Math.round(74+(39-74)*r)}),
      rgb(${Math.round(242 + (251-242)*r)}, ${Math.round(113+(192-113)*r)}, ${Math.round(112+(85-112)*r)}))`;
  }
  const r = (demand - 50) / 50;
  return `linear-gradient(to right,
    rgb(${Math.round(239+(29-239)*r)}, ${Math.round(159+(158-159)*r)}, ${Math.round(39+(117-39)*r)}),
    rgb(${Math.round(251+(50-251)*r)}, ${Math.round(192+(216-192)*r)}, ${Math.round(85+(170-85)*r)}))`;
}

function TimelineCard({ event, index, s }) {
  const gradient = useMemo(() => getDemandGradient(event.demand), [event.demand]);
  return (
    <div
      className={`${styles.timelineCardWrapper} ${styles.fadeInUp}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={styles.timelineCard} style={{ borderLeftColor: event.color }}>
        <div className={styles.timelineTimeCol}>
          <div className={styles.timelineTimeLabel}>
            <StatusIcon color={event.color} />
            <span className={styles.timelineTimeText}>{event.time}</span>
          </div>
          <div className={styles.timelineDateText}>{event.date}</div>
        </div>

        <div className={styles.timelineContentCol}>
          <h3 className={styles.timelineContentTitle}>{event.title}</h3>
          <p className={styles.timelineContentDesc}>{event.description}</p>
          <p style={{ fontSize: 9, color: '#374151', fontFamily: 'monospace', margin: '4px 0 0' }}>
            📋 {event.source}
          </p>
        </div>

        <div className={styles.timelineDemandCol}>
          <div className={styles.timelineDemandValue}>
            {event.demand.toFixed(1)}%
          </div>
          <div className={styles.timelineDemandLabel}>{s.demandLabel}</div>
          <div className={styles.timelineDemandBarBg}>
            <div
              className={styles.timelineDemandBarFill}
              style={{ width: `${event.demand}%`, background: gradient }}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.timelineCircle}
        style={{ backgroundColor: event.color, boxShadow: `0 0 12px ${event.color}80` }}
      />
    </div>
  );
}

function BlackStartCard({ card, index, s }) {
  return (
    <div
      className={`${styles.blackstartCard} ${styles.fadeInUp}`}
      style={{ borderLeftColor: card.color, animationDelay: `${900 + index * 80}ms` }}
    >
      <div className={styles.blackstartHeader}>
        <div className={styles.blackstartEmoji}>{card.flagEmoji}</div>
        <div>
          <div className={styles.blackstartName}>{card.name}</div>
          <div className={styles.blackstartFlag}>{card.country.toUpperCase()}</div>
        </div>
      </div>
      <div className={styles.blackstartList}>
        {[
          { label: s.tech,   value: card.technology },
          { label: s.operator,     value: card.operator },
          { label: s.location, value: card.location },
        ].map((item, i) => (
          <div key={i} className={styles.blackstartItem}>
            <span className={styles.blackstartItemLabel}>{item.label}</span>
            <span className={styles.blackstartItemValue}>{item.value}</span>
          </div>
        ))}
        <div className={styles.blackstartDetail}>
          <div className={styles.blackstartItemLabel} style={{ marginBottom: 8 }}>{s.keyFact}</div>
          <span className={styles.blackstartItemValue}>{card.detail}</span>
        </div>
      </div>
    </div>
  );
}

export default function Bloque6Cronologia() {
  const lang = useDocLang();
  const s = STRINGS[lang] || STRINGS.es;

  const TIMELINE_DATA = BASE_TIMELINE.map((item, i) => ({
    ...item,
    date: s.timeline[i].date,
    title: s.timeline[i].title,
    description: s.timeline[i].desc,
  }));

  const BLACKSTART_DATA = BASE_BLACKSTART.map((item, i) => ({
    ...item,
    country: s.blackstart[i].country,
    technology: s.blackstart[i].tech,
    location: s.blackstart[i].loc,
    detail: s.blackstart[i].detail,
  }));

  return (
    <div className={styles.container} aria-label={s.ariaLabel}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{s.title}</h1>
          <p className={styles.subtitle}>{s.subtitle}</p>
        </div>
        <div className={styles.statusBadge}>
          <CheckIcon color="#1D9E75" />
          <span className={styles.statusBadgeText}>{s.statusBadge}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLine} />
          <h2 className={styles.sectionTitle}>{s.section1Title}</h2>
        </div>
        {TIMELINE_DATA.map((event, i) => (
          <TimelineCard key={i} event={event} index={i} s={s} />
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.header} style={{ marginBottom: 32 }}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--ifm-heading-color)' }}>
            {s.section2Title}
          </h2>
          <p className={styles.subtitle} style={{ marginTop: 8 }}>
            {s.section2Sub}
          </p>
        </div>
        <div className={styles.blackstartGrid}>
          {BLACKSTART_DATA.map((card, i) => (
            <BlackStartCard key={i} card={card} index={i} s={s} />
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
