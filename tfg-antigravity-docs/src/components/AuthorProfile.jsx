import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import GlitchTitle from './GlitchTitle';

const STRINGS = {
  es: {
    subtitle: 'Graduando en Ingeniería de la Energía | Especialista en Estabilidad del Sistema Eléctrico e Integración Renovable',
    trayectoria: 'Trayectoria',
    p1: 'A punto de finalizar mis estudios de grado, me preparo para dar el salto al mercado laboral como ingeniero junior. Mi enfoque profesional se centra en los retos técnicos y operativos que plantea la descarbonización masiva de la red.',
    p2: 'A lo largo de mi formación he aplicado conceptos teóricos en entornos reales, desde el cálculo de instalaciones fotovoltaicas hasta el análisis de ubicación de aerogeneradores. Recientemente, una estancia Erasmus de nueve meses en Polonia me ha aportado una alta capacidad de adaptación y una perspectiva pan-europea fundamental para comprender los mercados interconectados.',
    p3: 'Me apasiona la investigación técnica profunda: la evolución estructural del mix energético, la pérdida crítica de inercia síncrona y el estudio exhaustivo de incidencias a gran escala en sistemas de potencia.',
    competencias: 'Competencias Técnicas',
    skills: ['Termodinámica','Estabilidad de Red Ibérica','Generadores de Vapor','Balances Energéticos','React / MDX','Redacción Avanzada LaTeX'],
    enfoque: 'Enfoque del Proyecto',
    quote: 'He dedicado esta investigación al apagón ibérico y al análisis histórico del sistema porque considero vital aprender de nuestras vulnerabilidades. Entender por qué un sistema colapsa es el primer paso indispensable para construir la red del mañana.',
    email: 'Email Profesional',
    cv: 'Descargar CV',
  },
  en: {
    subtitle: 'Energy Engineering Graduate | Specialist in Electrical System Stability and Renewable Integration',
    trayectoria: 'Background',
    p1: 'About to complete my undergraduate degree, I am preparing to enter the job market as a junior engineer. My professional focus centres on the technical and operational challenges posed by the massive decarbonisation of the grid.',
    p2: 'Throughout my studies I have applied theoretical concepts in real environments, from photovoltaic system design to wind turbine siting analysis. A nine-month Erasmus stay in Poland has given me strong adaptability and a pan-European perspective essential for understanding interconnected energy markets.',
    p3: 'I am passionate about deep technical research: the structural evolution of the energy mix, the critical loss of synchronous inertia, and the exhaustive study of large-scale incidents in power systems.',
    competencias: 'Technical Skills',
    skills: ['Thermodynamics','Iberian Grid Stability','Steam Generators','Energy Balances','React / MDX','Advanced LaTeX Writing'],
    enfoque: 'Project Focus',
    quote: 'I dedicated this research to the Iberian blackout and the historical analysis of the system because I believe it is vital to learn from our vulnerabilities. Understanding why a system collapses is the indispensable first step towards building tomorrow\'s grid.',
    email: 'Professional Email',
    cv: 'Download CV',
  },
  de: {
    subtitle: 'Energieingenieur-Absolvent | Spezialist für elektrische Systemstabilität und erneuerbare Integration',
    trayectoria: 'Werdegang',
    p1: 'Kurz vor dem Abschluss meines Bachelorstudiums bereite ich mich darauf vor, als Junioringenieur in den Arbeitsmarkt einzutreten. Mein beruflicher Schwerpunkt liegt auf den technischen und betrieblichen Herausforderungen der massiven Dekarbonisierung des Netzes.',
    p2: 'Im Laufe meines Studiums habe ich theoretische Konzepte in realen Umgebungen angewendet, von der Berechnung von Photovoltaikanlagen bis zur Analyse von Windkraftanlagenstandorten. Ein neunmonatiger Erasmus-Aufenthalt in Polen hat mir eine hohe Anpassungsfähigkeit und eine pan-europäische Perspektive vermittelt, die für das Verständnis vernetzter Energiemärkte unerlässlich ist.',
    p3: 'Ich bin begeistert von tiefgreifender technischer Forschung: die strukturelle Entwicklung des Energiemix, der kritische Verlust synchroner Trägheit und die umfassende Untersuchung von Großstörungen in Energiesystemen.',
    competencias: 'Technische Kompetenzen',
    skills: ['Thermodynamik','Iberische Netzstabilität','Dampferzeuger','Energiebilanzen','React / MDX','Fortgeschrittenes LaTeX'],
    enfoque: 'Projektfokus',
    quote: 'Ich habe diese Forschung dem iberischen Stromausfall und der historischen Analyse des Systems gewidmet, weil ich es für entscheidend halte, aus unseren Schwachstellen zu lernen. Zu verstehen, warum ein System kollabiert, ist der unverzichtbare erste Schritt zum Aufbau des Netzes von morgen.',
    email: 'Professionelle E-Mail',
    cv: 'Lebenslauf herunterladen',
  },
  'zh-Hans': {
    subtitle: '能源工程本科毕业生 | 电力系统稳定性与可再生能源整合专家',
    trayectoria: '学术与职业背景',
    p1: '即将完成本科学业，我正准备以初级工程师身份进入职场。我的职业重点在于大规模电网脱碳所带来的技术与运营挑战。',
    p2: '在学习过程中，我将理论知识应用于实际环境，从光伏系统设计到风机选址分析。在波兰进行的九个月伊拉斯谟交流项目使我具备了较强的适应能力，以及理解互联能源市场所必需的泛欧洲视角。',
    p3: '我对深度技术研究充满热情：能源结构的演变、同步惯量的关键损失，以及对电力系统大规模事故的详尽研究。',
    competencias: '技术能力',
    skills: ['热力学','伊比利亚电网稳定性','蒸汽发生器','能量平衡','React / MDX','高级LaTeX写作'],
    enfoque: '项目重点',
    quote: '我将这项研究献给伊比利亚停电事件和系统的历史分析，因为我认为从我们的脆弱性中学习至关重要。理解系统为何崩溃是构建未来电网不可或缺的第一步。',
    email: '专业邮件',
    cv: '下载简历',
  },
};

