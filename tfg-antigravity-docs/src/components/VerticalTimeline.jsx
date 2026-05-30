/**
 * VerticalTimeline.jsx
 * Línea de tiempo vertical interactiva del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATO CRÍTICO — t7 (Pérdida de Sincronismo ES-FR):
 *    La versión anterior citaba ">4.600 MW" como importación de emergencia.
 *    Ese valor está marcado como CUESTIÓN ABIERTA en datos28A.json y no
 *    aparece en fuente primaria verificada.
 *    Valor verificado: pico transitorio AC de 3.800 MW @ 12:33:19 CEST
 *    (ENTSO-E Factual, pp.108-109).
 *    El HVDC INELFE mantuvo 1.000 MW de EXPORTACIÓN (no importación).
 *
 * 2. ACCESIBILIDAD — div clickable:
 *    Los bloques de timeline con onClick se convierten en elementos
 *    navegables por teclado mediante onKeyDown (Enter/Space) y tabIndex.
 *    Los puntos decorativos tienen aria-hidden.
 *
 * 3. SEMÁNTICA — role="list" en el contenedor:
 *    El contenedor de eventos es una lista cronológica, no un div genérico.
 */
import React from 'react';
import styles from './VerticalTimeline.module.css';
import { timelineEvents } from '../data/timelineData';

