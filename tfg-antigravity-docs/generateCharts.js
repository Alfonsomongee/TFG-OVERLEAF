const fs = require('fs');
const path = require('path');
const dataDir = './static/data/esios';
const outDir = './src/components/GaleriaForense/Charts';

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

files.forEach(f => {
  let compName = f.replace('_compressed.json', '')
                  .replace('export_', '')
                  .replace(/_2025-04-28_00_00/g, '')
                  .replace(/_2026-05-25_21_51/g, '')
                  .split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')
                  .replace(/_/g, '') + 'Chart';
                  
  if (compName.startsWith('28A')) compName = 'InertiaChart';

  const content = `import React, { useState, useEffect } from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ${compName}() {
  const isBrowser = useIsBrowser();
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  
  useEffect(() => {
    if (!isBrowser) return;
    fetch('/data/esios/${f}')
      .then(res => res.json())
      .then(json => {
        let formatted = [];
        if (Array.isArray(json)) {
            formatted = json;
        } else if (json.included) {
            // ESIOS typical structure
            formatted = json.included.map(item => {
                const values = item.attributes?.values || [];
                return values.map(v => ({ datetime: v.datetime, [item.attributes.name]: v.value }));
            }).flat();
        } else {
            formatted = json.data || Object.values(json)[0] || [];
        }
        
        setData(formatted);
        
        const sample = formatted[0] || {};
        const numericKeys = Object.keys(sample).filter(k => typeof sample[k] === 'number');
        setKeys(numericKeys);
      })
      .catch(err => console.error(err));
  }, [isBrowser]);

  if (!isBrowser || !data.length) return <div className="loader">[ CARGANDO ${compName.toUpperCase()}... ]</div>;

  return (
    <div style={{ width: '100%', height: 400, backgroundColor: 'hsl(220, 30%, 10%)', padding: '1rem', borderRadius: '8px', border: '1px solid hsl(220, 20%, 25%)', marginBottom: '2rem' }}>
      <h3 style={{ color: '#fff', textAlign: 'center', fontFamily: 'monospace', marginBottom: '1rem' }}>${f.replace('_compressed.json', '')}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 25%)" />
          <XAxis dataKey={Object.keys(data[0] || {})[0]} stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip contentStyle={{ backgroundColor: 'hsl(220, 30%, 12%)', border: '1px solid #444' }} />
          <Legend />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={\`hsl(\${(i * 50 + 190) % 360}, 80%, 60%)\`} dot={false} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(outDir, `${compName}.jsx`), content);
  console.log(`Created ${compName}.jsx`);
});
