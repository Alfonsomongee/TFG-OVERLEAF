# Resiliencia y Futuro del Sistema Eléctrico (Capítulo 7)

La lección estructural del 28 de abril de 2025 no reside en el colapso en sí, sino en la clase de vulnerabilidad que reveló. El análisis forense demostró que el cero de tensión no fue un fallo de la reserva de potencia activa ni un error puntual de operación: fue la manifestación terminal de una incompatibilidad de fondo entre la física de un sistema eléctrico dominado por inversores y un marco técnico-regulatorio diseñado para redes síncronas.

El escenario estructural que propició el 28A ---alta penetración de Recursos Basados en Inversores (IBR), escasez de generación síncrona acoplada y una demanda neta deprimida--- no fue una anomalía climática, sino el anticipo de condiciones que se reproducirán con frecuencia creciente conforme avance la descarbonización del parque generador. La cuestión técnica y regulatoria central es: **¿qué transformaciones tecnológicas, normativas y de diseño de mercado son necesarias para que un sistema con penetración de IBR superior al 80% sea operable con los márgenes de seguridad que el Criterio $N-1$ exige?**

---

## La Física de la Fragilidad Sistémica

### La degradación de la inercia y la ecuación de oscilación

La estabilidad dinámica de la frecuencia en un sistema de potencia está gobernada por la *Ecuación de Oscilación* (*Swing Equation*), que expresa el balance entre la potencia mecánica aportada a los ejes de la generación síncrona y la potencia eléctrica extraída por las cargas:

$$\frac{2H}{f_0} \, \frac{df}{dt} = P_m - P_e - D \cdot \Delta f$$

donde $H$ es la constante de inercia equivalente del sistema (en segundos), $f_0$ la frecuencia nominal de 50 Hz, $df/dt$ la Tasa de Cambio de Frecuencia (RoCoF), $P_m$ la potencia mecánica total aportada a los rotores síncronos acoplados, $P_e$ la potencia eléctrica neta demandada y $D$ el coeficiente de amortiguamiento de las cargas dependientes de la frecuencia.

El parámetro central a efectos del 28A es $H$: su reducción implica que cualquier desequilibrio de potencia ($P_m - P_e \neq 0$) se traduce en un RoCoF proporcionalmente más agudo, acortando la ventana temporal disponible para la actuación de los sistemas de regulación. Los inversores eólicos y solares convencionales ---los denominados *grid-following* (GFL)--- están desacoplados de la frecuencia de red mediante sus enlaces de corriente continua y **no aportan inercia electromecánica inherente**.

En el momento del cero de tensión, el Operador del Sistema certificó una inercia disponible de $H = 2{,}3$ s, valor que superaba el umbral de 2,0 s recomendado por ENTSO-E. El incidente **no fue**, por tanto, un colapso de frecuencia por déficit de masa síncrona: el RoCoF no superó 1 Hz/s hasta una fase avanzada de la cascada. Este matiz es determinante para la interpretación prospectiva: el déficit de inercia no fue la causa del 28A, pero sí el factor estructural que reducirá los márgenes de seguridad del sistema conforme avance la descarbonización.

### El colapso del cortocircuito: la métrica de fortaleza de red

La segunda dimensión de la fragilidad sistémica, y la más directamente vinculada al mecanismo causal del 28A, es la degradación de la **Potencia de Cortocircuito ($S_{sc}$)** en los nudos de la red. Esta magnitud refleja su capacidad para inyectar corrientes masivas ante faltas, sostener el perfil de tensión ante variaciones de carga y garantizar el correcto funcionamiento de las protecciones.

Un generador síncrono convencional puede inyectar corrientes de cortocircuito de entre 5 y 7 veces su valor nominal durante los primeros ciclos de un transitorio. Los inversores, por el contrario, limitan la inyección de corriente de falta a valores de entre 1,1 y 1,2 p.u. para evitar la fusión de los semiconductores.

