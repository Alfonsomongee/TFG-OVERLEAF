import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ColorModeProvider } from '@docusaurus/theme-common/internal';
import { imageGalleryData } from '@site/src/data/imageGalleryData';

async function fetchFigureContext(question, answer, caption, figureTitle, figureId, fig) {
  try {
    const res = await fetch('/api/figure-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        answer,
        caption,
        figureTitle,
        figureId,
        figureDescription: fig.artifact?.whyMatters || fig.artifact?.description || '',
        keyElements: fig.artifact?.keyElements || [],
      }),
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.context;
  } catch {
    return null;
  }
}

function lazyWithPreload(importFn) {
  const Component = lazy(importFn);
  Component.preload = importFn;
  return Component;
}

// ── Lazy imports de simuladores (Anexo C) ──────────────────────
const FrequencyChart      = lazyWithPreload(() => import('./FrequencyChart'));
const SwingEquationSimulator = lazyWithPreload(() => import('./SwingEquationSimulator'));
const TapLagSequence      = lazyWithPreload(() => import('./TapLagSequence'));
const BlackoutPropagationMap = lazyWithPreload(() => import('./BlackoutPropagationMap'));
const CollapseSismograph  = lazyWithPreload(() => import('./CollapseSismograph'));
const PVCurveSimulator    = lazyWithPreload(() => import('./PVCurveSimulator'));
const ANSI59Cascade       = lazyWithPreload(() => import('./ANSI59Cascade'));
const InterconnectionDashboard = lazyWithPreload(() => import('./InterconnectionDashboard'));
const IberianGridTopology = lazyWithPreload(() => import('./IberianGridTopology'));
const MixGeneracion       = lazyWithPreload(() => import('./MixGeneracion'));
const FinancialWaterfallChart = lazyWithPreload(() => import('./FinancialWaterfallChart'));
const EnergyTransitionStreamgraph = lazyWithPreload(() => import('./EnergyTransitionStreamgraph'));
const AnimatedRestorationMap = lazyWithPreload(() => import('./AnimatedRestorationMap'));
const VerticalTimeline    = lazyWithPreload(() => import('./VerticalTimeline'));
const ThermalAdjustmentCostMatrix = lazyWithPreload(() => import('./ThermalAdjustmentCostMatrix'));
// ── Lazy imports adicionales (Fix 2 + Fix 3) ──────────────────
const PhasePlanePlot           = lazyWithPreload(() => import('./PhasePlanePlot'));
const Comparador28A            = lazyWithPreload(() => import('./Comparador28A'));
const RadarVulnerabilidad      = lazyWithPreload(() => import('./RadarVulnerabilidad'));
const StickyCollapse           = lazyWithPreload(() => import('./StickyCollapse'));
const SynchrophasorPlot        = lazyWithPreload(() => import('./SynchrophasorPlot'));
const GridUnavailabilityGauge  = lazyWithPreload(() => import('./GridUnavailabilityGauge'));
const SectorialResilienceChart = lazyWithPreload(() => import('./SectorialResilienceChart'));
const EmissionsVsRenewablesChart = lazyWithPreload(() => import('./EmissionsVsRenewablesChart'));

// ── Mapa anchor → componente interactivo ──────────────────────
const INTERACTIVE_MAP = {
  'swing':           SwingEquationSimulator,
  'tap-lag':         TapLagSequence,
  'tap-lag-sequence': TapLagSequence,
  'frequency':       FrequencyChart,
  'mix-generacion':  MixGeneracion,
  'blackout-map':    BlackoutPropagationMap,
  'blackout3d':      BlackoutPropagationMap,
  'map':             BlackoutPropagationMap,
  'pvcurve':         PVCurveSimulator,
  'pv-curve':        PVCurveSimulator,
  'ufls':            CollapseSismograph,
  'sismograph':      CollapseSismograph,
  'ansi59':          ANSI59Cascade,
  'interconnection': InterconnectionDashboard,
  'topology':        IberianGridTopology,
  'iberian-grid':    IberianGridTopology,
  'waterfall':       FinancialWaterfallChart,
  'streamgraph':     EnergyTransitionStreamgraph,
  'restoration':     AnimatedRestorationMap,
  'timeline':        VerticalTimeline,
  'matrix':          ThermalAdjustmentCostMatrix,
  // Fix 2 — Anexo IX (T9)
  'phaseplane':          PhasePlanePlot,
  'phase-plane':         PhasePlanePlot,
  'comparador-28a':      Comparador28A,
  'comparador28a':       Comparador28A,
  'radar-vulnerabilidad': RadarVulnerabilidad,
  'radar':               RadarVulnerabilidad,
  // Fix 3 — componentes verificados existentes
  'sticky-collapse':     StickyCollapse,
  'phasor':              SynchrophasorPlot,
  'grid-unavailability': GridUnavailabilityGauge,
  'sectorial-resilience': SectorialResilienceChart,
  'emissions-renewables': EmissionsVsRenewablesChart,
};

// ── Mapa keywords → figuras estáticas (Anexo A) ───────────────
// Índice plano de todas las figuras con sus keywords
const buildFigureIndex = () => {
  const index = [];
  imageGalleryData.chapters.forEach(ch => {
    ch.images.forEach(img => {
      index.push({
        src: img.src,
        caption: img, // objeto con caption_es, caption_en, etc.
        chapter: ch.id,
      });
    });
  });
  return index;
};
const FIGURE_INDEX = buildFigureIndex();

// Keywords para buscar figuras relevantes en el texto de la respuesta
const FIGURE_KEYWORDS = {
  // Cada entrada: keyword → [archivos MUY específicos]
  // Solo matchear cuando la relación es obvia y directa

  // Frecuencia y caída
  'frecuencia': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'frequency': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'frequenz': ['frequency_voltage_carmona'],
  '频率': ['frequency_voltage_carmona'],
  'nadir': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'rocof': ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'caída de frecuencia': ['frequency_voltage_carmona'],
  'frequency drop': ['frequency_voltage_carmona'],
  'hercios': ['frequency_voltage_carmona'],
  'hz': ['frequency_voltage_carmona'],

  // Inercia — solo cuando se pregunta explícitamente
  'inercia síncrona': ['futured_grid_evolution', 'conventionalunits'],
  'synchronous inertia': ['futured_grid_evolution', 'conventionalunits'],
  'constante h': ['futured_grid_evolution'],
  'inertia constant': ['futured_grid_evolution'],
  'masa rotacional': ['futured_grid_evolution'],

  // Tap-Lag
  'tap-lag': ['tap_lag_decoupling', 'nunez_balboa_precursores'],
  'tap lag': ['tap_lag_decoupling'],
  'oltc': ['tap_lag_decoupling'],
  'transformador': ['tap_lag_decoupling'],

  // Colapso y cascada
  'cascada': ['cascada_desconexiones', 'heatmap_propagation'],
  'cascade': ['cascada_desconexiones'],
  'cascada de desconexiones': ['cascada_desconexiones'],
  'disconnection cascade': ['cascada_desconexiones'],
  'propagación': ['heatmap_propagation', 'cascada_desconexiones'],
  'propagation': ['heatmap_propagation'],

  // Tensión y Q-V
  'colapso de tensión': ['tension_frecuencia_colapso', 'fluctuaciones_tension_previas'],
  'voltage collapse': ['tension_frecuencia_colapso'],
  'sobretensión': ['precursor_overvoltage_22april', 'aluvion_alertas_sobretension_sur'],
  'overvoltage': ['precursor_overvoltage_22april'],
  'potencia reactiva': ['asimetria_balance_reactiva_sur'],
  'reactive power': ['asimetria_balance_reactiva_sur'],
  'mvar': ['asimetria_balance_reactiva_sur'],

  // Mix generación
  'mix de generación': ['ree_generation_mix_28april', 'mix_comparativo_2010_2024'],
  'generation mix': ['ree_generation_mix_28april'],
  'fotovoltaica': ['ree_generation_mix_28april'],
  'solar': ['ree_generation_mix_28april'],
  'renovable': ['ree_generation_mix_28april', 'mix_comparativo_2010_2024'],

  // Recuperación
  'recuperación': ['estrategia_reenergizacion_dual', 'black_start_hidroelectrico'],
  'recovery': ['estrategia_reenergizacion_dual'],
  'black start': ['black_start_hidroelectrico'],
  'reposición': ['islas_reposicion_entsoe', 'estrategia_reenergizacion_dual'],
  're-energización': ['evolucion_mix_reenergizacion'],

  // Interconexión
  'interconexión': ['interconexion_francia_colapso'],
  'interconnection': ['interconexion_francia_colapso'],
  'francia': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'france': ['interconexion_francia_colapso'],
  'sincronismo': ['perdida_sincronismo_frontera'],
  // Intercambios internacionales (import/export)
  'importaciones': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'exportaciones': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'intercambios': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia', 'entsoe_flow_deviation'],
  'flujos': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia', 'entsoe_flow_deviation'],
  'balance neto': ['interconexion_francia_colapso'],
  'net exporter': ['interconexion_francia_colapso'],
  'envíos a francia': ['interconexion_francia_colapso'],
  'send to france': ['interconexion_francia_colapso'],
  'marruecos': ['intercambio_marruecos_topdown'],
  'portugal': ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],

  // GFM/GFL e inversores
  'gfm': ['gfl_vs_gfm_circuit1'],
  'gfl': ['gfl_vs_gfm_circuit1'],
  'inversor': ['gfl_vs_gfm_circuit1'],
  'grid-forming': ['gfl_vs_gfm_circuit1'],

  // Impacto económico
  'coste': ['coste_optimo_ers', 'ers_revenue_stacking'],
  'cost': ['coste_optimo_ers'],
  'bess': ['hitachi_hybrid', 'ers_revenue_stacking'],

  // Islas eléctricas
  'islas': ['islas_reposicion_entsoe'],
  'islanding': ['islas_reposicion_entsoe'],
  'fragmentación': ['islas_reposicion_entsoe'],
};

