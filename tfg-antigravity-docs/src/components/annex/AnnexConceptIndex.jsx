import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './AnnexConceptIndex.module.css';

const THEMATIC_DATA_ES = [
  {
    id: 'T1',
    title: 'Demanda, generación y balance eléctrico',
    description: 'Evidencias sobre carga peninsular, mix de generación, potencia disponible, previsiones de demanda y equilibrio operativo del sistema antes, durante y después del 28-A.',
    items: [
      { label: 'Evolución del mix de generación 2010 vs 2024',          type: 'Figura',      href: '/anexo-demanda-generacion-balance#fig-mix_comparativo_2010_2024' },
      { label: 'Capacidad instalada a 31 de enero de 2025',             type: 'Figura',      href: '/anexo-demanda-generacion-balance#fig-capacidad_instalada_2025' },
      { label: 'Perfil de generación 28-A a las 12:30 CEST',           type: 'Figura',      href: '/anexo-demanda-generacion-balance#fig-ree_generation_mix_28april' },
      { label: 'Mix tecnológico durante la re-energización',            type: 'Figura',      href: '/anexo-demanda-generacion-balance#fig-evolucion_mix_reenergizacion' },
      { label: 'Desglose tecnológico del mix a las 12:30 CEST',        type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-mix-generacion-12-30' },
      { label: 'Potencia indisponible por tecnología',                  type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-indisponibilidad-generacion-convencional' },
      { label: 'Precios marginales OMIE 28-A vs 29-A',                 type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-precios-marginales-omie' },
      { label: 'Programa de intercambios internacionales pre-apagón',  type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-programa-intercambios-pre-apagon' },
      { label: 'Previsión vs demanda real España 28-A',                 type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-spanish-demand-forecast' },
      { label: 'Previsión vs demanda real Portugal 28-A',              type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-portuguese-demand-forecast' },
      { label: 'Potencia instalada vs indisponible por tecnología',    type: 'Tabla',       href: '/anexo-demanda-generacion-balance#tabla-unavailable-capacity' },
      { label: 'Demanda Peninsular — real vs programada vs prevista',  type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-1' },
      { label: 'Total Load ES + PT (MTU horario)',                     type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-2' },
      { label: 'Programa de Producción — desglose de mercados',       type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-3' },
      { label: 'Installed Capacity per Type — 121.873 MW',            type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-5' },
      { label: 'Water Reservoirs & Hydro — 15 TWh',                   type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-7' },
      { label: 'CO₂ + Renovables — 91,2 % a las 11:30 CEST',         type: 'Serie',       href: '/anexo-demanda-generacion-balance#chart-8' },
      { label: 'Transición energética y emisiones CO₂',               type: 'Interactivo', href: '/anexo-demanda-generacion-balance#grafico-streamgraph' },
      { label: 'Mix de generación en tiempo real',                     type: 'Interactivo', href: '/anexo-demanda-generacion-balance#grafico-mix-generacion' },
      { label: 'Emisiones vs penetración renovable',                   type: 'Interactivo', href: '/anexo-demanda-generacion-balance#grafico-emissions-renewables' },
    ]
  },
  {
    id: 'T2',
    title: 'Estabilidad dinámica, frecuencia y tensión',
    description: 'Registros de oscilaciones, RoCoF, perfiles de tensión, estabilidad Q-V y comportamiento electromecánico del sistema durante la perturbación.',
    items: [
      { label: 'Desplazamiento de masas rotatorias por IBR (FutuRed)',  type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-futured_grid_evolution' },
      { label: 'Oscilaciones en Núñez de Balboa — 22 de abril',        type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-precursor_overvoltage_22april' },
      { label: 'Frecuencia y tensión en Carmona durante el colapso',   type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-frequency_voltage_carmona' },
      { label: 'Tensiones en Núñez de Balboa — 22, 24 y 28 de abril', type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-nunez_balboa_precursores' },
      { label: 'Oscilación 0,6 Hz detectada por WAMS (12:03 CEST)',   type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-wams_oscilaciones_carmona' },
      { label: 'Evolución acoplada tensión-frecuencia Fase 3',         type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-tension_frecuencia_colapso' },
      { label: 'Cartografía de tensión 400 kV (12:30–12:32:57) — REE', type: 'Figura',     href: '/anexo-estabilidad-dinamica-tension#fig-mapas_termicos_tension_ree' },
      { label: 'Curvas Q-V de estabilidad en Carmona 400 kV',         type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-fluctuaciones_tension_previas' },
      { label: 'Balance de potencia reactiva a las 12:30 CEST',       type: 'Figura',      href: '/anexo-estabilidad-dinamica-tension#fig-asimetria_balance_reactiva_sur' },
      { label: 'Inercia del sistema H_tot (2,21–2,71 s)',              type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-inercia-sistema-htot' },
      { label: 'Modos oscilatorios identificados (0,2–0,63 Hz)',       type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-modos-oscilatorios' },
      { label: 'Frecuencia y RoCoF — 27 segundos críticos',           type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-evolucion-frecuencia-rocof' },
      { label: 'Tensiones en nudos críticos durante la cascada',       type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-tensiones-nudos-criticos' },
      { label: 'Maniobras de compensación reactiva ejecutadas por REE',type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-maniobras-compensacion-reactiva' },
      { label: 'Inyección reactiva anómala desde distribución',        type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-inyeccion-reactiva-distribucion' },
      { label: 'Variación de demanda por desconexión de GD (~700 MW)', type: 'Tabla',       href: '/anexo-estabilidad-dinamica-tension#tabla-variacion-demanda-desconexion-gd' },
      { label: 'Potencia Disponible por Tecnología (madrugada 28-A)',  type: 'Serie',       href: '/anexo-estabilidad-dinamica-tension#chart-4' },
      { label: 'Actual Generation per Unit — mix real al colapso',     type: 'Serie',       href: '/anexo-estabilidad-dinamica-tension#chart-6' },
      { label: 'Caída de frecuencia durante el colapso',               type: 'Interactivo', href: '/anexo-estabilidad-dinamica-tension#grafico-frequency' },
      { label: 'Sismógrafo del colapso — Carmona 400 kV',             type: 'Interactivo', href: '/anexo-estabilidad-dinamica-tension#grafico-sismograph' },
      { label: 'Gráfico fasorial transitorio — divergencia PMU',       type: 'Interactivo', href: '/anexo-estabilidad-dinamica-tension#grafico-phasor' },
    ]
  },
  {
    id: 'T3',
    title: 'Protecciones, cascada y desconexiones',
    description: 'Secuencias de disparo, protecciones ANSI/UFLS, cascada de desconexiones y mecanismos de propagación del colapso del 28-A.',
    items: [
      { label: 'Secuencia de colapso — Acciones Operador vs Automáticas (Albustami)', type: 'Figura', href: '/anexo-cascada-protecciones-desconexiones#fig-albustami_ieee39_secuencia' },
      { label: 'Efecto Tap-Lag — desacoplamiento 400 kV / colector',   type: 'Figura',      href: '/anexo-cascada-protecciones-desconexiones#fig-tap_lag_decoupling' },
      { label: 'Propagación de sobretensiones Fase 2 (12:32–12:33)',   type: 'Figura',      href: '/anexo-cascada-protecciones-desconexiones#fig-heatmap_propagation' },
      { label: 'Propagación geográfica de la cascada — Fase 3',       type: 'Figura',      href: '/anexo-cascada-protecciones-desconexiones#fig-cascada_desconexiones' },
      { label: 'Oscilograma del disparo raíz en Granada (12:32:56)',   type: 'Figura',      href: '/anexo-cascada-protecciones-desconexiones#fig-aluvion_alertas_sobretension_sur' },
      { label: 'Secuencia de desconexión de generación — zona suroeste', type: 'Tabla',    href: '/anexo-cascada-protecciones-desconexiones#tabla-secuencia-desconexion-suroeste' },
      { label: 'Escalones UFLS aplicados (49,5 → 48,0 Hz)',           type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-escalones-ufls' },
      { label: 'Estado de centrales nucleares durante el colapso',     type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-estado-centrales-nucleares' },
      { label: 'Desconexión de bombeo hidráulico',                     type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-desconexion-bombeo-hidraulica' },
      { label: 'Bombeo desconectado en España (~2.756 MW)',            type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-es' },
      { label: 'Bombeo desconectado en Portugal (~2.098 MW)',          type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-pt' },
      { label: 'Desconexión de demanda por distribuidora (DSO)',       type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-dso-load-shedding' },
      { label: 'Eventos de protección durante la cascada',             type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-eventos-proteccion-maniobras' },
      { label: 'Demanda desconectada en España — 8.505 MW (33,8 %)',  type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-es' },
      { label: 'Demanda desconectada en Portugal — 1.955 MW (33,3 %)',type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-pt' },
      { label: 'Resumen combinado carga desconectada ES + PT',         type: 'Tabla',       href: '/anexo-cascada-protecciones-desconexiones#tabla-load-shedding-es-pt' },
      { label: 'SPOT vs PVPC — evolución de precios 28-29 abril',     type: 'Serie',       href: '/anexo-cascada-protecciones-desconexiones#chart-9' },
      { label: 'Precio Final Desglosado — hora 00:00 CEST 28-A',     type: 'Serie',       href: '/anexo-cascada-protecciones-desconexiones#chart-10' },
      { label: 'Energy Prices Europa — ES y PT 28-29 abril',          type: 'Serie',       href: '/anexo-cascada-protecciones-desconexiones#chart-11' },
      { label: 'Precios de Desvíos en Tiempo Real (€/MWh)',           type: 'Serie',       href: '/anexo-cascada-protecciones-desconexiones#chart-12' },
      { label: 'Mapa animado del colapso — propagación geográfica',   type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-map' },
      { label: 'Cronograma del incidente',                              type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-timeline' },
      { label: 'Bucle cascada ANSI 59 — realimentación positiva',     type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-ansi59' },
      { label: 'Anatomía del colapso — 30 segundos',                  type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-sticky-collapse' },
      { label: 'Paradoja del UFLS',                                    type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-ufls' },
      { label: 'Mecanismo Tap-Lag — 5 pasos',                         type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-tap-lag-sequence' },
      { label: 'Indisponibilidad de la red de transporte 400 kV',     type: 'Interactivo', href: '/anexo-cascada-protecciones-desconexiones#grafico-grid-unavailability' },
    ]
  },
  {
    id: 'T4',
    title: 'Interconexiones y flujos transfronterizos',
    description: 'Flujos físicos y programados, frontera ES-FR, enlace HVDC INELFE-1, intercambios con Portugal, Marruecos y papel de las interconexiones en la dinámica del incidente.',
    items: [
      { label: 'Desviación NTC vs flujo físico real — frontera ES-FR', type: 'Figura',      href: '/anexo-interconexiones-flujos#fig-entsoe_flow_deviation' },
      { label: 'Transición PMODE3 → PMODE1 en INELFE-1 (12:08 CEST)', type: 'Figura',     href: '/anexo-interconexiones-flujos#fig-hvdc_control_transition' },
      { label: 'Inversión de flujos pirenaicos durante Fase 3',        type: 'Figura',      href: '/anexo-interconexiones-flujos#fig-interconexion_francia_colapso' },
      { label: 'Soporte transfronterizo desde Francia en la reposición', type: 'Figura',   href: '/anexo-interconexiones-flujos#fig-evolucion_carga_repuesta_francia' },
      { label: 'Soporte Top-Down desde Marruecos (ONEE)',              type: 'Figura',      href: '/anexo-interconexiones-flujos#fig-intercambio_marruecos_topdown' },
      { label: 'HVDC Santa Llogaia–Baixas — parámetros operativos',   type: 'Tabla',       href: '/anexo-interconexiones-flujos#tabla-hvdc-santa-llogaia-parametros' },
      { label: 'Intercambios internacionales minuto a minuto T-30/T+30', type: 'Tabla',    href: '/anexo-interconexiones-flujos#tabla-intercambios-internacionales-minuto' },
      { label: 'Maniobras topológicas de Red Eléctrica',               type: 'Tabla',       href: '/anexo-interconexiones-flujos#tabla-re-topological-manoeuvres' },
      { label: 'Saldos por Frontera P48 — ES-FR, ES-PT, ES-MA, ES-AD', type: 'Serie',     href: '/anexo-interconexiones-flujos#chart-13' },
      { label: 'Cross-Border Physical Flows — ES-FR y ES-PT',          type: 'Serie',       href: '/anexo-interconexiones-flujos#chart-14' },
      { label: 'Scheduled Commercial Exchanges — ES-FR y ES-PT',       type: 'Serie',       href: '/anexo-interconexiones-flujos#chart-15' },
      { label: 'Subastas Explícitas de Capacidad — ES-FR y ES-PT',     type: 'Serie',       href: '/anexo-interconexiones-flujos#chart-16' },
      { label: 'Forecast Transfer Capacities — 28-29 abril',           type: 'Serie',       href: '/anexo-interconexiones-flujos#chart-17' },
      { label: 'Topología de la red ibérica de transporte',             type: 'Interactivo', href: '/anexo-interconexiones-flujos#grafico-topology' },
      { label: 'Dashboard de interconexiones internacionales',          type: 'Interactivo', href: '/anexo-interconexiones-flujos#grafico-interconnection' },
    ]
  },
  {
    id: 'T5',
    title: 'Mercado eléctrico, precios y costes de ajuste',
    description: 'Precios marginales, PVPC, mercados diario e intradiario, costes de gestión, desvíos y señales económicas asociadas al apagón.',
    items: [
      { label: 'Precios marginales OMIE 28-A vs 29-A (€/MWh)',        type: 'Tabla',       href: '/anexo-mercado-costes#tabla-precios-marginales-omie' },
      { label: 'Current Balancing State — cada 15 min 28-29 abril',   type: 'Serie',       href: '/anexo-mercado-costes#chart-18' },
      { label: 'Imbalance — Volumen MW (cada 15 min)',                 type: 'Serie',       href: '/anexo-mercado-costes#chart-19' },
      { label: 'Imbalance Prices (€/MWh)',                             type: 'Serie',       href: '/anexo-mercado-costes#chart-20' },
      { label: 'FRR Capacity — Reservas MW por trimestre',             type: 'Serie',       href: '/anexo-mercado-costes#chart-21' },
      { label: 'Cost of Congestion Management — España 2025',          type: 'Serie',       href: '/anexo-mercado-costes#chart-22' },
      { label: 'Matriz de costes de inacción — OPEX vs CAPEX',        type: 'Interactivo', href: '/anexo-mercado-costes#grafico-matrix' },
    ]
  },
  {
    id: 'T6',
    title: 'Reposición, Black Start y operación de emergencia',
    description: 'Fragmentación en islas, arranque autónomo, recuperación de demanda, apoyo transfronterizo y cambios de estado durante la restauración del sistema.',
    items: [
      { label: 'Fragmentación topológica conforme al P.O. 1.6',        type: 'Figura',      href: '/anexo-reposicion-blackstart#fig-islas_reposicion_entsoe' },
      { label: 'Estrategia dual Top-Down (FR + MA) + Bottom-Up (hidro)', type: 'Figura',   href: '/anexo-reposicion-blackstart#fig-estrategia_reenergizacion_dual' },
      { label: 'Intentos de arranque autónomo hidráulico — Fase 4',    type: 'Figura',      href: '/anexo-reposicion-blackstart#fig-black_start_hidroelectrico' },
      { label: 'Desplome y recuperación de la demanda peninsular',     type: 'Figura',      href: '/anexo-reposicion-blackstart#fig-recuperacion_demanda_peninsular' },
      { label: 'Recuperación de demanda España (0 % → 99,95 % en ~16 h)', type: 'Tabla',  href: '/anexo-reposicion-blackstart#tabla-recuperacion-demanda-espana' },
      { label: 'Tiempos de restauración por isla geográfica',          type: 'Tabla',       href: '/anexo-reposicion-blackstart#tabla-tiempos-restauracion-islas' },
      { label: 'Recuperación de demanda en Portugal (~12 h)',          type: 'Tabla',       href: '/anexo-reposicion-blackstart#tabla-recuperacion-portugal' },
      { label: 'Centrales con capacidad de Black Start activadas',     type: 'Tabla',       href: '/anexo-reposicion-blackstart#tabla-centrales-black-start' },
      { label: 'Cambios de estado ENTSO-E EAS (Normal → Blackout → Restoration)', type: 'Tabla', href: '/anexo-reposicion-blackstart#tabla-eas-state-changes' },
      { label: 'Fall-backs y Protocolos de Emergencia — Europa',      type: 'Serie',       href: '/anexo-reposicion-blackstart#chart-23' },
    ]
  },
  {
    id: 'T7',
    title: 'Impacto socioeconómico y resiliencia',
    description: 'Costes económicos, comparación con apagones históricos, efectos en infraestructuras críticas y lecciones de resiliencia sistémica.',
    items: [
      { label: 'Costes económicos estimados del apagón (200–4.500 M€)', type: 'Tabla',     href: '/anexo-impacto-resiliencia#tabla-costes-economicos' },
      { label: 'Comparativa con blackouts históricos europeos',         type: 'Tabla',       href: '/anexo-impacto-resiliencia#tabla-comparativa-blackouts-historicos' },
      { label: 'Auditoría económica — cascada financiera del apagón',  type: 'Interactivo', href: '/anexo-impacto-resiliencia#grafico-waterfall' },
      { label: 'Resiliencia sectorial — recuperación por sector',      type: 'Interactivo', href: '/anexo-impacto-resiliencia#grafico-sectorial-resilience' },
    ]
  },
  {
    id: 'T8',
    title: 'Comunicación, percepción pública y fuentes narrativas',
    description: 'Evidencia hemerográfica y social sobre la cobertura mediática del apagón, narrativas institucionales y tratamiento internacional del evento.',
    items: [
      { label: 'Cobertura representativa — postura crítica institucional', type: 'Figura',  href: '/anexo-comunicacion-fuentes#fig-collage_criticos' },
      { label: 'Cobertura representativa — postura favorable a la narrativa oficial', type: 'Figura', href: '/anexo-comunicacion-fuentes#fig-collage_institucional' },
      { label: 'Cobertura internacional del incidente',                  type: 'Figura',      href: '/anexo-comunicacion-fuentes#fig-collage_internacional' },
      { label: 'Publicaciones ciudadanas durante las primeras horas',   type: 'Figura',      href: '/anexo-comunicacion-fuentes#fig-collage_ciudadanos' },
      { label: 'Publicaciones de líderes políticos en X (72 h)',        type: 'Figura',      href: '/anexo-comunicacion-fuentes#fig-collage_politicos' },
    ]
  },
  {
    id: 'T9',
    title: 'Metodología, modelos y datos vivos',
    description: 'Modelos didácticos, simuladores parametrizados, comparadores operativos y herramientas con componente actualizable. No confundir con registros históricos brutos del 28-A.',
    items: [
      { label: 'Densidad de cobertura PMU para oscilaciones inter-área', type: 'Figura',   href: '/anexo-metodologia-modelos-datos-vivos#fig-pmu_sensors_europe' },
      { label: 'Evolución geográfica de tensiones 400 kV previa al colapso (IIT-ICAI)', type: 'Figura', href: '/anexo-metodologia-modelos-datos-vivos#fig-scr_iberia' },
      { label: 'Unidades síncronas convencionales acopladas diariamente', type: 'Figura',  href: '/anexo-metodologia-modelos-datos-vivos#fig-conventionalunits' },
      { label: 'Circuitos GFL (seguidor) vs GFM (formador) de red',    type: 'Figura',      href: '/anexo-metodologia-modelos-datos-vivos#fig-gfl_vs_gfm_circuit1' },
      { label: 'Arquitectura híbrida BESS-GFM + compensadores síncronos (Hitachi)', type: 'Figura', href: '/anexo-metodologia-modelos-datos-vivos#fig-hitachi_hybrid' },
      { label: 'Costo mínimo del sistema con remuneración explícita ERS', type: 'Figura',  href: '/anexo-metodologia-modelos-datos-vivos#fig-coste_optimo_ers' },
      { label: 'Banda muerta del P.O. 7.4 — deshabilitaba la defensa', type: 'Figura',     href: '/anexo-metodologia-modelos-datos-vivos#fig-po74_banda_muerta' },
      { label: 'Revenue stacking BESS-GFM (diario, aFRR, inercia, FFR)', type: 'Figura',  href: '/anexo-metodologia-modelos-datos-vivos#fig-ers_revenue_stacking' },
      { label: 'Comparativa de conclusiones por entidad investigadora', type: 'Tabla',      href: '/anexo-metodologia-modelos-datos-vivos#tabla-comparativa-conclusiones-entidades' },
      { label: 'Matriz Compass Lexecon / INESC TEC — 8 factores',      type: 'Tabla',       href: '/anexo-metodologia-modelos-datos-vivos#tabla-compass-lexecon' },
      { label: 'Diagrama de plano de fase GFM vs GFL',                  type: 'Interactivo', href: '/anexo-metodologia-modelos-datos-vivos#grafico-phaseplane' },
      { label: 'Simulador de la ecuación del swing (H, ΔP, FFR)',       type: 'Interactivo', href: '/anexo-metodologia-modelos-datos-vivos#grafico-swing' },
      { label: 'Curva nariz P-V — inestabilidad de tensión',            type: 'Interactivo', href: '/anexo-metodologia-modelos-datos-vivos#grafico-pvcurve' },
      { label: 'Sistema Ahora vs 28-A — comparador en tiempo real',     type: 'Interactivo', href: '/anexo-metodologia-modelos-datos-vivos#grafico-comparador-28a' },
      { label: 'Radar de vulnerabilidad sistémica — 5 ejes',            type: 'Interactivo', href: '/anexo-metodologia-modelos-datos-vivos#grafico-radar-vulnerabilidad' },
    ]
  },
];

const THEMATIC_DATA_EN = [
  {
    id: 'T1',
    title: 'Demand, generation, and electrical balance',
    description: 'Evidence on peninsular load, generation mix, available capacity, demand forecasts, and operational balance of the system before, during, and after April 28.',
    items: [
      { label: 'Evolution of the generation mix 2010 vs 2024',          type: 'Figure',      href: '/anexo-demanda-generacion-balance#fig-mix_comparativo_2010_2024' },
      { label: 'Installed capacity as of January 31, 2025',             type: 'Figure',      href: '/anexo-demanda-generacion-balance#fig-capacidad_instalada_2025' },
      { label: 'Generation profile on April 28 at 12:30 CEST',           type: 'Figure',      href: '/anexo-demanda-generacion-balance#fig-ree_generation_mix_28april' },
      { label: 'Technological mix during re-energization',            type: 'Figure',      href: '/anexo-demanda-generacion-balance#fig-evolucion_mix_reenergizacion' },
      { label: 'Technological breakdown of the mix at 12:30 CEST',        type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-mix-generacion-12-30' },
      { label: 'Unavailable power by technology',                  type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-indisponibilidad-generacion-convencional' },
      { label: 'OMIE marginal prices April 28 vs 29',                 type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-precios-marginales-omie' },
      { label: 'International exchange schedule pre-blackout',  type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-programa-intercambios-pre-apagon' },
      { label: 'Forecast vs. real demand Spain April 28',                 type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-spanish-demand-forecast' },
      { label: 'Forecast vs. real demand Portugal April 28',              type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-portuguese-demand-forecast' },
      { label: 'Installed vs. unavailable capacity by technology',    type: 'Table',       href: '/anexo-demanda-generacion-balance#tabla-unavailable-capacity' },
      { label: 'Peninsular Demand — actual vs. scheduled vs. forecast',  type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-1' },
      { label: 'Total Load ES + PT (hourly MTU)',                     type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-2' },
      { label: 'Production Program — market breakdown',       type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-3' },
      { label: 'Installed Capacity per Type — 121,873 MW',            type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-5' },
      { label: 'Water Reservoirs & Hydro — 15 TWh',                   type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-7' },
      { label: 'CO₂ + Renewables — 91.2% at 11:30 CEST',         type: 'Series',       href: '/anexo-demanda-generacion-balance#chart-8' },
      { label: 'Energy transition and CO₂ emissions',               type: 'Interactive', href: '/anexo-demanda-generacion-balance#grafico-streamgraph' },
      { label: 'Real-time generation mix',                     type: 'Interactive', href: '/anexo-demanda-generacion-balance#grafico-mix-generacion' },
      { label: 'Emissions vs. renewable penetration',                   type: 'Interactive', href: '/anexo-demanda-generacion-balance#grafico-emissions-renewables' },
    ]
  },
  {
    id: 'T2',
    title: 'Dynamic stability, frequency, and voltage',
    description: 'Records of oscillations, RoCoF, voltage profiles, Q-V stability, and electromechanical behavior of the system during the disturbance.',
    items: [
      { label: 'Displacement of rotating masses by IBR (FutuRed)',  type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-futured_grid_evolution' },
      { label: 'Oscillations in Núñez de Balboa — April 22',        type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-precursor_overvoltage_22april' },
      { label: 'Frequency and voltage in Carmona during the collapse',   type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-frequency_voltage_carmona' },
      { label: 'Voltages in Núñez de Balboa — April 22, 24, and 28', type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-nunez_balboa_precursores' },
      { label: '0.6 Hz oscillation detected by WAMS (12:03 CEST)',   type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-wams_oscilaciones_carmona' },
      { label: 'Coupled voltage-frequency evolution Phase 3',         type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-tension_frecuencia_colapso' },
      { label: '400 kV voltage cartography (12:30–12:32:57) — REE', type: 'Figure',     href: '/anexo-estabilidad-dinamica-tension#fig-mapas_termicos_tension_ree' },
      { label: 'Q-V stability curves at Carmona 400 kV',         type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-fluctuaciones_tension_previas' },
      { label: 'Reactive power balance at 12:30 CEST',       type: 'Figure',      href: '/anexo-estabilidad-dinamica-tension#fig-asimetria_balance_reactiva_sur' },
      { label: 'System inertia H_tot (2.21–2.71 s)',              type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-inercia-sistema-htot' },
      { label: 'Identified oscillatory modes (0.2–0.63 Hz)',       type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-modos-oscilatorios' },
      { label: 'Frequency and RoCoF — 27 critical seconds',           type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-evolucion-frecuencia-rocof' },
      { label: 'Voltages at critical nodes during the cascade',       type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-tensiones-nudos-criticos' },
      { label: 'Reactive compensation maneuvers executed by REE',type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-maniobras-compensacion-reactiva' },
      { label: 'Anomalous reactive injection from distribution',        type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-inyeccion-reactiva-distribucion' },
      { label: 'Demand variation due to DG disconnection (~700 MW)', type: 'Table',       href: '/anexo-estabilidad-dinamica-tension#tabla-variacion-demanda-desconexion-gd' },
      { label: 'Available Power by Technology (early morning April 28)',  type: 'Series',       href: '/anexo-estabilidad-dinamica-tension#chart-4' },
      { label: 'Actual Generation per Unit — real mix at collapse',     type: 'Series',       href: '/anexo-estabilidad-dinamica-tension#chart-6' },
      { label: 'Frequency drop during collapse',               type: 'Interactive', href: '/anexo-estabilidad-dinamica-tension#grafico-frequency' },
      { label: 'Collapse seismograph — Carmona 400 kV',             type: 'Interactive', href: '/anexo-estabilidad-dinamica-tension#grafico-sismograph' },
      { label: 'Transient phasor plot — PMU divergence',       type: 'Interactive', href: '/anexo-estabilidad-dinamica-tension#grafico-phasor' },
    ]
  },
  {
    id: 'T3',
    title: 'Protections, cascade, and disconnections',
    description: 'Trip sequences, ANSI/UFLS protections, cascade disconnections, and propagation mechanisms of the April 28 collapse.',
    items: [
      { label: 'Collapse sequence — Operator vs. Automatic Actions (Albustami)', type: 'Figure', href: '/anexo-cascada-protecciones-desconexiones#fig-albustami_ieee39_secuencia' },
      { label: 'Tap-Lag Effect — 400 kV / collector decoupling',   type: 'Figure',      href: '/anexo-cascada-protecciones-desconexiones#fig-tap_lag_decoupling' },
      { label: 'Overvoltage propagation Phase 2 (12:32–12:33)',   type: 'Figure',      href: '/anexo-cascada-protecciones-desconexiones#fig-heatmap_propagation' },
      { label: 'Geographical propagation of the cascade — Phase 3',       type: 'Figure',      href: '/anexo-cascada-protecciones-desconexiones#fig-cascada_desconexiones' },
      { label: 'Oscillogram of the root trip in Granada (12:32:56)',   type: 'Figure',      href: '/anexo-cascada-protecciones-desconexiones#fig-aluvion_alertas_sobretension_sur' },
      { label: 'Generation disconnection sequence — southwestern zone', type: 'Table',    href: '/anexo-cascada-protecciones-desconexiones#tabla-secuencia-desconexion-suroeste' },
      { label: 'Applied UFLS steps (49.5 → 48.0 Hz)',           type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-escalones-ufls' },
      { label: 'Nuclear power plants status during the collapse',     type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-estado-centrales-nucleares' },
      { label: 'Hydroelectric pumping disconnection',                     type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-desconexion-bombeo-hidraulica' },
      { label: 'Pumping disconnected in Spain (~2,756 MW)',            type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-es' },
      { label: 'Pumping disconnected in Portugal (~2,098 MW)',          type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-pump-storage-pt' },
      { label: 'Demand disconnection by distributor (DSO)',       type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-dso-load-shedding' },
      { label: 'Protection events during the cascade',             type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-eventos-proteccion-maniobras' },
      { label: 'Demand disconnected in Spain — 8,505 MW (33.8%)',  type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-es' },
      { label: 'Demand disconnected in Portugal — 1,955 MW (33.3%)',type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-demand-shedding-pt' },
      { label: 'Combined summary of disconnected load ES + PT',         type: 'Table',       href: '/anexo-cascada-protecciones-desconexiones#tabla-load-shedding-es-pt' },
      { label: 'SPOT vs. PVPC — price evolution April 28–29',     type: 'Series',       href: '/anexo-cascada-protecciones-desconexiones#chart-9' },
      { label: 'Final Price Breakdown — 00:00 CEST April 28',     type: 'Series',       href: '/anexo-cascada-protecciones-desconexiones#chart-10' },
      { label: 'Energy Prices Europe — ES and PT April 28–29',          type: 'Series',       href: '/anexo-cascada-protecciones-desconexiones#chart-11' },
      { label: 'Real-time Deviation Prices (€/MWh)',           type: 'Series',       href: '/anexo-cascada-protecciones-desconexiones#chart-12' },
      { label: 'Animated map of the collapse — geographical propagation',   type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-map' },
      { label: 'Incident timeline',                              type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-timeline' },
      { label: 'ANSI 59 cascade loop — positive feedback',     type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-ansi59' },
      { label: 'Anatomy of the collapse — 30 seconds',                  type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-sticky-collapse' },
      { label: 'UFLS paradox',                                    type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-ufls' },
      { label: 'Tap-Lag mechanism — 5 steps',                         type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-tap-lag-sequence' },
      { label: 'Grid unavailability of the 400 kV transmission network',     type: 'Interactive', href: '/anexo-cascada-protecciones-desconexiones#grafico-grid-unavailability' },
    ]
  },
  {
    id: 'T4',
    title: 'Interconnections and cross-border flows',
    description: 'Physical and scheduled flows, ES-FR border, INELFE-1 HVDC link, exchanges with Portugal, Morocco, and the role of interconnections in the incident dynamics.',
    items: [
      { label: 'Deviation of NTC vs. actual physical flow — ES-FR border', type: 'Figure',      href: '/anexo-interconexiones-flujos#fig-entsoe_flow_deviation' },
      { label: 'INELFE-1 PMODE3 → PMODE1 transition (12:08 CEST)', type: 'Figure',     href: '/anexo-interconexiones-flujos#fig-hvdc_control_transition' },
      { label: 'Reversal of Pyrenean flows during Phase 3',        type: 'Figure',      href: '/anexo-interconexiones-flujos#fig-interconexion_francia_colapso' },
      { label: 'Cross-border support from France in the restoration', type: 'Figure',   href: '/anexo-interconexiones-flujos#fig-evolucion_carga_repuesta_francia' },
      { label: 'Top-Down support from Morocco (ONEE)',              type: 'Figure',      href: '/anexo-interconexiones-flujos#fig-intercambio_marruecos_topdown' },
      { label: 'HVDC Santa Llogaia–Baixas — operating parameters',   type: 'Table',       href: '/anexo-interconexiones-flujos#tabla-hvdc-santa-llogaia-parametros' },
      { label: 'International exchanges minute-by-minute T-30/T+30', type: 'Table',    href: '/anexo-interconexiones-flujos#tabla-intercambios-internacionales-minuto' },
      { label: 'Topological maneuvers of Red Eléctrica',               type: 'Table',       href: '/anexo-interconexiones-flujos#tabla-re-topological-manoeuvres' },
      { label: 'Border Net Flows P48 — ES-FR, ES-PT, ES-MA, ES-AD', type: 'Series',     href: '/anexo-interconexiones-flujos#chart-13' },
      { label: 'Cross-Border Physical Flows — ES-FR and ES-PT',          type: 'Series',       href: '/anexo-interconexiones-flujos#chart-14' },
      { label: 'Scheduled Commercial Exchanges — ES-FR and ES-PT',       type: 'Series',       href: '/anexo-interconexiones-flujos#chart-15' },
      { label: 'Explicit Capacity Auctions — ES-FR and ES-PT',     type: 'Series',       href: '/anexo-interconexiones-flujos#chart-16' },
      { label: 'Forecast Transfer Capacities — April 28–29',           type: 'Series',       href: '/anexo-interconexiones-flujos#chart-17' },
      { label: 'Topology of the Iberian transmission network',             type: 'Interactive', href: '/anexo-interconexiones-flujos#grafico-topology' },
      { label: 'International interconnections dashboard',          type: 'Interactive', href: '/anexo-interconexiones-flujos#grafico-interconnection' },
    ]
  },
  {
    id: 'T5',
    title: 'Electricity market, prices, and adjustment costs',
    description: 'Marginal prices, PVPC, daily and intraday markets, congestion management costs, deviations, and economic signals associated with the blackout.',
    items: [
      { label: 'OMIE marginal prices April 28 vs 29 (€/MWh)',        type: 'Table',       href: '/anexo-mercado-costes#tabla-precios-marginales-omie' },
      { label: 'Current Balancing State — every 15 min April 28–29',   type: 'Series',       href: '/anexo-mercado-costes#chart-18' },
      { label: 'Imbalance — Volume MW (every 15 min)',                 type: 'Series',       href: '/anexo-mercado-costes#chart-19' },
      { label: 'Imbalance Prices (€/MWh)',                             type: 'Series',       href: '/anexo-mercado-costes#chart-20' },
      { label: 'FRR Capacity — Reserves MW per quarter',             type: 'Series',       href: '/anexo-mercado-costes#chart-21' },
      { label: 'Cost of Congestion Management — Spain 2025',          type: 'Series',       href: '/anexo-mercado-costes#chart-22' },
      { label: 'Inaction cost matrix — OPEX vs. CAPEX',        type: 'Interactive', href: '/anexo-mercado-costes#grafico-matrix' },
    ]
  },
  {
    id: 'T6',
    title: 'Restoration, Black Start, and emergency operation',
    description: 'Fragmentation into islands, autonomous start-up, demand recovery, cross-border support, and state transitions during system restoration.',
    items: [
      { label: 'Topological fragmentation according to P.O. 1.6',        type: 'Figure',      href: '/anexo-reposicion-blackstart#fig-islas_reposicion_entsoe' },
      { label: 'Dual strategy Top-Down (FR + MA) + Bottom-Up (hydro)', type: 'Figure',   href: '/anexo-reposicion-blackstart#fig-estrategia_reenergizacion_dual' },
      { label: 'Hydraulic Black Start attempts — Phase 4',    type: 'Figure',      href: '/anexo-reposicion-blackstart#fig-black_start_hidroelectrico' },
      { label: 'Collapse and recovery of peninsular demand',     type: 'Figure',      href: '/anexo-reposicion-blackstart#fig-recuperacion_demanda_peninsular' },
      { label: 'Demand recovery Spain (0% → 99.95% in ~16 h)', type: 'Table',  href: '/anexo-reposicion-blackstart#tabla-recuperacion-demanda-espana' },
      { label: 'Restoration times by geographical island',          type: 'Table',       href: '/anexo-reposicion-blackstart#tabla-tiempos-restauracion-islas' },
      { label: 'Demand recovery in Portugal (~12 h)',          type: 'Table',       href: '/anexo-reposicion-blackstart#tabla-recuperacion-portugal' },
      { label: 'Black Start plants activated',     type: 'Table',       href: '/anexo-reposicion-blackstart#tabla-centrales-black-start' },
      { label: 'ENTSO-E EAS state changes (Normal → Blackout → Restoration)', type: 'Table', href: '/anexo-reposicion-blackstart#tabla-eas-state-changes' },
      { label: 'Fall-backs and Emergency Protocols — Europe',      type: 'Series',       href: '/anexo-reposicion-blackstart#chart-23' },
    ]
  },
  {
    id: 'T7',
    title: 'Socioeconomic impact and resilience',
    description: 'Economic costs, comparison with historical blackouts, effects on critical infrastructure, and systemic resilience lessons.',
    items: [
      { label: 'Estimated economic costs of the blackout (€200–4,500 M)', type: 'Table',     href: '/anexo-impacto-resiliencia#tabla-costes-economicos' },
      { label: 'Comparison with historical European blackouts',         type: 'Table',       href: '/anexo-impacto-resiliencia#tabla-comparativa-blackouts-historicos' },
      { label: 'Economic audit — financial cascade of the blackout',  type: 'Interactive', href: '/anexo-impacto-resiliencia#grafico-waterfall' },
      { label: 'Sectoral resilience — recovery by sector',      type: 'Interactive', href: '/anexo-impacto-resiliencia#grafico-sectorial-resilience' },
    ]
  },
  {
    id: 'T8',
    title: 'Communication, public perception, and narrative sources',
    description: 'Press and social media evidence on blackout media coverage, institutional narratives, and international treatment of the event.',
    items: [
      { label: 'Representative coverage — institutional critical posture', type: 'Figure',  href: '/anexo-comunicacion-fuentes#fig-collage_criticos' },
      { label: 'Representative coverage — posture favoring the official narrative', type: 'Figure', href: '/anexo-comunicacion-fuentes#fig-collage_institucional' },
      { label: 'International coverage of the incident',                  type: 'Figure',      href: '/anexo-comunicacion-fuentes#fig-collage_internacional' },
      { label: 'Citizen publications during the first hours',   type: 'Figure',      href: '/anexo-comunicacion-fuentes#fig-collage_ciudadanos' },
      { label: 'Political leaders posts on X (72 h)',        type: 'Figure',      href: '/anexo-comunicacion-fuentes#fig-collage_politicos' },
    ]
  },
  {
    id: 'T9',
    title: 'Methodology, models, and live data',
    description: 'Educational models, parameterized simulators, operational comparators, and tools with updatable components. Do not confuse with raw historical records of April 28.',
    items: [
      { label: 'PMU coverage density for inter-area oscillations', type: 'Figure',   href: '/anexo-metodologia-modelos-datos-vivos#fig-pmu_sensors_europe' },
      { label: 'Geographical evolution of 400 kV voltages prior to collapse (IIT-ICAI)', type: 'Figure', href: '/anexo-metodologia-modelos-datos-vivos#fig-scr_iberia' },
      { label: 'Conventional synchronous units coupled daily', type: 'Figure',  href: '/anexo-metodologia-modelos-datos-vivos#fig-conventionalunits' },
      { label: 'GFL (following) vs. GFM (forming) grid circuits',    type: 'Figure',      href: '/anexo-metodologia-modelos-datos-vivos#fig-gfl_vs_gfm_circuit1' },
      { label: 'Hybrid BESS-GFM + synchronous compensators architecture (Hitachi)', type: 'Figure', href: '/anexo-metodologia-modelos-datos-vivos#fig-hitachi_hybrid' },
      { label: 'Minimum system cost with explicit ERS remuneration', type: 'Figure',  href: '/anexo-metodologia-modelos-datos-vivos#fig-coste_optimo_ers' },
      { label: 'P.O. 7.4 deadband — disabled the defense', type: 'Figure',     href: '/anexo-metodologia-modelos-datos-vivos#fig-po74_banda_muerta' },
      { label: 'BESS-GFM revenue stacking (day-ahead, aFRR, inertia, FFR)', type: 'Figure',  href: '/anexo-metodologia-modelos-datos-vivos#fig-ers_revenue_stacking' },
      { label: 'Comparison of conclusions by investigating entity', type: 'Table',      href: '/anexo-metodologia-modelos-datos-vivos#tabla-comparativa-conclusiones-entidades' },
      { label: 'Compass Lexecon / INESC TEC matrix — 8 factors',      type: 'Table',       href: '/anexo-metodologia-modelos-datos-vivos#tabla-compass-lexecon' },
      { label: 'GFM vs. GFL phase plane diagram',                  type: 'Interactive', href: '/anexo-metodologia-modelos-datos-vivos#grafico-phaseplane' },
      { label: 'Swing equation simulator (H, ΔP, FFR)',       type: 'Interactive', href: '/anexo-metodologia-modelos-datos-vivos#grafico-swing' },
      { label: 'P-V nose curve — voltage instability',            type: 'Interactive', href: '/anexo-metodologia-modelos-datos-vivos#grafico-pvcurve' },
      { label: 'System Now vs. 28-A — real-time comparator',     type: 'Interactive', href: '/anexo-metodologia-modelos-datos-vivos#grafico-comparador-28a' },
      { label: 'Systemic vulnerability radar — 5 axes',            type: 'Interactive', href: '/anexo-metodologia-modelos-datos-vivos#grafico-radar-vulnerabilidad' },
    ]
  },
];

const TRANSLATIONS = {
  es: {
    intro: 'Este índice reúne una selección curada de elementos documentales estructurados en nueve áreas conceptuales. Utilice los botones para navegar directamente a las figuras, tablas, interactivos o series correspondientes en su anexo de origen.',
    ariaLabel: 'Abrir {label} en {type}',
  },
  en: {
    intro: 'This index gathers a curated selection of documentary elements structured in nine conceptual areas. Use the buttons to navigate directly to the corresponding figures, tables, interactives, or series in their source annex.',
    ariaLabel: 'Open {label} in {type}',
  },
  de: {
    intro: 'Dieser Index fasst eine kuratierte Auswahl von Dokumentationselementen zusammen, die in neun konzeptuelle Bereiche unterteilt sind. Verwenden Sie die Schaltflächen, um direkt zu den entsprechenden Abbildungen, Tabellen, interaktiven Inhalten oder Zeitreihen in ihrem Herkunftsanhang zu gelangen.',
    ariaLabel: '{label} in {type} öffnen',
  },
  'zh-Hans': {
    intro: '本索引收录了九个概念领域的文献实证要素。使用按钮可直接跳转至其源附录中的对应图、表、交互模块或时间序列。',
    ariaLabel: '在 {type} 中打开 {label}',
  }
};

export default function AnnexConceptIndex() {
  const { i18n } = useDocusaurusContext();
  const currentLocale = i18n.currentLocale || 'es';
  const isEn = currentLocale === 'en' || currentLocale === 'de' || currentLocale === 'zh-Hans';
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.es;
  const thematicData = isEn ? THEMATIC_DATA_EN : THEMATIC_DATA_ES;
  const baseUrl = useBaseUrl('/');

  const getLocalizedHref = (href) => {
    const prefix = currentLocale === 'es' ? '' : `/${currentLocale}`;
    return `${baseUrl.replace(/\/$/, '')}${`${prefix}${href}`.replace(/\/+/g, '/')}`;
  };

  return (
    <div className={styles.conceptIndex}>
      <p className={styles.intro}>
        {t.intro}
      </p>

      <div className={styles.grid}>
        {thematicData.map(topic => (
          <section key={topic.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.topicCode}>{topic.id}</span>
              <h3 className={styles.cardTitle}>{topic.title}</h3>
              <p className={styles.cardDesc}>{topic.description}</p>
              <span className={styles.topicCount}>{topic.items.length} evidencias</span>
            </div>
            
            <ul className={styles.itemList}>
              {topic.items.map((item, index) => {
                const labelText = t.ariaLabel.replace('{label}', item.label).replace('{type}', item.type);
                return (
                  <li key={index}>
                    <a
                      className={styles.itemLink}
                      href={getLocalizedHref(item.href)}
                      aria-label={labelText}
                    >
                      <span className={styles.itemType}>{item.type}</span>
                      <span className={styles.itemLabel}>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
