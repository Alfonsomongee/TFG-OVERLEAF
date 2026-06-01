import re

with open('src/components/BlackoutPropagationMapBase.jsx', 'r', encoding='utf-8') as f:
    content1 = f.read()

MAP_CONSTANTS = '''
// ============================================================
// CONTORNO DE LA PENÍNSULA IBÉRICA (ALTA RESOLUCIÓN)
// ============================================================
const IBERIA_PATH = 'M 120,90 C 125,82 135,75 148,72 C 162,68 178,66 192,65 C 210,63 230,62 250,62 C 272,62 290,60 308,56 C 326,52 342,48 356,45 C 370,42 380,40 388,40 C 396,42 402,46 406,52 C 408,58 408,64 406,70 C 404,74 400,78 396,80 C 392,78 388,76 384,78 C 380,82 378,88 378,94 C 380,102 384,112 390,120 C 396,128 400,136 402,144 C 400,152 396,158 390,162 C 384,166 378,172 372,178 C 366,186 360,194 356,202 C 352,212 348,222 342,232 C 336,242 330,250 324,256 C 318,260 310,262 302,264 C 294,266 286,264 280,260 C 274,256 268,250 264,244 C 260,238 256,234 250,232 C 244,232 238,234 232,238 C 226,242 220,244 214,244 C 208,244 202,242 198,238 C 192,234 186,230 180,226 C 174,220 168,214 162,208 C 156,202 150,196 144,190 C 138,182 132,174 126,166 C 120,158 114,150 108,142 C 102,134 96,126 92,118 C 88,110 84,102 80,94 C 88,88 98,84 108,86 C 112,88 116,90 120,90 Z';
const BALEARES_PATH = 'M 520,220 C 530,215 540,212 548,214 C 556,218 560,226 558,234 C 556,242 548,248 538,248 C 528,248 518,244 512,238 C 508,232 508,224 512,218 C 514,216 518,218 520,220 Z M 570,200 C 578,198 584,200 586,206 C 584,214 576,218 570,216 C 564,212 562,204 566,200 C 568,199 569,199 570,200 Z M 490,260 C 496,256 504,256 508,262 C 506,270 498,274 492,272 C 486,268 484,262 490,260 Z M 486,278 C 490,276 494,278 494,282 C 492,286 488,286 486,284 C 484,282 484,280 486,278 Z';

const GEO_BOUNDS = { north: 44.5, south: 35.5, west: -10.5, east: 3.8 };
const VIEWBOX = { width: 1000, height: 800 };

function geoToSvg(lat, lon) {
  const x = ((lon - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) * VIEWBOX.width;
  const y = ((GEO_BOUNDS.north - lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) * VIEWBOX.height;
  return { x: Math.round(x), y: Math.round(y) };
}
'''

content1 = re.sub(r'function project\(lon, lat\) \{.*?\return \[Math\.round\(x\), Math\.round\(y\)\];\s*\}', MAP_CONSTANTS, content1, flags=re.DOTALL)

