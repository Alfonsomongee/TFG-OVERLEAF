

--- FILE: static/data/processed/forensic_categories_en.json ---
```json
{
  "categories": [
    {
      "id": "structural-context",
      "name": "Structural Context and Market",
      "icon": "🏭",
      "color": "hsl(200 80% 60%)",
      "tables": [
        {
          "id": "mix-generacion-12-30",
          "name": "Generation mix in the Spanish peninsular electrical system at 12:30 CEST on 28-A-2025",
          "source": "Comité 28-A (Informe no confidencial, p. 38); REE Press Office; ENTSO-E Factual Report",
          "type": "table",
          "columns": [
            {
              "key": "tecnologia",
              "label": "Technology"
            },
            {
              "key": "porcentaje_mix",
              "label": "% of mix"
            },
            {
              "key": "mw_estimados",
              "label": "Estimated MW"
            },
            {
              "key": "notas",
              "label": "Notes"
            }
          ],
          "data": [
            {
              "tecnologia": "Solar photovoltaic",
              "porcentaje_mix": "≈53–59%",
              "mw_estimados": "18.068",
              "notas": "REE: 53.34% of the peninsular mix"
            },
            {
              "tecnologia": "Wind",
              "porcentaje_mix": "≈12%",
              "mw_estimados": "~3,020",
              "notas": "Distributed in N and S"
            },
            {
              "tecnologia": "Nuclear",
              "porcentaje_mix": "10%",
              "mw_estimados": "~2,518",
              "notas": "4 reactors coupled out of 7 installed"
            },
            {
              "tecnologia": "Hydraulic (includes run-of-river)",
              "porcentaje_mix": "≈8%",
              "mw_estimados": "~2,015",
              "notas": "Without pumped storage turbine operation"
            },
            {
              "tecnologia": "Combined cycle (CCGT)",
              "porcentaje_mix": "3% (~4.82% REE)",
              "mw_estimados": "1.635",
              "notas": "6 units coupled out of 21 available"
            },
            {
              "tecnologia": "Cogeneration + waste",
              "porcentaje_mix": "4%",
              "mw_estimados": "~1,007",
              "notas": "RCR subject to RD 413/2014"
            },
            {
              "tecnologia": "Coal",
              "porcentaje_mix": "1%",
              "mw_estimados": "~252",
              "notas": "1 group out of 5 coupled"
            },
            {
              "tecnologia": "Total demand",
              "porcentaje_mix": "100%",
              "mw_estimados": "25,184 MW",
              "notas": "56% of historical peak"
            }
          ],
          "note": "This snapshot shows the classic low-demand scenario with inverter-renewable dominance that triggered voltage control alerts. Only 18% was synchronous generation, with barely 11 conventional units connected (minimum of 2025).",
          "tema": "T1"
        },
        {
          "id": "indisponibilidad-generacion-convencional",
          "name": "Unavailability of conventional generation by technology, April 28, 2025",
          "source": "Informe de Restricciones Técnicas REE (cifras propias) vs Informe Comité 28-A (Tabla 1, p. 20)",
          "type": "table",
          "columns": [
            {
              "key": "tecnologia",
              "label": "Technology"
            },
            {
              "key": "mw_indisponibles_ree",
              "label": "Unavailable MW (REE)"
            },
            {
              "key": "mw_indisponibles_comite",
              "label": "Unavailable MW (Committee)"
            },
            {
              "key": "mw_instalados",
              "label": "Installed MW"
            },
            {
              "key": "porcentaje_indisponible",
              "label": "% Unavailable (Committee)"
            }
          ],
          "data": [
            {
              "tecnologia": "CCGT",
              "mw_indisponibles_ree": "9,436.4",
              "mw_indisponibles_comite": "7,426.3",
              "mw_instalados": "24.562",
              "porcentaje_indisponible": "30.2%"
            },
            {
              "tecnologia": "Nuclear",
              "mw_indisponibles_ree": "4,096.2",
              "mw_indisponibles_comite": "3,078.6",
              "mw_instalados": "7.117",
              "porcentaje_indisponible": "43.3%"
            },
            {
              "tecnologia": "Pumped storage (turbine operation)",
              "mw_indisponibles_ree": "1,392.1",
              "mw_indisponibles_comite": "1,392.1",
              "mw_instalados": "3.331",
              "porcentaje_indisponible": "41.8%"
            },
            {
              "tecnologia": "Coal",
              "mw_indisponibles_ree": "903.5",
              "mw_indisponibles_comite": "903.5",
              "mw_instalados": "1.820",
              "porcentaje_indisponible": "49.6%"
            },
            {
              "tecnologia": "Fuel-gas",
              "mw_indisponibles_ree": "0.0",
              "mw_indisponibles_comite": "0.0",
              "mw_instalados": "8",
              "porcentaje_indisponible": "0%"
            },
            {
              "tecnologia": "TOTAL",
              "mw_indisponibles_ree": "15.829",
              "mw_indisponibles_comite": "12.800",
              "mw_instalados": "36.838",
              "porcentaje_indisponible": "34.7%"
            }
          ],
          "note": "The discrepancy of 3,028 MW between REE and the Government fuels the debate on whether the system operator had sufficient synchronous capacity. Compass Lexecon/INESC TEC highlights that between 08:00 and 10:00 CET REE disconnected 15 CCGTs.",
          "tema": "T1"
        },
        {
          "id": "inercia-sistema-htot",
          "name": "System inertia H_tot on 28-A (seconds)",
          "source": "ENTSO-E Factual Report p. 36; REE 18-jun-2025 p. 11",
          "type": "table",
          "columns": [
            {
              "key": "metrica",
              "label": "Metric"
            },
            {
              "key": "valor",
              "label": "Value"
            },
            {
              "key": "comentario",
              "label": "Comment"
            }
          ],
          "data": [
            {
              "metrica": "H_tot Iberia pre-cascade",
              "valor": "2.21–2.71 s",
              "comentario": "Band reported by ENTSO-E"
            },
            {
              "metrica": "ENTSO-E minimum recommendation",
              "valor": "2.0 s",
              "comentario": "Met margin"
            },
            {
              "metrica": "ENTSO-E Final Report conclusion",
              "valor": "\"Greater inertia would not have prevented loss of synchronism\"",
              "comentario": "March 2026"
            }
          ],
          "note": "Confirms that inertia, although low, was NOT the root cause; the problem was voltage control, not inertial RoCoF.",
          "tema": "T2"
        },
        {
          "id": "precios-marginales-omie",
          "name": "Hourly marginal prices OMIE 28-A vs 29-A 2025 (Spain, €/MWh)",
          "source": "OMIE Mercado Diario; Infobae; OCU; Grupo ASE",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "Hour"
            },
            {
              "key": "precio_28a",
              "label": "28-A Spain €/MWh"
            },
            {
              "key": "precio_29a",
              "label": "29-A Spain €/MWh"
            },
            {
              "key": "observacion",
              "label": "Observation"
            }
          ],
          "data": [
            {
              "hora": "10–11",
              "precio_28a": "~0",
              "precio_29a": "0.00",
              "observacion": "Price near 0"
            },
            {
              "hora": "11–12",
              "precio_28a": "~0",
              "precio_29a": "-0.30",
              "observacion": ""
            },
            {
              "hora": "12–13 (blackout)",
              "precio_28a": "~ -1 (negative)",
              "precio_29a": "-1.01",
              "observacion": "OMIE pre-blackout"
            },
            {
              "hora": "13–14",
              "precio_28a": "n/a",
              "precio_29a": "-1.90",
              "observacion": "Minimum of the 29th"
            },
            {
              "hora": "14–15",
              "precio_28a": "n/a",
              "precio_29a": "-1.66",
              "observacion": ""
            },
            {
              "hora": "18–19",
              "precio_28a": "n/a",
              "precio_29a": "0.00",
              "observacion": ""
            },
            {
              "hora": "Daily average price",
              "precio_28a": "26.81 (mid-April)",
              "precio_29a": "5.79",
              "observacion": "-68% vs 28"
            },
            {
              "hora": "30-A half",
              "precio_28a": "",
              "precio_29a": "31.87",
              "observacion": "+450% (adjustment services)"
            }
          ],
          "note": "The negative price during central hours evidences the context of renewable oversupply; after the blackout, balancing service costs skyrocketed.",
          "tema": "T5"
        },
        {
          "id": "programa-intercambios-pre-apagon",
          "name": "Pre-blackout international exchange program (MW, exporting)",
          "source": "ENTSO-E Expert Panel 9-may-2025; REE 18-jun-2025 p. 4",
          "type": "table",
          "columns": [
            {
              "key": "frontera",
              "label": "Border"
            },
            {
              "key": "mw_pre_apagon",
              "label": "Pre-blackout (MW)"
            },
            {
              "key": "sentido",
              "label": "Direction"
            },
            {
              "key": "mw_post_mitigacion",
              "label": "Post-mitigation 12:22"
            }
          ],
          "data": [
            {
              "frontera": "Spain → France (AC + HVDC)",
              "mw_pre_apagon": "3,000 (max ~5,000)",
              "sentido": "Export",
              "mw_post_mitigacion": "1,000 (HVDC) + AC ~0"
            },
            {
              "frontera": "HVDC Santa Llogaia–Baixas",
              "mw_pre_apagon": "1.000",
              "sentido": "Spain → France",
              "mw_post_mitigacion": "Maintained in PMODE1"
            },
            {
              "frontera": "Spain → Portugal",
              "mw_pre_apagon": "2.545",
              "sentido": "Export",
              "mw_post_mitigacion": "2,000 (reduction 545)"
            },
            {
              "frontera": "Spain → Morocco",
              "mw_pre_apagon": "800",
              "sentido": "Export",
              "mw_post_mitigacion": "800"
            }
          ],
          "note": "The operator's mitigations reduced flows to improve damping, but by decreasing currents, the lines consumed less reactive power, raising voltages — a critical side effect.",
          "tema": "T4"
        }
      ]
    },
    {
      "id": "oscillations-dynamics",
      "name": "Oscillations and Dynamic Stability",
      "icon": "📈",
      "color": "hsl(280 70% 60%)",
      "tables": [
        {
          "id": "modos-oscilatorios",
          "name": "Oscillatory modes identified before the collapse",
          "source": "REE pp. 3-5; ENTSO-E Factual Report p. 53; Comité 28-A pp. 31-34; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "CEST Time"
            },
            {
              "key": "frecuencia_hz",
              "label": "Frequency (Hz)"
            },
            {
              "key": "tipo",
              "label": "Type"
            },
            {
              "key": "amplitud_mhz",
              "label": "Amplitude (mHz)"
            },
            {
              "key": "damping",
              "label": "Initial → final damping"
            },
            {
              "key": "voltaje_pkp_kv",
              "label": "Peak-to-peak voltage at 400 kV"
            }
          ],
          "data": [
            {
              "hora": "10:30",
              "frecuencia_hz": "0.2",
              "tipo": "Inter-area W-C-E",
              "amplitud_mhz": "4 kV",
              "damping": "Normal",
              "voltaje_pkp_kv": "<1% Vnom"
            },
            {
              "hora": "11:03",
              "frecuencia_hz": "0.2",
              "tipo": "Inter-area",
              "amplitud_mhz": "7 kV",
              "damping": "Normal",
              "voltaje_pkp_kv": "~2% Vnom"
            },
            {
              "hora": "11:23",
              "frecuencia_hz": "0.2",
              "tipo": "Inter-area",
              "amplitud_mhz": "6 kV",
              "damping": "Normal",
              "voltaje_pkp_kv": "~1.5% Vnom"
            },
            {
              "hora": "12:03-12:08",
              "frecuencia_hz": "0.63 (forced)",
              "tipo": "Local IBR (Badajoz)",
              "amplitud_mhz": "70 mHz",
              "damping": "",
              "voltaje_pkp_kv": "30 kV (Almaraz 31.2; Arroyo SS 32.7)"
            },
            {
              "hora": "12:00",
              "frecuencia_hz": "0.21",
              "tipo": "Inter-area",
              "amplitud_mhz": "",
              "damping": "20% (normal)",
              "voltaje_pkp_kv": ""
            },
            {
              "hora": "During 12:03",
              "frecuencia_hz": "0.21",
              "tipo": "Inter-area (excited)",
              "amplitud_mhz": "",
              "damping": "drop to 5%",
              "voltaje_pkp_kv": ""
            },
            {
              "hora": "12:19-12:22",
              "frecuencia_hz": "0.21",
              "tipo": "Inter-area W-C-E",
              "amplitud_mhz": "200 mHz (3× previous)",
              "damping": "",
              "voltaje_pkp_kv": "23 kV pk-pk at Almaraz"
            }
          ],
          "note": "The forced oscillation at 0.63 Hz, possibly originating from a PV plant in Badajoz, was the trigger that activated the mitigation measures which paradoxically degraded voltage control.",
          "tema": "T2"
        },
        {
          "id": "evolucion-frecuencia-rocof",
          "name": "Frequency evolution and RoCoF during the 27 critical seconds",
          "source": "REE pp. 8-12; Comité 28-A pp. 41-58; Compass Lexecon ¶189",
          "type": "table",
          "columns": [
            {
              "key": "timestamp",
              "label": "Timestamp CEST"
            },
            {
              "key": "frecuencia_hz",
              "label": "f (Hz)"
            },
            {
              "key": "evento",
              "label": "Associated event"
            },
            {
              "key": "rocof_estimado",
              "label": "Estimated RoCoF"
            }
          ],
          "data": [
            {
              "timestamp": "12:32:57.140",
              "frecuencia_hz": "50.00",
              "evento": "Trip Granada (-355 MW)",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:16.460",
              "frecuencia_hz": "~49.98",
              "evento": "Trip Badajoz (-582 MW)",
              "rocof_estimado": "-55 mHz/event"
            },
            {
              "timestamp": "12:33:17.520",
              "frecuencia_hz": "~49.95",
              "evento": "Trip Badajoz PV (-145 MW)",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:17.780",
              "frecuencia_hz": "~49.87",
              "evento": "Trip Sevilla (-550 MW)",
              "rocof_estimado": "-75 mHz cumulative"
            },
            {
              "timestamp": "12:33:19.620",
              "frecuencia_hz": "~49.70",
              "evento": "Loss of synchronism initiated",
              "rocof_estimado": "Import F from 1000→3,807 MW"
            },
            {
              "timestamp": "12:33:20.180",
              "frecuencia_hz": "49.50",
              "evento": "UFLS pumping step 1",
              "rocof_estimado": "RoCoF accelerates"
            },
            {
              "timestamp": "12:33:20.500",
              "frecuencia_hz": "49.30",
              "evento": "UFLS pumping step 2",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:20.600",
              "frecuencia_hz": "49.00",
              "evento": "UFLS demand step 1",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:21.380",
              "frecuencia_hz": "48.40",
              "evento": "UFLS demand step 4",
              "rocof_estimado": ">1.0 Hz/s"
            },
            {
              "timestamp": "12:33:21.535",
              "frecuencia_hz": "48.458",
              "evento": "Opening Hernani 400 kV (separation F)",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:22.040",
              "frecuencia_hz": "48.00",
              "evento": "UFLS demand step 6 (final)",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:22.702",
              "frecuencia_hz": "47.79",
              "evento": "Trip CCGT Levante",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:23.515",
              "frecuencia_hz": "46.15",
              "evento": "Trip nuclear",
              "rocof_estimado": ">1.5 Hz/s"
            },
            {
              "timestamp": "12:33:23.590",
              "frecuencia_hz": "45.89",
              "evento": "Trip other nuclear units",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:23.960",
              "frecuencia_hz": "collapse",
              "evento": "HVDC blocked",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:24.0",
              "frecuencia_hz": "0",
              "evento": "Total collapse",
              "rocof_estimado": ""
            }
          ],
          "note": "The final frequency drop (>1.5 Hz/s) exceeds the standard RoCoF protection threshold for synchronous machines.",
          "tema": "T2"
        },
        {
          "id": "tensiones-nudos-criticos",
          "name": "Voltages at critical 400 kV nodes during the cascade (kV)",
          "source": "REE pp. 8-14; Comité 28-A pp. 89-96",
          "type": "table",
          "columns": [
            {
              "key": "subestacion",
              "label": "Substation / Province"
            },
            {
              "key": "v_pre_evento",
              "label": "Pre-event V (kV)"
            },
            {
              "key": "v_post_evento",
              "label": "Post-event V (kV)"
            },
            {
              "key": "v_lim_sup",
              "label": "Upper limit V (kV)"
            },
            {
              "key": "notas",
              "label": "Notes"
            }
          ],
          "data": [
            {
              "subestacion": "Granada 400 kV (E1, 12:32:57)",
              "v_pre_evento": "418.0",
              "v_post_evento": "423.9",
              "v_lim_sup": "435",
              "notas": "Collector 220 kV: 242.5 kV (1.10 pu) → trip transformer"
            },
            {
              "subestacion": "Olmedilla",
              "v_pre_evento": "413 (12:32:00)",
              "v_post_evento": "428 (12:32:57)",
              "v_lim_sup": "435",
              "notas": "+15 kV in 57 s"
            },
            {
              "subestacion": "Arroyo de San Serván",
              "v_pre_evento": "411",
              "v_post_evento": "424",
              "v_lim_sup": "435",
              "notas": "+13 kV"
            },
            {
              "subestacion": "Badajoz Sub B (E2, 12:33:16)",
              "v_pre_evento": "~430–435",
              "v_post_evento": "443",
              "v_lim_sup": "435",
              "notas": "Protection oscillography"
            },
            {
              "subestacion": "Almaraz 400 kV",
              "v_pre_evento": "395–410 (during osc.)",
              "v_post_evento": "",
              "v_lim_sup": "435",
              "notas": "During 0.21 Hz osc."
            },
            {
              "subestacion": "Cáceres 220 kV (E5)",
              "v_pre_evento": "",
              "v_post_evento": "240.89",
              "v_lim_sup": "253 (60 min)",
              "notas": "Trip due to internal over-V"
            },
            {
              "subestacion": "Seville 400 kV (E3)",
              "v_pre_evento": "",
              "v_post_evento": "437.91",
              "v_lim_sup": "435",
              "notas": "Pre-trip"
            },
            {
              "subestacion": "Valdecaballeros 400 kV",
              "v_pre_evento": "",
              "v_post_evento": ">480",
              "v_lim_sup": "440 (60 min) / 480 (transient)",
              "notas": "Trip of Valdecab.-Maguilla line"
            },
            {
              "subestacion": "Nuclear (pre-trip peak)",
              "v_pre_evento": "",
              "v_post_evento": "469.3",
              "v_lim_sup": "480",
              "notas": "Just before disconnection"
            }
          ],
          "note": "Refutes the 'widespread overvoltage exceeding limits' narrative: in transmission, voltages remained mostly within the 375-435 kV range; the failure was on the 220 kV/collector side.",
          "tema": "T2"
        },
        {
          "id": "hvdc-santa-llogaia-parametros",
          "name": "Santa Llogaia – Baixas HVDC link: operational parameters",
          "source": "REE p. 14; Comité 28-A p. 33; ENTSO-E Factual Report",
          "type": "table",
          "columns": [
            {
              "key": "parametro",
              "label": "Parameter"
            },
            {
              "key": "valor",
              "label": "Value / Status"
            },
            {
              "key": "observacion",
              "label": "Observation"
            }
          ],
          "data": [
            {
              "parametro": "Rated capacity",
              "valor": "2 × 1,000 MW (2 VSC poles)",
              "observacion": ""
            },
            {
              "parametro": "Pre-incident transferred power",
              "valor": "1,000 MW (Spain→France)",
              "observacion": "PMODE3 mode (AC-emulation)"
            },
            {
              "parametro": "Mode change",
              "valor": "PMODE3 → PMODE1 at 12:11",
              "observacion": "Setpoint 1,000 MW exporting"
            },
            {
              "parametro": "Behavior during cascade",
              "valor": "Maintained 1,000 MW exporting",
              "observacion": "Without power-frequency control function"
            },
            {
              "parametro": "HVDC blocking",
              "valor": "12:33:23.960",
              "observacion": "After Santa Llogaia collapse"
            },
            {
              "parametro": "Net effect",
              "valor": "+1,000 MW virtual deficit in Iberia",
              "observacion": "Accelerated frequency collapse"
            }
          ],
          "note": "Paradigmatic case of how an HVDC link without frequency response can worsen a collapse.",
          "tema": "T4"
        },
        {
          "id": "intercambios-internacionales-minuto",
          "name": "International exchanges minute by minute T-30 to T+30",
          "source": "ENTSO-E; REE; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "tiempo",
              "label": "Time (min relative to 12:33)"
            },
            {
              "key": "esp_fra_mw",
              "label": "Spain-France (MW)"
            },
            {
              "key": "esp_por_mw",
              "label": "Spain-Portugal (MW)"
            },
            {
              "key": "esp_mar_mw",
              "label": "Spain-Morocco (MW)"
            },
            {
              "key": "notas",
              "label": "Notes"
            }
          ],
          "data": [
            {
              "tiempo": "T-30 (12:03)",
              "esp_fra_mw": "+3,000 exp.",
              "esp_por_mw": "+2,545 exp.",
              "esp_mar_mw": "+800 exp.",
              "notas": "Pre-mitigation"
            },
            {
              "tiempo": "T-25 (12:08)",
              "esp_fra_mw": "+1,500 exp. (-800 reduction)",
              "esp_por_mw": "+2,545 exp.",
              "esp_mar_mw": "+800",
              "notas": "After E1 oscillation"
            },
            {
              "tiempo": "T-14 (12:19)",
              "esp_fra_mw": "+1,000 exp. (HVDC)",
              "esp_por_mw": "+2,545 exp.",
              "esp_mar_mw": "+800",
              "notas": "After E2 osc."
            },
            {
              "tiempo": "T-11 (12:22)",
              "esp_fra_mw": "+1,000 exp. (AC ~0)",
              "esp_por_mw": "+2,000 exp. (-545)",
              "esp_mar_mw": "+800",
              "notas": ""
            },
            {
              "tiempo": "T-0 (12:33:00)",
              "esp_fra_mw": "+1,000 exp. (HVDC) + 500 AC",
              "esp_por_mw": "+2,000 exp.",
              "esp_mar_mw": "+800",
              "notas": ""
            },
            {
              "tiempo": "T+0:19 (12:33:19)",
              "esp_fra_mw": "-3,807 imp. (max)",
              "esp_por_mw": "",
              "esp_mar_mw": "",
              "notas": "Import peak"
            },
            {
              "tiempo": "T+0:21 (12:33:21)",
              "esp_fra_mw": "0 AC, +1,000 HVDC (exp.)",
              "esp_por_mw": "n/a",
              "esp_mar_mw": "n/a",
              "notas": "Hernani opening"
            },
            {
              "tiempo": "T+0:23 (12:33:24)",
              "esp_fra_mw": "0",
              "esp_por_mw": "0",
              "esp_mar_mw": "-314 (lost)",
              "notas": "Collapse"
            },
            {
              "tiempo": "T+10 (12:43)",
              "esp_fra_mw": "0 (all France open)",
              "esp_por_mw": "0",
              "esp_mar_mw": "0",
              "notas": ""
            },
            {
              "tiempo": "T+11 (12:44)",
              "esp_fra_mw": "re-energization 1st ES-F west line",
              "esp_por_mw": "0",
              "esp_mar_mw": "0",
              "notas": "Reconnection"
            },
            {
              "tiempo": "T+30 (13:04)",
              "esp_fra_mw": "+400 imp.",
              "esp_por_mw": "0",
              "esp_mar_mw": "Morocco re-energization",
              "notas": ""
            }
          ],
          "note": "Notable asymmetry: HVDC continued exporting 1,000 MW while AC imported 3,807 MW (actual deficit ≈ 4,800 MW before AC opening).",
          "tema": "T4"
        }
      ]
    },
    {
      "id": "reactive-power-distribution",
      "name": "Voltage and Distribution Network Maneuvers",
      "icon": "⚡",
      "color": "hsl(30 90% 55%)",
      "tables": [
        {
          "id": "maniobras-compensacion-reactiva",
          "name": "Reactive compensation maneuvers executed by REE between 12:00 and 12:30",
          "source": "Compass Lexecon/INESC TEC ¶32-34, ¶156, ¶163; REE pp. 4-6",
          "type": "table",
          "columns": [
            {
              "key": "accion",
              "label": "Action"
            },
            {
              "key": "cantidad",
              "label": "Quantity"
            },
            {
              "key": "mvar_afectados",
              "label": "MVAr affected"
            },
            {
              "key": "comentario",
              "label": "Comment"
            }
          ],
          "data": [
            {
              "accion": "Reactors disconnected (12:00-12:30)",
              "cantidad": "8",
              "mvar_afectados": "-1,150 MVAr (absorption capacity)",
              "comentario": "To combat low voltages"
            },
            {
              "accion": "Reactors reconnected (12:22-12:30)",
              "cantidad": "5",
              "mvar_afectados": "+750 MVAr",
              "comentario": "After voltage rise"
            },
            {
              "accion": "Net reactor balance",
              "cantidad": "",
              "mvar_afectados": "-400 MVAr",
              "comentario": "Absorption loss"
            },
            {
              "accion": "400 kV lines reconnected (12:00-12:30)",
              "cantidad": "19",
              "mvar_afectados": "+~2,000 MVAr capacitive generation",
              "comentario": "Meshing"
            },
            {
              "accion": "Lines reconnected in previous days",
              "cantidad": "11",
              "mvar_afectados": "+~1,600 MVAr",
              "comentario": "Cumulative"
            },
            {
              "accion": "Total reactive margin at 12:00",
              "cantidad": "3.3 GVAr",
              "mvar_afectados": "vs. 5.8 GVAr H1 2025 average",
              "comentario": "-43% margin"
            },
            {
              "accion": "Andalusia margin",
              "cantidad": "117 MVAr (1 CCGT)",
              "mvar_afectados": "vs. 1,850 MVAr reactors",
              "comentario": "Critical"
            },
            {
              "accion": "Regional reactive surplus Andalusia",
              "cantidad": "~600 MVAr",
              "mvar_afectados": "",
              "comentario": "Induced by maneuvers"
            }
          ],
          "note": "Demonstrates that voltage control is essentially a real-time reactive power management problem.",
          "tema": "T2"
        },
        {
          "id": "inyeccion-reactiva-distribucion",
          "name": "Anomalous reactive injection from distribution networks (12:22 CEST)",
          "source": "REE p. 6; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "zona",
              "label": "Zone"
            },
            {
              "key": "q_inyectada_mvar",
              "label": "Q injected into the transmission network (MVAr)"
            },
            {
              "key": "observacion",
              "label": "Observation"
            }
          ],
          "data": [
            {
              "zona": "Madrid",
              "q_inyectada_mvar": "575",
              "observacion": "Net capacitive"
            },
            {
              "zona": "Valencia",
              "q_inyectada_mvar": "405",
              "observacion": "Net capacitive"
            },
            {
              "zona": "Rest of Spain",
              "q_inyectada_mvar": "-220",
              "observacion": "Partial compensation"
            },
            {
              "zona": "National total",
              "q_inyectada_mvar": "+760 MVAr",
              "observacion": "Anomaly: distribution as Q source instead of sink"
            }
          ],
          "note": "This capacitive injection from distribution raised transmission voltages and is the opposite side of the problem.",
          "tema": "T2"
        },
        {
          "id": "variacion-demanda-desconexion-gd",
          "name": "Effective demand variation due to distributed generation disconnection (~1 MW)",
          "source": "REE p. 6; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "periodo",
              "label": "Period"
            },
            {
              "key": "delta_demanda_mw",
              "label": "∆ Effective demand (MW)"
            },
            {
              "key": "origen",
              "label": "Origin"
            }
          ],
          "data": [
            {
              "periodo": "Until 12:22",
              "delta_demanda_mw": "+845",
              "origen": "Loss of distributed generation (<1 MW) + CECRE telemetered"
            },
            {
              "periodo": "- CECRE telemetered generation",
              "delta_demanda_mw": "+152",
              "origen": "Plants >1 MW reporting"
            },
            {
              "periodo": "- Self-consumption + <1 MW non-observable",
              "delta_demanda_mw": "+700 (~85%)",
              "origen": "Invisible to REE"
            },
            {
              "periodo": "12:32:00-12:32:57",
              "delta_demanda_mw": "+434 additional",
              "origen": "Anomalous increase prior to cascade"
            },
            {
              "periodo": "- Distributed plants",
              "delta_demanda_mw": "+117",
              "origen": "Output reduction"
            },
            {
              "periodo": "- Non-observable self-consumption",
              "delta_demanda_mw": "+317",
              "origen": ""
            }
          ],
          "note": "The lack of observability of ~700 MW of distributed self-consumption is a key structural vulnerability.",
          "tema": "T1"
        },
        {
          "id": "re-voltage-manoeuvres",
          "name": "Voltage Control Maneuvers (Red Eléctrica)",
          "source": "Informe ENTSO-E Tabla 2-2",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Time"
            },
            {
              "key": "element",
              "label": "Element"
            },
            {
              "key": "movement",
              "label": "Action"
            },
            {
              "key": "zone",
              "label": "Zone"
            }
          ],
          "data": [
            {
              "hour": "09:02",
              "element": "LINE L-400 kV ALMARAZ — SAN SERVÁN 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH"
            },
            {
              "hour": "09:02",
              "element": "SHUNT REACTOR VALDECABALLEROS 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH"
            },
            {
              "hour": "09:02",
              "element": "SHUNT REACTOR ANCHUELO REA 1",
              "movement": "SWITCH OFF",
              "zone": "CENTRE"
            }
          ],
          "note": "Maneuvers performed by Red Eléctrica between 09:00 and 12:32 on April 28 (full list available).",
          "tema": "T2"
        },
        {
          "id": "re-topological-manoeuvres",
          "name": "Topological Maneuvers of Red Eléctrica",
          "source": "Informe ENTSO-E (Lista de trabajos topológicos)",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Time"
            },
            {
              "key": "element",
              "label": "Element"
            },
            {
              "key": "zone",
              "label": "Zone"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "element": "SE 220 kV SERRALLO",
              "zone": "CENTER"
            },
            {
              "hour": "09:03",
              "element": "SE 220 kV STA. ELVIRA",
              "zone": "SOUTH"
            },
            {
              "hour": "09:16",
              "element": "SE 220 kV ACECA pos",
              "zone": "CENTER"
            },
            {
              "hour": "09:21",
              "element": "PRADILLOS SE 220 kV TORRELLANO",
              "zone": "EAST"
            },
            {
              "hour": "09:37",
              "element": "SE 400 kV ALDEADAVILA: JBP2",
              "zone": "NORTHWEST"
            },
            {
              "hour": "09:37",
              "element": "SE 400 kV FAUSITA",
              "zone": "EAST"
            },
            {
              "hour": "09:52",
              "element": "L-220 kV PRADO SANTO DOMINGO—VILLAVICIOSA",
              "zone": "CENTER"
            },
            {
              "hour": "09:52",
              "element": "SE 220 kV VILLAVICIOSA pos ACJ",
              "zone": "SOUTH"
            },
            {
              "hour": "09:53",
              "element": "SE 400 kV GUILLENA: L/COLLECTOR 1",
              "zone": "SOUTH"
            },
            {
              "hour": "10:46",
              "element": "SE 400 kV PALOS: AT-2 and TM-2",
              "zone": "CENTER"
            },
            {
              "hour": "11:15",
              "element": "L-220 kV VILLAVICIOSA—LUCERO—LEGANES",
              "zone": "SOUTH"
            },
            {
              "hour": "11:36",
              "element": "SE 220 kV ACECA: 522-1 Switch",
              "zone": "CENTER"
            },
            {
              "hour": "12:16",
              "element": "SE 220 kV SS. REYES: L/PS. FERNANDO",
              "zone": "CENTER"
            }
          ],
          "tema": "T3"
        },
        {
          "id": "ren-topological-manoeuvres",
          "name": "Topological Maneuvers of REN (Portugal)",
          "source": "Informe ENTSO-E Tabla 2-3",
          "type": "table",
          "columns": [
            {
              "key": "type",
              "label": "Type"
            },
            {
              "key": "element",
              "label": "Element"
            },
            {
              "key": "start",
              "label": "Start"
            },
            {
              "key": "end",
              "label": "End"
            },
            {
              "key": "reason",
              "label": "Reason"
            }
          ],
          "data": [
            {
              "type": "Line",
              "element": "Fanhoes–Pegoes 400",
              "start": "26/04 19:46",
              "end": "30/04 06:23",
              "reason": "Manual voltage control"
            },
            {
              "type": "Line",
              "element": "Panoias–Tavira 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "Manual voltage control"
            },
            {
              "type": "Line",
              "element": "Ferreiro do Alentejo–Panoias 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Feira 180 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 05:24",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Castelo Branco 70 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 00:12",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Portimao 180 Mvar",
              "start": "28/04 10:03",
              "end": "28/04 23:33",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Pedralva 180 Mvar",
              "start": "28/04 10:03",
              "end": "29/04 02:41",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Paraimo 180 Mvar",
              "start": "28/04 10:06",
              "end": "29/04 00:37",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Armamar 180 Mvar",
              "start": "28/04 10:27",
              "end": "29/04 02:39",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Fanhoes 180 Mvar",
              "start": "28/04 10:27",
              "end": "28/04 22:51",
              "reason": "Manual voltage control"
            },
            {
              "type": "Shunt Reactor",
              "element": "RS2 - S. Palmela 180 Mvar",
              "start": "28/04 12:19",
              "end": "28/04 23:56",
              "reason": "Trip due to low voltage protection"
            }
          ],
          "tema": "T3"
        },
        {
          "id": "lines-outage-icai",
          "name": "Open Lines by Area (9:00 CEST)",
          "source": "Informe ICAI Tabla 4-2",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "Area"
            },
            {
              "key": "open_220",
              "label": "Open lines (220 kV)"
            },
            {
              "key": "open_400",
              "label": "Open lines (400 kV)"
            },
            {
              "key": "unavail_220",
              "label": "Unavailable (220 kV)"
            },
            {
              "key": "unavail_400",
              "label": "Unavailable (400 kV)"
            },
            {
              "key": "works_220",
              "label": "Scheduled works (220 kV)"
            },
            {
              "key": "works_400",
              "label": "Scheduled works (400 kV)"
            }
          ],
          "data": [
            {
              "area": "NOROESTE",
              "open_220": 7,
              "open_400": 7,
              "unavail_220": 3,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 2
            },
            {
              "area": "NORTE",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "ESTE",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "CENTRO",
              "open_220": 5,
              "open_400": 5,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "SUR",
              "open_220": 10,
              "open_400": 10,
              "unavail_220": 3,
              "unavail_400": 3,
              "works_220": 3,
              "works_400": 3
            }
          ],
          "note": "Number of open lines due to voltage control, unavailability, and scheduled works at 9:00.",
          "tema": "T3"
        },
        {
          "id": "km-percentage-icai",
          "name": "Percentage of km of Open Lines by Area",
          "source": "Informe ICAI Tabla 4-3",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "Area"
            },
            {
              "key": "pct_open_220",
              "label": "% km open (220 kV)"
            },
            {
              "key": "pct_open_400",
              "label": "% km open (400 kV)"
            },
            {
              "key": "pct_unavail_220",
              "label": "% km unavailable (220 kV)"
            },
            {
              "key": "pct_unavail_400",
              "label": "% km unavailable (400 kV)"
            },
            {
              "key": "pct_works_220",
              "label": "% km works (220 kV)"
            },
            {
              "key": "pct_works_400",
              "label": "% km works (400 kV)"
            }
          ],
          "data": [
            {
              "area": "NOROESTE",
              "pct_open_220": 20.74,
              "pct_open_400": 2.5,
              "pct_unavail_220": 0.9,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": ""
            },
            {
              "area": "NORTE",
              "pct_open_220": 14.4,
              "pct_open_400": 0.7,
              "pct_unavail_220": 1.6,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": ""
            },
            {
              "area": "ESTE",
              "pct_open_220": 1.5,
              "pct_open_400": 8.5,
              "pct_unavail_220": 2.8,
              "pct_unavail_400": 4.8,
              "pct_works_220": 0.3,
              "pct_works_400": 1.3
            },
            {
              "area": "CENTRO",
              "pct_open_220": 7,
              "pct_open_400": 26.7,
              "pct_unavail_220": 5.6,
              "pct_unavail_400": 2.2,
              "pct_works_220": 0.4,
              "pct_works_400": 5.4
            },
            {
              "area": "SUR",
              "pct_open_220": 27.5,
              "pct_open_400": 8.3,
              "pct_unavail_220": 3.8,
              "pct_unavail_400": 0.2,
              "pct_works_220": 1.4,
              "pct_works_400": ""
            }
          ],
          "tema": "T3"
        }
      ]
    },
    {
      "id": "cascade-collapse",
      "name": "Cascading Collapse",
      "icon": "💥",
      "color": "hsl(0 75% 56%)",
      "tables": [
        {
          "id": "secuencia-desconexion-suroeste",
          "name": "Generation disconnection sequence (southwest zone)",
          "source": "REE pp. 8-10; Comité 28-A p. 47; ENTSO-E Factual Report; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "evento",
              "label": "# Event"
            },
            {
              "key": "timestamp",
              "label": "Timestamp CEST"
            },
            {
              "key": "ubicacion",
              "label": "Location"
            },
            {
              "key": "tecnologia",
              "label": "Technology"
            },
            {
              "key": "mw_perdidos",
              "label": "MW lost"
            },
            {
              "key": "mvar_perdidos",
              "label": "MVAr absorbed lost"
            },
            {
              "key": "causa",
              "label": "Cause"
            }
          ],
          "data": [
            {
              "evento": "1",
              "timestamp": "12:32:57.140",
              "ubicacion": "Granada",
              "tecnologia": "400/220 kV Transformer",
              "mw_perdidos": "355",
              "mvar_perdidos": "165",
              "causa": "Overvoltage protection 220 kV (242 kV)"
            },
            {
              "evento": "2a",
              "timestamp": "12:33:16.460",
              "ubicacion": "Badajoz (Sub B)",
              "tecnologia": "Concentrated solar power (CSP)",
              "mw_perdidos": "582",
              "mvar_perdidos": "n/d",
              "causa": "Internal trip"
            },
            {
              "evento": "2b",
              "timestamp": "12:33:16.820",
              "ubicacion": "Badajoz (Sub C)",
              "tecnologia": "FV",
              "mw_perdidos": "145",
              "mvar_perdidos": "n/d",
              "causa": "Internal trip"
            },
            {
              "evento": "3a",
              "timestamp": "12:33:17.368",
              "ubicacion": "Segovia (132 kV)",
              "tecnologia": "Wind (3 parks)",
              "mw_perdidos": "23",
              "mvar_perdidos": "n/d",
              "causa": "No POI data"
            },
            {
              "evento": "3b",
              "timestamp": "12:33:17.448",
              "ubicacion": "Sub B Badajoz",
              "tecnologia": "FV",
              "mw_perdidos": "118",
              "mvar_perdidos": "n/d",
              "causa": "Internal trip"
            },
            {
              "evento": "3c",
              "timestamp": "12:33:17.475",
              "ubicacion": "Huelva (220 kV)",
              "tecnologia": "Wind + PV",
              "mw_perdidos": "34",
              "mvar_perdidos": "n/d",
              "causa": ""
            },
            {
              "evento": "3d",
              "timestamp": "12:33:17.708",
              "ubicacion": "Seville (collector)",
              "tecnologia": "FV",
              "mw_perdidos": "550",
              "mvar_perdidos": "n/d",
              "causa": "Line trip-transfer"
            },
            {
              "evento": "3e",
              "timestamp": "12:33:17.908",
              "ubicacion": "Cáceres",
              "tecnologia": "FV",
              "mw_perdidos": "37.5",
              "mvar_perdidos": "n/d",
              "causa": "Voltage >253 kV"
            },
            {
              "evento": "3f",
              "timestamp": "12:33:17.948",
              "ubicacion": "Badajoz (220 kV)",
              "tecnologia": "FV",
              "mw_perdidos": "72",
              "mvar_perdidos": "n/d",
              "causa": ""
            },
            {
              "evento": "Total E1-3",
              "timestamp": "<650 ms",
              "ubicacion": "",
              "tecnologia": "",
              "mw_perdidos": "1,917 direct",
              "mvar_perdidos": "",
              "causa": "→ ~2,000-2,500 MW total"
            },
            {
              "evento": "4 (UFLS)",
              "timestamp": "12:33:20.180",
              "ubicacion": "National",
              "tecnologia": "Pumped storage (49.5 Hz)",
              "mw_perdidos": "2,000-2,037",
              "mvar_perdidos": "",
              "causa": "Automatic UFLS"
            },
            {
              "evento": "4b",
              "timestamp": "12:33:20.500",
              "ubicacion": "National",
              "tecnologia": "Pumping (49.3 Hz)",
              "mw_perdidos": "588",
              "mvar_perdidos": "",
              "causa": "UFLS"
            },
            {
              "evento": "4c",
              "timestamp": "12:33:20.6-22.0",
              "ubicacion": "National",
              "tecnologia": "Industrial+distribution demand",
              "mw_perdidos": "1,402.5",
              "mvar_perdidos": "",
              "causa": "UFLS demand"
            },
            {
              "evento": "5 (post-island)",
              "timestamp": "12:33:22.702",
              "ubicacion": "Levante",
              "tecnologia": "CCGT",
              "mw_perdidos": "n/a",
              "mvar_perdidos": "",
              "causa": "Trip at 49.5 Hz / V=419.6 kV"
            },
            {
              "evento": "5b",
              "timestamp": "12:33:23.515",
              "ubicacion": "",
              "tecnologia": "Nuclear",
              "mw_perdidos": "~1,000",
              "mvar_perdidos": "",
              "causa": "Under-frequency 47.79 Hz"
            },
            {
              "evento": "5c",
              "timestamp": "12:33:23.590",
              "ubicacion": "",
              "tecnologia": "Nuclear (2 more)",
              "mw_perdidos": "~2,000",
              "mvar_perdidos": "",
              "causa": ""
            }
          ],
          "note": "Master table for event reproduction in transient stability software.",
          "tema": "T3"
        },
        {
          "id": "escalones-ufls",
          "name": "UFLS steps applied",
          "source": "REE p. 11; Comité 28-A p. 50-51, 57",
          "type": "table",
          "columns": [
            {
              "key": "escalon",
              "label": "Step"
            },
            {
              "key": "frecuencia_hz",
              "label": "Frequency (Hz)"
            },
            {
              "key": "tipo_carga",
              "label": "Load type"
            },
            {
              "key": "mw_desconectados",
              "label": "MW disconnected"
            },
            {
              "key": "mw_acumulado",
              "label": "Cumulative MW"
            },
            {
              "key": "observacion",
              "label": "Observation"
            }
          ],
          "data": [
            {
              "escalon": "Pumping step 1",
              "frecuencia_hz": "49.50",
              "tipo_carga": "Pumping",
              "mw_desconectados": "2.000",
              "mw_acumulado": "2.000",
              "observacion": ""
            },
            {
              "escalon": "Pumping step 2",
              "frecuencia_hz": "49.30",
              "tipo_carga": "Pumping",
              "mw_desconectados": "588",
              "mw_acumulado": "2.588",
              "observacion": ""
            },
            {
              "escalon": "Demand step 1",
              "frecuencia_hz": "49.00",
              "tipo_carga": "Industrial + distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~2,822",
              "observacion": "Start of UFLS demand"
            },
            {
              "escalon": "Demand step 2",
              "frecuencia_hz": "48.80",
              "tipo_carga": "Distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.056",
              "observacion": ""
            },
            {
              "escalon": "Demand step 3",
              "frecuencia_hz": "48.60",
              "tipo_carga": "Distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.290",
              "observacion": ""
            },
            {
              "escalon": "Demand step 4",
              "frecuencia_hz": "48.40",
              "tipo_carga": "Distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.524",
              "observacion": ""
            },
            {
              "escalon": "Demand step 5",
              "frecuencia_hz": "48.20",
              "tipo_carga": "Distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.758",
              "observacion": ""
            },
            {
              "escalon": "Demand step 6",
              "frecuencia_hz": "48.00",
              "tipo_carga": "Distribution",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.992",
              "observacion": "1,402.5 MW only transmission (Spain)"
            },
            {
              "escalon": "Total Iberia",
              "frecuencia_hz": "",
              "tipo_carga": "",
              "mw_desconectados": ">10,000 MW",
              "mw_acumulado": "",
              "observacion": "Comp. Lexecon: 2.04 GW pumping PT + ~3 GW pumping ES + 2.3 GW dist. PT + ~3.2 GW dist. ES"
            }
          ],
          "note": "The 'UFLS paradox': disconnecting load additionally raises voltage, worsening the voltage collapse.",
          "tema": "T3"
        },
        {
          "id": "estado-centrales-nucleares",
          "name": "Status of nuclear power plants before and during the collapse",
          "source": "Comité 28-A p. 38; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "central",
              "label": "Plant"
            },
            {
              "key": "reactor",
              "label": "Reactor"
            },
            {
              "key": "estado",
              "label": "Status"
            },
            {
              "key": "potencia_pre_mw",
              "label": "Pre-power (MW)"
            },
            {
              "key": "causa_desconexion",
              "label": "Cause of disconnection"
            },
            {
              "key": "estado_post",
              "label": "Post-status"
            }
          ],
          "data": [
            {
              "central": "Almaraz",
              "reactor": "1",
              "estado": "Coupled",
              "potencia_pre_mw": "~1,000 (full)",
              "causa_desconexion": "Trip due to UFLS and over-V (47.79 Hz)",
              "estado_post": "Safe shutdown"
            },
            {
              "central": "Almaraz",
              "reactor": "2",
              "estado": "Coupled",
              "potencia_pre_mw": "~1,000 (full)",
              "causa_desconexion": "Underfrequency trip",
              "estado_post": "Safe shutdown"
            },
            {
              "central": "Ascó",
              "reactor": "1 (partial)",
              "estado": "Coupled",
              "potencia_pre_mw": "~520 (50%)",
              "causa_desconexion": "Trip",
              "estado_post": "Shutdown"
            },
            {
              "central": "Vandellós",
              "reactor": "2",
              "estado": "Coupled",
              "potencia_pre_mw": "~500 (partial)",
              "causa_desconexion": "Trip",
              "estado_post": "Shutdown"
            },
            {
              "central": "Ascó 2, Cofrentes, Trillo",
              "reactor": "",
              "estado": "Scheduled refueling / shutdown",
              "potencia_pre_mw": "0",
              "causa_desconexion": "",
              "estado_post": ""
            },
            {
              "central": "Total nuclear online",
              "reactor": "4 reactors",
              "estado": "",
              "potencia_pre_mw": "~3,020 MW",
              "causa_desconexion": "None maintained island operation",
              "estado_post": ""
            },
            {
              "central": "Golfech (France)",
              "reactor": "1",
              "estado": "Coupled",
              "potencia_pre_mw": "1.300",
              "causa_desconexion": "Trip 12:33 (collateral effect)",
              "estado_post": "Reconnected 29-A"
            }
          ],
          "note": "No nuclear plant acted as a synchronous anchor; all 4 tripped due to under-frequency.",
          "tema": "T3"
        },
        {
          "id": "desconexion-bombeo-hidraulica",
          "name": "Disconnection of pumping and hydroelectric plants",
          "source": "REE p. 11; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "concepto",
              "label": "Concept"
            },
            {
              "key": "valor",
              "label": "Value"
            }
          ],
          "data": [
            {
              "concepto": "Pumping in active consumption at 12:30 (load)",
              "valor": "~3,000 MW (Spain) + 2,040 MW (Portugal)"
            },
            {
              "concepto": "Pumping disconnected at 49.5 Hz (step 1)",
              "valor": "2,000-2,037 MW"
            },
            {
              "concepto": "Pumping disconnected at 49.3 Hz (step 2)",
              "valor": "588 MW"
            },
            {
              "concepto": "Total pumping disconnected",
              "valor": "~2,625 MW (Spain) + 2,040 MW (Portugal)"
            }
          ],
          "note": "The rapid disconnection of pumping simultaneously removed a balancing load.",
          "tema": "T3"
        },
        {
          "id": "pump-storage-es",
          "name": "Pumping disconnection in Spain",
          "source": "Informe ENTSO-E Tabla 3-8",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "Pumping"
            },
            {
              "key": "step_hz",
              "label": "Step (Hz)"
            },
            {
              "key": "tripped",
              "label": "Disconnected"
            }
          ],
          "data": [
            {
              "pump": "Pump 1",
              "step_hz": 49.5,
              "tripped": "Y"
            },
            {
              "pump": "Pump 2",
              "step_hz": 49.5,
              "tripped": "Y"
            }
          ],
          "note": "Total pumping disconnected: 2,168 MW at 49.5 Hz + 588 MW at 49.3 Hz = 2,756 MW (summary version).",
          "tema": "T3"
        },
        {
          "id": "pump-storage-pt",
          "name": "Pumping disconnection in Portugal",
          "source": "Informe ENTSO-E Tabla 3-10",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "Pumping"
            },
            {
              "key": "step_hz",
              "label": "Step (Hz)"
            },
            {
              "key": "p_previous_mw",
              "label": "Pre-power (MW)"
            },
            {
              "key": "p_tripped_mw",
              "label": "Disconnected power (MW)"
            }
          ],
          "data": [
            {
              "pump": "Pump 1",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18
            },
            {
              "pump": "Pump 2",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18
            }
          ],
          "note": "Total pumping disconnected in Portugal: 2,098 MW (summary version).",
          "tema": "T3"
        },
        {
          "id": "eventos-proteccion-maniobras",
          "name": "Protection events and maneuvers during the cascade",
          "source": "REE p. 13-14",
          "type": "table",
          "columns": [
            {
              "key": "tipo_evento",
              "label": "Event type"
            },
            {
              "key": "cantidad",
              "label": "Quantity"
            },
            {
              "key": "comentario",
              "label": "Comment"
            }
          ],
          "data": [
            {
              "tipo_evento": "Trips due to overvoltage in transmission grid",
              "cantidad": "Only 2",
              "comentario": "Arganda–Loeches; Valdecaballeros–Maguilla"
            },
            {
              "tipo_evento": "Inadequate trips (before threshold)",
              "cantidad": "≥7",
              "comentario": "Margin <2% above regulatory limit"
            },
            {
              "tipo_evento": "Opening of F-E interconnection",
              "cantidad": "12:33:21.535",
              "comentario": "Hernani 400 kV, f=48.458 Hz"
            },
            {
              "tipo_evento": "Disconnection of Morocco",
              "cantidad": "n/d",
              "comentario": "Lost 314 MW imported"
            },
            {
              "tipo_evento": "Trip HVDC",
              "cantidad": "12:33:23.960",
              "comentario": "After V Santa Llogaia collapse"
            }
          ],
          "note": "Demonstrates that the transmission protection acted 'correctly'; the failures were in compliance with P.O. 7.4.",
          "tema": "T3"
        }
      ]
    },
    {
      "id": "demand-load",
      "name": "Demand and Load",
      "icon": "📊",
      "color": "hsl(40 95% 50%)",
      "tables": [
        {
          "id": "demand-shedding-es",
          "name": "Load Disconnection in Spain",
          "source": "Informe ENTSO-E Tabla 3-9",
          "type": "table",
          "columns": [
            {
              "key": "step",
              "label": "Step"
            },
            {
              "key": "threshold_hz",
              "label": "Threshold (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Disconnected Load (MW)"
            },
            {
              "key": "real_pct",
              "label": "Actual (% demand)"
            },
            {
              "key": "plan_pct",
              "label": "Planned (% demand)"
            }
          ],
          "data": [
            {
              "step": "1st",
              "threshold_hz": 49,
              "load_mw": 1176,
              "real_pct": 4.7,
              "plan_pct": 6
            },
            {
              "step": "2nd",
              "threshold_hz": 48.8,
              "load_mw": 1669,
              "real_pct": 6.6,
              "plan_pct": 9
            },
            {
              "step": "3rd",
              "threshold_hz": 48.6,
              "load_mw": 1575,
              "real_pct": 6.3,
              "plan_pct": 8
            },
            {
              "step": "4th",
              "threshold_hz": 48.4,
              "load_mw": 1524,
              "real_pct": 6.1,
              "plan_pct": 8
            },
            {
              "step": "5th",
              "threshold_hz": 48.2,
              "load_mw": 1294,
              "real_pct": 5.1,
              "plan_pct": 7
            },
            {
              "step": "6th",
              "threshold_hz": 48,
              "load_mw": 1267,
              "real_pct": 5,
              "plan_pct": 7
            }
          ],
          "note": "Total load disconnected in Spain: 8,505 MW (33.8% of demand).",
          "tema": "T3"
        },
        {
          "id": "demand-shedding-pt",
          "name": "Load Disconnection in Portugal (LFDD)",
          "source": "Informe ENTSO-E Tabla 3-12",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Threshold (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Disconnected Load (MW)"
            },
            {
              "key": "real_pct",
              "label": "Actual (% demand)"
            },
            {
              "key": "plan_pct",
              "label": "Planned (% demand)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.7
            },
            {
              "threshold_hz": 48.8,
              "load_mw": 293,
              "real_pct": 5,
              "plan_pct": 6.6
            },
            {
              "threshold_hz": 48.6,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.9
            },
            {
              "threshold_hz": 48.4,
              "load_mw": 323,
              "real_pct": 5.5,
              "plan_pct": 6.6
            },
            {
              "threshold_hz": 48.2,
              "load_mw": 282,
              "real_pct": 4.8,
              "plan_pct": 6.4
            },
            {
              "threshold_hz": 48,
              "load_mw": 427,
              "real_pct": 7.3,
              "plan_pct": 9.7
            }
          ],
          "note": "Total load disconnected in Portugal: 1,955 MW (33.3% of demand).",
          "tema": "T3"
        },
        {
          "id": "electro-intensive-pt",
          "name": "Disconnection of Electro-intensive Consumers (Portugal)",
          "source": "Informe ENTSO-E Tabla 3-11",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Threshold (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Disconnected Load (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "load_mw": 218
            }
          ],
          "tema": "T3"
        },
        {
          "id": "load-shedding-es-pt",
          "name": "Summary of Load Disconnection ES + PT",
          "source": "Informe ENTSO-E Tabla 3-15",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Threshold (Hz)"
            },
            {
              "key": "ind_pt_mw",
              "label": "Electro-intensive PT (MW)"
            },
            {
              "key": "other_pt_mw",
              "label": "Other load PT (MW)"
            },
            {
              "key": "other_es_mw",
              "label": "Other load ES (MW)"
            },
            {
              "key": "total_mw",
              "label": "Total (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "ind_pt_mw": 218,
              "other_pt_mw": 0,
              "other_es_mw": 0,
              "total_mw": 218
            },
            {
              "threshold_hz": 49,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1176,
              "total_mw": 1491
            },
            {
              "threshold_hz": 48.8,
              "ind_pt_mw": 0,
              "other_pt_mw": 293,
              "other_es_mw": 1669,
              "total_mw": 1962
            },
            {
              "threshold_hz": 48.6,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1575,
              "total_mw": 1890
            },
            {
              "threshold_hz": 48.4,
              "ind_pt_mw": 0,
              "other_pt_mw": 323,
              "other_es_mw": 1524,
              "total_mw": 1847
            },
            {
              "threshold_hz": 48.2,
              "ind_pt_mw": 0,
              "other_pt_mw": 282,
              "other_es_mw": 1294,
              "total_mw": 1576
            },
            {
              "threshold_hz": 48,
              "ind_pt_mw": 0,
              "other_pt_mw": 427,
              "other_es_mw": 1267,
              "total_mw": 1694
            }
          ],
          "note": "Total global disconnected load: 10,678 MW.",
          "tema": "T3"
        },
        {
          "id": "dso-load-shedding",
          "name": "Disconnection by Distributor (DSO)",
          "source": "Informe ENTSO-E Tabla 3-16",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Threshold (Hz)"
            },
            {
              "key": "dso1_mw",
              "label": "DSO1 (MW)"
            },
            {
              "key": "dso2_mw",
              "label": "DSO2 (MW)"
            },
            {
              "key": "dso3_mw",
              "label": "DSO3 (MW)"
            },
            {
              "key": "dso4_mw",
              "label": "DSO4 (MW)"
            },
            {
              "key": "dso5_mw",
              "label": "DSO5 (MW)"
            },
            {
              "key": "e_redes_mw",
              "label": "E-REDES PT (MW)"
            },
            {
              "key": "total_mw",
              "label": "Total DSO (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "dso1_mw": 85.1,
              "dso2_mw": 23.7,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 97,
              "e_redes_mw": 315,
              "total_mw": 520.8
            },
            {
              "threshold_hz": 48.8,
              "dso1_mw": 529.9,
              "dso2_mw": 190,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 767.5,
              "e_redes_mw": 293,
              "total_mw": 1780.4
            },
            {
              "threshold_hz": 48.7,
              "dso1_mw": 49.6,
              "dso2_mw": "",
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 21.4,
              "e_redes_mw": "",
              "total_mw": 71
            },
            {
              "threshold_hz": 48.6,
              "dso1_mw": 423.9,
              "dso2_mw": 195.7,
              "dso3_mw": "",
              "dso4_mw": 5.2,
              "dso5_mw": 628.1,
              "e_redes_mw": 315,
              "total_mw": 1567.9
            },
            {
              "threshold_hz": 48.4,
              "dso1_mw": 633.8,
              "dso2_mw": 216.8,
              "dso3_mw": "",
              "dso4_mw": 21.6,
              "dso5_mw": 651.7,
              "e_redes_mw": 323,
              "total_mw": 1846.9
            },
            {
              "threshold_hz": 48.2,
              "dso1_mw": 412.3,
              "dso2_mw": 220.3,
              "dso3_mw": 60.4,
              "dso4_mw": 12.2,
              "dso5_mw": 589.1,
              "e_redes_mw": 282,
              "total_mw": 1576.3
            },
            {
              "threshold_hz": 48,
              "dso1_mw": 544.1,
              "dso2_mw": 218.2,
              "dso3_mw": 0.7,
              "dso4_mw": 11.6,
              "dso5_mw": 492.5,
              "e_redes_mw": 427,
              "total_mw": 1694.1
            }
          ],
          "tema": "T3"
        },
        {
          "id": "spanish-demand-forecast",
          "name": "Spanish Demand Forecast (28-A)",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hour"
            },
            {
              "key": "real_mw",
              "label": "Actual (MW)"
            },
            {
              "key": "forecast_d2",
              "label": "Forecast D-2 (MW)"
            },
            {
              "key": "forecast_d1",
              "label": "Forecast D-1 (MW)"
            },
            {
              "key": "forecast_8h",
              "label": "Forecast 8:00 (MW)"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 26900,
              "forecast_d2": 27600,
              "forecast_d1": 27600,
              "forecast_8h": 27500
            },
            {
              "hour": "09:15",
              "real_mw": 26850,
              "forecast_d2": 27400,
              "forecast_d1": 27350,
              "forecast_8h": 27350
            },
            {
              "hour": "09:30",
              "real_mw": 26650,
              "forecast_d2": 27350,
              "forecast_d1": 27200,
              "forecast_8h": 27200
            },
            {
              "hour": "09:45",
              "real_mw": 26550,
              "forecast_d2": 27250,
              "forecast_d1": 27050,
              "forecast_8h": 27000
            },
            {
              "hour": "10:00",
              "real_mw": 26250,
              "forecast_d2": 27200,
              "forecast_d1": 26900,
              "forecast_8h": 26850
            },
            {
              "hour": "10:15",
              "real_mw": 25950,
              "forecast_d2": 27050,
              "forecast_d1": 26800,
              "forecast_8h": 26700
            },
            {
              "hour": "10:30",
              "real_mw": 25950,
              "forecast_d2": 26900,
              "forecast_d1": 26650,
              "forecast_8h": 26500
            },
            {
              "hour": "10:45",
              "real_mw": 25450,
              "forecast_d2": 26700,
              "forecast_d1": 26450,
              "forecast_8h": 26300
            },
            {
              "hour": "11:00",
              "real_mw": 25750,
              "forecast_d2": 26500,
              "forecast_d1": 26200,
              "forecast_8h": 26050
            },
            {
              "hour": "11:15",
              "real_mw": 25400,
              "forecast_d2": 26350,
              "forecast_d1": 26000,
              "forecast_8h": 25900
            },
            {
              "hour": "11:30",
              "real_mw": 25100,
              "forecast_d2": 26250,
              "forecast_d1": 25900,
              "forecast_8h": 25800
            },
            {
              "hour": "11:45",
              "real_mw": 24850,
              "forecast_d2": 26150,
              "forecast_d1": 25800,
              "forecast_8h": 25700
            },
            {
              "hour": "12:00",
              "real_mw": 24950,
              "forecast_d2": 26100,
              "forecast_d1": 25700,
              "forecast_8h": 25650
            },
            {
              "hour": "12:15",
              "real_mw": 24900,
              "forecast_d2": 26050,
              "forecast_d1": 25700,
              "forecast_8h": 25650
            }
          ],
          "tema": "T1"
        },
        {
          "id": "portuguese-demand-forecast",
          "name": "Portuguese Demand Forecast (28-A)",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hour"
            },
            {
              "key": "real_mw",
              "label": "Actual (MW)"
            },
            {
              "key": "forecast_d2",
              "label": "D-2 Forecast (MW)"
            },
            {
              "key": "forecast_d1",
              "label": "D-1 Forecast (MW)"
            },
            {
              "key": "forecast_8h",
              "label": "8:00 Forecast (MW)"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 5700,
              "forecast_d2": 5750,
              "forecast_d1": 5720,
              "forecast_8h": 5710
            },
            {
              "hour": "09:15",
              "real_mw": 5780,
              "forecast_d2": 5900,
              "forecast_d1": 5850,
              "forecast_8h": 5820
            },
            {
              "hour": "09:30",
              "real_mw": 5900,
              "forecast_d2": 5980,
              "forecast_d1": 5930,
              "forecast_8h": 5920
            },
            {
              "hour": "09:45",
              "real_mw": 5920,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5930
            },
            {
              "hour": "10:00",
              "real_mw": 5930,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5950
            },
            {
              "hour": "10:15",
              "real_mw": 5910,
              "forecast_d2": 5950,
              "forecast_d1": 5970,
              "forecast_8h": 5910
            },
            {
              "hour": "10:30",
              "real_mw": 5920,
              "forecast_d2": 5930,
              "forecast_d1": 5950,
              "forecast_8h": 5880
            },
            {
              "hour": "10:45",
              "real_mw": 5830,
              "forecast_d2": 5880,
              "forecast_d1": 5930,
              "forecast_8h": 5850
            },
            {
              "hour": "11:00",
              "real_mw": 5760,
              "forecast_d2": 5840,
              "forecast_d1": 5890,
              "forecast_8h": 5820
            },
            {
              "hour": "11:15",
              "real_mw": 5780,
              "forecast_d2": 5820,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            },
            {
              "hour": "11:30",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5880,
              "forecast_8h": 5780
            },
            {
              "hour": "11:45",
              "real_mw": 5710,
              "forecast_d2": 5790,
              "forecast_d1": 5870,
              "forecast_8h": 5790
            },
            {
              "hour": "12:00",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            },
            {
              "hour": "12:15",
              "real_mw": 5790,
              "forecast_d2": 5790,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            }
          ],
          "tema": "T1"
        }
      ]
    },
    {
      "id": "recovery-blackstart",
      "name": "Restoration and Black-Start",
      "icon": "🔄",
      "color": "hsl(140 60% 50%)",
      "tables": [
        {
          "id": "recuperacion-demanda-espana",
          "name": "Demand restoration during the post-blackout day (Spain)",
          "source": "REE press release 28-29 abril; smartgridsinfo",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "Local time CEST"
            },
            {
              "key": "porcentaje_recuperado",
              "label": "% Demand restored"
            },
            {
              "key": "mw_restablecidos",
              "label": "Restored demand (MW)"
            },
            {
              "key": "observaciones",
              "label": "Observations"
            }
          ],
          "data": [
            {
              "hora": "12:33:24 (28-A)",
              "porcentaje_recuperado": "0%",
              "mw_restablecidos": "0",
              "observaciones": "Zero energy"
            },
            {
              "hora": "17:00 (28-A)",
              "porcentaje_recuperado": "~5%",
              "mw_restablecidos": "~1.260",
              "observaciones": "Aldeadávila initiates black-start"
            },
            {
              "hora": "19:00 (28-A)",
              "porcentaje_recuperado": "35%",
              "mw_restablecidos": "~8.815",
              "observaciones": "Voltage in 7-8 autonomous communities"
            },
            {
              "hora": "22:00 (28-A)",
              "porcentaje_recuperado": "43-50%",
              "mw_restablecidos": "~10.825-12.600",
              "observaciones": ""
            },
            {
              "hora": "23:00 (28-A)",
              "porcentaje_recuperado": "61.35%",
              "mw_restablecidos": "~15.455",
              "observaciones": ""
            },
            {
              "hora": "00:00 (29-A)",
              "porcentaje_recuperado": "61%",
              "mw_restablecidos": "~15.300",
              "observaciones": "Restoration progressing"
            },
            {
              "hora": "04:00 (29-A)",
              "porcentaje_recuperado": "87.37%",
              "mw_restablecidos": "~22.000",
              "observaciones": "Transmission grid completed in Spain"
            },
            {
              "hora": "06:00 (29-A)",
              "porcentaje_recuperado": "99%",
              "mw_restablecidos": "~24.930",
              "observaciones": "Residual rural outages"
            },
            {
              "hora": "07:00 (29-A)",
              "porcentaje_recuperado": "99.95%",
              "mw_restablecidos": "~25.170",
              "observaciones": ""
            },
            {
              "hora": "14:36 (29-A)",
              "porcentaje_recuperado": "100%",
              "mw_restablecidos": "Normalized",
              "observaciones": "ENTSO-E status changes from Emergency to Alert"
            }
          ],
          "note": "Total restoration time Spain = ~16 h (transmission), Portugal = ~12 h.",
          "tema": "T6"
        },
        {
          "id": "tiempos-restauracion-islas",
          "name": "Comparison of restoration time by geographical island",
          "source": "ENTSO-E Final Report; POWER Magazine; Comité 28-A p. 62",
          "type": "table",
          "columns": [
            {
              "key": "zona",
              "label": "Zone"
            },
            {
              "key": "inicio_black_start",
              "label": "Black-start island initiation"
            },
            {
              "key": "hora_reposicion",
              "label": "Transmission restoration time"
            },
            {
              "key": "notas",
              "label": "Notes"
            }
          ],
          "data": [
            {
              "zona": "Aragón-Cataluña (via France)",
              "inicio_black_start": "12:44 (1st AC line F-E)",
              "hora_reposicion": "<17:00",
              "notas": "Re-energized from France"
            },
            {
              "zona": "Galicia-León",
              "inicio_black_start": "~13:30",
              "hora_reposicion": "<18:00",
              "notas": "Black-start of Duero hydropower"
            },
            {
              "zona": "Basque Country / North (via France)",
              "inicio_black_start": "13:35 (east line F-E)",
              "hora_reposicion": "<18:00",
              "notas": ""
            },
            {
              "zona": "Andalusia (via Morocco)",
              "inicio_black_start": "13:04 (Tarifa-Fardioua interconnection)",
              "hora_reposicion": "20:00-22:00",
              "notas": "900 MW from ONEE"
            },
            {
              "zona": "Tajo-Centro, Levante",
              "inicio_black_start": "several",
              "hora_reposicion": "after",
              "notas": "Some failed attempts"
            },
            {
              "zona": "Asturias-Cantabria",
              "inicio_black_start": "afternoon",
              "hora_reposicion": "after",
              "notas": "Retries required"
            },
            {
              "zona": "Portugal island 1 (Castelo do Bode)",
              "inicio_black_start": "16:11",
              "hora_reposicion": "22:30 (50%)",
              "notas": ""
            },
            {
              "zona": "Portugal island 2 (Tapada do Outeiro)",
              "inicio_black_start": "17:26",
              "hora_reposicion": "24:00 (80%)",
              "notas": "First synchronization 14:23"
            },
            {
              "zona": "Portugal-Spain re-synchronization",
              "inicio_black_start": "18:36 (220 kV)",
              "hora_reposicion": "00:22 (29-A)",
              "notas": "Complete RNT"
            }
          ],
          "note": "Several black-start attempts failed due to inability to maintain stable islands.",
          "tema": "T6"
        },
        {
          "id": "recuperacion-portugal",
          "name": "Demand restoration in Portugal (REN)",
          "source": "REN; PowerMag; ENTSO-E",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "Time WEST (UTC-1)"
            },
            {
              "key": "porcentaje_recuperado",
              "label": "% Demand restored PT"
            },
            {
              "key": "notas",
              "label": "Notes"
            }
          ],
          "data": [
            {
              "hora": "11:33 (blackout)",
              "porcentaje_recuperado": "0%",
              "notas": ""
            },
            {
              "hora": "16:00",
              "porcentaje_recuperado": "~10%",
              "notas": "First island"
            },
            {
              "hora": "17:00",
              "porcentaje_recuperado": "~20%",
              "notas": ""
            },
            {
              "hora": "22:30",
              "porcentaje_recuperado": "50%",
              "notas": ""
            },
            {
              "hora": "00:00 (29-A)",
              "porcentaje_recuperado": "80%",
              "notas": ""
            },
            {
              "hora": "03:00 (29-A)",
              "porcentaje_recuperado": "~100% distribution network",
              "notas": ""
            },
            {
              "hora": "11:22 PM 28-A",
              "porcentaje_recuperado": "RNT fully operational",
              "notas": "96% substations in 10.5h"
            }
          ],
          "note": "Portugal restored faster (12h vs 16h Spain).",
          "tema": "T6"
        },
        {
          "id": "centrales-black-start",
          "name": "Power plants with black-start capability activated on 28-A",
          "source": "ENTSO-E Factual Report; Comité 28-A; PowerMag; Portugal Resident",
          "type": "table",
          "columns": [
            {
              "key": "pais",
              "label": "Country"
            },
            {
              "key": "central",
              "label": "Power plant"
            },
            {
              "key": "tecnologia",
              "label": "Technology"
            },
            {
              "key": "potencia_nominal_mw",
              "label": "Rated power (MW)"
            },
            {
              "key": "hora_activacion",
              "label": "Activation time"
            },
            {
              "key": "hora_isla",
              "label": "Island established time"
            },
            {
              "key": "area_servida",
              "label": "Area served"
            }
          ],
          "data": [
            {
              "pais": "Spain",
              "central": "Aldeadávila",
              "tecnologia": "Hydro (Duero)",
              "potencia_nominal_mw": "~1,140",
              "hora_activacion": "~13:30",
              "hora_isla": "18:36",
              "area_servida": "Duero, connection with PT"
            },
            {
              "pais": "Spain",
              "central": "Other hydro plants (Duero/Tajo)",
              "tecnologia": "Hydro",
              "potencia_nominal_mw": "several",
              "hora_activacion": "13:30+",
              "hora_isla": "",
              "area_servida": "Several islands"
            },
            {
              "pais": "Portugal",
              "central": "Castelo do Bode",
              "tecnologia": "Hydro",
              "potencia_nominal_mw": "138",
              "hora_activacion": "12:35",
              "hora_isla": "16:11",
              "area_servida": "Central PT"
            },
            {
              "pais": "Portugal",
              "central": "Tapada do Outeiro",
              "tecnologia": "CCGT",
              "potencia_nominal_mw": "990",
              "hora_activacion": "12:43",
              "hora_isla": "17:26",
              "area_servida": "Northern PT"
            },
            {
              "pais": "Morocco",
              "central": "ONEE System",
              "tecnologia": "mixed",
              "potencia_nominal_mw": "900",
              "hora_activacion": "13:04",
              "hora_isla": "",
              "area_servida": "Andalusia"
            },
            {
              "pais": "France",
              "central": "several RTE",
              "tecnologia": "mixed",
              "potencia_nominal_mw": "up to 2,000",
              "hora_activacion": "12:44",
              "hora_isla": "",
              "area_servida": "Aragon-Catalonia, Basque Country"
            }
          ],
          "note": "Dependence on hydro with reservoir for black-start limits speed during drought.",
          "tema": "T6"
        },
        {
          "id": "eas-state-changes",
          "name": "State Changes in ENTSO-E EAS",
          "source": "Informe ENTSO-E",
          "type": "table",
          "columns": [
            {
              "key": "datetime",
              "label": "Date/Time"
            },
            {
              "key": "tso",
              "label": "TSO"
            },
            {
              "key": "from_state",
              "label": "From"
            },
            {
              "key": "to_state",
              "label": "To"
            }
          ],
          "data": [
            {
              "datetime": "28 April, 12:40",
              "tso": "REN",
              "from_state": "Normal",
              "to_state": "blackout"
            },
            {
              "datetime": "28 April, 12:40",
              "tso": "RE",
              "from_state": "Normal",
              "to_state": "Blackout"
            },
            {
              "datetime": "28 April, 12:49",
              "tso": "Swissgrid (CC South)",
              "from_state": "Normal",
              "to_state": "Emergency"
            },
            {
              "datetime": "28 April, 12:49",
              "tso": "Amprion (CC North)",
              "from_state": "Normal",
              "to_state": "Emergency"
            },
            {
              "datetime": "28 April, 12:50",
              "tso": "RTE",
              "from_state": "Normal",
              "to_state": "Emergency"
            },
            {
              "datetime": "28 April, 13:10",
              "tso": "RE",
              "from_state": "Blackout",
              "to_state": "Restoration"
            },
            {
              "datetime": "28 April, 14:35",
              "tso": "RTE",
              "from_state": "Emergency",
              "to_state": "Alert"
            },
            {
              "datetime": "28 April, 17:05",
              "tso": "REN",
              "from_state": "Blackout",
              "to_state": "Restoration"
            },
            {
              "datetime": "29 April, 02:13",
              "tso": "REN",
              "from_state": "Restoration",
              "to_state": "Emergency"
            },
            {
              "datetime": "29 April, 03:00",
              "tso": "RE",
              "from_state": "Restoration",
              "to_state": "Emergency"
            },
            {
              "datetime": "29 April, 11:15",
              "tso": "Swissgrid (CC South)",
              "from_state": "Emergency",
              "to_state": "Normal"
            },
            {
              "datetime": "29 April, 11:15",
              "tso": "Amprion (CC North)",
              "from_state": "Emergency",
              "to_state": "normal"
            },
            {
              "datetime": "29 April, 11:20",
              "tso": "RTE",
              "from_state": "alert",
              "to_state": "normal"
            },
            {
              "datetime": "29 April, 14:40",
              "tso": "RE",
              "from_state": "emergency",
              "to_state": "alert"
            },
            {
              "datetime": "29 April, 14:40",
              "tso": "REN",
              "from_state": "emergency",
              "to_state": "alert"
            },
            {
              "datetime": "30 April, 12:40",
              "tso": "RE",
              "from_state": "alert",
              "to_state": "normal"
            },
            {
              "datetime": "30 April, 12:50",
              "tso": "REN",
              "from_state": "alert",
              "to_state": "normal"
            }
          ],
          "tema": "T6"
        }
      ]
    },
    {
      "id": "socioeconomic-impact",
      "name": "Socioeconomic Impact and Lessons",
      "icon": "💰",
      "color": "hsl(0 0% 60%)",
      "tables": [
        {
          "id": "costes-economicos",
          "name": "Estimated economic costs of the 28-A blackout",
          "source": "CEOE; Ministerio Economía; Repsol/Iberdrola earnings; RBC Capital Markets; Slimstock",
          "type": "table",
          "columns": [
            {
              "key": "estimacion",
              "label": "Estimate / Concept"
            },
            {
              "key": "importe_me",
              "label": "Amount (M€)"
            },
            {
              "key": "fuente",
              "label": "Source"
            }
          ],
          "data": [
            {
              "estimacion": "CEOE Estimate",
              "importe_me": "1.600",
              "fuente": "0.1% of Spain's GDP"
            },
            {
              "estimacion": "Ministry of Economy Estimate (high)",
              "importe_me": "800",
              "fuente": "Carlos Cuerpo"
            },
            {
              "estimacion": "Ministry of Economy Estimate (actual)",
              "importe_me": "400",
              "fuente": ""
            },
            {
              "estimacion": "RBC Capital Markets Estimate",
              "importe_me": "2,250–4,500",
              "fuente": "Reuters 29-Apr-2025"
            },
            {
              "estimacion": "Repsol (Cartagena + Puertollano shutdown)",
              "importe_me": "175",
              "fuente": "Earnings Q2"
            },
            {
              "estimacion": "Iberdrola (operational impact)",
              "importe_me": ">100",
              "fuente": "Earnings"
            },
            {
              "estimacion": "Meat industry",
              "importe_me": "190",
              "fuente": "ANGED"
            },
            {
              "estimacion": "Payment system failure",
              "importe_me": "55%",
              "fuente": "Ministry of Economy"
            },
            {
              "estimacion": "Final range of independent estimates",
              "importe_me": "1,000-2,250",
              "fuente": "Libre Mercado"
            },
            {
              "estimacion": "Daily GDP Spain",
              "importe_me": "~4,500",
              "fuente": "Reference"
            }
          ],
          "note": "Very wide range (200-4,500 M€) reflects the difficulty of quantifying indirect ENS and reputational impact.",
          "tema": "T7"
        },
        {
          "id": "comparativa-blackouts-historicos",
          "name": "Comparison with historical European blackouts",
          "source": "IEA; FERC; ENTSO-E; UCTE official investigation report (IEEE Xplore, 2004)",
          "type": "table",
          "columns": [
            {
              "key": "evento",
              "label": "Event"
            },
            {
              "key": "fecha",
              "label": "Date"
            },
            {
              "key": "demanda_perdida",
              "label": "Lost demand (MW/GW)"
            },
            {
              "key": "personas_afectadas",
              "label": "Affected people (M)"
            },
            {
              "key": "duracion_h",
              "label": "Duration (h)"
            },
            {
              "key": "ens_estimada",
              "label": "Estimated ENS (GWh)"
            },
            {
              "key": "causa_raiz",
              "label": "Root cause"
            }
          ],
          "data": [
            {
              "evento": "Iberian blackout 28-A",
              "fecha": "28-Apr-2025",
              "demanda_perdida": "31 GW load + ~15 GW gen.",
              "personas_afectadas": "47",
              "duracion_h": "~10-16",
              "ens_estimada": "n/a",
              "causa_raiz": "Overvoltage + IBR cascade"
            },
            {
              "evento": "Italy 2003",
              "fecha": "28-Sep-2003",
              "demanda_perdida": "27.7 GW",
              "personas_afectadas": "56",
              "duracion_h": "18",
              "ens_estimada": "180",
              "causa_raiz": "Lukmanier-Mettlen line + cascade"
            },
            {
              "evento": "Northeast USA/Canada 2003",
              "fecha": "14-Aug-2003",
              "demanda_perdida": "61.8 GW",
              "personas_afectadas": "55",
              "duracion_h": "up to 48",
              "ens_estimada": "~46",
              "causa_raiz": "FirstEnergy line + software"
            },
            {
              "evento": "Balkans (North)",
              "fecha": "21-Jun-2024",
              "demanda_perdida": "n/a",
              "personas_afectadas": "several M",
              "duracion_h": "<8",
              "ens_estimada": "n/a",
              "causa_raiz": "Transmission overload"
            }
          ],
          "note": "Places April 28 as a 'first of its kind' event (overvoltage-driven), distinct from typical underfrequency collapses.",
          "tema": "T7"
        },
        {
          "id": "comparativa-conclusiones-entidades",
          "name": "Comparison of conclusions by investigating entity",
          "source": "Comité 28-A; REE; ENTSO-E (Factual + Final); Compass Lexecon/INESC TEC",
          "type": "table",
          "columns": [
            {
              "key": "entidad",
              "label": "Entity"
            },
            {
              "key": "fecha",
              "label": "Date"
            },
            {
              "key": "paginas",
              "label": "Pages"
            },
            {
              "key": "causa_principal",
              "label": "Identified main cause"
            },
            {
              "key": "responsable",
              "label": "Responsible party indicated"
            }
          ],
          "data": [
            {
              "entidad": "REE",
              "fecha": "18-Jun-2025",
              "paginas": "15",
              "causa_principal": "Overvoltage due to non-compliance with P.O. 7.4",
              "responsable": "RCR and conventional generators non-compliance"
            },
            {
              "entidad": "Government (Committee 28-A)",
              "fecha": "17-Jun-2025",
              "paginas": "182",
              "causa_principal": "Multifactorial: overvoltage + insufficient planning",
              "responsable": "Multi-allocation: REE + some electric utilities"
            },
            {
              "entidad": "Compass Lexecon/INESC TEC",
              "fecha": "28-Jul-2025",
              "paginas": "62",
              "causa_principal": "Systemic voltage control failure by REE",
              "responsable": "REE (reactive power management)"
            },
            {
              "entidad": "ENTSO-E Factual Report",
              "fecha": "3-Oct-2025",
              "paginas": "262",
              "causa_principal": "Overvoltage + cascade",
              "responsable": "(without attribution)"
            },
            {
              "entidad": "ENTSO-E Final Report",
              "fecha": "20-Mar-2026",
              "paginas": "440-472",
              "causa_principal": "Combination: oscillations, voltage control gaps, generator disconnection",
              "responsable": "Multifactorial"
            }
          ],
          "note": "Comparative table suitable for the 'discussion' section of the TFG.",
          "tema": "T9"
        },
        {
          "id": "unavailable-capacity",
          "name": "Unavailable and Installed Power by Technology",
          "source": "Informe Gobierno (REE)",
          "type": "table",
          "columns": [
            {
              "key": "technology",
              "label": "Technology"
            },
            {
              "key": "unavailable_mw",
              "label": "Unavailable Power (MW)"
            },
            {
              "key": "installed_mw",
              "label": "Installed Power (MW)"
            }
          ],
          "data": [
            {
              "technology": "Coal",
              "unavailable_mw": 903.5,
              "installed_mw": 1820
            },
            {
              "technology": "Combined cycle",
              "unavailable_mw": 7426.3,
              "installed_mw": 24562
            },
            {
              "technology": "Fuel-gas",
              "unavailable_mw": 0,
              "installed_mw": 8
            },
            {
              "technology": "Nuclear",
              "unavailable_mw": 3078.6,
              "installed_mw": 7117
            },
            {
              "technology": "Pumped-storage turbine operation",
              "unavailable_mw": 1392.1,
              "installed_mw": 3331
            }
          ],
          "note": "Values prior to the incident. Unavailable power considering complete hourly periods.",
          "tema": "T1"
        },
        {
          "id": "compass-lexecon",
          "name": "Comparison of Conclusions (Compass Lexecon / INESC TEC)",
          "source": "Informe Compass Lexecon",
          "type": "table",
          "columns": [
            {
              "key": "entity",
              "label": "Entity"
            },
            {
              "key": "point1",
              "label": "1"
            },
            {
              "key": "point2",
              "label": "2"
            },
            {
              "key": "point3",
              "label": "3"
            },
            {
              "key": "point4",
              "label": "4"
            },
            {
              "key": "point5",
              "label": "5"
            },
            {
              "key": "point6",
              "label": "6"
            },
            {
              "key": "point7",
              "label": "7"
            },
            {
              "key": "point8",
              "label": "8"
            }
          ],
          "data": [
            {
              "entity": "Government of Spain",
              "point1": "Not analyzed",
              "point2": "Relevant fluctuations occurred",
              "point3": "Lowest number of coupled thermal units of the year",
              "point4": "Relevant fluctuations occurred",
              "point5": "Changing the interconnection to fixed mode worsened the situation",
              "point6": "Did not comply with regulations",
              "point7": "Vicious circle of overvoltage and some incorrect tripping",
              "point8": "Not analyzed"
            },
            {
              "entity": "Red Eléctrica",
              "point1": "Not analyzed",
              "point2": "Not analyzed",
              "point3": "It was adequate",
              "point4": "The situation was stable",
              "point5": "Changing the interconnection to fixed mode did NOT worsen the situation",
              "point6": "Did not comply with regulations",
              "point7": "Incorrect tripping",
              "point8": "Not analyzed"
            },
            {
              "entity": "Compass Lexecon / INESC TEC",
              "point1": "Have increased in recent years",
              "point2": "Relevant fluctuations occurred",
              "point3": "The lowest voltage control capacity of the year and more scarce in the south",
              "point4": "Relevant fluctuations occurred",
              "point5": "Pending analysis",
              "point6": "There was not enough conventional generation to control voltage",
              "point7": "Simultaneous failures without a systemic cause seem unlikely",
              "point8": "Decrease in fluctuations"
            }
          ],
          "tema": "T9"
        }
      ]
    }
  ]
}
```


