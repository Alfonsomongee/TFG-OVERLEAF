/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a set of docs in a scoped sidebar
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // But you can create a sidebar manually
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
  ],
};

module.exports = sidebars;
