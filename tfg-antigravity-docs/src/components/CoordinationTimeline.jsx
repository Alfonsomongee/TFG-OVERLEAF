// %% AGENT_INSTRUCTION: Insertar donde corresponda la cronología de comunicaciones EAS/SAM entre operadores durante la separación y restauración del 28-A.
// %% LEGEND_PROPOSAL: "Secuencia de comunicaciones críticas entre operadores europeos durante la separación ibérica y la restauración. Rojo: crisis/separación. Ámbar: coordinación. Azul: mando unificado. Verde: restauración. Violeta: reconstrucción técnica."

import React, { useState, useCallback } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './CoordinationTimeline.module.css';

const TIMELINE_EVENTS = [
  { id: 'evt-01', time: '12:33:21.535', sender: 'RTE', receiver: 'REE', category: 'crisis', event: 'Apertura de las interconexiones aéreas de 400 kV por pérdida de sincronismo.', impact: 'Aislamiento eléctrico completo de la península ibérica y transición hacia colapso frecuencial.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-02', time: '12:34 – 12:36', sender: 'REE', receiver: 'REN', category: 'coordination', event: 'Comunicación telefónica de emergencia bilateral.', impact: 'Confirmación de apagón mutuo, fijación de intercambios a 0 MW e inicio de restauración.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-03', time: '12:37', sender: 'REE', receiver: 'RTE', category: 'coordination', event: 'Solicitud formal de energización de la interconexión Baixas–Vic.', impact: 'Solicitud de tensión desde el lado francés; RTE Toulouse deriva la consulta técnica a RTE París.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-04', time: '12:39', sender: 'Amprion', receiver: 'Swissgrid', category: 'crisis', event: 'Anuncio formal de System Split en el EAS.', impact: 'Activación oficial de los procedimientos de operación con Europa Continental dividida síncronamente.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-05', time: '12:39 – 12:40', sender: 'REE', receiver: 'RTE', category: 'restoration', event: 'Solicitud de tensión en Hernani desde Argia.', impact: 'RTE energiza con éxito la interconexión aérea de 400 kV Argia–Hernani.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-06', time: '12:41', sender: 'Swissgrid', receiver: 'RTE', category: 'coordination', event: 'Consulta operativa sobre estado y capacidad de transferencia.', impact: 'RTE confirma capacidad técnica de inyectar soporte inicial de hasta 400 MW a REE.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-07', time: '12:47', sender: 'REE', receiver: 'Swissgrid', category: 'crisis', event: 'Declaración oficial de Blackout en España y Portugal.', impact: 'Swissgrid registra la indisponibilidad ibérica; REE indica que no precisa soporte dinámico en ese instante.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-08', time: '12:47', sender: 'TERNA', receiver: 'RTE', category: 'coordination', event: 'Llamada bilateral con ofrecimiento de potencia de reserva.', impact: 'Refuerzo de márgenes de generación y estabilidad en el bloque continental remanente.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-09', time: '12:49 – 12:54', sender: 'Swissgrid', receiver: 'Amprion', category: 'command', event: 'Consenso telefónico de la estructura de mando y reparto de responsabilidades.', impact: 'REE queda como líder de frecuencia de Iberia; Swissgrid del resto de Europa Continental; RTE asume la resincronización.', source: 'ENTSO-E Incident Report', confidence: 'Primaria', highlight: true },
  { id: 'evt-10', time: '15:50', sender: 'Amprion', receiver: 'RTE', category: 'coordination', event: 'Alerta por solicitudes anómalas de 2.500 MW en PICASSO ligadas a precios negativos.', impact: 'RTE explica los desvíos por precios y comunica previsión de retorno de 500 MW.', source: 'ENTSO-E Incident Report', confidence: 'Primaria', isPicasso: true },
  { id: 'evt-11', time: '22:50', sender: 'RTE', receiver: 'Swissgrid', category: 'restoration', event: 'Reporte de operatividad inminente del Load Frequency Controller de REE.', impact: 'Programación de rampa de intercambio comercial de 0 MW a 1.400 MW desde Francia hacia España.', source: 'ENTSO-E Incident Report', confidence: 'Primaria' },
  { id: 'evt-12', time: '00:11 (29-A)', sender: 'RTE', receiver: 'Swissgrid', category: 'reconstruction', event: 'Notificación de cierre de lazo y estabilización del AGC de REE bajo régimen síncrono restaurado.', impact: 'El sistema español recupera el control automático y la compensación de desvíos.', source: 'Reconstrucción operativa basada en protocolo TSO', confidence: 'Reconstrucción técnica' },
];

