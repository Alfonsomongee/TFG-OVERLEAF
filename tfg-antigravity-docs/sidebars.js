// sidebars.js
module.exports = {
  docs: [
    {
      type: 'link',
      label: 'Homepage',
      href: '/',
    },
    {
      type: 'category',
      label: 'I · El incidente',
      className: 'sidebar-icon-zap', // rayo rojo
      items: ['introduccion', 'contexto', 'analisis-incidente', 'reaccion-reposicion'],
    },
    {
      type: 'category',
      label: 'II · Las narrativas',
      className: 'sidebar-icon-compass',
      items: ['analisis-informes', 'impacto-comunicativo'],
    },
    {
      type: 'category',
      label: 'III · Las consecuencias',
      className: 'sidebar-icon-trending',
      items: ['07b-consecuencias-financieras', 'impacto-social', 'resiliencia-futuro'],
    },
    {
      type: 'category',
      label: 'IV · Dimensión europea',
      className: 'sidebar-icon-globe',
      items: [
        'dimension-europea/francia-portugal',
        'dimension-europea/coordinacion-continental',
        'dimension-europea/dia-despues',
      ],
    },
    {
      type: 'category',
      label: 'V · Cierre',
      className: 'sidebar-icon-flag',
      items: ['conclusiones', '08.5-actualizacion-2026', 'uso-ia'],
    },
    {
      type: 'category',
      label: 'Datos ESIOS',
      className: 'sidebar-icon-activity',
      // Solo las 6 visualizaciones que consumen datos vivos de ESIOS (/api/esios-multi).
      // Las 5 visualizaciones forenses se acceden desde los Anexos conceptuales I–IX.
      // El portal general sigue disponible en /datos-tiempo-real.
      link: { type: 'doc', id: 'datos-tiempo-real/index' },
      items: [
        'datos-tiempo-real/mix-generacion',
        'datos-tiempo-real/demanda-renovable',
        'datos-tiempo-real/termometro-riesgo',
        'datos-tiempo-real/balance-intercambios',
        'datos-tiempo-real/precio-spot',
        'datos-tiempo-real/radar-vulnerabilidad',
      ],
    },
    {
      type: 'category',
      label: 'Referencia',
      className: 'sidebar-icon-book sidebar-bottom-start',
      items: [
        'resumen-de-cifras',
        'anexo-indice-conceptual',
        // cronologia eliminada del sidebar — la ruta física /cronologia sigue activa.
        // El VerticalTimeline (timeline/T3) está integrado en Anexo III.
        'anexo-demanda-generacion-balance',
        'anexo-estabilidad-dinamica-tension',
        'anexo-cascada-protecciones-desconexiones',
        'anexo-interconexiones-flujos',
        'anexo-mercado-costes',
        'anexo-reposicion-blackstart',
        'anexo-impacto-resiliencia',
        'anexo-comunicacion-fuentes',
        'anexo-metodologia-modelos-datos-vivos',
        'anexo-ecuaciones-matematicas',
        'glosario',
        'referencias',
      ],
    },
    'sobre-el-autor',
  ],
};
