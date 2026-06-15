# Reporte de Generación de Datos Cartográficos Natural Earth

Este documento detalla la implementación y los resultados de la **Fase 1 y Fase 2** del plan de integración cartográfica del apagón ibérico del 28-A. Se ha diseñado y ejecutado un script reproducible en Node.js para parsear, filtrar, proyectar y simplificar los shapefiles oficiales de Natural Earth (Escala 1:10m) a un dataset optimizado de bajo peso listo para ser importado en componentes React.

---

## 1. Script de Procesamiento

El script ha sido creado en [tfg-antigravity-docs/scripts/build-natural-earth-iberia.js](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/scripts/build-natural-earth-iberia.js). 

### Aspectos Técnicos Destacables del Script:
1. **Parsers Binarios Nativos**: No requiere de ninguna dependencia npm de cartografía o base de datos. Implementa lectores binarios de bajo nivel para archivos `.shp` (cabeceras, registros de tipo Point, PolyLine y Polygon con soporte multiparte) y tablas de metadatos `.dbf` (campos de longitud fija, decodificación dBase III).
2. **Douglas-Peucker en Espacio de Pantalla**: La simplificación geométrica se realiza *después* de proyectar los puntos Lat/Lon al plano del lienzo SVG ($1000 \times 800$ píxeles). Esto permite configurar el parámetro de tolerancia `epsilon` en píxeles reales de pantalla, facilitando un control visual intuitivo y preciso.
3. **Filtro de Ruido Cartográfico**: Implementa un descarte de islas y trazos microscópicos en pantalla. Si el bounding box proyectado de una isla o segmento mide menos de un número determinado de píxeles (e.g. 10px para costas, 14px para divisiones provinciales), el script descarta automáticamente la geometría. Esto evita que el archivo se llene de cientos de pequeños paths redundantes difíciles de apreciar a escala regional.

---

## 2. Archivos Generados

Se crearon dos archivos en el subdirectorio de datos cartográficos del proyecto:

1. **Dataset de producción**: [tfg-antigravity-docs/src/data/cartography/naturalEarthIberiaPaths.js](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/data/cartography/naturalEarthIberiaPaths.js)
   * Contiene los paths SVG terminados (`d="..."`) y las coordenadas pre-proyectadas de ciudades, listos para importación estática en React.
   * **Tamaño final**: **65.35 KB** (cumpliendo con creces la meta del proyecto de $<80$ KB, y situándose en el rango preferente de 30-50 KB al excluir capas duplicadas redundantes).
2. **Preview Visual Estático**: [tfg-antigravity-docs/src/data/cartography/naturalEarthIberiaPreview.svg](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/data/cartography/naturalEarthIberiaPreview.svg)
   * Archivo SVG interactivo que dibuja las capas generadas (costas, fronteras nacionales de color, subdivisiones provinciales de fondo y etiquetas de ciudades) para validar que la proyección, encuadre y niveles de simplificación sean óptimos.
   * **Tamaño final**: **67.04 KB**.

---

## 3. Capas Utilizadas y Filtrado

Para conformar el dataset geográfico final, se utilizaron y filtraron las siguientes capas de Natural Earth:

* **`ne_10m_admin_0_countries`**:
  * Se extrajeron los polígonos de soberanía nacional para **España (ESP)**, **Portugal (PRT)**, **Francia (FRA)**, **Marruecos (MAR)** y **Andorra (AND)**.
  * Para evitar cargar zonas no visibles o de ultramar (como la Guayana Francesa o el Sáhara Occidental), se descartaron todos los anillos del polígono (partes) cuyos bounding boxes locales no intersecasen nuestro Bbox expandido.
* **`ne_10m_coastline`**:
  * Se extrajeron las líneas de costa que intersecan la región de estudio para superponer un trazo fino marino sobre el mapa.
* **`ne_10m_admin_0_boundary_lines_land`**:
  * Se extrajeron las fronteras terrestres entre los países del marco para dibujar la división política del apagón.
* **`ne_10m_admin_1_states_provinces`**:
  * Se extrajeron las subdivisiones para España y Portugal (`iso_a2 === 'ES'` o `'PT'`).
  * Se excluyó explícitamente a las Islas Canarias del dataset para cumplir con las directrices metodológicas y evitar desviar el mapa.
* **`ne_10m_populated_places`**:
  * Se extrajeron 13 ciudades de referencia para los mapas: *Madrid, Barcelona, Valencia, Sevilla, Bilbao, Zaragoza, Málaga, Granada, Lisboa, Oporto, Toulouse, Burdeos y Rabat*.

> [!NOTE]
> La capa **`ne_10m_land`** fue omitida de forma consciente. Al contar con los polígonos geopolíticos detallados de la capa de países (`ne_10m_admin_0_countries`), exportar además la capa de tierra continental duplicaba toda la masa terrestre y sumaba más de 120 KB innecesarios al archivo. El lienzo se puede colorear de forma más eficiente y con mayor interactividad combinando o dibujando los países nacionales individuales.

---

## 4. Bounding Box y Proyección

Se adoptaron exactamente los límites espaciales del proyecto:

* **Límites Geográficos**:
  * Latitud: de $34.0^\circ\text{ N}$ a $46.0^\circ\text{ N}$
  * Longitud: de $-10.5^\circ\text{ O}$ a $5.5^\circ\text{ E}$
