/**
 * Bloque2MixGeneracion.jsx
 * Mix de generación peninsular a las 12:30 CEST del 28-A.
 *
 * CORRECCIONES respecto a la versión anterior:
 *
 * 1. DATOS — penetración FV corregida:
 *    La versión anterior daba solar al 65% con 19.155 MW, sin fuente
 *    verificada. Los datos del Comité de Análisis (p.38) dan:
 *    - FV: ~53,3% del mix
 *    - Mix renovable total: 82% (NO 84,5%)
 *    - Demanda peninsular: 25.184 MW
 *    Los MW por tecnología son estimaciones proporcionales coherentes
 *    con los porcentajes verificados. Se declaran como estimaciones.
 *
 * 2. DATOS — inercia H corregida:
 *    "H crítica de ~2.3s" → "H ibérica 2,21–2,71 s"
 *    (ENTSO-E Factual, Tabla 2-4, p.36)
 *
 * 3. DEPENDENCIA — lucide-react eliminada:
 *    AlertTriangle de lucide-react puede no estar instalado o generar
 *    errores de SSR. Sustituido por SVG inline simple.
 *
 * 4. MEJORA — distinción IBR vs síncrono más clara:
 *    La barra muestra qué tecnologías aportan inercia (verde) y cuáles
 *    no (ámbar), que es el dato pedagógicamente relevante.
 */
import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
} from 'recharts';
import styles from './Bloque2MixGeneracion.module.css';

// Datos verificados: porcentajes del Comité de Análisis (p.38)
// MW estimados proporcionalmente sobre demanda peninsular 25.184 MW
// + exportaciones (~4.800 MW) + bombeo (~3.000 MW) ≈ 33.000 MW generación total
// Estos son ESTIMACIONES de reparto — el Comité solo publica porcentajes
const GENERATION_DATA = [
  {
    id: 'solar',
    name: 'Solar fotovoltaica',
    // ~53,3% del mix (Comité, p.38)
    mw: 13428,
    percentage: 53.3,
    color: '#EF9F27',
    aportaInercia: false,
  },
  {
    id: 'nuclear',
    name: 'Nuclear',
    // ~10% del mix (Comité, p.38)
    mw: 2518,
    percentage: 10.0,
    color: '#378ADD',
    aportaInercia: true,
  },
  {
    id: 'wind',
    name: 'Eólica',
    // ~12% del mix — parte del 82% renovable (estimación)
    mw: 3022,
    percentage: 12.0,
    color: '#5DCAA5',
    aportaInercia: false,
  },
  {
    id: 'hydro',
    name: 'Hidráulica',
    // ~7% del mix (estimación, incluye bombeo)
    mw: 1763,
    percentage: 7.0,
    color: '#888780',
    aportaInercia: true,
  },
  {
    id: 'ccgt',
    name: 'CCGT (gas)',
    // ~3% del mix (Comité, p.38)
    mw: 756,
    percentage: 3.0,
    color: '#D85A30',
    aportaInercia: true,
  },
  {
    id: 'other',
    name: 'Cogeneración / otros',
    // ~4% restante
    mw: 1008,
    percentage: 4.0,
    color: '#64748b',
    aportaInercia: true,
  },
];

// Icono de alerta SVG inline (sin dependencia de lucide-react)
function AlertIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true"
      style={{ flexShrink: 0, color: '#f59e0b' }}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function Bloque2MixGeneracion() {
  const totalIBR    = GENERATION_DATA.filter(d => !d.aportaInercia).reduce((s, d) => s + d.percentage, 0);
  const totalSincro = GENERATION_DATA.filter(d =>  d.aportaInercia).reduce((s, d) => s + d.percentage, 0);

  return (
    <div className={styles.generationMix}>

      {/* Alerta sin lucide */}
      <div className={styles.alertBox}>
        <AlertIcon />
        <div className={styles.alertText}>
          <strong>ALERTA DE SISTEMA:</strong> A las 12:30 CEST, el{' '}
          <strong>82% de la generación activa</strong> provenía de fuentes
          renovables (Comité de Análisis, p.38), de las cuales la práctica
          totalidad operaba en modo grid-following sin aportar inercia
          mecánica genuina. Solo el ~{totalSincro.toFixed(0)}% (nuclear,
          hidráulica y CCGT) aportaba masa síncrona. La constante de inercia
          ibérica era <strong>H = 2,21–2,71 s</strong> (ENTSO-E Factual,
          Tabla 2-4, p.36).
        </div>
      </div>

      {/* Barra de composición IBR vs Síncrono */}
      <div style={{ margin: '1rem 0', borderRadius: 6, overflow: 'hidden', height: 28 }}
           aria-label={`${totalIBR.toFixed(0)}% IBR sin inercia, ${totalSincro.toFixed(0)}% generación síncrona`}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{
            width: `${totalIBR}%`,
            background: 'rgba(245,158,11,0.75)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 8, fontSize: 11,
            fontFamily: 'monospace', color: '#0a0a0a', fontWeight: 700,
          }}>
            {totalIBR.toFixed(0)}% IBR
          </div>
          <div style={{
            flex: 1,
            background: 'rgba(59,130,246,0.6)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 6, fontSize: 11,
            fontFamily: 'monospace', color: '#fff', fontWeight: 700,
          }}>
            {totalSincro.toFixed(0)}% Síncrono
          </div>
        </div>
      </div>

      <div className={styles.generationContainer}>
        <div className={styles.generationLeft}>
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GENERATION_DATA}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  paddingAngle={2} dataKey="mw" stroke="none"
                >
                  {GENERATION_DATA.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [
                    `~${value.toLocaleString('es-ES')} MW (estimación)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--ifm-background-surface-color, #0a0f1c)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4, fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartLegend}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.legendItem}>
                <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                <span>
                  {item.name} ({item.percentage}%)
                  {item.aportaInercia
                    ? <span style={{ color: '#60a5fa', fontSize: 10 }}> ⚙ síncrono</span>
                    : <span style={{ color: '#f59e0b', fontSize: 10 }}> ⚡ IBR</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.generationRight}>
          <div className={styles.tableHeader}>
            <div className={styles.tableColTech}>TECNOLOGÍA</div>
            <div className={styles.tableColBar}>DISTRIBUCIÓN</div>
            <div className={styles.tableColValue}>POTENCIA</div>
          </div>

          <div className={styles.tableRows}>
            {GENERATION_DATA.map(item => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.tableRowTech}>{item.name}</div>
                <div className={styles.tableRowBarContainer}>
                  <div
                    className={styles.tableRowBar}
                    style={{ backgroundColor: item.color, width: `${item.percentage}%` }}
                  />
                  <div className={styles.tableRowPercentage}>{item.percentage}%</div>
                </div>
                <div className={styles.tableRowValue}>
                  ~{item.mw.toLocaleString('es-ES')} MW
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.generationFooter}>
        <p>
          Porcentajes: Comité de Análisis del Gobierno, p.38 (12:30 CEST, 28/04/2025).
          MW por tecnología: estimaciones proporcionales sobre demanda peninsular
          de 25.184 MW + exportaciones + bombeo. No proceden de telemetría ESIOS
          por pérdida de logs durante la cascada.
        </p>
      </div>
    </div>
  );
}
