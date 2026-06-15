# Auditoría Terminológica y Semántica del Glosario Técnico (Capítulo a Capítulo)

Este informe detalla una segunda auditoría no destructiva del sistema de glosario técnico y el marcado automático en tiempo de compilación. A partir del informe base `AUDITORIA_GLOSARIO_TECNICO.md`, se ha analizado un listado de **60 términos y referencias semilla** (detectados en el relato de los capítulos) cotejados con el estado real de `glossary.js`, la lista `RAW_TERMS` en `remark-auto-glossary-links.js` y el contexto exacto en cada archivo MDX.

Se han incorporado además **términos técnicos adicionales descubiertos** durante una búsqueda de patrones regulatorios y dinámicos (como `VSC` y `AGC`).

---

## 1. Clasificación Detallada de Candidatos (Semilla y Descubiertos)

```txt id="l8r7ks"
AUDITORIA_GLOSARIO_TERMINOS_NUEVOS_CAPITULO_A_CAPITULO.md
```

La tabla a continuación clasifica cada término en una de las siguientes categorías según los criterios del sistema:
* **NUEVA_ENTRADA_GLOSARIO**: Concepto técnico relevante que requiere definición formal en `glossary.js` para tarjeta y página.
* **ALIAS_DE_ENTRADA_EXISTENTE**: Concepto ya definido en `glossary.js` pero bajo otra denominación, sigla o plural. Requiere mapeo en `RAW_TERMS`.
* **FIX_RAW_TERMS**: Existe en `glossary.js` y `RAW_TERMS`, pero falla al activarse en verde o mostrar tarjeta (por diferencia de case, errata tipográfica en MDX, o discordancia de slug).
* **REFERENCIA_SIN_TARJETA**: Referencia institucional, legal, regulatoria o caso histórico. Se mantiene como texto plano, sin tarjeta didáctica.
* **POSIBLE_ERRATA**: Error tipográfico en el MDX o la semilla que debe corregirse.

