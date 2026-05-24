import React, { useState, useEffect, useRef } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import { motion } from 'framer-motion';

const PHASES = {
  BLACK:   { id: 0, duration: 600 },
  MAP:     { id: 1, duration: 2000 },
  TITLE:   { id: 2, duration: 2500 },
  FADEOUT: { id: 3, duration: 800 },
  DONE:    { id: 4, duration: 0 }
};

export default function ExecutiveHook() {
  const [phase, setPhase] = useState(PHASES.BLACK.id);
  const [visible, setVisible] = useState(true);

  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;
  const audioUrl = useBaseUrl('/audio/epic-hit.mp3');
  const audioRef = useRef(null);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        splashTitle: "IBERIAN BLACKOUT 2025",
        splashSubtitle: "Forensic Analysis of Systemic Collapse",
        enter: "ENTER",
        statPower: "Power Lost",
        statSeverity: "ENTSO-E Severity",
        statDate: "April 28 2025",
        statAffected: "Affected",
        heroTitle1: "Anatomy of a",
        heroTitleHighlight: "Systemic Collapse",
        heroSubtitle: "Forensic analysis of the 2025 Iberian Peninsula blackout: voltage instability, inertia deficit and the structural transition towards 100% inverter-based resources (IBR).",
        box1Title: "What happened?",
        box1Text: "The loss of the Granada transformer (400/220 kV) triggered a cascade of overvoltages that collapsed the Iberian grid in 11 seconds, dragging 31 GW of demand and disconnecting the HVDC link with France.",
        box2Title: "Tools & Methodology",
        box2Text: "Newton-Raphson load flow, transient stability analysis, RoCoF modeling and N-1 contingency evaluation. Web infrastructure based on Docusaurus, MDX, KaTeX and React.",
        box3Title: "Main Conclusion",
        box3Text: "The incident was not a random failure, but the symptom of a structural weakness (Q-V collapse) induced by extreme solar penetration without sufficient short-circuit support.",
        startAnalysis: "Start Analysis ⚡",
        download: "DOWNLOAD THESIS"
      };
      case 'pt': return {
        splashTitle: "APAGÃO IBÉRICO 2025",
        splashSubtitle: "Análise Forense do Colapso Sistêmico",
        enter: "ENTRAR",
        statPower: "Potência Perdida",
        statSeverity: "Severidade ENTSO-E",
        statDate: "28 de Abril de 2025",
        statAffected: "Afetados",
        heroTitle1: "Anatomia de um",
        heroTitleHighlight: "Colapso Sistêmico",
        heroSubtitle: "Análise forense do apagão da Península Ibérica de 2025: instabilidade de tensão, déficit de inércia e a transição estrutural para redes 100% baseadas em inversores (IBR).",
        box1Title: "O que aconteceu?",
        box1Text: "A perda do transformador de Granada (400/220 kV) desencadeou uma cascata de sobretensões que colapsou a rede ibérica em 11 segundos, arrastando 31 GW de demanda e desconectando a ligação HVDC com a França.",
        box2Title: "Ferramentas e Metodologia",
        box2Text: "Fluxo de potência Newton-Raphson, análise de estabilidade transitória, modelagem RoCoF e avaliação de contingência N-1. Infraestrutura web baseada em Docusaurus, MDX, KaTeX e React.",
        box3Title: "Conclusão Principal",
        box3Text: "O incidente não foi uma falha fortuita, mas o sintoma de uma fraqueza estrutural (colapso Q-V) induzida por penetração solar extrema sem suporte de curto-circuito suficiente.",
        startAnalysis: "Iniciar Análise ⚡",
        download: "BAIXAR TESE"
      };
      case 'fr': return {
        splashTitle: "BLACKOUT IBÉRIQUE 2025",
        splashSubtitle: "Analyse Légale du Collapsus Systémique",
        enter: "ENTRER",
        statPower: "Puissance Perdue",
        statSeverity: "Sévérité ENTSO-E",
        statDate: "28 Avril 2025",
        statAffected: "Affectés",
        heroTitle1: "Anatomie d'un",
        heroTitleHighlight: "Collapsus Systémique",
        heroSubtitle: "Analyse légale du blackout de la Péninsule Ibérique de 2025 : instabilité de tension, déficit d'inertie et la transition structurelle vers des réseaux 100% basés sur des onduleurs (IBR).",
        box1Title: "Que s'est-il passé ?",
        box1Text: "La perte du transformateur de Grenade (400/220 kV) a déclenché une cascade de surtensions qui a fait s'effondrer le réseau ibérique en 11 secondes, entraînant 31 GW de demande et déconnectant la liaison HVDC avec la France.",
        box2Title: "Outils et Méthodologie",
        box2Text: "Flux de puissance Newton-Raphson, analyse de stabilité transitoire, modélisation RoCoF et évaluation de contingence N-1. Infrastructure web basée sur Docusaurus, MDX, KaTeX et React.",
        box3Title: "Conclusion Principale",
        box3Text: "L'incident n'était pas une défaillance fortuite, mais le symptôme d'une faiblesse structurelle (effondrement Q-V) induite par une pénétration solaire extrême sans support de court-circuit suffisant.",
        startAnalysis: "Démarrer l'Analyse ⚡",
        download: "TÉLÉCHARGER LA THÈSE"
      };
      case 'it': return {
        splashTitle: "BLACKOUT IBERICO 2025",
        splashSubtitle: "Analisi Forense del Collasso Sistemico",
        enter: "ENTRARE",
        statPower: "Potenza Persa",
        statSeverity: "Gravità ENTSO-E",
        statDate: "28 Aprile 2025",
        statAffected: "Colpiti",
        heroTitle1: "Anatomia di un",
        heroTitleHighlight: "Collasso Sistemico",
        heroSubtitle: "Analisi forense del blackout della Penisola Iberica del 2025: instabilità di tensione, deficit di inerzia e transizione strutturale verso reti basate al 100% su inverter (IBR).",
        box1Title: "Cosa è successo?",
        box1Text: "La perdita del trasformatore di Granada (400/220 kV) ha innescato una cascata di sovratensioni che ha fatto collassare la rete iberica in 11 secondi, trascinando con sé 31 GW di domanda e disconnettendo il collegamento HVDC con la Francia.",
        box2Title: "Strumenti e Metodologia",
        box2Text: "Flusso di potenza Newton-Raphson, analisi di stabilità transitoria, modellazione RoCoF e valutazione di contingenza N-1. Infrastruttura web basata su Docusaurus, MDX, KaTeX e React.",
        box3Title: "Conclusione Principale",
        box3Text: "L'incidente non è stato un guasto fortuito, ma il sintomo di una debolezza strutturale (collasso Q-V) indotta da una penetrazione solare estrema senza sufficiente supporto di cortocircuito.",
        startAnalysis: "Avvia Analisi ⚡",
        download: "SCARICA LA TESI"
      };
      case 'de': return {
        splashTitle: "IBERISCHER BLACKOUT 2025",
        splashSubtitle: "Forensische Analyse des Systemkollapses",
        enter: "EINTRETEN",
        statPower: "Leistungsverlust",
        statSeverity: "ENTSO-E Schweregrad",
        statDate: "28. April 2025",
        statAffected: "Betroffene",
        heroTitle1: "Anatomie eines",
        heroTitleHighlight: "Systemkollapses",
        heroSubtitle: "Forensische Analyse des Stromausfalls auf der Iberischen Halbinsel 2025: Spannungsinstabilität, Trägheitsdefizit und der strukturelle Übergang zu 100% wechselrichterbasierten Ressourcen (IBR).",
        box1Title: "Was ist passiert?",
        box1Text: "Der Ausfall des Transformators in Granada (400/220 kV) löste eine Kaskade von Überspannungen aus, die das iberische Netz in 11 Sekunden zusammenbrechen ließ, 31 GW Nachfrage mit sich riss und die HVDC-Verbindung mit Frankreich trennte.",
        box2Title: "Werkzeuge & Methodik",
        box2Text: "Newton-Raphson Lastfluss, transiente Stabilitätsanalyse, RoCoF-Modellierung und N-1 Kontingenzbewertung. Web-Infrastruktur basierend auf Docusaurus, MDX, KaTeX und React.",
        box3Title: "Haupterkenntnis",
        box3Text: "Der Vorfall war kein zufälliger Fehler, sondern das Symptom einer strukturellen Schwäche (Q-V-Kollaps), die durch extreme solare Durchdringung ohne ausreichende Kurzschlussunterstützung verursacht wurde.",
        startAnalysis: "Analyse Starten ⚡",
        download: "ARBEIT HERUNTERLADEN"
      };
      case 'es':
      default: return {
        splashTitle: "APAGÓN IBÉRICO 2025",
        splashSubtitle: "Análisis Forense del Colapso Sistémico",
        enter: "ENTRAR",
        statPower: "Potencia Perdida",
        statSeverity: "Severidad ENTSO-E",
        statDate: "28 Abril 2025",
        statAffected: "Afectados",
        heroTitle1: "Anatomía de un",
        heroTitleHighlight: "Colapso Sistémico",
        heroSubtitle: "Análisis forense del apagón de la Península Ibérica de 2025: inestabilidad de tensión, déficit de inercia y la transición estructural hacia redes 100% basadas en inversores (IBR).",
        box1Title: "¿Qué ocurrió?",
        box1Text: "La pérdida del transformador de Granada (400/220 kV) desencadenó una cascata de sobretensiones que colapsó la red ibérica en 11 segundos, arrastrando 31 GW de demanda y desconectando el enlace HVDC con Francia.",
        box2Title: "Herramientas y Metodología",
        box2Text: "Flujo de cargas Newton-Raphson, análisis de estabilidad transitoria, modelado RoCoF y evaluación de contingencias N-1. Infraestructura web basada en Docusaurus, MDX, KaTeX y React.",
        box3Title: "Conclusión Principal",
        box3Text: "El incidente no fue un fallo fortuito, sino el síntoma de una debilidad estructural (colapso Q-V) inducida por la extrema penetración solar sin suficiente soporte de cortocircuito.",
        startAnalysis: "Iniciar Análisis ⚡",
        download: "DESCARGAR TFM"
      };
    }
  };

  const strings = getStrings(lang);

  const fadeOutAudio = (durationMs) => {
    const audio = audioRef.current;
    if (!audio) return;
    const steps = 20;
    const interval = durationMs / steps;
    const startVol = audio.volume;
    let step = 0;
    const fade = setInterval(() => {
      step++;
      audio.volume = Math.max(0, startVol * (1 - step / steps));
      if (step >= steps) {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
      }
    }, interval);
  };

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('splash_seen')) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';

    const audio = audioRef.current;
    if (audio) {
      audio.muted = true;
      audio.volume = 0.25; 
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setTimeout(() => { if (audio) audio.muted = false; }, 1200);
          })
          .catch(() => console.log('Audio autoplay blocked by browser policy.'));
      }
    }

    const t1 = setTimeout(() => setPhase(PHASES.MAP.id),     PHASES.BLACK.duration);
    const t2 = setTimeout(() => setPhase(PHASES.TITLE.id),   PHASES.BLACK.duration + PHASES.MAP.duration);
    const t3 = setTimeout(() => {
      setPhase(PHASES.FADEOUT.id);
      fadeOutAudio(PHASES.FADEOUT.duration);
    }, PHASES.BLACK.duration + PHASES.MAP.duration + PHASES.TITLE.duration);
    const t4 = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('splash_seen', '1');
    }, PHASES.BLACK.duration + PHASES.MAP.duration + PHASES.TITLE.duration + PHASES.FADEOUT.duration);

    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); 
      document.body.style.overflow = ''; 
    };
  }, []);

  const handleSplashClick = () => {
    if (phase >= PHASES.FADEOUT.id || !visible) return;
    setPhase(PHASES.FADEOUT.id);
    fadeOutAudio(PHASES.FADEOUT.duration);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem('splash_seen', '1');
    }, PHASES.FADEOUT.duration);
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet" />
        {visible && (
          <style>{`
            .navbar, 
            .theme-doc-sidebar-container, 
            .theme-doc-breadcrumbs, 
            .theme-doc-toc-desktop,
            .theme-doc-footer {
              opacity: 0 !important;
              pointer-events: none !important;
            }
            .theme-doc-markdown {
              opacity: 0 !important;
            }
            body { 
              background-color: #000 !important; 
            }
          `}</style>
        )}
      </Head>
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      
      {visible && (
        <div 
          className={styles.splashContainer}
          onClick={handleSplashClick}
          style={{ 
            cursor: 'pointer',
            backgroundColor: '#000',
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 99999,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: phase === PHASES.FADEOUT.id ? 0 : 1,
            pointerEvents: phase === PHASES.FADEOUT.id ? 'none' : 'auto'
          }}
        >
          {phase >= PHASES.MAP.id && (
            <motion.div 
              className={styles.splashBgCinematic}
              style={{ backgroundImage: `url(${useBaseUrl('/img/cinematic_blackout.png')})` }}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1.15 }}
              transition={{ duration: 20, ease: "linear" }}
            />
          )}
          <div className={styles.splashOverlay}></div>
          
          {phase >= PHASES.TITLE.id && (
            <motion.div 
              className={styles.titleCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <p className={styles.authorName}>Alfonso Monge Díaz-Ángel</p>
              <div className={styles.titleDivider} />
              <h1 className={styles.workTitle}>
                El Apagón Ibérico del 28 de Abril de 2025
              </h1>
              <div className={styles.titleDivider} />
              <p className={styles.subtitle} style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '14px', fontFamily: 'monospace' }}>
                Trabajo Fin de Grado · Universidad de Sevilla
              </p>
            </motion.div>
          )}
        </div>
      )}

      <div id="executive-hook" className={styles.heroContainer}>
        {/* Top Banner / Event Scale */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>31 GW</span>
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

      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          {strings.heroTitle1} <span className={styles.highlight}>{strings.heroTitleHighlight}</span>
        </h1>
        <p className={styles.subtitle}>
          {strings.heroSubtitle}
        </p>

        {/* 90-second Executive Summary */}
        <div className={styles.execSummary}>
          <div className={styles.summaryBox}>
            <h3>{strings.box1Title}</h3>
            <p>{strings.box1Text}</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>{strings.box2Title}</h3>
            <p>{strings.box2Text}</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>{strings.box3Title}</h3>
            <p>{strings.box3Text}</p>
          </div>
        </div>

        {/* CTAs & Badges */}
        <div className={styles.actions}>
          <Link className={`button button--primary button--lg ${styles.primaryBtn}`} to="/contexto">
            {strings.startAnalysis}
          </Link>
          <a className={`button button--outline button--lg ${styles.secondaryBtn}`} href="https://github.com/Alfonsomongee/TFG-OVERLEAF" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub
          </a>
          <a className={`button button--outline button--lg ${styles.secondaryBtn}`} href="/tfg_antigravity(1).pdf" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            {strings.download}
          </a>
        </div>

        {/* Tech Stack Badges */}
        <div className={styles.techStack}>
          <span className={styles.techBadge}>Docusaurus v2</span>
          <span className={styles.techBadge}>React.js</span>
          <span className={styles.techBadge}>KaTeX</span>
          <span className={styles.techBadge}>Python Data Analytis</span>
          <span className={styles.techBadge}>Newton-Raphson Solver</span>
        </div>
        </div>
      </div>
    </>
  );
}
