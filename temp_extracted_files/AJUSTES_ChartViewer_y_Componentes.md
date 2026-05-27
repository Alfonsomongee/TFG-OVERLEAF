# ⚙️ AJUSTES EN ChartViewer.jsx

El CSS Grid corregido solo funciona bien si tus componentes de gráficas Recharts están correctamente estructurados. Aquí están los ajustes específicos.

---

## 1. Estructura del ChartViewer

### ANTES ❌
```jsx
export default function ChartViewer({ chartId, locale, onSelectChart }) {
  // ... código ...
  
  return (
    <>
      <div className={styles.chartArea}>
        {/* Header */}
        
        <div className={styles.chartContainer}>
          {ChartComponent ? (
            <ChartComponent />
          ) : (
            <div>Componente no disponible</div>
          )}
        </div>
      </div>
      
      {/* Bottom Area - pero fuera del chartArea */}
      <div className={styles.bottomArea}>
        {/* ... */}
      </div>
    </>
  );
}

PROBLEMA:
- ChartComponent podría no tener ResponsiveContainer
- chartContainer podría tener altura indefinida
- Estructura HTML no está optimizada para CSS Grid
```

### DESPUÉS ✅
```jsx
export default function ChartViewer({ chartId, locale, onSelectChart }) {
  const chart = CHARTS.find(c => c.id === chartId);
  const l = UI_LABELS[locale] || UI_LABELS.es;
  const [mobileDescOpen, setMobileDescOpen] = useState(false);
  const [mobileRelOpen, setMobileRelOpen] = useState(false);
  
  if (!chart) return null;
  
  const cat = getCategoryById(chart.categoryId);
  const { prev, next, nextCategoryFirst } = getAdjacentCharts(chartId);
  const ChartComponent = COMPONENT_MAP[chart.component];
  
  const desc = chart[`desc_${locale}`] || chart.desc || '';
  const rel  = chart[`rel_${locale}`]  || chart.rel  || '';
  
  return (
    <>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* ZONA DERECHA (Grid Row 1) - Chart Area */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className={styles.chartArea}>
        {/* ─── HEADER ─── */}
        <div className={styles.chartHeader}>
          <div className={styles.chartHeaderTop}>
            <h2 className={styles.chartTitle}>{chart.fullTitle}</h2>
          </div>
          
          {chart.subtitle && (
            <div className={styles.chartSubtitle}>{chart.subtitle}</div>
          )}
          
          <div className={styles.chartHeaderMeta}>
            <span
              className={`${styles.sourceBadge} ${
                chart.sourceBadge === 'ESIOS' ? styles.esios : styles.entsoe
              }`}
            >
              {chart.sourceBadge}
            </span>
            <span className={styles.techCode}>{chart.techCode}</span>
          </div>
        </div>
        
        {/* ─── CHART CONTAINER (Este es clave) ─── */}
        <div className={styles.chartContainer}>
          {ChartComponent ? (
            <ChartComponent />
          ) : (
            <ChartLoadingFallback 
              color={cat?.color || '#ffaa00'} 
            />
          )}
        </div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* ZONA INFERIOR (Grid Row 2) - Bottom Area */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className={styles.bottomArea}>
        {/* ─── DESCRIPCIÓN ─── */}
        <div className={styles.descSection}>
          {/* Mobile toggle (solo visible en móvil) */}
          <button
            className={styles.mobileDescToggle}
            onClick={() => setMobileDescOpen(p => !p)}
            aria-expanded={mobileDescOpen}
            aria-controls="desc-content"
          >
            {mobileDescOpen ? '▲' : '▼'} {l.whatShows}
          </button>
          
          {/* Contenedor colapsable en móvil */}
          <div 
            id="desc-content"
            data-mobile-collapsible="desc"
            className={mobileDescOpen ? styles.contentOpen : ''}
          >
            <div className={styles.descTitle}>{l.whatShows}</div>
            <div className={styles.descText}>
              {desc.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
        
        {/* ─── RELEVANCIA FORENSE ─── */}
        <div 
          className={styles.relSection}
          style={{ borderLeftColor: cat?.color || '#ffaa00' }}
        >
          <div 
            className={styles.relTitle}
            style={{ color: cat?.color || '#ffaa00' }}
          >
            {l.relevance}
          </div>
          <div className={styles.relText}>
            {rel.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
        
        {/* ─── NAVEGACIÓN ─── */}
        <div className={styles.navButtons}>
          {prev ? (
            <button
              className={styles.navBtn}
              onClick={() => onSelectChart(prev.id)}
              title={`Ir a: ${prev.title}`}
            >
              ← {l.prev}
              <span className={styles.navBtnSub}>{prev.title}</span>
            </button>
          ) : (
            <div /> /* Placeholder para mantener flexbox */
          )}
          
          {next ? (
            <button
              className={`${styles.navBtn} ${styles.next}`}
              onClick={() => onSelectChart(next.id)}
              title={`Ir a: ${next.title}`}
            >
              {l.next} →
              <span className={styles.navBtnSub}>{next.title}</span>
            </button>
          ) : nextCategoryFirst ? (
            <button
              className={`${styles.navBtn} ${styles.next} ${styles.nextCatBtn}`}
              style={{ borderColor: getCategoryById(nextCategoryFirst.categoryId)?.color }}
              onClick={() => onSelectChart(nextCategoryFirst.id)}
              title={`Ir a categoría: ${getCategoryById(nextCategoryFirst.categoryId)?.name}`}
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
```

