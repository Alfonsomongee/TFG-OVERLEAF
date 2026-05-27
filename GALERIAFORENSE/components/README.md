# El Cero de Tensión — Componentes React de Visualización de Datos

5 componentes de visualización de datos listos para Docusaurus v2.4+, para análisis forense del apagón ibérico 28-A (2025).

## 📦 Componentes incluidos

1. **TimelineManoeuvres** — Timeline interactivo de maniobras de control de tensión (09:00-12:32 CEST)
2. **ICSViolationsGrid** — Matriz de violaciones de criterios ICS por TSO
3. **InertiaStackedBar** — Distribución de inercia síncrona por área (barras apiladas)
4. **PowerCapacityComparison** — Potencia disponible vs indisponible por tecnología
5. **LinesAvailability** — Análisis de disponibilidad de red (3 gráficos apilados)

## 🛠 Instalación rápida

### 1. Copia los archivos a tu proyecto Docusaurus

```bash
# Asume estructura: docusaurus/src/components/
cp -r components/ src/components/GaleriaForense/
```

### 2. Instala Recharts (si no lo tienes)

```bash
npm install recharts
```

### 3. Crea datos JSON en `/static/data/processed/`

Coloca estos archivos (o déjalos vacíos para usar fallback):

```
static/
└── data/
    └── processed/
        ├── 28A_demand.json
        ├── 28A_generation_mix.json
        ├── 28A_price.json
        ├── 28A_balance.json
        └── 28A_capacity.json
```

Si los JSONs no existen, **los componentes usan datos hardcodeados automáticamente** ✅

### 4. Usa los componentes en tu página

En una página `.mdx` o `.jsx` de Docusaurus:

```jsx
import BrowserOnly from '@docusaurus/core/lib/client/components/BrowserOnly';
import {
  TimelineManoeuvres,
  ICSViolationsGrid,
  InertiaStackedBar,
  PowerCapacityComparison,
  LinesAvailability,
} from '@site/src/components/GaleriaForense';

export default function AnalisisForecenico() {
  return (
    <>
      <BrowserOnly>
        {() => <TimelineManoeuvres />}
      </BrowserOnly>
      
      <BrowserOnly>
        {() => <ICSViolationsGrid />}
      </BrowserOnly>
      
      <BrowserOnly>
        {() => <InertiaStackedBar />}
      </BrowserOnly>
      
      <BrowserOnly>
        {() => <PowerCapacityComparison />}
      </BrowserOnly>
      
      <BrowserOnly>
        {() => <LinesAvailability />}
      </BrowserOnly>
    </>
  );
}
```

## 🎨 Características técnicas

✅ **React 17+** con hooks (useMemo, useState, memo)  
✅ **Recharts** para gráficos (BarChart, ScatterChart, ComposedChart)  
✅ **CSS Modules** — sin Tailwind, totalmente isolado  
✅ **Responsive** — mobile (380px), tablet (768px), desktop (1200px)  
✅ **Fallback data** — hardcodeado, no depende de JSONs  
✅ **Accesibilidad** — WCAG 2.1 AA (ARIA labels, contrast ≥4.5:1)  
✅ **Animaciones** — suave, 300-800ms (ease-out)  
✅ **Tooltips smart** — hover en desktop, click en mobile  
✅ **Colores exactos** — HSL palette (dark mode + neon accents)  
✅ **Monospace font** — JetBrains Mono / Fira Code / Courier New  

## 🎯 Requisitos

- Node.js 14+
- React 17+ (Docusaurus v2.4 lo incluye)
- Recharts 2.0+
- CSS Modules support (Docusaurus lo incluye)

## 📊 Estructura de datos fallback

Cada componente trae datos hardcodeados. Ejemplo:

```javascript
const FALLBACK_TIMELINE_DATA = [
  {
    hora: '09:02',
    elemento: 'LINE L-400 kV ALMARAZ — SAN SERVÁN 1',
    tipo: 'LINE',
    zona: 'SOUTH',
    movimiento: 'SWITCH ON',
  },
  // ... más eventos
];
```

Si cargas JSONs desde `/data/processed/`, se usan esos en lugar del fallback.

## 🔄 Hook de carga: useRealData

Para cargar datos reales, cada componente usa `useRealData()`:

