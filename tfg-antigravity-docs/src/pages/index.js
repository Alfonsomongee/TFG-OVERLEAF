import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomeHero from '@site/src/components/HomeHero';
import HomeKeyMetrics from '@site/src/components/HomeKeyMetrics';
import HomeThesisPanel from '@site/src/components/HomeThesisPanel';
import HomeReadingPaths from '@site/src/components/HomeReadingPaths';
import HomeIncidentTimeline from '@site/src/components/HomeIncidentTimeline';
import HomeNarrativeMatrix from '@site/src/components/HomeNarrativeMatrix';
import HomeAnnexes from '@site/src/components/HomeAnnexes';
import HomeChatInvite from '@site/src/components/HomeChatInvite';

const TRANSLATIONS = {
  es: {
    title: "Análisis forense del apagón ibérico del 28-A",
    description: "Reconstrucción técnica, económica y social de la mayor perturbación del área síncrona continental europea. 170 evidencias, 10 anexos, 28 simuladores interactivos."
  },
  en: {
    title: "Forensic analysis of the 28-A Iberian blackout",
    description: "Technical, economic, and social reconstruction of the largest disturbance in the European continental synchronous area in two decades. 170 evidences, 10 annexes, 28 interactive simulators."
  },
  de: {
    title: "Forensische Analyse des 28-A iberischen Blackouts",
    description: "Technische, wirtschaftliche und soziale Rekonstruktion der größten Störung im europäischen kontinentalen Synchrongebiet seit zwei Jahrzehnten. 170 Nachweise, 10 Anhänge, 28 interaktive Simulatoren."
  },
  'zh-Hans': {
    title: "28-A伊比利亚大停电事故法医分析",
    description: "对两年来欧洲大陆同步电网最大一次扰动进行的技术、经济和社交重构。包含170项证据、10个附录、28个互动模拟器。"
  }
};

export default function Home() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;

  return (
    <Layout
      title={t.title}
      description={t.description}
    >
      <HomeHero />
      <HomeKeyMetrics />
      <HomeThesisPanel />
      <HomeReadingPaths />
      <HomeIncidentTimeline />
      <HomeNarrativeMatrix />
      <HomeAnnexes />
      <HomeChatInvite />
    </Layout>
  );
}
