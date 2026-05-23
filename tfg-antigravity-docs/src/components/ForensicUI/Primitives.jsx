import React from 'react';
export function TelemetryMetadata({ title, source, timeBase, confidence }) {
  return (
    <div className="telemetry-metadata" aria-label={`Metadata: ${title}`}>
      <div className="telemetry-header">{title}</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {source && <div>SOURCE: {source}</div>}
        {timeBase && <div>TIME BASE: {timeBase}</div>}
        {confidence && <div>CONFIDENCE: {confidence}</div>}
      </div>
    </div>
  );
}

export function ForensicTable({ title, source, timeBase, confidence, children }) {
  return (
    <div className="telemetry-table-container forensic-table">
      {(title || source) && (
        <TelemetryMetadata 
          title={title} 
          source={source} 
          timeBase={timeBase} 
          confidence={confidence} 
        />
      )}
      <div className="table-scroll-wrapper">
        {children}
      </div>
    </div>
  );
}

export function CriticalEventBlock({ timestamp, event, description }) {
  return (
    <div className="critical-event-block state-critical" style={{ padding: 'var(--space-md)', borderLeft: '4px solid var(--forensic-critical)', margin: 'var(--incident-spacing-md) 0' }}>
      <div style={{ fontFamily: 'var(--telemetry-font)', color: 'var(--forensic-critical)', marginBottom: 'var(--space-xs)' }}>
        [ {timestamp} ] {event}
      </div>
      <div style={{ color: 'var(--forensic-text-primary)' }}>
        {description}
      </div>
    </div>
  );
}

export function IncidentDivider() {
  return (
    <hr style={{ 
      border: 'none', 
      borderTop: '1px dashed var(--telemetry-border)', 
      margin: 'var(--incident-spacing-lg) 0',
      opacity: 0.5
    }} />
  );
}

export function ForensicFigure({ src, alt, caption, source }) {
  return (
    <figure className="forensic-figure" style={{ margin: 'var(--incident-spacing-md) 0', border: '1px solid var(--telemetry-border)', borderRadius: 'var(--scada-radius)', overflow: 'hidden' }}>
      <img src={src} alt={alt} style={{ width: '100%', display: 'block' }} loading="lazy" />
      <figcaption style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--forensic-bg-secondary)', borderTop: '1px solid var(--telemetry-border)', fontSize: 'var(--telemetry-sm)', fontFamily: 'var(--telemetry-font)', color: 'var(--forensic-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>{caption}</span>
        {source && <span style={{ opacity: 0.7 }}>SRC: {source}</span>}
      </figcaption>
    </figure>
  );
}
