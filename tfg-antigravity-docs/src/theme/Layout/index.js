import React, { useState, useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function CursorComponent() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    setIsDesktop(window.matchMedia('(pointer: fine)').matches);
  }, []);
  if (!isDesktop) return null;
  const AnimatedCursor = require('react-animated-cursor');
  const Cursor = AnimatedCursor.default || AnimatedCursor;
  return (
    <div className="custom-cursor-wrapper">
      <Cursor
        innerSize={5}
        outerSize={30}
        color="0, 229, 255"
        outerAlpha={0.1}
        innerScale={0.5}
        outerScale={2.0}
        trailingSpeed={6}
        outerStyle={{
          border: '1px solid rgba(0,229,255,0.4)',
          mixBlendMode: 'screen',
        }}
        clickables={['a', 'button', '.chart-card', ':is(input,textarea,select)', '.menu__link']}
      />
    </div>
  );
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
