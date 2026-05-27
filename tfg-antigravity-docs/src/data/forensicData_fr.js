export const interconnectionsData = [
  { frontera: "France", flujoMW: 1000, direccion: "Exportation", tecnologia: "HVDC/AC", estado: "Forte charge AC ; HVDC fixe" },
  { frontera: "Portugal", flujoMW: 2000, direccion: "Exportation", tecnologia: "AC Synchrone", estado: "Flux massif" },
  { frontera: "Maroc", flujoMW: 800, direccion: "Exportation", tecnologia: "Sous-marin AC", estado: "Constant programmé" }
];

export const energyMixData = [
  { tecnologia: "Solaire", inyectadaGW: 17.10, porcentaje: 59.0, naturaleza: "Grid-Following", perdidaGW: 14.00, color: "#f59e0b" },
  { tecnologia: "Hydraulique", inyectadaGW: 3.48, porcentaje: 12.0, naturaleza: "Synchrone", perdidaGW: 1.50, color: "#3b82f6" },
  { tecnologia: "Éolien", inyectadaGW: 3.19, porcentaje: 11.0, naturaleza: "Grid-Following", perdidaGW: 2.50, color: "#10b981" },
  { tecnologia: "Nucléaire", inyectadaGW: 2.90, porcentaje: 10.0, naturaleza: "Synchrone", perdidaGW: 2.90, color: "#ef4444" },
  { tecnologia: "Cogénération", inyectadaGW: 1.16, porcentaje: 4.0, naturaleza: "Hybride", perdidaGW: 0.80, color: "#8b5cf6" },
  { tecnologia: "Cycle Combiné", inyectadaGW: 0.87, porcentaje: 3.0, naturaleza: "Synchrone", perdidaGW: 0.87, color: "#64748b" },
  { tecnologia: "Charbon", inyectadaGW: 0.29, porcentaje: 1.0, naturaleza: "Synchrone", perdidaGW: 0.29, color: "#334155" }
];

export const timelineData = [
  { tiempoS: 0, timestamp: "12:32:57", frecuencia: 50.000, perdidaMW: 355, acumuladoMW: 355, rocof: 0.000, evento: "Déclenchement du transformateur de Grenade pour surtension 220kV." },
  { tiempoS: 18, timestamp: "12:33:15", frecuencia: 49.950, perdidaMW: 0, acumuladoMW: 355, rocof: -0.015, evento: "Élévation de tension par réseau capacitif déchargé de flux." },
  { tiempoS: 19, timestamp: "12:33:16", frecuencia: 49.850, perdidaMW: 730, acumuladoMW: 1085, rocof: -0.050, evento: "Déclenchement des sous-stations de Badajoz (730 MW solaire CSP et PV)." },
  { tiempoS: 20, timestamp: "12:33:17", frecuencia: 49.750, perdidaMW: 550, acumuladoMW: 1635, rocof: -0.100, evento: "Déclenchement de la sous-station de Séville (550 MW). Le bilan s\'effondre." },
  { tiempoS: 21, timestamp: "12:33:18", frecuencia: 49.500, perdidaMW: 2500, acumuladoMW: 4135, rocof: -0.250, evento: "Cascade par dépassement des seuils de High Voltage Ride-Through." },
  { tiempoS: 22, timestamp: "12:33:19", frecuencia: 49.100, perdidaMW: 4000, acumuladoMW: 8135, rocof: -0.400, evento: "Perte de synchronisme ibérique. Chute libre de fréquence." },
  { tiempoS: 23, timestamp: "12:33:20", frecuencia: 48.700, perdidaMW: 3000, acumuladoMW: 11135, rocof: -0.500, evento: "Déclenchement d\'onduleurs par relais RoCoF sensibles internes." },
  { tiempoS: 24, timestamp: "12:33:21", frecuencia: 48.460, perdidaMW: 0, acumuladoMW: 11135, rocof: -0.850, evento: "Ouverture des lignes d\'interconnexion AC France à 48,46 Hz (Isolement)." },
  { tiempoS: 25, timestamp: "12:33:22", frecuencia: 47.500, perdidaMW: 5000, acumuladoMW: 16135, rocof: -1.500, evento: "Activation du schéma UFLS, délestage de 5 GW de pompage. RoCoF critique." },
  { tiempoS: 26, timestamp: "12:33:23", frecuencia: 46.500, perdidaMW: 5000, acumuladoMW: 21135, rocof: -1.600, evento: "Délestage secondaire de 5 GW en distribution. Insuffisant en raison d\'une faible inertie." },
  { tiempoS: 27, timestamp: "12:33:24", frecuencia: 0.000, perdidaMW: 4049, acumuladoMW: 25184, rocof: null, evento: "SCRAM Nucléaire. Déclenchement HVDC. Zéro Électrique Absolu." }
];

export const rocofData = [
  { fase: "Début de la perturbation", tiempoS: 0, rocof: -0.015, mecanismo: "Régulation Primaire FCR", fallo: "La réserve de MW s\'épuise" },
  { fase: "Cascade Moyenne", tiempoS: 21, rocof: -0.250, mecanismo: "Résistance Inertielle", fallo: "Le trou dépasse la capacité rotative" },
  { fase: "Perte de Synchronisme", tiempoS: 23, rocof: -0.500, mecanismo: "High RoCoF Ride-Through", fallo: "Les onduleurs s\'auto-déconnectent" },
  { fase: "Îlot Électrique", tiempoS: 24, rocof: -0.850, mecanismo: "Séparation des Interconnexions", fallo: "L\'Europe élimine la dernière ancre" },
  { fase: "Délestage 1", tiempoS: 25, rocof: -1.500, mecanismo: "UFLS Pompage 5GW", fallo: "Retard ms face à la chute accélérée" },
  { fase: "Délestage 2", tiempoS: 26, rocof: -1.600, mecanismo: "UFLS Civil 5GW", fallo: "Incapacité à égaler le gradient" }
];
