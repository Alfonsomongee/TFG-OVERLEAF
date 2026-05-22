import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { LineChart, Line, ReferenceLine, YAxis, XAxis, ResponsiveContainer } from 'recharts';
import styles from './FrequencyChart.module.css';
import { timelineData } from '../data/forensicData';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Filtramos el 0.0 Hz porque distorsiona el gráfico que queremos mostrar (caída hasta 46 Hz)
const validTimelineData = timelineData.filter(d => d.frecuencia > 0);

const getSteps = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    { stepIndex: 0, title: t('12:32:57 — El detonante', '12:32:57 — The Trigger', '12:32:57 — O Gatilho', '12:32:57 — Le Déclencheur', '12:32:57 — L\'Innesco', '12:32:57 — Der Auslöser'), text: t('Un transformador de 400/220 kV en Granada se desconecta por sobretensión, eliminando bruscamente 165 MVAr de capacidad de absorción de reactiva inductiva.', 'A 400/220 kV transformer in Granada disconnects due to overvoltage, abruptly eliminating 165 MVAr of inductive reactive absorption capacity.', 'Um transformador de 400/220 kV em Granada desconecta devido a sobretensão, eliminando abruptamente 165 MVAr de capacidade de absorção reativa indutiva.', 'Un transformateur de 400/220 kV à Grenade se déconnecte pour cause de surtension, éliminant brusquement 165 MVAr de capacité d\'absorption réactive inductive.', 'Un trasformatore da 400/220 kV a Granada si disconnette per sovratensione, eliminando bruscamente 165 MVAr di capacità di assorbimento reattivo induttivo.', 'Ein 400/220-kV-Transformator in Granada schaltet wegen Überspannung ab und eliminiert schlagartig 165 MVAr induktive Blindleistungsaufnahmekapazität.'), visibleUntilT: 0 },
    { stepIndex: 1, title: t('12:33:15 — Sobretensión latente', '12:33:15 — Latent Overvoltage', '12:33:15 — Sobretensão Latente', '12:33:15 — Surtension Latente', '12:33:15 — Sovratensione Latente', '12:33:15 — Latente Überspannung'), text: t('La tensión se eleva a lo largo de la red de 400 kV por efecto Ferranti (red capacitiva descargada de flujos de potencia). Se produce el fenómeno Tap-Lag en los transformadores.', 'Voltage rises across the 400 kV grid due to the Ferranti effect (capacitive grid unloaded from power flows). The Tap-Lag phenomenon occurs in transformers.', 'A tensão sobe ao longo da rede de 400 kV pelo efeito Ferranti. Ocorre o fenômeno Tap-Lag nos transformadores.', 'La tension augmente sur le réseau 400 kV en raison de l\'effet Ferranti. Le phénomène Tap-Lag se produit dans les transformateurs.', 'La tensione sale lungo la rete a 400 kV per effetto Ferranti. Si verifica il fenomeno Tap-Lag nei trasformatori.', 'Die Spannung im 400-kV-Netz steigt durch den Ferranti-Effekt. Das Tap-Lag-Phänomen tritt in Transformatoren auf.'), visibleUntilT: 18 },
    { stepIndex: 2, title: t('12:33:18 — Inicio de la cascada', '12:33:18 — Cascade Initiation', '12:33:18 — Início da Cascata', '12:33:18 — Début de la Cascade', '12:33:18 — Inizio della Cascata', '12:33:18 — Kaskadenbeginn'), text: t('Las plantas renovables perciben voltajes extremos (>1,2 p.u.) en los nudos colectores. Se superan los umbrales de autoprotección High Voltage Ride-Through. Caen Badajoz y Sevilla.', 'Renewable plants perceive extreme voltages (>1.2 p.u.) at collector nodes. High Voltage Ride-Through self-protection thresholds are exceeded. Badajoz and Seville drop.', 'As usinas renováveis percebem tensões extremas nos nós coletores. Caem Badajoz e Sevilha.', 'Les centrales renouvelables perçoivent des tensions extrêmes aux nœuds collecteurs. Badajoz et Séville tombent.', 'Gli impianti rinnovabili percepiscono tensioni estreme ai nodi collettori. Cadono Badajoz e Siviglia.', 'Erneuerbare-Energien-Anlagen nehmen extreme Spannungen an Netzknoten wahr. Badajoz und Sevilla fallen aus.'), visibleUntilT: 21 },
    { stepIndex: 3, title: t('12:33:20 — Caída libre inercial', '12:33:20 — Inertial Freefall', '12:33:20 — Queda Livre Inercial', '12:33:20 — Chute Libre Inertielle', '12:33:20 — Caduta Libera Inerziale', '12:33:20 — Trägheitsfreier Fall'), text: t('Tras la pérdida de 15 GW de generación activa, la frecuencia comienza a desplomarse. El RoCoF extremo provoca que relés internos de más inversores disparen, acelerando la espiral.', 'After losing 15 GW of active generation, the frequency starts to plummet. The extreme RoCoF causes more inverter internal relays to trip, accelerating the spiral.', 'Após a perda de 15 GW de geração ativa, a frequência começa a despencar.', 'Après la perte de 15 GW de production active, la fréquence commence à chuter.', 'Dopo la perdita di 15 GW di generazione attiva, la frequenza inizia a crollare.', 'Nach dem Verlust von 15 GW aktiver Erzeugung beginnt die Frequenz abzustürzen.'), visibleUntilT: 23 },
    { stepIndex: 4, title: t('12:33:21 — Aislamiento europeo', '12:33:21 — European Isolation', '12:33:21 — Isolamento Europeu', '12:33:21 — Isolement Européen', '12:33:21 — Isolamento Europeo', '12:33:21 — Europäische Isolation'), text: t('Para proteger el sistema síncrono continental, las protecciones de pérdida de sincronismo abren las líneas de interconexión con Francia a los 48,46 Hz. La península se convierte en una isla eléctrica.', 'To protect the continental synchronous system, loss-of-synchronism protections open interconnection lines with France at 48.46 Hz. The peninsula becomes an electrical island.', 'Para proteger o sistema síncrono continental, as proteções abrem as linhas de interconexão com a França.', 'Pour protéger le système synchrone continental, les protections ouvrent les lignes d\'interconnexion avec la France.', 'Per proteggere il sistema sincrono continentale, le protezioni aprono le linee di interconnessione con la Francia.', 'Um das kontinentale Synchronsystem zu schützen, öffnen Schutzvorrichtungen die Verbindungsleitungen mit Frankreich.'), visibleUntilT: 24 },
    { stepIndex: 5, title: t('12:33:23 — Colapso y paradoja UFLS', '12:33:23 — Collapse & UFLS Paradox', '12:33:23 — Colapso e Paradoxo UFLS', '12:33:23 — Effondrement et Paradoxe UFLS', '12:33:23 — Collasso e Paradosso UFLS', '12:33:23 — Kollaps & UFLS-Paradoxon'), text: t('El UFLS deslastra 10 GW de bombeo y demanda industrial. Paradójicamente, esto agrava la sobretensión al eliminar consumo inductivo. Segundos después, la central nuclear sufre SCRAM. Es el cero absoluto.', 'The UFLS sheds 10 GW of pumping and industrial demand. Paradoxically, this aggravates the overvoltage by removing inductive consumption. Seconds later, the nuclear plant suffers SCRAM. Absolute zero.', 'O UFLS corta 10 GW de bombeamento e demanda industrial. A usina nuclear sofre SCRAM. É o zero absoluto.', 'L\'UFLS décharge 10 GW de pompage et de demande industrielle. La centrale nucléaire subit un SCRAM.', 'L\'UFLS scarica 10 GW di pompaggio e domanda industriale. La centrale nucleare subisce uno SCRAM.', 'Das UFLS wirft 10 GW Pump- und Industrienachfrage ab. Das Kernkraftwerk erleidet einen SCRAM. Absoluter Nullpunkt.'), visibleUntilT: 26 }
  ];
};
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function FrequencyChartScrolly({ isGallery = false, lang }) {
  const { i18n } = useDocusaurusContext();
  const currentLang = lang || i18n.currentLocale || 'es';

  const getLoadingText = (l) => {
    switch(l) {
      case 'en': return 'Loading interactive visualization...';
      case 'pt': return 'Carregando visualização interativa...';
      case 'fr': return 'Chargement de la visualisation interactive...';
      case 'it': return 'Caricamento della visualizzazione interattiva...';
      case 'de': return 'Interaktive Visualisierung wird geladen...';
      default: return 'Cargando visualización interactiva...';
    }
  };

  return (
    <BrowserOnly fallback={<div>{getLoadingText(currentLang)}</div>}>
      {() => <FrequencyChartScrollyContent isGallery={isGallery} lang={currentLang} />}
    </BrowserOnly>
  );
}

