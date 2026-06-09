/**
 * PMODEDiagram.jsx
 * Capítulo 02 — sustituye Figura 8 PNG (HVDC PMODE3→PMODE1)
 *
 * Drop en: src/components/PMODEDiagram/PMODEDiagram.jsx
 * Import:  import PMODEDiagram from '@site/src/components/PMODEDiagram/PMODEDiagram'
 * Uso:     <PMODEDiagram />
 */

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const P = {
  light: {
    surf:   'var(--ifm-background-surface-color)',
    border: 'var(--ifm-color-emphasis-300)',
    divider:'var(--ifm-color-emphasis-200)',
    text:   'var(--ifm-font-color-base)',
    muted:  'var(--ifm-color-emphasis-600)',
    frText: '#1E3868',
    frStroke:'#4A78C0',
    tlLine: '#C8B490',
    tlEvent:'#4A78C0',
    tlKey:  '#A84832',
    p3Bg:   'rgba(42,112,112,.08)',
    p3Bord: '#2A7070',
    p3Text: '#1A4848',
    p3Arrow:'#2A7070',
    p1Bg:   'rgba(168,96,24,.08)',
    p1Bord: '#A86018',
    p1Text: '#5A2808',
    p1Arrow:'#A86018',
  },
  dark: {
    surf:   'var(--ifm-background-surface-color)',
    border: 'var(--ifm-color-emphasis-300)',
    divider:'var(--ifm-color-emphasis-200)',
    text:   'var(--ifm-font-color-base)',
    muted:  'var(--ifm-color-emphasis-600)',
    frText: '#A0C4F0',
    frStroke:'#4A80D0',
    tlLine: '#2A4060',
    tlEvent:'#5890D8',
    tlKey:  '#E05030',
    p3Bg:   'rgba(56,184,160,.10)',
    p3Bord: '#38B8A0',
    p3Text: '#80D8C8',
    p3Arrow:'#38B8A0',
    p1Bg:   'rgba(212,160,64,.10)',
    p1Bord: '#D4A040',
    p1Text: '#F0C878',
    p1Arrow:'#D4A040',
  },
};

