README 

📁 Estructura de archivos a crear
text
tfg_antigravity/
├── api/                          # Serverless functions (Vercel)
│   ├── entsoe-proxy.js
│   └── esios-proxy.js
├── src/
│   ├── pages/
│   │   └── datos-tiempo-real/
│   │       ├── index.js          # Página principal de la sección
│   │       ├── sismografo.jsx
│   │       └── ... (resto)
│   ├── components/
│   │   └── Sismografo.jsx
│   └── lib/
│       └── api.js                # Funciones helper
├── static/
│   └── data/
│       └── frequency_28A.json    # Tu histórico del 28A
└── sidebars.js                   # Añadir nueva categoría
1️⃣ README para Claude / desarrollador
markdown
# Sección "DATOS EN TIEMPO REAL" - Docusaurus

## Objetivo
Crear una nueva sección en la barra lateral de Docusaurus que aloje 10 funcionalidades avanzadas usando datos reales de ESIOS y ENTSO-E, sin depender de Streamlit. Todo el código será React/JavaScript, con gráficas Plotly o recharts.

## Arquitectura técnica

### Tokens
- ESIOS: `59f41cbd500501a872390d7e3d838b29ea20b2e55b3fa96153adf270840b11f5`
- ENTSO-E: `4333453d-1b1c-4631-af54-2f24ad499fa9`

**Seguridad**: Los tokens NO se expondrán en el cliente. Se usarán **serverless functions** (Vercel) como proxy. El frontend llama a `/api/esios-proxy?indicator=1293` y la función añade la cabecera `x-api-key` o el token en la URL.

### Serverless functions (carpeta `api/` en la raíz)
- `esios-proxy.js` → recibe `indicator`, llama a ESIOS, devuelve JSON.
- `entsoe-proxy.js` → recibe parámetros (documentType, etc.), llama a ENTSO-E, devuelve XML o JSON parseado.

### Páginas
Cada funcionalidad será una página independiente en `src/pages/datos-tiempo-real/`.
La página principal (`index.js`) mostrará tarjetas con enlaces a cada funcionalidad.

### Componentes reutilizables
- `Sismografo.jsx`: gráfico de frecuencia (actual vs histórico) con eventos.
- Se irán añadiendo más: `DetectorPatrones.jsx`, `IndiceEstres.jsx`, etc.

## Instalación de dependencias
```bash
cd tfg_antigravity
npm install plotly.js react-plotly.js axios
Configuración de Vercel (para serverless)
El proyecto ya está desplegado en Vercel. Las funciones en api/ se desplegarán automáticamente. No requiere configuración adicional.

Sidebar
Editar sidebars.js y añadir la nueva categoría (ver ejemplo abajo).

Orden de implementación
Configurar serverless functions (ESIOS y ENTSO-E)

Crear página datos-tiempo-real/index.js con tarjetas

Implementar Sismografo.jsx (funcionalidad 1)

Probar localmente (vercel dev o npm run start)

Desplegar a Vercel

Repetir para las siguientes funcionalidades

Nota sobre CORS
Las serverless functions eliminan los problemas de CORS y ocultan los tokens. El frontend solo se comunica con sus propias funciones.

text

---

## 2️⃣ Serverless function para ESIOS

Crea `api/esios-proxy.js`:

```javascript
export default async function handler(req, res) {
  const { indicator } = req.query;
  if (!indicator) {
    return res.status(400).json({ error: 'Missing indicator parameter' });
  }
  
  const token = '59f41cbd500501a872390d7e3d838b29ea20b2e55b3fa96153adf270840b11f5';
  const url = `https://api.esios.ree.es/indicators/${indicator}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'x-api-key': token
      }
    });
    const data = await response.json();
    const lastValue = data.indicator.values[data.indicator.values.length - 1]?.value;
    res.status(200).json({ indicator, value: lastValue, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
3️⃣ Serverless function para ENTSO-E (frecuencia)
Crea api/entsoe-frequency.js:

javascript
export default async function handler(req, res) {
  const token = '4333453d-1b1c-4631-af54-2f24ad499fa9';
  const now = new Date();
  const end = now.toISOString().slice(0, 16).replace(/-|:|T/g, ''); // YYYYMMDDHHMM
  const start = new Date(now - 60 * 60 * 1000).toISOString().slice(0, 16).replace(/-|:|T/g, '');
  
  const url = `https://transparency.entsoe.eu/api?securityToken=${token}&documentType=A82&processType=A16&Area_Domain=10YES-REE------0&periodStart=${start}&periodEnd=${end}`;
  
  try {
    const response = await fetch(url);
    const xmlText = await response.text();
    
    // Parseo simple del XML (extraer puntos)
    const matches = [...xmlText.matchAll(/<position>(\d+)<\/position>\s*<quantity>([\d\.]+)<\/quantity>/g)];
    const points = matches.map(m => ({ position: parseInt(m[1]), quantity: parseFloat(m[2]) }));
    
    // Asignar tiempos aproximados
    const startDate = new Date(now.getTime() - 60 * 60 * 1000);
    const data = points.map(p => ({
      time: new Date(startDate.getTime() + (p.position - 1) * 60 * 1000).toISOString(),
      frequency: p.quantity
    }));
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}