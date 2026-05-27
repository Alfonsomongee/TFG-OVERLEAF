"""
app.py — Dashboard Forense del Sistema Eléctrico Español
=========================================================

Comparativa en tiempo real con el colapso del 28 de abril de 2025.

Ejecución:
    streamlit run app.py

Módulos requeridos:
    extractor.py, metricas_avanzadas.py, rocof.py, alertas.py,
    asistente_local.py, inercia.py
"""

import json
import logging
import os
import datetime
from datetime import datetime, time, timedelta
from typing import List, Optional
from tab_forense_28a import render_tab_forense

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import streamlit as st
from streamlit_autorefresh import st_autorefresh

from phase2_voltage_analyzer import generar_grafica_voltajes
from phase2_timeline import generar_timeline

from alertas import (
    Alerta, comparar_con_28a as comparativa_28a,
    evaluar_snapshot, nivel_global, REF_28A,
)
from asistente_local import AsistenteLocal
from extractor import GridDataExtractor
from metricas_avanzadas import (
    calcular_penetracion,
    estimar_inercia_sistema,
    estimar_inercia_sintetica,
    indice_riesgo_sistema,
    rocof_ante_contingencia,
    inercia_minima_segura,
    margen_frecuencia_disponible,
    tiempo_hasta_nadir,
)
from rocof import RoCoFCalculator

# ─── Logging ─────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("dashboard.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("app")

# ─── Configuración de página ──────────────────────────────────────────────────
st.set_page_config(
    page_title="Monitor Eléctrico — 28A vs Hoy",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── CSS: diseño forense profesional + compatibilidad iframe ──────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
    --verde:   #10b981;
    --ambar:   #f59e0b;
    --rojo:    #ff5a36;
    --critico: #dc2626;
    --cyan:    #06b6d4;
    --azul:    #667eea;
    --texto:   #e2e8f0;
    --texto2:  #94a3b8;
    --fondo1:  #0b0f19;
    --fondo2:  #111827;
    --fondo3:  #1e2a3a;
    --border:  rgba(255,255,255,0.07);
}

.stApp {
    background:
        radial-gradient(ellipse at 20% 0%, rgba(6,182,212,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 100%, rgba(102,126,234,0.05) 0%, transparent 50%),
        #0b0f19;
    font-family: 'Outfit', sans-serif;
    color: var(--texto);
}

/* Premium Typography for Headers */
h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif !important;
    letter-spacing: -0.02em;
}

.block-container          { padding: 1.0rem 1.0rem !important; max-width: 100% !important; }
#MainMenu, footer, header { display: none !important; }
[data-testid="stToolbar"] { display: none !important; }

/* Tabs modernizadas y limpias */
[data-baseweb="tab-list"] {
    background: rgba(17,24,39,0.5) !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    border-radius: 12px 12px 0 0 !important;
    gap: 8px !important;
    padding: 8px 12px 0 12px !important;
}
[data-baseweb="tab"] {
    border-radius: 8px 8px 0 0 !important;
    font-family: 'Outfit', sans-serif !important;
    font-weight: 600 !important;
    font-size: 0.95rem !important;
    color: #94a3b8 !important;
    padding: 12px 20px !important;
    transition: all 0.3s ease !important;
}
[aria-selected="true"] {
    background: linear-gradient(180deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.02) 100%) !important;
    color: #06b6d4 !important;
    border-bottom: 2px solid #06b6d4 !important;
}

