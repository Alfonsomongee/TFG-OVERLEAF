// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

const {themes: {github: lightTheme, dracula: darkTheme}} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Análisis del Apagón de 28 Abril de 2025',
  tagline: 'Estudio técnico sobre el colapso del sistema eléctrico ibérico y sus implicaciones para la estabilidad de redes con alta penetración renovable',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://tfg-overleaf.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'alfonsomongee',
  projectName: 'TFG-OVERLEAF',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    localeConfigs: {
      es: {
        label: 'Español',
        direction: 'ltr',
        htmlLang: 'es-ES',
      },
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          remarkPlugins: [
            [require('remark-math'), { strict: false }],
          ],
          rehypePlugins: [
            [require('rehype-katex'), { strict: false }],
          ],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['es', 'en'],
      },
    ],
  ],

  clientModules: [
    require.resolve('./src/js/zen-mode.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.jpg',
      navbar: {
        title: 'TFG - Apagón Ibérico',
        logo: {
          alt: 'ETSI Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Contenido',
          },
          {
            type: 'html',
            position: 'right',
            value: '<button id="zen-mode-toggle" class="button button--secondary button--sm clean-btn" title="Activar/Desactivar Pantalla Completa" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: auto; height: 36px; padding: 0 12px; margin-right: 0.5rem; font-weight: 600;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg><span class="zen-mode-text"><span class="zen-mode-text-default">Pantalla Completa</span><span class="zen-mode-text-active">Volver a modo menú</span></span></button>',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'pathname:///tfg_antigravity(1).pdf',
            label: 'Descargar PDF',
            position: 'right',
          },
          {
            href: 'https://github.com/Alfonsomongee/TFG-OVERLEAF',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Contenido',
            items: [
              {
                label: 'Introducción',
                to: '/',
              },
              {
                label: 'Contexto Técnico',
                to: '/contexto',
              },
              {
                label: 'Análisis del Incidente',
                to: '/analisis-incidente',
              },
            ],
          },
          {
            title: 'Universidad',
            items: [
              {
                label: 'Escuela Técnica Superior de Ingeniería',
                href: 'https://www.us.es',
              },
              {
                label: 'Universidad de Sevilla',
                href: 'https://www.us.es',
              },
            ],
          },
          {
            title: 'Contacto',
            items: [
              {
                label: 'Alfonso Monge Díaz-Ángel',
                href: 'mailto:alfonsomongediazangel@gmail.com',
              },
            ],
          },
          {
            title: 'Recursos',
            items: [
              {
                label: 'Descargar PDF del TFG',
                href: 'pathname:///tfg_antigravity(1).pdf',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Alfonsomongee/TFG-OVERLEAF',
              },
              {
                label: 'Docusaurus',
                href: 'https://docusaurus.io',
              },
            ],
          },
        ],
        copyright: `Copyright © 2026 Alfonso Monge Díaz-Ángel. alfonsomongediazangel@gmail.com. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-SfHjyzed8eCsTSa4t2GoMc4WnsCLa6cQpFqPRCaizz0FlQUOyafw/AyIUCQU/KuM',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;
