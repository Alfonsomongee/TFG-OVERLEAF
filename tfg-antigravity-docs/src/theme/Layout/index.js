import React, { useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Layout(props) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = location.pathname.toLowerCase();

    const hideButtonsPaths = [
      '/datos-tiempo-real',
      '/glosario',
      '/referencias',
      '/sobre-el-autor'
    ];

    const shouldHideButtons = hideButtonsPaths.some(k => path.includes(k));
    if (shouldHideButtons) {
      document.body.classList.add('hide-floating-buttons');
    } else {
      document.body.classList.remove('hide-floating-buttons');
    }

    return () => {
      document.body.classList.remove('hide-floating-buttons');
    };
  }, [location.pathname]);

  return (
    <>
      <div className="page-transition-enter">
        <OriginalLayout {...props} />
      </div>
      <ChatWidget />
    </>
  );
}
