// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [

    // ── PREFACIO ──────────────────────────────────────────────────────
    'intro',

    // ── 1 · INTRODUCCIÓN ─────────────────────────────────────────────
    {
      type: 'doc',
      id: 'introduccion',
      label: '¿Por qué estudiar el 28-A?',
    },

    // ── 2 · CONTEXTO ─────────────────────────────────────────────────
    {
      type: 'doc',
      id: 'contexto',
      label: 'La Red que Ocultaba su Fragilidad',
    },

    // ── 3 · EL COLAPSO ───────────────────────────────────────────────
    {
      type: 'category',
      label: 'EL COLAPSO',
      collapsed: false,
      className: 'sidebar-icon-zap',
      items: [
        {
          type: 'doc',
          id: 'analisis-incidente',
          // CORRECCIÓN: 30 segundos verificados (12:32:57→12:33:27 CEST)
          // ENTSO-E Factual, pp.108-109
          label: '30 Segundos: Anatomía del Colapso',
        },
        {
          type: 'doc',
          id: 'impacto-comunicativo',
          // Reformulado: descriptivo sin juicio de valor
          label: 'Los Encuadres Mediáticos del 28-A',
        },
      ],
    },

    // ── 4 · ANÁLISIS PERICIAL ─────────────────────────────────────────
    {
      type: 'doc',
      id: 'analisis-informes',
      // CORRECCIÓN: son cuatro informes (Comité Gobierno, REE, ENTSO-E, IIT-ICAI)
      label: 'Cuatro Informes, un Apagón',
    },

    // ── 5 · DIMENSIÓN EUROPEA ─────────────────────────────────────────
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

    // ── 6 · RESTAURACIÓN ─────────────────────────────────────────────
    {
      type: 'doc',
      id: 'reaccion-reposicion',
      label: 'El Despertar de la Red',
    },

    // ── 7 · ECONOMÍA DEL COLAPSO ──────────────────────────────────────
    {
      type: 'doc',
      id: '07b-consecuencias-financieras',
      label: 'El Precio del Cero Eléctrico',
    },

    // ── 8 · RESILIENCIA Y PROPUESTAS ──────────────────────────────────
    {
      type: 'doc',
      id: 'resiliencia-futuro',
      label: 'La Red que Debe Nacer',
    },

    // ── 9 · CONCLUSIONES ──────────────────────────────────────────────
    // Simplificado: categoría con 1 item → doc directo
    {
      type: 'doc',
      id: 'conclusiones',
      // Reformulado: descriptivo, sin juicio de valor
      label: 'El Trilema de la Transición Energética',
    },

    // ══════════════════════════════════════════════════════════════════
    // APÉNDICES — collapsed por defecto para no saturar la vista
    // ══════════════════════════════════════════════════════════════════

    // ── A · MÉTODOS Y ACTUALIZACIONES ────────────────────────────────
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

    // ── B · CIFRAS Y REFERENCIA ───────────────────────────────────────
    {
      type: 'category',
      label: 'CIFRAS Y REFERENCIA',
      collapsed: true,
      className: 'sidebar-icon-book',
      items: [
        {
          type: 'doc',
          id: 'resumen-de-cifras',
          label: 'Las Cifras Verificadas del 28-A',
        },
        {
          type: 'doc',
          id: 'base-datos-maestra',
          label: 'Base de Datos Maestra',
        },
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

    // ── C · VISUALIZACIONES ──────────────────────────────────────────
    // Consolidadas en 2 hubs claros en lugar de 4 galerías difusas
    {
      type: 'category',
      label: 'VISUALIZACIONES',
      collapsed: true,
      className: 'sidebar-icon-trending',
      items: [
        {
          type: 'doc',
          id: 'cronologia',
          label: 'Cronología del Colapso',
        },
        {
          // Hub 1: contenido estático (figuras, esquemas, tablas oficiales)
          type: 'doc',
          id: 'galeria-imagenes',
          label: 'Atlas Forense — Figuras y Esquemas',
        },
        {
          // Hub 2: simuladores y gráficas interactivas propias
          type: 'doc',
          id: 'galeria-graficas',
          label: 'Laboratorio Interactivo — Simuladores',
        },
        {
          type: 'doc',
          id: 'galeria-forense',
          label: 'Bases de Datos ENTSO-E y ESIOS',
        },
        {
          type: 'doc',
          id: 'galeria-de-tablas',
          label: 'Registros Oficiales Verificados',
        },
      ],
    },

    // ── D · DATOS EN TIEMPO REAL ─────────────────────────────────────
    // Movido a apéndice operativo (Plan Maestro §3.2, hallazgo 2.9)
    // No interrumpe el flujo narrativo principal
    {
      type: 'category',
      label: 'DATOS EN TIEMPO REAL',
      collapsed: true,
      // Icono diferente al de EL COLAPSO para no confundir
      className: 'sidebar-icon-activity',
      items: [
        {
          type: 'html',
          value: '<div style="font-family:var(--font-display);font-size:0.7rem;font-weight:700;color:var(--ifm-color-primary);letter-spacing:0.1em;margin:0.5rem 0;padding:0 0.5rem 0.3rem;text-transform:uppercase;border-bottom:1px solid rgba(6,182,212,0.2);">Telemetría del Incidente</div>',
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
          label: 'Radar de Fragilidad Sistémica',
        },
        {
          type: 'html',
          value: '<div style="font-family:var(--font-display);font-size:0.7rem;font-weight:700;color:var(--ifm-color-primary);letter-spacing:0.1em;margin:1rem 0 0.5rem;padding:0 0.5rem 0.3rem;text-transform:uppercase;border-bottom:1px solid rgba(6,182,212,0.2);">Estructura y Mercado</div>',
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

    // ── AUTOR ─────────────────────────────────────────────────────────
    {
      type: 'doc',
      id: 'sobre-el-autor',
      label: 'Sobre el Autor',
    },

  ],
};

module.exports = sidebars;
