"""
visualizaciones_forenses.py — Gráficas de alto impacto para el TFG

Cuatro visualizaciones construidas sobre los datos reales del 28-A:

  fig_sismografo_frecuencia()   → La caída de 50 Hz a 48.8 Hz con anotaciones PMU
  fig_demanda_real_vs_prev()    → El precipicio de demanda: real vs programada vs prevista
  fig_tormenta_de_precios()     → Los 15.000 €/MWh del desbalance vs SPOT
  fig_comparativa_superpuesta() → Hoy vs 28-A en la misma gráfica (línea roja de referencia)

Uso en app.py:
    from visualizaciones_forenses import (
        fig_sismografo_frecuencia, fig_demanda_real_vs_prev,
        fig_tormenta_de_precios, fig_comparativa_superpuesta,
    )
"""

from datetime import datetime, timedelta
from typing import Optional

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

# ─── Paleta forense ───────────────────────────────────────────────────────────
C_HOY    = "#667eea"   # azul-violeta — datos de hoy
C_28A    = "#e74c3c"   # rojo         — datos del 28-A (peligro)
C_PROG   = "#95a5a6"   # gris         — programado/previsto
C_VERDE  = "#2ecc71"   # verde        — zona segura
C_AMBAR  = "#f39c12"   # ámbar        — zona de alerta
C_FONDO  = "rgba(0,0,0,0)"

# Hora del colapso (para líneas verticales)
T_COLAPSO_DT = datetime(2025, 4, 28, 12, 33, 0)

_LAYOUT_BASE = dict(
    paper_bgcolor=C_FONDO,
    plot_bgcolor=C_FONDO,
    font=dict(color="#e8eaf0", size=12),
    legend=dict(bgcolor="rgba(0,0,0,0)", borderwidth=0),
    margin=dict(l=0, r=0, t=40, b=0),
    hovermode="x unified",
)


# ══════════════════════════════════════════════════════════════════════════════
# 1. SISMÓGRAFO DE FRECUENCIA
#    La gráfica más impactante del TFG: 50.00 Hz → 48.8 Hz en 30 segundos.
#    Fuente: frequency_28A.json (PMU data, ENTSO-E)
# ══════════════════════════════════════════════════════════════════════════════

