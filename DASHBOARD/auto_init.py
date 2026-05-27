#!/usr/bin/env python
"""
auto_init.py — Automatización completa para el agente IA de APH.

Ejecutar una sola vez:
    python auto_init.py

Automatiza:
    1. Crear .env desde token_esios.txt (si existe)
    2. Instalar requirements.txt
    3. Copiar .mdx del Docusaurus a docs/ e indexarlos
    4. Verificar que todo esté listo para ejecutar Streamlit

Después simplemente ejecutar:
    streamlit run app.py
"""

import os
import sys
import subprocess
import json
from pathlib import Path
from typing import Tuple

# Configure stdout/stderr to use UTF-8 if they support it to prevent UnicodeEncodeError in Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

CYAN = "\033[96m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BOLD = "\033[1m"
RESET = "\033[0m"


def print_step(num: int, text: str):
    print(f"\n{BOLD}{CYAN}{'='*60}{RESET}")
    print(f"{BOLD}{CYAN}PASO {num}: {text:50s}{RESET}")
    print(f"{BOLD}{CYAN}{'='*60}{RESET}\n")


def print_ok(text: str):
    try:
        print(f"{GREEN}✅ {text}{RESET}")
    except UnicodeEncodeError:
        print(f"{GREEN}[OK] {text}{RESET}")


def print_warn(text: str):
    try:
        print(f"{YELLOW}⚠️  {text}{RESET}")
    except UnicodeEncodeError:
        print(f"{YELLOW}[WARN] {text}{RESET}")


def print_error(text: str):
    try:
        print(f"{RED}❌ {text}{RESET}")
    except UnicodeEncodeError:
        print(f"{RED}[ERROR] {text}{RESET}")


def step1_crear_env() -> bool:
    """Crea .env automáticamente desde token_esios.txt si existe."""
    print_step(1, "Crear .env desde token_esios.txt")

    if os.path.exists(".env"):
        print_ok(".env ya existe")
        return True

    token_file = "../token esios.txt"  # ubicación que APH menciona
    token_file_alt = "token esios.txt"

    esios_token = None
    token_path = None

    # Buscar el archivo del token
    for candidate in [token_file, token_file_alt]:
        if os.path.exists(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as f:
                    esios_token = f.read().strip()
                token_path = candidate
                break
            except Exception as e:
                print_warn(f"No se pudo leer {candidate}: {e}")

    if not esios_token:
        print_error("No se encontró token_esios.txt")
        print("  Ubicaciones buscadas:")
        print(f"    - {token_file}")
        print(f"    - {token_file_alt}")
        print("\nSolución: crea un archivo 'token esios.txt' con tu token")
        return False

    print_ok(f"Token ESIOS encontrado en {token_path}")

    env_content = f"""# Dashboard Sistema Eléctrico Español
# Generado automáticamente por auto_init.py
# Fecha: {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

ESIOS_API_KEY={esios_token}
ENTSOE_API_KEY=
MODELO_IA=phi3:mini
"""

    try:
        with open(".env", "w", encoding="utf-8") as f:
            f.write(env_content)
        print_ok(".env creado exitosamente")
        return True
    except Exception as e:
        print_error(f"Error al crear .env: {e}")
        return False


def step2_instalar_dependencias() -> bool:
    """Instala las dependencias desde requirements.txt."""
    print_step(2, "Instalar dependencias (pip install -r requirements.txt)")

    if not os.path.exists("requirements.txt"):
        print_error("requirements.txt no encontrado")
        return False

    print("Ejecutando pip install...\n")
    result = subprocess.run(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
        capture_output=False,
    )

    if result.returncode == 0:
        print_ok("Dependencias instaladas exitosamente")
        return True
    else:
        print_error("Error al instalar dependencias")
        return False


def step3_copiar_mdx_e_indexar() -> bool:
    """Copia .mdx del Docusaurus a docs/ e indexa con ChromaDB."""
    print_step(3, "Copiar archivos .mdx del Docusaurus e indexarlos")

    # Rutas posibles del Docusaurus en el proyecto original
    docusaurus_paths = [
        "../Docusaurus/docs",
        "../docusaurus/docs",
        "../doc/docs",
        "../docs",
    ]

    docusaurus_source = None
    for path in docusaurus_paths:
        if os.path.isdir(path):
            # Verificar que tenga archivos .mdx
            mdx_files = list(Path(path).glob("**/*.mdx"))
            if mdx_files:
                docusaurus_source = path
                print_ok(f"Docusaurus encontrado en: {path}")
                print(f"   Archivos .mdx: {len(mdx_files)}")
                break

    if not docusaurus_source:
        print_warn("No se encontró la carpeta Docusaurus con archivos .mdx")
        print("  Rutas buscadas:")
        for p in docusaurus_paths:
            print(f"    - {p}")
        print("\nSolución: copia manualmente los .mdx a la carpeta 'docs/' del dashboard")
        return True  # No es crítico, continuar

    # Crear carpeta docs si no existe
    os.makedirs("docs", exist_ok=True)

    # Copiar archivos .mdx
    try:
        mdx_files = list(Path(docusaurus_source).glob("**/*.mdx"))
        count = 0
        for src_file in mdx_files:
            # Crear estructura de directorios
            rel_path = src_file.relative_to(docusaurus_source)
            dst_file = Path("docs") / rel_path
            dst_file.parent.mkdir(parents=True, exist_ok=True)

            # Copiar archivo
            import shutil

            shutil.copy2(src_file, dst_file)
            count += 1

        print_ok(f"Copiados {count} archivos .mdx a docs/")

        # Indexar automáticamente
        print("\nIndexando TFG en ChromaDB...")
        result = subprocess.run(
            [sys.executable, "-c", "from asistente_local import AsistenteLocal; AsistenteLocal(force_reindex=True)"],
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            print_ok("TFG indexado correctamente")
            return True
        else:
            print_warn(f"Indexación completada con advertencias: {result.stderr[:200]}")
            return True

    except Exception as e:
        print_warn(f"Error al copiar/indexar: {e}")
        return True  # No bloqueamos


def step4_verificar_readiness() -> bool:
    """Verifica que todo esté listo para ejecutar Streamlit."""
    print_step(4, "Verificar que todo está listo")

    checks = [
        (".env", "Archivo de configuración"),
        ("app.py", "Dashboard principal"),
        ("datos_28A.json", "Datos históricos del 28-A"),
        ("requirements.txt", "Dependencias"),
    ]

    all_ok = True
    for filename, description in checks:
        if os.path.exists(filename):
            print_ok(f"{description}: {filename}")
        else:
            print_error(f"{description}: {filename} NO ENCONTRADO")
            all_ok = False

    # Verificar que .env tiene el token
    if os.path.exists(".env"):
        try:
            with open(".env", "r") as f:
                env_content = f.read()
                if "ESIOS_API_KEY=" in env_content and len(env_content.split("ESIOS_API_KEY=")[1].split("\n")[0].strip()) > 10:
                    print_ok("Token ESIOS presente en .env")
                else:
                    print_warn("Token ESIOS en .env pero puede estar vacío o inválido")
        except Exception as e:
            print_error(f"Error al verificar .env: {e}")

    # Carpeta docs
    if os.path.isdir("docs") and os.listdir("docs"):
        mdx_count = len(list(Path("docs").glob("**/*.mdx")))
        print_ok(f"Carpeta docs/ con {mdx_count} archivos .mdx")
    else:
        print_warn("Carpeta docs/ vacía o no existe (necesaria para IA)")

    return all_ok


def mostrar_instrucciones_finales():
    """Muestra instrucciones para ejecutar el dashboard."""
    print_step("FINAL", "¡Listo para ejecutar!")

    print(f"{BOLD}Para iniciar el dashboard:{RESET}\n")
    print(f"  {CYAN}streamlit run app.py{RESET}\n")

    print(f"{BOLD}El dashboard abrirá en:{RESET}")
    print(f"  http://localhost:8501\n")

    print(f"{BOLD}Próximos pasos (opcional):{RESET}\n")
    print("  1. Si quieres usar el asistente IA:")
    print("     - Instala Ollama: https://ollama.com")
    print("     - Ejecuta: ollama serve")
    print("     - En otra terminal: ollama pull phi3:mini\n")

    print("  2. Si aún no tienes el token de ENTSOE:")
    print("     - Ve a: https://transparency.entsoe.eu/usrm/publicload")
    print("     - Solicita por email (tarda ~24h)")
    print("     - Cuando lo recibas, actualiza .env\n")

    print(f"{BOLD}Archivos generados:{RESET}")
    print("  .env ...................... credenciales API")
    print("  docs/ ..................... archivos .mdx del TFG")
    print("  chroma_tfg_db/ ............ base de conocimiento (IA)")
    print("  cache_datos.json .......... histórico de mediciones")
    print("  dashboard.log ............. logs de ejecución\n")


def main():
    """Ejecuta todos los pasos automáticamente."""
    os.chdir(os.path.dirname(os.path.abspath(__file__)) or ".")

    print(f"\n{BOLD}{CYAN}AUTO-INIT — Configuración automática del Dashboard{RESET}\n")
    print(f"Agente IA de APH: todos los pasos están automatizados.\n")

    # Paso 1: Crear .env
    if not step1_crear_env():
        print_error("No se pudo crear .env. Setup abortado.")
        return 1

    # Paso 2: Instalar dependencias
    if not step2_instalar_dependencias():
        print_error("No se pudieron instalar dependencias. Setup abortado.")
        return 1

    # Paso 3: Copiar y indexar .mdx
    step3_copiar_mdx_e_indexar()

    # Paso 4: Verificar
    if not step4_verificar_readiness():
        print_warn("Alguna verificación falló, pero el setup puede continuar.")

    # Instrucciones finales
    mostrar_instrucciones_finales()

    return 0


if __name__ == "__main__":
    sys.exit(main())
