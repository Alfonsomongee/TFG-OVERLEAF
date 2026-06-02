// slides/Slide62.jsx
import React, { useEffect} from 'react';
import styles from '../styles/Slide62.module.css';
import DigitalClock from '../DigitalClock';
import StatusIndicator from '../StatusIndicator';

export default function Slide62({ slideProgress }) {
  const stage = slideProgress >= 0.8 ? 3 : slideProgress >= 0.5 ? 2 : slideProgress >= 0.2 ? 1 : 0;

  const criticsOpacity = Math.min(1, Math.max(0, (slideProgress - 0.2) / 0.3));
  const favorableOpacity = Math.min(1, Math.max(0, (slideProgress - 0.5) / 0.3));
  const internationalOpacity = Math.min(1, Math.max(0, (slideProgress - 0.8) / 0.15));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator status="ANÁLISIS DE PRENSA" color="#3b82f6" />
        <DigitalClock fixedTime="DIAS POSTERIORES" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>ANÁLISIS DE PRENSA: ENCUADRES Y SESGOS</h1>
        <h2 className={styles.subtitle}>SELECCIÓN ASIMÉTRICA DE EVIDENCIAS</h2>

        {/* MEDIOS CRÍTICOS */}
        <div style={{ opacity: criticsOpacity, width: '100%' }}>
          <h3 className={styles.sectionTitle}>MEDIOS CRÍTICOS CON LA GESTIÓN INSTITUCIONAL</h3>
          <div className={styles.mediaGrid}>
            <div className={styles.mediaCard}>
              <span>EL MUNDO</span>
              <p>“FLAMANVILLE 3 Y LAS 56 NUCLEARES FRANCESAS QUE SALVARON AL ANTINUCLEAR SÁNCHEZ”</p>
              <div className={styles.verdict}>❌ OMITE PAPEL DE HIDROELÉCTRICAS Y MARRUECOS</div>
            </div>
            <div className={styles.mediaCard}>
              <span>ABC</span>
              <p>“ALARMENTE FALTA DE INERCIA ROTACIONAL POR CENTRALES NUCLEARES APAGADAS”</p>
              <div className={styles.verdict}>❌ CONTRADICE CONSENSO TÉCNICO (H=2,3S SEGÚN REGISTROS)</div>
            </div>
            <div className={styles.mediaCard}>
              <span>LA RAZÓN</span>
              <p>“PROGRAMACIÓN DE INSUFICIENTE GENERACIÓN SÍNCRONA CAUSÓ EL APAGÓN”</p>
              <div className={styles.verdict}>⚠️ RESPALDO PARCIAL (OMITE MANIOBRA DE MALLADO)</div>
            </div>
          </div>
        </div>

        {/* MEDIOS FAVORABLES */}
        {stage >= 2 && (
          <div style={{ opacity: favorableOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>MEDIOS FAVORABLES A LA NARRATIVA OFICIAL</h3>
            <div className={styles.mediaGrid}>
              <div className={styles.mediaCard}>
                <span>EL PAÍS</span>
                <p>“CAPACIDAD DE INTERCAMBIO CON FRANCIA DEL 3% – MUY INFERIOR AL 15% EUROPEO”</p>
                <div className={styles.verdict}>✅ ARGUMENTO SÓLIDO</div>
              </div>
              <div className={styles.mediaCard}>
                <span>ELDIARIO.ES</span>
                <p>“REE OPERÓ CON MÁRGENES DE SEGURIDAD REDUCIDOS PESE A LA PREVISIÓN DE ALTA RADIACIÓN”</p>
                <div className={styles.verdict}>✅ COHERENTE CON DÉFICIT DE REACTIVA</div>
              </div>
              <div className={styles.mediaCard}>
                <span>LA VANGUARDIA</span>
                <p>“APERTURA TRANSPIRENAICA ‘EGOÍSTA’ PARA SALVAGUARDAR FRANCIA”</p>
                <div className={styles.verdict}>❌ CONFUNDE PROTECCIÓN AUTOMÁTICA CON DECISIÓN CONSCIENTE</div>
              </div>
            </div>
          </div>
        )}

        {/* COBERTURA INTERNACIONAL */}
        {stage >= 3 && (
          <div style={{ opacity: internationalOpacity, width: '100%' }}>
            <h3 className={styles.sectionTitle}>COBERTURA INTERNACIONAL</h3>
            <div className={styles.intlGrid}>
              <div>REUTERS – ANÁLISIS CON MAYOR RIGOR TÉCNICO</div>
              <div>LE MONDE – ENFOQUE DESCRIPTIVO DEL IMPACTO TRANSFRONTERIZO</div>
              <div>BBC – SEGURIDAD DE INFRAESTRUCTURAS CRÍTICAS (REFUTA CIBERATAQUE)</div>
              <div>FINANCIAL TIMES – “DEPENDENCIA SOLAR” (INCONSISTENTE CON CONSENSO)</div>
              <div>THE TELEGRAPH – “EXPERIMENTO” (DESMENTIDO POR EURONEWS VERIFY)</div>
            </div>
            <div className={styles.synthesis}>
              CONCLUSIÓN: NINGÚN BLOQUE OFRECIÓ REPRESENTACIÓN DE LA MULTICAUSALIDAD TÉCNICA
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>FUENTE: ELABORACIÓN PROPIA A PARTIR DE PUBLICACIONES EN PRENSA Y REDES SOCIALES</div>
    </div>
  );
}