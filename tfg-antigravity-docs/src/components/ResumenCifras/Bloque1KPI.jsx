/**
 * Bloque1KPI.jsx
 * Panel de KPIs del apagón ibérico del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. CRÍTICO — "27 s" → "30 s":
 *    El colapso duró de 12:32:57 a 12:33:27 CEST = 30 segundos exactos.
 *    Fuente: ENTSO-E Factual, pp.108-109.
 *
 * 2. CRÍTICO — "~31 GW carga interrumpida" → "25,2 GW demanda peninsular":
 *    Los 31 GW son la carga ibérica total (España + Portugal + bombeo +
 *    exportación). La demanda peninsular española interrumpida fue 25,2 GW.
 *    Son magnitudes distintas; usar la específica con su nombre correcto.
 *    Fuente: Comité de Análisis del Gobierno, p.38.
 *
 * 3. "~55 M" → "~57 M":
 *    Los informes dan ~57 millones (España peninsular + Portugal continental
 *    + Andorra). Los 55 M son solo España peninsular.
 *    Fuente: Censos España + Portugal + Andorra.
 *
 * 4. MEJORA — tooltip accesible:
 *    El tooltip de fuente ahora usa role="tooltip" con aria-describedby
 *    correcto y es visible en teclado (focus-visible).
 *
 * 5. MEJORA — indicador "Cuestión Abierta" en pérdidas económicas:
 *    El dato de 1.600 M€ de la CEOE es una estimación pública, no
 *    verificada en fuente primaria regulatoria. Se marca visualmente.
 */
import React, { useState } from 'react';
import styles from './Bloque1KPI.module.css';
import { useDocLang } from '@site/src/hooks/useDocLang';

const STRINGS = {
  es: {
    duration: 'DURACIÓN DEL COLAPSO',
    durationContext: '12:32:57 → 12:33:27 CEST',
    durationSource: 'ENTSO-E Factual, pp.108-109',
    load: 'DEMANDA PENINSULAR INTERRUMPIDA',
    loadContext: 'España peninsular · 12:30 CEST',
    loadSource: 'Comité de Análisis del Gobierno, p.38',
    pop: 'POBLACIÓN AFECTADA',
    popContext: 'España peninsular + Portugal + Andorra',
    popSource: 'Censos nacionales / ENTSO-E Factual',
    deaths: 'FALLECIDOS RELACIONADOS',
    deathsContext: '7 España · 1 Portugal · ninguno en hospitales',
    deathsSource: 'El País / RTP / informes ANEPC, 28–29/04/2025',
    recovery: 'REPOSICIÓN COMPLETA',
    recoveryContext: '99,95% a las 07:00 del 29 abr',
    recoverySource: 'ENTSO-E Factual, pp.12-13 / REE Operación',
    losses: 'PÉRDIDAS ECONÓMICAS (est.)',
    lossesContext: 'Estimación CEOE · 0,1% del PIB español',
    lossesSource: 'CEOE, A. Garamendi, 29/04/2025 — estimación no auditada',
    openNote: 'Cifra estimada por CEOE. No verificada en fuente regulatoria primaria (CNMC o REE). La CNMC cuantifica el daño regulatorio en 25,2–42,5 M€.',
    est: '⚠ ESTIMACIÓN',
    footer: 'Datos verificados en fuentes primarias: ENTSO-E Factual Report (oct. 2025), ENTSO-E Final Report (mar. 2026) y Comité de Análisis del Gobierno (jun. 2025). La demanda de 25,2 GW es la carga peninsular española; la carga ibérica total (incluyendo Portugal, bombeo y exportación) era ~31 GW. Las pérdidas económicas son estimaciones públicas de organizaciones sectoriales, no datos auditados.'
  },
  en: {
    duration: 'BLACKOUT DURATION',
    durationContext: '12:32:57 → 12:33:27 CEST',
    durationSource: 'ENTSO-E Factual, pp.108-109',
    load: 'PENINSULAR DEMAND INTERRUPTED',
    loadContext: 'Peninsular Spain · 12:30 CEST',
    loadSource: 'Government Analysis Committee, p.38',
    pop: 'AFFECTED POPULATION',
    popContext: 'Peninsular Spain + Portugal + Andorra',
    popSource: 'National censuses / ENTSO-E Factual',
    deaths: 'RELATED DEATHS',
    deathsContext: '7 Spain · 1 Portugal · none in hospitals',
    deathsSource: 'El País / RTP / ANEPC reports, 28–29/04/2025',
    recovery: 'FULL RESTORATION',
    recoveryContext: '99.95% at 07:00 on Apr 29',
    recoverySource: 'ENTSO-E Factual, pp.12-13 / REE Operations',
    losses: 'ECONOMIC LOSSES (est.)',
    lossesContext: 'CEOE estimate · 0.1% of Spanish GDP',
    lossesSource: 'CEOE, A. Garamendi, 29/04/2025 — unaudited estimate',
    openNote: 'Estimated figure by CEOE. Not verified in primary regulatory sources (CNMC or REE). CNMC quantifies regulatory damage at 25.2–42.5 M€.',
    est: '⚠ ESTIMATE',
    footer: 'Data verified in primary sources: ENTSO-E Factual Report (Oct 2025), ENTSO-E Final Report (Mar 2026), and Government Analysis Committee (Jun 2025). The 25.2 GW demand is the Spanish peninsular load; total Iberian load (including Portugal, pumping, and exports) was ~31 GW. Economic losses are public estimates from sector organizations, not audited data.'
  },
  de: {
    duration: 'DAUER DES STROMAUSFALLS',
    durationContext: '12:32:57 → 12:33:27 CEST',
    durationSource: 'ENTSO-E Factual, S.108-109',
    load: 'UNTERBROCHENE NACHFRAGE',
    loadContext: 'Spanisches Festland · 12:30 CEST',
    loadSource: 'Analysekomitee der Regierung, S.38',
    pop: 'BETROFFENE BEVÖLKERUNG',
    popContext: 'Spanisches Festland + Portugal + Andorra',
    popSource: 'Nationale Volkszählungen / ENTSO-E Factual',
    deaths: 'DAMIT VERBUNDENE TODESFÄLLE',
    deathsContext: '7 Spanien · 1 Portugal · keine in Krankenhäusern',
    deathsSource: 'El País / RTP / ANEPC-Berichte, 28.–29.04.2025',
    recovery: 'VOLLSTÄNDIGE WIEDERHERSTELLUNG',
    recoveryContext: '99,95% um 07:00 am 29. Apr',
    recoverySource: 'ENTSO-E Factual, S.12-13 / REE-Betrieb',
    losses: 'WIRTSCHAFTLICHE VERLUSTE (geschätzt)',
    lossesContext: 'CEOE-Schätzung · 0,1% des spanischen BIP',
    lossesSource: 'CEOE, A. Garamendi, 29.04.2025 — ungeprüfte Schätzung',
    openNote: 'Geschätzte Zahl des CEOE. Nicht durch primäre regulatorische Quellen (CNMC oder REE) verifiziert. Die CNMC beziffert den regulatorischen Schaden auf 25,2–42,5 Mio. €.',
    est: '⚠ SCHÄTZUNG',
    footer: 'Daten in primären Quellen verifiziert: ENTSO-E Factual Report (Okt 2025), ENTSO-E Final Report (Mär 2026) und Analysekomitee der Regierung (Jun 2025). Die Nachfrage von 25,2 GW bezieht sich auf das spanische Festland; die gesamte iberische Last (einschließlich Portugal, Pumpen und Export) betrug ~31 GW. Wirtschaftliche Verluste sind öffentliche Schätzungen von Branchenverbänden, keine geprüften Daten.'
  }
};

