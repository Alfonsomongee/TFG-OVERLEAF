<!-- README.md -->
# LATERAL BAR — Sidebar Navigation para Documental 28-A

Componente React listo para integrar en Docusaurus o cualquier proyecto React.

## 📦 Archivos

```
LateralBar.jsx          → Componente principal (importar en tu layout)
SidebarCategory.jsx     → Componentes reutilizables (Category, CategoryItem, NavItem)
SidebarIcons.jsx        → 8 iconos SVG minimalistas (Lucide-style)
sidebar.css             → Estilos CSS (importar en LateralBar.jsx)
```

## 🚀 Instalación rápida

### 1. Copiar archivos a tu proyecto

```bash
src/components/
├── LateralBar.jsx
├── SidebarCategory.jsx
├── SidebarIcons.jsx
└── sidebar.css
```

### 2. Importar en tu layout

```jsx
// pages/DocLayout.jsx o swizzle/DocLayout/index.js (Docusaurus)
import LateralBar from '@/components/LateralBar';

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <LateralBar 
        activePage={currentPageId}
        onPageChange={(pageId) => navigate(`/${pageId}`)}
      />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
```

### 3. Asegurar que tienes las fuentes

En tu `index.html` o `_app.jsx`:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

O instala localmente:

```bash
npm install @fontsource/jetbrains-mono @fontsource/inter
```

```jsx
import '@fontsource/jetbrains-mono';
import '@fontsource/inter';
```

## 🎨 Diseño

| Elemento | Valor |
|----------|-------|
| **Ancho** | 300px (fijo) |
| **Fondo** | #0a0a0a (casi negro) |
| **Ámbar activo** | #FFB800 |
| **Scanlines** | 2% opacidad |
| **Scroll** | 4px, oculto, visible en hover |
| **Tipografía** | Inter (sans) + JetBrains Mono (mono) |
| **Iconos** | SVG inline, 16×16, stroke 1.5 |

## 🔧 Props de `<LateralBar />`

```jsx
<LateralBar 
  activePage="colapso-frecuencia"    // ID de la página actual
  onPageChange={(id) => {...}}        // Callback cuando el usuario hace click
/>
```

## 📋 Estructura de navegación

```
Introducción
Contexto Técnico

⚡ ANÁLISIS DEL INCIDENTE (acordeón expandido)
  ├─ Análisis del Incidente
  ├─ Reacción y Reposición
  └─ Impacto Comunicativo

📊 ANÁLISIS TÉCNICO (acordeón expandido)
  ├─ Análisis de los Informes Oficiales
  └─ Colapso de Frecuencia  ← ACTIVO POR DEFECTO

🎮 EXPERIMENTACIÓN INTERACTIVA (acordeón expandido, ALERTA ROJA)
  └─ Simulador: Ecuación del Swing

🔮 FUTURO Y RESILIENCIA (acordeón contraído)
  ├─ Resiliencia y Futuro
  └─ Consecuencias Financieras

🛠️ MÉTODOS Y ACTUALIZACIONES (acordeón contraído)
  ├─ Uso de Inteligencia Artificial
  └─ Actualización 2026

Conclusiones

🌍 DIMENSIÓN EUROPEA (acordeón contraído)
  ├─ Francia y Portugal
  ├─ Coordinación Continental
  └─ El Día Después

📚 REFERENCIA (acordeón contraído)
  ├─ Glosario Técnico
  └─ Referencias y Bibliografía

📈 VISUALIZACIONES (acordeón contraído)
  ├─ Cronograma del Incidente
  ├─ Galería de Gráficas
  └─ Galería de Imágenes

Descargas y Documentación
Sobre el Autor
```

## 🎯 Características

- ✅ **Acordeón clásico** — múltiples categorías pueden estar abiertas
- ✅ **Scroll independiente** — overscroll-behavior: contain
- ✅ **Iconos SVG minimalistas** — Lucide-style, sin emojis
- ✅ **Alerta visual** — EXPERIMENTACIÓN INTERACTIVA con tinte rojo
- ✅ **Estado activo claro** — borde ámbar + fondo ámbar/5
- ✅ **Scanlines telemetría** — patrón sutil de líneas
- ✅ **Responsive a fuentes** — usa CSS custom properties

## 🔌 Customización

### Cambiar color ámbar

En `sidebar.css`, línea 8:

```css
--amber-electric: #FFB800;  /* Cambiar a otro valor */
```

### Cambiar ancho

En `sidebar.css`, línea 14:

```css
width: 300px;  /* Cambiar a 280px, 320px, etc. */
```

### Cambiar intensidad de scanlines

En `sidebar.css`, línea 9:

```css
--scanline-opacity: 0.02;  /* 0.02 = 2%, cambiar a 0.03, 0.01, etc. */
```

### Agregar más categorías

En `LateralBar.jsx`, agrega un nuevo estado en `expandedCategories` y copia un bloque `<Category>`:

```jsx
const [expandedCategories, setExpandedCategories] = useState({
  // ... existentes
  miCategoria: true,  // ← Agregar
});

// En el JSX:
<Category
  title="🆕 Mi Categoría"
  icon={MiIcono}
  isOpen={expandedCategories.miCategoria}
  onToggle={() => toggleCategory('miCategoria')}
>
  <CategoryItem label="Ítem 1" isActive={...} onClick={...} />
</Category>
```

## 📱 Responsive

Por defecto, la barra ocupa **300px fijo**. Para móvil, envuélvela en un media query o usa una hamburguesa:

```css
@media (max-width: 768px) {
  .lateral-bar {
    width: 100%;
    height: auto;
    position: fixed;
    left: -100%;
    transition: left 0.3s ease;
    z-index: 1000;
  }
  
  .lateral-bar.open {
    left: 0;
  }
}
```

## 🐛 Troubleshooting

**Las fuentes no se ven correctamente**  
→ Asegúrate de tener `@font-face` o Google Fonts importadas.

**El ámbar no brilla suficiente**  
→ Cambia `--amber-electric` en `sidebar.css` a `#FFC300` o `#FFD700`.

**El scroll no se ve**  
→ Pasa el mouse sobre la barra. El scrollbar es invisible por defecto.

**Los iconos se ven pixelados**  
→ Asegúrate de que el navegador soporta SVG inline (todos los modernos lo hacen).

## 📄 Licencia

Diseño de Alfonso Monge Díaz-Ángel para el documental 28-A.
