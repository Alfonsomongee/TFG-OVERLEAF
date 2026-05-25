import React, { useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';

function SmoothScrollRoot({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  useEffect(() => {
    let lenisInstance = null;
    let rafId = null;
    let mounted = true;

    const initLenis = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      try {
        const Lenis = (await import('lenis')).default;
        await import('lenis/dist/lenis.css');
        if (!mounted) return;
        lenisInstance = new Lenis({ lerp: 0.08, smoothWheel: true, syncTouch: false });
        window.lenis = lenisInstance;
        function raf(t) {
          if (!lenisInstance) return;
          lenisInstance.raf(t);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      } catch (e) {
        console.warn('[Lenis] Failed to load:', e);
      }
    };

    initLenis();

    const applyLenisPrevent = () => {
      document.querySelectorAll('.theme-doc-sidebar-menu, aside, .menu').forEach(el => {
        if (!el.hasAttribute('data-lenis-prevent')) {
          el.setAttribute('data-lenis-prevent', 'true');
        }
      });
    };
    applyLenisPrevent();
    const observer = new MutationObserver(applyLenisPrevent);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
      delete window.lenis;
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

export default function Root({ children }) {
  return (
    <BrowserOnly fallback={<>{children}</>}>
      {() => {
        const CustomCursor = require('@site/src/components/CustomCursor').default;
        return (
          <SmoothScrollRoot>
            <CustomCursor />
            {children}
          </SmoothScrollRoot>
        );
      }}
    </BrowserOnly>
  );
}
