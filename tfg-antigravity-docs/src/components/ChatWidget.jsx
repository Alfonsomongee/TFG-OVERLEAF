// src/components/ChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '👋 ¡Hola! Soy el asistente del TFG sobre el apagón del 28-A. Pregúntame cualquier duda sobre el contenido del sitio.',
    },
  ]);
  const [loading, setLoading] = useState(false);
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const botMsg = {
        role: 'assistant',
        text: data.answer || 'Error al obtener respuesta.',
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: '⚠️ Error de conexión. Comprueba tu red e inténtalo de nuevo.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
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
          color: open ? '#ff4b4b' : '#00f2fe',
          cursor: 'pointer',
          fontSize: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          filter: open ? 'drop-shadow(0 0 10px rgba(255,75,75,0.6))' : 'drop-shadow(0 0 12px rgba(0,242,254,0.8))',
          padding: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.15) translateY(-4px)';
          e.currentTarget.style.filter = open ? 'drop-shadow(0 0 20px rgba(255,75,75,1))' : 'drop-shadow(0 0 25px rgba(0,242,254,1))';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.filter = open ? 'drop-shadow(0 0 10px rgba(255,75,75,0.6))' : 'drop-shadow(0 0 12px rgba(0,242,254,0.8))';
        }}
      >
        {open ? '✕' : '✨'}
      </button>

      {/* Panel del chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 160, /* Panel sube también para dejar espacio al botón */
            right: 24,
            width: 380,
            maxHeight: 520,
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
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
              color: '#e2e8f0',
              fontSize: 15,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>⚡</span> Asistente del TFG – Apagón 28A
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
                  backgroundColor: m.role === 'user' ? '#2563eb' : '#1e293b',
                  color: '#e2e8f0',
                  padding: '10px 14px',
                  borderRadius: 14,
                  maxWidth: '85%',
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic', padding: '4px 0' }}>
                Buscando en el TFG y consultando a la IA...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #1e293b',
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
                border: '1px solid #475569',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
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
                backgroundColor: loading || !question.trim() ? '#334155' : '#3b82f6',
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
