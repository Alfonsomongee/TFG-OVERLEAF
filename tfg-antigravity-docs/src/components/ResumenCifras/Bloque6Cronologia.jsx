import React, { useMemo } from 'react';
import styles from './Bloque6Cronologia.module.css';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STATUS_ICONS = {
  red: <ShieldAlert className="w-5 h-5 text-red-400" />,
  orange: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  green: <CheckCircle2 className="w-5 h-5 text-green-400" />,
};

const TIMELINE_DATA = [
  { time: '12:33 CEST', date: '28 abr', color: '#E24B4A', title: 'Cero eléctrico confirmado', description: 'Tensión 400 kV < 1 kV. ~25,2 GW interrumpidos. ~57 millones de personas sin suministro.', demand: 0 },
  { time: '12:35 CEST', date: '28 abr', color: '#EF9F27', title: 'Solicitud black-start a EDP Portugal', description: 'Arranque autónomo a C. do Bode (hidroeléctrica, 138 MW, cuenca Zêzere). REN cursó la orden en ~2 min.', demand: 0 },
  { time: '12:43 CEST', date: '28 abr', color: '#EF9F27', title: 'Primera reenergización: Hernani (País Vasco)', description: 'Arteria 400 kV desde Francia. Importación: ~31 MW confirmados en Irún.', demand: 1 },
  { time: '12:45 CEST', date: '28 abr', color: '#1D9E75', title: 'C. do Bode conectado a barra 220 kV REN', description: 'Arranque exitoso en ~10 min. Primera isla eléctrica de Portugal creada.', demand: 0.5 },
  { time: '13:35 CEST', date: '28 abr', color: '#EF9F27', title: 'Línea Baixàs–Vic 400 kV sincronizada', description: 'Segunda arteria desde Francia (este peninsular). Expansión hacia Cataluña.', demand: 4 },
  { time: '18:36 CEST', date: '28 abr', color: '#1D9E75', title: 'Sincronización España–Portugal', description: 'Línea Aldeadávila–Pocinho 220 kV. Portugal se conecta a la frecuencia europea continental.', demand: 30 },
  { time: '23:00 CEST', date: '28 abr', color: '#1D9E75', title: '51% de la demanda recuperada', description: '12.847 MW activos. 70% subestaciones energizadas. Hospitales operando con normalidad.', demand: 51 },
  { time: '00:22 CEST', date: '29 abr', color: '#1D9E75', title: 'Red transporte Portugal 100% restaurada', description: 'REN confirma reposición total red alta tensión. Baja tensión en proceso.', demand: 65 },
  { time: '04:00 CEST', date: '29 abr', color: '#1D9E75', title: 'Red transporte España 100% restaurada', description: 'REE confirma reposición total red transporte española. Tiempo: ~15,5 horas.', demand: 80 },
  { time: '07:00 CEST', date: '29 abr', color: '#1D9E75', title: 'Reposición prácticamente completa', description: '99,95% demanda peninsular recuperada. Zonas rurales aisladas continúan.', demand: 99.95 },
];

const BLACKSTART_DATA = [
  { flagEmoji: '🇵🇹', flag: 'PT', country: 'portugal', name: 'Castelo do Bode', technology: 'Hidroeléctrica · 138 MW', operator: 'EDP', location: 'Cuenca del Zêzere, Portugal', detail: 'Arranque en ~10 min · Coste: ~240k €/año' },
  { flagEmoji: '🇪🇸', flag: 'ES', country: 'spain', name: 'Aldeadávila', technology: 'Hidroeléctrica reversible · ~1.100 MW', operator: 'Iberdrola', location: 'Cuenca del Duero, Salamanca', detail: 'Esquema BS-Duero 1 activado ~16:00 CEST' },
];

const SOURCES = 'REE Operación 29/04/2025 · REN Portugal · ENTSO-E Final Report (mar. 2026) · Jornal de Negócios (abr. 2025)';

const getDemandGradient = (demand) => {
  const getGradientString = (from, to) => `linear-gradient(to right, ${from} 0%, ${to} 100%)`;
  if (demand === 0) return getGradientString('#E24B4A', '#F27170');
  if (demand === 100) return getGradientString('#1D9E75', '#32D8A7');

  if (demand <= 50) {
    const ratio = demand / 50;
    const fromR = Math.round(226 + (239 - 226) * ratio);
    const fromG = Math.round(75 + (159 - 75) * ratio);
    const fromB = Math.round(74 + (39 - 74) * ratio);
    const toR = Math.round(242 + (251 - 242) * ratio);
    const toG = Math.round(113 + (192 - 113) * ratio);
    const toB = Math.round(112 + (85 - 112) * ratio);
    return getGradientString(`rgb(${fromR}, ${fromG}, ${fromB})`, `rgb(${toR}, ${toG}, ${toB})`);
  } else {
    const ratio = (demand - 50) / 50;
    const fromR = Math.round(239 + (29 - 239) * ratio);
    const fromG = Math.round(159 + (158 - 159) * ratio);
    const fromB = Math.round(39 + (117 - 39) * ratio);
    const toR = Math.round(251 + (50 - 251) * ratio);
    const toG = Math.round(192 + (216 - 192) * ratio);
    const toB = Math.round(85 + (170 - 85) * ratio);
    return getGradientString(`rgb(${fromR}, ${fromG}, ${fromB})`, `rgb(${toR}, ${toG}, ${toB})`);
  }
};

