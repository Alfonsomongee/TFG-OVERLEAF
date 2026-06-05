/**
 * Bloque2MixGeneracion.jsx
 * Mix de generación peninsular a las 12:30 CEST del 28-A.
 */
import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';
import styles from './Bloque2MixGeneracion.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

const STRINGS = {
  es: {
    solar: 'Solar fotovoltaica',
    nuclear: 'Nuclear',
    wind: 'Eólica',
    hydro: 'Hidráulica',
    ccgt: 'CCGT (gas)',
    other: 'Cogeneración / otros',
    alertTitle: 'ALERTA DE SISTEMA:',
    alertText1: 'A las 12:30 CEST, el ',
    alertText2: ' de la generación activa',
    alertText3: ' provenía de fuentes renovables (Comité de Análisis, p.38), de las cuales la práctica totalidad operaba en modo grid-following sin aportar inercia mecánica genuina. Solo el ~',
    alertText4: '% (nuclear, hidráulica y CCGT) aportaba masa síncrona. La constante de inercia ibérica era ',
    alertText5: ' (ENTSO-E Factual, Tabla 2-4, p.36).',
    ibrLabel: 'IBR sin inercia',
    syncLabel: 'generación síncrona',
    syncShort: 'Síncrono',
    estTooltip: '(estimación)',
    syncTag: 'síncrono',
    ibrTag: 'IBR',
    colTech: 'TECNOLOGÍA',
    colDist: 'DISTRIBUCIÓN',
    colPower: 'POTENCIA',
    footer: 'Porcentajes: Comité de Análisis del Gobierno, p.38 (12:30 CEST, 28/04/2025). MW por tecnología: estimaciones proporcionales sobre demanda peninsular de 25.184 MW + exportaciones + bombeo. No proceden de telemetría ESIOS por pérdida de logs durante la cascada.'
  },
  en: {
    solar: 'Solar photovoltaic',
    nuclear: 'Nuclear',
    wind: 'Wind',
    hydro: 'Hydro',
    ccgt: 'CCGT (gas)',
    other: 'Cogeneration / others',
    alertTitle: 'SYSTEM ALERT:',
    alertText1: 'At 12:30 CEST, ',
    alertText2: ' of active generation',
    alertText3: ' came from renewable sources (Analysis Committee, p.38), practically all of which operated in grid-following mode without providing genuine mechanical inertia. Only ~',
    alertText4: '% (nuclear, hydro and CCGT) provided synchronous mass. The Iberian inertia constant was ',
    alertText5: ' (ENTSO-E Factual, Table 2-4, p.36).',
    ibrLabel: 'IBR without inertia',
    syncLabel: 'synchronous generation',
    syncShort: 'Synchronous',
    estTooltip: '(estimate)',
    syncTag: 'synchronous',
    ibrTag: 'IBR',
    colTech: 'TECHNOLOGY',
    colDist: 'DISTRIBUTION',
    colPower: 'POWER',
    footer: 'Percentages: Government Analysis Committee, p.38 (12:30 CEST, 28/04/2025). MW by technology: proportional estimates based on peninsular demand of 25,184 MW + exports + pumping. Not from ESIOS telemetry due to log loss during the cascade.'
  },
  de: {
    solar: 'Photovoltaik',
    nuclear: 'Kernenergie',
    wind: 'Wind',
    hydro: 'Wasserkraft',
    ccgt: 'GuD-Kraftwerk (Gas)',
    other: 'Kraft-Wärme-Kopplung / andere',
    alertTitle: 'SYSTEMALARM:',
    alertText1: 'Um 12:30 CEST stammten ',
    alertText2: ' der aktiven Erzeugung',
    alertText3: ' aus erneuerbaren Quellen (Analysekomitee, S.38), von denen fast alle im Grid-Following-Modus arbeiteten und keine echte mechanische Trägheit lieferten. Nur ~',
    alertText4: '% (Kernkraft, Wasserkraft und GuD) lieferten synchrone Masse. Die iberische Trägheitskonstante betrug ',
    alertText5: ' (ENTSO-E Factual, Tabelle 2-4, S.36).',
    ibrLabel: 'IBR ohne Trägheit',
    syncLabel: 'synchrone Erzeugung',
    syncShort: 'Synchron',
    estTooltip: '(Schätzung)',
    syncTag: 'synchron',
    ibrTag: 'IBR',
    colTech: 'TECHNOLOGIE',
    colDist: 'VERTEILUNG',
    colPower: 'LEISTUNG',
    footer: 'Prozentsätze: Analysekomitee der Regierung, S.38 (12:30 CEST, 28.04.2025). MW nach Technologie: proportionale Schätzungen basierend auf der Nachfrage des Festlandes von 25.184 MW + Exporte + Pumpen. Nicht aus ESIOS-Telemetrie aufgrund von Protokollverlusten während der Kaskade.'
  }
};

function AlertIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function Bloque2MixGeneracion() {
  const lang = useDocLang();
  const s = STRINGS[lang] || STRINGS.es;

  const GENERATION_DATA = [
    { id: 'solar', name: s.solar, mw: 13428, percentage: 53.3, color: 'var(--mix-solar)', aportaInercia: false },
    { id: 'nuclear', name: s.nuclear, mw: 2518, percentage: 10.0, color: 'var(--mix-nuclear)', aportaInercia: true },
    { id: 'wind', name: s.wind, mw: 3022, percentage: 12.0, color: 'var(--mix-wind)', aportaInercia: false },
    { id: 'hydro', name: s.hydro, mw: 1763, percentage: 7.0, color: 'var(--mix-hydro)', aportaInercia: true },
    { id: 'ccgt', name: s.ccgt, mw: 756, percentage: 3.0, color: 'var(--mix-ccgt)', aportaInercia: true },
    { id: 'other', name: s.other, mw: 1008, percentage: 4.0, color: 'var(--mix-other)', aportaInercia: true },
  ];

  const totalIBR    = GENERATION_DATA.filter(d => !d.aportaInercia).reduce((sum, d) => sum + d.percentage, 0);
  const totalSincro = GENERATION_DATA.filter(d =>  d.aportaInercia).reduce((sum, d) => sum + d.percentage, 0);

  return (
    <div className={styles.generationMix}>
      <div className={styles.alertBox}>
        <AlertIcon />
        <div className={styles.alertText}>
          <strong>{s.alertTitle}</strong> {s.alertText1}
          <strong>82%{s.alertText2}</strong>{s.alertText3}
          {totalSincro.toFixed(0)}{s.alertText4}
          <strong>H = 2,21–2,71 s</strong>{s.alertText5}
        </div>
      </div>

      <div style={{ margin: '1rem 0', borderRadius: 6, overflow: 'hidden', height: 28 }}
           aria-label={`${totalIBR.toFixed(0)}% ${s.ibrLabel}, ${totalSincro.toFixed(0)}% ${s.syncLabel}`}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{
            width: `${totalIBR}%`,
            background: 'var(--mix-ibr)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 8, fontSize: 11,
            fontFamily: 'monospace', color: 'var(--color-background-primary)', fontWeight: 700,
          }}>
            {totalIBR.toFixed(0)}% IBR
          </div>
          <div style={{
            flex: 1,
            background: 'var(--mix-sync)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 6, fontSize: 11,
            fontFamily: 'monospace', color: 'var(--color-background-primary)', fontWeight: 700,
          }}>
            {totalSincro.toFixed(0)}% {s.syncShort}
          </div>
        </div>
      </div>

      <div className={styles.generationContainer}>
        <div className={styles.generationLeft}>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GENERATION_DATA}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={2} dataKey="mw" stroke="none"
                >
                  {GENERATION_DATA.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [
                    `~${value.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW ${s.estTooltip}`,
                    name,
                  ]}
                  contentStyle={{
                    background: 'var(--mix-tooltip-bg)',
                    border: `1px solid var(--mix-tooltip-border)`,
                    color: 'var(--mix-tooltip-text)',
                    borderRadius: 4, fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartLegend}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                <span>
                  {item.name} ({item.percentage}%)
                  {item.aportaInercia
                    ? <span style={{ color: 'var(--mix-sync)', fontSize: 10 }}> ⚙ {s.syncTag}</span>
                    : <span style={{ color: 'var(--mix-ibr)', fontSize: 10 }}> ⚡ {s.ibrTag}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.generationRight}>
          <div className={styles.tableHeader}>
            <div className={styles.tableColTech}>{s.colTech}</div>
            <div className={styles.tableColBar}>{s.colDist}</div>
            <div className={styles.tableColValue}>{s.colPower}</div>
          </div>

          <div className={styles.tableRows}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.tableRowTech}>{item.name}</div>
                <div className={styles.tableRowBarContainer}>
                  <div
                    className={styles.tableRowBar}
                    style={{ backgroundColor: item.color, width: `${item.percentage}%` }}
                  />
                  <div className={styles.tableRowPercentage}>{item.percentage}%</div>
                </div>
                <div className={styles.tableRowValue}>
                  ~{item.mw.toLocaleString(lang === 'en' ? 'en-US' : 'es-ES')} MW
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.generationFooter}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
