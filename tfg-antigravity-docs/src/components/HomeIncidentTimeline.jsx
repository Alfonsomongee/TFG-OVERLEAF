/**
 * HomeIncidentTimeline.jsx
 *
 * Cronología compacta del colapso — posición 4 de la homepage.
 * 5 fases del 28-A en línea horizontal con timestamps exactos.
 * CSS/SVG puro: sin Recharts ni librerías de gráficos.
 *
 * Interactividad: hover sobre cada fase muestra descripción expandida.
 * Cada fase enlaza al capítulo correspondiente.
 *
 * Los datos de la cadena causal se reutilizan del mismo objeto
 * que usa HomeHero (t.chain), importados aquí como constante local
 * para no crear dependencia entre componentes.
 */

import React, { useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './HomeIncidentTimeline.module.css';

const TRANSLATIONS = {
  es: {
    eyebrow: 'Cronología del colapso',
    heading: 'Menos de un minuto',
    sub: 'Del disparo raíz en Granada al cero de tensión en la península ibérica',
    phases: [
      {
        id: 'pre',
        time: '12:30 CEST',
        label: 'Condición previa',
        color: 'neutral',
        desc: '82 % de generación IBR, solo 11 unidades síncronas acopladas. Inercia equivalente en mínimo histórico de 2025. Las herramientas de mercado no detectan anomalía.',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        id: 'root',
        time: '12:32:57',
        label: 'Disparo raíz',
        color: 'warning',
        desc: 'Pérdida de 355 MW en Granada por Tap-Lag y sobretensión invisible al SCADA. Primera perturbación que inicia la cascada de tensión.',
        href: '/analisis-incidente',
      },
      {
        id: 'cascade',
        time: '12:33:16',
        label: 'Cascada IBR',
        color: 'critical',
        desc: '1.655 MW perdidos en 3 segundos. Protecciones ANSI 59 de inversores fotovoltaicos disparan en cascada por sobretensión capacitiva generalizada.',
        href: '/analisis-incidente',
      },
      {
        id: 'france',
        time: '12:33:21',
        label: 'Separación Francia',
        color: 'critical',
        desc: 'La interconexión con Francia se pierde a 48,46 Hz. El sistema ibérico queda aislado del área síncrona continental con 15.000 MW de déficit.',
        href: '/anexo-interconexiones-flujos',
      },
      {
        id: 'zero',
        time: '12:33:29',
        label: 'Cero de tensión',
        color: 'blackout',
        desc: 'Más de 50 millones de personas sin suministro en España y Portugal. Tensión a cero en la península ibérica. Comienza el proceso de reposición por Black Start.',
        href: '/resumen-de-cifras',
      },
    ],
    linkLabel: 'Ver capítulo →',
  },
  en: {
    eyebrow: 'Timeline of the collapse',
    heading: 'Under one minute',
    sub: 'From the root trip in Granada to voltage zero across the Iberian Peninsula',
    phases: [
      {
        id: 'pre',
        time: '12:30 CEST',
        label: 'Prior condition',
        color: 'neutral',
        desc: '82% IBR generation, only 11 synchronous units online. Equivalent inertia at 2025 historical minimum. Market tools detect no anomaly.',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        id: 'root',
        time: '12:32:57',
        label: 'Root trip',
        color: 'warning',
        desc: 'Loss of 355 MW in Granada due to Tap-Lag and overvoltage invisible to SCADA. First disturbance triggering the voltage cascade.',
        href: '/analisis-incidente',
      },
      {
        id: 'cascade',
        time: '12:33:16',
        label: 'IBR cascade',
        color: 'critical',
        desc: '1,655 MW lost in 3 seconds. ANSI 59 protections of photovoltaic inverters trip in cascade due to generalized capacitive overvoltage.',
        href: '/analisis-incidente',
      },
      {
        id: 'france',
        time: '12:33:21',
        label: 'French separation',
        color: 'critical',
        desc: 'Interconnection with France lost at 48.46 Hz. Iberian system isolated from the continental synchronous area with 15,000 MW deficit.',
        href: '/anexo-interconexiones-flujos',
      },
      {
        id: 'zero',
        time: '12:33:29',
        label: 'Voltage zero',
        color: 'blackout',
        desc: 'More than 50 million people without supply in Spain and Portugal. Voltage at zero across the Iberian Peninsula. Black Start restoration process begins.',
        href: '/resumen-de-cifras',
      },
    ],
    linkLabel: 'See chapter →',
  },
  de: {
    eyebrow: 'Chronologie des Zusammenbruchs',
    heading: 'Weniger als eine Minute',
    sub: 'Von der Ursprungsauslösung in Granada bis zum Spannungsnull auf der iberischen Halbinsel',
    phases: [
      {
        id: 'pre',
        time: '12:30 CEST',
        label: 'Vorbedingung',
        color: 'neutral',
        desc: '82% IBR-Erzeugung, nur 11 Synchronmaschinen im Netz. Äquivalente Trägheit auf historischem Tiefstand 2025. Marktinstrumente erkennen keine Anomalie.',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        id: 'root',
        time: '12:32:57',
        label: 'Ursprungsauslösung',
        color: 'warning',
        desc: 'Verlust von 355 MW in Granada durch Tap-Lag und für SCADA unsichtbare Überspannung. Erste Störung, die die Spannungskaskade auslöst.',
        href: '/analisis-incidente',
      },
      {
        id: 'cascade',
        time: '12:33:16',
        label: 'IBR-Kaskade',
        color: 'critical',
        desc: '1.655 MW in 3 Sekunden verloren. ANSI 59-Schutz von PV-Wechselrichtern löst in Kaskade durch generalisierte kapazitive Überspannung aus.',
        href: '/analisis-incidente',
      },
      {
        id: 'france',
        time: '12:33:21',
        label: 'Trennung Frankreich',
        color: 'critical',
        desc: 'Netzkuppelleitung nach Frankreich bei 48,46 Hz verloren. Iberisches System vom kontinentalen Synchrongebiet mit 15.000 MW Defizit getrennt.',
        href: '/anexo-interconexiones-flujos',
      },
      {
        id: 'zero',
        time: '12:33:29',
        label: 'Spannungsnull',
        color: 'blackout',
        desc: 'Mehr als 50 Millionen Menschen ohne Versorgung in Spanien und Portugal. Spannung auf der iberischen Halbinsel bei null. Black-Start-Wiederversorgung beginnt.',
        href: '/resumen-de-cifras',
      },
    ],
    linkLabel: 'Kapitel ansehen →',
  },
  'zh-Hans': {
    eyebrow: '停电事故时间轴',
    heading: '不足一分钟',
    sub: '从格拉纳达根源跳闸到伊比利亚半岛电压归零的完整过程',
    phases: [
      {
        id: 'pre',
        time: '12:30 CEST',
        label: '前置运行工况',
        color: 'neutral',
        desc: '82%逆变器电源，仅11台同步机在网运行。等效惯量创2025年历史最低。市场工具未检测到任何异常。',
        href: '/anexo-demanda-generacion-balance',
      },
      {
        id: 'root',
        time: '12:32:57',
        label: '根源跳闸',
        color: 'warning',
        desc: '格拉纳达因有载调压延迟（Tap-Lag）和SCADA不可见的过电压损失355兆瓦。触发电压级联的首次扰动。',
        href: '/analisis-incidente',
      },
      {
        id: 'cascade',
        time: '12:33:16',
        label: 'IBR级联跳闸',
        color: 'critical',
        desc: '3秒内损失1655兆瓦。光伏逆变器ANSI 59保护因全网容性过电压级联动作。',
        href: '/analisis-incidente',
      },
      {
        id: 'france',
        time: '12:33:21',
        label: '与法国解列',
        color: 'critical',
        desc: '法国联络线在48.46赫兹时断开。伊比利亚系统与欧洲大陆同步电网解列，功率缺额15000兆瓦。',
        href: '/anexo-interconexiones-flujos',
      },
      {
        id: 'zero',
        time: '12:33:29',
        label: '电压归零',
        color: 'blackout',
        desc: '西班牙和葡萄牙逾5000万人失去电力供应。伊比利亚半岛电压归零。黑启动恢复进程启动。',
        href: '/resumen-de-cifras',
      },
    ],
    linkLabel: '查看章节 →',
  },
};

export default function HomeIncidentTimeline() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;
  const [activeId, setActiveId] = useState(null);

  const getLocalizedUrl = (url) => {
    const prefix = currentLocale === 'es' ? '' : `/${currentLocale}`;
    const path = `${prefix}${url}`.replace(/\/+/g, '/');
    return useBaseUrl(path);
  };

  const activePhase = t.phases.find((p) => p.id === activeId) || t.phases[0];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Cabecera */}
        <div className={styles.header}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h2 className={styles.heading}>{t.heading}</h2>
          <p className={styles.sub}>{t.sub}</p>
        </div>

        {/* Línea temporal */}
        <div className={styles.timeline} role="list" aria-label={t.eyebrow}>
          {/* Línea de conexión */}
          <div className={styles.track} aria-hidden="true" />

          {t.phases.map((phase, i) => (
            <div
              key={phase.id}
              className={`${styles.phase} ${styles[`phase--${phase.color}`]} ${activeId === phase.id ? styles.isActive : ''}`}
              role="listitem"
              onMouseEnter={() => setActiveId(phase.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(phase.id)}
              onBlur={() => setActiveId(null)}
            >
              {/* Punto en la línea */}
              <div className={styles.dot} aria-hidden="true">
                <span className={styles.dotInner} />
              </div>

              {/* Timestamp */}
              <span className={styles.time}>{phase.time}</span>

              {/* Etiqueta de fase */}
              <a
                href={getLocalizedUrl(phase.href)}
                className={styles.label}
                tabIndex={0}
                aria-label={`${phase.label} — ${phase.time}`}
              >
                {phase.label}
              </a>

              {/* Número de orden */}
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        {/* Panel de detalle — se actualiza con hover/focus */}
        <div className={styles.detail} aria-live="polite" aria-atomic="true">
          <div className={styles.detailInner}>
            <div className={styles.detailHeader}>
              <span className={`${styles.detailDot} ${styles[`detailDot--${activePhase.color}`]}`} aria-hidden="true" />
              <span className={styles.detailTime}>{activePhase.time}</span>
              <span className={styles.detailLabel}>{activePhase.label}</span>
            </div>
            <p className={styles.detailDesc}>{activePhase.desc}</p>
            <a href={getLocalizedUrl(activePhase.href)} className={styles.detailLink}>
              {t.linkLabel}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
