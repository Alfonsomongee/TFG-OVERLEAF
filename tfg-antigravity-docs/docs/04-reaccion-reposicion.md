# Reacción del Operador y Reposición del Suministro (Fase 4)

## Gestión de emergencia de Red Eléctrica

Tras la consumación del **Cero de Tensión** absoluto a las 12:33:30 CEST, el sistema eléctrico peninsular transitó de una crisis dinámica incontrolable a una fase de gestión de emergencia y reposición estructural. La magnitud del colapso ---pérdida de más de 15 GW y desconexión total del sistema síncrono continental--- obligó al Operador del Sistema (REE) a abandonar las lógicas de operación en régimen permanente dictadas por el P.O. 1.1 para activar los protocolos de emergencia previstos en el **Procedimiento de Operación 1.6** (P.O. 1.6).

![Cronograma oficial de las fases del colapso y la restauración](/figuras/cronograma_fases_gobierno.png)

El P.O. 1.1 establece los criterios de funcionamiento y seguridad para la operación del sistema en régimen permanente, fundamentados en el cumplimiento del Criterio $N-1$ y en el mantenimiento de las tensiones entre 380 kV y 435 kV en la red de transporte. La cascada del 28 de abril mostró las limitaciones de la validación estática de estos criterios frente a transitorios dinámicos ultrarrápidos en redes de baja inercia.

La reacción institucional fue inmediata y coordinada en varios frentes simultáneos:

- **12:34 CEST** — REE contactó con su homólogo portugués (REN) para confirmar que la totalidad de la red lusa se encontraba igualmente sin tensión
- **12:36 CEST** — Red Eléctrica notificó formalmente la situación al resto de operadores europeos a través del *ENTSO-E Awareness System* (EAS), modificando el estado operativo del bloque ibérico a "Restauración"
- **12:44 CEST** — REE y el Operador del Mercado Ibérico de Energía (OMIE) suspendieron todas las actividades de los mercados intradiarios y de servicios de ajuste

Esta suspensión otorgó a Red Eléctrica autoridad plena para despachar a los generadores exclusivamente bajo criterios de viabilidad técnica y termodinámica, marginando el mecanismo habitual de *Orden de Mérito* económico.

La estrategia técnica de recuperación se articuló mediante la activación del P.O. 1.6, que dictaminó la fragmentación controlada de la Península Ibérica en **siete áreas operativas independientes** ---Zona Sur, Tajo-Centro, Levante y otras--- durante la re-energización progresiva.

![Fragmentación topológica para la reposición del suministro (P.O. 1.6)](/figuras/islas_reposicion_entsoe.png)

Cada una de las siete islas eléctricas debía estabilizarse individualmente en términos de tensión y frecuencia antes de autorizarse su sincronización con las islas adyacentes, evitando así que las inestabilidades locales se propagasen entre zonas durante la recuperación.

La maniobra de emergencia combinó dos frentes simultáneos y complementarios:

- **Estrategia *Top-Down*** — solicitó apoyo externo urgente a Francia y Marruecos para disponer de una referencia de tensión y frecuencia externas estables
- **Estrategia *Bottom-Up*** — activó el arranque autónomo de las centrales hidroeléctricas internas de Galicia, Asturias y la cuenca del Duero, únicas instalaciones capaces de arrancar sin tensión externa de red

---

## Estrategia de *Black Start*

Ante la confirmación del cero de tensión peninsular, REE y REN decretaron la ejecución inmediata de la estrategia *Bottom-Up*. Dado que la práctica totalidad del parque generador ibérico estaba compuesto por *Recursos Basados en Inversores* (IBR) operando en modo *grid-following* ---tecnológicamente incapaces de generar una onda de tensión sin una red externa estable como referencia---, la supervivencia y el reinicio del sistema recayeron de forma exclusiva sobre las **máquinas síncronas convencionales** equipadas con capacidad de arranque autónomo (*Black Start*).

![Estrategia dual de re-energización Top-Down y Bottom-Up](/figuras/estrategia_reenergizacion_dual.png)

El primer eslabón de esta cadena de salvamento fueron las **centrales hidroeléctricas**, tanto fluyentes como de bombeo. Al no depender de sistemas térmicos auxiliares para iniciar su giro, estas instalaciones fueron las primeras en ser despachadas para energizar tramos de red aislados y crear las primeras "islas eléctricas" en torno a las cuencas del Duero, Galicia y Asturias.

Sin embargo, la operación de estos microsistemas mostró la dificultad de operar con inercias mínimas:

- La energización de líneas en vacío provocó transitorios capacitivos significativos
- Las islas formadas en Cantabria y Levante no se sostuvieron y tuvieron que ser reiniciadas
- La central asignada a la isla de Madrid no logró estabilizar sus parámetros tras varios intentos consecutivos
- El arranque autónomo en Andalucía resultó infructuoso, obligando a priorizar el apoyo externo desde Marruecos

![Despliegue temporal y eficacia del Black Start hidroeléctrico](/figuras/black_start_hidroelectrico.png)

Una vez que las islas hidroeléctricas lograron estabilizar mínimamente sus parámetros de tensión ($V$) y frecuencia ($f$), la estrategia viró hacia su consolidación electromecánica mediante la integración de grandes masas térmicas. La priorización inmediata fue el acoplamiento de las centrales de **Ciclo Combinado de Gas Natural (CCGT)** y, progresivamente, la alimentación de los servicios auxiliares de las centrales nucleares.

