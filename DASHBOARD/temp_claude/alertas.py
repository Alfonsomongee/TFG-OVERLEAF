"""
alertas.py — Motor de alertas semafóricas con umbrales normativos

Referencias normativas:
  - RoCoF:     ENTSO-E "RoCoF Withstand Capability" (2017) + NC RfG Artículo 14(3)
  - Frecuencia: P.O. 1.6 REE "Control de frecuencia e inercia"
  - Tensión:   P.O. 7.4 REE "Servicio de control de tensión de la red de transporte"
  - Inercia:   Cálculo dinámico según ecuación de oscilación (ENTSO-E Technical Report 2020)

Valores del 28 de abril de 2025 (instante colapso ~12:33 UTC+1):
  - Inercia:       ~1.18 s   (bajísima, principalmente renovables sin inercia)
  - Penetración:   ~84.5 %   (solar + eólica sobre demanda total)
  - Frecuencia:    ~49.85 Hz (ya deprimida antes del colapso)
  - RoCoF máximo:  ~2.0 Hz/s (valor pico durante el colapso)
  - Demanda:       ~25 184 MW
  - Precio spot:   ~-2.5 €/MWh (precios negativos por exceso solar)
"""

import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# ─── Valores de referencia del 28-A (colapso, 12:33h) ───────────────────────
REF_28A = {
    "inercia":         1.18,     # s  — inercia equivalente del sistema
    "penetracion":     84.5,     # %  — solar + eólica / demanda
    "frecuencia":      49.85,    # Hz — frecuencia previa al colapso
    "rocof_max":        2.0,     # Hz/s — pico durante el colapso
    "demanda":       25_184,     # MW
    "precio_spot":    -2.5,      # €/MWh
    "precio_desbalance": 450.0,  # €/MWh (estimado durante el caos)
    "flujo_francia":    850,     # MW (importación reducida)
    "flujo_portugal":  -300,     # MW (exportación reducida)
    "fcr_requerida":    200,     # MW (reserva primaria requerida)
    "afrr_disponible":  350,     # MW (reserva secundaria, casi agotada)
}

# ─── Contingencia de referencia (N-1) ────────────────────────────────────────
DELTA_P_CONTINGENCIA_MW = 2_000   # MW — pérdida de referencia para cálculo dinámico
ROCOF_MAX_NORMATIVO_HZS =   1.0   # Hz/s — NC RfG, valor de diseño para umbrales de inercia
F0_HZ = 50.0                       # Hz — frecuencia nominal del sistema


# ─── Dataclass de alerta ─────────────────────────────────────────────────────

@dataclass
class Alerta:
    """Representa una condición de alerta evaluada sobre un snapshot."""
    metrica:    str
    nivel:      str   # "verde", "ambar", "rojo", "critico"
    valor:      float
    umbral:     float
    mensaje:    str
    referencia: str   # Norma o documento de referencia
    valor_28a:  Optional[float] = None
    icono:      str   = "⚪"
    tags:       List[str] = field(default_factory=list)

    def __post_init__(self):
        self.icono = {
            "verde":   "🟢",
            "ambar":   "🟡",
            "rojo":    "🔴",
            "critico": "💀",
        }.get(self.nivel, "⚪")


# ─── Funciones de evaluación individuales ────────────────────────────────────

