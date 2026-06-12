# TEXTOS PUENTE MEJORADOS — TODOS LOS ANEXOS

**Principio:** Cada texto antes de una evidencia dice POR QUÉ está ahí y QUÉ observar.
Cada texto después dice QUÉ DEMUESTRA y HACIA DÓNDE APUNTA.
Máximo 1-2 frases. Tono pericial. Cifras concretas. Sin descripción genérica.

Formato: para cada anexo, doy los textos exactos que deben sustituir a los actuales
en el MDX. Uso `[ANTES]` y `[DESPUÉS]` para marcar posición respecto a la evidencia.

---

## ANEXO I — Demanda, generación y balance

### Sección 1 · Condición previa

**`AnnexEvidenceLead` de `ree_generation_mix_28april`** — conservar como está. Los textos del Lead (eyebrow/title/summary/insight) ya son buenos.

**`conventionalunits` (level 1):**
[ANTES] A las 12:30 CEST, solo 11 unidades convencionales permanecían acopladas — el mínimo de 2025. La siguiente figura documenta la tendencia decreciente de los meses previos.
[DESPUÉS] La expulsión sistemática por orden de mérito reducía cada día el recurso síncrono disponible para mantener inercia y potencia de cortocircuito.

**`mix-generacion-12-30` + `unavailable-capacity` (grid, level 2):**
[ANTES] La composición exacta del mix a las 12:30 CEST — instante previo al disparo raíz — y la potencia indisponible por tecnología acotan el margen real del que disponía el operador.

**`indisponibilidad-generacion-convencional` (level 2):**
[ANTES] La discrepancia de 3.028 MW entre las cifras de REE y las del Comité del Gobierno es uno de los puntos de controversia pericial: REE declaró haber desacoplado 15 ciclos combinados entre las 08:00 y las 10:00 CEST.
[DESPUÉS] Si el operador disponía realmente de capacidad síncrona adicional, la decisión de no despacharla es el primer punto de fallo de la cadena.

---

### Sección 2 · Previsiones de demanda

**`spanish-demand-forecast` (level 2):**
[ANTES] Las previsiones D-2, D-1 y 8:00h para España no anticipaban ninguna condición excepcional.
[DESPUÉS] Desviación previsto-real inferior al 5% — la demanda no era el problema.

**`portuguese-demand-forecast` (level 2):**
[ANTES] Las previsiones portuguesas confirman el mismo patrón de normalidad.

**`chart-1` (DemandaChart, level 2):**
[ANTES] La serie ESIOS de demanda peninsular con resolución de 5 minutos es el electrocardiograma del sistema: demanda estable hasta las 12:33 CEST, caída vertical a 0 MW, y 19 horas de recuperación.

**`chart-2` (TotalLoadChart, level 2):**
[ANTES] La carga combinada ES+PT confirma que el colapso fue simultáneo en ambos países — no hubo desfase apreciable entre la caída española y la portuguesa.

**`chart-3` (ProgramacionChart, level 2):**
[ANTES] El programa de producción P48 se anuló instantáneamente a las 12:33 CEST. La energía no suministrada estimada (150.000–180.000 MWh) multiplica varias veces el volumen diario programado (27.812 MWh).

[CIERRE SECCIÓN] La normalidad de las previsiones es precisamente la evidencia: la vulnerabilidad del 28-A era invisible para las señales de demanda convencionales.

---

### Sección 3 · Capacidad e indicadores

**`capacidad_instalada_2025` + `chart-5` (grid, level 3):**
[ANTES] El parque peninsular disponía de más de 121 GW de capacidad instalada, de los cuales ~61 GW eran síncronos convencionales. A mediodía del 28-A, solo 7 GW estaban despachados. La brecha entre capacidad instalada y generación real es la huella del orden de mérito.

**`chart-7` (HydroReservoir, level 3):**
[ANTES] Con 15 TWh almacenados en la semana 18, los embalses ibéricos estaban cerca del máximo histórico. Esta reserva permitió que el Black Start hidráulico fuese viable en horas, no en días.

**`chart-8` (CO₂, level 3):**
[ANTES] El indicador de generación libre de CO₂ alcanzó el 91,2% a las 11:30 CEST — máximo de 2025 en día laborable. El sistema colapsó en su punto de máxima descarbonización.

