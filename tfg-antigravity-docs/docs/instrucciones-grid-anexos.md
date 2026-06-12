# INSTRUCCIONES EXACTAS — APLICAR AnnexEvidenceGrid EN LOS 10 ANEXOS

Para cada archivo, usa `str_replace` (no scripts). Después de todos los cambios: `npm run build`.

---

## REGLA GENERAL

Añadir `import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';`
en la cabecera de cualquier MDX que no lo tenga todavía.
Luego envolver con `<AnnexEvidenceGrid>` los pares de figuras consecutivas indicados.

---

## ANEXO I — ya tiene el import. Añadir grids en secciones 3 y 4.

### Sección 3 — capacidad + chart-5 juntos

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
    <AnnexEvidence type="chart" id="chart-5" level={3} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
      <AnnexEvidence type="chart" id="chart-5" level={3} />
    </AnnexEvidenceGrid>
```

### Sección 4 — las dos figuras contextuales de transición

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
    Durante la re-energización posterior al colapso, las fuentes IBR quedaron excluidas hasta verificar niveles mínimos de Scc e inercia, evidenciando que la reposición dependía inicialmente de generación síncrona e importaciones.
    <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
      <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
    </AnnexEvidenceGrid>
    <p>La comparación 2010-2024 muestra la transformación estructural. Durante la re-energización, las fuentes IBR quedaron excluidas hasta verificar niveles mínimos de Scc e inercia.</p>
```

---

## ANEXO II — `anexo-estabilidad-dinamica-tension.mdx`

Añadir import si no está:
```
import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';
```

### Sección 1 — los dos precursores juntos

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
    <p>La proximidad del punto operativo al nariz de la curva Q-V es la evidencia más directa de que el sistema estaba al borde del colapso de tensión.</p>
    <p>El 22 de abril de 2025 se registró un evento precursor de sobretensión en la misma zona del sur peninsular.</p>
    <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
      <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
    </AnnexEvidenceGrid>
    <p>Las curvas Q-V muestran la proximidad al colapso de tensión. El evento del 22 de abril — seis días antes del colapso — evidencia una vulnerabilidad sostenida, no un evento aislado.</p>
```

### Sección 1 — frequency_voltage_carmona junto a nunez_balboa

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
```

Si está seguido de tablas y luego por el AnnexEvidenceLead, dejarlo como está.
Si está seguido de `frequency_voltage_carmona`, envolver ambos en grid:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
      <AnnexEvidence type="figure" id="frequency_voltage_carmona" level={1} />
    </AnnexEvidenceGrid>
```

### Sección 3 — balance reactiva: dos figuras

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
```
Si va seguido de `mapas_termicos_tension_ree`, envolver ambos:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
      <AnnexEvidence type="figure" id="mapas_termicos_tension_ree" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANEXO III — `anexo-cascada-protecciones-desconexiones.mdx`

Añadir import si no está.

### Fase 1 — tap_lag + aluvion juntos

Buscar exactamente:
```
    <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
    <p>Este mecanismo es un factor clave para entender por qué el operador no vio la sobretensión hasta que los inversores comenzaron a desconectarse.</p>
    <p>El aluvión de alertas de sobretensión registradas en la zona sur documenta la rapidez con que se expandió la perturbación por las líneas de 400 kV.</p>
    <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
      <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
    </AnnexEvidenceGrid>
    <p>El desacoplamiento Tap-Lag amplificó las sobretensiones en la red colectora, haciéndolas invisibles al SCADA de REE. El aluvión de alertas en el sur documenta la rapidez de la expansión.</p>
```

### Fase 2 — cascada + albustami

Nota: `cascada_desconexiones` puede estar dentro de un `AnnexEvidenceLead`. Si es así, solo aplicar el grid a `albustami_ieee39_secuencia` con la siguiente figura disponible, o dejarlo solo si no hay pareja lógica.

Si `cascada_desconexiones` NO está en AnnexEvidenceLead, buscar:
```
    <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
    <p>La velocidad de la propagación — 11 segundos — superó la capacidad de respuesta de los mecanismos automáticos de defensa.</p>
    <p>El estudio de estabilidad transitoria en la red equivalente IEEE 39 nudos muestra cómo las desconexiones sucesivas de generadores provocan oscilaciones dinámicas severas.</p>
    <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
      <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
    </AnnexEvidenceGrid>
    <p>La propagación geográfica en 11 segundos superó la capacidad de respuesta de los mecanismos automáticos. El estudio IEEE 39 muestra cómo las desconexiones sucesivas generan oscilaciones severas.</p>
```

