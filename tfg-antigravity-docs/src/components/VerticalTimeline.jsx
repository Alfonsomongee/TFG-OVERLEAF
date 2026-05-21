import React from 'react';
import styles from './VerticalTimeline.module.css';
import { timelineEvents } from '../data/timelineData';

export default function VerticalTimeline({ lang = 'es' }) {
  const isEn = lang === 'en';

  return (
    <div className={styles.timelineContainer}>
      {timelineEvents.map((event, index) => {
        // Alternating left/right layout classes
        const alignmentClass = index % 2 === 0 ? styles.leftEvent : styles.rightEvent;
        
        // Dynamic border color based on event severity
        let typeColor = 'var(--ifm-color-primary)';
        if (event.type === 'warning') typeColor = '#f39c12';
        if (event.type === 'danger') typeColor = '#e74c3c';
        if (event.type === 'critical') typeColor = '#c0392b';
        if (event.type === 'success') typeColor = '#27ae60';
        
        return (
          <div key={event.id} className={`${styles.timelineBlock} ${alignmentClass}`}>
            <div 
              className={styles.timelineDot} 
              style={{ backgroundColor: typeColor, boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 0 8px ${typeColor}33` }}
            ></div>
            
            <div className={styles.timelineContent} style={{ borderTop: `4px solid ${typeColor}` }}>
              <div className={styles.timeBadge}>
                {event.date} • {event.time}
              </div>
              <h3 className={styles.eventTitle}>
                {isEn ? event.title_en : event.title_es}
              </h3>
              <p className={styles.eventDesc}>
                {isEn ? event.desc_en : event.desc_es}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