| Capítulo | Término | Fragmento exacto | ¿Existe en glossary.js? | ¿Existe en RAW_TERMS? | Clasificación | Acción recomendada | Prioridad | Comentario |
|---|---|---|---|---|---|---|---|---|
| `02-contexto.mdx` | **Colapso de South Australia 2016** | `...los colapsos de South Australia (2016)...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Caso histórico. |
| `02-contexto.mdx` | **Colapso del Reino Unido 2019** | `...y Reino Unido (2019) evidenciaron...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Caso histórico. |
| `02-contexto.mdx` | **efecto látigo** | `...hacia la periferia ibérica (*efecto látigo*), y...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición en `glossary.js` y añadir a `RAW_TERMS`. | Alta | Concepto dinámico clave de propagación y amplificación de oscilaciones. |
| `02-contexto.mdx` | **EAS** | `## El sistema de alerta europeo (EAS)...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Enlaza correctamente con el slug `esquema-de-alertas-sistemicas-eas`. |
| `02-contexto.mdx` | **VSC** (Descubierto) | `...enlace subterráneo HVDC VSC INELFE...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición en `glossary.js` y añadir a `RAW_TERMS`. | Alta | Tecnología de convertidores basada en transistores IGBT, clave para control reactivo. |
| `03-analisis-incidente.mdx` | **PMODE3** | `...INELFE-1 cambia PMODE3 → PMODE1.` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición conjunta para PMODE en `glossary.js` y añadir a `RAW_TERMS`. | Alta | Modo dinámico de control de tensión y potencia reactiva de los enlaces VSC. |
| `03-analisis-incidente.mdx` | **PMODE1** | `...INELFE-1 cambia PMODE3 → PMODE1.` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Incluir en definición de PMODE y añadir a `RAW_TERMS`. | Alta | Modo de reactiva fija (sin regulación dinámica) en el que se fijó el enlace. |
| `03-analisis-incidente.mdx` | **ANSI 59** | `...cascada de disparos ANSI 59.` | SÍ | SÍ (alias) | `FIX_RAW_TERMS` | Añadir `"ANSI 59"` (shorthand) a `RAW_TERMS`. | Alta | El plugin solo contiene `"ANSI 59 (Protección de Sobretensión)"`, impidiendo el marcado del shorthand. |
| `03-analisis-incidente.mdx` | **HVDC INELFE-1** | `...el enlace HVDC INELFE-1 — fijado...` | NO (HVDC sí) | SÍ (HVDC sí) | `ALIAS_DE_ENTRADA_EXISTENTE` | Mapear en `RAW_TERMS` para apuntar a la nueva entrada `INELFE`. | Media | Refiere al enlace físico concreto. |
| `03-analisis-incidente.mdx` | **INELFE** | `...enlace subterráneo HVDC VSC INELFE...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición para `INELFE` y añadir a `RAW_TERMS`. | Alta | Empresa conjunta e interconexión física franco-española. |
| `03-analisis-incidente.mdx` | **AGC** (Descubierto) | `...mediante el sistema AGC...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición en `glossary.js` y añadir a `RAW_TERMS`. | Alta | Control Automático de Generación (regulación secundaria activa). |
| `04-reaccion-reposicion.mdx` | **sympathetic inrush** | `...fenómeno de *sympathetic inrush* — la...` | SÍ | SÍ (cap) | `FIX_RAW_TERMS` | Añadir el case minúsculo `"sympathetic inrush"` a `RAW_TERMS`. | Alta | El plugin tiene `"Sympathetic Inrush"`, pero falla en el texto por la sensibilidad de `indexOf`. |
| `04-reaccion-reposicion.mdx` | **magnetizing inrush** | `...corrientes de inserción (*magnetizing inrush*)...` | SÍ | SÍ (cap) | `FIX_RAW_TERMS` | Añadir el case minúsculo `"magnetizing inrush"` a `RAW_TERMS`. | Alta | El plugin tiene `"Magnetizing Inrush"`, pero falla en el texto por sensibilidad de `indexOf`. |
| `04-reaccion-reposicion.mdx` | **criterio OB3** | `...bajo estado de Blackout (criterio OB3).` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `Criterio OB3` y añadir a `RAW_TERMS`. | Alta | Criterio de control y reposición manual en bucle abierto durante blackout. |
| `04-reaccion-reposicion.mdx` | **Top-Down** | `...estrategia *Top-Down* (soporte externo...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición y añadir a `RAW_TERMS`. | Alta | Estrategia de restauración de la red usando referencias de tensión externas. |
| `04-reaccion-reposicion.mdx` | **Bottom-Up** | `...estrategia *Bottom-Up* (arranque autónomo...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición y añadir a `RAW_TERMS`. | Alta | Estrategia de restauración de la red mediante islas y centrales de autoarranque. |
| `04-reaccion-reposicion.mdx` | **Swissgrid** | `...operados por Swissgrid y Amprion.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | TSO Suizo (actor institucional). |
| `04-reaccion-reposicion.mdx` | **Amprion** | `...operados por Swissgrid y Amprion.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | TSO Alemán (actor institucional). |
| `04-reaccion-reposicion.mdx` | **RTE** | `...y RTE como líder de resincronización.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | TSO Francés (actor institucional). |
| `04-reaccion-reposicion.mdx` | **ONNE** | `NO ENCONTRADO (Semilla de usuario)` | NO | NO | `POSIBLE_ERRATA` | No actuar en MDX. | Alta | La semilla contiene `ONNE`, pero el texto del capítulo usa correctamente `ONEE`. |
| `04-reaccion-reposicion.mdx` | **P.O. 1.6** | `...activa P.O. 1.6 ...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Ya está correctamente enlazado a su definición de glosario. |
| `05-analisis-informes.mdx` | **Criterio N-1** | `...los umbrales del Criterio N−1.` | SÍ | SÍ | `FIX_RAW_TERMS` | Reemplazar `−` por `-` en el MDX; añadir `"N-1"` a `RAW_TERMS`. | Alta | El texto MDX usa un signo menos Unicode `−` (U+2212) en lugar de guion `-` (U+002D) y tiene instancias shorthands `"N-1"`. |
| `05-analisis-informes.mdx` | **P.O. 7.4** | `...del P.O. 7.4 por generadores...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Ya está correctamente enlazado. |
| `05-analisis-informes.mdx` | **RCR** | `...síncronos y RCR ...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Ya está correctamente enlazado. |
| `05-analisis-informes.mdx` | **RD 413/2014** | `...conforme al RD 413/2014 ...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Real Decreto (referencia legal). |
| `05-analisis-informes.mdx` | **PPM** | `...≥ 1 MW (PPM y ESM)...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición para `PPM` (Módulo de Generación) y añadir a `RAW_TERMS`. | Alta | Power Generating Module, clasificación técnica crítica bajo el código NC RfG. |
| `05-analisis-informes.mdx` | **protecciones Out-of-Step**|`...Las protecciones Out-of-Step actuaron...`| SÍ (como OST) | NO | `ALIAS_DE_ENTRADA_EXISTENTE` | Añadir `"protecciones Out-of-Step"` a `RAW_TERMS` apuntando a `OST`. | Alta | Variante descriptiva en castellano de la protección OST. |
| `05-analisis-informes.mdx` | **OST** | `NO ENCONTRADO (Como palabra aislada)` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | El acrónimo OST no aparece solo en este capítulo (aparecía en v2 por substring matching en "posterior"). |
| `05-analisis-informes.mdx` | **ANSI 59** | `NO ENCONTRADO (Semilla de usuario)` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Term no está en este capítulo (aparece en Capítulo 03). |
| `06-impacto-comunicativo.mdx`| **firm power** | `...insuficiencia de *firm power* — una...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición y añadir a `RAW_TERMS`. | Alta | Concepto de potencia firme, objeto de controversia comunicativa sobre renovables. |
| `06-impacto-comunicativo.mdx`| **insuficiencia de firm power**|`...citando la insuficiencia de *firm power*...`| NO | NO | `ALIAS_DE_ENTRADA_EXISTENTE` | Añadir a `RAW_TERMS` redirigiendo al slug de `firm-power`. | Media | Variante contextual de `firm power`. |
| `07b-consecuencias-financieras.mdx`| **CAPEX** | `...y un ingente CAPEX de adaptación...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `CAPEX` y añadir a `RAW_TERMS`. | Alta | Gastos de capital asociados a inversiones en condensadores síncronos y baterías GFM. |
| `07b-consecuencias-financieras.mdx`| **OPEX** | `...OPEX recurrente y CAPEX necesario...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `OPEX` y añadir a `RAW_TERMS`. | Alta | Gastos operativos recurrentes (asociados a la Operación Reforzada). |
| `07b-consecuencias-financieras.mdx`| **operación reforzada** | `...instauró la Operación Reforzada: una...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `Operación Reforzada` y añadir a `RAW_TERMS`. | Alta | Restricción y régimen operativo de seguridad post-apagón. |
| `07b-consecuencias-financieras.mdx`| **Valor de la Energía No Suministrada** | `...el Valor de la Energía No Suministrada...` | SÍ (VoLL) | NO | `ALIAS_DE_ENTRADA_EXISTENTE` | Añadir a `RAW_TERMS` apuntando a `voll-value-of-lost-load`. | Alta | Nombre en castellano y traducción oficial reguladora del VoLL. |
| `07b-consecuencias-financieras.mdx`| **VoLL** | `...No Suministrada (VoLL, *Value...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Mapea correctamente, pero sufre de error de slug (ver sección técnica). |
| `07b-consecuencias-financieras.mdx`| **Value of Lost Load** | `...VoLL, *Value of Lost Load*), avalado...` | SÍ | SÍ (alias) | `FIX_RAW_TERMS` | Añadir `"Value of Lost Load"` a `RAW_TERMS` apuntando a `VoLL`. | Alta | No se marca en el texto porque `"Value of Lost Load"` sin siglas no está en `RAW_TERMS`. |
| `07b-consecuencias-financieras.mdx`| **ACER** | `...avalado por ACER y CEER.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Agencia de reguladores europea (institución). |
| `07b-consecuencias-financieras.mdx`| **CEER** | `...avalado por ACER y CEER.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Consejo de reguladores europeo (institución). |
| `07b-consecuencias-financieras.mdx`| **ENS** | `...la Energía No Suministrada (ENS) agregada...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición para `Energía No Suministrada (ENS)` y añadir a `RAW_TERMS`. | Alta | Métrica física de energía no suministrada (GWh). |
| `07b-consecuencias-financieras.mdx`| **CEOE** | `...las estimaciones preliminares de CEOE...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Asociación patronal española. |
| `07b-consecuencias-financieras.mdx`| **ATA** | `...de CEOE y ATA sitúan la destrucción...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Asociación de autónomos. |
| `07b-consecuencias-financieras.mdx`| **PVPC** | `...repercusión en el PVPC La mañana...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `PVPC` y añadir a `RAW_TERMS`. | Alta | Precio Voluntario para el Pequeño Consumidor (tarifa regulada). |
| `07b-consecuencias-financieras.mdx`| **AEGE** | `...Asociación de Empresas con Gran Consumo (AEGE)...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Asociación industrial. |
| `07b-consecuencias-financieras.mdx`| **ICE** | `...la Infraestructura Común de Evacuación (ICE)...` | NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición para `ICE` y añadir a `RAW_TERMS`. | Alta | Nudo y esquema físico de subestación común de evacuación. |
| `07b-consecuencias-financieras.mdx`| **Ley 24/2013** | `...a partir de CNMC, BOE y Ley 24/2013.` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Ley del Sector Eléctrico. |
| `07b-consecuencias-financieras.mdx`| **Resolución CNMC BOE-A-2025-13076**|`...(BOE-A-2025-13076) — el primer...`| NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Resolución reguladora del BOE. |
| `07b-consecuencias-financieras.mdx`| **BEES** | `NO ENCONTRADO` | NO | NO | `POSIBLE_ERRATA` | No actuar. | Media | Errata del listado semilla del usuario. El texto tiene `BESS` (correcto), no `BEES`. |
| `impacto-social.mdx` | **Ley 17/2015 del Sistema Nacional de Protección Civil** | `...al amparo del artículo 28 de la Ley 17/2015...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Ley del Sistema Nacional de Protección Civil. |
| `impacto-social.mdx` | **Orden INT/399/2025** | `...(Orden INT/399/2025, ampliada por la...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Orden ministerial de emergencia nacional. |
| `impacto-social.mdx` | **Orden INT/400/2025** | `...ampliada por la Orden INT/400/2025).` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Orden de prórroga de la emergencia. |
| `impacto-social.mdx` | **CCON** | `...Operacional Nacional (CCON) de inmediato...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Centro de control de protección civil portugués. |
| `impacto-social.mdx` | **sistema de alertas SMS de la ANEPC** | `...El sistema de alertas SMS de la ANEPC...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Canal de alerta pública de emergencias. |
| `impacto-social.mdx` | **ANEPC** | `...La ANEPC activó el Centro de...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Autoridad de emergencias portuguesa. |
| `impacto-social.mdx` | **ANACOM** | `...ANACOM (Portugal) documentó que el...` | NO | NO | `REFERENCIA_SIN_TARJETA` | Mantener como texto plano. | Baja | Regulador de telecomunicaciones de Portugal. |
| `07-resiliencia-futuro.mdx`| **LVRT** | `...LVRT deficiente + baja inercia...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Enlaza de forma funcional (slug de redirección activo). |
| `07-resiliencia-futuro.mdx`| **FFR** | `...obligatorio + FFR ...` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | Enlaza de forma funcional (slug de redirección activo). |
| `07-resiliencia-futuro.mdx`| **Equivalente de Thévenin**|`...opera como un equivalente de Thévenin:`| NO | NO | `NUEVA_ENTRADA_GLOSARIO` | Crear definición de `Equivalente de Thévenin` y añadir a `RAW_TERMS`. | Alta | Concepto de física y electrotecnia que explica la fuente de tensión en inversores GFM. |
| `07-resiliencia-futuro.mdx`| **BESS-GFM** | `...Los BESS-GFM proveen velocidad...` | SÍ | SÍ (alias) | `FIX_RAW_TERMS` | Añadir `"BESS-GFM"` a `RAW_TERMS` apuntando a `bess-con-inversores-grid-forming-bess-gfm`. | Alta | El shorthand `"BESS-GFM"` solo no se marca porque en `RAW_TERMS` solo está la frase larga. |
| `07-resiliencia-futuro.mdx`| **SynCon** | `NO ENCONTRADO (Singular)` | SÍ | SÍ | `ALIAS_DE_ENTRADA_EXISTENTE` | Ninguna. | Baja | El singular no aparece en el texto, solo el plural `SynCons` está presente. |
| `07-resiliencia-futuro.mdx`| **SynCons** | `...compensadores síncronos (SynCons):` | SÍ | SÍ (alias) | `FIX_RAW_TERMS` | Añadir `"SynCons"` a `RAW_TERMS` apuntando a `compensadores-sincronos-syncons`. | Alta | Falla al marcarse en el texto porque en `RAW_TERMS` está `"SynCon"` (singular) y la "s" final rompe el límite de palabra en el plugin. |
| `07-resiliencia-futuro.mdx`| **PSS/POD** | `...módulo PSS/POD en inversores GFM...` | SÍ | SÍ | `FIX_RAW_TERMS` | Corregir slug en `glossary.js` o alias para que `"PSS/POD"` (que slugifica a `pss-pod`) apunte a la definición. | Alta | Hay un mismatch de slugs en el glosario (`pss-pod` vs `power-system-stabilizers-y-power-oscillation-damping-pss-pod`). |

---

## 2. Definiciones de Nuevos Términos Técnicos Relevantes

A partir del análisis anterior, se extraen los conceptos que requieren redacción y adición formal en el glosario.

```txt id="fyrv30"
LISTA DEFINITIVA PARA CLAUDE
```

### 1. efecto látigo
* **Término principal**: Efecto látigo (en estabilidad de tensión)
* **Variantes/Alias**: efecto látigo, amplificación periférica
* **Capítulo(s)**: `02-contexto.mdx`
* **Fragmento contextual**: `...se amplifican al propagarse hacia la periferia ibérica (*efecto látigo*), y ante una pérdida masiva de generación, el cuello de botella de la interconexión con Francia...`
* **Por qué merece entrada**: Explica la amplificación espacial de las fluctuaciones de tensión a medida que las perturbaciones eléctricas viajan a través de largas distancias hacia nudos periféricos caracterizados por baja inercia y reducida potencia de cortocircuito (como el sur de la Península Ibérica).
* **Relación con el apagón**: Durante el transitorio del 28-A, las variaciones de reactiva en el nudo de origen (Granada) se propagaron hacia los colectores de media y baja tensión de la periferia, donde el efecto látigo incrementó los picos de sobretensión e indujo los disparos en cadena.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"efecto látigo"`)

