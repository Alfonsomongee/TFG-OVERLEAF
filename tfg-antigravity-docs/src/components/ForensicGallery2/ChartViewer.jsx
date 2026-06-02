// ChartViewer.jsx
import React, { useState, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useForensicData } from '@site/src/data/forensicChartsI18n';
import styles from './ForensicGallery2.module.css';

// Lazy-loaded chart components
const DemandaChart = lazy(() => import(/* webpackChunkName: "esios-DemandaChart" */ '@site/src/components/EsiosCharts/DemandaChart'));
const ProgramacionChart = lazy(() => import(/* webpackChunkName: "esios-ProgramacionChart" */ '@site/src/components/EsiosCharts/ProgramacionChart'));
const PrecioEnergiaChart = lazy(() => import(/* webpackChunkName: "esios-PrecioEnergiaChart" */ '@site/src/components/EsiosCharts/PrecioEnergiaChart'));
const PreciosChart = lazy(() => import(/* webpackChunkName: "esios-PreciosChart" */ '@site/src/components/EsiosCharts/PreciosChart'));
const PotenciaChart = lazy(() => import(/* webpackChunkName: "esios-PotenciaChart" */ '@site/src/components/EsiosCharts/PotenciaChart'));
const SubastasChart = lazy(() => import(/* webpackChunkName: "esios-SubastasChart" */ '@site/src/components/EsiosCharts/SubastasChart'));
const GenericEsiosChart = lazy(() => import(/* webpackChunkName: "esios-GenericEsiosChart" */ '@site/src/components/EsiosCharts/GenericEsiosChart'));
const ForecastTransferChart = lazy(() => import(/* webpackChunkName: "entsoe-ForecastTransferChart" */ '@site/src/components/EntsoeCharts/ForecastTransferChart'));
const CostCongestionChart = lazy(() => import(/* webpackChunkName: "entsoe-CostCongestionChart" */ '@site/src/components/EntsoeCharts/CostCongestionChart'));
const ActualGenerationChart = lazy(() => import(/* webpackChunkName: "entsoe-ActualGenerationChart" */ '@site/src/components/EntsoeCharts/ActualGenerationChart'));
const HydroReservoirChart = lazy(() => import(/* webpackChunkName: "entsoe-HydroReservoirChart" */ '@site/src/components/EntsoeCharts/HydroReservoirChart'));
const ImbalancePricesChart = lazy(() => import(/* webpackChunkName: "entsoe-ImbalancePricesChart" */ '@site/src/components/EntsoeCharts/ImbalancePricesChart'));
const CurrentBalancingStateChart = lazy(() => import(/* webpackChunkName: "entsoe-CurrentBalancingStateChart" */ '@site/src/components/EntsoeCharts/CurrentBalancingStateChart'));
const ScheduledCommercialExchangesChart = lazy(() => import(/* webpackChunkName: "entsoe-ScheduledCommercialExchangesChart" */ '@site/src/components/EntsoeCharts/ScheduledCommercialExchangesChart'));
const FallbacksChart = lazy(() => import(/* webpackChunkName: "entsoe-FallbacksChart" */ '@site/src/components/EntsoeCharts/FallbacksChart'));
const InstalledCapacityChart = lazy(() => import(/* webpackChunkName: "entsoe-InstalledCapacityChart" */ '@site/src/components/EntsoeCharts/InstalledCapacityChart'));
const TotalLoadChart = lazy(() => import(/* webpackChunkName: "entsoe-TotalLoadChart" */ '@site/src/components/EntsoeCharts/TotalLoadChart'));
const EnergyPricesChart = lazy(() => import(/* webpackChunkName: "entsoe-EnergyPricesChart" */ '@site/src/components/EntsoeCharts/EnergyPricesChart'));
const CrossBorderFlowsChart = lazy(() => import(/* webpackChunkName: "entsoe-CrossBorderFlowsChart" */ '@site/src/components/EntsoeCharts/CrossBorderFlowsChart'));
const ImbalanceChart = lazy(() => import(/* webpackChunkName: "entsoe-ImbalanceChart" */ '@site/src/components/EntsoeCharts/ImbalanceChart'));
const FrrCapacityChart = lazy(() => import(/* webpackChunkName: "entsoe-FrrCapacityChart" */ '@site/src/components/EntsoeCharts/FrrCapacityChart'));

