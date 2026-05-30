import os
import re

# Base path
base_path = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs"

# Files and their corresponding language replacements
replacements = {
    # 1. Spanish
    "docs/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Fuentes primarias\].*?\(reformulación de prompt ante alucinación detectada\)",
        "diagram_replacement": """

```text
[Fuentes primarias] ──> [Asistencia LLM] ──> [Filtro de validación física] ──> [Cuerpo del TFG]
                             ▲                              │
                             └──────────────────────────────┘
                               (reformulación de prompt ante alucinación detectada)
```""",
        "emphasis_replacements": [
            (r"_aceleradores_", "aceleradores"),
            (r"\*aceleradores\*", "aceleradores"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    },
    
    # 2. English
    "i18n/en/docusaurus-plugin-content-docs/current/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Primary sources\].*?\(prompt reformulation on detected hallucination\)",
        "diagram_replacement": """

```text
[Primary sources] ──> [LLM assistance] ──> [Physical validation filter] ──> [TFG body]
                           ▲                              │
                           └──────────────────────────────┘
                             (prompt reformulation on detected hallucination)
```""",
        "emphasis_replacements": [
            (r"_accelerators_", "accelerators"),
            (r"\*accelerators\*", "accelerators"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    },
    
    # 3. German
    "i18n/de/docusaurus-plugin-content-docs/current/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Primärquellen\].*?\(Neuformulierung des Prompts bei erkannter Halluzination\)",
        "diagram_replacement": """

```text
[Primärquellen] ──> [LLM-Unterstützung] ──> [Physikalischer Validierungsfilter] ──> [Hauptteil der Bachelorarbeit]
                          ▲                                      │
                          └──────────────────────────────────────┘
                            (Neuformulierung des Prompts bei erkannter Halluzination)
```""",
        "emphasis_replacements": [
            (r"_Beschleuniger_", "Beschleuniger"),
            (r"\*Beschleuniger\*", "Beschleuniger"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    },
    
    # 4. French
    "i18n/fr/docusaurus-plugin-content-docs/current/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Sources primaires\].*?\(reformulation du prompt face à une hallucination détectée\)",
        "diagram_replacement": """

```text
[Sources primaires] ──> [Assistance LLM] ──> [Filtre de validation physique] ──> [Corps du TFE]
                             ▲                              │
                             └──────────────────────────────┘
                               (reformulation du prompt face à une hallucination détectée)
```""",
        "emphasis_replacements": [
            (r"_accélérateurs_", "accélérateurs"),
            (r"\*accélérateurs\*", "accélérateurs"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    },
    
    # 5. Italian
    "i18n/it/docusaurus-plugin-content-docs/current/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Fonti primarie\].*?\(riformulazione del prompt a fronte di allucinazione rilevata\)",
        "diagram_replacement": """

```text
[Fonti primarie] ──> [Assistenza LLM] ──> [Filtro di validazione fisica] ──> [Corpo del TFG]
                          ▲                              │
                          └──────────────────────────────┘
                            (riformulazione del prompt a fronte di allucinazione rilevata)
```""",
        "emphasis_replacements": [
            (r"_acceleratori_", "acceleratori"),
            (r"\*acceleratori\*", "acceleratori"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    },
    
    # 6. Portuguese
    "i18n/pt/docusaurus-plugin-content-docs/current/08-uso-ia.mdx": {
        "diagram_pattern": r"\[Fontes primárias\].*?\(reformulação de prompt perante alucinação detectada\)",
        "diagram_replacement": """

```text
[Fontes primárias] ──> [Assistência LLM] ──> [Filtro de validação física] ──> [Corpo do TFG]
                            ▲                              │
                            └──────────────────────────────┘
                              (reformulação de prompt perante alucinação detectada)
```""",
        "emphasis_replacements": [
            (r"_aceleradores_", "aceleradores"),
            (r"\*aceleradores\*", "aceleradores"),
            (r"_hunting_", "hunting"),
            (r"\*hunting\*", "hunting"),
            (r"_prompt_", "prompt"),
            (r"_Prompt_", "Prompt"),
            (r"_prompts_", "prompts"),
            (r"_Prompts_", "Prompts"),
        ]
    }
}

def process_file(rel_path, config):
    abs_path = os.path.join(base_path, rel_path)
    if not os.path.exists(abs_path):
        print(f"File not found: {abs_path}")
        return
        
    print(f"Processing: {rel_path}")
    with open(abs_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Replace diagram
    pattern = re.compile(config["diagram_pattern"], re.DOTALL | re.IGNORECASE)
    match = pattern.search(content)
    if match:
        print(f"  Found diagram matching pattern!")
        content = pattern.sub(config["diagram_replacement"], content)
    else:
        print(f"  Warning: Diagram pattern not matched in {rel_path}!")
        
    # 2. Replace emphasis on technical terms
    for item_pattern, item_replacement in config["emphasis_replacements"]:
        compiled_item = re.compile(item_pattern)
        content, count = compiled_item.subn(item_replacement, content)
        if count > 0:
            print(f"  Replaced emphasis for {item_pattern} {count} times.")
            
    # Write back
    with open(abs_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  Successfully updated {rel_path}")

if __name__ == "__main__":
    for rel_path, config in replacements.items():
        process_file(rel_path, config)
    print("Done!")
