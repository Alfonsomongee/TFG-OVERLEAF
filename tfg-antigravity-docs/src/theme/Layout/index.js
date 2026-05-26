import React, { useState, useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import CustomCursor from '@site/src/components/CustomCursor';

function CursorComponent() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches);
  }, []);
  if (!isDesktop) return null;
  return <CustomCursor />;
}

export default function Layout(props) {
  return (
    <>
      <BrowserOnly>
        {() => <CursorComponent />}
      </BrowserOnly>
      <OriginalLayout {...props} />
    </>
  );
}
