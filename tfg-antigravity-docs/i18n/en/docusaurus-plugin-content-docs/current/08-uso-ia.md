# Discusión sobre el Uso de Inteligencia Artificial en el TFG (Capítulo 8)

La elaboración de este Trabajo de Fin de Grado se ha desarrollado en un contexto metodológico atípico: la concurrencia simultánea, durante el bienio 2024–2026, de una crisis sistémica en el sistema eléctrico ibérico y de una transformación acelerada en las herramientas de procesamiento de lenguaje natural. La disponibilidad de *Large Language Models* (LLMs) capaces de procesar documentos técnicos de cientos de páginas en pocos minutos coincidió con la publicación, en el plazo de un año, de cuatro informes periciales primarios y una decena de análisis académicos sobre el mismo evento. El presente capítulo documenta de forma transparente cómo se han integrado estas herramientas en el flujo de trabajo, qué tareas concretas han desempeñado, qué errores sistemáticos se han detectado y corregido, y qué reflexión epistemológica se desprende de todo ello para la práctica investigadora en ingeniería.

---

## Aplicación Metodológica: Uso de IA en la Estructuración, Síntesis y Extracción de Datos

El cuerpo documental de partida abarca expedientes técnicos, normativas de ENTSO-E, informes oficiales de extensión superior a las 200 páginas, simulaciones PSS/E reproducidas por el IIT-ICAI, actas de la CNMC, registros oscilográficos publicados por el NREL y un volumen amplio de hemeroteca especializada. Su lectura lineal sin mediación informática resultaba incompatible con los plazos académicos del TFG. La integración de modelos generativos de gran escala se ha articulado en torno a **cinco funciones operativas claramente delimitadas**, ninguna de las cuales involucra inferencia causal autónoma sobre la física del sistema.

### Las cinco funciones de asistencia IA

**1. Reconciliación cronológica**

El informe del Consejo de Seguridad Nacional, el de Red Eléctrica de España, el del IIT-ICAI y el factual de ENTSO-E describen los mismos hechos físicos del 28 de abril de 2025 con distintos niveles de granularidad temporal y, ocasionalmente, con desfases de hasta 200 ms entre versiones. La asistencia automática ha permitido construir una tabla maestra unificada de *timestamps* y referencias cruzadas que ha servido de andamiaje para los capítulos de anatomía del incidente y reacción y reposición.

**2. Mapeo sistemático de divergencias entre narrativas**

Cada informe pericial enmarca el incidente en un perímetro analítico distinto ---cumplimiento normativo, estabilidad capacitiva, oscilaciones inter-área, diseño de mercado--- y los puntos de fricción no son siempre evidentes a primera lectura. La extracción asistida de pasajes homólogos ha permitido localizar las afirmaciones técnicamente incompatibles entre fuentes, que constituyen la base del análisis comparativo de informes y de la síntesis de agentes.

**3. Tabulación cuantitativa**

La tabulación de magnitudes distribuidas a lo largo de los informes: valores zonales de inercia, penetración renovable instantánea, intercambios transfronterizos, cifras de deslastre por subfrecuencia (UFLS), aportaciones capacitivas atribuidas a la maniobra de mallado. Estas cifras dispersas, una vez consolidadas, han permitido construir las gráficas y tablas que articulan visualmente la narrativa técnica del trabajo.

**4. Soporte redaccional en español técnico**

Sugerencia de variantes léxicas, depuración de sinonimias, control de terminología y reformulación de pasajes de prosa académica densa. Este apoyo no ha alterado en ningún caso la estructura argumental ni las decisiones de contenido, que son responsabilidad exclusiva del autor.

**5. Andamiaje de elementos gráficos**

Generación de borradores en TikZ y `pgfplots` a partir de descripciones textuales, posteriormente revisados, depurados y validados manualmente para asegurar consistencia visual con el resto del documento y fidelidad a los datos representados.

### El flujo de trabajo con filtro de validación física

El elemento metodológicamente decisivo de este flujo no es la asistencia LLM en sí misma, sino el **filtro de validación física** que se interpone entre cualquier salida del modelo y su incorporación al cuerpo del trabajo. Las fuentes primarias alimentan a la asistencia LLM, cuyo resultado pasa obligatoriamente por un filtro de validación física antes de incorporarse al cuerpo del trabajo. Cuando el filtro detecta una inferencia incompatible con la mecánica del sistema (alucinación), el *prompt* se reformula con restricciones semánticas adicionales y el ciclo se reinicia.

