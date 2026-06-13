# Volcado integral de contexto — Web TFG Docusaurus/React

## 1. Propósito del volcado

Este paquete recopila la estructura, contenido académico, componentes React, estilos, datos, rutas, sistema de anexos y chatbot RAG de la web para permitir una auditoría externa completa.

## 2. Estructura general del proyecto (Archivos Activos)

```text
tfg-antigravity-docs/
├── api
│   ├── chat.js
│   ├── entsoe-frequency.js
│   ├── entsoe.js
│   ├── esios
│   │   └── esios-snapshot.js
│   ├── esios-analysis.js
│   ├── esios-multi.js
│   ├── esios-proxy.js
│   ├── figure-context.js
│   └── redata-proxy.js
├── babel.config.js
├── docs
│   ├── 01-introduccion.mdx
│   ├── 02-contexto.mdx
│   ├── 03-analisis-incidente.mdx
│   ├── 04-reaccion-reposicion.mdx
│   ├── 05-analisis-informes.mdx
│   ├── 06-impacto-comunicativo.mdx
│   ├── 07-resiliencia-futuro.mdx
│   ├── 07b-consecuencias-financieras.mdx
│   ├── 08-uso-ia.mdx
│   ├── 08.5-actualizacion-2026.mdx
│   ├── 09-conclusiones.mdx
│   ├── 10-resumen-de-cifras.mdx
│   ├── 13-sobre-el-autor.mdx
│   ├── anexo-cascada-protecciones-desconexiones.mdx
│   ├── anexo-comunicacion-fuentes.mdx
│   ├── anexo-demanda-generacion-balance.mdx
│   ├── anexo-ecuaciones-matematicas.mdx
│   ├── anexo-estabilidad-dinamica-tension.mdx
│   ├── anexo-impacto-resiliencia.mdx
│   ├── anexo-interconexiones-flujos.mdx
│   ├── anexo-mercado-costes.mdx
│   ├── anexo-metodologia-modelos-datos-vivos.mdx
│   ├── anexo-reposicion-blackstart.mdx
│   ├── datos-tiempo-real
│   │   ├── balance-intercambios.mdx
│   │   ├── demanda-renovable.mdx
│   │   ├── index.mdx
│   │   ├── mix-generacion.mdx
│   │   ├── precio-spot.mdx
│   │   ├── radar-vulnerabilidad.mdx
│   │   └── termometro-riesgo.mdx
│   ├── dimension-europea
│   │   ├── 01-francia-portugal.mdx
│   │   ├── 02-coordinacion-continental.mdx
│   │   ├── 03-dia-despues.mdx
│   ├── glosario.mdx
│   ├── impacto-social.mdx
│   └── referencias.mdx
├── docusaurus.config.js
├── package.json
├── scripts
│   ├── build-index.js
├── sidebars.js
├── src
│   ├── components
│   │   ├── ANSI59Cascade
│   │   │   ├── index.jsx
│   │   ├── AnimatedRestorationMap.jsx
│   │   ├── AuthorProfile.jsx
│   │   ├── BESSBoomChart.jsx
│   │   ├── BESSBoomChart.module.css
│   │   ├── BalanceIntercambios.jsx
│   │   ├── BiblioCard.jsx
│   │   ├── BiblioCard.module.css
│   │   ├── BlackoutPropagationMap.jsx
│   │   ├── BlackoutPropagationMapBase.jsx
│   │   ├── BlackoutTimeline
│   │   │   └── BlackoutTimeline.jsx
│   │   ├── CNMCSanctionsChart.jsx
│   │   ├── CNMCSanctionsChart.module.css
│   │   ├── ChartCard.jsx
│   │   ├── ChartCard.module.css
│   │   ├── ChatFullscreen.jsx
│   │   ├── ChatWidget.jsx
│   │   ├── CollapseSismograph.jsx
│   │   ├── CollapseSismograph.module.css
│   │   ├── Collapsible.jsx
│   │   ├── CommandArchitectureGraph.jsx
│   │   ├── CommandArchitectureGraph.module.css
│   │   ├── Comparador28A.jsx
│   │   ├── ConsensusMatrix.jsx
│   │   ├── ConsensusMatrix.module.css
│   │   ├── CoordinationTimeline.jsx
│   │   ├── CoordinationTimeline.module.css
│   │   ├── CrisisTimelineDual.jsx
│   │   ├── CrisisTimelineDual.module.css
│   │   ├── CuestionAbierta
│   │   │   ├── index.jsx
│   │   ├── DatosTiempoRealGrid.jsx
│   │   ├── DemandaRenovableTrend.jsx
│   │   ├── DynamicSecurityShift.jsx
│   │   ├── DynamicSecurityShift.module.css
│   │   ├── EASStateTransition.jsx
│   │   ├── EASStateTransition.module.css
│   │   ├── EmissionsVsRenewablesChart.jsx
│   │   ├── EnergyTransitionStreamgraph.jsx
│   │   ├── EnergyTransitionStreamgraph.module.css
│   │   ├── EnergyTransitionStreamgraphBase.jsx
│   │   ├── EnergyTrilemmaSimulator
│   │   │   ├── index.jsx
│   │   ├── EntsoeCharts
│   │   │   ├── ActualGenerationChart.jsx
│   │   │   ├── CostCongestionChart.jsx
│   │   │   ├── CrossBorderFlowsChart.jsx
│   │   │   ├── CurrentBalancingStateChart.jsx
│   │   │   ├── EnergyPricesChart.jsx
│   │   │   ├── FallbacksChart.jsx
│   │   │   ├── ForecastTransferChart.jsx
│   │   │   ├── FrrCapacityChart.jsx
│   │   │   ├── HydroReservoirChart.jsx
│   │   │   ├── ImbalanceChart.jsx
│   │   │   ├── ImbalancePricesChart.jsx
│   │   │   ├── InstalledCapacityChart.jsx
│   │   │   ├── ScheduledCommercialExchangesChart.jsx
│   │   │   └── TotalLoadChart.jsx
│   │   ├── EsiosCharts
│   │   │   ├── DemandaChart.jsx
│   │   │   ├── EsiosCharts.module.css
│   │   ├── FaultTreeCollapseFigure
│   │   │   ├── FaultTreeCollapseFigure.jsx
│   │   │   └── FaultTreeCollapseFigure.module.css
│   │   ├── FerrantiCapacitiveLineSimulator
│   │   │   ├── FerrantiCapacitiveLineSimulator.jsx
│   │   │   └── FerrantiCapacitiveLineSimulator.module.css
│   │   ├── FinancialWaterfallChart.jsx
│   │   ├── FinancialWaterfallChart.module.css
│   │   ├── ForensicReveal.jsx
│   │   ├── ForensicUI
│   │   │   ├── Primitives.jsx
│   │   │   └── TelemetryFallback.jsx
│   │   ├── FrequencyChart.jsx
│   │   ├── FrequencyChart.module.css
│   │   ├── GaleriaForense
│   │   │   ├── ForensicNarrative.jsx
│   │   │   ├── ForensicNarrative.module.css
│   │   ├── GlitchTitle.jsx
│   │   ├── GlitchTitle.module.css
│   │   ├── GlosarioTecnico.jsx
│   │   ├── GlosarioTecnico.module.css
│   │   ├── GlossaryDefinitionPanel.jsx
│   │   ├── GlossaryLink.jsx
│   │   ├── GridUnavailabilityGauge.jsx
│   │   ├── HomeAnnexes.jsx
│   │   ├── HomeAnnexes.module.css
│   │   ├── HomeArgument.jsx
│   │   ├── HomeArgument.module.css
│   │   ├── HomeChatInvite.jsx
│   │   ├── HomeChatInvite.module.css
│   │   ├── HomeHero.jsx
│   │   ├── HomeHero.module.css
│   │   ├── HomeReadingPaths.jsx
│   │   ├── HomeReadingPaths.module.css
│   │   ├── HuenejaRegulatoryRiskFigure.jsx
│   │   ├── HuenejaRegulatoryRiskFigure.module.css
│   │   ├── IberianGridTopology.jsx
│   │   ├── IberianGridTopologyBase.jsx
│   │   ├── InteractiveFootnote.jsx
│   │   ├── InteractiveGraphicsGallery.module.css
│   │   ├── InteractiveGraphicsGalleryBase.jsx
│   │   ├── InterconnectionDashboard.jsx
│   │   ├── InterconnectionDashboard.module.css
│   │   ├── KeyFact
│   │   │   ├── index.jsx
│   │   │   └── styles.module.css
│   │   ├── LOLEBarChart.jsx
│   │   ├── LOLEBarChart.module.css
│   │   ├── MRSCRComparator.jsx
│   │   ├── MRSCRComparator.module.css
│   │   ├── MacroEconomicDamageFlowFigure.jsx
│   │   ├── MacroEconomicDamageFlowFigure.module.css
│   │   ├── MarketDistortionPvpcFigure.jsx
│   │   ├── MarketDistortionPvpcFigure.module.css
│   │   ├── MediaCardGallery.jsx
│   │   ├── MetamorfosisIBR
│   │   │   ├── MetamorfosisIBR.jsx
│   │   ├── MixGeneracion.jsx
│   │   ├── NarrativasInstitucionales
│   │   │   └── NarrativasInstitucionales.jsx
│   │   ├── NavigationGuide.jsx
│   │   ├── OvervoltageTimeline.jsx
│   │   ├── OvervoltageTimeline.module.css
│   │   ├── PMODEDiagram.jsx
│   │   ├── PO74Timeline.jsx
│   │   ├── PO74Timeline.module.css
│   │   ├── PQCapabilitySimulator
│   │   │   ├── PQCapabilitySimulator.jsx
│   │   │   └── PQCapabilitySimulator.module.css
│   │   ├── PVCurveSimulator
│   │   │   ├── index.jsx
│   │   ├── PhasePlanePlot.jsx
│   │   ├── PicasoPriceChart.jsx
│   │   ├── PicasoPriceChart.module.css
│   │   ├── PrecioSpotScatter.jsx
│   │   ├── RadarVulnerabilidad.jsx
│   │   ├── ResearchAgendaScatter.jsx
│   │   ├── ResearchAgendaScatter.module.css
│   │   ├── ResolutionRoadmap.jsx
│   │   ├── ResolutionRoadmap.module.css
│   │   ├── RestorationLoadRampFigure.jsx
│   │   ├── RestorationLoadRampFigure.module.css
│   │   ├── ResumenCifras
│   │   │   ├── Bloque1KPI.jsx
│   │   │   ├── Bloque1KPI.module.css
│   │   │   ├── Bloque2MixGeneracion.jsx
│   │   │   ├── Bloque2MixGeneracion.module.css
│   │   │   ├── Bloque3Cascada.jsx
│   │   │   ├── Bloque3Cascada.module.css
│   │   │   ├── Bloque4Frecuencia.jsx
│   │   │   ├── Bloque4Frecuencia.module.css
│   │   │   ├── Bloque5Interconexiones.jsx
│   │   │   ├── Bloque5Interconexiones.module.css
│   │   │   ├── Bloque6Cronologia.jsx
│   │   │   └── Bloque6Cronologia.module.css
│   │   ├── SectorialResilienceChart.jsx
│   │   ├── SentimentAnalyzer.jsx
│   │   ├── StickyCollapse.jsx
│   │   ├── SwingEquationSimulator
│   │   │   └── index.js
│   │   ├── SynchrophasorPlot.jsx
│   │   ├── TapLagSequence.jsx
│   │   ├── TermometroRiesgo.jsx
│   │   ├── ThenVsNowPanel.jsx
│   │   ├── ThenVsNowPanel.module.css
│   │   ├── ThermalAdjustmentCostMatrix.jsx
│   │   ├── TimelineCrisis.jsx
│   │   ├── TorraoSynchronousCompensatorFigure.jsx
│   │   ├── TorraoSynchronousCompensatorFigure.module.css
│   │   ├── TrilemmaTriangle.jsx
│   │   ├── TrilemmaTriangle.module.css
│   │   ├── VerticalTimeline.jsx
│   │   ├── VerticalTimeline.module.css
│   │   ├── VulnerabilityRiskMatrix.jsx
│   │   ├── VulnerabilityRiskMatrix.module.css
│   │   ├── annex
│   │   │   ├── Annex.module.css
│   │   │   ├── AnnexBlackoutRelevance.jsx
│   │   │   ├── AnnexBlackoutRelevance.module.css
│   │   │   ├── AnnexCrossLinks.jsx
│   │   │   ├── AnnexCrossLinks.module.css
│   │   │   ├── AnnexEvidence.jsx
│   │   │   ├── AnnexEvidence.module.css
│   │   │   ├── AnnexEvidenceGrid.jsx
│   │   │   ├── AnnexEvidenceGrid.module.css
│   │   │   ├── AnnexEvidenceLead.jsx
│   │   │   ├── AnnexEvidenceLead.module.css
│   │   │   ├── AnnexEvidenceNav.jsx
│   │   │   ├── AnnexEvidenceNav.module.css
│   │   │   ├── AnnexEvidenceViewer.jsx
│   │   │   ├── AnnexEvidenceViewer.module.css
│   │   │   ├── AnnexKeyQuestion.jsx
│   │   │   ├── AnnexKeyQuestion.module.css
│   │   │   ├── AnnexLayout.jsx
│   │   │   ├── AnnexMethodNote.jsx
│   │   │   ├── AnnexSection.jsx
│   │   │   ├── AnnexSectionSummary.jsx
│   │   │   ├── AnnexSectionSummary.module.css
│   │   │   ├── AnnexThesisBox.jsx
│   │   │   └── AnnexThesisBox.module.css
│   │   ├── cine-mode
│   │   │   ├── ActTransition.jsx
│   │   │   ├── CineModePlayer.jsx
│   │   │   ├── ParticleSystem.jsx
│   │   │   ├── Scene.jsx
│   │   │   ├── TimelineController.jsx
│   │   │   ├── chartRegistry.js
│   │   │   └── cine-mode.css
│   ├── data
│   │   ├── bibliography.js
│   │   ├── datosForenses.json
│   │   ├── forensicCharts.js
│   │   ├── forensicCharts_de.js
│   │   ├── forensicCharts_en.js
│   │   ├── forensicCharts_fr.js
│   │   ├── forensicCharts_it.js
│   │   ├── forensicCharts_pt.js
│   │   ├── forensicData.js
│   │   ├── forensicDataI18n.js
│   │   ├── forensicData_de.js
│   │   ├── forensicData_en.js
│   │   ├── forensicData_fr.js
│   │   ├── forensicData_it.js
│   │   ├── forensicData_pt.js
│   │   ├── galeriaforensedefinitiva.json
│   │   ├── glossary-terms.json
│   │   ├── glossary.js
│   │   ├── glossary_de.js
│   │   ├── glossary_en.js
│   │   ├── glossary_fr.js
│   │   ├── glossary_it.js
│   │   ├── glossary_pt.js
│   │   ├── glossary_zh-Hans.js
│   │   ├── imageGalleryData.js
│   │   ├── interconnectionData.js
│   │   ├── media-factchecks.json
│   │   ├── timelineData.js
│   ├── hooks
│   │   ├── useDocLang.js
│   │   └── useEsiosAnalysis.js
│   ├── pages
│   │   ├── cine.jsx
│   │   └── index.js
│   └── theme
│       ├── Layout
│       │   └── index.js
│       ├── MDXComponents.js
│       └── Root.js
├── static
│   ├── chunks.json
│   ├── data
│   │   ├── blackout_snapshot_28A.json
│   │   ├── datos28A.json
│   │   ├── entsoe
│   │   │   ├── active_units_top20.json
│   │   │   ├── cost_congestion_management.json
│   │   │   ├── cross_border_physical_flows_28A.json
│   │   │   ├── current_balancing_state_28A.json
│   │   │   ├── energy_prices_day_ahead_28A.json
│   │   │   ├── fallbacks.json
│   │   │   ├── forecast_transfer_capacities.json
│   │   │   ├── frr_actual_capacity_2025.json
│   │   │   ├── generation_by_fuel_type.json
│   │   │   ├── generation_by_fuel_type_with_expected.json
│   │   │   ├── imbalance_prices_28A.json
│   │   │   ├── imbalance_spain_28_29_april_2025.json
│   │   │   ├── installed_capacity_2025.json
│   │   │   ├── scheduled_commercial_exchanges_28A.json
│   │   │   ├── sync_vs_ibr.json
│   │   │   ├── technology_status_summary.json
│   │   │   ├── total_load_day_ahead_actual_28A.json
│   │   │   └── water_reservoirs_hydro_2025.json
│   │   ├── esios
│   │   │   ├── demanda_28_29_abril.json
│   │   │   ├── otros-indicadores.json
│   │   │   ├── precios-desvios-tiempo-real.json
│   │   │   ├── saldos-horarios-por-frontera.json
│   │   ├── penetracion_renovable_28A_semana.json
│   │   ├── processed
│   │   │   ├── forensic_categories.json
│   │   │   ├── forensic_categories_de.json
│   │   │   ├── forensic_categories_en.json
│   │   │   └── forensic_categories_zh-Hans.json
│   │   ├── tablasdefinitivas.json
│   ├── figuras
│   │   ├── aege_arc_furnace_dark.png
│   │   ├── aege_arc_furnace_light.png
│   │   ├── albustami_ieee39_secuencia.png
│   │   ├── aluvion_alertas_sobretension_sur.png
│   │   ├── asimetria_balance_reactiva_sur.png
│   │   ├── black_start_hidroelectrico.png
│   │   ├── capacidad_instalada_2025.png
│   │   ├── cascada_desconexiones.png
│   │   ├── collage_ciudadanos.png
│   │   ├── collage_conservador.png
│   │   ├── collage_internacional.png
│   │   ├── collage_politicos.png
│   │   ├── collage_progresista.png
│   │   ├── conventionalunits.png
│   │   ├── coste_optimo_ers.png
│   │   ├── entsoe_flow_deviation.png
│   │   ├── ers_revenue_stacking.png
│   │   ├── estrategia_reenergizacion_dual.png
│   │   ├── evolucion_carga_repuesta_francia.png
│   │   ├── evolucion_mix_reenergizacion.png
│   │   ├── figuraB3-dark.png
│   │   ├── figuraB3-light.png
│   │   ├── fluctuaciones_tension_previas.png
│   │   ├── frequency_voltage_carmona.png
│   │   ├── futured_grid_evolution.png
│   │   ├── gfl_vs_gfm_circuit1.png
│   │   ├── heatmap_propagation.png
│   │   ├── hitachi_hybrid.png
│   │   ├── hvdc_control_transition.png
│   │   ├── intercambio_marruecos_topdown.png
│   │   ├── interconexion_francia_colapso.png
│   │   ├── islas_reposicion_entsoe.png
│   │   ├── mapas_termicos_tension_ree.png
│   │   ├── mix_comparativo_2010_2024.png
│   │   ├── nunez_balboa_precursores.png
│   │   ├── perdida_sincronismo_frontera.png
│   │   ├── pmu_sensors_europe.png
│   │   ├── po74_banda_muerta.png
│   │   ├── precursor_overvoltage_22april.png
│   │   ├── recuperacion_demanda_peninsular.png
│   │   ├── ree_generation_mix_28april.png
│   │   ├── scr_iberia.png
│   │   ├── tap_lag_decoupling.png
│   │   ├── tension_frecuencia_colapso.png
│   │   ├── timeline-dark.png
│   │   ├── timeline-light.png
│   │   └── wams_oscilaciones_carmona.png
│   ├── img
│   │   ├── favicon.png
│   │   ├── ia.png
│   │   ├── originals
│   │   │   ├── ia.png
│   │   │   └── social-card.jpg
│   │   ├── social-card.jpg
│   ├── informes
│   │   ├── 95103.pdf
│   │   ├── Compass Lexecon - INESC TEC (1).pdf
│   │   ├── El informe de Red Eléctrica sobre el apagón, al completo - 5457.pdf
│   │   ├── El informe del Gobierno sobre el apagón, al _completo_ con tachados (1).pdf
│   │   ├── Informe ICAI (1).pdf
│   │   ├── Informe_Vamos_realmente_hacia_una_electricidad_mas_barata (1).pdf
│   │   ├── Presentación Gobierno (1).pdf
│   │   └── entso-e_incident_report_ES-PT_April_2025_06.pdf
│   ├── search-index.json
│   └── tfg_antigravity(1).pdf
└── vercel.json

```

