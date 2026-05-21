---
sidebar_position: 1
---

import GlossaryLink from '@site/src/components/GlossaryLink';

# El impacto en Francia y Portugal

El colapso del sistema eléctrico ibérico no se detuvo en los Pirineos ni en el Guadiana. La violencia del transitorio electrodinámico del 28-A irradió una onda de choque a través de las interconexiones que sometió a la red francesa a un estrés operativo extremo y arrastró al sistema portugués a un apagón total del que solo pudo salir mediante una restauración de diecisiete horas desde cero. Estos dos episodios —uno contenido, el otro catastrófico— ilustran con precisión las condiciones que determinan si un sistema puede rechazar una perturbación de esta magnitud o sucumbir ante ella.

## Francia (RTE): el sistema que resistió en el límite

### El disparo de Golfech 1 y las corrientes de secuencia negativa

El mecanismo de propagación hacia Francia estuvo dominado por un exceso súbito y masivo de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> capacitiva. Segundos antes de la separación, el enlace <GlossaryLink term="HVDC">HVDC</GlossaryLink> Baixas–Santa Llogaia absorbía **870 MVAr** actuando como sumidero dinámico de regulación de tensión en la frontera. La pérdida instantánea de este sumidero, combinada con la apertura de las líneas de 400 kV que quedaron energizadas en vacío desde el lado francés —generando reactiva por <GlossaryLink term="Efecto Ferranti">efecto Ferranti</GlossaryLink> capacitivo—, indujo un perfil de sobretensiones transitorias severas que se propagó velozmente por todo el suroeste francés.

Frente a esta escalada, el control secundario de tensión de RTE forzó a los grandes alternadores síncronos de la región a operar en subexcitación profunda. El caso más crítico fue la **Unidad 1 de la central nuclear de Golfech**, un bloque de **1.290 MW** de potencia nominal. Para contener el perfil de tensiones, sus reguladores automáticos de tensión (AVR) redujeron drásticamente la corriente de excitación del rotor, llevando a la máquina a absorber la cifra de **426 MVAr** a las 12:33 CEST.

Esta condición extrema compromete severamente la estabilidad de la máquina. Al reducirse el flujo magnético en el entrehierro, el par sincronizante que mantiene al rotor acoplado a la frecuencia de la red se debilita. Simultáneamente, el carácter asimétrico de los transitorios de apertura en la frontera generó corrientes de secuencia negativa considerables en la red de 400 kV. La teoría de componentes simétricas establece que estas corrientes producen un campo magnético giratorio en sentido opuesto al giro del rotor, induciendo corrientes parásitas de doble frecuencia (100 Hz) en el cuerpo macizo del rotor y en los anillos de retención, con calentamiento adiabático severo en cuestión de segundos.

A las **12:33:35.759 CEST** — apenas **quince segundos** después del colapso ibérico — la combinación de inestabilidad por subexcitación y calentamiento por desbalance de fases activó los relés de protección interna del generador (relé de pérdida de excitación ANSI 40 y relé de desbalance / corriente de secuencia negativa ANSI 46), forzando el disparo y la desconexión total de Golfech 1. La pérdida simultánea del HVDC y de este pilar nuclear obligó a RTE a reconfigurar sus flujos desde regiones más septentrionales para evitar un colapso en cascada propio. El reactor fue resincronizado satisfactoriamente a la red el 29 de abril.

### Disparo en la red de subtransmisión: la línea Dax-Arriosses (63 kV)

El impacto no se limitó a la generación convencional. El registro más revelador de la violencia del transitorio en Francia fue el disparo de la **línea aérea de 63 kV Dax–Arriosses** a las **12:33:20.551 CEST**, ordenado por las protecciones de pérdida de sincronismo (relé ANSI 78), configuradas para actuar en el primer latido (_first beat_) de la oscilación.

La actuación de una protección de pérdida de sincronismo en un nivel de 63 kV es extraordinariamente anómala: las oscilaciones de potencia (_power swinging_) suelen detectarse en corredores de 400 kV. Su aparición en 63 kV indica que los <GlossaryLink term="Phase-Locked Loop (PLL)">PLL</GlossaryLink> de una agregación masiva de inversores en Aquitania perdieron su referencia angular respecto a la red principal por el transitorio asimétrico y la sobretensión. El relé interpretó la inversión cíclica de las corrientes de los inversores descontrolados como una pérdida de sincronismo clásica de máquinas rotativas, aislando la subred.

