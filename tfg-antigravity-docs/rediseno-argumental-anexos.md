# REDISEÑO ARGUMENTAL DE LOS ANEXOS — PROPUESTA COMPLETA

**Proyecto:** TFG — Apagón ibérico del 28 de abril de 2025  
**Fecha:** 11 de junio de 2026  
**Principio rector:** Organización por argumento, no por tipo de evidencia

---

## 0. Visión general del nuevo sistema de anexos

Los anexos deben funcionar como diez informes periciales autónomos que, leídos en secuencia, reconstruyen el apagón ibérico del 28-A desde la condición previa hasta las consecuencias y lecciones. Cada anexo parte de una pregunta técnica concreta, presenta una tesis, organiza las evidencias — mezclando figuras, tablas, series e interactivos según su función argumental, no según su formato — y cierra con una interpretación que conecta con el relato general del TFG.

La reorganización elimina la estructura actual de cuatro bloques por tipo (Figuras / Tablas / Interactivos / Series) y la sustituye por secciones argumentales: condición previa, mecanismo, evidencia principal, validación, interpretación, conexión con otros anexos. Dentro de cada sección argumental, los elementos de cualquier formato aparecen entrelazados con texto puente que explica por qué cada uno está ahí y qué debe observar el lector.

El resultado visual debe sentirse como un informe técnico guiado — papel cálido, tipografía sobria, jerarquía clara entre evidencia nuclear y material de apoyo — y no como una galería de capturas ni un dashboard de métricas. El usuario entra, lee la pregunta, recorre las evidencias en orden causal, y sale con una conclusión verificable. Cada elemento tiene una frase de entrada que lo justifica y una frase de salida que lo interpreta. Ningún elemento queda suelto.

El nivel de intervención es fundamentalmente editorial (MDX), con 4–5 componentes de layout ligeros que dan identidad visual a los bloques argumentales sin requerir cambios de arquitectura.

---

## 1. Diagnóstico de estructura actual

**Qué funciona:** El material es excelente. 177 elementos entre figuras, tablas, componentes interactivos y series, casi todos con conexión directa o contextual con el 28-A. Los componentes React están bien construidos, con CSS Modules que respetan modo claro/oscuro. El sistema `AnnexLayout` + `AnnexSection` + `AnnexThemeEvidence` es robusto y mantenible. La estética general es coherente y académica.

**Qué no funciona:** La organización por tipo de evidencia produce una experiencia de galería. El usuario ve cuatro bloques idénticos (Figuras / Tablas / Interactivos / Series) sin jerarquía argumental. Una tabla de secuencia de desconexiones y una imagen de propagación geográfica pertenecen al mismo argumento ("la cascada se propagó en 11 segundos"), pero están separadas en bloques distintos. No hay textos puente entre elementos. No hay pregunta técnica que guíe la lectura. No hay cierre interpretativo. Todas las evidencias tienen el mismo peso visual.

**Por qué la organización por tipo es insuficiente:** El formato (PNG, tabla, componente React, serie ESIOS) es una propiedad técnica del elemento, no su función argumental. Una imagen estática del perfil de generación y una serie ESIOS de demanda peninsular sirven al mismo argumento ("el sistema operaba con baja inercia"); separarlas obliga al usuario a reconstruir mentalmente la conexión. La organización por tipo es útil para el mantenimiento del repositorio pero perjudicial para la lectura.

**Qué debe cambiar:** Sustituir las cuatro secciones por tipo por secciones argumentales donde figuras, tablas, series e interactivos se mezclan según su papel en el razonamiento. Añadir textos puente, pregunta técnica, tesis, mapa de lectura y cierre interpretativo. Diferenciar visualmente evidencia nuclear de apoyo.

---

## 2. Nuevo sistema UX/UI común

### 2.1 Arquitectura visual común

Estructura de un anexo ideal:

```
┌─────────────────────────────────────────────────┐
│  CABECERA (AnnexLayout existente)               │
│  Kicker · Título · Descripción · Meta           │
├─────────────────────────────────────────────────┤
│  PREGUNTA TÉCNICA (AnnexKeyQuestion)            │
│  "¿Por qué...?"                                 │
├─────────────────────────────────────────────────┤
│  TESIS PERICIAL (AnnexThesisBox)                │
│  3–5 frases que resumen la respuesta.           │
├─────────────────────────────────────────────────┤
│  RELACIÓN CON EL 28-A (AnnexBlackoutRelevance)  │
│  Conexión causal directa con el evento.         │
├─────────────────────────────────────────────────┤
│  NOTA METODOLÓGICA (AnnexMethodNote, existente)  │
├─────────────────────────────────────────────────┤
│  MAPA DE LECTURA (AnnexReadingMap)              │
│  "Este anexo se organiza en N secciones..."     │
├─────────────────────────────────────────────────┤
│  NAVEGACIÓN INTERNA (AnnexEvidenceNav, adaptado) │
│  [Sección argumental 1] [Sección 2] [Sección 3] │
├─────────────────────────────────────────────────┤
│                                                 │
│  SECCIÓN ARGUMENTAL 1 (AnnexSection)            │
│  ┌─ Texto introductorio                        │
│  ├─ EVIDENCIA NUCLEAR (figura/componente)       │
│  ├─ Texto puente                                │
│  ├─ TABLA DE VALIDACIÓN                         │
│  ├─ Texto puente                                │
│  ├─ SERIE TEMPORAL (si apoya el argumento)      │
│  └─ Texto de cierre de sección                  │
│                                                 │
│  SECCIÓN ARGUMENTAL 2 (AnnexSection)            │
│  ┌─ Texto introductorio                        │
│  ├─ ...                                         │
│  └─ ...                                         │
│                                                 │
│  SECCIÓN ARGUMENTAL N                           │
│  ┌─ ...                                         │
│  └─ ...                                         │
│                                                 │
│  EVIDENCIA SECUNDARIA (AnnexSection, colapsada)  │
│  ┌─ Material documental, fuentes, contexto      │
│  └─ Figuras de apoyo no nucleares               │
│                                                 │
├─────────────────────────────────────────────────┤
│  CIERRE INTERPRETATIVO (AnnexSectionSummary)    │
│  Qué demuestra · Qué no demuestra · Conexión   │
├─────────────────────────────────────────────────┤
│  ENLACES CRUZADOS (AnnexCrossLinks)             │
│  → Anexo II: estabilidad dinámica              │
│  → Anexo III: cascada de protecciones           │
└─────────────────────────────────────────────────┘
```

### 2.2 Jerarquía de evidencias

| Nivel | Tipo de evidencia | Tratamiento visual | Cuándo usarlo |
|-------|------------------|-------------------|---------------|
| **1 — Nuclear** | Figura, tabla o interactivo imprescindible para entender el anexo | Abierto por defecto, fondo ligeramente diferenciado, texto puente antes y después, caption enriquecido | Cuando el elemento es la evidencia principal de una sección argumental. Ej: `tension_frecuencia_colapso.png`, `escalones-ufls` |
| **2 — Apoyo** | Elemento que completa o valida la evidencia nuclear | Abierto por defecto, sin fondo diferenciado, texto puente breve antes, caption estándar | Cuando el elemento refuerza el argumento de un Nivel 1. Ej: `maniobras-compensacion-reactiva` junto a figuras de tensión |
| **3 — Documental** | Captura, tabla larga, fuente, serie auxiliar | Dentro de sección "Evidencia complementaria", colapsada por defecto | Material de contexto o referencia. Ej: `mix_comparativo_2010_2024.png`, `pmu_sensors_europe.png` |
| **4 — Metodológico** | Simulador, ecuación, modelo teórico | En Anexo IX o X; referenciado desde el anexo factual con enlace cruzado | Cuando el elemento explica el mecanismo pero no documenta el evento. Ej: SwingEquationSimulator, PVCurveSimulator |

**Tratamiento visual por nivel:**

- **Nivel 1:** El contenedor tiene un borde lateral izquierdo de 3px en burdeos (`#6B1024`). Fondo `var(--fig-surface)`. Texto puente antes y después. La figura se muestra sin necesidad de clic.
- **Nivel 2:** Sin borde especial. Se muestra abierto dentro de la sección argumental. Texto puente breve (1 frase) antes.
- **Nivel 3:** Dentro de un `AnnexSection` sin `defaultOpen`. El usuario ve el título y puede expandir.
- **Nivel 4:** No aparece en los anexos factuales I–VIII. Solo aparece en IX/X con texto introductorio propio.

### 2.3 Patrones o componentes reutilizables

| Patrón | Función | Ejemplo de uso | Imprescindible/opcional | ¿Componente o MDX? |
|--------|---------|---------------|------------------------|-------------------|
| `AnnexKeyQuestion` | Pregunta técnica destacada | "¿Por qué la pérdida de estabilidad de tensión fue la causa raíz del colapso?" | Imprescindible | Componente (caja visual distintiva) |
| `AnnexThesisBox` | Tesis del anexo en 3–5 frases | "El apagón fue un colapso de tensión, no de frecuencia. La frecuencia cayó como consecuencia..." | Imprescindible | Componente (fondo diferenciado, borde superior) |
| `AnnexBlackoutRelevance` | Tarjeta breve de conexión causal con el 28-A | "Este anexo documenta las condiciones que redujeron la inercia del sistema por debajo del umbral de seguridad." | Imprescindible | Componente (tarjeta compacta con ícono punto rojo) |
| `AnnexReadingMap` | Guía de lectura del anexo en 3–5 líneas | "Este anexo se organiza en cuatro secciones: la condición previa de tensión, la cascada de protecciones..." | Opcional pero recomendado | MDX (párrafo con estilo itálico o blockquote) |
| `AnnexSectionSummary` | Cierre interpretativo al final del anexo | "Este anexo demuestra que... No demuestra que... Su lectura se complementa con..." | Imprescindible | Componente (bloque con borde superior, fondo ligero) |
| `AnnexCrossLinks` | Enlaces a anexos relacionados | "→ Anexo II: consecuencias sobre estabilidad dinámica" | Opcional | MDX (lista con enlaces) o componente ligero |
| Texto puente (antes) | Párrafo que explica por qué viene el siguiente elemento | "La siguiente figura muestra el perfil de generación..." | Imprescindible | MDX puro |
| Texto puente (después) | Párrafo que interpreta lo que el usuario acaba de ver | "La dominancia de generación IBR implicaba..." | Imprescindible | MDX puro |

