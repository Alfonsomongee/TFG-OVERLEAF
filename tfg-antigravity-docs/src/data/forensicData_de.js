export const interconnectionsData = [
  { frontera: "Frankreich", flujoMW: 1000, direccion: "Export", tecnologia: "HVDC/AC", estado: "Hohe AC-Last; HVDC fest" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Export", tecnologia: "Synchrone AC", estado: "Massiver Fluss" },
  { frontera: "Marokko", flujoMW: 800, direccion: "Export", tecnologia: "AC-Seekabel", estado: "Konstant nach Plan" }
];

export const energyMixData = [
  { tecnologia: "Solar", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Netzfolgend", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Wasserkraft", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Synchron", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Windkraft", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Netzfolgend", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Kernkraft", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Synchron", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Kraft-Wärme-Kopplung", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Hybrid", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "GuD-Kraftwerk", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Synchron", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Kohle", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Synchron", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Auslösung Transformator Granada wegen Überspannung 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Spannungserhöhung durch kapazitives lastfreies Netz." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Auslösung Umspannwerke Badajoz (730 MW Solar CSP und PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Auslösung Umspannwerk Sevilla (550 MW). Bilanz bricht zusammen." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Kaskade durch Überschreitung der High Voltage Ride-Through-Grenzwerte." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Verlust der iberischen Synchronität. Freier Fall der Frequenz." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Auslösung von Wechselrichtern durch interne empfindliche RoCoF-Relais." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Öffnung der AC-Verbindungsleitungen Frankreich bei 48.46 Hz (Isolation)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Aktivierung des UFLS-Schemas wirft 5 GW Pumpspeicher ab. Kritischer RoCoF." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Sekundärer Lastabwurf von 5 GW im Verteilnetz. Unzureichend aufgrund geringer Trägheit." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "Kernkraft-SCRAM. HVDC-Auslösung. Absoluter elektrischer Nullpunkt." }
];

export const rocofData = [
  { fase: "Beginn der Störung", tiempoS: 0, rocof: -0.015, mecanismo: "Primärregelung FCR", fallo: "MW-Reserve erschöpft" },
  { fase: "Mittlere Kaskade", tiempoS: 21, rocof: -0.250, mecanismo: "Trägheitswiderstand", fallo: "Lücke übersteigt rotierende Kapazität" },
  { fase: "Verlust der Synchronität", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Wechselrichter trennen sich automatisch" },
  { fase: "Elektrische Insel", tiempoS: 24, rocof: -0.850, mecanismo: "Trennung der Verbindungsleitungen", fallo: "Europa entfernt letzten Anker" },
  { fase: "Lastabwurf 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Pumpspeicher 5GW", fallo: "ms-Verzögerung gegenüber beschleunigtem Fall" },
  { fase: "Lastabwurf 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Zivil 5GW", fallo: "Unfähigkeit, Gradienten auszugleichen" }
];