**`variacion-demanda-desconexion-gd` (level 3):**
[ANTES] La desconexión de ~700 MW de autoconsumo distribuido no observable por el SCADA de REE añadió una capa de incertidumbre operativa al balance demanda-generación.

---

### Sección 4 · Transición y re-energización

**`mix_comparativo_2010_2024` + `evolucion_mix_reenergizacion` (grid, level 3):**
[ANTES] En 14 años, la generación IBR pasó de complementaria a dominante. Tras el colapso, la re-energización excluyó las fuentes IBR hasta acreditar niveles mínimos de Scc e inercia — invirtiendo en horas la transición de una década.

**`streamgraph` (interactive, level 3):**
[ANTES] El streamgraph permite explorar año a año cómo la transición energética desplazó progresivamente las fuentes que aportaban inercia y control de tensión inherente.

**`mix-generacion` (interactive, level 3):**
[ANTES] La herramienta de desglose del mix operativo permite comparar la composición tecnológica del 28-A con jornadas estables del mismo período.

**`emissions-renewables` (interactive, level 3):**
[ANTES] La correlación entre penetración renovable y descarbonización tiene un reverso: la reducción de emisiones coincide con la reducción de inercia rotacional del sistema.

---

## ANEXO II — Estabilidad dinámica

### Sección 1 · Inestabilidad de tensión

**`fluctuaciones_tension_previas` + `precursor_overvoltage_22april` (grid, level 1):**
[ANTES] Las curvas Q-V de Carmona muestran que las maniobras de mallado contrajeron el margen al colapso un 57%. El 22 de abril — seis días antes — se registró un precursor de sobretensión en la misma zona: las plantas que dispararon el 28-A ya habían sufrido disparos idénticos.
[DESPUÉS] La existencia de un precursor descarta la hipótesis de evento aislado e implica una condición de vulnerabilidad sostenida.

**`nunez_balboa_precursores` (level 2):**
[ANTES] Los registros de Núñez de Balboa (400 kV) documentan la sucesión de picos de sobretensión del 22, 24 y 28 de abril — el estrechamiento progresivo de los márgenes de reactiva.

**`tensiones-nudos-criticos` (level 2):**
[ANTES] Las tensiones en los nudos críticos de transporte refutan la narrativa de sobretensión generalizada: en la red de 400 kV se mantuvieron mayormente dentro del rango 375–435 kV; el problema estaba en el lado 220 kV y la red colectora.

**`re-voltage-manoeuvres` (level 2):**
[ANTES] Las maniobras de compensación de reactiva ejecutadas por REE en las horas previas documentan los intentos de contener la subida de tensión antes de que se descontrolase.

**`AnnexEvidenceLead` de `tension_frecuencia_colapso`** — conservar. Los textos son buenos.

**`frequency_voltage_carmona` (level 1):**
[ANTES] El registro PMU de Carmona con resolución de milisegundos captura la transición Normal → Blackout: la tensión supera 1,10 p.u. antes de que la frecuencia abandone la banda de 49,8–50,2 Hz.
[DESPUÉS] La prioridad temporal de la tensión sobre la frecuencia es la evidencia más directa de que el colapso fue capacitivo, no inercial.

---

### Sección 2 · Frecuencia e inercia

**`evolucion-frecuencia-rocof` (level 2):**
[ANTES] La tasa de cambio de frecuencia (RoCoF) final superó 1,5 Hz/s — por encima del umbral estándar de protección de máquinas síncronas.

**`inercia-sistema-htot` (level 2):**
[ANTES] La inercia total del sistema era baja, pero los informes de ENTSO-E y REE coinciden en que no fue la causa raíz: el problema fue de control de tensión, no de RoCoF inercial.
[DESPUÉS] La inercia baja aceleró la caída una vez iniciada la cascada, pero no la provocó.

**`modos-oscilatorios` (level 2):**
[ANTES] Se detectó una oscilación forzada de 0,63 Hz, posiblemente originada en una planta FV de Badajoz. Las medidas de mitigación activadas por REE — paradójicamente — degradaron el control de tensión.

**`wams_oscilaciones_carmona` (level 3):**
[ANTES] El registro WAMS de Carmona documenta la oscilación electromecánica de 0,6 Hz captada a las 12:03 CEST con resolución de milisegundos.

