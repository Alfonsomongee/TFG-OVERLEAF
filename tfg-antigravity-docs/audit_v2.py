import json
import re
import os
import glob
import unicodedata

def slugify(text):
    text = text.lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_text_for_search(text):
    text = re.sub(r'^---.*?---', '', text, flags=re.DOTALL)
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    text = re.sub(r'^import .*?;', '', text, flags=re.MULTILINE)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'^#+\s.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    return text

def main():
    docs_dir = 'docs'
    glossary_path = 'src/data/glossary.js'
    plugin_path = 'plugins/remark-auto-glossary-links.js'
    
    with open(glossary_path, 'r', encoding='utf-8') as f:
        glossary_content = f.read()
    
    terms_raw = re.findall(r'term:\s*"([^"]+)"', glossary_content)
    glossary_terms = list(set(terms_raw))
    glossary_map = {slugify(t): t for t in glossary_terms}
    
    with open(plugin_path, 'r', encoding='utf-8') as f:
        plugin_content = f.read()
    
    # Extract RAW_TERMS array
    raw_terms_match = re.search(r'const RAW_TERMS = \[([\s\S]*?)\];', plugin_content)
    raw_terms = []
    if raw_terms_match:
        items = re.findall(r'"([^"]+)"', raw_terms_match.group(1))
        raw_terms = items
        
    mdx_files = glob.glob(os.path.join(docs_dir, '[0-1][0-9]-*.mdx'))
    
    report_lines = []
    report_lines.append("# Auditoría del glosario técnico (Actualizada: Arquitectura AST)\n")
    report_lines.append("## 1. Arquitectura detectada\n")
    report_lines.append("* **Archivo de datos**: `src/data/glossary.js`.")
    report_lines.append("* **Mecanismo de marcado**: ¡Automático en tiempo de compilación! Docusaurus usa un plugin AST personalizado (`plugins/remark-auto-glossary-links.js`).")
    report_lines.append("* **Funcionamiento**: El plugin lee la constante `RAW_TERMS` (que tiene 119 términos), busca la primera aparición en texto plano dentro de los MDX (ignorando código, jsx, enlaces) y la reemplaza por un `<span class=\"glossary-term glossary-term-first\" data-term=\"...\">`.")
    report_lines.append("* **Consecuencia**: Los archivos MDX se mantienen limpios (no hay que escribir el marcado a mano), pero cualquier desincronización entre `RAW_TERMS` y `glossary.js` produce enlaces rotos.\n")

    global_stats = {
        'total_glossary': len(glossary_terms),
        'total_raw_terms': len(raw_terms),
        'correctly_marked': 0,
        'present_unmarked': 0,
        'broken_links': 0,
        'candidates': 0
    }
    
    chapters_content = []
    all_candidates_found = {}
    
    candidate_terms = [
        "RoCoF", "UFLS", "SPS", "VSC", "NTC", "AGC", "SCADA", "PMU", "CAPEX", "OPEX",
        "resiliencia", "sincrofasores", "hueco de tensión", "estabilidad transitoria", 
        "apagón", "blackout", "deslastre", "reposición", "sobretensión", "subestación"
    ]
    candidates_to_check = [c for c in candidate_terms if slugify(c) not in glossary_map and c not in raw_terms]

    # Pre-sort raw_terms by length descending to match plugin behavior
    raw_terms_sorted = sorted(raw_terms, key=len, reverse=True)

    for filepath in sorted(mdx_files):
        filename = os.path.basename(filepath)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        clean_text = clean_text_for_search(content)
        
        chapter_lines = [f"### {filename}\n"]
        
        # Simulate plugin
        seen_terms = set()
        correctly_marked = []
        broken_links = []
        
        for rt in raw_terms_sorted:
            # simple search in clean_text
            if rt in clean_text:
                if rt not in seen_terms:
                    seen_terms.add(rt)
                    slug = slugify(rt)
                    if slug in glossary_map:
                        correctly_marked.append((rt, slug))
                    else:
                        broken_links.append(rt)
        
        # Present unmarked: terms in glossary_map but NOT in raw_terms (so plugin ignores them)
        present_unmarked = []
        for gt in glossary_terms:
            if gt not in raw_terms and gt in clean_text:
                # Find snippet
                idx = clean_text.find(gt)
                snippet = clean_text[max(0, idx-30):idx+len(gt)+30].replace('\\n', ' ')
                present_unmarked.append((gt, snippet))
                
        # Candidates
        candidates_in_file = []
        for c in candidates_to_check:
            c_regex = re.compile(r'\b' + re.escape(c) + r'\b', re.IGNORECASE)
            matches = list(c_regex.finditer(clean_text))
            if matches:
                snippet = clean_text[max(0, matches[0].start()-30):matches[0].end()+30].replace('\\n', ' ')
                candidates_in_file.append((c, snippet))
                if c not in all_candidates_found:
                    all_candidates_found[c] = []
                all_candidates_found[c].append((filename, snippet))
                
        global_stats['correctly_marked'] += len(correctly_marked)
        global_stats['broken_links'] += len(broken_links)
        global_stats['present_unmarked'] += len(present_unmarked)
        
        chapter_lines.append("#### Términos marcados automáticamente por el plugin AST\n")
        if correctly_marked:
            chapter_lines.append("| Término | Anchor de destino | Estado |")
            chapter_lines.append("|---|---|---|")
            for cm in correctly_marked:
                chapter_lines.append(f"| {cm[0]} | `#{cm[1]}` | OK |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Enlaces rotos (en el plugin pero sin definición en glosario)\n")
        if broken_links:
            chapter_lines.append("| Término configurado | Problema |")
            chapter_lines.append("|---|---|")
            for bl in broken_links:
                chapter_lines.append(f"| {bl} | Aparece en `RAW_TERMS` pero su slug `{slugify(bl)}` no existe en `glossary.js` |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Términos del glosario ausentes en el plugin AST\n")
        if present_unmarked:
            chapter_lines.append("| Término | Fragmento | Recomendación |")
            chapter_lines.append("|---|---|---|")
            for pu in present_unmarked:
                chapter_lines.append(f"| {pu[0]} | `...{pu[1].strip()}...` | Añadir a `RAW_TERMS` en `remark-auto-glossary-links.js` |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapters_content.append("\n".join(chapter_lines))
        
    global_stats['candidates'] = len(all_candidates_found)
    
    report_lines.append("## 2. Resumen global\n")
    report_lines.append(f"* **Total de términos en `glossary.js`**: {global_stats['total_glossary']}")
    report_lines.append(f"* **Total de términos en el plugin AST (`RAW_TERMS`)**: {global_stats['total_raw_terms']}")
    report_lines.append(f"* **Apariciones correctamente detectadas y enlazadas**: {global_stats['correctly_marked']}")
    report_lines.append(f"* **Enlaces rotos potenciales**: {global_stats['broken_links']} (términos en el plugin sin contraparte exacta en el glosario)")
    report_lines.append(f"* **Términos definidos pero excluidos del plugin**: {global_stats['present_unmarked']} (aparecen en el texto pero no están en `RAW_TERMS`)")
    report_lines.append(f"* **Términos candidatos propuestos**: {global_stats['candidates']}\n")

    report_lines.append("## 3. Diagnóstico por capítulo\n")
    report_lines.extend(chapters_content)
    
    with open('../AUDITORIA_GLOSARIO_TECNICO.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(report_lines))

if __name__ == '__main__':
    main()
