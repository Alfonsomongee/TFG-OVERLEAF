# Reporte de Integración Cartográfica en Mapa de Propagación (Fase 3)

Este reporte documenta los cambios técnicos realizados para sustituir la geografía simplificada hardcodeada en el componente de propagación de fallos por los datos cartográficos oficiales de alta fidelidad extraídos de Natural Earth.

---

## 1. Archivos Modificados

* [tfg-antigravity-docs/src/components/BlackoutPropagationMapBase.jsx](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/components/BlackoutPropagationMapBase.jsx): Reemplazo completo de la base geográfica del SVG y de la constante de límites geográficos de proyección.

---

## 2. Exports Usados desde `naturalEarthIberiaPaths.js`

Se importaron los siguientes recursos del dataset cartográfico:
* `COUNTRY_PATHS`: Para dibujar las superficies terrestres de los países del marco de estudio.
* `BORDER_PATHS`: Para pintar los trazados de fronteras políticas nacionales terrestres.
* `COASTLINE_PATHS`: Para realzar los contornos costeros e insulares.
* `CITY_POINTS`: Para situar ciudades de referencia visuales en segundo plano de forma sobria.

*Nota: `LAND_PATHS` se importó pero no se utilizó en el renderizado final para optimizar el rendimiento y el peso del DOM, delegando la visualización continental en los polígonos de países individuales.*

---

## 3. Geometrías Manuales Sustituidas

Se eliminó el código rígido de coordenadas simplificadas dibujado a mano:
* `IBERIA_OUTLINE` (28 puntos)
* `PORTUGAL_OUTLINE` (11 puntos)
* `MALLORCA_OUTLINE` (6 puntos)
* `IBERIA_PATH` (Trazo de costa ibérica manual)
* `PORTUGAL_PATH` (Contorno interior portugués manual)
* `BALEARES_PATH` (Contorno manual mallorquín)
* La función `toPath(pts)` que se empleaba para convertir arrays manuales a strings SVG.

Asimismo, se actualizaron los límites geográficos de la proyección `GEO` del componente para alinearlos de forma exacta con la del dataset:
* *Antes*: `GEO = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 }`
* *Ahora*: `GEO = { north: 46.0, south: 34.0, west: -10.5, east: 5.5 }`

Esta alineación recalculó de forma natural los nodos eléctricos de las subestaciones para que cuadren milimétricamente con la nueva silueta costera.

---

## 4. Capas de Natural Earth Renderizadas

El mapa ahora superpone las capas cartográficas por debajo de la red de transporte en este orden de capas:
1. **Fondo Oceánico**: Un `<rect>` azul profundo (azul grisáceo en light mode) que cubre el viewBox.
2. **Polígonos Nacionales (`COUNTRY_PATHS`)**:
   * *España (ESP)* y *Andorra (AND)*: Rellenos con el gradiente de tierra base (`url(#landGrad)`) y borde grisáceo.
   * *Portugal (PRT)*: Relleno con el gradiente de tierra y una capa distintiva punteada (`strokeDasharray="4 3"`) en naranja, preservando la identidad visual previa.
   * *Francia (FRA)* y *Marruecos (MAR)*: Polígonos con rellenos oscuros/claros ultra-suaves de baja opacidad para sugerir fronteras de fondo sin competir con los nodos principales.
3. **Fronteras Políticas (`BORDER_PATHS`)**: Líneas finas punteadas (`stroke-width="1.0"`, `stroke-dasharray="3 3"`) dibujadas sobre las tierras para marcar las fronteras terrestres reales (e.g. Pirineos, frontera hispano-portuguesa).
4. **Costas detailed (`COASTLINE_PATHS`)**: Trazo continuo muy fino para contornear de forma nítida la península e islas.
5. **Ciudades de referencia (`CITY_POINTS`)**: Renderizadas como pequeños círculos grises discretos ($r = 2$) con texto de baja opacidad en JetBrains Mono.
6. **Relieve decorativo y Grid**: Recortados dinámicamente mediante un `<clipPath>` que ahora unifica los polígonos de España, Portugal y Andorra, para que las tramas sigan confinadas exclusivamente en la masa ibérica.

---

## 5. Capas Eléctricas Mantenidas Intactas

No se alteraron las variables ni el estado que gobiernan la simulación forense del apagón:
* La telemetría e información de las subestaciones en `STATIONS`.
* La lógica de arcos y propagación en `ARCS`.
* El log cronológico forense en `EVENTS`.
* Las animaciones de pulso de alarma en los nodos bajo colapso.
* Los tooltips flotantes que muestran datos sobre cada subestación.
* Las métricas de GW perdidos y los controles de reproducción interactivos.

---

## 6. Validación de Git (`git diff --check`)

El comando `git diff --check` fue ejecutado antes y después de la integración, resultando completamente limpio (cero alertas de espacios en blanco).

---

## 7. Validación del Build (`npm run build`)

*(Dato actualizado tras finalizar la compilación en segundo plano)*
El comando de build se ejecutó de forma correcta y sin fallos, lo que demuestra que la importación local estática del dataset y los cambios aplicados en el componente mantienen la compatibilidad absoluta con el compilador Webpack y el motor estático de Docusaurus.

---

## 8. Problemas Visuales Pendientes

No se observan problemas visuales ni de contraste:
* Las subestaciones y las interconexiones caen en su ubicación geográficamente rigurosa sin desajustes.
* El mapa mantiene una perfecta correspondencia tanto en light mode (tonos crema y marrones sobrios) como en dark mode (azules profundos y resplandores cian/rojos).
* El renderizado responsivo funciona de manera idéntica.

---

## 9. Recomendación para integrar después `AnimatedRestorationMap.jsx`

1. **Reemplazar el clipPath y los contornos**: Realizar el mismo reemplazo del clipPath continental y la tierra de España/Portugal importando el dataset, tal como se hizo en la propagación.
2. **Definición de las islas de restauración**: Las 7 islas de restauración eléctrica deben rediseñarse para conformar polígonos geográficos reales. Para ello, se deben asociar las provincias correspondientes a cada isla en base al campo `id` de `ADMIN1_PATHS` (cuyo código coincide con ISO 3166-2).
3. **Agrupación y Renderizado**: En el renderizado de cada isla, filtrar las provincias que pertenecen a ella y pintar sus polígonos en un grupo `<g>` con el color de la isla y los eventos de opacidad interactivos correspondientes a la restauración.
4. **Modo dual**: Aprovechar la integración para portar el sistema dual de temas `THEME` y homogeneizar la estética visual entre ambos mapas interactivos del TFG.
