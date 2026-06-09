/**
 * InterconexionMap.jsx
 * Capítulo 02 — figura nueva, sección "La isla energética ibérica"
 *
 * Drop en: src/components/InterconexionMap/InterconexionMap.jsx
 * Import:  import InterconexionMap from '@site/src/components/InterconexionMap/InterconexionMap'
 * Uso:     <InterconexionMap />
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
    penFill:   '#EAF0DE',
    penStroke: '#5E8442',
    frFill:    'rgba(120,160,220,.14)',
    frStroke:  '#4A78C0',
    frText:    '#1E3868',
    maFill:    'rgba(200,160,80,.14)',
    maStroke:  '#A87020',
    maText:    '#5A3808',
    lineIBR:   '#5E8442',
    lineHVDC:  '#2A4875',
    lineSouth: '#A87020',
    warnBg:    'rgba(168,96,24,.08)',
    warnBord:  '#A86018',
    warnText:  '#5A2808',
    warnVal:   '#A86018',
  },
  dark: {
    surf:   'var(--ifm-background-surface-color)',
    border: 'var(--ifm-color-emphasis-300)',
    divider:'var(--ifm-color-emphasis-200)',
    text:   'var(--ifm-font-color-base)',
    muted:  'var(--ifm-color-emphasis-600)',
    penFill:   '#1A2E18',
    penStroke: '#72BC54',
    frFill:    'rgba(72,120,200,.14)',
    frStroke:  '#4A80D0',
    frText:    '#A0C4F0',
    maFill:    'rgba(212,160,64,.14)',
    maStroke:  '#D4A040',
    maText:    '#F0C878',
    lineIBR:   '#72BC54',
    lineHVDC:  '#5890D8',
    lineSouth: '#D4A040',
    warnBg:    'rgba(212,160,64,.10)',
    warnBord:  '#D4A040',
    warnText:  '#F0C878',
    warnVal:   '#D4A040',
  },
};

export default function InterconexionMap() {
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
          La isla energética ibérica
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: p.muted }}>
          Capacidades de interconexión con los sistemas vecinos · condiciones del 28-A
        </p>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <svg viewBox="0 0 480 280" style={{ width: '100%', height: 'auto', display: 'block' }}>

          {/* Peninsula — simplified recognizable outline */}
          <path
            d="M 162,82 L 152,100 L 138,122 L 144,158 L 168,177 L 198,185 L 228,176 L 252,154 L 265,124 L 268,94 L 252,72 L 220,63 L 183,62 L 162,68 Z"
            fill={p.penFill}
            stroke={p.penStroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <text x="160" y="128" fontSize="9.5" fill={p.muted} fontStyle="italic">PT</text>
          <text x="208" y="125" fontSize="9.5" fill={p.muted} fontStyle="italic">ES</text>

          {/* France */}
          <rect x="248" y="12" width="90" height="38" rx="4"
            fill={p.frFill} stroke={p.frStroke} strokeWidth=".8" />
          <text x="293" y="29" textAnchor="middle" fontSize="10.5" fontWeight="500" fill={p.frText}>
            FRANCE · RTE
          </text>
          <text x="293" y="43" textAnchor="middle" fontSize="8.5" fill={p.frText} opacity=".8">
            Sistema Continental ENTSO-E
          </text>

          {/* Morocco */}
          <rect x="150" y="218" width="102" height="38" rx="4"
            fill={p.maFill} stroke={p.maStroke} strokeWidth=".8" />
          <text x="201" y="235" textAnchor="middle" fontSize="10.5" fontWeight="500" fill={p.maText}>
            MARRUECOS · ONEE
          </text>
          <text x="201" y="249" textAnchor="middle" fontSize="8.5" fill={p.maText} opacity=".8">
            Enlace AC submarino
          </text>

          {/* AC lines to France (dashed) */}
          <line x1="250" y1="68" x2="263" y2="50"
            stroke={p.lineIBR} strokeWidth="1.5" strokeDasharray="5,3" opacity=".85" />
          {/* HVDC to France (solid) */}
          <line x1="256" y1="70" x2="268" y2="50"
            stroke={p.lineHVDC} strokeWidth="2.5" />

          {/* Morocco line */}
          <line x1="196" y1="185" x2="196" y2="218"
            stroke={p.lineSouth} strokeWidth="1.5" strokeDasharray="5,3" opacity=".85" />

          {/* France labels */}
          <text x="242" y="62" textAnchor="end" fontSize="8.5" fill={p.lineIBR}>
            líneas AC · 2.700 MW
          </text>
          <text x="242" y="74" textAnchor="end" fontSize="8.5" fill={p.lineHVDC}>
            HVDC INELFE-1 · 2.000 MW
          </text>
          {/* Morocco label */}
          <text x="172" y="211" fontSize="8.5" fill={p.lineSouth}>900 MW técnicos</text>

          {/* Ratio badge */}
          <rect x="10" y="148" width="120" height="58" rx="5"
            fill={p.warnBg} stroke={p.warnBord} strokeWidth=".7" />
          <text x="70" y="166" textAnchor="middle" fontSize="8.5"
            letterSpacing=".06em" fill={p.warnText}>INTERCONEXIÓN</text>
          <text x="70" y="188" textAnchor="middle" fontSize="22"
            fontWeight="500" fill={p.warnVal}>3–5 %</text>
          <text x="70" y="201" textAnchor="middle" fontSize="7.5" fill={p.muted}>
            cap. instalada · objetivo UE 2030: 15 %
          </text>

          {/* Right panel */}
          <text x="305" y="88" fontSize="9.5" fontWeight="500" fill={p.text}>
            Interconexiones con Francia
          </text>
          {[
            [p.lineIBR, '14 líneas AC transpirenaicas'],
            [p.lineHVDC, 'HVDC VSC Santa Llogaia–Baixas'],
            [p.lineIBR, '870 MW flujo habitual · día del 28-A'],
          ].map(([c, t], i) => (
            <g key={i}>
              <circle cx="308" cy={103 + i * 14} r="2.5" fill={c} />
              <text x="315" y={107 + i * 14} fontSize="8.5" fill={p.muted}>{t}</text>
            </g>
          ))}

          <text x="305" y="158" fontSize="9.5" fontWeight="500" fill={p.text}>
            Efectos de la insularidad
          </text>
          {[
            'Efecto látigo: las perturbaciones del',
            'sistema continental se amplifican',
            'en la periferia ibérica.',
            ' ',
            'El cuello de botella pirenaico limita',
            'el soporte dinámico importable desde',
            'los grandes alternadores centroeuropeos.',
          ].map((t, i) => (
            <text key={i} x="305" y={172 + i * 12} fontSize="8.5" fill={p.muted}>{t}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}
