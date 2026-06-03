const fs = require('fs');
const path = require('path');

const translations = {
  'Potencia Real Agregada (MW)': 'Aggregated Actual Power (MW)',
  'Potencia Real (MW)': 'Actual Power (MW)',
  'Activas (>0 MW)': 'Active (>0 MW)',
  'Caídas (0 MW)': 'Tripped (0 MW)',
  'Real (MW)': 'Actual (MW)',
  'Previsto (MW)': 'Forecast (MW)',
  'Costes de Countertrading': 'Countertrading Costs',
  'Costes de Redespacho': 'Redispatching Costs',
  'Otros Costes': 'Other Costs',
  'Precio Diario (€/MWh)': 'Daily Price (€/MWh)',
  'Precio Diario OMIE (€/MWh)': 'Daily OMIE Price (€/MWh)',
  'ES -> FR (Exportación)': 'ES -> FR (Export)',
  'FR -> ES (Importación)': 'FR -> ES (Import)',
  'ES -> PT (Exportación)': 'ES -> PT (Export)',
  'PT -> ES (Importación)': 'PT -> ES (Import)',
  'Capacidad Media (Subida)': 'Avg Capacity (Up)',
  'Capacidad Media (Bajada)': 'Avg Capacity (Down)',
  'Mínimo Registrado (Subida)': 'Min Registered (Up)',
  'Mínimo Registrado (Bajada)': 'Min Registered (Down)',
  'Almacenamiento': 'Storage',
  'Variación Semanal': 'Weekly Variation',
  'Variación': 'Variation',
  'Déficit (Falta Generación)': 'Deficit (Lack of Generation)',
  'Superávit (Exceso Generación)': 'Surplus (Excess Generation)',
  'Precio Imbalance (Máx)': 'Imbalance Price (Max)',
  'Precio Imbalance (€/MWh)': 'Imbalance Price (€/MWh)',
  'Precio (+) Surplus': 'Price (+) Surplus',
  'Precio (-) Deficit': 'Price (-) Deficit',
  'Saldo Francia (ES -> FR)': 'France Balance (ES -> FR)',
  'Saldo Portugal (ES -> PT)': 'Portugal Balance (ES -> PT)',
  'ES Previsión (Day-Ahead)': 'ES Forecast (Day-Ahead)',
  'ES Real (Actual)': 'ES Actual',
  'PT Previsión (Day-Ahead)': 'PT Forecast (Day-Ahead)',
  'PT Real (Actual)': 'PT Actual',
  'Demanda Prevista': 'Forecast Demand',
  'Demanda Programada': 'Scheduled Demand',
  'Demanda Real': 'Actual Demand',
  'Precio PVPC (Minorista)': 'PVPC Price (Retail)',
  'Mercado Mayorista (SPOT)': 'Wholesale Market (SPOT)',
  'Demanda (MW)': 'Demand (MW)',
  'Capacidad (MW)': 'Capacity (MW)',
  'Imbalance (MWh)': 'Imbalance (MWh)',
  'Flujo Físico Neto (MW)': 'Net Physical Flow (MW)',
  'Error de Balance (MW)': 'Balancing Error (MW)',
  'Intercambio Neto Programado (MW)': 'Scheduled Net Exchange (MW)',
  'Hora (UTC)': 'Time (UTC)',
  'Hora': 'Time',
  'Trimestre': 'Quarter',
  'Semana del año': 'Week of the year',
  'Capacidad FRR (MW)': 'FRR Capacity (MW)',
  'Evolución de la Demanda (28-29 Abril)': 'Demand Evolution (Apr 28-29)',
  'Impacto en Mercados y Precios (28-29 Abril)': 'Market & Price Impact (Apr 28-29)',
  'Comparativa de Potencia por Tecnología (28 vs 29 Abril)': 'Power Comparison by Technology (Apr 28 vs 29)',
  'Desglose del Precio Final de Energía (28 Abril)': 'Final Energy Price Breakdown (Apr 28)',
  'Programación Mercado Producción (28 Abril)': 'Production Market Schedule (Apr 28)',
  'Subastas Explícitas de Capacidad': 'Explicit Capacity Auctions',
  '⚡ Apagón (12:33 CEST)': '⚡ Blackout (12:33 CEST)',
  '⚡ Apagón': '⚡ Blackout',
  '⚡ Apagón 28-A': '⚡ 28-A Blackout'
};

const dirs = ['src/components/EntsoeCharts', 'src/components/EsiosCharts'];

dirs.forEach(d => {
  fs.readdirSync(d).forEach(f => {
    if (f.endsWith('.jsx')) {
      const fp = path.join(d, f);
      let c = fs.readFileSync(fp, 'utf8');
      let modified = false;

      // Ensure isEs is defined
      if (!c.includes('const lang = useDocLang()')) {
        c = c.replace(/export default function \w+\([^)]*\)\s*{/, match => match + '\n  const lang = useDocLang();\n  const isEs = lang === \'es\';');
        modified = true;
      }
      if (!c.includes('useDocLang')) {
        c = c.replace('import React', 'import { useDocLang } from \'@site/src/hooks/useDocLang\';\nimport React');
        modified = true;
      }

      for (const [es, en] of Object.entries(translations)) {
        // Safe regex escape
        const safeEs = es.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Replace name="es"
        const nameRegex = new RegExp(`name="(${safeEs})"`, 'g');
        if (nameRegex.test(c)) {
          c = c.replace(nameRegex, `name={isEs ? "$1" : "${en}"}`);
          modified = true;
        }
        
        // Replace label={{ value: 'es' ... (or double quotes)
        const labelRegex1 = new RegExp(`(label=\\{\\{[^}]*value:\\s*)'(${safeEs})'`, 'g');
        if (labelRegex1.test(c)) {
          c = c.replace(labelRegex1, `$1isEs ? '$2' : '${en}'`);
          modified = true;
        }
        const labelRegex2 = new RegExp(`(label=\\{\\{[^}]*value:\\s*)"(${safeEs})"`, 'g');
        if (labelRegex2.test(c)) {
          c = c.replace(labelRegex2, `$1isEs ? "$2" : "${en}"`);
          modified = true;
        }

        // Replace >es< (titles and labels)
        const titleRegex = new RegExp(`>(${safeEs})<`, 'g');
        if (titleRegex.test(c)) {
          c = c.replace(titleRegex, `>{isEs ? '$1' : '${en}'}<`);
          modified = true;
        }

        // Replace value="es"
        const valueAttrRegex = new RegExp(`value="(${safeEs})"`, 'g');
        if (valueAttrRegex.test(c)) {
          c = c.replace(valueAttrRegex, `value={isEs ? "$1" : "${en}"}`);
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fp, c, 'utf8');
        console.log('Updated ' + fp);
      }
    }
  });
});
