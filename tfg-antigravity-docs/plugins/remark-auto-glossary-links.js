/**
 * remark-auto-glossary-links.js
 *
 * Remark plugin (CJS) que enlaza automáticamente la PRIMERA aparición de
 * cada uno de los 119 términos del glosario técnico en cada capítulo MDX.
 *
 * - El enlace apunta a /glosario#<slug>
 * - Solo la primera ocurrencia por archivo (el resto se deja como texto plano)
 * - No toca texto que ya esté dentro de un enlace existente
 * - No toca bloques/fragmentos de código (type: 'code' / 'inlineCode')
 * - No necesita unist-util-visit (usa walker propio para evitar problemas ESM)
 *
 * Integración en docusaurus.config.js:
 *   remarkPlugins: [
 *     [require('remark-math'), { strict: false }],
 *     require('./plugins/remark-auto-glossary-links'),
 *   ],
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Función slugify idéntica a la de glossary.js (para mantener coherencia)
// ─────────────────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Lista de los 119 términos del glosario (term + id precomputado)
// Ordenados por longitud DESCENDENTE para que los términos más largos
// tengan prioridad en la detección (p.ej. "GFM (Grid-Forming)" antes que "GFM")
// ─────────────────────────────────────────────────────────────────────────────
const RAW_TERMS = [
  'AELEC',
  'aFRR',
  'Área de Control',
  'Arranque autónomo (Black Start)',
  'BESS',
  'BESS con inversores Grid-Forming (BESS-GFM)',
  'Bucle de retroalimentación (Feedback loop)',
  'Cambiadores de Tomas en Carga (OLTC)',
  'CCGT',
  'CECRE',
  'Centros de Coordinación Regional (RCC)',
  'Colapso Q-V',
  'Compensadores Síncronos (SynCons)',
  'Compensador Síncrono Estático (STATCOM)',
  'Control Grid-forming frente a Grid-following',
  'Coste Nivelado de la Energía (LCOE)',
  'Crisis communication failure',
  'Criterio N-1',
  'CSN',
  'Curva de capacidad reactiva (Capability Curve)',
  'Curva de Pato (Duck Curve)',
  'Curvas de estabilidad de tensión Q-V',
  'Damping ratio',
  'EAS (ENTSO-E Awareness System)',
  'EAS',
  'Efecto Ferranti',
  'Emergent norm theory',
  'Encuadre mediático (Framing) y Agenda-shifting',
  'ENTSO-E',
  'ERS',
  'Estabilidad de tensión',
  'Estabilizadores del Sistema de Potencia (PSS)',
  'Estrategia Brownfield',
  'Fast Frequency Response (FFR)',
  'FFR',
  'Frecuencia nominal',
  'GFL',
  'GFM',
  'Headroom: Reserva de Capacidad del Inversor',
  'HVDC',
  'IBR',
  'IGBT (Insulated Gate Bipolar Transistor)',
  'Impedancia de transferencia',
  'Infodemia',
  'Inercia Sintética',
  'LCOE',
  'Low Voltage Ride Through (LVRT)',
  'Mallado',
  'Network Code on Requirements for Generators (NC RfG)',
  'OLTC',
  'OST',
  'Oscilaciones electromecánicas',
  'Oscilaciones forzadas y naturales',
  'Outrage communication (Comunicación de indignación)',
  'PLL',
  'PMU',
  'PNIEC',
  'Potencia de cortocircuito (Ssc)',
  'Power System Stabilizers y Power Oscillation Damping (PSS/POD)',
  'Procedimiento de Operación 1.6 (P.O. 1.6)',
  'Procedimiento de Operación 7.4 (P.O. 7.4)',
  'Programa DS3 de EirGrid',
  'Protecciones de pérdida de sincronismo (OST)',
  'RCC',
  'REE',
  'Régimen de Renovables, Cogeneración y Residuos (RCR)',
  'Relés de comprobación de sincronismo (Synchro-check)',
  'Relés de Deslastre de Carga (UFLS)',
  'Reserva de Restauración de Frecuencia Automática (aFRR)',
  'RoCoF',
  'SCADA',
  'SCR',
  'Servicios Esenciales de Confiabilidad (ERS)',
  'Sincronismo',
  'Sistema en por unidad (p.u.)',
  'Sistema VOLTAIRE',
  'SO GL (System Operation Guidelines)',
  'SynCon',
  'Tasa de Cambio de Frecuencia (RoCoF)',
  'TSO',
  'UFLS',
  'V2G',
  'Vacuum filling (Relleno del vacío informativo)',
  'Vehicle-to-Grid (V2G)',
  'WAMS',
  'Inercia (H)',
  'Potencia reactiva',
  'Potencia activa',
  'Black Start',
  'Tap-Lag',
  'NC RfG',
  'GFL (Grid-Following)',
  'GFM (Grid-Forming)',
  'Phase-Locked Loop (PLL)',
  'SCADA (Supervisory Control and Data Acquisition)',
  'WAMS (Wide Area Monitoring Systems)',
  'PMU (Phasor Measurement Unit)',
  'RoCoF (Rate of Change of Frequency)',
  'UFLS (Underfrequency Load Shedding)',
  'OLTC (On-Load Tap Changer)',
  'Capacidad Neta de Transferencia (NTC)',
  'Ratio de amortiguamiento',
  'Potencia de cortocircuito',
  'Sistema por Unidad (p.u.)',
  'GFL vs GFM (Grid-Following vs Grid-Forming)',
  'Headroom',
  'LVRT (Low Voltage Ride Through)',
  'HVRT (High Voltage Ride Through)',
  'MRSCR (Multiple Renewable Short-Circuit Ratio)',
  'MIIF (Multi-Infeed Interaction Factor)',
  'ANSI 59 (Protección de Sobretensión)',
  'ANSI 78 (Protección de Pérdida de Sincronismo)',
  'Magnetizing Inrush',
  'Sympathetic Inrush',
  'VoLL (Value of Lost Load)',
];

// Deduplicar por slug (algunas entradas del glosario tienen el mismo id)
const seenSlugs = new Set();
const TERMS = RAW_TERMS
  .map(term => ({ term, id: slugify(term) }))
  .filter(({ id }) => {
    if (seenSlugs.has(id)) return false;
    seenSlugs.add(id);
    return true;
  })
  // Más largos primero → evita solapamientos (p.ej. "GFM (Grid-Forming)" > "GFM")
  .sort((a, b) => b.term.length - a.term.length);

// ─────────────────────────────────────────────────────────────────────────────
// Función principal: busca la primera aparición de cada término en el texto,
// en orden de posición, marcando como vistos los encontrados.
// Devuelve un array de nodos (text y/o link).
// ─────────────────────────────────────────────────────────────────────────────
function transformText(text, terms, seen) {
  // Encontrar el match no-visto más cercano al inicio del texto
  let earliest = null;
  let earliestIdx = Infinity;

  for (const t of terms) {
    if (seen.has(t.term)) continue;
    const idx = text.indexOf(t.term);
    if (idx !== -1 && idx < earliestIdx) {
      // Verificar que no es un sub-match accidental (word-boundary aproximado)
      // Solo bloqueamos si el carácter anterior/siguiente es alfanumérico Y el
      // término es puramente alfabético (para evitar casar "GFM" dentro de "BESS-GFM")
      const before = idx > 0 ? text[idx - 1] : ' ';
      const after  = idx + t.term.length < text.length ? text[idx + t.term.length] : ' ';
      const termIsAlnum = /^[a-zA-Z0-9]+$/.test(t.term);
      if (termIsAlnum) {
        const prevIsAlnum = /[a-zA-Z0-9]/.test(before);
        const nextIsAlnum = /[a-zA-Z0-9]/.test(after);
        if (prevIsAlnum || nextIsAlnum) continue; // sub-match, ignorar
      }
      earliest = t;
      earliestIdx = idx;
    }
  }

  if (!earliest) return [{ type: 'text', value: text }];

  seen.add(earliest.term);

  const beforeText = text.slice(0, earliestIdx);
  const afterText  = text.slice(earliestIdx + earliest.term.length);

  const nodes = [];
  if (beforeText) nodes.push({ type: 'text', value: beforeText });

  nodes.push({
    type: 'link',
    url: `/glosario#${earliest.id}`,
    title: null,
    children: [{ type: 'text', value: earliest.term }],
    data: { hProperties: { className: 'auto-glossary-link' } },
  });

  // Procesar el resto del texto recursivamente (puede contener otros términos)
  if (afterText) {
    const rest = transformText(afterText, terms, seen);
    nodes.push(...rest);
  }

  return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// Walker recursivo que transforma el árbol AST.
// Devuelve el nodo modificado (o array de nodos si un text se expandió).
// ─────────────────────────────────────────────────────────────────────────────

// Tipos de nodos en los que NO se buscan términos
const SKIP_TYPES = new Set([
  'code', 'inlineCode',
  'link',          // no re-enlazar texto ya enlazado
  'image',
  'html',
  'mdxjsEsm',
  'mdxFlowExpression', 'mdxTextExpression',
  'mdxJsxFlowElement', 'mdxJsxTextElement',
  'math', 'inlineMath',
]);

function walkNode(node, terms, seen) {
  if (SKIP_TYPES.has(node.type)) return node;

  if (node.type === 'text') {
    const newNodes = transformText(node.value, terms, seen);
    // Si no hubo cambio, devolver el nodo original
    if (newNodes.length === 1 && newNodes[0].type === 'text' && newNodes[0].value === node.value) {
      return node;
    }
    return newNodes; // array
  }

  if (node.children && node.children.length > 0) {
    const newChildren = [];
    let changed = false;
    for (const child of node.children) {
      const result = walkNode(child, terms, seen);
      if (Array.isArray(result)) {
        newChildren.push(...result);
        changed = true;
      } else {
        newChildren.push(result);
        if (result !== child) changed = true;
      }
    }
    if (!changed) return node;
    return { ...node, children: newChildren };
  }

  return node;
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin principal (función que devuelve el transformer)
// ─────────────────────────────────────────────────────────────────────────────
function remarkAutoGlossaryLinks() {
  return function transformer(tree) {
    const seen = new Set(); // términos ya enlazados en este archivo

    if (tree.children) {
      const newChildren = [];
      let changed = false;
      for (const child of tree.children) {
        const result = walkNode(child, TERMS, seen);
        if (Array.isArray(result)) {
          newChildren.push(...result);
          changed = true;
        } else {
          newChildren.push(result);
          if (result !== child) changed = true;
        }
      }
      if (changed) tree.children = newChildren;
    }
  };
}

module.exports = remarkAutoGlossaryLinks;
