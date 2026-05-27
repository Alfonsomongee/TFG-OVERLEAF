"""
inercia.py — Módulo de inercia del sistema eléctrico peninsular

Wrapper de compatibilidad con versiones anteriores.
La lógica real está en metricas_avanzadas.py.
"""

from metricas_avanzadas import (
    estimar_inercia_sistema,
    INERCIA_28A_S as INERCIA_28A_COLAPSO,
)

__all__ = ["estimar_inercia_sistema", "comparar_con_28a"]


def comparar_con_28a(inercia_actual: float) -> dict:
    """
    Compara la inercia actual con el valor del 28-A en el momento del colapso.

    Returns:
        dict con 'diferencia', 'porcentaje', 'es_inferior_a_28a', 'descripcion'
    """
    diferencia = inercia_actual - INERCIA_28A_COLAPSO
    porcentaje = (diferencia / INERCIA_28A_COLAPSO) * 100

    if diferencia > 0:
        desc = f"Sistema {abs(porcentaje):.0f}% más inercioso que en el 28-A"
    elif diferencia < 0:
        desc = f"⚠️ Sistema {abs(porcentaje):.0f}% MENOS inercioso que en el 28-A"
    else:
        desc = "Inercia idéntica al 28-A en el momento del colapso"

    return {
        "diferencia": round(diferencia, 3),
        "porcentaje": round(porcentaje, 1),
        "es_inferior_a_28a": diferencia < 0,
        "descripcion": desc,
    }
