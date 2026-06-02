import os
import sys
import glob
import json
import urllib.request
import urllib.error

# Configuración
DOCS_DIR = os.path.join(os.path.dirname(__file__), '..', 'docs')
I18N_DIR = os.path.join(os.path.dirname(__file__), '..', 'i18n')

API_KEY = os.environ.get('DEEPSEEK_API_KEY')
if not API_KEY:
    # Intento de cargar desde .env local si no está en os.environ
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('DEEPSEEK_API_KEY='):
                    API_KEY = line.strip().split('=', 1)[1]

if not API_KEY:
    print("ERROR: DEEPSEEK_API_KEY no encontrada.")
    sys.exit(1)

def translate_content(content, target_lang):
    prompt = f"""You are a professional technical translator specializing in electrical engineering and power systems.
Translate the following MDX (Markdown + React) document from Spanish into {target_lang}.

CRITICAL RULES:
1. DO NOT translate MDX component tags (e.g., <ForensicTable>, <GlitchTitle>, <ExecutiveHook />). Keep them exactly as they are.
2. DO NOT translate import statements (e.g., import X from Y).
3. DO NOT translate the keys in the YAML frontmatter (slug, sidebar_position, etc.), BUT DO translate the values of 'title:' and 'description:'.
4. DO NOT translate file paths, URLs, or image links (e.g., /figuras/...).
5. DO NOT translate code blocks.
6. The target language is {target_lang}. Provide high-quality, professional technical translation.
7. Return ONLY the translated MDX content. Do not add any conversational text or markdown codeblocks (```mdx) wrapping the entire response, just output the raw translated file content.

Here is the document:
{content}
"""

    url = "https://api.deepseek.com/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    data = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": "You are an expert technical translator."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
    }
    
    req = urllib.request.Request(url, headers=headers, data=json.dumps(data).encode('utf-8'))
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            result = json.loads(response.read().decode('utf-8'))
            translated_text = result['choices'][0]['message']['content']
            # Quitar posibles wrappers de código si el modelo insiste
            if translated_text.startswith("```mdx\n"):
                translated_text = translated_text[7:]
            if translated_text.startswith("```markdown\n"):
                translated_text = translated_text[12:]
            if translated_text.endswith("\n```"):
                translated_text = translated_text[:-4]
            return translated_text.strip() + "\n"
    except urllib.error.URLError as e:
        print(f"  [!] Error de red/API: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"  [!] Error inesperado: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Uso: python translate_mdx_deepseek.py <lang_code>")
        sys.exit(1)
        
    target_lang_code = sys.argv[1]
    
    lang_names = {
        'en': 'English',
        'fr': 'French',
        'de': 'German'
    }
    
    target_lang_name = lang_names.get(target_lang_code)
    if not target_lang_name:
        print(f"Idioma no soportado: {target_lang_code}")
        sys.exit(1)
        
    print(f"Iniciando traducción al {target_lang_name} ({target_lang_code})...")
    
    # Crear directorio de destino
    out_dir = os.path.join(I18N_DIR, target_lang_code, 'docusaurus-plugin-content-docs', 'current')
    os.makedirs(out_dir, exist_ok=True)
    
    mdx_files = glob.glob(os.path.join(DOCS_DIR, '**', '*.mdx'), recursive=True)
    mdx_files.sort()
    
    for file_path in mdx_files:
        rel_path = os.path.relpath(file_path, DOCS_DIR)
        out_file_path = os.path.join(out_dir, rel_path)
        
        # Asegurar directorios anidados
        os.makedirs(os.path.dirname(out_file_path), exist_ok=True)
        
        # Saltarse si ya está traducido y tiene buen tamaño (para reintentos)
        if os.path.exists(out_file_path) and os.path.getsize(out_file_path) > 100:
            print(f"  [SKIP] {rel_path} ya existe.")
            continue
            
        print(f"  [TRANSLATING] {rel_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        translated = translate_content(content, target_lang_name)
        if translated:
            with open(out_file_path, 'w', encoding='utf-8') as f:
                f.write(translated)
            print(f"  [OK] {rel_path}")
        else:
            print(f"  [ERROR] Falló la traducción de {rel_path}")

if __name__ == '__main__':
    main()
