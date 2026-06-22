import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ChatFullscreen, { preloadAllSimulators } from './ChatFullscreen';

const UI_STRINGS = {
  es: {
    greeting: '¡Hola! Soy el asistente del TFG sobre el apagón del 28-A. Pregúntame cualquier duda sobre el contenido del sitio.',
    header: 'Asistente del TFG – Apagón 28A',
    placeholder: 'Ej: ¿Cuál fue el papel de la inercia?',
    searching: 'Buscando en el TFG...',
    generating: 'Generando respuesta...',
    synthesizing: 'Elaborando respuesta...',
    errorConnection: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.',
    ariaOpen: 'Abrir chat con IA',
    ariaClose: 'Cerrar chat con IA',
    title: 'Pregunta al TFG',
    simplify: 'SIMPLIFICAR',
    expandTitle: 'Pantalla completa',
    expandAria: 'Abrir en pantalla completa',
    apiNonJson: 'La API respondió con formato no JSON (Status {status}). Inicio: {excerpt}',
    apiNoBody: 'La API respondió sin cuerpo (Status {status}).',
    apiErrorFallback: 'Error al obtener respuesta.',
    endpointError: 'Error del endpoint ({status})'
  },
  en: {
    greeting: 'Hello! I am the assistant for the thesis on the 28-A blackout. Ask me anything about the content of this site.',
    header: 'Thesis Assistant – 28A Blackout',
    placeholder: 'E.g.: What role did inertia play?',
    searching: 'Searching the thesis...',
    generating: 'Generating answer...',
    synthesizing: 'Generating answer...',
    errorConnection: 'Connection error. Check your network and try again.',
    ariaOpen: 'Open AI chat',
    ariaClose: 'Close AI chat',
    title: 'Ask the AI',
    simplify: 'SIMPLIFY',
    expandTitle: 'Full screen',
    expandAria: 'Open in full screen',
    apiNonJson: 'The API responded with a non-JSON format (Status {status}). Beginning: {excerpt}',
    apiNoBody: 'The API responded with an empty body (Status {status}).',
    apiErrorFallback: 'Error retrieving response.',
    endpointError: 'Endpoint error ({status})'
  },
  de: {
    greeting: 'Hallo! Ich bin der Assistent für die Abschlussarbeit über den Stromausfall vom 28. April. Stell mir gerne Fragen zum Inhalt dieser Seite.',
    header: 'TFG-Assistent – Stromausfall 28A',
    placeholder: 'Z.B.: Welche Rolle spielte die Trägheit?',
    searching: 'Suche in der Arbeit...',
    generating: 'Antwort wird generiert...',
    synthesizing: 'Antwort wird erstellt...',
    errorConnection: 'Verbindungsfehler. Bitte Netzwerk prüfen und erneut versuchen.',
    ariaOpen: 'KI-Chat öffnen',
    ariaClose: 'KI-Chat schließen',
    title: 'Frage an die KI',
    simplify: 'VEREINFACHEN',
    expandTitle: 'Vollbild',
    expandAria: 'Im Vollbildmodus öffnen',
    apiNonJson: 'Die API hat ein Nicht-JSON-Format zurückgegeben (Status {status}). Anfang: {excerpt}',
    apiNoBody: 'Die API hat eine leere Antwort zurückgegeben (Status {status}).',
    apiErrorFallback: 'Fehler beim Abrufen der Antwort.',
    endpointError: 'Endpoint-Fehler ({status})'
  },
  'zh-Hans': {
    greeting: '你好！我是关于2025年4月28日伊比利亚大停电毕业论文的智能助手。欢迎向我提问本站的任何内容。',
    header: '论文助手 – 28A大停电',
    placeholder: '例如：惯性在事故中起了什么作用？',
    searching: '正在检索论文内容...',
    generating: '正在生成回答...',
    synthesizing: '正在生成回答...',
    errorConnection: '连接错误，请检查网络后重试。',
    ariaOpen: '打开AI对话',
    ariaClose: '关闭AI对话',
    title: '向AI提问',
    simplify: '简化',
    expandTitle: '全屏',
    expandAria: '打开全屏模式',
    apiNonJson: 'API返回了非JSON格式的响应 (状态码 {status})。开头: {excerpt}',
    apiNoBody: 'API返回了空响应 (状态码 {status})。',
    apiErrorFallback: '获取回答失败。',
    endpointError: '接口错误 ({status})'
  },
};

