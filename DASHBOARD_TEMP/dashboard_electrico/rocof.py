"""
rocof.py — Rate of Change of Frequency (Hz/s)

Métrica clave durante el incidente del 28-A:
  - Umbral ámbar:  |RoCoF| > 0.10 Hz/s  → vigilancia
  - Umbral naranja:|RoCoF| > 0.30 Hz/s  → elevado
  - Umbral rojo:   |RoCoF| > 0.50 Hz/s  → UFLS puede activarse (Load Shedding)

El 28 de abril de 2025 se registraron valores próximos a 2 Hz/s en el instante
del colapso, muy por encima del umbral de activación de UFLS (0.5 Hz/s).

Referencia: ENTSO-E, "High Penetration of Power Electronic Interfaced Power Sources",
RATE OF CHANGE OF FREQUENCY (ROCOF) WITHSTAND CAPABILITY, 2017.
"""

import logging
from collections import deque
from datetime import datetime
from typing import Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)


class RoCoFCalculator:
    """
    Mantiene un buffer circular de medidas de frecuencia y calcula
    el RoCoF mediante regresión lineal por mínimos cuadrados.

    La regresión es más robusta que la diferencia finita simple:
    filtra ruido de medición y da una estimación de tendencia real.
    """

    def __init__(self, ventana_segundos: int = 30):
        """
        Args:
            ventana_segundos: Ancho de la ventana deslizante en segundos.
                              30 s es el estándar ENTSO-E para RoCoF.
        """
        self.ventana = ventana_segundos
        self.buffer: deque = deque()

    # ------------------------------------------------------------------ #
    #  API pública
    # ------------------------------------------------------------------ #

    def agregar_medida(self, frecuencia_hz: float, timestamp: datetime = None) -> None:
        """
        Añade una medida de frecuencia al buffer con su marca temporal.
        Descarta automáticamente medidas fuera de la ventana.

        Args:
            frecuencia_hz: Frecuencia medida en Hz.
            timestamp:     Momento de la medida (si None, se usa datetime.now()).
        """
        ts = timestamp or datetime.now()

        # Validación básica de rango
        if not (45.0 < frecuencia_hz < 55.0):
            logger.warning("Frecuencia fuera de rango físico posible: %.3f Hz — ignorada", frecuencia_hz)
            return

        self.buffer.append((ts, frecuencia_hz))

        # Purgar medidas antiguas fuera de la ventana
        while self.buffer and (ts - self.buffer[0][0]).total_seconds() > self.ventana:
            self.buffer.popleft()

    def calcular_rocof(self) -> Optional[float]:
        """
        Calcula el RoCoF en Hz/s por regresión lineal sobre el buffer actual.

        Returns:
            Float con el RoCoF en Hz/s (positivo = f subiendo, negativo = f cayendo).
            None si no hay suficientes puntos (mínimo 3) para la regresión.
        """
        if len(self.buffer) < 3:
            return None

        t0 = self.buffer[0][0]
        t_vals = np.array([(ts - t0).total_seconds() for ts, _ in self.buffer])
        f_vals = np.array([f for _, f in self.buffer])

        # Necesitamos al menos dos t distintos para ajustar una recta
        if t_vals[-1] - t_vals[0] < 1.0:
            return None

        coef = np.polyfit(t_vals, f_vals, 1)   # coef[0] = pendiente Hz/s
        return round(float(coef[0]), 4)

    def nivel_alerta(self) -> Tuple[str, str, Optional[float]]:
        """
        Evalúa el RoCoF actual y devuelve nivel semafórico.

        Returns:
            (icono, descripción, valor_rocof)
        """
        rocof = self.calcular_rocof()
        if rocof is None:
            return ("⚪", "Sin datos suficientes", None)

        abs_r = abs(rocof)
        if abs_r < 0.10:
            return ("🟢", f"Normal ({rocof:+.3f} Hz/s)", rocof)
        elif abs_r < 0.30:
            return ("🟡", f"Moderado ({rocof:+.3f} Hz/s)", rocof)
        elif abs_r < 0.50:
            return ("🟠", f"Elevado — vigilancia ({rocof:+.3f} Hz/s)", rocof)
        else:
            return ("🔴", f"CRÍTICO — posible UFLS ({rocof:+.3f} Hz/s)", rocof)

    def ultimas_medidas(self, n: int = 30) -> list:
        """Devuelve las últimas n medidas como lista de dicts {time, freq}."""
        items = list(self.buffer)[-n:]
        return [
            {"time": ts.strftime("%H:%M:%S"), "freq": round(f, 4)}
            for ts, f in items
        ]

    def limpiar(self) -> None:
        """Vacía el buffer (útil para tests o reinicios de sesión)."""
        self.buffer.clear()
