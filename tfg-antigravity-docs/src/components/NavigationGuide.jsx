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

  const navGuideStyles = `
    .nav-guide-shell {
      --nav-guide-bg: rgba(255, 252, 245, 0.84);
      --nav-guide-bg-hover: #FFFCF5;
      --nav-guide-border: rgba(25, 24, 20, 0.14);
      --nav-guide-border-hover: rgba(31, 111, 120, 0.34);
      --nav-guide-text-primary: #191814;
      --nav-guide-text-secondary: #4A4338;
      --nav-guide-text-muted: #7A7062;
      --nav-guide-title: #64242E;
      --nav-guide-accent: #1F6F78;
      --nav-guide-accent-soft: rgba(31, 111, 120, 0.10);
      --nav-guide-shadow: 0 8px 24px rgba(25, 24, 20, 0.055);
      --nav-guide-shadow-hover: 0 14px 34px rgba(25, 24, 20, 0.09);
    }

    html[data-theme='dark'] .nav-guide-shell {
      --nav-guide-bg: rgba(16, 29, 53, 0.78);
      --nav-guide-bg-hover: rgba(23, 39, 68, 0.88);
      --nav-guide-border: rgba(226, 232, 240, 0.14);
      --nav-guide-border-hover: rgba(125, 205, 227, 0.38);
      --nav-guide-text-primary: #F4F7FB;
      --nav-guide-text-secondary: #C7D2E3;
      --nav-guide-text-muted: #91A4BC;
      --nav-guide-title: #7DCDE3;
      --nav-guide-accent: #7DCDE3;
      --nav-guide-accent-soft: rgba(125, 205, 227, 0.12);
      --nav-guide-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
      --nav-guide-shadow-hover: 0 16px 38px rgba(0, 0, 0, 0.34);
    }

    @keyframes navGuidePulse {
      0% {
        box-shadow: var(--nav-guide-shadow);
        border-color: var(--nav-guide-border);
      }

      50% {
        box-shadow: var(--nav-guide-shadow-hover);
        border-color: var(--nav-guide-border-hover);
      }

      100% {
        box-shadow: var(--nav-guide-shadow);
        border-color: var(--nav-guide-border);
      }
    }

    .nav-guide-btn {
      animation: navGuidePulse 3.4s infinite alternate;
    }

    .nav-guide-btn:hover {
      animation: none !important;
      background: var(--nav-guide-bg-hover) !important;
      border-color: var(--nav-guide-border-hover) !important;
      box-shadow: var(--nav-guide-shadow-hover) !important;
      transform: translateY(-2px);
    }

    .nav-guide-btn:focus-visible {
      outline: 2px solid var(--nav-guide-accent);
      outline-offset: 3px;
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
    <div
      className="nav-guide-shell"
      style={{
        margin: '2rem 0',
        padding: '1.5rem',
        border: '1px solid var(--nav-guide-border)',
        borderRadius: '12px',
        background: 'var(--nav-guide-bg)',
        boxShadow: 'var(--nav-guide-shadow)',
        position: 'relative',
      }}
    >
      <style>{navGuideStyles}</style>

      <button
        onClick={dismiss}
        aria-label="Cerrar guía de navegación"
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--nav-guide-text-muted)',
          fontSize: '1.1rem',
          lineHeight: 1,
          padding: '0.25rem',
        }}
      >
        ✕
      </button>

      <p
        style={{
          fontFamily: 'var(--ifm-font-family-base)',
          fontSize: '1.6rem',
          fontWeight: '700',
          color: 'var(--nav-guide-title)',
          textAlign: 'center',
          margin: '0 0 1.5rem 0',
        }}
      >
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
              border: '1px solid var(--nav-guide-border)',
              borderRadius: '8px',
              background: 'transparent',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: '1rem',
                fontFamily: 'var(--ifm-font-family-base)',
                color: 'var(--nav-guide-text-primary)',
              }}
            >
              {r.label}
            </span>

            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--nav-guide-text-secondary)',
                lineHeight: 1.4,
                fontFamily: 'var(--ifm-font-family-base)',
              }}
            >
              {r.desc}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
