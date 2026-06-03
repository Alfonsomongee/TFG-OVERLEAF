const fs = require('fs');
const file = 'src/components/ResumenCifras/Bloque1KPI.jsx';
let code = fs.readFileSync(file, 'utf8');

const STRINGS = {
  es: {
    duration: 'DURACIÓN DEL COLAPSO',
    durationContext: '12:32:57 ? 12:33:27 CEST',
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
    est: '? ESTIMACIÓN',
    footer: 'Datos verificados en fuentes primarias: ENTSO-E Factual Report (oct. 2025), ENTSO-E Final Report (mar. 2026) y Comité de Análisis del Gobierno (jun. 2025). La demanda de 25,2 GW es la carga peninsular española; la carga ibérica total (incluyendo Portugal, bombeo y exportación) era ~31 GW. Las pérdidas económicas son estimaciones públicas de organizaciones sectoriales, no datos auditados.'
  },
  en: {
    duration: 'BLACKOUT DURATION',
    durationContext: '12:32:57 ? 12:33:27 CEST',
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
    est: '? ESTIMATE',
    footer: 'Data verified in primary sources: ENTSO-E Factual Report (Oct 2025), ENTSO-E Final Report (Mar 2026), and Government Analysis Committee (Jun 2025). The 25.2 GW demand is the Spanish peninsular load; total Iberian load (including Portugal, pumping, and exports) was ~31 GW. Economic losses are public estimates from sector organizations, not audited data.'
  },
  de: {
    duration: 'DAUER DES STROMAUSFALLS',
    durationContext: '12:32:57 ? 12:33:27 CEST',
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
    est: '? SCHÄTZUNG',
    footer: 'Daten in primären Quellen verifiziert: ENTSO-E Factual Report (Okt 2025), ENTSO-E Final Report (Mär 2026) und Analysekomitee der Regierung (Jun 2025). Die Nachfrage von 25,2 GW bezieht sich auf das spanische Festland; die gesamte iberische Last (einschließlich Portugal, Pumpen und Export) betrug ~31 GW. Wirtschaftliche Verluste sind öffentliche Schätzungen von Branchenverbänden, keine geprüften Daten.'
  }
};

const importStat = "import { useDocLang } from '@site/src/hooks/useDocLang';\n";
if (!code.includes('useDocLang')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\n" + importStat);
}

const functionStr = const getKpiData = (lang) => {
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
};;

code = code.replace(/const KPI_DATA = \[\s*\{[\s\S]*?\n\];/, 'const STRINGS = ' + JSON.stringify(STRINGS, null, 2) + ';\n\n' + functionStr);

code = code.replace("export default function Bloque1KPI() {", "export default function Bloque1KPI() {\n  const lang = useDocLang();\n  const KPI_DATA = getKpiData(lang);\n  const s = STRINGS[lang] || STRINGS.es;");

code = code.replace("? ESTIMACIÓN", "{s.est}");

code = code.replace(/<p>\s*Datos verificados[\s\S]*?<\/p>/, "<p>{s.footer}</p>");

fs.writeFileSync(file, code);
console.log('Bloque1KPI translated!');