### 2. PMODE
* **Término principal**: Modos de operación de enlaces HVDC (PMODE)
* **Variantes/Alias**: PMODE, PMODE1, PMODE2, PMODE3, Modo de control de tensión de enlaces
* **Capítulo(s)**: `03-analisis-incidente.mdx`
* **Fragmento contextual**: `| 12:08:00 | — | HVDC INELFE-1 cambia PMODE3 → PMODE1. Pierde capacidad de respuesta dinámica. |`
* **Por qué merece entrada**: Los enlaces de corriente continua basados en VSC (como el enlace INELFE) disponen de modos de control de reactiva configurables. PMODE3 es el modo automático dinámico de soporte de tensión, mientras que PMODE1 representa un régimen de reactiva constante/fija donde el enlace no reacciona ante perturbaciones rápidas.
* **Relación con el apagón**: A las 12:08 CEST, el enlace INELFE-1 fue fijado manualmente en PMODE1 debido a oscilaciones previas en la red de transporte. Al perderse el PMODE3 dinámico, el enlace no absorbió ni inyectó potencia reactiva durante los segundos críticos del transitorio, privando a la frontera de soporte estabilizador y precipitando la sobretensión.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"PMODE3"`, `"PMODE1"`, `"PMODE"`)

### 3. INELFE
* **Término principal**: INELFE (Interconexión Eléctrica Francia-España)
* **Variantes/Alias**: INELFE, HVDC INELFE-1, enlaces INELFE
* **Capítulo(s)**: `03-analisis-incidente.mdx`, `02-contexto.mdx`, `05-analisis-informes.mdx`
* **Fragmento contextual**: `...La interconexión con Francia combina líneas AC transpirenaicas con el enlace subterráneo HVDC VSC INELFE...`
* **Por qué merece entrada**: Sociedad mixta constituida a partes iguales por REE y RTE para el desarrollo de la interconexión eléctrica de corriente continua (HVDC) entre España y Francia a través de los Pirineos, utilizando tecnología de fuente de tensión (VSC).
* **Relación con el apagón**: Los enlaces de INELFE son el único canal de transmisión asíncrono y controlable de la frontera norte. Sus dinámicas de limitación de corriente y fijación de modos (PMODE1) condicionaron de forma directa el transcurso del incidente transpirenaico.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"INELFE"`, `"HVDC INELFE-1"`)

