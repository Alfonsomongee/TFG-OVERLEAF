"""
rocof.py — Rate of Change of Frequency (Hz/s)

Umbral normativo (NC RfG Artículo 14(3)):
  - |RoCoF| > 0.10 Hz/s → vigilancia
  - |RoCoF| > 0.50 Hz/s → UFLS puede activarse
  - |RoCoF| > 1.00 Hz/s → valor de diseño máximo NC RfG
  - |RoCoF| > 2.00 Hz/s → valor pico 28-A durante el colapso

Cálculo por regresión lineal (más robusto que diferencia finita):
  - Filtra ruido de medición
  - Ventana deslizante de 30 s (estándar ENTSO-E)
"""

import logging
from collections import deque
from datetime import datetime
from typing import Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)


class RoCoFCalculator:
    """
    Buffer circular de medidas de frecuencia con cálculo de RoCoF
    por regresión lineal por mínimos cuadrados.
    """

    def __init__(self, ventana_segundos: int = 30):
        self.ventana = ventana_segundos
        self.buffer: deque = deque()

    def agregar_medida(self, frecuencia_hz: float, timestamp: datetime = None) -> None:
        ts = timestamp or datetime.now()
        if not (45.0 < frecuencia_hz < 55.0):
            logger.warning("Frecuencia fuera de rango: %.3f Hz — ignorada", frecuencia_hz)
            return
        self.buffer.append((ts, frecuencia_hz))
        while self.buffer and (ts - self.buffer[0][0]).total_seconds() > self.ventana:
            self.buffer.popleft()

    def calcular_rocof(self) -> Optional[float]:
        if len(self.buffer) < 3:
            return None
        t0     = self.buffer[0][0]
        t_vals = np.array([(ts - t0).total_seconds() for ts, _ in self.buffer])
        f_vals = np.array([f for _, f in self.buffer])
        if t_vals[-1] - t_vals[0] < 1.0:
            return None
        coef = np.polyfit(t_vals, f_vals, 1)
        return round(float(coef[0]), 4)

    def nivel_alerta(self) -> Tuple[str, str, Optional[float]]:
        rocof = self.calcular_rocof()
        if rocof is None:
            return ("⚪", "Sin datos suficientes", None)
        abs_r = abs(rocof)
        if abs_r < 0.10:
            return ("🟢", f"Normal ({rocof:+.3f} Hz/s)", rocof)
        elif abs_r < 0.50:
            return ("🟡", f"Elevado ({rocof:+.3f} Hz/s)", rocof)
        elif abs_r < 1.00:
            return ("🟠", f"Umbral UFLS ({rocof:+.3f} Hz/s)", rocof)
        else:
            return ("🔴", f"CRÍTICO ({rocof:+.3f} Hz/s)", rocof)

    def ultimas_medidas(self, n: int = 30) -> list:
        items = list(self.buffer)[-n:]
        return [{"time": ts.strftime("%H:%M:%S"), "freq": round(f, 4)} for ts, f in items]

    def limpiar(self) -> None:
        self.buffer.clear()
