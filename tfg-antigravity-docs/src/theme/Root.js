// src/theme/Root.js
// Global wrapper — renders the floating "Modo Cine" button on every page
// except the /cine page itself (which adds body.cine-mode-active, hiding the FAB via CSS).

import React from 'react';
import Link from '@docusaurus/Link';

export default function Root({ children }) {
  return (
    <>
      {children}

      {/* ── Floating Action Button → /cine ───────────────────────
          Hidden via CSS when body.cine-mode-active is set (i.e. on /cine).
          The <Link> component handles SPA navigation without a full reload. */}
      <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
        <span className="cine-fab__icon">🎬</span>
        <span className="cine-fab__label">Modo Cine</span>
      </Link>
    </>
  );
}
