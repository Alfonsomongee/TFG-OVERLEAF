"""
================================================================================
VOLTAGE_ANALYZER.PY - Gráfica 5: Perfiles de Voltaje por Nudo Crítico
================================================================================

SIMPLIFICADO: ~100 LOC reales (Plotly maneja el 90% del trabajo)

El 28-A fue precipitado por SOBRETENSIÓN en Granada (400/220 kV), no por 
frecuencia baja. Esta gráfica demuestra visualmente esa causa raíz.

================================================================================
"""

import plotly.graph_objects as go
import pandas as pd
import json
from pathlib import Path
from typing import Tuple, Dict

# ============================================================================
# CARGAR DATOS SINTÉTICOS
# ============================================================================

def load_voltage_data(json_path: str = "data_28a_voltage_profiles.json") -> Dict:
    """Cargar datos sintéticos de voltaje."""
    with open(json_path, 'r') as f:
        return json.load(f)

def prepare_dataframe(voltage_data: Dict) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Convertir JSON a DataFrames."""
    timestamps = pd.to_datetime(voltage_data["data"]["timestamps"])
    
    df_28a = pd.DataFrame(voltage_data["data"]["28a"])
    df_28a["timestamp"] = timestamps
    
    df_today = pd.DataFrame(voltage_data["data"]["today"])
    df_today["timestamp"] = timestamps
    
    return df_28a, df_today

# ============================================================================
# GRÁFICA PRINCIPAL
# ============================================================================

def plot_voltage_profiles(
    df_voltages_28a: pd.DataFrame,
    df_voltages_today: pd.DataFrame
) -> go.Figure:
    """
    Gráfica: Perfiles de voltaje (p.u.) en 4 nudos críticos.
    
    Líneas rojas (28-A) muestran sobretensión progresiva → disparo.
    Líneas azules (HOY) muestran operación nominal.
    
    Returns:
        Figure Plotly
    """
    
    fig = go.Figure()
    
    # COLORES
    color_28a = "#E74C3C"      # Rojo histórico
    color_today = "#667EEA"    # Azul vivo
    color_bg = "#0B0E14"       # Negro
    color_panel = "#151A22"
    
    # ========================================================================
    # SERIES PRINCIPALES
    # ========================================================================
    
    # 28-A: Granada 400 kV (el nudo crítico)
    fig.add_trace(go.Scatter(
        x=df_voltages_28a["timestamp"],
        y=df_voltages_28a["Granada_400kV_pu"],
        name="Granada 400kV (28-A)",
        line=dict(color=color_28a, width=3),
        hovertemplate="<b>Granada 400kV</b><br>%{x}<br>%{y:.4f} pu<extra></extra>"
    ))
    
    # 28-A: Otros nudos
    fig.add_trace(go.Scatter(
        x=df_voltages_28a["timestamp"],
        y=df_voltages_28a["Badajoz_220kV_pu"],
        name="Badajoz 220kV (28-A)",
        line=dict(color=color_28a, width=2, dash="dash"),
        hovertemplate="%{y:.4f} pu<extra></extra>"
    ))
    
    fig.add_trace(go.Scatter(
        x=df_voltages_28a["timestamp"],
        y=df_voltages_28a["Segovia_132kV_pu"],
        name="Segovia 132kV (28-A)",
        line=dict(color=color_28a, width=2, dash="dot"),
        hovertemplate="%{y:.4f} pu<extra></extra>"
    ))
    
    # HOY: Mismos nudos en azul
    fig.add_trace(go.Scatter(
        x=df_voltages_today["timestamp"],
        y=df_voltages_today["Granada_400kV_pu"],
        name="Granada 400kV (HOY)",
        line=dict(color=color_today, width=3),
        hovertemplate="%{y:.4f} pu<extra></extra>"
    ))
    
    fig.add_trace(go.Scatter(
        x=df_voltages_today["timestamp"],
        y=df_voltages_today["Badajoz_220kV_pu"],
        name="Badajoz 220kV (HOY)",
        line=dict(color=color_today, width=2, dash="dash"),
        hovertemplate="%{y:.4f} pu<extra></extra>"
    ))
    
    fig.add_trace(go.Scatter(
        x=df_voltages_today["timestamp"],
        y=df_voltages_today["Segovia_132kV_pu"],
        name="Segovia 132kV (HOY)",
        line=dict(color=color_today, width=2, dash="dot"),
        hovertemplate="%{y:.4f} pu<extra></extra>"
    ))
    
    # ========================================================================
    # BANDAS DE ALARMA (Voltage Quality Bands)
    # ========================================================================
    
    # Verde: Nominal ±5% → [0.95, 1.05]
    fig.add_hrect(
        y0=0.95, y1=1.05,
        fillcolor="#2ECC71", opacity=0.1,
        layer="below",
        name="Nominal ±5%"
    )
    
    # Amarilla: Alerta ±8% → [0.92, 1.08]
    fig.add_hrect(
        y0=0.92, y1=0.95,
        fillcolor="#F39C12", opacity=0.15,
        layer="below",
        name="Alerta inferior ±8%"
    )
    fig.add_hrect(
        y0=1.05, y1=1.08,
        fillcolor="#F39C12", opacity=0.15,
        layer="below",
        name="Alerta superior ±8%"
    )
    
    # Roja: Crítica >±12% → zona de disparo
    fig.add_hrect(
        y0=1.08, y1=1.15,
        fillcolor="#E74C3C", opacity=0.2,
        layer="below",
        name="Crítica >±8%"
    )
    
    # ========================================================================
    # ANOTACIONES DE EVENTOS
    # ========================================================================
    
    # Disparo del transformador Granada
    fig.add_vline(
        x=pd.Timestamp("2025-04-28T12:32:57Z"),
        line_dash="solid",
        line_color="#E74C3C",
        line_width=3,
        opacity=0.8,
        annotation_text="<b>Disparo Granada</b><br>-355 MW",
        annotation_position="top right",
        annotation_font=dict(size=11, color="#E74C3C"),
        annotation_bgcolor=color_panel,
        annotation_bordercolor="#E74C3C",
        annotation_borderwidth=2
    )
    
    # ========================================================================
    # LAYOUT
    # ========================================================================
    
    fig.update_layout(
        title="<b>Perfiles de Voltaje (p.u.)</b> — Causa Raíz 28-A: Sobretensión Q-V",
        template="plotly_dark",
        plot_bgcolor=color_panel,
        paper_bgcolor=color_bg,
        font=dict(color="#FFFFFF", family="Inter"),
        hovermode="x unified",
        height=500,
        xaxis_title="Tiempo (UTC)",
        yaxis_title="Voltaje (p.u.)",
        yaxis=dict(
            range=[0.90, 1.10],
            showgrid=True,
            gridwidth=1,
            gridcolor="rgba(255,255,255,0.1)"
        ),
        xaxis=dict(
            showgrid=True,
            gridwidth=1,
            gridcolor="rgba(255,255,255,0.1)"
        ),
        legend=dict(
            x=0.02, y=0.98,
            bgcolor="rgba(0,0,0,0.5)",
            bordercolor="#FFFFFF",
            borderwidth=1
        )
    )
    
    return fig


# ============================================================================
# FUNCIÓN PÚBLICA
# ============================================================================

def create_voltage_graph(json_path: str = "data_28a_voltage_profiles.json") -> go.Figure:
    """Interface pública."""
    data = load_voltage_data(json_path)
    df_28a, df_today = prepare_dataframe(data)
    return plot_voltage_profiles(df_28a, df_today)


if __name__ == "__main__":
    print("\n" + "="*80)
    print("PRUEBA: VOLTAGE_ANALYZER")
    print("="*80 + "\n")
    
    try:
        fig = create_voltage_graph()
        fig.write_html("/tmp/voltage_profiles.html")
        print("✓ Gráfica generada: /tmp/voltage_profiles.html\n")
    except FileNotFoundError:
        print("⚠ Archivo JSON no encontrado. Crear primero:")
        print("   data_28a_voltage_profiles.json\n")
    
    print("="*80 + "\n")
