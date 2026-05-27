export const interconnectionsData = [
  { frontera: "França", flujoMW: 1000, direccion: "Exportação", tecnologia: "HVDC/AC", estado: "Alta carga AC; HVDC fixo" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Exportação", tecnologia: "AC Síncrono", estado: "Fluxo massivo" },
  { frontera: "Marrocos", flujoMW: 800, direccion: "Exportação", tecnologia: "Submarino AC", estado: "Constante programado" }
];

export const energyMixData = [
  { tecnologia: "Solar", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Hidroelétrica", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Síncrona", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Eólica", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nuclear", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Síncrona", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogeração", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Híbrida", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "C. Combinado", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Síncrona", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Carvão", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Síncrona", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Disparo do transformador de Granada por sobretensão de 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Elevação de tensão por rede capacitiva descarregada de fluxos." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Disparo das subestações de Badajoz (730 MW solar CSP e PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Disparo da subestação de Sevilha (550 MW). Balanço colapsa." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascata por superação de limites High Voltage Ride-Through." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Perda de sincronismo ibérico. Queda livre de frequência." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Disparo de inversores por relés RoCoF sensíveis internos." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Abertura das linhas de interconexão AC com França a 48.46 Hz (Isolamento)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Ativação do esquema UFLS descarta 5 GW de bombagem. RoCoF crítico." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Descarte secundário de 5 GW na distribuição. Insuficiente devido a inércia baixa." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "SCRAM Nuclear. Disparo HVDC. Zero Elétrico Absoluto." }
];

export const rocofData = [
  { fase: "Início da Perturbação", tiempoS: 0, rocof: -0.015, mecanismo: "Regulação Primária FCR", fallo: "Reserva de MW esgota-se" },
  { fase: "Cascata Média", tiempoS: 21, rocof: -0.250, mecanismo: "Resistência Inercial", fallo: "Buraco supera capacidade rotativa" },
  { fase: "Perda de Sincronismo", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Inversores autodesconectam-se" },
  { fase: "Ilha Elétrica", tiempoS: 24, rocof: -0.850, mecanismo: "Separação de Interconexões", fallo: "Europa elimina última âncora" },
  { fase: "Descarte 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Bombagem 5GW", fallo: "Atraso de ms face a queda acelerada" },
  { fase: "Descarte 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civil 5GW", fallo: "Incapacidade para igualar gradiente" }
];
