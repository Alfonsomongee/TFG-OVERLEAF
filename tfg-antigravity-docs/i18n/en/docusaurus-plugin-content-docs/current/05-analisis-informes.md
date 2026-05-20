# Análisis Comparativo de Informes Técnicos (Fase 5)

El apagón ibérico del 28 de abril de 2025 generó una producción documental de carácter técnico sin precedentes en la historia del sistema eléctrico europeo. En los meses posteriores al incidente, cuatro actores institucionales con capacidad de análisis y legitimidad regulatoria publicaron informes técnicos con conclusiones parcialmente contradictorias sobre las causas del colapso.

Este capítulo confronta las cuatro narrativas técnicas para identificar tanto los consensos metodológicos como las divergencias irreconciliables, con el objetivo de situar el debate en sus ejes físicos fundamentales.

---

## Visión del Gobierno y REE

El informe de la Comisión Técnica designada por el Gobierno, publicado en colaboración con Red Eléctrica de España, atribuye el colapso a una **causalidad multifactorial** en la que concurren tres factores simultáneos:

1. **Incumplimiento normativo generalizado del parque IBR**: El análisis de los registros SCADA de las 24 horas previas al incidente determinó que el **22% de los inversores fotovoltaicos** conectados a la red peninsular operaban fuera de los rangos de tensión reactive y factor de potencia exigidos por el **P.O. 7.4** (*Servicio de control de tensión de la red de transporte*). Esta desviación sistemática, aunque individualmente dentro de márgenes tolerables, comprometió la capacidad global del sistema para absorber perturbaciones de tensión.

2. **Gestión dinámica del mallado peninsular**: La configuración de red adoptada el 28 de abril, con la desconexión de varios elementos del mallado de 400 kV en la zona sur-occidental, fue analizada por el Gobierno como un factor agravante que redujo la robustez topológica del sistema frente a contingencias múltiples.

3. **Cascada de desprotección por sobretensión**: La secuencia de disparos entre las 12:33:18 y las 12:33:29 CEST se atribuye a la actuación correcta pero encadenada de los relés de protección por sobretensión instalados en los parques generadores, cuyo ajuste no contemplaba la dinámica colectiva de un sistema de baja inercia.

La narrativa gubernamental subraya que **ninguno de los tres factores por separado habría sido suficiente** para provocar el colapso, pero su concurrencia temporal creó una vulnerabilidad estructural que el Operador del Sistema no pudo neutralizar en el tiempo de respuesta disponible.

![Mapas térmicos de tensión en la red de 400 kV previos al colapso](/figuras/mapas_termicos_tension_ree.png)

### Propuestas regulatorias del Gobierno

El informe concluye con un paquete de **siete medidas regulatorias prioritarias**:

| Medida | Ámbito | Plazo |
|--------|--------|-------|
| Revisión del P.O. 7.4 para IBR con penetración >60% | Normativo | 6 meses |
| Implantación de PMU en todos los nudos de 400 kV | Infraestructura | 18 meses |
| Requisito de inercia sintética obligatoria ≥2 s | Técnico | 12 meses |
| Protocolo dinámico de mallado en función del mix | Operativo | 3 meses |
| Auditoría de ajustes de protecciones IBR | Regulatorio | Inmediato |
| Servicio de reactiva obligatorio para inversores >1 MW | Mercado | 6 meses |
| Integración de modelos dinámicos en validaciones RCC | ENTSO-E | 24 meses |

---

## Visión de Redeia

El informe técnico de Redeia (sociedad matriz de REE) adoptó una postura más defensiva, centrada en **demostrar que la configuración de red adoptada el 28 de abril cumplía con todos los criterios del P.O. 1.1** y que las decisiones operativas del Centro de Control de Red no infringieron ninguno de los procedimientos vigentes.

El documento reconstruye con precisión milimétrica la secuencia de 18 eventos técnicos desde las 12:30 hasta las 12:34 CEST:

| Tiempo (CEST) | Evento | Potencia (MW) |
|---------------|--------|---------------|
| 12:30:15 | Primera oscilación de tensión en Carmona 400 kV | — |
| 12:31:02 | Disparo G-01 zona sur (parque solar Sevilla Este) | -47 |
| 12:31:28 | Disparo G-02, G-03 zona sur | -112 |
| 12:32:04 | Actuación UFLS zona sur | — |
| 12:32:41 | Oscilación tensión se propaga a Levante | — |
| 12:33:00 | Disparos masivos parques solares Extremadura | -2.847 |
| 12:33:08 | Disparos parques eólicos Galicia y Castilla | -1.943 |
| 12:33:15 | Frecuencia cae a 49,85 Hz — activación aFRR | — |
| 12:33:18 | **Inicio cascada principal** — 7.200 MW en 1,4 s | -7.200 |
| 12:33:21 | Pérdida de sincronismo con Europa Continental | — |
| 12:33:22 | Disparos Portugal — REN activates splitting | — |
| 12:33:26 | Tensión colapsa en Madrid y Barcelona | — |
| 12:33:29 | **Cero de tensión peninsular** | -15.100 |
| 12:33:30 | Confirmación cero de tensión — REE activa P.O. 1.6 | — |
| 12:34:00 | Contacto REE-REN para confirmación estado red lusa | — |
| 12:36:00 | Notificación ENTSO-E EAS | — |
| 12:44:00 | Suspensión mercados intradiarios | — |
| 13:04:00 | Soporte desde Marruecos habilitado | +900 |

Redeia argumenta que el **mallado adoptado ese día fue una decisión protocolizada** dentro del rango de operaciones normales, y que los modelos estáticos de flujo de cargas del Centro de Control mostraban márgenes de seguridad adecuados hasta tres minutos antes del colapso.

El informe de Redeia apunta directamente al **incumplimiento de las curvas de capacidad reactiva** por parte de los generadores IBR como el factor desencadenante primario, documentando que 847 de los 3.872 inversores registrados operaban con un factor de potencia superior al límite inductivo establecido en sus contratos de conexión.

![Fluctuaciones de tensión en la zona sur peninsular en los 30 minutos previos al colapso](/figuras/fluctuaciones_tension_previas.png)

---

## Visión del Sector Generador (IIT-ICAI / AELEC)

El análisis más técnicamente denso fue el publicado por el **Instituto de Investigación Tecnológica de la Universidad Pontificia Comillas (IIT-ICAI)** en colaboración con **AELEC** (Asociación Empresarial de la Industria Eléctrica). Este informe rechaza tanto la narrativa gubernamental como la de Redeia y propone una **causalidad físicamente distinta**: el colapso no fue consecuencia del comportamiento de los generadores IBR, sino de una **inestabilidad de tensión de naturaleza fundamentalmente capacitiva** generada por la propia configuración de red.

### El Efecto Ferranti y la Inyección Capacitiva del Mallado

El argumento central del IIT-ICAI se articula en torno al **efecto Ferranti**: las líneas de alta tensión largas, cuando están poco cargadas, actúan como condensadores distribuidos y elevan la tensión en el extremo receptor por encima de la tensión en el extremo emisor. Este fenómeno, bien conocido en ingeniería eléctrica, adquirió una dimensión crítica el 28 de abril por la combinación de tres factores:

1. La red peninsular operaba al **32% de su capacidad de transporte media**, condición que maximiza el efecto Ferranti
2. La generación solar en el sur había desplazado prácticamente toda la generación convencional síncrona de la zona
3. La configuración de mallado adoptada implicaba líneas de 400 kV de larga distancia operando en vacío relativo

El informe cuantifica que el mallado inyectó entre **1,05 y 2,4 GVAr** de potencia reactiva capacitiva en la red, generando presiones de sobretensión que superaron la capacidad de absorción del sistema.

### La Contracción del Margen Q-V en Carmona

El análisis de la curva Q-V en el nudo de **Carmona 400 kV** ---considerado el nudo crítico más próximo al origen de la cascada--- documenta una contracción dramática del margen de estabilidad de tensión:

$$\Delta Q_{V,\text{Carmona}} = Q_{V,\text{normal}} - Q_{V,\text{28A}} = 2.964 \text{ MW} - 1.268 \text{ MW} = -1.696 \text{ MW}$$

