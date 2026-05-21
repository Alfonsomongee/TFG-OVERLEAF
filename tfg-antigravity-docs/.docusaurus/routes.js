import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/',
    component: ComponentCreator('/', '0a3'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '616'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/analisis-incidente',
        component: ComponentCreator('/analisis-incidente', 'f1b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/analisis-informes',
        component: ComponentCreator('/analisis-informes', '192'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/category/-capítulos',
        component: ComponentCreator('/category/-capítulos', 'b64'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/category/-dimensión-europea',
        component: ComponentCreator('/category/-dimensión-europea', 'de8'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/conclusiones',
        component: ComponentCreator('/conclusiones', 'fbb'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/contexto',
        component: ComponentCreator('/contexto', '807'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/dimension-europea/coordinacion-continental',
        component: ComponentCreator('/dimension-europea/coordinacion-continental', 'ec0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/dimension-europea/dia-despues',
        component: ComponentCreator('/dimension-europea/dia-despues', 'dc9'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/dimension-europea/francia-portugal',
        component: ComponentCreator('/dimension-europea/francia-portugal', 'd3f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/glosario',
        component: ComponentCreator('/glosario', '12b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/impacto-comunicativo',
        component: ComponentCreator('/impacto-comunicativo', '85f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/introduccion',
        component: ComponentCreator('/introduccion', 'c5b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/reaccion-reposicion',
        component: ComponentCreator('/reaccion-reposicion', '7a3'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/referencias',
        component: ComponentCreator('/referencias', '69b'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/resiliencia-futuro',
        component: ComponentCreator('/resiliencia-futuro', '9e6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/uso-ia',
        component: ComponentCreator('/uso-ia', '2e0'),
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
