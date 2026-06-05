/**
 * Bloque3Cascada.jsx
 * Cronología interactiva de la cascada de 30 segundos.
 */
import React, { useState } from 'react';
import styles from './Bloque3Cascada.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

const STRINGS = {
  es: {
    header: 'DESARROLLO DE LA CASCADA (30 SEGUNDOS · 12:32:57–12:33:27 CEST)',
    ariaGroup: 'Eventos de la cascada',
    ariaMarker: (title, t) => `${title} — t=${t}s`,
    openNoteLabel: 'Cuestión abierta: ',
    powerLabelDem: 'Demanda peninsular española interrumpida:',
    powerLabelLost: 'Pérdida acumulada verificada:',
    btnPrev: '← ANTERIOR',
    btnNext: 'SIGUIENTE →',
    ariaPrev: 'Evento anterior',
    ariaNext: 'Evento siguiente',
    footer: 'Cronología verificada: ENTSO-E Factual Report (oct. 2025), ENTSO-E Final Report (mar. 2026), Comité de Análisis del Gobierno (jun. 2025), REE Informe de Incidente. Timestamps con resolución de milisegundos extraídos de registros WAMS/PMU.',
    events: [
      {
        title: 'G-1 · Disparo transformador 400/220 kV — Granada',
        detail: 'Primer disparo de la cascada. Transformador de evacuación de planta solar. Potencia perdida: −355 MW activos, −165 MVAr de absorción reactiva. Tensión en colector 220 kV: ~242 kV (>1,10 p.u.), invisible para el SCADA de REE por efecto Tap-Lag. Protección ANSI 59 actuó correctamente según su configuración.',
      },
      {
        title: 'G-2 · Desconexión Badajoz (CSP + FV)',
        detail: 'Central termosolar + parque fotovoltaico adyacente. Tensión en 400 kV: 432,4 kV (rozando límite P.O. 1.1 de 435 kV). Potencia perdida: −730 MW acumulado (incluyendo pérdidas previas en zona). Disparo por sobretensión ANSI 59.',
      },
      {
        title: 'G-3 · Cascada Sevilla / Huelva / Cáceres / Segovia / Badajoz (2ª oleada)',
        detail: 'Ventana crítica: ~650 ms. Desconexiones en cadena de eólica y FV en 5 provincias. Detalle verificado: Sevilla −550 MW + Badajoz acumulado −730 MW + otras instalaciones de Huelva, Cáceres y Segovia. Potencia total acumulada: −1.635 MW (Granada + Badajoz + Sevilla). Fuente: Comité de Análisis, p.38.',
      },
      {
        title: 'Aislamiento de Iberia — Trip AC Francia–España (ANSI 78)',
        detail: 'Las protecciones de pérdida de sincronismo (ANSI 78) abren las líneas de interconexión AC con Francia (Baixas-Vic, Argia-Arkale, Argia-Hernani). Frecuencia en ese instante: 48,46 Hz. La Península Ibérica queda aislada del sistema síncrono continental europeo. El pico transitorio de importación AC fue de ~3.800 MW de potencia activa (ENTSO-E Factual, pp.108-109). ⚠ Nota: el dato de 4.609 MVAr de reactiva que aparece en algunos textos no está verificado en fuente primaria y debe tratarse como estimación.',
        openNote: 'El pico de reactiva en frontera AC (4.609 MVAr) no está verificado en fuente primaria. Lo verificado es el pico de potencia activa: ~3.800 MW.',
      },
      {
        title: 'Nadir de frecuencia — 47,79 Hz',
        detail: 'Mínimo de frecuencia registrado, ~1,1 s después de la pérdida de sincronismo (que ocurrió a 48,46 Hz @ 12:33:21). Por debajo de 47,5 Hz actúan protecciones UFLS finales. Disparo de grupos generadores por sobreexcitación (protección V/Hz). Trip del enlace HVDC INELFE-1 a las 12:33:24 CEST. Iberia pierde la última conexión externa.',
      },
      {
        title: 'Cero eléctrico — Colapso total',
        detail: 'Tensión en 400 kV cae a cero. Demanda peninsular española interrumpida: 25,2 GW (Comité de Análisis, p.38). Afectados: ~57 millones de personas (España peninsular + Portugal continental + Andorra). El mayor apagón del sistema eléctrico europeo continental en más de 20 años. Es el primer colapso por sobretensión documentado en el Área Síncrona de Europa Continental.',
      }
    ]
  },
  en: {
    header: 'CASCADE DEVELOPMENT (30 SECONDS · 12:32:57–12:33:27 CEST)',
    ariaGroup: 'Cascade events',
    ariaMarker: (title, t) => `${title} — t=${t}s`,
    openNoteLabel: 'Open issue: ',
    powerLabelDem: 'Peninsular Spanish demand interrupted:',
    powerLabelLost: 'Verified accumulated loss:',
    btnPrev: '← PREVIOUS',
    btnNext: 'NEXT →',
    ariaPrev: 'Previous event',
    ariaNext: 'Next event',
    footer: 'Verified timeline: ENTSO-E Factual Report (Oct 2025), ENTSO-E Final Report (Mar 2026), Government Analysis Committee (Jun 2025), REE Incident Report. Timestamps with millisecond resolution extracted from WAMS/PMU records.',
    events: [
      {
        title: 'G-1 · 400/220 kV transformer trip — Granada',
        detail: 'First trip of the cascade. Solar plant evacuation transformer. Power lost: −355 MW active, −165 MVAr reactive absorption. 220 kV collector voltage: ~242 kV (>1.10 p.u.), invisible to REE SCADA due to Tap-Lag effect. ANSI 59 protection acted correctly according to its settings.',
      },
      {
        title: 'G-2 · Badajoz disconnection (CSP + PV)',
        detail: 'Concentrated solar power plant + adjacent PV park. 400 kV voltage: 432.4 kV (approaching P.O. 1.1 limit of 435 kV). Power lost: −730 MW accumulated (including previous losses in the area). Overvoltage trip ANSI 59.',
      },
      {
        title: 'G-3 · Sevilla / Huelva / Cáceres / Segovia / Badajoz cascade (2nd wave)',
        detail: 'Critical window: ~650 ms. Chain disconnections of wind and PV in 5 provinces. Verified detail: Sevilla −550 MW + Badajoz accumulated −730 MW + other facilities in Huelva, Cáceres and Segovia. Total accumulated power: −1,635 MW (Granada + Badajoz + Sevilla). Source: Analysis Committee, p.38.',
      },
      {
        title: 'Iberian isolation — France–Spain AC trip (ANSI 78)',
        detail: 'Loss of synchronism protections (ANSI 78) open the AC interconnection lines with France (Baixas-Vic, Argia-Arkale, Argia-Hernani). Frequency at that instant: 48.46 Hz. The Iberian Peninsula becomes isolated from the continental European synchronous system. The transient AC import peak was ~3,800 MW active power (ENTSO-E Factual, pp.108-109). ⚠ Note: the 4,609 MVAr reactive power figure appearing in some texts is not verified in primary sources and should be treated as an estimate.',
        openNote: 'The reactive peak at the AC border (4,609 MVAr) is not verified in the primary source. The verified value is the active power peak: ~3,800 MW.',
      },
      {
        title: 'Frequency nadir — 47.79 Hz',
        detail: 'Minimum recorded frequency, ~1.1 s after the loss of synchronism (which occurred at 48.46 Hz @ 12:33:21). Below 47.5 Hz, final UFLS protections act. Generator trips due to overexcitation (V/Hz protection). Trip of the INELFE-1 HVDC link at 12:33:24 CEST. Iberia loses its last external connection.',
      },
      {
        title: 'Electrical zero — Total collapse',
        detail: '400 kV voltage drops to zero. Spanish peninsular demand interrupted: 25.2 GW (Analysis Committee, p.38). Affected: ~57 million people (Peninsular Spain + continental Portugal + Andorra). The largest blackout in the continental European electricity system in more than 20 years. It is the first documented overvoltage collapse in the Continental Europe Synchronous Area.',
      }
    ]
  },
  de: {
    header: 'KASKADENENTWICKLUNG (30 SEKUNDEN · 12:32:57–12:33:27 CEST)',
    ariaGroup: 'Kaskadenereignisse',
    ariaMarker: (title, t) => `${title} — t=${t}s`,
    openNoteLabel: 'Offener Punkt: ',
    powerLabelDem: 'Spanische Festlandnachfrage unterbrochen:',
    powerLabelLost: 'Verifizierter kumulierter Verlust:',
    btnPrev: '← ZURÜCK',
    btnNext: 'WEITER →',
    ariaPrev: 'Vorheriges Ereignis',
    ariaNext: 'Nächstes Ereignis',
    footer: 'Verifizierte Zeitleiste: ENTSO-E Factual Report (Okt 2025), ENTSO-E Final Report (Mär 2026), Analysekomitee der Regierung (Jun 2025), REE-Vorfallbericht. Zeitstempel mit Millisekundenauflösung aus WAMS/PMU-Aufzeichnungen extrahiert.',
    events: [
      {
        title: 'G-1 · Ausfall Transformator 400/220 kV — Granada',
        detail: 'Erste Auslösung der Kaskade. Einspeisetransformator der Solaranlage. Leistungsverlust: −355 MW aktiv, −165 MVAr reaktive Absorption. Spannung am 220-kV-Kollektor: ~242 kV (>1,10 p.u.), für das REE-SCADA wegen Tap-Lag-Effekt unsichtbar. ANSI 59 Schutzschalter reagierte vorschriftsmäßig.',
      },
      {
        title: 'G-2 · Trennung Badajoz (CSP + PV)',
        detail: 'Solarthermisches Kraftwerk + angrenzender Solarpark. Spannung in 400 kV: 432,4 kV (nahe dem P.O. 1.1 Limit von 435 kV). Leistungsverlust: −730 MW kumuliert (inkl. vorherige Verluste im Bereich). Überspannungsauslösung ANSI 59.',
      },
      {
        title: 'G-3 · Kaskade Sevilla / Huelva / Cáceres / Segovia / Badajoz (2. Welle)',
        detail: 'Kritisches Zeitfenster: ~650 ms. Kettenabschaltungen von Wind und Photovoltaik in 5 Provinzen. Verifiziertes Detail: Sevilla −550 MW + Badajoz kumuliert −730 MW + weitere Anlagen in Huelva, Cáceres und Segovia. Kumulierte Gesamtleistung: −1.635 MW (Granada + Badajoz + Sevilla). Quelle: Analysekomitee, S.38.',
      },
      {
        title: 'Isolierung der iberischen Halbinsel — Trip AC Frankreich–Spanien (ANSI 78)',
        detail: 'Der Synchronisationsverlust-Schutz (ANSI 78) öffnet die AC-Verbindungsleitungen nach Frankreich (Baixas-Vic, Argia-Arkale, Argia-Hernani). Frequenz zu diesem Zeitpunkt: 48,46 Hz. Die iberische Halbinsel wird vom kontinentaleuropäischen Synchronsystem isoliert. Die vorübergehende AC-Importspitze betrug ~3.800 MW Wirkleistung (ENTSO-E Factual, S.108-109). ⚠ Hinweis: Der in einigen Texten genannte Wert von 4.609 MVAr Blindleistung ist in primären Quellen nicht belegt und als Schätzung zu behandeln.',
        openNote: 'Die Blindleistungsspitze an der AC-Grenze (4.609 MVAr) ist in der Primärquelle nicht verifiziert. Verifiziert ist die Wirkleistungsspitze: ~3.800 MW.',
      },
      {
        title: 'Frequenznadir — 47,79 Hz',
        detail: 'Minimal registrierte Frequenz, ~1,1 s nach dem Synchronisationsverlust (bei 48,46 Hz @ 12:33:21). Unter 47,5 Hz greifen letzte UFLS-Schutzmaßnahmen. Generatorenausfall durch Übererregung (V/Hz-Schutz). Abschaltung der HGÜ-Verbindung INELFE-1 um 12:33:24 CEST. Die iberische Halbinsel verliert die letzte externe Verbindung.',
      },
      {
        title: 'Elektrischer Nullpunkt — Totalausfall',
        detail: 'Die 400-kV-Spannung fällt auf Null. Unterbrochene spanische Festlandnachfrage: 25,2 GW (Analysekomitee, S.38). Betroffen: ~57 Millionen Menschen (spanisches Festland + kontinentales Portugal + Andorra). Der größte Stromausfall im kontinentaleuropäischen Stromnetz seit über 20 Jahren. Dies ist der erste dokumentierte Überspannungskollaps im Synchroneuropäischen Gebiet.',
      }
    ]
  }
};

