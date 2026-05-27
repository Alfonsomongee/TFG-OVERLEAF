"""
metricas_avanzadas.py — Métricas avanzadas de estabilidad de red

Cálculos derivados que no provienen directamente de APIs sino de
la combinación de datos brutos con modelos físicos.

Incluye:
  - Inercia sintética estimada (inversores emulando inercia)
  - RoCoF ante contingencia N-1 (simulado)
  - Margen de frecuencia disponible
  - Índice de riesgo combinado
  - Estimación de reserva de inercia
"""

import logging
from typing import Dict, Optional, Tuple

logger = logging.getLogger(__name__)

# ─── Constantes ──────────────────────────────────────────────────────────────
F0_HZ   = 50.0     # Frecuencia nominal
FMIN_HZ = 47.5     # Frecuencia mínima de desconexión de generadores

# Constantes de inercia por tecnología (H en segundos)
# Ref.: ENTSO-E, "Need for Synthetic Inertia (SI) in Europe", 2017
H_NUCLEAR   = 5.0   # s  — turbogeneradores de gran tamaño
H_CCGT      = 4.0   # s  — ciclos combinados
H_HIDRO     = 3.5   # s  — grupos hidráulicos (depende del tipo)
H_CARBON    = 4.5   # s  — grupos de carbón (en desuso)
H_COGENER   = 3.0   # s  — cogeneración

# Solar y eólica sin inercia real (conversor de potencia)
# H_SOLAR   = 0.0
# H_EOLICA  = 0.0 (a menos que tenga emulación de inercia sintética)

# Capacidad instalada base (aprox. para normalización)
S_BASE_MW = 100_000  # MVA base del sistema peninsular

# Valores de referencia del 28-A
INERCIA_28A_S         = 1.18   # s
PENETRACION_28A_PCT   = 84.5   # %
DELTA_P_REF_MW        = 2_000  # MW  contingencia de referencia (N-1)
ROCOF_MAX_NORMATIVO   = 1.0    # Hz/s  (NC RfG)


# ─── Inercia del sistema ──────────────────────────────────────────────────────

def estimar_inercia_sistema(
    nuclear_mw:     Optional[float],
    ccgt_mw:        Optional[float],
    hidraulica_mw:  Optional[float],
    demanda_mw:     Optional[float],
    cogeneracion_mw: Optional[float] = None,
    carbon_mw:      Optional[float] = None,
) -> Optional[float]:
    """
    Estima la inercia equivalente del sistema peninsular.

    Método: H_sistema = Σ(H_i · P_i) / Σ(P_i)
    donde la suma es SOLO sobre generadores síncronos.

    Args:
        Potencias en MW de cada tecnología.
        demanda_mw: Demanda total (usado como S_base).

    Returns:
        Inercia en segundos [s], o None si no hay datos suficientes.

    Ref.: ENTSO-E, "Frequency Stability Evaluation Criteria for the
          Synchronous Zone of Continental Europe" (2020).
    """
    INERCIA_MIN = 0.5
    INERCIA_MAX = 8.0

    pares = []
    if nuclear_mw    and nuclear_mw    > 0: pares.append((H_NUCLEAR,  nuclear_mw))
    if ccgt_mw       and ccgt_mw       > 0: pares.append((H_CCGT,     ccgt_mw))
    if hidraulica_mw and hidraulica_mw > 0: pares.append((H_HIDRO,    hidraulica_mw))
    if cogeneracion_mw and cogeneracion_mw > 0: pares.append((H_COGENER, cogeneracion_mw))
    if carbon_mw     and carbon_mw     > 0: pares.append((H_CARBON,   carbon_mw))

    if not pares:
        return None

    suma_hp = sum(h * p for h, p in pares)
    suma_p  = sum(p for _, p in pares)

    if suma_p < 1.0:
        return None

    s_base = demanda_mw if demanda_mw and demanda_mw > 1000 else suma_p
    inercia = suma_hp / s_base

    inercia = round(inercia, 3)
    if not (INERCIA_MIN <= inercia <= INERCIA_MAX):
        logger.warning("Inercia estimada anómala: %.3f s", inercia)

    return inercia


