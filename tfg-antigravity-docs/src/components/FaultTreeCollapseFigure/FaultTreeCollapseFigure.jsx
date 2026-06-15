import React from 'react';
import styles from './FaultTreeCollapseFigure.module.css';

export default function FaultTreeCollapseFigure() {
  return (
    <div className={styles.figure}>
      <svg
        viewBox="0 0 920 600"
        role="img"
        aria-labelledby="ftTitle ftDesc"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <title id="ftTitle">Árbol causal del colapso ibérico del 28-A</title>
        <desc id="ftDesc">
          Diagrama pericial en tres bandas: vulnerabilidad previa (alta penetración IBR,
          red debilitada, oscilaciones precursoras), cadena causal (mallado de red,
          efecto Ferranti, contracción del margen Q–V, disparo raíz en Granada,
          desacoplamiento Tap‑Lag, cascada ANSI 59 con bucle de realimentación positiva)
          y fase terminal (UFLS paradójico, aislamiento con Francia, cero de tensión a
          las 12:33:29.741 CEST). Causa primaria: colapso de tensión por realimentación
          capacitiva.
        </desc>

        <defs>
          <marker id="arrT" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--ft-teal)" />
          </marker>
          <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--ft-amber)" />
          </marker>
          <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--ft-red)" />
          </marker>
          <marker id="arrS" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill="var(--ft-secondary)" />
          </marker>
        </defs>

        {/* ═══════════════════════════════════════════════════════
            BANDA 1 — VULNERABILIDAD PREVIA
        ═══════════════════════════════════════════════════════ */}
        <rect x="12" y="12" width="896" height="108" rx="5"
          fill="var(--ft-band1-bg)" stroke="var(--ft-band1-border)" strokeWidth="0.75" />

        <text x="460" y="29" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.bandLabel}>
          CONDICIONES DE VULNERABILIDAD PREVIA
        </text>

        {/* C1 — Alta penetración IBR */}
        <rect x="18" y="38" width="276" height="72" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="156" y="70" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Alta penetración IBR</text>
        <text x="156" y="87" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>82 % generación no síncrona</text>

        {/* C2 — Red debilitada */}
        <rect x="312" y="38" width="276" height="72" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="450" y="70" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Red debilitada</text>
        <text x="450" y="87" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>SCR bajo · inercia síncrona mínima</text>

        {/* C3 — Oscilaciones precursoras */}
        <rect x="606" y="38" width="276" height="72" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="744" y="70" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Oscilaciones precursoras</text>
        <text x="744" y="87" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>0,6 Hz (12:03) · 0,2 Hz (12:19)</text>

        {/* Conector Banda 1 → N1 Mallado */}
        <path d="M 450 120 L 450 134 L 107 134 L 107 148"
          stroke="var(--ft-secondary)" strokeWidth="1.2"
          markerEnd="url(#arrS)" />
        <text x="280" y="129" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.connNote}>fragilidad sistémica</text>

        {/* ═══════════════════════════════════════════════════════
            BANDA 2 · FILA A — CADENA CAUSAL SUPERIOR
        ═══════════════════════════════════════════════════════ */}

        {/* N1 — Mallado de red */}
        <rect x="14" y="148" width="185" height="104" rx="4"
          fill="var(--ft-teal-bg)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="107" y="186" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Mallado de red</text>
        <text x="107" y="204" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>11 líneas 400 kV</text>
        <text x="107" y="219" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:03 – 12:30 CEST</text>

        {/* N1 → N2 */}
        <line x1="199" y1="200" x2="215" y2="200"
          stroke="var(--ft-teal)" strokeWidth="2" markerEnd="url(#arrT)" />

        {/* N2 — Efecto Ferranti */}
        <rect x="215" y="148" width="185" height="104" rx="4"
          fill="var(--ft-teal-bg)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="308" y="186" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Efecto Ferranti</text>
        <text x="308" y="204" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>inyección capacitiva</text>
        <text x="308" y="219" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>líneas largas en vacío</text>

        {/* N2 → N3 */}
        <line x1="400" y1="200" x2="416" y2="200"
          stroke="var(--ft-teal)" strokeWidth="2" markerEnd="url(#arrT)" />

        {/* N3 — Contracción margen Q–V */}
        <rect x="416" y="148" width="185" height="104" rx="4"
          fill="var(--ft-teal-bg)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="509" y="181" textAnchor="middle"
          fill="var(--ft-text)" fontSize="14" fontWeight="600">
          <tspan>Contracción</tspan>
          <tspan x="509" dy="18">margen Q–V</tspan>
        </text>
        <text x="509" y="213" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>absorción reactiva ↓</text>
        <text x="509" y="228" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>−57 % margen Carmona</text>

        {/* N3 → N4 */}
        <line x1="601" y1="200" x2="617" y2="200"
          stroke="var(--ft-amber)" strokeWidth="2" markerEnd="url(#arrA)" />

        {/* N4 — Disparo raíz — AMBER */}
        <rect x="617" y="148" width="185" height="104" rx="4"
          fill="var(--ft-amber-bg)" stroke="var(--ft-amber)" strokeWidth="1.8" />
        <text x="710" y="186" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Disparo raíz</text>
        <text x="710" y="204" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>Granada · −165 MVAr</text>
        <text x="710" y="219" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:32:56 CEST</text>

        {/* N4 dog-leg → N5 */}
        <path d="M 710 252 L 710 276 L 107 276 L 107 308"
          stroke="var(--ft-teal)" strokeWidth="2" markerEnd="url(#arrT)" />

        {/* ═══════════════════════════════════════════════════════
            BANDA 2 · FILA B — CADENA CAUSAL INFERIOR
        ═══════════════════════════════════════════════════════ */}

        {/* N5 — Desacoplamiento Tap‑Lag */}
        <rect x="14" y="308" width="185" height="104" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="1" strokeDasharray="5 2.5" />
        <text x="107" y="344" textAnchor="middle"
          fill="var(--ft-text)" fontSize="13" fontWeight="600">Desacoplamiento Tap‑Lag</text>
        <text x="107" y="362" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>220 kV invisible al SCADA</text>
        <text x="107" y="377" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>inercia del OLTC</text>

        {/* N5 → N6 */}
        <line x1="199" y1="360" x2="215" y2="360"
          stroke="var(--ft-teal)" strokeWidth="2" markerEnd="url(#arrT)" />

        {/* N6 — Cascada ANSI 59 */}
        <rect x="215" y="308" width="185" height="104" rx="4"
          fill="var(--ft-teal-bg)" stroke="var(--ft-teal)" strokeWidth="2.5" />
        <text x="308" y="344" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Cascada ANSI 59</text>
        <text x="308" y="362" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>sobretensión en colectores</text>
        <text x="308" y="377" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>disparo masivo de IBR</text>

        {/* N6 → Cápsula */}
        <line x1="400" y1="360" x2="420" y2="360"
          stroke="var(--ft-amber)" strokeWidth="2" markerEnd="url(#arrA)" />

        {/* ═══════════════════════════════════════════════════════
            CÁPSULA — BUCLE DE REALIMENTACIÓN POSITIVA
        ═══════════════════════════════════════════════════════ */}
        <rect x="420" y="290" width="240" height="145" rx="6"
          fill="var(--ft-amber-bg)" stroke="var(--ft-amber)" strokeWidth="1.6" />

        <text x="540" y="310" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopTitle}>
          Bucle de realimentación positiva
        </text>
        <line x1="432" y1="318" x2="648" y2="318"
          stroke="var(--ft-amber)" strokeWidth="0.6" opacity="0.5" />

        <text x="540" y="337" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>Disparo de IBR</text>
        <text x="540" y="353" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="540" y="369" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>absorción Q disminuye</text>
        <text x="540" y="385" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="540" y="401" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>tensión V aumenta</text>
        <text x="540" y="416" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="540" y="429" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopBack}>nuevos disparos de IBR  ⟲</text>

        {/* ═══════════════════════════════════════════════════════
            BANDA 3 — FASE TERMINAL
        ═══════════════════════════════════════════════════════ */}

        {/* Dog-leg N6 → N7 UFLS (ajustado a y=438 para mayor separación) */}
        <path d="M 308 412 L 308 438 L 120 438 L 120 472"
          stroke="var(--ft-teal)" strokeWidth="2" fill="none"
          markerEnd="url(#arrT)" />

        {/* Terminal band background */}
        <rect x="12" y="448" width="896" height="124" rx="5"
          fill="var(--ft-band3-bg)" stroke="var(--ft-band3-border)" strokeWidth="0.75" />

        <text x="460" y="464" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.bandLabel}>
          FASE TERMINAL
        </text>

        {/* N7 — UFLS paradójico */}
        <rect x="20" y="472" width="200" height="82" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="120" y="500" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>UFLS paradójico</text>
        <text x="120" y="518" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>desconecta carga inductiva</text>
        <text x="120" y="533" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>tensión sigue aumentando</text>

        {/* N7 → N8 */}
        <line x1="220" y1="513" x2="246" y2="513"
          stroke="var(--ft-teal)" strokeWidth="2" markerEnd="url(#arrT)" />

        {/* N8 — Aislamiento con Francia */}
        <rect x="246" y="472" width="200" height="82" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="1" strokeDasharray="5 2.5" />
        <text x="346" y="500" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Aislamiento Francia</text>
        <text x="346" y="518" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>pérdida de sincronismo</text>
        <text x="346" y="533" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:33:21 CEST</text>

        {/* N8 → N9 */}
        <line x1="446" y1="520" x2="472" y2="520"
          stroke="var(--ft-red)" strokeWidth="2.5" markerEnd="url(#arrR)" />

        {/* N9 — Cero de tensión — RED, TERMINUS */}
        <rect x="472" y="472" width="224" height="96" rx="5"
          fill="var(--ft-red-bg)" stroke="var(--ft-red)" strokeWidth="2.5" />
        <text x="584" y="506" textAnchor="middle"
          fill="var(--ft-text)" className={styles.termTitle}>Cero de tensión</text>
        <text x="584" y="528" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>Península aislada</text>
        <text x="584" y="543" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:33:29.741 CEST</text>

        {/* ═══════════════════════════════════════════════════════
            NOTA AL PIE (versión compacta)
        ═══════════════════════════════════════════════════════ */}
        <text x="460" y="588" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.footnote}>
          Eje causal: colapso Q–V por realimentación capacitiva; la frecuencia fue síntoma terminal. Fuente: ENTSO-E, 2025.
        </text>
      </svg>
    </div>
  );
}