### 4. Criterio OB3
* **Término principal**: Criterio OB3 (Operación bajo Blackout)
* **Variantes/Alias**: criterio OB3, OB3, estado OB3
* **Capítulo(s)**: `04-reaccion-reposicion.mdx`
* **Fragmento contextual**: `...asumió el control manual bajo estado de Blackout (criterio OB3).`
* **Por qué merece entrada**: Criterio de operación de emergencia que autoriza a los centros de control del operador del sistema a anular los bucles y automatismos dinámicos de control para tomar el control manual directo y por separado de los sistemas de transporte, aislando las redes de distribución.
* **Relación con el apagón**: El criterio OB3 fue activado por REE a las 12:33:30 CEST para evitar que las oscilaciones de red desestabilizaran los pocos nudos de generación remanente y los servicios de restauración locales.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"criterio OB3"`)

### 5. Restauración Top-Down y Bottom-Up
* **Término principal**: Estrategias de reposición (Top-Down y Bottom-Up)
* **Variantes/Alias**: Top-Down, Bottom-Up, restauración de arriba a abajo, restauración de abajo a arriba
* **Capítulo(s)**: `04-reaccion-reposicion.mdx`
* **Fragmento contextual**: `...una estrategia *Top-Down* (soporte externo desde Francia y Marruecos como referencia de tensión) y una estrategia *Bottom-Up* (arranque autónomo de centrales hidroeléctricas internas).`
* **Por qué merece entrada**: Las dos metodologías estándar de re-energización de una red colapsada. La *Top-Down* inyecta tensión desde sistemas fronterizos sanos; la *Bottom-Up* utiliza generadores locales con capacidad de arranque en negro (*Black Start*) para crear pequeñas islas eléctricas que luego se sincronizan.
* **Relación con el apagón**: La restauración de la Península Ibérica combinó ambas estrategias: la frontera norte y sur aportaron soporte *Top-Down*, mientras que Galicia, el centro peninsular y Portugal operaron mediante frentes *Bottom-Up*.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"Top-Down"`, `"Bottom-Up"`)

