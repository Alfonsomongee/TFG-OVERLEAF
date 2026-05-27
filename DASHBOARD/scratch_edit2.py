import sys

FILE_PATH = "C:/Users/aphmo/Proyectos/TFG OVERLEAF/DASHBOARD/app.py"

with open(FILE_PATH, "r", encoding="utf-8") as f:
    lines = f.readlines()

out = []
i = 0
while i < len(lines):
    line = lines[i]
    
    if line.startswith("# ─── Panel de Control"):
        out.append(line)
        out.append('st.markdown("""\n')
        out.append('<div style="font-size:3.5rem; font-family: \'Alfa Slab One\', serif; color:#ffffff; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 30px; line-height:1.1; filter: drop-shadow(0 0 12px rgba(6,182,212,0.3));">\n')
        out.append('    DASHBOARD INTERACTIVO\n')
        out.append('</div>\n')
        out.append('""", unsafe_allow_html=True)\n\n')
        
        out.append('col_nav, col_main = st.columns([1, 4], gap="large")\n\n')
        
        out.append('with col_nav:\n')
        
        # We need to extract the controls manually instead of parsing the weird indentation.
        controls_str = """
    st.markdown("### ⚙️ Panel de Control")
    st.markdown("---")
    
    st.markdown("**🔄 Auto-refresco**")
    intervalo = st.selectbox("Intervalo", [0, 5, 10, 15, 30], format_func=lambda x: "Desactivado" if x == 0 else f"{x} min", label_visibility="collapsed")
    if intervalo > 0:
        st_autorefresh(interval=intervalo * 60 * 1000, key="autorefresh")
        
    if st.button("📡 Sincronizar ahora", use_container_width=True, type="primary"):
        with st.spinner("Conectando con ESIOS…"):
            if sincronizar_datos():
                st.success("✅ Datos actualizados")
            else:
                st.error("❌ Error al sincronizar")

    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("**🤖 Asistente IA**")
    activar_ia = st.toggle("Activar asistente local (Ollama)", value=False)
    if activar_ia and st.session_state.get("asistente") is None:
        with st.spinner("Cargando asistente (puede tardar ~30s)..."):
            try:
                st.session_state.asistente = AsistenteLocal()
                st.success("🤖 Asistente listo")
            except Exception as e:
                st.error(f"Error: {e}")
    elif not activar_ia:
        st.session_state.asistente = None
        
    snap = st.session_state.ultimo_snapshot
    if snap:
        st.caption(f"Última actualización: {snap.get('timestamp', '—')}")

    st.markdown("<br>", unsafe_allow_html=True)
    if snap:
        nivel, icono_n, desc_n = nivel_global(st.session_state.alertas_activas)
        nivel_css = {
            "verde": "alerta-verde", "ambar": "alerta-ambar",
            "rojo": "alerta-rojo", "critico": "alerta-critico",
        }.get(nivel, "alerta-verde")

        st.markdown(f'''<div class="{nivel_css}" style="margin:0; padding: 12px; border-radius: 8px;"><b>{icono_n} {desc_n}</b></div>''', unsafe_allow_html=True)

        iriesgo, nivel_riesgo, desc_riesgo = indice_riesgo_sistema(snap)
        color_r = (
            "riesgo-bajo"    if iriesgo < 20 else
            "riesgo-vigilar" if iriesgo < 40 else
            "riesgo-alto"    if iriesgo < 65 else
            "riesgo-colapso"
        )
        st.markdown(f'<div style="margin-top: 12px;"><b>Riesgo:</b> <span class="{color_r}">{iriesgo:.0f}/100 — {nivel_riesgo}</span></div>', unsafe_allow_html=True)
        st.progress(iriesgo / 100)
    else:
        st.info("Pulsa 'Sincronizar' para obtener datos en tiempo real.")
"""
        out.append(controls_str)
        out.append('\nwith col_main:\n')
        
        # skip lines until "# ─── Tabs principales"
        while i < len(lines) and not lines[i].startswith("# ─── Tabs principales"):
            i += 1
            
        continue
    
    if line.startswith("# ─── Tabs principales"):
        # We start indenting everything by 4 spaces
        pass

    # If we are past the tabs marker, indent by 4 spaces
    if any("# ─── Tabs principales" in l for l in lines[:i]):
        if line == "\n":
            out.append("\n")
        else:
            out.append("    " + line)
    else:
        if "with col_main:" not in out[-1:]:
            out.append(line)
        
    i += 1

with open(FILE_PATH, "w", encoding="utf-8") as f:
    f.writelines(out)

print("Refactor complete.")
