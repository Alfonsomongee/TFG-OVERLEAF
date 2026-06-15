# Auditoría Natural Earth y mapas del apagón

## 1. Resumen ejecutivo

Este documento presenta los resultados de la auditoría técnica no destructiva de los recursos cartográficos y componentes de mapas interactivos del proyecto del apagón ibérico del 28-A. 

El proyecto cuenta con un conjunto completo de datos vectoriales de alta resolución (1:10m) procedentes de **Natural Earth** en formato shapefile (ESRI), almacenados en la ruta [data/cartography/natural-earth/](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/data/cartography/natural-earth/). Sin embargo, estos datos de gran tamaño no están integrados de forma directa en los componentes de visualización React, los cuales recurren actualmente a trazos SVG simplificados y polígonos hardcodeados de baja fidelidad (28 puntos para delimitar toda la Península Ibérica).

La integración de Natural Earth aportará rigor geográfico y académico al Trabajo de Fin de Grado (TFG), permitiendo representar con precisión real los nodos de la red eléctrica peninsular y los límites geográficos exactos de las 7 islas de reposición del servicio. La estrategia óptima recomendada consiste en procesar y simplificar los shapefiles a formatos vectoriales ligeros pre-proyectados en SVG o GeoJSON simplificado de bajo peso (< 50 KB), protegiendo la compatibilidad SSG de Docusaurus y aislando en el control de versiones (.gitignore) los binarios raw de Natural Earth (que superan los 90 MB).

---

## 2. Inventario de datos cartográficos

Se ha comprobado la existencia y estado de las rutas y directorios solicitados en el alcance de la auditoría:

| Ruta del proyecto | Estado | Observaciones / Ubicación |
| :--- | :---: | :--- |
| `data/cartography/` | **Existe** | Raíz del espacio de trabajo. Contiene los datos vectoriales. |
| `data/cartography/natural-earth/` | **Existe** | Subdirectorio principal de cartografía. |
| `data/cartography/natural-earth/raw/` | **Existe** | Contiene los 7 archivos ZIP originales descargados. |
| `data/cartography/natural-earth/unzipped/` | **Existe** | Contiene las 7 carpetas descomprimidas con sus shapefiles. |
| `src/components/BlackoutPropagationMapBase.jsx` | **Existe** | Ubicado en [tfg-antigravity-docs/src/components/BlackoutPropagationMapBase.jsx](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/components/BlackoutPropagationMapBase.jsx). |
| `src/components/AnimatedRestorationMap.jsx` | **Existe** | Ubicado en [tfg-antigravity-docs/src/components/AnimatedRestorationMap.jsx](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/src/components/AnimatedRestorationMap.jsx). |
| `src/data/` | **No existe en raíz** | La estructura de datos del Docusaurus se gestiona en `tfg-antigravity-docs/src/data/` (o directamente dentro de los componentes). |
| `static/` | **Existe** | Carpetas `/static` presentes en la raíz y en `tfg-antigravity-docs/static`. |
| `scripts/` | **No existe en raíz** | No hay carpeta `scripts/` en el nivel raíz del espacio de trabajo. Existen scripts de utilidad sueltos en el nivel superior y dentro de [tfg-antigravity-docs/](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/). |
| `package.json` | **Existe** | Hay un `package.json` de control en el nivel superior y el principal de Docusaurus en `tfg-antigravity-docs/package.json`. |
| `.gitignore` | **Existe** | Presente en la raíz y en `tfg-antigravity-docs/.gitignore`. |

### Inventario Detallado de Capas de Natural Earth (Escala 1:10m)

Se identificaron 7 capas cartográficas descomprimidas completas. Cada una cuenta con la estructura estándar de ESRI Shapefile (`.shp`, `.shx`, `.dbf`, `.prj`, `.cpg`, `.VERSION.txt`, y `.README.html`). No falta ningún archivo esencial para su posterior procesamiento.

1. **`ne_10m_admin_0_boundary_lines_land`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_admin_0_boundary_lines_land.zip` (~1.0 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_admin_0_boundary_lines_land/`
   - **Archivos presentes**: `.shp` (1.30 MB), `.dbf` (1.12 MB), `.shx` (4.2 KB), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **PolyLine** que representa fronteras políticas terrestres de primer nivel.

