# PROMPT PARA CLAUDE CODE — MEJORA DE CONTENIDO (TODOS LOS CAPÍTULOS)

## CONTEXTO
Estás trabajando sobre un TFG de Ingeniería de la Energía publicado como sitio Docusaurus. El sitio analiza el apagón eléctrico ibérico del 28-A-2025. Los capítulos MDX están en `docs/`. Tu tarea es aplicar mejoras de contenido específicas a cada capítulo, sin alterar la estructura general ni los componentes React existentes.

## REGLAS
1. Lee CADA archivo completo antes de editarlo.
2. NO cambies imports ni componentes React a menos que se indique explícitamente.
3. NO alteres tablas ForensicTable existentes (solo añade nuevas donde se indica).
4. Preserva TODOS los `<span id="tX">` — son anclas de navegación.
5. Preserva TODOS los `<CuestionAbierta>` — son marcadores de datos no verificados.
6. Haz `npm run build -- --locale es` después de cada archivo para verificar.
7. Cada commit: `content(capX): descripción breve`.

---

## CAPÍTULO 1: `docs/01-introduccion.mdx`

### 1.1 Añadir enlace al Glosario Técnico
Al final del capítulo, antes del cierre, añadir:
```
:::tip Glosario Técnico
Los términos técnicos empleados en este trabajo (IBR, SCR, GFM, UFLS, ANSI 59, etc.) se definen con rigor normativo IEEE/ENTSO-E/CIGRE en el [**Glosario Técnico**](/docs/glosario).
:::
```

### 1.2 Aclarar "tres narrativas" vs "cuatro informes"
En la línea donde dice "tres visiones institucionales predominantes:" (~L18), añadir después del párrafo:
```
*(Nota: el análisis opera sobre cuatro informes primarios —Gobierno, REE, IIT-ICAI/AELEC y ENTSO-E— agrupados en tres visiones, dado que los informes del Gobierno y de REE comparten premisas causales fundamentales.)*
```

---

## CAPÍTULO 2: `docs/02-contexto.mdx`

### 2.1 CT2: Nota aclaratoria H=2,3s global vs zonal
Buscar la frase: `el sistema tenía $H = 2,3$ s — por encima del umbral ENTSO-E`
Reemplazar por:
```
el sistema tenía $H = 2,3$ s como promedio ponderado peninsular — por encima del umbral ENTSO-E de 2,0 s. Sin embargo, los valores zonales eran significativamente inferiores: 1,3 s en el sur y 1,84 s en el centro, ambos por debajo del umbral. El colapso se originó en la zona más débil, no en el promedio
```

### 2.2 CT7: Embeber SwingEquationSimulator
Buscar la línea del enlace al simulador de ecuación de oscilación (contiene `galeria-graficas.mdx#swing`).
ANTES de esa línea, añadir:
```mdx
import SwingEquationSimulator from "@site/src/components/SwingEquationSimulator";
```
(NOTA: Añadir este import al bloque de imports del inicio del archivo, junto a los otros imports)

Reemplazar el enlace `([*ver Simulador de Ecuación de Oscilación*](./galeria-graficas.mdx#swing))` por el componente embebido:
```mdx
<SwingEquationSimulator />

_Figura X. Simulador interactivo de la Ecuación de Oscilación. Modifique los parámetros de inercia y observe el impacto sobre la RoCoF del sistema. Elaboración propia._
```
Mantener el enlace original como alternativa: `(también disponible en la [Galería de Gráficas Interactivas](./galeria-graficas.mdx#swing))`

### 2.3 Enlace a precedentes internacionales
Al final de la sección "Evolución del parque generador" (~L29), añadir un párrafo de transición:
```
Esta configuración de baja inercia con alta penetración IBR no es exclusiva de Iberia: los colapsos de South Australia (2016) y Reino Unido (2019) evidenciaron vulnerabilidades análogas cuyas lecciones regulatorias se examinan en el [Capítulo 7](./07-resiliencia-futuro.mdx).
```

---

## CAPÍTULO 3: `docs/03-analisis-incidente.mdx`

### 3.1 CT1: Corregir "15.000 MW (casi el 60%)"
Buscar: `15.000 MW</CuestionAbierta> de generación (casi el 60% de la capacidad instantánea ibérica previa)`
Reemplazar por: `15.000 MW</CuestionAbierta> de generación (más del 50% de la capacidad instantánea ibérica previa)`

### 3.2 CT4: Unificar reactiva importada
En el texto narrativo que mencione "4.500 MVAr" (no dentro de CuestionAbierta), usar la formulación "más de 4.500 MVAr". Mantener "4.609 MVAr" solo dentro de los tags `<CuestionAbierta>`.