STATIONS_REPLACEMENT = '''
const STATIONS = [
  { id: 'GRN', lat: 37.2661, lon: -3.658, name: 'Caparacena (Granada)', type: 'origin', activationTime: 0, desc: 'DISPARO RAÍZ — 12:32:57 CEST\\nTransformador 400/220 kV dispara por sobretensión\\nen colector 220 kV (242 kV = 1,10 p.u.)\\nPérdida: −355 MW, −165 MVAr\\n(ENTSO-E Factual, p.28)' },
  { id: 'BAD', lat: 38.88, lon: -6.97, name: 'Badajoz', type: 'lost', activationTime: 3, desc: '12:33:16 CEST (t=19s)\\nOleas de choque reactiva\\nCaída por colapso de tensión\\n−730 MW desconectados' },
  { id: 'SEV', lat: 37.3824, lon: -5.9126, name: 'Alcores (Sevilla)', type: 'lost', activationTime: 4, desc: '12:33:17 CEST (t=20s)\\nCascada sur: Sevilla + Huelva\\n−550 MW desconectados' },
  { id: 'SEG', lat: 40.95, lon: -4.12, name: 'Segovia', type: 'lost', activationTime: 4, desc: '12:33:17 CEST (t=20s)\\nCascada norte-centro\\nProtecciones ANSI 59 activas' },
  { id: 'ALM', lat: 39.8167, lon: -5.6833, name: 'C.N. Almaraz (Cáceres)', type: 'stable', activationTime: 0, desc: 'Central nuclear — Inercia síncrona\\n2 × 1.066 MW\\nResistió hasta el colapso final' },
  { id: 'MAD', lat: 40.31, lon: -3.5, name: 'Madrid Sur / Morata', type: 'stable', activationTime: 0, desc: 'Nudo central\\nFrecuencia cayó a 48,7 Hz\\nÚltimo punto de contención' },
  { id: 'ZAR', lat: 41.65, lon: -0.88, name: 'Nudo Aragón (Zaragoza)', type: 'stable', activationTime: 0, desc: 'Puente transpirenaico\\nIntentos de importación Francia' },
  { id: 'BAR', lat: 41.4833, lon: 2.0167, name: 'Rubí (Barcelona)', type: 'stable', activationTime: 0, desc: 'Resistencia este\\nConexión AC + HVDC con Francia\\nEstable hasta pérdida de sincronismo' },
  { id: 'LIS', lat: 38.7223, lon: -9.1393, name: 'Lisboa (REN)', type: 'portugal', activationTime: 5, desc: '12:33:10 CEST\\nOscilaciones inter-área 0,21 Hz\\nPortugal totalmente afectado' },
  { id: 'POR', lat: 41.1579, lon: -8.6291, name: 'Porto (REN)', type: 'portugal', activationTime: 0, desc: 'Red portuguesa\\nSufrió el colapso completo\\nBlack Start desde Castelo de Bode' },
  { id: 'FR', lat: 42.8, lon: 2.0, name: 'Interconexión Francia', type: 'france', activationTime: 8, desc: '12:33:21 CEST — Pérdida sincronismo\\nHVDC INELFE: 1.000 MW PMODE1\\nLineas AC: pico 3.800 MW\\n(ENTSO-E Factual, pp.12,108)' },
];
'''
content1 = re.sub(r'const STATIONS = \[.*?\];', STATIONS_REPLACEMENT, content1, flags=re.DOTALL)
content1 = re.sub(r'const x = s\.cx;\s*const y = s\.cy;', r'const {x, y} = geoToSvg(s.lat, s.lon);', content1)

PALETTE_CODE = '''
  const isDark = colorMode === 'dark';
  const palette = {
    landGradientStart: isDark ? '#142c4a' : '#f0ece1',
    landGradientEnd: isDark ? '#0b1827' : '#d6cebc',
    landStroke: isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(100, 116, 139, 0.3)',
    gridLine: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.04)',
    reliefLight: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
    reliefDark: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)',
  };
'''
content1 = re.sub(r'const \{ colorMode \} = useColorMode\(\);', r'const { colorMode } = useColorMode();\n' + PALETTE_CODE, content1)

SVG_BACKGROUND = '''
        <defs>
          <filter id="bp-glow-red">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="clip-iberia">
            <path d={IBERIA_PATH} />
            <path d={BALEARES_PATH} />
          </clipPath>
          <radialGradient id="landGrad" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </radialGradient>
          <filter id="relief" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor={palette.reliefDark} floodOpacity="0.6" />
          </filter>
        </defs>

        <g filter="url(#relief)" opacity={simTime >= 8 ? 0.4 : 1} style={{ transition: 'opacity 1s ease' }}>
          <path d={IBERIA_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
          <path d={BALEARES_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity={simTime >= 8 ? 0.2 : 0.5} style={{ transition: 'opacity 1s ease' }}>
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`rel-${i}`} d={`M ${80 + i * 40} ${60 + i * 25} C ${400 + i * 15} ${100 + i * 10}, ${600 - i * 20} ${500 - i * 15}, ${200 + i * 30} ${600 - i * 20}`} fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6" />
          ))}
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity={simTime >= 8 ? 0.2 : 0.6} style={{ transition: 'opacity 1s ease' }}>
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`grid-h-${i}`} x1={0} y1={(VIEWBOX.height / 12) * i} x2={VIEWBOX.width} y2={(VIEWBOX.height / 12) * i} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`grid-v-${i}`} x1={(VIEWBOX.width / 14) * i} y1={0} x2={(VIEWBOX.width / 14) * i} y2={VIEWBOX.height} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
        </g>
'''

content1 = re.sub(r'<svg\s*viewBox="0 0 800 600"', '<svg viewBox="0 0 1000 800"', content1)
content1 = re.sub(r'<defs>.*?</defs>\s*\{/\* Mapa definitivo \*/\}\s*<image.*?\/>', SVG_BACKGROUND, content1, flags=re.DOTALL)
content1 = re.sub(r'\{/\* Etiquetas geográficas \*/\}.*?(?=\{/\* ── ARCOS ── \*/\})', '', content1, flags=re.DOTALL)
content1 = re.sub(r'<rect width="800" height="560"', '<rect width="1000" height="800"', content1)
content1 = re.sub(r'x="400" y="290"', 'x="500" y="390"', content1)
content1 = re.sub(r'x="400" y="315"', 'x="500" y="415"', content1)
content1 = re.sub(r'if \(tx \+ tw > 780\) tx = node\.x - tw - 18;', r'if (tx + tw > 980) tx = node.x - tw - 18;', content1)

