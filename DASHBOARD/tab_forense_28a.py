"""
tab_forense_28a.py — Pestaña de Análisis Forense del 28-A con diseño SCADA
Incluye semáforo global, tarjetas "Hoy vs 28-A" y CSS de alto contraste.
"""

import streamlit as st
import pandas as pd
from cargador_28a import (
    cargar_demanda_28a,
    cargar_desbalance_28a,
    cargar_frecuencia_28a,
    cargar_precios_28a,
    verificar_archivos,
)
from visualizaciones_forenses import (
    fig_comparativa_superpuesta,
    fig_demanda_real_vs_prev,
    fig_sismografo_frecuencia,
    fig_tormenta_de_precios,
    stats_frecuencia_28a,
    stats_precios_28a,
)


# =============================================================================
# CSS PERSONALIZADO (estilo SCADA Forense)
# =============================================================================
_CSS_FORENSE = """
<style>
    /* Fuentes globales */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html, body, .stApp {
        font-family: 'Inter', sans-serif;
        background-color: #0b0f19;
    }
    
    /* Semáforo global simulado con st.empty() - lo gestionamos en Python */
    .status-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        z-index: 9999;
        transition: background-color 0.3s ease;
    }
    
    /* Tarjetas de métricas personalizadas */
    .metric-card {
        background: #111827;
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 12px;
        padding: 12px 16px;
        margin: 8px 0;
        transition: all 0.2s;
    }
    .metric-card:hover {
        border-top: 2px solid #06b6d4;
        background: #1e293b;
    }
    .metric-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        margin-bottom: 8px;
    }
    .metric-value-container {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 1rem;
    }
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 1.5rem;
        font-weight: 600;
        color: #f8fafc;
    }
    .metric-delta {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 20px;
        background: rgba(0,0,0,0.4);
    }
    .metric-delta.positive { color: #10b981; }
    .metric-delta.negative { color: #ef4444; }
    .metric-sub {
        font-size: 0.7rem;
        color: #64748b;
        margin-top: 6px;
    }
    
    /* Separadores */
    hr {
        border-color: rgba(255,255,255,0.08);
        margin: 1rem 0;
    }
    
    /* Ajustes para plotly */
    .js-plotly-plot .plotly .modebar {
        background: rgba(17,24,39,0.7) !important;
    }
</style>
"""


def _generar_tarjeta_dual(titulo: str, valor_hoy, valor_28a, unidad: str, delta_texto: str = None):
    """Genera una tarjeta HTML que compara HOY vs 28-A."""
    delta_clase = "positive" if "mejor" in str(delta_texto).lower() else "negative" if "peor" in str(delta_texto).lower() else ""
    html = f"""
    <div class="metric-card">
        <div class="metric-label">{titulo}</div>
        <div class="metric-value-container">
            <div>
                <span class="metric-value" style="color:#06b6d4">{valor_hoy}</span>
                <span style="font-size:0.8rem; color:#64748b;"> {unidad}</span>
            </div>
            <div style="text-align:right;">
                <span class="metric-value" style="color:#ef4444; font-size:1.2rem">{valor_28a}</span>
                <span style="font-size:0.8rem; color:#64748b;"> {unidad}</span>
            </div>
        </div>
        <div class="metric-sub">
            28-A: {valor_28a} {unidad} 
            <span class="metric-delta {delta_clase}">{delta_texto or ''}</span>
        </div>
    </div>
    """
    return html


def _inyectar_css_forense():
    st.markdown(_CSS_FORENSE, unsafe_allow_html=True)


def _banner_estado_archivos():
    estado = verificar_archivos()
    todos_ok = all(v["ok"] for v in estado.values())
    if todos_ok:
        st.success("✅ Protocolo de datos: todos los JSON del 28-A localizados.")
        return
    with st.expander("⚠️ Fallo en la integridad de los datos forenses"):
        for nombre, info in estado.items():
            if info["ok"]:
                st.markdown(f"✅ `{nombre}` → `{info['ruta']}`")
            else:
                st.markdown(f"❌ `{nombre}` — no encontrado")