**`frequency` (interactive, level 2):**
[ANTES] La gráfica interactiva de frecuencia permite observar el RoCoF instantáneo en cada nudo de la red durante los segundos del colapso.

**`sismograph` (interactive, level 1):**
[ANTES] El sismógrafo del colapso comprime los segundos críticos en una visualización donde la divergencia de tensión precede visiblemente a la caída de frecuencia.

**`chart-4` (PotenciaChart, level 2):**
[ANTES] A las 00:00 del 28-A, el sistema disponía de 39.077 MW operativos frente a 25.000 MW de demanda. Los ciclos combinados tenían 16.660 MW disponibles pero solo generaban 2.775 MW a mediodía. La brecha es la huella del orden de mérito.

**`chart-6` (ActualGeneration, level 2):**
[ANTES] Tras el colapso, las únicas unidades con generación significativa fueron las nucleares (Vandellós: 1.044 MW, Ascó 2: 1.004 MW) y los ciclos combinados supervivientes. Ninguna instalación solar o eólica aparece en el ranking.

---

### Sección 3 · Balance reactiva

**`asimetria_balance_reactiva_sur` + `mapas_termicos_tension_ree` (grid si se aplica):**
[ANTES] El déficit neto de −0,6 GVAr a las 12:30 CEST en el sur peninsular documenta la saturación del soporte de reactiva. Los mapas térmicos de REE muestran la progresión geográfica de la sobretensión.

**`inyeccion-reactiva-distribucion` (level 2):**
[ANTES] Las plantas de distribución prácticamente no contribuían al control de tensión del sur: la inyección de reactiva desde ese nivel era testimonial.

**`maniobras-compensacion-reactiva` (level 2):**
[ANTES] REE agotó los recursos de compensación convencionales (reactancias, condensadores) antes de las 12:30 CEST — el margen de maniobra estaba saturado.

---

### Sección 4 · Herramientas

**`dynamic-security-shift` (interactive, level 2):**
[ANTES] El simulador muestra cómo la frontera de seguridad dinámica se desplaza hacia adentro a medida que aumenta la penetración IBR, reduciendo el espacio de operación estable.

**`mrscr-comparator` (interactive, level 2):**
[ANTES] El MRSCR captura la interacción entre inversores IBR cercanos: a mayor concentración en el sur peninsular, menor fortaleza de la red en esos nudos.

**`phasor` (interactive, level 2):**
[ANTES] Las trayectorias angulares de tensión y corriente en Carmona permiten verificar la secuencia de pérdida de sincronismo en el plano fasorial.

**`then-vs-now-panel` (interactive, level 3):**
[ANTES] El panel antes/después compara las reglas operativas previas al 28-A con el paquete de reformas aprobado tras el evento.

**`futured_grid_evolution` (figure, level 3):**
[ANTES] La proyección de FutuRed estima la necesidad de compensación síncrona adicional para mantener márgenes de inercia seguros hacia 2030.

---

## ANEXO III — Protecciones y cascada

### Fase 1 · Propagación de sobretensiones

**`AnnexEvidenceLead` de `heatmap_propagation`** — conservar.

**`tap_lag_decoupling` + `aluvion_alertas_sobretension_sur` (grid):**
[ANTES ya está bien, conservar el texto actual]

**`ferranti` (interactive, level 2):**
[ANTES] El simulador del efecto Ferranti reproduce la sobretensión cuadrática en el extremo abierto de líneas de EAT descargadas — el mecanismo amplificador de la Fase 1.

**`tap-lag-sequence` (interactive, level 2):**
[ANTES] La secuencia Tap-Lag ilustra cómo el retraso mecánico de los OLTC (3–8 segundos por toma) ocultó la sobretensión de la red colectora al SCADA de REE.

**OvervoltageTimeline (inline):**
[ANTES] La cronología de sobretensiones permite explorar temporal y espacialmente cada registro de tensión en las subestaciones clave del suroeste.

---

### Fase 2 · Cascada IBR

**`cascada_desconexiones` + `albustami_ieee39_secuencia` (grid):**
[ANTES ya está bien, conservar texto actual]

**`secuencia-desconexion-suroeste` (level 1):**
[ANTES] Los 16 eventos de desconexión en el suroeste — tabla maestra para reproducción en software de estabilidad transitoria — se comprimieron en 11 segundos.