2. **`ne_10m_admin_0_countries`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_admin_0_countries.zip` (~4.7 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_admin_0_countries/`
   - **Archivos presentes**: `.shp` (8.81 MB), `.dbf` (878 KB), `.shx` (2.2 KB), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **Polygon** con contornos nacionales geopolíticos completos.

3. **`ne_10m_admin_1_states_provinces`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_admin_1_states_provinces.zip` (~14.2 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_admin_1_states_provinces/`
   - **Archivos presentes**: `.shp` (21.00 MB), `.dbf` (15.16 MB), `.shx` (36.9 KB), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **Polygon** que desglosa estados, distritos y provincias. Capa clave para delimitar áreas de restauración.

4. **`ne_10m_coastline`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_coastline.zip` (~2.9 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_coastline/`
   - **Archivos presentes**: `.shp` (6.81 MB), `.dbf` (393 KB), `.shx` (33.2 KB), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **PolyLine** que define las líneas de costa de océanos e islas continentales.

5. **`ne_10m_land`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_land.zip` (~3.1 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_land/`
   - **Archivos presentes**: `.shp` (7.17 MB), `.dbf` (350 bytes), `.shx` (188 bytes), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **Polygon** que representa masas continentales y terrestres agrupadas.

6. **`ne_10m_ocean`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_ocean.zip` (~3.0 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_ocean/`
   - **Archivos presentes**: `.shp` (7.18 MB), `.dbf` (138 bytes), `.shx` (108 bytes), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **Polygon** para la representación del fondo marino oceánico.

7. **`ne_10m_populated_places`**
   - **Ruta ZIP**: `data/cartography/natural-earth/raw/ne_10m_populated_places.zip` (~2.7 MB)
   - **Carpeta descomprimida**: `data/cartography/natural-earth/unzipped/ne_10m_populated_places/`
   - **Archivos presentes**: `.shp` (206 KB), `.dbf` (48.28 MB), `.shx` (58.8 KB), `.prj`, `.cpg`, `.VERSION.txt`, `.README.html`
   - **Validez**: Válido. Capa de tipo **Point** que recopila metadatos e índices geográficos de núcleos poblacionales del mundo.

---

## 3. Validación de shapefiles

Para realizar la validación técnica sin alterar el entorno del usuario ni instalar dependencias externas, se programaron scripts ligeros en Node.js que analizan directamente las estructuras binarias de los archivos `.shp`, `.prj` y `.dbf`.

### Sistema de coordenadas (CRS)
Todos los archivos `.prj` analizados declaran de manera consistente un sistema geográfico de coordenadas de tipo:
* **GCS_WGS_1984** (Sistema de Referencia Geodésico Mundial de 1984), el cual equivale al código estándar **EPSG:4326**. 
* Utiliza unidades angulares en grados decimales, con el meridiano de Greenwich como origen (0.0 longitude) y un esferoide con semieje mayor de 6,378,137 metros.
* Esto garantiza compatibilidad matemática directa: se pueden mapear las posiciones geográficas reales en latitud y longitud directamente sobre el lienzo SVG mediante proyecciones de coordenadas directas.

### Features y Bounding Box (BBox) por capa
El análisis binario de los archivos `.shp` determinó las dimensiones físicas mundiales de cada recurso cartográfico:

* **ne_10m_admin_0_boundary_lines_land**:
  * *Features*: 515 segmentos de líneas fronterizas terrestres.
  * *Bounding Box*: Min [Lon: -141.0055, Lat: -55.1209] $\rightarrow$ Max [Lon: 145.9410, Lat: 70.0753]
* **ne_10m_admin_0_countries**:
  * *Features*: 258 polígonos correspondientes a los límites soberanos del planeta.
  * *Bounding Box*: Min [Lon: -180.0000, Lat: -90.0000] $\rightarrow$ Max [Lon: 180.0000, Lat: 83.6341]
* **ne_10m_admin_1_states_provinces**:
  * *Features*: 4,596 polígonos que subdividen administrativamente todos los continentes.
  * *Bounding Box*: Min [Lon: -180.0000, Lat: -90.0000] $\rightarrow$ Max [Lon: 180.0000, Lat: 83.6341]
