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
        'sistema-espanol',
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
      label: '🔍 Referencias',
      collapsible: true,
      items: [
        'glosario',
        'referencias',
      ],
    },
  ],
};

module.exports = sidebars;
