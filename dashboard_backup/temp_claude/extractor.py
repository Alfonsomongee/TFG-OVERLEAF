"""
extractor.py — Extractor de telemedidas del Sistema Eléctrico Español

Fuentes:
  - ESIOS (REE): API REST con token de autenticación
  - ENTSO-E: API XML pública (precio de desbalance)
  - Swissgrid: frecuencia continental (fallback)

Métricas:
  - Demanda, generación por tecnología, flujos de interconexión
  - Precio spot, precio desbalance
  - Frecuencia de red
  - Reservas primaria/secundaria (FCR, aFRR)
  - Coste de desvíos contrarios
  - Potencia reactiva (proxy de tensión)
  - PDBF (Programa diario base de funcionamiento)
"""

import logging
import os
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import requests
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# ─── IDs de indicadores ESIOS ───────────────────────────────────────────────
ESIOS_IDS: Dict[str, int] = {
    # Generación y demanda
    "demanda":             1293,
    "solar":               1295,
    "eolica":               551,
    "nuclear":              549,
    "ccgt":                2041,
    "hidraulica":           546,
    "cogeneracion":         543,
    "carbon":              1162,

    # Precios
    "precio_spot":          600,
    "precio_desbalance":    685,   # Coste de desvíos contrarios (€/MWh)

    # Flujos de interconexión
    "flujo_fr_importacion": 556,
    "flujo_fr_exportacion": 560,
    "flujo_pt_importacion": 557,
    "flujo_pt_exportacion": 561,

    # Reservas de regulación (FCR = regulación primaria, aFRR = secundaria)
    "fcr_requerida":        330,   # MW reserva primaria requerida
    "afrr_disponible":     1977,   # MW reserva secundaria disponible
    "banda_subir":          632,   # MW banda secundaria subir
    "banda_bajar":          633,   # MW banda secundaria bajar

    # Balance y tensión
    "reactiva_neta":        548,   # MVAr potencia reactiva
    "pdbf":                 545,   # MW Programa diario base funcionamiento

    # Frecuencia
    "frecuencia_red":      1503,   # Hz frecuencia peninsular (si disponible)
}

ENTSOE_DOMAIN_ES = "10YES-REE------0"
ENTSOE_DOMAIN_FR = "10YFR-RTE------C"
ENTSOE_DOMAIN_PT = "10YPT-REN------W"

TIMEOUT_S  = 12    # segundos por petición
SWISSGRID_URL = "https://www.swissgrid.ch/bin/public/frequency-data/frequency"