function findRelevantFigures(text, lang) {
  const lower = text.toLowerCase();
  const found = new Map(); // filename → score
  
  // Buscar matches exactos primero (mayor score)
  Object.entries(FIGURE_KEYWORDS).forEach(([keyword, files]) => {
    if (lower.includes(keyword.toLowerCase())) {
      const isExact = keyword.includes(' '); // frases son más específicas
      files.forEach(f => {
        const current = found.get(f) || 0;
        found.set(f, current + (isExact ? 2 : 1));
      });
    }
  });

  // Ordenar por score y tomar las 2 mejores (no 3)
  const sorted = [...found.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([filename]) => filename);

  // Mapear a entradas completas del índice
  return sorted
    .map(filename => FIGURE_INDEX.find(fig => 
      fig.src.includes(filename)
    ))
    .filter(Boolean);
}

function extractInteractiveAnchors(text) {
  const anchors = new Set();
  const regex = /\]\(([^)]+#([^)]+))\)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    // Strip the "grafico-" prefix from new-format anchors (#grafico-swing → swing)
    const raw = m[2].toLowerCase();
    const anchor = raw.startsWith('grafico-') ? raw.slice(8) : raw;
    if (INTERACTIVE_MAP[anchor]) anchors.add(anchor);
  }
  // Fallback: buscar menciones directas de términos en el texto
  const lower = text.toLowerCase();
  Object.keys(INTERACTIVE_MAP).forEach(key => {
    if (lower.includes(key.replace(/-/g, ' '))) anchors.add(key);
  });
  return [...anchors].slice(0, 4);
}

// ── Labels UI multiidioma ──────────────────────────────────────
const UI = {
  es: {
    exit: 'Cerrar',
    noContent: 'Haz una pregunta para ver contenido relacionado aquí',
    loading: 'Cargando...',
    interactive: 'Interactivo',
    figure: 'Figura',
    simplify: 'SIMPLIFICAR',
    searching: 'Buscando...',
    generating: 'Generando...',
    synthesizing: 'Elaborando respuesta...',
  },
  en: {
    exit: 'Close',
    noContent: 'Ask a question to see related content here',
    loading: 'Loading...',
    interactive: 'Interactive',
    figure: 'Figure',
    simplify: 'SIMPLIFY',
    searching: 'Searching...',
    generating: 'Generating...',
    synthesizing: 'Generating answer...',
  },
  de: {
    exit: 'Schließen',
    noContent: 'Stellen Sie eine Frage, um verwandten Inhalt zu sehen',
    loading: 'Wird geladen...',
    interactive: 'Interaktiv',
    figure: 'Abbildung',
    simplify: 'VEREINFACHEN',
    searching: 'Suche...',
    generating: 'Generiere...',
    synthesizing: 'Antwort wird erstellt...',
  },
  'zh-Hans': {
    exit: '关闭',
    noContent: '提问以在此查看相关内容',
    loading: '加载中...',
    interactive: '交互式',
    figure: '图',
    simplify: '简化',
    searching: '搜索中...',
    generating: '生成中...',
    synthesizing: '正在生成回答...',
  },
};

const SUGGESTED_QUESTIONS = {
  swing: {
    es: ['¿Qué RoCoF se registró el 28-A?', '¿Cómo afecta la constante H a la caída de frecuencia?', '¿Qué es la inercia sintética?'],
    en: ['What RoCoF was recorded on April 28?', 'How does constant H affect the frequency drop?', 'What is synthetic inertia?'],
    de: ['Welcher RoCoF wurde am 28. April gemessen?', 'Wie beeinflusst H den Frequenzabfall?', 'Was ist synthetische Trägheit?'],
    'zh-Hans': ['4月28日记录的RoCoF是多少？', 'H常数如何影响频率下降？', '什么是合成惯量？'],
  },
  'tap-lag-sequence': {
    es: ['¿Qué es el efecto Tap-Lag?', '¿Cómo afectaron los OLTC al colapso?', '¿Por qué el SCADA no detectó el problema?'],
    en: ['What is the Tap-Lag effect?', 'How did OLTC transformers affect the collapse?', 'Why did SCADA not detect the problem?'],
    de: ['Was ist der Tap-Lag-Effekt?', 'Wie beeinflussten OLTC-Transformatoren den Kollaps?', 'Warum erkannte SCADA das Problem nicht?'],
    'zh-Hans': ['什么是Tap-Lag效应？', 'OLTC变压器如何影响崩溃？', '为什么SCADA没有检测到问题？'],
  },
  frequency: {
    es: ['¿Cuánto tardó en caer la frecuencia?', '¿Qué es el nadir frecuencial?', '¿Cuándo se activó el deslastre UFLS?'],
    en: ['How long did the frequency take to collapse?', 'What is the frequency nadir?', 'When was UFLS load shedding activated?'],
    de: ['Wie lange dauerte der Frequenzabfall?', 'Was ist der Frequenznadir?', 'Wann wurde UFLS aktiviert?'],
    'zh-Hans': ['频率崩溃用了多长时间？', '什么是频率最低点？', 'UFLS何时被激活？'],
  },
  'mix-generacion': {
    es: ['¿Cuánto solar había el día del apagón?', '¿Por qué el mix renovable aumentó el riesgo?', '¿Qué es la penetración IBR?'],
    en: ['How much solar was there on the day of the blackout?', 'Why did the renewable mix increase risk?', 'What is IBR penetration?'],
    de: ['Wie viel Solar gab es am Tag des Ausfalls?', 'Warum erhöhte der erneuerbare Mix das Risiko?', 'Was ist IBR-Durchdringung?'],
    'zh-Hans': ['停电当天有多少太阳能？', '为什么可再生能源组合增加了风险？', '什么是IBR渗透率？'],
  },
  'blackout-map': {
    es: ['¿Qué regiones se vieron más afectadas?', '¿Cuántos MW se perdieron en la cascada?', '¿En qué orden se desconectaron las centrales?'],
    en: ['Which regions were most affected?', 'How many MW were lost in the cascade?', 'In what order did plants disconnect?'],
    de: ['Welche Regionen waren am stärksten betroffen?', 'Wie viele MW gingen in der Kaskade verloren?', 'In welcher Reihenfolge schalteten die Anlagen ab?'],
    'zh-Hans': ['哪些地区受影响最大？', '级联中损失了多少MW？', '电站按什么顺序断开？'],
  },
  pvcurve: {
    es: ['¿Qué es el colapso de tensión?', '¿Cuál era el margen reactivo antes del apagón?', '¿Qué es el punto de nariz de la curva P-V?'],
    en: ['What is voltage collapse?', 'What was the reactive margin before the blackout?', 'What is the nose point of the P-V curve?'],
    de: ['Was ist Spannungskollaps?', 'Wie groß war die Blindleistungsreserve vor dem Ausfall?', 'Was ist der Nasenpunkt der P-V-Kurve?'],
    'zh-Hans': ['什么是电压崩溃？', '停电前无功裕度是多少？', '什么是P-V曲线的鼻点？'],
  },
  interconnection: {
    es: ['¿Cuál es la capacidad de interconexión con Francia?', '¿Qué pasó con la interconexión durante el apagón?', '¿Por qué España está poco interconectada?'],
    en: ['What is the interconnection capacity with France?', 'What happened to the interconnection during the blackout?', 'Why is Spain poorly interconnected?'],
    de: ['Wie groß ist die Verbindungskapazität mit Frankreich?', 'Was passierte mit der Verbindung während des Ausfalls?', 'Warum ist Spanien schlecht vernetzt?'],
    'zh-Hans': ['与法国的互联容量是多少？', '停电期间互联发生了什么？', '为什么西班牙互联程度低？'],
  },
};

