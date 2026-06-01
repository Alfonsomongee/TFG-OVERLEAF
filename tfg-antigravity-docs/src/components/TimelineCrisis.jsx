/**
 * TimelineCrisis.jsx
 * Línea de tiempo vertical alternada — crisis comunicativa del 28-A.
 * Implementación pura React sin dependencias externas.
 * (react-chrono descartado: no soporta React 17 / SSR de Docusaurus)
 */
import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

const ITEMS = [
  {
    time: '12:33 CEST',
    phase: 'colapso',
    title: 'Cero de tensión',
    subtitle: 'Colapso físico de la red',
    detail: 'Disparo del último grupo generador acoplado. La península ibérica pierde el suministro eléctrico en menos de 3 segundos. Los smartphones empiezan a quedarse sin señal a medida que las antenas agotan sus baterías de respaldo.',
    color: '#ef4444',
    icon: '⚡',
  },
  {
    time: '12:45 CEST',
    phase: 'infodemia',
    title: 'Primer reporte ciudadano viral',
    subtitle: 'X (Twitter)',
    detail: 'Usuario anónimo publica: "Se ha ido la luz en toda mi ciudad, ¿os pasa lo mismo?" El hashtag #ApagonEspaña comienza a viralizarse. Sin electricidad ni cobertura, la información se transmite de boca a oído en calles y comercios.',
    color: '#f97316',
    icon: '📱',
  },
  {
    time: '14:00 CEST',
    phase: 'infodemia',
    title: '"Operación Matrioska"',
    subtitle: 'Hipótesis de ciberataque ruso',
    detail: 'Cuentas anónimas afirman que "hackers rusos han atacado los inversores solares españoles". El tuit alcanza 450.000 impresiones en 2 horas. Esta narrativa —sin ningún fundamento técnico— estructurará el debate las siguientes 48 horas.',
    color: '#f59e0b',
    icon: '🕵️',
  },
  {
    time: '15:30 CEST',
    phase: 'politizacion',
    title: 'Cascada de acusaciones políticas',
    subtitle: 'Oposición en X',
    detail: 'Feijóo y Abascal exigen comparecencia urgente de Sánchez. "El Gobierno sabía que podía pasar y no hizo nada". La crisis técnica queda encuadrada como crisis de gobierno antes de que exista ningún diagnóstico técnico.',
    color: '#a855f7',
    icon: '🏛️',
  },
  {
    time: '18:00 CEST',
    phase: 'respuesta',
    title: 'Comparecencia presidencial',
    subtitle: 'Palacio de la Moncloa — 5h 27min de silencio',
    detail: 'Pedro Sánchez comparece tras más de cinco horas de ausencia institucional. No descarta ninguna causa, incluyendo ciberataque. La comparecencia llega cuando las principales narrativas alternativas ya están estructuradas y viralizadas.',
    color: '#3b82f6',
    icon: '🎙️',
  },
  {
    time: '20:00 CEST',
    phase: 'respuesta',
    title: 'Primer parte técnico de REE',
    subtitle: 'Comunicado oficial',
    detail: 'REE descarta el ciberataque y apunta a una "pérdida masiva de generación fotovoltaica en el suroeste" como desencadenante inmediato. La corrección técnica llega con 7,5 horas de retraso. Su alcance será inferior al 10% de los mensajes de atribución política.',
    color: '#10b981',
    icon: '📋',
  },
  {
    time: 'Día +1 · 29-abr',
    phase: 'correccion',
    title: 'Fact-checking y análisis técnico',
    subtitle: 'Medios especializados',
    detail: 'El País, elDiario.es y Reuters publican análisis detallados con fuentes técnicas. El alcance de las correcciones es un 90% menor que el de los mensajes iniciales. La asimetría algorítmica queda documentada: la desinformación ya no puede ser desalojada del espacio público.',
    color: '#06b6d4',
    icon: '🔬',
  },
];

