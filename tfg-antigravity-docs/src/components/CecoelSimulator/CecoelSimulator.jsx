import React, { useReducer, useEffect, useRef } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './CecoelSimulator.module.css';

// Estado inicial del simulador a las 12:00 CEST del 28-A
const INITIAL_STATE = {
  time: '12:00:00',
  tickCount: 0,
  frequency: 50.00,
  voltage: 422,
  oscAmplitude: 1.5,
  shortCircuitPower: 6000,
  budget: 100000,
  actions: {
    meshNetwork: false,
    keepPmode3: false,
    startCCGT: false,
    blockOLTC: false,
  },
  ccgtStatus: 'idle', // idle, starting, synchronized
  ccgtTimer: 0,
  simEnded: null, // null, 'success', 'blackout_frequency', 'blackout_voltage'
  logs: [
    { time: '12:00:00', type: 'info', text: 'Despacho CECOEL: Turno iniciado. Alta exportación activa (1.000 MW Francia, 2.000 MW Portugal, 800 MW Marruecos).' },
    { time: '12:00:00', type: 'warn', text: 'Alerta: Margen dinámico de tensión reducido. Potencia de cortocircuito local en mínimos (6.000 MVA).' }
  ]
};

// Reducer para gestionar las transiciones de estado
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_ACTION': {
      if (state.simEnded) return state;
      const actionName = action.payload;
      const nextActions = { ...state.actions, [actionName]: !state.actions[actionName] };
      const nextLogs = [...state.logs];
      const timeStr = state.time;

      let ccgtStatus = state.ccgtStatus;
      let ccgtTimer = state.ccgtTimer;
      let budget = state.budget;

      if (actionName === 'meshNetwork') {
        const active = nextActions.meshNetwork;
        nextLogs.unshift({
          time: timeStr,
          type: active ? 'info' : 'warn',
          text: active 
            ? 'Maniobra: Acoplando líneas de 400 kV en vacío. Impedancia de red reducida.'
            : 'Maniobra: Apertura de líneas en vacío. Retornando a configuración radial.'
        });
      } else if (actionName === 'keepPmode3') {
        const active = nextActions.keepPmode3;
        nextLogs.unshift({
          time: timeStr,
          type: 'info',
          text: active
            ? 'Control HVDC: Forzado modo PMODE3 (Emulación AC dinámica con Francia).'
            : 'Control HVDC: Conmutado a PMODE1 (Potencia activa constante, aislamiento de oscilaciones).'
        });
      } else if (actionName === 'startCCGT') {
        if (!state.actions.startCCGT) {
          ccgtStatus = 'starting';
          ccgtTimer = 3; // 3 ticks (minutos virtuales) de retardo térmico
          budget -= 50000; // Coste de arranque
          nextLogs.unshift({
            time: timeStr,
            type: 'warn',
            text: 'Arranque Forzado: Iniciando ciclo de calentamiento de caldera CCGT Málaga (Coste: -50.000 €). Retardo de sincronización: 3 min.'
          });
        } else {
          // Si ya se arrancó, no se puede cancelar por razones térmicas en este modelo simplificado
          return state;
        }
      } else if (actionName === 'blockOLTC') {
        const active = nextActions.blockOLTC;
        nextLogs.unshift({
          time: timeStr,
          type: active ? 'info' : 'warn',
          text: active
            ? 'Protección: Bloqueados cambiadores de tomas en carga (OLTCs) en subestaciones del sur.'
            : 'Protección: Liberado control automático de OLTCs. Retorno a regulación de tensión secundaria.'
        });
      }

      return {
        ...state,
        actions: nextActions,
        ccgtStatus,
        ccgtTimer,
        budget,
        logs: nextLogs
      };
    }

    case 'TICK': {
      if (state.simEnded) return state;

      const nextTick = state.tickCount + 1;
      const nextMin = 12 * 60 + nextTick;
      const hour = Math.floor(nextMin / 60);
      const min = nextMin % 60;
      const nextTimeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;

      let ccgtStatus = state.ccgtStatus;
      let ccgtTimer = state.ccgtTimer;
      let shortCircuitPower = state.shortCircuitPower;
      const nextLogs = [...state.logs];

      // Gestión del temporizador del Ciclo Combinado
      if (ccgtStatus === 'starting') {
        const nextTimer = ccgtTimer - 1;
        if (nextTimer <= 0) {
          ccgtStatus = 'synchronized';
          ccgtTimer = 0;
          shortCircuitPower += 1500; // Incremento de potencia de cortocircuito
          nextLogs.unshift({
            time: nextTimeStr,
            type: 'info',
            text: 'Arranque Completado: Turbina de gas de Málaga sincronizada a red. +1.500 MVA de potencia de cortocircuito.'
          });
        } else {
          ccgtTimer = nextTimer;
        }
      }

      // 1. Modelado dinámico de la Amplitud de Oscilación (0.63 Hz)
      let oscAmplitude = state.oscAmplitude;
      if (state.actions.meshNetwork) {
        oscAmplitude = Math.max(0.2, oscAmplitude * 0.62); // Amortiguada por el mallado
      } else {
        oscAmplitude = Math.min(6.5, oscAmplitude + 0.15); // Crecimiento oscilatorio natural
      }

      // 2. Modelado dinámico de la Tensión (V)
      let voltage = 422;
      if (state.actions.meshNetwork) {
        voltage += 12; // Efecto Ferranti por líneas en vacío (+12 kV)
      }
      if (ccgtStatus === 'synchronized') {
        voltage -= 8; // Absorción de reactiva inductiva por el alternador térmico (-8 kV)
      }
      // Sumar perturbación oscilatoria a la tensión máxima
      voltage += oscAmplitude * 1.5;

      // 3. Modelado dinámico de la Frecuencia (f)
      let frequency = 50.00 + (Math.random() * 0.04 - 0.02); // Fluctuaciones menores nominales
      let simEnded = null;

      // Eventos a las 12:32 (tick 32)
      if (nextTick === 32) {
        nextLogs.unshift({
          time: nextTimeStr,
          type: 'danger',
          text: 'CRÍTICO: Disparo fortuito del transformador de Granada de 400/220 kV. Pérdida inmediata de 355 MW.'
        });

        // Evaluación del desequilibrio de potencia
        const hasVirtualInertia = state.actions.keepPmode3;
        const hasLocalInertia = (ccgtStatus === 'synchronized');

        if (!hasVirtualInertia && !hasLocalInertia) {
          // Caso histórico: Aislamiento total en PMODE1 y sin ciclo Málaga acoplado
          frequency = 48.75;
          simEnded = 'blackout_frequency';
          nextLogs.unshift({
            time: nextTimeStr,
            type: 'danger',
            text: 'Frecuencia crítica: RoCoF superó los 1.5 Hz/s. Frecuencia cayó a 48.75 Hz. Actuaron las protecciones ANSI 78. Colapso del sistema.'
          });
        } else if (hasVirtualInertia && !state.actions.blockOLTC && state.actions.meshNetwork) {
          // Sobretensión Ferranti severa que causa disparos
          voltage = 435;
          simEnded = 'blackout_voltage';
          nextLogs.unshift({
            time: nextTimeStr,
            type: 'danger',
            text: 'Tensión crítica: Voltaje superó 434 kV en Carmona. Disparo en cadena por OVP ANSI 59 de 834 MW solares. Colapso de tensión por Tap-Lag.'
          });
        } else if (hasVirtualInertia && state.actions.blockOLTC && hasLocalInertia) {
          // Configuración exitosa: Inercia de Francia, OLTC bloqueados, y reactiva de CCGT Málaga controlando tensión
          frequency = 49.65;
          voltage = 414;
          simEnded = 'success';
          nextLogs.unshift({
            time: nextTimeStr,
            type: 'info',
            text: 'Estabilizado: La emulación AC en INELFE-1 contuvo la frecuencia a 49.65 Hz. El CCGT absorbió la reactiva y los OLTC bloqueados impidieron el colapso de tensión. ¡Éxito!'
          });
        } else {
          // Otras combinaciones fallidas
          if (!state.actions.blockOLTC && voltage > 430) {
            simEnded = 'blackout_voltage';
            nextLogs.unshift({
              time: nextTimeStr,
              type: 'danger',
              text: 'Colapso de Tensión: Actuación de OLTCs generó sobrecarga de consumo reactivo. Tensión desplomada a 320 kV.'
            });
          } else {
            frequency = 48.90;
            simEnded = 'blackout_frequency';
            nextLogs.unshift({
              time: nextTimeStr,
              type: 'danger',
              text: 'Deslastre de Carga (UFLS) masivo: La frecuencia cayó a 48.90 Hz. Isla eléctrica aislada por la interconexión.'
            });
          }
        }
      }

      // Alertas de tensión continuas
      if (!simEnded && voltage >= 430) {
        nextLogs.unshift({
          time: nextTimeStr,
          type: 'warn',
          text: `Alerta: Tensión en el eje sur a ${voltage.toFixed(1)} kV superando límites continuos. Riesgo de arco y disparo OVP.`
        });
      }

      return {
        ...state,
        time: nextTimeStr,
        tickCount: nextTick,
        frequency,
        voltage,
        oscAmplitude,
        shortCircuitPower,
        ccgtStatus,
        ccgtTimer,
        simEnded,
        logs: nextLogs
      };
    }

    case 'RESTART':
      return INITIAL_STATE;

    default:
      return state;
  }
}

