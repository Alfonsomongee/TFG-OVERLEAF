import re
import json
import os
import glob
import unicodedata

def slugify(text):
    text = text.lower()
    text = unicodedata.normalize('NFD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def main():
    docs_dir = 'docs'
    glossary_path = 'src/data/glossary.js'
    
    with open(glossary_path, 'r', encoding='utf-8') as f:
        glossary_content = f.read()
    
    # Extract terms
    terms_raw = re.findall(r'term:\s*"([^"]+)"', glossary_content)
    terms = list(set(terms_raw)) # unique
    glossary_map = {slugify(t): t for t in terms}
    
    mdx_files = glob.glob(os.path.join(docs_dir, '[0-1][0-9]-*.mdx'))
    
    results = {}
    
    for filepath in mdx_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. Correctly marked terms: <GlossaryLink term="...">...</GlossaryLink>
        marked_pattern = re.compile(r'<GlossaryLink\s+term=["\']([^"\']+)["\'][^>]*>(.*?)</GlossaryLink>', re.DOTALL)
        marked_instances = marked_pattern.findall(content)
        
        # We need location of matches, let's use finditer
        marked_detailed = []
        for match in marked_pattern.finditer(content):
            marked_detailed.append({
                'term_attr': match.group(1),
                'text': match.group(2).strip(),
                'start': match.start(),
                'end': match.end()
            })
            
        results[os.path.basename(filepath)] = {
            'marked': marked_detailed,
            'content': content
        }
    
    with open('audit_results.json', 'w', encoding='utf-8') as f:
        json.dump({'terms': terms, 'glossary_map': glossary_map, 'files': results}, f, ensure_ascii=False, indent=2)
        
if __name__ == '__main__':
    main()
