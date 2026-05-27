"""
================================================================================
TIMELINE.PY - Timeline Interactivo: 7 Eventos Clave del 28-A
================================================================================

SIMPLIFICADO: ~80 LOC reales

Timeline horizontal con nodos interactivos que muestran la progresión del colapso.
Sin necesidad de D3.js ni Bézier: Plotly scatter + anotaciones es suficiente.

================================================================================
"""

import plotly.graph_objects as go
import pandas as pd
from typing import List, Dict
from datetime import datetime

# ============================================================================
# DATOS DE EVENTOS
# ============================================================================

TIMELINE_EVENTS_28A = [
    {
        "time": "2025-04-28T12:03:00Z",
        "time_label": "12:03",
        "type": "oscillation",           # 🟡 Amarillo
        "description": "Primera gran oscilación forzada centro-sur",
        "severity": 1,
        "y_position": 0.5,
    },
    {
        "time": "2025-04-28T12:19:00Z",
        "time_label": "12:19",
        "type": "oscillation",           # 🟡
        "description": "Segunda ronda oscilaciones (banda 0.6 Hz)",
        "severity": 1,
        "y_position": 0.5,
    },
    {
        "time": "2025-04-28T12:32:57Z",
        "time_label": "12:32:57",
        "type": "trigger",               # 🟣 Púrpura
        "description": "🔴 DISPARO: Transformador Granada 400/220kV (-355 MW)",
        "severity": 3,
        "y_position": 0.7,
    },
    {
        "time": "2025-04-28T12:33:16Z",
        "time_label": "12:33:16",
        "type": "cascade",               # 🔴 Rojo
        "description": "Desconexiones masivas inversores Badajoz/Segovia",
        "severity": 4,
        "y_position": 0.8,
    },
    {
        "time": "2025-04-28T12:33:20Z",
        "time_label": "12:33:20",
        "type": "interconnection",       # 🔵 Azul
        "description": "Apertura enlace Marruecos (subfrecuencia)",
        "severity": 4,
        "y_position": 0.8,
    },
    {
        "time": "2025-04-28T12:33:21Z",
        "time_label": "12:33:21",
        "type": "interconnection",       # 🔵
        "description": "Pérdida de sincronismo Francia",
        "severity": 4,
        "y_position": 0.8,
    },
    {
        "time": "2025-04-28T12:33:27Z",
        "time_label": "12:33:27",
        "type": "collapse",              # ⚫ Negro
        "description": "⚡ COLAPSO TOTAL: Apagón ibérico (f→0)",
        "severity": 5,
        "y_position": 1.0,
    },
]

# Mapeo de colores por tipo
COLOR_MAP = {
    "oscillation": "#FFC107",           # Ámbar
    "trigger": "#9B59B6",              # Púrpura
    "cascade": "#E74C3C",              # Rojo
    "interconnection": "#3498DB",      # Azul
    "collapse": "#2C3E50",             # Negro
}

SIZE_MAP = {
    1: 10,
    2: 12,
    3: 16,
    4: 18,
    5: 24,
}

# ============================================================================
# GENERADOR DE TIMELINE
# ============================================================================

def create_timeline(
    events: List[Dict] = TIMELINE_EVENTS_28A,
    height: int = 300
) -> go.Figure:
    """
    Crear timeline horizontal interactivo.
    
    Returns:
        Figure Plotly con scatter de eventos
    """
    
    # Convertir a DataFrame para Plotly
    df = pd.DataFrame(events)
    df["time"] = pd.to_datetime(df["time"])
    df["color"] = df["type"].map(COLOR_MAP)
    df["size"] = df["severity"].map(SIZE_MAP)
    
    fig = go.Figure()
    
    # Añadir línea de base (timeline horizontal)
    fig.add_hline(
        y=0.5,
        line_dash="solid",
        line_color="rgba(255,255,255,0.3)",
        line_width=2,
        showlegend=False
    )
    
    # Scatter de eventos
    fig.add_trace(go.Scatter(
        x=df["time"],
        y=df["y_position"],
        mode="markers+text",
        marker=dict(
            size=df["size"],
            color=df["color"],
            line=dict(
                color="rgba(255,255,255,0.8)",
                width=2
            ),
            opacity=0.9
        ),
        text=df["time_label"],
        textposition="top center",
        textfont=dict(size=10, color="rgba(255,255,255,0.8)"),
        hovertemplate="<b>%{customdata[0]}</b><br>" +
                      "%{customdata[1]}<br>" +
                      "<extra></extra>",
        customdata=df[["type", "description"]],
        showlegend=False
    ))
    
    # ========================================================================
    # ANOTACIONES (expandidas en hover)
    # ========================================================================
    
    for idx, row in df.iterrows():
        fig.add_annotation(
            x=row["time"],
            y=row["y_position"] + 0.15,
            text=row["description"],
            showarrow=False,
            xanchor="center",
            yanchor="bottom",
            font=dict(size=9, color="rgba(255,255,255,0.7)"),
            bgcolor="rgba(21,26,34,0.8)",
            bordercolor=row["color"],
            borderwidth=1,
            borderpad=4,
            opacity=0.0,  # Hidden initially, visible on hover via CSS
            visible=True
        )
    
    # ========================================================================
    # LAYOUT
    # ========================================================================
    
    fig.update_layout(
        title="<b>Timeline Forense: Eventos del 28-A</b>",
        template="plotly_dark",
        plot_bgcolor="#151A22",
        paper_bgcolor="#0B0E14",
        font=dict(color="#FFFFFF", family="Inter"),
        height=height,
        xaxis=dict(
            title="Tiempo (UTC)",
            showgrid=True,
            gridwidth=1,
            gridcolor="rgba(255,255,255,0.1)",
            zeroline=False
        ),
        yaxis=dict(
            showgrid=False,
            zeroline=False,
            showticklabels=False,
            range=[0, 1.2]
        ),
        hovermode="closest",
        margin=dict(t=100, b=50, l=50, r=50),
        showlegend=False
    )
    
    return fig


# ============================================================================
# TABLA TIMELINE (alternativa)
# ============================================================================

def create_timeline_table() -> pd.DataFrame:
    """Crear tabla resumida de eventos."""
    return pd.DataFrame(TIMELINE_EVENTS_28A)


# ============================================================================
# FUNCIÓN PÚBLICA
# ============================================================================

def get_timeline_graph() -> go.Figure:
    """Interface pública."""
    return create_timeline()


if __name__ == "__main__":
    print("\n" + "="*80)
    print("PRUEBA: TIMELINE")
    print("="*80 + "\n")
    
    fig = create_timeline()
    fig.write_html("/tmp/timeline_28a.html")
    print("✓ Timeline generado: /tmp/timeline_28a.html\n")
    
    # Mostrar tabla
    df_events = create_timeline_table()
    print("Eventos clave:")
    print(df_events[["time_label", "type", "description"]].to_string(index=False))
    
    print("\n" + "="*80 + "\n")
