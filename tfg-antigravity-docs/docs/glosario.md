---
sidebar_position: 10
---

# Glosario Técnico | Technical Glossary

Términos y siglas empleados en el análisis del colapso ibérico del 28 de abril de 2025.

---

## A

### AELEC
Asociación Española de Empresas de Electricidad. Agrupa a las principales empresas del sector eléctrico español. Cofinanció el informe IIT-ICAI.

### Área de Control
Zona geográfica bajo responsabilidad de un Operador del Sistema (OS). En el 28A se distinguen áreas Norte, Centro, Sur y Levante.

---

## B

### BESS (Battery Energy Storage System)
Sistema de almacenamiento electroquímico con capacidad de respuesta sub-cíclica. En configuración **BESS-GFM** actúa como recurso grid-forming, aportando inercia sintética y FFR.

### Black Start
Capacidad de arrancar una central sin suministro externo de red. El 28A, únicamente las centrales hidroeléctricas tenían esta capacidad operativa.

---

## C

### Colapso Q-V
Inestabilidad de tensión en el plano potencia reactiva–voltaje. Mecanismo dominante del 28A (no colpaso de frecuencia). Ecuación característica del punto de colapso: $\det(\mathbf{J}_{QV}) = 0$

### CSN
Consejo de Seguridad Nacional de España. Publicó el informe oficial del Gobierno junto con REE.

### Curva de capacidad reactiva (Capability Curve)
Diagrama P-Q que delimita el espacio operativo de un generador en el plano potencia activa-reactiva. El P.O. 7.4 obliga a los IBR a permanecer dentro de esta curva.

---

## E

### Efecto Ferranti {#efecto-ferranti}
Fenómeno capacitivo en líneas de transmisión en vacío o baja carga. La admitancia transversal $Y_t = j\omega C \cdot \ell$ inyecta potencia reactiva capacitiva, elevando la tensión en el extremo receptor.

**En el 28A:** Inyección estimada de 1,05–2,4 GVAr capacitivos al activar el mallado.

### ENTSO-E
European Network of Transmission System Operators for Electricity. Publicó el informe de evaluación de estabilidad y propuso NC RfG 2.0.

### ERS (Essential Reliability Services)
Servicios Esenciales de Confiabilidad. Mercados explícitos propuestos para remunerar inercia, potencia de cortocircuito y control de tensión autónomo.

---

## F

### FFR (Fast Frequency Response)
Respuesta de frecuencia ultrarrápida (< 500 ms). Característica de los BESS-GFM. Reduce la profundidad de la caída de frecuencia (nadir).

### Frecuencia nominal
50 Hz en el sistema europeo continental. El P.O. 1.1 define los límites de operación: $f \in [49,0; 51,0]$ Hz en operación normal.

---

## G

### GFL (Grid-Following)
Inversor que sigue la tensión y fase de la red externa mediante un bucle PLL (Phase-Locked Loop). No puede operar sin una red estable preexistente. **82% de la generación del 28A era GFL.**

### GFM (Grid-Forming)
Inversor que genera activamente su propio vector de tensión. No requiere PLL; puede sostener la red y participar en Black Start. Obligatorio para instalaciones > 1 MW según NC RfG 2.0.

---

## H

### Inercia del sistema (H)
Constante de inercia equivalente del sistema en segundos. Define la resistencia al cambio de frecuencia tras una perturbación.

$$H_{eq} = \frac{\sum_i H_i \cdot S_{n,i}}{S_{base}}$$

**Valores 28A:**
| Zona | H (s) |
|------|-------|
| Global | 2,3 |
| Sur | 1,3 |
| Umbral ENTSO-E | ≥ 2,0 |

---

## I

### IBR (Inverter-Based Resources)
Recursos Basados en Inversores. Incluye solar fotovoltaica, eólica con convertidor completo y almacenamiento. Opuesto a generación síncrona convencional.

**Penetración instantánea 28A:** 82%

---

## M

