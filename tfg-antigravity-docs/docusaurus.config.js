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
          editUrl: 'https://github.com/Alfonsomongee/TFG-OVERLEAF/blob/main/',
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

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
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
            type: 'localeDropdown',
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
            title: 'Recursos',
            items: [
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
        copyright: `Copyright © 2025 Alfonso Monge García. Built with Docusaurus.`,
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
