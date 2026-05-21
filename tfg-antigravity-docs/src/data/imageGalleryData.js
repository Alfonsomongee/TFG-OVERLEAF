export const imageGalleryData = {
  chapters: [
    {
      id: "ch1",
      title_es: "Capítulo 1: Introducción a un Nuevo Paradigma de Fallo Sistémico",
      title_en: "Chapter 1: Introduction to a New Paradigm of Systemic Failure",
      images: [
        {
          src: "/figuras/albustami_ieee39_secuencia.png",
          caption_es: "Secuencia del colapso del 28-A mostrando la interacción entre Acciones del Operador (OA) y Acciones Automáticas de protección (AA). Fuente: Albustami et al., 2025.",
          caption_en: "Sequence of the April 28 collapse showing the interaction between Operator Actions (OA) and Automatic protective actions (AA). Source: Albustami et al., 2025."
        },
        {
          src: "/figuras/futured_grid_evolution.png",
          caption_es: "El desplazamiento de grandes masas rotatorias por recursos IBR reduce drásticamente la inercia total del sistema. Fuente: FutuRed, 2024.",
          caption_en: "The displacement of large rotating masses by IBR resources drastically reduces the total inertia of the system. Source: FutuRed, 2024."
        },
        {
          src: "/figuras/pmu_sensors_europe.png",
          caption_es: "La densidad de cobertura de las PMU fue determinante para la verificación independiente de las oscilaciones inter-área. Fuente: NREL.",
          caption_en: "The coverage density of PMUs was decisive for the independent verification of inter-area oscillations. Source: NREL."
        }
      ]
    },
    {
      id: "ch2",
      title_es: "Capítulo 2: El Contexto Energético y la Vulnerabilidad Estructural",
      title_en: "Chapter 2: The Energy Context and Structural Vulnerability",
      images: [
        {
          src: "/figuras/mix_comparativo_2010_2024.png",
          caption_es: "Evolución del mix de generación en España: 2010 frente a 2024. Fuente: Centro Peter Huber / ESIOS.",
          caption_en: "Evolution of the generation mix in Spain: 2010 versus 2024. Source: Peter Huber Center / ESIOS."
        },
        {
          src: "/figuras/capacidad_instalada_2025.png",
          caption_es: "Capacidad de generación instalada en el sistema español a 31 de enero de 2025. Fuente: NREL / Red Eléctrica.",
          caption_en: "Installed generation capacity in the Spanish system as of January 31, 2025. Source: NREL / Red Eléctrica."
        },
        {
          src: "/figuras/ree_generation_mix_28april.png",
          caption_es: "Perfil de generación del 28-A: el valle de demanda coincidió con el pico de producción fotovoltaica, desplazando la generación síncrona a mínimos históricos. Fuente: NREL / Red Eléctrica.",
          caption_en: "Generation profile on April 28: the demand valley coincided with the peak of photovoltaic production, displacing synchronous generation to historical minimums. Source: NREL / Red Eléctrica."
        },
        {
          src: "/figuras/precursor_overvoltage_22april.png",
          caption_es: "Oscilaciones de tensión registradas en Núñez de Balboa (400 kV) durante el episodio precursor del 22 de abril. Varias instalaciones que dispararon el 28-A ya habían sufrido disparos idénticos en este evento previo. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Voltage oscillations recorded at Núñez de Balboa (400 kV) during the precursor episode on April 22. Several facilities that tripped on April 28 had already suffered identical trips in this previous event. Source: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/entsoe_flow_deviation.png",
          caption_es: "Desviación entre el programa de intercambio comercial (NTC) y el flujo de potencia físico real en la frontera España-Francia durante la mañana del 28-A. Fuente: Informe Factual ENTSO-E.",
          caption_en: "Deviation between the commercial exchange schedule (NTC) and the actual physical power flow on the Spain-France border during the morning of April 28. Source: ENTSO-E Factual Report."
        },
        {
          src: "/figuras/hvdc_control_transition.png",
          caption_es: "Transición PMODE3 → PMODE1 a las 12:08 CEST en el enlace HVDC INELFE-1. La decisión limitó la capacidad de respuesta dinámica del enlace ante la cascada posterior. Fuente: IIT-ICAI / AELEC.",
          caption_en: "Transition from PMODE3 to PMODE1 at 12:08 CEST in the INELFE-1 HVDC link. The decision limited the dynamic response capacity of the link to the subsequent cascade. Source: IIT-ICAI / AELEC."
        },
        {
          src: "/figuras/frequency_voltage_carmona.png",
          caption_es: "Frecuencia y tensión en los segundos críticos del incidente. Subestación de Carmona (400 kV). La transición abrupta Normal → Blackout queda registrada en la caída simultánea de ambas variables. Fuente: ENTSO-E / REE.",
          caption_en: "Frequency and voltage in the critical seconds of the incident. Carmona Substation (400 kV). The abrupt transition from Normal to Blackout is recorded in the simultaneous drop of both variables. Source: ENTSO-E / REE."
        }
      ]
    },
    {
      id: "ch3",
      title_es: "Capítulo 3: Análisis del Incidente",
      title_en: "Chapter 3: Analysis of the Incident",
      images: [
        {
          src: "/figuras/nunez_balboa_precursores.png",
          caption_es: "Tensiones en Núñez de Balboa (400 kV) durante los eventos precursores del 22, 24 y 28 de abril. La sucesión de picos de sobretensión evidencia el estrechamiento progresivo de los márgenes de control de potencia reactiva. Fuente: IIT-ICAI.",
          caption_en: "Voltages at Núñez de Balboa (400 kV) during the precursor events of April 22, 24, and 28. The succession of overvoltage peaks shows the progressive narrowing of reactive power control margins. Source: IIT-ICAI."
        },
        {
          src: "/figuras/wams_oscilaciones_carmona.png",
          caption_es: "Registro del WAMS capturando la oscilación electromecánica de 0,6 Hz en Carmona (Sevilla) a las 12:03 CEST. Los sistemas WAMS, basados en redes de PMU sincronizadas por GPS, permiten observar la dinámica continental con resolución de milisegundos. Fuente: ENTSO-E / REE.",
          caption_en: "WAMS record capturing the 0.6 Hz electromechanical oscillation at Carmona (Seville) at 12:03 CEST. WAMS systems, based on networks of GPS-synchronized PMUs, allow observing continental dynamics with millisecond resolution. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/tap_lag_decoupling.png",
          caption_es: "Desacoplamiento entre el primario de 400 kV y el secundario colector durante la Fase 2. Mientras el incremento de tensión en el lado de 400 kV se mantuvo en valores moderados, la inercia del OLTC amplificó el transitorio en el lado colector. Fuente: ENTSO-E.",
          caption_en: "Decoupling between the 400 kV primary and the collector secondary during Phase 2. While the voltage increase on the 400 kV side remained moderate, the inertia of the OLTC amplified the transient on the collector side. Source: ENTSO-E."
        },
        {
          src: "/figuras/heatmap_propagation.png",
          caption_es: "Propagación de las sobretensiones en la red de 400 kV durante la Fase 2 (12:32:00–12:33:18 CEST). Fuente: Comité de Análisis del Gobierno / REE.",
          caption_en: "Propagation of overvoltages in the 400 kV network during Phase 2 (12:32:00–12:33:18 CEST). Source: Government Analysis Committee / REE."
        },
        {
          src: "/figuras/cascada_desconexiones.png",
          caption_es: "Propagación geográfica de la cascada durante los once segundos de la Fase 3. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Geographical propagation of the cascade during the eleven seconds of Phase 3. Source: Government Analysis Committee."
        },
        {
          src: "/figuras/tension_frecuencia_colapso.png",
          caption_es: "Evolución acoplada de la tensión (kV) y la frecuencia (Hz) durante la Fase 3. El incremento de tensión por encima de 1,10 p.u. precede en el tiempo a la caída de frecuencia, confirmando que el colapso fue primariamente capacitivo, no inercial. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Coupled evolution of voltage (kV) and frequency (Hz) during Phase 3. The voltage increase above 1.10 p.u. precedes the frequency drop in time, confirming that the collapse was primarily capacitive, not inertial. Source: Government Analysis Committee."
        },
        {
          src: "/figuras/interconexion_francia_colapso.png",
          caption_es: "Inversión de flujos en la frontera pirenaica durante la Fase 3: importación de emergencia de hasta 4.609 MW por las líneas AC, extracción simultánea de 1.000 MW por el HVDC en PMODE1, y apertura de las líneas AC por pérdida de sincronismo a las 12:33:21 CEST. Fuente: Comité de Análisis del Gobierno / REE.",
          caption_en: "Reversal of flows at the Pyrenean border during Phase 3: emergency import of up to 4,609 MW through AC lines, simultaneous extraction of 1,000 MW through HVDC in PMODE1, and opening of AC lines due to loss of synchronism at 12:33:21 CEST. Source: Government Analysis Committee / REE."
        }
      ]
    },
    {
      id: "ch4",
      title_es: "Capítulo 4: Reacción y Reposición",
      title_en: "Chapter 4: Reaction and Restoration",
      images: [
        {
          src: "/figuras/islas_reposicion_entsoe.png",
          caption_es: "Fragmentación topológica conforme al P.O. 1.6. Cada isla debía estabilizarse individualmente en tensión y frecuencia antes de autorizarse su sincronización con las islas adyacentes. Fuente: ENTSO-E / REE.",
          caption_en: "Topological fragmentation according to OP 1.6. Each island had to stabilize individually in voltage and frequency before its synchronization with adjacent islands was authorized. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/estrategia_reenergizacion_dual.png",
          caption_es: "Estrategia dual de re-energización: vía Top-Down desde Francia y Marruecos y vía Bottom-Up desde las centrales hidráulicas internas. Fuente: ENTSO-E / REE.",
          caption_en: "Dual re-energization strategy: Top-Down approach from France and Morocco, and Bottom-Up approach from internal hydroelectric plants. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/black_start_hidroelectrico.png",
          caption_es: "Intentos de arranque autónomo hidroeléctrico durante la Fase 4. Los puntos grises corresponden a intentos fallidos. La elevada proporción de fracasos refleja la complejidad de energizar una red sin masa síncrona acoplada. Fuente: ENTSO-E / REE.",
          caption_en: "Hydroelectric black start attempts during Phase 4. Grey dots correspond to failed attempts. The high proportion of failures reflects the complexity of energizing a grid without coupled synchronous mass. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/evolucion_carga_repuesta_francia.png",
          caption_es: "Soporte transfronterizo desde Francia durante la reposición. Las inyecciones de RTE sostuvieron la estabilidad de tensión durante la re-energización de los corredores norte y este antes de que los grupos síncronos internos se acoplaran en cantidad suficiente. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Cross-border support from France during restoration. RTE injections sustained voltage stability during the re-energization of the northern and eastern corridors before internal synchronous units were coupled in sufficient quantity. Source: Government Analysis Committee."
        },
        {
          src: "/figuras/intercambio_marruecos_topdown.png",
          caption_es: "Soporte Top-Down desde la frontera sur (ONEE). La interconexión marroquí resultó determinante para aportar la potencia de cortocircuito necesaria para energizar Andalucía. Fuente: ENTSO-E / REE.",
          caption_en: "Top-Down support from the southern border (ONEE). The Moroccan interconnection was decisive in providing the short-circuit power necessary to energize Andalusia. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/evolucion_mix_reenergizacion.png",
          caption_es: "Mix tecnológico durante la re-energización. En las primeras horas, el sistema se sostuvo exclusivamente mediante importaciones transfronterizas y generación síncrona. La incorporación de IBR quedó restringida hasta que se acreditó la potencia de cortocircuito e inercia mínimas necesarias. Fuente: ENTSO-E / REE.",
          caption_en: "Technological mix during re-energization. In the early hours, the system was sustained exclusively by cross-border imports and synchronous generation. The incorporation of IBRs was restricted until the minimum required short-circuit power and inertia were verified. Source: ENTSO-E / REE."
        },
        {
          src: "/figuras/recuperacion_demanda_peninsular.png",
          caption_es: "Desplome y recuperación de la demanda peninsular. La reposición de los 25 GW perdidos se completó tras casi 19 horas de maniobras ininterrumpidas, con conexión de carga escalonada para evitar nuevos episodios de subfrecuencia. Fuente: Comité de Análisis del Gobierno.",
          caption_en: "Collapse and recovery of peninsular demand. The replacement of the 25 GW lost was completed after almost 19 hours of uninterrupted maneuvers, with staggered load connection to avoid new subfrequency episodes. Source: Government Analysis Committee."
        }
      ]
    },
    {
      id: "ch5",
      title_es: "Capítulo 5: Análisis de los Informes",
      title_en: "Chapter 5: Analysis of the Reports",
      images: [
        {
          src: "/figuras/mapas_termicos_tension_ree.png",
          caption_es: "Cartografía de tensión en la red de 400 kV (12:30–12:32:57 CEST) según el análisis del Operador del Sistema. REE sostiene que los perfiles se mantuvieron dentro de los rangos del P.O. 1.1 hasta el inicio de las desconexiones en las redes colectoras. Fuente: Red Eléctrica.",
          caption_en: "Voltage mapping in the 400 kV network (12:30–12:32:57 CEST) according to the System Operator's analysis. REE argues that profiles remained within PO 1.1 ranges until the onset of disconnections in collector networks. Source: Red Eléctrica."
        },
        {
          src: "/figuras/fluctuaciones_tension_previas.png",
          caption_es: "Curvas Q-V de estabilidad de tensión en Carmona 400 kV. Las maniobras de mallado desplazaron el punto de operación contrayendo el margen al colapso un 57 %. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Q-V voltage stability curves at Carmona 400 kV. Meshing maneuvers shifted the operating point, shrinking the margin to collapse by 57%. Source: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/aluvion_alertas_sobretension_sur.png",
          caption_es: "Oscilograma del disparo raíz (Granada, 12:32:56.993 CEST). Panel inferior: tensión en el secundario colector —fase A alcanza ~145 kV— invisible para el SCADA de REE en la red de 400 kV por efecto Tap-Lag. Fuente: IIT-ICAI / AELEC.",
          caption_en: "Oscillogram of the root trip (Granada, 12:32:56.993 CEST). Lower panel: voltage on the collector secondary reaches ~145 kV, invisible to REE's SCADA on the 400 kV grid due to the Tap-Lag effect. Source: IIT-ICAI / AELEC."
        },
        {
          src: "/figuras/asimetria_balance_reactiva_sur.png",
          caption_es: "Balance de potencia reactiva a las 12:30 CEST. Déficit neto: −0,6 GVAr. Fuente: IIT-ICAI / Compass Lexecon.",
          caption_en: "Reactive power balance at 12:30 CEST. Net deficit: −0.6 GVAr. Source: IIT-ICAI / Compass Lexecon."
        },
        {
          src: "/figuras/perdida_sincronismo_frontera.png",
          caption_es: "Intercambio de potencia activa en la frontera España-Francia durante la Fase 3. La oscilación final refleja la divergencia de polos antes de la apertura definitiva. Fuente: ENTSO-E.",
          caption_en: "Active power exchange at the Spain-France border during Phase 3. The final oscillation reflects pole divergence before final opening. Source: ENTSO-E."
        }
      ]
    },
    {
      id: "ch6",
      title_es: "Capítulo 6: Impacto Comunicativo",
      title_en: "Chapter 6: Communicative Impact",
      images: [
        {
          src: "/figuras/collage_conservador.png",
          caption_es: "Cobertura representativa de medios con postura crítica frente a la gestión institucional. Se identifica un patrón de encuadre que reduce el fenómeno multicausal a la relación «mayor penetración renovable → menor estabilidad → apagón». Fuente: elaboración propia.",
          caption_en: "Representative coverage from media critical of institutional management. A framing pattern reduces the multi-causal phenomenon to: «higher renewable penetration → lower stability → blackout». Source: Own elaboration."
        },
        {
          src: "/figuras/collage_progresista.png",
          caption_es: "Cobertura representativa de medios con postura favorable a la narrativa oficial. La selección de evidencias es simétricamente parcial a la del bloque anterior. Fuente: elaboración propia.",
          caption_en: "Representative coverage from media favorable to the official narrative. The selection of evidence is symmetrically partial compared to the critical block. Source: Own elaboration."
        },
        {
          src: "/figuras/collage_internacional.png",
          caption_es: "Cobertura internacional del incidente. Los medios internacionales tendieron a un encuadre estructural europeo, con mayor presencia de argumentos de seguridad de infraestructuras críticas. Fuente: elaboración propia.",
          caption_en: "International coverage of the incident. International media leaned toward a structural European framing, emphasizing critical infrastructure security. Source: Own elaboration."
        },
        {
          src: "/figuras/collage_ciudadanos.png",
          caption_es: "Publicaciones ciudadanas durante las primeras horas. Se identifican tres patrones: normalización pragmática y humor, crítica institucional, y búsqueda activa de explicaciones. Fuente: elaboración propia.",
          caption_en: "Citizen publications during the first hours. Three patterns are identified: pragmatic normalization/humor, institutional criticism, and active search for causal explanations. Source: Own elaboration."
        },
        {
          src: "/figuras/collage_politicos.png",
          caption_es: "Publicaciones de líderes políticos españoles en X durante las 72 horas posteriores. Ninguno abordó aspectos técnicos, orientándose a la atribución de responsabilidades. Fuente: elaboración propia.",
          caption_en: "Posts by Spanish political leaders on X during the following 72 hours. None addressed technical aspects, focusing instead on attribution of blame. Source: Own elaboration."
        }
      ]
    },
    {
      id: "ch7",
      title_es: "Capítulo 7: Resiliencia y Futuro",
      title_en: "Chapter 7: Resilience and Future",
      images: [
        {
          src: "/figuras/scr_iberia.png",
          caption_es: "Evolución geográfica de las tensiones en la red de 400 kV previa al colapso. Las zonas de color cálido muestran la progresión y concentración de sobretensiones severas en el sur y suroeste peninsular. Fuente: IIT-ICAI.",
          caption_en: "Geographical evolution of voltages in the 400 kV grid prior to collapse. Warm-colored zones show the progression and concentration of severe overvoltages in the southern and southwestern peninsula. Source: IIT-ICAI."
        },
        {
          src: "/figuras/conventionalunits.png",
          caption_es: "Unidades síncronas convencionales acopladas diariamente. La tendencia decreciente en los meses previos al 28-A refleja la expulsión sistemática por orden de mérito. Fuente: ENTSO-E.",
          caption_en: "Conventional synchronous units coupled daily. The decreasing trend in the months prior to April 28 reflects their systematic market displacement. Source: ENTSO-E."
        },
        {
          src: "/figuras/gfl_vs_gfm_circuit1.png",
          caption_es: "Circuitos equivalentes: Inversor GFL (fuente de corriente dependiente) frente a inversor GFM (fuente de tensión autónoma). El GFM no necesita leer la red para operar: la crea.",
          caption_en: "Equivalent circuits: GFL inverter (dependent current source) vs. GFM inverter (autonomous voltage source). GFM doesn't need to read the grid to operate: it creates it."
        },
        {
          src: "/figuras/hitachi_hybrid.png",
          caption_es: "Esquema de arquitectura híbrida: los BESS-GFM proveen FFR; los compensadores síncronos aportan inercia rotacional y potencia de cortocircuito. Fuente: Hitachi Energy.",
          caption_en: "Hybrid architecture diagram: BESS-GFM provide FFR; synchronous condensers provide rotational inertia and short-circuit power. Source: Hitachi Energy."
        },
        {
          src: "/figuras/coste_optimo_ers.png",
          caption_es: "El mínimo de coste total del sistema se alcanza con un mix que remunera explícitamente los ERS. La diferencia es el coste de los servicios ancilares no remunerados. Fuente: ESIG.",
          caption_en: "Minimum total system cost is achieved with a mix that explicitly remunerates ERS. The difference is the cost of unremunerated ancillary services. Source: ESIG."
        },
        {
          src: "/figuras/po74_banda_muerta.png",
          caption_es: "La zona sombreada ilustra la «banda muerta» del antiguo P.O. 7.4, inhabilitando la defensa del sistema frente a transitorios capacitivos rápidos. Fuente: REE.",
          caption_en: "The shaded area illustrates the «dead band» of the old P.O. 7.4, disabling system defense against fast capacitive transients. Source: REE."
        },
        {
          src: "/figuras/ers_revenue_stacking.png",
          caption_es: "Fuentes de ingresos apiladas para un sistema BESS-GFM: mercado diario, aFRR/mFRR, inercia sintética y FFR. Fuente: elaboración propia.",
          caption_en: "Stacked revenue sources for a BESS-GFM system: day-ahead market, aFRR/mFRR, synthetic inertia, and FFR. Source: Own elaboration."
        }
      ]
    }
  ]
};
