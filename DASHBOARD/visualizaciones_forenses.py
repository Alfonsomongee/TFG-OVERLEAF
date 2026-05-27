"""
visualizaciones_forenses.py — Gráficas forenses unificadas con estética premium
Paleta: #0a0c10 fondo, #111827 tarjetas, #ef4444 rojo 28A, #06b6d4 cyan hoy
Badges, gradientes, tipografía Outfit/Inter/JetBrains.
"""

from typing import Optional
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# =============================================================================
# PALETA DE COLORES (Forensic / Cyberpunk Editorial)
# =============================================================================
C_HOY       = "#06b6d4"      # Cyan neón — datos de hoy
C_28A       = "#ef4444"      # Rojo alarma — 28-A
C_PROG      = "#64748b"      # Gris slate — previsiones
C_VERDE     = "#10b981"      # Verde esmeralda
C_AMBAR     = "#f59e0b"      # Ámbar
C_MAGENTA   = "#d946ef"      # Magenta (fallo sistémico)
C_FONDO     = "rgba(0,0,0,0)"
C_GRID      = "rgba(255,255,255,0.04)"

# Timestamp del colapso
T_COLAPSO_DT = pd.Timestamp("2025-04-28 12:33:00")
T_COLAPSO_STR = "2025-04-28 12:33:00"

_LAYOUT_BASE = dict(
    paper_bgcolor=C_FONDO,
    plot_bgcolor=C_FONDO,
    font=dict(color="#cbd5e1", size=11, family="JetBrains Mono, monospace"),
    legend=dict(bgcolor="rgba(17,24,39,0.8)", bordercolor="rgba(255,255,255,0.1)", borderwidth=1),
    margin=dict(l=15, r=15, t=70, b=30),
    hovermode="x unified",
    hoverlabel=dict(bgcolor="#111827", font_size=10, font_family="JetBrains Mono"),
)


def _add_source_badge(fig: go.Figure, texto: str, x: float = 0.98, y: float = 0.98):
    """Añade un badge de fuente en la esquina superior derecha."""
    fig.add_annotation(
        x=x, y=y, xref="paper", yref="paper",
        text=f"<span style='background:#1e2433; padding:2px 8px; border-radius:4px; font-family:JetBrains Mono; font-size:0.7rem; color:#8b9bb4;'>{texto}</span>",
        showarrow=False, font=dict(size=9), xanchor="right", yanchor="top",
        bgcolor="rgba(0,0,0,0)", borderwidth=0
    )
    return fig


