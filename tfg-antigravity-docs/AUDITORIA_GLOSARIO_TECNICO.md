# Auditoría del glosario técnico (No destructiva)

## 1. Resumen Ejecutivo

* **Total de términos en el glosario (`src/data/glossary.js`)**: 99
* **Total de términos configurados en el plugin AST (`plugins/remark-auto-glossary-links.js`)**: 234
* **Capítulos del relato principal auditados**: 15
* **Términos únicos de `RAW_TERMS` que aparecen en los capítulos**: 34
* **Términos correctos (mapeados con tarjeta funcional)**: 34
* **Términos con problemas en los capítulos**: 0
* **Términos del glosario que nunca se usan en los capítulos (ocultos o ausentes)**: 65

## 2. Clasificación de slugs problemáticos

```txt id="ud1ni3"
Clasificación de slugs problemáticos
```

| Término en RAW_TERMS | Slug generado | Capítulos donde aparece | Existe entrada equivalente en glossary.js | Clasificación | Acción recomendada |
|---|---|---|---|---|---|


### Nota sobre términos de RAW_TERMS que no aparecen en el relato principal

Existen **128** términos en la lista `RAW_TERMS` que no aparecen en el texto plano de los 15 capítulos del relato principal. La gran mayoría corresponden a:
1. **Traducciones a otros idiomas** (inglés, alemán, portugués) configuradas para el soporte multiidioma de Docusaurus (ej. *Schwarzstart*, *Blindleistung*, *Feedback loop*).
2. **Términos específicos de los anexos** que no están presentes en los capítulos principales del relato.

## 3. Estado de Estilos CSS y Configuración del Plugin

* **Estilos CSS**: Confirmado. El color verde del glosario en modo claro está definido correctamente como `--glossary-term-light: #636E4F;` y se aplica mediante `.glossary-term` con `!important`.

* **Lógica del Plugin**: Confirmado. El plugin remark-auto-glossary-links realiza el ordenamiento descendente por longitud para evitar solapamientos y marca únicamente la **primera aparición** de cada término dentro del texto plano del capítulo.

## 4. Auditoría Capítulo a Capítulo

### `01-introduccion.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| AELEC | `aelec` | AELEC |
| ENTSO-E | `entso-e` | ENTSO-E |
| GFM | `gfm-grid-forming` | GFM (Grid-Forming) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| SCADA | `scada-supervisory-control-and-data-acquisition` | SCADA (Supervisory Control and Data Acquisition) |
| SCR | `scr-short-circuit-ratio` | SCR (Short-Circuit Ratio) |
| Tap-Lag | `tap-lag` | Tap-Lag |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Colapso de tensión (pérdía catastrófica del perfil de voltajes por déficit o exceso de reactiva)**
* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**
* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**

---

### `02-contexto.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| Black Start | `arranque-autonomo-black-start` | Black Start |
| Capacidad Neta de Transferencia (NTC) | `capacidad-neta-de-transferencia-ntc` | Capacidad Neta de Transferencia (NTC) |
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| PLL | `phase-locked-loop-pll` | PLL |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| RoCoF | `rocof-rate-of-change-of-frequency` | RoCoF (Rate of Change of Frequency) |
| SCR | `scr-short-circuit-ratio` | SCR (Short-Circuit Ratio) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Corriente de cortocircuito (corriente inyectada durante una falta para activar protecciones)**
* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**
* **Inercia rotacional (energía cinética almacenada en los rotores síncronos)**

---

### `03-analisis-incidente.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| ENTSO-E | `entso-e` | ENTSO-E |
| Estabilizadores del Sistema de Potencia (PSS) | `estabilizadores-del-sistema-de-potencia-pss` | Estabilizadores del Sistema de Potencia (PSS) |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| OLTC | `cambiadores-de-tomas-en-carga-oltc` | OLTC |
| OST | `protecciones-de-perdida-de-sincronismo-ost` | OST |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| RoCoF | `rocof-rate-of-change-of-frequency` | RoCoF (Rate of Change of Frequency) |
| SCADA | `scada-supervisory-control-and-data-acquisition` | SCADA (Supervisory Control and Data Acquisition) |
| Tap-Lag | `tap-lag` | Tap-Lag |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |
| WAMS | `wams-wide-area-monitoring-systems` | WAMS (Wide Area Monitoring Systems) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Amortiguamiento de oscilaciones (atenuación de las variaciones de potencia u oscilaciones en la red)**
* **Deslastre de carga (desconexión controlada de consumidores para equilibrar el sistema)**
* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**
* **Flujo de cargas (análisis numérico del flujo de potencia activa y reactiva en la red)**

---

