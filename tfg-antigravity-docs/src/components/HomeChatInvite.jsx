import React, { useState } from 'react';
import styles from './HomeChatInvite.module.css';

const SUGGESTIONS = [
  '¿Por qué el UFLS agravó el colapso?',
  '¿Cuántos MW se perdieron en la cascada?',
  '¿Qué diferencia hay entre GFL y GFM?',
  '¿Por qué colapsó el sistema si había energía suficiente?',
];

export default function HomeChatInvite() {

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>Asistente pericial</p>
          <h2 className={styles.heading}>
            Pregunta directamente<br />al análisis forense
          </h2>
          <p className={styles.desc}>
            El chatbot RAG tiene indexadas las 170 evidencias, los 28 simuladores
            y los capítulos del TFG. Responde con cadenas causales, cifras
            exactas y enlaces directos a las secciones relevantes.
          </p>
          <p className={styles.note}>
            Disponible en la esquina inferior derecha de cualquier página.
          </p>
        </div>
        <div className={styles.right}>
          <div className={styles.terminal}>
            <div className={styles.terminalHeader}>
              <span className={styles.dot} style={{ background: '#ff5f57' }} />
              <span className={styles.dot} style={{ background: '#febc2e' }} />
              <span className={styles.dot} style={{ background: '#28c840' }} />
              <span className={styles.terminalTitle}>Asistente del TFG — Apagón 28A</span>
            </div>
            <div className={styles.terminalBody}>
              <div className={styles.msg}>
                <span className={styles.msgLabel}>asistente</span>
                <span className={styles.msgText}>
                  Hola. Soy el asistente pericial del TFG sobre el apagón del
                  28-A. Pregúntame sobre causas técnicas, evidencias, cifras o
                  fuentes documentales.
                </span>
              </div>
              <div className={styles.suggestions}>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className={styles.suggestion}
                    tabIndex={-1}
                    disabled
                    aria-hidden="true"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
