# Conclusiones (Capítulo 9)

El análisis desarrollado en los ocho capítulos precedentes permite formular un conjunto de conclusiones técnicas, regulatorias y metodológicas de primer orden. El colapso del sistema eléctrico ibérico del 28 de abril de 2025 no fue un accidente impredecible: fue la cristalización de vulnerabilidades estructurales que los marcos de análisis disponibles no estaban diseñados para detectar. Esta distinción tiene consecuencias de largo alcance para el diseño de los sistemas eléctricos de la próxima generación.

---

## 1. El colapso del 28A fue un fallo de control, no de energía

La primera conclusión, y la más contraintuitiva para el debate público, es que el sistema eléctrico ibérico disponía de recursos energéticos suficientes en el momento del colapso. La generación total ascendía a 33.612 MW, con una demanda ligeramente inferior. Cuatro reactores nucleares estaban acoplados. El RoCoF registrado no superó 1 Hz/s durante la mayor parte de la cascada. La constante de inercia equivalente del sistema, $H = 2{,}3$ s, se encontraba por encima del umbral de 2,0 s recomendado por ENTSO-E.

El colapso fue un fallo de **control de tensión y potencia reactiva**, no de balance de potencia activa. Esta distinción invalida una parte significativa del debate mediático posterior, que se articuló en torno a argumentos de "falta de generación firme", "insuficiencia de inercia" o "exceso de renovables". Los cuatro informes técnicos analizados ---Gobierno/REE, Redeia, IIT-ICAI/AELEC y ENTSO-E--- convergen en este punto.

---

## 2. El mecanismo físico del colapso: una cadena causal con tres eslabones

El análisis forense reconstruye una cadena causal de tres eslabones encadenados:

**Eslabón 1 — Fragilización estructural de la red**: La producción masiva de energía solar fotovoltaica en el sur peninsular había desplazado por orden de mérito a las centrales de ciclo combinado, eliminando las fuentes de potencia de cortocircuito ($S_{sc}$) que dan rigidez eléctrica a los nudos de la red de transporte. Amplias zonas de la Península operaban con $\mathrm{SCR} < 2$ (categoría "red muy débil"), condición que hace a los inversores GFL especialmente vulnerables a perturbaciones de tensión.

**Eslabón 2 — Inyección capacitiva del mallado**: La configuración de red adoptada ese día, con varias líneas de 400 kV operando prácticamente en vacío, activó el efecto Ferranti en su versión más severa. La inyección estimada de 1,05–2,4 GVAr de potencia reactiva capacitiva generó una presión de sobretensión sistémica que el parque de generación, operando mayoritariamente en modo GFL con factor de potencia fijo, no tenía capacidad de contrarrestar.

**Eslabón 3 — Brecha de observabilidad**: El fenómeno Tap-Lag, producido por el retardo electromecánico de los OLTC, creó una brecha de observabilidad crítica: el SCADA del Centro de Control mostraba tensiones dentro del rango operativo normal (418 kV en Carmona) mientras la tensión real en el lado de 220 kV había colapsado a 244 kV. El Operador del Sistema tomó decisiones basándose en información que no reflejaba el estado real de la red en los minutos críticos previos al colapso.

La combinación de estos tres eslabones produjo la cascada de 11 segundos entre las 12:33:18 y las 12:33:29 CEST, con una pérdida de más de 15 GW y el cero de tensión peninsular.

---

## 3. Las narrativas institucionales son parcialmente irreconciliables

El análisis comparativo de los cuatro informes técnicos revela un patrón de **selección asimétrica de evidencias**: cada actor institucional incorporó los factores causales consistentes con su posición regulatoria y omitió, suavizó o cuestionó los que la contradecían.

- El **Gobierno y REE** centran la responsabilidad en el incumplimiento del P.O. 7.4 por parte de los generadores IBR (22% operando fuera de curvas de reactiva), eludiendo el debate sobre si la configuración de mallado adoptada ese día fue un factor desencadenante.

- **Redeia** defiende que la configuración de red cumplía todos los criterios del P.O. 1.1 y que los modelos estáticos mostraban márgenes de seguridad adecuados, apuntando al incumplimiento de las curvas de reactiva como causa primaria.

- **IIT-ICAI/AELEC** propone una causalidad físicamente distinta: la vulnerabilidad sistémica era estructural e independiente del comportamiento individual de los generadores; el colapso habría ocurrido aunque todos los inversores hubiesen cumplido sus contratos de reactiva.

- **ENTSO-E** sitúa el problema en el nivel del paradigma tecnológico: la insuficiencia del modo GFL en sistemas de alta penetración renovable es estructural y solo resoluble mediante la transición al modo grid-forming.

Los siete puntos de consenso ---naturaleza del colapso (tensión, no frecuencia), actuación correcta de protecciones, imprescindibilidad del Black Start hidroeléctrico, insuficiencia regulatoria, necesidad de PMU, necesidad de GFM--- son tan relevantes como las cinco divergencias irreconciliables. El debate técnico sobre el 28A permanece abierto en sus ejes más importantes, y sus implicaciones en términos de responsabilidad civil y diseño regulatorio son de primer orden.

---

## 4. La recuperación demostró la dependencia crítica de la generación síncrona

Las casi 19 horas de maniobras de recuperación ---desde el cero de tensión a las 12:33 CEST del 28 de abril hasta la restitución del 99,95% del suministro a las 07:05 CEST del 29 de abril--- dejaron una lección operativa de primera magnitud: **en un sistema de alta penetración renovable, la recuperación tras un colapso total depende de forma crítica de la disponibilidad de generación síncrona convencional con capacidad de Black Start**.

