"""
alertas.py — Motor de diagnóstico y alertas del sistema eléctrico.

Compara las métricas actuales con:
  1. Umbrales operativos (verde / ámbar / rojo)
  2. Valores registrados en el 28 de abril de 2025 en el momento del colapso

Umbrales basados en:
  - RdE (Red Eléctrica de España): Procedimientos de Operación P.O. 7.4
  - ENTSO-E: System Defence Plans
  - Análisis forense del incidente del 28-A (datos ESIOS / ENTSO-E)
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)


# ------------------------------------------------------------------ #
#  Valores de referencia del 28-A (instante t ≈ 12:33 UTC)
# ------------------------------------------------------------------ #
VALORES_28A_COLAPSO: Dict[str, float] = {
    "inercia":      1.18,   # segundos — estimado a partir de generación síncrona en línea
    "penetracion":  84.5,   # % solar + eólica sobre demanda
    "frecuencia":   49.85,  # Hz — valor registrado justo antes del colapso
    "rocof":        0.48,   # Hz/s — valor pico antes de la activación del UFLS
    "demanda":      25_184, # MW — último valor registrado antes del colapso en ESIOS
    "precio_spot":  -2.5,   # €/MWh — precio negativo (exceso de renovables)
}


# ------------------------------------------------------------------ #
#  Definición de umbrales por variable
# ------------------------------------------------------------------ #
@dataclass
class ConfigUmbral:
    """Configuración de umbrales para una variable."""
    nombre_display: str
    unidad: str
    ambar: float
    rojo: float
    comparacion: str   # '>' o '<'
    descripcion_rojo: str
    descripcion_ambar: str


UMBRALES: Dict[str, ConfigUmbral] = {
    "inercia": ConfigUmbral(
        nombre_display="Inercia equivalente",
        unidad="s",
        ambar=2.5,
        rojo=1.5,
        comparacion="<",
        descripcion_rojo="Inercia crítica — el sistema no puede amortiguar perturbaciones (28-A: 1.18 s)",
        descripcion_ambar="Inercia reducida — penetración renovable elevada",
    ),
    "penetracion": ConfigUmbral(
        nombre_display="Penetración renovable",
        unidad="%",
        ambar=65.0,
        rojo=75.0,
        comparacion=">",
        descripcion_rojo="Penetración extrema — riesgo de inestabilidad de tensión (28-A: 84.5 %)",
        descripcion_ambar="Penetración alta — reducción de inercia síncrona",
    ),
    "frecuencia": ConfigUmbral(
        nombre_display="Frecuencia del sistema",
        unidad="Hz",
        ambar=49.80,
        rojo=49.50,
        comparacion="<",
        descripcion_rojo="Frecuencia crítica — UFLS (deslastre automático) puede activarse",
        descripcion_ambar="Frecuencia reducida — regulación secundaria en acción",
    ),
    "rocof": ConfigUmbral(
        nombre_display="RoCoF (|Hz/s|)",
        unidad="Hz/s",
        ambar=0.10,
        rojo=0.30,
        comparacion=">",
        descripcion_rojo="RoCoF elevado — riesgo de desconexión de inversores (28-A: 0.48 Hz/s)",
        descripcion_ambar="RoCoF moderado — monitorización activa recomendada",
    ),
}


# ------------------------------------------------------------------ #
#  Dataclass de alerta
# ------------------------------------------------------------------ #
@dataclass
class Alerta:
    timestamp: str
    variable: str
    nombre_display: str
    valor_actual: float
    valor_28a: Optional[float]
    umbral_rojo: float
    nivel: str            # 'rojo' | 'ambar' | 'verde'
    icono: str
    mensaje_corto: str
    mensaje_largo: str
    diferencia_28a: Optional[float] = field(default=None)

    def __post_init__(self):
        if self.valor_actual is not None and self.valor_28a is not None:
            self.diferencia_28a = round(self.valor_actual - self.valor_28a, 3)

    @property
    def es_critica(self) -> bool:
        return self.nivel == "rojo"

    def to_dict(self) -> dict:
        return {
            "timestamp": self.timestamp,
            "variable": self.variable,
            "valor_actual": self.valor_actual,
            "valor_28A": self.valor_28a,
            "diferencia_28A": self.diferencia_28a,
            "nivel": self.nivel,
            "mensaje": self.mensaje_corto,
        }


# ------------------------------------------------------------------ #
#  Función principal de evaluación
# ------------------------------------------------------------------ #
def evaluar_snapshot(snapshot: dict) -> List[Alerta]:
    """
    Evalúa un snapshot de datos y devuelve la lista de alertas activas.

    Args:
        snapshot: Diccionario con las métricas actuales del sistema.
                  Claves esperadas: inercia, penetracion, frecuencia, rocof.

    Returns:
        Lista de objetos Alerta (puede ser vacía si todo está en verde).
    """
    alertas: List[Alerta] = []
    ts = snapshot.get("timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    for var, cfg in UMBRALES.items():
        valor = snapshot.get(var)
        if valor is None:
            continue

        try:
            valor = float(valor)
        except (TypeError, ValueError):
            continue

        nivel, icono = _clasificar_nivel(valor, cfg)

        if nivel == "verde":
            continue  # Sin alerta en verde

        valor_28a = VALORES_28A_COLAPSO.get(var)

        if nivel == "rojo":
            mensaje_corto = f"{cfg.nombre_display} CRÍTICA: {valor:.2f} {cfg.unidad}"
            mensaje_largo = cfg.descripcion_rojo
        else:
            mensaje_corto = f"{cfg.nombre_display} en zona de precaución: {valor:.2f} {cfg.unidad}"
            mensaje_largo = cfg.descripcion_ambar

        alertas.append(Alerta(
            timestamp=ts,
            variable=var,
            nombre_display=cfg.nombre_display,
            valor_actual=valor,
            valor_28a=valor_28a,
            umbral_rojo=cfg.rojo,
            nivel=nivel,
            icono=icono,
            mensaje_corto=mensaje_corto,
            mensaje_largo=mensaje_largo,
        ))

    return alertas


def _clasificar_nivel(valor: float, cfg: ConfigUmbral) -> Tuple[str, str]:
    """Clasifica un valor en verde/ámbar/rojo según su umbral y dirección."""
    mayor = cfg.comparacion == ">"

    if mayor:
        if valor >= cfg.rojo:
            return "rojo", "🔴"
        elif valor >= cfg.ambar:
            return "ambar", "🟡"
    else:
        if valor <= cfg.rojo:
            return "rojo", "🔴"
        elif valor <= cfg.ambar:
            return "ambar", "🟡"

    return "verde", "🟢"


# ------------------------------------------------------------------ #
#  Utilidades de resumen
# ------------------------------------------------------------------ #
def nivel_global(alertas: List[Alerta]) -> Tuple[str, str]:
    """
    Devuelve el nivel global del sistema (el peor de las alertas activas).

    Returns:
        (icono, descripción)
    """
    if not alertas:
        return ("🟢", "Sistema en condiciones normales")

    niveles = [a.nivel for a in alertas]
    if "rojo" in niveles:
        n_rojo = sum(1 for n in niveles if n == "rojo")
        return ("🔴", f"ALERTA CRÍTICA — {n_rojo} variable(s) en nivel rojo")
    else:
        n_ambar = sum(1 for n in niveles if n == "ambar")
        return ("🟡", f"Precaución — {n_ambar} variable(s) en zona ámbar")


def comparar_con_28a(snapshot: dict) -> Dict[str, dict]:
    """
    Compara cada variable del snapshot con su valor en el 28-A.

    Returns:
        Diccionario {variable: {actual, 28a, diferencia, porcentaje, peor_o_mejor}}
    """
    resultado = {}
    for var, val_28a in VALORES_28A_COLAPSO.items():
        val_actual = snapshot.get(var)
        if val_actual is None:
            continue
        try:
            val_actual = float(val_actual)
        except (TypeError, ValueError):
            continue

        diferencia = val_actual - val_28a
        porcentaje = (diferencia / abs(val_28a)) * 100 if val_28a != 0 else None
        cfg = UMBRALES.get(var)
        if cfg:
            # "mejor" significa: si comparacion='<' (como frecuencia/inercia), mejor = mayor; si '>', mejor = menor
            peor = (cfg.comparacion == "<" and diferencia < 0) or \
                   (cfg.comparacion == ">" and diferencia > 0)
        else:
            peor = None

        resultado[var] = {
            "actual": round(val_actual, 3),
            "28a": round(val_28a, 3),
            "diferencia": round(diferencia, 3),
            "porcentaje": round(porcentaje, 1) if porcentaje is not None else None,
            "peor_que_28a": peor,
        }
    return resultado
