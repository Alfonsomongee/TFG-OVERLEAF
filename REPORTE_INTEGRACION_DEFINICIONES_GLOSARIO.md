# Reporte de Integración de Definiciones y Glosario Técnico

Este reporte documenta el proceso de expansión, división y validación del glosario técnico y el sistema de activación de tarjetas didácticas para la documentación interactiva del Apagón Ibérico del 28-A.

---

## 1. Entradas Añadidas a `glossary.js`

Se han incorporado 19 entradas en total al glosario en [glossary.js](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/data/glossary.js), respetando el formato `{ id, letter, term, definition }` y sin incluir campos adicionales. 

Las entradas añadidas son:
* **AGC (Automatic Generation Control)**: Sistema de regulación secundaria (aFRR) a nivel de TSO.
* **Bottom-Up (Reposición)**: Paradigma descentralizado de restauración mediante islas Black Start.
* **CAPEX (Capital Expenditure)**: Gasto de capital en activos de larga duración (como SynCons, BESS-GFM).
* **Criterio OB3**: Estado de máxima severidad de operación bajo blackout en centros de control de REE/REN.
* **Efecto látigo (eléctrico)**: Analogía de amplificación de perturbaciones hacia nodos periféricos.
* **ENS (Energía No Suministrada)**: Métrica de fiabilidad física e impacto económico (MWh).
* **Equivalente de Thévenin**: Modelo simplificado de circuito activo lineal que determina la rigidez de red en un nudo.
* **Firm power (Potencia firme)**: Capacidad despachable/garantizada del mix de generación.
* **ICE (Infraestructura Común de Evacuación)**: Subestaciones colectoras y líneas compartidas para evacuación renovable.
* **INELFE**: Enlace HVDC y sociedad de interconexión transpirenaica España-Francia.
* **OPEX (Operational Expenditure)**: Costes operativos del sistema de potencia (restricciones, combustibles, etc.).
* **Operación Reforzada**: Régimen operativo extraordinario con restricciones adicionales post-colapso.
* **PMODE**: Modos operativos de control para enlaces VSC-HVDC.
* **PMODE1**: Alias de PMODE ("Véase PMODE.").
* **PMODE3**: Alias de PMODE ("Véase PMODE.").
* **PPM (Power Park Module)**: Clasificación de generación no síncrona en el código de red NC RfG.
* **PVPC (Precio Voluntario para el Pequeño Consumidor)**: Estructura regulada en España que traslada los costes OPEX al usuario.
* **Top-Down (Reposición)**: Paradigma de reposición centralizada desde redes troncales e interconexiones.
* **VSC (Voltage Source Converter)**: Tecnología de convertidor electrónico basada en IGBTs autoconmutados.

---

## 2. Entradas Descartadas o Pendientes

No se ha descartado ninguna entrada de la lista solicitada. Todas han sido completamente mapeadas y validadas.

---

## 3. Términos Divididos respecto a la propuesta de Claude

Para asegurar el correcto funcionamiento de las tarjetas interactivas de hover y evitar redundancias o errores de interfaz, se realizaron las siguientes divisiones de entradas compuestas propuestas por Claude:
1. **PMODE**: Se dividió en la entrada principal `PMODE` y dos alias independientes (`PMODE1` y `PMODE3`) que referencian al original mediante la cláusula estándar *"Véase PMODE."*.
2. **Top-Down y Bottom-Up**: Se separaron en `Top-Down (Reposición)` y `Bottom-Up (Reposición)` para que se activen de forma individual en el texto según el término exacto usado en el capítulo.
3. **CAPEX y OPEX**: Se separaron en `CAPEX (Capital Expenditure)` y `OPEX (Operational Expenditure)` por la misma razón de independencia terminológica y de tarjetas.

---

## 4. Aliases Añadidos a `RAW_TERMS`

Se agregaron los siguientes activadores del glosario a la matriz `RAW_TERMS` en [remark-auto-glossary-links.js](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/plugins/remark-auto-glossary-links.js), asegurando que tanto mayúsculas/minúsculas como formas abreviadas o completas sean identificadas por el pipeline de compilación de MDX:
* `Efecto látigo` / `efecto látigo` / `Efecto látigo (eléctrico)`
* `PMODE` / `PMODE1` / `PMODE3`
* `INELFE`
* `Criterio OB3` / `criterio OB3`
* `Top-Down` / `Top-Down (Reposición)`
* `Bottom-Up` / `Bottom-Up (Reposición)`
* `PPM` / `PPM (Power Park Module)`
* `Firm power` / `firm power`
* `CAPEX` / `CAPEX (Capital Expenditure)`
* `OPEX` / `OPEX (Operational Expenditure)`
* `Operación Reforzada` / `operación reforzada`
* `ENS` / `Energía No Suministrada` / `ENS (Energía No Suministrada)`
* `PVPC` / `PVPC (Precio Voluntario para el Pequeño Consumidor)`
* `ICE` / `Infraestructura Común de Evacuación` / `ICE (Infraestructura Común de Evacuación)`
* `Equivalente de Thévenin` / `equivalente de Thévenin`
* `VSC` / `VSC (Voltage Source Converter)`
* `AGC` / `AGC (Automatic Generation Control)`

---

## 5. Casos Especiales y Verificaciones Factuales

* **Efecto látigo (eléctrico)**: Se descartó la expresión incorrecta *"menor impedancia de cortocircuito"* y se reajustó la descripción física para expresar la propagación hacia nudos con *"mayor impedancia equivalente, menor potencia de cortocircuito y menor SCR"*. Además, se incluyó una advertencia clara indicando que no es un término formal normalizado IEEE/IEC/ENTSO-E sino una analogía operativa o metáfora técnica.
* **PMODE, PMODE1 y PMODE3**: Se comprobó su uso en el capítulo [03-analisis-incidente.mdx](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/docs/03-analisis-incidente.mdx). La definición añadida es consistente con la transición histórica real a las 12:08 CEST (PMODE3 → PMODE1) de la interconexión INELFE-1.
* **Criterio OB3**: Se verificó su aparición en el texto real ([04-reaccion-reposicion.mdx](file:///c:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/docs/04-reaccion-reposicion.mdx)) relacionado con la declaración de estado de Blackout por el TSO. Se incorporó una nota de cautela para aclarar que puede tratarse de una nomenclatura operativa interna del TSO (procedimientos de REE/REN) y no de un estándar global del sector.
* **ICE (Infraestructura Común de Evacuación)**: La definición desambigua explícitamente el término en el sector eléctrico nacional para diferenciarlo de otros conceptos (como motores de combustión interna, "Internal Combustion Engine").

---

## 6. Resultados de las Pruebas de Validación

### Git Diff Check
El comando `git diff --check` finalizó **con éxito**. No se encontraron espacios en blanco al final de línea o conflictos.

### Auditoría del Glosario
El script `check-glossary-coloring.js` se ejecutó con `npm run check:glossary-color` y arrojó un resultado satisfactorio:
* **Verde esperado**: `#636e4f` (coincide con la variable CSS `--glossary-term-light`)
* **Términos cargados**: 117
* **MDX revisados**: 38
* **Resultado**: `OK: el verde del glosario coincide y la lógica limita el coloreado a una vez por término y capítulo.`

### Docusaurus Build
El comando `npm run build` compiló el sitio estático para los cuatro idiomas configurados (`es`, `en`, `de`, `zh-Hans`) de manera satisfactoria. La pipeline de Remark inyectó los enlaces y las tarjetas correspondientes sin reportar ningún error de sintaxis en MDX o JS.
