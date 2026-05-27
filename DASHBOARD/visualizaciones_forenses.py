"""
visualizaciones_forenses.py — Gráficas de alto impacto para el TFG (diseño Bloomberg Terminal)

Cuatro visualizaciones construidas sobre los datos reales del 28-A:

  fig_sismografo_frecuencia()   → La caída de 50 Hz a 48.8 Hz — estilo glow cinematográfico
  fig_demanda_real_vs_prev()    → El precipicio de demanda: real vs programada vs prevista
  fig_tormenta_de_precios()     → Los 15.000 €/MWh del desbalance vs SPOT (eje log)
  fig_comparativa_superpuesta() → Hoy vs 28-A en subplots apilados (MW arriba, Hz abajo)
"""

from datetime import datetime, timedelta
from typing import Optional

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ─── Paleta forense (física, profunda, no Tailwind plano) ─────────────────────
C_HOY    = "#06b6d4"   # cyan           — datos de hoy
C_28A    = "#ff5a36"   # rojo anaranjado — datos del 28-A (físico, profundo)
C_PROG   = "#475569"   # gris pizarra   — programado/previsto
C_VERDE  = "#10b981"   # esmeralda      — zona segura
C_AMBAR  = "#f59e0b"   # ámbar          — zona de alerta
C_FONDO  = "rgba(0,0,0,0)"
C_GRID_H = "rgba(255,255,255,0.08)"   # horizontales más visibles (se siguen con el ojo)
C_GRID_V = "rgba(0,0,0,0)"           # verticales invisibles (señales temporales)

# Hora del colapso — pd.Timestamp para aritmética con pd.Timedelta
T_COLAPSO_DT = pd.Timestamp("2025-04-28 12:33:00")

_LAYOUT_BASE = dict(
    paper_bgcolor=C_FONDO,
    plot_bgcolor="rgba(11,15,25,0.6)",   # fondo oscuro sutil, no totalmente transparente
    font=dict(color="#e2e8f0", size=13, family="Inter, sans-serif"),
    legend=dict(
        bgcolor="rgba(17,24,39,0.85)",
        bordercolor="rgba(255,255,255,0.08)",
        borderwidth=1,
        font=dict(size=12),
    ),
    margin=dict(l=10, r=10, t=80, b=10),
    hovermode="x unified",
    hoverlabel=dict(
        bgcolor="rgba(11,15,25,0.95)",
        bordercolor="rgba(6,182,212,0.4)",
        font=dict(family="JetBrains Mono, monospace", size=12),
    ),
)


# ══════════════════════════════════════════════════════════════════════════════
# 1. SISMÓGRAFO DE FRECUENCIA — Bloomberg Terminal style
# ══════════════════════════════════════════════════════════════════════════════

