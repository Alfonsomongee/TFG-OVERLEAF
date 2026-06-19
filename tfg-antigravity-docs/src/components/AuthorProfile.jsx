import React from 'react';
import { motion } from 'framer-motion';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import GlitchTitle from './GlitchTitle';
import styles from './AuthorProfile.module.css';

const STRINGS = {
  es: {
    subtitle: 'Graduando en Ingeniería de la Energía | Especialista en Estabilidad del Sistema Eléctrico e Integración Renovable',
    status: 'Disponible para oportunidades',
    trayectoria: 'Trayectoria',
    p1: 'A punto de finalizar mis estudios de grado, me preparo para dar el salto al mercado laboral como ingeniero junior. Mi enfoque profesional se centra en los retos técnicos y operativos que plantea la descarbonización masiva de la red.',
    p2: 'A lo largo de mi formación he aplicado conceptos teóricos en entornos reales, desde el cálculo de instalaciones fotovoltaicas hasta el análisis de ubicación de aerogeneradores. Recientemente, una estancia Erasmus de nueve meses en Polonia me ha aportado una alta capacidad de adaptación y una perspectiva pan-europea fundamental para comprender los mercados interconectados.',
    p3: 'Me apasiona la investigación técnica profunda: la evolución estructural del mix energético, la pérdida crítica de inercia síncrona y el estudio exhaustivo de incidencias a gran escala en sistemas de potencia.',
    competencias: 'Competencias Técnicas',
    skills: [
      { icon: '🔥', label: 'Termodinámica' },
      { icon: '⚡', label: 'Estabilidad de Red Ibérica' },
      { icon: '♨️', label: 'Generadores de Vapor' },
      { icon: '⚖️', label: 'Balances Energéticos' },
      { icon: '⚛️', label: 'React / MDX' },
      { icon: '📄', label: 'Redacción Avanzada LaTeX' },
    ],
    enfoque: 'Enfoque del Proyecto',
    quote: 'He dedicado esta investigación al apagón ibérico y al análisis histórico del sistema porque considero vital aprender de nuestras vulnerabilidades. Entender por qué un sistema colapsa es el primer paso indispensable para construir la red del mañana.',
    email: 'Email Profesional',
    cv: 'Descargar CV',
  },
  en: {
    subtitle: 'Energy Engineering Graduate | Specialist in Electrical System Stability and Renewable Integration',
    status: 'Open to opportunities',
    trayectoria: 'Background',
    p1: 'About to complete my undergraduate degree, I am preparing to enter the job market as a junior engineer. My professional focus centres on the technical and operational challenges posed by the massive decarbonisation of the grid.',
    p2: 'Throughout my studies I have applied theoretical concepts in real environments, from photovoltaic system design to wind turbine siting analysis. A nine-month Erasmus stay in Poland has given me strong adaptability and a pan-European perspective essential for understanding interconnected energy markets.',
    p3: 'I am passionate about deep technical research: the structural evolution of the energy mix, the critical loss of synchronous inertia, and the exhaustive study of large-scale incidents in power systems.',
    competencias: 'Technical Skills',
    skills: [
      { icon: '🔥', label: 'Thermodynamics' },
      { icon: '⚡', label: 'Iberian Grid Stability' },
      { icon: '♨️', label: 'Steam Generators' },
      { icon: '⚖️', label: 'Energy Balances' },
      { icon: '⚛️', label: 'React / MDX' },
      { icon: '📄', label: 'Advanced LaTeX Writing' },
    ],
    enfoque: 'Project Focus',
    quote: "I dedicated this research to the Iberian blackout and the historical analysis of the system because I believe it is vital to learn from our vulnerabilities. Understanding why a system collapses is the indispensable first step towards building tomorrow's grid.",
    email: 'Professional Email',
    cv: 'Download CV',
  },
  de: {
    subtitle: 'Energieingenieur-Absolvent | Spezialist für elektrische Systemstabilität und erneuerbare Integration',
    status: 'Offen für Möglichkeiten',
    trayectoria: 'Werdegang',
    p1: 'Kurz vor dem Abschluss meines Bachelorstudiums bereite ich mich darauf vor, als Junioringenieur in den Arbeitsmarkt einzutreten. Mein beruflicher Schwerpunkt liegt auf den technischen und betrieblichen Herausforderungen der massiven Dekarbonisierung des Netzes.',
    p2: 'Im Laufe meines Studiums habe ich theoretische Konzepte in realen Umgebungen angewendet, von der Berechnung von Photovoltaikanlagen bis zur Analyse von Windkraftanlagenstandorten. Ein neunmonatiger Erasmus-Aufenthalt in Polen hat mir eine hohe Anpassungsfähigkeit und eine pan-europäische Perspektive vermittelt.',
    p3: 'Ich bin begeistert von tiefgreifender technischer Forschung: die strukturelle Entwicklung des Energiemix, der kritische Verlust synchroner Trägheit und die umfassende Untersuchung von Großstörungen in Energiesystemen.',
    competencias: 'Technische Kompetenzen',
    skills: [
      { icon: '🔥', label: 'Thermodynamik' },
      { icon: '⚡', label: 'Iberische Netzstabilität' },
      { icon: '♨️', label: 'Dampferzeuger' },
      { icon: '⚖️', label: 'Energiebilanzen' },
      { icon: '⚛️', label: 'React / MDX' },
      { icon: '📄', label: 'Fortgeschrittenes LaTeX' },
    ],
    enfoque: 'Projektfokus',
    quote: 'Ich habe diese Forschung dem iberischen Stromausfall gewidmet, weil ich es für entscheidend halte, aus unseren Schwachstellen zu lernen. Zu verstehen, warum ein System kollabiert, ist der unverzichtbare erste Schritt zum Aufbau des Netzes von morgen.',
    email: 'Professionelle E-Mail',
    cv: 'Lebenslauf herunterladen',
  },
  'zh-Hans': {
    subtitle: '能源工程本科毕业生 | 电力系统稳定性与可再生能源整合专家',
    status: '开放机会',
    trayectoria: '学术与职业背景',
    p1: '即将完成本科学业，我正准备以初级工程师身份进入职场。我的职业重点在于大规模电网脱碳所带来的技术与运营挑战。',
    p2: '在学习过程中，我将理论知识应用于实际环境，从光伏系统设计到风机选址分析。在波兰进行的九个月伊拉斯谟交流项目使我具备了较强的适应能力，以及理解互联能源市场所必需的泛欧洲视角。',
    p3: '我对深度技术研究充满热情：能源结构的演变、同步惯量的关键损失，以及对电力系统大规模事故的详尽研究。',
    competencias: '技术能力',
    skills: [
      { icon: '🔥', label: '热力学' },
      { icon: '⚡', label: '伊比利亚电网稳定性' },
      { icon: '♨️', label: '蒸汽发生器' },
      { icon: '⚖️', label: '能量平衡' },
      { icon: '⚛️', label: 'React / MDX' },
      { icon: '📄', label: '高级LaTeX写作' },
    ],
    enfoque: '项目重点',
    quote: '我将这项研究献给伊比利亚停电事件，因为我认为从我们的脆弱性中学习至关重要。理解系统为何崩溃是构建未来电网不可或缺的第一步。',
    email: '专业邮件',
    cv: '下载简历',
  },
};

const skillVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const skillItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
};

const bentoVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const bentoItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function AuthorProfile() {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const s = STRINGS[currentLocale] || STRINGS.es;

  return (
    <div className={styles.container}>

      {/* ── Header ── */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Animated avatar ring */}
        <div className={styles.avatarRing}>
          <div className={styles.avatarInner}>AM</div>
        </div>

        <div className={styles.headerText}>
          <GlitchTitle as="h1" style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>
            Alfonso Monge Díaz-Ángel
          </GlitchTitle>
          <div className={styles.subtitle}>{s.subtitle}</div>
          <span className={styles.statusBadge}>
            <span className={styles.statusDot} />
            {s.status}
          </span>
        </div>
      </motion.div>

      {/* ── Bento grid ── */}
      <motion.div
        className={styles.bento}
        variants={bentoVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Bio — full width */}
        <motion.div
          variants={bentoItem}
          className={`${styles.bentoCell} ${styles.bentoBio}`}
        >
          <span className={styles.sectionTitle}>{s.trayectoria}</span>
          <div className={styles.bioText}>
            <p>{s.p1}</p>
            <p>{s.p2}</p>
            <p>{s.p3}</p>
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          variants={bentoItem}
          className={`${styles.bentoCell} ${styles.bentoSkills}`}
        >
          <span className={styles.sectionTitle}>{s.competencias}</span>
          <motion.div
            className={styles.skillsGrid}
            variants={skillVariants}
            initial="hidden"
            animate="visible"
          >
            {s.skills.map((skill) => (
              <motion.span key={skill.label} variants={skillItem} className={styles.skillTag}>
                {skill.icon} {skill.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Quote */}
        <motion.div
          variants={bentoItem}
          className={`${styles.bentoCell} ${styles.bentoQuote}`}
        >
          <span className={styles.sectionTitle}>{s.enfoque}</span>
          <blockquote className={styles.quoteBlock}>
            {s.quote}
          </blockquote>
        </motion.div>
      </motion.div>

      {/* ── CTA buttons ── */}
      <motion.div
        className={styles.cta}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <a
          href="mailto:alfonsomongediazangel@gmail.com"
          className={styles.btnPrimary}
        >
          {s.email}
        </a>
        <a
          href="https://www.linkedin.com/in/alfonso-monge-diaz-angel-971941277/"
          target="_blank"
          rel="noreferrer"
          className={`${styles.btnSecondary} ${styles.btnLinkedin}`}
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/alfonsomongee"
          target="_blank"
          rel="noreferrer"
          className={`${styles.btnSecondary} ${styles.btnGithub}`}
        >
          GitHub
        </a>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noreferrer"
          className={`${styles.btnSecondary} ${styles.btnCv}`}
        >
          {s.cv}
        </a>
      </motion.div>
    </div>
  );
}