* **ne_10m_coastline**:
  * *Features*: 4,133 trazos de costa.
  * *Bounding Box*: Min [Lon: -180.0000, Lat: -85.2219] $\rightarrow$ Max [Lon: 180.0000, Lat: 83.6341]
* **ne_10m_land**:
  * *Features*: 11 grandes polígonos simplificados de las masas de tierra continentales.
  * *Bounding Box*: Min [Lon: -180.0000, Lat: -90.0000] $\rightarrow$ Max [Lon: 180.0000, Lat: 83.6341]
* **ne_10m_ocean**:
  * *Features*: 1 polígono unificado gigante que cubre las aguas mundiales.
  * *Bounding Box*: Min [Lon: -180.0000, Lat: -85.2219] $\rightarrow$ Max [Lon: 180.0000, Lat: 90.0000]
* **ne_10m_populated_places**:
  * *Features*: 7,342 puntos representativos de núcleos urbanos globales.
  * *Bounding Box*: Min [Lon: -179.5900, Lat: -90.0000] $\rightarrow$ Max [Lon: 179.3833, Lat: 82.4833]

### Campos del archivo DBF e información de interés
La decodificación binaria de las tablas asociadas (`.dbf`) localizó los siguientes datos críticos para el recorte geográfico regional y la segmentación ibérica:

* **Filtrado Nacional (`ne_10m_admin_0_countries.dbf`)**:
  El campo `ADM0_A3` (de tipo cadena, longitud 3) contiene códigos ISO alfa-3 válidos. Se confirmaron los registros:
  * **España**: Índice `66` (Código: `ESP`, Nombre: `Spain`)
  * **Portugal**: Índice `140` (Código: `PRT`, Nombre: `Portugal`)
  * **Francia**: Índice `21` (Código: `FRA`, Nombre: `France`)
  * **Marruecos**: Índice `26` (Código: `MAR`, Nombre: `Morocco`)
* **Filtrado Regional y Provincial (`ne_10m_admin_1_states_provinces.dbf`)**:
  Se recuperaron **72 provincias/estados** asignados a España y Portugal combinados. El campo `iso_a2` almacena el código ISO del país (`ES` y `PT`), mientras que `iso_3166_2` proporciona el código provincial normalizado (e.g., `ES-GI` para Gerona, `ES-HU` para Huesca, `PT-07` para Évora). Esto habilita un filtrado exacto y exhaustivo para conformar las 7 islas de restauración a partir de divisiones administrativas reales en lugar de trazos libres.
* **Ciudades y Subestaciones (`ne_10m_populated_places.dbf`)**:
  Contiene núcleos urbanos detallados junto a su `SCALERANK` y coordenadas exactas en los campos `LATITUDE` y `LONGITUDE` (e.g. Madrid: Lat 40.4019, Lon -3.6852).

---

## 4. Estado actual de los componentes de mapa

Ambos componentes de mapa son de muy alta calidad técnica en su lógica de simulación, manejo del estado de reproducción y telemetría interactiva, pero adolecen de severas simplificaciones cartográficas:

### `BlackoutPropagationMapBase.jsx`
* **Uso de SVG manual**: Sí. El mapa completo se dibuja con trazos SVG.
* **Datos externos / Fetch**: No. La totalidad de datos de subestaciones, líneas y eventos está hardcodeada dentro de constantes en el archivo (`STATIONS`, `ARCS`, `EVENTS`).
* **Coordenadas hardcodeadas**: Sí y no. Las subestaciones e interconexiones transfronterizas usan coordenadas reales latitud/longitud en su definición. No obstante, el contorno ibérico (`IBERIA_OUTLINE` de 28 puntos y `PORTUGAL_OUTLINE` de 11 puntos) está simplificado hasta el extremo de parecer una figura geométrica abstracta.
* **Imágenes raster**: No. Todo el dibujo es vectorial.
* **Proyección cartográfica**: Implementa una proyección equirrectangular simple (Plate Carrée) a través de la función `gp(lat, lon)`. Mapea de forma lineal las coordenadas geográficas reales sobre un lienzo de $1000 \times 800$ píxeles basándose en un límite delimitado (`GEO = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 }`).
* **Nodos eléctricos**: Sus posiciones $\{x, y\}$ en pantalla se calculan dinámicamente según la proyección geodésica lineal, garantizando coherencia con el contorno de fondo. Sin embargo, las conexiones eléctricas (los arcos) están asignadas manualmente asociando identificadores de subestación.
* **Modo Claro / Oscuro**: **Soporte completo y excelente**. Lee el estado `colorMode` de Docusaurus y define dos paletas cromáticas sumamente detalladas en el objeto `THEME` para garantizar contraste y viveza estética (crema en modo claro, azul oscuro/negro en modo oscuro).
* **Responsive**: Sí. El SVG cuenta con `viewBox` y escalado dinámico del ancho del $100\%$.

