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
  const [currentTime, setCurrentTime] = useState(-27);
  const [filteredData, setFilteredData] = useState([]);
  const [showCriticalPhaseOnly, setShowCriticalPhaseOnly] = useState(false);
  const [zoomCollapse, setZoomCollapse] = useState(false);
  const [hasError, setHasError] = useState(false);
  const playbackIntervalRef = useRef(null);
  
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      title: "FRECUENCIA DEL SISTEMA â€” 28 ABRIL 2025",
      subtitle: "ReconstrucciÃ³n basada en datos verificados ENTSO-E / PMU del colapso cascada en 27 segundos",
      freq: "Frecuencia:",
      rocof: "ROCOF:",
      status: "Estado:",
      play: "â–¶ REPRODUCIR APAGÃ“N (27s)",
      stop: "â¹ DETENER",
      criticalOnly: "Mostrar solo fase crÃ­tica",
      rocofTitle: "Tasa de Cambio de Frecuencia (ROCOF)",
      eventsTitle: "Eventos Principales",
      contextTitle: "Contexto TÃ©cnico",
      nominal: "NOMINAL",
      collapseZone: "ZONA COLAPSO",
      error: "ERROR CRÃTICO: CAPA DE DATOS OFFLINE",
      errorSub: "Error al cargar frequency_28A.json"
    },
    en: {
      title: "SYSTEM FREQUENCY â€” 28 APRIL 2025",
      subtitle: "Reconstruction based on verified ENTSO-E / PMU data of the 27-second cascade collapse",
      freq: "Frequency:",
      rocof: "ROCOF:",
      status: "Status:",
      play: "â–¶ REPLAY BLACKOUT (27s)",
      stop: "â¹ STOP",
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
      title: "FREQUÃŠNCIA DO SISTEMA â€” 28 ABRIL 2025",
      subtitle: "ReconstruÃ§Ã£o baseada em dados verificados ENTSO-E / PMU do colapso em cascata em 27 segundos",
      freq: "FrequÃªncia:",
      rocof: "ROCOF:",
      status: "Estado:",
      play: "â–¶ REPRODUZIR APAGÃƒO (27s)",
      stop: "â¹ PARAR",
      criticalOnly: "Mostrar apenas fase crÃ­tica",
      rocofTitle: "Taxa de MudanÃ§a de FrequÃªncia (ROCOF)",
      eventsTitle: "Eventos Principais",
      contextTitle: "Contexto TÃ©cnico",
      nominal: "NOMINAL",
      collapseZone: "ZONA COLAPSO",
      error: "ERRO CRÃTICO: CAMADA DE DADOS OFFLINE",
      errorSub: "Falha ao carregar frequency_28A.json"
    },
    fr: {
      title: "FRÃ‰QUENCE DU SYSTÃˆME â€” 28 AVRIL 2025",
      subtitle: "Reconstruction basÃ©e sur des donnÃ©es ENTSO-E / PMU vÃ©rifiÃ©es de l'effondrement en 27 secondes",
      freq: "FrÃ©quence:",
      rocof: "ROCOF:",
      status: "Statut:",
      play: "â–¶ JOUER PANNE (27s)",
      stop: "â¹ ARRÃŠTER",
      criticalOnly: "Afficher phase critique",
      rocofTitle: "Taux de Variation de FrÃ©quence (ROCOF)",
      eventsTitle: "Ã‰vÃ©nements Principaux",
      contextTitle: "Contexte Technique",
      nominal: "NOMINAL",
      collapseZone: "ZONE D'EFFONDREMENT",
      error: "ERREUR CRITIQUE : COUCHE DE DONNÃ‰ES HORS LIGNE",
      errorSub: "Ã‰chec du chargement frequency_28A.json"
    },
    it: {
      title: "FREQUENZA DEL SISTEMA â€” 28 APRILE 2025",
      subtitle: "Ricostruzione basata su dati verificati ENTSO-E / PMU del collasso a cascata in 27 secondi",
      freq: "Frequenza:",
      rocof: "ROCOF:",
      status: "Stato:",
      play: "â–¶ RIPRODUCI BLACKOUT (27s)",
      stop: "â¹ FERMA",
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
      title: "SYSTEMFREQUENZ â€” 28. APRIL 2025",
      subtitle: "Rekonstruktion basierend auf verifizierten ENTSO-E / PMU-Daten des 27-Sekunden-Kaskadenkollapses",
      freq: "Frequenz:",
      rocof: "ROCOF:",
      status: "Status:",
      play: "â–¶ BLACKOUT ABSPIELEN (27s)",
      stop: "â¹ STOPP",
      criticalOnly: "Nur kritische Phase zeigen",
      rocofTitle: "Ã„nderungsrate der Frequenz (ROCOF)",
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
          rocof: point.rocof !== undefined && point.rocof !== null ? point.rocof : (idx > 0 ? Math.abs(data[idx].freq - data[idx - 1].freq) / (data[idx].t - data[idx - 1].t) : 0),
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
          return 0; // Fix it precisely at 0 when it finishes
        }
        return prev + 0.05; // Advance 50ms per tick (0.05s)
      });
    }, 50); // 50ms per iteration (smooth real-time)

    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (currentTime >= 0) setCurrentTime(-27); // Reset
    setIsPlaying(!isPlaying);
  };

  // Get current data point and interpolate if necessary
  const getCurrentValue = () => {
    const point = freqData.find(d => d.t === currentTime) || 
                  freqData.filter(d => d.t <= currentTime).pop();
    return point || { freq: 50, rocof: 0, status: 'NORMAL', event: '' };
  };

  const current = getCurrentValue();
  
  // Data for LineChart (exclude blackout t=0 point to preserve Y-axis scale)
  const lineChartData = filteredData.filter(d => d.t < 0);
  const blackoutPoint = filteredData.find(d => d.t === 0);
  
  // Data for ROCOF BarChart (enforce -120s limit in zoom)
  const collapseData = filteredData.filter(d => d.t >= -120 && d.t <= 0);
  const rocofChartData = (zoomCollapse ? collapseData : filteredData).map(d => ({
    ...d,
    rocof: d.rocof ?? 0
  }));

  const getSmoothX = (dataArray, timeVal) => {
    if (!dataArray || dataArray.length === 0) return 0;
    const nextIndex = dataArray.findIndex(d => d.t > timeVal);
    if (nextIndex === 0) return 0;
    if (nextIndex === -1) return dataArray.length - 1;
    const prevIndex = nextIndex - 1;
    const factor = (timeVal - dataArray[prevIndex].t) / (dataArray[nextIndex].t - dataArray[prevIndex].t);
    return prevIndex + factor;
  };

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
      <div className={styles.chartWrapper}>
        <div className={styles.chartTitle}>{t.title}</div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart 
            data={lineChartData}
            margin={{ top: 20, right: 150, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--forensic-amber-primary)" />
                <stop offset="100%" stopColor="var(--forensic-amber-warning)" />
              </linearGradient>
            </defs>
  
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)', fontSize: '12px' }} />
  
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis 
              dataKey="t" 
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(val) => {
                const pt = filteredData.find(d => d.t === val);
                return pt ? pt.time : val;
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[46, 51]}
              ticks={[47, 48, 49, 50]}
              allowDataOverflow={false}
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              label={{ value: 'FREQUENCY (Hz)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
            />
  
            <ReferenceLine y={50.0} stroke="var(--forensic-border)" label={{ value: t.nominal, fill: "rgba(255, 255, 255, 0.3)", position: 'insideTopRight' }} />
            <ReferenceLine y={49.0} stroke="#cc7700" strokeDasharray="8 4" strokeWidth={1} label={{ value: '49.0 Hz â€” UFLS', position: 'insideTopRight', fill: '#cc7700', fontSize: 9, fontFamily: 'monospace' }} />
            <ReferenceLine y={48.2} stroke="#cc2222" strokeDasharray="8 4" strokeWidth={1} label={{ value: '48.2 Hz â€” Point of No Return', position: 'insideTopRight', fill: '#cc2222', fontSize: 9, fontFamily: 'monospace' }} />

          {/* Reference zones */}
          <ReferenceArea y1={49.0} y2={49.8} fill="rgba(255, 170, 0, 0.05)" />
          <ReferenceArea y1={48.2} y2={49.0} fill="rgba(255, 85, 0, 0.05)" />
          <ReferenceArea y1={46} y2={48.2} fill="rgba(204, 17, 0, 0.1)" />

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
          {isPlaying && <ReferenceLine x={currentTime} stroke="var(--forensic-amber-primary)" strokeWidth={1} opacity={0.8} />}

          <Tooltip 
            contentStyle={{ backgroundColor: '#0d0f1a', border: '1px solid #ffaa33', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            labelStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)' }}
            itemStyle={{ color: 'var(--forensic-amber-primary)' }}
            labelFormatter={(label) => `T${label >= 0 ? '+' : ''}${label}s`}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Blackout Marker Badge */}
      {blackoutPoint && (
        <div style={{ background: '#cc2222', color: '#fff', padding: '8px 16px', borderRadius: '4px', display: 'flex', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '12px', marginTop: '16px', letterSpacing: '1px' }}>
          âš¡ {blackoutPoint.time} â€” BLACKOUT TOTAL â€” 0 Hz â€” 31 GW DESCONECTADOS
        </div>
      )}
      </div>

      {/* ROCOF Secondary Chart */}
      <div className={styles.chartWrapper}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 170, 51, 0.2)' }}>
          <div className={styles.chartTitle} style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>{t.rocofTitle}</div>
          <button
            onClick={() => setZoomCollapse(!zoomCollapse)}
            style={{
              background: 'transparent',
              color: zoomCollapse ? '#cc2222' : '#ffaa33',
              border: `1px solid ${zoomCollapse ? '#cc2222' : '#ffaa33'}`,
              padding: '4px 14px',
              borderRadius: '2px',
              fontFamily: 'var(--telemetry-font, monospace)',
              fontSize: '10px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {zoomCollapse ? 'â† Vista General' : 'âŒ• Zoom Colapso'}
          </button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rocofChartData} margin={{ top: 20, right: 150, left: 0, bottom: 60 }}>
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--forensic-text-secondary)', fontFamily: 'var(--telemetry-font)', fontSize: '12px' }} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
            <XAxis 
              dataKey="t" 
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              tickFormatter={(val) => {
                const pt = rocofChartData.find(d => d.t === val);
                return pt ? pt.time : val;
              }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="rgba(255, 170, 0, 0.4)"
              tick={{ fill: "rgba(255, 210, 150, 0.6)", fontSize: 11, fontFamily: 'monospace' }}
              label={{ value: 'Hz/s', angle: -90, position: 'insideLeft', fill: 'rgba(255, 170, 0, 0.5)' }}
              domain={[0, 2]}
              allowDataOverflow={false}
              tickCount={5}
              ticks={[0, 0.5, 1.0, 1.5, 2.0]}
            />
            <ReferenceLine y={0.5} stroke="#cc7700" strokeDasharray="8 4" strokeWidth={1} label={{ value: '0.5 Hz/s â€” Warning', position: 'insideTopRight', fill: '#cc7700', fontSize: 9, fontFamily: 'monospace' }} />
            <ReferenceLine y={1.0} stroke="#cc2222" strokeDasharray="8 4" strokeWidth={1} label={{ value: '1.0 Hz/s â€” Point of No Return', position: 'insideTopRight', fill: '#cc2222', fontSize: 9, fontFamily: 'monospace' }} />
            <Bar 
              dataKey="rocof" 
              fill="var(--forensic-amber-primary)"
              name={t.rocofTitle}
              radius={[2, 2, 0, 0]}
              barSize={12}
            >
              {rocofChartData.map((entry, index) => {
                const getBarColor = (rocof) => {
                  if (rocof >= 1.0) return '#cc2222';
                  if (rocof >= 0.5) return '#cc7700';
                  return '#2a7a3a';
                };
                return <Cell key={`cell-${index}`} fill={getBarColor(entry.rocof)} />;
              })}
            </Bar>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d0f1a', border: '1px solid #ffaa33', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontFamily: 'var(--telemetry-font, monospace)' }}
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
              El apagÃ³n del 28 de abril fue un colapso <strong>impulsado por sobretensiÃ³n</strong>, no por subfrecuencia.
              La pÃ©rdida de 2,200 MW de generaciÃ³n renovable en el sur de EspaÃ±a eliminÃ³ una sumidero de potencia reactiva.
              SimultÃ¡neamente, el efecto Ferranti en las lÃ­neas de transmisiÃ³n descargadas causÃ³ un pico de voltaje a 435+ kV.
            </p>
            <p>
              La <strong>paradoja del UFLS</strong>: la reducciÃ³n de carga en el UFLS redujo las corrientes de lÃ­nea, 
              intensificando el efecto Ferranti y empeorando el colapso de voltaje. La arquitectura de protecciÃ³n legada 
              no podÃ­a interpretar correctamente las firmas de falta distorsionadas de recursos basados en inversores.
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