const BASE_EVENTS = [
  { id: 'e1', timestamp: 0.0, timeISO: '12:32:57.120', color: 'var(--timeline-amber)', mwLost: 355, mwAccum: 355, source: 'ENTSO-E Factual, p.28', verified: true },
  { id: 'e2', timestamp: 19.34, timeISO: '12:33:16.460', color: 'var(--timeline-red)', mwLost: 730, mwAccum: 1082, source: 'Comité de Análisis, p.38 / REE, p.5', verified: true },
  { id: 'e3', timestamp: 20.56, timeISO: '12:33:17–12:33:18 CEST', color: 'var(--timeline-red)', mwLost: 553, mwAccum: 1635, source: 'Comité de Análisis, p.38', verified: true },
  { id: 'e4', timestamp: 23.53, timeISO: '12:33:21.535', color: 'var(--timeline-blue)', mwLost: 0, mwAccum: 1635, source: 'ENTSO-E Factual, pp.108-109', verified: true },
  { id: 'e5', timestamp: 25.88, timeISO: '12:33:23–12:33:24 CEST', color: 'var(--timeline-purple)', mwLost: 0, mwAccum: 1635, source: 'ENTSO-E Factual, pp.108-109', verified: true },
  { id: 'e6', timestamp: 30.0, timeISO: '12:33:27 CEST', color: 'var(--timeline-red)', mwLost: 0, mwAccum: 25200, source: 'ENTSO-E Final Report, mar. 2026 / Comité de Análisis, p.38', verified: true },
];

