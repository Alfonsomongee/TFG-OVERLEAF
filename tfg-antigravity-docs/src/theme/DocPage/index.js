// src/theme/DocPage/index.js
// Wrapper de DocPage — inyecta botones de sidebar/TOC via portal al body
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import DocPage from '@theme-original/DocPage';
import { useLocation } from '@docusaurus/router';

export default function DocPageWrapper(props) {
  const [sidebarOpen, setSidebarOpen] = useState(null); // null = no sabemos aún
  const [tocVisible, setTocVisible]   = useState(false);
  const [mounted, setMounted]         = useState(false);
  const { pathname } = useLocation();

  // Solo en páginas de documento, no en intro ni cine
  const hideButtons = pathname === '/' || pathname === '' || pathname.startsWith('/cine');

  // Init cliente
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Sincronizar clase HTML y localStorage
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

  // Resetear TOC al navegar
  useEffect(() => {
    setTocVisible(false);
    document.documentElement.classList.remove('toc-visible');
  }, [pathname]);

  const openSidebar  = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleToc    = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  const showButtons = mounted && sidebarOpen !== null && !hideButtons;

  const buttons = showButtons ? (
    <>
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
      <button
        className={`global-toc-btn${tocVisible ? ' active' : ''}`}
        onClick={toggleToc}
        aria-label={tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
      >
        {tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
      </button>
    </>
  ) : null;

  return (
    <>
      {mounted && buttons && createPortal(buttons, document.body)}
      <DocPage {...props} />
    </>
  );
}