function FrequencyChartScrollyContent({ isGallery, lang }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const STEPS = getSteps(lang);
  const currentStep = STEPS[currentStepIndex] || STEPS[0];
  const visibleData = validTimelineData.filter(d => d.tiempoS <= currentStep.visibleUntilT);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { xaxis: 'Seconds from trigger', ufls: 'UFLS (49.5 Hz)', iso: 'FR Isolation', dyn: 'Collapse dynamics in 11 critical seconds.' };
      case 'pt': return { xaxis: 'Segundos desde o gatilho', ufls: 'UFLS (49.5 Hz)', iso: 'Isolamento FR', dyn: 'Dinâmica de colapso em 11 segundos críticos.' };
      case 'fr': return { xaxis: 'Secondes depuis le déclencheur', ufls: 'UFLS (49.5 Hz)', iso: 'Isolement FR', dyn: 'Dynamique d\'effondrement en 11 secondes critiques.' };
      case 'it': return { xaxis: 'Secondi dall\'innesco', ufls: 'UFLS (49.5 Hz)', iso: 'Isolamento FR', dyn: 'Dinamica di collasso in 11 secondi critici.' };
      case 'de': return { xaxis: 'Sekunden seit Auslöser', ufls: 'UFLS (49.5 Hz)', iso: 'FR-Isolation', dyn: 'Kollapsdynamik in 11 kritischen Sekunden.' };
      default: return { xaxis: 'Segundos desde el detonante', ufls: 'UFLS (49.5 Hz)', iso: 'Aislamiento FR', dyn: 'Dinámica de colapso en 11 segundos críticos.' };
    }
  };
  const strings = getStrings(lang);

  if (isGallery) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
        <div style={{ height: '400px', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: strings.xaxis, position: 'insideBottom', offset: -10 }} />
              <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
              <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: strings.ufls}} />
              <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: strings.iso}} />
              <Line type="stepAfter" dataKey="frecuencia" stroke="#FF4D4D" strokeWidth={5} isAnimationActive={false} dot={{ r: 5, fill: 'var(--ifm-background-surface-color)', stroke: '#FF4D4D', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {STEPS.map((s) => (
              <button 
                key={s.stepIndex}
                onClick={() => setCurrentStepIndex(s.stepIndex)}
                style={{
                  position: 'relative',
                  padding: '10px 15px',
                  borderRadius: '4px',
                  border: '1px solid transparent',
                  borderLeft: currentStepIndex === s.stepIndex ? '3px solid var(--ifm-color-primary)' : '3px solid transparent',
                  backgroundColor: currentStepIndex === s.stepIndex ? 'color-mix(in srgb, var(--ifm-color-primary) 15%, transparent)' : 'transparent',
                  color: currentStepIndex === s.stepIndex ? 'var(--ifm-color-primary)' : 'var(--ifm-font-color-base)',
                  cursor: 'pointer',
                  fontWeight: currentStepIndex === s.stepIndex ? 'bold' : 'normal',
                  transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: currentStepIndex === s.stepIndex ? 'inset 200px 0 0 0 color-mix(in srgb, var(--ifm-color-primary) 5%, transparent)' : 'none'
                }}
              >
              {s.title.split(' — ')[0]}
            </button>
          ))}
        </div>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', minHeight: '80px' }}>
          <h4 style={{ color: 'var(--ifm-color-primary)', margin: '0 0 10px 0' }}>{currentStep.title}</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{currentStep.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scrollyWrapper} style={{ position: 'relative', margin: '2rem 0' }}>
        
        {/* Gráfica fija (sticky) a la derecha */}
        <div style={{ position: 'sticky', top: '100px', height: '65vh', width: '55%', float: 'right', zIndex: 10 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ifm-color-primary)' }}>{currentStep.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>{strings.dyn}</p>
          </div>
          <div style={{ height: 'calc(100% - 60px)', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: strings.xaxis, position: 'insideBottom', offset: -10 }} />
                <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
                <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: strings.ufls}} />
                <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: strings.iso}} />
                <Line type="stepAfter" dataKey="frecuencia" stroke="#FF4D4D" strokeWidth={5} isAnimationActive={true} animationDuration={600} dot={{ r: 5, fill: 'var(--ifm-background-surface-color)', stroke: '#FF4D4D', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Textos que desencadenan el scroll a la izquierda */}
        <div style={{ width: '40%', position: 'relative', zIndex: 5 }}>
          <Scrollama onStepEnter={({ data }) => setCurrentStepIndex(data)} offset={0.5}>
            {STEPS.map((s) => (
              <Step data={s.stepIndex} key={s.stepIndex}>
                <div style={{ 
                  margin: '50vh 0', 
                  padding: '2rem', 
                  backgroundColor: 'var(--ifm-background-surface-color)', 
                  border: currentStepIndex === s.stepIndex ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-200)',
                  borderRadius: '8px',
                  boxShadow: currentStepIndex === s.stepIndex ? '0 8px 30px rgba(0,0,0,0.1)' : 'none',
                  opacity: currentStepIndex === s.stepIndex ? 1 : 0.3,
                  transform: currentStepIndex === s.stepIndex ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  <h4 style={{ color: 'var(--ifm-color-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>{s.title}</h4>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{s.text}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
        
        <div style={{ clear: 'both' }}></div>
      </div>
  );
}
