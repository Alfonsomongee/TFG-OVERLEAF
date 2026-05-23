import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from '../ForensicUI/TelemetryFallback';

const UFLSVisualizerBase = React.lazy(() => import('./UFLSVisualizerBase'));

export default function UFLSVisualizer(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <UFLSVisualizerBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