export default function PMODEDiagram() {
  const { colorMode } = useColorMode();
  const p = P[colorMode === 'dark' ? 'dark' : 'light'];

  return (
    <div style={{
      background: p.surf,
      border: `0.5px solid ${p.border}`,
      borderRadius: 10,
      overflow: 'hidden',
      margin: '1.5rem 0',
    }}>
      <div style={{ padding: '14px 18px 11px', borderBottom: `0.5px solid ${p.divider}` }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 500, color: p.text }}>
          Cambio de modo en HVDC INELFE-1
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: p.muted }}>
          PMODE3 → PMODE1 · 12:08 CEST · 28 de abril de 2025
        </p>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <svg viewBox="0 0 500 210" style={{ width: '100%', height: 'auto', display: 'block' }}>

          {/* Timeline */}
          <line x1="40" y1="32" x2="460" y2="32" stroke={p.tlLine} strokeWidth=".8" />

          {/* 12:03 */}
          <circle cx="75" cy="32" r="3" fill={p.tlEvent} />
          <text x="75" y="23" textAnchor="middle" fontSize="8.5" fill={p.tlEvent}>12:03</text>
          <text x="75" y="45" textAnchor="middle" fontSize="7.5" fill={p.muted}>Oscilación 0,6 Hz</text>

          {/* 12:08 — key divider */}
          <line x1="178" y1="10" x2="178" y2="195"
            stroke={p.tlKey} strokeWidth=".8" strokeDasharray="3,2" opacity=".6" />
          <circle cx="178" cy="32" r="4" fill={p.tlKey} />
          <text x="178" y="22" textAnchor="middle" fontSize="8.5" fontWeight="500" fill={p.tlKey}>12:08</text>
          <text x="178" y="45" textAnchor="middle" fontSize="7.5" fill={p.tlKey}>Cambio de modo</text>

          {/* 12:32:57 */}
          <circle cx="362" cy="32" r="3" fill={p.tlEvent} />
          <text x="362" y="23" textAnchor="middle" fontSize="8.5" fill={p.tlEvent}>12:32:57</text>
          <text x="362" y="45" textAnchor="middle" fontSize="7.5" fill={p.muted}>Disparo raíz Granada</text>

          {/* 12:33:21 */}
          <circle cx="445" cy="32" r="3" fill={p.tlKey} />
          <text x="445" y="23" textAnchor="middle" fontSize="8.5" fill={p.tlKey}>12:33:21</text>
          <text x="445" y="45" textAnchor="middle" fontSize="7.5" fill={p.tlKey}>Apertura AC</text>

          {/* PMODE3 panel */}
          <rect x="18" y="58" width="146" height="140" rx="5"
            fill={p.p3Bg} stroke={p.p3Bord} strokeWidth=".8" />
          <text x="91" y="76" textAnchor="middle" fontSize="10" fontWeight="500" fill={p.p3Text}>
            PMODE3
          </text>
          <text x="91" y="89" textAnchor="middle" fontSize="8" fill={p.p3Text} opacity=".85">
            respuesta dinámica
          </text>

          {/* ES node P3 */}
          <rect x="26" y="104" width="44" height="23" rx="3"
            fill={p.surf} stroke={p.p3Bord} strokeWidth=".8" />
          <text x="48" y="119" textAnchor="middle" fontSize="9" fontWeight="500" fill={p.p3Text}>ES</text>

          {/* FR node P3 */}
          <rect x="112" y="104" width="44" height="23" rx="3"
            fill={p.surf} stroke={p.frStroke} strokeWidth=".8" />
          <text x="134" y="119" textAnchor="middle" fontSize="9" fontWeight="500" fill={p.frText}>FR</text>

          {/* Bidirectional arrows */}
          <line x1="72" y1="115" x2="110" y2="115" stroke={p.p3Arrow} strokeWidth="1.5" />
          <polygon points="110,115 103,111 103,119" fill={p.p3Arrow} />
          <polygon points="72,115 79,111 79,119" fill={p.p3Arrow} />
          <text x="91" y="134" textAnchor="middle" fontSize="8" fill={p.p3Arrow}>↔  modulable</text>

          <text x="91" y="153" textAnchor="middle" fontSize="7.5" fill={p.muted}>Responde a la diferencia</text>
          <text x="91" y="165" textAnchor="middle" fontSize="7.5" fill={p.muted}>angular entre extremos.</text>
          <text x="91" y="180" textAnchor="middle" fontSize="7.5" fill={p.p3Text}>Puede modular e invertir</text>
          <text x="91" y="191" textAnchor="middle" fontSize="7.5" fill={p.p3Text}>el flujo según la red.</text>

          {/* PMODE1 panel */}
          <rect x="193" y="58" width="290" height="140" rx="5"
            fill={p.p1Bg} stroke={p.p1Bord} strokeWidth=".8" />
          <text x="338" y="76" textAnchor="middle" fontSize="10" fontWeight="500" fill={p.p1Text}>
            PMODE1
          </text>
          <text x="338" y="89" textAnchor="middle" fontSize="8" fill={p.p1Text} opacity=".85">
            potencia constante · sin respuesta dinámica
          </text>

          {/* ES node P1 */}
          <rect x="202" y="104" width="52" height="23" rx="3"
            fill={p.surf} stroke={p.p1Bord} strokeWidth=".8" />
          <text x="228" y="119" textAnchor="middle" fontSize="9" fontWeight="500" fill={p.p1Text}>ES</text>

          {/* FR node P1 */}
          <rect x="420" y="104" width="52" height="23" rx="3"
            fill={p.surf} stroke={p.frStroke} strokeWidth=".8" />
          <text x="446" y="119" textAnchor="middle" fontSize="9" fontWeight="500" fill={p.frText}>FR</text>

          {/* Fixed unidirectional arrow */}
          <line x1="256" y1="115" x2="418" y2="115" stroke={p.p1Arrow} strokeWidth="2.5" />
          <polygon points="418,115 409,110 409,120" fill={p.p1Arrow} />
          <text x="337" y="108" textAnchor="middle" fontSize="9" fontWeight="500" fill={p.p1Arrow}>
            −1.000 MW (exportación fija)
          </text>

          <text x="337" y="137" textAnchor="middle" fontSize="8" fill={p.muted}>
            Sin bucle de control de frecuencia.
          </text>
          <text x="337" y="150" textAnchor="middle" fontSize="8" fill={p.muted}>
            Al inicio de la cascada, el enlace continuó
          </text>
          <text x="337" y="162" textAnchor="middle" fontSize="8" fill={p.muted}>
            extrayendo potencia activa del sistema ibérico
          </text>
          <text x="337" y="177" textAnchor="middle" fontSize="8" fontWeight="500" fill={p.p1Text}>
            mientras las líneas AC importaban reactiva.
          </text>
          <text x="337" y="191" textAnchor="middle" fontSize="7.5" fill={p.muted} opacity=".8">
            Apertura AC por pérdida de sincronismo: 12:33:21 CEST
          </text>
        </svg>
      </div>
    </div>
  );
}
