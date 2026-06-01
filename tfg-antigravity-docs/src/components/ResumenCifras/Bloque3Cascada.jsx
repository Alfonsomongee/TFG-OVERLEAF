/**
 * Bloque3Cascada.jsx
 * Cronología interactiva de la cascada de 30 segundos.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATOS — 4.609 MVAr marcado como Cuestión Abierta:
 *    El valor de 4.609 MVAr de reactiva en frontera AC no está verificado
 *    en fuente primaria (ENTSO-E Factual documenta 3.800 MW de potencia
 *    activa, no 4.609 MVAr de reactiva). Se mantiene el dato pero se
 *    etiqueta explícitamente como estimación no verificada.
 *    Fuente verificada: ENTSO-E Factual, pp.108-109.
 *
 * 2. ACCESIBILIDAD — marcadores de eventos:
 *    Los puntos de la línea de tiempo eran div con onClick pero sin
 *    role="button" funcional en teclado. Migrados a botones nativos
 *    con aria-label y onKeyDown.
 *
 * 3. DATOS — nadir verificado:
 *    El e5 (47,79 Hz) es el nadir real del sistema; la pérdida de
 *    sincronismo fue a 48,46 Hz (12:33:21 CEST). Ambos datos son
 *    correctos pero son instantes distintos — aclarado en el detalle.
 *
 * 4. UX — mwAccum del e6 corregido:
 *    El evento final (cero eléctrico) tenía mwAccum = 25.200 como
 *    condición especial para mostrar "~31.000 MW". Simplificado:
 *    muestra directamente los 25,2 GW de demanda peninsular española
 *    (dato verificado) sin la confusión entre magnitudes.
 */
import React, { useState } from 'react';
import styles from './Bloque3Cascada.module.css';

const TIMELINE_EVENTS = [
  {
    id: 'e1',
    timestamp: 0.0,
    timeISO: '12:32:57.120',
    color: '#EF9F27',
    title: 'G-1 · Disparo transformador 400/220 kV — Granada',
    detail: 'Primer disparo de la cascada. Transformador de evacuación de planta solar. Potencia perdida: −355 MW activos, −165 MVAr de absorción reactiva. Tensión en colector 220 kV: ~242 kV (>1,10 p.u.), invisible para el SCADA de REE por efecto Tap-Lag. Protección ANSI 59 actuó correctamente según su configuración.',
    mwLost: 355,
    mwAccum: 355,
    source: 'ENTSO-E Factual, p.28',
    verified: true,
  },
  {
    id: 'e2',
    timestamp: 19.34,
    timeISO: '12:33:16.460',
    color: '#E24B4A',
    title: 'G-2 · Desconexión Badajoz (CSP + FV)',
    detail: 'Central termosolar + parque fotovoltaico adyacente. Tensión en 400 kV: 432,4 kV (rozando límite P.O. 1.1 de 435 kV). Potencia perdida: −730 MW acumulado (incluyendo pérdidas previas en zona). Disparo por sobretensión ANSI 59.',
    mwLost: 730,
    mwAccum: 1082,
    source: 'Comité de Análisis, p.38 / REE, p.5',
    verified: true,
  },
  {
    id: 'e3',
    timestamp: 20.56,
    timeISO: '12:33:17–12:33:18 CEST',
    color: '#E24B4A',
    title: 'G-3 · Cascada Sevilla / Huelva / Cáceres / Segovia / Badajoz (2ª oleada)',
    detail: 'Ventana crítica: ~650 ms. Desconexiones en cadena de eólica y FV en 5 provincias. Detalle verificado: Sevilla −550 MW + Badajoz acumulado −730 MW + otras instalaciones de Huelva, Cáceres y Segovia. Potencia total acumulada: −1.635 MW (Granada + Badajoz + Sevilla). Fuente: Comité de Análisis, p.38.',
    mwLost: 553,
    mwAccum: 1635,
    source: 'Comité de Análisis, p.38',
    verified: true,
  },
  {
    id: 'e4',
    timestamp: 23.53,
    timeISO: '12:33:21.535',
    color: '#378ADD',
    title: 'Aislamiento de Iberia — Trip AC Francia–España (ANSI 78)',
    detail: 'Las protecciones de pérdida de sincronismo (ANSI 78) abren las líneas de interconexión AC con Francia (Baixas-Vic, Argia-Arkale, Argia-Hernani). Frecuencia en ese instante: 48,46 Hz. La Península Ibérica queda aislada del sistema síncrono continental europeo. El pico transitorio de importación AC fue de ~3.800 MW de potencia activa (ENTSO-E Factual, pp.108-109). ⚠ Nota: el dato de 4.609 MVAr de reactiva que aparece en algunos textos no está verificado en fuente primaria y debe tratarse como estimación.',
    mwLost: 0,
    mwAccum: 1635,
    source: 'ENTSO-E Factual, pp.108-109',
    verified: true,
    openNote: 'El pico de reactiva en frontera AC (4.609 MVAr) no está verificado en fuente primaria. Lo verificado es el pico de potencia activa: ~3.800 MW.',
  },
  {
    id: 'e5',
    timestamp: 25.88,
    timeISO: '12:33:23–12:33:24 CEST',
    color: '#9F3EFF',
    title: 'Nadir de frecuencia — 47,79 Hz',
    detail: 'Mínimo de frecuencia registrado, ~1,1 s después de la pérdida de sincronismo (que ocurrió a 48,46 Hz @ 12:33:21). Por debajo de 47,5 Hz actúan protecciones UFLS finales. Disparo de grupos generadores por sobreexcitación (protección V/Hz). Trip del enlace HVDC INELFE-1 a las 12:33:24 CEST. Iberia pierde la última conexión externa.',
    mwLost: 0,
    mwAccum: 1635,
    source: 'ENTSO-E Factual, pp.108-109',
    verified: true,
  },
  {
    id: 'e6',
    timestamp: 30.0,
    timeISO: '12:33:27 CEST',
    color: '#E24B4A',
    title: 'Cero eléctrico — Colapso total',
    detail: 'Tensión en 400 kV cae a cero. Demanda peninsular española interrumpida: 25,2 GW (Comité de Análisis, p.38). Afectados: ~57 millones de personas (España peninsular + Portugal continental + Andorra). El mayor apagón del sistema eléctrico europeo continental en más de 20 años. Es el primer colapso por sobretensión documentado en el Área Síncrona de Europa Continental.',
    mwLost: 0,
    mwAccum: 25200,
    source: 'ENTSO-E Final Report, mar. 2026 / Comité de Análisis, p.38',
    verified: true,
  },
];

