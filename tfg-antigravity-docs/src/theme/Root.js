import React, { useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';

function SmoothScrollRoot({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Reset scroll to top on navigation to fix Next Chapter bug,
    // ONLY if there is no hash anchor in the URL (e.g. Glossary links)
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  useEffect(() => {
    // Solo cargamos Lenis en cliente
    const initLenis = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      try {
        const Lenis = (await import('lenis')).default;
        // Import CSS directly since we are in webpack
        await import('lenis/dist/lenis.css');
        
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        
        function raf(t) { 
          lenis.raf(t); 
          requestAnimationFrame(raf); 
        }
        
        requestAnimationFrame(raf);
        
        return () => {
          lenis.destroy();
        };
      } catch (e) {
        console.warn('Lenis failed to load', e);
      }
    };
    
    initLenis();

    // Workaround para prevenir que Lenis secuestre el scroll de la barra lateral (sidebar)
    // Docusaurus no permite añadir atributos fácilmente sin hacer swizzle completo,
    // así que lo inyectamos dinámicamente.
    const applyLenisPrevent = () => {
      const sidebars = document.querySelectorAll('.theme-doc-sidebar-menu, aside, .menu');
      sidebars.forEach(el => {
        if (!el.hasAttribute('data-lenis-prevent')) {
          el.setAttribute('data-lenis-prevent', 'true');
        }
      });
    };

    applyLenisPrevent();
    const observer = new MutationObserver(applyLenisPrevent);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

export default function Root({ children }) {
  return (
    <>
      <BrowserOnly fallback={<>{children}</>}>
        {() => (
          <SmoothScrollRoot>
            {children}
          </SmoothScrollRoot>
        )}
      </BrowserOnly>
    </>
  );
}
