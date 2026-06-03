import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { imageGalleryData } from '@site/src/data/imageGalleryData';

// ── Lazy imports de simuladores (Anexo C) ──────────────────────
const FrequencyChart      = lazy(() => import('./FrequencyChart'));
const SwingEquationSimulator = lazy(() => import('./SwingEquationSimulator'));
const TapLagSequence      = lazy(() => import('./TapLagSequence'));
const BlackoutPropagationMap = lazy(() => import('./BlackoutPropagationMap'));
const CollapseSismograph  = lazy(() => import('./CollapseSismograph'));
const PVCurveSimulator    = lazy(() => import('./PVCurveSimulator'));
const ANSI59Cascade       = lazy(() => import('./ANSI59Cascade'));
const InterconnectionDashboard = lazy(() => import('./InterconnectionDashboard'));
const IberianGridTopology = lazy(() => import('./IberianGridTopology'));
const MixGeneracion       = lazy(() => import('./MixGeneracion'));
const FinancialWaterfallChart = lazy(() => import('./FinancialWaterfallChart'));
const EnergyTransitionStreamgraph = lazy(() => import('./EnergyTransitionStreamgraph'));
const AnimatedRestorationMap = lazy(() => import('./AnimatedRestorationMap'));
const VerticalTimeline    = lazy(() => import('./VerticalTimeline'));
const ThermalAdjustmentCostMatrix = lazy(() => import('./ThermalAdjustmentCostMatrix'));

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
  'inercia':         ['futured_grid_evolution', 'conventionalunits', 'scr_iberia'],
  'inertia':         ['futured_grid_evolution', 'conventionalunits'],
  'trägheit':        ['futured_grid_evolution'],
  '惯量':             ['futured_grid_evolution'],
  'tap-lag':         ['tap_lag_decoupling', 'nunez_balboa_precursores'],
  'tap lag':         ['tap_lag_decoupling'],
  'colapso':         ['cascada_desconexiones', 'tension_frecuencia_colapso'],
  'collapse':        ['cascada_desconexiones', 'tension_frecuencia_colapso'],
  'frecuencia':      ['frequency_voltage_carmona', 'wams_oscilaciones_carmona'],
  'frequency':       ['frequency_voltage_carmona'],
  'frequenz':        ['frequency_voltage_carmona'],
  '频率':             ['frequency_voltage_carmona'],
  'recuperación':    ['estrategia_reenergizacion_dual', 'black_start_hidroelectrico'],
  'recovery':        ['estrategia_reenergizacion_dual'],
  'reposición':      ['islas_reposicion_entsoe', 'estrategia_reenergizacion_dual'],
  'mix':             ['ree_generation_mix_28april', 'mix_comparativo_2010_2024'],
  'fotovoltaica':    ['ree_generation_mix_28april', 'capacidad_instalada_2025'],
  'solar':           ['ree_generation_mix_28april'],
  'cascada':         ['cascada_desconexiones', 'heatmap_propagation'],
  'cascade':         ['cascada_desconexiones'],
  'sobretensión':    ['precursor_overvoltage_22april', 'aluvion_alertas_sobretension_sur'],
  'overvoltage':     ['precursor_overvoltage_22april'],
  'francia':         ['interconexion_francia_colapso', 'evolucion_carga_repuesta_francia'],
  'france':          ['interconexion_francia_colapso'],
  'sincronismo':     ['perdida_sincronismo_frontera'],
  'synchronism':     ['perdida_sincronismo_frontera'],
  'pmu':             ['pmu_sensors_europe', 'wams_oscilaciones_carmona'],
  'gfm':             ['gfl_vs_gfm_circuit1', 'hitachi_hybrid'],
  'gfl':             ['gfl_vs_gfm_circuit1'],
  'bess':            ['hitachi_hybrid', 'ers_revenue_stacking'],
  'islanding':       ['islas_reposicion_entsoe'],
  'islas':           ['islas_reposicion_entsoe'],
  'prensa':          ['collage_conservador', 'collage_progresista', 'collage_internacional'],
  'media':           ['collage_internacional'],
  'coste':           ['coste_optimo_ers', 'ers_revenue_stacking'],
  'cost':            ['coste_optimo_ers'],
};

function findRelevantFigures(text, lang) {
  const lower = text.toLowerCase();
  const found = new Set();
  Object.entries(FIGURE_KEYWORDS).forEach(([keyword, files]) => {
    if (lower.includes(keyword)) {
      files.forEach(f => found.add(f));
    }
  });
  // Mapear nombres de archivo a entradas completas
  return [...found]
    .map(filename => FIGURE_INDEX.find(fig => fig.src.includes(filename)))
    .filter(Boolean)
    .slice(0, 3); // máximo 3 figuras
}