| Elemento crítico en Francia | Hora (CEST) | Causa técnica | Impacto sistémico |
| --- | --- | --- | --- |
| Enlace HVDC Baixas–Santa Llogaia | 12:33:20 | Pérdida de la red ibérica receptora | Pérdida súbita de sumidero de 870 MVAr |
| Línea 63 kV Dax–Arriosses | 12:33:20.551 | Relé de pérdida de sincronismo (1er latido) | Aislamiento de subred y desconexión de IBRs locales |
| Unidad Nuclear Golfech 1 (1.290 MW) | 12:33:35.759 | Límite de subexcitación / relés ANSI 40 y 46 | Pérdida de absorción de 426 MVAr; estrés estructural |

### RTE como «nodo infinito» durante la restauración Top-Down

A las **12:40 CEST**, el perfil de tensiones en el suroeste francés logró estabilizarse. A partir de ese instante, la red de RTE asumió un rol estructural insustituible: proporcionar un anclaje electromagnético firme para la restauración del sistema español mediante una estrategia Top-Down.

En la teoría de sistemas de potencia, un **«nodo infinito»** (_infinite bus_) es una fuente de tensión con inercia infinita e impedancia de Thévenin equivalente nula. En la práctica, al estar Francia conectada solidariamente a la inmensa masa inercial de Europa Continental, su red de 400 kV se comportó operativamente como un nodo infinito para la colapsada red ibérica.

A las **12:39 CEST**, REE solicitó formalmente a RTE la reposición de tensión en la subestación de Hernani desde la subestación francesa de Argia. A las **12:41 CEST**, RTE acordó canalizar hasta **400 MW iniciales** para estabilizar las primeras reconexiones en el norte de España. Al cerrar el interruptor fronterizo, Francia impuso su frecuencia nominal (50,00 Hz) y su control de tensión rígido sobre el primer nudo español. Esta potencia de cortocircuito importada absorbió los brutales desequilibrios de reactiva y los escalones de carga activa inevitables al energizar líneas de 400 kV en vacío. Sin el anclaje inercial de este nodo infinito francés, los intentos de REE por restablecer la tensión habrían estado sujetos a oscilaciones insoportables que habrían disparado nuevamente sus protecciones. A lo largo de la tarde, el flujo estabilizador francés se incrementó hasta los **1.400 MW**, constituyendo la columna vertebral de la normalización del sistema español.

## Portugal (REN): el colapso arrastrado y la restauración Bottom-Up

### Por qué Portugal no pudo aislarse

Mientras Francia disponía de una red rígida capaz de rechazar la perturbación cortando los enlaces, la infraestructura de <GlossaryLink term="REE">REN</GlossaryLink> operaba con un acoplamiento eléctrico y geográfico tan denso con España que configurar una operación en isla aislada a tiempo resultó físicamente imposible. Portugal sucumbió en un colapso arrastrado dominado por el acoplamiento reactiva-tensión (Q-V): los disparos en el sur de España retiraron nudos críticos de absorción reactiva, la sobretensión se propagó sin resistencia hacia las subestaciones portuguesas, y el descenso de frecuencia activó los esquemas combinados de <GlossaryLink term="UFLS (Underfrequency Load Shedding)">UFLS</GlossaryLink> de REE y REN. A pesar del deslastre masivo, el <GlossaryLink term="RoCoF (Rate of Change of Frequency)">RoCoF</GlossaryLink> fue tan pronunciado que los retardos mecánicos de los disyuntores (50–100 ms) hicieron imposible equilibrar el sistema antes de que las protecciones de mínima frecuencia desengancharan las últimas turbinas térmicas.

| Umbral de frecuencia (Hz) | Carga deslastrada en Portugal (MW) | Carga deslastrada en España (MW) | Total (MW) |
| :-: | :-: | :-: | :-: |
| 49,0 | 381 | 1.669 | 2.050 |
| 48,8 | 450 | 1.575 | 2.025 |
| 48,6 | 438 | 1.524 | 1.962 |
| 48,4 | 218 | 1.294 | 1.512 |
| 48,2 | 470 | 2.168 | 2.638 |
| 48,0 | 359 | 588 | 947 |

_Actuación combinada del UFLS de REE y REN por escalones de frecuencia. Fuente: registros PMU de REN y REE._

### La restauración: crónica de fallos y soluciones

Sin ningún enlace externo disponible, REN ejecutó una restauración <GlossaryLink term="Black Start">Bottom-Up</GlossaryLink> basada íntegramente en sus propios recursos de arranque autónomo. La secuencia expone las severas limitaciones que las leyes del electromagnetismo imponen al proceso.

**12:35–12:45 CEST — Primera isla en Zêzere.** REN ordenó el arranque autónomo de la HPP 1-Centro. A las 12:45, la central operaba en modo isócrono y logró energizar la barra de 220 kV de la subestación de Zêzere. Se había formado la primera isla.