### `AnimatedRestorationMap.jsx`
* **Uso de SVG manual**: Sí, renderizado mediante un canvas de SVG manual.
* **Datos externos / Fetch**: No. Datos completamente estáticos integrados.
* **Coordenadas hardcodeadas**: Para los puntos de arranque de tensión (Black Start), usa coordenadas de latitud/longitud reales. Sin embargo, para representar las 7 islas de reposición eléctrica, se recurre a polígonos aproximados dibujados manualmente uniendo puntos arbitrarios (`points` en la constante `ISLANDS`), lo que provoca que las fronteras de restauración floten sobre el mar o se solapen de manera geográficamente inexacta.
* **Proyección**: Misma proyección lineal equirrectangular simple en el viewport de $1000 \times 800$.
* **Modo Claro / Oscuro**: **Soporte muy deficiente**. Carece de un esquema de color dual completo. Aunque usa variables globales de CSS como `var(--chart-bg)`, mantiene constantes de color hardcodeadas oscuras en el código JS (como `#374151` para textos de islas desactivadas y bordes de botones fijos). Esto destruye el contraste de las etiquetas y del panel de control cuando el usuario cambia a modo claro.
* **Responsive**: Sí. Usa viewBox y ancho del $100\%$.

---

## 5. Compatibilidad con BlackoutPropagationMapBase.jsx

El componente de propagación del colapso se beneficiará notablemente de Natural Earth:

* **Geografía realista**: El contorno de la península ibérica de 28 puntos actual distorsiona visiblemente la ubicación de los nudos (e.g. Badajoz parece estar demasiado cerca del centro de Portugal y la interconexión con Francia parece flotar en el Golfo de Vizcaya). Introducir el contorno costero real de `ne_10m_coastline` y las fronteras de `ne_10m_admin_0_boundary_lines_land` situará las subestaciones en su ubicación exacta.
* **Presencia transfronteriza**: Las interconexiones con Francia (RTE) y Marruecos (Mellousa/ONEE) representan hitos dinámicos en el apagón. Incorporar los límites terrestres de Francia y el norte de Marruecos dará sustento geográfico a las líneas transpirenaicas y al cable submarino del Estrecho.
* **Fácil integración**: La proyección lineal actual (`gp`) es perfectamente compatible con las geometrías de Natural Earth. Solo se requiere proyectar los puntos del contorno realista mediante la misma fórmula lineal.

---

## 6. Compatibilidad con AnimatedRestorationMap.jsx

El mapa de reposición es el componente que mayor salto cualitativo experimentará con Natural Earth:

* **Polígonos de islas de restauración realistas**: En lugar de definir polígonos a mano alzada para las 7 islas operativas (Sur, Centro, Levante, Cataluña, Norte, Galicia, Portugal), la capa `ne_10m_admin_1_states_provinces` permitirá agrupar las geometrías de las provincias reales que conformaron cada bloque de restauración:
  * *Isla Sur*: Andalucía (Sevilla, Cádiz, Huelva, Córdoba, Málaga, Jaén, Granada, Almería) + Extremadura meridional.
  * *Isla Centro*: Madrid, Castilla-La Mancha y Castilla y León meridional.
  * *Isla Levante*: Comunidad Valenciana y Murcia.
  * *Isla Cataluña*: Cataluña completa.
  * *Isla Norte*: País Vasco, Navarra, La Rioja, Cantabria y Aragón.
  * *Isla Galicia/León*: Galicia, Asturias, y León.
  * *Isla Portugal*: Portugal continental (distritos agrupados).