### Mallado
Maniobra operativa de reconfiguración topológica que conecta subestaciones previamente separadas mediante líneas de 400 kV. En el 28A activó el efecto Ferranti.

---

## N

### NC RfG 2.0 (Network Code Requirements for Generators)
Revisión del Código de Red Europeo para generadores, propuesta por ENTSO-E tras el 28A. Introduce obligatoriedad de GFM para IBR ≥ 1 MW.

**Tipos de instalación:**
- Tipo A (< 1 MW): requisitos voluntarios
- Tipo B (1–50 MW): obligatorio básico
- Tipo C (> 50 MW): exhaustivo
- Tipo D (≥ 110 kV): Tipo C + certificación ENTSO-E

---

## O

### OLTC (On-Load Tap Changer)
Cambiador de tomas en carga. Ajusta automáticamente la relación de transformación bajo carga.

**Retardo electromecánico (Tap-Lag):** 50–100 ms por operación.

### Oscilación de 0,6 Hz
Modo oscilatorio detectado en los registros PMU del 28A. **Hipótesis IIT-ICAI:** oscilación forzada por una planta generadora. **Hipótesis REE:** modo natural del sistema.

---

## P

### P.O. 7.4 (Procedimiento de Operación 7.4)
Procedimiento de operación español sobre "Control de tensión en la red de transporte". Define las curvas de reactiva obligatorias para generadores. Actualizado el 12 de junio de 2025 (post-28A).

### PMU (Phasor Measurement Unit)
Unidad de medida fasorial sincronizada mediante GPS. Resolución temporal ~20–30 ms. Imprescindible para detectar fenómenos como el Tap-Lag y la oscilación de 0,6 Hz.

### PLL (Phase-Locked Loop)
Bucle de seguimiento de fase empleado por los inversores GFL. Inestable en redes de alta impedancia (SCR < 2).

---

## R

### RoCoF (Rate of Change of Frequency)
Tasa de cambio de frecuencia en Hz/s. Parámetro indicador de la inercia efectiva disponible.

$$\text{RoCoF} = \frac{df}{dt} = \frac{f_0 \cdot \Delta P}{2H \cdot S_{base}}$$

**28A:** RoCoF < 1 Hz/s durante la mayor parte de la cascada (no fue una crisis de frecuencia).

### REE (Red Eléctrica de España)
Operador del Sistema eléctrico peninsular. Publicó el informe oficial junto con el CSN.

---

## S

### SCR (Short Circuit Ratio) {#scr-short-circuit-ratio}
Ratio entre la potencia de cortocircuito del nudo y la potencia nominal del generador conectado. Mide la "rigidez eléctrica" local.

$$\text{SCR} = \frac{S_{cc}}{S_n}$$

**Clasificación:**
| SCR | Categoría |
|-----|-----------|
| > 3 | Red fuerte |
| 2–3 | Red normal |
| **< 2** | **Red muy débil** ← 28A |

### SynCon (Synchronous Condenser)
Máquina síncrona sin turboprime mover, operada en modo motor/generador de reactiva. Aporta potencia de cortocircuito genuina e inercia rotacional.

---

## T

### Tap-Lag {#tap-lag}
Retardo electromecánico del OLTC que lo deja desfasado respecto a transitorios eléctricos rápidos. En el 28A creó una **brecha de observabilidad**: el SCADA mostraba 418 kV en el primario de 400 kV de Carmona mientras el secundario de 220 kV había colapsado a 244 kV.

---

## U

### UFLS (Underfrequency Load Shedding)
Deslastre automático de carga por baja frecuencia. Sistema de protección diseñado para colapsos de potencia activa.

**Paradoja del 28A:** Al desconectar carga eliminó los sumideros de reactiva inductiva en pleno transitorio capacitivo, **agravando** la sobretensión en lugar de mitigarla.

---

*Última actualización: mayo 2026 — Alfonso Monge García, ETSI Universidad de Sevilla*
