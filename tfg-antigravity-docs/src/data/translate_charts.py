import re
import json

translations = {
    "Precios de desvíos y restricciones técnicas en tiempo real": "Prezzi delle deviazioni e restrizioni tecniche in tempo reale",
    "Demanda Peninsular": "Domanda Peninsulare",
    "Capacidades de transferencia previstas en las interconexiones": "Capacità di trasferimento previste nelle interconnessioni",
    "España–Francia y España–Portugal, abril 2025 (MW y €/MWh)": "Spagna–Francia e Spagna–Portogallo, aprile 2025 (MW e €/MWh)",
    "27–29 de abril de 2025": "27–29 aprile 2025",
    "España, enero–diciembre 2025 (€)": "Spagna, gennaio–dicembre 2025 (€)",
    "¿Qué se esperaba que consumiera el sistema y qué ocurrió realmente?": "Cosa ci si aspettava che consumasse il sistema e cosa è realmente accaduto?",
    "¿Cómo perdió el operador el control del sistema y cómo intentó recuperarlo?": "Come ha perso l'operatore il controllo del sistema e come ha tentato di recuperarlo?",
    "Interconexiones y Flujos": "Interconnessioni e Flussi",
    "MWh por semana": "MWh a settimana",
    "Balance, Estabilidad y Respuesta": "Bilancio, Stabilità e Risposta",
    "Volumen de desequilibrio entre generación y demanda — España": "Volume di squilibrio tra generazione e domanda — Spagna",
    "¿Qué podía generar el sistema, qué estaba generando y por qué tecnología?": "Cosa poteva generare il sistema, cosa stava generando e con quale tecnologia?",
    "Potencia Disponible por Tecnología": "Potenza Disponibile per Tecnologia",
    "Evolución de la demanda eléctrica en España — 28 y 29 de abril de 2025": "Evoluzione della domanda elettrica in Spagna — 28 e 29 aprile 2025",
    "Segunda oscilación": "Seconda oscillazione",
    "Installed Capacity per Type": "Capacità Installata per Tipo",
    "Precio Final Desglosado": "Prezzo Finale Dettagliato",
    "28–29 de abril de 2025 (MWh cada 15 minutos)": "28–29 aprile 2025 (MWh ogni 15 minuti)",
    "Imbalance Prices": "Prezzi di Squilibrio",
    "España con Francia, Portugal, Marruecos y Andorra · 28–29 de abril de 2025 (MW/h)": "Spagna con Francia, Portogallo, Marocco e Andorra · 28–29 aprile 2025 (MW/h)",
    "Forecast Transfer Capacities": "Capacità di Trasferimento Previste",
    "28–29 de abril de 2025, €/MWh": "28–29 aprile 2025, €/MWh",
    "Otros Indicadores — CO₂ + Renovables": "Altri Indicatori — CO₂ + Rinnovabili",
    "Saldos por Frontera (P48)": "Saldi per Frontiera (P48)",
    "Demanda real frente a previsión day-ahead — España y Portugal": "Domanda reale rispetto alla previsione day-ahead — Spagna e Portogallo",
    "28–29 de abril de 2025 (€/MWh)": "28–29 aprile 2025 (€/MWh)",
    "2025 (MW) — Iberian Peninsula": "2025 (MW) — Penisola Iberica",
    "Islandización ibérica": "Isolamento iberico",
    "Cross-Border Physical Flows": "Flussi Fisici Transfrontalieri",
    "Comparativa de precios eléctricos — Mercado SPOT mayorista vs. PVPC 2.0TD": "Confronto dei prezzi elettrici — Mercato SPOT all'ingrosso vs. PVPC 2.0TD",
    "Capacidad instalada del sistema eléctrico peninsular por tipo de tecnología": "Capacità installata del sistema elettrico peninsulare per tipo di tecnologia",
    "CTA|ES y CTA|PT · 28–29 de abril de 2025 · MTU horario": "CTA|ES e CTA|PT · 28–29 aprile 2025 · MTU orario",
    "Evolución del desequilibrio eléctrico (imbalance) — España": "Evoluzione dello squilibrio elettrico (imbalance) — Spagna",
    "¿Cómo se comportaron las fronteras eléctricas antes, durante y después del apagón?": "Come si sono comportate le frontiere elettriche prima, durante e dopo il blackout?",
    "España — 2025 (MW por trimestre)": "Spagna — 2025 (MW per trimestre)",
    "Imbalance — Volumen MW": "Squilibrio — Volume MW",
    "Generación libre de CO₂ (%)": "Generazione priva di CO₂ (%)",
    "Energy Prices — Europa": "Prezzi dell'Energia — Europa",
    "Actual Generation per Unit": "Generazione Effettiva per Unità",
    "Pérdida de sincronismo": "Perdita di sincronismo",
    "Generación y Capacidad": "Generazione e Capacità",
    "Precios de los desvíos de balance — España": "Prezzi delle deviazioni di bilancio — Spagna",
    "Saldos netos de intercambio programados (P48)": "Saldi netti di scambio programmati (P48)",
    "España–Francia y España–Portugal · 28–29 de abril de 2025 (MW)": "Spagna–Francia e Spagna–Portogallo · 28–29 aprile 2025 (MW)",
    "Saldos Horarios por Frontera (28-29 Abril)": "Saldi Orari per Frontiera (28-29 Aprile)",
    "España con Francia y Portugal · 28 de abril de 2025 (MW, resolución 15 min)": "Spagna con Francia e Portogallo · 28 aprile 2025 (MW, risoluzione 15 min)",
    "Madrugada del 28 y 29 de abril de 2025 (MW)": "Prime ore del 28 e 29 aprile 2025 (MW)",
    "Precios day-ahead del mercado mayorista ibérico (OMIE)": "Prezzi day-ahead del mercato all'ingrosso iberico (OMIE)",
    "Mercados y Precios — SPOT vs PVPC": "Mercati e Prezzi — SPOT vs PVPC",
    "Precios de Desvíos Tiempo Real (28-29 Abril)": "Prezzi delle Deviazioni in Tempo Reale (28-29 Aprile)",
    "Desconexiones de TSOs y activación de procedimientos de contingencia": "Disconnessioni dei TSO e attivazione delle procedure di contingenza",
    "Desglose de la energía programada en los mercados de producción": "Ripartizione dell'energia programmata nei mercati di produzione",
    "Almacenamiento en embalses y plantas hidroeléctricas — España, 2025": "Stoccaggio in serbatoi e centrali idroelettriche — Spagna, 2025",
    "España, 28 de abril de 2025, hora 00:00 CEST (€/MWh)": "Spagna, 28 aprile 2025, ora 00:00 CEST (€/MWh)",
    "Europa, 28–29 de abril de 2025": "Europa, 28–29 aprile 2025",
    "Precios de Desvíos Tiempo Real": "Prezzi delle Deviazioni in Tempo Reale",
    "España, 28 de abril de 2025 (MWh)": "Spagna, 28 aprile 2025 (MWh)",
    "Comparativa de potencia disponible por tecnología": "Confronto della potenza disponibile per tecnologia",
    "Porcentaje de generación libre de CO₂ y previsiones renovables": "Percentuale di generazione priva di CO₂ e previsioni rinnovabili",
    "Current Balancing State": "Stato di Bilanciamento Attuale",
    "Saldo neto de intercambios comerciales programados": "Saldo netto degli scambi commerciali programmati",
    "Generación real por unidad de producción — Estado del mix durante el colapso": "Generazione reale per unità di produzione — Stato del mix durante il collasso",
    "FRR Capacity — Reservas": "Capacità FRR — Riserve",
    "Demanda Real vs. Programada vs. Prevista · resolución 5 minutos": "Domanda Reale vs. Programmata vs. Prevista · risoluzione 5 minuti",
    "Cost of Congestion Management": "Costo della Gestione delle Congestioni",
    "Fall-backs y Protocolos Emergencia": "Fall-back e Protocolli di Emergenza",
    "Water Reservoirs & Hydro": "Serbatoi d'Acqua & Idroelettrico",
    "28 de abril de 2025 (MW)": "28 aprile 2025 (MW)",
    "Scheduled Commercial Exchanges": "Scambi Commerciali Programmati",
    "Subastas Explícitas de Capacidad": "Aste Esplicite di Capacità",
    "¿Qué señales económicas emitió el sistema antes, durante y después del colapso?": "Quali segnali economici ha emesso il sistema prima, durante e dopo il collasso?",
    "28–29 de abril de 2025 (MWh cada 15 min)": "28–29 aprile 2025 (MWh ogni 15 min)",
    "Pico de déficit": "Picco di deficit",
    "Inicio recuperación": "Inizio recupero",
    "España y Portugal, 28–29 de abril de 2025 (€/MWh)": "Spagna e Portogallo, 28–29 aprile 2025 (€/MWh)",
    "Flujos físicos reales en las interconexiones de España": "Flussi fisici reali nelle interconnessioni della Spagna",
    "Demanda y Sistema": "Domanda e Sistema",
    "Mercados y Precios": "Mercati e Prezzi",
    "Costes mensuales de gestión de congestión (countertrading)": "Costi mensili di gestione delle congestioni (countertrading)",
    "Total Load — ES + PT": "Carico Totale — ES + PT",
    "Capacidad real y prevista de Reserva de Restauración de Frecuencia": "Capacità reale e prevista della Riserva di Ripristino della Frequenza",
    "Primera oscilación": "Prima oscillazione",
    "Subastas explícitas de capacidad de interconexión": "Aste esplicite di capacità di interconnessione",
    "Restauración completa": "Ripristino completo",
    "Programa de Producción": "Programma di Produzione",
    "Componentes del precio final de la electricidad": "Componenti del prezzo finale dell'elettricità",
    "~07:00 (29A)": "~07:00 (29A)",
    "12:03": "12:03",
    "12:19": "12:19",
    "12:33": "12:33",
    "12:35": "12:35",
    "13:45": "13:45",
    "18:15": "18:15"
}

