// src/theme/DocPaginator/index.js
// Swizzle mínimo de DocPaginator para añadir View Transition API
// en los botones de navegación entre capítulos.
//
// Estrategia:
//   1. Captura clicks en el <nav> via bubbling.
//   2. Si el click es sobre un enlace interno y el navegador soporta
//      document.startViewTransition → lanza la transición antes de navegar.
//   3. Respeta: Ctrl/Cmd+click, middle click, target="_blank", external links,
//      prefers-reduced-motion (gestionado por CSS).
//   4. Fallback limpio si la API no existe.

import React, { useCallback } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import PaginatorNavLink from '@theme/PaginatorNavLink';
import { useHistory } from '@docusaurus/router';

export default function DocPaginator(props) {
  const { previous, next } = props;
  const history = useHistory();

  const handleNavClick = useCallback(
    (e) => {
      // Buscar el enlace más cercano dentro del nav paginador
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      // Ignorar: middle click, Ctrl/Cmd+click, Shift+click, Alt+click
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      // Ignorar: target="_blank" u otros targets que abran nueva pestaña
      const target = anchor.getAttribute('target');
      if (target && target !== '_self') return;

      // Ignorar: enlaces externos (href absoluto a otro dominio)
      const href = anchor.getAttribute('href') || '';
      const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//');
      if (isExternal) return;

      // Ignorar: enlaces de descarga
      if (anchor.hasAttribute('download')) return;

      // Si el navegador no soporta View Transition API → navegación normal
      if (typeof document === 'undefined' || !document.startViewTransition) return;

      // Prevenir la navegación inmediata del <Link> de Docusaurus
      e.preventDefault();

      // Lanzar la transición visual → navegar dentro del callback
      document.startViewTransition(() => {
        history.push(href);
      });
    },
    [history],
  );

  return (
    <nav
      className="pagination-nav docusaurus-mt-lg"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination',
      })}
      onClick={handleNavClick}
    >
      {previous && (
        <PaginatorNavLink
          {...previous}
          subLabel={
            <Translate
              id="theme.docs.paginator.previous"
              description="The label used to navigate to the previous doc">
              Previous
            </Translate>
          }
        />
      )}
      {next && (
        <PaginatorNavLink
          {...next}
          subLabel={
            <Translate
              id="theme.docs.paginator.next"
              description="The label used to navigate to the next doc">
              Next
            </Translate>
          }
          isNext
        />
      )}
    </nav>
  );
}
