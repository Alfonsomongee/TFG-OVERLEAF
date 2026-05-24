# ExecutiveHook.jsx — Integración en Docusaurus

## 📋 Pasos de instalación

### 1. Copiar el componente
```bash
# Coloca ExecutiveHook.jsx en tu proyecto:
src/components/ExecutiveHook/ExecutiveHook.jsx
```

### 2. Agregar Google Fonts a docusaurus.config.js
Añade esto al array `stylesheets` en tu `docusaurus.config.js`:

```javascript
stylesheets: [
  {
    href: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Playfair+Display:ital@0;1&display=swap',
    type: 'text/css',
    rel: 'stylesheet',
  },
],
```

### 3. Importar y usar en tu layout raíz (con BrowserOnly)
En `src/theme/Layout/index.js` (o tu layout principal):

```jsx
import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutiveHook from '@site/src/components/ExecutiveHook/ExecutiveHook';

export default function Layout(props) {
  return (
    <>
      <BrowserOnly>
        {() => <ExecutiveHook />}
      </BrowserOnly>
      {/* rest of layout */}
    </>
  );
}
```

O en `src/pages/index.js` (home page):

```jsx
import BrowserOnly from '@docusaurus/BrowserOnly';
import ExecutiveHook from '@site/src/components/ExecutiveHook/ExecutiveHook';

export default function Home() {
  return (
    <>
      <BrowserOnly>
        {() => <ExecutiveHook />}
      </BrowserOnly>
      <main>
        {/* tu contenido */}
      </main>
    </>
  );
}
```

**¿Por qué BrowserOnly?**
- El componente usa `sessionStorage`, que no existe en el servidor (SSR)
- `BrowserOnly` asegura que el componente solo se renderice en el navegador

### 4. Asegurar que framer-motion está instalado
```bash
npm install framer-motion
# o
yarn add framer-motion
```

---

## ⚙️ Configuración técnica

- **sessionStorage**: El splash solo se muestra UNA VEZ por sesión de navegador
- **z-index: 9999**: Aparece encima de todo
- **Responsive**: Usa `clamp()` para escalar automáticamente en móvil/tablet/desktop
- **Duración total**: 6 segundos (fade out incluido)
- **Sin dependencias de assets**: Funciona sin imágenes

---

## 🎬 Flujo de animación

| Tiempo | Evento | Duración |
|--------|--------|----------|
| 0.2s | "IBERIAN BLACKOUT 2025" fade-in + deblur | 1.2s |
| 1.5s | "Forensic Analysis..." aparece | 0.9s |
| 2.8s | "Alfonso Monge" aparece | 0.8s |
| 5.2s | Toda la pantalla comienza fade-out | 0.8s |
| 6.0s | Componente desmonta, sessionStorage guardado | — |

---

## 🛠️ Troubleshooting

**El splash no aparece:**
- Limpia `sessionStorage` en DevTools (Application → Storage → Session Storage → Delete all)
- Recarga la página

**Las fuentes se ven mal:**
- Abre DevTools → Network y verifica que Google Fonts se carga
- Si ves FOUT (Flash of Unstyled Text), es normal — durará <1s

**El splash aparece pero sin animaciones:**
- Verifica que `framer-motion` está en `package.json`
- Ejecuta `npm install` de nuevo

**Error: "sessionStorage is not defined":**
- Asegúrate de usar `BrowserOnly` en el layout
- El componente ya tiene el check `if (typeof window === 'undefined') return;`

---

## 📞 Contacto
Si hay problemas, revisa la consola (DevTools → Console) para logs de error.
