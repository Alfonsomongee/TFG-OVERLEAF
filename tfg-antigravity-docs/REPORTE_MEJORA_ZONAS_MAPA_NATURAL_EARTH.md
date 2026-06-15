# Reporte de mejora de zonas del mapa Natural Earth

## Archivos modificados

- `src/components/AnimatedRestorationMap.jsx`
- `REPORTE_MEJORA_ZONAS_MAPA_NATURAL_EARTH.md`

## Cambios de zonas

- Sustituidas las zonas poligonales rectas por manchas SVG organicas basadas en curvas Bezier.
- Reducida la lectura de frontera administrativa: las zonas se presentan como areas funcionales de reposicion.
- Reorganizada la figura en seis areas principales: Galicia-Leon, Portugal, Norte/Euskadi, Cataluna/NE, Centro y Sur/Andalucia.
- Las areas siguen recortadas con el `clipPath` existente de Natural Earth para Espana, Portugal y Andorra.
- Anadida una nota metodologica dentro del SVG: las areas son aproximadas y no equivalen a fronteras administrativas.

## Cambios de interaccion

- Sustituido el rayado interno dominante por opacidad, borde y pulso breve.
- El hover ahora aumenta el grosor del contorno y activa un halo suave.
- Anadido un punto terminal discreto en el ancla visual de cada area restaurada.
- Las transiciones de zonas y etiquetas respetan `prefers-reduced-motion`.

## Limitaciones

- Los contornos son una simplificacion editorial, no una cartografia electrica oficial.
- No se ha modificado el dataset Natural Earth ni se han anadido dependencias.
- No se han tocado MDX, `custom.css`, paquetes ni otros componentes.

## Validacion

- `git diff --check`: pendiente.
- `npm run build`: pendiente.
