# PROMPT PARA CLAUDE CODE — TRES FIXES VISUALES

## REGLAS
1. Lee cada archivo completo antes de editar.
2. Build tras cada tarea: `npm run build -- --locale es`
3. Un commit por tarea.

---

## TAREA 1 — TapLagSequence.jsx: ampliar SVG y redistribuir espacio

**Problema:** El viewBox es `640×340` pero el contenido real llega hasta y≈430
(nota inferior en y=295-325, cascada en y=213, gauges hasta y=270).
Los textos de 7-9px se pisan entre sí y con los elementos adyacentes.

**Archivo:** `src/components/TapLagSequence.jsx`

### Cambios en DiagramSVG

**1a. Cambiar las dimensiones del SVG:**
```jsx
// ANTES:
const W = 640, H = 340;

// DESPUÉS:
const W = 760, H = 480;
```

**1b. Actualizar el viewBox:**
```jsx
// ANTES:
viewBox={`0 0 ${W} ${H}`}

// DESPUÉS:
viewBox={`0 0 ${W} ${H}`}
// (automático al cambiar W y H, no tocar)
```

**1c. Redistribuir las secciones horizontalmente:**
El SVG tiene tres zonas: izquierda (400kV), centro (transformador), derecha (220kV).
Con W=760, hay 120px extra. Aplicar estos offsets en TODAS las coordenadas x:

| Zona | Offset actual | Offset nuevo | Desplazamiento |
|------|--------------|--------------|----------------|
| Sección izquierda (400kV) | x≈20-210 | x≈20-210 | sin cambio |
| Transformador OLTC | x≈215-295 | x≈265-355 | +50px |
| Sección derecha (220kV) | x≈320-530 | x≈390-610 | +70px |
| Gauge izquierdo | x≈20-56 | sin cambio | sin cambio |
| Gauge derecho | x≈590-624 | x≈700-738 | +110px |
| Nota inferior | x≈60-590 | x≈20-740 | expandir |
| Cascada (paso 5) | x≈60-590, center=325 | x≈20-740, center=380 | expandir |

**Instrucciones de edición precisas — busca y reemplaza estas coordenadas:**

```
// Transformador OLTC — mover +50px en X:
rect x="215" → rect x="265"
rect x="215" y="100" width="80" → rect x="265" y="100" width="90"
text x="255" (etiquetas TR/OLTC) → text x="310"
rect x="235" y="140" (indicador toma) → rect x="285" y="140"
text x="255" y="153" (Toma) → text x="310" y="153"
line x1="255" ... x2="255" (aguja) → line x1="310" ... x2="310"
circle cx="255" → circle cx="310"
rect x="220" y="196" width="70" (ANSI59) → rect x="270" y="196" width="80"
text x="255" y="209" (⚡ ANSI 59) → text x="310" y="209"

// Sección derecha (220kV) — mover +70px en X:
text x="320" y="22" → text x="390" y="22"
rect x="320" y="35" width="180" → rect x="390" y="35" width="180"
rect x="320" y="35" (barra animada) → rect x="390" y="35"
text x="508" y="43" → text x="578" y="43"

// Plantas FV — ajustar el loop:
const x = 325 + i * 58  →  const x = 400 + i * 60

// Brecha de observabilidad:
rect x="215" y="55" width="290" → rect x="265" y="55" width="350"
text x="360" (ZONA CIEGA) → text x="440"
text x="360" (REE no observa) → text x="440"

// Gauge derecho:
text x="590" → text x="710"
rect x="612" y="170" → rect x="726" y="170"
rect x="612" y={...} → rect x="726" y={...}
line x1="608" ... x2="612" → line x1="722" ... x2="726"
text x="606" → text x="720"
line x1="608" y1={...} x2="624" (umbral ANSI59) → line x1="722" ... x2="738"

// Nota inferior — expandir:
rect x="60" y="295" width="530" height="36" → rect x="20" y="360" width="720" height="44"
text x="75" y="311" → text x="36" y="378"
text x="75" y="325" → text x="36" y="394"

// Cascada (paso 5) — expandir y bajar:
rect x="60" y="145" width="530" height="85" → rect x="40" y="145" width="680" height="95"
text x="325" y="175" → text x="380" y="178" fontSize="18"
text x="325" y="195" → text x="380" y="200" fontSize="12"
text x="325" y="213" → text x="380" y="217" fontSize="11"
```