def estimar_inercia_sintetica(snapshot: Dict) -> Optional[float]:
    """
    Estima la inercia sintética aportada por inversores (emulación).

    Cálculo: H_sintetica = H_total - H_sincrona

    Si H_sintetica > 0, indica que los inversores están emulando
    respuesta inercial (Virtual Synchronous Machines u otros esquemas).

    Ref.: ENTSO-E, "Need for Synthetic Inertia in Europe" (2017).
    """
    inercia_total = snapshot.get("inercia")
    if inercia_total is None:
        return None

    nuclear_mw   = snapshot.get("nuclear", 0) or 0
    ccgt_mw      = snapshot.get("ccgt", 0) or 0
    hidraulica_mw = snapshot.get("hidraulica", 0) or 0
    demanda_mw   = snapshot.get("demanda") or 25_000

    inercia_sincrona = estimar_inercia_sistema(
        nuclear_mw, ccgt_mw, hidraulica_mw, demanda_mw
    )
    if inercia_sincrona is None:
        return None

    sintetica = max(0.0, inercia_total - inercia_sincrona)
    return round(sintetica, 3)


# ─── RoCoF y estabilidad de frecuencia ───────────────────────────────────────

def rocof_ante_contingencia(
    inercia_s:  float,
    perdida_mw: float,
    demanda_mw: float = 25_000,
) -> float:
    """
    Calcula el RoCoF esperado ante una contingencia N-1.

    Ecuación de oscilación (swing equation):
        RoCoF = (ΔP · f0) / (2 · H · S_base)

    Args:
        inercia_s:  Inercia del sistema [s]
        perdida_mw: Pérdida de generación [MW]
        demanda_mw: Demanda total [MW] (S_base)

    Returns:
        RoCoF en Hz/s (valor absoluto).

    Ref.: P. Kundur, "Power System Stability and Control", § 12.1.
    """
    if inercia_s <= 0 or demanda_mw <= 0:
        return 999.0  # indefinido

    rocof = (perdida_mw * F0_HZ) / (2.0 * inercia_s * demanda_mw)
    return round(rocof, 4)


def inercia_minima_segura(
    perdida_mw:     float = DELTA_P_REF_MW,
    rocof_max:      float = ROCOF_MAX_NORMATIVO,
    demanda_mw:     float = 25_000,
) -> float:
    """
    Calcula la inercia mínima para que RoCoF ≤ rocof_max ante contingencia.

    H_min = (ΔP · f0) / (2 · RoCoF_max · S_base)

    Ref.: NC RfG Artículo 14(3) y ENTSO-E Technical Report.
    """
    return round((perdida_mw * F0_HZ) / (2.0 * rocof_max * demanda_mw), 3)


def margen_frecuencia_disponible(frecuencia_actual: float) -> Dict[str, float]:
    """
    Calcula los márgenes de frecuencia hasta cada umbral normativo.

    Returns:
        Dict con márgenes en Hz hasta cada umbral.
    """
    return {
        "hasta_49.8_ambar":  round(frecuencia_actual - 49.8, 3),
        "hasta_49.5_ufls1":  round(frecuencia_actual - 49.5, 3),
        "hasta_49.0_ufls2":  round(frecuencia_actual - 49.0, 3),
        "hasta_47.5_fmin":   round(frecuencia_actual - FMIN_HZ, 3),
    }


def tiempo_hasta_nadir(
    frecuencia_actual: float,
    rocof_hzs:         float,
    frecuencia_nadir:  float = 49.5,
) -> Optional[float]:
    """
    Estima el tiempo hasta alcanzar la frecuencia de nadir (umbral UFLS).

    Usando tasa de caída constante (linealización).

    Args:
        frecuencia_actual: Hz
        rocof_hzs:         Hz/s (usar valor absoluto)
        frecuencia_nadir:  Hz (umbral target)

    Returns:
        Tiempo en segundos, o None si frecuencia ya debajo del nadir.
    """
    if frecuencia_actual <= frecuencia_nadir:
        return None
    if abs(rocof_hzs) < 1e-6:
        return float("inf")

    return round((frecuencia_actual - frecuencia_nadir) / abs(rocof_hzs), 1)


