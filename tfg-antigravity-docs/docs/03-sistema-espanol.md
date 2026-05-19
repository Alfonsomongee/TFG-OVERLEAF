# Anatomía del incidente: cronología del colapso (Fases 0 a 3)

## Fase 0: inestabilidad de tensiones y efecto del mallado

El escrutinio forense de la cronología demuestra que el cero de tensión no fue un evento instantáneo sino la culminación de una degradación progresiva de la estabilidad estática y dinámica de la red. Durante la Fase 0, los analizadores registraron una elevada volatilidad en los perfiles de tensión ($V$) sobre una topología extremadamente débil: ante la baja demanda, el 35,8% de la red de 400 kV en la zona sur y el 34,3% en la zona centro permanecían desconectadas, configurando un escenario de alta *impedancia de transferencia*.

Sobre esta red debilitada, la dinámica del sistema se manifestó en forma de oscilaciones electromecánicas con dos modos diferenciados. A las 12:03:00 CEST se registró una primera *oscilación forzada* de 0,6 Hz de carácter local, que tardó 4 minutos y 42 segundos en amortiguarse. A las 12:19:00 CEST emergió un segundo *modo inter-área* de 0,2 Hz (Este-Centro-Oeste), por el que la península ibérica comenzó a oscilar en contrafase respecto al resto del continente, tensando la interconexión pirenaica. Durante ambos transitorios, el *ratio de amortiguamiento* se desplomó a valores cercanos al 1%, vulnerando el umbral mínimo del 5% exigido por el P.O. 13.1.

![Tensiones registradas en Núñez de Balboa 400 kV (22, 24 y 28 de abril)](/figuras/nunez_balboa_precursores.png)

La figura anterior muestra los registros de tensión en Núñez de Balboa durante los días 22, 24 y 28 de abril. La sucesión de picos de sobretensión observada es interpretada como indicio del estrechamiento progresivo de los márgenes de control de potencia reactiva en la red de transporte.

Para contener estas oscilaciones, los operadores ejecutaron una maniobra de mallado (*meshing*): entre las 12:03 y las 12:30 CEST, REE reconectó 11 líneas de 400 kV que permanecían abiertas por la baja demanda. La maniobra logró su objetivo inmediato ---reducir la impedancia y frenar el "latigazo" de las oscilaciones--- pero introdujo, según el informe pericial del IIT-ICAI, un efecto secundario relevante: por el *Efecto Ferranti*, las líneas reconectadas en vacío inyectaron de forma abrupta una cantidad significativa de potencia reactiva capacitiva en una red que ya carecía de margen de absorción.

La cuantificación exacta de esta inyección constituye uno de los ejes centrales de la disputa técnica entre los informes: el informe pericial de IIT-ICAI cifra el volumen en hasta 2,4 GVAr, mientras que el análisis independiente del Laboratorio Nacional de Energías Renovables de EE.UU. (NREL) adopta una estimación más conservadora de 1.050 MVAr. Ambas cifras coinciden, no obstante, en señalar que la inyección superó la capacidad de absorción residual del sistema, estimada en ese momento en apenas 3,3 GVAr frente a los 5,8 GVAr habituales.

![Registro WAMS de la primera oscilación de 0,6 Hz a las 12:03 CEST](/figuras/wams_oscilaciones_carmona.png)

La figura anterior muestra el registro WAMS de esta oscilación. Los sistemas WAMS (*Wide Area Monitoring Systems*) se basan en redes de unidades de medida fasorial (PMU) sincronizadas por GPS, que permiten observar simultáneamente la dinámica de la red en escalas geográficas continentales con resolución de milisegundos.

Esta inyección masiva saturó la capacidad de la red para absorber potencia reactiva ($Q$), reduciendo el margen de seguridad de las *curvas de estabilidad de tensión Q-V*. Las simulaciones periciales del IIT-ICAI estiman que, tras el mallado, la distancia al punto de colapso en el nudo de Carmona 400 kV se contrajo de un margen de 2.964 MW a 1.268 MW, una reducción próxima al 57% que acercó al sistema a un estado de saturación capacitiva.

---

## Fase 1: fenómenos de oscilación y disparo raíz (12:32:57 CEST)