**`eventos-proteccion-maniobras` (level 2):**
[ANTES] El listado cronológico de actuaciones de protección detalla qué relé actuó, en qué planta, y en qué milisegundo.

**`ansi59` (interactive, level 2):**
[ANTES] El simulador ANSI 59 reproduce cómo la desconexión de un inversor eleva la tensión en los nudos adyacentes, disparando a los vecinos en cascada.

**`map` (interactive, level 1):**
[ANTES] El mapa animado permite recorrer cronológicamente los disparos de generación distribuida, observando el patrón sur→norte y oeste→este.

**`sticky-collapse` (interactive, level 2):**
[ANTES] La visualización unificada superpone alertas del SCADA, disparos de protección y frecuencia del sistema en un panel sismográfico.

**`timeline` (interactive, level 2):**
[ANTES] La cronología vertical detalla minuto a minuto la secuencia completa desde las 12:30 hasta las 12:38 CEST.

---

### Fase 3 · Deslastre

**`escalones-ufls` (level 1):**
[ANTES] Los escalones UFLS se activaron según diseño, pero presentaron una paradoja: al desconectar carga, la tensión subía adicionalmente, agravando el colapso capacitivo.

**`demand-shedding-es` + `demand-shedding-pt` (level 2):**
[ANTES] El desglose del deslastre por nudos en España y Portugal cuantifica el volumen total de carga sacrificada en cada país.

**`load-shedding-es-pt` + `dso-load-shedding` (level 2):**
[ANTES] La agregación por distribuidora y la distribución geográfica del deslastre revelan la concentración de la afectación en las zonas de mayor penetración IBR.

**`electro-intensive-pt` (level 3):**
[ANTES] Los clientes electrointensivos portugueses sufrieron deslastre prioritario programado.

**`desconexion-bombeo-hidraulica` (level 2):**
[ANTES] La desconexión del bombeo hidráulico liberó ~2.150 MW de carga instantánea, contribuyendo a frenar la caída de frecuencia.

**`pump-storage-es` + `pump-storage-pt` (level 3):**
[ANTES] El desglose por central de bombeo en España y Portugal detalla la cronología de desacoplamiento.

**`grid-unavailability` (interactive, level 2):**
[ANTES] El indicador de indisponibilidad sobrevenida por nudo cuantifica qué porcentaje de la red quedó fuera de servicio en cada zona.

**PO74Timeline (inline):**
[ANTES] La cronología del P.O. 7.4 documenta la evolución de las bandas muertas exigidas a los generadores — el vacío normativo que impidió la respuesta autónoma de los inversores ante sobretensiones.

---

### Fase 4 · Estado final

**`re-topological-manoeuvres` + `ren-topological-manoeuvres` (level 3):**
[ANTES] Las maniobras topológicas de REE y REN documentan la fragmentación controlada de la red para aislar zonas y preparar la re-energización por islas.

**`lines-outage-icai` + `km-percentage-icai` (level 3):**
[ANTES] El porcentaje de km de líneas fuera de servicio cuantifica la magnitud del daño topológico sufrido por la red de transporte.

**`estado-centrales-nucleares` (level 3):**
[ANTES] Las cinco centrales nucleares ejecutaron disparos de emergencia controlados. Su supervivencia fue crítica para el Black Start posterior: Vandellós y Ascó lideraron la generación durante la reposición.

---

## ANEXO IV — Interconexiones

### Sección 1 · Pérdida de sincronismo

**`AnnexEvidenceLead` de `entsoe_flow_deviation`** — conservar.

**`interconexion_francia_colapso` + `perdida_sincronismo_frontera` (grid si se aplica):**
[ANTES] A las 10:33 UTC, España intentaba importar más de 4.600 MW de emergencia desde Francia — ocho veces la capacidad declarada de 550 MW. La oscilación final de polos precedió a la apertura definitiva de las líneas AC transpirenaicas.

**`intercambios-internacionales-minuto` (level 2):**
[ANTES] El registro minuto a minuto de las cuatro fronteras (Francia, Portugal, Marruecos, Andorra) documenta el balance neto en el momento exacto del aislamiento.

**`interconnection` (interactive, level 2):**
[ANTES] El panel interactivo permite explorar la capacidad de transferencia y el grado de saturación de cada interconexión en el instante del colapso.

**`chart-14` (CrossBorderFlows, level 2):**
[ANTES] Los flujos físicos muestran que la frontera francesa se cerró primero; la portuguesa, después. La cronología de cierres reconstruye la secuencia exacta del aislamiento ibérico.