**1d. Ajustar el voltaje visual — barras más altas:**
```jsx
// ANTES:
const bar400H = Math.round(step.v400 * 80);
const bar220H = Math.round(step.v220 * 80);
const oltcY = 155 - Math.round(step.oltcPos * 30);

// DESPUÉS:
const bar400H = Math.round(step.v400 * 100);
const bar220H = Math.round(step.v220 * 100);
const oltcY   = 170 - Math.round(step.oltcPos * 35);
```

Ajustar las referencias de los gauges para que usen la nueva altura:
```jsx
// gauge 400kV (los 4 valores en la variable map):
const y = 270 - Math.round(v * 80);
// → cambiar a:
const y = 290 - Math.round(v * 100);

// gauge altura de rect:
<rect x="20" y="170" width="12" height="100"
// → cambiar a:
<rect x="20" y="180" width="14" height="110"

// gauge fill rect:
<rect x="20" y={170 + 100 - bar400H}
// → cambiar a:
<rect x="20" y={180 + 110 - bar400H}

// ídem gauge 220kV
```

**1e. Aumentar tamaños de fuente:**
```jsx
// Títulos de sección (RED 400kV / RED 220kV):
fontSize="10" → fontSize="11"

// Valor p.u. de las barras:
fontSize="12" → fontSize="13"

// Etiquetas de plantas FV:
fontSize="7" → fontSize="9"

// Etiquetas de marcas en gauges:
fontSize="7" → fontSize="8"

// Nota inferior:
fontSize="9" → fontSize="10"
fontSize="8" → fontSize="9"
```

---

## TAREA 2 — StickyCollapse.jsx: corregir superposición con el contenido inferior

**Problema:** El sismógrafo sticky (`position: sticky, height: 65vh`) no se
detiene al final del scroll — sigue visible y tapa el contenido que viene
después del componente en el MDX.

**Causa:** El último Step tiene `margin: '45vh 0 0 0'` — solo margen superior,
sin margen inferior. Cuando el scroll llega al último paso, el panel sticky
sigue mostrándose porque el contenedor padre no tiene suficiente altura para
"empujarlo" fuera de la pantalla.

**Archivo:** `src/components/StickyCollapse.jsx`

### Fix 1 — Añadir margen inferior al último Step

```jsx
// BUSCAR (en el return del map de steps):
margin: i === steps.length - 1 ? '45vh 0 0 0' : '45vh 0',

// REEMPLAZAR POR:
margin: i === steps.length - 1 ? '45vh 0 80vh 0' : '45vh 0',
```

Esto añade 80vh de espacio después del último paso, dando al contenedor
suficiente altura para que el sticky salga de la pantalla antes de que
empiece el siguiente elemento del MDX.

### Fix 2 — Limitar la altura del contenedor sticky

```jsx
// BUSCAR el div del sismógrafo sticky (position: sticky):
<div style={{
  flex: 1,
  position: 'sticky',
  top: '80px',
  height: '65vh',
  zIndex: 10,
}}>

// REEMPLAZAR POR:
<div style={{
  flex: 1,
  position: 'sticky',
  top: '80px',
  height: '60vh',
  maxHeight: '520px',
  zIndex: 10,
  alignSelf: 'flex-start',
}}>
```

`alignSelf: 'flex-start'` es crítico — sin él, el elemento sticky en un
flexbox puede ignorar su propia altura y expandirse. Esto garantiza que
el sticky respeta su altura declarada.

### Fix 3 — Añadir padding-bottom al wrapper principal de ScrollyMode

```jsx
// BUSCAR el div externo de ScrollyMode:
<div style={{ position: 'relative', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

// REEMPLAZAR POR:
<div style={{
  position: 'relative',
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start',
  paddingBottom: '2rem',
}}>
```

