import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import BrowserOnly from '@docusaurus/BrowserOnly';


const INITIAL_VIEW_STATE = {
  longitude: -4.5,
  latitude: 39.5,
  zoom: 5,
  pitch: 45,
  bearing: 0
};

const getStations = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { name: 'Subestación Caparacena (Granada)', coordinates: [-3.5985, 37.1773], type: 'critical', desc: t('Punto cero (16:32:00). Doble cortocircuito que desencadena una brutal sobretensión local.', 'Ground zero (16:32:00). Double short circuit triggering a brutal local overvoltage.', 'Ponto zero (16:32:00). Curto-circuito duplo desencadeando uma brutal sobretensão local.', 'Point zéro (16:32:00). Double court-circuit déclenchant une surtension locale brutale.', 'Punto zero (16:32:00). Doppio cortocircuito che innesca una brutale sovratensione locale.', 'Ground Zero (16:32:00). Doppelter Kurzschluss, der eine massive lokale Überspannung auslöst.') },
    { name: 'Nudo Alcores (Sevilla)', coordinates: [-5.9844, 37.3890], type: 'lost', desc: t('Desconectada por protecciones para intentar aislar el incendio eléctrico del sur.', 'Disconnected by protections trying to isolate the electrical fire from the south.', 'Desconectada por proteções para tentar isolar o incêndio elétrico do sul.', 'Déconnecté par les protections pour tenter d\'isoler l\'incendie électrique du sud.', 'Scollegata dalle protezioni per tentare di isolare l\'incendio elettrico del sud.', 'Durch Schutzvorrichtungen getrennt, um das elektrische Feuer im Süden zu isolieren.') },
    { name: 'Nudo Guillena (Badajoz)', coordinates: [-6.9706, 38.8794], type: 'lost', desc: t('Sufre la onda de choque de reactiva. Cae por colapso de tensión (Voltage Collapse).', 'Suffers the reactive shockwave. Falls due to Voltage Collapse.', 'Sofre a onda de choque reativa. Cai por colapso de tensão.', 'Subit l\'onde de choc réactive. Tombe par effondrement de tension.', 'Subisce l\'onda d\'urto reattiva. Cade per collasso di tensione.', 'Erleidet die Blindleistungs-Schockwelle. Fällt aufgrund eines Spannungskollapses.') },
    { name: 'C.N. Almaraz (Cáceres)', coordinates: [-5.6961, 39.8142], type: 'active', desc: t('Soporta el transitorio gracias a la inercia pesada de sus alternadores síncronos.', 'Withstands the transient thanks to the heavy inertia of its synchronous alternators.', 'Suporta o transitório graças à inércia pesada de seus alternadores síncronos.', 'Supporte le transitoire grâce à la lourde inertie de ses alternateurs synchrones.', 'Sopporta il transitorio grazie alla pesante inerzia dei suoi alternatori sincroni.', 'Übersteht den Transienten dank der schweren Trägheit seiner Synchrongeneratoren.') },
    { name: 'Madrid Sur / Morata', coordinates: [-3.7037, 40.4167], type: 'active', desc: t('Absorbe los desequilibrios pero sufre caídas de frecuencia hasta 48.7 Hz.', 'Absorbs imbalances but suffers frequency drops down to 48.7 Hz.', 'Absorve os desequilíbrios, mas sofre quedas de frequência até 48,7 Hz.', 'Absorbe les déséquilibres mais subit des chutes de fréquence jusqu\'à 48,7 Hz.', 'Assorbe gli squilibri ma subisce cali di frequenza fino a 48,7 Hz.', 'Absorbiert Ungleichgewichte, leidet jedoch unter Frequenzabfällen bis auf 48,7 Hz.') },
    { name: 'Nudo Aragón (Zaragoza)', coordinates: [-0.8877, 41.6497], type: 'active', desc: t('Actúa como puente crítico para intentar importar energía de emergencia desde Francia.', 'Acts as a critical bridge trying to import emergency power from France.', 'Atua como ponte crítica tentando importar energia de emergência da França.', 'Agit comme un pont critique pour tenter d\'importer de l\'énergie d\'urgence depuis la France.', 'Funziona come ponte critico per tentare di importare energia di emergenza dalla Francia.', 'Fungiert als kritische Brücke, um Notstrom aus Frankreich zu importieren.') },
    { name: 'Nudo Rubí (Barcelona)', coordinates: [2.1734, 41.3852], type: 'active', desc: t('Se mantiene estable pero al límite operativo, exportando inercia al resto del país.', 'Remains stable but at its operational limit, exporting inertia to the rest of the country.', 'Mantém-se estável, mas no limite operacional, exportando inércia para o resto do país.', 'Reste stable mais à la limite opérationnelle, exportant de l\'inertie vers le reste du pays.', 'Rimane stabile ma al limite operativo, esportando inerzia nel resto del paese.', 'Bleibt stabil, aber am Betriebslimit, und exportiert Trägheit in den Rest des Landes.') },
    { name: 'Lisboa (Rede Eléctrica Nacional)', coordinates: [-9.1393, 38.7222], type: 'active', desc: t('La desconexión súbita de Andalucía genera oscilaciones letales hacia la red portuguesa.', 'The sudden disconnection of Andalusia generates lethal oscillations towards the Portuguese grid.', 'A desconexão súbita da Andaluzia gera oscilações letais para a rede portuguesa.', 'La déconnexion soudaine de l\'Andalousie génère des oscillations mortelles vers le réseau portugais.', 'L\'improvvisa disconnessione dell\'Andalusia genera oscillazioni letali verso la rete portoghese.', 'Die plötzliche Trennung von Andalusien erzeugt tödliche Schwingungen in Richtung des portugiesischen Netzes.') },
    { name: 'Porto (REN)', coordinates: [-8.6291, 41.1579], type: 'active', desc: t('Compensa la falta de generación del sur bombeando energía a la desesperada.', 'Compensates for the lack of southern generation by pumping energy desperately.', 'Compensa a falta de geração do sul bombeando energia desesperadamente.', 'Compense le manque de production du sud en pompant de l\'énergie désespérément.', 'Compensa la mancanza di generazione del sud pompando energia disperatamente.', 'Kompensiert den Mangel an Erzeugung im Süden, indem verzweifelt Energie gepumpt wird.') },
    { name: 'Interconexión Francia (RTE)', coordinates: [1.8845, 42.6397], type: 'border', desc: t('Aporta 2.500 MW de emergencia para salvar a la Península del cero total.', 'Provides 2,500 MW of emergency power to save the Peninsula from a total blackout.', 'Fornece 2.500 MW de emergência para salvar a Península do zero total.', 'Fournit 2 500 MW d\'urgence pour sauver la péninsule du blackout total.', 'Fornisce 2.500 MW di emergenza per salvare la penisola dal blackout totale.', 'Liefert 2.500 MW Notstrom, um die Halbinsel vor einem totalen Blackout zu bewahren.') }
  ];
};

