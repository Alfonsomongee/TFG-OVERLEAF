// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '📚 Capítulos',
      collapsible: false,
      link: { type: 'generated-index' },
      items: [
        'introduccion',
        'contexto',
        'analisis-incidente',
        'reaccion-reposicion',
        'analisis-informes',
        'impacto-comunicativo',
        'resiliencia-futuro',
        'uso-ia',
        'conclusiones',
      ],
    },
    {
      type: 'category',
      label: '🇪🇺 Dimensión Europea',
      collapsible: true,
      link: { type: 'generated-index' },
      items: [
        'dimension-europea/francia-portugal',
        'dimension-europea/coordinacion-continental',
        'dimension-europea/dia-despues',
      ],
    },
    {
      type: 'doc',
      id: 'glosario',
      label: '📖 Glosario Técnico',
    },
    {
      type: 'doc',
      id: 'referencias',
      label: '📚 Referencias Bibliográficas',
    },
  ],
};

module.exports = sidebars;
