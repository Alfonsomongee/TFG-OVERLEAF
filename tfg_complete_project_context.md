# TFG INTERACTIVO - ARCHIVO DE CONTEXTO COMPLETO PARA CLAUDE

> Este archivo consolida la estructura, contenido y componentes de diseño interactivo del Trabajo Fin de Grado (TFG) sobre el Apagón Ibérico del 28 de Abril de 2025.
> Proporciona a Claude este archivo para recibir una auditoría completa de forma, contenido, transiciones, estilos y experiencia de usuario (UX).

## 📋 ESTRUCTURA GENERAL DEL PROYECTO

El proyecto es un sitio de documentación interactivo construido con **Docusaurus**, **React**, **Framer Motion**, y **Recharts**, diseñado con una estética forense/cibernética premium (Dark Mode, acentos cian y ámbar, microanimaciones de terminal).

## ⚙️ ARCHIVOS DE CONFIGURACIÓN Y ARQUITECTURA

### 📄 Archivo: `docusaurus.config.js`
```js
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
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/pwa-icon-192x192.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json', // your PWA manifest
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#e03e3e',
          },
        ],
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
            value: '<button id="zen-mode-toggle" class="button button--secondary button--sm clean-btn" title="Activar/Desactivar Pantalla Completa" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; width: auto; height: 36px; padding: 0 12px; margin-right: 0.5rem; font-weight: 600;"><svg class="zen-mode-icon-default" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg><svg class="zen-mode-icon-active" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg><span class="zen-mode-text"><span class="zen-mode-text-default">Pantalla Completa</span><span class="zen-mode-text-active">Volver a modo menú</span></span></button>',
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
  ],
};

module.exports = config;

```

### 📄 Archivo: `sidebars.js`
```js
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

    // BLOQUE 8: CIERRE NARRATIVO
    {
      type: 'doc',
      id: 'conclusiones',
      label: 'Conclusiones',
    },

    // BLOQUE 9: CONTEXTO AMPLIADO
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


    // BLOQUE 13: AUTOR
    {
      type: 'doc',
      id: 'sobre-el-autor',
      label: 'Sobre el Autor',
    },
  ],
};

module.exports = sidebars;



```

### 📄 Archivo: `package.json`
```json
{
  "name": "tfg-antigravity-docs",
  "version": "1.0.0",
  "description": "Análisis del Apagón Ibérico de 28 Abril de 2025 - Sitio de Documentación Interactivo",
  "private": true,
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start",
    "build": "docusaurus build",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve"
  },
  "dependencies": {
    "@deck.gl/geo-layers": "^9.3.2",
    "@docusaurus/core": "2.4.3",
    "@docusaurus/plugin-pwa": "^2.4.3",
    "@docusaurus/preset-classic": "2.4.3",
    "@gsap/react": "^2.1.2",
    "@vitalets/google-translate-api": "^9.2.1",
    "clsx": "^1.2.1",
    "deck.gl": "^9.3.2",
    "docusaurus-lunr-search": "^3.6.0",
    "echarts": "^6.1.0",
    "echarts-for-react": "^3.0.6",
    "framer-motion": "^6.5.1",
    "gsap": "^3.15.0",
    "lenis": "^1.3.23",
    "maplibre-gl": "^5.24.0",
    "plotly.js": "^3.5.1",
    "prism-react-renderer": "^2.1.0",
    "react": "^17.0.2",
    "react-animated-cursor": "^2.6.0",
    "react-dom": "^17.0.2",
    "react-force-graph-2d": "^1.29.1",
    "react-map-gl": "^8.1.1",
    "react-plotly.js": "^2.6.0",
    "react-scrollama": "^2.4.2",
    "reactflow": "^11.11.4",
    "recharts": "^2.1.12",
    "rehype-katex": "^5.0.0",
    "remark-math": "^3.0.0"
  },
  "devDependencies": {
    "glob": "^13.0.6",
    "prettier": "^3.8.3",
    "vercel": "latest"
  },
  "browserslist": {
    "production": [
      ">0.5%",
      "last 2 versions",
      "Firefox ESR",
      "not dead"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "engines": {
    "node": ">=16.14"
  },
  "overrides": {
    "webpack": "5.105.0"
  }
}

```

## 📂 COMPONENTE: REACT CODEBASE & STYLES

### 📄 Archivo: `src\components\AnimatedMap.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import styles from './AnimatedMap.module.css';

// Approximate relative positions on a 100x100 grid for the Iberian Peninsula
// Top Left: 0,0 (Galicia), Bottom Right: 100,100 (Almeria)
const getNodes = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { id: 'segovia', name: 'Segovia', x: 45, y: 35, time: 2, event: t('Oscilaciones precursoras', 'Precursor oscillations', 'Oscilações precursoras', 'Oscillations précurseurs', 'Oscillazioni precursori', 'Vorläufer-Oszillationen') + ' (12:32:00)' },
    { id: 'badajoz', name: 'Badajoz', x: 25, y: 65, time: 4, event: t('Alerta Tap-Lag', 'Tap-Lag Alert', 'Alerta Tap-Lag', 'Alerte Tap-Lag', 'Allarme Tap-Lag', 'Tap-Lag-Alarm') + ' (12:32:45)' },
    { id: 'granada', name: 'Granada', x: 60, y: 85, time: 6, event: t('Disparo Raíz', 'Root Trip', 'Disparo Raiz', 'Déclenchement Racine', 'Scatto Radice', 'Wurzel-Auslösung') + ' (12:32:56)' },
    { id: 'sevilla', name: 'Sevilla', x: 35, y: 80, time: 8, event: t('Propagación de Sobretensión', 'Overvoltage Propagation', 'Propagação de Sobretensão', 'Propagation de Surtension', 'Propagazione della Sovratensione', 'Überspannungsausbreitung') + ' (12:33:05)' },
    { id: 'huelva', name: 'Huelva', x: 25, y: 85, time: 9, event: t('Desconexión Fotovoltaica', 'PV Disconnection', 'Desconexão Fotovoltaica', 'Déconnexion Photovoltaïque', 'Disconnessione Fotovoltaica', 'PV-Trennung') + ' (12:33:10)' },
    { id: 'carmona', name: 'Carmona', x: 40, y: 82, time: 10, event: t('Pérdida de Reactiva', 'Reactive Power Loss', 'Perda de Reativa', 'Perte de Puissance Réactive', 'Perdita di Potenza Reattiva', 'Blindleistungsverlust') + ' (12:33:15)' },
    { id: 'francia', name: t('Interconexión FR', 'FR Interconnection', 'Interconexão FR', 'Interconnexion FR', 'Interconnessione FR', 'FR-Verbindungsleitung'), x: 80, y: 15, time: 12, event: t('Pérdida de Sincronismo', 'Loss of Synchronism', 'Perda de Sincronismo', 'Perte de Synchronisme', 'Perdita di Sincronismo', 'Synchronisationsverlust') + ' (12:33:21)' }
  ];
};

export default function AnimatedMap({ lang = 'es' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const nodes = getNodes(lang);
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { sim: 'Simulating Collapse...', play: '▶ Play Cascade Sequence', time: 'Time: ', caption: 'Abstract topological map of the overvoltage propagation and disconnection cascade across the Iberian network.' };
      case 'pt': return { sim: 'Simulando Colapso...', play: '▶ Simular Cascata', time: 'Tempo: ', caption: 'Mapa topológico abstrato da propagação de sobretensão e cascata de desconexões na rede ibérica.' };
      case 'fr': return { sim: 'Simulation en cours...', play: '▶ Simuler la Cascade', time: 'Temps : ', caption: 'Carte topologique abstraite de la propagation des surtensions et de la cascade de déconnexions sur le réseau ibérique.' };
      case 'it': return { sim: 'Simulazione Collasso...', play: '▶ Simula Cascata', time: 'Tempo: ', caption: 'Mappa topologica astratta della propagazione delle sovratensioni e della cascata di disconnessioni nella rete iberica.' };
      case 'de': return { sim: 'Kollaps wird simuliert...', play: '▶ Kaskade Simulieren', time: 'Zeit: ', caption: 'Abstrakte topologische Karte der Überspannungsausbreitung und Kaskadenabschaltungen im iberischen Netz.' };
      default: return { sim: 'Simulando Colapso...', play: '▶ Simular Cascada', time: 'Tiempo: ', caption: 'Mapa topológico abstracto de la propagación de la sobretensión y cascata de desconexiones en la red ibérica.' };
    }
  };
  const strings = getStrings(lang);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 14) {
            setIsPlaying(false);
            return 14;
          }
          return prev + 1;
        });
      }, 800); // 800ms per simulated "tick"
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.controls}>
        <button 
          className="button button--primary" 
          onClick={handlePlay} 
          disabled={isPlaying}
        >
          {isPlaying ? strings.sim : strings.play}
        </button>
        <span className={styles.timer}>
          {strings.time} T+ {currentTime}s
        </span>
      </div>

      <div 
        className={styles.mapArea}
        style={{ 
          backgroundImage: `url('/img/iberian_satellite.png')`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundColor: '#050505'
        }}
      >

        {nodes.map(node => {
          const isActive = currentTime >= node.time;
          return (
            <div 
              key={node.id}
              className={`${styles.node} ${isActive ? styles.activeNode : ''}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className={styles.pulse}></div>
              <div className={styles.nodeLabel}>
                <strong>{node.name}</strong>
                {isActive && <span className={styles.nodeEvent}>{node.event}</span>}
              </div>
            </div>
          );
        })}

        {/* Draw connections when nodes are active */}
        <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none">
          {currentTime >= 8 && <line x1="60" y1="85" x2="35" y2="80" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 9 && <line x1="35" y1="80" x2="25" y2="85" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 10 && <line x1="35" y1="80" x2="40" y2="82" stroke="red" strokeWidth="0.5" className={styles.animLine} />}
          {currentTime >= 12 && <line x1="40" y1="82" x2="80" y2="15" stroke="red" strokeWidth="0.5" className={styles.animLine} strokeDasharray="1 1" />}
        </svg>
      </div>
      
      <div className={styles.caption}>
        {strings.caption}
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\AnimatedMap.module.css`
```css
.mapContainer {
  margin: 2rem 0;
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.timer {
  font-family: monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ifm-color-danger);
  background-color: var(--ifm-color-emphasis-100);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.mapArea {
  position: relative;
  width: 100%;
  height: 500px;
  background-color: var(--ifm-color-emphasis-100);
  border-radius: 8px;
  overflow: hidden;
}

.coastline, .connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.node {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: var(--ifm-color-emphasis-500);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  transition: background-color 0.3s;
}

.activeNode {
  background-color: var(--ifm-color-danger);
  box-shadow: 0 0 10px var(--ifm-color-danger);
}

.pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  border-radius: 50%;
}

.activeNode .pulse {
  animation: ripple 1.5s infinite ease-out;
  border: 2px solid var(--ifm-color-danger);
}

@keyframes ripple {
  0% { width: 12px; height: 12px; opacity: 1; }
  100% { width: 40px; height: 40px; opacity: 0; }
}

.nodeLabel {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

[data-theme='dark'] .nodeLabel {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
}

.nodeEvent {
  color: var(--ifm-color-danger);
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 2px;
}

.animLine {
  animation: drawLine 0.5s ease forwards;
}

@keyframes drawLine {
  from { stroke-dasharray: 0, 100; }
  to { stroke-dasharray: 100, 0; }
}

.caption {
  text-align: center;
  font-size: 0.85rem;
  color: var(--ifm-color-emphasis-600);
  margin-top: 1rem;
  font-style: italic;
}

```

### 📄 Archivo: `src\components\AuthorProfile.jsx`
```jsx
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './AuthorProfile.module.css';

export default function AuthorProfile({ lang = 'es' }) {
  const isEn = lang === 'en';
  
  return (
    <div className={styles.profileCard}>
      <div className={styles.headerBackground}></div>
      <div className={styles.profileContent}>
        <div className={styles.avatarContainer}>
          {/* Using a placeholder SVG or ETSI logo as avatar */}
          <div className={styles.avatar}>
            <span className={styles.initials}>AM</span>
          </div>
        </div>
        
        <h2 className={styles.name}>Alfonso Monge Díaz-Ángel</h2>
        <p className={styles.title}>
          {isEn ? "Author & Power Systems Engineer" : "Autor e Ingeniero Eléctrico"}
        </p>
        
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <strong>{isEn ? "University:" : "Universidad:"}</strong> 
            <span>ETSI, Universidad de Sevilla</span>
          </div>
          <div className={styles.detailItem}>
            <strong>{isEn ? "Year:" : "Año:"}</strong> 
            <span>2026</span>
          </div>
          <div className={styles.detailItem}>
            <strong>{isEn ? "Contact:" : "Contacto:"}</strong> 
            <a href="mailto:alfonsomongediazangel@gmail.com">alfonsomongediazangel@gmail.com</a>
          </div>
        </div>
        
        <p className={styles.bio}>
          {isEn 
            ? "This interactive thesis represents a comprehensive forensic analysis of the Iberian electrical collapse. It aims to bridge the gap between technical power systems engineering and effective crisis communication."
            : "Este TFG interactivo representa un análisis forense integral del colapso eléctrico ibérico. Su objetivo es tender un puente entre la ingeniería técnica de sistemas de potencia y la comunicación efectiva de crisis."}
        </p>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\AuthorProfile.module.css`
```css
.profileCard {
  max-width: 600px;
  margin: 2rem auto;
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.profileCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.headerBackground {
  height: 120px;
  background: linear-gradient(135deg, var(--ifm-color-primary) 0%, var(--ifm-color-primary-darker) 100%);
  position: relative;
}

.profileContent {
  padding: 0 2rem 2rem;
  text-align: center;
}

.avatarContainer {
  margin-top: -60px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: var(--ifm-background-color);
  border: 4px solid var(--ifm-background-surface-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.initials {
  font-size: 3rem;
  font-weight: 700;
  color: var(--ifm-color-primary);
  letter-spacing: -2px;
}

.name {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  color: var(--ifm-heading-color);
}

.title {
  font-size: 1.1rem;
  color: var(--ifm-color-primary);
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
  background-color: var(--ifm-color-emphasis-100);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.detailItem {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detailItem strong {
  min-width: 100px;
  color: var(--ifm-color-emphasis-700);
}

.detailItem span, .detailItem a {
  color: var(--ifm-color-emphasis-900);
}

.detailItem a {
  color: var(--ifm-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.detailItem a:hover {
  text-decoration: underline;
}

.bio {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--ifm-color-emphasis-700);
  margin-bottom: 0;
}

```

### 📄 Archivo: `src\components\BiblioCard.jsx`
```jsx
import React from 'react';
import styles from './BiblioCard.module.css';
import { BIBLIOGRAPHY } from '../data/bibliography';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function BiblioCard() {
  return (
    <div className={styles.biblioContainer}>
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total referencias:</span>
          <span className={styles.statValue}>{BIBLIOGRAPHY.length}</span>
        </div>
      </div>

      <div className={styles.referencesList}>
        {BIBLIOGRAPHY.map((ref) => (
          <div
            key={ref.id}
            className={styles.referenceCard}
            style={{
              borderLeftColor: '#2563eb',
            }}
          >
            <div className={styles.refId}>[{ref.id}]</div>
            <div className={styles.title}>
              {ref.title}
              {ref.pdf && (
                <div style={{ marginTop: '0.75rem' }}>
                  <a href={useBaseUrl(ref.pdf)} target="_blank" rel="noopener noreferrer" className="button button--secondary button--sm">
                    Descargar Informe PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.biblioFooter}>
        <p>
          <em>
            Compilación de referencias técnicas del análisis del colapso ibérico del
            28 de abril de 2025
          </em>
        </p>
      </div>
    </div>
  );
}


```

### 📄 Archivo: `src\components\BiblioCard.module.css`
```css
.biblioContainer {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
}

/* Stats Bar */
.statsBar {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #f8faff 100%);
  border-radius: 8px;
  border-left: 4px solid #1e40af;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.statLabel {
  font-size: 13px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.statValue {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
}

/* Controls */
.controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background-color: #fafafa;
  border-radius: 8px;
}

/* Filter Section */
.filterSection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filterLabel {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.typeButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.typeButton {
  padding: 8px 14px;
  background-color: white;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.typeButton:hover {
  border-color: #1e40af;
  background-color: #f0f7ff;
}

.typeButton.active {
  border-color: transparent;
  color: white;
}

/* Sort Section */
.sortSection {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sortLabel {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  white-space: nowrap;
}

.sortSelect {
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  transition: border-color 0.2s ease;
}

.sortSelect:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

/* References List */
.referencesList {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

/* Reference Card */
.referenceCard {
  padding: 20px;
  background-color: #fff;
  border-left: 4px solid #999;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.referenceCard:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Type Badge */
.typeBadge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* Reference ID */
.refId {
  display: inline-block;
  font-weight: 700;
  color: #1e40af;
  margin-right: 8px;
  font-size: 14px;
}

/* Authors */
.authors {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

/* Year */
.year {
  display: inline;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 10px;
}

/* Title */
.title {
  font-size: 15px;
  line-height: 1.6;
  color: #1f2937;
  margin-bottom: 12px;
}

/* URL Link */
.urlLink {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.link {
  display: inline-block;
  color: #1e40af;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.2s ease;
}

.link:hover {
  color: #dc2626;
  text-decoration: underline;
}

/* Empty State */
.emptyState {
  padding: 3rem 2rem;
  text-align: center;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  margin: 2rem 0;
}

.emptyState p {
  color: #856404;
  font-size: 15px;
  margin: 0;
}

/* Footer */
.biblioFooter {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.biblioFooter p {
  margin: 0;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .biblioContainer {
    color: #e0e0e0;
  }

  .statsBar {
    background: linear-gradient(135deg, #1a2a4a 0%, #162038 100%);
    border-left-color: #5b9cf9;
  }

  .statLabel {
    color: #999;
  }

  .statValue {
    color: #5b9cf9;
  }

  .controls {
    background-color: #2d2d2d;
  }

  .filterLabel,
  .sortLabel {
    color: #e0e0e0;
  }

  .typeButton {
    background-color: #1f1f1f;
    border-color: #444;
    color: #e0e0e0;
  }

  .typeButton:hover {
    background-color: #1a2a4a;
    border-color: #5b9cf9;
  }

  .sortSelect {
    background-color: #1f1f1f;
    border-color: #444;
    color: #e0e0e0;
  }

  .sortSelect:focus {
    border-color: #5b9cf9;
    box-shadow: 0 0 0 3px rgba(91, 156, 249, 0.2);
  }

  .referenceCard {
    background-color: #2d2d2d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .referenceCard:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .refId {
    color: #5b9cf9;
  }

  .authors {
    color: #b0b0b0;
  }

  .year {
    color: #888;
  }

  .title {
    color: #e0e0e0;
  }

  .urlLink {
    border-top-color: #444;
  }

  .link {
    color: #5b9cf9;
  }

  .link:hover {
    color: #f87171;
  }

  .emptyState {
    background-color: #3d3d00;
    border-color: #666600;
  }

  .emptyState p {
    color: #ffff99;
  }

  .biblioFooter {
    border-top-color: #444;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .biblioContainer {
    padding: 0 0.5rem;
  }

  .statsBar {
    flex-direction: column;
    gap: 1rem;
  }

  .controls {
    flex-direction: column;
    gap: 1rem;
  }

  .typeButtons {
    gap: 6px;
  }

  .typeButton {
    padding: 6px 10px;
    font-size: 12px;
  }

  .sortSection {
    flex-direction: column;
    align-items: flex-start;
  }

  .referenceCard {
    padding: 16px;
  }

  .title {
    font-size: 14px;
  }
}

```

### 📄 Archivo: `src\components\BlackoutPropagationMap.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const BlackoutPropagationMapBase = React.lazy(() => import('./BlackoutPropagationMapBase'));

export default function BlackoutPropagationMap(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <BlackoutPropagationMapBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\BlackoutPropagationMapBase.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import BrowserOnly from '@docusaurus/BrowserOnly';


const INITIAL_VIEW_STATE = {
  longitude: -4.5,
  latitude: 39.5,
  zoom: 5,
  pitch: 45,
  bearing: 0
};

const getStations = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { name: 'Subestación Caparacena (Granada)', coordinates: [-3.5985, 37.1773], type: 'critical', desc: t('Punto cero (16:32:00). Doble cortocircuito que desencadena una brutal sobretensión local.', 'Ground zero (16:32:00). Double short circuit triggering a brutal local overvoltage.', 'Ponto zero (16:32:00). Curto-circuito duplo desencadeando uma brutal sobretensão local.', 'Point zéro (16:32:00). Double court-circuit déclenchant une surtension locale brutale.', 'Punto zero (16:32:00). Doppio cortocircuito che innesca una brutale sovratensione locale.', 'Ground Zero (16:32:00). Doppelter Kurzschluss, der eine massive lokale Überspannung auslöst.') },
    { name: 'Nudo Alcores (Sevilla)', coordinates: [-5.9844, 37.3890], type: 'lost', desc: t('Desconectada por protecciones para intentar aislar el incendio eléctrico del sur.', 'Disconnected by protections trying to isolate the electrical fire from the south.', 'Desconectada por proteções para tentar isolar o incêndio elétrico do sul.', 'Déconnecté par les protections pour tenter d\'isoler l\'incendie électrique du sud.', 'Scollegata dalle protezioni per tentare di isolare l\'incendio elettrico del sud.', 'Durch Schutzvorrichtungen getrennt, um das elektrische Feuer im Süden zu isolieren.') },
    { name: 'Nudo Guillena (Badajoz)', coordinates: [-6.9706, 38.8794], type: 'lost', desc: t('Sufre la onda de choque de reactiva. Cae por colapso de tensión (Voltage Collapse).', 'Suffers the reactive shockwave. Falls due to Voltage Collapse.', 'Sofre a onda de choque reativa. Cai por colapso de tensão.', 'Subit l\'onde de choc réactive. Tombe par effondrement de tension.', 'Subisce l\'onda d\'urto reattiva. Cade per collasso di tensione.', 'Erleidet die Blindleistungs-Schockwelle. Fällt aufgrund eines Spannungskollapses.') },
    { name: 'C.N. Almaraz (Cáceres)', coordinates: [-5.6961, 39.8142], type: 'active', desc: t('Soporta el transitorio gracias a la inercia pesada de sus alternadores síncronos.', 'Withstands the transient thanks to the heavy inertia of its synchronous alternators.', 'Suporta o transitório graças à inércia pesada de seus alternadores síncronos.', 'Supporte le transitoire grâce à la lourde inertie de ses alternateurs synchrones.', 'Sopporta il transitorio grazie alla pesante inerzia dei suoi alternatori sincroni.', 'Übersteht den Transienten dank der schweren Trägheit seiner Synchrongeneratoren.') },
    { name: 'Madrid Sur / Morata', coordinates: [-3.7037, 40.4167], type: 'active', desc: t('Absorbe los desequilibrios pero sufre caídas de frecuencia hasta 48.7 Hz.', 'Absorbs imbalances but suffers frequency drops down to 48.7 Hz.', 'Absorve os desequilíbrios, mas sofre quedas de frequência até 48,7 Hz.', 'Absorbe les déséquilibres mais subit des chutes de fréquence jusqu\'à 48,7 Hz.', 'Assorbe gli squilibri ma subisce cali di frequenza fino a 48,7 Hz.', 'Absorbiert Ungleichgewichte, leidet jedoch unter Frequenzabfällen bis auf 48,7 Hz.') },
    { name: 'Nudo Aragón (Zaragoza)', coordinates: [-0.8877, 41.6497], type: 'active', desc: t('Actúa como puente crítico para intentar importar energía de emergencia desde Francia.', 'Acts as a critical bridge trying to import emergency power from France.', 'Atua como ponte crítica tentando importar energia de emergência da França.', 'Agit comme un pont critique pour tenter d\'importer de l\'énergie d\'urgence depuis la France.', 'Funziona come ponte critico per tentare di importare energia di emergenza dalla Francia.', 'Fungiert als kritische Brücke, um Notstrom aus Frankreich zu importieren.') },
    { name: 'Nudo Rubí (Barcelona)', coordinates: [2.1734, 41.3852], type: 'active', desc: t('Se mantiene estable pero al límite operativo, exportando inercia al resto del país.', 'Remains stable but at its operational limit, exporting inertia to the rest of the country.', 'Mantém-se estável, mas no limite operacional, exportando inércia para o resto do país.', 'Reste stable mais à la limite opérationnelle, exportant de l\'inertie vers le reste du pays.', 'Rimane stabile ma al limite operativo, esportando inerzia nel resto del paese.', 'Bleibt stabil, aber am Betriebslimit, und exportiert Trägheit in den Rest des Landes.') },
    { name: 'Lisboa (Rede Eléctrica Nacional)', coordinates: [-9.1393, 38.7222], type: 'active', desc: t('La desconexión súbita de Andalucía genera oscilaciones letales hacia la red portuguesa.', 'The sudden disconnection of Andalusia generates lethal oscillations towards the Portuguese grid.', 'A desconexão súbita da Andaluzia gera oscilações letais para a rede portuguesa.', 'La déconnexion soudaine de l\'Andalousie génère des oscillations mortelles vers le réseau portugais.', 'L\'improvvisa disconnessione dell\'Andalusia genera oscillazioni letali verso la rete portoghese.', 'Die plötzliche Trennung von Andalusien erzeugt tödliche Schwingungen in Richtung des portugiesischen Netzes.') },
    { name: 'Porto (REN)', coordinates: [-8.6291, 41.1579], type: 'active', desc: t('Compensa la falta de generación del sur bombeando energía a la desesperada.', 'Compensates for the lack of southern generation by pumping energy desperately.', 'Compensa a falta de geração do sul bombeando energia desesperadamente.', 'Compense le manque de production du sud en pompant de l\'énergie désespérément.', 'Compensa la mancanza di generazione del sud pompando energia disperatamente.', 'Kompensiert den Mangel an Erzeugung im Süden, indem verzweifelt Energie gepumpt wird.') },
    { name: 'Interconexión Francia (RTE)', coordinates: [1.8845, 42.6397], type: 'border', desc: t('Aporta 2.500 MW de emergencia para salvar a la Península del cero total.', 'Provides 2,500 MW of emergency power to save the Peninsula from a total blackout.', 'Fornece 2.500 MW de emergência para salvar a Península do zero total.', 'Fournit 2 500 MW d\'urgence pour sauver la péninsule du blackout total.', 'Fornisce 2.500 MW di emergenza per salvare la penisola dal blackout totale.', 'Liefert 2.500 MW Notstrom, um die Halbinsel vor einem totalen Blackout zu bewahren.') }
  ];
};

const getArcs = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { source: [-3.5985, 37.1773], target: [-5.9844, 37.3890], flow: t('Sobretensión en cascada', 'Cascading overvoltage', 'Sobretensão em cascata', 'Surtension en cascade', 'Sovratensione a cascata', 'Kaskadierende Überspannung') },
    { source: [-5.9844, 37.3890], target: [-6.9706, 38.8794], flow: t('Pérdida de sincronismo', 'Loss of synchronism', 'Perda de sincronismo', 'Perte de synchronisme', 'Perdita di sincronismo', 'Synchronisationsverlust') },
    { source: [-6.9706, 38.8794], target: [-9.1393, 38.7222], flow: t('Oscilaciones interárea a Portugal', 'Inter-area oscillations to Portugal', 'Oscilações interárea para Portugal', 'Oscillations inter-zones vers le Portugal', 'Oscillazioni inter-area verso il Portogallo', 'Inter-Area-Schwingungen nach Portugal') },
    { source: [-3.7037, 40.4167], target: [1.8845, 42.6397], flow: t('Intento de estabilización desde Europa', 'Stabilization attempt from Europe', 'Tentativa de estabilização da Europa', 'Tentative de stabilisation depuis l\'Europe', 'Tentativo di stabilizzazione dall\'Europa', 'Stabilisierungsversuch aus Europa') },
    { source: [-0.8877, 41.6497], target: [1.8845, 42.6397], flow: t('Sobrecarga de AC', 'AC Overload', 'Sobrecarga AC', 'Surcharge CA', 'Sovraccarico CA', 'AC-Überlastung') }
  ];
};

function BlackoutMapContent({ lang = 'es' }) {
  const [time, setTime] = useState(0);
  const [clickedObject, setClickedObject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const STATIONS = getStations(lang);
  const ARCS = getArcs(lang);
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Collapse Propagation', desc1: 'This 3D model physically projects the blackout. The <strong>arcs</strong> are massive power flows. The <strong>pulsing spheres</strong> represent overvoltages at nodes.', desc2: 'The progressive geographical dimming simulates the voltage collapse over the 11 seconds.', replay: 'Replay', pause: 'Pause', play: 'Play', prog: 'Progress: ', int_title: 'Interaction:', int_desc: ' Drag to rotate the 3D camera. Click on spheres to view the forensic report.', leg_title: 'Legend:', leg_1: 'Trigger (Overvoltage)', leg_2: 'Disconnected Nodes', leg_3: 'Active Nodes', leg_4: 'European Interconnection', fallback: 'Critical Power Flow' };
      case 'pt': return { title: 'Propagação do Colapso', desc1: 'Este modelo 3D projeta fisicamente o apagão. Os <strong>arcos</strong> são fluxos massivos de energia. As <strong>esferas pulsantes</strong> representam sobretensões nos nós.', desc2: 'O escurecimento geográfico progressivo simula o colapso de tensão ao longo dos 11 segundos.', replay: 'Repetir', pause: 'Pausar', play: 'Iniciar', prog: 'Progresso: ', int_title: 'Interação:', int_desc: ' Arraste para rotacionar a câmera 3D. Clique nas esferas para ver o relatório forense.', leg_title: 'Legenda:', leg_1: 'Gatilho (Sobretensão)', leg_2: 'Nós Desconectados', leg_3: 'Nós Ativos', leg_4: 'Interconexão Europeia', fallback: 'Fluxo de Energia Crítico' };
      case 'fr': return { title: 'Propagation de l\'Effondrement', desc1: 'Ce modèle 3D projette physiquement la panne. Les <strong>arcs</strong> sont des flux massifs d\'énergie. Les <strong>sphères pulsantes</strong> représentent les surtensions aux nœuds.', desc2: 'L\'assombrissement géographique progressif simule l\'effondrement de la tension sur les 11 secondes.', replay: 'Rejouer', pause: 'Pause', play: 'Lecture', prog: 'Progression : ', int_title: 'Interaction :', int_desc: ' Faites glisser pour faire pivoter la caméra 3D. Cliquez sur les sphères pour voir le rapport médico-légal.', leg_title: 'Légende :', leg_1: 'Déclencheur (Surtension)', leg_2: 'Nœuds Déconnectés', leg_3: 'Nœuds Actifs', leg_4: 'Interconnexion Européenne', fallback: 'Flux de Puissance Critique' };
      case 'it': return { title: 'Propagazione del Collasso', desc1: 'Questo modello 3D proietta fisicamente il blackout. Gli <strong>archi</strong> sono flussi massicci di energia. Le <strong>sfere pulsanti</strong> rappresentano sovratensioni nei nodi.', desc2: 'L\'oscuramento geografico progressivo simula il collasso di tensione nel corso degli 11 secondi.', replay: 'Riproduci', pause: 'Pausa', play: 'Play', prog: 'Progresso: ', int_title: 'Interazione:', int_desc: ' Trascina per ruotare la telecamera 3D. Fai clic sulle sfere per visualizzare il rapporto forense.', leg_title: 'Leggenda:', leg_1: 'Innesco (Sovratensione)', leg_2: 'Nodi Disconnessi', leg_3: 'Nodi Attivi', leg_4: 'Interconnessione Europea', fallback: 'Flusso di Potenza Critico' };
      case 'de': return { title: 'Kollapsausbreitung', desc1: 'Dieses 3D-Modell projiziert den Stromausfall physisch. Die <strong>Bögen</strong> sind massive Energieflüsse. Die <strong>pulsierenden Kugeln</strong> stellen Überspannungen an Knoten dar.', desc2: 'Die fortschreitende geografische Verdunkelung simuliert den Spannungskollaps über die 11 Sekunden.', replay: 'Wiederholen', pause: 'Pause', play: 'Abspielen', prog: 'Fortschritt: ', int_title: 'Interaktion:', int_desc: ' Ziehen, um die 3D-Kamera zu drehen. Klicken Sie auf Kugeln, um den forensischen Bericht anzuzeigen.', leg_title: 'Legende:', leg_1: 'Auslöser (Überspannung)', leg_2: 'Getrennte Knoten', leg_3: 'Aktive Knoten', leg_4: 'Europäische Verbindung', fallback: 'Kritischer Energiefluss' };
      default: return { title: 'Propagación del Colapso', desc1: 'Este modelo 3D proyecta físicamente el apagón. Los <strong>arcos</strong> son flujos masivos de energía. Las <strong>esferas pulsantes</strong> representan sobretensiones en los nudos.', desc2: 'El oscurecimiento geográfico progresivo simula el hundimiento de tensión a lo largo de los 11 segundos.', replay: 'Replay', pause: 'Pausa', play: 'Play', prog: 'Progreso: ', int_title: 'Interacción:', int_desc: ' Arrastra para rotar la cámara en 3D. Haz clic en las esferas para ver el informe forense.', leg_title: 'Leyenda:', leg_1: 'Detonante (Sobretensión)', leg_2: 'Nudos Desconectados', leg_3: 'Nudos Activos', leg_4: 'Interconexión Europea', fallback: 'Flujo de Energía Crítico' };
    }
  };
  const strings = getStrings(lang);

  useEffect(() => {
    let animation;
    if (isPlaying && time < 110) {
      animation = setInterval(() => {
        setTime(t => t + 1);
      }, 100);
    } else if (time >= 110) {
      setIsPlaying(false);
    }
    return () => clearInterval(animation);
  }, [isPlaying, time]);

  const INERTIA_ARCS = [
    { source: [-5.6961, 39.8142], target: [-5.9844, 37.3890], flow: 'Transferencia de Inercia Síncrona (Almaraz -> Sur)' },
    { source: [2.1734, 41.3852], target: [-0.8877, 41.6497], flow: 'Soporte Reactivo (Rubí -> Aragón)' }
  ];

  const layers = [
    new TileLayer({
      id: 'google-satellite',
      data: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      opacity: Math.max(0.3, 1 - (time / 100))
    }),
    // Nodos con deformación 3D (Voltage Sag)
    new ScatterplotLayer({
      id: 'stations-layer',
      data: STATIONS,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 600,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 2,
      getPosition: d => {
        // Deformación Z (Voltage Sag) para nudos del sur a partir de T=20
        let z = 0;
        if (d.coordinates[1] < 39 && time > 20) {
          z = -150000 * Math.min(1, (time - 20) / 40); // Se hunde 150km visuales
        }
        return [d.coordinates[0], d.coordinates[1], z];
      },
      getRadius: d => (d.type === 'critical' ? (60 + Math.sin(time / 5) * 20) : 50),
      getFillColor: d => {
        if (d.type === 'critical') return [255, 0, 0];
        if (d.type === 'lost') return [255, 165, 0];
        if (d.type === 'border') return [0, 150, 255];
        return [0, 255, 100];
      },
      getLineColor: d => [0, 0, 0]
    }),
    // Arcos de cortocircuito en cascada
    new ArcLayer({
      id: 'power-flows-layer',
      data: ARCS,
      pickable: true,
      getWidth: 3,
      getSourcePosition: d => d.source,
      getTargetPosition: d => {
        // El objetivo se hunde con el Voltage Sag
        let z = 0;
        if (d.target[1] < 39 && time > 20) {
          z = -150000 * Math.min(1, (time - 20) / 40);
        }
        return [d.target[0], d.target[1], z];
      },
      getSourceColor: [255, 0, 0, 200],
      getTargetColor: [255, 165, 0, 200],
      getTilt: d => (time / 100) * 15 - 7.5
    }),
    // Arcos de Inercia Síncrona que colapsan
    new ArcLayer({
      id: 'inertia-arcs-layer',
      data: INERTIA_ARCS,
      pickable: true,
      getWidth: 4,
      getHeight: 0.8, // Arcos muy altos
      visible: time < 60, // Colapsan y desaparecen en T=60
      getSourcePosition: d => d.source,
      getTargetPosition: d => {
        let z = 0;
        if (d.target[1] < 39 && time > 20) {
          z = -150000 * Math.min(1, (time - 20) / 40);
        }
        return [d.target[0], d.target[1], z];
      },
      getSourceColor: [0, 255, 255, 255 - Math.max(0, (time - 40) * 12)], // Se desvanecen
      getTargetColor: [0, 150, 255, 255 - Math.max(0, (time - 40) * 12)]
    })
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#050505' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({object}) => object && (object.name || object.flow)}
        onClick={({object}) => {
          if (object) setClickedObject(object);
          else setClickedObject(null);
        }}
      />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        maxWidth: '350px',
        border: '1px solid #30363d',
        zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>{strings.title}</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db' }} dangerouslySetInnerHTML={{__html: strings.desc1}} />
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db', marginBottom: '15px' }}>
          {strings.desc2}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => {
              if (time >= 110) setTime(0);
              setIsPlaying(!isPlaying);
            }}
            style={{
              background: 'var(--ifm-color-primary)',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {time >= 110 ? strings.replay : (isPlaying ? strings.pause : strings.play)}
          </button>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {strings.prog} {(time / 10).toFixed(1)}s
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '15px', fontStyle: 'italic', margin: '15px 0 0 0' }}>
          <span style={{color: '#fff'}}>{strings.int_title}</span>{strings.int_desc}
        </p>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.85rem'
      }}>
        <strong>{strings.leg_title}</strong><br/>
        <span style={{color: '#ff0000'}}>●</span> {strings.leg_1}<br/>
        <span style={{color: '#ffa500'}}>●</span> {strings.leg_2}<br/>
        <span style={{color: '#00ff64'}}>●</span> {strings.leg_3}<br/>
        <span style={{color: '#0096ff'}}>●</span> {strings.leg_4}
      </div>
      {clickedObject && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.9)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          maxWidth: '250px',
          border: '1px solid var(--ifm-color-primary)'
        }}>
          <h4 style={{margin: '0 0 10px 0', fontSize: '1rem', color: '#60a5fa'}}>{clickedObject.name || strings.fallback}</h4>
          {clickedObject.flow ? (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.flow}</p>
          ) : (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.desc}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BlackoutPropagationMap({ lang = 'es' }) {
  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive 3D map...';
      case 'pt': return 'Carregando mapa 3D interativo...';
      case 'fr': return 'Chargement de la carte 3D interactive...';
      case 'it': return 'Caricamento mappa 3D interattiva...';
      case 'de': return 'Interaktive 3D-Karte wird geladen...';
      default: return 'Cargando mapa 3D interactivo...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(lang)}</div>}>
      {() => <BlackoutMapContent lang={lang} />}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\ChartCard.jsx`
```jsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import styles from './ChartCard.module.css';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function ChartCard({
  fig, title, dek, source, caption, fullBleed = false, children,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <BrowserOnly fallback={<div>Cargando figura periodística...</div>}>
      {() => (
        <motion.figure
          ref={ref}
          className={clsx(styles.card, fullBleed && styles.fullBleed, 'chart-card')}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className={styles.header}>
            {fig && <span className={styles.fig}>FIG. {fig}</span>}
            <h3 className={styles.title}>{title}</h3>
            {dek && <p className={styles.dek}>{dek}</p>}
          </header>

          <div className={styles.canvas}>
            {/* Reveal mask — cortina que desciende dejando ver el chart */}
            <motion.div
              className={styles.mask}
              initial={{ scaleY: 1, transformOrigin: 'top' }}
              animate={inView ? { scaleY: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            />
            {children}
          </div>

          {(caption || source) && (
            <footer className={styles.footer}>
              {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
              {source && <cite className={styles.source}>Fuente: {source}</cite>}
            </footer>
          )}
        </motion.figure>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\ChartCard.module.css`
```css
.card {
  --glow: hsl(190 100% 60% / 0.25);
  position: relative; isolation: isolate;
  margin: clamp(3rem, 8vw, 6rem) auto;
  max-width: 980px;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background: linear-gradient(180deg,
              hsl(220 30% 10% / 0.7),
              hsl(220 40% 6% / 0.85));
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid hsl(220 25% 20%);
  border-radius: 14px;
  box-shadow:
    inset 0 1px 0 hsl(220 30% 30% / 0.4),  /* rim light */
    0 24px 60px -20px hsl(220 80% 2% / 0.6),
    0 0 0 1px hsl(220 25% 20%);
  transition: box-shadow 400ms, border-color 400ms;
}

html[data-theme='light'] .card {
  background: linear-gradient(180deg,
              hsl(40 25% 94% / 0.7),
              hsl(40 30% 97% / 0.85));
  border: 1px solid hsl(40 20% 80%);
  box-shadow:
    inset 0 1px 0 hsl(0 0% 100% / 0.8),
    0 24px 60px -20px hsl(220 80% 10% / 0.1),
    0 0 0 1px hsl(40 20% 80%);
}

.card:hover {
  border-color: hsl(190 100% 60% / 0.5);
  box-shadow:
    inset 0 1px 0 hsl(190 100% 70% / 0.4),
    0 24px 60px -20px hsl(190 80% 20% / 0.4),
    0 0 0 1px hsl(190 100% 60% / 0.4),
    0 0 80px var(--glow);
}

.fullBleed {
  max-width: none;
  width: 100vw;
  margin-inline: calc(50% - 50vw);
  border-radius: 0;
}

.header { margin-bottom: 1.5rem; }
.fig {
  font: 500 11px/1 'JetBrains Mono', ui-monospace, monospace;
  letter-spacing: 0.15em; color: var(--accent-electric);
  text-transform: uppercase;
}
.title {
  font: 600 clamp(1.25rem, 2.4vw, 1.75rem)/1.2 'Space Grotesk', sans-serif;
  margin: 0.5rem 0 0; color: var(--text-0);
}
.dek {
  font: 400 0.95rem/1.5 'Inter', system-ui, sans-serif;
  color: var(--text-2); margin: 0.5rem 0 0; max-width: 65ch;
}

.canvas { position: relative; min-height: 280px; }
.mask {
  position: absolute; inset: 0; z-index: 5;
  background: var(--ifm-background-color); pointer-events: none;
}

.footer {
  display: flex; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem; margin-top: 1.25rem;
  padding-top: 1rem; border-top: 1px solid hsl(220 20% 18%);
}

html[data-theme='light'] .footer {
  border-top-color: hsl(220 20% 88%);
}

.caption {
  font: 400 0.85rem/1.5 'Inter', sans-serif;
  color: var(--text-2); max-width: 60ch;
}
.source {
  font: 500 11px/1 'JetBrains Mono', monospace;
  letter-spacing: 0.05em; color: var(--text-3);
  font-style: normal;
}

@media (prefers-reduced-motion: reduce) {
  .mask { display: none; }
}

```

### 📄 Archivo: `src\components\CollapseTimelineChart.jsx`
```jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { timelineData } from '../data/forensicData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        backgroundColor: 'var(--ifm-background-color)',
        padding: '1rem',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '300px'
      }}>
        <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>T={data.tiempoS}s ({data.timestamp})</p>
        <p style={{ margin: '0', color: '#ef4444', fontWeight: 'bold' }}>Frecuencia: {data.frecuencia.toFixed(3)} Hz</p>
        <p style={{ margin: '0' }}>RoCoF: {data.rocof !== null ? data.rocof.toFixed(3) : 'N/A'} Hz/s</p>
        <p style={{ margin: '0' }}>Pérdida Acumulada: {data.acumuladoMW} MW</p>
        <hr style={{ margin: '0.5rem 0' }} />
        <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>{data.evento}</p>
      </div>
    );
  }
  return null;
};

export default function CollapseTimelineChart() {
  return (
    <div style={{ width: '100%', height: 450, marginTop: '2rem', marginBottom: '2rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Evolución de Frecuencia y Cascada (12:32:57 - 12:33:24)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={timelineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="tiempoS" 
            stroke="var(--ifm-color-content)"
            label={{ value: 'Tiempo transcurrido (s)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis 
            yAxisId="left"
            stroke="var(--ifm-color-content)"
            domain={[45, 51]} 
            label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', offset: -10 }}
          />
          <ReferenceLine y={50} yAxisId="left" stroke="#10b981" strokeDasharray="3 3" />
          <ReferenceLine y={49.5} yAxisId="left" stroke="#f59e0b" strokeDasharray="3 3" label="UFLS 1" />
          <ReferenceLine y={48.46} yAxisId="left" stroke="#ef4444" strokeDasharray="3 3" label="Aislamiento" />
          
          <Tooltip content={<CustomTooltip />} />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="frecuencia" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#ef4444' }}
            activeDot={{ r: 8 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

```

### 📄 Archivo: `src\components\CustomCursor\index.js`
```js
import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const coords = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  // Actualiza las posiciones usando requestAnimationFrame para 60fps constantes
  const updatePosition = () => {
    const { x, y } = coords.current;
    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    rafId.current = null;
  };

  const handleMouseMove = (e) => {
    coords.current = { x: e.clientX, y: e.clientY };
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updatePosition);
    }
  };

  // Detecta si el mouse está sobre un elemento interactivo
  const handleMouseOver = (e) => {
    const target = e.target;
    if (
      target.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')
    ) {
      ringRef.current?.classList.add(styles.hover);
      document.body.style.cursor = 'none';
    }
  };

  const handleMouseOut = (e) => {
    const target = e.target;
    if (
      target.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')
    ) {
      // Solo restaura si el nuevo elemento no es interactivo
      if (!e.relatedTarget?.matches('a, button, [role="button"], input[type="submit"], .navbar__link, .menu__link, .theme-doc-sidebar-item-link, .pagination-nav__link, .dropdown__link')) {
        ringRef.current?.classList.remove(styles.hover);
        document.body.style.cursor = '';
      }
    }
  };

  useEffect(() => {
    // Oculta el cursor nativo mientras el componente está montado
    document.body.style.cursor = 'none';

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.cursorDot} />
      <div ref={ringRef} className={styles.cursorRing} />
    </>
  );
}

```

### 📄 Archivo: `src\components\CustomCursor\styles.module.css`
```css
/* Punto de mira central */
.cursorDot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  margin-left: -4px;
  background: #00ffe0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow:
    0 0 6px #00ffe0,
    0 0 20px rgba(0, 255, 224, 0.7),
    0 0 40px rgba(0, 255, 224, 0.4);
  transform: translate3d(-100px, -100px, 0);
  transition: transform 0.08s ease-out;  /* ligero retardo para el rastro */
}

/* Anillo exterior */
.cursorRing {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  margin-top: -20px;
  margin-left: -20px;
  border: 2px solid rgba(0, 255, 224, 0.6);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate3d(-100px, -100px, 0);
  transition:
    transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    border-color 0.3s,
    box-shadow 0.3s,
    width 0.3s,
    height 0.3s,
    margin-top 0.3s,
    margin-left 0.3s;
  box-shadow: 0 0 10px rgba(0, 255, 224, 0.3);
}

/* Estado hover: el anillo se expande y cambia de color a rojo/magenta cyberpunk */
.cursorRing.hover {
  width: 60px;
  height: 60px;
  margin-top: -30px;
  margin-left: -30px;
  border-color: #ff0044;
  box-shadow:
    0 0 15px #ff0044,
    0 0 30px rgba(255, 0, 68, 0.5);
}

```

### 📄 Archivo: `src\components\DocumentLibrary.jsx`
```jsx
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './DocumentLibrary.module.css';

const documents = [
  {
    id: 'tfg',
    title_es: "Trabajo de Fin de Grado Completo (PDF)",
    title_en: "Full Bachelor's Thesis (PDF)",
    description_es: "Documento académico completo en formato PDF, incluyendo anexos técnicos, formulación matemática avanzada y bibliografía exhaustiva.",
    description_en: "Complete academic document in PDF format, including technical annexes, advanced mathematical formulation, and exhaustive bibliography.",
    filename: "tfg_antigravity(1).pdf",
    icon: "🎓"
  },
  {
    id: 'entsoe',
    title_es: "Informe Factual ENTSO-E",
    title_en: "ENTSO-E Factual Report",
    description_es: "Análisis preliminar de la Red Europea de Gestores de Redes de Transporte de Electricidad sobre las oscilaciones inter-área y la pérdida de sincronismo.",
    description_en: "Preliminary analysis by the European Network of Transmission System Operators for Electricity on inter-area oscillations and loss of synchronism.",
    filename: "informe_electricidad_mas_barata.pdf", // Assuming this corresponds to it or another official doc
    icon: "🇪🇺"
  },
  {
    id: 'csn',
    title_es: "Presentación del Comité de Análisis",
    title_en: "Analysis Committee Presentation",
    description_es: "Presentación ejecutiva del Gobierno de España con la reconstrucción de los hechos y primeras medidas regulatorias propuestas.",
    description_en: "Executive presentation by the Government of Spain reconstructing the events and proposing initial regulatory measures.",
    filename: "presentacion_gobierno.pdf",
    icon: "🏛️"
  }
];

export default function DocumentLibrary({ lang = 'es' }) {
  const isEn = lang === 'en';

  return (
    <div className={styles.libraryContainer}>
      <p className={styles.introText}>
        {isEn 
          ? "Below you can download the original PDF documents that serve as primary sources for this forensic analysis:"
          : "A continuación puedes descargar los documentos PDF originales que sirven de fuente primaria para este análisis forense:"}
      </p>
      
      <div className={styles.cardGrid}>
        {documents.map((doc) => {
          const fileUrl = useBaseUrl(`/${doc.filename}`);
          
          return (
            <div key={doc.id} className={styles.documentCard}>
              <div className={styles.cardHeader}>
                <span className={styles.docIcon}>{doc.icon}</span>
                <h3 className={styles.docTitle}>
                  {isEn ? doc.title_en : doc.title_es}
                </h3>
              </div>
              
              <div className={styles.cardBody}>
                <p className={styles.docDescription}>
                  {isEn ? doc.description_en : doc.description_es}
                </p>
              </div>
              
              <div className={styles.cardFooter}>
                <a 
                  href={fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="button button--primary button--block"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', verticalAlign: 'text-bottom'}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {isEn ? "Download PDF" : "Descargar PDF"}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\DocumentLibrary.module.css`
```css
.libraryContainer {
  margin-top: 2rem;
}

.introText {
  font-size: 1.1rem;
  color: var(--ifm-color-emphasis-700);
  margin-bottom: 2rem;
}

.cardGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.documentCard {
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.documentCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: var(--ifm-color-primary);
}

.cardHeader {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.docIcon {
  font-size: 2.5rem;
  line-height: 1;
}

.docTitle {
  font-size: 1.25rem;
  margin: 0;
  color: var(--ifm-heading-color);
  line-height: 1.3;
}

.cardBody {
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.docDescription {
  color: var(--ifm-color-emphasis-700);
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.cardFooter {
  margin-top: auto;
}

```

### 📄 Archivo: `src\components\EnergyTransitionStreamgraph.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const EnergyTransitionStreamgraphBase = React.lazy(() => import('./EnergyTransitionStreamgraphBase'));

export default function EnergyTransitionStreamgraph(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <EnergyTransitionStreamgraphBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\EnergyTransitionStreamgraph.module.css`
```css
.container {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--ifm-background-surface-color, #1b1b1d);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--ifm-color-emphasis-200);
}

.header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--ifm-color-primary);
}

.header p {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: var(--ifm-font-color-base);
  opacity: 0.8;
}

.chartWrapper {
  width: 100%;
  height: 500px;
}

.customTooltip {
  background-color: var(--ifm-background-surface-color, #242526);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  min-width: 250px;
}

.tooltipTitle {
  margin: 0 0 0.8rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid var(--ifm-color-emphasis-300);
  padding-bottom: 0.5rem;
  color: var(--ifm-font-color-base);
}

.tooltipGrid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.techLabel, .emissionsLabel {
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.emissionsLabel {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--ifm-color-emphasis-300);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
}

.customLegend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.legendItem {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  user-select: none;
}

.legendItem:hover {
  background-color: var(--ifm-color-emphasis-200);
}

.legendItem.inactive {
  opacity: 0.4;
  filter: grayscale(100%);
}

.legendColor {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 6px;
}

.legendLabel {
  font-size: 0.85rem;
  color: var(--ifm-font-color-base);
  font-weight: 500;
}

```

### 📄 Archivo: `src\components\EnergyTransitionStreamgraphBase.jsx`
```jsx
import React, { useState } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './EnergyTransitionStreamgraph.module.css';

const data = [
  { year: 1990, carbon: 40.0, cicloCombinado: 0.0, nuclear: 35.0, hidraulica: 23.0, eolica: 0.0, solar: 0.0, emisiones: 280 },
  { year: 2007, carbon: 24.0, cicloCombinado: 25.0, nuclear: 20.0, hidraulica: 9.0, eolica: 10.0, solar: 0.5, emisiones: 444 },
  { year: 2015, carbon: 20.0, cicloCombinado: 10.0, nuclear: 21.0, hidraulica: 11.0, eolica: 19.0, solar: 3.0, emisiones: 270 },
  { year: 2021, carbon: 1.5, cicloCombinado: 17.0, nuclear: 21.0, hidraulica: 11.5, eolica: 23.0, solar: 8.0, emisiones: 110 },
  { year: 2023, carbon: 1.5, cicloCombinado: 14.0, nuclear: 20.0, hidraulica: 13.0, eolica: 23.5, solar: 14.0, emisiones: 32 },
  { year: 2024, carbon: 1.2, cicloCombinado: 13.6, nuclear: 20.0, hidraulica: 13.3, eolica: 23.2, solar: 17.0, emisiones: 27 },
  { year: 2025, carbon: 0.8, cicloCombinado: 16.8, nuclear: 20.0, hidraulica: 10.0, eolica: 22.3, solar: 18.0, emisiones: 24 },
];

const COLORS = {
  carbon: '#4a4a4a',          // Gris oscuro/antracita
  cicloCombinado: '#e67e22',  // Naranja gas
  nuclear: '#9b59b6',         // Púrpura
  hidraulica: '#1abc9c',      // Verde turquesa
  eolica: '#3498db',          // Azul eólica
  solar: '#f1c40f'            // Amarillo solar
};

const CustomTooltip = ({ active, payload, label, strings }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <h4 className={styles.tooltipTitle}>{strings.year} {label}</h4>
        <div className={styles.tooltipGrid}>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'emisiones') {
              return (
                <p key={index} className={styles.emissionsLabel} style={{ color: entry.color }}>
                  <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                  {strings.emissionsLabel}: <strong>{entry.value} Mt</strong>
                </p>
              );
            }
            return (
              <p key={index} className={styles.techLabel} style={{ color: entry.color }}>
                <span className={styles.dot} style={{ backgroundColor: entry.color }}></span>
                {strings.techs[entry.name] || entry.name}: <strong>{entry.value}%</strong>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function EnergyTransitionStreamgraph({ lang = 'es' }) {
  const [activeSeries, setActiveSeries] = useState({
    carbon: true,
    cicloCombinado: true,
    nuclear: true,
    hidraulica: true,
    eolica: true,
    solar: true,
    emisiones: true,
  });

  const toggleSeries = (dataKey) => {
    setActiveSeries(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Transition Strata (1990 - 2025)', desc1: 'Generation Mix Evolution (%) vs. CO2 Emissions (Mt).', desc2: 'Click on the legend to toggle technologies.', year: 'Year', emissionsLabel: 'CO2 Emissions', techs: { "Carbón": "Coal", "Nuclear": "Nuclear", "Hidráulica": "Hydro", "Ciclo Combinado": "Combined Cycle", "Eólica": "Wind", "Solar FV": "Solar PV", "Emisiones CO2": "CO2 Emissions" } };
      case 'pt': return { title: 'Estratos de Transição (1990 - 2025)', desc1: 'Evolução do Mix de Geração (%) vs. Emissões de CO2 (Mt).', desc2: 'Clique na legenda para alternar as tecnologias.', year: 'Ano', emissionsLabel: 'Emissões CO2', techs: { "Carbón": "Carvão", "Nuclear": "Nuclear", "Hidráulica": "Hídrica", "Ciclo Combinado": "Ciclo Combinado", "Eólica": "Eólica", "Solar FV": "Solar FV", "Emisiones CO2": "Emissões CO2" } };
      case 'fr': return { title: 'Strates de Transition (1990 - 2025)', desc1: 'Évolution du mix de production (%) vs Émissions de CO2 (Mt).', desc2: 'Cliquez sur la légende pour basculer les technologies.', year: 'Année', emissionsLabel: 'Émissions CO2', techs: { "Carbón": "Charbon", "Nuclear": "Nucléaire", "Hidráulica": "Hydraulique", "Ciclo Combinado": "Cycle Combiné", "Eólica": "Éolien", "Solar FV": "Solaire PV", "Emisiones CO2": "Émissions CO2" } };
      case 'it': return { title: 'Strati di Transizione (1990 - 2025)', desc1: 'Evoluzione del mix di generazione (%) vs Emissioni di CO2 (Mt).', desc2: 'Fai clic sulla legenda per attivare/disattivare le tecnologie.', year: 'Anno', emissionsLabel: 'Emissioni CO2', techs: { "Carbón": "Carbone", "Nuclear": "Nucleare", "Hidráulica": "Idroelettrica", "Ciclo Combinado": "Ciclo Combinato", "Eólica": "Eolico", "Solar FV": "Solare FV", "Emisiones CO2": "Emissioni CO2" } };
      case 'de': return { title: 'Übergangsschichten (1990 - 2025)', desc1: 'Entwicklung des Erzeugungsmixes (%) vs. CO2-Emissionen (Mt).', desc2: 'Klicken Sie auf die Legende, um Technologien umzuschalten.', year: 'Jahr', emissionsLabel: 'CO2-Emissionen', techs: { "Carbón": "Kohle", "Nuclear": "Kernkraft", "Hidráulica": "Wasser", "Ciclo Combinado": "GuD-Kraftwerk", "Eólica": "Wind", "Solar FV": "Solar-PV", "Emisiones CO2": "CO2-Emissionen" } };
      default: return { title: 'Estratos de Transición (1990 - 2025)', desc1: 'Evolución del Mix de Generación (%) vs. Emisiones de CO2 (Mt).', desc2: 'Haz clic en la leyenda para activar/desactivar tecnologías.', year: 'Año', emissionsLabel: 'Emisiones CO2', techs: { "Carbón": "Carbón", "Nuclear": "Nuclear", "Hidráulica": "Hidráulica", "Ciclo Combinado": "Ciclo Combinado", "Eólica": "Eólica", "Solar FV": "Solar FV", "Emisiones CO2": "Emisiones CO2" } };
    }
  };
  const strings = getStrings(lang);

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className={styles.customLegend}>
        {payload.map((entry, index) => (
          <div 
            key={`item-${index}`} 
            className={`${styles.legendItem} ${!activeSeries[entry.dataKey] ? styles.inactive : ''}`}
            onClick={() => toggleSeries(entry.dataKey)}
            style={{ '--item-color': entry.color }}
          >
            <span className={styles.legendColor} style={{ backgroundColor: entry.color }}></span>
            <span className={styles.legendLabel}>{strings.techs[entry.value] || entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{strings.title}</h3>
        <p>{strings.desc1}<br/><em>{strings.desc2}</em></p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
            />
            
            {/* Eje Y Principal (Porcentajes) */}
            <YAxis 
              yAxisId="left" 
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
              axisLine={false}
            />
            
            {/* Eje Y Secundario (Emisiones) */}
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tickFormatter={(val) => `${val} Mt`}
              tick={{ fill: '#ff4757', fontWeight: 'bold' }}
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip content={<CustomTooltip strings={strings} />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }} />
            <Legend content={renderLegend} verticalAlign="bottom" height={36}/>

            {/* Áreas Apiladas (Streamgraph) */}
            {activeSeries.carbon && (
              <Area yAxisId="left" type="monotone" dataKey="carbon" name="Carbón" stackId="1" stroke={COLORS.carbon} fill={COLORS.carbon} fillOpacity={0.8} />
            )}
            {activeSeries.nuclear && (
              <Area yAxisId="left" type="monotone" dataKey="nuclear" name="Nuclear" stackId="1" stroke={COLORS.nuclear} fill={COLORS.nuclear} fillOpacity={0.8} />
            )}
            {activeSeries.hidraulica && (
              <Area yAxisId="left" type="monotone" dataKey="hidraulica" name="Hidráulica" stackId="1" stroke={COLORS.hidraulica} fill={COLORS.hidraulica} fillOpacity={0.8} />
            )}
            {activeSeries.cicloCombinado && (
              <Area yAxisId="left" type="monotone" dataKey="cicloCombinado" name="Ciclo Combinado" stackId="1" stroke={COLORS.cicloCombinado} fill={COLORS.cicloCombinado} fillOpacity={0.8} />
            )}
            {activeSeries.eolica && (
              <Area yAxisId="left" type="monotone" dataKey="eolica" name="Eólica" stackId="1" stroke={COLORS.eolica} fill={COLORS.eolica} fillOpacity={0.8} />
            )}
            {activeSeries.solar && (
              <Area yAxisId="left" type="monotone" dataKey="solar" name="Solar FV" stackId="1" stroke={COLORS.solar} fill={COLORS.solar} fillOpacity={0.8} />
            )}

            {/* Línea de Emisiones */}
            {activeSeries.emisiones && (
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="emisiones" 
                name="Emisiones CO2" 
                stroke="#ff4757" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#ff4757', stroke: 'var(--ifm-background-color)' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\ExecutiveHook.jsx`
```jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './ExecutiveHook.module.css';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import { motion } from 'framer-motion';

export default function ExecutiveHook() {
  // Evitar FOUC: El splash se muestra por defecto en SSR y cliente inicial. 
  // Si en hidratación vemos que ya se ha reproducido, lo ocultamos al instante.
  const [showSplash, setShowSplash] = useState(true);
  const [phase, setPhase] = useState('waiting'); // 'waiting' | 'playing'
  const [elapsed, setElapsed] = useState(0);

  const { i18n } = useDocusaurusContext();
  const lang = i18n.currentLocale;
  const audioMp3 = useBaseUrl('/audio/epic-hit.mp3');
  const audioOgg = useBaseUrl('/audio/epic-hit.ogg');
  const bgLit = useBaseUrl('/img/europe-night-lit.jpg');
  const bgDark = useBaseUrl('/img/europe-night-dark.jpg');
  
  const audioRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { splashTitle1: 'IBERIAN', splashTitle2: 'BLACKOUT', splashTitle3: '2025', splashSubtitle: 'Forensic Analysis of Systemic Collapse', statPower: 'Power Lost', statSeverity: 'ENTSO-E Severity', statDate: 'April 28 2025', statAffected: 'Affected', heroTitle1: 'Anatomy of a', heroTitleHighlight: 'Systemic Collapse', heroSubtitle: 'Forensic analysis of the 2025 Iberian Peninsula blackout: voltage instability, inertia deficit and the structural transition towards 100% inverter-based resources (IBR).', box1Title: 'What happened?', box1Text: 'The loss of the Granada transformer (400/220 kV) triggered a cascade of overvoltages that collapsed the Iberian grid in 11 seconds, dragging 31 GW of demand and disconnecting the HVDC link with France.', box2Title: 'Tools & Methodology', box2Text: 'Newton-Raphson load flow, transient stability analysis, RoCoF modeling and N-1 contingency evaluation. Web infrastructure based on Docusaurus, MDX, KaTeX and React.', box3Title: 'Main Conclusion', box3Text: 'The incident was not a random failure, but the symptom of a structural weakness (Q-V collapse) induced by extreme solar penetration without sufficient short-circuit support.', startAnalysis: 'Start Analysis ⚡', download: 'DOWNLOAD THESIS' };
      case 'pt': return { splashTitle1: 'APAGÃO', splashTitle2: 'IBÉRICO', splashTitle3: '2025', splashSubtitle: 'Análise Forense do Colapso Sistêmico', statPower: 'Potência Perdida', statSeverity: 'Severidade ENTSO-E', statDate: '28 de Abril de 2025', statAffected: 'Afetados', heroTitle1: 'Anatomia de um', heroTitleHighlight: 'Colapso Sistêmico', heroSubtitle: 'Análise forense do apagão da Península Ibérica de 2025: instabilidade de tensão, déficit de inércia e a transição estrutural para redes 100% baseadas em inversores (IBR).', box1Title: 'O que aconteceu?', box1Text: 'A perda do transformador de Granada (400/220 kV) desencadeou uma cascata de sobretensões que colapsou a rede ibérica em 11 segundos, arrastrando 31 GW de demanda e desconectando a ligação HVDC com a França.', box2Title: 'Ferramentas e Metodologia', box2Text: 'Fluxo de potência Newton-Raphson, análise de estabilidade transitória, modelagem RoCoF e avaliação de contingência N-1. Infraestrutura web baseada em Docusaurus, MDX, KaTeX e React.', box3Title: 'Conclusão Principal', box3Text: 'O incidente não foi uma falha fortuita, mas o sintoma de uma fraqueza estrutural (colapso Q-V) induzida por penetração solar extrema sem suporte de curto-circuito suficiente.', startAnalysis: 'Iniciar Análise ⚡', download: 'BAIXAR TESE' };
      case 'fr': return { splashTitle1: 'BLACK-OUT', splashTitle2: 'IBÉRIQUE', splashTitle3: '2025', splashSubtitle: 'Analyse de l\'Effondrement Systémique', statPower: 'Puissance Perdue', statSeverity: 'Sévérité ENTSO-E', statDate: '28 avril 2025', statAffected: 'Personnes Touchées', heroTitle1: 'Anatomie d\'un', heroTitleHighlight: 'Effondrement Systémique', heroSubtitle: 'Analyse du black-out de la péninsule ibérique en 2025 : instabilité de tension, déficit d\'inertie et transition structurelle vers des réseaux 100 % basés sur onduleurs (IBR).', box1Title: 'Que s\'est-il passé ?', box1Text: 'La perte du transformateur de Grenade (400/220 kV) a déclenché une cascade de surtensions qui a effondré le réseau ibérique en 11 secondes, entraînant 31 GW de demande et déconnectant la liaison HVDC avec la France.', box2Title: 'Outils et Méthodologie', box2Text: 'Écoulement de charge de Newton-Raphson, analyse de stabilité transitoire, modélisation RoCoF et évaluation de contingence N-1. Infrastructure Web basée sur Docusaurus, MDX, KaTeX et React.', box3Title: 'Conclusion Principale', box3Text: 'L\'incident n\'était pas une défaillance fortuite, mais le symptôme d\'une faiblesse structurelle (effondrement Q-V) induite par une pénétration solaire extrême sans support de court-circuit suffisant.', startAnalysis: 'Commencer l\'analyse ⚡', download: 'TÉLÉCHARGER LA THÈSE' };
      case 'it': return { splashTitle1: 'BLACKOUT', splashTitle2: 'IBERICO', splashTitle3: '2025', splashSubtitle: 'Analisi Forense del Collasso Sistemico', statPower: 'Potenza Persa', statSeverity: 'Gravità ENTSO-E', statDate: '28 aprile 2025', statAffected: 'Persone Coinvolte', heroTitle1: 'Anatomia di un', heroTitleHighlight: 'Collasso Sistemico', heroSubtitle: 'Analisi forense del blackout della penisola iberica del 2025: instabilità della tensione, deficit di inerzia e transizione strutturale verso reti basate al 100% su inverter (IBR).', box1Title: 'Cosa è successo?', box1Text: 'La perdita del trasformatore di Granada (400/220 kV) ha innescato una cascata di sovratensioni che ha fatto collassare la rete iberica in 11 secondi, trascinando 31 GW di domanda e disconnettendo il collegamento HVDC con la Francia.', box2Title: 'Strumenti e Metodologia', box2Text: 'Flusso di carico Newton-Raphson, analisi della stabilità transitoria, modellazione RoCoF e valutazione delle contingenze N-1. Infrastruttura Web basata su Docusaurus, MDX, KaTeX e React.', box3Title: 'Conclusione Principale', box3Text: 'L\'incidente non è stato un guasto fortuito, ma il sintomo di una debolezza strutturale (collasso Q-V) indotta da un\'estrema penetrazione solare senza sufficiente supporto di cortocircuito.', startAnalysis: 'Inizia l\'analisi ⚡', download: 'SCARICA LA TESI' };
      case 'de': return { splashTitle1: 'IBERISCHER', splashTitle2: 'BLACKOUT', splashTitle3: '2025', splashSubtitle: 'Forensische Analyse des Systemkollapses', statPower: 'Leistungsverlust', statSeverity: 'ENTSO-E Schweregrad', statDate: '28. April 2025', statAffected: 'Betroffene', heroTitle1: 'Anatomie eines', heroTitleHighlight: 'Systemkollapses', heroSubtitle: 'Forensische Analyse des Stromausfalls auf der Iberischen Halbinsel 2025: Spannungsinstabilität, Trägheitsdefizit und der strukturelle Übergang zu 100 % umrichterbasierten Ressourcen (IBR).', box1Title: 'Was ist passiert?', box1Text: 'Der Ausfall des Transformators in Granada (400/220 kV) löste eine Kaskade von Überspannungen aus, die das iberische Netz in 11 Sekunden zum Einsturz brachte, 31 GW Nachfrage mit sich zog und die HGÜ-Verbindung mit Frankreich trennte.', box2Title: 'Werkzeuge & Methodik', box2Text: 'Newton-Raphson-Lastfluss, transiente Stabilitätsanalyse, RoCoF-Modellierung und N-1-Kontingenzbewertung. Web-Infrastruktur basierend auf Docusaurus, MDX, KaTeX und React.', box3Title: 'Hauptergebnis', box3Text: 'Der Vorfall war kein zufälliger Ausfall, sondern das Symptom einer strukturellen Schwäche (Q-V-Kollaps), die durch extreme solare Durchdringung ohne ausreichende Kurzschlussunterstützung hervorgerufen wurde.', startAnalysis: 'Analyse starten ⚡', download: 'THESE HERUNTERLADEN' };
      default: return { splashTitle1: 'APAGÓN', splashTitle2: 'IBÉRICO', splashTitle3: '2025', splashSubtitle: 'Análisis Forense del Colapso Sistémico', statPower: 'Potencia Perdida', statSeverity: 'Severidad ENTSO-E', statDate: '28 Abril 2025', statAffected: 'Afectados', heroTitle1: 'Anatomía de un', heroTitleHighlight: 'Colapso Sistémico', heroSubtitle: 'Análisis forense del apagón de la Península Ibérica de 2025: inestabilidad de tensión, déficit de inercia y la transición estructural hacia redes 100% basadas en inversores (IBR).', box1Title: '¿Qué ocurrió?', box1Text: 'La pérdida del transformador de Granada (400/220 kV) desencadenó una cascata de sobretensiones que colapsó la red ibérica en 11 segundos, arrastrando 31 GW de demanda y desconectando el enlace HVDC con Francia.', box2Title: 'Herramientas y Metodología', box2Text: 'Flujo de cargas Newton-Raphson, análisis de estabilidad transitoria, modelado RoCoF y evaluación de contingencia N-1. Infraestructura web basada en Docusaurus, MDX, KaTeX y React.', box3Title: 'Conclusión Principal', box3Text: 'El incidente no fue un fallo fortuito, sino el síntoma de una debilidad estructural (colapso Q-V) inducida por una penetración solar extrema sin suficiente soporte de cortocircuito.', startAnalysis: 'Comenzar Análisis ⚡', download: 'DESCARGAR TFG' };
    }
  };
  const strings = getStrings(lang);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('splash_seen')) {
        setShowSplash(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!showSplash || phase !== 'playing') return;

    document.body.style.overflow = 'hidden';
    startTimeRef.current = Date.now();
    let audioStarted = false;

    const animate = () => {
      const now = Date.now();
      const elapsedMs = now - startTimeRef.current;
      const cappedElapsed = Math.min(elapsedMs, 10200);
      setElapsed(cappedElapsed);

      const audio = audioRef.current;

      // Play audio at t=4500ms
      if (cappedElapsed >= 4500 && !audioStarted && audio) {
        audio.currentTime = 0;
        audio.volume = 0.8;
        audio.play().catch(e => console.log('Audio autoplay blocked', e));
        audioStarted = true;
      }

      // Stop audio at t=7900ms
      if (cappedElapsed >= 7900 && audioStarted && audio) {
        audio.pause();
        audioStarted = false;
      }

      if (elapsedMs < 10200) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setShowSplash(false);
        sessionStorage.setItem('splash_seen', '1');
        document.body.style.overflow = '';
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.body.style.overflow = '';
    };
  }, [showSplash, phase]);

  const handleStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.0; // Silenciar durante el desbloqueo
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }).catch(() => {});
      }
    }
    setPhase('playing');
  };

  // Formatting for countdown
  const formatCountdown = () => {
    const elapsedInPhase = Math.min(elapsed, 3000);
    const totalSeconds = 12 * 3600 + 33 * 60 + 21;
    const currentSeconds = totalSeconds + (elapsedInPhase / 1000);
    
    const hours = Math.floor(currentSeconds / 3600);
    const minutes = Math.floor((currentSeconds % 3600) / 60);
    const seconds = Math.floor(currentSeconds % 60);
    const milliseconds = Math.floor((currentSeconds % 1) * 100);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')} CEST`;
  };

  // PHASE LOGIC for variables
  const showMap = elapsed < 4500;
  
  let litOpacity = 1;
  let darkOpacity = 0;
  if (elapsed < 3000) {
    const progress = elapsed / 3000;
    litOpacity = 1 - progress;
    darkOpacity = progress;
  } else {
    litOpacity = 0;
    darkOpacity = 1;
  }

  let mapOpacity = 1;
  if (elapsed >= 3000 && elapsed < 4500) {
    const fadeProgress = (elapsed - 3000) / 1500;
    mapOpacity = 1 - fadeProgress;
  } else if (elapsed >= 4500) {
    mapOpacity = 0;
  }

  let titleOpacity = 0;
  if (elapsed >= 4200) {
    titleOpacity = elapsed < 4700 ? (elapsed - 4200) / 500 : 1;
  }

  let titleMainOpacity = 0;
  let titleMainFilter = 'blur(16px)';
  if (elapsed >= 4500 && elapsed < 5800) {
    const progress = (elapsed - 4500) / 1300;
    titleMainOpacity = progress;
    titleMainFilter = `blur(${16 * (1 - progress)}px)`;
  } else if (elapsed >= 5800) {
    titleMainOpacity = 1;
    titleMainFilter = 'blur(0px)';
  }

  let subtitleOpacity = 0;
  let subtitleTransform = 'translateY(10px)';
  if (elapsed >= 6000 && elapsed < 7000) {
    const progress = (elapsed - 6000) / 1000;
    subtitleOpacity = progress;
    subtitleTransform = `translateY(${10 * (1 - progress)}px)`;
  } else if (elapsed >= 7000) {
    subtitleOpacity = 1;
    subtitleTransform = 'translateY(0)';
  }

  let authorOpacity = 0;
  if (elapsed >= 7000 && elapsed < 7900) {
    authorOpacity = (elapsed - 7000) / 900;
  } else if (elapsed >= 7900) {
    authorOpacity = 1;
  }

  let finalFadeOutOpacity = 1;
  if (elapsed >= 9800) {
    finalFadeOutOpacity = 1 - ((elapsed - 9800) / 400);
  }

  const showCountdown = elapsed < 3200;
  const flicker1Visible = elapsed >= 750 && elapsed <= 830;
  const flicker2Visible = elapsed >= 1700 && elapsed <= 1760;

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Alfa+Slab+One&display=swap" rel="stylesheet" />
        
        <link rel="preload" href={bgLit} as="image" />
        <link rel="preload" href={bgDark} as="image" />
        <link rel="preload" href={audioMp3} as="audio" />
        <style>{`
          @keyframes flicker1Effect { 0%, 100% { opacity: 0; } 30% { opacity: 0.12; } 70% { opacity: 0.12; } }
          @keyframes flicker2Effect { 0%, 100% { opacity: 0; } 40% { opacity: 0.08; } 60% { opacity: 0.08; } }
        `}</style>
      </Head>
      <audio ref={audioRef} preload="auto">
        <source src={audioOgg} type="audio/ogg" />
        <source src={audioMp3} type="audio/mpeg" />
      </audio>

      {/* PANTALLA SPLASH (WAITING O PLAYING) */}
      {showSplash && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#000',
            overflow: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)', willChange: 'opacity',
            opacity: finalFadeOutOpacity
          }}
        >
          {phase === 'waiting' && (
            <motion.div
              onClick={handleStart}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 100000,
                backgroundImage: `url(${bgLit})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center', transform: 'scale(1.15) translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform, opacity'
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)' }} />
              <motion.p
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  position: 'relative',
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(24px, 4vw, 48px)',
                  color: '#FFB800',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  textShadow: '2px 2px 0px #CC2200, 4px 4px 0px #AA1800, 6px 6px 0px #881000, 8px 8px 0px #660800, 10px 10px 0px rgba(0,0,0,0.6)',
                  
                  zIndex: 2,
                  textAlign: 'center'
                }}
              >
                CLICK TO ENTER
              </motion.p>
            </motion.div>
          )}

          {phase === 'playing' && (
            <>
              {showMap && (
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: mapOpacity }}>
                  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${bgLit})`, opacity: litOpacity, transform: "scale(1.15) translateZ(0)", backfaceVisibility: 'hidden', willChange: 'transform, opacity' }} />
                    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: `url(${bgDark})`, opacity: darkOpacity, transform: "scale(1.15) translateZ(0)", backfaceVisibility: 'hidden', willChange: 'transform, opacity' }} />
                  </div>

                  {flicker1Visible && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', pointerEvents: 'none', animation: 'flicker1Effect 0.08s ease-out' }} />}
                  {flicker2Visible && <div style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffff', pointerEvents: 'none', animation: 'flicker2Effect 0.06s ease-out' }} />}

                  {showCountdown && (
                    <div style={{
                      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center',
                      fontFamily: '"Alfa Slab One", serif', fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#FFD700',
                      textTransform: 'uppercase', letterSpacing: '0.15em', textShadow: '-1px -1px 0px #cc0000, 2px 2px 0px #880000',
                      zIndex: 10001, lineHeight: 1.2, margin: 0
                    }}>
                      <div style={{ fontSize: '0.85em', opacity: 0.95, marginBottom: '6px' }}>28 ABR 2025</div>
                      <div style={{ fontSize: '1.15em', letterSpacing: '0.15em' }}>{formatCountdown()}</div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ 
                position: 'absolute', inset: 0, width: '100%', height: '100%', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                opacity: titleOpacity 
              }}>
                <h1 style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(72px, 14vw, 160px)',
                  fontWeight: 400,
                  color: '#FFB800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  lineHeight: 1.05, userSelect: 'none',
                  margin: 0,
                  textAlign: 'center',
                  textShadow: '2px 2px 0px #CC2200, 4px 4px 0px #AA1800, 6px 6px 0px #881000, 8px 8px 0px #660800, 10px 10px 0px rgba(0,0,0,0.6)',
                  
                  opacity: titleMainOpacity,
                  padding: "20px"
                }}>
                  {strings.splashTitle1}<br/>{strings.splashTitle2}<br/>{strings.splashTitle3}
                </h1>

                <p style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(14px, 2.2vw, 24px)',
                  fontWeight: 400,
                  color: '#FFB800',
                  letterSpacing: '0.18em',
                  marginTop: '28px',
                  textAlign: 'center',
                  textShadow: '1px 1px 0px #CC2200, 3px 3px 0px #881000, 4px 4px 0px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  maxWidth: '90vw',
                  opacity: subtitleOpacity,
                  transform: subtitleTransform
                }}>
                  {strings.splashSubtitle}
                </p>

                <p style={{
                  fontFamily: '"Alfa Slab One", serif',
                  fontSize: 'clamp(13px, 1.8vw, 20px)',
                  fontWeight: 400,
                  color: 'rgba(255,184,0,0.75)',
                  letterSpacing: '0.20em',
                  marginTop: '18px',
                  textAlign: 'center',
                  textShadow: '1px 1px 0px #CC2200, 3px 3px 0px rgba(0,0,0,0.5)',
                  textTransform: 'uppercase',
                  maxWidth: '90vw',
                  opacity: authorOpacity
                }}>
                  Alfonso Monge Díaz-Ángel
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content (Always rendered behind splash) */}
      <div id="executive-hook" className={styles.heroContainer} style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
        {/* Top Banner / Event Scale */}
        <div className={styles.statsBanner}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>31 GW</span>
            <span className={styles.statLabel}>{strings.statPower}</span>
          </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>Scale 3</span>
          <span className={styles.statLabel}>{strings.statSeverity}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>12:33 CEST</span>
          <span className={styles.statLabel}>{strings.statDate}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>60M</span>
          <span className={styles.statLabel}>{strings.statAffected}</span>
        </div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.title}>
          {strings.heroTitle1} <span className={styles.highlight}>{strings.heroTitleHighlight}</span>
        </h1>
        <p className={styles.subtitle}>
          {strings.heroSubtitle}
        </p>

        {/* 90-second Executive Summary */}
        <div className={styles.execSummary}>
          <div className={styles.summaryBox}>
            <h3>{strings.box1Title}</h3>
            <p>{strings.box1Text}</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>{strings.box2Title}</h3>
            <p>{strings.box2Text}</p>
          </div>
          <div className={styles.summaryBox}>
            <h3>{strings.box3Title}</h3>
            <p>{strings.box3Text}</p>
          </div>
        </div>

        {/* CTAs & Badges */}
        <div className={styles.actions}>
          <Link className={`button button--primary button--lg ${styles.primaryBtn}`} to="/contexto">
            {strings.startAnalysis}
          </Link>
          <a className={`button button--outline button--lg ${styles.secondaryBtn}`} href="https://github.com/Alfonsomongee/TFG-OVERLEAF" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub
          </a>
          
        </div>

        {/* Tech Stack Badges */}
        <div className={styles.techStack}>
          <span className={styles.techBadge}>Docusaurus v2</span>
          <span className={styles.techBadge}>React.js</span>
          <span className={styles.techBadge}>KaTeX</span>
          <span className={styles.techBadge}>Python Data Analytics</span>
          <span className={styles.techBadge}>Newton-Raphson Solver</span>
        </div>
        </div>
      </div>
    </>
  );
}







```

### 📄 Archivo: `src\components\ExecutiveHook.module.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Playfair+Display:wght@700;800;900&display=swap');

/* Splash Screen Styles */
.splashContainer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: opacity 1.5s ease-in-out, transform 1.5s ease-in-out;
}

.splashBgCinematic {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url('../../static/img/cinematic_blackout.png');
  z-index: -2;
}

.fadeOut {
  opacity: 0 !important;
  pointer-events: none;
  backdrop-filter: blur(10px);
}

.splashOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.9) 100%);
  z-index: -1;
}

.splashContent {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
  max-width: 800px;
}

.splashTitle {
  font-family: 'Alfa Slab One', 'Rockwell', 'Courier New', serif;
  font-size: clamp(3.5rem, 7vw, 6.5rem);
  font-weight: 400; /* Alfa Slab One only has one weight */
  letter-spacing: 4px;
  color: #FFD700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  /* 3D Pulp Fiction extrusion: stacked red shadow layers */
  text-shadow:
    1px 1px 0 #CC0000,
    2px 2px 0 #CC0000,
    3px 3px 0 #CC0000,
    4px 4px 0 #CC0000,
    5px 5px 0 #BB0000,
    6px 6px 0 #BB0000,
    7px 7px 0 #AA0000,
    8px 8px 0 #AA0000,
    9px 9px 0 #990000,
    10px 10px 0 #880000;
  /* Red inner stroke */
  -webkit-text-stroke: 2px #CC0000;
  paint-order: stroke fill;
}

.splashSubtitle {
  font-family: 'Alfa Slab One', 'Rockwell', serif;
  font-size: clamp(0.9rem, 2vw, 1.3rem);
  color: #FFD700;
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: 5px;
  text-transform: uppercase;
  /* Subtle 3D for subtitle */
  text-shadow:
    1px 1px 0 #CC0000,
    2px 2px 0 #CC0000,
    3px 3px 0 #AA0000,
    4px 4px 0 #880000;
  -webkit-text-stroke: 1px #CC0000;
}

.splashButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background-color: var(--ifm-color-primary);
  color: white !important;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
  animation: pulse 2s infinite;
}

.splashButton:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
}

.arrowIcon {
  transition: transform 0.3s ease;
}

.splashButton:hover .arrowIcon {
  transform: translateX(5px);
}

.scrollDownIndicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #94a3b8;
  animation: bounce 2s infinite;
  transition: color 0.3s ease;
}

.scrollDownIndicator:hover {
  color: white;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
  40% { transform: translateY(-20px) translateX(-50%); }
  60% { transform: translateY(-10px) translateX(-50%); }
}

.authorName {
  font-family: 'Alfa Slab One', 'Rockwell', serif;
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: #FFD700;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin-top: 2rem;
  font-weight: 400;
  text-shadow:
    1px 1px 0 #CC0000,
    2px 2px 0 #CC0000,
    3px 3px 0 #AA0000;
  -webkit-text-stroke: 1px #CC0000;
}

.heroContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
}

.statsBanner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--ifm-color-primary-darker);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 3rem;
  box-shadow: var(--glass-shadow);
}

html[data-theme='dark'] .statsBanner {
  background: var(--ifm-color-primary-darkest);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.statItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.statItem:last-child {
  border-right: none;
}

.statValue {
  font-family: var(--ifm-heading-font-family);
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.statLabel {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ifm-color-primary-lightest);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.heroContent {
  text-align: left;
}

.title {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.highlight {
  color: var(--ifm-color-danger);
  background: linear-gradient(90deg, var(--ifm-color-danger), #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--ifm-color-emphasis-700);
  margin-bottom: 3rem;
  max-width: 800px;
}

html[data-theme='dark'] .subtitle {
  color: var(--ifm-color-emphasis-400);
}

.execSummary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.summaryBox {
  background: var(--ifm-card-background-color);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--ifm-color-emphasis-200);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

html[data-theme='dark'] .summaryBox {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(30, 41, 59, 0.5);
}

.summaryBox h3 {
  font-size: 1.1rem;
  color: var(--ifm-color-primary);
  margin-top: 0;
  margin-bottom: 0.75rem;
  border-bottom: none;
}

.summaryBox p {
  font-size: 0.95rem;
  margin: 0;
  color: var(--ifm-color-emphasis-800);
  line-height: 1.5;
}

html[data-theme='dark'] .summaryBox p {
  color: var(--ifm-color-emphasis-300);
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.primaryBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  box-shadow: var(--neon-glow);
}

.secondaryBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  border-radius: 8px;
  background-color: transparent;
  color: var(--ifm-color-emphasis-700);
}

html[data-theme='dark'] .secondaryBtn {
  color: var(--ifm-color-emphasis-300);
  border-color: rgba(255, 255, 255, 0.2);
}

.secondaryBtn:hover {
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-primary);
}

html[data-theme='dark'] .secondaryBtn:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.btnIcon {
  width: 20px;
  height: 20px;
}

.techStack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ifm-color-emphasis-200);
}

html[data-theme='dark'] .techStack {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.techBadge {
  font-family: var(--ifm-font-family-monospace);
  font-size: 0.8rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-emphasis-800);
  border: 1px solid var(--ifm-color-emphasis-200);
}

html[data-theme='dark'] .techBadge {
  background: rgba(255, 255, 255, 0.05);
  color: var(--ifm-color-emphasis-300);
  border-color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 996px) {
  .statsBanner {
    grid-template-columns: repeat(2, 1fr);
  }
  .statItem:nth-child(2) {
    border-right: none;
  }
  .statItem:nth-child(1), .statItem:nth-child(2) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .execSummary {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  .actions {
    flex-direction: column;
  }
  .primaryBtn, .secondaryBtn {
    width: 100%;
    justify-content: center;
  }
}

```

### 📄 Archivo: `src\components\FinancialWaterfallChart.jsx`
```jsx
import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import styles from './FinancialWaterfallChart.module.css';

const getData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    {
      name: t('Impacto VoLL', 'VoLL Impact', 'Impacto VoLL', 'Impact VoLL', 'Impatto VoLL', 'VoLL-Auswirkungen'),
      value: [0, 1500],
      amount: 1500,
      color: '#ef4444', // Red-500
      desc: t('Paralización comercial y caída del PIB (CEOE/ATA).', 'Commercial standstill and GDP drop (CEOE/ATA).', 'Paralisação comercial e queda do PIB (CEOE/ATA).', 'Paralysie commerciale et chute du PIB (CEOE/ATA).', 'Paralisi commerciale e calo del PIL (CEOE/ATA).', 'Kommerzieller Stillstand und BIP-Rückgang (CEOE/ATA).')
    },
    {
      name: t('Daños Industria', 'Industry Damages', 'Danos Indústria', 'Dommages Industrie', 'Danni Industria', 'Industrieschäden'),
      value: [1500, 1525],
      amount: 25,
      color: '#f97316', // Orange-500
      desc: t('Daño directo y lucro cesante electrointensivas (AEGE).', 'Direct damage and lost profits in electro-intensive industries (AEGE).', 'Dano direto e lucros cessantes em eletrointensivas (AEGE).', 'Dommages directs et manque à gagner des industries électro-intensives (AEGE).', 'Danni diretti e mancati profitti nelle industrie elettrolitiche (AEGE).', 'Direkte Schäden und entgangene Gewinne in stromintensiven Industrien (AEGE).')
    },
    {
      name: t('Op. Reforzada (OPEX)', 'Reinforced Op. (OPEX)', 'Op. Reforçada (OPEX)', 'Op. Renforcée (OPEX)', 'Op. Rinforzata (OPEX)', 'Verstärkter Betr. (OPEX)'),
      value: [1525, 2236],
      amount: 711,
      color: '#f59e0b', // Amber-500
      desc: t('Quemar gas innecesario cuesta el 25% del plan de resiliencia.', 'Burning unnecessary gas costs 25% of the resilience plan.', 'Queimar gás desnecessário custa 25% do plano de resiliência.', 'Brûler du gaz inutilement coûte 25% du plan de résilience.', 'Bruciare gas inutilmente costa il 25% del piano di resilienza.', 'Unnötiges Verbrennen von Gas kostet 25% des Resilienzplans.')
    },
    {
      name: t('Multas CNMC', 'CNMC Fines', 'Multas CNMC', 'Amendes CNMC', 'Multe CNMC', 'CNMC-Strafen'),
      value: [2236, 2356],
      amount: 120,
      color: '#8b5cf6', // Violet-500
      desc: t('Infracciones muy graves a operadores y promotoras.', 'Very serious infractions for operators and developers.', 'Infrações muito graves para operadores e promotores.', 'Infractions très graves pour les opérateurs et promoteurs.', 'Infrazioni molto gravi per operatori e promotori.', 'Sehr schwere Verstöße für Betreiber und Entwickler.')
    },
    {
      name: t('Destrucción Total', 'Total Destruction', 'Destruição Total', 'Destruction Totale', 'Distruzione Totale', 'Totale Zerstörung'),
      value: [0, 2356],
      amount: 2356,
      color: '#3f3f46', // Zinc-700
      desc: t('Impacto financiero total en los primeros 12 meses.', 'Total financial impact in the first 12 months.', 'Impacto financeiro total nos primeiros 12 meses.', 'Impact financier total au cours des 12 premiers mois.', 'Impatto finanziario totale nei primi 12 mesi.', 'Gesamte finanzielle Auswirkungen in den ersten 12 Monaten.')
    }
  ];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataInfo = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <h4 className={styles.tooltipTitle}>{dataInfo.name}</h4>
        <p className={styles.tooltipAmount} style={{ color: dataInfo.color }}>
          <strong>{dataInfo.amount} M€</strong>
        </p>
        <p className={styles.tooltipDesc}>{dataInfo.desc}</p>
      </div>
    );
  }
  return null;
};

// Componente para formatear los labels interiores de las barras
const renderCustomizedLabel = (props, data) => {
  const { x, y, width, height, index } = props;
  const dataItem = data[index];
  
  const isSmall = Math.abs(height) < 25;
  const isTotal = index === 4;
  
  // Posicionar la etiqueta: si es total o barra normal, en el medio. Si es pequeña, arriba.
  const labelY = isSmall ? y - 15 : y + height / 2;
  const fill = isSmall ? 'var(--ifm-font-color-base)' : '#fff';
  const prefix = isTotal ? '=' : '+';
  
  return (
    <text 
      x={x + width / 2} 
      y={labelY} 
      fill={fill} 
      textAnchor="middle" 
      dominantBaseline="middle"
      fontSize={13}
      fontWeight="bold"
    >
      {prefix} {dataItem.amount}
    </text>
  );
};

export default function FinancialWaterfallChart({ lang = 'es' }) {
  const data = getData(lang);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Value Destruction Audit (First Year Post-Blackout)', desc: 'Cumulative financial impact in Millions of Euros (M€).', insightLabel: 'Analytical Insight:', insightText: 'The <em>toxic OPEX</em> of the "Reinforced Operation" (-711 M€) is annually equivalent to burning almost 25% of all the structural <em>CAPEX</em> needed (3,000 M€) to modernize the grid with Synchronous Condensers and BESS batteries.' };
      case 'pt': return { title: 'Auditoria de Destruição de Valor (Primeiro Ano Pós-Apagão)', desc: 'Impacto financeiro cumulativo em Milhões de Euros (M€).', insightLabel: 'Insight Analítico:', insightText: 'O <em>OPEX tóxico</em> da "Operação Reforçada" (-711 M€) equivale anualmente a queimar quase 25% de todo o <em>CAPEX</em> estrutural necessário (3.000 M€) para modernizar a rede com Condensadores Síncronos e baterias BESS.' };
      case 'fr': return { title: 'Audit de Destruction de Valeur (Première Année Post-Panne)', desc: 'Impact financier cumulé en Millions d\'Euros (M€).', insightLabel: 'Aperçu Analytique :', insightText: 'L\'<em>OPEX toxique</em> de l\'"Opération Renforcée" (-711 M€) équivaut annuellement à brûler près de 25% de tout le <em>CAPEX</em> structurel nécessaire (3 000 M€) pour moderniser le réseau avec des Compensateurs Synchrones et des batteries BESS.' };
      case 'it': return { title: 'Audit di Distruzione di Valore (Primo Anno Post-Blackout)', desc: 'Impatto finanziario cumulativo in Milioni di Euro (M€).', insightLabel: 'Approfondimento Analitico:', insightText: 'Il <em>OPEX tossico</em> dell\'"Operazione Rinforzata" (-711 M€) equivale annualmente a bruciare quasi il 25% di tutto il <em>CAPEX</em> strutturale necessario (3.000 M€) per modernizzare la rete con Condensatori Sincroni e batterie BESS.' };
      case 'de': return { title: 'Wertvernichtungsprüfung (Erstes Jahr nach dem Blackout)', desc: 'Kumulative finanzielle Auswirkungen in Millionen Euro (M€).', insightLabel: 'Analytischer Einblick:', insightText: 'Der <em>toxische OPEX</em> des "Verstärkten Betriebs" (-711 M€) entspricht jährlich fast 25% des gesamten strukturellen <em>CAPEX</em> (3.000 M€), der erforderlich ist, um das Netz mit Synchrongeneratoren und BESS-Batterien zu modernisieren.' };
      default: return { title: 'Auditoría de Destrucción de Valor (Primer Año Post-Apagón)', desc: 'Impacto financiero acumulativo en Millones de Euros (M€).', insightLabel: 'Insight Analítico:', insightText: 'El <em>OPEX tóxico</em> de la "Operación Reforzada" (-711 M€) equivale anualmente a quemar casi el 25% de todo el <em>CAPEX</em> estructural necesario (3.000 M€) para modernizar la red mediante Condensadores Síncronos y baterías BESS.' };
    }
  };
  const strings = getStrings(lang);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{strings.title}</h3>
        <p>{strings.desc}</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart
            data={data}
            margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
            accessibilityLayer={true}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis 
              tickFormatter={(val) => `${val} M€`}
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 2500]}
              ticks={[0, 500, 1000, 1500, 2000, 2500]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} isAnimationActive={false} />
            
            {/* Línea conectora tipo Waterfall (stepAfter) usando el límite superior de cada barra */}
            <Line 
              type="stepAfter" 
              dataKey={(d) => d.value[1]} 
              stroke="var(--ifm-color-emphasis-500)" 
              strokeDasharray="4 4" 
              strokeWidth={2} 
              dot={false} 
              activeDot={false} 
              isAnimationActive={true}
              animationDuration={1000}
            />

            <Bar dataKey="value" radius={[4, 4, 4, 4]} isAnimationActive={true} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" content={(props) => renderCustomizedLabel(props, data)} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.footerInfo}>
        <p><strong>{strings.insightLabel}</strong> <span dangerouslySetInnerHTML={{__html: strings.insightText}} /></p>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\FinancialWaterfallChart.module.css`
```css
.container {
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: var(--ifm-background-surface-color, #1b1b1d);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--ifm-color-emphasis-200);
}

.header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--ifm-color-primary);
}

.header p {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  color: var(--ifm-font-color-base);
  opacity: 0.8;
}

.chartWrapper {
  width: 100%;
  height: 450px;
}

.customTooltip {
  background-color: var(--ifm-background-surface-color, #242526);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1.2rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  min-width: 280px;
  max-width: 350px;
}

.tooltipTitle {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--ifm-font-color-base);
  font-weight: 700;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  padding-bottom: 0.5rem;
}

.tooltipAmount {
  margin: 0.5rem 0;
  font-size: 1.4rem;
}

.tooltipDesc {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ifm-font-color-base);
  opacity: 0.8;
  line-height: 1.4;
}

.footerInfo {
  margin-top: 1rem;
  padding: 1rem;
  background-color: rgba(var(--ifm-color-primary-dark), 0.1);
  border-left: 4px solid var(--ifm-color-primary);
  border-radius: 4px;
}

.footerInfo p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--ifm-font-color-base);
}

```

### 📄 Archivo: `src\components\ForensicReveal\index.js`
```js
import React, { useRef, useState, useEffect } from 'react';
import { useInView, motion } from 'framer-motion';
import styles from './styles.module.css';

// Forensic characters (more professional/documentary style)
const CHARSET = '█▓▒░0123456789X';

const getRandomChar = () => CHARSET[Math.floor(Math.random() * CHARSET.length)];

export default function ForensicReveal({ children, className }) {
  // Safely extract string from children
  const text = React.Children.toArray(children).join('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isInView || started || !text) return;

    setStarted(true);
    const finalChars = text.split('');
    const revealed = new Array(finalChars.length).fill(false);
    let revealIndex = 0;
    const REVEAL_STAGGER = 30; // Faster reveal
    const SCRAMBLE_TICK = 50;

    const scrambleInterval = setInterval(() => {
      setDisplayText(
        finalChars
          .map((char, i) => {
            if (revealed[i]) return char;
            return char === ' ' ? ' ' : getRandomChar();
          })
          .join('')
      );
    }, SCRAMBLE_TICK);

    const revealNext = () => {
      if (revealIndex < finalChars.length) {
        revealed[revealIndex] = true;
        revealIndex++;
        // Reveal up to 3 chars at once to speed up long texts
        if (revealIndex < finalChars.length) {
          revealed[revealIndex] = true;
          revealIndex++;
        }
        setTimeout(revealNext, REVEAL_STAGGER);
      } else {
        clearInterval(scrambleInterval);
        setDisplayText(text);
        setIsFinished(true);
      }
    };

    const firstTimer = setTimeout(revealNext, 200); // Small initial delay

    return () => {
      clearInterval(scrambleInterval);
      clearTimeout(firstTimer);
    };
  }, [isInView, started, text]);

  // Initial render state
  if (!started && !isFinished) {
    return (
      <span ref={ref} className={`${styles.forensicText} ${styles.redacted} ${className || ''}`}>
        {text.replace(/[^\s]/g, '█')}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={`${styles.forensicText} ${isFinished ? styles.finished : ''} ${className || ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {displayText}
    </motion.span>
  );
}

```

### 📄 Archivo: `src\components\ForensicReveal\styles.module.css`
```css
.forensicText {
  font-family: 'Fira Code', 'Courier New', monospace;
  color: #f59e0b;                /* forensic amber */
  background-color: rgba(245, 158, 11, 0.1);
  padding: 0 4px;
  border-radius: 2px;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

html[data-theme='dark'] .forensicText {
  color: #fbbf24;
  background-color: rgba(251, 191, 36, 0.1);
}

.redacted {
  color: #1e293b;
  background-color: #1e293b;
  text-shadow: none;
}

html[data-theme='dark'] .redacted {
  color: #0f172a;
  background-color: #0f172a;
}

.finished {
  color: inherit;
  background-color: transparent;
  font-family: inherit;
  font-weight: bold;
}

```

### 📄 Archivo: `src\components\ForensicUI\Primitives.jsx`
```jsx
import React from 'react';
export function TelemetryMetadata({ title, source, timeBase, confidence }) {
  return (
    <div className="telemetry-metadata" aria-label={`Metadata: ${title}`}>
      <div className="telemetry-header">{title}</div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {source && <div>SOURCE: {source}</div>}
        {timeBase && <div>TIME BASE: {timeBase}</div>}
        {confidence && <div>CONFIDENCE: {confidence}</div>}
      </div>
    </div>
  );
}

export function ForensicTable({ title, source, timeBase, confidence, fullWidth, children }) {
  return (
    <div className={`telemetry-table-container forensic-table ${fullWidth ? 'table-full-width' : ''}`}>
      {(title || source) && (
        <TelemetryMetadata 
          title={title} 
          source={source} 
          timeBase={timeBase} 
          confidence={confidence} 
        />
      )}
      <div className="table-scroll-wrapper">
        {children}
      </div>
    </div>
  );
}

export function CriticalEventBlock({ timestamp, event, description }) {
  return (
    <div className="critical-event-block state-critical" style={{ padding: 'var(--space-md)', borderLeft: '4px solid var(--forensic-critical)', margin: 'var(--incident-spacing-md) 0' }}>
      <div style={{ fontFamily: 'var(--telemetry-font)', color: 'var(--forensic-critical)', marginBottom: 'var(--space-xs)' }}>
        [ {timestamp} ] {event}
      </div>
      <div style={{ color: 'var(--forensic-text-primary)' }}>
        {description}
      </div>
    </div>
  );
}

export function IncidentDivider() {
  return (
    <hr style={{ 
      border: 'none', 
      borderTop: '1px dashed var(--telemetry-border)', 
      margin: 'var(--incident-spacing-lg) 0',
      opacity: 0.5
    }} />
  );
}

export function ForensicFigure({ src, alt, caption, source }) {
  return (
    <figure className="forensic-figure" style={{ margin: 'var(--incident-spacing-md) 0', border: '1px solid var(--telemetry-border)', borderRadius: 'var(--scada-radius)', overflow: 'hidden' }}>
      <img src={src} alt={alt} style={{ width: '100%', display: 'block' }} loading="lazy" />
      <figcaption style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--forensic-bg-secondary)', borderTop: '1px solid var(--telemetry-border)', fontSize: 'var(--telemetry-sm)', fontFamily: 'var(--telemetry-font)', color: 'var(--forensic-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
        <span>{caption}</span>
        {source && <span style={{ opacity: 0.7 }}>SRC: {source}</span>}
      </figcaption>
    </figure>
  );
}


```

### 📄 Archivo: `src\components\ForensicUI\TelemetryFallback.jsx`
```jsx
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function TelemetryFallback() {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  
  const T = {
    es: "CARGANDO DATOS DE TELEMETRÍA...",
    en: "LOADING TELEMETRY DATA...",
    pt: "CARREGANDO DADOS DE TELEMETRIA...",
    fr: "CHARGEMENT DES DONNÉES TÉLÉMÉTRIQUES...",
    it: "CARICAMENTO DATI DI TELEMETRIA...",
    de: "LADEN DER TELEMETRIEDATEN..."
  };
  
  const text = T[currentLocale] || T.en;
  return (
    <div style={{ minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--forensic-bg)' }}>
      <div style={{ width: '80%', height: '40px', background: 'var(--telemetry-soft)', marginBottom: '20px', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ width: '100%', height: '400px', background: 'rgba(255,170,0,0.05)', marginBottom: '20px', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ width: '100%', height: '200px', background: 'rgba(255,170,0,0.05)', borderRadius: 'var(--scada-radius)' }}></div>
      <div style={{ marginTop: '20px', color: 'var(--forensic-amber)', fontFamily: 'monospace', letterSpacing: '2px', opacity: 0.5 }}>
        {text}
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\FrequencyChart.jsx`
```jsx
import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { LineChart, Line, ReferenceLine, YAxis, XAxis, ResponsiveContainer } from 'recharts';
import styles from './FrequencyChart.module.css';
import { timelineData } from '../data/forensicData';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Filtramos el 0.0 Hz porque distorsiona el gráfico que queremos mostrar (caída hasta 46 Hz)
const validTimelineData = timelineData.filter(d => d.frecuencia > 0);

const getSteps = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { stepIndex: 0, title: t('12:32:57 — El detonante', '12:32:57 — The Trigger', '12:32:57 — O Gatilho', '12:32:57 — Le Déclencheur', '12:32:57 — L\'Innesco', '12:32:57 — Der Auslöser'), text: t('Un transformador de 400/220 kV en Granada se desconecta por sobretensión, eliminando bruscamente 165 MVAr de capacidad de absorción de reactiva inductiva.', 'A 400/220 kV transformer in Granada disconnects due to overvoltage, abruptly eliminating 165 MVAr of inductive reactive absorption capacity.', 'Um transformador de 400/220 kV em Granada desconecta devido a sobretensão, eliminando abruptamente 165 MVAr de capacidade de absorção reativa indutiva.', 'Un transformateur de 400/220 kV à Grenade se déconnecte pour cause de surtension, éliminant brusquement 165 MVAr de capacité d\'absorption réactive inductive.', 'Un trasformatore da 400/220 kV a Granada si disconnette per sovratensione, eliminando bruscamente 165 MVAr di capacità di assorbimento reattivo induttivo.', 'Ein 400/220-kV-Transformator in Granada schaltet wegen Überspannung ab und eliminiert schlagartig 165 MVAr induktive Blindleistungsaufnahmekapazität.'), visibleUntilT: 0 },
    { stepIndex: 1, title: t('12:33:15 — Sobretensión latente', '12:33:15 — Latent Overvoltage', '12:33:15 — Sobretensão Latente', '12:33:15 — Surtension Latente', '12:33:15 — Sovratensione Latente', '12:33:15 — Latente Überspannung'), text: t('La tensión se eleva a lo largo de la red de 400 kV por efecto Ferranti (red capacitiva descargada de flujos de potencia). Se produce el fenómeno Tap-Lag en los transformadores.', 'Voltage rises across the 400 kV grid due to the Ferranti effect (capacitive grid unloaded from power flows). The Tap-Lag phenomenon occurs in transformers.', 'A tensão sobe ao longo da rede de 400 kV pelo efeito Ferranti. Ocorre o fenômeno Tap-Lag nos transformadores.', 'La tension augmente sur le réseau 400 kV en raison de l\'effet Ferranti. Le phénomène Tap-Lag se produit dans les transformateurs.', 'La tensione sale lungo la rete a 400 kV per effetto Ferranti. Si verifica il fenomeno Tap-Lag nei trasformatori.', 'Die Spannung im 400-kV-Netz steigt durch den Ferranti-Effekt. Das Tap-Lag-Phänomen tritt in Transformatoren auf.'), visibleUntilT: 18 },
    { stepIndex: 2, title: t('12:33:18 — Inicio de la cascada', '12:33:18 — Cascade Initiation', '12:33:18 — Início da Cascata', '12:33:18 — Début de la Cascade', '12:33:18 — Inizio della Cascata', '12:33:18 — Kaskadenbeginn'), text: t('Las plantas renovables perciben voltajes extremos (>1,2 p.u.) en los nudos colectores. Se superan los umbrales de autoprotección High Voltage Ride-Through. Caen Badajoz y Sevilla.', 'Renewable plants perceive extreme voltages (>1.2 p.u.) at collector nodes. High Voltage Ride-Through self-protection thresholds are exceeded. Badajoz and Seville drop.', 'As usinas renováveis percebem tensões extremas nos nós coletores. Caem Badajoz e Sevilha.', 'Les centrales renouvelables perçoivent des tensions extrêmes aux nœuds collecteurs. Badajoz et Séville tombent.', 'Gli impianti rinnovabili percepiscono tensioni estreme ai nodi collettori. Cadono Badajoz e Siviglia.', 'Erneuerbare-Energien-Anlagen nehmen extreme Spannungen an Netzknoten wahr. Badajoz und Sevilla fallen aus.'), visibleUntilT: 21 },
    { stepIndex: 3, title: t('12:33:20 — Caída libre inercial', '12:33:20 — Inertial Freefall', '12:33:20 — Queda Livre Inercial', '12:33:20 — Chute Libre Inertielle', '12:33:20 — Caduta Libera Inerziale', '12:33:20 — Trägheitsfreier Fall'), text: t('Tras la pérdida de 15 GW de generación activa, la frecuencia comienza a desplomarse. El RoCoF extremo provoca que relés internos de más inversores disparen, acelerando la espiral.', 'After losing 15 GW of active generation, the frequency starts to plummet. The extreme RoCoF causes more inverter internal relays to trip, accelerating the spiral.', 'Após a perda de 15 GW de geração ativa, a frequência começa a despencar.', 'Après la perte de 15 GW de production active, la fréquence commence à chuter.', 'Dopo la perdita di 15 GW di generazione attiva, la frequenza inizia a crollare.', 'Nach dem Verlust von 15 GW aktiver Erzeugung beginnt die Frequenz abzustürzen.'), visibleUntilT: 23 },
    { stepIndex: 4, title: t('12:33:21 — Aislamiento europeo', '12:33:21 — European Isolation', '12:33:21 — Isolamento Europeu', '12:33:21 — Isolement Européen', '12:33:21 — Isolamento Europeo', '12:33:21 — Europäische Isolation'), text: t('Para proteger el sistema síncrono continental, las protecciones de pérdida de sincronismo abren las líneas de interconexión con Francia a los 48,46 Hz. La península se convierte en una isla eléctrica.', 'To protect the continental synchronous system, loss-of-synchronism protections open interconnection lines with France at 48.46 Hz. The peninsula becomes an electrical island.', 'Para proteger o sistema síncrono continental, as proteções abrem as linhas de interconexão com a França.', 'Pour protéger le système synchrone continental, les protections ouvrent les lignes d\'interconnexion avec la France.', 'Per proteggere il sistema sincrono continentale, le protezioni aprono le linee di interconnessione con la Francia.', 'Um das kontinentale Synchronsystem zu schützen, öffnen Schutzvorrichtungen die Verbindungsleitungen mit Frankreich.'), visibleUntilT: 24 },
    { stepIndex: 5, title: t('12:33:23 — Colapso y paradoja UFLS', '12:33:23 — Collapse & UFLS Paradox', '12:33:23 — Colapso e Paradoxo UFLS', '12:33:23 — Effondrement et Paradoxe UFLS', '12:33:23 — Collasso e Paradosso UFLS', '12:33:23 — Kollaps & UFLS-Paradoxon'), text: t('El UFLS deslastra 10 GW de bombeo y demanda industrial. Paradójicamente, esto agrava la sobretensión al eliminar consumo inductivo. Segundos después, la central nuclear sufre SCRAM. Es el cero absoluto.', 'The UFLS sheds 10 GW of pumping and industrial demand. Paradoxically, this aggravates the overvoltage by removing inductive consumption. Seconds later, the nuclear plant suffers SCRAM. Absolute zero.', 'O UFLS corta 10 GW de bombeamento e demanda industrial. A usina nuclear sofre SCRAM. É o zero absoluto.', 'L\'UFLS décharge 10 GW de pompage et de demande industrielle. La centrale nucléaire subit un SCRAM.', 'L\'UFLS scarica 10 GW di pompaggio e domanda industriale. La centrale nucleare subisce uno SCRAM.', 'Das UFLS wirft 10 GW Pump- und Industrienachfrage ab. Das Kernkraftwerk erleidet einen SCRAM. Absoluter Nullpunkt.'), visibleUntilT: 26 }
  ];
};
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function FrequencyChartScrolly({ isGallery = false, lang }) {
  const { i18n } = useDocusaurusContext();
  const currentLang = lang || i18n.currentLocale || 'es';

  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive visualization...';
      case 'pt': return 'Carregando visualização interativa...';
      case 'fr': return 'Chargement de la visualisation interactive...';
      case 'it': return 'Caricamento della visualizzazione interattiva...';
      case 'de': return 'Interaktive Visualisierung wird geladen...';
      default: return 'Cargando visualización interactiva...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(currentLang)}</div>}>
      {() => <FrequencyChartScrollyContent isGallery={isGallery} lang={currentLang} />}
    </BrowserOnly>
  );
}

function FrequencyChartScrollyContent({ isGallery, lang }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const STEPS = getSteps(lang);
  const currentStep = STEPS[currentStepIndex] || STEPS[0];
  const visibleData = validTimelineData.filter(d => d.tiempoS <= currentStep.visibleUntilT);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { xaxis: 'Seconds from trigger', ufls: 'UFLS (49.5 Hz)', iso: 'FR Isolation', dyn: 'Collapse dynamics in 11 critical seconds.' };
      case 'pt': return { xaxis: 'Segundos desde o gatilho', ufls: 'UFLS (49.5 Hz)', iso: 'Isolamento FR', dyn: 'Dinâmica de colapso em 11 segundos críticos.' };
      case 'fr': return { xaxis: 'Secondes depuis le déclencheur', ufls: 'UFLS (49.5 Hz)', iso: 'Isolement FR', dyn: 'Dynamique d\'effondrement en 11 secondes critiques.' };
      case 'it': return { xaxis: 'Secondi dall\'innesco', ufls: 'UFLS (49.5 Hz)', iso: 'Isolamento FR', dyn: 'Dinamica di collasso in 11 secondi critici.' };
      case 'de': return { xaxis: 'Sekunden seit Auslöser', ufls: 'UFLS (49.5 Hz)', iso: 'FR-Isolation', dyn: 'Kollapsdynamik in 11 kritischen Sekunden.' };
      default: return { xaxis: 'Segundos desde el detonante', ufls: 'UFLS (49.5 Hz)', iso: 'Aislamiento FR', dyn: 'Dinámica de colapso en 11 segundos críticos.' };
    }
  };
  const strings = getStrings(lang);

  if (isGallery) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
        <div style={{ height: '400px', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: strings.xaxis, position: 'insideBottom', offset: -10 }} />
              <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
              <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: strings.ufls}} />
              <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: strings.iso}} />
              <Line type="stepAfter" dataKey="frecuencia" stroke="#FF4D4D" strokeWidth={5} isAnimationActive={false} dot={{ r: 5, fill: 'var(--ifm-background-surface-color)', stroke: '#FF4D4D', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {STEPS.map((s) => (
              <button 
                key={s.stepIndex}
                onClick={() => setCurrentStepIndex(s.stepIndex)}
                style={{
                  position: 'relative',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  border: '1px solid transparent',
                  borderLeft: currentStepIndex === s.stepIndex ? '3px solid var(--ifm-color-primary)' : '3px solid transparent',
                  backgroundColor: currentStepIndex === s.stepIndex ? 'color-mix(in srgb, var(--ifm-color-primary) 15%, transparent)' : 'transparent',
                  color: currentStepIndex === s.stepIndex ? 'var(--ifm-color-primary)' : 'var(--ifm-font-color-base)',
                  cursor: 'pointer',
                  fontWeight: currentStepIndex === s.stepIndex ? 'bold' : 'normal',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: currentStepIndex === s.stepIndex ? 'inset 200px 0 0 0 color-mix(in srgb, var(--ifm-color-primary) 5%, transparent)' : 'none'
                }}
              >
              {s.title.split(' — ')[0]}
            </button>
          ))}
        </div>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', minHeight: '80px' }}>
          <h4 style={{ color: 'var(--ifm-color-primary)', margin: '0 0 10px 0' }}>{currentStep.title}</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{currentStep.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollyWrapper} style={{ position: 'relative', margin: '2rem 0' }}>
        
        {/* Gráfica fija (sticky) a la derecha */}
        <div style={{ position: 'sticky', top: '100px', height: '65vh', width: '55%', float: 'right', zIndex: 10 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ifm-color-primary)' }}>{currentStep.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>{strings.dyn}</p>
          </div>
          <div style={{ height: 'calc(100% - 60px)', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: strings.xaxis, position: 'insideBottom', offset: -10 }} />
                <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
                <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: strings.ufls}} />
                <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: strings.iso}} />
                <Line type="stepAfter" dataKey="frecuencia" stroke="#FF4D4D" strokeWidth={5} isAnimationActive={true} animationDuration={600} dot={{ r: 5, fill: 'var(--ifm-background-surface-color)', stroke: '#FF4D4D', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Textos que desencadenan el scroll a la izquierda */}
        <div style={{ width: '40%', position: 'relative', zIndex: 5 }}>
          <Scrollama onStepEnter={({ data }) => setCurrentStepIndex(data)} offset={0.5}>
            {STEPS.map((s) => (
              <Step data={s.stepIndex} key={s.stepIndex}>
                <div style={{ 
                  margin: '50vh 0', 
                  padding: '2rem', 
                  backgroundColor: 'var(--ifm-background-surface-color)', 
                  border: currentStepIndex === s.stepIndex ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-200)',
                  borderRadius: '8px',
                  boxShadow: currentStepIndex === s.stepIndex ? '0 8px 30px rgba(0,0,0,0.1)' : 'none',
                  opacity: currentStepIndex === s.stepIndex ? 1 : 0.3,
                  transform: currentStepIndex === s.stepIndex ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <h4 style={{ color: 'var(--ifm-color-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{s.text}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
        
        <div style={{ clear: 'both' }}></div>
      </div>
  );
}

```

### 📄 Archivo: `src\components\FrequencyChart.module.css`
```css
.wrapper {
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--ifm-color-emphasis-200);
  background: var(--ifm-background-surface-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-family: var(--ifm-font-family-base);
}

html[data-theme='dark'] .wrapper {
  border-color: rgba(255,255,255,0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  background: var(--ifm-color-emphasis-50);
}

html[data-theme='dark'] .header {
  border-bottom-color: rgba(255,255,255,0.1);
  background: rgba(15, 23, 42, 0.8);
}

.header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--ifm-color-primary);
}

.header p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--ifm-color-emphasis-600);
}

.chartContainer {
  height: 400px;
  width: 100%;
  padding: 1rem 1rem 1rem 0;
}

/* Tooltip Customization */
.tooltipContainer {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 180px;
}

html[data-theme='dark'] .tooltipContainer {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.tooltipCritical {
  border-left: 4px solid #ef4444 !important;
}

.tooltipTime {
  margin: 0 0 6px 0;
  font-size: 0.85rem;
  color: var(--ifm-color-emphasis-600);
  font-family: var(--ifm-font-family-monospace);
}

.tooltipFreq {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--ifm-color-emphasis-900);
}

html[data-theme='dark'] .tooltipFreq {
  color: #fff;
}

.tooltipFreq strong {
  color: var(--ifm-color-primary);
}

.tooltipCritical .tooltipFreq strong {
  color: #ef4444;
}

.tooltipNotes {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--ifm-color-emphasis-200);
}

html[data-theme='dark'] .tooltipNotes {
  border-top-color: rgba(255,255,255,0.1);
}

.badge {
  display: inline-block;
  background: var(--ifm-color-primary-lightest);
  color: var(--ifm-color-primary-darkest);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

html[data-theme='dark'] .badge {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

```

### 📄 Archivo: `src\components\GenerationMixWidget\GenerationMixWidget.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from '../ForensicUI/TelemetryFallback';

const GenerationMixWidgetBase = React.lazy(() => import('./GenerationMixWidgetBase'));

export default function GenerationMixWidget(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <GenerationMixWidgetBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\GenerationMixWidget\GenerationMixWidget.module.css`
```css
.container {
  padding: var(--space-xl);
  background: var(--forensic-bg-primary);
  border: 1px solid var(--forensic-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2xl);
  font-family: var(--font-body);
  box-shadow: inset 0 0 40px var(--forensic-amber-bg-subtle);
}

.header {
  border-bottom: 1px solid var(--forensic-border);
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-lg);
}

.title {
  color: var(--forensic-text-primary);
  margin-bottom: var(--space-sm);
  font-size: var(--telemetry-lg);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: var(--telemetry-font);
  font-weight: normal;
}

.subtitle {
  color: var(--forensic-text-secondary);
  font-size: var(--telemetry-sm);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: var(--telemetry-font);
}

.content {
  display: flex;
  gap: 40px;
  align-items: center;
}

.chartContainer {
  flex: 1;
  min-width: 300px;
}

.statsContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.statBox {
  background: var(--forensic-bg-surface);
  border: 1px solid var(--forensic-border);
  border-left: 3px solid var(--forensic-amber-primary);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  font-family: var(--telemetry-font);
}

.statLabel {
  color: var(--forensic-text-secondary);
  font-size: var(--telemetry-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: var(--space-sm);
}

.statValue {
  color: var(--forensic-amber-primary);
  font-size: var(--telemetry-display);
  font-weight: 700;
  margin-bottom: var(--space-xs);
}

.statValue.critical {
  color: var(--forensic-amber-critical);
  animation: pulse 2s infinite;
}

.statValue.warning {
  color: var(--forensic-amber-warning);
}

.statSub {
  color: var(--forensic-text-dim);
  font-size: var(--telemetry-xs);
  font-style: italic;
}

.errorBox {
  color: var(--forensic-amber-critical);
  font-family: var(--telemetry-font);
  text-align: center;
  border: 1px solid var(--forensic-amber-critical);
  padding: var(--space-lg);
  background-color: var(--forensic-amber-bg-subtle);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
  .content {
    flex-direction: column;
    gap: 20px;
  }
  .chartContainer {
    width: 100%;
  }
}

```

### 📄 Archivo: `src\components\GenerationMixWidget\GenerationMixWidgetBase.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './GenerationMixWidget.module.css';

const GenerationMixWidget = () => {
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/generation_mix_28A.json');

  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      error: "ERROR CRÍTICO: DATOS DE GENERACIÓN OFFLINE",
      loading: "Cargando...",
      title: "MIX DE GENERACIÓN Y DÉFICIT DE INERCIA",
      subtitle: "12:30 CEST — Estado Pre-Colapso",
      renPen: "PENETRACIÓN RENOVABLE",
      ibr: "Recursos basados en inversores (IBR)",
      inertia: "INERCIA DEL SISTEMA (H)",
      criticalLow: "Críticamente Baja (Seguro > 4.5s)",
      degrad: "DEGRADACIÓN DE INERCIA",
      compared: "Comparado con el promedio histórico de primavera"
    },
    en: {
      error: "CRITICAL ERROR: GENERATION MIX DATA OFFLINE",
      loading: "Loading...",
      title: "GENERATION MIX & INERTIA DEFICIT",
      subtitle: "12:30 CEST — Pre-Collapse State",
      renPen: "RENEWABLE PENETRATION",
      ibr: "Inverter-Based Resources (IBR)",
      inertia: "SYSTEM INERTIA (H)",
      criticalLow: "Critically Low (Safe > 4.5s)",
      degrad: "INERTIA DEGRADATION",
      compared: "Compared to historical spring avg"
    },
    pt: {
      error: "ERRO CRÍTICO: DADOS DE GERAÇÃO OFFLINE",
      loading: "Carregando...",
      title: "MIX DE GERAÇÃO E DÉFICIT DE INÉRCIA",
      subtitle: "12:30 CEST — Estado Pré-Colapso",
      renPen: "PENETRAÇÃO RENOVÁVEL",
      ibr: "Recursos Baseados em Inversores (IBR)",
      inertia: "INÉRCIA DO SISTEMA (H)",
      criticalLow: "Criticamente Baixa (Seguro > 4.5s)",
      degrad: "DEGRADAÇÃO DE INÉRCIA",
      compared: "Comparado à média histórica de primavera"
    },
    fr: {
      error: "ERREUR CRITIQUE : DONNÉES DE GÉNÉRATION HORS LIGNE",
      loading: "Chargement...",
      title: "MIX DE GÉNÉRATION ET DÉFICIT D'INERTIE",
      subtitle: "12:30 CEST — État Pré-Effondrement",
      renPen: "PÉNÉTRATION RENOUVELABLE",
      ibr: "Ressources basées sur des onduleurs (IBR)",
      inertia: "INERTIE DU SYSTÈME (H)",
      criticalLow: "Critiquement Faible (Sûr > 4.5s)",
      degrad: "DÉGRADATION D'INERTIE",
      compared: "Par rapport à la moyenne historique du printemps"
    },
    it: {
      error: "ERRORE CRITICO: DATI DI GENERAZIONE OFFLINE",
      loading: "Caricamento...",
      title: "MIX DI GENERAZIONE E DEFICIT DI INERZIA",
      subtitle: "12:30 CEST — Stato Pre-Collasso",
      renPen: "PENETRAZIONE RINNOVABILE",
      ibr: "Risorse basate su inverter (IBR)",
      inertia: "INERZIA DEL SISTEMA (H)",
      criticalLow: "Criticamente Bassa (Sicuro > 4.5s)",
      degrad: "DEGRADO DELL'INERZIA",
      compared: "Rispetto alla media storica primaverile"
    },
    de: {
      error: "KRITISCHER FEHLER: ERZEUGUNGSDATEN OFFLINE",
      loading: "Wird geladen...",
      title: "ERZEUGUNGSMIX & TRÄGHEITSDEFIZIT",
      subtitle: "12:30 CEST — Zustand vor dem Kollaps",
      renPen: "ERNEUERBARE DURCHDRINGUNG",
      ibr: "Wechselrichterbasierte Ressourcen (IBR)",
      inertia: "SYSTEMTRÄGHEIT (H)",
      criticalLow: "Kritisch Niedrig (Sicher > 4,5s)",
      degrad: "TRÄGHEITSDEGRADATION",
      compared: "Im Vergleich zum historischen Frühlingsdurchschnitt"
    }
  };

  const t = T[currentLocale] || T.en;

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading generation mix data:', err);
        setHasError(true);
      });
  }, [dataUrl]);

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.errorBox}>
          <h3>{t.error}</h3>
        </div>
      </div>
    );
  }

  if (!data) return <div className={styles.container}>{t.loading}</div>;

  const chartData = data.generation_mix.map(item => ({
    name: item.technology.split(' (')[0], // Simplify names
    value: item.capacity_mw,
    inertia: item.inertia_constant_h_seconds,
    type: item.grid_interaction_type.includes('inverters') ? 'ibr' : 'sync'
  }));

  // Forensic Amber Palette using CSS variables
  const COLORS = {
    ibr: ['var(--forensic-amber-warning)', 'var(--forensic-amber-primary)'],
    sync: ['var(--forensic-sync-1)', 'var(--forensic-sync-2)', 'var(--forensic-sync-3)']
  };

  let ibrCount = 0;
  let syncCount = 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t.title}</h3>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => {
                  const colorList = entry.type === 'ibr' ? COLORS.ibr : COLORS.sync;
                  const colorIndex = entry.type === 'ibr' ? ibrCount++ : syncCount++;
                  return <Cell key={`cell-${index}`} fill={colorList[colorIndex % colorList.length]} />;
                })}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--telemetry-font)' }}
                itemStyle={{ color: 'var(--forensic-amber-primary)' }}
                formatter={(value, name, props) => [`${value} MW (H=${props.payload.inertia}s)`, name]}
              />
              <Legend wrapperStyle={{ fontFamily: 'var(--telemetry-font)', fontSize: 'var(--telemetry-xs)', color: 'var(--forensic-text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.renPen}</div>
            <div className={styles.statValue}>{data.renewable_penetration_percent}%</div>
            <div className={styles.statSub}>{t.ibr}</div>
          </div>
          
          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.inertia}</div>
            <div className={`${styles.statValue} ${styles.critical}`}>{data.equivalent_system_inertia_h_weighted}s</div>
            <div className={styles.statSub}>{t.criticalLow}</div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statLabel}>{t.degrad}</div>
            <div className={`${styles.statValue} ${styles.warning}`}>-{data.inertia_degradation_percent}%</div>
            <div className={styles.statSub}>{t.compared}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerationMixWidget;

```

### 📄 Archivo: `src\components\GlitchTitle.jsx`
```jsx
import React, { useRef } from 'react';
import { useInView } from 'framer-motion';
import styles from './GlitchTitle.module.css';

export default function GlitchTitle({ children, as: Tag = 'h1', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <Tag ref={ref}
         className={`${styles.glitch} ${inView ? styles.run : ''} ${className}`}
         data-text={typeof children === 'string' ? children : ''}>
      {children}
    </Tag>
  );
}

```

### 📄 Archivo: `src\components\GlitchTitle.module.css`
```css
.glitch { position: relative; display: inline-block; color: var(--text-0); }
.glitch::before, .glitch::after {
  content: attr(data-text); position: absolute; inset: 0;
  opacity: 0; pointer-events: none;
}
.glitch.run::before {
  animation: g-cyan 1500ms ease-out 1;
  color: hsl(190 100% 60%); text-shadow: 1px 0 hsl(190 100% 60%);
  mix-blend-mode: screen;
}
.glitch.run::after {
  animation: g-magenta 1500ms ease-out 1;
  color: hsl(340 100% 60%); text-shadow: -1px 0 hsl(340 100% 60%);
  mix-blend-mode: screen;
}
@keyframes g-cyan {
  0%,100% { opacity: 0; transform: translate(0); clip-path: inset(0 0 100% 0); }
  20% { opacity: 1; transform: translate(-2px, 1px); clip-path: inset(10% 0 60% 0); }
  40% { opacity: 1; transform: translate(2px, -1px); clip-path: inset(40% 0 30% 0); }
  60% { opacity: 0.6; clip-path: inset(60% 0 20% 0); }
  80% { opacity: 0; }
}
@keyframes g-magenta {
  0%,100% { opacity: 0; transform: translate(0); }
  25% { opacity: 1; transform: translate(2px, -1px); }
  50% { opacity: 0.7; transform: translate(-2px, 1px); }
  75% { opacity: 0.4; }
}
@media (prefers-reduced-motion: reduce) {
  .glitch::before, .glitch::after { animation: none !important; }
}

```

### 📄 Archivo: `src\components\GlosarioTecnico.jsx`
```jsx
import React, { useState, useMemo } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './GlosarioTecnico.module.css';

import { GLOSSARY_TERMS as esTerms } from '../data/glossary';
import { GLOSSARY_TERMS as enTerms } from '../data/glossary_en';
import { GLOSSARY_TERMS as ptTerms } from '../data/glossary_pt';
import { GLOSSARY_TERMS as frTerms } from '../data/glossary_fr';
import { GLOSSARY_TERMS as itTerms } from '../data/glossary_it';
import { GLOSSARY_TERMS as deTerms } from '../data/glossary_de';

export default function GlosarioTecnico({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const lang = propLang || i18n.currentLocale || 'es';
  
  let GLOSSARY_TERMS = esTerms;
  if (lang === 'en') GLOSSARY_TERMS = enTerms;
  if (lang === 'pt') GLOSSARY_TERMS = ptTerms;
  if (lang === 'fr') GLOSSARY_TERMS = frTerms;
  if (lang === 'it') GLOSSARY_TERMS = itTerms;
  if (lang === 'de') GLOSSARY_TERMS = deTerms;
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return {
        searchPlaceholder: "Search term or definition...",
        noResults: "No terms found matching your search.",
        showing: "Showing",
        of: "of",
        terms: "terms",
        all: "All",
        reset: "Reset search",
        footer: "Last updated: May 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
      case 'pt': return {
        searchPlaceholder: "Pesquisar termo ou definição...",
        noResults: "Nenhum termo encontrado para sua busca.",
        showing: "Mostrando",
        of: "de",
        terms: "termos",
        all: "Todas",
        reset: "Reiniciar pesquisa",
        footer: "Última atualização: maio 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
      case 'fr': return {
        searchPlaceholder: "Rechercher un terme ou une définition...",
        noResults: "Aucun terme trouvé correspondant à votre recherche.",
        showing: "Affichage",
        of: "sur",
        terms: "termes",
        all: "Toutes",
        reset: "Réinitialiser la recherche",
        footer: "Dernière mise à jour : mai 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
      case 'it': return {
        searchPlaceholder: "Cerca termine o definizione...",
        noResults: "Nessun termine trovato per la ricerca.",
        showing: "Mostrando",
        of: "di",
        terms: "termini",
        all: "Tutte",
        reset: "Ripristina ricerca",
        footer: "Ultimo aggiornamento: maggio 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
      case 'de': return {
        searchPlaceholder: "Begriff oder Definition suchen...",
        noResults: "Keine Begriffe für Ihre Suche gefunden.",
        showing: "Zeige",
        of: "von",
        terms: "Begriffe",
        all: "Alle",
        reset: "Suche zurücksetzen",
        footer: "Letzte Aktualisierung: Mai 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
      default: return {
        searchPlaceholder: "Buscar término o definición...",
        noResults: "No se encontraron términos que coincidan con tu búsqueda.",
        showing: "Mostrando",
        of: "de",
        terms: "términos",
        all: "Todas",
        reset: "Reiniciar búsqueda",
        footer: "Última actualización: mayo 2026 — Alfonso Monge Díaz-Ángel, ETSI Universidad de Sevilla"
      };
    }
  };
  const strings = getStrings(lang);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Get unique letters
  const letters = useMemo(
    () => [...new Set(GLOSSARY_TERMS.map((t) => t.letter))].sort(),
    []
  );

  // Filter terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || term.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter]);

  // Group by letter
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.letter]) {
        groups[term.letter] = [];
      }
      groups[term.letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleLetterFilter = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  return (
    <div className={styles.glosarioContainer}>
      {/* Search Section */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder={strings.searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar en glosario"
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Letter Filter */}
      <div className={styles.letterFilter}>
        <button
          className={`${styles.letterButton} ${
            selectedLetter === null ? styles.active : ''
          }`}
          onClick={() => setSelectedLetter(null)}
        >
          {strings.all}
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`${styles.letterButton} ${
              selectedLetter === letter ? styles.active : ''
            }`}
            onClick={() => handleLetterFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        {strings.showing} {filteredTerms.length} {strings.of} {GLOSSARY_TERMS.length} {strings.terms}
      </div>

      {/* Terms Display */}
      {Object.keys(groupedTerms).length > 0 ? (
        <div className={styles.termsContainer}>
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => (
              <div key={letter} className={styles.letterGroup}>
                <h2 className={styles.letterHeader}>{letter}</h2>
                <div className={styles.termsList}>
                  {groupedTerms[letter].map((term) => (
                    <div key={term.id} id={term.id} className={styles.termItem}>
                      <h3 className={styles.termTitle}>
                        <a href={`#${term.id}`}>{term.term}</a>
                      </h3>
                      <p className={styles.termDefinition}>{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>{strings.noResults}</p>
          <button
            className={styles.resetButton}
            onClick={() => {
              setSearchTerm('');
              setSelectedLetter(null);
            }}
          >
            {strings.reset}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.glossaryFooter}>
        <p>
          <em>
            {strings.footer}
          </em>
        </p>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\GlosarioTecnico.module.css`
```css
.glosarioContainer {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

/* Search Section */
.searchSection {
  position: relative;
  margin-bottom: 2rem;
}

.searchInput {
  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.searchInput:focus {
  outline: none;
  border-color: #1e40af;
  box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
}

.searchInput::placeholder {
  color: #999;
}

.clearButton {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s ease;
}

.clearButton:hover {
  color: #dc2626;
}

/* Letter Filter */
.letterFilter {
  display: flex;
  gap: 8px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.letterButton {
  padding: 8px 14px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.letterButton:hover {
  border-color: #1e40af;
  color: #1e40af;
}

.letterButton.active {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
}

/* Results Info */
.resultsInfo {
  padding: 12px 16px;
  background-color: #f0f7ff;
  border-left: 4px solid #1e40af;
  border-radius: 4px;
  margin-bottom: 2rem;
  font-size: 14px;
  color: #0c3a8a;
}

/* Terms Container */
.termsContainer {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Letter Group */
.letterGroup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.letterHeader {
  font-size: 24px;
  font-weight: 700;
  color: #1e40af;
  margin: 0;
  padding: 12px 0;
  border-bottom: 2px solid #e0e0e0;
}

.termsList {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Term Item */
.termItem {
  padding: 16px;
  background-color: #fafafa;
  border-left: 4px solid #d0d0d0;
  border-radius: 4px;
  transition: all 0.2s ease;
  scroll-margin-top: 100px;
}

.termItem:hover {
  background-color: #f0f7ff;
  border-left-color: #1e40af;
  box-shadow: 0 2px 8px rgba(30, 64, 175, 0.1);
}

.termTitle {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.termTitle a {
  color: #1e40af;
  text-decoration: none;
  transition: color 0.2s ease;
}

.termTitle a:hover {
  color: #dc2626;
  text-decoration: underline;
}

.termDefinition {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #4b5563;
}

/* No Results */
.noResults {
  text-align: center;
  padding: 3rem 2rem;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  margin: 2rem 0;
}

.noResults p {
  font-size: 16px;
  color: #856404;
  margin: 0 0 1rem 0;
}

.resetButton {
  padding: 10px 20px;
  background-color: #ffc107;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: background-color 0.2s ease;
}

.resetButton:hover {
  background-color: #ffb300;
}

/* Glossary Footer */
.glossaryFooter {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.glossaryFooter p {
  margin: 0;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .glosarioContainer {
    color: #e0e0e0;
  }

  .searchInput {
    background-color: #2d2d2d;
    color: #e0e0e0;
    border-color: #444;
  }

  .searchInput:focus {
    border-color: #5b9cf9;
    box-shadow: 0 0 0 3px rgba(91, 156, 249, 0.2);
  }

  .letterButton {
    background-color: #2d2d2d;
    border-color: #444;
    color: #e0e0e0;
  }

  .letterButton.active {
    background-color: #1e40af;
    border-color: #1e40af;
  }

  .resultsInfo {
    background-color: #1a2a4a;
    color: #7db3f8;
    border-left-color: #5b9cf9;
  }

  .letterHeader {
    color: #5b9cf9;
    border-bottom-color: #444;
  }

  .termItem {
    background-color: #2d2d2d;
    border-left-color: #444;
  }

  .termItem:hover {
    background-color: #1a2a4a;
    border-left-color: #5b9cf9;
  }

  .termTitle {
    color: #e0e0e0;
  }

  .termTitle a {
    color: #5b9cf9;
  }

  .termTitle a:hover {
    color: #f87171;
  }

  .termDefinition {
    color: #b0b0b0;
  }

  .noResults {
    background-color: #3d3d00;
    border-color: #666600;
  }

  .noResults p {
    color: #ffff99;
  }

  .glossaryFooter {
    border-top-color: #444;
    color: #666;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .glosarioContainer {
    padding: 0 0.5rem;
  }

  .letterFilter {
    gap: 6px;
  }

  .letterButton {
    padding: 6px 10px;
    font-size: 12px;
  }

  .letterHeader {
    font-size: 20px;
  }

  .termTitle {
    font-size: 16px;
  }

  .termDefinition {
    font-size: 14px;
  }
}

/* Target Highlight Animation */
.termItem:target {
  animation: tech-highlight 5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
  border-left-color: rgba(14, 165, 233, 0.8);
}

@keyframes tech-highlight {
  0% {
    background-color: rgba(14, 165, 233, 0.3);
    box-shadow: 0 0 15px rgba(14, 165, 233, 0.3), inset 0 0 10px rgba(14, 165, 233, 0.1);
  }
  30% {
    background-color: rgba(14, 165, 233, 0.25);
    box-shadow: 0 0 12px rgba(14, 165, 233, 0.2);
  }
  60% {
    background-color: rgba(14, 165, 233, 0.15);
    box-shadow: 0 0 8px rgba(14, 165, 233, 0.1);
  }
  100% {
    background-color: transparent;
    box-shadow: 0 0 0 rgba(14, 165, 233, 0);
  }
}

html[data-theme='dark'] .termItem:target {
  animation: tech-highlight-dark 5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
  border-left-color: rgba(56, 189, 248, 0.8);
}

@media (prefers-color-scheme: dark) {
  .termItem:target {
    animation: tech-highlight-dark 5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
    border-left-color: rgba(56, 189, 248, 0.8);
  }
}

@keyframes tech-highlight-dark {
  0% {
    background-color: rgba(56, 189, 248, 0.3);
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3), inset 0 0 10px rgba(56, 189, 248, 0.2);
  }
  30% {
    background-color: rgba(56, 189, 248, 0.25);
    box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
  }
  60% {
    background-color: rgba(56, 189, 248, 0.15);
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.1);
  }
  100% {
    background-color: transparent;
    box-shadow: 0 0 0 rgba(56, 189, 248, 0);
  }
}

```

### 📄 Archivo: `src\components\GlossaryLink.jsx`
```jsx
import React from 'react';
import styles from './GlossaryLink.module.css';
import { slugify } from '../data/glossary';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * GlossaryLink — enlaza un término técnico al glosario con scroll exacto.
 * Uso: <GlossaryLink term="SCR" /> o <GlossaryLink term="SCR">Short Circuit Ratio</GlossaryLink>
 *
 * El atributo `term` debe coincidir exactamente con el campo `term` en GLOSSARY_TERMS.
 * Si el término tiene paréntesis u otros caracteres, asegúrate de que el slug coincide.
 */
export default function GlossaryLink({ term, children }) {
  const glossaryId = slugify(term);

  const baseUrl = useBaseUrl('/glosario');
  const targetUrl = `${baseUrl}#${glossaryId}`;

  // Usamos <a> nativo en lugar del Link de Docusaurus para garantizar
  // que el hash navigation funcione correctamente en SPA con scroll al ancla.
  const handleClick = (e) => {
    e.preventDefault();
    // Navegar a /glosario y luego hacer scroll al elemento
    const target = document.getElementById(glossaryId);
    if (target) {
      // Ya estamos en la página del glosario: solo scrollear
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Estamos en otra página: navegar al glosario con el hash
      window.location.href = targetUrl;
    }
  };

  return (
    <a
      href={targetUrl}
      className={styles.glossaryLink}
      title={`Click to view definition of: ${term}`}
      onClick={handleClick}
    >{children || term}</a>
  );
}

```

### 📄 Archivo: `src\components\GlossaryLink.module.css`
```css
﻿.glossaryLink {
  color: inherit;
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-color: rgba(14, 165, 233, 0.4);
  text-decoration-thickness: 1.5px;
  text-underline-offset: 3px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease-out;
  position: relative;
}

.glossaryLink:hover {
  text-decoration-color: rgba(14, 165, 233, 1);
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
  color: inherit;
  background-color: transparent;
  padding: 0;
  margin: 0;
  border: none;
}

.glossaryLink::after {
  content: ' ⊙';
  font-size: 0.75em;
  color: rgba(14, 165, 233, 0.6);
  vertical-align: super;
  transition: all 0.3s ease-out;
}

.glossaryLink:hover::after {
  color: rgba(14, 165, 233, 1);
  text-shadow: 0 0 8px rgba(14, 165, 233, 0.6);
}

.superscript {
  display: none;
}

html[data-theme='dark'] .glossaryLink {
  text-decoration-color: rgba(56, 189, 248, 0.3);
}

html[data-theme='dark'] .glossaryLink:hover {
  text-decoration-color: rgba(56, 189, 248, 0.9);
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

html[data-theme='dark'] .glossaryLink::after {
  color: rgba(56, 189, 248, 0.5);
}

html[data-theme='dark'] .glossaryLink:hover::after {
  color: rgba(56, 189, 248, 1);
}

```

### 📄 Archivo: `src\components\IberianGridTopology.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const IberianGridTopologyBase = React.lazy(() => import('./IberianGridTopologyBase'));

export default function IberianGridTopology(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <IberianGridTopologyBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\IberianGridTopologyBase.jsx`
```jsx
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const getGridData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return {
    nodes: [
      { id: 'GRN', name: t('Caparacena (Fallo Inicial)', 'Caparacena (Initial Failure)', 'Caparacena (Falha Inicial)', 'Caparacena (Défaillance Initiale)', 'Caparacena (Guasto Iniziale)', 'Caparacena (Anfänglicher Fehler)'), group: 1, val: 25, activeColor: '#ef4444', defaultColor: '#10b981', activationTime: 2, fx: 10, fy: 100 },
      { id: 'SEV', name: t('Alcores (Efecto Dominó Sur)', 'Alcores (South Domino Effect)', 'Alcores (Efeito Dominó Sul)', 'Alcores (Effet Domino Sud)', 'Alcores (Effetto Domino Sud)', 'Alcores (Südlicher Dominoeffekt)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4, fx: -40, fy: 80 },
      { id: 'BAD', name: t('Guillena (Colapso Tensión)', 'Guillena (Voltage Collapse)', 'Guillena (Colapso de Tensão)', 'Guillena (Effondrement de Tension)', 'Guillena (Collasso di Tensione)', 'Guillena (Spannungskollaps)'), group: 1, val: 15, activeColor: '#f97316', defaultColor: '#10b981', activationTime: 4, fx: -60, fy: 40 },
      { id: 'MAD', name: t('Madrid Morata (Contención)', 'Madrid Morata (Containment)', 'Madrid Morata (Contenção)', 'Madrid Morata (Confinement)', 'Madrid Morata (Contenimento)', 'Madrid Morata (Eindämmung)'), group: 2, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 0, fy: 0 },
      { id: 'ALM', name: t('C.N. Almaraz (Inercia Base)', 'C.N. Almaraz (Base Inertia)', 'C.N. Almaraz (Inércia Base)', 'C.N. Almaraz (Inertie de Base)', 'C.N. Almaraz (Inerzia di Base)', 'C.N. Almaraz (Basisträgheit)'), group: 2, val: 25, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: -50, fy: 0 },
      { id: 'ZAR', name: t('Aragón (Puente Norte)', 'Aragon (North Bridge)', 'Aragão (Ponte Norte)', 'Aragon (Pont Nord)', 'Aragona (Ponte Nord)', 'Aragonien (Nordbrücke)'), group: 3, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 50, fy: -50 },
      { id: 'BAR', name: t('Rubí (Resistencia Este)', 'Rubí (East Resistance)', 'Rubí (Resistência Leste)', 'Rubí (Résistance Est)', 'Rubí (Resistenza Est)', 'Rubí (Ost-Widerstand)'), group: 3, val: 20, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: 120, fy: -60 },
      { id: 'LIS', name: t('Lisboa (Desequilibrio)', 'Lisbon (Imbalance)', 'Lisboa (Desequilíbrio)', 'Lisbonne (Déséquilibre)', 'Lisbona (Squilibrio)', 'Lissabon (Ungleichgewicht)'), group: 4, val: 20, activeColor: '#f59e0b', defaultColor: '#10b981', activationTime: 6, fx: -120, fy: 30 },
      { id: 'POR', name: t('Porto (Compensación)', 'Porto (Compensation)', 'Porto (Compensação)', 'Porto (Compensation)', 'Porto (Compensazione)', 'Porto (Kompensation)'), group: 4, val: 15, activeColor: '#10b981', defaultColor: '#10b981', activationTime: 0, fx: -110, fy: -30 },
      { id: 'FR', name: t('Francia (Rescate Externo)', 'France (External Rescue)', 'França (Resgate Externo)', 'France (Sauvetage Externe)', 'Francia (Salvataggio Esterno)', 'Frankreich (Externe Rettung)'), group: 5, val: 30, activeColor: '#3b82f6', defaultColor: '#3b82f6', activationTime: 10, fx: 100, fy: -120 }
    ],
    links: [
      { source: 'GRN', target: 'SEV', isCritical: true, flow: t('Sobrecarga masiva', 'Massive overload', 'Sobrecarga massiva', 'Surcharge massive', 'Sovraccarico massiccio', 'Massive Überlastung'), activationTime: 2 },
      { source: 'SEV', target: 'BAD', isCritical: true, flow: t('Sobrecarga masiva', 'Massive overload', 'Sobrecarga massiva', 'Surcharge massive', 'Sovraccarico massiccio', 'Massive Überlastung'), activationTime: 4 },
      { source: 'BAD', target: 'LIS', isCritical: true, flow: t('Oscilaciones Inter-área (0.8Hz)', 'Inter-area oscillations (0.8Hz)', 'Oscilações interárea (0.8Hz)', 'Oscillations inter-zones (0.8Hz)', 'Oscillazioni inter-area (0.8Hz)', 'Inter-Area-Schwingungen (0.8Hz)'), activationTime: 6 },
      { source: 'LIS', target: 'POR', isCritical: false, activationTime: 0 },
      { source: 'BAD', target: 'ALM', isCritical: false, activationTime: 0 },
      { source: 'ALM', target: 'MAD', isCritical: false, activationTime: 0 },
      { source: 'MAD', target: 'ZAR', isCritical: false, activationTime: 0 },
      { source: 'ZAR', target: 'BAR', isCritical: false, activationTime: 0 },
      { source: 'ZAR', target: 'FR', isCritical: true, flow: t('Importación de emergencia (Subfrecuencia)', 'Emergency import (Underfrequency)', 'Importação de emergência (Subfrequência)', 'Importation d\'urgence (Sous-fréquence)', 'Importazione di emergenza (Sottofrequenza)', 'Notimport (Unterfrequenz)'), activationTime: 10 },
      { source: 'BAR', target: 'FR', isCritical: true, flow: t('Importación de emergencia (Subfrecuencia)', 'Emergency import (Underfrequency)', 'Importação de emergência (Subfrequência)', 'Importation d\'urgence (Sous-fréquence)', 'Importazione di emergenza (Sottofrequenza)', 'Notimport (Unterfrequenz)'), activationTime: 10 }
    ]
  };
};

const getEventLog = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { t: 0, msg: t("16:31:50 - Sistema Ibérico en estado estable. Operación nominal.", "16:31:50 - Iberian System in stable state. Nominal operation.", "16:31:50 - Sistema Ibérico em estado estável. Operação nominal.", "16:31:50 - Système ibérique à l'état stable. Fonctionnement nominal.", "16:31:50 - Sistema iberico in stato stabile. Funzionamento nominale.", "16:31:50 - Iberisches System in stabilem Zustand. Nennbetrieb.") },
    { t: 2, msg: t("16:32:00 - ¡DETONANTE! Cortocircuito doble en Caparacena (Granada). Pérdida brutal de reactiva.", "16:32:00 - TRIGGER! Double short circuit in Caparacena (Granada). Brutal loss of reactive power.", "16:32:00 - GATILHO! Curto-circuito duplo em Caparacena (Granada). Perda brutal de potência reativa.", "16:32:00 - DÉCLENCHEUR ! Double court-circuit à Caparacena (Grenade). Perte brutale de puissance réactive.", "16:32:00 - INNESCO! Doppio cortocircuito a Caparacena (Granada). Perdita brutale di potenza reattiva.", "16:32:00 - AUSLÖSER! Doppelter Kurzschluss in Caparacena (Granada). Brutaler Verlust an Blindleistung.") },
    { t: 4, msg: t("16:32:04 - Cae la tensión en el sur. El colapso se transfiere hacia Sevilla y Badajoz.", "16:32:04 - Voltage drops in the south. Collapse transfers towards Seville and Badajoz.", "16:32:04 - A tensão cai no sul. O colapso transfere-se para Sevilha e Badajoz.", "16:32:04 - La tension chute au sud. L'effondrement se transfère vers Séville et Badajoz.", "16:32:04 - La tensione scende nel sud. Il collasso si trasferisce verso Siviglia e Badajoz.", "16:32:04 - Die Spannung fällt im Süden. Der Kollaps verlagert sich nach Sevilla und Badajoz.") },
    { t: 6, msg: t("16:32:10 - ¡ALERTA INTER-ÁREA! Oscilaciones masivas de 0.8 Hz golpean la red de Portugal.", "16:32:10 - INTER-AREA ALERT! Massive 0.8 Hz oscillations hit the Portuguese grid.", "16:32:10 - ALERTA INTERÁREA! Oscilações massivas de 0.8 Hz atingem a rede de Portugal.", "16:32:10 - ALERTE INTER-ZONES ! Des oscillations massives de 0.8 Hz frappent le réseau du Portugal.", "16:32:10 - ALLARME INTER-AREA! Oscillazioni massicce di 0.8 Hz colpiscono la rete del Portogallo.", "16:32:10 - INTER-AREA-ALARM! Massive 0,8-Hz-Schwingungen treffen das portugiesische Netz.") },
    { t: 8, msg: t("16:32:15 - El centro (Madrid/Almaraz) absorbe el impacto gracias a la inercia de los alternadores.", "16:32:15 - The center (Madrid/Almaraz) absorbs the impact thanks to alternator inertia.", "16:32:15 - O centro (Madrid/Almaraz) absorve o impacto graças à inércia dos alternadores.", "16:32:15 - Le centre (Madrid/Almaraz) absorbe l'impact grâce à l'inertie des alternateurs.", "16:32:15 - Il centro (Madrid/Almaraz) assorbe l'impatto grazie all'inerzia degli alternatori.", "16:32:15 - Das Zentrum (Madrid/Almaraz) absorbiert den Aufprall dank der Trägheit der Generatoren.") },
    { t: 10, msg: t("16:32:20 - Desconexión inminente. Entra energía de rescate masiva desde Francia por los Pirineos.", "16:32:20 - Imminent disconnection. Massive rescue power enters from France via the Pyrenees.", "16:32:20 - Desconexão iminente. Entra energia de resgate massiva da França pelos Pirenéus.", "16:32:20 - Déconnexion imminente. De l'énergie de secours massive entre depuis la France par les Pyrénées.", "16:32:20 - Disconnessione imminente. Entra massiccia energia di soccorso dalla Francia attraverso i Pirenei.", "16:32:20 - Bevorstehende Trennung. Massive Rettungsenergie aus Frankreich über die Pyrenäen.") },
    { t: 12, msg: t("16:32:23 - Colapso contenido. El sistema sobrevive pero queda dividido y frágil.", "16:32:23 - Collapse contained. The system survives but remains divided and fragile.", "16:32:23 - Colapso contido. O sistema sobrevive, mas fica dividido e frágil.", "16:32:23 - Effondrement contenu. Le système survit mais reste divisé et fragile.", "16:32:23 - Collasso contenuto. Il sistema sopravvive ma rimane diviso e fragile.", "16:32:23 - Kollaps eingedämmst. Das System überlebt, bleibt aber geteilt und fragil.") }
  ];
};

function TopologyMapContent({ lang = 'es' }) {
  const GRID_DATA = useMemo(() => getGridData(lang), [lang]);
  const EVENT_LOG = useMemo(() => getEventLog(lang), [lang]);
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Topological Simulator', play: 'Play', pause: 'Pause', replay: 'Replay', desc: 'This graph models the grid using GNN. Hit <strong>Play</strong> to see the causal propagation of the collapse according to impedance flow.', zoomNote: '💡 Scroll mouse wheel to zoom in/out', loading: 'Loading Graph...' };
      case 'pt': return { title: 'Simulador Topológico', play: 'Iniciar', pause: 'Pausar', replay: 'Repetir', desc: 'Este grafo modela a rede usando GNN. Clique em <strong>Iniciar</strong> para ver a propagação causal do colapso segundo o fluxo de impedâncias.', zoomNote: '💡 Deslize a roda do rato para ampliar/reduzir', loading: 'Carregando Grafo...' };
      case 'fr': return { title: 'Simulateur Topologique', play: 'Lecture', pause: 'Pause', replay: 'Rejouer', desc: 'Ce graphe modélise le réseau via GNN. Appuyez sur <strong>Lecture</strong> pour voir la propagation causale de l\'effondrement selon le flux d\'impédance.', zoomNote: '💡 Utilisez la molette de la souris pour zoomer', loading: 'Chargement du Graphe...' };
      case 'it': return { title: 'Simulatore Topologico', play: 'Play', pause: 'Pausa', replay: 'Riproduci', desc: 'Questo grafo modella la rete tramite GNN. Premi <strong>Play</strong> per vedere la propagazione causale del collasso secondo il flusso di impedenza.', zoomNote: '💡 Usa la rotellina del mouse per ingrandire/ridurre', loading: 'Caricamento Grafo...' };
      case 'de': return { title: 'Topologischer Simulator', play: 'Abspielen', pause: 'Pause', replay: 'Wiederholen', desc: 'Dieser Graph modelliert das Netz mittels GNN. Drücken Sie <strong>Abspielen</strong>, um die kausale Ausbreitung des Kollapses gemäß dem Impedanzfluss zu sehen.', zoomNote: '💡 Mausrad drehen, um zu zoomen', loading: 'Graph wird geladen...' };
      default: return { title: 'Simulador Topológico', play: 'Play', pause: 'Pausa', replay: 'Replay', desc: 'Este grafo modela la red mediante GNN. Dale al <strong>Play</strong> para ver la propagación causal del colapso según el flujo de impedancias.', zoomNote: '💡 Desliza la rueda del ratón para ampliar o desampliar el mapa', loading: 'Cargando Grafo...' };
    }
  };
  const strings = getStrings(lang);

  const [ForceGraph2D, setForceGraph2D] = useState(null);
  const fgRef = useRef();
  
  // Dynamic import para evitar problemas de SSR
  useEffect(() => {
    import('react-force-graph-2d').then(module => {
      setForceGraph2D(() => module.default);
    });
  }, []);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  
  const [simTime, setSimTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying && simTime < 14) {
      interval = setInterval(() => {
        setSimTime(t => t + 1);
      }, 1000);
    } else if (simTime >= 14) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simTime]);

  // Filtramos los eventos del log
  const visibleLogs = EVENT_LOG.filter(log => log.t <= simTime).reverse();

  // Pre-calcular vecinos para hover rápido
  const neighbors = useRef(new Map());
  useEffect(() => {
    GRID_DATA.links.forEach(link => {
      const a = typeof link.source === 'object' ? link.source.id : link.source;
      const b = typeof link.target === 'object' ? link.target.id : link.target;
      if (!neighbors.current.has(a)) neighbors.current.set(a, []);
      if (!neighbors.current.has(b)) neighbors.current.set(b, []);
      neighbors.current.get(a).push(b);
      neighbors.current.get(b).push(a);
    });
  }, []);

  const handleNodeHover = useCallback(node => {
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    if (node) {
      const newHighlightNodes = new Set([node.id]);
      if (neighbors.current.has(node.id)) {
        neighbors.current.get(node.id).forEach(neighbor => newHighlightNodes.add(neighbor));
      }
      
      const newHighlightLinks = new Set();
      GRID_DATA.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;
        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(link);
        }
      });
      
      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    }
    setHoverNode(node || null);
  }, []);

  if (!ForceGraph2D) return <div style={{height: 500}}>{strings.loading}</div>;

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#0d1117', borderRadius: '12px', overflow: 'hidden', border: '1px solid #30363d' }}>
      <ForceGraph2D
        ref={fgRef}
        graphData={GRID_DATA}
        nodeColor={node => highlightNodes.size === 0 || highlightNodes.has(node.id) ? node.color : 'rgba(255,255,255,0.1)'}
        nodeRelSize={6}
        nodeVal={node => node.val}
        linkColor={link => {
          if (highlightLinks.has(link)) return '#fff';
          if (link.isCritical && simTime >= link.activationTime) return '#ef4444';
          return 'rgba(255,255,255,0.2)';
        }}
        linkWidth={link => highlightLinks.has(link) ? 3 : (link.isCritical && simTime >= link.activationTime ? 2 : 1)}
        linkDirectionalParticles={link => (link.isCritical && simTime >= link.activationTime) ? 4 : 0}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        onNodeHover={handleNodeHover}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const currentNodeColor = (simTime >= node.activationTime) ? node.activeColor : node.defaultColor;

          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2 - 10, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? currentNodeColor : 'rgba(255,255,255,0.2)';
          ctx.fillText(label, node.x, node.y - 10);

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val / 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = highlightNodes.size === 0 || highlightNodes.has(node.id) ? currentNodeColor : 'rgba(255,255,255,0.1)';
          ctx.fill();
        }}
        nodeCanvasObjectMode={() => 'replace'}
        cooldownTicks={0}
        onEngineStop={() => {}}
      />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        pointerEvents: 'none',
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #30363d',
        width: '320px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '400px'
      }}>
        <div style={{ pointerEvents: 'auto', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, color: '#60a5fa' }}>{strings.title}</h4>
          <div>
            <button 
              onClick={() => {
                if (simTime >= 14) setSimTime(0);
                setIsPlaying(!isPlaying);
              }}
              style={{
                background: 'var(--ifm-color-primary)',
                color: 'white',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {simTime >= 14 ? strings.replay : (isPlaying ? strings.pause : strings.play)}
            </button>
          </div>
        </div>
        
        <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem', color: '#9ca3af' }} dangerouslySetInnerHTML={{__html: strings.desc}} />
        <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: '#60a5fa', fontStyle: 'italic' }}>{strings.zoomNote}</p>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleLogs.map((log, idx) => (
            <div key={idx} style={{
              fontSize: '0.85rem',
              padding: '8px',
              backgroundColor: idx === 0 ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
              borderLeft: idx === 0 ? '3px solid #60a5fa' : '3px solid transparent',
              color: idx === 0 ? '#fff' : '#9ca3af',
              transition: 'all 0.3s ease'
            }}>
              {log.msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function IberianGridTopology({ lang = 'es' }) {
  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading grid topology...';
      case 'pt': return 'Carregando topologia de rede...';
      case 'fr': return 'Chargement de la topologie du réseau...';
      case 'it': return 'Caricamento della topologia di rete...';
      case 'de': return 'Netztopologie wird geladen...';
      default: return 'Cargando topología de red...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(lang)}</div>}>
      {() => <TopologyMapContent lang={lang} />}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\ImageGallery.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './ImageGallery.module.css';
import { imageGalleryData } from '../data/imageGalleryData';

export default function ImageGallery({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const lang = propLang || i18n.currentLocale || 'es';
  const [selectedImage, setSelectedImage] = useState(null);

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeModal = () => setSelectedImage(null);
  
  // Prevent clicks inside the image container from closing the modal
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.galleryContainer}>
      {imageGalleryData.chapters.map((chapter) => (
        <div key={chapter.id} className={styles.chapterGroup}>
          <h2 className={styles.chapterTitle}>
            {chapter[`title_${lang}`] || chapter.title_es}
          </h2>
          <div className={styles.imageGrid}>
            {chapter.images.map((img, index) => {
              const caption = img[`caption_${lang}`] || img.caption_es;
              const imageUrl = useBaseUrl(img.src);
              
              return (
                <div 
                  key={index} 
                  className={styles.imageCard}
                  onClick={() => setSelectedImage({ url: imageUrl, caption })}
                  title={lang === 'en' ? "Click to enlarge" : "Clic para ampliar"}
                >
                  <div className={styles.imageThumbnailWrapper}>
                    <img 
                      src={imageUrl} 
                      alt={`Gallery image ${index + 1}`} 
                      className={styles.imageThumbnail}
                      loading="lazy" 
                    />
                  </div>
                  <div className={styles.imageCaption}>
                    {caption}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className={styles.lightboxOverlay} 
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <button 
            className={styles.lightboxCloseButton} 
            onClick={closeModal}
            aria-label={lang === 'en' ? "Close" : "Cerrar"}
          >
            &times;
          </button>
          
          <div className={styles.lightboxImageContainer} onClick={handleModalContentClick}>
            <img 
              src={selectedImage.url} 
              alt="Enlarged gallery view" 
              className={styles.lightboxImage} 
            />
          </div>
          
          <div className={styles.lightboxCaption} onClick={handleModalContentClick}>
            {selectedImage.caption}
          </div>
        </div>
      )}
    </div>
  );
}

```

### 📄 Archivo: `src\components\ImageGallery.module.css`
```css
.galleryContainer {
  margin-top: 2rem;
}

.chapterGroup {
  margin-bottom: 3rem;
}

.chapterTitle {
  font-size: 1.5rem;
  border-bottom: 2px solid var(--ifm-color-primary);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--ifm-heading-color);
}

.imageGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.imageCard {
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.imageCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  border-color: var(--ifm-color-primary);
}

.imageThumbnailWrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme='dark'] .imageThumbnailWrapper {
  background-color: #1b1b1d;
}

.imageThumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.imageCard:hover .imageThumbnail {
  transform: scale(1.05);
}

.imageCaption {
  padding: 1rem;
  font-size: 0.85rem;
  color: var(--ifm-color-emphasis-700);
  flex-grow: 1;
  line-height: 1.4;
}

/* Lightbox Modal */
.lightboxOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightboxCloseButton {
  position: absolute;
  top: 20px;
  right: 30px;
  background: transparent;
  color: white;
  border: none;
  font-size: 3rem;
  line-height: 1;
  cursor: pointer;
  z-index: 10000;
  transition: color 0.2s;
}

.lightboxCloseButton:hover {
  color: var(--ifm-color-primary);
}

.lightboxImageContainer {
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.lightboxImage {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  border-radius: 4px;
}

.lightboxCaption {
  margin-top: 1.5rem;
  color: white;
  text-align: center;
  max-width: 800px;
  font-size: 1.1rem;
  line-height: 1.5;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 1rem;
  border-radius: 8px;
}

```

### 📄 Archivo: `src\components\InteractiveGraphicsGallery.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from './ForensicUI/TelemetryFallback';

const InteractiveGraphicsGalleryBase = React.lazy(() => import('./InteractiveGraphicsGalleryBase'));

export default function InteractiveGraphicsGallery(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <InteractiveGraphicsGalleryBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\InteractiveGraphicsGallery.module.css`
```css
.galleryContainer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
  min-height: 600px;
}

@media (min-width: 996px) {
  .galleryContainer {
    flex-direction: row;
    align-items: flex-start;
  }
}

.sidebar {
  flex: 0 0 240px;
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.sidebarTitle {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  color: var(--ifm-heading-color);
}

.graphicList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.graphicButton {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-left: 3px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  color: var(--ifm-font-color-base);
  overflow: hidden;
  z-index: 1;
}

.graphicButton::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 0%;
  background: var(--ifm-color-primary-lightest);
  z-index: -1;
  transition: width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-theme='dark'] .graphicButton::before {
  background: color-mix(in srgb, var(--ifm-color-primary) 15%, transparent);
}

.graphicButton:hover {
  border-left-color: color-mix(in srgb, var(--ifm-color-primary) 50%, transparent);
}

.graphicButton:active {
  transform: scale(0.98);
}

.activeButton {
  border-left-color: var(--accent-electric, var(--ifm-color-primary));
  color: var(--ifm-color-primary-darker);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.activeButton::before {
  width: 100%;
}

[data-theme='dark'] .activeButton {
  color: var(--ifm-color-primary-light);
}

.icon {
  font-size: 1.5rem;
}

.buttonText {
  display: flex;
  flex-direction: column;
}

.buttonTitle {
  font-size: 0.95rem;
}

.mainContent {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--ifm-background-surface-color);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.graphicHeader {
  padding: 1.5rem;
  border-bottom: 1px solid var(--ifm-color-emphasis-200);
  background-color: var(--ifm-color-emphasis-100);
}

.graphicHeader h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.graphicHeader p {
  margin: 0;
  color: var(--ifm-color-emphasis-700);
  font-size: 0.95rem;
}

.graphicStage {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Add min-height to prevent stage from collapsing */
  min-height: 500px;
  background-color: var(--ifm-background-color);
}

```

### 📄 Archivo: `src\components\InteractiveGraphicsGalleryBase.jsx`
```jsx
import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InteractiveGraphicsGallery.module.css';

// Import components directly if they are safe for SSR, or we wrap their usage in BrowserOnly.
// Since some of them need BrowserOnly, we'll wrap the active component renderer.
import FrequencyChart from './FrequencyChart';
import AnimatedMap from './AnimatedMap';
import VerticalTimeline from './VerticalTimeline';

import EnergyTransitionStreamgraph from './EnergyTransitionStreamgraph';
import FinancialWaterfallChart from './FinancialWaterfallChart';
import BlackoutPropagationMap from './BlackoutPropagationMap';
import IberianGridTopology from './IberianGridTopology';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const getGraphicData = (id, lang) => {
  const dictionary = {
    frequency: {
      es: { title: 'Caída de Frecuencia (Hz)', desc: 'Gráfico interactivo de la evolución de la frecuencia durante el colapso.' },
      en: { title: 'Frequency Drop (Hz)', desc: 'Interactive chart of frequency evolution during the collapse.' },
      pt: { title: 'Queda de Frequência (Hz)', desc: 'Gráfico interativo da evolução da frequência durante o colapso.' },
      fr: { title: 'Chute de Fréquence (Hz)', desc: 'Graphique interactif de l\'évolution de la fréquence pendant l\'effondrement.' },
      it: { title: 'Caduta di Frequenza (Hz)', desc: 'Grafico interattivo dell\'evoluzione della frequenza durante il collasso.' },
      de: { title: 'Frequenzabfall (Hz)', desc: 'Interaktives Diagramm der Frequenzentwicklung während des Kollapses.' }
    },
    map: {
      es: { title: 'Mapa Animado del Colapso', desc: 'Simulación geográfica interactiva de la cascada de desconexiones.' },
      en: { title: 'Animated Collapse Map', desc: 'Interactive geographic simulation of the disconnection cascade.' },
      pt: { title: 'Mapa Animado do Colapso', desc: 'Simulação geográfica interativa da cascata de desconexões.' },
      fr: { title: 'Carte Animée de l\'Effondrement', desc: 'Simulation géographique interactive de la cascade de déconnexions.' },
      it: { title: 'Mappa Animata del Collasso', desc: 'Simulazione geografica interattiva della cascata di disconnessioni.' },
      de: { title: 'Animierte Kollaps-Karte', desc: 'Interaktive geografische Simulation der Kaskadentrennungen.' }
    },
    timeline: {
      es: { title: 'Cronograma del Incidente', desc: 'Línea de tiempo vertical e interactiva de los eventos clave.' },
      en: { title: 'Incident Timeline', desc: 'Interactive vertical timeline of key events.' },
      pt: { title: 'Cronograma do Incidente', desc: 'Linha do tempo vertical e interativa dos eventos-chave.' },
      fr: { title: 'Chronologie de l\'Incident', desc: 'Chronologie verticale interactive des événements clés.' },
      it: { title: 'Cronologia dell\'Incidente', desc: 'Cronologia verticale interattiva degli eventi chiave.' },
      de: { title: 'Vorfall-Zeitachse', desc: 'Interaktive vertikale Zeitachse der Schlüsselereignisse.' }
    },

    streamgraph: {
      es: { title: 'Transición y Emisiones', desc: 'Evolución macroestructural del mix de generación frente a las emisiones de CO2.' },
      en: { title: 'Transition & Emissions', desc: 'Macro-structural evolution of the generation mix versus CO2 emissions.' },
      pt: { title: 'Transição e Emissões', desc: 'Evolução macroestrutural da matriz de geração versus emissões de CO2.' },
      fr: { title: 'Transition & Émissions', desc: 'Évolution macrostructurelle du mix de production face aux émissions de CO2.' },
      it: { title: 'Transizione ed Emissioni', desc: 'Evoluzione macrostrutturale del mix di generazione rispetto alle emissioni di CO2.' },
      de: { title: 'Übergang & Emissionen', desc: 'Makrostrukturelle Entwicklung des Erzeugungsmixes versus CO2-Emissionen.' }
    },
    waterfall: {
      es: { title: 'Auditoría Económica', desc: 'Cascada financiera del impacto del apagón y el coste de resiliencia.' },
      en: { title: 'Economic Audit', desc: 'Financial waterfall of the blackout impact and resilience cost.' },
      pt: { title: 'Auditoria Econômica', desc: 'Cascata financeira do impacto do apagão e custo de resiliência.' },
      fr: { title: 'Audit Économique', desc: 'Cascade financière de l\'impact de la panne et du coût de la résilience.' },
      it: { title: 'Audit Economico', desc: 'Cascata finanziaria dell\'impatto del blackout e del costo della resilienza.' },
      de: { title: 'Wirtschaftsprüfung', desc: 'Finanzkaskade der Blackout-Auswirkungen und Resilienzkosten.' }
    },
    blackout3d: {
      es: { title: 'Mapa 3D del Apagón (WebGL)', desc: 'Simulación geográfica interactiva con Deck.gl de la cascada de desconexiones y flujos masivos de reactiva.' },
      en: { title: '3D Blackout Map (WebGL)', desc: 'Interactive geographic simulation with Deck.gl of the disconnection cascade.' },
      pt: { title: 'Mapa 3D do Apagão (WebGL)', desc: 'Simulação geográfica interativa com Deck.gl da cascata de desconexões.' },
      fr: { title: 'Carte 3D de la Panne (WebGL)', desc: 'Simulation géographique interactive avec Deck.gl de la cascade de déconnexions.' },
      it: { title: 'Mappa 3D del Blackout (WebGL)', desc: 'Simulazione geografica interattiva con Deck.gl della cascata di disconnessioni.' },
      de: { title: '3D-Blackout-Karte (WebGL)', desc: 'Interaktive geografische Simulation mit Deck.gl der Kaskadentrennungen.' }
    },
    topology: {
      es: { title: 'Topología de Red Neuronal (GNN)', desc: 'Grafo Force-Directed de las impedancias de la red de transporte y dependencias de tensión inter-área.' },
      en: { title: 'Neural Grid Topology (GNN)', desc: 'Force-directed graph of the transmission grid impedances.' },
      pt: { title: 'Topologia de Rede Neural (GNN)', desc: 'Grafo Force-Directed das impedâncias da rede de transmissão.' },
      fr: { title: 'Topologie de Réseau Neuronal (GNN)', desc: 'Graphe dirigé par la force des impédances du réseau de transport.' },
      it: { title: 'Topologia di Rete Neurale (GNN)', desc: 'Grafo diretto dalla forza delle impedenze della rete di trasmissione.' },
      de: { title: 'Neuronale Netztopologie (GNN)', desc: 'Kraftgesteuerter Graph der Übertragungsnetzimpedanzen.' }
    },
    phasor: {
      es: { title: 'Gráfico Fasorial Transitorio', desc: 'Dispersión polar de Unidades de Medición Fasorial (PMU) a 50Hz ilustrando la divergencia angular y colapso de la estabilidad.' },
      en: { title: 'Transient Phasor Plot', desc: 'Polar scatter of Phasor Measurement Units (PMU) at 50Hz illustrating angular divergence and stability collapse.' },
      pt: { title: 'Gráfico Fasorial Transitório', desc: 'Dispersão polar de Unidades de Medição Fasorial (PMU) a 50Hz ilustrando a divergência angular.' },
      fr: { title: 'Tracé Phasoriel Transitoire', desc: 'Dispersion polaire des unités de mesure de phase (PMU) à 50 Hz illustrant la divergence angulaire.' },
      it: { title: 'Grafico Fasoriale Transitorio', desc: 'Dispersione polare delle unità di misura fasoriale (PMU) a 50Hz che illustra la divergenza angolare.' },
      de: { title: 'Transientes Zeigerdiagramm', desc: 'Polare Streuung von Phasor Measurement Units (PMU) bei 50 Hz zur Veranschaulichung der Winkeldivergenz.' }
    },
    phaseplane: {
      es: { title: 'Diagrama de Plano de Fase (GFM vs GFL)', desc: 'Comparación en el espacio de estados δ vs Δω de la convergencia de inversores Formadores de Red frente a Seguidores de Red.' },
      en: { title: 'Phase-Plane Diagram (GFM vs GFL)', desc: 'State-space comparison δ vs Δω of Grid-Forming vs Grid-Following inverters convergence.' },
      pt: { title: 'Diagrama de Plano de Fase (GFM vs GFL)', desc: 'Comparação no espaço de estados δ vs Δω da convergência de inversores Formadores de Rede versus Seguidores de Rede.' },
      fr: { title: 'Diagramme de Plan de Phase (GFM vs GFL)', desc: 'Comparaison dans l\'espace d\'états δ vs Δω de la convergence des onduleurs Formateurs de Réseau vs Suiveurs de Réseau.' },
      it: { title: 'Diagramma di Piano di Fase (GFM vs GFL)', desc: 'Confronto nello spazio degli stati δ vs Δω della convergenza degli inverter Grid-Forming vs Grid-Following.' },
      de: { title: 'Phasenebenendiagramm (GFM vs GFL)', desc: 'Zustandsraumvergleich δ vs Δω der Konvergenz von netzbildenden vs. netzfolgenden Wechselrichtern.' }
    },
    interconnection: {
      es: { title: 'Dashboard de Interconexiones', desc: 'Análisis del estrangulamiento estructural de los intercambios internacionales.' },
      en: { title: 'Interconnection Dashboard', desc: 'Analysis of the structural bottleneck in international exchanges.' },
      pt: { title: 'Dashboard de Interconexões', desc: 'Análise do estrangulamento estrutural das trocas internacionais.' },
      fr: { title: 'Tableau de Bord des Interconnexions', desc: 'Analyse du goulot d\'étranglement structurel des échanges internationaux.' },
      it: { title: 'Dashboard delle Interconnessioni', desc: 'Analisi del collo di bottiglia strutturale negli scambi internazionali.' },
      de: { title: 'Verbindungs-Dashboard', desc: 'Analyse des strukturellen Engpasses im internationalen Austausch.' }
    },
    swing: {
      es: { title: 'Simulador Ecuación del Swing', desc: 'Simulador interactivo de la inercia (H), desequilibrio (ΔP) y Respuesta Rápida de Frecuencia (FFR) tras el incidente.' },
      en: { title: 'Swing Equation Simulator', desc: 'Interactive simulator of inertia (H), power mismatch (ΔP) and Fast Frequency Response (FFR).' },
      pt: { title: 'Simulador Equação do Swing', desc: 'Simulador interativo da inércia (H), desequilíbrio (ΔP) e Resposta Rápida de Frequência (FFR).' },
      fr: { title: 'Simulateur Équation du Swing', desc: 'Simulateur interactif de l\'inertie (H), déséquilibre (ΔP) et Réponse Rapide de Fréquence (FFR).' },
      it: { title: 'Simulatore Equazione dello Swing', desc: 'Simulatore interattivo dell\'inerzia (H), squilibrio (ΔP) e Risposta Rapida di Frequenza (FFR).' },
      de: { title: 'Swing-Gleichung-Simulator', desc: 'Interaktiver Simulator für Trägheit (H), Ungleichgewicht (ΔP) und Schnelle Frequenzantwort (FFR).' }
    }
  };
  return dictionary[id] ? (dictionary[id][lang] || dictionary[id]['es']) : dictionary['frequency']['es'];
};

import SynchrophasorPlot from './SynchrophasorPlot';
import PhasePlanePlot from './PhasePlanePlot';
import InterconnectionDashboard from './InterconnectionDashboard';
import SwingEquationSimulator from './SwingEquationSimulator/SwingEquationSimulator';

const graphicsData = [
  { id: 'frequency', icon: '📉', component: FrequencyChart },
  { id: 'map', icon: '🗺️', component: AnimatedMap },
  { id: 'timeline', icon: '⏱️', component: VerticalTimeline },

  { id: 'streamgraph', icon: '🌍', component: EnergyTransitionStreamgraph },
  { id: 'waterfall', icon: '💶', component: FinancialWaterfallChart },
  { id: 'topology', icon: '🕸️', component: IberianGridTopology },
  { id: 'phasor', icon: '🧭', component: SynchrophasorPlot },
  { id: 'phaseplane', icon: '🌀', component: PhasePlanePlot },
  { id: 'interconnection', icon: '🔌', component: InterconnectionDashboard },
  { id: 'swing', icon: '⚖️', component: SwingEquationSimulator }
];

export default function InteractiveGraphicsGallery({ lang: propLang }) {
  const { i18n } = useDocusaurusContext();
  const locale = propLang || i18n.currentLocale;
  const [activeGraphicId, setActiveGraphicId] = useState(graphicsData[0].id);

  const activeGraphic = graphicsData.find(g => g.id === activeGraphicId);
  const ActiveComponent = activeGraphic.component;
  const activeGraphicContent = getGraphicData(activeGraphic.id, locale);

  const getAvailableTitle = (l) => {
    switch(l) {
      case 'en': return 'Available Graphics';
      case 'pt': return 'Gráficos Disponíveis';
      case 'fr': return 'Graphiques Disponibles';
      case 'it': return 'Grafici Disponibili';
      case 'de': return 'Verfügbare Grafiken';
      default: return 'Gráficas Disponibles';
    }
  };

  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive graphic...';
      case 'pt': return 'Carregando gráfico interativo...';
      case 'fr': return 'Chargement du graphique interactif...';
      case 'it': return 'Caricamento del grafico interattivo...';
      case 'de': return 'Interaktive Grafik wird geladen...';
      default: return 'Cargando gráfico interactivo...';
    }
  };

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>
          {getAvailableTitle(locale)}
        </h3>
        <ul className={styles.graphicList}>
          {graphicsData.map(graphic => {
            const content = getGraphicData(graphic.id, locale);
            return (
            <li key={graphic.id}>
              <button
                className={`${styles.graphicButton} ${activeGraphicId === graphic.id ? styles.activeButton : ''}`}
                onClick={() => setActiveGraphicId(graphic.id)}
              >
                <span className={styles.icon}>{graphic.icon}</span>
                <div className={styles.buttonText}>
                  <span className={styles.buttonTitle}>
                    {content.title}
                  </span>
                </div>
              </button>
            </li>
          )})}
        </ul>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.graphicHeader}>
          <h2>{activeGraphicContent.title}</h2>
          <p>{activeGraphicContent.desc}</p>
        </div>
        <div className={styles.graphicStage}>
          <BrowserOnly fallback={<div>{getLoadingText(locale)}</div>}>
            {() => <ActiveComponent lang={locale} isGallery={true} />}
          </BrowserOnly>
        </div>
      </div>
    </div>
  );
}


```

### 📄 Archivo: `src\components\InterconnectionDashboard.jsx`
```jsx
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './InterconnectionDashboard.module.css';
import { interconnectionData } from '../data/interconnectionData';

export default function InterconnectionDashboard({ lang }) {
  const isEs = lang === 'es' || !lang;

  // Custom tooltip compartido
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Encontrar el evento para este año
      const yearData = interconnectionData.find(d => d.anio === label);
      
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipTitle}>{label}</div>
          {payload.map((p, i) => (
            <div key={i} style={{ color: p.color, margin: '4px 0', fontSize: '0.9rem' }}>
              <strong>{p.name}:</strong> {p.value.toLocaleString()} {p.name.includes('%') ? '%' : (p.name.includes('MW') ? 'MW' : 'GWh')}
            </div>
          ))}
          {yearData && (yearData.evento || yearData.evento_en) && (
            <div className={styles.tooltipEvent}>
              {isEs ? yearData.evento : yearData.evento_en}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h3>{isEs ? 'Estrangulamiento de Interconexiones' : 'Interconnection Bottleneck'}</h3>
        <p>{isEs ? 'Evolución del sistema eléctrico ibérico (2015-2025)' : 'Evolution of the Iberian grid (2015-2025)'}</p>
      </div>

      <div className={styles.grid}>
        
        {/* Gráfico 1: Exportaciones vs Importaciones vs Saldo */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h4 className={styles.cardTitle}>{isEs ? 'Intercambios Internacionales (GWh)' : 'International Exchanges (GWh)'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Volumen anual de exportaciones, importaciones y saldo neto' : 'Annual volume of exports, imports, and net balance'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={interconnectionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="anio" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="exportacion_gwh" name={isEs ? 'Exportación' : 'Export'} fill="#00f0ff" barSize={20} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="importacion_gwh" name={isEs ? 'Importación' : 'Import'} fill="#f472b6" barSize={20} radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="saldo_neto_gwh" name={isEs ? 'Saldo Neto' : 'Net Balance'} stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

        {/* Gráfico 2: Fragilidad (Potencia Instalada vs Ratio de Interconexión) */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>{isEs ? 'Fragilidad Estructural' : 'Structural Fragility'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Crecimiento de potencia renovable frente a la caída del ratio de interconexión (Target UE: 15%)' : 'Renewable power growth vs dropping interconnection ratio (EU Target: 15%)'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={interconnectionData} margin={{ top: 20, right: 10, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="anio" stroke="#94a3b8" />
                      <YAxis yAxisId="left" stroke="#94a3b8" domain={['dataMin - 10000', 'dataMax + 10000']} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ef4444" domain={[0, 5]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="potencia_instalada_total_mw" name={isEs ? 'Potencia Total Instalada' : 'Total Installed Power'} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" />
                      <Line yAxisId="right" type="stepAfter" dataKey="ratio_interconexion_pct" name={isEs ? 'Ratio Interconexión (%)' : 'Interconnection Ratio (%)'} stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

        {/* Gráfico 3: Capacidad Constante (Anillo estático temporal) */}
        <div className={styles.card}>
          <h4 className={styles.cardTitle}>{isEs ? 'Capacidad Fronteriza Bloqueada' : 'Locked Border Capacity'}</h4>
          <p className={styles.cardDesc}>{isEs ? 'Capacidad máxima de importación física (estancada en 4,200 MW durante toda la década)' : 'Maximum physical import capacity (stagnant at 4,200 MW throughout the decade)'}</p>
          <div className={styles.chartContainer}>
            <BrowserOnly fallback={<div>Cargando gráfico...</div>}>
              {() => {
                const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = require('recharts');
                // Tomamos un año cualquiera ya que es estático
                const data2025 = [
                  { name: 'Francia', value: 2800 },
                  { name: 'Portugal', value: 1200 },
                  { name: 'Marruecos', value: 200 }
                ];
                const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data2025}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data2025.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#3b82f6', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                );
              }}
            </BrowserOnly>
          </div>
        </div>

      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\InterconnectionDashboard.module.css`
```css
.dashboardContainer {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  margin: 2rem 0;
  font-family: 'Inter', -apple-system, sans-serif;
}

.dashboardHeader {
  text-align: center;
  margin-bottom: 1rem;
}

.dashboardHeader h3 {
  color: #00f0ff;
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.dashboardHeader p {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .fullWidth {
    grid-column: 1 / -1;
  }
}

.card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.cardTitle {
  color: #e2e8f0;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.cardDesc {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.chartContainer {
  flex: 1;
  min-height: 350px;
  width: 100%;
}

/* Tooltip custom */
.customTooltip {
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid rgba(0, 240, 255, 0.3) !important;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.tooltipTitle {
  color: #00f0ff;
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.25rem;
}

.tooltipEvent {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  color: #f87171;
  font-style: italic;
  font-size: 0.9rem;
  max-width: 250px;
}

```

### 📄 Archivo: `src\components\PhasePlanePlot.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Simulador de dinámica de fase
const generateFullPhaseData = (type, timeLimit) => {
  const dt = 0.01;
  let delta = 0; // Desviación del ángulo
  let omega = 0; // Desviación de frecuencia (d_delta/dt)
  
  const x = [];
  const y = [];
  
  // Condición inicial (perturbación)
  delta = 0.1;
  omega = 0.5;

  for (let t = 0; t <= timeLimit; t += dt) {
    if (type === 'GFL') {
      // Inversor Grid-Following en red débil (inestable, espiral divergente)
      const d_delta = omega;
      const d_omega = -0.5 * Math.sin(delta) - 0.2 * omega + 0.1 * delta;
      
      delta += d_delta * dt;
      omega += d_omega * dt;
      
      // Amplificamos la divergencia
      delta *= 1.002;
      omega *= 1.002;
    } else if (type === 'GFM') {
      // Inversor Grid-Forming (estable, converge al origen)
      const d_delta = omega;
      const d_omega = -2.0 * Math.sin(delta) - 1.5 * omega; // Fuerte amortiguamiento
      
      delta += d_delta * dt;
      omega += d_omega * dt;
    } else if (type === 'SG') {
      // Generador Síncrono Tradicional (lenta oscilación amortiguada)
      const d_delta = omega;
      const d_omega = -1.0 * Math.sin(delta) - 0.5 * omega;
      
      delta += d_delta * dt;
      omega += d_omega * dt;
    }
    
    x.push(delta);
    y.push(omega);
  }
  
  return { x, y };
};

// Generamos los datos completos solo una vez fuera del componente
const FULL_TIME = 20;
const GFL_FULL = generateFullPhaseData('GFL', FULL_TIME);
const GFM_FULL = generateFullPhaseData('GFM', FULL_TIME);
const SG_FULL = generateFullPhaseData('SG', FULL_TIME);

export default function PhasePlanePlot({ lang }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Hasta 20 (segundos de simulación)

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(t => {
        if (t >= 20) {
          setIsPlaying(false);
          return 20;
        }
        return t + 0.1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // dt es 0.01, por lo que cada 0.1s son 10 índices
  const currentIndex = Math.floor(currentTime * 100);
  
  const gflData = { x: GFL_FULL.x.slice(0, currentIndex), y: GFL_FULL.y.slice(0, currentIndex) };
  const gfmData = { x: GFM_FULL.x.slice(0, currentIndex), y: GFM_FULL.y.slice(0, currentIndex) };
  const sgData = { x: SG_FULL.x.slice(0, currentIndex), y: SG_FULL.y.slice(0, currentIndex) };

  const getTexts = () => {
    if (lang === 'en') return {
      title: 'Phase-Plane Diagram: Inverter Convergence',
      xaxis: 'Angle Deviation δ (rad)',
      yaxis: 'Frequency Deviation Δω (rad/s)',
      gfl: 'Grid-Following (GFL) - Divergent',
      gfm: 'Grid-Forming (GFM) - Stable',
      sg: 'Synchronous Generator (SG)'
    };
    return {
      title: 'Diagrama de Plano de Fase: Convergencia de Inversores',
      xaxis: 'Desviación Angular δ (rad)',
      yaxis: 'Desviación de Frecuencia Δω (rad/s)',
      gfl: 'Inversor Grid-Following (GFL) - Divergente',
      gfm: 'Inversor Grid-Forming (GFM) - Estable',
      sg: 'Generador Síncrono Clásico (SG)'
    };
  };

  const texts = getTexts();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Contenedor con altura estricta para evitar que el gráfico empuje el texto al redibujarse */}
      <div style={{ height: '450px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <BrowserOnly fallback={<div>Cargando gráfico interactivo...</div>}>
          {() => {
            const Plot = require('react-plotly.js').default;
            return (
              <Plot
                data={[
                  {
                    x: gflData.x,
                    y: gflData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#ef4444', width: 3 },
                    name: texts.gfl
                  },
                  {
                    x: gfmData.x,
                    y: gfmData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#10b981', width: 3 },
                    name: texts.gfm
                  },
                  {
                    x: sgData.x,
                    y: sgData.y,
                    type: 'scatter',
                    mode: 'lines',
                    line: { color: '#f59e0b', width: 2, dash: 'dot' },
                    name: texts.sg
                  }
                ]}
                layout={{
                  title: {
                    text: texts.title,
                    font: { color: '#ffffff', size: 16 }
                  },
                  paper_bgcolor: 'transparent',
                  plot_bgcolor: 'transparent',
                  font: { color: '#94a3b8' },
                  xaxis: { 
                    title: texts.xaxis, 
                    gridcolor: 'rgba(255,255,255,0.1)',
                    zerolinecolor: 'rgba(255,255,255,0.3)',
                    range: [-2, 2]
                  },
                  yaxis: { 
                    title: texts.yaxis, 
                    gridcolor: 'rgba(255,255,255,0.1)',
                    zerolinecolor: 'rgba(255,255,255,0.3)',
                    range: [-2, 2]
                  },
                  legend: {
                    orientation: 'h',
                    y: -0.2,
                    font: { color: '#e2e8f0' }
                  },
                  margin: { t: 60, r: 20, l: 60, b: 80 },
                  datarevision: currentTime // Evita que plotly redibuje y "rebote" calculando tamaños
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
                config={{ responsive: true, displayModeBar: false }}
              />
            );
          }}
        </BrowserOnly>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '80px'
          }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button 
          onClick={handleReset}
          style={{
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          RESET
        </button>
        
        <input 
          type="range" 
          min="0" 
          max="20" 
          step="0.1"
          value={currentTime}
          onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
        />
        
        <div style={{ fontFamily: 'monospace', color: '#94a3b8', minWidth: '120px', textAlign: 'right' }}>
          T = {currentTime.toFixed(2)}s
        </div>
      </div>
      
      {/* Explicación del diagrama */}
      <div style={{
        marginTop: '1rem',
        padding: '1.5rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#e2e8f0',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        <h4 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '0.5rem' }}>
          {lang === 'es' ? '¿Qué significa este diagrama?' : 'What does this diagram mean?'}
        </h4>
        <p style={{ margin: 0 }}>
          {lang === 'es' 
            ? 'Este es un "Diagrama de Plano de Fase". Muestra cómo reacciona un generador cuando la red sufre una sacudida (una perturbación). El centro de la cruz (0, 0) es la estabilidad perfecta. Al darle a PLAY, ves cómo tres tecnologías intentan volver a la estabilidad:' 
            : 'This is a "Phase-Plane Diagram". It shows how a generator reacts when the grid suffers a shock. The center (0,0) represents perfect stability. Press PLAY to see how three technologies try to regain stability:'}
        </p>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#10b981' }}>Línea Verde (GFM - Grid Forming):</strong> {lang === 'es' ? 'Actúa como un amortiguador moderno. Va directo al centro (0,0) rápidamente y se estabiliza. Es la tecnología que salvaría la red.' : 'Acts as a modern shock absorber. It spirals directly to the center (0,0) quickly and stabilizes.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong style={{ color: '#f59e0b' }}>Línea Naranja (Generador Tradicional):</strong> {lang === 'es' ? 'Es un generador pesado que gira (turbina clásica). Tarda más en estabilizarse dando vueltas, pero poco a poco llega al centro.' : 'A heavy rotating generator. Takes longer to stabilize, spiraling slowly to the center.'}
          </li>
          <li>
            <strong style={{ color: '#ef4444' }}>Línea Roja (GFL - Grid Following):</strong> {lang === 'es' ? 'La tecnología actual de los inversores. Al intentar seguir una red inestable, se confunde, oscila cada vez más fuerte (espiral hacia afuera) y colapsa el sistema.' : 'Current inverter technology. When following an unstable grid, it gets confused, oscillates wildly outwards, and collapses.'}
          </li>
        </ul>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\StickyScene.jsx`
```jsx
import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { motion } from 'framer-motion';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './StickyScene.module.css';

export default function StickyScene({ children, graphic: Graphic, steps }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  return (
    <BrowserOnly fallback={<div>Cargando escena interactiva...</div>}>
      {() => (
        <section className={styles.scene} data-act={active}>
          <div className={styles.sticky}>
            {Graphic && <Graphic activeStep={active} progress={progress} />}
          </div>
          <div className={styles.steps}>
            <Scrollama
              offset={0.6}
              onStepEnter={({ data }) => setActive(data)}
              onStepProgress={({ progress }) => setProgress(progress)}
              progress
            >
              {steps.map((s, i) => (
                <Step data={i} key={i}>
                  <motion.div
                    className={styles.step}
                    initial={{ opacity: 0.25, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.6 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {s}
                  </motion.div>
                </Step>
              ))}
            </Scrollama>
          </div>
        </section>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\StickyScene.module.css`
```css
.scene {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 6rem);
  position: relative;
  padding-block: 20vh;
  transition: background 1.2s ease;
  border-radius: 16px;
  margin: 4rem 0;
}

.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: grid;
  place-items: center;
}

.steps { 
  display: flex; 
  flex-direction: column; 
  gap: 80vh; 
  padding-top: 20vh;
  padding-bottom: 20vh;
}

.step {
  min-height: 30vh;
  padding: 2rem;
  background: color-mix(in srgb, var(--bg-1) 60%, transparent);
  backdrop-filter: blur(12px) saturate(140%);
  border-left: 1px solid var(--accent-electric);
  border-radius: 0 12px 12px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Fondo que cambia de gradiente según el acto activo, vía data-attr */
.scene[data-act="0"] { background: radial-gradient(ellipse at 70% 30%, hsl(220 40% 12%), transparent); }
.scene[data-act="1"] { background: radial-gradient(ellipse at 50% 50%, hsl(38 80% 18%), transparent); }
.scene[data-act="2"] { background: radial-gradient(ellipse at 30% 70%, hsl(0 65% 22%), transparent); }
.scene[data-act="3"] { background: radial-gradient(ellipse at 70% 70%, hsl(322 80% 18%), transparent); }
.scene[data-act="4"] { background: radial-gradient(ellipse at 50% 10%, hsl(190 80% 18%), transparent); }

@media (max-width: 900px) {
  .scene { grid-template-columns: 1fr; }
  .sticky { height: 60vh; z-index: 10; }
  .steps { gap: 60vh; }
  .step { z-index: 20; position: relative; }
}

```

### 📄 Archivo: `src\components\SwingEquationSimulator\SwingEquationSimulator.jsx`
```jsx
import React from 'react';
import styles from './SwingEquationSimulator.module.css';

const SwingEquationSimulator = () => {
  return (
    <div className={styles.wrapper}>
      {/* 
        Dado que el nuevo código proporcionado está escrito en HTML/JS/CSS nativo con Canvas, 
        lo cargamos mediante un iframe desde la carpeta /static/ para garantizar su correcto funcionamiento
        y aislamiento dentro de React.
      */}
      <div className={styles.iframeContainer}>
        <iframe 
          src="/SwingEquationSimulator/index.html" 
          className={styles.simulatorIframe}
          title="Simulador Ecuación del Swing"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.legendContainer}>
        <h3>📘 Guía de Interpretación para el Espectador</h3>
        <p>Este simulador interactivo te permite experimentar con la física real de la red eléctrica europea y observar qué ocurre cuando hay un desequilibrio entre la energía que se genera y la que se consume.</p>
        
        <div className={styles.legendGrid}>
          <div className={styles.legendCard}>
            <h4>1. Inercia del Sistema (H)</h4>
            <p><strong>¿Qué es?</strong> La "pesadez" de los generadores giratorios tradicionales (nucleares, gas). Actúa como un amortiguador natural.</p>
            <p><strong>Pruébalo:</strong> Baja la inercia (1.0s) y verás que la frecuencia cae rapidísimo. Súbela (8.0s) y el sistema resistirá más tiempo antes de colapsar.</p>
          </div>
          
          <div className={styles.legendCard}>
            <h4>2. Pérdida de Generación (ΔP)</h4>
            <p><strong>¿Qué es?</strong> Representa una desconexión súbita de centrales eléctricas. El 28 de abril, se perdió casi el 9% de la generación ibérica de golpe.</p>
            <p><strong>Pruébalo:</strong> Ajusta este valor para ver cómo perturbaciones más grandes provocan caídas más violentas (mayor ROCOF).</p>
          </div>
          
          <div className={styles.legendCard}>
            <h4>3. Inercia Sintética (FFR)</h4>
            <p><strong>¿Qué es?</strong> Respuesta rápida inyectada artificialmente por baterías y renovables para simular la inercia que no tienen.</p>
            <p><strong>Pruébalo:</strong> Úsala junto al botón "Red Débil". Observa cómo una FFR agresiva en una red aislada no estabiliza el sistema, sino que crea oscilaciones peligrosas.</p>
          </div>
        </div>

        <div className={styles.legendNote}>
          <strong>💡 Consejo:</strong> Haz clic en el botón <code>🎬 DEMO 28A</code> dentro del simulador para recrear exactamente las condiciones físicas (muy baja inercia y pérdida de generación) que provocaron el apagón ibérico real. Fíjate cómo la alarma de ROCOF parpadea en rojo cuando el colapso se vuelve inevitable.
        </div>
      </div>
    </div>
  );
};

export default SwingEquationSimulator;

```

### 📄 Archivo: `src\components\SwingEquationSimulator\SwingEquationSimulator.module.css`
```css
.wrapper {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.iframeContainer {
  width: 100%;
  height: 950px;
  background-color: var(--ifm-background-color);
  border-radius: var(--ifm-global-radius);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.simulatorIframe {
  width: 100%;
  height: 100%;
  border: none;
}

.legendContainer {
  background: var(--ifm-color-emphasis-100);
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 1.5rem;
}

.legendContainer h3 {
  margin-top: 0;
  color: var(--ifm-color-primary);
  font-size: 1.25rem;
}

.legendGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.legendCard {
  background: var(--ifm-background-surface-color);
  padding: 1rem;
  border-radius: calc(var(--ifm-global-radius) - 2px);
  border-left: 4px solid var(--ifm-color-primary);
}

.legendCard h4 {
  margin-top: 0;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}

.legendCard p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.legendCard p:last-child {
  margin-bottom: 0;
}

.legendNote {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(217, 119, 6, 0.1);
  border: 1px solid var(--forensic-amber-primary, #D97706);
  border-radius: var(--ifm-global-radius);
  color: var(--ifm-color-content);
  font-size: 0.95rem;
}

.legendNote code {
  background: rgba(217, 119, 6, 0.2);
  color: var(--forensic-amber-primary, #D97706);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

```

### 📄 Archivo: `src\components\SynchrophasorPlot.jsx`
```jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { PolarComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import styles from './InteractiveGraphicsGallery.module.css';

echarts.use([PolarComponent, TooltipComponent, TitleComponent, CustomChart, CanvasRenderer]);

const NUM_VECTORS = 15;

// Generate realistic simulated PMU data for 100 frames (2 seconds at 50Hz, scaled for animation)
const generatePhasorData = (progress) => {
  // progress goes from 0 to 100
  const data = [];
  
  // Phase 1 (0-30): Stable Operation
  // Phase 2 (30-60): Fault triggers, chaotic bursting oscillations
  // Phase 3 (60-100): Voltage collapse, magnitudes approach zero
  
  for (let i = 0; i < NUM_VECTORS; i++) {
    let angle, mag, color;
    
    // Group vectors into regions: North (stable), South (unstable)
    const isSouth = i % 2 !== 0; 
    
    if (progress < 30) {
      // Stable
      const baseAngle = isSouth ? 25 : 15;
      angle = baseAngle + (Math.random() * 4 - 2);
      mag = 1.0 + (Math.random() * 0.02 - 0.01);
      color = isSouth ? '#f59e0b' : '#3b82f6';
    } else if (progress < 60) {
      // Bursting Oscillations
      const instability = (progress - 30) / 30; // 0 to 1
      if (isSouth) {
        angle = 25 + Math.sin(progress * i * 0.5) * 180 * instability;
        mag = 1.0 - (instability * 0.3) + (Math.random() * 0.2 - 0.1);
        color = '#ef4444'; // Turns red
      } else {
        angle = 15 + Math.sin(progress * i * 0.2) * 45 * instability;
        mag = 1.0 - (instability * 0.1);
        color = '#3b82f6';
      }
    } else {
      // Collapse
      const collapse = (progress - 60) / 40; // 0 to 1
      if (isSouth) {
        angle = (Math.random() * 360);
        mag = Math.max(0, 0.7 - collapse * 0.7);
        color = '#ef4444';
      } else {
        angle = 15 + Math.sin(progress * 10) * 10;
        mag = Math.max(0.5, 0.9 - collapse * 0.4);
        color = '#3b82f6';
      }
    }
    
    data.push({
      value: [mag, angle],
      itemStyle: { color }
    });
  }
  
  return data;
};

export default function SynchrophasorPlot({ lang }) {
  const chartRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return p + 0.5; // 50Hz update rate equivalent (200 frames total for 4 seconds)
      });
    }, 20); // 20ms = 50Hz
    return () => clearInterval(interval);
  }, [isPlaying]);

  const baseOption = useMemo(() => ({
    animation: false,
    title: {
      text: lang === 'es' ? 'Desviación Angular Fasorial (PMU)' : 'Phasor Angular Deviation (PMU)',
      subtext: lang === 'es' ? 'Falla del Transformador Granada 400/220kV' : 'Granada 400/220kV Transformer Fault',
      left: 'center',
      top: '5%',
      textStyle: { color: '#ffffff', fontSize: 22, fontWeight: '700', textShadowBlur: 10, textShadowColor: 'rgba(255,255,255,0.3)' },
      subtextStyle: { color: '#94a3b8', fontSize: 14 }
    },
    polar: { center: ['50%', '60%'], radius: '65%' },
    angleAxis: {
      type: 'value',
      min: 0,
      max: 360,
      boundaryGap: false,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.15)', type: 'dashed' } },
      axisLabel: { formatter: '{value}°', color: '#cbd5e1', fontSize: 13, margin: 15 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    radiusAxis: {
      type: 'value',
      min: 0,
      max: 1.2,
      splitLine: { show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.15)' } },
      axisLabel: { formatter: '{value} p.u.', color: '#cbd5e1', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(56, 189, 248, 0.5)',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter: (params) => {
        const mag = params.value[0].toFixed(3);
        const ang = params.value[1].toFixed(2);
        return `<div style="font-family: monospace; padding: 5px;">
                <strong style="color: #cbd5e1">PMU Sensor</strong><br/>
                <hr style="border-color: rgba(255,255,255,0.1); margin: 5px 0;" />
                Tensión RMS: <span style="color:#38bdf8; font-weight: bold;">${mag} p.u.</span><br/>
                Desviación Fase: <span style="color:#f472b6; font-weight: bold;">${ang}°</span>
                </div>`;
      }
    },
    series: [{
      type: 'custom',
      coordinateSystem: 'polar',
      renderItem: function (params, api) {
        const value = [api.value(0), api.value(1)];
        const startPoint = api.coord([0, value[1]]);
        const endPoint = api.coord([value[0], value[1]]);
        const color = api.visual('color');
        return {
          type: 'group',
          children: [{
            type: 'line',
            shape: { x1: startPoint[0], y1: startPoint[1], x2: endPoint[0], y2: endPoint[1] },
            style: api.style({ stroke: color, lineWidth: 4, shadowBlur: 10, shadowColor: color })
          }, {
            type: 'circle',
            shape: { cx: endPoint[0], cy: endPoint[1], r: 7 },
            style: api.style({ fill: color, shadowBlur: 15, shadowColor: color })
          }]
        };
      },
      data: []
    }]
  }), [lang]);

  useEffect(() => {
    if (!chartRef.current) return;
    const eChartsInstance = chartRef.current.getEchartsInstance();
    const newData = generatePhasorData(progress);
    eChartsInstance.setOption({
      series: [{ data: newData }]
    });
  }, [progress]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', minHeight: '650px' }}>
      <div style={{ flex: 1, minHeight: '550px', backgroundColor: '#0a0f1c', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}>
        <ReactEChartsCore
          ref={chartRef}
          echarts={echarts}
          option={baseOption}
          style={{ height: '100%', width: '100%', minHeight: '550px' }}
          theme="dark"
          notMerge={false}
          lazyUpdate={true}
        />
      </div>
      
      {/* Controls Container */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            background: 'var(--ifm-color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '80px'
          }}
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
        <button 
          onClick={handleReset}
          style={{
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            border: '1px solid var(--ifm-color-primary)',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          RESET
        </button>
        
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress}
          onChange={(e) => setProgress(parseFloat(e.target.value))}
          style={{ flex: 1, cursor: 'pointer' }}
        />
        
        <div style={{ fontFamily: 'monospace', color: '#94a3b8', minWidth: '120px', textAlign: 'right' }}>
          T = {(progress * 0.04).toFixed(2)}s
        </div>
      </div>
      
      {/* Explicación del diagrama */}
      <div style={{
        marginTop: '1rem',
        padding: '1.5rem',
        background: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '8px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        color: '#e2e8f0',
        fontSize: '0.95rem',
        lineHeight: '1.6'
      }}>
        <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>
          {lang === 'es' ? '¿Qué muestra este gráfico?' : 'What does this graph show?'}
        </h4>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          {lang === 'es' 
            ? 'Este es un "Diagrama Fasorial" o Polar. Representa la tensión eléctrica en distintos puntos de la red de transporte en tiempo real:'
            : 'This is a "Phasor Diagram" (Polar). It represents the electrical voltage at different points of the transmission grid in real-time:'}
        </p>
        <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{lang === 'es' ? 'El Botón PLAY:' : 'The PLAY button:'}</strong> {lang === 'es' ? 'Simula los 4 segundos críticos del incidente, pasando de la estabilidad al colapso total.' : 'Simulates the 4 critical seconds of the incident, from stability to total collapse.'}
          </li>
          <li style={{ marginBottom: '0.25rem' }}>
            <strong>{lang === 'es' ? 'Las Líneas (Vectores):' : 'The Lines (Vectors):'}</strong> {lang === 'es' ? 'Cada línea es un nudo de la red. Su longitud marca la fuerza del voltaje, y su ángulo marca la sincronización.' : 'Each line is a grid node. Its length marks the voltage strength, and its angle marks synchronization.'}
          </li>
          <li>
            <strong>{lang === 'es' ? 'El círculo "p.u.":' : 'The "p.u." circle:'}</strong> {lang === 'es' ? 'Significa "Por Unidad" (Per Unit). 1.0 p.u. es el voltaje perfecto y normal al 100%. Verás que al final del colapso (cuando se vuelven rojos), los vectores se encogen hacia el centro (0 p.u.), lo que significa que la tensión eléctrica en la red cae a cero: el apagón absoluto.' : 'Stands for "Per Unit". 1.0 p.u. is the perfect 100% normal voltage. Notice how at the end of the collapse (when they turn red), the vectors shrink towards the center (0 p.u.), meaning the electrical voltage drops to zero: total blackout.'}
          </li>
        </ul>
      </div>
    </div>
  );
}

```

### 📄 Archivo: `src\components\UFLSVisualizer\UFLSVisualizer.jsx`
```jsx
import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import TelemetryFallback from '../ForensicUI/TelemetryFallback';

const UFLSVisualizerBase = React.lazy(() => import('./UFLSVisualizerBase'));

export default function UFLSVisualizer(props) {
  return (
    <BrowserOnly fallback={<TelemetryFallback />}>
      {() => (
        <Suspense fallback={<TelemetryFallback />}>
          <UFLSVisualizerBase {...props} />
        </Suspense>
      )}
    </BrowserOnly>
  );
}

```

### 📄 Archivo: `src\components\UFLSVisualizer\UFLSVisualizer.module.css`
```css
.container {
  padding: var(--space-xl);
  background: var(--forensic-bg-primary);
  border: 1px solid var(--forensic-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2xl);
  font-family: var(--font-body);
  box-shadow: inset 0 0 40px var(--forensic-amber-bg-subtle);
  position: relative;
  overflow: hidden;
}

.title {
  color: var(--forensic-text-primary);
  margin-bottom: var(--space-sm);
  font-size: var(--telemetry-lg);
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: var(--telemetry-font);
  font-weight: normal;
}

.subtitle {
  color: var(--forensic-text-secondary);
  font-size: var(--telemetry-sm);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: var(--space-xl);
  font-family: var(--telemetry-font);
}

.errorBox {
  color: var(--forensic-amber-critical);
  font-family: var(--telemetry-font);
  text-align: center;
  border: 1px solid var(--forensic-amber-critical);
  padding: var(--space-lg);
  background-color: var(--forensic-amber-bg-subtle);
}

.legend {
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  font-family: var(--telemetry-font);
  font-size: var(--telemetry-sm);
  color: var(--forensic-text-secondary);
}

.legendItem {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.colorBox {
  width: 16px;
  height: 16px;
  display: inline-block;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .container {
    padding: 16px;
  }
}

```

### 📄 Archivo: `src\components\UFLSVisualizer\UFLSVisualizerBase.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './UFLSVisualizer.module.css';

const UFLSVisualizer = () => {
  const [data, setData] = useState([]);
  const [hasError, setHasError] = useState(false);
  const dataUrl = useBaseUrl('/data/ufls_scheme_iberia.json');

  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      stagePrefix: "Etapa",
      error: "ERROR CRÍTICO: DATOS UFLS OFFLINE",
      title: "ESQUEMA DE CASCADA DE ACTIVACIÓN UFLS",
      subtitle: "Etapas de Deslastre de Carga vs Caída de Frecuencia",
      mwShed: "MW Deslastrados",
      legend1: "Etapa 1 (Activada a 49.0 Hz - Desencadenó cascada de sobretensión)",
      legend2: "Etapas 2-6 (No se activaron antes del colapso)"
    },
    en: {
      stagePrefix: "Stage",
      error: "CRITICAL ERROR: UFLS DATA OFFLINE",
      title: "UFLS ACTIVATION CASCADING SCHEME",
      subtitle: "Load Shedding Stages vs Frequency Decline",
      mwShed: "MW Shed",
      legend1: "Stage 1 (Activated at 49.0 Hz - Triggered Overvoltage Cascade)",
      legend2: "Stages 2-6 (Did not activate before collapse)"
    },
    pt: {
      stagePrefix: "Estágio",
      error: "ERRO CRÍTICO: DADOS UFLS OFFLINE",
      title: "ESQUEMA DE CASCATA DE ATIVAÇÃO UFLS",
      subtitle: "Estágios de Corte de Carga vs Queda de Frequência",
      mwShed: "MW Cortados",
      legend1: "Estágio 1 (Ativado a 49.0 Hz - Desencadeou cascata de sobretensão)",
      legend2: "Estágios 2-6 (Não ativados antes do colapso)"
    },
    fr: {
      stagePrefix: "Étape",
      error: "ERREUR CRITIQUE: DONNÉES UFLS HORS LIGNE",
      title: "SCHÉMA DE CASCADE D'ACTIVATION UFLS",
      subtitle: "Étapes de Délestage vs Baisse de Fréquence",
      mwShed: "MW Délestés",
      legend1: "Étape 1 (Activée à 49.0 Hz - A déclenché une cascade de surtension)",
      legend2: "Étapes 2-6 (Non activées avant l'effondrement)"
    },
    it: {
      stagePrefix: "Fase",
      error: "ERRORE CRITICO: DATI UFLS OFFLINE",
      title: "SCHEMA A CASCATA DI ATTIVAZIONE UFLS",
      subtitle: "Fasi di Distacco Carico vs Calo di Frequenza",
      mwShed: "MW Distaccati",
      legend1: "Fase 1 (Attivata a 49.0 Hz - Ha innescato la cascata di sovratensione)",
      legend2: "Fasi 2-6 (Non attivate prima del collasso)"
    },
    de: {
      stagePrefix: "Stufe",
      error: "KRITISCHER FEHLER: UFLS-DATEN OFFLINE",
      title: "UFLS-AKTIVIERUNGS-KASKADENSCHEMA",
      subtitle: "Lastabwurfstufen vs. Frequenzabfall",
      mwShed: "MW Abgeworfen",
      legend1: "Stufe 1 (Aktiviert bei 49,0 Hz - Löste Überspannungskaskade aus)",
      legend2: "Stufen 2-6 (Wurden vor dem Kollaps nicht aktiviert)"
    }
  };

  const t = T[currentLocale] || T.en;

  useEffect(() => {
    fetch(dataUrl)
      .then(res => res.json())
      .then(json => {
        const formattedData = json.stages.map(stage => ({
          name: `${t.stagePrefix} ${stage.stage}`,
          freq: stage.frequency_hz,
          shed_es: stage.load_shed_mw_spain,
          shed_pt: stage.load_shed_mw_portugal,
          total_shed: stage.load_shed_mw_spain + stage.load_shed_mw_portugal,
          zones: stage.zones_affected.join(', ')
        }));
        setData(formattedData);
        setHasError(false);
      })
      .catch(err => {
        console.error('Error loading UFLS data:', err);
        setHasError(true);
      });
  }, [dataUrl]);

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.errorBox}>
          <h3>{t.error}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t.title}</h3>
      <p className={styles.subtitle}>{t.subtitle}</p>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--forensic-border)" horizontal={false} />
          <XAxis type="number" stroke="var(--forensic-border-strong)" tick={{ fill: "var(--forensic-text-secondary)", fontSize: 11, fontFamily: 'var(--telemetry-font)' }} />
          <YAxis dataKey="name" type="category" stroke="var(--forensic-border-strong)" tick={{ fill: "var(--forensic-text-secondary)", fontSize: 11, fontFamily: 'var(--telemetry-font)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--telemetry-font)' }}
            labelStyle={{ color: 'var(--forensic-text-primary)' }}
            itemStyle={{ color: 'var(--forensic-amber-primary)' }}
            cursor={{fill: 'var(--forensic-amber-bg-subtle)'}}
          />
          <Bar dataKey="total_shed" name={t.mwShed} fill="var(--forensic-amber-primary)" barSize={20}>
             {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.freq <= 49.0 && entry.freq > 48.8 ? 'var(--forensic-amber-critical)' : 'var(--forensic-amber-muted)'} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: 'var(--forensic-amber-critical)' }}></span>
          <span>{t.legend1}</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.colorBox} style={{ background: 'var(--forensic-amber-muted)' }}></span>
          <span>{t.legend2}</span>
        </div>
      </div>
    </div>
  );
};

export default UFLSVisualizer;

```

### 📄 Archivo: `src\components\VerticalTimeline.jsx`
```jsx
import React from 'react';
import styles from './VerticalTimeline.module.css';
import { timelineEvents } from '../data/timelineData';

export default function VerticalTimeline({ lang = 'es' }) {
  const getLocalizedEvent = (event, l) => {
    const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[l] || es);
    
    let title = event.title_es;
    let desc = event.desc_es;
    let dateStr = event.date;

    if (event.id === "t1") {
      title = t("Eventos Precursores en Núñez de Balboa", "Precursor Events at Núñez de Balboa", "Eventos Precursores em Núñez de Balboa", "Événements Précurseurs à Núñez de Balboa", "Eventi Precursori a Núñez de Balboa", "Vorläuferereignisse in Núñez de Balboa");
      desc = t("Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.", "Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.", "Registram-se oscilações de tensão que provocam disparos idênticos aos que ocorreriam no 28-A, evidenciando o estreitamento das margens de reativa.", "Des oscillations de tension sont enregistrées, provoquant des déclenchements identiques à ceux qui se produiraient le 28 avril, mettant en évidence le rétrécissement des marges réactives.", "Si registrano oscillazioni di tensione che provocano scatti identici a quelli che si verificherebbero il 28 aprile, evidenziando il restringimento dei margini di reattiva.", "Es werden Spannungsschwankungen aufgezeichnet, die identische Auslösungen wie am 28. April verursachen und die Verengung der Blindleistungsmargen belegen.");
      dateStr = t("22 de abril de 2025", "April 22, 2025", "22 de abril de 2025", "22 avril 2025", "22 aprile 2025", "22. April 2025");
    } else if (event.id === "t2") {
      title = t("Transición de Control en HVDC INELFE-1", "Control Transition in INELFE-1 HVDC", "Transição de Controle em HVDC INELFE-1", "Transition de Contrôle dans HVDC INELFE-1", "Transizione di Controllo in HVDC INELFE-1", "Steuerungsübergang in HVDC INELFE-1");
      desc = t("Paso de PMODE3 a PMODE1, limitando la capacidad de respuesta dinámica del enlace frente a perturbaciones posteriores.", "Transition from PMODE3 to PMODE1, limiting the dynamic response capacity of the link against subsequent disturbances.", "Passagem do PMODE3 para PMODE1, limitando a capacidade de resposta dinâmica da ligação perante perturbações posteriores.", "Passage du PMODE3 au PMODE1, limitant la capacité de réponse dynamique de la liaison face aux perturbations ultérieures.", "Passaggio da PMODE3 a PMODE1, limitando la capacità di risposta dinamica del collegamento a fronte di perturbazioni successive.", "Übergang von PMODE3 zu PMODE1, was die dynamische Reaktionsfähigkeit der Verbindung bei nachfolgenden Störungen einschränkt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t3") {
      title = t("Déficit de Potencia Reactiva (Fase 1)", "Reactive Power Deficit (Phase 1)", "Déficit de Potência Reativa (Fase 1)", "Déficit de Puissance Réactive (Phase 1)", "Deficit di Potenza Reattiva (Fase 1)", "Blindleistungsdefizit (Phase 1)");
      desc = t("Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de absorción.", "Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net absorption deficit.", "As manobras de malhagem (LIN&SHN) reduzem a margem de colapso em 57% na zona sul, gerando um déficit líquido de absorção.", "Les manœuvres de maillage (LIN&SHN) réduisent la marge d'effondrement de 57% dans la zone sud, générant un déficit net d'absorption.", "Le manovre di magliatura (LIN&SHN) riducono il margine di collasso del 57% nella zona sud, generando un deficit netto di assorbimento.", "Vermaschungsmanöver (LIN&SHN) reduzieren die Kollapsmarge im Süden um 57% und erzeugen ein Netto-Absorptionsdefizit.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t4") {
      title = t("Amplificación Tap-Lag (Fase 2)", "Tap-Lag Amplification (Phase 2)", "Amplificação Tap-Lag (Fase 2)", "Amplification Tap-Lag (Phase 2)", "Amplificazione Tap-Lag (Fase 2)", "Tap-Lag-Verstärkung (Phase 2)");
      desc = t("Desacoplamiento entre la red de 400 kV (observada por REE) y las redes colectoras renovables, donde la tensión escala silenciosamente.", "Decoupling between the 400 kV grid (observed by REE) and renewable collector grids, where voltage scales silently.", "Desacoplamento entre a rede de 400 kV (observada pela REE) e as redes coletoras renováveis, onde a tensão aumenta silenciosamente.", "Découplage entre le réseau 400 kV (observé par REE) et les réseaux collecteurs renouvelables, où la tension augmente silencieusement.", "Disaccoppiamento tra la rete a 400 kV (osservata da REE) e le reti collettrici rinnovabili, dove la tensione sale silenziosamente.", "Entkopplung zwischen dem 400-kV-Netz (von REE beobachtet) und den erneuerbaren Kollektornetzen, wo die Spannung unbemerkt ansteigt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t5") {
      title = t("Disparo Raíz en Granada", "Root Trip in Granada", "Disparo Raiz em Granada", "Déclenchement Racine à Grenade", "Scatto Radice a Granada", "Wurzelauslösung in Granada");
      desc = t("El secundario colector alcanza ~145 kV (>1,10 p.u.), desencadenando la primera protección por sobretensión de inversores solares.", "Collector secondary reaches ~145 kV (>1.10 p.u.), triggering the first overvoltage protection of solar inverters.", "O secundário coletor atinge ~145 kV (>1,10 p.u.), desencadeando a primeira proteção por sobretensão dos inversores solares.", "Le secondaire collecteur atteint ~145 kV (>1,10 p.u.), déclenchant la première protection contre les surtensions des onduleurs solaires.", "Il secondario collettore raggiunge ~145 kV (>1,10 p.u.), innescando la prima protezione da sovratensione degli inverter solari.", "Der Kollektor-Sekundärkreis erreicht ~145 kV (>1,10 p.u.) und löst den ersten Überspannungsschutz der Solar-Wechselrichter aus.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t6") {
      title = t("Inicio de Cascada Geométrica (Fase 3)", "Onset of Geometric Cascade (Phase 3)", "Início da Cascata Geométrica (Fase 3)", "Début de la Cascade Géométrique (Phase 3)", "Inizio della Cascata Geometrica (Fase 3)", "Beginn der geometrischen Kaskade (Phase 3)");
      desc = t("Propagación masiva de sobretensiones por el sur y oeste peninsular, provocando la desconexión en cadena de plantas fotovoltaicas.", "Massive propagation of overvoltages through the southern and western peninsula, causing a chain disconnection of PV plants.", "Propagação massiva de sobretensões pelo sul e oeste peninsular, provocando a desconexão em cadeia de usinas fotovoltaicas.", "Propagation massive de surtensions dans le sud et l'ouest de la péninsule, provoquant la déconnexion en chaîne des centrales photovoltaïques.", "Propagazione massiccia di sovratensioni nel sud e nell'ovest della penisola, provocando la disconnessione a catena degli impianti fotovoltaici.", "Massive Ausbreitung von Überspannungen über die südliche und westliche Halbinsel, was zu einer Kettenabschaltung von PV-Anlagen führt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t7") {
      title = t("Pérdida de Sincronismo ES-FR", "Loss of Synchronism ES-FR", "Perda de Sincronismo ES-FR", "Perte de Synchronisme ES-FR", "Perdita di Sincronismo ES-FR", "Verlust des Synchronismus ES-FR");
      desc = t("La oscilación de potencia y la importación de emergencia (>4.600 MW) fuerzan la apertura de la interconexión con Francia.", "Power oscillation and emergency import (>4,600 MW) force the opening of the interconnection with France.", "A oscilação de potência e a importação de emergência (>4.600 MW) forçam a abertura da interconexão com a França.", "L'oscillation de puissance et l'importation d'urgence (>4 600 MW) forcent l'ouverture de l'interconnexion avec la France.", "L'oscillazione di potenza e l'importazione di emergenza (>4.600 MW) costringono l'apertura dell'interconnessione con la Francia.", "Die Leistungsschwankung und der Notimport (>4.600 MW) erzwingen die Öffnung der Verbindung mit Frankreich.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t8") {
      title = t("Cero Eléctrico (Blackout)", "System Blackout", "Zero Elétrico (Blackout)", "Zéro Électrique (Blackout)", "Zero Elettrico (Blackout)", "System-Blackout");
      desc = t("Pérdida total de 15 GW de generación y caída a 0 Hz. El sistema ibérico se apaga por completo dejando a 60 millones sin suministro.", "Total loss of 15 GW generation and drop to 0 Hz. The Iberian system completely shuts down, leaving 60 million without supply.", "Perda total de 15 GW de geração e queda a 0 Hz. O sistema ibérico desliga-se completamente deixando 60 milhões sem fornecimento.", "Perte totale de 15 GW de production et chute à 0 Hz. Le système ibérique s'éteint complètement, laissant 60 millions de personnes sans électricité.", "Perdita totale di 15 GW di generazione e caduta a 0 Hz. Il sistema iberico si spegne completamente lasciando 60 milioni senza corrente.", "Totaler Verlust von 15 GW Erzeugung und Abfall auf 0 Hz. Das iberische System schaltet sich komplett ab und lässt 60 Millionen ohne Versorgung.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t9") {
      title = t("Fragmentación e Intentos Bottom-Up (Fase 4)", "Fragmentation & Bottom-Up Attempts (Phase 4)", "Fragmentação e Tentativas Bottom-Up (Fase 4)", "Fragmentation et Tentatives Bottom-Up (Phase 4)", "Frammentazione e Tentativi Bottom-Up (Fase 4)", "Fragmentierung & Bottom-Up Versuche (Phase 4)");
      desc = t("División en 7 islas eléctricas. Múltiples fracasos de energización autónoma (Black Start) desde centrales hidroeléctricas sin masa síncrona.", "Division into 7 electrical islands. Multiple failures of autonomous energization (Black Start) from hydro plants without synchronous mass.", "Divisão em 7 ilhas elétricas. Múltiplos fracassos de energização autônoma (Black Start) a partir de hidrelétricas sem massa síncrona.", "Division en 7 îlots électriques. Multiples échecs d'énergisation autonome (Black Start) à partir de centrales hydroélectriques sans masse synchrone.", "Divisione in 7 isole elettriche. Molteplici fallimenti di energizzazione autonoma (Black Start) da centrali idroelettriche senza massa sincrona.", "Aufteilung in 7 elektrische Inseln. Mehrere Ausfälle der autonomen Stromversorgung (Black Start) von Wasserkraftwerken ohne synchrone Masse.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t10") {
      title = t("Reposición Completa de la Demanda", "Full Demand Restoration", "Reposição Completa da Demanda", "Restauration Complète de la Demande", "Ripristino Completo della Domanda", "Vollständige Wiederherstellung der Nachfrage");
      desc = t("Tras 19 horas ininterrumpidas de maniobras y conexión escalonada de carga (Top-Down desde FR/MA), se recuperan los 25 GW de demanda perdidos.", "After 19 uninterrupted hours of maneuvers and staggered load connection (Top-Down from FR/MA), the lost 25 GW of demand is recovered.", "Após 19 horas ininterruptas de manobras e conexão escalonada de carga (Top-Down a partir de FR/MA), recuperam-se os 25 GW de demanda perdidos.", "Après 19 heures ininterrompues de manœuvres et de connexion échelonnée de charge (Top-Down depuis FR/MA), les 25 GW de demande perdus sont récupérés.", "Dopo 19 ore ininterrotte di manovre e connessione scaglionata di carico (Top-Down da FR/MA), si recuperano i 25 GW di domanda persi.", "Nach 19 ununterbrochenen Stunden mit Manövern und gestaffelter Lastzuschaltung (Top-Down von FR/MA) werden die verlorenen 25 GW Nachfrage wiederhergestellt.");
      dateStr = t("29 de abril de 2025", "April 29, 2025", "29 de abril de 2025", "29 avril 2025", "29 aprile 2025", "29. April 2025");
    }
    
    return { title, desc, dateStr };
  };

  return (
    <div className={styles.timelineContainer}>
      {timelineEvents.map((event, index) => {
        // Alternating left/right layout classes
        const alignmentClass = index % 2 === 0 ? styles.leftEvent : styles.rightEvent;
        
        // Dynamic border color based on event severity
        let typeColor = 'var(--ifm-color-primary)';
        if (event.type === 'warning') typeColor = '#f39c12';
        if (event.type === 'danger') typeColor = '#e74c3c';
        if (event.type === 'critical') typeColor = '#c0392b';
        if (event.type === 'success') typeColor = '#27ae60';
        
        const loc = getLocalizedEvent(event, lang);

        return (
          <div key={event.id} className={`${styles.timelineBlock} ${alignmentClass}`}>
            <div 
              className={styles.timelineDot} 
              style={{ backgroundColor: typeColor, boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 0 8px ${typeColor}33` }}
            ></div>
            
            <div className={styles.timelineContent} style={{ borderTop: `4px solid ${typeColor}` }}>
              <div className={styles.timeBadge}>
                {loc.dateStr} • {event.time}
              </div>
              <h3 className={styles.eventTitle}>
                {loc.title}
              </h3>
              <p className={styles.eventDesc}>
                {loc.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

```

### 📄 Archivo: `src\components\VerticalTimeline.module.css`
```css
.timelineContainer {
  position: relative;
  max-width: 800px;
  margin: 3rem auto;
  padding: 1rem 0;
}

/* Central vertical line */
.timelineContainer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  margin-left: -2px;
  background-color: var(--ifm-color-emphasis-300);
  border-radius: 4px;
}

.timelineBlock {
  position: relative;
  margin-bottom: 2.5rem;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.timelineBlock.rightEvent {
  justify-content: flex-end;
}

.timelineDot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: -10px;
  margin-top: -10px;
  z-index: 2;
  box-shadow: 0 0 0 4px var(--ifm-background-color);
}

.timelineContent {
  width: 45%;
  background-color: var(--ifm-background-surface-color);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  position: relative;
  transition: transform 0.3s ease;
}

.timelineContent:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* Arrows pointing to the line */
.leftEvent .timelineContent::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -10px;
  margin-top: -10px;
  border-width: 10px 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent transparent var(--ifm-background-surface-color);
}

.rightEvent .timelineContent::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -10px;
  margin-top: -10px;
  border-width: 10px 10px 10px 0;
  border-style: solid;
  border-color: transparent var(--ifm-background-surface-color) transparent transparent;
}

.timeBadge {
  display: inline-block;
  background-color: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-emphasis-800);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.eventTitle {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--ifm-heading-color);
  line-height: 1.3;
}

.eventDesc {
  font-size: 0.95rem;
  color: var(--ifm-color-emphasis-700);
  margin: 0;
  line-height: 1.5;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timelineContainer::before {
    left: 20px;
  }
  
  .timelineBlock,
  .timelineBlock.rightEvent {
    justify-content: flex-end;
  }
  
  .timelineDot {
    left: 20px;
  }
  
  .timelineContent {
    width: calc(100% - 60px);
  }
  
  .leftEvent .timelineContent::before,
  .rightEvent .timelineContent::before {
    left: -10px;
    right: auto;
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--ifm-background-surface-color) transparent transparent;
  }
}

```

### 📄 Archivo: `src\css\custom.css`
```css
@import './designTokens.css';

/* ============================================================
   TFG Apagón Ibérico 28A — Cyberpunk Editorial Custom CSS
   ============================================================ */

:root {
  /* ── Brand / acentos ─────────────────────────────────── */
  --accent-electric: hsl(190 100% 60%);   /* cian CECOEL — datos fríos */
  --accent-amber: var(--forensic-amber-primary); /* ámbar — alarma / transición */
  --accent-magenta: hsl(322 100% 62%);   /* glitch / dato anómalo */

  /* ── Backgrounds (dark, base) ─────────────────────────── */
  --bg-0: hsl(220 60% 3%);     /* fondo deep — el "apagón" */
  --bg-1: hsl(220 40% 6%);     /* cards base */
  --bg-2: hsl(220 32% 10%);    /* surfaces elevadas */
  --bg-3: hsl(220 25% 14%);    /* hover state */

  /* ── Texto (jerarquía 4 niveles) ──────────────────────── */
  --text-0: hsl(220 20% 98%);  /* primario — titulares */
  --text-1: hsl(220 15% 88%);  /* secundario — body */
  --text-2: hsl(220 12% 68%);  /* terciario — captions */
  --text-3: hsl(220 10% 48%);  /* meta — fuentes, dek */

  /* ── Escala danger/warning ────────────────────────────── */
  --warn-300: hsl(38 95% 70%);
  --warn-500: hsl(38 100% 56%);
  --warn-700: hsl(28 100% 46%);
  --danger-300: hsl(8 85% 70%);
  --danger-500: hsl(0 75% 56%);
  --danger-700: hsl(0 80% 38%);
  --danger-900: hsl(0 70% 22%);  /* el rojo del colapso */

  /* ── Gradients narrativos ─────────────────────────────── */
  --grad-calm:     linear-gradient(180deg, hsl(220 60% 4%), hsl(220 50% 8%));
  --grad-tension:  linear-gradient(180deg, hsl(220 50% 6%), hsl(38 50% 12%));
  --grad-collapse: linear-gradient(180deg, hsl(0 70% 10%), hsl(220 60% 3%));

  /* ── Docusaurus override ──────────────────────────────── */
  --ifm-color-primary: var(--accent-electric);
  --ifm-color-primary-dark: hsl(190 100% 50%);
  --ifm-color-primary-darker: hsl(190 100% 45%);
  --ifm-color-primary-darkest: hsl(190 100% 40%);
  --ifm-color-primary-light: hsl(190 100% 70%);
  --ifm-color-primary-lighter: hsl(190 100% 80%);
  --ifm-color-primary-lightest: hsl(190 100% 90%);
  --ifm-background-color: var(--bg-0);
  --ifm-background-surface-color: var(--bg-1);
  --ifm-font-color-base: var(--text-1);
  
  --ifm-color-success: #10b981;
  --ifm-color-warning: var(--accent-amber);
  --ifm-color-danger: var(--danger-500);

  /* ── Tipografía (Fuentes y clamp) ──────────────────────── */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', monospace;

  /* Type scale — Perfect Fourth (1.333) entre 320px y 1440px */
  --fs-caption: clamp(0.75rem, 0.7rem + 0.2vw, 0.85rem);
  --fs-meta:    clamp(0.8rem,  0.75rem + 0.25vw, 0.9rem);
  --fs-body:    clamp(1rem,    0.95rem + 0.3vw,  1.125rem);
  --fs-lead:    clamp(1.125rem, 1rem + 0.6vw,    1.35rem);
  --fs-h6:      clamp(1rem,    0.9rem + 0.5vw,   1.2rem);
  --fs-h5:      clamp(1.15rem, 1rem + 0.8vw,     1.45rem);
  --fs-h4:      clamp(1.4rem,  1.1rem + 1.2vw,   1.85rem);
  --fs-h3:      clamp(1.75rem, 1.3rem + 1.8vw,   2.4rem);
  --fs-h2:      clamp(2.2rem,  1.6rem + 2.6vw,   3.2rem);
  --fs-h1:      clamp(2.8rem,  2rem + 4vw,       4.8rem);
  --fs-display: clamp(3.6rem,  2.5rem + 6vw,     7rem);

  --lh-tight: 1.05;
  --lh-snug:  1.2;
  --lh-body:  1.65;

  --tr-tight: -0.03em;
  --tr-loose: 0.12em;

  --ifm-font-family-base: var(--font-body);
  --ifm-heading-font-family: var(--font-display);
  --ifm-font-family-monospace: var(--font-mono);
  --ifm-font-size-base: var(--fs-body);
  --ifm-line-height-base: var(--lh-body);

  /* Code highlight */
  --docusaurus-highlighted-code-line-bg: hsl(190 100% 60% / 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

html[data-theme='light'] {
  --bg-0: #f5f2eb;
  --bg-1: #efebe1;
  --bg-2: #e8e3d5;
  --text-0: #111827;
  --text-1: #1b1b1b;
  --text-2: #374151;
  --text-3: #4b5563;
  transition: background-color 0.4s ease, color 0.4s ease;
}

/* Glassmorphism Navbar */
.navbar {
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  background: color-mix(in srgb, var(--bg-1) 85%, transparent) !important;
  box-shadow: var(--glass-shadow);
  border-bottom: 1px solid hsl(220 25% 20%);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease;
}

html[data-theme='light'] .navbar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.navbar__title {
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text-0) !important;
  transition: opacity 0.3s ease;
}

/* Smooth transitions for interactive elements */
a, .button, .menu__link, .pagination-nav__link {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   TYPOGRAPHY
   ============================================================ */

h1, .h1 {
  font: 700 var(--fs-h1)/var(--lh-tight) var(--font-display);
  letter-spacing: var(--tr-tight); color: var(--text-0);
  margin-bottom: 1.5rem;
}
h2 { font: 600 var(--fs-h2)/var(--lh-snug) var(--font-display); letter-spacing: var(--tr-tight); margin-top: 3rem; margin-bottom: 1.2rem; }
h3 { font: 600 var(--fs-h3)/var(--lh-snug) var(--font-display); margin-top: 2rem; }
h4 { font: 600 var(--fs-h4)/var(--lh-snug) var(--font-display); }
h5 { font: 500 var(--fs-h5)/1.3 var(--font-body); }
h6 { font: 500 var(--fs-h6)/1.3 var(--font-body); letter-spacing: 0.02em; }

.lead { font-size: var(--fs-lead); color: var(--text-0); font-weight: 500; }

.meta, .source, time, .fig, kbd {
  font: 500 var(--fs-meta)/1.3 var(--font-mono);
  letter-spacing: var(--tr-loose);
  text-transform: uppercase;
  color: var(--text-3);
}

code, pre, .number, .data {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

/* Drop-cap editorial para el primer párrafo de cada capítulo */
.chapter > p:first-of-type::first-letter {
  font-family: var(--font-display);
  font-size: 4em; line-height: 0.85;
  float: left; padding: 0.05em 0.1em 0 0;
  color: var(--accent-electric);
  text-shadow: 0 0 24px hsl(190 100% 60% / 0.4);
}

/* ============================================================
   TABLES
   ============================================================ */

/* Base Wrapper to fix mobile overflow globally */
.telemetry-table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 2rem 0;
  border-radius: 4px;
}

/* Base Forensic Table Styling */
.forensic-table table,
table.forensic-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  background: rgba(255, 170, 0, 0.015);
  font-family: var(--font-body);
  font-size: 0.9em;
  position: relative;
}

/* Subtle scanline texture layer */
.forensic-table table::before,
table.forensic-table::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 170, 0, 0.02) 1px, rgba(255, 170, 0, 0.02) 2px);
  pointer-events: none;
  opacity: 0.5;
  z-index: 0;
}

.forensic-table th,
.forensic-table td,
table.forensic-table th,
table.forensic-table td {
  position: relative;
  z-index: 1;
}

.forensic-table th,
table.forensic-table th {
  background: linear-gradient(to bottom, rgba(255,170,0,0.12), rgba(255,170,0,0.05));
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-electric);
  padding: var(--space-md) var(--space-lg);
  text-align: left;
  border-bottom: 1px solid rgba(255,170,0,0.3);
  font-family: var(--telemetry-font);
}

html[data-theme='light'] .forensic-table th,
html[data-theme='light'] table.forensic-table th {
  color: var(--text-0);
  background: linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.02));
  border-bottom: 2px solid rgba(0,0,0,0.1);
}

.forensic-table td,
table.forensic-table td {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid rgba(255,170,0,0.08);
  border-right: 1px solid rgba(255,170,0,0.02);
  color: var(--forensic-text-primary);
  text-align: left;
  font-variant-numeric: tabular-nums;
  font-family: var(--telemetry-font);
}

.forensic-table tr:hover td,
table.forensic-table tr:hover td {
  background: rgba(255,170,0,0.04);
}

/* Specific styling for narrative cells that shouldn't be monospace */
.forensic-table .narrative-cell {
  font-family: var(--font-body);
  color: var(--text-1);
}

/* Semantic Row States */
.forensic-table tr.state-normal td {
  background: rgba(255, 210, 150, 0.02);
}
.forensic-table tr.state-normal td:first-child {
  border-left: 3px solid rgba(255, 210, 150, 0.5);
}

.forensic-table tr.state-warning td {
  background: rgba(255, 170, 0, 0.05);
}
.forensic-table tr.state-warning td:first-child {
  border-left: 3px solid var(--forensic-amber-primary);
}

.forensic-table tr.state-critical td {
  background: rgba(255, 85, 0, 0.06);
}
.forensic-table tr.state-critical td:first-child {
  border-left: 3px solid var(--forensic-amber-warning);
}

.forensic-table tr.state-blackout td {
  background: rgba(204, 17, 0, 0.08);
  color: #ffb3b3; /* slightly red tinted text */
}
.forensic-table tr.state-blackout td:first-child {
  border-left: 3px solid var(--forensic-amber-critical);
}

/* Metadata components for tables */
.telemetry-metadata {
  margin-bottom: var(--space-xs);
  font-family: var(--telemetry-font);
  font-size: var(--telemetry-xs);
  letter-spacing: 0.05em;
  color: var(--forensic-text-dim);
  text-transform: uppercase;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.telemetry-header {
  font-weight: 700;
  color: var(--forensic-text-secondary);
  margin-bottom: 4px;
}

/* ============================================================
   KATEX MATH
   ============================================================ */

.math.math-display {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--ifm-color-emphasis-50);
  border-radius: 12px;
  border-left: 4px solid var(--ifm-color-primary);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  overflow-x: auto;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.math.math-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.05);
}

html[data-theme='dark'] .math.math-display {
  background: rgba(15, 23, 42, 0.6);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
}

.katex-display {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
}

/* ============================================================
   IMAGES & MEDIA
   ============================================================ */

.markdown img {
  border-radius: 12px;
  box-shadow: var(--glass-shadow);
  display: block;
  margin: 2rem auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.markdown img:hover {
  transform: scale(1.02);
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}

/* ============================================================
   CUSTOM ALERTS (INCIDENT BOX)
   ============================================================ */

.incident-box {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.1);
}

.incident-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--ifm-color-danger);
  box-shadow: 0 0 10px var(--ifm-color-danger);
}

html[data-theme='dark'] .incident-box {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.05));
  border-color: rgba(239, 68, 68, 0.4);
}

.incident-box h4 {
  color: var(--ifm-color-danger);
  font-size: 1.3rem;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

html[data-theme='dark'] .incident-box h4 {
  color: #fca5a5;
}

/* ============================================================
   ADMONITIONS (Docusaurus Default Overrides)
   ============================================================ */

.theme-admonition {
  border-radius: var(--radius-md);
  background: var(--forensic-bg-surface) !important;
  border: 1px solid var(--forensic-border) !important;
  border-left: 4px solid var(--forensic-amber-primary) !important;
  color: var(--forensic-text-primary) !important;
  font-family: var(--font-body);
}

.theme-admonition-danger { border-left-color: var(--forensic-amber-critical) !important; }
.theme-admonition-warning { border-left-color: var(--forensic-amber-warning) !important; }

@media (max-width: 768px) {
  .math.math-display {
    padding: 1rem 0.5rem;
    font-size: 0.9em;
    overflow-x: auto;
  }
}

/* ============================================================
   RESPONSIVE OVERRIDES
   ============================================================ */

@media (max-width: 768px) {
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.8rem; }
  
  .incident-box {
    padding: 1rem 1.25rem;
  }
}

/* ============================================================
   ZEN MODE (FOCUS MODE)
   ============================================================ */

html.zen-mode .theme-doc-sidebar-container,
html.zen-mode .theme-doc-toc-desktop,
html.zen-mode .theme-doc-toc-mobile {
  display: none !important;
}

html.zen-mode main[class*='docMainContainer'] {
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
  max-width: 100% !important;
}

html.zen-mode main[class*='docMainContainer'] > .container {
  max-width: 900px !important;
  margin: 0 auto !important;
  width: 100%;
}

html.zen-mode main[class*='docMainContainer'] .row {
  justify-content: center !important;
  margin: 0 !important;
}

/* Force ANY column inside the main container to expand completely */
html.zen-mode main[class*='docMainContainer'] .row [class*='col'],
html.zen-mode [class*='docItemCol'] {
  max-width: 100% !important;
  flex: 1 1 100% !important;
  padding: 0 !important;
  width: 100% !important;
}

html.zen-mode article,
html.zen-mode .theme-doc-markdown {
  max-width: 900px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 100%;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .zen-mode-text {
    display: none;
  }
}

#zen-mode-toggle {
  cursor: pointer;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--ifm-navbar-link-color);
  transition: all 0.2s ease;
}

#zen-mode-toggle:hover {
  background: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-primary);
}

html.zen-mode #zen-mode-toggle {
  background: var(--ifm-color-primary-lightest);
  color: var(--ifm-color-primary-darker);
}

html[data-theme='dark'].zen-mode #zen-mode-toggle {
  background: rgba(56, 189, 248, 0.2);
  color: var(--ifm-color-primary-light);
}

/* Estilos para Formulas KaTeX */
.math-display {
  text-align: center;
  font-size: 1.3em;
  margin: 2rem 0;
  overflow-x: auto;
}


.formula-legend {
  background: var(--ifm-color-emphasis-100);
  border-left: 4px solid var(--ifm-color-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-size: 0.9em;
}
.formula-legend ul {
  margin-bottom: 0;
  padding-left: 1.2rem;
}

/* Zen mode text and icon toggling */
.zen-mode-text-active,
.zen-mode-icon-active {
  display: none;
}
html.zen-mode .zen-mode-text-default,
html.zen-mode .zen-mode-icon-default {
  display: none;
}
html.zen-mode .zen-mode-text-active {
  display: inline;
}
html.zen-mode .zen-mode-icon-active {
  display: block;
}


/* Fix Lenis Sidebar Scroll Hijack */
.theme-doc-sidebar-container, .theme-doc-sidebar-menu, aside { overscroll-behavior: contain; }

/* ============================================================
   FOOTER (Estética y tamaño reducido)
   ============================================================ */

.footer {
  font-size: 0.85rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-1);
}

.footer__title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-2);
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.footer__link-item {
  color: var(--text-3);
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
  line-height: 1.8;
}

.footer__link-item:hover {
  color: var(--ifm-color-primary);
  text-decoration: none;
  transform: translateX(4px);
}

.footer__copyright {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #fca5a5;
}

/* ============================================================
   ADMONITIONS (Docusaurus Default Overrides)
   ============================================================ */

.theme-admonition {
  border-radius: var(--radius-md);
  background: var(--forensic-bg-surface) !important;
  border: 1px solid var(--forensic-border) !important;
  border-left: 4px solid var(--forensic-amber-primary) !important;
  color: var(--forensic-text-primary) !important;
  font-family: var(--font-body);
}

.theme-admonition-danger { border-left-color: var(--forensic-amber-critical) !important; }
.theme-admonition-warning { border-left-color: var(--forensic-amber-warning) !important; }

@media (max-width: 768px) {
  .math.math-display {
    padding: 1rem 0.5rem;
    font-size: 0.9em;
    overflow-x: auto;
  }
}

/* ============================================================
   RESPONSIVE OVERRIDES
   ============================================================ */

@media (max-width: 768px) {
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.8rem; }
  
  .incident-box {
    padding: 1rem 1.25rem;
  }
}

/* ============================================================
   ZEN MODE (FOCUS MODE)
   ============================================================ */

html.zen-mode .theme-doc-sidebar-container,
html.zen-mode .theme-doc-toc-desktop,
html.zen-mode .theme-doc-toc-mobile {
  display: none !important;
}

html.zen-mode main[class*='docMainContainer'] {
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
  max-width: 100% !important;
}

html.zen-mode main[class*='docMainContainer'] > .container {
  max-width: 900px !important;
  margin: 0 auto !important;
  width: 100%;
}

html.zen-mode main[class*='docMainContainer'] .row {
  justify-content: center !important;
  margin: 0 !important;
}

/* Force ANY column inside the main container to expand completely */
html.zen-mode main[class*='docMainContainer'] .row [class*='col'],
html.zen-mode [class*='docItemCol'] {
  max-width: 100% !important;
  flex: 1 1 100% !important;
  padding: 0 !important;
  width: 100% !important;
}

html.zen-mode article,
html.zen-mode .theme-doc-markdown {
  max-width: 900px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  width: 100%;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .zen-mode-text {
    display: none;
  }
}

#zen-mode-toggle {
  cursor: pointer;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--ifm-navbar-link-color);
  transition: all 0.2s ease;
}

#zen-mode-toggle:hover {
  background: var(--ifm-color-emphasis-100);
  color: var(--ifm-color-primary);
}

html.zen-mode #zen-mode-toggle {
  background: var(--ifm-color-primary-lightest);
  color: var(--ifm-color-primary-darker);
}

html[data-theme='dark'].zen-mode #zen-mode-toggle {
  background: rgba(56, 189, 248, 0.2);
  color: var(--ifm-color-primary-light);
}

/* Estilos para Formulas KaTeX */
.math-display {
  text-align: center;
  font-size: 1.3em;
  margin: 2rem 0;
  overflow-x: auto;
}


.formula-legend {
  background: var(--ifm-color-emphasis-100);
  border-left: 4px solid var(--ifm-color-primary);
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-size: 0.9em;
}
.formula-legend ul {
  margin-bottom: 0;
  padding-left: 1.2rem;
}

/* Zen mode text and icon toggling */
.zen-mode-text-active,
.zen-mode-icon-active {
  display: none;
}
html.zen-mode .zen-mode-text-default,
html.zen-mode .zen-mode-icon-default {
  display: none;
}
html.zen-mode .zen-mode-text-active {
  display: inline;
}
html.zen-mode .zen-mode-icon-active {
  display: block;
}


/* Fix Lenis Sidebar Scroll Hijack */
.theme-doc-sidebar-container, .theme-doc-sidebar-menu, aside { overscroll-behavior: contain; }

/* ============================================================
   FOOTER (Estética y tamaño reducido)
   ============================================================ */

.footer {
  font-size: 0.85rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background-color: var(--bg-1);
}

.footer__title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-2);
  margin-bottom: 1.2rem;
  font-weight: 600;
}

.footer__link-item {
  color: var(--text-3);
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
  line-height: 1.8;
}

.footer__link-item:hover {
  color: var(--ifm-color-primary);
  text-decoration: none;
  transform: translateX(4px);
}

.footer__copyright {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-3);
  letter-spacing: 0.05em;
  margin-top: 2rem;
}

/* ════════════════════════════════════════════════════════════════
   CINEMATIC FORENSIC SIDEBAR REFACTOR
   ════════════════════════════════════════════════════════════════ */

/* PART 1 - Overall Atmosphere */
.theme-doc-sidebar-container {
  background: linear-gradient(to bottom, rgba(8,8,8,0.96), rgba(5,4,3,0.98)) !important;
  border-right: 1px solid rgba(255,170,0,0.05) !important;
  box-shadow: inset -10px 0 20px rgba(0,0,0,0.5);
  position: relative;
}

/* Subtle texture overlay for telemetry feel */
.theme-doc-sidebar-container::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,170,0,0.015) 2px, rgba(255,170,0,0.015) 4px);
  pointer-events: none;
  z-index: 0;
}

.theme-doc-sidebar-menu {
  position: relative;
  z-index: 1;
  padding: 1rem 0.5rem;
}

.menu {
  --ifm-font-family-base: "JetBrains Mono", monospace;
  padding: 0;
}

/* Base item reset */
.menu__list-item {
  margin: 0;
  padding: 0;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Links default state */
.menu__link {
  color: #a0a0a0;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.02em;
  padding: 8px 12px;
  border-radius: 0px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;
}

/* Hover behavior (Restrained) */
.menu__link:hover {
  background-color: transparent;
  color: rgba(255,210,150,0.9);
  text-shadow: 0 0 8px rgba(255,170,0,0.2);
}

/* PART 3 - Active State (Opened Dossier) */
.menu__link.menu__link--active {
  color: rgba(255,210,150,1) !important;
  font-weight: 500;
  background: rgba(255,170,0,0.05) !important;
  border-left: 2px solid rgba(255,170,0,0.65) !important;
  box-shadow: inset 20px 0 20px -20px rgba(255,170,0,0.15);
  text-shadow: 0 0 10px rgba(255,170,0,0.2);
}

/* Remove default UI active backgrounds */
.menu__list-item.menu__list-item--active > .menu__link {
  background: transparent;
}

/* PART 2 - Category System (Structural Folders) */
.menu__list-item-collapsible {
  margin: 28px 0 8px 0; /* Narrative Rhythm */
  border-bottom: 1px solid rgba(255,170,0,0.05);
  padding-bottom: 4px;
}

.menu__link.menu__link--sublist-caret {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,210,150,0.55);
  border-left: none !important;
  padding-left: 8px;
}

.menu__link.menu__link--sublist-caret:hover {
  color: rgba(255,210,150,0.8);
}

/* Segmented telemetry rail for categories */
.menu__list-item-collapsible::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: linear-gradient(to bottom, rgba(255,170,0,0.4) 0%, rgba(255,170,0,0.1) 100%);
  opacity: 0.3;
}

/* Internal Chapter Items (Tighter spacing) */
.menu__list-item .menu__list-item {
  margin: 2px 0 2px 14px;
  padding: 0;
  border-left: 1px solid rgba(255,255,255,0.03);
}

.menu__list-item .menu__list-item .menu__link {
  font-size: 12px;
  padding: 6px 12px;
  color: #808080;
  border-left: 2px solid transparent;
}

/* PART 4 - Experimentación Interactiva (Special Treatment) */
/* Targets the category using a pseudo-selector or specific nth-child if possible.
   Since we cannot target text easily, we just add a global rule for the interactive category if Docusaurus adds a class.
   We removed classes in sidebars.js earlier!
   I will restore a specific class ONLY for the interactive category in sidebars.js to apply this. */
.sidebar-category-interactive > .menu__list-item-collapsible {
  background: rgba(255, 50, 0, 0.02);
  border-left: 2px solid rgba(255, 50, 0, 0.3);
}
.sidebar-category-interactive > .menu__list-item-collapsible .menu__link {
  color: rgba(255, 100, 50, 0.6);
}

/* PART 5 - Accordion & Iconography */
.menu__caret {
  opacity: 0.4;
  transition: transform 400ms cubic-bezier(0.25, 1, 0.5, 1);
}

.menu__list-item-collapsible.menu__list-item--collapsed .menu__caret {
  transform: rotate(-90deg);
}

/* Hide annoying Docusaurus default borders */
.theme-doc-sidebar-menu, .theme-doc-sidebar-container {
  border-right: none !important;
}

/* PART 6 - Cinematic Scrollbar */
.theme-doc-sidebar-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,170,0,0.15) transparent;
}
.theme-doc-sidebar-container::-webkit-scrollbar {
  width: 4px;
}
.theme-doc-sidebar-container::-webkit-scrollbar-track {
  background: transparent;
}
.theme-doc-sidebar-container::-webkit-scrollbar-thumb {
  background: rgba(255,170,0,0.15);
  border-radius: 0px;
}
.theme-doc-sidebar-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255,170,0,0.3);
}

/* PART 8 - Mobile Override */
@media (max-width: 996px) {
  .theme-doc-sidebar-container {
    background: #050505 !important;
  }
  .menu__link {
    font-size: 14px;
    padding: 12px 16px;
  }
  .menu__list-item-collapsible {
    margin: 16px 0;
  }
}


/* FORENSIC TOC (RIGHT SIDEBAR) */
.table-of-contents {
  border-left: 1px solid rgba(0,0,0,0.1);
  padding-left: 1rem;
  font-family: var(--telemetry-font, monospace);
  font-size: 0.75rem;
  opacity: 0.8;
}
html[data-theme="dark"] .table-of-contents {
  border-left: 1px solid rgba(255,255,255,0.05);
}
.table-of-contents__link {
  color: var(--text-2);
  transition: all 0.2s ease;
  padding: 4px 0;
}
.table-of-contents__link:hover, .table-of-contents__link--active {
  color: var(--forensic-amber-primary, #FFB800) !important;
  text-decoration: none;
}
.table-of-contents__link--active {
  font-weight: 600;
}

/* GLOBAL SUBTLE TEXTURE */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
html[data-theme="dark"] body::before {
  opacity: 0.02;
}

/* NAVBAR FORENSIC OVERRIDE */
.navbar {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border-bottom: 1px solid rgba(255,170,0,0.15) !important;
}
html[data-theme="dark"] .navbar {
  background: linear-gradient(to right, rgba(8,8,8,0.98), rgba(12,12,12,0.98)) !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

/* SIDEBAR ICONS INJECTION (Lucide SVG mapped to Docusaurus categories) */

.menu__list-item-collapsible .menu__link {
  display: flex;
  align-items: center;
}

.menu__list-item-collapsible[class*="sidebar-icon-"] > .menu__link::before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 10px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.6;
  flex-shrink: 0;
  transition: opacity 0.2s ease;
}

.menu__list-item-collapsible:hover > .menu__link::before {
  opacity: 0.9;
}

.sidebar-icon-zap > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'%3E%3C/polygon%3E%3C/svg%3E");
}

.sidebar-icon-bar-chart > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='20' x2='18' y2='10'%3E%3C/line%3E%3Cline x1='12' y1='20' x2='12' y2='4'%3E%3C/line%3E%3Cline x1='6' y1='20' x2='6' y2='14'%3E%3C/line%3E%3C/svg%3E");
}

.sidebar-icon-gamepad > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23cc2222' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'%3E%3C/circle%3E%3Ccircle cx='9' cy='9' r='1'%3E%3C/circle%3E%3Cpath d='M15 9h2M15 12h2'%3E%3C/path%3E%3C/svg%3E");
}

.sidebar-icon-compass > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpolygon points='12 2 15 22 12 18 9 22'%3E%3C/polygon%3E%3C/svg%3E");
}

.sidebar-icon-tool > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 0-8.94-8.94l-2.83 2.83a1 1 0 0 0 1.41 1.41L8.05 3.05a4 4 0 0 1 5.66 5.66l-2.83 2.83a1 1 0 0 0 0 1.41z'%3E%3C/path%3E%3Cpath d='M2.3 9.7a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 0-8.94-8.94l-2.83 2.83a1 1 0 0 0 1.41 1.41L4.05 3.05a4 4 0 0 1 5.66 5.66l-2.83 2.83a1 1 0 0 0 0 1.41z'%3E%3C/path%3E%3C/svg%3E");
}

.sidebar-icon-globe > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E");
}

.sidebar-icon-book > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'%3E%3C/path%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'%3E%3C/path%3E%3C/svg%3E");
}

.sidebar-icon-trending > .menu__link::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke='%23a0a0a0' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='23 6 13.5 15.5 8.5 10.5 1 18'%3E%3C/polyline%3E%3Cpolyline points='17 6 23 6 23 12'%3E%3C/polyline%3E%3C/svg%3E");
}
/* FULL WIDTH TABLE UTILITY */
.table-full-width {
  width: 100vw !important;
  max-width: 100vw !important;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw !important;
  margin-right: -50vw !important;
  padding: 0 5vw;
}

```

### 📄 Archivo: `src\css\designTokens.css`
```css
/* ============================================================
   DESIGN TOKENS — TFG OVERLEAF FORENSIC THEME
   ============================================================ */

:root {
  /* ── 1. COLOR SYSTEM ─────────────────────────────────── */
  --forensic-amber-primary: #ffaa00;
  --forensic-amber-warning: #ff5500;
  --forensic-amber-critical: #cc1100;
  --forensic-amber-muted: rgba(255, 170, 0, 0.4);
  --forensic-amber-bg-subtle: rgba(255, 170, 0, 0.05);
  
  --forensic-bg-primary: #050403;
  --forensic-bg-secondary: #0b0806;
  --forensic-bg-surface: rgba(15, 10, 5, 0.5);
  
  --forensic-border: rgba(255, 170, 0, 0.15);
  --forensic-border-strong: rgba(255, 170, 0, 0.3);
  
  --forensic-text-primary: rgba(255, 210, 150, 0.9);
  --forensic-text-secondary: rgba(255, 210, 150, 0.6);
  --forensic-text-dim: rgba(255, 210, 150, 0.4);

  /* Sync Generation Specific Colors */
  --forensic-sync-1: #0077ff;
  --forensic-sync-2: #0044aa;
  --forensic-sync-3: #002255;

  /* ── 2. TYPOGRAPHY SCALE ─────────────────────────────── */
  --telemetry-font: 'JetBrains Mono', 'Courier New', monospace;
  --telemetry-xs: 0.75rem;
  --telemetry-sm: 0.85rem;
  --telemetry-md: 1rem;
  --telemetry-lg: 1.1em;
  --telemetry-display: 1.8em;

  /* ── 3. SPACING SYSTEM ───────────────────────────────── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 40px;

  /* ── 4. BORDER RADIUS ────────────────────────────────── */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* ── 5. ANIMATION TIMINGS ────────────────────────────── */
  --transition-fast: 0.15s ease-out;
  --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s ease-in-out;

  /* WEEK 2.5 ADDITIONS */
  --forensic-amber: var(--forensic-amber-primary);
  --forensic-orange: var(--forensic-amber-warning);
  --forensic-critical: var(--forensic-amber-critical);
  --forensic-bg: var(--forensic-bg-primary);

  --telemetry-border: rgba(255,170,0,0.12);
  --telemetry-soft: rgba(255,210,150,0.72);

  --incident-spacing-xl: 5rem;
  --incident-spacing-lg: 3rem;
  --incident-spacing-md: 1.5rem;

  --scada-radius: 8px;
}

/* Light Theme Overrides (if required, keep it accessible but distinct) */
html[data-theme='light'] {
  --forensic-amber-primary: #d97700;
  --forensic-amber-warning: #cc4400;
  --forensic-amber-critical: #aa0000;
  --forensic-amber-muted: rgba(217, 119, 0, 0.6);
  
  --forensic-bg-primary: #faf8f5;
  --forensic-bg-secondary: #f4f0ea;
  --forensic-bg-surface: #ffffff;
  
  --forensic-border: rgba(217, 119, 0, 0.2);
  --forensic-text-primary: #332211;
  --forensic-text-secondary: #664422;
  --forensic-text-dim: #997755;
}

```

### 📄 Archivo: `src\data\bibliography.js`
```js
export const BIBLIOGRAPHY = [
  {
    id: 1,
    title: `ENTSO-E Expert Panel. Grid Incident in Spain and Portugal on 28 April 2025: ICS Investigation Expert Panel Factual Report. Inf. téc. European Network of Transmission System Operators for Electricity, 2025.`,
    pdf: '/informes/entso-e_incident_report_ES-PT_April_2025_06.pdf'
  },
  {
    id: 2,
    title: `C. Batlle et al. The (Hopefully) Enlightening Blackout in Spain: Questions and Lessons for the Future. Inf. téc. MIT Center for Energy and Environmental Policy Research (CEEPR), 2025.`,
    pdf: '/informes/95103.pdf'
  },
  {
    id: 3,
    title: `Gobierno de España - Consejo de Seguridad Nacional. Versión no confidencial del informe del comité para el análisis de las circunstancias que concurrieron en la crisis de electricidad del 28 de abril de 2025. Inf. téc. Ministerio para la Transición Ecológica y el Reto Demográfico, 2025.`,
    pdf: '/informes/El informe del Gobierno sobre el apagón, al _completo_ con tachados (1).pdf'
  },
  {
    id: 4,
    title: `Red Eléctrica de España (Dirección General de Operación). Incidente en el Sistema Eléctrico Peninsular Español el 28 de abril de 2025. Inf. téc. Redeia, 2025.`,
    pdf: '/informes/El informe de Red Eléctrica sobre el apagón, al completo - 5457.pdf'
  },
  {
    id: 5,
    title: `Instituto de Investigación Tecnológica (IIT) - Universidad Pontificia Comillas, Compass Lexecon e INESC TEC. Análisis de los acontecimientos que condujeron al apagón peninsular del 28 de abril de 2025 / Resumen del informe preliminar. Inf. téc. Universidad Pontificia Comillas, 2025.`,
    pdf: '/informes/Compass Lexecon - INESC TEC (1).pdf'
  },
  {
    id: 6,
    title: `A. Albustami y A. F. Taha. Replicación de la secuencia del colapso e interacción de acciones OA/AA. 2025.`,
    pdf: '/informes/Informe ICAI (1).pdf'
  },
  {
    id: 7,
    title: `FutuRed - Plataforma Española de Redes Eléctricas. Sistemas grid-forming: Electrónica de potencia para la estabilidad de la red. Inf. téc. Ministerio de Ciencia, Innovación y Universidades, mayo de 2024.`,
  },
  {
    id: 8,
    title: `J. García y M. Pérez. «The Iberian Blackout: A Black Swan or a Gray Rhino?» En: Energy Policy Review (2025).`,
  },
  {
    id: 9,
    title: `J. D. Lara et al. April 28th 2025 Iberian Blackout: Analysis of available information. Inf. téc. National Renewable Energy Laboratory (NREL), 2025.`,
  },
  {
    id: 10,
    title: `ENTSO-E Technical Group on Grid Forming Capability. Phase II Technical Report on Grid Forming Requirements. Inf. téc. European Network of Transmission System Operators for Electricity, nov. de 2025. url: https://www.entsoe.eu/news/2025/11/04/entso-e-publishes-phase-ii-technical-report-on-grid-forming-requirements/.`,
  },
  {
    id: 11,
    title: `Comisión Nacional de los Mercados y la Competencia. Resolución de 12 de junio de 2025, por la que se modifican los procedimientos de operación para el desarrollo de un servicio de control de tensión en el sistema eléctrico peninsular español. BOE-A-2025-13076, Boletín Oficial del Estado núm. 153. Jun. de 2025. url: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-13076.`,
  },
  {
    id: 12,
    title: `Gobierno de España. Real Decreto 997/2025, de 5 de noviembre, por el que se aprueban medidas urgentes para el refuerzo del sistema eléctrico. BOE-A-2025-24997, Boletín Oficial del Estado. Nov. de 2025. url: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-24997.`,
  },
  {
    id: 13,
    title: `Agency for the Cooperation of Energy Regulators. Recommendation to the European Commission on the amended Network Code on Requirements for Generators (NC RfG 2.0) and on the amended Network Code on Demand Connection (NC DC 3.0). Inf. téc. ACER, diciembre de 2023.`,
  },
  {
    id: 14,
    title: `ENTSO-E. Policy Paper on Market Design for Utility-Scale Energy Storage. Inf. téc. European Network of Transmission System Operators for Electricity, nov. de 2025. url: https://eepublicdownloads.blob.core.windows.net/public-cdn-container/documents/news-events/news/2025/2025-11-XX-Policy-Paper-Energy-Storage-Market-Design.pdf.`,
  },
  {
    id: 15,
    title: `Javier Quintana. “El impacto de las energías renovables sobre el precio mayorista de la electricidad”. En: Boletín Económico — Banco de España 2024.T3, Art. 09 (2024). Documento de Trabajo, Banco de España. url: https://www.bde.es/wbe/es/publicaciones/analisis-economico-investigacion/boletin-economico/2024t3-articulo-09.`,
    pdf: '/informes/Informe_Vamos_realmente_hacia_una_electricidad_mas_barata (1).pdf'
  },
  {
    id: 16,
    title: `Presentación Gubernamental sobre el Apagón. Inf. téc. Gobierno de España, 2025.`,
    pdf: '/informes/Presentación Gobierno (1).pdf'
  },
  {
    id: 17,
    title: "Kundur, P. (1994). *Power System Stability and Control*. EPRI."
  },{
    id: 18,
    title: "ENTSO-E Expert Panel Final Report (2026). Grid Incident in Spain and Portugal, 28 April 2025."
  },{
    id: 19,
    title: "IEEE Working Group on Frequency Stability (2023). Inertia Requirements in Low-Inertia Grids."
  }
];


```

### 📄 Archivo: `src\data\forensicData.js`
```js
export const interconnectionsData = [
  { frontera: "Francia", flujoMW: 1000, direccion: "Exportacion", tecnologia: "HVDC/AC", estado: "Alta carga AC; HVDC fijo" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Exportacion", tecnologia: "AC Síncrono", estado: "Flujo masivo" },
  { frontera: "Marruecos", flujoMW: 800, direccion: "Exportacion", tecnologia: "Submarino AC", estado: "Constante programado" }
];

export const energyMixData = [
  { tecnologia: "Solar", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Hidráulica", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Síncrona", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Eólica", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nuclear", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Síncrona", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogeneración", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Híbrida", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "C. Combinado", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Síncrona", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Carbón", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Síncrona", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Disparo transformador Granada por sobretensión 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Elevación de tensión por red capacitiva descargada de flujos." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Disparo subestaciones Badajoz (730 MW solar CSP y PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Disparo subestación Sevilla (550 MW). Balance colapsa." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascada por superación umbrales High Voltage Ride-Through." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Pérdida de sincronismo ibérico. Caída libre de frecuencia." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Disparo de inversores por relés RoCoF sensibles internos." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Apertura líneas interconexión AC Francia a 48.46 Hz (Aislamiento)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Activación esquema UFLS deslastra 5 GW de bombeo. RoCoF crítico." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Deslastre secundario 5 GW en distribución. Insuficiente por inercia baja." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "SCRAM Nuclear. Disparo HVDC. Cero Eléctrico Absoluto." }
];

export const rocofData = [
  { fase: "Inicio Perturbación", tiempoS: 0, rocof: -0.015, mecanismo: "Regulación Primaria FCR", fallo: "Reserva de MW se agota" },
  { fase: "Cascada Media", tiempoS: 21, rocof: -0.250, mecanismo: "Resistencia Inercial", fallo: "Agujero supera capacidad rotativa" },
  { fase: "Pérdida Sincronismo", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Inversores se auto-desconectan" },
  { fase: "Isla Eléctrica", tiempoS: 24, rocof: -0.850, mecanismo: "Separación Interconexiones", fallo: "Europa elimina último ancla" },
  { fase: "Deslastre 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Bombeo 5GW", fallo: "Retardo ms frente a caída acelerada" },
  { fase: "Deslastre 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civil 5GW", fallo: "Incapacidad para igualar gradiente" }
];

```

### 📄 Archivo: `src\data\glossary.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Asociación Española de Empresas de Electricidad. Agrupa a las principales empresas del sector eléctrico español. Cofinanció el informe IIT-ICAI.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve. La aFRR (automatic Frequency Restoration Reserve), históricamente conocida como regulación secundaria, es un servicio de ajuste del sistema que se activa automáticamente tras una desviación de frecuencia. Está controlado directamente por el AGC (Automatic Generation Control) del Operador del Sistema y su objetivo es devolver progresivamente la frecuencia a su valor nominal (50 Hz) y restituir los flujos en las interconexiones a sus programas pactados.',
  },
  {
    id: slugify('Área de Control'),
    letter: 'A',
    term: 'Área de Control',
    definition: 'Zona geográfica bajo responsabilidad de un Operador del Sistema (OS).',
  },
  {
    id: slugify('Arranque autónomo (Black Start)'),
    letter: 'A',
    term: 'Arranque autónomo (Black Start)',
    definition: 'La capacidad de Black Start (arranque autónomo o arranque en negro) es el servicio de ajuste por el cual ciertas instalaciones de generación pueden arrancar y comenzar a inyectar energía a la red sin necesidad de recibir tensión eléctrica externa.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Battery Energy Storage System.',
  },
  {
    id: slugify('BESS con inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS con inversores Grid-Forming (BESS-GFM)',
    definition: 'Los Sistemas de Almacenamiento en Baterías con Inversores Formadores de Red (BESS-GFM) combinan alta densidad electroquímica con electrónica de potencia capaz de operar como una fuente de tensión ideal y autónoma.',
  },
  {
    id: slugify('Bucle de retroalimentación (Feedback loop)'),
    letter: 'B',
    term: 'Bucle de retroalimentación (Feedback loop)',
    definition: 'Un feedback loop positivo, o bucle de retroalimentación positiva, describe un mecanismo en el que una perturbación inicial provoca una respuesta del sistema que, en lugar de oponerse al desvío, lo amplifica. En el contexto del incidente, cada disparo de planta IBR redujo la absorción de reactiva, lo que elevó la tensión, lo que a su vez provocó nuevos disparos: la respuesta del sistema reforzaba la perturbación en lugar de amortiguarla.',
  },
  {
    id: slugify('Cambiadores de Tomas en Carga (OLTC)'),
    letter: 'C',
    term: 'Cambiadores de Tomas en Carga (OLTC)',
    definition: 'Un Cambiador de Tomas en Carga (OLTC, On-Load Tap Changer) es un mecanismo electromecánico instalado en los grandes transformadores de potencia que ajusta la relación de transformación —y, por tanto, la tensión de salida del secundario— sin interrumpir el flujo de energía. Regula la tensión ante variaciones lentas de carga, típicamente en un rango de ±10% con escalones discretos. Su tiempo característico de respuesta, condicionado por la inercia mecánica del motor y los engranajes, es del orden de varios segundos por escalón.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Combined Cycle Gas Turbine.',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Centro de Control de Energías Renovables. El Centro de Control de Energías Renovables (CECRE) es la entidad operativa de REE responsable de la monitorización y despacho en tiempo real de los parques renovables y los sistemas de almacenamiento, así como de la ejecución de los algoritmos de control de tensión a través del sistema VOLTAIRE.',
  },
  {
    id: slugify('Centros de Coordinación Regional (RCC)'),
    letter: 'C',
    term: 'Centros de Coordinación Regional (RCC)',
    definition: 'Los Centros de Coordinación Regional (RCC, Regional Coordination Centres) son entidades supranacionales establecidas por la normativa europea para facilitar la cooperación operativa entre los distintos Gestores de Redes de Transporte (TSO).',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'C',
    term: 'Colapso Q-V',
    definition: 'Inestabilidad de tensión en el plano potencia reactiva–voltaje. Mecanismo dominante del 28A (no colapso de frecuencia).',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'C',
    term: 'Compensadores Síncronos (SynCons)',
    definition: 'Los Compensadores Síncronos son máquinas rotativas síncronas operadas en vacío —sin turbina primaria— que aportan inercia rotacional genuina y capacidad de inyección de corrientes de falta de 300–400% de su valor nominal.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'C',
    term: 'Compensador Síncrono Estático (STATCOM)',
    definition: 'Un STATCOM (Static Synchronous Compensator) es un dispositivo de compensación activa de potencia reactiva basado en electrónica de potencia (inversores VSC). A diferencia de las reactancias o los bancos de condensadores mecánicos de conmutación discreta, un STATCOM inyecta o absorbe potencia reactiva de forma continua, dinámica y casi instantánea.',
  },
  {
    id: slugify('Control Grid-forming frente a Grid-following'),
    letter: 'C',
    term: 'Control Grid-forming frente a Grid-following',
    definition: 'Este concepto define el paradigma de control de los inversores. Un inversor grid-following (seguidor de red) se sincroniza pasivamente con la tensión y frecuencia preexistentes, dependiendo de la red externa para operar. Por el contrario, un inversor grid-forming (formador de red) actúa como una fuente de tensión ideal tras una impedancia: establece activamente su propia onda de tensión y frecuencia, permitiendo sostener la red de forma autónoma.',
  },
  {
    id: slugify('Coste Nivelado de la Energía (LCOE)'),
    letter: 'C',
    term: 'Coste Nivelado de la Energía (LCOE)',
    definition: 'El Coste Nivelado de la Energía (LCOE) es la métrica económica estándar que compara el coste unitario de producción entre distintas tecnologías a lo largo de su vida útil. Su principal limitación sistémica es que ignora el valor de los servicios ancilares aportados a la red.',
  },
  {
    id: slugify('Crisis communication failure'),
    letter: 'C',
    term: 'Crisis communication failure',
    definition: 'En gestión de emergencias, un crisis communication failure describe el fallo institucional al no ocupar de forma oportuna el espacio informativo con mensajes verificables tras un incidente grave. Según el Chaos Communication Model, si la institución responsable no emite un relato claro durante la ventana crítica inicial (1-6 horas), el vacío discursivo es ocupado por narrativas alternativas o no verificadas.',
  },
  {
    id: slugify('Criterio N-1'),
    letter: 'C',
    term: 'Criterio N-1',
    definition: 'El Criterio N-1 es la norma de seguridad fundamental en la operación y planificación de sistemas eléctricos de potencia. Establece que el sistema debe ser capaz de mantener los parámetros de tensión y frecuencia dentro de los límites operativos normativos tras la pérdida contingente de cualquier elemento único, sin provocar cortes de suministro en cascada ni daños en los equipos.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'Consejo de Seguridad Nacional de España. Publicó el informe oficial del Gobierno junto con REE.',
  },
  {
    id: slugify('Curva de capacidad reactiva (Capability Curve)'),
    letter: 'C',
    term: 'Curva de capacidad reactiva (Capability Curve)',
    definition: 'Diagrama P-Q que delimita el espacio operativo de un generador en el plano potencia activa-reactiva.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva de Pato (Duck Curve)',
    definition: 'La curva de pato describe el perfil diario de demanda neta de regulación en sistemas con alta penetración solar: una depresión profunda durante las horas centrales del día seguida de una rampa vespertina pronunciada.',
  },
  {
    id: slugify('Curvas de estabilidad de tensión Q-V'),
    letter: 'C',
    term: 'Curvas de estabilidad de tensión Q-V',
    definition: 'Las curvas Q-V representan, para un nudo dado de la red, la relación entre la potencia reactiva inyectada o absorbida y la tensión resultante. La distancia entre el punto de operación y el punto de mínimo de la curva (nose point) define el margen de estabilidad de tensión: cuanto menor sea ese margen, mayor será el riesgo de un colapso de tensión ante perturbaciones adicionales.',
  },
  {
    id: slugify('Damping ratio'),
    letter: 'D',
    term: 'Damping ratio',
    definition: 'El ratio de amortiguamiento (o amortiguamiento relativo) es un indicador adimensional que cuantifica la rapidez con la que una oscilación se atenúa tras una perturbación. Valores próximos al 5% se consideran un margen de seguridad operativo razonable en el sistema síncrono europeo; valores cercanos al 0% indican oscilaciones sostenidas, y valores negativos implican un crecimiento de la amplitud y, por tanto, un riesgo de inestabilidad.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'ENTSO-E Awareness System. Sistema de Conciencia Situacional de ENTSO-E que monitorea la estabilidad de la red europea en tiempo real.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E Awareness System.',
  },
  {
    id: slugify('Efecto Ferranti'),
    letter: 'E',
    term: 'Efecto Ferranti',
    definition: 'El Efecto Ferranti describe el fenómeno por el cual, en una línea de transporte de alta tensión operada con poca o ninguna carga, la tensión en el extremo receptor supera a la del extremo emisor. La causa es la admitancia capacitiva distribuida de la línea: con flujo de potencia activa reducido, la carga capacitiva no se compensa con el consumo inductivo de las cargas, y el resultado es una sobretensión proporcional a la longitud de la línea. Es un fenómeno especialmente relevante al energizar líneas de 400 kV en vacío.',
  },
  {
    id: slugify('Emergent norm theory'),
    letter: 'E',
    term: 'Emergent norm theory',
    definition: 'La teoría de las normas emergentes (Turner y Killian) sostiene que, frente a las visiones del pánico masivo, los grupos en situaciones de disrupción desarrollan espontáneamente nuevas reglas de comportamiento social adaptativo.',
  },
  {
    id: slugify('Encuadre mediático (Framing) y Agenda-shifting'),
    letter: 'E',
    term: 'Encuadre mediático (Framing) y Agenda-shifting',
    definition: 'El framing es el proceso por el cual los medios seleccionan y enfatizan ciertos elementos de un hecho para proponer una interpretación causal concreta. Relacionado con esto, el agenda-shifting ocurre cuando un evento disruptivo es instrumentalizado mediáticamente para desplazar la atención y reabrir debates políticos o estructurales preexistentes.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'La Red Europea de Gestores de Redes de Transporte de Electricidad (ENTSO-E, por sus siglas en inglés: European Network of Transmission System Operators for Electricity) es la asociación que agrupa a 40 operadores técnicos de red (TSO) pertenecientes a 36 países europeos. Su mandato principal, derivado de los sucesivos paquetes legislativos de la Unión Europea, es garantizar la seguridad y fiabilidad de la operación del sistema interconectado europeo, facilitar la integración de energías renovables y establecer los códigos de red comunes (Network Codes) de obligado cumplimiento para todos los Estados miembros.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Essential Reliability Services.',
  },
  {
    id: slugify('Estabilidad de tensión'),
    letter: 'E',
    term: 'Estabilidad de tensión',
    definition: 'Capacidad del sistema para mantener tensiones dentro de límites operacionales tras perturbaciones. Requiere balance entre demanda y aportación de potencia reactiva.',
  },
  {
    id: slugify('Estabilizadores del Sistema de Potencia (PSS)'),
    letter: 'E',
    term: 'Estabilizadores del Sistema de Potencia (PSS)',
    definition: 'Los PSS (Power System Stabilizers) son lazos de control adicionales instalados en el sistema de excitación de los grandes generadores síncronos que añaden amortiguamiento eléctrico a las oscilaciones electromecánicas del sistema.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Estrategia Brownfield',
    definition: 'En ingeniería de infraestructuras energéticas, la estrategia Brownfield consiste en la reconversión de instalaciones industriales existentes —como las centrales térmicas o nucleares clausuradas— para dotarlas de nuevas funciones sistémicas, como convertirlas en compensadores síncronos.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Fast Frequency Response (FFR)',
    definition: 'La Respuesta Rápida de Frecuencia (FFR) es un servicio de estabilización subcíclica, diseñado para sistemas de electrónica de potencia, que inyecta un bloque masivo de potencia activa en la ventana temporal crítica (típicamente inferior a 0,25 s) previa a la actuación de los reguladores mecánicos tradicionales.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Fast Frequency Response.',
  },
  {
    id: slugify('Frecuencia nominal'),
    letter: 'F',
    term: 'Frecuencia nominal',
    definition: '50 Hz en el sistema europeo continental. El P.O. 1.1 define los límites de operación: f ∈ [49,0; 51,0] Hz en operación normal.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'GFL',
    definition: 'Grid-Following Inverter.',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Grid-Forming Inverter.',
  },
  {
    id: slugify('Headroom: Reserva de Capacidad del Inversor'),
    letter: 'H',
    term: 'Headroom: Reserva de Capacidad del Inversor',
    definition: 'El headroom es la fracción de la capacidad aparente máxima que un inversor GFM debe mantener reservada sin utilizarla para la inyección de potencia activa en estado estacionario, con el fin de tener margen para responder a transitorios rápidos.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HVDC',
    definition: 'High Voltage Direct Current.',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Inverter-Based Resources.',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT (Insulated Gate Bipolar Transistor)',
    definition: 'Semiconductor de potencia utilizado en inversores. Control de compuerta aislada permite conmutación rápida y eficiente.',
  },
  {
    id: slugify('Impedancia de transferencia'),
    letter: 'I',
    term: 'Impedancia de transferencia',
    definition: 'En sistemas de potencia, la impedancia de transferencia entre dos nudos representa la oposición eléctrica al flujo de potencia entre ellos. Una alta impedancia de transferencia implica una red débilmente acoplada, en la que pequeñas variaciones de potencia inyectada pueden producir grandes variaciones de tensión y de ángulo de fase, deteriorando la firmeza del sistema.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodemia',
    definition: 'Término popularizado por la OMS para describir la sobrepoblación del espacio informativo con contenidos no verificados, erróneos o falsos que se propagan rápidamente en situaciones de crisis.',
  },
  {
    id: slugify('Inercia Sintética'),
    letter: 'I',
    term: 'Inercia Sintética',
    definition: 'La inercia sintética (o inercia virtual) es un algoritmo de control implementado en inversores GFM que emula matemáticamente el comportamiento de la ecuación de oscilación de un rotor electromecánico. El algoritmo mide continuamente la derivada temporal de la frecuencia (df/dt) y ajusta la potencia inyectada de forma proporcional.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'LCOE',
    definition: 'Levelized Cost of Energy.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low Voltage Ride Through (LVRT)',
    definition: 'El Low Voltage Ride Through (LVRT) es la capacidad de un inversor para mantener la inyección de energía durante un hueco de tensión en lugar de desconectarse por protección.',
  },
  {
    id: slugify('Mallado'),
    letter: 'M',
    term: 'Mallado',
    definition: 'Maniobra operativa de reconfiguración topológica que conecta subestaciones previamente separadas mediante líneas de 400 kV. En el 28A activó el efecto Ferranti.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Network Code on Requirements for Generators (NC RfG)',
    definition: 'El Network Code on Requirements for Generators es el código de red europeo establecido por ENTSO-E que armoniza los requisitos técnicos obligatorios que deben cumplir las instalaciones de generación para conectarse a la red. Ahora en su versión 2.0, propuesta tras el colapso ibérico, introduce la obligatoriedad de capacidades grid-forming.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'On-Load Tap Changer.',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Out-of-Step Tripping.',
  },
  {
    id: slugify('Oscilaciones electromecánicas'),
    letter: 'O',
    term: 'Oscilaciones electromecánicas',
    definition: 'Modos oscilatorios asociados a la interacción entre generadores síncronos. Típicamente 0,1–2 Hz. En el 28A se detectó oscilación de 0,6 Hz.',
  },
  {
    id: slugify('Oscilaciones forzadas y naturales'),
    letter: 'O',
    term: 'Oscilaciones forzadas y naturales',
    definition: 'Una oscilación es forzada cuando es inducida por una perturbación externa periódica —típicamente un fallo o un comportamiento anómalo en el lazo de control de un equipo concreto—, frente a las oscilaciones naturales o modos propios del sistema, cuya frecuencia viene determinada por la propia inercia y por las constantes electromecánicas de las máquinas síncronas conectadas.',
  },
  {
    id: slugify('Outrage communication (Comunicación de indignación)'),
    letter: 'O',
    term: 'Outrage communication (Comunicación de indignación)',
    definition: 'Basado en el modelo de Sandman (Risk = Hazard + Outrage), este concepto indica que la percepción pública de un riesgo depende más de factores emocionales (indignación, percepción de negligencia) que de la evaluación técnica del peligro real.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phase-Locked Loop.',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Phasor Measurement Unit.',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'Plan Nacional Integrado de Energía y Clima.',
  },
  {
    id: slugify('Potencia de cortocircuito (Ssc)'),
    letter: 'P',
    term: 'Potencia de cortocircuito (Ssc)',
    definition: 'La Potencia de Cortocircuito (Ssc) en un nudo es la magnitud instantánea de corriente que el sistema puede inyectar ante una falta de tensión. Define la rigidez eléctrica del nudo: un Ssc elevado permite que las protecciones de distancia operen correctamente, que las protecciones de sobrecorriente se coordinen selectivamente y que los inversores mantengan sincronismo de sus algoritmos de control.',
  },
  {
    id: slugify('Power System Stabilizers y Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'Power System Stabilizers y Power Oscillation Damping (PSS/POD)',
    definition: 'Los Power System Stabilizers (PSS) y los sistemas de Power Oscillation Damping (POD) son módulos de control adicionales instalados en inversores (especialmente en modo GFM) que inyectan señales contrafase diseñadas para amortiguar oscilaciones electromecánicas de pequeña y gran perturbación.',
  },
  {
    id: slugify('Procedimiento de Operación 1.6 (P.O. 1.6)'),
    letter: 'P',
    term: 'Procedimiento de Operación 1.6 (P.O. 1.6)',
    definition: 'El Procedimiento de Operación 1.6 es el protocolo de emergencia del sistema eléctrico español que establece los planes de salvaguarda y reposición del suministro ante incidentes críticos. Dictamina las estrategias de fragmentación topológica de la red en islas eléctricas independientes, las rutas de energización preferentes y el protocolo de priorización de arranque de las instalaciones de generación para restaurar el sistema tras un cero de tensión parcial o total.',
  },
  {
    id: slugify('Procedimiento de Operación 7.4 (P.O. 7.4)'),
    letter: 'P',
    term: 'Procedimiento de Operación 7.4 (P.O. 7.4)',
    definition: 'El P.O. 7.4 es la normativa técnica del sistema eléctrico español que regula el servicio de ajuste de control de tensión en la red de transporte. Define las obligaciones de los generadores para absorber o inyectar potencia reactiva (Q) en función de las consignas enviadas por el Operador del Sistema.',
  },
  {
    id: slugify('Programa DS3 de EirGrid'),
    letter: 'P',
    term: 'Programa DS3 de EirGrid',
    definition: 'El programa Delivering a Secure, Sustainable Electricity System (DS3) es el marco pionero de servicios ancilares de EirGrid (Irlanda), diseñado para operar el sistema insular con penetraciones renovables asíncronas de hasta el 75%.',
  },
  {
    id: slugify('Protecciones de pérdida de sincronismo (OST)'),
    letter: 'P',
    term: 'Protecciones de pérdida de sincronismo (OST)',
    definition: 'Los relés de pérdida de sincronismo (OST, Out-of-Step Tripping) son esquemas de protección sistémica diseñados para detectar divergencias angulares severas entre áreas interconectadas (deslizamiento de polos). Cuando la diferencia de fase angular excede los límites de estabilidad electromecánica, los relés abren automáticamente las líneas de interconexión para evitar daños estructurales.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regional Coordination Centre.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Red Eléctrica de España.',
  },
  {
    id: slugify('Régimen de Renovables, Cogeneración y Residuos (RCR)'),
    letter: 'R',
    term: 'Régimen de Renovables, Cogeneración y Residuos (RCR)',
    definition: 'El Régimen de Renovables, Cogeneración y Residuos (RCR) es el marco regulatorio del sistema eléctrico español que agrupa a las instalaciones de producción de energía eléctrica a partir de fuentes descarbonizadas.',
  },
  {
    id: slugify('Relés de comprobación de sincronismo (Synchro-check)'),
    letter: 'R',
    term: 'Relés de comprobación de sincronismo (Synchro-check)',
    definition: 'El relé synchro-check (función 25 ANSI) es un dispositivo de protección empleado en las maniobras de acoplamiento de sistemas eléctricos separados (islas). Su función es supervisar continuamente que la tensión, la frecuencia y el ángulo de fase a ambos lados de un interruptor abierto se encuentran dentro de unos márgenes de tolerancia preestablecidos.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'R',
    term: 'Relés de Deslastre de Carga (UFLS)',
    definition: 'El Under-Frequency Load Shedding (UFLS, deslastre automático de carga por baja frecuencia) es el mecanismo de último recurso del sistema de defensa: cuando la frecuencia cae por debajo de umbrales predefinidos, los relés de UFLS desconectan cargas de forma automática para restaurar el equilibrio generación-demanda.',
  },
  {
    id: slugify('Reserva de Restauración de Frecuencia Automática (aFRR)'),
    letter: 'R',
    term: 'Reserva de Restauración de Frecuencia Automática (aFRR)',
    definition: 'La aFRR (automatic Frequency Restoration Reserve), históricamente conocida como regulación secundaria, es un servicio de ajuste del sistema que se activa automáticamente tras una desviación de frecuencia.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Rate of Change of Frequency (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Supervisory Control and Data Acquisition.',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Short Circuit Ratio.',
  },
  {
    id: slugify('Servicios Esenciales de Confiabilidad (ERS)'),
    letter: 'S',
    term: 'Servicios Esenciales de Confiabilidad (ERS)',
    definition: 'Los Servicios Esenciales de Confiabilidad (ERS) agrupan los atributos físicos indispensables para la operación segura de la red, tales como la inercia, la potencia de cortocircuito, la respuesta rápida de frecuencia y el control dinámico de tensión.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Sincronismo',
    definition: 'Condición de operación donde todos los generadores rotan a la misma frecuencia angular. Pérdida de sincronismo = desconexión cascada.',
  },
  {
    id: slugify('Sistema en por unidad (p.u.)'),
    letter: 'S',
    term: 'Sistema en por unidad (p.u.)',
    definition: 'El sistema por unidad (p.u.) es una convención de normalización utilizada en ingeniería eléctrica de potencia que expresa las magnitudes del sistema (tensión, corriente, potencia, impedancia) como cocientes adimensionales respecto a valores base de referencia.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'S',
    term: 'Sistema VOLTAIRE',
    definition: 'El sistema VOLTAIRE (integrado en el Centro de Control de Energías Renovables, CECRE) es la arquitectura implantada por REE para la regulación dinámica de tensión en el sistema peninsular. Opera en dos capas jerárquicas: la Regulación Terciaria y la Regulación Secundaria.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Directrices de Operación del Sistema emitidas por ENTSO-E. Establecen márgenes operacionales mínimos para estabilidad.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronous Condenser.',
  },
  {
    id: slugify('Tasa de Cambio de Frecuencia (RoCoF)'),
    letter: 'T',
    term: 'Tasa de Cambio de Frecuencia (RoCoF)',
    definition: 'La Rate of Change of Frequency (RoCoF, tasa de cambio de frecuencia) cuantifica la velocidad de variación de la frecuencia del sistema ante una perturbación, expresada típicamente en Hz/s. Es el parámetro dinámico más crítico para la estabilidad transitoria: un RoCoF elevado reduce el tiempo disponible para que los sistemas de regulación actúen, acelerando la cascada de desconexiones de protecciones.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'TSO',
    definition: 'Transmission System Operator.',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Under-Frequency Load Shedding.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Vacuum filling (Relleno del vacío informativo)'),
    letter: 'V',
    term: 'Vacuum filling (Relleno del vacío informativo)',
    definition: 'El vacuum filling es el proceso estructural e inevitable mediante el cual la incertidumbre colectiva ante un desastre genera una demanda de respuestas que, si no es satisfecha por las instituciones oficiales, es cubierta espontáneamente por fuentes no autorizadas.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'La tecnología Vehicle-to-Grid (V2G) habilita la bidireccionalidad de las baterías de los vehículos eléctricos, permitiéndoles inyectar potencia activa y reactiva hacia la red.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Wide Area Monitoring System.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inercia (H)'),
    letter: 'I',
    term: 'Inercia (H)',
    definition: 'La constante de inercia H es un parámetro adimensional que cuantifica la energía cinética almacenada en las masas rotatorias de un generador síncrono respecto a su potencia nominal. Cuanto mayor es H, más lento es el cambio de frecuencia ante perturbaciones (mayor RoCoF tolerable). El 28A el sistema operaba con H ≈ 2,3 s a nivel peninsular, pero con valores zonales de 1,3–1,8 s en el sur.',
  },
  {
    id: slugify('Potencia reactiva'),
    letter: 'P',
    term: 'Potencia reactiva',
    definition: 'Componente de la potencia eléctrica asociada al almacenamiento y liberación de energía en campos eléctricos y magnéticos (no disipada como calor). Se mide en VAr. El balance de potencia reactiva determina el perfil de tensión en la red: un exceso de reactiva capacitiva eleva la tensión (sobretensión); un déficit la deprime. El 28A el colapso se debió fundamentalmente a un exceso de reactiva capacitiva inyectada por las líneas en vacío tras el mallado.',
  },
  {
    id: slugify('Potencia activa'),
    letter: 'P',
    term: 'Potencia activa',
    definition: 'Componente de la potencia eléctrica que realiza trabajo útil. Se mide en vatios (W). Es la potencia que efectivamente consume la carga. Se controla mediante el despacho de generación y determina el equilibrio de frecuencia del sistema.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Black Start',
    definition: 'Véase "Arranque autónomo (Black Start)". Capacidad de ciertas instalaciones de generación de arrancar sin tensión externa de red para liderar la reposición del suministro tras un colapso total.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Fenómeno por el cual la inercia mecánica de los Cambiadores de Tomas en Carga (OLTC) introduce un retardo de decenas de segundos en el ajuste de la relación de transformación. Durante el 28A, los OLTCs habían subido tomas para compensar caídas de tensión previas; cuando llegó la sobretensión, no pudieron bajarlas a tiempo, amplificando la tensión hacia las redes colectoras de 220 kV y generando un "punto ciego" de observabilidad en el SCADA de REE.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Network Code on Requirements for Generators. Véase "Network Code on Requirements for Generators (NC RfG)".',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Modo de operación de inversores en el que el equipo se sincroniza pasivamente con la tensión y frecuencia de la red mediante un algoritmo PLL (Phase-Locked Loop). Requiere una red externa estable y no puede operar de forma autónoma. El 78% del parque IBR del 28A operaba en modo grid-following.',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'Modo de operación de inversores en el que el equipo actúa como una fuente de tensión ideal, estableciendo activamente su propia onda de tensión y frecuencia. Puede sostener la red de forma autónoma y responder a perturbaciones sin necesidad de una referencia externa. Es la tecnología clave propuesta por ENTSO-E en el NC RfG 2.0 para sistemas con alta penetración renovable.',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'Véase "PLL". Algoritmo de control electrónico que sincroniza la salida de un inversor con la tensión y frecuencia de la red. Su dependencia de una red estable es la limitación estructural de los inversores grid-following.',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Véase "SCADA". Sistema de supervisión y control en tiempo real de la red eléctrica. Durante el 28A, el SCADA de REE mostraba tensiones en la red de 400 kV dentro de límites normativos (418 kV en Granada) mientras el fenómeno Tap-Lag generaba sobretensiones reales de 244 kV en el secundario de 220 kV, invisible al operador.',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'Véase "WAMS". Sistema de monitorización de área extensa basado en PMUs sincronizadas por GPS. Permite observar la dinámica de la red en escalas geográficas continentales con resolución de milisegundos.',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Véase "PMU". Unidad de Medición Fasorial. Dispositivo que mide sincronizadamente tensión y corriente en múltiples puntos de la red con resolución temporal de milisegundos, esencial para el análisis de oscilaciones inter-área.',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'Véase "Tasa de Cambio de Frecuencia (RoCoF)" y "RoCoF". Parámetro dinámico crítico que cuantifica la velocidad de variación de la frecuencia (Hz/s) ante perturbaciones.',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'Véase "Relés de Deslastre de Carga (UFLS)". Mecanismo automático de desconexión de cargas cuando la frecuencia cae por debajo de umbrales predefinidos, para restaurar el equilibrio generación-demanda.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Véase "EAS (ENTSO-E Awareness System)". Sistema de Conciencia Situacional de ENTSO-E para monitorización en tiempo real del sistema eléctrico europeo.',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'Véase "Cambiadores de Tomas en Carga (OLTC)". Mecanismo electromecánico en transformadores de potencia que ajusta la relación de transformación sin interrumpir el servicio, con un retardo mecánico de varios segundos por escalón.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Véase "SO GL (System Operation Guidelines)". Directrices de Operación del Sistema de ENTSO-E que definen cinco niveles de severidad operativa (Normal, Alerta, Emergencia, Blackout, Restauración).',
  },
  {
    id: slugify('Capacidad Neta de Transferencia (NTC)'),
    letter: 'C',
    term: 'Capacidad Neta de Transferencia (NTC)',
    definition: 'Net Transfer Capacity (NTC). Capacidad máxima de intercambio de energía entre dos zonas de control pactada ex ante entre operadores de sistema vecinos (REE y RTE en el caso ibérico). El 28A, el NTC de la interconexión España-Francia estaba en torno al 3% de la demanda peninsular, muy por debajo del objetivo europeo del 15%.',
  },
  {
    id: slugify('Ratio de amortiguamiento'),
    letter: 'R',
    term: 'Ratio de amortiguamiento',
    definition: 'El ratio de amortiguamiento (o amortiguamiento relativo) es un indicador adimensional que cuantifica la rapidez con la que una oscilación se atenúa tras una perturbación. Valores próximos al 5 \% se consideran un margen de seguridad operativo razonable en el sistema síncrono europeo; valores cercanos al 0 \% indican oscilaciones sostenidas, y valores negativos implican un crecimiento de la amplitud y, por tanto, un riesgo de inestabilidad.',
  },
  {
    id: slugify('Potencia de cortocircuito'),
    letter: 'P',
    term: 'Potencia de cortocircuito',
    definition: 'La potencia de cortocircuito ($S_{sc}$) en un nudo de la red es una medida de su "fortaleza" electromagnética. Representa la cantidad de corriente aparente que fluiría hacia ese nudo en caso de producirse un cortocircuito franco trifásico. Una elevada potencia de cortocircuito, típicamente aportada por los grandes generadores síncronos, implica que la tensión en ese nudo es muy robusta y resiliente, sufriendo variaciones mínimas ante perturbaciones, conexiones de cargas bruscas o maniobras en la red.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Estrategia Brownfield',
    definition: 'En ingeniería de infraestructuras energéticas, la estrategia Brownfield consiste en la reconversión de instalaciones industriales existentes —como las centrales térmicas o nucleares clausuradas— para dotarlas de nuevas funciones sistémicas. En este contexto, implica conservar los grandes alternadores originales operando en vacío como compensadores síncronos, aportando inercia natural y potencia de cortocircuito, y aprovechando las subestaciones y líneas de evacuación ya construidas para reducir drásticamente costes y tiempos de implementación.',
  },
  {
    id: slugify('Sistema por Unidad (p.u.)'),
    letter: 'S',
    term: 'Sistema por Unidad (p.u.)',
    definition: 'El sistema por unidad (p.u.) es una convención de normalización utilizada en ingeniería eléctrica de potencia que expresa las magnitudes del sistema (tensión, corriente, potencia, impedancia) como cocientes adimensionales respecto a valores base de referencia. La base de tensión suele tomarse como el valor nominal de la red en el nudo de análisis, y la base de potencia como la potencia aparente nominal del equipo o del sistema. La ventaja principal es la eliminación de las transformaciones de escala al analizar redes con múltiples niveles de tensión interconectados mediante transformadores. En el contexto del análisis de inversores, la expresión de las corrientes de falta en p.u. permite comparar directamente la capacidad de inyección de los inversores (1{,}1–1{,}2 p.u.) con la de los generadores síncronos (5–7 p.u.) con independencia de la potencia nominal de cada tecnología.',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs GFM (Grid-Following vs Grid-Forming)',
    definition: 'La topología Grid-Following (GFL) modela al inversor como una fuente de corriente controlada que depende de una medición externa de la tensión de red (a través del lazo de seguimiento de fase, PLL). Su ventaja es la simplicidad y el bajo coste; su limitación crítica es que no puede operar de forma autónoma ni establecer tensión en redes débiles. La topología Grid-Forming (GFM) modela el inversor como una fuente de tensión ideal detrás de una reactancia virtual, permitiendo operación autónoma, inyección de corrientes de falta robustas e inercia sintética. El NC RfG 2.0 establece la transición hacia GFM como obligatoria para nuevas instalaciones significativas.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva de Pato (Duck Curve)',
    definition: 'La curva de pato describe el perfil diario de demanda neta de regulación en sistemas con alta penetración solar: una depresión profunda durante las horas centrales del día (cuando el consumo base es bajo pero la generación solar es máxima) seguida de una rampa vespertina pronunciada. La primavera es el período de máxima profundidad y vulnerabilidad. En el caso del 28A, la profundidad del valle coincidió con una rampa de inyección solar extraordinariamente aguda, dejando al sistema con mínima capacidad de absorción de reactiva en el instante crítico.',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Headroom',
    definition: 'El headroom es la fracción de la capacidad aparente máxima ($S_{}$) que un inversor GFM debe mantener reservada sin utilizarla para la inyección de potencia activa en estado estacionario. Esta reserva es necesaria para garantizar que el inversor dispone de margen suficiente para actuar ante perturbaciones rápidas de tensión o frecuencia. Exigir headroom reduce los ingresos del mercado de energía, lo que constituye la fricción económica estructural que justifica la creación de mercados de Servicios Esenciales de Confiabilidad (ERS) para remunerar explícitamente esta capacidad de respuesta.',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT (Low Voltage Ride Through)',
    definition: 'El Low Voltage Ride Through (LVRT) es la capacidad de un inversor para mantener la inyección de energía durante un hueco de tensión en lugar de desconectarse por protección. Los requisitos del LVRT en España están regulados por el P.O. 12.3 e incluyen el parámetro dinámico $k$ (factor de proporcionalidad de corriente reactiva respecto a la profundidad del hueco). El apagón del 28A evidenció que en redes con $SCR < 2$, la inyección masiva de reactiva según los perfiles tradicionales de LVRT puede amplificar la inestabilidad en lugar de contenerla, requiriendo revisión de la coordinación entre el control LVRT y la debilidad de red.',
  },
];


```

### 📄 Archivo: `src\data\glossary_de.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Spanischer Verband der Elektrizitätsunternehmen. Es vereint die wichtigsten Unternehmen des spanischen Elektrizitätssektors. Kofinanzierte den IIT-ICAI-Bericht.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatische Frequenzwiederherstellungsreserve. aFRR (Automatic Frequency Restoration Reserve), früher auch Sekundärregulierung genannt, ist ein Systemanpassungsdienst, der nach einer Frequenzabweichung automatisch aktiviert wird. Es wird direkt von der AGC (Automatic Generation Control) des Netzbetreibers gesteuert und hat das Ziel, die Frequenz schrittweise auf ihren Nennwert (50 Hz) zurückzubringen und die Flüsse in den Verbindungsleitungen gemäß den vereinbarten Programmen wiederherzustellen.',
  },
  {
    id: slugify('Área de Control'),
    letter: 'A',
    term: 'Kontrollbereich',
    definition: 'Geografisches Gebiet unter der Verantwortung eines Systembetreibers (OS).',
  },
  {
    id: slugify('Arranque autónomo (Black Start)'),
    letter: 'A',
    term: 'Autonomer Start (Schwarzstart)',
    definition: 'Die Schwarzstartfähigkeit (autonomer Start oder Schwarzstart) ist der Anpassungsdienst, mit dem bestimmte Erzeugungsanlagen starten und mit der Einspeisung von Energie in das Netz beginnen können, ohne dass eine externe elektrische Spannung erforderlich ist.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Batterie-Energiespeichersystem.',
  },
  {
    id: slugify('BESS con inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS mit netzbildenden Wechselrichtern (BESS-GFM)',
    definition: 'Batteriespeichersysteme mit netzbildenden Wechselrichtern (BESS-GFM) kombinieren eine hohe elektrochemische Dichte mit einer Leistungselektronik, die als ideale und autonome Spannungsquelle arbeiten kann.',
  },
  {
    id: slugify('Bucle de retroalimentación (Feedback loop)'),
    letter: 'B',
    term: 'Rückkopplungsschleife',
    definition: 'Eine positive Rückkopplungsschleife beschreibt einen Mechanismus, bei dem eine anfängliche Störung eine Systemreaktion hervorruft, die der Voreingenommenheit nicht entgegenwirkt, sondern sie verstärkt. Im Zusammenhang mit dem Vorfall verringerte jede IBR-Anlagenauslösung die reaktive Absorption, wodurch die Spannung anstieg, was wiederum zu neuen Auslösungen führte: Die Reaktion des Systems verstärkte die Störung, anstatt sie zu dämpfen.',
  },
  {
    id: slugify('Cambiadores de Tomas en Carga (OLTC)'),
    letter: 'C',
    term: 'Laststufenschalter (OLTC)',
    definition: 'Ein Laststufenschalter (OLTC) ist ein elektromechanischer Mechanismus, der in großen Leistungstransformatoren installiert ist und das Übersetzungsverhältnis – und damit die sekundäre Ausgangsspannung – anpasst, ohne den Stromfluss zu unterbrechen. Reguliert die Spannung bei langsamen Lastschwankungen, typischerweise in einem Bereich von ±10 % mit diskreten Schritten. Seine charakteristische Reaktionszeit, bedingt durch die mechanische Trägheit des Motors und des Getriebes, liegt in der Größenordnung von mehreren Sekunden pro Schritt.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Kombi-Gasturbine.',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Kontrollzentrum für erneuerbare Energien. Das Renewable Energy Control Center (CECRE) ist die REE-Betriebseinheit, die für die Echtzeitüberwachung und den Einsatz erneuerbarer Parks und Speichersysteme sowie für die Ausführung von Spannungssteuerungsalgorithmen über das VOLTAIRE-System verantwortlich ist.',
  },
  {
    id: slugify('Centros de Coordinación Regional (RCC)'),
    letter: 'C',
    term: 'Regionale Koordinierungszentren (RCC)',
    definition: 'Regionale Koordinierungszentren (RCC) sind supranationale Einheiten, die durch europäische Vorschriften eingerichtet wurden, um die operative Zusammenarbeit zwischen den verschiedenen Transportnetzbetreibern (TSO) zu erleichtern.',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'C',
    term: 'Q-V-Zusammenbruch',
    definition: 'Spannungsinstabilität in der Blindleistungs-Spannungsebene. 28Ein dominanter Mechanismus (Nichtfrequenzkollaps).',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'C',
    term: 'Synchronkompensatoren (SynCons)',
    definition: 'Synchronkompensatoren sind synchrone Rotationsmaschinen, die im Vakuum – ohne Primärturbine – betrieben werden und eine echte Rotationsträgheit und die Fähigkeit bieten, Fehlerströme von 300–400 % ihres Nennwerts einzuspeisen.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'C',
    term: 'Statischer Synchronkompensator (STATCOM)',
    definition: 'Ein STATCOM (Static Synchronous Compensator) ist ein aktives Blindleistungskompensationsgerät auf Basis der Leistungselektronik (VSC-Wechselrichter). Im Gegensatz zu Reaktoren oder diskret geschalteten mechanischen Kondensatorbänken injiziert oder absorbiert ein STATCOM Blindleistung kontinuierlich, dynamisch und nahezu augenblicklich.',
  },
  {
    id: slugify('Control Grid-forming frente a Grid-following'),
    letter: 'C',
    term: 'Rasterbildende vs. Rasterfolgende Steuerung',
    definition: 'Dieses Konzept definiert das Anlegerkontrollparadigma. Ein netzfolgender Wechselrichter synchronisiert sich passiv mit der bereits vorhandenen Spannung und Frequenz, je nachdem, welches externe Netz betrieben werden soll. Im Gegenteil, ein netzbildender Wechselrichter fungiert als ideale Spannungsquelle hinter einer Impedanz: Er baut aktiv seine eigene Spannungs- und Frequenzwellenform auf und ermöglicht so die autonome Aufrechterhaltung des Netzes.',
  },
  {
    id: slugify('Coste Nivelado de la Energía (LCOE)'),
    letter: 'C',
    term: 'Energiegestehungskosten (LCOE)',
    definition: 'Die Levelized Cost of Energy (LCOE) ist die standardmäßige wirtschaftliche Kennzahl, die die Produktionsstückkosten verschiedener Technologien während ihrer gesamten Nutzungsdauer vergleicht. Die größte systemische Einschränkung besteht darin, dass der Wert der für das Netzwerk bereitgestellten Zusatzdienste ignoriert wird.',
  },
  {
    id: slugify('Crisis communication failure'),
    letter: 'C',
    term: 'Versagen der Krisenkommunikation',
    definition: 'Im Notfallmanagement beschreibt ein Krisenkommunikationsversagen das institutionelle Versäumnis, den Informationsraum nach einem schwerwiegenden Vorfall rechtzeitig mit überprüfbaren Nachrichten zu besetzen. Laut dem Chaos Communication Model wird die diskursive Lücke durch alternative oder unbestätigte Narrative besetzt, wenn die verantwortliche Institution während des ersten kritischen Fensters (1–6 Stunden) kein klares Narrativ herausgibt.',
  },
  {
    id: slugify('Criterio N-1'),
    letter: 'C',
    term: 'Kriterium N-1',
    definition: 'Kriterium N-1 ist der grundlegende Sicherheitsstandard beim Betrieb und bei der Planung elektrischer Energieanlagen. Darin heißt es, dass das System in der Lage sein muss, die Spannungs- und Frequenzparameter nach dem drohenden Verlust eines einzelnen Elements innerhalb der gesetzlichen Betriebsgrenzen zu halten, ohne dass es zu kaskadierenden Stromausfällen oder Geräteschäden kommt.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'Nationaler Sicherheitsrat Spaniens. Veröffentlichung des offiziellen Regierungsberichts zusammen mit REE.',
  },
  {
    id: slugify('Curva de capacidad reactiva (Capability Curve)'),
    letter: 'C',
    term: 'Blindleistungskurve (Capability Curve)',
    definition: 'P-Q-Diagramm, das den Betriebsraum eines Generators in der Wirk-Blindleistungsebene begrenzt.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Entenkurve',
    definition: 'Die Entenkurve beschreibt das tägliche Profil des Nettoregulierungsbedarfs in Systemen mit hoher Sonneneinstrahlung: ein tiefes Tief während der zentralen Tagesstunden, gefolgt von einem steilen Abendanstieg.',
  },
  {
    id: slugify('Curvas de estabilidad de tensión Q-V'),
    letter: 'C',
    term: 'Q-V-Spannungsstabilitätskurven',
    definition: 'Die Q-V-Kurven stellen für einen gegebenen Netzknoten das Verhältnis zwischen der eingespeisten bzw. aufgenommenen Blindleistung und der resultierenden Spannung dar. Der Abstand zwischen dem Arbeitspunkt und dem Minimalpunkt der Kurve (Nasenpunkt) definiert den Spielraum der Spannungsstabilität: Je kleiner dieser Spielraum ist, desto größer ist die Gefahr eines Spannungseinbruchs bei zusätzlichen Störungen.',
  },
  {
    id: slugify('Damping ratio'),
    letter: 'D',
    term: 'Dämpfungsverhältnis',
    definition: 'Das Dämpfungsverhältnis (oder relative Dämpfung) ist ein dimensionsloser Indikator, der quantifiziert, wie schnell eine Schwingung nach einer Störung abklingt. Werte nahe 5 % gelten im europäischen Synchronsystem als angemessene Betriebssicherheitsmarge; Werte nahe 0 % deuten auf anhaltende Schwankungen hin, und negative Werte deuten auf eine Zunahme der Amplitude und damit auf das Risiko einer Instabilität hin.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'ENTSO-E-Bewusstseinssystem. ENTSO-E Situational Awareness System, das die Stabilität des europäischen Netzwerks in Echtzeit überwacht.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E-Bewusstseinssystem.',
  },
  {
    id: slugify('Efecto Ferranti'),
    letter: 'E',
    term: 'Ferranti-Effekt',
    definition: 'Der Ferranti-Effekt beschreibt das Phänomen, dass in einer Hochspannungsübertragungsleitung, die mit geringer oder keiner Last betrieben wird, die Spannung auf der Empfangsseite die auf der Sendeseite übersteigt. Ursache ist die verteilte kapazitive Admittanz der Leitung: Bei reduziertem Wirkleistungsfluss wird die kapazitive Last nicht durch die induktive Aufnahme der Lasten kompensiert und es entsteht eine zur Leitungslänge proportionale Überspannung. Dies ist ein besonders relevantes Phänomen, wenn 400-kV-Leitungen im Vakuum mit Strom versorgt werden.',
  },
  {
    id: slugify('Emergent norm theory'),
    letter: 'E',
    term: 'Emergente Normtheorie',
    definition: 'Die Theorie der aufkommenden Normen (Turner und Killian) besagt, dass Gruppen in Situationen der Störung angesichts von Visionen von Massenpanik spontan neue Regeln für adaptives Sozialverhalten entwickeln.',
  },
  {
    id: slugify('Encuadre mediático (Framing) y Agenda-shifting'),
    letter: 'E',
    term: 'Medien-Framing (Framing) und Agenda-Shifting',
    definition: 'Beim Framing handelt es sich um den Prozess, bei dem die Medien bestimmte Elemente eines Ereignisses auswählen und hervorheben, um eine spezifische kausale Interpretation vorzuschlagen. In diesem Zusammenhang liegt ein Agenda-Shifting vor, wenn ein disruptives Ereignis von den Medien instrumentalisiert wird, um die Aufmerksamkeit zu verlagern und bereits bestehende politische oder strukturelle Debatten neu zu eröffnen.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'Das European Network of Transmission System Operators for Electricity (ENTSO-E, Abkürzung auf Englisch: European Network of Transmission System Operators for Electricity) ist der Zusammenschluss von 40 technischen Netzbetreibern (TSO) aus 36 europäischen Ländern. Sein Hauptauftrag, der sich aus den aufeinanderfolgenden Gesetzgebungspaketen der Europäischen Union ergibt, besteht darin, die Sicherheit und Zuverlässigkeit des Betriebs des europäischen Verbundsystems zu gewährleisten, die Integration erneuerbarer Energien zu erleichtern und gemeinsame Netzkodizes (Network Codes) festzulegen, die für alle Mitgliedstaaten verbindlich sind.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Grundlegende Zuverlässigkeitsdienste.',
  },
  {
    id: slugify('Estabilidad de tensión'),
    letter: 'E',
    term: 'Spannungsstabilität',
    definition: 'Systemkapazität, um die Spannungen nach Störungen innerhalb der Betriebsgrenzen zu halten. Erfordert ein Gleichgewicht zwischen Bedarf und Beitrag der Blindleistung.',
  },
  {
    id: slugify('Estabilizadores del Sistema de Potencia (PSS)'),
    letter: 'E',
    term: 'Power System Stabilizers (PSS)',
    definition: 'PSS (Power System Stabilizers) sind zusätzliche Regelkreise, die im Erregersystem großer Synchrongeneratoren installiert werden und die elektromechanischen Schwingungen des Systems elektrisch dämpfen.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Brownfield-Strategie',
    definition: 'In der Energieinfrastrukturtechnik besteht die Brownfield-Strategie darin, bestehende Industrieanlagen – etwa geschlossene Wärme- oder Kernkraftwerke – umzurüsten, um ihnen neue systemische Funktionen zu verleihen, etwa indem sie in Synchronkompensatoren umgewandelt werden.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Schnelle Frequenzantwort (FFR)',
    definition: 'Fast Frequency Response (FFR) ist ein subzyklischer Stabilisierungsdienst, der für leistungselektronische Systeme entwickelt wurde und im kritischen Zeitfenster (typischerweise weniger als 0,25 s) vor der Aktivierung herkömmlicher mechanischer Regler einen massiven Block aktiver Leistung einspeist.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Schnelle Frequenzantwort.',
  },
  {
    id: slugify('Frecuencia nominal'),
    letter: 'F',
    term: 'Nennfrequenz',
    definition: '50 Hz im kontinentaleuropäischen System. Der Po. 1.1 definiert die Betriebsgrenzen: f ∈ [49,0; 51,0] Hz im Normalbetrieb.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'DaF',
    definition: 'Netzfolgender Wechselrichter.',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Netzbildender Wechselrichter.',
  },
  {
    id: slugify('Headroom: Reserva de Capacidad del Inversor'),
    letter: 'H',
    term: 'Spielraum: Kapazitätsreserve für Investoren',
    definition: 'Headroom ist der Bruchteil der maximalen Scheinkapazität, den ein GFM-Wechselrichter reservieren muss, ohne ihn für die aktive Leistungseinspeisung im stationären Zustand zu verwenden, um Spielraum für die Reaktion auf schnelle Transienten zu haben.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HGÜ',
    definition: 'Hochspannungs-Gleichstrom.',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Wechselrichterbasierte Ressourcen.',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT (Insulated Gate Bipolar Transistor)',
    definition: 'Leistungshalbleiter für Wechselrichter. Die isolierte Gate-Steuerung ermöglicht ein schnelles und effizientes Umschalten.',
  },
  {
    id: slugify('Impedancia de transferencia'),
    letter: 'I',
    term: 'Übertragungsimpedanz',
    definition: 'In Energiesystemen stellt die Übertragungsimpedanz zwischen zwei Knoten den elektrischen Widerstand zum Stromfluss zwischen ihnen dar. Eine hohe Übertragungsimpedanz impliziert ein schwach gekoppeltes Netzwerk, in dem kleine Schwankungen der eingespeisten Leistung große Schwankungen der Spannung und des Phasenwinkels hervorrufen können, was die Robustheit des Systems beeinträchtigt.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodemie',
    definition: 'Von der WHO populärer Begriff zur Beschreibung der Überfüllung des Informationsraums mit ungeprüften, fehlerhaften oder falschen Inhalten, die sich in Krisensituationen schnell verbreitet.',
  },
  {
    id: slugify('Inercia Sintética'),
    letter: 'I',
    term: 'Synthetische Trägheit',
    definition: 'Synthetische Trägheit (oder virtuelle Trägheit) ist ein in GFM-Wechselrichtern implementierter Steueralgorithmus, der das Verhalten der Schwingungsgleichung eines elektromechanischen Rotors mathematisch nachbildet. Der Algorithmus misst kontinuierlich die zeitliche Ableitung der Frequenz (df/dt) und passt die eingespeiste Leistung proportional an.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'Stromgestehungskosten',
    definition: 'Energiegestehungskosten.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low-Voltage-Ride-Through (LVRT)',
    definition: 'Unter Low Voltage Ride Through (LVRT) versteht man die Fähigkeit eines Wechselrichters, die Stromeinspeisung während eines Spannungsabfalls aufrechtzuerhalten, anstatt zum Schutz auszulösen.',
  },
  {
    id: slugify('Mallado'),
    letter: 'M',
    term: 'Netz',
    definition: 'Operatives topologisches Rekonfigurationsmanöver, das zuvor getrennte Umspannwerke über 400-kV-Leitungen verbindet. Bei 28A wurde der Ferranti-Effekt aktiviert.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Netzkodex zu Anforderungen an Generatoren (NC RfG)',
    definition: 'Der Netzwerkkodex zu Anforderungen an Generatoren ist der von ENTSO-E erstellte europäische Netzwerkkodex, der die obligatorischen technischen Anforderungen harmonisiert, die Erzeugungsanlagen für den Anschluss an das Netzwerk erfüllen müssen. In der Version 2.0, die nach dem Zusammenbruch der iberischen Halbinsel vorgeschlagen wurde, werden nun obligatorische Fähigkeiten zur Bildung eines Gitters eingeführt.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'Laststufenschalter.',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Auslösung aus dem Tritt.',
  },
  {
    id: slugify('Oscilaciones electromecánicas'),
    letter: 'O',
    term: 'Elektromechanische Schwingungen',
    definition: 'Schwingungsmodi im Zusammenhang mit der Interaktion zwischen Synchrongeneratoren. Typischerweise 0,1–2 Hz. Bei 28 A wurde eine Schwingung von 0,6 Hz festgestellt.',
  },
  {
    id: slugify('Oscilaciones forzadas y naturales'),
    letter: 'O',
    term: 'Erzwungene und natürliche Schwingungen',
    definition: 'Eine Schwingung wird erzwungen, wenn sie durch eine periodische äußere Störung – typischerweise ein Fehler oder ein anormales Verhalten im Regelkreis eines bestimmten Geräts – induziert wird, im Vergleich zu den natürlichen Schwingungen oder Modi des Systems, deren Frequenz durch die Trägheit selbst und durch die elektromechanischen Konstanten der angeschlossenen Synchronmaschinen bestimmt wird.',
  },
  {
    id: slugify('Outrage communication (Comunicación de indignación)'),
    letter: 'O',
    term: 'Empörungskommunikation',
    definition: 'Basierend auf dem Sandman-Modell (Risiko = Gefahr + Empörung) weist dieses Konzept darauf hin, dass die öffentliche Wahrnehmung eines Risikos stärker von emotionalen Faktoren (Empörung, Wahrnehmung von Fahrlässigkeit) als von der technischen Bewertung der tatsächlichen Gefahr abhängt.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phasenregelkreis.',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Zeigermesseinheit.',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'Integrierter nationaler Energie- und Klimaplan.',
  },
  {
    id: slugify('Potencia de cortocircuito (Ssc)'),
    letter: 'P',
    term: 'Kurzschlussleistung (Ssc)',
    definition: 'Die Kurzschlussleistung (Ssc) in einem Knoten ist die momentane Stromstärke, die das System bei Spannungsmangel einspeisen kann. Definiert die elektrische Steifigkeit des Knotens: Ein hoher Ssc ermöglicht den korrekten Betrieb der Distanzschutzvorrichtungen, die selektive Koordinierung der Überstromschutzvorrichtungen und die Aufrechterhaltung der Synchronisierung ihrer Steueralgorithmen durch die Wechselrichter.',
  },
  {
    id: slugify('Power System Stabilizers y Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'Netzstabilisatoren und Leistungsschwingungsdämpfung (PSS/POD)',
    definition: 'Power System Stabilizers (PSS) und Power Oscillation Damping (POD)-Systeme sind zusätzliche Steuermodule, die in Wechselrichtern (insbesondere im GFM-Modus) installiert sind und Push-Pull-Signale einspeisen, um elektromechanische Schwingungen kleiner und großer Störungen zu dämpfen.',
  },
  {
    id: slugify('Procedimiento de Operación 1.6 (P.O. 1.6)'),
    letter: 'P',
    term: 'Vorgehensweise 1.6 (P.O. 1.6)',
    definition: 'Betriebsverfahren 1.6 ist das Notfallprotokoll des spanischen Elektrizitätssystems, das die Pläne zur Sicherung und Wiederauffüllung der Versorgung im Falle kritischer Vorfälle festlegt. Es bestimmt die topologischen Fragmentierungsstrategien des Netzwerks in unabhängige elektrische Inseln, die bevorzugten Energieversorgungsrouten und das Anlaufpriorisierungsprotokoll der Erzeugungsanlagen, um das System nach einem teilweisen oder vollständigen Spannungsnullpunkt wiederherzustellen.',
  },
  {
    id: slugify('Procedimiento de Operación 7.4 (P.O. 7.4)'),
    letter: 'P',
    term: 'Vorgehensweise 7.4 (P.O. 7.4)',
    definition: 'Der Po. 7.4 ist die technische Regelung des spanischen Elektrizitätssystems, die den Spannungsregelungsdienst im Übertragungsnetz regelt. Definiert die Pflichten der Erzeuger zur Aufnahme oder Einspeisung von Blindleistung (Q) auf der Grundlage der vom Netzbetreiber übermittelten Anweisungen.',
  },
  {
    id: slugify('Programa DS3 de EirGrid'),
    letter: 'P',
    term: 'EirGrid DS3-Programm',
    definition: 'Das Programm „Delivering a Secure, Sustainable Electricity System“ (DS3) ist das bahnbrechende Rahmenwerk für Systemdienstleistungen von EirGrid (Irland), das darauf ausgelegt ist, das Inselsystem mit asynchronen erneuerbaren Energien von bis zu 75 % zu betreiben.',
  },
  {
    id: slugify('Protecciones de pérdida de sincronismo (OST)'),
    letter: 'P',
    term: 'Out of Sync (OST)-Schutz',
    definition: 'OST-Relais (Out-of-Step Tripping) sind systemische Schutzsysteme zur Erkennung schwerer Winkelabweichungen zwischen miteinander verbundenen Bereichen (Polschlupf). Wenn die Winkelphasendifferenz die elektromechanischen Stabilitätsgrenzen überschreitet, öffnen die Relais automatisch die Verbindungsleitungen, um strukturelle Schäden zu verhindern.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regionales Koordinierungszentrum.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Spanisches Stromnetz.',
  },
  {
    id: slugify('Régimen de Renovables, Cogeneración y Residuos (RCR)'),
    letter: 'R',
    term: 'Erneuerbare Energie, Kraft-Wärme-Kopplung und Abfallregime (RCR)',
    definition: 'Das Renewable, Cogeneration and Waste Regime (RCR) ist der Regulierungsrahmen des spanischen Elektrizitätssystems, der Anlagen zur Erzeugung elektrischer Energie aus dekarbonisierten Quellen zusammenfasst.',
  },
  {
    id: slugify('Relés de comprobación de sincronismo (Synchro-check)'),
    letter: 'R',
    term: 'Synchronprüfrelais',
    definition: 'Das Synchro-Check-Relais (Funktion 25 ANSI) ist eine Schutzvorrichtung, die bei Kupplungsmanövern getrennter elektrischer Systeme (Inseln) eingesetzt wird. Seine Funktion besteht darin, kontinuierlich zu überwachen, dass Spannung, Frequenz und Phasenwinkel auf beiden Seiten eines offenen Schalters innerhalb vorab festgelegter Toleranzbereiche liegen.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'R',
    term: 'Lastabwurfrelais (UFLS)',
    definition: 'Unterfrequenz-Lastabwurf (UFLS) ist der letzte Ausweg des Verteidigungssystems: Wenn die Frequenz unter vordefinierte Schwellenwerte fällt, trennen UFLS-Relais automatisch Lasten, um das Gleichgewicht zwischen Erzeugung und Nachfrage wiederherzustellen.',
  },
  {
    id: slugify('Reserva de Restauración de Frecuencia Automática (aFRR)'),
    letter: 'R',
    term: 'Automatische Frequenzwiederherstellungsreserve (aFRR)',
    definition: 'aFRR (Automatic Frequency Restoration Reserve), früher auch Sekundärregulierung genannt, ist ein Systemanpassungsdienst, der nach einer Frequenzabweichung automatisch aktiviert wird.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Rate der Frequenzänderung (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Aufsichtskontrolle und Datenerfassung.',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Kurzschlussverhältnis.',
  },
  {
    id: slugify('Servicios Esenciales de Confiabilidad (ERS)'),
    letter: 'S',
    term: 'Essential Reliability Services (ERS)',
    definition: 'Essential Reliability Services (ERS) fassen die physikalischen Eigenschaften zusammen, die für einen sicheren Netzbetrieb unerlässlich sind, wie z. B. Trägheit, Kurzschlussleistung, schnelle Frequenzreaktion und dynamische Spannungsregelung.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Synchronismus',
    definition: 'Betriebszustand, bei dem alle Generatoren mit der gleichen Kreisfrequenz rotieren. Verlust der Synchronität = Kaskadenabschaltung.',
  },
  {
    id: slugify('Sistema en por unidad (p.u.)'),
    letter: 'S',
    term: 'System in pro Einheit (p.u.)',
    definition: 'Das System pro Einheit (p.u.) ist eine in der Elektroenergietechnik verwendete Normalisierungskonvention, die Systemgrößen (Spannung, Strom, Leistung, Impedanz) als dimensionslose Verhältnisse in Bezug auf Basisreferenzwerte ausdrückt.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'S',
    term: 'VOLTAIRE-System',
    definition: 'Das VOLTAIRE-System (integriert in das Renewable Energy Control Center, CECRE) ist die von REE implementierte Architektur für die dynamische Spannungsregelung im Halbinselsystem. Es operiert in zwei hierarchischen Ebenen: Tertiärregulierung und Sekundärregulierung.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'OS GL (Systembetriebsrichtlinien)',
    definition: 'Von ENTSO-E herausgegebene Systembetriebsrichtlinien. Sie legen minimale operative Stabilitätsmargen fest.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronkondensator.',
  },
  {
    id: slugify('Tasa de Cambio de Frecuencia (RoCoF)'),
    letter: 'T',
    term: 'Rate of Change of Frequency (RoCoF)',
    definition: 'Die Rate of Change of Frequency (RoCoF) quantifiziert die Änderungsrate der Systemfrequenz als Reaktion auf eine Störung, typischerweise ausgedrückt in Hz/s. Es handelt sich um den kritischsten dynamischen Parameter für die transiente Stabilität: Ein hoher RoCoF reduziert die Zeit, die den Regulierungssystemen zum Handeln zur Verfügung steht, und beschleunigt so die Kaskade von Schutzabschaltungen.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'ÜNB',
    definition: 'Übertragungsnetzbetreiber.',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Lastabwurf bei Unterfrequenz.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Vacuum filling (Relleno del vacío informativo)'),
    letter: 'V',
    term: 'Vakuumbefüllung',
    definition: 'Vakuumfüllung ist der strukturelle und unvermeidliche Prozess, durch den die kollektive Unsicherheit angesichts einer Katastrophe eine Nachfrage nach Antworten erzeugt, die, wenn sie von offiziellen Institutionen nicht befriedigt wird, spontan von nicht autorisierten Quellen gedeckt wird.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'Die Vehicle-to-Grid-Technologie (V2G) ermöglicht die Bidirektionalität der Batterien von Elektrofahrzeugen und ermöglicht es ihnen, Wirk- und Blindleistung in das Netz einzuspeisen.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Weitbereichsüberwachungssystem.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inercia (H)'),
    letter: 'I',
    term: 'Trägheit (H)',
    definition: 'Die Trägheitskonstante H ist ein dimensionsloser Parameter, der die in den rotierenden Massen eines Synchrongenerators gespeicherte kinetische Energie im Verhältnis zu seiner Nennleistung quantifiziert. Je größer H ist, desto langsamer erfolgt die Frequenzänderung bei Störungen (höher der tolerierbare RoCoF). Auf 28A operierte das System mit H ≈ 2,3 s auf der Ebene der Halbinsel, jedoch mit Zonenwerten von 1,3–1,8 s im Süden.',
  },
  {
    id: slugify('Potencia reactiva'),
    letter: 'P',
    term: 'Blindleistung',
    definition: 'Bestandteil der elektrischen Energie, der mit der Speicherung und Freisetzung von Energie in elektrischen und magnetischen Feldern verbunden ist (die nicht als Wärme abgegeben wird). Sie wird in VAr gemessen. Die Blindleistungsbilanz bestimmt den Spannungsverlauf im Netz: Ein Überschuss an kapazitiver Blindleistung lässt die Spannung ansteigen (Surge); ein Defizit deprimiert sie. Bei 28A war der Zusammenbruch im Wesentlichen auf einen Überschuss an kapazitiver Blindleistung zurückzuführen, die von den Vakuumleitungen nach dem Ineinandergreifen injiziert wurde.',
  },
  {
    id: slugify('Potencia activa'),
    letter: 'P',
    term: 'Wirkleistung',
    definition: 'Bestandteil der elektrischen Energie, der nützliche Arbeit leistet. Sie wird in Watt (W) gemessen. Dabei handelt es sich um die Leistung, die die Last tatsächlich verbraucht. Es wird durch die Erzeugungsverteilung gesteuert und bestimmt die Frequenzbalance des Systems.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Schwarzstart',
    definition: 'Siehe „Schwarzstart“. Fähigkeit bestimmter Erzeugungsanlagen, ohne externe Netzspannung zu starten, um nach einem Totalausfall den Wiederaufbau der Versorgung zu gewährleisten.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tippen Sie auf Verzögerung',
    definition: 'Phänomen, bei dem die mechanische Trägheit von Laststufenschaltern (OLTC) zu einer Verzögerung von mehreren zehn Sekunden bei der Anpassung des Übersetzungsverhältnisses führt. Während 28 A hatten die OLTCs die Anzapfungen erhöht, um frühere Spannungsabfälle auszugleichen; Als die Überspannung eintraf, konnten sie diese nicht rechtzeitig absenken, was die Spannung in Richtung der 220-kV-Kollektornetze verstärkte und einen „blinden Fleck“ der Beobachtbarkeit im REE-SCADA erzeugte.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Netzwerkkodex zu Anforderungen an Generatoren. Siehe „Netzwerkkodex zu Anforderungen an Generatoren (NC RfG)“.',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Wechselrichter-Betriebsmodus, bei dem das Gerät mithilfe eines PLL-Algorithmus (Phase-Locked Loop) passiv mit der Netzspannung und -frequenz synchronisiert wird. Es erfordert ein stabiles externes Netzwerk und kann nicht autonom arbeiten. 78 % des 28A IBR-Parks wurden im netzgetreuen Modus betrieben.',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Gitterbildung)',
    definition: 'Wechselrichter-Betriebsart, bei der das Gerät als ideale Spannungsquelle fungiert und aktiv seine eigene Spannungs- und Frequenzwellenform aufbaut. Es kann das Netzwerk autonom aufrechterhalten und auf Störungen reagieren, ohne dass eine externe Referenz erforderlich ist. Es handelt sich um die von ENTSO-E im NC RfG 2.0 vorgeschlagene Schlüsseltechnologie für Systeme mit hohem Anteil erneuerbarer Energien.',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phasenregelkreis (PLL)',
    definition: 'Siehe „PLL“. Elektronischer Steueralgorithmus, der den Ausgang eines Wechselrichters mit der Spannung und Frequenz des Netzes synchronisiert. Ihre Abhängigkeit von einem stabilen Netzwerk ist die strukturelle Beschränkung netzorientierter Investoren.',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Siehe „SCADA“. Echtzeit-Überwachungs- und Steuerungssystem des Stromnetzes. Während 28 A zeigte das SCADA von REE Spannungen im 400-kV-Netz innerhalb der gesetzlichen Grenzen (418 kV in Granada), während das Tap-Lag-Phänomen echte Überspannungen von 244 kV in der 220-kV-Sekundärseite erzeugte, die für den Bediener unsichtbar waren.',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'Siehe „WAMS“. Großflächiges Überwachungssystem basierend auf GPS-synchronisierten PMUs. Es ermöglicht die Beobachtung der Netzwerkdynamik auf kontinentalen geografischen Skalen mit einer Auflösung von Millisekunden.',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Siehe „PMU“. Zeigermesseinheit. Gerät, das Spannung und Strom an mehreren Punkten im Netzwerk synchron mit einer Zeitauflösung von Millisekunden misst, was für die Analyse von Schwingungen zwischen Bereichen unerlässlich ist.',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Frequenzänderungsrate)',
    definition: 'Siehe „Rate of Change of Frequency (RoCoF)“ und „RoCoF“. Kritischer dynamischer Parameter, der die Geschwindigkeit der Frequenzänderung (Hz/s) bei Störungen quantifiziert.',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Unterfrequenzlastabwurf)',
    definition: 'Siehe „Lastabwurfrelais (UFLS)“. Automatischer Lasttrennmechanismus, wenn die Frequenz unter vordefinierte Schwellenwerte fällt, um das Gleichgewicht zwischen Erzeugung und Nachfrage wiederherzustellen.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Siehe „EAS (ENTSO-E Awareness System)“. ENTSO-E Situational Awareness System zur Echtzeitüberwachung des europäischen elektrischen Systems.',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (Laststufenschalter)',
    definition: 'Siehe „On-Load-Stufenschalter (OLTC)“. Elektromechanischer Mechanismus in Leistungstransformatoren, der das Übersetzungsverhältnis ohne Betriebsunterbrechung mit einer mechanischen Verzögerung von mehreren Sekunden pro Schritt anpasst.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'OS GL (Systembetriebsrichtlinien)',
    definition: 'Siehe „SO GL (System Operation Guidelines)“. ENTSO-E-Systembetriebsrichtlinien, die fünf Stufen des Betriebsschweregrads definieren (Normal, Alarm, Notfall, Stromausfall, Wiederherstellung).',
  },
  {
    id: slugify('Capacidad Neta de Transferencia (NTC)'),
    letter: 'C',
    term: 'Nettoübertragungskapazität (NTC)',
    definition: 'Nettoübertragungskapazität (NTC). Maximale Energieaustauschkapazität zwischen zwei Regelzonen, die vorab zwischen benachbarten Netzbetreibern (REE und RTE im iberischen Fall) vereinbart wurde. Auf 28A betrug der NTC der Verbindung Spanien-Frankreich etwa 3 % der Nachfrage auf der Halbinsel und lag damit deutlich unter dem europäischen Ziel von 15 %.',
  },
  {
    id: slugify('Ratio de amortiguamiento'),
    letter: 'R',
    term: 'Dämpfungsverhältnis',
    definition: 'Das Dämpfungsverhältnis (oder relative Dämpfung) ist ein dimensionsloser Indikator, der quantifiziert, wie schnell eine Schwingung nach einer Störung abklingt. Werte nahe 5 % gelten im europäischen Synchronsystem als angemessene Betriebssicherheitsmarge; Werte nahe 0\% deuten auf anhaltende Schwankungen hin, und negative Werte deuten auf eine Zunahme der Amplitude und damit auf das Risiko einer Instabilität hin.',
  },
  {
    id: slugify('Potencia de cortocircuito'),
    letter: 'P',
    term: 'Kurzschlussstrom',
    definition: 'Die Kurzschlussleistung ($S_{sc}$) an einem Netzwerkknoten ist ein Maß für dessen elektromagnetische „Stärke“. Es stellt die Menge an Scheinstrom dar, die im Falle eines dreiphasigen freien Kurzschlusses zu diesem Knoten fließen würde. Eine hohe Kurzschlussleistung, die typischerweise von großen Synchrongeneratoren bereitgestellt wird, bedeutet, dass die Spannung an diesem Knoten sehr robust und widerstandsfähig ist und bei Störungen, plötzlichen Lastverbindungen oder Manövern im Netzwerk nur minimalen Schwankungen unterliegt.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Brownfield-Strategie',
    definition: 'In der Energieinfrastrukturtechnik besteht die Brownfield-Strategie in der Umrüstung bestehender Industrieanlagen – etwa geschlossener thermischer oder nuklearer Kraftwerke –, um ihnen neue systemische Funktionen zu verleihen. In diesem Zusammenhang bedeutet dies, die großen Originalgeneratoren zu erhalten, die im Vakuum als Synchronkompensatoren arbeiten, natürliche Trägheit und Kurzschlussstrom bereitstellen und die Vorteile der bereits gebauten Umspannwerke und Evakuierungsleitungen zu nutzen, um Kosten und Implementierungszeiten drastisch zu reduzieren.',
  },
  {
    id: slugify('Sistema por Unidad (p.u.)'),
    letter: 'S',
    term: 'System pro Einheit (p.u.)',
    definition: 'Das System pro Einheit (p.u.) ist eine in der Elektroenergietechnik verwendete Normalisierungskonvention, die Systemgrößen (Spannung, Strom, Leistung, Impedanz) als dimensionslose Verhältnisse in Bezug auf Basisreferenzwerte ausdrückt. Als Spannungsbasis wird üblicherweise der Nennwert des Netzwerks am Analyseknoten und als Leistungsbasis die Nennscheinleistung des Geräts oder Systems verwendet. Der Hauptvorteil ist die Eliminierung von Skalentransformationen bei der Analyse von Netzwerken mit mehreren Spannungsebenen, die durch Transformatoren miteinander verbunden sind. Im Rahmen der Wechselrichteranalyse wird die Darstellung von Fehlerströmen in p.u. ermöglicht den direkten Vergleich der Einspeiseleistung von Wechselrichtern (1{,}1–1{,}2 p.u.) mit der von Synchrongeneratoren (5–7 p.u.), unabhängig von der Nennleistung der jeweiligen Technologie.',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs. GFM (Rasterfolgend vs. Rasterbildend)',
    definition: 'Die Grid-Following-Topologie (GFL) modelliert den Wechselrichter als kontrollierte Stromquelle, die von einer externen Messung der Netzspannung abhängt (über die Phasenfolgeschleife, PLL). Sein Vorteil ist Einfachheit und niedrige Kosten; Seine entscheidende Einschränkung besteht darin, dass es nicht autonom agieren oder Spannungen in schwachen Netzwerken aufbauen kann. Die Grid-Forming-Topologie (GFM) modelliert den Wechselrichter als ideale Spannungsquelle hinter einer virtuellen Reaktanz und ermöglicht so einen autonomen Betrieb, eine robuste Fehlerstromeinspeisung und synthetische Trägheit. Das NC RfG 2.0 schreibt den Übergang zu GFM für bedeutende Neuinstallationen verpflichtend vor.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Entenkurve',
    definition: 'Die Entenkurve beschreibt das tägliche Profil des Nettoregulierungsbedarfs in Systemen mit hoher Sonneneinstrahlung: ein tiefes Tief während der zentralen Stunden des Tages (wenn der Grundverbrauch niedrig, aber die Solarerzeugung maximal ist), gefolgt von einem steilen Abendanstieg. Der Frühling ist die Zeit maximaler Tiefe und Verletzlichkeit. Im Fall von 28A fiel die Tiefe des Tals mit einem außerordentlich steilen Anstieg der Sonneneinstrahlung zusammen, so dass das System im kritischen Moment nur über eine minimale reaktive Absorptionskapazität verfügte.',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Kopffreiheit',
    definition: 'Headroom ist der Bruchteil der maximalen Scheinkapazität ($S_{}$), den ein GFM-Wechselrichter reservieren muss, ohne ihn für die aktive Leistungseinspeisung im eingeschwungenen Zustand zu verwenden. Diese Reserve ist notwendig, um sicherzustellen, dass der Wechselrichter bei schnellen Spannungs- oder Frequenzstörungen ausreichend Handlungsspielraum hat. Das Erfordernis von Spielraum reduziert die Einnahmen auf dem Energiemarkt, was die strukturellen wirtschaftlichen Spannungen darstellt, die die Schaffung von Märkten für Essential Reliability Services (ERS) rechtfertigen, um diese Reaktionsfähigkeit explizit zu vergüten.',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT (Low-Voltage-Ride-Through)',
    definition: 'Unter Low Voltage Ride Through (LVRT) versteht man die Fähigkeit eines Wechselrichters, die Stromeinspeisung während eines Spannungsabfalls aufrechtzuerhalten, anstatt zum Schutz auszulösen. Die LVRT-Anforderungen in Spanien werden vom P.O. geregelt. 12.3 und beinhalten den dynamischen Parameter $k$ (Proportionalitätsfaktor des Blindstroms in Bezug auf die Tiefe des Lochs). Der 28A-Blackout zeigte, dass in Netzwerken mit $SCR < 2$ die massive Einspeisung von reaktivem Material gemäß herkömmlichen LVRT-Profilen die Instabilität verstärken kann, anstatt sie einzudämmen, was eine Überprüfung der Koordination zwischen LVRT-Steuerung und Netzwerkschwäche erfordert.',
  },
];


```

### 📄 Archivo: `src\data\glossary_en.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Spanish Association of Electricity Companies. Groups the main companies in the Spanish electricity sector. Co-financed the IIT-ICAI report.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve. The aFRR (Automatic Frequency Restoration Reserve), historically known as secondary regulation, is a system adjustment service activated automatically following a frequency deviation. It aims to progressively restore the frequency to its nominal value (50 Hz) and restore flows in interconnections.',
  },
  {
    id: slugify('Área de Control'),
    letter: 'C',
    term: 'Control Area',
    definition: 'Geographical zone under the responsibility of a Transmission System Operator (TSO).',
  },
  {
    id: slugify('Arranque autónomo (Black Start)'),
    letter: 'B',
    term: 'Black Start',
    definition: 'Black Start capability is the adjustment service by which certain generation facilities can start up and begin injecting energy into the grid without needing external electrical voltage.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Battery Energy Storage System.',
  },
  {
    id: slugify('BESS con inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS with Grid-Forming inverters (BESS-GFM)',
    definition: 'Battery Energy Storage Systems with Grid-Forming inverters (BESS-GFM) combine high electrochemical density with power electronics capable of operating as an ideal and autonomous voltage source.',
  },
  {
    id: slugify('Bucle de retroalimentación (Feedback loop)'),
    letter: 'F',
    term: 'Feedback loop',
    definition: 'A positive feedback loop describes a mechanism where an initial disturbance causes a system response that amplifies the deviation. In the context of the incident, each IBR plant trip reduced reactive absorption, raising voltage, which in turn caused more trips.',
  },
  {
    id: slugify('Cambiadores de Tomas en Carga (OLTC)'),
    letter: 'O',
    term: 'On-Load Tap Changers (OLTC)',
    definition: 'An On-Load Tap Changer (OLTC) is an electromechanical mechanism installed in large power transformers that adjusts the transformation ratio without interrupting the power flow. Its response time is typically several seconds per step.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Combined Cycle Gas Turbine.',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Control Center of Renewable Energies. The operational entity of REE responsible for real-time monitoring and dispatching of renewable parks and storage systems.',
  },
  {
    id: slugify('Centros de Coordinación Regional (RCC)'),
    letter: 'R',
    term: 'Regional Coordination Centres (RCC)',
    definition: 'Regional Coordination Centres (RCC) are supranational entities established by European regulations to facilitate operational cooperation among Transmission System Operators (TSOs).',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'Q',
    term: 'Q-V Collapse',
    definition: 'Voltage instability in the reactive power–voltage plane. The dominant mechanism of the April 28 incident.',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'S',
    term: 'Synchronous Condensers (SynCons)',
    definition: 'Synchronous Condensers are synchronous rotary machines operated under no-load that provide genuine rotational inertia and fault current injection capacity of 300–400% of their nominal value.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'S',
    term: 'Static Synchronous Compensator (STATCOM)',
    definition: 'A STATCOM is an active reactive power compensation device based on power electronics (VSC inverters) that injects or absorbs reactive power continuously and dynamically.',
  },
  {
    id: slugify('Control Grid-forming frente a Grid-following'),
    letter: 'G',
    term: 'Grid-forming vs Grid-following control',
    definition: 'A grid-following inverter passively synchronizes with pre-existing voltage and frequency. A grid-forming inverter acts as an ideal voltage source behind an impedance, establishing its own voltage and frequency.',
  },
  {
    id: slugify('Coste Nivelado de la Energía (LCOE)'),
    letter: 'L',
    term: 'Levelized Cost of Energy (LCOE)',
    definition: 'The Levelized Cost of Energy (LCOE) is the standard economic metric comparing the unit cost of production across technologies over their lifespan.',
  },
  {
    id: slugify('Crisis communication failure'),
    letter: 'C',
    term: 'Crisis communication failure',
    definition: 'The institutional failure to occupy the information space with verifiable messages after a serious incident in a timely manner.',
  },
  {
    id: slugify('Criterio N-1'),
    letter: 'N',
    term: 'N-1 Criterion',
    definition: 'The fundamental safety rule in power system operation establishing that the system must maintain operational limits following the contingent loss of any single element.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'National Security Council of Spain. Published the official government report along with REE.',
  },
  {
    id: slugify('Curva de capacidad reactiva (Capability Curve)'),
    letter: 'C',
    term: 'Capability Curve',
    definition: 'P-Q diagram defining the operational limits of a generator in the active-reactive power plane.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'D',
    term: 'Duck Curve',
    definition: 'The duck curve describes the daily net regulation demand profile in systems with high solar penetration: a deep depression during central hours followed by a steep evening ramp.',
  },
  {
    id: slugify('Curvas de estabilidad de tensión Q-V'),
    letter: 'Q',
    term: 'Q-V voltage stability curves',
    definition: 'Q-V curves represent the relationship between injected or absorbed reactive power and the resulting voltage at a given network node.',
  },
  {
    id: slugify('Damping ratio'),
    letter: 'D',
    term: 'Damping ratio',
    definition: 'A dimensionless indicator quantifying how quickly an oscillation attenuates after a disturbance. Values near 5% are considered a reasonable safety margin in the European synchronous system.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'ENTSO-E Awareness System that monitors European grid stability in real-time.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E Awareness System.',
  },
  {
    id: slugify('Efecto Ferranti'),
    letter: 'F',
    term: 'Ferranti Effect',
    definition: 'The phenomenon by which the voltage at the receiving end of a lightly loaded high-voltage transmission line exceeds the sending end voltage due to the distributed capacitive admittance.',
  },
  {
    id: slugify('Emergent norm theory'),
    letter: 'E',
    term: 'Emergent norm theory',
    definition: 'The theory (Turner and Killian) arguing that, contrary to views of mass panic, groups in disruptive situations spontaneously develop new adaptive social behavior rules.',
  },
  {
    id: slugify('Encuadre mediático (Framing) y Agenda-shifting'),
    letter: 'F',
    term: 'Framing and Agenda-shifting',
    definition: 'Framing is how media select and emphasize certain elements of an event to propose a specific causal interpretation. Agenda-shifting occurs when a disruptive event is weaponized to reopen pre-existing structural debates.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'European Network of Transmission System Operators for Electricity. Groups 40 TSOs from 36 European countries.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Essential Reliability Services.',
  },
  {
    id: slugify('Estabilidad de tensión'),
    letter: 'V',
    term: 'Voltage stability',
    definition: 'The ability of the system to maintain voltages within operational limits after disturbances. Requires balance between demand and reactive power supply.',
  },
  {
    id: slugify('Estabilizadores del Sistema de Potencia (PSS)'),
    letter: 'P',
    term: 'Power System Stabilizers (PSS)',
    definition: 'Control loops installed in the excitation system of large synchronous generators that add electrical damping to electromechanical oscillations.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'B',
    term: 'Brownfield Strategy',
    definition: 'The conversion of existing industrial facilities (like closed thermal plants) to provide new systemic functions, such as operating as synchronous condensers.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Fast Frequency Response (FFR)',
    definition: 'A sub-cyclic stabilization service designed for power electronics systems that injects a massive block of active power in the critical time window before mechanical regulators act.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Fast Frequency Response.',
  },
  {
    id: slugify('Frecuencia nominal'),
    letter: 'N',
    term: 'Nominal frequency',
    definition: '50 Hz in the continental European system. Operational limits are generally [49.0, 51.0] Hz.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'GFL',
    definition: 'Grid-Following Inverter.',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Grid-Forming Inverter.',
  },
  {
    id: slugify('Headroom: Reserva de Capacidad del Inversor'),
    letter: 'H',
    term: 'Headroom',
    definition: 'The fraction of maximum apparent capacity that a GFM inverter must keep in reserve to respond to rapid transients.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HVDC',
    definition: 'High Voltage Direct Current.',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Inverter-Based Resources.',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT',
    definition: 'Power semiconductor used in inverters. Insulated gate control allows fast and efficient switching.',
  },
  {
    id: slugify('Impedancia de transferencia'),
    letter: 'T',
    term: 'Transfer impedance',
    definition: 'The electrical opposition to power flow between two nodes. High impedance implies a weakly coupled grid.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodemic',
    definition: 'Overpopulation of the information space with unverified or false content that spreads rapidly during crises.',
  },
  {
    id: slugify('Inercia Sintética'),
    letter: 'S',
    term: 'Synthetic Inertia',
    definition: 'A control algorithm in GFM inverters that mathematically emulates the swing equation of an electromechanical rotor.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'LCOE',
    definition: 'Levelized Cost of Energy.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low Voltage Ride Through (LVRT)',
    definition: 'The capability of an inverter to maintain energy injection during a voltage dip rather than disconnecting.',
  },
  {
    id: slugify('Mallado'),
    letter: 'M',
    term: 'Network Meshing',
    definition: 'Topological reconfiguration connecting previously separated substations. Triggered the Ferranti effect during the blackout.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Network Code on Requirements for Generators (NC RfG)',
    definition: 'The European grid code establishing mandatory technical requirements for generation facilities.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'On-Load Tap Changer.',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Out-of-Step Tripping.',
  },
  {
    id: slugify('Oscilaciones electromecánicas'),
    letter: 'E',
    term: 'Electromechanical oscillations',
    definition: 'Oscillatory modes associated with the interaction between synchronous generators, typically 0.1–2 Hz.',
  },
  {
    id: slugify('Oscilaciones forzadas y naturales'),
    letter: 'F',
    term: 'Forced and natural oscillations',
    definition: 'Forced oscillations are induced by external periodic disturbances, while natural oscillations are inherent to the system inertia and electromechanical constants.',
  },
  {
    id: slugify('Outrage communication (Comunicación de indignación)'),
    letter: 'O',
    term: 'Outrage communication',
    definition: 'Concept indicating that public perception of risk depends more on emotional factors than technical evaluation.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phase-Locked Loop.',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Phasor Measurement Unit.',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'National Integrated Energy and Climate Plan (Spain).',
  },
  {
    id: slugify('Potencia de cortocircuito (Ssc)'),
    letter: 'S',
    term: 'Short-circuit power (Ssc)',
    definition: 'The magnitude of current the system can inject during a voltage fault, defining the electrical stiffness of the node.',
  },
  {
    id: slugify('Power System Stabilizers y Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'PSS/POD',
    definition: 'Additional control modules installed in inverters that inject out-of-phase signals designed to damp electromechanical oscillations.',
  },
  {
    id: slugify('Procedimiento de Operación 1.6 (P.O. 1.6)'),
    letter: 'O',
    term: 'Operation Procedure 1.6 (P.O. 1.6)',
    definition: 'Spanish emergency protocol establishing safeguard and restoration plans during critical incidents.',
  },
  {
    id: slugify('Procedimiento de Operación 7.4 (P.O. 7.4)'),
    letter: 'O',
    term: 'Operation Procedure 7.4 (P.O. 7.4)',
    definition: 'Technical regulation regulating the voltage control adjustment service in the transmission grid.',
  },
  {
    id: slugify('Programa DS3 de EirGrid'),
    letter: 'D',
    term: 'EirGrid DS3 Program',
    definition: 'Delivering a Secure, Sustainable Electricity System, the pioneering ancillary services framework of Ireland.',
  },
  {
    id: slugify('Protecciones de pérdida de sincronismo (OST)'),
    letter: 'O',
    term: 'Out-of-Step Tripping (OST)',
    definition: 'Systemic protection schemes designed to detect severe angular divergences between interconnected areas.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regional Coordination Centre.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Red Eléctrica de España (Spanish TSO).',
  },
  {
    id: slugify('Régimen de Renovables, Cogeneración y Residuos (RCR)'),
    letter: 'R',
    term: 'RCR Regime',
    definition: 'Regulatory framework for renewable and low-carbon energy production in Spain.',
  },
  {
    id: slugify('Relés de comprobación de sincronismo (Synchro-check)'),
    letter: 'S',
    term: 'Synchro-check relays',
    definition: 'Protection devices used during coupling maneuvers of separated electrical systems to ensure voltage, frequency, and phase angle are within tolerances.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'U',
    term: 'Under-Frequency Load Shedding (UFLS)',
    definition: 'The last-resort mechanism that automatically disconnects load when frequency falls below predefined thresholds.',
  },
  {
    id: slugify('Reserva de Restauración de Frecuencia Automática (aFRR)'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Rate of Change of Frequency (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Supervisory Control and Data Acquisition.',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Short Circuit Ratio.',
  },
  {
    id: slugify('Servicios Esenciales de Confiabilidad (ERS)'),
    letter: 'E',
    term: 'Essential Reliability Services (ERS)',
    definition: 'The physical attributes indispensable for safe grid operation, such as inertia, short-circuit power, and voltage control.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Synchronism',
    definition: 'Operating condition where all generators rotate at the same angular frequency. Loss of synchronism equals cascade disconnection.',
  },
  {
    id: slugify('Sistema en por unidad (p.u.)'),
    letter: 'P',
    term: 'Per-unit system (p.u.)',
    definition: 'A normalization convention used in power electrical engineering expressing system magnitudes as dimensionless ratios against base reference values.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'V',
    term: 'VOLTAIRE System',
    definition: 'The architecture implemented by REE for dynamic voltage regulation in the peninsular system.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'System Operation Guidelines issued by ENTSO-E establishing minimum operational margins.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronous Condenser.',
  },
  {
    id: slugify('Tasa de Cambio de Frecuencia (RoCoF)'),
    letter: 'R',
    term: 'Rate of Change of Frequency (RoCoF)',
    definition: 'Quantifies the speed of system frequency variation following a disturbance, expressed in Hz/s.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'TSO',
    definition: 'Transmission System Operator.',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Under-Frequency Load Shedding.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Vacuum filling (Relleno del vacío informativo)'),
    letter: 'V',
    term: 'Vacuum filling',
    definition: 'The structural process by which collective uncertainty generates a demand for answers covered spontaneously by unauthorized sources if official institutions fail.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'Technology enabling bidirectional flow from electric vehicle batteries to the grid.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Wide Area Monitoring System.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inercia (H)'),
    letter: 'I',
    term: 'Inertia (H)',
    definition: 'The inertia constant H is a dimensionless parameter quantifying kinetic energy stored in the rotary masses of a synchronous generator.',
  },
  {
    id: slugify('Potencia reactiva'),
    letter: 'R',
    term: 'Reactive power',
    definition: 'Power component associated with energy storage in electrical and magnetic fields (measured in VAr). Determines the grid voltage profile.',
  },
  {
    id: slugify('Potencia activa'),
    letter: 'A',
    term: 'Active power',
    definition: 'Power component that performs useful work (measured in watts). Determines the frequency balance of the system.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Black Start',
    definition: 'See "Black Start". Capability of certain generation facilities to start up without external grid voltage.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Phenomenon where the mechanical inertia of On-Load Tap Changers (OLTC) introduces a delay of tens of seconds in transformation ratio adjustments, amplifying voltage towards 220 kV collector grids.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Network Code on Requirements for Generators.',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'See "GFL".',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'See "GFM".',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'See "PLL".',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA',
    definition: 'See "SCADA".',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'See "WAMS".',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'See "PMU".',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'See "RoCoF".',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'See "UFLS".',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'See "EAS".',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'See "OLTC".',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'See "SO GL".',
  },
  {
    id: slugify('Capacidad Neta de Transferencia (NTC)'),
    letter: 'N',
    term: 'Net Transfer Capacity (NTC)',
    definition: 'Maximum energy exchange capacity between two control zones agreed upon ex ante between neighboring system operators.',
  },
  {
    id: slugify('Ratio de amortiguamiento'),
    letter: 'D',
    term: 'Damping ratio',
    definition: 'See "Damping ratio".',
  },
  {
    id: slugify('Potencia de cortocircuito'),
    letter: 'S',
    term: 'Short-circuit power',
    definition: 'See "Short-circuit power".',
  },
  {
    id: slugify('Sistema por Unidad (p.u.)'),
    letter: 'P',
    term: 'Per-unit system (p.u.)',
    definition: 'See "Per-unit system".',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs GFM',
    definition: 'See "Grid-forming vs Grid-following control".',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Headroom',
    definition: 'See "Headroom".',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT',
    definition: 'See "Low Voltage Ride Through".',
  }
];

```

### 📄 Archivo: `src\data\glossary_fr.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Association espagnole des entreprises d\'électricité. Elle regroupe les principales entreprises du secteur électrique espagnol. A cofinancé le rapport IIT-ICAI.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve. L\'aFRR (Automatic Frequency Restoration Reserve), historiquement connue sous le nom de réglage secondaire, est un service d\'ajustement du système qui s\'active automatiquement suite à un écart de fréquence. Il est directement contrôlé par l\'AGC (Automatic Generation Control) du Gestionnaire du Réseau et son objectif est de ramener progressivement la fréquence à sa valeur nominale (50 Hz) et de rétablir les flux aux interconnexions à leurs programmes convenus.',
  },
  {
    id: slugify('Área de Control'),
    letter: 'A',
    term: 'Zone de contrôle',
    definition: 'Zone géographique sous la responsabilité d\'un Gestionnaire de Réseau de Transport (GRT).',
  },
  {
    id: slugify('Arranque autónomo (Black Start)'),
    letter: 'A',
    term: 'Démarrage autonome (Black Start)',
    definition: 'La capacité de Black Start (démarrage autonome ou démarrage à froid) est le service d\'ajustement par lequel certaines installations de production peuvent démarrer et commencer à injecter de l\'énergie sur le réseau sans avoir besoin de recevoir une tension électrique externe.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Battery Energy Storage System (Système de stockage d\'énergie par batterie).',
  },
  {
    id: slugify('BESS con inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS avec onduleurs Grid-Forming (BESS-GFM)',
    definition: 'Les Systèmes de Stockage d\'Énergie par Batterie avec Onduleurs Formateurs de Réseau (BESS-GFM) combinent une haute densité électrochimique avec une électronique de puissance capable de fonctionner comme une source de tension idéale et autonome.',
  },
  {
    id: slugify('Bucle de retroalimentación (Feedback loop)'),
    letter: 'B',
    term: 'Boucle de rétroaction (Feedback loop)',
    definition: 'Une boucle de rétroaction positive décrit un mécanisme dans lequel une perturbation initiale provoque une réponse du système qui, au lieu de s\'opposer à l\'écart, l\'amplifie. Dans le contexte de l\'incident, chaque déclenchement de centrale IBR a réduit l\'absorption de puissance réactive, ce qui a fait monter la tension, provoquant à son tour de nouveaux déclenchements : la réponse du système renforçait la perturbation au lieu de l\'atténuer.',
  },
  {
    id: slugify('Cambiadores de Tomas en Carga (OLTC)'),
    letter: 'C',
    term: 'Régleurs en charge (OLTC)',
    definition: 'Un régleur en charge (OLTC, On-Load Tap Changer) est un mécanisme électromécanique installé dans les grands transformateurs de puissance qui ajuste le rapport de transformation — et donc la tension de sortie du secondaire — sans interrompre le flux d\'énergie. Il régule la tension face à des variations lentes de charge, typiquement dans une plage de ±10% par échelons discrets. Son temps de réponse caractéristique, conditionné par l\'inertie mécanique du moteur et des engrenages, est de l\'ordre de plusieurs secondes par échelon.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Combined Cycle Gas Turbine (Turbine à gaz à cycle combiné).',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Centre de Contrôle des Énergies Renouvelables. Le Centre de Contrôle des Énergies Renouvelables (CECRE) est l\'entité opérationnelle de REE responsable de la surveillance et du dispatching en temps réel des parcs renouvelables et des systèmes de stockage, ainsi que de l\'exécution des algorithmes de contrôle de tension via le système VOLTAIRE.',
  },
  {
    id: slugify('Centros de Coordinación Regional (RCC)'),
    letter: 'C',
    term: 'Centres de Coordination Régionaux (RCC)',
    definition: 'Les Centres de Coordination Régionaux (RCC, Regional Coordination Centres) sont des entités supranationales établies par la réglementation européenne pour faciliter la coopération opérationnelle entre les différents Gestionnaires de Réseau de Transport (GRT).',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'C',
    term: 'Effondrement Q-V',
    definition: 'Instabilité de tension dans le plan puissance réactive-tension. Mécanisme dominant du 28A (et non un effondrement de fréquence).',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'C',
    term: 'Compensateurs Synchrones (SynCons)',
    definition: 'Les Compensateurs Synchrones sont des machines tournantes synchrones fonctionnant à vide — sans turbine primaire — qui fournissent une véritable inertie rotative et une capacité d\'injection de courants de défaut de 300 à 400 % de leur valeur nominale.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'C',
    term: 'Compensateur Synchrone Statique (STATCOM)',
    definition: 'Un STATCOM (Static Synchronous Compensator) est un dispositif de compensation active de puissance réactive basé sur l\'électronique de puissance (onduleurs VSC). Contrairement aux réactances ou aux batteries de condensateurs mécaniques à commutation discrète, un STATCOM injecte ou absorbe de la puissance réactive de manière continue, dynamique et presque instantanée.',
  },
  {
    id: slugify('Control Grid-forming frente a Grid-following'),
    letter: 'C',
    term: 'Contrôle Grid-forming contre Grid-following',
    definition: 'Ce concept définit le paradigme de contrôle des onduleurs. Un onduleur grid-following (suiveur de réseau) se synchronise passivement avec la tension et la fréquence préexistantes, dépendant du réseau externe pour fonctionner. À l\'inverse, un onduleur grid-forming (formateur de réseau) agit comme une source de tension idéale derrière une impédance : il établit activement sa propre onde de tension et de fréquence, permettant de soutenir le réseau de manière autonome.',
  },
  {
    id: slugify('Coste Nivelado de la Energía (LCOE)'),
    letter: 'C',
    term: 'Coût actualisé de l\'énergie (LCOE)',
    definition: 'Le coût actualisé de l\'énergie (LCOE) est la mesure économique standard qui compare le coût unitaire de production entre différentes technologies tout au long de leur durée de vie. Sa principale limite systémique est qu\'il ignore la valeur des services auxiliaires fournis au réseau.',
  },
  {
    id: slugify('Crisis communication failure'),
    letter: 'C',
    term: 'Échec de la communication de crise',
    definition: 'En gestion des urgences, un échec de la communication de crise décrit la défaillance institutionnelle à occuper l\'espace informationnel en temps opportun avec des messages vérifiables après un incident grave. Selon le modèle de communication du chaos, si l\'institution responsable n\'émet pas un récit clair pendant la fenêtre critique initiale (1-6 heures), le vide discursif est occupé par des récits alternatifs ou non vérifiés.',
  },
  {
    id: slugify('Criterio N-1'),
    letter: 'C',
    term: 'Critère N-1',
    definition: 'Le critère N-1 est la règle de sécurité fondamentale dans l\'exploitation et la planification des réseaux électriques de puissance. Il établit que le système doit être capable de maintenir les paramètres de tension et de fréquence dans les limites opérationnelles normatives suite à la perte contingente de n\'importe quel élément unique, sans provoquer de coupures d\'alimentation en cascade ni endommager l\'équipement.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'Conseil de Sécurité Nucléaire d\'Espagne. A publié le rapport officiel du gouvernement conjointement avec REE.',
  },
  {
    id: slugify('Curva de capacidad reactiva (Capability Curve)'),
    letter: 'C',
    term: 'Courbe de capacité réactive (Capability Curve)',
    definition: 'Diagramme P-Q qui délimite l\'espace de fonctionnement d\'un générateur dans le plan puissance active-réactive.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Courbe en canard (Duck Curve)',
    definition: 'La courbe en canard décrit le profil quotidien de la demande nette de régulation dans les systèmes à forte pénétration solaire : une dépression profonde pendant les heures centrales de la journée suivie d\'une rampe vespérale prononcée.',
  },
  {
    id: slugify('Curvas de estabilidad de tensión Q-V'),
    letter: 'C',
    term: 'Courbes de stabilité de tension Q-V',
    definition: 'Les courbes Q-V représentent, pour un nœud donné du réseau, la relation entre la puissance réactive injectée ou absorbée et la tension résultante. La distance entre le point de fonctionnement et le point minimum de la courbe (nose point) définit la marge de stabilité de tension : plus cette marge est faible, plus le risque d\'effondrement de tension face à des perturbations supplémentaires est grand.',
  },
  {
    id: slugify('Damping ratio'),
    letter: 'D',
    term: 'Taux d\'amortissement',
    definition: 'Le taux d\'amortissement (ou amortissement relatif) est un indicateur adimensionnel qui quantifie la rapidité avec laquelle une oscillation s\'atténue après une perturbation. Des valeurs proches de 5 % sont considérées comme une marge de sécurité opérationnelle raisonnable dans le système synchrone européen ; des valeurs proches de 0 % indiquent des oscillations soutenues, et des valeurs négatives impliquent une croissance de l\'amplitude et donc un risque d\'instabilité.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Système de Sensibilisation d\'ENTSO-E. Système de surveillance de la stabilité du réseau européen en temps réel.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E Awareness System.',
  },
  {
    id: slugify('Efecto Ferranti'),
    letter: 'E',
    term: 'Effet Ferranti',
    definition: 'L\'effet Ferranti décrit le phénomène par lequel, dans une ligne de transport à haute tension fonctionnant à faible charge ou à vide, la tension à l\'extrémité réceptrice dépasse celle de l\'extrémité émettrice. La cause est l\'admittance capacitive répartie de la ligne : avec un flux de puissance active réduit, la charge capacitive n\'est pas compensée par la consommation inductive des charges, ce qui entraîne une surtension proportionnelle à la longueur de la ligne. C\'est un phénomène particulièrement pertinent lors de la mise sous tension de lignes de 400 kV à vide.',
  },
  {
    id: slugify('Emergent norm theory'),
    letter: 'E',
    term: 'Théorie de la norme émergente',
    definition: 'La théorie des normes émergentes (Turner et Killian) soutient que, contrairement aux visions de panique massive, les groupes en situation de perturbation développent spontanément de nouvelles règles de comportement social adaptatif.',
  },
  {
    id: slugify('Encuadre mediático (Framing) y Agenda-shifting'),
    letter: 'E',
    term: 'Cadrage médiatique (Framing) et Changement d\'agenda (Agenda-shifting)',
    definition: 'Le cadrage est le processus par lequel les médias sélectionnent et mettent en valeur certains éléments d\'un événement pour proposer une interprétation causale spécifique. En lien avec cela, le changement d\'agenda se produit lorsqu\'un événement perturbateur est instrumentalisé par les médias pour déplacer l\'attention et rouvrir des débats politiques ou structurels préexistants.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'Le Réseau européen des gestionnaires de réseau de transport d\'électricité (ENTSO-E) est l\'association qui regroupe 40 opérateurs techniques de réseau (GRT) appartenant à 36 pays européens. Son mandat principal, issu des paquets législatifs successifs de l\'Union européenne, est de garantir la sécurité et la fiabilité de l\'exploitation du système interconnecté européen, de faciliter l\'intégration des énergies renouvelables et d\'établir les codes de réseau communs obligatoires pour tous les États membres.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Essential Reliability Services (Services essentiels de fiabilité).',
  },
  {
    id: slugify('Estabilidad de tensión'),
    letter: 'E',
    term: 'Stabilité de tension',
    definition: 'Capacité du système à maintenir les tensions dans les limites opérationnelles après des perturbations. Nécessite un équilibre entre la demande et l\'apport de puissance réactive.',
  },
  {
    id: slugify('Estabilizadores del Sistema de Potencia (PSS)'),
    letter: 'E',
    term: 'Stabilisateurs de système de puissance (PSS)',
    definition: 'Les PSS (Power System Stabilizers) sont des boucles de contrôle supplémentaires installées dans le système d\'excitation des grands générateurs synchrones qui ajoutent un amortissement électrique aux oscillations électromécaniques du système.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Stratégie Brownfield',
    definition: 'En ingénierie des infrastructures énergétiques, la stratégie Brownfield consiste à reconvertir des installations industrielles existantes — comme les centrales thermiques ou nucléaires fermées — pour les doter de nouvelles fonctions systémiques, comme les transformer en compensateurs synchrones.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Réponse rapide de fréquence (FFR)',
    definition: 'La réponse rapide de fréquence (FFR) est un service de stabilisation sous-cyclique, conçu pour les systèmes d\'électronique de puissance, qui injecte un bloc massif de puissance active dans la fenêtre temporelle critique (typiquement inférieure à 0,25 s) avant l\'action des régulateurs mécaniques traditionnels.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Fast Frequency Response.',
  },
  {
    id: slugify('Frecuencia nominal'),
    letter: 'F',
    term: 'Fréquence nominale',
    definition: '50 Hz dans le système européen continental. Le P.O. 1.1 définit les limites de fonctionnement : f ∈ [49,0; 51,0] Hz en fonctionnement normal.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'GFL',
    definition: 'Grid-Following Inverter (Onduleur suiveur de réseau).',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Grid-Forming Inverter (Onduleur formateur de réseau).',
  },
  {
    id: slugify('Headroom: Reserva de Capacidad del Inversor'),
    letter: 'H',
    term: 'Headroom : Réserve de capacité de l\'onduleur',
    definition: 'Le headroom est la fraction de la capacité apparente maximale qu\'un onduleur GFM doit conserver en réserve sans l\'utiliser pour l\'injection de puissance active en régime permanent, afin de disposer d\'une marge pour répondre aux transitoires rapides.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HVDC',
    definition: 'High Voltage Direct Current (Courant continu haute tension).',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Inverter-Based Resources (Ressources basées sur des onduleurs).',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT (Transistor bipolaire à grille isolée)',
    definition: 'Semi-conducteur de puissance utilisé dans les onduleurs. Le contrôle par grille isolée permet une commutation rapide et efficace.',
  },
  {
    id: slugify('Impedancia de transferencia'),
    letter: 'I',
    term: 'Impédance de transfert',
    definition: 'Dans les systèmes de puissance, l\'impédance de transfert entre deux nœuds représente l\'opposition électrique au flux de puissance entre eux. Une impédance de transfert élevée implique un réseau faiblement couplé, dans lequel de petites variations de la puissance injectée peuvent produire de grandes variations de tension et d\'angle de phase, détériorant la robustesse du système.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodémie',
    definition: 'Terme popularisé par l\'OMS pour décrire la surpopulation de l\'espace informationnel avec des contenus non vérifiés, erronés ou faux qui se propagent rapidement en situation de crise.',
  },
  {
    id: slugify('Inercia Sintética'),
    letter: 'I',
    term: 'Inertie synthétique',
    definition: 'L\'inertie synthétique (ou inertie virtuelle) est un algorithme de contrôle implémenté dans les onduleurs GFM qui émule mathématiquement le comportement de l\'équation d\'oscillation d\'un rotor électromécanique. L\'algorithme mesure en continu la dérivée temporelle de la fréquence (df/dt) et ajuste la puissance injectée de manière proportionnelle.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'LCOE',
    definition: 'Levelized Cost of Energy.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low Voltage Ride Through (LVRT)',
    definition: 'Le Low Voltage Ride Through (LVRT) est la capacité d\'un onduleur à maintenir l\'injection d\'énergie pendant un creux de tension au lieu de se déconnecter par protection.',
  },
  {
    id: slugify('Mallado'),
    letter: 'M',
    term: 'Maillage',
    definition: 'Manœuvre opérationnelle de reconfiguration topologique qui connecte des sous-stations préalablement séparées par des lignes de 400 kV. Lors du 28A, cela a activé l\'effet Ferranti.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Code de réseau sur les exigences applicables aux générateurs (NC RfG)',
    definition: 'Le Network Code on Requirements for Generators est le code de réseau européen établi par ENTSO-E qui harmonise les exigences techniques obligatoires que doivent respecter les installations de production pour se connecter au réseau. Désormais dans sa version 2.0, proposée après l\'effondrement ibérique, il introduit l\'obligation des capacités grid-forming.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'On-Load Tap Changer (Régleur en charge).',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Out-of-Step Tripping (Déclenchement sur perte de synchronisme).',
  },
  {
    id: slugify('Oscilaciones electromecánicas'),
    letter: 'O',
    term: 'Oscillations électromécaniques',
    definition: 'Modes oscillatoires associés à l\'interaction entre les générateurs synchrones. Typiquement de 0,1 à 2 Hz. Lors du 28A, une oscillation de 0,6 Hz a été détectée.',
  },
  {
    id: slugify('Oscilaciones forzadas y naturales'),
    letter: 'O',
    term: 'Oscillations forcées et naturelles',
    definition: 'Une oscillation est forcée lorsqu\'elle est induite par une perturbation externe périodique — typiquement un défaut ou un comportement anormal dans la boucle de contrôle d\'un équipement spécifique —, par opposition aux oscillations naturelles ou modes propres du système, dont la fréquence est déterminée par l\'inertie elle-même et par les constantes électromécaniques des machines synchrones connectées.',
  },
  {
    id: slugify('Outrage communication (Comunicación de indignación)'),
    letter: 'O',
    term: 'Communication de l\'indignation (Outrage communication)',
    definition: 'Basé sur le modèle de Sandman (Risque = Danger + Indignation), ce concept indique que la perception publique d\'un risque dépend plus de facteurs émotionnels (indignation, perception de négligence) que de l\'évaluation technique du danger réel.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phase-Locked Loop (Boucle à verrouillage de phase).',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Phasor Measurement Unit (Unité de mesure de phaseur).',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'Plan National Intégré en matière d\'Énergie et de Climat.',
  },
  {
    id: slugify('Potencia de cortocircuito (Ssc)'),
    letter: 'P',
    term: 'Puissance de court-circuit (Ssc)',
    definition: 'La puissance de court-circuit (Ssc) en un nœud est l\'amplitude instantanée de courant que le système peut injecter en cas de défaut de tension. Elle définit la rigidité électrique du nœud : un Ssc élevé permet aux protections de distance de fonctionner correctement, aux protections à maximum de courant de se coordonner sélectivement et aux onduleurs de maintenir le synchronisme de leurs algorithmes de contrôle.',
  },
  {
    id: slugify('Power System Stabilizers y Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'Stabilisateurs de système de puissance et amortissement des oscillations de puissance (PSS/POD)',
    definition: 'Les stabilisateurs de système de puissance (PSS) et les systèmes d\'amortissement des oscillations de puissance (POD) sont des modules de contrôle supplémentaires installés dans les onduleurs (en particulier en mode GFM) qui injectent des signaux en opposition de phase conçus pour amortir les oscillations électromécaniques de petite et grande perturbation.',
  },
  {
    id: slugify('Procedimiento de Operación 1.6 (P.O. 1.6)'),
    letter: 'P',
    term: 'Procédure d\'exploitation 1.6 (P.O. 1.6)',
    definition: 'La Procédure d\'Exploitation 1.6 est le protocole d\'urgence du système électrique espagnol qui établit les plans de sauvegarde et de rétablissement de l\'alimentation face aux incidents critiques. Elle dicte les stratégies de fragmentation topologique du réseau en îlots électriques indépendants, les itinéraires de réalimentation préférentiels et le protocole de priorisation du démarrage des installations de production pour restaurer le système après un zéro de tension partiel ou total.',
  },
  {
    id: slugify('Procedimiento de Operación 7.4 (P.O. 7.4)'),
    letter: 'P',
    term: 'Procédure d\'exploitation 7.4 (P.O. 7.4)',
    definition: 'Le P.O. 7.4 est la norme technique du système électrique espagnol qui réglemente le service d\'ajustement du contrôle de tension sur le réseau de transport. Il définit les obligations des générateurs d\'absorber ou d\'injecter de la puissance réactive (Q) en fonction des consignes envoyées par le Gestionnaire du Réseau.',
  },
  {
    id: slugify('Programa DS3 de EirGrid'),
    letter: 'P',
    term: 'Programme DS3 d\'EirGrid',
    definition: 'Le programme Delivering a Secure, Sustainable Electricity System (DS3) est le cadre pionnier de services auxiliaires d\'EirGrid (Irlande), conçu pour exploiter le système insulaire avec des pénétrations d\'énergies renouvelables asynchrones allant jusqu\'à 75 %.',
  },
  {
    id: slugify('Protecciones de pérdida de sincronismo (OST)'),
    letter: 'P',
    term: 'Protections de perte de synchronisme (OST)',
    definition: 'Les relais de perte de synchronisme (OST, Out-of-Step Tripping) sont des schémas de protection systémique conçus pour détecter les divergences angulaires sévères entre les zones interconnectées (glissement de pôles). Lorsque la différence de phase angulaire dépasse les limites de stabilité électromécanique, les relais ouvrent automatiquement les lignes d\'interconnexion pour éviter des dommages structurels.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regional Coordination Centre.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Red Eléctrica de España.',
  },
  {
    id: slugify('Régimen de Renovables, Cogeneración y Residuos (RCR)'),
    letter: 'R',
    term: 'Régime des énergies renouvelables, de la cogénération et des déchets (RCR)',
    definition: 'Le Régime des Énergies Renouvelables, de la Cogénération et des Déchets (RCR) est le cadre réglementaire du système électrique espagnol qui regroupe les installations de production d\'énergie électrique à partir de sources décarbonées.',
  },
  {
    id: slugify('Relés de comprobación de sincronismo (Synchro-check)'),
    letter: 'R',
    term: 'Relais de contrôle de synchronisme (Synchro-check)',
    definition: 'Le relais synchro-check (fonction 25 ANSI) est un dispositif de protection utilisé dans les manœuvres de couplage de systèmes électriques séparés (îlots). Sa fonction est de surveiller en permanence que la tension, la fréquence et l\'angle de phase des deux côtés d\'un disjoncteur ouvert se situent dans des marges de tolérance préétablies.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'R',
    term: 'Relais de délestage de charge (UFLS)',
    definition: 'L\'Under-Frequency Load Shedding (UFLS, délestage automatique de charge sur baisse de fréquence) est le mécanisme de dernier recours du système de défense : lorsque la fréquence chute en dessous de seuils prédéfinis, les relais UFLS déconnectent automatiquement des charges pour rétablir l\'équilibre production-demande.',
  },
  {
    id: slugify('Reserva de Restauración de Frecuencia Automática (aFRR)'),
    letter: 'R',
    term: 'Réserve de restauration automatique de la fréquence (aFRR)',
    definition: 'L\'aFRR (Automatic Frequency Restoration Reserve), historiquement connue sous le nom de réglage secondaire, est un service d\'ajustement du système qui s\'active automatiquement suite à un écart de fréquence.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Rate of Change of Frequency (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Supervisory Control and Data Acquisition (Système de contrôle et d\'acquisition de données).',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Short Circuit Ratio.',
  },
  {
    id: slugify('Servicios Esenciales de Confiabilidad (ERS)'),
    letter: 'S',
    term: 'Services Essentiels de Fiabilité (ERS)',
    definition: 'Les Services Essentiels de Fiabilité (ERS) regroupent les attributs physiques indispensables au fonctionnement sûr du réseau, tels que l\'inertie, la puissance de court-circuit, la réponse rapide de fréquence et le contrôle dynamique de tension.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Synchronisme',
    definition: 'Condition de fonctionnement où tous les générateurs tournent à la même fréquence angulaire. Perte de synchronisme = déconnexion en cascade.',
  },
  {
    id: slugify('Sistema en por unidad (p.u.)'),
    letter: 'S',
    term: 'Système par unité (p.u.)',
    definition: 'Le système par unité (p.u.) est une convention de normalisation utilisée en ingénierie électrique de puissance qui exprime les grandeurs du système (tension, courant, puissance, impédance) sous forme de rapports adimensionnels par rapport à des valeurs de base de référence.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'S',
    term: 'Système VOLTAIRE',
    definition: 'Le système VOLTAIRE (intégré au Centre de Contrôle des Énergies Renouvelables, CECRE) est l\'architecture mise en œuvre par REE pour la régulation dynamique de tension dans le système péninsulaire. Il fonctionne selon deux couches hiérarchiques : la Régulation Tertiaire et la Régulation Secondaire.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Directives d\'exploitation du système émises par ENTSO-E. Elles établissent les marges opérationnelles minimales pour la stabilité.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronous Condenser.',
  },
  {
    id: slugify('Tasa de Cambio de Frecuencia (RoCoF)'),
    letter: 'T',
    term: 'Taux de variation de la fréquence (RoCoF)',
    definition: 'Le Rate of Change of Frequency (RoCoF, taux de variation de la fréquence) quantifie la vitesse de variation de la fréquence du système face à une perturbation, généralement exprimée en Hz/s. C\'est le paramètre dynamique le plus critique pour la stabilité transitoire : un RoCoF élevé réduit le temps disponible pour que les systèmes de régulation agissent, accélérant la cascade de déconnexions des protections.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'TSO',
    definition: 'Transmission System Operator (Gestionnaire de réseau de transport).',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Under-Frequency Load Shedding.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Vacuum filling (Relleno del vacío informativo)'),
    letter: 'V',
    term: 'Remplissage du vide (Vacuum filling)',
    definition: 'Le remplissage du vide est le processus structurel et inévitable par lequel l\'incertitude collective face à une catastrophe génère une demande de réponses qui, si elle n\'est pas satisfaite par les institutions officielles, est couverte spontanément par des sources non autorisées.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'La technologie Vehicle-to-Grid (V2G) permet la bidirectionnalité des batteries des véhicules électriques, leur permettant d\'injecter de la puissance active et réactive vers le réseau.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Wide Area Monitoring System.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inercia (H)'),
    letter: 'I',
    term: 'Inertie (H)',
    definition: 'La constante d\'inertie H est un paramètre adimensionnel qui quantifie l\'énergie cinétique stockée dans les masses rotatives d\'un générateur synchrone par rapport à sa puissance nominale. Plus H est grand, plus le changement de fréquence face aux perturbations est lent (RoCoF tolérable plus élevé). Lors du 28A, le système fonctionnait avec H ≈ 2,3 s au niveau péninsulaire, mais avec des valeurs zonales de 1,3 à 1,8 s dans le sud.',
  },
  {
    id: slugify('Potencia reactiva'),
    letter: 'P',
    term: 'Puissance réactive',
    definition: 'Composante de la puissance électrique associée au stockage et à la libération d\'énergie dans les champs électriques et magnétiques (non dissipée sous forme de chaleur). Elle est mesurée en VAr. Le bilan de puissance réactive détermine le profil de tension dans le réseau : un excès de réactif capacitif élève la tension (surtension) ; un déficit la déprime. Lors du 28A, l\'effondrement était principalement dû à un excès de puissance réactive capacitive injectée par les lignes à vide suite au maillage.',
  },
  {
    id: slugify('Potencia activa'),
    letter: 'P',
    term: 'Puissance active',
    definition: 'Composante de la puissance électrique qui effectue un travail utile. Elle se mesure en watts (W). C\'est la puissance effectivement consommée par la charge. Elle est contrôlée par le dispatching de la production et détermine l\'équilibre de fréquence du système.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Black Start',
    definition: 'Voir "Démarrage autonome (Black Start)". Capacité de certaines installations de production à démarrer sans tension de réseau externe pour mener la restauration de l\'alimentation après un effondrement total.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Phénomène par lequel l\'inertie mécanique des régleurs en charge (OLTC) introduit un retard de plusieurs dizaines de secondes dans l\'ajustement du rapport de transformation. Lors du 28A, les OLTC avaient monté les prises pour compenser les chutes de tension précédentes ; lorsque la surtension est arrivée, ils n\'ont pas pu les baisser à temps, amplifiant la tension vers les réseaux collecteurs de 220 kV et générant un "angle mort" d\'observabilité dans le SCADA de REE.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Network Code on Requirements for Generators. Voir "Code de réseau sur les exigences applicables aux générateurs (NC RfG)".',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Mode de fonctionnement des onduleurs dans lequel l\'équipement se synchronise passivement avec la tension et la fréquence du réseau via un algorithme PLL (Phase-Locked Loop). Il nécessite un réseau externe stable et ne peut pas fonctionner de manière autonome. 78 % du parc IBR du 28A fonctionnait en mode grid-following.',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'Mode de fonctionnement des onduleurs dans lequel l\'équipement agit comme une source de tension idéale, établissant activement sa propre onde de tension et de fréquence. Il peut soutenir le réseau de manière autonome et répondre aux perturbations sans avoir besoin d\'une référence externe. C\'est la technologie clé proposée par ENTSO-E dans le NC RfG 2.0 pour les systèmes à forte pénétration renouvelable.',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'Voir "PLL". Algorithme de contrôle électronique qui synchronise la sortie d\'un onduleur avec la tension et la fréquence du réseau. Sa dépendance à l\'égard d\'un réseau stable est la limite structurelle des onduleurs grid-following.',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Voir "SCADA". Système de supervision et de contrôle en temps réel du réseau électrique. Lors du 28A, le SCADA de REE montrait des tensions sur le réseau 400 kV dans les limites réglementaires (418 kV à Grenade) tandis que le phénomène Tap-Lag générait des surtensions réelles de 244 kV au secondaire 220 kV, invisibles pour l\'opérateur.',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'Voir "WAMS". Système de surveillance à grande échelle basé sur des PMU synchronisées par GPS. Permet d\'observer la dynamique du réseau à des échelles géographiques continentales avec une résolution de l\'ordre de la milliseconde.',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Voir "PMU". Unité de mesure de phaseur. Dispositif qui mesure de manière synchronisée la tension et le courant en plusieurs points du réseau avec une résolution temporelle d\'une milliseconde, indispensable à l\'analyse des oscillations inter-zones.',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'Voir "Taux de variation de la fréquence (RoCoF)" et "RoCoF". Paramètre dynamique critique qui quantifie la vitesse de variation de la fréquence (Hz/s) face aux perturbations.',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'Voir "Relais de délestage de charge (UFLS)". Mécanisme automatique de déconnexion de charges lorsque la fréquence chute en dessous de seuils prédéfinis, pour rétablir l\'équilibre production-demande.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Voir "EAS (ENTSO-E Awareness System)". Système de Sensibilisation d\'ENTSO-E pour la surveillance en temps réel du système électrique européen.',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'Voir "Régleurs en charge (OLTC)". Mécanisme électromécanique dans les transformateurs de puissance qui ajuste le rapport de transformation sans interrompre le service, avec un retard mécanique de plusieurs secondes par échelon.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Voir "SO GL (System Operation Guidelines)". Directives d\'exploitation du système d\'ENTSO-E qui définissent cinq niveaux de gravité opérationnelle (Normal, Alerte, Urgence, Blackout, Restauration).',
  },
  {
    id: slugify('Capacidad Neta de Transferencia (NTC)'),
    letter: 'C',
    term: 'Capacité nette de transfert (NTC)',
    definition: 'Net Transfer Capacity (NTC). Capacité maximale d\'échange d\'énergie entre deux zones de contrôle convenue ex ante entre gestionnaires de réseau voisins (REE et RTE dans le cas ibérique). Lors du 28A, la NTC de l\'interconnexion Espagne-France se situait autour de 3 % de la demande péninsulaire, bien en deçà de l\'objectif européen de 15 %.',
  },
  {
    id: slugify('Ratio de amortiguamiento'),
    letter: 'R',
    term: 'Taux d\'amortissement',
    definition: 'Le taux d\'amortissement (ou amortissement relatif) est un indicateur adimensionnel qui quantifie la rapidité avec laquelle une oscillation s\'atténue après une perturbation. Des valeurs proches de 5 % sont considérées comme une marge de sécurité opérationnelle raisonnable dans le système synchrone européen ; des valeurs proches de 0 % indiquent des oscillations soutenues, et des valeurs négatives impliquent une croissance de l\'amplitude et donc un risque d\'instabilité.',
  },
  {
    id: slugify('Potencia de cortocircuito'),
    letter: 'P',
    term: 'Puissance de court-circuit',
    definition: 'La puissance de court-circuit ($S_{sc}$) en un nœud du réseau est une mesure de sa « force » électromagnétique. Elle représente la quantité de courant apparent qui circulerait vers ce nœud en cas de court-circuit franc triphasé. Une forte puissance de court-circuit, typiquement apportée par les grands générateurs synchrones, implique que la tension en ce nœud est très robuste et résiliente, subissant des variations minimes face aux perturbations, connexions brusques de charges ou manœuvres sur le réseau.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Stratégie Brownfield',
    definition: 'En ingénierie des infrastructures énergétiques, la stratégie Brownfield consiste en la reconversion d\'installations industrielles existantes — telles que des centrales thermiques ou nucléaires fermées — pour les doter de nouvelles fonctions systémiques. Dans ce contexte, cela implique de conserver les gros alternateurs d\'origine fonctionnant à vide en tant que compensateurs synchrones, apportant de l\'inertie naturelle et une puissance de court-circuit, et d\'exploiter les sous-stations et les lignes d\'évacuation déjà construites pour réduire considérablement les coûts et les délais de mise en œuvre.',
  },
  {
    id: slugify('Sistema por Unidad (p.u.)'),
    letter: 'S',
    term: 'Système par Unité (p.u.)',
    definition: 'Le système par unité (p.u.) est une convention de normalisation utilisée en ingénierie électrique de puissance qui exprime les grandeurs du système (tension, courant, puissance, impédance) comme des rapports adimensionnels par rapport à des valeurs de base de référence. La base de tension est généralement prise comme la valeur nominale du réseau au nœud d\'analyse, et la base de puissance comme la puissance apparente nominale de l\'équipement ou du système. Le principal avantage est l\'élimination des transformations d\'échelle lors de l\'analyse de réseaux comportant de multiples niveaux de tension interconnectés par des transformateurs. Dans le contexte de l\'analyse des onduleurs, l\'expression des courants de défaut en p.u. permet de comparer directement la capacité d\'injection des onduleurs (1,1-1,2 p.u.) avec celle des générateurs synchrones (5-7 p.u.) indépendamment de la puissance nominale de chaque technologie.',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs GFM (Grid-Following vs Grid-Forming)',
    definition: 'La topologie Grid-Following (GFL) modélise l\'onduleur comme une source de courant contrôlée qui dépend d\'une mesure externe de la tension du réseau (via la boucle à verrouillage de phase, PLL). Son avantage est la simplicité et le faible coût ; sa limitation critique est qu\'il ne peut pas fonctionner de manière autonome ni établir de tension dans des réseaux faibles. La topologie Grid-Forming (GFM) modélise l\'onduleur comme une source de tension idéale derrière une réactance virtuelle, permettant un fonctionnement autonome, une injection de courants de défaut robustes et une inertie synthétique. Le NC RfG 2.0 rend obligatoire la transition vers la technologie GFM pour les nouvelles installations significatives.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Courbe en canard (Duck Curve)',
    definition: 'La courbe en canard décrit le profil quotidien de la demande nette de régulation dans les systèmes à forte pénétration solaire : une dépression profonde pendant les heures centrales de la journée (lorsque la consommation de base est faible mais la production solaire est maximale) suivie d\'une rampe vespérale prononcée. Le printemps est la période de profondeur et de vulnérabilité maximales. Dans le cas du 28A, la profondeur de la vallée a coïncidé avec une rampe d\'injection solaire extraordinairement aiguë, laissant le système avec une capacité minimale d\'absorption de puissance réactive au moment critique.',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Headroom',
    definition: 'Le headroom est la fraction de la capacité apparente maximale ($S_{}$) qu\'un onduleur GFM doit garder en réserve sans l\'utiliser pour l\'injection de puissance active en régime permanent. Cette réserve est nécessaire pour garantir que l\'onduleur dispose d\'une marge suffisante pour agir face à des perturbations rapides de tension ou de fréquence. Exiger du headroom réduit les revenus du marché de l\'énergie, ce qui constitue la friction économique structurelle qui justifie la création de marchés de Services Essentiels de Fiabilité (ERS) pour rémunérer explicitement cette capacité de réponse.',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT (Low Voltage Ride Through)',
    definition: 'Le Low Voltage Ride Through (LVRT) est la capacité d\'un onduleur à maintenir l\'injection d\'énergie pendant un creux de tension au lieu de se déconnecter par protection. Les exigences de LVRT en Espagne sont régulées par le P.O. 12.3 et incluent le paramètre dynamique $k$ (facteur de proportionnalité du courant réactif par rapport à la profondeur du creux). La panne du 28A a montré que dans des réseaux avec un $SCR < 2$, l\'injection massive de réactif selon les profils traditionnels de LVRT peut amplifier l\'instabilité au lieu de la contenir, nécessitant une révision de la coordination entre le contrôle LVRT et la faiblesse du réseau.',
  },
];

```

### 📄 Archivo: `src\data\glossary_it.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Associazione Spagnola delle Imprese di Elettricità. Raggruppa le principali imprese del settore elettrico spagnolo. Ha cofinanziato il rapporto IIT-ICAI.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve. L\'aFRR (automatic Frequency Restoration Reserve), storicamente conosciuta come regolazione secondaria, è un servizio di aggiustamento del sistema che si attiva automaticamente in seguito a una deviazione di frequenza. È controllato direttamente dall\'AGC (Automatic Generation Control) dell\'Operatore di Sistema e il suo obiettivo è riportare progressivamente la frequenza al suo valore nominale (50 Hz) e ripristinare i flussi nelle interconnessioni ai programmi concordati.',
  },
  {
    id: slugify('Área de Control'),
    letter: 'A',
    term: 'Area di Controllo',
    definition: 'Zona geografica sotto la responsabilità di un Operatore di Sistema (OS).',
  },
  {
    id: slugify('Arranque autónomo (Black Start)'),
    letter: 'A',
    term: 'Avvio autonomo (Black Start)',
    definition: 'La capacità di Black Start (avvio autonomo o avvio in nero) è il servizio di aggiustamento mediante il quale alcune strutture di generazione possono avviarsi e iniziare a iniettare energia nella rete senza necessità di ricevere tensione elettrica esterna.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Battery Energy Storage System.',
  },
  {
    id: slugify('BESS con inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS con inverter Grid-Forming (BESS-GFM)',
    definition: 'I Sistemi di Accumulo a Batteria con Inverter Formatori di Rete (BESS-GFM) combinano un\'alta densità elettrochimica con un\'elettronica di potenza in grado di operare come una fonte di tensione ideale e autonoma.',
  },
  {
    id: slugify('Bucle de retroalimentación (Feedback loop)'),
    letter: 'B',
    term: 'Ciclo di retroazione (Feedback loop)',
    definition: 'Un feedback loop positivo, o ciclo di retroazione positiva, descrive un meccanismo in cui una perturbazione iniziale provoca una risposta del sistema che, invece di contrastare la deviazione, la amplifica. Nel contesto dell\'incidente, ogni scatto di un impianto IBR ha ridotto l\'assorbimento di reattiva, sollevando la tensione, il che a sua volta ha provocato nuovi scatti: la risposta del sistema rafforzava la perturbazione invece di smorzarla.',
  },
  {
    id: slugify('Cambiadores de Tomas en Carga (OLTC)'),
    letter: 'C',
    term: 'Commutatori di Prese Sotto Carico (OLTC)',
    definition: 'Un Commutatore di Prese Sotto Carico (OLTC, On-Load Tap Changer) è un meccanismo elettromeccanico installato nei grandi trasformatori di potenza che regola il rapporto di trasformazione —e, di conseguenza, la tensione di uscita del secondario— senza interrompere il flusso di energia. Regola la tensione di fronte a lente variazioni di carico, tipicamente in un intervallo del ±10% con gradini discreti. Il suo tempo di risposta caratteristico, condizionato dall\'inerzia meccanica del motore e degli ingranaggi, è dell\'ordine di diversi secondi per gradino.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Combined Cycle Gas Turbine.',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Centro di Controllo delle Energie Rinnovabili. Il Centro di Controllo delle Energie Rinnovabili (CECRE) è l\'entità operativa di REE responsabile del monitoraggio e del dispacciamento in tempo reale dei parchi rinnovabili e dei sistemi di accumulo, nonché dell\'esecuzione degli algoritmi di controllo della tensione attraverso il sistema VOLTAIRE.',
  },
  {
    id: slugify('Centros de Coordinación Regional (RCC)'),
    letter: 'C',
    term: 'Centri di Coordinamento Regionale (RCC)',
    definition: 'I Centri di Coordinamento Regionale (RCC, Regional Coordination Centres) sono entità sovranazionali stabilite dalla normativa europea per facilitare la cooperazione operativa tra i diversi Gestori di Reti di Trasmissione (TSO).',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'C',
    term: 'Collasso Q-V',
    definition: 'Instabilità di tensione nel piano potenza reattiva-tensione. Meccanismo dominante del 28A (non collasso di frequenza).',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'C',
    term: 'Compensatori Sincroni (SynCons)',
    definition: 'I Compensatori Sincroni sono macchine rotanti sincrone azionate a vuoto —senza turbina primaria— che forniscono un\'inerzia rotazionale genuina e una capacità di iniezione di correnti di guasto del 300–400% del loro valore nominale.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'C',
    term: 'Compensatore Sincrono Statico (STATCOM)',
    definition: 'Uno STATCOM (Static Synchronous Compensator) è un dispositivo di compensazione attiva di potenza reattiva basato sull\'elettronica di potenza (inverter VSC). A differenza delle reattanze o dei banchi di condensatori meccanici a commutazione discreta, uno STATCOM inietta o assorbe potenza reattiva in modo continuo, dinamico e quasi istantaneo.',
  },
  {
    id: slugify('Control Grid-forming frente a Grid-following'),
    letter: 'C',
    term: 'Controllo Grid-forming rispetto a Grid-following',
    definition: 'Questo concetto definisce il paradigma di controllo degli inverter. Un inverter grid-following (inseguitore di rete) si sincronizza passivamente con la tensione e frequenza preesistenti, dipendendo dalla rete esterna per operare. Al contrario, un inverter grid-forming (formatore di rete) agisce come una fonte di tensione ideale dietro a un\'impedenza: stabilisce attivamente la propria onda di tensione e frequenza, permettendo di sostenere la rete in modo autonomo.',
  },
  {
    id: slugify('Coste Nivelado de la Energía (LCOE)'),
    letter: 'C',
    term: 'Costo Livellato dell\'Energia (LCOE)',
    definition: 'Il Costo Livellato dell\'Energia (LCOE) è la metrica economica standard che confronta il costo unitario di produzione tra diverse tecnologie lungo la loro vita utile. La sua principale limitazione sistemica è che ignora il valore dei servizi ancillari forniti alla rete.',
  },
  {
    id: slugify('Crisis communication failure'),
    letter: 'C',
    term: 'Fallimento nella comunicazione di crisi',
    definition: 'Nella gestione delle emergenze, un crisis communication failure descrive il fallimento istituzionale nel non occupare in modo tempestivo lo spazio informativo con messaggi verificabili dopo un incidente grave. Secondo il Chaos Communication Model, se l\'istituzione responsabile non emette un racconto chiaro durante la finestra critica iniziale (1-6 ore), il vuoto discorsivo viene occupato da narrative alternative o non verificate.',
  },
  {
    id: slugify('Criterio N-1'),
    letter: 'C',
    term: 'Criterio N-1',
    definition: 'Il Criterio N-1 è la norma di sicurezza fondamentale nell\'operazione e pianificazione dei sistemi elettrici di potenza. Stabilisce che il sistema deve essere in grado di mantenere i parametri di tensione e frequenza entro i limiti operativi normativi dopo la perdita contingente di qualsiasi elemento singolo, senza provocare interruzioni di fornitura a cascata o danni alle apparecchiature.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'Consiglio di Sicurezza Nazionale della Spagna. Ha pubblicato il rapporto ufficiale del Governo insieme a REE.',
  },
  {
    id: slugify('Curva de capacidad reactiva (Capability Curve)'),
    letter: 'C',
    term: 'Curva di capacità reattiva (Capability Curve)',
    definition: 'Diagramma P-Q che delimita lo spazio operativo di un generatore nel piano potenza attiva-reattiva.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva ad Anatra (Duck Curve)',
    definition: 'La curva ad anatra descrive il profilo giornaliero della domanda netta di regolazione nei sistemi con un\'elevata penetrazione solare: una depressione profonda durante le ore centrali della giornata seguita da una ripida rampa serale.',
  },
  {
    id: slugify('Curvas de estabilidad de tensión Q-V'),
    letter: 'C',
    term: 'Curve di stabilità di tensione Q-V',
    definition: 'Le curve Q-V rappresentano, per un dato nodo della rete, la relazione tra la potenza reattiva iniettata o assorbita e la tensione risultante. La distanza tra il punto di operazione e il punto di minimo della curva (nose point) definisce il margine di stabilità di tensione: minore è questo margine, maggiore sarà il rischio di un collasso di tensione a fronte di ulteriori perturbazioni.',
  },
  {
    id: slugify('Damping ratio'),
    letter: 'D',
    term: 'Rapporto di smorzamento (Damping ratio)',
    definition: 'Il rapporto di smorzamento (o smorzamento relativo) è un indicatore adimensionale che quantifica la rapidità con cui un\'oscillazione si attenua dopo una perturbazione. Valori prossimi al 5% sono considerati un margine di sicurezza operativo ragionevole nel sistema sincrono europeo; valori vicini allo 0% indicano oscillazioni sostenute, e valori negativi implicano una crescita dell\'ampiezza e, quindi, un rischio di instabilità.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'ENTSO-E Awareness System. Sistema di Consapevolezza Situazionale di ENTSO-E che monitora la stabilità della rete europea in tempo reale.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E Awareness System.',
  },
  {
    id: slugify('Efecto Ferranti'),
    letter: 'E',
    term: 'Effetto Ferranti',
    definition: 'L\'Effetto Ferranti descrive il fenomeno per cui, in una linea di trasmissione ad alta tensione operata con poco o nessun carico, la tensione all\'estremità ricevente supera quella dell\'estremità trasmittente. La causa è l\'ammettenza capacitiva distribuita della linea: con un flusso di potenza attiva ridotto, il carico capacitivo non viene compensato dal consumo induttivo dei carichi, e il risultato è una sovratensione proporzionale alla lunghezza della linea. È un fenomeno particolarmente rilevante quando si energizzano linee a 400 kV a vuoto.',
  },
  {
    id: slugify('Emergent norm theory'),
    letter: 'E',
    term: 'Teoria delle norme emergenti',
    definition: 'La teoria delle norme emergenti (Turner e Killian) sostiene che, di fronte alle visioni di panico di massa, i gruppi in situazioni di disturbo sviluppano spontaneamente nuove regole di comportamento sociale adattativo.',
  },
  {
    id: slugify('Encuadre mediático (Framing) y Agenda-shifting'),
    letter: 'E',
    term: 'Inquadramento mediatico (Framing) e Spostamento dell\'agenda (Agenda-shifting)',
    definition: 'Il framing è il processo attraverso il quale i media selezionano ed enfatizzano determinati elementi di un fatto per proporre un\'interpretazione causale concreta. In relazione a ciò, l\'agenda-shifting si verifica quando un evento dirompente viene strumentalizzato dai media per spostare l\'attenzione e riaprire dibattiti politici o strutturali preesistenti.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'La Rete Europea dei Gestori dei Sistemi di Trasmissione dell\'Elettricità (ENTSO-E, acronimo inglese: European Network of Transmission System Operators for Electricity) è l\'associazione che raggruppa 40 operatori tecnici di rete (TSO) appartenenti a 36 paesi europei. Il suo mandato principale, derivante dai successivi pacchetti legislativi dell\'Unione Europea, è garantire la sicurezza e l\'affidabilità del funzionamento del sistema interconnesso europeo, facilitare l\'integrazione delle energie rinnovabili e stabilire i codici di rete comuni (Network Codes) vincolanti per tutti gli Stati membri.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Servizi Essenziali di Affidabilità.',
  },
  {
    id: slugify('Estabilidad de tensión'),
    letter: 'E',
    term: 'Stabilità di tensione',
    definition: 'Capacità del sistema di mantenere le tensioni entro limiti operativi dopo perturbazioni. Richiede equilibrio tra domanda e fornitura di potenza reattiva.',
  },
  {
    id: slugify('Estabilizadores del Sistema de Potencia (PSS)'),
    letter: 'E',
    term: 'Stabilizzatori del Sistema di Potenza (PSS)',
    definition: 'I PSS (Power System Stabilizers) sono anelli di controllo aggiuntivi installati nel sistema di eccitazione dei grandi generatori sincroni che aggiungono smorzamento elettrico alle oscillazioni elettromeccaniche del sistema.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Strategia Brownfield',
    definition: 'Nell\'ingegneria delle infrastrutture energetiche, la strategia Brownfield consiste nella riconversione di impianti industriali esistenti —come centrali termiche o nucleari chiuse— per dotarli di nuove funzioni sistemiche, come trasformarli in compensatori sincroni.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Risposta Rapida in Frequenza (FFR)',
    definition: 'La Risposta Rapida di Frequenza (FFR) è un servizio di stabilizzazione sub-ciclica, progettato per sistemi di elettronica di potenza, che inietta un blocco massiccio di potenza attiva nella finestra temporale critica (tipicamente inferiore a 0,25 s) prima dell\'intervento dei regolatori meccanici tradizionali.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Fast Frequency Response.',
  },
  {
    id: slugify('Frecuencia nominal'),
    letter: 'F',
    term: 'Frequenza nominale',
    definition: '50 Hz nel sistema europeo continentale. Il P.O. 1.1 definisce i limiti di funzionamento: f ∈ [49,0; 51,0] Hz in funzionamento normale.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'GFL',
    definition: 'Inverter Grid-Following.',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Inverter Grid-Forming.',
  },
  {
    id: slugify('Headroom: Reserva de Capacidad del Inversor'),
    letter: 'H',
    term: 'Headroom: Riserva di Capacità dell\'Inverter',
    definition: 'L\'headroom è la frazione della capacità apparente massima che un inverter GFM deve mantenere riservata senza utilizzarla per l\'iniezione di potenza attiva in stato stazionario, al fine di avere margine per rispondere a transitori rapidi.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HVDC',
    definition: 'High Voltage Direct Current (Corrente Continua ad Alta Tensione).',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Risorse Basate su Inverter.',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT (Insulated Gate Bipolar Transistor)',
    definition: 'Semiconduttore di potenza utilizzato negli inverter. Il controllo del gate isolato consente una commutazione rapida ed efficiente.',
  },
  {
    id: slugify('Impedancia de transferencia'),
    letter: 'I',
    term: 'Impedenza di trasferimento',
    definition: 'Nei sistemi di potenza, l\'impedenza di trasferimento tra due nodi rappresenta l\'opposizione elettrica al flusso di potenza tra di essi. Un\'elevata impedenza di trasferimento implica una rete debolmente accoppiata, in cui piccole variazioni di potenza iniettata possono produrre ampie variazioni di tensione e di angolo di fase, compromettendo la stabilità del sistema.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodemia',
    definition: 'Termine reso popolare dall\'OMS per descrivere la sovrappopolazione dello spazio informativo con contenuti non verificati, errati o falsi che si diffondono rapidamente in situazioni di crisi.',
  },
  {
    id: slugify('Inercia Sintética'),
    letter: 'I',
    term: 'Inerzia Sintetica',
    definition: 'L\'inerzia sintetica (o inerzia virtuale) è un algoritmo di controllo implementato negli inverter GFM che emula matematicamente il comportamento dell\'equazione di oscillazione di un rotore elettromeccanico. L\'algoritmo misura continuamente la derivata temporale della frequenza (df/dt) e regola la potenza iniettata in modo proporzionale.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'LCOE',
    definition: 'Levelized Cost of Energy.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low Voltage Ride Through (LVRT)',
    definition: 'Il Low Voltage Ride Through (LVRT) è la capacità di un inverter di mantenere l\'iniezione di energia durante un buco di tensione invece di disconnettersi per protezione.',
  },
  {
    id: slugify('Mallado'),
    letter: 'M',
    term: 'Magliatura',
    definition: 'Manovra operativa di riconfigurazione topologica che collega sottostazioni precedentemente separate mediante linee a 400 kV. Nel 28A ha innescato l\'effetto Ferranti.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Codice di Rete sui Requisiti per i Generatori (NC RfG)',
    definition: 'Il Network Code on Requirements for Generators è il codice di rete europeo stabilito dall\'ENTSO-E che armonizza i requisiti tecnici obbligatori che gli impianti di generazione devono soddisfare per connettersi alla rete. Ora nella sua versione 2.0, proposta dopo il collasso iberico, introduce l\'obbligatorietà delle capacità grid-forming.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'On-Load Tap Changer.',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Out-of-Step Tripping.',
  },
  {
    id: slugify('Oscilaciones electromecánicas'),
    letter: 'O',
    term: 'Oscillazioni elettromeccaniche',
    definition: 'Modi oscillatori associati all\'interazione tra generatori sincroni. Tipicamente 0,1–2 Hz. Nel 28A è stata rilevata un\'oscillazione di 0,6 Hz.',
  },
  {
    id: slugify('Oscilaciones forzadas y naturales'),
    letter: 'O',
    term: 'Oscillazioni forzate e naturali',
    definition: 'Un\'oscillazione è forzata quando è indotta da una perturbazione esterna periodica —tipicamente un guasto o un comportamento anomalo nell\'anello di controllo di una specifica apparecchiatura—, rispetto alle oscillazioni naturali o modi propri del sistema, la cui frequenza è determinata dalla stessa inerzia e dalle costanti elettromeccaniche delle macchine sincrone connesse.',
  },
  {
    id: slugify('Outrage communication (Comunicación de indignación)'),
    letter: 'O',
    term: 'Outrage communication (Comunicazione dell\'indignazione)',
    definition: 'Basato sul modello di Sandman (Rischio = Pericolo + Indignazione), questo concetto indica che la percezione pubblica di un rischio dipende maggiormente da fattori emotivi (indignazione, percezione di negligenza) piuttosto che dalla valutazione tecnica del pericolo reale.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phase-Locked Loop.',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Phasor Measurement Unit.',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'Piano Nazionale Integrato per l\'Energia e il Clima.',
  },
  {
    id: slugify('Potencia de cortocircuito (Ssc)'),
    letter: 'P',
    term: 'Potenza di cortocircuito (Ssc)',
    definition: 'La Potenza di Cortocircuito (Ssc) in un nodo è la grandezza istantanea di corrente che il sistema può iniettare di fronte a una mancanza di tensione. Definisce la rigidità elettrica del nodo: un\'elevata Ssc consente alle protezioni di distanza di operare correttamente, alle protezioni di sovracorrente di coordinarsi selettivamente e agli inverter di mantenere il sincronismo dei loro algoritmi di controllo.',
  },
  {
    id: slugify('Power System Stabilizers y Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'Stabilizzatori dei Sistemi di Potenza e Smorzamento delle Oscillazioni di Potenza (PSS/POD)',
    definition: 'I Power System Stabilizers (PSS) e i sistemi di Power Oscillation Damping (POD) sono moduli di controllo aggiuntivi installati negli inverter (soprattutto in modalità GFM) che iniettano segnali in controfase progettati per smorzare oscillazioni elettromeccaniche di piccola e grande perturbazione.',
  },
  {
    id: slugify('Procedimiento de Operación 1.6 (P.O. 1.6)'),
    letter: 'P',
    term: 'Procedura Operativa 1.6 (P.O. 1.6)',
    definition: 'La Procedura Operativa 1.6 è il protocollo di emergenza del sistema elettrico spagnolo che stabilisce i piani di salvaguardia e di ripristino della fornitura di fronte a incidenti critici. Detta le strategie di frammentazione topologica della rete in isole elettriche indipendenti, i percorsi preferenziali di energizzazione e il protocollo di priorità per l\'avvio degli impianti di generazione al fine di ripristinare il sistema dopo un calo di tensione parziale o totale.',
  },
  {
    id: slugify('Procedimiento de Operación 7.4 (P.O. 7.4)'),
    letter: 'P',
    term: 'Procedura Operativa 7.4 (P.O. 7.4)',
    definition: 'Il P.O. 7.4 è la normativa tecnica del sistema elettrico spagnolo che regola il servizio di regolazione del controllo di tensione nella rete di trasmissione. Definisce gli obblighi dei generatori di assorbire o iniettare potenza reattiva (Q) in funzione delle istruzioni inviate dall\'Operatore di Sistema.',
  },
  {
    id: slugify('Programa DS3 de EirGrid'),
    letter: 'P',
    term: 'Programma DS3 di EirGrid',
    definition: 'Il programma Delivering a Secure, Sustainable Electricity System (DS3) è la cornice pionieristica di servizi ancillari di EirGrid (Irlanda), progettata per operare il sistema insulare con penetrazioni rinnovabili asincrone fino al 75%.',
  },
  {
    id: slugify('Protecciones de pérdida de sincronismo (OST)'),
    letter: 'P',
    term: 'Protezioni per perdita di sincronismo (OST)',
    definition: 'I relè per la perdita di sincronismo (OST, Out-of-Step Tripping) sono schemi di protezione sistemica progettati per rilevare divergenze angolari gravi tra aree interconnesse (scorrimento dei poli). Quando la differenza di fase angolare supera i limiti di stabilità elettromeccanica, i relè aprono automaticamente le linee di interconnessione per evitare danni strutturali.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regional Coordination Centre.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Rete Elettrica della Spagna.',
  },
  {
    id: slugify('Régimen de Renovables, Cogeneración y Residuos (RCR)'),
    letter: 'R',
    term: 'Regime delle Rinnovabili, Cogenerazione e Rifiuti (RCR)',
    definition: 'Il Regime delle Rinnovabili, Cogenerazione e Rifiuti (RCR) è il quadro normativo del sistema elettrico spagnolo che raggruppa gli impianti di produzione di energia elettrica da fonti decarbonizzate.',
  },
  {
    id: slugify('Relés de comprobación de sincronismo (Synchro-check)'),
    letter: 'R',
    term: 'Relè di verifica del sincronismo (Synchro-check)',
    definition: 'Il relè synchro-check (funzione 25 ANSI) è un dispositivo di protezione impiegato nelle manovre di accoppiamento di sistemi elettrici separati (isole). La sua funzione è quella di monitorare continuamente che la tensione, la frequenza e l\'angolo di fase su entrambi i lati di un interruttore aperto rientrino entro margini di tolleranza prestabiliti.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'R',
    term: 'Relè di Distacco del Carico (UFLS)',
    definition: 'L\'Under-Frequency Load Shedding (UFLS, distacco automatico del carico per bassa frequenza) è il meccanismo di ultima istanza del sistema di difesa: quando la frequenza scende al di sotto di soglie predefinite, i relè di UFLS scollegano automaticamente i carichi per ripristinare l\'equilibrio generazione-domanda.',
  },
  {
    id: slugify('Reserva de Restauración de Frecuencia Automática (aFRR)'),
    letter: 'R',
    term: 'Riserva di Ripristino Automatico della Frequenza (aFRR)',
    definition: 'L\'aFRR (automatic Frequency Restoration Reserve), storicamente nota come regolazione secondaria, è un servizio di regolazione del sistema che si attiva automaticamente in seguito a una deviazione della frequenza.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Tasso di Variazione della Frequenza (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Controllo di Supervisione e Acquisizione Dati (SCADA).',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Short Circuit Ratio (Rapporto di Cortocircuito).',
  },
  {
    id: slugify('Servicios Esenciales de Confiabilidad (ERS)'),
    letter: 'S',
    term: 'Servizi Essenziali di Affidabilità (ERS)',
    definition: 'I Servizi Essenziali di Affidabilità (ERS) raggruppano gli attributi fisici indispensabili per l\'operazione sicura della rete, come l\'inerzia, la potenza di cortocircuito, la risposta rapida in frequenza e il controllo dinamico della tensione.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Sincronismo',
    definition: 'Condizione operativa in cui tutti i generatori ruotano alla stessa frequenza angolare. Perdita di sincronismo = disconnessione a cascata.',
  },
  {
    id: slugify('Sistema en por unidad (p.u.)'),
    letter: 'S',
    term: 'Sistema in per unità (p.u.)',
    definition: 'Il sistema in per unità (p.u.) è una convenzione di normalizzazione utilizzata nell\'ingegneria elettrica di potenza che esprime le grandezze del sistema (tensione, corrente, potenza, impedenza) come rapporti adimensionali rispetto a valori base di riferimento.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'S',
    term: 'Sistema VOLTAIRE',
    definition: 'Il sistema VOLTAIRE (integrato nel Centro di Controllo delle Energie Rinnovabili, CECRE) è l\'architettura implementata da REE per la regolazione dinamica della tensione nel sistema peninsulare. Opera su due livelli gerarchici: la Regolazione Terziaria e la Regolazione Secondaria.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Linee guida per le operazioni di sistema emesse da ENTSO-E. Stabiliscono margini operativi minimi per la stabilità.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronous Condenser.',
  },
  {
    id: slugify('Tasa de Cambio de Frecuencia (RoCoF)'),
    letter: 'T',
    term: 'Tasso di Variazione della Frequenza (RoCoF)',
    definition: 'Il Rate of Change of Frequency (RoCoF, tasso di variazione della frequenza) quantifica la velocità di variazione della frequenza del sistema di fronte a una perturbazione, espressa tipicamente in Hz/s. È il parametro dinamico più critico per la stabilità transitoria: un RoCoF elevato riduce il tempo a disposizione affinché i sistemi di regolazione intervengano, accelerando la cascata di disconnessioni delle protezioni.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'TSO',
    definition: 'Transmission System Operator.',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Under-Frequency Load Shedding.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Vacuum filling (Relleno del vacío informativo)'),
    letter: 'V',
    term: 'Vacuum filling (Riempimento del vuoto informativo)',
    definition: 'Il vacuum filling è il processo strutturale e inevitabile attraverso il quale l\'incertezza collettiva di fronte a un disastro genera una domanda di risposte che, se non soddisfatta dalle istituzioni ufficiali, viene coperta spontaneamente da fonti non autorizzate.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'La tecnologia Vehicle-to-Grid (V2G) abilita la bidirezionalità delle batterie dei veicoli elettrici, consentendo loro di iniettare potenza attiva e reattiva verso la rete.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Wide Area Monitoring System.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inercia (H)'),
    letter: 'I',
    term: 'Inerzia (H)',
    definition: 'La costante d\'inerzia H è un parametro adimensionale che quantifica l\'energia cinetica immagazzinata nelle masse rotanti di un generatore sincrono rispetto alla sua potenza nominale. Quanto maggiore è H, tanto più lento è il cambiamento di frequenza in seguito a perturbazioni (maggiore tollerabilità del RoCoF). Nel 28A il sistema operava con H ≈ 2,3 s a livello peninsulare, ma con valori di zona di 1,3-1,8 s nel sud.',
  },
  {
    id: slugify('Potencia reactiva'),
    letter: 'P',
    term: 'Potenza reattiva',
    definition: 'Componente della potenza elettrica associata all\'immagazzinamento e al rilascio di energia in campi elettrici e magnetici (non dissipata sotto forma di calore). Si misura in VAr. Il bilancio della potenza reattiva determina il profilo di tensione nella rete: un eccesso di reattiva capacitiva aumenta la tensione (sovratensione); un deficit la riduce. Nel 28A il collasso è stato dovuto principalmente a un eccesso di reattiva capacitiva iniettata dalle linee a vuoto in seguito alla magliatura.',
  },
  {
    id: slugify('Potencia activa'),
    letter: 'P',
    term: 'Potenza attiva',
    definition: 'Componente della potenza elettrica che svolge un lavoro utile. Si misura in watt (W). È la potenza che il carico consuma effettivamente. Viene controllata attraverso il dispacciamento della generazione e determina l\'equilibrio della frequenza del sistema.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Black Start',
    definition: 'Vedere "Avvio autonomo (Black Start)". Capacità di alcune strutture di generazione di avviarsi senza tensione esterna di rete per guidare il ripristino dell\'alimentazione dopo un collasso totale.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Fenomeno in cui l\'inerzia meccanica dei Commutatori di Prese Sotto Carico (OLTC) introduce un ritardo di decine di secondi nella regolazione del rapporto di trasformazione. Durante il 28A, gli OLTC avevano aumentato le prese per compensare le precedenti cadute di tensione; quando è arrivata la sovratensione, non sono riusciti ad abbassarle in tempo, amplificando la tensione verso le reti collettrici a 220 kV e generando un "punto cieco" di osservabilità nello SCADA di REE.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Network Code on Requirements for Generators. Vedere "Network Code on Requirements for Generators (NC RfG)".',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Modalità di funzionamento degli inverter in cui l\'apparecchiatura si sincronizza passivamente con la tensione e la frequenza di rete mediante un algoritmo PLL (Phase-Locked Loop). Richiede una rete esterna stabile e non può funzionare in modo autonomo. Il 78% del parco IBR del 28A operava in modalità grid-following.',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'Modalità di funzionamento degli inverter in cui l\'apparecchiatura agisce come una fonte di tensione ideale, stabilendo attivamente la propria forma d\'onda di tensione e di frequenza. Può sostenere autonomamente la rete e rispondere alle perturbazioni senza bisogno di un riferimento esterno. È la tecnologia chiave proposta da ENTSO-E nella NC RfG 2.0 per i sistemi ad alta penetrazione di fonti rinnovabili.',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'Vedere "PLL". Algoritmo di controllo elettronico che sincronizza l\'uscita di un inverter con la tensione e la frequenza di rete. La sua dipendenza da una rete stabile è il limite strutturale degli inverter grid-following.',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Vedere "SCADA". Sistema di supervisione e controllo in tempo reale della rete elettrica. Durante il 28A, lo SCADA di REE mostrava tensioni di rete a 400 kV entro i limiti normativi (418 kV a Granada) mentre il fenomeno del Tap-Lag generava sovratensioni reali di 244 kV al secondario a 220 kV, invisibili all\'operatore.',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'Vedere "WAMS". Sistema di monitoraggio di area vasta basato su PMU sincronizzate via GPS. Consente di osservare le dinamiche di rete su scale geografiche continentali con una risoluzione al millisecondo.',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Vedere "PMU". Phasor Measurement Unit. Dispositivo che misura la tensione e la corrente in modo sincrono in più punti della rete con una risoluzione temporale al millisecondo, essenziale per l\'analisi delle oscillazioni inter-area.',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'Vedere "Tasso di Variazione della Frequenza (RoCoF)" e "RoCoF". Parametro dinamico critico che quantifica la velocità di variazione della frequenza (Hz/s) di fronte alle perturbazioni.',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'Vedere "Relè di Distacco del Carico (UFLS)". Meccanismo automatico per scollegare i carichi quando la frequenza scende al di sotto di soglie predefinite, al fine di ripristinare l\'equilibrio generazione-domanda.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Vedere "EAS (ENTSO-E Awareness System)". Sistema di consapevolezza situazionale ENTSO-E per il monitoraggio in tempo reale del sistema elettrico europeo.',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'Vedere "Commutatori di Prese Sotto Carico (OLTC)". Meccanismo elettromeccanico nei trasformatori di potenza che regola il rapporto di trasformazione senza interrompere il servizio, con un ritardo meccanico di diversi secondi per gradino.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Vedere "SO GL (System Operation Guidelines)". Linee guida di ENTSO-E per il funzionamento del sistema che definiscono cinque livelli di gravità operativa (Normale, Allerta, Emergenza, Blackout, Ripristino).',
  },
  {
    id: slugify('Capacidad Neta de Transferencia (NTC)'),
    letter: 'C',
    term: 'Capacità Netta di Trasferimento (NTC)',
    definition: 'Net Transfer Capacity (NTC). Capacità massima di scambio di energia tra due aree di controllo concordata ex ante tra i gestori di sistema vicini (REE e RTE nel caso iberico). Il 28A, la NTC dell\'interconnessione Spagna-Francia era circa il 3% della domanda peninsulare, ben al di sotto dell\'obiettivo europeo del 15%.',
  },
  {
    id: slugify('Ratio de amortiguamiento'),
    letter: 'R',
    term: 'Rapporto di smorzamento',
    definition: 'Il rapporto di smorzamento (o smorzamento relativo) è un indicatore adimensionale che quantifica la rapidità con cui un\'oscillazione si attenua dopo una perturbazione. Valori prossimi al 5 \% sono considerati un margine di sicurezza operativo ragionevole nel sistema sincrono europeo; valori vicini allo 0 \% indicano oscillazioni sostenute, e valori negativi implicano una crescita dell\'ampiezza e, quindi, un rischio di instabilità.',
  },
  {
    id: slugify('Potencia de cortocircuito'),
    letter: 'P',
    term: 'Potenza di cortocircuito',
    definition: 'La potenza di cortocircuito ($S_{sc}$) in un nodo di rete è una misura della sua "forza" elettromagnetica. Rappresenta la quantità di corrente apparente che fluirebbe verso quel nodo nel caso di un cortocircuito franco trifase. Un\'elevata potenza di cortocircuito, tipicamente fornita da grandi generatori sincroni, implica che la tensione in quel nodo è molto robusta e resiliente e subisce variazioni minime a fronte di perturbazioni, collegamenti improvvisi di carichi o manovre di rete.',
  },
  {
    id: slugify('Estrategia Brownfield'),
    letter: 'E',
    term: 'Strategia Brownfield',
    definition: 'Nell\'ingegneria delle infrastrutture energetiche, la strategia Brownfield consiste nella riconversione di impianti industriali esistenti —come centrali termiche o nucleari chiuse— per dotarli di nuove funzioni sistemiche. In questo contesto, implica mantenere i grandi alternatori originali funzionanti a vuoto come compensatori sincroni, fornendo inerzia naturale e potenza di cortocircuito, e sfruttando le sottostazioni e le linee di evacuazione già costruite per ridurre drasticamente i costi e i tempi di implementazione.',
  },
  {
    id: slugify('Sistema por Unidad (p.u.)'),
    letter: 'S',
    term: 'Sistema per Unità (p.u.)',
    definition: 'Il sistema per unità (p.u.) è una convenzione di normalizzazione utilizzata nell\'ingegneria elettrica di potenza che esprime le grandezze del sistema (tensione, corrente, potenza, impedenza) come rapporti adimensionali rispetto a valori di base di riferimento. La base di tensione viene solitamente considerata come il valore nominale della rete nel nodo in analisi e la base di potenza come la potenza apparente nominale dell\'apparecchiatura o del sistema. Il vantaggio principale è l\'eliminazione delle trasformazioni di scala nell\'analisi di reti con più livelli di tensione interconnessi mediante trasformatori. Nel contesto dell\'analisi degli inverter, l\'espressione delle correnti di guasto in p.u. consente di confrontare direttamente la capacità di iniezione degli inverter (1{,}1–1{,}2 p.u.) con quella dei generatori sincroni (5–7 p.u.) indipendentemente dalla potenza nominale di ciascuna tecnologia.',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs GFM (Grid-Following vs Grid-Forming)',
    definition: 'La topologia Grid-Following (GFL) modella l\'inverter come una sorgente di corrente controllata che dipende da una misurazione esterna della tensione di rete (attraverso l\'anello ad aggancio di fase, PLL). Il suo vantaggio è la semplicità e il basso costo; il suo limite critico è che non può operare in modo autonomo o stabilire la tensione in reti deboli. La topologia Grid-Forming (GFM) modella l\'inverter come una fonte di tensione ideale dietro una reattanza virtuale, consentendo il funzionamento autonomo, l\'iniezione di robuste correnti di guasto e l\'inerzia sintetica. L\'NC RfG 2.0 stabilisce la transizione a GFM come obbligatoria per le nuove installazioni significative.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva ad Anatra (Duck Curve)',
    definition: 'La curva ad anatra descrive il profilo giornaliero della domanda netta di regolazione nei sistemi ad alta penetrazione solare: una profonda depressione durante le ore centrali della giornata (quando il consumo di base è basso ma la generazione solare è massima) seguita da una ripida rampa serale. La primavera è il periodo di massima profondità e vulnerabilità. Nel caso del 28A, la profondità della valle coincise con una rampa di iniezione solare straordinariamente ripida, lasciando al sistema una capacità minima di assorbimento della reattiva nell\'istante critico.',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Headroom',
    definition: 'L\'headroom è la frazione della capacità apparente massima ($S_{}$) che un inverter GFM deve tenere in riserva senza utilizzarla per l\'iniezione di potenza attiva allo stato stazionario. Questa riserva è necessaria per garantire che l\'inverter abbia un margine sufficiente per reagire a rapidi disturbi di tensione o di frequenza. La richiesta di headroom riduce i ricavi dal mercato dell\'energia, costituendo l\'attrito economico strutturale che giustifica la creazione di mercati per i Servizi Essenziali di Affidabilità (ERS) per remunerare esplicitamente questa capacità di risposta.',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT (Low Voltage Ride Through)',
    definition: 'Il Low Voltage Ride Through (LVRT) è la capacità di un inverter di mantenere l\'iniezione di potenza durante un buco di tensione invece di disconnettersi per protezione. I requisiti per l\'LVRT in Spagna sono regolati dalla P.O. 12.3 e includono il parametro dinamico $k$ (fattore di proporzionalità della corrente reattiva rispetto alla profondità del buco). Il blackout del 28A ha evidenziato che in reti con $SCR < 2$, la massiccia iniezione di reattiva secondo i profili LVRT tradizionali può amplificare l\'instabilità anziché contenerla, richiedendo una revisione del coordinamento tra controllo LVRT e debolezza della rete.',
  },
];


```

### 📄 Archivo: `src\data\glossary_pt.js`
```js
export const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const GLOSSARY_TERMS = [
  {
    id: slugify('AELEC'),
    letter: 'A',
    term: 'AELEC',
    definition: 'Associação Espanhola de Empresas de Eletricidade. Agrupa as principais empresas do setor elétrico espanhol. Cofinanciou o relatório IIT-ICAI.',
  },
  {
    id: slugify('aFRR'),
    letter: 'A',
    term: 'aFRR',
    definition: 'Automatic Frequency Restoration Reserve. A aFRR (Automatic Frequency Restoration Reserve), historicamente conhecida como regulação secundária, é um serviço de ajuste do sistema que é ativado automaticamente após um desvio de frequência. É controlada diretamente pelo AGC (Automatic Generation Control) do Operador do Sistema e o seu objetivo é devolver progressivamente a frequência ao seu valor nominal (50 Hz) e restituir os fluxos nas interligações aos seus programas pactuados.',
  },
  {
    id: slugify('Área de Controlo'),
    letter: 'A',
    term: 'Área de Controlo',
    definition: 'Zona geográfica sob responsabilidade de um Operador de Sistema (OS).',
  },
  {
    id: slugify('Arranque Autónomo (Black Start)'),
    letter: 'A',
    term: 'Arranque Autónomo (Black Start)',
    definition: 'A capacidade de Black Start (arranque autónomo) é o serviço de ajuste pelo qual certas instalações de geração podem arrancar e começar a injetar energia na rede sem necessidade de receber tensão elétrica externa.',
  },
  {
    id: slugify('BESS'),
    letter: 'B',
    term: 'BESS',
    definition: 'Battery Energy Storage System.',
  },
  {
    id: slugify('BESS com Inversores Grid-Forming (BESS-GFM)'),
    letter: 'B',
    term: 'BESS com Inversores Grid-Forming (BESS-GFM)',
    definition: 'Os Sistemas de Armazenamento em Baterias com Inversores Formadores de Rede (BESS-GFM) combinam alta densidade eletroquímica com eletrónica de potência capaz de operar como uma fonte de tensão ideal e autónoma.',
  },
  {
    id: slugify('Ciclo de Realimentação (Feedback loop)'),
    letter: 'C',
    term: 'Ciclo de Realimentação (Feedback loop)',
    definition: 'Um feedback loop positivo, ou ciclo de realimentação positiva, descreve um mecanismo no qual uma perturbação inicial provoca uma resposta do sistema que, em vez de se opor ao desvio, o amplifica. No contexto do incidente, cada disparo de central IBR reduziu a absorção de reativa, o que elevou a tensão, o que por sua vez provocou novos disparos: a resposta do sistema reforçava a perturbação em vez de a amortecer.',
  },
  {
    id: slugify('Comutadores de Derivação em Carga (OLTC)'),
    letter: 'C',
    term: 'Comutadores de Derivação em Carga (OLTC)',
    definition: 'Um Comutador de Derivação em Carga (OLTC, On-Load Tap Changer) é um mecanismo eletromecânico instalado nos grandes transformadores de potência que ajusta a relação de transformação — e, portanto, a tensão de saída do secundário — sem interromper o fluxo de energia. Regula a tensão perante variações lentas de carga, tipicamente numa gama de ±10% com escalões discretos. O seu tempo característico de resposta, condicionado pela inércia mecânica do motor e das engrenagens, é da ordem de vários segundos por escalão.',
  },
  {
    id: slugify('CCGT'),
    letter: 'C',
    term: 'CCGT',
    definition: 'Combined Cycle Gas Turbine.',
  },
  {
    id: slugify('CECRE'),
    letter: 'C',
    term: 'CECRE',
    definition: 'Centro de Controlo de Energias Renováveis. O Centro de Controlo de Energias Renováveis (CECRE) é a entidade operacional da REE responsável pela monitorização e despacho em tempo real dos parques renováveis e sistemas de armazenamento, bem como pela execução dos algoritmos de controlo de tensão através do sistema VOLTAIRE.',
  },
  {
    id: slugify('Centros de Coordenação Regional (RCC)'),
    letter: 'C',
    term: 'Centros de Coordenação Regional (RCC)',
    definition: 'Os Centros de Coordenação Regional (RCC, Regional Coordination Centres) são entidades supranacionais estabelecidas pela regulamentação europeia para facilitar a cooperação operacional entre os diferentes Gestores de Redes de Transporte (TSO).',
  },
  {
    id: slugify('Colapso Q-V'),
    letter: 'C',
    term: 'Colapso Q-V',
    definition: 'Instabilidade de tensão no plano potência reativa–tensão. Mecanismo dominante do 28A (não colapso de frequência).',
  },
  {
    id: slugify('Compensadores Síncronos (SynCons)'),
    letter: 'C',
    term: 'Compensadores Síncronos (SynCons)',
    definition: 'Os Compensadores Síncronos são máquinas rotativas síncronas operadas em vazio — sem turbina primária — que fornecem inércia rotacional genuína e capacidade de injeção de correntes de defeito de 300–400% do seu valor nominal.',
  },
  {
    id: slugify('Compensador Síncrono Estático (STATCOM)'),
    letter: 'C',
    term: 'Compensador Síncrono Estático (STATCOM)',
    definition: 'Um STATCOM (Static Synchronous Compensator) é um dispositivo de compensação ativa de potência reativa baseado em eletrónica de potência (inversores VSC). Diferente das reatâncias ou dos bancos de condensadores mecânicos de comutação discreta, um STATCOM injeta ou absorve potência reativa de forma contínua, dinâmica e quase instantânea.',
  },
  {
    id: slugify('Controlo Grid-forming vs Grid-following'),
    letter: 'C',
    term: 'Controlo Grid-forming vs Grid-following',
    definition: 'Este conceito define o paradigma de controlo dos inversores. Um inversor grid-following (seguidor de rede) sincroniza-se passivamente com a tensão e frequência preexistentes, dependendo da rede externa para operar. Pelo contrário, um inversor grid-forming (formador de rede) atua como uma fonte de tensão ideal atrás de uma impedância: estabelece ativamente a sua própria onda de tensão e frequência, permitindo sustentar a rede de forma autónoma.',
  },
  {
    id: slugify('Custo Nivelado de Energia (LCOE)'),
    letter: 'C',
    term: 'Custo Nivelado de Energia (LCOE)',
    definition: 'O Custo Nivelado de Energia (LCOE) é a métrica económica padrão que compara o custo unitário de produção entre diferentes tecnologias ao longo da sua vida útil. A sua principal limitação sistémica é que ignora o valor dos serviços de sistema prestados à rede.',
  },
  {
    id: slugify('Falha de Comunicação de Crise (Crisis communication failure)'),
    letter: 'F',
    term: 'Falha de Comunicação de Crise (Crisis communication failure)',
    definition: 'Na gestão de emergências, uma falha de comunicação de crise (crisis communication failure) descreve a falha institucional em não ocupar de forma oportuna o espaço informativo com mensagens verificáveis após um incidente grave. Segundo o Chaos Communication Model, se a instituição responsável não emite uma narrativa clara durante a janela crítica inicial (1-6 horas), o vazio discursivo é ocupado por narrativas alternativas ou não verificadas.',
  },
  {
    id: slugify('Critério N-1'),
    letter: 'C',
    term: 'Critério N-1',
    definition: 'O Critério N-1 é a norma de segurança fundamental na operação e planeamento de sistemas elétricos de potência. Estabelece que o sistema deve ser capaz de manter os parâmetros de tensão e frequência dentro dos limites operacionais normativos após a perda contingente de qualquer elemento único, sem provocar cortes de fornecimento em cascata nem danos nos equipamentos.',
  },
  {
    id: slugify('CSN'),
    letter: 'C',
    term: 'CSN',
    definition: 'Conselho de Segurança Nacional de Espanha. Publicou o relatório oficial do Governo juntamente com a REE.',
  },
  {
    id: slugify('Curva de Capacidade Reativa (Capability Curve)'),
    letter: 'C',
    term: 'Curva de Capacidade Reativa (Capability Curve)',
    definition: 'Diagrama P-Q que delimita o espaço operacional de um gerador no plano potência ativa-reativa.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva de Pato (Duck Curve)',
    definition: 'A curva de pato descreve o perfil diário de procura líquida de regulação em sistemas com alta penetração solar: uma depressão profunda durante as horas centrais do dia seguida de uma rampa vespertina acentuada.',
  },
  {
    id: slugify('Curvas de Estabilidade de Tensão Q-V'),
    letter: 'C',
    term: 'Curvas de Estabilidade de Tensão Q-V',
    definition: 'As curvas Q-V representam, para um dado nó da rede, a relação entre a potência reativa injetada ou absorvida e a tensão resultante. A distância entre o ponto de operação e o ponto mínimo da curva (nose point) define a margem de estabilidade de tensão: quanto menor for essa margem, maior será o risco de um colapso de tensão perante perturbações adicionais.',
  },
  {
    id: slugify('Razão de Amortecimento (Damping ratio)'),
    letter: 'R',
    term: 'Razão de Amortecimento (Damping ratio)',
    definition: 'A razão de amortecimento (ou amortecimento relativo) é um indicador adimensional que quantifica a rapidez com que uma oscilação se atenua após uma perturbação. Valores próximos de 5% são considerados uma margem de segurança operacional razoável no sistema síncrono europeu; valores próximos de 0% indicam oscilações sustentadas, e valores negativos implicam um crescimento da amplitude e, por tanto, um risco de instabilidade.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'ENTSO-E Awareness System. Sistema de Consciência Situacional da ENTSO-E que monitoriza a estabilidade da rede europeia em tempo real.',
  },
  {
    id: slugify('EAS'),
    letter: 'E',
    term: 'EAS',
    definition: 'ENTSO-E Awareness System.',
  },
  {
    id: slugify('Efeito Ferranti'),
    letter: 'E',
    term: 'Efeito Ferranti',
    definition: 'O Efeito Ferranti descreve o fenómeno pelo qual, numa linha de transporte de alta tensão operada com pouca ou nenhuma carga, a tensão na extremidade recetora supera a da extremidade emissora. A causa é a admitância capacitiva distribuída da linha: com fluxo de potência ativa reduzido, a carga capacitiva não é compensada pelo consumo indutivo das cargas, e o resultado é uma sobretensão proporcional ao comprimento da linha. É um fenómeno especialmente relevante ao energizar linhas de 400 kV em vazio.',
  },
  {
    id: slugify('Teoria da Norma Emergente (Emergent norm theory)'),
    letter: 'T',
    term: 'Teoria da Norma Emergente (Emergent norm theory)',
    definition: 'A teoria das normas emergentes (Turner e Killian) sustenta que, em vez das visões de pânico em massa, os grupos em situações de perturbação desenvolvem espontaneamente novas regras de comportamento social adaptativo.',
  },
  {
    id: slugify('Enquadramento Mediático (Framing) e Agenda-shifting'),
    letter: 'E',
    term: 'Enquadramento Mediático (Framing) e Agenda-shifting',
    definition: 'O framing é o processo pelo qual os meios de comunicação selecionam e enfatizam certos elementos de um facto para propor uma interpretação causal concreta. Relacionado com isto, o agenda-shifting ocorre quando um evento disruptivo é instrumentalizado mediaticamente para deslocar a atenção e reabrir debates políticos ou estruturais preexistentes.',
  },
  {
    id: slugify('ENTSO-E'),
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'A Rede Europeia dos Gestores de Redes de Transporte de Eletricidade (ENTSO-E, do inglês: European Network of Transmission System Operators for Electricity) é a associação que agrupa 40 operadores técnicos de rede (TSO) pertencentes a 36 países europeus. O seu mandato principal, derivado dos sucessivos pacotes legislativos da União Europeia, é garantir a segurança e fiabilidade da operação do sistema interligado europeu, facilitar a integração de energias renováveis e estabelecer os códigos de rede comuns (Network Codes) de cumprimento obrigatório para todos os Estados-Membros.',
  },
  {
    id: slugify('ERS'),
    letter: 'E',
    term: 'ERS',
    definition: 'Essential Reliability Services.',
  },
  {
    id: slugify('Estabilidade de Tensão'),
    letter: 'E',
    term: 'Estabilidade de Tensão',
    definition: 'Capacidade do sistema para manter tensões dentro de limites operacionais após perturbações. Requer equilíbrio entre a procura e o fornecimento de potência reativa.',
  },
  {
    id: slugify('Estabilizadores do Sistema de Potência (PSS)'),
    letter: 'E',
    term: 'Estabilizadores do Sistema de Potência (PSS)',
    definition: 'Os PSS (Power System Stabilizers) são malhas de controlo adicionais instaladas no sistema de excitação dos grandes geradores síncronos que adicionam amortecimento elétrico às oscilações eletromecânicas do sistema.',
  },
  {
    id: slugify('Estratégia Brownfield'),
    letter: 'E',
    term: 'Estratégia Brownfield',
    definition: 'Na engenharia de infraestruturas energéticas, a estratégia Brownfield consiste na reconversão de instalações industriais existentes — como as centrais térmicas ou nucleares desativadas — para dotá-las de novas funções sistémicas, como convertê-las em compensadores síncronos.',
  },
  {
    id: slugify('Fast Frequency Response (FFR)'),
    letter: 'F',
    term: 'Fast Frequency Response (FFR)',
    definition: 'A Resposta Rápida de Frequência (FFR) é um serviço de estabilização subcíclica, concebido para sistemas de eletrónica de potência, que injeta um bloco massivo de potência ativa na janela temporal crítica (tipicamente inferior a 0,25 s) prévia à atuação dos reguladores mecânicos tradicionais.',
  },
  {
    id: slugify('FFR'),
    letter: 'F',
    term: 'FFR',
    definition: 'Fast Frequency Response.',
  },
  {
    id: slugify('Frequência Nominal'),
    letter: 'F',
    term: 'Frequência Nominal',
    definition: '50 Hz no sistema europeu continental. O P.O. 1.1 define os limites de operação: f ∈ [49,0; 51,0] Hz em operação normal.',
  },
  {
    id: slugify('GFL'),
    letter: 'G',
    term: 'GFL',
    definition: 'Grid-Following Inverter.',
  },
  {
    id: slugify('GFM'),
    letter: 'G',
    term: 'GFM',
    definition: 'Grid-Forming Inverter.',
  },
  {
    id: slugify('Headroom: Reserva de Capacidade do Inversor'),
    letter: 'H',
    term: 'Headroom: Reserva de Capacidade do Inversor',
    definition: 'O headroom é a fração da capacidade aparente máxima que um inversor GFM deve manter reservada sem a utilizar para a injeção de potência ativa em estado estacionário, com o fim de ter margem para responder a transitórios rápidos.',
  },
  {
    id: slugify('HVDC'),
    letter: 'H',
    term: 'HVDC',
    definition: 'High Voltage Direct Current.',
  },
  {
    id: slugify('IBR'),
    letter: 'I',
    term: 'IBR',
    definition: 'Inverter-Based Resources.',
  },
  {
    id: slugify('IGBT (Insulated Gate Bipolar Transistor)'),
    letter: 'I',
    term: 'IGBT (Insulated Gate Bipolar Transistor)',
    definition: 'Semicondutor de potência utilizado em inversores. O controlo de porta isolada permite a comutação rápida e eficiente.',
  },
  {
    id: slugify('Impedância de Transferência'),
    letter: 'I',
    term: 'Impedância de Transferência',
    definition: 'Em sistemas de potência, a impedância de transferência entre dois nós representa a oposição elétrica ao fluxo de potência entre eles. Uma alta impedância de transferência implica uma rede fracamente acoplada, na qual pequenas variações de potência injetada podem produzir grandes variações de tensão e de ângulo de fase, deteriorando a firmeza do sistema.',
  },
  {
    id: slugify('Infodemia'),
    letter: 'I',
    term: 'Infodemia',
    definition: 'Termo popularizado pela OMS para descrever o superpovoamento do espaço informativo com conteúdos não verificados, errados ou falsos que se propagam rapidamente em situações de crise.',
  },
  {
    id: slugify('Inércia Sintética'),
    letter: 'I',
    term: 'Inércia Sintética',
    definition: 'A inércia sintética (ou inércia virtual) é um algoritmo de controlo implementado em inversores GFM que emula matematicamente o comportamento da equação de oscilação de um rotor eletromecânico. O algoritmo mede continuamente a derivada temporal da frequência (df/dt) e ajusta a potência injetada de forma proporcional.',
  },
  {
    id: slugify('LCOE'),
    letter: 'L',
    term: 'LCOE',
    definition: 'Levelized Cost of Energy.',
  },
  {
    id: slugify('Low Voltage Ride Through (LVRT)'),
    letter: 'L',
    term: 'Low Voltage Ride Through (LVRT)',
    definition: 'O Low Voltage Ride Through (LVRT) é a capacidade de um inversor para manter a injeção de energia durante um cavas de tensão em vez de se desconectar por proteção.',
  },
  {
    id: slugify('Malhagem'),
    letter: 'M',
    term: 'Malhagem',
    definition: 'Manobra operacional de reconfiguração topológica que liga subestações previamente separadas através de linhas de 400 kV. No 28A ativou o Efeito Ferranti.',
  },
  {
    id: slugify('Network Code on Requirements for Generators (NC RfG)'),
    letter: 'N',
    term: 'Network Code on Requirements for Generators (NC RfG)',
    definition: 'O Network Code on Requirements for Generators é o código de rede europeu estabelecido pela ENTSO-E que harmoniza os requisitos técnicos obrigatórios que devem cumprir as instalações de geração para se conectarem à rede. Agora na sua versão 2.0, proposta após o colapso ibérico, introduz a obrigatoriedade de capacidades grid-forming.',
  },
  {
    id: slugify('OLTC'),
    letter: 'O',
    term: 'OLTC',
    definition: 'On-Load Tap Changer.',
  },
  {
    id: slugify('OST'),
    letter: 'O',
    term: 'OST',
    definition: 'Out-of-Step Tripping.',
  },
  {
    id: slugify('Oscilações Eletromecânicas'),
    letter: 'O',
    term: 'Oscilações Eletromecânicas',
    definition: 'Modos oscilatórios associados à interação entre geradores síncronos. Tipicamente 0,1–2 Hz. No 28A detetou-se uma oscilação de 0,6 Hz.',
  },
  {
    id: slugify('Oscilações Forçadas e Naturais'),
    letter: 'O',
    term: 'Oscilações Forçadas e Naturais',
    definition: 'Uma oscilação é forçada quando é induzida por uma perturbação externa periódica — tipicamente uma falha ou um comportamento anómalo na malha de controlo de um equipamento concreto —, por oposição às oscilações naturais ou modos próprios do sistema, cuja frequência é determinada pela própria inércia e pelas constantes eletromecânicas das máquinas síncronas conectadas.',
  },
  {
    id: slugify('Comunicação de Indignação (Outrage communication)'),
    letter: 'C',
    term: 'Comunicação de Indignação (Outrage communication)',
    definition: 'Baseado no modelo de Sandman (Risk = Hazard + Outrage), este conceito indica que a perceção pública de um risco depende mais de fatores emocionais (indignação, perceção de negligência) do que da avaliação técnica do perigo real.',
  },
  {
    id: slugify('PLL'),
    letter: 'P',
    term: 'PLL',
    definition: 'Phase-Locked Loop.',
  },
  {
    id: slugify('PMU'),
    letter: 'P',
    term: 'PMU',
    definition: 'Phasor Measurement Unit.',
  },
  {
    id: slugify('PNIEC'),
    letter: 'P',
    term: 'PNIEC',
    definition: 'Plano Nacional Integrado de Energia e Clima.',
  },
  {
    id: slugify('Potência de Curto-Circuito (Ssc)'),
    letter: 'P',
    term: 'Potência de Curto-Circuito (Ssc)',
    definition: 'A Potência de Curto-Circuito (Ssc) num nó é a magnitude instantânea de corrente que o sistema pode injetar perante uma falta de tensão. Define a rigidez elétrica do nó: um Ssc elevado permite que as proteções de distância operem corretamente, que as proteções de sobrecorrente se coordenem seletivamente e que os inversores mantenham o sincronismo dos seus algoritmos de controlo.',
  },
  {
    id: slugify('Power System Stabilizers e Power Oscillation Damping (PSS/POD)'),
    letter: 'P',
    term: 'Power System Stabilizers e Power Oscillation Damping (PSS/POD)',
    definition: 'Os Power System Stabilizers (PSS) e os sistemas de Power Oscillation Damping (POD) são módulos de controlo adicionais instalados em inversores (especialmente no modo GFM) que injetam sinais em contrafase concebidos para amortecer oscilações eletromecânicas de pequena e grande perturbação.',
  },
  {
    id: slugify('Procedimento de Operação 1.6 (P.O. 1.6)'),
    letter: 'P',
    term: 'Procedimento de Operação 1.6 (P.O. 1.6)',
    definition: 'O Procedimento de Operação 1.6 é o protocolo de emergência do sistema elétrico espanhol que estabelece os planos de salvaguarda e reposição de fornecimento perante incidentes críticos. Dita as estratégias de fragmentação topológica da rede em ilhas elétricas independentes, as rotas de energização preferenciais e o protocolo de priorização de arranque das instalações de geração para restaurar o sistema após um zero de tensão parcial ou total.',
  },
  {
    id: slugify('Procedimento de Operação 7.4 (P.O. 7.4)'),
    letter: 'P',
    term: 'Procedimento de Operação 7.4 (P.O. 7.4)',
    definition: 'O P.O. 7.4 é a regulamentação técnica do sistema elétrico espanhol que regula o serviço de ajuste de controlo de tensão na rede de transporte. Define as obrigações dos geradores para absorver ou injetar potência reativa (Q) em função das ordens enviadas pelo Operador do Sistema.',
  },
  {
    id: slugify('Programa DS3 da EirGrid'),
    letter: 'P',
    term: 'Programa DS3 da EirGrid',
    definition: 'O programa Delivering a Secure, Sustainable Electricity System (DS3) é o quadro pioneiro de serviços de sistema da EirGrid (Irlanda), concebido para operar o sistema insular com penetrações renováveis assíncronas de até 75%.',
  },
  {
    id: slugify('Proteções de Perda de Sincronismo (OST)'),
    letter: 'P',
    term: 'Proteções de Perda de Sincronismo (OST)',
    definition: 'Os relés de perda de sincronismo (OST, Out-of-Step Tripping) são esquemas de proteção sistémica concebidos para detetar divergências angulares severas entre áreas interligadas (deslizamento de polos). Quando a diferença de fase angular excede os limites de estabilidade eletromecânica, os relés abrem automaticamente as linhas de interligação para evitar danos estruturais.',
  },
  {
    id: slugify('RCC'),
    letter: 'R',
    term: 'RCC',
    definition: 'Regional Coordination Centre.',
  },
  {
    id: slugify('REE'),
    letter: 'R',
    term: 'REE',
    definition: 'Red Eléctrica de España.',
  },
  {
    id: slugify('Regime de Renováveis, Cogeração e Resíduos (RCR)'),
    letter: 'R',
    term: 'Regime de Renováveis, Cogeração e Resíduos (RCR)',
    definition: 'O Regime de Renováveis, Cogeração e Resíduos (RCR) é o quadro regulatório do sistema elétrico espanhol que agrupa as instalações de produção de energia elétrica a partir de fontes descarbonizadas.',
  },
  {
    id: slugify('Relés de Verificação de Sincronismo (Synchro-check)'),
    letter: 'R',
    term: 'Relés de Verificação de Sincronismo (Synchro-check)',
    definition: 'O relé synchro-check (função 25 ANSI) é um dispositivo de proteção empregue nas manobras de acoplamento de sistemas elétricos separados (ilhas). A sua função é supervisionar continuamente se a tensão, a frequência e o ângulo de fase de ambos os lados de um disjuntor aberto se encontram dentro de margens de tolerância preestabelecidas.',
  },
  {
    id: slugify('Relés de Deslastre de Carga (UFLS)'),
    letter: 'R',
    term: 'Relés de Deslastre de Carga (UFLS)',
    definition: 'O Under-Frequency Load Shedding (UFLS, deslastre automático de carga por baixa frequência) é o mecanismo de último recurso do sistema de defesa: quando a frequência cai abaixo de limiares predefinidos, os relés de UFLS desconectam cargas de forma automática para restaurar o equilíbrio geração-procura.',
  },
  {
    id: slugify('Reserva de Restauração de Frequência Automática (aFRR)'),
    letter: 'R',
    term: 'Reserva de Restauração de Frequência Automática (aFRR)',
    definition: 'A aFRR (Automatic Frequency Restoration Reserve), historicamente conhecida como regulação secundária, é um serviço de ajuste do sistema que se ativa automaticamente após um desvio de frequência.',
  },
  {
    id: slugify('RoCoF'),
    letter: 'R',
    term: 'RoCoF',
    definition: 'Rate of Change of Frequency (df/dt).',
  },
  {
    id: slugify('SCADA'),
    letter: 'S',
    term: 'SCADA',
    definition: 'Supervisory Control and Data Acquisition.',
  },
  {
    id: slugify('SCR'),
    letter: 'S',
    term: 'SCR',
    definition: 'Short Circuit Ratio.',
  },
  {
    id: slugify('Serviços Essenciais de Fiabilidade (ERS)'),
    letter: 'S',
    term: 'Serviços Essenciais de Fiabilidade (ERS)',
    definition: 'Os Serviços Essenciais de Fiabilidade (ERS) agrupam os atributos físicos indispensáveis para a operação segura da rede, tais como a inércia, a potência de curto-circuito, a resposta rápida de frequência e o controlo dinâmico de tensão.',
  },
  {
    id: slugify('Sincronismo'),
    letter: 'S',
    term: 'Sincronismo',
    definition: 'Condição de operação onde todos os geradores rodam com a mesma frequência angular. Perda de sincronismo = desconexão em cascata.',
  },
  {
    id: slugify('Sistema por Unidade (p.u.)'),
    letter: 'S',
    term: 'Sistema por Unidade (p.u.)',
    definition: 'O sistema por unidade (p.u.) é uma convenção de normalização utilizada em engenharia elétrica de potência que expressa as grandezas do sistema (tensão, corrente, potência, impedância) como quocientes adimensionais relativamente a valores base de referência.',
  },
  {
    id: slugify('Sistema VOLTAIRE'),
    letter: 'S',
    term: 'Sistema VOLTAIRE',
    definition: 'O sistema VOLTAIRE (integrado no Centro de Controlo de Energias Renováveis, CECRE) é a arquitetura implementada pela REE para a regulação dinâmica de tensão no sistema peninsular. Opera em duas camadas hierárquicas: a Regulação Terciária e a Regulação Secundária.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Diretrizes de Operação do Sistema emitidas pela ENTSO-E. Estabelecem margens operacionais mínimas para a estabilidade.',
  },
  {
    id: slugify('SynCon'),
    letter: 'S',
    term: 'SynCon',
    definition: 'Synchronous Condenser.',
  },
  {
    id: slugify('Taxa de Variação de Frequência (RoCoF)'),
    letter: 'T',
    term: 'Taxa de Variação de Frequência (RoCoF)',
    definition: 'A Rate of Change of Frequency (RoCoF, taxa de variação de frequência) quantifica a velocidade de variação da frequência do sistema perante uma perturbação, expressa tipicamente em Hz/s. É o parâmetro dinâmico mais crítico para a estabilidade transitória: um RoCoF elevado reduz o tempo disponível para que os sistemas de regulação atuem, acelerando a cascata de desconexões de proteções.',
  },
  {
    id: slugify('TSO'),
    letter: 'T',
    term: 'TSO',
    definition: 'Transmission System Operator.',
  },
  {
    id: slugify('UFLS'),
    letter: 'U',
    term: 'UFLS',
    definition: 'Under-Frequency Load Shedding.',
  },
  {
    id: slugify('V2G'),
    letter: 'V',
    term: 'V2G',
    definition: 'Vehicle-to-Grid.',
  },
  {
    id: slugify('Preenchimento do Vazio Informativo (Vacuum filling)'),
    letter: 'P',
    term: 'Preenchimento do Vazio Informativo (Vacuum filling)',
    definition: 'O vacuum filling é o processo estrutural e inevitável através do qual a incerteza coletiva perante um desastre gera uma procura de respostas que, se não for satisfeita pelas instituições oficiais, é coberta espontaneamente por fontes não autorizadas.',
  },
  {
    id: slugify('Vehicle-to-Grid (V2G)'),
    letter: 'V',
    term: 'Vehicle-to-Grid (V2G)',
    definition: 'A tecnologia Vehicle-to-Grid (V2G) habilita a bidirecionalidade das baterias dos veículos elétricos, permitindo-lhes injetar potência ativa e reativa para a rede.',
  },
  {
    id: slugify('WAMS'),
    letter: 'W',
    term: 'WAMS',
    definition: 'Wide Area Monitoring System.',
  },
  // ---- Aliases y variantes usadas en los MDX ----
  {
    id: slugify('Inércia (H)'),
    letter: 'I',
    term: 'Inércia (H)',
    definition: 'A constante de inércia H é um parâmetro adimensional que quantifica a energia cinética armazenada nas massas rotatórias de um gerador síncrono em relação à sua potência nominal. Quanto maior é H, mais lenta é a alteração de frequência perante perturbações (maior RoCoF tolerável). No 28A o sistema operava com H ≈ 2,3 s a nível peninsular, mas com valores zonais de 1,3–1,8 s no sul.',
  },
  {
    id: slugify('Potência Reativa'),
    letter: 'P',
    term: 'Potência Reativa',
    definition: 'Componente da potência elétrica associada ao armazenamento e libertação de energia em campos elétricos e magnéticos (não dissipada como calor). Mede-se em VAr. O balanço de potência reativa determina o perfil de tensão na rede: um excesso de reativa capacitiva eleva a tensão (sobretensão); um défice deprime-a. No 28A o colapso deveu-se fundamentalmente a um excesso de reativa capacitiva injetada pelas linhas em vazio após a malhagem.',
  },
  {
    id: slugify('Potência Ativa'),
    letter: 'P',
    term: 'Potência Ativa',
    definition: 'Componente da potência elétrica que realiza trabalho útil. Mede-se em watts (W). É a potência que efetivamente consome a carga. É controlada mediante o despacho de geração e determina o equilíbrio de frequência do sistema.',
  },
  {
    id: slugify('Black Start'),
    letter: 'B',
    term: 'Black Start',
    definition: 'Ver "Arranque Autónomo (Black Start)". Capacidade de certas instalações de geração arrancarem sem tensão externa da rede para liderar a reposição de fornecimento após um colapso total.',
  },
  {
    id: slugify('Tap-Lag'),
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Fenómeno através do qual a inércia mecânica dos Comutadores de Derivação em Carga (OLTC) introduz um atraso de dezenas de segundos no ajuste da relação de transformação. Durante o 28A, os OLTCs tinham subido de tomadas para compensar quebras de tensão prévias; quando chegou a sobretensão, não conseguiram descê-las a tempo, amplificando a tensão para as redes coletoras de 220 kV e gerando um "ponto cego" de observabilidade no SCADA da REE.',
  },
  {
    id: slugify('NC RfG'),
    letter: 'N',
    term: 'NC RfG',
    definition: 'Network Code on Requirements for Generators. Ver "Network Code on Requirements for Generators (NC RfG)".',
  },
  {
    id: slugify('GFL (Grid-Following)'),
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Modo de operação de inversores em que o equipamento se sincroniza passivamente com a tensão e frequência da rede através de um algoritmo PLL (Phase-Locked Loop). Requer uma rede externa estável e não pode operar de forma autónoma. Os 78% do parque IBR do 28A operava em modo grid-following.',
  },
  {
    id: slugify('GFM (Grid-Forming)'),
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'Modo de operação de inversores em que o equipamento atua como uma fonte de tensão ideal, estabelecendo ativamente a sua própria onda de tensão e frequência. Pode sustentar a rede de forma autónoma e responder a perturbações sem necessidade de uma referência externa. É a tecnologia-chave proposta pela ENTSO-E no NC RfG 2.0 para sistemas com alta penetração renovável.',
  },
  {
    id: slugify('Phase-Locked Loop (PLL)'),
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'Ver "PLL". Algoritmo de controlo eletrónico que sincroniza a saída de um inversor com a tensão e frequência da rede. A sua dependência de uma rede estável é a limitação estrutural dos inversores grid-following.',
  },
  {
    id: slugify('SCADA (Supervisory Control and Data Acquisition)'),
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Ver "SCADA". Sistema de supervisão e controlo em tempo real da rede elétrica. Durante o 28A, o SCADA da REE mostrava tensões na rede de 400 kV dentro dos limites normativos (418 kV em Granada) enquanto o fenómeno Tap-Lag gerava sobretensões reais de 244 kV no secundário de 220 kV, invisível para o operador.',
  },
  {
    id: slugify('WAMS (Wide Area Monitoring Systems)'),
    letter: 'W',
    term: 'WAMS (Wide Area Monitoring Systems)',
    definition: 'Ver "WAMS". Sistema de monitorização de área extensa baseado em PMUs sincronizadas por GPS. Permite observar a dinâmica da rede a escalas geográficas continentais com resolução de milissegundos.',
  },
  {
    id: slugify('PMU (Phasor Measurement Unit)'),
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Ver "PMU". Unidade de Medição Fasorial. Dispositivo que mede de forma sincronizada tensão e corrente em múltiplos pontos da rede com resolução temporal de milissegundos, essencial para a análise de oscilações inter-área.',
  },
  {
    id: slugify('RoCoF (Rate of Change of Frequency)'),
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'Ver "Taxa de Variação de Frequência (RoCoF)" e "RoCoF". Parâmetro dinâmico crítico que quantifica a velocidade de variação da frequência (Hz/s) perante perturbações.',
  },
  {
    id: slugify('UFLS (Underfrequency Load Shedding)'),
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'Ver "Relés de Deslastre de Carga (UFLS)". Mecanismo automático de desconexão de cargas quando a frequência cai abaixo de limiares predefinidos, para restaurar o equilíbrio geração-procura.',
  },
  {
    id: slugify('EAS (ENTSO-E Awareness System)'),
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Ver "EAS (ENTSO-E Awareness System)". Sistema de Consciência Situacional da ENTSO-E para monitorização em tempo real do sistema elétrico europeu.',
  },
  {
    id: slugify('OLTC (On-Load Tap Changer)'),
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'Ver "Comutadores de Derivação em Carga (OLTC)". Mecanismo eletromecânico em transformadores de potência que ajusta a relação de transformação sem interromper o serviço, com um atraso mecânico de vários segundos por escalão.',
  },
  {
    id: slugify('SO GL (System Operation Guidelines)'),
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Ver "SO GL (System Operation Guidelines)". Diretrizes de Operação do Sistema da ENTSO-E que definem cinco níveis de severidade operacional (Normal, Alerta, Emergência, Blackout, Restauração).',
  },
  {
    id: slugify('Capacidade Líquida de Transferência (NTC)'),
    letter: 'C',
    term: 'Capacidade Líquida de Transferência (NTC)',
    definition: 'Net Transfer Capacity (NTC). Capacidade máxima de troca de energia entre duas zonas de controlo pactuada ex ante entre operadores de sistema vizinhos (REE e RTE no caso ibérico). No 28A, o NTC da interligação Espanha-França estava em torno de 3% da procura peninsular, muito abaixo da meta europeia de 15%.',
  },
  {
    id: slugify('Razão de Amortecimento'),
    letter: 'R',
    term: 'Razão de Amortecimento',
    definition: 'A razão de amortecimento (ou amortecimento relativo) é um indicador adimensional que quantifica a rapidez com que uma oscilação se atenua após uma perturbação. Valores próximos de 5 \\% são considerados uma margem de segurança operacional razoável no sistema síncrono europeu; valores próximos de 0 \\% indicam oscilações sustentadas, e valores negativos implicam um crescimento da amplitude e, portanto, um risco de instabilidade.',
  },
  {
    id: slugify('Potência de Curto-Circuito'),
    letter: 'P',
    term: 'Potência de Curto-Circuito',
    definition: 'A potência de curto-circuito ($S_{sc}$) num nó da rede é uma medida da sua "firmeza" eletromagnética. Representa a quantidade de corrente aparente que fluiria para esse nó no caso de ocorrer um curto-circuito franco trifásico. Uma elevada potência de curto-circuito, tipicamente fornecida pelos grandes geradores síncronos, implica que a tensão nesse nó é muito robusta e resiliente, sofrendo variações mínimas perante perturbações, conexões de cargas bruscas ou manobras na rede.',
  },
  {
    id: slugify('Estratégia Brownfield'),
    letter: 'E',
    term: 'Estratégia Brownfield',
    definition: 'Na engenharia de infraestruturas energéticas, a estratégia Brownfield consiste na reconversão de instalações industriais existentes — como as centrais térmicas ou nucleares desativadas — para dotá-las de novas funções sistémicas. Neste contexto, implica conservar os grandes alternadores originais operando em vazio como compensadores síncronos, fornecendo inércia natural e potência de curto-circuito, e aproveitando as subestações e linhas de evacuação já construídas para reduzir drasticamente custos e tempos de implementação.',
  },
  {
    id: slugify('Sistema por Unidade (p.u.)'),
    letter: 'S',
    term: 'Sistema por Unidade (p.u.)',
    definition: 'O sistema por unidade (p.u.) é uma convenção de normalização utilizada em engenharia elétrica de potência que expressa as grandezas do sistema (tensão, corrente, potência, impedância) como quocientes adimensionais relativamente a valores base de referência. A base de tensão é normalmente o valor nominal da rede no nó de análise, e a base de potência é a potência aparente nominal do equipamento ou do sistema. A vantagem principal é a eliminação das transformações de escala ao analisar redes com múltiplos níveis de tensão interligados através de transformadores. No contexto da análise de inversores, a expressão das correntes de defeito em p.u. permite comparar diretamente a capacidade de injeção dos inversores (1{,}1–1{,}2 p.u.) com a dos geradores síncronos (5–7 p.u.) independentemente da potência nominal de cada tecnologia.',
  },
  {
    id: slugify('GFL vs GFM (Grid-Following vs Grid-Forming)'),
    letter: 'G',
    term: 'GFL vs GFM (Grid-Following vs Grid-Forming)',
    definition: 'A topologia Grid-Following (GFL) modela o inversor como uma fonte de corrente controlada que depende de uma medição externa da tensão da rede (através da malha de seguimento de fase, PLL). A sua vantagem é a simplicidade e o baixo custo; a sua limitação crítica é que não pode operar de forma autónoma nem estabelecer tensão em redes fracas. A topologia Grid-Forming (GFM) modela o inversor como uma fonte de tensão ideal atrás de uma reatância virtual, permitindo operação autónoma, injeção de correntes de defeito robustas e inércia sintética. O NC RfG 2.0 estabelece a transição para GFM como obrigatória para novas instalações significativas.',
  },
  {
    id: slugify('Curva de Pato (Duck Curve)'),
    letter: 'C',
    term: 'Curva de Pato (Duck Curve)',
    definition: 'A curva de pato descreve o perfil diário de procura líquida de regulação em sistemas com alta penetração solar: uma depressão profunda durante as horas centrais do dia (quando o consumo base é baixo mas a geração solar é máxima) seguida de uma rampa vespertina acentuada. A primavera é o período de máxima profundidade e vulnerabilidade. No caso do 28A, a profundidade do vale coincidiu com uma rampa de injeção solar extraordinariamente aguda, deixando o sistema com mínima capacidade de absorção de reativa no instante crítico.',
  },
  {
    id: slugify('Headroom'),
    letter: 'H',
    term: 'Headroom',
    definition: 'O headroom é a fração da capacidade aparente máxima ($S_{}$) que um inversor GFM deve manter reservada sem a utilizar para a injeção de potência ativa em estado estacionário. Esta reserva é necessária para garantir que o inversor dispõe de margem suficiente para atuar perante perturbações rápidas de tensão ou frequência. Exigir headroom reduz os rendimentos do mercado de energia, o que constitui a fricção económica estrutural que justifica a criação de mercados de Serviços Essenciais de Fiabilidade (ERS) para remunerar explicitamente esta capacidade de resposta.',
  },
  {
    id: slugify('LVRT (Low Voltage Ride Through)'),
    letter: 'L',
    term: 'LVRT (Low Voltage Ride Through)',
    definition: 'O Low Voltage Ride Through (LVRT) é a capacidade de um inversor para manter a injeção de energia durante um cavas de tensão em vez de se desconectar por proteção. Os requisitos do LVRT em Espanha são regulados pelo P.O. 12.3 e incluem o parâmetro dinâmico $k$ (fator de proporcionalidade da corrente reativa em relação à profundidade do cavas). O apagão do 28A evidenciou que em redes com $SCR < 2$, a injeção massiva de reativa segundo os perfis tradicionais de LVRT pode amplificar a instabilidade em vez de a conter, exigindo revisão da coordenação entre o controlo LVRT e a fraqueza da rede.',
  },
];

```

### 📄 Archivo: `src\data\imageGalleryData.js` (Truncado por tamaño)
```js
export const imageGalleryData = {
  chapters: [
    {
      id: "ch1",
      title_es: "Capítulo 1: Introducción a un Nuevo Paradigma de Fallo Sistémico",
      title_en: "Chapter 1: Introduction to a New Paradigm of Systemic Failure",
      title_pt: "Capítulo 1: Introdução a um Novo Paradigma de Falha Sistêmica",
      title_fr: "Chapitre 1 : Introduction à un Nouveau Paradigme de Défaillance Systémique",
      title_it: "Capitolo 1: Introduzione a un Nuovo Paradigma di Guasto Sistemico",
      title_de: "Kapitel 1: Einführung in ein Neues Paradigma Systemischen Versagens",
      images: [
        {
          src: "/figuras/albustami_ieee39_secuencia.png",
          caption_es: "Secuencia del colapso del 28-A mostrando la interacción entre Acciones del Operador (OA) y Acciones Automáticas de protección (AA). Fuente: Albustami et al., 2025.",
          caption_en: "Sequence of the April 28 collapse showing the interaction between Operator Actions (OA) and Automatic protective actions (AA). Source: Albustami et al., 2025.",
          caption_pt: "Sequência do colapso de 28-A mostrando a interação entre Ações do Operador (OA) e Ações Automáticas de proteção (AA). Fonte: Albustami et al., 2025.",
          caption_fr: "Séquence de l'effondrement du 28-A montrant l'interaction entre les Actions de l'Opérateur (OA) et les Actions Automatiques de protection (AA). Source : Albustami et al., 2025.",
          caption_it: "Sequenza del collasso del 28-A che mostra l'interazione tra Azioni dell'Operatore (OA) e Azioni Automatiche di protezione (AA). Fonte: Albustami et al., 2025.",
          caption_de: "Sequenz des Zusammenbruchs vom 28-A, die die Interaktion zwischen Bedieneraktionen (OA) und automatischen Schutzaktionen (AA) zeigt. Quelle: Albustami et al., 2025."
        },
        {
          src: "/figuras/futured_grid_evolution.png",
          caption_es: "El desplazamiento de grandes masas rotatorias por recursos IBR reduce drásticamente la inercia total del sistema. Fuente: FutuRed, 2024.",
          caption_en: "The displacement of large rotating masses by IBR resources drastically reduces the total inertia of the system. Source: FutuRed, 2024.",
          caption_pt: "O deslocamento de grandes massas rotativas por recursos IBR reduz drasticamente a inércia total do sistema. Fonte: FutuRed, 2024.",
          caption_fr: "Le déplacement de grandes masses rotatives par des ressources IBR réduit drastiquement l'inertie totale du système. Source : FutuRed, 2024.",
          caption_it: "Lo spostamento di grandi masse rotanti da parte di risorse IBR riduce drasticamente l'inerzia totale del sistema. Fonte: FutuRed, 2024.",
          caption_de: "Die Verdrängung großer rotierender Massen durch IBR-Ressourcen reduziert die Gesamtträgheit des Systems drastisch. Quelle: FutuRed, 2024."
        },
        {
          src: "/figuras/pmu_sensors_europe.png",
          caption_es: "La densidad de cobertura de las PMU fue determinante para la verificación independiente de las oscilaciones inter-área. Fuente: NREL.",
          caption_en: "The coverage density of PMUs was decisive for the independent verification of inter-area oscillations. Source: NREL.",
          caption_pt: "A densidade de cobertura das PMUs foi determinante para a verificação independente das oscilações interárea. Fonte: NREL.",
          caption_fr: "La densité de couverture des PMU a été déterminante pour la vérification indépendante des oscillations inter-zones. Source : NREL.",
          caption_it: "La densità di copertura delle PMU è stata determinante per la verifica indipendente delle oscillazioni inter-area. Fonte: NREL.",
          caption_de: "Die Abdeckungsdichte der PMUs war entscheidend für die unabhängige Überprüfung der Inter-Area-Oszillationen. Quelle: NREL."
        }
      ]
    },
    {
      id: "ch2",
      title_es: "Capítulo 2: El Contexto Energético y la Vulnerabilidad Estructural",
      title_en: "Chapter 2: The Energy Context and Structural Vulnerability",
      title_pt: "Capítulo 2: O Contexto Energético e a Vulnerabilidade Estrutural",
      title_fr: "Chapitre 2 : Le Contexte Énergétique et la Vulnérabilité Structurelle",
      title_it: "Capitolo 2: Il Contesto Energetico e la Vulnerabilità Strutturale",
      title_de: "Kapitel 2: Der Energiekontext und die Strukturelle Anfälligkeit",
      images: [
        {
          src: "/figuras/mix_comparativo_2010_2024.png",
          caption_es: "Evolución del mix de generación en España: 2010 frente a 2024. Fuente: Centro Peter Huber / ESIOS.",
          caption_en: "Evolution of the generation mix in Spain: 2010 versus 2024. Source: Peter Huber Center / ESIOS.",
          caption_pt: "Evolução do mix de geração na Espanha: 2010 versus 2024. Fonte: Centro Peter Huber / ESIOS.",
          caption_fr: "Évolution du mix de production en Espagne : 2010 contre 2024. Source : Centre Peter Huber / ESIOS.",
          caption_it: "Evoluzione del mix di generazione in Spagna: 2010 contro 2024. Fonte: Centro Peter Huber / ESIOS.",
          caption_de: "Entwicklung des Erzeugungsmixes in Spanien: 2010 gegenüber 2024. Quelle: Peter Huber Zentrum / ESIOS."
        },
        {
          src: "/figuras/capacidad_instalada_2025.png",
          caption_es: "Capacidad de generación instalada en el sistema español a 31 de enero de 2025. Fuente: NREL / Red Eléctrica.",
          caption_en: "Installed generation capacity in the Spanish system as of January 31, 2025. Source: NREL / Red Eléctrica.",
          caption_pt: "Capacidade de geração instalada no sistema espanhol em 31 de janeiro de 2025. Fonte: NREL / Red Eléctrica.",
          caption_fr: "Capacité de production installée dans le système espagnol au 31 janvier 2025. Source : NREL / Red Eléctrica.",
          caption_it: "Capacità di generazione installata nel sistema spagnolo al 31 gennaio 2025. Fonte: NREL / Red Eléctrica.",
          caption_de: "Installierte Erzeugungskapazität im spanischen System zum 31. Januar 2025. Quelle: NREL / Red Eléctrica."
        },
        {
          src: "/figuras/ree_generation_mix_28april.png",
          caption_es: "Perfil de generación del 28-A: el valle de demanda coincidió con el pico de producción fotovoltaica, desplazando la generación síncrona a mínimos históricos. Fuente: NREL / Red Eléctrica.",
          caption_en: "Generation profile on April 28: the demand valley coincided with the peak of photovoltaic production, displacing synchronous generation to historical minimums. Source: NREL / Red Eléctrica.",
          caption_pt: "Perfil de geração de 28-A: o vale de demanda coincidiu com o pico de produção fotovoltaica, deslocando a geração síncrona para mínimos históricos. Fonte: NREL / Red Eléctrica.",
          caption_fr: "Profil de production du 28-A : le creux de la demande a coïncidé avec le pic de production photovoltaïque, déplaçant la production synchrone vers des minimums historiques. Source : NREL / Red Eléctrica.",
          caption_it: "Profilo di generazione del 28-A: il minimo di domanda è coinciso con il picco di produzione fotovoltaica, spostando la generazione sincrona verso minimi storici. Fonte: NREL / Red Eléctrica.",
          caption_de: "Erzeugungsprofil vom 28-A: Das Nachfragetal fiel mit dem Höhepunkt der Photovoltaikproduktion zusammen und verdrängte die synchrone Erzeugung auf historische Tiefststände. Quelle: NREL / Red Eléctrica."
        },
        {
          src: "/figuras/precursor_overvoltage_22april.png",
          caption_es: "Oscilaciones de tensión registradas en Núñez de Balboa (400 kV) durante el episodio precursor del 22 de abril. Varias instalaciones que dispararon el 28-A ya habían sufrido disparos idénticos en este evento previo. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Voltage oscillations recorded at Núñez de Balboa (400 kV) during the precursor episode on April 22. Several facilities that tripped on April 28 had already suffered identical trips in this previous event. Source: IIT-ICAI / Compass Lexecon.",
          caption_pt: "Oscilações de tensão registradas em Núñez de Balboa (400 kV) durante o episódio precursor de 22 de abril. Várias instalações que desarmaram em 28-A já haviam sofrido desarmes idênticos neste evento anterior. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_fr: "Oscillations de tension enregistrées à Núñez de Balboa (400 kV) lors de l'épisode précurseur du 22 avril. Plusieurs installations qui ont déclenché le 28-A avaient déjà subi des déclenchements identiques lors de cet événement précédent. Source : IIT-ICAI / Compass Lexecon.",
          caption_it: "Oscillazioni di tensione registrate a Núñez de Balboa (400 kV) durante l'episodio precursore del 22 aprile. Diverse installazioni che sono scattate il 28-A avevano già subito scatti identici in questo evento precedente. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_de: "Spannungsschwankungen, die am 22. April in Núñez de Balboa (400 kV) während des Vorläuferereignisses registriert wurden. Mehrere Anlagen, die am 28-A auslösten, hatten bereits bei diesem früheren Ereignis identische Auslösungen erfahren. Quelle: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/entsoe_flow_deviation.png",
          caption_es: "Desviación entre el programa de intercambio comercial (NTC) y el flujo de potencia físico real en la frontera España-Francia durante la mañana del 28-A. Fuente: Informe Factual ENTSO-E.",
          caption_en: "Deviation between the commercial exchange schedule (NTC) and the actual physical power flow on the Spain-France border during the morning of April 28. Source: ENTSO-E Factual Report.",
          caption_pt: "Desvio entre o programa de intercâmbio comercial (NTC) e o fluxo de potência físico real na fronteira Espanha-França durante a manhã de 28-A. Fonte: Relatório Factual ENTSO-E.",
          caption_fr: "Écart entre le programme d'échange commercial (NTC) et le flux de puissance physique réel à la frontière Espagne-France durant la matinée du 28-A. Source : Rapport Factuel ENTSO-E.",
          caption_it: "Deviazione tra il programma di scambio commerciale (NTC) e il flusso di potenza fisico reale al confine Spagna-Francia durante la mattina del 28-A. Fonte: Rapporto Fattuale ENTSO-E.",
          caption_de: "Abweichung zwischen dem kommerziellen Austauschprogramm (NTC) und dem tatsächlichen physischen Leistungsfluss an der spanisch-französischen Grenze am Morgen des 28-A. Quelle: ENTSO-E Sachstandsbericht."
        },
        {
          src: "/figuras/hvdc_control_transition.png",
          caption_es: "Transición PMODE3 → PMODE1 a las 12:08 CEST en el enlace HVDC INELFE-1. La decisión limitó la capacidad de respuesta dinámica del enlace ante la cascada posterior. Fuente: IIT-ICAI / AELEC.",
          caption_en: "Transition from PMODE3 to PMODE1 at 12:08 CEST in the INELFE-1 HVDC link. The decision limited the dynamic response capacity of the link to the subsequent cascade. Source: IIT-ICAI / AELEC.",
          caption_pt: "Transição PMODE3 → PMODE1 às 12:08 CEST na ligação HVDC INELFE-1. A decisão limitou a capacidade de resposta dinâmica da ligação perante a cascata subsequente. Fonte: IIT-ICAI / AELEC.",
          caption_fr: "Transition PMODE3 → PMODE1 à 12:08 CEST sur la liaison HVDC INELFE-1. La décision a limité la capacité de réponse dynamique de la liaison face à la cascade ultérieure. Source : IIT-ICAI / AELEC.",
          caption_it: "Transizione PMODE3 → PMODE1 alle 12:08 CEST nel collegamento HVDC INELFE-1. La decisione ha limitato la capacità di risposta dinamica del collegamento di fronte alla cascata successiva. Fonte: IIT-ICAI / AELEC.",
          caption_de: "Übergang PMODE3 → PMODE1 um 12:08 CEST bei der HGÜ-Verbindung INELFE-1. Die Entscheidung begrenzte die dynamische Reaktionsfähigkeit der Verbindung angesichts der nachfolgenden Kaskade. Quelle: IIT-ICAI / AELEC."
        },
        {
          src: "/figuras/frequency_voltage_carmona.png",
          caption_es: "Frecuencia y tensión en los segundos críticos del incidente. Subestación de Carmona (400 kV). La transición abrupta Normal → Blackout queda registrada en la caída simultánea de ambas variables. Fuente: ENTSO-E / REE.",
          caption_en: "Frequency and voltage in the critical seconds of the incident. Carmona Substation (400 kV). The abrupt transition from Normal to Blackout is recorded in the simultaneous drop of both variables. Source: ENTSO-E / REE.",
          caption_pt: "Frequência e tensão nos segundos críticos do incidente. Subestação de Carmona (400 kV). A transição abrupta Normal → Blackout fica registrada na queda simultânea de ambas as variáveis. Fonte: ENTSO-E / REE.",
          caption_fr: "Fréquence et tension dans les secondes critiques de l'incident. Sous-station de Carmona (400 kV). La transition abrupte Normal → Blackout est enregistrée dans la chute simultanée des deux variables. Source : ENTSO-E / REE.",
          caption_it: "Frequenza e tensione nei secondi critici dell'incidente. Sottostazione di Carmona (400 kV). La transizione improvvisa Normale → Blackout è registrata nel calo simultaneo di entrambe le variabili. Fonte: ENTSO-E / REE.",
          caption_de: "Frequenz und Spannung in den kritischen Sekunden des Vorfalls. Umspannwerk Carmona (400 kV). Der abrupte Übergang Normal → Blackout wird im gleichzeitigen Abfall beider Variablen registriert. Quelle: ENTSO-E / REE."
        }
      ]
    },
    {
      id: "ch3",
      title_es: "Capítulo 3: Análisis del Incidente",
      title_en: "Chapter 3: Analysis of the Incident",
      title_pt: "Capítulo 3: Análise do Incidente",
      title_fr: "Chapitre 3 : Analyse de l'Incident",
      title_it: "Capitolo 3: Analisi dell'Incidente",
      title_de: "Kapitel 3: Analyse des Vorfalls",
      images: [
        {
          src: "/figuras/nunez_balboa_precursores.png",
          caption_es: "Tensiones en Núñez de Balboa (400 kV) durante los eventos precursores del 22, 24 y 28 de abril. La sucesión de picos de sobretensión evidencia el estrechamiento progresivo de los márgenes de control de potencia reactiva. Fuente: IIT-ICAI.",
          caption_en: "Voltages at Núñez de Balboa (400 kV) during the precursor events of April 22, 24, and 28. The succession of overvoltage peaks shows the progressive narrowing of reactive power control margins. Source: IIT-ICAI.",
          caption_pt: "Tensões em Núñez de Balboa (400 kV) durante os eventos precursores de 22, 24 e 28 de abril. A sucessão de picos de sobretensão evidencia o estreitamento progressivo das margens de controle de potência reativa. Fonte: IIT-ICAI.",
          caption_fr: "Tensions à Núñez de Balboa (400 kV) lors des événements précurseurs des 22, 24 et 28 avril. La succession de pics de surtension met en évidence le rétrécissement progressif des marges de contrôle de puissance réactive. Source : IIT-ICAI.",
          caption_it: "Tensioni a Núñez de Balboa (400 kV) durante gli eventi precursori del 22, 24 e 28 aprile. La successione di picchi di sovratensione evidenzia il progressivo restringimento dei margini di controllo della potenza reattiva. Fonte: IIT-ICAI.",
          caption_de: "Spannungen in Núñez de Balboa (400 kV) während der Vorläuferereignisse am 22., 24. und 28. April. Die Abfolge von Überspannungsspitzen zeigt die fortschreitende Verengung der Blindleistungsregelmargen. Quelle: IIT-ICAI."
        },
        {
          src: "/figuras/wams_oscilaciones_carmona.png",
          caption_es: "Registro del WAMS capturando la oscilación electromecánica de 0,6 Hz en Carmona (Sevilla) a las 12:03 CEST. Los sistemas WAMS, basados en redes de PMU sincronizadas por GPS, permiten observar la dinámica continental con resolución de milisegundos. Fuente: ENTSO-E / REE.",
          caption_en: "WAMS record capturing the 0.6 Hz electromechanical oscillation at Carmona (Seville) at 12:03 CEST. WAMS systems, based on networks of GPS-synchronized PMUs, allow observing continental dynamics with millisecond resolution. Source: ENTSO-E / REE.",
          caption_pt: "Registro do WAMS capturando a oscilação eletromecânica de 0,6 Hz em Carmona (Sevilha) às 12:03 CEST. Os sistemas WAMS, baseados em redes de PMU sincronizadas por GPS, permitem observar a dinâmica continental com resolução de milissegundos. Fonte: ENTSO-E / REE.",
          caption_fr: "Enregistrement du WAMS capturant l'oscillation électromécanique de 0,6 Hz à Carmona (Séville) à 12:03 CEST. Les systèmes WAMS, basés sur des réseaux de PMU synchronisés par GPS, permettent d'observer la dynamique continentale avec une résolution en millisecondes. Source : ENTSO-E / REE.",
          caption_it: "Registrazione del WAMS che cattura l'oscillazione elettromeccanica di 0,6 Hz a Carmona (Siviglia) alle 12:03 CEST. I sistemi WAMS, basati su reti di PMU sincronizzate tramite GPS, permettono di osservare la dinamica continentale con risoluzione di millisecondi. Fonte: ENTSO-E / REE.",
          caption_de: "WAMS-Aufzeichnung der elektromechanischen Oszillation von 0,6 Hz in Carmona (Sevilla) um 12:03 CEST. WAMS-Systeme, die auf GPS-synchronisierten PMU-Netzwerken basieren, ermöglichen die Beobachtung der kontinentalen Dynamik mit Millisekundenauflösung. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/tap_lag_decoupling.png",
          caption_es: "Desacoplamiento entre el primario de 400 kV y el secundario colector durante la Fase 2. Mientras el incremento de tensión en el lado de 400 kV se mantuvo en valores moderados, la inercia del OLTC amplificó el transitorio en el lado colector. Fuente: ENTSO-E.",
          caption_en: "Decoupling between the 400 kV primary and the collector secondary during Phase 2. While the voltage increase on the 400 kV side remained moderate, the inertia of the OLTC amplified the transient on the collector side. Source: ENTSO-E.",
          caption_pt: "Desacoplamento entre o primário de 400 kV e o secundário coletor durante a Fase 2. Enquanto o aumento de tensão no lado de 400 kV se manteve em valores moderados, a inércia do OLTC amplificou o transitório no lado coletor. Fonte: ENTSO-E.",
          caption_fr: "Découplage entre le primaire de 400 kV et le secondaire collecteur pendant la Phase 2. Alors que l'augmentation de tension du côté 400 kV est restée à des valeurs modérées, l'inertie du changeur de prises (OLTC) a amplifié le transitoire du côté collecteur. Source : ENTSO-E.",
          caption_it: "Disaccoppiamento tra il primario a 400 kV e il secondario collettore durante la Fase 2. Mentre l'incremento di tensione sul lato a 400 kV è rimasto su valori moderati, l'inerzia dell'OLTC ha amplificato il transitorio sul lato collettore. Fonte: ENTSO-E.",
          caption_de: "Entkopplung zwischen der 400-kV-Primärseite und der Kollektor-Sekundärseite während der Phase 2. Während der Spannungsanstieg auf der 400-kV-Seite auf moderaten Werten blieb, verstärkte die Trägheit des Stufenschalters (OLTC) die Transiente auf der Kollektorseite. Quelle: ENTSO-E."
        },
        {
          src: "/figuras/heatmap_propagation.png",
          caption_es: "Propagación de las sobretensiones en la red de 400 kV durante la Fase 2 (12:32:00–12:33:18 CEST). Fuente: Comité de Análisis del Gobierno / REE.",
          caption_en: "Propagation of overvoltages in the 400 kV network during Phase 2 (12:32:00–12:33:18 CEST). Source: Government Analysis Committee / REE.",
          caption_pt: "Propagação das sobretensões na rede de 400 kV durante a Fase 2 (12:32:00–12:33:18 CEST). Fonte: Comitê de Análise do Governo / REE.",
          caption_fr: "Propagation des surtensions dans le réseau 400 kV pendant la Phase 2 (12:32:00–12:33:18 CEST). Source : Comité d'Analyse du Gouvernement / REE.",
          caption_it: "Propagazione delle sovratensioni nella rete a 400 kV durante la Fase 2 (12:32:00–12:33:18 CEST). Fonte: Comitato di Analisi del Governo / REE.",
          caption_de: "Ausbreitung von Überspannungen im 400-kV-Netz während Phase 2 (12:32:00–12:33:18 CEST). Quelle: Analyseausschuss der Regierung / REE."
        },
        {
          src: "/figuras/cascada_desconexiones.png",
          caption_es: "Propagación geográfica de la cascada durante los once segundos de la Fase 3. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Geographical propagation of the cascade during the eleven seconds of Phase 3. Source: Government Analysis Committee.",
          caption_pt: "Propagação geográfica da cascata durante os onze segundos da Fase 3. Fonte: Comitê de Análise do Governo.",
          caption_fr: "Propagation géographique de la cascade pendant les onze secondes de la Phase 3. Source : Comité d'Analyse du Gouvernement.",
          caption_it: "Propagazione geografica della cascata durante gli undici secondi della Fase 3. Fonte: Comitato di Analisi del Governo.",
          caption_de: "Geografische Ausbreitung der Kaskade während der elf Sekunden von Phase 3. Quelle: Analyseausschuss der Regierung."
        },
        {
          src: "/figuras/tension_frecuencia_colapso.png",
          caption_es: "Evolución acoplada de la tensión (kV) y la frecuencia (Hz) durante la Fase 3. El incremento de tensión por encima de 1,10 p.u. precede en el tiempo a la caída de frecuencia, confirmando que el colapso fue primariamente capacitivo, no inercial. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Coupled evolution of voltage (kV) and frequency (Hz) during Phase 3. The voltage increase above 1.10 p.u. precedes the frequency drop in time, confirming that the collapse was primarily capacitive, not inertial. Source: Government Analysis Committee.",
          caption_pt: "Evolução acoplada da tensão (kV) e da frequência (Hz) durante a Fase 3. O aumento de tensão acima de 1,10 p.u. precede no tempo a queda de frequência, confirmando que o colapso foi primeiramente capacitivo, não inercial. Fonte: Comitê de Análise do Governo.",
          caption_fr: "Évolution couplée de la tension (kV) et de la fréquence (Hz) pendant la Phase 3. L'augmentation de tension au-dessus de 1,10 p.u. précède dans le temps la chute de fréquence, confirmant que l'effondrement était principalement capacitif, et non inertiel. Source : Comité d'Analyse du Gouvernement.",
          caption_it: "Evoluzione accoppiata della tensione (kV) e della frequenza (Hz) durante la Fase 3. L'aumento di tensione sopra 1,10 p.u. precede temporalmente il calo di frequenza, confermando che il collasso è stato primariamente capacitivo, non inerziale. Fonte: Comitato di Analisi del Governo.",
          caption_de: "Gekoppelte Entwicklung von Spannung (kV) und Frequenz (Hz) während Phase 3. Der Spannungsanstieg über 1,10 p.u. geht dem Frequenzabfall zeitlich voraus, was bestätigt, dass der Zusammenbruch primär kapazitiv und nicht trägheitsbedingt war. Quelle: Analyseausschuss der Regierung."
        },
        {
          src: "/figuras/interconexion_francia_colapso.png",
          caption_es: "Inversión de flujos en la frontera pirenaica durante la Fase 3: importación de emergencia de hasta 4.609 MW por las líneas AC, extracción simultánea de 1.000 MW por el HVDC en PMODE1, y apertura de las líneas AC por pérdida de sincronismo a las 12:33:21 CEST. Fuente: Comité de Análisis del Gobierno / REE.",
          caption_en: "Reversal of flows at the Pyrenean border during Phase 3: emergency import of up to 4,609 MW through AC lines, simultaneous extraction of 1,000 MW through HVDC in PMODE1, and opening of AC lines due to loss of synchronism at 12:33:21 CEST. Source: Government Analysis Committee / REE.",
          caption_pt: "Inversão de fluxos na fronteira pirenaica durante a Fase 3: importação de emergência de até 4.609 MW pelas linhas AC, extração simultânea de 1.000 MW pelo HVDC em PMODE1, e abertura das linhas AC por perda de sincronismo às 12:33:21 CEST. Fonte: Comitê de Análise do Governo / REE.",
          caption_fr: "Inversion des flux à la frontière pyrénéenne pendant la Phase 3 : importation d'urgence jusqu'à 4 609 MW par les lignes AC, extraction simultanée de 1 000 MW par le HVDC en PMODE1, et ouverture des lignes AC suite à la perte de synchronisme à 12:33:21 CEST. Source : Comité d'Analyse du Gouvernement / REE.",
          caption_it: "Inversione dei flussi sul confine pirenaico durante la Fase 3: importazione di emergenza fino a 4.609 MW attraverso le linee AC, estrazione simultanea di 1.000 MW tramite l'HVDC in PMODE1 e apertura delle linee AC per perdita di sincronismo alle 12:33:21 CEST. Fonte: Comitato di Analisi del Governo / REE.",
          caption_de: "Umkehr der Flüsse an der Pyrenäengrenze während Phase 3: Notimport von bis zu 4.609 MW über die AC-Leitungen, gleichzeitige Entnahme von 1.000 MW durch die HGÜ in PMODE1 und Öffnung der AC-Leitungen wegen Synchronitätsverlust um 12:33:21 CEST. Quelle: Analyseausschuss der Regierung / REE."
        }
      ]
    },
    {
      id: "ch4",
      title_es: "Capítulo 4: Reacción y Reposición",
      title_en: "Chapter 4: Reaction and Restoration",
      title_pt: "Capítulo 4: Reação e Reposição",
      title_fr: "Chapitre 4 : Réaction et Rétablissement",
      title_it: "Capitolo 4: Reazione e Ripristino",
      title_de: "Kapitel 4: Reaktion und Wiederherstellung",
      images: [
        {
          src: "/figuras/islas_reposicion_entsoe.png",
          caption_es: "Fragmentación topológica conforme al P.O. 1.6. Cada isla debía estabilizarse individualmente en tensión y frecuencia antes de autorizarse su sincronización con las islas adyacentes. Fuente: ENTSO-E / REE.",
          caption_en: "Topological fragmentation according to OP 1.6. Each island had to stabilize individually in voltage and frequency before its synchronization with adjacent islands was authorized. Source: ENTSO-E / REE.",
          caption_pt: "Fragmentação topológica conforme o P.O. 1.6. Cada ilha devia se estabilizar individualmente em tensão e frequência antes de se autorizar sua sincronização com as ilhas adjacentes. Fonte: ENTSO-E / REE.",
          caption_fr: "Fragmentation topologique conformément à la P.O. 1.6. Chaque îlot devait se stabiliser individuellement en tension et en fréquence avant que sa synchronisation avec les îlots adjacents ne soit autorisée. Source : ENTSO-E / REE.",
          caption_it: "Frammentazione topologica conforme al P.O. 1.6. Ogni isola doveva stabilizzarsi individualmente in tensione e frequenza prima di autorizzare la sua sincronizzazione con le isole adiacenti. Fonte: ENTSO-E / REE.",
          caption_de: "Topologische Fragmentierung gemäß P.O. 1.6. Jede Insel musste einzeln in Spannung und Frequenz stabilisiert werden, bevor ihre Synchronisierung mit benachbarten Inseln genehmigt wurde. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/estrategia_reenergizacion_dual.png",
          caption_es: "Estrategia dual de re-energización: vía Top-Down desde Francia y Marruecos y vía Bottom-Up desde las centrales hidráulicas internas. Fuente: ENTSO-E / REE.",
          caption_en: "Dual re-energization strategy: Top-Down approach from France and Morocco, and Bottom-Up approach from internal hydroelectric plants. Source: ENTSO-E / REE.",
          caption_pt: "Estratégia dual de reenergização: via Top-Down a partir da França e Marrocos e via Bottom-Up a partir das centrais hidrelétricas internas. Fonte: ENTSO-E / REE.",
          caption_fr: "Stratégie double de ré-énergisation : voie Top-Down depuis la France et le Maroc et voie Bottom-Up depuis les centrales hydroélectriques internes. Source : ENTSO-E / REE.",
          caption_it: "Doppia strategia di rienergizzazione: via Top-Down da Francia e Marocco e via Bottom-Up dalle centrali idroelettriche interne. Fonte: ENTSO-E / REE.",
          caption_de: "Duale Strategie zur Wiederaufladung: Top-Down-Weg von Frankreich und Marokko und Bottom-Up-Weg von internen Wasserkraftwerken. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/black_start_hidroelectrico.png",
          caption_es: "Intentos de arranque autónomo hidroeléctrico durante la Fase 4. Los puntos grises corresponden a intentos fallidos. La elevada proporción de fracasos refleja la complejidad de energizar una red sin masa síncrona acoplada. Fuente: ENTSO-E / REE.",
          caption_en: "Hydroelectric black start attempts during Phase 4. Grey dots correspond to failed attempts. The high proportion of failures reflects the complexity of energizing a grid without coupled synchronous mass. Source: ENTSO-E / REE.",
          caption_pt: "Tentativas de partida autônoma hidrelétrica durante a Fase 4. Os pontos cinzas correspondem a tentativas falhas. A alta proporção de fracassos reflete a complexidade de energizar uma rede sem massa síncrona acoplada. Fonte: ENTSO-E / REE.",
          caption_fr: "Tentatives de démarrage autonome hydroélectrique pendant la Phase 4. Les points gris correspondent à des tentatives infructueuses. La forte proportion d'échecs reflète la complexité de mettre sous tension un réseau sans masse synchrone couplée. Source : ENTSO-E / REE.",
          caption_it: "Tentativi di avvio autonomo idroelettrico durante la Fase 4. I punti grigi corrispondono a tentativi falliti. L'elevata proporzione di fallimenti riflette la complessità di energizzare una rete senza massa sincrona accoppiata. Fonte: ENTSO-E / REE.",
          caption_de: "Versuche eines autonomen Wasserkraftstarts während Phase 4. Die grauen Punkte entsprechen fehlgeschlagenen Versuchen. Der hohe Anteil an Fehlversuchen spiegelt die Komplexität wider, ein Netz ohne gekoppelte synchrone Masse zu erregen. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/evolucion_carga_repuesta_francia.png",
          caption_es: "Soporte transfronterizo desde Francia durante la reposición. Las inyecciones de RTE sostuvieron la estabilidad de tensión durante la re-energización de los corredores norte y este antes de que los grupos síncronos internos se acoplaran en cantidad suficiente. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Cross-border support from France during restoration. RTE injections sustained voltage stability during the re-energization of the northern and eastern corridors before internal synchronous units were coupled in sufficient quantity. Source: Government Analysis Committee.",
          caption_pt: "Suporte transfronteiriço da França durante a reposição. As injeções da RTE mantiveram a estabilidade de tensão durante a reenergização dos corredores norte e leste antes que os grupos síncronos internos se acoplassem em quantidade suficiente. Fonte: Comitê de Análise do Governo.",
          caption_fr: "Soutien transfrontalier de la France pendant le rétablissement. Les injections de RTE ont soutenu la stabilité de tension lors de la ré-énergisation des corridors nord et est avant que les groupes synchrones internes ne soient couplés en quantité suffisante. Source : Comité d'Analyse du Gouvernement.",
          caption_it: "Supporto transfrontaliero dalla Francia durante il ripristino. Le iniezioni di RTE hanno sostenuto la stabilità di tensione durante la rienergizzazione dei corridoi nord ed est prima che i gruppi sincroni interni si accoppiassero in quantità sufficiente. Fonte: Comitato di Analisi del Governo.",
          caption_de: "Grenzüberschreitende Unterstützung aus Frankreich während der Wiederherstellung. Die Einspeisungen von RTE unterstützten die Spannungsstabilität während der Wiederaufladung der Nord- und Ostkorridore, bevor sich interne Synchrongruppen in ausreichender Menge koppelten. Quelle: Analyseausschuss der Regierung."
        },
        {
          src: "/figuras/intercambio_marruecos_topdown.png",
          caption_es: "Soporte Top-Down desde la frontera sur (ONEE). La interconexión marroquí resultó determinante para aportar la potencia de cortocircuito necesaria para energizar Andalucía. Fuente: ENTSO-E / REE.",
          caption_en: "Top-Down support from the southern border (ONEE). The Moroccan interconnection was decisive in providing the short-circuit power necessary to energize Andalusia. Source: ENTSO-E / REE.",
          caption_pt: "Suporte Top-Down a partir da fronteira sul (ONEE). A interconexão marroquina foi determinante para fornecer a potência de curto-circuito necessária para energizar a Andaluzia. Fonte: ENTSO-E / REE.",
          caption_fr: "Soutien Top-Down depuis la frontière sud (ONEE). L'interconnexion marocaine a été déterminante pour apporter la puissance de court-circuit nécessaire pour alimenter l'Andalousie. Source : ENTSO-E / REE.",
          caption_it: "Supporto Top-Down dal confine meridionale (ONEE). L'interconnessione marocchina è risultata determinante per fornire la potenza di cortocircuito necessaria per energizzare l'Andalusia. Fonte: ENTSO-E / REE.",
          caption_de: "Top-Down-Unterstützung von der Südgrenze (ONEE). Die marokkanische Verbindung erwies sich als entscheidend für die Bereitstellung der erforderlichen Kurzschlussleistung zur Erregung Andalusiens. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/evolucion_mix_reenergizacion.png",
          caption_es: "Mix tecnológico durante la re-energización. En las primeras horas, el sistema se sostuvo exclusivamente mediante importaciones transfronterizas y generación síncrona. La incorporación de IBR quedó restringida hasta que se acreditó la potencia de cortocircuito e inercia mínimas necesarias. Fuente: ENTSO-E / REE.",
          caption_en: "Technological mix during re-energization. In the early hours, the system was sustained exclusively by cross-border imports and synchronous generation. The incorporation of IBRs was restricted until the minimum required short-circuit power and inertia were verified. Source: ENTSO-E / REE.",
          caption_pt: "Mix tecnológico durante a reenergização. Nas primeiras horas, o sistema foi sustentado exclusivamente por meio de importações transfronteiriças e geração síncrona. A incorporação de IBR ficou restrita até que se comprovasse a potência de curto-circuito e inércia mínimas necessárias. Fonte: ENTSO-E / REE.",
          caption_fr: "Mix technologique pendant la ré-énergisation. Dans les premières heures, le système a été soutenu exclusivement par des importations transfrontalières et la production synchrone. L'incorporation d'IBR a été restreinte jusqu'à ce que la puissance de court-circuit et l'inertie minimales nécessaires soient vérifiées. Source : ENTSO-E / REE.",
          caption_it: "Mix tecnologico durante la rienergizzazione. Nelle prime ore, il sistema si è sostenuto esclusivamente tramite importazioni transfrontaliere e generazione sincrona. L'inclusione di IBR è stata limitata fino a quando non sono state accertate la potenza di cortocircuito e l'inerzia minime necessarie. Fonte: ENTSO-E / REE.",
          caption_de: "Technologiemix während der Wiederaufladung. In den ersten Stunden wurde das System ausschließlich durch grenzüberschreitende Importe und synchrone Erzeugung aufrechterhalten. Die Einbindung von IBR wurde eingeschränkt, bis die erforderliche Mindestkurzschlussleistung und Trägheit nachgewiesen waren. Quelle: ENTSO-E / REE."
        },
        {
          src: "/figuras/recuperacion_demanda_peninsular.png",
          caption_es: "Desplome y recuperación de la demanda peninsular. La reposición de los 25 GW perdidos se completó tras casi 19 horas de maniobras ininterrumpidas, con conexión de carga escalonada para evitar nuevos episodios de subfrecuencia. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Collapse and recovery of peninsular demand. The replacement of the 25 GW lost was completed after almost 19 hours of uninterrupted maneuvers, with staggered load connection to avoid new subfrequency episodes. Source: Government Analysis Committee.",
          caption_pt: "Colapso e recuperação da demanda peninsular. A reposição dos 25 GW perdidos foi concluída após quase 19 horas de manobras ininterruptas, com conexão de carga escalonada para evitar novos episódios de subfrequência. Fonte: Comitê de Análise do Governo.",
          caption_fr: "Effondrement et reprise de la demande péninsulaire. Le rétablissement des 25 GW perdus s'est achevé après près de 19 heures de manœuvres ininterrompues, avec une connexion de charge échelonnée pour éviter de nouveaux épisodes de sous-fréquence. Source : Comité d'Analyse du Gouvernement.",
          caption_it: "Crollo e ripresa della domanda peninsulare. Il ripristino dei 25 GW persi è stato completato dopo quasi 19 ore di manovre ininterrotte, con una connessione di carico scaglionata per evitare nuovi episodi di sottofrequenza. Fonte: Comitato di Analisi del Governo.",
          caption_de: "Einbruch und Erholung der Nachfrage auf der Halbinsel. Die Wiederherstellung der verlorenen 25 GW wurde nach fast 19 Stunden ununterbrochener Manöver mit gestaffelter Lastzuschaltung abgeschlossen, um neue Unterfrequenzepisoden zu vermeiden. Quelle: Analyseausschuss der Regierung."
        }
      ]
    },
    {
      id: "ch5",
      title_es: "Capítulo 5: Análisis de los Informes",
      title_en: "Chapter 5: Analysis of the Reports",
      title_pt: "Capítulo 5: Análise dos Relatórios",
      title_fr: "Chapitre 5 : Analyse des Rapports",
      title_it: "Capitolo 5: Analisi dei Rapporti",
      title_de: "Kapitel 5: Analyse der Berichte",
      images: [
        {
          src: "/figuras/mapas_termicos_tension_ree.png",
          caption_es: "Cartografía de tensión en la red de 400 kV (12:30–12:32:57 CEST) según el análisis del Operador del Sistema. REE sostiene que los perfiles se mantuvieron dentro de los rangos del P.O. 1.1 hasta el inicio de las desconexiones en las redes colectoras. Fuente: Red Eléctrica.",
          caption_en: "Voltage mapping in the 400 kV network (12:30–12:32:57 CEST) according to the System Operator's analysis. REE argues that profiles remained within PO 1.1 ranges until the onset of disconnections in collector networks. Source: Red Eléctrica.",
          caption_pt: "Cartografia de tensão na rede de 400 kV (12:30–12:32:57 CEST) segundo a análise do Operador do Sistema. A REE afirma que os perfis se mantiveram dentro das faixas do P.O. 1.1 até o início das desconexões nas redes coletoras. Fonte: Red Eléctrica.",
          caption_fr: "Cartographie de tension dans le réseau 400 kV (12:30–12:32:57 CEST) selon l'analyse de l'Opérateur du Système. REE soutient que les profils sont restés dans les limites de la P.O. 1.1 jusqu'au début des déconnexions dans les réseaux collecteurs. Source : Red Eléctrica.",
          caption_it: "Cartografia della tensione nella rete a 400 kV (12:30–12:32:57 CEST) secondo l'analisi dell'Operatore di Sistema. REE sostiene che i profili si siano mantenuti all'interno degli intervalli del P.O. 1.1 fino all'inizio delle disconnessioni nelle reti collettrici. Fonte: Red Eléctrica.",
          caption_de: "Spannungskartierung im 400-kV-Netz (12:30–12:32:57 CEST) nach Analyse des Systembetreibers. REE argumentiert, dass die Profile bis zum Beginn der Abschaltungen in den Kollektornetzen innerhalb der P.O. 1.1-Bereiche blieben. Quelle: Red Eléctrica."
        },
        {
          src: "/figuras/fluctuaciones_tension_previas.png",
          caption_es: "Curvas Q-V de estabilidad de tensión en Carmona 400 kV. Las maniobras de mallado desplazaron el punto de operación contrayendo el margen al colapso un 57 %. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Q-V voltage stability curves at Carmona 400 kV. Meshing maneuvers shifted the operating point, shrinking the margin to collapse by 57%. Source: IIT-ICAI / Compass Lexecon.",
          caption_pt: "Curvas Q-V de estabilidade de tensão em Carmona 400 kV. As manobras de malha deslocaram o ponto de operação, reduzindo a margem para o colapso em 57%. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_fr: "Courbes Q-V de stabilité de tension à Carmona 400 kV. Les manœuvres de maillage ont déplacé le point de fonctionnement en réduisant la marge d'effondrement de 57 %. Source : IIT-ICAI / Compass Lexecon.",
          caption_it: "Curve Q-V di stabilità di tensione a Carmona 400 kV. Le manovre di magliatura hanno spostato il punto di operazione riducendo il margine di collasso del 57%. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_de: "Q-V-Kurven der Spannungsstabilität in Carmona 400 kV. Die Vermaschungsmanöver verschoben den Betriebspunkt und verringerten die Kollapsmarge um 57 %. Quelle: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/aluvion_alertas_sobretension_sur.png",
          caption_es: "Oscilograma del disparo raíz (Granada, 12:32:56.993 CEST). Panel inferior: tensión en el secundario colector —fase A alcanza ~145 kV— invisible para el SCADA de REE en la red de 400 kV por efecto Tap-Lag. Fuente: IIT-ICAI / AELEC.",
          caption_en: "Oscillogram of the root trip (Granada, 12:32:56.993 CEST). Lower panel: voltage on the collector secondary reaches ~145 kV, invisible to REE's SCADA on the 400 kV grid due to the Tap-Lag effect. Source: IIT-ICAI / AELEC.",
          caption_pt: "Oscilograma do disparo raiz (Granada, 12:32:56.993 CEST). Painel inferior: tensão no secundário coletor —fase A atinge ~145 kV— invisível para o SCADA da REE na rede de 400 kV por efeito Tap-Lag. Fonte: IIT-ICAI / AELEC.",
          caption_fr: "Oscillogramme du déclenchement racine (Grenade, 12:32:56.993 CEST). Panneau inférieur : tension au secondaire collecteur —la phase A atteint ~145 kV— invisible pour le SCADA de REE dans le réseau 400 kV en raison de l'effet Tap-Lag. Source : IIT-ICAI / AELEC.",
          caption_it: "Oscillogramma dello scatto radice (Granada, 12:32:56.993 CEST). Pannello inferiore: tensione nel secondario collettore —la fase A raggiunge ~145 kV— invisibile allo SCADA di REE nella rete a 400 kV a causa dell'effetto Tap-Lag. Fonte: IIT-ICAI / AELEC.",
          caption_de: "Oszillogramm der Wurzelauslösung (Granada, 12:32:56.993 CEST). Unteres Feld: Spannung auf der Kollektorsekundärseite —Phase A erreicht ~145 kV— für das SCADA von REE im 400-kV-Netz aufgrund des Tap-Lag-Effekts unsichtbar. Quelle: IIT-ICAI / AELEC."
        },
        {
          src: "/figuras/asimetria_balance_reactiva_sur.png",
          caption_es: "Balance de potencia reactiva a las 12:30 CEST. Déficit neto: −0,6 GVAr. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Reactive power balance at 12:30 CEST. Net deficit: −0.6 GVAr. Source: IIT-ICAI / Compass Lexecon.",
          caption_pt: "Balanço de potência reativa às 12:30 CEST. Déficit líquido: −0,6 GVAr. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_fr: "Bilan de puissance réactive à 12:30 CEST. Déficit net : −0,6 GVAr. Source : IIT-ICAI / Compass Lexecon.",
          caption_it: "Bilancio di potenza reattiva alle 12:30 CEST. Deficit netto: −0,6 GVAr. Fonte: IIT-ICAI / Compass Lexecon.",
          caption_de: "Blindleistungsbilanz um 12:30 CEST. Nettodefizit: −0,6 GVAr. Quelle: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/perdida_sincronismo_frontera.png",
          caption_es: "Intercambio de potencia activa en la frontera España-Francia durante la Fase 3. La oscilación final refleja la divergencia de polos antes de la apertura definitiva. Fuente: ENTSO-E.",
          caption_en: "Active power exchange at the Spain-France border during Phase 3. The final oscillation reflects pole divergence before final opening. Source: ENTSO-E.",
          caption_pt: "Intercâmbio de potência ativa na fronteira Espanha-França durante a Fase 3. A oscilação final reflete a divergência de polos antes da abertura definitiva. Fonte: ENTSO-E.",
          caption_fr: "Échange de puissance active à la frontière Espagne-France pendant la Phase 3. L'oscillation finale reflète la divergence des pôles avant l'ouverture définitive. Source : ENTSO-E.",
          caption_it: "Scambio di potenza attiva sul confine Spagna-Francia durante la Fase 3. L'oscillazione finale riflette la divergenza dei poli prima dell'apertura definitiva. Fonte: ENTSO-E.",
          caption_de: "Wirkleistungsaustausch an der spanisch-französischen Grenze während Phase 3. Die finale Oszillation spiegelt die Poldivergenz vor der endgültigen Öffnung wider. Quelle: ENTSO-E."
        }
      ]
    },
    {
      id: "ch6",
      title_es: "Capítulo 6: Impacto Comunicativo",
      title_en: "Chapter 6: Communicative Impact",
      title_pt: "Capítulo 6: Impacto Comunicativo",
      title_fr: "Chapitre 6 : Impact Communicatif",
      title_it: "Capitolo 6: Impatto Comunicativo",
      title_de: "Kapitel 6: Kommunikative Auswirkungen",
      images: [
        {
          src: "/figuras/collage_conservador.png",
          caption_es: "Cobertura representativa de medios con postura crítica frente a la gestión institucional. Se identifica un patrón de encuadre que reduce el fenómeno multicausal a la relación «mayor penetración renovable → menor estabilidad → apagón». Fuente: elaboración propia.",
          caption_en: "Representative coverage from media critical of institutional management. A framing pattern reduces the multi-causal phenomenon to: «higher renewable penetration → lower stability → blackout». Source: Own elaboration.",
          caption_pt: "Cobertura representativa de meios com postura crítica em relação à gestão institucional. Identifica-se um padrão de enquadramento que reduz o fenômeno multicausal à relação «maior penetração renovável → menor estabilidade → apagão». Fonte: elaboração própria.",
          caption_fr: "Couverture représentative des médias ayant une position critique face à la gestion institutionnelle. On identifie un modèle de cadrage qui réduit le phénomène multicausal à la relation « plus grande pénétration des énergies renouvelables → moindre stabilité → panne de courant ». Source : élaboration propre.",
          caption_it: "Copertura rappresentativa dei media con una posizione critica nei confronti della gestione istituzionale. Si identifica un modello di inquadramento che riduce il fenomeno multicausale alla relazione «maggiore penetrazione rinnovabile → minore stabilità → blackout». Fonte: elaborazione propria.",
          caption_de: "Repräsentative Berichterstattung von Medien mit einer kritischen Haltung gegenüber dem institutionellen Management. Es wird ein Rahmenmuster identifiziert, das das multikausale Phänomen auf die Beziehung «höhere Durchdringung mit erneuerbaren Energien → geringere Stabilität → Stromausfall» reduziert. Quelle: eigene Erarbeitung."
        },
        {
          src: "/figuras/collage_progresista.png",
          caption_es: "Cobertura representativa de medios con postura favorable a la narrativa oficial. La selección de evidencias es simétricamente parcial a la del bloque anterior. Fuente: elaboración propia.",
          caption_en: "Representative coverage from media favorable to the official narrative. The selection of evidence is symmetrically partial compared to the critical block. Source: Own elaboration.",
          caption_pt: "Cobertura representativa de meios com postura favorável à narrativa oficial. A seleção de evidências é simetricamente parcial em relação à do bloco anterior. Fonte: elaboração própria.",
          caption_fr: "Couverture représentative des médias ayant une position favorable à la narration officielle. La sélection des preuves est symétriquement partiale par rapport à celle du bloc précédent. Source : élaboration propre.",
          caption_it: "Copertura rappresentativa dei media con una posizione favorevole alla narrativa ufficiale. La selezione delle prove è simmetricamente parziale rispetto a quella del blocco precedente. Fonte: elaborazione propria.",
          caption_de: "Repräsentative Berichterstattung von Medien mit einer positiven Haltung zum offiziellen Narrativ. Die Auswahl der Belege ist symmetrisch einseitig im Vergleich zum vorherigen Block. Quelle: eigene Erarbeitung."
        },
        {
          src: "/figuras/collage_internacional.png",
          caption_es: "Cobertura internacional del incidente. Los medios internacionales tendieron a un encuadre estructural europeo, con mayor presencia de argumentos de seguridad de infraestructuras críticas. Fuente: elaboración propia.",
          caption_en: "International coverage of the incident. International media leaned toward a structural European framing, emphasizing critical infrastructure security. Source: Own elaboration.",
          caption_pt: "Cobertura internacional do incidente. Os meios internacionais tenderam a um enquadramento estrutural europeu, com maior presença de argumentos de segurança de infraestruturas críticas. Fonte: elaboração própria.",
          caption_fr: "Couverture internationale de l'incident. Les médias internationaux ont eu tendance à adopter un cadrage structurel européen, avec une présence accrue d'arguments liés à la sécurité des infrastructures critiques. Source : élaboration propre.",
          caption_it: "Copertura internazionale dell'incidente. I media internazionali hanno teso verso un inquadramento strutturale europeo, con una maggiore presenza di argomenti sulla sicurezza delle infrastrutture critiche. Fonte: elaborazione propria.",
          caption_de: "Internationale Berichterstattung über den Vorfall. Die internationalen Medien tendierten zu einem europäischen Strukturrahmen mit einer stärkeren Präsenz von Argumenten zur Sicherheit kritischer Infrastrukturen. Quelle: eigene Erarbeitung."
        },
        {
          src: "/figuras/collage_ciudadanos.png",
          caption_es: "Publicaciones ciudadanas durante las primeras horas. Se identifican tres patrones: normalización pragmática y humor, crítica institucional, y búsqueda activa de explicaciones. Fuente: elaboración propia.",
          caption_en: "Citizen publications during the first hours. Three patterns are identified: pragmatic normalizat
... [CONTENIDO TRUNCADO POR TAMAÑO] ...
```

### 📄 Archivo: `src\data\interconnectionData.js`
```js
export const interconnectionData = [
  {
    anio: 2015,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.98,
    exportacion_gwh: 14700,
    importacion_gwh: 14553,
    saldo_neto_gwh: 147,
    potencia_instalada_total_mw: 105657,
    evento: "Nuevo enlace subterráneo España-Francia por el País Vasco (2015)",
    evento_en: "New underground Spain-France link through Basque Country (2015)"
  },
  {
    anio: 2016,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 4.02,
    exportacion_gwh: 16300,
    importacion_gwh: 11700,
    saldo_neto_gwh: 4600,
    potencia_instalada_total_mw: 104557,
    evento: "Saldo exportador récord; alta hidraulicidad",
    evento_en: "Record export balance; high hydro output"
  },
  {
    anio: 2017,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 4.04,
    exportacion_gwh: 12100,
    importacion_gwh: 13800,
    saldo_neto_gwh: -1700,
    potencia_instalada_total_mw: 104040,
    evento: "Sequía; España pasa a ser importador neto",
    evento_en: "Drought; Spain becomes net importer"
  },
  {
    anio: 2018,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 4.03,
    exportacion_gwh: 14300,
    importacion_gwh: 12100,
    saldo_neto_gwh: 2200,
    potencia_instalada_total_mw: 104101,
    evento: "Recuperación de exportaciones; precios altos del CO₂",
    evento_en: "Export recovery; high CO₂ prices"
  },
  {
    anio: 2019,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.82,
    exportacion_gwh: 11800,
    importacion_gwh: 12700,
    saldo_neto_gwh: -900,
    potencia_instalada_total_mw: 110004,
    evento: "Ligero déficit importador; precios moderados",
    evento_en: "Slight import deficit; moderate prices"
  },
  {
    anio: 2020,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.79,
    exportacion_gwh: 10800,
    importacion_gwh: 9300,
    saldo_neto_gwh: 1500,
    potencia_instalada_total_mw: 110825,
    evento: "COVID-19; colapso de demanda y caída de intercambios",
    evento_en: "COVID-19; demand collapse and exchange drop"
  },
  {
    anio: 2021,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.70,
    exportacion_gwh: 16500,
    importacion_gwh: 17200,
    saldo_neto_gwh: -700,
    potencia_instalada_total_mw: 113489,
    evento: "Crisis gasística; fuerte aumento de importaciones desde Francia",
    evento_en: "Gas crisis; sharp increase in imports from France"
  },
  {
    anio: 2022,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.52,
    exportacion_gwh: 28426,
    importacion_gwh: 8585,
    saldo_neto_gwh: 19841,
    potencia_instalada_total_mw: 119449,
    evento: "Saldo exportador récord; 'excepción ibérica' abarata precios frente a Europa",
    evento_en: "Record export balance; 'Iberian exception' lowers prices vs Europe"
  },
  {
    anio: 2023,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.32,
    exportacion_gwh: 25917,
    importacion_gwh: 11979,
    saldo_neto_gwh: 13938,
    potencia_instalada_total_mw: 126424,
    evento: "Tercer año consecutivo de saldo exportador; alta penetración renovable",
    evento_en: "Third consecutive export year; high renewable penetration"
  },
  {
    anio: 2024,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 3.24,
    exportacion_gwh: 26206,
    importacion_gwh: 13202,
    saldo_neto_gwh: 13004,
    potencia_instalada_total_mw: 129459,
    evento: "Saldo exportador de 13.004 GWh (+27,8% interanual)",
    evento_en: "Export balance of 13,004 GWh (+27.8% YoY)"
  },
  {
    anio: 2025,
    capacidad_interconexion_total_mw: 4200,
    capacidad_francia_mw: 2800,
    capacidad_portugal_mw: 1200,
    capacidad_marruecos_mw: 200,
    ratio_interconexion_pct: 2.85,
    exportacion_gwh: 27000,
    importacion_gwh: 11000,
    saldo_neto_gwh: 16000,
    potencia_instalada_total_mw: 147508,
    evento: "Apagón; máxima dependencia de interconexiones para restablecimiento del sistema",
    evento_en: "Blackout; maximum dependency on interconnections for grid restoration"
  }
];

```

### 📄 Archivo: `src\data\timelineData.js`
```js
export const timelineEvents = [
  {
    id: "t1",
    date: "22 de abril de 2025",
    time: "T-6 días",
    title_es: "Eventos Precursores en Núñez de Balboa",
    title_en: "Precursor Events at Núñez de Balboa",
    desc_es: "Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.",
    desc_en: "Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.",
    type: "warning"
  },
  {
    id: "t2",
    date: "28 de abril de 2025",
    time: "12:08 CEST",
    title_es: "Transición de Control en HVDC INELFE-1",
    title_en: "Control Transition in INELFE-1 HVDC",
    desc_es: "Paso de PMODE3 a PMODE1, limitando la capacidad de respuesta dinámica del enlace frente a perturbaciones posteriores.",
    desc_en: "Transition from PMODE3 to PMODE1, limiting the dynamic response capacity of the link against subsequent disturbances.",
    type: "info"
  },
  {
    id: "t3",
    date: "28 de abril de 2025",
    time: "12:30 CEST",
    title_es: "Déficit de Potencia Reactiva (Fase 1)",
    title_en: "Reactive Power Deficit (Phase 1)",
    desc_es: "Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de absorción.",
    desc_en: "Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net absorption deficit.",
    type: "warning"
  },
  {
    id: "t4",
    date: "28 de abril de 2025",
    time: "12:32:00 CEST",
    title_es: "Amplificación Tap-Lag (Fase 2)",
    title_en: "Tap-Lag Amplification (Phase 2)",
    desc_es: "Desacoplamiento entre la red de 400 kV (observada por REE) y las redes colectoras renovables, donde la tensión escala silenciosamente.",
    desc_en: "Decoupling between the 400 kV grid (observed by REE) and renewable collector grids, where voltage scales silently.",
    type: "danger"
  },
  {
    id: "t5",
    date: "28 de abril de 2025",
    time: "12:32:56.993 CEST",
    title_es: "Disparo Raíz en Granada",
    title_en: "Root Trip in Granada",
    desc_es: "El secundario colector alcanza ~145 kV (>1,10 p.u.), desencadenando la primera protección por sobretensión de inversores solares.",
    desc_en: "Collector secondary reaches ~145 kV (>1.10 p.u.), triggering the first overvoltage protection of solar inverters.",
    type: "danger"
  },
  {
    id: "t6",
    date: "28 de abril de 2025",
    time: "12:33:16 CEST",
    title_es: "Inicio de Cascada Geométrica (Fase 3)",
    title_en: "Onset of Geometric Cascade (Phase 3)",
    desc_es: "Propagación masiva de sobretensiones por el sur y oeste peninsular, provocando la desconexión en cadena de plantas fotovoltaicas.",
    desc_en: "Massive propagation of overvoltages through the southern and western peninsula, causing a chain disconnection of PV plants.",
    type: "critical"
  },
  {
    id: "t7",
    date: "28 de abril de 2025",
    time: "12:33:21 CEST",
    title_es: "Pérdida de Sincronismo ES-FR",
    title_en: "Loss of Synchronism ES-FR",
    desc_es: "La oscilación de potencia y la importación de emergencia (>4.600 MW) fuerzan la apertura de la interconexión con Francia.",
    desc_en: "Power oscillation and emergency import (>4,600 MW) force the opening of the interconnection with France.",
    type: "critical"
  },
  {
    id: "t8",
    date: "28 de abril de 2025",
    time: "12:33:24 CEST",
    title_es: "Cero Eléctrico (Blackout)",
    title_en: "System Blackout",
    desc_es: "Pérdida total de 15 GW de generación y caída a 0 Hz. El sistema ibérico se apaga por completo dejando a 60 millones sin suministro.",
    desc_en: "Total loss of 15 GW generation and drop to 0 Hz. The Iberian system completely shuts down, leaving 60 million without supply.",
    type: "critical"
  },
  {
    id: "t9",
    date: "28 de abril de 2025",
    time: "13:00 - 15:00 CEST",
    title_es: "Fragmentación e Intentos Bottom-Up (Fase 4)",
    title_en: "Fragmentation & Bottom-Up Attempts (Phase 4)",
    desc_es: "División en 7 islas eléctricas. Múltiples fracasos de energización autónoma (Black Start) desde centrales hidroeléctricas sin masa síncrona.",
    desc_en: "Division into 7 electrical islands. Multiple failures of autonomous energization (Black Start) from hydro plants without synchronous mass.",
    type: "info"
  },
  {
    id: "t10",
    date: "29 de abril de 2025",
    time: "07:30 CEST",
    title_es: "Reposición Completa de la Demanda",
    title_en: "Full Demand Restoration",
    desc_es: "Tras 19 horas ininterrumpidas de maniobras y conexión escalonada de carga (Top-Down desde FR/MA), se recuperan los 25 GW de demanda perdidos.",
    desc_en: "After 19 uninterrupted hours of maneuvers and staggered load connection (Top-Down from FR/MA), the lost 25 GW of demand is recovered.",
    type: "success"
  }
];

```

### 📄 Archivo: `src\js\zen-mode.js`
```js
if (typeof document !== 'undefined') {
  const applyZen = () => {
    if (localStorage.getItem('zen-mode') === 'true') {
      document.documentElement.classList.add('zen-mode');
    }
  };
  
  // Apply initially
  applyZen();

  // Docusaurus (React Helmet) might remove our class on route changes.
  // Use a MutationObserver to force it back if it's supposed to be active.
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (localStorage.getItem('zen-mode') === 'true' && !document.documentElement.classList.contains('zen-mode')) {
          document.documentElement.classList.add('zen-mode');
        }
      }
    });
  });

  observer.observe(document.documentElement, { attributes: true });

  const translateZenMode = () => {
    const defaultSpan = document.querySelector('.zen-mode-text-default');
    const activeSpan = document.querySelector('.zen-mode-text-active');
    if (!defaultSpan || !activeSpan) return;
    
    const lang = document.documentElement.lang || 'es';
    const dict = {
      'en': { default: 'Full Screen', active: 'Exit Full Screen' },
      'pt': { default: 'Tela Cheia', active: 'Sair da Tela Cheia' },
      'fr': { default: 'Plein Écran', active: 'Quitter Plein Écran' },
      'it': { default: 'Schermo Intero', active: 'Esci Schermo Intero' },
      'de': { default: 'Vollbild', active: 'Vollbild beenden' },
      'es': { default: 'Pantalla Completa', active: 'Volver a modo menú' }
    };
    
    const langKey = lang.split('-')[0];
    const trans = dict[langKey] || dict['es'];
    
    if (defaultSpan.textContent !== trans.default) defaultSpan.textContent = trans.default;
    if (activeSpan.textContent !== trans.active) activeSpan.textContent = trans.active;
  };
  
  // Try to translate on load and when lang attribute changes
  document.addEventListener('DOMContentLoaded', translateZenMode);
  const observerLang = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.attributeName === 'lang') translateZenMode();
    });
  });
  observerLang.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // Handle toggling
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#zen-mode-toggle');
    if (btn) {
      e.preventDefault(); // Prevent any default action
      const isZen = document.documentElement.classList.contains('zen-mode');
      if (isZen) {
        localStorage.setItem('zen-mode', 'false');
        document.documentElement.classList.remove('zen-mode');
      } else {
        localStorage.setItem('zen-mode', 'true');
        document.documentElement.classList.add('zen-mode');
      }
    }
  });
}

```

### 📄 Archivo: `src\simulation\core\types.js`
```js
/**
 * Core domain types and abstractions for the Week 3 Cascade Engine.
 * Prepared in Week 2.5 architecture consolidation.
 */

/**
 * @typedef {Object} TimelineEvent
 * @property {number} id - Unique identifier
 * @property {number} timestamp - Time in seconds relative to T-0
 * @property {string} type - 'generation_loss' | 'line_trip' | 'ufls_activation' | 'protection_trip'
 * @property {string} description - Forensic description of the event
 * @property {Object} metadata - Additional context
 */

/**
 * @typedef {Object} TelemetryFrame
 * @property {number} timestamp - Time in seconds
 * @property {number} systemFrequency - Global or reference frequency in Hz
 * @property {number} globalRocof - Global Rate of Change of Frequency in Hz/s
 * @property {Object.<string, NodeState>} nodes - Map of node IDs to their states
 */

/**
 * @typedef {Object} NodeState
 * @property {string} id - Node identifier (e.g. 'ES-SUR')
 * @property {number} voltage - Voltage in pu (per-unit)
 * @property {number} frequency - Local frequency in Hz
 * @property {number} activePower - Active power injection in MW
 * @property {number} reactivePower - Reactive power injection in MVAr
 * @property {boolean} isConnected - Grid connection status
 */

/**
 * @typedef {Object} CascadeEvent
 * @property {string} sourceNodeId - Where the cascade step originated
 * @property {string[]} affectedNodeIds - Nodes impacted by this step
 * @property {string} mechanism - 'voltage_collapse' | 'overload' | 'angular_instability'
 * @property {number} severity - 1 to 5 scale
 */

```

### 📄 Archivo: `src\simulation\data\normalization.js`
```js
/**
 * Normalization utilities for telemetry data
 */

/**
 * Normalizes absolute timestamps to T-0 relative seconds
 * @param {string|number} timestamp - ISO string or unix epoch
 * @param {string|number} tZero - ISO string or unix epoch of the incident
 * @returns {number} Seconds relative to T-0
 */
export function normalizeTimeToRelative(timestamp, tZero) {
  const t1 = new Date(timestamp).getTime();
  const t0 = new Date(tZero).getTime();
  return (t1 - t0) / 1000;
}

/**
 * Safely computes ROCOF given two frequency points and a time delta
 * @param {number} f1 - Initial frequency
 * @param {number} f2 - Final frequency
 * @param {number} dt - Time delta in seconds
 * @returns {number} Rate of Change of Frequency in Hz/s
 */
export function computeRocof(f1, f2, dt) {
  if (dt === 0) return 0;
  return (f2 - f1) / dt;
}

/**
 * Normalizes a node's voltage to per-unit (pu) given its base voltage
 * @param {number} voltageKV - Actual voltage in kV
 * @param {number} baseKV - Base voltage in kV (e.g., 400, 220)
 * @returns {number} Per-unit voltage
 */
export function normalizeVoltagePU(voltageKV, baseKV) {
  if (baseKV === 0) return 0;
  return voltageKV / baseKV;
}

```

### 📄 Archivo: `src\simulation\hooks\useReplayClock.js`
```js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight hook to manage the simulation replay clock.
 * 
 * @param {Object} options
 * @param {number} options.startTime - Initial time in seconds
 * @param {number} options.endTime - End time in seconds
 * @param {number} options.playbackRate - Real-time multiplier (default: 1)
 */
export function useReplayClock({ startTime = -1800, endTime = 60, playbackRate = 1 } = {}) {
  const [currentTime, setCurrentTime] = useState(startTime);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  
  const toggle = useCallback(() => {
    setIsPlaying(prev => {
      // If we're at the end and they press play, restart
      if (!prev && currentTime >= endTime) {
        setCurrentTime(startTime);
        return true;
      }
      return !prev;
    });
  }, [currentTime, endTime, startTime]);

  const scrub = useCallback((time) => {
    setCurrentTime(Math.max(startTime, Math.min(time, endTime)));
  }, [startTime, endTime]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const nextTime = prev + playbackRate;
        if (nextTime >= endTime) {
          setIsPlaying(false);
          return endTime;
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, endTime, playbackRate]);

  return {
    currentTime,
    isPlaying,
    play,
    pause,
    toggle,
    scrub,
    progress: (currentTime - startTime) / (endTime - startTime)
  };
}

```

### 📄 Archivo: `src\theme\DocRoot\index.js`
```js
import React from 'react';
import { useLocation } from '@docusaurus/router';
import { AnimatePresence, motion } from 'framer-motion';
import DocRoot from '@theme-original/DocRoot';
import styles from './styles.module.css';

const variants = {
  initial: {
    opacity: 0,
    filter: 'blur(8px)',
  },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    filter: 'blur(12px)',
    clipPath: [
      'inset(0 0 0 0)',
      'inset(15% 0 70% 0)',
      'inset(35% 0 45% 0)',
      'inset(5% 0 80% 0)',
      'inset(0 0 100% 0)',
    ],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
      times: [0, 0.2, 0.4, 0.6, 1],
    },
  },
};

export default function DocRootWrapper(props) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={styles.pageWrapper}
      >
        <div className={styles.scanlinesOverlay} />
        <DocRoot {...props} />
      </motion.div>
    </AnimatePresence>
  );
}

```

### 📄 Archivo: `src\theme\DocRoot\styles.module.css`
```css
.pageWrapper {
  position: relative;
  background: #0a0a0a;
  min-height: 100vh;
}

.scanlinesOverlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: 0.12;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(0, 255, 224, 0.03) 2px,
    rgba(0, 255, 224, 0.03) 4px
  );
  mix-blend-mode: overlay;
}

```

### 📄 Archivo: `src\theme\Layout\index.js`
```js
import React from 'react';
import OriginalLayout from '@theme-original/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

function CursorComponent() {
  const AnimatedCursor = require('react-animated-cursor');
  // En v2.6.0 puede ser exportado directamente o tener un .default
  const Cursor = AnimatedCursor.default || AnimatedCursor;
  return (
    <div className="custom-cursor-wrapper">
      <Cursor
        innerSize={6}
        outerSize={36}
        color="0, 229, 255"
        outerAlpha={0.15}
        innerScale={0.6}
        outerScale={2.2}
        trailingSpeed={5}
        outerStyle={{
          border: '1px solid rgba(0,229,255,0.5)',
          mixBlendMode: 'screen',
          boxShadow: '0 0 24px rgba(0,229,255,0.4)',
        }}
        clickables={['a', 'button', '.chart-card', ':is(input,textarea,select)', '.clickable', '.menu__link', '.pagination-nav__link']}
      />
    </div>
  );
}

export default function Layout(props) {
  return (
    <>
      <BrowserOnly>
        {() => <CursorComponent />}
      </BrowserOnly>
      <OriginalLayout {...props} />
    </>
  );
}

```

### 📄 Archivo: `src\theme\MDXComponents.js`
```js
import React from 'react';
// Import original MDX components
import MDXComponents from '@theme-original/MDXComponents';
import ChartCard from '@site/src/components/ChartCard';
import GlitchTitle from '@site/src/components/GlitchTitle';
import ForensicReveal from '@site/src/components/ForensicReveal';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Add our custom components globally so we don't have to import them in every .mdx
  ChartCard,
  GlitchTitle,
  ForensicReveal,
};

```

### 📄 Archivo: `src\theme\Root.js`
```js
import React, { useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useLocation } from '@docusaurus/router';

function SmoothScrollRoot({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Reset scroll to top on navigation to fix Next Chapter bug,
    // ONLY if there is no hash anchor in the URL (e.g. Glossary links)
    if (!hash) {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  useEffect(() => {
    // Solo cargamos Lenis en cliente
    const initLenis = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      try {
        const Lenis = (await import('lenis')).default;
        // Import CSS directly since we are in webpack
        await import('lenis/dist/lenis.css');
        
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        window.lenis = lenis;
        
        function raf(t) { 
          lenis.raf(t); 
          requestAnimationFrame(raf); 
        }
        
        requestAnimationFrame(raf);
        
        return () => {
          lenis.destroy();
          delete window.lenis;
        };
      } catch (e) {
        console.warn('Lenis failed to load', e);
      }
    };
    
    initLenis();

    // Workaround para prevenir que Lenis secuestre el scroll de la barra lateral (sidebar)
    // Docusaurus no permite añadir atributos fácilmente sin hacer swizzle completo,
    // así que lo inyectamos dinámicamente.
    const applyLenisPrevent = () => {
      const sidebars = document.querySelectorAll('.theme-doc-sidebar-menu, aside, .menu');
      sidebars.forEach(el => {
        if (!el.hasAttribute('data-lenis-prevent')) {
          el.setAttribute('data-lenis-prevent', 'true');
        }
      });
    };

    applyLenisPrevent();
    const observer = new MutationObserver(applyLenisPrevent);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

export default function Root({ children }) {
  return (
    <>
      <BrowserOnly fallback={<>{children}</>}>
        {() => {
          const CustomCursor = require('@site/src/components/CustomCursor').default;
          return (
            <SmoothScrollRoot>
              <CustomCursor />
              {children}
            </SmoothScrollRoot>
          );
        }}
      </BrowserOnly>
    </>
  );
}

```

## 📂 COMPONENTE: CHAPTERS & CONTENT (MDX)

### 📄 Archivo: `docs\01-introduccion.mdx`
```mdx
---
sidebar_position: 1
hide_title: true
title: "Introducción"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";

<GlitchTitle>Introducción</GlitchTitle>

El 28 de abril de 2025, el sistema síncrono ibérico sufrió un colapso de tensión que destruyó más de **15 GW de generación en cuestión de segundos** y dejó sin suministro eléctrico a cerca de **60 millones de personas**. Por magnitud y velocidad de propagación, el episodio no tiene precedentes en el sistema europeo continental de las últimas décadas. Este trabajo no es una reconstrucción cronológica del evento: es un análisis crítico y comparativo de las narrativas técnicas, regulatorias y operativas que han competido por explicarlo.

## Objeto y alcance

El colapso —caracterizado por una cascada de desconexiones asociadas a fenómenos de sobretensión en un contexto de elevada penetración de <GlossaryLink term="IBR">Recursos Basados en Inversores (*IBR*</GlossaryLink>)—
ha generado un profundo desacuerdo interpretativo sobre sus causas raíz y la
asignación de responsabilidades. La investigación examina tres visiones
institucionales predominantes:

**Visión de la Administración (Gobierno / <GlossaryLink term="REE">Redeia</GlossaryLink>).** El informe del Comité de Análisis del Consejo de Seguridad Nacional interpreta el colapso desde la óptica del cumplimiento normativo. Su tesis atribuye el agravamiento del evento a un déficit de absorción de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> inductiva que impidió contener la escalada de tensión, en contravención de los
requerimientos del Procedimiento de Operación P.O. 7.4.

**Visión del sector generador (Informe ICAI / AELEC).** El análisis pericial del IIT-ICAI y Compass Lexecon desplaza la responsabilidad hacia decisiones operativas concretas de Redeia. La tesis central cuestiona la maniobra de <GlossaryLink term="Mallado">mallado (*meshing*</GlossaryLink>) ejecutada por el
operador, argumentando que incrementó la contribución capacitiva de la red en un
escenario de baja fortaleza síncrona y generó un pulso de sobretensión
amplificado por las limitaciones de observabilidad sobre la red de 220 kV
—fenómeno denominado <GlossaryLink term="Tap-Lag">Tap-Lag</GlossaryLink>.

**Visión del gestor europeo (<GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>).** El informe factual de ENTSO-E adopta una perspectiva de área síncrona continental: analiza la propagación de <GlossaryLink term="Oscilaciones electromecánicas">oscilaciones inter-área</GlossaryLink> y cuestiona la suficiencia del <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink> frente a
fenómenos dinámicos ultrarrápidos propios de sistemas dominados por electrónica
de potencia.

![Replicación de la secuencia del colapso](/figuras/albustami_ieee39_secuencia.png) _Secuencia del colapso del 28-A mostrando la interacción entre Acciones del Operador (OA) y Acciones Automáticas de protección (AA). Fuente: Albustami et al., 2025._

El alcance del trabajo se articula sobre el contraste de estas tres narrativas con los _Network Codes_ europeos —en particular el <GlossaryLink term="NC RfG">Reglamento RfG</GlossaryLink>— y con los principios
modernos de <GlossaryLink term="Estabilidad de tensión">estabilidad de tensión</GlossaryLink> en sistemas dominados por inversores, con el propósito de identificar lecciones
estructurales, limitaciones metodológicas y vacíos regulatorios que condicionan
la resiliencia del sistema eléctrico europeo en la transición hacia la
descarbonización.

## La vulnerabilidad estructural del sistema ibérico

La transición energética ha alterado de forma profunda la dinámica del sistema peninsular. La sustitución acelerada de centrales síncronas por IBR reduce las masas rotatorias acopladas a la red y, con ellas, dos parámetros críticos de forma simultánea: la <GlossaryLink term="Inercia (H)">inercia del sistema (*H*</GlossaryLink>) —que
cayó a valores zonales de entre **1,3 s y 1,8 s** en el sur peninsular, por
debajo del umbral de 2 s que la literatura técnica asocia con márgenes dinámicos
comprometidos— y la potencia de cortocircuito disponible en los nudos. Esta
doble merma no afecta únicamente al eje frecuencia–potencia activa: erosiona de
forma crítica la capacidad del sistema para absorber dinámicamente potencia
reactiva y sostener la tensión ante transitorios rápidos, que es precisamente el
eje sobre el que se articuló el colapso.

![Metamorfosis electromecánica del sistema de potencia](/figuras/futured_grid_evolution.png) _El desplazamiento de grandes masas rotatorias por recursos IBR reduce drásticamente la inercia total del sistema. Fuente: FutuRed, 2024._

La mañana del incidente, el sistema operaba con un **82 % de penetración renovable no síncrona** en condiciones de demanda valle. Para equilibrar la generación, Redeia desacopló la práctica totalidad de los grupos térmicos disponibles, llevando el número de generadores síncronos a mínimos históricos. El parque IBR operaba prácticamente en su totalidad en modo <GlossaryLink term="GFL (Grid-Following)">grid-following</GlossaryLink>:
inversores que necesitan una tensión y frecuencia externas estables como
referencia de sincronismo. Al desaparecer los grupos síncronos, el sistema
perdió su principal mecanismo de absorción dinámica de potencia reactiva y, con
él, el amortiguamiento natural frente a transitorios de tensión.

A esta fragilidad interna se añade el aislamiento estructural de la Península Ibérica. Con una capacidad de interconexión transfronteriza del **7,9 %** sobre la demanda punta —muy por debajo de los objetivos comunitarios—, el sistema ibérico no puede importar estabilidad dinámica desde el núcleo continental en situaciones de emergencia. La confluencia de baja fortaleza síncrona y aislamiento relativo de red configuró la vulnerabilidad que hizo imposible frenar la cascada de sobretensiones a las **12:33:24 CEST**.

<ForensicTable 
  title="GRID INTERCONNECTION SNAPSHOT"
  source="MIT CEEPR / EUROPEAN COMMISSION"
  confidence="HIGH"
>
| Estado Miembro       | Interconexión / Demanda punta (%) |
| -------------------- | --------------------------------- |
| **Iberia (ES + PT)** | **7,9**                           |
| Francia              | ~14                               |
| Alemania             | ~17                               |
| Objetivo UE 2030     | 15                                |

</ForensicTable>
_Tabla: Nivel de interconexión eléctrica nominal frente a demanda punta (selección). Fuente: MIT CEEPR / Comisión Europea, 2025._

## Metodología: triangulación forense y validación cruzada

La investigación adopta un enfoque de análisis forense comparativo, estructurado en tres fases:

**1. Compilación de fuentes primarias.** Estudio sistemático de los informes periciales oficiales, sustentados en el procesamiento de más de **170 GB de registros técnicos** del Operador del Sistema, incluyendo telemedidas del <GlossaryLink term="SCADA (Supervisory Control and Data Acquisition)">SCADA</GlossaryLink> y registros oscilográficos.

**2. Triangulación de narrativas.** Contraste sistemático de la tesis de la Administración frente al análisis pericial del sector generador en torno a los dos ejes de desacuerdo principal: la gestión de la maniobra de mallado y la inobservabilidad de la red de 220 kV.

**3. Validación técnica cruzada.** Cotejo de las secuencias cronológicas con el análisis independiente del NREL sobre oscilaciones inter-área, obtenido a partir de registros de <GlossaryLink term="PMU (Phasor Measurement Unit)">Unidades de Medición Fasorial (*PMU*</GlossaryLink>) de cobertura continental —datos cuya independencia institucional permite
arbitrar entre versiones divergentes.

![Localización topológica de las PMU en el sistema síncrono europeo](/figuras/pmu_sensors_europe.png) _La densidad de cobertura de las PMU fue determinante para la verificación independiente de las oscilaciones inter-área. Fuente: NREL._

Los modelos de lenguaje de gran escala se han empleado como herramienta de asistencia documental —clasificación, síntesis y extracción de datos críticos— dado el volumen excepcional de documentación técnica generada tras el incidente. Su aplicación se ha circunscrito estrictamente a la organización documental: presentan limitaciones conocidas ante fenómenos de dinámica rápida como el mecanismo del _Tap-Lag_ o la paradoja del <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink>. La
comparación técnica, la evaluación de causalidad y las conclusiones del trabajo
son responsabilidad exclusiva del criterio del autor.

```

### 📄 Archivo: `docs\02-contexto.mdx`
```mdx
---
sidebar_position: 2
hide_title: true
title: "Contexto Técnico"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import EnergyTransitionStreamgraph from "@site/src/components/EnergyTransitionStreamgraph";

<GlitchTitle>Contexto Técnico</GlitchTitle>

:::note Nota sobre la cronología del incidente
A lo largo de este capítulo se hace referencia a las cinco fases en que el Comité de Análisis del Consejo de Seguridad Nacional estructuró el incidente: **Fase 0** (días previos y mañana del 28-A, inestabilidad latente de tensiones); **Fase 1** (12:00–12:30 CEST, oscilaciones electromecánicas previas al disparo raíz); **Fase 2** (12:32:00–12:33:18 CEST, primeras pérdidas de generación por sobretensión); **Fase 3** (12:33:18–12:33:30 CEST, cascada de desconexiones hasta el cero de tensión); **Fase 4** (a partir de las 12:33:30 CEST, reposición progresiva del suministro). La cronología detallada se desarrolla en los capítulos 4 y 5.
:::

## Evolución del parque generador: de la generación síncrona al mix dominado por IBR

A pesar de que la demanda máxima de electricidad en España lleva más de una década en estancamiento estructural, el parque de generación ha experimentado una transformación profunda. Si en 2010 las fuentes térmicas y nucleares representaban el **65 % de la producción**, en 2024 las renovables habían invertido esa proporción, alcanzando el **59 % del mix total**.

![Evolución macroscópica del mix de generación en España (2010 vs. 2024)](/figuras/mix_comparativo_2010_2024.png) _Evolución del mix de generación en España: 2010 frente a 2024. Fuente: Centro Peter Huber / ESIOS._

En el primer cuatrimestre de 2025, el sistema peninsular consolidó este escenario superando los **100 GW de capacidad renovable instalada**. A enero de 2025, casi el 66 % de la capacidad total procedía de fuentes descarbonizadas, con energía eólica y solar fotovoltaica en paridad técnica (24,9 % cada una). Incluyendo el autoconsumo distribuido, la cuota fotovoltaica global ascendía a más de **48,1 GW**, frente a los **33,1 GW** eólicos.

![Desglose de la capacidad de generación instalada a enero de 2025](/figuras/capacidad_instalada_2025.png) _Capacidad de generación instalada en el sistema español a 31 de enero de 2025. Fuente: NREL / Red Eléctrica._

Como contrapartida, la generación síncrona convencional ha sido progresivamente desplazada: el carbón ocupa un papel residual (**1,6 %** de la capacidad instalada), el nuclear (**5,5 %**) afronta un calendario de cierre progresivo, y los más de **26 GW de ciclo combinado de gas** (**20,4 %**) operan con factores de utilización inferiores al 15 % anuales.

Desde la perspectiva de la ingeniería de sistemas de potencia, esta transformación plantea retos operativos estructurales. La estabilidad histórica de las redes descansaba en los generadores síncronos —térmicos, nucleares e hidráulicos— cuyas masas rotativas aportaban energía cinética inmediata, <GlossaryLink term="Inercia (H)">inercia física</GlossaryLink> y elevadas corrientes de cortocircuito ante cualquier perturbación. Las nuevas instalaciones solares y eólicas se conectan mediante <GlossaryLink term="IBR">inversores (_IBR_</GlossaryLink>), que operan en modo estándar como seguidores de red (<GlossaryLink term="GFL (Grid-Following)">grid-following</GlossaryLink>): sincronizan su exportación con la tensión y frecuencia externas a través de algoritmos <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink> y, al carecer de masas rotativas, no aportan inercia síncrona ni responden intrínsecamente a las fluctuaciones de la red. El resultado es que el sistema ibérico opera de forma rutinaria con baja capacidad de cortocircuito, elevada impedancia nodal y una <GlossaryLink term="Tasa de Cambio de Frecuencia (RoCoF)">RoCoF</GlossaryLink> amplificada ante cualquier desequilibrio de <GlossaryLink term="Potencia activa">potencia activa</GlossaryLink>.

## Descarbonización e implicaciones operativas

El éxito ambiental de la transición energética ibérica es indiscutible. Las emisiones del sector eléctrico alcanzaron su máximo histórico en torno a los **110 MtCO₂-eq** en 2007; al cierre de 2024, coincidiendo con el récord histórico de generación renovable (**56,8 %**), se redujeron hasta los **27,0 millones de toneladas de CO₂-eq** — un descenso del **75,7 %** respecto al pico. El factor de emisión cayó desde los 290 gCO₂/kWh de 2015 hasta valores próximos a los 80–100 gCO₂/kWh en 2024.

<EnergyTransitionStreamgraph />

La contrapartida operativa es la que esta investigación examina: la sustitución de centrales térmicas por fuentes renovables conectadas a través de inversores conlleva la retirada progresiva de las masas síncronas que aportaban inercia, <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> dinámica y control de tensión. El sistema ibérico opera habitualmente en regímenes de baja inercia y reducida robustez nodal — condiciones cuya relación con la inestabilidad de tensión del 28-A se analiza en el Capítulo 4.

## Estado operativo previo al incidente: la paradoja de la abundancia

En los días previos al apagón, el sistema peninsular operó bajo lo que la literatura técnica ha denominado la **«paradoja de la abundancia»**. Las temperaturas primaverales inusualmente suaves (~25 °C) y el calendario festivo deprimieron la curva de demanda: a las 12:30 CEST, escasos minutos antes del colapso, la demanda instantánea se situaba en **25.184 MW** — el **56 % de la demanda punta histórica**.

Este escenario de demanda valle coincidió con una excepcional disponibilidad de recurso renovable, de modo que la generación no síncrona cubría el **82 % del mix instantáneo**: aproximadamente **18.000 MW** de solar fotovoltaica (**53 %**) y **3.500 MW** de eólica (**11 %**). Para equilibrar el excedente de potencia activa, el sistema recurrió simultáneamente al bombeo hidráulico (~3.000 MW) y a la exportación neta hacia Francia, Portugal y Marruecos. La generación síncrona convencional quedó desplazada a mínimos históricos: nuclear al **10 %** (3,4 GW) y ciclos combinados de gas a un exiguo **3 %** (~1.600 MW).

![Perfil de generación del sistema peninsular el 28 de abril de 2025](/figuras/ree_generation_mix_28april.png) _Perfil de generación del 28-A: el valle de demanda coincidió con el pico de producción fotovoltaica, desplazando la generación síncrona a mínimos históricos. Fuente: NREL / Red Eléctrica._

Esta reducción de masas rotatorias se tradujo en valores de inercia síncrona excepcionalmente bajos: **1,3 s** en el área Sur y **1,84 s** en el área Centro — ambos por debajo del umbral de 2 s recomendado por <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>. La operación prolongada en estas condiciones ya había producido señales de estrés dinámico los días **16, 22 y 24 de abril**, con episodios de inestabilidad de tensión en la red de transporte.

![Oscilaciones de tensión en la subestación de Núñez de Balboa, 22 de abril de 2025](/figuras/precursor_overvoltage_22april.png) _Oscilaciones de tensión registradas en Núñez de Balboa (400 kV) durante el episodio precursor del 22 de abril. Varias instalaciones que dispararon el 28-A ya habían sufrido disparos idénticos en este evento previo. Fuente: IIT-ICAI / Compass Lexecon._

El episodio más severo ocurrió el **22 de abril a las ~19:00 h**: un pico de sobretensión superior a **430 kV** activó las protecciones y desconectó múltiples plantas fotovoltaicas y eólicas. El hecho de que varias de las instalaciones que dispararon en los primeros segundos del 28-A ya hubiesen sufrido disparos idénticos en este evento previo es interpretado por el informe ICAI como evidencia de que el sistema operaba con sus márgenes de control dinámico de tensión **estructuralmente estrechos**.

## Capacidad de interconexión: la isla energética ibérica

### La condición estructural de isla

La península ibérica opera bajo la condición de **«isla energética»** dentro del área síncrona de Europa Continental. Su capacidad de intercambio con Francia se sitúa históricamente entre el **3 % y el 5 %** de la capacidad de generación instalada —o un **7,9 %** medido frente a la demanda punta—, muy por debajo del objetivo vinculante del **15 %** fijado por la UE para 2030. Esta limitación condiciona la seguridad del suministro de dos formas: las perturbaciones originadas en el centro de inercia europeo se amplifican al propagarse hacia la periferia ibérica (**efecto látigo**), y ante una pérdida masiva de generación, el cuello de botella de las interconexiones limita físicamente el soporte dinámico importable desde los grandes alternadores centroeuropeos.

### NTC comercial frente a flujo físico

Es indispensable distinguir entre los límites comerciales y los flujos físicos reales. Los intercambios de mercado se rigen por la Capacidad Neta de Transferencia (NTC), pactada _ex ante_ entre <GlossaryLink term="REE">REE</GlossaryLink> y RTE. Sin embargo, en regímenes transitorios rápidos, los flujos de potencia activa y reactiva obedecen las Leyes de Kirchhoff con independencia del programa de mercado. Forzar un flujo físico por encima del límite de estabilidad angular —típicamente 90° de diferencia entre extremos— no incrementa la potencia transferida, sino que provoca una divergencia de polos y la consiguiente pérdida de <GlossaryLink term="Sincronismo">sincronismo</GlossaryLink>: mecanismo que se materializó el 28-A a las **12:33:21 CEST**.

![Desviación entre programa comercial NTC y flujo físico en la frontera ES-FR](/figuras/entsoe_flow_deviation.png) _Desviación entre el programa de intercambio comercial (NTC) y el flujo de potencia físico real en la frontera España-Francia durante la mañana del 28-A. Fuente: Informe Factual ENTSO-E._

### El enlace HVDC INELFE-1 y la decisión crítica de modo de control

La interconexión con Francia combina líneas AC transpirenaicas con el enlace subterráneo <GlossaryLink term="HVDC">HVDC VSC</GlossaryLink> INELFE-1 (Santa Llogaia–Baixas, **2.000 MW** nominales). Este enlace admite tres modos operativos relevantes: **PMODE1** (potencia constante, sin respuesta dinámica a la red), **PMODE2** (modulación de potencia por desvío de frecuencia) y **PMODE3** (emulación AC, responde a la diferencia angular entre extremos).

Durante los prolegómenos del apagón, INELFE-1 operaba en **PMODE3**. Sin embargo, a las **12:08 CEST**, para amortiguar las oscilaciones de 0,6 Hz detectadas, el modo se cambió a **PMODE1**, fijando una exportación de **1.000 MW** hacia Francia. Las consecuencias fueron determinantes: en el momento del colapso, las líneas AC transpirenaicas intentaron importar hasta **4.609 MW** de emergencia desde Francia, mientras el enlace HVDC —fijado en PMODE1— continuó extrayendo 1.000 MW del sistema ibérico al carecer de un bucle de control de frecuencia que pudiese invertir el sentido del flujo. El soporte efectivo desde el sistema francés quedó así reducido respecto al máximo teórico disponible. A las **12:33:21 CEST**, las líneas AC abrieron por pérdida de sincronismo, aislando totalmente la península del sistema continental.

![Cambio del modo de control en el enlace HVDC INELFE-1](/figuras/hvdc_control_transition.png) _Transición PMODE3 → PMODE1 a las 12:08 CEST en el enlace HVDC INELFE-1. La decisión limitó la capacidad de respuesta dinámica del enlace ante la cascada posterior. Fuente: IIT-ICAI / AELEC._

### Frontera sur: Marruecos y el arranque autónomo

La conexión con Marruecos (cables submarinos AC, **900 MW** técnicos) aportaba **314 MW** de importación momentos antes del colapso. A las **12:33:20 CEST**, los relés de subfrecuencia del operador marroquí dispararon al alcanzarse el umbral de **49,5 Hz**, desconectando el enlace para proteger su red. Esta desconexión, aunque protectora para Marruecos, tuvo consecuencias relevantes en la reposición: la inyección de tensión desde el sur proporcionó horas más tarde la referencia necesaria para iniciar las estrategias de <GlossaryLink term="Black Start">Black Start</GlossaryLink> de los ciclos combinados de Andalucía.

## El sistema de alerta europeo (EAS) y la «falsa normalidad»

### Clasificación de estados operativos (SO GL)

Las <GlossaryLink term="SO GL (System Operation Guidelines)">System Operation Guidelines</GlossaryLink> de ENTSO-E establecen cinco niveles de severidad progresiva: **Normal** (cumplimiento del <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink>), **Alerta** (degradación de márgenes que exige acciones preventivas), **Emergencia** (violación de límites de seguridad o activación de <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink>), **Apagón** y **Restauración**.

### La transición abrupta Normal → Blackout

El análisis de los registros del <GlossaryLink term="EAS (ENTSO-E Awareness System)">EAS</GlossaryLink> revela una disonancia crítica entre la dinámica real de la red ibérica y su representación en la plataforma europea. Durante la mañana del 28-A, el sistema sufrió al menos dos oscilaciones significativas: una oscilación forzada de **0,6 Hz** a las **12:03 CEST** y un modo inter-área de **0,2 Hz** a las **12:19 CEST**. A pesar de ello, ni REE ni REN declararon el estado de Alerta. A las **12:32:00 CEST**, el estado oficial seguía siendo «Normal». Los registros confirman que el sistema transitó abruptamente de **Normal** a **Blackout** (criterio OB3) a las **12:33:29 CEST**, sin haber pasado por ninguna fase intermedia.

Esta ausencia de escalada generó visibilidad limitada hacia los operadores vecinos. El operador francés (RTE) no recibió señales de vulnerabilidad dinámica al sur de los Pirineos; al permanecer el EAS en estado «Normal», no se activaron protocolos de cooperación transfronteriza ni se preparó la red francesa para el transitorio que afectó a la frontera a las 12:33:21 CEST. El episodio pone de manifiesto que el EAS actuó no como herramienta de alerta temprana, sino como **notificador _post mortem_** del colapso — una limitación estructural del sistema europeo de monitorización para capturar la dinámica rápida de tensión en redes de baja inercia, y una de las lecciones regulatorias centrales del incidente.

![Evolución de la frecuencia y la tensión en la subestación de Carmona (400 kV)](/figuras/frequency_voltage_carmona.png) _Frecuencia y tensión en los segundos críticos del incidente. Subestación de Carmona (400 kV). La transición abrupta Normal → Blackout queda registrada en la caída simultánea de ambas variables. Fuente: ENTSO-E / REE._

```

### 📄 Archivo: `docs\03-analisis-incidente.mdx`
```mdx
---
sidebar_position: 3
hide_title: true
sidebar_label: "Análisis del incidente"
title: "Análisis del incidente"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import BrowserOnly from '@docusaurus/BrowserOnly';

<GlitchTitle>Análisis del Incidente</GlitchTitle>

El cero de tensión del 28 de abril no fue un evento instantáneo: <ForensicReveal>fue la culminación de una degradación progresiva y mensurable de la estabilidad estática y dinámica de la red.</ForensicReveal> La reconstrucción forense de las cuatro fases del colapso —desde las oscilaciones de la mañana hasta el aislamiento definitivo de la península a las 12:33:29 CEST— permite identificar con precisión los mecanismos físicos que ningún automatismo de protección convencional pudo detener.

## Fase 0: la red debilitada y la maniobra de mallado

La mañana del 28-A, el sistema operaba sobre una topología extremadamente débil. Con la demanda en mínimos, el **35,8 % de la red de 400 kV en la zona sur** y el **34,3 % en la zona centro** permanecían desconectadas, configurando un escenario de alta impedancia de transferencia. Sobre esta red, la dinámica del sistema se manifestó en forma de <GlossaryLink term="Oscilaciones electromecánicas">oscilaciones electromecánicas</GlossaryLink> con dos modos diferenciados:

- **12:03 CEST** — Oscilación forzada de **0,6 Hz**, amplitud 70 mHz, que tardó 4 minutos y 42 segundos en amortiguarse.
- **12:19 CEST** — Modo inter-área de **0,2 Hz** Este-Centro-Oeste: la península ibérica comenzó a oscilar en contrafase respecto al continente, tensando los enlaces pirenáicos.

Durante ambos transitorios, el <GlossaryLink term="Damping ratio">ratio de amortiguamiento</GlossaryLink> se desplomó a valores cercanos al **1 %**, muy por debajo del umbral mínimo del **5 %** exigido por el P.O. 13.1. Este comportamiento no era inédito: episodios análogos los días 16, 22 y 24 de abril habían sido tratados como incidencias aisladas en lugar de síntomas de una degradación sistémica.

![Oscilaciones y Sobretensiones en Núñez de Balboa](/figuras/nunez_balboa_precursores.png) _Tensiones registradas en Núñez de Balboa 400 kV durante los eventos precursores y el 28-A La sucesión de picos de sobretensión evidencia el estrechamiento progresivo de los márgenes de control de potencia reactiva. Fuente: IIT-ICAI._

Para contener estas oscilaciones, REE ejecutó una maniobra de <GlossaryLink term="Mallado">mallado</GlossaryLink>: entre las 12:03 y las 12:30 CEST reconectó **11 líneas de 400 kV** que permanecían abiertas por la baja demanda. La maniobra logró su objetivo inmediato —reducir la impedancia y frenar el latigazo de las oscilaciones— pero introdujo, según el informe IIT-ICAI, un efecto secundario relevante: por el <GlossaryLink term="Efecto Ferranti">Efecto Ferranti</GlossaryLink>, las líneas reconectadas en vacío inyectaron abruptamente potencia reactiva capacitiva en una red que ya carecía de margen de absorción. La cuantificación de esta inyección es uno de los ejes de la disputa técnica: el informe ICAI la cifra en hasta **2,4 GVAr**; el análisis independiente del NREL adopta una estimación más conservadora de **1.050 MVAr**. Ambas cifras coinciden en señalar que la inyección superó la capacidad de absorción residual del sistema, estimada en ese momento en apenas **3,3 GVAr** frente a los 5,8 GVAr habituales.

Las simulaciones periciales del IIT-ICAI estiman que, tras el mallado, la distancia al punto de colapso en el nudo de Carmona 400 kV se contrajo de un margen de **2.964 MW** a **1.268 MW** — una reducción del **57 %** que acercó el sistema al umbral de saturación capacitiva.

![Captura Oscilográfica WAMS (0.6 Hz)](/figuras/wams_oscilaciones_carmona.png) _Registro del WAMS capturando la oscilación electromecánica de 0,6 Hz en Carmona (Sevilla) a las 12:03 CEST. Los sistemas WAMS permiten observar la dinámica continental con resolución de milisegundos. Fuente: ENTSO-E / REE._

## Fase 1: pérdida de amortiguamiento y disparo raíz (12:32:57 CEST)

La naturaleza del primer transitorio —la oscilación de 0,6 Hz de las 12:03 CEST— es objeto de controversia técnica directa. REE la clasifica como una oscilación forzada originada en el lazo de control de una planta fotovoltaica en Badajoz. El informe ICAI argumenta, en cambio, que se trató de un modo natural inter-área exacerbado por un ratio de amortiguamiento sistémico del **1 %**, cuyo origen vincula a la ausencia de Estabilizadores del Sistema de Potencia (PSS) en los ciclos combinados andaluces que permanecían apagados.

![Evolución de la frecuencia del sistema durante la Fase 1. Análisis NREL](/figuras/timeline_frecuencia_nrel.png) _La frecuencia cae de 50.00 Hz a 48.30 Hz entre t=0 y t=11 s, cruzando los umbrales de deslastre automático (49.0 Hz) y disparo de generación (48.5 Hz). Fuente: Red Eléctrica de España (ENTSO-E open data)._

La inestabilidad se intensificó a las **12:19 CEST** con el modo de **0,2 Hz**, confirmado por telemetría fasorial europea como el modo natural Este-Centro-Oeste del área síncrona: la reducida masa rotatoria ibérica oscilaba en contrafase respecto al centro de inercia europeo, materializando el efecto látigo descrito en el Capítulo 2.

El punto de no retorno se alcanzó a las **12:32:57 CEST**. Un transformador de 400/220 kV en una subestación colectora de la provincia de **Granada** se desconectó por actuación de sus protecciones de sobretensión, al detectarse en el secundario de 220 kV un valor de aproximadamente **244 kV**, excediendo el umbral dieléctrico de seguridad. La magnitud del impacto no residió en los 355 MW de <GlossaryLink term="Potencia activa">potencia activa</GlossaryLink> perdidos —una cifra manejable para el sistema—, sino en <ForensicReveal>la pérdida instantánea e irrecuperable de 165 MVAr de capacidad de absorción</ForensicReveal> de potencia reactiva inductiva. En un sistema saturado de reactiva capacitiva y con márgenes <GlossaryLink term="Colapso Q-V">Q-V</GlossaryLink> reducidos, la desaparición de este sumidero provocó un escalón ascendente de tensión en los nudos circundantes: el detonante físico de la reacción en cadena.

## Fase 2: el fenómeno Tap-Lag y el desacoplamiento de voltajes (12:32:57–12:33:18 CEST)

Los 21 segundos posteriores al disparo raíz son el núcleo técnico del debate forense. Tras la desconexión de Granada, la tendencia creciente de la tensión en la red de transporte reveló una divergencia entre el comportamiento de las infraestructuras de 400 kV y las redes colectoras subyacentes: el fenómeno del <GlossaryLink term="Tap-Lag">Tap-Lag</GlossaryLink>.

Durante la Fase 1, las fluctuaciones y caídas de tensión originadas por las oscilaciones de frecuencia habían llevado a los transformadores 400/220 kV y 400/132 kV a ajustar sus <GlossaryLink term="OLTC (On-Load Tap Changer)">OLTC</GlossaryLink> subiendo tomas para elevar el voltaje en los secundarios. Al irrumpir la sobretensión en la red de 400 kV, estos transformadores quedaron atrapados en su propia inercia mecánica: los mecanismos de motor y engranaje de los OLTC están intencionadamente ralentizados mediante retardos temporales para evitar oscilaciones mecánicas ante perturbaciones efímeras. Frente a un transitorio eléctrico ultrarrápido, los cambiadores resultaron excesivamente lentos y no pudieron rebajar a tiempo la relación de transformación.

![Desacoplamiento Tap-Lag](/figuras/tap_lag_decoupling.png) _Desacoplamiento entre el primario de 400 kV y el secundario colector durante la Fase 2. Mientras el incremento de tensión en el lado de 400 kV se mantuvo en valores moderados, la inercia del OLTC amplificó el transitorio en el lado colector. Fuente: ENTSO-E._

Esta incapacidad mecánica creó un **«espejismo» en la sala de control de REE**. El <GlossaryLink term="SCADA (Supervisory Control and Data Acquisition)">SCADA</GlossaryLink> del operador monitorizaba el primario de 400 kV, observando tensiones altas pero teóricamente por debajo del límite excepcional normativo de **435 kV** (P.O. 1.1). Sin embargo, aguas abajo, en las redes de 220 kV y 132 kV, el voltaje escaló por encima de **1,2 p.u.** —umbrales invisibles para el despacho nacional por la inobservabilidad de la red subyacente.

![Mapa de Calor: Propagación de Sobretensiones](/figuras/heatmap_propagation.png) _Propagación de las sobretensiones en la red de 400 kV durante la Fase 2 (12:32:00–12:33:18 CEST). Fuente: Comité de Análisis del Gobierno / REE._

Ante voltajes inasumibles para su electrónica de potencia, los inversores de las plantas solares y eólicas accionaron sus sistemas internos de protección de sobretensión (función 59 ANSI). Aquí se sitúa una de las mayores discrepancias forenses del incidente: REE tipificó estas pérdidas como **«disparos inadecuados»** argumentando que en su red de 400 kV no existían valores de desconexión; el análisis ICAI sostiene que las plantas **actuaron correctamente** ante la sobretensión real experimentada en sus puntos de conexión, aguas abajo del transformador con OLTC. El Tap-Lag configuró así las condiciones para un bucle de retroalimentación positiva de desconexiones en cascada.

## Fase 3: el camino hacia el cero de tensión (12:33:18—12:33:29 CEST)



En 11 segundos, la red peninsular se destruyó a sí misma mediante un círculo vicioso dictado por las ecuaciones de flujo de cargas. Al desconectarse masivamente las plantas IBR para autoprotegerse, la red perdía instantáneamente su capacidad de absorber potencia reactiva. Simultáneamente, la caída de potencia activa reducía el flujo en las líneas de 400 kV, incrementando su inyección capacitiva por efecto Ferranti y empujando la tensión por encima de **443 kV** en los nudos más estresados. Cada desconexión elevaba la tensión, forzando nuevas desconexiones.

![Cascada de Desconexiones IBR](/figuras/cascada_desconexiones.png) _Propagación geográfica de la cascada durante los once segundos de la Fase 3. Fuente: Comité de Análisis del Gobierno._

Los golpes más severos se concentraron inicialmente en **Badajoz** (más de **725 MW** perdidos a las 12:33:16 CEST) y, un segundo después, en las subestaciones de **Segovia, Sevilla y Huelva** (930 MW adicionales a las 12:33:17 CEST). En la ventana de cinco segundos entre las 12:33:19 y las 12:33:24 CEST, la cascada desconectó más de **15 GW de generación** —cerca del **60 % de la demanda instantánea nacional**— llevando al sistema más allá de cualquier posibilidad de recuperación.



A medida que la cascada destruía la generación remanente, la frecuencia comenzó a desplomarse con una <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink> extrema, activando los esquemas de <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink>. Al cruzar el umbral de **49,5 Hz** a las 12:33:20 CEST, se desconectaron automáticamente más de **2.000 MW** de bombeo hidráulico, seguidos de múltiples escalones de demanda industrial.

![Evolución Acoplada de Tensión y Frecuencia](/figuras/tension_frecuencia_colapso.png) _El incremento de tensión por encima de 1,10 p.u. precede en el tiempo a la caída de frecuencia, confirmando que el colapso fue primariamente capacitivo, no inercial. Fuente: Comité de Análisis del Gobierno._

La actuación del UFLS reveló la denominada **paradoja del UFLS**: al cortar consumo activo para estabilizar la frecuencia, el esquema eliminó simultáneamente el consumo de potencia reactiva inductiva de esa misma demanda. En una red saturada de reactiva capacitiva, suprimir los últimos sumideros —motores y cargas industriales— produjo un nuevo repunte de sobretensiones, **reforzando el colapso que el propio UFLS pretendía frenar**. Las lógicas de defensa diseñadas para déficits de frecuencia resultaron contraproducentes ante un colapso impulsado primariamente por inestabilidad de tensión.

En los últimos instantes, el déficit masivo de generación interna provocó una inversión violenta de los flujos pirenáicos: las líneas AC intentaron importar hasta **4.609 MW** de emergencia desde Francia. Simultáneamente, el enlace HVDC INELFE-1 —fijado en PMODE1 desde las 12:08 CEST— continuaba extrayendo **1.000 MW** del sistema ibérico, reduciendo en un **22 %** la capacidad de soporte neto desde Francia.

![Inversión de Flujos en Enlaces AC/DC](/figuras/interconexion_francia_colapso.png) _Inversión de flujos en la frontera pirenaica durante la Fase 3: importación de emergencia de hasta 4.609 MW por las líneas AC, extracción simultánea de 1.000 MW por el HVDC, y apertura por pérdida de sincronismo a las 12:33:21 CEST. Fuente: Comité de Análisis del Gobierno / REE._

A las **12:33:21 CEST**, las protecciones de pérdida de <GlossaryLink term="Sincronismo">sincronismo</GlossaryLink> abrieron los enlaces AC para evitar el contagio al sistema europeo continental, aislando la península ibérica. El **«Cero de Tensión»** definitivo se confirmó a las **12:33:29.741 CEST** con el disparo del último grupo generador — cerrando el incidente sistémico más severo documentado en la historia del sistema eléctrico europeo continental.

```

### 📄 Archivo: `docs\04-reaccion-reposicion.mdx`
```mdx
---
sidebar_position: 4
hide_title: true
title: "Reacción y Reposición"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";

<GlitchTitle>Reacción y Reposición</GlitchTitle>

Tras la consumación del cero de tensión a las 12:33:30 CEST, el sistema eléctrico peninsular transitó de una crisis dinámica incontrolable a una fase de gestión de emergencia y reposición estructural. La pérdida de más de 15 GW y la desconexión total del sistema síncrono continental obligaron a REE a abandonar la lógica de operación en régimen permanente para activar los protocolos de emergencia del **Procedimiento de Operación P.O. 1.6**. La recuperación total del suministro requirió casi **19 horas** de maniobras ininterrumpidas.

## Cronología del colapso y la restauración

<ForensicTable 
  title="INCIDENT CHRONOLOGY — RECOVERY PHASES"
  source="COMITÉ DE ANÁLISIS DEL GOBIERNO"
  confidence="HIGH"
>

  <table>
    <thead>
      <tr>
        <th>Fase</th>
        <th>Ventana temporal</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      <tr className="state-normal">
        <td><strong>Fase 0</strong></td>
        <td>Días previos y mañana del 28-A</td>
        <td className="narrative-cell">Inestabilidad latente de tensiones</td>
      </tr>
      <tr className="state-warning">
        <td><strong>Fase 1</strong></td>
        <td>12:00–12:30 CEST</td>
        <td className="narrative-cell">Oscilaciones electromecánicas</td>
      </tr>
      <tr className="state-critical">
        <td><strong>Fase 2</strong></td>
        <td>12:32:00–12:33:18 CEST</td>
        <td className="narrative-cell">Pérdidas de generación por sobretensión</td>
      </tr>
      <tr className="state-blackout">
        <td><strong>Fase 3</strong></td>
        <td>12:33:18–12:33:30 CEST</td>
        <td className="narrative-cell">Cascada hasta cero de tensión</td>
      </tr>
      <tr className="state-warning">
        <td><strong>Fase 4</strong></td>
        <td>12:33:30 CEST – 14:36 del 29-A</td>
        <td className="narrative-cell">Reposición progresiva del suministro</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>

<div className="forensic-caption">_Cronograma oficial de fases según el Comité de Análisis del Gobierno._</div>

## Gestión de emergencia: activación del P.O. 1.1 y P.O. 1.6

El P.O. 1.1 establece los criterios de operación en régimen permanente, fundamentados en el cumplimiento del <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink> y en el mantenimiento de tensiones entre 380 kV y 435 kV en la red de transporte. La cascada del 28-A mostró las limitaciones de la validación estática de estos criterios frente a transitorios dinámicos ultrarrápidos en redes de baja <GlossaryLink term="Inercia (H)">inercia</GlossaryLink>: los límites de seguridad fueron superados en una ventana de once segundos, y los esquemas de defensa automáticos —incluyendo el <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink>— resultaron contraproducentes. REE asumió el control manual bajo estado de _Blackout_ (criterio OB3).

La reacción institucional fue inmediata y simultánea en varios frentes:

- **12:34 CEST** — REE confirma con REN que la totalidad de la red portuguesa está igualmente sin tensión.
- **12:36 CEST** — Notificación formal al resto de operadores europeos a través del <GlossaryLink term="EAS (ENTSO-E Awareness System)">EAS</GlossaryLink>,
  modificando el estado operativo del bloque ibérico a «Restauración».
- **12:44 CEST** — Suspensión de todos los mercados intradiarios y de servicios de ajuste por REE y OMIE, otorgando autoridad plena para despachar exclusivamente bajo criterios de viabilidad técnica.

La estrategia de recuperación dictaminó la fragmentación controlada de la Península Ibérica en **siete áreas operativas independientes** —Zona Sur, Tajo-Centro, Levante y otras— durante la re-energización progresiva.

![Fragmentación topológica de la península en siete islas eléctricas durante la reposición](/figuras/islas_reposicion_entsoe.png) _Fragmentación topológica conforme al P.O. 1.6. Cada isla debía estabilizarse individualmente en tensión y frecuencia antes de autorizarse su sincronización con las islas adyacentes. Fuente: ENTSO-E / REE._

La maniobra combinó dos frentes simultáneos: una estrategia **Top-Down** (soporte externo desde Francia y Marruecos como referencia de tensión) y una estrategia **Bottom-Up** (arranque autónomo de centrales hidroeléctricas internas en Galicia, Asturias y la cuenca del Duero).

## Estrategia Black Start: hidroeléctricas y ciclos combinados

Con la práctica totalidad del parque generador compuesto por <GlossaryLink term="IBR">IBR</GlossaryLink> en modo <GlossaryLink term="GFL (Grid-Following)">grid-following</GlossaryLink> —tecnológicamente incapaces de generar una onda de tensión sin red externa estable—, la supervivencia y el reinicio del sistema recayeron exclusivamente sobre las máquinas síncronas con capacidad de <GlossaryLink term="Black Start">arranque autónomo</GlossaryLink>.

![Estrategia dual de re-energización Top-Down y Bottom-Up](/figuras/estrategia_reenergizacion_dual.png) _Estrategia dual de re-energización: vía Top-Down desde Francia y Marruecos y vía Bottom-Up desde las centrales hidráulicas internas. Fuente: ENTSO-E / REE._

Las centrales hidroeléctricas —fluyentes y de bombeo— fueron las primeras en ser despachadas para energizar tramos aislados y crear las primeras islas eléctricas. Sin embargo, la operación de estos microsistemas reveló la dificultad de operar con inercias mínimas: la energización de líneas en vacío provocó transitorios capacitivos significativos que impidieron completar varios intentos de arranque.

![Despliegue temporal y eficacia del Black Start hidroeléctrico](/figuras/black_start_hidroelectrico.png) _Intentos de arranque autónomo hidroeléctrico durante la Fase 4. Los puntos grises corresponden a intentos fallidos. La elevada proporción de fracasos refleja la complejidad de energizar una red sin masa síncrona acoplada. Fuente: ENTSO-E / REE._

Los fallos fueron significativos: las islas de Cantabria y Levante no se sostuvieron y debieron reiniciarse; la central asignada a Madrid no logró estabilizar sus parámetros tras varios intentos consecutivos; y el arranque autónomo en Andalucía resultó infructuoso, obligando a priorizar el apoyo externo desde Marruecos como referencia de tensión para la zona sur.

Una vez que las islas hidroeléctricas lograron estabilizar mínimamente sus parámetros, la estrategia viró hacia su consolidación electromecánica mediante los Ciclos Combinados de Gas Natural (CCGT) y los servicios auxiliares de las centrales nucleares. Estas máquinas no se conectaron para satisfacer demanda comercial, sino para conformar el **«andamiaje electromagnético»** del sistema: aportaban la potencia de cortocircuito ($S_{sc}$), la inercia ($H$) y la capacidad de gestión dinámica de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> imprescindibles antes de autorizar la reconexión masiva de la demanda.

El sistema portugués ejecutó un esquema análogo apoyado en la hidroeléctrica HPP 1-Centro y el ciclo combinado CCGT 1-Norte. A las **20:22 CEST**, la sincronización de las islas portuguesas con las zonas españolas ya acopladas a la frecuencia continental europea —verificada mediante relés _synchro-check_— garantizó la viabilidad de la reposición total de la Península Ibérica.

## Coordinación internacional: RCC, Swissgrid y la resincronización continental

Las herramientas de los Centros de Coordinación Regional (RCC) —en particular Coreso, responsable del Suroeste de Europa— evalúan la seguridad mediante flujos de carga estáticos en régimen permanente, sin capacidad para anticipar fenómenos de <GlossaryLink term="Estabilidad de tensión">inestabilidad de tensión</GlossaryLink> o dinámicas ultrarrápidas asociadas a la baja inercia. En consecuencia, todos sus análisis previos al colapso arrojaron estado «OK», y el bloque ibérico se mantuvo etiquetado como «Normal» en el EAS hasta el instante mismo del apagón.

Una vez consumado el cero de tensión, la jerarquía de mando europea se activó a través de los Monitores del Área Síncrona (SAM), operados por Swissgrid y Amprion. Entre las **12:49 y las 12:54 CEST** se estableció la estructura de mando unificada:

- **REE** → líder de frecuencia para la isla ibérica desconectada
- **Swissgrid** → estabilización del resto del continente
- **RTE (Francia)** → líder de resincronización general

Bajo este esquema, RTE activó ofertas en su mecanismo de balance interno por hasta **4.500 MW** para sostener la exportación hacia España, posibilitando la energización de los corredores de 400 kV del norte y el este peninsular.

![Evolución del soporte transfronterizo desde Francia durante la reposición](/figuras/evolucion_carga_repuesta_francia.png) _Soporte transfronterizo desde Francia durante la reposición. Las inyecciones de RTE sostuvieron la estabilidad de tensión durante la re-energización de los corredores norte y este antes de que los grupos síncronos internos se acoplaran en cantidad suficiente. Fuente: Comité de Análisis del Gobierno._

En la frontera sur, la interconexión con Marruecos (ONEE) se convirtió en el **ancla electromecánica de Andalucía**. A las **13:04 CEST** se habilitó el flujo a través de la línea Puerto de la Cruz–Mellousa, inyectando cerca de **900 MW** y aportando la referencia de tensión necesaria para energizar el sur peninsular, donde los intentos de _Black Start_ interno habían fracasado.

![Inyección de potencia desde Marruecos para el soporte Top-Down en Andalucía](/figuras/intercambio_marruecos_topdown.png) _Soporte Top-Down desde la frontera sur (ONEE). La interconexión marroquí resultó determinante para aportar la potencia de cortocircuito necesaria para energizar Andalucía. Fuente: ENTSO-E / REE._

El panel de expertos de ENTSO-E reconoció posteriormente esta cooperación como un caso de **coordinación efectiva entre operadores europeos** ante eventos de severidad máxima (OB3).

## Evolución del mix y estabilización final

A pesar de que los parques solares y eólicos se encontraban físicamente intactos con recurso primario disponible, su reconexión quedó restringida durante las primeras fases críticas. Los inversores en modo _grid-following_ necesitan leer previamente una red externa robusta para inyectar corriente mediante sus lazos <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink>: sin esa referencia, son incapaces de operar. La responsabilidad íntegra de la re-energización recayó sobre el acoplamiento secuencial de CCGT, plantas de carbón remanentes y centrales nucleares.

![Evolución del mix tecnológico durante la re-energización peninsular](/figuras/evolucion_mix_reenergizacion.png) _Mix tecnológico durante la re-energización. En las primeras horas, el sistema se sostuvo exclusivamente mediante importaciones transfronterizas y generación síncrona. La incorporación de IBR quedó restringida hasta que se acreditó la potencia de cortocircuito e inercia mínimas necesarias. Fuente: ENTSO-E / REE._

La carga se reconectó en bloques discretos cuidadosamente calculados:

- **13:07 CEST** — Primeros **31 MW** alimentados desde la subestación de Irún.
- **23:32 CEST** — Con 21 grupos térmicos sincronizados, la demanda cubierta alcanzó los **13.039 MW** (~55 % de la carga esperada).
- **00:06 CEST (29-A)** — REE reactivó el controlador maestro de la reserva de restauración de frecuencia automática (aFRR), devolviendo al sistema su capacidad de regulación secundaria automatizada.
- **01:38 CEST (29-A)** — Primeras consignas para reintegrar parques eólicos y plantas de cogeneración.
- **07:05 CEST (29-A)** — Liberación de restricciones para la totalidad del régimen RCR. REE certifica la restitución del **99,95 %** del suministro eléctrico nacional.

![Desplome y recuperación de la demanda eléctrica peninsular en las 19 horas posteriores](/figuras/recuperacion_demanda_peninsular.png) _Desplome y recuperación de la demanda peninsular. La reposición de los 25 GW perdidos se completó tras casi 19 horas de maniobras ininterrumpidas, con conexión de carga escalonada para evitar nuevos episodios de subfrecuencia. Fuente: Comité de Análisis del Gobierno._

La secuencia de la reposición constituye una constatación empírica del argumento técnico central de este trabajo: la generación síncrona —ausente en cantidades suficientes durante la operación previa al colapso— demostró ser el único sustento electromecánico capaz de sostener la recuperación. Su papel como «andamiaje» de la re-energización no es un artefacto operativo, sino una consecuencia directa de las propiedades físicas fundamentales que los IBR en modo grid-following no pueden replicar.

```

### 📄 Archivo: `docs\05-analisis-informes.mdx`
```mdx
---
sidebar_position: 5
hide_title: true
title: "Análisis de los Informes Oficiales"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";

<GlitchTitle>Análisis de los Informes Oficiales</GlitchTitle>

El análisis cruzado de los cuatro informes sobre el apagón del 28-A revela una arquitectura de disputas que va más allá del desacuerdo técnico puntual: tres visiones institucionales radicalmente distintas sobre la misma secuencia de eventos, con implicaciones jurídicas, económicas y regulatorias directas. Este capítulo examina la coherencia interna de cada narrativa, sus puntos de consenso verificados y sus contradicciones irreconciliables.

## La visión del Gobierno y REE: causalidad multifactorial e incumplimiento normativo

La narrativa oficial tipifica el apagón no como un error de diseño operativo ni como consecuencia directa de las maniobras del despacho, sino como un evento de **naturaleza multifactorial**: la convergencia de demanda valle, penetración masiva de <GlossaryLink term="IBR">IBR</GlossaryLink> y comportamiento técnico inadecuado de los agentes privados que, actuando simultáneamente, superó los umbrales del <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink>.

<ForensicTable 
  title="MULTI-FACTOR CAUSALITY MODEL"
  source="COMITÉ DE ANÁLISIS DEL GOBIERNO"
>

| Factor | Descripción |
| --- | --- |
| **Control de tensión insuficiente** | Incumplimiento del P.O. 7.4 por generadores síncronos y RCR |
| **Oscilaciones electromecánicas** | Condicionantes del estado del sistema previo al colapso |
| **Desconexiones de generación** | Algunas calificadas como prematuras → vector final de la sobretensión |

</ForensicTable>
<div className="forensic-caption">_Esquema de causalidad multifactorial según el Comité de Análisis del Gobierno._</div>

La defensa técnica de REE sobre la maniobra de <GlossaryLink term="Mallado">mallado</GlossaryLink> merece examen preciso. El informe subraya un aspecto frecuentemente omitido en las críticas: las oscilaciones iniciales no provocaron sobretensiones sino **caídas de tensión** en los nudos de la red de transporte. Ante este riesgo, el Centro de Control ejecutó acciones estrictamente protocolizadas —reconexión de circuitos, acoplamiento de reactancias, coordinación con RTE para conmutar el HVDC a PMODE1—, reconociendo que estas maniobras «contribuyeron al alza en las tensiones», pero calificándolas como necesarias. REE defiende que cualquier incremento tensional posterior habría sido absorbible si los agentes hubiesen cumplido sus obligaciones normativas.

![Mapas térmicos de tensión en la red de 400 kV en los instantes previos al disparo raíz](/figuras/mapas_termicos_tension_ree.png) _Cartografía de tensión en la red de 400 kV (12:30–12:32:57 CEST) según el análisis del Operador del Sistema. REE sostiene que los perfiles se mantuvieron dentro de los rangos del P.O. 1.1 hasta el inicio de las desconexiones en las redes colectoras. Fuente: Red Eléctrica._

El argumento central traslada la responsabilidad al parque generador: el análisis de las 850 instalaciones de mayor generación documenta que aproximadamente el **22 %** no cumplían el criterio de factor de potencia exigible conforme al RD 413/2014, aunque el propio informe matiza que parte de este incumplimiento podría atribuirse al efecto capacitivo de las infraestructuras de evacuación con baja generación. De forma particular, una central térmica en la zona sur no solo no absorbió <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> inductiva, sino que inyectó reactiva capacitiva adicional. Para REE, la inhibición colectiva del parque privado privó al sistema del margen dinámico necesario para contener el transitorio.

Sobre la inercia, REE descarta explícitamente que fuese la causa material: el sistema operaba con $H = 2,3$ s, por encima del umbral de 2 s recomendado por <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>, y «la ola de sobretensión hubiera provocado el efecto cascada en todo caso», puesto que las condiciones de sobretensión persistieron hasta las 12:33:23 CEST con independencia de la frecuencia.

La narrativa gubernamental presenta coherencia interna apreciable e identifica incumplimientos normativos documentados. Sin embargo, no responde a dos argumentos del peritaje ICAI: la magnitud de la reactiva capacitiva inyectada por el mallado y la inobservabilidad del operador en la red de 220 kV por el fenómeno de <GlossaryLink term="Tap-Lag">Tap-Lag</GlossaryLink> — dos elementos que, según el ICAI, habrían hecho inevitable el colapso con independencia del nivel de cumplimiento de los generadores.

La tabla completa de la **secuencia oficial de 18 eventos desencadenantes** según REE, y sus **propuestas regulatorias** en cuatro áreas (control de tensión, operación, observabilidad y monitorización), se recogen a continuación:

### Secuencia oficial de eventos desencadenantes (REE)

<ForensicTable 
  title="OFFICIAL EVENT SEQUENCE LOG"
  source="RED ELÉCTRICA (OS)"
  timeBase="UTC+2 (CEST)"
>

  <table>
    <thead>
      <tr>
        <th>N.º</th>
        <th>Ref.</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>N-1</td>
        <td className="narrative-cell">Oscilación forzada 0,6 Hz (posible origen: FV Badajoz). Maniobras protocolizadas: reactancias, acoplamiento de líneas, cambios de programa.</td>
      </tr>
      <tr>
        <td>2</td>
        <td>N-2</td>
        <td className="narrative-cell">Modo inter-área natural 0,2 Hz. Nuevas maniobras de amortiguamiento.</td>
      </tr>
      <tr className="state-warning">
        <td>3</td>
        <td>N-3</td>
        <td className="narrative-cell">Generación P.O. 7.4 no absorbe reactiva requerida por consigna.</td>
      </tr>
      <tr className="state-warning">
        <td>4</td>
        <td>N-4</td>
        <td className="narrative-cell">Variaciones de generación RCR afectan control de tensión. ~22 % de plantas incumple factor de potencia.</td>
      </tr>
      <tr>
        <td>5</td>
        <td>—</td>
        <td className="narrative-cell">Generación convencional solicitada tras oscilaciones no llega a acoplarse.</td>
      </tr>
      <tr className="state-critical">
        <td>6</td>
        <td>N-5</td>
        <td className="narrative-cell">Pérdidas de generación distribuida (&lt;1 MW) y autoconsumo (435 MW) antes de las 12:32:57.</td>
      </tr>
      <tr className="state-critical">
        <td>7</td>
        <td><strong>N-6</strong></td>
        <td className="narrative-cell"><strong>Disparo del transformador de evacuación en Granada a las 12:32:57.</strong> REE registra 418 kV en 400 kV, dentro de límites normativos.</td>
      </tr>
      <tr className="state-critical">
        <td>8</td>
        <td>N-7</td>
        <td className="narrative-cell">Disparo termosolar y FV en Badajoz sin información en frontera con red de transporte.</td>
      </tr>
      <tr className="state-critical">
        <td>9</td>
        <td>N-8</td>
        <td className="narrative-cell">Disparo FV Badajoz (subestación distinta), sin visibilidad en frontera.</td>
      </tr>
      <tr className="state-critical">
        <td>10–14</td>
        <td>—</td>
        <td className="narrative-cell">Disparos en Segovia, Huelva, Sevilla, Cáceres y Badajoz (varios), sin información en frontera.</td>
      </tr>
      <tr className="state-critical">
        <td>15</td>
        <td>N-11</td>
        <td className="narrative-cell">Disparo de ciclo combinado en Valencia.</td>
      </tr>
      <tr className="state-critical">
        <td>16</td>
        <td>—</td>
        <td className="narrative-cell">UFLS provoca incremento adicional de tensión por descarga de líneas.</td>
      </tr>
      <tr>
        <td>17</td>
        <td>—</td>
        <td className="narrative-cell">HVDC INELFE-1 continúa exportando 1.000 MW en PMODE1.</td>
      </tr>
      <tr className="state-blackout">
        <td>18</td>
        <td>N-12</td>
        <td className="narrative-cell">Disparo de grupo nuclear. Pérdida de sincronismo y cero de tensión a las <strong>12:33:29.741 CEST</strong>.</td>
      </tr>
    </tbody>
  </table>
</ForensicTable>

### Propuestas regulatorias de Redeia

<ForensicTable 
  title="PROPOSED REGULATORY AMENDMENTS"
  source="REDEIA"
>

| Área | Medida propuesta |
| --- | --- |
| **Control dinámico de tensión** | Nuevo P.O. 7.4: obligar a toda generación con capacidad de control en tiempo real a activarlo, con penalizaciones por incumplimiento. Revisión de umbrales de sobretensión en líneas de evacuación. Despliegue de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink> o <GlossaryLink term="Compensador Síncrono Estático (STATCOM)">STATCOM</GlossaryLink> para sustitución de dispositivos discretos. |
| **Operación y estabilidad** | Extensión de rampas de cambio de programa a mínimo 10 minutos. Actualización de generación RCR anterior a Orden TED/749/2020. Activación de control potencia-frecuencia en enlaces HVDC actuales y futuros. |
| **Observabilidad** | Refuerzo del control de tensión en distribución. Dotación al OS de observabilidad sobre el autoconsumo. Ampliación del <GlossaryLink term="WAMS (Wide Area Monitoring Systems)">WAMS</GlossaryLink> con <GlossaryLink term="PMU (Phasor Measurement Unit)">PMU</GlossaryLink> por parque de transporte. |
| **Monitorización** | Registros de faltas con muestreo mínimo de 20 ms y sincronización horaria. Plataforma centralizada de recopilación de datos de incidentes. |

</ForensicTable>

## La visión del sector generador (ICAI / AELEC): mallado excesivo y colapso inevitable

Frente a la narrativa gubernamental, el dictamen pericial del IIT-ICAI junto a Compass Lexecon e INESC TEC diagnostica formalmente el evento como un **colapso por sobretensión**: un fenómeno de inestabilidad de <GlossaryLink term="Estabilidad de tensión">tensión</GlossaryLink> impulsado por el agotamiento de la capacidad de absorción de potencia reactiva, en el que las propias acciones preventivas de REE actuaron como vector primario de la cascada.

El núcleo de la crítica es cuantitativo. Ante las oscilaciones a partir de las 12:03 CEST, REE acopló **11 circuitos de 400 kV** en vacío. Por el <GlossaryLink term="Efecto Ferranti">Efecto Ferranti</GlossaryLink>, estas líneas se comportaron como grandes bancos de condensadores, inyectando entre **1,05 y 2,4 GVAr** de reactiva capacitiva en una red que ya carecía de margen de absorción. Las simulaciones estiman que el margen al colapso en el nudo de Carmona 400 kV se contrajo de **2.964 MW** a **1.268 MW** — una reducción del **57 %** que llevó al sistema al umbral de saturación capacitiva.

![Curvas Q-V en el nudo de Carmona 400 kV según el análisis pericial ICAI](/figuras/fluctuaciones_tension_previas.png) _Curvas <GlossaryLink term="Colapso Q-V">Q-V</GlossaryLink> de estabilidad de tensión en Carmona 400 kV. Las maniobras de mallado (LIN&SHN) desplazaron el punto de operación contrayendo el margen al colapso un 57 %. La línea discontinua roja marca el límite V = 1,2 p.u. (480 kV). Fuente: IIT-ICAI / Compass Lexecon._

La discrepancia entre las cifras de ICAI (2,4 GVAr) y el análisis independiente del NREL (1,05 GVAr) no altera la conclusión compartida: en ambos casos, la inyección capacitiva superó la capacidad de absorción residual del sistema, estimada en apenas **3,3 GVAr** frente a los 5,8 GVAr habituales.

Sobre los disparos en cascada, el sector generador refuta la calificación de «disparos inadecuados» señalando la limitación de observabilidad del operador. Mientras el <GlossaryLink term="SCADA (Supervisory Control and Data Acquisition)">SCADA</GlossaryLink> de REE mostraba 418 kV en la red de 400 kV —dentro de límites normativos—, el fenómeno del Tap-Lag generaba un punto ciego en las redes colectoras: la inercia mecánica de los <GlossaryLink term="OLTC (On-Load Tap Changer)">OLTC</GlossaryLink> amplificó el transitorio hacia las redes de 220 kV, donde se alcanzaron **244 kV** (>110 % de la tensión nominal). El titular de la infraestructura de Granada confirmó que su protección «estaba correctamente ajustada y funcionó adecuadamente».

![Registro oscilográfico del disparo raíz en Granada a las 12:32:56.993 CEST](/figuras/aluvion_alertas_sobretension_sur.png) _Oscilograma del disparo raíz (Granada, 12:32:56.993 CEST). Panel superior: corriente trifásica estable hasta el disparo del interruptor aguas arriba. Panel inferior: tensión en el secundario colector —fase A alcanza ~145 kV (>1,10 p.u.)— invisible para el SCADA de REE en la red de 400 kV por efecto Tap-Lag. Fuente: IIT-ICAI / AELEC._

La segunda línea argumental apunta al marco normativo: el P.O. 7.4, en su redacción anterior a la reforma, obligaba a los IBR a operar con factor de potencia **fijo**, impidiendo que su electrónica de potencia absorbiera o inyectara reactiva de forma dinámica pese a disponer de esa capacidad tecnológica. Esta restricción excluía al **82 % de la generación instantánea** del control activo de tensión, concentrando la responsabilidad en el escaso parque térmico síncrono disponible.

El desequilibrio cuantitativo resultante era, según el peritaje, **matemáticamente insalvable**: en la zona sur —epicentro de las oscilaciones y del mallado—, REE disponía de apenas **0,2 GVAr** de capacidad de absorción de reactiva inductiva frente a una inyección capacitiva estimada superior a **0,7 GVAr** inducida por sus propias maniobras.

![Balance de potencia reactiva en la zona sur a las 12:30 CEST según IIT-ICAI](/figuras/asimetria_balance_reactiva_sur.png) _Balance de potencia reactiva a las 12:30 CEST. Las maniobras de REE añadieron 0,7 GVAr capacitivos sobre los 3,4 GVAr ya existentes, mientras la generación síncrona convencional aportaba apenas 0,2 GVAr de absorción. Déficit neto: −0,6 GVAr. Fuente: IIT-ICAI / Compass Lexecon._

La conclusión del peritaje identifica **tres factores directamente atribuibles al operador y al regulador**: el mallado que saturó los márgenes Q-V, la inobservabilidad estructural de la red de 220 kV por el Tap-Lag, y el marco normativo (P.O. 7.4) que impedía al 82 % del parque participar en el control dinámico de tensión.

## La visión europea (ENTSO-E): insuficiencia del NC RfG y separación del sistema síncrono

El panel de expertos de ENTSO-E aporta la perspectiva más estructural de las tres. Su tesis central rechaza que el apagón se debiera a la penetración renovable _per se_: el colapso no fue consecuencia de un exceso de generación renovable ni de una escasez inercial primaria, sino de las **limitaciones del marco de control de perfiles de tensión**. El incidente evidencia la asimetría entre el despliegue acelerado de activos renovables y la obsolescencia parcial de los códigos de red que gobiernan su comportamiento dinámico.

El análisis identifica una tensión técnica fundamental: la mayoría de las instalaciones que se desconectaron disponían de la electrónica de potencia necesaria para realizar control de tensión robusto, pero la normativa española vigente les **prohibía o no les exigía** aportar este servicio dinámico, forzándolas a operar con factores de potencia estáticos conforme al RD 413/2014. Esta restricción regulatoria privó al sistema del soporte reactivo distribuido que habría podido amortiguar la inyección capacitiva de las líneas en vacío.

Como respuesta directa, ENTSO-E ha consolidado en su Informe de Fase II la actualización del **NC RfG 2.0**, que prevé imponer el <GlossaryLink term="GFM (Grid-Forming)">grid-forming</GlossaryLink> como requisito obligatorio para todos los módulos no síncronos ≥ 1 MW:

<ForensicTable 
  title="NC RFG 2.0 (PROPOSED) REQUIREMENTS COMPARISON"
  source="ENTSO-E"
>

| Requisito | <GlossaryLink term="NC RfG">NC RfG vigente</GlossaryLink> | NC RfG 2.0 (propuesto) |
| --- | --- | --- |
| Modo de operación | _Grid-following_ | _Grid-forming_ obligatorio |
| Umbral | Varía por tipo/país | ≥ 1 MW (PPM y ESM) |
| Control de tensión | Factor de potencia fijo | Control dinámico continuo V y Q |
| Inercia | No requerida en IBR | <GlossaryLink term="Inercia Sintética">Inercia sintética</GlossaryLink> obligatoria |
| _Black Start_ | No requerido en IBR | Capacidad de arranque en isla |
| Referencia de sincronismo | Externa (PLL sobre red) | Generada internamente (fuente de tensión ideal) |

</ForensicTable>

Sobre la topología del incidente, ENTSO-E analiza la pérdida de <GlossaryLink term="Sincronismo">sincronismo</GlossaryLink> a las **12:33:19 CEST**: el sistema pasó de exportar 469 MW (12:32:57) a importar un máximo de **3.807 MW** (12:33:19), momento de la pérdida de sincronismo. La divergencia de polos angular se volvió insostenible y las protecciones _Out-of-Step_ (OST) actuaron a las **12:33:21 CEST**, ordenando la apertura de los circuitos transpirenaicos (Baixas-Vic, Argia-Arkale, Argia-Hernani).

![Evolución del intercambio España-Francia y pérdida de sincronismo (12:32:57–12:33:20 CEST)](/figuras/perdida_sincronismo_frontera.png) _Intercambio de potencia activa en la frontera España-Francia durante la Fase 3. Panel superior: flujo neto total (exportación 469 MW → importación máxima 3.807 MW). Panel inferior: desglose por circuito. La oscilación final refleja la divergencia de polos antes de la apertura definitiva. Fuente: ENTSO-E._

Esta separación evitó que el colapso capacitivo y el hundimiento de frecuencia —con un <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink> superior a **1,5 Hz/s**— arrastraran al sistema francés y al resto de Europa Continental.

La advertencia final de ENTSO-E es estructural: los análisis de seguridad coordinada (CSA) y los modelos de red común (CGM), basados en flujos de carga estáticos y el Criterio *N*−1, **evaluaron el sistema como «Normal»** hasta los instantes previos al colapso. Para ENTSO-E, esta limitación indica que los estándares de evaluación de la seguridad operativa continental, diseñados para máquinas síncronas convencionales, resultan estructuralmente insuficientes para prevenir colapsos en sistemas con alta penetración de electrónica de potencia.

## Consenso y discrepancias: la fractura técnica en tres ejes

### Puntos de consenso técnico verificado

A pesar de la polarización del debate, los cuatro informes convergen en un conjunto de conclusiones técnicas que matizan o desmienten las narrativas mediáticas más extendidas:

<ForensicTable 
  title="TECHNICAL CONSENSUS MATRIX"
  source="MULTIPLE (CROSS-VERIFIED)"
>

| Punto de consenso | Fundamento técnico compartido | GOB | REE | ICAI | ENTSO-E |
| --- | --- | :-: | :-: | :-: | :-: |
| **La inercia no fue la causa raíz** | El sistema operaba con H = 2,3 s (> umbral 2,0 s). Mayor inercia habría retardado la caída de frecuencia décimas de segundo, sin evitar el colapso por sobretensión. | ✓ | ✓ | ✓ | ✓ |
| **Colapso por sobretensión, no por déficit de frecuencia** | La causa material fue la inestabilidad capacitiva (desequilibrio Q), no una pérdida de P activa ni una caída primaria de frecuencia. | ✓ | ✓ | ✓ | ✓ |
| **Reservas de potencia activa eran suficientes** | La reserva terciaria a subir superaba los 7.000 MW. No hubo crisis de capacidad de generación. | ✓ | ✓ | ✓ | ✓ |
| **El UFLS agravó el colapso de tensión** | El deslastre eliminó los últimos sumideros de reactiva inductiva, acelerando la escalada de tensión que destruía la red. | ✓ | ✓ | ✓ | ✓ |
| **Las protecciones de sincronismo actuaron correctamente** | La apertura de los circuitos transpirenaicos a las 12:33:21 fue técnica y normativamente correcta. | ✓ | ✓ | ✓ | ✓ |
| **La normativa IBR era insuficiente** | El P.O. 7.4 y el RD 413/2014 impedían a los IBR participar en el control dinámico de tensión pese a disponer de capacidad tecnológica. | ✓ | ✓ | ✓ | ✓ |
| **El Criterio N−1 estático es insuficiente** | Las herramientas de análisis estático evaluaron el sistema como seguro horas antes del colapso, sin capacidad para anticipar la dinámica ultrarrápida de inestabilidad capacitiva. | ✓ | ✓ | ✓ | ✓ |

</ForensicTable>

### Divergencias técnicas irreconciliables

<ForensicTable 
  title="TECHNICAL DIVERGENCE MATRIX"
  source="MULTIPLE (CROSS-VERIFIED)"
>

| Eje de disputa | Gobierno / REE | ICAI / AELEC | ENTSO-E |
| --- | --- | --- | --- |
| **1. Origen de la saturación capacitiva** | El sistema tenía márgenes suficientes. La saturación se produjo porque los generadores no absorbieron la reactiva requerida. El mallado fue una medida protocolizada y necesaria. | El mallado de 11 líneas en vacío inyectó 1,05–2,4 GVAr por Efecto Ferranti, contrayendo el margen Q-V un 57 %. El colapso era matemáticamente inevitable. | No atribuye causalidad al mallado pero documenta que los RCC no detectaron la saturación. Identifica la restricción normativa de los IBR como la vulnerabilidad primaria. |
| **2. Naturaleza de la oscilación de 0,6 Hz** | Oscilación forzada con origen en el lazo de control de una planta FV de Badajoz: detonante de la secuencia que llevó al colapso. | Las evidencias no son concluyentes. Pudo ser un modo inter-área natural amplificado por el ratio de amortiguamiento del 1 %, por ausencia de PSS en los CCGTs apagados. | Documenta la oscilación como atípica (detectada hasta Alemania) pero no atribuye causalidad definitiva. |
| **3. Legitimidad de los disparos (Tap-Lag)** | Los primeros disparos fueron «inadecuados» o prematuros: el SCADA registraba 418 kV en 400 kV, dentro de los límites del P.O. 1.1. | Los disparos fueron normativamente correctos. El Tap-Lag creó un punto ciego: las redes de 220 kV alcanzaban 244 kV (>1,10 p.u.), invisibles para el SCADA. El titular de la ICE de Granada confirmó que su protección actuó correctamente. | No califica los disparos como inadecuados. Subraya la inobservabilidad como limitación sistémica del operador y de los RCC. |
| **4. Despacho en la zona sur** | Reconoce la indisponibilidad del CCGT andaluz desde el 27-A. Justifica la no sustitución por niveles de tensión adecuados y disponibilidad de otros recursos. | La zona sur disponía de solo 0,2 GVAr de absorción frente a >0,7 GVAr de inyección capacitiva inducida por el propio operador. La no sustitución fue la decisión de despacho más determinante. | Señala la baja potencia de cortocircuito en Andalucía como factor estructural agravante, sin pronunciarse sobre la decisión individual. |
| **5. Responsabilidad principal** | Los generadores incumplieron sus obligaciones de control de tensión. El apagón fue un fallo del parque generador privado. | REE llevó la red a un estado de colapso inevitable mediante el mallado. Los generadores actuaron conforme a la física y a la normativa. El apagón fue un fallo del operador y del regulador. | La causa raíz es normativa: la restricción que impedía a los IBR controlar tensión dinámicamente. El fallo es del sistema regulatorio europeo y nacional. |

</ForensicTable>

## Síntesis interpretativa: tres fracturas de gobernanza

El escrutinio comparativo permite trascender la disputa entre partes y formular un diagnóstico de segundo orden: el apagón del 28-A no fue ni un «cisne negro» imprevisible ni el fracaso de una tecnología concreta, sino la **manifestación convergente de tres fracturas de gobernanza** que coexistían en el sistema eléctrico ibérico.

### Fractura operativa: causalidad frente a responsabilidad

La tesis del mallado como detonante (ICAI) y la tesis del incumplimiento colectivo como causa (REE / Gobierno) no son mutuamente excluyentes en términos técnicos: ambos factores contribuyeron a la saturación capacitiva que estrechó los márgenes Q-V. Lo que sí son excluyentes es su implicación jurídica y económica. Esta ambigüedad causal es el resultado previsible de operar una red sin instrumentación dinámica suficiente: cuando el sistema no dispone de PMU en todos los nudos críticos ni de herramientas de cálculo de estabilidad de tensión en tiempo real, la reconstrucción forense queda inevitablemente sujeta a interpretación. El consenso tácito entre las partes —que ningún informe enuncia explícitamente— es que la **arquitectura de monitorización resultó insuficiente** tanto para gestionar el incidente en tiempo real como para resolverlo unívocamente a posteriori.

### Fractura regulatoria: una normativa del siglo XX aplicada a una red del siglo XXI

La posición de ENTSO-E apunta a que tanto el operador como los generadores actuaron dentro de los límites de una normativa que era inadecuada para el sistema que pretendía gobernar. El P.O. 7.4 y el RD 413/2014 diseñaron un esquema de control de tensión para una red dominada por masas síncronas de respuesta lenta; aplicarlo a una red con 82 % de penetración IBR equivale, en términos de ingeniería de control, a intentar estabilizar un sistema de respuesta en milisegundos con un regulador diseñado para dinámicas de minutos. Esta inadecuación no era desconocida: la propuesta de actualización del P.O. 7.4 llevaba **años en proceso de aprobación regulatoria**. El propio informe del Gobierno reconoce que su entrada en vigor habría sido el cambio más relevante para haber evitado el colapso. El apagón del 28-A es, en este sentido, el **coste medible de una demora regulatoria**.

### Fractura sistémica: herramientas de seguridad estáticas en una red dinámica

El consenso unánime sobre la insuficiencia del Criterio *N*−1 estático señala una vulnerabilidad que trasciende el caso ibérico. Los modelos de flujo de carga que evaluaron el sistema como «Normal» son matemáticamente incapaces de representar fenómenos de inestabilidad capacitiva en redes de baja inercia: no resuelven ecuaciones diferenciales, no modelan la dinámica de los lazos de control de los inversores y no calculan márgenes Q-V en tiempo real. La velocidad de progresión del colapso —de los primeros disparos al cero de tensión en menos de **90 segundos**— sitúa el fenómeno fuera del horizonte temporal de cualquier intervención humana: cuando el operador percibió la gravedad del transitorio, el sistema ya era irrecuperable. La única respuesta viable es la **prevención estructural mediante análisis de seguridad dinámica en tiempo real**, cuyo despliegue en los centros de coordinación regional europeos constituye una de las reformas más urgentes identificadas por ENTSO-E.

### El límite del paradigma centralizado

Subyacente a las tres fracturas existe una tensión más profunda que los informes abordan de forma fragmentaria: el paradigma de operación centralizada —un operador único con visibilidad limitada al nivel de 400 kV, que gestiona la tensión con reactancias de conmutación discreta y despacha generación síncrona mediante señales de mercado horarias— fue diseñado para una red donde la masa síncrona proporcionaba amortiguamiento natural y los generadores respondían en segundos. En una red donde el **82 % de la generación está formada por inversores que responden en milisegundos**, se autoproveen de referencias de sincronismo mediante <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink>, y cuyo comportamiento dinámico es opaco para el SCADA de 400 kV, ese paradigma ha alcanzado los límites de su capacidad de gestión.

El 28-A no es únicamente el caso de estudio de un apagón: es el evento que señala el **agotamiento del modelo de despacho centralizado** en sistemas con alta penetración de electrónica de potencia y el punto de partida obligatorio de una nueva arquitectura de control distribuido y en tiempo real para la red europea del siglo XXI.

```

### 📄 Archivo: `docs\06-impacto-comunicativo.mdx`
```mdx
---
sidebar_position: 6
hide_title: true
title: "Impacto Comunicativo"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";

<GlitchTitle>Impacto Comunicativo</GlitchTitle>

El apagón del 28 de abril generó una segunda crisis paralela a la eléctrica: una crisis comunicativa cuyas consecuencias sobre la comprensión pública del incidente persisten más allá de la reposición del suministro. Este capítulo analiza cómo los medios de comunicación y las redes sociales procesaron un fenómeno técnico de alta complejidad, y qué distancia se abrió entre el consenso técnico de los informes periciales y la narrativa que llegó a la opinión pública española.

## Fallo comunicativo institucional y el vacío informativo

El cero de tensión se produjo a las **12:33 CEST**. La primera comparecencia pública oficial del presidente del Gobierno no tuvo lugar hasta las **18:00 CEST** — más de **cinco horas después**. En ese intervalo, el ecosistema hiperconectado, súbitamente privado de suministro eléctrico y de acceso digital, procesó la emergencia en ausencia de cualquier marco interpretativo institucional.

Este vacío fue ocupado de forma inmediata por lo que la literatura especializada denomina <GlossaryLink term="Crisis communication failure">crisis communication failure</GlossaryLink>: la incapacidad de las instituciones para ocupar el espacio informativo con mensajes técnicos verificables en el intervalo crítico posterior al incidente. La consecuencia fue un episodio de <GlossaryLink term="Infodemia">infodemia</GlossaryLink>: hipótesis de sabotaje, ciberataques de origen ruso, fenómenos atmosféricos anómalos y experimentos gubernamentales circularon a escala global antes de que los operadores emitieran un diagnóstico preliminar.

La naturaleza del incidente lo hacía especialmente vulnerable a esta dinámica: un colapso por sobretensión cuya mecánica requiere conocimientos de <GlossaryLink term="Estabilidad de tensión">estabilidad de tensión</GlossaryLink>, comportamiento de <GlossaryLink term="IBR">IBR</GlossaryLink> y dinámica de <GlossaryLink term="OLTC (On-Load Tap Changer)">OLTC</GlossaryLink> es, por definición, **inversamente proporcional en accesibilidad** a las explicaciones alternativas que lo sustituyeron en el espacio público. La complejidad técnica real fue desplazada por narrativas simples e inmediatamente asimilables.

La consecuencia directa fue la incorporación del incidente al debate político sobre la transición energética **antes** de que existiera un diagnóstico técnico verificado. La opinión pública española recibió durante semanas explicaciones causales —«las renovables causaron el apagón», «faltaron nucleares», «Europa abandonó a España»— que los cuatro informes técnicos **no respaldan de forma unánime**. La distancia entre el consenso técnico y la narrativa mediática dominante es, en sí misma, una de las consecuencias del 28-A con implicaciones directas sobre la capacidad de la sociedad para evaluar las reformas regulatorias que el incidente pone de manifiesto.

## Análisis de prensa: encuadres y sesgos técnicos

### Medios críticos con la gestión institucional

Cabeceras como El Mundo, ABC y La Razón articularon una narrativa que vinculaba el colapso con la política energética del Gobierno, interpretándolo como consecuencia previsible de una transición que habría priorizado fuentes intermitentes sin garantizar mecanismos de respaldo suficientes.

Algunos de los argumentos presentados contienen **inconsistencias verificables** con los informes técnicos:

- **ABC** afirmó que la red se encontraba «a un papel de fumar» de colapsar por la «alarmante falta de inercia rotacional provocada por las centrales nucleares apagadas». Esta afirmación entra en contradicción directa con el consenso técnico unánime de los cuatro informes: los registros certifican que la <GlossaryLink term="Inercia (H)">inercia del sistema</GlossaryLink> era $H =
  2,3$ s en el momento del colapso, por encima del umbral recomendado por
  ENTSO-E. El evento no fue un colapso por déficit de masa síncrona sino un
  fenómeno de inestabilidad capacitiva.

- **El Mundo** publicó «Flamanville 3 y las 56 nucleares francesas que salvaron al antinuclear Sánchez durante el gran apagón», atribuyendo implícitamente la reposición del suministro a la tecnología nuclear. El papel de Francia en la reposición fue, efectivamente, relevante —RTE activó hasta 4.500 MW de soporte—, pero la recuperación se articuló también mediante arranque autónomo de hidroeléctricas y soporte desde Marruecos, con la tecnología nuclear como uno de varios factores.

- **La Razón** publicó un informe preliminar que concluía que «la programación de insuficiente generación síncrona con control dinámico de tensión fue la causa del apagón». Esta afirmación encuentra **respaldo parcial** en el peritaje del IIT-ICAI: el déficit de capacidad de absorción de potencia reactiva en la zona sur fue un factor documentado. Sin embargo, el mismo informe señala que ese déficit se produjo en el contexto de las maniobras de mallado del Operador del Sistema — factor que la cobertura no incorporó.

![Muestra de portadas y publicaciones de medios críticos con la gestión institucional](/figuras/collage_conservador.png) *Cobertura representativa de medios con postura crítica frente a la gestión institucional. Se identifica un patrón de <GlossaryLink term="Encuadre mediático (Framing) y Agenda-shifting">encuadre (framing</GlossaryLink>) que reduce el fenómeno multicausal a la relación «mayor penetración renovable → menor estabilidad → apagón». Fuente: elaboración propia a partir de publicaciones en X.*

### Medios con postura favorable a la narrativa institucional

Los medios afines a la narrativa oficial desplazaron el foco hacia la gestión operativa de REE, las carencias de la red de transporte y las políticas heredadas. La premisa articuladora fue que el colapso no constituyó un fracaso de la descarbonización sino el resultado de una infraestructura no modernizada al ritmo necesario.

Algunos argumentos son **técnicamente consistentes** con los informes:

- **El País** destacó que la capacidad de intercambio con Francia se sitúa en un 3 %, muy inferior al objetivo europeo del 15 %. Este argumento es sólido: de haber existido mayor capacidad de interconexión, la probabilidad y virulencia de las oscilaciones inter-área habrían sido menores.

- **elDiario.es** señaló que REE operó con márgenes de seguridad reducidos a pesar de la previsión de alta radiación solar y baja generación síncrona. Esta afirmación es coherente con el diagnóstico del déficit de potencia reactiva en el sur, aunque la cobertura no articuló el mecanismo técnico subyacente de la saturación de las curvas Q-V.

Se identifican también desviaciones:

- **La Vanguardia** describió la apertura transpirenaica como una actuación «egoísta» de los mecanismos continentales para salvaguardar el suministro en Francia. Esta caracterización entra en contradicción con el dictamen de <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>: la apertura a las 12:33:21 CEST fue la actuación **automática** de las protecciones de pérdida de sincronismo (OST) ante una divergencia angular severa. Atribuir carácter deliberado a un mecanismo de protección automático supone una confusión entre el funcionamiento del sistema y una decisión operativa consciente.

- **infoLibre** publicó que los operadores privados fallaron «deliberadamente» al no absorber la tensión excedente. Esta lectura incorpora la acusación de indisciplina técnica del Gobierno pero omite cronológicamente el primer factor: la maniobra de mallado que inyectó reactiva capacitiva en la red antes de que se produjera ningún disparo.

![Muestra de publicaciones de medios con postura favorable a la narrativa institucional](/figuras/collage_progresista.png) _Cobertura representativa de medios con postura favorable a la narrativa oficial. La selección de evidencias es simétricamente parcial a la del bloque anterior: cada bloque incorporó los hechos consistentes con su encuadre previo y omitió los que lo contradecían. Fuente: elaboración propia._

### La cobertura internacional: encuadre estructural europeo

La prensa internacional abordó el apagón desde una perspectiva estructural. Al no participar del debate político español, las cabeceras de referencia internacionales encuadraron el cero de tensión como un fallo sistémico de la arquitectura de redes europeas y una advertencia para sistemas con alta penetración de electrónica de potencia.

![Muestra de la cobertura del apagón en medios internacionales](/figuras/collage_internacional.png) _Cobertura internacional del incidente. Al margen del debate político español, los medios internacionales tendieron a un encuadre estructural europeo, con mayor presencia de argumentos de seguridad de infraestructuras críticas. Fuente: elaboración propia._

- **Reuters** proporcionó el análisis con mayor rigor técnico, destacando el papel de las interconexiones y el déficit de soporte de tensión en los instantes previos al colapso.
- **Le Monde** adoptó un enfoque descriptivo del impacto transfronterizo.
- **BBC** centró su cobertura en la seguridad de infraestructuras críticas, documentando la parada segura de los reactores nucleares y **refutando las hipótesis de ciberataque**.
- **Financial Times** tituló «Spain and Portugal blackout blamed on solar power dependency», citando expertos que atribuían la inestabilidad a la insuficiencia de _«firm power»_. Esta argumentación no se corresponde con el consenso técnico: el sistema contaba con reservas operativas suficientes y cuatro reactores nucleares acoplados. El evento no fue un colapso de potencia activa por falta de generación firme sino un fenómeno de inestabilidad capacitiva.
- **The Telegraph** sugirió que el Gobierno español realizaba un «experimento» con el sistema eléctrico. Esta afirmación fue desmentida por Euronews Verify y Reuters Fact Check y no encontró respaldo en ninguno de los cuatro informes técnicos.

### Síntesis: selección asimétrica de evidencias

La conclusión del análisis comunicativo es que el incidente no fue cubierto mayoritariamente como un fenómeno técnico novedoso sino encuadrado de forma inmediata en los marcos interpretativos preexistentes de cada bloque editorial:

- Los **medios críticos con la gestión institucional** enfatizaron el déficit de generación síncrona y la política energética como causas, con omisión frecuente del impacto del mallado.
- Los **medios favorables a la narrativa oficial** enfatizaron el error operativo y el déficit de interconexiones, con omisión frecuente del comportamiento real del parque de generación.

Ninguno de los dos bloques ofreció una representación de la multicausalidad técnica tal como ha sido descrita en los informes periciales. Esta dinámica tiene implicaciones que exceden el análisis mediático: las reformas regulatorias identificadas como necesarias —actualización del P.O. 7.4, despliegue de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink>, transición al modo <GlossaryLink term="GFM (Grid-Forming)">grid-forming</GlossaryLink>— requieren consenso político sostenido. La polarización del debate público en torno a narrativas causales mutuamente excluyentes dificulta la formación de ese consenso.

## Reacción en redes sociales: tres fases de gestión colectiva de la incertidumbre

El análisis de la actividad en la plataforma X durante el apagón revela una evolución secuencial en tres fases diferenciadas.

### Fase 1 (0–6 horas): incertidumbre aguda y desinformación

La ausencia de comunicación gubernamental durante las primeras cinco horas generó un proceso de <GlossaryLink term="Vacuum filling (Relleno del vacío informativo)">vacuum filling</GlossaryLink>: el vacío informativo fue ocupado por fuentes no verificadas. La elevada opacidad técnica del colapso por sobretensión favoreció la propagación de hipótesis de sabotajes, ciberataques (la denominada «Operación Matrioska») y fenómenos atmosféricos, todas ellas asimilables por el público general debido a su narrativa externalizadora.

Superpuesta a este ecosistema desinformativo, emergió una respuesta ciudadana coherente con la <GlossaryLink term="Emergent norm theory">emergent norm theory</GlossaryLink>: el desarrollo de mecanismos colectivos de afrontamiento ante la perturbación. El humor costumbrista, la ironía y la normalización pragmática funcionaron como reguladores emocionales colectivos ante una disrupción sin precedentes.

![Reacciones ciudadanas en X durante las primeras horas del apagón](/figuras/collage_ciudadanos.png) *Publicaciones ciudadanas durante las primeras horas. Se identifican tres patrones: normalización pragmática y humor como mecanismo de afrontamiento, crítica institucional a través de formatos virales, y búsqueda activa de explicaciones causales en ausencia de información oficial. Los tres son coherentes con la emergent norm theory en entornos digitales durante disrupciones de infraestructuras críticas. Fuente: capturas de X, elaboración propia.*

### Fase 2 (6–72 horas): politización y outrage communication

A partir de la comparecencia oficial, el discurso digital migró hacia la atribución de responsabilidades. Este proceso responde a lo que la literatura de comunicación de crisis denomina <GlossaryLink term="Outrage communication (Comunicación de indignación)">outrage communication</GlossaryLink>: los mensajes de indignación generan mayor capacidad de difusión algorítmica que las explicaciones técnicas.

En el espacio digital crítico con el Gobierno, el apagón fue encuadrado como evidencia de gestión deficiente, con exigencias de dimisiones y rendición de cuentas. En el espacio favorable a la narrativa institucional, la línea argumentativa se orientó hacia la valoración positiva de la respuesta de emergencias y la defensa del modelo energético.

![Reacciones de figuras políticas en X durante las 72 horas posteriores al apagón](/figuras/collage_politicos.png) *Publicaciones de líderes políticos españoles en X durante las 72 horas posteriores. Ninguno de los mensajes analizados abordó aspectos técnicos del colapso por sobretensión, del <GlossaryLink term="Tap-Lag">Tap-Lag</GlossaryLink> o del papel del mallado. La comunicación política se orientó a la atribución de responsabilidades sin incorporar los elementos técnicos del diagnóstico pericial. Fuente: capturas de X, elaboración propia.*

### Fase 3 (>72 horas): corrección tardía con alcance reducido

Las explicaciones técnicas verificadas llegaron con un alcance significativamente inferior al de los mensajes iniciales. Este fenómeno responde a una asimetría estructural documentada en la literatura: la incompatibilidad temporal entre la velocidad de propagación viral y la lentitud inevitable de la investigación forense técnica.

### Síntesis: tres asimetrías estructurales

El análisis identifica tres asimetrías estructurales del ecosistema digital ante incidentes de alta complejidad técnica:

1. **Asimetría temporal**: la velocidad de propagación viral es incompatible con el ritmo de la investigación forense técnica. La opinión pública recibe primero las hipótesis y después, con alcance reducido, las correcciones.
2. **Asimetría de vacío**: el vacío informativo institucional no es neutro — es ocupado por atribuciones causales prematuras que estructuran el debate subsiguiente.
3. **Asimetría algorítmica**: los mensajes de indignación política tienen mayor capacidad de difusión que la divulgación técnica, con independencia de su precisión analítica.

Estas tres asimetrías confirman que, ante disrupciones eléctricas de elevada complejidad técnica, la comprensión pública queda condicionada por los marcos interpretativos previos de cada agente comunicativo, **con independencia de la evidencia técnica disponible**. La consideración de este factor en el diseño de los protocolos de comunicación de crisis de los operadores de sistemas críticos constituye una de las lecciones operativas del 28-A.

```

### 📄 Archivo: `docs\07-resiliencia-futuro.mdx`
```mdx
---
sidebar_position: 7
hide_title: true
title: "Resiliencia y Futuro"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";

<GlitchTitle>Resiliencia y Futuro</GlitchTitle>

La lección estructural del 28 de abril no reside en el colapso en sí, sino en la clase de vulnerabilidad que reveló. El análisis forense demostró que el cero de tensión no fue un fallo de reserva de potencia activa ni un error puntual de operación: fue la manifestación terminal de una incompatibilidad de fondo entre la física de un sistema dominado por inversores y un marco técnico-regulatorio diseñado para redes síncronas. El escenario que propició el 28-A —alta penetración de <GlossaryLink term="IBR">IBR</GlossaryLink>, escasez de generación síncrona acoplada y demanda neta deprimida— no fue una anomalía climática, sino el anticipo de condiciones que se reproducirán con frecuencia creciente conforme avance la descarbonización.

## La física de la fragilidad sistémica

### Inercia, RoCoF y la ecuación de oscilación

La estabilidad dinámica de la frecuencia en un sistema de potencia está gobernada por la **Ecuación de Oscilación** (_Swing Equation_):

$$
\frac{2H}{f_0} \, \frac{df}{dt} = P_m - P_e - D \cdot \Delta f
$$

donde $H$ es la constante de inercia equivalente del sistema (en segundos), $f_0$ la frecuencia nominal (50 Hz), $df/dt$ la <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink>, $P_m$ la potencia mecánica total aportada a los rotores síncronos acoplados, $P_e$ la potencia eléctrica neta demandada y $D$ el coeficiente de amortiguamiento de las cargas dependientes de la frecuencia.

El parámetro central es $H$: su reducción implica que cualquier desequilibrio de potencia se traduce en un RoCoF proporcionalmente más agudo, acortando la ventana temporal disponible para la actuación de los sistemas de regulación. Los inversores <GlossaryLink term="GFL (Grid-Following)">grid-following</GlossaryLink> están desacoplados de la frecuencia de red mediante sus enlaces de corriente continua y **no aportan inercia electromecánica inherente** a la ecuación de oscilación.

El sistema certificó $H = 2,3$ s en el momento del colapso — por encima del umbral de 2,0 s recomendado por <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>. El 28-A no fue un colapso de frecuencia por déficit de masa síncrona. Sin embargo, en escenarios de penetración IBR superior al 80 %, la reducción sostenida de $H$ convierte perturbaciones de amplitud moderada en contingencias críticas, porque el tiempo disponible antes de la activación del <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink> se comprime hasta hacerlo inoperable a la velocidad mecánica de apertura de los interruptores.

### Degradación del cortocircuito: la métrica de fortaleza de red

La dimensión más directamente vinculada al mecanismo causal del 28-A es la degradación de la Potencia de Cortocircuito ($S_{sc}$) en los nudos de la red. Un generador síncrono convencional puede inyectar corrientes de cortocircuito de entre **5 y 7 veces** su valor nominal durante los primeros ciclos de un transitorio. Los inversores limitan la inyección a **1,1–1,2 p.u.** para evitar la fusión de semiconductores.

La parametrización habitual de esta pérdida es el _Short Circuit Ratio_ (SCR):

$$
\mathrm{SCR} = \frac{S_{sc,\mathrm{PCC}}}{P_{\mathrm{IBR}}}
$$

<ForensicTable 
  title="SHORT CIRCUIT RATIO (SCR) THRESHOLDS"
  source="SYSTEM ENGINEERING STANDARDS"
>

| Categoría | Umbral SCR | Implicación operativa |
| --- | --- | --- |
| **Red fuerte** | SCR > 3 | Los inversores GFL operan con estabilidad de pequeña señal. Protecciones de distancia mantienen selectividad. |
| **Red débil** | 2 ≤ SCR ≤ 3 | Degradación del margen de estabilidad del <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink> ante perturbaciones rápidas. Riesgo de interacción adversa entre lazos de control próximos. |
| **Red muy débil** | SCR &lt; 2 | PLLs propensos a pérdida de sincronismo ante variaciones de tensión menores. Protecciones de distancia pierden direccionalidad. |

</ForensicTable>

Durante las horas previas al colapso, amplias zonas de la Península operaban como **redes muy débiles** (SCR &lt; 2): la producción masiva de solar había desplazado por orden de mérito a los ciclos combinados, cuya desconexión eliminó precisamente las fuentes de $S_{sc}$ que dan rigidez a los nudos de la red de transporte. En estas condiciones, con $X/R$ elevado pero $\mathrm{SCR} \ll 2$, la impedancia global hace que la tensión se vuelva sensible también a variaciones de <GlossaryLink term="Potencia activa">potencia activa</GlossaryLink>: las rampas de inyección solar adquieren un poder de perturbación de tensión que en redes síncronas convencionales resultaría inofensivo.

![Mapas de tensión en la red peninsular de 400 kV en la franja crítica previa al colapso](/figuras/scr_iberia.png) _Evolución geográfica de las tensiones en la red de 400 kV previa al colapso (secuencia a–d). Las zonas de color cálido muestran la progresión y concentración de sobretensiones severas en el sur y suroeste peninsular —precisamente los nudos con mayor deficiencia estructural de potencia de cortocircuito. Fuente: IIT-ICAI._

### La paradoja geométrica de los inversores: conflicto P-Q

Existe una contradicción estructural inherente a la geometría del triángulo de potencia. La capacidad aparente máxima de un inversor está acotada por:

$$S_{\max} = \sqrt{P^2 + Q^2}$$

Cuando una planta fotovoltaica experimenta un aclaramiento brusco de nubosidad, sus algoritmos MPPT ordenan rampas de inyección de potencia activa $P$ de miles de MW/h. Para no superar $S_{\max}$, el controlador debe reducir simultáneamente su margen de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> $Q$. La paradoja: ese es exactamente el instante en que el aumento brusco de $P$ sobre una red con SCR &lt; 2 provoca una sobretensión severa, exigiendo al inversor una absorción masiva de reactiva para contenerla. El inversor se enfrenta a dos obligaciones físicas **simultáneamente incompatibles**: maximizar $P$ por señal de mercado y maximizar $Q$ por necesidad de estabilidad de tensión.

Esta contradicción explica por qué el 28-A no fue un colapso de energía sino de control: el sistema disponía de recursos suficientes pero carecía de la arquitectura de control necesaria para movilizarlos coherentemente.

### La duck curve y el efecto del autoconsumo distribuido

El escenario operativo del 28-A se situaba en el **valle profundo de la _duck curve_**: demanda bruta estructuralmente baja —análoga a los mínimos de hace dos décadas— con irradiación próxima a los máximos estivales por la menor degradación térmica de primavera.

![Evolución del número de unidades síncronas convencionales acopladas entre las 12h y 13h](/figuras/conventionalunits.png) _Unidades síncronas convencionales acopladas diariamente entre las 12h y 13h. La tendencia decreciente en los meses previos al 28-A refleja la expulsión sistemática por orden de mérito — vaciando al sistema de inercia electromecánica en el instante crítico. Fuente: ENTSO-E / elaboración propia._

A las 12:30 CEST, REE había agotado sus herramientas de gestión manual: apertura preventiva de decenas de líneas de muy alta tensión para aumentar la impedancia en serie, más la operación de reactancias al 85 % de su capacidad — sin lograr contener el ascenso de tensión.

Un factor adicional identificado como relevante fue el **autoconsumo fotovoltaico distribuido**: la generación distribuida detrae demanda visible sin ser observable telemáticamente a la resolución temporal necesaria. Durante los fenómenos oscilatorios previos, las fluctuaciones de tensión activaron los relés antiislamiento de instalaciones domésticas e industriales ligeras que se desconectaron en bloque, haciendo aflorar súbitamente la demanda que cubrían: el efecto equivalió a un escalón positivo de carga no anticipado, en un instante en que el sistema ya carecía de margen de reactiva para absorberlo.

## Tecnologías habilitadoras libres de emisiones

La superación de la vulnerabilidad exige una transición en la arquitectura de control: del parque de generación que _sigue_ la tensión y la frecuencia hacia una infraestructura capaz de _formarlas_ de forma autónoma. Tres familias tecnológicas complementarias articulan la respuesta.

### BESS con control grid-forming: velocidad y precisión

A diferencia del inversor GFL, un inversor <GlossaryLink term="GFM (Grid-Forming)">grid-forming</GlossaryLink> (GFM) opera como un equivalente de Thévenin: sintetiza de forma autónoma una referencia interna de tensión en magnitud y ángulo ($V\angle\delta$) detrás de una impedancia virtual de acoplamiento. Al imponer este vector de forma instantánea, el inversor GFM inyecta o absorbe corriente activa y reactiva de forma inherente ante cualquier variación de la red, sin depender de mediciones externas de fase ni de retardos de cálculo.

![Circuitos equivalentes de las topologías Grid-Following (GFL) y Grid-Forming (GFM)](/figuras/gfl_vs_gfm_circuit1.png) _Izquierda: inversor GFL como fuente de corriente controlada dependiente del PLL. Derecha: inversor GFM como fuente de tensión autónoma detrás de una impedancia virtual $Z_{\mathrm{GFM}}$. La diferencia fundamental es que el GFM no necesita «leer» la red para operar — la crea._

Cuando el inversor GFM está respaldado por un banco de baterías (BESS-GFM), la combinación provee dos servicios adicionales:

- **<GlossaryLink term="Inercia Sintética">Inercia sintética</GlossaryLink>**: el algoritmo mide continuamente $df/dt$ y ajusta la potencia de salida de forma proporcional en el rango de **decenas de milisegundos**, emulando el comportamiento de una masa rotatoria.
- **<GlossaryLink term="Fast Frequency Response (FFR)">FFR</GlossaryLink>**: ante la superación de un umbral de RoCoF o desviación de frecuencia, el BESS inyecta un bloque de potencia activa predefinido de forma **subcíclica** (≤ 0,25 s), frenando la pendiente de caída antes de que los reguladores de velocidad de los grupos síncronos hayan podido procesar la perturbación.

La experiencia operativa de ERCOT (Texas) cuantifica el valor de este servicio. El umbral de inercia crítica estructural se sitúa en torno a **100.000 MW·s**: por debajo de este nivel, el RoCoF ante una contingencia de categoría C (~2.750 MW) hunde la frecuencia antes de que los gobernadores mecánicos puedan actuar. El sistema opera con tres zonas de alerta: **verde** (>120.000 MW·s), **amarilla** (110.000–119.999 MW·s) y **roja** (&lt;100.000 MW·s, con despacho forzado de unidades síncronas fuera de orden de mérito).

El mercado _Responsive Reserve Service – Fast Frequency Response_ (RRS-FFR) de ERCOT exige: detección autónoma de caída por debajo de 59,85 Hz, inyección del 100 % de la potencia contratada en máximo **0,25 s**, y mantenimiento durante mínimo 15 minutos. Los resultados verificados muestran que la integración de **450 MW** bajo este esquema permitió reducir el umbral de inercia crítica de 100.000 MW·s a **88.000 MW·s** — un descenso del 12 % que refleja la equivalencia funcional entre la actuación sub-segundo de la electrónica de potencia y la masa cinética de las máquinas síncronas.

El caso de éxito fundacional a nivel mundial en este ámbito es la **Hornsdale Power Reserve** en Australia del Sur (operada por Neoen y Tesla). Tras su actualización de firmware a *Grid-Forming* en 2022, este sistema BESS de 150 MW / 193,5 MWh logró certificar la provisión operativa de **2.000 MWs de inercia equivalente**. El operador australiano AEMO aprobó esta contribución, que por sí sola es capaz de cubrir aproximadamente el 15 % de la inercia mínima requerida en el estado, demostrando empíricamente la viabilidad de sostener redes a gran escala puramente con electrónica de potencia.

Sin embargo, los semiconductores IGBT raramente sostienen corrientes superiores a **1,2–1,5 veces** su valor nominal. Esta restricción implica que la contribución de los BESS-GFM a la potencia de cortocircuito disponible en el nudo es cuantitativamente limitada. El paper más avanzado sobre este límite es *Cross-Forming Control* (Dörfler et al., ETH Zürich, 2024), que propone arquitecturas híbridas de control para evitar la saturación de corriente durante las faltas.

### Compensadores síncronos: cortocircuito e inercia rotacional genuina

La limitación de corriente de los inversores justifica el despliegue complementario de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink> (SynCons): máquinas rotativas de gran masa acopladas síncronamente pero operadas en vacío, que intercambian libremente potencia reactiva en función del nivel de excitación.

Su aportación es doble: corrientes de cortocircuito del orden del **300–400 %** de su valor nominal durante los primeros ciclos, incrementando el SCR en el nudo de conexión; e inercia rotacional genuina físicamente disponible en el **primer milisegundo** de un transitorio, sin mediación de algoritmo ni latencia de control.

La **<GlossaryLink term="Estrategia Brownfield">estrategia Brownfield</GlossaryLink>** propone una vía de despliegue que minimiza la inversión en nueva obra civil: reconvertir los grandes alternadores de centrales de carbón, ciclo combinado o nuclear en proceso de desmantelamiento en compensadores síncronos, una vez desacoplado el conjunto turbina-generador. Esta reconversión transforma activos varados en recursos de estabilidad sistémica, conservando el valor de los nudos de evacuación de 400 kV ya instalados.

### Arquitectura híbrida: la complementariedad como condición de resiliencia

Ninguna de las tres familias tecnológicas, desplegada de forma aislada, es suficiente:

- Los **BESS-GFM** proveen velocidad de respuesta, precisión de control y capacidad de _Black Start_, pero están limitados en corriente de cortocircuito.
- Los **SynCons** proveen inercia rotacional genuina y potencia de cortocircuito elevada, pero carecen de la agilidad subcíclica de la electrónica de potencia y no gestionan energía activa.
- La **inercia sintética y la FFR** maximizan la utilización del margen energético del banco de baterías, pero dependen de una rigidez nodal mínima —provista por los SynCons— para que sus algoritmos sean efectivos.

![Arquitectura híbrida para la resiliencia sistémica en redes descarbonizadas](/figuras/hitachi_hybrid.png) _Esquema de arquitectura híbrida: los BESS-GFM gestionan la tensión en tiempo real y proveen FFR; los compensadores síncronos aportan inercia rotacional y potencia de cortocircuito para la rigidez nodal. La resiliencia requiere ambos componentes — ninguno es sustituto del otro. Fuente: Hitachi Energy / FUTURED._

La minimización del coste total del sistema no coincide con la minimización del <GlossaryLink term="Coste Nivelado de la Energía (LCOE)">LCOE</GlossaryLink>, sino que exige internalizar en el diseño de mercado los <GlossaryLink term="Servicios Esenciales de Confiabilidad (ERS)">Servicios Esenciales de Confiabilidad (ERS</GlossaryLink>) que las máquinas síncronas aportaban de forma implícita.

![Optimización tecno-económica de la resiliencia en sistemas dominados por IBR](/figuras/coste_optimo_ers.png) _El mínimo de coste total del sistema se alcanza con un mix que remunera los ERS, no con la simple maximización de la penetración renovable. La diferencia entre el óptimo de LCOE y el óptimo sistémico es el coste de los servicios ancilares no remunerados. Fuente: Julia Matevosyan (ESIG) / FUTURED._

### IA y Redes Neuronales de Grafos (GNN) para la estabilidad

El vacío entre el estado del arte académico y la realidad operativa de los TSOs europeos quedó patente en el apagón ibérico. Mientras que despachos como el de REE o RTE (Francia) siguen utilizando herramientas de análisis modal clásico para monitorizar las Unidades de Medición Fasorial (PMU), la frontera investigadora ha resuelto la predicción del colapso mediante *Deep Learning*.

Las arquitecturas de **Redes Neuronales de Grafos (GNN)** son inherentemente topológicas: entienden la red eléctrica no como variables independientes, sino como un grafo interconectado de impedancias. Modelos matemáticos recientes (como los de Nauck et al., 2023) aplican GNNs sobre datos fasoriales para predecir la *Cuenca de Estabilidad* de un nodo (SNBS) antes de que la tensión empiece a caer. De manera similar, arquitecturas basadas en *Transformers* (como el modelo StaaT, 2024) han demostrado superar holgadamente a las redes LSTM en la predicción de estabilidad de tensión a corto plazo utilizando únicamente series temporales de PMUs. La implementación de un sistema de Inteligencia Artificial basado en estas arquitecturas habría detectado el estrechamiento del margen Q-V en el nudo de Granada minutos antes de que el transformador colapsara térmicamente.

### Enjambres Multi-Agente para Black-Start Descentralizado

El *black-start* ibérico de 2025 requirió casi 16 horas para restablecer por completo la península operando bajo el clásico modelo *top-down* centralizado. El futuro de la reposición de suministro, especialmente con el despliegue del Grid-Forming, apunta a un modelo distribuido. Mediante Sistemas Multi-Agente (MAS), múltiples microrredes equipadas con GFM pueden pre-sincronizarse de forma autónoma (comunicándose entre ellas mediante algoritmos de consenso) formando "islas vivas" que posteriormente se conectan entre sí. Esta técnica, ya probada en pilotos como el de Holy Cross Energy en Colorado (NREL, 2024), tiene el potencial de reducir los tiempos de reposición de días a meras horas.

## La respuesta normativa: del P.O. 7.4 obsoleto al grid-forming obligatorio

### Las deficiencias del marco preexistente

El P.O. 7.4 vigente en el momento del apagón no había sido revisado sustancialmente en aproximadamente **veinticinco años**. Presentaba dos deficiencias críticas:

1. **Asimetría de participación**: el 82 % del parque generador operaba con factor de potencia fijo, inhabilitado para inyectar o absorber reactiva dinámicamente.
2. **Banda muerta**: los generadores síncronos estaban eximidos de actuar si la tensión se mantenía entre 405 kV y 410 kV, configurando una respuesta por escalones estructuralmente incompatible con la velocidad del transitorio capacitivo documentado.

![Curva característica del P.O. 7.4 original: banda muerta entre 405 kV y 410 kV](/figuras/po74_banda_muerta.png) _La zona sombreada ilustra la «banda muerta» del antiguo P.O. 7.4: rango en el que el parque generador no estaba obligado a proveer respuesta dinámica, inhabilitando la defensa del sistema frente a transitorios capacitivos rápidos. Fuente: REE._

### Revisión del P.O. 7.4, sistema VOLTAIRE y nuevo esquema retributivo

La Resolución de la CNMC de 12 de junio de 2025 (BOE-A-2025-13076) reformuló el P.O. 7.4 bajo el nuevo marco de servicios de no frecuencia. La innovación fundamental es la sustitución del modelo de consignas estáticas por una **prestación dinámica retribuida**: seguimiento preciso de _setpoints_ en tiempo real enviados telemáticamente por el CECOEL a través del CECRE.

El canal de comunicación se articula a través del sistema **VOLTAIRE**: un lazo de control proporcional-integral en dos capas jerárquicas. La Regulación Terciaria optimiza globalmente el perfil de tensiones mediante flujos de cargas óptimos reactivos. La Regulación Secundaria envía consignas telemáticas en tiempo real con una **resolución de muestreo de 4 s**, cerrando el bucle de control a escala de parque y eliminando la dependencia de la respuesta manual del operador ante transitorios de baja amplitud. Esta arquitectura transforma el rol del parque renovable: de consumidor pasivo de la tensión de red a **actuador activo del sistema de regulación nacional**.

La retribución asociada incluye: **2 €/MVArh** para la prestación en tiempo real durante horas con producción neta positiva; y para horas con producción nula —período nocturno en que el Efecto Ferranti de las líneas descargadas genera sobretensiones— una retribución indexada al Precio Medio Diario:

$$r_Q = 0,05 \times 1,15 \times \mathrm{PMD} + 5 \quad [€/\mathrm{MVArh}]$$

Los sistemas BESS reciben adicionalmente un pago de disponibilidad de **2,7 €/MW/día**, condicionado al mantenimiento de una tasa de cumplimiento de muestras válidas superior al **90 %**.

<ForensicTable 
  title="P.O. 7.4 REGULATORY FRAMEWORK COMPARISON"
  source="BOE-A-2025-13076 / CNMC"
>

| Atributo operativo | P.O. 7.4 original (pre-2025) | Marco actualizado (post-2025) |
| --- | --- | --- |
| Naturaleza del control | Estática y asimétrica. Operación por escalones. | Dinámica, continua y proporcional a la desviación. |
| Participación IBR | _Grid-following_ pasivo con factor de potencia fijo. | _Grid-forming_ obligatorio. Control activo de $V$ y $Q$. |
| Banda muerta | 405–410 kV sin respuesta obligatoria. | Eliminada o reducida a ±0,5 % de $U_n$. |
| Respuesta en reactiva | Escalones de consigna lenta tras petición del OS. | Respuesta automática en bucle cerrado (_droop control_). |
| Remuneración de Q | Basada en disponibilidad técnica declarada. | Mercados zonales de servicios ERS. |
| Observabilidad | Telemedidas SCADA 400 kV, resolución de varios segundos. | PMU y telemedida de 4 s para IBR distribuidos. |
| Régimen sancionador | Sin penalizaciones específicas por incumplimiento de reactiva. | Penalizaciones por incumplimiento de la tasa mínima del 90 %. |

</ForensicTable>

El **Real Decreto 997/2025** complementó la reforma con cuatro medidas de urgencia: redefinición jurídica de los BESS como activos de servicio de estabilidad sistémica; saneamiento del registro de permisos de conexión obsoletos; obligatoriedad de telemedida con resolución &lt; 4 s para todo el parque IBR significativo; y obligatoriedad del módulo PSS/POD en todos los inversores GFM de nueva instalación con potencia > 10 MW.

Una tensión reveladora emergió durante el proceso: en octubre de 2025, REE solicitó elevar la exigencia de cumplimiento del 75 % al 90 % del tiempo. La CNMC lo denegó argumentando la **imposibilidad técnica de los grupos síncronos existentes** para alcanzar ese nivel con las rampas de ajuste requeridas. El dato es significativo en sentido inverso: los inversores GFM podrían cumplir sin dificultad esa exigencia. La adaptación del marco operativo a las capacidades de los IBR-GFM avanza a mayor velocidad que la de los activos síncronos que la norma sustituye como proveedores de servicios ancilares.

### El marco europeo: NC RfG 2.0 e Informes de Fase I y Fase II de ENTSO-E

El <GlossaryLink term="NC RfG">NC RfG</GlossaryLink> vigente en la última década fue diseñado bajo el paradigma GFL: estandarizaba perfiles de hueco y umbrales de frecuencia, pero no contemplaba la posibilidad de que no quedara ninguna máquina rotatoria pesada a la que seguir. Esta carencia conceptual quedó demostrada en los 8 segundos del colapso ibérico.

El Grupo Técnico de ENTSO-E (TG GFC) cristalizó su trabajo en dos documentos:

- **Informe de Fase I (mayo 2024)**: Definición técnica fundamental del GFM requerida por el nuevo código — «fuente de tensión detrás de una reactancia efectiva constante» durante los primeros milisegundos. Este modelo fasorial proscribe de facto las dependencias directas de algoritmos PLL para el control primario.
- **Informe de Fase II (noviembre 2025)**: Publicado bajo el peso de la evidencia del colapso ibérico, con el aval transversal de CENELEC, WindEurope, SolarPower Europe y EASE. Establece de forma taxativa cómo las nuevas plantas basadas en inversores deben estabilizar el sistema.

Las obligaciones del **NC RfG 2.0** se aplican con un enfoque tecnológicamente agnóstico, clasificando los módulos en cuatro tipos:

<ForensicTable 
  title="NC RFG 2.0 (PROPOSED) COMPLIANCE TIERS"
  source="ENTSO-E TG GFC"
>

| Tipo | Potencia / Conexión | Requisito GFM | Cronograma |
| --- | --- | --- | --- |
| **Tipo A** | &lt; 1 MW | Voluntario. Criterio del DSO. | N/A |
| **Tipo B** | 1–50 MW | Obligatorio. Inercia sintética y soporte dinámico básico. | Máx. 3 años tras publicación del IGD de ENTSO-E. |
| **Tipo C** | > 50 MW | Obligatorio y exhaustivo. Operación plena como fuente de tensión; perfiles de corriente de falta; funcionalidad POD. | 3 años tras adopción por la Comisión Europea. |
| **Tipo D** | ≥ 110 kV o > 75 MW | Ídem Tipo C más pruebas de certificación. | 3 años tras adopción por la Comisión Europea. |
| **ESM (BESS)** | Según categoría | Ídem PPM equivalente. Sistemas V2G con capacidad conjunta > 1 MW clasificados como ESM Tipo B. | Según categoría. |

</ForensicTable>

A la fecha de redacción, la adopción formal del NC RfG 2.0 por la Comisión Europea **se encuentra despriorizada y sin calendario oficial**, generando una ventana de incertidumbre regulatoria que los operadores nacionales están gestionando mediante medidas preventivas al margen del código.

## Mercados de Servicios Esenciales de Confiabilidad (ERS)

### El problema del headroom: por qué el mercado de energía no remunera la estabilidad

Para que un inversor GFM pueda actuar como fuente de tensión ante un RoCoF severo o una perturbación, debe mantener obligatoriamente una reserva de su capacidad aparente ($S_{\max}$) no utilizada en estado estacionario. Esta reserva —el **_headroom_**— exige o bien limitar deliberadamente la potencia activa inyectada en el mercado diario, o bien sobredimensionar la etapa de potencia de sus IGBT aumentando drásticamente el CAPEX. Sin compensación económica directa, ninguna de las dos opciones es viable comercialmente.

El fracaso estructural de la arquitectura regulatoria hasta el 28-A residía en su enfoque punitivo: penalizar las desviaciones técnicas sin remunerar los atributos de firmeza. Los ERS corrigen esta asimetría.

### Tres mecanismos de remuneración

**1. Mercados regionales de inercia sintética y FFR.** El diseño avanzará hacia subastas donde se abone un pago de disponibilidad a los activos capaces de proveer soporte inercial en márgenes &lt; 5 ms. La lógica del mecanismo es el **_revenue stacking_**: los sistemas BESS perciben ingresos simultáneos de arbitraje de energía en el mercado diario, de las subastas de regulación secundaria y terciaria (aFRR/mFRR), y de pagos por capacidad de inercia sintética y FFR. Esta multiplicidad de flujos de ingresos compensa el elevado CAPEX del sobredimensionamiento y la pérdida de ingresos por el _headroom_ de reactiva.

**2. Señales geográficas de nivel de cortocircuito.** A diferencia de la frecuencia —una métrica global—, el SCR y las sobretensiones son fenómenos **radicalmente locales**. Los nudos vulnerables del 28-A no coinciden con los de mayor densidad de potencia instalada. Los mercados de ERS adoptarán señales de precios espaciales granulares: tarifas de conexión descontadas o subastas de capacidad de reactiva en los nudos perimetrales identificados matemáticamente por los TSOs como enclaves con SCR &lt; 2. La ubicación de los BESS-GFM en los nudos correctos pasa a ser determinante para la viabilidad económica del proyecto.

**3. Remuneración _ex ante_ para SynCons.** Para infraestructuras como los SynCons —que aportan inercia física pura y corrientes de cortocircuito masivas pero no pueden vender energía en el mercado horario— la regulación contempla modelos de _Rate of Return Regulation_ sin exposición al riesgo de precio de la energía, o adjudicaciones a largo plazo que blindan la inversión de capital.

![Diagrama de revenue stacking para un sistema BESS-GFM bajo el marco post-28A](/figuras/ers_revenue_stacking.png) _Fuentes de ingresos apiladas para un sistema BESS-GFM: mercado de energía diario, mercados de balance de frecuencia (aFRR/mFRR), subastas de inercia sintética y FFR, y pagos por disponibilidad de reactiva ERS. La multiplicidad de flujos compensa el sobredimensionamiento técnico requerido. Fuente: elaboración propia basada en estructura ENTSO-E._

### Modelos de referencia: DS3 de EirGrid y RRS-FFR de ERCOT

EirGrid (Irlanda) y ERCOT (Texas) son las referencias operativas contrastadas hacia las que converge el diseño europeo: ambos operadores han enfrentado con antelación los desafíos de penetraciones no síncronas superiores al 75 %.

El programa **DS3** de EirGrid fragmentó la provisión de estabilidad en 14 productos especializados. Los tres más relevantes para el contexto del 28-A:

<ForensicTable 
  title="EIRGRID DS3 SERVICES - CORE PARAMETERS"
  source="EIRGRID DS3 PROGRAMME"
>

| Servicio | Definición técnica | Umbral / Ventana |
| --- | --- | --- |
| **Synchronous Inertial Response (SIR)** | Provisión cuasi-instantánea de potencia activa y par sincronizante ante caídas de frecuencia. Remunerado mediante índice SIRF = $E_k / P_{\min}$, que penaliza el despacho de plantas que inyectan potencia no deseada solo para aportar inercia marginal. | SIRF ≥ 15 s |
| **Fast Frequency Response (FFR)** | Inyección rápida de potencia activa tras caída abrupta de frecuencia. La energía validable es la integral de la potencia adicional inyectada en los primeros 10 s. Se exige que la energía provista sea mayor que la pérdida en la recuperación (T+10s → T+20s). | Respuesta entre 0,15 s y 2 s |
| **Steady-State Reactive Power (SSRP)** | Rango total de potencia reactiva despachable ($Q_{\mathrm{range}}$) que el inversor puede inyectar o absorber en operación continua a lo largo de su rango completo de potencia activa. Incluye escalar retributivo favorable para IBR capaces de proveer reactiva en vacío (_watt-less VARs_). | Estado estacionario; valoración anual mediante modelos PLEXOS |

</ForensicTable>

La comparación entre DS3 y RRS-FFR sugiere una arquitectura de **mercados ERS de doble capa** para el contexto europeo: una capa de señales geográficas de cortocircuito —análoga al SSRP de EirGrid— y una capa de respuesta de frecuencia subcíclica —análoga al RRS-FFR de ERCOT.

### Evolución del marco español en 2026

El 8 de mayo de 2026, la CNMC abrió un trámite de audiencia pública para la modificación de los Procedimientos de Operación P.O. 7.4 y P.O. 14.4 (Expediente DCOOR/DE/006/26), orientado a la creación de mercados zonales de servicios de no frecuencia con participación activa de IBR y BESS.

La lección estructural del 28-A inscribe en el diseño regulatorio europeo una consecuencia de alcance mayor que cualquier ajuste incremental a los procedimientos de operación: los atributos físicos que los sistemas síncronos aportaban de forma inherente —inercia, potencia de cortocircuito, control autónomo de tensión— **han dejado de ser externalidades gratuitas** para convertirse en servicios cuya provisión debe ser definida, verificada y remunerada explícitamente. El modelo marginalista puro de energía es estructuralmente incapaz de remunerar esos atributos. Sin esa traducción económica de la resiliencia, ninguna exigencia técnica del NC RfG 2.0 resultará sostenible en el medio plazo.

```

### 📄 Archivo: `docs\07b-consecuencias-financieras.mdx`
```mdx
---
sidebar_position: 7.5
hide_title: true
title: "Consecuencias Financieras y Costes de Resiliencia: Auditoría Económica"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import FinancialWaterfallChart from "@site/src/components/FinancialWaterfallChart";

<GlitchTitle>Consecuencias Financieras y Costes de Resiliencia: Auditoría Económica</GlitchTitle>

El colapso sistémico de la red eléctrica de la península ibérica, materializado el 28 de abril de 2025 a las 12:33 horas (CEST), representa uno de los eventos de disrupción de infraestructuras críticas más severos en la historia económica contemporánea de la Unión Europea. Con una pérdida instantánea de **31 gigavatios (GW)** de carga, la desconexión abrupta de los sistemas de España y Portugal de la red síncrona continental, y la afectación directa a más de **50 millones de ciudadanos** y la totalidad del tejido productivo peninsular, las ramificaciones de este suceso trascienden la fenomenología puramente electromecánica. 

Este evento, catalogado por la Red Europea de Gestores de Redes de Transporte de Electricidad (ENTSO-E) como inédito y multifactorial, ha expuesto vulnerabilidades estructurales profundas en el diseño del mercado energético, la planificación de la transición ecológica y los esquemas de contingencia regulatoria.

El presente informe técnico despliega una auditoría financiera y macroeconómica de carácter exhaustivo, estructurada para desentrañar y cuantificar las repercusiones directas del cero de tensión, la subsiguiente onda expansiva de litigiosidad y expedientes sancionadores, y el coste ineludible de la adaptación tecnológica estructural (CAPEX) requerida para mitigar el riesgo de futuros eventos de riesgo de cola (*tail-risk*). 

A través del prisma de la economía de la energía y la auditoría de infraestructuras críticas, la premisa analítica fundamental que rige este documento demuestra axiomáticamente que **el coste del capital destinado a la resiliencia sistémica es órdenes de magnitud inferior a la masiva destrucción de valor** (OPEX sobrevenido, lucro cesante e indemnizaciones cruzadas) generada por la vulnerabilidad de la red.

---

## 1. El Coste Directo del Apagón (Pérdidas Inmediatas y Macroeconomía)

La evaluación rigurosa de las pérdidas económicas inmediatas derivadas de un colapso eléctrico no puede restringirse exclusivamente a la facturación no realizada por las empresas generadoras y distribuidoras. Por el contrario, exige un análisis de equilibrio general que parametrice el impacto paralizante sobre el Producto Interior Bruto (PIB) de la región afectada durante el lapso de interrupción generalizada. Para la articulación de este cálculo, la ortodoxia de la economía de la energía impone la utilización de la métrica del **Valor de la Energía No Suministrada (VoLL, por sus siglas en inglés: Value of Lost Load)**.

### Análisis del Valor de la Energía No Suministrada (VoLL) en la Economía Ibérica

El VoLL constituye el estándar regulatorio y académico —avalado por la Agencia de Cooperación de los Reguladores de la Energía (ACER) y el Consejo de Reguladores Europeos de la Energía (CEER)— para estimar el precio marginal máximo que los consumidores estarían dispuestos a abonar (*Willingness to Pay - WTP*) para evitar una interrupción del suministro, o alternativamente, la compensación exigida (*Willingness to Accept - WTA*) por sufrir dicho corte. Funciona como una aproximación monetaria directa al excedente marginal del consumidor asociado a la continuidad y seguridad de la infraestructura eléctrica.

Durante el apagón del 28 de abril de 2025, la península ibérica se enfrentó a un cero absoluto de tensión que desconectó súbitamente 31 GW de carga base y pico. La restitución del suministro operó bajo una dinámica asimétrica y gradual; mientras que para las 19:00 horas del mismo día se había logrado restablecer el 35% de la demanda, vastas áreas industriales y metropolitanas no recuperaron la normalidad operativa hasta la madrugada del 29 de abril, transcurriendo en algunos nodos hasta **14 horas de blackout ininterrumpido** y finalizando los trabajos técnicos a las 14:36 horas del día 29.

Para parametrizar el coste macroeconómico agregado, es imperativo desglosar el VoLL por segmentos sectoriales, dada la profunda heterogeneidad en la dependencia energética, la resiliencia de los procesos y la elasticidad del daño financiero frente al tiempo de interrupción. Las metodologías econométricas de la Unión Europea y los estudios de fallas (*Blackout Studies*) establecen las siguientes horquillas valorativas para economías desarrolladas equivalentes a la española y portuguesa.

| Sector Macroeconómico | Rango VoLL Estimado (€/kWh) | Sensibilidad Marginal a la Interrupción | Impacto de Segundo Orden (*Ripple Effects*) en la Economía |
| :--- | :--- | :--- | :--- |
| **Residencial / Doméstico** | 5,00 - 45,00 | Baja-Media (Aumenta exponencialmente con la duración) | Pérdida de bienestar térmico, deterioro de inventarios perecederos, interrupción masiva de la productividad laboral por la caída del teletrabajo y comunicaciones. |
| **Servicios / Comercio Minorista** | 15,00 - 90,00 | Media-Alta (Sensibilidad extrema en horarios diurnos) | Cierre forzoso de establecimientos comerciales, paralización absoluta de pasarelas de pago y datáfonos, colapso logístico y de servidores de datos en el sector terciario. |
| **Industrial (Manufactura General)** | 50,00 - 250,00 | Muy Alta (Procesos en cadena) | Desabastecimiento de líneas de producción, pérdida de materias primas por paradas no secuenciadas, daños en bienes de equipo por transitorios de tensión y rotura de cadenas de suministro Just-In-Time. |

Tomando en consideración la curva de demanda real, programada y prevista para el día 28 de abril, y calculando la integral del área bajo la curva desde las 12:33 horas (momento del colapso) hasta el restablecimiento progresivo del 99,95% de la demanda a las 07:00 horas del 29 de abril, la Energía No Suministrada (ENS) agregada para el sistema ibérico se sitúa de forma conservadora en el espectro de los **150.000 a 180.000 Megavatios-hora (MWh)**, es decir, entre 150 y 180 GWh.

La aplicación de un VoLL medio ponderado —que internaliza la paralización concurrente del sector primario, secundario y terciario en un día laborable (lunes)— proyecta un impacto financiero devastador. Las auditorías y estimaciones preliminares elaboradas por corporaciones como la CEOE y ATA convergieron en situar la destrucción directa e indirecta de valor en la horquilla de los **1.000 a 1.500 millones de euros**. Esta cifra, congruente con el modelo analítico del VoLL, expone que la carencia coyuntural de un bien cuyo precio de mercado diario oscilaba en niveles deprimidos (18,50 €/MWh en el pool antes del apagón) provocó externalidades negativas multimillonarias.

Este impacto macroeconómico se vio amplificado de manera sistémica por el colapso colateral de los servicios de telecomunicaciones e internet. Las métricas de enrutamiento global evidenciaron que, en el instante del apagón, el tráfico de internet en Portugal continental se desplomó inicialmente a la mitad, cayendo hasta un 90% en las cinco horas subsiguientes respecto a la línea base histórica, lo que arrastró consigo a ecosistemas financieros, plataformas fintech y operativas cloud transnacionales, originando un lucro cesante intangible de proporciones masivas.

### Distorsión de Precios en el Mercado Mayorista (OMIE) y el PVPC

La crisis de infraestructura provocó un cisma financiero inmediato en el mercado diario e intradiario gestionado por el Operador del Mercado Ibérico de Energía (OMIE). En la fase temporal inmediatamente anterior al colapso, concretamente en la mañana del 28 de abril, el mercado mostraba claros síntomas de sobreoferta renovable; el precio marginal se situaba en niveles anormalmente bajos, promediando apenas **5,79 euros por megavatio hora (MWh)**, e incluso registrando tramos horarios con precios nulos o marginalmente negativos (donde el sistema remuneraba hasta 10 €/MWh por la retirada de energía).

No obstante, la reconstrucción topológica de la red posterior al apagón (*black-start*) y la necesidad imperativa de inyectar inercia rotacional y control de tensión forzaron al operador del sistema (REE) a alterar drásticamente la jerarquía del despacho económico. El restablecimiento exigió marginar parcialmente la generación renovable e hidroeléctrica, recurriendo de urgencia a las centrales térmicas de ciclo combinado de gas natural. Al dictar el gas el precio marginal de casación, el coste de la electricidad en el mercado mayorista experimentó un incremento exponencial, multiplicándose por cinco de manera casi instantánea frente a los niveles pre-apagón.

Este encarecimiento no operó en el vacío, sino que se trasladó con suma celeridad a los consumidores, especialmente a aquellos indexados al Precio Voluntario para el Pequeño Consumidor (PVPC). Los sobrecostes originados por las restricciones técnicas necesarias para mantener el sistema a flote tras el apagón provocaron que los clientes regulados experimentaran un **incremento del 125%** en el componente específico de restricciones de su factura, materializándose en un aumento medio estructural de más de 3 euros mensuales por hogar y trasladando un coste sistémico ineficiente a los estratos de consumidores vulnerables.

---

## 2. El Impacto del Deslastre Automático en los Consumidores Electrointensivos

Más allá del sector comercial y residencial, el epicentro del daño material directo recayó sobre el tejido industrial pesado. Ante la caída incontrolada de la frecuencia y la tensión, los automatismos de la red activaron protocolos de supervivencia extrema, desencadenando el deslastre automático de cargas. Este mecanismo de seccionamiento de emergencia, diseñado para aislar nodos y evitar el daño en la red de transporte de muy alta tensión (400 kV), operó como una guillotina operativa para la industria.

Los consumidores electrointensivos, caracterizados por mantener procesos de termodinámica crítica en flujo continuo ininterrumpido (siderurgia, metalurgia, electrólisis, refino), sufrieron disrupciones operativas letales. La Asociación de Empresas con Gran Consumo de Energía (AEGE), que aglutina a gigantes como Acerinox, ArcelorMittal, Asturiana de Zinc (Azsa), Ercros y Grupo Gallardo Balboa, reportó pérdidas financieras auditadas superiores a los **25 millones de euros** derivados de este evento aislado.

Este sumatorio delata la fragilidad del CAPEX industrial frente a las perturbaciones de la red y se estructura en dos vectores de pérdida claramente diferenciados:

1. **Daños Operativos Directos (Estimados en más de 13 millones de euros):** La supresión súbita de la alimentación eléctrica sin rampa de parada controlada provocó colapsos térmicos masivos. En plantas metalúrgicas, la interrupción en hornos de arco eléctrico originó la solidificación de metales líquidos en crisoles y líneas de colada, destruyendo revestimientos refractarios. La reactivación de estas líneas implicó jornadas completas dedicadas exclusivamente a la limpieza industrial, retirada de escoria endurecida y sustitución de bienes de equipo quemados por los transitorios de tensión generados en el instante del deslastre.
2. **Lucro Cesante y Costes de Oportunidad (Estimados en 12 millones de euros):** Si bien la interrupción neta del suministro en ciertos polígonos osciló entre las cuatro y las catorce horas, la inercia termodinámica de estos procesos es implacable. El encendido, precalentamiento y recalibración de las líneas de producción supuso, en términos prácticos, "pérdidas de varios días después", aniquilando la capacidad de las factorías para cumplir con las entregas pautadas (*Just-In-Time*), e induciendo penalizaciones en los contratos de suministro internacionales.

Desde una óptica macroeconómica superior, la falta de una arquitectura de red capaz de garantizar el suministro y la incapacidad de establecer compensaciones ágiles han erosionado drásticamente el capital reputacional de España y Portugal. El riesgo operativo de sufrir paradas no programadas supera financieramente cualquier descuento horario en el megavatio-hora, demostrando que la seguridad de suministro es el pilar innegociable de la política industrial.

---

## 3. El Coste Legal y Regulador (Sanciones y Litigiosidad)

La onda sísmica generada por el apagón del 28 de abril no se disipó con la resincronización de los alternadores; mutó rápidamente en una profunda crisis institucional y jurídica. Lo que la ENTSO-E diagnosticó como una avería originada por un fallo técnico "inédito, imprevisible y multifactorial", se transformó en la arena doméstica en un cruce incesante de acusaciones, auditorías punitivas y demandas mercantiles cruzadas, destruyendo sinergias vitales para la coordinación sectorial.

### Ofensiva Sancionadora de la CNMC

Operando bajo sus prerrogativas como organismo supervisor de cumplimiento normativo (*ex-post*), la Dirección de Instrucción de Energía de la Comisión Nacional de los Mercados y la Competencia (CNMC) lanzó una campaña de escrutinio sin precedentes. Argumentando la existencia de un ecosistema de indisciplina técnica entre los actores del mercado, la CNMC desplegó una investigación forense que analizó la telemetría operativa de los dos años previos al evento, culminando en la incoación de hasta **66 expedientes sancionadores**.

Estos procedimientos administrativos impactaron contra el núcleo duro del oligopolio eléctrico y gestor de infraestructuras: Iberdrola, Endesa, Naturgy, Repsol y el propio operador del sistema, Red Eléctrica de España (REE). Los cargos principales orbitaron en torno a indicios de incumplimientos continuados en las normativas de programación diaria, desviaciones en las consignas de control dinámico de tensión y la deficiente inyección/absorción de potencia reactiva.

De singular relevancia jurídica y técnica fue la apertura de un expediente calificado como "grave" contra Mercuria Sostenible, entidad gestora de la Infraestructura Común de Evacuación (ICE) emplazada en la subestación de Huéneja, en la provincia de Granada. Esta investigación situó a la promoción de energías renovables en el foco del huracán regulatorio, pues los análisis topológicos del apagón señalaron dicha subestación como el "punto cero", funcionando como una inmensa regleta colectora donde la falta de mitigación de sobretensiones propició la primera desconexión en cascada masiva de plantas fotovoltaicas, eólicas y termosolares.

El marco punitivo desplegado por la CNMC se ancla estrictamente en el articulado de la Ley 24/2013, del Sector Eléctrico (LSE), revelando contingencias financieras formidables para los balances de las *utilities*:
- **Infracciones "Graves":** Tipificadas bajo los artículos 64.15, 64.16 y 64.17 de la LSE, conllevan sanciones pecuniarias con un techo máximo de **6 millones de euros** por expediente.
- **Infracciones "Muy Graves":** Sustentadas bajo preceptos como el artículo 64.37 y el artículo 61.a (poner en riesgo manifiesto la garantía de suministro). El castigo financiero estipulado para estas faltas asciende hasta un límite máximo de **60 millones de euros** por infracción.

### La Guerra Mercantil por Daños, Perjuicios y Competencia Desleal

En paralelo al asedio administrativo, el vacío de responsabilidades institucionales desató una agresiva guerra judicial entre las grandes corporaciones, evidenciando el peso económico del "riesgo reputacional" en un mercado energético bursatilizado. La confrontación más paradigmática ha sido la interposición de una demanda civil por parte del grupo Iberdrola contra el gestor de la red de transporte Red Eléctrica (REE) y su sociedad matriz, Redeia Corporación, sustentada en la Ley de Competencia Desleal.

La génesis de este litigio se halla en las manifestaciones proferidas por la cúpula ejecutiva de Redeia durante el periodo de crisis, donde argumentó que REE ejecutó "5.000 maniobras impecables" y deslizó responsabilidades hacia el comportamiento anómalo de la red de generación renovable y el autoconsumo, apuntando de forma directa a ineficiencias críticas en el control de tensión de la magna planta fotovoltaica Núñez de Balboa, propiedad de Iberdrola.

Iberdrola estructuró una audaz estrategia legal, eludiendo la vía contencioso-administrativa, para incardinar el conflicto en la jurisdicción civil ordinaria. Iberdrola argumentó con contundencia que las declaraciones públicas emanadas desde la cúpula directiva de REE resultaron inexactas, parciales e innecesariamente despectivas, construyendo una narrativa mediática que transfirió injustamente la responsabilidad del cero nacional a la gestión privada de la eléctrica, devaluando el prestigio de la compañía frente a sus accionistas y penalizando coyunturalmente su valor bursátil.

---

## 4. El Coste de las Reformas Obligatorias (CAPEX: Retrofitting y Nuevo P.O. 7.4)

El análisis forense del colapso ibérico expuso de manera incontrovertible la obsolescencia técnica de una red de transporte que ha transicionado aceleradamente hacia una alta penetración de electrónica de potencia distribuida incapaces, bajo la regulación previa, de sostener parámetros críticos como la tensión y la inercia rotacional pura.

### La Sostenibilidad Financiera y la "Operación Reforzada" (El OPEX Tóxico)

Como parche de contención de emergencia inmediatamente posterior al apagón, Red Eléctrica instauró la denominada **"Operación Reforzada"**. Esta doctrina operativa restringe severamente la participación de energías renovables en el mercado diario, forzando la programación centralizada y masiva de plantas de generación síncrona. Así, el sistema pasó de contar con unas 7 centrales de ciclo combinado de gas activadas en régimen normal, a mantener entre 25 y 30 centrales quemando gas natural de manera constante para proveer la firmeza, inercia y capacidad de cortocircuito.

Desde una perspectiva de contabilidad analítica, la Operación Reforzada se ha erigido como un agujero negro financiero. Las propias estimaciones corporativas de Redeia cifraron el coste directo de este sobreesfuerzo en **711 millones de euros** únicamente para los doce meses posteriores al incidente. Sin embargo, auditorías externas desarrolladas por consultoras globales como PwC escalaron la magnitud real del daño sistémico, estimando un sobrecoste superior a los **1.000 millones de euros** respecto al ejercicio 2024.

Este sumatorio de ineficiencias (OPEX) no aporta ningún valor añadido patrimonial a la red; es puramente gasto corriente para mantener el sistema a flote. Agrava el déficit comercial de la balanza de pagos española, dispara los derechos de emisión de CO2, y desincentiva la inversión al provocar un incremento masivo de vertidos renovables (*curtailment*).

### El Retrofitting del Parque Renovable y el Nuevo P.O. 7.4

El primer pilar de la reestructuración se formalizó con la promulgación del nuevo **Procedimiento de Operación 7.4 (P.O. 7.4)**, denominado *"Servicio complementario de control de tensión de la red de transporte"*.

Esta profunda revisión regulatoria exige, con carácter retroactivo y obligatorio, que las instalaciones de régimen especial basadas en electrónica de potencia dejen de operar como meros inyectores pasivos de potencia activa (P), asumiendo obligaciones de modulación dinámica. La normativa impele a estos nodos a inyectar o absorber potencia reactiva (Q) para sostener el perfil de tensión y responder a huecos de tensión (LVRT/HVRT).

Para cumplir esta exigencia, las promotoras se ven obligadas a invertir capital en la reingeniería de la planta: instalando arquitecturas de Controladores Lógicos de Planta (PPC), adicionando bancos de capacitores estáticos (STATCOMs) o sobredimensionando físicamente las bahías de inversores modulares. Asumiendo que la mitad del parque requerirá modificaciones de hardware, y estimando un *Unit Cost* de actualización de entre 5.000 y 15.000 euros por megavatio instalado, **la factura de retrofitting agregada a nivel nacional oscilará entre los 400 y los 1.000 millones de euros**.

### Inversión Estructural: Condensadores Síncronos y Baterías BESS a Gran Escala

El control de reactiva propuesto por el P.O. 7.4 es una condición necesaria pero insuficiente. El ecosistema requiere de un segundo pilar de CAPEX: la inserción estratégica de sistemas híbridos combinando Baterías de Almacenamiento de Energía a Gran Escala (BESS) con Condensadores Síncronos (*Synchronous Condensers*) en los nodos de la red de transporte con mayor nivel de congestión (Extremadura y Andalucía).

Un condensador síncrono es un gigantesco generador rotativo acoplado a la red cuyo eje gira en vacío. Su masa rotacional proporciona inercia sintética pura y una capacidad de respuesta instintiva frente a corrientes de cortocircuito.

Basado en proyectos piloto reales (como el acuerdo corporativo en 2026 entre Engie y Rolwind en Andalucía para 278 MW de potencia y 1,1 GWh de almacenamiento), el coste paramétrico es de aproximadamente **0,86 Millones de Euros por MW de capacidad instalada**.

Para que el operador del sistema (REE) prescinda de la sobreprogramación de gas que sustenta la "Operación Reforzada", se requiere la instalación de un mínimo operativo de entre **3.000 y 4.000 MW**.

**Estimación del CAPEX Estructural a Nivel Nacional:**
> $3.500 \text{ MW} \times 0,86 \text{ M€/MW} \approx 3.010 \text{ Millones de Euros}$

Bajo el régimen tarifario post-apagón, el OPEX despilfarrado en el coste de restricciones técnicas impuestas por la "Operación Reforzada" asciende a más de 1.000 millones. En un modelo básico de evaluación financiera, un CAPEX de 3.000 millones de euros para dotar de inercia limpia a la red tendría un periodo de retorno de inversión dinámico (*Payback*) menor a cinco años. El Valor Actual Neto (VAN) del proyecto es masivamente positivo.

---

## 5. Conclusiones Contractuales: La Resiliencia como Inversión Rentable

La radiografía forense del Gran Apagón del 28 de abril de 2025 trasciende la estricta naturaleza del incidente electromecánico para conformar un evento de cisma macroeconómico. El balance contable agregado de la catástrofe eléctrica es inapelable:

- La asfixia de caja del sector electrointensivo (>25 M€).
- La destrucción de valor macroeconómico por el lucro cesante de la Energía No Suministrada (VoLL), estimado entre **1.000 y 1.500 millones de euros**.
- La guerra judicial derivada y las multas coercitivas de la CNMC.
- El OPEX reaccionario superior a **711 millones de euros anuales** mediante la quema de gas natural de la "Operación Reforzada".

Frente a la constante hemorragia en la balanza de pagos del sistema eléctrico, el esfuerzo inversor para la modernización integral del ecosistema (entre 3.000 y 3.500 M€ en CAPEX para Condensadores Síncronos y retrofitting del P.O 7.4) no debe ser conceptuado como un pasivo gubernamental, sino como un escudo fiscal estratégico. Invertir ingentes capitales *ex-ante* en la robustez física y algorítmica de la red no solo es el seguro más barato imaginable, sino la prerrogativa absoluta para salvaguardar la soberanía industrial y asegurar el éxito irreversible de la transición energética.

<FinancialWaterfallChart />

```

### 📄 Archivo: `docs\08-uso-ia.mdx`
```mdx
---
sidebar_position: 8
hide_title: true
title: "Uso de Inteligencia Artificial"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";
<GlitchTitle>Uso de Inteligencia Artificial</GlitchTitle>

La elaboración de este TFG se ha desarrollado en un contexto metodológico atípico: la concurrencia simultánea, durante el bienio 2024–2026, de una crisis sistémica en el sistema eléctrico ibérico y de una transformación acelerada en las herramientas de procesamiento de lenguaje natural. La disponibilidad de _Large Language Models_ (LLMs) capaces de procesar documentos técnicos de cientos de páginas en pocos minutos coincidió con la publicación, en el plazo de un año, de cuatro informes periciales primarios y una decena de análisis académicos sobre el mismo evento. Este capítulo documenta de forma transparente cómo se han integrado estas herramientas, qué tareas concretas han desempeñado, qué errores sistemáticos se han detectado y corregido, y qué reflexión epistemológica se desprende de ello para la práctica investigadora en ingeniería.

## Aplicación metodológica: cinco funciones operativas

El cuerpo documental de partida abarca expedientes técnicos, normativas de ENTSO-E, informes oficiales de extensión superior a 200 páginas, simulaciones PSS/E del IIT-ICAI, actas de la CNMC, registros oscilográficos del NREL y un volumen amplio de hemeroteca especializada. Su lectura lineal sin mediación informática resultaba incompatible con los plazos académicos del TFG. La integración de modelos generativos se ha articulado en torno a cinco funciones operativas claramente delimitadas, **ninguna de las cuales involucra inferencia causal autónoma sobre la física del sistema**:

<ForensicTable 
  title="LLM ASSISTANCE - OPERATIONAL FUNCTIONS"
  source="RESEARCH METHODOLOGY LOG"
>

| Función | Descripción |
| --- | --- |
| **Reconciliación cronológica** | Los cuatro informes describen los mismos hechos físicos del 28-A con distintos niveles de granularidad y desfases de hasta 200 ms entre versiones. La asistencia automática permitió construir una tabla maestra unificada de _timestamps_ y referencias cruzadas que sirvió de andamiaje para los capítulos 3 y 4. |
| **Mapeo sistemático de divergencias** | Cada informe enmarca el incidente en un perímetro analítico distinto. La extracción asistida de pasajes homólogos permitió localizar las afirmaciones técnicamente incompatibles entre fuentes — base del Capítulo 5 y de la síntesis comparativa. |
| **Tabulación cuantitativa** | Consolidación de magnitudes distribuidas a lo largo de los informes: valores zonales de inercia, penetración renovable instantánea, intercambios transfronterizos, cifras de UFLS, aportaciones capacitivas del mallado. |
| **Soporte redaccional** | Sugerencia de variantes léxicas, depuración de sinonimias, control de terminología y reformulación de pasajes de prosa académica densa. Este apoyo **no ha alterado la estructura argumental ni las decisiones de contenido**, que son responsabilidad exclusiva del autor. |
| **Andamiaje de elementos gráficos** | Generación de borradores en TikZ y `pgfplots` a partir de descripciones textuales, posteriormente revisados, depurados y validados manualmente para asegurar consistencia visual y fidelidad a los datos representados. |

</ForensicTable>

El flujo de trabajo se estructura en tres etapas secuenciales con un bucle de corrección: [Fuentes primarias] → [Asistencia LLM] → [Filtro de validación física] → [Cuerpo del TFG] ↑**********\_\_\_\_**********| (reformulación de prompt ante alucinación detectada)

El elemento metodológicamente decisivo no es la asistencia LLM en sí misma, sino el **filtro de validación física** que se interpone entre cualquier salida del modelo y su incorporación al texto: Leyes de Kirchhoff, curvas Q-V, ecuación de oscilación del rotor y cotejo con la fuente primaria. Cuando el filtro detecta una inferencia incompatible con la mecánica del sistema, el _prompt_ se reformula con restricciones semánticas adicionales y el ciclo se reinicia.

## Validación y verificación: los cuatro casos de inferencia errónea

La utilización de modelos generativos en un dominio tan denso en relaciones causales como la dinámica de sistemas de potencia revela, de forma sistemática, un comportamiento que los sistemas eléctricos no toleran: la **inferencia por analogía estadística**. Los LLM tienden a aplicar patrones causales _típicos_ —los más frecuentes en la literatura de su corpus de entrenamiento— a casos cuya estructura física es _atípica_. El 28-A es, por su naturaleza dual (estabilidad de tensión en lugar de balance de frecuencia), un caso atípico respecto a la mayoría de los apagones documentados en la bibliografía técnica del siglo XX, lo que hizo especialmente productiva la observación de los puntos en los que la IA «por defecto» se desviaba del fenómeno real.

<ForensicTable 
  title="LLM HEURISTIC FAILURE MODES"
  source="RESEARCH VALIDATION LOG"
>

| Fenómeno | Inferencia errónea por defecto del LLM | Corrección física aplicada | Estrategia de _prompt_ correctora |
| --- | --- | --- | --- |
| **Paradoja del UFLS** | El deslastre de cargas por subfrecuencia «salvó» áreas del sistema al recuperar el balance de potencia activa. | El UFLS es ciego al voltaje: al desconectar carga retiró sumideros de reactiva inductiva en pleno transitorio capacitivo, agravando la sobretensión. | Restricción explícita: razonar exclusivamente en el plano Q-V, ignorando la lógica frecuencia–potencia activa habitual en apagones clásicos. |
| **Tap-Lag** | Los OLTC respondieron correctamente al transitorio elevando o rebajando la tensión secundaria de forma proporcional. | Los retardos intencionales de los OLTC —diseñados para evitar _hunting_— los dejaron desfasados frente a un transitorio de decenas de milisegundos, multiplicando la tensión hacia la red de 220 kV y 132 kV. | Inyección de la constante de tiempo real del conjunto electromecánico OLTC y prohibición de asumir respuesta cuasi-instantánea. |
| **Aporte capacitivo del mallado** | El mallado redujo la impedancia del sistema y, por tanto, aumentó la estabilidad de tensión. | En condiciones de baja carga, el mallado activó la admitancia transversal de las líneas de 400 kV (efecto Ferranti), inyectando los 1.050 MVAr capacitivos que precipitaron la sobretensión. | Restricción al régimen «línea descargada» y exigencia de calcular el balance de reactiva con la admitancia capacitiva $Y_t$ en el modelo π de la línea. |
| **Oscilación de 0,6 Hz** | Producción de una respuesta _integrada_ — la lectura «más probable» promediada sobre las fuentes. | El origen del modo (oscilación forzada por una planta concreta según ICAI; modo natural del sistema según REE) es precisamente la discrepancia que el TFG debe preservar, no resolver editorialmente. | Veto a la elección unilateral entre ambas hipótesis y obligación de producir versiones duales con atribución explícita a su fuente. |

</ForensicTable>

### El caso de la paradoja del UFLS

El caso más ilustrativo del patrón de error: ante la consulta sobre el papel del deslastre en el desarrollo del incidente, los modelos ofrecieron sistemáticamente una interpretación heredada de los apagones clásicos, en los que el UFLS constituye la última línea de defensa y consigue habitualmente preservar porciones de la red al recuperar el balance frecuencia-potencia activa. Esta inferencia es físicamente correcta para el universo de eventos sobre los que el modelo fue entrenado, pero inválida para el 28-A: en un colapso dominado por el plano Q-V, la activación del UFLS retiró simultáneamente los sumideros de potencia reactiva inductiva que aportaban las cargas desconectadas, **agravando la sobretensión en lugar de mitigarla**.

La corrección requirió formular el _prompt_ con una restricción explícita sobre el plano de análisis y verificar manualmente que el razonamiento resultante fuese consistente con la oscilografía publicada por el NREL en la franja temporal 12:33:19–12:33:27 CEST.

### El caso del Tap-Lag

La descripción cualitativa que los modelos producen del OLTC es correcta en régimen estacionario, pero asume por defecto una respuesta proporcional e instantánea que el conjunto electromecánico real no posee. El retardo intencional introducido para evitar _hunting_ se tradujo el 28-A en una relación de transformación desfasada respecto al transitorio eléctrico, lo que multiplicó la sobretensión hacia las redes de 220 kV y 132 kV — fenómeno invisible para el SCADA del operador, anclado en las medidas del primario de 400 kV. Toda la cadena causal del Tap-Lag exigió describir al modelo, por adelantado, las constantes de tiempo del OLTC y prohibirle asumir respuesta cuasi-instantánea.

### El caso del aporte capacitivo del mallado

La inyección estimada de 1.050 MVAr capacitivos debía corresponderse con el efecto de la admitancia transversal ($Y_t$) de las líneas de 400 kV operando en régimen descargado (efecto Ferranti). La validación consistió en reproducir el balance de reactiva sobre el modelo π de la línea, contrastando el orden de magnitud con la oscilografía y con el diagnóstico del informe IIT-ICAI.

### El caso de la oscilación de 0,6 Hz

Ilustra una limitación específica del uso de IA en contextos forenses con divergencia institucional. Los modelos tienden a producir una respuesta integrada — la lectura «más probable» promediada sobre las fuentes — cuando el rigor pericial exige preservar la divergencia. El origen del modo es precisamente el dato que el TFG debe presentar como discrepancia irresuelta, no como consenso editorial.

La observación de alcance general que estos cuatro casos permiten formular: **la utilidad de la asistencia automática es máxima en tareas de _procesamiento_** —extracción, síntesis, estructuración, tabulación, redacción asistida— **y mínima, hasta el punto de ser contraproducente, en tareas de _inferencia causal_** sobre fenómenos físicos con baja representación en los corpus de entrenamiento.

## Reflexión crítica: IA en la investigación de ingeniería

La experiencia documentada conduce a una conclusión estructural, ni triunfalista ni catastrofista: los modelos generativos son potentes _aceleradores_ de los procesos cognitivos del investigador, pero operan sobre una lógica probabilística que no coincide con la lógica determinista que rige la física de los sistemas materiales.

### Implicación metodológica

El uso de IA **no exime al investigador de dominar el contenido técnico** de su objeto de estudio; al contrario, lo exige con mayor severidad. Solo un investigador con competencia técnica suficiente para identificar una inferencia físicamente imposible puede emplear con seguridad un modelo capaz de producirla con fluidez retórica. La asimetría entre la verosimilitud lingüística del _output_ y su corrección material constituye el principal riesgo asociado al uso de estas herramientas en dominios técnicos exigentes, y solo puede neutralizarse mediante un dominio del contenido que la herramienta no puede aportar.

### Implicación ético-académica

La asistencia automática se ha empleado en este trabajo como herramienta de procesamiento, no como sustituto del razonamiento. Toda decisión de contenido — el encuadre del problema, la jerarquía de fuentes, la formulación de la tesis causal sobre el colapso del 28-A, la valoración comparada de las narrativas institucionales, las conclusiones finales — es responsabilidad exclusiva del autor. **La IA no firma TFGs ni se sienta ante un tribunal**: el ingeniero rubrica con su nombre la causalidad material de los hechos expuestos, y esa rúbrica es intransferible.

### Implicación disciplinar prospectiva

Los sistemas eléctricos de la próxima década — dominados por electrónica de potencia, con dinámica relevante en la escala sub-cíclica y con interacciones tensión-reactiva que el operador convencional no captura en tiempo real — van a requerir herramientas de soporte a la decisión que combinen la velocidad de procesamiento de los modelos algorítmicos con la robustez física de los simuladores tipo PSS/E. La integración no es trivial: los simuladores resuelven ecuaciones; los LLM aproximan distribuciones de probabilidad.

La arquitectura híbrida **— LLM como interfaz semántica y de síntesis, simuladores físicos como motor de inferencia causal —** es, plausiblemente, la dirección hacia la que evolucionarán las herramientas de ingeniería de sistemas de potencia. Su desarrollo requerirá exactamente la misma vigilancia epistemológica que ha estructurado el flujo de trabajo del presente TFG: tener siempre presente qué hace cada herramienta y qué se le pide explícitamente que no haga.

El registro detallado del flujo de _prompts_ restrictivos empleados, junto con ejemplos representativos de las correcciones aplicadas, se documenta en el Anexo de Metodología IA, siguiendo las recomendaciones de buenas prácticas en transparencia metodológica para la integración de modelos generativos en investigación de grado y posgrado.

```

### 📄 Archivo: `docs\08.5-actualizacion-2026.mdx`
```mdx
---
sidebar_position: 8.8
hide_title: true
title: "Actualización 2026: Un Año Después"
---

import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import BrowserOnly from "@docusaurus/BrowserOnly";

<GlitchTitle>Actualización 2026: Un Año Después</GlitchTitle>

El apagón del 28 de abril de 2025 supuso un punto de inflexión sistémico. A fecha de mayo de 2026, los informes finales de la <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink> (publicados el 20 de marzo de 2026) y las investigaciones forenses independientes han sacado a la luz una serie de revelaciones técnicas y regulatorias que alteran drásticamente la narrativa inicial del incidente.

## 1. El Paradigma del "Overvoltage-Driven Blackout"

Los primeros análisis sugerían un colapso clásico por falta de inercia o desvío de frecuencia. Sin embargo, el estudio independiente del Instituto de Investigación Tecnológica (IIT) de la Universidad Pontificia Comillas —validado por pares en *ScienceDirect* (Rouco, Lobato, Echavarren, 2026)— ha introducido un concepto técnico inédito: el **overvoltage-driven blackout** (apagón inducido por sobretensión).

:::warning [Revelación Técnica]
La secuencia fatal no fue una caída de tensión generalizada. Al activarse las lógicas de protección, la red sufrió una cascada de disparos por sobretensión masiva. La desconexión de carga y la enorme inyección de energía capacitiva de las líneas a 400 kV (sin reactancias suficientes conectadas) elevó las tensiones por encima del límite de las protecciones de generación. El disparo del transformador 400/220 kV en Granada a las 12:32:57, que perdió 355 MW, fue el detonante de la cascada.
:::

Según la reconstrucción forense, las plantas conectadas mediante inversores <GlossaryLink term="Grid-Following (GFL)">Grid-Following</GlossaryLink> que operaban en modo de **factor de potencia fijo** reaccionaron a las oscilaciones de activa inyectando enormes rampas de potencia reactiva. Ante una red debilitada (con bajo <GlossaryLink term="Short-Circuit Ratio (SCR)">Short-Circuit Ratio</GlossaryLink>), el bucle de enganche de fase (<GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink>) de estos inversores provocó inestabilidades que el sistema fue incapaz de amortiguar.

## 2. Opacidad Operativa y el Rol del HVDC

Uno de los puntos más polémicos de la investigación ha sido la actuación del operador del sistema (<GlossaryLink term="Red Eléctrica de España (REE)">REE</GlossaryLink>). En julio de 2025, el consorcio independiente (AELEC, INESC TEC, Compass Lexecon) denunció una severa falta de transparencia respecto a los datos de los estimadores de estado y las Unidades de Medición Fasorial (<GlossaryLink term="PMU">PMU</GlossaryLink>). 

El hallazgo más crítico de las comisiones de investigación revela que, apenas unos minutos antes del apagón, REE modificó el modo de operación del enlace <GlossaryLink term="HVDC">HVDC</GlossaryLink> INELFE entre España y Francia. El enlace pasó de su modo de "emulación de CA" a un control de potencia en CC constante, neutralizando su capacidad para amortiguar la oscilación letal de 0,6 Hz.

## 3. Consecuencias Institucionales y Litigios Multimillonarios

El apagón no solo rompió el sistema eléctrico, sino también las relaciones institucionales del sector, provocando una avalancha judicial sin precedentes históricos:

- **Expedientes de la CNMC**: Desde abril de 2025 se han incoado 66 expedientes sancionadores. REE y Almaraz se enfrentan a cargos "muy graves" (hasta 60 M€). Paralelamente, once productoras (incluyendo Endesa, Iberdrola y Mercuria Solar) se enfrentan a cargos "graves" por incumplimiento de los códigos de red.
- **Demandas Civiles Masivas**: Al vencer el plazo de prescripción en abril de 2026, gigantes industriales como **Repsol** han formalizado demandas contra el sistema por **125 millones de euros** en concepto de lucro cesante y daños a complejos petroquímicos. Iryo y Moeve también han notificado su intención de demandar.
- **Audios Clasificados**: Las audiencias de la Comisión de Investigación del Senado han hecho públicos audios de la sala de control de REE. En ellos, los operadores atribuían las severas oscilaciones e inestabilidades de tensión de las 12:00 a *"la mala gestión de una planta fotovoltaica de gran potencia en Badajoz"*, revelando que el riesgo era inminente minutos antes del colapso final.

## 4. La Respuesta Regulatoria: El Mandato Grid-Forming

Ante la evidencia del fallo estructural, la <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink> publicó en noviembre de 2025 su esperado "Phase II Report", sentando las bases del nuevo código de red europeo (NC RfG 2.0).

:::info [El Nuevo Estándar GFM]
El borrador regulatorio exige la obligatoriedad de la tecnología <GlossaryLink term="Grid-Forming (GFM)">Grid-Forming</GlossaryLink> para todas las nuevas plantas no síncronas y sistemas de almacenamiento mayores a **1 MW**. Exige un tiempo de respuesta de corriente < 10 ms, ride-through frente a saltos de ángulo de fase, y la provisión de inercia sintética equivalente a la de una máquina síncrona.
:::

A pesar del colapso ibérico, la adopción oficial del NC RfG 2.0 por parte de la Comisión Europea ha sido despriorizada hasta finales de 2026. Sin embargo, países como Reino Unido (proyecto *Stability Pathfinder*) y España han acelerado por su cuenta. 

### El Boom del Almacenamiento Ibérico
El coste sistémico de mantener el sistema reforzado con gas tras el apagón ascendió a **666 millones de euros** adicionales en solo diez meses. Como reacción directa, el mercado español de baterías experimentó un "electroshock": la capacidad BESS (Battery Energy Storage Systems) instalada se ha **multiplicado por 589%**, pasando de unos simbólicos 28 MW a casi 200 MW operativos en un solo año, impulsando una arquitectura de red nativa para servicios de <GlossaryLink term="Black Start">Black Start</GlossaryLink>.

## Conclusión de la Crisis

En retrospectiva, el "apagón de 2025" ya no se estudia en 2026 como un accidente fortuito derivado de la sequía hidráulica o el exceso solar. Es el primer exponente documentado de un colapso provocado por un estrangulamiento regulatorio y una transición tecnológica que retiró las máquinas síncronas antes de desplegar sus equivalentes electrónicos. La península ibérica se convirtió a la fuerza en el laboratorio vivo que ha obligado a Europa a reescribir las reglas de la estabilidad eléctrica de la próxima década.

```

### 📄 Archivo: `docs\09-conclusiones.mdx`
```mdx
---
sidebar_position: 9
hide_title: true
title: "Conclusiones"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlossaryLink from "@site/src/components/GlossaryLink";
import { ForensicTable } from "@site/src/components/ForensicUI/Primitives";

<GlitchTitle>Conclusiones</GlitchTitle>

Este capítulo cierra el análisis forense articulando dos planos complementarios: la síntesis comparativa de las posturas institucionales y las implicaciones estructurales que el episodio proyecta sobre la seguridad del suministro en el contexto de la transición energética europea. Ambos comparten una premisa metodológica sostenida a lo largo de todo el trabajo: el 28 de abril de 2025 no es un incidente de frecuencia, sino un **colapso de tensión en el plano Q-V**, y esa distinción es el eje sobre el que pivota toda la arquitectura argumental que sigue.

## Síntesis comparativa de las posturas institucionales

La reconstrucción del 28-A ha producido cuatro familias de narrativas técnicamente autónomas, cada una anclada en un marco analítico y en un perímetro de responsabilidad distintos:

<ForensicTable 
  title="INSTITUTIONAL NARRATIVE SYNTHESIS MATRIX"
  source="FORENSIC COMPARATIVE ANALYSIS"
  fullWidth={true}
>

| Agente | Marco analítico | Causa raíz | Inercia ($H$)† | Medidas priorizadas |
| --- | --- | --- | --- | --- |
| **Administración (Comité CSN / REE)** | Cumplimiento normativo y seguridad nacional; análisis multifactorial centrado en la respuesta del parque generador. | Inestabilidad de tensión precipitada por un déficit sistémico de absorción de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> inductiva; incumplimiento parcial del P.O. 7.4. | 2,3 s (global peninsular) | Actualización del P.O. 7.4 (BOE-A-2025-13076); régimen reforzado hasta 2030; despliegue progresivo de BESS con capacidad <GlossaryLink term="GFM (Grid-Forming)">Grid-Forming</GlossaryLink>. |
| **Sector generador (IIT-ICAI / AELEC / Compass Lexecon)** | Análisis electromagnético del transitorio; crítica pericial a la operación del sistema. | Inestabilidad capacitiva inducida por la maniobra de <GlossaryLink term="Mallado">mallado</GlossaryLink> en condiciones de baja fortaleza síncrona, agravada por las limitaciones de observabilidad sobre la red de 220 kV (<GlossaryLink term="Tap-Lag">Tap-Lag</GlossaryLink>). | 1,3 s (Sur) / 1,84 s (Centro) | Revisión de los protocolos operativos de mallado; refuerzo de la observabilidad en 220 kV; despliegue selectivo de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink> en los nudos críticos. |
| **Gestor europeo (<GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>)** | Estabilidad del área síncrona continental; crítica al <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink> ante fenómenos dinámicos ultrarrápidos. | Propagación de <GlossaryLink term="Oscilaciones electromecánicas">oscilaciones inter-área</GlossaryLink> y pérdida de sincronismo en la frontera pirenaica; agotamiento del <GlossaryLink term="EAS (ENTSO-E Awareness System)">EAS</GlossaryLink> para anticipar el transitorio. | Magnitudes zonales compatibles con el análisis IIT-ICAI. | <GlossaryLink term="NC RfG">NC RfG</GlossaryLink> 2.0 con capacidad _Grid-Forming_ obligatoria para PPMs tipos B–D (≥ 1 MW); reforma de los estados operativos del EAS. |
| **Análisis académico independiente (NREL / MIT CEEPR / Brattle)** | Reconstrucción basada en registros <GlossaryLink term="PMU (Phasor Measurement Unit)">PMU</GlossaryLink> y análisis de estabilidad en sistemas dominados por <GlossaryLink term="IBR">IBR</GlossaryLink>. | Convergencia con la tesis capacitiva; énfasis en la erosión de la fortaleza nodal (SCR) y en la desconexión masiva de IBR por protección de sobretensión. | 1,3–1,8 s (sur peninsular) | Rediseño de los mercados de servicios ancilares hacia <GlossaryLink term="Servicios Esenciales de Confiabilidad (ERS)">ERS</GlossaryLink> que remuneren inercia, FFR, reactiva dinámica y potencia de cortocircuito. |

</ForensicTable>

_† La discrepancia en los valores de inercia no es una divergencia metodológica menor: el valor global de 2,3 s corresponde al promedio peninsular, mientras que los valores zonales de 1,3 s (área Sur) reflejan la inercia disponible en el epicentro geográfico de las maniobras de mallado y de la cascada inicial de desconexiones. El 28-A no fue un fallo del promedio, sino un fallo de la **zona más débil bajo estrés local** — circunstancia que un indicador global no puede capturar por construcción._

:::note Consensos técnicos robustos entre los cuatro agentes
Del contraste entre las cuatro narrativas emergen tres puntos de convergencia que **ningún informe pericial contradice**:

**Primero**, el mecanismo dominante del colapso no fue una pérdida de frecuencia por déficit de inercia, sino una <GlossaryLink term="Estabilidad de tensión">inestabilidad de tensión</GlossaryLink> en régimen capacitivo precipitada por la combinación de generación síncrona residual mínima y líneas de 400 kV subcargadas durante el valle de demanda.

**Segundo**, la operación prolongada en régimen de «red ligera», con penetración instantánea de generación no síncrona del 82 %, había agotado de forma estructural los márgenes de control dinámico de tensión en las semanas previas, como evidencian los eventos precursores del 22 y el 24 de abril.

**Tercero**, el marco regulatorio vigente al 28-A — P.O. 7.4 con banda muerta asimétrica, NC RfG sin exigencia de _Grid-Forming_ — resultó estructuralmente inadecuado para movilizar los recursos de amortiguamiento en el plazo que el transitorio requería.
:::

Las divergencias organizan la discrepancia institucional en dos ejes nítidos.

**Eje del perímetro de medida.** El Comité CSN y REE computan la inercia como magnitud global del sistema peninsular (2,3 s), mientras que los informes del IIT-ICAI y del NREL trabajan con valores zonales desagregados (1,3 s en el área Sur). Ambos valores son aritméticamente correctos y sustantivamente diferentes: el 28-A no fue un fallo del promedio, sino de la zona más débil bajo estrés local.

**Eje de la atribución del disparador.** El Comité CSN y REE sitúan el foco en la insuficiente absorción de reactiva por parte del parque generador — una omisión del sujeto obligado por el P.O. 7.4 —. El IIT-ICAI lo sitúa en la maniobra de mallado del Operador del Sistema y en la inobservabilidad estructural de la red de 220 kV por el _Tap-Lag_ — una decisión operativa y una limitación instrumental —. Ambos diagnósticos son compatibles con la evidencia oscilográfica: el transitorio capacitivo superior a 2,4 GVAr requirió simultáneamente una decisión que lo provocase y una incapacidad de respuesta que impidiese contenerlo. La discrepancia **no es técnica sino distributiva**: se refiere a la imputación de responsabilidad dentro de una cadena causal que todos los informes reconocen.

Leídas en conjunto, las cuatro narrativas no constituyen interpretaciones mutuamente excluyentes del mismo hecho, sino **proyecciones parciales de un fenómeno multicapa** sobre los respectivos marcos analíticos y perímetros de responsabilidad institucional. La divergencia interpretativa no es ruido que deba resolverse a favor de una postura: es un dato forense en sí mismo, que revela cómo la complejidad dinámica de los sistemas eléctricos modernos desborda la capacidad de cualquier agente individual para producir una reconstrucción exhaustiva del incidente.

## Implicaciones estructurales: el trilema de la transición energética

El colapso del 28-A no puede leerse como un accidente aleatorio, sino como la manifestación empírica de un conjunto de tensiones estructurales que la transición energética europea mantiene irresueltas. La descarbonización no es la causa del colapso: es la condición de contorno que, al no acompañarse de una adaptación simétrica en los planos tecnológico, regulatorio y económico, convirtió la vulnerabilidad latente en incidente.

El sistema eléctrico ibérico opera bajo un **trilema estructural** en el que cada arista representa una tensión operativa concreta entre dos de los vértices:

<ForensicTable 
  title="ENERGY TRANSITION STRUCTURAL TRILEMMA"
  source="STRUCTURAL ANALYSIS"
>

| Tensión | Vértices en conflicto | Manifestación concreta el 28-A |
| --- | --- | --- |
| **Marginación de síncronas / baja fortaleza de red** | Descarbonización ↔ Estabilidad dinámica | La orden de mérito desplazó los CCGTs, vaciando al sistema de inercia y potencia de cortocircuito en el instante crítico. |
| **Orden de mérito / horas de precio cero o negativo** | Descarbonización ↔ Asequibilidad | Más de 500 horas de precio cero o negativo en 2024; precio medio diario de 18,50 €/MWh el propio 28-A. |
| **Coste de los Servicios Esenciales de Confiabilidad (ERS)** | Estabilidad dinámica ↔ Asequibilidad | Los servicios ancilares de inercia, reactiva dinámica y FFR no estaban remunerados explícitamente en el diseño de mercado. |

</ForensicTable>

_El 28 de abril de 2025 representa el episodio en que las tres tensiones convergieron sin que el marco normativo y de mercado vigente lograra arbitrar entre ellas._

### Tensión tecnológica

La brecha entre el parque generador real y el que el sistema necesita para operar con seguridad en régimen dominado por IBR. La sustitución de grandes alternadores síncronos por inversores en topología <GlossaryLink term="GFL (Grid-Following)">Grid-Following</GlossaryLink> ha privado a la red de dos servicios que las máquinas rotatorias proveían sin remuneración explícita: la <GlossaryLink term="Inercia (H)">inercia rotacional genuina</GlossaryLink> y la potencia de cortocircuito necesaria para sostener el SCR en los nudos de la red de transporte. La arquitectura técnica de salida — convergente entre los informes periciales — combina el despliegue distribuido de BESS con capacidad _Grid-Forming_ para la gestión sub-cíclica de tensión con la instalación selectiva de compensadores síncronos, incluyendo la reconversión <GlossaryLink term="Estrategia Brownfield">Brownfield</GlossaryLink> de alternadores de centrales fósiles clausuradas.

### Tensión regulatoria

La inadecuación del marco operativo heredado para gobernar una red de dinámica acelerada. La actualización del P.O. 7.4 mediante la Resolución CNMC de 12 de junio de 2025 — con exigencias dinámicas explícitas y la habilitación por primera vez de IBR y almacenamiento en el servicio de control de tensión — constituye un paso en la dirección correcta. Sin embargo, la desestimación en octubre de 2025 de la subida del umbral de cumplimiento del 75 % al 90 % evidencia la asimetría temporal entre las capacidades de los activos nuevos y las del parque síncrono que sustituyen. En el plano europeo, la <GlossaryLink term="SO GL (System Operation Guidelines)">consolidación de los requisitos _Grid-Forming_</GlossaryLink> en el Phase II Technical Report de ENTSO-E (noviembre de 2025) y su proyección sobre el futuro NC RfG 2.0 configuran el armazón técnico de la red poscarbónica — si bien la actual despriorización del calendario de adopción por la Comisión Europea introduce una ventana de incertidumbre que los operadores nacionales están cubriendo mediante medidas transitorias al margen del código de red.

### Tensión económica

La que los informes periciales señalan como condicionante último de la viabilidad del rediseño técnico. El modelo marginalista puro de energía es estructuralmente incapaz de remunerar los atributos sistémicos que sostienen la estabilidad: inercia, potencia de cortocircuito, reactiva dinámica y <GlossaryLink term="Fast Frequency Response (FFR)">respuesta rápida de frecuencia</GlossaryLink>. La proliferación de horas de precio cero o negativo — más de **500 horas en 2024**, con un precio medio diario de **18,50 €/MWh** el propio 28-A — no es un defecto del diseño renovable, sino la señal de que los atributos de estabilidad están ausentes de la función objetivo del mercado. La transformación de estos servicios en productos comerciales explícitos, bajo la categoría de ERS, constituye el requisito económico sin el cual el armazón técnico y regulatorio precedentes carecen de sostenibilidad a medio plazo.

A escala de gobernanza europea, el episodio evidenció las limitaciones del EAS para cumplir su función declarada de alerta temprana. El sistema ibérico transitó del estado «Normal» al estado «Blackout» sin atravesar los estados intermedios previstos en las System Operation Guidelines. La implicación es estructural: las herramientas de seguridad construidas sobre análisis de flujos de carga estáticos y sobre el Criterio *N*−1 son inadecuadas para redes con alta penetración de electrónica de potencia, cuya dinámica relevante ocurre en escalas de tiempo inferiores al segundo. La arquitectura de coordinación paneuropea requiere incorporar indicadores dinámicos de fortaleza nodal, índices zonales de inercia y métricas de capacidad formadora de red como parámetros de estado homologables entre Gestores de Redes de Transporte.

## La lección del 28-A

La lección estructural del 28 de abril, tomada en su conjunto, no es que la transición energética sea demasiado ambiciosa ni que la descarbonización comprometa la seguridad del suministro. La lección es que la transición, para ser operativamente sostenible, **debe producirse simultáneamente en los tres planos que el trilema identifica**: técnico, regulatorio y económico. Cualquier asimetría entre ellos — un parque generador transformado con un código de red heredado; un código de red actualizado sin mercado que remunere los servicios que exige; un mercado rediseñado sin los activos físicos capaces de prestarlos — reproduce las condiciones de vulnerabilidad que el 28-A materializó.

El valor analítico de este trabajo reside, en último término, en haber mostrado que las cuatro narrativas institucionales **coexisten sin cancelarse entre sí** y que ninguna de ellas, por separado, agota la comprensión del incidente. La síntesis forense exige tratar a los informes periciales no como hipótesis rivales sobre un mismo hecho, sino como proyecciones parciales de un fenómeno complejo sobre los respectivos marcos de cada agente. Solo la lectura triangulada — que preserva las divergencias en lugar de disolverlas — permite extraer las condiciones estructurales que convirtieron un escenario operativo rutinario de descarbonización profunda en el primer _blackout_ sistémico del área síncrona continental en dos décadas.

Esas condiciones, lejos de ser extraordinarias, están presentes en todo sistema eléctrico europeo en transición: **el 28 de abril de 2025 es, en este sentido, menos un accidente ibérico que un precedente europeo**.

```

### 📄 Archivo: `docs\10-galeria-imagenes.mdx`
```mdx
---
sidebar_position: 11
hide_title: true
title: "Galería de Imágenes"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import ImageGallery from '@site/src/components/ImageGallery';

<GlitchTitle>Galería de Imágenes</GlitchTitle>

Recopilación de todos los gráficos, diagramas y mapas térmicos incluidos a lo largo del TFG, organizados por capítulos. Haz clic en cualquier imagen para verla a pantalla completa.

<ImageGallery lang="es" />

```

### 📄 Archivo: `docs\11-cronologia.mdx`
```mdx
---
sidebar_position: 12
hide_title: true
title: "Cronograma del Incidente"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import VerticalTimeline from '@site/src/components/VerticalTimeline';

<GlitchTitle>Cronograma del Incidente</GlitchTitle>

La siguiente línea de tiempo interactiva ilustra la evolución del apagón ibérico: desde los precursores técnicos del 22 de abril, pasando por la cascada de fallos en la red de transporte a las 12:33 CEST, hasta la reposición final de la demanda tras 19 horas de maniobras.

<VerticalTimeline lang="es" />

```

### 📄 Archivo: `docs\13-sobre-el-autor.mdx`
```mdx
---
sidebar_position: 14
hide_title: true
title: "Sobre el Autor"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import AuthorProfile from '@site/src/components/AuthorProfile';

<GlitchTitle>Sobre el Autor</GlitchTitle>

<AuthorProfile lang="es" />

```

### 📄 Archivo: `docs\14-galeria-graficas.mdx`
```mdx
---
sidebar_position: 12
hide_title: true
hide_table_of_contents: true
title: "Galería de Gráficas Interactivas"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import InteractiveGraphicsGallery from '@site/src/components/InteractiveGraphicsGallery';

<GlitchTitle>Galería de Gráficas Interactivas</GlitchTitle>

Esta sección recopila todas las herramientas de visualización interactiva y esquemas desarrollados para el análisis técnico del incidente. Selecciona una gráfica en el panel lateral para interactuar con ella.

<InteractiveGraphicsGallery lang="es" />

```

### 📄 Archivo: `docs\dimension-europea\01-francia-portugal.mdx`
```mdx
---
sidebar_position: 1
hide_title: true
title: "El impacto en Francia y Portugal"
---

import GlossaryLink from '@site/src/components/GlossaryLink';
import GlitchTitle from "@site/src/components/GlitchTitle";

<GlitchTitle>El impacto en Francia y Portugal</GlitchTitle>

El colapso del sistema eléctrico ibérico no se detuvo en los Pirineos ni en el Guadiana. La violencia del transitorio electrodinámico del 28-A irradió una onda de choque a través de las interconexiones que sometió a la red francesa a un estrés operativo extremo y arrastró al sistema portugués a un apagón total del que solo pudo salir mediante una restauración de diecisiete horas desde cero. Estos dos episodios —uno contenido, el otro catastrófico— ilustran con precisión las condiciones que determinan si un sistema puede rechazar una perturbación de esta magnitud o sucumbir ante ella.

## Francia (RTE): el sistema que resistió en el límite

### El disparo de Golfech 1 y las corrientes de secuencia negativa

El mecanismo de propagación hacia Francia estuvo dominado por un exceso súbito y masivo de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> capacitiva. Segundos antes de la separación, el enlace <GlossaryLink term="HVDC">HVDC</GlossaryLink> Baixas–Santa Llogaia absorbía **870 MVAr** actuando como sumidero dinámico de regulación de tensión en la frontera. La pérdida instantánea de este sumidero, combinada con la apertura de las líneas de 400 kV que quedaron energizadas en vacío desde el lado francés —generando reactiva por <GlossaryLink term="Efecto Ferranti">efecto Ferranti</GlossaryLink> capacitivo—, indujo un perfil de sobretensiones transitorias severas que se propagó velozmente por todo el suroeste francés.

Frente a esta escalada, el control secundario de tensión de RTE forzó a los grandes alternadores síncronos de la región a operar en subexcitación profunda. El caso más crítico fue la **Unidad 1 de la central nuclear de Golfech**, un bloque de **1.290 MW** de potencia nominal. Para contener el perfil de tensiones, sus reguladores automáticos de tensión (AVR) redujeron drásticamente la corriente de excitación del rotor, llevando a la máquina a absorber la cifra de **426 MVAr** a las 12:33 CEST.

Esta condición extrema compromete severamente la estabilidad de la máquina. Al reducirse el flujo magnético en el entrehierro, el par sincronizante que mantiene al rotor acoplado a la frecuencia de la red se debilita. Simultáneamente, el carácter asimétrico de los transitorios de apertura en la frontera generó corrientes de secuencia negativa considerables en la red de 400 kV. La teoría de componentes simétricas establece que estas corrientes producen un campo magnético giratorio en sentido opuesto al giro del rotor, induciendo corrientes parásitas de doble frecuencia (100 Hz) en el cuerpo macizo del rotor y en los anillos de retención, con calentamiento adiabático severo en cuestión de segundos.

A las **12:33:35.759 CEST** — apenas **quince segundos** después del colapso ibérico — la combinación de inestabilidad por subexcitación y calentamiento por desbalance de fases activó los relés de protección interna del generador (relé de pérdida de excitación ANSI 40 y relé de desbalance / corriente de secuencia negativa ANSI 46), forzando el disparo y la desconexión total de Golfech 1. La pérdida simultánea del HVDC y de este pilar nuclear obligó a RTE a reconfigurar sus flujos desde regiones más septentrionales para evitar un colapso en cascada propio. El reactor fue resincronizado satisfactoriamente a la red el 29 de abril.

### Disparo en la red de subtransmisión: la línea Dax-Arriosses (63 kV)

El impacto no se limitó a la generación convencional. El registro más revelador de la violencia del transitorio en Francia fue el disparo de la **línea aérea de 63 kV Dax–Arriosses** a las **12:33:20.551 CEST**, ordenado por las protecciones de pérdida de sincronismo (relé ANSI 78), configuradas para actuar en el primer latido (_first beat_) de la oscilación.

La actuación de una protección de pérdida de sincronismo en un nivel de 63 kV es extraordinariamente anómala: las oscilaciones de potencia (_power swinging_) suelen detectarse en corredores de 400 kV. Su aparición en 63 kV indica que los <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink> de una agregación masiva de inversores en Aquitania perdieron su referencia angular respecto a la red principal por el transitorio asimétrico y la sobretensión. El relé interpretó la inversión cíclica de las corrientes de los inversores descontrolados como una pérdida de sincronismo clásica de máquinas rotativas, aislando la subred.

| Elemento crítico en Francia | Hora (CEST) | Causa técnica | Impacto sistémico |
| --- | --- | --- | --- |
| Enlace HVDC Baixas–Santa Llogaia | 12:33:20 | Pérdida de la red ibérica receptora | Pérdida súbita de sumidero de 870 MVAr |
| Línea 63 kV Dax–Arriosses | 12:33:20.551 | Relé de pérdida de sincronismo (1er latido) | Aislamiento de subred y desconexión de IBRs locales |
| Unidad Nuclear Golfech 1 (1.290 MW) | 12:33:35.759 | Límite de subexcitación / relés ANSI 40 y 46 | Pérdida de absorción de 426 MVAr; estrés estructural |

### RTE como «nodo infinito» durante la restauración Top-Down

A las **12:40 CEST**, el perfil de tensiones en el suroeste francés logró estabilizarse. A partir de ese instante, la red de RTE asumió un rol estructural insustituible: proporcionar un anclaje electromagnético firme para la restauración del sistema español mediante una estrategia Top-Down.

En la teoría de sistemas de potencia, un **«nodo infinito»** (_infinite bus_) es una fuente de tensión con inercia infinita e impedancia de Thévenin equivalente nula. En la práctica, al estar Francia conectada solidariamente a la inmensa masa inercial de Europa Continental, su red de 400 kV se comportó operativamente como un nodo infinito para la colapsada red ibérica.

A las **12:39 CEST**, REE solicitó formalmente a RTE la reposición de tensión en la subestación de Hernani desde la subestación francesa de Argia. A las **12:41 CEST**, RTE acordó canalizar hasta **400 MW iniciales** para estabilizar las primeras reconexiones en el norte de España. Al cerrar el interruptor fronterizo, Francia impuso su frecuencia nominal (50,00 Hz) y su control de tensión rígido sobre el primer nudo español. Esta potencia de cortocircuito importada absorbió los brutales desequilibrios de reactiva y los escalones de carga activa inevitables al energizar líneas de 400 kV en vacío. Sin el anclaje inercial de este nodo infinito francés, los intentos de REE por restablecer la tensión habrían estado sujetos a oscilaciones insoportables que habrían disparado nuevamente sus protecciones. A lo largo de la tarde, el flujo estabilizador francés se incrementó hasta los **1.400 MW**, constituyendo la columna vertebral de la normalización del sistema español.

## Portugal (REN): el colapso arrastrado y la restauración Bottom-Up

### Por qué Portugal no pudo aislarse

Mientras Francia disponía de una red rígida capaz de rechazar la perturbación cortando los enlaces, la infraestructura de <GlossaryLink term="REE">REN</GlossaryLink> operaba con un acoplamiento eléctrico y geográfico tan denso con España que configurar una operación en isla aislada a tiempo resultó físicamente imposible. Portugal sucumbió en un colapso arrastrado dominado por el acoplamiento reactiva-tensión (Q-V): los disparos en el sur de España retiraron nudos críticos de absorción reactiva, la sobretensión se propagó sin resistencia hacia las subestaciones portuguesas, y el descenso de frecuencia activó los esquemas combinados de <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink> de REE y REN. A pesar del deslastre masivo, el <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink> fue tan pronunciado que los retardos mecánicos de los disyuntores (50–100 ms) hicieron imposible equilibrar el sistema antes de que las protecciones de mínima frecuencia desengancharan las últimas turbinas térmicas.

| Umbral de frecuencia (Hz) | Carga deslastrada en Portugal (MW) | Carga deslastrada en España (MW) | Total (MW) |
| :-: | :-: | :-: | :-: |
| 49,0 | 381 | 1.669 | 2.050 |
| 48,8 | 450 | 1.575 | 2.025 |
| 48,6 | 438 | 1.524 | 1.962 |
| 48,4 | 218 | 1.294 | 1.512 |
| 48,2 | 470 | 2.168 | 2.638 |
| 48,0 | 359 | 588 | 947 |

_Actuación combinada del UFLS de REE y REN por escalones de frecuencia. Fuente: registros PMU de REN y REE._

### La restauración: crónica de fallos y soluciones

Sin ningún enlace externo disponible, REN ejecutó una restauración <GlossaryLink term="Black Start">Bottom-Up</GlossaryLink> basada íntegramente en sus propios recursos de arranque autónomo. La secuencia expone las severas limitaciones que las leyes del electromagnetismo imponen al proceso.

**12:35–12:45 CEST — Primera isla en Zêzere.** REN ordenó el arranque autónomo de la HPP 1-Centro. A las 12:45, la central operaba en modo isócrono y logró energizar la barra de 220 kV de la subestación de Zêzere. Se había formado la primera isla.

**12:49 CEST — Colapso por _sympathetic inrush_.** El protocolo exigía energizar el Transformador 4 de Zêzere (170 MVA, relación 220/60 kV). Al cerrar el interruptor, HPP 1-Centro disparó instantáneamente. La causa fue el **fenómeno de _sympathetic inrush current_**: un transformador de 170 MVA, al ser energizado desde una red débil —una única máquina hidroeléctrica con baja potencia de cortocircuito y alta impedancia subtransitoria—, demanda una corriente magnetizante que puede exceder en un orden de magnitud la corriente nominal, con alto contenido de armónicos de segundo orden y factor de potencia extremadamente bajo. El generador aislado no pudo proveer esta ráfaga de potencia reactiva; el hundimiento transitorio de tensión activó los relés de protección. Los intentos de arrancar pequeños grupos auxiliares dentro de la misma planta fracasaron durante las siguientes tres horas.

**12:43–16:38 CEST — Fallos en los ciclos combinados.** Paralelamente, REN despachó a las 12:43 la orden de arranque autónomo para el CCGT 1-Norte. A pesar de que la turbina de gas respondió mecánicamente, la central fue incapaz de cerrar el interruptor del generador durante horas: los bancos de baterías de corriente continua de la subestación presentaban caída de tensión por descarga prolongada, dejando sin alimentación las bobinas de cierre de los disyuntores de alta tensión. El bloqueo se solventó finalmente a las **16:38 CEST**.

**15:40–15:55 CEST — Segundo intento y nuevo colapso.** Tras labores de reconfiguración, HPP 1-Centro reinició a las 15:40 y logró energizar nuevamente la barra de 220 kV. A las 15:51 se conectó un bloque de demanda local de **5 MW**, pero la fragilidad inercial de la isla fue tal que las fluctuaciones provocaron un nuevo disparo a las 15:55.

### La maniobra decisiva: Torrão como compensador síncrono puro

Era evidente que la isla carecía de la rigidez necesaria (potencia de cortocircuito) para absorber escalones de carga. Tras reiniciar HPP 1-Centro a las **16:13 CEST**, REN ejecutó a las **17:23 CEST** una maniobra de máxima sofisticación técnica: arrancó la **Unidad 2 del HPP Torrão**, pero no para inyectar potencia activa, sino en **modo de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensador síncrono</GlossaryLink> puro**.

Operar una central hidroeléctrica como compensador síncrono implica vaciar la cámara de la turbina inyectando aire a presión (_depresión de la cola de agua_), permitiendo que el rodete gire libremente en el aire acoplado a la red. El generador consume una cantidad marginal de potencia activa para vencer la fricción mecánica, pero mediante el control de su sistema de excitación inyecta o absorbe masivas cantidades de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> de manera instantánea. Más crítico aún: la enorme masa rotante del rotor de Torrão aportó <GlossaryLink term="Inercia (H)">inercia</GlossaryLink> cinemática pura y multiplicó la potencia de cortocircuito de la isla de Zêzere.

Esta maniobra actuó como amortiguador electrodinámico. La tensión en la isla se estabilizó, permitiendo desde las **16:26 CEST** la reposición progresiva de carga en las redes de 60 kV y 150 kV y la extensión de tensión a las plantas HPP 2 y HPP 3 Centro. A las **16:38 CEST** se estableció la segunda zona segura de restauración desde el CCGT 1-Norte.

### Sincronización a 0 MW y normalización total

Hacia las 20:00 CEST, las dos islas portuguesas habían sido malladas internamente, pero seguían operando de manera asíncrona respecto a España y el resto de Europa. El paso más delicado era el acoplamiento con la red de REE, ya sincronizada con el nodo infinito francés.

A las **20:25 CEST**, se procedió al cierre de la interconexión bajo un requisito técnico innegociable: un **programa de intercambio de 0 MW**. La física subyacente se rige por la ecuación de transferencia de potencia entre dos áreas síncronas:

$$P = \frac{V_1 V_2}{X} \sin\delta$$

Para cerrar el interruptor de interconexión sin generar un transitorio destructivo de potencia sincronizante, la diferencia de ángulo de fase ($\delta$) entre el nodo portugués y el español debía ser exactamente cero y las magnitudes de tensión iguales. Al establecer una consigna de 0 MW en los sistemas de Control Automático de Generación (AGC), los operadores garantizaron que ninguna de las dos redes intentara exportar inercia hacia la otra en el instante del acoplamiento. Un error habría forzado un flujo violento, disparando las protecciones direccionales y precipitando a Portugal en un segundo apagón.

Con el éxito de la maniobra, Portugal recuperó la referencia síncrona continental. La robustez proporcionada por la interconexión permitió acelerar el levantamiento del resto de la demanda, alcanzando la normalización total a las **00:22 del 29 de abril** — **diecisiete horas** después del cero de tensión.


```

### 📄 Archivo: `docs\dimension-europea\02-coordinacion-continental.mdx`
```mdx
---
sidebar_position: 2
hide_title: true
title: "Coordinación Continental"
---

import GlossaryLink from '@site/src/components/GlossaryLink';
import GlitchTitle from "@site/src/components/GlitchTitle";

<GlitchTitle>Coordinación Continental</GlitchTitle>

La separación abrupta de la Península Ibérica del sistema síncrono de Europa Continental no fue solo un incidente de infraestructura: fue el primer test en condiciones reales del sistema de gobernanza paneuropea de redes eléctricas diseñado tras el gran apagón europeo de 2006. Este capítulo documenta cómo respondió esa arquitectura institucional — sus velocidades, sus aciertos y sus límites — desde los primeros segundos del colapso hasta la resincronización final.

## Los Monitores del Área Síncrona (SAM): activación del mando unificado

La arquitectura de gobernanza de <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink> designa a los **Monitores del Área Síncrona** (SAM, _Synchronous Area Monitors_) para asumir el control de coordinación macroscópica en eventos que amenazan la integridad de Europa Continental. En abril de 2025, estos roles recayeron sobre **Swissgrid** (Suiza) y **Amprion** (Alemania). Las contingencias del 28-A en España, Portugal y Francia recaían directamente sobre el dominio de supervisión de Swissgrid.

El <GlossaryLink term="EAS (ENTSO-E Awareness System)">ENTSO-E Awareness System (EAS)</GlossaryLink> — una plataforma de comunicaciones encriptada y centralizada — operó como el sistema nervioso de la gestión de la crisis. La cronología de los despachos revela la velocidad a la que se estructuró un mando unificado supranacional:

| Hora (CEST) | Emisor | Receptor | Mensaje / Decisión estratégica |
| --- | --- | --- | --- |
| 12:34–12:36 | REE | REN | Confirmación mutua de apagón total; acuerdo para fijar programas de intercambio en 0 MW. |
| 12:39 | Amprion | Swissgrid | Confirmación de la alerta formal de _System Split_ en el portal EAS, activando el estado de emergencia europeo. |
| 12:41 | Swissgrid | RTE | Petición de actualización; RTE confirma planes para enviar 400 MW de soporte inicial a REE. |
| 12:47 | REE | Swissgrid | Reporte oficial de _Blackout_ desde Madrid; compartición de los primeros esquemas de restauración Top-Down. |
| 12:47 | TERNA | RTE | El TSO italiano ofrece soporte activo y flexibilidad de flujos en la frontera oriental francesa. |
| 12:49–12:54 | Swissgrid / Amprion | Todos (CE) | Formalización de la estructura de mando unificada. |
| 15:50 | Amprion | RTE | Alerta sobre peticiones anómalas de 2.500 MW en PICASSO asociadas a precios negativos. |

La ventana crítica se sitúa entre las **12:49 y las 12:54 CEST**: en apenas cinco minutos, los SAM aplicaron el protocolo estandarizado de separación de sistemas de ENTSO-E, asignando tres roles diferenciados con autoridad exclusiva y no solapable:

**<GlossaryLink term="REE">REE</GlossaryLink> — Líder de Frecuencia Ibérico.** Mandato exclusivo de equilibrar la ratio generación/demanda dentro del bloque aislado, gestionando el deslastre y el arranque paulatino sin interferencias externas.

**Swissgrid — Líder de Frecuencia de Europa Continental.** Control del resto del área síncrona, orquestando las reservas de contención de frecuencia (FCR) en más de 20 países para compensar la súbita sobrefrecuencia generada por la pérdida de las exportaciones hacia la península y el apagado del HVDC Baixas.

**RTE — Líder de Resincronización.** Autoridad absoluta sobre las operaciones de cierre en los enlaces transpirenaicos. Ni REE ni ninguna otra entidad podía operar un interruptor fronterizo sin la validación previa de los parámetros de deslizamiento y tensión desde las salas de control de RTE en París y Toulouse.

## El papel de Coreso: el escudo matemático de la restauración

Mientras los TSOs nacionales maniobran interruptores físicos, el Centro de Coordinación Regional (RCC) **Coreso** (Bruselas) ejecutaba una inmensa labor computacional para garantizar que las soluciones de la crisis no provocaran nuevos apagones.

Al avanzar la tarde, los envíos de potencia de emergencia desde Francia hacia España escalaron hasta negociarse importaciones transitorias de hasta **2.000 MW**. Estas inyecciones masivas modifican severamente los flujos de carga naturales a lo largo de las redes francesas, suizas y alemanas. Coreso, utilizando herramientas de **Análisis de Seguridad Coordinada** (CSA), procesó flujos de carga de corriente alterna sobre el **modelo unificado europeo** (CGM) casi en tiempo real.

Su objetivo era verificar la estricta observancia del <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink>: certificar mediante simulaciones que, si mientras Francia exportaba esos 2.000 MW de soporte se perdía súbitamente un corredor interno francés o alemán, la red interconectada restante no sufriría sobrecargas térmicas ni salidas de rango de tensión. Simultáneamente, el Nordic RCC lideró el **Análisis de Adecuación a Corto Plazo** (STA), confirmando a los SAM que existía capacidad rodante disponible en el centro de Europa para sostener este esfuerzo sin poner en riesgo la punta de demanda nocturna de los países donantes.

Esta validación de Coreso fue el **escudo matemático** que permitió a RTE operar con confianza táctica. Sin ella, el riesgo de propagación de la inestabilidad desde la península hacia el núcleo de la red continental habría obligado a limitar severamente el soporte, ralentizando la recuperación.

## Las limitaciones que el EAS no pudo ocultar

La coordinación multinacional funcionó con notable eficacia una vez activado el estado de emergencia. Sin embargo, el episodio expuso con crudeza las limitaciones estructurales del sistema europeo de monitorización en la fase previa: tal como se documenta en el análisis del sistema español, el bloque ibérico transitó directamente del estado «Normal» al estado «Blackout» (criterio OB3) sin pasar por los estados intermedios de Alerta o Emergencia previstos en las <GlossaryLink term="SO GL (System Operation Guidelines)">System Operation Guidelines</GlossaryLink>.

El resultado fue que los operadores vecinos — RTE, Swissgrid, Coreso — no recibieron señales anticipatorias de vulnerabilidad dinámica al sur de los Pirineos. La primera actuación de la arquitectura SAM/EAS no fue preventiva sino reactiva: el EAS actuó como notificador _post mortem_ del colapso, no como herramienta de alerta temprana. Esta limitación — la incapacidad del sistema europeo de monitorización para capturar la dinámica rápida de tensión en redes de baja inercia — es una de las lecciones regulatorias centrales del incidente y el punto de partida de las reformas documentadas en la sección siguiente.

La comunicación se mantuvo constante hasta el fin de la emergencia, culminando a las **00:11 CEST del 29 de abril**, momento en que RTE notificó a Swissgrid que el algoritmo de Control Automático de Generación (AGC) de REE estaba de nuevo en lazo cerrado estabilizado — señal que certificó el fin del estado de emergencia continental.


```

### 📄 Archivo: `docs\dimension-europea\03-dia-despues.mdx`
```mdx
---
sidebar_position: 3
hide_title: true
title: "El Día Después: Reformas Institucionales"
---

import GlossaryLink from '@site/src/components/GlossaryLink';
import GlitchTitle from "@site/src/components/GlitchTitle";

<GlitchTitle>El Día Después: Reformas Institucionales</GlitchTitle>

El 28 de abril de 2025 no cerró sus efectos con la reposición del suministro eléctrico. Abrió un período de revisión institucional acelerada en el que <GlossaryLink term="ENTSO-E">ENTSO-E</GlossaryLink>, ACER y los reguladores nacionales de toda la Unión Europea reescribieron, en el plazo de ocho meses, un conjunto de metodologías que habían permanecido inalteradas durante lustros. Esta sección documenta las reformas que el TFG no cubre — las relativas a la arquitectura de reservas, la adecuación de recursos, la plataforma PICASSO, la nueva métrica de fortaleza de red y las respuestas políticas nacionales — y que completan el cuadro de consecuencias del incidente a escala continental.

## Primera Enmienda a la Metodología de Dimensionamiento Regional de Reservas (diciembre 2025)

Aprobada en diciembre de 2025 bajo el Artículo 37(1)(j) del Reglamento (UE) 2019/943, la **Primera Enmienda a la Metodología para el Dimensionamiento Regional de Capacidad de Reserva** supuso un cambio tectónico en cómo Europa calcula sus necesidades de reservas secundarias y terciarias.

Antes del 28-A, el cálculo probabilístico de los márgenes de reserva por Región Operativa (SOR) se basaba en distribuciones estadísticas de desvíos históricos, asumiendo un riesgo aceptable de no cobertura. La Enmienda introdujo una reconfiguración drástica de los niveles de confianza **X%** (percentil para dimensionar reservas positivas) e **Y%** (percentil para reservas negativas), obligando a utilizar datos de desequilibrios en granularidad de 15 minutos en lugar de los promedios horarios anteriores.

La aplicación de la enmienda forzó una divergencia regulatoria fundamentada en la vulnerabilidad técnica de cada región:

| Región Operativa (SOR) | Parámetro histórico | Nuevo percentil (X% / Y%) | Justificación |
| --- | --- | --- | --- |
| **Europa Central (CE)** | 99,00 % | **99,50 %** | Amortigua eventos de cola derivados de rampas solares extremas y fallas N-2/N-3 transfronterizas, sin inmovilizar capital excesivo. |
| **Sudeste Europeo (SEE)** | 99,00 % | **99,99 %** | Los datos históricos pre-2024 no representan el riesgo futuro con la proliferación actual de renovables. Cobertura de eventos de probabilidad extrema (seis sigmas). |
| **Nórdica** | — | **99,90 %–99,99 %** | Desagregado entre regulación a subir y a bajar para desbalances de alta variabilidad. |

El razonamiento subyacente es relevante: la Enmienda reconoce que las colas de distribución de desequilibrios en sistemas de alta penetración renovable son significativamente más gruesas que las que los modelos históricos calibrados con parques térmicos podían capturar. El 28-A demostró que los escenarios de "tail risk" ya no son estadísticamente excepcionales.

Conjuntamente, se mandató bajo el Artículo 157 del <GlossaryLink term="SO GL (System Operation Guidelines)">SO GL</GlossaryLink> la formalización obligatoria e instrumentación en tiempo real de los **Acuerdos de Compartición de Reservas** (_Reserve Sharing Agreements_). La plataforma **PICASSO** para el intercambio transfronterizo de aFRR pasa de considerarse un esquema optativo de eficiencia económica a convertirse en una salvaguarda de resiliencia estructural de obligado cumplimiento, cuyos mecanismos se desarrollan en la sección siguiente.

## Reforma del ERAA post-2025: del LOLE probabilístico al multifactorial

La **Evaluación Europea de Adecuación de Recursos** (ERAA, _European Resource Adequacy Assessment_) es el pilar sobre el que los estados miembros justifican ante la Comisión Europea la implementación de Mecanismos de Capacidad (CRM). Tras el 28-A, la **Decisión 06/2026 de ACER sobre el ERAA 2025** desmanteló metodologías fundamentales.

**Recalibración de la función CARA.** ENTSO-E utilizaba un coeficiente de aversión al riesgo CARA (_Constant Absolute Risk Aversion_) de 0,0075 para simular el comportamiento de inversores de ciclos combinados frente a precios volátiles. ACER dictaminó que este coeficiente carecía de evidencia empírica post-apagón: los riesgos de inestabilidades operativas generan una aversión al riesgo en los inversores significativamente mayor que la simple volatilidad de precios horarios. Se criticó también el modelado de «años objetivo repetidos al infinito» (TY2035) en la metodología EVA, que generaba rentabilidades artificiales que disuadían el desmantelamiento simulado de plantas de carbón obsoletas en países como Polonia, falseando la seguridad sistémica.

**Reformulación del LOLE.** ENTSO-E presentaba resultados de suficiencia probabilística utilizando rangos (ej. para Portugal en 2028: entre 1 y 6 h/año, frente a un estándar de fiabilidad de 1,46 h). ACER dictaminó que utilizar rangos estadísticos socava la solidez legal necesaria para aplicar mecanismos de capacidad. La nueva directriz obliga a entregar un **valor determinista único** que integre **escenarios de inestabilidad multifactorial**: las simulaciones Monte Carlo del ERAA ya no pueden limitarse a modelar déficits de viento y alta demanda, sino que deben calcular la **probabilidad conjunta** de indisponibilidad de renovables cruzada con fallos topológicos de red, perfiles de sobretensión en la red de 400 kV e insuficiencia de reservas rodantes — tal como ocurrió el 28-A.

## Metamorfosis de PICASSO: de la eficiencia económica a la resiliencia estructural

La plataforma **PICASSO** (_Platform for the International Coordination of Automated Frequency Restoration and Stable System Operation_) fue concebida primariamente como una herramienta de optimización de mercado: su algoritmo buscaba el emparejamiento transfronterizo más barato de ofertas de <GlossaryLink term="Fast Frequency Response (FFR)">aFRR</GlossaryLink> con granularidad de 15 minutos, minimizando el coste para los consumidores en condiciones normales.

Durante la gestión de la crisis, a las **15:50 CEST** del 28-A, Amprion alertó a RTE por peticiones computacionales masivas de hasta **2.500 MW** volcadas en PICASSO asociadas a **precios fuertemente negativos**. Estas distorsiones financieras evidenciaron que, en medio de un aislamiento y un deslastre masivo de carga, el algoritmo puramente económico colapsa conceptualmente.

La reforma institucional subsiguiente dictó la formalización de PICASSO como **herramienta de resiliencia estructural de obligado cumplimiento**. Las enmiendas operativas otorgan a los despachos de control de los TSOs la potestad de ejecutar **overrides** (sobrescrituras manuales) inmediatos sobre los algoritmos LFC de la plataforma durante un estado de alerta del EAS. La capacidad interconectada gestionada por PICASSO ya no se somete únicamente al precio marginal: se bloquea preventivamente para inyectar flujos macroscópicos de estabilización direccional, blindando las fronteras vulnerables contra colapsos de inercia o desequilibrios asíncronos rápidos.

## La nueva métrica MRSCR: el certificado de defunción del SCR tradicional

Desde la óptica de la ingeniería eléctrica fundamental, la aportación más profunda del análisis post-28A fue el certificado de defunción del **Ratio de Cortocircuito** (SCR) tradicional como métrica válida para evaluar redes de alta penetración renovable.

El colapso simultáneo de los inversores fotovoltaicos en España y de la subred Dax–Arriosses en Francia demostró que el SCR, al evaluar un único nudo aislado, ignora ciegamente las oscilaciones resonantes e interacciones destructivas que ocurren entre múltiples convertidores de potencia electrónica cercanos. Los códigos de red europeos adoptaron forzosamente la métrica **MRSCR** (_Multiple Renewable Energy Stations Short-Circuit Ratio_):

$$\mathrm{MRSCR}_i = \frac{S_{ac,i}}{P_i + \sum_{j \neq i} \mathrm{MIIF}_{ji} \cdot P_j}$$

<div className="formula-legend">
  <strong>Leyenda de términos:</strong>
  <ul>
    <li><b>MRSCR<sub>i</sub>:</b> Ratio de Cortocircuito Múltiple de Estaciones de Energía Renovable en el nudo <i>i</i>.</li>
    <li><b>S<sub>ac,i</sub>:</b> Capacidad de cortocircuito en CA (MVA) aportada por generadores síncronos y red externa en el nudo <i>i</i>.</li>
    <li><b>P<sub>i</sub>:</b> Potencia nominal (MW) del inversor bajo análisis en el nudo <i>i</i>.</li>
    <li><b>P<sub>j</sub>:</b> Potencia nominal (MW) del inversor adyacente en el nudo <i>j</i>.</li>
    <li><b>MIIF<sub>ji</sub>:</b> Factor de Interacción de Inversores Múltiples <i>(Multi-Infeed Interaction Factor)</i> entre el nudo <i>j</i> y el nudo <i>i</i>, cuantificando su acoplamiento eléctrico.</li>
  </ul>
</div>

Institucionalmente, los nuevos códigos de red establecen el **Valor Crítico** (CMRSCR): por normativa legal obligatoria, el MRSCR calculado en el lado de baja tensión del transformador elevador de cualquier nueva planta IBR no debe ser inferior a **1,5**. Un MRSCR inferior a 1,5 indica una debilidad sistémica insoportable: frente a un hueco de tensión de la red, los lazos de control de los inversores se volverán inestables y desconectarán. Los TSOs están jurídicamente facultados para **bloquear la conexión** de cualquier parque eólico o solar que no cumpla este ratio, obligando a los promotores a instalar <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink> distribuidos en el punto de conexión (_hibridación obligatoria_) para elevar <i>S<sub>ac</sub></i> hasta el umbral.

## Reacciones políticas e institucionales en Europa

### Alemania: del Criterio N-1 a las evaluaciones N-k dinámicas

En Alemania, el apagón forzó **interpelaciones de urgencia en el Bundestag** respecto a la vulnerabilidad de los grandes corredores HVDC que conectan los parques eólicos del Mar del Norte con los centros industriales bávaros. El debate ministerial reconoció que el <GlossaryLink term="Criterio N-1">Criterio *N*−1</GlossaryLink> — el dogma sacrosanto de la seguridad eléctrica europea — ha quedado obsoleto ante los **efectos de cascada no lineales** del siglo XXI, donde la pérdida de una sola línea puede desengancbar múltiples inversores simultáneamente en milisegundos. Como resultado, el Ministerio de Economía y Protección del Clima ordenó a los TSOs alemanes (Amprion, TenneT, 50Hertz, TransnetBW) una revisión inmediata de sus Planes Nacionales de Resiliencia, exigiéndoles transitar hacia **evaluaciones de riesgo N-k dinámicas** que asuman en la planificación topológica la probabilidad conjunta de colapsos sincrónicos y fallos combinados.

### Italia: el fast-track de las interconexiones como infraestructura crítica

En Italia, el análisis del 28-A se focalizó en la **ratio de interconexión** como factor determinante del destino ibérico. España y Portugal contaban con una paupérrima capacidad de intercambio con Francia del 3–5 %, lo que confinó la perturbación e impidió diluirla en el bloque continental — exactamente el mecanismo que había selló el destino del sistema eléctrico italiano en el **gran apagón de 2003**.

El análisis sirvió de ariete político para el TSO italiano (Terna) y el Ministerio del Ambiente y la Seguridad Energética. Los debates en el Parlamento Italiano culminaron en la aprobación de leyes de **vía rápida (_fast-track_) administrativa** para proyectos de interconexión submarina HVDC históricamente paralizados por burocracia ambiental:

- **Enlace Italia–Túnez** (2 GW): reclasificado como «Infraestructura Crítica de Supervivencia Nacional».
- **Cable submarino Italia–Montenegro** (1 GW) bajo el Mar Adriático: ídem.

La justificación de la inversión ya no reposa en la eficiencia del mercado ni en el arbitraje de precios, sino puramente en su función como **canales salvavidas de soporte de cortocircuito transfronterizo**.

### Países Bajos y Dinamarca: redes malladas HVDC en el Mar del Norte

TenneT (Países Bajos) y Energinet (Dinamarca) se encontraban redactando sus Planes de Desarrollo de Redes Offshore cuando el 28-A demostró el caos fronterizo provocado por los inversores aislados en Francia y España. Los presupuestos de 2026 en adelante **cancelaron parcialmente el desarrollo de líneas radiales simples** y se redirigieron hacia la construcción de **Redes Malladas HVDC** (_Multi-terminal HVDC_) en el Mar del Norte, diseñadas con sobrecapacidad intrínseca para compensar oscilaciones de frecuencia instantáneas y soportar desvíos sin depender de los estrangulamientos continentales.

### La guerra institucional ACER–ENTSO-E y el principio de subsidiariedad técnica

A nivel macro-institucional, el 28-A reavivó una disputa de poder entre ACER y ENTSO-E vinculada al **Paquete de Energía Limpia**. ENTSO-E había criticado duramente las directrices de la Comisión Europea que pretendían otorgar poderes vinculantes a los Centros Operativos Regionales (ROCs) sobre el dimensionamiento de las reservas de los estados miembros, argumentando que ceder este poder a los ROCs colisionaba con la responsabilidad civil y penal de los TSOs nacionales sobre la seguridad de su propio suministro.

El apagón ibérico **justificó retroactivamente la postura de los TSOs**: en el instante crítico del colapso de frecuencia, las respuestas deben ser comandadas localmente bajo directrices técnicas duras. Las asignaciones geopolíticas de reservas — como la estricta cuota del 99,99 % en los Balcanes — deben pertenecer al fuero técnico de las entidades que operan físicamente los interruptores frente al precipicio de la inestabilidad, no a algoritmos de mercado optimizados desde Bruselas.

## La lección continental

El paradigma emergente que las reformas post-28A consolidan asume que la energía (MWh) devendrá en un _commodity_ abundante en las subastas europeas, cediendo su posición crítica de escasez a los <GlossaryLink term="Servicios Esenciales de Confiabilidad (ERS)">Servicios Esenciales de Confiabilidad (ERS)</GlossaryLink>: tensión estabilizada dinámicamente mediante <GlossaryLink term="Compensadores Síncronos (SynCons)">compensadores síncronos</GlossaryLink> y <GlossaryLink term="Compensador Síncrono Estático (STATCOM)">STATCOMs</GlossaryLink>, inercia y potencia de cortocircuito. Como señala el Stockholm Environment Institute (SEI): el ritmo frenético de integración de renovables ha dejado obsoleta la velocidad a la que los gobiernos invierten en resiliencia estructural de las redes de transporte.

El apagón ibérico dictó una lección inexorable: el progreso hacia la descarbonización continental no puede desacoplarse de las leyes fundamentales del electromagnetismo ni de la urgente necesidad de **hiper-interconectar y blindar las infraestructuras de transporte transfronterizas**. El 28 de abril de 2025 no fue solo el primer apagón sistémico europeo en dos décadas — fue la demostración empírica de que esa desconexión ya no puede diferirse.


```

### 📄 Archivo: `docs\dimension-europea\_category_.json`
```json
{
  "label": "Dimensión Europea",
  "position": 10,
  "link": {
    "type": "generated-index",
    "description": "Análisis del impacto europeo del apagón del 28-A y la respuesta institucional continental."
  }
}

```

### 📄 Archivo: `docs\glosario.mdx`
```mdx
---
sidebar_position: 10
hide_title: true
title: "Glosario"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import GlosarioTecnico from '@site/src/components/GlosarioTecnico';

<GlosarioTecnico />

```

### 📄 Archivo: `docs\intro.mdx`
```mdx
---
slug: /
sidebar_class_name: "hidden"
title: "Inicio"
---

import ExecutiveHook from "@site/src/components/ExecutiveHook";

<ExecutiveHook />

:::tip Modo de Lectura Recomendado
Para leer este trabajo en orden y disfrutar de una experiencia inmersiva y sin distracciones, te recomendamos pulsar el botón **"Pantalla Completa"** situado en la barra de navegación superior.
:::

```

### 📄 Archivo: `docs\referencias.mdx`
```mdx
---
sidebar_position: 11
hide_title: true
title: "Referencias | Bibliography"
---
import GlitchTitle from "@site/src/components/GlitchTitle";
import BiblioCard from "@site/src/components/BiblioCard";

<GlitchTitle>Referencias | Bibliography</GlitchTitle>

Compilación de fuentes técnicas y documentos oficiales (descargables en PDF) utilizados en el análisis del colapso ibérico del 28 de abril de 2025.

<BiblioCard />

```