```
[Informes primarios] → [Asistencia LLM] → [Filtro validación física] → [Resultado validado]
                                ↑                      |
                                └──────────────────────┘
                              Reformulación de prompt ante alucinación detectada
```

---

## Validación y Verificación: Contraste Riguroso con la Física del Sistema

La utilización de modelos generativos en un dominio tan denso en relaciones causales como la dinámica de sistemas de potencia revela, de forma sistemática, un comportamiento que los sistemas eléctricos no toleran: **la inferencia por analogía estadística**. Los LLM, entrenados sobre grandes corpus generales, tienden a aplicar patrones causales *típicos* ---los más frecuentes en la literatura de su corpus de entrenamiento--- a casos cuya estructura física es *atípica*.

El 28 de abril de 2025 es, por su naturaleza dual (estabilidad de tensión en lugar de balance de frecuencia), un caso atípico respecto a la mayoría de los apagones documentados en la bibliografía técnica del siglo XX, lo que ha hecho especialmente productiva la observación de los puntos en los que la IA "por defecto" se desviaba del fenómeno real.

### Casos representativos de alucinación detectada y corrección física aplicada

| Fenómeno | Inferencia errónea por defecto del LLM | Corrección física aplicada | Estrategia de *prompt* correctora |
|----------|---------------------------------------|---------------------------|----------------------------------|
| **Paradoja del UFLS** | El deslastre de cargas por subfrecuencia "salvó" áreas del sistema al recuperar el balance de potencia activa. | El UFLS es ciego al voltaje: al desconectar carga retiró sumideros de reactiva inductiva en pleno transitorio capacitivo, agravando la sobretensión. | Restricción explícita: razonar exclusivamente en el plano $Q$-$V$, ignorando la lógica frecuencia-potencia activa habitual en apagones clásicos. |
| **Tap-Lag** | Los OLTC respondieron correctamente al transitorio elevando o rebajando la tensión secundaria de forma proporcional. | Los retardos intencionales de los OLTC ---diseñados para evitar *hunting*--- los dejaron desfasados frente a un transitorio de decenas de milisegundos, multiplicando la tensión hacia la red de 220 kV y 132 kV. | Inyección de la constante de tiempo real del conjunto electromecánico OLTC y prohibición de asumir respuesta cuasi-instantánea del cambiador de tomas. |
| **Maniobra de mallado y aporte capacitivo** | El mallado redujo la impedancia del sistema y, por tanto, aumentó la estabilidad de tensión. | En condiciones de baja carga, el mallado activó la admitancia transversal de las líneas de 400 kV (efecto Ferranti), inyectando los 1.050 MVAr capacitivos que precipitaron la sobretensión. | Restricción al régimen "línea descargada" y exigencia de calcular el balance de reactiva con la admitancia capacitiva $Y_t$ en el modelo $\pi$ de la línea. |
| **Oscilación de 0,6 Hz** | Modo electromecánico inter-área clásico análogo a los modos de 0,2 Hz del sistema síncrono europeo. | Modo de origen controvertido entre informes (forzado por planta generadora según ICAI; modo natural del sistema según REE), que el TFG presenta de forma comparada sin resolución editorial. | Veto a la elección unilateral entre ambas hipótesis y obligación de presentar las dos lecturas con atribución a su fuente. |

### Análisis detallado de los casos más relevantes

**La Paradoja del UFLS**

El caso ilustra con especial claridad el patrón de error. Ante la consulta sobre el papel del deslastre de carga en el desarrollo del incidente, los modelos consultados ofrecieron sistemáticamente una interpretación heredada de los apagones clásicos, en los que el UFLS constituye la última línea de defensa y consigue habitualmente preservar porciones de la red al recuperar el balance frecuencia-potencia activa.

Esta inferencia es físicamente correcta para el universo de eventos sobre los que el modelo ha sido entrenado, pero resulta **inválida para el 28A**: en un colapso dominado por el plano $Q$-$V$, la activación del UFLS retiró simultáneamente los sumideros de potencia reactiva ($Q$) inductiva que aportaban las cargas desconectadas, lo que agravó la sobretensión en lugar de mitigarla. La corrección requirió formular el *prompt* con una restricción explícita sobre el plano de análisis y verificar manualmente que el razonamiento resultante fuese consistente con la oscilografía publicada por el NREL en la franja temporal 12:33:19–12:33:27.

**El Tap-Lag**

