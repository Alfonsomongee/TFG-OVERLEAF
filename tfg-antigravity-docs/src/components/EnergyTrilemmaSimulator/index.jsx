import React, { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const EnergyTrilemmaSimulatorBase = lazy(() => import(/* webpackChunkName: "EnergyTrilemmaSimulator" */ './EnergyTrilemmaSimulatorBase'));

export default function EnergyTrilemmaSimulator(props) {
  return (
    <BrowserOnly>
      {() => (
        <Suspense fallback={
          <div style={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-1, #64748b)',
            fontFamily: 'monospace',
            fontSize: '13px'
          }}>
            Inicializando simulador…
          </div>
        }>
          <EnergyTrilemmaSimulatorBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
