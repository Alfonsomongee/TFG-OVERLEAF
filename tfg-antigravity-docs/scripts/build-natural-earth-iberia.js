const fs = require('fs');
const path = require('path');

// =====================================================================
// CONFIGURACIÓN DE PROYECCIÓN Y BBOX
// =====================================================================
const MAP_VIEWBOX = {
  width: 1000,
  height: 800,
  lonMin: -10.5,
  lonMax: 5.5,
  latMin: 34.0,
  latMax: 46.0,
};

// BBox expandido para el filtrado en lat/lon (evita recortar anillos útiles en el borde)
const FILTER_BBOX = {
  lonMin: -12.0,
  lonMax: 7.0,
  latMin: 33.0,
  latMax: 47.0,
};

// Función de proyección lineal
function project(lon, lat) {
  const x = ((lon - MAP_VIEWBOX.lonMin) / (MAP_VIEWBOX.lonMax - MAP_VIEWBOX.lonMin)) * MAP_VIEWBOX.width;
  const y = ((MAP_VIEWBOX.latMax - lat) / (MAP_VIEWBOX.latMax - MAP_VIEWBOX.latMin)) * MAP_VIEWBOX.height;
  // Redondeamos a 2 decimales para ahorrar peso en el string final manteniendo precisión
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

// =====================================================================
// ALGORITMO DE SIMPLIFICACIÓN: DOUGLAS-PEUCKER
// =====================================================================
function getSqDist(p, p1, p2) {
  const x = p[0], y = p[1];
  const x1 = p1[0], y1 = p1[1];
  const x2 = p2[0], y2 = p2[1];

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx !== 0 || dy !== 0) {
    const t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      return Math.hypot(x - x2, y - y2) ** 2;
    } else if (t > 0) {
      return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)) ** 2;
    }
  }

  return Math.hypot(x - x1, y - y1) ** 2;
}

function douglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;

  let maxSqDist = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const sqDist = getSqDist(points[i], points[0], points[end]);
    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > epsilon * epsilon) {
    const results1 = douglasPeucker(points.slice(0, index + 1), epsilon);
    const results2 = douglasPeucker(points.slice(index), epsilon);
    return results1.slice(0, results1.length - 1).concat(results2);
  }

  return [points[0], points[end]];
}

// =====================================================================
// PARSERS NATIVOS DE ESRI SHAPEFILE (.SHP) Y DBASE III (.DBF)
// =====================================================================
function parseShp(filePath) {
  const buffer = fs.readFileSync(filePath);
  const fileCode = buffer.readInt32BE(0);
  if (fileCode !== 9994) {
    throw new Error(`Código de archivo SHP inválido: ${fileCode}`);
  }

  const fileLength = buffer.readInt32BE(24) * 2;
  const version = buffer.readInt32LE(28);
  const globalShapeType = buffer.readInt32LE(32);

  const geometries = [];
  let offset = 100;

  while (offset < buffer.length) {
    if (offset + 8 > buffer.length) break;
    
    const recordNumber = buffer.readInt32BE(offset);
    const contentLength = buffer.readInt32BE(offset + 4) * 2;
    const recordStart = offset + 8;
    
    if (recordStart + contentLength > buffer.length) break;
    
    const shapeType = buffer.readInt32LE(recordStart);
    
    if (shapeType === 3 || shapeType === 5) {
      // PolyLine (3) o Polygon (5)
      const minX = buffer.readDoubleLE(recordStart + 4);
      const minY = buffer.readDoubleLE(recordStart + 12);
      const maxX = buffer.readDoubleLE(recordStart + 20);
      const maxY = buffer.readDoubleLE(recordStart + 28);
      const numParts = buffer.readInt32LE(recordStart + 36);
      const numPoints = buffer.readInt32LE(recordStart + 40);
      
      const parts = [];
      let partsOffset = recordStart + 44;
      for (let p = 0; p < numParts; p++) {
        parts.push(buffer.readInt32LE(partsOffset + p * 4));
      }
      
      const points = [];
      let pointsOffset = partsOffset + numParts * 4;
      for (let pt = 0; pt < numPoints; pt++) {
        const x = buffer.readDoubleLE(pointsOffset + pt * 16);
        const y = buffer.readDoubleLE(pointsOffset + pt * 16 + 8);
        points.push([x, y]);
      }
      
      geometries.push({
        recordNumber,
        shapeType,
        bbox: { minX, minY, maxX, maxY },
        parts,
        points
      });
    } else if (shapeType === 1) {
      // Point (1)
      const x = buffer.readDoubleLE(recordStart + 4);
      const y = buffer.readDoubleLE(recordStart + 12);
      geometries.push({
        recordNumber,
        shapeType,
        point: [x, y]
      });
    } else {
      geometries.push({
        recordNumber,
        shapeType
      });
    }
    
    offset = recordStart + contentLength;
  }

  return geometries;
}

