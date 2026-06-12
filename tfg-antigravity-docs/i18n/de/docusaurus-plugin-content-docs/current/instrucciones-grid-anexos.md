# EXAKTE ANWEISUNGEN — AnnexEvidenceGrid IN ALLEN 10 ANHÄNGEN ANWENDEN

Für jede Datei `str_replace` verwenden (keine Skripte). Nach allen Änderungen: `npm run build`.

---

## ALLGEMEINE REGEL

`import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';`
in der Kopfzeile jedes MDX hinzufügen, das es noch nicht enthält.
Anschließend die angegebenen aufeinanderfolgenden Figurenpaare mit `<AnnexEvidenceGrid>` umschließen.

---

## ANHANG I — Import bereits vorhanden. Grids in den Abschnitten 3 und 4 hinzufügen.

### Abschnitt 3 — capacidad + chart-5 zusammen

Exakt suchen:
```
    <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
    <AnnexEvidence type="chart" id="chart-5" level={3} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="capacidad_instalada_2025" level={3} />
      <AnnexEvidence type="chart" id="chart-5" level={3} />
    </AnnexEvidenceGrid>
```

### Abschnitt 4 — die beiden kontextuellen Übergangsfiguren

Exakt suchen:
```
    <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
    Durante la re-energización posterior al colapso, las fuentes IBR quedaron excluidas hasta verificar niveles mínimos de Scc e inercia, evidenciando que la reposición dependía inicialmente de generación síncrona e importaciones.
    <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="mix_comparativo_2010_2024" level={3} />
      <AnnexEvidence type="figure" id="evolucion_mix_reenergizacion" level={3} />
    </AnnexEvidenceGrid>
    <p>Der Vergleich 2010–2024 zeigt den strukturellen Wandel. Während der Wiederinbetriebnahme nach dem Zusammenbruch wurden IBR-Quellen ausgeschlossen, bis Mindestniveaus von Scc und Trägheit überprüft waren.</p>
```

---

## ANHANG II — `anexo-estabilidad-dinamica-tension.mdx`

Import hinzufügen, falls nicht vorhanden:
```
import AnnexEvidenceGrid from '@site/src/components/annex/AnnexEvidenceGrid';
```

### Abschnitt 1 — die beiden Vorläufer zusammen

Exakt suchen:
```
    <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
    <p>La proximidad del punto operativo al nariz de la curva Q-V es la evidencia más directa de que el sistema estaba al borde del colapso de tensión.</p>
    <p>El 22 de abril de 2025 se registró un evento precursor de sobretensión en la misma zona del sur peninsular.</p>
    <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="fluctuaciones_tension_previas" level={1} />
      <AnnexEvidence type="figure" id="precursor_overvoltage_22april" level={1} />
    </AnnexEvidenceGrid>
    <p>Die Q-V-Kurven zeigen die Nähe zum Spannungskollaps. Das Ereignis vom 22. April – sechs Tage vor dem Zusammenbruch – belegt eine anhaltende Verwundbarkeit, kein isoliertes Ereignis.</p>
```

### Abschnitt 1 — frequency_voltage_carmona zusammen mit nunez_balboa

Exakt suchen:
```
    <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
```

Wenn es von Tabellen und dann von AnnexEvidenceLead gefolgt wird, unverändert lassen.
Wenn es von `frequency_voltage_carmona` gefolgt wird, beide in Grid umschließen:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="nunez_balboa_precursores" level={2} />
      <AnnexEvidence type="figure" id="frequency_voltage_carmona" level={1} />
    </AnnexEvidenceGrid>
```

### Abschnitt 3 — Blindleistungsbilanz: zwei Figuren

Exakt suchen:
```
    <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
```
Wenn es von `mapas_termicos_tension_ree` gefolgt wird, beide umschließen:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="asimetria_balance_reactiva_sur" level={2} />
      <AnnexEvidence type="figure" id="mapas_termicos_tension_ree" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANHANG III — `anexo-cascada-protecciones-desconexiones.mdx`

Import hinzufügen, falls nicht vorhanden.

### Phase 1 — tap_lag + aluvion zusammen

Exakt suchen:
```
    <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
    <p>Este mecanismo es un factor clave para entender por qué el operador no vio la sobretensión hasta que los inversores comenzaron a desconectarse.</p>
    <p>El aluvión de alertas de sobretensión registradas en la zona sur documenta la rapidez con que se expandió la perturbación por las líneas de 400 kV.</p>
    <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="tap_lag_decoupling" level={1} />
      <AnnexEvidence type="figure" id="aluvion_alertas_sobretension_sur" level={2} />
    </AnnexEvidenceGrid>
    <p>Die Tap-Lag-Entkopplung verstärkte die Überspannungen im Sammelnetz und machte sie für das SCADA von REE unsichtbar. Die Flut von Warnmeldungen im Süden dokumentiert die Geschwindigkeit der Ausbreitung.</p>