**12:49 CEST — Colapso por _sympathetic inrush_.** El protocolo exigía energizar el Transformador 4 de Zêzere (170 MVA, relación 220/60 kV). Al cerrar el interruptor, HPP 1-Centro disparó instantáneamente. La causa fue el **fenómeno de _sympathetic inrush current_**: un transformador de 170 MVA, al ser energizado desde una red débil —una única máquina hidroeléctrica con baja potencia de cortocircuito y alta impedancia subtransitoria—, demanda una corriente magnetizante que puede exceder en un orden de magnitud la corriente nominal, con alto contenido de armónicos de segundo orden y factor de potencia extremadamente bajo. El generador aislado no pudo proveer esta ráfaga de potencia reactiva; el hundimiento transitorio de tensión activó los relés de protección. Los intentos de arrancar pequeños grupos auxiliares dentro de la misma planta fracasaron durante las siguientes tres horas.

**12:43–16:38 CEST — Fallos en los ciclos combinados.** Paralelamente, REN despachó a las 12:43 la orden de arranque autónomo para el CCGT 1-Norte. A pesar de que la turbina de gas respondió mecánicamente, la central fue incapaz de cerrar el interruptor del generador durante horas: los bancos de baterías de corriente continua de la subestación presentaban caída de tensión por descarga prolongada, dejando sin alimentación las bobinas de cierre de los disyuntores de alta tensión. El bloqueo se solventó finalmente a las **16:38 CEST**.

**15:40–15:55 CEST — Segundo intento y nuevo colapso.** Tras labores de reconfiguración, HPP 1-Centro reinició a las 15:40 y logró energizar nuevamente la barra de 220 kV. A las 15:51 se conectó un bloque de demanda local de **5 MW**, pero la fragilidad inercial de la isla fue tal que las fluctuaciones provocaron un nuevo disparo a las 15:55.

### La maniobra decisiva: Torrão como compensador síncrono puro

Era evidente que la isla carecía de la rigidez necesaria (potencia de cortocircuito) para absorber escalones de carga. Tras reiniciar HPP 1-Centro a las **16:13 CEST**, REN ejecutó a las **17:23 CEST** una maniobra de máxima sofisticación técnica: arrancó la **Unidad 2 del HPP Torrão**, pero no para inyectar potencia activa, sino en **modo de <GlossaryLink term="Compensadores Síncronos (SynCons)">compensador síncrono</GlossaryLink> puro**.

Operar una central hidroeléctrica como compensador síncrono implica vaciar la cámara de la turbina inyectando aire a presión (_depresión de la cola de agua_), permitiendo que el rodete gire libremente en el aire acoplado a la red. El generador consume una cantidad marginal de potencia activa para vencer la fricción mecánica, pero mediante el control de su sistema de excitación inyecta o absorbe masivas cantidades de <GlossaryLink term="Potencia reactiva">potencia reactiva</GlossaryLink> de manera instantánea. Más crítico aún: la enorme masa rotante del rotor de Torrão aportó <GlossaryLink term="Inercia (H)">inercia</GlossaryLink> cinemática pura y multiplicó la potencia de cortocircuito de la isla de Zêzere.

Esta maniobra actuó como amortiguador electrodinámico. La tensión en la isla se estabilizó, permitiendo desde las **16:26 CEST** la reposición progresiva de carga en las redes de 60 kV y 150 kV y la extensión de tensión a las plantas HPP 2 y HPP 3 Centro. A las **16:38 CEST** se estableció la segunda zona segura de restauración desde el CCGT 1-Norte.

### Sincronización a 0 MW y normalización total

Hacia las 20:00 CEST, las dos islas portuguesas habían sido malladas internamente, pero seguían operando de manera asíncrona respecto a España y el resto de Europa. El paso más delicado era el acoplamiento con la red de REE, ya sincronizada con el nodo infinito francés.

A las **20:25 CEST**, se procedió al cierre de la interconexión bajo un requisito técnico innegociable: un **programa de intercambio de 0 MW**. La física subyacente se rige por la ecuación de transferencia de potencia entre dos áreas síncronas:

$$P = \frac{V_1 V_2}{X} \sin\delta$$

Para cerrar el interruptor de interconexión sin generar un transitorio destructivo de potencia sincronizante, la diferencia de ángulo de fase ($\delta$) entre el nodo portugués y el español debía ser exactamente cero y las magnitudes de tensión iguales. Al establecer una consigna de 0 MW en los sistemas de Control Automático de Generación (AGC), los operadores garantizaron que ninguna de las dos redes intentara exportar inercia hacia la otra en el instante del acoplamiento. Un error habría forzado un flujo violento, disparando las protecciones direccionales y precipitando a Portugal en un segundo apagón.

Con el éxito de la maniobra, Portugal recuperó la referencia síncrona continental. La robustez proporcionada por la interconexión permitió acelerar el levantamiento del resto de la demanda, alcanzando la normalización total a las **00:22 del 29 de abril** — **diecisiete horas** después del cero de tensión.
