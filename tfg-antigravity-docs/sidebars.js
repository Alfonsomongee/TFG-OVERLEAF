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
      label: 'ANÁLISIS DEL INCIDENTE',
      collapsed: false,
      className: 'sidebar-icon-zap',
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
      label: 'ANÁLISIS TÉCNICO',
      collapsed: false,
      className: 'sidebar-icon-bar-chart',
      items: [
        {
          type: 'doc',
          id: 'analisis-informes',
          label: 'Análisis de los Informes Oficiales',
        },
      ],
    },



    // BLOQUE 6: PROSPECTIVA
    {
      type: 'category',
      label: 'FUTURO Y RESILIENCIA',
      collapsed: false,
      className: 'sidebar-icon-compass',
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
      label: 'MÉTODOS Y ACTUALIZACIONES',
      collapsed: true,
      className: 'sidebar-icon-tool',
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

    // BLOQUE 8: RESUMEN DE CIFRAS
    {
      type: 'category',
      label: 'RESUMEN DE CIFRAS',
      collapsed: false,
      className: 'sidebar-icon-bar-chart',
      items: [
        {
          type: 'doc',
          id: 'resumen-de-cifras',
          label: 'Cifras Maestras',
        },
      ],
    },

    // BLOQUE 8.5: DATOS EN TIEMPO REAL Y CONTEXTO
    {
      type: 'category',
      label: 'DATOS EN TIEMPO REAL',
      collapsed: false,
      className: 'sidebar-icon-zap',
      items: [
        {
          type: 'doc',
          id: 'datos-tiempo-real/index',
          label: 'Portal de Datos',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/mix-generacion',
          label: 'Mix de Generación',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/demanda-renovable',
          label: 'Demanda y Renovable',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/termometro-riesgo',
          label: 'Termómetro de Riesgo',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/balance-intercambios',
          label: 'Balance de Intercambios',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/precio-spot',
          label: 'Precio SPOT',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/radar-vulnerabilidad',
          label: 'Radar de Vulnerabilidad',
        },
        {
          type: 'html',
          value: '<div class="sidebar-divider">Contexto Histórico (REData)</div>',
          defaultStyle: true,
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/costes-ajuste',
          label: 'Costes de Ajuste',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/waterfall-financiero',
          label: 'Impacto Económico',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/indisponibilidad',
          label: 'Indisponibilidad de Red',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/emisiones-renovable',
          label: 'Emisiones vs Renovable',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/resiliencia-sectorial',
          label: 'Resiliencia Sectorial',
        },
      ],
    },

    // BLOQUE 9: CIERRE NARRATIVO
    {
      type: 'category',
      label: 'CONCLUSIONES',
      collapsed: false,
      className: 'sidebar-icon-flag',
      items: [
        {
          type: 'doc',
          id: 'conclusiones',
          label: 'Conclusiones Finales',
        },
      ],
    },

    // BLOQUE 10: CONTEXTO AMPLIADO
    {
      type: 'category',
      label: 'DIMENSIÓN EUROPEA',
      collapsed: true,
      className: 'sidebar-icon-globe',
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
      label: 'REFERENCIA',
      collapsed: true,
      className: 'sidebar-icon-book',
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
      label: 'VISUALIZACIONES',
      collapsed: true,
      className: 'sidebar-icon-trending',
      items: [
        {
          type: 'doc',
          id: 'cronologia',
          label: 'Cronograma del Incidente',
        },
        {
          type: 'doc',
          id: 'galeria-imagenes',
          label: 'Galería de Imágenes',
        },
        {
          type: 'doc',
          id: 'galeria-de-tablas',
          label: 'Galería de Tablas',
        },
        {
          type: 'doc',
          id: 'galeria-graficas',
          label: 'Galería de Gráficas',
        },
        {
          type: 'doc',
          id: 'galeria-forense',
          label: 'Galería Forense',
        },
      ],
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


