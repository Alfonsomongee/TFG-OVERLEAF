import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import datosForenses from '@site/src/data/datosForenses.json';
import styles from './CollapseSismograph.module.css';

export default function CollapseSismograph({ playbackT = 32.7,  isGallery }) {
  const lang = useDocLang();
  const duration = datosForenses.cronologia_cascada.duracion_cascada.valor;
  const t_max = datosForenses.potencias_cascada.tension_maxima_barras_colectoras.valor || 440;
  const p_lost = datosForenses.potencias_cascada.perdida_generacion_total_cascada.valor || 15000;
  const sync_freq = datosForenses.cronologia_cascada.frecuencia_perdida_sincronismo.valor || 48.46;

  // Los 11+ puntos sincronizados con la narrativa y la Tabla 16
  const allCascadeData = useMemo(() => [
    { time: 0, timeLabel: '12:32:57', freq: 50.00, volt: 418, lostMW: 0, event: 'Disparo raíz (Transf. Granada)' },
    { time: 8, timeLabel: '12:33:05', freq: 49.98, volt: 420, lostMW: 317, event: 'Desconexión GDR local' },
    { time: 19, timeLabel: '12:33:16', freq: 49.95, volt: 425, lostMW: 1044, event: 'Cascada en Badajoz' },
    { time: 20, timeLabel: '12:33:17', freq: 49.90, volt: 428, lostMW: 1594, event: 'Cascada Segovia/Sevilla' },
    { time: 21, timeLabel: '12:33:18', freq: 49.80, volt: 432, lostMW: 3000, event: 'Aceleración del colapso (Tap-Lag)' },
    { time: 22, timeLabel: '12:33:19', freq: 49.70, volt: 435, lostMW: 5000, event: 'Superación umbral LVRT normativo' },
    { time: 23, timeLabel: '12:33:20', freq: 49.50, volt: 438, lostMW: 8000, event: '1er escalón UFLS: Deslastre Bombeo' },
    { time: 24, timeLabel: '12:33:21', freq: sync_freq, volt: t_max, lostMW: 12000, event: 'Pérdida de Sincronismo Transpirenaico' },
    { time: 25, timeLabel: '12:33:22', freq: 48.00, volt: 442, lostMW: 14000, event: 'Aislamiento y sobretensiones pico' },
    { time: 26, timeLabel: '12:33:23', freq: 47.50, volt: 443, lostMW: 14500, event: 'Caída libre de frecuencia' },
    { time: 27, timeLabel: '12:33:24', freq: 47.00, volt: 0, lostMW: p_lost, event: 'Cero funcional del sistema (ENTSO-E)' },
    { time: 32.7, timeLabel: '12:33:29', freq: 0, volt: 0, lostMW: p_lost, event: 'Disparo último grupo (Comité)' }
  ], [t_max, p_lost, sync_freq]);

  const cascadeData = useMemo(
    () => allCascadeData.filter(d => d.time <= playbackT),
    [allCascadeData, playbackT]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTime}>{data.timeLabel}</span>
            <span className={styles.tooltipSec}>(t = {data.time} s)</span>
          </div>
          <div className={styles.tooltipBody}>
            <p className={styles.tooltipEvent}><strong>Falla:</strong> {data.event}</p>
            <div className={styles.metricsGrid}>
              <div className={styles.metricRow}>
                <span className={styles.dot} style={{background: '#06b6d4'}}></span>
                <span className={styles.metricLabel}>Frecuencia:</span>
                <span className={styles.metricValue}>{data.freq.toFixed(2)} Hz</span>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.dot} style={{background: '#ef4444'}}></span>
                <span className={styles.metricLabel}>Tensión 400kV:</span>
                <span className={styles.metricValue}>{data.volt.toFixed(0)} kV</span>
              </div>
              <div className={styles.metricRow}>
                <span className={styles.dot} style={{background: '#f59e0b'}}></span>
                <span className={styles.metricLabel}>Pot. Perdida:</span>
                <span className={styles.metricValue}>{data.lostMW} MW</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.sismographContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.indicator}></span>
          Sismógrafo del Colapso ({duration} segundos: 12:32:57 → 12:33:27 CEST)
        </h3>
      </div>

      {/* ── CONTADOR EN TIEMPO REAL ─────────────────────────────────────── */}
{(() => {
  const current = cascadeData[cascadeData.length - 1];
  if (!current) return null;
  const isCollapsing = current.freq < 49.5;
  const isVoltCritical = current.volt > 435;

  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      marginBottom: '1rem',
      fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
      borderRadius: '6px',
      overflow: 'hidden',
      border: '1px solid rgba(0,217,255,0.12)',
    }}>
      {/* Frecuencia */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: isCollapsing
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(6,182,212,0.06)',
        borderRight: '1px solid rgba(0,217,255,0.1)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Frecuencia
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: isCollapsing ? '#ef4444' : '#06b6d4',
          transition: 'color 0.3s ease',
        }}>
          {current.freq.toFixed(2)}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            Hz
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: isCollapsing ? '#ef444480' : '#06b6d440',
        }}>
          {isCollapsing
            ? `▼ ${(50 - current.freq).toFixed(2)} Hz bajo nominal`
            : 'Nominal 50 Hz'}
        </div>
      </div>

      {/* Tensión */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: isVoltCritical
          ? 'rgba(239,68,68,0.08)'
          : 'rgba(239,68,68,0.04)',
        borderRight: '1px solid rgba(0,217,255,0.1)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Tensión 400 kV
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: isVoltCritical ? '#ef4444' : '#f87171',
          transition: 'color 0.3s ease',
        }}>
          {current.volt > 0 ? current.volt.toFixed(0) : '—'}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            kV
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: isVoltCritical ? '#ef444480' : '#ef444430',
        }}>
          {isVoltCritical
            ? `▲ ${(current.volt - 420).toFixed(0)} kV sobre nominal`
            : 'Nominal 420 kV'}
        </div>
      </div>

      {/* Potencia perdida */}
      <div style={{
        flex: 1,
        padding: '10px 14px',
        background: 'rgba(245,158,11,0.05)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Generación perdida
        </div>
        <div style={{
          fontSize: '1.6rem',
          fontWeight: 700,
          lineHeight: 1,
          color: current.lostMW > 10000 ? '#ef4444'
               : current.lostMW > 3000  ? '#f59e0b'
               : '#fbbf24',
          transition: 'color 0.3s ease',
        }}>
          {(current.lostMW / 1000).toFixed(1)}
          <span style={{ fontSize: '0.65rem', color: '#4b5563', marginLeft: 4 }}>
            GW
          </span>
        </div>
        <div style={{
          fontSize: '9px',
          marginTop: '4px',
          color: '#f59e0b40',
        }}>
          {current.lostMW > 0
            ? `${((current.lostMW / 29600) * 100).toFixed(0)}% cap. peninsular`
            : 'Sistema estable'}
        </div>
      </div>

      {/* Evento actual */}
      <div style={{
        flex: 2,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '0.12em',
          color: '#4b5563',
          marginBottom: '4px',
          textTransform: 'uppercase',
        }}>
          Evento — {current.timeLabel}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--ifm-color-emphasis-600)',
          lineHeight: 1.4,
        }}>
          {current.event}
        </div>
        <div style={{
          marginTop: '6px',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
        }}>
          <div style={{
            width: 6, height: 6,
            borderRadius: '50%',
            background: isCollapsing ? '#ef4444' : '#10b981',
            boxShadow: isCollapsing ? '0 0 6px #ef4444' : '0 0 6px #10b981',
          }}>
            {isCollapsing && (
              <style>{`
                @keyframes pulse-red {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.3; }
                }
              `}</style>
            )}
          </div>
          <span style={{
            fontSize: '9px',
            fontFamily: 'var(--font-mono, monospace)',
            color: isCollapsing ? '#ef4444' : '#10b981',
            letterSpacing: '0.08em',
          }}>
            {isCollapsing ? 'COLAPSO EN CURSO' : 'SISTEMA OPERATIVO'}
          </span>
        </div>
      </div>
    </div>
  );
})()}

      <div className={styles.chartWrapper}>
        <BrowserOnly fallback={<div className={styles.loading}>Activando telemetría forense...</div>}>
          {() => (
            <ResponsiveContainer width="100%" height={480}>
              <ComposedChart data={cascadeData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                
                <XAxis 
                  dataKey="time" 
                  type="number"
                  domain={[0, 33]}
                  tick={{ fill: 'var(--text-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  tickFormatter={(val) => `${val}s`}
                  stroke="rgba(255,255,255,0.1)"
                />
                
                <YAxis 
                  yAxisId="freq"
                  domain={[46, 50.5]}
                  tick={{ fill: '#06b6d4', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  stroke="rgba(6, 182, 212, 0.3)"
                  orientation="left"
                  label={{ value: 'Frecuencia (Hz)', angle: -90, position: 'insideLeft', fill: '#06b6d4', style: {textAnchor: 'middle'} }}
                />
                
                <YAxis 
                  yAxisId="volt"
                  domain={[400, 450]}
                  tick={{ fill: '#ef4444', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  stroke="rgba(239, 68, 68, 0.3)"
                  orientation="right"
                  label={{ value: 'Tensión (kV)', angle: 90, position: 'insideRight', fill: '#ef4444', style: {textAnchor: 'middle'} }}
                />

                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2, strokeDasharray: '4 4' }} />

                {/* Línea horizontal de UFLS */}
                <ReferenceLine 
                  yAxisId="freq" 
                  y={49.0} 
                  stroke="rgba(245, 158, 11, 0.6)" 
                  strokeDasharray="4 4"
                  label={{ position: 'insideBottomLeft', value: 'Umbral UFLS Demanda (49.0 Hz)', fill: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}
                />

                {/* Área Fantasma (Generación Perdida escalada en background) */}
                <Area 
                  yAxisId="volt" 
                  type="stepAfter" 
                  dataKey="lostMW" 
                  fill="url(#colorLost)" 
                  stroke="none"
                />

                {/* Tensión */}
                <Line 
                  yAxisId="volt"
                  type="monotone"
                  dataKey="volt"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#ef4444', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={2000}
                />

                {/* Frecuencia */}
                <Line 
                  yAxisId="freq"
                  type="stepAfter"
                  dataKey="freq"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#06b6d4', strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={2000}
                />

              </ComposedChart>
            </ResponsiveContainer>
          )}
        </BrowserOnly>
      </div>
    </div>
  );
}
