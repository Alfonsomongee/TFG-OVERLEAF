// src/theme/Root.js
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

  const openSidebar = () => {
    setZenMode(false);
    document.documentElement.classList.remove('zen-mode');
    localStorage.setItem('zen-mode', 'false');
  };

  const closeSidebar = () => {
    setZenMode(true);
    document.documentElement.classList.add('zen-mode');
    localStorage.setItem('zen-mode', 'true');
  };

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  return (
    <>
      {children}

      {/* FAB Modo Cine */}
      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        Modo Cine
      </Link>

      {/* ☰ — solo cuando sidebar cerrada */}
      {zenMode && (
        <button className="global-sidebar-btn" onClick={openSidebar} aria-label="Mostrar barra lateral">
          ☰
        </button>
      )}

      {/* ‹ — solo cuando sidebar abierta, en el borde del panel */}
      {!zenMode && (
        <button className="global-sidebar-close-btn" onClick={closeSidebar} aria-label="Cerrar barra lateral">
          ‹
        </button>
      )}

      {/* Mostrar/Ocultar índice */}
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
