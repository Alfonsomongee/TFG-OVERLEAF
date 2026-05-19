import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/en/docs',
    component: ComponentCreator('/en/docs', '5da'),
    routes: [
      {
        path: '/en/docs/analisis-informes',
        component: ComponentCreator('/en/docs/analisis-informes', 'b40'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/conclusiones',
        component: ComponentCreator('/en/docs/conclusiones', 'f45'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/contexto',
        component: ComponentCreator('/en/docs/contexto', 'c03'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/impacto-comunicativo',
        component: ComponentCreator('/en/docs/impacto-comunicativo', '727'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/intro',
        component: ComponentCreator('/en/docs/intro', 'fb4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/introduccion',
        component: ComponentCreator('/en/docs/introduccion', 'ce0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/reaccion-reposicion',
        component: ComponentCreator('/en/docs/reaccion-reposicion', '57b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/resiliencia-futuro',
        component: ComponentCreator('/en/docs/resiliencia-futuro', 'c2e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/sistema-espanol',
        component: ComponentCreator('/en/docs/sistema-espanol', '4bc'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/docs/uso-ia',
        component: ComponentCreator('/en/docs/uso-ia', 'b98'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
