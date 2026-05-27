"""
tab_forense_28a.py — Pestaña de Análisis Forense del 28-A (diseño SCADA)

Integra en app.py con:

    from tab_forense_28a import render_tab_forense

    with tab_forense:
        render_tab_forense(snap)

Requiere: cargador_28a.py, visualizaciones_forenses.py
"""

import streamlit as st

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

# ─── CSS Forense SCADA ────────────────────────────────────────────────────────
_CSS_FORENSE = """
<style>
/* ── Barra de estado SCADA ── */
.status-bar {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    margin-bottom: 0.5rem;
    transition: background-color 0.5s ease;
}

/* ── Tarjetas duales HOY vs 28-A ── */
.metric-card {
    background: linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.8));
    border: 1px solid rgba(100,116,139,0.3);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    margin-bottom: 0.5rem;
    position: relative;
    overflow: hidden;
}
.metric-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    border-radius: 12px 0 0 12px;
}
.metric-card.verde::before  { background: #10b981; }
.metric-card.ambar::before  { background: #f59e0b; }
.metric-card.rojo::before   { background: #ef4444; }

.metric-label {
    font-size: 0.75rem;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
}
.metric-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.5rem;
}
.metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
}
.metric-sub {
    font-size: 0.72rem;
    color: #64748b;
    margin-top: 0.4rem;
}
.metric-delta {
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 3px;
}
.metric-delta.mejor { color: #10b981; background: rgba(16,185,129,0.1); }
.metric-delta.peor  { color: #ef4444; background: rgba(239,68,68,0.1); }
.metric-delta.igual { color: #94a3b8; }

/* ── Indicadores de fuente ── */
.badge-source {
    display: inline-block;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(100,116,139,0.2);
    color: #94a3b8;
    border: 1px solid rgba(100,116,139,0.3);
    margin-left: 0.3rem;
}
</style>
"""


