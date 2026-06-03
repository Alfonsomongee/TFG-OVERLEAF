/**
 * Bloque5Interconexiones.jsx
 * Estado de las interconexiones peninsulares a las 12:30 CEST del 28-A.
 */
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import styles from './Bloque5Interconexiones.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

const STRINGS = {
  es: {
    title: 'Estado de interconexiones',
    subtitle: 'Península Ibérica · 28 de abril de 2025 · 12:30 CEST (valores de exportación ES→exterior)',
    legendFlow: 'Flujo real de exportación (MW)',
    legendCap: 'Capacidad máxima (MW)',
    tooltipFlow: 'Flujo',
    tooltipCap: 'Capacidad',
    alertTitle: 'Dato clave de la cascada',
    alertText1: 'Durante la cascada (12:33:19 CEST), el pico transitorio de importación desde Francia alcanzó ',
    alertText2: '~3.800 MW de potencia activa',
    alertText3: ' por las líneas AC transpirenaicas (ENTSO-E Factual, pp.108-109 — ',
    alertText4: 'dato verificado',
    alertText5: '). Antes de que las protecciones ANSI 78 abrieran las interconexiones a las 12:33:21 CEST (frecuencia: 48,46 Hz).',
    openNote: '⚠ Cuestión abierta: Algunos textos citan 4.609 MVAr de reactiva en frontera AC. Este valor no está verificado en fuente primaria disponible (ENTSO-E Factual documenta potencia activa, no reactiva en ese punto). Tratar como estimación hasta confirmación regulatoria.',
    footer: 'Fuente: ENTSO-E Factual Report (oct. 2025) · ENTSO-E Final Report (mar. 2026) · REE Informe de Incidente (jun. 2025)',
    items: [
      { name: 'Francia AC', dir: 'exportación', obs: '32% utiliz. · ratio interconexión 3–5% del mix peninsular' },
      { name: 'HVDC INELFE-1', dir: 'exportación', obs: '50% utiliz. · modo PMODE1 "potencia constante" desde ~12:08 CEST' },
      { name: 'Portugal (exp.)', dir: 'exportación', obs: '67% utiliz. · mayor flujo de las interconexiones' },
      { name: 'Marruecos', dir: 'exportación', obs: '89% utiliz. · primera interconexión en desconectarse (~49 Hz)' },
    ]
  },
  en: {
    title: 'Interconnections Status',
    subtitle: 'Iberian Peninsula · April 28, 2025 · 12:30 CEST (ES→exterior export values)',
    legendFlow: 'Actual export flow (MW)',
    legendCap: 'Maximum capacity (MW)',
    tooltipFlow: 'Flow',
    tooltipCap: 'Capacity',
    alertTitle: 'Key data of the cascade',
    alertText1: 'During the cascade (12:33:19 CEST), the transient import peak from France reached ',
    alertText2: '~3,800 MW of active power',
    alertText3: ' through the trans-Pyrenean AC lines (ENTSO-E Factual, pp.108-109 — ',
    alertText4: 'verified data',
    alertText5: '). Before the ANSI 78 protections opened the interconnections at 12:33:21 CEST (frequency: 48.46 Hz).',
    openNote: '⚠ Open issue: Some texts cite 4,609 MVAr of reactive power at the AC border. This value is not verified in available primary sources (ENTSO-E Factual documents active power, not reactive at that point). Treat as an estimate until regulatory confirmation.',
    footer: 'Source: ENTSO-E Factual Report (Oct 2025) · ENTSO-E Final Report (Mar 2026) · REE Incident Report (Jun 2025)',
    items: [
      { name: 'France AC', dir: 'export', obs: '32% util. · interconnection ratio 3-5% of peninsular mix' },
      { name: 'HVDC INELFE-1', dir: 'export', obs: '50% util. · PMODE1 "constant power" mode since ~12:08 CEST' },
      { name: 'Portugal (exp.)', dir: 'export', obs: '67% util. · highest flow among interconnections' },
      { name: 'Morocco', dir: 'export', obs: '89% util. · first interconnection to disconnect (~49 Hz)' },
    ]
  },
  de: {
    title: 'Verbindungsstatus',
    subtitle: 'Iberische Halbinsel · 28. April 2025 · 12:30 CEST (ES→Ausland Exportwerte)',
    legendFlow: 'Tatsächlicher Exportfluss (MW)',
    legendCap: 'Maximale Kapazität (MW)',
    tooltipFlow: 'Fluss',
    tooltipCap: 'Kapazität',
    alertTitle: 'Schlüsseldaten der Kaskade',
    alertText1: 'Während der Kaskade (12:33:19 CEST) erreichte die vorübergehende Importspitze aus Frankreich ',
    alertText2: '~3.800 MW Wirkleistung',
    alertText3: ' über die transpyrenäischen AC-Leitungen (ENTSO-E Factual, S.108-109 — ',
    alertText4: 'verifizierte Daten',
    alertText5: '). Bevor die ANSI 78 Schutzvorrichtungen die Verbindungen um 12:33:21 CEST öffneten (Frequenz: 48,46 Hz).',
    openNote: '⚠ Offener Punkt: Einige Texte zitieren 4.609 MVAr Blindleistung an der AC-Grenze. Dieser Wert ist in den verfügbaren Primärquellen nicht belegt (ENTSO-E Factual dokumentiert Wirkleistung, nicht Blindleistung an diesem Punkt). Bis zur behördlichen Bestätigung als Schätzung zu behandeln.',
    footer: 'Quelle: ENTSO-E Factual Report (Okt 2025) · ENTSO-E Final Report (März 2026) · REE-Vorfallbericht (Jun 2025)',
    items: [
      { name: 'Frankreich AC', dir: 'Export', obs: '32% Auslastung · Verbindungsquote 3-5% des Festland-Mixes' },
      { name: 'HVDC INELFE-1', dir: 'Export', obs: '50% Auslastung · Modus PMODE1 "konstante Leistung" seit ~12:08 CEST' },
      { name: 'Portugal (Exp.)', dir: 'Export', obs: '67% Auslastung · höchster Fluss unter den Verbindungen' },
      { name: 'Marokko', dir: 'Export', obs: '89% Auslastung · erste Verbindung, die sich trennte (~49 Hz)' },
    ]
  }
};

