import React, { useState, useEffect } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import Head from '@docusaurus/Head';

export default function ExecutiveHook() {
  const [showSplash, setShowSplash] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [isIntroPage, setIsIntroPage] = useState(true);

  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  const lang = i18n.currentLocale;

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const isIntro = path === '/' || path === '' || (path.startsWith(`/${lang}`) && path.split('/').filter(Boolean).length <= 1);
    setIsIntroPage(isIntro);

    if (typeof window !== 'undefined') {
      const btn = document.getElementById('zen-mode-toggle');
      if (btn) {
        btn.style.display = isIntro ? 'none' : 'flex';
      }

      // Add/remove intro-page class and lock scroll
      if (isIntro) {
        document.body.classList.add('intro-page');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('intro-page');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }

    // Cleanup: when component unmounts (navigating away from intro), always restore
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('intro-page');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        const btn = document.getElementById('zen-mode-toggle');
        if (btn) btn.style.display = 'flex';
      }
    };
  }, [location.pathname, lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splash_seen_2')) {
        setShowSplash(false);
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        const btn = document.getElementById('zen-mode-toggle');
        if (btn) btn.style.display = 'flex';
      }
    };
  }, []);

  useEffect(() => {
    const restoreLayout = () => {
      const sidebar = document.querySelector('.theme-doc-sidebar-container');
      const tocDesktop = document.querySelector('.theme-doc-toc-desktop');
      const tocMobile = document.querySelector('.theme-doc-toc-mobile');
      const footer = document.querySelector('footer');
      const main = document.querySelector('main');
      if (sidebar) sidebar.style.display = '';
      if (tocDesktop) tocDesktop.style.display = '';
      if (tocMobile) tocMobile.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.style.width = '';
        main.style.marginLeft = '';
        main.style.marginRight = '';
        main.style.padding = '';
        main.style.maxWidth = '';
      }
    };

    if (typeof window !== 'undefined') {
      const path = location.pathname.toLowerCase();
      const isIntro = path === '/' || path === '' || (path.startsWith(`/${lang}`) && path.split('/').filter(Boolean).length <= 1);

      if (isIntro) {
        const sidebar = document.querySelector('.theme-doc-sidebar-container');
        const tocDesktop = document.querySelector('.theme-doc-toc-desktop');
        const tocMobile = document.querySelector('.theme-doc-toc-mobile');
        const footer = document.querySelector('footer');
        const main = document.querySelector('main');
        if (sidebar) sidebar.style.display = 'none';
        if (tocDesktop) tocDesktop.style.display = 'none';
        if (tocMobile) tocMobile.style.display = 'none';
        if (footer) footer.style.display = 'none';
        if (main) {
          main.style.width = '100vw';
          main.style.marginLeft = 'calc(-50vw + 50%)';
          main.style.marginRight = '0';
          main.style.padding = '0';
          main.style.maxWidth = '100vw';
        }
      }
    }

    // Cleanup: always restore when navigating away or unmounting
    return restoreLayout;
  }, [location.pathname, lang]);

  useEffect(() => {
    if (!showSplash) return;

    document.body.style.overflow = 'hidden';
    const start = Date.now();
    let animationFrame;

    const animate = () => {
      const ms = Date.now() - start;
      setElapsed(ms);
      if (ms < 10000) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = '';
    };
  }, [showSplash]);

  const handleEnter = () => {
    setShowSplash(false);
    sessionStorage.setItem('splash_seen_2', '1');
  };

  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        splashTitle: 'ANATOMY OF A\nSYSTEMIC COLLAPSE',
        splashSubtitle: 'FORENSIC ANALYSIS OF THE IBERIAN BLACKOUT',
        splashClick: 'CLICK TO ENTER',
        statPower: 'Power Lost', statSeverity: 'ENTSO-E Severity', statDate: 'April 28 2025', statAffected: 'Affected',
        heroTitle1: 'Anatomy of a', heroTitleHighlight: 'Systemic Collapse',
        heroSubtitle: 'Forensic analysis of the 2025 Iberian Peninsula blackout',
        startAnalysis: 'Start Analysis ⚡',
        cards: [
          { title: 'FORENSIC ANALYSIS', description: '27-second cascade dissection: oscillations, Tap‑Lag, overvoltages and the voltage zero.' },
          { title: 'CONFLICTING REPORTS', description: 'Three institutional narratives: Administration, Generators (ICAI) and ENTSO‑E.' },
          { title: 'REAL CHARTS', description: 'ENTSO‑E, ESIOS and PMU records. Original data from the collapse.' },
          { title: 'ECONOMIC IMPACT', description: 'Direct cost (VOLL), multi-million lawsuits and effect on electro-intensive consumers.' },
          { title: 'RESILIENCE & FUTURE', description: 'Electromechanical inertia, Short‑Circuit Ratio (SCR) and the Grid‑Forming mandate.' },
          { title: 'AI IN THE THESIS', description: 'Use of LLMs for chronological reconciliation and physical validation of hypotheses.' },
        ],
      };
      case 'pt': return {
        splashTitle: 'ANATOMIA DE UM\nCOLAPSO SISTÉMICO',
        splashSubtitle: 'ANÁLISE FORENSE DO APAGÃO IBÉRICO',
        splashClick: 'CLIQUE PARA ENTRAR',
        statPower: 'Potência Perdida', statSeverity: 'Severidade ENTSO-E', statDate: '28 Abril 2025', statAffected: 'Afetados',
        heroTitle1: 'Anatomia de um', heroTitleHighlight: 'Colapso Sistémico',
        heroSubtitle: 'Análise forense do apagão da Península Ibérica de 2025',
        startAnalysis: 'Iniciar Análise ⚡',
        cards: [
          { title: 'ANÁLISE FORENSE', description: 'Dissecção da cascata de 27 segundos: oscilações, Tap‑Lag, sobretensões e o zero de tensão.' },
          { title: 'RELATÓRIOS EM CONFLITO', description: 'As três narrativas institucionais: Administração, Geradores (ICAI) e ENTSO‑E.' },
          { title: 'GRÁFICOS REAIS', description: 'Registos da ENTSO‑E, ESIOS e PMU. Dados originais do colapso.' },
          { title: 'IMPACTO ECONÓMICO', description: 'Custo direto (VOLL), litígios milionários e efeito nos consumidores electrointensivos.' },
          { title: 'RESILIÊNCIA E FUTURO', description: 'Inércia eletromecânica, Short‑Circuit Ratio (SCR) e o mandato Grid‑Forming.' },
          { title: 'IA NA TESE', description: 'Uso de LLMs para reconciliação cronológica e validação física de hipóteses.' },
        ],
      };
      case 'fr': return {
        splashTitle: 'ANATOMIE D\'UN\nEFFONDREMENT SYSTÉMIQUE',
        splashSubtitle: 'ANALYSE FORENSIQUE DU BLACK-OUT IBÉRIQUE',
        splashClick: 'CLIQUEZ POUR ENTRER',
        statPower: 'Puissance Perdue', statSeverity: 'Sévérité ENTSO-E', statDate: '28 avril 2025', statAffected: 'Personnes Touchées',
        heroTitle1: "Anatomie d'un", heroTitleHighlight: 'Effondrement Systémique',
        heroSubtitle: "Analyse forensique du black-out de la péninsule ibérique en 2025",
        startAnalysis: "Commencer l'analyse ⚡",
        cards: [
          { title: 'ANALYSE FORENSIQUE', description: 'Dissection de la cascade de 27 secondes : oscillations, Tap‑Lag, surtensions et le zéro de tension.' },
          { title: 'RAPPORTS EN CONFLIT', description: 'Les trois narratives institutionnelles : Administration, Générateurs (ICAI) et ENTSO‑E.' },
          { title: 'GRAPHIQUES RÉELS', description: 'Enregistrements ENTSO‑E, ESIOS et PMU. Données originales de l\'effondrement.' },
          { title: 'IMPACT ÉCONOMIQUE', description: 'Coût direct (VOLL), litiges multimillionnaires et effet sur les consommateurs électro-intensifs.' },
          { title: 'RÉSILIENCE ET FUTUR', description: 'Inertie électromécanique, Short‑Circuit Ratio (SCR) et le mandat Grid‑Forming.' },
          { title: 'IA DANS LA THÈSE', description: 'Utilisation des LLMs pour la réconciliation chronologique et la validation physique des hypothèses.' },
        ],
      };
      case 'it': return {
        splashTitle: 'ANATOMIA DI UN\nCOLLASSO SISTEMICO',
        splashSubtitle: 'ANALISI FORENSE DEL BLACKOUT IBERICO',
        splashClick: 'CLICCA PER ENTRARE',
        statPower: 'Potenza Persa', statSeverity: 'Gravità ENTSO-E', statDate: '28 aprile 2025', statAffected: 'Persone Coinvolte',
        heroTitle1: 'Anatomia di un', heroTitleHighlight: 'Collasso Sistemico',
        heroSubtitle: 'Analisi forense del blackout della penisola iberica del 2025',
        startAnalysis: "Inizia l'analisi ⚡",
        cards: [
          { title: 'ANALISI FORENSE', description: 'Dissezione della cascata di 27 secondi: oscillazioni, Tap‑Lag, sovratensioni e il punto zero di tensione.' },
          { title: 'RAPPORTI IN CONFLITTO', description: 'Le tre narrative istituzionali: Amministrazione, Generatori (ICAI) e ENTSO‑E.' },
          { title: 'GRAFICI REALI', description: 'Registrazioni ENTSO‑E, ESIOS e PMU. Dati originali del collasso.' },
          { title: 'IMPATTO ECONOMICO', description: 'Costo diretto (VOLL), cause legali milionarie ed effetto sui consumatori elettrointensivi.' },
          { title: 'RESILIENZA E FUTURO', description: 'Inerzia elettromeccanica, Short‑Circuit Ratio (SCR) e il mandato Grid‑Forming.' },
          { title: 'IA NELLA TESI', description: 'Uso degli LLM per la riconciliazione cronologica e la validazione fisica delle ipotesi.' },
        ],
      };
      case 'de': return {
        splashTitle: 'ANATOMIE EINES\nSYSTEMKOLLAPSES',
        splashSubtitle: 'FORENSISCHE ANALYSE DES IBERISCHEN BLACKOUTS',
        splashClick: 'KLICKEN SIE ZUM BETRETEN',
        statPower: 'Leistungsverlust', statSeverity: 'ENTSO-E Schweregrad', statDate: '28. April 2025', statAffected: 'Betroffene',
        heroTitle1: 'Anatomie eines', heroTitleHighlight: 'Systemkollapses',
        heroSubtitle: 'Forensische Analyse des Stromausfalls auf der Iberischen Halbinsel 2025',
        startAnalysis: 'Analyse starten ⚡',
        cards: [
          { title: 'FORENSISCHE ANALYSE', description: '27-Sekunden-Kaskade: Schwingungen, Tap‑Lag, Überspannungen und der Spannungsnullpunkt.' },
          { title: 'WIDERSPRÜCHLICHE BERICHTE', description: 'Drei institutionelle Narrative: Verwaltung, Erzeuger (ICAI) und ENTSO‑E.' },
          { title: 'ECHTE DIAGRAMME', description: 'ENTSO‑E, ESIOS und PMU-Aufzeichnungen. Originaldaten des Zusammenbruchs.' },
          { title: 'WIRTSCHAFTLICHE AUSWIRKUNG', description: 'Direkte Kosten (VOLL), millionenschwere Rechtsstreitigkeiten und Auswirkungen auf stromintensive Verbraucher.' },
          { title: 'RESILIENZ & ZUKUNFT', description: 'Elektromechanische Trägheit, Kurzschlussleistungsverhältnis (SCR) und das Grid‑Forming-Mandat.' },
          { title: 'KI IN DER ARBEIT', description: 'Einsatz von LLMs zur chronologischen Abstimmung und physikalischen Validierung von Hypothesen.' },
        ],
      };
      default: return {
        splashTitle: 'ANATOMÍA DE UN\nCOLAPSO SISTÉMICO',
        splashSubtitle: 'ANÁLISIS FORENSE DEL APAGÓN IBÉRICO',
        splashClick: 'CLICK PARA ENTRAR',
        statPower: 'Potencia Perdida', statSeverity: 'Severidad ENTSO-E', statDate: '28 Abril 2025', statAffected: 'Afectados',
        heroTitle1: 'Anatomía de un', heroTitleHighlight: 'Colapso Sistémico',
        heroSubtitle: 'Análisis forense del apagón de la Península Ibérica de 2025',
        startAnalysis: 'Comenzar Análisis ⚡',
        cards: [
          { title: 'ANÁLISIS FORENSE', description: 'Disección de la cascada de 27 segundos: oscilaciones, Tap‑Lag, sobretensiones y el cero de tensión.' },
          { title: 'INFORMES EN CONFLICTO', description: 'Las tres narrativas institucionales: Administración, Generadores (ICAI) y ENTSO‑E.' },
          { title: 'GRÁFICAS REALES', description: 'Registros de ENTSO‑E, ESIOS y PMU. Datos originales del colapso.' },
          { title: 'IMPACTO ECONÓMICO', description: 'Coste directo (VOLL), litigios multimillonarios y efecto en consumidores electrointensivos.' },
          { title: 'RESILIENCIA Y FUTURO', description: 'Inercia electromecánica, Short‑Circuit Ratio (SCR) y el mandato Grid‑Forming.' },
          { title: 'IA EN EL TFG', description: 'Uso de LLMs para reconciliación cronológica y validación física de hipótesis.' },
        ],
      };
    }
  };
  const strings = getStrings(lang);

  let titleOpacity = Math.min(1, Math.max(0, (elapsed - 500) / 1000));
  let subtitleOpacity = Math.min(1, Math.max(0, (elapsed - 1500) / 1000));
  let authorOpacity = Math.min(1, Math.max(0, (elapsed - 2500) / 1000));
  let clickOpacity = Math.min(1, Math.max(0, (elapsed - 3500) / 1000));

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Alfa+Slab+One&display=swap" rel="stylesheet" />
      </Head>

      {showSplash && (
        <div
          onClick={handleEnter}
          className={styles.splashOverlay}
        >
          <h1 className={styles.splashMainTitle} style={{ opacity: titleOpacity }}>
            {strings.splashTitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>{line}{i === 0 && <br/>}</React.Fragment>
            ))}
          </h1>
          <h2 className={styles.splashSubtitle} style={{ opacity: subtitleOpacity }}>
            {strings.splashSubtitle}
          </h2>
          <p className={styles.splashAuthor} style={{ opacity: authorOpacity }}>
            ALFONSO MONGE
          </p>
          <div style={{ opacity: clickOpacity }}>
            <p className={styles.splashClick}>{strings.splashClick}</p>
          </div>
        </div>
      )}

      <div id="executive-hook" className={styles.heroContainer} style={{ visibility: showSplash ? 'hidden' : 'visible' }}>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {strings.heroTitle1}{' '}
            <span className={styles.highlight}>{strings.heroTitleHighlight}</span>
          </h1>
          <p className={styles.subtitle}>{strings.heroSubtitle}</p>

          <div className={styles.statsBanner}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>25,2 GW</span>
              <span className={styles.statLabel}>{strings.statPower}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>Scale 3</span>
              <span className={styles.statLabel}>{strings.statSeverity}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>12:33 CEST</span>
              <span className={styles.statLabel}>{strings.statDate}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>60M</span>
              <span className={styles.statLabel}>{strings.statAffected}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link className={`button button--primary ${styles.primaryBtn}`} to="/introduccion">
              {strings.startAnalysis}
            </Link>
          </div>

        </div>
      </div>

    </>
  );
}