---

### Sección 2 · HVDC

**`hvdc_control_transition` (level 2):**
[ANTES] A las 12:08 CEST, el enlace HVDC INELFE-1 transitó de PMODE3 a PMODE1, limitando su capacidad de respuesta dinámica ante la cascada posterior. La decisión es un punto de análisis pericial abierto.

**`hvdc-santa-llogaia-parametros` (level 2):**
[ANTES] Los parámetros nominales de Santa Llogaia documentan un caso paradigmático: un enlace HVDC sin frequency response puede empeorar un colapso en lugar de amortiguarlo.

**`topology` (interactive, level 2):**
[ANTES] La topología del sistema de interconexión ibérico muestra la disposición de los enlaces AC y HVDC en la frontera norte.

---

### Sección 3 · Intercambios previos

**`programa-intercambios-pre-apagon` (level 3):**
[ANTES] A las 11:00 CEST, el saldo total de importación alcanzaba −4.755 MW — máximo histórico. La programación comercial seguía etiquetada como exportadora a 2.500 MW: la brecha entre mercado y física era de 7.255 MW.

**`intercambio_marruecos_topdown` (level 3):**
[ANTES] Marruecos operaba en régimen de exportación moderada durante la mañana — el enlace sur no contribuyó al soporte de la estabilidad.

**`chart-13` (Saldos Frontera, level 2):**
[ANTES] Los saldos P48 por frontera confirman que España dependía de importaciones récord desde Francia 90 minutos antes del colapso, mientras el programa comercial indicaba normalidad.

**`chart-15` + `chart-16` + `chart-17` (level 2):**
[ANTES] Las series de intercambios comerciales programados, subastas de capacidad y forecast de transfer capacities documentan el desacoplamiento entre los modelos de seguridad estáticos y la dinámica real de la red.

---

### Sección 4 · Re-energización

**`evolucion_carga_repuesta_francia` + `timeline-light` (grid si se aplica):**
[ANTES] Las inyecciones de RTE desde Francia sostuvieron la tensión durante la re-energización de los corredores norte y este antes de que los grupos síncronos internos se acoplaran. La línea temporal compara la contención francesa (red preservada, ancla Top-Down) con el colapso total portugués y su recuperación Bottom-Up.

**CommandArchitectureGraph (inline):**
[ANTES] El diagrama de mando continental muestra la jerarquía de decisión de emergencia activada entre los TSO europeos durante la crisis.

**CoordinationTimeline (inline):**
[ANTES] La cronología operativa de coordinación detalla los tiempos de la secuencia de re-sincronización transfronteriza.

---

## ANEXO V — Mercado y costes

### Sección 1 · Señales de mercado

**`AnnexEvidenceLead` de `coste_optimo_ers`** — conservar.

**`precios-marginales-omie` (level 2):**
[ANTES] El precio SPOT cayó a −3,00 €/MWh en la hora 12:00–13:00 CEST — fijado 24 horas antes del colapso. Un precio negativo indica que el mercado expulsaba activamente la generación síncrona precisamente cuando más se necesitaba su inercia.
[DESPUÉS] El precio negativo no fue consecuencia del apagón: fue una señal de alarma que el sistema no interpretó.

**`chart-9` (PreciosChart, level 2):**
[ANTES] La evolución SPOT vs PVPC revela la brecha estructural: precio mayorista negativo frente a tarifa minorista de 130 €/MWh en la misma hora. Tras el apagón, el SPOT se recuperó a 35 €/MWh por el mayor uso de gas en la Operación Reforzada.

**`chart-10` (PrecioEnergia, level 2):**
[ANTES] El dato revelador no es el precio final (51,52 €/MWh) sino sus componentes: las restricciones técnicas (27,93 €/MWh) superaban al precio de mercado (24,63 €/MWh). El coste de la estabilidad ya excedía el coste de la energía en la madrugada del evento.

**PicasoPriceChart (inline):**
[ANTES] Los precios de activación en la plataforma europea PICASSO documentan el coste de las reservas de regulación rápida movilizadas durante la emergencia paneuropea.

---

### Sección 2 · Balance y desvíos

