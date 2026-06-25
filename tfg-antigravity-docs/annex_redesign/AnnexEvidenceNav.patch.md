# AnnexEvidenceNav.jsx — 1 cambio

## Cambio · getNavLabel — acortar el label de la barra

BUSCAR:
```js
  const getNavLabel = (l) => {
    switch (l) {
      case 'en': return 'Explore evidence';
      case 'de': return 'Nachweise erkunden';
      case 'zh-Hans': return '浏览证据';
      default: return 'Explorar evidencias';
    }
  };
```

REEMPLAZAR CON:
```js
  const getNavLabel = (l) => {
    switch (l) {
      case 'en': return 'Sections';
      case 'de': return 'Abschnitte';
      case 'zh-Hans': return '章节';
      default: return 'Secciones';
    }
  };
```

Justificación: "Explorar evidencias" es imperativo y ocupa demasiado espacio
visual. "Secciones" describe sin mandar.