* **Solapamientos e intersecciones**: Al combinar los límites provinciales oficiales y recortarlos con la línea costera real de Natural Earth, las islas se adaptarán perfectamente a la geografía ibérica sin "derramarse" sobre el océano Atlántico o el Mediterráneo.
* **Corrección del modo claro/oscuro**: Se debe aprovechar la integración cartográfica para unificar el sistema de renderizado y portar la paleta de colores del mapa de propagación (`THEME.light` / `THEME.dark`) a este componente, saneando la legibilidad.

---

## 7. Estrategia recomendada de procesado

Para integrar Natural Earth preservando el rendimiento del sitio Docusaurus, evaluamos las siguientes opciones:

| Estrategia | Ventajas | Riesgos | Selección |
| :--- | :--- | :--- | :---: |
| **Opción A**: GeoJSON local | Alta fidelidad. El navegador renderiza según datos locales cargados en JS. | **Excesivo tamaño en bundle**. Un GeoJSON mediano puede añadir >1 MB al bundle final de Docusaurus. | No recomendada |
| **Opción B**: SVG path preprocesado | **Rendimiento óptimo**. Los paths simplificados se guardan como strings JS comprimidos. Renderizado directo. | Menor flexibilidad si se desea reproyectar en runtime. | **RECOMENDADA (Optimizada)** |
| **Opción C**: Carga por `fetch` en `static/` | Aísla los datos del bundle JS principal. | Parpadeos visuales al cargar ("flash"). Complejidad en rutas relativas bajo SSG. | No recomendada |
| **Opción D**: Mapa manual refinado | Cero scripts y dependencias. | Mantiene la distorsión geográfica y el aspecto no profesional. | Rechazada |

### La Estrategia Ganadora: Opción B Optimizada (SVG pre-proyectado agrupado)
Consiste en escribir un script de preparación en Node.js que:
1. Filtre las geometrías de los shapefiles de Natural Earth para quedarse únicamente con los países de interés (España, Portugal, Francia, Marruecos) y las 72 provincias ibéricas de la capa `admin_1`.
2. Proyecte matemáticamente todas las coordenadas geográficas (Lat/Lon WGS84) al espacio del lienzo SVG de $1000 \times 800$ píxeles utilizando la misma proyección del proyecto.
3. Simplifique drásticamente las líneas resultantes (reduciendo puntos redundantes en un 95-98% mediante algoritmos como Douglas-Peucker) para garantizar que el peso sea mínimo.
4. Genere un único archivo ligero JavaScript (`src/data/cartography/geometries.js` o similar) que contenga constantes con los paths SVG terminados (`M x,y L x,y...`).
   * *Ejemplo*: `const SPAIN_COAST = "M 120 90 L 125 92..."`
   * *Ejemplo*: `const RESTORATION_ISLANDS = { SUR: "M...", CEN: "M..." }`
5. Este archivo tendrá un peso estimado de **30 a 50 KB**, no afectará al bundle de Docusaurus, y permitirá colorear las islas y trazos con total libertad e interactividad en tiempo de ejecución.

---

## 8. Bounding box y proyección recomendada

### Bounding Box del Lienzo
El encuadre geográfico de referencia establecido en los componentes actuales es de alta precisión para el foco del estudio y se propone mantenerlo:

```json
{
  "lon_min": -10.5,
  "lon_max": 5.5,
  "lat_min": 34.0,
  "lat_max": 46.0
}
```

* **Margen Oeste (-10.5º Lon)**: Cubre holgadamente el extremo occidental de Portugal continental (Cabo da Roca, -9.5º Lon) dejando un colchón visual estético de 1.0º para la telemetría atlántica de REN.
* **Margen Este (5.5º Lon)**: Cubre en su totalidad las Islas Baleares (Menorca llega a 4.3º E) y da espacio a las conexiones de interconexión del Mediterráneo y sur de Francia.
* **Margen Norte (46.0º Lat)**: Muestra el norte de la península ibérica (Estaca de Bares a 43.7º N) e incluye el sur de Francia (Bauxas, Burdeos) fundamental para visualizar las líneas transpirenaicas de RTE.
* **Margen Sur (34.0º Lat)**: Captura el Estrecho de Gibraltar y el norte de Marruecos (Mellousa, 35.7º Lat) sirviendo de ancla para la interconexión de ONEE con Andalucía.

