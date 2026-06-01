/**
 * FrequencyChart.jsx
 * Gráfico scrollytelling de la caída de frecuencia durante el 28-A.
 *
 * MEJORAS respecto a la versión anterior:
 * 1. CartesianGrid añadido: mejora la lectura de valores en el eje Y.
 * 2. Tooltip personalizado: muestra tiempo exacto y frecuencia en Hz.
 * 3. Modo no-galería: migrado de float:right a flexbox — más robusto en móvil.
 * 4. prefers-reduced-motion: desactiva animationDuration si el usuario lo prefiere.
 * 5. ReferenceLine de 48,46 Hz etiquetada más claramente como
 *    "Pérdida sincronismo FR (48,46 Hz)" para audiencia internacional.
 * 6. Línea de referencia adicional a 49,0 Hz (primer escalón UFLS demanda).
 *    NOTA: el bombeo se deslastra a 49,5 Hz (ya representado), la demanda
 *    a 49,0 Hz (añadido). Fuente: P.O. 1.6 / datos28A.json.
 */
import { useDocLang } from '@site/src/hooks/useDocLang';
import React, { useState, useMemo } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Scrollama, Step } from 'react-scrollama';
import {
  LineChart, Line, ReferenceLine, YAxis, XAxis,
  ResponsiveContainer, CartesianGrid, Tooltip,
} from 'recharts';
import styles from './FrequencyChart.module.css';
import { useForensicDataTablas } from '../data/forensicDataI18n';
import BrowserOnly from '@docusaurus/BrowserOnly';