const getEvents = (lang) => {
  const s = STRINGS[lang] || STRINGS.es;
  return BASE_EVENTS.map((evt, i) => ({
    ...evt,
    title: s.events[i].title,
    detail: s.events[i].detail,
    openNote: s.events[i].openNote
  }));
};

const TOTAL_DURATION = 30.0;

export default function Bloque3Cascada() {
  const lang = useDocLang();
  const s = STRINGS[lang] || STRINGS.es;
  const TIMELINE_EVENTS = getEvents(lang);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeEvent = TIMELINE_EVENTS[activeIndex];

  const handleNext = () => setActiveIndex(i => Math.min(i + 1, TIMELINE_EVENTS.length - 1));
  const handlePrev = () => setActiveIndex(i => Math.max(i - 1, 0));

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineLabel}>
        {s.header}
      </div>

      <div className={styles.timelineBarWrapper}>
        <div className={styles.timelineBar} role="group" aria-label={s.ariaGroup}>
          {TIMELINE_EVENTS.map((event, index) => {
            const pct      = (event.timestamp / TOTAL_DURATION) * 100;
            const isActive = index === activeIndex;
            return (
              <button
                key={event.id}
                className={`${styles.timelineEventMarker} ${isActive ? styles.active : ''}`}
                style={{
                  left:            `${pct}%`,
                  backgroundColor: event.color,
                  borderColor: isActive ? event.color : 'var(--timeline-marker-border)',
                }}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-label={s.ariaMarker(event.title, event.timestamp)}
                aria-pressed={isActive}
              />
            );
          })}
        </div>
        <div className={styles.timelineTimestamps}>
          <span>12:32:57 CEST</span>
          <span>12:33:27 CEST</span>
        </div>
      </div>

      <div
        className={styles.timelineDetailPanel}
        style={{ borderLeftColor: activeEvent.color }}
      >
        <div className={styles.timelineDetailTime}>
          {activeEvent.timeISO} (+{activeEvent.timestamp.toFixed(0)}s)
        </div>
        <div className={styles.timelineDetailTitle} style={{ color: activeEvent.color }}>
          {activeEvent.title}
        </div>
        <div className={styles.timelineDetailText}>
          {activeEvent.detail}
        </div>

        <div style={{
          marginTop: '0.6rem',
          fontSize: 10, fontFamily: 'monospace',
          color: 'var(--timeline-source)',
        }}>
          📋 {activeEvent.source}
        </div>

        {activeEvent.openNote && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'var(--timeline-warning-bg)',
            border: '1px solid var(--timeline-warning-border)',
            borderRadius: 4,
            fontSize: 11,
            color: 'var(--timeline-warning-text)',
            fontFamily: 'monospace',
          }}>
            ⚠ {s.openNoteLabel}{activeEvent.openNote}
          </div>
        )}

        {activeEvent.id === 'e6' ? (
          <div className={styles.timelinePowerBox}>
            <div className={styles.timelinePowerLabel}>{s.powerLabelDem}</div>
            <div className={styles.timelinePowerValue}>25,2 GW</div>
          </div>
        ) : activeEvent.mwLost > 0 ? (
          <div className={styles.timelinePowerBox}>
            <div className={styles.timelinePowerLabel}>{s.powerLabelLost}</div>
            <div className={styles.timelinePowerValue}>
              −{activeEvent.mwAccum.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.timelineNav}>
        <button
          className={styles.timelineNavButton}
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label={s.ariaPrev}
        >
          {s.btnPrev}
        </button>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 11,
          color: 'var(--timeline-text-tertiary)',
          alignSelf: 'center',
        }}>
          {activeIndex + 1} / {TIMELINE_EVENTS.length}
        </span>
        <button
          className={styles.timelineNavButton}
          onClick={handleNext}
          disabled={activeIndex === TIMELINE_EVENTS.length - 1}
          aria-label={s.ariaNext}
        >
          {s.btnNext}
        </button>
      </div>

      <div className={styles.timelineFooter}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