## 3. Mapa de documentación académica
La documentación académica del TFG está organizada en capítulos principales y anexos de evidencias técnicas. 
El mapa detallado de rutas y su correspondencia con los archivos MDX se encuentra en el archivo independiente `AUDIT_ROUTE_MAP.md`.

## 4. Arquitectura visual y de componentes
El sitio web está desarrollado sobre Docusaurus 2.4.3 utilizando React 17. 
La visualización interactiva y el catálogo de componentes estructurados por su función (homepage, simuladores, mapas de datos, chatbot) se describen de manera pormenorizada en el archivo `AUDIT_COMPONENT_MAP.md`.

## 5. Sistema de IA / RAG
El chatbot pericial de la web utiliza un índice de búsqueda compilado localmente. La estructura y la descripción detallada de este sistema de inteligencia artificial y su contexto de recuperación se encuentran en `AUDIT_CHATBOT_RAG_CONTEXT.md`.

## 6. Datos y assets
El inventario exhaustivo de figuras estáticas, archivos PDF descargables y ficheros de datos JSON de evidencias de ESIOS y ENTSO-E se incluye en `AUDIT_ASSETS_INVENTORY.md`.

## 7. i18n
El estado de la traducción a los idiomas secundario (Inglés, Alemán y Chino) y las discrepancias de paridad se detallan en `AUDIT_I18N_CONTEXT.md`.

