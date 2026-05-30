import React, { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ANSI59CascadeBase = lazy(() => import(/* webpackChunkName: "ANSI59Cascade" */ './ANSI59CascadeBase'));

export default function ANSI59Cascade(props) {
  return (
    <BrowserOnly>
      {() => (
        <Suspense fallback={
          <div style={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            Inicializando simulador…
          </div>
        }>
          <ANSI59CascadeBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
