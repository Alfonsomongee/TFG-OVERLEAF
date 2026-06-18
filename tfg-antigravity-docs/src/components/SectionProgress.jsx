import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

export default function SectionProgress() {
  const location = useLocation();
  const [current, setCurrent] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getHeadings = () => {
      const article =
        document.querySelector('article') ||
        document.querySelector('.theme-doc-markdown');
      return article ? Array.from(article.querySelectorAll('h2[id]')) : [];
    };

    let headings = [];

    const init = () => {
      headings = getHeadings();
      setTotal(headings.length);
    };

    // Defer slightly so the new page's article is in the DOM
    const initTimer = setTimeout(init, 120);

    const onScroll = () => {
      if (!headings.length) headings = getHeadings();
      if (headings.length < 2) return;

      const scrollY = window.scrollY;
      const atTop = scrollY < 180;
      const atBottom =
        scrollY + window.innerHeight >= document.body.scrollHeight - 100;

      if (atTop || atBottom) {
        setVisible(false);
        return;
      }

      const viewportMark = scrollY + window.innerHeight * 0.32;
      let activeIdx = -1;
      for (let i = 0; i < headings.length; i++) {
        const top = headings[i].getBoundingClientRect().top + scrollY;
        if (top <= viewportMark) activeIdx = i;
        else break;
      }

      if (activeIdx >= 0) {
        setCurrent(headings[activeIdx].textContent.replace(/​|#$/g, '').trim());
        setIndex(activeIdx + 1);
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', onScroll);
      setVisible(false);
    };
  }, [location.pathname]);

  if (!visible || !current || total < 2) return null;

  return (
    <div className="section-progress" aria-hidden="true">
      <span className="section-progress-fraction">§ {index}/{total}</span>
      <span>{current}</span>
    </div>
  );
}