def _add_gradient_context(fig: go.Figure):
    """Añade zonas de gradiente: tensión (ámbar) y colapso (rojo)."""
    fig.add_vrect(
        x0="2025-04-28 12:00:00", x1=T_COLAPSO_STR,
        fillcolor="rgba(245,158,11,0.06)", layer="below", line_width=0,
        annotation_text="Tensión creciente", annotation_position="top left",
        annotation_font=dict(color="#f59e0b", size=9)
    )
    fig.add_vrect(
        x0=T_COLAPSO_STR, x1="2025-04-28 13:10:00",
        fillcolor="rgba(239,68,68,0.10)", layer="below", line_width=0,
        annotation_text="COLAPSO", annotation_position="top left",
        annotation_font=dict(color="#ef4444", size=9)
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 1. SISMÓGRAFO DE FRECUENCIA
# ══════════════════════════════════════════════════════════════════════════════

def fig_sismografo_frecuencia(
    df_freq: pd.DataFrame,
    frecuencia_hoy: Optional[float] = None,
) -> go.Figure:
    """Sismógrafo de frecuencia con bandas, eventos y gradientes."""
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Bandas de alerta
    bandas = [
        (49.8, 50.3, "rgba(16,185,129,0.04)", None),
        (49.5, 49.8, "rgba(245,158,11,0.06)", "Banda primaria"),
        (49.0, 49.5, "rgba(239,68,68,0.10)", "UFLS 1er escalón"),
        (47.5, 49.0, "rgba(185,28,28,0.15)", "Zona crítica"),
    ]
    for y0, y1, color, label in bandas:
        fig.add_hrect(y0=y0, y1=y1, fillcolor=color, layer="below", line_width=0)

    # Curva de frecuencia
    if not df_freq.empty and "hora_dt" in df_freq.columns:
        fig.add_trace(go.Scatter(
            x=df_freq["hora_dt"],
            y=df_freq["freq"],
            name="Frecuencia 28-A",
            line=dict(color=C_28A, width=1.8),
            fill="tonexty",
            fillcolor="rgba(239,68,68,0.03)",
            hovertemplate="<b>%{x|%H:%M:%S}</b><br>%{y:.3f} Hz<extra></extra>",
        ), secondary_y=False)

    # Gradiente de contexto
    fig = _add_gradient_context(fig)

    # Línea vertical del colapso
    fig.add_vline(x=T_COLAPSO_STR, line=dict(color=C_28A, width=1.5, dash="dash"))
    fig.add_annotation(
        x=T_COLAPSO_STR, y=1, yref="paper",
        text="⚡ COLAPSO 12:33",
        showarrow=False,
        font=dict(color=C_28A, size=10, family="JetBrains Mono"),
        xanchor="right", yanchor="bottom"
    )

    # Umbrales horizontales
    for f_val, color, texto in [
        (50.0, C_VERDE, "50 Hz nominal"),
        (49.5, C_AMBAR, "49.5 Hz — UFLS 1º"),
        (49.0, C_28A, "49.0 Hz — UFLS 2º"),
    ]:
        fig.add_hline(
            y=f_val, line=dict(color=color, dash="dot", width=0.8),
            annotation_text=texto, annotation_font=dict(color=color, size=8),
            secondary_y=False,
        )

    # Línea de frecuencia actual
    if frecuencia_hoy is not None:
        fig.add_hline(
            y=frecuencia_hoy,
            line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"▶ HOY: {frecuencia_hoy:.3f} Hz",
            annotation_font=dict(color=C_HOY, size=10),
            annotation_position="top left",
            secondary_y=False,
        )

    # Badge de fuente
    fig = _add_source_badge(fig, "ENTSO-E · PMU data · RoCoF · 1 Hz")

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="🌊 Sismógrafo de Frecuencia — El ECG del colapso ibérico",
            font=dict(family="Outfit, sans-serif", size=16, color="#f8fafc"),
            x=0.05, xanchor="left"
        ),
        height=460,
        yaxis=dict(title="Frecuencia (Hz)", range=[47.5, 50.5], gridcolor=C_GRID, tickformat=".2f"),
        yaxis2=dict(title="RoCoF (Hz/s)", gridcolor="rgba(0,0,0,0)", zerolinecolor=C_GRID),
        xaxis=dict(title="Hora (CEST)", gridcolor=C_GRID, tickformat="%H:%M"),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 2. PRECIPICIO DE DEMANDA
# ══════════════════════════════════════════════════════════════════════════════

def fig_demanda_real_vs_prev(
    df_demanda: pd.DataFrame,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """Demanda real vs programada con zona de colapso y badge."""
    fig = go.Figure()

    # Gradiente de contexto
    fig = _add_gradient_context(fig)

    # Zona de colapso (extendida visualmente)
    colapso_end = T_COLAPSO_DT + pd.Timedelta(minutes=37)
    fig.add_vrect(
        x0=T_COLAPSO_STR, x1=colapso_end.strftime("%Y-%m-%d %H:%M:%S"),
        fillcolor="rgba(239,68,68,0.08)", layer="below", line_width=0
    )

    # Demanda prevista
    if not df_demanda.empty and "demanda_prev_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_prev_mw"],
            name="Prevista", line=dict(color=C_PROG, dash="dot", width=1.5),
            hovertemplate="%{y:,.0f} MW (prevista)<extra></extra>",
        ))

    # Demanda real 28-A
    if not df_demanda.empty and "demanda_real_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_real_mw"],
            name="Real 28-A", line=dict(color=C_28A, width=2.5),
            fill="tozeroy", fillcolor="rgba(239,68,68,0.03)",
            hovertemplate="<b>%{x|%H:%M}</b> → %{y:,.0f} MW<extra></extra>",
        ))

    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy, line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"▶ HOY: {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=10),
            annotation_position="top right",
        )

    fig = _add_source_badge(fig, "ESIOS · Indicador 1294 / 1775 · 5 min")

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="⚡ El Precipicio — Demanda real vs. programada",
            font=dict(family="Outfit, sans-serif", size=16, color="#f8fafc"),
            x=0.05, xanchor="left"
        ),
        height=380,
        yaxis=dict(title="Demanda (MW)", gridcolor=C_GRID, tickformat=","),
        xaxis=dict(title="Hora (CEST)", gridcolor=C_GRID, tickformat="%H:%M"),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 3. TORMENTA DE PRECIOS