export default function AuthorProfile() {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  const s = STRINGS[currentLocale] || STRINGS.es;

  return (
    <>
      <style>
        {`
          /* Permitir scroll si el contenido es mayor que el alto de pantalla, centrando verticalmente si hay espacio */
          .theme-doc-markdown {
            min-height: calc(100vh - 140px);
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .theme-doc-breadcrumbs, .theme-doc-footer {
            display: none !important;
          }
          
          .author-container {
            font-family: 'Inter', sans-serif;
            color: var(--ifm-font-color-base);
            max-width: 1050px;
            margin: 0 auto;
            width: 100%;
            animation: fadeIn 0.8s ease-out forwards;
            padding: 1.5rem 0;
          }

          .author-header {
            text-align: left;
            margin-bottom: 2.5rem;
            border-bottom: 1px solid rgba(65, 66, 74, 0.3);
            padding-bottom: 1.5rem;
          }

          .author-subtitle {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9rem;
            color: #41424a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 0.75rem;
          }

          .author-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;
          }

          .author-text p {
            font-size: 0.95rem;
            line-height: 1.65;
            color: #636E4F;
            margin-bottom: 1.2rem;
            text-align: justify;
          }

          .author-section-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            color: #41424a;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 1.2rem;
            border-left: 2px solid #41424a;
            padding-left: 0.75rem;
          }

          .author-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.6rem;
            margin-bottom: 2.5rem;
          }

          .author-skill-tag {
            background: rgba(65, 66, 74, 0.1);
            border: 1px solid #41424a;
            color: #41424a;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-family: 'JetBrains Mono', monospace;
          }

          .author-blockquote {
            background: rgba(65, 66, 74, 0.05);
            border-left: 3px solid #41424a;
            padding: 1.2rem 1.5rem;
            font-style: italic;
            font-size: 0.95rem;
            line-height: 1.6;
            color: #41424a;
          }

          .author-cta {
            display: flex;
            gap: 1rem;
            margin-top: 2.5rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.05);
          }

          .btn-primary {
            background: #41424a;
            border: 1px solid #41424a;
            color: #ffffff;
            padding: 0.7rem 1.4rem;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.2s;
          }
          .btn-primary:hover {
            background: #2a2b30;
            text-decoration: none;
            color: #ffffff;
          }

          .btn-secondary {
            background: transparent;
            border: 1px solid #41424a;
            color: #41424a;
            padding: 0.7rem 1.4rem;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.85rem;
            transition: all 0.2s;
          }
          .btn-secondary:hover {
            background: rgba(65, 66, 74, 0.1);
            border-color: #41424a;
            color: #41424a;
            text-decoration: none;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Consultas de medios para responsive */
          @media (max-width: 960px) {
            .theme-doc-markdown {
              min-height: auto;
              display: block;
              padding: 1rem 0;
            }
            .author-grid {
              grid-template-columns: 1fr;
              gap: 2.5rem;
            }
            .author-container {
              padding: 0 1rem;
            }
            .author-header {
              margin-bottom: 1.5rem;
              padding-bottom: 1rem;
            }
            .author-cta {
              flex-wrap: wrap;
              gap: 0.75rem;
              margin-top: 1.5rem;
              padding-top: 1.5rem;
            }
            .btn-primary, .btn-secondary {
              flex-grow: 1;
              text-align: center;
              font-size: 0.8rem;
              padding: 0.6rem 1rem;
            }
          }
        `}
      </style>

      <div className="author-container">
        <div className="author-header">
          <GlitchTitle as="h1" className="glitch-page-title" style={{ fontSize: '2.8rem', marginBottom: '0' }}>Alfonso Monge Díaz-Ángel</GlitchTitle>
          <div className="author-subtitle">{s.subtitle}</div>
        </div>

        <div className="author-grid">
          <div className="author-text">
            <div className="author-section-title">{s.trayectoria}</div>
            <p>{s.p1}</p>
            <p>{s.p2}</p>
            <p>{s.p3}</p>
          </div>

          <div>
            <div className="author-section-title">{s.competencias}</div>
            <div className="author-skills">
              {s.skills.map((skill, i) => (
                <span key={i} className="author-skill-tag">{skill}</span>
              ))}
            </div>

            <div className="author-section-title">{s.enfoque}</div>
            <div className="author-blockquote">
              {s.quote}
            </div>

            <div className="author-cta">
              <a href="mailto:alfonsomongediazangel@gmail.com" className="btn-primary">{s.email}</a>
              <a href="https://www.linkedin.com/in/alfonso-monge-diaz-angel-971941277/" target="_blank" rel="noreferrer" className="btn-secondary">LinkedIn</a>
              <a href="https://github.com/alfonsomongee" target="_blank" rel="noreferrer" className="btn-secondary">GitHub</a>
              <a href="/cv.pdf" target="_blank" rel="noreferrer" className="btn-secondary">{s.cv}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
