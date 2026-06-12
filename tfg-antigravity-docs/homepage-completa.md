# HOMEPAGE COMPLETA — CÓDIGO EXACTO
# Crear estos archivos en orden. No modificar los existentes hasta el paso final.
# Al terminar: npm run build

---

## ARCHIVO 1: src/components/HomeHero.jsx

```jsx
import React, { useEffect, useRef } from 'react';
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
  const chainRef = useRef(null);

  useEffect(() => {
    const nodes = chainRef.current?.querySelectorAll(`.${styles.node}`);
    if (!nodes) return;
    nodes.forEach((node, i) => {
      node.style.animationDelay = `${0.3 + i * 0.25}s`;
    });
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
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

        {/* Cadena causal */}
        <div className={styles.chain} ref={chainRef} aria-label="Cadena causal del colapso">
          {CHAIN.map((step, i) => (
            <React.Fragment key={step.label}>
              <Link to={step.href} className={styles.node}>
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

        {/* CTAs */}
        <div className={styles.ctas}>
          <Link to="/contexto" className={styles.ctaPrimary}>
            Leer el análisis
          </Link>
          <Link to="/anexo-demanda-generacion-balance" className={styles.ctaSecondary}>
            Explorar anexos
          </Link>
          <Link to="/glosario" className={styles.ctaTertiary}>
            Glosario técnico
          </Link>
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
```

---

## ARCHIVO 2: src/components/HomeHero.module.css

```css
/* ── HomeHero ──────────────────────────────────────────────── */

.hero {
  background: var(--ifm-background-color);
  border-bottom: 1px solid rgba(107, 16, 36, 0.12);
  padding: 0;
}

.inner {
  max-width: 900px;
  margin: 0 auto;
  padding: 5rem 2rem 3.5rem;
}

/* Eyebrow */
.eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B1024;
  margin-bottom: 1.25rem;
}

html[data-theme='dark'] .eyebrow {
  color: #c0556e;
}

/* Title */
.title {
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--ifm-font-color-base);
  margin: 0 0 1.5rem;
}

.titleAccent {
  color: #6B1024;
  display: inline;
}

html[data-theme='dark'] .titleAccent {
  color: #c0556e;
}

/* Subtitle */
.subtitle {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ifm-color-secondary-darkest, #64707d);
  max-width: 640px;
  margin: 0 0 3rem;
}

html[data-theme='dark'] .subtitle {
  color: #a9b6c7;
}

/* ── Cadena causal ── */
.chain {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  margin: 0 0 3rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(107, 16, 36, 0.15);
}

html[data-theme='dark'] .chain {
  border-left-color: rgba(192, 85, 110, 0.20);
}

.node {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 1.25rem;
  border-radius: 0 6px 6px 0;
  text-decoration: none !important;
  color: inherit !important;
  background: transparent;
  transition: background 0.15s ease;
  opacity: 0;
  animation: nodeFadeIn 0.4s ease forwards;
  position: relative;
}

.node::before {
  content: '';
  position: absolute;
  left: -1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6B1024;
  border: 2px solid var(--ifm-background-color);
}

html[data-theme='dark'] .node::before {
  background: #c0556e;
}

.node:hover {
  background: rgba(107, 16, 36, 0.04);
  text-decoration: none;
}

html[data-theme='dark'] .node:hover {
  background: rgba(192, 85, 110, 0.07);
}

.nodeTime {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #6B1024;
  font-variant-numeric: tabular-nums;
}

html[data-theme='dark'] .nodeTime {
  color: #c0556e;
}

.nodeLabel {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--ifm-font-color-base);
  line-height: 1.2;
}

.nodeDetail {
  font-size: 0.78rem;
  color: var(--ifm-color-secondary-darkest, #64707d);
  line-height: 1.4;
}

html[data-theme='dark'] .nodeDetail {
  color: #91a4bc;
}

.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 0 1.25rem;
  opacity: 0.3;
  height: 0.6rem;
}

.arrowLine {
  display: none;
}

.arrowHead {
  font-size: 0.55rem;
  color: #6B1024;
  line-height: 1;
}

html[data-theme='dark'] .arrowHead {
  color: #c0556e;
}

@keyframes nodeFadeIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── CTAs ── */
.ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.ctaPrimary {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  background: #6B1024;
  color: #fff !important;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none !important;
  transition: background 0.15s ease, transform 0.1s ease;
}

.ctaPrimary:hover {
  background: #8a1a30;
  transform: translateY(-1px);
}

.ctaSecondary {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  border-radius: 6px;
  border: 1.5px solid #6B1024;
  color: #6B1024 !important;
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none !important;
  transition: all 0.15s ease;
}

.ctaSecondary:hover {
  background: rgba(107, 16, 36, 0.06);
  transform: translateY(-1px);
}

html[data-theme='dark'] .ctaSecondary {
  border-color: #c0556e;
  color: #c0556e !important;
}

.ctaTertiary {
  display: inline-block;
  padding: 0.75rem 1.25rem;
  color: var(--ifm-color-secondary-darkest, #64707d) !important;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none !important;
  border-bottom: 1px dashed rgba(0,0,0,0.25);
  transition: color 0.15s ease;
}

.ctaTertiary:hover {
  color: #6B1024 !important;
}

html[data-theme='dark'] .ctaTertiary {
  border-bottom-color: rgba(255,255,255,0.2);
}

html[data-theme='dark'] .ctaTertiary:hover {
  color: #c0556e !important;
}

/* ── Strip de cifras ── */
.strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-top: 1px solid rgba(107, 16, 36, 0.10);
  background: rgba(107, 16, 36, 0.025);
}

html[data-theme='dark'] .strip {
  background: rgba(192, 85, 110, 0.05);
  border-top-color: rgba(192, 85, 110, 0.12);
}

.stripItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  padding: 1.25rem 0.5rem;
  border-right: 1px solid rgba(107, 16, 36, 0.08);
}

.stripItem:last-child {
  border-right: none;
}

.stripValue {
  font-size: clamp(1.15rem, 2.5vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #6B1024;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

html[data-theme='dark'] .stripValue {
  color: #c0556e;
}

.stripLabel {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ifm-color-secondary-darkest, #64707d);
  text-align: center;
}

html[data-theme='dark'] .stripLabel {
  color: #91a4bc;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .inner {
    padding: 3.5rem 1.25rem 2.5rem;
  }

  .chain {
    padding-left: 0.75rem;
  }

  .strip {
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
  }

  .stripItem:nth-child(3) {
    border-right: none;
  }

  .stripItem:nth-child(4),
  .stripItem:nth-child(5) {
    border-top: 1px solid rgba(107,16,36,0.08);
  }

  .ctas {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

---

## ARCHIVO 3: src/components/HomeArgument.jsx

```jsx
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
            Los annexos se pueden explorar en cualquier orden. El índice
            conceptual ofrece una entrada transversal por término técnico,
            figura o tabla.
          </p>
        </div>
      </div>
    </section>
  );
}
```

---

## ARCHIVO 4: src/components/HomeArgument.module.css

```css
.section {
  padding: 4.5rem 2rem;
  background: var(--ifm-background-color);
  border-bottom: 1px solid rgba(0,0,0,0.07);
}

