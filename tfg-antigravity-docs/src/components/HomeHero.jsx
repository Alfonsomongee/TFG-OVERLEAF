import React from 'react';
import Link from '@docusaurus/Link';
import styles from './HomeHero.module.css';

const CHAIN = [
  {
    label: 'Condición previa',
    time: '12:30 CEST',
    detail: '82% IBR · 11 unidades síncronas · H = 2,3 s',
    href: '/anexo-demanda-generacion-balance',
  },
  {
    label: 'Disparo raíz',
    time: '12:32:56,993 CEST',
    detail: '355 MW — Granada · Tap-Lag · sobretensión invisible',
    href: '/analisis-incidente#fase-1',
  },
  {
    label: 'Cascada IBR',
    time: '12:33:07 CEST',
    detail: '4.500 MW en 11 s · protecciones ANSI 59',
    href: '/analisis-incidente#fase-3',
  },
  {
    label: 'Separación Francia',
    time: '12:33:21,535 CEST',
    detail: '48,46 Hz · 15.000 MW perdidos',
    href: '/analisis-incidente#fase-3',
  },
  {
    label: 'Cero de tensión',
    time: '12:33:29,741 CEST',
    detail: '57 millones sin suministro · área ibérica aislada',
    href: '/resumen-de-cifras#cifras-maestras',
  },
];

const NUMBERS = [
  { value: '57 M', label: 'personas afectadas' },
  { value: '15.000', label: 'MW perdidos' },
  { value: '33 s', label: 'de colapso total' },
  { value: '18,5 h', label: 'de reposición' },
  { value: '>666 M€', label: 'coste Op. Reforzada' },
];

export default function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.leftCol}>
          {/* Eyebrow */}
          <p className={styles.eyebrow}>
            Análisis forense · Apagón ibérico del 28 de abril de 2025
          </p>

          {/* Título */}
          <h1 className={styles.title}>
            El colapso del<br />
            <span className={styles.titleAccent}>sistema eléctrico</span><br />
            peninsular
          </h1>

          <p className={styles.subtitle}>
            Reconstrucción técnica, económica y social de la mayor perturbación
            del área síncrona continental europea en dos décadas. Ciento setenta
            evidencias, diez anexos, veintiocho simuladores.
          </p>

          {/* CTAs */}
          <div className={styles.ctas}>
            <Link to="/introduccion" className={styles.ctaPrimary}>
              Leer la introducción
            </Link>
            <Link to="/contexto" className={styles.ctaSecondary}>
              Análisis técnico
            </Link>
            <Link to="/glosario" className={styles.ctaTertiary}>
              Glosario técnico
            </Link>
          </div>
        </div>

        <div className={styles.rightCol}>
          {/* Cadena causal */}
          <div className={styles.chain} aria-label="Cadena causal del colapso">
            {CHAIN.map((step, i) => (
              <React.Fragment key={step.label}>
                <Link to={step.href} className={styles.node} style={{ animationDelay: `${0.3 + i * 0.25}s` }}>
                  <span className={styles.nodeTime}>{step.time}</span>
                  <span className={styles.nodeLabel}>{step.label}</span>
                  <span className={styles.nodeDetail}>{step.detail}</span>
                </Link>
                {i < CHAIN.length - 1 && (
                  <div className={styles.arrow} aria-hidden="true">
                    <div className={styles.arrowLine} />
                    <div className={styles.arrowHead}>▼</div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Franja de cifras */}
      <div className={styles.strip}>
        {NUMBERS.map((n) => (
          <div key={n.label} className={styles.stripItem}>
            <span className={styles.stripValue}>{n.value}</span>
            <span className={styles.stripLabel}>{n.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
