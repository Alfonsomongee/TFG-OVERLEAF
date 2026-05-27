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
from datetime import datetime
from typing import List, Optional
from tab_forense_28a import render_tab_forense

import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import streamlit as st
from streamlit_autorefresh import st_autorefresh

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
/* ── Eliminar márgenes blancos para iframe ── */
.block-container          { padding: 0.8rem 1.2rem !important; max-width: 100% !important; }
#MainMenu, footer, header { display: none !important; }
[data-testid="stToolbar"] { display: none !important; }

/* ── Paleta forense ── */
:root {
    --verde:   #2ecc71;
    --ambar:   #f39c12;
    --rojo:    #e74c3c;
    --critico: #c0392b;
    --azul:    #667eea;
    --texto:   #e8eaf0;
    --fondo1:  #0e1117;
    --fondo2:  #1a1f2e;
    --fondo3:  #252b3b;
}

/* ── Tarjetas de comparación ── */
.card-hoy {
    background: linear-gradient(135deg, rgba(46,204,113,0.08), rgba(46,204,113,0.02));
    border: 1px solid rgba(46,204,113,0.25);
    border-left: 4px solid #2ecc71;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 8px;
}
.card-28a {
    background: linear-gradient(135deg, rgba(231,76,60,0.08), rgba(231,76,60,0.02));
    border: 1px solid rgba(231,76,60,0.25);
    border-left: 4px solid #e74c3c;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 8px;
}

/* ── Alertas ── */
.alerta-verde   { background: rgba(46,204,113,0.10); border-left: 4px solid #2ecc71;
                  padding: 10px 14px; border-radius: 6px; margin: 4px 0; }
.alerta-ambar   { background: rgba(243,156,18,0.12); border-left: 4px solid #f39c12;
                  padding: 10px 14px; border-radius: 6px; margin: 4px 0; }
.alerta-rojo    { background: rgba(231,76,60,0.12);  border-left: 4px solid #e74c3c;
                  padding: 10px 14px; border-radius: 6px; margin: 4px 0; }
.alerta-critico { background: rgba(192,57,43,0.20);  border-left: 4px solid #c0392b;
                  padding: 10px 14px; border-radius: 6px; margin: 4px 0;
                  animation: pulso 1.5s infinite; }
@keyframes pulso {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.75; }
}