html[data-theme='dark'] .section {
  border-bottom-color: rgba(255,255,255,0.06);
}

.inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  align-items: start;
}

.eyebrow {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B1024;
  margin-bottom: 0.75rem;
}

html[data-theme='dark'] .eyebrow {
  color: #c0556e;
}

.heading {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--ifm-font-color-base);
  margin: 0;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.right p {
  font-size: 0.935rem;
  line-height: 1.75;
  color: var(--ifm-color-secondary-darkest, #64707d);
  margin: 0;
}

html[data-theme='dark'] .right p {
  color: #a9b6c7;
}

@media (max-width: 768px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
```

---

## ARCHIVO 5: src/components/HomeReadingPaths.jsx

```jsx
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
```

---

## ARCHIVO 6: src/components/HomeReadingPaths.module.css

```css
.section {
  padding: 4.5rem 2rem;
  background: rgba(107, 16, 36, 0.02);
  border-bottom: 1px solid rgba(0,0,0,0.07);
}

html[data-theme='dark'] .section {
  background: rgba(192, 85, 110, 0.03);
  border-bottom-color: rgba(255,255,255,0.06);
}

.inner {
  max-width: 900px;
  margin: 0 auto;
}

.eyebrow {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B1024;
  margin-bottom: 2rem;
}

html[data-theme='dark'] .eyebrow {
  color: #c0556e;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.card {
  padding: 1.75rem;
  border: 1px solid rgba(107, 16, 36, 0.10);
  border-radius: 8px;
  background: var(--ifm-background-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

html[data-theme='dark'] .card {
  border-color: rgba(192, 85, 110, 0.14);
  background: rgba(13, 26, 53, 0.4);
}

.cardHeader {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.cardId {
  font-size: 1.75rem;
  font-weight: 800;
  color: rgba(107, 16, 36, 0.15);
  line-height: 1;
  flex-shrink: 0;
  letter-spacing: -0.04em;
}

html[data-theme='dark'] .cardId {
  color: rgba(192, 85, 110, 0.2);
}

.cardLabel {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ifm-font-color-base);
  margin: 0 0 0.2rem;
}

.cardTime {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #6B1024;
}

html[data-theme='dark'] .cardTime {
  color: #c0556e;
}

.cardDesc {
  font-size: 0.845rem;
  line-height: 1.65;
  color: var(--ifm-color-secondary-darkest, #64707d);
  margin: 0;
  flex: 1;
}

html[data-theme='dark'] .cardDesc {
  color: #91a4bc;
}

.cardLinks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  border-top: 1px solid rgba(107, 16, 36, 0.08);
  padding-top: 1rem;
}

html[data-theme='dark'] .cardLinks {
  border-top-color: rgba(192, 85, 110, 0.10);
}

.cardLink {
  font-size: 0.80rem;
  font-weight: 600;
  color: #6B1024 !important;
  text-decoration: none !important;
  transition: opacity 0.15s ease;
}

.cardLink:hover {
  opacity: 0.7;
  text-decoration: underline !important;
}

html[data-theme='dark'] .cardLink {
  color: #c0556e !important;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## ARCHIVO 7: src/components/HomeAnnexes.jsx

```jsx
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
```

---

## ARCHIVO 8: src/components/HomeAnnexes.module.css

```css
.section {
  padding: 4.5rem 2rem;
  background: var(--ifm-background-color);
  border-bottom: 1px solid rgba(0,0,0,0.07);
}

html[data-theme='dark'] .section {
  border-bottom-color: rgba(255,255,255,0.06);
}

.inner {
  max-width: 900px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.eyebrow {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B1024;
  margin-bottom: 0.5rem;
}

html[data-theme='dark'] .eyebrow {
  color: #c0556e;
}

.heading {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ifm-font-color-base);
  margin: 0 0 0.5rem;
}

.sub {
  font-size: 0.88rem;
  color: var(--ifm-color-secondary-darkest, #64707d);
  margin: 0;
}

html[data-theme='dark'] .sub {
  color: #91a4bc;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  border: 1px solid rgba(107, 16, 36, 0.10);
  border-radius: 8px;
  overflow: hidden;
  background: rgba(107, 16, 36, 0.06);
}

html[data-theme='dark'] .grid {
  background: rgba(192, 85, 110, 0.08);
  border-color: rgba(192, 85, 110, 0.14);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.25rem 1rem;
  background: var(--ifm-background-color);
  text-decoration: none !important;
  color: inherit !important;
  transition: background 0.15s ease;
}

html[data-theme='dark'] .card {
  background: #0d1421;
}

.card:hover {
  background: rgba(107, 16, 36, 0.04);
}

html[data-theme='dark'] .card:hover {
  background: rgba(192, 85, 110, 0.07);
}

.cardNum {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #6B1024;
  text-transform: uppercase;
}

html[data-theme='dark'] .cardNum {
  color: #c0556e;
}

.cardTitle {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--ifm-font-color-base);
  line-height: 1.3;
}

.cardDesc {
  font-size: 0.70rem;
  color: var(--ifm-color-secondary-darkest, #64707d);
  line-height: 1.4;
}

html[data-theme='dark'] .cardDesc {
  color: #91a4bc;
}

@media (max-width: 820px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## ARCHIVO 9: src/components/HomeChatInvite.jsx

```jsx
import React, { useState } from 'react';
import styles from './HomeChatInvite.module.css';

const SUGGESTIONS = [
  '¿Por qué el UFLS agravó el colapso?',
  '¿Cuántos MW se perdieron en la cascada?',
  '¿Qué diferencia hay entre GFL y GFM?',
  '¿Por qué colapsó el sistema si había energía suficiente?',
];

export default function HomeChatInvite() {
  const [hovered, setHovered] = useState(null);

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
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(null)}
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
```

---

## ARCHIVO 10: src/components/HomeChatInvite.module.css

```css
.section {
  padding: 4.5rem 2rem 5rem;
  background: rgba(107, 16, 36, 0.03);
}

html[data-theme='dark'] .section {
  background: rgba(13, 20, 33, 0.6);
}

.inner {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

.eyebrow {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6B1024;
  margin-bottom: 0.75rem;
}

html[data-theme='dark'] .eyebrow {
  color: #c0556e;
}

.heading {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--ifm-font-color-base);
  margin: 0 0 1.25rem;
}

.desc {
  font-size: 0.88rem;
  line-height: 1.75;
  color: var(--ifm-color-secondary-darkest, #64707d);
  margin: 0 0 1rem;
}

html[data-theme='dark'] .desc {
  color: #a9b6c7;
}

.note {
  font-size: 0.75rem;
  color: var(--ifm-color-secondary-darkest, #64707d);
  font-style: italic;
  margin: 0;
}

html[data-theme='dark'] .note {
  color: #91a4bc;
}

/* Terminal mock */
.terminal {
  border: 1px solid rgba(107, 16, 36, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  background: var(--ifm-background-color);
}

html[data-theme='dark'] .terminal {
  background: #0d1117;
  border-color: rgba(255,255,255,0.10);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.terminalHeader {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(107, 16, 36, 0.04);
  border-bottom: 1px solid rgba(107, 16, 36, 0.08);
}

html[data-theme='dark'] .terminalHeader {
  background: rgba(255,255,255,0.04);
  border-bottom-color: rgba(255,255,255,0.08);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.terminalTitle {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--ifm-color-secondary-darkest, #64707d);
  margin-left: 0.5rem;
}

html[data-theme='dark'] .terminalTitle {
  color: #91a4bc;
}

.terminalBody {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.msg {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.msgLabel {
  font-size: 0.60rem;
  font-weight: 700;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #6B1024;
}

html[data-theme='dark'] .msgLabel {
  color: #c0556e;
}

.msgText {
  font-size: 0.82rem;
  line-height: 1.6;
  color: var(--ifm-font-color-base);
  background: rgba(107, 16, 36, 0.04);
  padding: 0.75rem 1rem;
  border-radius: 0 8px 8px 8px;
  border: 1px solid rgba(107, 16, 36, 0.08);
}

html[data-theme='dark'] .msgText {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.08);
}

.suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.suggestion {
  width: 100%;
  padding: 0.55rem 0.85rem;
  background: transparent;
  border: 1px solid rgba(107, 16, 36, 0.15);
  border-radius: 6px;
  font-size: 0.75rem;
  color: var(--ifm-color-secondary-darkest, #64707d);
  text-align: left;
  cursor: default;
  font-family: inherit;
}

html[data-theme='dark'] .suggestion {
  border-color: rgba(255,255,255,0.10);
  color: #91a4bc;
}

@media (max-width: 820px) {
  .inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
```

---

## ARCHIVO 11: src/pages/index.js (SUSTITUIR COMPLETO)

```jsx
import React from 'react';
import Layout from '@theme/Layout';
import HomeHero from '@site/src/components/HomeHero';
import HomeArgument from '@site/src/components/HomeArgument';
import HomeReadingPaths from '@site/src/components/HomeReadingPaths';
import HomeAnnexes from '@site/src/components/HomeAnnexes';
import HomeChatInvite from '@site/src/components/HomeChatInvite';

export default function Home() {
  return (
    <Layout
      title="Análisis forense del apagón ibérico del 28-A"
      description="Reconstrucción técnica, económica y social de la mayor perturbación del área síncrona continental europea. 170 evidencias, 10 anexos, 28 simuladores interactivos."
    >
      <HomeHero />
      <HomeArgument />
      <HomeReadingPaths />
      <HomeAnnexes />
      <HomeChatInvite />
    </Layout>
  );
}
```

---

## INSTRUCCIONES PARA EL AGENTE

1. Ejecutar primero: `cat src/pages/index.js` para ver el estado actual
2. Crear los 10 archivos nuevos (jsx + css) sin modificar nada existente
3. Sustituir `src/pages/index.js` con el contenido del Archivo 11
4. Ejecutar `npm run build`
5. Si hay algún error de import, verificar que las rutas de `Link to=` coincidan con los slugs reales del sitio (ajustar si un slug no existe)

**NO tocar:** ningún componente de annexo, ningún MDX, ningún archivo del chatbot.