# ══════════════════════════════════════════════════════════════════════════════

def fig_tormenta_de_precios(
    df_desbalance: pd.DataFrame,
    df_precios: pd.DataFrame,
    precio_spot_hoy: Optional[float] = None,
) -> go.Figure:
    """Precio desbalance (barras) y SPOT (línea) con gradiente de colapso."""
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Gradiente colapso
    fig.add_vrect(
        x0=T_COLAPSO_STR, x1=(T_COLAPSO_DT + pd.Timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S"),
        fillcolor="rgba(239,68,68,0.08)", layer="below", line_width=0,
    )

    # Barras de desbalance
    if not df_desbalance.empty and "precio_max_eur" in df_desbalance.columns:
        colores = [C_28A if p > 1000 else C_AMBAR if p > 200 else C_VERDE for p in df_desbalance["precio_max_eur"]]
        fig.add_trace(go.Bar(
            x=df_desbalance["hora_dt"], y=df_desbalance["precio_max_eur"],
            name="Desbalance ENTSO-E", marker_color=colores, opacity=0.85,
            hovertemplate="<b>%{x|%H:%M}</b><br>%{y:,.0f} €/MWh<extra></extra>",
        ), secondary_y=False)

    # Precio SPOT
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        fig.add_trace(go.Scatter(
            x=df_precios["hora_dt"], y=df_precios["spot_eur"],
            name="SPOT OMIE", line=dict(color=C_AMBAR, width=2.5),
            hovertemplate="<b>%{x|%H:%M}</b><br>SPOT: %{y:.2f} €/MWh<extra></extra>",
        ), secondary_y=True)

    fig.add_hline(y=80, line=dict(color=C_PROG, dash="dot", width=0.8),
                  annotation_text="80 €/MWh (normal)", annotation_font=dict(color=C_PROG, size=8),
                  secondary_y=False)

    if precio_spot_hoy is not None:
        fig.add_hline(
            y=precio_spot_hoy, line=dict(color=C_HOY, width=1.5, dash="longdash"),
            annotation_text=f"▶ HOY SPOT: {precio_spot_hoy:.1f} €/MWh",
            annotation_font=dict(color=C_HOY, size=8),
            secondary_y=True,
        )

    fig = _add_source_badge(fig, "ENTSO-E (A85) + ESIOS (600) · 15-60 min")

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="💸 Tormenta de Precios — Desbalance vs. SPOT",
            font=dict(family="Outfit, sans-serif", size=16, color="#f8fafc"),
            x=0.05, xanchor="left"
        ),
        height=380,
        barmode="overlay",
        yaxis=dict(title="Desbalance (€/MWh)", gridcolor=C_GRID),
        yaxis2=dict(title="SPOT (€/MWh)", gridcolor="rgba(0,0,0,0)"),
        xaxis=dict(title="Hora (CEST)", gridcolor=C_GRID, tickformat="%H:%M"),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 4. COMPARATIVA SUPERPUESTA HOY vs 28-A
# ══════════════════════════════════════════════════════════════════════════════