function parseDbf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);

  const fields = [];
  let offset = 32;

  while (offset < headerLength - 1) {
    if (buffer[offset] === 0x0D) break;
    const name = buffer.toString('ascii', offset, offset + 11).replace(/\0/g, '').trim();
    const type = String.fromCharCode(buffer[offset + 11]);
    const length = buffer[offset + 16];
    fields.push({ name, type, length });
    offset += 32;
  }

  const records = [];
  for (let i = 0; i < recordCount; i++) {
    const recordOffset = headerLength + i * recordLength;
    if (recordOffset + recordLength > buffer.length) break;
    if (buffer[recordOffset] === 0x2A) continue;

    const record = {};
    let fieldOffset = recordOffset + 1;

    for (const field of fields) {
      let val = buffer.toString('utf8', fieldOffset, fieldOffset + field.length);
      val = val.replace(/\0/g, '').trim();
      record[field.name] = val;
      fieldOffset += field.length;
    }
    records.push(record);
  }

  return records;
}

function loadLayer(layerDirName) {
  const layerPath = path.join(__dirname, '../../data/cartography/natural-earth/unzipped', layerDirName);
  const shpFile = path.join(layerPath, `${layerDirName}.shp`);
  const dbfFile = path.join(layerPath, `${layerDirName}.dbf`);

  if (!fs.existsSync(shpFile) || !fs.existsSync(dbfFile)) {
    throw new Error(`Archivos de capa no encontrados en: ${layerPath}`);
  }

  const geoms = parseShp(shpFile);
  const dbfRows = parseDbf(dbfFile);

  return geoms.map((geom, idx) => ({
    properties: dbfRows[idx],
    geometry: geom
  }));
}

// =====================================================================
// FILTRADO, PROYECCIÓN, SIMPLIFICACIÓN Y FILTRADO POR TAMAÑO
// =====================================================================
function isBBoxIntersecting(bbox1, bbox2) {
  return !(bbox1.maxX < bbox2.lonMin || bbox1.minX > bbox2.lonMax ||
           bbox1.maxY < bbox2.latMin || bbox1.minY > bbox2.latMax);
}