const CATEGORY_META = {
  crisis: { label: 'Crisis / separación' },
  coordination: { label: 'Coordinación' },
  command: { label: 'Mando unificado' },
  restoration: { label: 'Restauración' },
  reconstruction: { label: 'Reconstrucción' },
};

export default function CoordinationTimeline() {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [expandedId, setExpandedId] = useState(null);

  const toggle = useCallback((id) => setExpandedId((p) => (p === id ? null : id)), []);

  const catColor = (cat) => {
    const map = {
      crisis: isDark ? '#d45a54' : '#a83832',
      coordination: isDark ? '#c49a4a' : '#9a6b2f',
      command: isDark ? '#5a90c8' : '#2a5080',
      restoration: isDark ? '#6aad52' : '#4a7c3a',
      reconstruction: isDark ? '#a07ab0' : '#6a4a7a',
    };
    return map[cat] || map.coordination;
  };

  return (
    <div className={styles.figure}>
      <header className={styles.header}>
        <span className={styles.kicker}>Coordinación continental</span>
        <h3 className={styles.title}>Cronología EAS/SAM: de la separación al mando unificado</h3>
        <p className={styles.subtitle}>
          Comunicaciones críticas entre operadores europeos durante la
          reposición ibérica.
        </p>
      </header>

      <div className={styles.legend}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <span key={key} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: catColor(key) }} aria-hidden="true" />
            {meta.label}
          </span>
        ))}
      </div>

      <ol className={styles.timeline} role="list">
        {TIMELINE_EVENTS.map((evt, i) => {
          const isExpanded = expandedId === evt.id;
          const color = catColor(evt.category);
          const isLast = i === TIMELINE_EVENTS.length - 1;

          return (
            <li key={evt.id} className={`${styles.event} ${evt.highlight ? styles.eventHighlight : ''}`}>
              <div className={styles.rail}>
                <button type="button" className={`${styles.marker} ${isExpanded ? styles.markerActive : ''}`}
                  style={{ backgroundColor: color, borderColor: color }}
                  aria-expanded={isExpanded} aria-controls={`coord-${evt.id}`}
                  aria-label={`${evt.time}: ${evt.sender} → ${evt.receiver}`}
                  onClick={() => toggle(evt.id)} />
                {!isLast && <span className={styles.stem} aria-hidden="true" />}
              </div>

              <div className={styles.body}>
                <button type="button" className={styles.summaryBtn}
                  aria-expanded={isExpanded} aria-controls={`coord-${evt.id}`}
                  onClick={() => toggle(evt.id)}>
                  <time className={styles.time}>{evt.time}</time>
                  <span className={styles.actors}>
                    <strong>{evt.sender}</strong> → <strong>{evt.receiver}</strong>
                  </span>
                  <span className={styles.eventText}>{evt.event}</span>
                </button>

                {isExpanded && (
                  <div id={`coord-${evt.id}`} className={styles.details} role="region">
                    <p><strong>Impacto:</strong> {evt.impact}</p>
                    <p><strong>Fuente:</strong> {evt.source}</p>
                    <p><strong>Confianza:</strong> {evt.confidence}</p>
                    {evt.highlight && (
                      <div className={styles.subpanel}>
                        <h4 className={styles.subTitle}>Reparto de responsabilidades</h4>
                        <p>REE — líder de frecuencia de Iberia. Swissgrid — líder de frecuencia del resto de Europa Continental. RTE — líder de resincronización.</p>
                      </div>
                    )}
                    {evt.isPicasso && (
                      <div className={styles.subpanel}>
                        <h4 className={styles.subTitle}>Anomalía PICASSO</h4>
                        <div className={styles.subGrid}>
                          <span className={styles.subLabel}>Solicitud anómala</span><span>2.500 MW</span>
                          <span className={styles.subLabel}>Causa</span><span>Precios negativos</span>
                          <span className={styles.subLabel}>Retorno previsto</span><span>500 MW</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