La parametrización habitual de esta pérdida de capacidad es el ***Short Circuit Ratio*** (SCR), definido en el Punto de Conexión Común (PCC) como:

$$\mathrm{SCR} = \frac{S_{sc,\mathrm{PCC}}}{P_{\mathrm{IBR}}}$$

La ingeniería de sistemas de potencia clasifica los nudos según este ratio en tres categorías:

| Categoría | Umbral SCR | Implicación operativa |
|-----------|-----------|----------------------|
| **Red fuerte** | SCR > 3 | Los inversores GFL operan con estabilidad de pequeña señal. Las protecciones de distancia mantienen selectividad. |
| **Red débil** | 2 ≤ SCR ≤ 3 | Degradación del margen de estabilidad del PLL ante perturbaciones rápidas. Riesgo de interacción adversa entre lazos de control. |
| **Red muy débil** | SCR < 2 | Los PLLs de los inversores GFL exhiben propensión a la pérdida de sincronismo ante variaciones de tensión menores. Las protecciones de distancia pierden direccionalidad. |

Durante las horas previas al colapso del 28 de abril, amplias zonas de la Península Ibérica operaban como "redes muy débiles" con valores de SCR inferiores a 2. La causa era estructural: la producción masiva de energía solar había desplazado por orden de mérito a las centrales de ciclo combinado, cuya desconexión eliminó precisamente las fuentes de $S_{sc}$ que dan rigidez a los nudos de la red de transporte.

El desvío aproximado de tensión en un nudo de transmisión en estas condiciones obedece a:

$$\Delta V \approx \frac{R_{\mathrm{grid}} \cdot P + X_{\mathrm{grid}} \cdot Q}{V_{\mathrm{nom}}}$$

Cuando $\mathrm{SCR} \ll 2$, la impedancia global $Z_{\mathrm{grid}}$ se hace tan alta que la tensión pasa a ser también sensible a variaciones de potencia activa $P$: las rampas de inyección solar adquieren un poder de perturbación de tensión que en redes síncronas convencionales resultaría inofensivo.

![Mapas de tensión en la red peninsular de 400 kV durante la franja crítica previa al colapso](/figuras/scr_iberia.png)

### La paradoja geométrica de los inversores: la restricción $S_{\max}$ y el conflicto P-Q

La capacidad aparente máxima de un inversor está acotada por su curva de capacidad térmica:

$$S_{\max} = \sqrt{P^2 + Q^2}$$

Cuando una extensa planta fotovoltaica experimenta un aclaramiento brusco de nubosidad, sus algoritmos de seguimiento del punto de máxima potencia (MPPT) ordenan rampas de inyección de potencia activa $P$ de orden de miles de megavatios por hora. Para no superar el límite térmico del inversor ($S_{\max}$), el controlador debe reducir simultáneamente su margen de inyección o absorción de potencia reactiva $Q$.

La paradoja reside en que ese es exactamente el instante en que el aumento brusco de $P$ sobre una red con $\mathrm{SCR} < 2$ provoca una sobretensión severa en los nudos locales, exigiendo al inversor una absorción masiva de reactiva para contenerla. El inversor se enfrenta así a **dos obligaciones físicas simultáneamente incompatibles**: maximizar $P$ por señal de mercado y maximizar $Q$ por necesidad de estabilidad de tensión.

Esta contradicción intrínseca de la electrónica de potencia en modo *grid-following* explica por qué el 28A no fue un colapso de energía, sino de control: **el sistema disponía de recursos suficientes pero carecía de la arquitectura de control necesaria para movilizarlos coherentemente**.

### La curva de pato y el efecto oculto del autoconsumo distribuido

El análisis cuantitativo de la secuencia del 28A sitúa el escenario operativo en el valle profundo de la denominada "curva de pato" (*duck curve*): la demanda bruta de ese lunes de abril era estructuralmente baja mientras que la irradiación registraba niveles próximos a los máximos estivales por la menor degradación térmica de las células fotovoltaicas en un día de primavera.

