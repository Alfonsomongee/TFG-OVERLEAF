import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './AuthorProfile.module.css';

export default function AuthorProfile({ lang = 'es' }) {
  const isEn = lang === 'en';
  
  return (
    <div className={styles.profileCard}>
      <div className={styles.headerBackground}></div>
      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          {/* Using a placeholder SVG or ETSI logo as avatar */}
          <div className={styles.avatar}>
            <span className={styles.initials}>AM</span>
          </div>
        </div>
        
        <h2 className={styles.name}>Alfonso Monge Díaz-Ángel</h2>
        <p className={styles.title}>
          {isEn ? "Author & Power Systems Engineer" : "Autor e Ingeniero Eléctrico"}
        </p>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <strong>{isEn ? "University:" : "Universidad:"}</strong> 
            <span>ETSI, Universidad de Sevilla</span>
          </div>
          <div className={styles.detailItem}>
            <strong>{isEn ? "Year:" : "Año:"}</strong> 
            <span>2026</span>
          </div>
          <div className={styles.detailItem}>
            <strong>{isEn ? "Contact:" : "Contacto:"}</strong> 
            <a href="mailto:alfonsomongediazangel@gmail.com">alfonsomongediazangel@gmail.com</a>
          </div>
        </div>
        
        <p className={styles.bio}>
          {isEn 
            ? "This interactive thesis represents a comprehensive forensic analysis of the Iberian electrical collapse. It aims to bridge the gap between technical power systems engineering and effective crisis communication."
            : "Este TFG interactivo representa un análisis forense integral del colapso eléctrico ibérico. Su objetivo es tender un puente entre la ingeniería técnica de sistemas de potencia y la comunicación efectiva de crisis."}
        </p>
      </div>
    </div>
  );
}
