# Auditoría del glosario técnico (Actualizada: Arquitectura AST)

## 1. Arquitectura detectada

* **Archivo de datos**: `src/data/glossary.js`.
* **Mecanismo de marcado**: ¡Automático en tiempo de compilación! Docusaurus usa un plugin AST personalizado (`plugins/remark-auto-glossary-links.js`).
* **Funcionamiento**: El plugin lee la constante `RAW_TERMS` (que tiene 119 términos), busca la primera aparición en texto plano dentro de los MDX (ignorando código, jsx, enlaces) y la reemplaza por un `<span class="glossary-term glossary-term-first" data-term="...">`.
* **Consecuencia**: Los archivos MDX se mantienen limpios (no hay que escribir el marcado a mano), pero cualquier desincronización entre `RAW_TERMS` y `glossary.js` produce enlaces rotos.

## 2. Resumen global

* **Total de términos en `glossary.js`**: 94
* **Total de términos en el plugin AST (`RAW_TERMS`)**: 234
* **Apariciones correctamente detectadas y enlazadas**: 38
* **Enlaces rotos potenciales**: 74 (términos en el plugin sin contraparte exacta en el glosario)
* **Términos definidos pero excluidos del plugin**: 0 (aparecen en el texto pero no están en `RAW_TERMS`)
* **Términos candidatos propuestos**: 9

## 3. Diagnóstico por capítulo

