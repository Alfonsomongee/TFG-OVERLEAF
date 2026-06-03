// src/theme/Root.js
import React, { useEffect, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import { useLocation } from '@docusaurus/router';
import GlossaryDefinitionPanel from '@site/src/components/GlossaryDefinitionPanel';

const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="3" y1="5"  x2="17" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="12" height="20" viewBox="0 0 12 20" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 2L2 10L10 18" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconToc = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="1" y1="4"  x2="17" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="9"  x2="17" y2="9"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="1.5" cy="9"  r="1.5" fill="currentColor"/>
    <circle cx="1.5" cy="14" r="1.5" fill="currentColor"/>
  </svg>
);

export default function Root({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tocVisible, setTocVisible] = useState(false);
  const location = useLocation();

  const rawPath = location.pathname.toLowerCase();
  const path = rawPath.endsWith('/') && rawPath !== '/'
    ? rawPath.slice(0, -1)
    : rawPath;

  const hideButtonsPaths = [
    '/datos-tiempo-real', '/glosario', '/referencias', '/sobre-el-autor',
  ];
  const shouldHideButtons = hideButtonsPaths.some(k => path.includes(k));

  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    setSidebarOpen(saved !== 'true');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('zen-mode', !sidebarOpen);
    document.documentElement.classList.toggle('toc-visible', tocVisible);
  }, [location.pathname, sidebarOpen, tocVisible]);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    localStorage.setItem('zen-mode', String(!next));
  };

  const toggleToc = () => setTocVisible(v => !v);

  return (
    <>
      {children}
      <GlossaryDefinitionPanel />

      {!shouldHideButtons && (
        <>
          {/* Abrir sidebar — visible solo cuando está cerrado */}
          {!sidebarOpen && (
            <button
              className="global-sidebar-btn"
              onClick={toggleSidebar}
              aria-label={translate({
                id: 'theme.sidebar.open',
                message: 'Abrir barra lateral',
              })}
              title={translate({
                id: 'theme.sidebar.open',
                message: 'Abrir barra lateral',
              })}
            >
              <IconMenu />
            </button>
          )}

          {/* Cerrar sidebar — visible solo cuando está abierto */}
          {sidebarOpen && (
            <button
              className="global-sidebar-close-btn"
              onClick={toggleSidebar}
              aria-label={translate({
                id: 'theme.sidebar.close',
                message: 'Cerrar barra lateral',
              })}
              title={translate({
                id: 'theme.sidebar.close',
                message: 'Cerrar barra lateral',
              })}
            >
              <IconChevronLeft />
            </button>
          )}

          {/* TOC — visible en todas las páginas excepto anexos */}
          {!path.includes('/anexo') && (
            <button
              className={`global-toc-btn${tocVisible ? ' active' : ''}`}
              onClick={toggleToc}
              aria-label={
                tocVisible
                  ? translate({ id: 'theme.toc.hide', message: 'Ocultar índice' })
                  : translate({ id: 'theme.toc.show', message: 'Mostrar índice' })
              }
              title={
                tocVisible
                  ? translate({ id: 'theme.toc.hide', message: 'Ocultar índice' })
                  : translate({ id: 'theme.toc.show', message: 'Mostrar índice' })
              }
            >
              <IconToc />
            </button>
          )}
        </>
      )}
    </>
  );
}