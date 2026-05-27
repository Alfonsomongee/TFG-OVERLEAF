const fs = require('fs');

const inPath = 'C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts.js';
const outPath = 'C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts_fr.js';

let content = fs.readFileSync(inPath, 'utf8');

const translations = {
  // names
  "Demanda y Sistema": "Demande et Système",
  "Generación y Capacidad": "Production et Capacité",
  "Mercados y Precios": "Marchés et Prix",
  "Interconexiones y Flujos": "Interconnexions et Flux",
  "Balance, Estabilidad y Respuesta": "Équilibre, Stabilité et Réponse",

  // questions
  "¿Qué se esperaba que consumiera el sistema y qué ocurrió realmente?": "Qu'attendait-on que le système consomme et que s'est-il réellement passé ?",
  "¿Qué podía generar el sistema, qué estaba generando y por qué tecnología?": "Que pouvait générer le système, que générait-il et par quelle technologie ?",
  "¿Qué señales económicas emitió el sistema antes, durante y después del colapso?": "Quels signaux économiques le système a-t-il émis avant, pendant et après l'effondrement ?",
  "¿Cómo se comportaron las fronteras eléctricas antes, durante y después del apagón?": "Comment les frontières électriques se sont-elles comportées avant, pendant et après la panne ?",
  "¿Cómo perdió el operador el control del sistema y cómo intentó recuperarlo?": "Comment l'opérateur a-t-il perdu le contrôle du système et comment a-t-il tenté de le récupérer ?",

  // labels
  "Primera oscilación": "Première oscillation",
  "Segunda oscilación": "Deuxième oscillation",
  "Pérdida de sincronismo": "Perte de synchronisme",
  "Islandización ibérica": "Îlotage ibérique",
  "Pico de déficit": "Pic de déficit",
  "Inicio recuperación": "Début de récupération",
  "Restauración completa": "Restauration complète",

  // titles
  "Demanda Peninsular": "Demande Péninsulaire",
  "Demanda Real vs. Programada vs. Prevista · resolución 5 minutos": "Demande Réelle vs Programmée vs Prévue · résolution 5 minutes",
  "Total Load — ES + PT": "Charge Totale — ES + PT",
  "CTA|ES y CTA|PT · 28–29 de abril de 2025 · MTU horario": "CTA|ES et CTA|PT · 28–29 avril 2025 · MTU horaire",
  "Programa de Producción": "Programme de Production",
  "España, 28 de abril de 2025 (MWh)": "Espagne, 28 avril 2025 (MWh)",
  "Potencia Disponible por Tecnología": "Puissance Disponible par Technologie",
  "Madrugada del 28 y 29 de abril de 2025 (MW)": "Nuit du 28 au 29 avril 2025 (MW)",
  "Installed Capacity per Type": "Capacité Installée par Type",
  "2025 (MW) — Iberian Peninsula": "2025 (MW) — Péninsule Ibérique",
  "Actual Generation per Unit": "Production Réelle par Unité",
  "28 de abril de 2025 (MW)": "28 avril 2025 (MW)",
  "Water Reservoirs & Hydro": "Réservoirs d'Eau & Hydraulique",
  "MWh por semana": "MWh par semaine",
  "Otros Indicadores — CO₂ + Renovables": "Autres Indicateurs — CO₂ + Renouvelables",
  "27–29 de abril de 2025": "27–29 avril 2025",
  "Generación libre de CO₂ (%)": "Production sans CO₂ (%)",
  "Mercados y Precios — SPOT vs PVPC": "Marchés et Prix — SPOT vs PVPC",
  "28–29 de abril de 2025, €/MWh": "28–29 avril 2025, €/MWh",
  "Precio Final Desglosado": "Prix Final Détaillé",
  "España, 28 de abril de 2025, hora 00:00 CEST (€/MWh)": "Espagne, 28 avril 2025, heure 00:00 CEST (€/MWh)",
  "Energy Prices — Europa": "Prix de l'Énergie — Europe",
  "España y Portugal, 28–29 de abril de 2025 (€/MWh)": "Espagne et Portugal, 28–29 avril 2025 (€/MWh)",
  "Precios de Desvíos Tiempo Real": "Prix des Écarts en Temps Réel",
  "Precios de Desvíos Tiempo Real (28-29 Abril)": "Prix des Écarts en Temps Réel (28-29 Avril)",
  "Saldos por Frontera (P48)": "Soldes par Frontière (P48)",
  "España con Francia, Portugal, Marruecos y Andorra · 28–29 de abril de 2025 (MW/h)": "Espagne avec la France, le Portugal, le Maroc et l'Andorre · 28–29 avril 2025 (MW/h)",
  "Saldos Horarios por Frontera (28-29 Abril)": "Soldes Horaires par Frontière (28-29 Avril)",
  "Cross-Border Physical Flows": "Flux Physiques Transfrontaliers",
  "España–Francia y España–Portugal · 28–29 de abril de 2025 (MW)": "Espagne–France et Espagne–Portugal · 28–29 avril 2025 (MW)",
  "Scheduled Commercial Exchanges": "Échanges Commerciaux Programmés",
  "España con Francia y Portugal · 28 de abril de 2025 (MW, resolución 15 min)": "Espagne avec la France et le Portugal · 28 avril 2025 (MW, résolution 15 min)",
  "Subastas Explícitas de Capacidad": "Enchères Explicites de Capacité",
  "España–Francia y España–Portugal, abril 2025 (MW y €/MWh)": "Espagne–France et Espagne–Portugal, avril 2025 (MW et €/MWh)",
  "Forecast Transfer Capacities": "Capacités de Transfert Prévues",
  "Current Balancing State": "État d'Équilibre Actuel",
  "28–29 de abril de 2025 (MWh cada 15 minutos)": "28–29 avril 2025 (MWh toutes les 15 minutes)",
  "Imbalance — Volumen MW": "Déséquilibre — Volume MW",
  "28–29 de abril de 2025 (MWh cada 15 min)": "28–29 avril 2025 (MWh toutes les 15 min)",
  "Imbalance Prices": "Prix de Déséquilibre",
  "FRR Capacity — Reservas": "Capacité FRR — Réserves",
  "España — 2025 (MW por trimestre)": "Espagne — 2025 (MW par trimestre)",
  "Cost of Congestion Management": "Coût de Gestion de la Congestion",
  "España, enero–diciembre 2025 (€)": "Espagne, janvier–décembre 2025 (€)",
  "Fall-backs y Protocolos Emergencia": "Solutions de Secours et Protocoles d'Urgence",
  "Europa, 28–29 de abril de 2025": "Europe, 28–29 avril 2025",

  // fullTitles
  "Evolución de la demanda eléctrica en España — 28 y 29 de abril de 2025": "Évolution de la demande électrique en Espagne — 28 et 29 avril 2025",
  "Demanda real frente a previsión day-ahead — España y Portugal": "Demande réelle face aux prévisions day-ahead — Espagne et Portugal",
  "Desglose de la energía programada en los mercados de producción": "Répartition de l'énergie programmée sur les marchés de production",
  "Comparativa de potencia disponible por tecnología": "Comparaison de la puissance disponible par technologie",
  "Capacidad instalada del sistema eléctrico peninsular por tipo de tecnología": "Capacité installée du système électrique péninsulaire par type de technologie",
  "Generación real por unidad de producción — Estado del mix durante el colapso": "Production réelle par unité de production — État du mix pendant l'effondrement",
  "Almacenamiento en embalses y plantas hidroeléctricas — España, 2025": "Stockage dans les réservoirs et centrales hydroélectriques — Espagne, 2025",
  "Porcentaje de generación libre de CO₂ y previsiones renovables": "Pourcentage de production sans CO₂ et prévisions renouvelables",
  "Comparativa de precios eléctricos — Mercado SPOT mayorista vs. PVPC 2.0TD": "Comparaison des prix de l'électricité — Marché SPOT de gros vs PVPC 2.0TD",
  "Componentes del precio final de la electricidad": "Composantes du prix final de l'électricité",
  "Precios day-ahead del mercado mayorista ibérico (OMIE)": "Prix day-ahead du marché de gros ibérique (OMIE)",
  "Precios de desvíos y restricciones técnicas en tiempo real": "Prix des écarts et contraintes techniques en temps réel",
  "Saldos netos de intercambio programados (P48)": "Soldes nets d'échanges programmés (P48)",
  "Flujos físicos reales en las interconexiones de España": "Flux physiques réels sur les interconnexions de l'Espagne",
  "Saldo neto de intercambios comerciales programados": "Solde net des échanges commerciaux programmés",
  "Subastas explícitas de capacidad de interconexión": "Enchères explicites de capacité d'interconnexion",
  "Capacidades de transferencia previstas en las interconexiones": "Capacités de transfert prévues sur les interconnexions",
  "Evolución del desequilibrio eléctrico (imbalance) — España": "Évolution du déséquilibre électrique (imbalance) — Espagne",
  "Volumen de desequilibrio entre generación y demanda — España": "Volume de déséquilibre entre production et demande — Espagne",
  "Precios de los desvíos de balance — España": "Prix des écarts de bilan — Espagne",
  "Capacidad real y prevista de Reserva de Restauración de Frecuencia": "Capacité réelle et prévue de Réserve de Restauration de Fréquence",
  "Costes mensuales de gestión de congestión (countertrading)": "Coûts mensuels de gestion de la congestion (countertrading)",
  "Desconexiones de TSOs y activación de procedimientos de contingencia": "Déconnexions de GRT et activation des procédures de contingence"
};

