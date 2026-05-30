// src/components/RadarVulnerabilidad.jsx
// Radar de vulnerabilidad multidimensional: Hoy vs 28-A (colapso)
// Datos canónicos del 28-A desde datos28A.json. Datos actuales vía proxy ESIOS con caché.

import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import datos28A from '@site/static/data/datos28A.json';

// ---------- Valores NORMALIZADOS canónicos (según datos28A.json) ----------
// 100 = máximo riesgo conocido (28-A), 0 = mínimo riesgo
// Unidades: renovable (%), inercia (inversa, s), exportación neta (% del máximo estructural 5 GW),
// precio negativo (riesgo alto si precio < 10 €/MWh), demanda relativa (respecto a 25.184 MW del 28-A)
const BLACKOUT_NORMALIZED = {
  'Penetración renovable': 82.0,           // mix_renovable_instantaneo.valor = 82%
  'Inercia estimada (inv.)': (() => {
    // Rango de inercia canónico: 2.17 - 2.67 s (España). El riesgo aumenta cuanto más baja es.
    // Normalizamos: H = 2.17 s → 100% riesgo, H = 4.5 s → 0% riesgo.
    const H_blackout = datos28A.inercia.H_espana_rango_min.valor; // 2.17 s
    const H_safe = 4.5;
    const risk = ((H_safe - H_blackout) / (H_safe - 2.0)) * 100;
    return Math.min(100, Math.max(0, risk));
  })(),
  'Exportación neta': (() => {
    // Exportación total a las 12:30: 1000 (FR) + 2000 (PT) + 800 (MA) = 3800 MW.
    // Máximo estructural teórico (suma de capacidades) ≈ 5.000 MW.
    const export_total = datos28A.sistema_operativo_1230.exportacion_espana_francia.valor +
                         datos28A.sistema_operativo_1230.exportacion_espana_portugal.valor +
                         datos28A.sistema_operativo_1230.exportacion_espana_marruecos.valor; // 3800 MW
    return (export_total / 5000) * 100;
  })(),
  'Precio negativo': 100,                  // El 28-A el precio horario cayó a -2,5 €/MWh → riesgo máximo
  'Demanda relativa': (() => {
    const demanda_28A = datos28A.sistema_operativo_1230.demanda_peninsular_espana.valor; // 25184 MW
    const pico_invierno = 45000; // MW (referencia histórica)
    return (demanda_28A / pico_invierno) * 100;
  })()
};

