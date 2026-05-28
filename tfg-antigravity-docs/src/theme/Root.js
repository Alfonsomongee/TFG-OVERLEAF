// src/theme/Root.js
// Solo FAB Modo Cine — los botones de sidebar/TOC están en DocItem/Layout

import React from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

export default function Root({ children }) {
  const { pathname } = useLocation();
  const hideCine = pathname === '/' || pathname === '' || pathname.startsWith('/cine');

  return (
    <>
      {children}
      {!hideCine && (
        <Link to="/cine" className="cine-fab" aria-label="Abrir Modo Cine">
          Modo Cine
        </Link>
      )}
    </>
  );
}