// ─── Pasos del scrollytelling ─────────────────────────────────────────────────
const getSteps = (lang) => {
  const t = (es, en, pt, fr, it, de) =>
    ({ es, en, pt, fr, it, de }[lang] || es);
  return [
    {
      stepIndex: 0,
      title: t('12:32:57 — El detonante', '12:32:57 — The Trigger',
               '12:32:57 — O Gatilho', '12:32:57 — Le Déclencheur',
               '12:32:57 — L\'Innesco', '12:32:57 — Der Auslöser'),
      text: t(
        'Un transformador de 400/220 kV en Granada se desconecta por sobretensión en el colector a 220 kV (242 kV), eliminando bruscamente 355 MW activos y 165 MVAr de absorción reactiva inductiva. (ENTSO-E Factual, p.28)',
        'A 400/220 kV transformer in Granada disconnects due to overvoltage on the 220 kV collector busbar (242 kV), abruptly eliminating 355 MW active and 165 MVAr inductive reactive absorption. (ENTSO-E Factual, p.28)',
        'Um transformador de 400/220 kV em Granada desconecta por sobretensão no coletor 220 kV, eliminando 355 MW ativos e 165 MVAr de absorção reativa. (ENTSO-E Factual, p.28)',
        'Un transformateur 400/220 kV à Grenade se déconnecte pour surtension sur le jeu de barres collecteur 220 kV, éliminant 355 MW actifs et 165 MVAr d\'absorption réactive. (ENTSO-E Factual, p.28)',
        'Un trasformatore 400/220 kV a Granada si disconnette per sovratensione sul collettore 220 kV, eliminando 355 MW attivi e 165 MVAr di assorbimento reattivo. (ENTSO-E Factual, p.28)',
        'Ein 400/220-kV-Transformator in Granada schaltet wegen Überspannung am 220-kV-Sammelschienensystem ab und eliminiert 355 MW Wirkleistung und 165 MVAr Blindleistungsaufnahme. (ENTSO-E Factual, S.28)',
      ),
      visibleUntilT: 0,
    },
    {
      stepIndex: 1,
      title: t('12:33:15 — Sobretensión latente', '12:33:15 — Latent Overvoltage',
               '12:33:15 — Sobretensão Latente', '12:33:15 — Surtension Latente',
               '12:33:15 — Sovratensione Latente', '12:33:15 — Latente Überspannung'),
      text: t(
        'La tensión escala en la red de 400 kV por efecto Ferranti (red capacitiva descargada de flujos de potencia). El fenómeno Tap-Lag en los transformadores de colector oculta la sobretensión a los sistemas SCADA de REE.',
        'Voltage rises across the 400 kV grid due to the Ferranti effect (capacitive grid unloaded from power flows). The Tap-Lag phenomenon in collector transformers hides the overvoltage from REE SCADA systems.',
        'A tensão sobe na rede 400 kV pelo efeito Ferranti. O fenômeno Tap-Lag nos transformadores de coletor oculta a sobretensão dos sistemas SCADA da REE.',
        'La tension monte sur le réseau 400 kV par effet Ferranti. Le phénomène Tap-Lag dans les transformateurs collecteurs masque la surtension aux systèmes SCADA de REE.',
        'La tensione sale sulla rete 400 kV per effetto Ferranti. Il fenomeno Tap-Lag nei trasformatori collettori nasconde la sovratensione ai sistemi SCADA di REE.',
        'Die Spannung steigt im 400-kV-Netz durch den Ferranti-Effekt. Das Tap-Lag-Phänomen in Kollektortransformatoren verbirgt die Überspannung vor den SCADA-Systemen der REE.',
      ),
      visibleUntilT: 18,
    },
    {
      stepIndex: 2,
      title: t('12:33:18 — Inicio de la cascada', '12:33:18 — Cascade Initiation',
               '12:33:18 — Início da Cascata', '12:33:18 — Début de la Cascade',
               '12:33:18 — Inizio della Cascata', '12:33:18 — Kaskadenbeginn'),
      text: t(
        'Los nudos colectores superan 1,10 p.u. (~145 kV en 132 kV). Los inversores solares activan su protección HVRT (High Voltage Ride-Through). Caen en cascada las plantas de Badajoz (730 MW) y Sevilla (550 MW).',
        'Collector nodes exceed 1.10 p.u. (~145 kV in 132 kV). Solar inverters activate their HVRT (High Voltage Ride-Through) protection. Badajoz (730 MW) and Seville (550 MW) cascade down.',
        'Os nós coletores superam 1,10 p.u. Os inversores solares ativam proteção HVRT. Caem Badajoz (730 MW) e Sevilha (550 MW).',
        'Les nœuds collecteurs dépassent 1,10 p.u. Les onduleurs solaires activent leur protection HVRT. Badajoz (730 MW) et Séville (550 MW) tombent en cascade.',
        'I nodi collettori superano 1,10 p.u. Gli inverter solari attivano la protezione HVRT. Cadono Badajoz (730 MW) e Siviglia (550 MW).',
        'Kollektorknoten überschreiten 1,10 p.u. Solar-Wechselrichter aktivieren HVRT-Schutz. Badajoz (730 MW) und Sevilla (550 MW) fallen kaskadenförmig aus.',
      ),
      visibleUntilT: 21,
    },
    {
      stepIndex: 3,
      title: t('12:33:20 — Caída libre inercial', '12:33:20 — Inertial Freefall',
               '12:33:20 — Queda Livre Inercial', '12:33:20 — Chute Libre Inertielle',
               '12:33:20 — Caduta Libera Inerziale', '12:33:20 — Trägheitsfreier Fall'),
      text: t(
        'Tras la pérdida de ~15 GW de generación en segundos, la frecuencia cae con un RoCoF sostenido cercano a 1 Hz/s. Con H_eq ≈ 2,4 s (ENTSO-E Factual, Tabla 2-4), el sistema tiene escasos segundos antes de la separación.',
        'After losing ~15 GW of generation in seconds, frequency drops with a sustained RoCoF near 1 Hz/s. With H_eq ≈ 2.4 s (ENTSO-E Factual, Table 2-4), the system has just seconds before separation.',
        'Após perda de ~15 GW em segundos, a frequência cai com RoCoF próximo a 1 Hz/s. Com H_eq ≈ 2,4 s, o sistema tem apenas segundos antes da separação.',
        'Après perte de ~15 GW en quelques secondes, la fréquence chute avec un RoCoF soutenu proche de 1 Hz/s. Avec H_eq ≈ 2,4 s, le système dispose de quelques secondes avant la séparation.',
        'Dopo la perdita di ~15 GW in pochi secondi, la frequenza scende con RoCoF sostenuto vicino a 1 Hz/s. Con H_eq ≈ 2,4 s, il sistema ha pochi secondi prima della separazione.',
        'Nach Verlust von ~15 GW in Sekunden fällt die Frequenz mit einem anhaltenden RoCoF nahe 1 Hz/s. Mit H_eq ≈ 2,4 s hat das System nur noch Sekunden bis zur Trennung.',
      ),
      visibleUntilT: 23,
    },
    {
      stepIndex: 4,
      title: t('12:33:21 — Aislamiento europeo', '12:33:21 — European Isolation',
               '12:33:21 — Isolamento Europeu', '12:33:21 — Isolement Européen',
               '12:33:21 — Isolamento Europeo', '12:33:21 — Europäische Isolation'),
      text: t(
        'A 48,46 Hz, las protecciones de pérdida de sincronismo (ANSI 78) abren los enlaces AC con Francia. La península ibérica queda aislada del área síncrona continental europea. (ENTSO-E Factual, pp.108-109)',
        'At 48.46 Hz, loss-of-synchronism protections (ANSI 78) open AC links with France. The Iberian Peninsula becomes isolated from the European continental synchronous area. (ENTSO-E Factual, pp.108-109)',
        'A 48,46 Hz, proteções de perda de sincronismo abrem os links AC com a França. A península ibérica fica isolada da área síncrona continental europeia.',
        'À 48,46 Hz, les protections de perte de synchronisme ouvrent les liaisons CA avec la France. La péninsule ibérique se retrouve isolée de la zone synchrone continentale européenne.',
        'A 48,46 Hz, le protezioni di perdita del sincronismo aprono i collegamenti CA con la Francia. La penisola iberica rimane isolata dall\'area sincrona continentale europea.',
        'Bei 48,46 Hz öffnen Synchronismusverlustschutzvorrichtungen die Wechselstromverbindungen mit Frankreich. Die Iberische Halbinsel ist vom europäischen kontinentalen Synchronbereich isoliert.',
      ),
      visibleUntilT: 24,
    },
    {
      stepIndex: 5,
      title: t('12:33:23 — Colapso y paradoja UFLS', '12:33:23 — Collapse & UFLS Paradox',
               '12:33:23 — Colapso e Paradoxo UFLS', '12:33:23 — Effondrement et Paradoxe UFLS',
               '12:33:23 — Collasso e Paradosso UFLS', '12:33:23 — Kollaps & UFLS-Paradoxon'),
      text: t(
        'El UFLS deslastra bombeo e industria. Paradoja: al eliminar consumo inductivo, agrava la sobretensión residual. El reactor nuclear activa SCRAM automático. Cero de tensión sistémico a las 12:33:27 CEST.',
        'UFLS sheds pumping and industry. Paradox: removing inductive consumption worsens residual overvoltage. Nuclear reactor triggers automatic SCRAM. Systemic voltage zero at 12:33:27 CEST.',
        'O UFLS corta bombeamento e indústria. Paradoxo: eliminar consumo indutivo agrava a sobretensão residual. Reator nuclear ativa SCRAM. Zero de tensão a 12:33:27 CEST.',
        'L\'UFLS déleste le pompage et l\'industrie. Paradoxe : supprimer la consommation inductive aggrave la surtension résiduelle. Le réacteur nucléaire déclenche un SCRAM. Zéro de tension à 12:33:27 CEST.',
        'L\'UFLS scarica pompaggio e industria. Paradosso: eliminare il consumo induttivo peggiora la sovratensione residua. Il reattore nucleare attiva lo SCRAM. Zero di tensione a 12:33:27 CEST.',
        'UFLS wirft Pump- und Industrielast ab. Paradoxon: Entfernen induktiver Last verschlimmert die Restüberspannung. Kernreaktor löst automatischen SCRAM aus. Systemweiter Spannungsnullpunkt um 12:33:27 CEST.',
      ),
      visibleUntilT: 26,
    },
  ];
};

