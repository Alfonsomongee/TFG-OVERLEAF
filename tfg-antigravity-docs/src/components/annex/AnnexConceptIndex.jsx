import React from 'react';
import styles from './AnnexConceptIndex.module.css';

const THEMATIC_DATA = [
  // ─────────────────────────────────────────────────────────────
  // T1 — Demanda, generación y balance eléctrico
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T1',
    title: 'Demanda, generación y balance eléctrico',
    description: 'Evidencias sobre carga peninsular, mix de generación, potencia disponible, previsiones de demanda y equilibrio operativo del sistema antes, durante y después del 28-A.',
    items: [
      // Figuras
      { label: 'Evolución del mix de generación 2010 vs 2024',          type: 'Figura',      href: '/docs/anexo-demanda-generacion-balance#fig-mix_comparativo_2010_2024' },
      { label: 'Capacidad instalada a 31 de enero de 2025',             type: 'Figura',      href: '/docs/anexo-demanda-generacion-balance#fig-capacidad_instalada_2025' },
      { label: 'Perfil de generación 28-A a las 12:30 CEST',           type: 'Figura',      href: '/docs/anexo-demanda-generacion-balance#fig-ree_generation_mix_28april' },
      { label: 'Mix tecnológico durante la re-energización',            type: 'Figura',      href: '/docs/anexo-demanda-generacion-balance#fig-evolucion_mix_reenergizacion' },
      // Tablas
      { label: 'Desglose tecnológico del mix a las 12:30 CEST',        type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-mix-generacion-12-30' },
      { label: 'Potencia indisponible por tecnología',                  type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-indisponibilidad-generacion-convencional' },
      { label: 'Precios marginales OMIE 28-A vs 29-A',                 type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-precios-marginales-omie' },
      { label: 'Programa de intercambios internacionales pre-apagón',  type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-programa-intercambios-pre-apagon' },
      { label: 'Previsión vs demanda real España 28-A',                 type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-spanish-demand-forecast' },
      { label: 'Previsión vs demanda real Portugal 28-A',              type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-portuguese-demand-forecast' },
      { label: 'Potencia instalada vs indisponible por tecnología',    type: 'Tabla',       href: '/docs/anexo-demanda-generacion-balance#tabla-unavailable-capacity' },
      // Series
      { label: 'Demanda Peninsular — real vs programada vs prevista',  type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-1' },
      { label: 'Total Load ES + PT (MTU horario)',                     type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-2' },
      { label: 'Programa de Producción — desglose de mercados',       type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-3' },
      { label: 'Installed Capacity per Type — 121.873 MW',            type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-5' },
      { label: 'Water Reservoirs & Hydro — 15 TWh',                   type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-7' },
      { label: 'CO₂ + Renovables — 91,2 % a las 11:30 CEST',         type: 'Serie',       href: '/docs/anexo-demanda-generacion-balance#chart-8' },
      // Interactivos
      { label: 'Transición energética y emisiones CO₂',               type: 'Interactivo', href: '/docs/anexo-demanda-generacion-balance#grafico-streamgraph' },
      { label: 'Mix de generación en tiempo real',                     type: 'Interactivo', href: '/docs/anexo-demanda-generacion-balance#grafico-mix-generacion' },
      { label: 'Emisiones vs penetración renovable',                   type: 'Interactivo', href: '/docs/anexo-demanda-generacion-balance#grafico-emissions-renewables' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T2 — Estabilidad dinámica, frecuencia y tensión
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T2',
    title: 'Estabilidad dinámica, frecuencia y tensión',
    description: 'Registros de oscilaciones, RoCoF, perfiles de tensión, estabilidad Q-V y comportamiento electromecánico del sistema durante la perturbación.',
    items: [
      // Figuras
      { label: 'Desplazamiento de masas rotatorias por IBR (FutuRed)',  type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-futured_grid_evolution' },
      { label: 'Oscilaciones en Núñez de Balboa — 22 de abril',        type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-precursor_overvoltage_22april' },
      { label: 'Frecuencia y tensión en Carmona durante el colapso',   type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-frequency_voltage_carmona' },
      { label: 'Tensiones en Núñez de Balboa — 22, 24 y 28 de abril', type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-nunez_balboa_precursores' },
      { label: 'Oscilación 0,6 Hz detectada por WAMS (12:03 CEST)',   type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-wams_oscilaciones_carmona' },
      { label: 'Evolución acoplada tensión-frecuencia Fase 3',         type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-tension_frecuencia_colapso' },
      { label: 'Cartografía de tensión 400 kV (12:30–12:32:57) — REE', type: 'Figura',     href: '/docs/anexo-estabilidad-dinamica-tension#fig-mapas_termicos_tension_ree' },
      { label: 'Curvas Q-V de estabilidad en Carmona 400 kV',         type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-fluctuaciones_tension_previas' },
      { label: 'Balance de potencia reactiva a las 12:30 CEST',       type: 'Figura',      href: '/docs/anexo-estabilidad-dinamica-tension#fig-asimetria_balance_reactiva_sur' },
      // Tablas
      { label: 'Inercia del sistema H_tot (2,21–2,71 s)',              type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-inercia-sistema-htot' },
      { label: 'Modos oscilatorios identificados (0,2–0,63 Hz)',       type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-modos-oscilatorios' },
      { label: 'Frecuencia y RoCoF — 27 segundos críticos',           type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-evolucion-frecuencia-rocof' },
      { label: 'Tensiones en nudos críticos durante la cascada',       type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-tensiones-nudos-criticos' },
      { label: 'Maniobras de compensación reactiva ejecutadas por REE',type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-maniobras-compensacion-reactiva' },
      { label: 'Inyección reactiva anómala desde distribución',        type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-inyeccion-reactiva-distribucion' },
      { label: 'Variación de demanda por desconexión de GD (~700 MW)', type: 'Tabla',       href: '/docs/anexo-estabilidad-dinamica-tension#tabla-variacion-demanda-desconexion-gd' },
      // Series
      { label: 'Potencia Disponible por Tecnología (madrugada 28-A)',  type: 'Serie',       href: '/docs/anexo-estabilidad-dinamica-tension#chart-4' },
      { label: 'Actual Generation per Unit — mix real al colapso',     type: 'Serie',       href: '/docs/anexo-estabilidad-dinamica-tension#chart-6' },
      // Interactivos
      { label: 'Caída de frecuencia durante el colapso',               type: 'Interactivo', href: '/docs/anexo-estabilidad-dinamica-tension#grafico-frequency' },
      { label: 'Sismógrafo del colapso — Carmona 400 kV',             type: 'Interactivo', href: '/docs/anexo-estabilidad-dinamica-tension#grafico-sismograph' },
      { label: 'Gráfico fasorial transitorio — divergencia PMU',       type: 'Interactivo', href: '/docs/anexo-estabilidad-dinamica-tension#grafico-phasor' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T3 — Protecciones, cascada y desconexiones
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T3',
    title: 'Protecciones, cascada y desconexiones',
    description: 'Secuencias de disparo, protecciones ANSI/UFLS, cascada de desconexiones y mecanismos de propagación del colapso del 28-A.',
    items: [
      // Figuras
      { label: 'Secuencia de colapso — Acciones Operador vs Automáticas (Albustami)', type: 'Figura', href: '/docs/anexo-cascada-protecciones-desconexiones#fig-albustami_ieee39_secuencia' },
      { label: 'Efecto Tap-Lag — desacoplamiento 400 kV / colector',   type: 'Figura',      href: '/docs/anexo-cascada-protecciones-desconexiones#fig-tap_lag_decoupling' },
      { label: 'Propagación de sobretensiones Fase 2 (12:32–12:33)',   type: 'Figura',      href: '/docs/anexo-cascada-protecciones-desconexiones#fig-heatmap_propagation' },
      { label: 'Propagación geográfica de la cascada — Fase 3',       type: 'Figura',      href: '/docs/anexo-cascada-protecciones-desconexiones#fig-cascada_desconexiones' },
      { label: 'Oscilograma del disparo raíz en Granada (12:32:56)',   type: 'Figura',      href: '/docs/anexo-cascada-protecciones-desconexiones#fig-aluvion_alertas_sobretension_sur' },
      // Tablas
      { label: 'Secuencia de desconexión de generación — zona suroeste', type: 'Tabla',    href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-secuencia-desconexion-suroeste' },
      { label: 'Escalones UFLS aplicados (49,5 → 48,0 Hz)',           type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-escalones-ufls' },
      { label: 'Estado de centrales nucleares durante el colapso',     type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-estado-centrales-nucleares' },
      { label: 'Desconexión de bombeo hidráulico',                     type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-desconexion-bombeo-hidraulica' },
      { label: 'Bombeo desconectado en España (~2.756 MW)',            type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-es' },
      { label: 'Bombeo desconectado en Portugal (~2.098 MW)',          type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-pt' },
      { label: 'Desconexión de demanda por distribuidora (DSO)',       type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-dso-load-shedding' },
      { label: 'Eventos de protección durante la cascada',             type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-eventos-proteccion-maniobras' },
      { label: 'Demanda desconectada en España — 8.505 MW (33,8 %)',  type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-es' },
      { label: 'Demanda desconectada en Portugal — 1.955 MW (33,3 %)',type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-pt' },
      { label: 'Resumen combinado carga desconectada ES + PT',         type: 'Tabla',       href: '/docs/anexo-cascada-protecciones-desconexiones#tabla-load-shedding-es-pt' },
      // Series — precios del día del colapso (actualmente etiquetados T3)
      { label: 'SPOT vs PVPC — evolución de precios 28-29 abril',     type: 'Serie',       href: '/docs/anexo-cascada-protecciones-desconexiones#chart-9' },
      { label: 'Precio Final Desglosado — hora 00:00 CEST 28-A',     type: 'Serie',       href: '/docs/anexo-cascada-protecciones-desconexiones#chart-10' },
      { label: 'Energy Prices Europa — ES y PT 28-29 abril',          type: 'Serie',       href: '/docs/anexo-cascada-protecciones-desconexiones#chart-11' },
      { label: 'Precios de Desvíos en Tiempo Real (€/MWh)',           type: 'Serie',       href: '/docs/anexo-cascada-protecciones-desconexiones#chart-12' },
      // Interactivos
      { label: 'Mapa animado del colapso — propagación geográfica',   type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-map' },
      { label: 'Cronograma del incidente',                              type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-timeline' },
      { label: 'Bucle cascada ANSI 59 — realimentación positiva',     type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-ansi59' },
      { label: 'Anatomía del colapso — 30 segundos',                  type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-sticky-collapse' },
      { label: 'Paradoja del UFLS',                                    type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-ufls' },
      { label: 'Mecanismo Tap-Lag — 5 pasos',                         type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-tap-lag-sequence' },
      { label: 'Indisponibilidad de la red de transporte 400 kV',     type: 'Interactivo', href: '/docs/anexo-cascada-protecciones-desconexiones#grafico-grid-unavailability' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T4 — Interconexiones y flujos transfronterizos
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T4',
    title: 'Interconexiones y flujos transfronterizos',
    description: 'Flujos físicos y programados, frontera ES-FR, enlace HVDC INELFE-1, intercambios con Portugal, Marruecos y papel de las interconexiones en la dinámica del incidente.',
    items: [
      // Figuras
      { label: 'Desviación NTC vs flujo físico real — frontera ES-FR', type: 'Figura',      href: '/docs/anexo-interconexiones-flujos#fig-entsoe_flow_deviation' },
      { label: 'Transición PMODE3 → PMODE1 en INELFE-1 (12:08 CEST)', type: 'Figura',     href: '/docs/anexo-interconexiones-flujos#fig-hvdc_control_transition' },
      { label: 'Inversión de flujos pirenaicos durante Fase 3',        type: 'Figura',      href: '/docs/anexo-interconexiones-flujos#fig-interconexion_francia_colapso' },
      { label: 'Soporte transfronterizo desde Francia en la reposición', type: 'Figura',   href: '/docs/anexo-interconexiones-flujos#fig-evolucion_carga_repuesta_francia' },
      { label: 'Soporte Top-Down desde Marruecos (ONEE)',              type: 'Figura',      href: '/docs/anexo-interconexiones-flujos#fig-intercambio_marruecos_topdown' },
      // Tablas
      { label: 'HVDC Santa Llogaia–Baixas — parámetros operativos',   type: 'Tabla',       href: '/docs/anexo-interconexiones-flujos#tabla-hvdc-santa-llogaia-parametros' },
      { label: 'Intercambios internacionales minuto a minuto T-30/T+30', type: 'Tabla',    href: '/docs/anexo-interconexiones-flujos#tabla-intercambios-internacionales-minuto' },
      { label: 'Maniobras topológicas de Red Eléctrica',               type: 'Tabla',       href: '/docs/anexo-interconexiones-flujos#tabla-re-topological-manoeuvres' },
      // Series
      { label: 'Saldos por Frontera P48 — ES-FR, ES-PT, ES-MA, ES-AD', type: 'Serie',     href: '/docs/anexo-interconexiones-flujos#chart-13' },
      { label: 'Cross-Border Physical Flows — ES-FR y ES-PT',          type: 'Serie',       href: '/docs/anexo-interconexiones-flujos#chart-14' },
      { label: 'Scheduled Commercial Exchanges — ES-FR y ES-PT',       type: 'Serie',       href: '/docs/anexo-interconexiones-flujos#chart-15' },
      { label: 'Subastas Explícitas de Capacidad — ES-FR y ES-PT',     type: 'Serie',       href: '/docs/anexo-interconexiones-flujos#chart-16' },
      { label: 'Forecast Transfer Capacities — 28-29 abril',           type: 'Serie',       href: '/docs/anexo-interconexiones-flujos#chart-17' },
      // Interactivos
      { label: 'Topología de la red ibérica de transporte',             type: 'Interactivo', href: '/docs/anexo-interconexiones-flujos#grafico-topology' },
      { label: 'Dashboard de interconexiones internacionales',          type: 'Interactivo', href: '/docs/anexo-interconexiones-flujos#grafico-interconnection' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T5 — Mercado eléctrico, precios y costes de ajuste
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T5',
    title: 'Mercado eléctrico, precios y costes de ajuste',
    description: 'Precios marginales, PVPC, mercados diario e intradiario, costes de gestión, desvíos y señales económicas asociadas al apagón.',
    items: [
      // Tablas
      { label: 'Precios marginales OMIE 28-A vs 29-A (€/MWh)',        type: 'Tabla',       href: '/docs/anexo-mercado-costes#tabla-precios-marginales-omie' },
      // Series
      { label: 'Current Balancing State — cada 15 min 28-29 abril',   type: 'Serie',       href: '/docs/anexo-mercado-costes#chart-18' },
      { label: 'Imbalance — Volumen MW (cada 15 min)',                 type: 'Serie',       href: '/docs/anexo-mercado-costes#chart-19' },
      { label: 'Imbalance Prices (€/MWh)',                             type: 'Serie',       href: '/docs/anexo-mercado-costes#chart-20' },
      { label: 'FRR Capacity — Reservas MW por trimestre',             type: 'Serie',       href: '/docs/anexo-mercado-costes#chart-21' },
      { label: 'Cost of Congestion Management — España 2025',          type: 'Serie',       href: '/docs/anexo-mercado-costes#chart-22' },
      // Interactivos
      { label: 'Matriz de costes de inacción — OPEX vs CAPEX',        type: 'Interactivo', href: '/docs/anexo-mercado-costes#grafico-matrix' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T6 — Reposición, Black Start y operación de emergencia
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T6',
    title: 'Reposición, Black Start y operación de emergencia',
    description: 'Fragmentación en islas, arranque autónomo, recuperación de demanda, apoyo transfronterizo y cambios de estado durante la restauración del sistema.',
    items: [
      // Figuras
      { label: 'Fragmentación topológica conforme al P.O. 1.6',        type: 'Figura',      href: '/docs/anexo-reposicion-blackstart#fig-islas_reposicion_entsoe' },
      { label: 'Estrategia dual Top-Down (FR + MA) + Bottom-Up (hidro)', type: 'Figura',   href: '/docs/anexo-reposicion-blackstart#fig-estrategia_reenergizacion_dual' },
      { label: 'Intentos de arranque autónomo hidráulico — Fase 4',    type: 'Figura',      href: '/docs/anexo-reposicion-blackstart#fig-black_start_hidroelectrico' },
      { label: 'Desplome y recuperación de la demanda peninsular',     type: 'Figura',      href: '/docs/anexo-reposicion-blackstart#fig-recuperacion_demanda_peninsular' },
      // Tablas
      { label: 'Recuperación de demanda España (0 % → 99,95 % en ~16 h)', type: 'Tabla',  href: '/docs/anexo-reposicion-blackstart#tabla-recuperacion-demanda-espana' },
      { label: 'Tiempos de restauración por isla geográfica',          type: 'Tabla',       href: '/docs/anexo-reposicion-blackstart#tabla-tiempos-restauracion-islas' },
      { label: 'Recuperación de demanda en Portugal (~12 h)',          type: 'Tabla',       href: '/docs/anexo-reposicion-blackstart#tabla-recuperacion-portugal' },
      { label: 'Centrales con capacidad de Black Start activadas',     type: 'Tabla',       href: '/docs/anexo-reposicion-blackstart#tabla-centrales-black-start' },
      { label: 'Cambios de estado ENTSO-E EAS (Normal → Blackout → Restoration)', type: 'Tabla', href: '/docs/anexo-reposicion-blackstart#tabla-eas-state-changes' },
      // Series
      { label: 'Fall-backs y Protocolos de Emergencia — Europa',      type: 'Serie',       href: '/docs/anexo-reposicion-blackstart#chart-23' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T7 — Impacto socioeconómico y resiliencia
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T7',
    title: 'Impacto socioeconómico y resiliencia',
    description: 'Costes económicos, comparación con apagones históricos, efectos en infraestructuras críticas y lecciones de resiliencia sistémica.',
    items: [
      // Tablas
      { label: 'Costes económicos estimados del apagón (200–4.500 M€)', type: 'Tabla',     href: '/docs/anexo-impacto-resiliencia#tabla-costes-economicos' },
      { label: 'Comparativa con blackouts históricos europeos',         type: 'Tabla',       href: '/docs/anexo-impacto-resiliencia#tabla-comparativa-blackouts-historicos' },
      // Interactivos
      { label: 'Auditoría económica — cascada financiera del apagón',  type: 'Interactivo', href: '/docs/anexo-impacto-resiliencia#grafico-waterfall' },
      { label: 'Resiliencia sectorial — recuperación por sector',      type: 'Interactivo', href: '/docs/anexo-impacto-resiliencia#grafico-sectorial-resilience' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T8 — Comunicación, percepción pública y fuentes narrativas
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T8',
    title: 'Comunicación, percepción pública y fuentes narrativas',
    description: 'Evidencia hemerográfica y social sobre la cobertura mediática del apagón, narrativas institucionales y tratamiento internacional del evento.',
    items: [
      // Figuras
      { label: 'Cobertura representativa — postura crítica institucional', type: 'Figura',  href: '/docs/anexo-comunicacion-fuentes#fig-collage_criticos' },
      { label: 'Cobertura representativa — postura favorable a la narrativa oficial', type: 'Figura', href: '/docs/anexo-comunicacion-fuentes#fig-collage_institucional' },
      { label: 'Cobertura internacional del incidente',                  type: 'Figura',      href: '/docs/anexo-comunicacion-fuentes#fig-collage_internacional' },
      { label: 'Publicaciones ciudadanas durante las primeras horas',   type: 'Figura',      href: '/docs/anexo-comunicacion-fuentes#fig-collage_ciudadanos' },
      { label: 'Publicaciones de líderes políticos en X (72 h)',        type: 'Figura',      href: '/docs/anexo-comunicacion-fuentes#fig-collage_politicos' },
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // T9 — Metodología, modelos y datos vivos
  // ─────────────────────────────────────────────────────────────
  {
    id: 'T9',
    title: 'Metodología, modelos y datos vivos',
    description: 'Modelos didácticos, simuladores parametrizados, comparadores operativos y herramientas con componente actualizable. No confundir con registros históricos brutos del 28-A.',
    items: [
      // Figuras
      { label: 'Densidad de cobertura PMU para oscilaciones inter-área', type: 'Figura',   href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-pmu_sensors_europe' },
      { label: 'Evolución geográfica de tensiones 400 kV previa al colapso (IIT-ICAI)', type: 'Figura', href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-scr_iberia' },
      { label: 'Unidades síncronas convencionales acopladas diariamente', type: 'Figura',  href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-conventionalunits' },
      { label: 'Circuitos GFL (seguidor) vs GFM (formador) de red',    type: 'Figura',      href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-gfl_vs_gfm_circuit1' },
      { label: 'Arquitectura híbrida BESS-GFM + compensadores síncronos (Hitachi)', type: 'Figura', href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-hitachi_hybrid' },
      { label: 'Costo mínimo del sistema con remuneración explícita ERS', type: 'Figura',  href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-coste_optimo_ers' },
      { label: 'Banda muerta del P.O. 7.4 — deshabilitaba la defensa', type: 'Figura',     href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-po74_banda_muerta' },
      { label: 'Revenue stacking BESS-GFM (diario, aFRR, inercia, FFR)', type: 'Figura',  href: '/docs/anexo-metodologia-modelos-datos-vivos#fig-ers_revenue_stacking' },
      // Tablas
      { label: 'Comparativa de conclusiones por entidad investigadora', type: 'Tabla',      href: '/docs/anexo-metodologia-modelos-datos-vivos#tabla-comparativa-conclusiones-entidades' },
      { label: 'Matriz Compass Lexecon / INESC TEC — 8 factores',      type: 'Tabla',       href: '/docs/anexo-metodologia-modelos-datos-vivos#tabla-compass-lexecon' },
      // Interactivos
      { label: 'Diagrama de plano de fase GFM vs GFL',                  type: 'Interactivo', href: '/docs/anexo-metodologia-modelos-datos-vivos#grafico-phaseplane' },
      { label: 'Simulador de la ecuación del swing (H, ΔP, FFR)',       type: 'Interactivo', href: '/docs/anexo-metodologia-modelos-datos-vivos#grafico-swing' },
      { label: 'Curva nariz P-V — inestabilidad de tensión',            type: 'Interactivo', href: '/docs/anexo-metodologia-modelos-datos-vivos#grafico-pvcurve' },
      { label: 'Sistema Ahora vs 28-A — comparador en tiempo real',     type: 'Interactivo', href: '/docs/anexo-metodologia-modelos-datos-vivos#grafico-comparador-28a' },
      { label: 'Radar de vulnerabilidad sistémica — 5 ejes',            type: 'Interactivo', href: '/docs/anexo-metodologia-modelos-datos-vivos#grafico-radar-vulnerabilidad' },
    ]
  },
];

export default function AnnexConceptIndex() {
  const goTo = (href) => {
    if (typeof window !== 'undefined') {
      window.location.assign(href);
    }
  };

  return (
    <div className={styles.conceptIndex}>
      <p className={styles.intro}>
        Este índice reúne una selección curada de elementos documentales estructurados en nueve áreas conceptuales.
        Utilice los botones para navegar directamente a las figuras, tablas, interactivos o series correspondientes
        en su anexo de origen.
      </p>

      <div className={styles.grid}>
        {THEMATIC_DATA.map(topic => (
          <div key={topic.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.topicCode}>{topic.id}</span>
              <h3 className={styles.cardTitle}>{topic.title}</h3>
              <p className={styles.cardDesc}>{topic.description}</p>
            </div>
            
            <ul className={styles.itemList}>
              {topic.items.map((item, index) => (
                <li key={index}>
                  <button 
                    type="button" 
                    className={styles.itemButton}
                    onClick={() => goTo(item.href)}
                    aria-label={`Abrir ${item.label} en ${item.type}`}
                  >
                    <span className={styles.itemType}>{item.type}</span>
                    <span className={styles.itemLabel}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
