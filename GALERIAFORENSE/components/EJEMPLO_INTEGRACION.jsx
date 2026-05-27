/**
 * EJEMPLO DE INTEGRACIÓN EN DOCUSAURUS
 * 
 * Este archivo muestra cómo usar los 5 componentes en una página .mdx o .jsx
 * Cópialo como referencia en tu Docusaurus docs/
 */

import React from 'react';
import BrowserOnly from '@docusaurus/core/lib/client/components/BrowserOnly';
import {
  TimelineManoeuvres,
  ICSViolationsGrid,
  InertiaStackedBar,
  PowerCapacityComparison,
  LinesAvailability,
} from '@site/src/components/GaleriaForense';

// Si usas MDX, puedes incrustar esto directamente:
// <BrowserOnly>{() => <TimelineManoeuvres />}</BrowserOnly>

/**
 * Página completa de análisis forense
 */
export default function AnálisisForecenico() {
  return (
    <div style={{ background: 'hsl(220 40% 6%)', color: 'hsl(220 12% 82%)', padding: '2rem 0' }}>
      {/* ENCABEZADO */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
          El Cero de Tensión
        </h1>
        <p style={{ fontSize: '16px', color: 'hsl(220 12% 48%)', margin: 0 }}>
          Análisis Forense del Apagón Ibérico 28-A (2025)
        </p>
      </section>

      {/* SECCIÓN 1: TIMELINE DE MANIOBRAS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          § 1. Cascada de Maniobras de Control
        </h2>
        <p style={{ fontSize: '13px', color: 'hsl(220 12% 48%)', marginBottom: '1.5rem' }}>
          De 09:00 a 12:32 CEST, Red Eléctrica ejecutó 87 maniobras automáticas intentando estabilizar
          la tensión. Cada ajuste incrementó la fragilidad del sistema.
        </p>
        <BrowserOnly>{() => <TimelineManoeuvres />}</BrowserOnly>
      </section>

      {/* SECCIÓN 2: VIOLACIONES ICS */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          § 2. Matriz de Violaciones de Criterios ICS
        </h2>
        <p style={{ fontSize: '13px', color: 'hsl(220 12% 48%)', marginBottom: '1.5rem' }}>
          Durante la cascada, 7 de 21 criterios de seguridad fueron violados simultáneamente en la
          Península Ibérica, indicando fallo múltiple del sistema.
        </p>
        <BrowserOnly>{() => <ICSViolationsGrid />}</BrowserOnly>
      </section>

      {/* SECCIÓN 3: INERCIA */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          § 3. Distribución de Inercia Síncrona
        </h2>
        <p style={{ fontSize: '13px', color: 'hsl(220 12% 48%)', marginBottom: '1.5rem' }}>
          A las 12:00 CEST (30 min antes del colapso), la inercia total del sistema era de 2.31 segundos,
          muy por debajo del mínimo recomendado de 3.5 segundos. La zona SUR operaba al 33% de seguridad.
        </p>
        <BrowserOnly>{() => <InertiaStackedBar />}</BrowserOnly>
      </section>

      {/* SECCIÓN 4: POTENCIA DISPONIBLE */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', borderTop: '1px solid hsl(220 20% 18%)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          § 4. Capacidad de Generación Indisponible
        </h2>
        <p style={{ fontSize: '13px', color: 'hsl(220 12% 48%)', marginBottom: '1.5rem' }}>
          El 28-A a las 12:00 CEST, 12.8 GW de potencia instalada estaban indisponibles por mantenimiento
          o falta de combustible. La indisponibilidad de ciclos combinados (7.4 GW) limitó la capacidad
          de control de tensión y frecuencia.
        </p>
        <BrowserOnly>{() => <PowerCapacityComparison />}</BrowserOnly>
      </section>

      {/* SECCIÓN 5: DISPONIBILIDAD DE RED */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', borderTop: '1px solid hsl(220 20% 18%)', borderBottom: '1px solid hsl(220 20% 18%)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          § 5. Topología de Red: Degradación Progresiva
        </h2>
        <p style={{ fontSize: '13px', color: 'hsl(220 12% 48%)', marginBottom: '1.5rem' }}>
          Entre las 09:00 y 12:16, se abrieron progresivamente 55 líneas de 220 kV y 400 kV por control
          de tensión, indisponibilidades, y trabajos de mantenimiento. El sistema perdió redundancia N-1
          en varias zonas críticas.
        </p>
        <BrowserOnly>{() => <LinesAvailability />}</BrowserOnly>
      </section>

      {/* CONCLUSIÓN */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 1rem 0' }}>
          Conclusión: La Tormenta Perfecta
        </h2>
        <div
          style={{
            background: 'hsl(0 75% 58% / 0.08)',
            border: '1px solid hsl(0 75% 58% / 0.3)',
            borderRadius: '4px',
            padding: '1.5rem',
            fontSize: '13px',
            lineHeight: '1.8',
            color: 'hsl(220 12% 82%)',
          }}
        >
          <p style={{ margin: 0 }}>
            El apagón del 28-A fue consecuencia de una <strong>convergencia de fragilidades</strong>:
          </p>
          <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
            <li>Baja inercia síncrona (2.31s vs. 3.5s recomendado)</li>
            <li>Indisponibilidad masiva de potencia térmica (12.8 GW)</li>
            <li>Degradación progresiva de la topología (55 líneas abiertas)</li>
            <li>Maniobras automáticas incrementando inestabilidad</li>
            <li>Déficit de generación flexible en hora punta</li>
          </ul>
          <p style={{ margin: '1rem 0 0 0' }}>
            El fenómeno del <strong>Tap-Lag</strong> (retardo en respuesta de reguladores automáticos)
            desencadenó una cascada de disparos en 27 segundos, dejando a 57 millones de personas sin electricidad.
          </p>
        </div>
      </section>
    </div>
  );
}