def fig_sismografo_frecuencia(
    df_freq: pd.DataFrame,
    frecuencia_hoy: Optional[float] = None,
) -> go.Figure:
    """
    Construye el sismógrafo de frecuencia del 28-A con:
      - Curva de frecuencia en rojo sobre fondo oscuro
      - Anotaciones de cada evento (PMU + REE Control Room)
      - Línea de RoCoF superpuesta (eje derecho)
      - Bandas de colores para cada umbral normativo
      - Línea punteada con la frecuencia actual del sistema (si se pasa)

    Args:
        df_freq:        DataFrame de cargar_frecuencia_28a()
        frecuencia_hoy: float Hz — frecuencia actual del sistema (opcional)
    """
    fig = make_subplots(
        specs=[[{"secondary_y": True}]],
        subplot_titles=[""],
    )

    # ── Bandas de alerta (fondo) ──────────────────────────────────────────────
    bandas = [
        (49.8,  50.3, "rgba(46,204,113,0.06)",  None),            # zona normal
        (49.5,  49.8, "rgba(243,156,18,0.10)",  "Banda primaria (P.O. 1.6)"),
        (49.0,  49.5, "rgba(231,76,60,0.12)",   "UFLS 1er escalón (49.5 Hz)"),
        (48.5,  49.0, "rgba(192,57,43,0.18)",   "UFLS 2º escalón (49.0 Hz)"),
        (47.5,  48.5, "rgba(100,0,0,0.25)",     "Zona de desconexión generadores"),
    ]
    for y0, y1, color, label in bandas:
        fig.add_hrect(
            y0=y0, y1=y1, fillcolor=color, layer="below", line_width=0,
            **({"annotation_text": label,
                "annotation_position": "right",
                "annotation_font": dict(color="#95a5a6", size=9)} if label else {}),
        )

    # ── Curva de frecuencia ───────────────────────────────────────────────────
    fig.add_trace(go.Scatter(
        x=df_freq["hora_dt"],
        y=df_freq["freq"],
        name="Frecuencia (Hz)",
        line=dict(color=C_28A, width=2.0),
        fill="tonexty",
        hovertemplate=(
            "<b>%{x|%H:%M:%S}</b><br>"
            "Frecuencia: <b>%{y:.3f} Hz</b><extra></extra>"
        ),
    ), secondary_y=False)

    # ── RoCoF (eje derecho) ───────────────────────────────────────────────────
    if "rocof" in df_freq.columns and df_freq["rocof"].abs().max() > 0:
        rocof_nonzero = df_freq[df_freq["rocof"] != 0]
        if not rocof_nonzero.empty:
            fig.add_trace(go.Scatter(
                x=rocof_nonzero["hora_dt"],
                y=rocof_nonzero["rocof"],
                name="RoCoF (Hz/s)",
                mode="markers",
                marker=dict(color=C_AMBAR, size=6, symbol="diamond"),
                hovertemplate="RoCoF: <b>%{y:+.3f} Hz/s</b><extra></extra>",
            ), secondary_y=True)

    # ── Anotaciones de eventos ────────────────────────────────────────────────
    colores_evento = {
        "oscillation":      "#f39c12",
        "operator_action":  "#3498db",
        "collapse":         "#e74c3c",
        "recovery":         "#2ecc71",
        "protection":       "#9b59b6",
        "load_shedding":    "#e67e22",
    }

    if "evento" in df_freq.columns and "evento_tipo" in df_freq.columns:
        eventos_con_texto = df_freq[df_freq["evento"].notna() & (df_freq["evento"] != "")]
        for _, row in eventos_con_texto.iterrows():
            color_ev = colores_evento.get(str(row.get("evento_tipo", "")), "#95a5a6")
            # Etiqueta corta (primeras 45 chars)
            label_corto = str(row["evento"])[:45] + ("…" if len(str(row["evento"])) > 45 else "")
            freq_y = row["freq"] if pd.notna(row["freq"]) else 49.5

            fig.add_annotation(
                x=row["hora_dt"],
                y=freq_y,
                text=label_corto,
                showarrow=True,
                arrowhead=2,
                arrowcolor=color_ev,
                arrowwidth=1.5,
                font=dict(color=color_ev, size=8),
                bgcolor="rgba(14,17,23,0.85)",
                bordercolor=color_ev,
                borderwidth=1,
                borderpad=3,
                ax=0,
                ay=-35,
            )

    # ── Línea vertical del colapso ────────────────────────────────────────────
    fig.add_vline(
        x=T_COLAPSO_DT,
        line=dict(color=C_28A, width=2, dash="dash"),
        annotation_text="⚡ COLAPSO 12:33h",
        annotation_position="top",
        annotation_font=dict(color=C_28A, size=11, family="monospace"),
    )

    # ── Umbrales horizontales ─────────────────────────────────────────────────
    for f_val, color, texto in [
        (50.0,  "#2ecc71", "50.00 Hz nominal"),
        (49.5,  "#f39c12", "49.50 Hz — UFLS"),
        (49.0,  "#e74c3c", "49.00 Hz — UFLS 2º"),
        (48.8,  "#c0392b", f"48.8 Hz — NADIR 28-A"),
    ]:
        fig.add_hline(
            y=f_val,
            line=dict(color=color, dash="dot", width=1),
            annotation_text=texto,
            annotation_font=dict(color=color, size=9),
            secondary_y=False,
        )

    # ── Frecuencia actual del sistema (si se pasa) ────────────────────────────
    if frecuencia_hoy is not None:
        fig.add_hline(
            y=frecuencia_hoy,
            line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"▶ HOY: {frecuencia_hoy:.3f} Hz",
            annotation_font=dict(color=C_HOY, size=10),
            annotation_position="top left",
            secondary_y=False,
        )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="🔴 Sismógrafo de Frecuencia — 28 de abril de 2025 (datos PMU/ENTSO-E)",
            font=dict(size=14, color="#e8eaf0"),
        ),
        height=440,
        yaxis=dict(
            title="Frecuencia (Hz)",
            range=[47.8, 50.5],
            gridcolor="rgba(255,255,255,0.06)",
            tickformat=".2f",
        ),
        yaxis2=dict(
            title="RoCoF (Hz/s)",
            gridcolor="rgba(0,0,0,0)",
            range=[-3.5, 3.5],
            zeroline=True,
            zerolinecolor="rgba(255,255,255,0.1)",
        ),
        xaxis=dict(
            title="Hora (CEST)",
            gridcolor="rgba(255,255,255,0.06)",
            tickformat="%H:%M",
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 2. PRECIPICIO DE DEMANDA
#    demanda_28_29_abril.json
#    Real vs Programada vs Prevista — muestra la desviación catastrófica
# ══════════════════════════════════════════════════════════════════════════════

def fig_demanda_real_vs_prev(
    df_demanda: pd.DataFrame,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """
    Gráfica de la demanda del 28-A con tres curvas:
      - Demanda prevista (gris) — lo que se esperaba
      - Demanda programada (gris oscuro) — el plan de operación
      - Demanda real (rojo) — lo que ocurrió (caída a 0)
      - Demanda hoy (azul punteado) — comparativa actual

    La brecha entre "prevista" y "real" es visualmente devastadora.
    """
    fig = go.Figure()

    # Zona del colapso sombreada
    fig.add_vrect(
        x0=T_COLAPSO_DT,
        x1=T_COLAPSO_DT + timedelta(minutes=37),
        fillcolor="rgba(231,76,60,0.12)",
        layer="below",
        line_width=0,
        annotation_text="COLAPSO",
        annotation_position="top left",
        annotation_font=dict(color=C_28A, size=11, family="monospace"),
    )
    # Zona black start
    fig.add_vrect(
        x0=T_COLAPSO_DT + timedelta(minutes=37),
        x1=T_COLAPSO_DT + timedelta(hours=2),
        fillcolor="rgba(243,156,18,0.07)",
        layer="below",
        line_width=0,
        annotation_text="BLACK START",
        annotation_position="top left",
        annotation_font=dict(color=C_AMBAR, size=10),
    )

    # Demanda prevista (lo que REE esperaba)
    if "demanda_prev_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"],
            y=df_demanda["demanda_prev_mw"],
            name="Prevista (REE)",
            line=dict(color=C_PROG, dash="dot", width=1.5),
            hovertemplate="%{y:,.0f} MW (prevista)<extra></extra>",
        ))

    # Demanda programada (el plan del mercado)
    if "demanda_prog_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"],
            y=df_demanda["demanda_prog_mw"],
            name="Programada (PDBF)",
            line=dict(color="#7f8c8d", dash="dash", width=1.5),
            hovertemplate="%{y:,.0f} MW (programada)<extra></extra>",
        ))

    # Demanda REAL — la que colapsa
    if "demanda_real_mw" in df_demanda.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda["hora_dt"],
            y=df_demanda["demanda_real_mw"],
            name="Real (28-A)",
            line=dict(color=C_28A, width=3),
            fill="tozeroy",
            fillcolor="rgba(231,76,60,0.06)",
            hovertemplate="<b>%{x|%H:%M}</b> → <b>%{y:,.0f} MW</b><extra>Real 28-A</extra>",
        ))

    # Desviación (área entre programada y real)
    if "demanda_prog_mw" in df_demanda.columns and "demanda_real_mw" in df_demanda.columns:
        df_neg = df_demanda[df_demanda["desviacion_mw"] < -500].copy()
        if not df_neg.empty:
            fig.add_trace(go.Scatter(
                x=df_neg["hora_dt"],
                y=df_neg["demanda_real_mw"],
                name="Déficit real",
                fill="tonexty",
                fillcolor="rgba(231,76,60,0.15)",
                line=dict(color="rgba(0,0,0,0)"),
                hoverinfo="skip",
                showlegend=False,
            ))

    # Demanda actual (hoy) como línea horizontal
    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy,
            line=dict(color=C_HOY, width=2, dash="longdash"),
            annotation_text=f"▶ HOY: {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=10),
            annotation_position="top right",
        )

    # Anotación del momento del colapso
    colapso_row = df_demanda[
        df_demanda["hora_dt"] >= pd.Timestamp(T_COLAPSO_DT, tz="UTC")
    ]
    if not colapso_row.empty:
        val_colapso = colapso_row.iloc[0]["demanda_real_mw"]
        fig.add_annotation(
            x=T_COLAPSO_DT,
            y=val_colapso,
            text=f"⚡ {val_colapso:,.0f} MW → 0",
            showarrow=True,
            arrowhead=2,
            arrowcolor=C_28A,
            font=dict(color=C_28A, size=10),
            bgcolor="rgba(14,17,23,0.85)",
        )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="⚡ El Precipicio — Demanda Real vs Programada vs Prevista (28-A)",
            font=dict(size=14, color="#e8eaf0"),
        ),
        height=400,
        yaxis=dict(
            title="Demanda (MW)",
            gridcolor="rgba(255,255,255,0.06)",
            tickformat=",",
        ),
        xaxis=dict(
            title="Hora (CEST)",
            gridcolor="rgba(255,255,255,0.06)",
            tickformat="%H:%M",
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 3. TORMENTA DE PRECIOS
#    imbalance_prices_28A.json + precios_28_29_abril.json
#    Precio desbalance hasta 15.000 €/MWh vs precio SPOT negativo
# ══════════════════════════════════════════════════════════════════════════════

def fig_tormenta_de_precios(
    df_desbalance: pd.DataFrame,
    df_precios: pd.DataFrame,
    precio_spot_hoy: Optional[float] = None,
) -> go.Figure:
    """
    Gráfica dual:
      - Eje derecho: precio SPOT horario (puede ser negativo)
      - Eje izquierdo: precio de desbalance (pico 15.000 €/MWh durante el caos)
    
    El contraste entre los dos ejes ilustra perfectamente la catástrofe económica.
    """
    fig = make_subplots(specs=[[{"secondary_y": True}]])

    # Zona del colapso
    fig.add_vrect(
        x0=T_COLAPSO_DT,
        x1=T_COLAPSO_DT + timedelta(hours=1),
        fillcolor="rgba(231,76,60,0.10)",
        layer="below",
        line_width=0,
    )

    # ── Precio de desbalance (barras, eje izquierdo) ──
    if not df_desbalance.empty:
        colores_barra = [
            "#e74c3c" if p > 1000 else
            "#f39c12" if p > 200  else
            "#2ecc71"
            for p in df_desbalance["precio_max_eur"]
        ]
        fig.add_trace(go.Bar(
            x=df_desbalance["hora_dt"],
            y=df_desbalance["precio_max_eur"],
            name="Precio desbalance ENTSO-E",
            marker_color=colores_barra,
            opacity=0.85,
            hovertemplate=(
                "<b>%{x|%H:%M}</b><br>"
                "Desbalance: <b>%{y:,.0f} €/MWh</b><extra></extra>"
            ),
        ), secondary_y=False)

        # Anotación del pico
        idx_max = df_desbalance["precio_max_eur"].idxmax()
        pico = df_desbalance.loc[idx_max]
        fig.add_annotation(
            x=pico["hora_dt"],
            y=pico["precio_max_eur"],
            text=f"💀 {pico['precio_max_eur']:,.0f} €/MWh",
            showarrow=True,
            arrowhead=2,
            arrowcolor=C_28A,
            font=dict(color=C_28A, size=11, family="monospace"),
            bgcolor="rgba(14,17,23,0.9)",
        )

    # ── Precio SPOT horario (línea, eje derecho) ──
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        fig.add_trace(go.Scatter(
            x=df_precios["hora_dt"],
            y=df_precios["spot_eur"],
            name="Precio SPOT (OMIE)",
            line=dict(color=C_AMBAR, width=2.5),
            hovertemplate=(
                "<b>%{x|%H:%M}</b><br>"
                "SPOT: <b>%{y:.2f} €/MWh</b><extra></extra>"
            ),
        ), secondary_y=True)

        # Zona de precios negativos
        neg_mask = df_precios["spot_eur"] < 0
        if neg_mask.any():
            fig.add_hrect(
                y0=df_precios["spot_eur"].min() - 1,
                y1=0,
                fillcolor="rgba(46,204,113,0.05)",
                layer="below",
                line_width=0,
                secondary_y=True,
                annotation_text="Precios negativos (exceso solar)",
                annotation_font=dict(color="#2ecc71", size=9),
                annotation_position="bottom right",
            )

    # Precio spot hoy
    if precio_spot_hoy is not None:
        fig.add_hline(
            y=precio_spot_hoy,
            line=dict(color=C_HOY, width=1.5, dash="longdash"),
            annotation_text=f"▶ HOY SPOT: {precio_spot_hoy:.1f} €/MWh",
            annotation_font=dict(color=C_HOY, size=9),
            secondary_y=True,
        )

    # Línea de referencia "precio normal"
    fig.add_hline(
        y=80, line=dict(color="#7f8c8d", dash="dot", width=1),
        annotation_text="80 €/MWh (precio normal)",
        annotation_font=dict(color="#7f8c8d", size=9),
        secondary_y=False,
    )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="💸 La Tormenta de Precios — Desbalance (hasta 15.000 €/MWh) vs SPOT (28-A)",
            font=dict(size=14, color="#e8eaf0"),
        ),
        height=400,
        barmode="overlay",
        yaxis=dict(
            title="Precio Desbalance ENTSO-E (€/MWh)",
            gridcolor="rgba(255,255,255,0.06)",
            tickformat=",",
        ),
        yaxis2=dict(
            title="Precio SPOT OMIE (€/MWh)",
            gridcolor="rgba(0,0,0,0)",
        ),
        xaxis=dict(
            title="Hora (CEST)",
            gridcolor="rgba(255,255,255,0.06)",
            tickformat="%H:%M",
        ),
    )
    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 4. COMPARATIVA SUPERPUESTA — HOY vs 28-A en la misma gráfica
