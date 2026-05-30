import subprocess
import re

cwd = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF"
cmd = "git show d59587e4"
output = subprocess.check_output(cmd, shell=True, cwd=cwd, text=True, encoding='utf-8')

# Search for the english diff block
match = re.search(r'diff --git a/tfg-antigravity-docs/i18n/en/docusaurus-plugin-content-docs/current/07b-consecuencias-financieras.mdx.*?(?=diff --git|$)', output, re.DOTALL)
if match:
    block = match.group(0)
    # Find all deleted lines (starting with '-') that do not start with '---' or '-import'
    deleted_lines = []
    for line in block.split('\n'):
        if line.startswith('-') and not line.startswith('---') and not line.startswith('-import '):
            deleted_lines.append(line[1:])
    print("=== en ===")
    print("\n".join(deleted_lines))
else:
    print("English diff block not found in commit d59587e4")
