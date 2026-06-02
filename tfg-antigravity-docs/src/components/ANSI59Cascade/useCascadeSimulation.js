/**
 * useCascadeSimulation.js
 * Modelo de propagación reactiva simplificado para el simulador ANSI 59.
 *
 * FÍSICA:
 * Cuando un nudo IBR hace trip, pierde su capacidad de absorber reactiva inductiva.
 * En una red de bajo SCR, esa reactiva "sobrante" eleva la tensión en los nudos vecinos.
 * Si la tensión supera el umbral de la protección ANSI 59 (sobretensión),
 * el nudo vecino también hace trip → bucle de retroalimentación positiva.
 *
 * ΔV_j = sensitivity · (absorb_Q_perdida / absorb_Q_total_activa) · COUPLING
 *
 * COUPLING = 7.5 representa el efecto de red débil (SCR ≈ 1.8 zona sur 28-A).
 * En una red fuerte (SCR > 5), COUPLING ≈ 1.5 y la cascada no se completa.
 *
 * DATOS ANCLADOS A datos28A.json:
 *   Disparo raíz → Granada_SO: 355 MW activos + 165 MVAr de absorción (ENTSO-E Factual, p.28)
 *   Desconexiones SO totales Comité: 1.635 MW (Granada 355 + Badajoz 730 + Sevilla 550)
 *
 * CORRECCIONES respecto a la versión anterior:
 *   1. Bug de closure: `time` y `nodes` se leen desde refs, no desde closures del useEffect.
 *   2. Comparación de floats: se usa `timeRef.current < 0.001` en lugar de `time === 0.0`.
 *   3. Factor COUPLING documentado y separado de `sensitivity`.
 *   4. `executeStep` se define DENTRO del useEffect para evitar re-renders innecesarios.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { translate } from '@docusaurus/Translate';

// Nodos representativos del sistema ibérico (pedagogía, no topología exacta).
// Valores de P_ibr y absorb_Q anclados a ENTSO-E Factual Report / Comité de Análisis.
const INITIAL_NODES = [
  {
    id: 'Granada_SO',
    name: 'Granada SO',
    type: 'solar',
    V: 1.02,
    threshold: 1.10,
    P_ibr: 0.355,     // GW, fuente: ENTSO-E Factual p.28 (disparo raíz)
    absorb_Q: 0.165,  // GVAr, fuente: ENTSO-E Factual p.28
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Badajoz_FV1',
    name: 'Badajoz FV1',
    type: 'solar',
    V: 1.03,
    threshold: 1.09,
    P_ibr: 0.730,     // GW, fuente: Comité de Análisis (desconexión SO Badajoz)
    absorb_Q: 0.280,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Badajoz_FV2',
    name: 'Badajoz FV2',
    type: 'solar',
    V: 1.03,
    threshold: 1.09,
    P_ibr: 0.420,
    absorb_Q: 0.190,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Sevilla_FV',
    name: 'Sevilla FV',
    type: 'solar',
    V: 1.01,
    threshold: 1.10,
    P_ibr: 0.550,     // GW, fuente: Comité de Análisis (desconexión SO Sevilla)
    absorb_Q: 0.210,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Carmona_Eol',
    name: 'Carmona Eólico',
    type: 'wind',
    V: 1.00,
    threshold: 1.11,
    P_ibr: 0.380,
    absorb_Q: 0.140,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Extremadura_FV',
    name: 'Extremadura FV',
    type: 'solar',
    V: 1.02,
    threshold: 1.09,
    P_ibr: 0.610,
    absorb_Q: 0.240,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Murcia_FV',
    name: 'Murcia FV',
    type: 'solar',
    V: 1.01,
    threshold: 1.10,
    P_ibr: 0.290,
    absorb_Q: 0.115,
    tripped: false,
    tripTime: null,
  },
  {
    id: 'Valencia_Eol',
    name: 'Valencia Eólico',
    type: 'wind',
    V: 1.00,
    threshold: 1.11,
    P_ibr: 0.440,
    absorb_Q: 0.170,
    tripped: false,
    tripTime: null,
  },
];

// Factor de acoplamiento de red débil (SCR ≈ 1.8, zona sur 28-A).
// Representa cuánto sube la tensión por unidad de reactiva perdida en red débil.
// En red fuerte (SCR > 5) este valor sería ≈ 1.5 y la cascada no se completaría.
const COUPLING_WEAK_GRID = 7.5;

export function useCascadeSimulation(sensitivity = 0.08) {
  const [nodes, setNodes]       = useState(() => INITIAL_NODES.map(n => ({ ...n })));
  const [time, setTime]         = useState(0.0);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory]   = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  // Refs para leer el estado más reciente desde dentro del setInterval
  // sin depender de closures estales.
  const nodesRef      = useRef(nodes);
  const timeRef       = useRef(time);
  const isRunningRef  = useRef(isRunning);
  const isFinishedRef = useRef(isFinished);
  const timerRef      = useRef(null);

  // Sincronizar refs con state en cada render
  nodesRef.current      = nodes;
  timeRef.current       = time;
  isRunningRef.current  = isRunning;
  isFinishedRef.current = isFinished;

  // ─── Propagación de tensión ─────────────────────────────────────────────────
  const propagateVoltage = useCallback((currentNodes, absorb_Q_lost) => {
    const remaining = currentNodes.filter(n => !n.tripped);
    if (remaining.length === 0) return currentNodes;

    const total_active_Q = remaining.reduce((s, n) => s + n.absorb_Q, 0);
    if (total_active_Q <= 0) return currentNodes;

    return currentNodes.map(node => {
      if (node.tripped) return node;
      const deltaV = sensitivity * (absorb_Q_lost / total_active_Q) * COUPLING_WEAK_GRID;
      return { ...node, V: parseFloat((node.V + deltaV).toFixed(4)) };
    });
  }, [sensitivity]);

  // ─── Un paso de simulación ──────────────────────────────────────────────────
  const executeStep = useCallback(() => {
    if (isFinishedRef.current) return;

    const currentTime  = timeRef.current;
    const currentNodes = nodesRef.current.map(n => ({ ...n }));

    // ── PASO 0: disparo raíz (t ≈ 0) ──────────────────────────────────────
    if (currentTime < 0.001) {
      const granadaIdx = currentNodes.findIndex(n => n.id === 'Granada_SO');
      if (granadaIdx === -1) return;

      currentNodes[granadaIdx] = {
        ...currentNodes[granadaIdx],
        tripped: true,
        tripTime: '0.0s',
        V: 1.12, // pico de tensión visible en el nudo que dispara
      };

      const absorb_Q_lost = currentNodes[granadaIdx].absorb_Q; // 0.165 GVAr
      const updatedNodes  = propagateVoltage(currentNodes, absorb_Q_lost);

      setNodes(updatedNodes);
      setHistory([{
        time: '0.0s',
        node: 'Granada SO',
        msg:  translate({id: 'ansi59.rootTripMsg', message: '⚡ DISPARO RAÍZ (ANSI 59): Transformador 400/220 kV por sobretensión.'}),
        detail: translate({id: 'ansi59.rootTripDetail', message: '−{mw} MW activos · −{mvar} MVAr de absorción. (ENTSO-E Factual, p.28)'}, {mw: (currentNodes[granadaIdx].P_ibr * 1000).toFixed(0), mvar: (absorb_Q_lost * 1000).toFixed(0)}),
        MW:   currentNodes[granadaIdx].P_ibr,
        MVAr: absorb_Q_lost,
      }]);
      // Siguiente tick a 1.2 s simulados
      setTime(1.2);
      return;
    }

    // ── PASOS SIGUIENTES: disparos secundarios ─────────────────────────────
    const nodesToTrip = currentNodes.filter(
      n => !n.tripped && n.V >= n.threshold
    );

    if (nodesToTrip.length === 0) {
      // Sistema estabilizado: no hay más nodos por disparar
      setIsRunning(false);
      setIsFinished(true);
      clearInterval(timerRef.current);
      return;
    }

    const formattedTime = `${currentTime.toFixed(1)}s`;
    const absorb_Q_lost = nodesToTrip.reduce((s, n) => s + n.absorb_Q, 0);

    const newEntries = nodesToTrip.map(n => ({
      time: formattedTime,
      node: n.name,
      msg:  translate({id: 'ansi59.secondaryTripMsg', message: '⚡ DISPARO SECUNDARIO (Sobretensión > {uv}%UV)'}, {uv: (n.threshold * 100).toFixed(0)}),
      detail: translate({id: 'ansi59.secondaryTripDetail', message: '−{mw} MW activos · −{mvar} MVAr de absorción.'}, {mw: (n.P_ibr * 1000).toFixed(0), mvar: (n.absorb_Q * 1000).toFixed(0)}),
      MW:   n.P_ibr,
      MVAr: n.absorb_Q,
    }));

    // Marcar como disparados
    const afterTrip = currentNodes.map(n =>
      nodesToTrip.find(t => t.id === n.id)
        ? { ...n, tripped: true, tripTime: formattedTime }
        : n
    );

    // Propagar tensión a los restantes
    const afterPropagation = propagateVoltage(afterTrip, absorb_Q_lost);

    setNodes(afterPropagation);
    setHistory(prev => [...prev, ...newEntries]);

    const remaining = afterPropagation.filter(n => !n.tripped);
    if (remaining.length === 0) {
      // Colapso total
      setIsRunning(false);
      setIsFinished(true);
      clearInterval(timerRef.current);
      return;
    }

    setTime(prev => parseFloat((prev + 1.2).toFixed(1)));
  }, [propagateVoltage]);

  // ─── Loop de simulación ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isRunning) {
      // Limpiar cualquier intervalo anterior antes de crear uno nuevo
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(executeStep, 1333); // 0.75x speed
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  // Solo depende de isRunning y executeStep (no de `time` ni `nodes`)
  }, [isRunning, executeStep]);

  // ─── Controles ──────────────────────────────────────────────────────────────
  const startSimulation = useCallback(() => {
    if (isFinishedRef.current) {
      // Reiniciar automáticamente si ya terminó
      if (timerRef.current) clearInterval(timerRef.current);
      setNodes(INITIAL_NODES.map(n => ({ ...n })));
      setTime(0.0);
      setHistory([]);
      setIsFinished(false);
    }
    setIsRunning(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setNodes(INITIAL_NODES.map(n => ({ ...n })));
    setTime(0.0);
    setIsRunning(false);
    setHistory([]);
    setIsFinished(false);
  }, []);

  // ─── Métricas derivadas ─────────────────────────────────────────────────────
  const totalLostMW    = nodes.filter(n => n.tripped).reduce((s, n) => s + n.P_ibr, 0);
  const totalLostMVAr  = nodes.filter(n => n.tripped).reduce((s, n) => s + n.absorb_Q, 0);
  const activeNodesCount = nodes.filter(n => !n.tripped).length;

  return {
    nodes,
    time,
    isRunning,
    history,
    isFinished,
    totalLostMW,
    totalLostMVAr,
    activeNodesCount,
    startSimulation,
    pauseSimulation,
    resetSimulation,
  };
}
