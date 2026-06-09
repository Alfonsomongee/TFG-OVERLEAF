// CoordinationTimeline.jsx
import React, { useState, useCallback } from 'react';
import styles from './CoordinationTimeline.module.css';

const TIMELINE_EVENTS = [
  {
    id: 'evt-01',
    time: '12:33:21.535',
    sender: 'RTE',
    receiver: 'REE',
    category: 'crisis',
    event: 'Apertura de las interconexiones aéreas de 400 kV por pérdida de sincronismo.',
    impact:
      'Aislamiento eléctrico completo de la península ibérica y transición hacia colapso frecuencial.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-02',
    time: '12:34 – 12:36',
    sender: 'REE',
    receiver: 'REN',
    category: 'coordination',
    event: 'Comunicación telefónica de emergencia bilateral.',
    impact:
      'Confirmación de apagón mutuo, fijación de intercambios a 0 MW e inicio de restauración.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-03',
    time: '12:37',
    sender: 'REE',
    receiver: 'RTE',
    category: 'coordination',
    event: 'Solicitud formal de energización de la interconexión Baixas–Vic.',
    impact:
      'Solicitud de tensión desde el lado francés; RTE Toulouse deriva la consulta técnica a RTE París.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-04',
    time: '12:39',
    sender: 'Amprion',
    receiver: 'Swissgrid',
    category: 'crisis',
    event: 'Anuncio formal de System Split en el EAS.',
    impact:
      'Activación oficial de los procedimientos de operación con Europa Continental dividida síncronamente.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-05',
    time: '12:39 – 12:40',
    sender: 'REE',
    receiver: 'RTE',
    category: 'restoration',
    event: 'Solicitud de tensión en Hernani desde Argia.',
    impact: 'RTE energiza con éxito la interconexión aérea de 400 kV Argia–Hernani.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-06',
    time: '12:41',
    sender: 'Swissgrid',
    receiver: 'RTE',
    category: 'coordination',
    event: 'Consulta operativa sobre estado y capacidad de transferencia.',
    impact:
      'RTE confirma capacidad técnica de inyectar soporte inicial de hasta 400 MW a REE.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-07',
    time: '12:47',
    sender: 'REE',
    receiver: 'Swissgrid',
    category: 'crisis',
    event: 'Declaración oficial de Blackout en España y Portugal.',
    impact:
      'Swissgrid registra la indisponibilidad ibérica; REE indica que no precisa soporte dinámico en ese instante.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-08',
    time: '12:47',
    sender: 'TERNA',
    receiver: 'RTE',
    category: 'coordination',
    event: 'Llamada bilateral de emergencia con ofrecimiento de potencia de reserva.',
    impact:
      'Refuerzo de márgenes de generación y estabilidad en el bloque continental remanente.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-09',
    time: '12:49 – 12:54',
    sender: 'Swissgrid',
    receiver: 'Amprion',
    category: 'command',
    event: 'Consenso telefónico de la estructura de mando y reparto de responsabilidades.',
    impact:
      'REE queda como líder de frecuencia de Iberia; Swissgrid del resto de Europa Continental; RTE asume la resincronización.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
    highlight: true,
  },
  {
    id: 'evt-10',
    time: '15:50',
    sender: 'Amprion',
    receiver: 'RTE',
    category: 'coordination',
    event: 'Alerta por solicitudes anómalas de 2.500 MW en PICASSO ligadas a precios negativos.',
    impact:
      'RTE explica los desvíos por precios y comunica previsión de retorno de 500 MW.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
    isPicasso: true,
  },
  {
    id: 'evt-11',
    time: '22:50',
    sender: 'RTE',
    receiver: 'Swissgrid',
    category: 'restoration',
    event: 'Reporte de operatividad inminente del Load Frequency Controller de REE.',
    impact:
      'Programación de rampa de intercambio comercial de 0 MW a 1.400 MW desde Francia hacia España.',
    source: 'ENTSO-E Incident Report',
    confidence: 'Primaria',
  },
  {
    id: 'evt-12',
    time: '00:11 (29-A)',
    sender: 'RTE',
    receiver: 'Swissgrid',
    category: 'reconstruction',
    event:
      'Notificación de cierre de lazo y estabilización del AGC de REE bajo régimen síncrono restaurado.',
    impact:
      'El sistema español recupera el control automático y la compensación de desvíos.',
    source: 'Reconstrucción operativa basada en protocolo TSO',
    confidence: 'Reconstrucción técnica',
  },
];

