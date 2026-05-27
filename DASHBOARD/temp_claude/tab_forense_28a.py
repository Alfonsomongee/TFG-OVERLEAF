"""
tab_forense_28a.py — Pestaña de Análisis Forense del 28-A

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


def _banner_estado_archivos():
    """Muestra qué archivos se han cargado y cuáles faltan."""
    estado = verificar_archivos()
    todos_ok = all(v["ok"] for v in estado.values())

    if todos_ok:
        st.success("✅ Todos los archivos JSON del 28-A localizados — datos reales")
        return

    with st.expander("⚠️ Estado de archivos forenses"):
        for nombre, info in estado.items():
            if info["ok"]:
                st.markdown(f"✅ `{nombre}` → `{info['ruta']}`")
            else:
                st.markdown(
                    f"❌ `{nombre}` — no encontrado\n\n"
                    f"Edita `_BASES` en `cargador_28a.py` para apuntar a la carpeta correcta."
                )


def render_tab_forense(snap: dict):
    """
    Renderiza la pestaña completa de Análisis Forense del 28-A.

    Args:
        snap: st.session_state.ultimo_snapshot — datos actuales del sistema
    """
    st.markdown("### 🔬 Análisis Forense — 28 de abril de 2025")
    st.markdown(
        "Datos reales de REE/ESIOS y ENTSO-E del día del colapso eléctrico peninsular. "
        "La línea **azul** representa el estado actual del sistema para comparación directa."
    )

    _banner_estado_archivos()
    st.markdown("---")

    # ── Carga de datos (cacheados) ────────────────────────────────────────────
    try:
        df_freq     = cargar_frecuencia_28a()
        df_demanda  = cargar_demanda_28a()
        df_precios  = cargar_precios_28a()
        df_desbal   = cargar_desbalance_28a()
    except FileNotFoundError as e:
        st.error(
            f"**Error cargando datos:** {e}\n\n"
            "Comprueba que la carpeta `tfg-antigravity-docs/static/data/` "
            "está en una ruta relativa correcta desde la carpeta del dashboard.\n\n"
            "Edita la lista `_BASES` en `cargador_28a.py` si es necesario."
        )
        return

    # ── Métricas de estadísticas (encabezado impactante) ─────────────────────
    stats_f = stats_frecuencia_28a(df_freq)
    stats_p = stats_precios_28a(df_desbal, df_precios)

    col1, col2, col3, col4, col5 = st.columns(5)

    with col1:
        st.metric(
            "Frecuencia mínima",
            f"{stats_f.get('freq_min', '–'):.3f} Hz",
            delta=f"Nadir: {stats_f.get('hora_nadir', '–')}",
            delta_color="off",
            help="Frecuencia mínima registrada por PMUs durante el colapso (ENTSO-E)",
        )
    with col2:
        st.metric(
            "RoCoF máximo",
            f"{stats_f.get('rocof_max', 0):.2f} Hz/s" if stats_f.get("rocof_max") else "~2.0 Hz/s",
            delta="Umbral NC RfG: 1.0 Hz/s",
            delta_color="off",
        )
    with col3:
        st.metric(
            "Precio desbalance pico",
            f"{stats_p.get('desbalance_max', 0):,.0f} €/MWh",
            delta=f"a las {stats_p.get('hora_desbal_max', '–')}",
            delta_color="off",
            help="Precio de desvíos contrarios ENTSO-E durante el caos del mercado",
        )
    with col4:
        st.metric(
            "Precio SPOT mínimo",
            f"{stats_p.get('spot_min', 0):.2f} €/MWh",
            delta=f"{stats_p.get('horas_neg', 0)} horas negativas",
            delta_color="off",
            help="El precio negativo refleja el exceso de generación solar antes del colapso",
        )
    with col5:
        st.metric(
            "Eventos PMU registrados",
            f"{stats_f.get('n_eventos', 0)}",
            delta="REE + ENTSO-E",
            delta_color="off",
            help="Número de eventos documentados con marca temporal precisa",
        )

    st.markdown("---")

    # ══════════════════════════════════════════════════════════════════════════
    # GRÁFICA 1: SISMÓGRAFO DE FRECUENCIA (la más impactante)
    # ══════════════════════════════════════════════════════════════════════════

    st.markdown("#### 🌊 Sismógrafo de Frecuencia")
    st.caption(
        "Evolución segundo a segundo de la frecuencia de red el 28-A. "
        "Cada punto anotado corresponde a un evento documentado por PMUs de ENTSO-E o el "
        "cuaderno de maniobras de REE. La línea azul muestra la frecuencia actual del sistema."
    )

    frecuencia_hoy = snap.get("frecuencia") if snap else None
    st.plotly_chart(
        fig_sismografo_frecuencia(df_freq, frecuencia_hoy=frecuencia_hoy),
        use_container_width=True,
    )

    # Tabla de eventos expandible
    if "evento" in df_freq.columns:
        eventos_df = df_freq[df_freq["evento"].notna() & (df_freq["evento"] != "")][
            ["hora_dt", "t_s", "freq", "rocof", "evento", "evento_tipo", "confianza"]
        ].copy()
        if not eventos_df.empty:
            eventos_df["hora_dt"] = eventos_df["hora_dt"].dt.strftime("%H:%M:%S")
            eventos_df.columns = ["Hora (CEST)", "t (s)", "Frec. (Hz)",
                                   "RoCoF (Hz/s)", "Evento", "Tipo", "Confianza"]
            with st.expander(f"📋 Ver los {len(eventos_df)} eventos documentados"):
                st.dataframe(eventos_df, use_container_width=True, hide_index=True)

    st.markdown("---")

    # ══════════════════════════════════════════════════════════════════════════
    # GRÁFICA 2: PRECIPICIO DE DEMANDA
    # ══════════════════════════════════════════════════════════════════════════

    st.markdown("#### ⚡ El Precipicio — Demanda Real vs Programada vs Prevista")
    st.caption(
        "El sistema estaba perfectamente planificado. La curva de demanda programada y la prevista "
        "discurren con normalidad. La demanda real las sigue hasta las 12:33h, momento en el que "
        "colapsa verticalmente. La brecha gris→rojo es el fallo total del sistema."
    )

    demanda_hoy = snap.get("demanda") if snap else None
    st.plotly_chart(
        fig_demanda_real_vs_prev(df_demanda, demanda_hoy=demanda_hoy),
        use_container_width=True,
    )

    st.markdown("---")

    # ══════════════════════════════════════════════════════════════════════════
    # GRÁFICA 3: TORMENTA DE PRECIOS
    # ══════════════════════════════════════════════════════════════════════════

    st.markdown("#### 💸 La Tormenta de Precios — Desbalance vs SPOT")
    st.caption(
        "Antes del colapso: precios SPOT negativos por exceso de solar (el mercado paga "
        "por consumir). Durante el colapso: el precio de desbalance ENTSO-E se dispara hasta "
        f"**{stats_p.get('desbalance_max', 0):,.0f} €/MWh** — "
        "más de 150 veces el precio normal."
    )

    precio_spot_hoy = snap.get("precio_spot") if snap else None
    col_a, col_b = st.columns([3, 1])
    with col_a:
        st.plotly_chart(
            fig_tormenta_de_precios(df_desbal, df_precios, precio_spot_hoy),
            use_container_width=True,
        )
    with col_b:
        st.markdown("**Contexto**")
        st.markdown(
            "🟢 **< 80 €/MWh** — Normal\n\n"
            "🟡 **80–200 €/MWh** — Elevado\n\n"
            "🔴 **200–1.000 €/MWh** — Crisis\n\n"
            f"💀 **{stats_p.get('desbalance_max', 15000):,.0f} €/MWh** — 28-A"
        )
        if stats_p.get("horas_neg", 0) > 0:
            st.info(
                f"⚡ {stats_p['horas_neg']} horas con "
                "precio SPOT **negativo** antes del colapso\n\n"
                "El mercado _pagaba_ por consumir electricidad."
            )

    st.markdown("---")

    # ══════════════════════════════════════════════════════════════════════════
    # GRÁFICA 4: COMPARATIVA SUPERPUESTA HOY vs 28-A
    # ══════════════════════════════════════════════════════════════════════════

    st.markdown("#### 📊 Comparativa Directa — HOY vs 28-A")
    st.caption(
        "Las curvas rojas son el 28-A. Las azules son el estado actual del sistema. "
        "Cuanto más se acerquen los azules a los rojos, mayor el riesgo."
    )

    historial_freq = st.session_state.get("historial_frecuencia", [])
    st.plotly_chart(
        fig_comparativa_superpuesta(
            df_demanda_28a=df_demanda,
            df_freq_28a=df_freq,
            historial_freq_hoy=historial_freq,
            demanda_hoy=demanda_hoy,
        ),
        use_container_width=True,
    )

    # ── Nota metodológica ─────────────────────────────────────────────────────
    with st.expander("📚 Fuentes y metodología"):
        st.markdown("""
        | Dataset | Fuente | Resolución |
        |---------|--------|------------|
        | Frecuencia | ENTSO-E PMU data | Por evento (segundos) |
        | Demanda | ESIOS REE | 5 minutos |
        | Precio SPOT | ESIOS / OMIE | 1 hora |
        | Precio desbalance | ENTSO-E TR 17.1.G&H | 15 minutos |
        
        **Nota:** `t=0` en frequency_28A.json corresponde al colapso de las 12:33 CEST (10:33 UTC).
        Valores negativos de `t` son minutos/segundos previos al colapso.
        
        **Referencias normativas:**
        - RoCoF: NC RfG Artículo 14(3), ENTSO-E 2017
        - UFLS: P.O. 1.6 REE "Control de frecuencia e inercia"
        - Precios desbalance: ENTSO-E Transparency Regulation 17.1.G&H
        """)
