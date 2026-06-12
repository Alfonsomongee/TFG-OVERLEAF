# EXACT INSTRUCTIONS — APPLY AnnexEvidenceGrid IN THE 10 ANNEXES

For each file, use `str_replace` (no scripts). After all changes: `npm run build`.

---

## GENERAL RULE

Add `import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';`
at the top of any MDX that does not already have it.
Then wrap with `<AnnexEvidenceGrid>` the indicated consecutive figure pairs.

---

## ANNEX I — already has the import. Add grids in sections 3 and 4.

### Section 3 — capacity + chart-5 together

Search exactly for:
```
    <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
    <AnnexEvidence type="chart" id="chart-5" level={3} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
      <AnnexEvidence type="chart" id="chart-5" level={3} />
    </AnnexEvidenceGrid>
```

### Section 4 — the two contextual transition figures

Search exactly for:
```
    <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
    During the re-energization after the collapse, IBR sources were excluded until verifying minimum Scc and inertia levels, showing that restoration initially depended on synchronous generation and imports.
    <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
      <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
    </AnnexEvidenceGrid>
    <p>The 2010-2024 comparison shows the structural transformation. During re-energization, IBR sources were excluded until verifying minimum Scc and inertia levels.</p>
```

---

## ANNEX II — `anexo-estabilidad-dinamica-tension.mdx`

Add import if not present:
```
import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';
```

### Section 1 — the two precursors together

Search exactly for:
```
    <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
    <p>The proximity of the operating point to the nose of the Q-V curve is the most direct evidence that the system was on the verge of voltage collapse.</p>
    <p>On April 22, 2025, a precursor overvoltage event was recorded in the same southern peninsular area.</p>
    <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
      <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
    </AnnexEvidenceGrid>
    <p>The Q-V curves show the proximity to voltage collapse. The April 22 event — six days before the collapse — evidences sustained vulnerability, not an isolated event.</p>
```

### Section 1 — frequency_voltage_carmona next to nunez_balboa

Search exactly for:
```
    <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
```

If followed by tables and then by AnnexEvidenceLead, leave as is.
If followed by `frequency_voltage_carmona`, wrap both in grid:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
      <AnnexEvidence type="figure" id="frequency_voltage_carmona" level={1} />
    </AnnexEvidenceGrid>
```

### Section 3 — reactive balance: two figures

Search exactly for:
```
    <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
```
If followed by `mapas_termicos_tension_ree`, wrap both:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
      <AnnexEvidence type="figure" id="mapas_termicos_tension_ree" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANNEX III — `anexo-cascada-protecciones-desconexiones.mdx`

Add import if not present.

### Phase 1 — tap_lag + aluvion together

Search exactly for:
```
    <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
    <p>This mechanism is a key factor in understanding why the operator did not see the overvoltage until the inverters began to disconnect.</p>
    <p>The flood of overvoltage alerts recorded in the southern area documents the speed with which the disturbance spread through the 400 kV lines.</p>
    <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
      <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
    </AnnexEvidenceGrid>
    <p>Tap-Lag decoupling amplified overvoltages in the collector network, making them invisible to REE's SCADA. The flood of alerts in the south documents the speed of the expansion.</p>
```

### Phase 2 — cascada + albustami

Note: `cascada_desconexiones` may be inside an `AnnexEvidenceLead`. If so, only apply the grid to `albustami_ieee39_secuencia` with the next available figure, or leave it alone if there is no logical pair.

If `cascada_desconexiones` is NOT in AnnexEvidenceLead, search for:
```
    <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
    <p>The speed of propagation — 11 seconds — exceeded the response capacity of automatic defense mechanisms.</p>
    <p>The transient stability study on the IEEE 39-bus equivalent network shows how successive generator disconnections cause severe dynamic oscillations.</p>
    <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
      <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
    </AnnexEvidenceGrid>
    <p>The geographic propagation in 11 seconds exceeded the response capacity of automatic mechanisms. The IEEE 39 study shows how successive disconnections generate severe oscillations.</p>
```

---

## ANNEX IV — `anexo-interconexiones-flujos.mdx`

Add import if not present.

### Section 1 — interconexion_francia + perdida_sincronismo

If both figures are consecutive (and `interconexion_francia_colapso` is not already in AnnexEvidenceLead):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
    </AnnexEvidenceGrid>
```

If `entsoe_flow_deviation` is in AnnexEvidenceLead and `interconexion_francia_colapso` appears alone afterwards, wrap with `perdida_sincronismo_frontera`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
    </AnnexEvidenceGrid>
```

### Section 4 — evolucion_carga + timeline

Search for:
```
    <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
```
If followed by `timeline-light`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
      <AnnexEvidence type="figure" id="timeline-light" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANNEX V — `anexo-mercado-costes.mdx`

Add import if not present.

### Section 3 — coste_optimo_ers + ers_revenue_stacking

If both are consecutive (and `coste_optimo_ers` is not in AnnexEvidenceLead):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="coste_optimo_ers" level={3} />
      <AnnexEvidence type="figure" id="ers_revenue_stacking" level={3} />
    </AnnexEvidenceGrid>
```

If `coste_optimo_ers` is in AnnexEvidenceLead, search for `ers_revenue_stacking` and add introductory text before.

---

## ANNEX VI — `anexo-reposicion-blackstart.mdx`

Add import if not present.

### Section 1 — black_start + islas_reposicion

Search for:
```
    <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
```
If followed by `islas_reposicion_entsoe`:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
      <AnnexEvidence type="figure" id="islas_reposicion_entsoe" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANNEX VII — `anexo-impacto-resiliencia.mdx`

Add import if not present.
No consecutive static figure pairs. No grid changes.

---

## ANNEX VIII — `anexo-comunicacion-fuentes.mdx`

Add import if not present.

### Section 1 — conservador + progresista

Search for:
```
    <AnnexEvidence type="figure" id="collage_conservador" level={2} />
    <AnnexEvidence type="figure" id="collage_progresista" level={2} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_conservador" level={2} />
      <AnnexEvidence type="figure" id="collage_progresista" level={2} />
    </AnnexEvidenceGrid>
```

### Section 2 — ciudadanos + politicos

Search for:
```
    <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
    <AnnexEvidence type="figure" id="collage_politicos" level={2} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
      <AnnexEvidence type="figure" id="collage_politicos" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANNEX IX — `anexo-metodologia-modelos-datos-vivos.mdx`

Add import if not present.

### Section 1 — scr_iberia + po74_banda_muerta

Search for:
```
    <AnnexEvidence type="figure" id="scr_iberia" level={2} />
    <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="scr_iberia" level={2} />
      <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
    </AnnexEvidenceGrid>
```

### Section 2 — gfl_vs_gfm + hitachi_hybrid

Search for:
```
    <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
    <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
```

Replace with:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
      <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANNEX X — `anexo-ecuaciones-matematicas.mdx`

No static figures. No grid changes.

---

## FINAL VALIDATION

After all str_replace operations, run:

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

Then `npm run build`.