const CATEGORY_LABELS = {
  crisis: 'Crisis / separación',
  coordination: 'Coordinación / mando',
  restoration: 'Restauración',
  command: 'Mando unificado',
  reconstruction: 'Reconstrucción técnica',
};

const CATEGORY_ORDER = ['crisis', 'coordination', 'command', 'restoration', 'reconstruction'];

export default function CoordinationTimeline() {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = useCallback((id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>Coordinación continental</span>
        <h2 className={styles.title}>Cronología EAS/SAM: de la separación al mando unificado</h2>
        <p className={styles.subtitle}>
          Secuencia de comunicaciones críticas entre operadores europeos durante la reposición
          ibérica.
        </p>
      </header>

      <div className={styles.legend} role="list" aria-label="Leyenda de categorías de eventos">
        {CATEGORY_ORDER.map((cat) => (
          <div key={cat} className={styles.legendItem} role="listitem">
            <span
              className={`${styles.legendSwatch} ${styles[`swatch-${cat}`] || ''}`}
              aria-hidden="true"
            />
            <span className={styles.legendLabel}>{CATEGORY_LABELS[cat]}</span>
          </div>
        ))}
      </div>

      <div className={styles.timeline}>
        {TIMELINE_EVENTS.map((evt) => {
          const isExpanded = expandedId === evt.id;
          const isCommand = evt.highlight === true;
          const isPicasso = evt.isPicasso === true;

          return (
            <div
              key={evt.id}
              className={`${styles.item} ${isExpanded ? styles.itemExpanded : ''} ${
                isCommand ? styles.itemCommand : ''
              }`}
            >
              <div className={styles.markerCol}>
                <button
                  type="button"
                  className={`${styles.marker} ${styles[`marker-${evt.category}`] || ''}`}
                  aria-expanded={isExpanded}
                  aria-controls={`event-details-${evt.id}`}
                  onClick={() => handleToggle(evt.id)}
                >
                  <span className={styles.markerInner} />
                </button>
                <div className={styles.line} aria-hidden="true" />
              </div>

              <div className={styles.content}>
                <button
                  type="button"
                  className={styles.summaryBtn}
                  aria-expanded={isExpanded}
                  aria-controls={`event-details-${evt.id}`}
                  onClick={() => handleToggle(evt.id)}
                >
                  <time className={styles.time}>{evt.time}</time>
                  <span className={styles.senderReceiver}>
                    <strong>{evt.sender}</strong> → <strong>{evt.receiver}</strong>
                  </span>
                  <span className={styles.eventText}>{evt.event}</span>
                </button>

                {isExpanded && (
                  <div id={`event-details-${evt.id}`} className={styles.details} role="region">
                    <p className={styles.impact}>
                      <span className={styles.label}>Impacto:</span> {evt.impact}
                    </p>
                    <p className={styles.source}>
                      <span className={styles.label}>Fuente:</span> {evt.source}
                    </p>
                    <p className={styles.confidence}>
                      <span className={styles.label}>Confianza:</span> {evt.confidence}
                    </p>

                    {isCommand && (
                      <div className={styles.commandSubpanel}>
                        <h4 className={styles.subpanelTitle}>Reparto de responsabilidades</h4>
                        <ul className={styles.commandList}>
                          <li>REE — líder de frecuencia de Iberia</li>
                          <li>Swissgrid — líder de frecuencia del resto de Europa Continental</li>
                          <li>RTE — líder de resincronización</li>
                        </ul>
                      </div>
                    )}

                    {isPicasso && (
                      <div className={styles.picassoSubpanel}>
                        <h4 className={styles.subpanelTitle}>Anomalía PICASSO</h4>
                        <dl className={styles.picassoData}>
                          <div>
                            <dt>Solicitud anómala</dt>
                            <dd>2.500 MW</dd>
                          </div>
                          <div>
                            <dt>Causa</dt>
                            <dd>Precios negativos</dd>
                          </div>
                          <div>
                            <dt>Retorno previsto</dt>
                            <dd>500 MW</dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}