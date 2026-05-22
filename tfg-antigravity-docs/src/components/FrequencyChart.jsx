import React, { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import { LineChart, Line, ReferenceLine, YAxis, XAxis, ResponsiveContainer } from 'recharts';
import styles from './FrequencyChart.module.css';
import { timelineData } from '../data/forensicData';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Filtramos el 0.0 Hz porque distorsiona el gráfico que queremos mostrar (caída hasta 46 Hz)
const validTimelineData = timelineData.filter(d => d.frecuencia > 0);

const STEPS = [
  { stepIndex: 0, title: '12:32:57 — El detonante', text: 'Un transformador de 400/220 kV en Granada se desconecta por sobretensión, eliminando bruscamente 165 MVAr de capacidad de absorción de reactiva inductiva.', visibleUntilT: 0 },
  { stepIndex: 1, title: '12:33:15 — Sobretensión latente', text: 'La tensión se eleva a lo largo de la red de 400 kV por efecto Ferranti (red capacitiva descargada de flujos de potencia). Se produce el fenómeno Tap-Lag en los transformadores.', visibleUntilT: 18 },
  { stepIndex: 2, title: '12:33:18 — Inicio de la cascada', text: 'Las plantas renovables perciben voltajes extremos (>1,2 p.u.) en los nudos colectores. Se superan los umbrales de autoprotección High Voltage Ride-Through. Caen Badajoz y Sevilla.', visibleUntilT: 21 },
  { stepIndex: 3, title: '12:33:20 — Caída libre inercial', text: 'Tras la pérdida de 15 GW de generación activa, la frecuencia comienza a desplomarse. El RoCoF extremo provoca que relés internos de más inversores disparen, acelerando la espiral.', visibleUntilT: 23 },
  { stepIndex: 4, title: '12:33:21 — Aislamiento europeo', text: 'Para proteger el sistema síncrono continental, las protecciones de pérdida de sincronismo abren las líneas de interconexión con Francia a los 48,46 Hz. La península se convierte en una isla eléctrica.', visibleUntilT: 24 },
  { stepIndex: 5, title: '12:33:23 — Colapso y paradoja UFLS', text: 'El UFLS deslastra 10 GW de bombeo y demanda industrial. Paradójicamente, esto agrava la sobretensión al eliminar consumo inductivo. Segundos después, la central nuclear sufre SCRAM. Es el cero absoluto.', visibleUntilT: 26 }
];

export default function FrequencyChartScrolly({ isGallery = false }) {
  return (
    <BrowserOnly fallback={<div>Cargando visualización interactiva...</div>}>
      {() => <FrequencyChartScrollyContent isGallery={isGallery} />}
    </BrowserOnly>
  );
}

function FrequencyChartScrollyContent({ isGallery }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const currentStep = STEPS[currentStepIndex] || STEPS[0];
  const visibleData = validTimelineData.filter(d => d.tiempoS <= currentStep.visibleUntilT);

  if (isGallery) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
        <div style={{ height: '400px', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: 'Segundos desde el detonante', position: 'insideBottom', offset: -10 }} />
              <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
              <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: 'UFLS (49.5 Hz)'}} />
              <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: 'Aislamiento FR'}} />
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
                padding: '10px 15px',
                borderRadius: '8px',
                border: currentStepIndex === s.stepIndex ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: currentStepIndex === s.stepIndex ? 'var(--ifm-color-primary-lightest)' : 'var(--ifm-background-surface-color)',
                color: currentStepIndex === s.stepIndex ? 'var(--ifm-color-primary-darker)' : 'var(--ifm-font-color-base)',
                cursor: 'pointer',
                fontWeight: currentStepIndex === s.stepIndex ? 'bold' : 'normal'
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
            <p style={{ fontSize: '0.9rem', color: 'var(--ifm-color-emphasis-700)' }}>Dinámica de colapso en 11 segundos críticos.</p>
          </div>
          <div style={{ height: 'calc(100% - 60px)', background: 'var(--ifm-background-surface-color)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--ifm-color-emphasis-200)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <XAxis dataKey="tiempoS" domain={[0, 26]} type="number" stroke="var(--ifm-color-emphasis-600)" label={{ value: 'Segundos desde el detonante', position: 'insideBottom', offset: -10 }} />
                <YAxis domain={[46, 50.1]} stroke="var(--ifm-color-emphasis-600)" unit=" Hz" />
                <ReferenceLine y={49.5} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideBottomRight', value: 'UFLS (49.5 Hz)'}} />
                <ReferenceLine y={48.46} stroke="#ef4444" strokeDasharray="4 4" label={{ position: 'insideTopRight', value: 'Aislamiento FR'}} />
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
