// src/theme/DocItem/Layout/index.js
// Wrapper exclusivo de páginas de documentación — inyecta botones de sidebar y TOC

import React, { useState, useEffect } from 'react';
import Layout from '@theme-original/DocItem/Layout';

export default function LayoutWrapper(props) {
  const [sidebarOpen, setSidebarOpen] = useState(null); // null = esperando localStorage
  const [tocVisible, setTocVisible] = useState(false);

  // Leer estado inicial desde localStorage (solo cliente)
  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    // zen-mode:'true'  → sidebar cerrada
    // zen-mode:'false' o null → sidebar abierta (comportamiento natural en docs)
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Sincronizar clase HTML y localStorage cuando cambia sidebarOpen
  useEffect(() => {
    if (sidebarOpen === null) return;
    if (sidebarOpen) {
      document.documentElement.classList.remove('zen-mode');
      localStorage.setItem('zen-mode', 'false');
    } else {
      document.documentElement.classList.add('zen-mode');
      localStorage.setItem('zen-mode', 'true');
    }
  }, [sidebarOpen]);

  const openSidebar  = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  return (
    <>
      {/* Botones — solo tras leer localStorage (sidebarOpen !== null) */}
      {sidebarOpen !== null && (
        <>
          {/* ☰ abrir sidebar — solo cuando está cerrada */}
          {!sidebarOpen && (
            <button
              className="global-sidebar-btn"
              onClick={openSidebar}
              aria-label="Mostrar barra lateral"
              title="Mostrar barra lateral"
            >
              ☰
            </button>
          )}

          {/* ‹ cerrar sidebar — en el borde derecho del panel */}
          {sidebarOpen && (
            <button
              className="global-sidebar-close-btn"
              onClick={closeSidebar}
              aria-label="Cerrar barra lateral"
              title="Cerrar barra lateral"
            >
              ‹
            </button>
          )}

          {/* Mostrar/Ocultar índice — siempre visible e independiente */}
          <button
            className={`global-toc-btn${tocVisible ? ' active' : ''}`}
            onClick={toggleToc}
            aria-label={tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
          >
            {tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
          </button>
        </>
      )}

      <Layout {...props} />
    </>
  );
}
