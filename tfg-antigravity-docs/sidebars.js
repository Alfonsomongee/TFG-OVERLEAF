// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    // ════════════════════════════════════════════════════════════════
    // BLOQUE 1: INTRODUCCIÓN
    // ════════════════════════════════════════════════════════════════
    {
      type: 'doc',
      id: 'introduccion',
      label: '📖 Introducción',
      className: 'sidebar-item-intro',
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 2: FUNDAMENTOS
    // ════════════════════════════════════════════════════════════════
    {
      type: 'doc',
      id: 'contexto',
      label: '🔌 Contexto Técnico',
      className: 'sidebar-item-foundation',
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 3: NARRATIVA DEL INCIDENTE
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '⚡ Análisis del Incidente',
      collapsed: false,
      className: 'sidebar-category-incident',
      items: [
        {
          type: 'doc',
          id: 'analisis-incidente',
          label: 'Análisis del Incidente',
        },
        {
          type: 'doc',
          id: 'reaccion-reposicion',
          label: 'Reacción y Reposición',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 4: ANÁLISIS TÉCNICO PROFUNDO
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '📊 Análisis Técnico',
      collapsed: false,
      className: 'sidebar-category-technical',
      items: [
        {
          type: 'doc',
          id: 'analisis-informes',
          label: 'Análisis de los Informes Oficiales',
        },
        {
          type: 'doc',
          id: 'analisis-tecnico-frecuencia',
          label: 'Colapso de Frecuencia',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 5: SIMULACIÓN E IMPACTO
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '🎮 Experimentación Interactiva',
      collapsed: false,
      className: 'sidebar-category-interactive',
      items: [
        {
          type: 'doc',
          id: 'swing-equation-simulator',
          label: 'Simulador: Ecuación del Swing',
        },
        {
          type: 'doc',
          id: 'impacto-comunicativo',
          label: 'Impacto Comunicativo',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 6: PROSPECTIVA (Futuro + Economía)
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '🚀 Futuro y Resiliencia',
      collapsed: false,
      className: 'sidebar-category-future',
      items: [
        {
          type: 'doc',
          id: 'resiliencia-futuro',
          label: 'Resiliencia y Futuro',
        },
        {
          type: 'doc',
          id: '07b-consecuencias-financieras',
          label: 'Consecuencias Financieras y Auditoría Económica',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 7: HERRAMIENTAS 2026
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '🤖 Métodos y Actualizaciones',
      collapsed: true,
      className: 'sidebar-category-tools',
      items: [
        {
          type: 'doc',
          id: 'uso-ia',
          label: 'Uso de Inteligencia Artificial',
        },
        {
          type: 'doc',
          id: '08.5-actualizacion-2026',
          label: 'Actualización 2026: Un Año Después',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 8: CIERRE NARRATIVO
    // ════════════════════════════════════════════════════════════════
    {
      type: 'doc',
      id: 'conclusiones',
      label: '✔️ Conclusiones',
      className: 'sidebar-item-conclusion',
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 9: CONTEXTO AMPLIADO (Desplegable)
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '🌍 Dimensión Europea',
      collapsed: true,
      className: 'sidebar-category-european',
      items: [
        {
          type: 'doc',
          id: 'dimension-europea/francia-portugal',
          label: 'Francia y Portugal',
        },
        {
          type: 'doc',
          id: 'dimension-europea/coordinacion-continental',
          label: 'Coordinación Continental',
        },
        {
          type: 'doc',
          id: 'dimension-europea/dia-despues',
          label: 'El Día Después',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 10: REFERENCIAS Y GLOSARIO
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '📚 Referencia',
      collapsed: true,
      className: 'sidebar-category-reference',
      items: [
        {
          type: 'doc',
          id: 'glosario',
          label: '📖 Glosario Técnico',
        },
        {
          type: 'doc',
          id: 'referencias',
          label: '📑 Referencias y Bibliografía',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 11: VISUALIZACIÓN
    // ════════════════════════════════════════════════════════════════
    {
      type: 'category',
      label: '📈 Visualizaciones',
      collapsed: true,
      className: 'sidebar-category-visualizations',
      items: [
        {
          type: 'doc',
          id: 'cronologia',
          label: '⏱️ Cronograma del Incidente',
        },
        {
          type: 'doc',
          id: 'galeria-graficas',
          label: '📊 Galería de Gráficas Interactivas',
        },
        {
          type: 'doc',
          id: 'galeria-imagenes',
          label: '🖼️ Galería de Imágenes',
        },
      ],
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 12: DESCARGAS
    // ════════════════════════════════════════════════════════════════
    {
      type: 'doc',
      id: 'documentos',
      label: '⬇️ Descargas y Documentación',
      className: 'sidebar-item-downloads',
    },

    // ════════════════════════════════════════════════════════════════
    // BLOQUE 13: AUTOR
    // ════════════════════════════════════════════════════════════════
    {
      type: 'doc',
      id: 'sobre-el-autor',
      label: '👤 Sobre el Autor',
      className: 'sidebar-item-author',
    },
  ],
};

module.exports = sidebars;