**Componentes que NO necesitan crearse:**
- `AnnexEvidenceRole` — basta con el texto puente antes de cada elemento.
- `AnnexFigureBridge` — es simplemente un párrafo MDX.
- `AnnexInterpretation` — `AnnexSectionSummary` cubre esta función.
- `AnnexSecondaryBlock` — una `AnnexSection` sin `defaultOpen` lo resuelve.

### 2.4 Navegación interna propuesta

La navegación interna deja de organizarse por formato y pasa a organizarse por argumento. Cada anexo tiene sus propias pestañas argumentales.

**Ejemplo para Anexo III (Protecciones):**
```
[ Propagación ] [ Cascada IBR ] [ Deslastre ] [ Estado final ] [ Complementaria ]
```

**Ejemplo para Anexo I (Demanda/balance):**
```
[ Condición previa ] [ Perfil del 28-A ] [ Validación ] [ Contexto estructural ] [ Complementaria ]
```

**Ejemplo para Anexo X (Ecuaciones):**
```
[ Red y tensión ] [ Control y frecuencia ] [ Mercado ] [ Sistémicos ]
```

**Implementación:** Se reutiliza `AnnexEvidenceNav` existente cambiando los `items`. Cada item apunta a un `AnnexSection` con `id` argumental en lugar de `figuras-t1` / `tablas-t1`.

---

## 3. Arquitectura global de los anexos I–X

| Anexo | Título final recomendado | Pregunta técnica | Modelo visual | Papel dentro del TFG |
|-------|-------------------------|-----------------|---------------|---------------------|
| I | Demanda, generación y balance: la condición previa | ¿Cómo condicionaban demanda, mix y balance el margen de seguridad del 28-A? | Informe guiado | Establece la precondición: sistema eficiente pero dinámicamente frágil |
| II | Estabilidad dinámica: tensión, frecuencia e inercia | ¿Por qué el colapso fue de tensión antes que de frecuencia? | Informe guiado | Demuestra la causa raíz: inestabilidad de tensión |
| III | Protecciones, cascada y desconexiones | ¿Cómo se propagó la cascada entre el disparo raíz y el colapso total? | Dossier cronológico | Reconstruye la secuencia de fallo fase por fase |
| IV | Interconexiones y flujos transfronterizos | ¿Qué papel tuvieron las interconexiones en la propagación y la reposición? | Informe guiado | Papel dual: acelerador del colapso y vector de recuperación |
| V | Mercado eléctrico y costes: la vulnerabilidad invisible | ¿Por qué el mercado no anticipó la fragilidad dinámica? | Informe guiado | Demuestra que las señales de precio eran ciegas a la vulnerabilidad |
| VI | Reposición, Black Start y operación de emergencia | ¿Cómo se restauró el sistema tras el colapso total? | Dossier cronológico | Documenta la secuencia de recuperación |
| VII | Impacto socioeconómico y resiliencia | ¿Cuál fue el daño económico y qué lecciones de resiliencia se derivan? | Informe guiado | Cuantifica consecuencias y evalúa resiliencia |
| VIII | Comunicación y percepción pública | ¿Cómo se construyó la narrativa pública del 28-A? | Atlas de evidencias | Documenta el tratamiento mediático e institucional |
| IX | Metodología, modelos y contraste de fuentes | ¿Qué herramientas y fuentes permiten interpretar el evento? | Híbrido (atlas + laboratorio) | Base metodológica del análisis |
| X | Ecuaciones, modelos matemáticos y simuladores | ¿Qué ecuaciones reproducen cuantitativamente los fenómenos del 28-A? | Laboratorio guiado | Formalización matemática de todos los fenómenos |

---

## 4. Diseño detallado por anexo

---

# ANEXO I — Demanda, generación y balance: la condición previa

### 4.I.1 Función del anexo

Establece que las condiciones operativas del sistema peninsular la mañana del 28-A — demanda moderada, pico fotovoltaico, mínimos históricos de generación síncrona — configuraban una precondición de vulnerabilidad dinámica. El balance demanda-generación era aparentemente normal, pero la composición de la oferta reducía simultáneamente la inercia, la potencia de cortocircuito y el margen de control de tensión.

### 4.I.2 Pregunta técnica

¿Cómo condicionaban la demanda prevista, el mix de generación y el balance operativo del sistema peninsular el margen de seguridad dinámica disponible la mañana del 28 de abril de 2025?

### 4.I.3 Tesis

La mañana del 28-A, la generación peninsular cubría la demanda con holgura, pero la composición del mix — 82% de fuentes basadas en inversores, solo 11 unidades síncronas acopladas — dejaba el sistema con la inercia más baja del año y una potencia de cortocircuito en el sur peninsular por debajo de los umbrales de operación segura. Las previsiones de demanda no anticipaban condiciones excepcionales; la desviación previsto-real era inferior al 5%. La vulnerabilidad no residía en la cantidad de potencia disponible sino en las propiedades dinámicas de esa potencia. Este anexo establece la condición necesaria — aunque no suficiente — del colapso posterior.

### 4.I.4 Modelo visual recomendado

Informe técnico guiado. La secuencia es lineal: condición previa → perfil del día → validación con datos → contexto estructural.

### 4.I.5 Estructura final propuesta

**Sección 1 — Condición previa: el perfil de generación del 28-A**

- ID: `condicion-previa`
- Objetivo: Mostrar que el 28-A operaba con un mix dominado por inversores y mínima generación síncrona.
- Elementos incluidos (en este orden):
  1. `ree_generation_mix_28april.png` [NUCLEAR] — perfil de generación del día
  2. *Texto puente: "El valle de demanda coincidió con el pico fotovoltaico..."*
  3. `conventionalunits.png` [NUCLEAR] — tendencia decreciente de unidades síncronas
  4. *Texto puente: "La tendencia de expulsión por orden de mérito..."*
  5. Tabla `mix-generacion-12-30` [APOYO] — composición exacta a las 12:30
  6. Tabla `unavailable-capacity` [APOYO] — potencia indisponible por tecnología
  7. Tabla `indisponibilidad-generacion-convencional` [APOYO] — discrepancia REE vs Comité
- Abierta por defecto: Sí
- Texto introductorio: "La primera sección documenta la condición operativa del sistema peninsular la mañana del evento. El perfil de generación revela que la producción fotovoltaica desplazaba la generación síncrona hasta mínimos del año 2025, reduciendo la inercia, la potencia de cortocircuito y la capacidad inherente de control de tensión."
- Texto de cierre: "Los datos confirman que a las 12:30 CEST el sistema operaba con aproximadamente 11 unidades convencionales acopladas y un porcentaje de generación IBR cercano al 82%. La discrepancia de 3.028 MW entre las cifras de potencia indisponible declaradas por REE y las del Comité del Gobierno alimenta el debate sobre si el operador disponía de suficiente margen síncrono."

**Sección 2 — Previsiones de demanda: lo que se esperaba**

- ID: `previsiones-demanda`
- Objetivo: Demostrar que las previsiones de demanda no anticipaban condiciones de riesgo.
- Elementos incluidos:
  1. Tabla `spanish-demand-forecast` [APOYO] — previsión vs real España
  2. *Texto puente*
  3. Tabla `portuguese-demand-forecast` [APOYO] — previsión vs real Portugal
  4. Serie `chart-1` (DemandaChart) [APOYO] — demanda peninsular real
  5. Serie `chart-2` (TotalLoadChart) [APOYO] — total load ES+PT
  6. Serie `chart-3` (ProgramacionChart) [APOYO] — programa de producción
- Abierta por defecto: Sí
- Texto introductorio: "Las previsiones de demanda para el 28-A mostraban un perfil de día laborable normal con carga moderada. La desviación entre lo previsto y lo real no superaba el 5% en ningún horizonte (D-2, D-1, 8:00h). Las series ESIOS confirman que la demanda peninsular real se ajustaba al programa de producción sin señales de alarma."
- Texto de cierre: "La normalidad de las previsiones es precisamente la evidencia de que la vulnerabilidad del 28-A no era visible desde las señales de demanda convencionales. El riesgo residía en la composición de la oferta, no en la magnitud de la carga."

**Sección 3 — Capacidad instalada e indicadores de sistema**

- ID: `capacidad-indicadores`
- Objetivo: Contextualizar la estructura del parque y las reservas disponibles.
- Elementos incluidos:
  1. `capacidad_instalada_2025.png` [DOCUMENTAL] — parque español a enero 2025
  2. Serie `chart-5` (InstalledCapacityChart) [APOYO]
  3. Serie `chart-7` (HydroReservoirChart) [APOYO]
  4. Serie `chart-8` (GenericEsiosChartCO2) [DOCUMENTAL]
  5. Tabla `variacion-demanda-desconexion-gd` [DOCUMENTAL]
- Abierta por defecto: No (sección colapsable)
- Texto introductorio: "Esta sección complementa el perfil del 28-A con indicadores de medio plazo: capacidad instalada por tecnología, reservas hidráulicas e indicadores de CO₂ y penetración renovable. Estos datos no se refieren directamente al evento, sino al contexto estructural que lo hizo posible."

**Sección 4 — Transición energética y re-energización**

- ID: `transicion-reenergizacion`
- Objetivo: Vincular el contexto de transición con las condiciones del 28-A y la fase de reposición.
- Elementos incluidos:
  1. `mix_comparativo_2010_2024.png` [DOCUMENTAL] — evolución del mix 2010→2024
  2. `evolucion_mix_reenergizacion.png` [DOCUMENTAL] — mix durante re-energización
  3. Componente `EnergyTransitionStreamgraph` [APOYO] — visualización interactiva de la transición
  4. Componente `MixGeneracion` [APOYO] — exploración del mix
  5. Componente `EmissionsVsRenewablesChart` [DOCUMENTAL] — emisiones vs renovables
- Abierta por defecto: No (sección colapsable)
- Texto introductorio: "Los siguientes elementos sitúan el perfil operativo del 28-A en el contexto de la transición energética ibérica. La evolución del mix entre 2010 y 2024 ilustra cómo la generación basada en inversores pasó de ser complementaria a dominante, reduciendo progresivamente la generación síncrona que proporcionaba inercia y control de tensión de forma inherente. La figura de re-energización muestra que, tras el colapso, la incorporación de generación IBR quedó restringida hasta verificar niveles mínimos de potencia de cortocircuito."

### 4.I.6 Elementos nucleares

