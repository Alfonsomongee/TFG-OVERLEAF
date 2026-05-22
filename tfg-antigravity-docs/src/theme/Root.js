import React, { useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

function SmoothScrollRoot({ children }) {
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
