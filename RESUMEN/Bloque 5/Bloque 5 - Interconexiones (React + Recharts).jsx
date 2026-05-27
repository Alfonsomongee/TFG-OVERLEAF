'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * BLOQUE 5: INTERCONEXIONES ELÉCTRICAS (REACT + RECHARTS)
 * 
 * Componente funcional React refactorizado de Vanilla JS
 * Incluye:
 * - Bullet Chart (barras superpuestas) con recharts
 * - Dark mode profesional para TFG de Ingeniería Energética
 * - Tarjetas de utilización con colores semánticos
 * - Panel de alerta crítica (ANSI 78)
 * - Fuentes en footer
 * - Responsive design (Tailwind CSS)
 */

// ============================================================================
// 1. DATOS
// ============================================================================

const INTERCONNECTIONS_DATA = [
  {
    id: 'france-ac',
    name: 'Francia AC',
    flowReal: 870,
    capacityMax: 2700,
    observation: '32% utiliz. · ratio interconexión 3-5% del mix',
  },
  {
    id: 'hvdc-inelfe',
    name: 'HVDC INELFE',
    flowReal: 1000,
    capacityMax: 2000,
    observation: '50% utiliz. · modo PMODE1 "potencia constante"',
  },
  {
    id: 'portugal',
    name: 'Portugal (exp)',
    flowReal: 2600,
    capacityMax: 3900,
    observation: '67% utiliz. · mayor flujo de las interconexiones',
  },
  {
    id: 'morocco',
    name: 'Marruecos',
    flowReal: 800,
    capacityMax: 900,
    observation: '89% utiliz. · primera en desconectarse (~49 Hz)',
  },
];

const KEY_DATA = {
  title: 'Dato clave de la cascada',
  content:
    'Durante la cascada (12:33:19 CEST), la importación desde Francia alcanzó un pico de 4.609 MW por AC, superando la capacidad nominal de 2.700 MW, antes de que las protecciones ANSI 78 (out-of-step) abrieran la interconexión a los 48,46 Hz.',
};

const SOURCES =
  'ENTSO-E Factual Report (oct. 2025) · REE Informe Incidente 18/06/2025 · ENTSO-E Final Report (mar. 2026)';

// ============================================================================
// 2. UTILIDADES
// ============================================================================

/**
 * Calcula el porcentaje de utilización y devuelve color semántico
 */
const getUtilizationColor = (percentage) => {
  if (percentage < 50) return '#1D9E75'; // Verde
  if (percentage < 75) return '#EF9F27'; // Ámbar
  return '#E24B4A'; // Rojo
};

/**
 * Formatea números grandes con separador de miles
 */
const formatNumber = (num) => num.toLocaleString('es-ES');

// ============================================================================
// 3. COMPONENTES
// ============================================================================

/**
 * BulletChart: Gráfico de barras superpuestas (Bullet Chart)
 * 
 * Muestra:
 * - Barra de fondo (gris): capacidad máxima
 * - Barra de frente (azul): flujo real
 * - Efecto de "margen" visual
 */
