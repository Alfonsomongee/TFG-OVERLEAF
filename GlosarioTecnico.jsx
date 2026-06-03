/**
 * GlosarioTecnico.jsx
 * Glosario técnico canónico del 28-A — 18 términos con norma IEEE/ENTSO-E/CIGRE.
 *
 * FUENTES:
 *   - IEEE Std 2800-2022 (IBR, GFL, GFM, LVRT/HVRT, Damping ratio)
 *   - ENTSO-E Future System Inertia (H, RoCoF)
 *   - ENTSO-E NC RfG / SO GL (ERS, UFLS, Black Start)
 *   - CIGRE WG B4 / IEEE 1204 (SCR, MRSCR, MIIF)
 *   - IEEE C37.2 (ANSI 59, ANSI 78)
 *   - IEEE C57.91 / CIGRE WG A2 (Magnetizing inrush, Sympathetic inrush)
 *   - ACER / Reglamento UE 2019/943 (VoLL)
 *   - Kundur (1994), cap. 12 (Damping ratio — umbral 5%)
 *
 * ESTRUCTURA DE CADA TÉRMINO:
 *   id, term, acronym, category, definition, norm, relevancia28A, detail
 *
 * CATEGORÍAS:
 *   'dinamica'      — Dinámica del sistema, frecuencia e inercia
 *   'fortaleza'     — Fortaleza de red, SCR, interacciones multiterminal
 *   'control'       — Paradigmas de control de inversores y ERS
 *   'protecciones'  — Anomalías sistémicas y fallos de protección
 *   'restauracion'  — Restauración y transitorios magnéticos
 *   'economico'     — Modelización socioeconómica
 */