### 6. PPM (Power Generating Module)
* **Término principal**: Módulo de Generación de Electricidad (PPM)
* **Variantes/Alias**: PPM, Power Generating Module, módulos de generación
* **Capítulo(s)**: `05-analisis-informes.mdx`
* **Fragmento contextual**: `| Umbral | Varía por tipo/país | ≥ 1 MW (PPM y ESM) |`
* **Por qué merece entrada**: Clasificación reglamentaria armonizada establecida por los códigos de red europeos (NC RfG) para referirse a cualquier conjunto de instalaciones conectadas a la red de transporte que producen electricidad activa de forma coordinada (incluyendo IBRs, plantas solares, eólicas y síncronas).
* **Relación con el apagón**: Los requisitos de comportamiento dinámico y cumplimiento normativo exigibles en los expedientes de sanción de la CNMC del 28-A se diferencian según la potencia nominal y la clasificación de la planta como módulo PPM Tipo A, B, C o D.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"PPM"`)

### 7. firm power
* **Término principal**: Potencia firme (Firm Power)
* **Variantes/Alias**: firm power, potencia firme, capacidad garantizada
* **Capítulo(s)**: `06-impacto-comunicativo.mdx`
* **Fragmento contextual**: `...citando la insuficiencia de *firm power* — una argumentación que no se corresponde con el consenso de los informes técnicos...`
* **Por qué merece entrada**: Capacidad de generación garantizada y gestionable disponible en un sistema eléctrico para cubrir la demanda máxima en cualquier condición meteorológica, típicamente aportada por hidráulica de embalse, ciclos combinados y cogeneración.
* **Relación con el apagón**: Fue el argumento discursivo y mediático central utilizado por ciertos sectores de opinión pública para culpar a la transición renovable del apagón (atribuyéndolo a la falta de potencia firme solar y eólica), a pesar de que los informes forenses demostraron que el fallo fue dinámico y de control de reactiva (tensión), no por déficit de capacidad activa.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"firm power"`, `"insuficiencia de firm power"`)