| Elemento | Tipo | Por qué es nuclear | Texto antes | Texto después | Caption |
|----------|------|-------------------|-------------|---------------|---------|
| `ree_generation_mix_28april.png` | PNG | Perfil de generación del día del evento: muestra la dominancia IBR | "El perfil de generación del 28-A ilustra la condición operativa inmediatamente previa al colapso. En la franja de mediodía, la producción fotovoltaica alcanzaba su pico mientras la generación síncrona se reducía a mínimos históricos." | "La dominancia de generación basada en inversores (~82%) implicaba que las propiedades dinámicas del sistema dependían de 11 unidades síncronas. Los Anexos II y III analizan las consecuencias." | "Perfil de generación peninsular, 28-A-2025. Valle de demanda + pico FV = mínimo síncrono. Fuente: NREL / Red Eléctrica." |
| `conventionalunits.png` | PNG | Tendencia decreciente de unidades síncronas en meses previos | "El número de unidades convencionales acopladas diariamente mostraba una tendencia decreciente en los meses previos al 28-A, reflejo de la expulsión sistemática por orden de mérito." | "Esta tendencia reducía la inercia media del sistema, haciendo que cada día de alta producción renovable representase un escenario de mayor fragilidad dinámica." | "Unidades síncronas convencionales acopladas, primeros meses de 2025. Fuente: ENTSO-E." |

### 4.I.7 Elementos secundarios

| Elemento | Tipo | Función | Ubicación | Tratamiento |
|----------|------|---------|-----------|-------------|
| `mix-generacion-12-30` | Tabla | Composición exacta del mix a las 12:30 CEST | Sección 1, tras figuras nucleares | Nivel 2 — abierto, texto breve |
| `unavailable-capacity` | Tabla | Potencia indisponible por tecnología | Sección 1 | Nivel 2 |
| `spanish-demand-forecast` | Tabla | Previsión vs real España | Sección 2 | Nivel 2 |
| `portuguese-demand-forecast` | Tabla | Previsión vs real Portugal | Sección 2 | Nivel 2 |
| chart-1 a chart-3 | Series | Demanda, total load, programa | Sección 2 | Nivel 2 |
| chart-5, chart-7, chart-8 | Series | Capacidad, hidro, CO₂ | Sección 3 | Nivel 3 |
| `capacidad_instalada_2025.png` | PNG | Contexto de parque | Sección 3 | Nivel 3 |
| `mix_comparativo_2010_2024.png` | PNG | Contexto transición | Sección 4 | Nivel 3 |
| `evolucion_mix_reenergizacion.png` | PNG | Re-energización | Sección 4 | Nivel 3 |
| StreamGraph, MixGen, Emissions | Interactivos | Exploración del mix | Sección 4 | Nivel 3 |
| `variacion-demanda-desconexion-gd` | Tabla | Efecto de desconexión GD | Sección 3 | Nivel 3 |
| `indisponibilidad-generacion-convencional` | Tabla | Discrepancia REE/Comité | Sección 1 | Nivel 2 |

### 4.I.8 Elementos a reubicar

| Elemento | Ubicación actual | Nueva ubicación | Motivo | Riesgo |
|----------|-----------------|----------------|--------|--------|
| Import `LOLEBarChart` | Anexo I imports | Eliminar | No se renderiza en el cuerpo | Bajo |
| Import `BESSBoomChart` | Anexo I imports | Eliminar | No se renderiza en el cuerpo | Bajo |

### 4.I.9 Elementos a conservar pero explicar mejor

| Elemento | Problema actual | Texto de conexión con el 28-A |
|----------|----------------|-------------------------------|
| `capacidad_instalada_2025.png` | Se presenta sin contexto; parece genérica | "La distribución de capacidad instalada a enero de 2025 refleja un parque con más de 70 GW renovable frente a ~25 GW síncrono convencional. Esta proporción determinaba el margen de inercia disponible durante períodos de alta penetración solar como el 28-A." |
| `mix_comparativo_2010_2024.png` | Parece dato genérico | "La comparación 2010-2024 muestra la transformación estructural: la generación IBR pasó de complementaria a dominante, desplazando las unidades que proporcionaban inercia y control de tensión inherente." |
| `evolucion_mix_reenergizacion.png` | No se conecta con la restricción | "Durante la re-energización, las fuentes IBR quedaron excluidas hasta verificar niveles mínimos de Scc e inercia, evidenciando que la reposición dependía inicialmente de generación síncrona e importaciones." |

### 4.I.10 Elementos prescindibles o colapsables

| Elemento | Decisión | Motivo |
|----------|---------|--------|
| `EmissionsVsRenewablesChart` | Colapsable (Nivel 3) | Relación con el 28-A es contextual, no causal |
| `chart-8` (CO₂) | Colapsable (Nivel 3) | Indicador ambiental, no de seguridad dinámica |

### 4.I.11 Introducción completa del anexo

Este anexo reúne las evidencias relativas a la demanda, el mix de generación y el balance operativo del sistema eléctrico peninsular ibérico el 28 de abril de 2025, antes, durante y después del incidente.

La mañana del 28-A, el sistema peninsular operaba en un escenario de demanda moderada con un pico de producción fotovoltaica que desplazaba la generación síncrona convencional hasta mínimos históricos: apenas 11 unidades convencionales acopladas y aproximadamente el 82% de la generación procedente de fuentes basadas en inversores. Esta configuración reducía simultáneamente tres magnitudes críticas para la seguridad dinámica: la inercia del sistema, la potencia de cortocircuito en nudos del sur peninsular y el margen de control de tensión.

Las previsiones de demanda de los días previos no anticipaban condiciones excepcionales; la desviación entre lo previsto y lo real era inferior al 5%. El desequilibrio no residía en la demanda, sino en la composición de la oferta que la cubría: generación abundante y barata, pero estructuralmente frágil ante perturbaciones de tensión.

### 4.I.12 Mapa de lectura

Este anexo se organiza en cuatro secciones. La primera presenta la condición operativa del 28-A: el perfil de generación, las unidades acopladas y el mix a las 12:30 CEST. La segunda contrasta las previsiones de demanda con la realidad, demostrando que la vulnerabilidad era invisible desde las señales convencionales. La tercera reúne indicadores de medio plazo — capacidad instalada, reservas hidráulicas, emisiones — como contexto estructural. La cuarta sitúa el evento dentro de la transición energética ibérica.

### 4.I.13 Textos puente completos

**`ree_generation_mix_28april.png`:**
- Antes: "El perfil de generación del 28-A ilustra la condición operativa inmediatamente previa al colapso. En la franja de mediodía, la producción fotovoltaica alcanzaba su pico mientras la generación síncrona convencional se reducía a mínimos históricos."
- Después: "La dominancia de generación basada en inversores (~82%) implicaba que las propiedades dinámicas del sistema — inercia, potencia de cortocircuito, control inherente de tensión — dependían de un número reducido de unidades síncronas. Los Anexos II y III analizan las consecuencias de esta configuración."
- Caption: "Perfil de generación peninsular, 28-A-2025. Fuente: NREL / Red Eléctrica."
- Conexión 28-A: Directa. Muestra la composición que condicionó la vulnerabilidad.

**`conventionalunits.png`:**
- Antes: "El número de unidades convencionales acopladas diariamente mostraba una tendencia decreciente en los meses previos al 28-A, reflejo de la expulsión sistemática por orden de mérito."
- Después: "Esta tendencia reducía la inercia media del sistema, haciendo que cada día de alta producción renovable representase un escenario de mayor fragilidad dinámica."
- Caption: "Unidades síncronas acopladas, primeros meses de 2025. Fuente: ENTSO-E."
- Conexión 28-A: Directa. Muestra la tendencia que produjo la condición del día del evento.

**Tabla `mix-generacion-12-30`:**
- Antes: "La composición exacta del mix a las 12:30 CEST — el instante inmediatamente anterior al disparo raíz — confirma la dominancia de generación IBR."
- Después: "Solo el 18% de la generación procedía de fuentes síncronas, con apenas 11 unidades convencionales acopladas, el mínimo registrado en 2025."
- Conexión 28-A: Directa. Datos del momento previo al colapso.

**Tabla `unavailable-capacity`:**
- Antes: "La potencia indisponible por tecnología antes del incidente muestra el margen real del que disponía el operador del sistema."
- Después: "Los valores previos al incidente sugieren que la indisponibilidad convencional limitaba adicionalmente el recurso síncrono."
- Conexión 28-A: Directa.

**Tabla `indisponibilidad-generacion-convencional`:**
- Antes: "La discrepancia entre las cifras de indisponibilidad declaradas por REE y las del Comité del Gobierno es un elemento relevante del debate pericial posterior."
- Después: "Una diferencia de 3.028 MW alimenta la cuestión de si el operador disponía de capacidad síncrona suficiente para mantener los niveles mínimos de inercia."
- Conexión 28-A: Directa.

**Tabla `spanish-demand-forecast`:**
- Antes: "Las previsiones de demanda española para el 28-A no indicaban condiciones excepcionales."
- Después: "La desviación previsto-real inferior al 5% confirma que el riesgo no procedía de la demanda."
- Conexión 28-A: Directa.

**Tabla `portuguese-demand-forecast`:**
- Antes: "Las previsiones de demanda portuguesa corroboran el mismo patrón de normalidad."
- Después: "Portugal tampoco anticipaba un escenario de riesgo desde la perspectiva de la demanda."
- Conexión 28-A: Directa.

**Serie `chart-1` (DemandaChart):**
- Antes: "La serie de demanda peninsular del 28 al 29 de abril permite verificar el perfil de carga real del sistema."
- Después: "El perfil confirma un valle de demanda matinal coherente con un día laborable de primavera."
- Conexión 28-A: Directa. Período del evento.

**Componente `EnergyTransitionStreamgraph`:**
- Antes: "El streamgraph permite explorar la evolución del mix de generación en el tiempo, visualizando cómo la transición energética desplazó progresivamente las fuentes síncronas."
- Después: "La reducción progresiva de la banda de generación convencional en el streamgraph es coherente con la tendencia de `conventionalunits.png`."
- Conexión 28-A: Contextual. Sitúa el evento en la tendencia de largo plazo.

### 4.I.14 Cierre interpretativo completo

El balance demanda-generación del 28-A no contenía señales de alarma convencionales: la demanda estaba cubierta, los precios de mercado no anticipaban tensiones, y las previsiones eran razonablemente precisas. La vulnerabilidad no procedía de un déficit de potencia sino de un déficit de propiedades dinámicas en la potencia disponible: inercia, potencia de cortocircuito y capacidad de control de tensión.

