/**
 * usePropagationSimulator.js
 *
 * Hook del simulador de cascada IBR — BlackoutPropagationMap.
 *
 * MAX_TIME = 12, TICK_MS = 800 ms (mantiene el ritmo del original).
 *
 * Mejoras respecto al original:
 *   - Effect 1 (interval) separado de Effect 2 (fin) — no recrea el timer
 *     en cada tick. El original usaba setTimeout en [isPlaying, simTime],
 *     lo que relanzaba el efecto con cada incremento de simTime.
 *   - handlePlayPause en useCallback — no genera nueva función en cada render.
 *   - visibleEvents memoizado — el original recalculaba en cada render,
 *     incluyendo los causados por hover sobre nodos.
 *   - gwLost memoizado — delegado a getGwLost() del data file.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EVENTS, getGwLost } from './BlackoutPropagationMapData';

/** Número total de pasos de la simulación (0 a MAX_TIME inclusive). */
export const MAX_TIME = 12;

/** Milisegundos por paso. 2500 ms · 12 pasos = ~30 s de reproducción. */
const TICK_MS = 2500;

/**
 * @returns {{
 *   simTime:        number,
 *   isPlaying:      boolean,
 *   handlePlayPause: () => void,
 *   visibleEvents:  Array<{t: number, msg: string}>,
 *   gwLost:         number
 * }}
 */
export function usePropagationSimulator() {
  const [simTime,   setSimTime]   = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect 1: interval — se monta/desmonta solo cuando isPlaying cambia.
  // No depende de simTime → no se relanza en cada tick.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSimTime((t) => (t >= MAX_TIME ? t : t + 1));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // Effect 2: para el simulador cuando alcanza MAX_TIME.
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

  const visibleEvents = useMemo(
    () => EVENTS.filter((e) => e.t <= simTime).reverse().slice(0, 4),
    [simTime]
  );

  const gwLost = useMemo(() => getGwLost(simTime), [simTime]);

  return { simTime, isPlaying, handlePlayPause, visibleEvents, gwLost };
}