const TimelineCard = ({ event, index }) => {
  const demandGradient = useMemo(() => getDemandGradient(event.demand), [event.demand]);
  const statusKey = useMemo(() => {
    if (event.color === '#E24B4A') return 'red';
    if (event.color === '#EF9F27') return 'orange';
    return 'green';
  }, [event.color]);

  return (
    <div className={`${styles.timelineCardWrapper} ${styles.fadeInUp}`} style={{ animationDelay: `${index * 80}ms` }}>
      <div className={styles.timelineCard} style={{ borderLeftColor: event.color }}>
        <div className={styles.timelineTimeCol}>
          <div className={styles.timelineTimeLabel}>
            {STATUS_ICONS[statusKey]}
            <span className={styles.timelineTimeText}>{event.time}</span>
          </div>
          <div className={styles.timelineDateText}>{event.date}</div>
        </div>

        <div className={styles.timelineContentCol}>
          <h3 className={styles.timelineContentTitle}>{event.title}</h3>
          <p className={styles.timelineContentDesc}>{event.description}</p>
        </div>

        <div className={styles.timelineDemandCol}>
          <div className={styles.timelineDemandValue}>{event.demand.toFixed(1)}%</div>
          <div className={styles.timelineDemandLabel}>Demanda Recuperada</div>
          <div className={styles.timelineDemandBarBg}>
            <div className={styles.timelineDemandBarFill} style={{ width: `${event.demand}%`, background: demandGradient }} />
          </div>
        </div>
      </div>

      <div className={styles.timelineCircle} style={{ backgroundColor: event.color, boxShadow: `0 0 12px ${event.color}80` }} />
    </div>
  );
};

const BlackStartCard = ({ card, index }) => {
  const borderColor = card.country === 'portugal' ? '#1D9E75' : '#E24B4A';

  return (
    <div className={`${styles.blackstartCard} ${styles.fadeInUp}`} style={{ borderLeftColor: borderColor, animationDelay: `${900 + index * 80}ms` }}>
      <div className={styles.blackstartHeader}>
        <div className={styles.blackstartEmoji}>{card.flagEmoji}</div>
        <div>
          <div className={styles.blackstartName}>{card.name}</div>
          <div className={styles.blackstartFlag}>{card.flag}</div>
        </div>
      </div>

      <div className={styles.blackstartList}>
        {[
          { label: 'TECNOLOGÍA', value: card.technology },
          { label: 'OPERADOR', value: card.operator },
          { label: 'LOCALIZACIÓN', value: card.location },
        ].map((item, idx) => (
          <div key={idx} className={styles.blackstartItem}>
            <span className={styles.blackstartItemLabel}>{item.label}</span>
            <span className={styles.blackstartItemValue}>{item.value}</span>
          </div>
        ))}

        <div className={styles.blackstartDetail}>
          <div className={styles.blackstartItemLabel} style={{ marginBottom: '8px' }}>Dato clave</div>
          <span className={styles.blackstartItemValue}>{card.detail}</span>
        </div>
      </div>
    </div>
  );
};

export default function Bloque6Cronologia() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Cronología de reposición</h1>
          <p className={styles.subtitle}>28–29 de abril de 2025 · Desde cero eléctrico (12:33 CEST) hasta recuperación total (07:00 CEST)</p>
        </div>
        <div className={styles.statusBadge}>
          {STATUS_ICONS.green}
          <span className={styles.statusBadgeText}>Sistema Sincronizado</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLine} />
          <h2 className={styles.sectionTitle}>Eventos de recuperación del suministro</h2>
        </div>
        {TIMELINE_DATA.map((event, index) => (
          <TimelineCard key={index} event={event} index={index} />
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.header} style={{ marginBottom: '32px' }}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--color-text-primary)' }}>Plantas de arranque autónomo (black-start) activadas</h2>
          <p className={styles.subtitle} style={{ marginTop: '8px' }}>Dossiers de las centrales críticas para el proceso de reenergización.</p>
        </div>
        <div className={styles.blackstartGrid}>
          {BLACKSTART_DATA.map((card, index) => (
            <BlackStartCard key={index} card={card} index={index} />
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <p>Fuente: {SOURCES}</p>
      </div>
    </div>
  );
}
