import os

with open("nuevo código dahsboard.txt", "r", encoding="utf-8") as f:
    text = f.read()

parts = text.split("📁 ")

for part in parts[1:]:
    lines = part.split("\n")
    first_line = lines[0]
    
    if "visualizaciones_forenses.py" in first_line:
        filename = "visualizaciones_forenses.py"
    elif "phase2_voltage_analyzer.py" in first_line:
        filename = "phase2_voltage_analyzer.py"
    elif "phase2_timeline.py" in first_line:
        filename = "phase2_timeline.py"
    else:
        continue
        
    code_lines = []
    started = False
    for line in lines[1:]:
        if not started:
            if line.strip() == "python":
                started = True
            continue
        
        # Stop at next emoji or ✅
        if line.startswith("✅"):
            break
            
        code_lines.append(line)
        
    # Write to file
    with open(filename, "w", encoding="utf-8") as out:
        out.write("\n".join(code_lines).strip() + "\n")
        print(f"Written {filename}")