#    Usa la demanda 28-A como línea roja de referencia + frecuencia actual
# ══════════════════════════════════════════════════════════════════════════════

def fig_comparativa_superpuesta(
    df_demanda_28a: pd.DataFrame,
    df_freq_28a: pd.DataFrame,
    historial_freq_hoy: list,
    demanda_hoy: Optional[float] = None,
) -> go.Figure:
    """
    Gráfica de dos paneles verticales:
      - Panel superior: demanda 28-A (rojo) + demanda actual (azul punteado)
      - Panel inferior: frecuencia 28-A (rojo, escala log) + frecuencia hoy (azul)
    
    El objetivo es que de un vistazo quede claro dónde está el sistema ahora
    respecto a la situación del colapso.
    """
    fig = make_subplots(
        rows=2, cols=1,
        shared_xaxes=False,
        subplot_titles=["Demanda (MW)", "Frecuencia (Hz)"],
        row_heights=[0.55, 0.45],
        vertical_spacing=0.12,
    )

    # ── Panel 1: DEMANDA ──────────────────────────────────────────────────────

    # Zona colapso
    for row in [1, 2]:
        fig.add_vrect(
            x0=T_COLAPSO_DT, x1=T_COLAPSO_DT + timedelta(minutes=37),
            fillcolor="rgba(231,76,60,0.08)", layer="below", line_width=0,
            row=row, col=1,
        )

    # Demanda 28-A
    if not df_demanda_28a.empty and "demanda_real_mw" in df_demanda_28a.columns:
        fig.add_trace(go.Scatter(
            x=df_demanda_28a["hora_dt"],
            y=df_demanda_28a["demanda_real_mw"],
            name="Demanda 28-A (real)",
            line=dict(color=C_28A, width=2.5),
            fill="tozeroy",
            fillcolor="rgba(231,76,60,0.05)",
            hovertemplate="%{x|%H:%M} → %{y:,.0f} MW<extra>28-A</extra>",
        ), row=1, col=1)

    # Demanda hoy (línea horizontal)
    if demanda_hoy is not None:
        fig.add_hline(
            y=demanda_hoy,
            line=dict(color=C_HOY, width=2, dash="dash"),
            annotation_text=f"HOY: {demanda_hoy:,.0f} MW",
            annotation_font=dict(color=C_HOY, size=10),
            row=1, col=1,
        )

    # ── Panel 2: FRECUENCIA ───────────────────────────────────────────────────

    # Frecuencia 28-A (eje X = hora real)
    if not df_freq_28a.empty:
        fig.add_trace(go.Scatter(
            x=df_freq_28a["hora_dt"],
            y=df_freq_28a["freq"],
            name="Frecuencia 28-A",
            line=dict(color=C_28A, width=2),
            hovertemplate="%{x|%H:%M:%S} → %{y:.3f} Hz<extra>28-A</extra>",
        ), row=2, col=1)

    # Frecuencia histórica de hoy (si hay datos)
    if historial_freq_hoy:
        df_hoy = pd.DataFrame(historial_freq_hoy)
        if "freq" in df_hoy.columns:
            fig.add_trace(go.Scatter(
                x=df_hoy["time"],
                y=df_hoy["freq"],
                name="Frecuencia HOY",
                line=dict(color=C_HOY, width=2.5),
                hovertemplate="%{x} → %{y:.4f} Hz<extra>HOY</extra>",
            ), row=2, col=1)

    # Umbrales de frecuencia
    for f_val, color, texto in [
        (50.0,  "#2ecc71", "50 Hz"),
        (49.5,  "#f39c12", "UFLS 49.5"),
        (49.0,  "#e74c3c", "UFLS 49.0"),
        (48.8,  "#c0392b", "NADIR 28-A"),
    ]:
        fig.add_hline(
            y=f_val,
            line=dict(color=color, dash="dot", width=1),
            annotation_text=texto,
            annotation_font=dict(color=color, size=8),
            row=2, col=1,
        )

    fig.update_layout(
        **_LAYOUT_BASE,
        title=dict(
            text="📊 HOY vs 28-A — Comparativa directa en tiempo real",
            font=dict(size=14, color="#e8eaf0"),
        ),
        height=550,
    )
    fig.update_yaxes(gridcolor="rgba(255,255,255,0.06)")
    fig.update_xaxes(gridcolor="rgba(255,255,255,0.06)", tickformat="%H:%M")

    return fig


