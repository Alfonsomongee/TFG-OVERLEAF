import React, { lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const PVCurveSimulatorBase = lazy(() => import(/* webpackChunkName: "PVCurveSimulator" */ './PVCurveSimulatorBase'));

export default function PVCurveSimulator(props) {
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
          <PVCurveSimulatorBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
