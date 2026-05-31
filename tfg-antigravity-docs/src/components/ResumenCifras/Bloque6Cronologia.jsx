/**
 * Bloque6Cronologia.jsx
 * Cronología de reposición del suministro (28-A → 29-A).
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DEPENDENCIA — lucide-react eliminada:
 *    Los iconos ShieldAlert, AlertTriangle y CheckCircle2 de lucide-react
 *    pueden no estar instalados o generar errores en SSR. Sustituidos
 *    por SVG inline simples que no añaden dependencias.
 *
 * 2. DATOS — reposición Portugal verificada:
 *    "00:22 CEST" → "00:22 CEST del 29 abr" (ya estaba correcto,
 *    se aclara la fecha para evitar confusión).
 *    Fuente: ENTSO-E Factual, pp.12-13.
 *
 * 3. ACCESIBILIDAD — animaciones con prefers-reduced-motion:
 *    Las tarjetas tienen fadeInUp con animationDelay. Con
 *    prefers-reduced-motion se desactiva la animación via CSS.
 *    Añadido aria-label al contenedor principal.
 *
 * 4. UX — fuentes visibles en cada evento de la cronología.
 */
import React, { useMemo } from 'react';
import styles from './Bloque6Cronologia.module.css';

// ─── Iconos SVG inline (sin lucide-react) ─────────────────────────────────────
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

// ─── Datos verificados ────────────────────────────────────────────────────────
// Fuente principal: ENTSO-E Factual, pp.12-13 / REE Operación / REN Portugal
const TIMELINE_DATA = [
  {
    time: '12:33 CEST', date: '28 abr', color: '#E24B4A',
    title: 'Cero eléctrico confirmado',
    description: 'Tensión 400 kV < 1 kV. ~25,2 GW de demanda peninsular española interrumpidos. ~57 millones de personas sin suministro.',
    demand: 0,
    source: 'Comité de Análisis, p.38 / ENTSO-E Final Report',
  },
  {
    time: '12:35 CEST', date: '28 abr', color: '#EF9F27',
    title: 'Solicitud black-start a EDP Portugal',
    description: 'Arranque autónomo en Castelo do Bode (hidroeléctrica, 138 MW, cuenca del Zêzere). REN cursó la orden en ~2 min.',
    demand: 0,
    source: 'REN Portugal / ANEPC',
  },
  {
    time: '12:43 CEST', date: '28 abr', color: '#EF9F27',
    title: 'Primera reenergización: Hernani (País Vasco)',
    description: 'Arteria 400 kV desde Francia. Importación confirmada: ~31 MW en Irún. Primera isla eléctrica viable en España.',
    demand: 1,
    source: 'REE Operación / ENTSO-E Factual, p.12',
  },
  {
    time: '12:45 CEST', date: '28 abr', color: '#1D9E75',
    title: 'Castelo do Bode conectado a barra 220 kV REN',
    description: 'Arranque exitoso en ~10 min. Primera isla eléctrica de Portugal creada. Coste del servicio de black-start: ~240.000 €/año.',
    demand: 0.5,
    source: 'REN Portugal / ANEPC (comisión parlamentaria)',
  },
  {
    time: '13:35 CEST', date: '28 abr', color: '#EF9F27',
    title: 'Línea Baixàs–Vic (400 kV) sincronizada',
    description: 'Segunda arteria desde Francia (litoral mediterráneo). Expansión hacia Cataluña y litoral este.',
    demand: 4,
    source: 'REE Operación',
  },
  {
    time: '18:36 CEST', date: '28 abr', color: '#1D9E75',
    title: 'Primera sincronización España–Portugal (Aldeadávila–Pocinho)',
    description: 'Línea 220 kV. Portugal se conecta a la frecuencia europea continental. Esquemas Black Start BS-Duero activados desde ~16:00 CEST.',
    demand: 30,
    source: 'REE Operación / ENTSO-E Factual, p.13',
  },
  {
    time: '23:00 CEST', date: '28 abr', color: '#1D9E75',
    title: '51% de la demanda peninsular recuperada',
    description: '12.847 MW activos. 70% de subestaciones de transporte energizadas. Hospitales operando con normalidad.',
    demand: 51,
    source: 'REE Operación',
  },
  {
    time: '00:22 CEST', date: '29 abr', color: '#1D9E75',
    title: 'Red de transporte de Portugal 100% restaurada',
    description: 'REN confirma reposición total de la red de alta tensión. Duración total para Portugal: ~12 horas.',
    demand: 65,
    source: 'ENTSO-E Factual, pp.12-13 / REN',
  },
  {
    time: '04:00 CEST', date: '29 abr', color: '#1D9E75',
    title: 'Red de transporte de España 100% restaurada',
    description: 'REE confirma reposición total de la red de transporte española. Tiempo acumulado desde cero: ~15,5 horas.',
    demand: 80,
    source: 'ENTSO-E Factual, pp.12-13 / REE',
  },
  {
    time: '07:00 CEST', date: '29 abr', color: '#1D9E75',
    title: 'Reposición prácticamente completa (99,95%)',
    description: 'Solo pequeñas zonas rurales aisladas continúan sin cobertura. Sistema completamente estable. Fin operativo del incidente.',
    demand: 99.95,
    source: 'ENTSO-E Factual, pp.12-13',
  },
];

