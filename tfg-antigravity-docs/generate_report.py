import json
import re
import os
import unicodedata
from collections import defaultdict

def slugify(text):
    text = text.lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def clean_text_for_search(text):
    # Remove frontmatter
    text = re.sub(r'^---.*?---', '', text, flags=re.DOTALL)
    # Remove code blocks
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    # Remove imports
    text = re.sub(r'^import .*?;', '', text, flags=re.MULTILINE)
    # Remove JSX tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove headings
    text = re.sub(r'^#+\s.*$', '', text, flags=re.MULTILINE)
    # Remove markdown links text but maybe we should just remove the formatting
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    return text

def main():
    with open('audit_results.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    terms = data['terms']
    glossary_map = data['glossary_map']
    files = data['files']
    
    # Pre-calculate term regexes
    term_regexes = {}
    for term in terms:
        escaped = re.escape(term)
        term_regexes[term] = re.compile(r'\b' + escaped + r'\b', re.IGNORECASE)
        
    candidate_terms = [
        "RoCoF", "UFLS", "SPS", "VSC", "NTC", "AGC", "SCADA", "PMU", "CAPEX", "OPEX",
        "resiliencia", "sincrofasores", "hueco de tensión", "estabilidad transitoria", 
        "apagón", "blackout", "deslastre", "reposición", "sobretensión", "subestación"
    ]
    # Filter out candidates already in glossary
    candidates_to_check = [c for c in candidate_terms if slugify(c) not in glossary_map]
    
    report_lines = []
    
    report_lines.append("# Auditoría del glosario técnico\n")
    
    # 1. Arquitectura detectada
    report_lines.append("## 1. Arquitectura detectada\n")
    report_lines.append("* **Archivo del glosario**: `src/data/glossary.js` (datos) y `docs/glosario.mdx` (página).")
    report_lines.append("* **Componente usado**: `<GlossaryLink term=\"...\">` para marcar términos en el texto y `<GlosarioTecnico />` para renderizar el diccionario completo.")
    report_lines.append("* **Sintaxis real de marcado**: `<GlossaryLink term=\"Término\">texto a mostrar</GlossaryLink>`.")
    report_lines.append("* **Estructura de entrada**: Objetos JSON con `id` (slugificado), `letter`, `term` y `definition`.")
    report_lines.append("* **Enlace al glosario**: Se genera implícitamente por el componente, buscando coincidencias y apuntando a `#slug-del-termino`.")
    report_lines.append("* **Restricciones técnicas**: El atributo `term` debe coincidir (tras aplicarle la función slugify) con un `id` existente en `glossary.js`. El componente gestiona internamente la tarjeta flotante y el enlace.\n")

    global_stats = {
        'total_terms': len(terms),
        'chapters': len(files),
        'correctly_marked': 0,
        'present_unmarked': 0,
        'duplicates': 0,
        'broken_links': 0,
        'candidates': 0
    }
    
    chapters_content = []
    
    all_candidates_found = defaultdict(list)
    
    for filename in sorted(files.keys()):
        file_data = files[filename]
        content = file_data['content']
        marked = file_data['marked']
        
        chapter_lines = []
        chapter_lines.append(f"### {filename}\n")
        
        # Correctly marked terms vs broken
        correctly_marked = []
        broken_links = []
        
        marked_counts = defaultdict(int)
        
        for m in marked:
            term_attr = m['term_attr']
            slug = slugify(term_attr)
            marked_counts[slug] += 1
            
            if slug in glossary_map:
                correctly_marked.append((term_attr, m['text'], slug))
            else:
                broken_links.append((term_attr, m['text']))
                
        # Duplicates
        duplicates = []
        for slug, count in marked_counts.items():
            if count > 1:
                term_name = glossary_map.get(slug, slug)
                duplicates.append((term_name, count))
                
        # Unmarked terms
        clean_text = clean_text_for_search(content)
        present_unmarked = []
        
        for term in terms:
            slug = slugify(term)
            # If the term is completely unmarked, but exists in text
            # We count occurrences in clean text
            matches = list(term_regexes[term].finditer(clean_text))
            if matches:
                # Check if it was marked at least once
                if slug not in marked_counts:
                    snippet = clean_text[max(0, matches[0].start()-30):matches[0].end()+30].replace('\\n', ' ')
                    present_unmarked.append((term, snippet, slug))

        # Missing candidates
        candidates_in_file = []
        for c in candidates_to_check:
            c_regex = re.compile(r'\b' + re.escape(c) + r'\b', re.IGNORECASE)
            matches = list(c_regex.finditer(clean_text))
            if matches:
                snippet = clean_text[max(0, matches[0].start()-30):matches[0].end()+30].replace('\\n', ' ')
                candidates_in_file.append((c, snippet))
                all_candidates_found[c].append((filename, snippet))
                
        # Update global stats
        global_stats['correctly_marked'] += len(correctly_marked)
        global_stats['present_unmarked'] += len(present_unmarked)
        global_stats['duplicates'] += len(duplicates)
        global_stats['broken_links'] += len(broken_links)
        
        # Write tables
        chapter_lines.append("#### Términos del glosario correctamente marcados\n")
        if correctly_marked:
            chapter_lines.append("| Término | Texto mostrado | Componente/Sintaxis | Anchor |")
            chapter_lines.append("|---|---|---|---|")
            for cm in correctly_marked:
                chapter_lines.append(f"| {cm[0]} | {cm[1]} | `<GlossaryLink term=\"{cm[0]}\">` | `#{cm[2]}` |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Términos del glosario presentes pero no marcados\n")
        if present_unmarked:
            chapter_lines.append("| Término | Fragmento | Ubicación | Anchor esperado | Recomendación |")
            chapter_lines.append("|---|---|---|---|---|")
            for pu in present_unmarked:
                chapter_lines.append(f"| {pu[0]} | `...{pu[1].strip()}...` | Cuerpo del texto | `#{pu[2]}` | Envolver primera aparición con `<GlossaryLink term=\"{pu[0]}\">` |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Términos marcados más de una vez\n")
        if duplicates:
            chapter_lines.append("| Término | Veces marcado | Cuál conservar | Cuáles desmarcar |")
            chapter_lines.append("|---|---|---|---|")
            for d in duplicates:
                chapter_lines.append(f"| {d[0]} | {d[1]} | La primera aparición natural | Las {d[1]-1} apariciones subsecuentes |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Tarjetas o enlaces defectuosos\n")
        if broken_links:
            chapter_lines.append("| Término atributo | Texto | Problema | Enlace esperado |")
            chapter_lines.append("|---|---|---|---|")
            for bl in broken_links:
                chapter_lines.append(f"| {bl[0]} | {bl[1]} | El término no existe en el glosario o difiere en slug | Revisar nombre en `glossary.js` |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapter_lines.append("#### Términos técnicos ausentes del glosario\n")
        if candidates_in_file:
            chapter_lines.append("| Término candidato | Fragmento | Motivo técnico | Prioridad | Capítulos |")
            chapter_lines.append("|---|---|---|---|---|")
            for c in candidates_in_file:
                chapter_lines.append(f"| {c[0]} | `...{c[1].strip()}...` | Concepto clave del dominio | Media | {filename} |")
        else:
            chapter_lines.append("*Ninguno detectado.*")
        chapter_lines.append("")
        
        chapters_content.append("\n".join(chapter_lines))
        
    global_stats['candidates'] = len(all_candidates_found)
    
    # 2. Resumen global
    report_lines.append("## 2. Resumen global\n")
    report_lines.append(f"* **Total de términos en el glosario**: {global_stats['total_terms']}")
    report_lines.append(f"* **Capítulos revisados**: {global_stats['chapters']}")
    report_lines.append(f"* **Apariciones correctamente marcadas**: {global_stats['correctly_marked']}")
    report_lines.append(f"* **Términos presentes pero no marcados**: {global_stats['present_unmarked']} (por capítulo)")
    report_lines.append(f"* **Términos duplicados**: {global_stats['duplicates']} casos de múltiples marcas en el mismo capítulo")
    report_lines.append(f"* **Enlaces o tarjetas defectuosas**: {global_stats['broken_links']}")
    report_lines.append(f"* **Términos candidatos propuestos**: {global_stats['candidates']}\n")

    report_lines.append("## 3. Diagnóstico por capítulo\n")
    report_lines.extend(chapters_content)
    
    report_lines.append("## 4. Lista consolidada de términos candidatos para Claude\n")
    report_lines.append("# Términos nuevos propuestos para definir con Claude\n")
    
    if all_candidates_found:
        for c, occurrences in all_candidates_found.items():
            report_lines.append(f"### {c}")
            report_lines.append(f"* **Término principal**: {c}")
            report_lines.append(f"* **Variantes o alias detectados**: {c.lower()}, {c.upper()}")
            report_lines.append(f"* **Capítulos donde aparece**: {', '.join(list(set([o[0] for o in occurrences])))}")
            report_lines.append(f"* **Fragmentos representativos**: `...{occurrences[0][1].strip()}...`")
            report_lines.append(f"* **Motivo**: Relevancia técnica para la comprensión de los sistemas de potencia, mencionado reiteradamente en el texto.")
            report_lines.append(f"* **Prioridad**: Media")
            report_lines.append(f"* **Categoría sugerida**: Sistemas eléctricos de potencia\n")
    else:
        report_lines.append("*No se encontraron términos candidatos adicionales en el análisis actual.*")

    with open('../AUDITORIA_GLOSARIO_TECNICO.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(report_lines))

if __name__ == '__main__':
    main()
