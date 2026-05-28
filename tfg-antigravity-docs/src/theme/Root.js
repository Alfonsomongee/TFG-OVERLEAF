// src/theme/Root.js
// Global wrapper — FAB flotante "Modo Cine" + controles de barra lateral e índice

import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';

export default function Root({ children }) {
  const [zenMode, setZenMode] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);

  // Inicializar desde localStorage en cliente
  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === null ? true : saved === 'true';
    setZenMode(isZen);
    if (isZen) {
      document.documentElement.classList.add('zen-mode');
    } else {
      document.documentElement.classList.remove('zen-mode');
    }
  }, []);

  const toggleSidebar = () => {
    const next = !zenMode;
    setZenMode(next);
    if (next) {
      document.documentElement.classList.add('zen-mode');
    } else {
      document.documentElement.classList.remove('zen-mode');
    }
    localStorage.setItem('zen-mode', String(next));
    // Al mostrar sidebar, ocultar TOC independiente
    if (!next === false) {
      setTocVisible(false);
      document.documentElement.classList.remove('toc-visible');
    }
  };

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    if (next) {
      document.documentElement.classList.add('toc-visible');
    } else {
      document.documentElement.classList.remove('toc-visible');
    }
  };

  return (
    <>
      {children}

      {/* FAB Modo Cine */}
      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        <span className="cine-fab__icon">🎬</span>
        <span className="cine-fab__label">Modo Cine</span>
      </Link>

      {/* Botón flotante barra lateral */}
      <button
        className="global-sidebar-btn"
        onClick={toggleSidebar}
        aria-label={zenMode ? 'Mostrar barra lateral' : 'Ocultar barra lateral'}
        title={zenMode ? 'Mostrar barra lateral' : 'Ocultar barra lateral'}
      >
        ☰
      </button>

      {/* Botón flotante mostrar índice */}
      <button
        className={`global-toc-btn${tocVisible ? ' active' : ''}`}
        onClick={toggleToc}
        aria-label={tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
      >
        {tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
      </button>
    </>
  );
}
