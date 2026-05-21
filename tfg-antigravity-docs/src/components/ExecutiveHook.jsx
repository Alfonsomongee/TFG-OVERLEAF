import React from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';

export default function ExecutiveHook() {
  return (
    <>
      {/* Splash Screen */}
      <div className={styles.splashContainer}>
        <div className={styles.splashOverlay}></div>
        <div className={styles.splashContent}>
          <h1 className={styles.splashTitle}>
            APAGÓN IBÉRICO 2025
          </h1>
          <p className={styles.splashSubtitle}>
            Análisis Forense del Colapso Sistémico
          </p>
          <Link className={styles.splashButton} to="/contexto">
            ADELANTE
            <svg className={styles.arrowIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
          <a href="#executive-hook" className={styles.scrollDownIndicator}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
        </div>
      </div>

      <div id="executive-hook" className={styles.heroContainer}>
        {/* Top Banner / Event Scale */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>31 GW</span>
            <span className={styles.statLabel}>Potencia Perdida</span>
          </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>Scale 3</span>
          <span className={styles.statLabel}>Severidad ENTSO-E</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>12:33 CEST</span>
          <span className={styles.statLabel}>28 Abril 2025</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>60M</span>
          <span className={styles.statLabel}>Afectados</span>
        </div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          Anatomía de un <span className={styles.highlight}>Colapso Sistémico</span>
        </h1>
        <p className={styles.subtitle}>
          Análisis forense del apagón de la Península Ibérica de 2025: inestabilidad de tensión, déficit de inercia y la transición estructural hacia redes 100% basadas en inversores (IBR).
        </p>

        {/* 90-second Executive Summary */}
        <div className={styles.execSummary}>
          <div className={styles.summaryBox}>
            <h3>¿Qué ocurrió?</h3>
            <p>La pérdida del transformador de Granada (400/220 kV) desencadenó una cascada de sobretensiones que colapsó la red ibérica en 11 segundos, arrastrando 31 GW de demanda y desconectando el enlace HVDC con Francia.</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>Herramientas y Metodología</h3>
            <p>Flujo de cargas Newton-Raphson, análisis de estabilidad transitoria, modelado RoCoF y evaluación de contingencia N-1. Infraestructura web basada en Docusaurus, MDX, KaTeX y React.</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>Conclusión Principal</h3>
            <p>El incidente no fue un fallo fortuito, sino el síntoma de una debilidad estructural (colapso Q-V) inducida por una penetración solar extrema sin suficiente soporte de cortocircuito.</p>
          </div>
        </div>

        {/* CTAs & Badges */}
        <div className={styles.actions}>
          <Link className={`button button--primary button--lg ${styles.primaryBtn}`} to="/contexto">
            Comenzar Análisis ⚡
          </Link>
          <a className={`button button--outline button--lg ${styles.secondaryBtn}`} href="https://github.com/Alfonsomongee/TFG-OVERLEAF" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            Repositorio GitHub
          </a>
          <a className={`button button--outline button--lg ${styles.secondaryBtn}`} href="/tfg_antigravity(1).pdf" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
            DESCARGAR TFG
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
    </>
  );
}
