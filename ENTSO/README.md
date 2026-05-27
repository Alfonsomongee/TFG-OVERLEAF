# ENTSO-E Dashboard para TFG Apagón Ibérico 28-A

**Integración de datos en vivo de ENTSO-E Transparency Platform en tu web Docusaurus.**

---

## 📂 Contenido

```
entsoe-dashboard/
├── SETUP.md                              ← LEE ESTO PRIMERO
├── README.md                             ← (este archivo)
├── api/
│   └── entsoe.js                         ← Edge Function (Vercel)
├── src/
│   ├── hooks/
│   │   └── useENTSOE.js                  ← Hook con snapshot 28-A
│   └── components/
│       └── ENTSOEDashboard/
│           ├── ENTSOEDashboard.jsx       ← Componente principal
│           └── ENTSOEDashboard.module.css ← Estilos
└── docs/
    └── INTEGRATION_CHECKLIST.md          ← Checklist de implementación
```

---

## ⚡ Inicio rápido (15 minutos)

1. **Obtener token ENTSO-E** → https://web-api.tp.entsoe.eu/api
   - Registrar, generar token, copiar string

2. **Copiar archivos** a tu repo TFG
   ```bash
   cp -r entsoe-dashboard/* tu-proyecto/
   ```

3. **Configurar token en Vercel**
   - Settings → Environment Variables → `ENTSOE_API_KEY` = token

4. **Registrar componente** en `MDXComponents.js`
   ```js
   import ENTSOEDashboard from '@site/src/components/ENTSOEDashboard/ENTSOEDashboard';
   ```

5. **Usar en MDX**
   ```mdx
   <ENTSOEDashboard />
   ```

6. **Deploy** → git push → Vercel auto-despliega

---

## 🎯 Qué hace cada archivo

### `api/entsoe.js`
- **Función Edge** que proxea llamadas a ENTSO-E API
- **Mantiene el token seguro** en el servidor
- Devuelve JSON limpio con datos horarios
- Caché automático para reducir llamadas

### `src/hooks/useENTSOE.js`
- Hook React que consume la Edge Function
- Polling automático cada 5 minutos
- Incluye snapshot **SNAPSHOT_28A** con valores del colapso
- Funciones helper: `getLatestValue()`, `getTimeseries()`, `getDelta()`

### `src/components/ENTSOEDashboard/ENTSOEDashboard.jsx`
- Componente principal
- 3 paneles: Generación + Demanda + Comparativa 28-A
- 4 pestañas de navegación
- Gráficos Recharts interactivos
- Responsive (mobile-friendly)

### `ENTSOEDashboard.module.css`
- Estilos coherentes con `designTokens.css` del TFG
- Tema oscuro, colores cian/ámbar/rojo forenses
- Animaciones de pulso, animación de datos

---

## 🔐 Seguridad

| Aspecto | Implementado |
|---|---|
| Token en código | ❌ Nunca |
| Token en env vars | ✅ Sí, servidor Vercel |
| Token visible en cliente | ❌ Nunca |
| Whitelist de endpoints | ✅ Sí (solo ENTSO-E A65, A71, A73) |
| CORS restringido | ✅ Sí (solo tu dominio) |
| Rate limiting | ✅ Caché en Edge (1 min) |

---

## 📊 Datos que obtienes

**En tiempo real (actualizado cada 5 minutos):**
- Generación España (MW) — indicador A65 ENTSO-E
- Demanda España (MW) — indicador A71 ENTSO-E
- Series históricas de últimas 24 horas

**Hardcodeado (snapshot 28-A):**
- 29.600 MW generación
- 25.800 MW demanda
- Inercia H = 2,3 s
- Penetración IBR = 82%

**Comparativa automática:**
- Delta vs 28-A en MW
- Ratio demanda/generación
- Indicador de "red ligera"

---

## 🎓 Por qué ENTSO-E es mejor que ESIOS

| Criterio | ESIOS | ENTSO-E |
|---|---|---|
| **Fuente oficial** | REE España | UE (39 TSOs europeos) |
| **Citada en TFG** | Implícita | Explícita (Informe Factual) |
| **Autoridad académica** | Nacional | Continental |
| **Datos 28-A disponibles** | Parcial | Completo (Informe Factual) |
| **Acceso público** | Con token REE | Token ENTSO-E gratuito |
| **Argumento tribunal** | Débil | Fuerte: *«fuente primaria del análisis»* |

---

## 🛠️ Troubleshooting

**¿Dónde está el archivo X?**
→ Ver `SETUP.md` sección "Copiar archivos al repositorio"

**¿Cómo verifico que funciona?**
→ Ver `SETUP.md` sección "Paso 6 — Verificar que funciona"

**El dashboard muestra "—" (sin datos)**
→ Ver tabla de solución de problemas en `SETUP.md`

**¿Puedo añadir más indicadores?**
→ Sí, ver sección de "Customización" en `SETUP.md`

---

## 📝 Próximos pasos

1. ✅ Obtener token ENTSO-E
2. ✅ Copiar archivos
3. ✅ Configurar env vars en Vercel
4. ✅ Registrar componente
5. ⏭️ Usar en capítulo MDX
6. ⏭️ Deploy y testing
7. ⏭️ (Opcional) Añadir OMIE precios

---

## 📖 Referencias

- [ENTSO-E Transparency Platform](https://transparency.entsoe.eu/)
- [ENTSO-E Web API Docs](https://web-api.tp.entsoe.eu/api)
- [GL Messaging (estándar de datos)](https://www.entsoe.eu/data/)
- [Informe Factual 28-A](https://www.entsoe.eu/publications/)

---

## 📧 Soporte

Si encuentras problemas:
1. Revisar `SETUP.md` sección "Solución de problemas"
2. Revisar logs de Vercel (Deployments → Function Logs)
3. Verificar token en `https://web-api.tp.entsoe.eu/api` → My API Tokens

---

**Última actualización:** mayo 2026  
**Compatible con:** Docusaurus 2.4.3+, React 18+, Vercel Edge Functions
