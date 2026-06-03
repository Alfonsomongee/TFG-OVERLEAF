import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ChatFullscreen from './ChatFullscreen';

const UI_STRINGS = {
  es: {
    greeting: '¡Hola! Soy el asistente del TFG sobre el apagón del 28-A. Pregúntame cualquier duda sobre el contenido del sitio.',
    header: 'Asistente del TFG – Apagón 28A',
    placeholder: 'Ej: ¿Cuál fue el papel de la inercia?',
    searching: 'Buscando en el TFG...',
    generating: 'Generando respuesta...',
    errorConnection: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.',
    ariaOpen: 'Abrir chat con IA',
    ariaClose: 'Cerrar chat con IA',
    title: 'Pregunta al TFG',
    simplify: '⚡ Simplificar',
  },
  en: {
    greeting: 'Hello! I am the assistant for the thesis on the 28-A blackout. Ask me anything about the content of this site.',
    header: 'Thesis Assistant – 28A Blackout',
    placeholder: 'E.g.: What role did inertia play?',
    searching: 'Searching the thesis...',
    generating: 'Generating answer...',
    errorConnection: 'Connection error. Check your network and try again.',
    ariaOpen: 'Open AI chat',
    ariaClose: 'Close AI chat',
    title: 'Ask the AI',
    simplify: '⚡ Simplify',
  },
  de: {
    greeting: 'Hallo! Ich bin der Assistent für die Abschlussarbeit über den Stromausfall vom 28. April. Stell mir gerne Fragen zum Inhalt dieser Seite.',
    header: 'TFG-Assistent – Stromausfall 28A',
    placeholder: 'Z.B.: Welche Rolle spielte die Trägheit?',
    searching: 'Suche in der Arbeit...',
    generating: 'Antwort wird generiert...',
    errorConnection: 'Verbindungsfehler. Bitte Netzwerk prüfen und erneut versuchen.',
    ariaOpen: 'KI-Chat öffnen',
    ariaClose: 'KI-Chat schließen',
    title: 'Frage an die KI',
    simplify: '⚡ Vereinfachen',
  },
  'zh-Hans': {
    greeting: '你好！我是关于2025年4月28日伊比利亚大停电毕业论文的智能助手。欢迎向我提问本站的任何内容。',
    header: '论文助手 – 28A大停电',
    placeholder: '例如：惯性在事故中起了什么作用？',
    searching: '正在检索论文内容...',
    generating: '正在生成回答...',
    errorConnection: '连接错误，请检查网络后重试。',
    ariaOpen: '打开AI对话',
    ariaClose: '关闭AI对话',
    title: '向AI提问',
    simplify: '⚡ 简化说明',
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

  const handleSend = async () => {
    const q = question.trim();
    if (!q || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    setLoadingStage('searching');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, locale }),
      });
      setLoadingStage('generating');
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.answer || 'Error al obtener respuesta.' },
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
      const data = await res.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: data.answer || data.error 
      }]);
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
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
      parts.push(
        <a
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'underline' }}
          key={match.index}
        >
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? t.ariaClose : t.ariaOpen}
        title={t.title}
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
          @keyframes neonPulseChat {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(59,130,246,0.5)); }
            50% { filter: drop-shadow(0 0 12px rgba(59,130,246,0.8)); }
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
          maxHeight: 520, backgroundColor: 'var(--chat-bg)',
          border: '1px solid var(--chat-border)', borderRadius: 16,
          display: 'flex', flexDirection: 'column',
          zIndex: 9999, boxShadow: '0 8px 32px rgba(0,242,254,0.15)',
          animation: 'fadeInUp 0.3s ease',
        }}>
          {/* Cabecera */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--chat-border)',
            fontWeight: 600, color: 'var(--chat-header-color)', fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {t.header}
            </span>
            <button
              onClick={() => setFullscreen(true)}
              title="Pantalla completa"
              aria-label="Abrir en pantalla completa"
              style={{
                background: 'linear-gradient(135deg, hsla(190,100%,60%,0.15), hsla(190,100%,60%,0.05))',
                border: '1px solid hsla(190,100%,60%,0.4)',
                borderRadius: 7,
                color: 'hsl(190 100% 60%)',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transition: 'all 0.2s ease',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                boxShadow: '0 0 8px hsla(190,100%,60%,0.15)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-electric)';
                e.currentTarget.style.color = 'var(--accent-electric)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--chart-border, rgba(255,255,255,0.12))';
                e.currentTarget.style.color = 'var(--chart-text-3, #64748b)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2h5v2H4v3H2V2zM11 2h5v5h-2V4h-3V2zM2 11h2v3h3v2H2v-5zM14 14h-3v2h5v-5h-2v3z" fill="currentColor"/>
              </svg>
              <span style={{ fontSize: 10, letterSpacing: '0.08em' }}>
                EXPAND
              </span>
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
                    border: '1px solid var(--chart-border, rgba(255,255,255,0.12))',
                    borderRadius: 8,
                    color: 'var(--ifm-color-primary, #64748b)',
                    fontSize: 11,
                    padding: '3px 8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
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
                  {t.simplify}
                </button>
              )}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '4px 0' }}>
                {loadingStage === 'searching' ? t.searching : t.generating}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px', borderTop: '1px solid var(--chat-border)',
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
                border: '1px solid var(--chat-border)', backgroundColor: 'var(--chat-input-bg)',
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

      {/* Badge invitación pantalla completa */}
      {open && messages.length >= 3 && !fullscreen && (
        <div
          onClick={() => setFullscreen(true)}
          style={{
            position: 'fixed',
            bottom: 170,
            right: 24,
            backgroundColor: 'hsl(190 100% 60%)',
            color: '#000',
            borderRadius: 20,
            padding: '5px 12px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            zIndex: 10000,
            animation: 'neonPulseChat 2s ease infinite',
            boxShadow: '0 0 16px hsla(190,100%,60%,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            userSelect: 'none',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 18 18" fill="none">
            <path d="M2 2h5v2H4v3H2V2zM11 2h5v5h-2V4h-3V2zM2 11h2v3h3v2H2v-5zM14 14h-3v2h5v-5h-2v3z" fill="currentColor"/>
          </svg>
          VER EN PANTALLA COMPLETA
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
            const data = await res.json();
            setLoadingStage('generating');
            setMessages(prev => [...prev, {
              role: 'assistant',
              text: data.answer || data.error || 'Error',
            }]);
          } catch {
            setMessages(prev => [...prev, {
              role: 'assistant',
              text: t.errorConnection,
            }]);
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