function processPolygonOrPolyLine(geom, epsilon, minSizePx = 3) {
  const paths = [];
  let totalRawVertices = 0;
  let totalSimVertices = 0;

  for (let p = 0; p < geom.parts.length; p++) {
    const start = geom.parts[p];
    const end = (p === geom.parts.length - 1) ? geom.points.length : geom.parts[p + 1];
    const partPoints = geom.points.slice(start, end);
    totalRawVertices += partPoints.length;

    // Bounding Box del anillo
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [lon, lat] of partPoints) {
      if (lon < minX) minX = lon;
      if (lon > maxX) maxX = lon;
      if (lat < minY) minY = lat;
      if (lat > maxY) maxY = lat;
    }

    if (!isBBoxIntersecting({ minX, minY, maxX, maxY }, FILTER_BBOX)) {
      continue;
    }

    // Proyectar
    const projected = partPoints.map(([lon, lat]) => project(lon, lat));

    // Simplificar
    const simplified = douglasPeucker(projected, epsilon);

    // Filtrar islotes/líneas diminutas en pantalla
    if (minSizePx > 0 && simplified.length > 0) {
      let pMinX = Infinity, pMinY = Infinity, pMaxX = -Infinity, pMaxY = -Infinity;
      for (const [x, y] of simplified) {
        if (x < pMinX) pMinX = x;
        if (x > pMaxX) pMaxX = x;
        if (y < pMinY) pMinY = y;
        if (y > pMaxY) pMaxY = y;
      }
      const w = pMaxX - pMinX;
      const h = pMaxY - pMinY;
      if (w < minSizePx && h < minSizePx) {
        continue;
      }
    }

    totalSimVertices += simplified.length;

    if (simplified.length > 1) {
      const pathStr = simplified.map((pt, idx) => {
        return `${idx === 0 ? 'M' : 'L'} ${pt[0]},${pt[1]}`;
      }).join(' ') + (geom.shapeType === 5 ? ' Z' : '');
      paths.push(pathStr);
    }
  }

  return { paths, rawCount: totalRawVertices, simCount: totalSimVertices };
}

