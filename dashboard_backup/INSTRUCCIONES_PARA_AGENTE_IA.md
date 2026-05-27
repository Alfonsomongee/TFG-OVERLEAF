# 📋 Instrucciones para tu Agente de IA

Este documento explica qué tiene que hacer tu agente IA con los archivos del dashboard.

---

## ✅ Quick Start (opción más fácil)

Tu agente IA debe hacer esto:

```bash
# 1. Extraer el ZIP en el directorio del proyecto
unzip dashboard_electrico.zip
cd dashboard_electrico

# 2. Ejecutar setup (interactivo)
python setup.py

# 3. Cuando te pida tokens:
#    - Token ESIOS: pega tu token de REE
#    - Token ENTSOE: déjalo vacío por ahora (o escribe "pendiente por email")
#    - Modelo: presiona ENTER (phi3:mini es el default)

# 4. Setup hace automáticamente:
#    ✅ Verifica archivos
#    ✅ Crea .env
#    ✅ pip install -r requirements.txt
#    ✅ Indexa el TFG (si está en /docs/)
#    ✅ Verifica si Ollama está activo

# 5. Una vez termina, ejecutar:
streamlit run app.py
```

---

## 🔍 Detalles para tu agente

### Paso 1: Extractar el ZIP

```bash
unzip dashboard_electrico.zip
cd dashboard_electrico
```

Esto crea:
```
dashboard_electrico/
├── app.py
├── extractor.py
├── inercia.py
├── rocof.py
├── alertas.py
├── asistente_local.py
├── requirements.txt
├── setup.py
├── indexar_tfg.py
├── README.md
└── ...
```

### Paso 2: Ejecutar `setup.py`

```bash
python setup.py
```

El script hace automáticamente:

1. **Verifica archivos** (4 cosas que puede faltar)
2. **Pide tokens API** (interactivo):
   ```
   ESIOS_API_KEY: [pega tu token]
   ENTSOE_API_KEY: [déjalo vacío si no lo tienes]
   Modelo de IA: [presiona ENTER para phi3:mini]
   ```
3. **Crea `.env`** con los tokens
4. **Instala dependencias** (`pip install -r requirements.txt`)
5. **Indexa el TFG** si existe la carpeta `/docs/`
6. **Verifica Ollama** (si está disponible)

Al final muestra instrucciones para ejecutar el dashboard.

### Paso 3: Copiar archivos necesarios

Tu agente debe verificar que existan:

| Archivo | Dónde debe estar | Qué es |
|---------|------------------|--------|
| `datos_28A.json` | Raíz (mismo nivel que `app.py`) | **Crítico** — datos históricos del colapso |
| Archivos `.mdx` del TFG | Carpeta `docs/` | **Necesario para IA** — base de conocimiento |
| `.env` | Raíz (se crea con setup.py) | **Crítico** — credenciales API |

Si alguno falta, el script de setup lo indicará con ⚠️.

### Paso 4: Ejecutar el dashboard

```bash
streamlit run app.py
```

Se abre automáticamente en http://localhost:8501

---

## 🔐 Gestión de tokens

### Token ESIOS

**Tienes:** `consultasios@ree.es`

Instrucciones para tu agente:
- Ya lo tienes (APH mencionó que lo tiene)
- Pegaráselo en el prompt de `setup.py`
- Ejemplo: `ESIOS_API_KEY: 1a2b3c4d5e6f7g8h9i0j`

### Token ENTSOE

**No tienes aún.** Requiere:

1. Registrarse en https://transparency.entsoe.eu/usrm/publicload
2. Ir a Account → "Web API security token"
3. **Solicitar por email** (el sistema envía un email con el token)
4. Tarda ~24h

**Mientras tanto:** El agente puede dejar vacío en setup.py:
```
ENTSOE_API_KEY: [ENTER sin escribir nada]
```

El dashboard funcionará igual, solo sin la métrica "precio de desbalance".

Una vez recibas el token por email, actualizar `.env`:
```env
ENTSOE_API_KEY=tu_token_nuevo_aqui
```

---

## 📂 Archivos importantes para el agente

### Archivos que YA ESTÁN en el ZIP

