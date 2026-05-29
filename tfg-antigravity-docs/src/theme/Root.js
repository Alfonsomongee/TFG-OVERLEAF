// src/theme/Root.js
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';

export default function Root({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // true = sidebar visible
  const [tocVisible, setTocVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  const toggleSidebar = () => {
    const nextOpen = !sidebarOpen;
    setSidebarOpen(nextOpen);
    const isZen = !nextOpen;
    document.documentElement.classList.toggle('zen-mode', isZen);
    localStorage.setItem('zen-mode', String(isZen));
    // No tocamos el TOC; cada botón es independiente
  };

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  return (
    <>
      {children}

      {/* FAB Modo Cine (ya sin emoji, tipografía Space Grotesk vía CSS) */}
      <Link to="/cine" className="cine-fab" aria-label={translate({id: 'theme.cine.open', message: 'Abrir Modo Cine'})}>
        <Translate id="theme.cine.button">Modo Cine</Translate>
      </Link>

      {/* ☰ solo si el sidebar está cerrado */}
      {!sidebarOpen && (
        <button
          className="global-sidebar-btn"
          onClick={toggleSidebar}
          aria-label="Abrir barra lateral"
          title="Abrir barra lateral"
        >
          ☰
        </button>
      )}

      {/* ‹ solo si el sidebar está abierto, pegado al borde derecho del panel */}
      {sidebarOpen && (
        <button
          className="global-sidebar-close-btn"
          onClick={toggleSidebar}
          aria-label="Cerrar barra lateral"
          title="Cerrar barra lateral"
        >
          ‹
        </button>
      )}

      {/* Mostrar / Ocultar índice */}
      <button
        className={`global-toc-btn${tocVisible ? ' active' : ''}`}
        onClick={toggleToc}
        aria-label={tocVisible 
          ? translate({id: 'theme.toc.hide', message: 'Ocultar índice'}) 
          : translate({id: 'theme.toc.show', message: 'Mostrar índice'})}
      >
        {tocVisible 
          ? <Translate id="theme.toc.hide">Ocultar índice</Translate> 
          : <Translate id="theme.toc.show">Mostrar índice</Translate>}
      </button>
    </>
  );
}