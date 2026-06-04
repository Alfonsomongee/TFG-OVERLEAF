const fs = require('fs');

const cfFile = './tfg-antigravity-docs/src/components/ChatFullscreen.jsx';
let cfJs = fs.readFileSync(cfFile, 'utf8');

// Convertir todo a LF para hacer el match más facil
const originalEndings = cfJs.includes('\r\n') ? '\r\n' : '\n';
cfJs = cfJs.replace(/\r\n/g, '\n');

const target = `          {/* Leyenda / Fuente */}
          <p style={{
            marginTop: 12,
            fontSize: 12,
            color: 'var(--chart-text-2, #94a3b8)',
            textAlign: 'center',
            fontStyle: 'italic',
            lineHeight: 1.5,
            padding: '0 16px',
          }}>
            {caption ? caption : (
              <>
                {fig.chapter && \`Capítulo \${fig.chapter.replace('ch','')} — \`}
                {fig.src.split('/').pop()}
              </>
            )}
          </p>`;

const replacement = `          {/* Leyenda / Fuente */}
          {caption && figureContexts[activeTab] !== caption && (
            <p style={{
              marginTop: 12,
              fontSize: 11,
              color: 'var(--chart-text-3, #64748b)',
              textAlign: 'center',
              fontStyle: 'italic',
              lineHeight: 1.5,
              padding: '0 16px',
            }}>
              {caption}
            </p>
          )}`;

if (cfJs.includes(target)) {
  cfJs = cfJs.replace(target, replacement);
  // Devolver endings
  if (originalEndings === '\r\n') {
    cfJs = cfJs.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(cfFile, cfJs);
  console.log('CAMBIO 3 SUCCESS');
} else {
  console.log('CAMBIO 3 falló: No se encontró el bloque exacto en LF.');
}
