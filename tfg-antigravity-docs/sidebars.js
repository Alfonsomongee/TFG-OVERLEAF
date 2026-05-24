// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    // BLOQUE 1: INTRODUCCIÓN
    {
      type: 'doc',
      id: 'introduccion',
      label: 'Introducción',
    },

    // BLOQUE 2: FUNDAMENTOS
    {
      type: 'doc',
      id: 'contexto',
      label: 'Contexto Técnico',
    },

    // BLOQUE 3: NARRATIVA DEL INCIDENTE
    {
      type: 'category',
      label: '⚡ Análisis del Incidente',
      collapsed: false,
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
        {
          type: 'doc',
          id: 'impacto-comunicativo',
          label: 'Impacto Comunicativo',
        },
      ],
    },

    // BLOQUE 4: ANÁLISIS TÉCNICO PROFUNDO
    {
      type: 'category',
      label: '📊 Análisis Técnico',
      collapsed: false,
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

    // BLOQUE 5: SIMULACIÓN E IMPACTO
    {
      type: 'category',
      label: '🎮 Experimentación Interactiva',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'swing-equation-simulator',
          label: 'Simulador: Ecuación del Swing',
        },
      ],
    },

    // BLOQUE 6: PROSPECTIVA
    {
      type: 'category',
      label: '🔮 Futuro y Resiliencia',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'resiliencia-futuro',
          label: 'Resiliencia y Futuro',
        },
        {
          type: 'doc',
          id: '07b-consecuencias-financieras',
          label: 'Consecuencias Financieras',
        },
      ],
    },

    // BLOQUE 7: HERRAMIENTAS 2026
    {
      type: 'category',
      label: '🛠️ Métodos y Actualizaciones',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'uso-ia',
          label: 'Uso de Inteligencia Artificial',
        },
        {
          type: 'doc',
          id: '08.5-actualizacion-2026',
          label: 'Actualización 2026',
        },
      ],
    },

    // BLOQUE 8: CIERRE NARRATIVO
    {
      type: 'doc',
      id: 'conclusiones',
      label: 'Conclusiones',
    },

    // BLOQUE 9: CONTEXTO AMPLIADO
    {
      type: 'category',
      label: '🌍 Dimensión Europea',
      collapsed: true,
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

    // BLOQUE 10: REFERENCIAS Y GLOSARIO
    {
      type: 'category',
      label: '📚 Referencia',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'glosario',
          label: 'Glosario Técnico',
        },
        {
          type: 'doc',
          id: 'referencias',
          label: 'Referencias y Bibliografía',
        },
      ],
    },

    // BLOQUE 11: VISUALIZACIÓN
    {
      type: 'category',
      label: '📈 Visualizaciones',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'cronologia',
          label: 'Cronograma del Incidente',
        },
        {
          type: 'doc',
          id: 'galeria-graficas',
          label: 'Galería de Gráficas',
        },
        {
          type: 'doc',
          id: 'galeria-imagenes',
          label: 'Galería de Imágenes',
        },
      ],
    },

    // BLOQUE 12: DESCARGAS
    {
      type: 'doc',
      id: 'documentos',
      label: 'Descargas y Documentación',
    },

    // BLOQUE 13: AUTOR
    {
      type: 'doc',
      id: 'sobre-el-autor',
      label: 'Sobre el Autor',
    },
  ],
};

module.exports = sidebars;