// Map component names to actual components
const COMPONENT_MAP = {
  DemandaChart,
  ProgramacionChart,
  PrecioEnergiaChart,
  PreciosChart,
  PotenciaChart,
  SubastasChart,
  ForecastTransferChart,
  CostCongestionChart,
  ActualGenerationChart,
  HydroReservoirChart,
  ImbalancePricesChart,
  CurrentBalancingStateChart,
  ScheduledCommercialExchangesChart,
  FallbacksChart,
  InstalledCapacityChart,
  TotalLoadChart,
  EnergyPricesChart,
  CrossBorderFlowsChart,
  ImbalanceChart,
  FrrCapacityChart,
  // GenericEsiosChart variants
  GenericEsiosChartCO2: (props) => (
    <GenericEsiosChart
      dataUrl="/data/esios/otros-indicadores.json"
      title="Generación libre de CO₂ (%)"
      unit="%"
      includeKeys={['Porcentaje de generación libre de CO2']}
    />
  ),
  GenericEsiosChartDesvios: (props) => (
    <GenericEsiosChart
      dataUrl="/data/esios/precios-desvios-tiempo-real.json"
      title="Precios de Desvíos Tiempo Real (28-29 Abril)"
      unit="€/MWh"
    />
  ),
  GenericEsiosChartSaldos: (props) => (
    <GenericEsiosChart
      dataUrl="/data/esios/saldos-horarios-por-frontera.json"
      title="Saldos Horarios por Frontera (28-29 Abril)"
      unit="MW"
    />
  ),
};

function ChartLoadingFallback({ color }) {
  return (
    <div className={styles.chartLoading}>
      <div className={styles.spinner} style={{ borderTopColor: color }} />
      Cargando gráfica...
    </div>
  );
}



const UI_LABELS = {
  es: {
    whatShows: 'Qué muestra',
    relevance: 'Por qué importa para el 28-A',
    prev: 'Anterior',
    next: 'Siguiente',
    continueWith: 'Continuar con',
    source: 'Fuente',
  },
  en: {
    whatShows: 'What it shows',
    relevance: 'Why it matters for April 28',
    prev: 'Previous',
    next: 'Next',
    continueWith: 'Continue with',
    source: 'Source',
  },
  pt: {
    whatShows: 'O que mostra',
    relevance: 'Por que importa para 28-A',
    prev: 'Anterior',
    next: 'Próximo',
    continueWith: 'Continuar com',
    source: 'Fonte',
  },
  fr: {
    whatShows: 'Ce que montre ce graphique',
    relevance: 'Pourquoi c\'est important pour le 28-A',
    prev: 'Précédent',
    next: 'Suivant',
    continueWith: 'Continuer avec',
    source: 'Source',
  },
  it: {
    whatShows: 'Cosa mostra',
    relevance: 'Perché è importante per il 28-A',
    prev: 'Precedente',
    next: 'Successivo',
    continueWith: 'Continua con',
    source: 'Fonte',
  },
  de: {
    whatShows: 'Was der Grafik zeigt',
    relevance: 'Warum es für den 28-A wichtig ist',
    prev: 'Vorherige',
    next: 'Nächste',
    continueWith: 'Weiter mit',
    source: 'Quelle',
  },
};