Este anexo no demuestra que el apagón fuese inevitable ni que el operador careciese de herramientas para gestionar la situación. Demuestra que las condiciones operativas de la mañana del 28-A constituían una precondición necesaria del colapso posterior: un sistema con margen de potencia suficiente pero con margen dinámico insuficiente.

La lectura de este anexo se complementa con el Anexo II, que analiza cómo la composición del mix degradaba la estabilidad de tensión, y con el Anexo V, que explica por qué el diseño de mercado no generaba señales de precio para las propiedades dinámicas ausentes.

### 4.I.15 Resultado visual esperado

El usuario entra y ve una cabecera limpia con el título, la pregunta técnica y la tesis. Debajo, un mapa de lectura le indica las cuatro secciones. La primera sección está abierta y muestra las dos figuras nucleares del perfil de generación y las unidades acopladas, intercaladas con tablas del mix exacto. Las secciones 3 y 4 están colapsadas. Al final, un cierre interpretativo le dice qué ha aprendido y hacia dónde seguir. La sensación es de informe técnico ordenado, no de galería de capturas.

### 4.I.16 Instrucciones para implementación

1. Sustituir las 4 secciones por tipo (`figuras-t1`, `tablas-t1`, `interactivos-t1`, `series-t1`) por las 4 secciones argumentales descritas.
2. Dentro de cada sección, renderizar los elementos manualmente (no mediante `AnnexThemeEvidence`) intercalados con texto MDX.
3. Para los elementos que se renderizan vía `AnnexThemeEvidence`, verificar si es posible renderizarlos individualmente. Si `AnnexThemeEvidence` solo permite renderizado en bloque, estudiar si pueden incluirse selectores adicionales o si es mejor renderizar los componentes directamente en JSX del MDX.
4. **Decisión técnica clave:** La reorganización por argumento implica abandonar `AnnexThemeEvidence` como mecanismo de renderizado (ya que agrupa por tipo). Las alternativas son: (a) renderizar cada componente/imagen/tabla manualmente en el MDX, o (b) extender `AnnexThemeEvidence` con filtros más granulares. La opción (a) es más segura y reversible.
5. Eliminar imports de `LOLEBarChart` y `BESSBoomChart`.
6. Insertar textos de las secciones 4.I.11, 4.I.12, 4.I.13 y 4.I.14.

---

# ANEXO II — Estabilidad dinámica: tensión, frecuencia e inercia

### 4.II.1 Función del anexo

Demostrar que el apagón del 28-A fue un colapso dirigido por sobretensión y pérdida de control de reactiva, no un evento clásico de subfrecuencia por pérdida de generación. La frecuencia cayó como consecuencia de las desconexiones masivas provocadas por las protecciones de sobretensión.

### 4.II.2 Pregunta técnica

¿Por qué la pérdida de estabilidad de tensión — y no la caída de frecuencia — fue la causa raíz del colapso del 28-A?

### 4.II.3 Tesis

Los registros de las PMU instaladas en la subestación de Carmona (400 kV) documentan que la tensión comenzó a divergir minutos antes de que la frecuencia abandonase su banda normal. Las sobretensiones en el sur peninsular superaron los límites de protección de los inversores IBR, provocando desconexiones masivas que, a su vez, causaron la caída de frecuencia. La inercia reducida del sistema — consecuencia del mix documentado en el Anexo I — limitaba la capacidad de la red para absorber perturbaciones de frecuencia una vez iniciada la cascada. La distinción causa-consecuencia entre tensión y frecuencia es central para las recomendaciones regulatorias del TFG.

### 4.II.4 Modelo visual recomendado

Informe técnico guiado, organizado en tres bloques causales: tensión → frecuencia/inercia → reactiva.

### 4.II.5 Estructura final propuesta

**Sección 1 — Inestabilidad de tensión: precursores y colapso**
- ID: `inestabilidad-tension`
- Elementos (en orden):
  1. `fluctuaciones_tension_previas.png` [NUCLEAR] — curvas Q-V en Carmona
  2. *Texto puente*
  3. `precursor_overvoltage_22april.png` [NUCLEAR] — precursor del 22 de abril
  4. `nunez_balboa_precursores.png` [APOYO] — precursores Núñez de Balboa
  5. Tabla `tensiones-nudos-criticos` [APOYO] — tensiones en nudos críticos
  6. Tabla `re-voltage-manoeuvres` [APOYO] — maniobras de tensión REE
  7. *Texto puente: "Los registros confirman que múltiples subestaciones del sur superaban límites antes de la primera desviación de frecuencia."*
  8. `tension_frecuencia_colapso.png` [NUCLEAR] — registro de los segundos críticos
  9. `frequency_voltage_carmona.png` [NUCLEAR] — PMU Carmona
  10. *Texto de cierre: "La prioridad temporal de la perturbación de tensión sobre la de frecuencia sustenta la clasificación del evento como colapso de tensión."*
- Abierta por defecto: Sí
- Texto introductorio: "Esta sección reúne la evidencia más directa de que el colapso del 28-A fue un evento de tensión. Los registros PMU muestran que las sobretensiones precedieron a la caída de frecuencia, invirtiendo la secuencia causal de los apagones clásicos."

**Sección 2 — Frecuencia, inercia y modos oscilatorios**
- ID: `frecuencia-inercia`
- Elementos:
  1. Tabla `evolucion-frecuencia-rocof` [APOYO]
  2. Tabla `inercia-sistema-htot` [APOYO]
  3. Tabla `modos-oscilatorios` [APOYO]
  4. `wams_oscilaciones_carmona.png` [DOCUMENTAL]
  5. Componente `FrequencyChart` [APOYO]
  6. Componente `CollapseSismograph` [NUCLEAR] — sismógrafo del colapso
  7. Serie `chart-4` (PotenciaChart) [APOYO]
  8. Serie `chart-6` (ActualGenerationChart) [APOYO]
- Abierta por defecto: Sí
- Texto introductorio: "La frecuencia cayó como consecuencia de las desconexiones masivas. Esta sección documenta la respuesta inercial, los modos oscilatorios detectados y la evolución de la frecuencia durante el evento."

**Sección 3 — Balance de potencia reactiva**
- ID: `balance-reactiva`
- Elementos:
  1. `asimetria_balance_reactiva_sur.png` [APOYO]
  2. Tabla `inyeccion-reactiva-distribucion` [APOYO]
  3. Tabla `maniobras-compensacion-reactiva` [APOYO]
  4. `mapas_termicos_tension_ree.png` [DOCUMENTAL]
- Abierta por defecto: No
- Texto introductorio: "El déficit de potencia reactiva en el sur peninsular (~−0,6 GVAr a las 12:30 CEST) contribuyó a la inestabilidad de tensión documentada en la sección anterior."

**Sección 4 — Herramientas de análisis**
- ID: `herramientas-estabilidad`
- Elementos:
  1. Componente `DynamicSecurityShift` [APOYO]
  2. Componente `MRSCRComparator` [APOYO]
  3. Componente `SynchrophasorPlot` [APOYO]
  4. Componente `ThenVsNowPanel` [DOCUMENTAL]
  5. `futured_grid_evolution.png` [DOCUMENTAL]
- Abierta por defecto: No
- Texto introductorio: "Los siguientes componentes interactivos permiten explorar el desplazamiento de la frontera de seguridad dinámica, la evolución del ratio de cortocircuito y los registros sincrofasores. Su formalización matemática se encuentra en el Anexo X."

### 4.II.6 Elementos nucleares

| Elemento | Tipo | Por qué es nuclear | Texto antes | Texto después | Caption |
|----------|------|-------------------|-------------|---------------|---------|
| `tension_frecuencia_colapso.png` | PNG | Registro de los segundos críticos que demuestra la secuencia tensión→frecuencia | "El registro de tensión y frecuencia en los segundos críticos demuestra la secuencia temporal del colapso: la tensión diverge antes que la frecuencia." | "La prioridad temporal de la perturbación de tensión sustenta la clasificación del evento como colapso de tensión, diferenciándolo de los apagones clásicos de subfrecuencia." | "Frecuencia y tensión, segundos críticos del 28-A. Fuente: IIT-ICAI." |
| `frequency_voltage_carmona.png` | PNG | Registro PMU de Carmona con resolución suficiente para ver oscilaciones precursoras | "El registro PMU de Carmona (400 kV) captura las oscilaciones precursoras antes de la divergencia final." | "La comparación entre tensión y frecuencia en este registro confirma que la inestabilidad de tensión precedió a la caída de frecuencia." | "PMU Carmona 400 kV, 28-A. Fuente: IIT-ICAI / Compass Lexecon." |
| `fluctuaciones_tension_previas.png` | PNG | Curvas Q-V que muestran la proximidad al colapso de tensión | "Las curvas Q-V de estabilidad de tensión en Carmona muestran que las maniobras de mallado desplazaron el punto de operación hacia la zona de inestabilidad." | "La proximidad del punto operativo al nariz de la curva Q-V es la evidencia más directa de que el sistema estaba al borde del colapso de tensión." | "Curvas Q-V Carmona 400 kV. Fuente: IIT-ICAI." |
| `precursor_overvoltage_22april.png` | PNG | Precursor 6 días antes del evento | "El 22 de abril de 2025 se registró un evento precursor de sobretensión en la misma zona del sur peninsular." | "La existencia de un precursor 6 días antes refuerza la tesis de vulnerabilidad sostenida, no de evento aislado." | "Precursor de sobretensión, 22-A-2025. Fuente: IIT-ICAI." |
| `CollapseSismograph` | React | Sismógrafo interactivo del colapso | "El sismógrafo del colapso permite explorar la evolución temporal de las variables de red segundo a segundo." | "El usuario puede observar cómo la tensión diverge antes que la frecuencia, confirmando la secuencia causal documentada." | — |

### 4.II.11 Introducción completa del anexo

Este anexo analiza las condiciones de estabilidad dinámica, frecuencia y tensión del sistema eléctrico peninsular antes y durante el incidente del 28 de abril de 2025. Su objetivo es demostrar que el colapso fue un evento dirigido por sobretensión y pérdida de control de reactiva, no un fenómeno clásico de subfrecuencia por pérdida de generación.

Los registros de las PMU instaladas en la subestación de Carmona (400 kV) documentan las oscilaciones de tensión que precedieron al disparo raíz y la posterior cascada. Las tablas de tensiones en nudos críticos revelan que múltiples subestaciones del sur peninsular superaban los límites superiores antes de que se registrase la primera desviación significativa de frecuencia. Un evento precursor de sobretensión el 22 de abril de 2025, seis días antes del colapso, confirma que la vulnerabilidad era sostenida.

