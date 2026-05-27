'use client';

import React, { useMemo } from 'react';

/**
 * BLOQUE 6: CRONOLOGÍA DE REPOSICIÓN - DISEÑO MEJORADO
 *
 * Componente React refactorizado con mejoras estéticas y de claridad.
 * - Diseño tipo "Panel de Control Técnico" (Operational Center).
 * - Tarjetas individuales con profundidad y bordes coloreados.
 * - Barras de demanda grandes y prominentes con degradados.
 * - Iconografía semántica de estado.
 * - Jerarquía tipográfica refinada (Mono para datos, Sans para texto).
 * - Animaciones escalonadas de entrada.
 */

// ============================================================================
// 1. DATOS
// ============================================================================

// Iconos SVG simples para el estado
const STATUS_ICONS = {
  red: (
    <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  orange: (
    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  green: (
    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const TIMELINE_DATA = [
  {
    time: '12:33 CEST',
    date: '28 abr',
    color: '#E24B4A',
    title: 'Cero eléctrico confirmado',
    description: 'Tensión 400 kV < 1 kV. ~31 GW interrumpidos. ~55 millones de personas sin suministro.',
    demand: 0,
  },
  {
    time: '12:35 CEST',
    date: '28 abr',
    color: '#EF9F27',
    title: 'Solicitud black-start a EDP Portugal',
    description: 'Arranque autónomo a C. do Bode (hidroeléctrica, 138 MW, cuenca Zêzere). REN cursó la orden en ~2 min.',
    demand: 0,
  },
  {
    time: '12:43 CEST',
    date: '28 abr',
    color: '#EF9F27',
    title: 'Primera reenergización: Hernani (País Vasco)',
    description: 'Arteria 400 kV desde Francia. Importación: ~31 MW confirmados en Irún.',
    demand: 1,
  },
  {
    time: '12:45 CEST',
    date: '28 abr',
    color: '#1D9E75',
    title: 'C. do Bode conectado a barra 220 kV REN',
    description: 'Arranque exitoso en ~10 min. Primera isla eléctrica de Portugal creada.',
    demand: 0.5,
  },
  {
    time: '13:35 CEST',
    date: '28 abr',
    color: '#EF9F27',
    title: 'Línea Baixàs–Vic 400 kV sincronizada',
    description: 'Segunda arteria desde Francia (este peninsular). Expansión hacia Cataluña.',
    demand: 4,
  },
  {
    time: '18:36 CEST',
    date: '28 abr',
    color: '#1D9E75',
    title: 'Sincronización España–Portugal',
    description: 'Línea Aldeadávila–Pocinho 220 kV. Portugal se conecta a la frecuencia europea continental.',
    demand: 30,
  },
  {
    time: '23:00 CEST',
    date: '28 abr',
    color: '#1D9E75',
    title: '51% de la demanda recuperada',
    description: '12.847 MW activos. 70% subestaciones energizadas. Hospitales operando con normalidad.',
    demand: 51,
  },
  {
    time: '00:22 CEST',
    date: '29 abr',
    color: '#1D9E75',
    title: 'Red transporte Portugal 100% restaurada',
    description: 'REN confirma reposición total red alta tensión. Baja tensión en proceso.',
    demand: 65,
  },
  {
    time: '04:00 CEST',
    date: '29 abr',
    color: '#1D9E75',
    title: 'Red transporte España 100% restaurada',
    description: 'REE confirma reposición total red transporte española. Tiempo: ~15,5 horas.',
    demand: 80,
  },
  {
    time: '07:00 CEST',
    date: '29 abr',
    color: '#1D9E75',
    title: 'Reposición prácticamente completa',
    description: '99,95% demanda peninsular recuperada. Zonas rurales aisladas continúan.',
    demand: 99.95,
  },
];

const BLACKSTART_DATA = [
  {
    flagEmoji: '🇵🇹',
    flag: 'PT',
    country: 'portugal',
    name: 'Castelo do Bode',
    technology: 'Hidroeléctrica · 138 MW',
    operator: 'EDP',
    location: 'Cuenca del Zêzere, Portugal',
    detail: 'Arranque en ~10 min · Coste: ~240k €/año',
  },
  {
    flagEmoji: '🇪🇸',
    flag: 'ES',
    country: 'spain',
    name: 'Aldeadávila',
    technology: 'Hidroeléctrica reversible · ~1.100 MW',
    operator: 'Iberdrola',
    location: 'Cuenca del Duero, Salamanca',
    detail: 'Esquema BS-Duero 1 activado ~16:00 CEST',
  },
];

const SOURCES = 'REE Operación 29/04/2025 · REN Portugal · ENTSO-E Final Report (mar. 2026) · Jornal de Negócios (abr. 2025)';

// ============================================================================
// 2. UTILIDADES
// ============================================================================

/**
 * Interpola color de demanda con degradado: rojo → ámbar → verde
 */
const getDemandGradient = (demand) => {
  const getGradientString = (from, to) => `linear-gradient(to right, ${from} 0%, ${to} 100%)`;

  if (demand === 0) return getGradientString('#E24B4A', '#F27170');
  if (demand === 100) return getGradientString('#1D9E75', '#32D8A7');

  if (demand <= 50) {
    const ratio = demand / 50;
    const fromR = Math.round(226 + (239 - 226) * ratio);
    const fromG = Math.round(75 + (159 - 75) * ratio);
    const fromB = Math.round(74 + (39 - 74) * ratio);
    const toR = Math.round(242 + (251 - 242) * ratio);
    const toG = Math.round(113 + (192 - 113) * ratio);
    const toB = Math.round(112 + (85 - 112) * ratio);
    return getGradientString(`rgb(${fromR}, ${fromG}, ${fromB})`, `rgb(${toR}, ${toG}, ${toB})`);
  } else {
    const ratio = (demand - 50) / 50;
    const fromR = Math.round(239 + (29 - 239) * ratio);
    const fromG = Math.round(159 + (158 - 159) * ratio);
    const fromB = Math.round(39 + (117 - 39) * ratio);
    const toR = Math.round(251 + (50 - 251) * ratio);
    const toG = Math.round(192 + (216 - 192) * ratio);
    const toB = Math.round(85 + (170 - 85) * ratio);
    return getGradientString(`rgb(${fromR}, ${fromG}, ${fromB})`, `rgb(${toR}, ${toG}, ${toB})`);
  }
};

// ============================================================================
// 3. COMPONENTES
// ============================================================================

/**
 * TimelineCard: Un hito individual en forma de tarjeta operativa mejorada
 * 
 * Diseño:
 * - Barra lateral coloreada a la izquierda (5px)
 * - Layout flex: tiempo | contenido | demanda
 * - Iconografía de estado
 * - Barra de demanda prominente (16px altura)
 */
const TimelineCard = ({ event, index }) => {
  const demandGradient = useMemo(() => getDemandGradient(event.demand), [event.demand]);

  const statusKey = useMemo(() => {
    if (event.color === '#E24B4A') return 'red';
    if (event.color === '#EF9F27') return 'orange';
    return 'green';
  }, [event.color]);

  return (
    <div
      className="relative mb-8 animate-fadeInUp"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        className="pl-14 pr-4"
        style={{
          borderLeftWidth: '5px',
          borderLeftColor: event.color,
          borderRadius: '12px',
          background: '#2a2a2a',
          border: '1px solid #3a3a3a',
          borderLeftWidth: '5px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '24px',
        }}
      >
        {/* Sección 1: Tiempo & Estado */}
        <div
          style={{
            minWidth: '140px',
            paddingRight: '16px',
            borderRight: '1px solid #3a3a3a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {STATUS_ICONS[statusKey]}
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ffffff',
              }}
            >
              {event.time}
            </span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#888888',
            }}
          >
            {event.date}
          </div>
        </div>

        {/* Sección 2: Contenido Técnico (flexible, crece) */}
        <div
          style={{
            flex: '1',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '8px',
              lineHeight: '1.3',
            }}
          >
            {event.title}
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#aaaaaa',
              lineHeight: '1.5',
            }}
          >
            {event.description}
          </p>
        </div>

        {/* Sección 3: Barra de Demanda Prominente */}
        <div
          style={{
            minWidth: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '16px',
            borderLeft: '1px solid #3a3a3a',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '8px',
              fontFamily: 'monospace',
            }}
          >
            {event.demand.toFixed(1)}%
          </div>
          <div
            style={{
              fontSize: '9px',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
              fontWeight: '500',
            }}
          >
            Demanda Recuperada
          </div>
          <div
            style={{
              width: '100%',
              height: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #3a3a3a',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${event.demand}%`,
                background: demandGradient,
                borderRadius: '7px',
                transition: 'width 300ms ease, background 300ms ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Punto circular en la línea lateral (mejorado) */}
      <div
        style={{
          position: 'absolute',
          left: '-8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: event.color,
          border: '3px solid #1a1a1a',
          zIndex: 10,
          boxShadow: `0 0 12px ${event.color}80`,
        }}
      />
    </div>
  );
};

/**
 * BlackStartCardDesign: Tarjeta detallada tipo "Ficha Técnica"
 */
const BlackStartCardDesign = ({ card, index }) => {
  const borderColor = card.country === 'portugal' ? '#1D9E75' : '#E63946';

  return (
    <div
      className="animate-fadeInUp"
      style={{
        padding: '20px',
        background: '#2a2a2a',
        border: '1px solid #3a3a3a',
        borderLeftWidth: '5px',
        borderLeftColor: borderColor,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        animationDelay: `${900 + index * 80}ms`,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Encabezado: Bandera + Nombre */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #3a3a3a',
        }}
      >
        <div style={{ fontSize: '32px' }}>{card.flagEmoji}</div>
        <div>
          <div
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
              letterSpacing: '0.5px',
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              fontSize: '9px',
              color: '#666666',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '2px',
            }}
          >
            {card.flag}
          </div>
        </div>
      </div>

      {/* Filas de datos técnicos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'TECNOLOGÍA', value: card.technology },
          { label: 'OPERADOR', value: card.operator },
          { label: 'LOCALIZACIÓN', value: card.location },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '9px',
                textTransform: 'uppercase',
                color: '#666666',
                letterSpacing: '0.08em',
                fontWeight: '500',
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: '#cccccc',
                lineHeight: '1.4',
              }}
            >
              {item.value}
            </span>
          </div>
        ))}

        {/* Dato clave (box destacado) */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #3a3a3a',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              color: '#666666',
              letterSpacing: '0.08em',
              marginBottom: '8px',
              fontWeight: '500',
            }}
          >
            Dato clave
          </div>
          <span
            style={{
              fontSize: '12px',
              color: '#cccccc',
              lineHeight: '1.5',
            }}
          >
            {card.detail}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * RestorationWidget: Componente principal mejorado
 */
export default function RestorationWidget() {
  return (
    <div
      style={{
        background: '#1a1a1a',
        color: '#ffffff',
        minHeight: '100vh',
        padding: '40px 24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* ============ HEADER PRINCIPAL ============ */}
        <div
          style={{
            marginBottom: '48px',
            paddingBottom: '32px',
            borderBottom: '1px solid #3a3a3a',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#ffffff',
                marginBottom: '12px',
              }}
            >
              Cronología de reposición
            </h1>
            <p
              style={{
                fontSize: '11px',
                color: '#666666',
                fontFamily: 'monospace',
              }}
            >
              28–29 de abril de 2025 · Desde cero eléctrico (12:33 CEST) hasta recuperación total (07:00 CEST)
            </p>
          </div>
          <div
            style={{
              background: '#2a2a2a',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #3a3a3a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: 'fit-content',
            }}
          >
            {STATUS_ICONS.green}
            <span
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#4ade80',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Sistema Sincronizado
            </span>
          </div>
        </div>

        {/* ============ TIMELINE ============ */}
        <div style={{ marginBottom: '48px' }}>
          {/* Título de sección */}
          <div
            style={{
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '20px',
                background: '#4ade80',
                borderRadius: '2px',
              }}
            />
            <h2
              style={{
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#888888',
              }}
            >
              Eventos de recuperación del suministro
            </h2>
          </div>

          {/* Eventos */}
          {TIMELINE_DATA.map((event, index) => (
            <TimelineCard key={index} event={event} index={index} />
          ))}
        </div>

        {/* ============ BLACK-START SECTION ============ */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #3a3a3a',
            }}
          >
            <h2
              style={{
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              Plantas de arranque autónomo (black-start) activadas
            </h2>
            <p
              style={{
                fontSize: '12px',
                color: '#666666',
                marginTop: '8px',
              }}
            >
              Dossiers de las centrales críticas para el proceso de reenergización.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              maxWidth: '800px',
            }}
          >
            {BLACKSTART_DATA.map((card, index) => (
              <BlackStartCardDesign key={index} card={card} index={index} />
            ))}
          </div>
        </div>

        {/* ============ FOOTER ============ */}
        <div
          style={{
            borderTop: '1px solid #3a3a3a',
            paddingTop: '24px',
            textAlign: 'center',
            fontSize: '9px',
            color: '#666666',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
          }}
        >
          <p>Fuente: {SOURCES}</p>
        </div>
      </div>
    </div>
  );
}
