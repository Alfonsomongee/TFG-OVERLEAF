import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, ReferenceArea, ComposedChart, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import GlitchTitle from '../GlitchTitle';
import styles from './FrequencyTimeline.module.css';

const FrequencyTimeline = () => {
  const [freqData, setFreqData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1800);
  const [filteredData, setFilteredData] = useState([]);
  const [showCriticalPhaseOnly, setShowCriticalPhaseOnly] = useState(false);
  const [hasError, setHasError] = useState(false);
  const playbackIntervalRef = useRef(null);
  
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      title: "FRECUENCIA DEL SISTEMA — 28 ABRIL 2025",
      subtitle: "Reconstrucción basada en datos verificados ENTSO-E / PMU del colapso cascada en 27 segundos",
      freq: "Frecuencia:",
      rocof: "ROCOF:",
      status: "Estado:",
      play: "▶ REPRODUCIR APAGÓN (27s)",
      stop: "⏹ DETENER",
      criticalOnly: "Mostrar solo fase crítica",
      rocofTitle: "Tasa de Cambio de Frecuencia (ROCOF)",
      eventsTitle: "Eventos Principales",
      contextTitle: "Contexto Técnico",
      nominal: "NOMINAL",
      collapseZone: "ZONA COLAPSO",
      error: "ERROR CRÍTICO: CAPA DE DATOS OFFLINE",
      errorSub: "Error al cargar frequency_28A.json"
    },
    en: {
      title: "SYSTEM FREQUENCY — 28 APRIL 2025",
      subtitle: "Reconstruction based on verified ENTSO-E / PMU data of the 27-second cascade collapse",
      freq: "Frequency:",
      rocof: "ROCOF:",
      status: "Status:",
      play: "▶ REPLAY BLACKOUT (27s)",
      stop: "⏹ STOP",
      criticalOnly: "Show critical phase only",
      rocofTitle: "Rate of Change of Frequency (ROCOF)",
      eventsTitle: "Main Events",
      contextTitle: "Technical Context",
      nominal: "NOMINAL",
      collapseZone: "COLLAPSE ZONE",
      error: "CRITICAL ERROR: DATA LAYER OFFLINE",
      errorSub: "Failed to load frequency_28A.json"
    },
    pt: {
      title: "FREQUÊNCIA DO SISTEMA — 28 ABRIL 2025",
      subtitle: "Reconstrução baseada em dados verificados ENTSO-E / PMU do colapso em cascata em 27 segundos",
      freq: "Frequência:",
      rocof: "ROCOF:",
      status: "Estado:",
      play: "▶ REPRODUZIR APAGÃO (27s)",
      stop: "⏹ PARAR",
      criticalOnly: "Mostrar apenas fase crítica",
      rocofTitle: "Taxa de Mudança de Frequência (ROCOF)",
      eventsTitle: "Eventos Principais",
      contextTitle: "Contexto Técnico",
      nominal: "NOMINAL",
      collapseZone: "ZONA COLAPSO",
      error: "ERRO CRÍTICO: CAMADA DE DADOS OFFLINE",
      errorSub: "Falha ao carregar frequency_28A.json"
    },
    fr: {
      title: "FRÉQUENCE DU SYSTÈME — 28 AVRIL 2025",
      subtitle: "Reconstruction basée sur des données ENTSO-E / PMU vérifiées de l'effondrement en 27 secondes",
      freq: "Fréquence:",
      rocof: "ROCOF:",
      status: "Statut:",
      play: "▶ JOUER PANNE (27s)",
      stop: "⏹ ARRÊTER",
      criticalOnly: "Afficher phase critique",
      rocofTitle: "Taux de Variation de Fréquence (ROCOF)",
      eventsTitle: "Événements Principaux",
      contextTitle: "Contexte Technique",
      nominal: "NOMINAL",
      collapseZone: "ZONE D'EFFONDREMENT",
      error: "ERREUR CRITIQUE : COUCHE DE DONNÉES HORS LIGNE",
      errorSub: "Échec du chargement frequency_28A.json"
    },
    it: {
      title: "FREQUENZA DEL SISTEMA — 28 APRILE 2025",
      subtitle: "Ricostruzione basata su dati verificati ENTSO-E / PMU del collasso a cascata in 27 secondi",
      freq: "Frequenza:",
      rocof: "ROCOF:",
      status: "Stato:",
      play: "▶ RIPRODUCI BLACKOUT (27s)",
      stop: "⏹ FERMA",
      criticalOnly: "Mostra solo fase critica",
      rocofTitle: "Tasso di Variazione della Frequenza (ROCOF)",
      eventsTitle: "Eventi Principali",
      contextTitle: "Contesto Tecnico",
      nominal: "NOMINALE",
      collapseZone: "ZONA COLLASSO",
      error: "ERRORE CRITICO: LIVELLO DATI OFFLINE",
      errorSub: "Impossibile caricare frequency_28A.json"
    },
    de: {
      title: "SYSTEMFREQUENZ — 28. APRIL 2025",
      subtitle: "Rekonstruktion basierend auf verifizierten ENTSO-E / PMU-Daten des 27-Sekunden-Kaskadenkollapses",
      freq: "Frequenz:",
      rocof: "ROCOF:",
      status: "Status:",
      play: "▶ BLACKOUT ABSPIELEN (27s)",
      stop: "⏹ STOPP",
      criticalOnly: "Nur kritische Phase zeigen",
      rocofTitle: "Änderungsrate der Frequenz (ROCOF)",
      eventsTitle: "Hauptereignisse",
      contextTitle: "Technischer Kontext",
      nominal: "NOMINAL",
      collapseZone: "KOLLAPSZONE",
      error: "KRITISCHER FEHLER: DATENSCHICHT OFFLINE",
      errorSub: "Fehler beim Laden von frequency_28A.json"
    }
  };

  const t = T[currentLocale] || T.en;

  const dataUrl = useBaseUrl('/data/frequency_28A.json');

  // Load frequency data on mount
  useEffect(() => {
    fetch(dataUrl)
      .then((res) => res.json())
      .then((data) => {
        // Normalize time display and compute ROCOF
        const processedData = data.map((point, idx) => ({
          ...point,
          rocof: idx > 0 ? Math.abs(data[idx].freq - data[idx - 1].freq) / (data[idx].t - data[idx - 1].t) : 0,
          status: point.freq > 49.8 ? 'NORMAL' : 
                  point.freq > 49.0 ? 'UFLS ACTIVE' :
                  point.freq > 48.0 ? 'CRITICAL' :
                  point.freq > 0 ? 'COLLAPSE' : 'BLACKOUT'
        }));
        setFreqData(processedData);
        setFilteredData(showCriticalPhaseOnly ? processedData.filter(d => d.t >= -27) : processedData);
        setHasError(false);
      })
      .catch((err) => {
        console.error('Error loading frequency data:', err);
        setHasError(true);
      });
  }, [showCriticalPhaseOnly, dataUrl]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    playbackIntervalRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 0) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1; // Advance 1 second per tick
      });
    }, 1000); // 1 second per iteration (real-time)

    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentTime >= 0) setCurrentTime(-1800); // Reset
    setIsPlaying(!isPlaying);
  };

  // Get current data point and interpolate if necessary
  const getCurrentValue = () => {
    const point = freqData.find(d => d.t === currentTime) || 
                  freqData.filter(d => d.t <= currentTime).pop();
    return point || { freq: 50, rocof: 0, status: 'NORMAL', event: '' };
  };

  const current = getCurrentValue();

  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#ff3333', fontFamily: 'monospace', textAlign: 'center', border: '1px solid #cc1100', padding: '20px', backgroundColor: 'rgba(204, 17, 0, 0.1)' }}>
          <h3>{t.error}</h3>
          <p>{t.errorSub}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <GlitchTitle text={t.title} />
      <p className={styles.subtitle}>
        {t.subtitle}
      </p>

      {/* Live Readout Panel */}
      <motion.div 
        className={styles.readoutPanel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.readoutRow}>
          <span className={styles.label}>{t.freq}</span>
          <span className={`${styles.value} ${styles.freq}`}>{current.freq.toFixed(2)} Hz</span>
        </div>
        <div className={styles.readoutRow}>
          <span className={styles.label}>{t.rocof}</span>
          <span className={styles.value}>{current.rocof.toFixed(3)} Hz/s</span>
        </div>
        <div className={styles.readoutRow}>
          <span className={styles.label}>{t.status}</span>
          <span className={`${styles.badge} ${styles[`badge-${current.status.replace(' ', '-')}` ]}`}>
            {current.status}
          </span>
        </div>
        <div className={styles.readoutRow} style={{ marginTop: '10px', fontSize: '0.9em' }}>
          <span className={styles.event}>{current.event}</span>
        </div>
      </motion.div>

      {/* Playback Controls */}
      <div className={styles.controls}>
        <button 
          onClick={handlePlayPause}
          className={styles.playButton}
        >
          {isPlaying ? t.stop : t.play}
        </button>
        <label className={styles.checkbox}>
          <input 
            type="checkbox" 
            checked={showCriticalPhaseOnly}
            onChange={(e) => setShowCriticalPhaseOnly(e.target.checked)}
          />
          {t.criticalOnly}
        </label>
      </div>

      {/* Main Frequency Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={filteredData}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <defs>
            <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--forensic-amber-primary)" />
              <stop offset="100%" stopColor="var(--forensic-amber-warning)" />
            </linearGradient>
          </defs>

          <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)', fontSize: '12px' }} />

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255, 170, 0, 0.4)"
            tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            domain={[45, 50.5]}
            stroke="rgba(255, 170, 0, 0.4)"
            tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
            label={{ value: 'FREQUENCY (Hz)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
          />

          <ReferenceLine y={50.0} stroke="var(--forensic-border)" label={{ value: t.nominal, fill: "rgba(255, 255, 255, 0.3)" }} />
          <ReferenceLine y={49.8} stroke="var(--forensic-amber-primary)" strokeDasharray="3 3" opacity={0.5} label={{ value: "UFLS", fill: "var(--forensic-amber-primary)" }} />
          <ReferenceLine y={48.0} stroke="#cc1100" strokeDasharray="3 3" opacity={0.5} label={{ value: t.collapseZone, fill: "#cc1100" }} />

          {/* Reference zones */}
          <ReferenceArea y1={49.0} y2={49.8} fill="rgba(255, 170, 0, 0.05)" />
          <ReferenceArea y1={48.0} y2={49.0} fill="rgba(255, 85, 0, 0.05)" />
          <ReferenceArea y1={45} y2={48.0} fill="rgba(204, 17, 0, 0.1)" />

          {/* Main frequency line */}
          <Line 
            type="monotone" 
            dataKey="freq" 
            stroke="var(--forensic-amber-primary)" 
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
            name={t.freq.replace(':', '')}
          />

          {/* Current time marker (vertical line) */}
          {isPlaying && <ReferenceLine x={getCurrentValue().time} stroke="var(--forensic-amber-primary)" strokeWidth={1} opacity={0.8} />}

          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)' }}
            labelStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)' }}
            itemStyle={{ color: 'var(--forensic-amber-primary)' }}
            labelFormatter={(label) => `T${label >= 0 ? '+' : ''}${label}s`}
          />
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* ROCOF Secondary Chart */}
      <div className={styles.rocofSection}>
        <h3>{t.rocofTitle}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)', fontSize: '12px' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 170, 0, 0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              label={{ value: 'ROCOF (Hz/s)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
            />
            <ReferenceLine y={0.5} stroke="var(--forensic-amber-muted)" strokeDasharray="3 3" />
            <ReferenceLine y={1.0} stroke="var(--forensic-amber-critical)" strokeDasharray="3 3" opacity={0.6} />
            <Bar 
              dataKey="rocof" 
              fill="var(--forensic-amber-primary)"
              name={t.rocofTitle}
              radius={[2, 2, 0, 0]}
              barSize={12}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.rocof > 1.0 ? 'var(--forensic-amber-critical)' : entry.rocof > 0.5 ? 'var(--forensic-amber-warning)' : 'var(--forensic-amber-primary)'} />
              ))}
            </Bar>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--forensic-bg-primary)', border: '1px solid var(--forensic-border-strong)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--telemetry-font)' }}
              labelStyle={{ color: 'var(--forensic-text-primary)' }}
              itemStyle={{ color: 'var(--forensic-amber-primary)' }}
              formatter={(value) => [value.toFixed(3) + ' Hz/s', 'ROCOF']}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Event Annotations */}
      <div className={styles.eventsSection}>
        <h3>{t.eventsTitle}</h3>
        <div className={styles.eventsList}>
          {freqData.filter(d => d.event_type && d.event_type !== 'normal').map((point, idx) => (
            <div key={idx} className={`${styles.eventCard} ${styles[`event-${point.event_type}`]}`}>
              <span className={styles.eventTime}>{point.time}</span>
              <span className={styles.eventDesc}>{point.event}</span>
              <span className={styles.eventFreq}>{point.freq.toFixed(2)} Hz</span>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Context */}
      <div className={styles.context}>
        <h3>{t.contextTitle}</h3>
        {currentLocale === 'es' && (
          <>
            <p>
              El apagón del 28 de abril fue un colapso <strong>impulsado por sobretensión</strong>, no por subfrecuencia.
              La pérdida de 2,200 MW de generación renovable en el sur de España eliminó una sumidero de potencia reactiva.
              Simultáneamente, el efecto Ferranti en las líneas de transmisión descargadas causó un pico de voltaje a 435+ kV.
            </p>
            <p>
              La <strong>paradoja del UFLS</strong>: la reducción de carga en el UFLS redujo las corrientes de línea, 
              intensificando el efecto Ferranti y empeorando el colapso de voltaje. La arquitectura de protección legada 
              no podía interpretar correctamente las firmas de falta distorsionadas de recursos basados en inversores.
            </p>
          </>
        )}
        {currentLocale !== 'es' && (
          <>
            <p>
              The April 28 blackout was an <strong>overvoltage-driven</strong> collapse, not underfrequency.
              The loss of 2,200 MW of renewable generation in southern Spain removed a reactive power sink.
              Simultaneously, the Ferranti effect on unloaded transmission lines caused a voltage spike to 435+ kV.
            </p>
            <p>
              The <strong>UFLS paradox</strong>: UFLS load shedding reduced line currents, 
              intensifying the Ferranti effect and worsening the voltage collapse. Legacy protection architecture 
              could not correctly interpret the distorted fault signatures of inverter-based resources.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FrequencyTimeline;
