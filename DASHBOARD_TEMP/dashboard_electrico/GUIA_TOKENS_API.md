# 🔑 Guía de Tokens API — ENTSOE requiere Email

Basado en tu pregunta: **"el token de ENTSOE hay que pedirselo al correo"**

---

## 📧 Token ENTSOE — Proceso por Email

### ¿Por qué por email?

ENTSOE (Operador Europeo de Electricidad) **no genera automáticamente** el token para acceso a API.  
Después de registrarte, debes solicitarlo explícitamente por email.

### Paso a paso

#### 1. Registrarse en ENTSOE

- Ve a: https://transparency.entsoe.eu/usrm/publicload
- Haz clic en **"Register"** (esquina superior derecha)
- Rellena el formulario (email, contraseña, nombre, institución)
- Confirma el email que te envíen

#### 2. Solicitar el token

Una vez registrado:
- Inicia sesión
- Ve a **"Account"** (esquina superior derecha)
- Busca la sección **"Web API security token"**
- Verás un botón que dice **"Request token"** o similar
- Haz clic → **genera una solicitud de token**

#### 3. Esperar el email

- ENTSOE enviará un email con el token (tarda ~24h)
- El email dirá algo como:
  ```
  Your security token for ENTSOE transparency platform API:
  
  Token: 9876543210fedcba1234567890abcdef
  ```

#### 4. Usar el token

Una vez lo recibas:
```env
ENTSOE_API_KEY=9876543210fedcba1234567890abcdef
```

---

## ⚠️ ENTSOE es OPCIONAL para el dashboard

**Si aún no tienes el token:**

### Opción A: Ejecutar setup.py y dejar vacío

```bash
python setup.py

# Cuando pida:
# ENTSOE_API_KEY: [presiona ENTER sin escribir nada]
```

El archivo `.env` quedará:
```env
ESIOS_API_KEY=tu_token_real
ENTSOE_API_KEY=
MODELO_IA=phi3:mini
```

### Resultado:

- ✅ Dashboard funciona **100% normal**
- ✅ Todas las métricas visible
- ❌ Única métrica ausente: `precio_desbalance` (aparecerá como `N/D`)

### Opción B: Escribir "SOLICITADO" como placeholder

```bash
python setup.py

# Cuando pida:
# ENTSOE_API_KEY: SOLICITADO_POR_EMAIL
```

Esto es útil para recordar que está pendiente.

### Opción C: Actualizar .env después

Una vez recibas el token por email:

1. Abre `.env`
2. Reemplaza:
   ```env
   ENTSOE_API_KEY=9876543210fedcba1234567890abcdef
   ```
3. Reinicia el dashboard
4. ¡Listo! Ahora aparecerá el `precio_desbalance`

---

## 📊 ¿Qué es el `precio_desbalance`?

**Documento ENTSO-E A85** = Imbalance Price

Refleja:
- Estrés de la regulación secundaria del sistema
- Costo de equilibrar demanda-generación en tiempo real
- Indicador de estabilidad operativa

**En el contexto del TFG:**
- El 28-A probablemente tuvo precios de desbalance muy elevados justo antes del colapso
- Métrica interesante pero no crítica para el análisis

**Si no tienes el token:**
- El dashboard muestra todas las otras métricas (inercia, RoCoF, frecuencia, etc.)
- Solo te falta esta una variable en la tabla de auditoría

---

## 🎯 Recomendación para tu agente IA

Cuando ejecute `setup.py` y llegue a pedir ENTSOE:

```python
# Tu agente debería hacer algo así:
print("ENTSOE_API_KEY: ", end="")
entsoe = input().strip()

if not entsoe:
    print("ℹ️ ENTSOE deixado en blanco.")
    print("   Puedes solicitarlo después en https://transparency.entsoe.eu/account")
    entsoe = ""
```

El script `setup.py` **ya hace esto automáticamente**, así que no tienes que preocuparte.

---

## 📝 Timeline realista

| Fecha | Acción |
|-------|--------|
| **Hoy** | Ejecutas setup.py con ENTSOE vacío. Dashboard funciona. |
| **Hoy +5 min** | El dashboard está corriendo sin problema. |
| **Hoy +24h** | Recibes el email de ENTSOE con el token. |
| **Hoy +24h +2 min** | Actualizas `.env` y relanzas el dashboard. |
| **Resultado final** | Dashboard al 100% con todas las métricas. |

---

## 🔒 Seguridad: NO subas .env

**Importante para Git/repositorio:**

```bash
# .gitignore
.env
*.log
cache_datos.json
chroma_tfg_db/
__pycache__/
```

El `.env` con tus tokens **nunca** debe commitirse.

---

## ✅ Resumen

```
┌─ ¿Tienes token ESIOS?
│  └─ Sí → pégalo en setup.py
│
├─ ¿Tienes token ENTSOE?
│  ├─ Sí → pégalo en setup.py
│  └─ No → déjalo vacío en setup.py (PERFECTAMENTE VÁLIDO)
│      → Solicita el token en https://transparency.entsoe.eu/account
│      → Cuando lo recibas (24h), actualiza .env
│      → Relanza el dashboard
│
└─ Resultado: Dashboard funciona con o sin ENTSOE
   (Una métrica opcionalmente ausente, pero funcional al 100%)
```

---

**Versión**: 1.0  
**Escrito para**: APH (basado en pregunta sobre tokens ENTSOE)  
**Validez**: Mínimo hasta mayo 2026
