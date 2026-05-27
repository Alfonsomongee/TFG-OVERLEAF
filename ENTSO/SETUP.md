# ENTSO-E Dashboard — Instrucciones de Despliegue
## Integración de datos en vivo de ENTSO-E Transparency Platform en el TFG

---

## 📋 Resumen

Este dashboard conecta a **ENTSO-E Transparency Platform** (la plataforma oficial europea de datos de red eléctrica) para mostrar:

- **Generación actual** (España) — indicador A65 ENTSO-E
- **Demanda actual** (España) — indicador A71 ENTSO-E
- **Comparativa con el 28-A** — datos del Informe Factual ENTSO-E

**Ventajas sobre ESIOS:**
- ✅ ENTSO-E es la fuente oficial que citan REE, ICAI, NREL en el TFG
- ✅ Datos públicos, financiados por la UE
- ✅ Argumento académico fuerte: *«datos en vivo proceden de la misma plataforma que fundamenta el análisis del incidente»*
- ✅ Token gratuito (5 minutos para obtenerlo)
- ✅ Sin dependencias comerciales

---

## 🔑 Paso 1 — Obtener el token ENTSO-E (5 minutos)

1. Ir a **https://web-api.tp.entsoe.eu/api**
2. Hacer clic en **Register** (esquina superior derecha)
3. Rellenar formulario:
   - Email: tu email institucional
   - Password: contraseña segura
   - Organization: `Universidad / Centro` (el tuyo)
   - Aceptar términos
4. Confirmar email (verifica tu inbox)
5. Login → **My API Tokens** → **Generate New Token**
6. Copiar el string largo (será algo como `abcd1234ef567...`)

**Guardar en un lugar seguro** — nunca en el código.

---

## 📦 Paso 2 — Copiar archivos al repositorio

```bash
# Edge Function (va en la raíz del proyecto, junto a vercel.json)
cp api/entsoe.js tu-proyecto/api/entsoe.js

# Hook personalizado
cp src/hooks/useENTSOE.js tu-proyecto/src/hooks/useENTSOE.js

# Componente + estilos
cp -r src/components/ENTSOEDashboard/ tu-proyecto/src/components/ENTSOEDashboard/
```

---

## 🔐 Paso 3 — Configurar el token en Vercel (CRÍTICO)

1. Ir a **https://vercel.com** → tu proyecto TFG → **Settings**
2. Ir a **Environment Variables**
3. Crear nueva variable:
   - **Name:** `ENTSOE_API_KEY`
   - **Value:** [el token que obtuviste en Paso 1]
   - **Environments:** Production, Preview, Development
4. Guardar

**NUNCA** pegar el token en código, `.env.local`, o commits.

Para desarrollo local, crear `.env.local` en la raíz (ya debe estar en `.gitignore`):
```
ENTSOE_API_KEY=tu_token_aqui
```

---

## 📝 Paso 4 — Registrar el componente en MDXComponents

En `src/theme/MDXComponents.js`:

```js
import ENTSOEDashboard from '@site/src/components/ENTSOEDashboard/ENTSOEDashboard';

export default {
  ...MDXComponents,
  ChartCard,
  GlitchTitle,
  ForensicReveal,
  ENTSOEDashboard,  // ← añadir esta línea
};
```

---

## 🎯 Paso 5 — Usar en un capítulo MDX

Ejemplo en el capítulo de **Contexto Técnico** o **Análisis del Incidente**:

```mdx
## Estructura actual de la red ibérica

A continuación, los datos en vivo de la red peninsular española, obtenidos
directamente de la plataforma de transparencia de ENTSO-E que es fuente oficial
del análisis del incidente del 28 de abril:

<ENTSOEDashboard />

### Análisis comparativo

Como se muestra en el panel «Ahora vs. 28-A», los parámetros de estabilidad
del sistema ibérico reproducen periódicamente las condiciones que precedieron
al colapso:
- Demanda en rango de 20-27 GW
- Generación con penetración renovable >70%
- Ratio demanda/generación entre 0,85 y 0,92
```

---

## ✅ Paso 6 — Verificar que funciona

Después de hacer **git push** y que Vercel desplegue:

