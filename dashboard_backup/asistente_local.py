"""
asistente_local.py — Asistente IA local con RAG (Recuperación Aumentada).

Arquitectura:
    1. Indexación: los archivos MDX del TFG y los JSON históricos se fragmentan
       y almacenan en ChromaDB con embeddings de sentence-transformers.
    2. Recuperación: ante cada pregunta, se recuperan los fragmentos más relevantes
       por similitud semántica (coseno).
    3. Generación: el prompt (fragmentos + datos actuales + pregunta) se envía a
       Ollama (modelo local phi3:mini o llama3.1:8b).

El asistente responde EXCLUSIVAMENTE sobre el sistema eléctrico y el TFG.
Si la pregunta es ajena a este ámbito, lo indica explícitamente.
"""

import glob
import json
import logging
import os
from typing import Any, Dict, List, Optional

import requests

# ── LangChain (imports actualizados para v0.2+) ──────────────────────────────
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)

# ------------------------------------------------------------------ #
#  Constantes de configuración
# ------------------------------------------------------------------ #
RUTA_DOCS        = "./docs"            # Carpeta con los MDX del TFG
RUTA_JSON        = "./"               # Carpeta con JSON históricos (raíz)
CHROMA_PERSIST   = "./chroma_tfg_db"  # Directorio de persistencia de ChromaDB
MODELO_OLLAMA    = os.getenv("MODELO_IA", "phi3:mini")
OLLAMA_URL       = "http://localhost:11434/api/generate"
CHUNK_SIZE       = 1_200              # Tamaño de fragmento (caracteres)
CHUNK_OVERLAP    = 200                # Solapamiento entre fragmentos
CONTEXT_MAX_CHARS = 4_000            # Límite de contexto inyectado en el prompt