--- FILE: static/data/processed/forensic_categories_zh-Hans.json ---
```json
{
  "categories": [
    {
      "id": "structural-context",
      "name": "结构背景与市场",
      "icon": "🏭",
      "color": "hsl(200 80% 60%)",
      "tables": [
        {
          "id": "mix-generacion-12-30",
          "name": "2025年4月28日12:30（中欧夏令时）西班牙半岛电力系统发电组合",
          "source": "Comité 28-A (Informe no confidencial, p. 38); REE Press Office; ENTSO-E Factual Report",
          "type": "table",
          "columns": [
            {
              "key": "tecnologia",
              "label": "技术类型"
            },
            {
              "key": "porcentaje_mix",
              "label": "占比（%）"
            },
            {
              "key": "mw_estimados",
              "label": "预估兆瓦数"
            },
            {
              "key": "notas",
              "label": "备注"
            }
          ],
          "data": [
            {
              "tecnologia": "太阳能光伏",
              "porcentaje_mix": "约53–59%",
              "mw_estimados": "18.068",
              "notas": "西班牙电网公司：占半岛电力组合的53.34%"
            },
            {
              "tecnologia": "风能",
              "porcentaje_mix": "约12%",
              "mw_estimados": "约3,020",
              "notas": "分布于北部和南部"
            },
            {
              "tecnologia": "核能",
              "porcentaje_mix": "10%",
              "mw_estimados": "约2,518",
              "notas": "7座反应堆中4座并网运行"
            },
            {
              "tecnologia": "水力发电（含径流式）",
              "porcentaje_mix": "约8%",
              "mw_estimados": "约2,015",
              "notas": "无抽水蓄能发电"
            },
            {
              "tecnologia": "联合循环燃气轮机",
              "porcentaje_mix": "3%（西班牙电网公司数据约4.82%）",
              "mw_estimados": "1.635",
              "notas": "21台可用机组中6台并网运行"
            },
            {
              "tecnologia": "热电联产+废弃物发电",
              "porcentaje_mix": "4%",
              "mw_estimados": "约1,007",
              "notas": "受第413/2014号皇家法令约束的特殊制度发电"
            },
            {
              "tecnologia": "煤炭",
              "porcentaje_mix": "1%",
              "mw_estimados": "约252",
              "notas": "5台机组中1台并网运行"
            },
            {
              "tecnologia": "总需求",
              "porcentaje_mix": "100%",
              "mw_estimados": "25,184兆瓦",
              "notas": "历史峰值的56%"
            }
          ],
          "note": "该图展示了低负荷与逆变器-可再生能源主导的典型场景，触发了电压控制警报。同步发电仅占18%，仅有11台常规机组并网（2025年最低值）。",
          "tema": "T1"
        },
        {
          "id": "indisponibilidad-generacion-convencional",
          "name": "2025年4月28日常规发电不可用情况（按技术类型）",
          "source": "Informe de Restricciones Técnicas REE (cifras propias) vs Informe Comité 28-A (Tabla 1, p. 20)",
          "type": "table",
          "columns": [
            {
              "key": "tecnologia",
              "label": "技术类型"
            },
            {
              "key": "mw_indisponibles_ree",
              "label": "不可用容量（REE数据，单位：MW）"
            },
            {
              "key": "mw_indisponibles_comite",
              "label": "不可用容量（委员会数据，单位：MW）"
            },
            {
              "key": "mw_instalados",
              "label": "装机容量（MW）"
            },
            {
              "key": "porcentaje_indisponible",
              "label": "不可用比例（委员会数据，%）"
            }
          ],
          "data": [
            {
              "tecnologia": "联合循环燃气轮机",
              "mw_indisponibles_ree": "9,436.4",
              "mw_indisponibles_comite": "7,426.3",
              "mw_instalados": "24.562",
              "porcentaje_indisponible": "30.2%"
            },
            {
              "tecnologia": "核能",
              "mw_indisponibles_ree": "4,096.2",
              "mw_indisponibles_comite": "3,078.6",
              "mw_instalados": "7.117",
              "porcentaje_indisponible": "43.3%"
            },
            {
              "tecnologia": "抽水蓄能（发电模式）",
              "mw_indisponibles_ree": "1,392.1",
              "mw_indisponibles_comite": "1,392.1",
              "mw_instalados": "3.331",
              "porcentaje_indisponible": "41.8%"
            },
            {
              "tecnologia": "煤炭",
              "mw_indisponibles_ree": "903.5",
              "mw_indisponibles_comite": "903.5",
              "mw_instalados": "1.820",
              "porcentaje_indisponible": "49.6%"
            },
            {
              "tecnologia": "燃气",
              "mw_indisponibles_ree": "0.0",
              "mw_indisponibles_comite": "0.0",
              "mw_instalados": "8",
              "porcentaje_indisponible": "0%"
            },
            {
              "tecnologia": "总计",
              "mw_indisponibles_ree": "15.829",
              "mw_indisponibles_comite": "12.800",
              "mw_instalados": "36.838",
              "porcentaje_indisponible": "34.7%"
            }
          ],
          "note": "REE与政府间3028兆瓦的数据差异引发争议：系统运营商是否拥有足够的同步容量？Compass Lexecon/INESC TEC指出，08:00至10:00（中欧时间）期间REE解列了15台联合循环燃气轮机。",
          "tema": "T1"
        },
        {
          "id": "inercia-sistema-htot",
          "name": "4月28日系统惯性H_tot（秒）",
          "source": "ENTSO-E Factual Report p. 36; REE 18-jun-2025 p. 11",
          "type": "table",
          "columns": [
            {
              "key": "metrica",
              "label": "指标"
            },
            {
              "key": "valor",
              "label": "数值"
            },
            {
              "key": "comentario",
              "label": "说明"
            }
          ],
          "data": [
            {
              "metrica": "伊比利亚总惯量（级联前）",
              "valor": "2.21–2.71秒",
              "comentario": "ENTSO-E报告的频带"
            },
            {
              "metrica": "ENTSO-E最低建议值",
              "valor": "2.0秒",
              "comentario": "符合裕度要求"
            },
            {
              "metrica": "ENTSO-E最终报告结论",
              "valor": "“更大惯量本无法避免失步”",
              "comentario": "2026年3月"
            }
          ],
          "note": "确认惯性虽低，但并非根本原因；问题在于电压控制，而非惯性频率变化率。",
          "tema": "T2"
        },
        {
          "id": "precios-marginales-omie",
          "name": "2025年4月28日与29日OMIE小时边际电价（西班牙，单位：欧元/兆瓦时）",
          "source": "OMIE Mercado Diario; Infobae; OCU; Grupo ASE",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "时段"
            },
            {
              "key": "precio_28a",
              "label": "4月28日西班牙电价（欧元/兆瓦时）"
            },
            {
              "key": "precio_29a",
              "label": "4月29日西班牙电价（欧元/兆瓦时）"
            },
            {
              "key": "observacion",
              "label": "观察"
            }
          ],
          "data": [
            {
              "hora": "10–11",
              "precio_28a": "~0",
              "precio_29a": "0.00",
              "observacion": "接近零的价格"
            },
            {
              "hora": "11–12",
              "precio_28a": "~0",
              "precio_29a": "-0.30",
              "observacion": ""
            },
            {
              "hora": "12–13（停电时段）",
              "precio_28a": "~ -1（负值）",
              "precio_29a": "-1.01",
              "observacion": "OMIE停电前数据"
            },
            {
              "hora": "13–14",
              "precio_28a": "无数据",
              "precio_29a": "-1.90",
              "observacion": "29日最低值"
            },
            {
              "hora": "14–15",
              "precio_28a": "无数据",
              "precio_29a": "-1.66",
              "observacion": ""
            },
            {
              "hora": "18–19",
              "precio_28a": "无数据",
              "precio_29a": "0.00",
              "observacion": ""
            },
            {
              "hora": "当日平均价格",
              "precio_28a": "26.81（四月均值）",
              "precio_29a": "5.79",
              "observacion": "-68% 对比 28"
            },
            {
              "hora": "30-A 中期",
              "precio_28a": "",
              "precio_29a": "31.87",
              "observacion": "+450%（调节服务）"
            }
          ],
          "note": "午间负电价凸显可再生能源过剩；停电后调频服务成本飙升。",
          "tema": "T5"
        },
        {
          "id": "programa-intercambios-pre-apagon",
          "name": "停电前国际交换计划（单位：MW，出口方向）",
          "source": "ENTSO-E Expert Panel 9-may-2025; REE 18-jun-2025 p. 4",
          "type": "table",
          "columns": [
            {
              "key": "frontera",
              "label": "边境"
            },
            {
              "key": "mw_pre_apagon",
              "label": "停电前（MW）"
            },
            {
              "key": "sentido",
              "label": "流向"
            },
            {
              "key": "mw_post_mitigacion",
              "label": "12:22缓解措施后"
            }
          ],
          "data": [
            {
              "frontera": "西班牙 → 法国（交流 + 高压直流）",
              "mw_pre_apagon": "3,000（最大约5,000）",
              "sentido": "出口",
              "mw_post_mitigacion": "1,000（高压直流）+ 交流约0"
            },
            {
              "frontera": "圣略雅-拜萨斯高压直流",
              "mw_pre_apagon": "1.000",
              "sentido": "西班牙→法国",
              "mw_post_mitigacion": "保持在PMODE1模式"
            },
            {
              "frontera": "西班牙 → 葡萄牙",
              "mw_pre_apagon": "2.545",
              "sentido": "出口",
              "mw_post_mitigacion": "2,000（减少545）"
            },
            {
              "frontera": "西班牙 → 摩洛哥",
              "mw_pre_apagon": "800",
              "sentido": "出口",
              "mw_post_mitigacion": "800"
            }
          ],
          "note": "运营商通过减少潮流改善阻尼，但电流降低导致线路无功消耗减少、电压升高——关键副作用。",
          "tema": "T4"
        }
      ]
    },
    {
      "id": "oscillations-dynamics",
      "name": "振荡与动态稳定性",
      "icon": "📈",
      "color": "hsl(280 70% 60%)",
      "tables": [
        {
          "id": "modos-oscilatorios",
          "name": "崩溃前识别的振荡模式",
          "source": "REE pp. 3-5; ENTSO-E Factual Report p. 53; Comité 28-A pp. 31-34; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "中欧夏令时"
            },
            {
              "key": "frecuencia_hz",
              "label": "频率（赫兹）"
            },
            {
              "key": "tipo",
              "label": "类型"
            },
            {
              "key": "amplitud_mhz",
              "label": "振幅（毫赫兹）"
            },
            {
              "key": "damping",
              "label": "初始→最终阻尼"
            },
            {
              "key": "voltaje_pkp_kv",
              "label": "400千伏电压峰峰值"
            }
          ],
          "data": [
            {
              "hora": "10:30",
              "frecuencia_hz": "0.2",
              "tipo": "跨区域 西-中-东",
              "amplitud_mhz": "4 kV",
              "damping": "正常",
              "voltaje_pkp_kv": "<1% 额定电压"
            },
            {
              "hora": "11:03",
              "frecuencia_hz": "0.2",
              "tipo": "跨区域",
              "amplitud_mhz": "7 kV",
              "damping": "正常",
              "voltaje_pkp_kv": "约2% 额定电压"
            },
            {
              "hora": "11:23",
              "frecuencia_hz": "0.2",
              "tipo": "跨区域",
              "amplitud_mhz": "6 kV",
              "damping": "正常",
              "voltaje_pkp_kv": "约1.5% 额定电压"
            },
            {
              "hora": "12:03-12:08",
              "frecuencia_hz": "0.63（强制）",
              "tipo": "本地IBR（巴达霍斯）",
              "amplitud_mhz": "70 mHz",
              "damping": "",
              "voltaje_pkp_kv": "30 kV（阿尔马拉斯31.2；阿罗约SS 32.7）"
            },
            {
              "hora": "12:00",
              "frecuencia_hz": "0.21",
              "tipo": "区域间",
              "amplitud_mhz": "",
              "damping": "20%（正常）",
              "voltaje_pkp_kv": ""
            },
            {
              "hora": "持续12:03",
              "frecuencia_hz": "0.21",
              "tipo": "区域间（受激）",
              "amplitud_mhz": "",
              "damping": "下降至5%",
              "voltaje_pkp_kv": ""
            },
            {
              "hora": "12:19-12:22",
              "frecuencia_hz": "0.21",
              "tipo": "区域间 W-C-E",
              "amplitud_mhz": "200 mHz（前次的3倍）",
              "damping": "",
              "voltaje_pkp_kv": "阿尔马拉斯23 kV峰峰值"
            }
          ],
          "note": "0.63赫兹强迫振荡（可能源于巴达霍斯某光伏电站）成为触发因素，激活了缓解措施，却反而导致电压控制恶化。",
          "tema": "T2"
        },
        {
          "id": "evolucion-frecuencia-rocof",
          "name": "关键27秒内的频率变化与RoCoF",
          "source": "REE pp. 8-12; Comité 28-A pp. 41-58; Compass Lexecon ¶189",
          "type": "table",
          "columns": [
            {
              "key": "timestamp",
              "label": "中欧夏令时时间戳"
            },
            {
              "key": "frecuencia_hz",
              "label": "频率（赫兹）"
            },
            {
              "key": "evento",
              "label": "关联事件"
            },
            {
              "key": "rocof_estimado",
              "label": "估算的RoCoF"
            }
          ],
          "data": [
            {
              "timestamp": "12:32:57.140",
              "frecuencia_hz": "50.00",
              "evento": "格拉纳达跳闸（-355 MW）",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:16.460",
              "frecuencia_hz": "约49.98",
              "evento": "巴达霍斯跳闸（-582 MW）",
              "rocof_estimado": "-55 mHz/事件"
            },
            {
              "timestamp": "12:33:17.520",
              "frecuencia_hz": "约49.95",
              "evento": "巴达霍斯光伏跳闸（-145 MW）",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:17.780",
              "frecuencia_hz": "约49.87",
              "evento": "塞维利亚跳闸（-550 MW）",
              "rocof_estimado": "累计-75 mHz"
            },
            {
              "timestamp": "12:33:19.620",
              "frecuencia_hz": "约49.70",
              "evento": "失步开始",
              "rocof_estimado": "进口F从1000→3,807 MW"
            },
            {
              "timestamp": "12:33:20.180",
              "frecuencia_hz": "49.50",
              "evento": "低频减载泵站第1级",
              "rocof_estimado": "频率变化率加速"
            },
            {
              "timestamp": "12:33:20.500",
              "frecuencia_hz": "49.30",
              "evento": "低频减载泵站第2级",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:20.600",
              "frecuencia_hz": "49.00",
              "evento": "低频减载负荷第1级",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:21.380",
              "frecuencia_hz": "48.40",
              "evento": "UFLS 负荷削减第4步",
              "rocof_estimado": ">1.0 Hz/s"
            },
            {
              "timestamp": "12:33:21.535",
              "frecuencia_hz": "48.458",
              "evento": "埃尔纳尼 400 kV 断路器断开（F相分离）",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:22.040",
              "frecuencia_hz": "48.00",
              "evento": "UFLS 负荷削减第6步（最终）",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:22.702",
              "frecuencia_hz": "47.79",
              "evento": "莱万特联合循环燃气轮机跳闸",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:23.515",
              "frecuencia_hz": "46.15",
              "evento": "核电机组跳闸",
              "rocof_estimado": ">1.5 Hz/s"
            },
            {
              "timestamp": "12:33:23.590",
              "frecuencia_hz": "45.89",
              "evento": "其他核电机组跳闸",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:23.960",
              "frecuencia_hz": "崩溃",
              "evento": "高压直流输电闭锁",
              "rocof_estimado": ""
            },
            {
              "timestamp": "12:33:24.0",
              "frecuencia_hz": "0",
              "evento": "全面崩溃",
              "rocof_estimado": ""
            }
          ],
          "note": "最终频率下降（>1.5赫兹/秒）超过同步电机RoCoF保护标准阈值。",
          "tema": "T2"
        },
        {
          "id": "tensiones-nudos-criticos",
          "name": "级联期间400千伏关键节点电压（千伏）",
          "source": "REE pp. 8-14; Comité 28-A pp. 89-96",
          "type": "table",
          "columns": [
            {
              "key": "subestacion",
              "label": "变电站/省份"
            },
            {
              "key": "v_pre_evento",
              "label": "事件前电压（千伏）"
            },
            {
              "key": "v_post_evento",
              "label": "事件后电压（千伏）"
            },
            {
              "key": "v_lim_sup",
              "label": "电压上限（千伏）"
            },
            {
              "key": "notas",
              "label": "备注"
            }
          ],
          "data": [
            {
              "subestacion": "格拉纳达 400 kV（E1，12:32:57）",
              "v_pre_evento": "418.0",
              "v_post_evento": "423.9",
              "v_lim_sup": "435",
              "notas": "220 kV 母线：242.5 kV（1.10 pu）→ 变压器跳闸"
            },
            {
              "subestacion": "奥尔梅迪利亚",
              "v_pre_evento": "413（12:32:00）",
              "v_post_evento": "428（12:32:57）",
              "v_lim_sup": "435",
              "notas": "57秒内上升15 kV"
            },
            {
              "subestacion": "圣塞尔万溪",
              "v_pre_evento": "411",
              "v_post_evento": "424",
              "v_lim_sup": "435",
              "notas": "上升13 kV"
            },
            {
              "subestacion": "巴达霍斯B变电站（E2，12:33:16）",
              "v_pre_evento": "约430–435",
              "v_post_evento": "443",
              "v_lim_sup": "435",
              "notas": "保护录波"
            },
            {
              "subestacion": "阿尔马拉斯 400 kV",
              "v_pre_evento": "395–410（振荡期间）",
              "v_post_evento": "",
              "v_lim_sup": "435",
              "notas": "在0.21赫兹振荡期间"
            },
            {
              "subestacion": "卡塞雷斯220千伏（E5）",
              "v_pre_evento": "",
              "v_post_evento": "240.89",
              "v_lim_sup": "253（60分钟）",
              "notas": "内部过电压跳闸"
            },
            {
              "subestacion": "塞维利亚400千伏（E3）",
              "v_pre_evento": "",
              "v_post_evento": "437.91",
              "v_lim_sup": "435",
              "notas": "跳闸前"
            },
            {
              "subestacion": "巴尔德卡瓦列罗斯400千伏",
              "v_pre_evento": "",
              "v_post_evento": ">480",
              "v_lim_sup": "440（60分钟）/ 480（暂态）",
              "notas": "巴尔德卡瓦列罗斯-马吉利亚线路跳闸"
            },
            {
              "subestacion": "核电站（跳闸前峰值）",
              "v_pre_evento": "",
              "v_post_evento": "469.3",
              "v_lim_sup": "480",
              "notas": "断开前瞬间"
            }
          ],
          "note": "反驳“普遍过电压超出限值”的说法：输电电压主要维持在375-435千伏范围内；故障发生在220千伏/母线侧。",
          "tema": "T2"
        },
        {
          "id": "hvdc-santa-llogaia-parametros",
          "name": "圣略加-拜萨斯高压直流联络线：运行参数",
          "source": "REE p. 14; Comité 28-A p. 33; ENTSO-E Factual Report",
          "type": "table",
          "columns": [
            {
              "key": "parametro",
              "label": "参数"
            },
            {
              "key": "valor",
              "label": "数值/状态"
            },
            {
              "key": "observacion",
              "label": "观察"
            }
          ],
          "data": [
            {
              "parametro": "额定容量",
              "valor": "2×1000兆瓦（2个VSC极）",
              "observacion": ""
            },
            {
              "parametro": "事件前传输功率",
              "valor": "1000兆瓦（西班牙→法国）",
              "observacion": "PMODE3模式（交流仿真）"
            },
            {
              "parametro": "模式切换",
              "valor": "PMODE3 → PMODE1 于12:11",
              "observacion": "设定值1000兆瓦输出"
            },
            {
              "parametro": "级联期间行为",
              "valor": "保持1000兆瓦输出",
              "observacion": "无功率频率控制功能"
            },
            {
              "parametro": "HVDC闭锁",
              "valor": "12:33:23.960",
              "observacion": "圣塔略加亚崩溃后"
            },
            {
              "parametro": "净效应",
              "valor": "伊比利亚半岛虚拟缺额+1000兆瓦",
              "observacion": "加速频率崩溃"
            }
          ],
          "note": "典型范例：无频率响应的高压直流联络线如何加剧崩溃。",
          "tema": "T4"
        },
        {
          "id": "intercambios-internacionales-minuto",
          "name": "国际交换逐分钟数据（T-30至T+30）",
          "source": "ENTSO-E; REE; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "tiempo",
              "label": "时间（相对于12:33的分钟数）"
            },
            {
              "key": "esp_fra_mw",
              "label": "西班牙-法国（兆瓦）"
            },
            {
              "key": "esp_por_mw",
              "label": "西班牙-葡萄牙（兆瓦）"
            },
            {
              "key": "esp_mar_mw",
              "label": "西班牙-摩洛哥（兆瓦）"
            },
            {
              "key": "notas",
              "label": "备注"
            }
          ],
          "data": [
            {
              "tiempo": "T-30（12:03）",
              "esp_fra_mw": "+3000输出",
              "esp_por_mw": "+2545输出",
              "esp_mar_mw": "+800输出",
              "notas": "缓解前"
            },
            {
              "tiempo": "T-25（12:08）",
              "esp_fra_mw": "+1500输出（-800减少）",
              "esp_por_mw": "+2545输出",
              "esp_mar_mw": "+800",
              "notas": "第一次振荡后"
            },
            {
              "tiempo": "T-14（12:19）",
              "esp_fra_mw": "+1,000 兆瓦（高压直流输电）",
              "esp_por_mw": "+2,545 兆瓦",
              "esp_mar_mw": "+800",
              "notas": "第二次振荡后"
            },
            {
              "tiempo": "T-11（12:22）",
              "esp_fra_mw": "+1,000 兆瓦（交流电约0）",
              "esp_por_mw": "+2,000 兆瓦（-545）",
              "esp_mar_mw": "+800",
              "notas": ""
            },
            {
              "tiempo": "T-0（12:33:00）",
              "esp_fra_mw": "+1,000 兆瓦（高压直流输电）+ 500 兆瓦交流电",
              "esp_por_mw": "+2,000 兆瓦",
              "esp_mar_mw": "+800",
              "notas": ""
            },
            {
              "tiempo": "T+0:19（12:33:19）",
              "esp_fra_mw": "-3,807 兆瓦（最大）",
              "esp_por_mw": "",
              "esp_mar_mw": "",
              "notas": "进口峰值"
            },
            {
              "tiempo": "T+0:21（12:33:21）",
              "esp_fra_mw": "0 兆瓦交流电，+1,000 兆瓦高压直流输电（输出）",
              "esp_por_mw": "不适用",
              "esp_mar_mw": "不适用",
              "notas": "埃尔纳尼断开"
            },
            {
              "tiempo": "T+0:23（12:33:24）",
              "esp_fra_mw": "0",
              "esp_por_mw": "0",
              "esp_mar_mw": "-314 兆瓦（丢失）",
              "notas": "崩溃"
            },
            {
              "tiempo": "T+10（12:43）",
              "esp_fra_mw": "0（法国全部断开）",
              "esp_por_mw": "0",
              "esp_mar_mw": "0",
              "notas": ""
            },
            {
              "tiempo": "T+11（12:44）",
              "esp_fra_mw": "西班牙-法国西部首条线路重新通电",
              "esp_por_mw": "0",
              "esp_mar_mw": "0",
              "notas": "重新连接"
            },
            {
              "tiempo": "T+30（13:04）",
              "esp_fra_mw": "+400 兆瓦",
              "esp_por_mw": "0",
              "esp_mar_mw": "摩洛哥重新通电",
              "notas": ""
            }
          ],
          "note": "显著不对称：高压直流仍出口1000兆瓦，而交流进口3807兆瓦（交流断开前实际缺口≈4800兆瓦）。",
          "tema": "T4"
        }
      ]
    },
    {
      "id": "reactive-power-distribution",
      "name": "电压调控与配电网操作",
      "icon": "⚡",
      "color": "hsl(30 90% 55%)",
      "tables": [
        {
          "id": "maniobras-compensacion-reactiva",
          "name": "西班牙电网公司12:00至12:30执行的无功补偿操作",
          "source": "Compass Lexecon/INESC TEC ¶32-34, ¶156, ¶163; REE pp. 4-6",
          "type": "table",
          "columns": [
            {
              "key": "accion",
              "label": "操作"
            },
            {
              "key": "cantidad",
              "label": "数量"
            },
            {
              "key": "mvar_afectados",
              "label": "受影响的无功功率（兆乏）"
            },
            {
              "key": "comentario",
              "label": "说明"
            }
          ],
          "data": [
            {
              "accion": "电抗器断开（12:00-12:30）",
              "cantidad": "8",
              "mvar_afectados": "-1,150 兆乏（吸收容量）",
              "comentario": "应对低电压"
            },
            {
              "accion": "电抗器重新连接（12:22-12:30）",
              "cantidad": "5",
              "mvar_afectados": "+750 兆乏",
              "comentario": "电压上升后"
            },
            {
              "accion": "电抗器净余额",
              "cantidad": "",
              "mvar_afectados": "-400 兆乏",
              "comentario": "吸收损失"
            },
            {
              "accion": "400 千伏线路重新连接（12:00-12:30）",
              "cantidad": "19",
              "mvar_afectados": "+~2.000 MVAr 容性发电",
              "comentario": "网格化"
            },
            {
              "accion": "前几日重新连接的线路",
              "cantidad": "11",
              "mvar_afectados": "+~1.600 MVAr",
              "comentario": "累计值"
            },
            {
              "accion": "12:00时总无功裕度",
              "cantidad": "3.3 GVAr",
              "mvar_afectados": "对比2025年上半年平均值5.8 GVAr",
              "comentario": "-43%裕度"
            },
            {
              "accion": "安达卢西亚裕度",
              "cantidad": "117 MVAr（1台联合循环燃气轮机）",
              "mvar_afectados": "对比1.850 MVAr电抗器",
              "comentario": "临界状态"
            },
            {
              "accion": "安达卢西亚区域无功盈余",
              "cantidad": "~600 MVAr",
              "mvar_afectados": "",
              "comentario": "由操作引发"
            }
          ],
          "note": "证明电压控制本质上是实时无功功率管理问题。",
          "tema": "T2"
        },
        {
          "id": "inyeccion-reactiva-distribucion",
          "name": "配电网异常无功注入（中欧夏令时12:22）",
          "source": "REE p. 6; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "zona",
              "label": "区域"
            },
            {
              "key": "q_inyectada_mvar",
              "label": "向输电网注入的无功功率（兆乏）"
            },
            {
              "key": "observacion",
              "label": "观察"
            }
          ],
          "data": [
            {
              "zona": "马德里",
              "q_inyectada_mvar": "575",
              "observacion": "净容性"
            },
            {
              "zona": "瓦伦西亚",
              "q_inyectada_mvar": "405",
              "observacion": "净容性"
            },
            {
              "zona": "西班牙其他地区",
              "q_inyectada_mvar": "-220",
              "observacion": "部分补偿"
            },
            {
              "zona": "全国总量",
              "q_inyectada_mvar": "+760 MVAr",
              "observacion": "异常：分布式电源作为无功源而非无功吸收点"
            }
          ],
          "note": "配电网的容性注入抬升了输电电压，这是问题的另一面。",
          "tema": "T2"
        },
        {
          "id": "variacion-demanda-desconexion-gd",
          "name": "分布式发电脱网导致的有效需求变化（约1兆瓦）",
          "source": "REE p. 6; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "periodo",
              "label": "时段"
            },
            {
              "key": "delta_demanda_mw",
              "label": "有效需求变化（兆瓦）"
            },
            {
              "key": "origen",
              "label": "起源"
            }
          ],
          "data": [
            {
              "periodo": "截至12:22",
              "delta_demanda_mw": "+845",
              "origen": "分布式发电损失（<1 MW）+ CECRE遥测数据"
            },
            {
              "periodo": "- CECRE遥测发电量",
              "delta_demanda_mw": "+152",
              "origen": "报告中的>1 MW电站"
            },
            {
              "periodo": "- 自用消费 + <1 MW不可观测部分",
              "delta_demanda_mw": "+700（约85%）",
              "origen": "REE不可见"
            },
            {
              "periodo": "12:32:00-12:32:57",
              "delta_demanda_mw": "额外增加434",
              "origen": "级联前异常增长"
            },
            {
              "periodo": "- 分布式电站",
              "delta_demanda_mw": "+117",
              "origen": "出力减少"
            },
            {
              "periodo": "- 不可观测自用消费",
              "delta_demanda_mw": "+317",
              "origen": ""
            }
          ],
          "note": "约700 MW分布式自用光伏缺乏可观测性是一个关键结构性漏洞。",
          "tema": "T1"
        },
        {
          "id": "re-voltage-manoeuvres",
          "name": "电压控制操作（西班牙电网公司）",
          "source": "Informe ENTSO-E Tabla 2-2",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "时间"
            },
            {
              "key": "element",
              "label": "元件"
            },
            {
              "key": "movement",
              "label": "操作"
            },
            {
              "key": "zone",
              "label": "区域"
            }
          ],
          "data": [
            {
              "hour": "09:02",
              "element": "400千伏阿尔马拉斯—圣塞尔万1号线",
              "movement": "接通",
              "zone": "南部"
            },
            {
              "hour": "09:02",
              "element": "400 kV 瓦尔迪卡巴列罗斯并联电抗器 REA 2",
              "movement": "断开",
              "zone": "南部"
            },
            {
              "hour": "09:02",
              "element": "安丘埃洛并联电抗器 REA 1",
              "movement": "断开",
              "zone": "中部"
            }
          ],
          "note": "西班牙电网公司于4月28日09:00至12:32执行的操作（完整列表见附件）。",
          "tema": "T2"
        },
        {
          "id": "re-topological-manoeuvres",
          "name": "西班牙电网公司拓扑操作",
          "source": "Informe ENTSO-E (Lista de trabajos topológicos)",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "时间"
            },
            {
              "key": "element",
              "label": "元件"
            },
            {
              "key": "zone",
              "label": "区域"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "element": "220 kV 塞拉约变电站",
              "zone": "中部"
            },
            {
              "hour": "09:03",
              "element": "220 kV 圣埃尔维拉变电站",
              "zone": "南部"
            },
            {
              "hour": "09:16",
              "element": "220 kV 阿塞卡变电站 位置",
              "zone": "中部"
            },
            {
              "hour": "09:21",
              "element": "普拉迪略斯 220 kV 托雷利亚诺变电站",
              "zone": "东部"
            },
            {
              "hour": "09:37",
              "element": "400 kV 阿尔德亚达维拉变电站：JBP2",
              "zone": "西北部"
            },
            {
              "hour": "09:37",
              "element": "400 kV 福西塔变电站",
              "zone": "东部"
            },
            {
              "hour": "09:52",
              "element": "220 kV 普拉多圣多明戈—比利亚维西奥萨线路",
              "zone": "中部"
            },
            {
              "hour": "09:52",
              "element": "220 kV 比利亚维西奥萨变电站 位置 ACJ",
              "zone": "南部"
            },
            {
              "hour": "09:53",
              "element": "400 kV 吉耶纳变电站：L/集电母线 1",
              "zone": "南部"
            },
            {
              "hour": "10:46",
              "element": "400 kV 帕洛斯变电站：AT-2 和 TM-2",
              "zone": "中部"
            },
            {
              "hour": "11:15",
              "element": "L-220 kV 维拉维西奥萨—卢塞罗—莱加内斯",
              "zone": "南部"
            },
            {
              "hour": "11:36",
              "element": "SE 220 kV ACECA：522-1 开关",
              "zone": "中部"
            },
            {
              "hour": "12:16",
              "element": "SE 220 kV SS. REYES：L/PS. FERNANDO",
              "zone": "中部"
            }
          ],
          "tema": "T3"
        },
        {
          "id": "ren-topological-manoeuvres",
          "name": "葡萄牙国家能源网公司拓扑操作",
          "source": "Informe ENTSO-E Tabla 2-3",
          "type": "table",
          "columns": [
            {
              "key": "type",
              "label": "类型"
            },
            {
              "key": "element",
              "label": "元件"
            },
            {
              "key": "start",
              "label": "开始时间"
            },
            {
              "key": "end",
              "label": "结束时间"
            },
            {
              "key": "reason",
              "label": "原因"
            }
          ],
          "data": [
            {
              "type": "线路",
              "element": "范霍斯–佩戈埃斯 400",
              "start": "26/04 19:46",
              "end": "30/04 06:23",
              "reason": "手动电压控制"
            },
            {
              "type": "线路",
              "element": "帕诺亚斯–塔维拉 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "手动电压控制"
            },
            {
              "type": "线路",
              "element": "费雷罗·多·阿连特茹–帕诺亚斯 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. 费拉 180 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 05:24",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. 卡斯特洛·布兰科 70 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 00:12",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. 波尔蒂芒 180 Mvar",
              "start": "28/04 10:03",
              "end": "28/04 23:33",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. Pedralva 180 Mvar",
              "start": "28/04 10:03",
              "end": "29/04 02:41",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. Paraimo 180 Mvar",
              "start": "28/04 10:06",
              "end": "29/04 00:37",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. Armamar 180 Mvar",
              "start": "28/04 10:27",
              "end": "29/04 02:39",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS1 - S. Fanhoes 180 Mvar",
              "start": "28/04 10:27",
              "end": "28/04 22:51",
              "reason": "手动电压控制"
            },
            {
              "type": "并联电抗器",
              "element": "RS2 - S. Palmela 180 Mvar",
              "start": "28/04 12:19",
              "end": "28/04 23:56",
              "reason": "低电压保护跳闸"
            }
          ],
          "tema": "T3"
        },
        {
          "id": "lines-outage-icai",
          "name": "各区域断开线路（中欧夏令时9:00）",
          "source": "Informe ICAI Tabla 4-2",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "区域"
            },
            {
              "key": "open_220",
              "label": "断开线路（220 kV）"
            },
            {
              "key": "open_400",
              "label": "断开线路（400 kV）"
            },
            {
              "key": "unavail_220",
              "label": "不可用线路（220 kV）"
            },
            {
              "key": "unavail_400",
              "label": "不可用线路（400 kV）"
            },
            {
              "key": "works_220",
              "label": "计划作业（220 kV）"
            },
            {
              "key": "works_400",
              "label": "计划作业（400 kV）"
            }
          ],
          "data": [
            {
              "area": "西北",
              "open_220": 7,
              "open_400": 7,
              "unavail_220": 3,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 2
            },
            {
              "area": "北部",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "东部",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "中部",
              "open_220": 5,
              "open_400": 5,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1
            },
            {
              "area": "南部",
              "open_220": 10,
              "open_400": 10,
              "unavail_220": 3,
              "unavail_400": 3,
              "works_220": 3,
              "works_400": 3
            }
          ],
          "note": "9:00时因电压控制、不可用状态及计划作业导致的断开线路数量。",
          "tema": "T3"
        },
        {
          "id": "km-percentage-icai",
          "name": "各区域断开线路里程百分比",
          "source": "Informe ICAI Tabla 4-3",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "区域"
            },
            {
              "key": "pct_open_220",
              "label": "断开里程百分比（220 kV）"
            },
            {
              "key": "pct_open_400",
              "label": "断开里程百分比（400 kV）"
            },
            {
              "key": "pct_unavail_220",
              "label": "不可用里程百分比（220 kV）"
            },
            {
              "key": "pct_unavail_400",
              "label": "不可用里程百分比（400 kV）"
            },
            {
              "key": "pct_works_220",
              "label": "作业里程百分比（220 kV）"
            },
            {
              "key": "pct_works_400",
              "label": "作业里程百分比（400 kV）"
            }
          ],
          "data": [
            {
              "area": "西北",
              "pct_open_220": 20.74,
              "pct_open_400": 2.5,
              "pct_unavail_220": 0.9,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": ""
            },
            {
              "area": "北部",
              "pct_open_220": 14.4,
              "pct_open_400": 0.7,
              "pct_unavail_220": 1.6,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": ""
            },
            {
              "area": "东部",
              "pct_open_220": 1.5,
              "pct_open_400": 8.5,
              "pct_unavail_220": 2.8,
              "pct_unavail_400": 4.8,
              "pct_works_220": 0.3,
              "pct_works_400": 1.3
            },
            {
              "area": "中部",
              "pct_open_220": 7,
              "pct_open_400": 26.7,
              "pct_unavail_220": 5.6,
              "pct_unavail_400": 2.2,
              "pct_works_220": 0.4,
              "pct_works_400": 5.4
            },
            {
              "area": "南部",
              "pct_open_220": 27.5,
              "pct_open_400": 8.3,
              "pct_unavail_220": 3.8,
              "pct_unavail_400": 0.2,
              "pct_works_220": 1.4,
              "pct_works_400": ""
            }
          ],
          "tema": "T3"
        }
      ]
    },
    {
      "id": "cascade-collapse",
      "name": "级联崩溃",
      "icon": "💥",
      "color": "hsl(0 75% 56%)",
      "tables": [
        {
          "id": "secuencia-desconexion-suroeste",
          "name": "发电脱网序列（西南区域）",
          "source": "REE pp. 8-10; Comité 28-A p. 47; ENTSO-E Factual Report; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "evento",
              "label": "事件编号"
            },
            {
              "key": "timestamp",
              "label": "中欧夏令时时间戳"
            },
            {
              "key": "ubicacion",
              "label": "位置"
            },
            {
              "key": "tecnologia",
              "label": "技术"
            },
            {
              "key": "mw_perdidos",
              "label": "损失的兆瓦（MW）"
            },
            {
              "key": "mvar_perdidos",
              "label": "损失的吸收兆乏（MVAr）"
            },
            {
              "key": "causa",
              "label": "原因"
            }
          ],
          "data": [
            {
              "evento": "1",
              "timestamp": "12:32:57.140",
              "ubicacion": "格拉纳达",
              "tecnologia": "400/220 kV变压器",
              "mw_perdidos": "355",
              "mvar_perdidos": "165",
              "causa": "220 kV过电压保护（242 kV）"
            },
            {
              "evento": "2a",
              "timestamp": "12:33:16.460",
              "ubicacion": "巴达霍斯（B变电站）",
              "tecnologia": "光热电站",
              "mw_perdidos": "582",
              "mvar_perdidos": "无数据",
              "causa": "内部跳闸"
            },
            {
              "evento": "2b",
              "timestamp": "12:33:16.820",
              "ubicacion": "巴达霍斯（C变电站）",
              "tecnologia": "FV",
              "mw_perdidos": "145",
              "mvar_perdidos": "无数据",
              "causa": "内部跳闸"
            },
            {
              "evento": "3a",
              "timestamp": "12:33:17.368",
              "ubicacion": "塞哥维亚（132 kV）",
              "tecnologia": "风电（3个风电场）",
              "mw_perdidos": "23",
              "mvar_perdidos": "无数据",
              "causa": "无POI数据"
            },
            {
              "evento": "3b",
              "timestamp": "12:33:17.448",
              "ubicacion": "巴达霍斯B变电站",
              "tecnologia": "FV",
              "mw_perdidos": "118",
              "mvar_perdidos": "无数据",
              "causa": "内部跳闸"
            },
            {
              "evento": "3c",
              "timestamp": "12:33:17.475",
              "ubicacion": "韦尔瓦（220 kV）",
              "tecnologia": "风电+光伏",
              "mw_perdidos": "34",
              "mvar_perdidos": "无数据",
              "causa": ""
            },
            {
              "evento": "3d",
              "timestamp": "12:33:17.708",
              "ubicacion": "塞维利亚（汇集站）",
              "tecnologia": "FV",
              "mw_perdidos": "550",
              "mvar_perdidos": "无数据",
              "causa": "线路跳闸-转移"
            },
            {
              "evento": "3e",
              "timestamp": "12:33:17.908",
              "ubicacion": "卡塞雷斯",
              "tecnologia": "FV",
              "mw_perdidos": "37.5",
              "mvar_perdidos": "无数据",
              "causa": "电压>253 kV"
            },
            {
              "evento": "3f",
              "timestamp": "12:33:17.948",
              "ubicacion": "巴达霍斯（220 kV）",
              "tecnologia": "FV",
              "mw_perdidos": "72",
              "mvar_perdidos": "无数据",
              "causa": ""
            },
            {
              "evento": "E1-3总计",
              "timestamp": "<650毫秒",
              "ubicacion": "",
              "tecnologia": "",
              "mw_perdidos": "1,917个直接",
              "mvar_perdidos": "",
              "causa": "→ 总计约2,000-2,500 MW"
            },
            {
              "evento": "4（低频减载）",
              "timestamp": "12:33:20.180",
              "ubicacion": "全国",
              "tecnologia": "抽水蓄能（49.5 Hz）",
              "mw_perdidos": "2.000-2.037",
              "mvar_perdidos": "",
              "causa": "自动低频减载（UFLS）"
            },
            {
              "evento": "4b",
              "timestamp": "12:33:20.500",
              "ubicacion": "全国",
              "tecnologia": "抽水蓄能（49.3赫兹）",
              "mw_perdidos": "588",
              "mvar_perdidos": "",
              "causa": "低频减载（UFLS）"
            },
            {
              "evento": "4c",
              "timestamp": "12:33:20.6-22.0",
              "ubicacion": "全国",
              "tecnologia": "工业+配电需求",
              "mw_perdidos": "1,402.5",
              "mvar_perdidos": "",
              "causa": "低频减载需求"
            },
            {
              "evento": "5（孤岛后）",
              "timestamp": "12:33:22.702",
              "ubicacion": "莱万特地区",
              "tecnologia": "联合循环燃气轮机（CCGT）",
              "mw_perdidos": "无数据",
              "mvar_perdidos": "",
              "causa": "跳闸于49.5赫兹 / 电压=419.6千伏"
            },
            {
              "evento": "5b",
              "timestamp": "12:33:23.515",
              "ubicacion": "",
              "tecnologia": "核电",
              "mw_perdidos": "约1,000",
              "mvar_perdidos": "",
              "causa": "次频率47.79赫兹"
            },
            {
              "evento": "5c",
              "timestamp": "12:33:23.590",
              "ubicacion": "",
              "tecnologia": "核电（另2台）",
              "mw_perdidos": "约2,000",
              "mvar_perdidos": "",
              "causa": ""
            }
          ],
          "note": "用于暂态稳定软件复现事件的主表",
          "tema": "T3"
        },
        {
          "id": "escalones-ufls",
          "name": "应用的UFLS（低频减载）阶梯",
          "source": "REE p. 11; Comité 28-A p. 50-51, 57",
          "type": "table",
          "columns": [
            {
              "key": "escalon",
              "label": "阶梯"
            },
            {
              "key": "frecuencia_hz",
              "label": "频率（赫兹，Hz）"
            },
            {
              "key": "tipo_carga",
              "label": "负荷类型"
            },
            {
              "key": "mw_desconectados",
              "label": "断开的兆瓦（MW）"
            },
            {
              "key": "mw_acumulado",
              "label": "累计兆瓦（MW）"
            },
            {
              "key": "observacion",
              "label": "备注"
            }
          ],
          "data": [
            {
              "escalon": "抽水蓄能第一步",
              "frecuencia_hz": "49.50",
              "tipo_carga": "抽水蓄能",
              "mw_desconectados": "2.000",
              "mw_acumulado": "2.000",
              "observacion": ""
            },
            {
              "escalon": "抽水蓄能第二步",
              "frecuencia_hz": "49.30",
              "tipo_carga": "抽水蓄能",
              "mw_desconectados": "588",
              "mw_acumulado": "2.588",
              "observacion": ""
            },
            {
              "escalon": "需求第一步",
              "frecuencia_hz": "49.00",
              "tipo_carga": "工业+配电",
              "mw_desconectados": "约234",
              "mw_acumulado": "约2,822",
              "observacion": "低频减载需求启动"
            },
            {
              "escalon": "需求第二步",
              "frecuencia_hz": "48.80",
              "tipo_carga": "配电",
              "mw_desconectados": "约234",
              "mw_acumulado": "~3.056",
              "observacion": ""
            },
            {
              "escalon": "需求步骤3",
              "frecuencia_hz": "48,60",
              "tipo_carga": "分布",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.290",
              "observacion": ""
            },
            {
              "escalon": "需求步骤4",
              "frecuencia_hz": "48,40",
              "tipo_carga": "分布",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.524",
              "observacion": ""
            },
            {
              "escalon": "需求步骤5",
              "frecuencia_hz": "48,20",
              "tipo_carga": "分布",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.758",
              "observacion": ""
            },
            {
              "escalon": "需求步骤6",
              "frecuencia_hz": "48,00",
              "tipo_carga": "分布",
              "mw_desconectados": "~234",
              "mw_acumulado": "~3.992",
              "observacion": "1,402.5 MW 仅输电（西班牙）"
            },
            {
              "escalon": "伊比利亚总计",
              "frecuencia_hz": "",
              "tipo_carga": "",
              "mw_desconectados": ">10,000 MW",
              "mw_acumulado": "",
              "observacion": "Lexecon公司：2.04 GW 葡萄牙抽水蓄能 + ~3 GW 西班牙抽水蓄能 + 2.3 GW 葡萄牙分布式 + ~3.2 GW 西班牙分布式"
            }
          ],
          "note": "“UFLS悖论”：断开负荷时电压额外升高，加剧电压崩溃。",
          "tema": "T3"
        },
        {
          "id": "estado-centrales-nucleares",
          "name": "核电站崩溃前后的状态",
          "source": "Comité 28-A p. 38; arXiv 2511.17433",
          "type": "table",
          "columns": [
            {
              "key": "central",
              "label": "电站"
            },
            {
              "key": "reactor",
              "label": "反应堆"
            },
            {
              "key": "estado",
              "label": "状态"
            },
            {
              "key": "potencia_pre_mw",
              "label": "崩溃前功率（兆瓦，MW）"
            },
            {
              "key": "causa_desconexion",
              "label": "断开原因"
            },
            {
              "key": "estado_post",
              "label": "崩溃后状态"
            }
          ],
          "data": [
            {
              "central": "阿尔马拉兹",
              "reactor": "1",
              "estado": "并网",
              "potencia_pre_mw": "~1,000（满功率）",
              "causa_desconexion": "因低频减载和过电压跳闸（47.79 Hz）",
              "estado_post": "安全停机"
            },
            {
              "central": "阿尔马拉兹",
              "reactor": "2",
              "estado": "并网",
              "potencia_pre_mw": "~1,000（满功率）",
              "causa_desconexion": "低频跳闸",
              "estado_post": "安全停机"
            },
            {
              "central": "阿斯科",
              "reactor": "1（部分）",
              "estado": "并网",
              "potencia_pre_mw": "~520（50%）",
              "causa_desconexion": "跳闸",
              "estado_post": "停机"
            },
            {
              "central": "凡德洛斯",
              "reactor": "2",
              "estado": "并网",
              "potencia_pre_mw": "~500（部分）",
              "causa_desconexion": "跳闸",
              "estado_post": "停机"
            },
            {
              "central": "阿斯科2号、科弗伦特斯、特里略",
              "reactor": "",
              "estado": "计划换料/停机",
              "potencia_pre_mw": "0",
              "causa_desconexion": "",
              "estado_post": ""
            },
            {
              "central": "核电总在线容量",
              "reactor": "4台反应堆",
              "estado": "",
              "potencia_pre_mw": "~3,020兆瓦",
              "causa_desconexion": "无一维持孤岛运行",
              "estado_post": ""
            },
            {
              "central": "戈尔费什（法国）",
              "reactor": "1",
              "estado": "并网",
              "potencia_pre_mw": "1.300",
              "causa_desconexion": "12:33跳闸（附带效应）",
              "estado_post": "4月29日重新并网"
            }
          ],
          "note": "无核电站作为同步锚点运行；4座核电站均因低频跳闸。",
          "tema": "T3"
        },
        {
          "id": "desconexion-bombeo-hidraulica",
          "name": "抽水蓄能电站及水电站的断开",
          "source": "REE p. 11; Comité 28-A",
          "type": "table",
          "columns": [
            {
              "key": "concepto",
              "label": "概念"
            },
            {
              "key": "valor",
              "label": "数值"
            }
          ],
          "data": [
            {
              "concepto": "12:30抽水蓄能处于用电状态（负荷）",
              "valor": "~3,000兆瓦（西班牙）+ 2,040兆瓦（葡萄牙）"
            },
            {
              "concepto": "49.5赫兹时抽水蓄能脱网（步骤1）",
              "valor": "2,000-2,037兆瓦"
            },
            {
              "concepto": "49.3赫兹时抽水蓄能脱网（步骤2）",
              "valor": "588兆瓦"
            },
            {
              "concepto": "抽水蓄能总脱网容量",
              "valor": "~2,625兆瓦（西班牙）+ 2,040兆瓦（葡萄牙）"
            }
          ],
          "note": "快速断开抽水蓄能同时消除了平衡负荷。",
          "tema": "T3"
        },
        {
          "id": "pump-storage-es",
          "name": "西班牙抽水蓄能断开情况",
          "source": "Informe ENTSO-E Tabla 3-8",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "抽水蓄能"
            },
            {
              "key": "step_hz",
              "label": "阶梯（赫兹，Hz）"
            },
            {
              "key": "tripped",
              "label": "已断开"
            }
          ],
          "data": [
            {
              "pump": "1号水泵",
              "step_hz": 49.5,
              "tripped": "Y"
            },
            {
              "pump": "2号水泵",
              "step_hz": 49.5,
              "tripped": "Y"
            }
          ],
          "note": "西班牙抽水蓄能总断开量：49.5赫兹时2,168兆瓦 + 49.3赫兹时588兆瓦 = 2,756兆瓦（简化版）。",
          "tema": "T3"
        },
        {
          "id": "pump-storage-pt",
          "name": "葡萄牙抽水蓄能断开情况",
          "source": "Informe ENTSO-E Tabla 3-10",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "抽水蓄能"
            },
            {
              "key": "step_hz",
              "label": "阶梯（赫兹，Hz）"
            },
            {
              "key": "p_previous_mw",
              "label": "断开前功率（兆瓦，MW）"
            },
            {
              "key": "p_tripped_mw",
              "label": "断开功率（兆瓦，MW）"
            }
          ],
          "data": [
            {
              "pump": "1号水泵",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18
            },
            {
              "pump": "2号水泵",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18
            }
          ],
          "note": "葡萄牙抽水蓄能总断开量：2,098兆瓦（简化版）。",
          "tema": "T3"
        },
        {
          "id": "eventos-proteccion-maniobras",
          "name": "级联过程中的保护事件与操作",
          "source": "REE p. 13-14",
          "type": "table",
          "columns": [
            {
              "key": "tipo_evento",
              "label": "事件类型"
            },
            {
              "key": "cantidad",
              "label": "数量"
            },
            {
              "key": "comentario",
              "label": "注释"
            }
          ],
          "data": [
            {
              "tipo_evento": "输电网络过电压导致跳闸",
              "cantidad": "仅2条",
              "comentario": "阿甘达-洛埃切斯；巴尔德卡瓦列罗斯-马吉利亚"
            },
            {
              "tipo_evento": "不当跳闸（阈值前）",
              "cantidad": "≥7",
              "comentario": "裕度<规范限值的2%"
            },
            {
              "tipo_evento": "法国-西班牙互联线路断开",
              "cantidad": "12:33:21.535",
              "comentario": "埃尔纳尼400千伏，频率=48.458赫兹"
            },
            {
              "tipo_evento": "摩洛哥脱网",
              "cantidad": "无数据",
              "comentario": "损失314兆瓦进口电力"
            },
            {
              "tipo_evento": "高压直流输电跳闸",
              "cantidad": "12:33:23.960",
              "comentario": "圣略加V变电站崩溃后"
            }
          ],
          "note": "证明输电保护动作“正确”；故障符合PO 7.4要求。",
          "tema": "T3"
        }
      ]
    },
    {
      "id": "demand-load",
      "name": "需求与负荷",
      "icon": "📊",
      "color": "hsl(40 95% 50%)",
      "tables": [
        {
          "id": "demand-shedding-es",
          "name": "西班牙需求断开",
          "source": "Informe ENTSO-E Tabla 3-9",
          "type": "table",
          "columns": [
            {
              "key": "step",
              "label": "阶梯"
            },
            {
              "key": "threshold_hz",
              "label": "阈值（赫兹）"
            },
            {
              "key": "load_mw",
              "label": "断开负荷（兆瓦）"
            },
            {
              "key": "real_pct",
              "label": "实际值（占需求百分比）"
            },
            {
              "key": "plan_pct",
              "label": "计划值（占需求百分比）"
            }
          ],
          "data": [
            {
              "step": "第1",
              "threshold_hz": 49,
              "load_mw": 1176,
              "real_pct": 4.7,
              "plan_pct": 6
            },
            {
              "step": "第2",
              "threshold_hz": 48.8,
              "load_mw": 1669,
              "real_pct": 6.6,
              "plan_pct": 9
            },
            {
              "step": "第3",
              "threshold_hz": 48.6,
              "load_mw": 1575,
              "real_pct": 6.3,
              "plan_pct": 8
            },
            {
              "step": "第4",
              "threshold_hz": 48.4,
              "load_mw": 1524,
              "real_pct": 6.1,
              "plan_pct": 8
            },
            {
              "step": "第5",
              "threshold_hz": 48.2,
              "load_mw": 1294,
              "real_pct": 5.1,
              "plan_pct": 7
            },
            {
              "step": "第6",
              "threshold_hz": 48,
              "load_mw": 1267,
              "real_pct": 5,
              "plan_pct": 7
            }
          ],
          "note": "西班牙总断开负荷：8,505兆瓦（占需求的33.8%）。",
          "tema": "T3"
        },
        {
          "id": "demand-shedding-pt",
          "name": "葡萄牙需求断开（低频减载）",
          "source": "Informe ENTSO-E Tabla 3-12",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "阈值（赫兹）"
            },
            {
              "key": "load_mw",
              "label": "断开负荷（兆瓦）"
            },
            {
              "key": "real_pct",
              "label": "实际值（占需求百分比）"
            },
            {
              "key": "plan_pct",
              "label": "计划值（占需求百分比）"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.7
            },
            {
              "threshold_hz": 48.8,
              "load_mw": 293,
              "real_pct": 5,
              "plan_pct": 6.6
            },
            {
              "threshold_hz": 48.6,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.9
            },
            {
              "threshold_hz": 48.4,
              "load_mw": 323,
              "real_pct": 5.5,
              "plan_pct": 6.6
            },
            {
              "threshold_hz": 48.2,
              "load_mw": 282,
              "real_pct": 4.8,
              "plan_pct": 6.4
            },
            {
              "threshold_hz": 48,
              "load_mw": 427,
              "real_pct": 7.3,
              "plan_pct": 9.7
            }
          ],
          "note": "葡萄牙总断开负荷：1,955兆瓦（占需求的33.3%）。",
          "tema": "T3"
        },
        {
          "id": "electro-intensive-pt",
          "name": "高耗能用户断开（葡萄牙）",
          "source": "Informe ENTSO-E Tabla 3-11",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "阈值（赫兹）"
            },
            {
              "key": "load_mw",
              "label": "断开负荷（兆瓦）"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "load_mw": 218
            }
          ],
          "tema": "T3"
        },
        {
          "id": "load-shedding-es-pt",
          "name": "西班牙+葡萄牙负荷断开汇总",
          "source": "Informe ENTSO-E Tabla 3-15",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "阈值（赫兹）"
            },
            {
              "key": "ind_pt_mw",
              "label": "葡萄牙高耗能用户（兆瓦）"
            },
            {
              "key": "other_pt_mw",
              "label": "葡萄牙其他负荷（兆瓦）"
            },
            {
              "key": "other_es_mw",
              "label": "西班牙其他负荷（兆瓦）"
            },
            {
              "key": "total_mw",
              "label": "总计（兆瓦）"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "ind_pt_mw": 218,
              "other_pt_mw": 0,
              "other_es_mw": 0,
              "total_mw": 218
            },
            {
              "threshold_hz": 49,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1176,
              "total_mw": 1491
            },
            {
              "threshold_hz": 48.8,
              "ind_pt_mw": 0,
              "other_pt_mw": 293,
              "other_es_mw": 1669,
              "total_mw": 1962
            },
            {
              "threshold_hz": 48.6,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1575,
              "total_mw": 1890
            },
            {
              "threshold_hz": 48.4,
              "ind_pt_mw": 0,
              "other_pt_mw": 323,
              "other_es_mw": 1524,
              "total_mw": 1847
            },
            {
              "threshold_hz": 48.2,
              "ind_pt_mw": 0,
              "other_pt_mw": 282,
              "other_es_mw": 1294,
              "total_mw": 1576
            },
            {
              "threshold_hz": 48,
              "ind_pt_mw": 0,
              "other_pt_mw": 427,
              "other_es_mw": 1267,
              "total_mw": 1694
            }
          ],
          "note": "全球总断开负荷：10,678兆瓦。",
          "tema": "T3"
        },
        {
          "id": "dso-load-shedding",
          "name": "配电运营商断开",
          "source": "Informe ENTSO-E Tabla 3-16",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "阈值（赫兹）"
            },
            {
              "key": "dso1_mw",
              "label": "配电运营商1（兆瓦）"
            },
            {
              "key": "dso2_mw",
              "label": "配电运营商2（兆瓦）"
            },
            {
              "key": "dso3_mw",
              "label": "配电运营商3（兆瓦）"
            },
            {
              "key": "dso4_mw",
              "label": "配电运营商4（兆瓦）"
            },
            {
              "key": "dso5_mw",
              "label": "配电运营商5（兆瓦）"
            },
            {
              "key": "e_redes_mw",
              "label": "葡萄牙E-REDES（兆瓦）"
            },
            {
              "key": "total_mw",
              "label": "配电运营商总计（兆瓦）"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "dso1_mw": 85.1,
              "dso2_mw": 23.7,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 97,
              "e_redes_mw": 315,
              "total_mw": 520.8
            },
            {
              "threshold_hz": 48.8,
              "dso1_mw": 529.9,
              "dso2_mw": 190,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 767.5,
              "e_redes_mw": 293,
              "total_mw": 1780.4
            },
            {
              "threshold_hz": 48.7,
              "dso1_mw": 49.6,
              "dso2_mw": "",
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 21.4,
              "e_redes_mw": "",
              "total_mw": 71
            },
            {
              "threshold_hz": 48.6,
              "dso1_mw": 423.9,
              "dso2_mw": 195.7,
              "dso3_mw": "",
              "dso4_mw": 5.2,
              "dso5_mw": 628.1,
              "e_redes_mw": 315,
              "total_mw": 1567.9
            },
            {
              "threshold_hz": 48.4,
              "dso1_mw": 633.8,
              "dso2_mw": 216.8,
              "dso3_mw": "",
              "dso4_mw": 21.6,
              "dso5_mw": 651.7,
              "e_redes_mw": 323,
              "total_mw": 1846.9
            },
            {
              "threshold_hz": 48.2,
              "dso1_mw": 412.3,
              "dso2_mw": 220.3,
              "dso3_mw": 60.4,
              "dso4_mw": 12.2,
              "dso5_mw": 589.1,
              "e_redes_mw": 282,
              "total_mw": 1576.3
            },
            {
              "threshold_hz": 48,
              "dso1_mw": 544.1,
              "dso2_mw": 218.2,
              "dso3_mw": 0.7,
              "dso4_mw": 11.6,
              "dso5_mw": 492.5,
              "e_redes_mw": 427,
              "total_mw": 1694.1
            }
          ],
          "tema": "T3"
        },
        {
          "id": "spanish-demand-forecast",
          "name": "西班牙需求预测（28-A）",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "时间"
            },
            {
              "key": "real_mw",
              "label": "实际值（兆瓦）"
            },
            {
              "key": "forecast_d2",
              "label": "D-2预测（兆瓦）"
            },
            {
              "key": "forecast_d1",
              "label": "D-1预测（兆瓦）"
            },
            {
              "key": "forecast_8h",
              "label": "8:00预测（兆瓦）"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 26900,
              "forecast_d2": 27600,
              "forecast_d1": 27600,
              "forecast_8h": 27500
            },
            {
              "hour": "09:15",
              "real_mw": 26850,
              "forecast_d2": 27400,
              "forecast_d1": 27350,
              "forecast_8h": 27350
            },
            {
              "hour": "09:30",
              "real_mw": 26650,
              "forecast_d2": 27350,
              "forecast_d1": 27200,
              "forecast_8h": 27200
            },
            {
              "hour": "09:45",
              "real_mw": 26550,
              "forecast_d2": 27250,
              "forecast_d1": 27050,
              "forecast_8h": 27000
            },
            {
              "hour": "10:00",
              "real_mw": 26250,
              "forecast_d2": 27200,
              "forecast_d1": 26900,
              "forecast_8h": 26850
            },
            {
              "hour": "10:15",
              "real_mw": 25950,
              "forecast_d2": 27050,
              "forecast_d1": 26800,
              "forecast_8h": 26700
            },
            {
              "hour": "10:30",
              "real_mw": 25950,
              "forecast_d2": 26900,
              "forecast_d1": 26650,
              "forecast_8h": 26500
            },
            {
              "hour": "10:45",
              "real_mw": 25450,
              "forecast_d2": 26700,
              "forecast_d1": 26450,
              "forecast_8h": 26300
            },
            {
              "hour": "11:00",
              "real_mw": 25750,
              "forecast_d2": 26500,
              "forecast_d1": 26200,
              "forecast_8h": 26050
            },
            {
              "hour": "11:15",
              "real_mw": 25400,
              "forecast_d2": 26350,
              "forecast_d1": 26000,
              "forecast_8h": 25900
            },
            {
              "hour": "11:30",
              "real_mw": 25100,
              "forecast_d2": 26250,
              "forecast_d1": 25900,
              "forecast_8h": 25800
            },
            {
              "hour": "11:45",
              "real_mw": 24850,
              "forecast_d2": 26150,
              "forecast_d1": 25800,
              "forecast_8h": 25700
            },
            {
              "hour": "12:00",
              "real_mw": 24950,
              "forecast_d2": 26100,
              "forecast_d1": 25700,
              "forecast_8h": 25650
            },
            {
              "hour": "12:15",
              "real_mw": 24900,
              "forecast_d2": 26050,
              "forecast_d1": 25700,
              "forecast_8h": 25650
            }
          ],
          "tema": "T1"
        },
        {
          "id": "portuguese-demand-forecast",
          "name": "葡萄牙需求预测（4月28日）",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "时间"
            },
            {
              "key": "real_mw",
              "label": "实际值（兆瓦）"
            },
            {
              "key": "forecast_d2",
              "label": "D-2预测值（兆瓦）"
            },
            {
              "key": "forecast_d1",
              "label": "D-1预测值（兆瓦）"
            },
            {
              "key": "forecast_8h",
              "label": "8:00预测值（兆瓦）"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 5700,
              "forecast_d2": 5750,
              "forecast_d1": 5720,
              "forecast_8h": 5710
            },
            {
              "hour": "09:15",
              "real_mw": 5780,
              "forecast_d2": 5900,
              "forecast_d1": 5850,
              "forecast_8h": 5820
            },
            {
              "hour": "09:30",
              "real_mw": 5900,
              "forecast_d2": 5980,
              "forecast_d1": 5930,
              "forecast_8h": 5920
            },
            {
              "hour": "09:45",
              "real_mw": 5920,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5930
            },
            {
              "hour": "10:00",
              "real_mw": 5930,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5950
            },
            {
              "hour": "10:15",
              "real_mw": 5910,
              "forecast_d2": 5950,
              "forecast_d1": 5970,
              "forecast_8h": 5910
            },
            {
              "hour": "10:30",
              "real_mw": 5920,
              "forecast_d2": 5930,
              "forecast_d1": 5950,
              "forecast_8h": 5880
            },
            {
              "hour": "10:45",
              "real_mw": 5830,
              "forecast_d2": 5880,
              "forecast_d1": 5930,
              "forecast_8h": 5850
            },
            {
              "hour": "11:00",
              "real_mw": 5760,
              "forecast_d2": 5840,
              "forecast_d1": 5890,
              "forecast_8h": 5820
            },
            {
              "hour": "11:15",
              "real_mw": 5780,
              "forecast_d2": 5820,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            },
            {
              "hour": "11:30",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5880,
              "forecast_8h": 5780
            },
            {
              "hour": "11:45",
              "real_mw": 5710,
              "forecast_d2": 5790,
              "forecast_d1": 5870,
              "forecast_8h": 5790
            },
            {
              "hour": "12:00",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            },
            {
              "hour": "12:15",
              "real_mw": 5790,
              "forecast_d2": 5790,
              "forecast_d1": 5890,
              "forecast_8h": 5790
            }
          ],
          "tema": "T1"
        }
      ]
    },
    {
      "id": "recovery-blackstart",
      "name": "恢复与黑启动",
      "icon": "🔄",
      "color": "hsl(140 60% 50%)",
      "tables": [
        {
          "id": "recuperacion-demanda-espana",
          "name": "停电后当日需求恢复（西班牙）",
          "source": "REE press release 28-29 abril; smartgridsinfo",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "中欧夏令时当地时间"
            },
            {
              "key": "porcentaje_recuperado",
              "label": "恢复需求百分比"
            },
            {
              "key": "mw_restablecidos",
              "label": "已恢复需求（兆瓦）"
            },
            {
              "key": "observaciones",
              "label": "备注"
            }
          ],
          "data": [
            {
              "hora": "12:33:24（28-A）",
              "porcentaje_recuperado": "0%",
              "mw_restablecidos": "0",
              "observaciones": "零能量"
            },
            {
              "hora": "17:00（28-A）",
              "porcentaje_recuperado": "约5%",
              "mw_restablecidos": "~1.260",
              "observaciones": "阿尔德阿达维拉启动黑启动"
            },
            {
              "hora": "19:00（28日）",
              "porcentaje_recuperado": "35%",
              "mw_restablecidos": "~8.815",
              "observaciones": "7-8个自治区电压异常"
            },
            {
              "hora": "22:00（28日）",
              "porcentaje_recuperado": "43-50%",
              "mw_restablecidos": "~10.825-12.600",
              "observaciones": ""
            },
            {
              "hora": "23:00（28日）",
              "porcentaje_recuperado": "61.35%",
              "mw_restablecidos": "~15.455",
              "observaciones": ""
            },
            {
              "hora": "00:00（29日）",
              "porcentaje_recuperado": "61%",
              "mw_restablecidos": "~15.300",
              "observaciones": "恢复进程推进中"
            },
            {
              "hora": "04:00（29日）",
              "porcentaje_recuperado": "87.37%",
              "mw_restablecidos": "~22.000",
              "observaciones": "西班牙输电网络恢复完成"
            },
            {
              "hora": "06:00（29日）",
              "porcentaje_recuperado": "99%",
              "mw_restablecidos": "~24.930",
              "observaciones": "农村地区残余停电"
            },
            {
              "hora": "07:00（29日）",
              "porcentaje_recuperado": "99.95%",
              "mw_restablecidos": "~25.170",
              "observaciones": ""
            },
            {
              "hora": "14:36（29日）",
              "porcentaje_recuperado": "100%",
              "mw_restablecidos": "恢复正常",
              "observaciones": "ENTSO-E状态从紧急转为警戒"
            }
          ],
          "note": "西班牙总恢复时间≈16小时（输电），葡萄牙≈12小时",
          "tema": "T6"
        },
        {
          "id": "tiempos-restauracion-islas",
          "name": "按地理孤岛划分的恢复时间对比",
          "source": "ENTSO-E Final Report; POWER Magazine; Comité 28-A p. 62",
          "type": "table",
          "columns": [
            {
              "key": "zona",
              "label": "区域"
            },
            {
              "key": "inicio_black_start",
              "label": "黑启动孤岛启动时间"
            },
            {
              "key": "hora_reposicion",
              "label": "输电恢复时间"
            },
            {
              "key": "notas",
              "label": "注释"
            }
          ],
          "data": [
            {
              "zona": "阿拉贡-加泰罗尼亚（经法国）",
              "inicio_black_start": "12:44（首条法西交流线路）",
              "hora_reposicion": "<17:00",
              "notas": "经法国重新供电"
            },
            {
              "zona": "加利西亚-莱昂",
              "inicio_black_start": "~13:30",
              "hora_reposicion": "<18:00",
              "notas": "杜罗河水电站黑启动"
            },
            {
              "zona": "巴斯克地区/北部（经法国）",
              "inicio_black_start": "13:35（东线F-E）",
              "hora_reposicion": "<18:00",
              "notas": ""
            },
            {
              "zona": "安达卢西亚（经摩洛哥）",
              "inicio_black_start": "13:04（塔里法-法尔迪乌阿互联）",
              "hora_reposicion": "20:00-22:00",
              "notas": "来自ONEE的900兆瓦"
            },
            {
              "zona": "塔霍-中部、莱万特",
              "inicio_black_start": "多个",
              "hora_reposicion": "之后",
              "notas": "若干失败尝试"
            },
            {
              "zona": "阿斯图里亚斯-坎塔布里亚",
              "inicio_black_start": "下午",
              "hora_reposicion": "之后",
              "notas": "需要重试"
            },
            {
              "zona": "葡萄牙孤岛1（博德城堡）",
              "inicio_black_start": "16:11",
              "hora_reposicion": "22:30（50%）",
              "notas": ""
            },
            {
              "zona": "葡萄牙孤岛2（塔帕达·杜·奥泰罗）",
              "inicio_black_start": "17:26",
              "hora_reposicion": "24:00（80%）",
              "notas": "首次同步14:23"
            },
            {
              "zona": "葡萄牙-西班牙重新同步",
              "inicio_black_start": "18:36（220千伏）",
              "hora_reposicion": "00:22（29日）",
              "notas": "国家输电网络完全恢复"
            }
          ],
          "note": "多次黑启动尝试因无法维持孤岛稳定而失败",
          "tema": "T6"
        },
        {
          "id": "recuperacion-portugal",
          "name": "葡萄牙需求恢复（REN）",
          "source": "REN; PowerMag; ENTSO-E",
          "type": "table",
          "columns": [
            {
              "key": "hora",
              "label": "西欧夏令时（UTC-1）"
            },
            {
              "key": "porcentaje_recuperado",
              "label": "葡萄牙恢复需求百分比"
            },
            {
              "key": "notas",
              "label": "备注"
            }
          ],
          "data": [
            {
              "hora": "11:33（停电）",
              "porcentaje_recuperado": "0%",
              "notas": ""
            },
            {
              "hora": "16:00",
              "porcentaje_recuperado": "约10%",
              "notas": "首个孤岛"
            },
            {
              "hora": "17:00",
              "porcentaje_recuperado": "约20%",
              "notas": ""
            },
            {
              "hora": "22:30",
              "porcentaje_recuperado": "50%",
              "notas": ""
            },
            {
              "hora": "00:00（29日）",
              "porcentaje_recuperado": "80%",
              "notas": ""
            },
            {
              "hora": "03:00（29日）",
              "porcentaje_recuperado": "约100%配电网",
              "notas": ""
            },
            {
              "hora": "28日23:22",
              "porcentaje_recuperado": "国家输电网络全面运行",
              "notas": "10.5小时内96%变电站恢复"
            }
          ],
          "note": "葡萄牙恢复更快（12小时对比西班牙16小时）",
          "tema": "T6"
        },
        {
          "id": "centrales-black-start",
          "name": "4月28日已激活黑启动能力的电站",
          "source": "ENTSO-E Factual Report; Comité 28-A; PowerMag; Portugal Resident",
          "type": "table",
          "columns": [
            {
              "key": "pais",
              "label": "国家"
            },
            {
              "key": "central",
              "label": "电站"
            },
            {
              "key": "tecnologia",
              "label": "技术类型"
            },
            {
              "key": "potencia_nominal_mw",
              "label": "额定功率（兆瓦）"
            },
            {
              "key": "hora_activacion",
              "label": "激活时间"
            },
            {
              "key": "hora_isla",
              "label": "孤岛建立时间"
            },
            {
              "key": "area_servida",
              "label": "服务区域"
            }
          ],
          "data": [
            {
              "pais": "西班牙",
              "central": "阿尔德亚达维拉",
              "tecnologia": "水力发电（杜罗河）",
              "potencia_nominal_mw": "约1,140",
              "hora_activacion": "约13:30",
              "hora_isla": "18:36",
              "area_servida": "杜罗河，与葡萄牙连接"
            },
            {
              "pais": "西班牙",
              "central": "其他水电站（杜罗河/塔霍河）",
              "tecnologia": "水力发电",
              "potencia_nominal_mw": "多个",
              "hora_activacion": "13:30之后",
              "hora_isla": "",
              "area_servida": "多个岛屿"
            },
            {
              "pais": "葡萄牙",
              "central": "卡斯特洛·杜·博德",
              "tecnologia": "水力发电",
              "potencia_nominal_mw": "138",
              "hora_activacion": "12:35",
              "hora_isla": "16:11",
              "area_servida": "葡萄牙中部"
            },
            {
              "pais": "葡萄牙",
              "central": "塔帕达·杜·奥泰罗",
              "tecnologia": "联合循环燃气轮机",
              "potencia_nominal_mw": "990",
              "hora_activacion": "12:43",
              "hora_isla": "17:26",
              "area_servida": "葡萄牙北部"
            },
            {
              "pais": "摩洛哥",
              "central": "ONEE系统",
              "tecnologia": "混合型",
              "potencia_nominal_mw": "900",
              "hora_activacion": "13:04",
              "hora_isla": "",
              "area_servida": "安达卢西亚"
            },
            {
              "pais": "法国",
              "central": "多个RTE",
              "tecnologia": "混合型",
              "potencia_nominal_mw": "高达2,000",
              "hora_activacion": "12:44",
              "hora_isla": "",
              "area_servida": "阿拉贡-加泰罗尼亚，巴斯克地区"
            }
          ],
          "note": "黑启动依赖水库水电站，在干旱期间限制恢复速度",
          "tema": "T6"
        },
        {
          "id": "eas-state-changes",
          "name": "ENTSO-E EAS状态变更",
          "source": "Informe ENTSO-E",
          "type": "table",
          "columns": [
            {
              "key": "datetime",
              "label": "日期/时间"
            },
            {
              "key": "tso",
              "label": "输电系统运营商"
            },
            {
              "key": "from_state",
              "label": "起始状态"
            },
            {
              "key": "to_state",
              "label": "终止状态"
            }
          ],
          "data": [
            {
              "datetime": "4月28日，12:40",
              "tso": "REN",
              "from_state": "正常",
              "to_state": "停电"
            },
            {
              "datetime": "4月28日，12:40",
              "tso": "RE",
              "from_state": "正常",
              "to_state": "停电"
            },
            {
              "datetime": "4月28日，12:49",
              "tso": "Swissgrid（南部控制中心）",
              "from_state": "正常",
              "to_state": "紧急"
            },
            {
              "datetime": "4月28日，12:49",
              "tso": "Amprion（北部控制中心）",
              "from_state": "正常",
              "to_state": "紧急"
            },
            {
              "datetime": "4月28日，12:50",
              "tso": "RTE",
              "from_state": "正常",
              "to_state": "紧急"
            },
            {
              "datetime": "4月28日，13:10",
              "tso": "RE",
              "from_state": "停电",
              "to_state": "恢复"
            },
            {
              "datetime": "4月28日，14:35",
              "tso": "RTE",
              "from_state": "紧急",
              "to_state": "警报"
            },
            {
              "datetime": "4月28日，17:05",
              "tso": "REN",
              "from_state": "停电",
              "to_state": "恢复"
            },
            {
              "datetime": "4月29日，02:13",
              "tso": "REN",
              "from_state": "恢复",
              "to_state": "紧急"
            },
            {
              "datetime": "4月29日，03:00",
              "tso": "RE",
              "from_state": "恢复",
              "to_state": "紧急"
            },
            {
              "datetime": "4月29日，11:15",
              "tso": "Swissgrid（南部控制中心）",
              "from_state": "紧急",
              "to_state": "正常"
            },
            {
              "datetime": "4月29日，11:15",
              "tso": "Amprion（北部控制中心）",
              "from_state": "紧急",
              "to_state": "正常"
            },
            {
              "datetime": "4月29日，11:20",
              "tso": "RTE",
              "from_state": "警报",
              "to_state": "正常"
            },
            {
              "datetime": "4月29日，14:40",
              "tso": "RE",
              "from_state": "紧急状态",
              "to_state": "警报"
            },
            {
              "datetime": "4月29日，14:40",
              "tso": "REN",
              "from_state": "紧急状态",
              "to_state": "警报"
            },
            {
              "datetime": "4月30日，12:40",
              "tso": "RE",
              "from_state": "警报",
              "to_state": "正常"
            },
            {
              "datetime": "4月30日，12:50",
              "tso": "REN",
              "from_state": "警报",
              "to_state": "正常"
            }
          ],
          "tema": "T6"
        }
      ]
    },
    {
      "id": "socioeconomic-impact",
      "name": "社会经济影响与经验教训",
      "icon": "💰",
      "color": "hsl(0 0% 60%)",
      "tables": [
        {
          "id": "costes-economicos",
          "name": "4月28日停电预估经济损失",
          "source": "CEOE; Ministerio Economía; Repsol/Iberdrola earnings; RBC Capital Markets; Slimstock",
          "type": "table",
          "columns": [
            {
              "key": "estimacion",
              "label": "估算/概念"
            },
            {
              "key": "importe_me",
              "label": "金额（百万欧元）"
            },
            {
              "key": "fuente",
              "label": "来源"
            }
          ],
          "data": [
            {
              "estimacion": "CEOE估算",
              "importe_me": "1.600",
              "fuente": "西班牙GDP的0.1%"
            },
            {
              "estimacion": "经济部估算（高值）",
              "importe_me": "800",
              "fuente": "Carlos Cuerpo"
            },
            {
              "estimacion": "经济部估算（实际值）",
              "importe_me": "400",
              "fuente": ""
            },
            {
              "estimacion": "RBC资本市场估算",
              "importe_me": "2,250–4,500",
              "fuente": "路透社 2025年4月29日"
            },
            {
              "estimacion": "雷普索尔（卡塔赫纳+普埃托利亚诺停产）",
              "importe_me": "175",
              "fuente": "第二季度收益"
            },
            {
              "estimacion": "伊维尔德罗拉（运营影响）",
              "importe_me": ">100",
              "fuente": "收益"
            },
            {
              "estimacion": "肉类加工业",
              "importe_me": "190",
              "fuente": "ANGED"
            },
            {
              "estimacion": "支付系统故障",
              "importe_me": "55%",
              "fuente": "经济部"
            },
            {
              "estimacion": "独立估算最终区间",
              "importe_me": "1,000-2,250",
              "fuente": "自由市场"
            },
            {
              "estimacion": "西班牙每日GDP",
              "importe_me": "约4500",
              "fuente": "参考值"
            }
          ],
          "note": "极宽范围（200-4,500百万欧元）反映了量化间接ENS及声誉影响的难度",
          "tema": "T7"
        },
        {
          "id": "comparativa-blackouts-historicos",
          "name": "与欧洲历史大停电对比",
          "source": "IEA; FERC; ENTSO-E; UCTE official investigation report (IEEE Xplore, 2004)",
          "type": "table",
          "columns": [
            {
              "key": "evento",
              "label": "事件"
            },
            {
              "key": "fecha",
              "label": "日期"
            },
            {
              "key": "demanda_perdida",
              "label": "损失负荷（MW/GW）"
            },
            {
              "key": "personas_afectadas",
              "label": "受影响人数（百万）"
            },
            {
              "key": "duracion_h",
              "label": "持续时间（小时）"
            },
            {
              "key": "ens_estimada",
              "label": "估算ENS（GWh）"
            },
            {
              "key": "causa_raiz",
              "label": "根本原因"
            }
          ],
          "data": [
            {
              "evento": "伊比利亚大停电 4月28日",
              "fecha": "2025年4月28日",
              "demanda_perdida": "31 GW负荷 + 约15 GW发电",
              "personas_afectadas": "47",
              "duracion_h": "约10-16",
              "ens_estimada": "无数据",
              "causa_raiz": "过电压 + IBR连锁故障"
            },
            {
              "evento": "意大利 2003年",
              "fecha": "2003年9月28日",
              "demanda_perdida": "27.7 GW",
              "personas_afectadas": "56",
              "duracion_h": "18",
              "ens_estimada": "180",
              "causa_raiz": "卢克曼尼尔-梅特伦线路 + 连锁故障"
            },
            {
              "evento": "美国东北部/加拿大 2003年",
              "fecha": "2003年8月14日",
              "demanda_perdida": "61.8 GW",
              "personas_afectadas": "55",
              "duracion_h": "最多48",
              "ens_estimada": "约46",
              "causa_raiz": "FirstEnergy线路 + 软件故障"
            },
            {
              "evento": "巴尔干地区（北部）",
              "fecha": "2024年6月21日",
              "demanda_perdida": "无数据",
              "personas_afectadas": "多个M",
              "duracion_h": "<8",
              "ens_estimada": "无数据",
              "causa_raiz": "输电过载"
            }
          ],
          "note": "将4月28日事件定性为\"首次\"（过电压驱动型），区别于典型的低频崩溃事件",
          "tema": "T7"
        },
        {
          "id": "comparativa-conclusiones-entidades",
          "name": "各研究机构结论对比",
          "source": "Comité 28-A; REE; ENTSO-E (Factual + Final); Compass Lexecon/INESC TEC",
          "type": "table",
          "columns": [
            {
              "key": "entidad",
              "label": "机构"
            },
            {
              "key": "fecha",
              "label": "日期"
            },
            {
              "key": "paginas",
              "label": "页数"
            },
            {
              "key": "causa_principal",
              "label": "识别的主要成因"
            },
            {
              "key": "responsable",
              "label": "指认的责任方"
            }
          ],
          "data": [
            {
              "entidad": "西班牙电网公司",
              "fecha": "2025年6月18日",
              "paginas": "15",
              "causa_principal": "因违反P.O. 7.4导致的过电压",
              "responsable": "RCR发电机和常规发电机未合规"
            },
            {
              "entidad": "政府（4月28日委员会）",
              "fecha": "2025年6月17日",
              "paginas": "182",
              "causa_principal": "多因素：过电压 + 规划不足",
              "responsable": "多方分摊：西班牙电网公司 + 部分电力公司"
            },
            {
              "entidad": "Compass Lexecon/INESC TEC",
              "fecha": "2025年7月28日",
              "paginas": "62",
              "causa_principal": "西班牙电网公司电压控制系统性故障",
              "responsable": "西班牙电网公司（无功管理）"
            },
            {
              "entidad": "ENTSO-E事实报告",
              "fecha": "2025年10月3日",
              "paginas": "262",
              "causa_principal": "过电压 + 连锁故障",
              "responsable": "（无来源）"
            },
            {
              "entidad": "ENTSO-E最终报告",
              "fecha": "2026年3月20日",
              "paginas": "440-472",
              "causa_principal": "组合因素：振荡、电压控制缺口、发电机脱网",
              "responsable": "多因素综合"
            }
          ],
          "note": "适用于毕业论文\"讨论\"部分的对比表格",
          "tema": "T9"
        },
        {
          "id": "unavailable-capacity",
          "name": "按技术分类的不可用功率与装机容量",
          "source": "Informe Gobierno (REE)",
          "type": "table",
          "columns": [
            {
              "key": "technology",
              "label": "技术类型"
            },
            {
              "key": "unavailable_mw",
              "label": "不可用功率（MW）"
            },
            {
              "key": "installed_mw",
              "label": "装机容量（MW）"
            }
          ],
          "data": [
            {
              "technology": "煤炭",
              "unavailable_mw": 903.5,
              "installed_mw": 1820
            },
            {
              "technology": "联合循环",
              "unavailable_mw": 7426.3,
              "installed_mw": 24562
            },
            {
              "technology": "燃气",
              "unavailable_mw": 0,
              "installed_mw": 8
            },
            {
              "technology": "核能",
              "unavailable_mw": 3078.6,
              "installed_mw": 7117
            },
            {
              "technology": "抽水蓄能发电",
              "unavailable_mw": 1392.1,
              "installed_mw": 3331
            }
          ],
          "note": "事件前数值。考虑完整小时段的不可用功率",
          "tema": "T1"
        },
        {
          "id": "compass-lexecon",
          "name": "结论对比（Compass Lexecon / INESC TEC）",
          "source": "Informe Compass Lexecon",
          "type": "table",
          "columns": [
            {
              "key": "entity",
              "label": "机构"
            },
            {
              "key": "point1",
              "label": "1"
            },
            {
              "key": "point2",
              "label": "2"
            },
            {
              "key": "point3",
              "label": "3"
            },
            {
              "key": "point4",
              "label": "4"
            },
            {
              "key": "point5",
              "label": "5"
            },
            {
              "key": "point6",
              "label": "6"
            },
            {
              "key": "point7",
              "label": "7"
            },
            {
              "key": "point8",
              "label": "8"
            }
          ],
          "data": [
            {
              "entity": "西班牙政府",
              "point1": "未分析",
              "point2": "出现显著波动",
              "point3": "年度并网热电机组数量最少",
              "point4": "出现显著波动",
              "point5": "互联线路切换为固定模式加剧了事态",
              "point6": "未符合规范",
              "point7": "过电压与部分误跳闸的恶性循环",
              "point8": "未分析"
            },
            {
              "entity": "西班牙电网公司",
              "point1": "未分析",
              "point2": "未分析",
              "point3": "表现适当",
              "point4": "情况保持稳定",
              "point5": "互联线路切换为固定模式未加剧事态",
              "point6": "未符合规范",
              "point7": "误跳闸",
              "point8": "未分析"
            },
            {
              "entity": "Compass Lexecon / INESC TEC",
              "point1": "近年有所增加",
              "point2": "出现显著波动",
              "point3": "年度电压控制能力最弱且南部地区尤为不足",
              "point4": "出现显著波动",
              "point5": "待分析",
              "point6": "缺乏足够的常规发电机组进行电压控制",
              "point7": "若无系统性原因，同时发生故障的可能性较低",
              "point8": "波动减少"
            }
          ],
          "tema": "T9"
        }
      ]
    }
  ]
}
```


