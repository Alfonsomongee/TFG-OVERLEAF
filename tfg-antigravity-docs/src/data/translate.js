const fs = require('fs');

try {
  let content = fs.readFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts.js', 'utf8');

  // 1. Replace categories and timeline
  const simpleTranslations = {
    // CATEGORIES
    "'Demanda y Sistema'": "'Nachfrage und System'",
    "'¿Qué se esperaba que consumiera el sistema y qué ocurrió realmente?'": "'Was wurde vom System erwartet und was geschah wirklich?'",
    "'Generación y Capacidad'": "'Erzeugung und Kapazität'",
    "'¿Qué podía generar el sistema, qué estaba generando y por qué tecnología?'": "'Was konnte das System erzeugen, was erzeugte es und mit welcher Technologie?'",
    "'Mercados y Precios'": "'Märkte und Preise'",
    "'¿Qué señales económicas emitió el sistema antes, durante y después del colapso?'": "'Welche wirtschaftlichen Signale sendete das System vor, während und nach dem Zusammenbruch?'",
    "'Interconexiones y Flujos'": "'Verbindungen und Flüsse'",
    "'¿Cómo se comportaron las fronteras eléctricas antes, durante y después del apagón?'": "'Wie verhielten sich die Stromgrenzen vor, während und nach dem Stromausfall?'",
    "'Balance, Estabilidad y Respuesta'": "'Gleichgewicht, Stabilität und Reaktion'",
    "'¿Cómo perdió el operador el control del sistema y cómo intentó recuperarlo?'": "'Wie verlor der Betreiber die Kontrolle über das System und wie versuchte er, sie wiederzuerlangen?'",

    // TIMELINE_MARKERS
    "'Primera oscilación'": "'Erste Schwingung'",
    "'Segunda oscilación'": "'Zweite Schwingung'",
    "'Pérdida de sincronismo'": "'Verlust der Synchronität'",
    "'Islandización ibérica'": "'Iberische Inselbildung'",
    "'Pico de déficit'": "'Spitze des Defizits'",
    "'Inicio recuperación'": "'Beginn der Erholung'",
    "'Restauración completa'": "'Vollständige Wiederherstellung'",

    // Titles and strings
    "'Demanda Peninsular'": "'Nachfrage der Halbinsel'",
    "'Evolución de la demanda eléctrica en España — 28 y 29 de abril de 2025'": "'Entwicklung der Stromnachfrage in Spanien — 28. und 29. April 2025'",
    "'Demanda Real vs. Programada vs. Prevista · resolución 5 minutos'": "'Reale Nachfrage vs. Geplant vs. Prognostiziert · 5-Minuten-Auflösung'",

    "'Total Load — ES + PT'": "'Gesamtlast — ES + PT'",
    "'Demanda real frente a previsión day-ahead — España y Portugal'": "'Reale Nachfrage im Vergleich zur Day-Ahead-Prognose — Spanien und Portugal'",
    "'CTA|ES y CTA|PT · 28–29 de abril de 2025 · MTU horario'": "'CTA|ES und CTA|PT · 28.–29. April 2025 · Stündliche MTU'",

    "'Programa de Producción'": "'Produktionsprogramm'",
    "'Desglose de la energía programada en los mercados de producción'": "'Aufschlüsselung der in den Produktionsmärkten geplanten Energie'",
    "'España, 28 de abril de 2025 (MWh)'": "'Spanien, 28. April 2025 (MWh)'",

    "'Potencia Disponible por Tecnología'": "'Verfügbare Leistung nach Technologie'",
    "'Comparativa de potencia disponible por tecnología'": "'Vergleich der verfügbaren Leistung nach Technologie'",
    "'Madrugada del 28 y 29 de abril de 2025 (MW)'": "'Frühe Morgenstunden 28. und 29. April 2025 (MW)'",

    "'Installed Capacity per Type'": "'Installierte Kapazität nach Typ'",
    "'Capacidad instalada del sistema eléctrico peninsular por tipo de tecnología'": "'Installierte Kapazität des iberischen Stromsystems nach Technologie'",
    "'2025 (MW) — Iberian Peninsula'": "'2025 (MW) — Iberische Halbinsel'",

    "'Generación Real por Tecnología'": "'Reale Erzeugung nach Technologie'",
    "'Generación eléctrica en España por tecnología'": "'Stromerzeugung in Spanien nach Technologie'",
    "'Días 28 y 29 de abril de 2025 — Península (MW)'": "'28. und 29. April 2025 — Halbinsel (MW)'",

    "'Precios SPOT y Desacoplamiento'": "'SPOT-Preise und Entkopplung'",
    "'Evolución del precio en el mercado diario (Day-Ahead)'": "'Preis-Entwicklung im Day-Ahead-Markt'",
    "'España (MIBEL) frente a Francia y Alemania — Abril 2025 (€/MWh)'": "'Spanien (MIBEL) im Vergleich zu Frankreich und Deutschland — April 2025 (€/MWh)'",

    "'Precios Intradiarios y Restricciones'": "'Intraday-Preise und Einschränkungen'",
    "'Evolución de los mercados intradiarios y servicios de ajuste'": "'Entwicklung der Intraday-Märkte und Anpassungsdienste'",
    "'España, 28 de abril de 2025 (€/MWh)'": "'Spanien, 28. April 2025 (€/MWh)'",

    "'Coste de Restricciones Fase I'": "'Kosten der Phase-I-Einschränkungen'",
    "'Coste horario del proceso de solución de restricciones técnicas (PBF)'": "'Stündliche Kosten des technischen Einschränkungslösungsprozesses (PBF)'",

    "'Energía y Coste RR/mFRR'": "'Energie und Kosten RR/mFRR'",
    "'Energía asignada y precio de las reservas de sustitución y terciaria'": "'Zugelassene Energie und Preis der Ersatz- und Tertiärreserven'",
    "'España — Abril 2025 (MW y €/MWh)'": "'Spanien — April 2025 (MW und €/MWh)'",

    "'Margen de Reserva y Precios'": "'Reserve-Marge und Preise'",
    "'Correlación entre el margen de reserva operativa y los precios de mercado'": "'Korrelation zwischen operativer Reserve-Marge und Marktpreisen'",
    "'Península Ibérica — 2025'": "'Iberische Halbinsel — 2025'",

    "'Rentas de Congestión PBF'": "'PBF-Engpasserlöse'",
    "'Evolución de las rentas de congestión en el proceso básico de facturación'": "'Entwicklung der Engpasserlöse im grundlegenden Abrechnungsprozess'",

    "'Saldos por Frontera (P48)'": "'Salden nach Grenze (P48)'",
    "'Saldos netos de intercambio programados (P48)'": "'Geplante Netto-Austauschsalden (P48)'",
    "'España con Francia, Portugal, Marruecos y Andorra — 28-29 de abril de 2025 (MW/h)'": "'Spanien mit Frankreich, Portugal, Marokko und Andorra — 28.-29. April 2025 (MW/h)'",

    "'Cross-Border Physical Flows'": "'Grenzüberschreitende physische Flüsse'",
    "'Flujos físicos reales en las interconexiones de España'": "'Tatsächliche physische Flüsse auf den spanischen Verbindungsleitungen'",
    "'España-Francia y España-Portugal — 28-29 de abril de 2025 (MW)'": "'Spanien-Frankreich und Spanien-Portugal — 28.-29. April 2025 (MW)'",

    "'Scheduled Commercial Exchanges'": "'Geplante kommerzielle Austausche'",
    "'Saldo neto de intercambios comerciales programados'": "'Netto-Saldo der geplanten kommerziellen Austausche'",
    "'España con Francia y Portugal — 28 de abril de 2025 (MW, resolución 15 min)'": "'Spanien mit Frankreich und Portugal — 28. April 2025 (MW, 15-Min.-Auflösung)'",

    "'Subastas Explícitas de Capacidad'": "'Explizite Kapazitätsauktionen'",
    "'Subastas explícitas de capacidad de interconexión'": "'Explizite Auktionen der Verbindungskapazität'",
    "'España-Francia y España-Portugal, abril 2025 (MW y €/MWh)'": "'Spanien-Frankreich und Spanien-Portugal, April 2025 (MW und €/MWh)'",

    "'Forecast Transfer Capacities'": "'Prognostizierte Transferkapazitäten'",
    "'Capacidades de transferencia previstas en las interconexiones'": "'Geplante Transferkapazitäten der Verbindungsleitungen'",

    "'Current Balancing State'": "'Aktueller Ausgleichszustand'",
    "'Evolución del desequilibrio eléctrico (imbalance) - España'": "'Entwicklung des elektrischen Ungleichgewichts (Imbalance) - Spanien'",
    "'28-29 de abril de 2025 (MWh cada 15 minutos)'": "'28.-29. April 2025 (MWh alle 15 Minuten)'",

    "'Imbalance - Volumen MW'": "'Imbalance - Volumen MW'",
    "'Volumen de desequilibrio entre generación y demanda - España'": "'Volumen des Ungleichgewichts zwischen Erzeugung und Nachfrage - Spanien'",
    "'28-29 de abril de 2025 (MWh cada 15 min)'": "'28.-29. April 2025 (MWh alle 15 Min)'",

    "'Imbalance Prices'": "'Ausgleichspreise'",
    "'Precios de los desvíos de balance - España'": "'Preise für Bilanzabweichungen - Spanien'",
    "'28-29 de abril de 2025 (€/MWh)'": "'28.-29. April 2025 (€/MWh)'",

    "'FRR Capacity — Reservas'": "'FRR-Kapazität — Reserven'",
    "'Capacidad real y prevista de Reserva de Restauración de Frecuencia'": "'Tatsächliche und geplante Frequency Restoration Reserve (FRR)-Kapazität'",
    "'España — 2025 (MW por trimestre)'": "'Spanien — 2025 (MW pro Quartal)'",

    "'Cost of Congestion Management'": "'Kosten des Engpassmanagements'",
    "'Costes mensuales de gestión de congestión (countertrading)'": "'Monatliche Kosten für das Engpassmanagement (Countertrading)'",
    "'España, enero–diciembre 2025 (€)'": "'Spanien, Januar–Dezember 2025 (€)'",

    "'Fall-backs y Protocolos Emergencia'": "'Fall-backs und Notfallprotokolle'",
    "'Desconexiones de TSOs y activación de procedimientos de contingencia'": "'Abschaltungen von TSOs und Aktivierung von Notfallverfahren'",
    "'Europa, 28–29 de abril de 2025'": "'Europa, 28.–29. April 2025'"
  };

  for (const [es, de] of Object.entries(simpleTranslations)) {
    content = content.split(es).join(de);
  }

  // Handle some differences in quotes / spacing just in case
  const moreTranslations = {
    "'España con Francia y Portugal — 28 de abril de 2025 (MW, resolución 15 min)'": "'Spanien mit Frankreich und Portugal — 28. April 2025 (MW, 15-Min.-Auflösung)'",
  };
  for (const [es, de] of Object.entries(moreTranslations)) {
    content = content.split(es).join(de);
  }

  // 2. Replace desc and rel with desc_de and rel_de
  const chartsSplit = content.split('id: \'chart-');
  for (let i = 1; i < chartsSplit.length; i++) {
    let chunk = chartsSplit[i];
    
    // Extract desc_de
    const descDeMatch = chunk.match(/desc_de:\s*`([\s\S]*?)`/);
    if (descDeMatch) {
      const descDeText = descDeMatch[1];
      chunk = chunk.replace(/desc:\s*`[\s\S]*?`,\s*rel:/, `desc: \`${descDeText}\`,\n    rel:`);
    }
    
    // Extract rel_de
    const relDeMatch = chunk.match(/rel_de:\s*`([\s\S]*?)`/);
    if (relDeMatch) {
      const relDeText = relDeMatch[1];
      chunk = chunk.replace(/rel:\s*`[\s\S]*?`,\s*desc_en:/, `rel: \`${relDeText}\`,\n    desc_en:`);
    }
    
    chartsSplit[i] = chunk;
  }

  content = chartsSplit.join('id: \'chart-');

  fs.writeFileSync('C:\\Users\\aphmo\\Proyectos\\TFG OVERLEAF\\tfg-antigravity-docs\\src\\data\\forensicCharts_de.js', content, 'utf8');
  console.log('Successfully wrote forensicCharts_de.js');
} catch (error) {
  console.error('Error:', error);
}