La transición hacia el colapso sistémico se gestó durante la hora previa al apagón a través de una inestabilidad dinámica progresiva. A partir de las 12:00:00 CEST, el sistema ibérico experimentó oscilaciones electromecánicas que evidenciaron el coste operativo de funcionar con una inercia muy reducida. El primer evento disruptivo se registró a las 12:03:00 CEST: una oscilación de 0,6 Hz con una amplitud de 70 mHz que se sostuvo durante 4 minutos y 42 segundos antes de amortiguarse.

La naturaleza de este transitorio es objeto de controversia entre los informes. Red Eléctrica (REE) lo clasifica como una oscilación forzada originada en el lazo de control de una planta fotovoltaica en la provincia de Badajoz, mientras que los peritajes independientes del IIT-ICAI argumentan que se trató de un modo natural inter-área exacerbado por un *ratio de amortiguamiento* sistémico de tan solo el 1% ---muy por debajo del umbral mínimo del 5% exigido por el P.O. 13.1---, cuyo origen vinculan a la ausencia de *Estabilizadores del Sistema de Potencia* (PSS, *Power System Stabilizers*) en las centrales de ciclo combinado de Andalucía, las cuales permanecían apagadas.

![Visión general de la frecuencia del sistema durante la Fase 1](/figuras/timeline_frecuencia_nrel.png)

La figura anterior reproduce el análisis de telemetría externa elaborado por el NREL, en el que se aprecian las dos oscilaciones electromecánicas y la pérdida progresiva de amortiguamiento sistémico previa al colapso.

La inestabilidad se intensificó a las 12:19:00 CEST con la irrupción de un segundo modo electromecánico, esta vez de 0,2 Hz y amplitud máxima de 200 mHz. La telemetría fasorial (PMU, *Phasor Measurement Units*) europea confirmó que este evento correspondía al modo natural Este-Centro-Oeste del área síncrona continental: la reducida masa rotatoria ibérica comenzó a oscilar en contrafase respecto al centro de inercia europeo, tensando los enlaces de interconexión pirenaicos.

![Registro detallado de la segunda oscilación electromecánica a las 12:19 CEST](/figuras/oscilacion_hernani_icai.png)

Las divergencias de fase observadas en la figura anterior confirman, según el informe del IIT-ICAI, que el bloque ibérico oscilaba en contrafase respecto al sistema síncrono continental europeo durante los minutos previos al colapso.

Para amortiguar estas oscilaciones, el operador del sistema ejecutó dos maniobras de urgencia: el mallado de la red de 400 kV y la fijación del enlace HVDC con Francia en modo de potencia constante (1.000 MW de exportación). Ambas decisiones lograron estabilizar la frecuencia, pero, según el informe del IIT-ICAI, a un coste dinámico relevante para la estabilidad de tensión: las maniobras saturaron la red de potencia reactiva capacitiva, elevaron los perfiles de tensión y, en opinión del peritaje, redujeron de forma sustancial los márgenes de las *curvas Q-V*, dejando el sistema en un estado próximo al colapso por sobretensión.

El punto de no retorno se alcanzó a las 12:32:57 CEST con el "disparo raíz". Un transformador de 400/220 kV en una subestación colectora de la provincia de Granada se desconectó por actuación de sus protecciones de sobretensión, al detectarse en el secundario de 220 kV un valor de aproximadamente 244 kV, que excedía el umbral dieléctrico de seguridad de los equipos.

![Registro oscilográfico del disparo raíz a las 12:32:57](/figuras/disparo_raiz_oscilografia.png)

Como se aprecia en la figura anterior, la desconexión eliminó instantáneamente un sumidero de 165 MVAr de reactiva inductiva. La magnitud del impacto, según el análisis pericial, no residió en los 355 MW de potencia activa ($P$) perdidos con la desconexión ---una cifra manejable para el sistema--- sino en la pérdida instantánea e irrecuperable de 165 MVAr de capacidad de absorción de potencia reactiva ($Q$). En un sistema saturado de reactiva capacitiva y operando con márgenes Q-V reducidos, la desaparición de este sumidero provocó un escalón ascendente de tensión en los nudos circundantes de la red de transporte sur. Este rebote escalar fue, según el informe del IIT-ICAI, el detonante físico de la inestabilidad residual de la red, iniciando la reacción en cadena que se analiza en las secciones posteriores.

---

## Fase 2: el fenómeno del Tap-Lag y el desacoplamiento de voltajes

