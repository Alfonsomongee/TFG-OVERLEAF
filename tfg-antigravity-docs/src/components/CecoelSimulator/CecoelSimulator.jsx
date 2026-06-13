// FIX CRÍTICO: useState faltaba en la lista de imports del archivo original.
// useReducer gestiona el estado del simulador; useState controla isAutoPlaying y playSpeed.
import React, { useReducer, useEffect, useRef, useState } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './CecoelSimulator.module.css';

// ─── Estado inicial (12:00 CEST, 28-A) ───────────────────────────────────────
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
    keepPmode3:  false,
    startCCGT:   false,
    blockOLTC:   false,
  },
  ccgtStatus: 'idle',    // idle | starting | synchronized
  ccgtTimer:  0,
  simEnded:   null,      // null | 'success' | 'blackout_frequency' | 'blackout_voltage'
  logs: [
    { time: '12:00:00', type: 'info',   text: 'Despacho CECOEL: Turno iniciado. Alta exportación activa (1.000 MW Francia, 2.000 MW Portugal, 800 MW Marruecos).' },
    { time: '12:00:00', type: 'warn',   text: 'Alerta: Margen dinámico de tensión reducido. Potencia de cortocircuito local en mínimos (6.000 MVA).' }
  ]
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'TOGGLE_ACTION': {
      if (state.simEnded) return state;

      const actionName  = action.payload;
      const nextActions = { ...state.actions, [actionName]: !state.actions[actionName] };
      const nextLogs    = [...state.logs];
      const timeStr     = state.time;

      let ccgtStatus = state.ccgtStatus;
      let ccgtTimer  = state.ccgtTimer;
      let budget     = state.budget;

      if (actionName === 'meshNetwork') {
        nextLogs.unshift({
          time: timeStr,
          type: nextActions.meshNetwork ? 'info' : 'warn',
          text: nextActions.meshNetwork
            ? 'Maniobra: Acoplando líneas de 400 kV en vacío. Impedancia de red reducida.'
            : 'Maniobra: Apertura de líneas en vacío. Retornando a configuración radial.'
        });

      } else if (actionName === 'keepPmode3') {
        nextLogs.unshift({
          time: timeStr,
          type: 'info',
          text: nextActions.keepPmode3
            ? 'Control HVDC: Forzado modo PMODE3 (Emulación AC dinámica con Francia).'
            : 'Control HVDC: Conmutado a PMODE1 (Potencia activa constante, aislamiento de oscilaciones).'
        });

      } else if (actionName === 'startCCGT') {
        if (state.ccgtStatus !== 'idle') return state; // Ya arrancado: no acción
        ccgtStatus = 'starting';
        ccgtTimer  = 3;           // 3 ticks de retardo térmico
        budget    -= 50000;
        nextLogs.unshift({
          time: timeStr,
          type: 'warn',
          text: 'Arranque Forzado: Iniciando ciclo de calentamiento de caldera CCGT Málaga (Coste: −50.000 €). Retardo de sincronización: 3 min.'
        });

      } else if (actionName === 'blockOLTC') {
        nextLogs.unshift({
          time: timeStr,
          type: nextActions.blockOLTC ? 'info' : 'warn',
          text: nextActions.blockOLTC
            ? 'Protección: Bloqueados cambiadores de tomas en carga (OLTCs) en subestaciones del sur.'
            : 'Protección: Liberado control automático de OLTCs. Retorno a regulación de tensión secundaria.'
        });
      }

      return { ...state, actions: nextActions, ccgtStatus, ccgtTimer, budget, logs: nextLogs };
    }

    case 'TICK': {
      if (state.simEnded) return state;

      const nextTick   = state.tickCount + 1;
      const nextMinAbs = 12 * 60 + nextTick;
      const hour       = Math.floor(nextMinAbs / 60);
      const min        = nextMinAbs % 60;
      const nextTime   = `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}:00`;

      let { ccgtStatus, ccgtTimer, shortCircuitPower } = state;
      const nextLogs = [...state.logs];

      // ── Gestión del temporizador CCGT ──
      if (ccgtStatus === 'starting') {
        const remainingTimer = ccgtTimer - 1;
        if (remainingTimer <= 0) {
          ccgtStatus = 'synchronized';
          ccgtTimer  = 0;
          shortCircuitPower += 1500;
          nextLogs.unshift({
            time: nextTime,
            type: 'info',
            text: 'Arranque Completado: Turbina CCGT Málaga sincronizada a red. +1.500 MVA de potencia de cortocircuito.'
          });
        } else {
          ccgtTimer = remainingTimer;
        }
      }

      // ── Modelado dinámico de Amplitud de Oscilación (0.63 Hz) ──
      let oscAmplitude = state.oscAmplitude;
      oscAmplitude = state.actions.meshNetwork
        ? Math.max(0.2, oscAmplitude * 0.62)   // Amortiguado por el mallado
        : Math.min(6.5, oscAmplitude + 0.15);  // Crecimiento natural

      // ── Modelado dinámico de Tensión ──
      let voltage = 422;
      if (state.actions.meshNetwork)       voltage += 12;  // Ferranti por líneas en vacío
      if (ccgtStatus === 'synchronized')   voltage -= 8;   // Absorción inductiva del alternador
      voltage += oscAmplitude * 1.5;

      // ── Modelado dinámico de Frecuencia ──
      let frequency = 50.00 + (Math.random() * 0.04 - 0.02);
      let simEnded  = null;

      // ── Evento crítico en tick 32 (12:32 CEST) ──
      if (nextTick === 32) {
        nextLogs.unshift({
          time: nextTime,
          type: 'danger',
          text: 'CRÍTICO: Disparo fortuito del transformador de Granada 400/220 kV. Pérdida inmediata de 355 MW.'
        });

        const hasVirtualInertia = state.actions.keepPmode3;
        const hasLocalInertia   = ccgtStatus === 'synchronized';
        const hasMesh           = state.actions.meshNetwork;
        const hasBlockedOLTC    = state.actions.blockOLTC;

        if (!hasVirtualInertia && !hasLocalInertia) {
          // Caso histórico: aislamiento PMODE1 + sin CCGT local
          frequency = 48.75;
          simEnded  = 'blackout_frequency';
          nextLogs.unshift({
            time: nextTime,
            type: 'danger',
            text: 'Frecuencia crítica: RoCoF superó 1.5 Hz/s. Frecuencia descendió a 48.75 Hz. Protecciones ANSI 78 disparadas. Colapso sistémico.'
          });

        } else if (hasVirtualInertia && !hasBlockedOLTC && hasMesh) {
          // Sobretensión Ferranti con OLTCs sin bloquear
          voltage  = 435;
          simEnded = 'blackout_voltage';
          nextLogs.unshift({
            time: nextTime,
            type: 'danger',
            text: 'Tensión crítica: Voltaje superó 434 kV en Carmona. ANSI 59 disparó 834 MW solares en cascada. Colapso de tensión por Tap-Lag.'
          });

        } else if (hasVirtualInertia && hasBlockedOLTC && hasLocalInertia) {
          // Configuración óptima: éxito
          frequency = 49.65;
          voltage   = 414;
          simEnded  = 'success';
          nextLogs.unshift({
            time: nextTime,
            type: 'info',
            text: '¡Estabilizado! La emulación AC en INELFE-1 contuvo la frecuencia a 49.65 Hz. CCGT absorbió reactiva y OLTCs bloqueados impidieron colapso de tensión.'
          });

        } else {
          // Otras combinaciones parciales
          if (!hasBlockedOLTC && voltage > 430) {
            simEnded = 'blackout_voltage';
            nextLogs.unshift({
              time: nextTime,
              type: 'danger',
              text: 'Colapso de Tensión: OLTCs sin bloquear generaron sobrecarga de consumo reactivo. Tensión desplomada a 320 kV.'
            });
          } else {
            frequency = 48.90;
            simEnded  = 'blackout_frequency';
            nextLogs.unshift({
              time: nextTime,
              type: 'danger',
              text: 'Deslastre masivo UFLS: Frecuencia cayó a 48.90 Hz. Isla eléctrica aislada por la interconexión automática.'
            });
          }
        }
      }

      // ── Alertas continuas de tensión ──
      if (!simEnded && voltage >= 430) {
        nextLogs.unshift({
          time: nextTime,
          type: 'warn',
          text: `Alerta: Tensión en el eje sur a ${voltage.toFixed(1)} kV — superando límites continuos. Riesgo de arco y disparo OVP.`
        });
      }

      return {
        ...state,
        time: nextTime,
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
      return { ...INITIAL_STATE, logs: [...INITIAL_STATE.logs] };

    default:
      return state;
  }
}

