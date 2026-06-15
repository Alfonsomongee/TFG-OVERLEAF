# Reporte figura interactiva de interconexiones ibericas

## Archivos modificados

- `tfg-antigravity-docs/src/components/IberianInterconnectionsInteractiveFigure.jsx`
- `tfg-antigravity-docs/src/components/IberianInterconnectionsInteractiveFigure.module.css`
- `tfg-antigravity-docs/docs/02-contexto.mdx`

## Cambios de layout

- El layout pasa a priorizar el mapa con una relacion aproximada 66/34 frente al panel lateral.
- Se reduce el padding exterior del marco y el gap entre mapa y panel.
- El SVG usa un `viewBox` mas cerrado (`20 20 940 760`) para que la Peninsula Iberica ocupe mas superficie util sin deformar la geografia.
- La altura minima del mapa aumenta en desktop para dar mayor presencia cartografica.

## Cambios de interaccion

- Las interconexiones seleccionadas aumentan grosor, opacidad y halo suave.
- Se anade un pulso corto de seleccion, no continuo.
- Se incorporan puntos terminales para AC Pirineos, HVDC INELFE-1 y Marruecos, visibles y ampliados al seleccionar.
- El panel derecho cambia con una micro-animacion de entrada: fade y desplazamiento vertical breve.
- Se mantiene seleccion por hover/click en mapa y por botones accesibles con `aria-pressed`.

## Cambios en la leyenda

- La caja `Interconnection ratio` dentro del mapa se reduce en ancho, altura, tipografia y grosor visual.
- La leyenda sigue siendo interactiva, pero queda como elemento secundario frente a la cartografia y las interconexiones.

## Resultado de git diff --check

Correcto. Sin errores de whitespace. Solo avisos no bloqueantes de CRLF y permisos sobre `C:\Users\aphmo\.config\git\ignore`.

## Resultado de npm run build

Correcto. Build completada para `es`, `en`, `de` y `zh-Hans`.

Avisos no bloqueantes observados:

- CSS minimizer: `Missing font size`.
- Webpack cache: `Unable to snapshot resolve dependencies`.
- KaTeX/font metrics para el simbolo `€`.
- Docusaurus update check sin acceso a `C:\Users\aphmo\.config`.

## Observaciones visuales

- El mapa queda editorialmente mas protagonista que el panel tecnico.
- La seleccion de capa es mas perceptible sin caer en estetica de dashboard.
- El panel lateral queda mas compacto y deja respirar mejor la figura principal.
- La figura mantiene modo claro/oscuro mediante variables locales del CSS Module.