function VisualArtifactCard({ artifact }) {
  if (artifact.type === 'table') {
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: 'var(--cfs-amber)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Tabla Forense</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        {artifact.origin && <div style={{ fontSize: 11, color: 'var(--cfs-text-3)', marginBottom: 8 }}>{artifact.origin}</div>}
        <p style={{ fontSize: 13, color: 'var(--cfs-text-2)', lineHeight: 1.5 }}>{artifact.description}</p>
        {artifact.sampleRows && artifact.sampleRows.length > 0 && artifact.columns && (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 11,
              color: 'var(--cfs-text-2)',
            }}>
              <thead>
                <tr>
                  {artifact.columns.map(col => (
                    <th key={col.key} style={{
                      padding: '6px 10px',
                      textAlign: 'left',
                      borderBottom: '1px solid var(--cfs-amber)',
                      color: 'var(--cfs-amber)',
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artifact.sampleRows.map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: '1px solid var(--cfs-border-soft)',
                    backgroundColor: i % 2 === 0
                      ? 'rgba(255,255,255,0.02)'
                      : 'transparent',
                  }}>
                    {artifact.columns.map(col => (
                      <td key={col.key} style={{
                        padding: '6px 10px',
                        fontSize: 11,
                        lineHeight: 1.4,
                      }}>
                        {row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <a href={artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: 'var(--cfs-amber)', textDecoration: 'none', fontWeight: 600 }}>Ver tabla completa ↗</a>
      </div>
    );
  }
  if (artifact.type === 'image') {
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: 'var(--accent-electric, hsl(200 100% 60%))', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Gráfica de Datos Reales</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        {artifact.path && <img src={artifact.path} alt={artifact.title} style={{ width: '100%', borderRadius: 8, margin: '12px 0', border: '1px solid var(--cfs-border-soft)' }} />}
        <p style={{ fontSize: 13, color: 'var(--cfs-text-2)', lineHeight: 1.5 }}>{artifact.description}</p>
        <a href={artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: 'var(--accent-electric, hsl(200 100% 60%))', textDecoration: 'none', fontWeight: 600 }}>Ver figura en contexto ↗</a>
      </div>
    );
  }
  if (artifact.type === 'interactive') {
    return (
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--cfs-border-soft)', color: 'var(--cfs-text-1)' }}>
        <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>◈ Interactivo</div>
        <h4 style={{ margin: '8px 0', fontSize: 15 }}>{artifact.title}</h4>
        <p style={{ fontSize: 13, color: 'var(--cfs-text-2)', lineHeight: 1.5 }}>{artifact.description}</p>
        <a href={artifact.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Abrir simulador ↗</a>
      </div>
    );
  }
  return null;
}

// ── Componente principal ───────────────────────────────────────
export default function ChatFullscreen({
  isOpen,
  onClose,
  messages,
  loading,
  loadingStage,
  onSend,
  onSimplify,
  t,
  renderText,
}) {
  const { i18n: { currentLocale: lang } } = useDocusaurusContext();
  const ui = UI[lang] || UI.es;

  const [activeAnchors, setActiveAnchors]   = useState([]);
  const [activeFigures, setActiveFigures]   = useState([]);
  const [activeTables, setActiveTables]     = useState([]);
  const [activeTab, setActiveTab]           = useState(null); // 'interactive-X' | 'figure-X'
  const [figureContexts, setFigureContexts] = useState({}); // { 'figure-0': 'texto...' }
  const [figureFeedback, setFigureFeedback] = useState({});
  const [panelKey, setPanelKey]             = useState(0);
  const [panelVisible, setPanelVisible]     = useState(true);
  const [presentationMode, setPresentationMode] = useState(false);
  const [chatWidth, setChatWidth] = useState(360);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(360);
  const [question, setQuestion]             = useState('');
  const messagesEndRef                      = useRef(null);
  const inputRef                            = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && 
        !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || 
                              window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Idioma según locale activo
    const langMap = {
      es: 'es-ES',
      en: 'en-US', 
      de: 'de-DE',
      'zh-Hans': 'zh-CN',
    };
    recognition.lang = langMap[lang] || 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setQuestion(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Analizar última respuesta del asistente
  useEffect(() => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) return;

    // Fuente primaria: visualArtifacts del backend
    const backendArtifacts = last.visualArtifacts || [];

    // Tablas: del backend
    const backendTables = backendArtifacts
      .filter(a => a.type === 'table');
    setActiveTables(backendTables);

    // Interactivos: del backend si hay, si no del texto
    const backendInteractives = backendArtifacts
      .filter(a => a.type === 'interactive' && INTERACTIVE_MAP[a.id])
      .map(a => a.id);
    const textAnchors = backendInteractives.length > 0
      ? backendInteractives
      : extractInteractiveAnchors(last.text);

    // Figuras: del backend si hay, si no del texto
    const backendFigures = backendArtifacts
      .filter(a => a.type === 'image' || a.type === 'entsoe_chart')
      .map(a => {
        const filename = (a.path || a.id || '').split('/').pop()
          .replace(/\.\w+$/, '');
        const found = FIGURE_INDEX.find(
          f => f.src.includes(filename) || f.src.includes(a.id)
        );
        // Para entsoe_chart no hay entrada en FIGURE_INDEX
        // Crear una entrada sintética
        if (!found && a.type === 'entsoe_chart') {
          return {
            src: a.url || '',
            caption: {
              caption_es: a.description || a.title,
              caption_en: a.description_en || a.description || a.title,
            },
            chapter: 'entsoe',
            artifact: a,
            tabLabel: '★ ' + (a.title || 'Gráfica ENTSO-E').substring(0, 30),
          };
        }
        return found || null;
      })
      .filter(Boolean);
    const textFigures = backendFigures.length > 0
      ? backendFigures
      : findRelevantFigures(last.text, lang);

    setActiveAnchors(textAnchors);
    setActiveFigures(textFigures);

    const newTab = textAnchors.length > 0
      ? 'interactive-0'
      : textFigures.length > 0 ? 'figure-0'
      : backendTables.length > 0 ? 'table-0'
      : null;

    if (newTab !== activeTab) {
      setPanelVisible(false);
      setTimeout(() => {
        setActiveTab(newTab);
        setPanelKey(k => k + 1);
        setPanelVisible(true);
      }, 180);
    }
  }, [messages, lang]);

  useEffect(() => {
    if (!activeTab || !activeTab.startsWith('figure-')) return;
    const idx = parseInt(activeTab.split('-')[1]);
    const fig = activeFigures[idx];
    if (!fig) return;

    const userMsgs = messages.filter(m => m.role === 'user');
    const questionMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].text : '';
    const asstMsgs = messages.filter(m => m.role === 'assistant');
    const answerMsg = asstMsgs.length > 0 ? asstMsgs[asstMsgs.length - 1].text : '';

    const figureId = fig.src;
    let qHash = 0;
    for (let i = 0; i < questionMsg.length; i++) qHash = Math.imul(31, qHash) + questionMsg.charCodeAt(i) | 0;
    const cacheKey = `fig_ctx_${qHash}_${figureId}`;

    if (figureContexts[activeTab] && figureContexts[activeTab] !== 'loading' && figureContexts[activeTab] !== 'error') return;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setFigureContexts(prev => ({ ...prev, [activeTab]: cached }));
        return;
      }
    } catch(e) {}

    const captionKey = 'caption_' + (lang === 'zh-Hans' ? 'en' : lang);
    const caption = fig.caption[captionKey] || fig.caption.caption_es || '';
    const figureTitle = fig.caption.caption_es || fig.caption.caption_en || caption;

    setFigureContexts(prev => ({ ...prev, [activeTab]: 'loading' }));
    
    fetchFigureContext(questionMsg, answerMsg, caption, figureTitle, figureId, fig).then(ctx => {
      if (ctx) {
        setFigureContexts(prev => ({ ...prev, [activeTab]: ctx }));
        try { localStorage.setItem(cacheKey, ctx); } catch(e) {}
      } else {
        setFigureContexts(prev => ({ ...prev, [activeTab]: 'error' }));
      }
    });
  }, [activeTab, activeFigures, messages, lang]);

  // Scroll al fondo de los mensajes
  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleDragStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = chatWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging.current) return;
    const delta = e.clientX - dragStartX.current;
    const newWidth = Math.min(
      Math.max(dragStartWidth.current + delta, 260),
      640
    );
    setChatWidth(newWidth);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDragMove, handleDragEnd]);

  const allTabs = [
    ...activeAnchors.map((anchor, i) => ({
      id: 'interactive-' + i,
      label: anchor.replace(/-/g, ' '),
      type: 'interactive',
    })),
    ...activeFigures.map((fig, i) => {
      let label;
      if (fig.tabLabel) {
        label = fig.tabLabel;
      } else {
        const captionKey = 'caption_' + (lang === 'zh-Hans' ? 'en' : lang);
        const caption = fig.caption[captionKey] || fig.caption.caption_es || '';
        label = caption.length > 37 ? caption.substring(0, 37) + '...' : caption;
      }
      return {
        id: 'figure-' + i,
        label: label || fig.src.split('/').pop().replace(/\.\w+$/, '').replace(/_/g,' '),
        type: fig.artifact?.type === 'entsoe_chart' ? 'entsoe' : 'figure',
      };
    }),
    ...activeTables.map((table, i) => ({
      id: 'table-' + i,
      label: table.title
        ? table.title.substring(0, 37) + (table.title.length > 37 ? '...' : '')
        : 'Tabla',
      type: 'table',
    })),
  ];

  // ── Atajos de teclado ────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      // ESC — cerrar fullscreen
      if (e.key === 'Escape' && !isListening) {
        onClose();
        return;
      }
      
      // Ctrl/Cmd + → — siguiente tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault();
        if (allTabs.length > 1) {
          const currentIdx = allTabs.findIndex(t => t.id === activeTab);
          const nextIdx = (currentIdx + 1) % allTabs.length;
          setPanelVisible(false);
          setTimeout(() => {
            setActiveTab(allTabs[nextIdx].id);
            setPanelKey(k => k + 1);
            setPanelVisible(true);
          }, 180);
        }
        return;
      }
      
      // Ctrl/Cmd + ← — tab anterior
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (allTabs.length > 1) {
          const currentIdx = allTabs.findIndex(t => t.id === activeTab);
          const prevIdx = (currentIdx - 1 + allTabs.length) % allTabs.length;
          setPanelVisible(false);
          setTimeout(() => {
            setActiveTab(allTabs[prevIdx].id);
            setPanelKey(k => k + 1);
            setPanelVisible(true);
          }, 180);
        }
        return;
      }

      // Ctrl/Cmd + P — toggle modo presentación
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setPresentationMode(p => !p);
        return;
      }

      // Ctrl/Cmd + M — toggle micrófono
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        if (isListening) stopListening();
        else startListening();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isListening, allTabs, activeTab, onClose, 
      startListening, stopListening, setPresentationMode]);

  const handleSend = () => {
    if (!question.trim() || loading) return;
    onSend(question);
    setQuestion('');
  };

  if (!isOpen) return null;

  // Determinar qué mostrar en el panel derecho
  const renderPanelContent = () => {
    const latestAssistantMessage = messages
      .filter(m => m.role === 'assistant')
      .at(-1);


    if (activeTab === null) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 16,
          color: 'var(--cfs-text-3)', textAlign: 'center',
        }}>
          <svg width="52" height="52" viewBox="0 0 28 28" fill="none" opacity="0.25">
            <polygon points="15,4 9,15 14,15 11,26 21,13 15,13" fill="currentColor"/>
          </svg>
          <p style={{ fontSize: 14, maxWidth: 320, lineHeight: 1.7 }}>
            {ui.noContent}
          </p>
        </div>
      );
    }

    if (activeTab.startsWith('interactive-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const anchor = activeAnchors[idx];
      const Component = INTERACTIVE_MAP[anchor];
      if (!Component) return null;
      
      const interactiveLabels = {
        swing: {
          es: 'La Ecuación del Swing es el modelo matemático fundamental que gobierna la dinámica de frecuencia. Permite cuantificar cómo la constante de inercia H (en segundos) determina la velocidad de caída de frecuencia ante un desequilibrio de potencia. El 28-A, con H≈2,3s y 82% de penetración IBR, el RoCoF superó 1,5 Hz/s — valor letal para las protecciones de las centrales nucleares.',
          en: 'The Swing Equation is the fundamental mathematical model governing frequency dynamics. It quantifies how the inertia constant H (in seconds) determines the rate of frequency drop under a power imbalance. On April 28, with H≈2.3s and 82% IBR penetration, the RoCoF exceeded 1.5 Hz/s — a lethal value for nuclear plant protection relays.',
          de: 'Die Swing-Gleichung ist das grundlegende mathematische Modell der Frequenzdynamik. Am 28. April, mit H≈2,3s und 82% IBR-Durchdringung, überstieg der RoCoF 1,5 Hz/s — ein für Kernkraftschutzrelais letaler Wert.',
          'zh-Hans': '摆动方程是控制频率动态的基本数学模型。2025年4月28日，H≈2.3秒，IBR渗透率82%，RoCoF超过1.5 Hz/s——对核电站保护继电器而言是致命值。',
        },
        'tap-lag-sequence': {
          es: 'El mecanismo Tap-Lag fue el factor causal invisible del 28-A. Los transformadores OLTC de los parques solares, al regular automáticamente la tensión, absorbían potencia reactiva capacitiva masiva (≈1.050 MVAr en el sur) mientras el SCADA de REE mostraba tensiones aparentemente normales. Esta "ilusión de estabilidad" enmascaró el colapso Q-V que se gestaba.',
          en: 'The Tap-Lag mechanism was the invisible causal factor of April 28. OLTC transformers in solar farms, automatically regulating voltage, absorbed massive capacitive reactive power (≈1,050 MVAr in the south) while REE\'s SCADA showed apparently normal voltages. This "stability illusion" masked the Q-V collapse building beneath.',
          de: 'Der Tap-Lag-Mechanismus war der unsichtbare Kausalfaktor des 28. April. OLTC-Transformatoren absorbierten massiv kapazitive Blindleistung (≈1.050 MVAr im Süden), während das SCADA normale Spannungen anzeigte.',
          'zh-Hans': 'Tap-Lag机制是4月28日不可见的因果因素。太阳能场的OLTC变压器自动调节电压，吸收大量容性无功功率（南部约1050 MVAr），而REE的SCADA显示表面正常的电压。',
        },
        frequency: {
          es: 'La caída de frecuencia del 28-A se produjo en 27 segundos: de 50 Hz a 0 Hz. El nadir frecuencial alcanzó 47,79 Hz antes del disparo de las nucleares. El RoCoF medio durante la cascada superó 1,0 Hz/s, activando los 6 escalones de deslastre UFLS entre 12:33:20 y 12:33:22 CEST. La separación de la interconexión con Francia a las 12:33:21,535 CEST fue el punto de no retorno.',
          en: 'The April 28 frequency collapse occurred in 27 seconds: from 50 Hz to 0 Hz. The frequency nadir reached 47.79 Hz before nuclear plant trips. The average RoCoF during the cascade exceeded 1.0 Hz/s, activating 6 UFLS load shedding steps between 12:33:20 and 12:33:22 CEST. The France interconnection separation at 12:33:21.535 CEST was the point of no return.',
          de: 'Der Frequenzkollaps des 28. April dauerte 27 Sekunden: von 50 Hz auf 0 Hz. Der Frequenznadir erreichte 47,79 Hz. Der mittlere RoCoF überstieg 1,0 Hz/s und aktivierte 6 UFLS-Stufen.',
          'zh-Hans': '4月28日频率崩溃发生在27秒内：从50 Hz到0 Hz。频率最低点达到47.79 Hz。平均RoCoF超过1.0 Hz/s，激活了6个UFLS减负荷步骤。',
        },
        'mix-generacion': {
          es: 'A las 12:30 CEST del 28-A, la solar fotovoltaica aportaba el 53-59% del mix peninsular (18.068 MW estimados). Esta penetración récord de IBR redujo la inercia síncrona del sistema al mínimo histórico. La demanda era de tan solo 25.184 MW — un 56% del pico histórico — creando un sistema eléctricamente "vacío" y extremadamente frágil ante cualquier perturbación.',
          en: 'At 12:30 CEST on April 28, solar PV contributed 53-59% of the peninsular mix (estimated 18,068 MW). This record IBR penetration reduced the system\'s synchronous inertia to a historical minimum. Demand was only 25,184 MW — 56% of the historical peak — creating an electrically "hollow" system extremely fragile to any disturbance.',
          de: 'Um 12:30 CEST am 28. April trug Solar-PV 53-59% des Peninsular-Mix bei. Diese Rekord-IBR-Durchdringung reduzierte die Systemträgheit auf ein historisches Minimum.',
          'zh-Hans': '4月28日12:30 CEST，太阳能光伏贡献了半岛电网53-59%的发电量（估计18,068 MW）。这一创纪录的IBR渗透率将系统同步惯量降至历史最低。',
        },
        'blackout-map': {
          es: 'La cascada de desconexiones IBR se produjo en menos de 650 ms. Entre 12:32:57 y 12:33:24 CEST se perdieron 1.917 MW directos en una secuencia de 8 eventos, con pérdidas totales estimadas de 2.000-2.500 MW. La propagación geográfica siguió el gradiente de penetración solar: sur de España primero, luego Extremadura y Levante, finalmente la separación de Francia.',
          en: 'The IBR disconnection cascade occurred in less than 650 ms. Between 12:32:57 and 12:33:24 CEST, 1,917 MW were directly lost in a sequence of 8 events, with total estimated losses of 2,000-2,500 MW. Geographic propagation followed the solar penetration gradient: southern Spain first, then Extremadura and Levante, finally the France separation.',
          de: 'Die IBR-Abschaltkaskade ereignete sich in weniger als 650 ms. Zwischen 12:32:57 und 12:33:24 CEST gingen 1.917 MW in 8 Ereignissen verloren.',
          'zh-Hans': 'IBR断开级联发生在650毫秒内。在12:32:57至12:33:24 CEST之间，8个事件中直接损失1,917 MW，总损失估计2,000-2,500 MW。',
        },
        pvcurve: {
          es: 'La curva P-V demuestra el mecanismo físico del colapso de tensión capacitivo que causó el 28-A. El sistema ibérico, operando con 1.050 MVAr de inyección capacitiva neta en el sur, se encontraba cerca del "punto de nariz" de la curva — el límite de cargabilidad máxima. Cualquier perturbación adicional en la potencia reactiva era suficiente para cruzar ese umbral y desencadenar el colapso.',
          en: 'The P-V curve demonstrates the physical mechanism of the capacitive voltage collapse that caused April 28. The Iberian system, operating with 1,050 MVAr of net capacitive injection in the south, was near the "nose point" of the curve — the maximum loadability limit. Any additional reactive power disturbance was sufficient to cross that threshold and trigger collapse.',
          de: 'Die P-V-Kurve demonstriert den physischen Mechanismus des kapazitiven Spannungskollapses. Das iberische System operierte nahe dem "Nasenpunkt" — dem Maximum der Belastbarkeit.',
          'zh-Hans': 'P-V曲线展示了导致4月28日电容性电压崩溃的物理机制。伊比利亚系统在南部以1050 MVAr净容性注入运行，接近曲线的"鼻点"——最大负载能力极限。',
        },
        sismograph: {
          es: 'El sismógrafo del colapso reproduce la evolución transitoria de frecuencia y tensión en Carmona (400 kV) durante los 27 segundos críticos. Los datos muestran la correlación exacta entre la cascada de desconexiones IBR, la activación secuencial de los 6 escalones UFLS y el disparo final de las centrales nucleares a 47,79 Hz.',
          en: 'The collapse seismograph reproduces the transient evolution of frequency and voltage at Carmona (400 kV) during the critical 27 seconds. Data shows the exact correlation between the IBR disconnection cascade, sequential activation of 6 UFLS steps, and final nuclear plant trip at 47.79 Hz.',
          de: 'Der Kollaps-Seismograph reproduziert die transiente Frequenz- und Spannungsentwicklung in Carmona (400 kV) während der kritischen 27 Sekunden.',
          'zh-Hans': '崩溃地震图再现了卡尔莫纳（400 kV）在关键27秒内的频率和电压瞬态演变。',
        },
        ansi59: {
          es: 'El bucle de retroalimentación ANSI 59 explica por qué las desconexiones IBR se aceleraron en cascada. Cada IBR que disparaba por sobretensión liberaba potencia reactiva capacitiva al sistema, elevando aún más la tensión y provocando nuevos disparos. Este mecanismo de retroalimentación positiva convirtió una perturbación local en el sur en un colapso sistémico peninsular.',
          en: 'The ANSI 59 feedback loop explains why IBR disconnections cascaded and accelerated. Each IBR that tripped due to overvoltage released capacitive reactive power to the system, further raising voltage and triggering new trips. This positive feedback mechanism turned a local southern disturbance into a peninsular systemic collapse.',
          de: 'Die ANSI-59-Rückkopplungsschleife erklärt, warum sich IBR-Abschaltungen beschleunigten. Jedes ausgelöste IBR setzte kapazitive Blindleistung frei und erhöhte die Spannung weiter.',
          'zh-Hans': 'ANSI 59反馈回路解释了为什么IBR断开呈级联加速。每个因过压跳闸的IBR向系统释放容性无功功率，进一步提高电压并触发新的跳闸。',
        },
        interconnection: {
          es: 'Las interconexiones internacionales revelan la paradoja estructural del sistema ibérico: diseñadas para importar energía en déficit, resultaron insuficientes durante el 28-A. La capacidad de interconexión con Francia (2.800 MW nominales) representaba solo el 3,7% de la potencia instalada peninsular — muy por debajo del mínimo del 10% recomendado por la CE. La apertura de Hernani a las 12:33:21 CEST selló el aislamiento total.',
          en: 'International interconnections reveal the structural paradox of the Iberian system: designed to import energy during deficit, they proved insufficient on April 28. Interconnection capacity with France (2,800 MW nominal) represented only 3.7% of peninsular installed capacity — well below the EC-recommended 10% minimum. The Hernani opening at 12:33:21 CEST sealed total isolation.',
          de: 'Die Verbindungskapazität mit Frankreich (2.800 MW) repräsentierte nur 3,7% der installierten Kapazität — weit unter dem von der EU empfohlenen Minimum von 10%.',
          'zh-Hans': '与法国的互联容量（2800 MW额定值）仅代表半岛装机容量的3.7%——远低于欧盟推荐的10%最低值。',
        },
        topology: {
          es: 'La topología de red ibérica muestra la distribución geográfica desigual entre generación (concentrada en el sur y el litoral) y demanda (centros urbanos del norte y centro). Esta asimetría estructural, combinada con la alta penetración solar en Extremadura y Andalucía, creó los flujos de potencia reactiva críticos que precipitaron el colapso.',
          en: 'The Iberian grid topology shows the uneven geographic distribution between generation (concentrated in the south and coast) and demand (urban centers in the north and center). This structural asymmetry, combined with high solar penetration in Extremadura and Andalusia, created the critical reactive power flows that precipitated the collapse.',
          de: 'Die Netztopologie zeigt die ungleiche geografische Verteilung zwischen Erzeugung (Süden und Küste) und Nachfrage (nördliche und zentrale Städte).',
          'zh-Hans': '电网拓扑显示了发电（集中在南部和沿海）与需求（北部和中部城市中心）之间不均衡的地理分布。',
        },
        waterfall: {
          es: 'La cascada financiera cuantifica el coste real del apagón frente al coste de haberlo prevenido. Las estimaciones sitúan el impacto económico directo en 1.600-2.200 M€, mientras que el CAPEX total del retrofitting regulatorio (GFM, compensadores síncronos, BESS) se estima en 800-1.200 M€. La inacción fue 1,5-2x más cara que la inversión preventiva.',
          en: 'The financial waterfall quantifies the real cost of the blackout versus the cost of prevention. Economic impact estimates range from €1.6-2.2 billion, while total regulatory retrofitting CAPEX (GFM, synchronous compensators, BESS) is estimated at €800M-1.2B. Inaction was 1.5-2x more expensive than preventive investment.',
          de: 'Die Finanzkaskade quantifiziert die tatsächlichen Kosten des Ausfalls. Der wirtschaftliche Schaden beträgt 1,6-2,2 Mrd. €, der Präventions-CAPEX 800 Mio.-1,2 Mrd. €.',
          'zh-Hans': '财务级联量化了停电的实际成本与预防成本。经济影响估计为16-22亿欧元，而预防性投资约为8-12亿欧元。',
        },
        streamgraph: {
          es: 'El streamgraph de transición energética muestra cómo España pasó en 15 años de un sistema dominado por generación síncrona (nuclear, gas, carbón) a un mix con 82% de penetración IBR. Esta transformación estructural es el contexto macroenergético que hizo posible el 28-A: sin esa transición, el sistema habría tenido suficiente inercia síncrona para absorber la perturbación.',
          en: 'The energy transition streamgraph shows how Spain transitioned in 15 years from a system dominated by synchronous generation (nuclear, gas, coal) to a mix with 82% IBR penetration. This structural transformation is the macro-energy context that made April 28 possible: without this transition, the system would have had sufficient synchronous inertia to absorb the disturbance.',
          de: 'Das Streamgraph zeigt, wie Spanien in 15 Jahren von einem synchronen System zu einem Mix mit 82% IBR-Durchdringung überging.',
          'zh-Hans': '能源转型流图显示西班牙如何在15年内从以同步发电为主的系统转变为82% IBR渗透率的混合电网。',
        },
        restoration: {
          es: 'La re-energización del sistema ibérico tardó 18,5 horas — un proceso técnicamente complejo que requirió la coordinación de estrategias Top-Down (soporte desde Francia y Marruecos) y Bottom-Up (arranque autónomo de centrales hidroeléctricas bajo el P.O. 1.6). La restricción de reconexión de IBRs durante las primeras horas fue determinante para garantizar la estabilidad de las islas eléctricas nacientes.',
          en: 'Re-energization of the Iberian system took 18.5 hours — a technically complex process requiring coordination of Top-Down strategies (support from France and Morocco) and Bottom-Up (autonomous hydroelectric Black Start under P.O. 1.6). The IBR reconnection restriction during the first hours was crucial to ensure stability of the nascent electrical islands.',
          de: 'Die Wiederinbetriebnahme dauerte 18,5 Stunden und erforderte die Koordination von Top-Down- und Bottom-Up-Strategien gemäß P.O. 1.6.',
          'zh-Hans': '伊比利亚系统的重新通电耗时18.5小时，需要协调自上而下（法国和摩洛哥支持）和自下而上（根据P.O. 1.6的水电黑启动）策略。',
        },
        timeline: {
          es: 'La cronología forense del 28-A documenta 47 eventos críticos en 18,5 horas. Los primeros 27 segundos (12:32:57 - 12:33:24 CEST) contienen los 8 disparos IBR en cascada, los 6 escalones UFLS, el disparo nuclear y el colapso total. Esta densidad de eventos en tiempo tan breve es inédita en la historia de los sistemas eléctricos europeos.',
          en: 'The April 28 forensic chronology documents 47 critical events over 18.5 hours. The first 27 seconds (12:32:57 - 12:33:24 CEST) contain 8 cascading IBR trips, 6 UFLS steps, the nuclear trip, and total collapse. This event density in such a brief window is unprecedented in European power system history.',
          de: 'Die forensische Chronologie des 28. April dokumentiert 47 kritische Ereignisse in 18,5 Stunden. Die ersten 27 Sekunden enthalten 8 IBR-Auslösungen, 6 UFLS-Stufen und den Gesamtkollaps.',
          'zh-Hans': '4月28日法证年表记录了18.5小时内的47个关键事件。最初27秒（12:32:57 - 12:33:24 CEST）包含8次IBR级联跳闸、6个UFLS步骤、核电跳闸和全面崩溃。',
        },
        matrix: {
          es: 'La matriz de costes de inacción compara el OPEX acumulado por no invertir en resiliencia frente al CAPEX del retrofitting regulatorio. Cada año de retraso en la implementación de GFM, compensadores síncronos y BESS añade aproximadamente 180-220 M€ en riesgo económico sistémico. El 28-A demostró empíricamente que el coste de la inacción supera ampliamente al de la prevención.',
          en: 'The inaction cost matrix compares accumulated OPEX from not investing in resilience versus regulatory retrofitting CAPEX. Each year of delay in implementing GFM, synchronous compensators, and BESS adds approximately €180-220M in systemic economic risk. April 28 empirically demonstrated that the cost of inaction far exceeds the cost of prevention.',
          de: 'Die Kostenmatrix der Untätigkeit vergleicht den kumulierten OPEX ohne Resilienzinvestition mit dem Retrofitting-CAPEX. Jedes Verzögerungsjahr fügt 180-220 Mio. € systemisches Risiko hinzu.',
          'zh-Hans': '不作为成本矩阵比较了不投资韧性的累积运营支出与监管改造资本支出。每年延迟实施GFM、同步补偿器和BESS会增加约1.8-2.2亿欧元的系统性经济风险。',
        },
      };
      
      const label = interactiveLabels[anchor]?.[lang] 
        || interactiveLabels[anchor]?.es
        || '';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {label && (
            <div style={{
              padding: '14px 24px',
              borderBottom: '1px solid var(--cfs-border-soft)',
              backgroundColor: 'hsla(190,100%,60%,0.04)',
              flexShrink: 0,
            }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'var(--accent-electric, hsl(190 100% 60%))',
                marginBottom: 5,
                textTransform: 'uppercase',
              }}>
                {lang === 'en' ? '◈ INTERACTIVE SIMULATOR'
                  : lang === 'de' ? '◈ INTERAKTIVER SIMULATOR'
                  : lang === 'zh-Hans' ? '◈ 交互式模拟器'
                  : '◈ SIMULADOR INTERACTIVO'}
              </div>
              <p style={{
                fontSize: 13,
                color: 'var(--cfs-text-1)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {label}
              </p>
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <ColorModeProvider>
              <Suspense fallback={
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--cfs-text-2)' }}>
                  ⟳ {ui.loading}
                </div>
              }>
                <Component />
              </Suspense>
            </ColorModeProvider>
          </div>
        </div>
      );
    }

    if (activeTab.startsWith('figure-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const fig = activeFigures[idx];
      if (!fig) return null;
      const captionKey = 'caption_' + (lang === 'zh-Hans' ? 'en' : lang);
      const caption = fig.caption[captionKey] || fig.caption.caption_es || '';
      
      // Generar texto contextual basado en la última pregunta del usuario
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
      
      const questionMsg = lastUserMsg ? lastUserMsg.text : '';
      let qHash = 0;
      for (let i = 0; i < questionMsg.length; i++) qHash = Math.imul(31, qHash) + questionMsg.charCodeAt(i) | 0;
      const figureId = fig.src;
      const feedbackKey = `feedback_figure_${figureId}_${qHash}`;

      const handleFeedback = (isPositive) => {
        try { localStorage.setItem(feedbackKey, isPositive ? 'yes' : 'no'); } catch(e) {}
        setFigureFeedback(prev => ({ ...prev, [feedbackKey]: isPositive }));
      };
      
      let voted = null;
      if (figureFeedback[feedbackKey] !== undefined) {
        voted = figureFeedback[feedbackKey];
      } else {
        try {
          const cached = localStorage.getItem(feedbackKey);
          if (cached === 'yes') voted = true;
          else if (cached === 'no') voted = false;
        } catch(e) {}
      }
      
      return (
        <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
          {/* Contexto editorial */}
          <div style={{
            marginBottom: 20,
            padding: '14px 16px',
            borderLeft: '3px solid var(--accent-electric, hsl(190 100% 60%))',
            backgroundColor: 'hsla(190,100%,60%,0.05)',
            borderRadius: '0 8px 8px 0',
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'var(--accent-electric, hsl(190 100% 60%))',
              marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              {lang === 'en' ? '◈ WHY THIS IS RELEVANT'
                : lang === 'de' ? '◈ WARUM DIES RELEVANT IST'
                : lang === 'zh-Hans' ? '◈ 为什么这与此相关'
                : '◈ POR QUÉ ESTO ES RELEVANTE'}
            </div>
            <p style={{
              fontSize: 13,
              color: 'var(--cfs-text-1)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {figureContexts[activeTab] === 'loading' ? (
                <span style={{ opacity: 0.6 }}>⟳ {ui.loading}</span>
              ) : figureContexts[activeTab] === 'error' || !figureContexts[activeTab] ? (
                (lang === 'en' ? (fig.artifact?.whyMatters_en || fig.artifact?.whyMatters) : fig.artifact?.whyMatters) || caption
              ) : (
                figureContexts[activeTab]
              )}
            </p>
            {figureContexts[activeTab] && figureContexts[activeTab] !== 'loading' && figureContexts[activeTab] !== 'error' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                <button 
                  onClick={() => handleFeedback(true)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: voted === true ? 1 : 0.5 }}
                  title="Explicación útil"
                >👍</button>
                <button 
                  onClick={() => handleFeedback(false)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: voted === false ? 1 : 0.5 }}
                  title="Explicación poco útil"
                >👎</button>
              </div>
            )}
          </div>

          {/* Imagen o enlace a gráfica ENTSO-E */}
          {fig.artifact?.type === 'entsoe_chart' ? (
            <div style={{
              marginTop: 16,
              padding: '20px 24px',
              border: '1px solid var(--cfs-border-soft)',
              borderRadius: 10,
              textAlign: 'center',
              backgroundColor: 'hsla(220,40%,6%,0.6)',
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--cfs-text-2)',
                marginBottom: 12,
                lineHeight: 1.6,
              }}>
                Gráfica construida con datos reales extraídos de las APIs
                de ESIOS, ENTSO-E y OMIE el 28 de abril de 2025.
              </div>
              
              <a
                href={fig.artifact.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 8,
                  backgroundColor: 'var(--cfs-accent)',
                  color: 'var(--cfs-accent-text)',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                }}
              >
                VER GRÁFICA COMPLETA ↗
              </a>
            </div>
          ) : (
            <img
              src={fig.src}
              alt={caption}
              style={{
                width: '100%',
                maxWidth: 860,
                borderRadius: 8,
                border: '1px solid var(--cfs-border-soft)',
                display: 'block',
                margin: '0 auto',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            />
          )}

          {/* Leyenda / Fuente */}
          {caption && figureContexts[activeTab] !== caption && (
            <p style={{
              marginTop: 12,
              fontSize: 11,
              color: 'var(--cfs-text-3)',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.5,
              padding: '0 16px',
            }}>
              {caption}
            </p>
          )}
        </div>
      );
    }

    if (activeTab.startsWith('table-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const table = activeTables[idx];
      if (!table) return null;
      return (
        <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
          <div style={{
            marginBottom: 16,
            padding: '14px 16px',
            borderLeft: '3px solid var(--cfs-amber)',
            backgroundColor: 'hsla(38,100%,56%,0.05)',
            borderRadius: '0 8px 8px 0',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              color: 'var(--cfs-amber)',
              marginBottom: 6, textTransform: 'uppercase',
            }}>◈ TABLA FORENSE</div>
            <p style={{ fontSize: 13, color: 'var(--cfs-text-1)', lineHeight: 1.7, margin: 0 }}>
              {table.description || table.title}
            </p>
            {table.origin && (
              <div style={{ fontSize: 11, color: 'var(--cfs-text-3)', marginTop: 6 }}>
                Fuente: {table.origin}
              </div>
            )}
          </div>
          {table.sampleRows && table.columns && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {table.columns.map(col => (
                      <th key={col.key} style={{
                        padding: '8px 12px', textAlign: 'left',
                        borderBottom: '1px solid var(--cfs-amber)',
                        color: 'var(--cfs-amber)',
                        fontWeight: 700, fontSize: 10,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.sampleRows.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: '1px solid var(--cfs-border-soft)',
                      backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    }}>
                      {table.columns.map(col => (
                        <td key={col.key} style={{ padding: '7px 12px', fontSize: 12, lineHeight: 1.4 }}>
                          {row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {table.url && (
            <a href={table.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: 16, fontSize: 12,
                color: 'var(--cfs-amber)',
                textDecoration: 'none', fontWeight: 600 }}>
              Ver tabla completa ↗
            </a>
          )}
        </div>
      );
    }
    return null;
  };

  // ── Tabs combinados ───────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      backgroundColor: 'var(--cfs-accent-text)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeInUp 0.2s ease',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderBottom: '1px solid var(--cfs-border-soft)',
        backgroundColor: 'var(--cfs-bg)',
        flexShrink: 0, minHeight: 48,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <polygon points="15,4 9,15 14,15 11,26 21,13 15,13"
              fill="var(--accent-electric, hsl(190 100% 60%))"
              strokeWidth="0.6" strokeLinejoin="round"/>
          </svg>
          <span style={{
            fontWeight: 700, fontSize: 14, letterSpacing: '0.06em',
            color: 'var(--cfs-text-1)',
            textTransform: 'uppercase',
          }}>
            {t.header}
          </span>
          <span style={{
            fontSize: 9,
            color: 'var(--cfs-text-3)',
            letterSpacing: '0.06em',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginLeft: 12,
          }}>
            <span style={{
              border: '1px solid var(--cfs-border)',
              borderRadius: 4,
              padding: '1px 5px',
              fontSize: 9,
            }}>ESC</span>
            <span style={{
              border: '1px solid var(--cfs-border)',
              borderRadius: 4,
              padding: '1px 5px',
              fontSize: 9,
            }}>⌘M</span>
            <span style={{
              border: '1px solid var(--cfs-border)',
              borderRadius: 4,
              padding: '1px 5px',
              fontSize: 9,
            }}>⌘P</span>
            <span style={{
              border: '1px solid var(--cfs-border)',
              borderRadius: 4,
              padding: '1px 5px',
              fontSize: 9,
            }}>⌘→</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={() => setPresentationMode(p => !p)}
            title={presentationMode
              ? (lang === 'en' ? 'Show chat' : lang === 'de' ? 'Chat anzeigen' : lang === 'zh-Hans' ? '显示聊天' : 'Mostrar chat')
              : (lang === 'en' ? 'Presentation mode' : lang === 'de' ? 'Präsentationsmodus' : lang === 'zh-Hans' ? '演示模式' : 'Modo presentación')
            }
            style={{
              background: presentationMode ? 'var(--cfs-accent)' : 'none',
              border: '1px solid var(--cfs-accent)',
              borderRadius: 8,
              color: presentationMode ? 'var(--cfs-accent-text)' : 'var(--cfs-accent)',
              cursor: 'pointer',
              padding: '5px 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              marginRight: 8,
            }}
            onMouseEnter={e => {
              if (!presentationMode) {
                e.currentTarget.style.background = 'var(--cfs-accent)';
                e.currentTarget.style.color = 'var(--cfs-accent-text)';
              }
            }}
            onMouseLeave={e => {
              if (!presentationMode) {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.color = 'var(--cfs-accent)';
              }
            }}
          >
            {presentationMode
              ? (lang === 'en' ? 'CHAT' : lang === 'de' ? 'CHAT' : lang === 'zh-Hans' ? '聊天' : 'CHAT')
              : (lang === 'en' ? 'PRESENT' : lang === 'de' ? 'PRÄSENTATION' : lang === 'zh-Hans' ? '演示' : 'PRESENTAR')
            }
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--cfs-accent)',
              borderRadius: 8,
              color: 'var(--cfs-accent)',
              cursor: 'pointer',
              padding: '5px 14px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--cfs-accent)';
              e.currentTarget.style.color = 'var(--cfs-accent-text)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'var(--cfs-accent)';
            }}
          >
            {ui.exit.toUpperCase()} ×
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: presentationMode 
          ? '0px 1fr' 
          : `${chatWidth}px 8px 1fr`,
        transition: 'grid-template-columns 0.3s ease',
        overflow: 'hidden', minHeight: 0,
      }}>

        {/* ── LEFT: CHAT ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--cfs-border-soft)',
          overflow: presentationMode ? 'hidden' : 'hidden',
          opacity: presentationMode ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: presentationMode ? 'none' : 'auto',
          backgroundColor: 'var(--cfs-bg)',
        }}>
          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto',
            padding: '16px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex', flexDirection: 'column', gap: 4,
                maxWidth: '92%',
              }}>
                <div style={{
                  backgroundColor: m.role === 'user'
                    ? 'var(--cfs-user-msg-bg)'
                    : 'var(--cfs-bot-msg-bg)',
                  color: m.role === 'user'
                    ? 'var(--cfs-user-msg-text)'
                    : 'var(--cfs-bot-msg-text)',
                  padding: '10px 14px', borderRadius: 14,
                  fontSize: 13, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {renderText(m.text)}
                </div>
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {i > 0 && (
                      <button
                        onClick={() => {
                          const prev = messages[i - 1];
                          if (prev?.role === 'user') onSimplify(prev.text);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--cfs-border)',
                          borderRadius: 8, color: 'var(--cfs-text-3)',
                          fontSize: 11, padding: '3px 8px',
                          cursor: 'pointer', transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => {
                          e.target.style.borderColor = 'var(--accent-electric)';
                          e.target.style.color = 'var(--accent-electric)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.borderColor = 'var(--cfs-border)';
                          e.target.style.color = 'var(--cfs-text-3)';
                        }}
                      >
                        {ui.simplify}
                      </button>
                    )}
                    {(() => {
                      const lastAssistantIndex = [...messages].reverse().findIndex(msg => msg.role === 'assistant');
                      const actualLastAssistantIndex = lastAssistantIndex >= 0 ? messages.length - 1 - lastAssistantIndex : -1;
                      const isLastAssistant = i === actualLastAssistantIndex;
                      
                      if (isLastAssistant) return null;
                      
                      const anchors = extractInteractiveAnchors(m.text);
                      const figures = findRelevantFigures(m.text, lang);
                      if (anchors.length === 0 && figures.length === 0) return null;

                      return (
                        <button
                          onClick={() => {
                            setActiveAnchors(anchors);
                            setActiveFigures(figures);
                            const newTab = anchors.length > 0 ? 'interactive-0' : 'figure-0';
                            setPanelVisible(false);
                            setTimeout(() => {
                              setActiveTab(newTab);
                              setPanelKey(k => k + 1);
                              setPanelVisible(true);
                            }, 180);
                          }}
                          style={{
                            background: 'none',
                            border: '1px solid var(--cfs-border)',
                            borderRadius: 8, color: 'var(--cfs-text-3)',
                            fontSize: 11, padding: '3px 8px',
                            cursor: 'pointer', transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            e.target.style.borderColor = 'var(--accent-electric)';
                            e.target.style.color = 'var(--accent-electric)';
                          }}
                          onMouseLeave={e => {
                            e.target.style.borderColor = 'var(--cfs-border)';
                            e.target.style.color = 'var(--cfs-text-3)';
                          }}
                        >
                          {lang === 'en' ? 'VIEW ASSOCIATED MEDIA' : lang === 'zh-Hans' ? '查看相关媒体' : lang === 'de' ? 'ZUGEHÖRIGE MEDIEN ANZEIGEN' : 'VER GRÁFICAS ASOCIADAS'}
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ color: 'var(--cfs-text-3)', fontSize: 12, fontStyle: 'italic' }}>
                {loadingStage === 'searching'
                  ? ui.searching
                  : loadingStage === 'synthesizing'
                  ? ui.synthesizing
                  : ui.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Indicador de escucha activa */}
          {isListening && (
            <div style={{
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--cfs-accent)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              borderTop: '1px solid var(--cfs-border-soft)',
              animation: 'fadeInUp 0.2s ease',
            }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--cfs-accent)',
                animation: 'neonPulseChat 0.8s ease infinite',
                flexShrink: 0,
              }}/>
              {lang === 'en' ? 'LISTENING...'
                : lang === 'de' ? 'HÖRE ZU...'
                : lang === 'zh-Hans' ? '正在听...'
                : 'ESCUCHANDO...'}
            </div>
          )}

          {/* Sugerencias de preguntas */}
          {activeAnchors.length > 0 && !loading && (() => {
            const anchor = activeAnchors[0];
            const suggestions = SUGGESTED_QUESTIONS[anchor]?.[lang] 
              || SUGGESTED_QUESTIONS[anchor]?.es;
            if (!suggestions) return null;
            return (
              <div style={{
                padding: '8px 14px',
                borderTop: '1px solid var(--cfs-border-soft)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                {suggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSend(q);
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--cfs-border-soft)',
                      borderRadius: 8,
                      color: 'var(--cfs-text-2)',
                      cursor: 'pointer',
                      padding: '5px 10px',
                      fontSize: 11,
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--cfs-accent)';
                      e.currentTarget.style.color = 'var(--cfs-accent)';
                      e.currentTarget.style.background = 'rgba(139,38,53,0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--cfs-border-soft)';
                      e.currentTarget.style.color = 'var(--cfs-text-2)';
                      e.currentTarget.style.background = 'none';
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            );
          })()}

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--cfs-border)',
            display: 'flex', gap: 8, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.placeholder}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: '1px solid var(--cfs-border)',
                backgroundColor: 'var(--cfs-surface-bg)',
                color: 'var(--cfs-text-1)',
                fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              title={
                isListening
                  ? (lang === 'en' ? 'Stop' : lang === 'de' ? 'Stopp' : lang === 'zh-Hans' ? '停止' : 'Parar')
                  : (lang === 'en' ? 'Speak' : lang === 'de' ? 'Sprechen' : lang === 'zh-Hans' ? '说话' : 'Hablar')
              }
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: isListening
                  ? '1px solid var(--cfs-accent)'
                  : '1px solid var(--cfs-border)',
                backgroundColor: isListening
                  ? 'var(--cfs-accent)'
                  : 'transparent',
                color: isListening
                  ? 'var(--cfs-accent-text)'
                  : 'var(--cfs-text-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                animation: isListening ? 'neonPulseChat 1s ease infinite' : 'none',
                flexShrink: 0,
              }}
            >
              <svg 
                width="14" height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="9" y="2" width="6" height="12" rx="3"/>
                <path d="M5 10a7 7 0 0 0 14 0"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
              </svg>
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                padding: '10px 16px', borderRadius: 10,
                backgroundColor: loading || !question.trim()
                  ? 'var(--cfs-border)'
                  : 'var(--cfs-accent)',
                color: 'var(--cfs-accent-text)',
                border: 'none',
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600,
                transition: 'background-color 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* ── DIVISOR ARRASTRABLE ── */}
        {!presentationMode && (
          <div
            onMouseDown={handleDragStart}
            style={{
              width: 8,
              cursor: 'col-resize',
              backgroundColor: 'transparent',
              borderLeft: '1px solid var(--cfs-border-soft)',
              borderRight: '1px solid var(--cfs-border-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.15s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 
                'var(--cfs-accent)';
              e.currentTarget.style.opacity = '0.3';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: 2,
              height: 32,
              borderRadius: 2,
              backgroundColor: 'var(--cfs-text-3)',
              opacity: 0.4,
            }} />
          </div>
        )}

        {/* ── RIGHT: CONTENT PANEL ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--cfs-surface-bg)',
        }}>
          {/* Tabs */}
          {allTabs.length > 0 && (
            <div style={{
              display: 'flex', gap: 6, padding: '8px 16px',
              borderBottom: '1px solid var(--cfs-border-soft)',
              flexShrink: 0, overflowX: 'auto',
              backgroundColor: 'var(--cfs-bg)',
              alignItems: 'center',
            }}>
              {allTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === activeTab) return;
                    setPanelVisible(false);
                    setTimeout(() => {
                      setActiveTab(tab.id);
                      setPanelKey(k => k + 1);
                      setPanelVisible(true);
                    }, 180);
                  }}
                  style={{
                    padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap',
                    border: `1px solid ${activeTab === tab.id
                      ? (tab.type === 'interactive' ? 'var(--accent-electric)'
                        : tab.type === 'entsoe' ? 'hsl(280 100% 70%)'
                        : 'var(--cfs-amber)')
                      : 'var(--cfs-border)'}`,
                    backgroundColor: activeTab === tab.id
                      ? (tab.type === 'interactive' ? 'hsla(190,100%,60%,0.1)'
                        : tab.type === 'entsoe' ? 'hsla(280,100%,70%,0.1)'
                        : 'hsla(38,100%,56%,0.1)')
                      : 'transparent',
                    color: activeTab === tab.id
                      ? (tab.type === 'interactive' ? 'var(--accent-electric)'
                        : tab.type === 'entsoe' ? 'hsl(280 100% 70%)'
                        : 'var(--cfs-amber)')
                      : 'var(--cfs-text-2)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Contenido activo */}
          <div style={{
            flex: 1, overflow: 'hidden', position: 'relative',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
            opacity: panelVisible ? 1 : 0,
            transform: panelVisible ? 'translateX(0)' : 'translateX(8px)',
          }}>
            {renderPanelContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function preloadAllSimulators() {
  [
    FrequencyChart, SwingEquationSimulator, TapLagSequence,
    BlackoutPropagationMap, CollapseSismograph, PVCurveSimulator,
    ANSI59Cascade, InterconnectionDashboard, IberianGridTopology,
    MixGeneracion, FinancialWaterfallChart, EnergyTransitionStreamgraph,
    AnimatedRestorationMap, VerticalTimeline, ThermalAdjustmentCostMatrix,
  ].forEach(C => { if (C?.preload) C.preload().catch(() => {}); });
}