Las centrales hidroeléctricas de Galicia, Asturias y la cuenca del Duero fueron el primer eslabón de la cadena de salvamento, precisamente porque son las únicas instalaciones capaces de arrancar sin tensión externa de red. Los 78% de la capacidad instalada activa en el momento del incidente ---inversores GFL--- no podían contribuir a la re-energización porque sus bucles PLL necesitan leer una red estable antes de poder inyectar corriente. La paradoja del colapso del 28A es que el mismo parque que lo provocó fue incapaz de contribuir a su solución.

La sostenibilidad de la capacidad de Black Start en sistemas con creciente penetración renovable es una de las preguntas regulatorias más urgentes que el incidente plantea.

---

## 5. Las reformas regulatorias necesarias trascienden los ajustes incrementales

Las propuestas contenidas en los cuatro informes técnicos, sintetizadas en la reforma del P.O. 7.4 y en el NC RfG 2.0 de ENTSO-E, convergen en un diagnóstico común: las reformas necesarias no son ajustes incrementales al marco existente sino transformaciones estructurales del paradigma de operación y remuneración del sistema.

**En el ámbito tecnológico**, la transición del paradigma GFL al GFM es ineludible para sistemas con penetración de IBR superior al 60–80%. La arquitectura híbrida ---BESS-GFM para velocidad de control y SynCons para potencia de cortocircuito e inercia rotacional genuina--- es la solución estructural que la física del sistema descarbonizado impone.

**En el ámbito de la observabilidad**, el despliegue de PMU en todos los nudos de 400 kV y la integración de su información en los sistemas de decisión del operador en tiempo real es condición necesaria para detectar fenómenos como el Tap-Lag antes de que se conviertan en cascadas.

**En el ámbito del mercado**, los atributos físicos que los sistemas síncronos aportaban de forma inherente ---inercia, potencia de cortocircuito, control autónomo de tensión--- han dejado de ser externalidades gratuitas. Su provisión debe ser definida, verificada y remunerada explícitamente mediante mercados de Servicios Esenciales de Confiabilidad (ERS) con señales de precio geográficamente granulares. Sin esa traducción económica de la resiliencia, ninguna exigencia técnica del NC RfG 2.0 resultará sostenible en el medio plazo.

---

## 6. El debate comunicativo como variable sistémica

El capítulo de impacto comunicativo demostró que la distancia entre el consenso técnico y la narrativa mediática dominante es, en sí misma, una consecuencia del 28A con implicaciones regulatorias concretas. Las reformas necesarias requieren un nivel de consenso político sostenido que la polarización del debate público dificultó durante los meses posteriores al incidente.

La respuesta institucional a eventos de alta complejidad técnica debe incluir **protocolos de comunicación de crisis** que ocupen el espacio informativo con mensajes técnicos verificables en las primeras horas. El vacío de cinco horas entre el cero de tensión y la primera comparecencia oficial fue, desde la perspectiva de la comunicación de crisis, tan costoso como la propia cascada eléctrica.

---

## 7. Implicaciones para el sistema eléctrico europeo

El colapso ibérico no fue un evento aislado. Fue la primera manifestación documentada, a escala de sistema completo, de las vulnerabilidades inherentes a los sistemas eléctricos de alta penetración IBR operados con los códigos de red diseñados para el paradigma síncrono del siglo XX. La protección del sistema continental europeo ---que funcionó correctamente al desconectar automáticamente la Península a las 12:33:21 CEST mediante las protecciones OST--- no debe interpretarse como una garantía de inmunidad: es una línea de defensa que evitó la propagación del colapso, pero cuya activación reafirma la necesidad de reforzar la resiliencia interna de cada zona síncrona.

Los escenarios de penetración renovable del 80–95% que los objetivos climáticos europeos de 2035–2050 implican reproducirán las condiciones del 28A con frecuencia creciente, en sistemas que no cuenten con las reformas estructurales identificadas. El apagón ibérico no fue el último de este tipo; fue el aviso más costoso y mejor documentado que el sistema eléctrico europeo ha recibido sobre lo que la física del próximo sistema energético exige.

---

## Síntesis Final

El 28 de abril de 2025 colapsó en 11 segundos el sistema eléctrico de la Península Ibérica. La recuperación requirió casi 19 horas. Las causas exactas permanecen técnicamente disputadas entre cuatro actores institucionales con conclusiones parcialmente irreconciliables. Lo que no está en disputa es la lección central: **un sistema con 82% de penetración renovable instantánea, operado con las herramientas de control y observabilidad diseñadas para el paradigma síncrono, carece de los recursos electromecánicos necesarios para resistir perturbaciones que en redes convencionales habrían sido contingencias manejables**.

La descarbonización del sistema eléctrico no es negociable desde la perspectiva climática. Pero la forma en que se materializa —las tecnologías que se instalan, los servicios que se definen y remuneran, los protocolos de operación que se adoptan— determina si el sistema resultante es resiliente o frágil ante la física de sus propios componentes. El 28A es la demostración empírica más contundente disponible de que ambas cosas —descarbonización y resiliencia— son compatibles, pero solo si se abordan de forma simultánea y con el rigor técnico que la física del sistema impone.

---

*Alfonso Monge Díaz Ángel — ETSI, Universidad de Sevilla — TFG 2026*