def render_tab_forense(snap: dict):
    """Renderiza la pestaña forense con diseño SCADA y semáforo global."""
    _inyectar_css_forense()

    # ── Semáforo global (simulado) ──────────────────────────────────────────
    # Puedes calcular un índice de riesgo real con los datos actuales
    riesgo = 0
    if snap:
        inercia = snap.get("inercia")
        if inercia is not None:
            if inercia < 1.5:
                riesgo = 2  # rojo
            elif inercia < 2.5:
                riesgo = 1  # ámbar
    color_barra = "#10b981" if riesgo == 0 else "#f59e0b" if riesgo == 1 else "#ef4444"
    st.markdown(
        f'<div class="status-bar" style="background-color:{color_barra};"></div>',
        unsafe_allow_html=True
    )
    st.markdown("<br>", unsafe_allow_html=True)  # espacio para la barra

    # ── Encabezado ─────────────────────────────────────────────────────────
    st.markdown("### 🔬 ANÁLISIS FORENSE — 28 DE ABRIL DE 2025")
    st.markdown(
        "<p style='color:#94a3b8; font-size:0.85rem;'>Sincronización de registros PMU (ENTSO-E) y telemedidas (REE). "
        "Las curvas <span style='color:#ef4444;'>rojas</span> indican el colapso histórico; las curvas "
        "<span style='color:#06b6d4;'>cyan</span> reflejan el estado actual de la red.</p>",
        unsafe_allow_html=True
    )
    _banner_estado_archivos()
    st.markdown("<hr>", unsafe_allow_html=True)

    # ── Carga de datos ─────────────────────────────────────────────────────
    try:
        df_freq = cargar_frecuencia_28a()
        df_demanda = cargar_demanda_28a()
        df_precios = cargar_precios_28a()
        df_desbal = cargar_desbalance_28a()
    except FileNotFoundError as e:
        st.error(f"**Error crítico:** {e}")
        return

    stats_f = stats_frecuencia_28a(df_freq)
    stats_p = stats_precios_28a(df_desbal, df_precios)

    # ── Grid de tarjetas duales (orden causal) ─────────────────────────────
    st.markdown("#### 📡 Telemetría crítica — HOY vs 28-A")
    col1, col2, col3, col4 = st.columns(4)

    # Valores actuales desde snap (evitando None)
    hoy_inercia = snap.get("inercia") if snap else None
    if hoy_inercia is None: hoy_inercia = 0.0

    hoy_penetracion = snap.get("penetracion") if snap else None
    if hoy_penetracion is None: hoy_penetracion = 0.0

    hoy_frecuencia = snap.get("frecuencia") if snap else None
    if hoy_frecuencia is None: hoy_frecuencia = 50.0

    hoy_rocof = snap.get("rocof") if snap else None
    if hoy_rocof is None: hoy_rocof = 0.0

    # Valores 28A
    ref_inercia = 1.18
    ref_penetracion = 84.5
    ref_frecuencia = 49.85
    ref_rocof = 0.48

    with col1:
        delta_pen = hoy_penetracion - ref_penetracion
        texto_delta = f"{delta_pen:+.1f}%" if delta_pen != 0 else "igual"
        estado = "mejor" if delta_pen < 0 else "peor"
        st.markdown(_generar_tarjeta_dual("Penetración renovable", f"{hoy_penetracion:.1f}", ref_penetracion, "%", f"{texto_delta} ({estado})"), unsafe_allow_html=True)

    with col2:
        delta_iner = hoy_inercia - ref_inercia
        texto_delta = f"{delta_iner:+.2f}s"
        estado = "mejor" if delta_iner > 0 else "peor"
        st.markdown(_generar_tarjeta_dual("Inercia equivalente", f"{hoy_inercia:.2f}", ref_inercia, "s", f"{texto_delta} ({estado})"), unsafe_allow_html=True)

    with col3:
        delta_freq = hoy_frecuencia - ref_frecuencia
        texto_delta = f"{delta_freq:+.3f}Hz"
        estado = "mejor" if delta_freq > 0 else "peor"
        st.markdown(_generar_tarjeta_dual("Frecuencia", f"{hoy_frecuencia:.3f}", ref_frecuencia, "Hz", f"{texto_delta} ({estado})"), unsafe_allow_html=True)

    with col4:
        delta_rocof = hoy_rocof - ref_rocof
        texto_delta = f"{delta_rocof:+.2f}Hz/s"
        estado = "mejor" if delta_rocof < 0 else "peor"
        st.markdown(_generar_tarjeta_dual("RoCoF", f"{hoy_rocof:.2f}", ref_rocof, "Hz/s", f"{texto_delta} ({estado})"), unsafe_allow_html=True)

    # ── Gráficas en Pestañas (Botones de selección) ────────────────────────
    st.markdown("#### 🔍 Análisis Detallado por Componente")
    
    t_sismo, t_demanda, t_precio, t_comparativa = st.tabs([
        "🌊 Sismógrafo de Frecuencia", 
        "⚡ Precipicio de Demanda", 
        "💸 Tormenta de Precios", 
        "📊 Telemetría Superpuesta"
    ])
    
    with t_sismo:
        st.markdown("**Sismógrafo de Frecuencia (ECG de la red)**: Registra la caída en picado de la frecuencia del sistema durante el colapso del 28-A, marcando la activación de los relés UFLS y el punto de no retorno a los 49.0 Hz.")
        frecuencia_hoy = snap.get("frecuencia") if snap else None
        st.plotly_chart(fig_sismografo_frecuencia(df_freq, frecuencia_hoy), use_container_width=True)

    with t_demanda:
        st.markdown("**Precipicio de Demanda**: Muestra el desvío crítico entre la demanda programada (previsión) y la demanda real. Una divergencia drástica indica pérdida de generación masiva, llevando al colapso en 37 minutos.")
        demanda_hoy = snap.get("demanda") if snap else None
        st.plotly_chart(fig_demanda_real_vs_prev(df_demanda, demanda_hoy), use_container_width=True)

    with t_precio:
        st.markdown("**Tormenta de Precios**: Analiza cómo el fallo estructural se tradujo en un mercado roto. Los precios de desbalance se dispararon por encima de 1000 €/MWh ante la falta desesperada de reservas operativas.")
        precio_spot_hoy = snap.get("precio_spot") if snap else None
        st.plotly_chart(fig_tormenta_de_precios(df_desbal, df_precios, precio_spot_hoy), use_container_width=True)

    with t_comparativa:
        st.markdown("**Telemetría Superpuesta (HOY vs 28-A)**: Comparación directa de la salud actual del sistema frente a los minutos previos al apagón histórico. Útil para identificar patrones anómalos o riesgos inminentes.")
        historial_freq = st.session_state.get("historial_frecuencia", [])
        st.plotly_chart(fig_comparativa_superpuesta(df_demanda, df_freq, historial_freq, demanda_hoy), use_container_width=True)

    # ── Nota metodológica ──────────────────────────────────────────────────
    with st.expander("📚 Fuentes y metodología"):
        st.markdown("""
        | Dataset | Fuente | Resolución |
        |---|---|---|
        | Frecuencia | ENTSO-E PMU | Eventos (segundos) |
        | Demanda | ESIOS REE | 5 min |
        | Precio SPOT | ESIOS/OMIE | 1h |
        | Precio desbalance | ENTSO-E TR 17.1.G&H | 15 min |
        """)
