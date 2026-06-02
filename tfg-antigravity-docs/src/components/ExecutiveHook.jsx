import React, { useState, useEffect } from 'react';
import styles from './ExecutiveHook.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Head from '@docusaurus/Head';

export default function ExecutiveHook() {
  const [showSplash, setShowSplash] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const isCongreso = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('modo') === 'congreso';

  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splash_seen_3')) {
        setShowSplash(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    if (typeof window === 'undefined') return;

    document.body.style.overflow = 'hidden';
    const start = Date.now();
    let animationFrame;

    const animate = () => {
      const ms = Date.now() - start;
      setElapsed(ms);
      if (ms < 5000) {
        animationFrame = requestAnimationFrame(animate);
      } else if (!isCongreso) {
        handleEnter();
      }
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      document.body.style.overflow = '';
    };
  }, [showSplash, isCongreso]);

  const handleEnter = () => {
    setShowSplash(false);
    sessionStorage.setItem('splash_seen_3', '1');
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        splashTitle: 'ANATOMY OF A\nSYSTEMIC COLLAPSE',
        splashSubtitle: 'FORENSIC ANALYSIS OF THE IBERIAN BLACKOUT',
        splashClick: 'CLICK TO ENTER',
      };
      case 'pt': return {
        splashTitle: 'ANATOMIA DE UM\nCOLAPSO SISTÉMICO',
        splashSubtitle: 'ANÁLISE FORENSE DO APAGÃO IBÉRICO',
        splashClick: 'CLIQUE PARA ENTRAR',
      };
      case 'fr': return {
        splashTitle: 'ANATOMIE D\'UN\nEFFONDREMENT SYSTÉMIQUE',
        splashSubtitle: 'ANALYSE FORENSIQUE DU BLACK-OUT IBÉRIQUE',
        splashClick: 'CLIQUEZ POUR ENTRER',
      };
      case 'it': return {
        splashTitle: 'ANATOMIA DI UN\nCOLLASSO SISTEMICO',
        splashSubtitle: 'ANALISI FORENSE DEL BLACKOUT IBERICO',
        splashClick: 'CLICCA PER ENTRARE',
      };
      case 'de': return {
        splashTitle: 'ANATOMIE EINES\nSYSTEMKOLLAPSES',
        splashSubtitle: 'FORENSISCHE ANALYSE DES IBERISCHEN BLACKOUTS',
        splashClick: 'KLICKEN SIE ZUM BETRETEN',
      };
      default: return {
        splashTitle: 'ANATOMÍA DE UN\nCOLAPSO SISTÉMICO',
        splashSubtitle: 'ANÁLISIS FORENSE DEL APAGÓN IBÉRICO',
        splashClick: 'CLICK PARA ENTRAR',
      };
    }
  };
  const strings = getStrings(lang);

  let titleOpacity = Math.min(1, Math.max(0, (elapsed - 200) / 500));
  let subtitleOpacity = Math.min(1, Math.max(0, (elapsed - 700) / 500));
  let authorOpacity = Math.min(1, Math.max(0, (elapsed - 1200) / 500));
  let clickOpacity = Math.min(1, Math.max(0, (elapsed - 1700) / 500));

  if (!showSplash) return null;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Alfa+Slab+One&display=swap" rel="stylesheet" />
      </Head>

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
          ALFONSO MONGE DÍAZ-ÁNGEL
        </p>
        <div style={{ opacity: clickOpacity }}>
          <p className={styles.splashClick}>{strings.splashClick}</p>
        </div>

        <div style={{
          marginTop: '2.5rem',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <a
            href="/cine"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1.75rem',
              border: '1px solid var(--ifm-color-emphasis-300)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              letterSpacing: '0.04em',
              color: 'var(--ifm-font-color-base)',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
              e.currentTarget.style.color = 'var(--ifm-color-primary)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-300)';
              e.currentTarget.style.color = 'var(--ifm-font-color-base)';
            }}
          >
            <span>▶</span>
            <span>Presentación narrativa — 45 escenas del colapso</span>
          </a>
        </div>
      </div>
    </>
  );
}