### `04-reaccion-reposicion.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| Black Start | `arranque-autonomo-black-start` | Black Start |
| Centros de Coordinación Regional (RCC) | `centros-de-coordinacion-regional-rcc` | Centros de Coordinación Regional (RCC) |
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| aFRR | `afrr-automatic-frequency-restoration-reserve` | aFRR (Automatic Frequency Restoration Reserve) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**
* **Servicios de ajuste (mecanismos gestionados por el TSO para garantizar el balance y seguridad)**

---

### `05-analisis-informes.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| AELEC | `aelec` | AELEC |
| Black Start | `arranque-autonomo-black-start` | Black Start |
| CCGT | `ccgt-combined-cycle-gas-turbine` | CCGT (Combined Cycle Gas Turbine) |
| ENTSO-E | `entso-e` | ENTSO-E |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| NC RfG | `nc-rfg-network-code-on-requirements-for-generators` | NC RfG (Network Code on Requirements for Generators) |
| Oscilaciones electromecánicas | `oscilaciones-electromecanicas` | Oscilaciones electromecánicas |
| PLL | `phase-locked-loop-pll` | PLL |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| RCC | `centros-de-coordinacion-regional-rcc` | RCC |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| SCADA | `scada-supervisory-control-and-data-acquisition` | SCADA (Supervisory Control and Data Acquisition) |
| Tap-Lag | `tap-lag` | Tap-Lag |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |
| WAMS | `wams-wide-area-monitoring-systems` | WAMS (Wide Area Monitoring Systems) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Amortiguamiento de oscilaciones (atenuación de las variaciones de potencia u oscilaciones en la red)**
* **Colapso de tensión (pérdía catastrófica del perfil de voltajes por déficit o exceso de reactiva)**
* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**

---

### `06-impacto-comunicativo.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| ENTSO-E | `entso-e` | ENTSO-E |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| OLTC | `cambiadores-de-tomas-en-carga-oltc` | OLTC |
| OST | `protecciones-de-perdida-de-sincronismo-ost` | OST |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**
* **Inercia rotacional (energía cinética almacenada en los rotores síncronos)**

---

### `07b-consecuencias-financieras.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| BESS | `bess-battery-energy-storage-system` | BESS (Battery Energy Storage System) |
| Black Start | `arranque-autonomo-black-start` | Black Start |
| GFM | `gfm-grid-forming` | GFM (Grid-Forming) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**

---

### `impacto-social.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

*Ninguno detectado.*


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**

---

### `07-resiliencia-futuro.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| BESS | `bess-battery-energy-storage-system` | BESS (Battery Energy Storage System) |
| Black Start | `arranque-autonomo-black-start` | Black Start |
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| ERS | `ers-essential-reliability-services-servicios-esenciales-de-confiabilidad` | ERS (Essential Reliability Services / Servicios Esenciales de Confiabilidad) |
| FFR | `fast-frequency-response-ffr` | FFR |
| GFL | `gfl-grid-following` | GFL (Grid-Following) |
| GFM | `gfm-grid-forming` | GFM (Grid-Forming) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| IGBT | `igbt-insulated-gate-bipolar-transistor` | IGBT (Insulated Gate Bipolar Transistor) |
| LVRT | `low-voltage-ride-through-lvrt` | LVRT |
| NC RfG | `nc-rfg-network-code-on-requirements-for-generators` | NC RfG (Network Code on Requirements for Generators) |
| OLTC | `cambiadores-de-tomas-en-carga-oltc` | OLTC |
| PLL | `phase-locked-loop-pll` | PLL |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| RoCoF | `rocof-rate-of-change-of-frequency` | RoCoF (Rate of Change of Frequency) |
| SCADA | `scada-supervisory-control-and-data-acquisition` | SCADA (Supervisory Control and Data Acquisition) |
| SCR | `scr-short-circuit-ratio` | SCR (Short-Circuit Ratio) |
| Servicios Esenciales de Confiabilidad (ERS) | `ers-essential-reliability-services-servicios-esenciales-de-confiabilidad` | Servicios Esenciales de Confiabilidad (ERS) |
| aFRR | `afrr-automatic-frequency-restoration-reserve` | aFRR (Automatic Frequency Restoration Reserve) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Amortiguamiento de oscilaciones (atenuación de las variaciones de potencia u oscilaciones en la red)**
* **Corriente de cortocircuito (corriente inyectada durante una falta para activar protecciones)**
* **Inercia rotacional (energía cinética almacenada en los rotores síncronos)**
* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**

---

