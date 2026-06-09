import React from 'react';
import styles from './FaultTreeCollapseFigure.module.css';

export default function FaultTreeCollapseFigure() {
  return (
    <div className={styles.figure}>
      <svg
        viewBox="0 0 1100 565"
        role="img"
        aria-labelledby="ftTitle ftDesc"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
      >
        <title id="ftTitle">Árbol causal del colapso ibérico del 28-A</title>
        <desc id="ftDesc">
          Diagrama pericial en tres bandas narrativas: vulnerabilidad previa (alta
          penetración IBR, red debilitada, oscilaciones precursoras), cadena causal
          principal (mallado de red, efecto Ferranti, contracción del margen Q–V,
          disparo raíz en Granada, desacoplamiento Tap‑Lag, cascada ANSI 59 con
          bucle de realimentación positiva), y fase terminal (UFLS paradójico,
          aislamiento con Francia, cero de tensión a las 12:33:29.741 CEST). La causa
          primaria fue un colapso de tensión por realimentación capacitiva.
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

        {/* Band background */}
        <rect x="14" y="10" width="730" height="88" rx="4"
          fill="var(--ft-band1-bg)" stroke="var(--ft-band1-border)" strokeWidth="0.75" />

        {/* Band eyebrow */}
        <text x="369" y="25" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.bandLabel}>
          CONDICIONES DE VULNERABILIDAD PREVIA
        </text>

        {/* Condition node 1 */}
        <rect x="26" y="32" width="192" height="58" rx="3"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="122" y="52" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Alta penetración IBR</text>
        <text x="122" y="67" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>82 % generación no síncrona</text>

        {/* Condition node 2 */}
        <rect x="234" y="32" width="192" height="58" rx="3"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="330" y="52" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Red debilitada</text>
        <text x="330" y="67" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>SCR bajo · baja absorción síncrona</text>

        {/* Condition node 3 */}
        <rect x="442" y="32" width="192" height="58" rx="3"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="0.8" strokeDasharray="4 2" />
        <text x="538" y="52" textAnchor="middle"
          fill="var(--ft-text)" className={styles.condLabel}>Oscilaciones precursoras</text>
        <text x="538" y="67" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.condSub}>0,6 Hz (12:03) · 0,2 Hz (12:19)</text>

        {/* "configuran" label outside band bg */}
        <text x="752" y="55" textAnchor="start"
          fill="var(--ft-secondary)" className={styles.configLabel}>
          configuran la
        </text>
        <text x="752" y="70" textAnchor="start"
          fill="var(--ft-secondary)" className={styles.configLabel}>
          fragilidad inicial
        </text>

        {/* Connector Band 1 → Mallado */}
        <path d="M 370 98 L 370 108 L 117 108 L 117 118"
          stroke="var(--ft-secondary)" strokeWidth="1"
          markerEnd="url(#arrS)" />
        <text x="242" y="103" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.connNote}>
          fragilidad sistémica
        </text>


        {/* ═══════════════════════════════════════════════════════
            BANDA 2 — CADENA CAUSAL PRINCIPAL
        ═══════════════════════════════════════════════════════ */}

        {/* ── Fila A ── */}

        {/* N1 Mallado */}
        <rect x="40" y="118" width="154" height="88" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="117" y="148" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Mallado de red</text>
        <text x="117" y="165" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>11 líneas 400 kV</text>
        <text x="117" y="179" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:03 – 12:30 CEST</text>

        {/* N1 → N2 */}
        <line x1="194" y1="162" x2="220" y2="162"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* N2 Ferranti */}
        <rect x="220" y="118" width="154" height="88" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="297" y="148" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Efecto Ferranti</text>
        <text x="297" y="165" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>inyección capacitiva</text>
        <text x="297" y="179" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>líneas largas en vacío</text>

        {/* N2 → N3 */}
        <line x1="374" y1="162" x2="400" y2="162"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* N3 Margen Q-V */}
        <rect x="400" y="118" width="154" height="88" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="477" y="148" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Contracción margen Q–V</text>
        <text x="477" y="165" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>absorción reactiva ↓</text>
        <text x="477" y="179" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>−57 % margen Carmona</text>

        {/* N3 → N4 */}
        <line x1="554" y1="162" x2="580" y2="162"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* N4 Disparo raíz — AMBER */}
        <rect x="580" y="118" width="164" height="88" rx="4"
          fill="var(--ft-amber-bg)" stroke="var(--ft-amber)" strokeWidth="1.6" />
        <text x="662" y="148" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Disparo raíz</text>
        <text x="662" y="165" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>Granada · −165 MVAr</text>
        <text x="662" y="179" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:32:56 CEST</text>

        {/* N4 → N5 dog-leg */}
        <path d="M 662 206 L 662 236 L 297 236 L 297 258"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* ── Fila B ── */}

        {/* N5 Tap-Lag */}
        <rect x="220" y="258" width="154" height="88" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="1" strokeDasharray="5 2.5" />
        <text x="297" y="288" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Desacoplamiento Tap‑Lag</text>
        <text x="297" y="305" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>220 kV invisible al SCADA</text>
        <text x="297" y="319" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>inercia del OLTC</text>

        {/* N5 → N6 */}
        <line x1="374" y1="302" x2="400" y2="302"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* N6 ANSI 59 — TEAL, PROMINENTE */}
        <rect x="400" y="258" width="154" height="88" rx="4"
          fill="var(--ft-teal-bg)" stroke="var(--ft-teal)" strokeWidth="2" />
        <text x="477" y="285" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Cascada ANSI 59</text>
        <text x="477" y="302" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>sobretensión en colectores</text>
        <text x="477" y="316" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>disparo masivo de IBR</text>

        {/* N6 → Feedback capsule */}
        <line x1="554" y1="302" x2="622" y2="302"
          stroke="var(--ft-amber)" strokeWidth="1.8" markerEnd="url(#arrA)" />

        {/* Return arc: Feedback capsule → ANSI 59 (over the top) */}
        <path d="M 622 252 C 590 216 492 216 477 258"
          stroke="var(--ft-amber)" strokeWidth="1.5" fill="none"
          markerEnd="url(#arrA)" strokeDasharray="5 3" />


        {/* ═══════════════════════════════════════════════════════
            CÁPSULA — BUCLE DE REALIMENTACIÓN POSITIVA
        ═══════════════════════════════════════════════════════ */}

        <rect x="622" y="238" width="246" height="148" rx="5"
          fill="var(--ft-amber-bg)" stroke="var(--ft-amber)" strokeWidth="1.4" />

        {/* Capsule title */}
        <text x="745" y="258" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopTitle}>
          Bucle de realimentación positiva
        </text>
        <line x1="634" y1="266" x2="856" y2="266"
          stroke="var(--ft-amber)" strokeWidth="0.5" opacity="0.5" />

        {/* Loop steps */}
        <text x="745" y="283" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>Disparo de IBR</text>
        <text x="745" y="297" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="745" y="311" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>absorción reactiva Q disminuye</text>
        <text x="745" y="325" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="745" y="339" textAnchor="middle"
          fill="var(--ft-text)" className={styles.loopStep}>tensión V aumenta</text>
        <text x="745" y="353" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopArrow}>↓</text>
        <text x="745" y="369" textAnchor="middle"
          fill="var(--ft-amber)" className={styles.loopBack}>nuevos disparos de IBR  ⟲</text>


        {/* ═══════════════════════════════════════════════════════
            BANDA 3 — FASE TERMINAL
        ═══════════════════════════════════════════════════════ */}

        {/* ANSI59 → UFLS dog-leg */}
        <path d="M 477 346 L 477 375 L 127 375 L 127 406"
          stroke="var(--ft-teal)" strokeWidth="1.8" fill="none"
          markerEnd="url(#arrT)" />

        {/* Terminal band background */}
        <rect x="14" y="385" width="980" height="96" rx="4"
          fill="var(--ft-band3-bg)" stroke="var(--ft-band3-border)" strokeWidth="0.75" />

        {/* Band eyebrow */}
        <text x="504" y="400" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.bandLabel}>
          FASE TERMINAL
        </text>

        {/* N7 UFLS paradójico */}
        <rect x="28" y="406" width="190" height="68" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)" strokeWidth="1" />
        <text x="123" y="430" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>UFLS paradójico</text>
        <text x="123" y="447" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>desconecta carga inductiva</text>
        <text x="123" y="461" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>→ tensión aumenta aún más</text>

        {/* N7 → N8 */}
        <line x1="218" y1="440" x2="244" y2="440"
          stroke="var(--ft-teal)" strokeWidth="1.8" markerEnd="url(#arrT)" />

        {/* N8 Aislamiento Francia */}
        <rect x="244" y="406" width="192" height="68" rx="4"
          fill="var(--ft-surface)" stroke="var(--ft-border)"
          strokeWidth="1" strokeDasharray="5 2.5" />
        <text x="340" y="430" textAnchor="middle"
          fill="var(--ft-text)" className={styles.nodeTitle}>Aislamiento con Francia</text>
        <text x="340" y="447" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>pérdida de sincronismo</text>
        <text x="340" y="461" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:33:21 CEST</text>

        {/* N8 → N9 */}
        <line x1="436" y1="440" x2="460" y2="440"
          stroke="var(--ft-red)" strokeWidth="2" markerEnd="url(#arrR)" />

        {/* N9 Cero de tensión — RED, TERMINUS */}
        <rect x="460" y="396" width="218" height="86" rx="4"
          fill="var(--ft-red-bg)" stroke="var(--ft-red)" strokeWidth="2" />
        <text x="569" y="425" textAnchor="middle"
          fill="var(--ft-text)" className={styles.termTitle}>Cero de tensión</text>
        <text x="569" y="445" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>Península aislada</text>
        <text x="569" y="462" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.nodeSub}>12:33:29.741 CEST</text>


        {/* ═══════════════════════════════════════════════════════
            NOTA AL PIE
        ═══════════════════════════════════════════════════════ */}
        <text x="548" y="532" textAnchor="middle"
          fill="var(--ft-secondary)" className={styles.footnote}>
          Eje dominante: tensión / potencia reactiva (Q–V). La caída de frecuencia es síntoma
          terminal, no causa raíz.
        </text>
      </svg>
    </div>
  );
}
