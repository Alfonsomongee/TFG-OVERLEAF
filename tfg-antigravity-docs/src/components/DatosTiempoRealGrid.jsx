import React from 'react';
import Link from '@docusaurus/Link';

export default function DatosTiempoRealGrid({ items = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', margin: '2rem 0' }}>
      {items.map((item, idx) => (
        <Link key={idx} to={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-hover-effect" style={{ border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '12px', padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-600)', lineHeight: '1.5', margin: 0 }}>
                {item.description}
              </p>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--ifm-color-primary)', fontWeight: 'bold' }}>
              Consultar métrica →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