![Evolución del acoplamiento de unidades síncronas convencionales en horas centrales (12h-13h)](/figuras/conventionalunits.png)

A las 12:30 CEST, la generación total del sistema se situaba en 33.612 MW, con la cuota de tecnologías rotativas síncronas reducida a un mínimo histórico. REE había agotado sus herramientas de gestión manual ---apertura preventiva de decenas de líneas de muy alta tensión para aumentar artificialmente la impedancia en serie, más la operación de las reactancias al 85% de su capacidad--- sin lograr contener el ascenso de tensión.

Un factor adicional fue el comportamiento del **autoconsumo fotovoltaico distribuido**. El despliegue masivo de instalaciones de autoconsumo introduce una variable de incertidumbre estocástica: esta generación detrae demanda visible sin ser observable telemáticamente a la resolución temporal necesaria. Durante los fenómenos oscilatorios previos al colapso, las fluctuaciones de tensión activaron los relés antiislamiento de instalaciones domésticas e industriales ligeras que se desconectaron en bloque, haciendo aflorar súbitamente la demanda que dichas instalaciones estaban cubriendo: el efecto fue equivalente a un escalón positivo de carga no anticipado, en un instante en que el sistema ya carecía de margen de reactiva.

---

## Tecnologías Habilitadoras Libres de Emisiones

La superación de la vulnerabilidad sistémica evidenciada por el colapso del 28 de abril exige una transición en la arquitectura de control de la red: el desplazamiento desde un parque de generación dominado por dispositivos que *siguen* la tensión y la frecuencia hacia una infraestructura capaz de *formarlas* de forma autónoma. La resiliencia del sistema depende de la integración de tres familias tecnológicas complementarias.

### BESS con control *grid-forming*: velocidad y precisión

A diferencia del inversor *grid-following*, un inversor ***grid-forming*** (GFM) opera como un equivalente de Thévenin: sintetiza de forma autónoma una referencia interna de tensión en magnitud y ángulo ($V\angle\delta$) detrás de una impedancia virtual de acoplamiento. Al imponer este vector de tensión de forma instantánea, el inversor GFM inyecta o absorbe corriente activa y reactiva de forma inherente ante cualquier variación de la red, **sin depender de mediciones externas de fase ni de retardos de cálculo**.

![Circuitos equivalentes de las topologías Grid-Following (GFL) y Grid-Forming (GFM)](/figuras/gfl_vs_gfm_circuit1.png)

Cuando el inversor GFM está respaldado por un banco de baterías (**BESS-GFM**), la combinación permite proveer dos servicios adicionales de estabilidad:

1. **Inercia sintética**: el algoritmo de control mide continuamente $df/dt$ y ajusta la potencia de salida de forma proporcional, liberando o absorbiendo energía del banco en el rango de decenas de milisegundos, emulando el comportamiento de una masa rotatoria.

2. **Respuesta Rápida de Frecuencia (FFR)**: ante la superación de un umbral de RoCoF o de desviación de frecuencia, el BESS inyecta un bloque de potencia activa predefinido de forma subcíclica, frenando la pendiente de caída antes de que los reguladores de velocidad de los grupos síncronos convencionales hayan podido procesar la perturbación.

La experiencia operativa de ERCOT (Texas) ilustra los parámetros cuantitativos de este servicio. ERCOT calcula en tiempo real la inercia del sistema mediante:

$$M_{\mathrm{sys}} = \sum_{i} H_i \cdot \mathrm{MVA}_i$$

El umbral de inercia crítica estructural se sitúa en torno a 100.000 MW·s. El sistema de alarmas establece tres zonas:

- **Zona verde** (operación holgada): $M_{\mathrm{sys}} > 120.000$ MW·s
- **Zona amarilla** (alerta evolutiva): entre 110.000 y 119.999 MW·s — se intensifica la monitorización predictiva meteorológica
- **Zona roja** (umbral crítico): $M_{\mathrm{sys}} \leq 100.000$ MW·s — el operador fuerza el despacho fuera de orden de mérito de unidades síncronas