Esta reducción del **57,3% en el margen Q-V** respecto a condiciones de operación normales equivale a una pérdida de la mitad del colchón de seguridad de tensión disponible, situación que los modelos estáticos del Centro de Control de Red no habían identificado porque empleaban perfiles de carga y generación basados en históricos de días similares.

![Aluvión de alertas de sobretensión en la zona sur peninsular](/figuras/aluvion_alertas_sobretension_sur.png)

### El Fenómeno Tap-Lag y la Brecha de Observabilidad

La contribución técnica más novedosa del informe IIT-ICAI es la identificación del fenómeno denominado **"Tap-Lag"** como factor amplificador de la inestabilidad. Los **transformadores de regulación de tensión en carga (OLTC)** instalados en los puntos de entrega de los parques solares ajustan automáticamente su relación de transformación en respuesta a desviaciones de tensión en sus bornes de alta tensión.

El problema es que estos ajustes se producen con un **retardo de varias decenas de segundos** (el "lag" del Tap-Lag), y durante ese intervalo el transformador opera con una relación de transformación desacoplada de la tensión real de la red. Esto genera una **brecha de observabilidad** que el informe cuantifica mediante la comparación de las lecturas SCADA:

| Parámetro | Valor SCADA (visible) | Valor real (220 kV) | Error |
|-----------|----------------------|---------------------|-------|
| Tensión Carmona | 418 kV | 244 kV | +71% |
| Potencia reactiva absorbida | -0,3 GVAr | +0,6 GVAr | — |
| Margen Q-V disponible | 1.268 MW | ~180 MW | -86% |

El Sistema de Control y Adquisición de Datos (**SCADA**) del Centro de Control de Red mostraba una tensión de **418 kV en el nudo de Carmona**, dentro del rango operativo normal (380-435 kV), mientras la tensión real en el lado de 220 kV había colapsado a **244 kV** ---un nivel de crisis severa--- sin que ninguna alarma del sistema lo reflejara.

Esta asimetría informacional convirtió el sistema de control en un observador ciego durante los minutos críticos previos al colapso. El balance de reactiva resultante fue, en palabras del propio informe, **"matemáticamente inevitable"**:

$$\Delta Q_{\text{sistema}} = Q_{\text{inyectada,mallado}} - Q_{\text{absorbida,generadores}} = +2,1 \text{ GVAr} - (+2,7 \text{ GVAr demanda}) = -0,6 \text{ GVAr}$$

El déficit de **-0,6 GVAr** en el balance de reactiva del sistema es consistente con las mediciones de los PMU instalados en el corredor Madrid-Sevilla, que registraron una oscilación creciente de tensión con amplitud de ±12 kV a una frecuencia de 0,3 Hz durante los 90 segundos previos al colapso.

![Asimetría del balance de reactiva en la zona sur](/figuras/asimetria_balance_reactiva_sur.png)

---

## Visión de ENTSO-E

El informe de la Red Europea de Operadores de Sistemas de Transporte de Electricidad (ENTSO-E) adopta una perspectiva de mayor escala temporal y regulatoria. Su contribución principal no es la reconstrucción de la cascada ---que asume como correctamente documentada por REE y REN--- sino el **análisis sistémico de las condiciones estructurales** que hicieron posible un colapso de estas características.

### La Dicotomía Grid-Following vs Grid-Forming

El argumento central del informe ENTSO-E es la **insuficiencia electromecánica de los inversores en modo *grid-following*** para sostener un sistema de alta penetración renovable bajo perturbaciones severas. Los inversores GFL, que representaban aproximadamente el **78% de la capacidad instalada activa** en la Península Ibérica el día del incidente, operan mediante un bucle de enganche de fase (PLL) que necesita "leer" una red estable para inyectar corriente sincronizada. En condiciones de perturbación severa, el propio PLL puede convertirse en un amplificador de inestabilidades.

Los inversores en modo **grid-forming (GFM)**, por el contrario, pueden imponer activamente una onda de tensión y frecuencia, comportándose electromecánicamente de forma análoga a un generador síncrono convencional con inercia virtual. Esta capacidad es la que falta en el parque de generación ibérico.

