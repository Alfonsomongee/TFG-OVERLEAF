import re
import glob

files = glob.glob('src/data/forensicCharts_*.js') + glob.glob('src/data/forensicData_*.js')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace single quotes surrounded by word chars with escaped quotes
    new_content = re.sub(r"(?<=\w)'(?=\w)", r"\'", content)
    
    # Also, we can check for plural possessive like s' if it's followed by a space or punctuation inside a string.
    # Actually let's just stick to word chars first and see if node -c passes.
    
    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed quotes in {file}")
