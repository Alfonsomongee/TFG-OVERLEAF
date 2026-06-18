/**
 * useSimulator.js
 *
 * Hook del simulador de reposición ibérica 28-A.
 *
 * ESCALA TEMPORAL:
 *  - MAX_SIM_TIME = 18  → cada paso representa ~1 hora del evento real
 *    (de 12:33 CEST a ~07:00 CEST del 29-A = 18,5 h)
 *  - TICK_MS = 2000 ms por paso → 36 segundos de simulación total
 *    Justificación: con 1 s/paso (12 s total) el usuario no tenía
 *    tiempo de leer el log ni identificar las zonas. 2 s es el mínimo
 *    para que la animación del pulso de activación (~1,2 s) sea visible.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { EVENT_LOG } from './data';

export const MAX_SIM_TIME = 18;
const TICK_MS = 2000;

export function useSimulator() {
  const [simTime, setSimTime]     = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Effect 1: monta/desmonta el interval solo cuando isPlaying cambia.
  // No depende de simTime → no se recrea en cada tick.
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSimTime((t) => (t >= MAX_SIM_TIME ? t : t + 1));
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  // Effect 2: para el simulador al alcanzar el final.
  useEffect(() => {
    if (simTime >= MAX_SIM_TIME) setIsPlaying(false);
  }, [simTime]);

  const handlePlayPause = useCallback(() => {
    setSimTime((t) => {
      if (t >= MAX_SIM_TIME) {
        setIsPlaying(true);
        return 0;
      }
      setIsPlaying((p) => !p);
      return t;
    });
  }, []);

  const visibleLogs = useMemo(
    () => EVENT_LOG.filter((e) => e.time <= simTime).reverse().slice(0, 5),
    [simTime]
  );

  return { simTime, isPlaying, handlePlayPause, visibleLogs };
}
