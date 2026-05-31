import React, { useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import { useLocation } from '@docusaurus/router';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Layout(props) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = location.pathname.toLowerCase();
    
    // Rutas donde NO queremos los botones flotantes (incluida la intro/homepage en cualquier idioma)
    const isHomePage = path === '/' || path.match(/^\/[a-z]{2}\/$/);
    
    const hideButtonsPaths = [
      '/datos-tiempo-real',
      '/glosario',
      '/referencias',
      '/sobre-el-autor'
    ];
    
    const shouldHideButtons = isHomePage || hideButtonsPaths.some(keyword => path.includes(keyword));

    if (shouldHideButtons) {
      document.body.classList.add('hide-floating-buttons');
    } else {
      document.body.classList.remove('hide-floating-buttons');
    }

    return () => {
      document.body.classList.remove('hide-floating-buttons');
    };
  }, [location.pathname]);

  const path = location.pathname.toLowerCase();
  const isHomePage = path === '/' || path.match(/^\/[a-z]{2}\/$/);

  return (
    <>
      <OriginalLayout {...props} />
      {!isHomePage && <ChatWidget />}
    </>
  );
}
