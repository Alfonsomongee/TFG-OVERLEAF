import plotly.graph_objects as go
import pandas as pd
from typing import Optional

def generar_timeline(slider_time: Optional[str] = None) -> go.Figure:
    """
    Timeline de eventos críticos del 28-A con gradientes y badge.
    """
    eventos = [
        ("12:03", "Primera oscilación forzada", "#f59e0b"),
        ("12:19", "Segunda oscilación", "#f59e0b"),
        ("12:32:57", "Disparo transformer Granada (-355 MW)", "#f97316"),
        ("12:33:16", "Desconexiones masivas inversores", "#ef4444"),
        ("12:33:20", "Apertura Marruecos", "#ef4444"),
        ("12:33:21", "Pérdida sincronismo Francia", "#d946ef"),
        ("12:33:27", "COLAPSO TOTAL", "#dc2626"),
    ]

    # Alturas alternadas para evitar solapamiento
    alturas = [-45, -85, -125, -45, -85, -125, -45]

    fig = go.Figure()

    for i, (hora, desc, color) in enumerate(eventos):
        fig.add_annotation(
            x=hora,
            y=1,
            text=desc,
            showarrow=True,
            arrowhead=2,
            arrowcolor=color,
            ax=0,
            ay=alturas[i % len(alturas)],
            font=dict(color="white", size=11, family="Inter"),
            bgcolor="rgba(0,0,0,0.75)",
            bordercolor=color,
            borderwidth=1.5
        )

    # Línea base horizontal
    fig.add_hline(y=1, line_dash="dot", line_color="gray", annotation_text="Línea de eventos")

    # Gradientes de severidad
    fig.add_vrect(
        x0="11:55", x1="12:32:57",
        fillcolor="rgba(245,158,11,0.04)", layer="below", line_width=0,
        annotation_text="Tensión creciente", annotation_position="top left"
    )
    fig.add_vrect(
        x0="12:32:57", x1="12:33:27",
        fillcolor="rgba(239,68,68,0.08)", layer="below", line_width=0,
        annotation_text="Colapso en cascada", annotation_position="top left"
    )
    fig.add_vrect(
        x0="12:33:27", x1="12:40",
        fillcolor="rgba(220,38,38,0.15)", layer="below", line_width=0,
        annotation_text="BLACKOUT", annotation_position="top left"
    )

    # Línea vertical del slider
    if slider_time:
        try:
            slider_ts = pd.Timestamp(slider_time)
            fig.add_vline(x=slider_ts.strftime("%H:%M:%S"), line_dash="dot", line_color="#06b6d4",
                          annotation_text="Cursor", annotation_position="bottom")
        except:
            pass

    # Badge
    fig.add_annotation(
        x=0.98, y=0.98, xref="paper", yref="paper",
        text="<span style='background:#1e2433; padding:2px 8px; border-radius:4px;'>Eventos PMU · REE + ENTSO‑E</span>",
        showarrow=False, font=dict(size=9), xanchor="right", yanchor="top",
        bgcolor="rgba(0,0,0,0)"
    )

    _LAYOUT_BASE = dict(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#cbd5e1", size=11, family="JetBrains Mono, monospace"),
        margin=dict(l=15, r=15, t=70, b=30),
        hoverlabel=dict(bgcolor="#111827", font_size=10, font_family="JetBrains Mono"),
    )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="📅 Línea de tiempo del colapso — Eventos críticos",
            font=dict(family="Outfit, sans-serif", size=16, color="#f8fafc"),
            x=0.05, xanchor="left"
        ),
        xaxis_title="Hora (CEST)",
        yaxis_title="",
        xaxis=dict(range=["11:55", "12:40"], tickformat="%H:%M:%S", gridcolor="rgba(255,255,255,0.04)"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.04)", zeroline=False, showticklabels=False),
        height=420,
        showlegend=False
    )
    return fig