### 01-introduccion.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| ENTSO-E | `#entso-e` | OK |
| Tap-Lag | `#tap-lag` | OK |
| AELEC | `#aelec` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| SCADA | Aparece en `RAW_TERMS` pero su slug `scada` no existe en `glossary.js` |
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| GFM | Aparece en `RAW_TERMS` pero su slug `gfm` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| PMU | Aparece en `RAW_TERMS` pero su slug `pmu` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| SCR | Aparece en `RAW_TERMS` pero su slug `scr` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 02-contexto.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| Capacidad Neta de Transferencia (NTC) | `#capacidad-neta-de-transferencia-ntc` | OK |
| Black Start | `#black-start` | OK |
| ENTSO-E | `#entso-e` | OK |
| EAS | `#eas` | OK |
| PLL | `#pll` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| RoCoF | Aparece en `RAW_TERMS` pero su slug `rocof` no existe en `glossary.js` |
| HVDC | Aparece en `RAW_TERMS` pero su slug `hvdc` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| SCR | Aparece en `RAW_TERMS` pero su slug `scr` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 03-analisis-incidente.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| Estabilizadores del Sistema de Potencia (PSS) | `#estabilizadores-del-sistema-de-potencia-pss` | OK |
| ENTSO-E | `#entso-e` | OK |
| Tap-Lag | `#tap-lag` | OK |
| OLTC | `#oltc` | OK |
| OST | `#ost` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| RoCoF | Aparece en `RAW_TERMS` pero su slug `rocof` no existe en `glossary.js` |
| SCADA | Aparece en `RAW_TERMS` pero su slug `scada` no existe en `glossary.js` |
| HVDC | Aparece en `RAW_TERMS` pero su slug `hvdc` no existe en `glossary.js` |
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| WAMS | Aparece en `RAW_TERMS` pero su slug `wams` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| PMU | Aparece en `RAW_TERMS` pero su slug `pmu` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 04-reaccion-reposicion.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| Centros de Coordinación Regional (RCC) | `#centros-de-coordinacion-regional-rcc` | OK |
| Black Start | `#black-start` | OK |
| ENTSO-E | `#entso-e` | OK |
| EAS | `#eas` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| aFRR | Aparece en `RAW_TERMS` pero su slug `afrr` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| RCC | Aparece en `RAW_TERMS` pero su slug `rcc` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 05-analisis-informes.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| Oscilaciones electromecánicas | `#oscilaciones-electromecanicas` | OK |
| Black Start | `#black-start` | OK |
| ENTSO-E | `#entso-e` | OK |
| Tap-Lag | `#tap-lag` | OK |
| AELEC | `#aelec` | OK |
| PLL | `#pll` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| NC RfG | Aparece en `RAW_TERMS` pero su slug `nc-rfg` no existe en `glossary.js` |
| SCADA | Aparece en `RAW_TERMS` pero su slug `scada` no existe en `glossary.js` |
| CCGT | Aparece en `RAW_TERMS` pero su slug `ccgt` no existe en `glossary.js` |
| HVDC | Aparece en `RAW_TERMS` pero su slug `hvdc` no existe en `glossary.js` |
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| WAMS | Aparece en `RAW_TERMS` pero su slug `wams` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| PMU | Aparece en `RAW_TERMS` pero su slug `pmu` no existe en `glossary.js` |
| RCC | Aparece en `RAW_TERMS` pero su slug `rcc` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 06-impacto-comunicativo.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| ENTSO-E | `#entso-e` | OK |
| OLTC | `#oltc` | OK |
| OST | `#ost` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 07-resiliencia-futuro.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| Black Start | `#black-start` | OK |
| ENTSO-E | `#entso-e` | OK |
| OLTC | `#oltc` | OK |
| EAS | `#eas` | OK |
| PLL | `#pll` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| SynCon | Aparece en `RAW_TERMS` pero su slug `syncon` no existe en `glossary.js` |
| NC RfG | Aparece en `RAW_TERMS` pero su slug `nc-rfg` no existe en `glossary.js` |
| RoCoF | Aparece en `RAW_TERMS` pero su slug `rocof` no existe en `glossary.js` |
| SCADA | Aparece en `RAW_TERMS` pero su slug `scada` no existe en `glossary.js` |
| aFRR | Aparece en `RAW_TERMS` pero su slug `afrr` no existe en `glossary.js` |
| BESS | Aparece en `RAW_TERMS` pero su slug `bess` no existe en `glossary.js` |
| IGBT | Aparece en `RAW_TERMS` pero su slug `igbt` no existe en `glossary.js` |
| LVRT | Aparece en `RAW_TERMS` pero su slug `lvrt` no existe en `glossary.js` |
| ERS | Aparece en `RAW_TERMS` pero su slug `ers` no existe en `glossary.js` |
| FFR | Aparece en `RAW_TERMS` pero su slug `ffr` no existe en `glossary.js` |
| GFL | Aparece en `RAW_TERMS` pero su slug `gfl` no existe en `glossary.js` |
| GFM | Aparece en `RAW_TERMS` pero su slug `gfm` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| PMU | Aparece en `RAW_TERMS` pero su slug `pmu` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| SCR | Aparece en `RAW_TERMS` pero su slug `scr` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 08-uso-ia.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| ENTSO-E | `#entso-e` | OK |
| Tap-Lag | `#tap-lag` | OK |
| OLTC | `#oltc` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 09-conclusiones.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| ENTSO-E | `#entso-e` | OK |
| Tap-Lag | `#tap-lag` | OK |
| EAS | `#eas` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| NC RfG | Aparece en `RAW_TERMS` pero su slug `nc-rfg` no existe en `glossary.js` |
| BESS | Aparece en `RAW_TERMS` pero su slug `bess` no existe en `glossary.js` |
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| CSN | Aparece en `RAW_TERMS` pero su slug `csn` no existe en `glossary.js` |
| ERS | Aparece en `RAW_TERMS` pero su slug `ers` no existe en `glossary.js` |
| IBR | Aparece en `RAW_TERMS` pero su slug `ibr` no existe en `glossary.js` |
| PMU | Aparece en `RAW_TERMS` pero su slug `pmu` no existe en `glossary.js` |
| REE | Aparece en `RAW_TERMS` pero su slug `ree` no existe en `glossary.js` |
| SCR | Aparece en `RAW_TERMS` pero su slug `scr` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 10-resumen-de-cifras.mdx

#### Términos marcados automáticamente por el plugin AST

| Término | Anchor de destino | Estado |
|---|---|---|
| ENTSO-E | `#entso-e` | OK |

#### Enlaces rotos (en el plugin pero sin definición en glosario)

| Término configurado | Problema |
|---|---|
| HVDC | Aparece en `RAW_TERMS` pero su slug `hvdc` no existe en `glossary.js` |
| UFLS | Aparece en `RAW_TERMS` pero su slug `ufls` no existe en `glossary.js` |
| TSO | Aparece en `RAW_TERMS` pero su slug `tso` no existe en `glossary.js` |

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 11-cronologia.mdx

#### Términos marcados automáticamente por el plugin AST

*Ninguno detectado.*

#### Enlaces rotos (en el plugin pero sin definición en glosario)

*Ninguno detectado.*

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*

### 13-sobre-el-autor.mdx

#### Términos marcados automáticamente por el plugin AST

*Ninguno detectado.*

#### Enlaces rotos (en el plugin pero sin definición en glosario)

*Ninguno detectado.*

#### Términos del glosario ausentes en el plugin AST

*Ninguno detectado.*
