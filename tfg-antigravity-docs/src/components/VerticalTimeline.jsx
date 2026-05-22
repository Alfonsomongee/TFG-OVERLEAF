import React from 'react';
import styles from './VerticalTimeline.module.css';
import { timelineEvents } from '../data/timelineData';

export default function VerticalTimeline({ lang = 'es' }) {
  const getLocalizedEvent = (event, l) => {
    const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[l] || es);
    
    let title = event.title_es;
    let desc = event.desc_es;
    let dateStr = event.date;

    if (event.id === "t1") {
      title = t("Eventos Precursores en Núñez de Balboa", "Precursor Events at Núñez de Balboa", "Eventos Precursores em Núñez de Balboa", "Événements Précurseurs à Núñez de Balboa", "Eventi Precursori a Núñez de Balboa", "Vorläuferereignisse in Núñez de Balboa");
      desc = t("Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.", "Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.", "Registram-se oscilações de tensão que provocam disparos idênticos aos que ocorreriam no 28-A, evidenciando o estreitamento das margens de reativa.", "Des oscillations de tension sont enregistrées, provoquant des déclenchements identiques à ceux qui se produiraient le 28 avril, mettant en évidence le rétrécissement des marges réactives.", "Si registrano oscillazioni di tensione che provocano scatti identici a quelli che si verificherebbero il 28 aprile, evidenziando il restringimento dei margini di reattiva.", "Es werden Spannungsschwankungen aufgezeichnet, die identische Auslösungen wie am 28. April verursachen und die Verengung der Blindleistungsmargen belegen.");
      dateStr = t("22 de abril de 2025", "April 22, 2025", "22 de abril de 2025", "22 avril 2025", "22 aprile 2025", "22. April 2025");
    } else if (event.id === "t2") {
      title = t("Transición de Control en HVDC INELFE-1", "Control Transition in INELFE-1 HVDC", "Transição de Controle em HVDC INELFE-1", "Transition de Contrôle dans HVDC INELFE-1", "Transizione di Controllo in HVDC INELFE-1", "Steuerungsübergang in HVDC INELFE-1");
      desc = t("Paso de PMODE3 a PMODE1, limitando la capacidad de respuesta dinámica del enlace frente a perturbaciones posteriores.", "Transition from PMODE3 to PMODE1, limiting the dynamic response capacity of the link against subsequent disturbances.", "Passagem do PMODE3 para PMODE1, limitando a capacidade de resposta dinâmica da ligação perante perturbações posteriores.", "Passage du PMODE3 au PMODE1, limitant la capacité de réponse dynamique de la liaison face aux perturbations ultérieures.", "Passaggio da PMODE3 a PMODE1, limitando la capacità di risposta dinamica del collegamento a fronte di perturbazioni successive.", "Übergang von PMODE3 zu PMODE1, was die dynamische Reaktionsfähigkeit der Verbindung bei nachfolgenden Störungen einschränkt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t3") {
      title = t("Déficit de Potencia Reactiva (Fase 1)", "Reactive Power Deficit (Phase 1)", "Déficit de Potência Reativa (Fase 1)", "Déficit de Puissance Réactive (Phase 1)", "Deficit di Potenza Reattiva (Fase 1)", "Blindleistungsdefizit (Phase 1)");
      desc = t("Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de absorción.", "Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net absorption deficit.", "As manobras de malhagem (LIN&SHN) reduzem a margem de colapso em 57% na zona sul, gerando um déficit líquido de absorção.", "Les manœuvres de maillage (LIN&SHN) réduisent la marge d'effondrement de 57% dans la zone sud, générant un déficit net d'absorption.", "Le manovre di magliatura (LIN&SHN) riducono il margine di collasso del 57% nella zona sud, generando un deficit netto di assorbimento.", "Vermaschungsmanöver (LIN&SHN) reduzieren die Kollapsmarge im Süden um 57% und erzeugen ein Netto-Absorptionsdefizit.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t4") {
      title = t("Amplificación Tap-Lag (Fase 2)", "Tap-Lag Amplification (Phase 2)", "Amplificação Tap-Lag (Fase 2)", "Amplification Tap-Lag (Phase 2)", "Amplificazione Tap-Lag (Fase 2)", "Tap-Lag-Verstärkung (Phase 2)");
      desc = t("Desacoplamiento entre la red de 400 kV (observada por REE) y las redes colectoras renovables, donde la tensión escala silenciosamente.", "Decoupling between the 400 kV grid (observed by REE) and renewable collector grids, where voltage scales silently.", "Desacoplamento entre a rede de 400 kV (observada pela REE) e as redes coletoras renováveis, onde a tensão aumenta silenciosamente.", "Découplage entre le réseau 400 kV (observé par REE) et les réseaux collecteurs renouvelables, où la tension augmente silencieusement.", "Disaccoppiamento tra la rete a 400 kV (osservata da REE) e le reti collettrici rinnovabili, dove la tensione sale silenziosamente.", "Entkopplung zwischen dem 400-kV-Netz (von REE beobachtet) und den erneuerbaren Kollektornetzen, wo die Spannung unbemerkt ansteigt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t5") {
      title = t("Disparo Raíz en Granada", "Root Trip in Granada", "Disparo Raiz em Granada", "Déclenchement Racine à Grenade", "Scatto Radice a Granada", "Wurzelauslösung in Granada");
      desc = t("El secundario colector alcanza ~145 kV (>1,10 p.u.), desencadenando la primera protección por sobretensión de inversores solares.", "Collector secondary reaches ~145 kV (>1.10 p.u.), triggering the first overvoltage protection of solar inverters.", "O secundário coletor atinge ~145 kV (>1,10 p.u.), desencadeando a primeira proteção por sobretensão dos inversores solares.", "Le secondaire collecteur atteint ~145 kV (>1,10 p.u.), déclenchant la première protection contre les surtensions des onduleurs solaires.", "Il secondario collettore raggiunge ~145 kV (>1,10 p.u.), innescando la prima protezione da sovratensione degli inverter solari.", "Der Kollektor-Sekundärkreis erreicht ~145 kV (>1,10 p.u.) und löst den ersten Überspannungsschutz der Solar-Wechselrichter aus.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t6") {
      title = t("Inicio de Cascada Geométrica (Fase 3)", "Onset of Geometric Cascade (Phase 3)", "Início da Cascata Geométrica (Fase 3)", "Début de la Cascade Géométrique (Phase 3)", "Inizio della Cascata Geometrica (Fase 3)", "Beginn der geometrischen Kaskade (Phase 3)");
      desc = t("Propagación masiva de sobretensiones por el sur y oeste peninsular, provocando la desconexión en cadena de plantas fotovoltaicas.", "Massive propagation of overvoltages through the southern and western peninsula, causing a chain disconnection of PV plants.", "Propagação massiva de sobretensões pelo sul e oeste peninsular, provocando a desconexão em cadeia de usinas fotovoltaicas.", "Propagation massive de surtensions dans le sud et l'ouest de la péninsule, provoquant la déconnexion en chaîne des centrales photovoltaïques.", "Propagazione massiccia di sovratensioni nel sud e nell'ovest della penisola, provocando la disconnessione a catena degli impianti fotovoltaici.", "Massive Ausbreitung von Überspannungen über die südliche und westliche Halbinsel, was zu einer Kettenabschaltung von PV-Anlagen führt.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t7") {
      title = t("Pérdida de Sincronismo ES-FR", "Loss of Synchronism ES-FR", "Perda de Sincronismo ES-FR", "Perte de Synchronisme ES-FR", "Perdita di Sincronismo ES-FR", "Verlust des Synchronismus ES-FR");
      desc = t("La oscilación de potencia y la importación de emergencia (>4.600 MW) fuerzan la apertura de la interconexión con Francia.", "Power oscillation and emergency import (>4,600 MW) force the opening of the interconnection with France.", "A oscilação de potência e a importação de emergência (>4.600 MW) forçam a abertura da interconexão com a França.", "L'oscillation de puissance et l'importation d'urgence (>4 600 MW) forcent l'ouverture de l'interconnexion avec la France.", "L'oscillazione di potenza e l'importazione di emergenza (>4.600 MW) costringono l'apertura dell'interconnessione con la Francia.", "Die Leistungsschwankung und der Notimport (>4.600 MW) erzwingen die Öffnung der Verbindung mit Frankreich.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t8") {
      title = t("Cero Eléctrico (Blackout)", "System Blackout", "Zero Elétrico (Blackout)", "Zéro Électrique (Blackout)", "Zero Elettrico (Blackout)", "System-Blackout");
      desc = t("Pérdida total de 15 GW de generación y caída a 0 Hz. El sistema ibérico se apaga por completo dejando a 60 millones sin suministro.", "Total loss of 15 GW generation and drop to 0 Hz. The Iberian system completely shuts down, leaving 60 million without supply.", "Perda total de 15 GW de geração e queda a 0 Hz. O sistema ibérico desliga-se completamente deixando 60 milhões sem fornecimento.", "Perte totale de 15 GW de production et chute à 0 Hz. Le système ibérique s'éteint complètement, laissant 60 millions de personnes sans électricité.", "Perdita totale di 15 GW di generazione e caduta a 0 Hz. Il sistema iberico si spegne completamente lasciando 60 milioni senza corrente.", "Totaler Verlust von 15 GW Erzeugung und Abfall auf 0 Hz. Das iberische System schaltet sich komplett ab und lässt 60 Millionen ohne Versorgung.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t9") {
      title = t("Fragmentación e Intentos Bottom-Up (Fase 4)", "Fragmentation & Bottom-Up Attempts (Phase 4)", "Fragmentação e Tentativas Bottom-Up (Fase 4)", "Fragmentation et Tentatives Bottom-Up (Phase 4)", "Frammentazione e Tentativi Bottom-Up (Fase 4)", "Fragmentierung & Bottom-Up Versuche (Phase 4)");
      desc = t("División en 7 islas eléctricas. Múltiples fracasos de energización autónoma (Black Start) desde centrales hidroeléctricas sin masa síncrona.", "Division into 7 electrical islands. Multiple failures of autonomous energization (Black Start) from hydro plants without synchronous mass.", "Divisão em 7 ilhas elétricas. Múltiplos fracassos de energização autônoma (Black Start) a partir de hidrelétricas sem massa síncrona.", "Division en 7 îlots électriques. Multiples échecs d'énergisation autonome (Black Start) à partir de centrales hydroélectriques sans masse synchrone.", "Divisione in 7 isole elettriche. Molteplici fallimenti di energizzazione autonoma (Black Start) da centrali idroelettriche senza massa sincrona.", "Aufteilung in 7 elektrische Inseln. Mehrere Ausfälle der autonomen Stromversorgung (Black Start) von Wasserkraftwerken ohne synchrone Masse.");
      dateStr = t("28 de abril de 2025", "April 28, 2025", "28 de abril de 2025", "28 avril 2025", "28 aprile 2025", "28. April 2025");
    } else if (event.id === "t10") {
      title = t("Reposición Completa de la Demanda", "Full Demand Restoration", "Reposição Completa da Demanda", "Restauration Complète de la Demande", "Ripristino Completo della Domanda", "Vollständige Wiederherstellung der Nachfrage");
      desc = t("Tras 19 horas ininterrumpidas de maniobras y conexión escalonada de carga (Top-Down desde FR/MA), se recuperan los 25 GW de demanda perdidos.", "After 19 uninterrupted hours of maneuvers and staggered load connection (Top-Down from FR/MA), the lost 25 GW of demand is recovered.", "Após 19 horas ininterruptas de manobras e conexão escalonada de carga (Top-Down a partir de FR/MA), recuperam-se os 25 GW de demanda perdidos.", "Après 19 heures ininterrompues de manœuvres et de connexion échelonnée de charge (Top-Down depuis FR/MA), les 25 GW de demande perdus sont récupérés.", "Dopo 19 ore ininterrotte di manovre e connessione scaglionata di carico (Top-Down da FR/MA), si recuperano i 25 GW di domanda persi.", "Nach 19 ununterbrochenen Stunden mit Manövern und gestaffelter Lastzuschaltung (Top-Down von FR/MA) werden die verlorenen 25 GW Nachfrage wiederhergestellt.");
      dateStr = t("29 de abril de 2025", "April 29, 2025", "29 de abril de 2025", "29 avril 2025", "29 aprile 2025", "29. April 2025");
    }
    
    return { title, desc, dateStr };
  };

  return (
    <div className={styles.timelineContainer}>
      {timelineEvents.map((event, index) => {
        // Alternating left/right layout classes
        const alignmentClass = index % 2 === 0 ? styles.leftEvent : styles.rightEvent;
        
        // Dynamic border color based on event severity
        let typeColor = 'var(--ifm-color-primary)';
        if (event.type === 'warning') typeColor = '#f39c12';
        if (event.type === 'danger') typeColor = '#e74c3c';
        if (event.type === 'critical') typeColor = '#c0392b';
        if (event.type === 'success') typeColor = '#27ae60';
        
        const loc = getLocalizedEvent(event, lang);

        return (
          <div key={event.id} className={`${styles.timelineBlock} ${alignmentClass}`}>
            <div 
              className={styles.timelineDot} 
              style={{ backgroundColor: typeColor, boxShadow: `0 0 0 4px rgba(255,255,255,0.2), 0 0 0 8px ${typeColor}33` }}
            ></div>
            
            <div className={styles.timelineContent} style={{ borderTop: `4px solid ${typeColor}` }}>
              <div className={styles.timeBadge}>
                {loc.dateStr} • {event.time}
              </div>
              <h3 className={styles.eventTitle}>
                {loc.title}
              </h3>
              <p className={styles.eventDesc}>
                {loc.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