const PHASE_LABELS = {
  colapso:     { label: 'Colapso',      bg: 'rgba(239,68,68,0.12)',    border: 'rgba(239,68,68,0.35)'    },
  infodemia:   { label: 'Infodemia',    bg: 'rgba(249,115,22,0.12)',   border: 'rgba(249,115,22,0.35)'   },
  politizacion:{ label: 'Politización', bg: 'rgba(168,85,247,0.12)',   border: 'rgba(168,85,247,0.35)'   },
  respuesta:   { label: 'Respuesta',    bg: 'rgba(59,130,246,0.12)',   border: 'rgba(59,130,246,0.35)'   },
  correccion:  { label: 'Corrección',   bg: 'rgba(6,182,212,0.12)',    border: 'rgba(6,182,212,0.35)'    },
};

function TimelineCrisisInner() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ position: 'relative', padding: '1rem 0 2rem' }}>
      {/* Línea central */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 2,
        background: 'linear-gradient(to bottom, rgba(239,68,68,0.6), rgba(6,182,212,0.6))',
        transform: 'translateX(-50%)',
        zIndex: 0,
      }} />

      {ITEMS.map((item, i) => {
        const isLeft = i % 2 === 0;
        const isExp  = expanded === i;
        const phase  = PHASE_LABELS[item.phase] || {};

        return (
          <div key={i} style={{
            display: 'flex',
            justifyContent: isLeft ? 'flex-start' : 'flex-end',
            alignItems: 'flex-start',
            marginBottom: '1.5rem',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Tarjeta */}
            <div style={{
              width: 'calc(50% - 28px)',
              marginLeft:  isLeft ? 0          : 'auto',
              marginRight: isLeft ? 'auto'     : 0,
            }}>
              <button
                onClick={() => setExpanded(isExp ? null : i)}
                aria-expanded={isExp}
                style={{
                  width: '100%',
                  textAlign: isLeft ? 'right' : 'left',
                  background: isExp ? phase.bg : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExp ? item.color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 8,
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Tiempo */}
                <div style={{
                  fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
                  color: item.color, letterSpacing: '0.08em',
                  marginBottom: 3,
                }}>
                  {item.time}
                </div>
                {/* Título */}
                <div style={{
                  fontSize: '0.88rem', fontWeight: 600,
                  color: '#e2e8f0', marginBottom: 2,
                  display: 'flex', alignItems: 'center', gap: 6,
                  flexDirection: isLeft ? 'row-reverse' : 'row',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                }}>
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                {/* Subtítulo */}
                <div style={{
                  fontSize: 11, color: 'var(--text-1, #64748b)', fontFamily: 'monospace',
                }}>
                  {item.subtitle}
                </div>
                {/* Detalle expandible */}
                {isExp && (
                  <div style={{
                    marginTop: '0.6rem',
                    paddingTop: '0.6rem',
                    borderTop: `1px solid ${phase.border || 'rgba(255,255,255,0.08)'}`,
                    fontSize: '0.82rem', color: '#cbd5e1',
                    lineHeight: 1.6, textAlign: 'left',
                  }}>
                    {item.detail}
                  </div>
                )}
              </button>
            </div>

            {/* Nodo central */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: 14,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: item.color,
              border: '2px solid rgba(10,15,30,0.9)',
              boxShadow: `0 0 8px ${item.color}80`,
              zIndex: 2,
              flexShrink: 0,
            }} />
          </div>
        );
      })}

      {/* Leyenda */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
        justifyContent: 'center', marginTop: '1.5rem',
      }}>
        {Object.entries(PHASE_LABELS).map(([key, p]) => (
          <span key={key} style={{
            fontSize: 10, fontFamily: 'monospace', padding: '2px 8px',
            borderRadius: 10, background: p.bg, border: `1px solid ${p.border}`,
            color: '#e2e8f0',
          }}>{p.label}</span>
        ))}
      </div>

      <p style={{
        fontSize: 10, color: '#374151', fontFamily: 'monospace',
        textAlign: 'center', marginTop: '0.75rem', fontStyle: 'italic',
      }}>
        Haz clic en cada evento para ver el detalle. Fuente: elaboración propia con datos de REE, ENTSO-E y análisis de X (primeras 24h del 28-A).
      </p>
    </div>
  );
}

export default function TimelineCrisis() {
  return (
    <BrowserOnly fallback={
      <div style={{ height: 200, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--text-1, #64748b)',
                    fontFamily: 'monospace', fontSize: 13 }}>
        Cargando línea de tiempo…
      </div>
    }>
      {() => <TimelineCrisisInner />}
    </BrowserOnly>
  );
}
