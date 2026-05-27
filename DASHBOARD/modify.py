import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_stmt = 'from typing import List, Optional\nfrom tab_forense_28a import render_tab_forense'
content = content.replace('from typing import List, Optional', import_stmt)

# Replace with tab_forense: block
pattern = re.compile(r'with tab_forense:.*?# -+', re.DOTALL)
replacement = 'with tab_forense:\n    render_tab_forense(st.session_state.ultimo_snapshot)\n\n# -+'

# Wait, instead of regex which might fail, let''s do string splitting
parts = content.split('with tab_forense:')
if len(parts) == 2:
    subparts = parts[1].split('with tab_freq:')
    if len(subparts) == 2:
        # Reconstruct
        # Wait, there is a header before with tab_freq:
        header_start = subparts[0].rfind('#')
        # Actually just find the first '#' backwards from with tab_freq
        
        new_content = parts[0] + 'with tab_forense:\n    render_tab_forense(st.session_state.ultimo_snapshot)\n\n\n# -----------------------------------------------------------------------------\n#  TAB 3: FRECUENCIA\n# -----------------------------------------------------------------------------\n\nwith tab_freq:' + subparts[1]
        
        with open('app.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print('app.py modified successfully')
    else:
        print('Failed to find with tab_freq:')
else:
    print('Failed to find with tab_forense:')
