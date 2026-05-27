import React, { useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';

function SmoothScrollRoot({ children }) {
  const { pathname, hash } = useLocation();

  // Reset scroll en navegación (respeta hash anchors del glosario)
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
    // ─── LENIS con cleanup completamente seguro ────────────────────────────
    // Problema original: initLenis era async pero el cleanup del useEffect
    // retornaba ANTES de que la promesa resolviera → lenis.destroy() nunca
    // se ejecutaba si el componente se desmontaba durante la carga dinámica.
    let lenisInstance = null;
    let rafId = null;
    let mounted = true; // bandera de montaje para guardar la async race

    const initLenis = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      try {
        const Lenis = (await import('lenis')).default;
        await import('lenis/dist/lenis.css');

        // Si el componente se desmontó mientras esperábamos los imports, salir
        if (!mounted) return;

        lenisInstance = new Lenis({
          lerp: 0.08,          // ligeramente más veloz que 0.1 → más responsivo
          smoothWheel: true,
          syncTouch: false,    // desactivar en móvil: Lenis + touch = scroll glitchy
        });
        window.lenis = lenisInstance;

        function raf(t) {
          if (!lenisInstance) return; // guardia extra post-destroy
          lenisInstance.raf(t);
          rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);
      } catch (e) {
        console.warn('[Lenis] Failed to load:', e);
      }
    };

    initLenis();

    // ─── MutationObserver: inyectar data-lenis-prevent en sidebars ─────────
    const applyLenisPrevent = () => {
      document
        .querySelectorAll('.theme-doc-sidebar-menu, aside, .menu')
        .forEach(el => {
          if (!el.hasAttribute('data-lenis-prevent')) {
            el.setAttribute('data-lenis-prevent', 'true');
          }
        });
    };
    applyLenisPrevent();

    const observer = new MutationObserver(applyLenisPrevent);
    observer.observe(document.body, { childList: true, subtree: true });

    // ─── CLEANUP completo y seguro ─────────────────────────────────────────
    return () => {
      mounted = false;                     // señal para el async en vuelo
      cancelAnimationFrame(rafId);         // parar el RAF loop
      lenisInstance?.destroy();            // destruir la instancia
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
