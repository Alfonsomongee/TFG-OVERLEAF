import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const BlackoutPropagationMapBase = React.lazy(() => import('./BlackoutPropagationMapBase'));

export default function BlackoutPropagationMap(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <BlackoutPropagationMapBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
