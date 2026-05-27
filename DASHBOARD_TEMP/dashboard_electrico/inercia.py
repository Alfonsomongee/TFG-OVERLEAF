"""
inercia.py — Estimación de la constante de inercia equivalente del sistema (H).

Fórmula:
    H_sys = Σ(P_i · H_i) / S_base   [segundos]

    Donde:
        P_i     = Potencia activa del generador i (MW)
        H_i     = Constante de inercia típica del tipo de generador i (s)
        S_base  = Potencia base del sistema (aproximada por la demanda total)

Constantes H_i (fuentes: Anderson & Fouad; Kundur; REE Procedimientos de Operación):
    Nuclear:        H = 5.0 s   (turbinas de vapor, gran masa rotante)
    Ciclo combinado:H = 4.0 s   (turbina de gas + vapor, combinados)
    Hidráulica:     H = 3.0 s   (turbinas Pelton/Francis/Kaplan, masa menor)

NOTA ACADÉMICA:
    - Solar fotovoltaica y eólica estándar (tipo 3 y 4 DFIG/full-converter)
      contribuyen H ≈ 0 s salvo que implementen inercia sintética (Virtual Synchronous
      Generator). Durante el 28-A, la altísima penetración solar (~70 %) implicó
      H_sys estimado entre 1.0 y 1.5 s, muy por debajo del umbral de seguridad (~3 s).
    - Este módulo proporciona un ESTIMADOR educativo. La inercia real del sistema
      depende de topología de red, reactancias y configuración de turbinas.
"""

import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Constantes de inercia típicas (segundos)
H_NUCLEAR:    float = 5.0
H_CCGT:       float = 4.0
H_HIDRAULICA: float = 3.0

# Rango físicamente razonable para el sistema peninsular español
INERCIA_MIN_RAZONABLE: float = 0.5
INERCIA_MAX_RAZONABLE: float = 9.0

# Valor de referencia del 28-A en el momento del colapso
INERCIA_28A_COLAPSO: float = 1.18


def estimar_inercia_sistema(
    nuclear_mw:     Optional[float],
    ccgt_mw:        Optional[float],
    hidraulica_mw:  Optional[float],
    demanda_total_mw: Optional[float] = None,
) -> float:
    """
    Estima la constante de inercia equivalente del sistema (H) en segundos.

    Args:
        nuclear_mw:       Potencia nuclear conectada (MW). None se trata como 0.
        ccgt_mw:          Potencia de ciclo combinado conectada (MW).
        hidraulica_mw:    Potencia hidráulica conectada (MW).
        demanda_total_mw: Demanda total del sistema (MW).
                          Si se proporciona, la inercia se normaliza por la base
                          del sistema (cálculo académicamente correcto).
                          Si es None, se devuelve la media ponderada de las
                          constantes síncronas (valor relativo, suficiente para
                          comparaciones pero no absoluto).

    Returns:
        Inercia estimada en segundos, redondeada a 2 decimales.
        Devuelve 0.0 si no hay potencia síncrona disponible.
    """
    # Conversión robusta a float
    p_nuc  = _a_float(nuclear_mw)
    p_ccgt = _a_float(ccgt_mw)
    p_hid  = _a_float(hidraulica_mw)

    suma_hxp  = p_nuc * H_NUCLEAR + p_ccgt * H_CCGT + p_hid * H_HIDRAULICA
    suma_p_sinc = p_nuc + p_ccgt + p_hid

    if suma_p_sinc <= 0:
        logger.warning("No hay potencia síncrona disponible — inercia = 0.0 s")
        return 0.0

    # Denominador: demanda total (correcto) o suma síncrona (fallback)
    if demanda_total_mw is not None:
        s_base = _a_float(demanda_total_mw)
        if s_base > 0:
            inercia = suma_hxp / s_base
        else:
            logger.warning("Demanda total inválida, usando suma síncrona como base")
            inercia = suma_hxp / suma_p_sinc
    else:
        # Modo fallback: media ponderada (documentar en memoria del TFG)
        inercia = suma_hxp / suma_p_sinc

    inercia = round(inercia, 2)

    # Validación de rango
    if not (INERCIA_MIN_RAZONABLE <= inercia <= INERCIA_MAX_RAZONABLE):
        logger.warning("Inercia estimada anómala: %.2f s (rango esperado: %.1f–%.1f s)",
                       inercia, INERCIA_MIN_RAZONABLE, INERCIA_MAX_RAZONABLE)

    return inercia


def comparar_con_28a(inercia_actual: float) -> dict:
    """
    Compara la inercia actual con el valor del 28-A en el momento del colapso.

    Returns:
        dict con 'diferencia', 'porcentaje', 'es_inferior_a_28a', 'descripcion'
    """
    diferencia = inercia_actual - INERCIA_28A_COLAPSO
    porcentaje = (diferencia / INERCIA_28A_COLAPSO) * 100

    if diferencia > 0:
        desc = f"Sistema {abs(porcentaje):.0f} % más inercioso que en el 28-A"
    elif diferencia < 0:
        desc = f"⚠️ Sistema {abs(porcentaje):.0f} % MENOS inercioso que en el 28-A"
    else:
        desc = "Inercia idéntica al 28-A en el momento del colapso"

    return {
        "diferencia": round(diferencia, 3),
        "porcentaje": round(porcentaje, 1),
        "es_inferior_a_28a": diferencia < 0,
        "descripcion": desc,
    }


def _a_float(valor) -> float:
    """Convierte un valor a float, devolviendo 0.0 si no es posible."""
    if valor is None:
        return 0.0
    try:
        return max(0.0, float(valor))   # Nunca negativo
    except (ValueError, TypeError):
        return 0.0