### 3.3 CT8: Embeber UFLSVisualizer
Buscar el párrafo que termina con el enlace `([*simular Retrato de Fases del UFLS*](./galeria-graficas.mdx#phaseplane))` (~L126).
DESPUÉS de ese párrafo, añadir:
```mdx
import UFLSVisualizer from "@site/src/components/UFLSVisualizer";
```
(NOTA: Añadir este import al bloque de imports del inicio del archivo)

Y después del párrafo de la paradoja del UFLS:
```mdx
<UFLSVisualizer />

_Figura X. Retrato de fases del UFLS: evolución acoplada de frecuencia-tensión durante el deslastre. La trayectoria evidencia la paradoja: el deslastre por subfrecuencia agrava la sobretensión. Elaboración propia._
```

---

## CAPÍTULO 4: `docs/04-reaccion-reposicion.mdx`

### 4.1 CT3: Unificar duración de reposición
Buscar: `casi **19 horas** de maniobras`
Reemplazar por: `aproximadamente **18,5 horas** de maniobras (hasta las 07:05 del 29-A, cuando se certificó la restitución del 99,95% del suministro)`

### 4.2 Ampliar Tabla 14 con hitos horarios
Después de la ForensicTable actual (Tabla 14), añadir una NUEVA ForensicTable con los hitos de la reposición:

```mdx
<ForensicTable 
  title="TABLA 14b | RESTORATION MILESTONES"
  source="Comité de Análisis del Gobierno / REE / ENTSO-E"
  confidence="HIGH"
>

| Hora (CEST) | Evento |
| :--- | :--- |
| 12:33:30 | Cero de tensión confirmado. REE activa P.O. 1.6 |
| 12:34 | Confirmación con REN: Portugal sin tensión |
| 12:36 | Notificación EAS: estado "Restauración" |
| 12:44 | Suspensión de mercados. Subestación de Hernani recibe tensión de Francia |
| 12:45 | Black Start: Castelo de Bode (Portugal, 138 MW hidro) |
| 13:04 | Interconexión Marruecos habilitada: ~900 MW de soporte |
| 13:07 | Primeros 31 MW alimentados desde Irún |
| ~16:00 | Black Start: Aldeadávila (España, ~1.100 MW hidro) |
| 20:22 | Sincronización islas portuguesas con frecuencia continental |
| 23:32 | 13.039 MW cubiertos (55% demanda) con 21 grupos térmicos |
| 00:06 (29-A) | REE reactiva controlador aFRR (regulación secundaria) |
| 01:38 (29-A) | Primeras consignas para reintegrar eólica y cogeneración |
| 07:05 (29-A) | 99,95% del suministro restituido |

</ForensicTable>
```

### 4.3 Añadir detalle sobre Black Start fallidos
Después de la línea que dice "Los fallos fueron significativos" (~L91), expandir con:
```
Los transitorios de energización de líneas en vacío generaron corrientes de inserción magnetizante (*magnetizing inrush*) de hasta 10 veces la corriente nominal en los autotransformadores de 400 kV, provocando caídas de tensión del 10-20% en las frágiles islas recién formadas. Más problemático aún fue el fenómeno de *sympathetic inrush*: la energización de un transformador nuevo saturó el flujo magnético de los transformadores paralelos ya operativos, generando distorsiones armónicas severas con tiempos de decaimiento superiores a 10 segundos que hicieron colapsar varias islas antes de que pudieran estabilizarse. En al menos tres ocasiones documentadas, los relés diferenciales de transformador interpretaron estos transitorios como cortocircuitos internos y ordenaron la apertura, obligando a reiniciar el proceso de isla desde cero.
```

### 4.4 Añadir ForensicReveal sobre Black Start
Después del nuevo texto anterior, añadir:
```mdx
<ForensicReveal
  lang="es"
  l1="Encender la red es más difícil que apagarla: cada transformador que conectas puede hacer caer a los que ya están funcionando."
  l2="El 'Black Start' requiere arrancar generadores sin red externa. Al energizar transformadores de 400 kV en una red vacía, se generan corrientes transitorias enormes (inrush) que pueden desestabilizar las frágiles islas eléctricas recién creadas. El fenómeno de sympathetic inrush agrava el problema: un transformador nuevo puede saturar a los ya conectados."
  l3="Corrientes de inserción de hasta 10× la nominal con contenido armónico de 8-20% de segundo armónico (IEEE C57.91). El sympathetic inrush tiene tiempos de decaimiento >10 s (CIGRE WG A2). En el 28-A, las islas de Cantabria y Levante colapsaron por este mecanismo y debieron reiniciarse. (ENTSO-E Factual / REE)"
  source="IEEE C57.91 / CIGRE WG A2 / ENTSO-E Factual Report"
/>
```
(NOTA: Verificar que ForensicReveal está importado. Si no, añadir: `import ForensicReveal from "@site/src/components/ForensicReveal";`)

