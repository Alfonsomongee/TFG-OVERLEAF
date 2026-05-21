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
        '01-introduccion',
        '02-contexto',
        '03-analisis-incidente',
        '04-reaccion-reposicion',
        '05-analisis-informes',
        '06-impacto-comunicativo',
        '07-resiliencia-futuro',
        '08-uso-ia',
        '09-conclusiones',
      ],
    },
    {
      type: 'category',
      label: '🇪🇺 Dimensión Europea',
      collapsible: true,
      link: { type: 'generated-index' },
      items: [
        'dimension-europea/01-francia-portugal',
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