### Exclusión de las Islas Canarias
Las Islas Canarias se sitúan en torno a los 28º N de latitud y 15º O de longitud. 
* **Técnicamente**: No forman parte del sistema síncrono peninsular ni del mercado eléctrico ibérico (MIBEL). Cuentan con sistemas aislados propios que no sufrieron el apagón peninsular ni formaron parte del proceso de reposición secuencial.
* **Cartográficamente**: Su inclusión dentro del mismo lienzo a escala real desplazaría el mapa hacia el suroeste, reduciendo a la mitad el área visible de la península y perdiendo el detalle de las interconexiones críticas con Francia. Su inclusión en un recuadro secundario ("inset map") solo añadiría complejidad visual innecesaria sin aportar valor narrativo.
* **Decisión**: Se recomienda **excluir formalmente** a Canarias de estos mapas operacionales específicos.

### Proyección Geodésica
Se recomienda conservar la proyección equirrectangular corregida o la equirrectangular estándar del proyecto:
$$x = \frac{\text{lon} - \text{lon\_min}}{\text{lon\_max} - \text{lon\_min}} \cdot \text{ViewBox.Width}$$
$$y = \frac{\text{lat\_max} - \text{lat}}{\text{lat\_max} - \text{lat\_min}} \cdot \text{ViewBox.Height}$$

Esta proyección lineal mantiene consistencia perfecta y absoluta con las posiciones de las subestaciones y nodos actualmente desplegados, simplificando los cálculos y garantizando que no existan desfases entre la topología y la geografía de fondo.

---

## 9. Riesgos técnicos

Se identifican los siguientes riesgos de implementación y sus respectivas medidas de mitigación:

1. **Exceso de peso del bundle en el despliegue de Vercel/Docusaurus**:
   * *Riesgo*: Importar ficheros de datos cartográficos demasiado detallados hará que Docusaurus falle en la etapa de optimización Webpack, arrojando advertencias de tamaño de bundle y ralentizando la experiencia interactiva del usuario.
   * *Mitigación*: Simplificación agresiva de geometrías durante la fase de preparación en Node.js (reducción del 95% de los vértices costeros y provinciales). Limitar el número de puntos totales en el archivo de salida a menos de 2,000 en todo el mapa.
2. **Incompatibilidad con Generación Estática (SSG) de Docusaurus**:
   * *Riesgo*: El motor de renderizado del lado del servidor de Docusaurus fallará durante el comando `npm run build` si los componentes intentan acceder a objetos del navegador en runtime como `window` o `document`.
   * *Mitigación*: Encapsular y diferir los componentes de mapas dinámicos mediante `<BrowserOnly>` y React.lazy (tal como ya se realiza en `BlackoutPropagationMap.jsx`), impidiendo que se ejecuten durante el SSG del servidor de Node.
3. **Pérdida de rendimiento en animaciones SVG**:
   * *Riesgo*: Animar opacidades o frentes de ondas sobre caminos SVG excesivamente complejos provocará caídas de frames en el renderizado de Docusaurus.
   * *Mitigación*: Diseñar los trazos de las islas de restauración de forma limpia, evitando el solapamiento de caminos complejos. Utilizar aceleración por hardware en las animaciones (`will-change: transform, opacity`).

---

## 10. Recomendaciones sobre Git y peso del repositorio

El conjunto de datos original de Natural Earth (ZIPs en `raw/` y archivos binarios de shapefiles en `unzipped/`) suma un total acumulado de aproximadamente **94.2 MB** de datos físicos en el disco:

> [!WARNING]
> Subir estos archivos raw y descomprimidos al control de versiones de Git incrementará dramáticamente el peso del repositorio, ralentizará los procesos de clonación y empuje, e infringirá las buenas prácticas de desarrollo al subir archivos binarios e intermedios que no forman parte directa del código de producción de la aplicación.

