import re

file_path = "C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\DASHBOARD\\visualizaciones_forenses.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix 1: Sismógrafo (add_vline)
content = content.replace('''    fig.add_vline(
        x=T_COLAPSO_STR,
        line=dict(color=C_28A, width=2, dash="dash"),
        annotation_text="? COLAPSO 12:33h",
        annotation_position="top",
        annotation_font=dict(color=C_28A, size=11, family="monospace"),
    )''', '''    fig.add_vline(
        x=T_COLAPSO_STR,
        line=dict(color=C_28A, width=2, dash="dash"),
    )
    fig.add_annotation(
        x=T_COLAPSO_STR, y=1, yref="paper",
        text="? COLAPSO 12:33h", showarrow=False,
        font=dict(color=C_28A, size=11, family="monospace"),
        xanchor="right", yanchor="bottom"
    )''')

# Fix 2: Precipicio de demanda (add_vrect COLAPSO)
content = content.replace('''    fig.add_vrect(
        x0=T_COLAPSO_STR,
        x1=str(T_COLAPSO_DT + timedelta(minutes=37)),
        fillcolor="rgba(231,76,60,0.12)",
        layer="below",
        line_width=0,
        annotation_text="COLAPSO",
        annotation_position="top left",
        annotation_font=dict(color=C_28A, size=11, family="monospace"),
    )''', '''    fig.add_vrect(
        x0=T_COLAPSO_STR,
        x1=str(T_COLAPSO_DT + timedelta(minutes=37)),
        fillcolor="rgba(231,76,60,0.12)",
        layer="below",
        line_width=0,
    )
    fig.add_annotation(
        x=T_COLAPSO_STR, y=1, yref="paper",
        text="COLAPSO", showarrow=False,
        font=dict(color=C_28A, size=11, family="monospace"),
        xanchor="left", yanchor="bottom"
    )''')

# Fix 3: Precipicio de demanda (add_vrect BLACK START)
content = content.replace('''    fig.add_vrect(
        x0=str(T_COLAPSO_DT + timedelta(minutes=37)),
        x1=str(T_COLAPSO_DT + timedelta(hours=2)),
        fillcolor="rgba(243,156,18,0.07)",
        layer="below",
        line_width=0,
        annotation_text="BLACK START",
        annotation_position="top left",
        annotation_font=dict(color=C_AMBAR, size=10),
    )''', '''    fig.add_vrect(
        x0=str(T_COLAPSO_DT + timedelta(minutes=37)),
        x1=str(T_COLAPSO_DT + timedelta(hours=2)),
        fillcolor="rgba(243,156,18,0.07)",
        layer="below",
        line_width=0,
    )
    fig.add_annotation(
        x=str(T_COLAPSO_DT + timedelta(minutes=37)), y=1, yref="paper",
        text="BLACK START", showarrow=False,
        font=dict(color=C_AMBAR, size=10),
        xanchor="left", yanchor="bottom"
    )''')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("visualizaciones_forenses.py fixed")
