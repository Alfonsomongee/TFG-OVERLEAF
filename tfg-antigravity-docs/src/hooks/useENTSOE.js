// src/hooks/useENTSOE.js
// Hook para consumir la Edge Function /api/entsoe con polling automático,
// manejo de errores y snapshot histórico del 28-A para comparativa.

import { useState, useEffect, useRef, useCallback } from 'react';

const BASE_URL = '/api/entsoe';

/**
 * Snapshot de datos del 28-A a las 12:30 CEST (10:30 UTC)
 * Fuente: Informe Factual ENTSO-E + Informes REE/ICAI
 * Sistema ibérico integrado (España + Portugal)
 */
export const SNAPSHOT_28A = {
  timestamp:    '2025-04-28T10:30:00Z',
  label:        '28-A 12:30 CEST',
  
  // Generación peninsular española
  generation_es: {
    total_mw:         29_600,
    solar_pv:         18_200,
    wind:              4_800,
    combined_cycle:    2_800,
    nuclear:           3_400,
    hydro:             1_800,
    other:             1_100,
    ibrpercent:        82,     // % no síncrona
  },

  // Demanda peninsular
  demand_es: {
    total_mw:     25_800,
  },

  // Demanda Portugal
  demand_pt: {
    total_mw:      5_300,
  },

  // Precios
  price_omie_es: 42.3,  // €/MWh

  // Intercambios
  interchange_es_fr:  870,   // export MW
  interchange_es_pt: 2600,   // export MW
  interchange_es_ma:  800,   // export MW

  // Parámetros de estabilidad
  inertia_H:       2.3,     // segundos — global peninsular
  scr_south:       1.3,     // ratio cortocircuito — sur (zona crítica)
};

/**
 * useENTSOEData — fetch + polling de datos ENTSO-E
 * @param {string} type        — 'generation' | 'demand' | 'load'
 * @param {string} area        — 'ES' | 'PT'
 * @param {number} pollInterval — ms entre refrescos (default: 300000 = 5 min)
 * @param {number} hours       — horas históricas a cargar (default: 24)
 */
export function useENTSOEData(type = 'generation', area = 'ES', pollInterval = 300_000, hours = 24) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const abortRef = useRef(null);
  const timerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const url = new URL(BASE_URL, window.location.origin);
      url.searchParams.set('type',  type);
      url.searchParams.set('area',  area);
      url.searchParams.set('hours', hours.toString());

      const res = await fetch(url.toString(), {
        signal: abortRef.current.signal,
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        // Fallback for local Docusaurus dev server (which doesn't serve /api)
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[useENTSOE] API not available locally (${res.status}). Using mock data.`);
          const baseVal = type === 'generation' ? 31000 : 27000;
          const mockData = {
            type, area, unit: 'MW', fetched_at: new Date().toISOString(),
            timeseries: Array.from({length: 24}).map((_, i) => ({
              datetime: new Date(Date.now() - (23-i)*3600000).toISOString(),
              value: baseVal + Math.floor(Math.random() * 3000) - 1500,
              position: i + 1
            }))
          };
          setData(mockData);
          setError(null);
          setLastUpdate(new Date());
          setLoading(false);
          return;
        }
        throw new Error(`API error ${res.status}`);
      }

      const json = await res.json();
      setData(json);
      setError(null);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      if (err.name === 'AbortError') return; // cleanup normal
      
      // Secondary fallback if fetch fails completely (e.g. CORS or network error)
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useENTSOE] Fetch failed. Using mock data.`);
        const baseVal = type === 'generation' ? 31000 : 27000;
        setData({
          type, area, unit: 'MW', fetched_at: new Date().toISOString(),
          timeseries: Array.from({length: 24}).map((_, i) => ({
            datetime: new Date(Date.now() - (23-i)*3600000).toISOString(),
            value: baseVal + Math.floor(Math.random() * 3000) - 1500,
            position: i + 1
          }))
        });
        setError(null);
        setLastUpdate(new Date());
        setLoading(false);
        return;
      }

      console.warn(`[useENTSOE] ${type}/${area} error:`, err.message);
      setError(err.message);
      setLoading(false);
    }
  }, [type, area, hours]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, pollInterval);

    return () => {
      abortRef.current?.abort();
      clearInterval(timerRef.current);
    };
  }, [fetchData, pollInterval]);

  return { data, loading, error, lastUpdate, refetch: fetchData };
}

/**
 * getLatestValue — extrae el valor más reciente de la serie ENTSO-E
 */
export function getLatestValue(data) {
  if (!data?.timeseries?.length) return null;
  const sorted = [...data.timeseries].sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime)
  );
  return sorted[0]?.value ?? null;
}

/**
 * getTimeseries — extrae serie temporal completa, limitada a N puntos
 */
export function getTimeseries(data, maxPoints = 48) {
  if (!data?.timeseries?.length) return [];
  return [...data.timeseries]
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(-maxPoints)
    .map(point => ({
      time:  new Date(point.datetime).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
      }),
      value: point.value,
    }));
}

/**
 * Comparación simple: calcula delta y porcentaje vs valor de referencia
 */
export function getDelta(current, reference) {
  if (current === null || reference === null) return null;
  return {
    absolute: current - reference,
    percent:  ((current - reference) / reference) * 100,
  };
}
