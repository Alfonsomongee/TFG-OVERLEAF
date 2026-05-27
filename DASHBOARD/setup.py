#!/usr/bin/env python
"""
setup.py — Configuración automática del dashboard.

Ejecutar una sola vez:
    python setup.py

Automatiza:
  1. Verificación de archivos requeridos
  2. Creación interactiva del .env
  3. Instalación de dependencias
  4. Indexación del TFG
"""

import os
import sys
import subprocess
import json
from pathlib import Path

CYAN    = "\033[96m"
GREEN   = "\033[92m"
YELLOW  = "\033[93m"
RED     = "\033[91m"
RESET   = "\033[0m"
BOLD    = "\033[1m"


def print_header(text: str):
    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}{CYAN}{text:^60}{RESET}")
    print(f"{BOLD}{CYAN}{'='*60}{RESET}\n")


def print_ok(text: str):
    print(f"{GREEN}✅ {text}{RESET}")


def print_warn(text: str):
    print(f"{YELLOW}⚠️  {text}{RESET}")


def print_error(text: str):
    print(f"{RED}❌ {text}{RESET}")


def verificar_archivos():
    """Verifica que existan los archivos mínimos necesarios."""
    print_header("PASO 1: Verificación de archivos")

    archivos_requeridos = [
        "app.py",
        "extractor.py",
        "inercia.py",
        "rocof.py",
        "alertas.py",
        "asistente_local.py",
        "requirements.txt",
        "indexar_tfg.py",
    ]

    archivos_opcionales = [
        "datos_28A.json",
    ]

    print("Archivos requeridos:")
    faltan_criticos = False
    for f in archivos_requeridos:
        if os.path.exists(f):
            print_ok(f)
        else:
            print_error(f)
            faltan_criticos = True

    if faltan_criticos:
        print_error("\nFaltan archivos críticos. ¿Está el ZIP bien extraído?")
        return False

    print("\nArchivos opcionales:")
    for f in archivos_opcionales:
        if os.path.exists(f):
            print_ok(f)
        else:
            print_warn(f"'{f}' no encontrado — lo necesitarás después")

    # Verificar carpeta docs
    if os.path.isdir("docs") and os.listdir("docs"):
        print_ok("Carpeta '/docs' existe con archivos MDX")
    else:
        print_warn("Carpeta '/docs' vacía o inexistente — necesaria para indexar el TFG")

    return True


def crear_env():
    """Crea el archivo .env de forma interactiva."""
    print_header("PASO 2: Configuración de tokens API")

    if os.path.exists(".env"):
        print_warn(".env ya existe.")
        sobrescribir = input(f"{YELLOW}¿Sobrescribir? (s/N): {RESET}").strip().lower()
        if sobrescribir != "s":
            print_ok("Usando .env existente")
            return True

    print("Necesitamos dos tokens de API:\n")

    print(f"{BOLD}1. ESIOS (Red Eléctrica de España){RESET}")
    print("   - ¿Lo tienes? Pegarlo aquí (o presionar ENTER para saltar):")
    esios_token = input(f"   ESIOS_API_KEY: ").strip()

    if not esios_token:
        print_error("Sin token de ESIOS, el dashboard no funcionará.")
        return False

    print(f"\n{BOLD}2. ENTSOE (Operador Europeo){RESET}")
    print("   - Solicita en: https://transparency.entsoe.eu/usrm/publicload")
    print("   - Registrate → pide el token por email (tarda ~24h)")
    print("   - ¿Ya lo tienes? Pegarlo aquí (o presionar ENTER para dejarlo vacío):")
    entsoe_token = input(f"   ENTSOE_API_KEY: ").strip()

    if not entsoe_token:
        print_warn("Sin token de ENTSOE, algunas métricas aparecerán como N/D")
        entsoe_token = "SOLICITADO_POR_EMAIL"

    print(f"\n{BOLD}3. Modelo de IA local{RESET}")
    print("   Opciones: phi3:mini (recomendado, ~2.3GB RAM)")
    print("             llama3.1:8b (más potente, ~8GB RAM)")
    modelo = input(f"   Modelo [phi3:mini]: ").strip() or "phi3:mini"

    env_content = f"""# Dashboard Sistema Eléctrico Español
# Generado automáticamente por setup.py

ESIOS_API_KEY={esios_token}
ENTSOE_API_KEY={entsoe_token}
MODELO_IA={modelo}
"""

    with open(".env", "w", encoding="utf-8") as f:
        f.write(env_content)

    print_ok(f".env creado con éxito")
    return True