with open('src/components/BlackoutPropagationMapBase.jsx', 'w', encoding='utf-8') as f:
    f.write(content1)

with open('src/components/IberianGridTopologyBase.jsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = re.sub(r'function project\(lon, lat\) \{.*?\return \[Math\.round\(x\), Math\.round\(y\)\];\s*\}', MAP_CONSTANTS, content2, flags=re.DOTALL)
content2 = re.sub(r'const IBERIAN_PATH = `.*?`;', '', content2, flags=re.DOTALL)
content2 = re.sub(r'const PORTUGAL_PATH = `.*?`;', '', content2, flags=re.DOTALL)
content2 = re.sub(r'const \[x, y\] = project\(n\.lon, n\.lat\);', 'const {x, y} = geoToSvg(n.lat, n.lon);', content2)

PALETTE_CODE_2 = '''
  const isDark = true; // Topology is always dark-themed
  const palette = {
    landGradientStart: '#142c4a',
    landGradientEnd: '#0b1827',
    landStroke: 'rgba(56, 189, 248, 0.25)',
    gridLine: 'rgba(255, 255, 255, 0.03)',
    reliefLight: 'rgba(255, 255, 255, 0.04)',
    reliefDark: 'rgba(0, 0, 0, 0.2)',
  };
'''
content2 = re.sub(r'function TopologyContent\(.*?\) \{', r'function TopologyContent({ lang = "es" }) {\n' + PALETTE_CODE_2, content2)

SVG_BACKGROUND_2 = '''
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glowRed">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          
          <clipPath id="clip-iberia">
            <path d={IBERIA_PATH} />
            <path d={BALEARES_PATH} />
          </clipPath>
          <radialGradient id="landGrad" cx="45%" cy="45%" r="65%">
            <stop offset="0%" stopColor={palette.landGradientStart} />
            <stop offset="100%" stopColor={palette.landGradientEnd} />
          </radialGradient>
          <filter id="relief" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor={palette.reliefDark} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Mar de fondo */}
        <rect width="1000" height="800" fill="var(--bg-0, #050a14)" />
        <rect width="1000" height="800" fill="rgba(0,40,80,0.15)" />

        <g filter="url(#relief)">
          <path d={IBERIA_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
          <path d={BALEARES_PATH} fill="url(#landGrad)" stroke={palette.landStroke} strokeWidth="1.2" />
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity="0.5">
          {Array.from({ length: 18 }, (_, i) => (
            <path key={`rel-${i}`} d={`M ${80 + i * 40} ${60 + i * 25} C ${400 + i * 15} ${100 + i * 10}, ${600 - i * 20} ${500 - i * 15}, ${200 + i * 30} ${600 - i * 20}`} fill="none" stroke={palette.reliefLight} strokeWidth="1.8" strokeDasharray="8 6" />
          ))}
        </g>
        
        <g clipPath="url(#clip-iberia)" opacity="0.6">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`grid-h-${i}`} x1={0} y1={(VIEWBOX.height / 12) * i} x2={VIEWBOX.width} y2={(VIEWBOX.height / 12) * i} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`grid-v-${i}`} x1={(VIEWBOX.width / 14) * i} y1={0} x2={(VIEWBOX.width / 14) * i} y2={VIEWBOX.height} stroke={palette.gridLine} strokeWidth="0.8" />
          ))}
        </g>
'''

content2 = re.sub(r'<svg\s*viewBox="0 0 800 560"', '<svg viewBox="0 0 1000 800"', content2)
content2 = re.sub(r'<defs>.*?</defs>.*?\{/\* Contorno Península Ibérica \*/\}.*?/>', SVG_BACKGROUND_2, content2, flags=re.DOTALL)
content2 = re.sub(r'\{/\* Etiqueta "FRANCE" \*/\}.*?(?=\{/\* ── LINKS)', '', content2, flags=re.DOTALL)
content2 = re.sub(r'let tx = node\.x \+ 18;\s*if \(tx \+ tw > 790\) tx = node\.x - tw - 18;', r'let tx = node.x + 18;\n          if (tx + tw > 990) tx = node.x - tw - 18;', content2)

with open('src/components/IberianGridTopologyBase.jsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print("Maps updated successfully.")
