import React from 'react';
import styles from './BiblioCard.module.css';
import { BIBLIOGRAPHY } from '../data/bibliography';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SpotlightCard from './ReactBits/SpotlightCard';

export default function BiblioCard() {
  return (
    <div className={styles.biblioContainer}>
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total referencias:</span>
          <span className={styles.statValue}>{BIBLIOGRAPHY.length}</span>
        </div>
      </div>

      <div className={styles.referencesList}>
        {BIBLIOGRAPHY.map((ref) => (
          <SpotlightCard
            key={ref.id}
            className={styles.referenceCard}
            spotlightColor="rgba(255, 255, 255, 0.08)"
          >
            <div className={styles.refId}>[{ref.id}]</div>
            <div className={styles.title}>
              {ref.title}
              {ref.pdf && (
                <div style={{ marginTop: '0.75rem' }}>
                  <a href={useBaseUrl(ref.pdf)} target="_blank" rel="noopener noreferrer" className="button button--secondary button--sm">
                    Descargar Informe PDF
                  </a>
                </div>
              )}
            </div>
          </SpotlightCard>
        ))}
      </div>

      <div className={styles.biblioFooter}>
        <p>
          <em>
            Compilación de referencias técnicas del análisis del colapso ibérico del
            28 de abril de 2025
          </em>
        </p>
      </div>
    </div>
  );
}

