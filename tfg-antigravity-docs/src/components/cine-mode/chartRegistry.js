// src/components/cine-mode/chartRegistry.js
// Registro de escenas y metadatos para el Modo Cine 2.0

import { lazy } from 'react';

export const chartRegistry = {
  Bloque1KPI:           lazy(() => import('../ResumenCifras/Bloque1KPI')),
  Bloque2MixGeneracion: lazy(() => import('../ResumenCifras/Bloque2MixGeneracion')),
  Bloque3Cascada:       lazy(() => import('../ResumenCifras/Bloque3Cascada')),
  Bloque4Frecuencia:    lazy(() => import('../ResumenCifras/Bloque4Frecuencia')),
  Bloque5Interconexiones: lazy(() => import('../ResumenCifras/Bloque5Interconexiones')),
  Bloque6Cronologia:    lazy(() => import('../ResumenCifras/Bloque6Cronologia')),
};

export const sceneMetadata = [
  {
    id: 'kpi',
    component: 'Bloque1KPI',
    act: 1,
    actTitle: 'LA TORMENTA PERFECTA',
    title: 'Impacto del colapso',
    description: 'Los números que paralizaron la península ibérica el 28 de abril de 2025.',
  },
  {
    id: 'mix',
    component: 'Bloque2MixGeneracion',
    act: 1,
    actTitle: 'LA TORMENTA PERFECTA',
    title: 'Mix de generación',
    description: 'El día en que la solar dominó y la inercia desapareció del sistema.',
  },
  {
    id: 'cascada',
    component: 'Bloque3Cascada',
    act: 2,
    actTitle: 'EL COLAPSO',
    title: 'Cascada de desconexiones',
    description: 'En 5 segundos, 15 GW evaporados. La secuencia exacta del derrumbe.',
  },
  {
    id: 'frecuencia',
    component: 'Bloque4Frecuencia',
    act: 2,
    actTitle: 'EL COLAPSO',
    title: 'Caída de frecuencia',
    description: 'De 50 Hz a colapso total: la telemetría del instante crítico.',
  },
  {
    id: 'interconexiones',
    component: 'Bloque5Interconexiones',
    act: 3,
    actTitle: 'EL PRECIPICIO',
    title: 'Interconexiones ibéricas',
    description: 'Por qué el 3% de capacidad de interconexión con Europa fue insuficiente.',
  },
  {
    id: 'cronologia',
    component: 'Bloque6Cronologia',
    act: 4,
    actTitle: 'LA REPOSICIÓN',
    title: 'Cronología de la reposición',
    description: 'Las 18 horas que tardó España en volver a encender las luces.',
  },
];
