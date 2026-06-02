// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X } from 'lucide-react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '¡Hola! Soy el asistente del TFG sobre el apagón del 28-A. Pregúntame cualquier duda sobre el contenido del sitio.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('idle');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Foco automático al abrir el chat
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = async () => {
    const q = question.trim();
    if (!q || loading) return;

    const userMsg = { role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);
    setLoadingStage('searching');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      setLoadingStage('generating');
      const data = await res.json();
      const botMsg = {
        role: 'assistant',
        text: data.answer || 'Error al obtener respuesta.',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.' },
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
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a href={match[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }} key={match.index}>
          {match[1]}
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        className="chat-fab"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat del TFG'}
        title="Pregunta al TFG"
        style={{
          position: 'fixed',
          bottom: 100, /* Más arriba para no tapar el modo cine */
          right: 24,
          zIndex: 9999,
          background: 'none',
          border: 'none',
          color: open ? '#ff4b4b' : '#ffffff',
          cursor: 'pointer',
          fontSize: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          filter: open ? 'drop-shadow(0 0 8px rgba(255,75,75,0.6))' : 'drop-shadow(0 0 8px rgba(59,130,246,0.6))',
          animation: !open ? 'neonPulseChat 2.5s infinite alternate' : 'none',
          padding: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.15) translateY(-4px)';
          e.currentTarget.style.filter = open ? 'drop-shadow(0 0 15px rgba(255,75,75,1))' : 'drop-shadow(0 0 15px rgba(59,130,246,1))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.filter = open ? 'drop-shadow(0 0 8px rgba(255,75,75,0.6))' : 'drop-shadow(0 0 8px rgba(59,130,246,0.6))';
        }}
      >
        {open ? (
          <X size={28} />
        ) : (
          <span style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}>
            <Sparkles size={22} />
            <span style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.05em',
              lineHeight: 1,
              opacity: 0.85,
            }}>
              ASK AI
            </span>
          </span>
        )}
      </button>

      {/* Panel del chat */}
      <style>
        {`
          @keyframes neonPulseChat {
            0%, 100% { filter: drop-shadow(0 0 6px rgba(59,130,246,0.5)); }
            50% { filter: drop-shadow(0 0 12px rgba(59,130,246,0.8)); }
          }
        `}
      </style>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 160, /* Panel sube también para dejar espacio al botón */
            right: 24,
            width: 380,
            maxHeight: 520,
            backgroundColor: '#636E4F',
            border: '1px solid #4d5640',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,242,254,0.15)',
            animation: 'fadeInUp 0.3s ease',
          }}
        >
          {/* Cabecera */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #1e293b',
              fontWeight: 600,
              color: '#2C2620',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Asistente del TFG – Apagón 28A
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              maxHeight: 360,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.role === 'user' ? '#752E35' : '#F4F1EA',
                  color: m.role === 'user' ? '#ffffff' : '#2C2620',
                  padding: '10px 14px',
                  borderRadius: 14,
                  maxWidth: '85%',
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {renderText(m.text)}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '4px 0' }}>
                {loadingStage === 'searching'
                  ? 'Buscando en el TFG...'
                  : 'Generando respuesta...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #4d5640',
              display: 'flex',
              gap: 8,
            }}
          >
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
              placeholder="Ej: ¿Cuál fue el papel de la inercia?"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #4d5640',
                backgroundColor: '#F4F1EA',
                color: '#2C2620',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                backgroundColor: loading || !question.trim() ? '#4d5640' : '#752E35',
                color: '#fff',
                border: 'none',
                cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500,
                transition: 'background-color 0.2s',
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
