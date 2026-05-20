import React, { useState, useMemo } from 'react';
import styles from './GlosarioTecnico.module.css';

const GLOSSARY_TERMS = [
  {
    id: 'aelec',
    letter: 'A',
    term: 'AELEC',
    definition: 'Asociación Española de Empresas de Electricidad. Agrupa a las principales empresas del sector eléctrico español. Cofinanció el informe IIT-ICAI.',
  },
  {
    id: 'area-de-control',
    letter: 'A',
    term: 'Área de Control',
    definition: 'Zona geográfica bajo responsabilidad de un Operador del Sistema (OS). En el 28A se distinguen áreas Norte, Centro, Sur y Levante.',
  },
  {
    id: 'bess-battery-energy-storage-system',
    letter: 'B',
    term: 'BESS (Battery Energy Storage System)',
    definition: 'Sistema de almacenamiento electroquímico con capacidad de respuesta sub-cíclica. En configuración BESS-GFM actúa como recurso grid-forming, aportando inercia sintética y FFR.',
  },
  {
    id: 'black-start',
    letter: 'B',
    term: 'Black Start',
    definition: 'Capacidad de arrantar una central sin suministro externo de red. El 28A, únicamente las centrales hidroeléctricas tenían esta capacidad operativa.',
  },
  {
    id: 'colapso-q-v',
    letter: 'C',
    term: 'Colapso Q-V',
    definition: 'Inestabilidad de tensión en el plano potencia reactiva–voltaje. Mecanismo dominante del 28A (no colapso de frecuencia).',
  },
  {
    id: 'csn',
    letter: 'C',
    term: 'CSN',
    definition: 'Consejo de Seguridad Nacional de España. Publicó el informe oficial del Gobierno junto con REE.',
  },
  {
    id: 'criterio-n-1',
    letter: 'C',
    term: 'Criterio N-1',
    definition: 'Criterio estático de seguridad que requiere operación segura tras la desconexión de un único elemento de red. Limitación: no contempla dinámicas ultra-rápidas.',
  },
  {
    id: 'curva-de-capacidad-reactiva',
    letter: 'C',
    term: 'Curva de capacidad reactiva (Capability Curve)',
    definition: 'Diagrama P-Q que delimita el espacio operativo de un generador en el plano potencia activa-reactiva. El P.O. 7.4 obliga a los IBR a permanecer dentro de esta curva.',
  },
  {
    id: 'damping-ratio',
    letter: 'D',
    term: 'Damping ratio',
    definition: 'Parámetro que mide la capacidad del sistema para absorber oscilaciones. Relacionado con la inercia equivalente y la amortiguación electromecánica.',
  },
  {
    id: 'eas-entso-e-awareness-system',
    letter: 'E',
    term: 'EAS (ENTSO-E Awareness System)',
    definition: 'Sistema de Conciencia Situacional de ENTSO-E que monitorea la estabilidad de la red europea en tiempo real.',
  },
  {
    id: 'efecto-ferranti',
    letter: 'E',
    term: 'Efecto Ferranti',
    definition: 'Fenómeno capacitivo en líneas de transmisión en vacío o baja carga. La admitancia transversal inyecta potencia reactiva capacitiva, elevando la tensión en el extremo receptor. En el 28A: Inyección estimada de 1,05–2,4 GVAr capacitivos.',
  },
  {
    id: 'entso-e',
    letter: 'E',
    term: 'ENTSO-E',
    definition: 'European Network of Transmission System Operators for Electricity. Publicó el informe de evaluación de estabilidad y propuso NC RfG 2.0.',
  },
  {
    id: 'ers-essential-reliability-services',
    letter: 'E',
    term: 'ERS (Essential Reliability Services)',
    definition: 'Servicios Esenciales de Confiabilidad. Mercados explícitos propuestos para remunerar inercia, potencia de cortocircuito y control de tensión autónomo.',
  },
  {
    id: 'estabilidad-de-tension',
    letter: 'E',
    term: 'Estabilidad de tensión',
    definition: 'Capacidad del sistema para mantener tensiones dentro de límites operacionales tras perturbaciones. Requiere balance entre demanda y aportación de potencia reactiva.',
  },
  {
    id: 'ffr-fast-frequency-response',
    letter: 'F',
    term: 'FFR (Fast Frequency Response)',
    definition: 'Respuesta de frecuencia ultrarrápida (< 500 ms). Característica de los BESS-GFM. Reduce la profundidad de la caída de frecuencia (nadir).',
  },
  {
    id: 'frecuencia-nominal',
    letter: 'F',
    term: 'Frecuencia nominal',
    definition: '50 Hz en el sistema europeo continental. El P.O. 1.1 define los límites de operación: f ∈ [49,0; 51,0] Hz en operación normal.',
  },
  {
    id: 'gfl-grid-following',
    letter: 'G',
    term: 'GFL (Grid-Following)',
    definition: 'Inversor que sigue la tensión y fase de la red externa mediante un bucle PLL (Phase-Locked Loop). No puede operar sin una red estable preexistente. 82% de la generación del 28A era GFL.',
  },
  {
    id: 'gfm-grid-forming',
    letter: 'G',
    term: 'GFM (Grid-Forming)',
    definition: 'Inversor que genera activamente su propio vector de tensión. No requiere PLL; puede sostener la red y participar en Black Start. Obligatorio para instalaciones > 1 MW según NC RfG 2.0.',
  },
  {
    id: 'hvdc-high-voltage-direct-current',
    letter: 'H',
    term: 'HVDC (High Voltage Direct Current)',
    definition: 'Transmisión de corriente continua de alto voltaje. Utilizada para interconexiones de larga distancia con mejor control de flujo que AC.',
  },
  {
    id: 'ibr-inverter-based-resources',
    letter: 'I',
    term: 'IBR (Inverter-Based Resources)',
    definition: 'Recursos Basados en Inversores. Incluye solar fotovoltaica, eólica con convertidor completo y almacenamiento. Opuesto a generación síncrona convencional. Penetración instantánea 28A: 82%',
  },
  {
    id: 'igbt-insulated-gate-bipolar-transistor',
    letter: 'I',
    term: 'IGBT (Insulated Gate Bipolar Transistor)',
    definition: 'Semiconductor de potencia utilizado en inversores. Control de compuerta aislada permite conmutación rápida y eficiente.',
  },
  {
    id: 'inercia-h',
    letter: 'I',
    term: 'Inercia (H)',
    definition: 'Constante de inercia equivalente del sistema en segundos. Define la resistencia al cambio de frecuencia tras una perturbación. Valores 28A: Global 2,3s, Sur 1,3s (umbral ENTSO-E ≥ 2,0s).',
  },
  {
    id: 'mallado',
    letter: 'M',
    term: 'Mallado',
    definition: 'Maniobra operativa de reconfiguración topológica que conecta subestaciones previamente separadas mediante líneas de 400 kV. En el 28A activó el efecto Ferranti.',
  },
  {
    id: 'nc-rfg-network-code-requirements-for-generators',
    letter: 'N',
    term: 'NC RfG 2.0 (Network Code Requirements for Generators)',
    definition: 'Revisión del Código de Red Europeo para generadores, propuesta por ENTSO-E tras el 28A. Introduce obligatoriedad de GFM para IBR ≥ 1 MW.',
  },
  {
    id: 'oltc-on-load-tap-changer',
    letter: 'O',
    term: 'OLTC (On-Load Tap Changer)',
    definition: 'Cambiador de tomas en carga. Ajusta automáticamente la relación de transformación bajo carga. Retardo electromecánico (Tap-Lag): 50–100 ms por operación.',
  },
  {
    id: 'oscilaciones-electromecanicas',
    letter: 'O',
    term: 'Oscilaciones electromecánicas',
    definition: 'Modos oscilatorios asociados a la interacción entre generadores síncronos. Típicamente 0,1–2 Hz. En el 28A se detectó oscilación de 0,6 Hz.',
  },
  {
    id: 'phase-locked-loop-pll',
    letter: 'P',
    term: 'Phase-Locked Loop (PLL)',
    definition: 'Bucle de seguimiento de fase empleado por los inversores GFL. Inestable en redes de alta impedancia (SCR < 2).',
  },
  {
    id: 'pmu-phasor-measurement-unit',
    letter: 'P',
    term: 'PMU (Phasor Measurement Unit)',
    definition: 'Unidad de medida fasorial sincronizada mediante GPS. Resolución temporal ~20–30 ms. Imprescindible para detectar fenómenos como el Tap-Lag y la oscilación de 0,6 Hz.',
  },
  {
    id: 'po-74-procedimiento-de-operacion',
    letter: 'P',
    term: 'P.O. 7.4 (Procedimiento de Operación 7.4)',
    definition: 'Procedimiento de operación español sobre "Control de tensión en la red de transporte". Define las curvas de reactiva obligatorias para generadores. Actualizado el 12 de junio de 2025 (post-28A).',
  },
  {
    id: 'potencia-de-cortocircuito',
    letter: 'P',
    term: 'Potencia de cortocircuito',
    definition: 'Capacidad de la red para soportar perturbaciones, directamente relacionada con la inercia y la estabilidad. Definida como Scc = (Vnom)²/Zth donde Zth es la impedancia Thevenin equivalente.',
  },
  {
    id: 'potencia-reactiva',
    letter: 'P',
    term: 'Potencia reactiva',
    definition: 'Componente imaginaria del flujo de potencia. Medida en VARs (Volt-Ampere Reactivos). Fundamental para mantener perfiles de tensión en redes AC.',
  },
  {
    id: 'pss-e',
    letter: 'P',
    term: 'PSS/E',
    definition: 'Power System Simulator for Engineering. Software comercial de simulación del sistema eléctrico utilizado por operadores y planificadores.',
  },
  {
    id: 'rocof-rate-of-change-of-frequency',
    letter: 'R',
    term: 'RoCoF (Rate of Change of Frequency)',
    definition: 'Tasa de cambio de frecuencia en Hz/s. Parámetro indicador de la inercia efectiva disponible. 28A: RoCoF < 1 Hz/s durante la mayor parte de la cascada.',
  },
  {
    id: 'ree-red-electrica-de-espana',
    letter: 'R',
    term: 'REE (Red Eléctrica de España)',
    definition: 'Operador del Sistema eléctrico peninsular. Publicó el informe oficial junto con el CSN.',
  },
  {
    id: 'scada-supervisory-control-and-data-acquisition',
    letter: 'S',
    term: 'SCADA (Supervisory Control and Data Acquisition)',
    definition: 'Sistema de telemedida y telemando. Proporciona una visión retrasada (típicamente 2-4 segundos) del estado operativo. Insuficiente para dinámicas ultra-rápidas.',
  },
  {
    id: 'scr-short-circuit-ratio',
    letter: 'S',
    term: 'SCR (Short Circuit Ratio)',
    definition: 'Ratio entre la potencia de cortocircuito del nudo y la potencia nominal del generador. Mide la "rigidez eléctrica" local. SCR < 2 = Red muy débil (28A).',
  },
  {
    id: 'sincronismo',
    letter: 'S',
    term: 'Sincronismo',
    definition: 'Condición de operación donde todos los generadores rotan a la misma frecuencia angular. Pérdida de sincronismo = desconexión cascada.',
  },
  {
    id: 'so-gl-system-operation-guidelines',
    letter: 'S',
    term: 'SO GL (System Operation Guidelines)',
    definition: 'Directrices de Operación del Sistema emitidas por ENTSO-E. Establecen márgenes operacionales mínimos para estabilidad.',
  },
  {
    id: 'syncon-synchronous-condenser',
    letter: 'S',
    term: 'SynCon (Synchronous Condenser)',
    definition: 'Máquina síncrona sin turboprimemover, operada en modo motor/generador de reactiva. Aporta potencia de cortocircuito genuina e inercia rotacional.',
  },
  {
    id: 'tap-lag',
    letter: 'T',
    term: 'Tap-Lag',
    definition: 'Retardo electromecánico del OLTC que lo deja desfasado respecto a transitorios eléctricos rápidos. En el 28A creó brecha de observabilidad: SCADA mostraba 418 kV en primario mientras secundario de 220 kV había colapsado a 244 kV.',
  },
  {
    id: 'ufls-underfrequency-load-shedding',
    letter: 'U',
    term: 'UFLS (Underfrequency Load Shedding)',
    definition: 'Deslastre automático de carga por baja frecuencia. Sistema de protección diseñado para colapsos de potencia activa. Paradoja del 28A: Agravó la sobretensión.',
  },
];