for (const [es, fr] of Object.entries(translations)) {
  content = content.split("'" + es + "'").join("'" + fr + "'");
  content = content.split('"' + es + '"').join('"' + fr + '"');
  content = content.split('`' + es + '`').join('`' + fr + '`');
}

// Now replace desc and rel with desc_fr and rel_fr values
content = content.replace(/desc:\\s*(\`[\\s\\S]*?\`),/g, (match, p1) => {
  return 'desc: ' + p1 + ',';
}); // wait, this regex doesn't pull from desc_fr.

// A better way: replace desc with desc_fr. 
// Since we have \`desc: \`...\`, ... desc_fr: \`...\`\`, we can parse them.
const chartRegex = /({[^}]*id:\\s*'chart-\\d+'[\\s\\S]*?})/g;

content = content.replace(chartRegex, (chartBody) => {
  let newBody = chartBody;
  
  const descFrMatch = newBody.match(/desc_fr:\s*(`[\s\S]*?`)/);
  if (descFrMatch) {
    // replace desc
    newBody = newBody.replace(/desc:\s*(`[\s\S]*?`)/, 'desc: ' + descFrMatch[1]);
  }

  const relFrMatch = newBody.match(/rel_fr:\s*(`[\s\S]*?`)/);
  if (relFrMatch) {
    // replace rel
    newBody = newBody.replace(/rel:\s*(`[\s\S]*?`)/, 'rel: ' + relFrMatch[1]);
  }

  return newBody;
});

// Optionally remove all desc_en, desc_pt, etc. 
// The prompt says "translating the human-readable text properties", so maybe leave them or remove them. 
// We will just leave them as is, or maybe drop them to make it clean, but I'll leave them to be safe.

fs.writeFileSync(outPath, content);
console.log('Translated file created successfully.');
