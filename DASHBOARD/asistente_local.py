"""
asistente_local.py — Asistente IA con RAG (Ollama + ChromaDB)

Optimizado para hardware con CPU limitada:
  - Timeouts largos (180 s) para evitar cortes en generación
  - Prompts concisos para reducir tokens de entrada/salida
  - num_predict limitado (150 tokens) para respuestas rápidas
  - temperature=0.1 para máximo determinismo (más rápido)
  - Modelo recomendado: phi3:mini (3.8B parámetros, < 4 GB RAM)
  - Streaming habilitado para mostrar progreso al usuario

Requisitos:
  - Ollama instalado y corriendo: https://ollama.ai
  - Modelo descargado: ollama pull phi3:mini
  - ChromaDB con docs indexados (ejecutar indexar_tfg.py antes)
"""

import logging
import os
import time
from typing import Generator, List, Optional

logger = logging.getLogger(__name__)

# ─── Configuración Ollama ─────────────────────────────────────────────────────
OLLAMA_BASE_URL     = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL        = os.getenv("MODELO_IA", "phi3:mini")
OLLAMA_TIMEOUT_S    = 180      # segundos — largo para CPU lenta
OLLAMA_NUM_PREDICT  = 180      # tokens máximos de salida
OLLAMA_TEMPERATURE  = 0.1      # determinismo para velocidad

# ─── Configuración ChromaDB ───────────────────────────────────────────────────
CHROMA_PATH         = os.getenv("CHROMA_PATH", "chroma_tfg_db")
CHROMA_COLLECTION   = "tfg_docs"
N_RESULTADOS_RAG    = 3        # fragmentos recuperados por query
EMBED_MODEL         = "sentence-transformers/all-MiniLM-L6-v2"

# ─── Prompt del sistema (CONCISO para CPU lenta) ──────────────────────────────
SYSTEM_PROMPT = """Eres un asistente experto en el sistema eléctrico peninsular español.
Tu especialidad: el apagón del 28 de abril de 2025 y la estabilidad de frecuencia de redes.

REGLAS:
- Responde en español, en máximo 3 párrafos cortos.
- Sé directo y técnico. Sin rodeos.
- Si se te dan datos del sistema actual, úsalos para contextualizar.
- Si no sabes algo, dilo claramente.
- Usa terminología eléctrica precisa: inercia, RoCoF, UFLS, FCR, aFRR, etc."""


