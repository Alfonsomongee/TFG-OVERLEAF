import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'cbc'),
    routes: [
      {
        path: '/docs/',
        component: ComponentCreator('/docs/', '25a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analisis-incidente',
        component: ComponentCreator('/docs/analisis-incidente', '603'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/analisis-informes',
        component: ComponentCreator('/docs/analisis-informes', '03a'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/category/-dimensión-europea',
        component: ComponentCreator('/docs/category/-dimensión-europea', '4f1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/conclusiones',
        component: ComponentCreator('/docs/conclusiones', 'e16'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/contexto',
        component: ComponentCreator('/docs/contexto', '2e4'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/cronologia',
        component: ComponentCreator('/docs/cronologia', 'f4f'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/dimension-europea/coordinacion-continental',
        component: ComponentCreator('/docs/dimension-europea/coordinacion-continental', 'cc0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/dimension-europea/dia-despues',
        component: ComponentCreator('/docs/dimension-europea/dia-despues', '297'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/dimension-europea/francia-portugal',
        component: ComponentCreator('/docs/dimension-europea/francia-portugal', '8c6'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/documentos',
        component: ComponentCreator('/docs/documentos', 'bee'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/galeria-graficas',
        component: ComponentCreator('/docs/galeria-graficas', '4c1'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/galeria-imagenes',
        component: ComponentCreator('/docs/galeria-imagenes', '8fb'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/glosario',
        component: ComponentCreator('/docs/glosario', '71d'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/impacto-comunicativo',
        component: ComponentCreator('/docs/impacto-comunicativo', '526'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/introduccion',
        component: ComponentCreator('/docs/introduccion', '5f0'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/reaccion-reposicion',
        component: ComponentCreator('/docs/reaccion-reposicion', '097'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/referencias',
        component: ComponentCreator('/docs/referencias', '265'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/resiliencia-futuro',
        component: ComponentCreator('/docs/resiliencia-futuro', '657'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/sobre-el-autor',
        component: ComponentCreator('/docs/sobre-el-autor', '689'),
        exact: true,
        sidebar: "tutorialSidebar"
      },
      {
        path: '/docs/uso-ia',
        component: ComponentCreator('/docs/uso-ia', 'c30'),
        exact: true,
        sidebar: "tutorialSidebar"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'ccc'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
