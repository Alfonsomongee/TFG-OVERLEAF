import os
import re

I18N_DIR = r"c:\Users\aphmo\Proyectos\TFG OVERLEAF\tfg-antigravity-docs\i18n"

tables = {
    'en': """<ForensicTable
  title="TABLE 13 | VoLL ESTIMATES BY SECTOR"
  source="Own elaboration (VoLL model)"
>

| Macroeconomic Sector | Estimated VoLL Range (€/kWh) | Marginal Sensitivity to Disruption | Second-Order Impact (*Ripple Effects*) on the Economy |
| :--- | :--- | :--- | :--- |
| **Residential / Domestic** | 5.00 - 45.00 | Low-Medium (Increases exponentially with duration) | Loss of thermal comfort, deterioration of perishable inventories, massive disruption of labor productivity due to the drop in telecommuting and communications. |
| **Services / Retail Trade** | 15.00 - 90.00 | Medium-High (Extreme sensitivity during daytime hours) | Forced closure of commercial establishments, absolute paralysis of payment gateways and POS terminals, logistical and data server collapse in the tertiary sector. |
| **Industrial (General Manufacturing)** | 50.00 - 250.00 | Very High (Chain processes) | Supply shortages in production lines, loss of raw materials due to non-sequenced stops, damage to capital equipment due to voltage transients, and breakdown of Just-in-Time supply chains. |

</ForensicTable>""",
    
    'de': """<ForensicTable 
    title="TABLA 13 | VoLL ESTIMATES BY SECTOR"
    source="Elaboración propia (modelo VoLL)"
  >

| Makroökonomischer Sektor | Geschätzter VoLL-Bereich (€/kWh) | Marginale Sensibilität für Unterbrechungen | Effekte zweiter Ordnung (*Ripple Effects*) in der Wirtschaft |
| :--- | :--- | :--- | :--- |
| **Wohnbereich / Haushalte** | 5,00 - 45,00 | Gering-Mittel (steigt exponentiell mit der Dauer) | Verlust des thermischen Komforts, Verderb von Vorräten, massive Unterbrechung der Arbeitsproduktivität durch Ausfall von Telearbeit und Kommunikation. |
| **Dienstleistungen / Einzelhandel** | 15,00 - 90,00 | Mittel-Hoch (Extreme Sensibilität zu Tageszeiten) | Zwangsweise Schließung von Gewerbebetrieben, völliger Stillstand von Zahlungsgateways und Kartenterminals, logistischer und Datenserver-Kollaps im tertiären Sektor. |
| **Industrie (Allgemeine Fertigung)** | 50,00 - 250,00 | Sehr hoch (Kettenprozesse) | Versorgungsengpässe in Produktionslinien, Verlust von Rohstoffen durch nicht sequenzierte Stopps, Schäden an Investitionsgütern durch Spannungstransienten und Bruch von Just-in-Time-Lieferketten. |

</ForensicTable>""",

    'fr': """<ForensicTable 
    title="TABLA 13 | VoLL ESTIMATES BY SECTOR"
    source="Elaboración propia (modelo VoLL)"
  >

| Secteur Macroéconomique | Plage VoLL Estimée (€/kWh) | Sensibilité Marginale à l'Interruption | Impact de Second Ordre (*Ripple Effects*) sur l'Économie |
| :--- | :--- | :--- | :--- |
| **Résidentiel / Domestique** | 5,00 - 45,00 | Faible-Moyenne (Augmente de façon exponentielle avec la durée) | Perte de confort thermique, détérioration des stocks périssables, interruption massive de la productivité du travail due à la chute du télétravail et des communications. |
| **Services / Commerce de Détail** | 15,00 - 90,00 | Moyenne-Élevée (Sensibilité extrême pendant les heures de jour) | Fermeture forcée des établissements commerciaux, paralysie absolue des passerelles de paiement et des terminaux de paiement, effondrement logistique et des serveurs de données dans le secteur tertiaire. |
| **Industriel (Fabrication Générale)** | 50,00 - 250,00 | Très Élevée (Processus en chaîne) | Pénurie des lignes de production, perte de matières premières due à des arrêts non séquencés, dommages aux équipements causés par des transitoires de tension et rupture des chaînes d'approvisionnement Just-In-Time. |

</ForensicTable>""",

    'it': """<ForensicTable 
    title="TABLA 13 | VoLL ESTIMATES BY SECTOR"
    source="Elaboración propia (modelo VoLL)"
  >

| Settore Macroeconomico | Intervallo VoLL Stimato (€/kWh) | Sensibilità Marginale all'Interruzione | Impatto di Secondo Ordine (*Ripple Effects*) sull'Economia |
| :--- | :--- | :--- | :--- |
| **Residenziale / Domestico** | 5,00 - 45,00 | Bassa-Media (Aumenta esponenzialmente con la durata) | Perdita di benessere termico, deterioramento delle scorte deperibili, massiccia interruzione della produttività lavorativa per il crollo del telelavoro e delle comunicazioni. |
| **Servizi / Commercio al Dettaglio** | 15,00 - 90,00 | Media-Alta (Estrema sensibilità in orari diurni) | Chiusura forzata degli esercizi commerciali, totale paralisi dei gateway di pagamento e dei POS, collasso logistico e dei server di dati nel settore terziario. |
| **Industriale (Manifattura Generale)** | 50,00 - 250,00 | Molto Alta (Processi a catena) | Carenza di approvvigionamento delle linee di produzione, perdita di materie prime per arresti non sequenziati, danni ai beni strumentali per transitori di tensione e rottura delle catene di fornitura Just-In-Time. |

</ForensicTable>""",

    'pt': """<ForensicTable 
    title="TABLA 13 | VoLL ESTIMATES BY SECTOR"
    source="Elaboración propia (modelo VoLL)"
  >

| Setor Macroeconômico | Faixa VoLL Estimada (€/kWh) | Sensibilidade Marginal à Interrupção | Impacto de Segunda Ordem (*Ripple Effects*) na Economia |
| :--- | :--- | :--- | :--- |
| **Residencial / Doméstico** | 5,00 - 45,00 | Baixa-Média (Aumenta exponencialmente com a duração) | Perda de bem-estar térmico, deterioração de inventários perecíveis, interrupção massiva da produtividade laboral devido à queda do teletrabalho e comunicações. |
| **Serviços / Comércio Varejista** | 15,00 - 90,00 | Média-Alta (Sensibilidade extrema em horários diurnos) | Fechamento forçado de estabelecimentos comerciais, paralisação absoluta de gateways de pagamento e terminais de cartão, colapso logístico e de servidores de dados no setor terciário. |
| **Industrial (Manufatura Geral)** | 50,00 - 250,00 | Muito Alta (Processos em cadeia) | Desabastecimento de linhas de produção, perda de matérias-primas por paradas não sequenciadas, danos em bens de equipamento devido a transitórios de tensão e ruptura de cadeias de suprimento Just-In-Time. |

</ForensicTable>"""
}