### 8. CAPEX y OPEX
* **Término principal**: Costes de resiliencia del sistema (CAPEX y OPEX)
* **Variantes/Alias**: CAPEX, OPEX, gastos de capital, costes operativos de red
* **Capítulo(s)**: `07b-consecuencias-financieras.mdx`, `impacto-social.mdx`
* **Fragmento contextual**: `...un ingente CAPEX de adaptación... / El coste de las reformas: OPEX recurrente y CAPEX necesario...`
* **Por qué merece entrada**: CAPEX representa el gasto de capital para activos físicos fijos (compra e instalación de compensadores síncronos rotativos y convertidores GFM); OPEX representa el gasto operativo recurrente para mantener la seguridad de la red (sobrecoste de restricciones por el re-despacho forzado de la Operación Reforzada).
* **Relación con el apagón**: El apagón costó más de 1.000 M€ anuales de OPEX por restricciones temporales de seguridad; la adaptación estructural definitiva del sistema requiere una inversión estimada de 3.010 M€ de CAPEX en compensación reactiva rápida e hibridación BESS-GFM.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"CAPEX"`, `"OPEX"`)

### 9. Operación Reforzada
* **Término principal**: Operación Reforzada (REE)
* **Variantes/Alias**: Operación Reforzada, operación reforzada, consigna de despacho mínimo
* **Capítulo(s)**: `07b-consecuencias-financieras.mdx`
* **Fragmento contextual**: `Inmediatamente tras el apagón, REE instauró la Operación Reforzada: una restricción operativa que eleva el despacho mínimo de generación síncrona...`
* **Por qué merece entrada**: Consigna operativa de seguridad y re-despacho forzado de generación convencional síncrona implantada con carácter transitorio por el operador del sistema (REE) tras el apagón para garantizar unos niveles mínimos de inercia y reactiva.
* **Relación con el apagón**: La Operación Reforzada fue el mecanismo directo que incrementó los costes del mercado diario de OMIE y las facturas del PVPC del consumidor final debido a la retribución de restricciones técnicas requeridas para asegurar el sur peninsular ante la escasez de inversores GFM.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"Operación Reforzada"`, `"operación reforzada"`)

### 10. Energía No Suministrada (ENS)
* **Término principal**: Energía No Suministrada (ENS)
* **Variantes/Alias**: ENS, Energía No Suministrada, energía no suministrada
* **Capítulo(s)**: `07b-consecuencias-financieras.mdx`
* **Fragmento contextual**: `...la Energía No Suministrada (ENS) agregada para el sistema ibérico se estima entre...`
* **Por qué merece entrada**: Métrica de fiabilidad del sistema eléctrico que mide la cantidad total de energía de consumo activo que no fue entregada a los consumidores debido a incidentes de desconexión fortuitos o programados, expresada en MWh o GWh.
* **Relación con el apagón**: El 28-A provocó una pérdida estimada de entre 150 y 180 GWh de ENS total agregada entre España y Portugal, siendo la métrica clave para estimar el impacto económico ponderado mediante el VoLL.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"ENS"`, `"Energía No Suministrada"`)

### 11. PVPC (Precio Voluntario para el Pequeño Consumidor)
* **Término principal**: Precio Voluntario para el Pequeño Consumidor (PVPC)
* **Variantes/Alias**: PVPC, tarifa regulada, peaje PVPC
* **Capítulo(s)**: `07b-consecuencias-financieras.mdx`
* **Fragmento contextual**: `...OMIE y repercusión en el PVPC / peaje indexado al Precio Voluntario para el Pequeño Consumidor (PVPC).`
* **Por qué merece entrada**: Tarifa regulada de venta minorista del sector eléctrico español de precio variable por horas indexado de forma directa al mercado de producción mayorista (OMIE) más los peajes y costes de desvíos y restricciones de red.
* **Relación con el apagón**: Los peajes del PVPC sufrieron un recargo directo por el coste de las restricciones técnicas de la Operación Reforzada de REE, trasladando el coste financiero del colapso del transporte a la factura de los hogares españoles.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"PVPC"`)