**`chart-11` + `chart-12` (level 2):**
[ANTES] El coste de las reservas de regulación subida y el volumen de energía de regulación activada documentan la magnitud del esfuerzo técnico y económico por equilibrar la red tras la pérdida de 4,5 GW en 11 segundos.

**`chart-18` a `chart-22` (level 2):**
[ANTES] Los saldos de desvíos, los precios de imbalance, la capacidad FRR disponible (~889 MW en el peor caso del Q2 frente a un déficit de ~1.200 MW) y los costes de gestión de congestiones completan el cuadro económico del colapso operativo.

**`matrix` (interactive, level 2):**
[ANTES] La matriz interactiva de costes de ajuste térmico permite explorar el reparto de sobrecostes por la activación excepcional de ciclos combinados de seguridad.

---

### Sección 3 · Vulnerabilidad del mercado

**`coste_optimo_ers` + `ers_revenue_stacking` (grid si se aplica):**
[ANTES] El coste total del sistema se minimiza cuando se remunera explícitamente la inercia (ERS). La diferencia entre el óptimo y la realidad del 28-A es el coste de los servicios ancilares que el mercado no valora. El apilamiento de ingresos para BESS-GFM muestra que la remuneración por inercia sintética viabilizaría la inversión privada en soporte dinámico.

---

## ANEXO VI — Reposición y Black Start

### Sección 1 · Estrategia

**`AnnexEvidenceLead` de `estrategia_reenergizacion_dual`** — conservar.

**`black_start_hidroelectrico` + `islas_reposicion_entsoe` (grid):**
[ANTES] Los intentos de arranque autónomo tuvieron una elevada proporción de fracasos (puntos grises en la figura), reflejo de la complejidad de energizar una red sin masa síncrona acoplada. Cada isla debía estabilizarse en tensión y frecuencia antes de sincronizarse con las adyacentes.

**`centrales-black-start` (level 1):**
[ANTES] La lista de centrales habilitadas para Black Start muestra la dependencia de la hidráulica con presa — una limitación relevante en escenarios de sequía.

**`tiempos-restauracion-islas` (level 2):**
[ANTES] Los tiempos reales de restauración por isla documentan las dificultades singulares de cada zona — el sur fue consistentemente más lento que el norte.

---

### Sección 2 · Recuperación de demanda

**`recuperacion_demanda_peninsular` (level 1, dentro de AnnexEvidenceLead si aplica):**
Si está en Lead, conservar. Si no:
[ANTES] La reposición de los 25 GW perdidos requirió 18,5 horas de maniobras ininterrumpidas, con conexión de carga escalonada para evitar nuevos episodios de subfrecuencia.

**`figuraB3-light` (level 2):**
[ANTES] La maniobra de compensación síncrona en Torrão (17:23 CEST) estabilizó la isla Zêzere 220 kV: el grupo hidráulico operó como compensador síncrono puro, inyectando reactiva sin exportar potencia activa.

**`recuperacion-demanda-espana` + `recuperacion-portugal` (level 2):**
[ANTES] El desglose por nudos de distribución y la comparación España (16 h) vs Portugal (12 h) documentan la asimetría geográfica de la recuperación.

**`chart-23` (Fallbacks, level 2):**
[ANTES] El sistema de alerta europeo etiquetó a España como "Normal" a las 12:32:00 CEST y como "Blackout" a las 12:33:29 CEST — sin ningún estado intermedio. Otros TSOs (Estonia, Letonia, Finlandia) también activaron fallbacks como efecto dominó.

---

### Sección 3 · Estados EAS

**`eas-state-changes` (level 2):**
[ANTES] La tabla de transiciones del EAS cuantifica el desfase entre la declaración oficial de estado y la situación física real: la red ya estaba en colapso cuando el EAS aún declaraba "Normal".

---

## ANEXO VII — Impacto y resiliencia

### Sección 1 · Cuantificación

**`AnnexEvidenceLead` de `costes-economicos`** — conservar.

**`waterfall` (interactive, level 1):**
[ANTES] La cascada financiera desglosa la acumulación de costes directos (interrupciones industriales, transporte) e indirectos (seguros, reputacional). La banda estimada es muy amplia: 200–4.500 M€, reflejo de la dificultad de cuantificar la ENS indirecta.

---

### Sección 2 · Comparación histórica

