// src/theme/Root.js
// Global wrapper — FAB flotante "Modo Cine" en todas las páginas excepto /cine

import React from 'react';
import Link from '@docusaurus/Link';

export default function Root({ children }) {
  return (
    <>
      {children}
      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        <span className="cine-fab__icon">🎬</span>
        <span className="cine-fab__label">Modo Cine</span>
      </Link>
    </>
  );
}
