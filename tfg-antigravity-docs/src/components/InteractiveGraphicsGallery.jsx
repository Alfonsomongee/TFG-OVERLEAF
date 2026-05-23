import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const InteractiveGraphicsGalleryBase = React.lazy(() => import('./InteractiveGraphicsGalleryBase'));

export default function InteractiveGraphicsGallery(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <InteractiveGraphicsGalleryBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}
