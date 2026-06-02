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
      icon: '📖',
      label: 'Leer el análisis',
      desc: '9 capítulos — del colapso físico a las consecuencias regulatorias',
      href: '/01-introduccion',
    },
    {
      icon: '⚡',
      label: 'Explorar los simuladores',
      desc: '18 herramientas interactivas — frecuencia, cascada, Tap-Lag, PV curve',
      href: '/anexo-interactivos',
    },
    {
      icon: '🔍',
      label: 'Consultar datos en tiempo real',
      desc: 'Mix de generación, precio SPOT, radar de vulnerabilidad sistémica',
      href: '/datos-tiempo-real',
    },
    {
      icon: '💬',
      label: 'Preguntar al asistente',
      desc: 'El chatbot conoce el TFG completo — glosario, cifras y gráficas incluidas',
      action: () => {
        dismiss();
        // Abre el chat disparando un clic en el botón .chat-fab
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
      background: 'var(--ifm-background-surface-color)',
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
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--ifm-color-emphasis-500)',
        margin: '0 0 1rem 0',
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
              gap: '0.35rem',
              padding: '0.875rem 1rem',
              border: '1px solid var(--ifm-color-emphasis-200)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-color-primary)';
              e.currentTarget.style.background = 'var(--ifm-color-emphasis-100)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{r.icon}</span>
            <span style={{
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'var(--ifm-font-color-base)',
            }}>
              {r.label}
            </span>
            <span style={{
              fontSize: '0.775rem',
              color: 'var(--ifm-color-emphasis-600)',
              lineHeight: 1.4,
            }}>
              {r.desc}
            </span>
          </a>
        ))}
      </div>

      <p style={{
        margin: '1rem 0 0 0',
        fontSize: '0.75rem',
        color: 'var(--ifm-color-emphasis-400)',
        textAlign: 'right',
      }}>
        Esta guía solo aparece una vez.
      </p>
    </div>
  );
}