export default function ChartViewer({ chartId, locale, onSelectChart }) {
  const { CHARTS, getCategoryById, getAdjacentCharts } = useForensicData();
  const chart = CHARTS.find(c => c.id === chartId);
  const l = UI_LABELS[locale] || UI_LABELS.es;
  const [mobileDescOpen, setMobileDescOpen] = useState(false);
  const [mobileRelOpen, setMobileRelOpen] = useState(false);

  if (!chart) return null;

  const cat = getCategoryById(chart.categoryId);
  const { prev, next, nextCategoryFirst } = getAdjacentCharts(chartId);
  const ChartComponent = COMPONENT_MAP[chart.component];

  // Get localized texts with fallback to Spanish
  const desc = chart[`desc_${locale}`] || chart.desc || '';
  const rel  = chart[`rel_${locale}`]  || chart.rel  || '';

  return (
    <>
      {/* ── ZONA SUPERIOR DERECHA (Gráfica) ── */}
      <div className={styles.chartArea}>
        {/* ── HEADER ── */}
        <div className={styles.chartHeader}>
          <div className={styles.chartHeaderTop}>
            <h2 className={styles.chartTitle}>{chart.fullTitle}</h2>
          </div>
          {chart.subtitle && (
            <div className={styles.chartSubtitle}>{chart.subtitle}</div>
          )}
          <div className={styles.chartHeaderMeta}>
            <span
              className={`${styles.sourceBadge} ${chart.sourceBadge === 'ESIOS' ? styles.esios : styles.entsoe}`}
            >
              {chart.sourceBadge}
            </span>
            <span className={styles.techCode}>{chart.techCode}</span>
          </div>
        </div>

        {/* ── CHART ── */}
        <div className={styles.chartContainer}>
          {ChartComponent ? (
            <BrowserOnly>
              {() => (
                <Suspense fallback={
                  <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-1, #64748b)', fontFamily: 'monospace', fontSize: '13px' }}>
                    Inicializando simulador…
                  </div>
                }>
                  <ChartComponent />
                </Suspense>
              )}
            </BrowserOnly>
          ) : (
            <div className={styles.chartLoading}>
              Componente no disponible
            </div>
          )}
        </div>
      </div>

      {/* ── ZONA INFERIOR (Ancho completo) ── */}
      <div className={styles.bottomArea}>
        {/* ── DESCRIPCIÓN ── (siempre visible en desktop, togglable en móvil) */}
        <div className={styles.descSection}>
          <button
            className={styles.mobileDescToggle}
            onClick={() => setMobileDescOpen(p => !p)}
            style={{ display: 'none' }}
            data-mobile-toggle="desc"
          >
            {mobileDescOpen ? '▲' : '▼'} {l.whatShows}
          </button>
          <div data-mobile-collapsible="desc">
            <div className={styles.descTitle} style={{ color: '#636E4F' }}>
              &#123;{l.whatShows}&#125;
            </div>
            <div className={styles.descText}>
              {desc.split('\n\n').map((para, i) => (
                <p key={i} className={i === 0 ? styles.firstParagraph : ''}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ── RELEVANCIA FORENSE ── */}
        <div className={styles.relSection} style={{ borderLeftColor: cat.color }}>
          <div className={styles.relTitle} style={{ color: cat.color }}>
            {l.relevance}
          </div>
          <div className={styles.relText}>
            {rel.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* ── NAVEGACIÓN ── */}
        <div className={styles.navButtons}>
          {prev ? (
            <button
              className={styles.navBtn}
              onClick={() => onSelectChart(prev.id)}
            >
              ← {l.prev}
              <span className={styles.navBtnSub}>{prev.title}</span>
            </button>
          ) : <span />}

          {next ? (
            <button
              className={`${styles.navBtn} ${styles.next}`}
              onClick={() => onSelectChart(next.id)}
            >
              {l.next} →
              <span className={styles.navBtnSub}>{next.title}</span>
            </button>
          ) : nextCategoryFirst ? (
            <button
              className={`${styles.navBtn} ${styles.next} ${styles.nextCatBtn}`}
              style={{ borderColor: getCategoryById(nextCategoryFirst.categoryId)?.color }}
              onClick={() => onSelectChart(nextCategoryFirst.id)}
            >
              {l.continueWith} {getCategoryById(nextCategoryFirst.categoryId)?.name} →
              <span className={styles.navBtnSub}>{nextCategoryFirst.title}</span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