```javascript
import { useRealData } from './hooks/useRealData';

const { demand, generationMix, price, balance, capacity, ready, errors } = useRealData();

if (!ready) return <div>Cargando...</div>;
if (errors.length > 0) console.warn('Missing:', errors);

const dataToRender = demand ?? FALLBACK_DATA;
```

Los JSONs se buscan en:
- `/data/processed/28A_demand.json`
- `/data/processed/28A_generation_mix.json`
- `/data/processed/28A_price.json`
- `/data/processed/28A_balance.json`
- `/data/processed/28A_capacity.json`

Si alguno falla, la app sigue funcionando con fallback.

## 🎬 Colores exactos (no cambiar)

Todos los componentes usan esta paleta HSL:

| Token | Valor | Uso |
|---|---|---|
| `--gf-bg` | `hsl(220 40% 6%)` | Fondo principal |
| `--gf-accent` | `hsl(190 100% 60%)` | Azul (datos normales) |
| `--gf-warn` | `hsl(38 100% 56%)` | Ámbar (warnings) |
| `--gf-danger` | `hsl(0 75% 58%)` | Rojo (crítico) |
| `--gf-ok` | `hsl(140 60% 50%)` | Verde (recovery) |
| `--gf-text` | `hsl(220 12% 82%)` | Texto principal |
| `--gf-muted` | `hsl(220 12% 48%)` | Texto secundario |
| `--gf-border` | `hsl(220 20% 18%)` | Bordes |

## 📱 Responsive breakpoints

| Breakpoint | Ancho | Comportamiento |
|---|---|---|
| Mobile | <480px | Tooltips click, gráficos stacked, scroll horizontal |
| Tablet | 480-768px | Labels compactos, altura reducida |
| Desktop | ≥768px | Full feature, hover tooltips |

## 🧪 Testing rápido

```bash
# En Docusaurus, navega a la página que incluye los componentes
# Abre DevTools → Console
# No debería haber errores, solo warnings si faltan JSONs

# Verifica responsive
# Chrome DevTools → Toggle Device Toolbar
# Prueba: 380px, 768px, 1200px
```

## 📝 Notas

- **Sin animaciones excesivas**: mood académico/forense (no lúdico)
- **Sin tweaks panel**: sitio técnico, no design explorer
- **Sin Tailwind**: puramente CSS Modules para aislamiento
- **Memoization agresiva**: optimizado para Docusaurus SSR
- **Keyboard accessible**: Tab, Enter, Escape en interacciones

## ⚙️ Troubleshooting

### "Recharts not found"
```bash
npm install recharts
```

### "useRealData undefined"
Asegúrate de que `hooks/useRealData.js` está en el mismo directorio que los componentes.

### "CSS módulos no se aplican"
Docusaurus debe estar configurado con CSS Modules. Por defecto lo está. Si no, verifica `docusaurus.config.js`.

### "Gráficos quedan en blanco"
- Abre DevTools → Console, busca errores
- Verifica que Recharts está instalado
- Asegúrate de que usas `<BrowserOnly>` wrapper

### "Tooltips no funcionan"
En mobile (<480px), los tooltips usan click en lugar de hover. Es intencional. Prueba haciendo tap en un punto del gráfico.

## 📖 Documentación de Recharts

Los componentes usan estos elementos de Recharts:

- **TimelineManoeuvres**: ComposedChart + Scatter
- **ICSViolationsGrid**: CSS Grid (sin Recharts)
- **InertiaStackedBar**: BarChart + Bar (stacked)
- **PowerCapacityComparison**: BarChart + Bar (grouped)
- **LinesAvailability**: BarChart + Bar (múltiples secciones)

Para customizar, ver: https://recharts.org/

## 🚀 Próximos pasos

1. **Integra los JSONs reales** desde tu pipeline de datos
2. **Customiza alertas y anotaciones** según tu análisis
3. **Agrega print-to-PDF** si necesitas reportes (usa `window.print()`)
4. **Deploy a Docusaurus** y verifica en prod

---

**Autor**: Claude Design  
**Proyecto**: El Cero de Tensión — Análisis Forense del Apagón Ibérico 28-A  
**Stack**: React 17+ + Recharts + CSS Modules + Docusaurus v2.4  
**Status**: ✅ Production-ready (fallback data incluido)
