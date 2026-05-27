import React, { useState } from 'react';

export default function ModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0ea5e9', // Cyber blue
          color: '#ffffff',
          border: '1px solid #38bdf8',
          borderRadius: '8px',
          padding: '0.75rem 1.5rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#0284c7';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(14, 165, 233, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0ea5e9';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.4)';
        }}
      >
        <span>🤖</span> IA Dashboard Forense
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(5, 8, 15, 0.9)',
            backdropFilter: 'blur(10px)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '1rem',
              width: '95vw',
              height: '95vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 0 50px rgba(0,0,0,0.5), 0 0 0 1px #1e293b',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              backgroundColor: '#0b0f19',
              borderBottom: '1px solid #1e293b'
            }}>
              <h3 style={{ margin: 0, color: '#e2e8f0', fontFamily: 'monospace', letterSpacing: '1px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{color: '#0ea5e9'}}>●</span> TERMINAL IA FORENSE
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = '#334155';
                }}
              >
                CERRAR [ESC]
              </button>
            </div>

            {/* Contenido: iFrame apuntando a Streamlit */}
            <div style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
              <iframe 
                src="http://localhost:8501" 
                title="IA Dashboard"
                width="100%" 
                height="100%" 
                style={{ border: 'none', display: 'block' }}
                allow="clipboard-write"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
