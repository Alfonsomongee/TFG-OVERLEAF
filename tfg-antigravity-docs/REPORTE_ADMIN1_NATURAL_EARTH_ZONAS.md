# Reporte Admin 1 Natural Earth para zonas funcionales

## 1. Recurso existente

- El recurso `ne_10m_admin_1_states_provinces` ya existia localmente.
- Zip: `data/cartography/natural-earth/raw/ne_10m_admin_1_states_provinces.zip`.
- Directorio descomprimido: `data/cartography/natural-earth/unzipped/ne_10m_admin_1_states_provinces/`.
- No se ha descargado ningun recurso adicional.

## 2. Recursos Natural Earth usados

- `ne_10m_admin_1_states_provinces`, Natural Earth 10m cultural vectors.
- El generador existente `scripts/build-natural-earth-iberia.js` se amplio para exportar un dataset Admin 1 con metadatos.

## 3. Metadatos exportados

Nuevo archivo: `src/data/cartography/naturalEarthIberiaAdmin1Paths.js`.

Cada feature exporta:

- `id`
- `source_id`
- `name`
- `name_en`
- `country`
- `iso_a2`
- `adm0_a3`
- `postal`
- `type`
- `type_en`
- `region`
- `region_code`
- `path`

## 4. Zonas funcionales construidas

- Galicia-Leon: `GA`, `CL`.
- Portugal: todos los Admin 1 con `iso_a2 = PT`.
- Norte / Euskadi: `PV`, `NA`, `CB`, `AS`, `LO`.
- Cataluna / NE: `CT`, `AR`.
- Centro: `MD`, `CM`.
- Sur / Andalucia: `AN`, `EX`.

## 5. Nivel territorial Natural Earth

- En Espana, Natural Earth usa provincias como geometria Admin 1, con `region` indicando la comunidad autonoma.
- En Portugal, Natural Earth usa distritos como geometria Admin 1, con `region` indicando regiones NUTS aproximadas.

## 6. Limitaciones de precision

- Las zonas siguen siendo funcionales y didacticas, no limites electricos oficiales.
- No se realiza union geometrica real entre provincias/distritos; se renderizan varios paths con el mismo color.
- El borde exterior de una zona compuesta no se disuelve perfectamente porque no se usa una operacion GIS de union.

## 7. Validacion

- `git diff --check`: falla por trailing whitespace preexistente en `src/components/TorraoSynchronousCompensatorFigure.jsx:54`, fuera del alcance de esta intervencion.
- `npm run build`: exitoso con `npm.cmd run build`; compila `es`, `en`, `de` y `zh-Hans`. Persisten warnings no bloqueantes de Docusaurus/CSS/font metrics y cache.