### 12. ICE (Infraestructura Común de Evacuación)
* **Término principal**: Infraestructura Común de Evacuación (ICE)
* **Variantes/Alias**: ICE, Infraestructura Común de Evacuación, nudo de evacuación común
* **Capítulo(s)**: `07b-consecuencias-financieras.mdx`
* **Fragmento contextual**: `...gestora de la Infraestructura Común de Evacuación (ICE) en la subestación de Huéneja (Granada) — el nudo de origen del fallo...`
* **Por qué merece entrada**: Subestaciones y tramos compartidos de línea que permiten agrupar la salida de múltiples parques generadores (habitualmente eólicos o fotovoltaicos de diferentes promotores) para conectarse de forma conjunta en un único nudo de la red de transporte.
* **Relación con el apagón**: La desconexión inicial de 1.807 MW del 28-A se concentró en la ICE de la subestación de Huéneja. El fallo no fue en las plantas generadoras, sino en los interruptores y coordinaciones de la subestación colectora de evacuación compartida.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"ICE"`, `"Infraestructura Común de Evacuación"`)

### 13. Equivalente de Thévenin
* **Término principal**: Equivalente de Thévenin (en formación de red)
* **Variantes/Alias**: Equivalente de Thévenin, equivalente de Thévenin, Thévenin
* **Capítulo(s)**: `07-resiliencia-futuro.mdx`
* **Fragmento contextual**: `...un inversor *grid-forming* (GFM) opera como un equivalente de Thévenin: sintetiza de forma autónoma una referencia interna de tensión...`
* **Por qué merece entrada**: Teorema de teoría de circuitos eléctricos por el cual cualquier red de fuentes de tensión y resistencias puede simplificarse a una única fuente de tensión ideal en serie con una impedancia. Se usa en ingeniería de control para modelar y diferenciar el comportamiento de los inversores GFM frente a los GFL.
* **Relación con el apagón**: A diferencia de los inversores GFL que inyectan corriente como fuentes controladas y son inestables en redes débiles, los inversores GFM emulan un equivalente de Thévenin con fuente interna y reactancia virtual, permitiéndoles fijar la tensión nodal de forma autónoma.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"Equivalente de Thévenin"`)

### 14. VSC (Voltage Source Converter) (Descubierto)
* **Término principal**: Convertidor de Fuente de Tensión (VSC)
* **Variantes/Alias**: VSC, Voltage Source Converter, convertidor VSC
* **Capítulo(s)**: `02-contexto.mdx`, `03-analisis-incidente.mdx`, `05-analisis-informes.mdx`
* **Fragmento contextual**: `...enlace subterráneo HVDC VSC INELFE...`
* **Por qué merece entrada**: Tecnología de electrónica de potencia para la conversión entre corriente alterna y continua basada en transistores IGBT que regulan dinámicamente y de forma independiente la potencia activa y la inyección/absorción de potencia reactiva.
* **Relación con el apagón**: Los enlaces VSC de la interconexión INELFE cambian dinámicamente sus consignas reactivas. La inhabilitación del soporte rápido debido al cambio de modo (PMODE1) de estos convertidores contribuyó directamente a la cascada de sobretensiones.
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"VSC"`)

### 15. AGC (Automatic Generation Control) (Descubierto)
* **Término principal**: Control Automático de Generación (AGC)
* **Variantes/Alias**: AGC, Automatic Generation Control, regulación secundaria
* **Capítulo(s)**: `03-analisis-incidente.mdx`, `02-contexto.mdx`, `04-reaccion-reposicion.mdx`
* **Fragmento contextual**: `...programado y monitorizado en tiempo real mediante el sistema AGC...`
* **Por qué merece entrada**: Sistema informático centralizado y de lazo cerrado en los despachos de control de los TSOs que envía consignas de generación automáticas cada 2–4 segundos a las centrales asignadas al servicio secundario (aFRR) para corregir desvíos de frecuencia y mantener intercambios.
* **Relación con el apagón**: El AGC actuaba correctamente sobre la frecuencia del sistema peninsular durante el incidente, confirmando que las dinámicas críticas operaron en una escala de tiempo sub-segundo de tensión (donde el AGC es ineficaz).
* **Prioridad**: Alta
* **Añadir a `RAW_TERMS`**: SÍ (`"AGC"`)

---

## 3. Correcciones Técnicas para el Agente de Código

```txt id="bjjul5"
CORRECCIONES TÉCNICAS PARA RAW_TERMS / GLOSARIO
```

Esta sección recopila las correcciones técnicas detalladas que el agente de código deberá aplicar en archivos de configuración y datos para subsanar los problemas detectados en la auditoría sin alterar el contenido narrativo de los MDX.

### A. Términos Existentes que no se Activan (Case / Typography)
1. **`sympathetic inrush` y `magnetizing inrush`**:
   * **Problema**: El plugin realiza una búsqueda case-sensitive usando `indexOf` sobre `"Sympathetic Inrush"` y `"Magnetizing Inrush"`. Sin embargo, el texto de `04-reaccion-reposicion.mdx` los cita estrictamente en minúsculas.
   * **Solución**: Añadir las variantes en minúscula `"sympathetic inrush"` y `"magnetizing inrush"` al listado `RAW_TERMS`.
2. **`Criterio N-1` en `05-analisis-informes.mdx`**:
   * **Problema**: El archivo MDX contiene el término con un signo menos Unicode `−` (`Criterio N−1` con U+2212) en lugar del guion ASCII estándar `-` (U+002D) configurado en `RAW_TERMS`. Adicionalmente, el texto usa la sigla shorthand `"N-1"`.
   * **Solución**:
     1. Reemplazar `−` por `-` en el texto del archivo MDX.
     2. Añadir el shorthand `"N-1"` a la lista `RAW_TERMS`.

### B. Nuevos Alias / Shorthands a Incorporar en `RAW_TERMS`
Para que las referencias cortas o traducciones en el texto desplieguen la tarjeta correspondiente del glosario:
1. **`ANSI 59`**: Mapear a la entrada `ANSI 59 (Protección de Sobretensión)` (slug: `ansi-59-proteccion-de-sobretension`).
2. **`BESS-GFM`**: Mapear a `BESS con inversores Grid-Forming (BESS-GFM)` (slug: `bess-con-inversores-grid-forming-bess-gfm`).
3. **`SynCons` y `SynCon`**: Mapear a `Compensadores Síncronos (SynCons)` (slug: `compensadores-sincronos-syncons`). Dado que el texto contiene el plural `"SynCons"`, el plugin con límite de palabra no lo detecta con la regla de `"SynCon"`. Debe añadirse el plural literal `"SynCons"` a `RAW_TERMS`.
4. **`Value of Lost Load`**: Mapear a `VoLL (Value of Lost Load)` (slug: `voll-value-of-lost-load`).
5. **`Valor de la Energía No Suministrada`**: Mapear a `VoLL (Value of Lost Load)` (slug: `voll-value-of-lost-load`).
6. **`protecciones Out-of-Step`**: Mapear a `Protecciones de pérdida de sincronismo (OST)` (slug: `protecciones-de-perdida-de-sincronismo-ost`).
7. **`insuficiencia de firm power`**: Mapear a `Firm power` (slug: `firm-power`).

### C. Mismatches Críticos de Slugs (Broken Links)
El plugin AST asocia cada término `T` de `RAW_TERMS` a un enlace `#slugify(T)`. Si el slugify de la abreviatura no coincide exactamente con el ID definido en `glossary.js` (que a menudo contiene el término completo), el enlace resultante en el MDX queda roto y no despliega tarjeta.

