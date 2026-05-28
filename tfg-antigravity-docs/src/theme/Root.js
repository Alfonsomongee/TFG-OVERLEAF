import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';
import { createPortal } from 'react-dom';

export default function Root({ children }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const [isExcluded, setIsExcluded] = useState(false); // el CSS de intro ya los oculta si hace falta
  const location = useLocation();

  // Inicializar solo en cliente
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Detectar ruta excluida solo en cliente (normaliza trailing slash)
  useEffect(() => {
    if (!mounted) return;
    const raw = location.pathname;
    const path = raw.endsWith('/') && raw !== '/' ? raw.slice(0, -1) : raw;
    const excluded = path === '/' || path === '' || path.startsWith('/cine');
    setIsExcluded(excluded);
  }, [location.pathname, mounted]);

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

  const openSidebar  = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleToc    = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  const showButtons = mounted && !isExcluded;

  const buttons = showButtons ? (
    <>
      {!sidebarOpen && (
        <button className="global-sidebar-btn" onClick={openSidebar} aria-label="Abrir barra lateral">
          ☰
        </button>
      )}
      {sidebarOpen && (
        <button className="global-sidebar-close-btn" onClick={closeSidebar} aria-label="Cerrar barra lateral">
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
      {children}
      {/* div fijo en lugar de portal — para descartar problemas de createPortal */}
      {mounted && !isExcluded && (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 99999, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            {!isExcluded && (
              <a href="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
                Modo Cine
              </a>
            )}
            {buttons}
          </div>
        </div>
      )}
    </>
  );
}
