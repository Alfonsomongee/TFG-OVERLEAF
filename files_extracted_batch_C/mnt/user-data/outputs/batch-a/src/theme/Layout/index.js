import React, { useState, useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

/**
 * CursorComponent — solo se monta en dispositivos con puntero fino (desktop/trackpad).
 *
 * Problema original: react-animated-cursor se cargaba en TODOS los dispositivos,
 * incluyendo móviles y tablets donde no existe cursor. En esos contextos consumía
 * recursos (event listeners, RAF implícito) sin aportar ningún valor visual.
 *
 * Solución: detectar pointer: fine antes de montar el componente.
 * pointer: fine = ratón o trackpad (precisión pixel). 
 * pointer: coarse = pantalla táctil (dedo).
 */
function CursorComponent() {
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setHasFinePointer(mq.matches);

    // Escuchar cambios (ej. conexión de ratón a tablet)
    const handler = (e) => setHasFinePointer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!hasFinePointer) return null;

  // Importación dinámica síncrona: solo cuando sabemos que hay puntero fino
  const AnimatedCursor = require('react-animated-cursor');
  const Cursor = AnimatedCursor.default || AnimatedCursor;

  return (
    <div className="custom-cursor-wrapper" aria-hidden="true">
      <Cursor
        innerSize={5}           // reducido de 6 → más elegante
        outerSize={30}          // reducido de 36 → menos intrusivo
        color="0, 229, 255"
        outerAlpha={0.10}       // reducido de 0.15 → más sutil
        innerScale={0.5}
        outerScale={1.8}        // reducido de 2.2
        trailingSpeed={6}       // ligeramente más veloz → sensación más precisa
        outerStyle={{
          border: '1px solid rgba(0,229,255,0.4)',
          mixBlendMode: 'screen',
          // ← Eliminado: boxShadow glow (demasiado visible y costoso en repaint)
        }}
        clickables={[
          'a',
          'button',
          '.chart-card',
          ':is(input,textarea,select)',
          '.clickable',
          '.menu__link',
          '.pagination-nav__link',
        ]}
      />
    </div>
  );
}

export default function Layout(props) {
  return (
    <>
      <BrowserOnly>
        {() => <CursorComponent />}
      </BrowserOnly>
      <OriginalLayout {...props} />
    </>
  );
}
