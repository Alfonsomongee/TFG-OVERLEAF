// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '📖 Introducción y Contexto',
      collapsible: true,
      collapsed: false,
      items: [
        'introduccion',
        'contexto',
      ],
    },
    {
      type: 'category',
      label: '⚡ Desarrollo del Incidente',
      collapsible: true,
      collapsed: false,
      items: [
        'cronologia',
        'analisis-incidente',
        'reaccion-reposicion',
      ],
    },
    {
      type: 'category',
      label: '📊 Impacto y Lecciones',
      collapsible: true,
      collapsed: true,
      items: [
        'analisis-informes',
        'impacto-comunicativo',
        'resiliencia-futuro',
        '07b-consecuencias-financieras',
        '08.5-actualizacion-2026',
        'conclusiones',
      ],
    },
    {
      type: 'category',
      label: '🇪🇺 Dimensión Europea',
      collapsible: true,
      collapsed: true,
      link: { type: 'generated-index' },
      items: [
        'dimension-europea/francia-portugal',
        'dimension-europea/coordinacion-continental',
        'dimension-europea/dia-despues',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Recursos Interactivos',
      collapsible: true,
      collapsed: false,
      items: [
        'galeria-imagenes',
        'galeria-graficas',
      ],
    },
    {
      type: 'category',
      label: '📚 Documentos y Referencias',
      collapsible: true,
      collapsed: true,
      items: [
        'documentos',
        'uso-ia',
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
    },
    {
      type: 'category',
      label: 'ℹ️ Sobre el Proyecto',
      collapsible: true,
      collapsed: false,
      items: [
        'sobre-el-autor',
      ],
    },
  ],
};

module.exports = sidebars;