const BASE_DATA = [
  { id: 'france-ac',   flowReal: 870,  capacityMax: 2700, source: 'ENTSO-E Factual, p.12' },
  { id: 'hvdc-inelfe', flowReal: 1000, capacityMax: 2000, source: 'ENTSO-E Factual, p.12 / REE' },
  { id: 'portugal',    flowReal: 2600, capacityMax: 3900, source: 'ENTSO-E 9 may 2025' },
  { id: 'morocco',     flowReal: 800,  capacityMax: 900,  source: 'REE Informe Incidente' },
];

const getUtilizationColor = (pct) =>
  pct < 50 ? '#1D9E75' : pct < 75 ? '#EF9F27' : '#E24B4A';

const fmt = (n) => n.toLocaleString('es-ES');

function CustomTooltip({ active, payload, lang }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const s = STRINGS[lang] || STRINGS.es;
  return (
    <div style={{
      background: 'var(--ifm-background-surface-color, #0a0f1c)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 4, padding: '8px 12px',
      fontSize: 11, fontFamily: 'monospace',
    }}>
      <p style={{ fontWeight: 'bold', marginBottom: 4, color: '#e2e8f0' }}>{d.name}</p>
      <p style={{ color: '#378ADD', marginBottom: 2 }}>{s.tooltipFlow}: {d.flowReal.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW</p>
      <p style={{ color: 'var(--text-1, #64748b)' }}>{s.tooltipCap}: {d.capacityMax.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW</p>
    </div>
  );
}

function UtilizationCard({ ic, lang }) {
  const pct   = (ic.flowReal / ic.capacityMax) * 100;
  const color = getUtilizationColor(pct);
  return (
    <div className={styles.utilizationCard}>
      <h3 className={styles.cardTitle}>{ic.name}</h3>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}
             style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className={styles.percentage}>{pct.toFixed(0)}%</div>
      <p className={styles.observation}>{ic.observation}</p>
      <p className={styles.details}>
        {ic.flowReal.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} / {ic.capacityMax.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW
        <span style={{ marginLeft: 6, fontSize: 10, color: '#475569' }}>
          ({ic.direction})
        </span>
      </p>
      <p style={{ fontSize: 9, color: '#374151', fontFamily: 'monospace', margin: 0 }}>
        📋 {ic.source}
      </p>
    </div>
  );
}

export default function Bloque5Interconexiones() {
  const lang = useDocLang();
  const s = STRINGS[lang] || STRINGS.es;

  const INTERCONNECTIONS_DATA = BASE_DATA.map((ic, i) => ({
    ...ic,
    name: s.items[i].name,
    direction: s.items[i].dir,
    observation: s.items[i].obs
  }));

  const chartData = useMemo(() =>
    INTERCONNECTIONS_DATA.map(ic => ({
      name:        ic.name,
      flowReal:    ic.flowReal,
      capacityMax: ic.capacityMax,
    })), [lang]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{s.title}</h1>
        <p className={styles.subtitle}>
          {s.subtitle}
        </p>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColorBlue} />
          <span>{s.legendFlow}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColorGray} />
          <span>{s.legendCap}</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#808080', fontSize: 11, fontFamily: 'monospace' }}
              angle={-45} textAnchor="end" height={100}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={v => `${v.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW`}
              axisLine={false} tickLine={false}
            />
            <Tooltip content={<CustomTooltip lang={lang} />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="capacityMax" fill="rgba(100,116,139,0.4)"
                 radius={[3,3,0,0]} name={s.legendCap} />
            <Bar dataKey="flowReal" fill="#378ADD"
                 radius={[3,3,0,0]} name={s.legendFlow} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.grid}>
        {INTERCONNECTIONS_DATA.map(ic => (
          <UtilizationCard key={ic.id} ic={ic} lang={lang} />
        ))}
      </div>

      <div className={styles.alertBox}>
        <div className={styles.alertIcon}>⚡</div>
        <div>
          <h3 className={styles.alertTitle}>{s.alertTitle}</h3>
          <p className={styles.alertText}>
            {s.alertText1}
            <strong>{s.alertText2}</strong>
            {s.alertText3}
            <strong>{s.alertText4}</strong>
            {s.alertText5}
          </p>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.4rem 0.75rem',
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 4,
            fontSize: 11, color: '#f59e0b', fontFamily: 'monospace',
          }}>
            {s.openNote}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
