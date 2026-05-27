import sys

with open("C:/Users/aphmo/Proyectos/TFG OVERLEAF/DASHBOARD/app.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith("# ─── Panel de Control ─────────────────────────────────────────────────────────"):
        # Insert the big title here instead of the box later
        new_lines.append(line)
        new_lines.append('st.markdown("""\n')
        new_lines.append('<div style="font-size:3rem; font-family: \'Alfa Slab One\', serif; color:#ffffff; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 30px; text-shadow: 0 0 20px rgba(6,182,212,0.4);">\n')
        new_lines.append('    DASHBOARD INTERACTIVO\n')
        new_lines.append('</div>\n')
        new_lines.append('""", unsafe_allow_html=True)\n\n')
        new_lines.append('col_nav, col_main = st.columns([1, 4], gap="large")\n\n')
        new_lines.append('with col_nav:\n')
        new_lines.append('    st.markdown("### ⚙️ Panel de Control")\n')
        new_lines.append('    st.markdown("---")\n')
        
        i += 1
        # Skip the "with st.expander" line
        while i < len(lines) and not "with st.expander" in lines[i]:
            i += 1
        i += 1 # skip it
        # Skip the "col_ctrl" line
        while i < len(lines) and not "col_ctrl1, col_ctrl2, col_ctrl3" in lines[i]:
            i += 1
        i += 1 # skip it
        
        # Now we read the controls. We will unindent them from being in the expander and columns.
        while i < len(lines):
            l = lines[i]
            if l.startswith("# ─── Cabecera principal"):
                break
            
            # We skip "with col_ctrl1:" etc and unindent by 8 spaces or 4 spaces
            if l.strip() == "with col_ctrl1:" or l.strip() == "with col_ctrl2:" or l.strip() == "with col_ctrl3:":
                if l.strip() == "with col_ctrl2:" or l.strip() == "with col_ctrl3:":
                    new_lines.append('    st.markdown("<br>", unsafe_allow_html=True)\n')
                i += 1
                continue
            
            # Unindent by 4 spaces
            if l.startswith("        "):
                new_lines.append(l[4:])
            elif l.startswith("    "):
                new_lines.append(l)
            elif l.strip() == "":
                new_lines.append(l)
            else:
                pass # ignore poorly indented stuff just in case
            
            i += 1

        # We reached Cabecera principal
        # Skip until "Tabs principales"
        while i < len(lines) and not lines[i].startswith("# ─── Tabs principales"):
            i += 1
            
        new_lines.append("\nwith col_main:\n")
        continue

    if line.startswith("# ─── Tabs principales"):
        # We already added "with col_main:" above
        pass
        
    # If we are past "Tabs principales", we just append with 4 spaces indent
    if "with col_main:" in "".join(new_lines[-5:]):
        # We are inside col_main
        pass
    
    # We need to detect if we've passed "Tabs principales" to indent
    # Let's just track it manually.
    
    if "col_main" in "".join(new_lines):
        # But only if we are past Tabs principales
        pass

    i += 1

# Actually a safer way is to rewrite app.py by parsing blocks.
