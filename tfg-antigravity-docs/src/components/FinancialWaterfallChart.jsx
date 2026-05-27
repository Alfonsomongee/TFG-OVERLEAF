import React from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import styles from './FinancialWaterfallChart.module.css';

const getData = (lang) => {
  const t = (es, en, pt, fr, it, de) => ({es, en, pt, fr, it, de}[lang] || es);
  return [
    {
      name: t('Impacto VoLL', 'VoLL Impact', 'Impacto VoLL', 'Impact VoLL', 'Impatto VoLL', 'VoLL-Auswirkungen'),
      value: [0, 1500],
      amount: 1500,
      color: '#ef4444', // Red-500
      desc: t('Paralización comercial y caída del PIB (CEOE/ATA).', 'Commercial standstill and GDP drop (CEOE/ATA).', 'Paralisação comercial e queda do PIB (CEOE/ATA).', 'Paralysie commerciale et chute du PIB (CEOE/ATA).', 'Paralisi commerciale e calo del PIL (CEOE/ATA).', 'Kommerzieller Stillstand und BIP-Rückgang (CEOE/ATA).')
    },
    {
      name: t('Daños Industria', 'Industry Damages', 'Danos Indústria', 'Dommages Industrie', 'Danni Industria', 'Industrieschäden'),
      value: [1500, 1525],
      amount: 25,
      color: '#f97316', // Orange-500
      desc: t('Daño directo y lucro cesante electrointensivas (AEGE).', 'Direct damage and lost profits in electro-intensive industries (AEGE).', 'Dano direto e lucros cessantes em eletrointensivas (AEGE).', 'Dommages directs et manque à gagner des industries électro-intensives (AEGE).', 'Danni diretti e mancati profitti nelle industrie elettrolitiche (AEGE).', 'Direkte Schäden und entgangene Gewinne in stromintensiven Industrien (AEGE).')
    },
    {
      name: t('Op. Reforzada (OPEX)', 'Reinforced Op. (OPEX)', 'Op. Reforçada (OPEX)', 'Op. Renforcée (OPEX)', 'Op. Rinforzata (OPEX)', 'Verstärkter Betr. (OPEX)'),
      value: [1525, 2236],
      amount: 711,
      color: '#f59e0b', // Amber-500
      desc: t('Quemar gas innecesario cuesta el 25% del plan de resiliencia.', 'Burning unnecessary gas costs 25% of the resilience plan.', 'Queimar gás desnecessário custa 25% do plano de resiliência.', 'Brûler du gaz inutilement coûte 25% du plan de résilience.', 'Bruciare gas inutilmente costa il 25% del piano di resilienza.', 'Unnötiges Verbrennen von Gas kostet 25% des Resilienzplans.')
    },
    {
      name: t('Multas CNMC', 'CNMC Fines', 'Multas CNMC', 'Amendes CNMC', 'Multe CNMC', 'CNMC-Strafen'),
      value: [2236, 2356],
      amount: 120,
      color: '#8b5cf6', // Violet-500
      desc: t('Infracciones muy graves a operadores y promotoras.', 'Very serious infractions for operators and developers.', 'Infrações muito graves para operadores e promotores.', 'Infractions très graves pour les opérateurs et promoteurs.', 'Infrazioni molto gravi per operatori e promotori.', 'Sehr schwere Verstöße für Betreiber und Entwickler.')
    },
    {
      name: t('Destrucción Total', 'Total Destruction', 'Destruição Total', 'Destruction Totale', 'Distruzione Totale', 'Totale Zerstörung'),
      value: [0, 2356],
      amount: 2356,
      color: '#3f3f46', // Zinc-700
      desc: t('Impacto financiero total en los primeros 12 meses.', 'Total financial impact in the first 12 months.', 'Impacto financeiro total nos primeiros 12 meses.', 'Impact financier total au cours des 12 premiers mois.', 'Impatto finanziario totale nei primi 12 mesi.', 'Gesamte finanzielle Auswirkungen in den ersten 12 Monaten.')
    }
  ];
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataInfo = payload[0].payload;
    return (
      <div className={styles.customTooltip}>
        <h4 className={styles.tooltipTitle}>{dataInfo.name}</h4>
        <p className={styles.tooltipAmount} style={{ color: dataInfo.color }}>
          <strong>{dataInfo.amount} M€</strong>
        </p>
        <p className={styles.tooltipDesc}>{dataInfo.desc}</p>
      </div>
    );
  }
  return null;
};

// Componente para formatear los labels interiores de las barras
const renderCustomizedLabel = (props, data) => {
  const { x, y, width, height, index } = props;
  const dataItem = data[index];
  
  const isSmall = Math.abs(height) < 25;
  const isTotal = index === 4;
  
  // Posicionar la etiqueta: si es total o barra normal, en el medio. Si es pequeña, arriba.
  const labelY = isSmall ? y - 15 : y + height / 2;
  const fill = isSmall ? 'var(--ifm-font-color-base)' : '#fff';
  const prefix = isTotal ? '=' : '+';
  
  return (
    <text 
      x={x + width / 2} 
      y={labelY} 
      fill={fill} 
      textAnchor="middle" 
      dominantBaseline="middle"
      fontSize={13}
      fontWeight="bold"
    >
      {prefix} {dataItem.amount}
    </text>
  );
};

