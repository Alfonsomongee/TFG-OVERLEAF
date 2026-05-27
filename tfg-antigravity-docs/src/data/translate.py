import re

translations = {
  "Demanda Peninsular": "Procura Peninsular",
  "Total Load — ES + PT": "Carga Total — ES + PT",
  "Programa de Producción": "Programa de Produção",
  "Potencia Disponible por Tecnología": "Potência Disponível por Tecnologia",
  "Installed Capacity per Type": "Capacidade Instalada por Tipo",
  "Actual Generation per Unit": "Geração Real por Unidade",
  "Water Reservoirs & Hydro": "Reservatórios de Água e Hidroelétrica",
  "Otros Indicadores — CO₂ + Renovables": "Outros Indicadores — CO₂ + Renováveis",
  "Generación libre de CO₂ (%)": "Geração livre de CO₂ (%)",
  "Mercados y Precios — SPOT vs PVPC": "Mercados e Preços — SPOT vs PVPC",
  "Precio Final Desglosado": "Preço Final Detalhado",
  "Energy Prices — Europa": "Preços de Energia — Europa",
  "Precios de Desvíos Tiempo Real": "Preços de Desvios em Tempo Real",
  "Precios de Desvíos Tiempo Real (28-29 Abril)": "Preços de Desvios em Tempo Real (28-29 Abril)",
  "Saldos por Frontera (P48)": "Saldos por Fronteira (P48)",
  "Saldos Horarios por Frontera (28-29 Abril)": "Saldos Horários por Fronteira (28-29 Abril)",
  "Cross-Border Physical Flows": "Fluxos Físicos Transfronteiriços",
  "Scheduled Commercial Exchanges": "Intercâmbios Comerciais Programados",
  "Subastas Explícitas de Capacidad": "Leilões Explícitos de Capacidade",
  "Forecast Transfer Capacities": "Capacidades de Transferência Previstas",
  "Current Balancing State": "Estado Atual de Balanceamento",
  "Imbalance — Volumen MW": "Desequilíbrio — Volume MW",
  "Imbalance Prices": "Preços de Desequilíbrio",
  "FRR Capacity — Reservas": "Capacidade FRR — Reservas",
  "Cost of Congestion Management": "Custo de Gestão de Congestionamento",
  "Fall-backs y Protocolos Emergencia": "Fall-backs e Protocolos de Emergência",
  "Evolución de la demanda eléctrica en España — 28 y 29 de abril de 2025": "Evolução da procura de eletricidade em Espanha — 28 e 29 de abril de 2025",
  "Demanda real frente a previsión day-ahead — España y Portugal": "Procura real face à previsão day-ahead — Espanha e Portugal",
  "Desglose de la energía programada en los mercados de producción": "Repartição da energia programada nos mercados de produção",
  "Comparativa de potencia disponible por tecnología": "Comparação de potência disponível por tecnologia",
  "Capacidad instalada del sistema eléctrico peninsular por tipo de tecnología": "Capacidade instalada do sistema elétrico peninsular por tipo de tecnologia",
  "Generación real por unidad de producción — Estado del mix durante el colapso": "Geração real por unidade de produção — Estado do mix durante o colapso",
  "Almacenamiento en embalses y plantas hidroeléctricas — España, 2025": "Armazenamento em albufeiras e centrais hidroelétricas — Espanha, 2025",
  "Porcentaje de generación libre de CO₂ y previsiones renovables": "Percentagem de geração livre de CO₂ e previsões renováveis",
  "Comparativa de precios eléctricos — Mercado SPOT mayorista vs. PVPC 2.0TD": "Comparação de preços de eletricidade — Mercado grossista SPOT vs. PVPC 2.0TD",
  "Componentes del precio final de la electricidad": "Componentes do preço final da eletricidade",
  "Precios day-ahead del mercado mayorista ibérico (OMIE)": "Preços day-ahead do mercado grossista ibérico (OMIE)",
  "Precios de desvíos y restricciones técnicas en tiempo real": "Preços de desvios e restrições técnicas em tempo real",
  "Saldos netos de intercambio programados (P48)": "Saldos líquidos de intercâmbio programados (P48)",
  "Flujos físicos reales en las interconexiones de España": "Fluxos físicos reais nas interconexões de Espanha",
  "Saldo neto de intercambios comerciales programados": "Saldo líquido de intercâmbios comerciais programados",
  "Subastas explícitas de capacidad de interconexión": "Leilões explícitos de capacidade de interconexão",
  "Capacidades de transferencia previstas en las interconexiones": "Capacidades de transferência previstas nas interconexões",
  "Evolución del desequilibrio eléctrico (imbalance) — España": "Evolução do desequilíbrio elétrico (imbalance) — Espanha",
  "Volumen de desequilibrio entre generación y demanda — España": "Volume de desequilíbrio entre geração e procura — Espanha",
  "Precios de los desvíos de balance — España": "Preços dos desvios de balanceamento — Espanha",
  "Capacidad real y prevista de Reserva de Restauración de Frecuencia": "Capacidade real e prevista de Reserva de Restauração de Frequência",
  "Costes mensuales de gestión de congestión (countertrading)": "Custos mensais de gestão de congestionamento (countertrading)",
  "Desconexiones de TSOs y activación de procedimientos de contingencia": "Desconexões de TSOs e ativação de procedimentos de contingência",
  "Demanda Real vs. Programada vs. Prevista · resolución 5 minutos": "Procura Real vs. Programada vs. Prevista · resolução de 5 minutos",
  "CTA|ES y CTA|PT · 28–29 de abril de 2025 · MTU horario": "CTA|ES e CTA|PT · 28–29 de abril de 2025 · MTU horário",
  "España, 28 de abril de 2025 (MWh)": "Espanha, 28 de abril de 2025 (MWh)",
  "Madrugada del 28 y 29 de abril de 2025 (MW)": "Madrugada de 28 e 29 de abril de 2025 (MW)",
  "2025 (MW) — Iberian Peninsula": "2025 (MW) — Península Ibérica",
  "28 de abril de 2025 (MW)": "28 de abril de 2025 (MW)",
  "MWh por semana": "MWh por semana",
  "27–29 de abril de 2025": "27–29 de abril de 2025",
  "28–29 de abril de 2025, €/MWh": "28–29 de abril de 2025, €/MWh",
  "España, 28 de abril de 2025, hora 00:00 CEST (€/MWh)": "Espanha, 28 de abril de 2025, hora 00:00 CEST (€/MWh)",
  "España y Portugal, 28–29 de abril de 2025 (€/MWh)": "Espanha e Portugal, 28–29 de abril de 2025 (€/MWh)",
  "28–29 de abril de 2025 (€/MWh)": "28–29 de abril de 2025 (€/MWh)",
  "España con Francia, Portugal, Marruecos y Andorra · 28–29 de abril de 2025 (MW/h)": "Espanha com França, Portugal, Marrocos e Andorra · 28–29 de abril de 2025 (MW/h)",
  "España–Francia y España–Portugal · 28–29 de abril de 2025 (MW)": "Espanha–França e Espanha–Portugal · 28–29 de abril de 2025 (MW)",
  "España con Francia y Portugal · 28 de abril de 2025 (MW, resolución 15 min)": "Espanha com França e Portugal · 28 de abril de 2025 (MW, resolução 15 min)",
  "España–Francia y España–Portugal, abril 2025 (MW y €/MWh)": "Espanha–França e Espanha–Portugal, abril de 2025 (MW e €/MWh)",
  "28–29 de abril de 2025 (MWh cada 15 minutos)": "28–29 de abril de 2025 (MWh a cada 15 minutos)",
  "28–29 de abril de 2025 (MWh cada 15 min)": "28–29 de abril de 2025 (MWh a cada 15 min)",
  "España — 2025 (MW por trimestre)": "Espanha — 2025 (MW por trimestre)",
  "España, enero–diciembre 2025 (€)": "Espanha, janeiro–dezembro de 2025 (€)",
  "Europa, 28–29 de abril de 2025": "Europa, 28–29 de abril de 2025",
  "Demanda y Sistema": "Procura e Sistema",
  "Generación y Capacidad": "Geração e Capacidade",
  "Mercados y Precios": "Mercados e Preços",
  "Interconexiones y Flujos": "Interconexões e Fluxos",
  "Balance, Estabilidad y Respuesta": "Balanço, Estabilidade e Resposta",
  "¿Qué se esperaba que consumiera el sistema y qué ocurrió realmente?": "O que se esperava que o sistema consumisse e o que aconteceu realmente?",
  "¿Qué podía generar el sistema, qué estaba generando y por qué tecnología?": "O que podia o sistema gerar, o que estava a gerar e por qual tecnologia?",
  "¿Qué señales económicas emitió el sistema antes, durante y después del colapso?": "Que sinais económicos emitiu o sistema antes, durante e depois do colapso?",
  "¿Cómo se comportaron las fronteras eléctricas antes, durante y después del apagón?": "Como se comportaram as fronteiras elétricas antes, durante e depois do apagão?",
  "¿Cómo perdió el operador el control del sistema y cómo intentó recuperarlo?": "Como o operador perdeu o controlo do sistema e como tentou recuperá-lo?",
  "Primera oscilación": "Primeira oscilação",
  "Segunda oscilación": "Segunda oscilação",
  "Pérdida de sincronismo": "Perda de sincronismo",
  "Islandización ibérica": "Isolamento ibérico",
  "Pico de déficit": "Pico de défice",
  "Inicio recuperación": "Início da recuperação",
  "Restauración completa": "Restauração completa"
}