La Fase 2 del colapso, enmarcada en la ventana de los 21 s posteriores al "disparo raíz", se caracteriza por la materialización de un fallo en cascada impulsado por un fenómeno mecatrónico conocido en la literatura como el *Tap-Lag* (retardo del cambiador de tomas) o "desacoplamiento de observabilidad". Tras la desconexión del transformador de Granada, la pérdida abrupta de absorción de potencia reactiva provocó una tendencia creciente de la tensión en la red de transporte, que reveló una divergencia entre el comportamiento de las infraestructuras de 400 kV y las redes colectoras subyacentes.

Para comprender la mecánica de este desacoplamiento es preciso retroceder a la Fase 1. Durante la mañana, la red había sufrido diversas fluctuaciones y caídas de tensión originadas por las oscilaciones de frecuencia. Para contrarrestar estas bajadas y mantener la calidad de onda en las zonas de generación renovable, los transformadores de interconexión 400/220 kV y 400/132 kV habían ajustado sus *Cambiadores de Tomas en Carga* (OLTC, *On-Load Tap Changer*), subiendo las tomas para elevar el voltaje en el lado del secundario.

Al irrumpir la repentina sobretensión en la red de 400 kV, inducida por el disparo de Granada, estos transformadores quedaron atrapados en su propia inercia mecánica. Los mecanismos de motor y engranaje de los OLTC están ralentizados intencionadamente mediante retardos temporales para evitar bucles de oscilación mecánica (*hunting*) ante perturbaciones efímeras. En consecuencia, frente a un transitorio eléctrico ultrarrápido, los cambiadores resultaron ser excesivamente lentos y no pudieron alterar su relación de transformación a tiempo para rebajar la tensión.

![Evidencia oscilográfica del desacoplamiento de voltajes](/figuras/tap_lag_decoupling.png)

La figura anterior ilustra el desacoplamiento del fenómeno: mientras el incremento de tensión en el lado de 400 kV se mantuvo en valores moderados, la inercia del cambiador de tomas amplificó el transitorio en el lado colector.

Esta incapacidad mecánica creó un "espejismo" en la sala de control de Red Eléctrica (REE). En las pantallas del sistema de supervisión centralizado (SCADA, *Supervisory Control and Data Acquisition*), el operador del sistema monitorizaba el primario de la red de 400 kV, observando tensiones altas pero que se mantenían teóricamente por debajo del límite excepcional normativo de 435 kV establecido en el Procedimiento de Operación 1.1. Sin embargo, debido a la relación de transformación desfasada del OLTC, el voltaje experimentó un efecto multiplicador hacia las redes colectoras.

Aguas abajo, en las redes de 220 kV y 132 kV, el voltaje se elevó por encima de los límites térmicos y dieléctricos tolerables, alcanzando umbrales superiores a 1,2 p.u. que resultaban invisibles para el despacho nacional debido a la inobservabilidad de la red subyacente.

Frente a esta amplificación, los inversores de las plantas solares y eólicas se enfrentaron a voltajes inasumibles para su electrónica de potencia. Ante el riesgo de daño en sus transistores, las instalaciones accionaron sus sistemas internos de *Overvoltage Protection* (protección de sobretensión, función 59 ANSI) para salvaguardar la integridad de los activos.

![Propagación de las sobretensiones en la red de transporte (400 kV) durante la Fase 2](/figuras/heatmap_propagation.png)

Este comportamiento fundamenta una de las mayores discrepancias forenses del incidente: mientras REE tipificó estas pérdidas como "disparos inadecuados" argumentando que en su red de 400 kV no existían valores de desconexión, el análisis pericial del IIT-ICAI sostiene que las plantas actuaron de manera correcta y adecuada a la normativa ante la sobretensión real experimentada en sus puntos de conexión, aguas abajo del transformador con OLTC. El fenómeno del *Tap-Lag* configuró así, según dicho peritaje, las condiciones para un bucle de retroalimentación positiva de desconexiones en cascada.

---

## Fase 3: el camino hacia el "Cero de Tensión"

La Fase 3, que abarca la ventana temporal entre las 12:33:18 y las 12:33:29 CEST, escenifica el colapso total del sistema eléctrico peninsular en apenas once segundos. Tras el inicio de los disparos por *Tap-Lag*, la red entró en un *feedback loop* de inestabilidad capacitiva que ninguna intervención humana ni automatismo de protección convencional podía detener.

