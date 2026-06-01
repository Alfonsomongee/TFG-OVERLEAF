/**
 * VerticalTimeline.jsx
 * Línea de tiempo vertical interactiva del 28-A.
 *
 * MEJORAS respecto a la versión anterior (que ya tenía los datos correctos):
 *
 * 1. FILTRO POR CATEGORÍA:
 *    Chips interactivos para filtrar por tipo de evento:
 *    'electrico' | 'institucional' | 'regulatorio' | 'todos'
 *    Cada evento del timelineData debe tener un campo `category`.
 *    Si no lo tiene, se muestra por defecto bajo 'electrico'.
 *
 * 2. INDICADOR DE PROGRESO TEMPORAL:
 *    Barra horizontal debajo del header que muestra qué porcentaje
 *    del timeline está visible según el filtro activo.
 *
 * 3. ANIMACIÓN DE ENTRADA:
 *    Los eventos entran con fadeIn escalonado (respeta prefers-reduced-motion).
 *
 * 4. MODO COMPACTO:
 *    Prop `compact` para mostrar solo título + fecha sin descripción.
 *    Útil cuando se usa dentro de otros componentes como panel lateral.
 *
 * Los datos ya están corregidos en la versión anterior:
 * - t7: 3.800 MW (no 4.600 MW)
 * - t5: ANSI 59, 242 kV, -165 MVAr (ENTSO-E Factual p.28)
 * - t8: 12:33:27 CEST, 25,2 GW demanda peninsular
 * - t10: cita ENTSO-E Factual pp.12-13
 */
import React, { useState, useMemo } from 'react';
import styles from './VerticalTimeline.module.css';
import { timelineEvents } from '../data/timelineData';

// ─── Categorías disponibles ───────────────────────────────────────────────────
const CATEGORIES = {
  todos:         { es: 'Todos',         en: 'All',            color: '#94a3b8' },
  electrico:     { es: 'Eléctrico',     en: 'Electrical',     color: '#00d9ff' },
  institucional: { es: 'Institucional', en: 'Institutional',  color: '#f59e0b' },
  regulatorio:   { es: 'Regulatorio',   en: 'Regulatory',     color: '#10b981' },
};

