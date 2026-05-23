import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const EnergyTransitionStreamgraphBase = React.lazy(() => import('./EnergyTransitionStreamgraphBase'));

export default function EnergyTransitionStreamgraph(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <EnergyTransitionStreamgraphBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
