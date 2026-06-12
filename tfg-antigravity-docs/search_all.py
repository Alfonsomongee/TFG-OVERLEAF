import glob

paths = glob.glob('C:/Users/aphmo/.gemini/antigravity/brain/*/.system_generated/logs/transcript.jsonl')
for p in paths:
    try:
        lines = open(p, encoding='utf-8', errors='ignore').readlines()
        for l in lines:
            if 'write_to_file' in l and 'anexo-demanda-generacion-balance.mdx' in l:
                print(f'FOUND write_to_file IN {p}')
                break
            if 'multi_replace_file_content' in l and 'anexo-demanda-generacion-balance.mdx' in l:
                print(f'FOUND multi_replace_file_content IN {p}')
                break
            if 'replace_file_content' in l and 'anexo-demanda-generacion-balance.mdx' in l:
                print(f'FOUND replace_file_content IN {p}')
                break
    except:
        pass
