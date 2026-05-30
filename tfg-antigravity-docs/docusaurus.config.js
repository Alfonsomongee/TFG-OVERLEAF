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
    locales: ['es', 'en', 'pt', 'fr', 'it', 'de'],
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
      pt: {
        label: 'Português',
        direction: 'ltr',
        htmlLang: 'pt-PT',
      },
      fr: {
        label: 'Français',
        direction: 'ltr',
        htmlLang: 'fr-FR',
      },
      it: {
        label: 'Italiano',
        direction: 'ltr',
        htmlLang: 'it-IT',
      },
      de: {
        label: 'Deutsch',
        direction: 'ltr',
        htmlLang: 'de-DE',
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
        languages: ['es', 'en', 'pt', 'fr', 'it', 'de'],
      },
    ],
  ],

  clientModules: [
    require.resolve('./src/js/copyEmail.js'),
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.jpg',
      navbar: {
        hideOnScroll: true,
        title: '',
        logo: {
          alt: '',
          src: 'img/logo_transparent.png',
          style: { display: 'none' },
        },
        items: [
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            to: '/sobre-el-autor',
            label: 'Sobre el Autor',
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
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/alfonso-monge-diaz-angel-971941277',
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
    {
      href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Alfa+Slab+One&family=Playfair+Display:wght@700;800;900&display=swap',
      type: 'text/css',
      rel: 'stylesheet',
    },
  ],
  headTags: [
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tagName: 'link', attributes: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
    {
      tagName: 'script',
      attributes: { type: 'text/javascript' },
      innerHTML: `(function(){var p=window.location.pathname;if(p==='/'||p===''||p==='/index.html'){document.documentElement.setAttribute('data-intro-page','true');}document.addEventListener('DOMContentLoaded',function(){if(p==='/'||p===''||p==='/index.html'){document.body.classList.add('intro-page');}});})();(function(){var z=localStorage.getItem('zen-mode');if(z===null||z==='true'){document.documentElement.classList.add('zen-mode');}})();`,
    },
  ],
};

module.exports = config;
