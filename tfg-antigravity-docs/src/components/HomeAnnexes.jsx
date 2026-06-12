import React from 'react';
import Link from '@docusaurus/Link';
import styles from './HomeAnnexes.module.css';

const ANNEXES = [
  {
    num: 'I',
    title: 'Demanda y balance',
    slug: '/anexo-demanda-generacion-balance',
    desc: 'Mix generación, previsiones, capacidad',
  },
  {
    num: 'II',
    title: 'Estabilidad dinámica',
    slug: '/anexo-estabilidad-dinamica-tension',
    desc: 'Tensión, frecuencia, inercia, PMU',
  },
  {
    num: 'III',
    title: 'Protecciones y cascada',
    slug: '/anexo-cascada-protecciones-desconexiones',
    desc: 'Tap-Lag, ANSI 59, deslastre UFLS',
  },
  {
    num: 'IV',
    title: 'Interconexiones',
    slug: '/anexo-interconexiones-flujos',
    desc: 'Flujos transfronterizos, HVDC, Francia',
  },
  {
    num: 'V',
    title: 'Mercado eléctrico',
    slug: '/anexo-mercado-costes',
    desc: 'Precios SPOT, desvíos, ERS',
  },
  {
    num: 'VI',
    title: 'Reposición',
    slug: '/anexo-reposicion-blackstart',
    desc: 'Black Start, islas, demanda restituida',
  },
  {
    num: 'VII',
    title: 'Impacto socioeconómico',
    slug: '/anexo-impacto-resiliencia',
    desc: 'VoLL, costes, comparativa histórica',
  },
  {
    num: 'VIII',
    title: 'Comunicación',
    slug: '/anexo-comunicacion-fuentes',
    desc: 'Prensa, relato público, consenso pericial',
  },
  {
    num: 'IX',
    title: 'Metodología',
    slug: '/anexo-metodologia-modelos-datos-vivos',
    desc: 'Fuentes, contraste pericial, modelos',
  },
  {
    num: 'X',
    title: 'Ecuaciones y simuladores',
    slug: '/anexo-ecuaciones-matematicas',
    desc: '28 simuladores interactivos',
  },
];

export default function HomeAnnexes() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Sistema de evidencias</p>
          <h2 className={styles.heading}>Diez anexos</h2>
          <p className={styles.sub}>
            170 elementos documentales — figuras, tablas, series e
            interactivos — organizados por dominio técnico.
          </p>
        </div>
        <div className={styles.grid}>
          {ANNEXES.map((a) => (
            <Link key={a.num} to={a.slug} className={styles.card}>
              <span className={styles.cardNum}>{a.num}</span>
              <span className={styles.cardTitle}>{a.title}</span>
              <span className={styles.cardDesc}>{a.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
