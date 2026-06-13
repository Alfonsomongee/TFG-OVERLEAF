import React, { useState, useEffect, useRef } from 'react';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './ForensicArbitrator.module.css';

// Esquema de datos de los hitos periciales discrepantes del 28-A
const MILESTONES_DATA = [
  {
    id: 'hito-1',
    time: '12:03:00',
    title: 'Origen de las Oscilaciones a 0.63 Hz',
    divergence_level: 'Moderada',
    versions: {
      REE_RTE: 'Atribuyen las oscilaciones iniciales a una resonancia local anómala provocada por la falta de amortiguamiento dinámico en las plantas fotovoltaicas del eje de Granada y Sevilla, exacerbada por la exportación máxima hacia Marruecos y Portugal en ese instante.',
      REN: 'Adopta una postura estrictamente observacional, registrando las anomalías como oscilaciones bidireccionales con desfase temporal entre la red española y la portuguesa, y notificando la existencia de graves flujos de potencia activa oscilantes que amenazaban la integridad de la interconexión.',
      IIT_INESC: 'Cuestiona severamente la premisa de la identificación del punto de origen. El análisis académico argumenta que la oscilación subyacente se vio profundamente exacerbada por la extrema escasez de recursos dinámicos de control de tensión operando en la región sur (ciclos combinados desacoplados por razones de mercado), sumado a previas fluctuaciones severas en la red de transporte que no fueron atajadas operativamente en las horas previas.'
    },
    physics_behind: {
      equations: [
        { formula: 'f_{osc} = 0.63\\text{ Hz}', label: 'Frecuencia del modo oscilatorio local' },
        { formula: 'Z_{eq} = R_{eq} + jX_{eq}', label: 'Impedancia equivalente de red en el eje sur' }
      ],
      explanation: 'La presencia de un modo de oscilación dominante en 0.63 Hz apunta ineludiblemente a una inestabilidad intraárea (local) en lugar de un modo interárea puramente continental. La fisura argumental técnica reside en la causalidad directa: el operador del sistema argumenta fallos específicos en el código de red de inversores fotovoltaicos (la sintonización de sus Phase-Locked Loops o PLL). En contraste, los modelos matemáticos de la academia demuestran que cualquier inversor solar moderno, independientemente de su fabricante, comenzará a oscilar y a exhibir un comportamiento caótico si se conecta a un nudo eléctrico cuya potencia de cortocircuito haya caído críticamente. La debilidad sistémica hace que la tensión de referencia que guía al PLL fluctúe incontrolablemente.'
    }
  },
  {
    id: 'hito-2',
    time: '12:32:57',
    title: 'Disparo en Cascada del Transformador de Granada',
    divergence_level: 'Alta',
    versions: {
      REE_RTE: 'Este instante de contingencia N-1 precipita el desastre inminente. El informe de REE califica de "inapropiado" el disparo del relé de protección contra sobretensiones (ANSI 59) del transformador de generación en Granada (Caparacena), lo que sustrajo 355 MW de la ecuación y generó el efecto dominó.',
      REN: 'La perspectiva portuguesa documenta cómo este evento marcó el punto de no retorno hacia la pérdida del sincronismo. Subrayan enfáticamente que las protecciones portuguesas operaron de manera impecable y de acuerdo con los protocolos continentales frente a las brutales perturbaciones de tensión importadas a través de la frontera.',
      IIT_INESC: 'Denuncia una falacia narrativa al catalogar el disparo como "inapropiado". Los peritos del IIT argumentan que, analizando la telemetría, la red de 400 kV en la zona sur llevaba minutos oscilando peligrosamente entre 420 kV y 434 kV. Por ende, las protecciones OVP actuaron tal y como el código de red exige para evitar daños destructivos a las instalaciones físicas. El verdadero fallo consistió en gestionar un sistema fuera de los márgenes estables de tensión durante un período prolongado.'
    },
    physics_behind: {
      equations: [
        { formula: 'V_{OVP} \\ge 434\\text{ kV } (1.085\\text{ p.u.})', label: 'Umbral de disparo de la protección ANSI 59' },
        { formula: '\\Delta Q = V \\cdot \\Delta I_c = \\omega C V^2', label: 'Inyección capacitiva neta (Efecto Ferranti)' }
      ],
      explanation: 'El marco temporal entre las 12:32:57 y las 12:33:16 define el colapso absoluto. Al desaparecer los primeros 355 MW en Granada, se sustrae una planta que estaba absorbiendo potencia reactiva de la red para intentar mitigar la elevación de voltaje circundante. La red, liberada de este ancla inductiva, sufre un escalón de sobretensión en cadena. Esto fuerza físicamente a la subestación de Badajoz a rebasar sus límites dieléctricos nominales, provocando la desconexión simultánea de más de 800 MW adicionales. El colosal desequilibrio de potencia activa remanente sella el destino del suministro.'
    }
  },
  {
    id: 'hito-3',
    time: '12:08:00',
    title: 'Bloqueo Dinámico: El modo PMODE1 del enlace INELFE-1',
    divergence_level: 'Alta',
    versions: {
      REE_RTE: 'Bajo la interpretación de los operadores, la activación del protocolo conjunto franco-español exige modificar imperativamente el flujo del cable submarino HVDC, forzando su operación al modo PMODE1 (potencia activa constante). La racionalidad subyacente es la contención de riesgos: suprimir el flujo de potencia oscilatorio para salvaguardar la integridad de la gran red europea frente al contagio ibérico.',
      REN: 'En este estadio, el operador portugués quedó relegado a un papel de observador pasivo del cambio tecnológico, viéndose abocado a sufrir posteriormente las consecuencias del aislamiento dinámico de la península, la cual carecía desde ese momento del vital soporte inercial que el modo de emulación AC proporcionaba desde Francia.',
      IIT_INESC: 'Acusan una falta de visión holística en el control de la interconexión. Argumentan que aislar dinámicamente la península mediante el enclavamiento en PMODE1, en lugar de haber explotado proactivamente los avanzados algoritmos de control POD-Q (amortiguamiento mediante inyección/absorción de potencia reactiva) del enlace, privó a España del único amortiguamiento crítico de gran escala disponible en ese instante. Convirtieron un salvavidas dinámico activo en un mero muro estático.'
    },
    physics_behind: {
      equations: [
        { formula: '\\frac{dP}{d\\delta} = 0 \\implies P = \\text{Constante}', label: 'Anulación del par sincronizante en PMODE1' },
        { formula: 'T_{sync} \\propto \\frac{E_1 E_2}{X} \\cos(\\delta_0)', label: 'Par sincronizante transitorio en modo emulación AC (PMODE3)' }
      ],
      explanation: 'Un enlace de corriente continua basado en convertidores de fuente de tensión (VSC-HVDC) posee la extraordinaria cualidad de inyectar o absorber potencias activa y reactiva de forma desacoplada y virtualmente instantánea. En su modo de operación normal PMODE3 (Emulación de red de corriente alterna), el flujo de potencia (P) fluctúa dinámicamente en respuesta a las variaciones del ángulo del rotor (Δδ). Al ordenar el fijado algorítmico en PMODE1, la derivada de potencia respecto al ángulo de fase se anula matemáticamente (dP/dδ = 0). Este simple cambio de variable elimina el par sincronizante interárea de la línea de transporte de 2000 MW, dejando las resonancias mecánicas encapsuladas y retroalimentándose peligrosamente dentro de los límites geográficos del sistema ibérico.'
    }
  }
];