ENTSO-E documenta que la **pérdida de sincronismo a las 12:33:21 CEST** fue, paradójicamente, el mecanismo que protegió al resto del sistema síncrono continental europeo: al desconectarse abruptamente la Península Ibérica del corredor europeo, la perturbación de frecuencia quedó aislada antes de que pudiera propagarse a Francia, Alemania e Italia.

![Pérdida de sincronismo en la frontera pirenaica](/figuras/perdida_sincronismo_frontera.png)

### NC RfG 2.0 y los Requisitos de Conexión de Red

La recomendación regulatoria central de ENTSO-E es la revisión del **Network Code on Requirements for Generators (NC RfG)** para incorporar la obligatoriedad del modo *grid-forming* para todos los generadores IBR con capacidad superior a **1 MW** conectados a redes con penetración renovable superior al **60%**. Esta propuesta, denominada informalmente "**NC RfG 2.0**", implica:

1. Certificación de capacidad GFM como requisito de acceso al mercado
2. Pruebas dinámicas obligatorias de respuesta ante huecos de tensión
3. Provisión de inercia sintética como servicio de sistema regulado
4. Integración de modelos dinámicos GFM en las validaciones de seguridad de los RCC

---

## Tabla Comparativa: Consensos y Divergencias

### Puntos de Consenso (los cuatro informes coinciden)

| Aspecto | Posición unánime |
|---------|-----------------|
| Papel de la inercia | La baja inercia del sistema **no fue la causa raíz**, pero sí un factor agravante que redujo el tiempo de respuesta disponible |
| Naturaleza del colapso | El colapso fue primariamente de **tensión**, no de frecuencia |
| Actuación de protecciones | Los relés de protección actuaron de forma **técnicamente correcta** según sus ajustes individuales |
| Rol del Black Start | Las centrales hidroeléctricas fueron **imprescindibles** para la recuperación |
| Insuficiencia regulatoria | La normativa vigente (NC RfG, P.O. 7.4) es **insuficiente** para sistemas con alta penetración IBR |
| Necesidad de PMU | La ausencia de cobertura PMU completa generó **brechas de observabilidad** críticas |
| Capacidad GFM | Se necesita **generación grid-forming** en sistemas de alta penetración renovable |

### Ejes de Divergencia (irreconciliables)

| Eje | Gobierno/REE | Redeia | IIT-ICAI/AELEC | ENTSO-E |
|-----|-------------|--------|----------------|---------|
| **Causa primaria** | Incumplimiento IBR (P.O. 7.4) | Incumplimiento curvas reactiva IBR | Inestabilidad capacitiva (Ferranti + Tap-Lag) | Insuficiencia estructural GFL |
| **Responsabilidad del mallado** | Factor agravante | Decisión protocolizada y correcta | Factor desencadenante | No se pronuncia |
| **Observabilidad del SCADA** | Adecuada para la normativa vigente | Adecuada para la normativa vigente | Ciegamente insuficiente (Tap-Lag gap) | Necesita integración PMU-dinámica |
| **Validez del Criterio N-1** | Cumplido pero insuficiente | Cumplido y suficiente | Irrelevante para inestabilidades dinámicas | Insuficiente para sistemas IBR |
| **Prioridad regulatoria** | Auditoría y cumplimiento IBR | Reforma contractual reactiva IBR | Prohibición de GFL en sistemas >60% renovable | NC RfG 2.0 obligatorio |

La tabla anterior sintetiza la arquitectura del debate técnico sobre el apagón del 28 de abril: mientras el Gobierno y Redeia atribuyen el colapso a incumplimientos normativos de actores específicos, el IIT-ICAI identifica una vulnerabilidad física estructural del sistema que habría conducido al mismo resultado independientemente del comportamiento individual de los generadores. ENTSO-E, por su parte, sitúa el problema en el nivel del diseño del parque tecnológico, argumentando que la solución requiere un cambio generacional de tecnología, no simplemente mayor cumplimiento de la normativa existente.

Esta divergencia no es menor: sus implicaciones en términos de responsabilidad civil, indemnizaciones y diseño regulatorio son de primer orden para el futuro del sistema eléctrico europeo.