El anexo se organiza en cuatro secciones: inestabilidad de tensión y precursores, dinámica de frecuencia e inercia, balance de potencia reactiva, y herramientas interactivas de análisis. Su lectura complementa el Anexo I (condiciones de mix) y precede al Anexo III (actuación de protecciones).

### 4.II.14 Cierre interpretativo completo

La evidencia reunida en este anexo sustenta una conclusión central del TFG: el apagón del 28-A no fue un evento de subfrecuencia clásico sino un colapso de tensión en un sistema con baja inercia y baja potencia de cortocircuito. La frecuencia cayó como consecuencia de las desconexiones masivas provocadas por las protecciones de sobretensión, no como causa primaria.

Este anexo no demuestra que la caída de frecuencia fuese irrelevante — fue letal una vez iniciada la cascada — sino que la perturbación de tensión la precedió y la causó. La distinción es relevante para las recomendaciones regulatorias: un sistema diseñado exclusivamente para responder a pérdidas de frecuencia no habría evitado el 28-A.

La lectura se complementa con el Anexo III, que reconstruye la cascada de protecciones activada por las sobretensiones, y con el Anexo X, que formaliza las ecuaciones de estabilidad de tensión y colapso jacobiano.

---

# ANEXO III — Protecciones, cascada y desconexiones

### 4.III.2 Pregunta técnica

¿Cómo se propagó la cascada de desconexiones entre el disparo raíz en la zona suroeste y el colapso total del sistema ibérico, y qué protecciones actuaron en cada fase?

### 4.III.3 Tesis

La cascada del 28-A se desarrolló en cuatro fases comprimidas en menos de cinco minutos: (1) propagación de sobretensiones por la red de 400 kV del suroeste, amplificadas por el efecto Ferranti y el Tap-Lag de los transformadores reguladores; (2) disparo masivo de protecciones ANSI 59 en inversores IBR con pérdida de ~4,5 GW en 11 segundos; (3) actuación de los mecanismos automáticos de defensa — deslastre UFLS y desconexión de bombeo — que resultaron insuficientes ante la velocidad de la perturbación; (4) colapso de frecuencia y pérdida total del sincronismo peninsular. Las protecciones funcionaron según especificación; la especificación no contemplaba un escenario de sobretensión generalizada con baja inercia.

### 4.III.4 Modelo visual recomendado

Dossier cronológico. Las secciones corresponden a las fases de la cascada.

### 4.III.5 Estructura final propuesta

**Sección 1 — Fase 1: Propagación de sobretensiones**
- ID: `propagacion-sobretensiones`
- Elementos:
  1. `heatmap_propagation.png` [NUCLEAR]
  2. `tap_lag_decoupling.png` [NUCLEAR]
  3. `aluvion_alertas_sobretension_sur.png` [APOYO]
  4. Componente `FerrantiCapacitiveLineSimulator` [APOYO] — simulador del efecto Ferranti
  5. Componente `TapLagSequence` [APOYO] — secuencia del desacoplamiento Tap-Lag
  6. Componente `OvervoltageTimeline` [NUCLEAR] — cronología de sobretensiones
- Abierta: Sí
- Texto introductorio: "Entre las 12:30 y las 12:33 CEST, las sobretensiones se propagaron por la red de 400 kV del sur y suroeste peninsular. La inercia mecánica de los OLTC (On-Load Tap Changers) amplificó las sobretensiones en la red colectora de distribución, haciéndolas invisibles para el SCADA de REE en la red de transporte."

**Sección 2 — Fase 2: Cascada de desconexiones IBR**
- ID: `cascada-ibr`
- Elementos:
  1. `cascada_desconexiones.png` [NUCLEAR]
  2. `albustami_ieee39_secuencia.png` [APOYO]
  3. Tabla `secuencia-desconexion-suroeste` [NUCLEAR] — cronología del suroeste
  4. Tabla `eventos-proteccion-maniobras` [APOYO]
  5. Componente `ANSI59Cascade` [APOYO] — simulador ANSI 59
  6. Componente `AnimatedMap` [NUCLEAR] — mapa animado de la propagación
  7. Componente `StickyCollapse` [APOYO]
  8. Componente `VerticalTimeline` [APOYO]
- Abierta: Sí
- Texto introductorio: "En 11 segundos, los inversores fotovoltaicos conectados a la red de distribución dispararon sus protecciones ANSI 59 de sobretensión, retirando aproximadamente 4,5 GW. La propagación geográfica siguió un patrón de sur a norte y de oeste a este."

**Sección 3 — Fase 3: Deslastre y defensa**
- ID: `deslastre-defensa`
- Elementos:
  1. Tabla `escalones-ufls` [NUCLEAR]
  2. Tabla `demand-shedding-es` [APOYO]
  3. Tabla `demand-shedding-pt` [APOYO]
  4. Tabla `load-shedding-es-pt` [APOYO]
  5. Tabla `dso-load-shedding` [APOYO]
  6. Tabla `electro-intensive-pt` [DOCUMENTAL]
  7. Tabla `desconexion-bombeo-hidraulica` [APOYO]
  8. Tabla `pump-storage-es` [DOCUMENTAL]
  9. Tabla `pump-storage-pt` [DOCUMENTAL]
  10. Componente `GridUnavailabilityGauge` [APOYO]
  11. Componente `PO74Timeline` [APOYO] — cronología del P.O. 7.4
- Abierta: Sí
- Texto introductorio: "Los mecanismos automáticos de defensa del sistema actuaron según su diseño: el deslastre de carga por subfrecuencia (UFLS) desconectó escalones progresivos de demanda, y el bombeo se desacopló. Sin embargo, la velocidad de la pérdida de generación IBR superó la capacidad de respuesta de estos mecanismos."

**Sección 4 — Estado final: topología y nucleares**
- ID: `estado-final`
- Elementos:
  1. Tabla `re-topological-manoeuvres` [DOCUMENTAL]
  2. Tabla `ren-topological-manoeuvres` [DOCUMENTAL]
  3. Tabla `lines-outage-icai` [DOCUMENTAL]
  4. Tabla `km-percentage-icai` [DOCUMENTAL]
  5. Tabla `estado-centrales-nucleares` [DOCUMENTAL]
- Abierta: No (colapsable)
- Texto introductorio: "Las maniobras topológicas ejecutadas por REE y REN, el estado de las líneas de transporte y la situación de las centrales nucleares documentan el estado final del sistema tras el colapso."

**Nota importante:** Las series chart-9 a chart-12 (precios y desvíos) se reubican al Anexo V.

### 4.III.6 Elementos nucleares

| Elemento | Tipo | Por qué es nuclear | Texto antes | Texto después | Caption |
|----------|------|-------------------|-------------|---------------|---------|
| `heatmap_propagation.png` | PNG | Mapa de propagación espacial de sobretensiones | "El mapa de calor muestra la propagación espacial de las sobretensiones entre la maniobra de mallado (12:30) y el disparo raíz (12:32:56). Las zonas cálidas concentran subestaciones donde la tensión superó límites." | "La concentración en el cuadrante suroeste explica por qué las primeras desconexiones se produjeron en plantas fotovoltaicas de Andalucía y Extremadura." | "Propagación espacial de sobretensiones, Fase 1 del 28-A. Fuente: Comité / REE." |
| `cascada_desconexiones.png` | PNG | Propagación geográfica de la cascada en 11 seg | "La siguiente figura muestra la propagación geográfica de la cascada durante la Fase 2, entre el disparo raíz y la pérdida masiva de generación IBR." | "La velocidad de la propagación — 11 segundos — superó la capacidad de respuesta de los mecanismos automáticos de defensa." | "Cascada de desconexiones, Fase 2 del 28-A. Fuente: Comité." |
| `tap_lag_decoupling.png` | PNG | Mecanismo Tap-Lag que ocultó las sobretensiones al SCADA | "El desacoplamiento Tap-Lag amplificó las sobretensiones en la red colectora, fuera de la observabilidad directa del SCADA de REE." | "Este mecanismo es un factor clave para entender por qué el operador no vio la sobretensión hasta que los inversores comenzaron a desconectarse." | "Desacoplamiento Tap-Lag, 400kV → colectora. Fuente: ENTSO-E / IIT-ICAI." |
| Tabla `escalones-ufls` | Tabla | Registra los escalones de deslastre automático | "Los escalones de deslastre por subfrecuencia (UFLS) documentan la respuesta automática de defensa." | "La secuencia muestra que los escalones se activaron según diseño pero no bastaron para contener la perturbación." | — |
| `AnimatedMap` | React | Mapa animado de la propagación | "El mapa animado permite recorrer la secuencia temporal de desconexiones segundo a segundo." | "El usuario puede observar cómo la cascada se propaga de sur a norte y de oeste a este." | — |
| `OvervoltageTimeline` | React | Cronología detallada de la sobretensión | "La cronología interactiva permite explorar cada evento de sobretensión con su timestamp y localización." | — | — |
| Tabla `secuencia-desconexion-suroeste` | Tabla | Cronología del suroeste, 16 eventos | "La tabla de secuencia del suroeste documenta los 16 eventos de desconexión en la zona donde se inició la cascada." | "La concentración temporal (11 segundos) confirma la velocidad del fallo." | — |

### 4.III.11 Introducción completa

Este anexo reconstruye la secuencia de actuaciones de protección, desconexiones de generación y deslastre de carga que transformaron una condición de sobretensión localizada en el sur peninsular en un colapso total del sistema ibérico en menos de cinco minutos.

La cascada se articula en cuatro fases. En la primera, las sobretensiones se propagaron por la red de 400 kV del suroeste, amplificadas por el efecto Ferranti en líneas descargadas y por el retardo mecánico de los transformadores reguladores (Tap-Lag), que ocultó la magnitud de la perturbación al SCADA del operador de transporte. En la segunda, los inversores fotovoltaicos dispararon sus protecciones ANSI 59 de sobretensión, retirando aproximadamente 4,5 GW en 11 segundos. En la tercera, los mecanismos automáticos de defensa — deslastre UFLS, desconexión de bombeo — actuaron según diseño pero resultaron insuficientes ante la velocidad de la perturbación. En la cuarta, el sistema perdió el sincronismo peninsular.

### 4.III.14 Cierre interpretativo completo

La cascada del 28-A demostró que un sistema eléctrico puede perder la estabilidad en segundos cuando confluyen baja inercia, sobretensión no controlada e inversores con protecciones calibradas para fallos puntuales. Las protecciones no fallaron: operaron según especificación. El problema residía en que la especificación (P.O. 7.4 previo a la reforma, umbrales ANSI 59 estándar) no contemplaba un escenario de penetración IBR dominante con baja potencia de cortocircuito.