const BLACKSTART_DATA = [
  {
    flagEmoji: '🇵🇹',
    country:   'portugal',
    name:      'Castelo do Bode',
    technology:'Hidroeléctrica · 138 MW',
    operator:  'EDP',
    location:  'Cuenca del Zêzere, Portugal',
    detail:    'Arranque en ~10 min · Coste black-start: ~240.000 €/año · Capacidad extendida a 2030',
    color:     '#1D9E75',
  },
  {
    flagEmoji: '🇪🇸',
    country:   'spain',
    name:      'Aldeadávila',
    technology:'Hidroeléctrica reversible · ~1.100 MW',
    operator:  'Iberdrola',
    location:  'Cuenca del Duero, Salamanca',
    detail:    'Esquema BS-Duero 1 activado ~16:00 CEST · Turbina + modo bomba',
    color:     '#E24B4A',
  },
];

// ─── Gradiente de demanda ─────────────────────────────────────────────────────
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

// ─── Tarjeta de evento ────────────────────────────────────────────────────────
function TimelineCard({ event, index }) {
  const gradient = useMemo(() => getDemandGradient(event.demand), [event.demand]);
  return (
    <div
      className={`${styles.timelineCardWrapper} ${styles.fadeInUp}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={styles.timelineCard} style={{ borderLeftColor: event.color }}>
        {/* Tiempo */}
        <div className={styles.timelineTimeCol}>
          <div className={styles.timelineTimeLabel}>
            <StatusIcon color={event.color} />
            <span className={styles.timelineTimeText}>{event.time}</span>
          </div>
          <div className={styles.timelineDateText}>{event.date}</div>
        </div>

        {/* Contenido */}
        <div className={styles.timelineContentCol}>
          <h3 className={styles.timelineContentTitle}>{event.title}</h3>
          <p className={styles.timelineContentDesc}>{event.description}</p>
          <p style={{ fontSize: 9, color: '#374151', fontFamily: 'monospace', margin: '4px 0 0' }}>
            📋 {event.source}
          </p>
        </div>

        {/* Barra de demanda */}
        <div className={styles.timelineDemandCol}>
          <div className={styles.timelineDemandValue}>
            {event.demand.toFixed(1)}%
          </div>
          <div className={styles.timelineDemandLabel}>Demanda recuperada</div>
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

// ─── Tarjeta Black Start ──────────────────────────────────────────────────────
function BlackStartCard({ card, index }) {
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
          { label: 'TECNOLOGÍA',   value: card.technology },
          { label: 'OPERADOR',     value: card.operator },
          { label: 'LOCALIZACIÓN', value: card.location },
        ].map((item, i) => (
          <div key={i} className={styles.blackstartItem}>
            <span className={styles.blackstartItemLabel}>{item.label}</span>
            <span className={styles.blackstartItemValue}>{item.value}</span>
          </div>
        ))}
        <div className={styles.blackstartDetail}>
          <div className={styles.blackstartItemLabel} style={{ marginBottom: 8 }}>Dato clave</div>
          <span className={styles.blackstartItemValue}>{card.detail}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function Bloque6Cronologia() {
  return (
    <div className={styles.container}
         aria-label="Cronología de reposición del suministro eléctrico del 28-A">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cronología de reposición</h1>
          <p className={styles.subtitle}>
            28–29 de abril de 2025 · Desde cero eléctrico (12:33 CEST)
            hasta recuperación total (07:00 CEST, 29 abr)
          </p>
        </div>
        <div className={styles.statusBadge}>
          <CheckIcon color="#1D9E75" />
          <span className={styles.statusBadgeText}>Sistema Sincronizado</span>
        </div>
      </div>

      {/* Timeline de eventos */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLine} />
          <h2 className={styles.sectionTitle}>Eventos de recuperación del suministro</h2>
        </div>
        {TIMELINE_DATA.map((event, i) => (
          <TimelineCard key={i} event={event} index={i} />
        ))}
      </div>

      {/* Black Start */}
      <div className={styles.section}>
        <div className={styles.header} style={{ marginBottom: 32 }}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--ifm-heading-color)' }}>
            Plantas de arranque autónomo (Black Start)
          </h2>
          <p className={styles.subtitle} style={{ marginTop: 8 }}>
            Centrales críticas que permitieron reconstruir el sistema desde cero.
            Sin estas dos plantas, la reposición habría requerido horas adicionales
            de importación sostenida desde Francia.
          </p>
        </div>
        <div className={styles.blackstartGrid}>
          {BLACKSTART_DATA.map((card, i) => (
            <BlackStartCard key={i} card={card} index={i} />
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <p>
          Fuente: ENTSO-E Factual Report (oct. 2025), pp.12-13 · ENTSO-E Final Report
          (mar. 2026) · REE Operación (29/04/2025) · REN Portugal · ANEPC
          (comisión parlamentaria)
        </p>
      </div>
    </div>
  );
}
