"""
app.py — Dashboard de Monitorización del Sistema Eléctrico Español

Comparación en tiempo real con el colapso del 28 de abril de 2025.

Ejecución:
    streamlit run app.py

Módulos propios requeridos:
    extractor.py, inercia.py, rocof.py, alertas.py, asistente_local.py
"""

import json
import logging
import os
from datetime import datetime
from typing import List, Optional

import pandas as pd
import plotly.graph_objects as go
import streamlit as st
from streamlit_autorefresh import st_autorefresh

from alertas import Alerta, comparar_con_28a, evaluar_snapshot, nivel_global
from asistente_local import AsistenteLocal
from extractor import GridDataExtractor
from inercia import comparar_con_28a as inercia_vs_28a
from inercia import estimar_inercia_sistema
from rocof import RoCoFCalculator

# ============================================================
#  Logging
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("dashboard.log", encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger("app")

# ============================================================
#  Configuración de la página
# ============================================================
st.set_page_config(
    page_title="Monitor Eléctrico España",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# CSS personalizado para afinar la presentación
st.markdown("""
<style>
    .metric-card   { border-radius: 8px; padding: 4px 0; }
    .alerta-roja   { background: rgba(231,76,60,0.12); border-left: 4px solid #e74c3c;
                     padding: 8px 12px; border-radius: 4px; margin: 4px 0; }
    .alerta-ambar  { background: rgba(243,156,18,0.12); border-left: 4px solid #f39c12;
                     padding: 8px 12px; border-radius: 4px; margin: 4px 0; }
    .badge-verde   { color: #27ae60; font-weight: 700; }
    .badge-rojo    { color: #e74c3c; font-weight: 700; }
    .badge-ambar   { color: #f39c12; font-weight: 700; }
    .subtitulo     { font-size: 0.85rem; color: #7f8c8d; margin-top: -10px; }
</style>
""", unsafe_allow_html=True)

st.title("⚡ Monitor de Estabilidad del Sistema Eléctrico Español")
st.markdown("Comparación en tiempo real con el colapso del **28 de abril de 2025**")

# ============================================================
#  Inicialización del estado de sesión
# ============================================================
def _init_session():
    defaults = {
        "tabla_historica": pd.DataFrame(columns=[
            "Hora", "Demanda (MW)", "Solar (MW)", "Eólica (MW)", "Nuclear (MW)",
            "CCGT (MW)", "Hidráulica (MW)", "SPOT (€/MWh)", "Desbalance (€/MWh)",
            "Flujo FR (MW)", "Flujo PT (MW)", "Frecuencia (Hz)",
            "RoCoF (Hz/s)", "Inercia (s)", "Penetración (%)",
        ]),
        "historial_frecuencia": [],
        "historial_chat": [],
        "alertas_activas": [],
        "ultimo_snapshot": {},
        "asistente": None,
        "rocof_calc": RoCoFCalculator(ventana_segundos=30),
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

    if "extractor" not in st.session_state:
        try:
            st.session_state.extractor = GridDataExtractor()
        except ValueError as e:
            st.error(f"⚠️ {e}")
            st.info("Crea el archivo `.env` con `ESIOS_API_KEY` y `ENTSOE_API_KEY`.")
            st.stop()

_init_session()

# ============================================================
#  Helpers
# ============================================================

def cargar_datos_28a() -> pd.DataFrame:
    """Carga el perfil de demanda del 28-A desde el JSON estático."""
    try:
        with open("datos_28A.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        df = pd.DataFrame(data)
        if "time" not in df.columns or "demand" not in df.columns:
            st.warning("datos_28A.json no tiene las columnas esperadas ('time', 'demand')")
            return pd.DataFrame()
        return df
    except FileNotFoundError:
        return pd.DataFrame()
    except Exception as e:
        st.error(f"Error cargando datos_28A.json: {e}")
        return pd.DataFrame()


def calcular_penetracion(solar, eolica, demanda) -> Optional[float]:
    if solar is None or eolica is None or not demanda:
        return None
    return round(((solar + eolica) / demanda) * 100, 1)


def sincronizar_datos() -> bool:
    """Realiza la extracción y actualiza el estado de sesión. Devuelve True si OK."""
    try:
        raw = st.session_state.extractor.get_aggregated_snapshot()
    except Exception as e:
        st.error(f"Error al obtener datos: {e}")
        logger.exception("Error en get_aggregated_snapshot")
        return False

    # ── Cálculos derivados ──
    inercia = estimar_inercia_sistema(
        raw.get("nuclear"),
        raw.get("ccgt"),
        raw.get("hidraulica"),
        raw.get("demanda"),
    )
    penetracion = calcular_penetracion(raw.get("solar"), raw.get("eolica"), raw.get("demanda"))

    # ── RoCoF ──
    if raw.get("frecuencia"):
        st.session_state.rocof_calc.agregar_medida(raw["frecuencia"])
    rocof = st.session_state.rocof_calc.calcular_rocof()

    # ── Snapshot enriquecido ──
    snapshot = {**raw, "inercia": inercia, "penetracion": penetracion, "rocof": rocof or 0.0}
    st.session_state.ultimo_snapshot = snapshot

    # ── Alertas ──
    st.session_state.alertas_activas = evaluar_snapshot(snapshot)

    # ── Histórico de frecuencia ──
    if raw.get("frecuencia"):
        st.session_state.historial_frecuencia.append({
            "time": raw["timestamp"][-8:],   # solo HH:MM:SS
            "freq": raw["frecuencia"],
        })
        st.session_state.historial_frecuencia = st.session_state.historial_frecuencia[-30:]

    # ── Tabla de auditoría ──
    nueva_fila = pd.DataFrame([{
        "Hora":               raw.get("timestamp"),
        "Demanda (MW)":       raw.get("demanda"),
        "Solar (MW)":         raw.get("solar"),
        "Eólica (MW)":        raw.get("eolica"),
        "Nuclear (MW)":       raw.get("nuclear"),
        "CCGT (MW)":          raw.get("ccgt"),
        "Hidráulica (MW)":    raw.get("hidraulica"),
        "SPOT (€/MWh)":       raw.get("precio_spot"),
        "Desbalance (€/MWh)": raw.get("precio_desbalance"),
        "Flujo FR (MW)":      raw.get("flujo_francia"),
        "Flujo PT (MW)":      raw.get("flujo_portugal"),
        "Frecuencia (Hz)":    raw.get("frecuencia"),
        "RoCoF (Hz/s)":       rocof,
        "Inercia (s)":        inercia,
        "Penetración (%)":    penetracion,
    }])
    st.session_state.tabla_historica = (
        pd.concat([nueva_fila, st.session_state.tabla_historica])
        .head(5)
        .reset_index(drop=True)
    )
    return True


def icono_inercia(v) -> str:
    if v is None:
        return "⚪"
    if v > 2.5:
        return "🟢"
    if v >= 1.5:
        return "🟡"
    return "🔴"


def icono_penetracion(v) -> str:
    if v is None:
        return "⚪"
    if v < 65:
        return "🟢"
    if v < 75:
        return "🟡"
    return "🔴"


def icono_frecuencia(v) -> str:
    if v is None:
        return "⚪"
    if v >= 49.80:
        return "🟢"
    if v >= 49.50:
        return "🟡"
    return "🔴"

# ============================================================
#  Sidebar
# ============================================================
with st.sidebar:
    st.header("⚙️ Controles")

    # Sincronización manual
    if st.button("🔄 Sincronizar telemedidas", type="primary", use_container_width=True):
        with st.spinner("Consultando APIs..."):
            ok = sincronizar_datos()
        if ok:
            st.success("✅ Datos actualizados")
            st.rerun()

    st.divider()

    # Auto-refresh
    st.subheader("⏱ Auto-actualización")
    auto_on = st.toggle("Activar auto-refresh", value=False)
    if auto_on:
        intervalo_min = st.select_slider(
            "Intervalo (min)", options=[5, 10, 15, 30], value=10
        )
        count = st_autorefresh(
            interval = intervalo_min * 60 * 1000,
            key      = "autorefresh_ticker",
        )
        # Solo sincronizar si es una actualización automática (count > 0)
        if count > 0:
            sincronizar_datos()
        st.caption(f"Actualización automática cada {intervalo_min} min")

    st.divider()

    # Estado global del sistema
    alertas: List[Alerta] = st.session_state.alertas_activas
    icono_global, desc_global = nivel_global(alertas)
    st.subheader("🚦 Estado del sistema")
    st.markdown(f"### {icono_global}")
    st.caption(desc_global)

    if alertas:
        with st.expander(f"Ver alertas activas ({len(alertas)})"):
            for a in alertas:
                css_clase = "alerta-roja" if a.nivel == "rojo" else "alerta-ambar"
                st.markdown(
                    f'<div class="{css_clase}"><b>{a.icono} {a.nombre_display}</b><br>'
                    f'{a.mensaje_largo}</div>',
                    unsafe_allow_html=True,
                )

    st.divider()

    # Asistente IA
    st.subheader("🤖 Asistente IA")
    activar_ia = st.toggle("Activar asistente local", value=False)
    if activar_ia and st.session_state.asistente is None:
        with st.spinner("Cargando modelo (puede tardar ~30 s la primera vez)..."):
            try:
                st.session_state.asistente = AsistenteLocal()
                st.success("Asistente listo")
            except Exception as e:
                st.error(f"No se pudo cargar el asistente: {e}")
    elif not activar_ia:
        st.session_state.asistente = None

    st.divider()
    st.caption(f"🕒 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

# ============================================================
#  Pestañas principales
# ============================================================
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Estado actual",
    "📈 Gráfica 28-A",
    "〰️ Frecuencia",
    "💬 Asistente",
    "📋 Auditoría",
])

# ──────────────────────────────────────────────────────────────
# TAB 1 — Estado actual
# ──────────────────────────────────────────────────────────────
with tab1:
    if st.session_state.tabla_historica.empty:
        st.info("Pulsa **Sincronizar telemedidas** en el panel lateral para obtener datos.")
    else:
        ult = st.session_state.tabla_historica.iloc[0]

        # ── Fila 1: métricas de estabilidad ──
        st.subheader("Indicadores de estabilidad")
        c1, c2, c3, c4 = st.columns(4)

        inercia_val = ult.get("Inercia (s)")
        with c1:
            st.metric(
                label = "⚙️ Inercia equivalente",
                value = f"{inercia_val:.2f} s" if inercia_val else "N/D",
                help  = "H = Σ(P·H) / S_base. 28-A en colapso: ~1.18 s",
            )
            st.markdown(
                f'<p class="subtitulo">{icono_inercia(inercia_val)} '
                f'{"Segura" if (inercia_val or 0) > 2.5 else ("Moderada" if (inercia_val or 0) >= 1.5 else "⚠️ Crítica")}</p>',
                unsafe_allow_html=True,
            )
            if inercia_val:
                cmp = inercia_vs_28a(inercia_val)
                st.caption(cmp["descripcion"])

        pen_val = ult.get("Penetración (%)")
        with c2:
            st.metric(
                label = "🌞 Penetración renovable",
                value = f"{pen_val:.1f} %" if pen_val else "N/D",
                help  = "% (solar + eólica) / demanda. 28-A en colapso: ~84.5 %",
            )
            st.markdown(
                f'<p class="subtitulo">{icono_penetracion(pen_val)} '
                f'{"Normal" if (pen_val or 0) < 65 else ("Alta" if (pen_val or 0) < 75 else "⚠️ Extrema")}</p>',
                unsafe_allow_html=True,
            )

        frec_val = ult.get("Frecuencia (Hz)")
        with c3:
            st.metric(
                label = "〰️ Frecuencia",
                value = f"{frec_val:.3f} Hz" if frec_val else "N/D",
                delta = f"{(frec_val - 50.0):+.3f} Hz" if frec_val else None,
                help  = "Frecuencia nominal: 50.000 Hz ±0.2 Hz. 28-A: 49.85 Hz antes del colapso.",
            )
            st.markdown(
                f'<p class="subtitulo">{icono_frecuencia(frec_val)} '
                f'{"Normal" if (frec_val or 50) >= 49.80 else ("Precaución" if (frec_val or 50) >= 49.50 else "⚠️ Crítica")}</p>',
                unsafe_allow_html=True,
            )

        rocof_val = ult.get("RoCoF (Hz/s)")
        icono_r, desc_r, _ = st.session_state.rocof_calc.nivel_alerta()
        with c4:
            st.metric(
                label = "📉 RoCoF",
                value = f"{rocof_val:+.4f} Hz/s" if rocof_val is not None else "N/D",
                help  = "Rate of Change of Frequency. Umbral UFLS: ±0.5 Hz/s. 28-A pico: ~0.48 Hz/s",
            )
            st.markdown(
                f'<p class="subtitulo">{icono_r} {desc_r.split("(")[0].strip()}</p>',
                unsafe_allow_html=True,
            )

        st.divider()

        # ── Fila 2: métricas de operación ──
        st.subheader("Indicadores de operación")
        c5, c6, c7, c8 = st.columns(4)

        with c5:
            d = ult.get("Demanda (MW)")
            st.metric("🏭 Demanda", f"{d:,.0f} MW" if d else "N/D")
        with c6:
            p = ult.get("SPOT (€/MWh)")
            color_precio = "🔴" if (p or 0) < 0 else ("🟡" if (p or 0) < 10 else "🟢")
            st.metric("💰 Precio SPOT", f"{p:.2f} €/MWh" if p is not None else "N/D")
            st.caption(f"{color_precio} {'Negativo — exceso renovable' if (p or 0) < 0 else 'Positivo'}")
        with c7:
            fr = ult.get("Flujo FR (MW)")
            st.metric("🇫🇷 Flujo Francia", f"{fr:+,.0f} MW" if fr is not None else "N/D",
                      help="+= importación desde Francia")
        with c8:
            pt = ult.get("Flujo PT (MW)")
            st.metric("🇵🇹 Flujo Portugal", f"{pt:+,.0f} MW" if pt is not None else "N/D",
                      help="+= importación desde Portugal")

        st.divider()

        # ── Gráfico de generación por tecnología ──
        st.subheader("Mix de generación actual (MW)")
        techs = {
            "☀️ Solar":   ult.get("Solar (MW)"),
            "💨 Eólica":  ult.get("Eólica (MW)"),
            "⚛️ Nuclear": ult.get("Nuclear (MW)"),
            "🔥 CCGT":    ult.get("CCGT (MW)"),
            "💧 Hidro":   ult.get("Hidráulica (MW)"),
        }
        colores = ["#f1c40f", "#3498db", "#9b59b6", "#e67e22", "#1abc9c"]
        techs_validos = {k: v for k, v in techs.items() if v is not None}
        if techs_validos:
            fig_mix = go.Figure(data=[go.Bar(
                x     = list(techs_validos.keys()),
                y     = list(techs_validos.values()),
                marker_color = colores[:len(techs_validos)],
                text  = [f"{v:,.0f}" for v in techs_validos.values()],
                textposition = "outside",
            )])
            fig_mix.update_layout(
                height         = 380,
                margin         = dict(l=20, r=20, t=20, b=20),
                yaxis_title    = "MW",
                showlegend     = False,
                plot_bgcolor   = "rgba(0,0,0,0)",
                paper_bgcolor  = "rgba(0,0,0,0)",
            )
            st.plotly_chart(fig_mix, use_container_width=True)

        # ── Comparativa con el 28-A (tabla resumen) ──
        if st.session_state.ultimo_snapshot:
            cmp = comparar_con_28a(st.session_state.ultimo_snapshot)
            if cmp:
                st.subheader("Comparativa con el 28-A (valores en el colapso)")
                filas = []
                labels = {
                    "inercia": ("⚙️ Inercia", "s"),
                    "penetracion": ("🌞 Penetración", "%"),
                    "frecuencia": ("〰️ Frecuencia", "Hz"),
                    "rocof": ("📉 RoCoF", "Hz/s"),
                    "demanda": ("🏭 Demanda", "MW"),
                    "precio_spot": ("💰 SPOT", "€/MWh"),
                }
                for var, (label, unit) in labels.items():
                    if var not in cmp:
                        continue
                    r = cmp[var]
                    estado = "⚠️ Peor" if r["peor_que_28a"] else "✅ Mejor"
                    filas.append({
                        "Variable":    label,
                        "Actual":      f"{r['actual']} {unit}",
                        "28-A colapso":f"{r['28a']} {unit}",
                        "Diferencia":  f"{r['diferencia']:+.3f} {unit}",
                        "Estado":      estado,
                    })
                st.dataframe(pd.DataFrame(filas), use_container_width=True, hide_index=True)


# ──────────────────────────────────────────────────────────────
# TAB 2 — Gráfica del 28-A con fases anotadas
# ──────────────────────────────────────────────────────────────
with tab2:
    df_28a = cargar_datos_28a()

    if df_28a.empty:
        st.warning("No se encontró `datos_28A.json`. Coloca el archivo en el directorio raíz.")
    else:
        demanda_actual = None
        if not st.session_state.tabla_historica.empty:
            demanda_actual = st.session_state.tabla_historica.iloc[0].get("Demanda (MW)")

        # Separar fases del 28-A
        df_normal       = df_28a[df_28a["demand"] > 5_000]
        df_colapso_pts  = df_28a[df_28a["demand"] == 0]
        df_recuperacion = df_28a[(df_28a["demand"] > 0) & (df_28a["demand"] <= 5_000)]

        fig_28a = go.Figure()

        # Fase 1: Operación normal
        fig_28a.add_trace(go.Scatter(
            x    = df_normal["time"],
            y    = df_normal["demand"],
            name = "28-A — Operación normal",
            mode = "lines",
            line = dict(color="#e74c3c", width=2.5, dash="dash"),
        ))

        # Fase 3: Black start (recuperación)
        if not df_recuperacion.empty:
            fig_28a.add_trace(go.Scatter(
                x    = df_recuperacion["time"],
                y    = df_recuperacion["demand"],
                name = "28-A — Black start (recuperación)",
                mode = "lines",
                line = dict(color="#e67e22", width=2, dash="dot"),
            ))

        # Zona de colapso (área sombreada)
        fig_28a.add_vrect(
            x0             = "12:33",
            x1             = "13:10",
            fillcolor      = "rgba(231,76,60,0.15)",
            layer          = "below",
            line_width     = 0,
            annotation_text= "⚡ COLAPSO TOTAL",
            annotation_position = "top left",
            annotation_font = dict(color="#e74c3c", size=13),
        )

        # Línea de demanda actual
        if demanda_actual:
            fig_28a.add_hline(
                y                  = demanda_actual,
                line               = dict(color="#2ecc71", width=3),
                annotation_text    = f"Ahora: {demanda_actual:,.0f} MW",
                annotation_position= "bottom right",
                annotation_font    = dict(color="#2ecc71", size=12),
            )
            # Anotación de diferencia respecto al 28-A a la misma hora
            hora_actual = datetime.now().strftime("%H:%M")
            fila_28a = df_28a[df_28a["time"] == hora_actual]
            if not fila_28a.empty:
                dem_28a_ahora = fila_28a.iloc[0]["demand"]
                if dem_28a_ahora > 0:
                    delta = demanda_actual - dem_28a_ahora
                    fig_28a.add_annotation(
                        text   = f"Δ ({hora_actual}h): {delta:+,.0f} MW vs 28-A",
                        xref   = "paper", yref = "paper",
                        x      = 0.99, y = 0.10,
                        showarrow = False,
                        font      = dict(size=13, color="#3498db"),
                        bgcolor   = "rgba(52,152,219,0.1)",
                        bordercolor = "#3498db",
                    )

        fig_28a.update_layout(
            title       = "Demanda eléctrica: 28 de abril de 2025 vs. valor actual",
            xaxis_title = "Hora del día",
            yaxis_title = "Demanda (MW)",
            height      = 540,
            hovermode   = "x unified",
            legend      = dict(orientation="h", yanchor="bottom", y=1.02),
            plot_bgcolor  = "rgba(0,0,0,0)",
            paper_bgcolor = "rgba(0,0,0,0)",
        )
        st.plotly_chart(fig_28a, use_container_width=True)

        st.caption(
            "**Rojo discontinuo**: demanda real del 28-A (datos ESIOS cada 5 min). "
            "**Naranja punteado**: recuperación progresiva (black start). "
            "**Zona sombreada**: colapso total (~35 min). "
            "**Verde**: demanda actual del sistema."
        )

        # Estadísticas del 28-A
        st.subheader("📊 Estadísticas del 28 de abril de 2025")
        col_a, col_b, col_c, col_d = st.columns(4)
        demanda_max_28a = df_28a["demand"].max()
        hora_max        = df_28a.loc[df_28a["demand"].idxmax(), "time"]
        dem_recuperada  = df_28a[df_28a["time"] == "23:55"]["demand"].values
        col_a.metric("Demanda pico (antes colapso)", f"{demanda_max_28a:,.0f} MW", f"a las {hora_max}")
        col_b.metric("Duración del colapso completo", "~35 minutos", "12:33 – 13:08")
        col_c.metric("Demanda a las 23:55", f"{dem_recuperada[0]:,.0f} MW" if len(dem_recuperada) else "N/D", "~60 % del pico")
        col_d.metric("Energía no suministrada (est.)", "~3.500 MWh", "Estimación basada en perfil")


# ──────────────────────────────────────────────────────────────
# TAB 3 — Histórico de frecuencia en tiempo real
# ──────────────────────────────────────────────────────────────
with tab3:
    st.subheader("Histórico de frecuencia del sistema (últimas 30 mediciones)")

    hist_freq = st.session_state.historial_frecuencia
    if len(hist_freq) < 2:
        st.info("Se necesitan al menos 2 sincronizaciones para mostrar la gráfica de frecuencia.")
    else:
        df_freq = pd.DataFrame(hist_freq)

        fig_freq = go.Figure()

        # Banda de frecuencia normal (±0.2 Hz)
        fig_freq.add_hrect(
            y0=49.80, y1=50.20,
            fillcolor="rgba(39,174,96,0.08)", line_width=0,
            annotation_text="Banda normal ±0.2 Hz",
            annotation_position="top right",
            annotation_font=dict(color="#27ae60", size=10),
        )

        # Línea de frecuencia
        fig_freq.add_trace(go.Scatter(
            x    = df_freq["time"],
            y    = df_freq["freq"],
            mode = "lines+markers",
            name = "Frecuencia (Hz)",
            line = dict(color="#3498db", width=2.5),
            marker = dict(size=5),
            fill      = "tonexty",
            fillcolor = "rgba(52,152,219,0.07)",
        ))

        # Umbrales
        fig_freq.add_hline(y=50.00, line_dash="dash", line_color="rgba(127,127,127,0.5)",
                           annotation_text="50.000 Hz", annotation_position="left")
        fig_freq.add_hline(y=49.80, line_dash="dot",  line_color="#f39c12",
                           annotation_text="Umbral ámbar (49.80 Hz)", annotation_position="right")
        fig_freq.add_hline(y=49.50, line_dash="dot",  line_color="#e74c3c",
                           annotation_text="Umbral rojo / UFLS (49.50 Hz)", annotation_position="right")

        fig_freq.update_layout(
            xaxis_title   = "Hora de la medición",
            yaxis_title   = "Frecuencia (Hz)",
            height        = 380,
            yaxis         = dict(range=[49.3, 50.7]),
            plot_bgcolor  = "rgba(0,0,0,0)",
            paper_bgcolor = "rgba(0,0,0,0)",
            showlegend    = False,
        )
        st.plotly_chart(fig_freq, use_container_width=True)

    # Panel de RoCoF
    st.subheader("RoCoF — Rate of Change of Frequency")
    icono_r, desc_r, val_r = st.session_state.rocof_calc.nivel_alerta()
    col_r1, col_r2, col_r3 = st.columns([1, 2, 2])
    with col_r1:
        st.markdown(f"<h1 style='text-align:center;margin:0'>{icono_r}</h1>", unsafe_allow_html=True)
    with col_r2:
        st.metric("RoCoF actual", f"{val_r:+.4f} Hz/s" if val_r is not None else "N/D")
    with col_r3:
        st.info(desc_r)
    st.caption(
        "El RoCoF se calcula por regresión lineal sobre la ventana de los últimos 30 s. "
        "Un |RoCoF| > 0.5 Hz/s puede activar el Under Frequency Load Shedding (UFLS), "
        "mecanismo automático de deslastre de cargas. En el 28-A se registraron valores ~0.48 Hz/s."
    )


# ──────────────────────────────────────────────────────────────
# TAB 4 — Asistente IA
# ──────────────────────────────────────────────────────────────
with tab4:
    if st.session_state.asistente is None:
        st.warning(
            "Activa el asistente en el panel lateral. "
            "Requiere **Ollama** en ejecución y el modelo descargado (`ollama pull phi3:mini`)."
        )
        st.code("ollama serve\nollama pull phi3:mini", language="bash")
    else:
        st.markdown(
            "Pregunta sobre el estado actual del sistema, compáralo con el 28-A, "
            "o solicita explicaciones técnicas de conceptos del TFG."
        )

        datos_ia = st.session_state.ultimo_snapshot

        # Mostrar historial de chat
        for msg in st.session_state.historial_chat:
            with st.chat_message(msg["role"]):
                st.write(msg["content"])

        # Input del usuario
        pregunta = st.chat_input("Escribe tu pregunta aquí...")
        if pregunta:
            st.session_state.historial_chat.append({"role": "user", "content": pregunta})
            with st.chat_message("user"):
                st.write(pregunta)

            with st.chat_message("assistant"):
                with st.spinner("Consultando la base de conocimiento del TFG..."):
                    respuesta = st.session_state.asistente.preguntar(
                        pregunta,
                        datos_ia,
                        st.session_state.historial_chat,
                    )
                st.write(respuesta)

            st.session_state.historial_chat.append({"role": "assistant", "content": respuesta})

        # Botón para limpiar historial
        if st.session_state.historial_chat:
            if st.button("🗑 Limpiar conversación"):
                st.session_state.historial_chat = []
                st.rerun()


# ──────────────────────────────────────────────────────────────
# TAB 5 — Auditoría y exportación
# ──────────────────────────────────────────────────────────────
with tab5:
    st.subheader("Últimas 5 extracciones")

    if st.session_state.tabla_historica.empty:
        st.info("Aún no hay datos. Sincroniza para ver el historial.")
    else:
        # Tabla con formato
        fmt_dict = {
            "Demanda (MW)":        "{:.0f}",
            "Solar (MW)":          "{:.0f}",
            "Eólica (MW)":         "{:.0f}",
            "Nuclear (MW)":        "{:.0f}",
            "CCGT (MW)":           "{:.0f}",
            "Hidráulica (MW)":     "{:.0f}",
            "SPOT (€/MWh)":        "{:.2f}",
            "Desbalance (€/MWh)":  "{:.2f}",
            "Flujo FR (MW)":       "{:.0f}",
            "Flujo PT (MW)":       "{:.0f}",
            "Frecuencia (Hz)":     "{:.3f}",
            "RoCoF (Hz/s)":        "{:.4f}",
            "Inercia (s)":         "{:.2f}",
            "Penetración (%)":     "{:.1f}",
        }
        st.dataframe(
            st.session_state.tabla_historica.style.format(fmt_dict, na_rep="N/D"),
            use_container_width=True,
            hide_index=True,
        )

        # Exportación
        st.subheader("📥 Exportar datos")
        col_exp1, col_exp2, col_exp3 = st.columns(3)

        with col_exp1:
            csv = st.session_state.tabla_historica.to_csv(index=False).encode("utf-8")
            st.download_button(
                label     = "📄 Descargar CSV (tabla actual)",
                data      = csv,
                file_name = f"snapshot_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
                mime      = "text/csv",
            )

        with col_exp2:
            if os.path.exists("cache_datos.json"):
                with open("cache_datos.json", "rb") as f:
                    st.download_button(
                        label     = "📦 Descargar JSON (caché completo)",
                        data      = f,
                        file_name = f"cache_completo_{datetime.now().strftime('%Y%m%d')}.json",
                        mime      = "application/json",
                    )

        with col_exp3:
            if os.path.exists("dashboard.log"):
                with open("dashboard.log", "rb") as f:
                    st.download_button(
                        label     = "📝 Descargar log",
                        data      = f,
                        file_name = "dashboard.log",
                        mime      = "text/plain",
                    )

    # Caché completo expandible
    if os.path.exists("cache_datos.json"):
        with st.expander("🔍 Inspeccionar caché completo"):
            try:
                with open("cache_datos.json", "r", encoding="utf-8") as f:
                    st.json(json.load(f))
            except Exception as e:
                st.error(f"Error al leer la caché: {e}")