def _alerta_inercia(inercia: float, demanda_mw: float = 25_000) -> Alerta:
    """
    Evalúa la inercia del sistema.

    Umbral dinámico (Ecuación de oscilación, ENTSO-E):
        H_min = (ΔP · f0) / (2 · RoCoF_max · S_base)
        donde S_base = demanda_mw

    Ref.: ENTSO-E, "Frequency Stability Evaluation Criteria", 2020.
    """
    # Umbral dinámico: inercia mínima para que RoCoF ≤ 1.0 Hz/s con ΔP=2000 MW
    s_base = max(demanda_mw, 20_000)
    h_min_seguro = (DELTA_P_CONTINGENCIA_MW * F0_HZ) / (2 * ROCOF_MAX_NORMATIVO_HZS * s_base)

    if inercia >= 3.0:
        nivel = "verde"
        msg   = f"Inercia robusta ({inercia:.2f} s). Sin riesgo de colapso de frecuencia."
    elif inercia >= h_min_seguro * 1.5:
        nivel = "ambar"
        msg   = f"Inercia moderada ({inercia:.2f} s). Vigilar renovables."
    elif inercia >= h_min_seguro:
        nivel = "rojo"
        msg   = f"⚠️ Inercia baja ({inercia:.2f} s ≈ umbral seguro {h_min_seguro:.2f} s)"
    else:
        nivel = "critico"
        msg   = (f"🚨 INERCIA CRÍTICA ({inercia:.2f} s < {h_min_seguro:.2f} s). "
                 f"Condición similar al 28-A ({REF_28A['inercia']:.2f} s)")

    return Alerta(
        metrica="inercia", nivel=nivel, valor=inercia,
        umbral=h_min_seguro,
        mensaje=msg,
        referencia="ENTSO-E Frequency Stability Evaluation Criteria (2020)",
        valor_28a=REF_28A["inercia"],
        tags=["frecuencia", "estabilidad"],
    )


def _alerta_penetracion(penetracion: float) -> Alerta:
    """
    Evalúa la penetración renovable instantánea.

    Umbrales empíricos calibrados con el 28-A.
    La normativa NC RfG no fija umbrales de penetración directos,
    pero REE los usa internamente para gestión de la red.
    """
    if penetracion < 50:
        nivel, msg = "verde", f"Penetración renovable baja ({penetracion:.1f}%). Sistema estable."
    elif penetracion < 65:
        nivel, msg = "ambar", f"Penetración moderada ({penetracion:.1f}%). Monitorizar inercia."
    elif penetracion < 75:
        nivel, msg = "rojo", f"⚠️ Alta penetración renovable ({penetracion:.1f}%). Inercia reducida."
    else:
        nivel, msg = "critico", (
            f"🚨 Penetración CRÍTICA ({penetracion:.1f}%). "
            f"El 28-A fue de {REF_28A['penetracion']}% en el colapso."
        )

    return Alerta(
        metrica="penetracion", nivel=nivel, valor=penetracion,
        umbral=75.0,
        mensaje=msg,
        referencia="REE, informe post-mortem 28-A (estimación interna)",
        valor_28a=REF_28A["penetracion"],
        tags=["renovables", "estabilidad"],
    )


def _alerta_frecuencia(frecuencia: float) -> Alerta:
    """
    Evalúa la frecuencia de red.

    Umbrales P.O. 1.6 REE "Control de frecuencia e inercia":
      - 49.80 Hz → activación reservas secundarias
      - 49.50 Hz → 1er escalón UFLS (deslastre del 10%)
      - 49.00 Hz → 2º escalón UFLS (deslastre del 15% adicional)
      - 47.50 Hz → desconexión automática generadores
    """
    if frecuencia >= 49.9:
        nivel, msg = "verde", f"Frecuencia nominal ({frecuencia:.3f} Hz). Sistema estable."
    elif frecuencia >= 49.8:
        nivel, msg = "ambar", (
            f"⚠️ Frecuencia por debajo de 49.80 Hz ({frecuencia:.3f} Hz). "
            "Reservas secundarias activas (P.O. 1.6)."
        )
    elif frecuencia >= 49.5:
        nivel, msg = "rojo", (
            f"🔴 Frecuencia < 49.50 Hz ({frecuencia:.3f} Hz). "
            "Umbral 1er escalón UFLS. Deslastre del 10% inminente."
        )
    else:
        nivel, msg = "critico", (
            f"💀 EMERGENCIA: Frecuencia {frecuencia:.3f} Hz. "
            "Deslastre masivo activo. Riesgo de colapso total."
        )

    return Alerta(
        metrica="frecuencia", nivel=nivel, valor=frecuencia,
        umbral=49.8,
        mensaje=msg,
        referencia="P.O. 1.6 REE — Control de frecuencia e inercia",
        valor_28a=REF_28A["frecuencia"],
        tags=["frecuencia", "UFLS"],
    )


