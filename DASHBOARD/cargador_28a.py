"""
cargador_28a.py — Cargador de datos forenses del 28 de abril de 2025

Parsers exactos basados en las estructuras reales del proyecto:

  frequency_28A.json         → {t, time, freq, rocof, event, event_type, ...}
  demanda_28_29_abril.json   → {datetime ISO+TZ, "Demanda real", "Demanda programada", "Demanda prevista"}
  precios_28_29_abril.json   → {datetime ISO+TZ, "PVPC T. 2.0TD", "Mercado SPOT"}
  imbalance_prices_28A.json  → {data: {"2025-04-28": [{time_interval, positive/negative_imbalance_price_eur_mwh, ...}]}}

Ruta base detectada automáticamente:
  ../tfg-antigravity-docs/static/data/   ← estructura Docusaurus del TFG
  ../../tfg-antigravity-docs/static/data/
  ./static/data/   (si el dashboard está dentro de la carpeta static)
"""

import json
import logging
import os
from datetime import datetime, timedelta
from typing import Optional

import pandas as pd
import streamlit as st

logger = logging.getLogger(__name__)

# ─── Rutas base candidatas ────────────────────────────────────────────────────
_BASES = [
    "../tfg-antigravity-docs/static/data",
    "../../tfg-antigravity-docs/static/data",
    "./static/data",
    "./datos",
    ".",
]

# t=0 en frequency_28A.json = colapso 28-A a las 12:33 CEST
T_COLAPSO_CEST = datetime(2025, 4, 28, 12, 33, 0)


def _ruta(subpath: str) -> Optional[str]:
    for base in _BASES:
        r = os.path.join(base, subpath)
        if os.path.isfile(r):
            return r
    return None


def _leer_json(subpath: str):
    r = _ruta(subpath)
    if not r:
        logger.error("No encontrado: %s", subpath)
        return None
    with open(r, "r", encoding="utf-8") as f:
        return json.load(f)


# ══════════════════════════════════════════════════════════════════════════════
# 1. FRECUENCIA
#    frequency_28A.json
#    Campos: t (s rel. colapso), time, freq, rocof, event, event_type, confidence
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data(ttl=3600)
def cargar_frecuencia_28a() -> pd.DataFrame:
    """
    Columnas devueltas:
      hora_dt     : datetime absoluto CEST
      t_s         : segundos relativos al colapso (0 = 12:33:00)
      freq        : Hz
      rocof       : Hz/s
      evento      : texto del evento (o NaN)
      evento_tipo : oscillation | operator_action | collapse | recovery ...
      confianza   : high | medium | low
    """
    raw = _leer_json("frequency_28A.json")
    if raw is None:
        raise FileNotFoundError("frequency_28A.json no encontrado. Revisa _BASES en cargador_28a.py")

    df = pd.DataFrame(raw)
    df["t_s"]     = pd.to_numeric(df["t"],    errors="coerce")
    df["freq"]    = pd.to_numeric(df["freq"], errors="coerce")
    df["rocof"]   = pd.to_numeric(df.get("rocof", 0), errors="coerce").fillna(0.0)
    df["hora_dt"] = df["t_s"].apply(lambda t: T_COLAPSO_CEST + timedelta(seconds=float(t)))

    df = df.rename(columns={
        "event":       "evento",
        "event_type":  "evento_tipo",
        "confidence":  "confianza",
        "voltage_condition": "tension_estado",
    })

    cols = ["hora_dt", "t_s", "freq", "rocof", "evento", "evento_tipo",
            "confianza", "tension_estado"]
    cols_ok = [c for c in cols if c in df.columns]
    return df[cols_ok].sort_values("t_s").reset_index(drop=True)


# ══════════════════════════════════════════════════════════════════════════════
# 2. DEMANDA
#    demanda_28_29_abril.json
#    Campos: datetime ISO+TZ, "Demanda real", "Demanda programada", "Demanda prevista"
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data(ttl=3600)
def cargar_demanda_28a() -> pd.DataFrame:
    """
    Columnas: hora_dt, demanda_real_mw, demanda_prog_mw, demanda_prev_mw, desviacion_mw
    Filtrado solo al 28-A.
    """
    raw = _leer_json("esios/demanda_28_29_abril.json")
    if raw is None:
        raise FileNotFoundError("esios/demanda_28_29_abril.json no encontrado")

    df = pd.DataFrame(raw)
    df["hora_dt"] = pd.to_datetime(df["datetime"], utc=True)
    df = df.rename(columns={
        "Demanda real":       "demanda_real_mw",
        "Demanda programada": "demanda_prog_mw",
        "Demanda prevista":   "demanda_prev_mw",
    })
    for c in ["demanda_real_mw", "demanda_prog_mw", "demanda_prev_mw"]:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce")
    df["desviacion_mw"] = df["demanda_real_mw"] - df["demanda_prog_mw"]

    # Solo el 28-A
    df = df[df["hora_dt"].dt.date == pd.Timestamp("2025-04-28", tz="UTC").date()]
    return df.sort_values("hora_dt").reset_index(drop=True)


