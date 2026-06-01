/**
 * MediaCardGallery.jsx
 * Galería interactiva de fact-checking mediático del 28-A.
 *
 * REEMPLAZA los 5 collages PNG estáticos del capítulo de Impacto Comunicativo:
 *   /figuras/collage_ciudadanos.png
 *   /figuras/collage_politicos.png
 *   /figuras/collage_conservador.png
 *   /figuras/collage_progresista.png
 *   /figuras/collage_internacional.png
 *
 * ARQUITECTURA:
 *   - Datos desacoplados en src/data/media-factchecks.json
 *   - Filtros por categoría + nivel de veracidad
 *   - Sistema cromático de veracidad (informe auditoría, Área 3)
 *   - Barra "Carrera de los retuits" (asimetría algorítmica)
 *   - Tarjetas expandibles con metadatos
 *   - Sin dependencias nuevas: solo React + Recharts (ya instalado)
 *
 * SISTEMA CROMÁTICO DE VERACIDAD:
 *   🟢 consistente   — alineado con la física del 28-A
 *   🟡 parcial       — verdad parcial / contexto omitido
 *   🟠 imprecision   — imprecisión grave / falta de contexto clave
 *   🔴 contradiccion — contradicción directa con datos ENTSO-E/REE
 *   ⚫ null          — sin valoración técnica (humor, anécdota)
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DATA from '@site/src/data/media-factchecks.json';

// ─── Sistema cromático ────────────────────────────────────────────────────────
const VERACIDAD = {
  consistente:   { color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.3)',  label: '✓ Consistente',       labelEn: '✓ Consistent'          },
  parcial:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)',  label: '◑ Verdad parcial',    labelEn: '◑ Partial truth'       },
  imprecision:   { color: '#f97316', bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.3)',  label: '⚠ Imprecisión grave', labelEn: '⚠ Serious imprecision' },
  contradiccion: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',   label: '✗ Contradicción',     labelEn: '✗ Contradiction'       },
  null:          { color: 'var(--text-1, #64748b)', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.2)', label: '○ Sin valoración',    labelEn: '○ No rating'           },
};

const getV = (v) => VERACIDAD[v] || VERACIDAD.null;

// ─── Icono de plataforma ──────────────────────────────────────────────────────
function PlatformIcon({ platform }) {
  if (platform === 'twitter') return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
         style={{ color: '#60a5fa', flexShrink: 0 }}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
         style={{ color: '#94a3b8', flexShrink: 0 }}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

// ─── Tarjeta individual ───────────────────────────────────────────────────────
function FactCheckCard({ item}) {
  const lang = useDocLang();
  const [expanded, setExpanded] = useState(false);
  const v       = getV(item.veracidad);
  const isEs    = lang === 'es';
  const catInfo = DATA.categorias[item.categoria] || {};
  const vLabel  = isEs ? v.label : (v.labelEn || v.label);

  return (
    <div style={{
      border:       `1px solid ${v.border}`,
      borderLeft:   `4px solid ${v.color}`,
      borderRadius: 8,
      background:   v.bg,
      marginBottom: '0.6rem',
      overflow:     'hidden',
      transition:   'box-shadow 0.2s ease',
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        style={{
          width: '100%', display: 'flex', gap: '0.75rem',
          alignItems: 'flex-start', padding: '0.85rem 1rem',
          background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Badge de veracidad */}
        <span style={{
          flexShrink: 0, marginTop: 2,
          padding: '2px 7px', borderRadius: 10,
          fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
          background: `${v.color}20`, color: v.color,
          border: `1px solid ${v.color}40`,
          whiteSpace: 'nowrap',
        }}>
          {vLabel}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Autor + plataforma */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            marginBottom: 4, flexWrap: 'wrap',
          }}>
            <PlatformIcon platform={item.plataforma} />
            <span style={{ fontSize: 11, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
              {item.autor}
            </span>
            <span style={{ fontSize: 10, color: '#374151', fontFamily: 'monospace' }}>
              · {item.fecha}
            </span>
          </div>
          {/* Texto del tuit/titular */}
          <p style={{
            margin: 0, fontSize: '0.88rem', lineHeight: 1.5,
            color: '#e2e8f0',
            display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            "{item.texto}"
          </p>
        </div>

        <span style={{
          flexShrink: 0, fontSize: 13, color: '#475569',
          marginTop: 2, transform: expanded ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>▾</span>
      </button>

      {/* Panel expandido */}
      {expanded && (
        <div style={{
          padding: '0 1rem 0.85rem 1rem',
          borderTop: `1px solid ${v.border}`,
          paddingTop: '0.75rem',
        }}>
          {/* Nota de veracidad */}
          <div style={{
            padding: '0.5rem 0.75rem',
            background: `${v.color}10`,
            border: `1px solid ${v.color}30`,
            borderRadius: 6, marginBottom: '0.6rem',
            fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.55,
          }}>
            <span style={{ color: v.color, fontWeight: 700, fontFamily: 'monospace' }}>
              {isEs ? 'Análisis forense:' : 'Forensic analysis:'}
            </span>
            {' '}{item.nota_veracidad}
          </div>

          {/* Métricas si las hay */}
          {item.metricas && (
            <div style={{
              display: 'flex', gap: '1rem', flexWrap: 'wrap',
              marginBottom: '0.6rem',
            }}>
              {item.metricas.impresiones && (
                <span style={{ fontSize: 10, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
                  👁 {item.metricas.impresiones.toLocaleString('es-ES')} imp.
                </span>
              )}
              {item.metricas.retweets && (
                <span style={{ fontSize: 10, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
                  🔁 {item.metricas.retweets.toLocaleString('es-ES')}
                </span>
              )}
              {item.metricas.likes && (
                <span style={{ fontSize: 10, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
                  ♥ {item.metricas.likes.toLocaleString('es-ES')}
                </span>
              )}
            </div>
          )}

          {/* Enlace a fuente */}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                fontSize: 11, color: '#60a5fa', fontFamily: 'monospace',
                textDecoration: 'none',
              }}
            >
              🔗 {isEs ? 'Ver fuente original' : 'View original source'}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Barra "Carrera de los retuits" ──────────────────────────────────────────
// Visualiza la asimetría algorítmica: desinformación vs corrección técnica
const RACE_DATA = [
  {
    name: 'Narrativas de atribución política / sabotaje',
    impresiones: 4500000,
    color: '#ef4444',
    desc: '~4,5 M de impresiones en las primeras 6 horas',
  },
  {
    name: 'Corrección técnica forense (REE / ENTSO-E)',
    impresiones: 380000,
    color: '#10b981',
    desc: '~380.000 impresiones en las primeras 24 horas',
  },
];

function AsimetriaBarra({}) {
  const lang = useDocLang();
  const isEs = lang === 'es';
  const maxVal = RACE_DATA[0].impresiones;
  return (
    <div style={{
      padding: '1.25rem',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      marginBottom: '1.5rem',
    }}>
      <h4 style={{ margin: '0 0 0.4rem', color: '#e2e8f0', fontSize: 14 }}>
        {isEs ? 'Asimetría algorítmica: la carrera de los retuits' : 'Algorithmic asymmetry: the retweet race'}
      </h4>
      <p style={{ margin: '0 0 1rem', fontSize: 12, color: 'var(--text-1, #64748b)' }}>
        {isEs
          ? 'La desinformación viajó 10× más rápido que la corrección técnica oficial.'
          : 'Disinformation traveled 10× faster than the official technical correction.'}
      </p>

      {RACE_DATA.map((d, i) => (
        <div key={i} style={{ marginBottom: '0.75rem' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: 4, fontSize: 11, fontFamily: 'monospace',
          }}>
            <span style={{ color: d.color, maxWidth: '70%' }}>{d.name}</span>
            <span style={{ color: '#94a3b8' }}>{d.desc}</span>
          </div>
          <div style={{
            height: 24, background: 'rgba(255,255,255,0.05)',
            borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              width: `${(d.impresiones / maxVal) * 100}%`,
              height: '100%',
              background: d.color,
              borderRadius: 4,
              display: 'flex', alignItems: 'center',
              paddingLeft: 8,
              fontSize: 10, fontFamily: 'monospace',
              color: '#0a0a0a', fontWeight: 700,
              transition: 'width 0.8s ease',
            }}>
              {(d.impresiones / 1000000).toFixed(1)}M imp.
            </div>
          </div>
        </div>
      ))}

      <p style={{
        margin: '0.75rem 0 0', fontSize: 10, color: '#374151',
        fontFamily: 'monospace', fontStyle: 'italic',
      }}>
        {isEs
          ? 'Datos estimados basados en métricas recopiladas durante las primeras 24h del 28-A. La corrección técnica de REE (emitida a las 20:00 CEST) no alcanzó ni el 10% del alcance de los mensajes de atribución política.'
          : 'Estimates based on metrics collected during the first 24h of April 28. The REE technical correction (issued at 20:00 CEST) reached less than 10% of the political attribution messages.'}
      </p>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function MediaCardGalleryInner({}) {
  const lang = useDocLang();
  const [activeCategory, setActiveCategory] = useState('todas');
  const [activeVeracidad, setActiveVeracidad] = useState('todas');
  const [search,          setSearch]          = useState('');
  const isEs = lang === 'es';

  const items = DATA.items;

  // Conteo por categoría
  const countByCat = useMemo(() => {
    const counts = { todas: items.length };
    Object.keys(DATA.categorias).forEach(cat => {
      counts[cat] = items.filter(i => i.categoria === cat).length;
    });
    return counts;
  }, [items]);

  // Conteo por veracidad (excluyendo null para el filtro)
  const countByV = useMemo(() => {
    const counts = { todas: items.length };
    ['consistente','parcial','imprecision','contradiccion'].forEach(v => {
      counts[v] = items.filter(i => i.veracidad === v).length;
    });
    return counts;
  }, [items]);

  // Filtrado
  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchCat  = activeCategory === 'todas' || item.categoria === activeCategory;
      const matchV    = activeVeracidad === 'todas' || item.veracidad === activeVeracidad;
      const q         = search.toLowerCase();
      const matchSearch = !q || item.texto.toLowerCase().includes(q) ||
        item.autor.toLowerCase().includes(q) ||
        (item.nota_veracidad || '').toLowerCase().includes(q);
      return matchCat && matchV && matchSearch;
    });
  }, [items, activeCategory, activeVeracidad, search]);

  // Distribución para minibar
  const dist = useMemo(() => {
    const total = filtered.length || 1;
    return ['consistente','parcial','imprecision','contradiccion','null'].map(v => ({
      v, count: filtered.filter(i => (i.veracidad || 'null') === v).length,
      pct: (filtered.filter(i => (i.veracidad || 'null') === v).length / total) * 100,
    }));
  }, [filtered]);

  return (
    <div>
      {/* Barra de asimetría algorítmica */}
      <AsimetriaBarra />

      {/* Búsqueda */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder={isEs ? 'Buscar en los mensajes…' : 'Search messages…'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, color: '#e2e8f0',
            fontSize: 13, fontFamily: 'monospace',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        <span style={{
          position: 'absolute', left: '0.7rem', top: '50%',
          transform: 'translateY(-50%)', color: '#475569',
        }}>🔍</span>
      </div>

      {/* Filtros por categoría */}
      <div style={{ marginBottom: '0.75rem' }}>
        <p style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace',
                    margin: '0 0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isEs ? 'Categoría' : 'Category'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}
             role="group">
          <button
            onClick={() => setActiveCategory('todas')}
            aria-pressed={activeCategory === 'todas'}
            style={chipStyle(activeCategory === 'todas', '#94a3b8')}
          >
            {isEs ? 'Todas' : 'All'} ({countByCat.todas})
          </button>
          {Object.entries(DATA.categorias).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              aria-pressed={activeCategory === key}
              style={chipStyle(activeCategory === key, cat.color)}
            >
              {cat.icon} {isEs ? cat.label_es : cat.label_en} ({countByCat[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Filtros por veracidad */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace',
                    margin: '0 0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isEs ? 'Nivel de precisión técnica' : 'Technical accuracy level'}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}
             role="group">
          <button
            onClick={() => setActiveVeracidad('todas')}
            aria-pressed={activeVeracidad === 'todas'}
            style={chipStyle(activeVeracidad === 'todas', '#94a3b8')}
          >
            {isEs ? 'Todas' : 'All'}
          </button>
          {['consistente','parcial','imprecision','contradiccion'].map(v => {
            const vData = VERACIDAD[v];
            return (
              <button
                key={v}
                onClick={() => setActiveVeracidad(v)}
                aria-pressed={activeVeracidad === v}
                style={chipStyle(activeVeracidad === v, vData.color)}
              >
                {isEs ? vData.label : (vData.labelEn || vData.label)} ({countByV[v]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de distribución */}
      <div style={{
        display: 'flex', height: 6, borderRadius: 3,
        overflow: 'hidden', marginBottom: '0.75rem',
      }}
        aria-label={isEs ? 'Distribución de veracidad' : 'Accuracy distribution'}
      >
        {dist.map(d => (
          <div key={d.v} style={{
            width: `${d.pct}%`,
            background: VERACIDAD[d.v]?.color || 'var(--text-1, #64748b)',
            transition: 'width 0.3s ease',
          }} title={`${d.v}: ${d.count}`} />
        ))}
      </div>

      {/* Contador */}
      <div style={{
        fontSize: 11, color: '#475569', fontFamily: 'monospace',
        marginBottom: '0.75rem',
      }}>
        {isEs
          ? `Mostrando ${filtered.length} de ${items.length} mensajes`
          : `Showing ${filtered.length} of ${items.length} messages`}
        {search && ` · "${search}"`}
      </div>

      {/* Tarjetas */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#475569',
                    fontFamily: 'monospace', fontSize: 13 }}>
          {isEs ? 'No hay mensajes que coincidan.' : 'No matching messages.'}
        </p>
      ) : (
        filtered.map(item => (
          <FactCheckCard key={item.id} item={item} />
        ))
      )}

      {/* Nota metodológica */}
      <div style={{
        marginTop: '1.5rem',
        padding: '0.75rem 1rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        fontSize: 11, color: '#374151', lineHeight: 1.6,
        fontFamily: 'monospace',
      }}>
        {isEs
          ? 'Sistema cromático de veracidad aplicado según el contraste con datos técnicos verificados en ENTSO-E Factual (oct. 2025), ENTSO-E Final Report (mar. 2026) y Comité de Análisis del Gobierno (jun. 2025). Los mensajes con veracidad "null" son humor, anécdotas o declaraciones sin contenido fáctico técnico — no se valoran.'
          : 'Accuracy color system applied against technical data verified in ENTSO-E Factual (Oct. 2025), ENTSO-E Final Report (Mar. 2026) and Government Analysis Committee (Jun. 2025). Messages rated "null" are humor, anecdotes or statements without technical factual content — not rated.'}
      </div>
    </div>
  );
}

// ─── Helper estilos chip ──────────────────────────────────────────────────────
function chipStyle(isActive, color) {
  return {
    padding: '0.25rem 0.65rem',
    borderRadius: 20,
    border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
    background: isActive ? `${color}18` : 'transparent',
    color: isActive ? color : 'var(--text-1, #64748b)',
    cursor: 'pointer',
    fontFamily: 'monospace', fontSize: 11,
    fontWeight: isActive ? 700 : 400,
    transition: 'all 0.15s ease',
  };
}

// ─── Export con BrowserOnly ───────────────────────────────────────────────────
export default function MediaCardGallery({}) {
  const lang = useDocLang();
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 300, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--text-1, #64748b)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando galería mediática…' : 'Loading media gallery…'}
      </div>
    }>
      {() => <MediaCardGalleryInner />}
    </BrowserOnly>
  );
}
