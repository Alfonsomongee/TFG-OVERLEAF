// src/theme/Root.js
import React, { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import { useLocation } from '@docusaurus/router';
import GlossaryDefinitionPanel from '@site/src/components/GlossaryDefinitionPanel';

export default function Root({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // true = sidebar visible
  const [tocVisible, setTocVisible] = useState(false);
  const location = useLocation();

  const rawPath = location.pathname.toLowerCase();
  const path = rawPath.endsWith('/') && rawPath !== '/' ? rawPath.slice(0, -1) : rawPath;
  const isHomePage = path === '/' || path.match(/^\/[a-z]{2}$/);
  // 'galeria' y '/cronologia' eliminados: esas páginas necesitan los botones de sidebar
  const hideButtonsPaths = ['/datos-tiempo-real', '/glosario', '/referencias', '/sobre-el-autor'];
  const shouldHideButtons = isHomePage || hideButtonsPaths.some(keyword => path.includes(keyword));

  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved === 'true';
    setSidebarOpen(!isZen);
  }, []);

  // Re-aplicar clases en cada cambio de ruta (Docusaurus resetea la etiqueta <html> al navegar)
  useEffect(() => {
    document.documentElement.classList.toggle('zen-mode', !sidebarOpen);
    document.documentElement.classList.toggle('toc-visible', tocVisible);
  }, [location.pathname, sidebarOpen, tocVisible]);

  const toggleSidebar = () => {
    const nextOpen = !sidebarOpen;
    setSidebarOpen(nextOpen);
    localStorage.setItem('zen-mode', String(!nextOpen));
  };

  const toggleToc = () => {
    setTocVisible(!tocVisible);
  };

  return (
    <>
      {children}

      {/* Panel lateral de definiciones del glosario técnico */}
      <GlossaryDefinitionPanel />

      {!shouldHideButtons && (
        <>
          {/* FAB Modo Cine */}
          <Link to="/cine" className="cine-fab" aria-label={translate({id: 'theme.cine.open', message: 'Abrir Modo Cine'})}>
            <Translate id="theme.cine.button">Modo Cine</Translate>
          </Link>

          {/* ☰ solo si el sidebar está cerrado */}
          {!sidebarOpen && (
            <button
              className="global-sidebar-btn"
              onClick={toggleSidebar}
              aria-label={translate({id: 'theme.sidebar.open', message: 'Abrir barra lateral'})}
              title={translate({id: 'theme.sidebar.open', message: 'Abrir barra lateral'})}
            >
              ☰
            </button>
          )}

          {/* ‹ solo si el sidebar está abierto */}
          {sidebarOpen && (
            <button
              className="global-sidebar-close-btn"
              onClick={toggleSidebar}
              aria-label={translate({id: 'theme.sidebar.close', message: 'Cerrar barra lateral'})}
              title={translate({id: 'theme.sidebar.close', message: 'Cerrar barra lateral'})}
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
      )}
    </>
  );
}