import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './AuthorProfile.module.css';

const CONTENT = {
  es: {
    name: 'Alfonso Monge Díaz-Ángel',
    role: 'Graduando en Ingeniería de la Energía',
    line: 'Análisis de sistemas eléctricos, integración renovable y estabilidad de red.',
    meta: ['Universidad de Sevilla', 'Ingeniería de la Energía', 'TFG 28-A'],
    profileTitle: 'Perfil breve',
    profile: [
      'Alfonso Monge Díaz-Ángel es graduando en Ingeniería de la Energía, con interés en la estabilidad de sistemas eléctricos, la integración masiva de renovables y el análisis técnico de redes dominadas por electrónica de potencia.',
      'Este Trabajo de Fin de Grado nace de una preocupación central: cómo mantener la seguridad operativa del sistema eléctrico en una transición energética acelerada, donde la sustitución de generación síncrona por recursos basados en inversores modifica las reglas físicas de estabilidad, control de tensión e inercia.',
      'El enfoque del proyecto combina revisión documental, contraste de informes técnicos, modelado conceptual y comunicación visual. El objetivo no es reducir el apagón del 28-A a una causa simple, sino reconstruir sus mecanismos físicos, regulatorios y operativos con una lectura crítica y trazable.',
    ],
    whyTitle: 'Por qué este TFG',
    why: 'El apagón ibérico del 28-A concentra varios retos centrales de la transición energética: estabilidad de tensión, potencia reactiva, integración renovable, electrónica de potencia, coordinación de protecciones y resiliencia operativa. Por eso funciona como caso de estudio para observar cómo un sistema eléctrico moderno puede perder margen físico, regulatorio y operativo de forma simultánea.',
    methodTitle: 'Método de trabajo',
    method: 'La investigación se apoya en revisión documental, contraste de informes, análisis técnico de mecanismos eléctricos, anexos conceptuales, figuras explicativas y validación física de las hipótesis. La prioridad ha sido mantener una cadena de razonamiento trazable entre datos, modelos, límites de interpretación y conclusiones.',
    interestsTitle: 'Líneas de interés técnico',
    interests: [
      'Estabilidad de sistemas eléctricos',
      'Control de tensión y potencia reactiva',
      'Integración fotovoltaica y eólica',
      'Recursos basados en inversores',
      'Análisis documental técnico',
      'Visualización de datos y MDX',
      'Modelado energético',
      'Comunicación técnica',
    ],
    pathTitle: 'Trayectoria compacta',
    path: [
      ['Universidad de Sevilla', 'Formación de grado en Ingeniería de la Energía.'],
      ['AGH University of Krakow', 'Estancia Erasmus y perspectiva europea sobre sistemas energéticos.'],
      ['Proyectos técnicos de energía', 'Aplicación de criterios de cálculo, modelado y análisis energético.'],
      ['TFG sobre el apagón ibérico 28-A', 'Reconstrucción técnica, documental y visual de un incidente sistémico.'],
    ],
    kickerLabel: 'Sobre el autor',
    areaLabel: 'Área',
    contactAriaLabel: 'Contacto profesional',
    contactTitle: 'Cierre profesional',
    contactText: 'Contacto académico y profesional para conversación técnica, continuidad investigadora o revisión del proyecto.',
    links: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
  },
  en: {
    name: 'Alfonso Monge Díaz-Ángel',
    role: 'Energy Engineering undergraduate',
    line: 'Power-system analysis, renewable integration, and grid stability.',
    meta: ['University of Seville', 'Energy Engineering', '28-A thesis'],
    profileTitle: 'Brief Profile',
    profile: [
      'Alfonso Monge Díaz-Ángel is an Energy Engineering undergraduate interested in power-system stability, large-scale renewable integration, and the technical analysis of grids increasingly shaped by power electronics.',
      'This thesis starts from a central concern: how to preserve operational security during an accelerated energy transition, where inverter-based resources replace synchronous generation and alter the physical rules of stability, voltage control, and inertia.',
      'The project combines documentary review, comparison of technical reports, conceptual modelling, and visual communication. Its aim is not to reduce the 28-A blackout to a single cause, but to reconstruct its physical, regulatory, and operational mechanisms through a critical and traceable reading.',
    ],
    whyTitle: 'Why This Thesis',
    why: 'The 28-A Iberian blackout brings together core challenges of the energy transition: voltage stability, reactive power, renewable integration, power electronics, protection coordination, and operational resilience. It therefore acts as a case study for observing how a modern power system can lose physical, regulatory, and operational margins at the same time.',
    methodTitle: 'Working Method',
    method: 'The research is based on documentary review, comparison of reports, technical analysis of electrical mechanisms, conceptual annexes, explanatory figures, and physical validation of hypotheses. The priority has been to preserve a traceable reasoning chain between data, models, interpretation limits, and conclusions.',
    interestsTitle: 'Technical Interests',
    interests: [
      'Power-system stability',
      'Voltage control and reactive power',
      'Photovoltaic and wind integration',
      'Inverter-based resources',
      'Technical document analysis',
      'Data visualization and MDX',
      'Energy modelling',
      'Technical communication',
    ],
    pathTitle: 'Compact Path',
    path: [
      ['University of Seville', 'Undergraduate training in Energy Engineering.'],
      ['AGH University of Krakow', 'Erasmus stay and European perspective on energy systems.'],
      ['Technical energy projects', 'Application of calculation, modelling, and energy-analysis criteria.'],
      ['Thesis on the 28-A Iberian blackout', 'Technical, documentary, and visual reconstruction of a systemic incident.'],
    ],
    kickerLabel: 'About the author',
    areaLabel: 'Area',
    contactAriaLabel: 'Professional contact',
    contactTitle: 'Professional Closing',
    contactText: 'Academic and professional contact for technical conversation, research continuity, or project review.',
    links: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
  },
  de: {
    name: 'Alfonso Monge Díaz-Ángel',
    role: 'Student der Energietechnik',
    line: 'Analyse elektrischer Systeme, Integration erneuerbarer Energien und Netzstabilität.',
    meta: ['Universität Sevilla', 'Energietechnik', '28-A Abschlussarbeit'],
    profileTitle: 'Kurzprofil',
    profile: [
      'Alfonso Monge Díaz-Ángel ist Student der Energietechnik mit Interesse an der Stabilität elektrischer Systeme, der Integration großer Mengen erneuerbarer Energien und der technischen Analyse von Netzen mit wachsendem Anteil leistungselektronischer Ressourcen.',
      'Diese Abschlussarbeit geht von einer zentralen Frage aus: Wie lässt sich die Betriebssicherheit des Stromsystems in einer beschleunigten Energiewende erhalten, wenn inverterbasierte Ressourcen synchrone Erzeugung ersetzen und die physikalischen Regeln von Stabilität, Spannungsregelung und Trägheit verändern?',
      'Der Ansatz verbindet Dokumentenrecherche, Vergleich technischer Berichte, konzeptionelle Modellierung und visuelle Kommunikation. Ziel ist nicht, den Blackout vom 28-A auf eine einzelne Ursache zu reduzieren, sondern seine physikalischen, regulatorischen und betrieblichen Mechanismen kritisch und nachvollziehbar zu rekonstruieren.',
    ],
    whyTitle: 'Warum diese Arbeit',
    why: 'Der iberische Blackout vom 28-A bündelt zentrale Herausforderungen der Energiewende: Spannungsstabilität, Blindleistung, Integration erneuerbarer Energien, Leistungselektronik, Schutzkoordination und operative Resilienz. Er eignet sich deshalb als Fallstudie dafür, wie ein modernes Stromsystem gleichzeitig physikalische, regulatorische und betriebliche Reserven verlieren kann.',
    methodTitle: 'Arbeitsmethode',
    method: 'Die Untersuchung stützt sich auf Dokumentenrecherche, Berichtvergleich, technische Analyse elektrischer Mechanismen, konzeptionelle Anhänge, erklärende Abbildungen und physikalische Plausibilisierung der Hypothesen. Im Vordergrund steht eine nachvollziehbare Argumentationskette zwischen Daten, Modellen, Interpretationsgrenzen und Schlussfolgerungen.',
    interestsTitle: 'Technische Interessen',
    interests: [
      'Stabilität elektrischer Systeme',
      'Spannungsregelung und Blindleistung',
      'Integration von Photovoltaik und Windenergie',
      'Inverterbasierte Ressourcen',
      'Technische Dokumentenanalyse',
      'Datenvisualisierung und MDX',
      'Energiemodellierung',
      'Technische Kommunikation',
    ],
    pathTitle: 'Kompakter Werdegang',
    path: [
      ['Universität Sevilla', 'Bachelorstudium der Energietechnik.'],
      ['AGH University of Krakow', 'Erasmus-Aufenthalt und europäische Perspektive auf Energiesysteme.'],
      ['Technische Energieprojekte', 'Anwendung von Berechnung, Modellierung und Energieanalyse.'],
      ['Abschlussarbeit zum iberischen Blackout 28-A', 'Technische, dokumentarische und visuelle Rekonstruktion eines systemischen Ereignisses.'],
    ],
    kickerLabel: 'Über den Autor',
    areaLabel: 'Bereich',
    contactAriaLabel: 'Professioneller Kontakt',
    contactTitle: 'Professioneller Abschluss',
    contactText: 'Akademischer und beruflicher Kontakt für technische Gespräche, Forschungskontinuität oder Projektprüfung.',
    links: {
      email: 'E-Mail',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
  },
  'zh-Hans': {
    name: 'Alfonso Monge Díaz-Ángel',
    role: '能源工程本科毕业生',
    line: '电力系统分析、可再生能源并网与电网稳定性。',
    meta: ['塞维利亚大学', '能源工程', '28-A 毕业论文'],
    profileTitle: '简要介绍',
    profile: [
      'Alfonso Monge Díaz-Ángel 是能源工程本科毕业生，关注电力系统稳定性、大规模可再生能源并网，以及由电力电子设备主导的电网技术分析。',
      '本毕业论文源于一个核心问题：在快速能源转型中，如何维持电力系统的运行安全。随着基于逆变器的资源替代同步发电，稳定性、电压控制和惯量的物理规则也随之改变。',
      '项目结合文献审查、技术报告对比、概念建模和可视化表达。目标不是把 28-A 停电简化为单一原因，而是以可追溯的方式重建其物理、监管和运行机制。',
    ],
    whyTitle: '为什么研究这个题目',
    why: '28-A 伊比利亚停电集中体现了能源转型中的若干关键挑战：电压稳定性、无功功率、可再生能源并网、电力电子、保护协调和运行韧性。因此，它可以作为观察现代电力系统如何同时失去物理、监管和运行裕度的案例。',
    methodTitle: '工作方法',
    method: '研究基于文献审查、报告对比、电气机制技术分析、概念附录、解释性图示以及对假设的物理验证。重点是在数据、模型、解释边界和结论之间保持可追溯的推理链。',
    interestsTitle: '技术兴趣方向',
    interests: [
      '电力系统稳定性',
      '电压控制与无功功率',
      '光伏与风电并网',
      '基于逆变器的资源',
      '技术文献分析',
      '数据可视化与 MDX',
      '能源建模',
      '技术传播',
    ],
    pathTitle: '简要经历',
    path: [
      ['塞维利亚大学', '能源工程本科学习。'],
      ['AGH University of Krakow', 'Erasmus 交流经历与欧洲能源系统视角。'],
      ['能源技术项目', '应用计算、建模和能源分析方法。'],
      ['28-A 伊比利亚停电毕业论文', '对系统性事件进行技术、文献和视觉重建。'],
    ],
    kickerLabel: '关于作者',
    areaLabel: '领域',
    contactAriaLabel: '职业联系方式',
    contactTitle: '职业联系',
    contactText: '用于技术交流、研究延续或项目审阅的学术与职业联系方式。',
    links: {
      email: 'Email',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      cv: 'CV',
    },
  },
};

export default function AuthorProfile({ lang }) {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const locale = lang || currentLocale || 'es';
  const s = CONTENT[locale] || CONTENT.es;

  return (
    <article className={styles.profile} aria-labelledby="author-profile-title">
      <header className={styles.hero}>
        <div className={styles.monogram} aria-hidden="true">AM</div>
        <div className={styles.heroText}>
          <p className={styles.kicker}>{s.kickerLabel}</p>
          <h1 id="author-profile-title" className={styles.name}>{s.name}</h1>
          <p className={styles.role}>{s.role}</p>
          <p className={styles.line}>{s.line}</p>
          <dl className={styles.meta}>
            {s.meta.map((item) => (
              <div key={item} className={styles.metaItem}>
                <dt className={styles.metaLabel}>{s.areaLabel}</dt>
                <dd>{item}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section className={styles.section} aria-labelledby="profile-brief-title">
        <h2 id="profile-brief-title" className={styles.sectionTitle}>{s.profileTitle}</h2>
        <div className={styles.prose}>
          {s.profile.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className={styles.twoColumn}>
        <section className={styles.panel} aria-labelledby="why-thesis-title">
          <h2 id="why-thesis-title" className={styles.sectionTitle}>{s.whyTitle}</h2>
          <p>{s.why}</p>
        </section>

        <section className={styles.panel} aria-labelledby="method-title">
          <h2 id="method-title" className={styles.sectionTitle}>{s.methodTitle}</h2>
          <p>{s.method}</p>
        </section>
      </div>

      <section className={styles.section} aria-labelledby="interests-title">
        <h2 id="interests-title" className={styles.sectionTitle}>{s.interestsTitle}</h2>
        <ul className={styles.interestPills}>
          {s.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="path-title">
        <h2 id="path-title" className={styles.sectionTitle}>{s.pathTitle}</h2>
        <ol className={styles.timeline}>
          {s.path.map(([title, text], idx) => (
            <li key={title}>
              <span className={styles.timelineIndex} aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className={styles.timelineTitle}>{title}</span>
              <span className={styles.timelineText}>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className={styles.contact} aria-labelledby="contact-title">
        <div>
          <h2 id="contact-title" className={styles.sectionTitle}>{s.contactTitle}</h2>
          <p>{s.contactText}</p>
        </div>
        <nav className={styles.actions} aria-label={s.contactAriaLabel}>
          <a href="mailto:alfonsomongediazangel@gmail.com">{s.links.email}</a>
          <a href="https://www.linkedin.com/in/alfonso-monge-diaz-angel-971941277/" target="_blank" rel="noreferrer">{s.links.linkedin}</a>
          <a href="https://github.com/alfonsomongee" target="_blank" rel="noreferrer">{s.links.github}</a>
          <a href="/cv.pdf" target="_blank" rel="noreferrer">{s.links.cv}</a>
        </nav>
      </footer>
    </article>
  );
}