### Test 1: Edge Function
```
https://tu-dominio.vercel.app/api/entsoe?type=generation&area=ES&hours=24
```

Debe devolver JSON limpio:
```json
{
  "type": "generation",
  "area": "ES",
  "unit": "MW",
  "timeseries": [
    { "datetime": "2025-...", "value": 28450, "position": 1 },
    ...
  ],
  "fetched_at": "2025-..."
}
```

### Test 2: Componente
- Navegar a la página que incluye `<ENTSOEDashboard />`
- Debe verse cargando (~2s) y luego mostrar datos
- Verificar que hay **tres paneles**: Generación, Demanda, Comparativa
- Hacer clic en las pestañas para cambiar entre vistas

---

## 🔍 Solución de problemas

| Síntoma | Causa | Solución |
|---|---|---|
| **Error 500 en `/api/entsoe`** | Token no configurado | Ir a Vercel Settings → Env Vars, verificar `ENTSOE_API_KEY` |
| **Error 401/403 en la respuesta** | Token expirado o incorrecto | Regenerar token en https://web-api.tp.entsoe.eu/api |
| **El componente muestra "—" (sin datos)** | El parsing XML falló | Verificar logs de Edge Function en Vercel → Deployments → Function Logs |
| **CORS error en navegador** | Dominio no en whitelist | Editar `api/entsoe.js`, añadir dominio a `allowedOrigins` |
| **Datos del 28-A no coinciden con fuentes** | Hardcodeados en `useENTSOE.js` | Verificar valores en `SNAPSHOT_28A` contra Informe Factual ENTSO-E |

---

## 📊 Indicadores disponibles

La Edge Function soporta estos indicadores ENTSO-E:

| Parámetro | Documenttype | Descripción |
|---|---|---|
| `type=generation` | A65 | **Actual Generation per Production Type** — generación actual por tecnología |
| `type=demand` | A71 | **Total Load - Day Ahead / Actual** — demanda total horaria |
| `type=load` | A73 | **Total Load - Actual Aggregated** — carga total consolidada |

Para España: `area=ES` (dominio: `10YES-REE------0`)  
Para Portugal: `area=PT` (dominio: `10YPT-REN------W`)

---

## 🎓 Argumento académico

En tu defensa, puedes citar:

> *«Los indicadores en vivo del sistema ibérico proceden directamente de la
> plataforma de transparencia oficial de ENTSO-E (European Network of
> Transmission System Operators for Electricity), que es la misma fuente
> primaria utilizada en el Informe Factual que soporta el análisis técnico
> de este trabajo. Esto garantiza coherencia entre los datos históricos del
> 28 de abril y los parámetros operacionales contemporáneos.»*

---

## 🛠️ Customización

### Cambiar frecuencia de polling

En `src/components/ENTSOEDashboard/ENTSOEDashboard.jsx`, modificar los hooks:

```js
// Cada 5 minutos (300.000 ms)
const { data, loading } = useENTSOEData('generation', 'ES', 300_000, 24);

// Cambiar a 2 minutos:
const { data, loading } = useENTSOEData('generation', 'ES', 120_000, 24);
```

### Añadir datos de Portugal

En el panel de Comparativa, añadir un hook adicional:

```js
const { data: demandPT, loading: demandPTLoading } = useENTSOEData('demand', 'PT', 300_000, 24);
const demandPTNow = getLatestValue(demandPT);
```

Luego añadir una fila `<CompRow>` para mostrar demanda Portugal.

---

## 📚 Referencias

- **ENTSO-E Transparency Platform:** https://transparency.entsoe.eu/
- **API Web:** https://web-api.tp.entsoe.eu/api
- **ENTSO-E GL Messagning Standards:** https://www.entsoe.eu/data/
- **Informe Factual 28-A:** https://www.entsoe.eu/publications/ (búscar "Iberian")

---

## 🚀 Siguiente paso

Una vez confirmado que funciona, puedes:
1. Integrar datos de **OMIE** (precios spot) en un componente adicional
2. Añadir **alertas visuales** si parámetros se acercan a valores del 28-A
3. Crear un **histórico** de últimas 7 días para ver patrones

Para soporte técnico, revisar logs en Vercel → Project → Deployments → última versión → Function Logs.