const BulletChart = () => {
  const chartData = useMemo(
    () =>
      INTERCONNECTIONS_DATA.map((item) => ({
        name: item.name,
        flowReal: item.flowReal,
        capacityMax: item.capacityMax,
      })),
    []
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1a1a1a] border border-[#404040] rounded px-3 py-2 text-xs">
          <p className="text-white font-mono">
            {data.name}
          </p>
          <p className="text-[#378ADD]">
            Flujo: {formatNumber(data.flowReal)} MW
          </p>
          <p className="text-gray-400">
            Capacidad: {formatNumber(data.capacityMax)} MW
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#2d2d2d] border border-[#404040] rounded-lg p-4 mb-8">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#808080', fontSize: 11, fontFamily: 'monospace' }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis
            tick={{ fill: '#808080', fontSize: 10, fontFamily: 'monospace' }}
            tickFormatter={(value) => `${formatNumber(value)} MW`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Barra de capacidad (fondo gris) */}
          <Bar
            dataKey="capacityMax"
            fill="rgba(100, 100, 100, 0.25)"
            radius={[3, 3, 0, 0]}
            name="Capacidad máxima"
          />
          
          {/* Barra de flujo real (frente azul) */}
          <Bar
            dataKey="flowReal"
            fill="#378ADD"
            radius={[3, 3, 0, 0]}
            name="Flujo real"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * UtilizationCard: Tarjeta individual de utilización
 * 
 * Muestra:
 * - Nombre de interconexión
 * - Barra de progreso (color dinámico)
 * - Porcentaje grande (monospace)
 * - Observación técnica
 */
const UtilizationCard = ({ interconnection }) => {
  const utilization = (interconnection.flowReal / interconnection.capacityMax) * 100;
  const barColor = getUtilizationColor(utilization);

  return (
    <div className="bg-[#2d2d2d] border border-[#404040] rounded-lg p-4 flex flex-col gap-3">
      <h3 className="text-sm font-medium text-white">{interconnection.name}</h3>
      
      {/* Barra de progreso */}
      <div className="w-full h-2 bg-white/10 rounded overflow-hidden">
        <div
          className="h-full rounded transition-all duration-300"
          style={{ width: `${utilization}%`, backgroundColor: barColor }}
        />
      </div>
      
      {/* Porcentaje grande */}
      <div className="text-2xl font-bold font-mono text-white">
        {utilization.toFixed(0)}%
      </div>
      
      {/* Observación */}
      <p className="text-xs text-gray-400 leading-relaxed">
        {interconnection.observation}
      </p>
      
      {/* Detalle técnico (debajo) */}
      <p className="text-xs text-gray-500 font-mono mt-1">
        {formatNumber(interconnection.flowReal)} / {formatNumber(interconnection.capacityMax)} MW
      </p>
    </div>
  );
};

/**
 * CriticalAlert: Panel de alerta crítica (ANSI 78)
 * 
 * Diseño:
 * - Borde izquierdo rojo (#E24B4A)
 * - Fondo rojo semitransparente
 * - Ícono de alerta (⚡)
 * - Contenido destacado
 */
const CriticalAlert = ({ data }) => {
  return (
    <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 mb-8">
      <div className="flex gap-3">
        <div className="text-2xl">⚡</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">
            {data.title}
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed font-mono">
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * InterconnectionsWidget: Componente principal
 * 
 * Layout:
 * 1. Header (título + subtítulo)
 * 2. Bullet Chart (barras superpuestas)
 * 3. Grid de tarjetas (2x2 → responsive)
 * 4. Panel de alerta crítica
 * 5. Footer con fuentes
 */
export default function InterconnectionsWidget() {
  return (
    <div className="bg-[#1a1a1a] text-white font-mono min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* ============ HEADER ============ */}
        <div className="mb-6">
          <h1 className="text-base font-semibold uppercase tracking-widest text-white">
            Estado de interconexiones
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Península Ibérica · 28 de abril de 2025 · 12:30 CEST
          </p>
        </div>

        {/* ============ LEYENDA ============ */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6 bg-[#2d2d2d] rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 bg-[#378ADD] rounded" />
            <span>Flujo real (exportación, MW)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 bg-gray-600 rounded" />
            <span>Capacidad máxima (MW)</span>
          </div>
        </div>

        {/* ============ BULLET CHART ============ */}
        <BulletChart />

        {/* ============ TARJETAS DE UTILIZACIÓN (GRID 2x2) ============ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {INTERCONNECTIONS_DATA.map((interconnection) => (
            <UtilizationCard
              key={interconnection.id}
              interconnection={interconnection}
            />
          ))}
        </div>

        {/* ============ PANEL DE ALERTA CRÍTICA ============ */}
        <CriticalAlert data={KEY_DATA} />

        {/* ============ FOOTER ============ */}
        <div className="border-t border-[#404040] pt-4 text-center text-xs text-gray-600 font-mono">
          <p>Fuente: {SOURCES}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * MEJORAS EN LA REFACTORIZACIÓN:
 * 
 * ✅ React funcional + hooks (useMemo para datos)
 * ✅ Recharts con Bullet Chart (barras superpuestas)
 * ✅ Dark mode profesional (grises oscuros #1a1a1a, #2d2d2d, texto blanco)
 * ✅ Dashboard técnico (monospace font, uppercase headers)
 * ✅ Tarjetas de utilización mejoradas (grid responsivo Tailwind)
 * ✅ Panel de alerta crítica (rojo semitransparente + ícono)
 * ✅ Fuentes en footer (monospace pequeño)
 * ✅ Responsive design (grid-cols-1 sm:grid-cols-2)
 * ✅ Sin manipulación del DOM (React state + props)
 * ✅ Componentes reutilizables (BulletChart, UtilizationCard, CriticalAlert)
 * 
 * INTEGRACIÓN EN MDX/DOCUSAURUS:
 * 
 * // En tu archivo .mdx
 * import InterconnectionsWidget from '@/components/Bloque5InterconnectionsWidget';
 * 
 * <InterconnectionsWidget />
 */
