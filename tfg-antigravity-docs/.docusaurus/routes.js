import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/en/',
    component: ComponentCreator('/en/', '11f'),
    routes: [
      {
        path: '/en/',
        component: ComponentCreator('/en/', 'c7e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/analisis-informes',
        component: ComponentCreator('/en/analisis-informes', 'a3b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/category/-capítulos',
        component: ComponentCreator('/en/category/-capítulos', '7ad'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/conclusiones',
        component: ComponentCreator('/en/conclusiones', '498'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/contexto',
        component: ComponentCreator('/en/contexto', 'e77'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/glosario',
        component: ComponentCreator('/en/glosario', '2f1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/impacto-comunicativo',
        component: ComponentCreator('/en/impacto-comunicativo', 'b6f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/introduccion',
        component: ComponentCreator('/en/introduccion', 'f72'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/reaccion-reposicion',
        component: ComponentCreator('/en/reaccion-reposicion', '759'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/referencias',
        component: ComponentCreator('/en/referencias', 'aa4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/resiliencia-futuro',
        component: ComponentCreator('/en/resiliencia-futuro', 'aed'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/sistema-espanol',
        component: ComponentCreator('/en/sistema-espanol', '098'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/uso-ia',
        component: ComponentCreator('/en/uso-ia', 'f4d'),
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
