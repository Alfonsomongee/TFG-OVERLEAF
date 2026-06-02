import React, { useState, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

const SESSION_KEY = 'nav_guide_dismissed';

export default function NavigationGuide() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  const routes = [
    {
      label: 'Leer el análisis',
      desc: '9 capítulos — del colapso físico a las consecuencias regulatorias',
      href: '/01-introduccion',
    },
    {
      label: 'Explorar los simuladores',
      desc: '18 herramientas interactivas — frecuencia, cascada, Tap-Lag, PV curve',
      href: '/anexo-interactivos',
    },
    {
      label: 'Consultar datos en tiempo real',
      desc: 'Mix de generación, precio SPOT, radar de vulnerabilidad sistémica',
      href: '/datos-tiempo-real',
    },
    {
      label: 'Preguntar al asistente',
      desc: 'El chatbot conoce el TFG completo — glosario, cifras y gráficas incluidas',
      action: () => {
        dismiss();
        const fab = document.querySelector('.chat-fab');
        if (fab) fab.click();
      },
    },
  ];

  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.5rem',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '12px',
      background: 'var(--ifm-background-color)',
      position: 'relative',
    }}>
      <button
        onClick={dismiss}
        aria-label="Cerrar guía de navegación"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--ifm-color-emphasis-500)',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '0.25rem',
        }}
      >
        ✕
      </button>

      <p style={{
        fontFamily: 'var(--ifm-font-family-base)',
        fontSize: '1.6rem',
        fontWeight: '700',
        color: 'var(--ifm-menu-color)',
        textAlign: 'center',
        margin: '0 0 1.5rem 0',
      }}>
        ¿Por dónde empezar?
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
      }}>
        {routes.map((r, i) => (
          <a
            key={i}
            href={r.action ? undefined : r.href}
            onClick={r.action ? (e) => { e.preventDefault(); r.action(); } : dismiss}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              padding: '1rem',
              border: '1px solid var(--ifm-color-emphasis-200)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-menu-color-active)';
              e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{
              fontWeight: 600,
              fontSize: '1rem',
              fontFamily: 'var(--ifm-font-family-base)',
              color: 'var(--ifm-menu-color)',
            }}>
              {r.label}
            </span>
            <span style={{
              fontSize: '0.85rem',
              color: 'var(--ifm-color-emphasis-600)',
              lineHeight: 1.4,
              fontFamily: 'var(--ifm-font-family-base)',
            }}>
              {r.desc}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