def instalar_dependencias():
    """Instala los paquetes de requirements.txt."""
    print_header("PASO 3: Instalación de dependencias")

    print("Ejecutando: pip install -r requirements.txt\n")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
        capture_output=False,
    )

    if result.returncode == 0:
        print_ok("Dependencias instaladas")
        return True
    else:
        print_error("Error al instalar dependencias")
        return False


def indexar_tfg():
    """Ejecuta la indexación del TFG."""
    print_header("PASO 4: Indexación del TFG")

    if not os.path.isdir("docs") or not os.listdir("docs"):
        print_warn("Carpeta '/docs' vacía. Salta esta indexación.")
        print("Cuando tengas los archivos .mdx del TFG:")
        print("  1. Colócalos en /docs/")
        print("  2. Ejecuta: python indexar_tfg.py")
        return True

    print("Indexando documentos MDX...")
    print("(puede tardar 2–10 minutos la primera vez)\n")

    result = subprocess.run(
        [sys.executable, "indexar_tfg.py"],
        input="s\n",  # responde "s" automáticamente al prompt
        text=True,
        capture_output=False,
    )

    if result.returncode == 0:
        print_ok("Indexación completada")
        return True
    else:
        print_error("Error durante la indexación (no es crítico para probar sin IA)")
        return True  # no bloqueamos


def verificar_ollama():
    """Verifica si Ollama está instalado y ejecutándose."""
    print_header("PASO 5: Verificación de Ollama (para el asistente IA)")

    try:
        import requests
        resp = requests.get("http://localhost:11434/api/tags", timeout=2)
        if resp.status_code == 200:
            print_ok("Ollama está ejecutándose en http://localhost:11434")
            modelos = resp.json().get("models", [])
            if modelos:
                print(f"  Modelos disponibles: {len(modelos)}")
                for m in modelos[:3]:
                    print(f"    - {m.get('name')}")
            return True
    except Exception:
        pass

    print_warn("Ollama no está ejecutándose o no está instalado")
    print("\nPara usar el asistente IA local, necesitas:")
    print("  1. Descargar Ollama desde https://ollama.com")
    print("  2. Ejecutar en otra terminal: ollama serve")
    print("  3. Descargar el modelo: ollama pull phi3:mini")
    print("\nPor ahora puedes usar el dashboard sin IA (solo métricas).")
    return False


def mostrar_instrucciones_finales():
    """Muestra instrucciones para ejecutar el dashboard."""
    print_header("✅ SETUP COMPLETADO")

    print(f"{BOLD}Para ejecutar el dashboard:{RESET}\n")
    print(f"  {CYAN}streamlit run app.py{RESET}\n")

    print(f"{BOLD}Próximos pasos (opcional):{RESET}\n")
    print("  1. Si aún no tienes el token de ENTSOE:")
    print("     - Ve a https://transparency.entsoe.eu/usrm/publicload")
    print("     - Regístrate → pide el token por email")
    print("     - Una vez lo tengas, actualiza .env\n")

    print("  2. Si quieres usar el asistente IA:")
    print("     - Instala Ollama desde https://ollama.com")
    print("     - Ejecuta: ollama serve")
    print("     - En otra terminal: ollama pull phi3:mini\n")

    print("  3. Asegúrate de que datos_28A.json esté en el directorio raíz\n")

    print(f"{BOLD}Archivos principales:{RESET}")
    print("  .env                — credenciales (NO subir a git)")
    print("  app.py              — dashboard principal")
    print("  datos_28A.json      — histórico del 28-A")
    print("  docs/               — documentos MDX del TFG")
    print("  chroma_tfg_db/      — base de conocimiento vectorial (generada)")
    print("  cache_datos.json    — caché de extracciones (generado)")
    print("  dashboard.log       — log de ejecución (generado)")


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or ".")

    print(f"\n{BOLD}{CYAN}SETUP — Dashboard Sistema Eléctrico Español{RESET}\n")

    # Paso 1
    if not verificar_archivos():
        print_error("Setup abortado.")
        return 1

    # Paso 2
    if not crear_env():
        print_error("Setup abortado.")
        return 1

    # Paso 3
    if not instalar_dependencias():
        print_error("Setup abortado.")
        return 1

    # Paso 4
    if not indexar_tfg():
        print_warn("Indexación no completada (se puede hacer después)")

    # Paso 5
    verificar_ollama()

    # Instrucciones finales
    mostrar_instrucciones_finales()

    return 0


if __name__ == "__main__":
    sys.exit(main())
