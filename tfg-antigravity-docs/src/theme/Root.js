// src/theme/Root.js
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }) {
  // null = no sabemos aún (SSR / primer render)
  const [zenMode, setZenMode] = useState(null);
  const [tocVisible, setTocVisible] = useState(false);
  const location = useLocation();

  const path = location.pathname;
  const hideUI = path === '/' || path === '' || path.startsWith('/cine');

  // Init desde localStorage — solo cliente
  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === null ? true : saved === 'true';
    setZenMode(isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Resetear TOC al navegar
  useEffect(() => {
    setTocVisible(false);
    document.documentElement.classList.remove('toc-visible');
  }, [path]);

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

  // Mientras no sepamos el estado (SSR / primer tick), no renderizar UI
  const uiReady = zenMode !== null && !hideUI;

  return (
    <>
      {children}

      {/* FAB Modo Cine — siempre excepto en intro y cine */}
      {!hideUI && (
        <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
          Modo Cine
        </Link>
      )}

      {uiReady && (
        <>
          {/* ☰ — sidebar cerrada */}
          {zenMode && (
            <button
              className="global-sidebar-btn"
              onClick={openSidebar}
              aria-label="Mostrar barra lateral"
              title="Mostrar barra lateral"
            >
              ☰
            </button>
          )}

          {/* ‹ — sidebar abierta, en el borde derecho del panel */}
          {!zenMode && (
            <button
              className="global-sidebar-close-btn"
              onClick={closeSidebar}
              aria-label="Cerrar barra lateral"
              title="Cerrar barra lateral"
            >
              ‹
            </button>
          )}

          {/* Mostrar/Ocultar índice — siempre visible, siempre funcional */}
          <button
            className={`global-toc-btn${tocVisible ? ' active' : ''}`}
            onClick={toggleToc}
            aria-label={tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
          >
            {tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
          </button>
        </>
      )}
    </>
  );
}