class GridDataExtractor:
    """
    Extrae y agrega datos del sistema eléctrico peninsular.

    Uso:
        ext = GridDataExtractor()
        snap = ext.get_aggregated_snapshot()
    """

    def __init__(self):
        self.esios_token = os.getenv("ESIOS_API_KEY", "")
        self.entsoe_token = os.getenv("ENTSOE_API_KEY", "")
        if not self.esios_token:
            raise ValueError(
                "ESIOS_API_KEY no encontrado. Crea .env con ESIOS_API_KEY=tu_token"
            )
        self._session = requests.Session()
        self._session.headers.update({
            "Authorization": f"Token token={self.esios_token}",
            "Accept":        "application/json; application/vnd.esios-api-v1+json",
            "Content-Type":  "application/json",
        })
        logger.info("GridDataExtractor inicializado (ENTSOE=%s)",
                    "✓" if self.entsoe_token else "no configurado")

    # ─────────────────────────────────────────────────────────────────────────
    #  ESIOS helpers
    # ─────────────────────────────────────────────────────────────────────────

    def _fetch_esios(self, indicator_id: int) -> Optional[float]:
        """Obtiene el último valor disponible de un indicador ESIOS."""
        now   = datetime.now(timezone.utc)
        start = (now - timedelta(hours=2)).strftime("%Y-%m-%dT%H:%M:%SZ")
        end   = now.strftime("%Y-%m-%dT%H:%M:%SZ")
        url   = f"https://api.esios.ree.es/indicators/{indicator_id}"
        params = {"start_date": start, "end_date": end}
        try:
            r = self._session.get(url, params=params, timeout=TIMEOUT_S)
            r.raise_for_status()
            data = r.json()
            values = data.get("indicator", {}).get("values", [])
            if values:
                return float(values[-1]["value"])
        except Exception as e:
            logger.debug("ESIOS ID %d: %s", indicator_id, e)
        return None

    def _fetch_esios_batch(self, ids: Dict[str, int]) -> Dict[str, Optional[float]]:
        """Obtiene múltiples indicadores en paralelo (secuencial con caché en memoria)."""
        results = {}
        for name, iid in ids.items():
            results[name] = self._fetch_esios(iid)
        return results

    # ─────────────────────────────────────────────────────────────────────────
    #  Frecuencia
    # ─────────────────────────────────────────────────────────────────────────

    def get_frecuencia(self) -> float:
        """Intenta obtener la frecuencia de ESIOS; fallback a Swissgrid; fallback 50.0."""
        # Intento 1: ESIOS
        val = self._fetch_esios(ESIOS_IDS["frecuencia_red"])
        if val and 48.0 < val < 52.0:
            return round(val, 4)

        # Intento 2: Swissgrid (frecuencia continental sincronizada)
        try:
            r = requests.get(SWISSGRID_URL, timeout=8)
            if r.status_code == 200:
                data = r.json()
                freq = data.get("frequency")
                if freq and 48.0 < freq < 52.0:
                    return round(float(freq), 4)
        except Exception:
            pass

        logger.warning("Frecuencia no disponible — usando 50.0 Hz como fallback")
        return 50.0

    # ─────────────────────────────────────────────────────────────────────────
    #  Precio de desbalance ENTSO-E
    # ─────────────────────────────────────────────────────────────────────────

    def get_precio_desbalance_entsoe(self) -> Optional[float]:
        """Precio de desvíos contrarios de ENTSO-E (€/MWh)."""
        if not self.entsoe_token:
            return None
        try:
            now = datetime.now(timezone.utc)
            period_start = (now - timedelta(hours=2)).strftime("%Y%m%d%H%M")
            period_end   = now.strftime("%Y%m%d%H%M")
            url = "https://web-api.tp.entsoe.eu/api"
            params = {
                "securityToken": self.entsoe_token,
                "documentType":  "A85",
                "controlArea_Domain": ENTSOE_DOMAIN_ES,
                "periodStart":   period_start,
                "periodEnd":     period_end,
            }
            r = requests.get(url, params=params, timeout=TIMEOUT_S)
            if r.status_code == 200:
                root = ET.fromstring(r.text)
                ns = root.tag.split("}")[0].lstrip("{") if "}" in root.tag else ""
                prefix = f"{{{ns}}}" if ns else ""
                points = list(root.iter(f"{prefix}Point"))
                if points:
                    val = points[-1].find(f"{prefix}quantity")
                    if val is not None:
                        return round(float(val.text), 2)
        except Exception as e:
            logger.debug("ENTSOE precio desbalance: %s", e)
        return None

    # ─────────────────────────────────────────────────────────────────────────
    #  Flujos de interconexión
    # ─────────────────────────────────────────────────────────────────────────

    def get_flujos_interconexion(self) -> Dict[str, Optional[float]]:
        """
        Flujo neto Francia y Portugal (positivo = importación a España).
        """
        imp_fr = self._fetch_esios(ESIOS_IDS["flujo_fr_importacion"]) or 0.0
        exp_fr = self._fetch_esios(ESIOS_IDS["flujo_fr_exportacion"]) or 0.0
        imp_pt = self._fetch_esios(ESIOS_IDS["flujo_pt_importacion"]) or 0.0
        exp_pt = self._fetch_esios(ESIOS_IDS["flujo_pt_exportacion"]) or 0.0

        return {
            "flujo_francia":  round(imp_fr - exp_fr, 1),   # + = import
            "flujo_portugal": round(imp_pt - exp_pt, 1),
        }

    # ─────────────────────────────────────────────────────────────────────────
    #  Reservas de regulación
    # ─────────────────────────────────────────────────────────────────────────

    def get_reservas(self) -> Dict[str, Optional[float]]:
        """
        Reservas de regulación primaria (FCR) y secundaria (aFRR).

        Referencias normativas:
          - FCR (Primary Frequency Response): ±200 MW en España (P.O. 7.1 REE)
          - aFRR: variable según REE (típico 300-600 MW banda total)
        """
        fcr   = self._fetch_esios(ESIOS_IDS["fcr_requerida"])
        afrr  = self._fetch_esios(ESIOS_IDS["afrr_disponible"])
        banda_subir = self._fetch_esios(ESIOS_IDS["banda_subir"])
        banda_bajar = self._fetch_esios(ESIOS_IDS["banda_bajar"])
        return {
            "fcr_requerida_mw":  fcr,
            "afrr_disponible_mw": afrr,
            "banda_subir_mw":    banda_subir,
            "banda_bajar_mw":    banda_bajar,
        }

    # ─────────────────────────────────────────────────────────────────────────
    #  Snapshot agregado principal
    # ─────────────────────────────────────────────────────────────────────────

    def get_aggregated_snapshot(self) -> Dict[str, Any]:
        """
        Extrae y combina TODAS las métricas en un único diccionario.

        Claves garantizadas (pueden ser None si la API falla):
          demanda, solar, eolica, nuclear, ccgt, hidraulica, cogeneracion,
          precio_spot, precio_desbalance, flujo_francia, flujo_portugal,
          frecuencia, timestamp, fcr_requerida_mw, afrr_disponible_mw,
          banda_subir_mw, banda_bajar_mw, reactiva_neta_mvar, pdbf_mw
        """
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info("Iniciando extracción de snapshot [%s]", ts)

        # Generación y demanda (batch)
        gen_ids = {
            "demanda":     ESIOS_IDS["demanda"],
            "solar":       ESIOS_IDS["solar"],
            "eolica":      ESIOS_IDS["eolica"],
            "nuclear":     ESIOS_IDS["nuclear"],
            "ccgt":        ESIOS_IDS["ccgt"],
            "hidraulica":  ESIOS_IDS["hidraulica"],
            "cogeneracion":ESIOS_IDS["cogeneracion"],
            "precio_spot": ESIOS_IDS["precio_spot"],
            "reactiva_neta": ESIOS_IDS["reactiva_neta"],
            "pdbf":        ESIOS_IDS["pdbf"],
        }
        gen_data = self._fetch_esios_batch(gen_ids)

        # Precio desbalance: ESIOS primero, luego ENTSO-E
        precio_desbalance = self._fetch_esios(ESIOS_IDS["precio_desbalance"])
        if precio_desbalance is None:
            precio_desbalance = self.get_precio_desbalance_entsoe()

        flujos    = self.get_flujos_interconexion()
        reservas  = self.get_reservas()
        frecuencia = self.get_frecuencia()

        snapshot = {
            "timestamp":         ts,
            # Generación
            "demanda":           gen_data.get("demanda"),
            "solar":             gen_data.get("solar"),
            "eolica":            gen_data.get("eolica"),
            "nuclear":           gen_data.get("nuclear"),
            "ccgt":              gen_data.get("ccgt"),
            "hidraulica":        gen_data.get("hidraulica"),
            "cogeneracion":      gen_data.get("cogeneracion"),
            # Precios
            "precio_spot":       gen_data.get("precio_spot"),
            "precio_desbalance": precio_desbalance,
            # Frecuencia
            "frecuencia":        frecuencia,
            # Flujos
            **flujos,
            # Reservas
            **reservas,
            # Tensión / balance
            "reactiva_neta_mvar": gen_data.get("reactiva_neta"),
            "pdbf_mw":            gen_data.get("pdbf"),
        }

        ok = sum(1 for v in snapshot.values() if v is not None)
        logger.info("Snapshot obtenido: %d/%d campos con datos", ok, len(snapshot))
        return snapshot
