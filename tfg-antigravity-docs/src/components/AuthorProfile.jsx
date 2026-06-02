import React from 'react';
import GlitchTitle from './GlitchTitle';

export default function AuthorProfile() {
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
          <div className="author-subtitle">Graduando en Ingeniería de la Energía | Especialista en Estabilidad del Sistema Eléctrico e Integración Renovable</div>
        </div>

        <div className="author-grid">
          <div className="author-text">
            <div className="author-section-title">Trayectoria</div>
            <p>
              A punto de finalizar mis estudios de grado, me preparo para dar el salto al mercado laboral como ingeniero junior. Mi enfoque profesional se centra en los retos técnicos y operativos que plantea la descarbonización masiva de la red.
            </p>
            <p>
              A lo largo de mi formación he aplicado conceptos teóricos en entornos reales, desde el cálculo de instalaciones fotovoltaicas hasta el análisis de ubicación de aerogeneradores. Recientemente, una estancia Erasmus de nueve meses en Polonia me ha aportado una alta capacidad de adaptación y una perspectiva pan-europea fundamental para comprender los mercados interconectados.
            </p>
            <p>
              Me apasiona la investigación técnica profunda: la evolución estructural del mix energético, la pérdida crítica de inercia síncrona y el estudio exhaustivo de incidencias a gran escala en sistemas de potencia.
            </p>
          </div>

          <div>
            <div className="author-section-title">Competencias Técnicas</div>
            <div className="author-skills">
              <span className="author-skill-tag">Termodinámica</span>
              <span className="author-skill-tag">Estabilidad de Red Ibérica</span>
              <span className="author-skill-tag">Generadores de Vapor</span>
              <span className="author-skill-tag">Balances Energéticos</span>
              <span className="author-skill-tag">React / MDX</span>
              <span className="author-skill-tag">Redacción Avanzada LaTeX</span>
            </div>

            <div className="author-section-title">Enfoque del Proyecto</div>
            <div className="author-blockquote">
              He dedicado esta investigación al apagón ibérico y al análisis histórico del sistema porque considero vital aprender de nuestras vulnerabilidades. Entender por qué un sistema colapsa es el primer paso indispensable para construir la red del mañana.
            </div>

            <div className="author-cta">
              <a href="mailto:alfonsomongediazangel@gmail.com" className="btn-primary">Email Profesional</a>
              <a href="https://www.linkedin.com/in/alfonso-monge-diaz-angel-971941277/" target="_blank" rel="noreferrer" className="btn-secondary">LinkedIn</a>
              <a href="https://github.com/alfonsomongee" target="_blank" rel="noreferrer" className="btn-secondary">GitHub</a>
              <a href="/cv.pdf" target="_blank" rel="noreferrer" className="btn-secondary">Descargar CV</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