## 8. Riesgos o zonas que el auditor debe revisar
El análisis de riesgos técnicos y deuda del proyecto (enlaces a anchors, scroll-behavior global y código redundante) se detalla en `AUDIT_TECHNICAL_HEALTH.md`.

## 9. Índice de archivos incluidos completos
A continuación se detallan los archivos del proyecto cuyo código fuente o texto completo ha sido incorporado dentro de los ficheros del volcado:

| Ruta del Archivo | Tipo | Tamaño (KB) | Archivo del Volcado | Función |
| :--- | :--- | :--- | :--- | :--- |
| `api/chat.js` | `JS` | 70.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/entsoe-frequency.js` | `JS` | 1.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/entsoe.js` | `JS` | 7.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/esios-analysis.js` | `JS` | 6.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/esios-multi.js` | `JS` | 2.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/esios-proxy.js` | `JS` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/esios/esios-snapshot.js` | `JS` | 5.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/figure-context.js` | `JS` | 5.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `api/redata-proxy.js` | `JS` | 1.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Endpoint de API serverless activo |
| `babel.config.js` | `JS` | 0.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Archivo de configuración del proyecto |
| `docs/01-introduccion.mdx` | `MDX` | 10.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/02-contexto.mdx` | `MDX` | 16.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/03-analisis-incidente.mdx` | `MDX` | 20.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/04-reaccion-reposicion.mdx` | `MDX` | 16.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/05-analisis-informes.mdx` | `MDX` | 27.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/06-impacto-comunicativo.mdx` | `MDX` | 18.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/07-resiliencia-futuro.mdx` | `MDX` | 35.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/07b-consecuencias-financieras.mdx` | `MDX` | 19.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/08-uso-ia.mdx` | `MDX` | 14.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/08.5-actualizacion-2026.mdx` | `MDX` | 10.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/09-conclusiones.mdx` | `MDX` | 12.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/10-resumen-de-cifras.mdx` | `MDX` | 12.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/13-sobre-el-autor.mdx` | `MDX` | 0.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-cascada-protecciones-desconexiones.mdx` | `MDX` | 12.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-comunicacion-fuentes.mdx` | `MDX` | 7.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-demanda-generacion-balance.mdx` | `MDX` | 11.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-ecuaciones-matematicas.mdx` | `MDX` | 9.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-estabilidad-dinamica-tension.mdx` | `MDX` | 12.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-impacto-resiliencia.mdx` | `MDX` | 7.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-interconexiones-flujos.mdx` | `MDX` | 10.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-mercado-costes.mdx` | `MDX` | 8.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-metodologia-modelos-datos-vivos.mdx` | `MDX` | 8.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/anexo-reposicion-blackstart.mdx` | `MDX` | 8.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/balance-intercambios.mdx` | `MDX` | 0.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/demanda-renovable.mdx` | `MDX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/index.mdx` | `MDX` | 4.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/mix-generacion.mdx` | `MDX` | 0.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/precio-spot.mdx` | `MDX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/radar-vulnerabilidad.mdx` | `MDX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/datos-tiempo-real/termometro-riesgo.mdx` | `MDX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/dimension-europea/01-francia-portugal.mdx` | `MDX` | 14.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/dimension-europea/02-coordinacion-continental.mdx` | `MDX` | 9.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/dimension-europea/03-dia-despues.mdx` | `MDX` | 15.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/glosario.mdx` | `MDX` | 0.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/impacto-social.mdx` | `MDX` | 19.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docs/referencias.mdx` | `MDX` | 0.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Documentación académica (Capítulo o Anexo) |
| `docusaurus.config.js` | `JS` | 6.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Archivo de configuración del proyecto |
| `package.json` | `JSON` | 2.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Archivo de configuración del proyecto |
| `scripts/build-index.js` | `JS` | 28.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Script de compilación/utilidad activo |
| `sidebars.js` | `JS` | 2.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Archivo de configuración del proyecto |
| `src/components/ANSI59Cascade/index.jsx` | `JSX` | 0.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/AnimatedRestorationMap.jsx` | `JSX` | 19.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/AuthorProfile.jsx` | `JSX` | 14.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BESSBoomChart.jsx` | `JSX` | 9.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BESSBoomChart.module.css` | `CSS` | 2.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BalanceIntercambios.jsx` | `JSX` | 10.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BiblioCard.jsx` | `JSX` | 1.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BiblioCard.module.css` | `CSS` | 6.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BlackoutPropagationMap.jsx` | `JSX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BlackoutPropagationMapBase.jsx` | `JSX` | 23.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/BlackoutTimeline/BlackoutTimeline.jsx` | `JSX` | 0.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CNMCSanctionsChart.jsx` | `JSX` | 6.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CNMCSanctionsChart.module.css` | `CSS` | 3.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ChartCard.jsx` | `JSX` | 2.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ChartCard.module.css` | `CSS` | 2.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ChatFullscreen.jsx` | `JSX` | 91.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ChatWidget.jsx` | `JSX` | 22.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CollapseSismograph.jsx` | `JSX` | 16.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CollapseSismograph.module.css` | `CSS` | 4.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/Collapsible.jsx` | `JSX` | 0.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CommandArchitectureGraph.jsx` | `JSX` | 8.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CommandArchitectureGraph.module.css` | `CSS` | 1.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/Comparador28A.jsx` | `JSX` | 11.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ConsensusMatrix.jsx` | `JSX` | 9.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ConsensusMatrix.module.css` | `CSS` | 4.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CoordinationTimeline.jsx` | `JSX` | 9.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CoordinationTimeline.module.css` | `CSS` | 3.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CrisisTimelineDual.jsx` | `JSX` | 10.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CrisisTimelineDual.module.css` | `CSS` | 6.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/CuestionAbierta/index.jsx` | `JSX` | 3.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/DatosTiempoRealGrid.jsx` | `JSX` | 1.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/DemandaRenovableTrend.jsx` | `JSX` | 12.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/DynamicSecurityShift.jsx` | `JSX` | 5.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/DynamicSecurityShift.module.css` | `CSS` | 4.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EASStateTransition.jsx` | `JSX` | 9.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EASStateTransition.module.css` | `CSS` | 2.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EmissionsVsRenewablesChart.jsx` | `JSX` | 14.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EnergyTransitionStreamgraph.jsx` | `JSX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EnergyTransitionStreamgraph.module.css` | `CSS` | 3.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EnergyTransitionStreamgraphBase.jsx` | `JSX` | 10.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EnergyTrilemmaSimulator/index.jsx` | `JSX` | 0.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/ActualGenerationChart.jsx` | `JSX` | 12.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/CostCongestionChart.jsx` | `JSX` | 4.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/CrossBorderFlowsChart.jsx` | `JSX` | 7.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/CurrentBalancingStateChart.jsx` | `JSX` | 7.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/EnergyPricesChart.jsx` | `JSX` | 6.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/FallbacksChart.jsx` | `JSX` | 8.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/ForecastTransferChart.jsx` | `JSX` | 8.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/FrrCapacityChart.jsx` | `JSX` | 7.4 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/HydroReservoirChart.jsx` | `JSX` | 10.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/ImbalanceChart.jsx` | `JSX` | 7.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/ImbalancePricesChart.jsx` | `JSX` | 7.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/InstalledCapacityChart.jsx` | `JSX` | 6.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/ScheduledCommercialExchangesChart.jsx` | `JSX` | 7.2 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EntsoeCharts/TotalLoadChart.jsx` | `JSX` | 7.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EsiosCharts/DemandaChart.jsx` | `JSX` | 7.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/EsiosCharts/EsiosCharts.module.css` | `CSS` | 1.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FaultTreeCollapseFigure/FaultTreeCollapseFigure.jsx` | `JSX` | 15.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FaultTreeCollapseFigure/FaultTreeCollapseFigure.module.css` | `CSS` | 4.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FerrantiCapacitiveLineSimulator/FerrantiCapacitiveLineSimulator.jsx` | `JSX` | 15.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FerrantiCapacitiveLineSimulator/FerrantiCapacitiveLineSimulator.module.css` | `CSS` | 5.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FinancialWaterfallChart.jsx` | `JSX` | 21.9 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FinancialWaterfallChart.module.css` | `CSS` | 2.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ForensicReveal.jsx` | `JSX` | 8.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ForensicUI/Primitives.jsx` | `JSX` | 2.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/ForensicUI/TelemetryFallback.jsx` | `JSX` | 1.3 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FrequencyChart.jsx` | `JSX` | 23.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/FrequencyChart.module.css` | `CSS` | 3.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GaleriaForense/ForensicNarrative.jsx` | `JSX` | 4.7 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GaleriaForense/ForensicNarrative.module.css` | `CSS` | 3.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlitchTitle.jsx` | `JSX` | 0.5 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlitchTitle.module.css` | `CSS` | 1.6 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlosarioTecnico.jsx` | `JSX` | 9.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlosarioTecnico.module.css` | `CSS` | 6.8 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlossaryDefinitionPanel.jsx` | `JSX` | 7.0 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GlossaryLink.jsx` | `JSX` | 1.1 | `AUDIT_FULL_CONTENT_PART_01.md` | Componente React activo |
| `src/components/GridUnavailabilityGauge.jsx` | `JSX` | 8.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeAnnexes.jsx` | `JSX` | 7.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeAnnexes.module.css` | `CSS` | 2.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeArgument.jsx` | `JSX` | 5.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeArgument.module.css` | `CSS` | 1.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeChatInvite.jsx` | `JSX` | 5.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeChatInvite.module.css` | `CSS` | 3.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeHero.jsx` | `JSX` | 10.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeHero.module.css` | `CSS` | 6.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeReadingPaths.jsx` | `JSX` | 8.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HomeReadingPaths.module.css` | `CSS` | 2.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HuenejaRegulatoryRiskFigure.jsx` | `JSX` | 12.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/HuenejaRegulatoryRiskFigure.module.css` | `CSS` | 5.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/IberianGridTopology.jsx` | `JSX` | 0.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/IberianGridTopologyBase.jsx` | `JSX` | 26.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/InteractiveFootnote.jsx` | `JSX` | 5.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/InteractiveGraphicsGallery.module.css` | `CSS` | 4.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/InteractiveGraphicsGalleryBase.jsx` | `JSX` | 41.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/InterconnectionDashboard.jsx` | `JSX` | 14.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/InterconnectionDashboard.module.css` | `CSS` | 4.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/KeyFact/index.jsx` | `JSX` | 1.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/KeyFact/styles.module.css` | `CSS` | 1.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/LOLEBarChart.jsx` | `JSX` | 6.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/LOLEBarChart.module.css` | `CSS` | 2.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MRSCRComparator.jsx` | `JSX` | 6.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MRSCRComparator.module.css` | `CSS` | 2.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MacroEconomicDamageFlowFigure.jsx` | `JSX` | 16.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MacroEconomicDamageFlowFigure.module.css` | `CSS` | 7.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MarketDistortionPvpcFigure.jsx` | `JSX` | 18.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MarketDistortionPvpcFigure.module.css` | `CSS` | 7.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MediaCardGallery.jsx` | `JSX` | 20.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MetamorfosisIBR/MetamorfosisIBR.jsx` | `JSX` | 11.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/MixGeneracion.jsx` | `JSX` | 17.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/NarrativasInstitucionales/NarrativasInstitucionales.jsx` | `JSX` | 13.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/NavigationGuide.jsx` | `JSX` | 6.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/OvervoltageTimeline.jsx` | `JSX` | 6.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/OvervoltageTimeline.module.css` | `CSS` | 3.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PMODEDiagram.jsx` | `JSX` | 7.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PO74Timeline.jsx` | `JSX` | 5.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PO74Timeline.module.css` | `CSS` | 4.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PQCapabilitySimulator/PQCapabilitySimulator.jsx` | `JSX` | 10.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PQCapabilitySimulator/PQCapabilitySimulator.module.css` | `CSS` | 5.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PVCurveSimulator/index.jsx` | `JSX` | 0.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PhasePlanePlot.jsx` | `JSX` | 17.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PicasoPriceChart.jsx` | `JSX` | 6.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PicasoPriceChart.module.css` | `CSS` | 2.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/PrecioSpotScatter.jsx` | `JSX` | 14.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/RadarVulnerabilidad.jsx` | `JSX` | 13.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResearchAgendaScatter.jsx` | `JSX` | 7.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResearchAgendaScatter.module.css` | `CSS` | 4.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResolutionRoadmap.jsx` | `JSX` | 7.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResolutionRoadmap.module.css` | `CSS` | 3.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/RestorationLoadRampFigure.jsx` | `JSX` | 14.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/RestorationLoadRampFigure.module.css` | `CSS` | 4.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque1KPI.jsx` | `JSX` | 9.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque1KPI.module.css` | `CSS` | 4.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque2MixGeneracion.jsx` | `JSX` | 10.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque2MixGeneracion.module.css` | `CSS` | 3.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque3Cascada.jsx` | `JSX` | 16.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque3Cascada.module.css` | `CSS` | 5.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque4Frecuencia.jsx` | `JSX` | 15.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque4Frecuencia.module.css` | `CSS` | 6.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque5Interconexiones.jsx` | `JSX` | 11.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque5Interconexiones.module.css` | `CSS` | 5.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque6Cronologia.jsx` | `JSX` | 19.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ResumenCifras/Bloque6Cronologia.module.css` | `CSS` | 8.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/SectorialResilienceChart.jsx` | `JSX` | 13.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/SentimentAnalyzer.jsx` | `JSX` | 6.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/StickyCollapse.jsx` | `JSX` | 15.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/SwingEquationSimulator/index.js` | `JS` | 0.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/SynchrophasorPlot.jsx` | `JSX` | 20.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TapLagSequence.jsx` | `JSX` | 27.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TermometroRiesgo.jsx` | `JSX` | 13.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ThenVsNowPanel.jsx` | `JSX` | 6.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ThenVsNowPanel.module.css` | `CSS` | 4.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/ThermalAdjustmentCostMatrix.jsx` | `JSX` | 21.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TimelineCrisis.jsx` | `JSX` | 9.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TorraoSynchronousCompensatorFigure.jsx` | `JSX` | 8.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TorraoSynchronousCompensatorFigure.module.css` | `CSS` | 5.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TrilemmaTriangle.jsx` | `JSX` | 8.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/TrilemmaTriangle.module.css` | `CSS` | 2.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/VerticalTimeline.jsx` | `JSX` | 22.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/VerticalTimeline.module.css` | `CSS` | 5.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/VulnerabilityRiskMatrix.jsx` | `JSX` | 15.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/VulnerabilityRiskMatrix.module.css` | `CSS` | 5.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/Annex.module.css` | `CSS` | 12.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexBlackoutRelevance.jsx` | `JSX` | 0.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexBlackoutRelevance.module.css` | `CSS` | 1.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexCrossLinks.jsx` | `JSX` | 0.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexCrossLinks.module.css` | `CSS` | 1.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidence.jsx` | `JSX` | 5.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidence.module.css` | `CSS` | 1.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceGrid.jsx` | `JSX` | 0.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceGrid.module.css` | `CSS` | 0.2 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceLead.jsx` | `JSX` | 0.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceLead.module.css` | `CSS` | 1.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceNav.jsx` | `JSX` | 4.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceNav.module.css` | `CSS` | 2.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceViewer.jsx` | `JSX` | 20.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexEvidenceViewer.module.css` | `CSS` | 15.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexKeyQuestion.jsx` | `JSX` | 0.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexKeyQuestion.module.css` | `CSS` | 0.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexLayout.jsx` | `JSX` | 2.6 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexMethodNote.jsx` | `JSX` | 2.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexSection.jsx` | `JSX` | 1.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexSectionSummary.jsx` | `JSX` | 0.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexSectionSummary.module.css` | `CSS` | 1.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexThesisBox.jsx` | `JSX` | 0.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/annex/AnnexThesisBox.module.css` | `CSS` | 0.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/ActTransition.jsx` | `JSX` | 0.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/CineModePlayer.jsx` | `JSX` | 8.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/ParticleSystem.jsx` | `JSX` | 2.7 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/Scene.jsx` | `JSX` | 1.8 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/TimelineController.jsx` | `JSX` | 3.4 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/chartRegistry.js` | `JS` | 2.1 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/components/cine-mode/cine-mode.css` | `CSS` | 10.5 | `AUDIT_FULL_CONTENT_PART_02.md` | Componente React activo |
| `src/data/bibliography.js` | `JS` | 5.0 | `AUDIT_FULL_CONTENT_PART_02.md` | Archivo de datos activo |
| `src/data/datosForenses.json` | `JSON` | 31.3 | `AUDIT_FULL_CONTENT_PART_02.md` | Archivo de datos activo |
| `src/data/forensicCharts.js` | `JS` | 180.9 | `AUDIT_FULL_CONTENT_PART_02.md` | Archivo de datos activo |
| `src/data/forensicCharts_de.js` | `JS` | 181.7 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicCharts_en.js` | `JS` | 178.6 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicCharts_fr.js` | `JS` | 182.8 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicCharts_it.js` | `JS` | 180.9 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicCharts_pt.js` | `JS` | 43.0 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData.js` | `JS` | 5.3 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicDataI18n.js` | `JS` | 0.6 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData_de.js` | `JS` | 4.3 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData_en.js` | `JS` | 4.1 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData_fr.js` | `JS` | 4.3 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData_it.js` | `JS` | 4.2 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/forensicData_pt.js` | `JS` | 4.2 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/galeriaforensedefinitiva.json` | `JSON` | 116.8 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/glossary-terms.json` | `JSON` | 90.3 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/glossary.js` | `JS` | 96.6 | `AUDIT_FULL_CONTENT_PART_03.md` | Archivo de datos activo |
| `src/data/glossary_de.js` | `JS` | 99.6 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/glossary_en.js` | `JS` | 88.9 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/glossary_fr.js` | `JS` | 43.4 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/glossary_it.js` | `JS` | 42.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/glossary_pt.js` | `JS` | 40.7 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/glossary_zh-Hans.js` | `JS` | 68.9 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/imageGalleryData.js` | `JS` | 65.5 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/interconnectionData.js` | `JS` | 5.1 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/media-factchecks.json` | `JSON` | 26.5 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/data/timelineData.js` | `JS` | 4.8 | `AUDIT_FULL_CONTENT_PART_04.md` | Archivo de datos activo |
| `src/hooks/useDocLang.js` | `JS` | 0.2 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `src/hooks/useEsiosAnalysis.js` | `JS` | 4.3 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `src/pages/cine.jsx` | `JSX` | 1.6 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `src/pages/index.js` | `JS` | 2.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `src/theme/Layout/index.js` | `JS` | 1.2 | `AUDIT_FULL_CONTENT_PART_04.md` | Componente de tema Docusaurus activo |
| `src/theme/MDXComponents.js` | `JS` | 1.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Componente de tema Docusaurus activo |
| `src/theme/Root.js` | `JS` | 7.1 | `AUDIT_FULL_CONTENT_PART_04.md` | Componente de tema Docusaurus activo |
| `static/data/blackout_snapshot_28A.json` | `JSON` | 0.5 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/datos28A.json` | `JSON` | 2.1 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/active_units_top20.json` | `JSON` | 2.1 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/cost_congestion_management.json` | `JSON` | 1.9 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/cross_border_physical_flows_28A.json` | `JSON` | 6.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/current_balancing_state_28A.json` | `JSON` | 69.1 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/energy_prices_day_ahead_28A.json` | `JSON` | 7.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/fallbacks.json` | `JSON` | 6.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/forecast_transfer_capacities.json` | `JSON` | 6.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/frr_actual_capacity_2025.json` | `JSON` | 1.8 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/generation_by_fuel_type.json` | `JSON` | 0.6 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/generation_by_fuel_type_with_expected.json` | `JSON` | 0.7 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/imbalance_prices_28A.json` | `JSON` | 49.4 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/imbalance_spain_28_29_april_2025.json` | `JSON` | 18.3 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/installed_capacity_2025.json` | `JSON` | 1.7 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/scheduled_commercial_exchanges_28A.json` | `JSON` | 54.5 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/sync_vs_ibr.json` | `JSON` | 0.4 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/technology_status_summary.json` | `JSON` | 1.0 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/total_load_day_ahead_actual_28A.json` | `JSON` | 6.4 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/entsoe/water_reservoirs_hydro_2025.json` | `JSON` | 2.2 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/esios/demanda_28_29_abril.json` | `JSON` | 87.8 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/esios/otros-indicadores.json` | `JSON` | 98.3 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/esios/precios-desvios-tiempo-real.json` | `JSON` | 13.6 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/esios/saldos-horarios-por-frontera.json` | `JSON` | 10.4 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/penetracion_renovable_28A_semana.json` | `JSON` | 0.2 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/processed/forensic_categories.json` | `JSON` | 107.8 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/processed/forensic_categories_de.json` | `JSON` | 109.7 | `AUDIT_FULL_CONTENT_PART_04.md` | Código fuente activo del proyecto |
| `static/data/processed/forensic_categories_en.json` | `JSON` | 107.2 | `AUDIT_FULL_CONTENT_PART_05.md` | Código fuente activo del proyecto |
| `static/data/processed/forensic_categories_zh-Hans.json` | `JSON` | 108.5 | `AUDIT_FULL_CONTENT_PART_05.md` | Código fuente activo del proyecto |
| `static/data/tablasdefinitivas.json` | `JSON` | 105.1 | `AUDIT_FULL_CONTENT_PART_05.md` | Código fuente activo del proyecto |
| `vercel.json` | `JSON` | 1.9 | `AUDIT_FULL_CONTENT_PART_05.md` | Archivo de configuración del proyecto |


## 10. Índice de archivos solo inventariados
Los siguientes archivos no han sido incluidos de forma completa por tratarse de assets binarios, imágenes, documentos PDF compilados o copias de backup redundantes:

| Ruta del Archivo | Tipo | Tamaño (KB) | Motivo de No Inclusión | Función |
| :--- | :--- | :--- | :--- | :--- |
| `static/chunks.json` | `JSON` | 916.9 | Archivo de datos grande, backup o no relevante | Archivo de datos activo (Grande - resumido) |
| `static/figuras/aege_arc_furnace_dark.png` | `PNG` | 2972.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/aege_arc_furnace_light.png` | `PNG` | 3147.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/albustami_ieee39_secuencia.png` | `PNG` | 93.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/aluvion_alertas_sobretension_sur.png` | `PNG` | 175.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/asimetria_balance_reactiva_sur.png` | `PNG` | 126.6 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/black_start_hidroelectrico.png` | `PNG` | 908.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/capacidad_instalada_2025.png` | `PNG` | 119.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/cascada_desconexiones.png` | `PNG` | 253.6 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/collage_ciudadanos.png` | `PNG` | 476.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/collage_conservador.png` | `PNG` | 552.7 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/collage_internacional.png` | `PNG` | 470.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/collage_politicos.png` | `PNG` | 345.7 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/collage_progresista.png` | `PNG` | 574.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/conventionalunits.png` | `PNG` | 25.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/coste_optimo_ers.png` | `PNG` | 71.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/entsoe_flow_deviation.png` | `PNG` | 185.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/ers_revenue_stacking.png` | `PNG` | 218.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/estrategia_reenergizacion_dual.png` | `PNG` | 987.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/evolucion_carga_repuesta_francia.png` | `PNG` | 99.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/evolucion_mix_reenergizacion.png` | `PNG` | 96.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/figuraB3-dark.png` | `PNG` | 1225.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/figuraB3-light.png` | `PNG` | 1236.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/fluctuaciones_tension_previas.png` | `PNG` | 91.7 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/frequency_voltage_carmona.png` | `PNG` | 195.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/futured_grid_evolution.png` | `PNG` | 166.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/gfl_vs_gfm_circuit1.png` | `PNG` | 69.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/heatmap_propagation.png` | `PNG` | 743.6 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/hitachi_hybrid.png` | `PNG` | 547.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/hvdc_control_transition.png` | `PNG` | 280.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/intercambio_marruecos_topdown.png` | `PNG` | 62.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/interconexion_francia_colapso.png` | `PNG` | 284.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/islas_reposicion_entsoe.png` | `PNG` | 43.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/mapas_termicos_tension_ree.png` | `PNG` | 588.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/mix_comparativo_2010_2024.png` | `PNG` | 28.0 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/nunez_balboa_precursores.png` | `PNG` | 97.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/perdida_sincronismo_frontera.png` | `PNG` | 381.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/pmu_sensors_europe.png` | `PNG` | 501.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/po74_banda_muerta.png` | `PNG` | 28.2 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/precursor_overvoltage_22april.png` | `PNG` | 127.2 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/recuperacion_demanda_peninsular.png` | `PNG` | 62.2 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/ree_generation_mix_28april.png` | `PNG` | 72.0 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/scr_iberia.png` | `PNG` | 231.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/tap_lag_decoupling.png` | `PNG` | 271.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/tension_frecuencia_colapso.png` | `PNG` | 281.2 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/timeline-dark.png` | `PNG` | 1177.9 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/timeline-light.png` | `PNG` | 1097.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/figuras/wams_oscilaciones_carmona.png` | `PNG` | 145.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/img/favicon.png` | `PNG` | 361.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/img/ia.png` | `PNG` | 1583.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/img/originals/ia.png` | `PNG` | 1583.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PNG) |
| `static/img/originals/social-card.jpg` | `JPG` | 580.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (JPG) |
| `static/img/social-card.jpg` | `JPG` | 580.5 | Archivo Binario (Imagen/PDF) | Recurso estático activo (JPG) |
| `static/informes/95103.pdf` | `PDF` | 4242.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/Compass Lexecon - INESC TEC (1).pdf` | `PDF` | 2593.8 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/El informe de Red Eléctrica sobre el apagón, al completo - 5457.pdf` | `PDF` | 1004.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/El informe del Gobierno sobre el apagón, al _completo_ con tachados (1).pdf` | `PDF` | 7233.7 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/Informe ICAI (1).pdf` | `PDF` | 3598.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/Informe_Vamos_realmente_hacia_una_electricidad_mas_barata (1).pdf` | `PDF` | 4217.2 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/Presentación Gobierno (1).pdf` | `PDF` | 1286.1 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/informes/entso-e_incident_report_ES-PT_April_2025_06.pdf` | `PDF` | 37272.4 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |
| `static/search-index.json` | `JSON` | 1574.1 | Archivo de datos grande, backup o no relevante | Archivo de datos activo (Grande - resumido) |
| `static/tfg_antigravity(1).pdf` | `PDF` | 9365.3 | Archivo Binario (Imagen/PDF) | Recurso estático activo (PDF) |