def _alerta_rocof(rocof: float) -> Alerta:
    """
    Evalúa el RoCoF (Rate of Change of Frequency).

    Umbrales NC RfG Artículo 14(3) y ENTSO-E Technical Report:
      - > 0.10 Hz/s → vigilancia
      - > 0.50 Hz/s → umbral UFLS (relés de protección)
      - > 1.00 Hz/s → NC RfG valor de diseño máximo
      - > 2.00 Hz/s → valor registrado en el 28-A durante el colapso
    """
    abs_r = abs(rocof)
    if abs_r < 0.10:
        nivel, msg = "verde", f"RoCoF normal ({rocof:+.3f} Hz/s). Frecuencia estable."
    elif abs_r < 0.50:
        nivel, msg = "ambar", f"⚠️ RoCoF elevado ({rocof:+.3f} Hz/s). Vigilar tendencia."
    elif abs_r < 1.00:
        nivel, msg = "rojo", (
            f"🔴 RoCoF > 0.5 Hz/s ({rocof:+.3f} Hz/s). "
            "Relés UFLS pueden activarse (NC RfG)."
        )
    else:
        nivel, msg = "critico", (
            f"💀 CRÍTICO: RoCoF {rocof:+.3f} Hz/s. "
            f"El 28-A registró {REF_28A['rocof_max']:.1f} Hz/s. Colapso inminente."
        )

    return Alerta(
        metrica="rocof", nivel=nivel, valor=rocof,
        umbral=0.5,
        mensaje=msg,
        referencia="NC RfG Art.14(3) + ENTSO-E RoCoF Withstand Capability (2017)",
        valor_28a=REF_28A["rocof_max"],
        tags=["frecuencia", "UFLS", "NC_RfG"],
    )


def _alerta_reservas(fcr_mw: Optional[float], afrr_mw: Optional[float]) -> Optional[Alerta]:
    """Evalúa el estado de las reservas de regulación."""
    if fcr_mw is None and afrr_mw is None:
        return None

    # FCR España: ±200 MW mínimo (P.O. 7.1 REE)
    fcr_min  = 200.0
    afrr_min = 300.0

    problemas = []
    nivel = "verde"

    if fcr_mw is not None and fcr_mw < fcr_min:
        problemas.append(f"FCR insuficiente: {fcr_mw:.0f} MW < {fcr_min:.0f} MW mín.")
        nivel = "rojo"
    if afrr_mw is not None and afrr_mw < afrr_min:
        problemas.append(f"aFRR bajo: {afrr_mw:.0f} MW < {afrr_min:.0f} MW mín.")
        if nivel != "rojo":
            nivel = "ambar"

    if not problemas:
        msg = f"Reservas OK. FCR: {fcr_mw or '–'} MW | aFRR: {afrr_mw or '–'} MW"
    else:
        msg = "⚠️ " + " | ".join(problemas)

    valor = fcr_mw if fcr_mw is not None else 0.0

    return Alerta(
        metrica="reservas", nivel=nivel, valor=valor,
        umbral=fcr_min,
        mensaje=msg,
        referencia="P.O. 7.1 REE — Reserva de potencia activa y control primario",
        valor_28a=REF_28A["fcr_requerida"],
        tags=["reservas", "regulación"],
    )


def _alerta_precio_desbalance(precio: Optional[float]) -> Optional[Alerta]:
    """
    Evalúa el precio de desvíos contrarios.

    Un precio > 200 €/MWh indica graves desequilibrios en el mercado de ajuste.
    El 28-A registró precios de desvíos extraordinariamente altos durante el caos.
    """
    if precio is None:
        return None

    if precio < 50:
        nivel, msg = "verde", f"Precio desvíos normal ({precio:.1f} €/MWh)."
    elif precio < 150:
        nivel, msg = "ambar", f"⚠️ Precio desvíos elevado ({precio:.1f} €/MWh)."
    elif precio < 300:
        nivel, msg = "rojo", f"🔴 Precio desvíos muy alto ({precio:.1f} €/MWh). Desequilibrio en el mercado."
    else:
        nivel, msg = "critico", (
            f"💀 Precio desvíos CRÍTICO ({precio:.1f} €/MWh). "
            f"El 28-A llegó a ~{REF_28A['precio_desbalance']:.0f} €/MWh."
        )

    return Alerta(
        metrica="precio_desbalance", nivel=nivel, valor=precio,
        umbral=200.0,
        mensaje=msg,
        referencia="ESIOS ID 685 — Precio de desvíos contrarios",
        valor_28a=REF_28A["precio_desbalance"],
        tags=["mercado", "desequilibrio"],
    )