import React, { useState, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './GlosarioTecnico.module.css';

// ─── Datos del glosario ───────────────────────────────────────────────────────
const TERMINOS = [
  // ── CATEGORÍA: Dinámica ──────────────────────────────────────────────────
  {
    id: 'ibr',
    term: 'IBR',
    fullName: 'Inverter-Based Resources',
    acronym: 'IBR',
    category: 'dinamica',
    definition: 'Recursos de generación o almacenamiento que se interconectan a la red de corriente alterna exclusivamente a través de electrónica de potencia, careciendo de acoplamiento electromecánico directo con el sistema.',
    norm: 'IEEE Std 2800-2022',
    relevancia28A: 'La concentración de plantas IBR operando simultáneamente sin aportar robustez dinámica facilitó la cascada de desconexiones que apagó la península en 30 segundos.',
    detail: 'Abarca FV, eólica tipo 3/4, BESS, STATCOM, SVC y HVDC. En el 28-A, el 82% de la generación instantánea era IBR (Comité de Análisis, p.38). Los IBR GFL dependen del PLL para sincronizarse; al distorsionarse la tensión, sus PLLs perdieron la referencia.',
  },
  {
    id: 'inercia-h',
    term: 'Constante de inercia H',
    fullName: 'Constante de inercia equivalente del sistema',
    acronym: 'H',
    category: 'dinamica',
    definition: 'Parámetro [s] que cuantifica la energía cinética almacenada en el rotor de un generador síncrono a velocidad nominal, dividida por su potencia aparente nominal. Representa el tiempo que el generador podría suministrar su potencia nominal usando solo esa energía cinética.',
    norm: 'ENTSO-E Future System Inertia / IEEE 1110',
    relevancia28A: 'La inercia ibérica el 28-A era de 2,21–2,71 s (ENTSO-E Factual, Tabla 2-4, p.36), dentro del rango operativo pero en el límite inferior; ENTSO-E concluye que mayor inercia no habría evitado el colapso por sobretensión.',
    detail: 'H = Eₖ / S_base [s]. Valores típicos: nuclear 6 s, gas 5 s, carbón 4 s, hidro 3 s, IBR ≈ 0 s. La energía cinética total ibérica era 119.474 MWs (España 97.590 + Portugal 21.884). La baja inercia amplifica el RoCoF ante perturbaciones de potencia activa.',
  },
  {
    id: 'rocof',
    term: 'RoCoF',
    fullName: 'Rate of Change of Frequency',
    acronym: 'RoCoF',
    category: 'dinamica',
    definition: 'Derivada temporal de la frecuencia (df/dt [Hz/s]) que mide la aceleración o desaceleración de la red eléctrica inmediatamente después de un desequilibrio entre generación y demanda.',
    norm: 'ENTSO-E NC RfG / IEEE C37.117',
    relevancia28A: 'El RoCoF medio fue <±1 Hz/s hasta 12:33:20 CEST; los picos secundarios estimados alcanzaron ~1,5 Hz/s en ventanas de 100 ms (ENTSO-E Factual, p.12 — el pico exacto es Cuestión Abierta).',
    detail: 'Ventanas estándar de medición: 100 ms / 500 ms / 1 s. RoCoF = −f₀·ΔP / (2H·S_base). En sistemas de baja inercia, un mismo ΔP produce RoCoF mucho más elevado. Los relés anti-isla (ANSI 81R) disparan cuando RoCoF supera umbrales configurados (~0,5 Hz/s en muchas instalaciones).',
  },
  {
    id: 'damping',
    term: 'Damping ratio',
    fullName: 'Coeficiente de amortiguamiento',
    acronym: 'ζ',
    category: 'dinamica',
    definition: 'Parámetro adimensional que caracteriza la tasa de decaimiento de las oscilaciones en un sistema dinámico. ζ < 0 → inestabilidad creciente; ζ = 0 → oscilación sostenida; 0 < ζ < 1 → oscilación amortiguada; ζ ≥ 1 → respuesta sobreamortiguada.',
    norm: 'Kundur (1994), cap. 12 / IEEE Std 2800',
    relevancia28A: 'El umbral de 5% (ζ = 0,05) es el mínimo aceptable según Kundur — NO según el P.O. 13.1 (que trata planificación de red, no ζ). El sistema ibérico mostraba ζ insuficiente en los modos de 0,6 Hz y 0,2 Hz detectados antes del colapso.',
    detail: 'La oscilación de 0,63 Hz en Almaraz-Carmona y el modo inter-área de 0,2 Hz no se amortiguaron correctamente. Sin PSS (Power System Stabilizers) en los CCGT ya desconectados, no había mecanismo para suprimir estos modos. La oscilación creció durante 4,4 minutos hasta desencadenar el colapso.',
  },

  // ── CATEGORÍA: Fortaleza de Red ──────────────────────────────────────────
  {
    id: 'scr',
    term: 'SCR',
    fullName: 'Short Circuit Ratio',
    acronym: 'SCR',
    category: 'fortaleza',
    definition: 'Relación entre la potencia de cortocircuito disponible en un nodo (S_ac [MVA]) y la potencia nominal del recurso IBR conectado en ese punto (P_i [MW]). SCR = S_ac / P_i.',
    norm: 'CIGRE / IEEE 1204 / IEEE 519',
    relevancia28A: 'Los nudos del sur peninsular operaban con SCR < 2 (red débil), lo que hace inestable el control PLL de los inversores GFL ante variaciones de tensión superiores al 5–10%.',
    detail: 'SCR > 3: red fuerte (tensión rígida). 2 < SCR < 3: red débil (operar con precaución). SCR < 2: red muy débil (inestabilidad probable con GFL). El umbral crítico para GFL es SCR ≈ 1,5–2. Por debajo, los PLLs pierden el seguimiento de fase y los inversores disparan o reducen potencia.',
  },
  {
    id: 'mrscr',
    term: 'MRSCR',
    fullName: 'Multiple Renewable Energy Stations Short-Circuit Ratio',
    acronym: 'MRSCR',
    category: 'fortaleza',
    definition: 'Índice que evalúa la fortaleza de tensión de un nodo considerando el impacto simultáneo de múltiples plantas IBR próximas eléctricamente. MRSCR_i = S_ac,i / (P_i + Σ MIIF_ji · P_j).',
    norm: 'CIGRE WG B4 / IEEE 1204',
    relevancia28A: 'La aglomeración de parques FV en Andalucía redujo el MRSCR regional por debajo del umbral crítico (CMRSCR ≈ 1,5), facilitando el colapso cooperativo por sobretensión en menos de 12 segundos.',
    detail: 'El MRSCR corrige el SCR tradicional sumando en el denominador la influencia de plantas vecinas ponderadas por el MIIF. Un MRSCR < 1,5 indica que el conjunto de plantas se comporta como una entidad inestable colectiva. Los códigos de red post-28A (NC RfG 2.0) exigen MRSCR ≥ 1,5 en el punto de conexión.',
  },
  {
    id: 'miif',
    term: 'MIIF',
    fullName: 'Multi-Infeed Interaction Factor',
    acronym: 'MIIF',
    category: 'fortaleza',
    definition: 'Factor que cuantifica el acoplamiento electromagnético entre dos nodos IBR: fracción en que una variación de tensión del 1% en el nodo j se transmite al nodo i. MIIF_ji ∈ [0, 1].',
    norm: 'CIGRE WG B4 (originalmente para HVDC, extendido a IBR)',
    relevancia28A: 'Los altos MIIF entre instalaciones fotovoltaicas andaluzas provocaron que las subidas de tensión se contagiaran de forma casi íntegra entre parques adyacentes, desencadenando la cascada ANSI 59.',
    detail: 'MIIF > 0,15: acoplamiento fuerte → riesgo severo de fallos simultáneos. En la arquitectura de red andaluza del 28-A, las distancias eléctricas cortas entre grandes plantas solares implicaban MIIF muy elevados. Cuando la primera planta disparó por ANSI 59, la onda de sobretensión se transmitió casi íntegramente a las subestaciones contiguas.',
  },

  // ── CATEGORÍA: Control de Inversores ────────────────────────────────────
  {
    id: 'gfl',
    term: 'Grid-Following (GFL)',
    fullName: 'Grid-Following inverter control',
    acronym: 'GFL',
    category: 'control',
    definition: 'Estrategia de control donde el inversor utiliza un Phase-Locked Loop (PLL) para sincronizarse pasivamente con la frecuencia y tensión impuestas por la red externa antes de inyectar corriente. Opera como fuente de corriente controlada.',
    norm: 'IEEE 1547 / IEEE Std 2800-2022 / ENTSO-E TG GFC Phase I (mayo 2024)',
    relevancia28A: 'La hegemonía de GFL en el parque FV ibérico impidió que los generadores actuaran como anclas estabilizadoras; al perder la referencia de fase, los PLLs dispararon los inversores, retirando el escaso soporte reactivo remanente.',
    detail: 'En red débil (SCR < 2), el PLL del GFL entra en inestabilidad: ζ_PLL < 0 (amortiguamiento negativo). Este mecanismo es el modelado en el PhasePlanePlot del TFG (ζ = -0,12, referencia: Rocabert et al. 2012, IEEE Trans. Power Electron.).',
  },
  {
    id: 'gfm',
    term: 'Grid-Forming (GFM)',
    fullName: 'Grid-Forming inverter control',
    acronym: 'GFM',
    category: 'control',
    definition: 'Tecnología de control mediante la cual el inversor actúa como fuente de tensión ideal, generando autónomamente la amplitud y frecuencia de la red local sin necesitar referencia externa. Emula virtualmente el comportamiento de una máquina síncrona.',
    norm: 'IEEE Std 2800-2022 / ENTSO-E TG GFC Phase II (nov 2025) / IEEE PES TR93',
    relevancia28A: 'El NC RfG 2.0 de ENTSO-E (noviembre 2025) propone hacer GFM obligatorio para todos los módulos ≥ 1 MW; su presencia en el 28-A habría aportado inercia sintética y soporte de tensión sin depender de referencia externa.',
    detail: 'Implementaciones: Virtual Synchronous Machine (VSM), droop control, matching control. Ventajas sobre GFL: opera en SCR < 1,5; aporta inercia sintética (H_sintética configurable); no requiere PLL. El RD 997/2025 (BOE-A-2025-22434) fija objetivo de 22,5 GW de almacenamiento GFM en 2030.',
  },
  {
    id: 'ers',
    term: 'ERS',
    fullName: 'Essential Reliability Services',
    acronym: 'ERS',
    category: 'control',
    definition: 'Funciones técnicas indispensables para garantizar la seguridad, resiliencia y amortiguamiento dinámico del sistema eléctrico: inercia, potencia de cortocircuito, regulación primaria de frecuencia (FFR/FCR), y control dinámico de tensión/reactiva.',
    norm: 'ENTSO-E SO GL (Reg. UE 2017/1485) / NERC ERSWG',
    relevancia28A: 'El 28-A demostró que la inercia y la rigidez de red ya no son subproductos gratuitos de la generación síncrona sino servicios que deben remunerarse explícitamente; el colapso fue el coste de no hacerlo.',
    detail: 'Pre-28A, los ERS eran "subproductos gratuitos" de centrales térmicas. Post-28A, el paradigma de ENTSO-E y el RD 997/2025 postulan mercados regulados que remuneren: inercia sintética, regulación dinámica Q, FFR, potencia de cortocircuito. Similar al modelo DS3 de Irlanda (>60 €/MW).',
  },
  {
    id: 'lvrt-hvrt',
    term: 'LVRT / HVRT',
    fullName: 'Low/High Voltage Ride-Through',
    acronym: 'LVRT / HVRT',
    category: 'control',
    definition: 'Capacidad de una central IBR para mantenerse conectada y operativa durante periodos transitorios de caídas bruscas de tensión (LVRT) o picos de sobretensión (HVRT), sin desconectarse ni reducir potencia.',
    norm: 'ENTSO-E NC RfG (Reg. UE 2016/631)',
    relevancia28A: 'Numerosas plantas FV no cumplían las curvas HVRT del NC RfG: al superar la tensión el umbral de protección (≈ 435–440 kV en colectores), sus relés ANSI 59 dispararon antes de agotar el tiempo de ride-through permitido.',
    detail: 'El P.O. 12.2 español fijaba el umbral LVRT en 435 kV. Varias plantas dispararon entre 425 y 440 kV por ajuste incorrecto de protecciones (REE, p.5). El HVRT exige tolerancia a sobretensiones de hasta 1,2 p.u. durante varios segundos; muchas plantas no estaban configuradas para ello.',
  },

  // ── CATEGORÍA: Protecciones ──────────────────────────────────────────────
  {
    id: 'ansi59',
    term: 'ANSI 59',
    fullName: 'Relé de protección de máxima tensión',
    acronym: 'ANSI 59',
    category: 'protecciones',
    definition: 'Función estandarizada de protección que dispara el circuito automáticamente cuando la tensión en AC supera el umbral de consigna configurado, protegiéndose el aislamiento del transformador y la aparamenta.',
    norm: 'IEEE C37.2',
    relevancia28A: 'Su activación simultánea y en cascada, al superar el colector 220 kV los 242 kV (> 1,10 p.u.), fue el mecanismo físico directo del apagón: cada disparo retiraba absorción de reactiva, elevando más la tensión en los nudos vecinos.',
    detail: 'El disparo raíz ocurrió a las 12:32:57 CEST en Granada: −355 MW activos, −165 MVAr de absorción reactiva (ENTSO-E Factual, p.28). Cada disparo ANSI 59 subsiguiente iniciaba el bucle de retroalimentación positiva: menos absorción → más tensión → más disparos.',
  },
  {
    id: 'ansi78',
    term: 'ANSI 78',
    fullName: 'Relé de pérdida de sincronismo (Out-of-Step)',
    acronym: 'ANSI 78',
    category: 'protecciones',
    definition: 'Protección que monitoriza el desplazamiento dinámico de la impedancia aparente en el plano complejo R-X para detectar oscilaciones inestables y pérdida de sincronismo entre zonas eléctricas.',
    norm: 'IEEE C37.2 / IEEE C37.118',
    relevancia28A: 'A las 12:33:21 CEST, al interpretar la divergencia angular entre la Península y Francia como pérdida de sincronismo irreversible (48,46 Hz), los relés ANSI 78 abrieron los enlaces AC transpirenaicos, aislando el sistema ibérico.',
    detail: 'Los circuitos abiertos: Baixas-Vic, Argia-Arkale, Argia-Hernani. La apertura fue técnica y normativamente correcta (consenso de los 4 informes). Sin la apertura, el colapso habría arrastrado al sistema continental europeo. El HVDC INELFE-1 se desconectó a las 12:33:24 CEST.',
  },
  {
    id: 'ufls',
    term: 'UFLS',
    fullName: 'Under-Frequency Load Shedding',
    acronym: 'UFLS',
    category: 'protecciones',
    definition: 'Esquema automático de defensa sistémica que desconecta bloques de demanda cuando la frecuencia cae a umbrales críticos predefinidos, para restablecer el balance generación-demanda.',
    norm: 'ENTSO-E / P.O. 1.6 (España)',
    relevancia28A: 'El UFLS agravó el colapso: al deslastar cargas inductivas (motores, bombeo) diseñadas para subfrecuencia, eliminó los últimos sumideros de reactiva en una red que colapsaba por exceso de reactiva capacitiva — la paradoja del 28-A.',
    detail: 'Umbrales P.O. 1.6: bombeo a 49,5 Hz, demanda industrial desde 49,0 Hz. El UFLS está diseñado para déficit de generación activa, no para inestabilidad de tensión. Al cortar cargas inductivas, se perdió la capacidad de absorción de reactiva que habría podido frenar la sobretensión. Consenso de los 4 informes: el UFLS actuó correctamente según diseño pero fue contraproducente en este colapso.',
  },

  // ── CATEGORÍA: Restauración ──────────────────────────────────────────────
  {
    id: 'black-start',
    term: 'Black Start',
    fullName: 'Capacidad de arranque autónomo',
    acronym: 'Black Start',
    category: 'restauracion',
    definition: 'Capacidad tecnológica de una central de generación para arrancar e inyectar energía en una red completamente desenergizada sin requerir soporte eléctrico externo.',
    norm: 'Reg. UE 2017/2196 (NC Emergency & Restoration)',
    relevancia28A: 'La activación de Castelo do Bode (Portugal, 138 MW, hidroeléctrica) a las 12:45 CEST y de Aldeadávila (España, ~1.100 MW, cuenca del Duero) a las ~16:00 CEST fueron los pivotes estructurales de la reposición.',
    detail: 'Sin Black Start disponible, la reposición habría requerido importación sostenida desde Francia durante horas adicionales. Los IBR FV no pueden hacer Black Start (necesitan referencia de tensión). Las nucleares tampoco (requieren energía para sus propios sistemas de seguridad). El 28-A demostró la necesidad de más plantas Black Start en el sur peninsular.',
  },
  {
    id: 'magnetizing-inrush',
    term: 'Magnetizing inrush',
    fullName: 'Corriente de inserción magnetizante',
    acronym: 'Inrush magnetizante',
    category: 'restauracion',
    definition: 'Corriente transitoria de gran amplitud (hasta 10× la nominal), fuertemente asimétrica y rica en armónicos pares, que se genera en el devanado primario de un transformador de potencia en el instante exacto de su energización desde una red muerta.',
    norm: 'IEEE C57.91 / IEEE C57.96 / CIGRE WG A2',
    relevancia28A: 'Las corrientes de inserción al energizar los grandes autotransformadores de 400 kV durante la reposición provocaban caídas de tensión del 10–20% en las frágiles islas eléctricas recién formadas, dificultando la sincronización.',
    detail: 'Contenido armónico típico: 8–20% de segundo armónico. Los relés diferenciales de transformador pueden interpretar el inrush como cortocircuito interno y disparar — de ahí la función de bloqueo por armónico (harmonic restraint). A diferencia del sympathetic inrush, decae en pocos ciclos.',
  },
  {
    id: 'sympathetic-inrush',
    term: 'Sympathetic inrush',
    fullName: 'Corriente de inserción simpática',
    acronym: 'Inrush simpático',
    category: 'restauracion',
    definition: 'Fenómeno donde la energización de un transformador nuevo satura el flujo magnético de transformadores paralelos ya operativos, provocando distorsiones armónicas severas y prolongadas (decaimiento doble exponencial, >10 s).',
    norm: 'CIGRE WG A2 / IEEE C57.91',
    relevancia28A: 'Alargó durante minutos la inestabilidad de las islas eléctricas en reconstrucción, forzando intervenciones manuales de los operadores y retrasando la reposición durante la noche del 28-A.',
    detail: 'El mecanismo: la corriente de inserción del transformador nuevo genera un hueco de tensión asimétrico en la barra común → inserta un offset de flujo CC en los transformadores paralelos ya operativos → estos entran en saturación. Perfil: componente CC hasta 58%, segundo armónico hasta 59%, tiempo de decaimiento >10 s. Diferencia clave con inrush normal: duración mucho mayor.',
  },

  // ── CATEGORÍA: Económico ─────────────────────────────────────────────────
  {
    id: 'voll',
    term: 'VoLL',
    fullName: 'Value of Lost Load',
    acronym: 'VoLL',
    category: 'economico',
    definition: 'Estimación económica del precio máximo que los consumidores de diferentes sectores están dispuestos a pagar por evitar la interrupción del servicio eléctrico. Cuantifica la pérdida socioeconómica de un MWh no suministrado [€/MWh].',
    norm: 'ACER / Reglamento UE 2019/943, art. 37(1)(j) / ENTSO-E ERAA',
    relevancia28A: 'Con VoLL residencial de 16.464–18.123 €/MWh y ENS ibérica estimada en 150.000–180.000 MWh, el impacto económico total supera los 1.000 M€ (CEOE/ATA); la CNMC cuantifica el daño regulatorio en 25,2–42,5 M€.',
    detail: 'VoLL por sector (jurisdicción europea): Residencial 5–45 €/kWh; Servicios 15–90 €/kWh; Industrial 50–250 €/kWh; Electrointensivo >250 €/kWh. Comparativa UK: hasta 19.240 €/MWh. El coste de la Operación Reforzada post-28A: 666 M€ hasta mar 2026 (REE, verificado).',
  },
];

// ─── Categorías con etiquetas ─────────────────────────────────────────────────
const CATS = {
  todos:        { es: 'Todos',               en: 'All',                  color: '#94a3b8' },
  dinamica:     { es: 'Dinámica del sistema', en: 'System Dynamics',      color: '#00d9ff' },
  fortaleza:    { es: 'Fortaleza de red',     en: 'Grid Strength',        color: '#a78bfa' },
  control:      { es: 'Control de inversores',en: 'Inverter Control',     color: '#10b981' },
  protecciones: { es: 'Protecciones',         en: 'Protection Systems',   color: '#f59e0b' },
  restauracion: { es: 'Restauración',         en: 'Restoration',          color: '#60a5fa' },
  economico:    { es: 'Impacto económico',    en: 'Economic Impact',      color: '#f472b6' },
};

// ─── Tarjeta de término ───────────────────────────────────────────────────────
function TermCard({ termino, lang, isOpen, onToggle }) {
  const isEs  = lang === 'es';
  const color = CATS[termino.category]?.color || '#94a3b8';
  const catLabel = CATS[termino.category]?.[lang] || CATS[termino.category]?.es || '';

  return (
    <div style={{
      border: `1px solid ${isOpen ? color : 'rgba(255,255,255,0.07)'}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 8,
      marginBottom: '0.6rem',
      background: isOpen ? `${color}08` : 'rgba(255,255,255,0.01)',
      transition: 'all 0.2s ease',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0.85rem 1rem',
          background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left', gap: '0.75rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 15, fontWeight: 700, color: isOpen ? color : '#e2e8f0',
              fontFamily: 'monospace',
            }}>
              {termino.term}
            </span>
            <span style={{
              fontSize: 10, padding: '1px 6px', borderRadius: 10,
              background: `${color}18`, color, border: `1px solid ${color}40`,
              fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.06em',
              flexShrink: 0,
            }}>
              {catLabel}
            </span>
          </div>
          {!isOpen && (
            <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>
              {termino.definition.slice(0, 90)}…
            </p>
          )}
        </div>
        <span style={{ color, fontSize: 16, flexShrink: 0, transition: 'transform 0.2s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {/* Contenido expandido */}
      {isOpen && (
        <div style={{ padding: '0 1rem 1rem' }}>
          {/* Norma */}
          <div style={{
            display: 'inline-block', marginBottom: '0.75rem',
            padding: '2px 8px', borderRadius: 4,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 11, fontFamily: 'monospace', color: '#94a3b8',
          }}>
            📋 {termino.norm}
          </div>

          {/* Definición */}
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', lineHeight: 1.65, color: '#e2e8f0' }}>
            {termino.definition}
          </p>

          {/* Relevancia 28-A */}
          <div style={{
            margin: '0 0 0.75rem',
            padding: '0.6rem 0.9rem',
            background: 'rgba(239,68,68,0.06)',
            borderLeft: '3px solid rgba(239,68,68,0.5)',
            borderRadius: '0 6px 6px 0',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.55, color: '#fca5a5' }}>
              <strong style={{ color: '#ef4444' }}>
                {isEs ? '⚡ Relevancia en el 28-A:' : '⚡ Relevance in April 28:'}
              </strong>{' '}
              {termino.relevancia28A}
            </p>
          </div>

          {/* Detalle técnico */}
          <p style={{
            margin: 0, fontSize: '0.82rem', lineHeight: 1.6,
            color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '0.6rem',
          }}>
            {termino.detail}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function GlosarioTecnicoInner({ lang = 'es' }) {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [search,       setSearch]       = useState('');
  const [openId,       setOpenId]       = useState(null);

  const isEs = lang === 'es';

  const filtered = useMemo(() => {
    return TERMINOS.filter(t => {
      const matchCat    = activeFilter === 'todos' || t.category === activeFilter;
      const q           = search.toLowerCase();
      const matchSearch = !q || t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        t.acronym?.toLowerCase().includes(q) ||
        t.fullName?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeFilter, search]);

  return (
    <div>
      {/* Búsqueda */}
      <div style={{ marginBottom: '1rem', position: 'relative' }}>
        <input
          type="search"
          placeholder={isEs ? 'Buscar término…' : 'Search term…'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label={isEs ? 'Buscar en el glosario' : 'Search glossary'}
          style={{
            width: '100%', padding: '0.6rem 1rem 0.6rem 2.25rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6, color: '#e2e8f0', fontSize: 13,
            fontFamily: 'monospace', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <span style={{
          position: 'absolute', left: '0.7rem', top: '50%',
          transform: 'translateY(-50%)', fontSize: 14, color: '#475569',
        }}>🔍</span>
      </div>

      {/* Filtros de categoría */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}
           role="group" aria-label={isEs ? 'Filtrar por categoría' : 'Filter by category'}>
        {Object.entries(CATS).map(([key, cat]) => {
          const isActive = activeFilter === key;
          const count    = key === 'todos'
            ? TERMINOS.length
            : TERMINOS.filter(t => t.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              aria-pressed={isActive}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 20,
                border: `1px solid ${isActive ? cat.color : 'rgba(255,255,255,0.1)'}`,
                background: isActive ? `${cat.color}18` : 'transparent',
                color: isActive ? cat.color : '#64748b',
                cursor: 'pointer', fontFamily: 'monospace', fontSize: 11,
                fontWeight: isActive ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {cat[lang] || cat.es}
              <span style={{ marginLeft: 4, opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Contador */}
      <div style={{ marginBottom: '0.75rem', fontSize: 11, color: '#475569', fontFamily: 'monospace' }}>
        {isEs
          ? `Mostrando ${filtered.length} de ${TERMINOS.length} términos`
          : `Showing ${filtered.length} of ${TERMINOS.length} terms`}
        {search && ` · "${search}"`}
      </div>

      {/* Lista de términos */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#475569', fontFamily: 'monospace', fontSize: 13 }}>
          {isEs ? 'No hay términos que coincidan.' : 'No matching terms.'}
        </p>
      ) : (
        filtered.map(t => (
          <TermCard
            key={t.id}
            termino={t}
            lang={lang}
            isOpen={openId === t.id}
            onToggle={() => setOpenId(openId === t.id ? null : t.id)}
          />
        ))
      )}

      {/* Nota de fuentes */}
      <div style={{
        marginTop: '1.5rem',
        padding: '0.6rem 1rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        fontSize: 10, color: '#374151', lineHeight: 1.6,
      }}>
        {isEs
          ? 'Fuentes canónicas: IEEE Std 2800-2022 · ENTSO-E NC RfG (Reg. UE 2016/631) · ENTSO-E SO GL (Reg. UE 2017/1485) · CIGRE WG B4/A2 · IEEE C37.2 · IEEE C57.91 · Kundur (1994) · ACER/Reg. UE 2019/943 · ENTSO-E Factual Report (2025).'
          : 'Canonical sources: IEEE Std 2800-2022 · ENTSO-E NC RfG (EU Reg. 2016/631) · ENTSO-E SO GL (EU Reg. 2017/1485) · CIGRE WG B4/A2 · IEEE C37.2 · IEEE C57.91 · Kundur (1994) · ACER/EU Reg. 2019/943 · ENTSO-E Factual Report (2025).'}
      </div>
    </div>
  );
}

export default function GlosarioTecnico({ lang = 'es' }) {
  return (
    <BrowserOnly fallback={
      <div style={{
        height: 300, display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#64748b',
        fontFamily: 'monospace', fontSize: 13,
      }}>
        {lang === 'es' ? 'Cargando glosario técnico…' : 'Loading technical glossary…'}
      </div>
    }>
      {() => <GlosarioTecnicoInner lang={lang} />}
    </BrowserOnly>
  );
}
