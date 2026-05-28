// src/components/cine-mode/chartRegistry.js
// Registro de escenas del Modo Cine – apunta a los Bloques de ResumenCifras

import { lazy } from 'react';

export const chartRegistry = {
  Bloque1KPI:           lazy(() => import('../ResumenCifras/Bloque1KPI')),
  Bloque2MixGeneracion: lazy(() => import('../ResumenCifras/Bloque2MixGeneracion')),
  Bloque3Cascada:       lazy(() => import('../ResumenCifras/Bloque3Cascada')),
  Bloque4Frecuencia:    lazy(() => import('../ResumenCifras/Bloque4Frecuencia')),
  Bloque5Interconexiones: lazy(() => import('../ResumenCifras/Bloque5Interconexiones')),
  Bloque6Cronologia:    lazy(() => import('../ResumenCifras/Bloque6Cronologia')),
};

// act: 1-5 · description: tooltip en el slider
export const sceneMetadata = [
  {
    id: 'kpi',
    component: 'Bloque1KPI',
    act: 1,
    actTitle: 'LA TORMENTA PERFECTA',
    title: 'Impacto del colapso',
    description: 'Cifras clave: duración, carga interrumpida, víctimas, coste económico',
  },
  {
    id: 'mix',
    component: 'Bloque2MixGeneracion',
    act: 1,
    actTitle: 'LA TORMENTA PERFECTA',
    title: 'Mix de generación',
    description: '82 % de penetración renovable no síncrona en el momento crítico',
  },
  {
    id: 'cascada',
    component: 'Bloque3Cascada',
    act: 2,
    actTitle: 'EL COLAPSO',
    title: 'Cascada de eventos',
    description: 'Secuencia cronológica: de las oscilaciones iniciales al cero de tensión',
  },
  {
    id: 'frecuencia',
    component: 'Bloque4Frecuencia',
    act: 2,
    actTitle: 'EL COLAPSO',
    title: 'Evolución de frecuencia',
    description: 'Caída a 47,79 Hz en 33 segundos · RoCoF > 1,5 Hz/s',
  },
  {
    id: 'interconexiones',
    component: 'Bloque5Interconexiones',
    act: 3,
    actTitle: 'EL PRECIPICIO',
    title: 'Interconexiones',
    description: 'Flujos transfronterizos Francia, Portugal y Marruecos durante la cascada',
  },
  {
    id: 'cronologia',
    component: 'Bloque6Cronologia',
    act: 4,
    actTitle: 'LA REPOSICIÓN',
    title: 'Cronología de reposición',
    description: 'Recuperación del 99,95 % del suministro en 18 horas',
  },
];