Los resultados operativos verificados muestran que la integración de 450 MW bajo el esquema FFR subcíclico permitió reducir el umbral de inercia crítica de 100.000 MW·s a 88.000 MW·s --- un descenso del 12% que refleja la equivalencia funcional entre la actuación sub-segundo de la electrónica de potencia y la masa cinética de las máquinas síncronas convencionales.

### Compensadores síncronos: potencia de cortocircuito e inercia rotacional genuina

La limitación de corriente de los inversores (máximo 1,2–1,5 p.u. para evitar fusión de semiconductores IGBT) justifica el despliegue complementario de ***compensadores síncronos*** (SynCons): máquinas rotativas de gran masa acopladas síncronamente a la red pero operadas en vacío, que intercambian libremente potencia reactiva en función del nivel de excitación.

Su aportación es doble:

1. **Potencia de cortocircuito**: los SynCons pueden inyectar corrientes de cortocircuito del orden del 300–400% de su valor nominal durante los primeros ciclos de un transitorio, incrementando el SCR en el nudo de conexión y dotándolo de la rigidez eléctrica necesaria para que las protecciones operen correctamente.

2. **Inercia rotacional genuina**: la energía cinética almacenada en las masas rotatorias de un SynCon está físicamente disponible en el primer milisegundo de un transitorio, sin mediación de algoritmo ni latencia de control, ralentizando el RoCoF de forma inmediata.

### La estrategia *Brownfield*: reconversión de infraestructura fósil clausurada

Desde la perspectiva de la viabilidad económica, la literatura de ingeniería propone reconvertir las instalaciones fósiles clausuradas en compensadores síncronos. Los grandes alternadores de las centrales de carbón, ciclo combinado o nuclear en proceso de desmantelamiento presentan características electromecánicas directamente aprovechables para la función de compensación síncrona, una vez desacoplado el conjunto turbina-generador. Esta reconversión transforma activos varados en recursos de estabilidad sistémica al tiempo que conserva el valor de los nudos de evacuación de 400 kV ya instalados.

### Arquitectura híbrida: la complementariedad como condición de resiliencia

El análisis conjunto de las tres familias tecnológicas permite formular la conclusión en la que los informes periciales del 28A convergen: **ninguna de ellas, desplegada de forma aislada, es suficiente**.

- Los **BESS-GFM** proveen velocidad de respuesta, precisión de control y capacidad de *Black Start*, pero están limitados en corriente de cortocircuito.
- Los **SynCons** proveen inercia rotacional genuina y potencia de cortocircuito elevada, pero carecen de la agilidad subcíclica de la electrónica de potencia y no gestionan energía activa.
- La **inercia sintética y FFR** maximizan la utilización del margen energético del banco de baterías, pero dependen de la existencia de una rigidez nodal mínima ---provista por los SynCons--- para que sus algoritmos de control sean efectivos.

![Arquitectura híbrida propuesta para redes de alta penetración de IBR: BESS-GFM + compensadores síncronos](/figuras/hitachi_hybrid.png)

La resiliencia en un escenario de alta penetración de IBR requiere combinar el despliegue distribuido de BESS-GFM en nudos de red con la instalación estratégica de SynCons en los enclaves de mayor exposición a condiciones de red débil, manteniendo el SCR disponible por encima de los umbrales que garantizan la operación estable de los IBR y la fiabilidad de las protecciones.

---

## La Respuesta Normativa: del P.O. 7.4 Obsoleto al *Grid-Forming* Obligatorio

### Las deficiencias del marco preexistente

El Procedimiento de Operación 7.4 vigente en el momento del apagón no había sido revisado sustancialmente en aproximadamente veinticinco años. Concebido para un parque de generación de base síncrona, presentaba dos deficiencias críticas:

1. **Asimetría de participación**: el grueso del parque renovable ---que cubría el 82% de la generación en el momento del colapso--- operaba con factor de potencia fijo, inhabilitado para inyectar o absorber reactiva de forma dinámica.