class AsistenteLocal:
    """
    Asistente que combina:
    - Conocimiento del TFG (indexado en ChromaDB)
    - Datos en tiempo real del dashboard
    - Modelo LLM local vía Ollama
    """

    def __init__(self, force_reindex: bool = False):
        self.embeddings: Optional[HuggingFaceEmbeddings] = None
        self.vectorstore: Optional[Chroma] = None
        self._inicializar_vectorstore(force_reindex)

    # ------------------------------------------------------------------ #
    #  Inicialización del vectorstore
    # ------------------------------------------------------------------ #

    def _inicializar_vectorstore(self, force_reindex: bool) -> None:
        """Carga la base de conocimiento existente o la crea si no existe."""
        base_existe = (
            os.path.exists(CHROMA_PERSIST) and
            bool(os.listdir(CHROMA_PERSIST))
        )

        if base_existe and not force_reindex:
            logger.info("Cargando base de conocimiento existente desde %s", CHROMA_PERSIST)
            self.embeddings = self._crear_embeddings()
            self.vectorstore = Chroma(
                persist_directory  = CHROMA_PERSIST,
                embedding_function = self.embeddings,
            )
        else:
            logger.info("Indexando TFG desde cero (force_reindex=%s)...", force_reindex)
            self._indexar_tfg()

    def _crear_embeddings(self) -> HuggingFaceEmbeddings:
        return HuggingFaceEmbeddings(
            model_name     = "sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs   = {"device": "cpu"},
            encode_kwargs  = {"normalize_embeddings": True},
        )

    def _indexar_tfg(self) -> None:
        """Indexa todos los MDX del TFG y los JSON históricos en ChromaDB."""
        documentos: List[Document] = []

        # 1. Archivos MDX
        if os.path.isdir(RUTA_DOCS):
            loader = DirectoryLoader(
                RUTA_DOCS,
                glob       = "**/*.mdx",
                loader_cls = TextLoader,
                loader_kwargs = {"encoding": "utf-8"},
            )
            docs_mdx = loader.load()
            documentos.extend(docs_mdx)
            logger.info("  MDX cargados: %d", len(docs_mdx))
        else:
            logger.warning("Carpeta de docs no encontrada: %s", RUTA_DOCS)

        # 2. JSON históricos (excluyendo caché del extractor)
        for json_path in glob.glob(os.path.join(RUTA_JSON, "*.json")):
            if "cache_datos.json" in json_path:
                continue
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                texto = json.dumps(data, indent=2, ensure_ascii=False)
                documentos.append(Document(
                    page_content=texto,
                    metadata={"source": json_path},
                ))
            except Exception as e:
                logger.warning("Error al cargar %s: %s", json_path, e)
        logger.info("  Total documentos antes de fragmentar: %d", len(documentos))

        # 3. Fragmentación
        splitter = RecursiveCharacterTextSplitter(
            chunk_size    = CHUNK_SIZE,
            chunk_overlap = CHUNK_OVERLAP,
        )
        fragmentos = splitter.split_documents(documentos)
        logger.info("  Fragmentos generados: %d", len(fragmentos))

        # 4. Embeddings y vectorstore
        self.embeddings  = self._crear_embeddings()
        self.vectorstore = Chroma.from_documents(
            documents        = fragmentos,
            embedding        = self.embeddings,
            persist_directory = CHROMA_PERSIST,
        )
        self.vectorstore.persist()
        logger.info("Indexación completada. Base en: %s", CHROMA_PERSIST)

    # ------------------------------------------------------------------ #
    #  RAG: recuperación de contexto
    # ------------------------------------------------------------------ #

    def _recuperar_contexto(self, pregunta: str, k: int = 5) -> str:
        """
        Recupera los k fragmentos más similares a la pregunta.
        Limita el contexto a CONTEXT_MAX_CHARS para no saturar el prompt.
        """
        if not self.vectorstore:
            return ""
        try:
            docs = self.vectorstore.similarity_search(pregunta, k=k)
        except Exception as e:
            logger.error("Error en similarity_search: %s", e)
            return ""

        if not docs:
            return ""

        contexto = "\n\n---\n\n".join(d.page_content for d in docs)
        if len(contexto) > CONTEXT_MAX_CHARS:
            contexto = contexto[:CONTEXT_MAX_CHARS] + "\n[...contexto truncado...]"
        return contexto

    # ------------------------------------------------------------------ #
    #  Construcción del prompt
    # ------------------------------------------------------------------ #

    def _construir_prompt(
        self,
        pregunta: str,
        datos: Dict[str, Any],
        historial: List[Dict[str, str]] = None,
    ) -> str:
        """
        Ensambla el prompt completo con:
          - Rol del sistema
          - Datos en tiempo real del dashboard
          - Contexto recuperado del TFG
          - Historial reciente de la conversación (últimos 3 turnos)
          - Pregunta del usuario
        """
        contexto_tfg = self._recuperar_contexto(pregunta)

        def fmt(val, decimales=2, sufijo=""):
            if val is None:
                return "N/D"
            return f"{float(val):.{decimales}f}{sufijo}"

        bloque_datos = f"""
- Inercia estimada:              {fmt(datos.get('inercia'))} s
- Penetración renovable (sol+eol):{fmt(datos.get('penetracion'), 1)} %
- Demanda actual:                {fmt(datos.get('demanda'), 0)} MW
- Precio SPOT:                   {fmt(datos.get('precio_spot'))} €/MWh
- Generación solar:              {fmt(datos.get('solar'), 0)} MW
- Generación eólica:             {fmt(datos.get('eolica'), 0)} MW
- Generación nuclear:            {fmt(datos.get('nuclear'), 0)} MW
- Ciclo combinado:               {fmt(datos.get('ccgt'), 0)} MW
- Flujo neto Francia:            {fmt(datos.get('flujo_francia'), 0)} MW  (+= importación)
- Flujo neto Portugal:           {fmt(datos.get('flujo_portugal'), 0)} MW
- Frecuencia del sistema:        {fmt(datos.get('frecuencia'), 3)} Hz
- RoCoF actual:                  {fmt(datos.get('rocof'), 4)} Hz/s
"""

        bloque_historial = ""
        if historial:
            ultimos = historial[-6:]   # últimos 3 turnos (user + assistant × 3)
            bloque_historial = "\n=== CONVERSACIÓN PREVIA ===\n"
            for turno in ultimos:
                rol = "Usuario" if turno["role"] == "user" else "Asistente"
                bloque_historial += f"{rol}: {turno['content']}\n"

        prompt = f"""Eres un asistente experto en ingeniería eléctrica y sistemas de potencia. \
Tu conocimiento se basa exclusivamente en el Trabajo de Fin de Grado sobre el apagón del \
28 de abril de 2025 en la Península Ibérica y en los datos del sistema eléctrico en tiempo real.

=== DATOS DEL SISTEMA EN TIEMPO REAL ===
{bloque_datos}
=== CONTEXTO DEL TFG (fragmentos relevantes) ===
{contexto_tfg if contexto_tfg else "(sin fragmentos recuperados para esta pregunta)"}
{bloque_historial}
=== INSTRUCCIONES ===
1. Responde SIEMPRE comparando la situación actual con el 28-A cuando sea pertinente.
2. Si la pregunta no está relacionada con el sistema eléctrico o el TFG, responde:
   "Lo siento, solo puedo responder preguntas sobre el sistema eléctrico y el apagón del 28-A."
3. Si no encuentras la información en el contexto, admítelo honestamente.
4. Sé conciso (máximo 3 párrafos) pero técnicamente preciso.
5. Usa lenguaje técnico pero accesible; evita jerga innecesaria.
6. Responde siempre en español.

=== PREGUNTA ===
{pregunta.strip()}

=== RESPUESTA ===
"""
        return prompt

    # ------------------------------------------------------------------ #
    #  Llamada al modelo local (Ollama)
    # ------------------------------------------------------------------ #

    def _llamar_ollama(self, prompt: str) -> str:
        """Envía el prompt a Ollama y retorna la respuesta en texto."""
        payload = {
            "model":  MODELO_OLLAMA,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "top_p":       0.9,
                "num_predict": 350,
            },
        }
        try:
            resp = requests.post(OLLAMA_URL, json=payload, timeout=300)
            if resp.status_code == 200:
                return resp.json().get("response", "Respuesta vacía del modelo.").strip()
            return (
                f"Error en Ollama (HTTP {resp.status_code}). "
                "Verifica que el servidor esté activo con `ollama serve`."
            )
        except requests.exceptions.ConnectionError:
            return (
                "No se pudo conectar con Ollama. "
                "Ejecuta `ollama serve` en otra terminal y descarga el modelo con "
                f"`ollama pull {MODELO_OLLAMA}`."
            )
        except Exception as e:
            logger.exception("Error inesperado llamando a Ollama")
            return f"Error inesperado: {e}"

    # ------------------------------------------------------------------ #
    #  API pública
    # ------------------------------------------------------------------ #

    def preguntar(
        self,
        pregunta: str,
        datos_dashboard: Dict[str, Any],
        historial: List[Dict[str, str]] = None,
    ) -> str:
        """
        Responde a una pregunta usando RAG + modelo local.

        Args:
            pregunta:         Texto de la pregunta del usuario.
            datos_dashboard:  Métricas actuales del sistema eléctrico.
            historial:        Lista de {'role': 'user'|'assistant', 'content': str}
                              para mantener contexto conversacional.

        Returns:
            Respuesta del asistente como string.
        """
        if not pregunta or not pregunta.strip():
            return "Por favor, escribe una pregunta."

        prompt    = self._construir_prompt(pregunta, datos_dashboard, historial or [])
        respuesta = self._llamar_ollama(prompt)
        return respuesta


# ------------------------------------------------------------------ #
#  Prueba en modo standalone
# ------------------------------------------------------------------ #
if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    print("Inicializando asistente (puede tardar la primera vez)...")
    asistente = AsistenteLocal()
    print("Asistente listo. Escribe 'salir' para terminar.\n")

    datos_prueba = {
        "inercia": 2.8, "penetracion": 65.0, "demanda": 28_500,
        "precio_spot": 45.5, "solar": 12_000, "eolica": 8_000,
        "nuclear": 3_400, "ccgt": 5_000,
        "flujo_francia": 1_500, "flujo_portugal": -500,
        "frecuencia": 50.02, "rocof": 0.02,
    }
    historial_prueba: List[Dict] = []

    while True:
        q = input("👉 Pregunta: ").strip()
        if q.lower() in ("salir", "exit", "quit"):
            break
        respuesta = asistente.preguntar(q, datos_prueba, historial_prueba)
        print(f"\n🤖 {respuesta}\n")
        historial_prueba.append({"role": "user",      "content": q})
        historial_prueba.append({"role": "assistant",  "content": respuesta})
