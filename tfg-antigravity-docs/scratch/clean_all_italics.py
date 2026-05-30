import os
import re

DOCS_DIRS = [
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\docs",
    r"C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"
]

words_to_clean = [
    "hunting", "Hunting",
    "tap-lag", "Tap-Lag", "tap -lag", "Tap -Lag",
    "tail-risk", "Tail-risk", "tail risk", "Tail risk",
    "black-start", "Black-Start", "black start", "Black Start",
    "grid-forming", "Grid-forming", "Grid-Forming",
    "grid-following", "Grid-following", "Grid-Following",
    "out-of-step", "Out-of-Step", "Out-of-step",
    "power swing", "Power Swing", "power swinging", "Power Swinging", "power-swinging",
    "first beat", "First Beat", "first-beat", "First-beat",
    "infinite bus", "Infinite Bus", "infinite-bus", "Infinite-bus",
    "sympathetic inrush", "Sympathetic Inrush", "sympathetic inrush current", "Sympathetic Inrush Current", "sympathetic-inrush",
    "synchro-check", "Synchro-check", "Synchro-Check",
    "afrr", "aFRR", "AFRR",
    "ufls", "UFLS",
    "rocof", "RoCoF", "ROCOF",
    "statcom", "STATCOM",
    "syncons", "SynCons",
    "hvdc", "HVDC",
    "lole", "LOLE",
    "cgm", "CGM",
    "csa", "CSA",
    "sta", "STA",
    "sam", "SAM",
    "eas", "EAS",
    "rfg", "RfG", "RFG",
    "lfc", "LFC",
    "mrscr", "MRSCR",
    "miif", "MIIF",
    "pll", "PLL",
    "scada", "SCADA",
    "agc", "AGC",
    "avr", "AVR",
    "ansi", "ANSI",
    "utilities", "Utilities",
    "payback", "Payback",
    "swing", "Swing",
    "top-down", "Top-Down", "Top-down",
    "bottom-up", "Bottom-Up", "Bottom-up",
    "Blackout", "blackout", "Black-out", "black-out",
    "PICASSO", "Picasso",
    "Swissgrid", "swissgrid",
    "prompt", "Prompt", "prompts", "Prompts",
    "IBR", "ibr",
    "PMODE1", "PMODE2", "PMODE3",
    "ex ante", "ex-ante", "Ex ante", "Ex-ante",
    "Normal", "normal",
    "headroom", "Headroom",
    "amprion", "Amprion",
    "System Split", "system split", "System-Split", "system-split",
    "Coreso", "coreso",
    "European Resource Adequacy Assessment",
    "PMU", "pmu", "PMUs",
    "IEEE39", "ieee39", "IEEE-39",
    "sensors", "Sensors",
    "900 MW", "244 kV", "870 MVAr", "426 MVAr", "5 MW", "1 V",
    "Forensic Charts 1-5", "Synchronous Area Monitors"
]

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    
    for word in words_to_clean:
        pattern_under = rf'_{re.escape(word)}_'
        pattern_star = rf'\*{re.escape(word)}\*'
        
        modified = re.sub(pattern_under, word, modified)
        modified = re.sub(pattern_star, word, modified)
        
    if modified != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(modified)
        print(f"Cleaned technical terms emphasis in: {filepath}")

for docs_dir in DOCS_DIRS:
    for root, _, files in os.walk(docs_dir):
        for file in files:
            if file.endswith('.mdx') or file.endswith('.md'):
                clean_file(os.path.join(root, file))

print("Emphasis cleaning complete.")