---

## 2. Estructura de Componentes de Gráficas (Ejemplos)

Cada componente de gráfica (DemandaChart, ProgramacionChart, etc.) DEBE tener esta estructura:

### ANTES ❌
```jsx
// DemandaChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function DemandaChart() {
  const [data, setData] = React.useState([]);
  
  React.useEffect(() => {
    // fetch data...
  }, []);
  
  return (
    <LineChart width={600} height={400} data={data}>
      {/* ❌ width y height hardcoded */}
      {/* ❌ No usa ResponsiveContainer */}
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}

PROBLEMA:
- width={600} height={400} es fijo
- Si el contenedor es más pequeño/grande, no se adapta
- ResponsiveContainer no está siendo usado
```

### DESPUÉS ✅
```jsx
// DemandaChart.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function DemandaChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/esios/demanda.json');
        const json = await response.json();
        // Procesar datos si es necesario
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>Sin datos</div>;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* ✅ ResponsiveContainer envuelve todo */}
      {/* ✅ width="100%" y height="100%" del contenedor padre */}
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        {/* ❌ NO hardcodear width/height aquí */}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          label={{ value: 'MW', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc'
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="demanda"
          stroke="#8884d8"
          isAnimationActive={false}
          {/* ✅ isAnimationActive={false} ayuda al rendimiento */}
          dot={false}
          {/* ✅ dot={false} reduce elementos del DOM */}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 3. Template para Todas las Gráficas

Usa este template para asegurar que todos tus componentes funcionan:

```jsx
// Template: [NombreChart].jsx
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,      // O: BarChart, AreaChart, etc.
  Line,           // O: Bar, Area, etc.
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

/**
 * [NombreChart]
 * 
 * Visualiza: [Descripción de qué muestra]
 * Datos: [API o JSON]
 * 
 * IMPORTANTE: Este componente DEBE estar dentro de un
 * contenedor con width y height definidos (como .chartContainer)
 * para que ResponsiveContainer funcione correctamente.
 */
export default function [NombreChart]() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch datos
        const response = await fetch('/data/path/to/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 2. Parse JSON
        const json = await response.json();
        
        // 3. Transformar si es necesario
        const transformed = json.map(item => ({
          ...item,
          // Añade transformaciones aquí
        }));
        
        setData(transformed);
      } catch (err) {
        console.error('[NombreChart] Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Estados de carga/error
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#999'
      }}>
        Cargando gráfica...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#c33'
      }}>
        Error: {error}
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#999'
      }}>
        Sin datos disponibles
      </div>
    );
  }
  
  // Render de la gráfica
  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* ✅ CLAVE: ResponsiveContainer con 100% 100% */}
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        {/* ✅ margin para que etiquetas no se corten */}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--ifm-color-emphasis-200)"
        />
        
        <XAxis
          dataKey="timestamp"
          {/* o dataKey="hora" o lo que uses */}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
          {/* ✅ height aumentado para que quepan etiquetas */}
        />
        
        <YAxis
          tick={{ fontSize: 12 }}
          label={{
            value: 'MW',
            angle: -90,
            position: 'insideLeft',
            offset: 10
          }}
        />
        
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--ifm-color-emphasis-200)',
            borderRadius: '4px'
          }}
          labelFormatter={(value) => `Hora: ${value}`}
          {/* ✅ Formatea las etiquetas del tooltip */}
        />
        
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          {/* ✅ Separación para legend */}
        />
        
        <Line
          type="monotone"
          dataKey="demanda"
          {/* ✅ Debe existir esta clave en tus datos */}
          stroke="#8884d8"
          dot={false}
          {/* ❌ NO usar dot={true} si tienes muchos datos */}
          isAnimationActive={false}
          {/* ✅ Desactiva animación para mejor rendimiento */}
        />
        
        {/* Añade más Line, Bar, etc. según necesites */}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## 4. Checklist para Cada Gráfica