/* ── Cabeceras de sección ── */
.seccion-hoy  { color: #2ecc71; font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
.seccion-28a  { color: #e74c3c; font-size: 1.1rem; font-weight: 700; margin-bottom: 4px; }
.diff-mejor   { color: #2ecc71; font-weight: 600; }
.diff-peor    { color: #e74c3c; font-weight: 600; }
.diff-igual   { color: #95a5a6; }

/* ── Índice de riesgo ── */
.riesgo-bajo     { color: #2ecc71; }
.riesgo-vigilar  { color: #f39c12; }
.riesgo-alto     { color: #e74c3c; }
.riesgo-colapso  { color: #c0392b; font-weight: 900; animation: pulso 1s infinite; }

/* ── Chat ── */
.chat-user      { background: rgba(102,126,234,0.15); border-radius: 12px 12px 4px 12px;
                  padding: 10px 14px; margin: 6px 0; text-align: right; }
.chat-asistente { background: rgba(255,255,255,0.05); border-radius: 12px 12px 12px 4px;
                  padding: 10px 14px; margin: 6px 0; }
</style>
""", unsafe_allow_html=True)

# ─── Constantes visuales ──────────────────────────────────────────────────────
COLOR_HOY = "#667eea"     # azul-violeta
COLOR_28A = "#e74c3c"     # rojo
COLOR_ZONA = "rgba(231,76,60,0.10)"

# ─── Inicialización del estado de sesión ─────────────────────────────────────

def _init_session():
    defaults = {
        "historial_frecuencia": [],
        "historial_chat":       [],
        "alertas_activas":      [],
        "ultimo_snapshot":      {},
        "asistente":            None,
        "rocof_calc":           RoCoFCalculator(ventana_segundos=30),
        "tabla_auditoria": pd.DataFrame(columns=[
            "Hora", "Demanda (MW)", "Solar (MW)", "Eólica (MW)",
            "Nuclear (MW)", "CCGT (MW)", "Hidráulica (MW)",
            "Frecuencia (Hz)", "RoCoF (Hz/s)", "Inercia (s)", "Penetración (%)",
            "Precio SPOT (€/MWh)",
        ]),
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
    if raw.get("frecuencia"):
        st.session_state.historial_frecuencia.append({
            "time": raw["timestamp"][-8:],
            "freq": raw["frecuencia"],
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


# ─── Sidebar ──────────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("## ⚡ Control")
    st.markdown("---")

    # Auto-refresh
    intervalo = st.selectbox("🔄 Auto-refresco", [0, 5, 10, 15, 30],
                             format_func=lambda x: "Desactivado" if x == 0 else f"{x} min")
    if intervalo > 0:
        st_autorefresh(interval=intervalo * 60 * 1000, key="autorefresh")

    # Sincronización manual
    if st.button("📡 Sincronizar ahora", use_container_width=True, type="primary"):
        with st.spinner("Conectando con ESIOS…"):
            if sincronizar_datos():
                st.success("✅ Datos actualizados")
            else:
                st.error("❌ Error al sincronizar")

    st.markdown("---")

    # Estado del sistema en sidebar
    snap = st.session_state.ultimo_snapshot
    if snap:
        nivel, icono_n, desc_n = nivel_global(st.session_state.alertas_activas)
        nivel_css = {
            "verde": "alerta-verde", "ambar": "alerta-ambar",
            "rojo": "alerta-rojo", "critico": "alerta-critico",
        }.get(nivel, "alerta-verde")

        st.markdown(f"""
        <div class="{nivel_css}">
            <b>{icono_n}</b><br>
            <small>{desc_n}</small>
        </div>
        """, unsafe_allow_html=True)

        # Índice de riesgo
        iriesgo, nivel_riesgo, desc_riesgo = indice_riesgo_sistema(snap)
        st.markdown("**📊 Índice de Riesgo**")
        st.progress(iriesgo / 100)
        color_r = (
            "riesgo-bajo"    if iriesgo < 20 else
            "riesgo-vigilar" if iriesgo < 40 else
            "riesgo-alto"    if iriesgo < 65 else
            "riesgo-colapso"
        )
        st.markdown(f'<span class="{color_r}">{iriesgo:.0f}/100 — {nivel_riesgo}</span>',
                    unsafe_allow_html=True)

        st.markdown("---")
        st.markdown("**🕐 Última actualización**")
        st.caption(snap.get("timestamp", "—"))
    else:
        st.info("Pulsa 'Sincronizar' para obtener datos en tiempo real.")

    st.markdown("---")
    st.markdown("**📚 Fuentes de datos**")
    st.caption("• ESIOS (Red Eléctrica)\n• ENTSO-E Transparency\n• Datos 28-A: REE post-mortem")


# ─── Cabecera principal ───────────────────────────────────────────────────────

st.markdown("""
<div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
    <div style="font-size:2.2rem;">⚡</div>
    <div>
        <div style="font-size:1.5rem; font-weight:800; color:#e8eaf0;">
            Monitor Forense del Sistema Eléctrico Español
        </div>
        <div style="font-size:0.9rem; color:#7f8c8d;">
            Comparativa en tiempo real con el colapso del
            <span style="color:#e74c3c; font-weight:700;">28 de abril de 2025</span>
            · TFG Ingeniería Eléctrica
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# ─── Tabs principales ─────────────────────────────────────────────────────────

tab_estado, tab_forense, tab_freq, tab_sim, tab_ia, tab_audit = st.tabs([
    "📊 HOY vs 28A",
    "🔬 Análisis Forense",
    "〰️ Frecuencia",
    "🧪 Simulador N-1",
    "💬 Asistente IA",
    "📋 Auditoría",
])


# ══════════════════════════════════════════════════════════════════════════════
#  TAB 1: HOY vs 28A  — comparativa directa con métricas st.metric
# ══════════════════════════════════════════════════════════════════════════════

with tab_estado:
    snap = st.session_state.ultimo_snapshot

    if not snap:
        st.info("👆 Pulsa **Sincronizar ahora** en la barra lateral para cargar los datos.")
        st.stop()

    # ── Cabeceras de columnas ──
    col_hdr1, col_hdr2 = st.columns(2)
    with col_hdr1:
        ts_hoy = snap.get("timestamp", datetime.now().strftime("%H:%M:%S"))
        st.markdown(
            f'<div class="seccion-hoy">🟢 HOY — Tiempo Real &nbsp;'
            f'<small style="font-weight:400; color:#7f8c8d;">{ts_hoy}</small></div>',
            unsafe_allow_html=True
        )
    with col_hdr2:
        st.markdown(
            '<div class="seccion-28a">🔴 28 ABRIL 2025 — Colapso (12:33h)</div>',
            unsafe_allow_html=True
        )

    st.markdown("---")

    # ── MÉTRICAS PRINCIPALES: 4 columnas (HOY | 28A) x 2 filas ──
    def _fila_metricas(metricas_data: list):
        """Renderiza una fila de métricas HOY vs 28A."""
        n = len(metricas_data)
        cols = st.columns(n * 2)
        for i, (label, key, val_28a, unidad, mayor_mejor, ayuda) in enumerate(metricas_data):
            val_hoy = snap.get(key)
            delta_hoy = None
            if val_hoy is not None and val_28a is not None:
                diff = val_hoy - val_28a
                delta_hoy = f"{diff:+.2f} {unidad}"

            with cols[i * 2]:     # Columna HOY
                st.metric(
                    label=f"🟢 {label}",
                    value=f"{val_hoy:.2f} {unidad}" if val_hoy is not None else "N/D",
                    delta=delta_hoy,
                    delta_color=_delta_color(val_hoy, val_28a, mayor_mejor),
                    help=ayuda,
                )
            with cols[i * 2 + 1]:  # Columna 28A
                st.metric(
                    label=f"🔴 {label} (28A)",
                    value=f"{val_28a:.2f} {unidad}",
                    delta=None,
                    help=f"Valor en el instante del colapso. {ayuda}",
                )

    _fila_metricas([
        ("Inercia",       "inercia",     REF_28A["inercia"],     "s",   True,  "Inercia equivalente del sistema [s]"),
        ("Penetración",   "penetracion", REF_28A["penetracion"], "%",   False, "% solar+eólica sobre demanda total"),
        ("Frecuencia",    "frecuencia",  REF_28A["frecuencia"],  "Hz",  True,  "Frecuencia de red [Hz]"),
        ("RoCoF",         "rocof",       REF_28A["rocof_max"],   "Hz/s",False, "Rate of Change of Frequency"),
    ])

    st.markdown("")  # espacio

    _fila_metricas([
        ("Demanda",       "demanda",      REF_28A["demanda"],     "MW",    True,  "Demanda instantánea peninsular"),
        ("Precio SPOT",   "precio_spot",  REF_28A["precio_spot"], "€/MWh", True,  "Precio mercado diario OMIE"),
        ("Flujo Francia", "flujo_francia",REF_28A["flujo_francia"],"MW",   True,  "+ = importación de Francia"),
        ("Desvíos",       "precio_desbalance", REF_28A["precio_desbalance"], "€/MWh", False, "Precio de desvíos contrarios ESIOS"),
    ])

    st.markdown("---")

    # ── MIX DE GENERACIÓN ──
    st.markdown("### ⚡ Mix de Generación")
    col_mix1, col_mix2 = st.columns(2)

    def _fig_mix(titulo: str, valores: dict, color_titulo: str) -> go.Figure:
        tecno = list(valores.keys())
        vals  = [v if v else 0 for v in valores.values()]
        colores = {
            "Nuclear": "#9b59b6", "CCGT": "#e67e22", "Hidráulica": "#3498db",
            "Cogeneración": "#e74c3c", "Solar": "#f1c40f", "Eólica": "#2ecc71",
        }
        fig = go.Figure(go.Bar(
            x=vals, y=tecno, orientation="h",
            marker_color=[colores.get(t, "#95a5a6") for t in tecno],
            text=[f"{v:,.0f} MW" for v in vals],
            textposition="outside",
            hovertemplate="%{y}: %{x:,.0f} MW<extra></extra>",
        ))
        fig.update_layout(
            title=dict(text=titulo, font=dict(color=color_titulo, size=14)),
            xaxis_title="MW",
            height=280,
            margin=dict(l=0, r=60, t=40, b=0),
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#e8eaf0"),
            xaxis=dict(gridcolor="rgba(255,255,255,0.08)"),
            yaxis=dict(gridcolor="rgba(0,0,0,0)"),
            showlegend=False,
        )
        return fig

    with col_mix1:
        mix_hoy = {
            "Nuclear":      snap.get("nuclear"),
            "CCGT":         snap.get("ccgt"),
            "Hidráulica":   snap.get("hidraulica"),
            "Cogeneración": snap.get("cogeneracion"),
            "Solar":        snap.get("solar"),
            "Eólica":       snap.get("eolica"),
        }
        st.plotly_chart(_fig_mix("🟢 HOY — Generación actual", mix_hoy, "#2ecc71"),
                        use_container_width=True)

    with col_mix2:
        mix_28a = {
            "Nuclear":    3_321,
            "CCGT":       2_850,
            "Hidráulica": 2_150,
            "Cogeneración": 960,
            "Solar":     11_200,
            "Eólica":    10_050,
        }
        st.plotly_chart(_fig_mix("🔴 28-A 12:33h — Mix al colapso", mix_28a, "#e74c3c"),
                        use_container_width=True)

    # ── ALERTAS ──
    st.markdown("---")
    st.markdown("### 🚨 Estado de Alertas")
    alertas = st.session_state.alertas_activas
    if alertas:
        cols_alt = st.columns(min(len(alertas), 3))
        for i, alerta in enumerate(alertas):
            css = {
                "verde":   "alerta-verde",
                "ambar":   "alerta-ambar",
                "rojo":    "alerta-rojo",
                "critico": "alerta-critico",
            }.get(alerta.nivel, "alerta-verde")
            with cols_alt[i % 3]:
                st.markdown(f"""
                <div class="{css}">
                    {alerta.icono} <b>{alerta.metrica.upper()}</b><br>
                    <small>{alerta.mensaje}</small><br>
                    <small style="opacity:0.6">Ref: {alerta.referencia}</small>
                </div>
                """, unsafe_allow_html=True)
    else:
        st.info("Sincroniza datos para ver el estado de alertas.")

    # ── RESERVAS ──
    fcr   = snap.get("fcr_requerida_mw")
    afrr  = snap.get("afrr_disponible_mw")
    if fcr or afrr:
        st.markdown("---")
        st.markdown("### 🔋 Reservas de Regulación")
        col_r1, col_r2, col_r3, col_r4 = st.columns(4)
        with col_r1:
            st.metric("FCR Requerida", f"{fcr:.0f} MW" if fcr else "N/D",
                      help="Reserva de control primario de frecuencia (P.O. 7.1 REE)")
        with col_r2:
            st.metric("aFRR Disponible", f"{afrr:.0f} MW" if afrr else "N/D",
                      help="Reserva de regulación secundaria disponible")
        with col_r3:
            banda_s = snap.get("banda_subir_mw")
            st.metric("Banda Subir", f"{banda_s:.0f} MW" if banda_s else "N/D",
                      help="Banda regulación secundaria para subir")
        with col_r4:
            banda_b = snap.get("banda_bajar_mw")
            st.metric("Banda Bajar", f"{banda_b:.0f} MW" if banda_b else "N/D",
                      help="Banda regulación secundaria para bajar")


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
        height=250,
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e8eaf0"),
        margin=dict(l=20, r=20, t=40, b=20),
    )
    col_g1, col_g2, col_g3 = st.columns([1, 2, 1])
    with col_g2:
        st.plotly_chart(fig_gauge, use_container_width=True)


# ══════════════════════════════════════════════════════════════════════════════
#  TAB 4: SIMULADOR N-1
# ══════════════════════════════════════════════════════════════════════════════

with tab_sim:
    st.markdown("### 🧪 Simulador de Contingencia N-1")
    st.markdown("""
    Calcula el **RoCoF** esperado ante la pérdida de un gran generador usando la 
    [ecuación de oscilación](https://en.wikipedia.org/wiki/Swing_equation):
    
    $$\\text{RoCoF} = \\frac{\\Delta P \\cdot f_0}{2 \\cdot H \\cdot S_{\\text{base}}}$$
    """)

    snap = st.session_state.ultimo_snapshot

    col_s1, col_s2 = st.columns([1, 1])

    with col_s1:
        st.markdown("**⚙️ Parámetros de la simulación**")

        # Usar valores reales como predeterminados
        h_default = snap.get("inercia", 2.5) or 2.5
        d_default = snap.get("demanda", 25_000) or 25_000

        h_sim = st.slider(
            "Inercia del sistema H (s)", 0.5, 6.0, float(h_default), 0.05,
            key="sim_inercia",
            help="Inercia equivalente del sistema peninsular",
        )
        dp_sim = st.slider(
            "Pérdida de generación ΔP (MW)", 100, 4000, 2000, 50,
            key="sim_dp",
            help="Potencia de la unidad que se pierde (contingencia N-1)",
        )
        s_sim = st.slider(
            "Demanda del sistema S_base (MW)", 15_000, 45_000, int(d_default), 500,
            key="sim_sbase",
            help="Demanda total del sistema en el momento de la contingencia",
        )

    with col_s2:
        st.markdown("**📊 Resultado de la simulación**")

        rocof_calculado = rocof_ante_contingencia(h_sim, dp_sim, s_sim)
        h_min_s = inercia_minima_segura(dp_sim, 1.0, s_sim)
        margen_h = h_sim - h_min_s

        # Comparación con 28-A
        rocof_28a_equiv = rocof_ante_contingencia(REF_28A["inercia"], dp_sim, REF_28A["demanda"])

        # Nivel de alerta
        if rocof_calculado < 0.5:
            nivel_sim = "🟢 NORMAL"
            color_sim = "#2ecc71"
        elif rocof_calculado < 1.0:
            nivel_sim = "🟡 UFLS posible"
            color_sim = "#f39c12"
        elif rocof_calculado < 2.0:
            nivel_sim = "🔴 NC RfG excedido"
            color_sim = "#e74c3c"
        else:
            nivel_sim = "💀 COLAPSO"
            color_sim = "#c0392b"

        st.markdown(f"""
        <div style="background:rgba(255,255,255,0.05); border-radius:8px; padding:20px; text-align:center;">
            <div style="font-size:0.9rem; color:#7f8c8d;">RoCoF simulado</div>
            <div style="font-size:3rem; font-weight:900; color:{color_sim};">
                {rocof_calculado:.3f} <span style="font-size:1.5rem;">Hz/s</span>
            </div>
            <div style="font-size:1.1rem; color:{color_sim}; margin-top:4px;">{nivel_sim}</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("")

        col_r1, col_r2 = st.columns(2)
        with col_r1:
            st.metric("H mínima segura", f"{h_min_s:.3f} s",
                      delta=f"Margen: {margen_h:+.3f} s",
                      delta_color="normal" if margen_h > 0 else "inverse")
        with col_r2:
            st.metric("Equivalente 28-A", f"{rocof_28a_equiv:.3f} Hz/s",
                      help=f"Mismo ΔP con H={REF_28A['inercia']} s (valor del colapso)")

    # Gráfico de sensibilidad
    st.markdown("---")
    st.markdown("#### 📈 Análisis de sensibilidad H vs RoCoF")

    h_range = np.linspace(0.5, 6.0, 200)
    rocof_range = [rocof_ante_contingencia(h, dp_sim, s_sim) for h in h_range]

    fig_sens = go.Figure()

    # Zonas de color
    fig_sens.add_hrect(y0=0,   y1=0.5, fillcolor="rgba(46,204,113,0.07)", layer="below")
    fig_sens.add_hrect(y0=0.5, y1=1.0, fillcolor="rgba(243,156,18,0.07)", layer="below")
    fig_sens.add_hrect(y0=1.0, y1=3.5, fillcolor="rgba(231,76,60,0.07)",  layer="below")

    fig_sens.add_trace(go.Scatter(
        x=h_range, y=rocof_range,
        name="RoCoF vs H",
        line=dict(color=COLOR_HOY, width=2.5),
        fill="tozeroy",
        fillcolor="rgba(102,126,234,0.05)",
        hovertemplate="H=%{x:.2f} s → RoCoF=%{y:.4f} Hz/s<extra></extra>",
    ))

    # Punto actual del simulador
    fig_sens.add_trace(go.Scatter(
        x=[h_sim], y=[rocof_calculado],
        name="Parámetros actuales",
        mode="markers",
        marker=dict(size=14, color=color_sim, symbol="circle",
                    line=dict(color="white", width=2)),
    ))

    # Punto 28-A
    fig_sens.add_trace(go.Scatter(
        x=[REF_28A["inercia"]], y=[rocof_28a_equiv],
        name="28-A colapso",
        mode="markers",
        marker=dict(size=14, color=COLOR_28A, symbol="x",
                    line=dict(color="white", width=2)),
    ))

    # Líneas normativas
    fig_sens.add_hline(y=1.0, line=dict(color="#e74c3c", dash="dash"),
                       annotation_text="Límite NC RfG (1.0 Hz/s)")
    fig_sens.add_hline(y=0.5, line=dict(color="#f39c12", dash="dot"),
                       annotation_text="Umbral UFLS (0.5 Hz/s)")
    fig_sens.add_vline(x=h_min_s, line=dict(color="#e74c3c", dash="dot", width=1),
                       annotation_text=f"H mín = {h_min_s:.2f} s")

    fig_sens.update_layout(
        height=320,
        xaxis_title="Inercia del sistema H (s)",
        yaxis_title="RoCoF (Hz/s)",
        yaxis=dict(range=[0, 3.5], gridcolor="rgba(255,255,255,0.07)"),
        xaxis=dict(gridcolor="rgba(255,255,255,0.07)"),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#e8eaf0"),
        legend=dict(bgcolor="rgba(0,0,0,0)"),
        margin=dict(l=0, r=0, t=10, b=0),
    )
    st.plotly_chart(fig_sens, use_container_width=True)

    st.caption(
        "⚠️ **Limitación académica**: Este modelo simplificado solo considera "
        "potencia activa y variación de frecuencia. No modela tensión, estabilidad transitoria "
        "ni efectos de la red de transporte. Ref.: P. Kundur, *Power System Stability and "
        "Control*, §12.1 (Swing Equation)."
    )


# ══════════════════════════════════════════════════════════════════════════════
#  TAB 5: ASISTENTE IA
# ══════════════════════════════════════════════════════════════════════════════

with tab_ia:
    st.markdown("### 💬 Asistente IA — Sistema Eléctrico Español")

    # Inicializar asistente
    if st.session_state.asistente is None:
        with st.spinner("Cargando asistente (puede tardar en CPU…)"):
            st.session_state.asistente = AsistenteLocal()

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
        cols_preg = st.columns(3)
        for i, preg in enumerate(preguntas_rapidas[:3]):
            with cols_preg[i]:
                if st.button(preg[:35] + "…", key=f"preg_{i}", use_container_width=True):
                    st.session_state.historial_chat.append(
                        {"role": "user", "content": preg}
                    )
        cols_preg2 = st.columns(2)
        for i, preg in enumerate(preguntas_rapidas[3:]):
            with cols_preg2[i]:
                if st.button(preg[:40] + "…", key=f"preg2_{i}", use_container_width=True):
                    st.session_state.historial_chat.append(
                        {"role": "user", "content": preg}
                    )

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

        if pregunta:
            st.session_state.historial_chat.append({"role": "user", "content": pregunta})
            snap_actual = st.session_state.ultimo_snapshot or {}

            with st.spinner("⏳ El modelo está respondiendo (puede tardar 30-120 s en CPU…)"):
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

                    placeholder.markdown(
                        f'<div class="chat-asistente">🤖 {respuesta_completa}</div>',
                        unsafe_allow_html=True,
                    )
                    st.session_state.historial_chat.append(
                        {"role": "assistant", "content": respuesta_completa}
                    )
                except Exception as e:
                    st.error(f"Error: {e}")

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
        st.dataframe(
            df_aud.tail(20).sort_index(ascending=False),
            use_container_width=True,
            height=350,
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
