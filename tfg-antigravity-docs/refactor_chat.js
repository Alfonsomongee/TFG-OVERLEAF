const fs = require('fs');
const file = './src/components/ChatFullscreen.jsx';
let code = fs.readFileSync(file, 'utf8');

// CAMBIO 3a: estado activeTables
code = code.replace(
  'const [activeFigures, setActiveFigures] = useState([]);',
  'const [activeFigures, setActiveFigures] = useState([]);\n  const [activeTables, setActiveTables] = useState([]);'
);

// CAMBIO 1: useEffect
const ueRegex = /  \/\/ Analizar última respuesta del asistente\r?\n  useEffect\(\(\) => \{[\s\S]*?  \}, \[messages, lang\]\);/;
const ueMatch = code.match(ueRegex);
if (ueMatch) {
  const newUe = `  // Analizar última respuesta del asistente
  useEffect(() => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (!last) return;

    // Fuente primaria: visualArtifacts del backend
    const backendArtifacts = last.visualArtifacts || [];

    // Tablas: del backend
    const backendTables = backendArtifacts
      .filter(a => a.type === 'table');
    setActiveTables(backendTables);

    // Interactivos: del backend si hay, si no del texto
    const backendInteractives = backendArtifacts
      .filter(a => a.type === 'interactive' && INTERACTIVE_MAP[a.id])
      .map(a => a.id);
    const textAnchors = backendInteractives.length > 0
      ? backendInteractives
      : extractInteractiveAnchors(last.text);

    // Figuras: del backend si hay, si no del texto
    const backendFigures = backendArtifacts
      .filter(a => a.type === 'image')
      .map(a => {
        const filename = (a.path || a.id || '').split('/').pop().replace(/\\.\\w+$/, '');
        return FIGURE_INDEX.find(f => f.src.includes(filename) || f.src.includes(a.id)) || null;
      })
      .filter(Boolean);
    const textFigures = backendFigures.length > 0
      ? backendFigures
      : findRelevantFigures(last.text, lang);

    setActiveAnchors(textAnchors);
    setActiveFigures(textFigures);

    const newTab = textAnchors.length > 0
      ? 'interactive-0'
      : textFigures.length > 0 ? 'figure-0'
      : backendTables.length > 0 ? 'table-0'
      : null;

    if (newTab !== activeTab) {
      setPanelVisible(false);
      setTimeout(() => {
        setActiveTab(newTab);
        setPanelKey(k => k + 1);
        setPanelVisible(true);
      }, 180);
    }
  }, [messages, lang]);`;
  code = code.replace(ueMatch[0], newUe);
  console.log('CAMBIO 1 SUCCESS');
} else {
  console.log('CAMBIO 1 falló');
}

// CAMBIO 2: eliminar visualArtifacts de renderPanelContent
const vaRegex = /    const visualArtifacts = latestAssistantMessage\?\.visualArtifacts \|\| \[\];\r?\n\r?\n    if \(visualArtifacts\.length > 0\) \{[\s\S]*?      \);\r?\n    \}\r?\n/;
const vaMatch = code.match(vaRegex);
if (vaMatch) {
  code = code.replace(vaMatch[0], '');
  console.log('CAMBIO 2 SUCCESS');
} else {
  console.log('CAMBIO 2 falló');
}

// CAMBIO 3b: allTabs
const allTabsStart = code.indexOf('    ...activeFigures.map((fig, i) => {');
const allTabsEnd = code.indexOf('  ];', allTabsStart);
if (allTabsStart !== -1 && allTabsEnd !== -1) {
  const replacement = `    ...activeTables.map((table, i) => ({
      id: 'table-' + i,
      label: table.title
        ? table.title.substring(0, 37) + (table.title.length > 37 ? '...' : '')
        : 'Tabla',
      type: 'table',
    })),
`;
  code = code.substring(0, allTabsEnd) + replacement + code.substring(allTabsEnd);
  console.log('CAMBIO 3b SUCCESS');
} else {
  console.log('CAMBIO 3b falló');
}

// CAMBIO 4: render tablas
const rpcEndMatch = code.match(/    return null;\r?\n  };\r?\n\r?\n  \/\/ ── Tabs combinados/);
if (rpcEndMatch) {
  const renderTable = `
    if (activeTab.startsWith('table-')) {
      const idx = parseInt(activeTab.split('-')[1]);
      const table = activeTables[idx];
      if (!table) return null;
      return (
        <div style={{ padding: '24px', overflowY: 'auto', height: '100%' }}>
          <div style={{
            marginBottom: 16,
            padding: '14px 16px',
            borderLeft: '3px solid var(--chart-amber, hsl(38 100% 56%))',
            backgroundColor: 'hsla(38,100%,56%,0.05)',
            borderRadius: '0 8px 8px 0',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
              color: 'var(--chart-amber, hsl(38 100% 56%))',
              marginBottom: 6, textTransform: 'uppercase',
            }}>◈ TABLA FORENSE</div>
            <p style={{ fontSize: 13, color: 'var(--chart-text-1, #e2e8f0)', lineHeight: 1.7, margin: 0 }}>
              {table.description || table.title}
            </p>
            {table.origin && (
              <div style={{ fontSize: 11, color: 'var(--chart-text-3, #64748b)', marginTop: 6 }}>
                Fuente: {table.origin}
              </div>
            )}
          </div>
          {table.sampleRows && table.columns && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr>
                    {table.columns.map(col => (
                      <th key={col.key} style={{
                        padding: '8px 12px', textAlign: 'left',
                        borderBottom: '1px solid var(--chart-amber, hsl(38 100% 56%))',
                        color: 'var(--chart-amber, hsl(38 100% 56%))',
                        fontWeight: 700, fontSize: 10,
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        whiteSpace: 'nowrap',
                      }}>{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.sampleRows.map((row, i) => (
                    <tr key={i} style={{
                      borderBottom: '1px solid var(--chart-border, rgba(255,255,255,0.06))',
                      backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    }}>
                      {table.columns.map(col => (
                        <td key={col.key} style={{ padding: '7px 12px', fontSize: 12, lineHeight: 1.4 }}>
                          {row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {table.url && (
            <a href={table.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: 16, fontSize: 12,
                color: 'var(--chart-amber, hsl(38 100% 56%))',
                textDecoration: 'none', fontWeight: 600 }}>
              Ver tabla completa ↗
            </a>
          )}
        </div>
      );
    }
`;
  code = code.replace(rpcEndMatch[0], renderTable + rpcEndMatch[0]);
  console.log('CAMBIO 4 SUCCESS');
} else {
  console.log('CAMBIO 4 falló');
}

fs.writeFileSync(file, code);