# ─── Evaluación global del snapshot ─────────────────────────────────────────

def evaluar_snapshot(snapshot: Dict) -> List[Alerta]:
    """
    Evalúa todas las métricas del snapshot y devuelve lista de alertas.

    Args:
        snapshot: Diccionario con los campos del GridDataExtractor + derivados.

    Returns:
        Lista de objetos Alerta.
    """
    alertas: List[Alerta] = []

    demanda = snapshot.get("demanda") or 25_000

    if snapshot.get("inercia") is not None:
        alertas.append(_alerta_inercia(snapshot["inercia"], demanda))

    if snapshot.get("penetracion") is not None:
        alertas.append(_alerta_penetracion(snapshot["penetracion"]))

    if snapshot.get("frecuencia") is not None:
        alertas.append(_alerta_frecuencia(snapshot["frecuencia"]))

    if snapshot.get("rocof") is not None:
        alertas.append(_alerta_rocof(snapshot["rocof"]))

    alerta_res = _alerta_reservas(
        snapshot.get("fcr_requerida_mw"),
        snapshot.get("afrr_disponible_mw"),
    )
    if alerta_res:
        alertas.append(alerta_res)

    alerta_precio = _alerta_precio_desbalance(snapshot.get("precio_desbalance"))
    if alerta_precio:
        alertas.append(alerta_precio)

    return alertas


def nivel_global(alertas: List[Alerta]) -> Tuple[str, str, str]:
    """
    Calcula el nivel de alerta global del sistema.

    Returns:
        (nivel, icono, descripción)
    """
    if not alertas:
        return ("desconocido", "⚪", "Sin datos suficientes para evaluar")

    prioridad = {"critico": 4, "rojo": 3, "ambar": 2, "verde": 1}
    max_nivel = max(alertas, key=lambda a: prioridad.get(a.nivel, 0))

    mensajes = {
        "critico": ("💀 EMERGENCIA", "Sistema en estado crítico. Riesgo de colapso inmediato."),
        "rojo":    ("🔴 ALERTA",     "Parámetros fuera de rango normativo. Intervención necesaria."),
        "ambar":   ("🟡 VIGILANCIA", "Parámetros en zona de atención. Monitorizar tendencia."),
        "verde":   ("🟢 NORMAL",     "Sistema eléctrico en condiciones normales de operación."),
    }

    icono_desc = mensajes.get(max_nivel.nivel, ("⚪", "Estado indeterminado"))
    return (max_nivel.nivel, icono_desc[0], icono_desc[1])


def comparar_con_28a(snapshot: Dict) -> Dict[str, Dict]:
    """
    Genera tabla de comparación directa con los valores del 28-A.

    Returns:
        Dict con métricas → {valor_hoy, valor_28a, diferencia, es_peor}
    """
    metricas = {
        "inercia":     ("inercia",        "s",       True,  "Cuanto menor, peor"),
        "penetracion": ("penetracion",    "%",       False, "Cuanto mayor, peor"),
        "frecuencia":  ("frecuencia",     "Hz",      True,  "Cuanto menor, peor"),
        "rocof":       ("rocof",          "Hz/s",    False, "Cuanto mayor en valor abs., peor"),
        "demanda":     ("demanda",        "MW",      False, "Referencia contextual"),
        "precio_spot": ("precio_spot",    "€/MWh",   True,  "Precio negativo = exceso oferta"),
    }

    comparativa = {}
    for nombre, (clave, unidad, mayor_es_mejor, nota) in metricas.items():
        val_hoy = snapshot.get(clave)
        val_28a = REF_28A.get(nombre)
        if val_hoy is None or val_28a is None:
            continue

        diff = val_hoy - val_28a
        if mayor_es_mejor:
            es_peor = val_hoy < val_28a
        else:
            es_peor = abs(val_hoy) > abs(val_28a)

        comparativa[nombre] = {
            "valor_hoy":  val_hoy,
            "valor_28a":  val_28a,
            "diferencia": round(diff, 3),
            "unidad":     unidad,
            "es_peor":    es_peor,
            "nota":       nota,
        }

    return comparativa
