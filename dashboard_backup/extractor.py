"""
extractor.py — Extracción de datos en tiempo real desde APIs oficiales.

Fuentes:
    - ESIOS (REE):   demanda, generación por tecnología, precios, flujos
    - ENTSO-E:       precio de desbalance (imbalance price, doc. A85)
    - Swissgrid:     frecuencia del sistema síncrono continental (fallback: 50.00 Hz)

Características:
    - Reintentos con backoff exponencial en cada petición
    - Caché local en JSON (últimas MAX_CACHE_SIZE extracciones)
    - Validaciones de rango sobre los valores devueltos
    - Todos los errores se loggean; nunca se propagan al llamador
"""

import json
import logging
import os
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class GridDataExtractor:
    """
    Orquestador de todas las peticiones a APIs de operadores eléctricos.
    """

    # ------------------------------------------------------------------ #
    #  Constantes de configuración
    # ------------------------------------------------------------------ #

    # Indicadores ESIOS (IDs oficiales — https://api.esios.ree.es/indicators)
    ESIOS_IDS: Dict[str, int] = {
        "demanda":      1293,   # Demanda real peninsular (MW)
        "solar":        1295,   # Generación solar fotovoltaica (MW)
        "eolica":        551,   # Generación eólica (MW)
        "nuclear":       549,   # Generación nuclear (MW)
        "ccgt":         2041,   # Ciclo combinado gas (MW)
        "hidraulica":    546,   # Hidráulica (MW)
        "precio_spot":   600,   # Precio SPOT mercado diario (€/MWh)
        "francia_imp":   556,   # Importación desde Francia (MW)
        "francia_exp":   560,   # Exportación a Francia (MW)
        "portugal_imp":  557,   # Importación desde Portugal (MW)
        "portugal_exp":  561,   # Exportación a Portugal (MW)
    }

    # ENTSO-E — área de control de España
    ENTSOE_DOMAIN_SPAIN = "10YES-REE------0"
    ENTSOE_DOC_IMBALANCE = "A85"
    ENTSOE_BASE_URL      = "https://transparency.entsoe.eu/api"

    # Swissgrid — frecuencia del sistema continental
    # NOTA: la URL pública de Swissgrid puede cambiar. Si falla, se usa 50.00 Hz como
    # fallback y se loggea el aviso. Para producción real, considerar la API de ENTSO-E
    # (endpoint /api?documentType=A11) o Elia (https://griddata.elia.be).
    SWISSGRID_FREQ_URL = "https://www.swissgrid.ch/de/home/operation/grid-data/current-data.html"

    ESIOS_BASE = "https://api.esios.ree.es/indicators"

    CACHE_FILE     = "cache_datos.json"
    MAX_CACHE_SIZE = 50

    # ------------------------------------------------------------------ #
    #  Inicialización
    # ------------------------------------------------------------------ #

    def __init__(self, esios_token: str = None, entsoe_token: str = None):
        self.esios_token  = esios_token  or os.getenv("ESIOS_API_KEY",  "")
        self.entsoe_token = entsoe_token or os.getenv("ENTSOE_API_KEY", "")

        if not self.esios_token or not self.entsoe_token:
            raise ValueError(
                "Faltan tokens de API. Define ESIOS_API_KEY y ENTSOE_API_KEY en el archivo .env"
            )

        self.esios_headers = {
            "Accept":       "application/json; application/vnd.esios-api-v1+json",
            "Content-Type": "application/json",
            "x-api-key":    self.esios_token,
        }
        self.cache: List[Dict] = self._cargar_cache()

    # ------------------------------------------------------------------ #
    #  Caché local
    # ------------------------------------------------------------------ #

    def _cargar_cache(self) -> List[Dict]:
        if os.path.exists(self.CACHE_FILE):
            try:
                with open(self.CACHE_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning("No se pudo cargar la caché: %s", e)
        return []

    def _guardar_cache(self) -> None:
        try:
            with open(self.CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(self.cache[-self.MAX_CACHE_SIZE:], f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.warning("No se pudo guardar la caché: %s", e)

    def _agregar_a_cache(self, snapshot: Dict[str, Any]) -> None:
        self.cache.append(snapshot)
        if len(self.cache) > self.MAX_CACHE_SIZE:
            self.cache.pop(0)
        self._guardar_cache()

    # ------------------------------------------------------------------ #
    #  Utilidades de tiempo
    # ------------------------------------------------------------------ #

    def _ventana_esios(self, minutos: int = 45) -> Tuple[str, str]:
        """Ventana temporal para ESIOS en formato ISO 8601 UTC."""
        now   = datetime.now(timezone.utc)
        start = now - timedelta(minutes=minutos)
        fmt   = "%Y-%m-%dT%H:%M:%S.000Z"
        return start.strftime(fmt), now.strftime(fmt)

    def _ventana_entsoe(self, horas: int = 4) -> Tuple[str, str]:
        """Ventana temporal para ENTSO-E en formato YYYYMMDDhh00."""
        now   = datetime.now(timezone.utc)
        start = now - timedelta(hours=horas)
        fmt   = "%Y%m%d%H00"
        return start.strftime(fmt), now.strftime(fmt)

    # ------------------------------------------------------------------ #
    #  Petición HTTP con reintentos
    # ------------------------------------------------------------------ #

    def _get(self, url: str, headers: dict = None, params: dict = None,
             max_retries: int = 3, timeout: int = 10) -> Optional[requests.Response]:
        """GET con reintentos y backoff exponencial."""
        for intento in range(max_retries):
            try:
                resp = requests.get(url, headers=headers, params=params, timeout=timeout)
                resp.raise_for_status()
                return resp
            except requests.exceptions.HTTPError as e:
                logger.error("HTTP %s en %s: %s", e.response.status_code, url, e)
                return None   # No reintentar en errores 4xx
            except requests.exceptions.RequestException as e:
                if intento == max_retries - 1:
                    logger.error("Fallo definitivo en %s: %s", url, e)
                    return None
                espera = 2 ** intento
                logger.debug("Reintento %d/%d para %s en %ds", intento + 1, max_retries, url, espera)
                time.sleep(espera)
        return None

    # ------------------------------------------------------------------ #
    #  ESIOS
    # ------------------------------------------------------------------ #

    def fetch_esios_indicador(self, indicator_id: int) -> Optional[float]:
        """Devuelve el último valor de un indicador ESIOS."""
        start, end = self._ventana_esios(minutos=45)
        time_trunc = "hour" if indicator_id == 600 else "five_minutes"

        resp = self._get(
            url    = f"{self.ESIOS_BASE}/{indicator_id}",
            headers = self.esios_headers,
            params  = {"start_date": start, "end_date": end, "time_trunc": time_trunc},
        )
        if not resp:
            return None

        try:
            valores = resp.json().get("indicator", {}).get("values", [])
            if not valores:
                return None
            ultimo = valores[-1].get("value")
            return float(ultimo) if ultimo is not None else None
        except Exception as e:
            logger.error("Error parseando indicador %d: %s", indicator_id, e)
            return None

    # ------------------------------------------------------------------ #
    #  ENTSO-E (precio de desbalance)
    # ------------------------------------------------------------------ #

    def fetch_entsoe_imbalance_price(self) -> Optional[float]:
        """
        Obtiene el precio de desbalance (doc. A85) para España.

        El namespace del XML de ENTSO-E varía por versión de documento, por lo que
        se extrae dinámicamente del tag raíz en lugar de usarlo literal.
        xml.etree.ElementTree NO soporta XPath 2.0 (local-name()), por eso
        se usa root.iter() con el namespace extraído.
        """
        start, end = self._ventana_entsoe(horas=4)
        resp = self._get(
            url    = self.ENTSOE_BASE_URL,
            params = {
                "securityToken":     self.entsoe_token,
                "documentType":      self.ENTSOE_DOC_IMBALANCE,
                "controlArea_Domain": self.ENTSOE_DOMAIN_SPAIN,
                "periodStart":       start,
                "periodEnd":         end,
            },
            timeout=15,
        )
        if not resp:
            return None

        try:
            root = ET.fromstring(resp.text)

            # Extraer namespace dinámicamente del tag raíz
            # Formato esperado: '{urn:iec62325.351:tc57wg16:451-6:balancingdocument:3:0}BalancingMarketDocument'
            ns = ""
            if "}" in root.tag:
                ns = root.tag.split("}")[0] + "}"

            for point in root.iter(f"{ns}Point"):
                amount = point.find(f"{ns}imbalance_Price.amount")
                if amount is not None and amount.text:
                    return float(amount.text)

            logger.debug("No se encontró imbalance_Price.amount en la respuesta de ENTSO-E")
            return None

        except ET.ParseError as e:
            logger.error("Error parseando XML de ENTSO-E: %s", e)
            return None
        except ValueError as e:
            logger.error("Error convirtiendo imbalance price a float: %s", e)
            return None

    # ------------------------------------------------------------------ #
    #  Frecuencia del sistema (Swissgrid con fallback)
    # ------------------------------------------------------------------ #

    def fetch_system_frequency(self) -> Optional[float]:
        """
        Intenta obtener la frecuencia del sistema síncrono continental.

        Fuente primaria: Swissgrid (API pública, disponibilidad no garantizada).
        Fallback: 50.00 Hz nominal (se loggea el aviso).

        NOTA: Para integración en producción real, se recomienda implementar
        un polling de la API de ENTSO-E (documentType=A11, Control Area frequency)
        o scraping de la API de Elia (Belgium), que es más estable.
        """
        resp = self._get(self.SWISSGRID_FREQ_URL, timeout=5)
        if resp:
            try:
                data = resp.json()
                freq = None
                if isinstance(data, list) and data:
                    freq = data[0].get("frequency")
                elif isinstance(data, dict):
                    freq = data.get("frequency")

                if freq is not None:
                    freq_float = float(freq)
                    if 48.0 < freq_float < 52.0:
                        return round(freq_float, 3)
            except Exception as e:
                logger.debug("No se pudo parsear respuesta de Swissgrid: %s", e)

        logger.info("Frecuencia no disponible desde Swissgrid — usando fallback 50.00 Hz")
        return 50.00   # Frecuencia nominal continental

    # ------------------------------------------------------------------ #
    #  Método principal: snapshot agregado
    # ------------------------------------------------------------------ #

    def get_aggregated_snapshot(self) -> Dict[str, Any]:
        """
        Orquesta todas las consultas y devuelve un diccionario completo con el
        estado actual del sistema eléctrico.

        Realiza validaciones de rango y gestiona valores ausentes con None.
        Persiste el resultado en la caché local.
        """
        logger.info("Iniciando sincronización de telemedidas...")

        # ---- ESIOS ----
        demanda    = self.fetch_esios_indicador(self.ESIOS_IDS["demanda"])
        solar      = self.fetch_esios_indicador(self.ESIOS_IDS["solar"])
        eolica     = self.fetch_esios_indicador(self.ESIOS_IDS["eolica"])
        nuclear    = self.fetch_esios_indicador(self.ESIOS_IDS["nuclear"])
        ccgt       = self.fetch_esios_indicador(self.ESIOS_IDS["ccgt"])
        hidraulica = self.fetch_esios_indicador(self.ESIOS_IDS["hidraulica"])
        precio_spot= self.fetch_esios_indicador(self.ESIOS_IDS["precio_spot"])

        # Flujos de interconexión (positivo = importación neta)
        fr_imp = self.fetch_esios_indicador(self.ESIOS_IDS["francia_imp"])
        fr_exp = self.fetch_esios_indicador(self.ESIOS_IDS["francia_exp"])
        flujo_francia = (fr_imp - fr_exp) if (fr_imp is not None and fr_exp is not None) else None

        pt_imp = self.fetch_esios_indicador(self.ESIOS_IDS["portugal_imp"])
        pt_exp = self.fetch_esios_indicador(self.ESIOS_IDS["portugal_exp"])
        flujo_portugal = (pt_imp - pt_exp) if (pt_imp is not None and pt_exp is not None) else None

        # ---- ENTSO-E ----
        precio_desbalance = self.fetch_entsoe_imbalance_price()

        # ---- Frecuencia ----
        frecuencia = self.fetch_system_frequency()

        # ---- Construcción del snapshot ----
        snapshot: Dict[str, Any] = {
            "timestamp":        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "demanda":          demanda,
            "solar":            solar,
            "eolica":           eolica,
            "nuclear":          nuclear,
            "ccgt":             ccgt,
            "hidraulica":       hidraulica,
            "precio_spot":      precio_spot,
            "precio_desbalance":precio_desbalance,
            "flujo_francia":    flujo_francia,
            "flujo_portugal":   flujo_portugal,
            "frecuencia":       frecuencia,
        }

        # ---- Validaciones de rango (informativas) ----
        if demanda is not None and not (5_000 < demanda < 55_000):
            logger.warning("Demanda fuera de rango esperado: %.0f MW", demanda)
        if frecuencia is not None and not (49.0 < frecuencia < 51.0):
            logger.warning("Frecuencia fuera de rango normal: %.3f Hz", frecuencia)
        if precio_spot is not None and not (-200 < precio_spot < 500):
            logger.warning("Precio SPOT inusual: %.2f €/MWh", precio_spot)

        # ---- Caché ----
        self._agregar_a_cache(snapshot)
        logger.info("Snapshot capturado correctamente: demanda=%.0f MW, f=%.3f Hz",
                    demanda or 0, frecuencia or 0)

        return snapshot

    def get_last_cached(self) -> List[Dict]:
        """Devuelve las últimas extracciones almacenadas en caché."""
        return self.cache[-self.MAX_CACHE_SIZE:]
