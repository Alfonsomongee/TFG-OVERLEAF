import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

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
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {t.header}
          </div>

          {/* Mensajes */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 360,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.role === 'user' ? 'var(--chat-user-msg-bg)' : 'var(--chat-assistant-msg-bg)',
                color: m.role === 'user' ? 'var(--chat-user-msg-text)' : 'var(--chat-assistant-msg-text)',
                padding: '10px 14px', borderRadius: 14, maxWidth: '85%',
                fontSize: 14, lineHeight: 1.5,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {renderText(m.text)}
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
    </>
  );
}
