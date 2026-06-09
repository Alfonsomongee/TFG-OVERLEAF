# AUDITORIA_NUMERACION_FIGURAS_TABLAS

## Convención detectada
La convención del proyecto asocia cada capítulo con una letra, y las figuras y tablas siguen una numeración incremental **independiente** por cada capítulo (ej: Figura A1, Tabla A1, Figura B1...). Todo `<figure>` debe tener su `<figcaption>` fuera de los componentes React, y los IDs deben seguir el formato `fig-<letra><numero>-slug` o `tabla-<letra><numero>-slug`.

## Mapa Capítulo → Letra (Basado en `sidebars.js`)
- **Capítulo A**: `docs/01-introduccion.mdx`
- **Capítulo B**: `docs/02-contexto.mdx`
- **Capítulo C**: `docs/03-analisis-incidente.mdx`
- **Capítulo D**: `docs/04-reaccion-reposicion.mdx`
- **Capítulo E**: `docs/05-analisis-informes.mdx`
- **Capítulo F**: `docs/06-impacto-comunicativo.mdx`
- **Capítulo G**: `docs/07b-consecuencias-financieras.mdx`
- **Capítulo H**: `docs/impacto-social.mdx`
- **Capítulo I**: `docs/07-resiliencia-futuro.mdx`
- **Capítulo J**: `docs/dimension-europea/01-francia-portugal.mdx`
- **Capítulo K**: `docs/dimension-europea/02-coordinacion-continental.mdx`
- **Capítulo L**: `docs/dimension-europea/03-dia-despues.mdx`
- **Capítulo M**: `docs/09-conclusiones.mdx`
- **Capítulo N**: `docs/08.5-actualizacion-2026.mdx`
- **Capítulo O**: `docs/08-uso-ia.mdx`

## Inventario de Figuras (Problemas y Propuestas)

| Archivo | Actual | Propuesto | ID Actual | ID Propuesto |
|---|---|---|---|---|
| `docs/03-analisis-incidente.mdx` | C1 | C1 | N/A (Markdown) | N/A |
| `docs/03-analisis-incidente.mdx` | C2 | C2 | N/A (Markdown) | N/A |
| `docs/07b-consecuencias-financieras.mdx` | F1 | G1 | N/A (Markdown) | N/A |
| `docs/07b-consecuencias-financieras.mdx` | F2 | G2 | N/A (Markdown) | N/A |
| `docs/07b-consecuencias-financieras.mdx` | F3 | G3 | N/A (Markdown) | N/A |
| `docs/07b-consecuencias-financieras.mdx` | F4 | G4 | N/A (Markdown) | N/A |
| `docs/07b-consecuencias-financieras.mdx` | F5 | G5 | N/A (Markdown) | N/A |
| `docs/impacto-social.mdx` | G1 | H1 | N/A (Markdown) | N/A |
| `docs/impacto-social.mdx` | G2 | H2 | N/A (Markdown) | N/A |
| `docs/dimension-europea/02-coordinacion-continental.mdx` | K1 | K1 | `fig-k1-cronologia-eas-sam` | `fig-k1-cronologia-eas-sam` |
| `docs/dimension-europea/02-coordinacion-continental.mdx` | K2 | K2 | `fig-k2-arquitectura-mando-continental` | `fig-k2-arquitectura-mando-continental` |
| `docs/dimension-europea/02-coordinacion-continental.mdx` | K3 | K3 | `fig-k3-fallo-estructural-eas` | `fig-k3-fallo-estructural-eas` |
| `docs/dimension-europea/03-dia-despues.mdx` | - | L1 | `fig-dia-despues-lole` | `fig-l1-lole` |
| `docs/dimension-europea/03-dia-despues.mdx` | - | L2 | `fig-dia-despues-picasso` | `fig-l2-picasso` |
| `docs/dimension-europea/03-dia-despues.mdx` | - | L3 | `fig-dia-despues-mrscr` | `fig-l3-mrscr` |
| `docs/09-conclusiones.mdx` | C1 | M1 | `fig-conclusiones-consenso` | `fig-m1-consenso` |
| `docs/09-conclusiones.mdx` | C2 | M2 | `fig-conclusiones-shift` | `fig-m2-shift` |
| `docs/09-conclusiones.mdx` | C3 | M3 | `fig-conclusiones-trilemma` | `fig-m3-trilemma` |
| `docs/09-conclusiones.mdx` | C4 | M4 | `fig-conclusiones-roadmap` | `fig-m4-roadmap` |
| `docs/09-conclusiones.mdx` | C5 | M5 | `fig-conclusiones-agenda` | `fig-m5-agenda` |
| `docs/08.5-actualizacion-2026.mdx` | J1 | N1 | `fig-2026-thenvsnow` | `fig-n1-thenvsnow` |
| `docs/08.5-actualizacion-2026.mdx` | J2 | N2 | `fig-2026-overvoltage` | `fig-n2-overvoltage` |
| `docs/08.5-actualizacion-2026.mdx` | J3 | N3 | `fig-2026-cnmc` | `fig-n3-cnmc` |
| `docs/08.5-actualizacion-2026.mdx` | J4 | N4 | `fig-2026-po74` | `fig-n4-po74` |
| `docs/08.5-actualizacion-2026.mdx` | J5 | N5 | `fig-2026-bess` | `fig-n5-bess` |