---

## ANEXO IV — `anexo-interconexiones-flujos.mdx`

Añadir import si no está.

### Sección 1 — interconexion_francia + perdida_sincronismo

Si ambas figuras van seguidas (y `interconexion_francia_colapso` no está ya en AnnexEvidenceLead):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
    </AnnexEvidenceGrid>
```

Si `entsoe_flow_deviation` está en AnnexEvidenceLead y `interconexion_francia_colapso` va sola después, envolver con `perdida_sincronismo_frontera`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
    </AnnexEvidenceGrid>
```

### Sección 4 — evolucion_carga + timeline

Buscar:
```
    <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
```
Si va seguido de `timeline-light`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
      <AnnexEvidence type="figure" id="timeline-light" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANEXO V — `anexo-mercado-costes.mdx`

Añadir import si no está.

### Sección 3 — coste_optimo_ers + ers_revenue_stacking

Si ambas van seguidas (y `coste_optimo_ers` no está en AnnexEvidenceLead):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="coste_optimo_ers" level={3} />
      <AnnexEvidence type="figure" id="ers_revenue_stacking" level={3} />
    </AnnexEvidenceGrid>
```

Si `coste_optimo_ers` está en AnnexEvidenceLead, buscar `ers_revenue_stacking` y añadir texto de introducción antes.

---

## ANEXO VI — `anexo-reposicion-blackstart.mdx`

Añadir import si no está.

### Sección 1 — black_start + islas_reposicion

Buscar:
```
    <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
```
Si va seguido de `islas_reposicion_entsoe`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
      <AnnexEvidence type="figure" id="islas_reposicion_entsoe" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANEXO VII — `anexo-impacto-resiliencia.mdx`

Añadir import si no está.
No hay pares de figuras estáticas consecutivas. Sin cambios de grid.

---

## ANEXO VIII — `anexo-comunicacion-fuentes.mdx`

Añadir import si no está.

### Sección 1 — conservador + progresista

Buscar:
```
    <AnnexEvidence type="figure" id="collage_conservador" level={2} />
    <AnnexEvidence type="figure" id="collage_progresista" level={2} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_conservador" level={2} />
      <AnnexEvidence type="figure" id="collage_progresista" level={2} />
    </AnnexEvidenceGrid>
```

### Sección 2 — ciudadanos + politicos

Buscar:
```
    <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
    <AnnexEvidence type="figure" id="collage_politicos" level={2} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
      <AnnexEvidence type="figure" id="collage_politicos" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANEXO IX — `anexo-metodologia-modelos-datos-vivos.mdx`

Añadir import si no está.

### Sección 1 — scr_iberia + po74_banda_muerta

Buscar:
```
    <AnnexEvidence type="figure" id="scr_iberia" level={2} />
    <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="scr_iberia" level={2} />
      <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
    </AnnexEvidenceGrid>
```

### Sección 2 — gfl_vs_gfm + hitachi_hybrid

Buscar:
```
    <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
    <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
```

Reemplazar por:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
      <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANEXO X — `anexo-ecuaciones-matematicas.mdx`

Sin figuras estáticas. Sin cambios de grid.

---

## VALIDACIÓN FINAL

Después de todos los str_replace, ejecutar:

```bash
node -e "
const fs = require('fs');
const files = fs.readdirSync('docs').filter(f => f.startsWith('anexo-') && f.endsWith('.mdx'));
files.forEach(f => {
  const c = fs.readFileSync('docs/' + f, 'utf8');
  const grids = (c.match(/<AnnexEvidenceGrid>/g)||[]).length;
  const leads = (c.match(/AnnexEvidenceLead\s*\n?\s*eyebrow=/g)||[]).length;
  if (grids > 0 || leads > 0)
    console.log(f.replace('anexo-','').replace('.mdx','') + ' | grids: ' + grids + ' | leads: ' + leads);
});
"
```

Después `npm run build`.