2. **Banda muerta**: los generadores síncronos convencionales estaban eximidos de actuar si la tensión en la red de 400 kV se mantenía entre 405 kV y 410 kV, configurando una respuesta por escalones que resultó estructuralmente incompatible con la velocidad del transitorio capacitivo documentado.

![Curva característica de inyección/absorción de reactiva del P.O. 7.4 original (banda muerta)](/figuras/po74_banda_muerta.png)

### La revisión del P.O. 7.4, el sistema VOLTAIRE y el nuevo esquema retributivo

La Resolución de la CNMC de 12 de junio de 2025 (BOE-A-2025-13076) reformuló el P.O. 7.4 bajo el nuevo marco de servicios de no frecuencia. La innovación fundamental del texto revisado es la sustitución del modelo de consignas estáticas por una **prestación dinámica retribuida**: el seguimiento preciso de *setpoints* en tiempo real, enviados telemáticamente por el Centro de Control Eléctrico (CECOEL) a través del Centro de Control de Energías Renovables (CECRE).

El canal de comunicación se articula a través del sistema **VOLTAIRE**: un lazo de control proporcional-integral que opera en dos capas jerárquicas:

- **Regulación Terciaria**: optimiza globalmente el perfil de tensiones a nivel nacional mediante flujos de cargas óptimos reactivos.
- **Regulación Secundaria**: envía consignas telemáticas en tiempo real con una resolución de muestreo de 4 s, cerrando el bucle de control a escala de parque.

El nuevo esquema retributivo introduce:
- **2 €/MVArh** para la prestación en tiempo real durante horas con producción neta positiva.
- Para horas con producción nula o negativa (período nocturno, donde el efecto Ferranti genera sobretensiones capacitivas), una retribución indexada al Precio Medio Diario mediante:

$$r_Q = 0{,}05 \times 1{,}15 \times \mathrm{PMD} + 5 \quad [\text{€/MVArh}]$$

Los sistemas de almacenamiento BESS reciben adicionalmente un pago de disponibilidad de **2,7 €/MW/día** sobre la potencia instalada, condicionado al mantenimiento de una tasa de cumplimiento de muestras válidas superior al 90%.

**Comparativa normativa P.O. 7.4:**

| Atributo operativo | P.O. 7.4 original (pre-2025) | Marco actualizado (post-2025) |
|-------------------|------------------------------|-------------------------------|
| Naturaleza del control | Estática y asimétrica. Operación por escalones discretos. | Dinámica, continua y proporcional a la desviación. |
| Participación IBR | *Grid-following* pasivo con factor de potencia fijo. Sin respuesta dinámica. | *Grid-forming* obligatorio. Participación activa en la consigna de tensión $V$. |
| Banda muerta ($V$) | Rango de 405 kV a 410 kV sin respuesta obligatoria. | Eliminada o reducida a ±0,5% de $U_n$. |
| Respuesta en reactiva | Escalones de consigna lenta tras petición del OS. | Respuesta automática en bucle cerrado (*droop control*). |
| Remuneración de $Q$ | Basada en disponibilidad técnica declarada. | Retribuida mediante mercados zonales de servicios ERS. |
| Observabilidad | Telemedidas SCADA de nudos de 400 kV, resolución de varios segundos. | Monitorización mediante PMU y telemedida de 4 s para IBR distribuidos. |
| Régimen sancionador | Sin penalizaciones específicas por incumplimiento de consignas de reactiva. | Penalizaciones económicas por incumplimiento de la tasa de cumplimiento mínima del 90%. |

### El marco europeo: NC RfG 2.0 y los Informes de Fase I y Fase II de ENTSO-E

El NC RfG vigente en la última década fue diseñado bajo el paradigma GFL: estandarizaba los perfiles de hueco y los umbrales de frecuencia, pero no contemplaba la posibilidad de que no quedara ninguna máquina rotativa pesada a la que seguir. Esta carencia conceptual quedó demostrada en los 8 segundos del colapso ibérico.

