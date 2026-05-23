import React, { useState, useEffect, useRef } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { motion } from 'framer-motion';

export default function ExecutiveHook() {
  const [isFading, setIsFading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

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
        splashTitle: "BLACK-OUT IBÉRIQUE 2025",
        splashSubtitle: "Analyse médico-légale de l'effondrement systémique",
        enter: "ENTRER",
        statPower: "Puissance Perdue",
        statSeverity: "Sévérité ENTSO-E",
        statDate: "28 avril 2025",
        statAffected: "Personnes Touchées",
        heroTitle1: "Anatomie d'un",
        heroTitleHighlight: "Effondrement Systémique",
        heroSubtitle: "Analyse du black-out de la péninsule ibérique en 2025 : instabilité de tension, déficit d'inertie et transition structurelle vers des réseaux 100 % basés sur onduleurs (IBR).",
        box1Title: "Que s'est-il passé ?",
        box1Text: "La perte du transformateur de Grenade (400/220 kV) a déclenché une cascade de surtensions qui a effondré le réseau ibérique en 11 secondes, entraînant 31 GW de demande et déconnectant la liaison HVDC avec la France.",
        box2Title: "Outils et Méthodologie",
        box2Text: "Écoulement de charge de Newton-Raphson, analyse de stabilité transitoire, modélisation RoCoF et évaluation de contingence N-1. Infrastructure Web basée sur Docusaurus, MDX, KaTeX et React.",
        box3Title: "Conclusion Principale",
        box3Text: "L'incident n'était pas une défaillance fortuite, mais le symptôme d'une faiblesse structurelle (effondrement Q-V) induite par une pénétration solaire extrême sans support de court-circuit suffisant.",
        startAnalysis: "Commencer l'analyse ⚡",
        download: "TÉLÉCHARGER LA THÈSE"
      };
      case 'it': return {
        splashTitle: "BLACKOUT IBERICO 2025",
        splashSubtitle: "Analisi forense del collasso sistemico",
        enter: "ENTRA",
        statPower: "Potenza Persa",
        statSeverity: "Gravità ENTSO-E",
        statDate: "28 aprile 2025",
        statAffected: "Persone Coinvolte",
        heroTitle1: "Anatomia di un",
        heroTitleHighlight: "Collasso Sistemico",
        heroSubtitle: "Analisi forense del blackout della penisola iberica del 2025: instabilità della tensione, deficit di inerzia e transizione strutturale verso reti basate al 100% su inverter (IBR).",
        box1Title: "Cosa è successo?",
        box1Text: "La perdita del trasformatore di Granada (400/220 kV) ha innescato una cascata di sovratensioni che ha fatto collassare la rete iberica in 11 secondi, trascinando 31 GW di domanda e disconnettendo il collegamento HVDC con la Francia.",
        box2Title: "Strumenti e Metodologia",
        box2Text: "Flusso di carico Newton-Raphson, analisi della stabilità transitoria, modellazione RoCoF e valutazione delle contingenze N-1. Infrastruttura Web basata su Docusaurus, MDX, KaTeX e React.",
        box3Title: "Conclusione Principale",
        box3Text: "L'incidente non è stato un guasto fortuito, ma il sintomo di una debolezza strutturale (collasso Q-V) indotta da un'estrema penetrazione solare senza sufficiente supporto di cortocircuito.",
        startAnalysis: "Inizia l'analisi ⚡",
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
        heroSubtitle: "Forensische Analyse des Stromausfalls auf der Iberischen Halbinsel 2025: Spannungsinstabilität, Trägheitsdefizit und der strukturelle Übergang zu 100 % umrichterbasierten Ressourcen (IBR).",
        box1Title: "Was ist passiert?",
        box1Text: "Der Ausfall des Transformators in Granada (400/220 kV) löste eine Kaskade von Überspannungen aus, die das iberische Netz in 11 Sekunden zum Einsturz brachte, 31 GW Nachfrage mit sich zog und die HGÜ-Verbindung mit Frankreich trennte.",
        box2Title: "Werkzeuge & Methodik",
        box2Text: "Newton-Raphson-Lastfluss, transiente Stabilitätsanalyse, RoCoF-Modellierung und N-1-Kontingenzbewertung. Web-Infrastruktur basierend auf Docusaurus, MDX, KaTeX und React.",
        box3Title: "Hauptergebnis",
        box3Text: "Der Vorfall war kein zufälliger Ausfall, sondern das Symptom einer strukturellen Schwäche (Q-V-Kollaps), die durch extreme solare Durchdringung ohne ausreichende Kurzschlussunterstützung hervorgerufen wurde.",
        startAnalysis: "Analyse starten ⚡",
        download: "THESE HERUNTERLADEN"
      };
      default: return {
        splashTitle: "APAGÓN IBÉRICO 2025",
        splashSubtitle: "Análisis Forense del Colapso Sistémico",
        enter: "ADELANTE",
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
        box2Text: "Flujo de cargas Newton-Raphson, análisis de estabilidad transitoria, modelado RoCoF y evaluación de contingencia N-1. Infraestructura web basada en Docusaurus, MDX, KaTeX y React.",
        box3Title: "Conclusión Principal",
        box3Text: "El incidente no fue un fallo fortuito, sino el síntoma de una debilidad estructural (colapso Q-V) inducida por una penetración solar extrema sin suficiente soporte de cortocircuito.",
        startAnalysis: "Comenzar Análisis ⚡",
        download: "DESCARGAR TFG"
      };
    }
  };
  const strings = getStrings(lang);

  const handleSplashClick = () => {
    if (isFading || isHidden) return;
    
    // Play the epic sound via the audio DOM element
    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(e => console.error('Audio play failed:', e));
    }

    // Force fade out immediately on click
    setIsFading(true);
    setTimeout(() => {
      setIsHidden(true);
    }, 1500); // Wait for the fade out CSS transition
  };

  useEffect(() => {
    // Start fading out after 4.5 seconds (gives time for blackout to finish)
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 4500);

    // Completely remove from DOM after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsHidden(true);
    }, 6000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {/* Splash Screen */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />
      {!isHidden && (
        <div 
          className={`${styles.splashContainer} ${isFading ? styles.fadeOut : ''}`}
          onClick={handleSplashClick}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.splashBgIlluminated}></div>
          <motion.div 
            className={styles.splashBgDark}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1], delay: 1.5 }}
          />
          <div className={styles.splashOverlay}></div>
          <div className={styles.splashContent}>
            <motion.h1 
              className={styles.splashTitle}
              initial={{ opacity: 0, scale: 0.95, y: 15, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.2 }}
            >
              {strings.splashTitle}
            </motion.h1>
            <motion.p 
              className={styles.splashSubtitle}
              initial={{ opacity: 0, scale: 0.95, y: 35, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 20, filter: 'blur(0px)' }}
              transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.8 }}
            >
              {strings.splashSubtitle}
            </motion.p>
            <motion.p 
              className={styles.authorName}
              initial={{ opacity: 0, y: 10, textShadow: '0 0 0px rgba(255,255,255,0)' }}
              animate={{ opacity: 0.9, y: 0, textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.4)' }}
              transition={{ duration: 2, ease: "easeInOut", delay: 1.5 }}
            >
              Alfonso Monge Díaz-Ángel
            </motion.p>
          </div>
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