# ─── Índice de riesgo combinado ──────────────────────────────────────────────

def indice_riesgo_sistema(snapshot: Dict) -> Tuple[float, str, str]:
    """
    Calcula un índice de riesgo compuesto (0-100) para el sistema.

    Combina ponderadamente:
      - Inercia (40%): normalizada contra valor 28-A
      - Penetración renovable (25%)
      - Frecuencia (20%)
      - RoCoF (15%)

    Returns:
        (indice_0_100, nivel_texto, descripcion)
    """
    score = 0.0
    n_metricas = 0

    # Inercia (40%) — 0 = máximo riesgo, 100 = mínimo riesgo
    inercia = snapshot.get("inercia")
    if inercia is not None:
        inercia_max_normal = 4.0   # s — valor típico en sistema convencional
        inercia_min_critico = INERCIA_28A_S
        inercia_norm = min(1.0, max(0.0, (inercia - inercia_min_critico) /
                                         (inercia_max_normal - inercia_min_critico)))
        score += (1.0 - inercia_norm) * 40  # mayor inercia → menor riesgo
        n_metricas += 1

    # Penetración (25%)
    penet = snapshot.get("penetracion")
    if penet is not None:
        penet_norm = min(1.0, max(0.0, penet / 100.0))
        score += penet_norm * 25
        n_metricas += 1

    # Frecuencia (20%) — más lejos de 50 Hz → mayor riesgo
    freq = snapshot.get("frecuencia")
    if freq is not None:
        desviacion = abs(freq - 50.0)
        freq_norm = min(1.0, desviacion / 0.5)  # 0.5 Hz → 100% riesgo
        score += freq_norm * 20
        n_metricas += 1

    # RoCoF (15%)
    rocof = snapshot.get("rocof")
    if rocof is not None:
        rocof_norm = min(1.0, abs(rocof) / ROCOF_MAX_NORMATIVO)
        score += rocof_norm * 15
        n_metricas += 1

    if n_metricas == 0:
        return (0.0, "Desconocido", "Sin datos")

    # Normalizar si no tenemos todas las métricas
    if n_metricas < 4:
        pesos_total = {"inercia": 40, "penetracion": 25, "frecuencia": 20, "rocof": 15}
        peso_efectivo = sum(v for k, v in pesos_total.items()
                            if snapshot.get(k) is not None)
        if peso_efectivo > 0:
            score = score * 100 / peso_efectivo

    score = round(min(100.0, max(0.0, score)), 1)

    if score < 20:
        nivel, desc = "Normal", "Sistema en condiciones seguras de operación."
    elif score < 40:
        nivel, desc = "Vigilancia", "Parámetros en zona de atención. Monitorizar."
    elif score < 65:
        nivel, desc = "Alerta", "Condiciones desfavorables. Riesgo moderado de incidentes."
    elif score < 85:
        nivel, desc = "Crítico", "Parámetros similares a los previos al 28-A."
    else:
        nivel, desc = "COLAPSO INMINENTE", "Sistema en peligro extremo. Intervención urgente."

    return (score, nivel, desc)


# ─── Penetración renovable ───────────────────────────────────────────────────

def calcular_penetracion(
    solar_mw:   Optional[float],
    eolica_mw:  Optional[float],
    demanda_mw: Optional[float],
) -> Optional[float]:
    """Calcula la penetración instantánea de renovables (%)."""
    if solar_mw is None or eolica_mw is None or not demanda_mw:
        return None
    return round(((solar_mw + eolica_mw) / demanda_mw) * 100, 1)