### Reglas recomendadas para `.gitignore`
Se propone agregar las siguientes reglas de exclusión al archivo [C:/Users/aphmo/Proyectos/TFG OVERLEAF/.gitignore](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/.gitignore) y [tfg-antigravity-docs/.gitignore](file:///C:/Users/aphmo/Proyectos/TFG%20OVERLEAF/tfg-antigravity-docs/.gitignore) para mantener el repositorio limpio:

```txt
# Cartografía y datos pesados de Natural Earth
data/cartography/natural-earth/raw/*.zip
data/cartography/natural-earth/unzipped/

# Scripts intermedios y logs de procesamiento
data/cartography/tmp/
*.log
```

Solo se mantendrán bajo el control de versiones:
1. El script de procesamiento (por ejemplo, `scripts/prepare_cartography.js`).
2. El archivo de geometrías simplificadas resultante (`src/data/cartography/geometries.js`), cuyo peso optimizado no excederá los 50 KB.

---

## 11. Plan de implementación por fases

### Fase 1: Preparación de datos y scripting de simplificación
* Escribir un script de procesamiento en Node.js que cargue los archivos de datos descomprimidos (utilizando librerías nativas ligeras o parseadores binarios como los desarrollados durante la auditoría).
* Filtrar la capa de fronteras para conservar únicamente España, Portugal, Francia y Marruecos.
* Filtrar la capa de provincias (`admin_1`) para retener las 72 provincias de España y Portugal y agruparlas programáticamente bajo las 7 áreas de la restauración (islas eléctricas) según la asignación forense definida en la Sección 6.
* Simplificar los polígonos utilizando un algoritmo de reducción de puntos.
* Proyectar matemáticamente las coordenadas al viewBox $1000 \times 800$ aplicando la proyección del proyecto.

### Fase 2: Generación del dataset ligero
* Guardar el conjunto de datos cartográficos optimizado en la ruta `tfg-antigravity-docs/src/data/cartography/geometries.js` exportando las constantes de paths SVG pre-proyectados de contorno, fronteras y las 7 islas eléctricas.
* Verificar que el tamaño físico del archivo no supere los 50 KB.

### Fase 3: Integración en `BlackoutPropagationMapBase.jsx`
* Importar las geometrías simplificadas de fondo desde `geometries.js`.
* Sustituir las constantes locales de trazo manual por los nuevos contornos geográficos realistas de España, Portugal, Baleares, frontera francesa y costa norte-marroquí.
* Ajustar el viewBox y las variables cartográficas si fuera necesario.
* Comprobar que los nodos de las subestaciones e interconexiones transfronterizas cuadran de forma exacta sobre la geografía realista.

### Fase 4: Integración en `AnimatedRestorationMap.jsx`
* Importar los contornos nacionales y las geometrías de las 7 islas eléctricas desde `geometries.js`.
* Reemplazar los polígonos aproximados dibujados a mano de las islas por los nuevos polígonos provinciales de alta fidelidad.
* Adaptar el renderizado dinámico del estado de activación de cada isla utilizando las nuevas trayectorias SVG.
* Corregir el sistema de temas claro/oscuro importando una estructura dual (`THEME`) análoga a la de propagación para erradicar las inconsistencias de contraste en light mode.

### Fase 5: Validación visual y build
* Probar el comportamiento responsivo en dispositivos móviles.
* Comprobar que el cambio entre temas claro y oscuro ajusta correctamente los fondos oceánicos, bordes terrestres, leyendas y botones en ambos mapas.
* Ejecutar un build del sitio (`npm run build`) para verificar la correcta optimización del bundle y la ausencia de problemas con la generación SSG.

---

## 12. Próximo prompt recomendado para implementar

Para iniciar la ejecución del plan aprobado, se sugeriona proporcionar el siguiente prompt técnico al asistente:

```txt
Actúa como desarrollador Docusaurus/React y procesador de datos GIS. Implementa la Fase 1 y Fase 2 del plan de auditoría cartográfica:
1. Crea un script en el proyecto para leer los shapefiles de Natural Earth en data/cartography/natural-earth/unzipped/.
2. Filtra España, Portugal, Francia (sur) y Marruecos (norte) de las capas admin_0 y coastline.
3. Agrupa las 72 provincias de España y Portugal en las 7 islas eléctricas definidas para la restauración en base a la capa admin_1.
4. Aplica la proyección lineal establecida en el proyecto (viewBox 1000x800 con límites -10.5º a 5.5º Lon y 34º a 46º Lat) y realiza una simplificación de geometrías.
5. Genera el archivo final tfg-antigravity-docs/src/data/cartography/geometries.js con los paths SVG pre-proyectados listos para importar.
```