---

## TAREA 3 — PVCurveSimulator: corregir clipping del nose point

**Problema:** Cuando el nose point está desplazado a la derecha (alta carga),
las etiquetas del punto de colapso y los valores numéricos se salen del
área visible del SVG/canvas.

**Primero, localiza el componente:**
```bash
find src -name "PVCurve*" -exec echo "=== {} ===" \; -exec cat {} \;
```

**Después de leerlo, aplica estos fixes:**

### Fix 3a — Si usa SVG con viewBox fijo

Busca el elemento `<svg viewBox="...">` del gráfico P-V.
Añade `overflow="visible"` al SVG:
```jsx
// BUSCAR:
<svg viewBox="0 0 W H" ...>

// REEMPLAZAR POR:
<svg viewBox="0 0 W H" overflow="visible" style={{ overflow: 'visible' }} ...>
```

Y envuelve el SVG en un div con `overflow: hidden` y padding suficiente:
```jsx
<div style={{
  padding: '0 40px 30px 10px',   // padding derecho e inferior para las etiquetas
  overflow: 'hidden',
}}>
  <svg viewBox="0 0 W H" overflow="visible" ...>
```

### Fix 3b — Si usa Recharts

Si el componente usa `<LineChart>` o `<ComposedChart>` de Recharts,
el problema es que el `margin` del gráfico no tiene suficiente espacio derecho.

Busca el `margin` del gráfico:
```jsx
// BUSCAR (valores aproximados):
margin={{ top: 20, right: 20, left: 10, bottom: 20 }}

// REEMPLAZAR POR:
margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
```

Y si hay un `<Tooltip>` o etiquetas de `<ReferenceDot>` que salen por la derecha,
añade `allowEscapeViewBox={{ x: true, y: false }}` al Tooltip:
```jsx
<Tooltip allowEscapeViewBox={{ x: true, y: false }} />
```

Para los `<ReferenceDot>` del nose point, ajusta la posición de la etiqueta:
```jsx
// BUSCAR el ReferenceDot del nose point (busca "nose" o el punto de máxima carga):
<ReferenceDot
  x={noseX}
  y={noseY}
  label={{ value: `Nose: ${noseX.toFixed(2)}`, position: 'right' }}
/>

// Si position='right' hace que salga, cambiar a:
<ReferenceDot
  x={noseX}
  y={noseY}
  label={{
    value: `Nose: ${noseX.toFixed(2)}`,
    position: noseX > 0.7 ? 'insideTopLeft' : 'right',
    offset: 10,
  }}
/>
```

### Fix 3c — Si usa D3 o canvas puro

Añade clipping condicional. Busca donde se dibuja el texto del nose point:
```jsx
// Calcular si el texto sale por la derecha:
const textX = xScale(noseX);
const svgWidth = /* ancho del SVG */;
const labelPosition = textX > svgWidth - 80 ? textX - 90 : textX + 10;

// Usar labelPosition en lugar de textX + offset fijo
```

---

## VERIFICACIÓN

```bash
npm run build -- --locale es
```

Verificación visual:
1. **TapLag**: los 5 pasos deben ser legibles sin textos superpuestos.
   El paso 5 (cascada) debe mostrar el texto completo sin cortes.
2. **StickyCollapse**: hacer scroll hasta el final del componente en
   /analisis-incidente — el sismógrafo debe desaparecer antes de que
   aparezca el texto siguiente, sin superposición.
3. **PVCurve**: mover el slider de carga al máximo — el nose point y
   sus etiquetas deben ser visibles dentro del área del gráfico.

## COMMITS

```bash
git add src/components/TapLagSequence.jsx
git commit -m "fix(taplag): expand SVG viewBox 640×340→760×480, redistribute sections"

git add src/components/StickyCollapse.jsx
git commit -m "fix(sticky): add bottom margin + alignSelf to prevent content overlap"

git add src/components/PVCurveSimulator*
git commit -m "fix(pvcurve): prevent nose point label clipping at high load values"

git push origin main
```