---

## CAPÍTULO 7: `docs/07-resiliencia-futuro.mdx`

### 7.1 R1: Insertar sección de precedentes internacionales
ANTES de la sección "## Tecnologías habilitadoras libres de emisiones" (~L84), insertar la nueva sección:

```mdx
## Precedentes internacionales: lecciones regulatorias de cinco apagones

La revisión de los cinco apagones de gran escala que precedieron cronológicamente al 28-A revela un patrón recurrente: los mecanismos físicos del colapso ibérico —OLTC sin bloqueo jerárquico, inversores sin control dinámico, ausencia de inercia mínima obligatoria— estaban documentados y parcialmente resueltos en otras jurisdicciones antes de abril de 2025.

<ForensicTable 
  title="TABLA XX | INTERNATIONAL BLACKOUT REGULATORY RESPONSE TIMELINE"
  source="Elaboración propia (fuentes: UCTE, NERC/FERC, ENTSO-E, AEMO, NGESO)"
>

| Evento | Causa raíz dominante | Medida regulatoria adoptada | Plazo de implementación | Efectividad verificada |
| :--- | :--- | :--- | :--- | :--- |
| **Italia 2003** | Cascada térmica + colapso Q-V amplificado por OLTCs | UCTE Operation Handbook: bloqueo OLTC obligatorio en emergencia | 21 meses | Alta: evitó recurrencia en separación 2021 |
| **US/Canadá 2003** | Pérdida de situational awareness (fallo de alarmas) + violación N-1 | EPAct 2005: NERC como ERO con estándares obligatorios y penalizables | 4 años | Total: sin blackout continental comparable desde 2007 |
| **Europa 2006** | Descoordinación transfronteriza: desconexión manual sin reanálisis N-1 | EAS + creación ENTSO-E + Network Codes vinculantes | 3-11 años | Alta: EAS permitió contención coordinada en separación enero 2021 |
| **S. Australia 2016** | LVRT deficiente en inversores eólicos + baja inercia | System Strength obligatorio + FFR + firmware de inversores actualizado | 1-2 años | Alta: opera rutinariamente >70% renovable sin incidentes |
| **UK 2019** | Vector Shift + RoCoF excesivo: cascada de DER por relés anti-isla | ALoMCP: prohibición de Vector Shift + RoCoF a 1 Hz/s | 3 años | Alta: sin cascada de generación distribuida posterior |

</ForensicTable>

La lección transversal es doble. Primera: las medidas regulatorias post-incidente, una vez implementadas, demuestran una efectividad uniformemente alta. Segunda: la implementación tarda entre 1 y 11 años, durante los cuales el sistema permanece expuesto a la vulnerabilidad ya documentada. El 28-A ibérico se inscribe en este patrón: reproduce mecanismos causales ya conocidos — en particular, el rol destructivo de los OLTCs (Italia 2003) y la fragilidad de los inversores sin control dinámico (S. Australia 2016, UK 2019) — cuya integración en el marco regulatorio peninsular estaba pendiente.

Las soluciones tecnológicas que se examinan a continuación constituyen la traducción industrial de estas lecciones.
```

---

## CAPÍTULO 7b: `docs/07b-consecuencias-financieras.mdx`

### 7b.1 CT5: Moderar registro grandilocuente
Aplicar las siguientes sustituciones en TODO el archivo:

| Texto original | Texto corregido |
|---|---|
| demuestra axiomáticamente que | demuestra que |
| masiva destrucción de valor | destrucción de valor |
| guillotina operativa | desconexión abrupta |
| electroshock | aceleración sin precedentes |
| agujero negro financiero | coste recurrente sin retorno patrimonial |
| hemorragia en la balanza de pagos | sobrecostes persistentes |
| escudo fiscal estratégico | inversión en infraestructura crítica |
| El balance contable agregado de la catástrofe eléctrica es inapelable | El balance económico agregado confirma |
| asfixia de caja del sector electrointensivo | impacto financiero en el sector electrointensivo |
| aniquilando la capacidad | comprometiendo la capacidad |
| guerra judicial derivada | litigiosidad derivada |
| audaz estrategia legal | estrategia legal |

Adicionalmente, revisar TODO el capítulo para eliminar adjetivación excesiva que no aporte información técnica. El tono objetivo debe ser: datos contundentes, prosa neutra.

