# Reporte: Ajuste de Paleta en Mapas Natural Earth

## 1. Archivos modificados
- `tfg-antigravity-docs/src/components/BlackoutPropagationMapBase.jsx`
- `tfg-antigravity-docs/src/components/AnimatedRestorationMap.jsx`

## 2. Variables o colores cambiados
Se eliminaron los colores harcodeados y el patrón dominante oscuro en favor de un sistema de variables jerárquico adaptativo según el tema (light/dark):

**Light Mode (Estilo lámina analógica / académica):**
- `ocean`: `#EEF3F2` (mar cálido y suave)
- `landMain`: `#D9DED4` (Iberia, clara y prioritaria)
- `landNeighbor`: `#E7E9E1` (Francia, Marruecos, de contraste sutil)
- `coastline`: `#9EAA9C`
- `border`: `#B7C0B2`
- `city`: `#7D8577`
- `cityLabel`: `rgba(60, 67, 58, 0.56)`

**Dark Mode (Estilo blueprint técnico):**
- `ocean`: `#07182D` (el plano más profundo y oscuro)
- `landMain`: `#173149` (Iberia destacada de forma discreta)
- `landNeighbor`: `#10263B`
- `coastline`: `#3E6176`
- `border`: `#2D4E63`
- `city`: `#8FA8B7`
- `cityLabel`: `rgba(210, 224, 232, 0.50)`

## 3. Justificación visual
Se han sustituido gradientes pesados (`bgGrad`) por colores planos (`ocean`) que limpian la carga visual. La distinción entre tierra principal y países vecinos se ha armonizado, respetando la directriz de que la masa terrestre actúe de lienzo ("no como un bloque dominante") y permita el protagonismo absoluto de los nodos eléctricos, alertas rojas y líneas de restauración. 

Para *AnimatedRestorationMap*, se inyectó dinámicamente `useColorMode()` para soportar correctamente el modo claro, del cual carecía anteriormente, emparejando la estética técnica de ambos componentes.

## 4. Resultado en light mode
Se logró el objetivo de simular una lámina técnica en papel cálido: el mar se difumina en un tono blanquecino suave (`#EEF3F2`) sin llegar a quemar, y la tierra adopta un tono oliva-grisáceo. Se deshizo por completo el antiguo bloque navy, asegurando la legibilidad verde, amarilla y roja de los eventos de la red.

## 5. Resultado en dark mode
Se acentuó el rigor técnico: el océano es ahora el plano de fondo absoluto (`#07182D`), permitiendo que el continente resalte por su luminosidad sutil y sus delineados tenues sin requerir colores saturados o "neón". 

## 6. Resultado de `git diff --check`
`0` errores. Todos los espacios residuales encontrados durante el desarrollo se solucionaron.

## 7. Resultado de `npm run build`
Ejecutado con éxito. El bug temporal previo del compilador `ValidationError` se solucionó tras realizar una limpieza de la caché de Docusaurus (`npm run clear`).

## 8. Problemas pendientes
Ninguno por ahora. El sistema cartográfico base se ha adaptado a nivel vectorial y cromático a la perfección.