for lang, table_content in tables.items():
    filepath = os.path.join(I18N_DIR, lang, "docusaurus-plugin-content-docs", "current", "07b-consecuencias-financieras.mdx")
    if not os.path.exists(filepath):
        print(f"Skipping {lang} because path does not exist: {filepath}")
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # 1. Remove EconomicImpactTable import
    # Match various forms of quotes
    content = re.sub(r"import\s+EconomicImpactTable\s+from\s+['\"].*?['\"];?\n?", "", content)
    
    # 2. Replace <EconomicImpactTable /> with the language-specific table
    content = content.replace("<EconomicImpactTable />", table_content)
    
    # 3. Fix the blockquote equation syntax error
    # Look for: > $3.500 \text{ MW} \times 0,86 \text{ M€/MW} \approx 3.010 ...$
    # Replace it with block equation $$ ... $$
    pattern = r">\s*\$3\.500\s*\\text\{\s*MW\s*\}\s*\\times\s*0,86\s*\\text\{\s*M[€E]/MW\s*\}\s*\\approx\s*3\.010\s*\\text\{\s*(?:Millones de Euros|Millionen Euro|Millions d'Euros|Milioni di Euro|Milh(?:õ|o)es de Euros)\s*\}\$"
    match = re.search(pattern, content)
    if match:
        matched_str = match.group(0)
        # Extract the equation text inside $...$
        eq_text = matched_str.split("$")[1]
        replacement = f"\n$$\n{eq_text}\n$$"
        content = content.replace(matched_str, replacement)
        print(f"Fixed equation in {lang}")
    else:
        # Fallback regex if spacing/symbols are slightly different
        fallback_pattern = r">\s*\$(.*?)\$"
        # We only want to match the specific equation
        def replace_fn(m):
            eq = m.group(1)
            if "3.500" in eq and "3.010" in eq:
                return f"\n$$\n{eq}\n$$"
            return m.group(0)
        content, count = re.subn(fallback_pattern, replace_fn, content)
        if count > 0:
            print(f"Fixed equation via fallback in {lang}")
        else:
            print(f"Could not find equation in {lang}")
            
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Successfully processed {lang}")