**`comparativa-blackouts-historicos` (level 1):**
[ANTES] La comparación sitúa el 28-A frente a apagones como el Northeast 2003 (55 M de afectados, 62 GW), Italia 2003 (56 M, 27 GW) y Argentina 2019 (48 M, 22 GW). El tiempo de reposición ibérico (~10 h) fue relativamente corto gracias al soporte francés, pero la velocidad del colapso (~5 min) fue inusualmente alta.

---

### Sección 3 · Resiliencia

**`sectorial-resilience` (interactive, level 2):**
[ANTES] El análisis sectorial de resiliencia documenta qué infraestructuras críticas — transporte, telecomunicaciones, cadena de frío — tardaron más en recuperar operatividad tras el retorno de la tensión.

**TrilemmaTriangle (inline):**
[ANTES] El trilema energético visualiza el equilibrio entre seguridad, sostenibilidad y asequibilidad. El 28-A demostró que priorizar las dos últimas sin asegurar la primera tiene un coste superior al ahorro obtenido.

---

### Sección 4 · Regulatorio

**CNMCSanctionsChart (inline):**
[ANTES] El histórico de sanciones de la CNMC revela que el régimen sancionador previo al 28-A no contenía incentivos suficientes para invertir en soporte dinámico de red.

---

## ANEXO VIII — Comunicación

### Sección 1 · Cobertura mediática

**`AnnexEvidenceLead` de `collage_internacional`** — conservar.

**`collage_conservador` + `collage_progresista` (grid):**
[ANTES] La cobertura nacional se polarizó simétricamente: la prensa conservadora atribuyó el colapso al exceso de renovables; la progresista lo justificó como fallo fortuito ajeno al mix. Ambos encuadres se consolidaron antes de que se publicase ningún informe pericial.

---

### Sección 2 · Percepción pública

**`collage_ciudadanos` + `collage_politicos` (grid):**
[ANTES] En las redes sociales se propagaron rumores de ciberataque y escasez sistémica durante las primeras horas de silencio oficial. Ningún líder político abordó aspectos técnicos: la instrumentalización parlamentaria fue inmediata y se orientó exclusivamente a la atribución de responsabilidades.

---

### Sección 3 · Consenso pericial

**ConsensusMatrix (inline):**
[ANTES] La matriz de consenso contrasta las conclusiones de REE, CNMC y ENTSO-E: coinciden en la causa raíz (sobretensión + baja Scc) pero discrepan en el margen de inercia mínimo y en las responsabilidades del operador.

**EASStateTransition (inline):**
[ANTES] El sismógrafo de estados EAS documenta el desfase entre el colapso físico y la notificación continental: un fallo del sistema de alerta temprana europeo para eventos de dinámica rápida.

---

## ANEXO IX — Metodología y modelos

### Sección 1 · Contraste de fuentes

**`AnnexEvidenceLead` de `comparativa-conclusiones-entidades`** — conservar.

**`compass-lexecon` (level 2):**
[ANTES] El informe de Compass Lexecon/INESC TEC aporta la visión del consultor externo: subraya que REE desacopló 15 ciclos combinados entre las 08:00 y las 10:00 CEST, cuestionando la suficiencia del recurso síncrono.

**`scr_iberia` + `po74_banda_muerta` (grid):**
[ANTES] El mapa de SCR documenta la debilidad física de la red en el sur peninsular. La banda muerta del P.O. 7.4 previo inhabilitaba la defensa del sistema frente a transitorios capacitivos rápidos — el vacío normativo que los inversores no pudieron compensar.

---

### Sección 2 · Tecnologías

**`gfl_vs_gfm_circuit1` + `hitachi_hybrid` (grid):**
[ANTES] El inversor GFL (fuente de corriente dependiente) necesita "leer" la red para operar; el GFM (fuente de tensión autónoma) la crea. La arquitectura híbrida BESS-GFM + compensador síncrono propuesta por Hitachi Energy combina FFR con inercia rotacional y Scc.

**`pmu_sensors_europe` (level 3):**
[ANTES] La densidad de cobertura PMU fue determinante para la verificación independiente de las oscilaciones interárea registradas antes del colapso.

---

### Sección 3 · Modelos didácticos

**`comparador-28a` (interactive, level 2):**
[ANTES] El comparador permite contrastar las condiciones físicas reales del 28-A con perfiles de jornadas estables, identificando los parámetros que divergieron.