def translate_file():
    with open('forensicCharts.js', 'r', encoding='utf-8') as f:
        text = f.read()

    # Apply translations for single string values
    for k, v in translations.items():
        # Look for the exact string surrounded by single quotes
        pattern = r"'" + re.escape(k) + r"'"
        replacement = r"'" + v + r"'"
        text = re.sub(pattern, replacement, text)

    # Process chart blocks
    # We want to replace desc: ... and rel: ... with desc_pt: ... and rel_pt: ...
    # And delete the other language variants.
    
    # We can use a regex to capture each chart block and modify it
    def process_chart(match):
        chart_text = match.group(0)
        
        # extract desc_pt and rel_pt
        desc_pt_match = re.search(r"desc_pt:\s*`([\s\S]*?)`,", chart_text)
        rel_pt_match = re.search(r"rel_pt:\s*`([\s\S]*?)`,", chart_text)
        
        if desc_pt_match and rel_pt_match:
            desc_pt_content = desc_pt_match.group(1)
            rel_pt_content = rel_pt_match.group(1)
            
            # replace desc and rel
            chart_text = re.sub(r"desc:\s*`[\s\S]*?`,", "desc: `" + desc_pt_content + "`,", chart_text, count=1)
            chart_text = re.sub(r"rel:\s*`[\s\S]*?`,", "rel: `" + rel_pt_content + "`,", chart_text, count=1)
            
            # delete desc_en, rel_en, desc_pt, rel_pt, desc_fr, rel_fr, desc_it, rel_it, desc_de, rel_de
            languages = ['en', 'pt', 'fr', 'it', 'de']
            for lang in languages:
                chart_text = re.sub(r"desc_" + lang + r":\s*`[\s\S]*?`,\n?", "", chart_text)
                chart_text = re.sub(r"rel_" + lang + r":\s*`[\s\S]*?`,\n?", "", chart_text)
                
            return chart_text
        return chart_text

    text = re.sub(r"\{\s*id:\s*'chart-\d+'[\s\S]*?^\s*\},?", process_chart, text, flags=re.MULTILINE)

    with open('forensicCharts_pt.js', 'w', encoding='utf-8') as f:
        f.write(text)

if __name__ == '__main__':
    translate_file()