### `dimension-europea/01-francia-portugal.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| CCGT | `ccgt-combined-cycle-gas-turbine` | CCGT (Combined Cycle Gas Turbine) |
| ENTSO-E | `entso-e` | ENTSO-E |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| PLL | `phase-locked-loop-pll` | PLL |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| RoCoF | `rocof-rate-of-change-of-frequency` | RoCoF (Rate of Change of Frequency) |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

*Ninguno detectado.*

---

### `dimension-europea/02-coordinacion-continental.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| RCC | `centros-de-coordinacion-regional-rcc` | RCC |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

*Ninguno detectado.*

---

### `dimension-europea/03-dia-despues.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| SCR | `scr-short-circuit-ratio` | SCR (Short-Circuit Ratio) |
| aFRR | `afrr-automatic-frequency-restoration-reserve` | aFRR (Automatic Frequency Restoration Reserve) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Hueco de tensión (depresión temporal del voltaje eficaz por debajo de un umbral)**
* **Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)**

---

### `09-conclusiones.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| BESS | `bess-battery-energy-storage-system` | BESS (Battery Energy Storage System) |
| CSN | `csn-consejo-de-seguridad-nacional` | CSN (Consejo de Seguridad Nacional) |
| EAS | `esquema-de-alertas-sistemicas-eas` | EAS |
| ENTSO-E | `entso-e` | ENTSO-E |
| ERS | `ers-essential-reliability-services-servicios-esenciales-de-confiabilidad` | ERS (Essential Reliability Services / Servicios Esenciales de Confiabilidad) |
| IBR | `ibr-inverter-based-resources` | IBR (Inverter-Based Resources) |
| NC RfG | `nc-rfg-network-code-on-requirements-for-generators` | NC RfG (Network Code on Requirements for Generators) |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |
| SCR | `scr-short-circuit-ratio` | SCR (Short-Circuit Ratio) |
| Tap-Lag | `tap-lag` | Tap-Lag |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Amortiguamiento de oscilaciones (atenuación de las variaciones de potencia u oscilaciones en la red)**
* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**
* **Inercia rotacional (energía cinética almacenada en los rotores síncronos)**

---

### `08.5-actualizacion-2026.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| AELEC | `aelec` | AELEC |
| BESS | `bess-battery-energy-storage-system` | BESS (Battery Energy Storage System) |
| Black Start | `arranque-autonomo-black-start` | Black Start |
| ENTSO-E | `entso-e` | ENTSO-E |
| HVDC | `hvdc-high-voltage-direct-current` | HVDC (High Voltage Direct Current) |
| NC RfG | `nc-rfg-network-code-on-requirements-for-generators` | NC RfG (Network Code on Requirements for Generators) |
| PLL | `phase-locked-loop-pll` | PLL |
| PMU | `pmu-phasor-measurement-unit` | PMU (Phasor Measurement Unit) |
| REE | `ree-red-electrica-de-espana` | REE (Red Eléctrica de España) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

*Ninguno detectado.*

---

### `08-uso-ia.mdx`

#### Términos marcados correctamente por el plugin (con tarjeta y enlace funcional):

| Término detectado | ID del ancla | Destino en el Glosario |
|---|---|---|
| ENTSO-E | `entso-e` | ENTSO-E |
| OLTC | `cambiadores-de-tomas-en-carga-oltc` | OLTC |
| Tap-Lag | `tap-lag` | Tap-Lag |
| UFLS | `ufls-under-frequency-load-shedding` | UFLS (Under-Frequency Load Shedding) |


#### Enlaces rotos o no resueltos en este capítulo:

*Ninguno detectado.*


#### Términos candidatos técnicos externos en este capítulo (conservador y relevante):

* **Estabilidad de tensión (capacidad de mantener voltajes aceptables ante variaciones de carga o reactiva)**

---


## 5. Lista limpia para Claude: términos que requieren definición nueva

```txt id="v4idd5"
Lista limpia para Claude: términos que requieren definición nueva
```

* Amortiguamiento de oscilaciones (atenuación de las variaciones de potencia u oscilaciones en la red)
* Colapso de tensión (pérdía catastrófica del perfil de voltajes por déficit o exceso de reactiva)
* Corriente de cortocircuito (corriente inyectada durante una falta para activar protecciones)
* Deslastre de carga (desconexión controlada de consumidores para equilibrar el sistema)
* Flujo de cargas (análisis numérico del flujo de potencia activa y reactiva en la red)
* Hueco de tensión (depresión temporal del voltaje eficaz por debajo de un umbral)
* Inercia rotacional (energía cinética almacenada en los rotores síncronos)
* Resiliencia (capacidad del sistema para soportar y recuperarse de perturbaciones severas)
* Servicios de ajuste (mecanismos gestionados por el TSO para garantizar el balance y seguridad)