// ─── Tooltip personalizado ────────────────────────────────────────────────────
function FrequencyTooltip({ active, payload, label, strings }) {
  if (!active || !payload?.length) return null;
  const f = payload[0]?.value;
  if (f == null) return null;
  return (
    <div style={{
      background: 'rgba(10,10,20,0.96)',
      border: '1px solid rgba(255,77,77,0.4)',
      borderRadius: 6,
      padding: '8px 12px',
      fontFamily: 'monospace',
      fontSize: 12,
      color: '#e2e8f0',
    }}>
      <p style={{ margin: '0 0 4px', color: '#94a3b8' }}>
        t = {label} s
      </p>
      <p style={{ margin: 0, color: '#FF4D4D', fontWeight: 'bold' }}>
        f = {f.toFixed(3)} Hz
      </p>
    </div>
  );
}

// ─── Gráfico base (reutilizable) ──────────────────────────────────────────────
function FrequencyLineChart({ data, strings, animated = false }) {
  // Respetar prefers-reduced-motion
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 24 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="tiempoS"
          domain={[0, 30]}
          type="number"
          stroke="#475569"
          tick={{ fill: 'var(--text-1, #64748b)', fontSize: 11 }}
          label={{
            value: strings.xaxis,
            position: 'insideBottom',
            offset: -12,
            fill: 'var(--text-1, #64748b)',
            fontSize: 11,
          }}
        />
        <YAxis
          domain={[46, 50.2]}
          stroke="#475569"
          tick={{ fill: 'var(--text-1, #64748b)', fontSize: 11 }}
          unit=" Hz"
        />
        <Tooltip content={<FrequencyTooltip strings={strings} />} />

        {/* Umbral deslastre bombeo (49,5 Hz) — P.O. 1.6 */}
        <ReferenceLine
          y={49.5}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          label={{
            position: 'insideBottomRight',
            value: strings.ufls,
            fill: '#f59e0b',
            fontSize: 10,
          }}
        />
        {/* Umbral deslastre demanda (49,0 Hz) — P.O. 1.6 */}
        <ReferenceLine
          y={49.0}
          stroke="#ef4444"
          strokeDasharray="3 5"
          label={{
            position: 'insideBottomRight',
            value: strings.uflsDemand,
            fill: '#ef4444',
            fontSize: 10,
          }}
        />
        {/* Pérdida de sincronismo (48,46 Hz) — ENTSO-E Factual */}
        <ReferenceLine
          y={48.46}
          stroke="#dc2626"
          strokeDasharray="4 4"
          label={{
            position: 'insideTopRight',
            value: strings.iso,
            fill: '#dc2626',
            fontSize: 10,
          }}
        />

        <Line
          type="stepAfter"
          dataKey="frecuencia"
          stroke="#FF4D4D"
          strokeWidth={3}
          isAnimationActive={animated && !prefersReduced}
          animationDuration={600}
          dot={{ r: 4, fill: 'var(--ifm-background-surface-color)', stroke: '#FF4D4D', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#FF4D4D' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Strings de UI ────────────────────────────────────────────────────────────
const getStrings = (l) => {
  switch (l) {
    case 'en': return {
      xaxis: 'Seconds from trigger',
      ufls: 'Pump UFLS (49.5 Hz)',
      uflsDemand: 'Demand UFLS (49.0 Hz)',
      iso: 'FR sync loss (48.46 Hz)',
      dyn: 'Collapse dynamics — 30 critical seconds.',
    };
    case 'pt': return {
      xaxis: 'Segundos desde o gatilho',
      ufls: 'UFLS Bombagem (49.5 Hz)',
      uflsDemand: 'UFLS Demanda (49.0 Hz)',
      iso: 'Perda sinc. FR (48,46 Hz)',
      dyn: 'Dinâmica de colapso — 30 segundos críticos.',
    };
    case 'fr': return {
      xaxis: 'Secondes depuis le déclencheur',
      ufls: 'UFLS Pompage (49.5 Hz)',
      uflsDemand: 'UFLS Demande (49.0 Hz)',
      iso: 'Perte synchro FR (48,46 Hz)',
      dyn: 'Dynamique d\'effondrement — 30 secondes critiques.',
    };
    case 'it': return {
      xaxis: 'Secondi dall\'innesco',
      ufls: 'UFLS Pompaggio (49.5 Hz)',
      uflsDemand: 'UFLS Domanda (49.0 Hz)',
      iso: 'Perdita sinc. FR (48,46 Hz)',
      dyn: 'Dinamica di collasso — 30 secondi critici.',
    };
    case 'de': return {
      xaxis: 'Sekunden seit Auslöser',
      ufls: 'UFLS Pumpen (49.5 Hz)',
      uflsDemand: 'UFLS Nachfrage (49.0 Hz)',
      iso: 'FR Synch.verlust (48,46 Hz)',
      dyn: 'Kollapsdynamik — 30 kritische Sekunden.',
    };
    default: return {
      xaxis: 'Segundos desde el detonante',
      ufls: 'UFLS Bombeo (49,5 Hz)',
      uflsDemand: 'UFLS Demanda (49,0 Hz)',
      iso: 'Pérdida sinc. FR (48,46 Hz)',
      dyn: 'Dinámica de colapso — 30 segundos críticos.',
    };
  }
};

// ─── Exportación principal ────────────────────────────────────────────────────
export default function FrequencyChartScrolly({ isGallery = false}) {
  const lang = useDocLang();
  const { i18n } = useDocusaurusContext();
  const currentLang = lang || i18n.currentLocale || 'es';

  const loadingText = {
    en: 'Loading interactive visualization...',
    pt: 'Carregando visualização interativa...',
    fr: 'Chargement de la visualisation interactive...',
    it: 'Caricamento della visualizzazione interattiva...',
    de: 'Interaktive Visualisierung wird geladen...',
    es: 'Cargando visualización interactiva...',
  }[currentLang] || 'Cargando...';

  return (
    <BrowserOnly fallback={
      <div style={{ color: 'var(--text-1, #64748b)', fontFamily: 'monospace', padding: '2rem', textAlign: 'center' }}>
        {loadingText}
      </div>
    }>
      {() => <FrequencyChartScrollyContent isGallery={isGallery} lang={currentLang} />}
    </BrowserOnly>
  );
}

function FrequencyChartScrollyContent({ isGallery}) {
  const lang = useDocLang();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const STEPS = useMemo(() => getSteps(lang), [lang]);
  const strings = useMemo(() => getStrings(lang), [lang]);
  const currentStep = STEPS[currentStepIndex] || STEPS[0];

  const { timelineData } = useForensicDataTablas();
  const validTimelineData = useMemo(
    () => (timelineData || []).filter(d => d.frecuencia > 0),
    [timelineData],
  );
  const visibleData = useMemo(
    () => validTimelineData.filter(d => d.tiempoS <= currentStep.visibleUntilT),
    [validTimelineData, currentStep.visibleUntilT],
  );

  // ── Modo galería ──────────────────────────────────────────────────────────
  if (isGallery) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{
          height: 380,
          background: 'var(--ifm-background-surface-color)',
          borderRadius: 12,
          padding: '1rem',
          border: '1px solid var(--ifm-color-emphasis-200)',
        }}>
          <FrequencyLineChart data={visibleData} strings={strings} animated={false} />
        </div>

        {/* Botones de paso */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}
             role="tablist" aria-label="Fases del colapso">
          {STEPS.map(s => {
            const isActive = currentStepIndex === s.stepIndex;
            return (
              <button
                key={s.stepIndex}
                role="tab"
                aria-selected={isActive}
                onClick={() => setCurrentStepIndex(s.stepIndex)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 4,
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--ifm-color-primary)' : '3px solid transparent',
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--ifm-color-primary) 15%, transparent)'
                    : 'transparent',
                  color: isActive ? 'var(--ifm-color-primary)' : 'var(--ifm-font-color-base)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 'bold' : 'normal',
                  transition: 'all 0.25s ease',
                  fontSize: 12,
                }}
              >
                {s.title.split(' — ')[0]}
              </button>
            );
          })}
        </div>

        {/* Panel de texto */}
        <div style={{
          padding: '1rem',
          background: 'rgba(255,77,77,0.05)',
          border: '1px solid rgba(255,77,77,0.15)',
          borderRadius: 8,
          minHeight: 80,
        }}>
          <h4 style={{ color: 'var(--ifm-color-primary)', margin: '0 0 8px' }}>
            {currentStep.title}
          </h4>
          <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
            {currentStep.text}
          </p>
        </div>
      </div>
    );
  }

  // ── Modo scrollytelling (página MDX) ─────────────────────────────────────
  return (
    <div
      className={styles.scrollyWrapper}
      style={{ position: 'relative', margin: '2rem 0' }}
    >
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
      }}>
        {/* Textos a la izquierda */}
        <div style={{ width: '42%', flexShrink: 0, position: 'relative', zIndex: 5 }}>
          <Scrollama
            onStepEnter={({ data }) => setCurrentStepIndex(data)}
            offset={0.5}
          >
            {STEPS.map(s => (
              <Step data={s.stepIndex} key={s.stepIndex}>
                <div style={{
                  margin: '48vh 0',
                  padding: '1.5rem',
                  backgroundColor: 'var(--ifm-background-surface-color)',
                  border: currentStepIndex === s.stepIndex
                    ? '2px solid var(--ifm-color-primary)'
                    : '1px solid var(--ifm-color-emphasis-200)',
                  borderRadius: 8,
                  boxShadow: currentStepIndex === s.stepIndex
                    ? '0 8px 30px rgba(255,77,77,0.1)'
                    : 'none',
                  opacity: currentStepIndex === s.stepIndex ? 1 : 0.35,
                  transform: currentStepIndex === s.stepIndex
                    ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <h4 style={{
                    color: 'var(--ifm-color-primary)',
                    fontSize: '1.1rem',
                    marginBottom: '0.75rem',
                  }}>
                    {s.title}
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.65, margin: 0 }}>
                    {s.text}
                  </p>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>

        {/* Gráfico sticky a la derecha */}
        <div style={{
          flex: 1,
          position: 'sticky',
          top: '100px',
          height: '62vh',
          zIndex: 10,
        }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, color: 'var(--ifm-color-primary)', fontSize: '1rem' }}>
              {currentStep.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--ifm-color-emphasis-700)', margin: '4px 0 0' }}>
              {strings.dyn}
            </p>
          </div>
          <div style={{
            height: 'calc(100% - 52px)',
            background: 'var(--ifm-background-surface-color)',
            borderRadius: 12,
            padding: '0.75rem',
            border: '1px solid var(--ifm-color-emphasis-200)',
          }}>
            <FrequencyLineChart data={visibleData} strings={strings} animated />
          </div>
        </div>
      </div>
    </div>
  );
}