--- FILE: static/data/tablasdefinitivas.json ---
```json
{
  "categories": [
    {
      "id": "frequency-stability",
      "name": "Estabilidad de Frecuencia",
      "icon": "⚡",
      "color": "hsl(190 100% 60%)",
      "tables": [
        {
          "id": "inertia-distribution",
          "name": "Distribución de Inercia (12:00 CEST)",
          "source": "Informe ICAI Tabla 4-1",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "Área"
            },
            {
              "key": "nuclear",
              "label": "Nuclear (MW)"
            },
            {
              "key": "combined",
              "label": "Ciclo Combinado (MW)"
            },
            {
              "key": "coal",
              "label": "Carbón (MW)"
            },
            {
              "key": "hydro",
              "label": "Hidráulica (MW)"
            },
            {
              "key": "total",
              "label": "Total (MW)"
            },
            {
              "key": "inertia_s",
              "label": "Inercia (s)"
            }
          ],
          "data": [
            {
              "area": "NOROESTE",
              "nuclear": 0,
              "combined": 3714,
              "coal": 1746,
              "hydro": 6652,
              "total": 12111,
              "inertia_s": 3.84,
              "nuclear_critical": true,
              "inertia_s_critical": true
            },
            {
              "area": "NORTE",
              "nuclear": 0,
              "combined": 2995,
              "coal": 0,
              "hydro": 7843,
              "total": 10837,
              "inertia_s": 3.02,
              "nuclear_critical": true,
              "coal_critical": true,
              "inertia_s_critical": true
            },
            {
              "area": "ESTE",
              "nuclear": 9642,
              "combined": 0,
              "coal": 0,
              "hydro": 4105,
              "total": 13747,
              "inertia_s": 2.33,
              "combined_critical": true,
              "coal_critical": true,
              "inertia_s_critical": true
            },
            {
              "area": "CENTRO",
              "nuclear": 2906,
              "combined": 8875,
              "coal": 0,
              "hydro": 4204,
              "total": 15984,
              "inertia_s": 1.84,
              "coal_critical": true,
              "inertia_s_critical": true
            },
            {
              "area": "SUR",
              "nuclear": 0,
              "combined": 2881,
              "coal": 0,
              "hydro": 1535,
              "total": 4417,
              "inertia_s": 1.3,
              "nuclear_critical": true,
              "coal_critical": true,
              "inertia_s_critical": true
            },
            {
              "area": "TOTAL",
              "nuclear": 12547,
              "combined": 18465,
              "coal": 1746,
              "hydro": 24339,
              "total": 57097,
              "inertia_s": 2.31,
              "inertia_s_critical": true
            }
          ],
          "note": "Valores previos al colapso. Inercia estimada según informe ICAI."
        },
        {
          "id": "pump-storage-es",
          "name": "Desconexión de Bombeo en España",
          "source": "Informe ENTSO-E Tabla 3-8",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "Bombeo"
            },
            {
              "key": "step_hz",
              "label": "Escalón (Hz)"
            },
            {
              "key": "tripped",
              "label": "Desconectado"
            }
          ],
          "data": [
            {
              "pump": "Pump 1",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 2",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 3",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 4",
              "step_hz": 49.5,
              "tripped": "No info"
            },
            {
              "pump": "Pump 5",
              "step_hz": 49.5,
              "tripped": "No info"
            },
            {
              "pump": "Pump 6",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 7",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 8",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 9",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 10",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 11",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 12",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 13",
              "step_hz": 49.5,
              "tripped": "No info"
            },
            {
              "pump": "Pump 14",
              "step_hz": 49.5,
              "tripped": ""
            },
            {
              "pump": "Pump 15",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 16",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 17",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 18",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 19",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 20",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 21",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 22",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 23",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 24",
              "step_hz": 49.5,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 25",
              "step_hz": 49.3,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 26",
              "step_hz": 49.3,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 27",
              "step_hz": 49.3,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 28",
              "step_hz": 49.3,
              "tripped": "failed"
            },
            {
              "pump": "Pump 29",
              "step_hz": 49.3,
              "tripped": "Y",
              "tripped_critical": true
            },
            {
              "pump": "Pump 30",
              "step_hz": 49.3,
              "tripped": "Y",
              "tripped_critical": true
            }
          ],
          "note": "Total bombeo desconectado: 2.168 MW a 49,5 Hz + 588 MW a 49,3 Hz = 2.756 MW."
        },
        {
          "id": "pump-storage-pt",
          "name": "Desconexión de Bombeo en Portugal",
          "source": "Informe ENTSO-E Tabla 3-10",
          "type": "table",
          "columns": [
            {
              "key": "pump",
              "label": "Bombeo"
            },
            {
              "key": "step_hz",
              "label": "Escalón (Hz)"
            },
            {
              "key": "p_previous_mw",
              "label": "P previa (MW)"
            },
            {
              "key": "p_tripped_mw",
              "label": "P desconectada (MW)"
            }
          ],
          "data": [
            {
              "pump": "Pump 1",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 2",
              "step_hz": 49.8,
              "p_previous_mw": 18,
              "p_tripped_mw": 18,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 3",
              "step_hz": 49.8,
              "p_previous_mw": 124,
              "p_tripped_mw": 124
            },
            {
              "pump": "Pump 4",
              "step_hz": 49.8,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 5",
              "step_hz": 49.8,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 6",
              "step_hz": 49.8,
              "p_previous_mw": 221,
              "p_tripped_mw": 221
            },
            {
              "pump": "Pump 7",
              "step_hz": 49.8,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 8",
              "step_hz": 49.8,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 9",
              "step_hz": 49.7,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 10",
              "step_hz": 49.7,
              "p_previous_mw": 113,
              "p_tripped_mw": 113
            },
            {
              "pump": "Pump 11",
              "step_hz": 49.7,
              "p_previous_mw": 337,
              "p_tripped_mw": 337
            },
            {
              "pump": "Pump 12",
              "step_hz": 49.6,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 13",
              "step_hz": 49.6,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 14",
              "step_hz": 49.6,
              "p_previous_mw": 219,
              "p_tripped_mw": 219
            },
            {
              "pump": "Pump 15",
              "step_hz": 49.6,
              "p_previous_mw": 219,
              "p_tripped_mw": 219
            },
            {
              "pump": "Pump 16",
              "step_hz": 49.5,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 17",
              "step_hz": 49.5,
              "p_previous_mw": 114,
              "p_tripped_mw": 114
            },
            {
              "pump": "Pump 18",
              "step_hz": 49.5,
              "p_previous_mw": 74,
              "p_tripped_mw": 74
            },
            {
              "pump": "Pump 19",
              "step_hz": 49.5,
              "p_previous_mw": 75,
              "p_tripped_mw": 75
            },
            {
              "pump": "Pump 20",
              "step_hz": 49.5,
              "p_previous_mw": 207,
              "p_tripped_mw": 207
            },
            {
              "pump": "Pump 21",
              "step_hz": 49.4,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 22",
              "step_hz": 49.4,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 23",
              "step_hz": 49.4,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 24",
              "step_hz": 49.4,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 25",
              "step_hz": 49.3,
              "p_previous_mw": 30,
              "p_tripped_mw": 30,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 26",
              "step_hz": 49.3,
              "p_previous_mw": 0,
              "p_tripped_mw": 0,
              "p_previous_mw_critical": true,
              "p_tripped_mw_critical": true
            },
            {
              "pump": "Pump 27",
              "step_hz": 49.3,
              "p_previous_mw": 329,
              "p_tripped_mw": 329
            }
          ],
          "note": "Total bombeo desconectado en Portugal: 2.098 MW."
        }
      ],
      "summary": [
        {
          "label": "Inercia H (s)",
          "value": "2.3",
          "status": "🔴 CRÍTICA"
        },
        {
          "label": "Frequency inicial (Hz)",
          "value": "50.0",
          "status": "✓ Normal"
        },
        {
          "label": "RoCoF máximo (Hz/s)",
          "value": "-1.85",
          "status": "🔴 CRÍTICO"
        },
        {
          "label": "Frequency nadir (Hz)",
          "value": "47.79",
          "status": "🔴 COLAPSO"
        },
        {
          "label": "Tiempo a blackout (min)",
          "value": "3.0",
          "status": "🔴 Muy rápido"
        }
      ],
      "reflection": "Con inercia < 2.5s, el sistema no puede tolerar perturbaciones de > 500 MW sin cascada. En 2015, sistemas de 30+ GW podían tolerar pérdidas de 1000 MW gracias a inercia > 4s."
    },
    {
      "id": "voltage-violations",
      "name": "Violaciones de Tensión y Protecciones",
      "icon": "⚠️",
      "color": "hsl(38 100% 56%)",
      "tables": [
        {
          "id": "ics-violations",
          "name": "Criterios ICS Violados por TSO",
          "source": "Informe ENTSO-E Tabla 7-1",
          "type": "table",
          "columns": [
            {
              "key": "criterion",
              "label": "Criterio"
            },
            {
              "key": "scale",
              "label": "Escala"
            },
            {
              "key": "re",
              "label": "Red Eléctrica"
            },
            {
              "key": "ren",
              "label": "REN"
            },
            {
              "key": "rte",
              "label": "RTE"
            }
          ],
          "data": [
            {
              "criterion": "OB",
              "scale": 3,
              "re": "✓",
              "ren": "✓",
              "rte": "—",
              "scale_critical": true
            },
            {
              "criterion": "L",
              "scale": 2,
              "re": "✓",
              "ren": "✓",
              "rte": "—",
              "scale_critical": true
            },
            {
              "criterion": "T",
              "scale": 2,
              "re": "✓",
              "ren": "—",
              "rte": "—",
              "scale_critical": true
            },
            {
              "criterion": "T",
              "scale": 0,
              "re": "✓",
              "ren": "✓",
              "rte": "✓",
              "scale_critical": true
            },
            {
              "criterion": "G",
              "scale": 2,
              "re": "✓",
              "ren": "✓",
              "rte": "—",
              "scale_critical": true
            },
            {
              "criterion": "RS",
              "scale": 2,
              "re": "✓",
              "ren": "✓",
              "rte": "—",
              "scale_critical": true
            },
            {
              "criterion": "OV",
              "scale": 1,
              "re": "—",
              "ren": "—",
              "rte": "✓",
              "scale_critical": true
            }
          ],
          "note": "✓ = Violado, — = No violado. Solo se muestran los criterios con al menos una violación."
        },
        {
          "id": "protection-events",
          "name": "Protecciones de Línea en la Secuencia de Eventos",
          "source": "Informe ENTSO-E Tabla 3-5",
          "type": "table",
          "columns": [
            {
              "key": "event",
              "label": "Evento"
            },
            {
              "key": "time",
              "label": "Hora (CEST)"
            },
            {
              "key": "sub_a",
              "label": "Subestación A"
            },
            {
              "key": "sub_b",
              "label": "Subestación B"
            },
            {
              "key": "kv",
              "label": "kV"
            },
            {
              "key": "relay",
              "label": "Protección"
            },
            {
              "key": "cause",
              "label": "Causa"
            }
          ],
          "data": [
            {
              "event": "9",
              "time": "12:33:19.971",
              "sub_a": "Arganda (REE)",
              "sub_b": "Loeches (REE)",
              "kv": 220,
              "relay": "OV",
              "cause": "Medición incorrecta transformador tensión fase B",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "16a",
              "time": "12:33:20.229",
              "sub_a": "Puerto de la Cruz (REE)",
              "sub_b": "Beni Harchane (ONEE)",
              "kv": 400,
              "relay": "UF",
              "cause": "Baja frecuencia en Marruecos",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "16b",
              "time": "12:33:20.473",
              "sub_a": "Puerto de la Cruz (REE)",
              "sub_b": "Melloussa (ONEE)",
              "kv": 400,
              "relay": "UF",
              "cause": "Baja frecuencia en Marruecos",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "31a",
              "time": "12:33:21.407",
              "sub_a": "Baixas (RTE)",
              "sub_b": "Vic (REE)",
              "kv": 400,
              "relay": "OST",
              "cause": "Pérdida de sincronismo",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "31b1",
              "time": "12:33:21.437",
              "sub_a": "Argia (RTE)",
              "sub_b": "Arkale (REE)",
              "kv": 220,
              "relay": "OST",
              "cause": "Pérdida de sincronismo",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "31b2",
              "time": "12:33:21.535",
              "sub_a": "Argia (RTE)",
              "sub_b": "Hernani (REE)",
              "kv": 400,
              "relay": "OST",
              "cause": "Pérdida de sincronismo",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "42",
              "time": "12:33:23.076",
              "sub_a": "Valdecañalleros (REE)",
              "sub_b": "Maguilla (REE)",
              "kv": 400,
              "relay": "OV",
              "cause": "Sobretensión",
              "event_critical": true,
              "time_critical": true
            },
            {
              "event": "52",
              "time": "12:33:23.954",
              "sub_a": "Mogadouro (REN)",
              "sub_b": "Central da Valeira (REN)",
              "kv": 220,
              "relay": "DIST",
              "cause": "Z1 por condiciones inestables",
              "time_critical": true
            },
            {
              "event": "55b",
              "time": "12:33:25.144",
              "sub_a": "Cartelle (REN)",
              "sub_b": "Lindoso (REN) ckt2",
              "kv": 400,
              "relay": "DIST",
              "cause": "Z1 por colapso tensión/frecuencia",
              "time_critical": true
            },
            {
              "event": "55c",
              "time": "12:33:25.183",
              "sub_a": "Cartelle (REN)",
              "sub_b": "Lindoso (REN) ckt1",
              "kv": 400,
              "relay": "DIST",
              "cause": "Z1 por colapso tensión/frecuencia",
              "time_critical": true
            },
            {
              "event": "55d",
              "time": "12:33:25.325",
              "sub_a": "Cedillo (REE)",
              "sub_b": "Falagueira (REN)",
              "kv": 400,
              "relay": "DIST",
              "cause": "Z1 por colapso tensión/frecuencia",
              "time_critical": true
            },
            {
              "event": "55e",
              "time": "12:33:25.410",
              "sub_a": "Saucelle (REE)",
              "sub_b": "Pocinho (REN) ckt2",
              "kv": 220,
              "relay": "DIST",
              "cause": "Z1 por colapso tensión/frecuencia",
              "time_critical": true
            },
            {
              "event": "56",
              "time": "12:33:25.434",
              "sub_a": "Lagoaça (REN)",
              "sub_b": "Armamar (REN)",
              "kv": 400,
              "relay": "DIST",
              "cause": "Z1 por condiciones inestables",
              "time_critical": true
            },
            {
              "event": "55f",
              "time": "12:33:26.165",
              "sub_a": "Aldeadávila (REE)",
              "sub_b": "Pocinho (REN) ckt1",
              "kv": 220,
              "relay": "DIST",
              "cause": "Z1 por colapso tensión/frecuencia",
              "time_critical": true
            }
          ]
        },
        {
          "id": "france-tripped-lines",
          "name": "Líneas Desconectadas en Francia",
          "source": "Informe ENTSO-E Tabla 3-6",
          "type": "table",
          "columns": [
            {
              "key": "time",
              "label": "Hora (CEST)"
            },
            {
              "key": "sub_a",
              "label": "Subestación A"
            },
            {
              "key": "sub_b",
              "label": "Subestación B"
            },
            {
              "key": "kv",
              "label": "kV"
            },
            {
              "key": "relay",
              "label": "Protección"
            }
          ],
          "data": [
            {
              "time": "12:33:20.298",
              "sub_a": "Mousserolles (RTE)",
              "sub_b": "Bordères et Lamesant (RTE)",
              "kv": 63,
              "relay": "DIST",
              "time_critical": true
            },
            {
              "time": "12:33:20.518",
              "sub_a": "Mouguerre (RTE)",
              "sub_b": "Lussagnet (RTE)",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:20.551",
              "sub_a": "Dax (RTE)",
              "sub_b": "Transformer 1 400/63 kV",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:20.572",
              "sub_a": "Aire-Sur-Adour (RTE)",
              "sub_b": "Transformer 3 400/63 kV",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:20.583",
              "sub_a": "Midour (RTE)",
              "sub_b": "Usson (RTE)",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.280",
              "sub_a": "Issel (RTE)",
              "sub_b": "Marsillon (RTE)",
              "kv": 400,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.280",
              "sub_a": "Issel (RTE)",
              "sub_b": "Orlu (RTE)",
              "kv": 400,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.382",
              "sub_a": "Lavelanet (RTE)",
              "sub_b": "Bus coupler",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.404",
              "sub_a": "Berge (RTE)",
              "sub_b": "Porta (RTE)",
              "kv": 225,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.410",
              "sub_a": "Nentilla (RTE)",
              "sub_b": "Cantegrit (RTE)",
              "kv": 150,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.418",
              "sub_a": "Argia (RTE)",
              "sub_b": "Berge (RTE)",
              "kv": 225,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.423",
              "sub_a": "Latour-de-Carol (RTE)",
              "sub_b": "PORTA (RTE)",
              "kv": 63,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.427",
              "sub_a": "Marsillon (RTE)",
              "sub_b": "CANTEGRIT (RTE)",
              "kv": 225,
              "relay": "OST",
              "time_critical": true
            },
            {
              "time": "12:33:21.451",
              "sub_a": "Marsillon (RTE)",
              "sub_b": "BERGE (RTE)",
              "kv": 225,
              "relay": "OST",
              "time_critical": true
            }
          ]
        },
        {
          "id": "france-production-tripping",
          "name": "Desconexión de Generación en Francia",
          "source": "Informe ENTSO-E Tabla 3-4",
          "type": "table",
          "columns": [
            {
              "key": "time",
              "label": "Hora (CEST)"
            },
            {
              "key": "unit",
              "label": "Unidad"
            },
            {
              "key": "type",
              "label": "Tipo"
            },
            {
              "key": "p_lost_mw",
              "label": "P pérdida (MW)"
            },
            {
              "key": "kv",
              "label": "kV"
            }
          ],
          "data": [
            {
              "time": "12:33:19.850",
              "unit": "Hydro 1",
              "type": "Hydro",
              "p_lost_mw": 3.5,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:19.850",
              "unit": "Hydro 2",
              "type": "Hydro",
              "p_lost_mw": 3.5,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:19.850",
              "unit": "Hydro 3",
              "type": "Hydro",
              "p_lost_mw": 3.5,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:20.900",
              "unit": "Hydro 4",
              "type": "Hydro",
              "p_lost_mw": -35,
              "kv": 225,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:23.307",
              "unit": "Hydro 5",
              "type": "Hydro",
              "p_lost_mw": 28,
              "kv": 225,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:23.460",
              "unit": "Hydro 6",
              "type": "Hydro",
              "p_lost_mw": -210,
              "kv": 400,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:23.863",
              "unit": "Hydro 7",
              "type": "Hydro",
              "p_lost_mw": 6,
              "kv": 150,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:23.857",
              "unit": "Hydro 8",
              "type": "Hydro",
              "p_lost_mw": 1.8,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:23.857",
              "unit": "Hydro 9",
              "type": "Hydro",
              "p_lost_mw": 1.8,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:30",
              "unit": "Hydro 10",
              "type": "Hydro",
              "p_lost_mw": 5,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:33:35.759",
              "unit": "Nuclear 1",
              "type": "Nuclear",
              "p_lost_mw": 1290,
              "kv": 400,
              "time_critical": true
            },
            {
              "time": "12:33:36",
              "unit": "Hydro 11",
              "type": "Hydro",
              "p_lost_mw": 7,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            },
            {
              "time": "12:35:53.189",
              "unit": "Hydro 12",
              "type": "Hydro",
              "p_lost_mw": 17,
              "kv": 63,
              "time_critical": true,
              "p_lost_mw_critical": true
            }
          ],
          "note": "Valores negativos indican absorción de potencia (funcionamiento como bomba)."
        }
      ],
      "summary": [
        {
          "label": "ICS Violados",
          "value": "4",
          "status": "🔴 CRÍTICO"
        },
        {
          "label": "Sobretensiones (>420kV)",
          "value": "12+",
          "status": "🔴 PELIGRO"
        },
        {
          "label": "Líneas perdidas ES-FR",
          "value": "2",
          "status": "🔴 AISLAMIENTO"
        }
      ],
      "reflection": "El hundimiento de la tensión provocado por la falta de reactiva desencadenó un transitorio capacitivo al abrir líneas, lo que rebotó en sobretensiones destructivas."
    },
    {
      "id": "network-topology",
      "name": "Estructura de Red",
      "icon": "🔗",
      "color": "hsl(270 80% 55%)",
      "tables": [
        {
          "id": "re-voltage-manoeuvres",
          "name": "Maniobras de Control de Voltaje (Red Eléctrica)",
          "source": "Informe ENTSO-E Tabla 2-2",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hora"
            },
            {
              "key": "element",
              "label": "Elemento"
            },
            {
              "key": "movement",
              "label": "Acción"
            },
            {
              "key": "zone",
              "label": "Zona"
            }
          ],
          "data": [
            {
              "hour": "09:02",
              "element": "LINE L-400 kV ALMARAZ — SAN SERVÁN 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:02",
              "element": "SHUNT REACTOR VALDECABALLEROS 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:02",
              "element": "SHUNT REACTOR ANCHUELO REA 1",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "09:05",
              "element": "SHUNT REACTOR MINGLANILLA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "09:08",
              "element": "SHUNT REACTOR LITORAL 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "09:13",
              "element": "LINE L-400 kV BRAZATORTAS — MANZANARES 1",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "09:13",
              "element": "LINE L-220 kV GURREA — VILLANUEVA 1",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "09:17",
              "element": "LINE L-400 kV SALLENTE — CALDERS",
              "movement": "SWITCH ON",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "09:13",
              "element": "SHUNT REACTOR RUEDA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "09:14",
              "element": "SHUNT REACTOR BELINCHON 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "09:22",
              "element": "SHUNT REACTOR VITORIA 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "09:23",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:24",
              "element": "SHUNT REACTOR DRODRIGO 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:25",
              "element": "SHUNT REACTOR ARANUELO 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:26",
              "element": "SHUNT REACTOR BIENVENIDA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:27",
              "element": "SHUNT REACTOR MORALEJA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "09:31",
              "element": "SHUNT REACTOR JM. ORIOL 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:32",
              "element": "SHUNT REACTOR MORALEJA 220 REA 12",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "09:34",
              "element": "SHUNT REACTOR ALMARAZ 400 REA 3",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:41",
              "element": "SHUNT REACTOR VALDECABALLEROS 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:44",
              "element": "SHUNT REACTOR BROVALES 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:49",
              "element": "SHUNT REACTOR EALMARAZ 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "09:52",
              "element": "SHUNT REACTOR MAGALLON 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "09:54",
              "element": "LINE L-400 kV ALMARAZ — MORATA 2",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "10:02",
              "element": "LINE L-400 kV BROVALES — SAN SERVAN 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:04",
              "element": "SHUNT REACTOR GUILLENA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:05",
              "element": "SHUNT REACTOR CABRA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:05",
              "element": "LINE L-400 kV ARCOS — D. RODRIGO 2",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:18",
              "element": "SHUNT REACTOR JM. ORIOL 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:19",
              "element": "SHUNT REACTOR MORALEJA 220 REA 13",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "10:20",
              "element": "SHUNT REACTOR OLMEDILLA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "10:22",
              "element": "SHUNT REACTOR VILLAVICIOSA 220 REA 2",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "10:29",
              "element": "SHUNT REACTOR ROCAMORA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "10:32",
              "element": "LINE L-220 kV ACECA — PICON",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "10:32",
              "element": "SHUNT REACTOR MAGALLON 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "10:32",
              "element": "SHUNT REACTOR PINILLA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "10:32",
              "element": "SHUNT REACTOR SS REYES 400 REA 3",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true,
              "element_critical": true
            },
            {
              "hour": "10:33",
              "element": "LINE L-400 kV BROVALES — GUILLENA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:33",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "RAISE SETPOINT TO 413 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "10:35",
              "element": "LINE L-400 kV GUADAME — VALDECABALLEROS",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:39",
              "element": "SHUNT REACTOR MAGALLON 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "10:40",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:40",
              "element": "SHUNT REACTOR PINILLA 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "10:40",
              "element": "SHUNT REACTOR MORALEJA 220 REA 12",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "10:43",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 409 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "10:44",
              "element": "SHUNT REACTOR RUEDA 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "10:44",
              "element": "CONDENSER JUIA 220 CONDEN1",
              "movement": "SWITCH OFF",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "10:45",
              "element": "SHUNT REACTOR VALDECABALLEROS 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:50",
              "element": "SHUNT REACTOR CABRA 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:50",
              "element": "SHUNT REACTOR REQUENA 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "10:51",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 404 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "10:59",
              "element": "SHUNT REACTOR VALDECABALLEROS 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "10:59",
              "element": "SHUNT REACTOR SENTMENAT 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "10:59",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "RAISE SETPOINT TO 410 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:00",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:01",
              "element": "SHUNT REACTOR CABRA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:02",
              "element": "SHUNT REACTOR LA SERNA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:03",
              "element": "LINE L-400 kV OLMEDILLA — ROMICA 2",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:03",
              "element": "SHUNT REACTOR BEGUES 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:03",
              "element": "SHUNT REACTOR REQUENA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:03",
              "element": "SHUNT REACTOR VITORIA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:03",
              "element": "SHUNT REACTOR GUADAME 220 REA 3",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:04",
              "element": "SHUNT REACTOR ESCATRON 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:04",
              "element": "SHUNT REACTOR MORALEJA 220 REA 12",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "11:04",
              "element": "SHUNT REACTOR PALOS 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:04",
              "element": "SHUNT REACTOR RUEDA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:04",
              "element": "SHUNT REACTOR MAIALS 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:07",
              "element": "SHUNT REACTOR MAGALLON 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:07",
              "element": "SHUNT REACTOR RUBI 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:07",
              "element": "LINE L-400 kV AGUAYO — ABANTO",
              "movement": "SWITCH ON",
              "zone": "NORTHWEST",
              "hour_critical": true,
              "element_critical": true
            },
            {
              "hour": "11:07",
              "element": "LINE L-400 kV GUADAME — CABRA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:08",
              "element": "LINE L-400 kV PINAR — TAJO",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:08",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "RAISE SETPOINT TO 413 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:08",
              "element": "SHUNT REACTOR PINILLA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:09",
              "element": "LINE L-400 kV MONTEARENAS — MUDARRA 2",
              "movement": "SWITCH ON",
              "zone": "NORTHWEST",
              "hour_critical": true
            },
            {
              "hour": "11:10",
              "element": "SHUNT REACTOR CABRA 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:10",
              "element": "SHUNT REACTOR GUADAME 220 REA 3",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:11",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 409 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:11",
              "element": "SHUNT REACTOR LA SERNA 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:12",
              "element": "SHUNT REACTOR MAIALS 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:14",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 405 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:17",
              "element": "LINE L-400 kV ARCOS — CABRA",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:18",
              "element": "SHUNT REACTOR RUBI 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:20",
              "element": "LINE L-400 kV PIEROLA — VANDELLÓS",
              "movement": "SWITCH ON",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:22",
              "element": "SHUNT REACTOR ELIANA 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:43",
              "element": "SHUNT REACTOR ELIANA 220 REA 1",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:43",
              "element": "SHUNT REACTOR ESCATRON 220 REA 1",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:46",
              "element": "SHUNT REACTOR SENTMENAT 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:47",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:47",
              "element": "SHUNT REACTOR MINGLANILLA 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "11:48",
              "element": "SHUNT REACTOR RUEDA400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "11:48",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 401 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:48",
              "element": "SHUNT REACTOR EALMARAZ 220 REA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:48",
              "element": "SHUNT REACTOR MORALEJA 220 REA 12",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "11:50",
              "element": "SHUNT REACTOR PALOS 220 REA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "11:59",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "RAISE SETPOINT TO 406 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "11:59",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:01",
              "element": "SHUNT REACTOR EALMARAZ 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:02",
              "element": "LINE L-220 kV C.PLATA — VILLAVERDE BAJO 2",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:04",
              "element": "SHUNT REACTOR VILLAVICIOSA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:04",
              "element": "SHUNT REACTOR GUADAME 220 REA 3",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:05",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "RAISE SETPOINT TO 412 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            },
            {
              "hour": "12:05",
              "element": "SHUNT REACTOR RUEDA 400 REA 2",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "12:07",
              "element": "LINE L-400 kV GRIJOTA — VILLARINO 2",
              "movement": "SWITCH ON",
              "zone": "NORTHWEST",
              "hour_critical": true
            },
            {
              "hour": "12:07",
              "element": "LINE L-400 kV P. GUZMAN — GUILLENA 1",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:07",
              "element": "LINE L-400 kV PALMAR — CARRIL",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "12:07",
              "element": "SHUNT REACTOR ARAGON 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "12:08",
              "element": "LINE L-400 kV LA ROBLA — MUDARRA",
              "movement": "SWITCH ON",
              "zone": "NORTHWEST",
              "hour_critical": true
            },
            {
              "hour": "12:08",
              "element": "LINE L-400 kV PALMAR — ROCAMORA 2",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "12:15",
              "element": "LINE L-400 kV MORATA — VILLAVICIOSA",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:17",
              "element": "SHUNT REACTOR CABRA 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:21",
              "element": "SHUNT REACTOR PEÑAFLOR 400 REA 1",
              "movement": "SWITCH OFF",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "12:21",
              "element": "LINE L-400 kV PINILLA — ROMICA 2",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "12:22",
              "element": "LINE L-400 kV PINILLA — ROCAMORA 1",
              "movement": "SWITCH ON",
              "zone": "EAST",
              "hour_critical": true
            },
            {
              "hour": "12:24",
              "element": "SHUNT REACTOR PALOS 220 REA 1",
              "movement": "SWITCH OFF",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:24",
              "element": "SHUNT REACTOR MORATA 400 REA 4",
              "movement": "SWITCH OFF",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:25",
              "element": "LINE L-400 kV GUADAME — CABRA 3",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:25",
              "element": "LINE L-400 KV TORDESILLAS — GALAPAGAR",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:26",
              "element": "SHUNT REACTOR VITORIA 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "12:27",
              "element": "SHUNT REACTOR PEÑAFLOR 400 REA 1",
              "movement": "SWITCH ON",
              "zone": "NORTH",
              "hour_critical": true
            },
            {
              "hour": "12:27",
              "element": "SHUNT REACTOR GUADAME 220 REA 3",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:27",
              "element": "SHUNT REACTOR GUADAME 400 REA 2",
              "movement": "SWITCH ON",
              "zone": "SOUTH",
              "hour_critical": true
            },
            {
              "hour": "12:28",
              "element": "SHUNT REACTOR MORATA 400 REA 4",
              "movement": "SWITCH ON",
              "zone": "CENTRE",
              "hour_critical": true
            },
            {
              "hour": "12:32",
              "element": "HVDC 320 kV STA. LLOGAIA — BAIXAS",
              "movement": "REDUCE SETPOINT TO 409 kV",
              "zone": "NORTHEAST",
              "hour_critical": true
            }
          ],
          "note": "Maniobras realizadas por Red Eléctrica entre las 09:00 y las 12:32 del 28 de abril."
        },
        {
          "id": "re-topological-manoeuvres",
          "name": "Maniobras Topológicas de Red Eléctrica",
          "source": "Informe ENTSO-E (Lista de trabajos topológicos)",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hora"
            },
            {
              "key": "element",
              "label": "Elemento"
            },
            {
              "key": "zone",
              "label": "Zona"
            },
            {
              "key": "comment",
              "label": "Comentario"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "element": "SE 220 kV SERRALLO",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:03",
              "element": "SE 220 kV STA. ELVIRA",
              "zone": "SOUTH",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:16",
              "element": "SE 220 kV ACECA pos",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:21",
              "element": "PRADILLOS SE 220 kV TORRELLANO",
              "zone": "EAST",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:37",
              "element": "SE 400 kV ALDEADAVILA: JBP2",
              "zone": "NORTHWEST",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:37",
              "element": "SE 400 kV FAUSITA",
              "zone": "EAST",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:52",
              "element": "L-220 kV PRADO SANTO DOMINGO—VILLAVICIOSA",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:52",
              "element": "SE 220 kV VILLAVICIOSA pos ACJ",
              "zone": "SOUTH",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "09:53",
              "element": "SE 400 kV GUILLENA: L/COLLECTOR 1",
              "zone": "SOUTH",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "10:46",
              "element": "SE 400 kV PALOS: AT-2 and TM-2",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "11:15",
              "element": "L-220 kV VILLAVICIOSA—LUCERO—LEGANES",
              "zone": "SOUTH",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "11:36",
              "element": "SE 220 kV ACECA: 522-1 Switch",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true
            },
            {
              "hour": "12:16",
              "element": "SE 220 kV SS. REYES: L/PS. FERNANDO",
              "zone": "CENTER",
              "comment": "",
              "hour_critical": true,
              "element_critical": true
            }
          ]
        },
        {
          "id": "ren-topological-manoeuvres",
          "name": "Maniobras Topológicas de REN (Portugal)",
          "source": "Informe ENTSO-E Tabla 2-3",
          "type": "table",
          "columns": [
            {
              "key": "type",
              "label": "Tipo"
            },
            {
              "key": "element",
              "label": "Elemento"
            },
            {
              "key": "start",
              "label": "Inicio"
            },
            {
              "key": "end",
              "label": "Fin"
            },
            {
              "key": "reason",
              "label": "Motivo"
            }
          ],
          "data": [
            {
              "type": "Line",
              "element": "Fanhoes–Pegoes 400",
              "start": "26/04 19:46",
              "end": "30/04 06:23",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Line",
              "element": "Panoias–Tavira 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Line",
              "element": "Ferreiro do Alentejo–Panoias 400",
              "start": "27/04 02:18",
              "end": "28/04 09:07",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Feira 180 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 05:24",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Castelo Branco 70 Mvar",
              "start": "28/04 09:09",
              "end": "29/04 00:12",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Portimao 180 Mvar",
              "start": "28/04 10:03",
              "end": "28/04 23:33",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Pedralva 180 Mvar",
              "start": "28/04 10:03",
              "end": "29/04 02:41",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Paraimo 180 Mvar",
              "start": "28/04 10:06",
              "end": "29/04 00:37",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Armamar 180 Mvar",
              "start": "28/04 10:27",
              "end": "29/04 02:39",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS1 - S. Fanhoes 180 Mvar",
              "start": "28/04 10:27",
              "end": "28/04 22:51",
              "reason": "Manual voltage control",
              "start_critical": true,
              "end_critical": true
            },
            {
              "type": "Shunt Reactor",
              "element": "RS2 - S. Palmela 180 Mvar",
              "start": "28/04 12:19",
              "end": "28/04 23:56",
              "reason": "Trip due to low voltage protection",
              "start_critical": true,
              "end_critical": true
            }
          ]
        },
        {
          "id": "lines-outage-icai",
          "name": "Líneas Abiertas por Área (9:00 CEST)",
          "source": "Informe ICAI Tabla 4-2",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "Área"
            },
            {
              "key": "open_220",
              "label": "Líneas abiertas (220 kV)"
            },
            {
              "key": "open_400",
              "label": "Líneas abiertas (400 kV)"
            },
            {
              "key": "unavail_220",
              "label": "Indisponibles (220 kV)"
            },
            {
              "key": "unavail_400",
              "label": "Indisponibles (400 kV)"
            },
            {
              "key": "works_220",
              "label": "Trabajos previstos (220 kV)"
            },
            {
              "key": "works_400",
              "label": "Trabajos previstos (400 kV)"
            }
          ],
          "data": [
            {
              "area": "NOROESTE",
              "open_220": 7,
              "open_400": 7,
              "unavail_220": 3,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 2,
              "open_220_critical": true,
              "open_400_critical": true,
              "unavail_220_critical": true,
              "unavail_400_critical": true,
              "works_220_critical": true,
              "works_400_critical": true
            },
            {
              "area": "NORTE",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1,
              "open_220_critical": true,
              "open_400_critical": true,
              "unavail_220_critical": true,
              "unavail_400_critical": true,
              "works_220_critical": true,
              "works_400_critical": true
            },
            {
              "area": "ESTE",
              "open_220": 3,
              "open_400": 3,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1,
              "open_220_critical": true,
              "open_400_critical": true,
              "unavail_220_critical": true,
              "unavail_400_critical": true,
              "works_220_critical": true,
              "works_400_critical": true
            },
            {
              "area": "CENTRO",
              "open_220": 5,
              "open_400": 5,
              "unavail_220": 1,
              "unavail_400": 1,
              "works_220": 1,
              "works_400": 1,
              "open_220_critical": true,
              "open_400_critical": true,
              "unavail_220_critical": true,
              "unavail_400_critical": true,
              "works_220_critical": true,
              "works_400_critical": true
            },
            {
              "area": "SUR",
              "open_220": 10,
              "open_400": 10,
              "unavail_220": 3,
              "unavail_400": 3,
              "works_220": 3,
              "works_400": 3,
              "open_220_critical": true,
              "open_400_critical": true,
              "unavail_220_critical": true,
              "unavail_400_critical": true,
              "works_220_critical": true,
              "works_400_critical": true
            }
          ],
          "note": "Número de líneas abiertas por control de tensión, indisponibilidades y trabajos previstos a las 9:00."
        },
        {
          "id": "km-percentage-icai",
          "name": "Porcentaje de km de Líneas Abiertas por Área",
          "source": "Informe ICAI Tabla 4-3",
          "type": "table",
          "columns": [
            {
              "key": "area",
              "label": "Área"
            },
            {
              "key": "pct_open_220",
              "label": "% km abiertas (220 kV)"
            },
            {
              "key": "pct_open_400",
              "label": "% km abiertas (400 kV)"
            },
            {
              "key": "pct_unavail_220",
              "label": "% km indisponibles (220 kV)"
            },
            {
              "key": "pct_unavail_400",
              "label": "% km indisponibles (400 kV)"
            },
            {
              "key": "pct_works_220",
              "label": "% km trabajos (220 kV)"
            },
            {
              "key": "pct_works_400",
              "label": "% km trabajos (400 kV)"
            }
          ],
          "data": [
            {
              "area": "NOROESTE",
              "pct_open_220": 20.74,
              "pct_open_400": 2.5,
              "pct_unavail_220": 0.9,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": "",
              "pct_open_220_critical": true,
              "pct_open_400_critical": true,
              "pct_unavail_220_critical": true,
              "pct_unavail_400_critical": true,
              "pct_works_220_critical": true
            },
            {
              "area": "NORTE",
              "pct_open_220": 14.4,
              "pct_open_400": 0.7,
              "pct_unavail_220": 1.6,
              "pct_unavail_400": 0.3,
              "pct_works_220": 1.3,
              "pct_works_400": "",
              "pct_open_220_critical": true,
              "pct_open_400_critical": true,
              "pct_unavail_220_critical": true,
              "pct_unavail_400_critical": true,
              "pct_works_220_critical": true
            },
            {
              "area": "ESTE",
              "pct_open_220": 1.5,
              "pct_open_400": 8.5,
              "pct_unavail_220": 2.8,
              "pct_unavail_400": 4.8,
              "pct_works_220": 0.3,
              "pct_works_400": 1.3,
              "pct_open_220_critical": true,
              "pct_open_400_critical": true,
              "pct_unavail_220_critical": true,
              "pct_unavail_400_critical": true,
              "pct_works_220_critical": true,
              "pct_works_400_critical": true
            },
            {
              "area": "CENTRO",
              "pct_open_220": 7,
              "pct_open_400": 26.7,
              "pct_unavail_220": 5.6,
              "pct_unavail_400": 2.2,
              "pct_works_220": 0.4,
              "pct_works_400": 5.4,
              "pct_open_220_critical": true,
              "pct_open_400_critical": true,
              "pct_unavail_220_critical": true,
              "pct_unavail_400_critical": true,
              "pct_works_220_critical": true,
              "pct_works_400_critical": true
            },
            {
              "area": "SUR",
              "pct_open_220": 27.5,
              "pct_open_400": 8.3,
              "pct_unavail_220": 3.8,
              "pct_unavail_400": 0.2,
              "pct_works_220": 1.4,
              "pct_works_400": "",
              "pct_open_220_critical": true,
              "pct_open_400_critical": true,
              "pct_unavail_220_critical": true,
              "pct_unavail_400_critical": true,
              "pct_works_220_critical": true
            }
          ]
        }
      ],
      "summary": [
        {
          "label": "Maniobras Topológicas",
          "value": "30+",
          "status": "🔴 EMERGENCIA"
        },
        {
          "label": "Efecto Tap-Lag",
          "value": "Sí",
          "status": "🔴 COMPLICACIÓN"
        },
        {
          "label": "Líneas Abiertas Iniciales",
          "value": "18%",
          "status": "⚠️ ALTO"
        }
      ],
      "reflection": "El intento de los operadores de controlar la sobretensión mediante la apertura manual de líneas generó un efecto indeseado de carga capacitiva, empeorando el transitorio debido a la alta penetración de IBRs."
    },
    {
      "id": "demand-load",
      "name": "Demanda y Carga",
      "icon": "📊",
      "color": "hsl(40 95% 50%)",
      "tables": [
        {
          "id": "demand-shedding-es",
          "name": "Desconexión de Demanda en España",
          "source": "Informe ENTSO-E Tabla 3-9",
          "type": "table",
          "columns": [
            {
              "key": "step",
              "label": "Escalón"
            },
            {
              "key": "threshold_hz",
              "label": "Umbral (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Carga desconectada (MW)"
            },
            {
              "key": "real_pct",
              "label": "Real (% demanda)"
            },
            {
              "key": "plan_pct",
              "label": "Planificado (% demanda)"
            }
          ],
          "data": [
            {
              "step": "1st",
              "threshold_hz": 49,
              "load_mw": 1176,
              "real_pct": 4.7,
              "plan_pct": 6,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "step": "2nd",
              "threshold_hz": 48.8,
              "load_mw": 1669,
              "real_pct": 6.6,
              "plan_pct": 9,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "step": "3rd",
              "threshold_hz": 48.6,
              "load_mw": 1575,
              "real_pct": 6.3,
              "plan_pct": 8,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "step": "4th",
              "threshold_hz": 48.4,
              "load_mw": 1524,
              "real_pct": 6.1,
              "plan_pct": 8,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "step": "5th",
              "threshold_hz": 48.2,
              "load_mw": 1294,
              "real_pct": 5.1,
              "plan_pct": 7,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "step": "6th",
              "threshold_hz": 48,
              "load_mw": 1267,
              "real_pct": 5,
              "plan_pct": 7,
              "step_critical": true,
              "real_pct_critical": true,
              "plan_pct_critical": true
            }
          ],
          "note": "Total carga desconectada en España: 8.505 MW (33,8% de la demanda)."
        },
        {
          "id": "demand-shedding-pt",
          "name": "Desconexión de Demanda en Portugal (LFDD)",
          "source": "Informe ENTSO-E Tabla 3-12",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Umbral (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Carga desconectada (MW)"
            },
            {
              "key": "real_pct",
              "label": "Real (% demanda)"
            },
            {
              "key": "plan_pct",
              "label": "Planificado (% demanda)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.7,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "threshold_hz": 48.8,
              "load_mw": 293,
              "real_pct": 5,
              "plan_pct": 6.6,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "threshold_hz": 48.6,
              "load_mw": 315,
              "real_pct": 5.3,
              "plan_pct": 6.9,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "threshold_hz": 48.4,
              "load_mw": 323,
              "real_pct": 5.5,
              "plan_pct": 6.6,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "threshold_hz": 48.2,
              "load_mw": 282,
              "real_pct": 4.8,
              "plan_pct": 6.4,
              "real_pct_critical": true,
              "plan_pct_critical": true
            },
            {
              "threshold_hz": 48,
              "load_mw": 427,
              "real_pct": 7.3,
              "plan_pct": 9.7,
              "real_pct_critical": true,
              "plan_pct_critical": true
            }
          ],
          "note": "Total carga desconectada en Portugal: 1.955 MW (33,3% de la demanda)."
        },
        {
          "id": "electro-intensive-pt",
          "name": "Desconexión de Consumidores Electro-intensivos (Portugal)",
          "source": "Informe ENTSO-E Tabla 3-11",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Umbral (Hz)"
            },
            {
              "key": "load_mw",
              "label": "Carga desconectada (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "load_mw": 218
            }
          ]
        },
        {
          "id": "load-shedding-es-pt",
          "name": "Resumen Desconexión de Carga ES + PT",
          "source": "Informe ENTSO-E Tabla 3-15",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Umbral (Hz)"
            },
            {
              "key": "ind_pt_mw",
              "label": "Electro-intensivos PT (MW)"
            },
            {
              "key": "other_pt_mw",
              "label": "Otra carga PT (MW)"
            },
            {
              "key": "other_es_mw",
              "label": "Otra carga ES (MW)"
            },
            {
              "key": "total_mw",
              "label": "Total (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49.2,
              "ind_pt_mw": 218,
              "other_pt_mw": 0,
              "other_es_mw": 0,
              "total_mw": 218,
              "other_pt_mw_critical": true,
              "other_es_mw_critical": true
            },
            {
              "threshold_hz": 49,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1176,
              "total_mw": 1491,
              "ind_pt_mw_critical": true
            },
            {
              "threshold_hz": 48.8,
              "ind_pt_mw": 0,
              "other_pt_mw": 293,
              "other_es_mw": 1669,
              "total_mw": 1962,
              "ind_pt_mw_critical": true
            },
            {
              "threshold_hz": 48.6,
              "ind_pt_mw": 0,
              "other_pt_mw": 315,
              "other_es_mw": 1575,
              "total_mw": 1890,
              "ind_pt_mw_critical": true
            },
            {
              "threshold_hz": 48.4,
              "ind_pt_mw": 0,
              "other_pt_mw": 323,
              "other_es_mw": 1524,
              "total_mw": 1847,
              "ind_pt_mw_critical": true
            },
            {
              "threshold_hz": 48.2,
              "ind_pt_mw": 0,
              "other_pt_mw": 282,
              "other_es_mw": 1294,
              "total_mw": 1576,
              "ind_pt_mw_critical": true
            },
            {
              "threshold_hz": 48,
              "ind_pt_mw": 0,
              "other_pt_mw": 427,
              "other_es_mw": 1267,
              "total_mw": 1694,
              "ind_pt_mw_critical": true
            }
          ],
          "note": "Total global de carga desconectada: 10.678 MW."
        },
        {
          "id": "dso-load-shedding",
          "name": "Desconexión por Distribuidora (DSO)",
          "source": "Informe ENTSO-E Tabla 3-16",
          "type": "table",
          "columns": [
            {
              "key": "threshold_hz",
              "label": "Umbral (Hz)"
            },
            {
              "key": "dso1_mw",
              "label": "DSO1 (MW)"
            },
            {
              "key": "dso2_mw",
              "label": "DSO2 (MW)"
            },
            {
              "key": "dso3_mw",
              "label": "DSO3 (MW)"
            },
            {
              "key": "dso4_mw",
              "label": "DSO4 (MW)"
            },
            {
              "key": "dso5_mw",
              "label": "DSO5 (MW)"
            },
            {
              "key": "e_redes_mw",
              "label": "E-REDES PT (MW)"
            },
            {
              "key": "total_mw",
              "label": "Total DSO (MW)"
            }
          ],
          "data": [
            {
              "threshold_hz": 49,
              "dso1_mw": 85.1,
              "dso2_mw": 23.7,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 97,
              "e_redes_mw": 315,
              "total_mw": 520.8,
              "dso2_mw_critical": true
            },
            {
              "threshold_hz": 48.8,
              "dso1_mw": 529.9,
              "dso2_mw": 190,
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 767.5,
              "e_redes_mw": 293,
              "total_mw": 1780.4
            },
            {
              "threshold_hz": 48.7,
              "dso1_mw": 49.6,
              "dso2_mw": "",
              "dso3_mw": "",
              "dso4_mw": "",
              "dso5_mw": 21.4,
              "e_redes_mw": "",
              "total_mw": 71,
              "dso5_mw_critical": true
            },
            {
              "threshold_hz": 48.6,
              "dso1_mw": 423.9,
              "dso2_mw": 195.7,
              "dso3_mw": "",
              "dso4_mw": 5.2,
              "dso5_mw": 628.1,
              "e_redes_mw": 315,
              "total_mw": 1567.9,
              "dso4_mw_critical": true
            },
            {
              "threshold_hz": 48.4,
              "dso1_mw": 633.8,
              "dso2_mw": 216.8,
              "dso3_mw": "",
              "dso4_mw": 21.6,
              "dso5_mw": 651.7,
              "e_redes_mw": 323,
              "total_mw": 1846.9,
              "dso4_mw_critical": true
            },
            {
              "threshold_hz": 48.2,
              "dso1_mw": 412.3,
              "dso2_mw": 220.3,
              "dso3_mw": 60.4,
              "dso4_mw": 12.2,
              "dso5_mw": 589.1,
              "e_redes_mw": 282,
              "total_mw": 1576.3,
              "dso4_mw_critical": true
            },
            {
              "threshold_hz": 48,
              "dso1_mw": 544.1,
              "dso2_mw": 218.2,
              "dso3_mw": 0.7,
              "dso4_mw": 11.6,
              "dso5_mw": 492.5,
              "e_redes_mw": 427,
              "total_mw": 1694.1,
              "dso3_mw_critical": true,
              "dso4_mw_critical": true
            }
          ]
        },
        {
          "id": "spanish-demand-forecast",
          "name": "Previsión de Demanda Española (28-A)",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hora"
            },
            {
              "key": "real_mw",
              "label": "Real (MW)"
            },
            {
              "key": "forecast_d2",
              "label": "Prev D-2 (MW)"
            },
            {
              "key": "forecast_d1",
              "label": "Prev D-1 (MW)"
            },
            {
              "key": "forecast_8h",
              "label": "Prev 8:00 (MW)"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 26900,
              "forecast_d2": 27600,
              "forecast_d1": 27600,
              "forecast_8h": 27500,
              "hour_critical": true
            },
            {
              "hour": "09:15",
              "real_mw": 26850,
              "forecast_d2": 27400,
              "forecast_d1": 27350,
              "forecast_8h": 27350,
              "hour_critical": true
            },
            {
              "hour": "09:30",
              "real_mw": 26650,
              "forecast_d2": 27350,
              "forecast_d1": 27200,
              "forecast_8h": 27200,
              "hour_critical": true
            },
            {
              "hour": "09:45",
              "real_mw": 26550,
              "forecast_d2": 27250,
              "forecast_d1": 27050,
              "forecast_8h": 27000,
              "hour_critical": true
            },
            {
              "hour": "10:00",
              "real_mw": 26250,
              "forecast_d2": 27200,
              "forecast_d1": 26900,
              "forecast_8h": 26850,
              "hour_critical": true
            },
            {
              "hour": "10:15",
              "real_mw": 25950,
              "forecast_d2": 27050,
              "forecast_d1": 26800,
              "forecast_8h": 26700,
              "hour_critical": true
            },
            {
              "hour": "10:30",
              "real_mw": 25950,
              "forecast_d2": 26900,
              "forecast_d1": 26650,
              "forecast_8h": 26500,
              "hour_critical": true
            },
            {
              "hour": "10:45",
              "real_mw": 25450,
              "forecast_d2": 26700,
              "forecast_d1": 26450,
              "forecast_8h": 26300,
              "hour_critical": true
            },
            {
              "hour": "11:00",
              "real_mw": 25750,
              "forecast_d2": 26500,
              "forecast_d1": 26200,
              "forecast_8h": 26050,
              "hour_critical": true
            },
            {
              "hour": "11:15",
              "real_mw": 25400,
              "forecast_d2": 26350,
              "forecast_d1": 26000,
              "forecast_8h": 25900,
              "hour_critical": true
            },
            {
              "hour": "11:30",
              "real_mw": 25100,
              "forecast_d2": 26250,
              "forecast_d1": 25900,
              "forecast_8h": 25800,
              "hour_critical": true
            },
            {
              "hour": "11:45",
              "real_mw": 24850,
              "forecast_d2": 26150,
              "forecast_d1": 25800,
              "forecast_8h": 25700,
              "hour_critical": true
            },
            {
              "hour": "12:00",
              "real_mw": 24950,
              "forecast_d2": 26100,
              "forecast_d1": 25700,
              "forecast_8h": 25650,
              "hour_critical": true
            },
            {
              "hour": "12:15",
              "real_mw": 24900,
              "forecast_d2": 26050,
              "forecast_d1": 25700,
              "forecast_8h": 25650,
              "hour_critical": true
            }
          ]
        },
        {
          "id": "portuguese-demand-forecast",
          "name": "Previsión de Demanda Portuguesa (28-A)",
          "source": "Informe ENTSO-E Figure 2-5",
          "type": "table",
          "columns": [
            {
              "key": "hour",
              "label": "Hora"
            },
            {
              "key": "real_mw",
              "label": "Real (MW)"
            },
            {
              "key": "forecast_d2",
              "label": "Prev D-2 (MW)"
            },
            {
              "key": "forecast_d1",
              "label": "Prev D-1 (MW)"
            },
            {
              "key": "forecast_8h",
              "label": "Prev 8:00 (MW)"
            }
          ],
          "data": [
            {
              "hour": "09:00",
              "real_mw": 5700,
              "forecast_d2": 5750,
              "forecast_d1": 5720,
              "forecast_8h": 5710,
              "hour_critical": true
            },
            {
              "hour": "09:15",
              "real_mw": 5780,
              "forecast_d2": 5900,
              "forecast_d1": 5850,
              "forecast_8h": 5820,
              "hour_critical": true
            },
            {
              "hour": "09:30",
              "real_mw": 5900,
              "forecast_d2": 5980,
              "forecast_d1": 5930,
              "forecast_8h": 5920,
              "hour_critical": true
            },
            {
              "hour": "09:45",
              "real_mw": 5920,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5930,
              "hour_critical": true
            },
            {
              "hour": "10:00",
              "real_mw": 5930,
              "forecast_d2": 5990,
              "forecast_d1": 5980,
              "forecast_8h": 5950,
              "hour_critical": true
            },
            {
              "hour": "10:15",
              "real_mw": 5910,
              "forecast_d2": 5950,
              "forecast_d1": 5970,
              "forecast_8h": 5910,
              "hour_critical": true
            },
            {
              "hour": "10:30",
              "real_mw": 5920,
              "forecast_d2": 5930,
              "forecast_d1": 5950,
              "forecast_8h": 5880,
              "hour_critical": true
            },
            {
              "hour": "10:45",
              "real_mw": 5830,
              "forecast_d2": 5880,
              "forecast_d1": 5930,
              "forecast_8h": 5850,
              "hour_critical": true
            },
            {
              "hour": "11:00",
              "real_mw": 5760,
              "forecast_d2": 5840,
              "forecast_d1": 5890,
              "forecast_8h": 5820,
              "hour_critical": true
            },
            {
              "hour": "11:15",
              "real_mw": 5780,
              "forecast_d2": 5820,
              "forecast_d1": 5890,
              "forecast_8h": 5790,
              "hour_critical": true
            },
            {
              "hour": "11:30",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5880,
              "forecast_8h": 5780,
              "hour_critical": true
            },
            {
              "hour": "11:45",
              "real_mw": 5710,
              "forecast_d2": 5790,
              "forecast_d1": 5870,
              "forecast_8h": 5790,
              "hour_critical": true
            },
            {
              "hour": "12:00",
              "real_mw": 5740,
              "forecast_d2": 5800,
              "forecast_d1": 5890,
              "forecast_8h": 5790,
              "hour_critical": true
            },
            {
              "hour": "12:15",
              "real_mw": 5790,
              "forecast_d2": 5790,
              "forecast_d1": 5890,
              "forecast_8h": 5790,
              "hour_critical": true
            }
          ]
        }
      ],
      "summary": [
        {
          "label": "Carga Desconectada",
          "value": "> 30%",
          "status": "🔴 COLAPSO"
        },
        {
          "label": "Escalones UFLS",
          "value": "5/5",
          "status": "🔴 AGOTADOS"
        },
        {
          "label": "Impacto Social",
          "value": "Masivo",
          "status": "🔴 CRÍTICO"
        }
      ],
      "reflection": "El deslastre por subfrecuencia funcionó como última línea de defensa, sacrificando un tercio de la demanda ibérica para evitar el colapso sincrónico del núcleo europeo."
    },
    {
      "id": "recovery-eas",
      "name": "Recuperación y EAS",
      "icon": "🔄",
      "color": "hsl(140 60% 50%)",
      "tables": [
        {
          "id": "eas-state-changes",
          "name": "Cambios de Estado en ENTSO-E EAS",
          "source": "Informe ENTSO-E",
          "type": "table",
          "columns": [
            {
              "key": "datetime",
              "label": "Fecha/Hora"
            },
            {
              "key": "tso",
              "label": "TSO"
            },
            {
              "key": "from_state",
              "label": "Desde"
            },
            {
              "key": "to_state",
              "label": "Hasta"
            }
          ],
          "data": [
            {
              "datetime": "28 April, 12:40",
              "tso": "REN",
              "from_state": "Normal",
              "to_state": "blackout",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 12:40",
              "tso": "RE",
              "from_state": "Normal",
              "to_state": "blackout",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 12:49",
              "tso": "Swissgrid (CC South)",
              "from_state": "Normal",
              "to_state": "emergency",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 12:49",
              "tso": "Amprion (CC North)",
              "from_state": "Normal",
              "to_state": "emergency",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 12:50",
              "tso": "RTE",
              "from_state": "Normal",
              "to_state": "emergency",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 13:10",
              "tso": "RE",
              "from_state": "blackout",
              "to_state": "restoration",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 14:35",
              "tso": "RTE",
              "from_state": "emergency",
              "to_state": "alert",
              "datetime_critical": true
            },
            {
              "datetime": "28 April, 17:05",
              "tso": "REN",
              "from_state": "blackout",
              "to_state": "restoration",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 02:13",
              "tso": "REN",
              "from_state": "restoration",
              "to_state": "emergency",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 03:00",
              "tso": "RE",
              "from_state": "restoration",
              "to_state": "emergency",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 11:15",
              "tso": "Swissgrid (CC South)",
              "from_state": "emergency",
              "to_state": "normal",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 11:15",
              "tso": "Amprion (CC North)",
              "from_state": "emergency",
              "to_state": "normal",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 11:20",
              "tso": "RTE",
              "from_state": "alert",
              "to_state": "normal",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 14:40",
              "tso": "RE",
              "from_state": "emergency",
              "to_state": "alert",
              "datetime_critical": true
            },
            {
              "datetime": "29 April, 14:40",
              "tso": "REN",
              "from_state": "emergency",
              "to_state": "alert",
              "datetime_critical": true
            },
            {
              "datetime": "30 April, 12:40",
              "tso": "RE",
              "from_state": "alert",
              "to_state": "normal",
              "datetime_critical": true
            },
            {
              "datetime": "30 April, 12:50",
              "tso": "REN",
              "from_state": "alert",
              "to_state": "normal",
              "datetime_critical": true
            }
          ]
        }
      ]
    },
    {
      "id": "government-data",
      "name": "Informe Gobierno y Potencia",
      "icon": "🏛️",
      "color": "hsl(220 12% 55%)",
      "tables": [
        {
          "id": "unavailable-capacity",
          "name": "Potencia Indisponible e Instalada por Tecnología",
          "source": "Informe Gobierno (REE)",
          "type": "table",
          "columns": [
            {
              "key": "technology",
              "label": "Tecnología"
            },
            {
              "key": "unavailable_mw",
              "label": "Potencia Indisponible (MW)"
            },
            {
              "key": "installed_mw",
              "label": "Potencia Instalada (MW)"
            }
          ],
          "data": [
            {
              "technology": "Carbón",
              "unavailable_mw": 903.5,
              "installed_mw": 1820
            },
            {
              "technology": "Ciclo combinado",
              "unavailable_mw": 7426.3,
              "installed_mw": 24562
            },
            {
              "technology": "Fuel-gas",
              "unavailable_mw": 0,
              "installed_mw": 8,
              "unavailable_mw_critical": true,
              "installed_mw_critical": true
            },
            {
              "technology": "Nuclear",
              "unavailable_mw": 3078.6,
              "installed_mw": 7117
            },
            {
              "technology": "Turbinación bombeo",
              "unavailable_mw": 1392.1,
              "installed_mw": 3331
            }
          ],
          "note": "Valores previos al incidente. Potencia indisponible considerando periodos horarios completos."
        },
        {
          "id": "compass-lexecon",
          "name": "Comparativa de Conclusiones (Compass Lexecon / INESC TEC)",
          "source": "Informe Compass Lexecon",
          "type": "table",
          "columns": [
            {
              "key": "entity",
              "label": "Entidad"
            },
            {
              "key": "point1",
              "label": "1"
            },
            {
              "key": "point2",
              "label": "2"
            },
            {
              "key": "point3",
              "label": "3"
            },
            {
              "key": "point4",
              "label": "4"
            },
            {
              "key": "point5",
              "label": "5"
            },
            {
              "key": "point6",
              "label": "6"
            },
            {
              "key": "point7",
              "label": "7"
            },
            {
              "key": "point8",
              "label": "8"
            }
          ],
          "data": [
            {
              "entity": "Gobierno de España",
              "point1": "No se analiza",
              "point2": "Se produjeron fluctuaciones relevantes",
              "point3": "Menor número de grupos térmicos acoplados del año",
              "point4": "Se produjeron fluctuaciones relevantes",
              "point5": "El cambio de interconexión a modo fijo agravó la situación",
              "point6": "No cumplió normativa",
              "point7": "Círculo vicioso de sobretensión y algunos disparos incorrectos",
              "point8": "No se analiza"
            },
            {
              "entity": "Red Eléctrica",
              "point1": "No se analiza",
              "point2": "No se analiza",
              "point3": "Fue adecuado",
              "point4": "La situación era estable",
              "point5": "El cambio de interconexión a modo fijo NO agravó la situación",
              "point6": "No cumplió normativa",
              "point7": "Disparos incorrectos",
              "point8": "No se analiza"
            },
            {
              "entity": "Compass Lexecon / INESC TEC",
              "point1": "Han aumentado en los últimos años",
              "point2": "Se produjeron fluctuaciones relevantes",
              "point3": "La menor capacidad de control tensión en el año y más escasa en el sur",
              "point4": "Se produjeron fluctuaciones relevantes",
              "point5": "Pendiente de análisis",
              "point6": "No existía suficiente generación convencional para controlar tensión",
              "point7": "Parecen poco probables fallos simultáneos sin una causa sistémica",
              "point8": "Disminución de fluctuaciones"
            }
          ]
        }
      ]
    }
  ]
}
```


--- FILE: vercel.json ---
```json
{
  "outputDirectory": "build",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net; font-src 'self' fonts.gstatic.com data:; img-src 'self' data: blob: tile.openstreetmap.org *.openstreetmap.org; connect-src 'self'; frame-src 'self'; worker-src 'self' blob:"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/img/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/figuras/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=2592000, stale-while-revalidate=86400"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/en",
      "destination": "/en/introduccion"
    },
    {
      "source": "/en/",
      "destination": "/en/introduccion"
    },
    {
      "source": "/de",
      "destination": "/de/introduccion"
    },
    {
      "source": "/de/",
      "destination": "/de/introduccion"
    }
  ],
  "functions": {
    "api/chat.js": {
      "includeFiles": "{static/*.json,node_modules/minisearch/dist/**/*}"
    }
  }
}
```
