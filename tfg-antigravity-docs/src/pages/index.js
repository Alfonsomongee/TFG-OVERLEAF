import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Translate from '@docusaurus/Translate';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBackground}></div>
      <div className={styles.gridOverlay}></div>
      <div className={styles.container}>
        <h1 className={styles.heroTitle}>
          <Translate id="homepage.title" description="The main title on the homepage">
            Colapso del Sistema Eléctrico Ibérico
          </Translate>
        </h1>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.subtitle" description="The subtitle on the homepage">
            Análisis Forense Integral del evento del 28 de Abril de 2025. Dinámica de Sobretensiones, Colapso Inercial y Fallos Regulatorios.
          </Translate>
        </p>
        
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>50M+</span>
            <span className={styles.statLabel}>
              <Translate id="homepage.stat1" description="Stat 1 label">Afectados</Translate>
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>~1H</span>
            <span className={styles.statLabel}>
              <Translate id="homepage.stat2" description="Stat 2 label">De Oscuridad</Translate>
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>28-A</span>
            <span className={styles.statLabel}>
              <Translate id="homepage.stat3" description="Stat 3 label">Abril 2025</Translate>
            </span>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link
            className={styles.primaryButton}
            to="/docs/intro">
            <Translate id="homepage.cta" description="Call to action button">
              Comenzar el Análisis
            </Translate>
          </Link>
          <Link
            className={styles.secondaryButton}
            to="/docs/galeria-graficas">
            <Translate id="homepage.secondary" description="Secondary button">
              Ver Gráficas
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Inicio`}
      description={siteConfig.tagline}>
      <main>
        <HomepageHeader />
      </main>
    </Layout>
  );
}
