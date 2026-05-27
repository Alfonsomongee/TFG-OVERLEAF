// MiniTimeline.jsx
import React, { useState } from 'react';
import { useForensicData } from '@site/src/data/forensicChartsI18n';
import styles from './ForensicGallery2.module.css';

// Converts "HH:MM" to a 0-1 percentage of the 24-hour day
function timeToPercent(timeStr) {
  if (timeStr.includes('+1')) return 0.97; // next-day marker near end
  const [h, m] = timeStr.split(':').map(Number);
  return Math.min((h * 60 + m) / (24 * 60), 0.97);
}

export default function MiniTimeline({ highlightedCharts, onHover }) {
  const { TIMELINE_MARKERS } = useForensicData();
  const [activeMarker, setActiveMarker] = useState(null);

  return (
    <div className={styles.timelineSection}>
      <div className={styles.timelineTitle}>28 abril 2025 — CEST</div>
      <div className={styles.timelineBar}>
        <div className={styles.timelineTrack} />
        {TIMELINE_MARKERS.map((m) => {
          const pct = timeToPercent(m.timeUTC);
          return (
            <div
              key={m.id}
              className={styles.timelineMarker}
              style={{ left: `${pct * 100}%` }}
              onMouseEnter={() => {
                setActiveMarker(m.id);
                onHover && onHover(m.relatedCharts);
              }}
              onMouseLeave={() => {
                setActiveMarker(null);
                onHover && onHover([]);
              }}
            >
              <div className={`${styles.markerDot} ${styles[m.severity]}`} />
              {activeMarker === m.id && (
                <div className={styles.markerTooltip}>
                  <strong>{m.timeCEST}</strong>
                  {m.label}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