# ══════════════════════════════════════════════════════════════════════════════
# 3. PRECIOS SPOT / PVPC
#    precios_28_29_abril.json
#    Campos: datetime ISO+TZ, "PVPC T. 2.0TD", "Mercado SPOT"
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data(ttl=3600)
def cargar_precios_28a() -> pd.DataFrame:
    """Columnas: hora_dt, pvpc_eur, spot_eur"""
    raw = _leer_json("esios/precios_28_29_abril.json")
    if raw is None:
        raise FileNotFoundError("esios/precios_28_29_abril.json no encontrado")

    df = pd.DataFrame(raw)
    df["hora_dt"] = pd.to_datetime(df["datetime"], utc=True)
    df = df.rename(columns={"PVPC T. 2.0TD": "pvpc_eur", "Mercado SPOT": "spot_eur"})
    df["pvpc_eur"] = pd.to_numeric(df["pvpc_eur"], errors="coerce")
    df["spot_eur"] = pd.to_numeric(df["spot_eur"],  errors="coerce")

    df = df[df["hora_dt"].dt.date == pd.Timestamp("2025-04-28", tz="UTC").date()]
    return df.sort_values("hora_dt").reset_index(drop=True)


# ══════════════════════════════════════════════════════════════════════════════
# 4. PRECIOS DE DESBALANCE ENTSO-E
#    imbalance_prices_28A.json
#    Estructura: {data: {"2025-04-28": [{time_interval "HH:MM - HH:MM",
#                  positive_imbalance_price_eur_mwh, negative_imbalance_price_eur_mwh,
#                  total_imbalance_mwh, situation, status}]}}
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data(ttl=3600)
def cargar_desbalance_28a() -> pd.DataFrame:
    """
    Columnas: hora_dt, precio_pos_eur, precio_neg_eur, precio_max_eur,
              volumen_mwh, situacion
    Intervalos de 15 minutos.
    """
    raw = _leer_json("entsoe/imbalance_prices_28A.json")
    if raw is None:
        raise FileNotFoundError("entsoe/imbalance_prices_28A.json no encontrado")

    registros = raw.get("data", {}).get("2025-04-28", [])
    base = datetime(2025, 4, 28, 0, 0, 0)
    rows = []

    for reg in registros:
        try:
            hora_str = reg["time_interval"].split(" - ")[0]   # "HH:MM"
            h, m = map(int, hora_str.split(":"))
            ts = base + timedelta(hours=h, minutes=m)
        except Exception:
            continue

        pp = float(reg.get("positive_imbalance_price_eur_mwh") or 0)
        pn = float(reg.get("negative_imbalance_price_eur_mwh") or 0)
        rows.append({
            "hora_dt":        ts,
            "precio_pos_eur": pp,
            "precio_neg_eur": pn,
            "precio_max_eur": max(pp, pn),
            "volumen_mwh":    float(reg.get("total_imbalance_mwh") or 0),
            "situacion":      reg.get("situation", ""),
        })

    df = pd.DataFrame(rows).sort_values("hora_dt").reset_index(drop=True)
    logger.info("Desbalance 28-A: %d intervalos | Pico %.0f €/MWh",
                len(df), df["precio_max_eur"].max())
    return df


# ══════════════════════════════════════════════════════════════════════════════
# 5. MAESTRA + DIAGNÓSTICO
# ══════════════════════════════════════════════════════════════════════════════

@st.cache_data(ttl=3600)
def cargar_todos() -> dict:
    return {
        "frecuencia": cargar_frecuencia_28a(),
        "demanda":    cargar_demanda_28a(),
        "precios":    cargar_precios_28a(),
        "desbalance": cargar_desbalance_28a(),
    }


def verificar_archivos() -> dict:
    archivos = {
        "frequency_28A.json":       "frequency_28A.json",
        "demanda_28_29_abril.json": "esios/demanda_28_29_abril.json",
        "precios_28_29_abril.json": "esios/precios_28_29_abril.json",
        "imbalance_prices_28A.json":"entsoe/imbalance_prices_28A.json",
    }
    return {
        nombre: {"ruta": _ruta(sub), "ok": _ruta(sub) is not None}
        for nombre, sub in archivos.items()
    }