Antes de considerar que una gráfica está lista, verifica:

- [ ] ¿Tiene `<ResponsiveContainer width="100%" height="100%">`?
- [ ] ¿NO tiene `width={600}` o `height={400}` hardcodeados?
- [ ] ¿Está dentro de un contenedor `.chartContainer` con width y height?
- [ ] ¿El data fetch está en `useEffect`?
- [ ] ¿Maneja estados de loading/error?
- [ ] ¿Los datos se transforman correctamente?
- [ ] ¿Las claves de datos (`dataKey="xxx"`) existen en tus datos?
- [ ] ¿Tiene `isAnimationActive={false}` si hay muchos datos?
- [ ] ¿El margin es adecuado para etiquetas?
- [ ] ¿Se ve bien en desktop, tablet y móvil?

---

## 5. Debugging de ResponsiveContainer

Si ResponsiveContainer no funciona (la gráfica se ve vacía o incorrecta):

### Paso 1: Verificar dimensiones del contenedor
```javascript
// En la consola del navegador:
const container = document.querySelector('.chartContainer');
const rect = container.getBoundingClientRect();
console.log('Container size:', {
  width: rect.width,
  height: rect.height,
  clientWidth: container.clientWidth,
  clientHeight: container.clientHeight
});

// Resultado esperado: width > 0 y height > 0
// Si ves 0 en ambos: El contenedor no tiene dimensiones (problema de CSS Grid)
```

### Paso 2: Verificar que ResponsiveContainer está renderizado
```javascript
// En la consola:
const responsive = document.querySelector('[role="img"]');
// ResponsiveContainer SVG debe estar aquí
if (responsive) {
  console.log('ResponsiveContainer encontrado:', responsive);
  console.log('SVG size:', {
    width: responsive.getAttribute('width'),
    height: responsive.getAttribute('height')
  });
} else {
  console.log('ERROR: ResponsiveContainer no está en el DOM');
}
```

### Paso 3: Verificar datos
```javascript
// En tu componente, añade temporalmente:
useEffect(() => {
  console.log('Datos cargados:', data);
  console.log('Número de registros:', data?.length);
  if (data && data.length > 0) {
    console.log('Primer registro:', data[0]);
    console.log('Claves disponibles:', Object.keys(data[0]));
  }
}, [data]);
```

Si los datos tienen `{ timestamp: "2024-01-01", value: 100 }` pero tu LineChart usa `dataKey="demanda"`, no funcionará.

### Paso 4: Temporal debug CSS
```css
/* Añade temporalmente al CSS del componente */
.chartContainer {
  background: red;  /* Deberías ver rojo si el container existe */
}

/* En tu componente Recharts */
<LineChart style={{ background: 'blue' }}>
  {/* Si ves azul, ResponsiveContainer renderizó */}
</LineChart>
```

Si ves rojo pero NO azul: ResponsiveContainer no está renderizando (problema en el componente)
Si ves azul pero la gráfica está vacía: Problema en los datos o dataKey

---

## 6. Ejemplo Completo: DemandaChart

```jsx
// src/components/EsiosCharts/DemandaChart.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function DemandaChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/esios/demanda.json');
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        
        const json = await response.json();
        
        // Transformar datos al formato que Recharts espera
        const transformed = json.map(item => ({
          timestamp: new Date(item.datetime).toLocaleTimeString('es-ES'),
          demanda: item.demanda_real,
          previsión: item.demanda_prevista
        }));
        
        setData(transformed);
      } catch (err) {
        console.error('DemandaChart fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>Error: {error}</p>;
  if (!data || data.length === 0) return <p style={{ textAlign: 'center', padding: '2rem' }}>Sin datos</p>;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          angle={-45}
          textAnchor="end"
          height={100}
        />
        <YAxis
          label={{ value: 'MW', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="demanda"
          stroke="#ff7300"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="previsión"
          stroke="#8884d8"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

---

## Resumen

Para que ResponsiveContainer funcione:
1. ✅ El componente gráfica debe tener `<ResponsiveContainer width="100%" height="100%">`
2. ✅ El contenedor padre (`.chartContainer`) debe tener `width: 100%` y `height: 100%`
3. ✅ El Grid CSS debe dar altura real a `.chartArea` (grid-template-rows: 1fr auto)
4. ✅ Los datos deben estar en el formato correcto
5. ✅ Las claves de datos (`dataKey`) deben coincidir con tus datos reales

Si todos estos puntos están OK, tu gráfica funcionará perfectamente en todos los tamaños de pantalla. 🎉