export default function FinancialWaterfallChart({ lang = 'es' }) {
  const data = getData(lang);

  const getStrings = (l) => {
    switch (l) {
      case 'en': return { title: 'Value Destruction Audit (First Year Post-Blackout)', desc: 'Cumulative financial impact in Millions of Euros (M€).', insightLabel: 'Analytical Insight:', insightText: 'The <em>toxic OPEX</em> of the "Reinforced Operation" (-711 M€) is annually equivalent to burning almost 25% of all the structural <em>CAPEX</em> needed (3,000 M€) to modernize the grid with Synchronous Condensers and BESS batteries.' };
      case 'pt': return { title: 'Auditoria de Destruição de Valor (Primeiro Ano Pós-Apagão)', desc: 'Impacto financeiro cumulativo em Milhões de Euros (M€).', insightLabel: 'Insight Analítico:', insightText: 'O <em>OPEX tóxico</em> da "Operação Reforçada" (-711 M€) equivale anualmente a queimar quase 25% de todo o <em>CAPEX</em> estrutural necessário (3.000 M€) para modernizar a rede com Condensadores Síncronos e baterias BESS.' };
      case 'fr': return { title: 'Audit de Destruction de Valeur (Première Année Post-Panne)', desc: 'Impact financier cumulé en Millions d\'Euros (M€).', insightLabel: 'Aperçu Analytique :', insightText: 'L\'<em>OPEX toxique</em> de l\'"Opération Renforcée" (-711 M€) équivaut annuellement à brûler près de 25% de tout le <em>CAPEX</em> structurel nécessaire (3 000 M€) pour moderniser le réseau avec des Compensateurs Synchrones et des batteries BESS.' };
      case 'it': return { title: 'Audit di Distruzione di Valore (Primo Anno Post-Blackout)', desc: 'Impatto finanziario cumulativo in Milioni di Euro (M€).', insightLabel: 'Approfondimento Analitico:', insightText: 'Il <em>OPEX tossico</em> dell\'"Operazione Rinforzata" (-711 M€) equivale annualmente a bruciare quasi il 25% di tutto il <em>CAPEX</em> strutturale necessario (3.000 M€) per modernizzare la rete con Condensatori Sincroni e batterie BESS.' };
      case 'de': return { title: 'Wertvernichtungsprüfung (Erstes Jahr nach dem Blackout)', desc: 'Kumulative finanzielle Auswirkungen in Millionen Euro (M€).', insightLabel: 'Analytischer Einblick:', insightText: 'Der <em>toxische OPEX</em> des "Verstärkten Betriebs" (-711 M€) entspricht jährlich fast 25% des gesamten strukturellen <em>CAPEX</em> (3.000 M€), der erforderlich ist, um das Netz mit Synchrongeneratoren und BESS-Batterien zu modernisieren.' };
      default: return { title: 'Auditoría de Destrucción de Valor (Primer Año Post-Apagón)', desc: 'Impacto financiero acumulativo en Millones de Euros (M€).', insightLabel: 'Insight Analítico:', insightText: 'El <em>OPEX tóxico</em> de la "Operación Reforzada" (-711 M€) equivale anualmente a quemar casi el 25% de todo el <em>CAPEX</em> estructural necesario (3.000 M€) para modernizar la red mediante Condensadores Síncronos y baterías BESS.' };
    }
  };
  const strings = getStrings(lang);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{strings.title}</h3>
        <p>{strings.desc}</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={650}>
          <ComposedChart
            data={data}
            margin={{ top: 40, right: 30, left: 20, bottom: 40 }}
            accessibilityLayer={true}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis 
              tickFormatter={(val) => `${val} M€`}
              tick={{ fill: 'var(--ifm-font-color-base)', opacity: 0.8 }}
              tickLine={false}
              axisLine={false}
              domain={[0, 2500]}
              ticks={[0, 500, 1000, 1500, 2000, 2500]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} isAnimationActive={false} />
            
            {/* Línea conectora tipo Waterfall (stepAfter) usando el límite superior de cada barra */}
            <Line 
              type="stepAfter" 
              dataKey={(d) => d.value[1]} 
              stroke="var(--ifm-color-emphasis-500)" 
              strokeDasharray="4 4" 
              strokeWidth={2} 
              dot={false} 
              activeDot={false} 
              isAnimationActive={true}
              animationDuration={1000}
            />

            <Bar dataKey="value" radius={[4, 4, 4, 4]} isAnimationActive={true} animationDuration={1000}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" content={(props) => renderCustomizedLabel(props, data)} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.footerInfo}>
        <p><strong>{strings.insightLabel}</strong> <span dangerouslySetInnerHTML={{__html: strings.insightText}} /></p>
      </div>
    </div>
  );
}
