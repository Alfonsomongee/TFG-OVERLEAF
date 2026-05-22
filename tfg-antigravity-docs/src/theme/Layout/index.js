import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function CursorComponent() {
  const AnimatedCursor = require('react-animated-cursor');
  // En v2.6.0 puede ser exportado directamente o tener un .default
  const Cursor = AnimatedCursor.default || AnimatedCursor;
  return (
    <div className="custom-cursor-wrapper">
      <Cursor
        innerSize={6}
        outerSize={36}
        color="0, 229, 255"
        outerAlpha={0.15}
        innerScale={0.6}
        outerScale={2.2}
        trailingSpeed={5}
        outerStyle={{
          border: '1px solid rgba(0,229,255,0.5)',
          mixBlendMode: 'screen',
          boxShadow: '0 0 24px rgba(0,229,255,0.4)',
        }}
        clickables={['a', 'button', '.chart-card', ':is(input,textarea,select)', '.clickable', '.menu__link', '.pagination-nav__link']}
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
