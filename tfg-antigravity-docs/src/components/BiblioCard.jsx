import React from 'react';

const cardStyle = {
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '8px',
  padding: '1rem 1.25rem',
  marginBottom: '1rem',
  background: 'var(--ifm-card-background-color)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  transition: 'box-shadow 0.2s',
};

const idStyle = {
  fontFamily: 'monospace',
  fontWeight: 700,
  color: 'var(--ifm-color-primary)',
  marginRight: '0.5rem',
};

const typeColors = {
  'informe': '#dc2626',
  'estándar': '#ea580c',
  'académico': '#1e40af',
  'normativa': '#15803d',
};

/**
 * BiblioCard — muestra una referencia bibliográfica estructurada.
 * Props: id, type, authors, year, title, institution, url, note
 */
export default function BiblioCard({ id, type = 'académico', authors, year, title, institution, url, note }) {
  const color = typeColors[type] || '#6b7280';
  return (
    <div style={cardStyle}>
      <div>
        <span style={idStyle}>[{id}]</span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: '12px',
          background: color + '22',
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>{type}</span>
      </div>
      <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>{title}</div>
      <div style={{ color: 'var(--ifm-color-emphasis-600)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
        {authors}{year ? ` (${year})` : ''}
        {institution && ` — ${institution}`}
      </div>
      {note && <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.4rem', color: 'var(--ifm-color-emphasis-500)' }}>{note}</div>}
      {url && (
        <div style={{ marginTop: '0.5rem' }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem' }}>
            🔗 Acceder al documento
          </a>
        </div>
      )}
    </div>
  );
}
