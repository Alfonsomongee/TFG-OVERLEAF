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

const data = [
  {
    name: 'Impacto VoLL',
    value: [0, 1500],
    amount: 1500,
    color: '#ef4444', // Red-500
    desc: 'Paralización comercial y caída del PIB (CEOE/ATA).'
  },
  {
    name: 'Daños Industria',
    value: [1500, 1525],
    amount: 25,
    color: '#f97316', // Orange-500
    desc: 'Daño directo y lucro cesante electrointensivas (AEGE).'
  },
  {
    name: 'Op. Reforzada (OPEX)',
    value: [1525, 2236],
    amount: 711,
    color: '#f59e0b', // Amber-500
    desc: 'Quemar gas innecesario cuesta el 25% del plan de resiliencia.'
  },
  {
    name: 'Multas CNMC',
    value: [2236, 2356],
    amount: 120,
    color: '#8b5cf6', // Violet-500
    desc: 'Infracciones muy graves a operadores y promotoras.'
  },
  {
    name: 'Destrucción Total',
    value: [0, 2356],
    amount: 2356,
    color: '#3f3f46', // Zinc-700 for total distinction
    desc: 'Impacto financiero total en los primeros 12 meses.'
  }
];

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
const renderCustomizedLabel = (props) => {
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

export default function FinancialWaterfallChart() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Auditoría de Destrucción de Valor (Primer Año Post-Apagón)</h3>
        <p>Impacto financiero acumulativo en Millones de Euros (M€).</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={450}>
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
              <LabelList dataKey="value" content={renderCustomizedLabel} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.footerInfo}>
        <p><strong>Insight Analítico:</strong> El <em>OPEX tóxico</em> de la "Operación Reforzada" (-711 M€) equivale anualmente a quemar casi el 25% de todo el <em>CAPEX</em> estructural necesario (3.000 M€) para modernizar la red mediante Condensadores Síncronos y baterías BESS.</p>
      </div>
    </div>
  );
}