Este anexo no determina responsabilidades; documenta la mecánica del fallo. La interpretación de si las protecciones debían haber sido reformadas antes del evento corresponde al análisis regulatorio de los capítulos principales. La lectura se complementa con el Anexo II (inestabilidad de tensión previa), el Anexo IV (pérdida de sincronismo transfronterizo) y el Anexo VI (reposición posterior).

---

# ANEXO IV — Interconexiones y flujos transfronterizos

*(Estructura condensada por extensión del documento)*

### 4.IV.5 Estructura final propuesta

**Sección 1 — Pérdida de sincronismo transfronterizo** (`perdida-sincronismo`)
- `interconexion_francia_colapso.png` [NUCLEAR], `perdida_sincronismo_frontera.png` [APOYO], `entsoe_flow_deviation.png` [NUCLEAR], Tabla `intercambios-internacionales-minuto` [APOYO], Componente `InterconnectionDashboard` [APOYO], Serie `chart-14` (CrossBorderFlows) [APOYO]

**Sección 2 — HVDC y tecnología de enlace** (`hvdc-tecnologia`)
- `hvdc_control_transition.png` [APOYO], Tabla `hvdc-santa-llogaia-parametros` [APOYO], Componente `IberianGridTopology` [APOYO]

**Sección 3 — Programación e intercambios previos** (`intercambios-previos`)
- Tabla `programa-intercambios-pre-apagon` [DOCUMENTAL], `intercambio_marruecos_topdown.png` [DOCUMENTAL], Series chart-13, 15, 16, 17 [APOYO]

**Sección 4 — Re-energización desde Francia** (`reenergizacion-francia`)
- `evolucion_carga_repuesta_francia.png` [NUCLEAR], `timeline-light.png` [APOYO], Componente `CommandArchitectureGraph` [APOYO], Componente `CoordinationTimeline` [APOYO]

---

# ANEXO V — Mercado eléctrico y costes: la vulnerabilidad invisible

### 4.V.5 Estructura final propuesta

**Sección 1 — Señales de mercado el 28-A** (`señales-mercado`)
- Tabla `precios-marginales-omie` [NUCLEAR], Series chart-9, 10 (reubicadas desde Anexo III) [APOYO], Componente `PicasoPriceChart` [APOYO]

**Sección 2 — Balance y desvíos** (`balance-desvios`)
- Series chart-18 a chart-22 [APOYO], Series chart-11, 12 (reubicadas desde Anexo III) [APOYO], Componente `ThermalAdjustmentCostMatrix` [APOYO]

**Sección 3 — Ausencia de precio para propiedades dinámicas** (`vulnerabilidad-mercado`)
- `coste_optimo_ers.png` [DOCUMENTAL], `ers_revenue_stacking.png` [DOCUMENTAL]
- Texto: "Las dos figuras siguientes ilustran modelos de retribución para servicios de inercia y respuesta rápida. La relevancia para el 28-A reside en que ninguno de estos mecanismos estaba en vigor la mañana del evento."

---

# ANEXO VI — Reposición, Black Start y operación de emergencia

### 4.VI.5 Estructura final propuesta

**Sección 1 — Estrategia de reposición** (`estrategia-reposicion`)
- `estrategia_reenergizacion_dual.png` [NUCLEAR], `black_start_hidroelectrico.png` [APOYO], Tabla `centrales-black-start` [NUCLEAR], `islas_reposicion_entsoe.png` [APOYO], Tabla `tiempos-restauracion-islas` [APOYO]

**Sección 2 — Recuperación de demanda** (`recuperacion-demanda`)
- `recuperacion_demanda_peninsular.png` [NUCLEAR], `figuraB3-light.png` [APOYO], Tabla `recuperacion-demanda-espana` [APOYO], Tabla `recuperacion-portugal` [APOYO], Serie `chart-23` (FallbacksChart) [APOYO]

**Sección 3 — Estados EAS y coordinación** (`estados-eas`)
- Tabla `eas-state-changes` [APOYO]
- Texto: "La tabla de transiciones del EAS registra el desfase entre la declaración de estado del sistema de alerta europeo y la situación física real de la red."

---

# ANEXO VII — Impacto socioeconómico y resiliencia

### 4.VII.5 Estructura final propuesta

**Sección 1 — Cuantificación del impacto** (`cuantificacion`)
- Tabla `costes-economicos` [NUCLEAR], Componente `FinancialWaterfallChart` [NUCLEAR]

**Sección 2 — Comparación histórica** (`comparacion-historica`)
- Tabla `comparativa-blackouts-historicos` [NUCLEAR]

**Sección 3 — Resiliencia sectorial** (`resiliencia`)
- Componente `SectorialResilienceChart` [APOYO], Componente `TrilemmaTriangle` [DOCUMENTAL]

**Sección 4 — Régimen regulatorio** (`regulatorio`)
- Componente `CNMCSanctionsChart` [APOYO]

---

# ANEXO VIII — Comunicación y percepción pública

### 4.VIII.5 Estructura final propuesta

**Sección 1 — Cobertura mediática** (`cobertura-mediatica`)
- `collage_conservador.png` [APOYO], `collage_progresista.png` [APOYO], `collage_internacional.png` [APOYO]
- Cada collage precedido por texto que identifica el patrón de encuadre.

**Sección 2 — Percepción ciudadana e institucional** (`percepcion`)
- `collage_ciudadanos.png` [APOYO], `collage_politicos.png` [APOYO]

**Sección 3 — Análisis pericial del consenso** (`consenso-pericial`)
- Componente `ConsensusMatrix` [NUCLEAR]
- Componente `EASStateTransition` [APOYO]

**Acciones:** Eliminar pestañas "Tablas" y "Series" del nav. Mover componentes dentro de AnnexSection.

---

# ANEXO IX — Metodología, modelos y contraste de fuentes

### 4.IX.5 Estructura final propuesta

**Sección 1 — Metodología forense y contraste de fuentes** (`metodologia`)
- Tabla `comparativa-conclusiones-entidades` [NUCLEAR], Tabla `compass-lexecon` [APOYO]
- `scr_iberia.png` [APOYO], `po74_banda_muerta.png` [APOYO]

**Sección 2 — Tecnologías de soporte** (`tecnologias`)
- `gfl_vs_gfm_circuit1.png` [APOYO], `hitachi_hybrid.png` [DOCUMENTAL], `pmu_sensors_europe.png` [DOCUMENTAL]

**Sección 3 — Modelos didácticos y simuladores** (`modelos-didacticos`)
- Componentes: Comparador28A, RadarVulnerabilidad, PhasePlanePlot, SwingEquationSimulator, PVCurveSimulator, EnergyTrilemmaSimulator [todos Nivel 4 → referenciados, con enlace a Anexo X]
- ResearchAgendaScatter, ResolutionRoadmap, ThenVsNowPanel [DOCUMENTAL]

**Acciones:** Eliminar pestaña "Series" del nav.

---

# ANEXO X — Ecuaciones, modelos matemáticos y simuladores

### 4.X.1 Función del anexo

Laboratorio matemático central del TFG. Centraliza los 28 simuladores interactivos organizados por dominio físico/económico/sistémico. Cada simulador tiene una frase introductoria que lo conecta con el 28-A y una indicación del parámetro que debe observar el usuario.

### 4.X.2 Pregunta técnica

¿Qué ecuaciones, modelos y simulaciones permiten reproducir cuantitativamente los fenómenos que confluyeron en el apagón del 28-A?

### 4.X.5 Estructura final propuesta

**Sección X.1 — Fortaleza de red, tensión y margen de colapso** (`red-tension`)

| Simulador | Frase de entrada | Parámetro a observar | Relación 28-A | Anexo factual |
|-----------|-----------------|---------------------|---------------|---------------|
| `GridStrengthScrFigure` | "El SCR mide la fortaleza de la red en un nudo. Valores bajos indican proximidad al colapso de tensión." | SCR en nudos del sur peninsular | Directa: el SCR en el sur estaba por debajo de umbrales seguros | II |
| `MRSCRComparator` | "El MRSCR extiende el SCR a sistemas multi-máquina, capturando la interacción entre IBR cercanos." | Comparación MRSCR pre/post penetración IBR | Directa | II |
| `PVCurveSimulator` | "La curva P-V describe el límite de carga transmisible antes del colapso de tensión." | Proximidad del punto operativo al nariz de la curva | Directa: el sistema operaba cerca del nariz | II |
| `PowerFlowJacobianCollapseFigure` | "El determinante del Jacobiano del flujo de potencia se anula en el punto de colapso." | Valor mínimo singular del Jacobiano | Directa | II |
| `PQCapabilitySimulator` | "El diagrama P-Q define los límites de potencia activa y reactiva de un generador." | Zona de operación factible vs punto real | Contextual | X |

**Sección X.2 — Reactiva, líneas, transitorios e inrush** (`reactiva-transitorios`)

| Simulador | Frase de entrada | Parámetro a observar | Relación 28-A | Anexo factual |
|-----------|-----------------|---------------------|---------------|---------------|
| `FerrantiCapacitiveLineSimulator` | "El efecto Ferranti produce sobretensión en el extremo abierto de una línea de EAT descargada." | Sobretensión en función de la longitud de línea | Directa: mecanismo amplificador de la Fase 1 | III |
| `TransformerInrushDecayFigure` | "La corriente de inrush magnetizante al energizar un transformador decae exponencialmente." | Pico de corriente y constante de tiempo | Contextual: relevante para la re-energización | VI |
| `HvdcControlModeResponseFigure` | "Los enlaces HVDC pueden operar en modos de control de potencia, frecuencia o tensión." | Respuesta ante perturbación según modo de control | Directa: el HVDC de Santa Llogaia | IV |

**Sección X.3 — Control, frecuencia, GFM, BESS y fiabilidad** (`control-frecuencia`)

