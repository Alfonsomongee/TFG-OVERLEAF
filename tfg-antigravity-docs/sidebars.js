// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [

    // PREFACIO
    'intro',

    // 1 · INTRODUCCIÓN
    {
      type: 'doc',
      id: 'introduccion',
      label: '¿Por qué estudiar el 28-A?',
    },

    // 2 · CONTEXTO
    {
      type: 'doc',
      id: 'contexto',
      label: 'La Red que Ocultaba su Fragilidad',
    },

    // 3 · EL COLAPSO (análisis del incidente + impacto comunicativo)
    {
      type: 'category',
      label: 'EL COLAPSO',
      collapsed: false,
      className: 'sidebar-icon-zap',
      items: [
        {
          type: 'doc',
          id: 'analisis-incidente',
          label: '27 Segundos: Anatomía del Colapso',
        },
        {
          type: 'doc',
          id: 'impacto-comunicativo',
          label: 'El Relato Oficial vs. la Física Real',
        },
      ],
    },

    // 4 · ANÁLISIS PERICIAL
    {
      type: 'doc',
      id: 'analisis-informes',
      label: 'Tres Verdades, un Apagón',
    },

    // 5 · DIMENSIÓN EUROPEA (elevada desde el final al centro del relato)
    {
      type: 'category',
      label: 'DIMENSIÓN EUROPEA',
      collapsed: false,
      className: 'sidebar-icon-globe',
      items: [
        {
          type: 'doc',
          id: 'dimension-europea/francia-portugal',
          label: 'La Cascada Cruza los Pirineos',
        },
        {
          type: 'doc',
          id: 'dimension-europea/coordinacion-continental',
          label: 'Europa Sostuvo la Frecuencia',
        },
        {
          type: 'doc',
          id: 'dimension-europea/dia-despues',
          label: 'Un Continente que Aprendió a Tener Miedo',
        },
      ],
    },

    // 6 · RESTAURACIÓN
    {
      type: 'doc',
      id: 'reaccion-reposicion',
      label: 'El Despertar de la Red',
    },

    // 7 · ECONOMÍA DEL COLAPSO (separada de resiliencia)
    {
      type: 'doc',
      id: '07b-consecuencias-financieras',
      label: 'El Precio del Cero Eléctrico',
    },

    // 8 · RESILIENCIA Y PROPUESTAS
    {
      type: 'doc',
      id: 'resiliencia-futuro',
      label: 'La Red que Debe Nacer',
    },

    // 9–10 · MÉTODOS Y ACTUALIZACIONES
    {
      type: 'category',
      label: 'MÉTODOS Y ACTUALIZACIONES',
      collapsed: true,
      className: 'sidebar-icon-tool',
      items: [
        {
          type: 'doc',
          id: 'uso-ia',
          label: 'Investigar con IA: Límites y Correcciones',
        },
        {
          type: 'doc',
          id: '08.5-actualizacion-2026',
          label: 'Juicios, Reformas y el Boom de las Baterías',
        },
      ],
    },

    // 11 · CONCLUSIONES
    {
      type: 'category',
      label: 'CONCLUSIONES',
      collapsed: false,
      className: 'sidebar-icon-flag',
      items: [
        {
          type: 'doc',
          id: 'conclusiones',
          label: 'El Trilema que Nadie Quiso Ver',
        },
      ],
    },

    // ── DATOS EN TIEMPO REAL (Opción B) ───────────────────────────────
    {
      type: 'category',
      label: 'DATOS EN TIEMPO REAL',
      collapsed: false,
      className: 'sidebar-icon-zap',
      items: [
        {
          type: 'html',
          value: '<div style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--ifm-color-primary); letter-spacing: 0.1em; margin-top: 0.5rem; margin-bottom: 0.5rem; padding-left: 0.5rem; text-transform: uppercase; border-bottom: 1px solid rgba(6, 182, 212, 0.2); padding-bottom: 0.3rem;">Telemetría del Incidente</div>',
          defaultStyle: true,
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/index',
          label: 'Centro de Control del 28-A',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/mix-generacion',
          label: '¿Quién Generaba cuando Cayó la Red?',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/demanda-renovable',
          label: 'Demanda y Renovable',
        },
        {
          type: 'doc',
          id: 'datos-tiempo-real/termometro-riesgo',
          label: 'Pulso de la Red en Tiempo Real',
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
          label: 'Mapa de Fragilidad Nodal',
        },
        {
          type: 'html',
          value: '<div style="font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--ifm-color-primary); letter-spacing: 0.1em; margin-top: 1.5rem; margin-bottom: 0.5rem; padding-left: 0.5rem; text-transform: uppercase; border-bottom: 1px solid rgba(6, 182, 212, 0.2); padding-bottom: 0.3rem;">Estructura y Mercado</div>',
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

    // ── GALERÍAS / APÉNDICES ──────────────────────────────────────────

    // RESUMEN DE CIFRAS
    {
      type: 'category',
      label: 'RESUMEN DE CIFRAS',
      collapsed: false,
      className: 'sidebar-icon-bar-chart',
      items: [
        {
          type: 'doc',
          id: 'resumen-de-cifras',
          label: 'Las Cifras que No Mienten',
        },
      ],
    },

    // REFERENCIA
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

    // VISUALIZACIONES
    {
      type: 'category',
      label: 'VISUALIZACIONES',
      collapsed: true,
      className: 'sidebar-icon-trending',
      items: [
        {
          type: 'doc',
          id: 'base-datos-maestra',
          label: 'Base de Datos Maestra del 28-A',
        },
        {
          type: 'doc',
          id: 'cronologia',
          label: 'Secuencia Temporal del Colapso',
        },
        {
          type: 'doc',
          id: 'galeria-imagenes',
          label: 'Atlas Forense y Esquemas',
        },
        {
          type: 'doc',
          id: 'galeria-graficas',
          label: 'Laboratorio de Dinámica de Sistemas',
        },
        {
          type: 'doc',
          id: 'galeria-forense',
          label: 'Bases de Datos ENTSO-E y ESIOS',
        },
        {
          type: 'doc',
          id: 'galeria-de-tablas',
          label: 'Registros de Datos Oficiales',
        },
      ],
    },

    // AUTOR
    {
      type: 'doc',
      id: 'sobre-el-autor',
      label: 'Sobre el Autor',
    },
  ],
};

module.exports = sidebars;