// ---------- Componente interno ----------
function RadarVulnerabilidadInner() {
  const [Plot, setPlot] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [proxyWarning, setProxyWarning] = useState(false);

  useEffect(() => {
    import('react-plotly.js').then(m => setPlot(() => m.default));
  }, []);

  const fetchCurrentMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/esios-multi'); // Proxy serverless con caché de 5 min
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Validar que al menos tenga los campos esenciales
      if (data.penetracion_renovable === undefined) throw new Error('Respuesta incompleta');
      setCurrentData(data);
      setProxyWarning(false);
      setLastUpdate(new Date());
    } catch (err) {
      console.warn('Proxy ESIOS falló, usando valores simulados conservadores:', err);
      // Simulación conservadora (riesgo bajo) para que el radar no colapse visualmente
      setCurrentData({
        penetracion_renovable: 65,
        inercia_estimada: 3.2,
        intercambio_neto: -1500,
        precio_spot: 55,
        demanda: 28000
      });
      setProxyWarning(true);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchCurrentMetrics()]).finally(() => setLoading(false));
    const interval = setInterval(fetchCurrentMetrics, 300000); // refresco cada 5 min
    return () => clearInterval(interval);
  }, [fetchCurrentMetrics]);

  if (!Plot || loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>Cargando radar...</div>;
  if (!currentData) return <div>No se pudieron obtener métricas actuales.</div>;

  // Calcular dimensiones normalizadas del estado actual (siguiendo la misma escala que BLACKOUT_NORMALIZED)
  const calcHoy = () => {
    const penetracion = Math.min(100, currentData.penetracion_renovable ?? 0);
    const inercia = currentData.inercia_estimada ?? 3.5;
    const riskInercia = Math.max(0, Math.min(100, ((4.5 - inercia) / (4.5 - 2.0)) * 100));
    const exportNeta = currentData.intercambio_neto !== null && currentData.intercambio_neto < 0
      ? Math.min(100, (-currentData.intercambio_neto / 5000) * 100)
      : 0;
    const precio = currentData.precio_spot !== null
      ? Math.min(100, Math.max(0, (10 - currentData.precio_spot) / 10 * 100))
      : 50;
    const demandaRelativa = currentData.demanda !== null
      ? Math.min(100, (currentData.demanda / 45000) * 100)
      : 50;
    return [penetracion, riskInercia, exportNeta, precio, demandaRelativa];
  };

  const categories = Object.keys(BLACKOUT_NORMALIZED);
  const valHoy = calcHoy();
  const val28A = Object.values(BLACKOUT_NORMALIZED);

  const vulnHoy = (valHoy.reduce((a, b) => a + b, 0) / valHoy.length).toFixed(1);
  const vuln28A = (val28A.reduce((a, b) => a + b, 0) / val28A.length).toFixed(1);
  const vulnColor = vulnHoy > 70 ? '#ef4444' : vulnHoy > 45 ? '#f59e0b' : '#10b981';
  const vulnLabel = vulnHoy > 70 ? 'CRÍTICO' : vulnHoy > 45 ? 'ALERTA' : 'ESTABLE';

  const traces = [
    {
      type: 'scatterpolar', r: [...val28A, val28A[0]], theta: [...categories, categories[0]],
      fill: 'toself', name: 'Referencia (28-A)', fillcolor: 'rgba(239,68,68,0.12)',
      line: { color: '#ef4444', width: 2 }, marker: { color: '#ef4444', size: 5 },
      hovertemplate: '<b>%{theta}</b><br>Referencia: %{r:.1f}/100<extra></extra>'
    },
    {
      type: 'scatterpolar', r: [...valHoy, valHoy[0]], theta: [...categories, categories[0]],
      fill: 'toself', name: `Ahora (${lastUpdate?.toLocaleTimeString('es-ES') ?? '...'})`,
      fillcolor: 'rgba(6,182,212,0.12)', line: { color: '#06b6d4', width: 2.5 },
      marker: { color: '#06b6d4', size: 6 },
      hovertemplate: '<b>%{theta}</b><br>Ahora: %{r:.1f}/100<extra></extra>'
    }
  ];

  const layout = {
    polar: {
      radialaxis: { range: [0, 100], tickvals: [25,50,75,100], ticktext: ['25','50','75','100'], gridcolor: 'rgba(255,255,255,0.08)', color: '#a0a0b0' },
      angularaxis: { gridcolor: 'rgba(255,255,255,0.08)', color: '#a0a0b0' },
      bgcolor: 'rgba(0,0,0,0)'
    },
    plot_bgcolor: 'rgba(0,0,0,0)', paper_bgcolor: 'rgba(0,0,0,0)',
    legend: { orientation: 'h', y: -0.15, font: { color: '#a0a0b0', size: 11 } },
    margin: { t: 30, b: 60, l: 40, r: 40 },
    font: { family: 'Inter, sans-serif', color: '#a0a0b0' }, height: 420
  };

  return (
    <div style={{ background: 'transparent', padding: '1rem 0' }}>
      {proxyWarning && <div style={{ backgroundColor: '#ffcc00', color: '#000', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.8rem' }}>⚠️ Datos actuales estimados (proxy ESIOS no disponible).</div>}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ flex:1, background: 'rgba(255,255,255,0.03)', border: `1px solid ${vulnColor}44`, borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#a0a0b0', textTransform: 'uppercase' }}>Índice vulnerabilidad ahora</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: vulnColor }}>{vulnHoy}<small style={{ fontSize: '1rem' }}>/100</small></div>
          <div style={{ fontSize: '0.6rem', background: `${vulnColor}22`, color: vulnColor, display: 'inline-block', padding: '0.15rem 0.6rem', borderRadius: '20px' }}>{vulnLabel}</div>
        </div>
        <div style={{ flex:1, background: 'rgba(255,255,255,0.03)', border: '1px solid #ef444444', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#a0a0b0', textTransform: 'uppercase' }}>Índice vulnerabilidad 28-A</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>{vuln28A}<small style={{ fontSize: '1rem' }}>/100</small></div>
          <div style={{ fontSize: '0.6rem', background: '#ef444422', color: '#ef4444', display: 'inline-block', padding: '0.15rem 0.6rem', borderRadius: '20px' }}>COLAPSO</div>
        </div>
      </div>

      <Plot data={traces} layout={layout} config={{ responsive: true, displayModeBar: false }} style={{ width: '100%' }} />

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'rgba(160,155,140,0.7)', borderLeft: '3px solid rgba(255,170,0,0.3)', padding: '0.5rem 1rem' }}>
        <p><strong>Nota sobre la inercia:</strong> El rango canónico para España el 28-A fue <strong>{datos28A.inercia.H_espana_rango_min.valor}–{datos28A.inercia.H_espana_rango_max.valor} s</strong>. ENTSO-E concluye que incluso con inercia significativamente mayor no se habría evitado la pérdida de sincronismo (mecanismo dominante fue tensión Q-V).</p>
        <p>Cuanto más se aproxima el polígono azul al rojo, mayor similitud con condiciones del colapso. Actualizado: {lastUpdate?.toLocaleTimeString('es-ES') ?? '...'} · Fuente: ESIOS (vía proxy) + datos28A.json</p>
      </div>
    </div>
  );
}

export default function RadarVulnerabilidad() {
  return (
    <BrowserOnly fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>Cargando radar...</div>}>
      {() => <RadarVulnerabilidadInner />}
    </BrowserOnly>
  );
}