La descripción cualitativa que los modelos producen del cambiador de tomas en carga (OLTC) es correcta en régimen estacionario, pero asume por defecto una respuesta proporcional e instantánea que el conjunto electromecánico real no posee. El retardo intencional introducido para evitar oscilación mecánica del cambiador (*hunting*) se tradujo el 28A en una relación de transformación desfasada respecto al transitorio eléctrico, lo que multiplicó la sobretensión hacia las redes de 220 kV y 132 kV ---fenómeno invisible para el SCADA del operador, anclado en las medidas del primario de 400 kV---.

Toda la cadena causal del Tap-Lag exigió describir al modelo, por adelantado, las constantes de tiempo del OLTC y prohibirle asumir respuesta cuasi-instantánea.

**El aporte capacitivo del mallado**

La inyección estimada de 1.050 MVAr capacitivos asociada a la maniobra de mallado debía corresponderse con el efecto de la admitancia transversal ($Y_t$) de las líneas de 400 kV operando en régimen descargado, fenómeno conocido como efecto Ferranti. La validación consistió en reproducir el balance de reactiva sobre el modelo en $\pi$ de la línea, contrastando la magnitud con la oscilografía y con el diagnóstico independiente del informe IIT-ICAI.

**La oscilación de 0,6 Hz**

Este caso ilustra una limitación específica del uso de IA en contextos forenses con divergencia institucional. Los modelos tienden a producir una respuesta *integrada* ---la lectura "más probable" promediada sobre las fuentes--- cuando el rigor pericial exige preservar la divergencia. El origen del modo es precisamente el dato que el TFG debe preservar como discrepancia, no resolver editorialmente. La estrategia correctora exigió vetar al modelo cualquier elección unilateral entre las dos hipótesis y obligarle a producir versiones duales con atribución explícita.

---

## Reflexión Crítica sobre la IA en la Ingeniería de Investigación

La experiencia documentada en las secciones anteriores invita a una reflexión epistemológica más amplia. La conclusión que se desprende del trabajo desarrollado no es triunfalista ni catastrofista, sino **estructural**: los modelos generativos son potentes *aceleradores* de los procesos cognitivos del investigador, pero operan sobre una lógica probabilística que no coincide con la lógica determinista que rige la física de los sistemas materiales.

### Primera implicación: metodológica

El uso de IA no exime al investigador de dominar el contenido técnico de su objeto de estudio; al contrario, lo exige con mayor severidad. **Solo un investigador con competencia técnica suficiente para identificar una inferencia físicamente imposible puede emplear con seguridad un modelo capaz de producirla con fluidez retórica.** La asimetría entre la verosimilitud lingüística del *output* y su corrección material constituye el principal riesgo asociado al uso de estas herramientas en dominios técnicos exigentes, y solo puede neutralizarse mediante un dominio del contenido que la herramienta no puede aportar.

### Segunda implicación: ético-académica

La implicación se refiere a la atribución de autoría intelectual. La asistencia automática se ha empleado en este trabajo como herramienta de procesamiento, no como sustituto del razonamiento. **Toda decisión de contenido** ---el encuadre del problema, la jerarquía de fuentes, la formulación de la tesis causal sobre el colapso del 28A, la valoración comparada de las narrativas institucionales y las conclusiones del último capítulo--- **es responsabilidad exclusiva del autor**. La IA no firma TFGs ni se sienta ante un tribunal: el ingeniero rubrica con su nombre la causalidad material de los hechos expuestos, y esa rúbrica es intransferible.

### Tercera implicación: disciplinar y prospectiva

Los sistemas eléctricos de la próxima década ---dominados por electrónica de potencia, con dinámica relevante en la escala sub-cíclica y con interacciones tensión-reactiva que el operador convencional no captura en tiempo real--- van a requerir herramientas de soporte a la decisión que combinen la velocidad de procesamiento de los modelos algorítmicos con la robustez física de los simuladores tipo PSS/E.

La integración no es trivial: los simuladores resuelven ecuaciones; los LLM aproximan distribuciones de probabilidad. **La arquitectura híbrida** ---LLM como interfaz semántica y de síntesis, simuladores físicos como motor de inferencia causal--- es, plausiblemente, la dirección hacia la que evolucionarán las herramientas de ingeniería de sistemas de potencia. Su desarrollo, sin embargo, requerirá exactamente la misma vigilancia epistemológica que ha estructurado el flujo de trabajo del presente TFG: tener siempre presente qué hace cada herramienta y qué se le pide explícitamente que no haga.

:::note
El registro detallado del flujo de *prompts* restrictivos empleados, junto con ejemplos representativos de las correcciones aplicadas, se documenta en el Anexo de Prompts, siguiendo las recomendaciones de buenas prácticas en transparencia metodológica para la integración de modelos generativos en investigación de grado y posgrado.
:::
