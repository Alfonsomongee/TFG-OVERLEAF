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
      href: '/',
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

  const pistachioGlow = `
    @keyframes pistachioPulse {
      0% { box-shadow: 0 0 4px rgba(99, 110, 79, 0.2), inset 0 0 2px rgba(99, 110, 79, 0.1); border-color: rgba(99, 110, 79, 0.3); }
      50% { box-shadow: 0 0 12px rgba(99, 110, 79, 0.6), inset 0 0 4px rgba(99, 110, 79, 0.3); border-color: rgba(99, 110, 79, 0.8); }
      100% { box-shadow: 0 0 4px rgba(99, 110, 79, 0.2), inset 0 0 2px rgba(99, 110, 79, 0.1); border-color: rgba(99, 110, 79, 0.3); }
    }
    .nav-guide-btn {
      animation: pistachioPulse 3s infinite alternate;
    }
    .nav-guide-btn:hover {
      animation: none !important;
      box-shadow: 0 0 20px rgba(99, 110, 79, 0.9), inset 0 0 8px rgba(99, 110, 79, 0.5) !important;
      border-color: #636e4f !important;
      background: rgba(99, 110, 79, 0.15) !important;
      transform: translateY(-2px);
    }
    .nav-guide-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 768px) {
      .nav-guide-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 480px) {
      .nav-guide-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <div style={{
      margin: '2rem 0',
      padding: '1.5rem',
      border: '1px solid var(--ifm-color-emphasis-200)',
      borderRadius: '12px',
      background: 'var(--ifm-background-color)',
      position: 'relative',
    }}>
      <style>{pistachioGlow}</style>
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
        color: '#636e4f',
        textShadow: '0 0 10px rgba(99, 110, 79, 0.3)',
        textAlign: 'center',
        margin: '0 0 1.5rem 0',
      }}>
        ¿Por dónde empezar?
      </p>

      <div className="nav-guide-grid">
        {routes.map((r, i) => (
          <a
            key={i}
            className="nav-guide-btn"
            href={r.action ? undefined : r.href}
            onClick={r.action ? (e) => { e.preventDefault(); r.action(); } : dismiss}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              padding: '1rem',
              border: '1px solid rgba(99, 110, 79, 0.3)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
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
              color: 'var(--ifm-color-emphasis-800)',
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
