"use strict";

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const RAW_TERMS = [
  "AELEC",
  "aFRR",
  "Área de Control",
  "Arranque autónomo (Black Start)",
  "BESS",
  "BESS con inversores Grid-Forming (BESS-GFM)",
  "Bucle de retroalimentación (Feedback loop)",
  "Cambiadores de Tomas en Carga (OLTC)",
  "CCGT",
  "CECRE",
  "Centros de Coordinación Regional (RCC)",
  "Colapso Q-V",
  "Compensadores Síncronos (SynCons)",
  "Compensador Síncrono Estático (STATCOM)",
  "Control Grid-forming frente a Grid-following",
  "Coste Nivelado de la Energía (LCOE)",
  "Crisis communication failure",
  "Criterio N-1",
  "CSN",
  "Curva de capacidad reactiva (Capability Curve)",
  "Curva de Pato (Duck Curve)",
  "Curvas de estabilidad de tensión Q-V",
  "Damping ratio",
  "EAS (ENTSO-E Awareness System)",
  "EAS",
  "Efecto Ferranti",
  "Emergent norm theory",
  "Encuadre mediático (Framing) y Agenda-shifting",
  "ENTSO-E",
  "ERS",
  "Estabilidad de tensión",
  "Estabilizadores del Sistema de Potencia (PSS)",
  "Estrategia Brownfield",
  "Fast Frequency Response (FFR)",
  "FFR",
  "Frecuencia nominal",
  "GFL",
  "GFM",
  "Headroom: Reserva de Capacidad del Inversor",
  "HVDC",
  "IBR",
  "IGBT (Insulated Gate Bipolar Transistor)",
  "Impedancia de transferencia",
  "Infodemia",
  "Inercia Sintética",
  "LCOE",
  "Low Voltage Ride Through (LVRT)",
  "Mallado",
  "Network Code on Requirements for Generators (NC RfG)",
  "OLTC",
  "OST",
  "Oscilaciones electromecánicas",
  "Oscilaciones forzadas y naturales",
  "Outrage communication (Comunicación de indignación)",
  "PLL",
  "PMU",
  "PNIEC",
  "Potencia de cortocircuito (Ssc)",
  "Power System Stabilizers y Power Oscillation Damping (PSS/POD)",
  "Procedimiento de Operación 1.6 (P.O. 1.6)",
  "Procedimiento de Operación 7.4 (P.O. 7.4)",
  "Programa DS3 de EirGrid",
  "Protecciones de pérdida de sincronismo (OST)",
  "RCC",
  "REE",
  "Régimen de Renovables, Cogeneración y Residuos (RCR)",
  "Relés de comprobación de sincronismo (Synchro-check)",
  "Relés de Deslastre de Carga (UFLS)",
  "Reserva de Restauración de Frecuencia Automática (aFRR)",
  "RoCoF",
  "SCADA",
  "SCR",
  "Servicios Esenciales de Confiabilidad (ERS)",
  "Sincronismo",
  "Sistema en por unidad (p.u.)",
  "Sistema VOLTAIRE",
  "SO GL (System Operation Guidelines)",
  "SynCon",
  "Tasa de Cambio de Frecuencia (RoCoF)",
  "TSO",
  "UFLS",
  "V2G",
  "Vacuum filling (Relleno del vacío informativo)",
  "Vehicle-to-Grid (V2G)",
  "WAMS",
  "Inercia (H)",
  "Potencia reactiva",
  "Potencia activa",
  "Black Start",
  "Tap-Lag",
  "NC RfG",
  "GFL (Grid-Following)",
  "GFM (Grid-Forming)",
  "Phase-Locked Loop (PLL)",
  "SCADA (Supervisory Control and Data Acquisition)",
  "WAMS (Wide Area Monitoring Systems)",
  "PMU (Phasor Measurement Unit)",
  "RoCoF (Rate of Change of Frequency)",
  "UFLS (Underfrequency Load Shedding)",
  "OLTC (On-Load Tap Changer)",
  "Capacidad Neta de Transferencia (NTC)",
  "Ratio de amortiguamiento",
  "Potencia de cortocircuito",
  "Sistema por Unidad (p.u.)",
  "GFL vs GFM (Grid-Following vs Grid-Forming)",
  "Headroom",
  "LVRT (Low Voltage Ride Through)",
  "HVRT (High Voltage Ride Through)",
  "MRSCR (Multiple Renewable Short-Circuit Ratio)",
  "MIIF (Multi-Infeed Interaction Factor)",
  "ANSI 59 (Protección de Sobretensión)",
  "ANSI 78 (Protección de Pérdida de Sincronismo)",
  "Magnetizing Inrush",
  "Sympathetic Inrush",
  "VoLL (Value of Lost Load)",
  "Control Area",
  "BESS with Grid-Forming inverters (BESS-GFM)",
  "Feedback loop",
  "On-Load Tap Changers (OLTC)",
  "Regional Coordination Centres (RCC)",
  "Q-V Collapse",
  "Synchronous Condensers (SynCons)",
  "Static Synchronous Compensator (STATCOM)",
  "Grid-forming vs Grid-following control",
  "Levelized Cost of Energy (LCOE)",
  "N-1 Criterion",
  "Capability Curve",
  "Duck Curve",
  "Q-V voltage stability curves",
  "Ferranti Effect",
  "Framing and Agenda-shifting",
  "Voltage stability",
  "Power System Stabilizers (PSS)",
  "Brownfield Strategy",
  "Nominal frequency",
  "IGBT",
  "Transfer impedance",
  "Infodemic",
  "Synthetic Inertia",
  "Network Meshing",
  "Electromechanical oscillations",
  "Forced and natural oscillations",
  "Outrage communication",
  "Short-circuit power (Ssc)",
  "PSS/POD",
  "Operation Procedure 1.6 (P.O. 1.6)",
  "Operation Procedure 7.4 (P.O. 7.4)",
  "EirGrid DS3 Program",
  "Out-of-Step Tripping (OST)",
  "RCR Regime",
  "Synchro-check relays",
  "Under-Frequency Load Shedding (UFLS)",
  "Essential Reliability Services (ERS)",
  "Synchronism",
  "Per-unit system (p.u.)",
  "VOLTAIRE System",
  "Rate of Change of Frequency (RoCoF)",
  "Vacuum filling",
  "Inertia (H)",
  "Reactive power",
  "Active power",
  "Net Transfer Capacity (NTC)",
  "Short-circuit power",
  "GFL vs GFM",
  "LVRT",
  "Kontrollbereich",
  "Autonomer Start (Schwarzstart)",
  "BESS mit netzbildenden Wechselrichtern (BESS-GFM)",
  "Rückkopplungsschleife",
  "Laststufenschalter (OLTC)",
  "Regionale Koordinierungszentren (RCC)",
  "Q-V-Zusammenbruch",
  "Synchronkompensatoren (SynCons)",
  "Statischer Synchronkompensator (STATCOM)",
  "Rasterbildende vs. Rasterfolgende Steuerung",
  "Energiegestehungskosten (LCOE)",
  "Versagen der Krisenkommunikation",
  "Kriterium N-1",
  "Blindleistungskurve (Capability Curve)",
  "Entenkurve",
  "Q-V-Spannungsstabilitätskurven",
  "Dämpfungsverhältnis",
  "Ferranti-Effekt",
  "Emergente Normtheorie",
  "Medien-Framing (Framing) und Agenda-Shifting",
  "Spannungsstabilität",
  "Brownfield-Strategie",
  "Schnelle Frequenzantwort (FFR)",
  "Nennfrequenz",
  "DaF",
  "Spielraum: Kapazitätsreserve für Investoren",
  "HGÜ",
  "Übertragungsimpedanz",
  "Infodemie",
  "Synthetische Trägheit",
  "Stromgestehungskosten",
  "Low-Voltage-Ride-Through (LVRT)",
  "Netz",
  "Netzkodex zu Anforderungen an Generatoren (NC RfG)",
  "Elektromechanische Schwingungen",
  "Erzwungene und natürliche Schwingungen",
  "Empörungskommunikation",
  "Kurzschlussleistung (Ssc)",
  "Netzstabilisatoren und Leistungsschwingungsdämpfung (PSS/POD)",
  "Vorgehensweise 1.6 (P.O. 1.6)",
  "Vorgehensweise 7.4 (P.O. 7.4)",
  "EirGrid DS3-Programm",
  "Out of Sync (OST)-Schutz",
  "Erneuerbare Energie, Kraft-Wärme-Kopplung und Abfallregime (RCR)",
  "Synchronprüfrelais",
  "Lastabwurfrelais (UFLS)",
  "Automatische Frequenzwiederherstellungsreserve (aFRR)",
  "Synchronismus",
  "System in pro Einheit (p.u.)",
  "VOLTAIRE-System",
  "OS GL (Systembetriebsrichtlinien)",
  "ÜNB",
  "Vakuumbefüllung",
  "Trägheit (H)",
  "Blindleistung",
  "Wirkleistung",
  "Schwarzstart",
  "Tippen Sie auf Verzögerung",
  "GFM (Gitterbildung)",
  "Phasenregelkreis (PLL)",
  "RoCoF (Frequenzänderungsrate)",
  "UFLS (Unterfrequenzlastabwurf)",
  "OLTC (Laststufenschalter)",
  "Nettoübertragungskapazität (NTC)",
  "Kurzschlussstrom",
  "System pro Einheit (p.u.)",
  "GFL vs. GFM (Rasterfolgend vs. Rasterbildend)",
  "Kopffreiheit",
  "LVRT (Low-Voltage-Ride-Through)"
];