class AsistenteLocal:
    """
    Asistente RAG que combina ChromaDB (documentos del TFG) con Ollama (LLM local).

    Uso básico:
        asistente = AsistenteLocal()
        if asistente.disponible():
            respuesta = asistente.preguntar("¿Qué causó el apagón del 28-A?")
    """

    def __init__(self):
        self._chroma_client = None
        self._collection    = None
        self._embedder      = None
        self._ollama_ok     = False
        self._chroma_ok     = False
        self._historial: List[dict] = []

        self._init_ollama()
        self._init_chroma()

    # ─────────────────────────────────────────────────────────────────────────
    #  Inicialización
    # ─────────────────────────────────────────────────────────────────────────

    def _init_ollama(self):
        """Verifica que Ollama está corriendo y el modelo disponible."""
        try:
            import requests
            r = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
            if r.status_code == 200:
                modelos = [m["name"] for m in r.json().get("models", [])]
                # phi3:mini puede aparecer como "phi3:mini" o "phi3"
                disponible = any(
                    OLLAMA_MODEL.split(":")[0] in m for m in modelos
                )
                if disponible:
                    self._ollama_ok = True
                    logger.info("Ollama ✓ — modelo %s disponible", OLLAMA_MODEL)
                else:
                    logger.warning(
                        "Modelo %s no encontrado. Modelos disponibles: %s",
                        OLLAMA_MODEL, modelos
                    )
        except Exception as e:
            logger.warning("Ollama no disponible: %s", e)

    def _init_chroma(self):
        """Intenta conectar con ChromaDB y cargar la colección de documentos."""
        try:
            import chromadb
            from chromadb.config import Settings

            client = chromadb.PersistentClient(
                path=CHROMA_PATH,
                settings=Settings(anonymized_telemetry=False),
            )
            colecciones = [c.name for c in client.list_collections()]

            if CHROMA_COLLECTION not in colecciones:
                logger.warning(
                    "Colección '%s' no encontrada en ChromaDB. "
                    "Ejecuta indexar_tfg.py primero.",
                    CHROMA_COLLECTION,
                )
                return

            self._chroma_client = client
            self._collection = client.get_collection(CHROMA_COLLECTION)
            self._chroma_ok  = True
            n_docs = self._collection.count()
            logger.info("ChromaDB ✓ — %d fragmentos indexados", n_docs)

            # Embedder (se carga en diferido para no bloquear el inicio)
            self._embedder = None

        except Exception as e:
            logger.warning("ChromaDB no disponible: %s", e)

    def _get_embedder(self):
        """Carga el modelo de embeddings de forma diferida (lazy loading)."""
        if self._embedder is not None:
            return self._embedder
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Cargando modelo de embeddings %s…", EMBED_MODEL)
            self._embedder = SentenceTransformer(EMBED_MODEL)
            logger.info("Embedder listo")
        except Exception as e:
            logger.error("Error cargando embedder: %s", e)
        return self._embedder

    # ─────────────────────────────────────────────────────────────────────────
    #  API pública
    # ─────────────────────────────────────────────────────────────────────────

    def disponible(self) -> bool:
        """True si Ollama está disponible (ChromaDB es opcional)."""
        return self._ollama_ok

    def estado(self) -> dict:
        """Devuelve el estado de los componentes."""
        n_docs = 0
        if self._chroma_ok and self._collection:
            try:
                n_docs = self._collection.count()
            except Exception:
                pass
        return {
            "ollama_ok":   self._ollama_ok,
            "chroma_ok":   self._chroma_ok,
            "modelo":      OLLAMA_MODEL,
            "n_fragmentos": n_docs,
        }

    def recuperar_contexto(self, pregunta: str) -> str:
        """
        Recupera los fragmentos más relevantes de ChromaDB para la pregunta.

        Returns:
            String con el contexto formateado, o cadena vacía si no hay RAG.
        """
        if not self._chroma_ok or not self._collection:
            return ""

        embedder = self._get_embedder()
        if embedder is None:
            return ""

        try:
            query_emb = embedder.encode([pregunta]).tolist()
            results = self._collection.query(
                query_embeddings=query_emb,
                n_results=N_RESULTADOS_RAG,
                include=["documents", "metadatas"],
            )
            docs = results.get("documents", [[]])[0]
            if not docs:
                return ""

            contexto_partes = []
            for i, doc in enumerate(docs, 1):
                contexto_partes.append(f"[Doc {i}]: {doc[:400]}")

            return "\n".join(contexto_partes)

        except Exception as e:
            logger.warning("Error en recuperación RAG: %s", e)
            return ""

    def preguntar(
        self,
        pregunta: str,
        snapshot: Optional[dict] = None,
        stream: bool = True,
    ) -> Generator[str, None, None]:
        """
        Envía una pregunta al LLM y devuelve un generador de texto (streaming).

        Args:
            pregunta: Pregunta del usuario.
            snapshot: Snapshot actual del sistema (para contexto en tiempo real).
            stream:   Si True, hace streaming del output.

        Yields:
            Fragmentos de texto a medida que el modelo responde.
        """
        if not self._ollama_ok:
            yield "⚠️ Ollama no disponible. Asegúrate de que está corriendo con `ollama serve`."
            return

        # Construir contexto
        contexto_rag  = self.recuperar_contexto(pregunta)
        contexto_snap = self._formatear_snapshot(snapshot)

        # Construir prompt (CONCISO para CPU lenta)
        prompt_parts = []
        if contexto_snap:
            prompt_parts.append(f"ESTADO ACTUAL DEL SISTEMA:\n{contexto_snap}")
        if contexto_rag:
            prompt_parts.append(f"DOCUMENTOS RELEVANTES:\n{contexto_rag}")
        prompt_parts.append(f"PREGUNTA: {pregunta}")

        prompt_usuario = "\n\n".join(prompt_parts)

        # Historial (últimos 2 turnos para no saturar el contexto)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for turno in self._historial[-4:]:  # últimos 2 pares pregunta/respuesta
            messages.append(turno)
        messages.append({"role": "user", "content": prompt_usuario})

        # Llamada a Ollama
        import requests
        import json

        payload = {
            "model":   OLLAMA_MODEL,
            "messages": messages,
            "stream":   stream,
            "options": {
                "temperature":   OLLAMA_TEMPERATURE,
                "num_predict":   OLLAMA_NUM_PREDICT,
                "num_ctx":       2048,     # ventana de contexto
                "top_p":         0.9,
                "repeat_penalty": 1.1,
            },
        }

        respuesta_completa = ""
        t0 = time.time()

        try:
            r = requests.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload,
                timeout=OLLAMA_TIMEOUT_S,
                stream=stream,
            )
            r.raise_for_status()

            if stream:
                for line in r.iter_lines():
                    if not line:
                        continue
                    try:
                        chunk = json.loads(line)
                        texto = chunk.get("message", {}).get("content", "")
                        if texto:
                            respuesta_completa += texto
                            yield texto
                        if chunk.get("done"):
                            break
                    except json.JSONDecodeError:
                        continue
            else:
                data = r.json()
                respuesta_completa = data.get("message", {}).get("content", "")
                yield respuesta_completa

        except requests.exceptions.Timeout:
            msg = (
                f"\n\n⏱️ Timeout tras {OLLAMA_TIMEOUT_S}s. "
                "El modelo va lento. Prueba con una pregunta más corta."
            )
            yield msg
            respuesta_completa += msg

        except requests.exceptions.ConnectionError:
            yield "❌ No se puede conectar con Ollama. Ejecuta `ollama serve` en una terminal."
            return

        except Exception as e:
            logger.exception("Error en Ollama")
            yield f"❌ Error inesperado: {e}"
            return

        t_elapsed = round(time.time() - t0, 1)
        logger.info("Respuesta generada en %.1f s | tokens aprox: %d",
                    t_elapsed, len(respuesta_completa.split()))

        # Guardar en historial
        if respuesta_completa:
            self._historial.append({"role": "user",      "content": pregunta})
            self._historial.append({"role": "assistant", "content": respuesta_completa})
            # Limitar historial a 10 turnos
            if len(self._historial) > 20:
                self._historial = self._historial[-20:]

    def limpiar_historial(self):
        """Limpia el historial de conversación."""
        self._historial.clear()

    # ─────────────────────────────────────────────────────────────────────────
    #  Helpers privados
    # ─────────────────────────────────────────────────────────────────────────

    @staticmethod
    def _formatear_snapshot(snapshot: Optional[dict]) -> str:
        """Formatea el snapshot del sistema en texto compacto para el LLM."""
        if not snapshot:
            return ""
        campos = [
            ("Demanda",       "demanda",      "MW"),
            ("Solar",         "solar",        "MW"),
            ("Eólica",        "eolica",       "MW"),
            ("Nuclear",       "nuclear",      "MW"),
            ("CCGT",          "ccgt",         "MW"),
            ("Hidráulica",    "hidraulica",   "MW"),
            ("Frecuencia",    "frecuencia",   "Hz"),
            ("RoCoF",         "rocof",        "Hz/s"),
            ("Inercia",       "inercia",      "s"),
            ("Penetración",   "penetracion",  "%"),
            ("Precio spot",   "precio_spot",  "€/MWh"),
            ("Flujo Francia", "flujo_francia","MW"),
        ]
        lineas = []
        for nombre, clave, unidad in campos:
            val = snapshot.get(clave)
            if val is not None:
                lineas.append(f"  {nombre}: {val:.2f} {unidad}")
        return "\n".join(lineas) if lineas else ""