El Grupo Técnico de ENTSO-E sobre Capacidad de Formación de Red (TG GFC) cristalizó su trabajo en dos documentos de referencia:

- **Informe de Fase I (mayo de 2024)**: Estableció la definición técnica fundamental del GFM requerida por el nuevo código: caracterización del comportamiento transitorio como "fuente de tensión detrás de una reactancia efectiva constante" durante los primeros milisegundos tras una perturbación. Este modelo proscribe de facto las dependencias directas de algoritmos PLL para el control primario de la corriente de falta.

- **Informe de Fase II (noviembre de 2025)**: Publicado bajo el peso de la evidencia del colapso ibérico, con aval de CENELEC, WindEurope, SolarPower Europe y EASE. Establece de forma taxativa cómo las nuevas plantas y los sistemas de almacenamiento basados en inversores deben estabilizar el sistema.

Las obligaciones GFM del **NC RfG 2.0** se aplican con un enfoque tecnológicamente agnóstico:

| Tipo | Potencia / Conexión | Requisito GFM | Cronograma |
|------|--------------------|--------------:|-----------|
| **Tipo A** | < 1 MW | Voluntario. Sujeto al criterio del DSO. | N/A |
| **Tipo B** | 1–50 MW | Obligatorio. Inercia sintética y soporte dinámico básico de tensión. | Máx. 3 años tras publicación del IGD de ENTSO-E. |
| **Tipo C** | > 50 MW | Obligatorio y exhaustivo. Operación plena como fuente de tensión; perfiles de corriente de falta; funcionalidad POD. | 3 años tras adopción definitiva por la Comisión Europea. |
| **Tipo D** | ≥ 110 kV o > 75 MW | Idéntico al Tipo C más pruebas de certificación. | 3 años tras adopción definitiva. |
| **ESM (BESS)** | Según categoría | Ídem al módulo PPM equivalente. V2G con capacidad conjunta > 1 MW se clasifican como ESM Tipo B. | Según categoría. |

A la fecha de redacción del presente trabajo, la adopción formal del NC RfG 2.0 por la Comisión Europea se encuentra sin calendario oficial, lo que genera una ventana de incertidumbre regulatoria que los operadores nacionales están gestionando mediante medidas preventivas.

---

## Mercados de Servicios Esenciales de Confiabilidad

### El problema del *headroom*: por qué el mercado de energía no remunera la estabilidad

Para que un inversor GFM pueda actuar como fuente de tensión ante un RoCoF severo o una perturbación de tensión, debe mantener obligatoriamente una reserva de su capacidad aparente ($S_{\max}$) no utilizada en estado estacionario. Esta reserva ---denominada ***headroom***--- exige o bien limitar deliberadamente la potencia activa inyectada en el mercado de energía diario, o bien sobredimensionar la etapa de potencia de sus IGBT aumentando drásticamente el CAPEX. Sin compensación económica directa, ninguna de estas opciones es viable comercialmente.

El fracaso estructural de la arquitectura regulatoria vigente hasta el 28A residía en su enfoque punitivo: penalizar las desviaciones técnicas sin remunerar los atributos de firmeza.

### Mecanismos de mercado: tres vectores de remuneración

Los informes post-28A y la literatura técnica establecen las directrices para estructurar sistemas de remuneración que eviten infraestructuras ociosas o desincentivos económicos. Las propuestas se articulan en tres mecanismos complementarios:

**1. Mercados regionales de inercia sintética y contención rápida de frecuencia**

El diseño ibérico y europeo avanzará hacia subastas donde se abone un pago por capacidad o de disponibilidad a los activos capaces de proveer soporte inercial en márgenes de tiempo inferiores a 5 milisegundos. La lógica del mecanismo es la acumulación de fuentes de ingresos (*revenue stacking*): los sistemas BESS perciben ingresos simultáneos de arbitraje de energía en el mercado diario, de las subastas de regulación secundaria y terciaria de frecuencia, y de pagos por capacidad de inercia sintética y FFR.