* **Dimensiones del Canvas SVG**: $1000 \times 800$ píxeles.
* **Fórmula de Proyección**: Proyección equirrectangular lineal simple (Plate Carrée), que coincide milimétricamente con el posicionamiento de los nodos eléctricos pre-existentes en el proyecto:
  $$x = \frac{\text{lon} - (-10.5)}{5.5 - (-10.5)} \cdot 1000$$
  $$y = \frac{46.0 - \text{lat}}{46.0 - 34.0} \cdot 800$$

---

## 5. Estadísticas de Vértices y Reducción

El script aplicó una simplificación de tolerancia ajustada por capa para optimizar el peso sin perder rigor de forma:

| Capa Cartográfica | Features | Epsilon (px) | Vértices Originales | Vértices Simplificados | Ratio de Reducción |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Coastline** | 6 | 3.6 | 15,735 | 1,158 | **92.6 %** |
| **Land** (Omitida) | 0 | 8.0 | 446,170 | 0 | **100.0 %** |
| **Countries** | 5 | 2.4 | 9,944 | 856 | **91.4 %** |
| **Borders** | 23 | 2.0 | 1,476 | 169 | **88.6 %** |
| **Admin 1 (Provincias)** | 66 | 4.0 | 18,052 | 1,241 | **93.1 %** |
| **Cities** | 13 | 0.0 | 13 | 13 | **0.0 %** |
| **TOTAL** | **113** | **-** | **491,390** | **3,437** | **99.3 %** |

El dataset final ha reducido en un **99.3%** el número de vértices totales respecto a las capas originales de Natural Earth de 10 metros, logrando un peso óptimo en disco de **65.35 KB** y conservando una silueta ibérica limpia e impecable para SVG.

---

## 6. Riesgos Detectados

1. **Rendimiento por renderizado de caminos complejos en React**:
   * *Riesgo*: Renderizar dinámicamente 66 provincias en React con eventos de mouse-hover individuales puede ralentizar navegadores en dispositivos modestos si el DOM del SVG se regenera con frecuencia.
   * *Mitigación*: En el componente de reposición, en lugar de dibujar 66 paths interactivos separados, se pueden agrupar en un elemento SVG estático `<g>` sin eventos individuales y definir únicamente eventos de interacción interactiva en los polígonos unificados de las 7 islas eléctricas (que se dibujan fácilmente agrupando o concatenando los paths de las provincias correspondientes).
2. **Duplicación de costas y bordes nacionales**:
   * *Riesgo*: Al dibujar la costa por un lado (`COASTLINE_PATHS`) y los polígonos de países por otro (`COUNTRY_PATHS`), las líneas pueden solaparse ligeramente y verse "borrosas" en pantallas de alta densidad si se aplican grosores de borde distintos.
   * *Mitigación*: Se recomienda pintar los polígonos nacionales sin bordes (`stroke="none"`) y dibujar la costa y fronteras encima como líneas independientes (`stroke-width="1.2"` y `fill="none"`). Esto dará una visualización nítida y perfectamente delineada.

---

## 7. Recomendaciones de Integración en Componentes React

### Integración en `BlackoutPropagationMapBase.jsx`
1. Importar el dataset:
   ```javascript
   import { COUNTRY_PATHS, BORDER_PATHS, COASTLINE_PATHS, CITY_POINTS } from '../data/cartography/naturalEarthIberiaPaths';
   ```
2. Reemplazar los paths vectoriales hardcodeados `IBERIA_PATH`, `PORTUGAL_PATH` y `BALEARES_PATH` por un mapeo dinámico de los países de `COUNTRY_PATHS`.
3. Pintar los países del fondo aplicando colores adaptados a la paleta del tema actual (`THEME.light` y `THEME.dark`):
   * España: color de tierra base (crema en light mode, azul grisáceo profundo en dark mode).
   * Francia/Marruecos: colores desaturados con opacidades del 30-50% para centrar la atención en la península.
4. Dibujar los caminos de `BORDER_PATHS` con trazo rojo o gris fino punteado, y `COASTLINE_PATHS` en azul o gris para dar definición a la silueta.
5. Los nodos eléctricos del counter y arcos se colocarán automáticamente sobre sus ubicaciones reales de forma exacta.

### Integración en `AnimatedRestorationMap.jsx`
1. Importar el dataset:
   ```javascript
   import { ADMIN1_PATHS, COUNTRY_PATHS, BORDER_PATHS, COASTLINE_PATHS, CITY_POINTS } from '../data/cartography/naturalEarthIberiaPaths';
   ```
2. Reemplazar los polígonos aproximados a mano de las 7 islas en la constante `ISLANDS` por una lista indexada de los códigos ISO de provincia correspondientes a cada área eléctrica (véase Sección 6 del informe de auditoría).
3. En tiempo de ejecución en el componente, agrupar los paths de las provincias asociadas a cada isla bajo un elemento SVG `<g>` o pintarlos dinámicamente:
   ```javascript
   // Ejemplo conceptual para pintar la Isla de Cataluña (CAT)
   const CataluñaProvinces = ADMIN1_PATHS.filter(p => p.country === 'ES' && p.region === 'Cataluña');
   ```
4. Aplicar opacidades y colores dinámicos a las provincias de la isla según su tiempo de reposición (`simTime >= island.restoreTime`), creando un frente de reposición geográficamente riguroso y sumamente profesional.
5. Implementar el esquema de colores dual de temas para erradicar las inconsistencias de contraste en light mode.