// =====================================================================
// EJECUCIÓN DEL FLUJO PRINCIPAL
// =====================================================================
function main() {
  console.log('Iniciando procesamiento cartográfico optimizado (Land omitido por redundancia)...');
  const stats = [];

  // 1. COSTAS (ne_10m_coastline)
  console.log('Procesando: ne_10m_coastline...');
  const coastlineLayer = loadLayer('ne_10m_coastline');
  const coastlinePaths = [];
  let coastRaw = 0, coastSim = 0;

  for (const feat of coastlineLayer) {
    if (isBBoxIntersecting(feat.geometry.bbox, FILTER_BBOX)) {
      // Epsilon = 3.6px, minSize = 16px (suprime pequeñas irregularidades y pequeñas islas costeras)
      const res = processPolygonOrPolyLine(feat.geometry, 3.6, 16); 
      coastlinePaths.push(...res.paths);
      coastRaw += res.rawCount;
      coastSim += res.simCount;
    }
  }
  stats.push({ Layer: 'Coastline', Features: coastlinePaths.length, 'Vertices Before': coastRaw, 'Vertices After': coastSim, Reduction: `${((1 - coastSim / coastRaw) * 100).toFixed(1)}%` });

  // 2. TIERRA (ne_10m_land) -> Omitido y exportado como [] para cumplir con la meta de bajo peso.
  // Los polígonos de los países (capa Countries) ya cubren el fondo de tierra necesario con mayor interactividad.
  console.log('Omitiendo capa redundante ne_10m_land para reducir el peso...');
  const landPaths = [];
  stats.push({ Layer: 'Land (Omitida)', Features: 0, 'Vertices Before': 0, 'Vertices After': 0, Reduction: '100.0%' });

  // 3. PAÍSES (ne_10m_admin_0_countries)
  console.log('Procesando: ne_10m_admin_0_countries...');
  const countriesLayer = loadLayer('ne_10m_admin_0_countries');
  const countryPaths = {};
  const targetCountries = {
    'ESP': 'España',
    'PRT': 'Portugal',
    'FRA': 'Francia',
    'MAR': 'Marruecos',
    'AND': 'Andorra'
  };
  let countriesRaw = 0, countriesSim = 0;

  for (const feat of countriesLayer) {
    const code = (feat.properties.ADM0_A3 || feat.properties.adm0_a3 || '').toUpperCase();
    if (targetCountries[code]) {
      // Epsilon = 2.4px, minSize = 10px
      const res = processPolygonOrPolyLine(feat.geometry, 2.4, 10);
      if (res.paths.length > 0) {
        countryPaths[code] = {
          name: targetCountries[code],
          paths: res.paths
        };
        countriesRaw += res.rawCount;
        countriesSim += res.simCount;
      }
    }
  }
  stats.push({ Layer: 'Countries', Features: Object.keys(countryPaths).length, 'Vertices Before': countriesRaw, 'Vertices After': countriesSim, Reduction: `${((1 - countriesSim / countriesRaw) * 100).toFixed(1)}%` });

  // 4. FRONTERAS (ne_10m_admin_0_boundary_lines_land)
  console.log('Procesando: ne_10m_admin_0_boundary_lines_land...');
  const bordersLayer = loadLayer('ne_10m_admin_0_boundary_lines_land');
  const borderPaths = [];
  let borderRaw = 0, borderSim = 0;

  for (const feat of bordersLayer) {
    if (isBBoxIntersecting(feat.geometry.bbox, FILTER_BBOX)) {
      // Epsilon = 2.0px, minSize = 8px
      const res = processPolygonOrPolyLine(feat.geometry, 2.0, 8);
      borderPaths.push(...res.paths);
      borderRaw += res.rawCount;
      borderSim += res.simCount;
    }
  }
  stats.push({ Layer: 'Borders', Features: borderPaths.length, 'Vertices Before': borderRaw, 'Vertices After': borderSim, Reduction: `${((1 - borderSim / borderRaw) * 100).toFixed(1)}%` });

  // 5. PROVINCIAS (ne_10m_admin_1_states_provinces)
  console.log('Procesando: ne_10m_admin_1_states_provinces...');
  const provincesLayer = loadLayer('ne_10m_admin_1_states_provinces');
  const admin1Paths = [];
  const admin1DetailedPaths = [];
  let admin1Raw = 0, admin1Sim = 0;
  let admin1DetailedRaw = 0, admin1DetailedSim = 0;
  const detailedAdmin1Countries = new Set(['ES', 'PT', 'FR', 'MA']);
  const excludedAdmin1Names = new Set([
    'Canarias',
    'Las Palmas',
    'Santa Cruz de Tenerife',
    'Ceuta',
    'Melilla',
    'Madeira',
    'Azores',
    'Guyane française',
    'French Guiana'
  ]);

  for (const feat of provincesLayer) {
    const countryIso = (feat.properties.iso_a2 || feat.properties.ISO_A2 || '').toUpperCase();
    if (countryIso === 'ES' || countryIso === 'PT') {
      const name = feat.properties.name || feat.properties.NAME || '';
      
      // Exclusión estricta de Canarias
      if (name.includes('Canarias') || name.includes('Palmas') || name.includes('Tenerife')) {
        continue;
      }

      if (isBBoxIntersecting(feat.geometry.bbox, FILTER_BBOX)) {
        // Epsilon = 4.0px, minSize = 14px (simplificación fuerte de fronteras provinciales internas)
        const res = processPolygonOrPolyLine(feat.geometry, 4.0, 14);
        if (res.paths.length > 0) {
          admin1Paths.push({
            id: feat.properties.iso_3166_2 || feat.properties.code_hasc || feat.properties.adm1_code || '',
            name: name,
            country: countryIso,
            region: feat.properties.region || feat.properties.region_cod || '',
            paths: res.paths
          });
          admin1Raw += res.rawCount;
          admin1Sim += res.simCount;
        }
      }
    }
  }
  stats.push({ Layer: 'Admin 1 (Provinces)', Features: admin1Paths.length, 'Vertices Before': admin1Raw, 'Vertices After': admin1Sim, Reduction: `${((1 - admin1Sim / admin1Raw) * 100).toFixed(1)}%` });

  for (const feat of provincesLayer) {
    const countryIso = (feat.properties.iso_a2 || feat.properties.ISO_A2 || '').toUpperCase();
    if (!detailedAdmin1Countries.has(countryIso)) continue;

    const name = feat.properties.name || feat.properties.NAME || '';
    if (excludedAdmin1Names.has(name)) continue;
    if (!isBBoxIntersecting(feat.geometry.bbox, FILTER_BBOX)) continue;

    const res = processPolygonOrPolyLine(feat.geometry, 3.0, 12);
    if (res.paths.length === 0) continue;

    const sourceId = feat.properties.iso_3166_2 || feat.properties.code_hasc || feat.properties.adm1_code || '';
    const nameEn = feat.properties.name_en || feat.properties.NAME_EN || name;
    const adm0A3 = feat.properties.adm0_a3 || feat.properties.ADM0_A3 || '';
    const postal = feat.properties.postal || feat.properties.POSTAL || '';
    const type = feat.properties.type || feat.properties.TYPE || '';
    const typeEn = feat.properties.type_en || feat.properties.TYPE_EN || type;
    const region = feat.properties.region || feat.properties.region_cod || '';
    const regionCode = feat.properties.region_cod || '';

    res.paths.forEach((pathStr, partIndex) => {
      admin1DetailedPaths.push({
        id: `${sourceId || `${countryIso}-${admin1DetailedPaths.length + 1}`}${res.paths.length > 1 ? `-${partIndex + 1}` : ''}`,
        source_id: sourceId,
        name,
        name_en: nameEn,
        country: countryIso,
        iso_a2: countryIso,
        adm0_a3: adm0A3,
        postal,
        type,
        type_en: typeEn,
        region,
        region_code: regionCode,
        path: pathStr
      });
    });

    admin1DetailedRaw += res.rawCount;
    admin1DetailedSim += res.simCount;
  }
  stats.push({ Layer: 'Admin 1 detailed metadata', Features: admin1DetailedPaths.length, 'Vertices Before': admin1DetailedRaw, 'Vertices After': admin1DetailedSim, Reduction: `${((1 - admin1DetailedSim / admin1DetailedRaw) * 100).toFixed(1)}%` });

  // 6. CIUDADES (ne_10m_populated_places)
  console.log('Procesando: ne_10m_populated_places...');
  const placesLayer = loadLayer('ne_10m_populated_places');
  const targetCities = {
    'madrid': { name: 'Madrid', country: 'ESP' },
    'barcelona': { name: 'Barcelona', country: 'ESP' },
    'valencia': { name: 'Valencia', country: 'ESP' },
    'sevilla': { name: 'Sevilla', country: 'ESP' },
    'seville': { name: 'Sevilla', country: 'ESP' },
    'bilbao': { name: 'Bilbao', country: 'ESP' },
    'zaragoza': { name: 'Zaragoza', country: 'ESP' },
    'málaga': { name: 'Málaga', country: 'ESP' },
    'malaga': { name: 'Málaga', country: 'ESP' },
    'granada': { name: 'Granada', country: 'ESP' },
    'lisbon': { name: 'Lisboa', country: 'PRT' },
    'lisboa': { name: 'Lisboa', country: 'PRT' },
    'porto': { name: 'Oporto', country: 'PRT' },
    'oporto': { name: 'Oporto', country: 'PRT' },
    'toulouse': { name: 'Toulouse', country: 'FRA' },
    'bordeaux': { name: 'Burdeos', country: 'FRA' },
    'montpellier': { name: 'Montpellier', country: 'FRA' },
    'rabat': { name: 'Rabat', country: 'MAR' },
    'casablanca': { name: 'Casablanca', country: 'MAR' }
  };
  const cityPoints = [];
  const processedCities = new Set();

  for (const feat of placesLayer) {
    const name = (feat.properties.NAME || feat.properties.name || feat.properties.NAMEASCII || '').toLowerCase();
    const cityConfig = targetCities[name];
    if (cityConfig) {
      const cityKey = `${cityConfig.country}-${cityConfig.name}`;
      if (processedCities.has(cityKey)) continue;
      
      const lon = parseFloat(feat.properties.LONGITUDE || feat.properties.longitude || feat.geometry.point[0]);
      const lat = parseFloat(feat.properties.LATITUDE || feat.properties.latitude || feat.geometry.point[1]);
      
      if (lon >= MAP_VIEWBOX.lonMin && lon <= MAP_VIEWBOX.lonMax &&
          lat >= MAP_VIEWBOX.latMin && lat <= MAP_VIEWBOX.latMax) {
        
        const [x, y] = project(lon, lat);
        cityPoints.push({
          name: cityConfig.name,
          country: cityConfig.country,
          lat: Math.round(lat * 1000) / 1000,
          lon: Math.round(lon * 1000) / 1000,
          x,
          y
        });
        processedCities.add(cityKey);
      }
    }
  }
  stats.push({ Layer: 'Cities', Features: cityPoints.length, 'Vertices Before': cityPoints.length, 'Vertices After': cityPoints.length, Reduction: '0.0%' });

  // =====================================================================
  // ESCRITURA DE RESULTADOS
  // =====================================================================
  const outDir = path.join(__dirname, '../src/data/cartography');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. ARCHIVO JS
  const jsOutFile = path.join(outDir, 'naturalEarthIberiaPaths.js');
  const jsContent = `/**
 * DATASET CARTOGRÁFICO DE ALTA FIDELIDAD PARA LA PENÍNSULA IBÉRICA
 * Generado automáticamente a partir de Natural Earth (Escala 1:10m)
 * 
 * Bounding Box: Lon [${MAP_VIEWBOX.lonMin}, ${MAP_VIEWBOX.lonMax}], Lat [${MAP_VIEWBOX.latMin}, ${MAP_VIEWBOX.latMax}]
 * Proyección: Lineal / Equirrectangular (Plate Carrée)
 * ViewBox: 0 0 1000 800
 */

export const MAP_VIEWBOX = ${JSON.stringify(MAP_VIEWBOX, null, 2)};

export const LAND_PATHS = ${JSON.stringify(landPaths, null, 2)};

export const COUNTRY_PATHS = ${JSON.stringify(countryPaths, null, 2)};

export const BORDER_PATHS = ${JSON.stringify(borderPaths, null, 2)};

export const ADMIN1_PATHS = ${JSON.stringify(admin1Paths, null, 2)};

export const COASTLINE_PATHS = ${JSON.stringify(coastlinePaths, null, 2)};

export const CITY_POINTS = ${JSON.stringify(cityPoints, null, 2)};
`;

  fs.writeFileSync(jsOutFile, jsContent, 'utf8');
  console.log(`Archivo de datos JS generado con éxito en: ${jsOutFile}`);

  const admin1JsOutFile = path.join(outDir, 'naturalEarthIberiaAdmin1Paths.js');
  const admin1JsContent = `/**
 * DATASET ADMIN 1 NATURAL EARTH PARA LA PENÍNSULA IBÉRICA
 * Generado automáticamente a partir de ne_10m_admin_1_states_provinces.
 *
 * Bounding Box: Lon [${MAP_VIEWBOX.lonMin}, ${MAP_VIEWBOX.lonMax}], Lat [${MAP_VIEWBOX.latMin}, ${MAP_VIEWBOX.latMax}]
 * Proyección: Lineal / Equirrectangular (Plate Carrée)
 * ViewBox: 0 0 1000 800
 */

export const ADMIN1_FEATURES = ${JSON.stringify(admin1DetailedPaths, null, 2)};

export const ADMIN1_SOURCE = {
  name: 'Natural Earth Admin 1 - States, Provinces',
  scale: '10m',
  layer: 'ne_10m_admin_1_states_provinces',
  countries: ['ES', 'PT', 'FR', 'MA']
};
`;

  fs.writeFileSync(admin1JsOutFile, admin1JsContent, 'utf8');
  console.log(`Archivo Admin 1 con metadatos generado con éxito en: ${admin1JsOutFile}`);

  // 2. ARCHIVO PREVIEW SVG
  const svgOutFile = path.join(outDir, 'naturalEarthIberiaPreview.svg');
  // preview dibuja land vacío o podemos usar los países
  const countryMarkup = Object.keys(countryPaths).map(code => {
    const c = countryPaths[code];
    let color = '#fef08a';
    if (code === 'PRT') color = '#bbf7d0';
    if (code === 'FRA') color = '#93c5fd';
    if (code === 'MAR') color = '#fca5a5';
    if (code === 'AND') color = '#ddd6fe';
    return c.paths.map(p => `<path d="${p}" fill="${color}" stroke="#cbd5e1" stroke-width="0.5" />`).join('\n    ');
  }).join('\n    ');
  
  const borderMarkup = borderPaths.map(p => `<path d="${p}" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 3" />`).join('\n    ');
  const coastlineMarkup = coastlinePaths.map(p => `<path d="${p}" fill="none" stroke="#2563eb" stroke-width="0.8" />`).join('\n    ');
  const admin1Markup = admin1Paths.map(p => p.paths.map(d => `<path d="${d}" fill="none" stroke="#94a3b8" stroke-width="0.3" opacity="0.6" />`).join('\n      ')).join('\n    ');
  
  const cityMarkup = cityPoints.map(c => {
    return `<g transform="translate(${c.x}, ${c.y})">
      <circle r="4" fill="#000" stroke="#fff" stroke-width="1.2" />
      <text x="7" y="3" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e293b">${c.name}</text>
    </g>`;
  }).join('\n    ');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800" width="100%" height="100%">
  <!-- Océano de fondo -->
  <rect width="1000" height="800" fill="#f0f9ff" />
  
  <!-- Rellenos nacionales (hacen de masa terrestre) -->
  <g id="countries">
    ${countryMarkup}
  </g>
  
  <!-- Divisiones administrativas de primer nivel (Provincias) -->
  <g id="admin1">
    ${admin1Markup}
  </g>
  
  <!-- Líneas costeras -->
  <g id="coastline">
    ${coastlineMarkup}
  </g>
  
  <!-- Fronteras políticas terrestres -->
  <g id="borders">
    ${borderMarkup}
  </g>
  
  <!-- Ciudades de referencia -->
  <g id="cities">
    ${cityMarkup}
  </g>
  
  <!-- Título y escala -->
  <rect x="15" y="15" width="420" height="90" rx="8" fill="white" opacity="0.9" stroke="#cbd5e1" stroke-width="1" />
  <text x="30" y="42" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Preview Cartográfico Iberia (Natural Earth 10m)</text>
  <text x="30" y="65" font-family="sans-serif" font-size="12" fill="#475569">ViewBox: 1000x800 | BBox: Lon [-10.5, 5.5], Lat [34.0, 46.0]</text>
  <text x="30" y="85" font-family="sans-serif" font-size="11" font-weight="bold" fill="#b91c1c">Fronteras Internacionales (Rojo Punteado) | Provincias (Gris Fino)</text>
</svg>
`;

  fs.writeFileSync(svgOutFile, svgContent, 'utf8');
  console.log(`Archivo de preview SVG generado con éxito en: ${svgOutFile}`);

  // =====================================================================
  // ESTADÍSTICAS FINALES
  // =====================================================================
  console.log('\n====================================================================');
  console.log('ESTADÍSTICAS DE PROCESAMIENTO');
  console.log('====================================================================');
  console.table(stats);
  
  const jsSize = fs.statSync(jsOutFile).size / 1024;
  const admin1JsSize = fs.statSync(admin1JsOutFile).size / 1024;
  const svgSize = fs.statSync(svgOutFile).size / 1024;
  console.log(`\nArchivo de datos final (.js): ${jsSize.toFixed(2)} KB`);
  console.log(`Archivo Admin 1 con metadatos (.js): ${admin1JsSize.toFixed(2)} KB`);
  console.log(`Archivo de preview final (.svg): ${svgSize.toFixed(2)} KB`);
  console.log('====================================================================\n');
}

main();
