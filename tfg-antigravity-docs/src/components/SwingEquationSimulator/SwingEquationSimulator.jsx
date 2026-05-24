import React from 'react';
import styles from './SwingEquationSimulator.module.css';

const SwingEquationSimulator = () => {
  return (
    <div className={styles.wrapper}>
      {/* 
        Dado que el nuevo código proporcionado está escrito en HTML/JS/CSS nativo con Canvas, 
        lo cargamos mediante un iframe desde la carpeta /static/ para garantizar su correcto funcionamiento
        y aislamiento dentro de React.
      */}
      <div className={styles.iframeContainer}>
        <iframe 
          src="/SwingEquationSimulator/index.html" 
          className={styles.simulatorIframe}
          title="Simulador Ecuación del Swing"
          frameBorder="0"
          scrolling="no"
          allowFullScreen
        ></iframe>
      </div>

      <div className={styles.legendContainer}>
        <h3>📘 Guía de Interpretación para el Espectador</h3>
        <p>Este simulador interactivo te permite experimentar con la física real de la red eléctrica europea y observar qué ocurre cuando hay un desequilibrio entre la energía que se genera y la que se consume.</p>
        
        <div className={styles.legendGrid}>
          <div className={styles.legendCard}>
            <h4>1. Inercia del Sistema (H)</h4>
            <p><strong>¿Qué es?</strong> La "pesadez" de los generadores giratorios tradicionales (nucleares, gas). Actúa como un amortiguador natural.</p>
            <p><strong>Pruébalo:</strong> Baja la inercia (1.0s) y verás que la frecuencia cae rapidísimo. Súbela (8.0s) y el sistema resistirá más tiempo antes de colapsar.</p>
          </div>
          
          <div className={styles.legendCard}>
            <h4>2. Pérdida de Generación (ΔP)</h4>
            <p><strong>¿Qué es?</strong> Representa una desconexión súbita de centrales eléctricas. El 28 de abril, se perdió casi el 9% de la generación ibérica de golpe.</p>
            <p><strong>Pruébalo:</strong> Ajusta este valor para ver cómo perturbaciones más grandes provocan caídas más violentas (mayor ROCOF).</p>
          </div>
          
          <div className={styles.legendCard}>
            <h4>3. Inercia Sintética (FFR)</h4>
            <p><strong>¿Qué es?</strong> Respuesta rápida inyectada artificialmente por baterías y renovables para simular la inercia que no tienen.</p>
            <p><strong>Pruébalo:</strong> Úsala junto al botón "Red Débil". Observa cómo una FFR agresiva en una red aislada no estabiliza el sistema, sino que crea oscilaciones peligrosas.</p>
          </div>
        </div>

        <div className={styles.legendNote}>
          <strong>💡 Consejo:</strong> Haz clic en el botón <code>🎬 DEMO 28A</code> dentro del simulador para recrear exactamente las condiciones físicas (muy baja inercia y pérdida de generación) que provocaron el apagón ibérico real. Fíjate cómo la alarma de ROCOF parpadea en rojo cuando el colapso se vuelve inevitable.
        </div>
      </div>
    </div>
  );
};

export default SwingEquationSimulator;
