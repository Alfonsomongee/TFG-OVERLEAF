export const interconnectionsData = [
  { frontera: "Francia", flujoMW: 1000, direccion: "Esportazione", tecnologia: "HVDC/AC", estado: "Alto carico AC; HVDC fisso" },
  { frontera: "Portogallo", flujoMW: 2000, direccion: "Esportazione", tecnologia: "AC Sincrono", estado: "Flusso massiccio" },
  { frontera: "Marocco", flujoMW: 800, direccion: "Esportazione", tecnologia: "Sottomarino AC", estado: "Costante programmato" }
];

export const energyMixData = [
  { tecnologia: "Solare", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Idroelettrica", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Sincrona", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Eolica", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nucleare", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Sincrona", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogenerazione", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Ibrida", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "C. Combinato", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Sincrona", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Carbone", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Sincrona", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Scatto trasformatore Granada per sovratensione 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Elevazione di tensione per rete capacitiva scarica di flussi." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Scatto sottostazioni Badajoz (730 MW solare CSP e PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Scatto sottostazione Siviglia (550 MW). Il bilancio collassa." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascata per superamento soglie High Voltage Ride-Through." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Perdita di sincronismo iberico. Caduta libera di frequenza." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Scatto degli inverter per relè RoCoF sensibili interni." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Apertura linee di interconnessione AC Francia a 48.46 Hz (Isolamento)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Attivazione schema UFLS distacca 5 GW di pompaggio. RoCoF critico." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Distacco secondario 5 GW in distribuzione. Insufficiente per inerzia bassa." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "SCRAM Nucleare. Scatto HVDC. Zero Elettrico Assoluto." }
];

export const rocofData = [
  { fase: "Inizio Perturbazione", tiempoS: 0, rocof: -0.015, mecanismo: "Regolazione Primaria FCR", fallo: "La riserva di MW si esaurisce" },
  { fase: "Cascata Media", tiempoS: 21, rocof: -0.250, mecanismo: "Resistenza Inerziale", fallo: "Il buco supera la capacità rotativa" },
  { fase: "Perdita di Sincronismo", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Gli inverter si auto-disconnettono" },
  { fase: "Isola Elettrica", tiempoS: 24, rocof: -0.850, mecanismo: "Separazione Interconnessioni", fallo: "L\'Europa elimina l\'ultima ancora" },
  { fase: "Distacco 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Pompaggio 5GW", fallo: "Ritardo ms rispetto alla caduta accelerata" },
  { fase: "Distacco 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civile 5GW", fallo: "Incapacità di eguagliare il gradiente" }
];
