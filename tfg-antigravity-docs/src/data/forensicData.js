export const interconnectionsData = [
  { frontera: "Francia", flujoMW: 1000, direccion: "Exportacion", tecnologia: "HVDC/AC", estado: "Alta carga AC; HVDC fijo" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Exportacion", tecnologia: "AC Síncrono", estado: "Flujo masivo" },
  { frontera: "Marruecos", flujoMW: 800, direccion: "Exportacion", tecnologia: "Submarino AC", estado: "Constante programado" }
];

export const energyMixData = [
  { tecnologia: "Solar", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Hidráulica", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Síncrona", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Eólica", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nuclear", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Síncrona", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogeneración", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Híbrida", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "C. Combinado", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Síncrona", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Carbón", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Síncrona", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Disparo transformador Granada por sobretensión 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Elevación de tensión por red capacitiva descargada de flujos." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Disparo subestaciones Badajoz (730 MW solar CSP y PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Disparo subestación Sevilla (550 MW). Balance colapsa." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascada por superación umbrales High Voltage Ride-Through." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Pérdida de sincronismo ibérico. Caída libre de frecuencia." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Disparo de inversores por relés RoCoF sensibles internos." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Apertura líneas interconexión AC Francia a 48.46 Hz (Aislamiento)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Activación esquema UFLS deslastra 5 GW de bombeo. RoCoF crítico." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Deslastre secundario 5 GW en distribución. Insuficiente por inercia baja." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "SCRAM Nuclear. Disparo HVDC. Cero Eléctrico Absoluto." }
];

export const rocofData = [
  { fase: "Inicio Perturbación", tiempoS: 0, rocof: -0.015, mecanismo: "Regulación Primaria FCR", fallo: "Reserva de MW se agota" },
  { fase: "Cascada Media", tiempoS: 21, rocof: -0.250, mecanismo: "Resistencia Inercial", fallo: "Agujero supera capacidad rotativa" },
  { fase: "Pérdida Sincronismo", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Inversores se auto-desconectan" },
  { fase: "Isla Eléctrica", tiempoS: 24, rocof: -0.850, mecanismo: "Separación Interconexiones", fallo: "Europa elimina último ancla" },
  { fase: "Deslastre 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Bombeo 5GW", fallo: "Retardo ms frente a caída acelerada" },
  { fase: "Deslastre 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civil 5GW", fallo: "Incapacidad para igualar gradiente" }
];