export default function VerticalTimeline({
  lang = 'es',
  activeEventId = null,
  onEventClick = null,
}) {
  const getLocalizedEvent = (event, l) => {
    const t = (es, en, pt, fr, it, de) =>
      ({ es, en, pt, fr, it, de }[l] || es);

    let title   = event.title_es;
    let desc    = event.desc_es;
    let dateStr = event.date;

    if (event.id === 't1') {
      title = t(
        'Eventos Precursores en Núñez de Balboa',
        'Precursor Events at Núñez de Balboa',
        'Eventos Precursores em Núñez de Balboa',
        'Événements Précurseurs à Núñez de Balboa',
        'Eventi Precursori a Núñez de Balboa',
        'Vorläuferereignisse in Núñez de Balboa',
      );
      desc = t(
        'Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.',
        'Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.',
        'Registram-se oscilações de tensão que provocam disparos idênticos aos que ocorreriam no 28-A, evidenciando o estreitamento das margens de reativa.',
        'Des oscillations de tension sont enregistrées, provoquant des déclenchements identiques à ceux qui se produiraient le 28 avril, mettant en évidence le rétrécissement des marges réactives.',
        'Si registrano oscillazioni di tensione che provocano scatti identici a quelli che si verificherebbero il 28 aprile, evidenziando il restringimento dei margini di reattiva.',
        'Es werden Spannungsschwankungen aufgezeichnet, die identische Auslösungen wie am 28. April verursachen und die Verengung der Blindleistungsmargen belegen.',
      );
      dateStr = t('22 de abril de 2025', 'April 22, 2025', '22 de abril de 2025', '22 avril 2025', '22 aprile 2025', '22. April 2025');

    } else if (event.id === 't2') {
      title = t(
        'Transición de Control en HVDC INELFE-1',
        'Control Transition in INELFE-1 HVDC',
        'Transição de Controle em HVDC INELFE-1',
        'Transition de Contrôle dans HVDC INELFE-1',
        'Transizione di Controllo in HVDC INELFE-1',
        'Steuerungsübergang in HVDC INELFE-1',
      );
      desc = t(
        'Paso de PMODE3 a PMODE1 (~12:08 CEST), limitando la capacidad de respuesta dinámica del enlace frente a perturbaciones posteriores. En PMODE1 el enlace mantiene potencia constante (1.000 MW de exportación ES→FR) sin responder a la frecuencia.',
        'Transition from PMODE3 to PMODE1 (~12:08 CEST), limiting the dynamic response of the link against subsequent disturbances. In PMODE1 the link maintains constant power (1,000 MW export ES→FR) without responding to frequency.',
        'Passagem do PMODE3 para PMODE1 (~12:08 CEST), limitando a capacidade de resposta dinâmica da ligação. Em PMODE1 o elo mantém potência constante (1.000 MW exportação ES→FR) sem responder à frequência.',
        'Passage du PMODE3 au PMODE1 (~12h08 CEST), limitant la capacité de réponse dynamique de la liaison. En PMODE1, la liaison maintient une puissance constante (1 000 MW d\'export ES→FR) sans répondre à la fréquence.',
        'Passaggio da PMODE3 a PMODE1 (~12:08 CEST), limitando la capacità di risposta dinamica del collegamento. In PMODE1 il collegamento mantiene potenza costante (1.000 MW esportazione ES→FR) senza rispondere alla frequenza.',
        'Übergang von PMODE3 zu PMODE1 (~12:08 CEST), was die dynamische Reaktionsfähigkeit der Verbindung einschränkt. Im PMODE1 hält der Link konstante Leistung (1.000 MW Export ES→FR) ohne auf Frequenz zu reagieren.',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't3') {
      title = t(
        'Déficit de Potencia Reactiva (Fase 1)',
        'Reactive Power Deficit (Phase 1)',
        'Déficit de Potência Reativa (Fase 1)',
        'Déficit de Puissance Réactive (Phase 1)',
        'Deficit di Potenza Reattiva (Fase 1)',
        'Blindleistungsdefizit (Phase 1)',
      );
      desc = t(
        'Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de absorción reactiva.',
        'Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net reactive absorption deficit.',
        'As manobras de malhagem (LIN&SHN) reduzem a margem de colapso em 57% na zona sul, gerando um déficit líquido de absorção reativa.',
        'Les manœuvres de maillage (LIN&SHN) réduisent la marge d\'effondrement de 57 % dans la zone sud, générant un déficit net d\'absorption réactive.',
        'Le manovre di magliatura (LIN&SHN) riducono il margine di collasso del 57% nella zona sud, generando un deficit netto di assorbimento reattivo.',
        'Vermaschungsmanöver (LIN&SHN) reduzieren die Kollapsmarge im Süden um 57 % und erzeugen ein Netto-Blindleistungsabsorptionsdefizit.',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't4') {
      title = t(
        'Amplificación Tap-Lag (Fase 2)',
        'Tap-Lag Amplification (Phase 2)',
        'Amplificação Tap-Lag (Fase 2)',
        'Amplification Tap-Lag (Phase 2)',
        'Amplificazione Tap-Lag (Fase 2)',
        'Tap-Lag-Verstärkung (Phase 2)',
      );
      desc = t(
        'Desacoplamiento entre la red de 400 kV (observada por REE) y las redes colectoras renovables, donde la tensión escala silenciosamente hasta superar los umbrales HVRT.',
        'Decoupling between the 400 kV grid (observed by REE) and renewable collector grids, where voltage scales silently until exceeding HVRT thresholds.',
        'Desacoplamento entre a rede de 400 kV (observada pela REE) e as redes coletoras renováveis, onde a tensão aumenta silenciosamente até superar os limites HVRT.',
        'Découplage entre le réseau 400 kV (observé par REE) et les réseaux collecteurs renouvelables, où la tension augmente silencieusement jusqu\'à dépasser les seuils HVRT.',
        'Disaccoppiamento tra la rete a 400 kV (osservata da REE) e le reti collettrici rinnovabili, dove la tensione sale silenziosamente fino a superare le soglie HVRT.',
        'Entkopplung zwischen dem 400-kV-Netz (von REE beobachtet) und den erneuerbaren Kollektornetzen, wo die Spannung unbemerkt bis über HVRT-Schwellenwerte ansteigt.',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't5') {
      title = t(
        'Disparo Raíz en Granada (12:32:57 CEST)',
        'Root Trip in Granada (12:32:57 CEST)',
        'Disparo Raiz em Granada (12:32:57 CEST)',
        'Déclenchement Racine à Grenade (12:32:57 CEST)',
        'Scatto Radice a Granada (12:32:57 CEST)',
        'Wurzelauslösung in Granada (12:32:57 CEST)',
      );
      desc = t(
        'El secundario colector de 220 kV alcanza ~242 kV (>1,10 p.u.), activando la protección ANSI 59 del transformador 400/220 kV. Pérdida de −355 MW activos y −165 MVAr de absorción reactiva. (ENTSO-E Factual, p.28)',
        '220 kV collector secondary reaches ~242 kV (>1.10 p.u.), triggering ANSI 59 protection on the 400/220 kV transformer. Loss of −355 MW active and −165 MVAr reactive absorption. (ENTSO-E Factual, p.28)',
        'O secundário coletor 220 kV atinge ~242 kV (>1,10 p.u.), ativando a proteção ANSI 59. Perda de −355 MW ativos e −165 MVAr de absorção reativa. (ENTSO-E Factual, p.28)',
        'Le secondaire collecteur 220 kV atteint ~242 kV (>1,10 p.u.), activant la protection ANSI 59. Perte de −355 MW actifs et −165 MVAr d\'absorption réactive. (ENTSO-E Factual, p.28)',
        'Il secondario collettore 220 kV raggiunge ~242 kV (>1,10 p.u.), attivando la protezione ANSI 59. Perdita di −355 MW attivi e −165 MVAr di assorbimento reattivo. (ENTSO-E Factual, p.28)',
        'Der 220-kV-Kollektor-Sekundärkreis erreicht ~242 kV (>1,10 p.u.) und löst ANSI-59-Schutz aus. Verlust von −355 MW Wirkleistung und −165 MVAr Blindleistungsaufnahme. (ENTSO-E Factual, S.28)',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't6') {
      title = t(
        'Inicio de Cascada Geométrica (Fase 3)',
        'Onset of Geometric Cascade (Phase 3)',
        'Início da Cascata Geométrica (Fase 3)',
        'Début de la Cascade Géométrique (Phase 3)',
        'Inizio della Cascata Geometrica (Fase 3)',
        'Beginn der geometrischen Kaskade (Phase 3)',
      );
      desc = t(
        'Propagación masiva de sobretensiones por el sur y oeste peninsular. Caída en cadena: Badajoz (730 MW), Sevilla (550 MW) y otras plantas fotovoltaicas. La tensión supera los 440 kV en barras colectoras. (REE, p.5)',
        'Massive propagation of overvoltages through the southern and western peninsula. Chain disconnection: Badajoz (730 MW), Seville (550 MW) and other PV plants. Voltage exceeds 440 kV at collector busbars. (REE, p.5)',
        'Propagação massiva de sobretensões pelo sul e oeste peninsular. Desconexão em cadeia: Badajoz (730 MW), Sevilha (550 MW) e outras usinas FV. Tensão supera 440 kV nas barras coletoras. (REE, p.5)',
        'Propagation massive de surtensions dans le sud et l\'ouest de la péninsule. Déconnexion en chaîne : Badajoz (730 MW), Séville (550 MW) et autres centrales PV. La tension dépasse 440 kV aux jeux de barres collecteurs. (REE, p.5)',
        'Propagazione massiccia di sovratensioni nel sud e nell\'ovest della penisola. Disconnessione a catena: Badajoz (730 MW), Siviglia (550 MW) e altri impianti FV. La tensione supera 440 kV alle sbarre collettrici. (REE, p.5)',
        'Massive Ausbreitung von Überspannungen über Süd- und Westspanien. Kettenabschaltung: Badajoz (730 MW), Sevilla (550 MW) und weitere PV-Anlagen. Spannung überschreitet 440 kV an Kollektorsammelschienen. (REE, S.5)',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't7') {
      title = t(
        'Pérdida de Sincronismo ES-FR (12:33:21 CEST)',
        'Loss of Synchronism ES-FR (12:33:21 CEST)',
        'Perda de Sincronismo ES-FR (12:33:21 CEST)',
        'Perte de Synchronisme ES-FR (12:33:21 CEST)',
        'Perdita di Sincronismo ES-FR (12:33:21 CEST)',
        'Verlust des Synchronismus ES-FR (12:33:21 CEST)',
      );
      // CORRECCIÓN CRÍTICA: 4.600 MW → 3.800 MW (pico transitorio AC verificado)
      // Fuente: ENTSO-E Factual, pp.108-109
      // El HVDC INELFE mantuvo 1.000 MW de EXPORTACIÓN (no importación)
      desc = t(
        'Las interconexiones AC con Francia alcanzan un pico transitorio de ~3.800 MW a las 12:33:19 CEST. Las protecciones de pérdida de sincronismo (ANSI 78) abren los enlaces a los 48,46 Hz. El HVDC INELFE-1 mantuvo 1.000 MW de exportación ES→FR hasta las 12:33:24. (ENTSO-E Factual, pp.108-109)',
        'AC interconnections with France reach a transient peak of ~3,800 MW at 12:33:19 CEST. Loss-of-synchronism protections (ANSI 78) open links at 48.46 Hz. HVDC INELFE-1 maintained 1,000 MW of ES→FR export until 12:33:24. (ENTSO-E Factual, pp.108-109)',
        'As interconexões AC com a França atingem um pico transitório de ~3.800 MW às 12:33:19 CEST. As proteções de perda de sincronismo (ANSI 78) abrem os elos a 48,46 Hz. O HVDC INELFE-1 manteve 1.000 MW de exportação ES→FR até às 12:33:24. (ENTSO-E Factual, pp.108-109)',
        'Les interconnexions CA avec la France atteignent un pic transitoire de ~3 800 MW à 12h33:19 CEST. Les protections de perte de synchronisme (ANSI 78) ouvrent les liaisons à 48,46 Hz. Le HVDC INELFE-1 a maintenu 1 000 MW d\'export ES→FR jusqu\'à 12h33:24. (ENTSO-E Factual, pp.108-109)',
        'Le interconnessioni CA con la Francia raggiungono un picco transitorio di ~3.800 MW alle 12:33:19 CEST. Le protezioni di perdita del sincronismo (ANSI 78) aprono i collegamenti a 48,46 Hz. L\'HVDC INELFE-1 ha mantenuto 1.000 MW di esportazione ES→FR fino alle 12:33:24. (ENTSO-E Factual, pp.108-109)',
        'AC-Verbindungen mit Frankreich erreichen um 12:33:19 CEST einen transienten Spitzenwert von ~3.800 MW. Synchronismusverlustschutz (ANSI 78) öffnet Leitungen bei 48,46 Hz. HVDC INELFE-1 hielt 1.000 MW ES→FR-Export bis 12:33:24. (ENTSO-E Factual, S.108-109)',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't8') {
      title = t(
        'Cero Eléctrico — Blackout (12:33:27 CEST)',
        'System Blackout (12:33:27 CEST)',
        'Zero Elétrico — Blackout (12:33:27 CEST)',
        'Zéro Électrique — Blackout (12:33:27 CEST)',
        'Zero Elettrico — Blackout (12:33:27 CEST)',
        'System-Blackout (12:33:27 CEST)',
      );
      desc = t(
        'Pérdida total de ~15 GW de generación. Cero de tensión sistémico. El sistema ibérico queda desenergizado en 30 segundos, interrumpiendo 25,2 GW de demanda peninsular española y afectando a ~60 millones de personas.',
        'Total loss of ~15 GW of generation. Systemic voltage zero. The Iberian system is de-energized in 30 seconds, interrupting 25.2 GW of Spanish peninsular demand and affecting ~60 million people.',
        'Perda total de ~15 GW de geração. Zero de tensão sistémico. O sistema ibérico é desenergizado em 30 segundos, interrompendo 25,2 GW de demanda peninsular espanhola e afetando ~60 milhões de pessoas.',
        'Perte totale de ~15 GW de production. Zéro de tension systémique. Le système ibérique est mis hors tension en 30 secondes, interrompant 25,2 GW de demande péninsulaire espagnole et affectant ~60 millions de personnes.',
        'Perdita totale di ~15 GW di generazione. Zero di tensione sistemico. Il sistema iberico viene diseccitato in 30 secondi, interrompendo 25,2 GW di domanda peninsulare spagnola e colpendo ~60 milioni di persone.',
        'Totaler Verlust von ~15 GW Erzeugung. Systemweiter Spannungsnullpunkt. Das iberische System wird in 30 Sekunden stromlos, unterbricht 25,2 GW spanische Halbinselnachfrage und betrifft ~60 Millionen Menschen.',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't9') {
      title = t(
        'Fragmentación e Intentos Bottom-Up (Fase 4)',
        'Fragmentation & Bottom-Up Attempts (Phase 4)',
        'Fragmentação e Tentativas Bottom-Up (Fase 4)',
        'Fragmentation et Tentatives Bottom-Up (Phase 4)',
        'Frammentazione e Tentativi Bottom-Up (Fase 4)',
        'Fragmentierung & Bottom-Up Versuche (Phase 4)',
      );
      desc = t(
        'División en 7 islas eléctricas. Múltiples intentos fallidos de energización autónoma (Black Start) desde centrales hidroeléctricas sin suficiente masa síncrona para sostener la isla.',
        'Division into 7 electrical islands. Multiple failed autonomous energization attempts (Black Start) from hydro plants without sufficient synchronous mass to sustain the island.',
        'Divisão em 7 ilhas elétricas. Múltiplas tentativas falhadas de energização autônoma (Black Start) a partir de hidrelétricas sem massa síncrona suficiente.',
        'Division en 7 îlots électriques. Multiples tentatives d\'énergisation autonome (Black Start) échouées à partir de centrales hydroélectriques sans masse synchrone suffisante.',
        'Divisione in 7 isole elettriche. Molteplici tentativi falliti di energizzazione autonoma (Black Start) da centrali idroelettriche senza massa sincrona sufficiente.',
        'Aufteilung in 7 elektrische Inseln. Mehrere fehlgeschlagene autonome Energisierungsversuche (Schwarzstart) von Wasserkraftwerken ohne ausreichende synchrone Masse.',
      );
      dateStr = t('28 de abril de 2025', 'April 28, 2025', '28 de abril de 2025', '28 avril 2025', '28 aprile 2025', '28. April 2025');

    } else if (event.id === 't10') {
      title = t(
        'Reposición Completa de la Demanda',
        'Full Demand Restoration',
        'Reposição Completa da Demanda',
        'Restauration Complète de la Demande',
        'Ripristino Completo della Domanda',
        'Vollständige Wiederherstellung der Nachfrage',
      );
      desc = t(
        'Tras ~18,5 horas de maniobras de restitución Top-Down desde Francia/Marruecos y Bottom-Up desde hidráulica, el 99,95% de la demanda peninsular se recupera antes de las 07:00 del 29 de abril. (ENTSO-E Factual, pp.12-13)',
        'After ~18.5 hours of Top-Down restoration maneuvers from France/Morocco and Bottom-Up from hydro, 99.95% of peninsular demand is recovered before 07:00 on April 29. (ENTSO-E Factual, pp.12-13)',
        'Após ~18,5 horas de manobras Top-Down a partir de França/Marrocos e Bottom-Up a partir de hídricas, 99,95% da demanda peninsular é recuperada antes das 07:00 do dia 29 de abril. (ENTSO-E Factual, pp.12-13)',
        'Après ~18,5 heures de manœuvres de restauration Top-Down depuis la France/le Maroc et Bottom-Up depuis l\'hydraulique, 99,95% de la demande péninsulaire est récupérée avant 07h00 le 29 avril. (ENTSO-E Factual, pp.12-13)',
        'Dopo ~18,5 ore di manovre di ripristino Top-Down da Francia/Marocco e Bottom-Up dall\'idroelettrico, il 99,95% della domanda peninsulare viene recuperato prima delle 07:00 del 29 aprile. (ENTSO-E Factual, pp.12-13)',
        'Nach ~18,5 Stunden Top-Down-Wiederherstellungsmanövern aus Frankreich/Marokko und Bottom-Up aus Wasserkraft werden 99,95% der Halbinselnachfrage vor 07:00 Uhr am 29. April wiederhergestellt. (ENTSO-E Factual, S.12-13)',
      );
      dateStr = t('29 de abril de 2025', 'April 29, 2025', '29 de abril de 2025', '29 avril 2025', '29 aprile 2025', '29. April 2025');
    }

    return { title, desc, dateStr };
  };

  // ── Manejador de teclado para accesibilidad ───────────────────────────────
  const handleKeyDown = (e, eventId) => {
    if ((e.key === 'Enter' || e.key === ' ') && onEventClick) {
      e.preventDefault();
      onEventClick(eventId);
    }
  };

  return (
    <div className={styles.timelineContainer} role="list">
      {timelineEvents.map((event, index) => {
        const alignmentClass = index % 2 === 0 ? styles.leftEvent : styles.rightEvent;

        let typeColor = 'var(--ifm-color-primary)';
        if (event.type === 'warning')  typeColor = '#f39c12';
        if (event.type === 'danger')   typeColor = '#e74c3c';
        if (event.type === 'critical') typeColor = '#c0392b';
        if (event.type === 'success')  typeColor = '#27ae60';

        const loc      = getLocalizedEvent(event, lang);
        const isActive = activeEventId === event.id;
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
                {loc.dateStr} • {event.time}
              </div>
              <h3 className={styles.eventTitle}>{loc.title}</h3>
              <p className={styles.eventDesc}>{loc.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