// ─── Localización del evento ──────────────────────────────────────────────────
function getLocalizedEvent(event, l) {
  const t = (es, en, pt, fr, it, de) =>
    ({ es, en, pt, fr, it, de }[l] || es);

  let title   = event.title_es || '';
  let desc    = event.desc_es  || '';
  let dateStr = event.date     || '';

  if (event.id === 't1') {
    title = t('Eventos Precursores en Núñez de Balboa', 'Precursor Events at Núñez de Balboa',
      'Eventos Precursores em Núñez de Balboa', 'Événements Précurseurs à Núñez de Balboa',
      'Eventi Precursori a Núñez de Balboa', 'Vorläuferereignisse in Núñez de Balboa');
    desc = t(
      'Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.',
      'Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.',
      'Registram-se oscilações de tensão que provocam disparos idênticos aos que ocorreriam no 28-A.',
      'Des oscillations de tension sont enregistrées, provoquant des déclenchements identiques à ceux du 28 avril.',
      'Si registrano oscillazioni di tensione che provocano scatti identici a quelli del 28 aprile.',
      'Spannungsschwankungen verursachen Auslösungen identisch zu denen vom 28. April.',
    );
    dateStr = t('22 de abril de 2025','April 22, 2025','22 de abril de 2025','22 avril 2025','22 aprile 2025','22. April 2025');

  } else if (event.id === 't2') {
    title = t('Transición de Control en HVDC INELFE-1','Control Transition in INELFE-1 HVDC',
      'Transição de Controle em HVDC INELFE-1','Transition de Contrôle dans HVDC INELFE-1',
      'Transizione di Controllo in HVDC INELFE-1','Steuerungsübergang in HVDC INELFE-1');
    desc = t(
      'Paso de PMODE3 a PMODE1 (~12:08 CEST), limitando la respuesta dinámica. En PMODE1, el enlace mantiene 1.000 MW de exportación ES→FR sin responder a la frecuencia.',
      'Transition from PMODE3 to PMODE1 (~12:08 CEST), limiting dynamic response. In PMODE1, the link maintains 1,000 MW export ES→FR without frequency response.',
      'Passagem do PMODE3 para PMODE1 (~12:08 CEST). Em PMODE1, mantém 1.000 MW de exportação ES→FR sem resposta à frequência.',
      'Passage PMODE3 → PMODE1 (~12h08 CEST). En PMODE1, 1 000 MW d\'export ES→FR sans réponse en fréquence.',
      'Passaggio PMODE3 → PMODE1 (~12:08 CEST). In PMODE1, 1.000 MW di esportazione ES→FR senza risposta in frequenza.',
      'Übergang PMODE3 → PMODE1 (~12:08 CEST). In PMODE1, 1.000 MW Export ES→FR ohne Frequenzreaktion.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't3') {
    title = t('Déficit de Potencia Reactiva (Fase 1)','Reactive Power Deficit (Phase 1)',
      'Déficit de Potência Reativa (Fase 1)','Déficit de Puissance Réactive (Phase 1)',
      'Deficit di Potenza Reattiva (Fase 1)','Blindleistungsdefizit (Phase 1)');
    desc = t(
      'Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de −0,6 GVAr de absorción reactiva. (IIT-ICAI / Compass Lexecon)',
      'Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net reactive absorption deficit of −0.6 GVAr. (IIT-ICAI / Compass Lexecon)',
      'Manobras de malhagem reduzem a margem de colapso em 57% na zona sul, gerando déficit líquido de −0,6 GVAr.',
      'Les manœuvres de maillage réduisent la marge de 57%, générant un déficit de −0,6 GVAr.',
      'Le manovre di magliatura riducono il margine del 57%, generando un deficit di −0,6 GVAr.',
      'Vermaschungsmanöver reduzieren die Kollapsmarge um 57%, erzeugen Defizit von −0,6 GVAr.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't4') {
    title = t('Amplificación Tap-Lag (Fase 2)','Tap-Lag Amplification (Phase 2)',
      'Amplificação Tap-Lag (Fase 2)','Amplification Tap-Lag (Phase 2)',
      'Amplificazione Tap-Lag (Fase 2)','Tap-Lag-Verstärkung (Phase 2)');
    desc = t(
      'Desacoplamiento entre la red de 400 kV (observada por REE vía SCADA) y las redes colectoras renovables, donde la tensión escala silenciosamente hasta superar los umbrales HVRT de 1,10 p.u.',
      'Decoupling between the 400 kV grid (monitored by REE via SCADA) and renewable collector grids, where voltage scales silently until exceeding HVRT thresholds of 1.10 p.u.',
      'Desacoplamento entre rede 400 kV e redes coletoras: tensão supera silenciosamente os limiares HVRT.',
      'Découplage réseau 400 kV / réseaux collecteurs : la tension dépasse silencieusement les seuils HVRT.',
      'Disaccoppiamento rete 400 kV / reti collettrici: la tensione supera silenziosamente le soglie HVRT.',
      'Entkopplung 400-kV-Netz / Kollektornetze: Spannung überschreitet still HVRT-Schwellen.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't5') {
    title = t('Disparo Raíz en Granada (12:32:57 CEST)','Root Trip in Granada (12:32:57 CEST)',
      'Disparo Raiz em Granada (12:32:57 CEST)','Déclenchement Racine à Grenade (12:32:57 CEST)',
      'Scatto Radice a Granada (12:32:57 CEST)','Wurzelauslösung in Granada (12:32:57 CEST)');
    desc = t(
      'El secundario colector 220 kV alcanza ~242 kV (>1,10 p.u.), activando la protección ANSI 59. Pérdida de −355 MW activos y −165 MVAr de absorción reactiva. (ENTSO-E Factual, p.28)',
      '220 kV collector secondary reaches ~242 kV (>1.10 p.u.), triggering ANSI 59. Loss of −355 MW active and −165 MVAr reactive absorption. (ENTSO-E Factual, p.28)',
      'Secundário coletor 220 kV: ~242 kV (>1,10 p.u.), ativando ANSI 59. Perda −355 MW e −165 MVAr.',
      'Secondaire collecteur 220 kV: ~242 kV (>1,10 p.u.), déclenchant ANSI 59. Perte −355 MW et −165 MVAr.',
      'Secondario collettore 220 kV: ~242 kV (>1,10 p.u.), attivando ANSI 59. Perdita −355 MW e −165 MVAr.',
      'Kollektor-Sekundärkreis 220 kV: ~242 kV (>1,10 p.u.), ANSI-59 ausgelöst. −355 MW und −165 MVAr.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't6') {
    title = t('Inicio de Cascada Geométrica (Fase 3)','Onset of Geometric Cascade (Phase 3)',
      'Início da Cascata Geométrica (Fase 3)','Début de la Cascade Géométrique (Phase 3)',
      'Inizio della Cascata Geometrica (Fase 3)','Beginn der geometrischen Kaskade (Phase 3)');
    desc = t(
      'Propagación masiva de sobretensiones por el sur y oeste peninsular. Badajoz (730 MW), Sevilla (550 MW) y otras plantas FV caen en cascada. La tensión supera 440 kV en barras colectoras. (REE, p.5)',
      'Massive overvoltage propagation through the south and west. Badajoz (730 MW), Seville (550 MW) and other PV plants cascade down. Voltage exceeds 440 kV at collector busbars. (REE, p.5)',
      'Propagação de sobretensões. Badajoz (730 MW) e Sevilha (550 MW) desconectam. Tensão >440 kV nas barras.',
      'Propagation de surtensions. Badajoz (730 MW), Séville (550 MW) et autres FV tombent. Tension >440 kV.',
      'Propagazione di sovratensioni. Badajoz (730 MW), Siviglia (550 MW) e altri FV cadono. Tensione >440 kV.',
      'Überspannungsausbreitung. Badajoz (730 MW), Sevilla (550 MW) und andere PV-Anlagen fallen. >440 kV.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't7') {
    title = t('Pérdida de Sincronismo ES-FR (12:33:21 CEST)','Loss of Synchronism ES-FR (12:33:21 CEST)',
      'Perda de Sincronismo ES-FR (12:33:21 CEST)','Perte de Synchronisme ES-FR (12:33:21 CEST)',
      'Perdita di Sincronismo ES-FR (12:33:21 CEST)','Verlust des Synchronismus ES-FR (12:33:21 CEST)');
    desc = t(
      'Las interconexiones AC alcanzan un pico transitorio de ~3.800 MW @ 12:33:19 CEST. Las protecciones ANSI 78 abren los enlaces a 48,46 Hz. El HVDC INELFE-1 mantuvo 1.000 MW de exportación ES→FR hasta las 12:33:24. (ENTSO-E Factual, pp.108-109)',
      'AC interconnections reach a transient peak of ~3,800 MW @ 12:33:19 CEST. ANSI 78 protections open at 48.46 Hz. HVDC INELFE-1 maintained 1,000 MW ES→FR export until 12:33:24. (ENTSO-E Factual, pp.108-109)',
      'Interconexões AC atingem pico transitório ~3.800 MW. ANSI 78 abre a 48,46 Hz. HVDC manteve 1.000 MW exportação até 12:33:24.',
      'Interconnexions CA: pic transitoire ~3 800 MW. ANSI 78 ouvre à 48,46 Hz. HVDC maintient 1 000 MW export jusqu\'à 12h33:24.',
      'Interconnessioni CA: picco transitorio ~3.800 MW. ANSI 78 apre a 48,46 Hz. HVDC mantiene 1.000 MW export fino a 12:33:24.',
      'AC-Verbindungen: transienter Spitzenwert ~3.800 MW. ANSI 78 öffnet bei 48,46 Hz. HVDC hält 1.000 MW Export bis 12:33:24.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't8') {
    title = t('Cero Eléctrico — Blackout (12:33:27 CEST)','System Blackout (12:33:27 CEST)',
      'Zero Elétrico — Blackout (12:33:27 CEST)','Zéro Électrique — Blackout (12:33:27 CEST)',
      'Zero Elettrico — Blackout (12:33:27 CEST)','System-Blackout (12:33:27 CEST)');
    desc = t(
      'Pérdida total de ~15 GW de generación en 30 segundos. Cero de tensión sistémico. El sistema ibérico interrumpe 25,2 GW de demanda peninsular española, afectando a ~60 millones de personas.',
      'Total loss of ~15 GW of generation in 30 seconds. Systemic voltage zero. The Iberian system interrupts 25.2 GW of Spanish peninsular demand, affecting ~60 million people.',
      'Perda total de ~15 GW em 30 segundos. Zero de tensão. O sistema ibérico interrompe 25,2 GW afetando ~60 milhões.',
      'Perte totale de ~15 GW en 30 secondes. Zéro de tension. Le système ibérique interrompt 25,2 GW affectant ~60 millions.',
      'Perdita totale di ~15 GW in 30 secondi. Zero di tensione. Il sistema iberico interrompe 25,2 GW colpendo ~60 milioni.',
      'Totaler Verlust von ~15 GW in 30 Sekunden. Spannungsnull. Das iberische System unterbricht 25,2 GW und betrifft ~60 Millionen.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't9') {
    title = t('Fragmentación e Intentos Bottom-Up (Fase 4)','Fragmentation & Bottom-Up Attempts (Phase 4)',
      'Fragmentação e Tentativas Bottom-Up (Fase 4)','Fragmentation et Tentatives Bottom-Up (Phase 4)',
      'Frammentazione e Tentativi Bottom-Up (Fase 4)','Fragmentierung & Bottom-Up Versuche (Phase 4)');
    desc = t(
      'División en 7 islas eléctricas. Múltiples intentos fallidos de Black Start desde centrales hidroeléctricas sin suficiente masa síncrona para sostener la isla.',
      'Division into 7 electrical islands. Multiple failed Black Start attempts from hydro plants without sufficient synchronous mass.',
      'Divisão em 7 ilhas elétricas. Múltiplas tentativas falhadas de Black Start.',
      'Division en 7 îlots électriques. Multiples tentatives de Black Start échouées.',
      'Divisione in 7 isole elettriche. Molteplici tentativi di Black Start falliti.',
      'Aufteilung in 7 elektrische Inseln. Mehrere fehlgeschlagene Schwarzstartversuche.',
    );
    dateStr = t('28 de abril de 2025','April 28, 2025','28 de abril de 2025','28 avril 2025','28 aprile 2025','28. April 2025');

  } else if (event.id === 't10') {
    title = t('Reposición Completa de la Demanda','Full Demand Restoration',
      'Reposição Completa da Demanda','Restauration Complète de la Demande',
      'Ripristino Completo della Domanda','Vollständige Wiederherstellung der Nachfrage');
    desc = t(
      'Tras ~18,5 horas de maniobras Top-Down (Francia/Marruecos) y Bottom-Up (hidráulica), el 99,95% de la demanda peninsular se recupera antes de las 07:00 del 29 de abril. (ENTSO-E Factual, pp.12-13)',
      'After ~18.5 hours of Top-Down (France/Morocco) and Bottom-Up (hydro) restoration, 99.95% of peninsular demand is recovered before 07:00 on April 29. (ENTSO-E Factual, pp.12-13)',
      'Após ~18,5 horas de manobras, 99,95% da demanda é recuperada antes das 07:00 do dia 29.',
      'Après ~18,5 heures de manœuvres, 99,95% de la demande est récupérée avant 07h00 le 29.',
      'Dopo ~18,5 ore di manovre, il 99,95% della domanda viene recuperato prima delle 07:00 del 29.',
      'Nach ~18,5 Stunden werden 99,95% der Nachfrage vor 07:00 Uhr am 29. April wiederhergestellt.',
    );
    dateStr = t('29 de abril de 2025','April 29, 2025','29 de abril de 2025','29 avril 2025','29 aprile 2025','29. April 2025');
  }

  return { title, desc, dateStr };
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VerticalTimeline({
  lang           = 'es',
  activeEventId  = null,
  onEventClick   = null,
  compact        = false,
}) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const isEs = lang === 'es' || !['en','pt','fr','it','de'].includes(lang);

  // Filtrar eventos por categoría
  const filteredEvents = useMemo(() => {
    if (activeFilter === 'todos') return timelineEvents;
    return timelineEvents.filter(e =>
      (e.category || 'electrico') === activeFilter
    );
  }, [activeFilter]);

  // Progreso: porcentaje de eventos visibles
  const progressPct = Math.round((filteredEvents.length / timelineEvents.length) * 100);

  const handleKeyDown = (e, eventId) => {
    if ((e.key === 'Enter' || e.key === ' ') && onEventClick) {
      e.preventDefault();
      onEventClick(eventId);
    }
  };

  return (
    <div>
      {/* ── Filtros de categoría ─────────────────────────────── */}
      <div
        role="group"
        aria-label={isEs ? 'Filtrar por tipo de evento' : 'Filter by event type'}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          marginBottom: '1.5rem', alignItems: 'center',
        }}
      >
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const isActive = activeFilter === key;
          const label = cat[lang] || cat.es;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              aria-pressed={isActive}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 20,
                border: `1px solid ${isActive ? cat.color : 'rgba(255,255,255,0.12)'}`,
                background: isActive ? `${cat.color}22` : 'transparent',
                color: isActive ? cat.color : '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: isActive ? 700 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </button>
          );
        })}

        {/* Barra de progreso */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 120, height: 4,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPct}%`, height: '100%',
              background: 'var(--ifm-color-primary)',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--text-1, #64748b)', fontFamily: 'monospace' }}>
            {filteredEvents.length}/{timelineEvents.length}
          </span>
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div
        className={styles.timelineContainer}
        role="list"
        aria-label={isEs ? 'Línea de tiempo del apagón ibérico del 28-A' : '28-A blackout timeline'}
      >
        {filteredEvents.map((event, index) => {
          const alignmentClass = index % 2 === 0 ? styles.leftEvent : styles.rightEvent;

          let typeColor = 'var(--ifm-color-primary)';
          if (event.type === 'warning')  typeColor = '#f39c12';
          if (event.type === 'danger')   typeColor = '#e74c3c';
          if (event.type === 'critical') typeColor = '#c0392b';
          if (event.type === 'success')  typeColor = '#27ae60';

          const loc       = getLocalizedEvent(event, lang);
          const isActive  = activeEventId === event.id;
          const isClickable = typeof onEventClick === 'function';

          return (
            <div
              key={event.id}
              role="listitem"
              className={`${styles.timelineBlock} ${alignmentClass} ${isActive ? styles.activeEvent : ''}`}
              onClick={isClickable ? () => onEventClick(event.id) : undefined}
              onKeyDown={isClickable ? (e) => handleKeyDown(e, event.id) : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-current={isActive ? 'true' : undefined}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div
                aria-hidden="true"
                className={`${styles.timelineDot} ${isActive ? styles.activeDot : ''}`}
                style={{
                  backgroundColor: typeColor,
                  boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 0 8px ${typeColor}33`,
                }}
              />

              <div
                className={styles.timelineContent}
                style={{ borderTop: `4px solid ${typeColor}` }}
              >
                <div className={styles.timeBadge}>
                  {loc.dateStr} {event.time ? `• ${event.time}` : ''}
                </div>
                <h3 className={styles.eventTitle}>{loc.title}</h3>
                {!compact && (
                  <p className={styles.eventDesc}>{loc.desc}</p>
                )}
                {/* Badge de categoría */}
                {event.category && event.category !== 'electrico' && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: 6,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 10,
                    fontSize: 10,
                    fontFamily: 'monospace',
                    background: `${CATEGORIES[event.category]?.color || '#94a3b8'}22`,
                    color: CATEGORIES[event.category]?.color || '#94a3b8',
                    border: `1px solid ${CATEGORIES[event.category]?.color || '#94a3b8'}44`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}>
                    {CATEGORIES[event.category]?.[lang] || CATEGORIES[event.category]?.es || event.category}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--text-1, #64748b)', fontFamily: 'monospace', fontSize: 13 }}>
          {isEs ? 'No hay eventos en esta categoría.' : 'No events in this category.'}
        </p>
      )}
    </div>
  );
}