const getArcs = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { source: [-3.5985, 37.1773], target: [-5.9844, 37.3890], flow: t('Sobretensión en cascada', 'Cascading overvoltage', 'Sobretensão em cascata', 'Surtension en cascade', 'Sovratensione a cascata', 'Kaskadierende Überspannung') },
    { source: [-5.9844, 37.3890], target: [-6.9706, 38.8794], flow: t('Pérdida de sincronismo', 'Loss of synchronism', 'Perda de sincronismo', 'Perte de synchronisme', 'Perdita di sincronismo', 'Synchronisationsverlust') },
    { source: [-6.9706, 38.8794], target: [-9.1393, 38.7222], flow: t('Oscilaciones interárea a Portugal', 'Inter-area oscillations to Portugal', 'Oscilações interárea para Portugal', 'Oscillations inter-zones vers le Portugal', 'Oscillazioni inter-area verso il Portogallo', 'Inter-Area-Schwingungen nach Portugal') },
    { source: [-3.7037, 40.4167], target: [1.8845, 42.6397], flow: t('Intento de estabilización desde Europa', 'Stabilization attempt from Europe', 'Tentativa de estabilização da Europa', 'Tentative de stabilisation depuis l\'Europe', 'Tentativo di stabilizzazione dall\'Europa', 'Stabilisierungsversuch aus Europa') },
    { source: [-0.8877, 41.6497], target: [1.8845, 42.6397], flow: t('Sobrecarga de AC', 'AC Overload', 'Sobrecarga AC', 'Surcharge CA', 'Sovraccarico CA', 'AC-Überlastung') }
  ];
};