| Simulador | Frase de entrada | Parámetro a observar | Relación 28-A | Anexo factual |
|-----------|-----------------|---------------------|---------------|---------------|
| `SwingEquationSimulator` | "La ecuación del swing describe la respuesta inercial ante un desequilibrio potencia mecánica/eléctrica." | RoCoF en función de la inercia H | Directa: la baja inercia del 28-A aceleró el colapso | II |
| `GfmDroopResponseFigure` | "Los inversores Grid-Forming (GFM) con control droop emulan la respuesta inercial de máquinas síncronas." | Respuesta de frecuencia del GFM | Contextual: tecnología propuesta como solución | IX |
| `PhasePlanePlot` | "El plano de fase visualiza la trayectoria del sistema en el espacio ángulo-frecuencia." | Convergencia vs divergencia de la trayectoria | Directa: trayectoria del 28-A divergente | II |
| `BESSBoomChart` | "La evolución de la capacidad BESS instalada condiciona la disponibilidad de respuesta rápida." | Tendencia de instalación vs necesidad de FFR | Contextual | I |
| `LOLEBarChart` | "El indicador LOLE (Loss of Load Expectation) mide la adecuación de capacidad del sistema." | Horas de pérdida de carga esperada por año | Contextual | I |
| `DynamicSecurityShift` | "El desplazamiento de la frontera de seguridad dinámica muestra cómo la penetración IBR reduce el margen." | Posición del punto operativo respecto a la frontera | Directa | II |

**Sección X.4 — Mercado, coste, congestión y resiliencia** (`mercado-coste`)

| Simulador | Frase de entrada | Parámetro a observar | Relación 28-A | Anexo factual |
|-----------|-----------------|---------------------|---------------|---------------|
| `LmpCongestionDecompositionFigure` | "Los precios nodales (LMP) descomponen el coste en energía, pérdidas y congestión." | Componente de congestión en nudos del sur | Contextual: el mercado marginalista no capturaba restricciones físicas | V |
| `DcopfCongestionManagementFigure` | "El DC-OPF modela el despacho económico con restricciones de red." | Flujos congestionados vs capacidad | Contextual | V |
| `VoLLSectorIntegralFigure` | "El VoLL (Value of Lost Load) cuantifica el coste social de la energía no suministrada." | VoLL por sector económico | Directa: base para estimación de impacto | VII |
| `PicasoPriceChart` | "El sistema PICASSO coordina la activación de reservas de balance en Europa." | Precios de activación durante el evento | Directa | V |
| `CNMCSanctionsChart` | "El régimen sancionador de la CNMC establece los incentivos regulatorios del operador." | Evolución de sanciones por incumplimiento | Contextual | VII |
| `TrilemmaTriangle` | "El trilema energético visualiza el equilibrio entre seguridad, sostenibilidad y asequibilidad." | Posición del sistema ibérico en el trilema | Contextual | VII |
| `TrilemmaStateSpaceFigure` | "El espacio de estados del trilema permite explorar trayectorias de política energética." | Trayectoria 2020→2025 | Contextual | VII |

**Sección X.5 — Modelos sistémicos, comunicación y comparación** (`sistemicos`)

| Simulador | Frase de entrada | Parámetro a observar | Relación 28-A | Anexo factual |
|-----------|-----------------|---------------------|---------------|---------------|
| `SIRDisinformationDelayFigure` | "El modelo SIR adaptado simula la propagación de narrativas falsas frente a la comunicación institucional." | Retardo institucional vs velocidad de propagación | Directa: el retardo comunicativo del 28-A | VIII |
| `RadarVulnerabilidad` | "El radar multidimensional de vulnerabilidad evalúa el sistema en 6 ejes: inercia, Scc, reactiva, interconexión, mercado, comunicación." | Ejes con mayor deficit | Directa | IX |
| `Comparador28A` | "El comparador permite contrastar las condiciones operativas del 28-A con otros escenarios." | Diferencia entre 28-A y condiciones seguras | Directa | IX |
| `ThenVsNowPanel` | "El panel antes/después compara la configuración del sistema pre y post reforma." | Cambios implementados tras el evento | Directa | IX |
| `ResearchAgendaScatter` | "El mapa de agenda de investigación sitúa las cuestiones abiertas por impacto y factibilidad." | Cuestiones de alta prioridad | Contextual | IX |
| `ResolutionRoadmap` | "La hoja de ruta de resolución muestra el calendario de reformas regulatorias y técnicas." | Hitos previstos vs cumplidos | Contextual | IX |
| `EnergyTrilemmaSimulator` | "El simulador del trilema permite modificar los pesos de seguridad, sostenibilidad y asequibilidad." | Efecto de priorizar seguridad sobre asequibilidad | Contextual | VII |

---

## 5. Reubicaciones globales recomendadas

| Elemento | Ubicación actual | Ubicación recomendada | Motivo | Prioridad |
|----------|-----------------|----------------------|--------|-----------|
| chart-9 (PreciosChart) | Anexo III (T3) | Anexo V (T5) | Serie de precios SPOT, no de protecciones | Alta |
| chart-10 (PrecioEnergiaChart) | Anexo III (T3) | Anexo V (T5) | Serie de precios desglosados | Alta |
| chart-11 (EnergyPricesChart) | Anexo III (T3) | Anexo V (T5) | Serie de precios europeos | Alta |
| chart-12 (GenericEsiosChartDesvios) | Anexo III (T3) | Anexo V (T5) | Serie de desvíos tiempo real | Alta |
| Import LOLEBarChart | Anexo I | Eliminar | No se renderiza | Alta |
| Import BESSBoomChart | Anexo I | Eliminar | No se renderiza | Alta |
| PO74Timeline | Anexo III (fuera de sección) | Anexo III (dentro de sección Fase 1) | Componente colgante | Media |
| OvervoltageTimeline | Anexo III (fuera de sección) | Anexo III (dentro de sección Fase 1) | Componente colgante | Media |
| CommandArchitectureGraph | Anexo IV (fuera de sección) | Anexo IV (dentro de sección re-energización) | Componente colgante | Media |
| CoordinationTimeline | Anexo IV (fuera de sección) | Anexo IV (dentro de sección re-energización) | Componente colgante | Media |
| EASStateTransition | Anexo VIII (fuera de sección) | Anexo VIII (dentro de sección consenso pericial) | Componente colgante | Media |
| ConsensusMatrix | Anexo VIII (fuera de sección) | Anexo VIII (dentro de sección consenso pericial) | Componente colgante | Media |

---

## 6. Elementos que deben conservarse sí o sí

| Elemento | Anexo | Por qué es esencial | Texto necesario |
|----------|-------|--------------------|-----------------| 
| `tension_frecuencia_colapso.png` | II | Evidencia más directa de la secuencia tensión→frecuencia | Textos puente de 4.II.6 |
| `frequency_voltage_carmona.png` | II | Registro PMU de los segundos críticos | Textos puente de 4.II.6 |
| `heatmap_propagation.png` | III | Mapa de propagación espacial de sobretensiones | Textos puente de 4.III.6 |
| `cascada_desconexiones.png` | III | Propagación geográfica en 11 segundos | Textos puente de 4.III.6 |
| `ree_generation_mix_28april.png` | I | Perfil de generación del día | Textos puente de 4.I.6 |
| `tap_lag_decoupling.png` | III | Mecanismo Tap-Lag | Textos puente de 4.III.6 |
| Tabla `escalones-ufls` | III | Escalones UFLS | Texto introductorio Fase 3 |
| Tabla `secuencia-desconexion-suroeste` | III | Cronología del suroeste | Texto introductorio Fase 2 |
| `interconexion_francia_colapso.png` | IV | Pérdida de sincronismo | Texto de sección 1 Anexo IV |
| `recuperacion_demanda_peninsular.png` | VI | Curva de re-energización | Texto de sección 2 Anexo VI |
| Todos los simuladores de Anexo X | X | Formalización matemática | Frases de entrada individuales |
| `CollapseSismograph` | II | Sismógrafo interactivo | Texto de sección 2 Anexo II |
| `AnimatedMap` | III | Mapa animado de cascada | Texto de sección 2 Anexo III |
| `ConsensusMatrix` | VIII | Consenso pericial entre informes | Texto de sección 3 Anexo VIII |

---

## 7. Elementos que pueden quedar como evidencia secundaria

| Elemento | Anexo | Motivo | Tratamiento |
|----------|-------|--------|-------------|
| `capacidad_instalada_2025.png` | I | Contexto de parque, no del día | Nivel 3, sección colapsable |
| `mix_comparativo_2010_2024.png` | I | Transición, no evento | Nivel 3, sección colapsable |
| `futured_grid_evolution.png` | II | Prospectivo | Nivel 3, sección herramientas |
| `wams_oscilaciones_carmona.png` | II | Complemento de PMU | Nivel 3 |
| `coste_optimo_ers.png` | V | Genérico | Nivel 3, con texto explicativo |
| `ers_revenue_stacking.png` | V | Genérico | Nivel 3, con texto explicativo |
| `hitachi_hybrid.png` | IX | Comercial/tecnológico | Nivel 3 |
| `pmu_sensors_europe.png` | IX | Mapa genérico europeo | Nivel 3 |
| `EmissionsVsRenewablesChart` | I | Contextual | Nivel 3 |

---

## 8. Elementos prescindibles o duplicados

| Elemento | Motivo | Alternativa |
|----------|--------|-------------|
| Import LOLEBarChart en Anexo I | Código muerto; el componente existe en Anexo X | Eliminar import |
| Import BESSBoomChart en Anexo I | Código muerto | Eliminar import |
| Pestaña "Tablas" en nav de Anexo VIII | No tiene sección | Eliminar del array |
| Pestaña "Series" en nav de Anexo VIII | No tiene sección | Eliminar del array |
| Pestaña "Series" en nav de Anexo IX | No tiene sección | Eliminar del array |
| Comentario `{/* RESERVADO */}` en Anexo X | Placeholder de desarrollo | Eliminar |
| Archivos `.bak` legacy | No visibles, fuera de producción | No tocar |

---

## 9. Sistema de textos puente

### Patrón para una figura nuclear:

> "[Contexto causal]. La siguiente [figura/imagen] muestra [qué muestra] durante [intervalo o momento]. [Qué debe observar el lector]."
>
> *[Figura]*
>
> "[Interpretación]. [Conexión con el argumento de la sección]. [Enlace a otro anexo si procede]."

**Ejemplo:** "La condición operativa del sistema a las 12:30 CEST condicionaba directamente el margen de inercia disponible. La siguiente figura muestra el perfil de generación del 28-A. El lector debe observar la proporción entre generación IBR y síncrona."

### Patrón para una tabla de validación:

> "La [tabla siguiente] cuantifica [qué cuantifica]. Los valores corresponden a [intervalo o momento del 28-A]."
>
> *[Tabla]*
>
> "Los datos confirman que [conclusión]. [Nota sobre discrepancia si existe]."

### Patrón para una serie temporal:

