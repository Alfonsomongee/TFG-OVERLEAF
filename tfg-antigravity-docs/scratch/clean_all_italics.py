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
    "grid-forming", "Grid-forming",
    "grid-following", "Grid-following",
    "out-of-step", "Out-of-Step", "Out-of-step",
    "power swing", "Power Swing", "power swinging", "Power Swinging",
    "first beat", "First Beat", "first-beat", "First-beat",
    "infinite bus", "Infinite Bus", "infinite-bus", "Infinite-bus",
    "sympathetic inrush", "Sympathetic Inrush", "sympathetic inrush current", "Sympathetic Inrush Current",
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
    "swing", "Swing"
]

# We want to replace e.g. _hunting_ with hunting, or *hunting* with hunting
# Regex: (?<=\b|[\s.,;:\(\)"'])[\*_](word)[\*_](?=\b|[\s.,;:\(\)"'])
# But let's be simpler: we can just replace exactly for each word in the list with boundary check or literal replace of `_word_` or `*word*`.
# Let's use re.sub with case-insensitive / word list or compile a robust regex for each word.

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = content
    
    # We will build a regex for all the terms to replace them in one go if they have * or _ around them
    # Ensure they match either _term_ or *term*
    for word in words_to_clean:
        # Match _word_ or *word*
        # We handle case-insensitive or exact match by specifying the exact words
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
