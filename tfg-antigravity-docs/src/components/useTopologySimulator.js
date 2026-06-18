/**
 * useTopologySimulator.js
 *
 * Hook del simulador de cascada — IberianGridTopology.
 *
 * Diferencias respecto al original:
 *  - MAX_TIME como constante de módulo (original: dentro de la función → se redeclara)
 *  - Interval limpio: effect separado de play/pause (no recrea el interval en cada tick)
 *  - handlePlayPause en useCallback (original: función nueva en cada render)
 *  - visibleLogs memoizado (original: recalculado en todos los renders incluyendo hover)
 *  - Bug `e.time || e.t` corregido: usa solo `e.t`
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EVENT_LOG } from './IberianGridTopologyData';

/** Número de pasos de la simulación (0 a MAX_TIME inclusive). */
export const MAX_TIME = 14;

/** Milisegundos por paso. 2500 ms permite leer los logs con calma. */
const TICK_MS = 2500;

/**
 * @returns {{
 *   simTime:        number,
 *   isPlaying:      boolean,
 *   handlePlayPause: () => void,
 *   visibleLogs:    Array<{t: number, msg: string}>
 * }}
 */
export function useTopologySimulator() {
  const [simTime, setSimTime]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect 1: monta/desmonta el interval SOLO cuando isPlaying cambia.
  // No depende de simTime → no se recrea en cada tick.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSimTime((t) => (t >= MAX_TIME ? t : t + 1));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // Effect 2: para el simulador al alcanzar MAX_TIME.
  useEffect(() => {
    if (simTime >= MAX_TIME) setIsPlaying(false);
  }, [simTime]);

  const handlePlayPause = useCallback(() => {
    setSimTime((t) => {
      if (t >= MAX_TIME) {
        setIsPlaying(true);
        return 0;
      }
      setIsPlaying((p) => !p);
      return t;
    });
  }, []);

  // visibleLogs: memoizado — solo recalcula cuando cambia simTime.
  // CORRECCIÓN: usa solo `e.t` (bug original: `e.time || e.t` donde `e.time` = undefined)
  const visibleLogs = useMemo(
    () => EVENT_LOG.filter((e) => e.t <= simTime).reverse().slice(0, 5),
    [simTime]
  );

  return { simTime, isPlaying, handlePlayPause, visibleLogs };
}
