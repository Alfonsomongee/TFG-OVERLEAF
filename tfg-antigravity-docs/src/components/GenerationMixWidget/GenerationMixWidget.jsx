import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from '../ForensicUI/TelemetryFallback';

const GenerationMixWidgetBase = React.lazy(() => import('./GenerationMixWidgetBase'));

export default function GenerationMixWidget(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <GenerationMixWidgetBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
