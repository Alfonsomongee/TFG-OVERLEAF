// src/theme/Root.js
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { translate } from '@docusaurus/Translate';
import { useLocation } from '@docusaurus/router';
import { gsap } from 'gsap';
import GlossaryDefinitionPanel from '@site/src/components/GlossaryDefinitionPanel';
import FloatingActionBtn from '@site/src/components/ui/FloatingActionBtn';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocVisible, setTocVisible] = useState(false);
  const [tocPortalHtml, setTocPortalHtml] = useState('');
  const location = useLocation();

  const sidebarAnimTlRef = useRef(null);

  const rawPath = location.pathname.toLowerCase();
  const path = rawPath.endsWith('/') && rawPath !== '/'
    ? rawPath.slice(0, -1)
    : rawPath;

  const isHomepage = path === '/' || path === '/en' || path === '/de' || path === '/zh-hans';
  const hideButtonsPaths = ['/datos-tiempo-real', '/glosario', '/referencias', '/sobre-el-autor'];
  const shouldHideButtons = isHomepage || hideButtonsPaths.some(k => path.includes(k));

  // Inicialización modo zen
  useEffect(() => {
    const saved = localStorage.getItem('zen-mode');
    const isZen = saved !== 'false';
    setSidebarOpen(!isZen);
    document.documentElement.classList.toggle('zen-mode', isZen);
  }, []);

  // Asegurar las clases en el DOM aunque Docusaurus regenere <html> al navegar
  useEffect(() => {
    const applyHtmlClasses = () => {
      document.documentElement.classList.toggle('zen-mode', !sidebarOpen);
      document.documentElement.classList.toggle('toc-visible', tocVisible);
    };

    applyHtmlClasses();
    const frame = window.requestAnimationFrame(applyHtmlClasses);
    const timeout = window.setTimeout(applyHtmlClasses, 50);

    const observer = new MutationObserver(() => {
      const hasZen = document.documentElement.classList.contains('zen-mode');
      const hasToc = document.documentElement.classList.contains('toc-visible');
      if (hasZen !== !sidebarOpen || hasToc !== tocVisible) {
        applyHtmlClasses();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [sidebarOpen, tocVisible, location.pathname]);

  // Cerrar el TOC al navegar a una nueva página
  useEffect(() => {
    setTocVisible(false);
    document.documentElement.classList.remove('toc-visible');
    document.documentElement.classList.remove('toc-portal-visible');
  }, [location.pathname]);

  // GSAP stagger en items del sidebar cuando se abre
  useEffect(() => {
    if (!sidebarOpen) return;
    const sidebar = document.querySelector('.theme-doc-sidebar-container');
    if (!sidebar) return;

    sidebarAnimTlRef.current?.kill();
    const items = sidebar.querySelectorAll('.menu__link, .menu__list-item-collapsible');
    if (!items.length) return;

    sidebarAnimTlRef.current = gsap.from(items, {
      x: -10,
      opacity: 0,
      duration: 0.40,
      ease: 'power3.out',
      stagger: { each: 0.018, from: 'start' },
      delay: 0.15,
      clearProps: 'x,opacity',
    });
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    localStorage.setItem('zen-mode', String(!next));
  };

  const toggleToc = () => {
    const next = !tocVisible;
    setTocVisible(next);
    document.documentElement.classList.toggle('toc-visible', next);
  };

  // Sincronizar estado: cerrar el TOC cuando el usuario pincha en un enlace del índice
  useEffect(() => {
    const handleTocLinkClick = (e) => {
      const link = e.target.closest('.table-of-contents a');
      if (link) {
        setTocVisible(false);
        document.documentElement.classList.remove('toc-visible');
      }
    };
    document.addEventListener('click', handleTocLinkClick);
    return () => document.removeEventListener('click', handleTocLinkClick);
  }, []);

  useEffect(() => {
    const shouldUsePortal = tocVisible && !sidebarOpen && !isHomepage && !path.includes('/anexo');
    document.documentElement.classList.toggle('toc-portal-visible', shouldUsePortal);

    if (!shouldUsePortal) {
      setTocPortalHtml('');
      return () => document.documentElement.classList.remove('toc-portal-visible');
    }

    const frame = window.requestAnimationFrame(() => {
      const toc = document.querySelector('.theme-doc-toc-desktop');
      setTocPortalHtml(toc?.innerHTML || '');
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove('toc-portal-visible');
    };
  }, [tocVisible, sidebarOpen, isHomepage, path]);

  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = (e) => {
      let scrollTarget = e.target;
      if (scrollTarget === document || scrollTarget === window) {
        scrollTarget = document.scrollingElement || document.documentElement;
      }
      if (!scrollTarget || !scrollTarget.clientHeight) return;

      const currentScrollY = scrollTarget.scrollTop || window.scrollY || 0;
      const docHeight = scrollTarget.scrollHeight - scrollTarget.clientHeight;

      if (docHeight > 0) {
        const progress = (currentScrollY / docHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }

      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
          navbar.classList.add('navbar--hidden');
        } else {
          navbar.classList.remove('navbar--hidden');
        }
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true });
  }, []);

  const handleTocPortalClick = (e) => {
    const link = e.target.closest('.table-of-contents a');
    if (link) {
      setTocVisible(false);
      document.documentElement.classList.remove('toc-visible');
      document.documentElement.classList.remove('toc-portal-visible');
    }
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '2px',
          width: `${scrollProgress}%`,
          zIndex: 99999,
          transition: 'width 0.1s linear',
          background: 'var(--scroll-progress-color, var(--accent-electric))',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      {children}
      <GlossaryDefinitionPanel />

      {!shouldHideButtons && (
        <>
          {!sidebarOpen && (
            <FloatingActionBtn
              variant="sidebar-open"
              onClick={toggleSidebar}
              ariaLabel={translate({ id: 'theme.sidebar.open', message: 'Abrir barra lateral' })}
            >
              <IconMenu />
            </FloatingActionBtn>
          )}

          {sidebarOpen && (
            <FloatingActionBtn
              variant="sidebar-close"
              onClick={toggleSidebar}
              ariaLabel={translate({ id: 'theme.sidebar.close', message: 'Cerrar barra lateral' })}
            >
              <IconChevronLeft />
            </FloatingActionBtn>
          )}

          {!path.includes('/anexo') && (
            <FloatingActionBtn
              variant="toc"
              active={tocVisible}
              onClick={toggleToc}
              ariaLabel={
                tocVisible
                  ? translate({ id: 'theme.toc.hide', message: 'Ocultar índice' })
                  : translate({ id: 'theme.toc.show', message: 'Mostrar índice' })
              }
            >
              <IconToc />
            </FloatingActionBtn>
          )}
        </>
      )}

      {tocVisible && !sidebarOpen && tocPortalHtml && typeof document !== 'undefined' && createPortal(
        <nav
          className="floating-toc-portal"
          aria-label={translate({ id: 'theme.docs.toc.navAriaLabel', message: 'Table of contents' })}
          onClick={handleTocPortalClick}
          dangerouslySetInnerHTML={{ __html: tocPortalHtml }}
        />,
        document.body,
      )}
    </>
  );
}