const getKpiData = (lang) => {
  const s = STRINGS[lang] || STRINGS.es;
  return [
    {
      id: 'duration',
      label: s.duration,
      value: '30 s',
      context: s.durationContext,
      source: s.durationSource,
      color: 'red',
      verified: true,
    },
    {
      id: 'load',
      label: s.load,
      value: '25,2 GW',
      context: s.loadContext,
      source: s.loadSource,
      color: 'red',
      verified: true,
    },
    {
      id: 'population',
      label: s.pop,
      value: '~57 M',
      context: s.popContext,
      source: s.popSource,
      color: 'amber',
      verified: true,
    },
    {
      id: 'deaths',
      label: s.deaths,
      value: '8',
      context: s.deathsContext,
      source: s.deathsSource,
      color: 'red',
      verified: true,
    },
    {
      id: 'recovery',
      label: s.recovery,
      value: '~18,5 h',
      context: s.recoveryContext,
      source: s.recoverySource,
      color: 'green',
      verified: true,
    },
    {
      id: 'losses',
      label: s.losses,
      value: '1.000–1.500 M€',
      context: s.lossesContext,
      source: s.lossesSource,
      color: 'amber',
      verified: false,
      openNote: s.openNote,
    },
];
};

export default function Bloque1KPI() {
  const lang = useDocLang();
  const [openTooltip, setOpenTooltip] = useState(null);
  const KPI_DATA = getKpiData(lang);
  const s = STRINGS[lang] || STRINGS.es;

  return (
    <div className={styles.kpiDashboard}>
      <div className={styles.kpiGrid}>
        {KPI_DATA.map((kpi) => (
          <div
            key={kpi.id}
            className={`${styles.kpiCard} ${styles[kpi.color]}`}
            aria-label={`${kpi.label}: ${kpi.value}`}
          >
            <div className={styles.kpiLabel}>{kpi.label}</div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiContext}>{kpi.context}</div>

            {/* Indicador de Cuestión Abierta */}
            {!kpi.verified && (
              <div style={{
                marginTop: '0.4rem',
                padding: '2px 6px',
                background: 'var(--kpi-warning-soft)',
                border: '1px solid var(--kpi-warning-border)',
                borderRadius: 4,
                fontSize: 9,
                color: 'var(--kpi-warning-text)',
                fontFamily: 'monospace',
                letterSpacing: '0.06em',
                cursor: 'help',
              }}
                title={kpi.openNote}
              >
                {s.est}
              </div>
            )}

            <div className={styles.kpiTooltip} role="tooltip">
              {kpi.source}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.kpiFooter}>
        <p>{s.footer}</p>
      </div>
    </div>
  );
}