// Sort by length descending
const TERMS = RAW_TERMS.slice().sort((a, b) => b.length - a.length);

function makeSpan(term, isFirst = false) {
  return '<span class="glossary-term' + (isFirst ? ' glossary-term-first' : '') + '" data-term="' + escHtml(term) + '" data-first="' + isFirst + '">' + escHtml(term) + '</span>';
}

function transformText(text, terms, seenTerms) {
  let earliest = null;
  let earliestIdx = Infinity;

  for (const term of terms) {
    const idx = text.indexOf(term);
    if (idx !== -1 && idx < earliestIdx) {
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

  const isFirstOccurrence = !seenTerms.has(earliest);
  if (isFirstOccurrence) {
    seenTerms.add(earliest);
  }

  const nodes = [];
  if (before) nodes.push({ type: 'text', value: before });

  if (isFirstOccurrence) {
    nodes.push({ type: 'html', value: makeSpan(earliest, true) });
  } else {
    nodes.push({ type: 'text', value: earliest });
  }

  if (after) nodes.push(...transformText(after, terms, seenTerms));
  return nodes;
}

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

function walkNode(node, seenTerms) {
  if (SKIP_TYPES.has(node.type)) return node;

  if (node.type === 'text') {
    const newNodes = transformText(node.value, TERMS, seenTerms);
    if (newNodes.length === 1 && newNodes[0].type === 'text' && newNodes[0].value === node.value) {
      return node;
    }
    return newNodes;
  }

  if (node.children && node.children.length > 0) {
    let changed = false;
    const newChildren = [];
    for (const child of node.children) {
      const result = walkNode(child, seenTerms);
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

function remarkAutoGlossaryLinks() {
  return function transformer(tree) {
    if (!tree.children) return;
    const seenTerms = new Set();
    let changed = false;
    const newChildren = [];
    for (const child of tree.children) {
      const result = walkNode(child, seenTerms);
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
