import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const IberianGridTopologyBase = React.lazy(() => import('./IberianGridTopologyBase'));

export default function IberianGridTopology(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <IberianGridTopologyBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