def fig_comparativa_superpuesta(
    df_demanda_28a: pd.DataFrame,
    df_freq_28a: pd.DataFrame,
    historial_freq_hoy: list,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """Comparativa directa hoy vs 28A con gradientes y badges."""
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=False,
        subplot_titles=("Demanda (MW)", "Frecuencia (Hz)"),
        row_heights=[0.55, 0.45],
        vertical_spacing=0.12,
    )

    colapso_end = T_COLAPSO_DT + pd.Timedelta(minutes=37)
    for row in [1, 2]:
        fig.add_vrect(
            x0=T_COLAPSO_STR, x1=colapso_end.strftime("%Y-%m-%d %H:%M:%S"),
            fillcolor="rgba(239,68,68,0.06)", layer="below", line_width=0,
            row=row, col=1,
        )

    # Demanda 28-A
    if not df_demanda_28a.empty and "demanda_real_mw" in df_demanda_28a.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda_28a["hora_dt"], y=df_demanda_28a["demanda_real_mw"],
            name="Demanda 28-A", line=dict(color=C_28A, width=2),
            fill="tozeroy", fillcolor="rgba(239,68,68,0.03)",
            hovertemplate="%{x|%H:%M} → %{y:,.0f} MW<extra>28-A</extra>",
        ), row=1, col=1)

    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy, line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"HOY: {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=9),
            row=1, col=1,
        )

    # Frecuencia 28-A
    if not df_freq_28a.empty and "hora_dt" in df_freq_28a.columns:
        fig.add_trace(go.Scatter(
            x=df_freq_28a["hora_dt"], y=df_freq_28a["freq"],
            name="Frecuencia 28-A", line=dict(color=C_28A, width=1.8),
            hovertemplate="%{x|%H:%M:%S} → %{y:.3f} Hz<extra>28-A</extra>",
        ), row=2, col=1)

    if historial_freq_hoy:
        df_hoy = pd.DataFrame(historial_freq_hoy)
        if "freq" in df_hoy.columns and "time" in df_hoy.columns:
            fig.add_trace(go.Scatter(
                x=df_hoy["time"], y=df_hoy["freq"],
                name="Frecuencia HOY", line=dict(color=C_HOY, width=2),
                hovertemplate="%{x} → %{y:.4f} Hz<extra>HOY</extra>",
            ), row=2, col=1)

    for f_val, color, texto in [(50.0, C_VERDE, "50 Hz"), (49.5, C_AMBAR, "UFLS 49.5")]:
        fig.add_hline(
            y=f_val, line=dict(color=color, dash="dot", width=0.8),
            annotation_text=texto, annotation_font=dict(color=color, size=7),
            row=2, col=1,
        )

    # Badge global
    fig.add_annotation(
        x=0.98, y=0.98, xref="paper", yref="paper",
        text="<span style='background:#1e2433; padding:2px 8px; border-radius:4px;'>ESIOS + ENTSO-E · Datos reales</span>",
        showarrow=False, font=dict(size=9), xanchor="right", yanchor="top",
        bgcolor="rgba(0,0,0,0)"
    )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="📊 HOY vs 28-A — Telemetría superpuesta",
            font=dict(family="Outfit, sans-serif", size=16),
            x=0.05, xanchor="left"
        ),
        height=540,
    )
    fig.update_yaxes(gridcolor=C_GRID)
    fig.update_xaxes(gridcolor=C_GRID, tickformat="%H:%M")
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 5. FUNCIONES AUXILIARES DE ESTADÍSTICAS (sin cambios)
# ══════════════════════════════════════════════════════════════════════════════

def stats_frecuencia_28a(df_freq: pd.DataFrame) -> dict:
    if df_freq.empty:
        return {}
    return {
        "freq_min":       df_freq["freq"].min(),
        "freq_max":       df_freq["freq"].max(),
        "t_nadir_s":      int(df_freq.loc[df_freq["freq"].idxmin(), "t_s"]) if "t_s" in df_freq.columns else 0,
        "rocof_max":      df_freq["rocof"].abs().max() if "rocof" in df_freq.columns else None,
        "n_eventos":      df_freq["evento"].notna().sum() if "evento" in df_freq.columns else 0,
        "hora_nadir":     df_freq.loc[df_freq["freq"].idxmin(), "hora_dt"].strftime("%H:%M:%S") if "hora_dt" in df_freq.columns else "",
        "hora_colapso":   "12:33:00",
    }

def stats_precios_28a(df_desbalance: pd.DataFrame, df_precios: pd.DataFrame) -> dict:
    resultado = {}
    if not df_desbalance.empty and "precio_max_eur" in df_desbalance.columns:
        resultado["desbalance_max"]  = df_desbalance["precio_max_eur"].max()
        idx = df_desbalance["precio_max_eur"].idxmax()
        resultado["hora_desbal_max"] = df_desbalance.loc[idx, "hora_dt"].strftime("%H:%M") if "hora_dt" in df_desbalance.columns else ""
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        resultado["spot_min"]   = df_precios["spot_eur"].min()
        resultado["spot_max"]   = df_precios["spot_eur"].max()
        resultado["horas_neg"]  = (df_precios["spot_eur"] < 0).sum()
    return resultado
