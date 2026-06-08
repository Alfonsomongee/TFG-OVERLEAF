// src/hooks/useEsiosAnalysis.js
// Hook que obtiene el snapshot ESIOS actual y genera un análisis comparativo
// con los valores del 28-A usando DeepSeek/Groq vía /api/esios-analysis.
//
// USO en cualquier componente de datos en tiempo real:
//
//   import { useEsiosAnalysis } from '@site/src/hooks/useEsiosAnalysis';
//
//   const { analysis, loading, error, current, reference } =
//     useEsiosAnalysis('penetracion_renovable');
//
//   {analysis && <p className={styles.analysisText}>{analysis}</p>}

import { useState, useEffect, useRef, useCallback } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Valores de referencia del 28-A (espejo del JSON estático para evitar fetch)
const DATOS_28A = {
  demanda:                 { peninsular_MW: 25184 },
  mix_generacion:          { renovable_total_porcentaje: 82, fotovoltaica_porcentaje: 53.3 },
  intercambios_internacionales: { exportacion_francia_MW: 870 },
  inercia_y_estabilidad:   { inercia_espana_s: '2,17–2,67' },
  precio_28A:              18.50,
};

// Cache en memoria para no regenerar en cada render
const analysisCache = new Map(); // key: `${metric}_${Math.round(value/10)}` → { analysis, ts }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

export function useEsiosAnalysis(metric, options = {}) {
  const { pollInterval = 300_000 } = options; // default: 5 min
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const locale = ['es', 'en', 'de', 'zh-Hans'].includes(currentLocale) ? currentLocale : 'es';

  const [analysis, setAnalysis]   = useState(null);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);
  const [current,  setCurrent]    = useState(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const fetchAndAnalyze = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      // 1. Obtener snapshot ESIOS actual
      const snapRes = await fetch('/api/esios-multi', {
        signal: abortRef.current.signal,
      });
      if (!snapRes.ok) throw new Error(`ESIOS snapshot error ${snapRes.status}`);
      const snapshot = await snapRes.json();

      const value = snapshot[metric];
      if (value === null || value === undefined) {
        setError(`Métrica '${metric}' no disponible en el snapshot ESIOS`);
        setLoading(false);
        return;
      }

      setCurrent({ value, timestamp: snapshot.timestamp });

      // 2. Comprobar cache
      const cacheKey = `${metric}_${Math.round(value / 5)}_${locale}`;
      const cached = analysisCache.get(cacheKey);
      if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        setAnalysis(cached.analysis);
        setLoading(false);
        return;
      }

      // 3. Generar análisis con DeepSeek/Groq
      const analysisRes = await fetch('/api/esios-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          current:       { value, timestamp: snapshot.timestamp },
          reference28A:  DATOS_28A,
          metric,
          locale,
        }),
      });

      if (!analysisRes.ok) throw new Error(`Analysis API error ${analysisRes.status}`);
      const data = await analysisRes.json();

      if (data.analysis) {
        setAnalysis(data.analysis);
        analysisCache.set(cacheKey, { analysis: data.analysis, ts: Date.now() });
      } else {
        setError('No se pudo generar el análisis');
      }

      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [metric, locale]);

  useEffect(() => {
    fetchAndAnalyze();
    timerRef.current = setInterval(fetchAndAnalyze, pollInterval);
    return () => {
      abortRef.current?.abort();
      clearInterval(timerRef.current);
    };
  }, [fetchAndAnalyze, pollInterval]);

  return {
    analysis,   // string | null — párrafo analítico listo para renderizar
    loading,    // boolean
    error,      // string | null
    current,    // { value: number, timestamp: string } | null
    reference: DATOS_28A, // valores del 28-A para uso opcional en el componente
    refetch: fetchAndAnalyze,
  };
}