export default function ChatWidget() {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const locale = UI_STRINGS[currentLocale] ? currentLocale : 'es';
  const t = UI_STRINGS[locale];

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t.greeting },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const [fullscreen, setFullscreen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const parseChatResponse = async (res) => {
    const raw = await res.text();

    try {
      return JSON.parse(raw);
    } catch {
      return {
        answer: raw
          ? t.apiNonJson.replace('{status}', res.status).replace('{excerpt}', raw.slice(0, 180))
          : t.apiNoBody.replace('{status}', res.status)
      };
    }
  };

  const makeAssistantMessage = (data, fallbackText = t.apiErrorFallback) => ({
    role: 'assistant',
    text: data.answer || data.error || fallbackText,
    sources: data.sources || [],
    suggestedFigures: data.suggestedFigures || [],
    visualArtifacts: data.visualArtifacts || [],
    followUps: data.followUps || [],
    intent: data.intent || 'general',
  });

  const handleSend = async (overrideQuestion) => {
    const q = (typeof overrideQuestion === 'string' ? overrideQuestion : question).trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    if (typeof overrideQuestion !== 'string') setQuestion('');
    setLoading(true);
    setLoadingStage('searching');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, locale }),
      });
      setLoadingStage('generating');
      await new Promise(r => setTimeout(r, 400));
      setLoadingStage('synthesizing');
      const data = await parseChatResponse(res);
      setMessages(prev => [
        ...prev,
        makeAssistantMessage(data, t.endpointError.replace('{status}', res.status)),
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: t.errorConnection },
      ]);
    } finally {
      setLoading(false);
      setLoadingStage('idle');
    }
  };

  const handleSimplify = async (originalQuestion) => {
    setLoading(true);
    setLoadingStage('generating');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: originalQuestion, 
          locale,
          mode: 'simple'
        }),
      });
      const data = await parseChatResponse(res);
      setMessages(prev => [...prev, makeAssistantMessage(data, t.endpointError.replace('{status}', res.status))]);
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: t.errorConnection 
      }]);
    } finally {
      setLoading(false);
      setLoadingStage('idle');
    }
  };

  const renderText = (text) => {
    if (!text) return text;
    // Separar párrafos por doble salto de línea
    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length <= 1) return parseInline(text);
    return paragraphs.map((p, pIdx) => (
      <span key={pIdx}>
        {pIdx > 0 && <><br/><br/></>}
        {parseInline(p)}
      </span>
    ));
  };

  const parseInline = (text) => {
    const regex = /(\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
    const parts = [];
    let last = 0, match, key = 0;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.substring(last, match.index));
      if (match[2]) {
        // **negrita**
        parts.push(<strong key={key++}>{match[2]}</strong>);
      } else {
        // [texto](url)
        parts.push(
          <a
            key={key++}
            href={match[4]}
            style={{ color: 'var(--ifm-color-primary)', textDecoration: 'underline' }}
          >
            {match[3]}
          </a>
        );
      }
      last = regex.lastIndex;
    }
    if (last < text.length) parts.push(text.substring(last));
    return parts.length ? parts : text;
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? t.ariaClose : t.ariaOpen}
        title={t.title}
        onMouseEnter={() => preloadAllSimulators()}
      >
        {open ? (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <line x1="6" y1="6" x2="22" y2="22"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <span className="chat-fab__ring chat-fab__ring--1" aria-hidden="true"/>
            <span className="chat-fab__ring chat-fab__ring--2" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--1" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--2" aria-hidden="true"/>
            <span className="chat-fab__spark chat-fab__spark--3" aria-hidden="true"/>
            <svg
              className="chat-fab__icon"
              width="28" height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon
                points="15,4 9,15 14,15 11,26 21,13 15,13"
                fill="var(--fab-spark-color)"
                stroke="var(--fab-spark-stroke)"
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            </svg>
            <span className="chat-fab__label" aria-hidden="true">ASK AI</span>
          </>
        )}
      </button>

      {/* Panel del chat */}
      <style>
        {`
          :root,
          html[data-theme='light'] {
            --chat-widget-bg: rgba(255, 252, 245, 0.96);
            --chat-widget-border: rgba(25, 24, 20, 0.16);
            --chat-widget-header: #191814;
            --chat-widget-text: #3C3830;
            --chat-widget-muted: #6B6255;

            --chat-widget-accent: #1F6F78;
            --chat-widget-accent-soft: rgba(31, 111, 120, 0.10);
            --chat-widget-accent-border: rgba(31, 111, 120, 0.36);
            --chat-widget-accent-text: #FFFCF5;

            --chat-widget-shadow: 0 14px 38px rgba(25, 24, 20, 0.14);
            --chat-widget-badge-shadow: 0 8px 24px rgba(25, 24, 20, 0.18);
          }

          html[data-theme='dark'] {
            --chat-widget-bg: rgba(16, 29, 53, 0.96);
            --chat-widget-border: rgba(226, 232, 240, 0.16);
            --chat-widget-header: #F4F7FB;
            --chat-widget-text: #C7D2E3;
            --chat-widget-muted: #91A4BC;

            --chat-widget-accent: #7DCDE3;
            --chat-widget-accent-soft: rgba(125, 205, 227, 0.12);
            --chat-widget-accent-border: rgba(125, 205, 227, 0.42);
            --chat-widget-accent-text: #071326;

            --chat-widget-shadow: 0 16px 44px rgba(0, 0, 0, 0.42);
            --chat-widget-badge-shadow: 0 10px 28px rgba(0, 0, 0, 0.38);
          }

          @keyframes subtlePulseChat {
            0%, 100% { filter: drop-shadow(0 0 4px var(--chat-widget-accent-soft)); }
            50% { filter: drop-shadow(0 0 8px var(--chat-widget-accent-border)); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      {open && (
        <div style={{
          position: 'fixed', bottom: 160, right: 24, width: 380,
          maxHeight: 520, backgroundColor: 'var(--chat-widget-bg)',
          border: '1px solid var(--chat-widget-border)', borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          zIndex: 9999, boxShadow: 'var(--chat-widget-shadow)', backdropFilter: 'blur(14px)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {/* Cabecera */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--chat-widget-border)',
            fontWeight: 600, color: 'var(--chat-widget-header)', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.header}
            </span>
            <button
              onClick={() => setFullscreen(true)}
              title={t.expandTitle}
              aria-label={t.expandAria}
              style={{
                background: 'transparent',
                border: '1px solid var(--chat-widget-accent-border)',
                borderRadius: 7,
                color: 'var(--chat-widget-accent)',
                cursor: 'pointer',
                padding: '3px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transition: 'all 0.2s ease',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
              onMouseEnter={e => {
                preloadAllSimulators();
                e.currentTarget.style.background = 'var(--chat-widget-accent)';
                e.currentTarget.style.color = 'var(--chat-widget-accent-text)';
                e.currentTarget.style.borderColor = 'var(--chat-widget-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--chat-widget-accent)';
                e.currentTarget.style.borderColor = 'var(--chat-widget-accent-border)';
              }}
            >
              <svg width="11" height="11" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2h5v2H4v3H2V2zM11 2h5v5h-2V4h-3V2zM2 11h2v3h3v2H2v-5zM14 14h-3v2h5v-5h-2v3z" fill="currentColor"/>
              </svg>
              EXPAND
            </button>
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxWidth: '85%',
              }}>
              <div style={{
                backgroundColor: m.role === 'user' ? 'var(--chat-user-msg-bg)' : 'var(--chat-assistant-msg-bg)',
                color: m.role === 'user' ? 'var(--chat-user-msg-text)' : 'var(--chat-assistant-msg-text)',
                padding: '10px 14px', borderRadius: 14,
                fontSize: 14, lineHeight: 1.5,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {renderText(m.text)}
              </div>
              {m.role === 'assistant' && i > 0 && (
                <button
                  onClick={() => {
                    const userMsg = messages[i - 1];
                    if (userMsg?.role === 'user') {
                      handleSimplify(userMsg.text);
                    }
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: '1px solid var(--chat-widget-accent-border)',
                    borderRadius: 6,
                    color: 'var(--chat-widget-accent)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = 'var(--chat-widget-accent)';
                    e.target.style.color = 'var(--chat-widget-accent-text)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'none';
                    e.target.style.color = 'var(--chat-widget-accent)';
                  }}
                >
                  {t.simplify}
                </button>
              )}
              {m.role === 'assistant' && i === messages.length - 1 && m.followUps && m.followUps.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                  {m.followUps.map((fu, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSend(fu)}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'rgba(31, 111, 120, 0.05)',
                        border: '1px solid var(--chat-widget-accent-border)',
                        borderRadius: 12,
                        color: 'var(--chat-widget-accent)',
                        fontSize: 12,
                        padding: '6px 12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        lineHeight: 1.3,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.target.style.background = 'var(--chat-widget-accent)';
                        e.target.style.color = 'var(--chat-widget-accent-text)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.background = 'rgba(31, 111, 120, 0.05)';
                        e.target.style.color = 'var(--chat-widget-accent)';
                      }}
                    >
                      {fu}
                    </button>
                  ))}
                </div>
              )}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '4px 0' }}>
                {loadingStage === 'searching'
                  ? t.searching
                  : loadingStage === 'synthesizing'
                  ? t.synthesizing
                  : t.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--chat-widget-border)',
            display: 'flex', gap: 8,
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
                border: '1px solid var(--chat-widget-border)', backgroundColor: 'var(--chat-input-bg)',
                color: 'var(--chat-input-text)', fontSize: 14, outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                padding: '10px 16px', borderRadius: 10,
                backgroundColor: loading || !question.trim() ? 'var(--chat-btn-bg-disabled)' : 'var(--chat-btn-bg)',
                color: 'var(--chat-btn-text)', border: 'none',
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 500, transition: 'background-color 0.2s',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}


      {/* Modo pantalla completa */}
      <ChatFullscreen
        isOpen={fullscreen}
        onClose={() => setFullscreen(false)}
        messages={messages}
        loading={loading}
        loadingStage={loadingStage}
        onSend={async (q) => {
          setMessages(prev => [...prev, { role: 'user', text: q }]);
          setLoading(true);
          setLoadingStage('searching');
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question: q, locale }),
            });
            setLoadingStage('generating');
            await new Promise(r => setTimeout(r, 400));
            setLoadingStage('synthesizing');
            const data = await parseChatResponse(res);
            setMessages(prev => [...prev, makeAssistantMessage(data, `Error del endpoint (${res.status})`)]);
          } finally {
            setLoading(false);
            setLoadingStage('idle');
          }
        }}
        onSimplify={handleSimplify}
        t={t}
        renderText={renderText}
      />
    </>
  );
}
