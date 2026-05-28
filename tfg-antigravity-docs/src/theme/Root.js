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
        Modo Cine
      </Link>

      {/* Botón ☰ — solo visible cuando la barra lateral está CERRADA */}
      {zenMode && (
        <button
          className="global-sidebar-btn"
          onClick={toggleSidebar}
          aria-label="Mostrar barra lateral"
          title="Mostrar barra lateral"
        >
          ☰
        </button>
      )}

      {/* Botón mostrar índice */}
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
