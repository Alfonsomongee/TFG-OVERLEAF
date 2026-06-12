import React from 'react';
import Link from '@docusaurus/Link';
import styles from './HomeReadingPaths.module.css';

const PATHS = [
  {
    id: '01',
    label: 'Ruta rápida',
    time: '10–15 min',
    description:
      'Los hechos esenciales, la causa raíz y el coste del colapso sin entrar en detalle técnico.',
    links: [
      { to: '/resumen-de-cifras', text: 'Resumen de cifras' },
      { to: '/analisis-incidente', text: 'Análisis del incidente' },
      { to: '/07b-consecuencias-financieras', text: 'Consecuencias financieras' },
    ],
  },
  {
    id: '02',
    label: 'Ruta técnica',
    time: '45–60 min',
    description:
      'La secuencia eléctrica completa: condición previa, mecanismos de colapso, protecciones, interconexiones y reposición.',
    links: [
      { to: '/contexto', text: 'Contexto técnico' },
      { to: '/analisis-incidente', text: 'Análisis del incidente' },
      { to: '/analisis-informes', text: 'Contraste de informes' },
      { to: '/resiliencia-futuro', text: 'Resiliencia y futuro' },
    ],
  },
  {
    id: '03',
    label: 'Ruta documental',
    time: 'A demanda',
    description:
      'Consulta directa de evidencias, datos, modelos y figuras organizadas por tema en los diez anexos.',
    links: [
      { to: '/anexo-indice-conceptual', text: 'Índice conceptual' },
      { to: '/glosario', text: 'Glosario técnico' },
      { to: '/anexo-metodologia-modelos-datos-vivos', text: 'Metodología y fuentes' },
    ],
  },
];

export default function HomeReadingPaths() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Tres formas de recorrer la investigación</p>
        <div className={styles.grid}>
          {PATHS.map((path) => (
            <div key={path.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardId}>{path.id}</span>
                <div>
                  <h3 className={styles.cardLabel}>{path.label}</h3>
                  <span className={styles.cardTime}>{path.time}</span>
                </div>
              </div>
              <p className={styles.cardDesc}>{path.description}</p>
              <ul className={styles.cardLinks}>
                {path.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.cardLink}>
                      {link.text} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