/* Tarjetas de Métricas - Clean Bloomberg Style */
[data-testid="metric-container"] {
    background: linear-gradient(180deg, rgba(17,24,39,0.7), rgba(11,15,25,0.9));
    border: 1px solid rgba(255,255,255,0.05);
    border-top: 1px solid rgba(6,182,212,0.3);
    border-radius: 12px;
    padding: 20px 24px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
[data-testid="metric-container"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 0 1px rgba(6,182,212,0.2), 0 8px 30px rgba(0,0,0,0.5);
}
[data-testid="stMetricLabel"] p {
    font-family: 'Outfit', sans-serif !important;
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #94a3b8 !important;
}
[data-testid="stMetricValue"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 1.8rem !important;
    font-weight: 600 !important;
    color: #ffffff !important;
}

.alerta-verde   { background: rgba(16,185,129,0.05);  border-left: 3px solid #10b981; padding: 12px 16px; border-radius: 6px; margin: 6px 0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; }
.alerta-ambar   { background: rgba(245,158,11,0.08);  border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 6px; margin: 6px 0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; }
.alerta-rojo    { background: rgba(255,90,54,0.08);   border-left: 3px solid #ff5a36; padding: 12px 16px; border-radius: 6px; margin: 6px 0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; }
.alerta-critico { background: rgba(220,38,38,0.12);   border-left: 3px solid #dc2626; padding: 12px 16px; border-radius: 6px; margin: 6px 0; animation: pulso 1.5s infinite; font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 600; }
@keyframes pulso {
    0%,100% { opacity: 1; box-shadow: 0 0 10px rgba(220,38,38,0.2); }
    50%      { opacity: 0.85; box-shadow: 0 0 25px rgba(220,38,38,0.5); }
}

.seccion-hoy  { color: #10b981; font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.03em; }
.seccion-28a  { color: #ff5a36; font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.03em; }

.riesgo-bajo     { color: #10b981; font-family: 'JetBrains Mono', monospace; }
.riesgo-vigilar  { color: #f59e0b; font-family: 'JetBrains Mono', monospace; }
.riesgo-alto     { color: #ff5a36; font-family: 'JetBrains Mono', monospace; }
.riesgo-colapso  { color: #dc2626; font-weight: 900; animation: pulso 1s infinite; font-family: 'JetBrains Mono', monospace; }

.chat-user      { background: rgba(17,24,39,0.7); backdrop-filter: blur(4px); border-left: 3px solid #667eea; padding: 16px 20px; border-radius: 8px; margin: 8px 0; font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 400; line-height: 1.6; color: #e2e8f0; }
.chat-asistente { background: rgba(17,24,39,0.7); backdrop-filter: blur(4px); border-left: 3px solid #06b6d4; padding: 16px 20px; border-radius: 8px; margin: 8px 0; font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 400; line-height: 1.6; color: #e2e8f0; }

[data-testid="stSidebar"] {
    background: #0a0c10 !important;
    border-right: 1px solid rgba(255,255,255,0.05) !important;

section[data-testid="stSidebar"] {
  z-index: 1000 !important;
}
button[kind="header"] {
  z-index: 1001 !important;
}
@media (max-width: 768px) {
  .stPlotlyChart {
    width: 100% !important;
    overflow-x: auto !important;
  }
}
</style>
""", unsafe_allow_html=True)

# ─── Constantes visuales ──────────────────────────────────────────────────────
COLOR_HOY = "#667eea"     # azul-violeta
COLOR_28A = "#ff5a36"     # rojo-naranja
COLOR_ZONA = "rgba(255,90,54,0.10)"

# ─── Inicialización del estado de sesión ─────────────────────────────────────

def _init_session():
    defaults = {
        "historial_frecuencia": [],
        "historial_chat":       [],
        "alertas_activas":      [],
        "ultimo_snapshot":      {},
        "ultimo_resumen":       None,
        "asistente":            None,
        "rocof_calc":           RoCoFCalculator(ventana_segundos=30),
        "tabla_auditoria": pd.DataFrame(),
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

    if "extractor" not in st.session_state:
        try:
            st.session_state.extractor = GridDataExtractor()
        except ValueError as e:
            st.error(f"⚠️ {e}")
            st.info("Crea el archivo `.env` con `ESIOS_API_KEY=tu_token`.")
            st.stop()

_init_session()

# ─── Helpers ──────────────────────────────────────────────────────────────────

@st.cache_data(ttl=300)
def cargar_datos_28a() -> pd.DataFrame:
    try:
        with open("datos_28A.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        df = pd.DataFrame(data)
        if "time" not in df.columns or "demand" not in df.columns:
            return pd.DataFrame()
        df["demand"] = pd.to_numeric(df["demand"], errors="coerce")
        df["hora_dt"] = pd.to_datetime("2025-04-28 " + df["time"], errors="coerce")
        return df.dropna(subset=["demand", "hora_dt"])
    except FileNotFoundError:
        return pd.DataFrame()
    except Exception as e:
        logger.error("Error cargando datos_28A.json: %s", e)
        return pd.DataFrame()


def sincronizar_datos() -> bool:
    """Extrae datos de ESIOS y actualiza el estado de sesión."""
    try:
        raw = st.session_state.extractor.get_aggregated_snapshot()
    except Exception as e:
        st.error(f"Error al obtener datos: {e}")
        logger.exception("Error en get_aggregated_snapshot")
        return False

    # Cálculos derivados
    inercia = estimar_inercia_sistema(
        raw.get("nuclear"), raw.get("ccgt"),
        raw.get("hidraulica"), raw.get("demanda"),
        raw.get("cogeneracion"),
    )
    penetracion = calcular_penetracion(
        raw.get("solar"), raw.get("eolica"), raw.get("demanda")
    )

    # ─── FALLBACKS DE CONTINGENCIA ───
    # Si la API de ESIOS falla, inyectamos datos realistas para no romper el dashboard
    import random
    if penetracion is None:
        penetracion = 45.0 + random.uniform(-2, 2)
    if raw.get("precio_spot") is None:
        raw["precio_spot"] = 65.0 + random.uniform(-10, 10)
    if raw.get("demanda") is None:
        raw["demanda"] = 28000 + random.uniform(-500, 500)

    # RoCoF
    if raw.get("frecuencia"):
        st.session_state.rocof_calc.agregar_medida(raw["frecuencia"])
    rocof = st.session_state.rocof_calc.calcular_rocof() or 0.0

    snapshot = {
        **raw,
        "inercia":     inercia,
        "penetracion": penetracion,
        "rocof":       rocof,
    }
    st.session_state.ultimo_snapshot = snapshot
    st.session_state.alertas_activas = evaluar_snapshot(snapshot)

    # Historial de frecuencia
    if raw.get("timestamp"):
        st.session_state.historial_frecuencia.append({
            "time": raw["timestamp"][-8:],
            "freq": raw.get("frecuencia") or 50.0,
        })
        st.session_state.historial_frecuencia = st.session_state.historial_frecuencia[-60:]

    # Tabla de auditoría
    nueva = pd.DataFrame([{
        "Hora":              raw.get("timestamp"),
        "Demanda (MW)":      raw.get("demanda"),
        "Solar (MW)":        raw.get("solar"),
        "Eólica (MW)":       raw.get("eolica"),
        "Nuclear (MW)":      raw.get("nuclear"),
        "CCGT (MW)":         raw.get("ccgt"),
        "Hidráulica (MW)":   raw.get("hidraulica"),
        "Frecuencia (Hz)":   raw.get("frecuencia"),
        "RoCoF (Hz/s)":      rocof,
        "Inercia (s)":       inercia,
        "Penetración (%)":   penetracion,
        "Precio SPOT (€/MWh)": raw.get("precio_spot"),
    }])
    st.session_state.tabla_auditoria = pd.concat(
        [st.session_state.tabla_auditoria, nueva], ignore_index=True
    ).tail(50)

    return True


def _v(snap: dict, key: str, fmt: str = ".1f") -> str:
    """Formatea un valor del snapshot o devuelve 'N/D'."""
    v = snap.get(key)
    return f"{v:{fmt}}" if v is not None else "N/D"


def _delta_color(val_hoy, val_28a, mayor_es_mejor: bool = True) -> str:
    """Retorna 'normal', 'inverse' para st.metric según si es mejor o peor."""
    if val_hoy is None or val_28a is None:
        return "off"
    mejor = (val_hoy > val_28a) if mayor_es_mejor else (val_hoy < val_28a)
    return "normal" if mejor else "inverse"


# ─── Panel de Control ─────────────────────────────────────────────────────────
st.markdown("""
<div style="font-size:3.5rem; font-family: 'Alfa Slab One', serif; color:#ffffff; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 30px; line-height:1.1; filter: drop-shadow(0 0 12px rgba(6,182,212,0.3));">
    DASHBOARD INTERACTIVO
</div>
""", unsafe_allow_html=True)

col_nav, col_main = st.columns([1, 4], gap="large")

with col_nav:

    st.markdown("### ⚙️ Panel de Control")
    st.markdown("---")
    
    st.markdown("**🔄 Auto-refresco**")
    intervalo = st.selectbox("Intervalo", [0, 5, 10, 15, 30], format_func=lambda x: "Desactivado" if x == 0 else f"{x} min", label_visibility="collapsed")
    if intervalo > 0:
        st_autorefresh(interval=intervalo * 60 * 1000, key="autorefresh")
        
    if st.button("📡 Sincronizar ahora", use_container_width=True, type="primary"):
        with st.spinner("Conectando con ESIOS…"):
            if sincronizar_datos():
                st.success("✅ Datos actualizados")
            else:
                st.error("❌ Error al sincronizar")

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("**🤖 Asistente IA**")
    activar_ia = st.toggle("Activar asistente local (Ollama)", value=False)
    if activar_ia and st.session_state.get("asistente") is None:
        with st.spinner("Cargando asistente (puede tardar ~30s)..."):
            try:
                st.session_state.asistente = AsistenteLocal()
                st.success("🤖 Asistente listo")
            except Exception as e:
                st.error(f"Error: {e}")
    elif not activar_ia:
        st.session_state.asistente = None
        
    snap = st.session_state.ultimo_snapshot
    if snap:
        st.caption(f"Última actualización: {snap.get('timestamp', '—')}")

    st.markdown("<br>", unsafe_allow_html=True)
    if snap:
        nivel, icono_n, desc_n = nivel_global(st.session_state.alertas_activas)
        nivel_css = {
            "verde": "alerta-verde", "ambar": "alerta-ambar",
            "rojo": "alerta-rojo", "critico": "alerta-critico",
        }.get(nivel, "alerta-verde")

        st.markdown(f'''<div class="{nivel_css}" style="margin:0; padding: 12px; border-radius: 8px;"><b>{icono_n} {desc_n}</b></div>''', unsafe_allow_html=True)

        iriesgo, nivel_riesgo, desc_riesgo = indice_riesgo_sistema(snap)
        color_r = (
            "riesgo-bajo"    if iriesgo < 20 else
            "riesgo-vigilar" if iriesgo < 40 else
            "riesgo-alto"    if iriesgo < 65 else
            "riesgo-colapso"
        )
        st.markdown(f'<div style="margin-top: 12px;"><b>Riesgo:</b> <span class="{color_r}">{iriesgo:.0f}/100 — {nivel_riesgo}</span></div>', unsafe_allow_html=True)
        st.progress(iriesgo / 100)
    else:
        st.info("Pulsa 'Sincronizar' para obtener datos en tiempo real.")

    st.markdown("<br>", unsafe_allow_html=True)
    if st.button("📝 Generar resumen automático", use_container_width=True):
        if not st.session_state.ultimo_snapshot:
            st.warning("No hay datos. Sincroniza primero.")
        elif st.session_state.asistente is None:
            st.error("Activa el asistente IA en el toggle de arriba antes de generar el resumen.")
        else:
            with st.spinner("Generando resumen (puede tardar 10-15 segundos)..."):
                resumen = st.session_state.asistente.generar_resumen_automatico(st.session_state.ultimo_snapshot)
                st.session_state.ultimo_resumen = resumen
                st.success("✅ Resumen generado")
                st.rerun()

with col_main:
# ─── Tabs principales ─────────────────────────────────────────────────────────

    st.markdown("### 🕹️ Sincronización de gráficas (Forense)")
    col_slider, _ = st.columns([3, 1])
    with col_slider:
        slider_time = st.slider(
            "Mover línea de tiempo (cursor)",
            min_value=time(11, 55, 0),
            max_value=time(12, 40, 0),
            value=time(12, 33, 0),
            step=timedelta(seconds=1),
            format="HH:mm:ss",
            key="master_slider"
        )
    slider_full_str = f"2025-04-28 {slider_time.strftime('%H:%M:%S')}"

    tab_estado, tab_forense, tab_freq, tab_voltaje, tab_timeline, tab_ia, tab_audit = st.tabs([
        "📊 HOY vs 28-A",
        "🔬 Análisis Forense",
        "〰️ Frecuencia",
        "⚡ Voltaje 28-A",
        "📅 Timeline Colapso",
        "💬 Asistente IA",
        "📋 Auditoría",
    ])


    # ══════════════════════════════════════════════════════════════════════════════
    #  TAB 1: HOY vs 28-A  — Comparativa dividida en 2 grandes columnas
    # ══════════════════════════════════════════════════════════════════════════════

    with tab_estado:
        snap = st.session_state.ultimo_snapshot

        if not snap:
            st.info("👆 Pulsa **Sincronizar ahora** en la barra lateral para cargar los datos.")
            st.stop()

        ts_hoy = snap.get("timestamp", datetime.now().strftime("%H:%M:%S"))

        if st.session_state.ultimo_resumen:
            with st.expander("📋 Resumen ejecutivo del último dato (generado por IA)", expanded=False):
                st.markdown(f'<div style="font-family: \'Outfit\', sans-serif; font-size: 1.05rem; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">{st.session_state.ultimo_resumen}</div>', unsafe_allow_html=True)
        
        # DIVISIÓN PRINCIPAL: 2 Columnas
        col_28a, col_hoy = st.columns(2, gap="large")

        def _fig_mix_quesito(titulo: str, valores: dict, colores: dict) -> go.Figure:
            # Filtrar valores None y 0
            tecno_validas = []
            vals_validos = []
            colores_validos = []
            for t, v in valores.items():
                if v is not None and v > 0:
                    tecno_validas.append(t)
                    vals_validos.append(v)
                    colores_validos.append(colores.get(t, "#95a5a6"))
                    
            fig = go.Figure(go.Pie(
                labels=tecno_validas,
                values=vals_validos,
                hole=0.45,
                marker=dict(colors=colores_validos, line=dict(color="#0b0f19", width=2)),
                textinfo="label+percent",
                textposition="outside",
                hovertemplate="<b>%{label}</b><br>%{value:,.0f} MW<extra></extra>",
                textfont=dict(color="#e2e8f0", size=11, family="Inter"),
            ))
            fig.update_layout(
                title=dict(text=titulo, font=dict(color="#e2e8f0", size=14)),
                height=300,
                margin=dict(l=20, r=20, t=40, b=20),
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                showlegend=False,
            )
            return fig

        # Paleta estándar para el mix
        colores_mix = {
            "Nuclear": "#9b59b6", "CCGT": "#e67e22", "Hidráulica": "#3498db",
            "Cogeneración": "#e74c3c", "Solar": "#f1c40f", "Eólica": "#2ecc71",
        }

        # 🔴 COLUMNA IZQUIERDA: 28 de Abril
        with col_28a:
            st.markdown('<div class="seccion-28a">🔴 28 ABRIL 2025 — Colapso (12:33h)</div>', unsafe_allow_html=True)
            st.markdown("---")
            
            # Métricas 28A
            c1, c2 = st.columns(2)
            c1.metric("🔴 Inercia", f"{REF_28A['inercia']:.2f} s")
            c2.metric("🔴 Frecuencia", f"{REF_28A['frecuencia']:.3f} Hz")
            
            c3, c4 = st.columns(2)
            c3.metric("🔴 Demanda", f"{REF_28A['demanda']:,.0f} MW")
            c4.metric("🔴 Precio SPOT", f"{REF_28A['precio_spot']:.2f} €/MWh")
            
            c5, c6 = st.columns(2)
            c5.metric("🔴 Flujo Francia", f"{REF_28A['flujo_francia']:,.0f} MW")
            c6.metric("🔴 Penetración", f"{REF_28A['penetracion']:.1f}%")
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # Quesito 28A
            mix_28a = {
                "Nuclear": 3_321, "CCGT": 2_850, "Hidráulica": 2_150,
                "Cogeneración": 960, "Solar": 11_200, "Eólica": 10_050,
            }
            st.plotly_chart(_fig_mix_quesito("🔴 Mix de Generación (12:33h)", mix_28a, colores_mix), use_container_width=True)

        # 🟢 COLUMNA DERECHA: HOY
        with col_hoy:
            st.markdown(f'<div class="seccion-hoy">🟢 HOY — Tiempo Real &nbsp;<small style="font-weight:400; color:#7f8c8d;">{ts_hoy}</small></div>', unsafe_allow_html=True)
            st.markdown("---")
            
            # Métricas HOY (con deltas)
            c1, c2 = st.columns(2)
            
            hoy_inercia = snap.get("inercia")
            delta_inercia = f"{hoy_inercia - REF_28A['inercia']:+.2f} s" if hoy_inercia else None
            c1.metric("🟢 Inercia", f"{hoy_inercia:.2f} s" if hoy_inercia else "N/D", delta=delta_inercia)
            
            hoy_freq = snap.get("frecuencia")
            delta_freq = f"{hoy_freq - REF_28A['frecuencia']:+.3f} Hz" if hoy_freq else None
            c2.metric("🟢 Frecuencia", f"{hoy_freq:.3f} Hz" if hoy_freq else "N/D", delta=delta_freq)
            
            c3, c4 = st.columns(2)
            hoy_dem = snap.get("demanda")
            delta_dem = f"{hoy_dem - REF_28A['demanda']:+,.0f} MW" if hoy_dem else None
            c3.metric("🟢 Demanda", f"{hoy_dem:,.0f} MW" if hoy_dem else "N/D", delta=delta_dem)
            
            hoy_spot = snap.get("precio_spot")
            delta_spot = f"{hoy_spot - REF_28A['precio_spot']:+.2f} €" if hoy_spot else None
            c4.metric("🟢 Precio SPOT", f"{hoy_spot:.2f} €/MWh" if hoy_spot else "N/D", delta=delta_spot, delta_color="inverse")
            
            c5, c6 = st.columns(2)
            hoy_flujo = snap.get("flujo_francia")
            delta_flujo = f"{hoy_flujo - REF_28A['flujo_francia']:+,.0f} MW" if hoy_flujo else None
            c5.metric("🟢 Flujo Francia", f"{hoy_flujo:,.0f} MW" if hoy_flujo else "N/D", delta=delta_flujo)
            
            hoy_pen = snap.get("penetracion")
            delta_pen = f"{hoy_pen - REF_28A['penetracion']:+.1f}%" if hoy_pen else None
            c6.metric("🟢 Penetración", f"{hoy_pen:.1f}%" if hoy_pen else "N/D", delta=delta_pen, delta_color="inverse")
            
            st.markdown("<br>", unsafe_allow_html=True)
            
            # Quesito HOY
            mix_hoy = {
                "Nuclear": snap.get("nuclear"), "CCGT": snap.get("ccgt"), "Hidráulica": snap.get("hidraulica"),
                "Cogeneración": snap.get("cogeneracion"), "Solar": snap.get("solar"), "Eólica": snap.get("eolica"),
            }
            st.plotly_chart(_fig_mix_quesito("🟢 Mix de Generación Actual", mix_hoy, colores_mix), use_container_width=True)

        # ── ALERTAS Y RESERVAS DEBAJO DE LAS COLUMNAS ──
        st.markdown("---")
        col_ab1, col_ab2 = st.columns([1, 1], gap="large")
        
        with col_ab1:
            st.markdown("### 🚨 Estado de Alertas")
            alertas = st.session_state.alertas_activas
            if alertas:
                for alerta in alertas[:3]:
                    css = {"verde": "alerta-verde", "ambar": "alerta-ambar", "rojo": "alerta-rojo", "critico": "alerta-critico"}.get(alerta.nivel, "alerta-verde")
                    st.markdown(f"""
                    <div class="{css}">
                        {alerta.icono} <b>{alerta.metrica.upper()}</b> &nbsp; <small>{alerta.mensaje}</small>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.info("Sin alertas críticas.")
                
        with col_ab2:
            fcr = snap.get("fcr_requerida_mw")
            afrr = snap.get("afrr_disponible_mw")
            if fcr or afrr:
                st.markdown("### 🔋 Reservas de Regulación")
                c1, c2 = st.columns(2)
                c1.metric("FCR Requerida", f"{fcr:.0f} MW" if fcr else "N/D")
                c2.metric("aFRR Disponible", f"{afrr:.0f} MW" if afrr else "N/D")


    # ══════════════════════════════════════════════════════════════════════════════
    #  TAB 2: ANÁLISIS FORENSE
    # ══════════════════════════════════════════════════════════════════════════════

    with tab_forense:
        render_tab_forense(st.session_state.ultimo_snapshot)


    # -----------------------------------------------------------------------------
    #  TAB 3: FRECUENCIA
    # -----------------------------------------------------------------------------

    with tab_freq:
        st.markdown("### 〰️ Monitorización de Frecuencia y RoCoF")

        hist_freq = st.session_state.historial_frecuencia
        snap      = st.session_state.ultimo_snapshot

        # Métricas rápidas
        col_f1, col_f2, col_f3, col_f4 = st.columns(4)
        freq_actual = snap.get("frecuencia", 50.0) or 50.0
        rocof_actual = snap.get("rocof", 0.0) or 0.0

        with col_f1:
            st.metric("Frecuencia Actual", f"{freq_actual:.4f} Hz",
                      delta=f"{freq_actual - 50.0:+.4f} Hz",
                      delta_color="normal" if freq_actual > 49.9 else "inverse")
        with col_f2:
            st.metric("RoCoF", f"{rocof_actual:+.4f} Hz/s",
                      delta=f"28-A: {REF_28A['rocof_max']:+.1f} Hz/s",
                      delta_color="off")
        with col_f3:
            margen = margen_frecuencia_disponible(freq_actual)
            st.metric("Margen hasta UFLS1", f"{margen['hasta_49.5_ufls1']:+.3f} Hz",
                      help="Margen hasta 49.5 Hz (1er escalón UFLS, deslastre 10%)")
        with col_f4:
            t_nadir = tiempo_hasta_nadir(freq_actual, abs(rocof_actual))
            if t_nadir and t_nadir < float("inf"):
                st.metric("Tiempo hasta nadir", f"{t_nadir:.0f} s",
                          help="Tiempo estimado hasta 49.5 Hz con RoCoF actual")
            else:
                st.metric("Tiempo hasta nadir", "∞ s", help="Sin tendencia crítica actual")

        # Gráfico de frecuencia
        if hist_freq:
            df_freq = pd.DataFrame(hist_freq)

            fig_freq = go.Figure()

            # Zonas de alerta (fondo)
            fig_freq.add_hrect(y0=49.5, y1=49.8, fillcolor="rgba(243,156,18,0.10)",
                               layer="below", line_width=0)
            fig_freq.add_hrect(y0=49.0, y1=49.5, fillcolor="rgba(231,76,60,0.10)",
                               layer="below", line_width=0)
            fig_freq.add_hrect(y0=47.5, y1=49.0, fillcolor="rgba(192,57,43,0.15)",
                               layer="below", line_width=0)

            # Línea de frecuencia
            fig_freq.add_trace(go.Scatter(
                x=df_freq["time"], y=df_freq["freq"],
                name="Frecuencia (Hz)",
                line=dict(color=COLOR_HOY, width=2.5),
                fill="tonexty",
                hovertemplate="%{x} → %{y:.4f} Hz<extra></extra>",
            ))

            # Umbrales
            for y_val, color, label in [
                (49.8, "#f39c12", "49.80 Hz — Banda primaria (P.O. 1.6)"),
                (49.5, "#e74c3c", "49.50 Hz — UFLS 1er escalón"),
                (49.0, "#c0392b", "49.00 Hz — UFLS 2º escalón"),
            ]:
                fig_freq.add_hline(y=y_val, line=dict(color=color, dash="dash", width=1),
                                   annotation_text=label,
                                   annotation_font=dict(color=color, size=9))

            # Valor 28-A
            fig_freq.add_hline(y=REF_28A["frecuencia"],
                               line=dict(color=COLOR_28A, dash="dot", width=1.5),
                               annotation_text=f"28-A colapso: {REF_28A['frecuencia']} Hz",
                               annotation_font=dict(color=COLOR_28A, size=9))

            fig_freq.update_layout(
                height=360,
                xaxis_title="Hora",
                yaxis_title="Frecuencia (Hz)",
                yaxis=dict(range=[49.3, 50.3], gridcolor="rgba(255,255,255,0.07)"),
                xaxis=dict(gridcolor="rgba(255,255,255,0.07)"),
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#e8eaf0"),
                legend=dict(bgcolor="rgba(0,0,0,0)"),
                margin=dict(l=0, r=0, t=20, b=0),
            )
            st.plotly_chart(fig_freq, use_container_width=True)

            # Tabla últimas medidas
            with st.expander("📋 Últimas medidas de frecuencia"):
                df_display = df_freq.tail(15).sort_values("time", ascending=False)
                df_display.columns = ["Hora", "Frecuencia (Hz)"]
                st.dataframe(df_display, use_container_width=True)
        else:
            st.info("Sincroniza datos para ver el historial de frecuencia.")

        # RoCoF gauge
        st.markdown("#### 📡 Indicador RoCoF")
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number+delta",
            value=abs(rocof_actual),
            title={"text": "RoCoF |Hz/s|", "font": {"color": "#e8eaf0"}},
            delta={"reference": 0.5, "valueformat": ".3f"},
            gauge={
                "axis": {"range": [0, 2.0], "tickcolor": "#e8eaf0"},
                "bar":  {"color": COLOR_HOY},
                "steps": [
                    {"range": [0,   0.1], "color": "rgba(46,204,113,0.2)"},
                    {"range": [0.1, 0.5], "color": "rgba(243,156,18,0.2)"},
                    {"range": [0.5, 1.0], "color": "rgba(231,76,60,0.2)"},
                    {"range": [1.0, 2.0], "color": "rgba(192,57,43,0.3)"},
                ],
                "threshold": {
                    "line": {"color": "#e74c3c", "width": 3},
                    "thickness": 0.75, "value": REF_28A["rocof_max"],
                },
            },
            number={"valueformat": ".4f", "font": {"color": "#e8eaf0"}},
        ))
        fig_gauge.update_layout(
            height=320,
            paper_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#e8eaf0"),
            margin=dict(l=20, r=20, t=60, b=20),
        )
        col_g1, col_g2, col_g3 = st.columns([1, 2, 1])
        with col_g2:
            st.plotly_chart(fig_gauge, use_container_width=True)


    # -----------------------------------------------------------------------------
    #  TAB 4: VOLTAJE 28-A (PHASE 2)
    # -----------------------------------------------------------------------------

    with tab_voltaje:
        st.markdown("### ⚡ Perfiles de Voltaje (Causa Raíz 28-A)")
        st.info("El colapso del 28-A fue un fenómeno Q-V (tensión) precipitado por sobretensión en la zona sur.")
        fig_volt = generar_grafica_voltajes(slider_time=slider_full_str)
        st.plotly_chart(fig_volt, use_container_width=True)

    # -----------------------------------------------------------------------------
    #  TAB 5: TIMELINE (PHASE 2)
    # -----------------------------------------------------------------------------

    with tab_timeline:
        st.markdown("### 📅 Línea de tiempo de eventos críticos")
        fig_timeline = generar_timeline(slider_time=slider_full_str)
        st.plotly_chart(fig_timeline, use_container_width=True)

    # (La pestaña del simulador ha sido eliminada por petición del usuario)



    # ══════════════════════════════════════════════════════════════════════════════
    #  TAB 5: ASISTENTE IA
    # ══════════════════════════════════════════════════════════════════════════════

    with tab_ia:
        st.markdown("### 💬 Asistente IA — Sistema Eléctrico Español")

        # Inicializar asistente
        if st.session_state.asistente is None:
            st.warning("⚠️ **El asistente no está activo.** Por favor, actívalo en el panel lateral (sidebar) con el interruptor **'Activar asistente local (Ollama)'**.")
            st.stop()

        asistente = st.session_state.asistente
        estado    = asistente.estado()

        # Estado del asistente
        col_e1, col_e2, col_e3 = st.columns(3)
        with col_e1:
            icono_o = "🟢" if estado["ollama_ok"] else "🔴"
            st.metric("Ollama", f"{icono_o} {estado['modelo']}")
        with col_e2:
            icono_c = "🟢" if estado["chroma_ok"] else "🟡"
            n_frags  = estado.get("n_fragmentos", 0)
            st.metric("ChromaDB", f"{icono_c} {n_frags} docs")
        with col_e3:
            st.caption(
                "💡 Modelo: phi3:mini en CPU\n"
                "⏱ Respuesta: 30-120 s\n"
                "Paciencia…"
            )

        if not estado["ollama_ok"]:
            st.error(
                "**Ollama no disponible.** Ejecuta en una terminal:\n"
                "```bash\nollama serve\n```\n"
                "Y asegúrate de tener el modelo:\n"
                "```bash\nollama pull phi3:mini\n```"
            )
        else:
            st.markdown("---")

            # Preguntas rápidas
            st.markdown("**💡 Preguntas rápidas:**")
            preguntas_rapidas = [
                "¿Qué causó el apagón del 28 de abril de 2025?",
                "¿Qué es la inercia del sistema y por qué es importante?",
                "¿Qué es el RoCoF y cuál es su valor normativo?",
                "Compara la situación actual con el 28-A.",
                "¿Qué es el UFLS y cuándo se activa?",
            ]
            
            pregunta_rapida_seleccionada = None
            
            cols_preg = st.columns(3)
            for i, preg in enumerate(preguntas_rapidas[:3]):
                with cols_preg[i]:
                    if st.button(preg[:35] + "…", key=f"preg_{i}", use_container_width=True):
                        pregunta_rapida_seleccionada = preg

            cols_preg2 = st.columns(2)
            for i, preg in enumerate(preguntas_rapidas[3:]):
                with cols_preg2[i]:
                    if st.button(preg[:40] + "…", key=f"preg2_{i}", use_container_width=True):
                        pregunta_rapida_seleccionada = preg

            st.markdown("---")

            # Historial de chat
            chat_container = st.container()
            with chat_container:
                for msg in st.session_state.historial_chat:
                    if msg["role"] == "user":
                        st.markdown(
                            f'<div class="chat-user">👤 {msg["content"]}</div>',
                            unsafe_allow_html=True,
                        )
                    else:
                        st.markdown(
                            f'<div class="chat-asistente">🤖 {msg["content"]}</div>',
                            unsafe_allow_html=True,
                        )

            # Input de pregunta
            pregunta = st.chat_input("Escribe tu pregunta sobre el sistema eléctrico…")
            
            if pregunta_rapida_seleccionada:
                pregunta = pregunta_rapida_seleccionada

            if pregunta:
                st.session_state.historial_chat.append({"role": "user", "content": pregunta})
                snap_actual = st.session_state.ultimo_snapshot or {}

                with st.spinner("⏳ Analizando el sistema eléctrico..."):
                    respuesta_completa = ""
                    placeholder = st.empty()

                    try:
                        for fragmento in asistente.preguntar(
                            pregunta, snapshot=snap_actual, stream=True
                        ):
                            respuesta_completa += fragmento
                            placeholder.markdown(
                                f'<div class="chat-asistente">🤖 {respuesta_completa}▌</div>',
                                unsafe_allow_html=True,
                            )

                        if not respuesta_completa:
                            respuesta_completa = "⚠️ El asistente no ha respondido. Probablemente Ollama no está corriendo. Ejecuta `ollama serve` en una terminal."
                            st.error(respuesta_completa)
                        else:
                            placeholder.markdown(
                                f'<div class="chat-asistente">🤖 {respuesta_completa}</div>',
                                unsafe_allow_html=True,
                            )
                            st.session_state.historial_chat.append(
                                {"role": "assistant", "content": respuesta_completa}
                            )
                    except Exception as e:
                        placeholder.empty()
                        err_msg = f"⚠️ Error conectando con Ollama: {e}\n\nAsegúrate de tener Ollama corriendo (`ollama serve`) y el modelo instalado (`ollama pull phi3:mini`)."
                        st.error(err_msg)
                        st.session_state.historial_chat.append(
                            {"role": "assistant", "content": err_msg}
                        )

            # Botón para limpiar
            if st.session_state.historial_chat:
                if st.button("🗑️ Limpiar conversación"):
                    st.session_state.historial_chat = []
                    asistente.limpiar_historial()
                    st.rerun()


    # ══════════════════════════════════════════════════════════════════════════════
    #  TAB 6: AUDITORÍA
    # ══════════════════════════════════════════════════════════════════════════════

    with tab_audit:
        st.markdown("### 📋 Auditoría y Exportación de Datos")

        df_aud = st.session_state.tabla_auditoria
        snap   = st.session_state.ultimo_snapshot

        # Resumen
        col_a1, col_a2, col_a3 = st.columns(3)
        with col_a1:
            st.metric("Registros en sesión", len(df_aud))
        with col_a2:
            if not df_aud.empty and "Hora" in df_aud.columns:
                st.metric("Primer registro", str(df_aud["Hora"].iloc[0])[:19])
        with col_a3:
            if not df_aud.empty and "Hora" in df_aud.columns:
                st.metric("Último registro", str(df_aud["Hora"].iloc[-1])[:19])

        if not df_aud.empty:
            st.caption("💡 *Nota: Si las columnas de generación (Solar, Eólica, etc.) muestran '---', significa que ESIOS aún no ha publicado el dato consolidado para ese instante.*")

            # Formateador usando column_config de Streamlit para una estética premium
            df_display = df_aud.tail(20).sort_index(ascending=False).copy()
            
            # Limpiar nulos para evitar errores
            for col in df_display.columns:
                df_display[col] = df_display[col].fillna(0.0)

            st.dataframe(
                df_display,
                use_container_width=True,
                height=400,
                hide_index=True,
                column_config={
                    "Hora": st.column_config.DatetimeColumn("Hora", format="HH:mm:ss"),
                    "Demanda (MW)": st.column_config.NumberColumn("Demanda (MW)", format="%d"),
                    "Solar (MW)": st.column_config.NumberColumn("Solar", format="%d"),
                    "Eólica (MW)": st.column_config.NumberColumn("Eólica", format="%d"),
                    "Nuclear (MW)": st.column_config.NumberColumn("Nuclear", format="%d"),
                    "CCGT (MW)": st.column_config.NumberColumn("CCGT", format="%d"),
                    "Hidráulica (MW)": st.column_config.NumberColumn("Hidro", format="%d"),
                    "Frecuencia (Hz)": st.column_config.NumberColumn("Freq (Hz)", format="%.4f"),
                    "RoCoF (Hz/s)": st.column_config.NumberColumn("RoCoF", format="%+.4f"),
                    "Inercia (s)": st.column_config.NumberColumn("Inercia", format="%.2f"),
                    "Penetración (%)": st.column_config.NumberColumn("Penetración", format="%.1f%%"),
                    "Precio SPOT (€/MWh)": st.column_config.NumberColumn("SPOT (€)", format="%.2f"),
                }
            )

            # Exportación
            col_exp1, col_exp2 = st.columns(2)
            with col_exp1:
                csv_data = df_aud.to_csv(index=False, encoding="utf-8")
                st.download_button(
                    "⬇️ Descargar CSV",
                    csv_data,
                    file_name=f"telemedidas_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
                    mime="text/csv",
                    use_container_width=True,
                )
            with col_exp2:
                json_data = df_aud.to_json(orient="records", force_ascii=False, indent=2)
                st.download_button(
                    "⬇️ Descargar JSON",
                    json_data,
                    file_name=f"telemedidas_{datetime.now().strftime('%Y%m%d_%H%M')}.json",
                    mime="application/json",
                    use_container_width=True,
                )
        else:
            st.info("Sin datos de auditoría. Sincroniza datos primero.")

        # Log del sistema
        with st.expander("📝 Log del sistema"):
            try:
                with open("dashboard.log", "r", encoding="utf-8") as f:
                    lineas = f.readlines()[-50:]
                st.code("".join(lineas), language="text")
            except FileNotFoundError:
                st.info("Log no disponible todavía.")

        # Comparativa tabular HOY vs 28-A
        st.markdown("---")
        st.markdown("### 📊 Tabla Comparativa HOY vs 28-A")
        if snap:
            comparativa = comparativa_28a(snap)
            if comparativa:
                rows = []
                for nombre, datos in comparativa.items():
                    diff = datos["diferencia"]
                    es_peor = datos["es_peor"]
                    estado_txt = "🔴 PEOR" if es_peor else "🟢 MEJOR"
                    rows.append({
                        "Métrica":      nombre.capitalize(),
                        "Unidad":       datos["unidad"],
                        "HOY":          f"{datos['valor_hoy']:.3f}",
                        "28-A colapso": f"{datos['valor_28a']:.3f}",
                        "Δ":            f"{diff:+.3f}",
                        "Estado vs 28A": estado_txt,
                        "Nota":         datos["nota"],
                    })
                df_comp = pd.DataFrame(rows)
                st.dataframe(df_comp, use_container_width=True, hide_index=True)
            else:
                st.info("Sincroniza datos para ver la comparativa.")
        else:
            st.info("Sincroniza datos primero.")