// ─── Helpers de color HMI ─────────────────────────────────────────────────────
function getFreqColor(f) {
  if (f < 49.2 || f > 50.8) return '#FF073A';
  if (f < 49.8 || f > 50.2) return '#FFEA00';
  return '#39FF14';
}

function getVoltColor(v) {
  if (v >= 430 || v < 380) return '#FF073A';
  if (v >= 420 || v < 390) return '#FFEA00';
  return '#39FF14';
}

function getOscColor(osc) {
  if (osc > 3.0) return '#FF073A';
  if (osc > 1.8) return '#FFEA00';
  return '#39FF14';
}

function getSscColor(ssc) {
  if (ssc < 6500) return '#FFEA00';
  return '#39FF14';
}

// ─── Descripciones ampliadas de los resultados finales ───────────────────────
const OUTCOME_TEXT = {
  success: {
    heading: '✓ OPERACIÓN ESTABILIZADA — RED SALVADA',
    body: (
      <>
        <strong>¡Excelente trabajo, operador!</strong> Tu respuesta fue impecable. El arranque a tiempo del CCGT Málaga
        aportó el soporte síncrono indispensable (+1 500 MVA de potencia de cortocircuito). Mantener INELFE en
        PMODE3 inyectó inercia virtual desde el sistema europeo, conteniendo el RoCoF. El bloqueo preventivo de los
        OLTCs evitó el efecto Tap-Lag catastrófico. La red ibérica de 400 kV permanece sincronizada.
      </>
    )
  },
  blackout_frequency: {
    heading: '⚠ CERO ELÉCTRICO — COLAPSO DE FRECUENCIA',
    body: (
      <>
        <strong>DERRAME DE FRECUENCIA:</strong> Al aislar dinámicamente la península en PMODE1 y carecer del soporte
        síncrono local de Málaga, el disparo fortuito en Granada provocó un desequilibrio activo masivo. El RoCoF
        se disparó a más de 1.8 Hz/s; la frecuencia cruzó 49.0 Hz activando el deslastre automático UFLS, lo que
        no fue suficiente para frenar la caída. Lección: la inercia es la primera línea de defensa.
      </>
    )
  },
  blackout_voltage: {
    heading: '⚠ CERO ELÉCTRICO — COLAPSO DE TENSIÓN',
    body: (
      <>
        <strong>INESTABILIDAD DE TENSIÓN:</strong> El mallado elevó excesivamente la tensión por Efecto Ferranti
        por encima de los 434 kV. Los relés ANSI 59 de los parques fotovoltaicos adyacentes desconectaron
        834 MW de golpe. Sin bloquear los OLTCs, los transformadores trataron de compensar la caída succionando
        reactiva residual, colapsando las tensiones a mínimos dieléctricos insostenibles. Lección: mallado e
        inercia deben acompañarse siempre del bloqueo de reguladores de tensión en tap.
      </>
    )
  }
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function CecoelSimulator() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playSpeed,     setPlaySpeed]     = useState(2000); // ms por tick

  const timerRef = useRef(null);

  // ── Auto-play con intervalo configurable ──
  useEffect(() => {
    if (isAutoPlaying && !state.simEnded) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), playSpeed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, state.simEnded, playSpeed]);

  // ── Detener auto-play cuando termina la simulación ──
  useEffect(() => {
    if (state.simEnded) setIsAutoPlaying(false);
  }, [state.simEnded]);

  const toggleAction = (actionName) => dispatch({ type: 'TOGGLE_ACTION', payload: actionName });
  const handleTick   = ()           => dispatch({ type: 'TICK' });
  const handleRestart= ()           => { dispatch({ type: 'RESTART' }); setIsAutoPlaying(false); };
  const togglePlay   = ()           => setIsAutoPlaying(p => !p);

  // ── Mini barras de telemetría ──
  // Normalizan el valor a un porcentaje visual dentro del rango operativo
  const freqBarPct = Math.max(0, Math.min(100, ((state.frequency - 48.5) / (51.5 - 48.5)) * 100));
  const voltBarPct = Math.max(0, Math.min(100, ((state.voltage  - 360)   / (450  - 360))   * 100));
  const oscBarPct  = Math.max(0, Math.min(100, (state.oscAmplitude / 6.5) * 100));
  const sscBarPct  = Math.max(0, Math.min(100, ((state.shortCircuitPower - 4000) / (9000 - 4000)) * 100));

  const outcome = state.simEnded ? OUTCOME_TEXT[state.simEnded] : null;

  return (
    <div className={styles.scadaWrapper}>
      {/* Efecto CRT */}
      <div className={styles.crtOverlay} aria-hidden="true" />

      <div className={styles.scadaContainer}>
        {/* ── Cabecera SCADA ── */}
        <div className={styles.scadaHeader}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.blinkingDot} aria-hidden="true" />
            <span className={styles.systemStatus}>REE CECOEL · HMI TELEMETRY V2.8</span>
          </div>
          <div className={styles.timeGroup}>
            <span>TIME_REF:</span>
            <strong className={styles.timeVal}>{state.time} CEST</strong>
          </div>
        </div>

        {/* ── Panel de Telemedida ── */}
        <div className={styles.telemetryGrid} role="group" aria-label="Parámetros de telemetría en tiempo real">

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>FREQ_SYS (Hz)</span>
            <span className={styles.telemetryValue} style={{ color: getFreqColor(state.frequency) }}>
              {state.frequency.toFixed(2)}
            </span>
            <div className={styles.telemetryLimits}>NOM: 50.00 | MIN: 49.00 | MAX: 51.00</div>
            <div className={styles.telemetryBar}>
              <div
                className={styles.telemetryBarFill}
                style={{ width: `${freqBarPct}%`, backgroundColor: getFreqColor(state.frequency) }}
              />
            </div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>VOLT_400KV_SUR (kV)</span>
            <span className={styles.telemetryValue} style={{ color: getVoltColor(state.voltage) }}>
              {Math.round(state.voltage)}
            </span>
            <div className={styles.telemetryLimits}>NOM: 400 | WARN: &gt;420 | TRIP: &gt;434</div>
            <div className={styles.telemetryBar}>
              <div
                className={styles.telemetryBarFill}
                style={{ width: `${voltBarPct}%`, backgroundColor: getVoltColor(state.voltage) }}
              />
            </div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>OSC_AMP_0.63HZ (kV)</span>
            <span className={styles.telemetryValue} style={{ color: getOscColor(state.oscAmplitude) }}>
              ±{state.oscAmplitude.toFixed(1)}
            </span>
            <div className={styles.telemetryLimits}>STABLE: &lt;1.0 | CRITICAL: &gt;3.0</div>
            <div className={styles.telemetryBar}>
              <div
                className={styles.telemetryBarFill}
                style={{ width: `${oscBarPct}%`, backgroundColor: getOscColor(state.oscAmplitude) }}
              />
            </div>
          </div>

          <div className={styles.telemetryItem}>
            <span className={styles.telemetryLabel}>S_CC_LOCAL (MVA)</span>
            <span className={styles.telemetryValue} style={{ color: getSscColor(state.shortCircuitPower) }}>
              {state.shortCircuitPower.toLocaleString('es-ES')}
            </span>
            <div className={styles.telemetryLimits}>N-1 LIMIT: &gt;7.500 | NOW: {state.shortCircuitPower}</div>
            <div className={styles.telemetryBar}>
              <div
                className={styles.telemetryBarFill}
                style={{ width: `${sscBarPct}%`, backgroundColor: getSscColor(state.shortCircuitPower) }}
              />
            </div>
          </div>
        </div>

        {/* ── Layout de Control ── */}
        <div className={styles.controlLayout}>

          {/* Columna Izquierda: Consignas de Despacho */}
          <div className={styles.actionsPanel}>
            <h4 className={styles.panelTitle}>CONSIGNAS DE DESPACHO</h4>
            <p className={styles.panelDesc}>Activa o desactiva maniobras operativas sobre el eje sur-occidental.</p>

            <div className={styles.togglesList}>
              {/* MALLADO */}
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>MANIOBRA DE MALLADO</strong>
                  <span className={styles.actionDesc}>Conectar 11 líneas en vacío en Sevilla/Granada para bajar impedancia.</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.meshNetwork ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('meshNetwork')}
                  disabled={!!state.simEnded}
                  aria-pressed={state.actions.meshNetwork}
                >
                  {state.actions.meshNetwork ? 'MALLADO ACTIVO' : 'MALLADO INACTIVO'}
                </button>
              </div>

              {/* HVDC PMODE3 */}
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>CONTROL HVDC: INELFE-1 PMODE3</strong>
                  <span className={styles.actionDesc}>Mantener emulación AC dinámica con Francia (en lugar de fijar PMODE1).</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.keepPmode3 ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('keepPmode3')}
                  disabled={!!state.simEnded}
                  aria-pressed={state.actions.keepPmode3}
                >
                  {state.actions.keepPmode3 ? 'PMODE3 ACTIVO' : 'PMODE1 (CONGELADO)'}
                </button>
              </div>

              {/* CCGT */}
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>ARRANQUE FORZADO: CCGT MÁLAGA</strong>
                  <span className={styles.actionDesc}>Acoplar reserva térmica síncrona (+1.500 MVA). Retardo: 3 min. Coste: 50.000 €.</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${
                    state.ccgtStatus === 'synchronized' ? styles.btnSync
                    : state.ccgtStatus === 'starting'   ? styles.btnWait
                    :                                     styles.btnOff
                  }`}
                  onClick={() => toggleAction('startCCGT')}
                  disabled={state.ccgtStatus !== 'idle' || !!state.simEnded}
                  aria-label={
                    state.ccgtStatus === 'synchronized' ? 'CCGT sincronizado' :
                    state.ccgtStatus === 'starting'     ? `Arranque en curso — ${state.ccgtTimer} min restantes` :
                    'Arrancar CCGT Málaga'
                  }
                >
                  {state.ccgtStatus === 'synchronized'
                    ? 'CCGT ONLINE (+1500 MVA)'
                    : state.ccgtStatus === 'starting'
                    ? `INICIANDO RAMP-UP (${state.ccgtTimer} min)`
                    : 'ARRANCAR CCGT'}
                </button>
              </div>

              {/* OLTCs */}
              <div className={styles.toggleRow}>
                <div className={styles.toggleInfo}>
                  <strong className={styles.actionName}>BLOQUEO DE OLTCs</strong>
                  <span className={styles.actionDesc}>Bloquear cambiadores de toma en nudos del sur (evitar Tap-Lag y colapso de tensión).</span>
                </div>
                <button
                  className={`${styles.actionBtn} ${state.actions.blockOLTC ? styles.btnOn : styles.btnOff}`}
                  onClick={() => toggleAction('blockOLTC')}
                  disabled={!!state.simEnded}
                  aria-pressed={state.actions.blockOLTC}
                >
                  {state.actions.blockOLTC ? 'OLTCs BLOQUEADOS' : 'OLTCs AUTOMÁTICOS'}
                </button>
              </div>
            </div>

            {/* Controles de simulación */}
            <div className={styles.playbackControls}>
              <div className={styles.playbackRow}>
                <button
                  onClick={togglePlay}
                  className={`${styles.playbackBtn} ${isAutoPlaying ? styles.activePlayback : ''}`}
                  disabled={!!state.simEnded}
                  aria-pressed={isAutoPlaying}
                >
                  {isAutoPlaying ? '⏸ PAUSAR SIMULACIÓN' : '▶ INICIAR AUTO-PLAY'}
                </button>

                {/* Selector de velocidad de simulación */}
                <button
                  onClick={() => setPlaySpeed(p => p === 2000 ? 1000 : 2000)}
                  className={styles.speedToggle}
                  disabled={!!state.simEnded}
                  title="Cambiar velocidad de simulación"
                  aria-label={`Velocidad actual: ${playSpeed === 2000 ? '1×' : '2×'}. Clic para cambiar.`}
                >
                  {playSpeed === 2000 ? '1× VEL' : '2× VEL'}
                </button>
              </div>

              <button
                onClick={handleTick}
                className={styles.playbackBtn}
                disabled={isAutoPlaying || !!state.simEnded}
              >
                ▶ Siguiente Minuto (+1 min)
              </button>

              <button
                onClick={handleRestart}
                className={`${styles.playbackBtn} ${styles.btnRestart}`}
              >
                ↺ REINICIAR ESCENARIO
              </button>
            </div>
          </div>

          {/* Columna Derecha: Logs e Historial */}
          <div className={styles.logsPanel}>
            <h4 className={styles.panelTitle}>CONSOLA DE EVENTOS — SCADA</h4>

            <div className={styles.budgetDisplay}>
              <span>PRESUPUESTO DE AJUSTE:</span>
              <strong style={{ color: state.budget < 100000 ? '#FFEA00' : '#39FF14' }}>
                {state.budget.toLocaleString('es-ES')} €
              </strong>
            </div>

            <div className={styles.logsContainer} aria-live="polite" aria-relevant="additions">
              {state.logs.map((log, index) => (
                <div
                  key={index}
                  className={`${styles.logItem} ${
                    log.type === 'danger' ? styles.logDanger
                    : log.type === 'warn' ? styles.logWarn
                    :                       styles.logInfo
                  }`}
                >
                  <span className={styles.logTime}>[{log.time}]</span>
                  <span className={styles.logText}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Modal de Resolución ── */}
        {state.simEnded && outcome && (
          <div
            className={styles.resolutionOverlay}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className={`${styles.resolutionModal} ${state.simEnded === 'success' ? styles.modalSuccess : styles.modalDanger}`}>
              <h3 id="modal-title" className={styles.resolutionTitle}>
                {outcome.heading}
              </h3>

              <div className={styles.resolutionBody}>
                <p style={{ margin: 0 }}>{outcome.body}</p>

                <div className={styles.statsSummary}>
                  <div className={styles.statLine}>
                    <span>Presupuesto Final:</span>
                    <strong>{state.budget.toLocaleString('es-ES')} €</strong>
                  </div>
                  <div className={styles.statLine}>
                    <span>Frecuencia Final:</span>
                    <strong style={{ color: getFreqColor(state.frequency) }}>
                      {state.frequency.toFixed(2)} Hz
                    </strong>
                  </div>
                  <div className={styles.statLine}>
                    <span>Tensión Final:</span>
                    <strong style={{ color: getVoltColor(state.voltage) }}>
                      {Math.round(state.voltage)} kV
                    </strong>
                  </div>
                  <div className={styles.statLine}>
                    <span>S_CC Local Final:</span>
                    <strong style={{ color: getSscColor(state.shortCircuitPower) }}>
                      {state.shortCircuitPower.toLocaleString('es-ES')} MVA
                    </strong>
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