La física de este colapso operó mediante un círculo vicioso dictado por las ecuaciones de flujo de cargas. Al desconectarse masivamente las plantas conectadas mediante inversores para autoprotegerse, la red perdía instantáneamente su capacidad para absorber potencia reactiva ($Q$). Simultáneamente, la caída de potencia activa ($P$) reducía el flujo en las líneas de 400 kV, incrementando su inyección capacitiva por *efecto Ferranti* y empujando la tensión por encima de los 443 kV en los nudos más estresados. Cada desconexión elevaba la tensión, forzando nuevas desconexiones: el sistema había entrado en un estado del que no existía salida física posible.

![Propagación espacial de la pérdida de generación en cascada durante la Fase 3](/figuras/cascada_desconexiones.png)

La figura anterior resume la propagación geográfica de la cascada. Los golpes más severos se concentraron inicialmente en Badajoz (más de 725 MW perdidos a las 12:33:16 CEST) y, un segundo después, en las subestaciones de Segovia, Sevilla y Huelva (930 MW adicionales a las 12:33:17 CEST). En la ventana de cinco segundos comprendida entre las 12:33:19 y las 12:33:24 CEST, la cascada de sobretensión desconectó más de 15 GW de generación ---cerca del 60% de la demanda instantánea nacional---, llevando al sistema más allá de cualquier posibilidad de recuperación.

A medida que la cascada destruía la generación remanente, la frecuencia ($f$) comenzó a desplomarse con una tasa *RoCoF* extrema, activando los esquemas de *Deslastre Automático de Cargas por Subfrecuencia* (UFLS, *Under-Frequency Load Shedding*). Al cruzar el umbral de 49,5 Hz a las 12:33:20 CEST, se desconectaron automáticamente más de 2.000 MW de bombeo hidráulico, seguidos de múltiples escalones de demanda industrial a medida que la frecuencia continuaba cayendo hasta los 48,0 Hz.

![Evolución acoplada de la tensión y la frecuencia durante el colapso](/figuras/tension_frecuencia_colapso.png)

La figura anterior muestra la evolución acoplada de ambas magnitudes durante la fase. Se aprecia que el incremento de tensión por encima de 1,10 p.u. precede en el tiempo a la caída acelerada de frecuencia, lo que apoya la interpretación del incidente como un colapso primariamente capacitivo y no inercial.

La actuación del UFLS reveló un fenómeno electromecánico ya anticipado: la denominada *Paradoja del UFLS*. Al cortar el consumo activo ($P$) para estabilizar la frecuencia, el esquema de deslastre eliminó simultáneamente el consumo de potencia reactiva ($Q$) de esa misma demanda. En una red saturada de reactiva capacitiva, suprimir los últimos sumideros de reactiva inductiva ---los motores y cargas industriales desconectadas--- produjo un nuevo repunte de las sobretensiones, reforzando el colapso que el propio UFLS pretendía frenar.

En los últimos instantes antes del aislamiento, el déficit masivo de generación interna provocó una inversión violenta de los flujos en la frontera pirenaica: las líneas AC intentaron importar desde Francia hasta 4.609 MW de emergencia. Sin embargo, y de forma simultánea, el enlace HVDC INELFE-1 ---fijado en modo de potencia constante (PMODE1) desde las 12:08 CEST--- continuaba extrayendo 1.000 MW del sistema ibérico, reduciendo en un 22% la capacidad de soporte neto desde Francia. El tránsito resultante se volvió angular y térmicamente insostenible para el corredor transfronterizo.

![Pérdida de sincronismo y aislamiento de la península ibérica](/figuras/interconexion_francia_colapso.png)

La figura anterior recoge la inversión de los flujos en la frontera pirenaica durante la Fase 3, con la importación de emergencia de hasta 4.609 MW por las líneas AC, la extracción simultánea por el HVDC en modo de potencia constante y la apertura de las líneas AC por pérdida de sincronismo a las 12:33:21 CEST.

A las 12:33:21 CEST, las protecciones de pérdida de sincronismo abrieron los enlaces de corriente alterna para evitar el contagio al sistema europeo continental, aislando la península ibérica. Convertida en una isla eléctrica sin capacidad de autosostén tensional, las escasas máquinas síncronas remanentes se desconectaron en cascada. El "Cero de Tensión" definitivo se confirmó a las 12:33:29.741 CEST con el disparo del último grupo generador, cerrando el incidente sistémico más severo documentado en la historia del sistema eléctrico europeo continental.
