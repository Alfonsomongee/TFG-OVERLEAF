export const timelineEvents = [
  {
    id: "t1",
    date: "22 de abril de 2025",
    time: "T-6 días",
    title_es: "Eventos Precursores en Núñez de Balboa",
    title_en: "Precursor Events at Núñez de Balboa",
    desc_es: "Se registran oscilaciones de tensión que provocan disparos idénticos a los que ocurrirían el 28-A, evidenciando el estrechamiento de los márgenes de reactiva.",
    desc_en: "Voltage oscillations are recorded, causing identical trips to those that would occur on April 28, evidencing the narrowing of reactive margins.",
    type: "warning"
  },
  {
    id: "t2",
    date: "28 de abril de 2025",
    time: "12:08 CEST",
    title_es: "Transición de Control en HVDC INELFE-1",
    title_en: "Control Transition in INELFE-1 HVDC",
    desc_es: "Paso de PMODE3 a PMODE1, limitando la capacidad de respuesta dinámica del enlace frente a perturbaciones posteriores.",
    desc_en: "Transition from PMODE3 to PMODE1, limiting the dynamic response capacity of the link against subsequent disturbances.",
    type: "info"
  },
  {
    id: "t3",
    date: "28 de abril de 2025",
    time: "12:30 CEST",
    title_es: "Déficit de Potencia Reactiva (Fase 1)",
    title_en: "Reactive Power Deficit (Phase 1)",
    desc_es: "Las maniobras de mallado (LIN&SHN) reducen el margen al colapso un 57% en la zona sur, generando un déficit neto de absorción.",
    desc_en: "Meshing maneuvers (LIN&SHN) reduce the margin to collapse by 57% in the southern zone, generating a net absorption deficit.",
    type: "warning"
  },
  {
    id: "t4",
    date: "28 de abril de 2025",
    time: "12:32:00 CEST",
    title_es: "Amplificación Tap-Lag (Fase 2)",
    title_en: "Tap-Lag Amplification (Phase 2)",
    desc_es: "Desacoplamiento entre la red de 400 kV (observada por REE) y las redes colectoras renovables, donde la tensión escala silenciosamente.",
    desc_en: "Decoupling between the 400 kV grid (observed by REE) and renewable collector grids, where voltage scales silently.",
    type: "danger"
  },
  {
    id: "t5",
    date: "28 de abril de 2025",
    time: "12:32:56.993 CEST",
    title_es: "Disparo Raíz en Granada",
    title_en: "Root Trip in Granada",
    desc_es: "El secundario colector alcanza ~145 kV (>1,10 p.u.), desencadenando la primera protección por sobretensión de inversores solares.",
    desc_en: "Collector secondary reaches ~145 kV (>1.10 p.u.), triggering the first overvoltage protection of solar inverters.",
    type: "danger"
  },
  {
    id: "t6",
    date: "28 de abril de 2025",
    time: "12:33:16 CEST",
    title_es: "Inicio de Cascada Geométrica (Fase 3)",
    title_en: "Onset of Geometric Cascade (Phase 3)",
    desc_es: "Propagación masiva de sobretensiones por el sur y oeste peninsular, provocando la desconexión en cadena de plantas fotovoltaicas.",
    desc_en: "Massive propagation of overvoltages through the southern and western peninsula, causing a chain disconnection of PV plants.",
    type: "critical"
  },
  {
    id: "t7",
    date: "28 de abril de 2025",
    time: "12:33:21 CEST",
    title_es: "Pérdida de Sincronismo ES-FR",
    title_en: "Loss of Synchronism ES-FR",
    desc_es: "La oscilación de potencia y la importación de emergencia (>4.600 MW) fuerzan la apertura de la interconexión con Francia.",
    desc_en: "Power oscillation and emergency import (>4,600 MW) force the opening of the interconnection with France.",
    type: "critical"
  },
  {
    id: "t8",
    date: "28 de abril de 2025",
    time: "12:33:29.741 CEST",
    title_es: "Cero Eléctrico (Blackout)",
    title_en: "System Blackout",
    desc_es: "Pérdida total de 15 GW de generación y colapso a cero de tensión. El sistema ibérico queda deenergizado.",
    desc_en: "Total loss of 15 GW generation and voltage collapse to zero. The Iberian system is de-energized.",
    type: "critical"
  },
  {
    id: "t9",
    date: "28 de abril de 2025",
    time: "13:00 - 15:00 CEST",
    title_es: "Fragmentación e Intentos Bottom-Up (Fase 4)",
    title_en: "Fragmentation & Bottom-Up Attempts (Phase 4)",
    desc_es: "División en 7 islas eléctricas. Múltiples fracasos de energización autónoma (Black Start) desde centrales hidroeléctricas sin masa síncrona.",
    desc_en: "Division into 7 electrical islands. Multiple failures of autonomous energization (Black Start) from hydro plants without synchronous mass.",
    type: "info"
  },
  {
    id: "t10",
    date: "29 de abril de 2025",
    time: "07:00 CEST",
    title_es: "Reposición Completa de la Demanda",
    title_en: "Full Demand Restoration",
    desc_es: "Tras aproximadamente 18,5 horas de maniobras y conexión escalonada de carga (Top-Down desde FR/MA), se recupera el suministro a nivel peninsular.",
    desc_en: "After approximately 18.5 hours of maneuvers and staggered load connection (Top-Down from FR/MA), supply is recovered at the peninsular level.",
    type: "success"
  }
];
