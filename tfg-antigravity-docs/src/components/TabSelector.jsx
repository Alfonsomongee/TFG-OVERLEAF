import React from 'react';

export default function TabSelector({ active, onSelect, labels }) {
  return (
    <div style={{
      display: 'flex', gap: '0.5rem', marginBottom: '2rem',
      borderBottom: '1px solid var(--ifm-color-emphasis-200)',
      paddingBottom: '0.75rem',
    }}>
      {labels.map((label, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            flex: 1,
            padding: '0.5rem 1.25rem',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.85rem',
            letterSpacing: '0.02em',
            background: active === i
              ? 'var(--ifm-color-emphasis-100)'
              : 'transparent',
            color: active === i
              ? 'var(--ifm-font-color-base)'
              : 'var(--ifm-color-emphasis-600)',
            borderBottom: active === i
              ? '2px solid var(--ifm-color-primary)'
              : '2px solid transparent',
            transition: 'all 0.15s ease',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