Se deben crear entradas de redirección o alias en `glossary.js` con el ID corto para resolver los siguientes mismatches:

| Término en `RAW_TERMS` | Slug generado por el plugin | ID real en `glossary.js` | Estado de tarjeta | Solución |
|---|---|---|---|---|
| `"aFRR"` | `afrr` | `afrr-automatic-frequency-restoration-reserve` | **Roto** | Añadir alias/objeto con `id: "afrr"` en `glossary.js` que enlace a la definición. |
| `"BESS"` | `bess` | `bess-battery-energy-storage-system` | **Roto** | Añadir alias con `id: "bess"` en `glossary.js`. |
| `"ERS"` | `ers` | `servicios-esenciales-de-confiabilidad-ers` | **Roto** | Añadir alias con `id: "ers"` en `glossary.js`. |
| `"GFL"` | `gfl` | `gfl-grid-following` | **Roto** | Añadir alias con `id: "gfl"` en `glossary.js`. |
| `"GFM"` | `gfm` | `gfm-grid-forming` | **Roto** | Añadir alias con `id: "gfm"` en `glossary.js`. |
| `"MRSCR"` | `mrscr` | `mrscr-multiple-renewable-short-circuit-ratio` | **Roto** | Añadir alias con `id: "mrscr"` en `glossary.js`. |
| `"OLTC"` | `oltc` | `cambiadores-de-tomas-en-carga-oltc` | **Roto** | Añadir alias con `id: "oltc"` en `glossary.js`. |
| `"PMU"` | `pmu` | `pmu-phasor-measurement-unit` | **Roto** | Añadir alias con `id: "pmu"` en `glossary.js`. |
| `"RCC"` | `rcc` | `centros-de-coordinacion-regional-rcc` | **Roto** | Añadir alias con `id: "rcc"` en `glossary.js`. |
| `"RoCoF"` | `rocof` | `rocof-rate-of-change-of-frequency` | **Roto** | Añadir alias con `id: "rocof"` en `glossary.js`. |
| `"SCR"` | `scr` | `scr-short-circuit-ratio` | **Roto** | Añadir alias con `id: "scr"` en `glossary.js`. |
| `"TSO"` | `tso` | `tso-transmission-system-operator` | **Roto** | Añadir alias con `id: "tso"` en `glossary.js`. |
| `"UFLS"` | `ufls` | `ufls-underfrequency-load-shedding` | **Roto** | Añadir alias con `id: "ufls"` en `glossary.js`. |
| `"SCADA"` | `scada` | `scada-supervisory-control-and-data-acquisition` | **Roto** | Añadir alias con `id: "scada"` en `glossary.js`. |
| `"PSS/POD"` | `pss-pod` | `power-system-stabilizers-y-power-oscillation-damping-pss-pod` | **Roto** | Añadir alias con `id: "pss-pod"` en `glossary.js`. |

### D. Erratas en MDX a Resolver
1. **`ONNE` vs `ONEE` en `04-reaccion-reposicion.mdx`**:
   * El listado de candidatos del usuario apunta a `ONNE` (inexistente). El texto del capítulo cita a `ONEE` (Office National de l'Electricité et de l'Eau Potable) de Marruecos. No se requieren cambios en el MDX ya que la sigla es correcta en el archivo de texto.
2. **`BEES` vs `BESS` en `07b-consecuencias-financieras.mdx`**:
   * El listado semilla incluye `BEES`. La revisión del texto MDX muestra que se cita correctamente `BESS` en todas las instancias. No se requieren cambios en el MDX.
