import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer, ReferenceArea, ComposedChart, BarChart, Bar, Cell } from 'recharts';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import TelemetryFallback from './TelemetryFallback';
import styles from './FrequencyTimeline.module.css';

const FrequencyTimeline = () => {
  const [freqData, setFreqData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-27);
  const [filteredData, setFilteredData] = useState([]);
  const [showCriticalPhaseOnly, setShowCriticalPhaseOnly] = useState(false);
  const [hasError, setHasError] = useState(false);
  const playbackIntervalRef = useRef(null);
  
  const { i18n: { currentLocale } } = useDocusaurusContext();

  const T = {
    es: {
      title: "FRECUENCIA DEL SISTEMA - 28 ABRIL 2025",
      subtitle: "Reconstrucción SCADA basada en registros ENTSO-E / PMU",
      freq: "Frecuencia:",
      rocof: "ROCOF:",
      status: "Estado:",
      play: "REPRODUCIR (27s)",
      stop: "DETENER",
      criticalOnly: "Foco crítico",
      rocofTitle: "Tasa de Cambio de Frecuencia (ROCOF)",
      eventsTitle: "Registro de Eventos",
      contextTitle: "Síntesis Técnica",
      nominal: "NOMINAL",
      collapseZone: "ZONA DE COLAPSO",
      error: "ERROR: TELEMETRÍA OFFLINE",
      errorSub: "No se pudo cargar el archivo de datos."
    },
    en: {
      title: "SYSTEM FREQUENCY - 28 APRIL 2025",
      subtitle: "SCADA reconstruction based on ENTSO-E / PMU logs",
      freq: "Frequency:",
      rocof: "ROCOF:",
      status: "Status:",
      play: "REPLAY (27s)",
      stop: "STOP",
      criticalOnly: "Critical focus",
      rocofTitle: "Rate of Change of Frequency (ROCOF)",
      eventsTitle: "Event Log",
      contextTitle: "Technical Synthesis",
      nominal: "NOMINAL",
      collapseZone: "COLLAPSE ZONE",
      error: "ERROR: TELEMETRY OFFLINE",
      errorSub: "Could not load data file."
    }
  };

  const t = T[currentLocale] || T.es;

  // Carga de datos
  useEffect(() => {
    setIsLoading(true);
    fetch('/data/frequency_28A.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) throw new Error('Empty or invalid data');
        setFreqData(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading telemetry:', err);
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  // Filtro por fase crítica
  useEffect(() => {
    if (freqData.length === 0) return;
    if (showCriticalPhaseOnly) {
      const criticalData = freqData.filter(d => d.t >= 0 && d.t <= 20);
      setFilteredData(criticalData);
      setCurrentTime(0);
    } else {
      setFilteredData(freqData);
      setCurrentTime(-27);
    }
    setIsPlaying(false);
  }, [showCriticalPhaseOnly, freqData]);

  // Reproducción automática
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const maxTime = showCriticalPhaseOnly ? 20 : 27;
          if (prev >= maxTime) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }
    return () => clearInterval(playbackIntervalRef.current);
  }, [isPlaying, showCriticalPhaseOnly]);

  // Estados de carga/error
  if (isLoading) return <TelemetryFallback />;
  if (hasError) {
    return (
      <div className={styles.container} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DC2626', textAlign: 'center', fontFamily: 'var(--font-mono, monospace)' }}>
          <h3 style={{ borderBottom: '1px solid #DC2626', paddingBottom: '8px' }}>{t.error}</h3>
          <p>{t.errorSub}</p>
        </div>
      </div>
    );
  }
  if (freqData.length === 0) return <TelemetryFallback />;

  // Punto actual
  const currentPoint = freqData.find(d => d.t === currentTime) || freqData[0];
  const blackoutPoint = freqData.find(d => d.freq === 0 && d.t <= currentTime);

  const getStatusColor = (freq) => {
    if (freq === 0) return '#DC2626';
    if (freq < 48.2) return '#DC2626';
    if (freq < 49.0) return '#D97706';
    if (freq > 50.2) return '#D97706';
    return '#A1A1AA';
  };

  // Datos para el gráfico de líneas (frecuencia)
  const lineChartData = filteredData.map(d => ({
    ...d,
    freq: d.t <= currentTime ? d.freq : null
  }));

  // Datos para el gráfico de barras (ROCOF) – manejo seguro de nulos
  const rocofChartData = filteredData.map(d => ({
    ...d,
    rocof: (d.t <= currentTime && d.rocof != null) ? Math.abs(d.rocof) : 0
  }));

  // Colores SCADA
  const scadaGrid = "rgba(255, 255, 255, 0.08)";
  const scadaText = "#A1A1AA";
  const scadaLine = "#E4E4E7";
  const scadaWarn = "#D97706";
  const scadaCrit = "#DC2626";

  // Formateador para el eje X (muestra la hora real)
  const formatXAxis = (tickValue) => {
    const point = filteredData.find(d => d.t === tickValue);
    return point ? point.time : tickValue;
  };

  // Formateador para tooltip del gráfico de frecuencia
  const formatFreqTooltipLabel = (label) => {
    const point = filteredData.find(d => d.t === label);
    return point ? `Tiempo: ${point.time}` : `t = ${label}s`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>
        <div className={styles.controls}>
          <button 
            className={styles.controlBtn} 
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? t.stop : t.play}
          </button>
          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={showCriticalPhaseOnly}
              onChange={(e) => setShowCriticalPhaseOnly(e.target.checked)}
            />
            {t.criticalOnly}
          </label>
        </div>
      </div>

      <div className={styles.telemetryDashboard}>
        <div className={styles.metricBox} style={{ borderLeftColor: getStatusColor(currentPoint.freq) }}>
          <div className={styles.metricLabel}>{t.freq}</div>
          <div className={styles.metricValue} style={{ color: getStatusColor(currentPoint.freq) }}>
            {currentPoint.freq.toFixed(2)} Hz
          </div>
          <div className={styles.metricTime}>{currentPoint.time}</div>
        </div>
        <div className={styles.metricBox}>
          <div className={styles.metricLabel}>{t.rocof}</div>
          <div className={styles.metricValue} style={{ color: currentPoint.rocof && Math.abs(currentPoint.rocof) > 0.5 ? scadaWarn : scadaText }}>
            {currentPoint.rocof ? Math.abs(currentPoint.rocof).toFixed(3) : '0.000'} Hz/s
          </div>
        </div>
        <div className={styles.metricBox}>
          <div className={styles.metricLabel}>{t.status}</div>
          <div className={styles.metricValue} style={{ color: currentPoint.event_type === 'critical' ? scadaCrit : scadaText, fontSize: '14px' }}>
            {currentPoint.event || 'NOMINAL'}
          </div>
        </div>
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={lineChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={scadaGrid} vertical={false} />
            <XAxis 
              dataKey="t" 
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke={scadaText}
              tick={{ fill: scadaText, fontSize: 11, fontFamily: 'var(--font-sans, sans-serif)' }}
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis 
              domain={[46, 51]}
              ticks={[47, 48, 49, 50]}
              stroke={scadaText}
              tick={{ fill: scadaText, fontSize: 11, fontFamily: 'var(--font-sans, sans-serif)' }}
              label={{ value: 'Hz', angle: -90, position: 'insideLeft', fill: scadaText }}
            />
  
            <ReferenceLine y={50.0} stroke={scadaText} strokeOpacity={0.5} strokeDasharray="4 4" />
            <ReferenceLine y={49.0} stroke={scadaWarn} strokeDasharray="4 4" strokeWidth={1} label={{ value: '49.0 Hz - UFLS', position: 'insideTopRight', fill: scadaWarn, fontSize: 10 }} />
            <ReferenceLine y={48.2} stroke={scadaCrit} strokeDasharray="4 4" strokeWidth={1} label={{ value: '48.2 Hz - CRITICAL', position: 'insideTopRight', fill: scadaCrit, fontSize: 10 }} />

            <ReferenceArea y1={46.0} y2={48.2} fill={scadaCrit} fillOpacity={0.05} />

            <Line 
              type="monotone" 
              dataKey="freq" 
              stroke={scadaLine} 
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
              name="Frequency"
            />

            {isPlaying && <ReferenceLine x={currentTime} stroke={scadaText} strokeWidth={1} opacity={0.8} />}

            <Tooltip 
              contentStyle={{ backgroundColor: '#111418', border: '1px solid #272A30', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
              labelStyle={{ color: scadaText, fontFamily: 'var(--font-sans, sans-serif)', fontSize: '12px' }}
              itemStyle={{ color: scadaLine, fontFamily: 'var(--font-mono, monospace)' }}
              labelFormatter={formatFreqTooltipLabel}
              formatter={(value) => [`${value.toFixed(2)} Hz`, 'Frecuencia']}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {blackoutPoint && (
          <div className={styles.institutionalAlert}>
            [INCIDENTE CRÍTICO] {blackoutPoint.time} - BLACKOUT - 0 Hz - 31 GW DESCONECTADOS
          </div>
        )}
      </div>

      <div className={styles.chartWrapper} style={{ marginTop: '24px' }}>
        <h3 className={styles.chartTitle}>{t.rocofTitle}</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={rocofChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={scadaGrid} vertical={false} />
            <XAxis 
              dataKey="t" 
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke={scadaText}
              tick={{ fill: scadaText, fontSize: 11, fontFamily: 'var(--font-sans, sans-serif)' }}
              tickFormatter={formatXAxis}
              minTickGap={30}
            />
            <YAxis 
              stroke={scadaText}
              tick={{ fill: scadaText, fontSize: 11, fontFamily: 'var(--font-sans, sans-serif)' }}
              domain={[0, 2]}
              allowDataOverflow={false}
              ticks={[0, 0.5, 1.0, 1.5, 2.0]}
            />
            <ReferenceLine y={0.5} stroke={scadaWarn} strokeDasharray="4 4" strokeWidth={1} />
            <ReferenceLine y={1.0} stroke={scadaCrit} strokeDasharray="4 4" strokeWidth={1} />
            
            <ReferenceArea y1={1.0} y2={2.0} fill={scadaCrit} fillOpacity={0.05} />

            <Bar 
              dataKey="rocof" 
              name="ROCOF"
              radius={[2, 2, 0, 0]}
              barSize={8}
            >
              {rocofChartData.map((entry, index) => {
                const getBarColor = (rocof) => {
                  if (rocof >= 1.0) return scadaCrit;
                  if (rocof >= 0.5) return scadaWarn;
                  return '#52525B';
                };
                return <Cell key={`rocof-bar-${index}`} fill={getBarColor(entry.rocof)} />;
              })}
            </Bar>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111418', border: '1px solid #272A30', borderRadius: '4px' }}
              labelStyle={{ color: scadaText, fontSize: '12px' }}
              itemStyle={{ color: scadaLine }}
              labelFormatter={formatFreqTooltipLabel}
              formatter={(value) => [`${value.toFixed(3)} Hz/s`, 'ROCOF']}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.eventsSection}>
        <h3 className={styles.chartTitle}>{t.eventsTitle}</h3>
        <div className={styles.eventsList}>
          {freqData.filter(d => d.event_type && d.event_type !== 'normal').map((point, idx) => (
            <div key={idx} className={styles.eventCard} style={{ borderLeftColor: point.event_type === 'critical' ? scadaCrit : scadaWarn }}>
              <span className={styles.eventTime}>{point.time}</span>
              <span className={styles.eventDesc}>{point.event}</span>
              <span className={styles.eventFreq}>{point.freq.toFixed(2)} Hz</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrequencyTimeline;
