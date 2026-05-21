import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/en/',
    component: ComponentCreator('/en/', '819'),
    routes: [
      {
        path: '/en/',
        component: ComponentCreator('/en/', 'c7e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/analisis-incidente',
        component: ComponentCreator('/en/analisis-incidente', '268'),
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
        path: '/en/category/-dimensión-europea',
        component: ComponentCreator('/en/category/-dimensión-europea', '080'),
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
        path: '/en/dimension-europea/coordinacion-continental',
        component: ComponentCreator('/en/dimension-europea/coordinacion-continental', 'e5d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/dimension-europea/dia-despues',
        component: ComponentCreator('/en/dimension-europea/dia-despues', '31e'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/dimension-europea/francia-portugal',
        component: ComponentCreator('/en/dimension-europea/francia-portugal', '81a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/en/glosario',
        component: ComponentCreator('/en/glosario', '0eb'),
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
        component: ComponentCreator('/en/introduccion', '6c7'),
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
        component: ComponentCreator('/en/referencias', 'fde'),
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
