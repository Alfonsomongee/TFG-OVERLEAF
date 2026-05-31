/**
 * remark-auto-glossary-links.js  (v2 — panel flotante)
 *
 * Remark plugin (CJS) que envuelve TODAS las apariciones de los 119 términos
 * del glosario técnico en cada capítulo MDX con:
 *
 *   <span class="glossary-term" data-term="TÉRMINO">TÉRMINO</span>
 *
 * El GlossaryDefinitionPanel (Root.js) escucha mouseenter sobre estos spans
 * y muestra el panel lateral con la definición sin sacar al lector del capítulo.
 *
 * Diferencias respecto a v1:
 *   - Emite nodo `html` en lugar de `link` → sin navegación
 *   - Sin lógica `seen` → todas las apariciones quedan marcadas
 *   - No añade la clase auto-glossary-link (ya innecesaria)
 */

'use strict';

// ── slugify idéntico a glossary.js (solo necesario para mantener coherencia) ──
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─────────────────────────────────────────────────────────────────────────────
// Lista de los 119 términos, ordenados por longitud DESCENDENTE para que los
// términos más específicos tengan prioridad (p.ej. "GFM (Grid-Forming)" > "GFM")
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

// Más largos primero → evita sub-matches
const TERMS = RAW_TERMS.slice().sort((a, b) => b.length - a.length);

// ─────────────────────────────────────────────────────────────────────────────
// Genera el HTML del span para un término
// ─────────────────────────────────────────────────────────────────────────────
function makeSpan(term) {
  return `<span class="glossary-term" data-term="${escHtml(term)}">${escHtml(term)}</span>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Transforma un string de texto: encuentra la primera ocurrencia del término
// más largo no solapado y la envuelve en un span. Recursivo para el resto.
// Devuelve array de nodos AST (text y/o html).
// ─────────────────────────────────────────────────────────────────────────────
function transformText(text, terms) {
  // Buscar el término coincidente más cercano al inicio del texto
  let earliest = null;
  let earliestIdx = Infinity;

  for (const term of terms) {
    const idx = text.indexOf(term);
    if (idx !== -1 && idx < earliestIdx) {
      // Comprobación de límite de palabra para términos puramente alfanuméricos
      // (evita casar "GFM" dentro de "BESS-GFM")
      const prev = idx > 0 ? text[idx - 1] : ' ';
      const next = idx + term.length < text.length ? text[idx + term.length] : ' ';
      if (/^[a-zA-Z0-9]+$/.test(term)) {
        if (/[a-zA-Z0-9]/.test(prev) || /[a-zA-Z0-9]/.test(next)) continue;
      }
      earliest = term;
      earliestIdx = idx;
    }
  }

  if (!earliest) return [{ type: 'text', value: text }];

  const before = text.slice(0, earliestIdx);
  const after  = text.slice(earliestIdx + earliest.length);

  const nodes = [];
  if (before) nodes.push({ type: 'text', value: before });
  // Nodo HTML raw — Docusaurus/MDX lo pasa tal cual al DOM
  nodes.push({ type: 'html', value: makeSpan(earliest) });
  if (after) nodes.push(...transformText(after, terms));
  return nodes;
}

// ─────────────────────────────────────────────────────────────────────────────
// Walker recursivo — devuelve nodo modificado o array de nodos si hubo split
// ─────────────────────────────────────────────────────────────────────────────
const SKIP_TYPES = new Set([
  'code', 'inlineCode',
  'link',
  'image',
  'html',
  'mdxjsEsm',
  'mdxFlowExpression', 'mdxTextExpression',
  'mdxJsxFlowElement', 'mdxJsxTextElement',
  'math', 'inlineMath',
]);

function walkNode(node) {
  if (SKIP_TYPES.has(node.type)) return node;

  if (node.type === 'text') {
    const newNodes = transformText(node.value, TERMS);
    if (newNodes.length === 1 && newNodes[0].type === 'text' && newNodes[0].value === node.value) {
      return node; // sin cambios
    }
    return newNodes;
  }

  if (node.children && node.children.length > 0) {
    let changed = false;
    const newChildren = [];
    for (const child of node.children) {
      const result = walkNode(child);
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
// Plugin principal
// ─────────────────────────────────────────────────────────────────────────────
function remarkAutoGlossaryLinks() {
  return function transformer(tree) {
    if (!tree.children) return;
    let changed = false;
    const newChildren = [];
    for (const child of tree.children) {
      const result = walkNode(child);
      if (Array.isArray(result)) {
        newChildren.push(...result);
        changed = true;
      } else {
        newChildren.push(result);
        if (result !== child) changed = true;
      }
    }
    if (changed) tree.children = newChildren;
  };
}

module.exports = remarkAutoGlossaryLinks;
