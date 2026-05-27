import React, { useState, useEffect } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';

export default function ExecutiveHook() {
  const [showSplash, setShowSplash] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;

  // Evitar que el splash se repita si ya se ha visto en la sesión
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splash_seen_2')) {
        setShowSplash(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    
    // Disable scroll while splash is active
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
      case 'en': return { statPower: 'Power Lost', statSeverity: 'ENTSO-E Severity', statDate: 'April 28 2025', statAffected: 'Affected', heroTitle1: 'Anatomy of a', heroTitleHighlight: 'Systemic Collapse', heroSubtitle: 'Forensic analysis of the 2025 Iberian Peninsula blackout', startAnalysis: 'Start Analysis ⚡' };
      default: return { statPower: 'Potencia Perdida', statSeverity: 'Severidad ENTSO-E', statDate: '28 Abril 2025', statAffected: 'Afectados', heroTitle1: 'Anatomía de un', heroTitleHighlight: 'Colapso Sistémico', heroSubtitle: 'Análisis forense del apagón de la Península Ibérica de 2025', startAnalysis: 'Comenzar Análisis ⚡' };
    }
  };
  const strings = getStrings(lang);

  const cards = [
    {
      id: 1,
      title: 'ANÁLISIS FORENSE',
      description: 'Disección de la cascada de 27 segundos: oscilaciones, Tap‑Lag, sobretensiones y el cero de tensión.',
      icon: '🔬',
      path: '/analisis-incidente',
      color: '#b91c1c',
      rgb: '185, 28, 28',
    },
    {
      id: 2,
      title: 'INFORMES EN CONFLICTO',
      description: 'Las tres narrativas institucionales: Administración, Generadores (ICAI) y ENTSO‑E.',
      icon: '⚖️',
      path: '/analisis-informes',
      color: '#f59e0b',
      rgb: '245, 158, 11',
    },
    {
      id: 3,
      title: 'GRÁFICAS REALES',
      description: 'Registros de ENTSO‑E, ESIOS y PMU. Datos originales del colapso.',
      icon: '📊',
      path: '/galeria-forense',
      color: '#3b82f6',
      rgb: '59, 130, 246',
    },
    {
      id: 4,
      title: 'IMPACTO ECONÓMICO',
      description: 'Coste directo (VOLL), litigios multimillonarios y efecto en consumidores electrointensivos.',
      icon: '💥',
      path: '/07b-consecuencias-financieras',
      color: '#b91c1c',
      rgb: '185, 28, 28',
    },
    {
      id: 5,
      title: 'RESILIENCIA Y FUTURO',
      description: 'Inercia electromecánica, Short‑Circuit Ratio (SCR) y el mandato Grid‑Forming.',
      icon: '🔧',
      path: '/resiliencia-futuro',
      color: '#10b981',
      rgb: '16, 185, 129',
    },
    {
      id: 6,
      title: 'IA EN EL TFG',
      description: 'Uso de LLMs para reconciliación cronológica y validación física de hipótesis.',
      icon: '🧠',
      path: '/uso-ia',
      color: '#8b5cf6',
      rgb: '139, 92, 246',
    },
  ];

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
            ANATOMÍA DE UN<br/>COLAPSO SISTÉMICO
          </h1>
          <h2 className={styles.splashSubtitle} style={{ opacity: subtitleOpacity }}>
            ANÁLISIS FORENSE DEL APAGÓN IBÉRICO
          </h2>
          <p className={styles.splashAuthor} style={{ opacity: authorOpacity }}>
            ALFONSO MONGE
          </p>
          <div style={{ opacity: clickOpacity }}>
            <p className={styles.splashClick}>CLICK PARA ENTRAR</p>
          </div>
        </div>
      )}

      <div id="executive-hook" className={styles.heroContainer} style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        
        <Link to="/sobre-el-autor" className={styles.profileIconWrapper} title="Sobre el autor">
          <div className={styles.profileNeonCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.neonPerson}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <svg className={styles.rotatingText} viewBox="0 0 100 100">
            <defs>
              <path id="textCircle" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text>
              <textPath href="#textCircle" textLength="251" lengthAdjust="spacing">
                SOBRE EL AUTOR • SOBRE EL AUTOR • 
              </textPath>
            </text>
          </svg>
        </Link>

        {/* Contenido principal centrado */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            {strings.heroTitle1}{' '}
            <span className={styles.highlight}>{strings.heroTitleHighlight}</span>
          </h1>
          <p className={styles.subtitle}>{strings.heroSubtitle}</p>

          {/* Top Banner / Event Scale */}
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

          {/* Grid de 6 tarjetas */}
          <div className={styles.cardsGrid}>
            {cards.map((card) => (
              <Link key={card.id} to={card.path} className={styles.cardLink}>
                <div
                  className={styles.card}
                  style={{
                    '--card-accent': card.color,
                    '--card-accent-rgb': card.rgb,
                  }}
                >
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardArrow}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Botones de acción */}
          <div className={styles.actions}>
            <Link className={`button button--primary ${styles.primaryBtn}`} to="/contexto">
              {strings.startAnalysis}
            </Link>
            <a
              className={`button button--outline ${styles.secondaryBtn}`}
              href="https://github.com/Alfonsomongee/TFG-OVERLEAF"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.btnIcon}
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              GitHub
            </a>
          </div>

          <div className={styles.techStack}>
            <span className={styles.techBadge}>Docusaurus v2</span>
            <span className={styles.techBadge}>React.js</span>
            <span className={styles.techBadge}>KaTeX</span>
            <span className={styles.techBadge}>Python Analytics</span>
          </div>
        </div>
      </div>
    </>
  );
}
