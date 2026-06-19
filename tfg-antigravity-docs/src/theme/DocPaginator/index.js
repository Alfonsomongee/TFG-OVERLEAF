import React, { useCallback } from 'react';
import { translate } from '@docusaurus/Translate';
import { useHistory } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';

const LABELS = {
  es: { prev: 'Capítulo anterior', next: 'Siguiente capítulo' },
  en: { prev: 'Previous chapter', next: 'Next chapter' },
  de: { prev: 'Vorheriges Kapitel', next: 'Nächstes Kapitel' },
  pt: { prev: 'Capítulo anterior', next: 'Próximo capítulo' },
  fr: { prev: 'Chapitre précédent', next: 'Chapitre suivant' },
  it: { prev: 'Capitolo precedente', next: 'Capitolo successivo' },
  'zh-Hans': { prev: '上一章', next: '下一章' },
};

function ChapterCard({ item, isNext }) {
  return (
    <Link
      to={item.permalink}
      className={`chapter-nav-card${isNext ? ' chapter-nav-card--next' : ' chapter-nav-card--prev'}`}
    >
      <span className="chapter-nav-arrow">
        {isNext ? '→' : '←'}
      </span>
      <div className="chapter-nav-body">
        <span className="chapter-nav-label">
          {item.subLabel}
        </span>
        <span className="chapter-nav-title">
          {item.title}
        </span>
      </div>
    </Link>
  );
}

export default function DocPaginator(props) {
  const { previous, next } = props;
  const history = useHistory();
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const labels = LABELS[currentLocale] || LABELS.es;

  const handleNavClick = useCallback(
    (e) => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;
      const href = anchor.getAttribute('href') || '';
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) return;
      if (anchor.hasAttribute('download')) return;
      if (typeof document === 'undefined' || !document.startViewTransition) return;
      e.preventDefault();
      document.startViewTransition(() => { history.push(href); });
    },
    [history],
  );

  if (!previous && !next) return null;

  return (
    <nav
      className="chapter-nav docusaurus-mt-lg"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
      })}
      onClick={handleNavClick}
    >
      {previous
        ? <ChapterCard item={{ ...previous, subLabel: labels.prev }} isNext={false} />
        : <div className="chapter-nav-spacer" />
      }
      {next
        ? <ChapterCard item={{ ...next, subLabel: labels.next }} isNext />
        : <div className="chapter-nav-spacer" />
      }
    </nav>
  );
}
