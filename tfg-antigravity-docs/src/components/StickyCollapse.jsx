/**
 * StickyCollapse.jsx
 * Scrollytelling: el CollapseSismograph se sincroniza con el scroll.
 *
 * ARQUITECTURA:
 * - Panel izquierdo (40%): pasos de texto que el usuario scrollea.
 * - Panel derecho (60%): sismógrafo sticky que se actualiza con cada paso.
 * - Cada paso de texto activa un instante temporal del sismógrafo
 *   mediante la prop playbackT (tiempo en segundos desde el detonante).
 *
 * PASOS verificados con datos28A.json y ENTSO-E Factual:
 *   t=0  → 12:32:57 CEST: disparo raíz (Granada, -355MW, -165MVAr)
 *   t=3  → 12:33:00: primera cascada FV Badajoz (umbral LVRT superado)
 *   t=13 → 12:33:10: tensión >440 kV en barras colectoras (REE p.5)
 *   t=21 → 12:33:18: pico máximo de tensión, cascada generalizada
 *   t=24 → 12:33:21: pérdida de sincronismo ES-FR (48,46 Hz, ANSI 78)
 *   t=27 → 12:33:24: cero de tensión sistémico
 *   t=30 → 12:33:27: último disparo de grupo generador
 *
 * MODO GALERÍA (isGallery=true):
 * - Sin scroll: muestra los pasos como botones navegables.
 * - Útil cuando se embebe en InteractiveGraphicsGallery.
 *
 * DEPENDENCIAS:
 *   npm install react-scrollama
 *   (Scrollama usa IntersectionObserver, SSR-safe con BrowserOnly)
 */