export default function ForensicArbitrator() {
  const [activeMilestone, setActiveMilestone] = useState(MILESTONES_DATA[0].id);
  const [expandedPhysics, setExpandedPhysics] = useState({});
  const sectionRefs = useRef({});

  // Configurar IntersectionObserver para detectar el desplazamiento
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveMilestone(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    MILESTONES_DATA.forEach(m => {
      const el = sectionRefs.current[m.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveMilestone(id);
    }
  };

  const togglePhysics = (id) => {
    setExpandedPhysics(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.arbitratorWrapper}>
      {/* ── Timeline Navegador Sticky ── */}
      <div className={styles.stickyTimeline}>
        <div className={styles.timelineTrack}>
          {MILESTONES_DATA.map(m => (
            <button
              key={m.id}
              onClick={() => scrollToSection(m.id)}
              className={`${styles.timelineNode} ${activeMilestone === m.id ? styles.activeNode : ''}`}
            >
              <span className={styles.nodeTime}>{m.time}</span>
              <span className={styles.nodeTitle}>{m.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Cuerpo Principal: Hitos e Informes ── */}
      <div className={styles.milestonesList}>
        {MILESTONES_DATA.map(m => (
          <section
            key={m.id}
            id={m.id}
            ref={el => sectionRefs.current[m.id] = el}
            className={`${styles.milestoneSection} ${activeMilestone === m.id ? styles.sectionFocused : ''}`}
          >
            <div className={styles.sectionHeader}>
              <div className={styles.badgeRow}>
                <span className={styles.timeBadge}>{m.time} CEST</span>
                <span className={`${styles.levelBadge} ${m.divergence_level === 'Alta' ? styles.levelHigh : styles.levelMedium}`}>
                  <Translate id="arbitrator.divergence">Discrepancia:</Translate> {m.divergence_level}
                </span>
              </div>
              <h3 className={styles.sectionTitle}>{m.title}</h3>
            </div>

            {/* Rejilla Comparativa (Discrepancy Matrix) */}
            <div className={styles.discrepancyMatrix}>
              {/* Columna REE/RTE */}
              <div className={`${styles.quoteCard} ${styles.operatorsCard}`}>
                <h5 className={styles.cardHeader}>TSOs: REE / RTE</h5>
                <p className={styles.cardText}>"{m.versions.REE_RTE}"</p>
              </div>

              {/* Columna REN */}
              <div className={`${styles.quoteCard} ${styles.renCard}`}>
                <h5 className={styles.cardHeader}>TSO: REN (Portugal)</h5>
                <p className={styles.cardText}>"{m.versions.REN}"</p>
              </div>

              {/* Columna IIT / INESC TEC */}
              <div className={`${styles.quoteCard} ${styles.academyCard}`}>
                <h5 className={styles.cardHeader}>ACADEMIA: IIT / INESC</h5>
                <p className={styles.cardText}>"{m.versions.IIT_INESC}"</p>
              </div>
            </div>

            {/* Physics Accordion (PhysicsModal) */}
            <div className={styles.physicsAccordion}>
              <button
                onClick={() => togglePhysics(m.id)}
                className={styles.accordionToggle}
              >
                <span>{expandedPhysics[m.id] ? '▼ Ocultar Análisis Físico Profundo' : '▶ Ver Análisis Físico Profundo (Física de Red)'}</span>
                <span className={styles.mathSymbol}>∫ dP/dδ</span>
              </button>

              {expandedPhysics[m.id] && (
                <div className={styles.accordionContent}>
                  {/* Fórmulas estilo LaTeX */}
                  <div className={styles.equationsList}>
                    {m.physics_behind.equations.map((eq, eqIdx) => (
                      <div key={eqIdx} className={styles.equationRow}>
                        <div className={styles.latexFormula}>
                          <code>{eq.formula}</code>
                        </div>
                        <span className={styles.equationLabel}>{eq.label}</span>
                      </div>
                    ))}
                  </div>

                  <p className={styles.physicsExplan}>{m.physics_behind.explanation}</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