function extractInteractiveAnchors(text) {
  const anchors = new Set();
  const regex = /\]\(([^)]+#([^)]+))\)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const anchor = m[2].toLowerCase();
    if (INTERACTIVE_MAP[anchor]) anchors.add(anchor);
  }
  // También buscar menciones directas de términos
  const lower = text.toLowerCase();
  Object.keys(INTERACTIVE_MAP).forEach(key => {
    if (lower.includes(key.replace('-', ' '))) anchors.add(key);
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
    simplify: '⚡ Simplificar',
    searching: 'Buscando...',
    generating: 'Generando...',
  },
  en: {
    exit: 'Close',
    noContent: 'Ask a question to see related content here',
    loading: 'Loading...',
    interactive: 'Interactive',
    figure: 'Figure',
    simplify: '⚡ Simplify',
    searching: 'Searching...',
    generating: 'Generating...',
  },
  de: {
    exit: 'Schließen',
    noContent: 'Stellen Sie eine Frage, um verwandten Inhalt zu sehen',
    loading: 'Wird geladen...',
    interactive: 'Interaktiv',
    figure: 'Abbildung',
    simplify: '⚡ Vereinfachen',
    searching: 'Suche...',
    generating: 'Generiere...',
  },
  'zh-Hans': {
    exit: '关闭',
    noContent: '提问以在此查看相关内容',
    loading: '加载中...',
    interactive: '交互式',
    figure: '图',
    simplify: '⚡ 简化',
    searching: '搜索中...',
    generating: '生成中...',
  },
};

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
  const [activeTab, setActiveTab]           = useState(null); // 'interactive-X' | 'figure-X'
  const [question, setQuestion]             = useState('');
  const messagesEndRef                      = useRef(null);
  const inputRef                            = useRef(null);

  // Analizar última respuesta del asistente
  useEffect(() => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) return;
    const anchors  = extractInteractiveAnchors(last.text);
    const figures  = findRelevantFigures(last.text, lang);
    setActiveAnchors(anchors);
    setActiveFigures(figures);
    // Seleccionar primer tab automáticamente
    if (anchors.length > 0) setActiveTab('interactive-0');
    else if (figures.length > 0) setActiveTab('figure-0');
    else setActiveTab(null);
  }, [messages, lang]);

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

  const handleSend = () => {
    if (!question.trim() || loading) return;
    onSend(question);
    setQuestion('');
  };

  if (!isOpen) return null;

  // Determinar qué mostrar en el panel derecho
  const renderPanelContent = () => {
    if (activeTab === null) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          height: '100%', gap: 16,
          color: 'var(--chart-text-3, #64748b)', textAlign: 'center',
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
          es: 'Este simulador te permite modificar la constante de inercia H y ver en tiempo real cómo cambia la caída de frecuencia (RoCoF). Es el modelo matemático exacto que explica por qué el sistema ibérico fue tan vulnerable el 28-A.',
          en: 'This simulator lets you modify the inertia constant H and see in real time how the frequency drop (RoCoF) changes. It is the exact mathematical model explaining why the Iberian system was so vulnerable on April 28.',
          de: 'Dieser Simulator ermöglicht es, die Trägheitskonstante H zu ändern und in Echtzeit zu sehen, wie sich der Frequenzabfall (RoCoF) verändert.',
          'zh-Hans': '此模拟器允许您修改惯量常数H，实时查看频率下降（RoCoF）如何变化。',
        },
        'tap-lag-sequence': {
          es: 'Animación paso a paso del mecanismo Tap-Lag: cómo los transformadores OLTC crearon una ilusión de tensión normal en el SCADA mientras el sistema se acercaba al colapso.',
          en: 'Step-by-step animation of the Tap-Lag mechanism: how OLTC transformers created an illusion of normal voltage in SCADA while the system approached collapse.',
          de: 'Schritt-für-Schritt-Animation des Tap-Lag-Mechanismus.',
          'zh-Hans': 'Tap-Lag机制的逐步动画。',
        },
        frequency: {
          es: 'Gráfica scrollytelling de la caída de frecuencia durante los 27 segundos críticos del 28-A, con las actuaciones automáticas de protección marcadas en el eje temporal.',
          en: 'Scrollytelling chart of the frequency drop during the critical 27 seconds of April 28, with automatic protection actions marked on the timeline.',
          de: 'Scrollytelling-Diagramm des Frequenzabfalls während der kritischen 27 Sekunden.',
          'zh-Hans': '28日关键27秒频率下降的滚动叙事图表。',
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
              borderBottom: '1px solid var(--chart-border, rgba(255,255,255,0.08))',
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
                color: 'var(--chart-text-1, #e2e8f0)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {label}
              </p>
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            <Suspense fallback={
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--chart-text-2)' }}>
                ⟳ {ui.loading}
              </div>
            }>
              <Component />
            </Suspense>
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
              color: 'var(--chart-text-1, #e2e8f0)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              {caption}
            </p>
          </div>

          {/* Imagen */}
          <img
            src={fig.src}
            alt={caption}
            style={{
              width: '100%',
              maxWidth: 860,
              borderRadius: 8,
              border: '1px solid var(--chart-border, rgba(255,255,255,0.08))',
              display: 'block',
              margin: '0 auto',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          />

          {/* Fuente */}
          <p style={{
            marginTop: 10,
            fontSize: 11,
            color: 'var(--chart-text-3, #64748b)',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            {fig.chapter && `Capítulo ${fig.chapter.replace('ch','')} — `}
            {fig.src.split('/').pop()}
          </p>
        </div>
      );
    }
    return null;
  };

  // ── Tabs combinados ───────────────────────────────────────────
  const allTabs = [
    ...activeAnchors.map((anchor, i) => ({
      id: 'interactive-' + i,
      label: anchor.replace(/-/g, ' '),
      type: 'interactive',
    })),
    ...activeFigures.map((fig, i) => ({
      id: 'figure-' + i,
      label: fig.src.split('/').pop().replace('.png','').replace('.jpg','').replace(/_/g,' '),
      type: 'figure',
    })),
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      backgroundColor: 'var(--ifm-background-color)',
      display: 'flex', flexDirection: 'column',
      animation: 'fadeInUp 0.2s ease',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        borderBottom: '1px solid var(--chart-border, rgba(255,255,255,0.08))',
        backgroundColor: 'var(--chart-bg, rgba(10,15,30,0.97))',
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
            color: 'var(--chart-text-1, #e2e8f0)',
            textTransform: 'uppercase',
          }}>
            {t.header}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: '1px solid var(--chart-border, rgba(255,255,255,0.12))',
            borderRadius: 8, color: 'var(--chart-text-2, #94a3b8)',
            cursor: 'pointer', padding: '5px 14px',
            fontSize: 12, letterSpacing: '0.08em',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#ef4444';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--chart-border, rgba(255,255,255,0.12))';
            e.currentTarget.style.color = 'var(--chart-text-2, #94a3b8)';
          }}
        >
          {ui.exit} ✕
        </button>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '360px 1fr',
        overflow: 'hidden', minHeight: 0,
      }}>

        {/* ── LEFT: CHAT ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--chart-border, rgba(255,255,255,0.08))',
          overflow: 'hidden',
          backgroundColor: 'var(--chat-bg, rgba(10,15,30,0.97))',
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
                    ? 'var(--chat-user-msg-bg)'
                    : 'var(--chat-assistant-msg-bg)',
                  color: m.role === 'user'
                    ? 'var(--chat-user-msg-text)'
                    : 'var(--chat-assistant-msg-text)',
                  padding: '10px 14px', borderRadius: 14,
                  fontSize: 13, lineHeight: 1.6,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {renderText(m.text)}
                </div>
                {m.role === 'assistant' && i > 0 && (
                  <button
                    onClick={() => {
                      const prev = messages[i - 1];
                      if (prev?.role === 'user') onSimplify(prev.text);
                    }}
                    style={{
                      alignSelf: 'flex-start', background: 'none',
                      border: '1px solid var(--chart-border, rgba(255,255,255,0.12))',
                      borderRadius: 8, color: 'var(--ifm-color-primary, #64748b)',
                      fontSize: 11, padding: '3px 8px',
                      cursor: 'pointer', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      e.target.style.borderColor = 'var(--accent-electric)';
                      e.target.style.color = 'var(--accent-electric)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = 'var(--chart-border, rgba(255,255,255,0.12))';
                      e.target.style.color = 'var(--ifm-color-primary, #64748b)';
                    }}
                  >
                    {ui.simplify}
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 12, fontStyle: 'italic' }}>
                {loadingStage === 'searching' ? ui.searching : ui.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--chat-border)',
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
                border: '1px solid var(--chat-border)',
                backgroundColor: 'var(--chat-input-bg)',
                color: 'var(--chat-input-text)',
                fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                padding: '10px 16px', borderRadius: 10,
                backgroundColor: loading || !question.trim()
                  ? 'var(--chat-btn-bg-disabled)'
                  : 'var(--chat-btn-bg)',
                color: 'var(--chat-btn-text)',
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

        {/* ── RIGHT: CONTENT PANEL ── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--ifm-background-surface-color)',
        }}>
          {/* Tabs */}
          {allTabs.length > 0 && (
            <div style={{
              display: 'flex', gap: 6, padding: '8px 16px',
              borderBottom: '1px solid var(--chart-border, rgba(255,255,255,0.08))',
              flexShrink: 0, overflowX: 'auto',
              backgroundColor: 'var(--chart-bg, rgba(10,15,30,0.97))',
              alignItems: 'center',
            }}>
              {allTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '4px 12px', borderRadius: 8, whiteSpace: 'nowrap',
                    border: `1px solid ${activeTab === tab.id
                      ? (tab.type === 'interactive'
                          ? 'var(--accent-electric)'
                          : 'var(--chart-amber)')
                      : 'var(--chart-border, rgba(255,255,255,0.12))'}`,
                    backgroundColor: activeTab === tab.id
                      ? (tab.type === 'interactive'
                          ? 'hsla(190,100%,60%,0.1)'
                          : 'hsla(38,100%,56%,0.1)')
                      : 'transparent',
                    color: activeTab === tab.id
                      ? (tab.type === 'interactive'
                          ? 'var(--accent-electric)'
                          : 'var(--chart-amber)')
                      : 'var(--chart-text-2, #94a3b8)',
                    fontSize: 11, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    letterSpacing: '0.04em',
                    textTransform: 'capitalize',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  {tab.type === 'interactive' ? '⚡' : '🖼'}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Contenido activo */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {renderPanelContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