function BlackoutMapContent({ lang = 'es' }) {
  const [time, setTime] = useState(0);
  const [clickedObject, setClickedObject] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const STATIONS = getStations(lang);
  const ARCS = getArcs(lang);
  
  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Collapse Propagation', desc1: 'This 3D model physically projects the blackout. The <strong>arcs</strong> are massive power flows. The <strong>pulsing spheres</strong> represent overvoltages at nodes.', desc2: 'The progressive geographical dimming simulates the voltage collapse over the 11 seconds.', replay: 'Replay', pause: 'Pause', play: 'Play', prog: 'Progress: ', int_title: 'Interaction:', int_desc: ' Drag to rotate the 3D camera. Click on spheres to view the forensic report.', leg_title: 'Legend:', leg_1: 'Trigger (Overvoltage)', leg_2: 'Disconnected Nodes', leg_3: 'Active Nodes', leg_4: 'European Interconnection', fallback: 'Critical Power Flow' };
      case 'pt': return { title: 'Propagação do Colapso', desc1: 'Este modelo 3D projeta fisicamente o apagão. Os <strong>arcos</strong> são fluxos massivos de energia. As <strong>esferas pulsantes</strong> representam sobretensões nos nós.', desc2: 'O escurecimento geográfico progressivo simula o colapso de tensão ao longo dos 11 segundos.', replay: 'Repetir', pause: 'Pausar', play: 'Iniciar', prog: 'Progresso: ', int_title: 'Interação:', int_desc: ' Arraste para rotacionar a câmera 3D. Clique nas esferas para ver o relatório forense.', leg_title: 'Legenda:', leg_1: 'Gatilho (Sobretensão)', leg_2: 'Nós Desconectados', leg_3: 'Nós Ativos', leg_4: 'Interconexão Europeia', fallback: 'Fluxo de Energia Crítico' };
      case 'fr': return { title: 'Propagation de l\'Effondrement', desc1: 'Ce modèle 3D projette physiquement la panne. Les <strong>arcs</strong> sont des flux massifs d\'énergie. Les <strong>sphères pulsantes</strong> représentent les surtensions aux nœuds.', desc2: 'L\'assombrissement géographique progressif simule l\'effondrement de la tension sur les 11 secondes.', replay: 'Rejouer', pause: 'Pause', play: 'Lecture', prog: 'Progression : ', int_title: 'Interaction :', int_desc: ' Faites glisser pour faire pivoter la caméra 3D. Cliquez sur les sphères pour voir le rapport médico-légal.', leg_title: 'Légende :', leg_1: 'Déclencheur (Surtension)', leg_2: 'Nœuds Déconnectés', leg_3: 'Nœuds Actifs', leg_4: 'Interconnexion Européenne', fallback: 'Flux de Puissance Critique' };
      case 'it': return { title: 'Propagazione del Collasso', desc1: 'Questo modello 3D proietta fisicamente il blackout. Gli <strong>archi</strong> sono flussi massicci di energia. Le <strong>sfere pulsanti</strong> rappresentano sovratensioni nei nodi.', desc2: 'L\'oscuramento geografico progressivo simula il collasso di tensione nel corso degli 11 secondi.', replay: 'Riproduci', pause: 'Pausa', play: 'Play', prog: 'Progresso: ', int_title: 'Interazione:', int_desc: ' Trascina per ruotare la telecamera 3D. Fai clic sulle sfere per visualizzare il rapporto forense.', leg_title: 'Leggenda:', leg_1: 'Innesco (Sovratensione)', leg_2: 'Nodi Disconnessi', leg_3: 'Nodi Attivi', leg_4: 'Interconnessione Europea', fallback: 'Flusso di Potenza Critico' };
      case 'de': return { title: 'Kollapsausbreitung', desc1: 'Dieses 3D-Modell projiziert den Stromausfall physisch. Die <strong>Bögen</strong> sind massive Energieflüsse. Die <strong>pulsierenden Kugeln</strong> stellen Überspannungen an Knoten dar.', desc2: 'Die fortschreitende geografische Verdunkelung simuliert den Spannungskollaps über die 11 Sekunden.', replay: 'Wiederholen', pause: 'Pause', play: 'Abspielen', prog: 'Fortschritt: ', int_title: 'Interaktion:', int_desc: ' Ziehen, um die 3D-Kamera zu drehen. Klicken Sie auf Kugeln, um den forensischen Bericht anzuzeigen.', leg_title: 'Legende:', leg_1: 'Auslöser (Überspannung)', leg_2: 'Getrennte Knoten', leg_3: 'Aktive Knoten', leg_4: 'Europäische Verbindung', fallback: 'Kritischer Energiefluss' };
      default: return { title: 'Propagación del Colapso', desc1: 'Este modelo 3D proyecta físicamente el apagón. Los <strong>arcos</strong> son flujos masivos de energía. Las <strong>esferas pulsantes</strong> representan sobretensiones en los nudos.', desc2: 'El oscurecimiento geográfico progresivo simula el hundimiento de tensión a lo largo de los 11 segundos.', replay: 'Replay', pause: 'Pausa', play: 'Play', prog: 'Progreso: ', int_title: 'Interacción:', int_desc: ' Arrastra para rotar la cámara en 3D. Haz clic en las esferas para ver el informe forense.', leg_title: 'Leyenda:', leg_1: 'Detonante (Sobretensión)', leg_2: 'Nudos Desconectados', leg_3: 'Nudos Activos', leg_4: 'Interconexión Europea', fallback: 'Flujo de Energía Crítico' };
    }
  };
  const strings = getStrings(lang);

  useEffect(() => {
    let animation;
    if (isPlaying && time < 110) {
      animation = setInterval(() => {
        setTime(t => t + 1);
      }, 100);
    } else if (time >= 110) {
      setIsPlaying(false);
    }
    return () => clearInterval(animation);
  }, [isPlaying, time]);

  const layers = [
    new TileLayer({
      id: 'google-satellite',
      data: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      opacity: Math.max(0.3, 1 - (time / 100))
    }),
    new ScatterplotLayer({
      id: 'stations-layer',
      data: STATIONS,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 600,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 2,
      getPosition: d => d.coordinates,
      getRadius: d => (d.type === 'critical' ? (60 + Math.sin(time / 5) * 20) : 50),
      getFillColor: d => {
        if (d.type === 'critical') return [255, 0, 0];
        if (d.type === 'lost') return [255, 165, 0];
        if (d.type === 'border') return [0, 150, 255];
        return [0, 255, 100];
      },
      getLineColor: d => [0, 0, 0]
    }),
    new ArcLayer({
      id: 'power-flows-layer',
      data: ARCS,
      pickable: true,
      getWidth: 3,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: [255, 0, 0, 200],
      getTargetColor: [255, 165, 0, 200],
      getTilt: d => (time / 100) * 15 - 7.5
    })
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#050505' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({object}) => object && (object.name || object.flow)}
        onClick={({object}) => {
          if (object) setClickedObject(object);
          else setClickedObject(null);
        }}
      />
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        maxWidth: '350px',
        border: '1px solid #30363d',
        zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>{strings.title}</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db' }} dangerouslySetInnerHTML={{__html: strings.desc1}} />
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db', marginBottom: '15px' }}>
          {strings.desc2}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => {
              if (time >= 110) setTime(0);
              setIsPlaying(!isPlaying);
            }}
            style={{
              background: 'var(--ifm-color-primary)',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {time >= 110 ? strings.replay : (isPlaying ? strings.pause : strings.play)}
          </button>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
            {strings.prog} {(time / 10).toFixed(1)}s
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '15px', fontStyle: 'italic', margin: '15px 0 0 0' }}>
          <span style={{color: '#fff'}}>{strings.int_title}</span>{strings.int_desc}
        </p>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.85rem'
      }}>
        <strong>{strings.leg_title}</strong><br/>
        <span style={{color: '#ff0000'}}>●</span> {strings.leg_1}<br/>
        <span style={{color: '#ffa500'}}>●</span> {strings.leg_2}<br/>
        <span style={{color: '#00ff64'}}>●</span> {strings.leg_3}<br/>
        <span style={{color: '#0096ff'}}>●</span> {strings.leg_4}
      </div>
      {clickedObject && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.9)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          maxWidth: '250px',
          border: '1px solid var(--ifm-color-primary)'
        }}>
          <h4 style={{margin: '0 0 10px 0', fontSize: '1rem', color: '#60a5fa'}}>{clickedObject.name || strings.fallback}</h4>
          {clickedObject.flow ? (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.flow}</p>
          ) : (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.desc}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BlackoutPropagationMap({ lang = 'es' }) {
  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive 3D map...';
      case 'pt': return 'Carregando mapa 3D interativo...';
      case 'fr': return 'Chargement de la carte 3D interactive...';
      case 'it': return 'Caricamento mappa 3D interattiva...';
      case 'de': return 'Interaktive 3D-Karte wird geladen...';
      default: return 'Cargando mapa 3D interactivo...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(lang)}</div>}>
      {() => <BlackoutMapContent lang={lang} />}
    </BrowserOnly>
  );
}