![Revenue stacking en el nuevo marco de mercados ERS para sistemas BESS-GFM](/figuras/ers_revenue_stacking.png)

**2. Señales geográficas de nivel de cortocircuito**

A diferencia de la frecuencia ---una métrica global que se distribuye instantáneamente por toda la zona síncrona continental---, el SCR y las sobretensiones son fenómenos radicalmente locales y geográficamente confinados. Los mercados de ERS adoptarán señales de precios espaciales granulares: tarifas de conexión descontadas o subastas de capacidad de reactiva en los nudos perimetrales identificados matemáticamente como enclaves con $\mathrm{SCR} < 2$.

**3. Remuneración ex-ante para inversiones puras de estabilidad: compensadores síncronos**

Para infraestructuras como los SynCons, que aportan inercia física pura y corrientes de cortocircuito masivas pero no tienen capacidad de vender energía en el mercado horario, la regulación contempla modelos de retribución basados en el coste del servicio (*Rate of Return Regulation*) o adjudicaciones a largo plazo que blindan la inversión de capital.

### Los modelos de referencia: DS3 de EirGrid y RRS-FFR de ERCOT

Los sistemas de EirGrid (Irlanda) y ERCOT (Texas) constituyen las referencias operativas contrastadas hacia las que converge el diseño europeo de los mercados ERS: ambos operadores han enfrentado con antelación los desafíos de penetraciones de generación no síncrona superiores al 75%.

El programa DS3 (*Delivering a Secure, Sustainable Electricity System*) de EirGrid fragmentó la provisión de estabilidad en 14 productos altamente especializados:

| Servicio DS3 | Definición técnica | Umbral / Ventana |
|-------------|-------------------|-----------------|
| **Synchronous Inertial Response (SIR)** | Provisión casi instantánea de potencia activa y par sincronizante ante caídas de frecuencia. Se remunera mediante el índice SIRF = $E_k / P_\text{min}$, que penaliza el despacho de plantas ineficientes que inyectan potencia activa no deseada solo para aportar inercia marginal. | SIRF ≥ 15 s |
| **Fast Frequency Response (FFR)** | Inyección rápida de potencia activa tras un evento de caída abrupta de frecuencia. La energía validable se calcula como la integral de la potencia adicional inyectada en los primeros 10 s. Se exige que la energía provista sea estrictamente mayor que la pérdida de energía incurrida en la recuperación. | Respuesta entre 0,15 s y 2 s; $E_\text{prov} > E_\text{loss}$ |
| **Steady-State Reactive Power (SSRP)** | Rango total de potencia reactiva despachable que el inversor puede inyectar o absorber en operación continua. Incluye un escalar retributivo favorable para IBR capaces de proveer reactiva en vacío (*watt-less VARs*). | Estado estacionario; valoración anual |

### La evolución del marco español en 2026: P.O. 7.4 y P.O. 14.4

El 8 de mayo de 2026, la CNMC abrió un trámite de audiencia pública para la modificación de los Procedimientos de Operación P.O. 7.4 y P.O. 14.4 (Expediente DCOOR/DE/006/26), orientado a la creación de mercados zonales de servicios de no frecuencia con participación activa de IBR y BESS.

La lección estructural que el 28 de abril de 2025 inscribe en el diseño regulatorio europeo es de alcance mayor que el de cualquier ajuste incremental: **los atributos físicos que los sistemas síncronos aportaban de forma inherente ---inercia, potencia de cortocircuito, control autónomo de tensión--- han dejado de ser externalidades gratuitas para convertirse en servicios cuya provisión debe ser definida, verificada y remunerada explícitamente**. El modelo marginalista puro de energía es estructuralmente incapaz de remunerar esos atributos. Sin esa traducción económica de la resiliencia, ninguna exigencia técnica del NC RfG 2.0 resultará sostenible en el medio plazo.