| Archivo | Líneas | Qué hace |
|---------|--------|----------|
| `app.py` | ~850 | Dashboard Streamlit completo (5 pestañas) |
| `extractor.py` | ~280 | Conexión a APIs (ESIOS, ENTSOE, Swissgrid) |
| `inercia.py` | ~100 | Cálculo de inercia + comparativa vs. 28-A |
| `rocof.py` | ~130 | Rate of Change of Frequency por regresión |
| `alertas.py` | ~230 | Motor semafórico (verde/ámbar/rojo) |
| `asistente_local.py` | ~280 | IA local con RAG + Ollama |
| `requirements.txt` | ~15 | Dependencias Python |
| `setup.py` | ~350 | Setup automático interactivo |
| `indexar_tfg.py` | ~30 | Script de indexación del TFG |
| `README.md` | ~300 | Documentación completa |

### Archivos que FALTA QUE COPIE el agente

| Archivo | De dónde | Para dónde |
|---------|----------|-----------|
| `datos_28A.json` | Proyecto original | Raíz de `dashboard_electrico/` |
| Archivos `.mdx` del TFG | Proyecto original | Carpeta `dashboard_electrico/docs/` |

---

## 🎯 Flujo de ejecución del agente

```
┌─ Agente descarga el ZIP
│
├─ Extrae a `dashboard_electrico/`
│
├─ Ejecuta `python setup.py`
│   ├─ Pide tokens (ESIOS obligatorio, ENTSOE opcional)
│   ├─ Instala dependencias
│   ├─ Indexa el TFG si existe `/docs/`
│   └─ Verifica Ollama
│
├─ Copia `datos_28A.json` desde el proyecto original
│
├─ (Opcional) Copia `.mdx` del TFG a `/docs/`
│
├─ Si hay `.mdx` nuevos y setup ya se ejecutó:
│   └─ Ejecuta `python indexar_tfg.py` de nuevo
│
└─ Ejecuta `streamlit run app.py`
   └─ Dashboard listo en http://localhost:8501
```

---

## ⚡ Lo que el agente NO necesita hacer

✅ **Ya está automatizado:**
- ❌ Crear `.env` manualmente (setup.py lo hace)
- ❌ Ejecutar `pip install` manualmente (setup.py lo hace)
- ❌ Crear carpetas (setup.py lo verifica)
- ❌ Configurar ChromaDB (se hace automáticamente)
- ❌ Descargar modelos de HuggingFace (langchain lo hace)

✅ **El agente solo hace 3 cosas:**
1. Extraer el ZIP
2. Ejecutar `python setup.py`
3. Ejecutar `streamlit run app.py`

---

## 🚨 Si algo falla

El agente debe revisar:

1. **`setup.py` no completa**
   → Verifica que `requirements.txt` esté presente
   → Verifica que tenga permisos de escritura

2. **Error al instalar dependencias**
   → Probablemente falta `python -m pip install --upgrade pip`
   → O la versión de Python es < 3.10

3. **Archivos no encontrados**
   → `datos_28A.json` debe estar en raíz
   → Archivos `.mdx` deben estar en `docs/`

4. **Dashboard abre pero sin datos**
   → Verifica que `.env` tenga tokens válidos
   → Presionar "Sincronizar telemedidas" en el sidebar

5. **Asistente IA no responde**
   → Ollama no está ejecutándose (`ollama serve`)
   → Modelo no descargado (`ollama pull phi3:mini`)

---

## 📝 Resumen para tu agente

> **Tu agente es inteligente.** Simplemente hazle saber que:
>
> 1. Existe un archivo ZIP con el dashboard
> 2. Tiene que ejecutar `setup.py` (es interactivo y lo guiará)
> 3. Que copie `datos_28A.json` y los `.mdx` del TFG si existen
> 4. Que ejecute `streamlit run app.py`
>
> Con eso es suficiente. El resto es automático.

---

## ✨ Ventajas del setup automático

- ✅ Interactivo (pide solo lo necesario)
- ✅ Verifica dependencias
- ✅ Indexa documentos automáticamente
- ✅ Mensaje de error claro si algo falta
- ✅ Instrucciones finales con próximos pasos

Tu agente no tiene que saber de tokens, ChromaDB, o embeddings. Solo ejecuta el script y sigue las instrucciones.

---

**Versión**: 1.0  
**Fecha**: Mayo 2025  
**Para**: Tu agente de IA con acceso a archivos del proyecto