def fig_sismografo_frecuencia(
    df_freq: pd.DataFrame,
    frecuencia_hoy: Optional[float] = None,
) -> go.Figure:
    """Sismógrafo de frecuencia del 28-A — línea brillante con glow, sin fill sólido."""
    fig = make_subplots(
        rows=2, cols=1,
        row_heights=[0.82, 0.18],
        vertical_spacing=0.04,
        shared_xaxes=True,
        specs=[[{"secondary_y": True}], [{}]],
    )

    # ── Bandas de alerta (fondo discreto) ────────────────────────────────────
    bandas = [
        (49.8,  50.3, "rgba(16,185,129,0.04)",  None),
        (49.5,  49.8, "rgba(245,158,11,0.07)",  "Banda primaria P.O.1.6"),
        (49.0,  49.5, "rgba(255,90,54,0.09)",   "UFLS escalón 1 · 49.5 Hz"),
        (48.5,  49.0, "rgba(220,38,38,0.12)",   "UFLS escalón 2 · 49.0 Hz"),
        (47.5,  48.5, "rgba(100,0,0,0.20)",     "Zona desconexión"),
    ]
    for y0, y1, color, label in bandas:
        kwargs = {}
        if label:
            kwargs = {
                "annotation_text": label,
                "annotation_position": "right",
                "annotation_font": dict(color="rgba(148,163,184,0.7)", size=10),
            }
        fig.add_hrect(y0=y0, y1=y1, fillcolor=color, layer="below", line_width=0,
                      row=1, col=1, **kwargs)

    if not df_freq.empty and "hora_dt" in df_freq.columns and "freq" in df_freq.columns:
        # ── GLOW: trazo ancho semitransparente detrás ─────────────────────────
        fig.add_trace(go.Scatter(
            x=df_freq["hora_dt"],
            y=df_freq["freq"],
            mode="lines",
            line=dict(color="rgba(255,90,54,0.15)", width=10),
            hoverinfo="skip",
            showlegend=False,
        ), row=1, col=1, secondary_y=False)

        # ── LÍNEA PRINCIPAL brillante — sin fill ─────────────────────────────
        fig.add_trace(go.Scatter(
            x=df_freq["hora_dt"],
            y=df_freq["freq"],
            name="Frecuencia (Hz)",
            mode="lines",
            line=dict(color=C_28A, width=2.2),
            hovertemplate=(
                "<b>%{x|%H:%M:%S}</b><br>"
                "Frecuencia: <b>%{y:.3f} Hz</b><extra></extra>"
            ),
        ), row=1, col=1, secondary_y=False)

        # ── RoCoF en eje secundario ───────────────────────────────────────────
        if "rocof" in df_freq.columns:
            rocof_nz = df_freq[df_freq["rocof"].abs() > 0.01]
            if not rocof_nz.empty:
                fig.add_trace(go.Scatter(
                    x=rocof_nz["hora_dt"],
                    y=rocof_nz["rocof"],
                    name="RoCoF (Hz/s)",
                    mode="markers",
                    marker=dict(color=C_AMBAR, size=5, symbol="diamond",
                                opacity=0.7),
                    hovertemplate="RoCoF: <b>%{y:+.3f} Hz/s</b><extra></extra>",
                ), row=1, col=1, secondary_y=True)

        # ── ANOTACIONES: solo 3 eventos críticos de nivel 1 ──────────────────
        # Los eventos secundarios van al panel de timeline inferior (row=2)
        eventos_criticos = {
            "collapse":         ("#ff5a36", "COLAPSO"),
            "load_shedding":    ("#f59e0b", "UFLS"),
            "protection":       ("#a78bfa", "PROT."),
        }
        if "evento_tipo" in df_freq.columns and "evento" in df_freq.columns:
            for _, row_ev in df_freq[df_freq["evento"].notna() & (df_freq["evento"] != "")].iterrows():
                tipo = str(row_ev.get("evento_tipo", ""))
                if tipo in eventos_criticos:
                    color_ev, prefijo = eventos_criticos[tipo]
                    freq_y = row_ev["freq"] if pd.notna(row_ev["freq"]) else 49.5
                    fig.add_annotation(
                        x=row_ev["hora_dt"], y=freq_y,
                        text=f"▲ {prefijo}",
                        showarrow=True,
                        arrowhead=2, arrowcolor=color_ev, arrowwidth=1.5, arrowsize=0.8,
                        font=dict(color=color_ev, size=11, family="JetBrains Mono, monospace"),
                        bgcolor="rgba(11,15,25,0.90)",
                        bordercolor=color_ev, borderwidth=1, borderpad=4,
                        ax=0, ay=-40,
                        row=1, col=1,
                    )

        # ── Timeline de eventos en banda inferior (row=2) ─────────────────────
        colores_tl = {
            "oscillation":   C_AMBAR,
            "operator_action": "#3b82f6",
            "collapse":      C_28A,
            "recovery":      C_VERDE,
            "protection":    "#a78bfa",
            "load_shedding": "#fb923c",
        }
        if "evento_tipo" in df_freq.columns:
            for _, row_ev in df_freq[df_freq["evento"].notna() & (df_freq["evento"] != "")].iterrows():
                tipo = str(row_ev.get("evento_tipo", ""))
                color_tl = colores_tl.get(tipo, "#64748b")
                label_corto = str(row_ev["evento"])[:30] + ("…" if len(str(row_ev["evento"])) > 30 else "")
                fig.add_trace(go.Scatter(
                    x=[row_ev["hora_dt"], row_ev["hora_dt"]],
                    y=[0, 1],
                    mode="lines+text",
                    line=dict(color=color_tl, width=1, dash="dot"),
                    text=["", label_corto],
                    textposition="top center",
                    textfont=dict(color=color_tl, size=8, family="JetBrains Mono"),
                    hovertemplate=f"<b>{label_corto}</b><extra></extra>",
                    showlegend=False,
                ), row=2, col=1)

    # ── COLAPSO: línea vertical + anotación nivel 1 ───────────────────────────
    fig.add_vline(
        x=T_COLAPSO_DT,
        line=dict(color=C_28A, width=1.5, dash="dash"),
        row=1, col=1,
    )
    fig.add_annotation(
        x=T_COLAPSO_DT, y=0.99, yref="y domain",
        text="⚡ COLAPSO 12:33",
        showarrow=False,
        font=dict(color="#ffffff", size=12, family="JetBrains Mono, monospace"),
        bgcolor=C_28A,
        borderpad=4,
        xanchor="left", yanchor="top",
        row=1, col=1,
    )

    # ── Umbrales horizontales — solo línea fina, anotación en hover ──────────
    for f_val, color, texto in [
        (50.0,  C_VERDE,  "50.00 Hz"),
        (49.5,  C_AMBAR,  "49.50 Hz UFLS"),
        (49.0,  "#ef4444", "49.00 Hz UFLS-2"),
        (48.8,  "#dc2626", "48.80 Hz NADIR"),
    ]:
        fig.add_hline(
            y=f_val,
            line=dict(color=color, dash="dot", width=1),
            annotation_text=texto,
            annotation_font=dict(color=color, size=10, family="JetBrains Mono"),
            annotation_position="left",
            row=1, col=1, secondary_y=False,
        )

    # ── Frecuencia HOY ────────────────────────────────────────────────────────
    if frecuencia_hoy is not None:
        fig.add_hline(
            y=frecuencia_hoy,
            line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"HOY · {frecuencia_hoy:.3f} Hz",
            annotation_font=dict(color=C_HOY, size=11, family="JetBrains Mono"),
            annotation_position="right",
            row=1, col=1, secondary_y=False,
        )

    # ── Layout ────────────────────────────────────────────────────────────────
    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="〰️ Sismógrafo de Frecuencia — 28 abril 2025 · PMU / ENTSO-E",
            font=dict(size=15, color="#e2e8f0", family="Inter, sans-serif"),
            x=0.01,
        ),
        height=560,
        yaxis=dict(
            title="Frecuencia (Hz)",
            range=[47.8, 50.5],
            showgrid=True, gridcolor=C_GRID_H, gridwidth=1,
            tickformat=".2f",
            tickfont=dict(family="JetBrains Mono", size=11),
        ),
        yaxis2=dict(
            title="RoCoF Hz/s",
            range=[-3.5, 3.5],
            showgrid=False,
            zeroline=True, zerolinecolor="rgba(255,255,255,0.08)",
            tickfont=dict(family="JetBrains Mono", size=10),
            overlaying="y",
        ),
        xaxis=dict(
            showgrid=False,
            tickformat="%H:%M",
            tickfont=dict(family="JetBrains Mono", size=11),
        ),
        yaxis3=dict(
            range=[0, 1], showticklabels=False, showgrid=False,
            zeroline=False,
        ),
        xaxis2=dict(
            title="Hora (CEST)",
            showgrid=False,
            tickformat="%H:%M",
            tickfont=dict(family="JetBrains Mono", size=10),
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 2. PRECIPICIO DE DEMANDA
# ══════════════════════════════════════════════════════════════════════════════

def fig_demanda_real_vs_prev(
    df_demanda: pd.DataFrame,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """Demanda real vs programada vs prevista — con glow en la caída."""
    fig = go.Figure()

    # ── Zonas temporales: COLAPSO y BLACK START ───────────────────────────────
    fig.add_vrect(
        x0=T_COLAPSO_DT,
        x1=(T_COLAPSO_DT + pd.Timedelta(minutes=37)),
        fillcolor="rgba(255,90,54,0.08)",
        layer="below", line_width=0,
    )
    fig.add_annotation(
        x=T_COLAPSO_DT, y=0.98, yref="paper",
        text="⚡ COLAPSO",
        showarrow=False,
        font=dict(color="#ffffff", size=11, family="JetBrains Mono"),
        bgcolor=C_28A, borderpad=4,
        xanchor="left", yanchor="top",
    )
    fig.add_vrect(
        x0=(T_COLAPSO_DT + pd.Timedelta(minutes=37)),
        x1=(T_COLAPSO_DT + pd.Timedelta(hours=2)),
        fillcolor="rgba(245,158,11,0.05)",
        layer="below", line_width=0,
    )
    fig.add_annotation(
        x=(T_COLAPSO_DT + pd.Timedelta(minutes=37)), y=0.98, yref="paper",
        text="▶ BLACK START",
        showarrow=False,
        font=dict(color="#ffffff", size=11, family="JetBrains Mono"),
        bgcolor=C_AMBAR, borderpad=4,
        xanchor="left", yanchor="top",
    )

    # ── Curvas de demanda ─────────────────────────────────────────────────────
    if "demanda_prev_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_prev_mw"],
            name="Prevista (REE)",
            mode="lines",
            line=dict(color=C_PROG, dash="dot", width=1.5),
            hovertemplate="%{y:,.0f} MW (prevista)<extra></extra>",
        ))

    if "demanda_prog_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_prog_mw"],
            name="Programada (PDBF)",
            mode="lines",
            line=dict(color="#64748b", dash="dash", width=1.5),
            hovertemplate="%{y:,.0f} MW (programada)<extra></extra>",
        ))

    if "demanda_real_mw" in df_demanda.columns:
        # Glow detrás
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_real_mw"],
            mode="lines",
            line=dict(color="rgba(255,90,54,0.12)", width=9),
            hoverinfo="skip", showlegend=False,
        ))
        # Línea principal
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"], y=df_demanda["demanda_real_mw"],
            name="Real (28-A)",
            mode="lines",
            line=dict(color=C_28A, width=2.2),
            fill="tozeroy",
            fillcolor="rgba(255,90,54,0.04)",
            hovertemplate="<b>%{x|%H:%M}</b> → <b>%{y:,.0f} MW</b><extra>Real 28-A</extra>",
        ))

    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy,
            line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"HOY · {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=11, family="JetBrains Mono"),
            annotation_position="right",
        )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="⚡ El Precipicio — Demanda Real vs Programada vs Prevista",
            font=dict(size=14, color="#e2e8f0", family="Inter, sans-serif"),
            x=0.01,
        ),
        height=440,
        yaxis=dict(
            title="Demanda (MW)",
            showgrid=True, gridcolor=C_GRID_H, gridwidth=1,
            tickformat=",",
            tickfont=dict(family="JetBrains Mono", size=11),
        ),
        xaxis=dict(
            title="Hora (CEST)",
            showgrid=False,
            tickformat="%H:%M",
            tickfont=dict(family="JetBrains Mono", size=11),
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 3. TORMENTA DE PRECIOS — eje logarítmico para mostrar 80 vs 15.000 €/MWh
# ══════════════════════════════════════════════════════════════════════════════

def fig_tormenta_de_precios(
    df_desbalance: pd.DataFrame,
    df_precios: pd.DataFrame,
    precio_spot_hoy: Optional[float] = None,
) -> go.Figure:
    """Precio desbalance (log) vs SPOT — escala logarítmica para ver pico extremo."""
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Zona del colapso
    fig.add_vrect(
        x0=T_COLAPSO_DT,
        x1=(T_COLAPSO_DT + pd.Timedelta(hours=1)),
        fillcolor="rgba(255,90,54,0.07)",
        layer="below", line_width=0,
    )
    fig.add_annotation(
        x=T_COLAPSO_DT, y=0.98, yref="paper",
        text="⚡ COLAPSO",
        showarrow=False,
        font=dict(color="#ffffff", size=10, family="JetBrains Mono"),
        bgcolor=C_28A, borderpad=3,
        xanchor="left", yanchor="top",
    )

    # ── Precio de desbalance (barras, eje log) ────────────────────────────────
    if not df_desbalance.empty and "precio_max_eur" in df_desbalance.columns:
        vals = df_desbalance["precio_max_eur"]
        colores_barra = [
            "#dc2626" if p > 1000 else
            "#f59e0b" if p > 200  else
            "#10b981"
            for p in vals
        ]
        fig.add_trace(go.Bar(
            x=df_desbalance["hora_dt"],
            y=vals,
            name="Precio desbalance",
            marker_color=colores_barra,
            opacity=0.85,
            hovertemplate=(
                "<b>%{x|%H:%M}</b><br>"
                "Desbalance: <b>%{y:,.0f} €/MWh</b><extra></extra>"
            ),
        ), secondary_y=False)

        # Anotación pico máximo
        if not vals.empty:
            idx_max = vals.idxmax()
            pico = df_desbalance.loc[idx_max]
            fig.add_annotation(
                x=pico["hora_dt"],
                y=pico["precio_max_eur"],
                text=f"💀 {pico['precio_max_eur']:,.0f} €/MWh",
                showarrow=True, arrowhead=2, arrowcolor=C_28A,
                font=dict(color="#ffffff", size=11, family="JetBrains Mono"),
                bgcolor=C_28A, borderpad=4,
            )

    # ── Precio SPOT (línea, eje derecho) ──────────────────────────────────────
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        fig.add_trace(go.Scatter(
            x=df_precios["hora_dt"],
            y=df_precios["spot_eur"],
            name="Precio SPOT (OMIE)",
            mode="lines",
            line=dict(color=C_AMBAR, width=2),
            hovertemplate=(
                "<b>%{x|%H:%M}</b><br>"
                "SPOT: <b>%{y:.2f} €/MWh</b><extra></extra>"
            ),
        ), secondary_y=True)

    fig.add_hline(
        y=80, line=dict(color="#475569", dash="dot", width=1),
        annotation_text="80 €/MWh (referencia)",
        annotation_font=dict(color="#475569", size=10),
        secondary_y=False,
    )

    if precio_spot_hoy is not None:
        fig.add_hline(
            y=precio_spot_hoy,
            line=dict(color=C_HOY, width=1.5, dash="longdash"),
            annotation_text=f"HOY SPOT · {precio_spot_hoy:.1f} €/MWh",
            annotation_font=dict(color=C_HOY, size=10, family="JetBrains Mono"),
            secondary_y=True,
        )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="💸 Tormenta de Precios — Desbalance (hasta 15.000 €/MWh) vs SPOT",
            font=dict(size=14, color="#e2e8f0", family="Inter, sans-serif"),
            x=0.01,
        ),
        height=440,
        barmode="overlay",
        yaxis=dict(
            title="Desbalance (€/MWh) · escala log",
            type="log",                                # ← ESCALA LOGARÍTMICA
            showgrid=True, gridcolor=C_GRID_H,
            tickfont=dict(family="JetBrains Mono", size=10),
        ),
        yaxis2=dict(
            title="SPOT OMIE (€/MWh)",
            showgrid=False,
            tickfont=dict(family="JetBrains Mono", size=10),
        ),
        xaxis=dict(
            title="Hora (CEST)",
            showgrid=False,
            tickformat="%H:%M",
            tickfont=dict(family="JetBrains Mono", size=11),
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 4. COMPARATIVA SUPERPUESTA — subplots apilados (MW arriba, Hz abajo)
# ══════════════════════════════════════════════════════════════════════════════

def fig_comparativa_superpuesta(
    df_demanda_28a: pd.DataFrame,
    df_freq_28a: pd.DataFrame,
    historial_freq_hoy: list,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """Comparativa HOY vs 28-A — MW en subplot superior, Hz en subplot inferior."""
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=False,
        subplot_titles=[
            "<b>Demanda (MW)</b> · 28-A real vs HOY",
            "<b>Frecuencia (Hz)</b> · 28-A vs HOY en tiempo real",
        ],
        row_heights=[0.52, 0.48],
        vertical_spacing=0.10,
    )

    # ── Zonas colapso en AMBOS subplots ──────────────────────────────────────
    for row in [1, 2]:
        fig.add_vrect(
            x0=T_COLAPSO_DT,
            x1=(T_COLAPSO_DT + pd.Timedelta(minutes=37)),
            fillcolor="rgba(255,90,54,0.07)", layer="below", line_width=0,
            row=row, col=1,
        )
        fig.add_vline(
            x=T_COLAPSO_DT,
            line=dict(color=C_28A, width=1, dash="dash"),
            row=row, col=1,
        )

    fig.add_annotation(
        x=T_COLAPSO_DT, y=0.99, yref="y domain",
        text="⚡ 12:33", showarrow=False,
        font=dict(color="#ffffff", size=10, family="JetBrains Mono"),
        bgcolor=C_28A, borderpad=3,
        xanchor="left", yanchor="top",
        row=1, col=1,
    )

    # ── SUBPLOT 1: DEMANDA ────────────────────────────────────────────────────
    if not df_demanda_28a.empty and "demanda_real_mw" in df_demanda_28a.columns:
        # Glow
        fig.add_trace(go.Scatter(
            x=df_demanda_28a["hora_dt"], y=df_demanda_28a["demanda_real_mw"],
            mode="lines", line=dict(color="rgba(255,90,54,0.12)", width=9),
            hoverinfo="skip", showlegend=False,
        ), row=1, col=1)
        # Línea
        fig.add_trace(go.Scatter(
            x=df_demanda_28a["hora_dt"], y=df_demanda_28a["demanda_real_mw"],
            name="Demanda 28-A",
            mode="lines", line=dict(color=C_28A, width=2.2),
            fill="tozeroy", fillcolor="rgba(255,90,54,0.04)",
            hovertemplate="%{x|%H:%M} → %{y:,.0f} MW<extra>28-A</extra>",
        ), row=1, col=1)

    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy,
            line=dict(color=C_HOY, width=2, dash="dash"),
            annotation_text=f"HOY · {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=10, family="JetBrains Mono"),
            annotation_position="right",
            row=1, col=1,
        )

    # ── SUBPLOT 2: FRECUENCIA ─────────────────────────────────────────────────
    if not df_freq_28a.empty and "hora_dt" in df_freq_28a.columns:
        # Glow 28-A
        fig.add_trace(go.Scatter(
            x=df_freq_28a["hora_dt"], y=df_freq_28a["freq"],
            mode="lines", line=dict(color="rgba(255,90,54,0.12)", width=9),
            hoverinfo="skip", showlegend=False,
        ), row=2, col=1)
        # Línea 28-A
        fig.add_trace(go.Scatter(
            x=df_freq_28a["hora_dt"], y=df_freq_28a["freq"],
            name="Frecuencia 28-A",
            mode="lines", line=dict(color=C_28A, width=2.2),
            hovertemplate="%{x|%H:%M:%S} → %{y:.3f} Hz<extra>28-A</extra>",
        ), row=2, col=1)

    if not historial_freq_hoy:
        # Dummy data si no hay historial
        historial_freq_hoy = [
            {"time": (datetime.now() - timedelta(seconds=i*5)).strftime("%H:%M:%S"), "freq": 50.0}
            for i in range(10)
        ]

    df_hoy = pd.DataFrame(historial_freq_hoy)
    if "freq" in df_hoy.columns and "time" in df_hoy.columns:
        # Para superponer "HOY" sobre "28-A", necesitamos alinear los ejes X.
        # Asignamos el último punto de HOY exactamente a T_COLAPSO_DT.
        import pandas as pd
        hoy_dt = pd.to_datetime(datetime.now().strftime("%Y-%m-%d ") + df_hoy["time"])
        offset = T_COLAPSO_DT - hoy_dt.iloc[-1]
        df_hoy["time_aligned"] = hoy_dt + offset

        fig.add_trace(go.Scatter(
            x=df_hoy["time_aligned"], y=df_hoy["freq"],
            name="Frecuencia HOY",
            mode="lines", line=dict(color=C_HOY, width=2.2),
            hovertemplate="HOY → %{y:.4f} Hz<extra>HOY</extra>",
        ), row=2, col=1)

    for f_val, color, texto in [
        (50.0, C_VERDE,  "50 Hz"),
        (49.5, C_AMBAR,  "UFLS 49.5"),
        (49.0, "#ef4444","UFLS 49.0"),
        (48.8, "#dc2626","NADIR 28-A"),
    ]:
        fig.add_hline(
            y=f_val,
            line=dict(color=color, dash="dot", width=1),
            annotation_text=texto,
            annotation_font=dict(color=color, size=9, family="JetBrains Mono"),
            annotation_position="left",
            row=2, col=1,
        )

    # ── Layout general ────────────────────────────────────────────────────────
    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="📊 HOY vs 28-A — Comparativa en tiempo real",
            font=dict(size=15, color="#e2e8f0", family="Inter, sans-serif"),
            x=0.01,
        ),
        height=700,
    )
    fig.update_yaxes(
        showgrid=True, gridcolor=C_GRID_H, gridwidth=1,
        tickfont=dict(family="JetBrains Mono", size=11),
    )
    fig.update_xaxes(
        showgrid=False,
        tickformat="%H:%M",
        tickfont=dict(family="JetBrains Mono", size=11),
    )
    # Rango Y del subplot de frecuencia
    fig.update_yaxes(range=[47.8, 50.5], row=2, col=1,
                     tickformat=".2f")
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 5. ESTADÍSTICAS
# ══════════════════════════════════════════════════════════════════════════════