*Nota: Todas las figuras markdown (ej. `_Figura F1..._`) se dejarán como markdown puro si no usaban un componente, pero se renumerarán para ajustar a la letra del capítulo.*

## Inventario de Tablas (Problemas y Propuestas)

| Archivo | Actual | Propuesto | Título Original |
|---|---|---|---|
| `docs/01-introduccion.mdx` | A1 | A1 | TABLA A1 | GRID INTERCONNECTION SNAPSHOT |
| `docs/04-reaccion-reposicion.mdx` | D1 | D1 | Tabla D1 — Cronología operativa de la reposición peninsular |
| `docs/05-analisis-informes.mdx` | E1 a E6 | E1 a E6 | TABLA E1 a E6 (Correctas) |
| `docs/06-impacto-comunicativo.mdx` | F1 a F2 | F1 a F2 | TABLA F1 a F2 (Correctas) |
| `docs/07b-consecuencias-financieras.mdx` | F3 a F5 | G1 a G3 | TABLA F3 a F5 -> TABLA G1 a G3 |
| `docs/impacto-social.mdx` | G1 a G5 | H1 a H5 | TABLA G1 a G5 -> TABLA H1 a H5 |
| `docs/07-resiliencia-futuro.mdx` | H1 a H5 | I1 a I5 | TABLA H1 a H5 -> TABLA I1 a I5 |
| `docs/dimension-europea/01-francia-portugal.mdx` | B1 a B2 | J1 a J2 | TABLA B1 a B2 -> TABLA J1 a J2 |
| `docs/dimension-europea/02-coordinacion-continental.mdx` | B3 | K1 | TABLA B3 -> TABLA K1 |
| `docs/dimension-europea/03-dia-despues.mdx` | B4 | L1 | TABLA B4 -> TABLA L1 |
| `docs/08-uso-ia.mdx` | I1 a I2 | O1 a O2 | TABLA I1 a I2 -> TABLA O1 a O2 |

## Referencias Cruzadas a Actualizar

Hay referencias residuales globales como `Tabla 15` o `Tabla 16` apuntando a los Anexos en el capítulo 10 (`docs/10-resumen-de-cifras.mdx`). Sin embargo, el usuario indicó que estas son páginas auxiliares y no se deben mezclar automáticamente ("rutas temporales, no las mezcles"). No obstante, estas referencias *no* están rotas, apuntan a `/anexo-tablas`. Se dejarán intactas a menos que el usuario pida incluirlas en la estandarización, ya que los Anexos no usan letras A-O en `sidebars.js`.

No se encontraron otras referencias cruzadas internas erróneas a "Figura X" (tipo anchor `[Figura X](#fig-x)`) en los textos principales auditados, salvo las propias menciones de la leyenda que se van a renumerar juntas.

## Decisiones pendientes / Advertencias

1. **Desplazamiento del Alfabeto**: Al auditar `sidebars.js` (Fase 1), el orden narrativo real introduce capítulos que antes tenían otra letra. Por ejemplo, `07-resiliencia-futuro.mdx` ahora es el capítulo I, pero tenía tablas marcadas como `H1-H5`. `impacto-social.mdx` ahora es el H, pero tenía tablas `G1-G5`. Esto causa un "arrastre" general. El mapa canónico propuesto resuelve esto asignando estrictamente 1 letra a 1 archivo de capítulo.
2. **Componentes sin número explícito**: `03-dia-despues.mdx` y otros capítulos tienen `<figure id="...">` pero no tenían número en la leyenda ("Figura X"). Les aplicaré su número (L1, L2...).
3. **Anexos y Tablas Especiales**: Textos auxiliares como `10-resumen-de-cifras.mdx` tienen referencias como "Tabla 15". Como indicaste que son páginas anexas/especiales, no les he asignado letra. Si hay que renumerarlas a "Tabla Anexo-1", avísame.
4. **Pies de componentes React**: El script verificó que los componentes en `src/components/` ya no tienen `figcaption` (o ya han sido removidos en su mayoría), todos los `figcaption` relevantes están en el MDX.

## Cambios Aplicados

Ninguno todavía. **Esperando validación del usuario.**