export default function CecoelSimulator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const timerRef = useRef(null);

  // Efecto para gestionar el auto-play del simulador
  useEffect(() => {
    if (isAutoPlaying && !state.simEnded) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 2000); // Cada tick (minuto virtual) toma 2 segundos de tiempo real
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, state.simEnded]);

  // Detener el juego si termina la simulación
  useEffect(() => {
    if (state.simEnded) {
      setIsAutoPlaying(false);
    }
  }, [state.simEnded]);

  const toggleAction = (actionName) => {
    dispatch({ type: 'TOGGLE_ACTION', payload: actionName });
  };

  const handleTick = () => {
    dispatch({ type: 'TICK' });
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART' });
  };

  // Determinar colores de telemedición según rangos críticos (HMI SCADA)
  const getFreqColor = (f) => {
    if (f < 49.2 || f > 50.8) return '#FF073A'; // Rojo crítico
    if (f < 49.8 || f > 50.2) return '#FFEA00'; // Amarillo advertencia
    return '#39FF14'; // Verde neón nominal
  };

  const getVoltColor = (v) => {
    if (v >= 430 || v < 380) return '#FF073A';
    if (v >= 420 || v < 390) return '#FFEA00';
    return '#39FF14';
  };

  const getOscColor = (osc) => {
    if (osc > 3.0) return '#FF073A';
    if (osc > 1.8) return '#FFEA00';
    return '#39FF14';
  };

  const getSscColor = (ssc) => {
    if (ssc < 6500) return '#FFEA00';
    return '#39FF14';
  };

  return (
    <div className={styles.scadaWrapper}>
      {/* Efecto CRT Scanlines */}
      <div className={styles.crtOverlay} />

      <div className={styles.scadaContainer}>
        {/* Cabecera SCADA */}
        <div className={styles.scadaHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.blinkingDot} />
            <span className={styles.systemStatus}>REE CECOEL · HMI TELEMETRY V2.8</span>
          </div>
          <div className={styles.timeGroup}>
            <span>TIME_REF: </span>
            <strong className={styles.timeVal}>{state.time} CEST</strong>
          </div>
        </div>

        {/* Panel principal de Telemedida */}
        <div className={styles.telemetryGrid}>
          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>FREQ_SYS (Hz)</span>
            <span className={styles.telemetryValue} style={{ color: getFreqColor(state.frequency) }}>
              {state.frequency.toFixed(2)}
            </span>
            <div className={styles.telemetryLimits}>NOM: 50.00 | MIN: 49.00 | MAX: 51.00</div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>VOLT_400KV_SUR (kV)</span>
            <span className={styles.telemetryValue} style={{ color: getVoltColor(state.voltage) }}>
              {Math.round(state.voltage)}
            </span>
            <div className={styles.telemetryLimits}>NOM: 400 | WARNING: &gt;420 | TRIP: &gt;434</div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>OSC_AMP_0.63HZ (kV)</span>
            <span className={styles.telemetryValue} style={{ color: getOscColor(state.oscAmplitude) }}>
              ±{state.oscAmplitude.toFixed(1)}
            </span>
            <div className={styles.telemetryLimits}>STABLE: &lt;1.0 | CRITICAL: &gt;3.0</div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>S_CC_LOCAL (MVA)</span>
            <span className={styles.telemetryValue} style={{ color: getSscColor(state.shortCircuitPower) }}>
              {state.shortCircuitPower}
            </span>
            <div className={styles.telemetryLimits}>LIMIT_N-1: &gt;7.500 | CURRENT: {state.shortCircuitPower}</div>
          </div>
        </div>

        {/* Distribución de Layout de Control */}
        <div className={styles.controlLayout}>
          {/* Columna Izquierda: Acciones del Operador */}
          <div className={styles.actionsPanel}>
            <h4 className={styles.panelTitle}>CONSIGNAS DE DESPACHO</h4>
            <p className={styles.panelDesc}>Activa o desactiva maniobras operativas sobre el eje sur-occidental.</p>

            <div className={styles.togglesList}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>MANIOBRA DE MALLADO</strong>
                  <span className={styles.actionDesc}>Conectar 11 líneas en vacío en Sevilla/Granada para bajar impedancia.</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.meshNetwork ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('meshNetwork')}
                  disabled={!!state.simEnded}
                >
                  {state.actions.meshNetwork ? 'MALLADO ACTIVO' : 'MALLADO INACTIVO'}
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>CONTROL HVDC: INELFE-1 PMODE3</strong>
                  <span className={styles.actionDesc}>Mantener emulación AC dinámica con Francia (en lugar de fijar PMODE1).</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.keepPmode3 ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('keepPmode3')}
                  disabled={!!state.simEnded}
                >
                  {state.actions.keepPmode3 ? 'PMODE3 ACTIVO' : 'PMODE1 (CONGELADO)'}
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>ARRANQUE FORZADO: CCGT MÁLAGA</strong>
                  <span className={styles.actionDesc}>Acoplar reserva térmica síncrona (+1.500 MVA). Retardo: 3 min (3 ticks). Coste: 50.000 €.</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${
                    state.ccgtStatus === 'synchronized'
                      ? styles.btnSync
                      : state.ccgtStatus === 'starting'
                      ? styles.btnWait
                      : styles.btnOff
                  }`}
                  onClick={() => toggleAction('startCCGT')}
                  disabled={state.ccgtStatus !== 'idle' || !!state.simEnded}
                >
                  {state.ccgtStatus === 'synchronized'
                    ? 'CCGT ONLINE (+1500 MVA)'
                    : state.ccgtStatus === 'starting'
                    ? `INICIANDO RAMP-UP (${state.ccgtTimer} Min)`
                    : 'ARRANCAR CCGT'}
                </button>
              </div>

              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>BLOQUEO DE OLTCs</strong>
                  <span className={styles.actionDesc}>Bloquear cambiadores de tomas de transformadores en nudos del sur (evitar Tap-Lag).</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.blockOLTC ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('blockOLTC')}
                  disabled={!!state.simEnded}
                >
                  {state.actions.blockOLTC ? 'OLTCs BLOQUEADOS' : 'OLTCs AUTOMÁTICOS'}
                </button>
              </div>
            </div>

            {/* Controles de Simulación */}
            <div className={styles.playbackControls}>
              <button
                onClick={togglePlay}
                className={`${styles.playbackBtn} ${isAutoPlaying ? styles.activePlayback : ''}`}
                disabled={!!state.simEnded}
              >
                {isAutoPlaying ? '⏸ PAUSAR SIMULACIÓN' : '▶ INICIAR AUTO-PLAY (2s/min)'}
              </button>
              <button
                onClick={handleTick}
                className={styles.playbackBtn}
                disabled={isAutoPlaying || !!state.simEnded}
              >
                ▶ Siguiente Minuto (+1 min)
              </button>
              <button onClick={handleRestart} className={`${styles.playbackBtn} ${styles.btnRestart}`}>
                ↺ REINICIAR ESCENARIO
              </button>
            </div>
          </div>

          {/* Columna Derecha: Alertas, Logs e Historial */}
          <div className={styles.logsPanel}>
            <h4 className={styles.panelTitle}>CONSOLA DE EVENTOS E HISTORIAL SCADA</h4>
            <div className={styles.budgetDisplay}>
              <span>PRESUPUESTO DE AJUSTE DISPONIBLE:</span>
              <strong style={{ color: state.budget < 100000 ? '#FFEA00' : '#39FF14' }}>
                {state.budget.toLocaleString('es-ES')} €
              </strong>
            </div>

            <div className={styles.logsContainer}>
              {state.logs.map((log, index) => (
                <div
                  key={index}
                  className={`${styles.logItem} ${
                    log.type === 'danger'
                      ? styles.logDanger
                      : log.type === 'warn'
                      ? styles.logWarn
                      : styles.logInfo
                  }`}
                >
                  <span className={styles.logTime}>[{log.time}]</span>
                  <span className={styles.logText}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal de Resolución Final */}
        {state.simEnded && (
          <div className={styles.resolutionOverlay}>
            <div
              className={`${styles.resolutionModal} ${
                state.simEnded === 'success' ? styles.modalSuccess : styles.modalDanger
              }`}
            >
              <h3 className={styles.resolutionTitle}>
                {state.simEnded === 'success' 
                  ? '✓ OPERACIÓN ESTABILIZADA: RED SALVADA' 
                  : '⚠ ALARMA GENERAL: CERO ELÉCTRICO'}
              </h3>
              
              <div className={styles.resolutionBody}>
                {state.simEnded === 'success' ? (
                  <p>
                    <strong>¡Excelente trabajo, operador!</strong> Tu respuesta ante la perturbación de las 12:32 fue impecable:
                    el arranque a tiempo de CCGT Málaga aportó el soporte dinámico indispensable, mantener INELFE en PMODE3 amortiguó la caída de frecuencia a través de la inercia del sistema europeo, y el bloqueo de los OLTCs previno el efecto Tap-Lag catastrófico. La red ibérica de 400 kV permanece sincronizada y estable.
                  </p>
                ) : state.simEnded === 'blackout_frequency' ? (
                  <p>
                    <strong>CERO ELÉCTRICO POR DERRAME DE FRECUENCIA:</strong> Al aislar dinámicamente la península (PMODE1) y carecer del soporte síncrono local de Málaga, el disparo fortuito en Granada provocó un desequilibrio activo masivo. El RoCoF se disparó a más de 1.8 Hz/s y la frecuencia descendió por debajo de 49.0 Hz, provocando disparos autónomos por deslastre masivo de carga y blackout.
                  </p>
                ) : (
                  <p>
                    <strong>CERO ELÉCTRICO POR INESTABILIDAD DE TENSIÓN:</strong> La maniobra de mallado elevó excesivamente la tensión Ferranti por encima de los 434 kV. Ante este incremento, se activaron los relés ANSI 59 de parques fotovoltaicos adyacentes desconectando 834 MW de golpe. Sin bloquear los OLTCs, los transformadores trataron de compensar la caída succionando reactiva residual, desplomando las tensiones de toda la red a mínimos dieléctricos insostenibles.
                  </p>
                )}

                <div className={styles.statsSummary}>
                  <div className={styles.statLine}>
                    <span>Presupuesto Final:</span>
                    <strong>{state.budget.toLocaleString('es-ES')} €</strong>
                  </div>
                  <div className={styles.statLine}>
                    <span>Frecuencia Final:</span>
                    <strong style={{ color: getFreqColor(state.frequency) }}>{state.frequency.toFixed(2)} Hz</strong>
                  </div>
                  <div className={styles.statLine}>
                    <span>Tensión Final:</span>
                    <strong style={{ color: getVoltColor(state.voltage) }}>{Math.round(state.voltage)} kV</strong>
                  </div>
                </div>
              </div>

              <button onClick={handleRestart} className={styles.modalRestartBtn}>
                VOLVER A INTENTAR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