La conexión de estos grupos no perseguía inyectar volumen comercial de energía, sino actuar como **anclas dinámicas**: aportaban la inercia del sistema ($H$) y la potencia de cortocircuito ($S_{sc}$) indispensables para dotar a las islas de la robustez necesaria antes de autorizar la reconexión masiva de la demanda.

En paralelo, el sistema eléctrico portugués ejecutó un esquema de resiliencia análogo. REN se apoyó en la central hidroeléctrica HPP 1-Centro y el ciclo combinado CCGT 1-Norte. A las **20:22 CEST**, la sincronización de las islas portuguesas con las zonas españolas ya acopladas a la frecuencia continental europea marcó el hito que garantizó la viabilidad de la reposición total de la Península Ibérica.

---

## Coordinación internacional

La separación abrupta de la Península Ibérica del sistema síncrono de Europa Continental exigió la activación inmediata de los protocolos de soporte transfronterizo. Los *Centros de Coordinación Regional* (RCC) desempeñaron un papel dual: pusieron de manifiesto limitaciones analíticas de carácter preventivo y resultaron ser el pilar organizativo de la orquestación de la recuperación.

Durante las horas previas al incidente, el Centro de Coordinación Regional Coreso había ejecutado de forma rutinaria sus tareas normativas de planificación operativa. Todos los indicadores y modelos de red arrojaron un estado seguro ("OK"), sin anticipar congestiones ni violaciones del Criterio $N-1$.

![Validaciones de seguridad estática previas al colapso](/figuras/validaciones_rcc_coreso.png)

Esta calificación constata una limitación estructural del sistema europeo de monitorización: las herramientas de los RCC evalúan la seguridad mediante flujos de carga estáticos en régimen permanente, sin capacidad para anticipar fenómenos de inestabilidad de tensión o dinámicas ultrarrápidas asociadas a la baja inercia.

Una vez consumado el cero de tensión, la jerarquía de mando europea se activó a través de los **Monitores del Área Síncrona (SAM)**, operados conjuntamente por Swissgrid y Amprion. Entre las 12:49 y las 12:54 CEST, estos centros confirmaron la situación de Emergencia y establecieron una estructura de mando unificada:

- **REE** — líder de frecuencia para la isla ibérica desconectada
- **Swissgrid** — liderazgo para mantener estable el resto del continente
- **RTE** — líder general de resincronización (*Resynchronisation Leader*)

Por la frontera pirenaica, RTE activó ofertas en su mecanismo de balance interno por hasta 4.500 MW para sostener la exportación hacia España, posibilitando la energización progresiva de los corredores de 400 kV del norte y el este peninsular.

![Evolución del soporte transfronterizo desde Francia durante la reposición](/figuras/evolucion_carga_repuesta_francia.png)

Simultáneamente, en la frontera sur, la interconexión con Marruecos operada por ONEE se convirtió en el **ancla electromecánica de Andalucía**. A las 13:04 CEST se habilitó el flujo de soporte a través de la línea Puerto de la Cruz--Mellousa, inyectando cerca de 900 MW y aportando la referencia de tensión necesaria para energizar el sur peninsular.

![Inyección de potencia para el soporte Top-Down desde la frontera sur](/figuras/intercambio_marruecos_topdown.png)

---

## Evolución del mix durante la reposición

El éxito en la resincronización progresiva exigió al Operador del Sistema aplicar una discriminación tecnológica estricta en el despacho de generación. A pesar de que los parques solares y eólicos se encontraban físicamente intactos, su reconexión quedó restringida durante las primeras fases críticas de la recuperación.

Esta restricción obedeció a una limitación electromecánica fundamental: los inversores operando en modo *grid-following* **carecen de la capacidad de imponer una onda de tensión**. Sus bucles de enganche de fase (*PLL*) necesitan leer previamente una red externa robusta y estabilizada para inyectar corriente. En consecuencia, la responsabilidad íntegra de la re-energización recayó sobre el acoplamiento secuencial de las centrales síncronas.

![Evolución del mix tecnológico durante la re-energización peninsular](/figuras/evolucion_mix_reenergizacion.png)

La secuencia de recuperación fue la siguiente:

| Hora (CEST) | Hito |
|-------------|------|
| 13:07 | Primeros 31 MW suministrados a través de Irún |
| 23:32 | 21 grupos térmicos sincronizados — 13.039 MW (≈55% de la carga) |
| 00:06 (29A) | Reactivación del controlador maestro de reserva aFRR |
| 01:38 | Primeras consignas para inyección activa de parques eólicos |
| 07:05 | Reintegración total del régimen RCR |
| **07:05** | **99,95% del suministro eléctrico nacional restituido** |

![Desplome y recuperación de la demanda eléctrica peninsular](/figuras/recuperacion_demanda_peninsular.png)

La reposición de los 25 GW perdidos se completó tras casi **19 horas de maniobras ininterrumpidas**. Este episodio dejó una lección operativa de primera magnitud: en un sistema de alta penetración renovable, la recuperación tras un colapso total depende de forma crítica de la disponibilidad de generación síncrona convencional con capacidad de *Black Start*. Las tecnologías IBR, por diseño, no pueden iniciar la restauración de la red sin una referencia de tensión externa.
