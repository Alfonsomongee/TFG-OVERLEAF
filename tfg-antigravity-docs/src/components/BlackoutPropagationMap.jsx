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

// Nodos críticos de la red ibérica con narrativa explicativa
const STATIONS = [
  { name: 'Subestación Caparacena (Granada)', coordinates: [-3.5985, 37.1773], type: 'critical', desc: 'Punto cero (16:32:00). Doble cortocircuito que desencadena una brutal sobretensión local.' },
  { name: 'Nudo Alcores (Sevilla)', coordinates: [-5.9844, 37.3890], type: 'lost', desc: 'Desconectada por protecciones para intentar aislar el incendio eléctrico del sur.' },
  { name: 'Nudo Guillena (Badajoz)', coordinates: [-6.9706, 38.8794], type: 'lost', desc: 'Sufre la onda de choque de reactiva. Cae por colapso de tensión (Voltage Collapse).' },
  { name: 'C.N. Almaraz (Cáceres)', coordinates: [-5.6961, 39.8142], type: 'active', desc: 'Soporta el transitorio gracias a la inercia pesada de sus alternadores síncronos.' },
  { name: 'Madrid Sur / Morata', coordinates: [-3.7037, 40.4167], type: 'active', desc: 'Absorbe los desequilibrios pero sufre caídas de frecuencia hasta 48.7 Hz.' },
  { name: 'Nudo Aragón (Zaragoza)', coordinates: [-0.8877, 41.6497], type: 'active', desc: 'Actúa como puente crítico para intentar importar energía de emergencia desde Francia.' },
  { name: 'Nudo Rubí (Barcelona)', coordinates: [2.1734, 41.3852], type: 'active', desc: 'Se mantiene estable pero al límite operativo, exportando inercia al resto del país.' },
  { name: 'Lisboa (Rede Eléctrica Nacional)', coordinates: [-9.1393, 38.7222], type: 'active', desc: 'La desconexión súbita de Andalucía genera oscilaciones letales hacia la red portuguesa.' },
  { name: 'Porto (REN)', coordinates: [-8.6291, 41.1579], type: 'active', desc: 'Compensa la falta de generación del sur bombeando energía a la desesperada.' },
  { name: 'Interconexión Francia (RTE)', coordinates: [1.8845, 42.6397], type: 'border', desc: 'Aporta 2.500 MW de emergencia para salvar a la Península del cero total.' }
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
      setTime(t => (t + 1) % 150); // Loop de 15 segundos
    }, 100);
    return () => clearInterval(animation);
  }, []);

  const layers = [
    new TileLayer({
      id: 'esri-satellite',
      data: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      opacity: Math.max(0.3, 1 - (time / 100))
    }),
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
      getRadius: d => (d.type === 'critical' ? (60 + Math.sin(time / 5) * 20) : 50),
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
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.85)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        maxWidth: '350px',
        border: '1px solid #30363d',
        zIndex: 10
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>Propagación del Colapso</h3>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db' }}>
          Este modelo 3D proyecta físicamente el apagón. Los <strong>arcos</strong> son flujos masivos de energía. Las <strong>esferas pulsantes</strong> representan sobretensiones en los nudos.
        </p>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#d1d5db', marginBottom: '15px' }}>
          El oscurecimiento geográfico progresivo simula el hundimiento de tensión a lo largo de los 11 segundos.
        </p>
        <div style={{ background: 'var(--ifm-color-primary)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block' }}>
          Progreso de Simulación: {Math.min(11.0, time / 10).toFixed(1)}s {time > 120 && '(Reiniciando...)'}
        </div>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '15px', fontStyle: 'italic', margin: '15px 0 0 0' }}>
          <span style={{color: '#fff'}}>Interacción:</span> Arrastra para rotar la cámara en 3D. Haz clic en las esferas para ver el informe forense.
        </p>
      </div>
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 5,
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
          <h4 style={{margin: '0 0 10px 0', fontSize: '1rem', color: '#60a5fa'}}>{clickedObject.name || 'Flujo de Energía Crítico'}</h4>
          {clickedObject.flow ? (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.flow}</p>
          ) : (
            <p style={{margin: 0, fontSize: '0.9rem', lineHeight: '1.4'}}>{clickedObject.desc}</p>
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