def _generar_tarjeta_dual(
    label: str,
    valor_hoy: str,
    valor_28a: float,
    unidad: str,
    delta_texto: str = None,
    delta_clase: str = "igual",
) -> str:
    """Genera HTML de tarjeta dual HOY vs 28-A."""
    color_hoy = "#06b6d4"   # cyan — datos actuales
    color_28a = "#ef4444"   # rojo — datos del 28-A

    html = f"""
    <div class="metric-card {delta_clase}">
        <div class="metric-label">{label}</div>
        <div class="metric-row">
            <div style="text-align:left;">
                <span style="font-size:0.65rem; color:#94a3b8;">HOY</span><br>
                <span class="metric-value" style="color:{color_hoy}; font-size:1.2rem">{valor_hoy}</span>
                <span style="font-size:0.8rem; color:#64748b;"> {unidad}</span>
            </div>
            <div style="text-align:right;">
                <span style="font-size:0.65rem; color:#94a3b8;">28-A</span><br>
                <span class="metric-value" style="color:{color_28a}; font-size:1.2rem">{valor_28a}</span>
                <span style="font-size:0.8rem; color:#64748b;"> {unidad}</span>
            </div>
        </div>
        <div class="metric-sub">
            Δ vs colapso:&nbsp;
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

    # ── Semáforo global ──────────────────────────────────────────────────────
    riesgo = 0
    if snap:
        inercia = snap.get("inercia") or 2.0
        if inercia < 1.5:
            riesgo = 2   # rojo
        elif inercia < 2.5:
            riesgo = 1   # ámbar
    color_barra = "#10b981" if riesgo == 0 else "#f59e0b" if riesgo == 1 else "#ef4444"
    st.markdown(
        f'<div class="status-bar" style="background-color:{color_barra};"></div>',
        unsafe_allow_html=True
    )

    # ── Encabezado ───────────────────────────────────────────────────────────
    st.markdown("### 🔬 ANÁLISIS FORENSE — 28 DE ABRIL DE 2025")
    st.markdown(
        "<p style='color:#94a3b8; font-size:0.85rem;'>Sincronización de registros PMU (ENTSO-E) y telemedidas (REE). "
        "Las curvas <span style='color:#ef4444;'>rojas</span> indican el colapso histórico; las curvas "
        "<span style='color:#06b6d4;'>cyan</span> reflejan el estado actual de la red.</p>",
        unsafe_allow_html=True
    )
    _banner_estado_archivos()
    st.markdown("<hr>", unsafe_allow_html=True)

    # ── Carga de datos ───────────────────────────────────────────────────────
    try:
        df_freq    = cargar_frecuencia_28a()
        df_demanda = cargar_demanda_28a()
        df_precios = cargar_precios_28a()
        df_desbal  = cargar_desbalance_28a()
    except FileNotFoundError as e:
        st.error(f"**Error crítico:** {e}")
        return

    stats_f = stats_frecuencia_28a(df_freq)
    stats_p = stats_precios_28a(df_desbal, df_precios)

    # ── Tarjetas duales HOY vs 28-A ──────────────────────────────────────────
    st.markdown("#### ⚡ Telemetría crítica — HOY vs 28-A")
    col1, col2, col3, col4 = st.columns(4)

    hoy_inercia     = snap.get("inercia")     or 0.0 if snap else 0.0
    hoy_penetracion = snap.get("penetracion") or 0.0 if snap else 0.0
    hoy_frecuencia  = snap.get("frecuencia")  or 50.0 if snap else 50.0
    hoy_rocof       = snap.get("rocof")       or 0.0 if snap else 0.0

    ref_inercia     = 1.18
    ref_penetracion = 84.5
    ref_frecuencia  = 49.85
    ref_rocof       = 0.48

    with col1:
        delta = hoy_penetracion - ref_penetracion
        clase = "mejor" if delta < 0 else "peor"
        st.markdown(
            _generar_tarjeta_dual(
                "Penetración renovable",
                f"{hoy_penetracion:.1f}", ref_penetracion, "%",
                f"{delta:+.1f}% ({clase})", clase
            ),
            unsafe_allow_html=True
        )

    with col2:
        delta = hoy_inercia - ref_inercia
        clase = "mejor" if delta > 0 else "peor"
        st.markdown(
            _generar_tarjeta_dual(
                "Inercia equivalente",
                f"{hoy_inercia:.2f}", ref_inercia, "s",
                f"{delta:+.2f}s ({clase})", clase
            ),
            unsafe_allow_html=True
        )

    with col3:
        delta = hoy_frecuencia - ref_frecuencia
        clase = "mejor" if delta > 0 else "peor"
        st.markdown(
            _generar_tarjeta_dual(
                "Frecuencia",
                f"{hoy_frecuencia:.3f}", ref_frecuencia, "Hz",
                f"{delta:+.3f} Hz ({clase})", clase
            ),
            unsafe_allow_html=True
        )

    with col4:
        delta = hoy_rocof - ref_rocof
        clase = "mejor" if delta < 0 else "peor"
        st.markdown(
            _generar_tarjeta_dual(
                "RoCoF",
                f"{hoy_rocof:.2f}", ref_rocof, "Hz/s",
                f"{delta:+.2f} Hz/s ({clase})", clase
            ),
            unsafe_allow_html=True
        )

    st.markdown("<hr>", unsafe_allow_html=True)

    # ── Sismógrafo de frecuencia ─────────────────────────────────────────────
    st.markdown("#### 〰️ Sismógrafo de Frecuencia (ECG de la red)")
    frecuencia_hoy = snap.get("frecuencia") if snap else None
    st.plotly_chart(
        fig_sismografo_frecuencia(df_freq, frecuencia_hoy),
        use_container_width=True
    )

    st.markdown("<hr>", unsafe_allow_html=True)

    # ── Gráficas secundarias en dos columnas ─────────────────────────────────
    col_left, col_right = st.columns(2)
    with col_left:
        demanda_hoy = snap.get("demanda") if snap else None
        st.plotly_chart(
            fig_demanda_real_vs_prev(df_demanda, demanda_hoy),
            use_container_width=True
        )
    with col_right:
        precio_spot_hoy = snap.get("precio_spot") if snap else None
        st.plotly_chart(
            fig_tormenta_de_precios(df_desbal, df_precios, precio_spot_hoy),
            use_container_width=True
        )

    st.markdown("<hr>", unsafe_allow_html=True)

    # ── Comparativa superpuesta HOY vs 28-A ──────────────────────────────────
    st.markdown("#### 📊 Telemetría superpuesta — HOY vs 28-A")
    historial_freq = st.session_state.get("historial_frecuencia", [])
    st.plotly_chart(
        fig_comparativa_superpuesta(df_demanda, df_freq, historial_freq, demanda_hoy),
        use_container_width=True
    )

    # ── Fuentes y metodología ────────────────────────────────────────────────
    with st.expander("📚 Fuentes y metodología"):
        st.markdown("""
        | Dataset | Fuente | Resolución |
        |---|---|---|
        | Frecuencia | ENTSO-E PMU | Eventos (segundos) |
        | Demanda | ESIOS REE | 5 min |
        | Precio SPOT | ESIOS/OMIE | 1h |
        | Precio desbalance | ENTSO-E TR 17.1.G&H | 15 min |
        """)