export default function GlosarioTecnico() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Get unique letters
  const letters = useMemo(
    () => [...new Set(GLOSSARY_TERMS.map((t) => t.letter))].sort(),
    []
  );

  // Filter terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLetter = !selectedLetter || term.letter === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [searchTerm, selectedLetter]);

  // Group by letter
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((term) => {
      if (!groups[term.letter]) {
        groups[term.letter] = [];
      }
      groups[term.letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const handleLetterFilter = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  return (
    <div className={styles.glosarioContainer}>
      {/* Search Section */}
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Buscar término o definición..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
          aria-label="Buscar en glosario"
        />
        {searchTerm && (
          <button
            className={styles.clearButton}
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      {/* Letter Filter */}
      <div className={styles.letterFilter}>
        <button
          className={`${styles.letterButton} ${
            selectedLetter === null ? styles.active : ''
          }`}
          onClick={() => setSelectedLetter(null)}
        >
          Todas
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            className={`${styles.letterButton} ${
              selectedLetter === letter ? styles.active : ''
            }`}
            onClick={() => handleLetterFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className={styles.resultsInfo}>
        Mostrando {filteredTerms.length} de {GLOSSARY_TERMS.length} términos
      </div>

      {/* Terms Display */}
      {Object.keys(groupedTerms).length > 0 ? (
        <div className={styles.termsContainer}>
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => (
              <div key={letter} className={styles.letterGroup}>
                <h2 className={styles.letterHeader}>{letter}</h2>
                <div className={styles.termsList}>
                  {groupedTerms[letter].map((term) => (
                    <div key={term.id} className={styles.termItem}>
                      <h3 className={styles.termTitle}>
                        <a href={`#${term.id}`}>{term.term}</a>
                      </h3>
                      <p className={styles.termDefinition}>{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No se encontraron términos que coincidan con tu búsqueda.</p>
          <button
            className={styles.resetButton}
            onClick={() => {
              setSearchTerm('');
              setSelectedLetter(null);
            }}
          >
            Reiniciar búsqueda
          </button>
        </div>
      )}

      {/* Footer */}
      <div className={styles.glossaryFooter}>
        <p>
          <em>
            Última actualización: mayo 2026 — Alfonso Monge García, ETSI
            Universidad de Sevilla
          </em>
        </p>
      </div>
    </div>
  );
}