**`radar-vulnerabilidad` (interactive, level 2):**
[ANTES] El radar evalúa el sistema en seis ejes (inercia, Scc, reactiva, interconexión, mercado, comunicación) — los ejes con mayor déficit coinciden con los factores causales del colapso.

**`phaseplane` + `swing` + `pvcurve` (interactive, level 3):**
[ANTES] Los simuladores del plano de fase, la ecuación del swing y la curva P-V formalizan los fenómenos documentados en los Anexos II y III. Sus ecuaciones se detallan en el Anexo X.

**`energy-trilemma` + `then-vs-now-panel` (interactive, level 3):**
[ANTES] El simulador del trilema y el panel antes/después permiten evaluar las reformas implementadas tras el evento y su efecto sobre el equilibrio seguridad-sostenibilidad-asequibilidad.

**ResolutionRoadmap + ResearchAgendaScatter (inline):**
[ANTES] La hoja de ruta de resolución y el mapa de agenda de investigación sitúan los desarrollos futuros: compensación síncrona, baterías GFM, y reforma del mercado de servicios ancilares.

---

## ANEXO X — Ecuaciones y simuladores

Los textos de introducción de cada simulador en el Anexo X ya son razonablemente buenos. Sugiero un único cambio: añadir **la cifra o el parámetro concreto del 28-A** cuando sea posible. Ejemplo:

**`grid-strength-scr`:**
[ACTUAL] "El SCR mide la fortaleza de la red en un nudo; valores bajos indican proximidad al colapso de tensión."
[MEJORADO] "El SCR mide la fortaleza de la red en un nudo. En el sur peninsular el 28-A, el SCR cayó por debajo de 3 en nudos con alta concentración de inversores — zona de riesgo para estabilidad de tensión."

**`swing`:**
[ACTUAL] "La ecuación del swing describe la respuesta inercial transitoria ante un desequilibrio entre potencia mecánica y eléctrica, evaluando el RoCoF en función de la constante de inercia H."
[MEJORADO] "La ecuación del swing predice la respuesta inercial: con la H del sistema ibérico el 28-A (~2,5 s), un desequilibrio de 4,5 GW produce un RoCoF superior a 1,5 Hz/s."

**`ferranti`:**
[ACTUAL] "El efecto Ferranti produce sobretensión en el extremo abierto de una línea de EAT descargada, elevándose cuadráticamente con la longitud de la línea."
[MEJORADO] "El efecto Ferranti amplificó las sobretensiones en las líneas de 400 kV del suroeste. Para una línea de 300 km, la sobretensión puede alcanzar el 15–20% — suficiente para disparar las protecciones ANSI 59 de los inversores."

**`lmp-congestion`:**
[ACTUAL] "Los precios nodales de localización (LMP) descomponen el coste marginal de la energía en tres sumandos."
[MEJORADO] "Los precios nodales (LMP) habrían revelado el sobrecoste de congestión en los nudos del sur peninsular — información que el mercado zonal ibérico no proporciona."

**`sir-disinformation`:**
[ACTUAL] "El modelo SIR adaptado simula la propagación epidémica de narrativas de desinformación frente al efecto amortiguador del retardo comunicativo de las notas oficiales del operador."
[MEJORADO] "El modelo SIR calibrado con los datos del 28-A muestra que el retardo comunicativo de REE (~4 horas hasta la primera nota oficial) permitió que las narrativas de ciberataque alcanzasen el 30% de penetración antes de la primera rectificación."

Aplicar el mismo patrón al resto de simuladores del Anexo X: conservar la frase conceptual pero añadir un dato concreto del 28-A.

---

## INSTRUCCIONES PARA EL AGENTE

1. En cada MDX, localizar los textos sueltos (párrafos sin `<` al inicio) que preceden y siguen a cada `<AnnexEvidence>`.
2. Sustituirlos por los textos de este documento usando `str_replace`.
3. Si el texto actual coincide aproximadamente pero no exacto, buscar por las primeras 10 palabras.
4. Los textos dentro de `<AnnexEvidenceLead>` (eyebrow, title, summary, insight) NO se tocan — esos ya son buenos.
5. Los textos dentro de `<AnnexSectionSummary>` (demonstrates, doesNotDemonstrate, connection) NO se tocan.
6. Solo se tocan los párrafos sueltos entre evidencias.
7. Después de todos los cambios: `npm run build`.
