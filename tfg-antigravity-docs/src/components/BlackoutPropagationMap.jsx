import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, ArcLayer, BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import BrowserOnly from '@docusaurus/BrowserOnly';


const INITIAL_VIEW_STATE = {
  longitude: -4.5,
  latitude: 39.5,
  zoom: 5,
  pitch: 45,
  bearing: 0
};

// Nodos críticos de la red ibérica
const STATIONS = [
  { name: 'Subestación Granada (Detonante)', coordinates: [-3.5985, 37.1773], type: 'critical', capacity: 100 },
  { name: 'Nudo Sevilla', coordinates: [-5.9844, 37.3890], type: 'lost', capacity: 80 },
  { name: 'Nudo Badajoz', coordinates: [-6.9706, 38.8794], type: 'lost', capacity: 70 },
  { name: 'C.N. Almaraz', coordinates: [-5.6961, 39.8142], type: 'active', capacity: 90 },
  { name: 'Madrid Centro', coordinates: [-3.7037, 40.4167], type: 'active', capacity: 100 },
  { name: 'Zaragoza', coordinates: [-0.8877, 41.6497], type: 'active', capacity: 60 },
  { name: 'Barcelona', coordinates: [2.1734, 41.3852], type: 'active', capacity: 90 },
  { name: 'Lisboa (REN)', coordinates: [-9.1393, 38.7222], type: 'active', capacity: 85 },
  { name: 'Porto (REN)', coordinates: [-8.6291, 41.1579], type: 'active', capacity: 75 },
  { name: 'Interconexión FR (Pirineos)', coordinates: [1.8845, 42.6397], type: 'border', capacity: 100 }
];

// Flujos de potencia masivos (Arcos)
const ARCS = [
  { source: [-3.5985, 37.1773], target: [-5.9844, 37.3890], flow: 'Sobretensión en cascada' },
  { source: [-5.9844, 37.3890], target: [-6.9706, 38.8794], flow: 'Pérdida de sincronismo' },
  { source: [-6.9706, 38.8794], target: [-9.1393, 38.7222], flow: 'Oscilaciones interárea a Portugal' },
  { source: [-3.7037, 40.4167], target: [1.8845, 42.6397], flow: 'Intento de estabilización desde Europa' },
  { source: [-0.8877, 41.6497], target: [1.8845, 42.6397], flow: 'Sobrecarga de AC' }
];

function BlackoutMapContent() {
  const [time, setTime] = useState(0);
  const [clickedObject, setClickedObject] = useState(null);

  useEffect(() => {
    const animation = setInterval(() => {
      setTime(t => (t + 1) % 100);
    }, 50);
    return () => clearInterval(animation);
  }, []);

  const layers = [
    new ScatterplotLayer({
      id: 'stations-layer',
      data: STATIONS,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 600,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 2,
      getPosition: d => d.coordinates,
      getRadius: d => d.capacity * (d.type === 'critical' ? (1 + Math.sin(time / 5) * 0.3) : 1),
      getFillColor: d => {
        if (d.type === 'critical') return [255, 0, 0];
        if (d.type === 'lost') return [255, 165, 0];
        if (d.type === 'border') return [0, 150, 255];
        return [0, 255, 100];
      },
      getLineColor: d => [0, 0, 0]
    }),
    new ArcLayer({
      id: 'power-flows-layer',
      data: ARCS,
      pickable: true,
      getWidth: 3,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getSourceColor: [255, 0, 0, 200],
      getTargetColor: [255, 165, 0, 200],
      getTilt: d => (time / 100) * 15 - 7.5
    }),
    new TileLayer({
      id: 'carto-dark-matter',
      data: 'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      renderSubLayers: props => {
        const { boundingBox } = props.tile;
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
        });
      }
    })
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '12px', overflow: 'hidden' }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({object}) => object && (object.name || object.flow)}
        onClick={({object}) => {
          if (object) setClickedObject(object);
          else setClickedObject(null);
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: '10px 15px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.85rem'
      }}>
        <strong>Leyenda:</strong><br/>
        <span style={{color: '#ff0000'}}>●</span> Detonante (Sobretensión)<br/>
        <span style={{color: '#ffa500'}}>●</span> Nudos Desconectados<br/>
        <span style={{color: '#00ff64'}}>●</span> Nudos Activos<br/>
        <span style={{color: '#0096ff'}}>●</span> Interconexión Europea
      </div>
      {clickedObject && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.9)',
          padding: '15px',
          borderRadius: '8px',
          color: 'white',
          maxWidth: '250px',
          border: '1px solid var(--ifm-color-primary)'
        }}>
          <h4 style={{margin: '0 0 10px 0'}}>{clickedObject.name || 'Flujo Eléctrico'}</h4>
          {clickedObject.flow ? (
            <p style={{margin: 0}}>{clickedObject.flow}</p>
          ) : (
            <p style={{margin: 0}}>Estado: {clickedObject.type.toUpperCase()}<br/>Capacidad Relativa: {clickedObject.capacity}%</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function BlackoutPropagationMap() {
  return (
    <BrowserOnly fallback={<div>Cargando mapa 3D interactivo...</div>}>
      {() => <BlackoutMapContent />}
    </BrowserOnly>
  );
}
