import json
import pandas as pd
import plotly.graph_objects as go
from typing import Optional

def generar_grafica_voltajes(
    json_path: str = "data_28a_voltage_profiles.json",
    slider_time: Optional[str] = None
) -> go.Figure:
    """
    Gráfica de perfiles de tensión (28-A) con badge, gradientes y estilo unificado.
    """
    try:
        with open(json_path, "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        fig = go.Figure()
        fig.add_annotation(text="Archivo JSON no encontrado", x=0.5, y=0.5, showarrow=False)
        fig.update_layout(template="plotly_dark")
        return fig

    # Detectar formato
    if isinstance(data, dict) and "timestamps" in data:
        timestamps = data["timestamps"]
        voltages = data["voltages"]
    elif isinstance(data, list) and len(data) > 0 and "timestamp" in data[0]:
        timestamps = [d["timestamp"] for d in data]
        nudos = list(data[0]["voltages"].keys())
        voltages = {nudo: [] for nudo in nudos}
        for d in data:
            for nudo in nudos:
                voltages[nudo].append(d["voltages"][nudo])
    else:
        fig = go.Figure()
        fig.add_annotation(text="Formato de JSON no reconocido", x=0.5, y=0.5, showarrow=False)
        fig.update_layout(template="plotly_dark")
        return fig

    timestamps_serie = pd.to_datetime(timestamps)

    fig = go.Figure()
    for nudo, valores in voltages.items():
        fig.add_trace(go.Scatter(
            x=timestamps_serie,
            y=valores,
            mode="lines",
            name=nudo,
            line=dict(width=2.5)
        ))

    # Bandas de tensión
    fig.add_hrect(y0=0.95, y1=1.05, fillcolor="rgba(16,185,129,0.08)", line_width=0, annotation_text="Nominal ±5%")
    fig.add_hrect(y0=1.05, y1=1.10, fillcolor="rgba(245,158,11,0.12)", line_width=0, annotation_text="Alerta")
    fig.add_hrect(y0=1.10, y1=1.20, fillcolor="rgba(239,68,68,0.20)", line_width=0, annotation_text="Crítico")
    fig.add_vline(x=pd.Timestamp("2025-04-28 12:32:57"), line_dash="dash", line_color="#ef4444",
                  annotation_text="Disparo Granada", annotation_position="top right")

    # Gradiente de contexto (tensión pre-colapso)
    fig.add_vrect(
        x0="2025-04-28 12:00:00", x1="2025-04-28 12:33:00",
        fillcolor="rgba(245,158,11,0.06)", layer="below", line_width=0,
        annotation_text="Tensión creciente", annotation_position="top left"
    )
    fig.add_vrect(
        x0="2025-04-28 12:33:00", x1="2025-04-28 13:10:00",
        fillcolor="rgba(239,68,68,0.08)", layer="below", line_width=0,
        annotation_text="COLAPSO", annotation_position="top left"
    )

    if slider_time:
        try:
            slider_ts = pd.Timestamp(slider_time)
            fig.add_vline(x=slider_ts, line_dash="dot", line_color="#06b6d4", line_width=1.5,
                          annotation_text="Cursor", annotation_position="bottom")
        except:
            pass

    # Badge de fuente
    fig.add_annotation(
        x=0.98, y=0.98, xref="paper", yref="paper",
        text="<span style='background:#1e2433; padding:2px 8px; border-radius:4px;'>Datos sintéticos de alta fidelidad · Basado en informe ENTSO‑E</span>",
        showarrow=False, font=dict(size=9), xanchor="right", yanchor="top",
        bgcolor="rgba(0,0,0,0)"
    )

    _LAYOUT_BASE = dict(
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(color="#cbd5e1", size=11, family="JetBrains Mono, monospace"),
        legend=dict(bgcolor="rgba(17,24,39,0.8)", bordercolor="rgba(255,255,255,0.1)", borderwidth=1),
        margin=dict(l=15, r=15, t=70, b=30),
        hovermode="x unified",
        hoverlabel=dict(bgcolor="#111827", font_size=10, font_family="JetBrains Mono"),
    )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="⚡ Perfiles de tensión — Causa raíz del colapso Q‑V",
            font=dict(family="Outfit, sans-serif", size=16, color="#f8fafc"),
            x=0.05, xanchor="left"
        ),
        xaxis_title="Hora (CEST)",
        yaxis_title="Tensión (p.u.)",
        height=480,
        xaxis=dict(gridcolor="rgba(255,255,255,0.04)", tickformat="%H:%M"),
        yaxis=dict(gridcolor="rgba(255,255,255,0.04)", range=[0.85, 1.25])
    )
    return fig
