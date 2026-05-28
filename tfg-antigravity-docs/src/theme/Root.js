import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
    setMounted(true);
  }, []);

  const isExcluded = location.pathname === '/' || location.pathname.startsWith('/cine');

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    document.documentElement.classList.toggle('zen-mode', !next);
    localStorage.setItem('zen-mode', String(!next));
  };

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  if (!mounted || isExcluded) return <>{children}</>;

  return (
    <>
      {children}

      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        Modo Cine
      </Link>

      {/* ☰ solo cuando sidebar cerrada */}
      {!sidebarOpen && (
        <button className="global-sidebar-btn" onClick={toggleSidebar} aria-label="Mostrar barra lateral">
          ☰
        </button>
      )}

      {/* ‹ en el borde derecho del sidebar cuando está abierta */}
      {sidebarOpen && (
        <button className="global-sidebar-close-btn" onClick={toggleSidebar} aria-label="Cerrar barra lateral">
          ‹
        </button>
      )}

      <button
        className={`global-toc-btn${tocVisible ? ' active' : ''}`}
        onClick={toggleToc}
      >
        {tocVisible ? 'Ocultar índice' : 'Mostrar índice'}
      </button>
    </>
  );
}