```

### Phase 2 — cascada + albustami

Hinweis: `cascada_desconexiones` kann sich innerhalb eines `AnnexEvidenceLead` befinden. Wenn ja, Grid nur auf `albustami_ieee39_secuencia` mit der nächsten verfügbaren Figur anwenden oder allein lassen, wenn es kein logisches Paar gibt.

Wenn `cascada_desconexiones` NICHT in AnnexEvidenceLead ist, suchen:
```
    <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
    <p>La velocidad de la propagación — 11 segundos — superó la capacidad de respuesta de los mecanismos automáticos de defensa.</p>
    <p>El estudio de estabilidad transitoria en la red equivalente IEEE 39 nudos muestra cómo las desconexiones sucesivas de generadores provocan oscilaciones dinámicas severas.</p>
    <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="cascada_desconexiones" level={1} />
      <AnnexEvidence type="figure" id="albustami_ieee39_secuencia" level={2} />
    </AnnexEvidenceGrid>
    <p>Die geografische Ausbreitung in 11 Sekunden überstieg die Reaktionsfähigkeit der automatischen Schutzmechanismen. Die IEEE-39-Studie zeigt, wie aufeinanderfolgende Generatorabschaltungen schwere Oszillationen verursachen.</p>
```

---

## ANHANG IV — `anexo-interconexiones-flujos.mdx`

Import hinzufügen, falls nicht vorhanden.

### Abschnitt 1 — interconexion_francia + perdida_sincronismo

Wenn beide Figuren aufeinander folgen (und `interconexion_francia_colapso` nicht bereits in AnnexEvidenceLead ist):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
    </AnnexEvidenceGrid>
```

Wenn `entsoe_flow_deviation` in AnnexEvidenceLead ist und `interconexion_francia_colapso` allein danach kommt, mit `perdida_sincronismo_frontera` umschließen:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="perdida_sincronismo_frontera" level={2} />
      <AnnexEvidence type="figure" id="interconexion_francia_colapso" level={1} />
    </AnnexEvidenceGrid>
```

### Abschnitt 4 — evolucion_carga + timeline

Suchen:
```
    <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
```
Wenn es von `timeline-light` gefolgt wird:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="evolucion_carga_repuesta_francia" level={1} />
      <AnnexEvidence type="figure" id="timeline-light" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANHANG V — `anexo-mercado-costes.mdx`

Import hinzufügen, falls nicht vorhanden.

### Abschnitt 3 — coste_optimo_ers + ers_revenue_stacking

Wenn beide aufeinander folgen (und `coste_optimo_ers` nicht in AnnexEvidenceLead ist):
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="coste_optimo_ers" level={3} />
      <AnnexEvidence type="figure" id="ers_revenue_stacking" level={3} />
    </AnnexEvidenceGrid>
```

Wenn `coste_optimo_ers` in AnnexEvidenceLead ist, `ers_revenue_stacking` suchen und Einleitungstext davor einfügen.

---

## ANHANG VI — `anexo-reposicion-blackstart.mdx`

Import hinzufügen, falls nicht vorhanden.

### Abschnitt 1 — black_start + islas_reposicion

Suchen:
```
    <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
```
Wenn es von `islas_reposicion_entsoe` gefolgt wird:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="black_start_hidroelectrico" level={2} />
      <AnnexEvidence type="figure" id="islas_reposicion_entsoe" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANHANG VII — `anexo-impacto-resiliencia.mdx`

Import hinzufügen, falls nicht vorhanden.
Keine aufeinanderfolgenden statischen Figurenpaare. Keine Grid-Änderungen.

---

## ANHANG VIII — `anexo-comunicacion-fuentes.mdx`

Import hinzufügen, falls nicht vorhanden.

### Abschnitt 1 — konservativ + progressiv

Suchen:
```
    <AnnexEvidence type="figure" id="collage_conservador" level={2} />
    <AnnexEvidence type="figure" id="collage_progresista" level={2} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_conservador" level={2} />
      <AnnexEvidence type="figure" id="collage_progresista" level={2} />
    </AnnexEvidenceGrid>
```

### Abschnitt 2 — Bürger + Politiker

Suchen:
```
    <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
    <AnnexEvidence type="figure" id="collage_politicos" level={2} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="collage_ciudadanos" level={2} />
      <AnnexEvidence type="figure" id="collage_politicos" level={2} />
    </AnnexEvidenceGrid>
```

---

## ANHANG IX — `anexo-metodologia-modelos-datos-vivos.mdx`

Import hinzufügen, falls nicht vorhanden.

### Abschnitt 1 — scr_iberia + po74_banda_muerta

Suchen:
```
    <AnnexEvidence type="figure" id="scr_iberia" level={2} />
    <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="scr_iberia" level={2} />
      <AnnexEvidence type="figure" id="po74_banda_muerta" level={2} />
    </AnnexEvidenceGrid>
```

### Abschnitt 2 — gfl_vs_gfm + hitachi_hybrid

Suchen:
```
    <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
    <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
```

Ersetzen durch:
```
    <AnnexEvidenceGrid>
      <AnnexEvidence type="figure" id="gfl_vs_gfm_circuit1" level={2} />
      <AnnexEvidence type="figure" id="hitachi_hybrid" level={3} />
    </AnnexEvidenceGrid>
```

---

## ANHANG X — `anexo-ecuaciones-matematicas.mdx`

Keine statischen Figuren. Keine Grid-Änderungen.

---

## ABSCHLIESSENDE VALIDIERUNG

Nach allen str_replace-Operationen ausführen:

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

Danach `npm run build`.