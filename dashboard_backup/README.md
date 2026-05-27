# Dashboard de Monitorización del Sistema Eléctrico Español

Comparación en tiempo real con el colapso del **28 de abril de 2025**.

## 📋 Requisitos previos

- **Python 3.10+**
- **Ollama** (opcional, para el asistente IA local)
- **Tokens de API:**
  - **ESIOS** (Red Eléctrica): `consultasios@ree.es` — respuesta en horas
  - **ENTSOE** (Operador europeo): solicitud por email — respuesta en ~24h

## 🚀 Instalación rápida

### Opción 1: Setup automático (recomendado)

```bash
# Extraer el ZIP
unzip dashboard_electrico.zip
cd dashboard_electrico

# Ejecutar setup
python setup.py

# El script hace:
#   ✅ Verifica archivos
#   ✅ Crea .env interactivamente
#   ✅ Instala dependencias (pip install -r requirements.txt)
#   ✅ Indexa el TFG (si existen los .mdx)
#   ✅ Verifica Ollama
```

### Opción 2: Setup manual

1. **Extrae el ZIP:**
   ```bash
   unzip dashboard_electrico.zip
   cd dashboard_electrico
   ```

2. **Instala dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Crea `.env` manualmente:**
   ```env
   ESIOS_API_KEY=tu_token_aqui
   ENTSOE_API_KEY=tu_token_aqui_o_dejalo_vacio
   MODELO_IA=phi3:mini
   ```

4. **Copiar datos históricos:**
   ```bash
   # datos_28A.json debe estar en el directorio raíz
   # (debería estar ya en el proyecto original)
   ```

5. **Indexar el TFG** (una sola vez):
   ```bash
   python indexar_tfg.py
   ```

6. **Ejecutar el dashboard:**
   ```bash
   streamlit run app.py
   ```

---

## 🔑 Obtención de tokens

### ESIOS (Red Eléctrica de España)

1. Envía un email a **consultasios@ree.es**
2. Solicita un token de acceso API
3. Recibirás la respuesta en horas
4. Copia el token en `.env`

```env
ESIOS_API_KEY=1234567890abcdef
```

### ENTSOE (Operador Europeo)

1. Ve a https://transparency.entsoe.eu/usrm/publicload
2. Clic en **"Register"** (crea una cuenta)
3. Una vez registrado, ve a **"Account"** → **"Web API security token"**
4. **Solicita el token por email** (tarda ~24h)
5. Recibirás un email con el token
6. Copia en `.env`

```env
ENTSOE_API_KEY=9876543210fedcba
```

**⚠️ Nota:** Si aún no tienes el token de ENTSOE, el dashboard funciona igual. Solo te faltará la métrica de "precio de desbalance" (aparecerá como `N/D`).

---

## 🎯 Primeros pasos

### 1. Ejecutar sin Ollama (solo métricas)

```bash
streamlit run app.py
```

El dashboard mostrará:
- ✅ Inercia, penetración, frecuencia, RoCoF
- ✅ Gráficas históricas
- ✅ Alertas y comparativas con el 28-A
- ❌ Asistente IA desactivado (requiere Ollama)

### 2. Activar el asistente IA (opcional)

Necesitas **Ollama** ejecutándose:

```bash
# Terminal 1: Inicia Ollama
ollama serve

# Terminal 2: Descarga el modelo (una sola vez)
ollama pull phi3:mini

# Terminal 3: Ejecuta el dashboard
streamlit run app.py
```

En el dashboard, activa "Asistente IA" en el panel lateral. El asistente responderá preguntas sobre el sistema eléctrico usando el TFG como base de conocimiento.

---

## 📁 Estructura de archivos