### 7b.2 Verificar cifra "31 GW de carga" (L13)
Si el dato correcto es 25,2 GW de demanda española (como en cap. 3), cambiar a: "Con una pérdida instantánea de más de **25 GW** de demanda peninsular". Si 31 GW incluye Portugal, aclarar: "(España: 25,2 GW + Portugal: ~5,8 GW)".

### 7b.3 Unificar "50 millones de ciudadanos" con cap. 1 ("57 millones")
Cambiar a "más de **55 millones de ciudadanos**" o usar la misma cifra que cap. 1.

---

## CAPÍTULO 8: `docs/08-uso-ia.mdx`

### NO TOCAR
Este capítulo es excelente. No requiere modificaciones.

---

## CAPÍTULO 8.5: `docs/08_5-actualizacion-2026.mdx`

### 8.5.1 CT10: Eliminar redundancias
Los siguientes contenidos ya están cubiertos en capítulos anteriores. Reemplazarlos por referencias cruzadas:

1. La explicación del HVDC PMODE1 (§2, L33-36): reemplazar por:
```
El papel crítico del cambio de modo del HVDC INELFE-1 a PMODE1 y sus consecuencias sobre la capacidad de soporte dinámico se analizan en detalle en los Capítulos [2](./02-contexto.mdx) y [3](./03-analisis-incidente.mdx).
```

2. La explicación del Grid-Forming (§4, L48-52): reemplazar por:
```
Las especificaciones técnicas del NC RfG 2.0 y su mandato de Grid-Forming obligatorio se detallan en el [Capítulo 7](./07-resiliencia-futuro.mdx). Lo relevante para la actualización de 2026 es el estado de implementación:
```

### 8.5.2 R2: Añadir datos regulatorios verificados
Después del §3 "Consecuencias Institucionales", añadir una nueva sección:

```mdx
## Estado procesal y regulatorio (mayo 2026)

<ForensicTable 
  title="TABLA XX | CNMC SANCTIONING PROCEEDINGS (MAY 2026)"
  source="CNMC / BOE"
  confidence="HIGH"
>

| Entidad | Nº expedientes | Tipificación según LSE |
| :--- | :--- | :--- |
| Red Eléctrica de España (OS) | 1 | Muy grave (art. 64.25) — hasta 60 M€ |
| Iberdrola (incl. Almaraz/Cofrentes) | 24 | Graves + Muy graves (nucleares) |
| Endesa | 19 | Graves (control de tensión en CCGT) |
| Naturgy | 11 | Graves (ciclos combinados) |
| Otros (Repsol, TotalEnergies, EDP, Engie, Mercuria) | ~10 | Graves (varios) |
| Sist. Eléctrico de Conexión Huéneja (Granada) | 1 | Grave (punto cero del colapso) |

</ForensicTable>

### Calendario de implementación del P.O. 7.4

<ForensicTable 
  title="TABLA XX | P.O. 7.4 IMPLEMENTATION TIMELINE"
  source="CNMC / BOE-A-2025-13076 / BOE-A-2026-1377"
  confidence="HIGH"
>

| Hito | Fecha | Estado |
| :--- | :--- | :--- |
| Aprobación resolución CNMC | 12/06/2025 | ✅ Completado |
| Publicación BOE | 26/06/2025 | ✅ Completado |
| Expiración medidas transitorias | 19/01/2026 | ✅ Completado |
| Formato telemetría I90DIA_CSV obligatorio | 09/06/2026 | ⏳ Pendiente |
| Tolerancia εQ (Anexo II P.O. 7.4): 5% Qmax, mín 0,25 MVAr, máx 5 MVAr | 16/06/2026 | ⏳ Pendiente |
| Operación normalizada completa | Q3-Q4 2026 | 📋 Estimado |

</ForensicTable>

### Litigio Iberdrola vs Redeia
El 21 de abril de 2026, el Juzgado de lo Mercantil nº 15 de Madrid (magistrado Teodoro Ladrón) rechazó la declinatoria de jurisdicción interpuesta por REE y Redeia, confirmando la competencia de la jurisdicción civil para conocer la demanda de Iberdrola por competencia desleal. El auto delimita que el procedimiento no juzgará las causas técnicas del apagón — competencia exclusiva de la CNMC — sino las conductas corporativas y declaraciones públicas de la dirección de Redeia que, según Iberdrola, dañaron su reputación y valor bursátil.
```

---

## VERIFICACIÓN FINAL

Después de aplicar TODOS los cambios:
1. `npm run build -- --locale es` → debe completar sin errores.
2. Verificar visualmente que las nuevas ForensicTable se renderizan correctamente.
3. Verificar que los nuevos imports no duplican imports existentes.
4. Commit final: `content: mejoras de contenido caps 1-8.5 (CT1-CT10, R1, R2)`
