import React, { useState, useEffect, useRef } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import { motion } from 'framer-motion';

export default function ExecutiveHook() {
  // Evitar FOUC: El splash se muestra por defecto en SSR y cliente inicial. 
  // Si en hidratación vemos que ya se ha reproducido, lo ocultamos al instante.
  const [showSplash, setShowSplash] = useState(true);
  const [phase, setPhase] = useState('waiting'); // 'waiting' | 'playing'
  const [elapsed, setElapsed] = useState(0);

  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;
  const audioMp3 = useBaseUrl('/audio/epic-hit.mp3');
  const audioOgg = useBaseUrl('/audio/epic-hit.ogg');
  const bgLit = useBaseUrl('/img/europe-night-lit.jpg');
  const bgDark = useBaseUrl('/img/europe-night-dark.jpg');
  
  const audioRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { statPower: 'Power Lost', statSeverity: 'ENTSO-E Severity', statDate: 'April 28 2025', statAffected: 'Affected', heroTitle1: 'Anatomy of a', heroTitleHighlight: 'Systemic Collapse', heroSubtitle: 'Forensic analysis of the 2025 Iberian Peninsula blackout: voltage instability, inertia deficit and the structural transition towards 100% inverter-based resources (IBR).', box1Title: 'What happened?', box1Text: 'The loss of the Granada transformer (400/220 kV) triggered a cascade of overvoltages that collapsed the Iberian grid in 11 seconds, dragging 31 GW of demand and disconnecting the HVDC link with France.', box2Title: 'Tools & Methodology', box2Text: 'Newton-Raphson load flow, transient stability analysis, RoCoF modeling and N-1 contingency evaluation. Web infrastructure based on Docusaurus, MDX, KaTeX and React.', box3Title: 'Main Conclusion', box3Text: 'The incident was not a random failure, but the symptom of a structural weakness (Q-V collapse) induced by extreme solar penetration without sufficient short-circuit support.', startAnalysis: 'Start Analysis ⚡', download: 'DOWNLOAD THESIS' };
      case 'pt': return { statPower: 'Potência Perdida', statSeverity: 'Severidade ENTSO-E', statDate: '28 de Abril de 2025', statAffected: 'Afetados', heroTitle1: 'Anatomia de um', heroTitleHighlight: 'Colapso Sistêmico', heroSubtitle: 'Análise forense do apagão da Península Ibérica de 2025: instabilidade de tensão, déficit de inércia e a transição estrutural para redes 100% baseadas em inversores (IBR).', box1Title: 'O que aconteceu?', box1Text: 'A perda do transformador de Granada (400/220 kV) desencadeou uma cascata de sobretensões que colapsou a rede ibérica em 11 segundos, arrastrando 31 GW de demanda e desconectando a ligação HVDC com a França.', box2Title: 'Ferramentas e Metodologia', box2Text: 'Fluxo de potência Newton-Raphson, análise de estabilidade transitória, modelagem RoCoF e avaliação de contingência N-1. Infraestrutura web baseada em Docusaurus, MDX, KaTeX e React.', box3Title: 'Conclusão Principal', box3Text: 'O incidente não foi uma falha fortuita, mas o sintoma de uma fraqueza estrutural (colapso Q-V) induzida por penetração solar extrema sem suporte de curto-circuito suficiente.', startAnalysis: 'Iniciar Análise ⚡', download: 'BAIXAR TESE' };
      case 'fr': return { statPower: 'Puissance Perdue', statSeverity: 'Sévérité ENTSO-E', statDate: '28 avril 2025', statAffected: 'Personnes Touchées', heroTitle1: 'Anatomie d\'un', heroTitleHighlight: 'Effondrement Systémique', heroSubtitle: 'Analyse du black-out de la péninsule ibérique en 2025 : instabilité de tension, déficit d\'inertie et transition structurelle vers des réseaux 100 % basés sur onduleurs (IBR).', box1Title: 'Que s\'est-il passé ?', box1Text: 'La perte du transformateur de Grenade (400/220 kV) a déclenché une cascade de surtensions qui a effondré le réseau ibérique en 11 secondes, entraînant 31 GW de demande et déconnectant la liaison HVDC avec la France.', box2Title: 'Outils et Méthodologie', box2Text: 'Écoulement de charge de Newton-Raphson, analyse de stabilité transitoire, modélisation RoCoF et évaluation de contingence N-1. Infrastructure Web basée sur Docusaurus, MDX, KaTeX et React.', box3Title: 'Conclusion Principale', box3Text: 'L\'incident n\'était pas une défaillance fortuite, mais le symptôme d\'une faiblesse structurelle (effondrement Q-V) induite par une pénétration solaire extrême sans support de court-circuit suffisant.', startAnalysis: 'Commencer l\'analyse ⚡', download: 'TÉLÉCHARGER LA THÈSE' };
      case 'it': return { statPower: 'Potenza Persa', statSeverity: 'Gravità ENTSO-E', statDate: '28 aprile 2025', statAffected: 'Persone Coinvolte', heroTitle1: 'Anatomia di un', heroTitleHighlight: 'Collasso Sistemico', heroSubtitle: 'Analisi forense del blackout della penisola iberica del 2025: instabilità della tensione, deficit di inerzia e transizione strutturale verso reti basate al 100% su inverter (IBR).', box1Title: 'Cosa è successo?', box1Text: 'La perdita del trasformatore di Granada (400/220 kV) ha innescato una cascata di sovratensioni che ha fatto collassare la rete iberica in 11 secondi, trascinando 31 GW di domanda e disconnettendo il collegamento HVDC con la Francia.', box2Title: 'Strumenti e Metodologia', box2Text: 'Flusso di carico Newton-Raphson, analisi della stabilità transitoria, modellazione RoCoF e valutazione delle contingenze N-1. Infrastruttura Web basata su Docusaurus, MDX, KaTeX e React.', box3Title: 'Conclusione Principale', box3Text: 'L\'incidente non è stato un guasto fortuito, ma il sintomo di una debolezza strutturale (collasso Q-V) indotta da un\'estrema penetrazione solare senza sufficiente supporto di cortocircuito.', startAnalysis: 'Inizia l\'analisi ⚡', download: 'SCARICA LA TESI' };
      case 'de': return { statPower: 'Leistungsverlust', statSeverity: 'ENTSO-E Schweregrad', statDate: '28. April 2025', statAffected: 'Betroffene', heroTitle1: 'Anatomie eines', heroTitleHighlight: 'Systemkollapses', heroSubtitle: 'Forensische Analyse des Stromausfalls auf der Iberischen Halbinsel 2025: Spannungsinstabilität, Trägheitsdefizit und der strukturelle Übergang zu 100 % umrichterbasierten Ressourcen (IBR).', box1Title: 'Was ist passiert?', box1Text: 'Der Ausfall des Transformators in Granada (400/220 kV) löste eine Kaskade von Überspannungen aus, die das iberische Netz in 11 Sekunden zum Einsturz brachte, 31 GW Nachfrage mit sich zog und die HGÜ-Verbindung mit Frankreich trennte.', box2Title: 'Werkzeuge & Methodik', box2Text: 'Newton-Raphson-Lastfluss, transiente Stabilitätsanalyse, RoCoF-Modellierung und N-1-Kontingenzbewertung. Web-Infrastruktur basierend auf Docusaurus, MDX, KaTeX und React.', box3Title: 'Hauptergebnis', box3Text: 'Der Vorfall war kein zufälliger Ausfall, sondern das Symptom einer strukturellen Schwäche (Q-V-Kollaps), die durch extreme solare Durchdringung ohne ausreichende Kurzschlussunterstützung hervorgerufen wurde.', startAnalysis: 'Analyse starten ⚡', download: 'THESE HERUNTERLADEN' };
      default: return { statPower: 'Potencia Perdida', statSeverity: 'Severidad ENTSO-E', statDate: '28 Abril 2025', statAffected: 'Afectados', heroTitle1: 'Anatomía de un', heroTitleHighlight: 'Colapso Sistémico', heroSubtitle: 'Análisis forense del apagón de la Península Ibérica de 2025: inestabilidad de tensión, déficit de inercia y la transición estructural hacia redes 100% basadas en inversores (IBR).', box1Title: '¿Qué ocurrió?', box1Text: 'La pérdida del transformador de Granada (400/220 kV) desencadenó una cascata de sobretensiones que colapsó la red ibérica en 11 segundos, arrastrando 31 GW de demanda y desconectando el enlace HVDC con Francia.', box2Title: 'Herramientas y Metodología', box2Text: 'Flujo de cargas Newton-Raphson, análisis de estabilidad transitoria, modelado RoCoF y evaluación de contingencia N-1. Infraestructura web basada en Docusaurus, MDX, KaTeX y React.', box3Title: 'Conclusión Principal', box3Text: 'El incidente no fue un fallo fortuito, sino el síntoma de una debilidad estructural (colapso Q-V) inducida por una penetración solar extrema sin suficiente soporte de cortocircuito.', startAnalysis: 'Comenzar Análisis ⚡', download: 'DESCARGAR TFG' };
    }
  };
  const strings = getStrings(lang);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splash_seen')) {
        setShowSplash(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!showSplash || phase !== 'playing') return;

    document.body.style.overflow = 'hidden';
    startTimeRef.current = Date.now();
    let audioStarted = false;

    const animate = () => {
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;
      const cappedElapsed = Math.min(elapsedMs, 10200);
      setElapsed(cappedElapsed);

      const audio = audioRef.current;

      // Play audio at t=4500ms
      if (cappedElapsed >= 4500 && !audioStarted && audio) {
        audio.currentTime = 0;
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Audio autoplay blocked', e));
        audioStarted = true;
      }

      // Stop audio at t=7900ms
      if (cappedElapsed >= 7900 && audioStarted && audio) {
        audio.pause();
        audioStarted = false;
      }

      if (elapsedMs < 10200) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setShowSplash(false);
        sessionStorage.setItem('splash_seen', '1');
        document.body.style.overflow = '';
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.body.style.overflow = '';
    };
  }, [showSplash, phase]);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.8;
      audioRef.current.play().catch(() => {});
      setTimeout(() => {
        if (audioRef.current) audioRef.current.pause();
      }, 100); // Unlock audio context on mobile
    }
    setPhase('playing');
  };

  // Formatting for countdown
  const formatCountdown = () => {
    const elapsedInPhase = Math.min(elapsed, 3000);
    const totalSeconds = 12 * 3600 + 33 * 60 + 21;
    const currentSeconds = totalSeconds + (elapsedInPhase / 1000);
    
    const hours = Math.floor(currentSeconds / 3600);
    const minutes = Math.floor((currentSeconds % 3600) / 60);
    const seconds = Math.floor(currentSeconds % 60);
    const milliseconds = Math.floor((currentSeconds % 1) * 100);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')} CEST`;
  };

  // PHASE LOGIC for variables
  const showMap = elapsed < 4500;
  
  let litOpacity = 1;
  let darkOpacity = 0;
  if (elapsed < 3000) {
    const progress = elapsed / 3000;
    litOpacity = 1 - progress;
    darkOpacity = progress;
  } else {
    litOpacity = 0;
    darkOpacity = 1;
  }

  let mapOpacity = 1;
  if (elapsed >= 3000 && elapsed < 4500) {
    const fadeProgress = (elapsed - 3000) / 1500;
    mapOpacity = 1 - fadeProgress;
  } else if (elapsed >= 4500) {
    mapOpacity = 0;
  }

  let titleOpacity = 0;
  if (elapsed >= 4200) {
    titleOpacity = elapsed < 4700 ? (elapsed - 4200) / 500 : 1;
  }

  let titleMainOpacity = 0;
  let titleMainFilter = 'blur(16px)';
  if (elapsed >= 4500 && elapsed < 5800) {
    const progress = (elapsed - 4500) / 1300;
    titleMainOpacity = progress;
    titleMainFilter = `blur(${16 * (1 - progress)}px)`;
  } else if (elapsed >= 5800) {
    titleMainOpacity = 1;
    titleMainFilter = 'blur(0px)';
  }

  let subtitleOpacity = 0;
  let subtitleTransform = 'translateY(10px)';
  if (elapsed >= 6000 && elapsed < 7000) {
    const progress = (elapsed - 6000) / 1000;
    subtitleOpacity = progress;
    subtitleTransform = `translateY(${10 * (1 - progress)}px)`;
  } else if (elapsed >= 7000) {
    subtitleOpacity = 1;
    subtitleTransform = 'translateY(0)';
  }

  let authorOpacity = 0;
  if (elapsed >= 7000 && elapsed < 7900) {
    authorOpacity = (elapsed - 7000) / 900;
  } else if (elapsed >= 7900) {
    authorOpacity = 1;
  }

  let finalFadeOutOpacity = 1;
  if (elapsed >= 9800) {
    finalFadeOutOpacity = 1 - ((elapsed - 9800) / 400);
  }

  const showCountdown = elapsed < 3200;
  const flicker1Visible = elapsed >= 750 && elapsed <= 830;
  const flicker2Visible = elapsed >= 1700 && elapsed <= 1760;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Alfa+Slab+One&display=swap" rel="stylesheet" />
        
        <link rel="preload" href={bgLit} as="image" />
        <link rel="preload" href={bgDark} as="image" />
        <link rel="preload" href={audioMp3} as="audio" />
        <style>{`
          @keyframes flicker1Effect { 0%, 100% { opacity: 0; } 30% { opacity: 0.12; } 70% { opacity: 0.12; } }
          @keyframes flicker2Effect { 0%, 100% { opacity: 0; } 40% { opacity: 0.08; } 60% { opacity: 0.08; } }
        `}</style>
      </Head>
      <audio ref={audioRef} preload="auto">
        <source src={audioOgg} type="audio/ogg" />
        <source src={audioMp3} type="audio/mpeg" />
      </audio>

      {/* PANTALLA SPLASH (WAITING O PLAYING) */}
      {showSplash && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#000',
            overflow: 'hidden',
            opacity: finalFadeOutOpacity
          }}
        >
          {phase === 'waiting' && (
            <motion.div
              onClick={handleStart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100000,
                backgroundImage: `url(${bgLit})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)' }} />
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'relative',
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(24px, 4vw, 48px)',
                  color: '#FFB800',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '2px 2px 0px #CC2200, 4px 4px 0px #AA1800, 6px 6px 0px #881000, 8px 8px 0px #660800, 10px 10px 0px rgba(0,0,0,0.6)',
                  WebkitTextStroke: '1px rgba(180,60,0,0.5)',
                  zIndex: 2,
                  textAlign: 'center'
                }}
              >
                — CLICK TO ENTER —
              </motion.p>
            </motion.div>
          )}

          {phase === 'playing' && (
            <>
              {showMap && (
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: mapOpacity }}>
                  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${bgLit})`, opacity: litOpacity }} />
                    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${bgDark})`, opacity: darkOpacity }} />
                  </div>

                  {flicker1Visible && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', pointerEvents: 'none', animation: 'flicker1Effect 0.08s ease-out' }} />}
                  {flicker2Visible && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', pointerEvents: 'none', animation: 'flicker2Effect 0.06s ease-out' }} />}

                  {showCountdown && (
                    <div style={{
                      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center',
                      fontFamily: '"Alfa Slab One", serif', fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#FFD700',
                      textTransform: 'uppercase', letterSpacing: '0.15em', textShadow: '-1px -1px 0px #cc0000, 2px 2px 0px #880000',
                      zIndex: 10001, lineHeight: 1.2, margin: 0
                    }}>
                      <div style={{ fontSize: '0.85em', opacity: 0.95, marginBottom: '6px' }}>28 ABR 2025</div>
                      <div style={{ fontSize: '1.15em', letterSpacing: '0.15em' }}>{formatCountdown()}</div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ 
                position: 'absolute', inset: 0, width: '100%', height: '100%', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                opacity: titleOpacity 
              }}>
                <h1 style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(72px, 14vw, 160px)',
                  fontWeight: 400,
                  color: '#FFB800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  lineHeight: 0.88,
                  margin: 0,
                  textAlign: 'center',
                  textShadow: '2px 2px 0px #CC2200, 4px 4px 0px #AA1800, 6px 6px 0px #881000, 8px 8px 0px #660800, 10px 10px 0px rgba(0,0,0,0.6)',
                  WebkitTextStroke: '1.5px rgba(180,60,0,0.5)',
                  opacity: titleMainOpacity,
                  filter: titleMainFilter
                }}>
                  APAGÓN<br/>IBÉRICO<br/>2025
                </h1>

                <p style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(14px, 2.2vw, 24px)',
                  fontWeight: 400,
                  color: '#FFB800',
                  letterSpacing: '0.18em',
                  marginTop: '28px',
                  textAlign: 'center',
                  textShadow: '1px 1px 0px #CC2200, 3px 3px 0px #881000, 4px 4px 0px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  maxWidth: '90vw',
                  opacity: subtitleOpacity,
                  transform: subtitleTransform
                }}>
                  Análisis Forense del Colapso Sistémico
                </p>

                <p style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(13px, 1.8vw, 20px)',
                  fontWeight: 400,
                  color: 'rgba(255,184,0,0.75)',
                  letterSpacing: '0.20em',
                  marginTop: '18px',
                  textAlign: 'center',
                  textShadow: '1px 1px 0px #CC2200, 3px 3px 0px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  maxWidth: '90vw',
                  opacity: authorOpacity
                }}>
                  Alfonso Monge Díaz-Ángel
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content (Always rendered behind splash) */}
      <div id="executive-hook" className={styles.heroContainer} style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
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
          <span className={styles.techBadge}>Python Data Analytics</span>
          <span className={styles.techBadge}>Newton-Raphson Solver</span>
        </div>
        </div>
      </div>
    </>
  );
}