```
dashboard_electrico/
│
├── app.py                    # Dashboard principal (Streamlit)
├── extractor.py              # Extracción de datos de APIs
├── inercia.py                # Cálculo de inercia
├── rocof.py                  # Cálculo de RoCoF
├── alertas.py                # Motor de alertas (verde/ámbar/rojo)
├── asistente_local.py        # Asistente IA con RAG
├── indexar_tfg.py            # Script de indexación del TFG
├── setup.py                  # Setup automático
├── requirements.txt          # Dependencias Python
├── .env                      # Variables de entorno (se crea en setup)
├── datos_28A.json            # Datos históricos del colapso
│
├── docs/                     # Archivos MDX del TFG (si existen)
│   ├── 01-introduccion.mdx
│   ├── 02-contexto.mdx
│   └── ...
│
├── chroma_tfg_db/            # Base de conocimiento vectorial (generada)
├── cache_datos.json          # Caché de extracciones (generado)
└── dashboard.log             # Log de ejecución (generado)
```

---

## 🚨 Troubleshooting

### Error: `ModuleNotFoundError: No module named 'streamlit'`
→ Instala dependencias: `pip install -r requirements.txt`

### Error: `ESIOS_API_KEY not found`
→ Crea un archivo `.env` con tus tokens de API

### Error en ENTSOE (precio de desbalance siempre `None`)
→ Normal si no tienes token. Deja `ENTSOE_API_KEY=` vacío en `.env`

### El asistente IA no responde
→ Verifica que Ollama esté ejecutándose: `ollama serve`
→ Descarga el modelo: `ollama pull phi3:mini`

### Lentitud en la indexación del TFG (paso 1)
→ Normal. El modelo `all-MiniLM-L6-v2` necesita generar embeddings de ~2-3 GB de datos
→ Tarda entre 2 y 10 minutos dependiendo del hardware

---

## 📊 Características del dashboard

| Pestaña | Funcionalidad |
|---------|---------------|
| **📊 Estado actual** | Métricas en tiempo real, gráfico de generación, comparativa 28-A |
| **📈 Gráfica 28-A** | Demanda histórica del colapso con fases anotadas |
| **〰️ Frecuencia** | Histórico de frecuencia + RoCoF + umbrales de alerta |
| **💬 Asistente** | Preguntas en lenguaje natural (requiere Ollama) |
| **📋 Auditoría** | Tabla de últimas 5 extracciones + exportación CSV/JSON |

---

## 🎓 Métricas clave (y sus umbrales del 28-A)

| Métrica | Normal | Ámbar | Rojo | 28-A colapso |
|---------|--------|-------|------|-------------|
| **Inercia (s)** | > 2.5 | 1.5–2.5 | < 1.5 | **1.18 s** |
| **Penetración (%)** | < 65 | 65–75 | > 75 | **84.5 %** |
| **Frecuencia (Hz)** | ≥ 49.80 | 49.50–49.80 | < 49.50 | **49.85 Hz** |
| **RoCoF (\|Hz/s\|)** | < 0.10 | 0.10–0.30 | > 0.30 | **0.48 Hz/s** |

---

## 🔐 Seguridad

- **Nunca** subas el archivo `.env` a Git
- Los tokens de API se almacenan **localmente** en `.env`
- El asistente IA responde **exclusivamente** desde el contenido del TFG (sin alucinaciones)

---

## 📝 Logs y debugging

El dashboard genera un archivo `dashboard.log` con toda la actividad:

```bash
tail -f dashboard.log
```

Archivos generados tras la ejecución:
- `cache_datos.json` — últimas 50 extracciones
- `chroma_tfg_db/` — base de conocimiento vectorial
- `dashboard.log` — historial de operaciones

---

## 💡 Tips para el TFG

1. **Documentar bien los umbrales**: El 28-A proporciona valores de referencia reales
2. **Comparativa visual**: La gráfica del 28-A con fases anotadas es muy impactante ante el tribunal
3. **RoCoF**: Es la métrica más relevante del colapso (pico de 0.48 Hz/s vs. umbral de UFLS 0.5 Hz/s)
4. **Asistente IA**: Demuestra dominio de RAG local + LLM sin dependencias cloud

---

## 📞 Soporte

Para problemas:
1. Revisa los logs: `tail dashboard.log`
2. Verifica que `.env` esté bien configurado
3. Comprueba la conectividad con las APIs: `python extractor.py` (test manual)

---

**Dashboard versión**: 1.0.0 (mayo 2025)  
**Proyecto**: TFG Ingeniería — Sistema Eléctrico Español
