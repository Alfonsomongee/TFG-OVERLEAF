import React, { useState } from 'react';
import ENTSOEDashboard from './ENTSOEDashboard';

export default function ModalButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener hora CEST actual
  const now = new Date();
  const cestTime = now.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#1e3a5f',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.75rem 1.5rem',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>⚡</span> Datos ENTSO-E • {cestTime} CEST
      </button>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0a0f1a',
              borderRadius: '1rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: '1.5rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ENTSOEDashboard />
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 1.5rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
