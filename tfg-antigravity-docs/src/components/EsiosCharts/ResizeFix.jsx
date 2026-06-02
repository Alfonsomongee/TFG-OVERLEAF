import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useEffect } from 'react';

export default function ResizeFix() {
  const lang = useDocLang();
  const isEs = lang === 'es';
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prevent Webpack Dev Server overlay for ResizeObserver errors
      const handleError = (e) => {
        if (e.message && (e.message.includes('ResizeObserver') || e.message.includes('undelivered notifications'))) {
          e.stopImmediatePropagation();
        }
      };
      window.addEventListener('error', handleError);

      // Monkeypatch ResizeObserver to run in rAF, which fixes the root cause in Recharts
      const _ResizeObserver = window.ResizeObserver;
      window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
        constructor(callback) {
          super((entries, observer) => {
            window.requestAnimationFrame(() => {
              try {
                callback(entries, observer);
              } catch (e) {}
            });
          });
        }
      };

      return () => {
        window.removeEventListener('error', handleError);
      };
    }
  }, []);

  return null;
}