# ══════════════════════════════════════════════════════════════════════════════
# 5. TARJETA DE ESTADÍSTICAS CLAVE (helper para Streamlit)
# ══════════════════════════════════════════════════════════════════════════════

def stats_frecuencia_28a(df_freq: pd.DataFrame) -> dict:
    """Extrae estadísticas clave del dataset de frecuencia para mostrar en métricas."""
    if df_freq.empty:
        return {}
    return {
        "freq_min":       df_freq["freq"].min(),
        "freq_max":       df_freq["freq"].max(),
        "t_nadir_s":      int(df_freq.loc[df_freq["freq"].idxmin(), "t_s"]),
        "rocof_max":      df_freq["rocof"].abs().max() if "rocof" in df_freq.columns else None,
        "n_eventos":      df_freq["evento"].notna().sum() if "evento" in df_freq.columns else 0,
        "hora_nadir":     df_freq.loc[df_freq["freq"].idxmin(), "hora_dt"].strftime("%H:%M:%S"),
        "hora_colapso":   "12:33:00",
    }


def stats_precios_28a(df_desbalance: pd.DataFrame, df_precios: pd.DataFrame) -> dict:
    """Estadísticas de precios para métricas."""
    resultado = {}
    if not df_desbalance.empty:
        resultado["desbalance_max"]  = df_desbalance["precio_max_eur"].max()
        resultado["hora_desbal_max"] = df_desbalance.loc[
            df_desbalance["precio_max_eur"].idxmax(), "hora_dt"
        ].strftime("%H:%M")
    if not df_precios.empty and "spot_eur" in df_precios.columns:
        resultado["spot_min"]   = df_precios["spot_eur"].min()
        resultado["spot_max"]   = df_precios["spot_eur"].max()
        resultado["horas_neg"]  = (df_precios["spot_eur"] < 0).sum()
    return resultado