import React, { useState, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Pasos del scrollytelling ─────────────────────────────────────────────────
function getSteps(lang) {
  const isEs = lang === 'es';
  return [
    {
      t: 0,
      phase: 'warning',
      time:  '12:32:57 CEST',
      title: isEs ? 'El detonante' : 'The trigger',
      text:  isEs
        ? 'Un transformador 400/220 kV en la subestación de Granada dispara por sobretensión en el colector 220 kV (242 kV). Se pierden −355 MW activos y −165 MVAr de capacidad de absorción reactiva. El sistema lleva horas con márgenes reducidos por el efecto Tap-Lag. (ENTSO-E Factual, p.28)'
        : 'A 400/220 kV transformer at Granada substation trips due to overvoltage on the 220 kV collector busbar (242 kV). Loss of −355 MW active and −165 MVAr reactive absorption capacity. The system had been operating with reduced margins due to the Tap-Lag effect for hours. (ENTSO-E Factual, p.28)',
    },
    {
      t: 3,
      phase: 'warning',
      time:  '12:33:00 CEST',
      title: isEs ? 'Primera cascada' : 'First cascade',
      text:  isEs
        ? 'Las plantas fotovoltaicas de Badajoz (−730 MW) cruzan el umbral LVRT de 435 kV establecido en el P.O. 12.2. Sus inversores activan la protección ANSI 59 (sobretensión). La reactiva que absorbían desaparece, lo que eleva aún más la tensión en los nudos vecinos: el bucle de retroalimentación positiva está en marcha.'
        : 'Badajoz PV plants (−730 MW) cross the LVRT threshold of 435 kV set by P.O. 12.2. Their inverters activate ANSI 59 protection (overvoltage). The reactive power they were absorbing disappears, further raising voltage at neighbouring nodes: the positive feedback loop is underway.',
    },
    {
      t: 13,
      phase: 'danger',
      time:  '12:33:10 CEST',
      title: isEs ? 'Tensión fuera de control' : 'Voltage out of control',
      text:  isEs
        ? 'La tensión supera los 440 kV en barras colectoras de la zona sur, por encima del umbral LVRT normativo. Las plantas de Sevilla (−550 MW) y otras instalaciones de Extremadura caen en cascada. En este momento, REE ya no puede ver lo que ocurre en la red de 220 kV colectora: el efecto Tap-Lag oculta la sobretensión al SCADA. (REE, p.5)'
        : 'Voltage exceeds 440 kV at collector busbars in the southern zone, above the normative LVRT threshold. Seville plants (−550 MW) and other Extremadura installations cascade. At this point, REE can no longer see what is happening in the 220 kV collector network: the Tap-Lag effect hides the overvoltage from SCADA. (REE, p.5)',
    },
    {
      t: 21,
      phase: 'danger',
      time:  '12:33:18 CEST',
      title: isEs ? 'Pico de tensión' : 'Voltage peak',
      text:  isEs
        ? 'La tensión alcanza su máximo. Prácticamente toda la generación fotovoltaica del sur peninsular ha desaparecido. La frecuencia comienza a caer a un ritmo próximo a 1 Hz/s — el sistema pierde inercia a una velocidad sin precedentes en el área síncrona continental. El HVDC INELFE-1 mantiene 1.000 MW de exportación hacia Francia en PMODE1, sin respuesta dinámica. (ENTSO-E Factual, p.12)'
        : 'Voltage reaches its peak. Virtually all PV generation in the southern peninsula has disappeared. Frequency begins falling at approximately 1 Hz/s — the system is losing inertia at an unprecedented rate in the continental synchronous area. HVDC INELFE-1 maintains 1,000 MW of export to France in PMODE1, with no dynamic response. (ENTSO-E Factual, p.12)',
    },
    {
      t: 24,
      phase: 'critical',
      time:  '12:33:21 CEST',
      title: isEs ? 'Pérdida de sincronismo' : 'Loss of synchronism',
      text:  isEs
        ? 'A 48,46 Hz, las protecciones de pérdida de sincronismo (ANSI 78) abren los enlaces AC transpirenaicos. La Península Ibérica queda aislada del área síncrona de Europa Continental. En el pico transitorio, las interconexiones AC habían alcanzado 3.800 MW de importación. El sistema ibérico, solo, no puede sostenerse. (ENTSO-E Factual, pp.108-109)'
        : 'At 48.46 Hz, loss-of-synchronism protections (ANSI 78) open the trans-Pyrenean AC links. The Iberian Peninsula is isolated from the European Continental synchronous area. At the transient peak, AC interconnections had reached 3,800 MW of imports. The Iberian system, alone, cannot sustain itself. (ENTSO-E Factual, pp.108-109)',
    },
    {
      t: 27,
      phase: 'critical',
      time:  '12:33:24 CEST',
      title: isEs ? 'Cero eléctrico' : 'Electrical zero',
      text:  isEs
        ? 'Tensión cero sistémico. Aproximadamente 15 GW de generación han desaparecido en 30 segundos. Los 25,2 GW de demanda peninsular española quedan sin suministro. Unos 60 millones de personas pierden el suministro eléctrico. Es el primer colapso por sobretensión documentado en el Área Síncrona de Europa Continental. (ENTSO-E Final Report, mar 2026)'
        : 'Systemic voltage zero. Approximately 15 GW of generation has vanished in 30 seconds. The 25.2 GW of Spanish peninsular demand is without supply. Around 60 million people lose electrical supply. This is the first overvoltage-driven collapse documented in the European Continental Synchronous Area. (ENTSO-E Final Report, Mar 2026)',
    },
  ];
}

// ─── Colores por fase ─────────────────────────────────────────────────────────
const PHASE_COLORS = {
  warning:  '#f59e0b',
  danger:   '#ef4444',
  critical: '#dc2626',
};

// ─── Sismógrafo lazy (importado dinámicamente) ────────────────────────────────
// CollapseSismograph ya existe y acepta prop playbackT para mostrar
// solo los datos hasta ese instante.
function LazyCollapseSismograph({ playbackT, lang }) {
  const CollapseSismograph = React.useMemo(
    () => React.lazy(() =>
      import(/* webpackChunkName: "collapse-sismograph" */
             './CollapseSismograph')
    ),
    [],
  );
  return (
    <React.Suspense fallback={
      <div style={{
        height: 360, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--ifm-color-emphasis-500)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando sismógrafo…' : 'Loading seismograph…'}
      </div>
    }>
      <CollapseSismograph playbackT={playbackT} controls={false} lang={lang} />
    </React.Suspense>
  );
}

// ─── Modo galería (sin scroll, con botones) ───────────────────────────────────
function GalleryMode({ steps, lang }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = steps[activeIdx];
  const color  = PHASE_COLORS[active.phase] || 'var(--ifm-color-emphasis-600)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <LazyCollapseSismograph playbackT={active.t} lang={lang} />

      {/* Botones de paso */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.4rem',
        justifyContent: 'center',
      }} role="tablist" aria-label={lang === 'es' ? 'Pasos del colapso' : 'Collapse steps'}>
        {steps.map((s, i) => {
          const isActive = i === activeIdx;
          const c = PHASE_COLORS[s.phase];
          return (
            <button
              key={i}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIdx(i)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: 20,
                border: `1px solid ${isActive ? c : 'rgba(255,255,255,0.1)'}`,
                background: isActive ? `${c}22` : 'transparent',
                color: isActive ? c : 'var(--ifm-color-emphasis-500)',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {s.time.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Panel de texto */}
      <div style={{
        padding: '1rem 1.25rem',
        background: `${color}0d`,
        border: `1px solid ${color}30`,
        borderRadius: 8,
        borderLeft: `4px solid ${color}`,
      }}>
        <p style={{ margin: '0 0 4px', fontSize: 11, color, fontFamily: 'monospace' }}>
          {active.time}
        </p>
        <h4 style={{ margin: '0 0 0.6rem', color, fontSize: 15 }}>{active.title}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--ifm-font-color-base)' }}>
          {active.text}
        </p>
      </div>
    </div>
  );
}

// ─── Modo scrollytelling ──────────────────────────────────────────────────────
function ScrollyMode({ steps, lang }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = steps[activeIdx];
  const color  = PHASE_COLORS[active.phase] || 'var(--ifm-color-emphasis-600)';

  // Importar Scrollama dinámicamente (usa window)
  const [Scrollama, setScrollama] = useState(null);
  const [Step,      setStep]      = useState(null);

  React.useEffect(() => {
    import('react-scrollama').then(m => {
      setScrollama(() => m.Scrollama);
      setStep(() => m.Step);
    });
  }, []);

  if (!Scrollama || !Step) {
    return <GalleryMode steps={steps} lang={lang} />;
  }

  const isEs = lang === 'es';

  return (
    <div style={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '42% 1fr',
      gap: '2rem',
      alignItems: 'start',
      paddingBottom: '2rem',
    }}>

      {/* Pasos (izquierda, scrolleable) */}
      <div style={{ width: '100%', position: 'relative', zIndex: 5 }}>
        <Scrollama
          onStepEnter={({ data }) => setActiveIdx(data)}
          offset={0.55}
        >
          {steps.map((s, i) => {
            const isActive = i === activeIdx;
            const c = PHASE_COLORS[s.phase];
            return (
              <Step key={i} data={i}>
                <div style={{
                  margin: i === steps.length - 1 ? '45vh 0 80vh 0' : '45vh 0',
                  padding: '1.25rem',
                  background: 'var(--ifm-background-surface-color)',
                  border: isActive
                    ? `2px solid ${c}`
                    : '1px solid var(--ifm-color-emphasis-200)',
                  borderLeft: `4px solid ${isActive ? c : 'transparent'}`,
                  borderRadius: 8,
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: isActive ? `0 8px 30px ${c}22` : 'none',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: 11, color: c, fontFamily: 'monospace' }}>
                    {s.time}
                  </p>
                  <h4 style={{ margin: '0 0 0.6rem', color: c, fontSize: 15 }}>{s.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.65 }}>{s.text}</p>
                </div>
              </Step>
            );
          })}
        </Scrollama>
      </div>

      {/* Sismógrafo sticky (derecha) */}
      <div style={{
        position: 'sticky',
        top: '80px',
        height: 'fit-content',
        zIndex: 10,
        alignSelf: 'start',
      }}>
        {/* Header del gráfico sticky */}
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{
            margin: 0, fontSize: 11, color, fontFamily: 'monospace',
            transition: 'color 0.3s ease',
          }}>
            {active.time}
          </p>
          <h4 style={{
            margin: '2px 0 0', fontSize: 14, color,
            transition: 'color 0.3s ease',
          }}>
            {active.title}
          </h4>
        </div>

        <div style={{
          height: 'auto',
          background: 'var(--ifm-background-surface-color)',
          borderRadius: 10,
          padding: '0.75rem',
          border: `1px solid ${color}40`,
          transition: 'border-color 0.3s ease',
        }}>
          <LazyCollapseSismograph playbackT={active.t} lang={lang} />
        </div>

        {/* Indicador de progreso */}
        <div style={{
          marginTop: '0.5rem',
          display: 'flex', gap: '4px', justifyContent: 'center',
        }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? 16 : 6,
              height: 4,
              borderRadius: 2,
              background: i === activeIdx
                ? PHASE_COLORS[steps[i].phase]
                : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Componente exportado ─────────────────────────────────────────────────────
function StickyCollapseInner({ lang = 'es', isGallery = false }) {
  const steps = useMemo(() => getSteps(lang), [lang]);

  if (isGallery) {
    return <GalleryMode steps={steps} lang={lang} />;
  }
  return <ScrollyMode steps={steps} lang={lang} />;
}

export default function StickyCollapse({ lang = 'es', isGallery = false }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 400, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'var(--ifm-color-emphasis-500)',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando narrativa del colapso…' : 'Loading collapse narrative…'}
      </div>
    }>
      {() => <StickyCollapseInner lang={lang} isGallery={isGallery} />}
    </BrowserOnly>
  );
}