def stats_frecuencia_28a(df_freq: pd.DataFrame) -> dict:
    if df_freq.empty:
        return {}
    resultado = {
        "freq_min": df_freq["freq"].min(),
        "freq_max": df_freq["freq"].max(),
        "hora_colapso": "12:33:00",
    }
    if "t_s" in df_freq.columns:
        resultado["t_nadir_s"] = int(df_freq.loc[df_freq["freq"].idxmin(), "t_s"])
    if "rocof" in df_freq.columns:
        resultado["rocof_max"] = df_freq["rocof"].abs().max()
    if "evento" in df_freq.columns:
        resultado["n_eventos"] = df_freq["evento"].notna().sum()
    if "hora_dt" in df_freq.columns:
        resultado["hora_nadir"] = df_freq.loc[df_freq["freq"].idxmin(), "hora_dt"].strftime("%H:%M:%S")
    return resultado


def stats_precios_28a(df_desbalance: pd.DataFrame, df_precios: pd.DataFrame) -> dict:
    resultado = {}
    if not df_desbalance.empty and "precio_max_eur" in df_desbalance.columns:
        resultado["desbalance_max"] = df_desbalance["precio_max_eur"].max()
        idx = df_desbalance["precio_max_eur"].idxmax()
        resultado["hora_desbal_max"] = df_desbalance.loc[idx, "hora_dt"].strftime("%H:%M")
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        resultado["spot_min"]  = df_precios["spot_eur"].min()
        resultado["spot_max"]  = df_precios["spot_eur"].max()
        resultado["horas_neg"] = int((df_precios["spot_eur"] < 0).sum())
    return resultado
