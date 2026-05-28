// src/theme/Root.js
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }) {
  const [zenMode, setZenMode] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const location = useLocation();

  const isIntro = location.pathname === '/' || location.pathname === '';
  const isCine  = location.pathname.startsWith('/cine');

  // Inicializar desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === null ? true : saved === 'true';
    setZenMode(isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Resetear TOC al cambiar de página
  useEffect(() => {
    setTocVisible(false);
    document.documentElement.classList.remove('toc-visible');
  }, [location.pathname]);

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

  if (isIntro || isCine) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* FAB Modo Cine */}
      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        Modo Cine
      </Link>

      {/* ☰ abre sidebar — solo cuando está cerrada */}
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

      {/* ✕ cierra sidebar — en el borde derecho de la barra lateral */}
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

      {/* Mostrar/Ocultar índice — siempre visible, independiente del sidebar */}
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
