export const interconnectionsData = [
  { frontera: "France", flujoMW: 1000, direccion: "Export", tecnologia: "HVDC/AC", estado: "High AC load; fixed HVDC" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Export", tecnologia: "Synchronous AC", estado: "Massive flow" },
  { frontera: "Morocco", flujoMW: 800, direccion: "Export", tecnologia: "Submarine AC", estado: "Constant scheduled" }
];

export const energyMixData = [
  { tecnologia: "Solar", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Hydro", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Synchronous", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Wind", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nuclear", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Synchronous", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogeneration", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Hybrid", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "Combined Cycle", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Synchronous", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Coal", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Synchronous", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Granada 220kV transformer trip due to overvoltage." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Voltage rise due to capacitive grid devoid of flows." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Badajoz substations trip (730 MW solar CSP and PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Seville substation trip (550 MW). Balance collapses." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascade due to exceeding High Voltage Ride-Through thresholds." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Loss of Iberian synchronism. Frequency freefall." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Inverter trips due to sensitive internal RoCoF relays." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Opening of France AC interconnection lines at 48.46 Hz (Isolation)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "UFLS scheme activation sheds 5 GW of pumping. Critical RoCoF." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Secondary shedding of 5 GW in distribution. Insufficient due to low inertia." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "Nuclear SCRAM. HVDC trip. Absolute Electrical Zero." }
];

export const rocofData = [
  { fase: "Disturbance Onset", tiempoS: 0, rocof: -0.015, mecanismo: "FCR Primary Regulation", fallo: "MW reserve depleted" },
  { fase: "Mid Cascade", tiempoS: 21, rocof: -0.250, mecanismo: "Inertial Response", fallo: "Deficit exceeds rotating capacity" },
  { fase: "Loss of Synchronism", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Inverters self-disconnect" },
  { fase: "Electrical Island", tiempoS: 24, rocof: -0.850, mecanismo: "Interconnections Separation", fallo: "Europe removes last anchor" },
  { fase: "Shedding 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Pumping 5GW", fallo: "ms delay against accelerated drop" },
  { fase: "Shedding 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civil 5GW", fallo: "Inability to match gradient" }
];
