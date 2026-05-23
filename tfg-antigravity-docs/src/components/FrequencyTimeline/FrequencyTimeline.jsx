import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from '../ForensicUI/TelemetryFallback';

const FrequencyTimelineBase = React.lazy(() => import('./FrequencyTimelineBase'));

export default function FrequencyTimeline(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <FrequencyTimelineBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
