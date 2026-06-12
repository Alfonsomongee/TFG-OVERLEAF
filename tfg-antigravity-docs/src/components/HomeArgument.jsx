import React from 'react';
import styles from './HomeArgument.module.css';

export default function HomeArgument() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>Sobre esta web</p>
          <h2 className={styles.heading}>
            Un análisis forense en diez anexos
          </h2>
        </div>
        <div className={styles.right}>
          <p>
            Esta web no sustituye al TFG escrito: lo amplía mediante figuras
            interactivas, series temporales de ESIOS y ENTSO-E, simuladores
            físicos y evidencias técnicas organizadas por tema. Cada anexo
            reúne un tipo de evidencia — datos operativos, análisis de
            estabilidad, flujos transfronterizos, mercado, reposición, impacto
            socioeconómico, comunicación, metodología y ecuaciones — y los
            conecta con el argumento central del capítulo correspondiente.
          </p>
          <p>
            La tesis es única: el apagón del 28-A no fue un accidente de
            frecuencia ni un fallo de generación. Fue un colapso de tensión
            capacitivo en una red con baja potencia de cortocircuito, provocado
            por una cascada de 15.000 MW en 30 segundos que el sistema de
            control no pudo ver ni contener. Las evidencias sostienen esa
            distinción.
          </p>
          <p>
            Los anexos se pueden explorar en cualquier orden. El índice
            conceptual ofrece una entrada transversal por término técnico,
            figura o tabla.
          </p>
        </div>
      </div>
    </section>
  );
}