with open(r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\src\data\forensicCharts.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace strings
def replace_str(match):
    key = match.group(1)
    val = match.group(2)
    if val in translations:
        return f"{key}: '{translations[val]}'"
    return match.group(0)

def replace_str_double(match):
    key = match.group(1)
    val = match.group(2)
    if val in translations:
        return f'{key}: "{translations[val]}"'
    return match.group(0)

def replace_str_backtick(match):
    key = match.group(1)
    val = match.group(2)
    if val in translations:
        return f"{key}: `{translations[val]}`"
    return match.group(0)

content = re.sub(r"(title|fullTitle|subtitle|name|label|question):\s*'([^']+)'", replace_str, content)
content = re.sub(r'(title|fullTitle|subtitle|name|label|question):\s*"([^"]+)"', replace_str_double, content)
content = re.sub(r"(title|fullTitle|subtitle|name|label|question):\s*`([^`]+)`", replace_str_backtick, content)

# Now substitute desc with desc_it and rel with rel_it
# The blocks look like:
# desc: `...`,
# rel: `...`,
# desc_en: `...`,
# ...
# desc_it: `...`,
# rel_it: `...`,

# We can find all blocks and replace the `desc: \`...\`` with the content of `desc_it`
# A reliable way is to extract desc_it and rel_it for each object and replace desc and rel.
# Wait, it's safer to just iterate through chart objects.
# We'll use a regex to replace `desc: \`.*?\`,` where the replacement is `desc_it`'s value, if found in the same object.

def replace_desc_and_rel(text):
    # Split by chart objects, roughly
    objects = text.split('id: \'chart-')
    out = [objects[0]]
    for obj in objects[1:]:
        # extract desc_it
        m_desc_it = re.search(r"desc_it:\s*`([\s\S]*?)`,\n", obj)
        if m_desc_it:
            desc_it_content = m_desc_it.group(1)
            # replace desc
            obj = re.sub(r"desc:\s*`[\s\S]*?`,\n", f"desc: `{desc_it_content}`,\n", obj, count=1)
        
        m_rel_it = re.search(r"rel_it:\s*`([\s\S]*?)`,\n", obj)
        if m_rel_it:
            rel_it_content = m_rel_it.group(1)
            # replace rel
            obj = re.sub(r"rel:\s*`[\s\S]*?`,\n", f"rel: `{rel_it_content}`,\n", obj, count=1)
        
        out.append('id: \'chart-' + obj)
    return ''.join(out)

content = replace_desc_and_rel(content)

with open(r'C:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\src\data\forensicCharts_it.js', 'w', encoding='utf-8') as f:
    f.write(content)