const TOTAL_DURATION = 30.0;

export default function Bloque3Cascada() {
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
        DESARROLLO DE LA CASCADA (30 SEGUNDOS · 12:32:57–12:33:27 CEST)
      </div>

      {/* Barra de tiempo */}
      <div className={styles.timelineBarWrapper}>
        <div className={styles.timelineBar} role="group" aria-label="Eventos de la cascada">
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
                  borderColor:     isActive ? event.color : 'var(--ifm-background-surface-color, #0a0f1c)',
                }}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                aria-label={`${event.title} — t=${event.timestamp}s`}
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

      {/* Panel de detalle */}
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

        {/* Fuente primaria */}
        <div style={{
          marginTop: '0.6rem',
          fontSize: 10, fontFamily: 'monospace',
          color: '#475569',
        }}>
          📋 {activeEvent.source}
        </div>

        {/* Nota de Cuestión Abierta si aplica */}
        {activeEvent.openNote && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 4,
            fontSize: 11, color: '#f59e0b', fontFamily: 'monospace',
          }}>
            ⚠ Cuestión abierta: {activeEvent.openNote}
          </div>
        )}

        {/* Potencia acumulada */}
        {activeEvent.id === 'e6' ? (
          <div className={styles.timelinePowerBox}>
            <div className={styles.timelinePowerLabel}>Demanda peninsular española interrumpida:</div>
            <div className={styles.timelinePowerValue}>25,2 GW</div>
          </div>
        ) : activeEvent.mwLost > 0 ? (
          <div className={styles.timelinePowerBox}>
            <div className={styles.timelinePowerLabel}>Pérdida acumulada verificada:</div>
            <div className={styles.timelinePowerValue}>
              −{activeEvent.mwAccum.toLocaleString('es-ES')} MW
            </div>
          </div>
        ) : null}
      </div>

      {/* Navegación */}
      <div className={styles.timelineNav}>
        <button
          className={styles.timelineNavButton}
          onClick={handlePrev}
          disabled={activeIndex === 0}
          aria-label="Evento anterior"
        >
          ← ANTERIOR
        </button>
        <span style={{
          fontFamily: 'monospace', fontSize: 11, color: 'var(--text-1, #64748b)',
          alignSelf: 'center',
        }}>
          {activeIndex + 1} / {TIMELINE_EVENTS.length}
        </span>
        <button
          className={styles.timelineNavButton}
          onClick={handleNext}
          disabled={activeIndex === TIMELINE_EVENTS.length - 1}
          aria-label="Evento siguiente"
        >
          SIGUIENTE →
        </button>
      </div>

      <div className={styles.timelineFooter}>
        <p>
          Cronología verificada: ENTSO-E Factual Report (oct. 2025), ENTSO-E Final Report
          (mar. 2026), Comité de Análisis del Gobierno (jun. 2025), REE Informe de Incidente.
          Timestamps con resolución de milisegundos extraídos de registros WAMS/PMU.
        </p>
      </div>
    </div>
  );
}