> "La serie ESIOS/ENTSO-E cubre el período [intervalo] y permite verificar [qué verifica]. [Qué variable debe observar el lector]."

### Patrón para un componente interactivo:

> "El siguiente [simulador/herramienta interactiva] permite explorar [qué fenómeno]. El usuario puede modificar [parámetro] para observar [efecto]. [Relación con el 28-A]. La formalización matemática se encuentra en el Anexo X."

### Patrón para una imagen contextual (Nivel 3):

> "[Contexto]. Esta imagen no se refiere directamente al evento del 28-A, sino a [qué contexto proporciona]."

---

## 10. Sistema de captions

**Fórmula:** `[Qué muestra]. [Fecha o intervalo si procede]. [Relación con el 28-A en una frase corta si no es obvia]. Fuente: [fuente].`

**Ejemplos:**

- "Perfil de generación peninsular, 28-A-2025. El pico fotovoltaico coincidió con el mínimo de generación síncrona. Fuente: NREL / Red Eléctrica."
- "Propagación espacial de sobretensiones, 12:30–12:33 CEST. Fuente: Comité del Gobierno / REE."
- "Escalones UFLS activados durante la cascada del 28-A. Fuente: Comité del Gobierno."
- "Evolución del mix 2010–2024. La proporción de generación IBR se triplicó en 14 años. Fuente: Centro Peter Huber / ESIOS."

---

## 11. Sistema de navegación entre anexos

| De | A | Motivo | Texto de enlace |
|----|---|--------|----------------|
| I | II | Mix → estabilidad | "Las consecuencias de esta composición sobre la estabilidad dinámica se analizan en el **Anexo II**." |
| I | V | Mix → mercado | "El mecanismo de mercado que produjo este mix se examina en el **Anexo V**." |
| II | III | Tensión → protecciones | "La actuación de las protecciones de sobretensión se reconstruye en el **Anexo III**." |
| II | X | Fenómenos → ecuaciones | "La formalización de la ecuación del swing y la curva P-V se encuentra en el **Anexo X**." |
| III | IV | Cascada → interconexiones | "La pérdida de sincronismo transfronterizo se analiza en el **Anexo IV**." |
| III | VI | Colapso → reposición | "La secuencia de reposición posterior se documenta en el **Anexo VI**." |
| IV | VI | Francia → re-energización | "El papel de la frontera francesa en la re-energización se recoge en el **Anexo VI**." |
| V | VII | Costes → impacto | "La estimación del impacto económico total se desarrolla en el **Anexo VII**." |
| VI | VII | Duración → costes | "La duración de la reposición condiciona la energía no suministrada; el **Anexo VII** cuantifica su coste." |
| VII | VIII | Impacto → narrativa | "La construcción mediática del evento se documenta en el **Anexo VIII**." |
| IX | X | Modelos → ecuaciones | "Las ecuaciones que gobiernan estos modelos se formalizan en el **Anexo X**." |

---

## 12. Orden de implementación recomendado

| Fase | Objetivo | Riesgo | Resultado esperado |
|------|---------|--------|-------------------|
| **1 — Anexo piloto** | Implementar el rediseño completo en Anexo I como prueba de concepto. Validar que la reorganización por argumento funciona con los componentes existentes. | Medio: requiere decidir si se abandona `AnnexThemeEvidence` en favor de renderizado manual. | Un anexo modelo que demuestra la nueva estructura. |
| **2 — Componentes UI** | Crear `AnnexKeyQuestion`, `AnnexThesisBox`, `AnnexBlackoutRelevance`, `AnnexSectionSummary`, `AnnexCrossLinks` (5 componentes CSS Module). | Bajo: componentes triviales. | Kit de componentes para los 10 anexos. |
| **3 — Limpieza** | Eliminar imports muertos, nav rotas, comentarios placeholder. | Bajo. | Código limpio. |
| **4 — Reestructuración Anexos II y III** | Los dos anexos más densos y forenses. | Medio: muchos elementos que reorganizar. | Los tres anexos centrales del TFG (I+II+III) rediseñados. |
| **5 — Reestructuración Anexos IV–VIII** | Aplicar la plantilla validada. | Bajo: menor densidad de elementos. | 8 de 10 anexos completados. |
| **6 — Reestructuración Anexo X** | Añadir frases de entrada a los 28 simuladores. | Bajo: solo texto MDX. | Laboratorio guiado completo. |
| **7 — Reubicación series** | Reasignar chart-9 a chart-12 de T3 a T5. | Medio: depende del mecanismo de asignación. | Series de precios en su anexo correcto. |
| **8 — Validación** | Build, verificación visual, modo claro/oscuro, responsive. | Bajo. | Sistema validado. |

---

## 13. Prompt final para el agente interno

```
Eres un asistente de código con acceso completo al repositorio Docusaurus del TFG
sobre el apagón ibérico del 28-A-2025.

OBJETIVO:
Transformar los 10 anexos MDX de una organización por tipo de evidencia
(Figuras/Tablas/Interactivos/Series) a una organización por argumento causal,
donde figuras, tablas, series y componentes se mezclan según su función
en el razonamiento, no según su formato.

DECISIÓN TÉCNICA CLAVE:
Los anexos actualmente usan <AnnexThemeEvidence theme="T1" include={['figures']} />
para renderizar elementos por tipo. La reorganización por argumento requiere
renderizar elementos individualmente, intercalados con texto MDX.

Opción A (recomendada): Renderizar cada elemento manualmente en el MDX:
- Para imágenes: usar <img> o un componente existente de galería de evidencias
  que permita renderizar una imagen individual por su ID.
- Para tablas: verificar si AnnexThemeEvidence acepta un filtro por ID de tabla
  individual, o si las tablas se renderizan desde un componente independiente.
- Para componentes React: importarlos directamente y renderizarlos en JSX.
- Para series ESIOS: verificar cómo se renderizan (probablemente vía un
  componente de chart genérico).

Antes de empezar, AUDITA el mecanismo de renderizado:
1. ¿Puede AnnexThemeEvidence renderizar un solo elemento por ID?
2. ¿Existe un componente que renderice una imagen individual de la galería?
3. ¿Las tablas se renderizan desde forensic_categories.json vía un componente?
4. ¿Las series se renderizan desde forensicCharts.js vía GenericForensicChart
   o similar?

Si AnnexThemeEvidence NO puede renderizar elementos individuales,
la reorganización requiere usar los componentes subyacentes directamente.
Documenta los hallazgos antes de hacer cambios.

COMPONENTES A CREAR (en src/components/annex/):
1. AnnexKeyQuestion.jsx + .module.css — caja con borde izquierdo burdeos (#6B1024).
2. AnnexThesisBox.jsx + .module.css — fondo diferenciado, borde superior.
3. AnnexBlackoutRelevance.jsx + .module.css — tarjeta compacta.
4. AnnexSectionSummary.jsx + .module.css — bloque cierre con borde superior.
5. AnnexCrossLinks.jsx + .module.css — lista de enlaces a otros anexos.

Todos: CSS Modules, modo claro (papel: #f8f4ea, superficie: #fffdf7)
y oscuro (fondo: #0d1e38, superficie: #13263f). JSX trivial: div+children.

ESTRUCTURA DE CADA ANEXO (aplicar a los 10):
1. AnnexLayout (existente, no tocar)
2. AnnexKeyQuestion — pregunta del documento de diseño
3. AnnexThesisBox — tesis del documento de diseño
4. AnnexBlackoutRelevance — conexión con el 28-A
5. AnnexMethodNote (existente, conservar)
6. AnnexReadingMap — párrafo MDX itálico con mapa de lectura
7. AnnexEvidenceNav — con pestañas ARGUMENTALES (no por tipo)
8. Secciones argumentales (AnnexSection) con elementos mezclados + textos puente
9. AnnexSectionSummary — cierre interpretativo
10. AnnexCrossLinks — enlaces a anexos relacionados

TEXTOS: Usar los textos exactos del documento de diseño adjunto.
Para cada anexo, las secciones 4.X.11 (introducción), 4.X.12 (mapa),
4.X.13 (textos puente), 4.X.14 (cierre) contienen los textos completos.

PESTAÑAS ARGUMENTALES POR ANEXO:
- I: [Condición previa] [Previsiones] [Capacidad] [Transición]
- II: [Tensión] [Frecuencia] [Reactiva] [Herramientas]
- III: [Sobretensiones] [Cascada IBR] [Deslastre] [Estado final]
- IV: [Sincronismo] [HVDC] [Intercambios] [Re-energización]
- V: [Precios 28-A] [Balance] [Vulnerabilidad]
- VI: [Estrategia] [Recuperación] [EAS]
- VII: [Impacto] [Comparación] [Resiliencia] [Regulatorio]
- VIII: [Medios] [Percepción] [Consenso]
- IX: [Metodología] [Tecnologías] [Modelos]
- X: [Red y tensión] [Reactiva] [Control] [Mercado] [Sistémicos]

REUBICACIONES:
- Reasignar chart-9,10,11,12 de tema T3 a T5 (verificar mecanismo).
- Eliminar imports LOLEBarChart y BESSBoomChart de Anexo I.
- Mover componentes inline (PO74Timeline, OvervoltageTimeline,
  CommandArchitectureGraph, CoordinationTimeline, EASStateTransition,
  ConsensusMatrix) dentro de AnnexSection.
- Eliminar pestañas nav rotas (VIII: Tablas+Series; IX: Series).
- Eliminar comentario RESERVADO de Anexo X.

FASES:
1. Auditar mecanismo de renderizado (AnnexThemeEvidence, tablas, series).
2. Crear 5 componentes de layout.
3. Implementar Anexo I piloto.
4. Validar build + visual.
5. Implementar Anexos II y III.
6. Implementar Anexos IV–VIII.
7. Implementar Anexo X (frases de entrada).
8. Implementar Anexo IX.
9. Reubicar series.
10. Validación final: build, visual, claro/oscuro, responsive.

RESTRICCIONES:
- NO tocar package.json, lockfiles, custom.css, sidebars.js, i18n.
- NO tocar componentes React internos (solo su ubicación en MDX).
- NO borrar figuras/tablas/componentes; solo reorganizar.
- NO añadir dependencias.
- Todos los textos en español.

RESPUESTA FINAL:
- Hallazgos de la auditoría de renderizado.
- Lista de archivos creados/modificados con resumen de cambios.
- Advertencias o decisiones pendientes.
- Confirmación de que npm run build pasa sin errores.
```

---

*Fin del documento de rediseño argumental.*
