#!/usr/bin/env python
"""
indexar_tfg.py — Indexa (o re-indexa) el TFG en la base de conocimiento vectorial.

Ejecutar una sola vez, o cada vez que se modifiquen los documentos MDX/JSON:
    python indexar_tfg.py

Requisitos previos:
    pip install -r requirements.txt
"""

import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

from asistente_local import AsistenteLocal

if __name__ == "__main__":
    print("=" * 60)
    print("  INDEXACIÓN DEL TFG — Base de conocimiento vectorial")
    print("=" * 60)
    print()
    print("  Este proceso:")
    print("  1. Lee todos los archivos .mdx de la carpeta /docs/")
    print("  2. Lee los archivos .json históricos del directorio raíz")
    print("  3. Fragmenta el texto en chunks de ~1200 caracteres")
    print("  4. Genera embeddings con sentence-transformers/all-MiniLM-L6-v2")
    print("  5. Persiste la base en ./chroma_tfg_db/")
    print()
    print("  Tiempo estimado: 2–10 min (primera vez, depende del hardware)")
    print("  RAM necesaria:   ~2–3 GB durante la indexación")
    print()

    confirm = input("¿Proceder con la indexación? (s/N): ").strip().lower()
    if confirm != "s":
        print("Cancelado.")
        sys.exit(0)

    print()
    try:
        AsistenteLocal(force_reindex=True)
        print()
        print("✅ Indexación completada. Ya puedes ejecutar el dashboard con:")
        print("   streamlit run app.py")
    except Exception as e:
        logging.exception("Error durante la indexación")
        print(f"\n❌ Error: {e}")
        sys.exit(1)
